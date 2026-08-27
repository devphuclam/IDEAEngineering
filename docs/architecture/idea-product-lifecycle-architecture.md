# IDEA Engineering Product Lifecycle Architecture

| Field | Value |
|---|---|
| Document ID | `IE-ARC-C1-001` |
| Status | Accepted architecture baseline |
| Effective date | 2026-08-27 |
| System of interest | `C1 — IDEA Engineering` |
| Product trajectory | PDM foundation → PLM capability inside C1 → Platform participation after C2 |
| Architecture input | `RS-ARC-001`, SHA-256 `EA477E3257E9B43222EC7EE2D34520449041E2385BFFCA7CBEFC49BF9579E78A` |
| Repository architecture | `IE-ARC-BOOT-001` |
| Standards source | `IE-GOV-STD-001` |
| Conformity claim | None |

## 1. Purpose and authority

This document is the product-behavior architecture for IDEA Engineering C1. It controls the meaning and ownership of Product Definition, Logical Document, Generation, Business Revision, Reservation, Structure Snapshot, Check-in Change Set, Workflow, Release Record, and format capability.

The [repository bootstrap architecture](../superpowers/specs/2026-08-26-idea-engineering-repository-bootstrap-pg0-design.md) controls PG0 repository organization and governance. The [domain language](../../CONTEXT.md) controls terminology. Accepted [ADRs](../adr/) control hard-to-reverse choices. Detailed requirements and technology decisions remain later gated artifacts.

Research findings are inputs through the [clean-room transfer register](../governance/clean-room-transfer-register.md). They do not override this architecture or become requirements by themselves.

## 2. Goals and non-goals

### Goals

- deliver a useful PDM foundation without blocking PLM growth;
- preserve one stable identity/version model through PDM-to-PLM evolution;
- support many design/document applications without running IDEA code inside them;
- make authoritative ownership, concurrency, conflict, and release semantics explicit;
- publish complete Product Definition atomically across metadata, binary artifacts, and structure;
- isolate file-format intelligence and untrusted processing;
- retain traceable history, approval evidence, and recoverability;
- prepare stable C1 identities/contracts without implementing Platform D prematurely;
- design deep modules whose interfaces are also their test surfaces.

### Non-goals

- cloning icVault or DDM implementation, UI, schema, protocol, or deployment;
- selecting language, framework, database, object store, cloud, or message technology;
- automatic merge of proprietary CAD/Office binary edits;
- observing unsaved in-memory state inside external applications;
- promising deep extraction for every format;
- creating empty PLM modules before requirements exist;
- implementing C2 or Interoperability Fabric D before a real cross-C use case;
- claiming ISO conformity or competitor feature parity.

## 3. Evolution and system boundary

IDEA Engineering is C1 throughout its PDM and PLM life. PDM-to-PLM is capability growth inside C1, not movement from layer C to D.

```text
C1: IDEA Engineering
  PDM foundation
    → controlled change and decision capability
    → release packages and lifecycle trace
    → broader PLM collaboration

C2: a future independently useful capability

C1 + C2 + concrete cross-application needs
    → Interoperability Fabric D
    → IDEA Platform
```

C1 must remain useful, deployable, testable, supportable, and authoritative while C2 and D are absent. D may link or coordinate C1 with another C, but it cannot own C1 documents, revisions, reservations, workflow transitions, or release decisions.

## 4. Stakeholders and concerns

| Stakeholder | Primary concern |
|---|---|
| Design engineer | Clear Checkout/Open/Save/Check-in; no lost local work; multi-tool support |
| Reviewer/Approver | Exact Revision, Generation, Structure Snapshot, and evidence before release |
| PDM administrator | Governable workflows, metadata, access policy, numbering, and format capability |
| Auditor/Quality | Traceability, immutable history, approval evidence, and controlled export |
| Security administrator | Least privilege, identity, credentials, audit, and incident response |
| Platform operator | Availability, backup, restore, reconciliation, capacity, and observability |
| Product Owner | Usable PDM now without blocking PLM/Platform evolution |
| Developer/Maintainer | Deep-module ownership, testability, compatibility, and diagnosability |
| Future C owner | Stable public C1 contract without access to C1 internal schema |

## 5. ISO/IEC 25010:2023 quality profile

