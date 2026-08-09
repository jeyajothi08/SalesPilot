from pydantic import BaseModel
from typing import Optional
import uuid


class CallStartRequest(BaseModel):
    customer_id: uuid.UUID
    profile_id: uuid.UUID
    to_number: str
    context: Optional[str] = "You are following up on a recent proposal."


class CallResponse(BaseModel):
    call_id: uuid.UUID
    call_sid: Optional[str] = None
    status: str
    message: str


class TwilioWebhookResponse(BaseModel):
    # This is often returned as raw XML (TwiML) rather than JSON
    pass
