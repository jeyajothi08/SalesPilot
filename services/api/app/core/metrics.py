"""
SalesPilot AI — Prometheus Metrics Integration
Exposes /metrics endpoint for FastAPI application monitoring.

NOTE: prometheus-fastapi-instrumentator and prometheus-client are optional dependencies.
This module gracefully handles their absence so the backend starts without them.
"""
import time
import structlog

logger = structlog.get_logger()

try:
    from prometheus_fastapi_instrumentator import Instrumentator
    from prometheus_client import Counter, Histogram, Gauge
    HAS_PROMETHEUS = True
except ImportError:
    HAS_PROMETHEUS = False
    logger.info("prometheus_not_installed", message="Prometheus client libraries not installed. Metrics disabled.")


# ── Custom Business Metrics (only defined if prometheus is available) ──────────

if HAS_PROMETHEUS:
    ai_requests_total = Counter(
        "salespilot_ai_requests_total",
        "Total AI API requests made",
        ["model", "endpoint", "status"]
    )

    ai_request_latency = Histogram(
        "salespilot_ai_request_duration_seconds",
        "AI request latency in seconds",
        ["model", "endpoint"],
        buckets=[0.1, 0.5, 1.0, 2.0, 5.0, 10.0, 30.0]
    )

    crm_operations_total = Counter(
        "salespilot_crm_operations_total",
        "Total CRM operations",
        ["operation", "entity", "org_id"]
    )

    active_sessions_gauge = Gauge(
        "salespilot_active_sessions",
        "Currently active user sessions"
    )

    celery_tasks_total = Counter(
        "salespilot_celery_tasks_total",
        "Total Celery tasks processed",
        ["task_name", "status"]
    )

    email_sent_total = Counter(
        "salespilot_emails_sent_total",
        "Total emails sent",
        ["provider", "status"]
    )

    whatsapp_messages_total = Counter(
        "salespilot_whatsapp_messages_total",
        "Total WhatsApp messages",
        ["direction", "status"]
    )

    voice_calls_total = Counter(
        "salespilot_voice_calls_total",
        "Total voice calls",
        ["direction", "status"]
    )

    leads_created_total = Counter(
        "salespilot_leads_created_total",
        "Total leads created",
        ["source", "org_id"]
    )

    revenue_processed_gauge = Gauge(
        "salespilot_revenue_processed_usd",
        "Total revenue processed in USD"
    )


def setup_metrics(app):
    """Attach Prometheus instrumentation to a FastAPI app.
    No-ops gracefully if prometheus libraries are not installed."""
    if not HAS_PROMETHEUS:
        logger.info("metrics_skipped", message="Prometheus not installed; /metrics endpoint disabled")
        return app

    Instrumentator(
        should_group_status_codes=True,
        should_ignore_untemplated=True,
        should_respect_env_var=True,
        should_instrument_requests_inprogress=True,
        excluded_handlers=["/metrics", "/docs", "/redoc", "/openapi.json"],
        inprogress_name="salespilot_http_requests_inprogress",
        inprogress_labels=True,
    ).instrument(app).expose(app, include_in_schema=False, tags=["Monitoring"])

    return app
