# DESIGN.md

# Real-Time Safety Monitoring Platform (RTSP)

## Product Vision

RTSP is a mission-critical industrial monitoring platform designed for high-risk operational environments.

The platform provides real-time visibility into edge devices, distributed event pipelines, and cloud infrastructure, enabling Site Reliability Engineers (SREs), infrastructure teams, and industrial operators to detect, analyze, and respond to hazards with sub-second latency.

RTSP combines:

- industrial monitoring
- cloud-native infrastructure
- distributed systems observability
- event-driven telemetry
- real-time operational intelligence

The product should feel like a next-generation industrial DevOps platform built for enterprise-scale operations.

The UI should communicate:

* reliability
* operational visibility
* industrial-grade monitoring
* real-time responsiveness
* cloud-native infrastructure
* enterprise-level software quality

The application should feel similar to:

* Datadog
* Grafana Cloud
* AWS CloudWatch
* Kibana
* Splunk
* Linear
* Vercel Dashboard

with a modern industrial aesthetic.

---

# DESIGN PRINCIPLES

## Core Design Philosophy

The platform must prioritize:

* clarity over decoration
* operational awareness
* dense but readable information
* fast navigation
* real-time system visibility
* accessibility
* dark-mode-first UI

The interface should feel:

* technical
* modern
* minimalist
* production-grade
* highly responsive

---

# TARGET USERS

## Primary Users

* DevOps Engineers
* Site Reliability Engineers
* Industrial Operators
* Safety Analysts
* Infrastructure Teams
* Backend Engineers

---

# DESIGN LANGUAGE

## Style

* enterprise SaaS dashboard
* modern cloud platform aesthetic
* industrial monitoring interface
* cyber-physical systems visualization

## Visual Tone

* dark
* precise
* trustworthy
* technical
* premium

---

# COLOR PALETTE

## Primary Background

```text
#0B1020
```

## Secondary Background

```text
#111827
```

## Surface Cards

```text
#1F2937
```

## Borders

```text
#374151
```

## Primary Accent

```text
#3B82F6
```

## Success

```text
#10B981
```

## Warning

```text
#F59E0B
```

## Danger

```text
#EF4444
```

## Text Primary

```text
#F9FAFB
```

## Text Secondary

```text
#9CA3AF
```

---

# TYPOGRAPHY

## Primary Font

Inter

## Secondary Font

JetBrains Mono

Use mono fonts for:

* logs
* metrics
* event streams
* infrastructure identifiers
* Kafka topics
* container IDs

---

# UI LAYOUT

## Main Layout

```text
┌──────────────────────────────────────────────┐
│ Sidebar │ Topbar                            │
│         ├────────────────────────────────────┤
│         │                                    │
│         │ Main Dashboard                     │
│         │                                    │
│         │ Metrics / Charts / Tables          │
│         │                                    │
│         └────────────────────────────────────┘
└──────────────────────────────────────────────┘
```

---

# SIDEBAR NAVIGATION

## Sections

* Dashboard
* Devices
* Events
* Alerts
* Kafka Streams
* Infrastructure
* Kubernetes
* Metrics
* Logs
* Settings

## Sidebar Style

* collapsible
* icon-based navigation
* smooth transitions
* active section highlighting

---

# TOPBAR

## Components

* environment selector
* search bar
* notification center
* cluster status indicator
* user profile

## Status Indicators

Show:

* Kubernetes cluster health
* Kafka connectivity
* MQTT connectivity
* database health
* deployment status

---

# MAIN DASHBOARD

## Purpose

Provide immediate operational visibility.

The dashboard should communicate:

* system health
* active hazards
* event throughput
* infrastructure status
* alerting activity

---

# DASHBOARD COMPONENTS

## 1. System Health Cards

Cards displaying:

* Active Devices
* Alerts Triggered
* Kafka Throughput
* MQTT Messages/sec
* Database Latency
* API Response Time

Each card should include:

* icon
* metric value
* trend indicator
* small sparkline chart

---

## 2. Real-Time Event Stream

A live updating table.

Columns:

* timestamp
* device ID
* temperature
* voltage
* status
* event type

Features:

* auto-scroll
* filtering
* severity colors
* searchable

---

## 3. Hazard Detection Panel

Display active dangerous conditions.

Features:

* critical alerts
* warning alerts
* affected devices
* timestamps
* acknowledgement button

Use strong visual hierarchy.

Danger states should be visually prominent.

---

## 4. Infrastructure Monitoring

Visualize:

* Kafka brokers
* RabbitMQ queues
* PostgreSQL
* Kubernetes pods
* MQTT broker

Use:

* health indicators
* latency metrics
* uptime status
* CPU/RAM charts

---

## 5. Kubernetes View

Display:

* deployments
* pods
* replica counts
* pod health
* rollout status

Potential visualization:

```text
Deployment → ReplicaSet → Pods
```

---

