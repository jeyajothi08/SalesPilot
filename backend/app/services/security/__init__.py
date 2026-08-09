"""
Enterprise Security Services for SalesPilot AI
Rate limiting, input sanitization, AI guardrails, audit logging, and monitoring.
"""
import re
import time
import uuid
import hashlib
import secrets
import hmac
from datetime import datetime, timedelta
from typing import Optional, Dict, Any, List
from collections import defaultdict
import structlog

logger = structlog.get_logger()


# ─────────────────────────────────────────────────
# MODULE 3: Rate Limiter (In-Memory for dev, Redis-backed for prod)
# ─────────────────────────────────────────────────

class RateLimiter:
    """Token bucket rate limiter with per-key tracking."""

    def __init__(self):
        self._buckets: Dict[str, Dict[str, Any]] = {}

    def _get_bucket(self, key: str, max_requests: int, window_seconds: int) -> Dict[str, Any]:
        now = time.time()
        if key not in self._buckets or now - self._buckets[key]["window_start"] > window_seconds:
            self._buckets[key] = {
                "count": 0,
                "window_start": now,
            }
        return self._buckets[key]

    def is_allowed(self, key: str, max_requests: int = 60, window_seconds: int = 60) -> bool:
        bucket = self._get_bucket(key, max_requests, window_seconds)
        if bucket["count"] >= max_requests:
            return False
        bucket["count"] += 1
        return True

    def get_remaining(self, key: str, max_requests: int = 60, window_seconds: int = 60) -> int:
        bucket = self._get_bucket(key, max_requests, window_seconds)
        return max(0, max_requests - bucket["count"])

    def get_reset_time(self, key: str, window_seconds: int = 60) -> float:
        if key in self._buckets:
            return self._buckets[key]["window_start"] + window_seconds
        return time.time() + window_seconds


rate_limiter = RateLimiter()


# ─────────────────────────────────────────────────
# MODULE 3: Input Sanitizer (XSS, SQL Injection)
# ─────────────────────────────────────────────────

class InputSanitizer:
    """Detects and neutralizes malicious input patterns."""

    SQL_INJECTION_PATTERNS = [
        r"(\b(SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|CREATE|EXEC|UNION|TRUNCATE)\b.*\b(FROM|INTO|TABLE|SET|WHERE|ALL)\b)",
        r"(--|;|/\*|\*/|xp_|sp_)",
        r"(\b(OR|AND)\b\s+\d+\s*=\s*\d+)",
        r"('(\s|%20)*(OR|AND)(\s|%20)*')",
    ]

    XSS_PATTERNS = [
        r"<script[^>]*>",
        r"javascript:",
        r"on\w+\s*=",
        r"<iframe",
        r"<object",
        r"<embed",
        r"<svg[^>]*onload",
        r"eval\s*\(",
        r"document\.cookie",
        r"document\.write",
    ]

    @classmethod
    def check_sql_injection(cls, value: str) -> bool:
        for pattern in cls.SQL_INJECTION_PATTERNS:
            if re.search(pattern, value, re.IGNORECASE):
                return True
        return False

    @classmethod
    def check_xss(cls, value: str) -> bool:
        for pattern in cls.XSS_PATTERNS:
            if re.search(pattern, value, re.IGNORECASE):
                return True
        return False

    @classmethod
    def sanitize(cls, value: str) -> str:
        """Strip dangerous HTML tags while preserving content."""
        cleaned = re.sub(r"<script[^>]*>.*?</script>", "", value, flags=re.IGNORECASE | re.DOTALL)
        cleaned = re.sub(r"<[^>]+>", "", cleaned)
        return cleaned

    @classmethod
    def is_safe(cls, value: str) -> bool:
        return not cls.check_sql_injection(value) and not cls.check_xss(value)


# ─────────────────────────────────────────────────
# MODULE 4: AI Security Guardrails
# ─────────────────────────────────────────────────

