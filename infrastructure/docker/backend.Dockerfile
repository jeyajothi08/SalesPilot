# ============================================================
# SalesPilot AI — Production Backend Dockerfile
# Multi-stage build: slim final image, non-root user, health check
# ============================================================

# ── Stage 1: Build dependency wheels ────────────────────────
FROM python:3.12-slim AS builder

WORKDIR /build

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy and build wheels for fast re-use in final stage
COPY backend/requirements.txt .
RUN pip install --upgrade pip && \
    pip wheel --no-cache-dir --no-deps --wheel-dir /build/wheels -r requirements.txt

# ── Stage 2: Production runtime ──────────────────────────────
FROM python:3.12-slim AS runtime

LABEL org.opencontainers.image.title="SalesPilot AI - Backend"
LABEL org.opencontainers.image.description="FastAPI backend for SalesPilot AI"
LABEL org.opencontainers.image.version="1.0.0"

# Install runtime system dependencies only
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN groupadd -r appgroup && useradd -r -g appgroup -d /app -s /sbin/nologin appuser

WORKDIR /app

# Install pre-built wheels from builder stage
COPY --from=builder /build/wheels /wheels
RUN pip install --no-cache-dir /wheels/* && rm -rf /wheels

# Copy application source
COPY backend/ .

# Set environment
ENV PYTHONPATH=/app \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=8000

# Fix permissions
RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 8000

# Health check – hits the /api/v1/health endpoint
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:8000/api/v1/health || exit 1

# Entrypoint: Gunicorn with Uvicorn workers for production
CMD ["uvicorn", "app.main:app", \
     "--host", "0.0.0.0", \
     "--port", "8000", \
     "--workers", "4", \
     "--loop", "uvloop", \
     "--http", "httptools", \
     "--log-config", "log_config.json"]
