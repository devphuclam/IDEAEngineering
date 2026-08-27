# IDEA Engineering Design-Lesson Register

| Field | Value |
|---|---|
| Document ID | `IE-KNW-LESSON-001` |
| Status | Accepted design-input baseline |
| Effective date | 2026-08-27 |
| Inputs | `IE-KNW-ICV-001`, `IE-KNW-DDM-001`, stakeholder decisions, standards register |
| Output boundary | Design lessons and accepted decisions; not implementation or stakeholder requirements |

## 1. Translation rule

Research evidence answers “what was observed or published.” A design lesson answers “what IDEA should evaluate or protect.” An accepted ADR answers “which hard-to-reverse option IDEA chose.” A requirement answers “what IDEA must demonstrably do for its stakeholders.”

No row below becomes a requirement merely because icVault or DDM exhibits, markets, or omits a behavior.

## 2. Accepted lessons

| Lesson ID | Evidence inputs | IDEA lesson | Accepted realization | Status |
|---|---|---|---|---|
| `DL-001` | `ICV-ID-001..008`, `VP-05` | Stable document identity, immutable Generation, Business Revision, and Version within Revision must be distinct concepts. | Canonical language plus invariant model in `IE-ARC-C1-001` | Accepted |
| `DL-002` | `TH2`, `TH6`, `TH9`, `TH18`, `VP-06` | Modification ownership belongs to each Logical Document; assembly relations do not silently create one transitive lock. | Reservation per Document | Accepted in ADR-0006 |
| `DL-003` | `TH21`, `TH22`, `VP-06` | Reservation cannot guarantee local immutability when external tools own editing; publish authority and optimistic concurrency must be enforced at Server. | Expected Generation plus owner/workspace validation; preserve rejected local work | Accepted in ADR-0006 |
| `DL-004` | `TH3`, `TH20` | Bulk operations need explicit confirmed scope and unambiguous per-item results; hidden partial success is unsafe. | ReserveSet and multi-document publish are all-or-nothing for the confirmed scope | Accepted architecture invariant |
| `DL-005` | `TH21`, `TH22`, version-selection boundary | Proprietary binary edits must not be auto-merged or silently overwritten. | Actionable conflict result plus explicit human reconciliation | Accepted architecture behavior |
| `DL-006` | `ICV-TOP-005..006`, `ICV-STO-001..003`, DDM atomicity unknowns | Metadata and binary storage form one recoverable business publish protocol even when implemented by separate stores. | Staging, digest verification, immutable materialization, one atomic Check-in Change Set, idempotency, reconciliation | Accepted in ADR-0005 |
| `DL-007` | `ICV-STR-001..003`, `VP-07` | Product Structure must be first-class, immutable at a published baseline, and pin exact identities needed for reproduction. | Structure Snapshot owned by Product Structure module | Accepted architecture invariant |
| `DL-008` | `ICV-TOP-002..005`, `ICV-SEC-001..002`, `VP-14` | Desktop clients and format workers must not own infrastructure credentials or bypass the authoritative application interface. | IDEA Server authority; scoped transfer; no direct domain-store access | Accepted security architecture |
| `DL-009` | `ICV-STR-002..003`, `ICV-STO-003` | Referential integrity, unique constraints, content hashes, reconciliation, and audit evidence must be deliberate product controls. | Owner-module schema constraints plus recovery/reconciliation tests | Accepted architecture invariant |
| `DL-010` | `ICV-WF-001..002`, `VP-09` | Workflow definitions, approvals, Revision effects, Release Records, notifications, and audit must have explicit version and transaction semantics. | Lifecycle Governance module and immutable Release Record | Accepted architecture direction; detailed requirements pending |
| `DL-011` | `VP-03..04` and the accepted multi-vendor stakeholder decision | IDEA must support design tools without running IDEA code inside them. | Managed Workspace, Desktop, and Workspace Service outside design applications | Accepted in ADR-0003 |
| `DL-012` | `VP-03..04`, `VP-07`, format unknowns | Generic controlled-file support must exist independently of deep format intelligence. | Generic vaulting baseline plus versioned per-format Capability Profile | Accepted in ADR-0007 |
| `DL-013` | `ICV-RCV-001..002`, `VP-15..16` | Backup completion is not recoverability; a consistent restore and verified digests are the evidence. | Coordinated backup scope, restore drills, deployment-specific RPO/RTO requirements | Accepted quality scenario; thresholds pending |
| `DL-014` | `VP-13..14`, DDM API unknowns | Supported public contracts must be distinguished from internal services, reporting access, file exchange, and implementation schema. | Versioned C1 external interface; internal module interfaces stay with owners | Accepted architecture rule |
| `DL-015` | Stakeholder decision plus platform-risk analysis | C1 must remain independently useful from PDM through PLM; Platform D exists only after an independent C2 and concrete cross-C needs. | C1 autonomy, public identities/contracts prepared now, no premature D | Accepted in ADR-0002 |
| `DL-016` | `TH3`, `TH20..22`, `VP-06` | Conflict UX must state what failed, what remains safe, and the permitted next actions. | Conflict catalogue includes document, owner where allowed, expected/current Generation, local-work state, and recovery actions | Accepted quality scenario |
| `DL-017` | `TH12..15` | Reference, Reservation, Check-in, no-op publish, and release/retain are separate lifecycle concepts. | Explicit workspace access mode and Reservation Disposition | Accepted architecture behavior |
| `DL-018` | `IE-KNW-DDM-001` §5 and `ICV-TOP-001..009` | Product claims require exact version/configuration/evidence scope; absence and marketing language cannot become universal facts. | Evidence taxonomy, clean-room register, requirement translation gate | Accepted governance rule |
| `DL-019` | icVault ACL gaps, `VP-10`, DDM authorization unknowns | Authorization policy must be centrally governed, explainable, and consistently enforced by every authoritative resource owner across Web, Desktop, transfer, preview, export, reporting, and workers. | Access Policy module plus owner-side enforcement and cross-path authorization matrix | Accepted architecture direction; detailed policy pending |
| `DL-020` | `ICV-META-002..003`, `VP-10`, `VP-15` | Number allocation needs explicit uniqueness, idempotency, cancellation/gap, retry, and partition policy; it becomes a distributed capability only if real deployment requirements demand it. | Numbering Policy inside Information Model initially; concurrency evidence required | Accepted architecture direction; business rules pending |
| `DL-021` | `VP-15..16` and the DDM runtime performance unknowns | Performance/capacity claims must be scoped to a versioned workload, dataset, topology, concurrency, latency distribution, throughput, errors, and resources. | `Q-PE-001` evidence-based performance scenario | Accepted quality rule |

