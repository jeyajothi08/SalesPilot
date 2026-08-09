from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
import uuid


class ChatMessage(BaseModel):
    role: str = Field(
        ..., description="The role of the message author: 'user', 'assistant', 'system'"
    )
    content: str
    tool_calls: Optional[List[Dict[str, Any]]] = None


class ChatRequest(BaseModel):
    conversation_id: Optional[uuid.UUID] = None
    message: str
    model: str = "gpt-4-turbo"
    use_rag: bool = True


class ChatResponse(BaseModel):
    conversation_id: uuid.UUID
    message: ChatMessage
    tokens_used: int


class MemoryCreate(BaseModel):
    customer_id: Optional[uuid.UUID] = None
    memory_type: str = "semantic"
    content: str


class MemoryResponse(MemoryCreate):
    id: uuid.UUID
    org_id: uuid.UUID
    
    model_config = {"from_attributes": True}


class PromptTemplateCreate(BaseModel):
    name: str
    template: str


class PromptTemplateResponse(PromptTemplateCreate):
    id: uuid.UUID
    org_id: uuid.UUID
    version: int
    
    model_config = {"from_attributes": True}


class KnowledgeDocumentCreate(BaseModel):
    title: str
    content: str
    source_url: Optional[str] = None


class KnowledgeDocumentResponse(KnowledgeDocumentCreate):
    id: uuid.UUID
    org_id: uuid.UUID
    
    model_config = {"from_attributes": True}


class SummarizeRequest(BaseModel):
    text: str
    max_length: int = 150
