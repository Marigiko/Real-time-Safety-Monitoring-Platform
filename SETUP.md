# RTSP Local Execution Guide

## Real-Time Safety Monitoring Platform - Complete Setup Tutorial

---

# 1. Prerequisites

## 1.1 Required Software

| Software | Version | Purpose |
|----------|---------|---------|
| **Bun** | ≥ 1.0.0 | Package manager and runtime |
| **Node.js** | ≥ 20.0.0 | Runtime (via Bun) |
| **Docker** | ≥ 20.10.0 | Container runtime |
| **Docker Compose** | ≥ 2.0.0 | Multi-container orchestration |
| **kubectl** | ≥ 1.28.0 | Kubernetes CLI (optional) |
| **Helm** | ≥ 3.12.0 | Kubernetes package manager (optional) |

## 1.2 Operating System

- **Recommended**: macOS, Linux (Ubuntu 20.04+)
- **Windows**: Use WSL2 with Ubuntu or Docker Desktop

## 1.3 Verify Installations

```bash
# Check Bun
bun --version

# Check Docker
docker --version

# Check Docker Compose
docker compose version

# Check kubectl (optional)
kubectl version --client

# Check Helm (optional)
helm version
```

---

# 2. Repository Setup

## 2.1 Clone the Repository

```bash
git clone <repository-url>
cd Real-time-Safety-Monitoring-Platform
```

## 2.2 Install Dependencies

```bash
# Install all workspace dependencies
bun install
```

**Expected Output:**
```
✓ All packages installed (xxx packages)
```

## 2.3 Verify Workspace Structure

```bash
# List apps directory
ls apps/

# List libs directory
ls libs/
```

**Expected:**
- `apps/` contains: ingestion-service, processing-service, alert-service, api-gateway
- `libs/` contains: domain, application, infrastructure, contracts, shared

---

# 3. Local Infrastructure Startup

## 3.1 Start All Infrastructure Services

The fastest way to run the RTSP platform locally is using Docker Compose, which starts all infrastructure and application services:

```bash
cd infra/docker
docker compose up -d
```

**This command starts:**
- PostgreSQL (port 5432)
- Kafka (ports 9092, 29092)
- Zookeeper (port 2181)
- RabbitMQ (ports 5672, 15672)
- MQTT Broker (port 1883)

## 3.2 Verify Infrastructure Status

```bash
# Check container status
docker compose ps

# Check logs for any errors
docker compose logs --tail=50
```

## 3.3 Wait for Services to be Healthy

All services have health checks configured. Wait until all show "healthy":

```bash
# Wait for all services to be healthy (max 60 seconds)
timeout 60 bash -c 'until docker compose ps | grep -q "healthy"; do sleep 2; done' && echo "All services are healthy!"
```

## 3.4 Infrastructure Port Mapping

| Service | Internal Port | External Port | UI/Management |
|---------|---------------|---------------|---------------|
| PostgreSQL | 5432 | 5432 | - |
| Kafka | 29092 | 9092 | - |
| Zookeeper | 2181 | 2181 | - |
| RabbitMQ | 5672 | 5672 | http://localhost:15672 |
| MQTT | 1883 | 1883 | - |

**RabbitMQ Management Console:**
- URL: http://localhost:15672
- Username: `rtsp`
- Password: `rtsp`

---

# 4. Application Services Startup

## 4.1 Method 1: Docker Compose (Recommended for Full System)

If you want to run all services together with infrastructure:

```bash
# The docker-compose.yml already includes application services
cd infra/docker
docker compose up -d --build
```

**Service Ports:**
- Ingestion Service: http://localhost:3000
- Processing Service: http://localhost:3001
- Alert Service: http://localhost:3002
- API Gateway: http://localhost:3003

## 4.2 Method 2: Manual Development Mode

For development with hot-reload:

### Terminal 1 - Ingestion Service
```bash
cd apps/ingestion-service
bun run dev
```

