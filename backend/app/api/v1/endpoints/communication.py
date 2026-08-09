"""
SalesPilot AI — Communication API Endpoints

CRITICAL FIXES:
- GET /messages: Added org_id filter (was returning ALL messages system-wide)
- All POST endpoints: org_id from get_current_org_id (not hardcoded)
- datetime.utcnow() → datetime.now(timezone.utc)
- Customer queries verify org ownership before sending messages
"""
import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.database.session import get_db
from app.models.user import User
from app.api.v1.deps import RequirePermission, get_current_org_id
from app.schemas.communication import (
    EmailSendRequest,
    EmailGenerateRequest,
    CampaignCreate,
    MessageResponse,
    WhatsAppSendRequest,
    NotificationCreate,
    NotificationResponse,
)
from app.models.communication import OutboundMessage, Campaign, Notification
from app.models.crm import Customer, Activity
from app.services.communication.email_provider import EmailProvider
from app.services.communication.whatsapp_provider import WhatsAppProvider
from app.services.ai.llm_factory import LLMFactory

router = APIRouter()


@router.get("/messages")
async def get_messages(
    skip: int = 0,
    limit: int = 50,
    channel: str = None,
    db: AsyncSession = Depends(get_db),
    org_id: uuid.UUID = Depends(get_current_org_id),
    current_user: User = Depends(RequirePermission("communication:read")),
):
    """List outbound messages for this organization. FIXED: filters by org_id."""
    query = select(OutboundMessage).where(
        OutboundMessage.org_id == org_id  # CRITICAL FIX: was missing this filter
    )
    if channel:
        query = query.where(OutboundMessage.channel == channel)
    query = query.order_by(OutboundMessage.created_at.desc()).offset(skip).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()


@router.post("/email/send", response_model=MessageResponse)
async def send_email(
    req: EmailSendRequest,
    db: AsyncSession = Depends(get_db),
    org_id: uuid.UUID = Depends(get_current_org_id),
    current_user: User = Depends(RequirePermission("communication:write")),
):
    """Send an email to a customer. Verifies customer belongs to this org."""
    # Verify customer belongs to this org (prevents cross-tenant messaging)
    result = await db.execute(
        select(Customer).where(Customer.id == req.customer_id, Customer.org_id == org_id)
    )
    customer = result.scalars().first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    if not customer.email:
        raise HTTPException(status_code=422, detail="Customer has no email address on file")

    final_body = req.body
    if req.use_ai_rewrite:
        ai_resp = await LLMFactory.generate_chat_response(
            prompt=f"Rewrite this email to be more {req.tone}: {req.body}",
            history=[],
        )
        final_body = ai_resp.get("content", req.body)

    provider_res = await EmailProvider.send_email(customer.email, req.subject, final_body)

    msg = OutboundMessage(
        org_id=org_id,
        customer_id=customer.id,
        channel="email",
        recipient=customer.email,
        subject=req.subject,
        body=final_body,
        status=provider_res["status"],
        provider_id=provider_res["provider_id"],
        sent_at=datetime.now(timezone.utc),  # FIXED: was datetime.utcnow()
    )
    db.add(msg)

    # Log to CRM Timeline
    activity = Activity(
        org_id=org_id,
        customer_id=customer.id,
        activity_type="email_sent",
        title=f"Email: {req.subject}",
        description=final_body[:500],
    )
    db.add(activity)
    await db.commit()
    await db.refresh(msg)

    return MessageResponse(
        message_id=msg.id, status=msg.status, provider_response=msg.provider_id
    )


@router.post("/email/generate")
async def generate_email(
    req: EmailGenerateRequest,
    org_id: uuid.UUID = Depends(get_current_org_id),
    current_user: User = Depends(RequirePermission("communication:write")),
):
    """Generate AI-written email copy without sending. Frontend can preview and edit."""
    ai_resp = await LLMFactory.generate_chat_response(
        prompt=(
            f"Write a professional sales email. Goal: {req.goal}. "
            f"Tone: {req.tone}. Include a subject line starting with 'Subject:' "
            f"on the first line, then a blank line, then the email body."
        ),
        history=[],
    )
    content = ai_resp.get("content", "")
    lines = content.split("\n", 2)
    subject = lines[0].replace("Subject:", "").strip() if lines else "Following up"
    body = "\n".join(lines[2:]).strip() if len(lines) > 2 else content

    return {"generated_subject": subject, "generated_body": body}


