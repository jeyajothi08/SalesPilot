"""
SalesPilot AI — FastAPI Application Entry Point
"""
import time
import structlog
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.core.config import settings
from app.api.v1.endpoints import (
    health, auth, crm, ai, voice, communication,
    analytics, billing, marketing, omni_inbox,
    livechat_ws, organization, team, rbac, audit, security,
)
from app.middleware.security import (
    RateLimitMiddleware,
    SecurityHeadersMiddleware,
    RequestValidationMiddleware,
)

logger = structlog.get_logger()


# ── Lifespan (replaces deprecated @app.on_event) ─────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("application_startup", message="SalesPilot AI Backend starting...")
    # Future: initialise connection pools, warm caches, etc.
    yield
    logger.info("application_shutdown", message="SalesPilot AI Backend shutting down.")


# ── App Factory ───────────────────────────────────────────────────────────────
def get_application() -> FastAPI:
    app = FastAPI(
        title=settings.PROJECT_NAME,
        version=settings.VERSION,
        description="SalesPilot AI — Your 24×7 AI Sales Employee",
        openapi_url=f"{settings.API_V1_STR}/openapi.json",
        docs_url="/docs",
        redoc_url="/redoc",
        lifespan=lifespan,
    )

    # ── CORS ─────────────────────────────────────────────────────────────────
    if settings.BACKEND_CORS_ORIGINS:
        app.add_middleware(
            CORSMiddleware,
            allow_origins=[str(o) for o in settings.BACKEND_CORS_ORIGINS],
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )

    # ── Security Middleware (outermost applied first) ──────────────────────
    app.add_middleware(SecurityHeadersMiddleware)
    app.add_middleware(RateLimitMiddleware)
    app.add_middleware(RequestValidationMiddleware)

    # ── Global Exception Handlers ─────────────────────────────────────────
    @app.exception_handler(StarletteHTTPException)
    async def http_exception_handler(request: Request, exc: StarletteHTTPException):
        logger.warning(
            "http_exception",
            status_code=exc.status_code,
            detail=exc.detail,
            path=request.url.path,
        )
        return JSONResponse(
            status_code=exc.status_code,
            content={"detail": exc.detail},
        )

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):
        logger.warning("validation_error", errors=exc.errors(), path=request.url.path)
        return JSONResponse(
            status_code=422,
            content={
                "detail": "Request validation failed",
                "errors": exc.errors(),
            },
        )

    @app.exception_handler(Exception)
    async def unhandled_exception_handler(request: Request, exc: Exception):
        logger.error(
            "unhandled_exception",
            error=str(exc),
            error_type=type(exc).__name__,
            path=request.url.path,
            exc_info=exc,
        )
        return JSONResponse(
            status_code=500,
            content={
                "detail": "An internal server error occurred. Please try again later.",
            },
        )

    # ── Routers ───────────────────────────────────────────────────────────
    prefix = settings.API_V1_STR

    app.include_router(health.router,        prefix=f"{prefix}/health",        tags=["Health"])
    app.include_router(auth.router,          prefix=f"{prefix}/auth",          tags=["Auth"])
    app.include_router(crm.router,           prefix=f"{prefix}/crm",           tags=["CRM"])
    app.include_router(ai.router,            prefix=f"{prefix}/ai",            tags=["AI Brain"])
    app.include_router(voice.router,         prefix=f"{prefix}/voice",         tags=["Voice AI"])
    app.include_router(communication.router, prefix=f"{prefix}/communication", tags=["Communication"])
    app.include_router(analytics.router,     prefix=f"{prefix}/analytics",     tags=["Analytics & BI"])
    app.include_router(billing.router,       prefix=f"{prefix}/billing",       tags=["Billing & Subscriptions"])
    app.include_router(marketing.router,     prefix=f"{prefix}/marketing",     tags=["Marketing Automation"])
    app.include_router(omni_inbox.router,    prefix=f"{prefix}/omni-inbox",    tags=["Omni Inbox"])
    app.include_router(livechat_ws.router,                                      tags=["Live Chat WebSockets"])
    app.include_router(organization.router,  prefix=f"{prefix}/organization",  tags=["Organization"])
    app.include_router(team.router,          prefix=f"{prefix}/team",          tags=["Team"])
    app.include_router(rbac.router,          prefix=f"{prefix}/rbac",          tags=["RBAC"])
    app.include_router(audit.router,         prefix=f"{prefix}/audit",         tags=["Audit"])
    app.include_router(security.router,      prefix=f"{prefix}/security",      tags=["Security"])

    # ── Prometheus Metrics ────────────────────────────────────────────────
    try:
        from app.core.metrics import setup_metrics
        setup_metrics(app)
    except ImportError:
        logger.warning("prometheus_not_installed", message="prometheus-fastapi-instrumentator not installed; /metrics disabled")

    return app


app = get_application()


# ── Request Logging Middleware ─────────────────────────────────────────────────
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(round(process_time * 1000, 2))

    logger.info(
        "request_processed",
        method=request.method,
        url=str(request.url),
        status_code=response.status_code,
        process_time_ms=round(process_time * 1000, 2),
        client_ip=request.client.host if request.client else "unknown",
    )

    return response
