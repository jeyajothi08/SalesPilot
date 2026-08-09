"""
SalesPilot AI — Alembic Migration Environment

FIXES:
- Added missing model imports: billing, audit, crm (were missing, causing tables to not appear in migrations)
- All models must be imported here so their metadata is registered with Base.metadata
"""
import asyncio
from logging.config import fileConfig

from sqlalchemy import pool
from sqlalchemy.engine import Connection
from sqlalchemy.ext.asyncio import async_engine_from_config

from alembic import context

# Alembic Config object
config = context.config

# Set up loggers from config file
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.config import settings
from app.models.user import Base

# ─── CRITICAL: Import ALL models to register them with Base.metadata ──────────
from app.models.user import *         # User model
from app.models.iam import *          # Organization, Role, OrganizationUser, Session, Invitation
from app.models.crm import *          # Customer, Lead, Deal, Activity, Company, Task, Meeting  ← FIXED
from app.models.communication import * # Campaign, OutboundMessage, Notification, OmniThread, etc.
from app.models.analytics import *    # KPIMetric, DashboardWidget, AIInsight
from app.models.ai import *           # AIConversation, ConversationMessage, MemoryEntry, etc.
from app.models.voice import *        # VoiceCall, VoiceProfile, CallTranscript, VoiceAnalytics
from app.models.billing import *      # Plan, Subscription, PaymentTransaction, Invoice  ← FIXED
from app.models.audit import *        # AuditLog  ← FIXED
# ─────────────────────────────────────────────────────────────────────────────

config.set_main_option("sqlalchemy.url", settings.DATABASE_URL)
target_metadata = Base.metadata


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        compare_type=True,
    )

    with context.begin_transaction():
        context.run_migrations()


def do_run_migrations(connection: Connection) -> None:
    context.configure(
        connection=connection,
        target_metadata=target_metadata,
        compare_type=True,
    )

    with context.begin_transaction():
        context.run_migrations()


async def run_async_migrations() -> None:
    """Create an async engine and run migrations."""
    connectable = async_engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)

    await connectable.dispose()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode."""
    asyncio.run(run_async_migrations())


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