The controlled edition and applicability state are maintained in the [standards register](../governance/standards-register.md). This table applies the nine product-quality characteristics without reproducing normative clauses.

| Characteristic | C1 interpretation | Future Platform interpretation |
|---|---|---|
| Functional suitability | Correct document, Generation, Revision, structure, workflow, and release invariants | Cross-C behavior preserves each owner's semantics |
| Performance efficiency | Search, hashing, transfer, and large-structure operations meet measured workload targets | D does not become a cross-C bottleneck |
| Compatibility | Generic format baseline, explicit deeper capabilities, and versioned contracts | C units interact through contracts, not shared storage/schema |
| Interaction capability | Version, progress, conflict, and recovery states are actionable | Operators and developers can diagnose cross-C flows |
| Reliability | Atomic publish, idempotency, reconciliation, backup, and restore | Delivery is reliable and one C's failure is isolated |
| Security | Clients lack infrastructure credentials; owner enforces authorization | Identity and service authorization cross explicit trust seams |
| Maintainability | Deep modules, one authoritative owner, contract tests, observable behavior | D contains no C business rules |
| Flexibility | Add formats and PLM modules without rewriting the PDM foundation | Add a C without changing existing C ownership |
| Safety | Prevent use or release of wrong/incomplete engineering state | Cross-C integration fails safe with traceable warnings |

Every later quality requirement records: ID, scope, stakeholder/concern, quality characteristic, stimulus, operating condition, expected response, metric/threshold, priority, owner, related decisions, verification method, and required evidence.

## 6. Baseline quality scenarios

| ID | Required outcome | Verification intent |
|---|---|---|
| `Q-FS-001` Correct version semantics | Stable Logical Document identity; immutable published Generation; distinct Business Revision and Version; changed Check-in creates one Generation; no-op creates none; revision transition and baseline Generation are atomic | State-machine and invariant tests with zero mutation of published Generations |
| `Q-RL-001` Atomic Check-in | No visible Generation lacks verified artifacts/manifest; retry by OperationId is idempotent; multi-document publish is all-or-nothing; abandoned staging is reconciled | Fault injection at every publish step produces no partial Change Set |
| `Q-RL-002` Stale-write protection | Every publish carries expected Generation; non-owner and stale requests fail; Reservation is per Document; local work is preserved; binary is not auto-merged | Concurrency suite rejects every stale/non-owner publish |
| `Q-CP-001` Multi-format compatibility | Every accepted format supports generic control; deeper extraction is explicit and evidenced; no IDEA code runs inside design tools | Versioned Capability Profile and conformance suite per enabled format |
| `Q-SE-001` No infrastructure credential in clients | Desktop/Workspace hold no database or permanent object-storage credential; all domain access crosses authenticated C1 interface | Package/config scan and direct-infrastructure denial tests |
| `Q-MA-001` Module ownership | Module writes only owned state; projections are not authority; implementation replacement preserves interface | Dependency/schema ownership and module-interface tests |
| `Q-EV-001` C1 autonomy | C1-local Check-in, workflow, search, and release work with D absent; other C/D cannot access C1 internal schema | Standalone conformance and architecture dependency tests |
| `Q-IC-001` Actionable conflict UX | Conflict identifies document, permitted owner information, expected/current Generation, local-work safety, and valid next actions | Every conflict class satisfies the response contract |
| `Q-SA-001` Controlled release | Release validates artifacts, structure, approvals, and policy; insufficient evidence fails closed; Release Record pins exact baseline | Negative-gate and exact-baseline acceptance tests |
| `Q-PE-001` Evidence-based performance | Release claims include workload, dataset, topology, percentile latency, throughput, errors, and resources | Reproducible benchmark profile; no unscoped marketing claim |
| `Q-RC-001` Recoverability evidence | Backup covers metadata, artifacts, configuration, and required cryptographic material; restore proves one consistent point | Restore drill resolves and digest-checks every retained Generation in scope |

Numeric performance, availability, RPO, and RTO thresholds are deployment requirements derived later from stakeholder workloads and risk.

## 7. Architecture principles