class AIGuardrails:
    """Protects AI endpoints from prompt injection, jailbreaking, and data leakage."""

    PROMPT_INJECTION_PATTERNS = [
        r"ignore\s+(previous|above|all)\s+(instructions|prompts|rules)",
        r"disregard\s+(your|all|the)\s+(instructions|rules|guidelines)",
        r"you\s+are\s+now\s+(a|an|DAN|evil|unrestricted)",
        r"pretend\s+you\s+are",
        r"act\s+as\s+if\s+you\s+(have|had)\s+no\s+restrictions",
        r"override\s+(your|system)\s+(prompt|instructions)",
        r"reveal\s+your\s+(system|initial)\s+(prompt|instructions)",
        r"what\s+(is|are)\s+your\s+(system|initial)\s+(prompt|instructions)",
        r"print\s+(your|the)\s+(system|initial)\s+prompt",
    ]

    SENSITIVE_DATA_PATTERNS = [
        r"\b\d{3}-\d{2}-\d{4}\b",  # SSN
        r"\b\d{16}\b",  # Credit card (basic)
        r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b",  # Email
        r"\b(?:\d{1,3}\.){3}\d{1,3}\b",  # IP Address
    ]

    @classmethod
    def check_prompt_injection(cls, text: str) -> bool:
        for pattern in cls.PROMPT_INJECTION_PATTERNS:
            if re.search(pattern, text, re.IGNORECASE):
                return True
        return False

    @classmethod
    def check_data_leakage(cls, text: str) -> List[str]:
        """Returns list of sensitive data types found in AI output."""
        found = []
        labels = ["SSN", "CreditCard", "Email", "IPAddress"]
        for pattern, label in zip(cls.SENSITIVE_DATA_PATTERNS, labels):
            if re.search(pattern, text):
                found.append(label)
        return found

    @classmethod
    def redact_sensitive_data(cls, text: str) -> str:
        """Redacts sensitive patterns from AI output."""
        text = re.sub(r"\b\d{3}-\d{2}-\d{4}\b", "[REDACTED_SSN]", text)
        text = re.sub(r"\b\d{16}\b", "[REDACTED_CARD]", text)
        return text

    @classmethod
    def validate_ai_request(cls, prompt: str) -> Dict[str, Any]:
        """Validates an AI request and returns safety analysis."""
        is_injection = cls.check_prompt_injection(prompt)
        leakage = cls.check_data_leakage(prompt)

        return {
            "safe": not is_injection and len(leakage) == 0,
            "prompt_injection_detected": is_injection,
            "sensitive_data_in_prompt": leakage,
        }


# ─────────────────────────────────────────────────
# MODULE 5: File Security
# ─────────────────────────────────────────────────

