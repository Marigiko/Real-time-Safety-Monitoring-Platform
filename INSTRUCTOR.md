# INSTRUCTOR.md

# Real-Time Safety Monitoring Platform (RTSP) — Implementation Guide

This document transforms the ROADMAP.md into small, actionable tasks for autonomous coding agents.

---

# AGENT EXECUTION PROTOCOL

## BEFORE IMPLEMENTING ANY CHANGE

The agent MUST:

1. Identify the exact section of `ROADMAP.md` or `INSTRUCTOR.md` that authorizes the change.
2. Explain briefly:
   - why the change exists
   - which architecture requirement it satisfies
   - which phase it belongs to
3. Ask for explicit confirmation BEFORE modifying code.

Example format:

```text
Requested Change:
- Add Kafka Producer

Source:
- ROADMAP.md → Phase 7 — Ingestion Service

Justification:
- Required to publish telemetry events into the event-driven pipeline.

Awaiting approval before implementation.
```

## BEFORE IMPLEMENTING A FEATURE

The agent MUST:

- explain the impacted architecture layers
- explain affected services
- explain infrastructure dependencies
- explain testing requirements
- explain deployment implications

Then WAIT for approval.

## AFTER IMPLEMENTING A FEATURE

The agent MUST:

- Summarize changes.
- List created/modified files.
- Explain architectural decisions.
- Explain tests added.
- Explain deployment impacts.
- Suggest the next logical task.

---

# Phase 1 — Monorepo Initialization

## Objective

Set up the monorepo workspace with Bun, NestJS services, and shared libraries.

## Required Architecture Rules

- Use Bun as package manager and runtime
- Use NestJS framework for all services
- Use TypeScript strict mode
- Organize code using DDD principles
- Use Bun workspaces for monorepo management

## Tasks

### Task 1.1 — Initialize Bun Workspace

#### Goal

Create the root workspace configuration for the monorepo.

#### Implementation Steps

1. Create `package.json` in root with:
   - `"name": "rtsp-monorepo"`
   - `"private": true`
   - `"workspaces": ["apps/*", "libs/*"]`
2. Create `tsconfig.base.json` with:
   - `"compilerOptions": {"strict": true, "declaration": true, "declarationMap": true, "sourceMap": true}`
   - Path mapping for apps and libs

#### Expected Files

- `package.json` (root)
- `tsconfig.base.json`

#### Validation

- Run `bun install` — should succeed
- Run `bun run test` — should show no tests yet

#### Constraints

- Do NOT add any service code yet

---

### Task 1.2 — Create Shared Libraries Structure

#### Goal

Create the DDD-based shared library structure.

#### Implementation Steps

1. Create `libs/domain/src/index.ts` — empty export
2. Create `libs/application/src/index.ts` — empty export
3. Create `libs/infrastructure/src/index.ts` — empty export
4. Create `libs/contracts/src/index.ts` — empty export
5. Create `libs/shared/src/index.ts` — empty export

#### Expected Files

- `libs/domain/package.json`
- `libs/domain/tsconfig.json`
- `libs/domain/src/index.ts`
- `libs/application/package.json`
- `libs/application/tsconfig.json`
- `libs/application/src/index.ts`
- `libs/infrastructure/package.json`
- `libs/infrastructure/tsconfig.json`
- `libs/infrastructure/src/index.ts`
- `libs/contracts/package.json`
- `libs/contracts/tsconfig.json`
- `libs/contracts/src/index.ts`
- `libs/shared/package.json`
- `libs/shared/tsconfig.json`
- `libs/shared/src/index.ts`

#### Validation

- All libs must have valid `package.json` with workspace reference
- Run `bun run build` — should build all libs

#### Constraints

- Each lib must have its own tsconfig extending base
- Do NOT add implementation code yet

---

### Task 1.3 — Create NestJS Service Skeletons

#### Goal

Create the four application services as NestJS applications.

#### Implementation Steps

For each service (ingestion-service, processing-service, alert-service, api-gateway):

1. Create `apps/<service>/package.json` with:
   - `"name": "@rtsp/<service>"`
   - `"main": "dist/main.js"`
   - NestJS dependencies
2. Create `apps/<service>/tsconfig.json` extending base
3. Create `apps/<service>/src/main.ts` with basic NestJS bootstrap
4. Create `apps/<service>/src/app.module.ts` with empty module

#### Expected Files