@router.post("/campaign/create")
async def create_campaign(
    req: CampaignCreate,
    db: AsyncSession = Depends(get_db),
    org_id: uuid.UUID = Depends(get_current_org_id),
    current_user: User = Depends(RequirePermission("communication:write")),
):
    """Create an email/WhatsApp/SMS campaign for this organization."""
    campaign = Campaign(
        org_id=org_id,
        name=req.name,
        channel=req.channel,
        audience_filters=req.audience_filters,
        scheduled_at=req.scheduled_at,
        status="scheduled" if req.scheduled_at else "draft",
    )
    db.add(campaign)
    await db.commit()
    await db.refresh(campaign)
    return {"message": "Campaign created", "campaign_id": campaign.id, "status": campaign.status}


@router.post("/whatsapp/send", response_model=MessageResponse)
async def send_whatsapp(
    req: WhatsAppSendRequest,
    db: AsyncSession = Depends(get_db),
    org_id: uuid.UUID = Depends(get_current_org_id),
    current_user: User = Depends(RequirePermission("communication:write")),
):
    """Send a WhatsApp message to a customer. Verifies customer belongs to this org."""
    result = await db.execute(
        select(Customer).where(Customer.id == req.customer_id, Customer.org_id == org_id)
    )
    customer = result.scalars().first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    if not customer.phone:
        raise HTTPException(status_code=422, detail="Customer has no phone number on file")

    text = req.message or f"[Template: {req.template_name}]"
    provider_res = await WhatsAppProvider.send_message(to_phone=customer.phone, text=text)

    msg = OutboundMessage(
        org_id=org_id,
        customer_id=customer.id,
        channel="whatsapp",
        recipient=customer.phone,
        body=text,
        status=provider_res["status"],
        provider_id=provider_res["provider_id"],
        sent_at=datetime.now(timezone.utc),  # FIXED: was datetime.utcnow()
    )
    db.add(msg)
    await db.commit()
    await db.refresh(msg)
    return MessageResponse(message_id=msg.id, status=msg.status, provider_response=msg.provider_id)


@router.post("/notifications", response_model=NotificationResponse)
async def create_notification(
    req: NotificationCreate,
    db: AsyncSession = Depends(get_db),
    org_id: uuid.UUID = Depends(get_current_org_id),
    current_user: User = Depends(RequirePermission("communication:write")),
):
    notification = Notification(
        org_id=org_id,
        user_id=req.user_id,
        title=req.title,
        message=req.message,
        is_read=False,
    )
    db.add(notification)
    await db.commit()
    await db.refresh(notification)
    return notification


@router.get("/notifications")
async def list_notifications(
    unread_only: bool = False,
    db: AsyncSession = Depends(get_db),
    org_id: uuid.UUID = Depends(get_current_org_id),
    current_user: User = Depends(RequirePermission("communication:read")),
):
    """List notifications for the current user."""
    query = select(Notification).where(
        Notification.org_id == org_id,
        Notification.user_id == current_user.id,
    )
    if unread_only:
        query = query.where(Notification.is_read == False)
    result = await db.execute(query.order_by(Notification.created_at.desc()).limit(50))
    return result.scalars().all()


@router.patch("/notifications/{notification_id}/read")
async def mark_notification_read(
    notification_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    org_id: uuid.UUID = Depends(get_current_org_id),
    current_user: User = Depends(RequirePermission("communication:read")),
):
    result = await db.execute(
        select(Notification).where(
            Notification.id == notification_id,
            Notification.user_id == current_user.id,
            Notification.org_id == org_id,
        )
    )
    notif = result.scalars().first()
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")
    notif.is_read = True
    await db.commit()
    return {"status": "marked_read"}
