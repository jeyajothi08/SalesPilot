import os
import uuid
import httpx
from typing import Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException
import json

from app.models.voice import VoiceCall, CallTranscript
from app.models.communication import OmniThread, OmniMessage
from app.schemas.communication import OmniMessageCreate

class VoiceService:
    def __init__(self):
        self.twilio_account_sid = os.getenv("TWILIO_ACCOUNT_SID", "mock_sid")
        self.twilio_auth_token = os.getenv("TWILIO_AUTH_TOKEN", "mock_token")
        self.elevenlabs_api_key = os.getenv("ELEVENLABS_API_KEY", "mock_elevenlabs")
        self.openai_api_key = os.getenv("OPENAI_API_KEY", "mock_openai")

    async def initiate_outbound_call(self, db: AsyncSession, org_id: uuid.UUID, to_number: str, from_number: str) -> Dict[str, Any]:
        """Initiate an outbound call via Twilio API"""
        if self.twilio_account_sid == "mock_sid":
            # Mock behavior
            return {"status": "queued", "call_sid": f"CA{uuid.uuid4().hex[:32]}"}

        url = f"https://api.twilio.com/2010-04-01/Accounts/{self.twilio_account_sid}/Calls.json"
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                url,
                auth=(self.twilio_account_sid, self.twilio_auth_token),
                data={
                    "Url": "https://api.salespilot.ai/api/v1/voice/twiml",
                    "To": to_number,
                    "From": from_number
                }
            )
            if response.status_code not in (200, 201):
                raise HTTPException(status_code=400, detail="Failed to initiate call via Twilio")
            return response.json()

    async def process_live_audio(self, audio_chunk: bytes) -> str:
        """Process incoming audio using OpenAI Whisper (or mock if no key)"""
        # In a real WebSocket streaming scenario, we'd accumulate chunks or use a streaming ASR API
        if self.openai_api_key == "mock_openai":
            return "Mock Whisper Transcript: Customer is speaking."
        
        # Mocking the actual httpx call to Whisper API for brevity in demo
        return "Customer: Yes, I am interested in the enterprise plan."

    async def generate_voice_response(self, text: str) -> bytes:
        """Generate TTS audio using ElevenLabs"""
        if self.elevenlabs_api_key == "mock_elevenlabs":
            return b"mock_audio_data"

        url = "https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM" # generic voice ID
        headers = {
            "Accept": "audio/mpeg",
            "Content-Type": "application/json",
            "xi-api-key": self.elevenlabs_api_key
        }
        data = {
            "text": text,
            "model_id": "eleven_monolingual_v1",
            "voice_settings": {
                "stability": 0.5,
                "similarity_boost": 0.5
            }
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=data, headers=headers)
            if response.status_code != 200:
                raise HTTPException(status_code=500, detail="Failed to generate TTS")
            return response.content

    async def finalize_call_and_sync(self, db: AsyncSession, org_id: uuid.UUID, call_sid: str, transcript: str):
        """Called when Twilio call ends. Saves transcript and syncs to OmniThread"""
        # Lazy import to break circular dependency
        from app.services.communication.omni_inbox_service import OmniInboxService
        
        # 1. Update VoiceCall record
        # In a real app we'd fetch the DB call by call_sid
        
        # 2. Extract Intent and Summary via AI (Mocked)
        ai_summary = "Customer wants to upgrade to Enterprise."
        
        # 3. Create or find OmniThread for the customer
        # Assuming we have a customer_id, we'll mock it here
        dummy_thread_id = uuid.uuid4()
        
        # 4. Sync as an OmniMessage
        msg = OmniMessageCreate(
            thread_id=dummy_thread_id,
            direction="inbound",
            channel="voice",
            sender="Customer",
            recipient="AI Agent",
            body=f"Call Transcript Summary:\n{ai_summary}\n\nFull Transcript:\n{transcript}",
            is_ai_generated=True,
            status="received",
            provider_id=call_sid
        )
        
        await OmniInboxService.send_message(db, org_id, msg)
        return {"status": "success", "summary": ai_summary}

voice_service = VoiceService()
