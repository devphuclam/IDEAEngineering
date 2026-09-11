# IDEA Engineering Design-Lesson Register

| Field | Value |
|---|---|
| Document ID | `IE-KNW-LESSON-001` |
| Status | Accepted design-input baseline |
| Effective date | 2026-08-27 |
| Inputs | `IE-KNW-ICV-001`, `IE-KNW-DDM-001`, official Aras research, stakeholder decisions, standards register |
| Output boundary | Design lessons and accepted decisions; not implementation or stakeholder requirements |

## 1. Translation rule

Research evidence answers “what was observed or published.” A Behavioral Coverage Disposition answers how IDEA treats one reference behavior. A design lesson answers “what IDEA should evaluate or protect.” An accepted ADR answers “which hard-to-reverse option IDEA chose.” A requirement answers “what IDEA must demonstrably do for its stakeholders.”

The approved DDM objective makes evidenced DDM behavior a default `ADOPT` candidate, while Aras is examined proactively for stronger patterns. No row below becomes a complete requirement merely because a competitor exhibits, markets, or omits a behavior; identity, scope, rationale, acceptance, verification, and approval remain required.

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
| `DL-022` | Constitution 3.1.0, ADR-0009, DDM public/authorized evidence, official Aras research | DDM defines the default behavioral coverage target, while Aras must be examined proactively for a stronger pattern and as fallback for DDM gaps. | `ADOPT`, `ADAPT`, `ADAPT-ARAS`, `DEFER`, `EXCLUDE`, or `UNKNOWN` disposition with Product Decision Authority review for material divergence | Accepted governance rule |
| `DL-023` | Stakeholder decisions Q121-Q125 | A credible MVP proves one complete controlled engineering release, including its failure paths, rather than presenting a broad collection of disconnected partial features. | MVP Release Spine from New or Store Existing through exact-baseline reproduction | Accepted product-scope rule |
| `DL-024` | Stakeholder decisions Q121-Q125 and `DL-018`, `DL-021` | Product claims must stop at the boundary of measured evidence; functional correctness does not establish productivity, internal adoption, operational readiness, or complete parity. Commercial market fit is not an internal-product outcome. | MVP Evidence Claim plus separate representative measurement | Accepted evidence rule |
| `DL-025` | Stakeholder decisions Q121-Q125, `DL-011`, `DL-012` | MVP format breadth and format depth are different commitments. Generic control protects extensibility while one deep profile proves the adapter seam without promising every design application. | Generic Controlled-File Baseline plus one DOC-02-selected deep CAD Capability Profile | Accepted MVP scope; exact profile pending |
| `DL-026` | Stakeholder decisions Q126-Q130 and Constitution 3.3.0 | IDEA exists to improve the company's internal engineering control and release confidence; the reference-product strategy is not itself a customer problem or commercial business case. | Internal Operational Value and an evidence-labelled internal Problem Hypothesis | Accepted product-vision rule |
| `DL-027` | Stakeholder decisions Q126-Q130 | A preselected build direction does not remove the need to test feasibility honestly against the current process, buy-and-configure, and adapt-or-integrate alternatives. | DOC-02 option assessment with explicit assumptions, evidence, stop conditions, and Product Decision Authority disposition | Accepted feasibility rule |
| `DL-028` | Stakeholder decisions Q126-Q130 and single-author constraint | Roadmap commitments must follow capability, gate, dependency, and evidence maturity; unevidenced calendar promises conceal uncertainty and unavailable independent review. | Gate-based DOC-07 roadmap; dates follow bounded estimates and named resources | Accepted delivery-planning rule |
| `DL-029` | Stakeholder decisions Q131-Q135 and Constitution 3.3.0 | An internal product must prove value in a bounded representative engineering context before broader rollout; company-wide scope cannot be inferred from a successful synthetic demo. | One technical group and one representative internal project for the first pilot; exact unit remains open until assigned | Accepted rollout-scope rule |
| `DL-030` | Stakeholder decisions Q131-Q135 and Constitution 3.3.0 | One person operating multiple identities can test functional authorization and workflow separation, but cannot supply independent or representative user-acceptance evidence. | Single-Actor Functional Acceptance is labeled limited; Internal Pilot Acceptance requires representative internal-user evidence and Internal Adoption Authority | Accepted evidence rule |
| `DL-031` | Stakeholder decisions Q131-Q135 and repository data controls | Pilot evidence must be useful without turning source control into an unapproved production-data store. | Canonical Demo Dataset in repository; sanitized or production-derived project evidence in company-approved storage with metadata and handling controls | Accepted data-boundary rule |
| `DL-032` | Stakeholder decisions Q131-Q135 and `DL-023` | A single end-to-end vertical slice exposes integration and safety risks earlier than independent feature silos. | Identity → safe publish → engineering release → format depth → internal pilot/UX hardening | Accepted delivery-sequence rule |
| `DL-033` | Stakeholder decision Q137 and Constitution 3.3.0 | Technical verification and operational adoption are different authorities. A one-person technical pilot need not wait for an adoption decision, but rollout cannot be authorized implicitly. | Technical Pilot Verification may proceed without Internal Adoption Authority; Internal Pilot Acceptance and rollout require its disposition | Accepted gate-boundary rule |
| `DL-034` | Stakeholder decision Q139, Constitution 3.3.0, and `DL-018` | Reference-product capability evidence establishes coverage questions, not the company's internal problem, stakeholder need, or value. | Record DDM/Aras material as Reference-Coverage Evidence; retain Problem Hypothesis as `UNKNOWN` or `BLOCKED` until internal evidence exists | Accepted evidence-class rule |
| `DL-035` | Stakeholder decisions Q141 and Q146, Constitution 3.3.0 | Reference evidence can justify product direction without being mislabeled as validation of the company's internal need. | Accept a Reference-Backed Product Hypothesis for documentation and feasibility; retain Internal Operational Need Validation as `UNKNOWN`/`BLOCKED` until representative internal evidence exists | Accepted evidence-layer rule |
| `DL-036` | Stakeholder decisions Q142-Q143 | A technical pilot can use role-based Test Personas in an approved non-production boundary before representative users are available, but that evidence must remain clearly limited. | Technical Pilot Verification with Design Engineer, Reviewer/Approver, PDM Admin, Quality/Audit, and Security/Ops personas | Accepted pilot-evidence rule |
| `DL-037` | Stakeholder decision Q144 | Internal extensibility is useful, but a one-group MVP must not silently become a company-wide rollout commitment. | Keep future multi-team or multi-site support as an extensibility concern; introduce each new scope through change control | Accepted scope rule |
| `DL-038` | Stakeholder decision Q145 and `DL-024` | The first success claim should measure correctness and safety rather than presume efficiency. | MVP Success Metric Set: exact reproduction, zero accepted stale/unauthorized outcomes, local-work preservation, audit/pin completeness, and restore success | Accepted measurement rule |

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
| Treat “competitor has it” as a complete requirement | The approved DDM objective makes evidenced behavior a coverage candidate, but each requirement still needs controlled scope, acceptance, verification, and trace; an Aras-informed replacement also needs explicit review. |
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

