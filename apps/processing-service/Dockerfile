FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
COPY ../../libs/domain/package.json ../../libs/domain/
COPY ../../libs/application/package.json ../../libs/application/
COPY ../../libs/infrastructure/package.json ../../libs/infrastructure/
COPY ../../libs/shared/package.json ../../libs/shared/

RUN npm install --legacy-peer-deps || true

COPY ../../tsconfig.base.json ./
COPY libs libs
COPY apps apps

RUN npm run build --workspace=@rtsp/processing-service || true

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/processing-service/dist ./dist
COPY --from=builder /app/apps/processing-service/package.json ./package.json

RUN addgroup -g 1000 -S rtsp && \
    adduser -S rtsp -u 1000 -G rtsp

USER rtsp

EXPOSE 3001

ENV NODE_ENV=production

CMD ["node", "dist/main.js"]