- `apps/ingestion-service/package.json`
- `apps/ingestion-service/tsconfig.json`
- `apps/ingestion-service/src/main.ts`
- `apps/ingestion-service/src/app.module.ts`
- `apps/processing-service/package.json`
- `apps/processing-service/tsconfig.json`
- `apps/processing-service/src/main.ts`
- `apps/processing-service/src/app.module.ts`
- `apps/alert-service/package.json`
- `apps/alert-service/tsconfig.json`
- `apps/alert-service/src/main.ts`
- `apps/alert-service/src/app.module.ts`
- `apps/api-gateway/package.json`
- `apps/api-gateway/tsconfig.json`
- `apps/api-gateway/src/main.ts`
- `apps/api-gateway/src/app.module.ts`

#### Validation

- Run `bun install` — should install all dependencies
- Run each service with `bun run start:dev` — should start without errors

#### Constraints

- Use NestJS 10.x
- Do NOT add business logic yet

---

# Phase 2 — Docker Infrastructure

## Objective

Create Dockerfiles for all services and configure local docker-compose stack.

## Required Architecture Rules

- Use multi-stage Docker builds
- Use Node Alpine base images
- Each service must have its own Dockerfile
- All services must run in docker-compose for local development
- Use shared Docker network for inter-service communication

## Tasks

### Task 2.1 — Create Service Dockerfiles

#### Goal

Create Dockerfiles for each NestJS service.

#### Implementation Steps

For each service in `apps/<service>`:

1. Create `Dockerfile` with:
   - Stage 1: Build - install deps, build TypeScript
   - Stage 2: Runtime - copy built artifacts, install only production deps
   - Use Node:20-alpine
   - Expose port 3000
   - Set `NODE_ENV=production`

#### Expected Files

- `apps/ingestion-service/Dockerfile`
- `apps/processing-service/Dockerfile`
- `apps/alert-service/Dockerfile`
- `apps/api-gateway/Dockerfile`

#### Validation

- Build each image: `docker build -t rtsp/<service> .`
- Verify image size is minimal

#### Constraints

- Do NOT include dev dependencies in final image
- Must use non-root user

---

### Task 2.2 — Create Base Docker Image

#### Goal

Create the shared base Dockerfile for common tooling.

#### Implementation Steps

1. Update `infra/docker/base.Dockerfile`:
   - Node:20-alpine base
   - Install bun globally
   - Install common CLI tools
   - Set up non-root user

#### Expected Files

- `infra/docker/base.Dockerfile`

#### Validation

- Build base image: `docker build -f infra/docker/base.Dockerfile -t rtsp/base .`

#### Constraints

- Do NOT include service-specific code

---

### Task 2.3 — Configure Docker Compose

#### Goal

Configure the local development environment with all services.

#### Implementation Steps

1. Update `infra/docker/docker-compose.yml`:
   - Add all 4 application services
   - Add Kafka (port 9092)
   - Add Zookeeper (port 2181)
   - Add RabbitMQ (port 5672, 15672)
   - Add MQTT (port 1883)
   - Add PostgreSQL (port 5432)
   - Configure environment variables
   - Set up healthchecks
   - Configure volume mounts for development

#### Expected Files

- `infra/docker/docker-compose.yml`

#### Validation

- Run `docker-compose up -d` — all services should start
- Check logs for errors

#### Constraints

- Must use named volumes for persistence
- Must expose all required ports

---

# Phase 3 — Kubernetes (Manual YAML)

## Objective

Create Kubernetes manifests for all services and infrastructure components.

## Required Architecture Rules

- Use Kubernetes namespace for isolation
- Use ConfigMaps for configuration
- Use Services for internal communication
- Use Deployments with proper replicas
- Add readiness and liveness probes

## Tasks

### Task 3.1 — Create Namespace and Base Resources

#### Goal

Set up the Kubernetes namespace and base infrastructure.

#### Implementation Steps

1. Create `infra/kubernetes/base/namespace.yaml` — define `rtsp` namespace
2. Create `infra/kubernetes/base/configmaps.yaml` — define environment config

#### Expected Files

- `infra/kubernetes/base/namespace.yaml`
- `infra/kubernetes/base/configmaps.yaml`

#### Validation

- Apply: `kubectl apply -f infra/kubernetes/base/namespace.yaml`
- Verify: `kubectl get namespace rtsp`

#### Constraints

- Namespace name must be `rtsp`

---

### Task 3.2 — Deploy Infrastructure Components

#### Goal

Deploy Kafka, Zookeeper, RabbitMQ, MQTT, and PostgreSQL.

#### Implementation Steps

For each component:

1. Create deployment in `infra/kubernetes/base/<component>.yaml`:
   - Use official Helm charts or community manifests
   - Configure resource limits
   - Set environment variables
   - Add persistence if needed

#### Expected Files

- `infra/kubernetes/base/zookeeper.yaml`
- `infra/kubernetes/base/kafka.yaml`
- `infra/kubernetes/base/rabbitmq.yaml`
- `infra/kubernetes/base/mqtt.yaml`
- `infra/kubernetes/base/postgres.yaml`