## 6. Event Pipeline Visualization

Visual representation of event flow:

```text
MQTT → Ingestion → Kafka → Processing → RabbitMQ → Alerts
```

Requirements:

* animated event flow
* connection health
* throughput indicators
* node status

This should feel similar to a distributed systems topology map.

---

# CHARTS & DATA VISUALIZATION

## Preferred Style

* clean
* minimal
* high-density information
* soft gridlines
* subtle animations

## Recommended Chart Types

* line charts
* area charts
* heatmaps
* real-time counters
* topology graphs
* stacked metrics

---

# TABLE DESIGN

## Requirements

* virtualized rendering
* sortable columns
* filterable
* row highlighting
* sticky headers
* expandable details

Should resemble:

* Datadog logs
* Grafana tables
* Kibana event explorer

---

# ALERT SYSTEM UX

## Severity Levels

### INFO

Blue

### WARNING

Amber

### CRITICAL

Red

Critical alerts should:

* pulse subtly
* remain pinned
* require acknowledgement

---

# RESPONSIVE DESIGN

## Desktop First

Primary experience optimized for:

* ultrawide monitors
* engineering workstations
* DevOps dashboards

## Tablet Support

* simplified layout
* collapsible panels

## Mobile

Minimal support.
Focus only on:

* alerts
* notifications
* basic monitoring

---

# MOTION & INTERACTIONS

## Animation Style

* subtle
* smooth
* fast
* purposeful

Avoid:

* excessive motion
* flashy effects
* gaming aesthetics

Use animations for:

* live updates
* metric transitions
* alert appearance
* topology flow

---

# COMPONENT LIBRARY

## Recommended Stack

* React
* Next.js
* TailwindCSS
* shadcn/ui
* Framer Motion
* Recharts
* TanStack Table

---

# DESIGN SYSTEM COMPONENTS

## Required Components

* Metric Cards
* Event Tables
* Status Badges
* Alert Panels
* Log Viewer
* Deployment Cards
* Cluster Status Widgets
* Charts
* Sidebar Navigation
* Command Palette

---

# ACCESSIBILITY

## Requirements

* WCAG-compliant contrast
* keyboard navigation
* screen-reader support
* clear focus states
* semantic HTML

---

# FUTURE FEATURES

Potential future UI modules:

* AI anomaly detection
* predictive maintenance
* live device maps
* geospatial visualization
* incident timelines
* audit trails
* multi-cluster monitoring
* RBAC management

---

# FINAL EXPERIENCE GOAL

The final product should feel like:

* a modern DevOps platform
* an industrial monitoring dashboard
* a real enterprise SaaS application
* a production-grade cloud-native system

The UI should be polished enough to:

* showcase in interviews
* demonstrate engineering maturity
* serve as a portfolio centerpiece
* resemble a startup-ready product

# EXTENDED DESIGN PRINCIPLES

## Operational Awareness

The interface must optimize information density for rapid decision-making.

Users should immediately identify:

- active incidents
- infrastructure degradation
- abnormal telemetry
- unhealthy services
- deployment failures
- throughput anomalies

The UI should support continuous monitoring workflows.

---

## Technical Clarity

Data visualization takes priority over decorative elements.

All components should:

- maximize readability
- reduce cognitive load
- surface actionable insights
- maintain strong hierarchy
- support rapid scanning

---

## Cross-Device Consistency

The experience must remain consistent across:

- ultrawide engineering workstations
- standard desktop monitors
- tablets
- field-monitoring mobile devices

Core workflows should remain recognizable on every device size.

---

## Modern Industrial Aesthetic

The visual identity should resemble:

- industrial control systems
- enterprise cloud dashboards
- distributed infrastructure tooling

The UI should evoke confidence, precision, and operational reliability.

---

# EXTENDED VISUAL SYSTEM

## Semantic Color System

### Primary Surface

```text
#0B1020
```

### Secondary Surface

```text
#111827
```

### Elevated Surface / Cards

```text
#1F2937
```

### Borders / Separators

```text
#374151
```

### Primary Interactive Accent

```text
#3B82F6
```

---

## Critical States

### Critical / Danger

```text
#EF4444
```

Used for:

- active hazards
- failed deployments
- unhealthy infrastructure
- disconnected services

---

### Warning

```text
#F59E0B
```

Used for:

- degraded services
- elevated latency
- resource pressure
- pending alerts

---

### Success / Healthy

```text
#10B981
```

Used for:

- healthy services
- successful deployments
- recovered systems
- operational pipelines

---

### Info / Normal

```text
#3B82F6
```

Used for:

- informational events
- active telemetry
- neutral infrastructure states

---

# EXTENDED TYPOGRAPHY SYSTEM

## Primary UI Font

### Inter

Used for:

- navigation
- labels
- panels
- buttons
- dashboards
- settings
- descriptive content

---

## Technical Font

### JetBrains Mono

Used for:

