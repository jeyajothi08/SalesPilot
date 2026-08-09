# ============================================================
# SalesPilot AI — Production Frontend Dockerfile
# Multi-stage: Node build → Nginx serve with security headers
# ============================================================

# ── Stage 1: Build React app ─────────────────────────────────
FROM node:20-alpine AS builder

LABEL stage="builder"

WORKDIR /app

# Copy package files first for better Docker layer caching
COPY apps/web/package*.json ./

# Install dependencies with clean slate
RUN npm ci --prefer-offline

# Copy source and build
COPY apps/web/ .

# Build args for environment-specific builds
ARG VITE_API_URL=https://api.salespilot.ai
ARG VITE_APP_ENV=production

ENV VITE_API_URL=$VITE_API_URL \
    VITE_APP_ENV=$VITE_APP_ENV

RUN npm run build

# ── Stage 2: Serve with Nginx ─────────────────────────────────
FROM nginx:1.25-alpine AS runtime

LABEL org.opencontainers.image.title="SalesPilot AI - Frontend"
LABEL org.opencontainers.image.description="React frontend for SalesPilot AI"

# Remove default nginx config and content
RUN rm -rf /usr/share/nginx/html/* && \
    rm /etc/nginx/conf.d/default.conf

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy production nginx configuration
COPY infrastructure/docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY infrastructure/docker/nginx-security.conf /etc/nginx/snippets/security-headers.conf

# Ensure nginx can write temp files
RUN chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

# Non-root nginx
USER nginx

EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -qO- http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
