import pytest
import uuid
from httpx import AsyncClient, ASGITransport
from app.main import app

# We assume a mock DB session and mock current_user are injected in testing via dependency overrides.
# For demonstration in this module, we focus on the REST contract validation.

@pytest.mark.asyncio
async def test_start_outbound_call_unauthorized():
    """
    Ensure the Voice API is protected by RBAC.
    """
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/api/v1/voice/call/start", json={
            "customer_id": str(uuid.uuid4()),
            "profile_id": str(uuid.uuid4()),
            "to_number": "+15551234567"
        })
    assert response.status_code == 401
    
@pytest.mark.asyncio
async def test_twilio_webhook_twiml_generation():
    """
    Ensure the webhook returns valid TwiML XML.
    We don't need auth here because Twilio webhooks are authenticated via signature in production.
    """
    call_id = str(uuid.uuid4())
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post(
            f"/api/v1/voice/webhook/twiml?call_id={call_id}",
            data={"SpeechResult": "Hello, I want to buy your software."}
        )
    assert response.status_code == 200
    assert response.headers["content-type"] == "application/xml"
    
    xml_content = response.text
    assert "<Response>" in xml_content
    assert "<Say" in xml_content
    assert "<Gather" in xml_content

@pytest.mark.asyncio
async def test_transcribe_call(authorized_client: AsyncClient):
    call_id = str(uuid.uuid4())
    response = await authorized_client.post("/api/v1/voice/transcribe", json={
        "call_id": call_id,
        "recording_url": "https://api.twilio.com/recordings/123"
    })
    assert response.status_code == 200
    assert "transcript" in response.json()

@pytest.mark.asyncio
async def test_generate_call_summary(authorized_client: AsyncClient, db_session):
    # Need to create a call in the db with a transcript first
    from app.models.voice import VoiceCall
    
    mock_org_id = uuid.UUID("00000000-0000-0000-0000-000000000001")
    call_id = uuid.uuid4()
    
    db_call = VoiceCall(
        id=call_id,
        org_id=mock_org_id,
        direction="inbound",
        to_number="+15551234567",
        transcript="We had a great chat. The customer agreed to a meeting on Friday at 2 PM.",
        status="completed"
    )
    db_session.add(db_call)
    await db_session.commit()
    
    response = await authorized_client.post(f"/api/v1/voice/{call_id}/summary")
    assert response.status_code == 200
    data = response.json()
    assert "summary" in data
    assert data["meeting_booked"] is True