| ID | Principle |
|---|---|
| `AP-01` | C1 is autonomous from C2 and D. |
| `AP-02` | D connects C units and owns no C1 business rule or state. |
| `AP-03` | Every authoritative state has one owner module. |
| `AP-04` | Logical identity is stable and published snapshots are immutable. |
| `AP-05` | Product Definition publishes atomically at the business seam. |
| `AP-06` | Concurrency, scope, ownership, and conflict are explicit. |
| `AP-07` | Retriable operations are idempotent by design. |
| `AP-08` | Public contracts are versioned before external dependence exists. |
| `AP-09` | Security controls live at explicit trust seams and authoritative owners. |
| `AP-10` | Traceability and evidence are first-class product data. |
| `AP-11` | Failure isolation, reconciliation, and recovery are designed with the happy path. |
| `AP-12` | Quality claims require observable evidence. |
| `AP-13` | PDM-to-PLM growth extends the foundation instead of rewriting it. |
| `AP-14` | Release fails closed when the exact baseline or evidence is incomplete. |
| `AP-15` | External design tools remain untouched by IDEA runtime code. |

## 8. Logical architecture

```text
External design/document applications
IRONCAD | SolidWorks | Inventor | AutoCAD | Word | Excel | ...
No IDEA code executes inside these applications
                         │ persisted ordinary files
                         v
Managed Workspace
files | Workspace Manifest | cache | recovery state
            │                                  │
            v                                  v
IDEA Desktop  <------ local IPC ------>  IDEA Workspace Service
explicit user intent                       hash/cache/materialize/transfer
            └──────────────────┬──────────────────┘
                               │ authenticated C1 interface
                               v
IDEA Web ----------------> IDEA Server — C1 authority
                               │
                               │ controlled immutable-input jobs
                               v
                     Format Processing Runtime
                     isolated adapters/tools
```

This view does not choose transport, process count, host count, or scaling topology.

## 9. Deployable Hosts

| Host | Owns/does | Must not do |
|---|---|---|
| IDEA Server | Authenticated C1 interface, command/query coordination, authoritative persistence, authorization enforcement, atomic publish, workflow, audit/outbox, job control | Expose internal schema; delegate domain authority to clients/workers; depend on C2/D for C1-local behavior |
| IDEA Web | Search/browse/view, review/approval, governed administration, policy-appropriate download/preview | Implement authoritative version/reservation/release rules; access domain stores directly |
| IDEA Desktop | Explicit Checkout/Open/Check-in/Cancel/Recover intent, scope confirmation, conflict/recovery UX, launch via OS association | Run inside design applications; publish automatically on Save; hold infrastructure credentials |
| IDEA Workspace Service | User-session materialization, full scan/hash, cache, safe queue, resumable transfer, manifest, progress/recovery state | Check in/approve/release/merge autonomously; become product authority |
| Format Processing Runtime | Isolated format jobs, external-tool limits, result/provenance capture | Decide product state; mutate originals; access domain database directly |

Workspace Service is a product term. Its initial deployment meaning is a user-session background process, not automatically a privileged Windows service.

## 10. Deep modules and ownership

| Module | Small interface intent | Complexity hidden | Authoritative state |
|---|---|---|---|
| Controlled Product Data | Reserve/recover; begin/finalize Check-in; create Revision; read controlled snapshot; disposition | identity, Generation Manifest, Artifact references, Working Head, optimistic concurrency, Change Set, retention | Logical Document, Generation, ArtifactReference, Revision/Version, Reservation, CheckInOperation, Check-in Change Set, Disposition |
| Product Structure | Prepare/resolve/compare Structure Snapshot | occurrence/dependency identity, graph validation, exact pins, unresolved/manual relations | StructureSnapshot, StructureNode, DependencyEdge |
| Lifecycle Governance | Request transition; record decision; query allowed actions | versioned workflow, approval, release gates, separation of duties, Revision Policy | WorkflowDefinitionVersion, WorkflowInstance, ApprovalDecision, ReleaseRecord |
| Information Model | Validate metadata; allocate number; query schema | schema evolution, classification, validation, numbering policy | MetadataSchemaVersion, Classification, NumberingPolicy |
| Format Intelligence | Request analysis/representation; accept result; query capability | capability negotiation, adapter/tool provenance, extraction, warnings, derivative alignment | FormatCapability, AnalysisRequest/Result, Representation |
| Access Policy | Authorize; explain decision; manage policy | state-aware role/group grants and decision evidence | AccessPolicyVersion, Grant, PolicyDecisionEvidence |
| Discovery | Search; saved query; rebuild projection | indexing, ranking, filtering, pagination, projection recovery | Rebuildable search projection and saved query |
| Audit Evidence | Query/export; controlled internal append | actor normalization, before/after, correlation, retention, tamper-evident export | Append-only EvidenceRecord |