- logs
- Kafka topics
- container IDs
- Kubernetes resource names
- metrics
- timestamps
- infrastructure identifiers
- event streams

The mono font should reinforce the engineering-focused experience.

---

# SCREEN ARCHITECTURE

# 4.1 Operational Dashboard

## Purpose

Provide immediate operational visibility for all active systems.

The dashboard should prioritize:

- system health
- critical incidents
- infrastructure stability
- telemetry throughput
- deployment visibility

---

## Main Sections

### Key Metrics

Metric cards with:

- sparkline charts
- trend indicators
- real-time updates
- status colors

Metrics include:

- Active Devices
- Critical Alerts
- Kafka Throughput
- MQTT Messages/sec
- PostgreSQL Latency
- API Response Time

---

### Hazard Summary

Quick-access panel displaying:

- latest incidents
- severity indicators
- affected systems
- acknowledgement status

---

### Infrastructure Status

Cluster-level operational overview including:

- Kubernetes health
- broker availability
- deployment status
- pod health
- queue throughput

---

# 4.2 Hazard Management Panel

## Layout

Desktop layout should use:

- split-view interface
- left-side incident list
- right-side technical details panel

---

## Incident Response Workflow

Primary actions:

- Acknowledge
- Resolve
- Escalate

Actions should be visually prominent.

---

## Contextual Information

Each incident should expose:

- originating service
- affected device
- recent logs
- infrastructure context
- telemetry history
- deployment correlation

---

# 4.3 Infrastructure Monitoring

## Kafka Monitoring

Display:

- broker health
- CPU/RAM metrics
- topic throughput
- partition lag
- replication health

---

## PostgreSQL Monitoring

Display:

- query latency
- active connections
- storage usage
- replication state
- health checks

---

## Kubernetes Monitoring

Visualize:

- deployments
- ReplicaSets
- pods
- rollout status
- node health
- resource consumption

Potential hierarchy visualization:

```text
Cluster → Deployment → ReplicaSet → Pod
```

---

# PIPELINE TOPOLOGY VISUALIZATION

The platform must include an interactive event-flow topology map.

Example:

```text
MQTT → Ingestion → Kafka → Processing → RabbitMQ → Alerts
```

The topology visualization should include:

- animated event flow
- service connection health
- throughput indicators
- infrastructure status
- broker connectivity
- live event counters

The experience should resemble a distributed systems topology viewer.

---

# NAVIGATION SYSTEM

# Desktop Navigation

## Sidebar

Persistent technical sidebar containing:

- Dashboard
- Event Stream
- Hazard Panel
- Infrastructure
- Kubernetes
- Topology
- Logs
- Metrics
- Settings

Requirements:

- collapsible
- icon-driven
- active section highlighting
- smooth transitions

---

## Topbar

The topbar should contain:

- environment selector (PROD/STAGING/DEV)
- global infrastructure status
- notifications
- quick search
- user profile

---

# TABLES & LOGGING UX

# Event Stream Table

A high-frequency real-time telemetry table.

Requirements:

- virtualization
- filtering
- sorting
- severity-based row coloring
- sticky headers
- searchable rows
- expandable payload details

Columns:

- timestamp
- device ID
- event type
- temperature
- voltage
- severity
- service source

---

# Log Viewer

Integrated technical log viewer using monospace typography.

Requirements:

- terminal-like appearance
- syntax highlighting
- timestamp grouping
- severity filtering
- searchable logs
- auto-scroll support

Should resemble:

- Grafana Loki
- Datadog Logs
- Kibana Explorer

---

# DEVICE EXPERIENCE

# Desktop Experience

The primary experience is desktop-first.

Optimized for:

- ultrawide monitors
- multi-panel workflows
- engineering workstations
- operations centers

Use:

- split-view layouts
- multi-column grids
- dense information presentation

---

# Mobile Experience

Mobile support should focus on:

- critical alerts
- notifications
- infrastructure health
- quick acknowledgements

The mobile UI should prioritize:

- one-handed usage
- large touch targets
- minimal navigation depth
- rapid hazard response

---

# MOTION SYSTEM

Animations should feel:

- subtle
- responsive
- technical
- intentional

Use motion for:

- live metric updates
- alert appearance
- topology flow
- deployment transitions
- infrastructure status changes

Avoid:

- excessive animation
- playful motion
- gaming aesthetics

---

# AI/UI GENERATION NOTES

The generated interface should resemble a production-grade enterprise SaaS platform.

Avoid:

- generic startup landing page aesthetics
- oversized marketing sections
- bright/light themes
- excessive whitespace
- consumer-style UI patterns

Prioritize:

- operational dashboards
- dense technical layouts
- cloud-native infrastructure visualization
- distributed systems monitoring
- industrial-grade monitoring workflows

The final UI should feel suitable for:

- DevOps teams
- SRE environments
- industrial operations centers
- cloud infrastructure monitoring
- mission-critical operations