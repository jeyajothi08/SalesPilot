from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from app.core.config import settings

# Create the async SQLAlchemy engine
engine_kwargs = {
    "echo": settings.ENVIRONMENT == "development",
    "future": True,
    "pool_pre_ping": True,
}
if "sqlite" not in settings.DATABASE_URL:
    engine_kwargs["pool_size"] = 10
    engine_kwargs["max_overflow"] = 20

engine = create_async_engine(
    settings.DATABASE_URL,
    **engine_kwargs
)

# Create a session factory
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)


# Dependency to inject DB session into FastAPI endpoints
async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()


async def init_db():
    """Import all models and create database tables if they do not exist."""
    from app.models.user import Base
    import app.models.user
    import app.models.iam
    import app.models.crm
    import app.models.communication
    import app.models.analytics
    import app.models.ai
    import app.models.voice
    import app.models.billing
    import app.models.audit

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    await seed_initial_data()


async def seed_initial_data():
    """Seed initial demo admin user if users table is empty."""
    from sqlalchemy.future import select
    from app.models.user import User
    from app.models.iam import Organization, Role, OrganizationUser
    from app.core.security import get_password_hash

    async with AsyncSessionLocal() as session:
        result = await session.execute(select(User).limit(1))
        existing_user = result.scalars().first()
        if not existing_user:
            admin_user = User(
                email="admin@salespilot.ai",
                password_hash=get_password_hash("Admin123456!"),
                first_name="Admin",
                last_name="User",
                is_active=True,
            )
            session.add(admin_user)
            await session.flush()

            org = Organization(name="SalesPilot AI Workspace")
            session.add(org)
            await session.flush()

            role = Role(
                org_id=org.id,
                name="Super Admin",
                permissions=["super_admin"],
            )
            session.add(role)
            await session.flush()

            org_user = OrganizationUser(
                org_id=org.id,
                user_id=admin_user.id,
                role_id=role.id,
            )
            session.add(org_user)
            await session.commit()