## 3. Rejected direct-copy patterns

| Pattern | Why IDEA rejects it |
|---|---|
| Copy competitor database tables as the domain model | Tables reflect one implementation and may encode weak integrity or historical constraints. |
| Treat Checkout as a file-system lock | External applications can still modify persisted local files; Server publish control is the dependable seam. |
| Treat assembly Checkout as one inherited lock | Observed parent/child ownership was independent and hidden cascades create ambiguous scope. |
| Publish metadata before artifact correctness is established | Split-store partial failure can expose incomplete Product Definition. |
| Put domain rules into Web, CAD, and Office silos | It duplicates authority and creates inconsistent behavior across surfaces. |
| Require one add-in per design application | It raises vendor coupling and cannot provide a uniform multi-tool baseline. |
| Call internal WCF/SQL/reporting a public API | Internal surfaces lack an evidenced compatibility and security contract. |
| Derive requirements from “competitor has it” | Vendor behavior is neither stakeholder need nor acceptance evidence. |
| Claim recovery because backup exists | Recovery requires a coordinated restore and verified recoverable state. |
| Build Platform D before C2 | It creates distributed complexity without a real interoperability consumer. |

## 4. Requirement translation gate

Before any lesson becomes an IDEA requirement, the requirement record must contain:

- unique ID and owning product scope;
- stakeholder and business/user problem;
- functional or ISO/IEC 25010 quality concern;
- stimulus, operating condition, expected response, and failure response;
- measurable threshold where meaningful;
- security, safety, privacy, retention, and operational constraints;
- acceptance criterion and verification method;
- trace to this lesson and separately to stakeholder evidence;
- architecture/ADR impact;
- approval and change history.

“DDM has it,” “icVault does it,” and “the tutorial shows it” are never sufficient rationale.

## 5. Open decisions

The following remain intentionally open until stakeholder requirements and authorized evidence exist:

- technology stack, database, object store, search engine, and transport;
- exact list of enabled formats and per-format capability levels;
- Revision code sequence and product-specific release policy;
- reservation lease durations and administrative break policy;
- offline-work policy and allowed Draft dependency pinning;
- workflow templates, ECR/ECO scope, and PLM module sequence;
- RPO, RTO, capacity, latency, availability, and retention thresholds;
- identity provider, deployment topology, and cloud/on-premises selection;
- C2 identity and any future Interoperability Fabric contract.
