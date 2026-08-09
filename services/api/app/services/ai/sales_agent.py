import uuid
import structlog
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

from langgraph.prebuilt import create_react_agent
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.tools import tool
from langchain_core.messages import BaseMessage, SystemMessage, HumanMessage, AIMessage

from app.services.ai.llm_factory import LLMFactory

logger = structlog.get_logger()

# -----------------------------------------------------------------------------
# SYSTEM PROMPT
# -----------------------------------------------------------------------------
SALES_AGENT_SYSTEM_PROMPT = """You are SalesPilot AI, a Senior Sales Executive and expert negotiator.
Your goal is to qualify leads, answer product questions accurately, and book meetings.

CORE RESPONSIBILITIES:
1. Lead Qualification: Ask for company size, budget, and timeline if not provided.
2. Product Recommendation: Align SalesPilot's features (AI Voice, WhatsApp, CRM) with the user's needs.
3. Meeting Scheduler: Always push for a meeting when buying intent is high.
4. CRM Updates: Use your tools to create leads or update deals when you gather new information.

TONE & STYLE:
- Professional yet conversational.
- Concise and persuasive.
- Never use placeholders. If you don't know something, ask clarifying questions.

TOOLS AVAILABLE:
You have access to tools that can interact with the CRM and calendar. USE THEM autonomously when appropriate.
For example, if a user gives you their name and email, immediately use `create_crm_lead`.
If they ask to book a meeting, use `book_meeting`.
"""

# -----------------------------------------------------------------------------
# TOOLS
# -----------------------------------------------------------------------------
@tool
def create_crm_lead(name: str, email: str, company: str = "Unknown", phone: str = "") -> str:
    """Use this tool to create a new lead in the CRM system when you collect contact information."""
    logger.info("tool_execution", tool="create_crm_lead", name=name, email=email)
    # Mocking DB call for now; in full implementation this would call CRMService
    return f"Successfully created lead for {name} ({email}) at {company}."

@tool
def update_deal_stage(deal_id: str, new_stage: str) -> str:
    """Use this tool to move a deal to a new stage (e.g., 'Qualified', 'Proposal', 'Won')."""
    logger.info("tool_execution", tool="update_deal_stage", deal_id=deal_id, new_stage=new_stage)
    return f"Deal {deal_id} successfully moved to {new_stage}."

@tool
def check_calendar_availability(date_str: str) -> str:
    """Use this tool to check available meeting slots for a specific date (YYYY-MM-DD)."""
    logger.info("tool_execution", tool="check_calendar_availability", date=date_str)
    return f"Available slots on {date_str}: 10:00 AM, 1:00 PM, 3:30 PM EST."

@tool
def book_meeting(name: str, email: str, datetime_str: str) -> str:
    """Use this tool to book a meeting slot."""
    logger.info("tool_execution", tool="book_meeting", name=name, datetime=datetime_str)
    return f"Meeting successfully booked for {name} on {datetime_str}. Confirmation sent to {email}."

@tool
def search_knowledge_base(query: str) -> str:
    """Use this tool to search the company knowledge base for pricing, FAQs, or technical documentation."""
    logger.info("tool_execution", tool="search_knowledge_base", query=query)
    if "pricing" in query.lower() or "cost" in query.lower():
        return "Starter Plan: $99/mo (500 Voice mins). Professional Plan: $299/mo (Unlimited Voice mins, WhatsApp)."
    if "integration" in query.lower() or "crm" in query.lower():
        return "SalesPilot integrates natively with Salesforce, HubSpot, and Pipedrive."
    return "SalesPilot offers 24/7 AI Voice Calling, WhatsApp automation, and automated email follow-ups."

AGENT_TOOLS = [
    create_crm_lead,
    update_deal_stage,
    check_calendar_availability,
    book_meeting,
    search_knowledge_base
]

# -----------------------------------------------------------------------------
# AGENT ORCHESTRATOR
# -----------------------------------------------------------------------------
class SalesAgentOrchestrator:
    
    @staticmethod
    def _build_agent():
        llm = LLMFactory.get_llm(provider="openai", model_name="gpt-4o-mini", temperature=0.3)
        agent = create_react_agent(llm, tools=AGENT_TOOLS, state_modifier=SALES_AGENT_SYSTEM_PROMPT)
        return agent

    @classmethod
    async def chat(cls, session_id: str, message: str, history: List[BaseMessage]) -> Dict[str, Any]:
        """
        Main entry point for chatting with the autonomous sales agent.
        """
        agent_executor = cls._build_agent()
        
        try:
            # Langchain's AgentExecutor has an ainvoke method for async execution
            response = await agent_executor.ainvoke({
                "messages": history + [HumanMessage(content=message)]
            })
            
            output_msg = response["messages"][-1]
            return {
                "role": "assistant",
                "content": output_msg.content,
            }
        except Exception as e:
            logger.error("agent_execution_failed", error=str(e), session_id=session_id)
            return {
                "role": "assistant",
                "content": "I apologize, but I am experiencing temporary technical difficulties. Can I help you with anything else while my systems recover?",
                "error": True
            }
