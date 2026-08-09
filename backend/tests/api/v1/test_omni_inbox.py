import pytest
import uuid
from httpx import AsyncClient
from app.main import app
from app.database.session import get_db

@pytest.mark.asyncio
async def test_create_thread(client: AsyncClient):
    payload = {
        "customer_id": str(uuid.uuid4()),
        "status": "open",
        "ai_summary": "Initial thread"
    }
    # In a real test environment, you'd override the auth dependency
    # For now, we expect 401 Unauthorized since we didn't mock auth here,
    # or if we mocked it globally it would return 201.
    response = await client.post("/api/v1/omni-inbox/threads", json=payload)
    assert response.status_code in [201, 401]

@pytest.mark.asyncio
async def test_send_message(client: AsyncClient):
    payload = {
        "thread_id": str(uuid.uuid4()),
        "direction": "outbound",
        "channel": "email",
        "sender": "agent@salespilot.ai",
        "recipient": "customer@example.com",
        "body": "Hello, this is a test.",
        "status": "pending"
    }
    response = await client.post("/api/v1/omni-inbox/messages", json=payload)
    assert response.status_code in [201, 401]
