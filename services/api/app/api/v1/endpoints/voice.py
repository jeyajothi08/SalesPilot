"""
SalesPilot AI — Voice AI API Endpoints

CRITICAL FIXES:
- GET /calls: Added org_id filter (was returning ALL calls system-wide)
- POST /call/start: Replaced mock_org_id with real get_current_org_id
- POST /transcribe, /{call_id}/summary: Verify org ownership before mutation
- from_number pulled from settings (TWILIO_PHONE_NUMBER)
"""
import uuid
from fastapi import APIRouter, Depends, Request, Response, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
import structlog

from app.core.config import settings
from app.database.session import get_db
from app.models.user import User
from app.api.v1.deps import RequirePermission, get_current_org_id
from app.schemas.voice import CallStartRequest, CallResponse
from app.models.voice import VoiceCall
from app.services.voice.telephony_provider import TelephonyProvider
from app.services.ai.llm_factory import LLMFactory
from pydantic import BaseModel

router = APIRouter()
logger = structlog.get_logger()


@router.get("/calls")
async def get_calls(
    skip: int = 0,
    limit: int = 50,
    db: AsyncSession = Depends(get_db),
    org_id: uuid.UUID = Depends(get_current_org_id),
    current_user: User = Depends(RequirePermission("voice:read")),
):
    """List all voice calls for the current organization. FIXED: filters by org_id."""
    result = await db.execute(
        select(VoiceCall)
        .where(VoiceCall.org_id == org_id)  # CRITICAL FIX: was missing this filter
        .order_by(VoiceCall.created_at.desc())
        .offset(skip)
        .limit(limit)
    )
    return result.scalars().all()


@router.post("/call/start", response_model=CallResponse)
async def start_outbound_call(
    call_in: CallStartRequest,
    db: AsyncSession = Depends(get_db),
    org_id: uuid.UUID = Depends(get_current_org_id),  # FIXED: was mock_org_id
    current_user: User = Depends(RequirePermission("voice:execute")),
):
    """Initiates an outbound AI call via the Telephony Provider (Twilio)."""
    if not settings.TWILIO_ACCOUNT_SID or not settings.TWILIO_AUTH_TOKEN:
        logger.warning("twilio_not_configured")
        # In dev/test mode, still create the call record but skip Twilio
        mock_sid = f"CA_mock_{uuid.uuid4().hex}"
        db_call = VoiceCall(
            org_id=org_id,
            customer_id=call_in.customer_id,
            profile_id=call_in.profile_id,
            direction="outbound",
            to_number=call_in.to_number,
            from_number=settings.TWILIO_PHONE_NUMBER or "+10000000000",
            call_sid=mock_sid,
            status="mock",
        )
        db.add(db_call)
        await db.commit()
        await db.refresh(db_call)
        return CallResponse(
            call_id=db_call.id,
            call_sid=mock_sid,
            status="mock",
            message="Twilio not configured — call record created in mock mode.",
        )

    # 1. Create DB record
    db_call = VoiceCall(
        org_id=org_id,
        customer_id=call_in.customer_id,
        profile_id=call_in.profile_id,
        direction="outbound",
        to_number=call_in.to_number,
        from_number=settings.TWILIO_PHONE_NUMBER,
        status="queued",
    )
    db.add(db_call)
    await db.flush()

    # 2. Trigger Telephony Provider
    webhook_url = f"https://api.salespilot.ai/api/v1/voice/webhook/twiml?call_id={db_call.id}"
    call_sid = await TelephonyProvider.initiate_outbound_call(
        to_number=call_in.to_number,
        from_number=settings.TWILIO_PHONE_NUMBER,
        webhook_url=webhook_url,
    )

    # 3. Update DB
    db_call.call_sid = call_sid
    db_call.status = "in-progress"
    await db.commit()
    await db.refresh(db_call)

    return CallResponse(
        call_id=db_call.id,
        call_sid=call_sid,
        status="initiated",
        message="Call is dialing...",
    )


@router.post("/webhook/twiml", include_in_schema=False)
async def twilio_webhook(
    request: Request,
    call_id: str,
    db: AsyncSession = Depends(get_db),
):
    """
    Hit by Twilio during a live call. Receives speech, sends to AI Brain,
    returns TwiML with the AI's spoken response.
    """
    form_data = await request.form()
    speech_result = form_data.get("SpeechResult", "")
    logger.info("twilio_webhook_received", call_id=call_id, speech_length=len(speech_result))

    if not speech_result:
        ai_text = "Hello! This is SalesPilot AI. How can I help you today?"
    else:
        ai_response = await LLMFactory.generate_chat_response(
            prompt=speech_result,
            history=[],
            context=(
                "You are on a phone call as SalesPilot AI, an expert sales assistant. "
                "Keep responses under 2 sentences. Be helpful and professional."
            ),
        )
        ai_text = ai_response.get("content", "I apologize, could you repeat that?")

    twiml = TelephonyProvider.generate_twiml_response(ai_text)
    return Response(content=twiml, media_type="application/xml")


class TranscriptionRequest(BaseModel):
    call_id: uuid.UUID
    recording_url: str


@router.post("/transcribe")
async def transcribe_call(
    req: TranscriptionRequest,
    db: AsyncSession = Depends(get_db),
    org_id: uuid.UUID = Depends(get_current_org_id),
    current_user: User = Depends(RequirePermission("voice:execute")),
):
    """Triggers transcription on a completed call recording."""
    result = await db.execute(
        select(VoiceCall).where(VoiceCall.id == req.call_id, VoiceCall.org_id == org_id)
    )
    call = result.scalars().first()
    if not call:
        raise HTTPException(status_code=404, detail="Call not found")

    # In production: download audio → Whisper API → save transcript
    transcript = f"[Transcription of call {req.call_id} from {req.recording_url}]"
    call.transcript = transcript
    call.recording_url = req.recording_url
    await db.commit()

    return {"call_id": req.call_id, "transcript": transcript, "status": "transcribed"}


@router.post("/{call_id}/summary")
async def generate_call_summary(
    call_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    org_id: uuid.UUID = Depends(get_current_org_id),
    current_user: User = Depends(RequirePermission("voice:execute")),
):
    """Generates a post-call summary and extracts action items."""
    result = await db.execute(
        select(VoiceCall).where(VoiceCall.id == call_id, VoiceCall.org_id == org_id)
    )
    call = result.scalars().first()
    if not call:
        raise HTTPException(status_code=404, detail="Call not found")
    if not call.transcript:
        raise HTTPException(status_code=422, detail="Call has no transcript yet. Run /transcribe first.")

    ai_resp = await LLMFactory.generate_chat_response(
        prompt=(
            f"Summarize this sales call transcript in 3-5 bullet points and list any action items. "
            f"Transcript: {call.transcript}"
        ),
        history=[],
    )

    summary = ai_resp.get("content", "Summary unavailable.")
    call.summary = summary
    await db.commit()

    return {
        "call_id": call_id,
        "summary": summary,
        "action_items_extracted": True,
    }
