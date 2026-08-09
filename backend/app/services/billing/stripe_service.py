import stripe
import structlog
from typing import Dict, Any
from app.core.config import settings

logger = structlog.get_logger()

class StripeService:
    def __init__(self):
        """Load Stripe API key from application settings."""
        stripe.api_key = settings.STRIPE_SECRET_KEY

    def create_checkout_session(self, price_id: str, customer_email: str, success_url: str, cancel_url: str) -> Dict[str, Any]:
        """Creates a Stripe Checkout Session for subscription."""
        try:
            session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=[{
                    'price': price_id,
                    'quantity': 1,
                }],
                mode='subscription',
                customer_email=customer_email,
                success_url=success_url,
                cancel_url=cancel_url,
            )
            return session
        except Exception as e:
            logger.error("stripe_checkout_failed", error=str(e))
            raise e

    def construct_webhook_event(self, payload: bytes, sig_header: str, endpoint_secret: str):
        """Validates and constructs the Stripe webhook event."""
        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, endpoint_secret
            )
            return event
        except ValueError as e:
            logger.error("stripe_webhook_invalid_payload")
            raise e
        except stripe.error.SignatureVerificationError as e:
            logger.error("stripe_webhook_invalid_signature")
            raise e
