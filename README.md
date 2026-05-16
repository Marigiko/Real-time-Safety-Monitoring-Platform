# README.md

# RTSP — Real-Time Safety Monitoring Platform

A cloud-native real-time industrial safety monitoring platform built with modern distributed systems architecture.

RTSP simulates an enterprise-grade IoT telemetry pipeline using event-driven microservices, Kubernetes orchestration, Infrastructure as Code, and automated CI/CD.

---

# Overview

RTSP is designed to showcase:

* scalable backend architecture
* event-driven communication
* cloud-native infrastructure
* distributed systems engineering
* Kubernetes orchestration
* production-ready deployment workflows
* DDD and TDD practices

The platform processes telemetry data from simulated IoT devices, detects dangerous conditions, and triggers alerts in real time.

---

# Architecture

```text
IoT Devices
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

# Tech Stack

## Backend

* NestJS
* Bun
* TypeScript

## Messaging & Streaming

* Apache Kafka
* Zookeeper
* RabbitMQ
* MQTT

## Infrastructure

* Docker
* Kubernetes
* Helm
* Terraform
* AWS EKS
* AWS RDS
* AWS ECR

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

.github/
  workflows/
```

---

# Core Services

## Ingestion Service

Responsibilities:

* consume MQTT telemetry
* validate incoming payloads
* transform data into domain events
* publish events to Kafka

---

## Processing Service

Responsibilities:

* consume Kafka events
* evaluate danger conditions
* persist telemetry in PostgreSQL
* publish alerts to RabbitMQ

---

## Alert Service

Responsibilities:

* consume RabbitMQ alerts
* trigger notifications
* manage alert lifecycle

---

# Infrastructure Features

## Kubernetes

* deployments
* services
* configmaps
* persistent volumes
* health checks
* internal networking

## Helm

* reusable deployments
* environment configuration
* parametrized services

## Terraform

* VPC provisioning
* EKS cluster
* RDS PostgreSQL
* ECR repositories
* IAM configuration

---

# Development Principles

## DDD (Domain-Driven Design)

The project follows:

* domain isolation
* use-case driven application layer
* infrastructure separation
* clean architecture boundaries

---

## TDD (Test-Driven Development)

Every feature should include:

* unit tests
* integration tests
* business rule validation

---

# Local Development

## Requirements

* Bun
* Docker
* kubectl
* kind
* Helm
* Terraform
* AWS CLI

---

# Installation

## Clone repository

```bash
git clone <repository-url>
cd rtsp
```

---

## Install dependencies

```bash
bun install
```

---

# Local Kubernetes Cluster

## Create kind cluster

```bash
bash infra/scripts/setup-cluster.sh
```

---

# Deploy Infrastructure

## Apply namespace

```bash
kubectl apply -f infra/kubernetes/base/namespace.yaml
```

## Deploy Kafka + Zookeeper

```bash
kubectl apply -f infra/kubernetes/base/zookeeper.yaml
kubectl apply -f infra/kubernetes/base/kafka.yaml
```

## Deploy databases and brokers

```bash
kubectl apply -f infra/kubernetes/base/postgres.yaml
kubectl apply -f infra/kubernetes/base/rabbitmq.yaml
kubectl apply -f infra/kubernetes/base/mqtt.yaml
```

## Deploy application services

```bash
kubectl apply -f infra/kubernetes/apps/
```

---

# Helm Deployment

## Install chart

```bash
helm install safety-platform infra/helm/safety-platform
```

## Upgrade deployment

```bash
helm upgrade safety-platform infra/helm/safety-platform
```

---

# Terraform Deployment

## Initialize Terraform

```bash
cd infra/terraform
terraform init
```

## Plan infrastructure

```bash
terraform plan
```

## Apply infrastructure

```bash
terraform apply
```

---

# AWS Deployment

## Configure kubeconfig

```bash
aws eks update-kubeconfig \
  --region us-east-1 \
  --name rtsp-cluster
```

---

# CI/CD

GitHub Actions handles:

* automated testing
* Docker image builds
* ECR image publishing
* Helm deployments
* EKS rollout updates

---

# Git Workflow

## Feature Branches

Every feature must use:

```text
feature/<feature-name>
```

Example:

```text
feature/kafka-consumer
feature/terraform-eks
feature/mqtt-ingestion
```

---

## Integration Branches

Features are merged into:

```text
integration[number]
```

Example:

```text
integration1
integration2
```

---

## Release Branch

Production-ready deployments are promoted into:

```text
release
```

---

# Testing

## Run tests

```bash
bun test
```

## Build services

```bash
bun run build
```

---

# Monitoring & Observability

Planned integrations:

* Prometheus
* Grafana
* Loki
* OpenTelemetry

---

# Future Improvements

Potential future modules:

* AI anomaly detection
* predictive maintenance
* RBAC authorization
* multi-cluster support
* edge computing integration
* geospatial device tracking
* real-time analytics dashboards

---

# Engineering Goals

This project aims to demonstrate:

* enterprise software engineering
* distributed systems architecture
* cloud-native deployment patterns
* infrastructure automation
* production-grade CI/CD
* scalable event-driven systems

---

# License

MIT