#### Validation

- Apply all: `kubectl apply -f infra/kubernetes/base/`
- Verify pods: `kubectl get pods -n rtsp`

#### Constraints

- Use appropriate resource requests/limits
- Must have proper storage class

---

### Task 3.3 — Deploy Application Services

#### Goal

Deploy all four application services to Kubernetes.

#### Implementation Steps

For each service in `infra/kubernetes/apps/<service>-deployment.yaml`:

1. Create Deployment with:
   - Image pull policy
   - Environment variables from ConfigMap
   - Readiness probe on port 3000/health
   - Liveness probe on port 3000/health
   - Resource limits
2. Create Service (ClusterIP) for internal communication

#### Expected Files

- `infra/kubernetes/apps/ingestion-deployment.yaml`
- `infra/kubernetes/apps/processing-deployment.yaml`
- `infra/kubernetes/apps/alert-deployment.yaml`
- `infra/kubernetes/apps/api-gateway.yaml`

#### Validation

- Apply all: `kubectl apply -f infra/kubernetes/apps/`
- Verify: `kubectl get pods -n rtsp`

#### Constraints

- Use specific image tags (not latest)
- Must have proper resource limits

---

# Phase 4 — Helm Migration

## Objective

Convert Kubernetes YAML manifests to Helm templates for reusable deployments.

## Required Architecture Rules

- All Kubernetes manifests must be Helm templates
- Use values.yaml for configuration
- Support multiple environments (dev, staging, prod)
- Use Helm hooks for lifecycle management

## Tasks

### Task 4.1 — Create Helm Chart Structure

#### Goal

Create the Helm chart foundation.

#### Implementation Steps

1. Create `infra/helm/Chart.yaml` with:
   - name: rtsp
   - version: 0.1.0
   - appVersion: 0.1.0
2. Create directory structure:
   - `infra/helm/templates/`
   - `infra/helm/values.yaml`
   - `infra/helm/.helmignore`

#### Expected Files

- `infra/helm/Chart.yaml`
- `infra/helm/values.yaml`
- `infra/helm/.helmignore`

#### Validation

- Run `helm lint infra/helm/` — should pass

#### Constraints

- Chart must be valid Helm 3 format

---

### Task 4.2 — Create Helm Templates

#### Goal

Convert all Kubernetes manifests to Helm templates.

#### Implementation Steps

1. Convert `namespace.yaml` → `templates/namespace.yaml` with .Values.namespace
2. Convert infrastructure deployments → `templates/infrastructure/`
3. Convert app deployments → `templates/deployments.yaml` with .Values.services
4. Convert services → `templates/services.yaml`
5. Convert ingress (optional) → `templates/ingress.yaml`

#### Expected Files

- `infra/helm/templates/namespace.yaml`
- `infra/helm/templates/deployments.yaml`
- `infra/helm/templates/services.yaml`
- `infra/helm/templates/ingress.yaml`
- `infra/helm/templates/configmap.yaml`

#### Validation

- Run `helm template release-name infra/helm/` — should render valid YAML

#### Constraints

- Must use Helm templating syntax `{{ .Values.key }}`
- Must not break existing Kubernetes manifests

---

### Task 4.3 — Configure Environment Values

#### Goal

Set up environment-specific values files.

#### Implementation Steps

1. Update `infra/helm/values.yaml` with defaults
2. Create `configs/env/dev.env` with development values
3. Create `configs/env/prod.env` with production values

#### Expected Files

- `infra/helm/values.yaml` (updated with full config)
- `configs/env/dev.env`
- `configs/env/prod.env`

#### Validation

- Run `helm template dev-release infra/helm/ -f configs/env/dev.env`

#### Constraints

- Secrets must not be in values.yaml (use secrets)

---

# Phase 5 — Terraform Infrastructure

## Objective

Provision AWS infrastructure using Terraform (EKS, RDS, ECR, networking).

## Required Architecture Rules

- Use Terraform 1.x
- Use modules for organization
- Store state in S3 with DynamoDB locking
- Use variables for environment-specific configuration
- Follow AWS best practices (VPC, security groups, IAM)

## Tasks

### Task 5.1 — Configure Terraform Provider

#### Goal

Set up Terraform configuration and provider.

#### Implementation Steps

1. Update `infra/terraform/provider.tf`:
   - Configure AWS provider
   - Set region from variables
   - Configure remote state backend (S3)

#### Expected Files

- `infra/terraform/provider.tf` (updated)
- `infra/terraform/backend.tf` (optional)

#### Validation

- Run `terraform init` — should initialize successfully

#### Constraints

- Must use AWS provider 5.x

---

### Task 5.2 — Create VPC and Networking

#### Goal

Provision the AWS VPC infrastructure.

#### Implementation Steps

