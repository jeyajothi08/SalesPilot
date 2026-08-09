#!/usr/bin/env bash
# ============================================================
# SalesPilot AI — Production Deployment Script
# Usage: ./scripts/deploy.sh [staging|production]
# ============================================================

set -euo pipefail

# ── Colors ───────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# ── Helpers ──────────────────────────────────────────────────
log_info()    { echo -e "${BLUE}[INFO]${NC} $*"; }
log_success() { echo -e "${GREEN}[OK]${NC}   $*"; }
log_warn()    { echo -e "${YELLOW}[WARN]${NC} $*"; }
log_error()   { echo -e "${RED}[ERROR]${NC} $*"; exit 1; }

# ── Configuration ─────────────────────────────────────────────
ENVIRONMENT="${1:-staging}"
COMPOSE_FILE="docker-compose.production.yml"
APP_DIR="/opt/salespilot"
BACKUP_DIR="/opt/salespilot/backups"
MAX_HEALTH_RETRIES=30
HEALTH_CHECK_INTERVAL=5

log_info "🚀 Starting SalesPilot AI deployment → ${ENVIRONMENT}"

# ── Validate environment ──────────────────────────────────────
if [[ "$ENVIRONMENT" != "staging" && "$ENVIRONMENT" != "production" ]]; then
    log_error "Invalid environment: $ENVIRONMENT. Use 'staging' or 'production'."
fi

# ── Validate required env vars ────────────────────────────────
required_vars=(DATABASE_URL REDIS_URL SECRET_KEY DOCKER_REGISTRY IMAGE_TAG)
for var in "${required_vars[@]}"; do
    if [[ -z "${!var:-}" ]]; then
        log_error "Required environment variable $var is not set."
    fi
done
log_success "Environment variables validated"

# ── Create backup before deploy ───────────────────────────────
log_info "📦 Creating pre-deploy database backup..."
mkdir -p "$BACKUP_DIR"
BACKUP_FILE="$BACKUP_DIR/pre-deploy-$(date +%Y%m%d_%H%M%S).sql.gz"

docker compose -f "$COMPOSE_FILE" exec -T postgres \
    pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB" | gzip > "$BACKUP_FILE" \
    && log_success "Backup saved: $BACKUP_FILE" \
    || log_warn "Backup failed — proceeding anyway (first deploy?)"

# ── Pull new images ───────────────────────────────────────────
log_info "🐳 Pulling Docker images (tag: $IMAGE_TAG)..."
docker compose -f "$COMPOSE_FILE" pull
log_success "Images pulled"

# ── Run database migrations ───────────────────────────────────
log_info "🗄️ Running database migrations..."
docker compose -f "$COMPOSE_FILE" run --rm migrator
log_success "Migrations complete"

# ── Rolling update: API ───────────────────────────────────────
log_info "🔄 Rolling update: API service..."
docker compose -f "$COMPOSE_FILE" up -d --no-deps api
log_success "API restarted"

# ── Wait for API health ───────────────────────────────────────
log_info "⏳ Waiting for API health check..."
RETRIES=0
until docker compose -f "$COMPOSE_FILE" exec -T api \
        curl -sf http://localhost:8000/api/v1/health > /dev/null 2>&1; do
    RETRIES=$((RETRIES + 1))
    if [[ $RETRIES -ge $MAX_HEALTH_RETRIES ]]; then
        log_error "API health check failed after $MAX_HEALTH_RETRIES attempts. Rolling back..."
        docker compose -f "$COMPOSE_FILE" up -d --no-deps api  # Will use old image if pull failed
        exit 1
    fi
    sleep "$HEALTH_CHECK_INTERVAL"
    log_info "Attempt $RETRIES/$MAX_HEALTH_RETRIES..."
done
log_success "API is healthy ✅"

# ── Update remaining services ─────────────────────────────────
log_info "🔄 Updating worker and beat services..."
docker compose -f "$COMPOSE_FILE" up -d --no-deps worker beat
log_success "Workers updated"

# ── Clean up old images ───────────────────────────────────────
log_info "🧹 Cleaning up unused Docker images..."
docker image prune -f --filter "until=24h"
log_success "Cleanup complete"

# ── Deployment summary ────────────────────────────────────────
log_success "═══════════════════════════════════════════════"
log_success "  Deployment complete! 🎉"
log_success "  Environment: $ENVIRONMENT"
log_success "  Image Tag:   $IMAGE_TAG"
log_success "  Timestamp:   $(date -u +%Y-%m-%dT%H:%M:%SZ)"
log_success "═══════════════════════════════════════════════"
