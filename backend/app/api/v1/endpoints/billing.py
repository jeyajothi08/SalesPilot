"""
SalesPilot AI — Billing & Subscription API Endpoints

FIXES:
- Razorpay webhook secret from environment (not hardcoded "dummy_webhook_secret")
- Added Stripe webhook handler for checkout.session.completed
- org_id from authenticated user's organization (not hardcoded)
- Added GET /my-subscription endpoint
- Stripe success/cancel URLs use FRONTEND_URL from settings
"""
import uuid
import json
import structlog
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Dict, Any

from app.core.config import settings
from app.database.session import get_db
from app.models.billing import Plan, Subscription, PaymentTransaction, SubscriptionStatus, PaymentStatus
from app.models.user import User
from app.api.v1.deps import get_current_active_user, get_current_org_id
from app.services.billing.subscription_service import SubscriptionService
from app.services.billing.razorpay_service import RazorpayService
from app.services.billing.stripe_service import StripeService

router = APIRouter()
logger = structlog.get_logger()

# Services initialised from environment (keys come from settings)
razorpay_svc = RazorpayService()
stripe_svc = StripeService()


@router.get("/plans", response_model=List[Dict[str, Any]])
async def list_plans(db: AsyncSession = Depends(get_db)):
    """List all active subscription plans (public endpoint)."""
    result = await db.execute(select(Plan).where(Plan.is_active == True))
    plans = result.scalars().all()
    return [
        {
            "id": str(p.id),
            "name": p.name,
            "amount": p.amount,
            "currency": p.currency,
            "interval": p.interval,
            "max_users": p.max_users,
            "max_customers": p.max_customers,
            "max_leads": p.max_leads,
            "max_ai_messages": p.max_ai_messages,
            "max_voice_minutes": p.max_voice_minutes,
            "description": p.description,
        }
        for p in plans
    ]


@router.get("/my-subscription")
async def get_my_subscription(
    db: AsyncSession = Depends(get_db),
    org_id: uuid.UUID = Depends(get_current_org_id),
    current_user: User = Depends(get_current_active_user),
):
    """Returns the current active subscription for the user's organization."""
    subscription = await SubscriptionService.get_active_subscription(db, org_id)
    if not subscription:
        return {"status": "no_subscription", "plan": None}
    return {
        "status": subscription.status.value,
        "plan": {
            "id": str(subscription.plan.id),
            "name": subscription.plan.name,
            "amount": subscription.plan.amount,
            "interval": subscription.plan.interval,
        } if subscription.plan else None,
        "current_period_end": subscription.current_period_end,
        "cancel_at_period_end": subscription.cancel_at_period_end,
    }


@router.post("/checkout")
async def create_checkout_session(
    plan_id: uuid.UUID,
    gateway: str = "razorpay",  # 'razorpay' | 'stripe'
    db: AsyncSession = Depends(get_db),
    org_id: uuid.UUID = Depends(get_current_org_id),
    current_user: User = Depends(get_current_active_user),
):
    """Creates a payment checkout session/order."""
    plan = await SubscriptionService.get_plan_by_id(db, plan_id)
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")

    frontend_url = settings.FRONTEND_URL

    if gateway == "razorpay":
        if not settings.RAZORPAY_KEY_ID:
            raise HTTPException(status_code=503, detail="Razorpay is not configured on this server")
        try:
            rzp_sub = razorpay_svc.create_subscription(plan.razorpay_plan_id or "")
            await SubscriptionService.log_transaction(
                db, org_id, plan.amount, gateway, rzp_sub.get("id")
            )
            return {
                "gateway": "razorpay",
                "subscription_id": rzp_sub.get("id"),
                "key_id": settings.RAZORPAY_KEY_ID,
                "amount": int(plan.amount * 100),  # paisa
                "currency": plan.currency,
            }
        except Exception as e:
            logger.error("razorpay_checkout_failed", error=str(e))
            raise HTTPException(status_code=400, detail=str(e))

    elif gateway == "stripe":
        if not settings.STRIPE_SECRET_KEY:
            raise HTTPException(status_code=503, detail="Stripe is not configured on this server")
        try:
            session = stripe_svc.create_checkout_session(
                price_id=plan.stripe_price_id or "",
                customer_email=current_user.email,
                success_url=f"{frontend_url}/billing/success?session_id={{CHECKOUT_SESSION_ID}}",
                cancel_url=f"{frontend_url}/billing/canceled",
            )
            await SubscriptionService.log_transaction(
                db, org_id, plan.amount, gateway, session.get("id") if isinstance(session, dict) else session.id
            )
            url = session.get("url") if isinstance(session, dict) else session.url
            return {"gateway": "stripe", "url": url}
        except Exception as e:
            logger.error("stripe_checkout_failed", error=str(e))
            raise HTTPException(status_code=400, detail=str(e))

    raise HTTPException(status_code=400, detail="Invalid gateway. Use 'stripe' or 'razorpay'")


# ─────────────────────────────────────────────────────────────────────────────
# WEBHOOKS
# ─────────────────────────────────────────────────────────────────────────────