1. Update `infra/terraform/vpc.tf`:
   - Create VPC with CIDR 10.0.0.0/16
   - Create 3 public subnets
   - Create 3 private subnets
   - Create Internet Gateway
   - Create NAT Gateways
   - Create route tables

#### Expected Files

- `infra/terraform/vpc.tf` (updated with full config)

#### Validation

- Run `terraform plan` — should show VPC resources

#### Constraints

- Must use modules for reusability

---

### Task 5.3 — Create EKS Cluster

#### Goal

Provision the EKS cluster.

#### Implementation Steps

1. Update `infra/terraform/eks.tf`:
   - Create EKS cluster
   - Create node groups (managed)
   - Configure IAM role for nodes
   - Add cluster security group

#### Expected Files

- `infra/terraform/eks.tf` (updated with full config)

#### Validation

- Run `terraform plan` — should show EKS resources

#### Constraints

- Must use managed node groups
- Must configure Kubernetes version

---

### Task 5.4 — Create RDS PostgreSQL

#### Goal

Provision the PostgreSQL database.

#### Implementation Steps

1. Update `infra/terraform/rds.tf`:
   - Create RDS PostgreSQL instance
   - Configure multi-AZ for production
   - Set up security groups
   - Configure backup retention

#### Expected Files

- `infra/terraform/rds.tf` (updated with full config)

#### Validation

- Run `terraform plan` — should show RDS resources

#### Constraints

- Must use PostgreSQL 15+
- Must enable encryption

---

### Task 5.5 — Create ECR Repositories

#### Goal

Create container registries for all services.

#### Implementation Steps

1. Update `infra/terraform/ecr.tf`:
   - Create ECR repository for each service
   - Configure lifecycle policies
   - Set up image scanning

#### Expected Files

- `infra/terraform/ecr.tf` (updated with full config)

#### Validation

- Run `terraform plan` — should show ECR resources

#### Constraints

- Must enable image scanning on push

---

# Phase 6 — CI/CD

## Objective

Configure GitHub Actions pipelines for build, test, and deployment.

## Required Architecture Rules

- Use GitHub Actions
- Must trigger on PR and push to integration/release
- Must build and push Docker images to ECR
- Must run tests before deployment
- Must deploy to EKS using Helm

## Tasks

### Task 6.1 — Create Build Pipeline

#### Goal

Build Docker images on code changes.

#### Implementation Steps

1. Update `ci/github/build.yml`:
   - Trigger on push to integration* and release
   - Checkout code
   - Setup Bun
   - Install dependencies
   - Run lint and typecheck
   - Build TypeScript
   - Build Docker images for each service
   - Push images to ECR

#### Expected Files

- `ci/github/build.yml` (updated with full config)

#### Validation

- Run workflow manually — should build all images

#### Constraints

- Must use matrix strategy for parallel builds

---

### Task 6.2 — Create Test Pipeline

#### Goal

Run all tests in CI.

#### Implementation Steps

1. Update `ci/github/test.yml`:
   - Trigger on all PRs and pushes
   - Checkout code
   - Setup Bun
   - Install dependencies
   - Run unit tests for all services
   - Run integration tests (if possible)
   - Upload coverage reports

#### Expected Files

- `ci/github/test.yml` (updated with full config)

#### Validation

- Run workflow — should execute all tests

#### Constraints

- Must fail if any test fails

---

### Task 6.3 — Create Deploy Pipeline

#### Goal

Deploy to EKS on integration and release branches.

#### Implementation Steps

1. Update `ci/github/deploy.yml`:
   - Trigger on push to integration* and release
   - Checkout code
   - Configure AWS credentials
   - Update Kubernetes config
   - Update Helm chart values
   - Run `helm upgrade --install`
   - Verify deployment

#### Expected Files

- `ci/github/deploy.yml` (updated with full config)

#### Validation

- Run workflow — should deploy to EKS

#### Constraints

- Must wait for deployment rollout

---

# Phase 7 — Ingestion Service

## Objective

Implement MQTT consumer that validates and publishes telemetry to Kafka.

## Required Architecture Rules

- Use NestJS with DDD structure
- Follow TDD workflow
- Use Clean Architecture (domain → application → infrastructure)
- Publish events to Kafka topic `telemetry.raw`

## Tasks

### Task 7.1 — Create Domain Layer

#### Goal

Define the domain models and interfaces.

#### Implementation Steps

1. In `libs/domain/src`:
   - Create `telemetry.entity.ts` — deviceId, timestamp, payload, readings
   - Create `telemetry-value-object.ts` — validate readings structure
   - Create `telemetry-repository.interface.ts` — repository contract
   - Create `index.ts` — export all domain types

#### Expected Files

