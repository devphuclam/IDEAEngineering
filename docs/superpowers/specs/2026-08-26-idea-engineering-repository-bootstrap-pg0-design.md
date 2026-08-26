# IDEA Engineering Repository Bootstrap & PG0 Architecture Design

| Field | Value |
|---|---|
| Document ID | `IE-ARC-BOOT-001` |
| Artifact status | Written design pending Product Owner review |
| Design decision | Approved in conversation on 2026-08-26 |
| System of interest | `C1 — IDEA Engineering` |
| Product trajectory | Engineering Data Management → PLM capabilities inside C1 → Platform only after an independent C2 exists |
| Repository | `devphuclam/IDEAEngineering` |
| Local repository root | `C:\Users\TD-999\Research\Projects\IDEA\IDEAEngineering` |
| Bootstrap source | Development Workspace Template release `0.1.1` |
| Current source baseline | `fbff3a6f348335a9ac51ff8b9918c39327048f7c` |
| Intended gate | `PG0 — Governance and clean-room authorization` |

## 1. Executive decision

IDEA Engineering will be developed as one independent product repository for C1. The repository will distinguish four architectural concepts that must not be collapsed into one folder taxonomy:

1. **Deployable Host** — a process/application that can be built, deployed or operated.
2. **Deep Module** — an authoritative business capability behind a small interface.
3. **Adapter** — a replaceable implementation at a seam, including one adapter per file format or external tool integration.
4. **Product Profile** — a governed grouping of capabilities for a user/product experience such as CAD or Office; it owns no business state.

The accepted C1 topology is:

- IDEA Server;
- IDEA Web;
- IDEA Desktop;
- IDEA Workspace Service;
- Format Processing Runtime;
- eight initial deep domain modules;
- per-format adapters;
- CAD and Office product profiles.

No add-in, plugin, macro, injected code or in-process extension runs inside design software. Design applications read and write ordinary files in a managed local workspace. IDEA operates outside those applications.

The current repository was generated from the complete CodespaceTemplate. PG0 will retain its useful governance patterns but remove or replace template-owned Agent Orchestration, Azure and self-development artifacts that do not belong to IDEA Engineering.

This design is standards-guided and audit-oriented. It does not claim ISO conformity or certification.

## 2. Scope

### 2.1 In scope

- Physical separation between the product repository and the icVault/DDM research workspace.
- Repository governance and PG0 information items.
- Distinction between Deployable Hosts, Deep Modules, Adapters and Product Profiles.
- Authority and interface rules between Server, Web, Desktop, Workspace Service and Format Processing Runtime.
- CAD/Office treatment without in-process integration.
- Initial repository information architecture.
- Traceability, configuration management, review, security and verification controls.
- Acceptance criteria for completing the repository bootstrap.

### 2.2 Out of scope

- Programming language, framework, database, object store, UI toolkit or cloud provider.
- Detailed public protocol, schema or endpoint design.
- Production source code.
- Deployment sizing, high availability topology and performance thresholds not yet derived from requirements.
- Specific CAD/Office parser implementation.
- Commercial licensing and packaging rules for Product Profiles.
- PLM feature specifications.
- C2 or Platform interoperability layer D.
- Formal ISO conformity or accredited certification.

### 2.3 Explicitly deferred decisions

The following are deliberately deferred to requirements and implementation-architecture gates, rather than left as drafting placeholders:

- technology stack and supported runtime versions;
- relational/object/search technology;
- Desktop and Web UI frameworks;
- local IPC protocol between Desktop and Workspace Service;
- public C1 transport and contract technology;
- worker isolation technology;
- authentication provider;
- hosting and CI/CD platform controls beyond the current GitHub repository;
- exact supported-format list and adapter delivery cadence;
- repository split, which may be reconsidered only when independently owned/deployed products and concrete access/release constraints justify it.

## 3. Standards position

### 3.1 Classification vocabulary

- **STANDARD:** a named standard is adopted as the normative basis for the identified process/information item after lawful access, tailoring and controlled mapping.
- **STANDARD-GUIDED:** selected outcomes or practices are deliberately applied without claiming conformance to the whole publication.
- **PROJECT-CONVENTION:** a local decision chosen to realize quality and governance outcomes; it is not mandated by ISO/IEC/IEEE.

### 3.2 Applicable baseline

The controlled product-local source of truth for editions, applicability, tailoring state, gate mapping, version watch and official links is
[`IE-GOV-STD-001`](../../governance/standards-register.md). The table below is the architecture-level summary, not a substitute for that register or for lawfully accessed normative text.