Rules:

- one module mutates only state it owns;
- the module interface is the caller and test surface;
- callers cannot orchestrate internal steps or depend on internal schema;
- application coordination may span module interfaces;
- an invariant requiring atomicity may share one unit of work while the modules are colocated, without allowing cross-owner writes;
- extracting a module into a network process requires an explicit protocol/saga and reevaluation of affected quality scenarios;
- authentication is an application/infrastructure concern; Access Policy owns policy while the resource-owning module enforces the final business decision;
- Discovery and representations are rebuildable projections, never authoritative substitutes;
- storage, clock, identity provider, search engine, messaging, and transfer implementations are adapters/internal seams, not domain modules merely because code exists.

## 11. Canonical identity model

| Identity/concept | Meaning |
|---|---|
| `DocumentId` | Stable Logical Document identity |
| `GenerationId` | Immutable published Product Definition identity |
| `GenerationManifest` | Revision coordinate, artifact digests, versioned metadata, Structure Snapshot, and provenance |
| `ArtifactId` | Logical reference to immutable binary content |
| `ContentDigest` | Integrity/deduplication hash |
| `RevisionId/RevisionCode` | Business Revision identity and label |
| `VersionSequence` | Generation order inside one Business Revision |
| `WorkingHeadGenerationId` | Exact concurrency base for the next controlled change |
| `ReleaseRecordId` | Immutable release evidence identity |
| `StructureSnapshotId` | Immutable structure baseline identity |
| `WorkspaceId` | Managed Workspace identity on a user device |
| `ReservationId` | Publish-reservation identity |
| `OperationId` | Client-generated idempotency identity for Check-in |
| `ChangeSetId` | Successful atomic multi-document publish identity |
| `WorkflowDefinitionVersion` | Exact rule version explaining transition history |
| `ActorId` | Stable human/service actor reference |

## 12. Core invariants

1. `DocumentId` does not change across Generations or Business Revisions.
2. A published Generation is immutable.
3. Every Generation has a complete manifest with verified artifacts, versioned metadata/schema, required Structure Snapshot, and provenance.
4. Mutable operational data such as cache, heartbeat, notification state, or search rank is not Product Definition.
5. A Logical Document has at most one Working Head.
6. Finalize succeeds only when actor/workspace owns a valid Reservation and expected Generation equals current Working Head.
7. A change to artifact, versioned metadata, or Product Structure creates exactly one new Generation and increments Version within Revision once.
8. Semantic equality with Working Head returns `NoChange`; it creates no Generation but records outcome and applies explicit Reservation Disposition.
9. VersionSequence is unique and strictly increasing within Document plus Business Revision, beginning at `1`.
10. Creating a Business Revision creates a new baseline Generation `Version 1`; immutable Artifact content may be reused by digest.
11. Every successful multi-document Check-in creates one Check-in Change Set; all changed entries publish or none publish.
12. A Structure Snapshot pins exact identities needed for reproducibility; a Release Record always uses exact pins.
13. A Release Record is immutable and never follows a later Working Head.
14. Reservation belongs to one Logical Document; parent/child relations do not propagate it.
15. Reservation binds Document, Actor, Workspace, expected Generation, and lease; another workspace cannot use it implicitly.
16. Bulk Reserve is all-or-nothing for the user-confirmed scope; excluding a blocked item requires a newly confirmed scope.
17. Workflow history identifies the Workflow Definition Version used.
18. Search, preview, and other projections cannot mutate or substitute authoritative state.
19. Trash changes Document Disposition and retains history.
20. Purge follows retention, legal-hold, release/reference, authorization, and evidence rules; physical deletion is reconciled before `Purged` is final.

Semantic no-change comparison includes Artifact digest, normalized versioned metadata, and semantic Structure Snapshot digest in the same Revision. Operation/actor/upload timestamps, cache, preview, and search fields are excluded unless policy explicitly promotes a derived value into Product Definition.