@router.post("/webhook/razorpay", include_in_schema=False)
async def razorpay_webhook(request: Request, db: AsyncSession = Depends(get_db)):
    """Handles Razorpay webhook events."""
    payload_body = await request.body()
    signature = request.headers.get("X-Razorpay-Signature", "")

    if not signature:
        raise HTTPException(status_code=400, detail="Missing Razorpay-Signature header")

    # FIXED: Use webhook secret from environment (not hardcoded)
    if not settings.RAZORPAY_WEBHOOK_SECRET:
        logger.warning("razorpay_webhook_secret_not_configured")
        raise HTTPException(status_code=503, detail="Webhook not configured")

    is_valid = razorpay_svc.verify_webhook_signature(
        payload_body.decode("utf-8"),
        signature,
        settings.RAZORPAY_WEBHOOK_SECRET,
    )
    if not is_valid:
        logger.warning("razorpay_webhook_invalid_signature")
        raise HTTPException(status_code=400, detail="Invalid signature")

    try:
        data = json.loads(payload_body)
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON payload")

    event = data.get("event")
    logger.info("razorpay_webhook_received", event=event)

    if event == "subscription.charged":
        entity = data["payload"]["subscription"]["entity"]
        sub_id = entity["id"]
        plan_id_rzp = entity.get("plan_id")

        # Find the plan by razorpay_plan_id
        result = await db.execute(select(Plan).where(Plan.razorpay_plan_id == plan_id_rzp))
        plan = result.scalars().first()

        # Find matching pending transaction to get org_id
        result = await db.execute(
            select(PaymentTransaction).where(
                PaymentTransaction.gateway_order_id == sub_id
            )
        )
        tx = result.scalars().first()
        if tx and plan:
            await SubscriptionService.activate_subscription(
                db, tx.org_id, plan.id, "razorpay", sub_id
            )
            tx.status = PaymentStatus.SUCCESS
            tx.gateway_payment_id = sub_id
            await db.commit()
            logger.info("razorpay_subscription_activated", sub_id=sub_id, org_id=str(tx.org_id))

    elif event == "subscription.cancelled":
        sub_id = data["payload"]["subscription"]["entity"]["id"]
        result = await db.execute(
            select(Subscription).where(Subscription.razorpay_subscription_id == sub_id)
        )
        sub = result.scalars().first()
        if sub:
            sub.status = SubscriptionStatus.CANCELED
            await db.commit()
            logger.info("razorpay_subscription_cancelled", sub_id=sub_id)

    return {"status": "ok"}


@router.post("/webhook/stripe", include_in_schema=False)
async def stripe_webhook(request: Request, db: AsyncSession = Depends(get_db)):
    """Handles Stripe webhook events."""
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature", "")

    if not settings.STRIPE_WEBHOOK_SECRET:
        logger.warning("stripe_webhook_secret_not_configured")
        raise HTTPException(status_code=503, detail="Stripe webhook not configured")

    try:
        event = stripe_svc.construct_webhook_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        )
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Webhook signature verification failed: {e}")

    event_type = event["type"]
    logger.info("stripe_webhook_received", event_type=event_type)

    if event_type == "checkout.session.completed":
        session = event["data"]["object"]
        stripe_sub_id = session.get("subscription")
        customer_email = session.get("customer_email")

        if stripe_sub_id and customer_email:
            # Find user by email, then org, then activate subscription
            from app.models.iam import OrganizationUser
            from app.models.user import User as UserModel
            user_result = await db.execute(
                select(UserModel).where(UserModel.email == customer_email)
            )
            user = user_result.scalars().first()
            if user:
                org_result = await db.execute(
                    select(OrganizationUser).where(OrganizationUser.user_id == user.id)
                )
                org_user = org_result.scalars().first()
                if org_user:
                    # Find plan by stripe price id from session
                    price_id = None
                    if session.get("line_items"):
                        price_id = session["line_items"]["data"][0]["price"]["id"]

                    plan = None
                    if price_id:
                        plan_result = await db.execute(
                            select(Plan).where(Plan.stripe_price_id == price_id)
                        )
                        plan = plan_result.scalars().first()

                    if plan:
                        await SubscriptionService.activate_subscription(
                            db, org_user.org_id, plan.id, "stripe", stripe_sub_id
                        )
                        logger.info(
                            "stripe_subscription_activated",
                            org_id=str(org_user.org_id),
                            sub_id=stripe_sub_id
                        )

    elif event_type in ("invoice.payment_succeeded", "invoice.paid"):
        stripe_sub_id = event["data"]["object"].get("subscription")
        amount_paid = event["data"]["object"].get("amount_paid", 0) / 100  # cents → dollars
        if stripe_sub_id:
            result = await db.execute(
                select(Subscription).where(Subscription.stripe_subscription_id == stripe_sub_id)
            )
            sub = result.scalars().first()
            if sub:
                sub.status = SubscriptionStatus.ACTIVE
                await db.commit()
                logger.info("stripe_invoice_paid", sub_id=stripe_sub_id, amount=amount_paid)

    elif event_type in ("customer.subscription.deleted", "customer.subscription.updated"):
        stripe_sub_id = event["data"]["object"]["id"]
        new_status = event["data"]["object"].get("status")
        result = await db.execute(
            select(Subscription).where(Subscription.stripe_subscription_id == stripe_sub_id)
        )
        sub = result.scalars().first()
        if sub and new_status:
            status_map = {
                "active": SubscriptionStatus.ACTIVE,
                "past_due": SubscriptionStatus.PAST_DUE,
                "canceled": SubscriptionStatus.CANCELED,
                "trialing": SubscriptionStatus.TRIALING,
            }
            sub.status = status_map.get(new_status, sub.status)
            await db.commit()
            logger.info("stripe_subscription_status_updated", sub_id=stripe_sub_id, status=new_status)

    return {"status": "ok"}
