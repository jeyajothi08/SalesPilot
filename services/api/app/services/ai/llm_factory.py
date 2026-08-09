import structlog
from typing import Any, Dict
from tenacity import retry, stop_after_attempt, wait_exponential

from langchain_core.messages import BaseMessage
from langchain_openai import ChatOpenAI
from langchain_anthropic import ChatAnthropic
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.language_models.chat_models import BaseChatModel

logger = structlog.get_logger()

class LLMFactory:
    """
    Factory for instantiating LangChain chat models with multi-provider support,
    retry logic, and rate limit protection.
    """

    @staticmethod
    def get_llm(provider: str = "openai", model_name: str = "gpt-4o-mini", temperature: float = 0.7) -> BaseChatModel:
        if provider == "openai":
            return ChatOpenAI(model=model_name, temperature=temperature)
        elif provider == "anthropic":
            return ChatAnthropic(model=model_name, temperature=temperature)
        elif provider == "gemini":
            return ChatGoogleGenerativeAI(model=model_name, temperature=temperature)
        elif provider == "local":
            # For Local LLM (e.g. Ollama)
            from langchain_community.chat_models import ChatOllama
            return ChatOllama(model=model_name, temperature=temperature)
        else:
            raise ValueError(f"Unsupported LLM provider: {provider}")

    @staticmethod
    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=10),
        reraise=True
    )
    async def generate_chat_response_with_retry(llm: BaseChatModel, messages: list[BaseMessage]) -> BaseMessage:
        """
        Executes a chat request with automatic exponential backoff retries.
        """
        try:
            return await llm.ainvoke(messages)
        except Exception as e:
            logger.error("llm_invocation_failed", error=str(e), model=llm._llm_type)
            raise e

    @staticmethod
    async def generate_chat_response(
        prompt: str, history: list, context: str = "", provider: str = "openai", model_name: str = "gpt-4o-mini"
    ) -> Dict[str, Any]:
        """
        Legacy mock wrapper adapted for simple text invocation.
        Use `sales_agent.py` for full agentic tool-calling.
        """
        from langchain_core.messages import HumanMessage, SystemMessage
        
        llm = LLMFactory.get_llm(provider, model_name)
        
        messages = []
        if context:
            messages.append(SystemMessage(content=f"Context:\n{context}"))
            
        messages.extend(history)
        messages.append(HumanMessage(content=prompt))
        
        response = await LLMFactory.generate_chat_response_with_retry(llm, messages)
        
        return {
            "role": "assistant",
            "content": response.content,
            "tool_calls": [],
            "tokens_used": response.response_metadata.get("token_usage", {}).get("total_tokens", 0) if hasattr(response, "response_metadata") else 0,
        }