## 13. Storage model

- relational persistence holds identities, relationships, policies, state machines, constraints, concurrency tokens, and outbox/evidence references;
- private object storage holds immutable original Artifacts and derivatives;
- search is a rebuildable index;
- audit is append-only in the logical model with controlled retention/access;
- uploads enter an expiring staging namespace;
- content-addressed deduplication is optional and cannot erase logical identity or retention semantics.

A physical object may be deleted only when no retained Generation Manifest references it.

Document Disposition follows:

```text
Active → Trashed → Restored
              └→ PurgePending → Purged
```

`Purged` is terminal only after policy-governed physical cleanup succeeds. Failure remains `PurgePending` with evidence.

## 14. Checkout, edit, and Check-in

### Checkout

1. Desktop resolves root and known Related Documents and displays every item in the requested scope.
2. The user confirms the scope; no hidden assembly cascade occurs.
3. Desktop submits each `DocumentId + ExpectedGenerationId`.
4. Server authorizes and atomically creates one Reservation per requested Document.
5. Any conflict rejects the confirmed set and identifies blocked entries.
6. The user may cancel or confirm a new scope that excludes blocked items.
7. Server returns a Workspace Manifest with exact Generation, digest, and `Reserved | Reference` mode.
8. Workspace Service materializes files and verifies digests before reporting completion.
9. Desktop opens the root through the operating system association.

A read-only file attribute may be a convenience warning, never a security guarantee. Lease renewal/recovery cannot bypass expected-Generation validation.

### Edit

- external applications read and write ordinary files;
- unsaved in-memory state is outside IDEA's observation;
- local files may change without Reservation;
- Workspace Service records byte-level states such as `Unchanged`, `ModifiedReserved`, `ModifiedWithoutReservation`, `Missing`, and `Unresolved`;
- file-system evidence is not an assumption about semantic intent.

### Check-in

1. The user saves in the external application and returns to IDEA Desktop.
2. Workspace Service performs a full scan/hash and builds proposed manifests.
3. Desktop displays changed, unchanged, unreserved-modified, missing, and unresolved entries.
4. The user confirms one Check-in scope and Reservation Disposition.
5. Unreserved changed dependencies block publish by default; any Draft exception requires explicit policy/evidence and Release always fails closed.
6. Server issues scoped resumable staging authorization.
7. Server validates content, digest, relation, metadata, authorization, Reservation, and expected Working Heads.
8. Semantic no-op entries create no Generation.
9. Verified content is materialized at immutable object identity and read-checked before public metadata points to it.
10. One transaction rechecks the complete set, publishes required Structure Snapshots and Generations, updates Working Heads, creates the Check-in Change Set, appends evidence/outbox, and marks Operation terminal.
11. Public reads resolve only after commit.
12. `Release | Retain` affects Reservations in scope only.
13. Retry with the same OperationId returns the same result and cannot create duplicate Generations.
14. Reconciliation removes expired staging and unreferenced private candidates.

## 15. Conflict behavior

| Situation | Required result |
|---|---|
| Another actor owns Reservation | Reject non-owner publish |
| Lease expired and head unchanged | Require policy-governed renew/recheckout/recovery; still validate expected head |
| Working Head advanced | Reject stale write and return current Generation |
| Same actor, different Workspace | Reject implicit use; require authorized transfer/recovery |
| Local work exists after rejection | Preserve it; do not overwrite or delete |
| Local file changed without Reservation | Mark `ModifiedWithoutReservation`; exclude from publish |
| Two proprietary binaries changed | No auto-merge; human creates an explicit reconciled working copy |
| Root selected but unreserved dependency also changed | Block by default because the structure would not be reproducible |
| Dependency unchanged locally but server head advanced | Return `DependencyAdvanced`; require refresh or explicit Draft pin policy |
| One entry conflicts in a multi-document scope | Reject the entire confirmed Change Set |
| Stuck Reservation | Authorized recover/break with audit; expected-head check remains |

Conflict responses include document, permitted owner information, expected/current Generation, local-work safety, and valid next actions. Version selection changes the workspace snapshot; it is not merge.

### Parent/child scenario