| Source | Intended use | Classification |
|---|---|---|
| ISO/IEC/IEEE 15288:2023 | Product/system lifecycle backbone | STANDARD |
| ISO/IEC/IEEE 12207:2026 | Software lifecycle backbone | STANDARD |
| ISO/IEC/IEEE 24748-1:2024 | Integrated lifecycle tailoring guidance | STANDARD-GUIDED |
| ISO/IEC/IEEE 15289:2019 | Life-cycle information-item content guidance | STANDARD-GUIDED |
| ISO/IEC/IEEE 29148:2018 | Stakeholder needs and system/software requirements | STANDARD |
| ISO/IEC/IEEE 42010:2022 | Architecture description, stakeholders, concerns, viewpoints, views, models and rationale | STANDARD |
| ISO/IEC 25010:2023 | Product quality model | STANDARD |
| ISO/IEC 25030:2019 | Governable and measurable quality requirements | STANDARD |
| ISO/IEC/IEEE 29119 Parts 1–4 and TR 29119-6 | Risk-based V&V concepts, processes, documentation and techniques | STANDARD-GUIDED |
| ISO 10007:2017 | Configuration identification, change control, status accounting and audit | STANDARD-GUIDED |
| ISO/IEC 27001:2022 + Amd 1:2024, ISO/IEC 27002:2022 | Organization/project security governance where applicable | STANDARD-GUIDED until an organizational ISMS decision exists |
| ISO/IEC 27034-1:2011 + Cor 1:2014 | Application-security integration guidance | STANDARD-GUIDED |
| NIST SSDF v1.1, OWASP ASVS for applicable Web/API surfaces, SPDX and SLSA | Secure development, product verification and supply-chain evidence | STANDARD-GUIDED |

Primary-source verification is retained in
[`IE-RES-STD-SOURCE-001`](../research/2026-08-26-idea-engineering-standards-primary-source-check.md). Before a formal conformity claim, the organization must obtain lawful access to normative texts, approve a clause/process tailoring matrix and conduct a controlled gap assessment.

No listed standard mandates `Web/CAD/Office`, a folder tree, monorepo, Git, GitHub, a branch name, a programming language or a framework. The repository and decomposition decisions below are PROJECT-CONVENTION choices justified by traceability, maintainability, flexibility, compatibility, security and reliability concerns.

## 4. Controlled inputs and clean-room boundary

### 4.1 Controlled research inputs

This design used the following independently identified research outputs:

- `IE-GOV-STD-BASELINE-001` — external standards and governance research baseline used to author the product register;
- `IE-REF-ASSESS-001` — CodespaceTemplate fit assessment;
- accepted architecture decisions from the icVault/DDM research workspace concerning C1 evolution, no in-process design-tool code, immutable Generation, optimistic concurrency, atomic Change Set and external format processing.

The external raw/research inputs remain controlled outside this repository; their product-facing conclusions are independently authored and controlled here.

### 4.2 Physical and procedural separation

| Area | Location | Permitted content |
|---|---|---|
| Research and evidence | `C:\Users\TD-999\Research\icVault` | Authorized DDM/icVault observations, captures, hashes, reports, target-runtime evidence and research analysis |
| Product engineering | `C:\Users\TD-999\Research\Projects\IDEA\IDEAEngineering` | Independently authored context, findings, decisions, requirements, architecture, source, tests and release evidence |

The permitted transfer chain is:

```text
Authorized evidence ID/hash
  → independently written Finding
  → Product decision
  → Requirement and acceptance criterion
  → Architecture/change
  → Verification evidence
  → Release baseline
```

Raw vendor source, decompiled source, installer/binary material, licensed documentation, proprietary schema/database dumps, UI assets, icons, secret material and copied implementation text do not enter the product repository by default. Ambiguous material remains quarantined in research until an explicit authorization and legal/IP decision exists.

## 5. Current repository state

The observed bootstrap state on 2026-08-26 is:

- independent private repository `devphuclam/IDEAEngineering`;
- `main` at initial commit `fbff3a6f348335a9ac51ff8b9918c39327048f7c`;
- clean local worktree before this document;
- approximately 600 files including Git metadata;
- 340 files under `.agents` and 138 under `tools`;
- template `README.md`, `CONTEXT.md`, constitution, Agent Workspace implementation, Azure adapter examples and template-owned feature specs remain present;
- no IDEA Engineering domain marker was found before this document;
- no product governance, clean-room, integrated requirements, quality, risk, V&V or operations baseline exists yet;
- `main` is not technically protected and has no enforced required-status-check context.

Interpretation: repository creation succeeded, but PG0 has not passed. The initial template commit is an immutable source baseline, not a product-ready baseline.

