"""
Enterprise Security Middleware for SalesPilot AI
Handles rate limiting, secure headers, request validation, and audit trail.
"""
import time
import structlog
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response, JSONResponse

from app.services.security import rate_limiter, InputSanitizer

logger = structlog.get_logger()


class RateLimitMiddleware(BaseHTTPMiddleware):
    """
    Per-IP rate limiting middleware.
    Default: 120 requests per minute for API endpoints.
    Auth endpoints (login/register): 20 per minute.
    """

    async def dispatch(self, request: Request, call_next):
        client_ip = request.client.host if request.client else "unknown"
        path = request.url.path

        # Determine rate limit tier
        if "/auth/login" in path or "/auth/register" in path:
            max_requests, window = 20, 60
        elif "/api/" in path:
            max_requests, window = 120, 60
        else:
            # Static/docs pages are not rate limited
            return await call_next(request)

        key = f"rl:{client_ip}:{path.split('/')[3] if len(path.split('/')) > 3 else 'general'}"

        if not rate_limiter.is_allowed(key, max_requests, window):
            logger.warning("rate_limit_exceeded", ip=client_ip, path=path)
            return JSONResponse(
                status_code=429,
                content={"detail": "Too many requests. Please try again later."},
                headers={
                    "Retry-After": str(int(rate_limiter.get_reset_time(key, window) - time.time())),
                    "X-RateLimit-Limit": str(max_requests),
                    "X-RateLimit-Remaining": "0",
                }
            )

        response = await call_next(request)
        remaining = rate_limiter.get_remaining(key, max_requests, window)
        response.headers["X-RateLimit-Limit"] = str(max_requests)
        response.headers["X-RateLimit-Remaining"] = str(remaining)
        return response


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """
    Injects security headers on every response.
    Prevents XSS, clickjacking, MIME sniffing, and information disclosure.
    """

    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)

        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate"
        response.headers["Pragma"] = "no-cache"

        # Remove server identification
        if "server" in response.headers:
            del response.headers["server"]

        return response


class RequestValidationMiddleware(BaseHTTPMiddleware):
    """
    Validates request bodies for SQL injection and XSS patterns.
    Only checks POST/PUT/PATCH bodies.
    """

    async def dispatch(self, request: Request, call_next):
        if request.method in ("POST", "PUT", "PATCH"):
            content_type = request.headers.get("content-type", "")
            if "application/json" in content_type:
                try:
                    body = await request.body()
                    body_text = body.decode("utf-8", errors="ignore")
                    
                    if InputSanitizer.check_sql_injection(body_text):
                        logger.warning(
                            "sql_injection_attempt",
                            ip=request.client.host if request.client else "unknown",
                            path=request.url.path
                        )
                        return JSONResponse(
                            status_code=400,
                            content={"detail": "Potentially malicious input detected."}
                        )

                    if InputSanitizer.check_xss(body_text):
                        logger.warning(
                            "xss_attempt",
                            ip=request.client.host if request.client else "unknown",
                            path=request.url.path
                        )
                        return JSONResponse(
                            status_code=400,
                            content={"detail": "Potentially malicious input detected."}
                        )
                except Exception:
                    pass  # Let FastAPI handle malformed bodies

        return await call_next(request)
