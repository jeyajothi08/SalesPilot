"""
SalesPilot AI — Database Table Creation Script

FIXES:
- Imports ALL model modules to ensure every table is created
- Previously only imported user + communication, so billing/ai/voice/audit tables were never created
"""
import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from app.core.config import settings

# Import Base from the canonical location
from app.models.user import Base

# ─── CRITICAL: Import ALL model modules to register every table ───────────────
import app.models.user          # User
import app.models.iam           # Organization, Role, OrganizationUser, Session, Invitation
import app.models.crm           # Customer, Lead, Deal, Activity, Company, Task, Meeting
import app.models.communication # Campaign, OutboundMessage, Notification, OmniThread, OmniMessage
import app.models.analytics     # KPIMetric, DashboardWidget, AIInsight
import app.models.ai            # AIConversation, ConversationMessage, MemoryEntry, PromptTemplate, KnowledgeDocument
import app.models.voice         # VoiceCall, VoiceProfile, CallTranscript, VoiceAnalytics
import app.models.billing       # Plan, Subscription, PaymentTransaction, Invoice
import app.models.audit         # AuditLog
# ─────────────────────────────────────────────────────────────────────────────


async def create_all_tables():
    """Create all database tables using the async engine."""
    print(f"Connecting to: {settings.DATABASE_URL}")
    engine = create_async_engine(settings.DATABASE_URL, echo=True)

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    await engine.dispose()
    print("✅ All tables created successfully.")


if __name__ == "__main__":
    asyncio.run(create_all_tables())