## 6. Alternatives considered

### 6.1 DDM-shaped Web/CAD/Office source silos — rejected

DDM publicly distinguishes Web, CAD and Office product/user surfaces. That is evidence of product presentation and capability packaging, not proof that three source silos are appropriate for IDEA.

Three silos would encourage:

- duplicated authorization, version, workflow and product-structure rules;
- CAD/Office coupling to specific applications;
- shallow pass-through modules;
- divergence between Web and desktop behavior;
- accidental pressure toward add-ins;
- expensive cross-surface consistency tests.

### 6.2 One undifferentiated application — rejected

A single executable containing UI, local workspace, server authority and parser execution would mix trust zones, deployment concerns and failure modes. It would make parser isolation, resumable transfer, Web access and independent scaling difficult.

### 6.3 Deployable Hosts + Deep Modules + per-format Adapters + Product Profiles — accepted

This model separates deployment from business authority, hides complex invariants behind deep-module interfaces and allows format support to evolve independently. CAD and Office remain understandable product profiles without becoming business-logic owners.

## 7. System boundary and context

```text
┌─────────────────────────────────────────────────────────────────────┐
│ External design/document applications                              │
│ IRONCAD | SolidWorks | Inventor | AutoCAD | Word | Excel | ...     │
│ No IDEA code executes inside these applications                    │
└───────────────────────────────┬─────────────────────────────────────┘
                                │ ordinary persisted files
                                v
┌─────────────────────────────────────────────────────────────────────┐
│ Managed Local Workspace                                             │
│ materialized files | local manifest | cache | recovery state        │
└───────────────────┬──────────────────────────────┬──────────────────┘
                    │                              │
                    v                              v
┌────────────────────────────┐       ┌───────────────────────────────┐
│ IDEA Desktop               │ IPC   │ IDEA Workspace Service        │
│ explicit user intent + UX  │◄─────►│ materialize/hash/cache/xfer   │
└──────────────┬─────────────┘       └───────────────┬───────────────┘
               └──────────────────────┬──────────────┘
                                      │ authenticated C1 interface
                                      v
┌───────────────────────┐   ┌─────────────────────────────────────────┐
│ IDEA Web              │──►│ IDEA Server — C1 authority             │
│ browser/admin UX      │   │ application boundary + deep modules    │
└───────────────────────┘   └────────────────────┬────────────────────┘
                                                 │ controlled jobs
                                                 v
                                ┌─────────────────────────────────────┐
                                │ Format Processing Runtime           │
                                │ isolated per-format adapters/tools  │
                                └─────────────────────────────────────┘
```

The diagram is a logical/deployment view. It does not choose a transport, process count, host machine count or scaling topology.

## 8. Deployable Host responsibilities

| Host | Responsibilities | Must not own/do |
|---|---|---|
| IDEA Server | Authenticated application interface; command/query coordination; authoritative persistence; authorization enforcement; atomic publish; workflow; audit/outbox; worker job control | Expose internal schema as public contract; delegate domain authority to clients/workers; require C2 or D for C1-local behavior |
| IDEA Web | Search/browse/view; review/approval; governed administration; operationally appropriate downloads/previews | Implement authoritative version, reservation, release or authorization rules; access DB/object storage directly |
| IDEA Desktop | Explicit Checkout/Open/Check-in/Cancel/Recover commands; selection and conflict/recovery UX; launch files through OS association | Run inside design applications; publish automatically on Save; hold infrastructure credentials; become authority for permissions/version |
| IDEA Workspace Service | User-session materialization; full scan/hash; cache; safe queue; resumable transfer; local manifest; progress/error state | Check in, approve, release or merge autonomously; become authoritative source of product state; run as LocalSystem by assumption |
| Format Processing Runtime | Execute controlled format jobs; isolate untrusted files and external tools; enforce resource limits; return result/provenance | Decide product state; mutate original artifacts; access domain DB directly; silently substitute unsupported capabilities |

`Workspace Service` is the accepted product term, but its deployment semantics are a user-session background process unless a later requirement and security review justify a Windows system service.

## 9. Deep domain modules

