import razorpay
import hmac
import hashlib
import structlog
from typing import Dict, Any
from app.core.config import settings

logger = structlog.get_logger()

class RazorpayService:
    def __init__(self):
        """Load Razorpay credentials from application settings."""
        self.client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
        self.key_secret = settings.RAZORPAY_KEY_SECRET

    def create_subscription(self, plan_id: str, total_count: int = 12, customer_notify: int = 1) -> Dict[str, Any]:
        """Creates a subscription in Razorpay."""
        try:
            # Note: Razorpay requires a plan_id created on their dashboard.
            # In a real app, we map our internal plan.razorpay_plan_id to this.
            subscription = self.client.subscription.create({
                "plan_id": plan_id,
                "total_count": total_count,
                "customer_notify": customer_notify
            })
            return subscription
        except Exception as e:
            logger.error("razorpay_subscription_failed", error=str(e))
            raise e

    def verify_webhook_signature(self, payload_body: str, webhook_signature: str, webhook_secret: str) -> bool:
        """Verifies the authenticity of Razorpay webhooks."""
        expected_sig = hmac.new(
            bytes(webhook_secret, 'utf-8'),
            msg=bytes(payload_body, 'utf-8'),
            digestmod=hashlib.sha256
        ).hexdigest()
        return hmac.compare_digest(expected_sig, webhook_signature)

    def verify_payment_signature(self, razorpay_order_id: str, razorpay_payment_id: str, razorpay_signature: str) -> bool:
        """Verifies a payment signature originating from the frontend checkout."""
        payload = f"{razorpay_order_id}|{razorpay_payment_id}"
        expected_sig = hmac.new(
            bytes(self.key_secret, 'utf-8'),
            msg=bytes(payload, 'utf-8'),
            digestmod=hashlib.sha256
        ).hexdigest()
        return hmac.compare_digest(expected_sig, razorpay_signature)