- `libs/domain/src/telemetry.entity.ts`
- `libs/domain/src/telemetry-value-object.ts`
- `libs/domain/src/telemetry-repository.interface.ts`
- `libs/domain/src/index.ts`

#### Validation

- Run `bun run build` — domain lib builds

#### Constraints

- No infrastructure dependencies in domain

---

### Task 7.2 — Create Application Layer

#### Goal

Define use cases for telemetry ingestion.

#### Implementation Steps

1. In `libs/application/src`:
   - Create `ingest-telemetry.usecase.ts` — validate and process telemetry
   - Create `telemetry.service.interface.ts` — service contract
   - Create `index.ts` — export all use cases

#### Expected Files

- `libs/application/src/ingest-telemetry.usecase.ts`
- `libs/application/src/telemetry.service.interface.ts`
- `libs/application/src/index.ts`

#### Validation

- Run `bun run build` — application lib builds

#### Constraints

- Use dependency injection for infrastructure

---

### Task 7.3 — Create MQTT Consumer

#### Goal

Consume telemetry from MQTT broker.

#### Implementation Steps

1. In `apps/ingestion-service/src`:
   - Install `mqtt` package
   - Create `mqtt/mqtt-client.service.ts` — connect to MQTT broker
   - Create `mqtt/telemetry-mqtt.gateway.ts` — handle incoming messages
   - Update `app.module.ts` — import MqttModule

#### Expected Files

- `apps/ingestion-service/src/mqtt/mqtt-client.service.ts`
- `apps/ingestion-service/src/mqtt/telemetry-mqtt.gateway.ts`
- `apps/ingestion-service/src/app.module.ts` (updated)

#### Validation

- Connect to MQTT broker locally
- Receive test messages

#### Constraints

- Handle reconnection automatically

---

### Task 7.4 — Create Kafka Producer

#### Goal

Publish validated telemetry to Kafka.

#### Implementation Steps

1. In `apps/ingestion-service/src`:
   - Install `kafkajs` package
   - Create `kafka/kafka-producer.service.ts` — produce to `telemetry.raw` topic
   - Create `kafka/kafka.module.ts` — Kafka configuration
   - Update `app.module.ts` — import KafkaModule
   - Connect MQTT consumer to Kafka producer

#### Expected Files

- `apps/ingestion-service/src/kafka/kafka-producer.service.ts`
- `apps/ingestion-service/src/kafka/kafka.module.ts`
- `apps/ingestion-service/src/app.module.ts` (updated)

#### Validation

- Send test MQTT message → verify appears in Kafka

#### Constraints

- Use async produce (non-blocking)

---

### Task 7.5 — Add Unit Tests

#### Goal

Test ingestion service with TDD.

#### Implementation Steps

1. In `apps/ingestion-service/src`:
   - Create `__tests__/` directory
   - Test MQTT message parsing
   - Test telemetry validation
   - Test Kafka producer calls
   - Test error handling

#### Expected Files

- `apps/ingestion-service/src/__tests__/telemetry-validation.spec.ts`
- `apps/ingestion-service/src/__tests__/kafka-producer.spec.ts`

#### Validation

- Run `bun test` — all tests pass

#### Constraints

- Minimum one test per feature

---

# Phase 8 — Processing Service

## Objective

Consume Kafka events, detect dangerous conditions, store in PostgreSQL, publish alerts to RabbitMQ.

## Required Architecture Rules

- Use NestJS with DDD structure
- Follow TDD workflow
- Use Clean Architecture
- Consume from Kafka topic `telemetry.raw`
- Produce to RabbitMQ queue `alerts`
- Store telemetry in PostgreSQL

## Tasks

### Task 8.1 — Create Domain Layer

#### Goal

Define domain models for processing.

#### Implementation Steps

1. In `libs/domain/src`:
   - Add `alert.entity.ts` — alertId, deviceId, severity, message, timestamp
   - Add `alert-type.value-object.ts` — CRITICAL, WARNING, INFO
   - Add `processing-result.entity.ts` — processed telemetry result

#### Expected Files

- `libs/domain/src/alert.entity.ts`
- `libs/domain/src/alert-type.value-object.ts`
- `libs/domain/src/processing-result.entity.ts`

#### Validation

- Run `bun run build` — domain lib builds

---

### Task 8.2 — Create Kafka Consumer

#### Goal

Consume telemetry events from Kafka.

#### Implementation Steps

1. In `apps/processing-service/src`:
   - Install `kafkajs` package
   - Create `kafka/kafka-consumer.service.ts` — consume from `telemetry.raw`
   - Create `kafka/kafka.module.ts` — Kafka configuration
   - Update `app.module.ts` — import KafkaModule

#### Expected Files