| Module | Small external interface intent | Complexity hidden | Authoritative state |
|---|---|---|---|
| Controlled Product Data | Reserve, recover, begin/finalize Check-in, create Revision, read controlled snapshot, disposition operations | Document identity, immutable Generation, Artifact references, Working Head, optimistic concurrency, atomic Change Set, retention invariant | Document, Generation, ArtifactReference, Revision/Version, Reservation, CheckInOperation, PublishedChangeSet, disposition |
| Product Structure | Prepare/resolve/compare Structure Snapshot | Graph validation, occurrence identity, dependency pinning, unresolved/manual relations, traversal and baselines | StructureSnapshot, StructureNode, DependencyEdge |
| Lifecycle Governance | Request transition, record decision, query allowed actions | Versioned workflow, approval, release gates, separation of duties, revision-action policy | WorkflowDefinitionVersion, WorkflowInstance, ApprovalDecision, ReleaseRecord |
| Information Model | Validate metadata, allocate number, query schema | Schema evolution, classification, validation and numbering | MetadataSchemaVersion, Classification, NumberingPolicy |
| Format Intelligence | Request analysis/representation, accept result, query capability | Capability negotiation, adapter/version provenance, result validation, warning and derivative alignment | FormatCapability, AnalysisRequest/Result, Representation |
| Access Policy | Authorize, explain decision, manage policy | Role/group grants, state-aware policy, decision evidence | AccessPolicyVersion, Grant, PolicyDecisionEvidence |
| Discovery | Search, saved query, rebuild projection | Indexing, ranking, filtering, pagination and projection recovery | Rebuildable search projection and saved query |
| Audit Evidence | Query/export evidence; controlled internal append seam | Actor normalization, before/after, correlation, retention and tamper-evident export | Append-only EvidenceRecord |

Rules:

- A module mutates only state it owns.
- A module's interface is its test surface; callers do not orchestrate its internal steps.
- Internal interfaces remain colocated with the owner module.
- Authentication is an application/infrastructure concern; authorization policy is owned by Access Policy and enforced by the module owning each resource/action.
- Discovery and representations are rebuildable projections, never authoritative substitutes.
- Notification, clocks, storage, search engine, identity provider and messaging are adapters/internal seams, not domain modules merely because they have implementations.
- Change Management and other PLM modules are added only through future accepted requirements; they are not empty folders in PG0.

## 10. Format architecture and Product Profiles

### 10.1 Per-format adapter rule

Adapters are organized by actual format/tool capability, for example:

```text
IronCAD adapter
SolidWorks adapter
Inventor adapter
DOCX adapter
XLSX adapter
PDF adapter
```

They are not implemented as one giant CAD module and one giant Office module. Each adapter declares a governed Capability Profile containing only supported behavior:

| Capability | Allowed declaration |
|---|---|
| Generic vaulting | Required for every accepted file |
| Open via OS association | Required where the OS has an association |
| Hash/change detection | Required |
| Dependency extraction | None / Manual / Parser |
| Metadata/property extraction | None / Manual / Parser |
| Structure extraction | None / Manual / Parser |
| Preview generation | None / Standalone tool |
| Neutral representation | None / Standalone tool |
| Round-trip fidelity | Measured per format; never assumed |

Unsupported deep extraction does not prevent generic controlled-file management. A capability may be advertised only after its conformance evidence exists for the exact adapter/tool version.

### 10.2 Product Profile rule

`CAD` and `Office` are Product Profiles that may group:

- available per-format adapters;
- relevant Web/Desktop navigation and commands;
- lifecycle templates;
- documentation/support boundaries;
- future entitlement/package policy.

Product Profiles own no Document, Generation, Reservation, Structure, Workflow, Access Policy or audit state. A profile cannot bypass C1 interfaces or alter domain invariants.

### 10.3 Format job flow

```text
Server/Format Intelligence creates controlled request
  → Format Processing Runtime obtains immutable input authorization
  → selected adapter/tool runs in isolation
  → runtime returns result + adapter/tool version + hashes + warnings
  → Format Intelligence validates and records result
  → projections/representations become visible according to policy
```

Parse failure preserves the original Artifact. Retries are idempotent. A stale result cannot be attached to a different Generation.

## 11. Authority and interface matrix

| Decision/state | Authority | Other participants |
|---|---|---|
| User intent to Checkout/Check-in/Cancel | Human through Desktop/Web | Workspace Service may perform transfer/materialization |
| Reservation ownership and validity | Controlled Product Data | Desktop displays; Workspace caches a non-authoritative manifest |
| Version/Revision/Generation | Controlled Product Data | Web/Desktop query only |
| Atomic Change Set publish | Controlled Product Data coordinated at Server application boundary | Workspace uploads staging content; Structure prepares immutable candidate |
| Product structure baseline | Product Structure | Format adapters may propose derived relations with provenance |
| Workflow/approval/release | Lifecycle Governance | Web/Desktop present allowed actions |
| Permission policy | Access Policy | Resource-owning module enforces final business authorization |
| Authentication/session | Server application boundary + selected identity adapter | Web/Desktop acquire/use scoped identity/session |
| Local file content before publish | Managed Workspace under user control | Server has no authority over unsaved/in-memory application state |
| Format analysis/preview result | Format Intelligence | Runtime/adapter executes but owns no domain state |
| Search result | Discovery projection | Resource owner is rechecked for authoritative read/action |

