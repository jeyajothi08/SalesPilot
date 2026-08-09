import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from fastapi import HTTPException
from sqlalchemy.orm import selectinload
from app.models.communication import OmniThread, OmniMessage
from app.schemas.communication import OmniThreadCreate, OmniMessageCreate
from app.services.communication.email_whatsapp_service import email_wa_service
from app.services.communication.voice_service import voice_service

class OmniInboxService:
    @staticmethod
    async def create_thread(db: AsyncSession, org_id: uuid.UUID, thread_in: OmniThreadCreate) -> OmniThread:
        db_thread = OmniThread(org_id=org_id, **thread_in.model_dump())
        db.add(db_thread)
        await db.commit()
        await db.refresh(db_thread)
        return db_thread

    @staticmethod
    async def get_threads(db: AsyncSession, org_id: uuid.UUID, skip: int = 0, limit: int = 100):
        result = await db.execute(select(OmniThread).where(OmniThread.org_id == org_id).offset(skip).limit(limit))
        return result.scalars().all()

    @staticmethod
    async def get_thread_messages(db: AsyncSession, org_id: uuid.UUID, thread_id: uuid.UUID):
        result = await db.execute(select(OmniMessage).where(
            OmniMessage.org_id == org_id, 
            OmniMessage.thread_id == thread_id
        ).order_by(OmniMessage.created_at.asc()))
        return result.scalars().all()

    @staticmethod
    async def send_message(db: AsyncSession, org_id: uuid.UUID, message_in: OmniMessageCreate) -> OmniMessage:
        # Save to DB
        db_msg = OmniMessage(org_id=org_id, **message_in.model_dump())
        db.add(db_msg)
        
        # Trigger actual external API calls based on channel
        if message_in.channel == "email":
            response = await email_wa_service.send_email(
                to_email=message_in.recipient,
                subject=message_in.subject or "Message from SalesPilot",
                body=message_in.body
            )
            db_msg.provider_id = response.get("provider_id")
        elif message_in.channel == "whatsapp":
            response = await email_wa_service.send_whatsapp(
                to_number=message_in.recipient,
                message=message_in.body
            )
            db_msg.provider_id = response.get("provider_id")
        elif message_in.channel == "voice" and message_in.direction == "outbound":
            # Just initiating a call, body can contain context/instructions
            response = await voice_service.initiate_outbound_call(
                db=db,
                org_id=org_id,
                to_number=message_in.recipient,
                from_number=message_in.sender
            )
            db_msg.provider_id = response.get("call_sid")
        
        await db.commit()
        await db.refresh(db_msg)
        
        # We also trigger CRM sync and AI Intelligence hooks
        # In a real app this would be a background task (Celery)
        # e.g., celery.send_task("process_inbound_message", args=[db_msg.id])
        
        return db_msg

    @staticmethod
    async def receive_inbound_message(db: AsyncSession, org_id: uuid.UUID, thread_id: uuid.UUID, payload: dict) -> OmniMessage:
        # Payload comes from webhooks (Twilio, Meta)
        # We create the message and run AI Intelligence
        
        message_in = OmniMessageCreate(
            thread_id=thread_id,
            direction="inbound",
            channel=payload.get("channel", "unknown"),
            sender=payload.get("sender", "unknown"),
            recipient=payload.get("recipient", "system"),
            body=payload.get("body", "")
        )
        
        db_msg = OmniMessage(org_id=org_id, **message_in.model_dump())
        db.add(db_msg)
        
        # Run AI Intent Detection mock
        # If "buy", "upgrade", "pricing" in body, auto-update CRM Lead
        body_lower = payload.get("body", "").lower()
        if "buy" in body_lower or "upgrade" in body_lower:
            # CRM Sync
            # crm_service.update_lead_score(...)
            pass
            
        await db.commit()
        await db.refresh(db_msg)
        return db_msg