When B holds Reservation for Part 1 and A needs Assembly plus Parts 1–3:

1. A's first all-items Reserve request fails because Part 1 is unavailable.
2. A may explicitly confirm a new scope of Assembly, Part 2, and Part 3.
3. Part 1 is materialized as Reference at an exact Generation.
4. If A modifies Part 1 locally, Workspace Service marks it `ModifiedWithoutReservation`; A cannot publish it.
5. If B advances Part 1 while A works, A receives `DependencyAdvanced`.
6. A may publish only when the selected Product Structure remains reproducible under policy.
7. Local rejected work remains available for Save As, later Reservation, or manual reconciliation.

IDEA does not need to know whether A “intended” to edit Part 1. It relies on verifiable owner, baseline Generation, digest, and structure provenance.

## 16. Format capability model

Every accepted format/tool combination has a versioned Format Capability Profile:

| Capability | Declaration |
|---|---|
| Generic vaulting | Required |
| Open through OS association | Required where an association exists |
| Hash/change detection | Required |
| Dependency extraction | None / Manual / Parser |
| Property extraction | None / Manual / Parser |
| Structure extraction | None / Manual / Parser |
| Preview generation | None / Standalone tool |
| Neutral representation | None / Standalone tool |
| Round-trip fidelity | Measured; never assumed |

CAD and Office are Product Profiles for navigation, enabled adapters, lifecycle templates, support boundaries, and future packaging. They own no document, Generation, Reservation, Structure, workflow, access, or audit state.

Format jobs use immutable input authorization, isolated resource limits, adapter/tool version and digest provenance, validated output, idempotent retry, and stale-result rejection. Parse failure preserves the original Artifact.

## 17. Reliability and recovery

Check-in Operation states are:

```text
Prepared → Uploading → Validating → ReadyToPublish → Published
    └──────────────→ Failed
    └──────────────→ Cancelled
Published | Failed | Cancelled = terminal
```

Requirements:

- OperationId is unique and idempotent;
- staged and private candidate data remain invisible to authoritative reads;
- object existence/readability is verified before metadata publish;
- transaction writes Working Heads, Change Set, evidence, and outbox together;
- projections and notifications consume outbox after commit;
- reconciliation detects expired staging, unreferenced candidates, missing/corrupt objects, and projection drift;
- backup scope covers metadata, Artifacts, configuration, and required cryptographic material;
- restore produces one consistent point and verifies every retained Generation digest;
- RPO/RTO are measured deployment requirements, not inferred from successful backup jobs.

## 18. Security architecture

Trust zones are browser, user desktop/session, Managed Workspace, Server, data stores, worker isolation environment, and external tools.

Security requirements include:

- no database or permanent object-storage credential in Web/Desktop/Workspace packages or configuration;
- authenticated C1 interface and resource-owner authorization;
- scoped short-lived transfer authorization;
- per-user authenticated/protected Desktop-to-Workspace IPC;
- least-privilege worker access to one job/input/output scope;
- untrusted-file isolation, time/memory/CPU/output limits, and controlled external-tool execution;
- secret-free committed configuration;
- dependency/tool identity, SBOM, and build provenance for releases;
- security evidence without unnecessary personal or secret content;
- controlled vulnerability, incident, exception, and residual-risk handling.

Organization-level ISO/IEC 27001 certification is outside a repository's authority.

## 19. PLM evolution inside C1

PLM capabilities are added only after stakeholder-backed requirements:

| Capability | Ownership direction |
|---|---|
| Change Management | Change request/order/package, affected baselines, disposition, and decision evidence |
| Requirement and Decision Trace | Trace from need/requirement/decision to Product Definition and verification |
| Product Lifecycle Context | Product/project/program context and lifecycle milestone relationships |
| Release Governance | Controlled release package across affected Documents and Structure Snapshots |
| Extended Collaboration | Supplier/customer/reviewer collaboration under C1 policy |

These additions reuse Logical Document identity, immutable Generation, Business Revision, Structure Snapshot, Access Policy, Workflow, and Audit Evidence. They do not create a second PLM identity/version foundation.

## 20. Platform readiness

C1 prepares:

- globally stable C1-qualified public identities;
- versioned public command/query/event contracts;
- idempotency and correlation identities;
- explicit ownership and data-classification metadata;
- compatibility/deprecation policy;
- Cross-Application Link capability that references, rather than copies, another C's identity.