The server cannot prevent an external design application from editing a local file. IDEA protects controlled state by reservation UX, local hash detection, optimistic concurrency and server-side publish validation. Local work rejected by the server is preserved for explicit recovery; it is not silently discarded or force-merged.

## 12. Contract placement

Only C1 public contracts are centralized as controlled configuration items. Examples include authenticated commands/queries, externally published events, transfer contracts and future approved interoperability contracts.

Internal module interfaces, domain types and invariants remain with the owning module. A global `shared`, `common`, `models` or `contracts` dumping ground is prohibited. Code shared solely for technical convenience does not become a domain authority.

Public contract rules:

- versioned and compatibility-tested;
- no internal DB schema leakage;
- idempotency semantics stated for retriable commands;
- explicit error/problem vocabulary;
- authorization and data-classification expectations;
- deprecation and migration policy before external consumers exist;
- exact generated/handwritten source of truth identified to prevent duplicate models.

## 13. Principal flows

### 13.1 Checkout/Open/Edit/Check-in

1. Human selects a controlled scope in Desktop.
2. Server authorizes and creates a Reservation/manifest tied to exact base Generations.
3. Workspace Service materializes files through scoped transfer authorization.
4. Desktop launches the selected persisted file through OS association.
5. External application edits ordinary local files; IDEA does not observe unsaved in-memory state.
6. Before Check-in, Workspace Service performs a complete scan/hash; file watcher events are hints only.
7. Desktop presents changed, unchanged, missing, unexpected and modified-without-reservation items.
8. Human confirms Check-in scope.
9. Server validates authorization, reservation and optimistic-concurrency tokens.
10. Staging upload and semantic validation complete before one atomic publish references immutable verified objects.
11. Conflict returns actionable evidence and preserves local work.

### 13.2 Web review/approval

1. Web queries C1 through the same application authority used by other clients.
2. Search/projection results do not grant access; authoritative read/action is reauthorized.
3. Allowed workflow actions come from Lifecycle Governance.
4. Human decisions record actor, time, exact controlled baseline and evidence.
5. Administration uses explicit roles and cannot bypass resource-owner invariants.

### 13.3 Background processing

Outbox delivery, indexing, representations, notifications, staging cleanup and reconciliation are asynchronous, idempotent and observable. No background task turns a failed/unpublished operation into a published Generation without the authoritative module transition.

## 14. Reliability and failure handling

- All externally retriable commands have an operation/idempotency identity.
- Published metadata references only verified immutable objects.
- Staging/orphan objects are invisible to normal reads and are reconciled safely.
- A Change Set is all-or-nothing for its changed entries.
- Workspace Service failure never deletes the user's local working files.
- Network loss leaves explicit resumable/blocked state; it does not report success.
- Parser crash/time/resource exhaustion quarantines the job/result and preserves the original Artifact.
- Discovery/index/preview lag is observable and cannot change authoritative truth.
- Recovery procedures distinguish retry, resume, reconcile, rollback and operator intervention.
- Every material failure path identifies evidence, owner and cleanup verification.

## 15. Security and trust

Trust zones include browser, user desktop/session, managed local workspace, server application, data stores, worker isolation environment and external tools.

Controls required by later measurable requirements include:

- no DB credential or permanent object-storage credential in Web/Desktop/Workspace packages or configuration;
- scoped short-lived transfer authorization;
- server-side authentication and resource-owner authorization;
- per-user protection/authentication of Desktop↔Workspace local IPC;
- least-privilege worker access to one job/input/output scope;
- untrusted-file isolation and resource limits;
- secret-free committed configuration;
- dependency/toolchain identity, SBOM and build provenance for release baselines;
- security event/evidence coverage without storing unnecessary personal or secret data;
- controlled vulnerability, incident, exception and residual-risk handling.

ISO/IEC 27001 certification is an organizational ISMS decision. Repository controls alone cannot create certification.

## 16. Repository information architecture

### 16.1 PG0 repository shape

The bootstrap initially establishes governed information, not empty production-code folders:

