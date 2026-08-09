import pytest
from httpx import AsyncClient
from app.models.user import User
from app.models.iam import Organization
from sqlalchemy.future import select

@pytest.mark.asyncio
async def test_register_user(client: AsyncClient, db_session):
    response = await client.post("/api/v1/auth/register", json={
        "email": "newuser@example.com",
        "password": "Password123!",
        "first_name": "New",
        "last_name": "User",
        "company_name": "New Co"
    })
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "newuser@example.com"
    
    # Check DB creation
    result = await db_session.execute(select(User).where(User.email == "newuser@example.com"))
    db_user = result.scalar_one_or_none()
    assert db_user is not None
    
    result_org = await db_session.execute(select(Organization).where(Organization.name == "New Co"))
    db_org = result_org.scalar_one_or_none()
    assert db_org is not None


@pytest.mark.asyncio
async def test_register_existing_user(client: AsyncClient):
    # Register once
    await client.post("/api/v1/auth/register", json={
        "email": "existing@example.com",
        "password": "Password123!",
        "first_name": "Existing",
        "last_name": "User",
        "company_name": "Existing Co"
    })
    
    # Register again
    response = await client.post("/api/v1/auth/register", json={
        "email": "existing@example.com",
        "password": "Password123!",
        "first_name": "Another",
        "last_name": "User",
        "company_name": "Another Co"
    })
    assert response.status_code == 400


@pytest.mark.asyncio
async def test_login_success(client: AsyncClient):
    # Register first
    await client.post("/api/v1/auth/register", json={
        "email": "login@example.com",
        "password": "Password123!",
        "first_name": "Login",
        "last_name": "User",
        "company_name": "Login Co"
    })
    
    # Login with form data
    response = await client.post("/api/v1/auth/login", data={
        "username": "login@example.com",
        "password": "Password123!"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["token_type"] == "bearer"


@pytest.mark.asyncio
async def test_login_invalid_password(client: AsyncClient):
    # Register first
    await client.post("/api/v1/auth/register", json={
        "email": "wrongpass@example.com",
        "password": "Password123!",
        "first_name": "Wrong",
        "last_name": "User",
        "company_name": "Wrong Co"
    })
    
    # Login with wrong password
    response = await client.post("/api/v1/auth/login", data={
        "username": "wrongpass@example.com",
        "password": "WrongPassword!"
    })
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_login_invalid_user(client: AsyncClient):
    response = await client.post("/api/v1/auth/login", data={
        "username": "doesnotexist@example.com",
        "password": "Password123!"
    })
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_refresh_token(client: AsyncClient):
    # Register and Login
    await client.post("/api/v1/auth/register", json={
        "email": "refresh@example.com",
        "password": "Password123!",
        "first_name": "Refresh",
        "last_name": "User",
        "company_name": "Refresh Co"
    })
    login_res = await client.post("/api/v1/auth/login", data={
        "username": "refresh@example.com",
        "password": "Password123!"
    })
    refresh_token = login_res.json()["refresh_token"]
    
    # Refresh token
    response = await client.post(f"/api/v1/auth/refresh?refresh_token={refresh_token}")
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["refresh_token"] != refresh_token


@pytest.mark.asyncio
async def test_logout(client: AsyncClient):
    # Register and Login
    await client.post("/api/v1/auth/register", json={
        "email": "logout@example.com",
        "password": "Password123!",
        "first_name": "Logout",
        "last_name": "User",
        "company_name": "Logout Co"
    })
    login_res = await client.post("/api/v1/auth/login", data={
        "username": "logout@example.com",
        "password": "Password123!"
    })
    refresh_token = login_res.json()["refresh_token"]
    
    # Logout
    response = await client.post(f"/api/v1/auth/logout?refresh_token={refresh_token}")
    assert response.status_code == 200
    
    # Try to refresh with revoked token
    refresh_res = await client.post(f"/api/v1/auth/refresh?refresh_token={refresh_token}")
    assert refresh_res.status_code == 401


@pytest.mark.asyncio
async def test_get_sessions(authorized_client: AsyncClient):
    response = await authorized_client.get("/api/v1/auth/sessions")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

@pytest.mark.asyncio
async def test_protected_crm_data(authorized_client: AsyncClient):
    response = await authorized_client.get("/api/v1/auth/protected-crm-data")
    assert response.status_code == 200
    assert "highly sensitive CRM data" in response.json()["message"]


@pytest.mark.asyncio
async def test_forgot_password(client: AsyncClient, db_session):
    # Register user first
    await client.post("/api/v1/auth/register", json={
        "email": "forgot@example.com",
        "password": "Password123!",
        "first_name": "Forgot",
        "last_name": "User",
        "company_name": "Forgot Co"
    })
    
    response = await client.post("/api/v1/auth/forgot-password", json={"email": "forgot@example.com"})
    assert response.status_code == 200
    assert "password reset link" in response.json()["message"]


@pytest.mark.asyncio
async def test_reset_password(client: AsyncClient, db_session):
    from app.core.security import create_access_token
    from datetime import timedelta
    
    await client.post("/api/v1/auth/register", json={
        "email": "reset@example.com",
        "password": "Password123!",
        "first_name": "Reset",
        "last_name": "User",
        "company_name": "Reset Co"
    })
    
    token = create_access_token(subject="reset@example.com", expires_delta=timedelta(minutes=15))
    
    response = await client.post("/api/v1/auth/reset-password", json={
        "token": token,
        "new_password": "NewPassword123!"
    })
    assert response.status_code == 200
    
    # Verify login with new password works
    login_res = await client.post("/api/v1/auth/login", data={
        "username": "reset@example.com",
        "password": "NewPassword123!"
    })
    assert login_res.status_code == 200


@pytest.mark.asyncio
async def test_get_profile(authorized_client: AsyncClient):
    response = await authorized_client.get("/api/v1/auth/profile")
    assert response.status_code == 200
    assert "email" in response.json()
    assert response.json()["email"] == "test@salespilot.ai"


@pytest.mark.asyncio
async def test_update_profile(authorized_client: AsyncClient):
    response = await authorized_client.put("/api/v1/auth/profile", json={
        "first_name": "Updated",
        "last_name": "Name",
        "phone_number": "123-456-7890",
        "bio": "New bio"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["first_name"] == "Updated"
    assert data["last_name"] == "Name"
