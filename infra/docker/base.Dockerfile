FROM node:20-alpine

RUN apk add --no-cache \
    bash \
    curl \
    git \
    openssl \
    ca-certificates \
    && rm -rf /var/cache/apk/*

RUN npm install -g bun@1.0.0

RUN addgroup -g 1000 -S nodejs && \
    adduser -S rtsp -u 1000 -G nodejs

WORKDIR /app

USER rtsp

CMD ["bun", "run"]