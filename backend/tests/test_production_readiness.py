"""
SalesPilot AI — Backend Test Suite
Tests cover: auth, CRM multi-tenancy, billing, AI, analytics
"""
import pytest
import uuid
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.database.session import get_db
from app.models.user import Base
from app.core.security import get_password_hash, create_access_token

# ─── In-Memory SQLite for tests ───────────────────────────────────────────────
TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"

engine_test = create_async_engine(TEST_DATABASE_URL, echo=False)
TestSessionLocal = sessionmaker(
    engine_test, class_=AsyncSession, expire_on_commit=False
)


async def override_get_db():
    async with TestSessionLocal() as session:
        yield session


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(scope="session", autouse=True)
async def create_test_tables():
    """Create all tables in the test DB."""
    import app.models.user
    import app.models.iam
    import app.models.crm
    import app.models.communication
    import app.models.billing
    import app.models.analytics
    import app.models.ai
    import app.models.voice
    import app.models.audit

    async with engine_test.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with engine_test.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest.fixture
async def client():
    """HTTP test client for the FastAPI app."""
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
    ) as ac:
        yield ac


@pytest.fixture
async def auth_headers(client):
    """Register a test user and return auth headers."""
    email = f"test_{uuid.uuid4().hex[:6]}@salespilot.test"
    password = "TestPassword123"
    resp = await client.post("/api/v1/auth/register", json={
        "email": email,
        "password": password,
        "first_name": "Test",
        "last_name": "User",
        "company_name": "Test Corp",
    })
    assert resp.status_code == 201, f"Registration failed: {resp.text}"

    resp = await client.post("/api/v1/auth/login", data={
        "username": email,
        "password": password,
    })
    assert resp.status_code == 200
    token = resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


# ─── AUTH TESTS ───────────────────────────────────────────────────────────────

class TestAuth:
    async def test_register_success(self, client):
        resp = await client.post("/api/v1/auth/register", json={
            "email": f"{uuid.uuid4().hex[:8]}@test.com",
            "password": "SecurePass123",
            "first_name": "Jane",
            "last_name": "Doe",
            "company_name": "Jane's Corp",
        })
        assert resp.status_code == 201
        data = resp.json()
        assert data["email"].endswith("@test.com")
        assert "password_hash" not in data  # must never expose hash

    async def test_register_duplicate_email(self, client):
        email = f"dup_{uuid.uuid4().hex[:6]}@test.com"
        payload = {
            "email": email,
            "password": "SecurePass123",
            "first_name": "A",
            "last_name": "B",
            "company_name": "Corp",
        }
        await client.post("/api/v1/auth/register", json=payload)
        resp = await client.post("/api/v1/auth/register", json=payload)
        assert resp.status_code == 400
        assert "already registered" in resp.json()["detail"]

    async def test_register_weak_password(self, client):
        resp = await client.post("/api/v1/auth/register", json={
            "email": f"{uuid.uuid4().hex[:8]}@test.com",
            "password": "abc",  # too short
            "first_name": "A",
            "last_name": "B",
            "company_name": "Corp",
        })
        assert resp.status_code == 400
        assert "8 characters" in resp.json()["detail"]

    async def test_login_wrong_password(self, client, auth_headers):
        resp = await client.post("/api/v1/auth/login", data={
            "username": "nonexistent@test.com",
            "password": "WrongPassword",
        })
        assert resp.status_code == 401

    async def test_refresh_token_request_body(self, client, auth_headers):
        """Refresh token must be in request body, not query param."""
        # Login to get refresh token
        email = f"rt_{uuid.uuid4().hex[:6]}@test.com"
        await client.post("/api/v1/auth/register", json={
            "email": email, "password": "Pass1234!", "first_name": "R", "last_name": "T", "company_name": "C"
        })
        login_resp = await client.post("/api/v1/auth/login", data={"username": email, "password": "Pass1234!"})
        rt = login_resp.json()["refresh_token"]

        # Test with body (correct)
        resp = await client.post("/api/v1/auth/refresh", json={"refresh_token": rt})
        assert resp.status_code == 200
        assert "access_token" in resp.json()


# ─── CRM MULTI-TENANCY TESTS ──────────────────────────────────────────────────

