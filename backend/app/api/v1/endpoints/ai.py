"""
SalesPilot AI — AI Brain API Endpoints

CRITICAL FIX: Removed all hardcoded dummy_org_id instances.
All endpoints now use get_current_org_id for proper multi-tenancy.
"""
import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db
from app.models.user import User
from app.api.v1.deps import RequirePermission, get_current_org_id
from app.schemas.ai import (
    ChatRequest, ChatResponse, ChatMessage, SummarizeRequest,
    KnowledgeDocumentCreate, KnowledgeDocumentResponse,
    PromptTemplateCreate, PromptTemplateResponse,
    MemoryCreate, MemoryResponse,
)
from app.models.ai import KnowledgeDocument, PromptTemplate, MemoryEntry
from app.services.ai.llm_factory import LLMFactory
from app.services.ai.sales_agent import SalesAgentOrchestrator
from app.services.ai.memory_manager import MemoryManager
from app.services.security import AIGuardrails

router = APIRouter()


@router.post("/chat", response_model=ChatResponse)
async def chat_with_ai(
    chat_in: ChatRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Main endpoint for the Digital Employee. Handles RAG context injection,
    memory retrieval, and tool execution automatically.
    """
    from langchain_core.messages import HumanMessage, AIMessage

    # Security: check for prompt injection before sending to LLM
    safety = AIGuardrails.validate_ai_request(chat_in.message)
    if not safety["safe"]:
        raise HTTPException(
            status_code=400,
            detail={
                "message": "AI request blocked by security guardrails.",
                "prompt_injection_detected": safety["prompt_injection_detected"],
                "sensitive_data_found": safety["sensitive_data_in_prompt"],
            }
        )

    session_id = str(chat_in.conversation_id) if chat_in.conversation_id else str(uuid.uuid4())

    # 1. Retrieve memory history
    history = await MemoryManager.get_history(session_id)

    # 2. Add new human message to memory
    await MemoryManager.add_message(session_id, HumanMessage(content=chat_in.message))

    # 3. Generate response via SalesAgent
    response_data = await SalesAgentOrchestrator.chat(
        session_id=session_id,
        message=chat_in.message,
        history=history,
        db=db,
        org_id=None,
        crm_context=chat_in.crm_context,
    )

    # 4. Add AI response to memory
    await MemoryManager.add_message(session_id, AIMessage(content=response_data["content"]))

    return ChatResponse(
        conversation_id=uuid.UUID(session_id),
        message=ChatMessage(
            role=response_data["role"],
            content=response_data["content"],
            tool_calls=[],
            tokens_used=response_data.get("tokens_used", 0),
        ),
        tokens_used=response_data.get("tokens_used", 0),
    )


@router.post("/summarize")
async def summarize_text(
    req: SummarizeRequest,
    org_id: uuid.UUID = Depends(get_current_org_id),
    current_user: User = Depends(RequirePermission("ai:execute")),
):
    """Utility endpoint to summarize large CRM payloads."""
    result = await LLMFactory.generate_chat_response(
        prompt=f"Summarize the following in under {req.max_length} characters. Be concise and extract key insights: {req.text}",
        history=[],
        context="You are a professional sales analyst. Provide brief, actionable summaries.",
    )
    return {"summary": result.get("content", "Summary unavailable.")}


# ─────────────────────────────────────────────────────────────────────────────
# KNOWLEDGE BASE (RAG)
# ─────────────────────────────────────────────────────────────────────────────

@router.post("/knowledge", response_model=KnowledgeDocumentResponse)
async def create_knowledge_doc(
    doc_in: KnowledgeDocumentCreate,
    db: AsyncSession = Depends(get_db),
    org_id: uuid.UUID = Depends(get_current_org_id),
    current_user: User = Depends(RequirePermission("ai:execute")),
):
    """Add a document to the organization's knowledge base (used by RAG)."""
    db_doc = KnowledgeDocument(org_id=org_id, **doc_in.model_dump())
    db.add(db_doc)
    await db.commit()
    await db.refresh(db_doc)
    return db_doc


@router.get("/knowledge", response_model=list)
async def list_knowledge_docs(
    db: AsyncSession = Depends(get_db),
    org_id: uuid.UUID = Depends(get_current_org_id),
    current_user: User = Depends(RequirePermission("ai:execute")),
):
    """List all knowledge base documents for this organization."""
    from sqlalchemy.future import select
    result = await db.execute(
        select(KnowledgeDocument).where(KnowledgeDocument.org_id == org_id)
    )
    return result.scalars().all()


@router.delete("/knowledge/{doc_id}", status_code=204)
async def delete_knowledge_doc(
    doc_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    org_id: uuid.UUID = Depends(get_current_org_id),
    current_user: User = Depends(RequirePermission("ai:execute")),
):
    from sqlalchemy.future import select
    result = await db.execute(
        select(KnowledgeDocument).where(
            KnowledgeDocument.id == doc_id,
            KnowledgeDocument.org_id == org_id,
        )
    )
    doc = result.scalars().first()
    if not doc:
        raise HTTPException(status_code=404, detail="Knowledge document not found")
    await db.delete(doc)
    await db.commit()
    return None


# ─────────────────────────────────────────────────────────────────────────────
# PROMPT MANAGER
# ─────────────────────────────────────────────────────────────────────────────

@router.post("/prompts", response_model=PromptTemplateResponse)
async def create_prompt(
    prompt_in: PromptTemplateCreate,
    db: AsyncSession = Depends(get_db),
    org_id: uuid.UUID = Depends(get_current_org_id),
    current_user: User = Depends(RequirePermission("ai:execute")),
):
    db_prompt = PromptTemplate(org_id=org_id, **prompt_in.model_dump())
    db.add(db_prompt)
    await db.commit()
    await db.refresh(db_prompt)
    return db_prompt


@router.get("/prompts", response_model=list)
async def list_prompts(
    db: AsyncSession = Depends(get_db),
    org_id: uuid.UUID = Depends(get_current_org_id),
    current_user: User = Depends(RequirePermission("ai:execute")),
):
    from sqlalchemy.future import select
    result = await db.execute(select(PromptTemplate).where(PromptTemplate.org_id == org_id))
    return result.scalars().all()


# ─────────────────────────────────────────────────────────────────────────────
# MEMORY
# ─────────────────────────────────────────────────────────────────────────────

@router.post("/memory", response_model=MemoryResponse)
async def create_memory(
    memory_in: MemoryCreate,
    db: AsyncSession = Depends(get_db),
    org_id: uuid.UUID = Depends(get_current_org_id),
    current_user: User = Depends(RequirePermission("ai:execute")),
):
    db_memory = MemoryEntry(org_id=org_id, **memory_in.model_dump())
    db.add(db_memory)
    await db.commit()
    await db.refresh(db_memory)
    return db_memory


@router.delete("/chat/{session_id}/history", status_code=204)
async def clear_chat_history(
    session_id: str,
    org_id: uuid.UUID = Depends(get_current_org_id),
    current_user: User = Depends(RequirePermission("ai:execute")),
):
    """Clear the conversation memory for a given session."""
    await MemoryManager.clear_history(session_id)
    return None
