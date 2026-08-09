import uuid
import structlog
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.models.voice import VoiceCall, CallTranscript
from app.models.crm import Activity
from app.services.ai.llm_factory import LLMFactory

logger = structlog.get_logger()


class PostCallAutomation:
    """
    Executes asynchronously after a call ends.
    Summarizes the transcript, extracts action items, and logs to CRM.
    """

    @staticmethod
    async def process_completed_call(db: AsyncSession, call_id: uuid.UUID):
        # 1. Fetch Call & Transcript
        result = await db.execute(select(VoiceCall).where(VoiceCall.id == call_id))
        call = result.scalars().first()
        if not call:
            return

        transcripts_result = await db.execute(
            select(CallTranscript)
            .where(CallTranscript.call_id == call_id)
            .order_by(CallTranscript.timestamp)
        )
        transcripts = transcripts_result.scalars().all()

        full_text = "\n".join([f"{t.speaker}: {t.text}" for t in transcripts])

        # 2. Invoke AI Brain to summarize and extract action items
        ai_response = await LLMFactory.generate_chat_response(
            prompt="Summarize this call and extract action items. Format as JSON.",
            history=[],
            context=full_text,
        )
        summary = ai_response.get("content", "Summary failed.")

        # 3. Create CRM Activity (Timeline Entry)
        activity = Activity(
            org_id=call.org_id,
            customer_id=call.customer_id,
            activity_type="call_summary",
            title=f"AI Call Summary - {call.started_at.strftime('%Y-%m-%d') if call.started_at else 'Unknown Date'}",
            description=summary,
            metadata_json={
                "duration": call.duration_seconds,
                "call_sid": call.call_sid,
            },
        )
        db.add(activity)
        await db.commit()

        logger.info("post_call_automation_complete", call_id=str(call_id))
