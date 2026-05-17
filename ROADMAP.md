# ROADMAP.md

# Real-Time Safety Monitoring Platform (RTSP)

## Overview

RTSP is a distributed real-time safety monitoring platform inspired by industrial and electrical hazard detection systems.

The platform simulates IoT devices publishing telemetry data through MQTT, processes events using Kafka and RabbitMQ, and exposes a cloud-native event-driven architecture deployed on Kubernetes.

The project is designed to demonstrate:

* Backend architecture
* Event-driven systems
* Distributed systems
* Cloud infrastructure
* Kubernetes orchestration
* Infrastructure as Code
* CI/CD automation
* DDD (Domain-Driven Design)
* TDD (Test-Driven Development)

---

# High-Level Architecture

```text
IoT Simulator
    ↓ MQTT
MQTT Broker
    ↓
Ingestion Service
    ↓ Kafka
Processing Service
    ↓ RabbitMQ
Alert Service
    ↓
PostgreSQL
```

---

# Core Technologies

## Backend

* NestJS
* Bun
* TypeScript

## Messaging & Streaming

* Kafka
* Zookeeper
* RabbitMQ
* MQTT

## Infrastructure

* Docker
* Kubernetes
* Helm
* Terraform
* AWS (EKS, RDS, ECR)

## CI/CD

* GitHub Actions

## Testing

* Jest
* TDD workflow

---

# Project Structure

```text
apps/
  ingestion-service/
  processing-service/
  alert-service/
  api-gateway/

libs/
  domain/
  application/
  infrastructure/
  contracts/

infra/
  docker/
  kubernetes/
  helm/
  terraform/
  scripts/
```

---

# DEVELOPMENT PHASES

---

# PHASE 1 — Monorepo Initialization

## Goals

* Configure Bun workspaces
* Initialize NestJS services
* Configure TypeScript base setup
* Configure shared libraries

## Deliverables

* [x] Root workspace (package.json, tsconfig.base.json, bunfig.toml)
* [x] Shared tsconfig
* [x] Initial microservices (4 NestJS services)
* [x] Shared domain libs (domain, application, infrastructure, contracts, shared)

**Status**: ✅ COMPLETED

---

# PHASE 2 — Docker Infrastructure

## Goals

* Create Dockerfiles for every service
* Configure multi-stage builds
* Configure local docker-compose stack

## Deliverables

* [x] Docker networking
* [x] Dockerized services (Dockerfiles for all 4 services)
* [x] Local distributed environment (docker-compose.yml)
* [x] Base Docker image

**Status**: ✅ COMPLETED

---

# PHASE 3 — Kubernetes (Manual YAML)

## Goals

* Create namespace
* Deploy Kafka + Zookeeper
* Deploy PostgreSQL
* Deploy RabbitMQ
* Deploy MQTT
* Deploy application services

## Deliverables

* [x] Production-like local cluster
* [x] Internal service networking
* [x] ConfigMaps
* [x] Persistent volumes

**Status**: ✅ COMPLETED

---

# PHASE 4 — Helm Migration

## Goals

* Convert all Kubernetes manifests to Helm templates
* Centralize environment configuration
* Enable reusable deployments

## Deliverables

* [x] Helm chart (safety-platform)
* [x] values.yaml
* [x] parametrized deployments

**Status**: ✅ COMPLETED

---

# PHASE 5 — Terraform Infrastructure

## Goals

* Provision AWS infrastructure
* Configure EKS cluster
* Configure RDS PostgreSQL
* Configure ECR repositories
* Configure networking and IAM

## Deliverables

* [x] Fully reproducible infrastructure
* [x] Cloud-native deployment environment

**Status**: ✅ COMPLETED

---

# PHASE 6 — CI/CD

## Goals

* Configure GitHub Actions
* Build and push Docker images
* Deploy automatically to EKS
* Integrate Helm deployments

## Deliverables

* [x] Automated pipeline
* [x] Automatic deployments
* [x] Rollout verification

**Status**: ✅ COMPLETED

---

# PHASE 7 — Ingestion Service

## Responsibilities

* Consume MQTT telemetry
* Validate device payloads
* Transform data into domain events
* Publish events to Kafka

## Status

* [x] Service skeleton with NestJS
* [ ] MQTT consumer implementation
* [ ] Kafka producer implementation
* [ ] Unit tests

---

# PHASE 8 — Processing Service

## Responsibilities

* Consume Kafka events
* Detect dangerous conditions
* Store telemetry in PostgreSQL
* Publish alerts to RabbitMQ

## Status

* [x] Service skeleton with NestJS
* [ ] Kafka consumer implementation
* [ ] Alert detection logic
* [ ] PostgreSQL repository
* [ ] RabbitMQ publisher

---

# PHASE 9 — Alert Service

## Responsibilities