class FileSecurityService:
    """Validates file uploads for type, size, and safety."""

    ALLOWED_EXTENSIONS = {
        "image": [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"],
        "document": [".pdf", ".doc", ".docx", ".xls", ".xlsx", ".csv", ".txt"],
        "audio": [".mp3", ".wav", ".ogg", ".m4a"],
    }
    MAX_FILE_SIZE_MB = 25

    DANGEROUS_EXTENSIONS = [".exe", ".bat", ".cmd", ".sh", ".ps1", ".vbs", ".js", ".msi", ".dll", ".scr"]

    @classmethod
    def validate_file(cls, filename: str, file_size_bytes: int, category: str = "document") -> Dict[str, Any]:
        """Validates a file upload."""
        import os
        ext = os.path.splitext(filename)[1].lower()

        if ext in cls.DANGEROUS_EXTENSIONS:
            return {"valid": False, "reason": f"Dangerous file type: {ext}"}

        allowed = cls.ALLOWED_EXTENSIONS.get(category, [])
        if ext not in allowed:
            return {"valid": False, "reason": f"File type {ext} not allowed for category '{category}'"}

        max_bytes = cls.MAX_FILE_SIZE_MB * 1024 * 1024
        if file_size_bytes > max_bytes:
            return {"valid": False, "reason": f"File exceeds maximum size of {cls.MAX_FILE_SIZE_MB}MB"}

        return {"valid": True, "extension": ext, "size_mb": round(file_size_bytes / (1024 * 1024), 2)}

    @classmethod
    def generate_signed_url(cls, file_path: str, expires_minutes: int = 60) -> str:
        """Generate a time-limited signed download URL."""
        from app.core.config import settings
        expires_at = int(time.time()) + (expires_minutes * 60)
        signature_input = f"{file_path}:{expires_at}:{settings.SECRET_KEY}"
        signature = hashlib.sha256(signature_input.encode()).hexdigest()
        return f"/files/download?path={file_path}&expires={expires_at}&sig={signature}"


# ─────────────────────────────────────────────────
# MODULE 2: MFA Service (TOTP + Recovery Codes)
# ─────────────────────────────────────────────────

class MFAService:
    """Multi-Factor Authentication using TOTP and recovery codes."""

    @staticmethod
    def generate_totp_secret() -> str:
        """Generate a base32 secret for TOTP setup."""
        import base64
        return base64.b32encode(secrets.token_bytes(20)).decode("utf-8")

    @staticmethod
    def generate_totp_uri(secret: str, email: str) -> str:
        """Generate an otpauth:// URI for QR code scanning."""
        from urllib.parse import quote
        issuer = "SalesPilot AI"
        return f"otpauth://totp/{quote(issuer)}:{quote(email)}?secret={secret}&issuer={quote(issuer)}&digits=6&period=30"

    @staticmethod
    def verify_totp(secret: str, code: str) -> bool:
        """Verify a 6-digit TOTP code against the secret.
        Uses a simple HMAC-based OTP implementation.
        """
        import struct
        counter = int(time.time()) // 30

        # Check current and ±1 window for clock drift
        for offset in [-1, 0, 1]:
            c = counter + offset
            msg = struct.pack(">Q", c)
            
            import base64
            key = base64.b32decode(secret, casefold=True)
            h = hmac.new(key, msg, hashlib.sha1).digest()
            
            o = h[-1] & 0x0F
            truncated = struct.unpack(">I", h[o:o+4])[0] & 0x7FFFFFFF
            otp = str(truncated % 1000000).zfill(6)
            
            if hmac.compare_digest(otp, code):
                return True
        return False

    @staticmethod
    def generate_recovery_codes(count: int = 10) -> List[str]:
        """Generate a set of one-time recovery codes."""
        return [secrets.token_hex(4).upper() for _ in range(count)]


# ─────────────────────────────────────────────────
# MODULE 6: Audit Logger
# ─────────────────────────────────────────────────

class AuditLogger:
    """Centralized audit logging service."""

    @staticmethod
    async def log(
        db,  # AsyncSession
        org_id: uuid.UUID,
        user_id: Optional[uuid.UUID],
        action: str,
        resource_type: Optional[str] = None,
        resource_id: Optional[str] = None,
        details: Optional[Dict] = None,
        ip_address: Optional[str] = None
    ):
        """Write an audit log entry to the database."""
        from app.models.audit import AuditLog
        entry = AuditLog(
            org_id=org_id,
            user_id=user_id,
            action=action,
            resource_type=resource_type,
            resource_id=str(resource_id) if resource_id else None,
            details=details or {},
            ip_address=ip_address
        )
        db.add(entry)
        await db.flush()
        
        logger.info(
            "audit_event",
            action=action,
            org_id=str(org_id),
            user_id=str(user_id) if user_id else None,
            resource_type=resource_type,
        )
        return entry


# ─────────────────────────────────────────────────
# MODULE 7: Health Monitor
# ─────────────────────────────────────────────────

class HealthMonitor:
    """System health check aggregator."""

    @staticmethod
    async def check_database(db) -> Dict[str, Any]:
        try:
            from sqlalchemy import text
            await db.execute(text("SELECT 1"))
            return {"status": "healthy", "latency_ms": 0}
        except Exception as e:
            return {"status": "unhealthy", "error": str(e)}

    @staticmethod
    async def check_redis() -> Dict[str, Any]:
        try:
            import redis.asyncio as aioredis
            from app.core.config import settings
            r = aioredis.from_url(settings.REDIS_URL, decode_responses=True)
            start = time.time()
            await r.ping()
            latency = round((time.time() - start) * 1000, 2)
            await r.aclose()
            return {"status": "healthy", "latency_ms": latency}
        except Exception as e:
            return {"status": "unavailable", "error": str(e)}

    @staticmethod
    async def full_health_check(db) -> Dict[str, Any]:
        db_health = await HealthMonitor.check_database(db)
        redis_health = await HealthMonitor.check_redis()
        overall = "healthy" if db_health["status"] == "healthy" else "degraded"
        return {
            "overall": overall,
            "database": db_health,
            "redis": redis_health,
            "timestamp": datetime.utcnow().isoformat()
        }


# ─────────────────────────────────────────────────
# MODULE 8: Alert Service
# ─────────────────────────────────────────────────

class AlertService:
    """Tracks suspicious activity and fires alerts."""

    _failed_logins: Dict[str, List[float]] = defaultdict(list)
    FAILED_LOGIN_THRESHOLD = 5
    FAILED_LOGIN_WINDOW = 300  # 5 minutes

    @classmethod
    def record_failed_login(cls, identifier: str) -> bool:
        """Record a failed login. Returns True if threshold exceeded (alert triggered)."""
        now = time.time()
        cls._failed_logins[identifier] = [
            t for t in cls._failed_logins[identifier] if now - t < cls.FAILED_LOGIN_WINDOW
        ]
        cls._failed_logins[identifier].append(now)

        if len(cls._failed_logins[identifier]) >= cls.FAILED_LOGIN_THRESHOLD:
            logger.warning(
                "security_alert",
                alert_type="brute_force_detected",
                identifier=identifier,
                attempts=len(cls._failed_logins[identifier])
            )
            return True
        return False

    @classmethod
    def clear_failed_logins(cls, identifier: str):
        cls._failed_logins.pop(identifier, None)


# ─────────────────────────────────────────────────
# MODULE 9: GDPR Compliance Service
# ─────────────────────────────────────────────────

class ComplianceService:
    """GDPR-ready compliance utilities."""

    @staticmethod
    async def export_user_data(db, user_id: uuid.UUID) -> Dict[str, Any]:
        """Export all data associated with a user (GDPR data portability)."""
        from app.models.user import User
        from app.models.iam import OrganizationUser
        from sqlalchemy.future import select

        result = await db.execute(select(User).where(User.id == user_id))
        user = result.scalars().first()
        if not user:
            return {"error": "User not found"}

        memberships = await db.execute(
            select(OrganizationUser).where(OrganizationUser.user_id == user_id)
        )

        return {
            "user": {
                "id": str(user.id),
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "created_at": user.created_at.isoformat() if user.created_at else None,
            },
            "memberships": [
                {"org_id": str(m.org_id), "status": getattr(m, "status", "active")}
                for m in memberships.scalars().all()
            ],
            "exported_at": datetime.utcnow().isoformat()
        }

    @staticmethod
    async def anonymize_user(db, user_id: uuid.UUID) -> bool:
        """Anonymize a user's PII for account deletion (right to be forgotten)."""
        from app.models.user import User
        from sqlalchemy.future import select

        result = await db.execute(select(User).where(User.id == user_id))
        user = result.scalars().first()
        if not user:
            return False

        user.email = f"deleted_{uuid.uuid4().hex[:8]}@anonymized.local"
        user.first_name = "Deleted"
        user.last_name = "User"
        user.phone_number = None
        user.bio = None
        user.is_active = False

        await db.flush()
        return True
