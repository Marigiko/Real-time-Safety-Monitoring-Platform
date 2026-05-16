# AGENTS.md - Real-time Safety Monitoring Platform

## Project Status

This is an **infrastructure scaffold** - directory structure and config files exist but no application code has been committed yet. Package.json, tsconfig, and most config files are empty.

## Architecture Overview

```
infra/
├── docker/          # Docker setup (base.Dockerfile, docker-compose.yml)
├── kubernetes/      # K8s manifests - base/ and apps/ subdirs
├── helm/            # Helm charts for deployment
├── scripts/         # deploy-local.sh, deploy-eks.sh, bootstrap.sh, destroy.sh
├── terraform/       # AWS: VPC, RDS, EKS, ECR
ci/github/           # GitHub Actions: build.yml, test.yml, deploy.yml
configs/
├── topics.ts        # (empty - TypeScript config for Kafka topics)
└── env/             # dev.env, prod.env
```

## Intended Services (from K8s manifests)

- **ingestion-service** - Data ingestion
- **processing-service** - Real-time processing
- **alert-service** - Alert management
- **api-gateway** - API entrypoint

## Infrastructure Stack

- **Compute**: Kubernetes (EKS)
- **Messaging**: Kafka, MQTT, RabbitMQ, Zookeeper
- **Storage**: PostgreSQL (RDS)
- **Container Registry**: ECR

## Commands

No application code exists yet. To initialize:

1. Create package.json with dependencies
2. Implement services in `src/` (ingestion, processing, alert, gateway)
3. Configure Dockerfiles per service
4. Populate `configs/topics.ts` for Kafka topics

## Development Workflow

```bash
# Local development with Docker Compose
./infra/scripts/deploy-local.sh

# Deploy to EKS
./infra/scripts/deploy-eks.sh
```

## CI/CD

GitHub Actions workflows in `ci/github/`:
- `build.yml` - Build and push Docker images
- `test.yml` - Run tests
- `deploy.yml` - Deploy to EKS

## Notes

- All infra config files (Terraform, K8s, Helm) are currently empty placeholders
- No lint/typecheck/test commands available until code is added
- Environment configs in `configs/env/` exist but are empty