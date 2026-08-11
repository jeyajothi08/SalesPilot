"""
SalesPilot AI — Public Demo Request Endpoint
"""
import uuid
import structlog
from typing import Optional
from fastapi import APIRouter, status, HTTPException
from pydantic import BaseModel, EmailStr, Field

logger = structlog.get_logger()

router = APIRouter()


class DemoRequest(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100, description="Prospect full name")
    email: EmailStr = Field(..., description="Prospect work email address")
    company_name: str = Field(..., min_length=2, max_length=120, description="Company name")
    message: Optional[str] = Field(None, max_length=2000, description="Requirements or message")
    use_case: Optional[str] = Field(None, max_length=100, description="Selected use case or interest area")


class DemoResponse(BaseModel):
    status: str
    message: str
    demo_request_id: str
    external_crm_connected: bool
    email_notification_sent: bool


@router.post("/request", response_model=DemoResponse, status_code=status.HTTP_201_CREATED)
async def submit_demo_request(request: DemoRequest):
    """
    Public endpoint to process demo requests from the landing page.
    Validates input, records the lead, and reports integration status.
    """
    request_id = str(uuid.uuid4())
    
    logger.info(
        "demo_request_received",
        request_id=request_id,
        full_name=request.full_name,
        email=request.email,
        company=request.company_name,
        has_message=bool(request.message)
    )

    # In production, this dispatches to background tasks (Celery/RQ) to push into CRM (Salesforce/HubSpot)
    # and send automated confirmation emails via SendGrid/SES.
    # Currently reporting clean integration status.
    return DemoResponse(
        status="success",
        message="Thank you! Your demo request has been successfully recorded. Our sales team will reach out to you shortly.",
        demo_request_id=request_id,
        external_crm_connected=False,
        email_notification_sent=False
    )
