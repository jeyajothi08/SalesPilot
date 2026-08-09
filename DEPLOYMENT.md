# SalesPilot AI — Production Deployment Guide

> **Complete DevOps Reference** for the SalesPilot AI enterprise SaaS platform

---

## Architecture Overview

```
Internet → CloudFlare CDN → Nginx (TLS + Rate Limit)
                                ├── React Frontend (static)
                                └── FastAPI Backend (x2 replicas)
                                        ├── PostgreSQL (primary)
                                        ├── Redis (cache + queue)
                                        ├── Celery Workers (x2)
                                        ├── Celery Beat (x1)
                                        └── S3 File Storage

Monitoring: Prometheus → Grafana → AlertManager → Slack
Backups:    Daily 2AM → Local + S3 (7d/4w/6m retention)
```

---

## Quick Start (Development)

```bash
# 1. Clone the repo
git clone https://github.com/yourorg/salespilot-ai.git
cd salespilot-ai

# 2. Copy environment template
cp .env.example .env
# Edit .env with your API keys

# 3. Start full stack (hot reload enabled)
docker compose up --build

# 4. Access
# Frontend:  http://localhost:5173
# Backend:   http://localhost:8000
# API Docs:  http://localhost:8000/docs
# Flower:    http://localhost:5555
```

---

## Production Deployment

### Prerequisites

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| CPU | 2 vCPU | 4 vCPU |
| RAM | 4 GB | 8 GB |
| Disk | 40 GB SSD | 100 GB SSD |
| OS | Ubuntu 22.04 | Ubuntu 22.04 |
| Docker | 24+ | Latest |

### Step 1 — Server Setup

```bash
# Install Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# Create application directory
sudo mkdir -p /opt/salespilot
cd /opt/salespilot
git clone https://github.com/yourorg/salespilot-ai.git .
```

### Step 2 — Configure Secrets

```bash
cp .env.example .env
nano .env  # Fill all required values

# Generate a secure SECRET_KEY:
openssl rand -hex 64
```

### Step 3 — TLS Certificates

```bash
sudo certbot certonly --standalone \
  -d salespilot.ai -d app.salespilot.ai
sudo cp /etc/letsencrypt/live/salespilot.ai/fullchain.pem ssl/
sudo cp /etc/letsencrypt/live/salespilot.ai/privkey.pem ssl/
```

### Step 4 — Deploy

```bash
export IMAGE_TAG=latest
export DOCKER_REGISTRY=ghcr.io/yourorg/salespilot-ai
echo $GITHUB_TOKEN | docker login ghcr.io -u youruser --password-stdin

docker compose -f docker-compose.production.yml up -d

# Verify
curl https://app.salespilot.ai/api/v1/health
```

---

## CI/CD Pipeline

The GitHub Actions pipeline (`.github/workflows/deploy.yml`) runs automatically:

| Step | Trigger | Action |
|------|---------|--------|
| Backend Quality | Every PR | Ruff lint, pytest |
| Frontend Quality | Every PR | ESLint, Vite build |
| Security Scan | Push | pip-audit, Trivy |
| Docker Build | Push to main/staging | Build + push GHCR |
| Deploy Staging | Push to `staging` | SSH rolling deploy |
| Deploy Production | Push to `main` | SSH rolling deploy |
| Smoke Tests | After deploy | Health + auth check |

### Required GitHub Secrets

```
STAGING_SERVER_HOST / STAGING_SSH_KEY
PROD_SERVER_HOST / PROD_SSH_KEY
CODECOV_TOKEN
SLACK_WEBHOOK_URL
```

---

## Monitoring

**Grafana** at `http://your-server:3001` with pre-built dashboards:
- API Performance (latency, error rate, throughput)
- Database Health (connections, query time)
- Redis Status (memory, hit rate)
- Celery Workers (task throughput, queue depth)
- System Metrics (CPU, RAM, disk)

**Custom Prometheus Metrics:**
- `salespilot_ai_requests_total` — AI API calls
- `salespilot_crm_operations_total` — CRM activity
- `salespilot_leads_created_total` — Lead pipeline
- `salespilot_emails_sent_total` — Email delivery
- `salespilot_voice_calls_total` — Call volume

---

## Backup Strategy

| Type | Schedule | Retention | Storage |
|------|----------|-----------|---------|
| Daily | 02:00 UTC | 7 days | Local + S3 |
| Weekly | Sunday | 4 weeks | Local + S3 |
| Monthly | 1st of month | 6 months | S3 |
| Pre-deploy | Before each deploy | Until next | Local |

```bash
# Manual backup
./scripts/backup.sh

# Restore from backup
./scripts/restore.sh backups/daily/salespilot_20260101_020000.dump.gz
```

---

## Rollback Procedure

```bash
# 1. Set the rollback tag
export IMAGE_TAG=<previous-tag>

# 2. Pull and deploy old version
docker compose -f docker-compose.production.yml pull
docker compose -f docker-compose.production.yml up -d

# 3. If DB migration rollback needed
alembic downgrade -1

# 4. Verify
curl https://app.salespilot.ai/api/v1/health
```

---

## Deployment Targets

### Railway
```bash
railway login && railway init && railway up
```

### Render
Configure `render.yaml` with docker service pointing to `infrastructure/docker/backend.Dockerfile`

### AWS ECS
Use the GitHub Actions workflow with `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` secrets + ECR configured

### DigitalOcean
```bash
doctl apps create --spec infrastructure/do-app-spec.yaml
```

---

## Troubleshooting

| Issue | Diagnostic | Fix |
|-------|-----------|-----|
| API won't start | `docker compose logs api` | Check DATABASE_URL, SECRET_KEY |
| DB connection refused | `docker compose exec postgres pg_isready` | Check postgres healthcheck |
| High Redis memory | `redis-cli info memory` | Increase maxmemory or flush stale keys |
| Celery tasks stuck | `celery inspect active` | Restart worker service |
| Cert expired | `certbot certificates` | Run `certbot renew` |

---

## Production Security Checklist

- [ ] All secrets in `.env` (never committed to git)
- [ ] HTTPS with valid TLS cert and auto-renewal
- [ ] Nginx rate limiting active
- [ ] Security headers (HSTS, CSP, X-Frame-Options)
- [ ] Database not exposed to internet (internal network only)
- [ ] Redis password set
- [ ] Non-root Docker containers
- [ ] Regular backups tested with restore
- [ ] Monitoring and alerting live
- [ ] Firewall: only ports 80 and 443 open
