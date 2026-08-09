import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_chat_with_ai(authorized_client: AsyncClient):
    response = await authorized_client.post("/api/v1/ai/chat", json={
        "message": "Hello, how are you?"
    })
    assert response.status_code == 200
    assert "conversation_id" in response.json()
    assert "message" in response.json()

@pytest.mark.asyncio
async def test_create_knowledge_doc(authorized_client: AsyncClient):
    response = await authorized_client.post("/api/v1/ai/knowledge", json={
        "title": "Company Onboarding",
        "content": "This is the company onboarding document.",
        "source_url": "https://example.com/onboarding"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Company Onboarding"
    assert "id" in data

@pytest.mark.asyncio
async def test_create_prompt_template(authorized_client: AsyncClient):
    response = await authorized_client.post("/api/v1/ai/prompts", json={
        "name": "sales_pitch_1",
        "template": "You are an expert sales person. Pitch the following: {product}"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "sales_pitch_1"

@pytest.mark.asyncio
async def test_create_memory(authorized_client: AsyncClient):
    response = await authorized_client.post("/api/v1/ai/memory", json={
        "memory_type": "preference",
        "content": "User prefers email communication over phone calls."
    })
    assert response.status_code == 200
    data = response.json()
    assert data["memory_type"] == "preference"
    assert "id" in data
