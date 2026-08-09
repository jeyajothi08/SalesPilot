from celery import Celery
import structlog
from app.core.config import settings

logger = structlog.get_logger()

# Initialize Celery app
celery_app = Celery(
    "salespilot_worker", broker=settings.REDIS_URL, backend=settings.REDIS_URL
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
)


@celery_app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    logger.info("celery_setup", message="Configuring periodic background tasks")
    # Example: sender.add_periodic_task(3600.0, periodic_insight_generation.s(), name="hourly-insights")


@celery_app.task(bind=True, max_retries=3)
def send_bulk_campaign_emails(self, campaign_id: str):
    logger.info("task_start", task="send_bulk_campaign_emails", campaign_id=campaign_id)
    # 1. Fetch Campaign
    # 2. Extract audience
    # 3. Call CommunicationEngine
    return {"status": "completed", "campaign_id": campaign_id, "emails_sent": 0}


@celery_app.task(bind=True)
def run_ai_forecasting(self, org_id: str):
    logger.info("task_start", task="run_ai_forecasting", org_id=org_id)
    # 1. Gather historical deal data
    # 2. Send to LLMFactory
    # 3. Save AIInsight
    return {"status": "completed", "org_id": org_id}
