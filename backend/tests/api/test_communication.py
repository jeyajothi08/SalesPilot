import pytest
import uuid
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_send_email_not_found(authorized_client: AsyncClient):
    """
    Ensure the Communication API returns 404 for unknown customer
    """
    response = await authorized_client.post("/api/v1/communication/email/send", json={
        "customer_id": str(uuid.uuid4()),
        "subject": "Test subject",
        "body": "Hello world"
    })
    assert response.status_code == 404
    
@pytest.mark.asyncio
async def test_ai_draft_generation(authorized_client: AsyncClient):
    """
    Ensure the AI generation endpoint returns a draft.
    """
    response = await authorized_client.post("/api/v1/communication/email/generate", json={
        "customer_id": str(uuid.uuid4()),
        "goal": "Draft a follow up email.",
        "tone": "professional"
    })
    assert response.status_code == 200
    data = response.json()
    assert "generated_subject" in data
    assert "generated_body" in data

@pytest.mark.asyncio
async def test_create_campaign(authorized_client: AsyncClient):
    response = await authorized_client.post("/api/v1/communication/campaign/create", json={
        "name": "Summer Promo",
        "channel": "email",
        "audience_filters": {"status": "active"}
    })
    assert response.status_code == 200
    data = response.json()
    assert "campaign_id" in data


@pytest.mark.asyncio
async def test_send_whatsapp_not_found(authorized_client: AsyncClient):
    response = await authorized_client.post("/api/v1/communication/whatsapp/send", json={
        "customer_id": str(uuid.uuid4()),
        "message": "Hello via WhatsApp"
    })
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_create_notification(authorized_client: AsyncClient):
    prof_resp = await authorized_client.get("/api/v1/auth/profile")
    user_id = prof_resp.json()["id"] if prof_resp.status_code == 200 else str(uuid.uuid4())
    
    response = await authorized_client.post("/api/v1/communication/notifications", json={
        "user_id": user_id,
        "title": "New Lead",
        "message": "You have a new lead waiting."
    })
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "New Lead"
    assert "id" in data