* Consume RabbitMQ alerts
* Trigger notifications
* Simulate external integrations

## Status

* [x] Service skeleton with NestJS
* [ ] RabbitMQ consumer
* [ ] Notification handlers

---

# PHASE 10 — API Gateway

## Responsibilities

* Expose REST APIs
* Aggregate telemetry
* Provide health checks
* Expose metrics

## Status

* [x] Service skeleton with NestJS
* [ ] REST controllers
* [ ] Database queries
* [ ] Health endpoints

---

# PHASE 11 — Observability

## Goals

* Add Prometheus
* Add Grafana
* Add Loki
* Centralized logging
* Distributed tracing

**Status**: ⏳ PENDING

---

# PHASE 12 — Security

## Goals

* Kubernetes secrets
* IAM Roles
* JWT authentication
* API rate limiting
* HTTPS ingress

**Status**: ⏳ PENDING

---

# PHASE 13 — Production Hardening

## Goals

* Horizontal autoscaling
* Resource limits
* Readiness/Liveness probes
* Blue/Green deployment
* Canary deployments

**Status**: ⏳ PENDING

---

# FINAL OBJECTIVE

The final system should represent a real-world distributed backend platform demonstrating:

* Cloud-native architecture
* Event-driven communication
* Production-ready infrastructure
* Enterprise deployment workflows
* Professional engineering practices

# GIT_WORKFLOW.md

# Git Workflow & Branching Strategy

## Branching Model

This project follows a structured Git workflow to support parallel development, CI/CD, and controlled deployments.

---

# Main Branches

## release

Production-ready branch.

Rules:

* Only stable code is merged here.
* Every deployment to production comes from this branch.
* Direct commits are NOT allowed.

---

## integration[number]

Integration branches used to group related features before release.

Examples:

```text
integration1
integration2
integration-auth
```

Rules:

* Features are merged here through Pull Requests.
* Used for QA and validation.
* Can represent sprint/group milestones.

---

# Feature Branches

Every feature MUST have its own branch.

Format:

```text
feature/<feature-name>
```

Examples:

```text
feature/kafka-consumer
feature/mqtt-ingestion
feature/terraform-eks
feature/helm-deployment
feature/rabbitmq-alerts
```

Rules:

* One feature per branch.
* Branches are created from integration branches.
* Small and focused commits.
* No direct pushes to integration or release.

---

# Pull Request Rules

Every completed feature MUST:

1. Push changes to remote.
2. Open a Pull Request.
3. Target the correct integration branch.
4. Pass CI checks.
5. Be reviewed before merge.

---

# Pull Request Naming Convention

Format:

```text
[FEATURE] Short description
```

Examples:

```text
[FEATURE] Add Kafka producer
[FEATURE] Add MQTT consumer
[FEATURE] Configure Helm deployment
```

---

# Commit Convention

Format:

```text
type(scope): description
```

Examples:

```text
feat(kafka): add producer service
fix(terraform): correct subnet ids
chore(ci): add docker build cache
refactor(domain): simplify event model
```

---

# Required Workflow

## 1. Create feature branch

```bash
git checkout integration1

git checkout -b feature/mqtt-ingestion
```

---

## 2. Develop feature

Requirements:

* Follow DDD principles
* Follow TDD workflow
* Add tests for every functionality
* Keep architecture modular

---

## 3. Push branch

```bash
git push origin feature/mqtt-ingestion
```

---

## 4. Create Pull Request

Rules:

* PR target must be integration branch
* CI pipeline must pass
* Include implementation summary
* Include testing summary

---

## 5. Merge into integration branch

Only after:

* CI success
* Review approval
* Tests passing

---

## 6. Promote to release

After integration validation:

```text
integrationX → release
```

This triggers:

* Production deployment
* Helm deployment
* EKS rollout

---

# Engineering Standards

## Architecture

* DDD
* Clean Architecture
* Event-Driven Design
* SOLID principles

## Testing

* TDD mandatory
* Unit tests required
* Integration tests required
* End-to-end tests when applicable

## Infrastructure

* Infrastructure as Code mandatory
* Kubernetes-first deployment strategy
* Helm-managed applications

## CI/CD

* Every PR triggers CI
* release branch triggers deployment

---

# AI Agent Collaboration Rules

When AI agents contribute to the project:

* Every agent must work on isolated feature branches.
* Agents must NEVER commit directly to integration or release.
* Agents must create Pull Requests after feature completion.
* Every generated functionality must include tests.
* Agents must respect DDD boundaries.
* Agents must preserve infrastructure compatibility.
* Agents must avoid breaking existing deployment workflows.

---

# Final Goal

Maintain a professional enterprise-grade workflow that supports:

* scalable collaboration
* safe deployments
* infrastructure consistency
* clean architecture
* automated delivery
