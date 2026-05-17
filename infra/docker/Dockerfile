# Multi-stage Dockerfile for RTSP services
# Build from project root: docker build -f infra/docker/Dockerfile -t rtsp/app .

# ============================================
# Stage 1: Base
# ============================================
FROM node:20-alpine AS base
WORKDIR /app

# ============================================
# Stage 2: Dependencies
# ============================================
FROM base AS deps
# Copy root package files
COPY package.json bunfig.toml tsconfig.base.json ./
# Copy library packages
COPY libs/domain/package.json libs/domain/
COPY libs/application/package.json libs/application/
COPY libs/infrastructure/package.json libs/infrastructure/
COPY libs/contracts/package.json libs/contracts/
COPY libs/shared/package.json libs/shared/
# Copy app packages
COPY apps/ingestion-service/package.json apps/ingestion-service/
COPY apps/processing-service/package.json apps/processing-service/
COPY apps/alert-service/package.json apps/alert-service/
COPY apps/api-gateway/package.json apps/api-gateway/
# Install dependencies
RUN npm install --legacy-peer-deps

# ============================================
# Stage 3: Build
# ============================================
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY tsconfig.base.json ./
COPY libs ./libs
COPY apps ./apps
# Build TypeScript
RUN npx tsc --build

# ============================================
# Stage 4: Runtime - Ingestion Service
# ============================================
FROM node:20-alpine AS ingestion
WORKDIR /app
RUN addgroup -g 1001 -S rtsp 2>/dev/null || true && \
    adduser -S rtsp -u 1001 -G rtsp 2>/dev/null || true
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/apps/ingestion-service/dist ./dist
COPY --from=builder /app/apps/ingestion-service/package.json ./package.json
USER rtsp
EXPOSE 3000
ENV NODE_ENV=production
CMD ["node", "dist/main.js"]

# ============================================
# Stage 5: Runtime - Processing Service
# ============================================
FROM node:20-alpine AS processing
WORKDIR /app
RUN addgroup -g 1001 -S rtsp 2>/dev/null || true && \
    adduser -S rtsp -u 1001 -G rtsp 2>/dev/null || true
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/apps/processing-service/dist ./dist
COPY --from=builder /app/apps/processing-service/package.json ./package.json
USER rtsp
EXPOSE 3001
ENV NODE_ENV=production
CMD ["node", "dist/main.js"]

# ============================================
# Stage 6: Runtime - Alert Service
# ============================================
FROM node:20-alpine AS alert
WORKDIR /app
RUN addgroup -g 1001 -S rtsp 2>/dev/null || true && \
    adduser -S rtsp -u 1001 -G rtsp 2>/dev/null || true
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/apps/alert-service/dist ./dist
COPY --from=builder /app/apps/alert-service/package.json ./package.json
USER rtsp
EXPOSE 3002
ENV NODE_ENV=production
CMD ["node", "dist/main.js"]

# ============================================
# Stage 7: Runtime - API Gateway
# ============================================
FROM node:20-alpine AS gateway
WORKDIR /app
RUN addgroup -g 1001 -S rtsp 2>/dev/null || true && \
    adduser -S rtsp -u 1001 -G rtsp 2>/dev/null || true
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/apps/api-gateway/dist ./dist
COPY --from=builder /app/apps/api-gateway/package.json ./package.json
USER rtsp
EXPOSE 3003
ENV NODE_ENV=production
CMD ["node", "dist/main.js"]