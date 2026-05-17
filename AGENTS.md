# AGENTS.md - Real-time Safety Monitoring Platform

## Project Status

**Foundation Phase Complete** - Monorepo, Docker, Kubernetes, Helm, Terraform, CI/CD initialized.

## Architecture Overview

```
apps/
├── ingestion-service/    # MQTT → Kafka
├── processing-service/     # Kafka → PostgreSQL + RabbitMQ
├── alert-service/         # RabbitMQ consumer
└── api-gateway/           # REST API

libs/
├── domain/                # Entities, value objects, repository interfaces
├── application/           # Use cases, service interfaces
├── infrastructure/        # Kafka, RabbitMQ, MQTT, Database modules
├── contracts/             # Event schemas
└── shared/                # Logger, validation, health, metrics

infra/
├── docker/                # Dockerfiles, docker-compose.yml
├── kubernetes/            # K8s manifests (base + apps)
├── helm/                  # Helm chart (safety-platform)
├── terraform/             # AWS infrastructure (VPC, EKS, RDS, ECR)
└── scripts/               # Deployment scripts

ci/github/
├── build.yml              # Build and push Docker images
├── test.yml               # Run tests
└── deploy.yml             # Deploy to EKS

configs/
├── env/                   # dev.env, prod.env
└── topics.ts              # Kafka topics config
```

## Infrastructure Stack

- **Compute**: Kubernetes (EKS)
- **Messaging**: Kafka, MQTT, RabbitMQ, Zookeeper
- **Storage**: PostgreSQL (RDS)
- **Container Registry**: ECR

## Implemented Services

- **ingestion-service** (port 3000) - MQTT consumer → Kafka producer
- **processing-service** (port 3001) - Kafka consumer → PostgreSQL + RabbitMQ
- **alert-service** (port 3002) - RabbitMQ consumer → notifications
- **api-gateway** (port 3003) - REST API with telemetry/alerts endpoints

## Commands

```bash
# Install dependencies
bun install

# Build all services
bun run build

# Run tests
bun run test

# Local development with Docker Compose
docker-compose -f infra/docker/docker-compose.yml up -d

# Deploy to EKS (requires AWS credentials)
./infra/scripts/deploy-eks.sh
```

## CI/CD

GitHub Actions workflows in `ci/github/`:
- `build.yml` - Builds and pushes Docker images to ECR
- `test.yml` - Runs unit tests
- `deploy.yml` - Deploys to EKS on integration/release branches

## Active Development

The following services are partially implemented (skeleton only):
- **Phase 7-10** - Application services need business logic implementation

## Next Steps

1. Implement MQTT consumer in ingestion-service
2. Implement Kafka producer in ingestion-service
3. Implement Kafka consumer in processing-service
4. Implement alert detection logic
5. Implement database repositories
6. Implement RabbitMQ integrations
7. Implement REST controllers in API Gateway
8. Add unit tests for all services

## Architecture Constraints

- Must follow DDD principles (domain → application → infrastructure)
- Must use Bun as package manager
- Must use NestJS framework
- Must use TypeScript strict mode
- Must maintain clean separation of concerns
- All services must have health endpoints at /health
- All services must expose metrics at /metrics