```text
IDEAEngineering/
├── README.md
├── AGENTS.md
├── CONTEXT.md
├── .template-provenance
├── .github/
│   ├── pull_request_template.md
│   └── workflows/
├── .specify/
├── docs/
│   ├── governance/             # GOV, CLR, CMP, traceability, gates, roles
│   ├── product/                # CON: system context and stakeholder needs
│   ├── requirements/           # REQ and quality requirement registers
│   ├── architecture/           # ARC, viewpoints/views and ADRs
│   ├── risk/                   # RSK and threat models
│   ├── verification/           # VVP and retained VEV indexes/evidence
│   ├── operations/             # OPS
│   └── releases/               # REL
├── specs/                      # bounded increment lifecycle artifacts
├── scripts/                    # public repository verification entry point
└── tools/                      # only product-governed verification/support tooling
```

These paths are PROJECT-CONVENTION storage for logical information items. Information may be combined where stable identity, ownership, version, status, approval and traceability remain unambiguous.

### 16.2 Future implementation shape

After PG2/PG3 and technology ADR approval, source may be organized conceptually as:

```text
src/
├── hosts/
│   ├── server/
│   ├── web/
│   ├── desktop/
│   ├── workspace-service/
│   └── format-processing/
├── modules/
│   ├── controlled-product-data/
│   ├── product-structure/
│   ├── lifecycle-governance/
│   ├── information-model/
│   ├── format-intelligence/
│   ├── access-policy/
│   ├── discovery/
│   └── audit-evidence/
├── adapters/
│   ├── formats/
│   ├── identity/
│   ├── persistence/
│   ├── object-storage/
│   ├── search/
│   └── messaging/
└── public-contracts/

tests/
├── module/
├── contract/
├── integration/
├── system/
├── format-conformance/
├── concurrency-resilience/
├── security/
└── acceptance/
```

This future shape is approved conceptually, not authorization to create placeholder projects or choose a stack during PG0.

## 17. Lifecycle information items

| ID class | Information item | First required gate |
|---|---|---|
| `GOV` | Lifecycle governance, applicable standards, tailoring, roles, reviews, retention and version watch | PG0 |
| `CLR` | Clean-room provenance, authorization, quarantine and permitted-transfer ledger | PG0 |
| `CON` | System/product context and stakeholder-needs baseline | PG1 |
| `REQ` | Integrated functional/interface/data/quality/security/operation/support/retirement requirements | PG2 |
| `ARC` | Architecture description, viewpoints/views, models, interfaces and ADRs | PG3 |
| `RSK` | Product/project/security/supply-chain risk and treatment record | PG2, refined PG3+ |
| `VVP` | Verification and validation strategy | PG3 |
| `VEV` | Controlled V&V specifications, results, defects, waivers and acceptance evidence | PG5 |
| `CMP` | Configuration management plan, CI register, baselines, status accounting and audit | PG0, baselined PG2 |
| `CHG` | Controlled change, impact analysis, review and approval record | Every controlled change |
| `REL` | Release baseline, manifest, hashes, SBOM/provenance, verification/risk/rollback authorization | PG6 |
| `OPS` | Operation, maintenance, incident, support and retirement record | PG6 onward |

Every controlled item records stable ID, owner, status, version, applicable baseline, authors/reviewers/approvers, effective date, source/downstream links, history, access classification and retention rule.

## 18. Traceability contract

```text
Evidence → Finding → Product decision / Stakeholder need
  → Requirement → Architecture / Interface / ADR
  → Change → Implementation revision
  → Verification case/result against exact configuration
  → Release baseline
```

Required rules:

- every approved requirement has an originating need or explicit product decision;
- every release-scoped requirement has passing evidence or an approved time-bounded waiver;
- quality/security requirements have measurable acceptance criteria and verification methods;
- architecture decisions link affected requirements, concerns and risks;
- risks/threats link treatments or explicit residual acceptance;
- every baseline change has a change record and impact analysis;
- every result identifies exact build/configuration/environment;
- every release identifies exact controlled inputs/outputs, SBOM, provenance and risk disposition;
- broken, orphaned, stale or unjustified circular trace links fail the applicable gate.

ID syntax and storage technology are deferred PROJECT-CONVENTION details; the semantic graph above is required.

## 19. Configuration and change control

Configuration items include governed documents, requirements, architecture, contracts, schemas/migrations, source, tests/fixtures, build/deployment definitions, dependencies/lock data, toolchain identity, release artifacts/hashes/attestations, operational material and controlled adapters.

Required baselines:

- Governance baseline — PG0;
- Requirements baseline — PG2;
- Architecture baseline — PG3;
- Increment baseline — PG4;
- Verification baseline — PG5;
- Release baseline — PG6.

Repository controls:

