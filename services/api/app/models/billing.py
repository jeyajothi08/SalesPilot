"""
SalesPilot AI — Billing Database Models

CRITICAL FIX: org_id FK corrected from users.id → organizations.id
"""
from sqlalchemy import (
    Column, String, Integer, Float, Boolean,
    ForeignKey, DateTime, JSON, Text, Enum as SAEnum,
    Index,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
import uuid

from app.database.base import Base
from sqlalchemy import Uuid as UUID


class SubscriptionStatus(str, enum.Enum):
    ACTIVE = "active"
    PAST_DUE = "past_due"
    CANCELED = "canceled"
    TRIALING = "trialing"
    INCOMPLETE = "incomplete"


class PaymentStatus(str, enum.Enum):
    PENDING = "pending"
    SUCCESS = "success"
    FAILED = "failed"
    REFUNDED = "refunded"


class Plan(Base):
    __tablename__ = "plans"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), index=True, nullable=False)  # Starter, Professional, Enterprise
    stripe_price_id = Column(String(255), unique=True, index=True, nullable=True)
    razorpay_plan_id = Column(String(255), unique=True, index=True, nullable=True)

    amount = Column(Float, nullable=False)
    currency = Column(String(10), default="USD")
    interval = Column(String(20), default="month")  # month | year

    # Configurable limits per plan
    max_users = Column(Integer, default=1)
    max_customers = Column(Integer, default=100)
    max_leads = Column(Integer, default=100)
    max_deals = Column(Integer, default=50)
    max_ai_messages = Column(Integer, default=500)
    max_voice_minutes = Column(Integer, default=0)
    max_whatsapp_messages = Column(Integer, default=0)
    max_email_credits = Column(Integer, default=1000)

    description = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    # FIXED: was ForeignKey("users.id") — must reference organizations
    org_id = Column(
        UUID(as_uuid=True),
        ForeignKey("organizations.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    plan_id = Column(
        UUID(as_uuid=True),
        ForeignKey("plans.id", ondelete="RESTRICT"),
        nullable=False,
    )

    status = Column(SAEnum(SubscriptionStatus), default=SubscriptionStatus.INCOMPLETE, nullable=False)

    stripe_subscription_id = Column(String(255), unique=True, index=True, nullable=True)
    razorpay_subscription_id = Column(String(255), unique=True, index=True, nullable=True)

    current_period_start = Column(DateTime(timezone=True), nullable=True)
    current_period_end = Column(DateTime(timezone=True), nullable=True)
    cancel_at_period_end = Column(Boolean, default=False)
    trial_end = Column(DateTime(timezone=True), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    plan = relationship("Plan")

    __table_args__ = (
        Index("ix_subscriptions_org_id_status", "org_id", "status"),
    )


class PaymentTransaction(Base):
    __tablename__ = "payment_transactions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    # FIXED: was ForeignKey("users.id")
    org_id = Column(
        UUID(as_uuid=True),
        ForeignKey("organizations.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    subscription_id = Column(
        UUID(as_uuid=True),
        ForeignKey("subscriptions.id", ondelete="SET NULL"),
        nullable=True,
    )

    amount = Column(Float, nullable=False)
    currency = Column(String(10), default="USD")
    status = Column(SAEnum(PaymentStatus), default=PaymentStatus.PENDING, nullable=False)

    payment_gateway = Column(String(50), nullable=False)   # 'stripe' | 'razorpay'
    gateway_order_id = Column(String(255), index=True, nullable=True)
    gateway_payment_id = Column(String(255), index=True, nullable=True)

    error_message = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    # FIXED: was ForeignKey("users.id")
    org_id = Column(
        UUID(as_uuid=True),
        ForeignKey("organizations.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    transaction_id = Column(
        UUID(as_uuid=True),
        ForeignKey("payment_transactions.id", ondelete="SET NULL"),
        nullable=True,
    )

    invoice_number = Column(String(100), unique=True, index=True, nullable=False)
    amount_due = Column(Float, nullable=False)
    amount_paid = Column(Float, default=0.0)
    currency = Column(String(10), default="USD")
    tax_amount = Column(Float, default=0.0)

    pdf_url = Column(String(500), nullable=True)
    notes = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