“DDM has it” identifies a default coverage candidate under the approved product objective, but is not
a complete requirement or acceptance method. “Aras does it better” requires an evidenced comparison
and Product Decision Authority approval before it replaces the DDM reference behavior.

## 5. Open decisions

The following remain intentionally open until stakeholder requirements and authorized evidence exist:

- representative internal evidence completing Internal Operational Need Validation and operational acceptance criteria; the Reference-Backed Product Hypothesis permits documentation to continue but is not a substitute;
- named Internal Adoption Authority before `Internal Pilot Acceptance` or operational rollout (not required for bounded Technical Pilot Verification);
- exact initial technical group and representative internal project selected for the controlled pilot;
- representative internal-user participants and the disposition that will convert limited functional acceptance into Internal Pilot Acceptance;
- approved resource, cost, and schedule envelope for the single Principal Product Author;
- technology stack, database, object store, search engine, and transport;
- exact DDM target version, edition, configuration, and authorized runtime-evidence scope;
- exact list of enabled generic formats and the selection and evidence thresholds for the single deep MVP CAD Format Capability Profile;
- successor Revision Scheme content after the seeded `A` through `Z` labels and remaining product-specific release-policy detail;
- Reservation Lease durations and the detailed operational procedure for Reservation Recovery;
- detailed PLM module sequence after the seeded Engineering Release workflow and deferred full ECR/ECO capability;
- RPO, RTO, capacity, latency, availability, and retention thresholds;
- identity provider, deployment topology, and cloud/on-premises selection;
- detailed break-glass interaction/authentication procedure, organization-configuration portability, and product-default upgrade/merge mechanics;
- C2 identity and any future Interoperability Fabric contract.
