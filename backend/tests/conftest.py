import pytest
import pytest_asyncio
import uuid
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
import app.models.user
import app.models.iam
import app.models.crm
import app.models.communication
import app.models.analytics
import app.models.ai
import app.models.voice
import app.models.billing
import app.models.audit
from app.models.user import Base, User
from app.models.iam import Role, OrganizationUser, Organization
from app.core.security import create_access_token
from app.main import app as fastapi_app
from app.database.session import get_db

TEST_DATABASE_URL = "sqlite+aiosqlite:///./test_app.db"

test_engine = create_async_engine(TEST_DATABASE_URL, echo=False, future=True)
TestingSessionLocal = async_sessionmaker(
    bind=test_engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)

async def override_get_db():
    async with TestingSessionLocal() as session:
        yield session

fastapi_app.dependency_overrides[get_db] = override_get_db

@pytest_asyncio.fixture(scope="session", autouse=True)
async def create_test_db():
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

@pytest_asyncio.fixture(scope="function")
async def db_session():
    async with TestingSessionLocal() as session:
        yield session

@pytest_asyncio.fixture(scope="function")
async def client():
    async with AsyncClient(transport=ASGITransport(app=fastapi_app), base_url="http://test") as ac:
        yield ac

@pytest_asyncio.fixture(scope="function")
async def authorized_client(client, db_session):
    # Create test organization
    org_id = uuid.UUID("00000000-0000-0000-0000-000000000001")
    from sqlalchemy.future import select
    result = await db_session.execute(select(Organization).where(Organization.id == org_id))
    test_org = result.scalar_one_or_none()
    if not test_org:
        test_org = Organization(
            id=org_id,
            name="Test Org",
            domain="test.salespilot.ai"
        )
        db_session.add(test_org)
        await db_session.commit()


    # Create test user
    user_email = "test@salespilot.ai"
    result = await db_session.execute(select(User).where(User.email == user_email))
    test_user = result.scalar_one_or_none()
    
    if not test_user:
        user_id = uuid.uuid4()
        test_user = User(
            id=user_id,
            email=user_email,
            password_hash="dummy_hash",
            first_name="Test",
            last_name="User",
            is_active=True
        )
        db_session.add(test_user)
        await db_session.commit()
    else:
        user_id = test_user.id
    
    # Create test role with all permissions
    role_name = "Admin"
    result = await db_session.execute(select(Role).where(Role.name == role_name, Role.org_id == org_id))
    test_role = result.scalar_one_or_none()
    
    if not test_role:
        role_id = uuid.uuid4()
        test_role = Role(
            id=role_id,
            org_id=org_id,
            name=role_name,
            permissions=["super_admin", "crm:read", "crm:write"]
        )
        db_session.add(test_role)
        await db_session.commit()
    else:
        role_id = test_role.id
    
    # Link user to role
    result = await db_session.execute(select(OrganizationUser).where(OrganizationUser.user_id == user_id, OrganizationUser.org_id == org_id))
    org_user = result.scalar_one_or_none()
    
    if not org_user:
        org_user = OrganizationUser(
            org_id=org_id,
            user_id=user_id,
            role_id=role_id,
            status="active"
        )
        db_session.add(org_user)
        await db_session.commit()
    
    # Generate token
    token = create_access_token(subject=str(user_id))
    
    # Return client with auth header
    client.headers = {"Authorization": f"Bearer {token}"}
    yield client

