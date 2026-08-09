import structlog
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional
import uuid

from app.models.billing import Plan, Subscription, SubscriptionStatus, PaymentTransaction, PaymentStatus
from app.models.user import User

logger = structlog.get_logger()

class SubscriptionService:
    
    @staticmethod
    async def get_plan_by_id(db: AsyncSession, plan_id: uuid.UUID) -> Optional[Plan]:
        result = await db.execute(select(Plan).where(Plan.id == plan_id))
        return result.scalars().first()
        
    @staticmethod
    async def get_active_subscription(db: AsyncSession, org_id: uuid.UUID) -> Optional[Subscription]:
        """Get the active subscription for an organization."""
        result = await db.execute(
            select(Subscription)
            .where(
                Subscription.org_id == org_id,
                Subscription.status.in_([
                    SubscriptionStatus.ACTIVE,
                    SubscriptionStatus.TRIALING,
                ])
            )
            .order_by(Subscription.created_at.desc())
        )
        return result.scalars().first()

    @staticmethod
    async def activate_subscription(db: AsyncSession, org_id: uuid.UUID, plan_id: uuid.UUID, gateway: str, gateway_sub_id: str) -> Subscription:
        """Called upon successful webhook validation to mark subscription active."""
        
        # In a real system, you'd calculate current_period_end based on plan.interval
        sub = Subscription(
            org_id=org_id,
            plan_id=plan_id,
            status=SubscriptionStatus.ACTIVE,
            stripe_subscription_id=gateway_sub_id if gateway == 'stripe' else None,
            razorpay_subscription_id=gateway_sub_id if gateway == 'razorpay' else None
        )
        db.add(sub)
        await db.commit()
        await db.refresh(sub)
        
        logger.info("subscription_activated", sub_id=str(sub.id), org_id=str(org_id))
        return sub

    @staticmethod
    async def log_transaction(db: AsyncSession, org_id: uuid.UUID, amount: float, gateway: str, gateway_order_id: str, status: PaymentStatus = PaymentStatus.PENDING):
        tx = PaymentTransaction(
            org_id=org_id,
            amount=amount,
            payment_gateway=gateway,
            gateway_order_id=gateway_order_id,
            status=status
        )
        db.add(tx)
        await db.commit()
        await db.refresh(tx)
        return tx