### Terminal 2 - Processing Service
```bash
cd apps/processing-service
bun run dev
```

### Terminal 3 - Alert Service
```bash
cd apps/alert-service
bun run dev
```

### Terminal 4 - API Gateway
```bash
cd apps/api-gateway
bun run dev
```

## 4.3 Environment Variables

The services expect these environment variables (already configured in docker-compose.yml):

```bash
# For local development, create a .env file:
NODE_ENV=development

# MQTT
MQTT_HOST=localhost
MQTT_PORT=1883

# Kafka
KAFKA_BROKERS=localhost:9092

# RabbitMQ
RABBITMQ_URL=amqp://rtsp:rtsp@localhost:5672
RABBITMQ_QUEUE=alerts

# PostgreSQL
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=rtsp
POSTGRES_PASSWORD=rtsp
POSTGRES_DB=rtsp

# Logging
LOG_LEVEL=debug
```

---

# 5. Verification Steps

## 5.1 Health Check Endpoints

After starting services, verify each one:

```bash
# Ingestion Service
curl http://localhost:3000/health | jq

# Processing Service  
curl http://localhost:3001/health | jq

# Alert Service
curl http://localhost:3002/health | jq

# API Gateway
curl http://localhost:3003/health | jq
```

**Expected Response:**
```json
{
  "status": "healthy",
  "service": "ingestion-service",
  "timestamp": "2024-...",
  "dependencies": {
    "mqtt": true,
    "kafka": true
  }
}
```

## 5.2 API Endpoint Verification

```bash
# Test API Gateway health
curl http://localhost:3003/health

# Test telemetry endpoint (will be empty initially)
curl http://localhost:3003/telemetry

# Test alerts endpoint (will be empty initially)
curl http://localhost:3003/alerts
```

## 5.3 Metrics Endpoint

```bash
# Get Prometheus metrics
curl http://localhost:3003/metrics
```

---

# 6. Testing

## 6.1 Run All Tests

```bash
# Run tests for all packages
bun run test
```

## 6.2 Run Tests for Specific Service

```bash
# Ingestion service tests
cd apps/ingestion-service
bun test

# Processing service tests
cd apps/processing-service
bun test
```

## 6.3 Run Type Checking

```bash
# Type check all packages
bun run typecheck
```

## 6.4 Run Linting

```bash
# Lint all packages
bun run lint
```

---

# 7. Simulate Telemetry Data (Optional)

## 7.1 Send Test Telemetry via MQTT

Use an MQTT client to publish test telemetry:

```bash
# Using mosquitto_pub (install with: apt install mosquitto-clients)
mosquitto_pub -t "telemetry/device-001" -m '{
  "deviceId": "device-001",
  "temperature": 105,
  "voltage": 240,
  "pressure": 145,
  "humidity": 75
}'
```

## 7.2 Send Test Telemetry via REST API

```bash
# POST telemetry to ingestion service
curl -X POST http://localhost:3000/telemetry \
  -H "Content-Type: application/json" \
  -d '{
    "deviceId": "device-001",
    "temperature": 105,
    "voltage": 240,
    "pressure": 145,
    "humidity": 75
  }'
```

## 7.3 Verify Event Flow

1. **Check Kafka** - Message should appear in `telemetry.raw` topic
2. **Check RabbitMQ** - Alert should appear in `alerts` queue
3. **Check PostgreSQL** - Telemetry should be stored
4. **Check API Gateway** - Query telemetry and alerts endpoints

---

# 8. Kubernetes Deployment (Optional)

## 8.1 Create Local KIND Cluster

```bash
# Install KIND if needed
brew install kind  # macOS
# or
sudo apt install kind  # Linux

# Create cluster
kind create cluster --name rtsp
```

## 8.2 Deploy Kubernetes Manifests

