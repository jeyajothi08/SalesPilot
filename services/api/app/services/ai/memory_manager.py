"""
SalesPilot AI — Redis-Backed Conversation Memory Manager

CRITICAL FIX: Replaces in-memory Python dict with Redis-backed storage.
- Persists across restarts and across multiple worker processes
- 24-hour TTL for automatic cleanup of idle sessions
- Falls back to in-memory if Redis is unavailable (dev mode)
"""
import json
import structlog
from typing import List

from langchain_core.messages import BaseMessage, HumanMessage, AIMessage, SystemMessage

logger = structlog.get_logger()

# In-memory fallback for when Redis is not available
_FALLBACK_MEMORY = {}
_redis_client = None

MAX_HISTORY = 20  # Keep last 20 messages per session
SESSION_TTL_SECONDS = 86400  # 24-hour expiry for idle sessions


def _get_redis():
    """Lazily initialise Redis client from settings."""
    global _redis_client
    if _redis_client is not None:
        return _redis_client
    try:
        import redis.asyncio as aioredis
        from app.core.config import settings
        _redis_client = aioredis.from_url(
            settings.REDIS_URL,
            encoding="utf-8",
            decode_responses=True,
            socket_connect_timeout=2,
        )
        return _redis_client
    except Exception as e:
        logger.warning("redis_unavailable", error=str(e), fallback="in-memory")
        return None


def _serialize_message(msg: BaseMessage) -> dict:
    """Convert a LangChain message to a JSON-serializable dict."""
    return {"type": type(msg).__name__, "content": msg.content}


def _deserialize_message(data: dict) -> BaseMessage:
    """Rebuild a LangChain message from a dict."""
    msg_type = data.get("type", "HumanMessage")
    content = data.get("content", "")
    mapping = {
        "HumanMessage": HumanMessage,
        "AIMessage": AIMessage,
        "SystemMessage": SystemMessage,
    }
    cls = mapping.get(msg_type, HumanMessage)
    return cls(content=content)


class MemoryManager:
    """
    Manages conversational memory for the AI Agent.
    Backed by Redis with in-memory fallback for development.
    """

    @staticmethod
    async def get_history(session_id: str) -> List[BaseMessage]:
        """Retrieve chat history for a given session."""
        redis = _get_redis()
        key = f"chat:session:{session_id}"

        if redis:
            try:
                raw = await redis.get(key)
                if raw:
                    data = json.loads(raw)
                    return [_deserialize_message(m) for m in data]
                return []
            except Exception as e:
                logger.error("redis_get_failed", key=key, error=str(e))

        # Fallback to in-memory
        return list(_FALLBACK_MEMORY.get(session_id, []))

    @staticmethod
    async def add_message(session_id: str, message: BaseMessage) -> None:
        """Add a message to the session's history with sliding-window truncation."""
        redis = _get_redis()
        key = f"chat:session:{session_id}"

        if redis:
            try:
                raw = await redis.get(key)
                history = json.loads(raw) if raw else []
                history.append(_serialize_message(message))
                # Sliding window: keep last MAX_HISTORY messages
                if len(history) > MAX_HISTORY:
                    history = history[-MAX_HISTORY:]
                await redis.set(key, json.dumps(history), ex=SESSION_TTL_SECONDS)
                return
            except Exception as e:
                logger.error("redis_set_failed", key=key, error=str(e))

        # Fallback to in-memory
        if session_id not in _FALLBACK_MEMORY:
            _FALLBACK_MEMORY[session_id] = []
        _FALLBACK_MEMORY[session_id].append(message)
        if len(_FALLBACK_MEMORY[session_id]) > MAX_HISTORY:
            _FALLBACK_MEMORY[session_id] = _FALLBACK_MEMORY[session_id][-MAX_HISTORY:]

    @staticmethod
    async def clear_history(session_id: str) -> None:
        """Clear the history for a given session."""
        redis = _get_redis()
        key = f"chat:session:{session_id}"

        if redis:
            try:
                await redis.delete(key)
                return
            except Exception as e:
                logger.error("redis_delete_failed", key=key, error=str(e))

        _FALLBACK_MEMORY.pop(session_id, None)