- `apps/processing-service/src/kafka/kafka-consumer.service.ts`
- `apps/processing-service/src/kafka/kafka.module.ts`
- `apps/processing-service/src/app.module.ts` (updated)

#### Validation

- Consume test messages from Kafka

---

### Task 8.3 — Create Alert Detection Logic

#### Goal

Detect dangerous conditions from telemetry.

#### Implementation Steps

1. In `apps/processing-service/src`:
   - Create `alerting/alert-detector.service.ts`:
     - Check temperature > 100°C → CRITICAL
     - Check voltage > 250V → CRITICAL
     - Check pressure > 150 PSI → WARNING
     - Check humidity > 80% → WARNING
   - Create `alerting/alert-detector.module.ts`

#### Expected Files

- `apps/processing-service/src/alerting/alert-detector.service.ts`
- `apps/processing-service/src/alerting/alert-detector.module.ts`

#### Validation

- Run unit tests for each detection rule

---

### Task 8.4 — Create PostgreSQL Repository

#### Goal

Store telemetry data in PostgreSQL.

#### Implementation Steps

1. In `apps/processing-service/src`:
   - Install `pg` and typeorm
   - Create `database/telemetry.entity.ts` — TypeORM entity
   - Create `database/telemetry.repository.ts` — repository implementation
   - Create `database/database.module.ts`

#### Expected Files

- `apps/processing-service/src/database/telemetry.entity.ts`
- `apps/processing-service/src/database/telemetry.repository.ts`
- `apps/processing-service/src/database/database.module.ts`

#### Validation

- Run `docker-compose up postgres` and test connection

---

### Task 8.5 — Create RabbitMQ Producer

#### Goal

Publish alerts to RabbitMQ.

#### Implementation Steps

1. In `apps/processing-service/src`:
   - Install `amqplib` package
   - Create `messaging/alert-publisher.service.ts` — publish to `alerts` queue
   - Create `messaging/messaging.module.ts`
   - Connect alert detection to publisher

#### Expected Files

- `apps/processing-service/src/messaging/alert-publisher.service.ts`
- `apps/processing-service/src/messaging/messaging.module.ts`

#### Validation

- Verify alerts appear in RabbitMQ queue

---

### Task 8.6 — Add Integration Tests

#### Goal

Test processing service end-to-end.

#### Implementation Steps

1. In `apps/processing-service/src/__tests__/`:
   - Test Kafka consumer → alert detection → RabbitMQ publish
   - Test Kafka consumer → PostgreSQL storage

#### Expected Files

- `apps/processing-service/src/__tests__/processing-flow.spec.ts`

#### Validation

- Run `bun test` — all tests pass

---

# Phase 9 — Alert Service

## Objective

Consume RabbitMQ alerts and trigger notification handlers.

## Required Architecture Rules

- Use NestJS with DDD structure
- Follow TDD workflow
- Consume from RabbitMQ queue `alerts`
- Support multiple notification handlers (placeholder for future)
- Use clean separation between consumption and handling

## Tasks

### Task 9.1 — Create RabbitMQ Consumer

#### Goal

Consume alert messages from RabbitMQ.

#### Implementation Steps

1. In `apps/alert-service/src`:
   - Install `amqplib` package
   - Create `messaging/alert-consumer.service.ts` — consume from `alerts` queue
   - Create `messaging/messaging.module.ts`
   - Update `app.module.ts`

#### Expected Files

- `apps/alert-service/src/messaging/alert-consumer.service.ts`
- `apps/alert-service/src/messaging/messaging.module.ts`
- `apps/alert-service/src/app.module.ts` (updated)

#### Validation

- Consume test alerts from RabbitMQ

---

### Task 9.2 — Create Notification Handlers

#### Goal

Create handler infrastructure for alerts.

#### Implementation Steps

1. In `apps/alert-service/src`:
   - Create `handlers/notification-handler.interface.ts`
   - Create `handlers/console-handler.service.ts` — log alerts (dev)
   - Create `handlers/handlers.module.ts`
   - Create `alert-processor.service.ts` — route alerts to handlers

#### Expected Files

- `apps/alert-service/src/handlers/notification-handler.interface.ts`
- `apps/alert-service/src/handlers/console-handler.service.ts`
- `apps/alert-service/src/handlers/handlers.module.ts`
- `apps/alert-service/src/alert-processor.service.ts`

#### Validation

- Alerts logged to console

#### Constraints

- Support adding SMS, Email, Slack handlers later

---

### Task 9.3 — Add Unit Tests

#### Goal

Test alert service.

#### Implementation Steps

1. In `apps/alert-service/src/__tests__/`:
   - Test alert routing to handlers
   - Test different alert severities

#### Expected Files

- `apps/alert-service/src/__tests__/alert-processor.spec.ts`

#### Validation

- Run `bun test` — all tests pass

