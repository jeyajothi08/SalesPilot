"""
SalesPilot AI — Communication Database Models

FIXES:
- Notification.is_read: String → Boolean
- CampaignAnalytics: String columns → Integer/Float for numeric data
- SocialMediaPost count columns: String → Integer
- datetime.utcnow() → datetime.now(timezone.utc)
- Added timezone=True to all DateTime columns
"""
import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    Column, String, DateTime, ForeignKey, Text,
    JSON, Boolean, Float, Integer, Index,
)
from sqlalchemy import Uuid as UUID
from app.models.user import Base


def utcnow():
    return datetime.now(timezone.utc)


class Campaign(Base):
    __tablename__ = "campaigns"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    org_id = Column(
        UUID(as_uuid=True),
        ForeignKey("organizations.id", ondelete="CASCADE"),
        nullable=False,
    )
    name = Column(String(255), nullable=False)
    channel = Column(String(50), default="email")  # email, whatsapp, sms
    status = Column(String(50), default="draft")   # draft, scheduled, running, paused, completed
    audience_filters = Column(JSON, default=dict)
    scheduled_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=utcnow)

    __table_args__ = (
        Index("ix_campaigns_org_id", "org_id"),
    )


class CommunicationTemplate(Base):
    __tablename__ = "communication_templates"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    org_id = Column(
        UUID(as_uuid=True),
        ForeignKey("organizations.id", ondelete="CASCADE"),
        nullable=False,
    )
    name = Column(String(255), nullable=False)
    channel = Column(String(50), nullable=False)
    subject = Column(String(255))
    body = Column(Text, nullable=False)
    ai_prompt = Column(Text)
    created_at = Column(DateTime(timezone=True), default=utcnow)

    __table_args__ = (
        Index("ix_comm_templates_org_id", "org_id"),
    )


class OutboundMessage(Base):
    """Polymorphic table tracking Email, WhatsApp, and SMS."""
    __tablename__ = "outbound_messages"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    org_id = Column(
        UUID(as_uuid=True),
        ForeignKey("organizations.id", ondelete="CASCADE"),
        nullable=False,
    )
    customer_id = Column(
        UUID(as_uuid=True),
        ForeignKey("customers.id", ondelete="SET NULL"),
        nullable=True,
    )
    campaign_id = Column(
        UUID(as_uuid=True),
        ForeignKey("campaigns.id", ondelete="SET NULL"),
        nullable=True,
    )

    channel = Column(String(50), nullable=False)
    recipient = Column(String(255), nullable=False)
    subject = Column(String(255))
    body = Column(Text, nullable=False)

    status = Column(String(50), default="pending")
    provider_id = Column(String(255))
    error_message = Column(Text)

    sent_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=utcnow)

    __table_args__ = (
        Index("ix_outbound_messages_org_id", "org_id"),
        Index("ix_outbound_messages_org_channel", "org_id", "channel"),
    )


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    org_id = Column(
        UUID(as_uuid=True),
        ForeignKey("organizations.id", ondelete="CASCADE"),
        nullable=False,
    )
    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    # FIXED: was String("False") — now proper Boolean
    is_read = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), default=utcnow)

    __table_args__ = (
        Index("ix_notifications_user_id", "user_id"),
        Index("ix_notifications_org_id", "org_id"),
    )


class CampaignAnalytics(Base):
    __tablename__ = "campaign_analytics"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    org_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    campaign_id = Column(UUID(as_uuid=True), ForeignKey("campaigns.id", ondelete="CASCADE"), nullable=False, unique=True)

    # FIXED: were String — now proper Integer/Float
    total_sent = Column(Integer, default=0)
    total_opened = Column(Integer, default=0)
    total_clicked = Column(Integer, default=0)
    total_bounced = Column(Integer, default=0)
    total_conversions = Column(Integer, default=0)
    revenue_attributed = Column(Float, default=0.0)
    spend = Column(Float, default=0.0)

    created_at = Column(DateTime(timezone=True), default=utcnow)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)


class SocialMediaPost(Base):
    __tablename__ = "social_media_posts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    org_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    campaign_id = Column(UUID(as_uuid=True), ForeignKey("campaigns.id", ondelete="SET NULL"), nullable=True)

    platform = Column(String(50), nullable=False)
    caption = Column(Text)
    image_url = Column(String(500))
    hashtags = Column(JSON, default=list)

    status = Column(String(50), default="draft")
    scheduled_for = Column(DateTime(timezone=True), nullable=True)
    published_at = Column(DateTime(timezone=True), nullable=True)

    provider_post_id = Column(String(255))
    # FIXED: were String — now Integer
    likes_count = Column(Integer, default=0)
    comments_count = Column(Integer, default=0)
    shares_count = Column(Integer, default=0)

    created_at = Column(DateTime(timezone=True), default=utcnow)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)

    __table_args__ = (
        Index("ix_social_posts_org_id", "org_id"),
    )


class OmniThread(Base):
    """Groups cross-channel interactions by customer."""
    __tablename__ = "omni_threads"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    org_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    customer_id = Column(UUID(as_uuid=True), ForeignKey("customers.id", ondelete="CASCADE"), nullable=False)

    ai_summary = Column(Text, nullable=True)
    status = Column(String(50), default="open")

    created_at = Column(DateTime(timezone=True), default=utcnow)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)

    __table_args__ = (
        Index("ix_omni_threads_org_id", "org_id"),
        Index("ix_omni_threads_customer_id", "customer_id"),
    )


class OmniMessage(Base):
    """Polymorphic table tracking all inbound and outbound communications."""
    __tablename__ = "omni_messages"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    org_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    thread_id = Column(UUID(as_uuid=True), ForeignKey("omni_threads.id", ondelete="CASCADE"), nullable=False)

    direction = Column(String(50), nullable=False)
    channel = Column(String(50), nullable=False)
    sender = Column(String(255), nullable=False)
    recipient = Column(String(255), nullable=False)

    subject = Column(String(255), nullable=True)
    body = Column(Text, nullable=False)
    attachments = Column(JSON, default=list)

    status = Column(String(50), default="received")
    provider_id = Column(String(255), nullable=True)
    is_ai_generated = Column(Boolean, default=False)

    created_at = Column(DateTime(timezone=True), default=utcnow)

    __table_args__ = (
        Index("ix_omni_messages_org_id", "org_id"),
        Index("ix_omni_messages_thread_id", "thread_id"),
    )
