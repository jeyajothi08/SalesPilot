import uuid
from typing import List
from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db
from app.models.user import User
from app.api.v1.deps import RequirePermission

from app.schemas.communication import (
    OmniThreadCreate, OmniThreadResponse,
    OmniMessageCreate, OmniMessageResponse
)
from app.services.communication.omni_inbox_service import OmniInboxService

router = APIRouter()
DUMMY_ORG_ID = uuid.UUID("00000000-0000-0000-0000-000000000001")

@router.post("/threads", response_model=OmniThreadResponse, status_code=status.HTTP_201_CREATED)
async def create_thread(
    thread_in: OmniThreadCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequirePermission("communication:write")),
):
    return await OmniInboxService.create_thread(db, DUMMY_ORG_ID, thread_in)

@router.get("/threads", response_model=List[OmniThreadResponse])
async def list_threads(
    skip: int = 0, limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequirePermission("communication:read")),
):
    return await OmniInboxService.get_threads(db, DUMMY_ORG_ID, skip, limit)

@router.get("/threads/{thread_id}/messages", response_model=List[OmniMessageResponse])
async def list_thread_messages(
    thread_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequirePermission("communication:read")),
):
    return await OmniInboxService.get_thread_messages(db, DUMMY_ORG_ID, thread_id)

@router.post("/messages", response_model=OmniMessageResponse, status_code=status.HTTP_201_CREATED)
async def send_message(
    message_in: OmniMessageCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequirePermission("communication:write")),
):
    return await OmniInboxService.send_message(db, DUMMY_ORG_ID, message_in)

@router.post("/webhooks/inbound", response_model=OmniMessageResponse)
async def inbound_webhook(
    thread_id: uuid.UUID,
    payload: dict,
    db: AsyncSession = Depends(get_db),
):
    # This acts as the entry point for Twilio/SendGrid/Meta
    return await OmniInboxService.receive_inbound_message(db, DUMMY_ORG_ID, thread_id, payload)