- changes link to a Work Item/CHG record and affected controlled items;
- material baselines are changed through review, not silent direct mutation;
- `main` and release-bearing references should be technically protected with required checks when the host plan supports it;
- if technical protection is unavailable, the limitation is recorded as a risk and a procedural PR/change/baseline audit is used temporarily without claiming equivalent enforcement;
- PG2, PG3, PG5 and PG6 material decisions require a reviewer/approver independent of the principal author; if unavailable, the gate is BLOCKED rather than self-certified;
- product release version is independent of `.template-version`;
- `.template-provenance` preserves immutable bootstrap origin and selected-source identity.

## 20. Product gates

| Gate | Purpose | Minimum exit evidence |
|---|---|---|
| PG0 | Governance and clean-room authorization | GOV, CLR, CMP foundation, roles, standards/tailoring register, gate model, repository verification, bootstrap provenance |
| PG1 | Needs and evidence baseline | Context, stakeholders, operational scenarios, independently authored findings, source provenance, initial risks |
| PG2 | Requirements baseline | Approved functional/interface/data/quality/security/operational requirements, measurable acceptance, trace coverage and controlled baseline |
| PG3 | Architecture baseline | 42010-oriented description, views, ADRs, interface/data ownership, quality scenarios, risk/threat treatment and V&V strategy |
| PG4 | Increment readiness | Selected requirements/change, impact analysis, test design, controlled tool/dependency inputs, migration/rollback approach |
| PG5 | Verification and acceptance readiness | Exact configuration, independent review, V&V/security/dependency results, coverage, defects/waivers and acceptance disposition |
| PG6 | Release authorization | Immutable manifest/hashes, SBOM/provenance, configuration audit, verification summary, known issues, residual risk, operations/rollback approvals |
| PG7 | Operate, learn, change and retire | Operational baseline, monitoring/incidents/vulnerabilities, support/change decisions, retention/export and retirement evidence |

Allowed outcomes are `PASS`, `PASS-WITH-ACTIONS` and `FAIL`. A conditional action records owner, affected baseline, due condition, expiry and escalation. Missing prerequisites are `BLOCKED`, not PASS.

## 21. Quality model and initial scenarios

The ISO/IEC 25010 quality model is used to check coverage; project thresholds come from controlled requirements.

| Concern | Initial design scenario |
|---|---|
| Functional suitability | Version/Revision/Generation and structure/workflow actions preserve defined invariants across Web/Desktop |
| Performance efficiency | Hashing, transfer, search, structure traversal and format processing receive workload-specific targets before implementation |
| Compatibility | Every accepted file has generic support; deeper support is capability-declared and conformance-tested per adapter version |
| Interaction capability | Conflict, progress, recovery, stale state and unsupported capabilities are explicit and actionable |
| Reliability | Check-in publication is atomic; retries are idempotent; local work and original artifacts survive failures |
| Security | Clients/workers hold no infrastructure credentials; authorization is server/resource-owner enforced; untrusted files are isolated |
| Maintainability | Deep module ownership, colocated internal interfaces, dependency rules and contract tests prevent rule duplication |
| Flexibility | New format adapters and PLM modules can be added without rewriting Controlled Product Data or touching design applications |
| Safety | Unreleased/stale/wrong design state cannot be silently presented as an authorized controlled release |

Each scenario becomes a uniquely identified, measurable quality requirement at PG2; this table alone is not acceptance evidence.

## 22. Verification strategy baseline

PG0 verification checks repository/governance integrity only. Product verification is introduced with requirements and implementation.

Planned verification surfaces include:

- governance schema/content and placeholder checks;
- local-link and controlled-input checks;
- trace graph coverage and orphan detection;
- configuration/baseline status checks;
- dependency/module ownership rules;
- module tests through interfaces;
- public contract compatibility tests;
- Windows Desktop/Workspace system tests;
- concurrency, stale-write, atomicity and fault-injection tests;
- format-adapter capability conformance;
- Web/Desktop authorization consistency;
- parser isolation and untrusted-input tests;
- performance, recovery/restore and operational drills;
- release manifest, SBOM, provenance and artifact-hash verification.

One public repository verification interface must report PASS, FAIL, BLOCKED and NOT-RUN accurately. It must not use no-op checks or substitute Linux-only template success for Windows product evidence.

## 23. Bootstrap transformation disposition

### 23.1 Retain and adapt

- Git repository identity and initial commit history.
- `.gitattributes` and `.gitignore` after review.
- immutable template provenance, extended with source commit/selection record.
- one-workflow specification principle from Spec Kit.
- small `AGENTS.md` routing interface.
- canonical terminology pattern in `CONTEXT.md`.
- ADR pattern.
- Work Item → branch/worktree → review → verification → merge/handoff pattern.
- single public verification interface and CI delegation pattern.
- safe configuration and local Markdown-link checks.

### 23.2 Replace