```bash
# Deploy namespace and configmaps
kubectl apply -f infra/kubernetes/base/

# Deploy infrastructure
kubectl apply -f infra/kubernetes/base/kafka.yaml
kubectl apply -f infra/kubernetes/base/zookeeper.yaml
kubectl apply -f infra/kubernetes/base/rabbitmq.yaml
kubectl apply -f infra/kubernetes/base/mqtt.yaml
kubectl apply -f infra/kubernetes/base/postgres.yaml

# Deploy application services
kubectl apply -f infra/kubernetes/apps/
```

## 8.3 Deploy Using Helm

```bash
# Add Helm chart dependencies (if needed)
cd infra/helm/safety-platform
helm dependency build

# Deploy chart
helm install rtsp ./safety-platform -n rtsp --create-namespace

# Verify deployment
kubectl get pods -n rtsp
```

---

# 9. Troubleshooting

## 9.1 Docker Issues

### Containers won't start
```bash
# Check logs
docker compose logs

# Restart specific service
docker compose restart kafka

# Clean up and restart
docker compose down -v
docker compose up -d
```

### Port already in use
```bash
# Find process using port
lsof -i :5432  # PostgreSQL
lsof -i :9092  # Kafka

# Kill the process or change port in docker-compose.yml
```

## 9.2 Bun/Workspace Issues

### Package not found
```bash
# Reinstall dependencies
bun install --force

# Clear cache
rm -rf node_modules
bun install
```

### TypeScript errors
```bash
# Rebuild all packages
bun run build

# Type check specific package
cd libs/domain
bun run typecheck
```

## 9.3 Service Connection Issues

### Kafka connection failed
```bash
# Verify Kafka is running
docker compose ps kafka

# Check Kafka logs
docker compose logs kafka

# Test Kafka connection
docker compose exec kafka kafka-broker-api-versions --bootstrap-server localhost:9092
```

### RabbitMQ connection failed
```bash
# Check RabbitMQ status
docker compose ps rabbitmq

# Access management UI
# http://localhost:15672 (rtsp/rtsp)
```

### PostgreSQL connection failed
```bash
# Check PostgreSQL logs
docker compose logs postgres

# Test connection
docker compose exec postgres pg_isready -U rtsp
```

## 9.4 NestJS Service Won't Start

```bash
# Check for missing dependencies
bun install

# Verify TypeScript compiles
bun run build

# Check environment variables
echo $NODE_ENV

# Run with verbose logging
DEBUG=* bun run dev
```

---

# 10. Quick Reference Commands

## Start Everything
```bash
cd infra/docker
docker compose up -d
```

## Stop Everything
```bash
cd infra/docker
docker compose down
```

## View Logs
```bash
docker compose logs -f
docker compose logs -f ingestion-service
```

## Rebuild Services
```bash
docker compose build --no-cache
docker compose up -d
```

## Run Tests
```bash
bun run test
```

## Health Check All Services
```bash
for port in 3000 3001 3002 3003; do
  echo "Checking service on port $port..."
  curl -s http://localhost:$port/health | jq .
done
```

---

# 11. Architecture Summary

```
┌─────────────┐     MQTT      ┌─────────────┐    Kafka    ┌─────────────┐   RabbitMQ   ┌─────────────┐
│ IoT Devices │ ────────────►│ Ingestion   │ ──────────► │ Processing  │ ────────────►│   Alert     │
└─────────────┘   (1883)      │  Service    │   (9092)    │  Service    │   (5672)     │  Service    │
                              │  (3000)     │             │  (3001)     │              │  (3002)     │
                              └─────────────┘             └─────────────┘              └─────────────┘
                                      │                            │
                                      │                            ▼
                                      │                    ┌─────────────┐
                                      │                    │  PostgreSQL │
                                      │                    │   (5432)    │
                                      │                    └─────────────┘
                                      ▼
                              ┌─────────────┐
                              │  API Gateway│
                              │   (3003)    │
                              └─────────────┘
```
