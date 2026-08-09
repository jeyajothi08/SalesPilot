#!/usr/bin/env bash
# ============================================================
# SalesPilot AI — Database Backup Script
# Runs automatically at 2 AM via cron or Docker scheduler
# Usage: ./scripts/backup.sh
# ============================================================

set -euo pipefail

RED='\033[0;31m'; GREEN='\033[0;32m'; BLUE='\033[0;34m'; NC='\033[0m'
log_info()    { echo -e "${BLUE}[$(date -u +%H:%M:%S) INFO]${NC} $*"; }
log_success() { echo -e "${GREEN}[$(date -u +%H:%M:%S) OK]${NC}   $*"; }
log_error()   { echo -e "${RED}[$(date -u +%H:%M:%S) ERROR]${NC} $*"; exit 1; }

# ── Configuration ─────────────────────────────────────────────
BACKUP_DIR="${BACKUP_DIR:-/opt/salespilot/backups}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/salespilot_${TIMESTAMP}.sql.gz"
RETENTION_DAILY=7   # days
RETENTION_WEEKLY=4  # weeks
RETENTION_MONTHLY=6 # months

# ── Create backup directory ───────────────────────────────────
mkdir -p "$BACKUP_DIR"/{daily,weekly,monthly}

# ── Dump database ─────────────────────────────────────────────
log_info "Starting database backup: salespilot_db"

PGPASSWORD="${POSTGRES_PASSWORD}" pg_dump \
    -h "${POSTGRES_HOST:-localhost}" \
    -U "${POSTGRES_USER:-salespilot}" \
    -d "${POSTGRES_DB:-salespilot_db}" \
    --verbose \
    --format=custom \
    | gzip > "$BACKUP_DIR/daily/salespilot_${TIMESTAMP}.dump.gz"

BACKUP_SIZE=$(du -sh "$BACKUP_DIR/daily/salespilot_${TIMESTAMP}.dump.gz" | cut -f1)
log_success "Backup created: salespilot_${TIMESTAMP}.dump.gz (${BACKUP_SIZE})"

# ── Verify backup ─────────────────────────────────────────────
log_info "Verifying backup integrity..."
gunzip -t "$BACKUP_DIR/daily/salespilot_${TIMESTAMP}.dump.gz" \
    && log_success "Backup integrity verified" \
    || log_error "Backup verification failed!"

# ── Weekly backup (Sundays) ───────────────────────────────────
if [[ "$(date +%u)" == "7" ]]; then
    cp "$BACKUP_DIR/daily/salespilot_${TIMESTAMP}.dump.gz" \
       "$BACKUP_DIR/weekly/salespilot_week$(date +%V)_${TIMESTAMP}.dump.gz"
    log_success "Weekly backup created"
fi

# ── Monthly backup (1st of month) ─────────────────────────────
if [[ "$(date +%d)" == "01" ]]; then
    cp "$BACKUP_DIR/daily/salespilot_${TIMESTAMP}.dump.gz" \
       "$BACKUP_DIR/monthly/salespilot_$(date +%Y%m)_${TIMESTAMP}.dump.gz"
    log_success "Monthly backup created"
fi

# ── Upload to S3 (if configured) ─────────────────────────────
if [[ -n "${AWS_S3_BUCKET:-}" ]]; then
    log_info "Uploading to S3: s3://${AWS_S3_BUCKET}/backups/"
    aws s3 cp \
        "$BACKUP_DIR/daily/salespilot_${TIMESTAMP}.dump.gz" \
        "s3://${AWS_S3_BUCKET}/backups/daily/salespilot_${TIMESTAMP}.dump.gz" \
        --storage-class STANDARD_IA
    log_success "Uploaded to S3"
fi

# ── Prune old backups ─────────────────────────────────────────
log_info "Pruning old backups..."
find "$BACKUP_DIR/daily"   -name "*.dump.gz" -mtime +"${RETENTION_DAILY}"   -delete
find "$BACKUP_DIR/weekly"  -name "*.dump.gz" -mtime +$(( RETENTION_WEEKLY * 7 ))   -delete
find "$BACKUP_DIR/monthly" -name "*.dump.gz" -mtime +$(( RETENTION_MONTHLY * 31 )) -delete
log_success "Old backups pruned"

log_success "Backup process complete 🎉"