---

# Phase 10 — API Gateway

## Objective

Expose REST APIs for telemetry data, alerts, and health checks.

## Required Architecture Rules

- Use NestJS with DDD structure
- Follow TDD workflow
- Expose endpoints for:
  - GET /telemetry — list telemetry
  - GET /alerts — list alerts
  - GET /health — health check
  - GET /metrics — Prometheus metrics

## Tasks

### Task 10.1 — Create REST Controllers

#### Goal

Expose REST API endpoints.

#### Implementation Steps

1. In `apps/api-gateway/src`:
   - Create `telemetry/telemetry.controller.ts` — GET /telemetry
   - Create `alerts/alerts.controller.ts` — GET /alerts
   - Create `health/health.controller.ts` — GET /health
   - Create `metrics/metrics.controller.ts` — GET /metrics

#### Expected Files

- `apps/api-gateway/src/telemetry/telemetry.controller.ts`
- `apps/api-gateway/src/alerts/alerts.controller.ts`
- `apps/api-gateway/src/health/health.controller.ts`
- `apps/api-gateway/src/metrics/metrics.controller.ts`

#### Validation

- curl each endpoint — returns expected response

---

### Task 10.2 — Create Database Queries

#### Goal

Query telemetry and alerts from PostgreSQL.

#### Implementation Steps

1. In `apps/api-gateway/src`:
   - Install typeorm and pg
   - Create `database/telemetry-query.service.ts`
   - Create `database/alerts-query.service.ts`
   - Create `database/database.module.ts`

#### Expected Files

- `apps/api-gateway/src/database/telemetry-query.service.ts`
- `apps/api-gateway/src/database/alerts-query.service.ts`
- `apps/api-gateway/src/database/database.module.ts`

#### Validation

- GET /telemetry returns data from PostgreSQL

---

### Task 10.3 — Add Unit Tests

#### Goal

Test API Gateway endpoints.

#### Implementation Steps

1. In `apps/api-gateway/src/__tests__/`:
   - Test telemetry endpoint
   - Test alerts endpoint
   - Test health endpoint

#### Expected Files

- `apps/api-gateway/src/__tests__/controllers.spec.ts`

#### Validation

- Run `bun test` — all tests pass

---

# Phase 11 — Observability

## Objective

Add Prometheus, Grafana, and centralized logging.

## Required Architecture Rules

- Use Prometheus for metrics
- Use Grafana for visualization
- Use Loki for log aggregation
- Use OpenTelemetry for tracing
- Expose /metrics endpoint on all services

## Tasks

### Task 11.1 — Add Prometheus Metrics

#### Goal

Expose Prometheus metrics from all services.

#### Implementation Steps

1. In each service:
   - Install `@nestjs/terminus` for health checks
   - Create metrics endpoint using prom-client
   - Add custom metrics: http_requests_total, processing_duration, alerts_total
   - Add /metrics to all services

#### Expected Files

- Updated `main.ts` in each service with metrics endpoint

#### Validation

- curl /metrics returns Prometheus format

---

### Task 11.2 — Configure Prometheus Deployment

#### Goal

Deploy Prometheus to Kubernetes.

#### Implementation Steps

1. Create `infra/kubernetes/observability/prometheus.yaml`:
   - Deploy Prometheus using Helm
   - Configure scrape targets for all services
   - Set up ServiceMonitor resources

#### Expected Files

- `infra/kubernetes/observability/prometheus.yaml`

#### Validation

- Prometheus UI accessible at /prometheus

---

### Task 11.3 — Configure Grafana Dashboard

#### Goal

Set up Grafana for visualization.

#### Implementation Steps

1. Create `infra/kubernetes/observability/grafana.yaml`:
   - Deploy Grafana using Helm
   - Add Prometheus data source
   - Create dashboards for each service

#### Expected Files

- `infra/kubernetes/observability/grafana.yaml`

#### Validation

- Grafana UI accessible with dashboards

---

# Phase 12 — Security

## Objective

Add authentication, authorization, and network security.

## Required Architecture Rules

- Use JWT for API authentication
- Use Kubernetes secrets for sensitive data
- Use IAM roles for AWS access
- Enable HTTPS on ingress
- Implement rate limiting

## Tasks

### Task 12.1 — Add JWT Authentication

#### Goal

Secure API Gateway endpoints.

#### Implementation Steps

1. In `apps/api-gateway/src`:
   - Install `@nestjs/passport` and `passport-jwt`
   - Create `auth/jwt.strategy.ts`
   - Create `auth/auth.guard.ts`
   - Apply auth guard to sensitive endpoints

#### Expected Files

- `apps/api-gateway/src/auth/jwt.strategy.ts`
- `apps/api-gateway/src/auth/auth.guard.ts`

