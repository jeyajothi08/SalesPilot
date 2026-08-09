#!/usr/bin/env bash
# ============================================================
# SalesPilot AI — Database Restore Script
# Usage: ./scripts/restore.sh <backup-file.dump.gz>
# ============================================================

set -euo pipefail

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; NC='\033[0m'
log_info()    { echo -e "${BLUE}[INFO]${NC} $*"; }
log_success() { echo -e "${GREEN}[OK]${NC}   $*"; }
log_warn()    { echo -e "${YELLOW}[WARN]${NC} $*"; }
log_error()   { echo -e "${RED}[ERROR]${NC} $*"; exit 1; }

BACKUP_FILE="${1:-}"

if [[ -z "$BACKUP_FILE" ]]; then
    log_error "Usage: $0 <backup-file.dump.gz>"
fi

if [[ ! -f "$BACKUP_FILE" ]]; then
    log_error "Backup file not found: $BACKUP_FILE"
fi

log_warn "⚠️  WARNING: This will OVERWRITE the existing database!"
log_warn "   Database: ${POSTGRES_DB:-salespilot_db}"
log_warn "   Backup:   $BACKUP_FILE"
read -p "Type 'yes' to confirm: " confirm

if [[ "$confirm" != "yes" ]]; then
    log_info "Restore cancelled."
    exit 0
fi

# ── Verify backup integrity ───────────────────────────────────
log_info "Verifying backup integrity..."
gunzip -t "$BACKUP_FILE" || log_error "Backup file is corrupted!"
log_success "Backup integrity OK"

# ── Stop API services (prevent writes during restore) ─────────
log_info "Stopping API services..."
docker compose -f docker-compose.production.yml stop api worker beat 2>/dev/null || true

# ── Drop and recreate database ────────────────────────────────
log_info "Recreating database..."
PGPASSWORD="${POSTGRES_PASSWORD}" psql \
    -h "${POSTGRES_HOST:-localhost}" \
    -U "${POSTGRES_USER:-salespilot}" \
    -c "DROP DATABASE IF EXISTS ${POSTGRES_DB}_restore_temp;" postgres 2>/dev/null || true

PGPASSWORD="${POSTGRES_PASSWORD}" psql \
    -h "${POSTGRES_HOST:-localhost}" \
    -U "${POSTGRES_USER:-salespilot}" \
    -c "CREATE DATABASE ${POSTGRES_DB}_restore_temp;" postgres

# ── Restore from backup ───────────────────────────────────────
log_info "Restoring backup to temporary database..."
gunzip -c "$BACKUP_FILE" | PGPASSWORD="${POSTGRES_PASSWORD}" pg_restore \
    -h "${POSTGRES_HOST:-localhost}" \
    -U "${POSTGRES_USER:-salespilot}" \
    -d "${POSTGRES_DB}_restore_temp" \
    --no-owner \
    --no-privileges \
    --verbose \
    && log_success "Restore to temp database complete" \
    || log_error "Restore failed!"

# ── Swap databases ────────────────────────────────────────────
log_info "Swapping databases..."
PGPASSWORD="${POSTGRES_PASSWORD}" psql \
    -h "${POSTGRES_HOST:-localhost}" \
    -U "${POSTGRES_USER:-salespilot}" \
    postgres << EOF
ALTER DATABASE "${POSTGRES_DB}" RENAME TO "${POSTGRES_DB}_old_$(date +%Y%m%d%H%M%S)";
ALTER DATABASE "${POSTGRES_DB}_restore_temp" RENAME TO "${POSTGRES_DB}";
EOF

log_success "Database swap complete"

# ── Restart services ──────────────────────────────────────────
log_info "Restarting services..."
docker compose -f docker-compose.production.yml up -d api worker beat 2>/dev/null || true

log_success "╔═══════════════════════════════════════╗"
log_success "║  Database Restore Complete! ✅         ║"
log_success "║  Restored from: $BACKUP_FILE           "
log_success "╚═══════════════════════════════════════╝"
log_warn "Old database was renamed to: ${POSTGRES_DB}_old_..."
log_warn "Run 'DROP DATABASE' on old DB once verified."