D is introduced only when C2 and concrete cross-C scenarios exist. D may route, orchestrate, project, or correlate across C units, but:

- C1-local commands never require D;
- D and C2 do not read/write C1 internal schema;
- D cannot approve/release/reserve on C1 except by an authorized C1 contract;
- failure in D does not corrupt C1 authoritative state;
- cross-C workflows use explicit timeout, retry, compensation, and ownership semantics.

## 21. Architecture viewpoints

The architecture description maintains views for:

- stakeholder/system context;
- domain ownership and information identity;
- deployable Hosts and trust zones;
- deep-module interfaces and dependencies;
- Checkout/Check-in sequence and state;
- storage consistency and recovery;
- format capability and worker isolation;
- security/authorization;
- quality scenarios and verification trace;
- PDM-to-PLM evolution and future Platform interoperability.

Each future view identifies stakeholder, concern, model kind, correspondence rules, and decisions in accordance with the adopted ISO/IEC/IEEE 42010 approach.

## 22. Verification baseline

| Area | Required evidence |
|---|---|
| Domain invariants | Model/state-machine tests and property tests |
| Module ownership | Dependency and schema-ownership checks |
| Public/internal interfaces | Contract and compatibility tests |
| Concurrency | Owner, stale-head, replay, lease, transfer, bulk rollback, multi-workspace tests |
| Atomic publish | Fault injection before/after every staging/materialization/transaction boundary |
| Structure | Exact-pin, unresolved relation, cycle, large-graph, and release-baseline tests |
| Formats | Capability-profile conformance for exact adapter/tool version |
| Security | Threat model, authorization matrix, secret/package scan, trust-seam tests |
| Reliability | Retry/idempotency, reconciliation, crash recovery, backup/restore drill |
| Interaction | Task-based Checkout/conflict/recovery usability evidence |
| Performance | Versioned workload profile with percentiles, throughput, errors, resources |
| Release safety | Negative-gate tests and exact Release Record verification |
| C1 autonomy | Full C1 conformance with C2/D absent |

Verification outcomes are `PASS`, `FAIL`, `BLOCKED`, or `NOT-RUN`. Missing prerequisites and substitute tests cannot be reported as PASS.

## 23. Decision trace

| Decision | ADR |
|---|---|
| C1 evolves PDM to PLM; D waits for C2 | [ADR-0002](../adr/0002-c1-evolves-from-pdm-to-plm-before-platform.md) |
| No IDEA code inside design tools | [ADR-0003](../adr/0003-no-code-runs-inside-design-tools.md) |
| Start C1 as modular monolith with deep modules | [ADR-0004](../adr/0004-start-c1-as-a-modular-monolith.md) |
| Immutable Generations and atomic Check-in Change Sets | [ADR-0005](../adr/0005-use-immutable-generations-and-atomic-change-sets.md) |
| Reservation per Document/Workspace plus optimistic concurrency | [ADR-0006](../adr/0006-bind-reservations-to-document-and-workspace.md) |
| Generic vaulting plus external Format Intelligence | [ADR-0007](../adr/0007-use-generic-vaulting-and-external-format-intelligence.md) |

## 24. Delivery sequence

1. **PG0 Foundation:** governance, clean-room, terminology, standards, architecture, configuration/change control.
2. **PG1 Needs:** stakeholders, jobs, product scope, evidence gaps, operating contexts.
3. **PG2 Requirements:** functional, information, interface, quality, security, operation, support, and retirement requirements.
4. **PG3 Architecture:** technology-independent views refined; technology ADRs selected only from requirements.
5. **Generic PDM Core:** identity, Artifact, Generation, Reservation, Managed Workspace, Check-in Change Set, search, audit.
6. **Engineering structure/governance:** Structure Snapshot, workflow, approval, Release Record, metadata, numbering, access.
7. **Format depth:** per-format adapters and evidenced Capability Profiles.
8. **PLM evolution:** change, trace, lifecycle context, release packages, extended collaboration.
9. **Platform:** only after independent C2 and approved cross-C requirements.

At every stage, later capability extends the accepted identity and ownership foundation rather than bypassing it.