#### Validation

- Unauthenticated requests return 401

---

### Task 12.2 — Configure Kubernetes Secrets

#### Goal

Manage secrets securely.

#### Implementation Steps

1. Update Helm templates:
   - Add secret templates for passwords and keys
   - Use external-secrets or AWS Secrets Manager
   - Update values.yaml with secret references

#### Expected Files

- Updated `infra/helm/templates/secrets.yaml`

#### Validation

- Secrets mounted as environment variables

---

### Task 12.3 — Configure Rate Limiting

#### Goal

Prevent API abuse.

#### Implementation Steps

1. In `apps/api-gateway/src`:
   - Install `express-rate-limit`
   - Configure global rate limit (100 req/min)
   - Apply to all endpoints

#### Expected Files

- `apps/api-gateway/src/middleware/rate-limit.middleware.ts`

#### Validation

- Rate limited requests return 429

---

# Phase 13 — Production Hardening

## Objective

Add horizontal autoscaling, resource limits, and deployment strategies.

## Required Architecture Rules

- Use HPA for horizontal autoscaling
- Set CPU/memory resource limits
- Configure readiness/liveness probes
- Support blue/green and canary deployments

## Tasks

### Task 13.1 — Configure Resource Limits

#### Goal

Set appropriate resource constraints.

#### Implementation Steps

1. Update `infra/helm/values.yaml`:
   - Set CPU requests/limits per service
   - Set memory requests/limits per service
   - Configure JVM heap if applicable

#### Expected Files

- `infra/helm/values.yaml` (updated)

#### Validation

- Pods scheduled with correct resources

---

### Task 13.2 — Configure Horizontal Pod Autoscaler

#### Goal

Enable automatic scaling.

#### Implementation Steps

1. Create `infra/helm/templates/hpa.yaml`:
   - Configure HPA for each service
   - Scale on CPU utilization > 70%
   - Scale on memory utilization > 80%
   - Set min/max replicas

#### Expected Files

- `infra/helm/templates/hpa.yaml`

#### Validation

- HPA created in Kubernetes

---

### Task 13.3 — Configure Deployment Strategies

#### Goal

Support blue/green and canary deployments.

#### Implementation Steps

1. Update `infra/helm/templates/deployments.yaml`:
   - Add `strategy.type: RollingUpdate`
   - Add `maxSurge` and `maxUnavailable`
   - Support canary via weighted Service

#### Expected Files

- `infra/helm/templates/deployments.yaml` (updated)

#### Validation

- Helm upgrade uses rolling update

---

# Shared Libraries — Additional Tasks

## Task S1 — Event Contracts

#### Goal

Define shared event schemas.

#### Implementation Steps

1. In `libs/contracts/src`:
   - Create `telemetry.event.ts` — schema for telemetry events
   - Create `alert.event.ts` — schema for alert events

#### Expected Files

- `libs/contracts/src/telemetry.event.ts`
- `libs/contracts/src/alert.event.ts`

---

## Task S2 — Shared Utilities

#### Goal

Create shared utilities.

#### Implementation Steps

1. In `libs/shared/src`:
   - Create `logger.service.ts` — Winston-based logger
   - Create `validation.pipe.ts` — NestJS validation pipe

#### Expected Files

- `libs/shared/src/logger.service.ts`
- `libs/shared/src/validation.pipe.ts`

---

## Task S3 — Infrastructure Library

#### Goal

Create reusable infrastructure components.

#### Implementation Steps

1. In `libs/infrastructure/src`:
   - Create `kafka/kafka.module.ts` — reusable Kafka module
   - Create `rabbitmq/rabbitmq.module.ts` — reusable RabbitMQ module
   - Create `mqtt/mqtt.module.ts` — reusable MQTT module
   - Create `database/database.module.ts` — reusable database module

#### Expected Files

- `libs/infrastructure/src/kafka/kafka.module.ts`
- `libs/infrastructure/src/rabbitmq/rabbitmq.module.ts`
- `libs/infrastructure/src/mqtt/mqtt.module.ts`
- `libs/infrastructure/src/database/database.module.ts`

---

# Implementation Order Summary

The recommended implementation order:

1. Phase 1 — Monorepo Initialization
2. Phase 2 — Docker Infrastructure
3. Phase 3 — Kubernetes (Manual YAML)
4. Phase 4 — Helm Migration
5. Phase 5 — Terraform Infrastructure
6. Phase 6 — CI/CD
7. Phase 7 — Ingestion Service
8. Phase 8 — Processing Service
9. Phase 9 — Alert Service
10. Phase 10 — API Gateway
11. Phase 11 — Observability
12. Phase 12 — Security
13. Phase 13 — Production Hardening

---

# END OF INSTRUCTOR.md