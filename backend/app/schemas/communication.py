from pydantic import BaseModel, ConfigDict, Field
from typing import Optional, List, Dict, Any
import uuid
from datetime import datetime

class OmniThreadBase(BaseModel):
    customer_id: uuid.UUID
    status: str = "open"
    ai_summary: Optional[str] = None

class OmniThreadCreate(OmniThreadBase):
    pass

class OmniThreadResponse(OmniThreadBase):
    id: uuid.UUID
    org_id: uuid.UUID
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)

class OmniMessageBase(BaseModel):
    thread_id: uuid.UUID
    direction: str # inbound, outbound
    channel: str # email, whatsapp, sms, livechat, voice
    sender: str
    recipient: str
    subject: Optional[str] = None
    body: str
    attachments: List[str] = []
    status: str = "received"
    provider_id: Optional[str] = None
    is_ai_generated: bool = False

class OmniMessageCreate(OmniMessageBase):
    pass

class OmniMessageResponse(OmniMessageBase):
    id: uuid.UUID
    org_id: uuid.UUID
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)
    
class LiveChatMessagePayload(BaseModel):
    sender: str
    body: str
    channel: str = "livechat"

# Legacy communication schemas
class EmailSendRequest(BaseModel):
    customer_id: uuid.UUID
    subject: str
    body: str
    tone: Optional[str] = "professional"
    use_ai_rewrite: Optional[bool] = False

class EmailGenerateRequest(BaseModel):
    goal: str
    tone: str = "professional"

class CampaignCreate(BaseModel):
    name: str
    channel: str = "email"
    audience_filters: Dict[str, Any] = {}
    scheduled_at: Optional[datetime] = None

class MessageResponse(BaseModel):
    message_id: uuid.UUID
    status: str
    provider_response: Optional[str] = None

class WhatsAppSendRequest(BaseModel):
    customer_id: uuid.UUID
    message: Optional[str] = None
    template_name: Optional[str] = None

class NotificationCreate(BaseModel):
    user_id: uuid.UUID
    title: str
    message: str

class NotificationResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    title: str
    message: str
    is_read: bool
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)