- template README with IDEA product/repository orientation;
- template CONTEXT with IDEA canonical domain language;
- template constitution with IDEA governance/tailoring/clean-room/gate rules;
- zero-independent-approval review policy with risk/gate-based independence;
- template verifier and CI with product-governed Windows-capable verification;
- template release naming with IDEA release/configuration baseline rules;
- generic Spec Kit templates with trace, quality, risk, verification and configuration fields.

### 23.3 Remove from the product baseline

- `tools/agent-workspace/` implementation and tests;
- template feature specs for Shared Agent Workspace and Azure adapter;
- template-owned research/design/plans/release history except controlled provenance;
- Azure adapter/configuration unless separately selected;
- Docker/WSL recovery tooling and devcontainer assumptions unless selected by a future development-environment decision;
- unused project-local skill bundles;
- machine-local caches/worktrees/run state;
- raw DDM/icVault evidence and proprietary material.

Removal occurs in a reviewable bootstrap change and remains recoverable from Git history. No deletion is authorized merely by this document before the implementation plan is reviewed.

## 24. Risks and trade-offs

| Risk/trade-off | Treatment |
|---|---|
| Governance becomes documentation theatre | Every controlled item must support a decision, trace or gate; combine items when identity/approval remains clear; automate structural checks |
| Whole template obscures the product | Controlled removal with source provenance and verification |
| CAD/Office profiles become hidden silos | Profiles own no state; per-format adapters implement declared capabilities through Format Intelligence |
| Global shared contracts grow shallow | Only public contracts centralized; internal interfaces/types stay with module owners |
| Workspace Service becomes autonomous business actor | Explicit user intent and Server authority; local service limited to workspace mechanics |
| Format workers gain excessive trust | Per-job scoped access, isolation, provenance, limits and no domain DB access |
| Web/Desktop behavior diverges | Same authoritative application/module interfaces and cross-surface conformance scenarios |
| Solo project cannot provide independent material-gate review | Gate remains BLOCKED or external reviewer is assigned; no false self-certification |
| GitHub plan cannot enforce all controls | Record risk; use temporary procedural controls and baseline audit; do not claim equivalent technical enforcement |
| Premature technology decisions | Technology and deployment ADRs begin only after controlled requirements |
| Premature Platform/D | C1 remains autonomous; design D only after C2 and concrete cross-C requirements exist |

## 25. PG0 bootstrap acceptance criteria

Repository bootstrap is accepted only when all applicable criteria have objective evidence:

1. IDEA repository identity and template source commit/release provenance are immutable and reviewable.
2. Research/product clean-room rules and permitted transfer chain are approved.
3. Current standard editions, applicability and tailoring/deviation rules are recorded.
4. PG0–PG7 gates, roles, review independence and outcome vocabulary are controlled.
5. README, AGENTS, CONTEXT and governance artifacts describe IDEA, not the template product.
6. Template Agent Workspace/Azure/self-development artifacts are removed or explicitly justified.
7. GOV, CLR and CMP foundations exist with stable IDs, owner, status and history.
8. Logical information-item and traceability contracts cover CON/REQ/ARC/RSK/VVP/VEV/CHG/REL/OPS.
9. Repository verifier checks required artifacts, links, placeholders, secrets, governance metadata and forbidden competitor material patterns.
10. Verification runs through a supported Windows path and CI; missing environments are reported BLOCKED/NOT-RUN.
11. Branch/reference/change controls and current platform enforcement limitations are evidenced.
12. No production code, empty architecture theatre, raw competitor evidence, secrets or unapproved cloud/stack assumptions enter the PG0 baseline.
13. Bootstrap review records exact changed/deleted paths, verification result, residual risks and Product Owner decision.

Passing PG0 authorizes PG1 needs/evidence work. It does not authorize production implementation.

## 26. Decision summary

The approved repository architecture is:

- one independent C1 repository now;
- Deployable Hosts separated from Deep Modules;
- Server as the only authoritative C1 runtime;
- Web/Desktop as presentation and explicit-intent surfaces;
- Workspace Service as user-session local mechanics only;
- Format Processing Runtime as isolated execution only;
- per-format Adapters governed by Format Intelligence;
- CAD/Office as non-authoritative Product Profiles;
- public contracts controlled centrally, internal interfaces colocated with owners;
- PG0 governance and clean-room bootstrap before product requirements or code;
- no D/Platform implementation before an independent C2 exists.

After Product Owner confirms this written artifact, the next step is a separate implementation plan for the repository bootstrap and PG0 evidence package. That plan will identify every retained, rewritten, removed and created path plus verification checkpoints. It will not implement PDM capability code.
