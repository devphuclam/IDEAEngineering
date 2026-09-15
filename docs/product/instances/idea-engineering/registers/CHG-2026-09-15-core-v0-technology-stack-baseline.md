# Core v0 Technology Stack Engineering Baseline — Change Record

## Control envelope

| Field | Recorded value |
|---|---|
| Stable Supporting Record ID | `IE-CHG-TECH-BASELINE-001` |
| Supporting class / version | `CHG` / `Draft 0.1` |
| Date | 15-09-2026 |
| Owner / internal reviewer | Principal Product Author prepares; independent technology/architecture review `NOT-RUN` |
| Approver | Product Decision Authority for Tech; review/acceptance `NOT-RUN` |
| Applicable baseline | IDEA Engineering source commit `3a5b83f5ff64dc4b8335826d04732b029425b0ed`; `IE-KNW-TECH-DEC-001@0.5`, `TECH-001@0.13`, DOC-07@0.10 |
| Final controlled source set | `IE-STD-TECH-STACK-001@0.1`, `IE-KNW-TECH-DEC-001@0.6`, `TECH-001@0.14`, DOC-07@0.11 routing, `IE-ARC-TECH-VIEW-001@0.1`, `IE-VEV-TECH-VIEW-001@0.1` |
| Evidence class | Engineering selection from controlled product/architecture context and cited research; not Product Decision Authority approval or runtime qualification |
| Source / upstream trace | [Technology documentation standard](../../../../agents/technology-stack-documentation-standard.md), [technology matrix](../../../knowledge/2026-09-13-core-v0-technology-decision-matrix.md), [Q-15 Phase 1](VEV-2026-09-14-q15-client-ui-architecture-qualification.md), [Phase 2](VEV-2026-09-15-q15-client-ui-architecture-qualification-phase2.md), [Phase 3](VEV-2026-09-15-q15-client-ui-architecture-qualification-phase3.md) |
| Downstream trace | [TECH-001](../decision-briefs/TECH-001-technology-and-architecture-proposal.md), [DOC-07](../DOC-07-mvp-roadmap-and-delivery-plan.md), [technology view set](../technology/IDEA-core-v0-technology-architecture-views.md), catalogue and version history |
| Product normativity | `INFORMATIVE`; no FTR/REQ/product behavior created or changed |
| Supersedes / Superseded by | Supersedes the Engineering recommendation wording in `IE-CHG-TECH-CLIENT-002@0.1`; historical Q-15 evidence remains immutable / `NOT-APPLICABLE` |
| Access / retention | `INTERNAL`; retain with predecessor hashes, evidence and later approval/qualification records |
| Effective date / review trigger | Product effective date `NOT-APPLICABLE`; revisit on PDA disposition, selected component qualification failure, support/licensing change, company platform constraint or a named Client reopen trigger |
| Change status | Engineering Technology Selection `COMPLETE`; Core v0 Engineering Baseline `SELECTED`; Product Decision Authority approval `NOT-RUN`; Q-01…Q-14 `NOT-RUN`; Q-15 `PARTIAL / NO WINNER`; PG3/PG4 unchanged `NOT-RUN` |

## 1. Decision correction

This successor separates two questions that the predecessor wording allowed readers to conflate:

1. **Which stack will Engineering use as the Core v0 baseline?** Engineering selects Option A:
   React business UI, WPF/WebView2 narrow Windows shell and a separate per-user `.NET Workspace`.
2. **Did the bounded Q-15 A/B experiment prove a winner?** No. Q-15 remains `PARTIAL / NO WINNER`.

The Engineering selection uses the complete product topology, existing Web evidence, Windows
integration fit, current evidence maturity and Core v0 opportunity cost. It does not classify
Flutter as failed, does not declare an experimental winner, and does not claim that Option A is
universally superior.

## 2. Selected baseline and alternatives

