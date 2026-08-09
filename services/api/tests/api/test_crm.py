import pytest
import uuid
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_create_customer(authorized_client: AsyncClient):
    response = await authorized_client.post("/api/v1/crm/customers", json={
        "first_name": "John",
        "last_name": "Doe",
        "email": "john.doe@example.com",
        "phone": "1234567890",
        "job_title": "CEO"
    })
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "john.doe@example.com"
    return data["id"]

@pytest.mark.asyncio
async def test_get_customers(authorized_client: AsyncClient):
    response = await authorized_client.get("/api/v1/crm/customers")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

@pytest.mark.asyncio
async def test_get_customer(authorized_client: AsyncClient):
    # Create first
    customer_id = await test_create_customer(authorized_client)
    
    response = await authorized_client.get(f"/api/v1/crm/customers/{customer_id}")
    assert response.status_code == 200
    assert response.json()["id"] == customer_id

@pytest.mark.asyncio
async def test_update_customer(authorized_client: AsyncClient):
    customer_id = await test_create_customer(authorized_client)
    
    response = await authorized_client.put(f"/api/v1/crm/customers/{customer_id}", json={
        "first_name": "Jane"
    })
    assert response.status_code == 200
    assert response.json()["first_name"] == "Jane"

@pytest.mark.asyncio
async def test_delete_customer(authorized_client: AsyncClient):
    customer_id = await test_create_customer(authorized_client)
    
    response = await authorized_client.delete(f"/api/v1/crm/customers/{customer_id}")
    assert response.status_code == 204
    
    # Verify it is deleted
    response2 = await authorized_client.get(f"/api/v1/crm/customers/{customer_id}")
    assert response2.status_code == 404

@pytest.mark.asyncio
async def test_create_deal(authorized_client: AsyncClient):
    customer_id = await test_create_customer(authorized_client)
    
    response = await authorized_client.post("/api/v1/crm/deals", json={
        "title": "Big Deal",
        "value": 100000,
        "customer_id": customer_id
    })
    assert response.status_code == 201
    assert response.json()["title"] == "Big Deal"
    return response.json()["id"], customer_id

@pytest.mark.asyncio
async def test_get_pipeline(authorized_client: AsyncClient):
    response = await authorized_client.get("/api/v1/crm/deals/pipeline")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

@pytest.mark.asyncio
async def test_get_deal(authorized_client: AsyncClient):
    deal_id, _ = await test_create_deal(authorized_client)
    response = await authorized_client.get(f"/api/v1/crm/deals/{deal_id}")
    assert response.status_code == 200
    assert response.json()["id"] == deal_id

@pytest.mark.asyncio
async def test_update_deal(authorized_client: AsyncClient):
    deal_id, _ = await test_create_deal(authorized_client)
    response = await authorized_client.put(f"/api/v1/crm/deals/{deal_id}", json={
        "stage": "Negotiation"
    })
    assert response.status_code == 200
    assert response.json()["stage"] == "Negotiation"

@pytest.mark.asyncio
async def test_delete_deal(authorized_client: AsyncClient):
    deal_id, _ = await test_create_deal(authorized_client)
    response = await authorized_client.delete(f"/api/v1/crm/deals/{deal_id}")
    assert response.status_code == 204
    
    response2 = await authorized_client.get(f"/api/v1/crm/deals/{deal_id}")
    assert response2.status_code == 404

@pytest.mark.asyncio
async def test_create_activity(authorized_client: AsyncClient):
    customer_id = await test_create_customer(authorized_client)
    response = await authorized_client.post("/api/v1/crm/activities", json={
        "activity_type": "Call",
        "title": "Discovery Call",
        "customer_id": customer_id
    })
    assert response.status_code == 201
    assert response.json()["activity_type"] == "Call"

@pytest.mark.asyncio
async def test_create_company(authorized_client: AsyncClient):
    response = await authorized_client.post("/api/v1/crm/companies", json={
        "name": "Acme Corp",
        "industry": "Technology",
        "domain": "acme.com"
    })
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Acme Corp"
    return data["id"]

@pytest.mark.asyncio
async def test_get_companies(authorized_client: AsyncClient):
    response = await authorized_client.get("/api/v1/crm/companies")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

@pytest.mark.asyncio
async def test_create_lead(authorized_client: AsyncClient):
    response = await authorized_client.post("/api/v1/crm/leads", json={
        "first_name": "Alice",
        "last_name": "Smith",
        "email": "alice.smith@example.com",
        "company_name": "Alice Co",
        "source": "Website"
    })
    assert response.status_code == 201
    data = response.json()
    assert data["first_name"] == "Alice"
    return data["id"]

@pytest.mark.asyncio
async def test_get_leads(authorized_client: AsyncClient):
    response = await authorized_client.get("/api/v1/crm/leads")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

@pytest.mark.asyncio
async def test_get_dashboard(authorized_client: AsyncClient):
    response = await authorized_client.get("/api/v1/crm/dashboard")
    assert response.status_code == 200
    data = response.json()
    assert "total_customers" in data
    assert "pipeline_value" in data
    assert "win_rate" in data
    assert isinstance(data["recent_leads"], list)
    assert isinstance(data["upcoming_meetings"], list)