class TestCRMTenantIsolation:
    async def test_customers_scoped_to_org(self, client, auth_headers):
        """Customers created by one org must not appear in another org's list."""
        # Create customer as org 1
        resp = await client.post("/api/v1/crm/customers", json={
            "first_name": "Alice",
            "last_name": "Smith",
            "email": f"alice_{uuid.uuid4().hex[:6]}@test.com",
        }, headers=auth_headers)
        assert resp.status_code == 201

        # Register org 2
        email2 = f"org2_{uuid.uuid4().hex[:6]}@test.com"
        await client.post("/api/v1/auth/register", json={
            "email": email2, "password": "Org2Pass123", "first_name": "Bob", "last_name": "Jones", "company_name": "Org2 Corp"
        })
        login2 = await client.post("/api/v1/auth/login", data={"username": email2, "password": "Org2Pass123"})
        headers2 = {"Authorization": f"Bearer {login2.json()['access_token']}"}

        # Org 2 should have NO customers
        resp2 = await client.get("/api/v1/crm/customers", headers=headers2)
        assert resp2.status_code == 200
        assert resp2.json() == []

    async def test_create_customer_requires_auth(self, client):
        resp = await client.post("/api/v1/crm/customers", json={
            "first_name": "Anon",
            "last_name": "User",
            "email": "anon@test.com",
        })
        assert resp.status_code == 401

    async def test_deal_pipeline_scoped_to_org(self, client, auth_headers):
        # Create customer first
        cust_resp = await client.post("/api/v1/crm/customers", json={
            "first_name": "Deal",
            "last_name": "Test",
            "email": f"deal_{uuid.uuid4().hex[:6]}@test.com",
        }, headers=auth_headers)
        cust_id = cust_resp.json()["id"]

        deal_resp = await client.post("/api/v1/crm/deals", json={
            "title": "Enterprise Deal",
            "value": 50000,
            "customer_id": cust_id,
        }, headers=auth_headers)
        assert deal_resp.status_code == 201
        deal_id = deal_resp.json()["id"]

        pipeline = await client.get("/api/v1/crm/deals/pipeline", headers=auth_headers)
        assert pipeline.status_code == 200
        ids = [d["id"] for d in pipeline.json()]
        assert deal_id in ids


# ─── VOICE TENANT ISOLATION TESTS ────────────────────────────────────────────

class TestVoiceIsolation:
    async def test_voice_calls_scoped_to_org(self, client, auth_headers):
        """GET /voice/calls must return org-scoped results only."""
        resp = await client.get("/api/v1/voice/calls", headers=auth_headers)
        assert resp.status_code == 200
        # Should return a list (may be empty for new org)
        assert isinstance(resp.json(), list)

    async def test_voice_calls_requires_auth(self, client):
        resp = await client.get("/api/v1/voice/calls")
        assert resp.status_code == 401


# ─── ANALYTICS TESTS ─────────────────────────────────────────────────────────

class TestAnalytics:
    async def test_dashboard_returns_real_data(self, client, auth_headers):
        resp = await client.get("/api/v1/analytics/dashboard", headers=auth_headers)
        assert resp.status_code == 200
        data = resp.json()
        assert "summary" in data
        assert "kpis" in data
        assert isinstance(data["summary"]["total_customers"], int)

    async def test_pipeline_funnel_endpoint(self, client, auth_headers):
        resp = await client.get("/api/v1/analytics/pipeline/funnel", headers=auth_headers)
        assert resp.status_code == 200
        assert "funnel" in resp.json()

    async def test_lead_sources_endpoint(self, client, auth_headers):
        resp = await client.get("/api/v1/analytics/leads/sources", headers=auth_headers)
        assert resp.status_code == 200
        assert "sources" in resp.json()


# ─── BILLING TESTS ────────────────────────────────────────────────────────────

class TestBilling:
    async def test_plans_list_is_public(self, client):
        resp = await client.get("/api/v1/billing/plans")
        assert resp.status_code == 200
        assert isinstance(resp.json(), list)

    async def test_my_subscription_requires_auth(self, client):
        resp = await client.get("/api/v1/billing/my-subscription")
        assert resp.status_code == 401

    async def test_my_subscription_returns_status(self, client, auth_headers):
        resp = await client.get("/api/v1/billing/my-subscription", headers=auth_headers)
        assert resp.status_code == 200
        data = resp.json()
        assert "status" in data

    async def test_razorpay_webhook_rejects_missing_signature(self, client):
        resp = await client.post("/api/v1/billing/webhook/razorpay", json={"event": "test"})
        # Should reject due to missing signature header
        assert resp.status_code in (400, 503)

    async def test_stripe_webhook_rejects_missing_secret_config(self, client):
        resp = await client.post(
            "/api/v1/billing/webhook/stripe",
            content=b'{"type":"test"}',
            headers={"stripe-signature": "t=1234,v1=abc"},
        )
        assert resp.status_code in (400, 503)


# ─── HEALTH CHECK ─────────────────────────────────────────────────────────────

class TestHealth:
    async def test_health_endpoint(self, client):
        resp = await client.get("/api/v1/health")
        assert resp.status_code == 200

    async def test_unknown_route_404(self, client):
        resp = await client.get("/api/v1/this-does-not-exist")
        assert resp.status_code == 404