| Area | Controlled disposition |
|---|---|
| Client Option A | `SELECT — CORE V0 ENGINEERING BASELINE` |
| Client Option B — Flutter Web/Windows + Dart + narrow Win32 C++ shim + `.NET Workspace` | `EVALUATED ALTERNATIVE — NOT SELECTED FOR CORE V0`; retained behind `TRIGGER-CLIENT-01…08` |
| Server | Ubuntu Server 26.04 LTS; Java 25 LTS/Eclipse Temurin 25; Spring Boot 4.1.x/Spring Modulith 2.1.x; deep-module modular monolith |
| Data and schema | PostgreSQL 18; Spring JDBC/`JdbcClient`/pgJDBC; Flyway with reviewed versioned SQL |
| Identity and API | Spring Security ordinary server-side sessions; IDEA Access Policy; versioned HTTPS JSON REST/OpenAPI 3.1 |
| Delivery and integration | Maven Wrapper/Boot BOM; PostgreSQL transactional outbox with bounded Spring dispatcher and owner-specific Adapters |
| Artifact and operations | Private server-managed filesystem Adapter; conditional Windows Format Worker; signed/versioned JAR bundle + systemd + host Temurin + company-approved Nginx; telemetry and coordinated recovery baseline |
| Explicitly rejected for Core v0 | Microservices, Kubernetes, service mesh, Redis and Electron |
| Deferred | Elasticsearch/OpenSearch, Kafka/RabbitMQ/broker, JPA/Hibernate default, Spring Data JDBC default and jOOQ default |
| Conditional | Spring Session JDBC, Spring Integration and Spring Batch |

## 3. Controlled Client reopen triggers

Flutter is reconsidered only through a recorded successor decision when at least one trigger occurs:

| ID | Trigger |
|---|---|
| `TRIGGER-CLIENT-01` | First-class mobile client enters the approved product roadmap. |
| `TRIGGER-CLIENT-02` | First-class macOS or Linux desktop client enters the approved product roadmap. |
| `TRIGGER-CLIENT-03` | A mandatory WPF/WebView2 security condition cannot be mitigated within the accepted architecture. |
| `TRIGGER-CLIENT-04` | Option A fails an approved mandatory performance threshold. |
| `TRIGGER-CLIENT-05` | Option A fails an approved mandatory accessibility threshold. |
| `TRIGGER-CLIENT-06` | The Web client ceases to be a first-class product surface through an approved Product decision. |
| `TRIGGER-CLIENT-07` | Measured WPF/WebView2 bridge implementation or maintenance burden exceeds an approved threshold. |
| `TRIGGER-CLIENT-08` | Future qualification shows a material, accepted total-cost or total-risk advantage for Flutter. |

## 4. Predecessor and affected records

| Record | Before / SHA-256 | After | Treatment |
|---|---|---|---|
| Technology matrix | `IE-KNW-TECH-DEC-001@0.5`; `8A75589B592DC31DA4E3C473A9C41A50909A16997981B4B61C491A38FF2AD7F1` | `@0.6` | Select one Core v0 Engineering baseline while preserving exact qualification state. |
| TECH-001 | `@0.13`; `A0452BA6EE51AC4C785CF5F637E243A3463A89EB9B47C8F263DCA24EFF503782` | `@0.14` | Present the selected baseline, rationale, alternatives, risks and reopen triggers for management review. |
| DOC-07 | `@0.10`; `98555DB85939B677010A61273A73F0D22DAB43F12080CD43ED60ECEAEEACB804` | `@0.11` | Routing/state update only; schedule, 56 tasks, 756 hours, requirements and gates unchanged. |
| Technology view set | no predecessor | `IE-ARC-TECH-VIEW-001@0.1` | Add eight focused, traceable diagrams without changing architecture authority. |
| Q-15 Phase 1/2/3 | existing immutable evidence | unchanged | Preserve `PARTIAL / NO WINNER`; no result is relabelled. |
| Feature, Spec, DOC-01…06/08, GOV, VVP and accepted ADRs | current controlled baselines | unchanged | No scope, behavior, architecture invariant, approval or gate result change. |

## 5. Non-impact and approval boundary

- No Feature, Spec, FTR or REQ was added, removed or reworded.
- No implementation, installation, benchmark or production qualification is claimed.
- Engineering selection does not equal Product Decision Authority approval.
- `TECH-001` remains `Draft`; PDA review/acceptance, PG3 and PG4 remain `NOT-RUN`.
- Q-01…Q-14 remain `NOT-RUN`; Q-15 remains `PARTIAL / NO WINNER`.
