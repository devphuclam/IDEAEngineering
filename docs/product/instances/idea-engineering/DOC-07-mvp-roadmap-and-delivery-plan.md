# IDEA Engineering Analysis, Design and Core v0 Delivery Roadmap

> **Instance state**: controlled `Draft 0.16`. This roadmap plans work and decision presentations. It
> does not create or approve Feature, Spec or Tech content by schedule assertion, and it does not
> authorize production implementation or release.

## Control envelope

| Field | Recorded value |
|---|---|
| Stable Document ID | `IE-PROD-ROADMAP-001` |
| Document Class | `DOC-07` |
| Title | IDEA Engineering Analysis, Design and Core v0 Delivery Roadmap |
| Owner | `Principal Product Author`; named person attribution `BLOCKED` before `Proposed` |
| Document Status | `Draft` |
| Document Version | `0.16` |
| Applicable Baseline | `IDEA-C1-ANALYSIS-DESIGN-001` |
| Effective Date | `NOT APPLICABLE` until approval |
| Authors | `Principal Product Author`; named identity to be recorded before `Proposed` |
| Reviewers | Project user performs internal document review; independent/specialist review remains separately unassigned |
| Approvers | Product Decision Authority approved the Feature, Spec and Tech baseline recorded by the project user. The project user selected the Core v0 roadmap baseline on 21-09-2026; that planning selection is not a fourth Product Decision Authority axis. |
| Source Links | [Product templates](../../definition/README.md), [domain language](../../../../CONTEXT.md), [architecture baseline](../../../architecture/idea-product-lifecycle-architecture.md), [design lessons](../../knowledge/idea-design-lessons.md) |
| Downstream Links | [Task appendix A](planning/DOC-07-appendix-A-task-breakdown-december-2026.md), [Gantt view](planning/idea-roadmap-december-2026.html), three decision briefs, supporting records and later implementation increments |
| Evidence / Claim Status | `IDEA DECISION` for accepted planning rules; execution and gate evidence remains `NOT-RUN` |
| Change History | 0.16: select the 23-09–31-12 Core v0 execution baseline: 512 task hours, 88 technical-reserve hours and 32 operational-buffer hours; one Vault in Core v0 with an explicit future multi-vault seam; [IE-CHG-ROADMAP-CV0-001](registers/CHG-2026-09-21-core-v0-roadmap-rebaseline.md). Earlier history remains in linked change records. |
| Change Record | [IE-CHG-ROADMAP-CV0-001@0.1](registers/CHG-2026-09-21-core-v0-roadmap-rebaseline.md); [IE-CHG-COMMERCIAL-DIR-001@0.1](registers/CHG-2026-09-17-internal-first-commercial-direction.md); predecessor planning records retained in Git |
| Supersedes / Superseded by | Supersedes `DOC-07@0.15`; superseded by `NOT-APPLICABLE` |
| Access Classification | `INTERNAL` |
| Retention Rule | Retain with the product-definition baseline; exact organizational retention period is `UNKNOWN`, owner `Product Decision Authority`, review trigger before `Approved` |
| Content State | `COMPLETE CONTROLLED DRAFT` with explicit unresolved actions |

## Indexed increment identity

The rows in this version are roadmap candidates. Before an increment becomes `Proposed`, it receives
an independent controlled increment record with its source baseline, owner, version, gate, trace and
exit evidence. The roadmap index is navigation only.

| Increment Record ID | Source Roadmap Baseline | Status | Version | Owner | First / later gate | Requirement and design trace | Exit evidence |
|---|---|---|---|---|---|---|---|
| `IE-INC-FEATURE-001` | `IE-PROD-ROADMAP-001@0.16` | `Draft` | `0.1` | Principal Product Author | `PG1` / `PG2` on material scope change | DOC-01/02/03, coverage records, `FEATURE-001` | Feature decision, source pins and open-action disposition |
| `IE-INC-SPEC-001` | `IE-PROD-ROADMAP-001@0.16` | `Draft` | `0.1` | Principal Product Author | `PG2` / `PG3` on requirement change | DOC-03/04/06/08, `SPEC-001` | Spec decision, trace and V&V readiness |
| `IE-INC-TECH-001` | `IE-PROD-ROADMAP-001@0.16` | `Draft` | `0.1` | Principal Product Author | `PG3` / `PG4` on technology change | DOC-02/04/05/06/08, ADRs, `TECH-001` | Tech decision, architecture review and risk disposition |
| `IE-INC-READY-001` | `IE-PROD-ROADMAP-001@0.16` | `Draft` | `0.1` | Principal Product Author | `PG4` | Approved Feature/Spec/Tech baselines and supporting records | Bounded implementation plan, tests, migration/recovery and gate result |

<!-- AUTHOR CONTENT START -->

## 1. Roadmap intent and constraints

| Field | Recorded value |
|---|---|
| Roadmap objective | Use the approved Feature, Spec and Tech baseline, pass implementation readiness, and deliver a small installable Core v0 for bounded internal use by 31 December 2026. Core v0 uses one Vault but preserves the architecture seam required to add multiple Vaults later. The date does not represent company-wide rollout or commercial release. |
| Source product baseline | `IDEA-C1-ANALYSIS-DESIGN-001`; fixed reference-product public baseline dated 2026-08-26; target-runtime semantics remain explicitly unverified. |
| Planning assumptions | Assistant acts as Principal Product Author, the project user reviews documents, and the boss decides Feature, Spec and Tech. The user initially administers native accounts and may operate the server; dedicated DevOps, independent/specialist competence and long-term support are not assumed. |
| Constraints | Internal-first company product; clean-room behavioral design; future commercial operation is several years away and not part of Core v0; eight Core Product Documents remain detailed authority; three Vietnamese decision briefs are the boss-facing views; English Markdown remains editable authority; no implementation before applicable gates. |
| Planning horizon | 23 September–31 December 2026; 79 working days using Monday–Friday plus the first, third and fifth Saturday of each month (the second and fourth Saturdays are days off). Implementation slices remain unauthorized until their applicable requirements, design and `PG4` readiness pass. |

## 2. Decision presentation plan

The Product Decision Authority reads three concise briefs, not the complete eight-document source
set. Each brief pins its exact source versions and presents one decision axis only.

| Presentation | Purpose | Required preparation | Demonstration / evidence | Requested boss decision | Readiness |
|---|---|---|---|---|---|
| `FEATURE-001` | Confirm Core v0 capability scope, priority and exclusions | DOC-01/02/03 drafts, closed material inventory, coverage dispositions, updated DOC-07 | Interactive prototype as draft design evidence; feature map and deferred-scope list | Approve, require changes, defer or reject the Feature baseline | Exact 14-group predecessor Feature baseline `APPROVED` on 17-09-2026; no successor Feature change is introduced here |
| `SPEC-001` | Confirm observable behavior, rules, failure handling and acceptance | Approved Feature baseline; DOC-04 plus requirement-bearing DOC-06/08 content; VVP trace | Release Spine scenarios including stale, unauthorized, wrong-workspace and recovery paths | Approve, require changes, defer or reject the Spec baseline | DOC-04@0.13 predecessor `APPROVED`; DOC-04@0.14 Vault-transfer successor has 90 requirements and exact PDA review is `NOT-RUN` |
| `TECH-001` | Confirm architecture and technology choices | Approved Spec baseline; DOC-02/04/05/06/08 design; technology ADRs and risk analysis | Eight technology views, deployable hosts, data flow, alternatives, residual risks and bounded qualification evidence | Approve, require changes, defer or reject the Tech baseline | TECH-001@0.14 Tech Stack `APPROVED`; 0.15 keeps it and adds the Vault successor, whose exact PDA review is `NOT-RUN`. Q-15 remains `PARTIAL / NO WINNER`; qualifications remain open. |

The briefs may be rendered as DOCX or PDF for the meeting. A rendition never replaces its pinned
Markdown source. A changed source makes the earlier rendition `Stale`.

The states above distinguish the exact predecessor baseline approved on 17-09-2026 from the later
Vault successor Draft. Approval evidence remains attached to the versions on which it was recorded;
it does not silently approve DOC-04@0.14, TECH-001@0.15 or this re-planning delta.
Do not infer a new approval from a version update.

## 3. Bounded analysis and design increments

| Increment ID | Objective and scope | Required baseline | Dependencies | Owner | Gate | Status |
|---|---|---|---|---|---|---|
| `IE-INC-FEATURE-001` | Author vision, feasibility, business needs, coverage and the Feature brief | DOC-01/02/03, DOC-07, GOV coverage | Named source identities; fixed public baseline; Product Decision Authority availability | Principal Product Author | `PG1` | `Draft` |
| `IE-INC-SPEC-001` | Translate approved scope into verifiable functional, information, quality, security, operational, localization and interaction requirements | Approved Feature decision; DOC-03/04/06/08; VVP/RSK | Feature stability; explicit thresholds or owned `UNKNOWN` values | Principal Product Author | `PG2` | `Draft` |
| `IE-INC-TECH-001` | Select architecture and technology against approved requirements | Approved Spec decision; DOC-02/04/05/06/08; ADR/RSK | Spec stability; official lifecycle/support evidence; deployment constraints | Principal Product Author; boss decides Tech | `PG3` | `Draft` |
| `IE-INC-READY-001` | Establish a bounded, testable and recoverable implementation increment | Approved Feature, Spec and Tech; DOC-07; VVP/RSK/CMP/CHG | Named implementation scope; test, migration, rollback and review readiness | Principal Product Author | `PG4` | `Draft` |

### 3.1 Candidate implementation sequence after PG4

The sequence builds one end-to-end thread before broadening the product. It does not remove any
approved Feature or Spec obligation; it limits what must be complete for the 31 December Core v0
internal-use milestone. Each implementation phase receives its own Spec Kit plan and task set before code starts.

1. **Implementation readiness** — Pin the approved baseline, select the first bounded increment,
   prepare the canonical dataset and record the `PG4` result.
2. **Running foundation** — Start Web, Desktop Workspace, Server, PostgreSQL and one Artifact Gateway;
   establish native account/session eligibility, migration, health and attributable Audit seams.
3. **Controlled-document core** — Store Existing/New, Logical Document identity, Revision, Version,
   immutable Generation, metadata, numbering and authorized find/browse.
4. **Safe Workspace and Vault boundary** — Checkout, Reference, Check-in, stale handling,
   idempotent retry and resumable direct byte transfer to one configured Vault, without hard-coding
   document identity or business logic to one storage machine.
5. **Engineering Review and Release** — Structure Snapshot, Review, Approval/Reject, Release Record,
   exact Controlled Release Package and retrieval of the historical baseline.
6. **Internal-use hardening** — End-to-end regression, authorization/security checks, representative
   transfer measurements, backup/restore, packaging, operating guidance and installation on 2–5 Windows machines.

Deep processing for all target CAD/Office formats, a graphical workflow designer, company-login
integration, hundreds-of-terabytes scale proof and multi-site active/active operation are not exit
conditions for the 31 December Core v0 milestone. They remain in the product scope or controlled
future increments; the roadmap does not convert them into rejected requirements.

### 3.2 Core v0 schedule and task appendix

**Schedule baseline: `IE-PLAN-DEC2026-003@0.1`, Current, selected 21 September 2026.**
The target is a bounded, installable **Core v0 on 31 December 2026**, not company-wide rollout,
commercial release or complete reference-product parity.

The package has one planning authority:

- **This DOC-07** owns the phase and milestone sequence, capacity, dependencies, gate rules and scope boundary.
- **[Appendix A — 35 work packages](planning/DOC-07-appendix-A-task-breakdown-december-2026.md)**
  owns the planning IDs, hours, dependencies, outputs and completion checks. It is subordinate to
  DOC-07 and does not create product requirements.
- **[HTML Gantt](planning/idea-roadmap-december-2026.html)** is the visual rendition of the same
  baseline. It must agree with DOC-07 and Appendix A; it is not an independent schedule.
- The predecessor 56-task/756-hour schedule remains recoverable at Git commit
  `aabf02ffdef4ca901a84d39af5a467d39fd2c0d2`. It is not an active execution plan.

Task IDs in Appendix A are roadmap work-package identities, not tracker issues and not evidence that
work has started. Before each implementation phase starts, its bounded increment must receive
the applicable Spec Kit specification, plan, checklist and executable tasks. The existing
`003-controlled-documentation` feature is not repurposed as product implementation.

#### Capacity and estimation basis

| Item | Planned hours / condition |
|---|---|
| Planning window | 23 September–31 December 2026 |
| Working calendar | **79 working days × 8 hours = 632 hours**; Monday–Friday plus Saturdays in weeks 1, 3 and 5; Saturdays in weeks 2 and 4 are days off |
| Planned phase work | **512 hours** across **35 work packages** |
| Technical reserve | **88 hours** for recorded in-scope uncertainty, defects and retest |
| Operational buffer | **32 hours** for review, environment transition and controlled interruption |
| Total baseline allocation | **632 hours** |
| Estimation confidence | Roadmap allocation; actual delivery rate remains unmeasured until `MS1` and must be used for reforecast |

The project user remains the only assumed coder. Assistant work does not add a second full-time
engineer. The collaborating colleague may support business explanation and pilot observation when
assigned; coding or specialist review capacity is not assumed. Task hours include focused coding,
tests, documentation and review preparation. Waiting for Product Decision Authority, IT, licenses,
environments or qualified reviewers is elapsed-time risk and cannot be hidden in effort reserve.

The selected calendar reflects the project user's actual availability: Monday–Friday plus the first,
third and fifth Saturday of each month; the second and fourth Saturdays are days off. The 88-hour
technical reserve and 32-hour operational buffer may absorb recorded variance but do not expand
scope or change the 512-hour planned work without a separate planning decision.

#### Phase allocation and reserve summary

The plan distinguishes a **phase** from a **milestone**. A phase consumes elapsed time and effort;
a milestone is a zero-duration review or decision point at the end of that phase. The earlier draft
incorrectly used one label for both concepts.

| Phase | Planned work | Technical reserve | Operational buffer | Capacity | Main demonstrable outcome |
|---|---:|---:|---:|---:|---|
| PH0 — Implementation readiness | 32 | 0 | 8 | 40 | Bounded increment package and recorded `PG4` result |
| PH1 — Running foundation | 72 | 8 | 8 | 88 | Web/Desktop/Server/PostgreSQL/Gateway path with native login and Audit seam |
| PH2 — Controlled-document core | 96 | 16 | 0 | 112 | Store/Create, identity, Revision/Version/Generation and authorized retrieval |
| PH3 — Workspace and Checkout/Check-in | 136 | 32 | 8 | 176 | Safe Checkout/Reference/Check-in and direct resumable transfer to one configured Vault |
| PH4 — Review and Release | 88 | 16 | 0 | 104 | Exact Review/Approval/Release and reproducible released package |
| PH5 — Hardening and internal use | 88 | 16 | 8 | 112 | Regression, security, restore, packaging and bounded multi-machine use |
| **Total** | **512** | **88** | **32** | **632** | One bounded Core v0; not company-wide rollout |

Reserve is not unnamed feature capacity. It is used only for a recorded estimate variance, defect,
retest or approved dependency impact. Unused reserve stays unused. A phase may start only after its
predecessor milestone passes; spare hours do not waive a gate.

#### Phase sequence

| Phase | Work-package range | Planned start | Planned finish | Baseline capacity | Starts after |
|---|---|---|---|---:|---|
| PH0 — Implementation readiness | P01–P07 | 23 September | 29 September | 40 h | Roadmap direction selected |
| PH1 — Running foundation | F01–F05 | 30 September | 13 October | 88 h | `MS0` passes |
| PH2 — Controlled-document core | C01–C05 | 14 October | 30 October | 112 h | `MS1` passes |
| PH3 — Workspace and Checkout/Check-in | W01–W07 | 31 October | 26 November | 176 h | `MS2` passes |
| PH4 — Review and Release | L01–L05 | 27 November | 14 December | 104 h | `MS3` passes |
| PH5 — Hardening and internal use | Q01–Q06 | 15 December | 31 December | 112 h | `MS4` passes |

#### Milestone and decision register

| ID / target date | Type | Decision or required evidence | Consequence when not passed |
|---|---|---|---|
| `D0` / 23 September | Baseline record | Record the approved Feature, Spec and Tech source set; record one Vault in Core v0 and the future multi-vault seam. | `MS0` cannot claim a single implementation baseline. |
| `MS0` / 29 September | `PG4` implementation-readiness gate | Exact approved baseline and delta are identified; first increment scope, tests, migration/recovery, environment and open authorities are recorded. | PH1 does not start; result remains `BLOCKED` or `NOT-RUN`. |
| `MS1` / 13 October | Foundation demonstration and reforecast | Authorized user reaches Web and Desktop paths; Server, PostgreSQL and one Gateway report health; migration and attributable Audit seams run in the permitted environment. | PH2 waits; remaining plan is re-estimated from observed delivery rate. |
| `MS2` / 30 October | Controlled-document vertical-slice review | A user stores or creates a document, obtains stable identity and an immutable Generation, then finds and opens the authorized exact version; unauthorized retrieval is rejected. | PH3 waits until identity/history and authorization defects are resolved. |
| `MS3` / 26 November | Workspace/Vault-boundary review and reforecast | Two test identities demonstrate Checkout, Reference and Check-in, including `NoChange`, stale, interruption and same-operation retry; file bytes bypass the business Server; one Vault is configured without hard-coding a storage machine. | PH4 waits; remaining dates are reforecast. |
| `MS4` / 14 December | Release Spine demonstration | One exact Generation and structure scope moves through Review and Approval/Reject to Release; an incomplete or changed scope is rejected; the historical release package is reproduced after later work continues. | PH5 may harden completed slices but cannot claim an end-to-end Core v0 candidate. |
| `MS5` / 31 December | Core v0 internal-use review | The canonical scenario passes bounded regression, authorization, transfer and restore checks on the recorded 2–5 Windows machines; known limitations and defects are recorded. | Report the actual partial result; do not claim company-wide rollout or commercial readiness. |

Every milestone requires a working demonstration, relevant automated tests, requirement/design
trace, migration/rollback treatment, updated operating notes and no unresolved defect that can lose
an Artifact, publish the wrong Generation, bypass authority or release the wrong scope.

#### Execution and reforecast rhythm

- Plan the current week on the first working day; keep at most one primary implementation task in
  progress for the single coder.
- Record actual hours, remaining estimate, blocker and evidence link when a work package closes.
- Demonstrate an executable slice and reforecast at the milestone closing each phase.
- Mandatory whole-roadmap reforecasts occur after `MS0` (`PG4` and external prerequisites) and after `MS3`
  (measured Workspace/Vault effort). A variance above 20% in any phase also triggers reforecast.
- Red status means a gate, authority, environment or critical correctness condition is blocked;
  moving dates or using reserve cannot turn it green without resolving the cause.
- The boss continues to decide exactly **Feature, Spec and Tech**. Internal planning approval and
  milestone review do not add a fourth product-decision axis.

## 4. MVP Release Spine

| Step | Required proof | Planned baseline / identity | Negative path and recovery | Evidence / result |
|---|---|---|---|---|
| New or Store Existing Product Definition | Stable Logical Document registration; Store Existing delivered first | Future approved Spec baseline | Duplicate candidates are shown; no silent identity merge | `NOT-RUN` |
| Obtain Checkout or Reference workspace scope | User confirms exact per-document access mode | Future Workspace Manifest and expected Generation | Conflict rejects the confirmed scope; excluded scope requires reconfirmation | `NOT-RUN` |
| Edit through external application boundary | Ordinary files open through OS association; no code inside design tools | Future Managed Workspace baseline | Offline/local changes remain visible and recoverable | `NOT-RUN` |
| Publish exact Generation and Structure Snapshot | Atomic Check-in Change Set; immutable Generation; exact structure pins | Future Check-in operation and Generation identities | Stale, wrong-owner, wrong-workspace or unresolved changes fail closed and preserve local work | `NOT-RUN` |
| Complete successful Check-in | Changed or semantic `NoChange` result is explicit | Confirmed Check-in scope | Successful Check-in ends Reservations in scope; failed Check-in retains valid entitlement and local files | `NOT-RUN` |
| Create Business Revision evidence | New Revision follows approved policy and retains predecessor trace | Future Revision and lightweight change record | Invalid or unauthorized revision creation fails closed | `NOT-RUN` |
| Independent review and Approval | Approval pins one exact Generation and policy version | Future Workflow Instance and Approval Decision | Missing eligible actor blocks; self-review is not independent approval | `NOT-RUN` |
| Release Record and Controlled Release Package | Exact scope passes gates and produces immutable evidence | Future Release Record | Stale, unauthorized or incomplete scope rejects the complete release | `NOT-RUN` |
| Reproduce and restore exact released baseline | Package, manifest, digests and structure recreate the pinned baseline | Future release/restore evidence | Failed restore remains visible and cannot become PASS | `NOT-RUN` |

## 5. Gate prerequisites and exit evidence

| Gate | Required inputs | Exit evidence | Conditional action / owner / trigger | Outcome |
|---|---|---|---|---|
| `PG1` | DOC-01/02/03, coverage inventory/dispositions, DOC-07, `FEATURE-001` | Feature decision pinned to exact source baseline; open scope actions recorded | Review `FEATURE-001@0.12`, then present that exact version and record Product Decision Authority identity/decision; Principal Product Author; at Feature presentation | `NOT-RUN` |
| `PG2` | Approved Feature baseline; DOC-04/06/08 requirements; VVP and RSK trace; `SPEC-001` | Spec decision, acceptance/verification trace and owned requirement gaps | Establish measurable pilot targets where evidence permits; Principal Product Author/Product Decision Authority; before Spec presentation | `NOT-RUN` |
| `PG3` | Approved Spec baseline; DOC-02/05/06/08 design; architecture review; `TECH-001` | Tech decision, selected Stack Profile, ADRs and residual-risk disposition | Confirm IT deployment/security/storage constraints, proposed native-account implementation and eligible review; Principal Product Author/Product Decision Authority; before Tech presentation | `NOT-RUN` |
| `PG4` | Approved three-axis baseline; bounded increment; test, migration, rollback, security and change readiness | Implementation-ready package with no hidden blocker and exact source pins | Assign any required independent/specialist review or keep gate `BLOCKED`; Principal Product Author; before production coding | `NOT-RUN` |
| `PG5`–`PG7` | Implemented, verified and operational baselines | Verification, release, restore and pilot evidence | Outside current analysis/design authorization | `NOT-RUN` |

## 6. Acceptance, migration and rollback

| Concern | Required evidence | Baseline pin | Owner | Status |
|---|---|---|---|---|
| Decision acceptance | Separate boss disposition for Feature, Spec and Tech | Exact decision brief plus source manifest | Product Decision Authority | Predecessor baseline `APPROVED`; Vault successor exact disposition `NOT-RUN` |
| Requirement acceptance | Scenario, acceptance criterion and verification method for every approved or proposed obligation | `IE-PROD-SREQ-001@0.14` and `IE-VVP-CORE-001@0.17` | Principal Product Author | Successor Draft authored; review/approval and procedures `NOT-RUN` |
| Migration / reconciliation | Store Existing duplicate handling, staging cleanup, digest validation and reconciliation | `IE-PROD-DATA-001@0.10` / future approved Spec baseline | Principal Product Author | Draft authored; execution `NOT-RUN` |
| Rollback / recovery | Stale conflict, preserved local work, Reservation Recovery, failed publish and restore procedures | DOC-04/05/06 and VVP Draft baselines | Principal Product Author | Draft authored; procedures not executed |
| Operational handoff | Deploy/update/rollback, account administration, monitored coordinated backup/restore and primary/backup operator assignment | TECH-001@0.15, DOC-05@0.21, DOC-06@0.17, future OPS baseline | User may operate initially; system management/technical support approve install/deploy; long-term owner and backup unassigned | `BLOCKED` for rollout |

## 7. MVP Success Metric Set

| Metric ID | Required outcome | Exact scope / baseline | Evidence method | Result |
|---|---|---|---|---|
| `MSM-001` | Exact released baseline reproduces with matching identities, structure and digests | Canonical Demo Dataset and exact Release Record | Automated manifest/digest comparison plus controlled walkthrough | `NOT-RUN` |
| `MSM-002` | Zero stale, unauthorized, wrong-workspace or wrong-scope publishes/releases are accepted in the approved negative-path set | Approved Spec and VVP scenario set | Repeatable negative-path tests | `NOT-RUN` |
| `MSM-003` | Rejected local work remains recoverable after every tested conflict and interruption | Approved workspace/recovery scenarios | File/digest evidence before and after rejection/recovery | `NOT-RUN` |
| `MSM-004` | Every accepted publish, approval and release has complete actor, policy, source-pin and Audit Evidence | Approved audit completeness rules | Evidence-ledger reconciliation | `NOT-RUN` |
| `MSM-005` | Tested metadata and Artifact baseline restores consistently | Approved backup/restore scenario | Controlled restore drill and digest verification | `NOT-RUN` |
| `MSM-006` | Native-account administration is separate from document authority, and affected old sessions cannot authorize subsequent protected operations | Approved REQ-IAM-* and exact session/security configuration | VVP-015 account/history/revocation matrix and VVP-011 transfer/bridge tests | `NOT-RUN` |

TECH-CTX-008 establishes preliminary RTO ≤ four working hours and RPO ≤ one hour for severe server
failure; these are design/evaluation goals, not measured service commitments. Define incident clock,
working calendar/coverage, operator, representative corpus, coordinated database/file/key recovery
set and service acceptance, then run VVP-013/014. Total intended users and rough document-set size
are known as context only; concurrent load, latency, availability, growth and capacity remain open.

## 8. Deferred scope and change control

| Deferred item | Disposition | Rationale / risk | Review trigger | Trace |
|---|---|---|---|---|
| Advanced search and saved-query administration | `DEFER` | Not required to prove the first Release Spine; basic find/browse remains required | After identity and safe publish vertical slices | Coverage record and future requirement |
| Workflow designer implementation | `DEFER` | Configurable workflow semantics belong in Spec; full designer is not needed before core release proof | After seeded release workflow is verified | Future DOC-04/05/08 and coverage record |
| ERP/MRP exchange and supported external API | `DEFER` | No approved integration consumer or contract exists | Concrete internal integration requirement | Future DOC-06/change record |
| Company-account login and external providers | `DEFER` | Native IDEA accounts first; company protocol, linking/recovery and IT approval unknown | Approved integration need and identity/security contract | REQ-IAM-006; DOC-05/06; TECH-CTX-003 |
| Multi-location Vault custody and immutable-byte replication | `ARCHITECTURE SEAM IN SCOPE; RUNTIME BEHAVIOR DEFERRED` | Core v0 uses one configured Vault. Vault identity/location and the Artifact Custody/Gateway boundary must not hard-code one storage machine, but replication, failover and Vault selection are not implemented in this increment. | Reopen when a later increment approves topology, counts, lag, failure-domain and operating requirements | DOC-04/05/06; VVP-017; `IE-CHG-VAULT-XFER-001`; `IE-CHG-ROADMAP-CV0-001` |
| Multi-site active/active application operation and offline command replay | `DEFER` | Cross-site command consistency, disconnected authority and application failover requirements are not established | Separately approved need and consistency/topology contract | Future DOC-04/05/06 |
| Automated purge and broad operations tooling | `DEFER` | Retention and recovery policy are incomplete | Approved retention/operations requirements | Future RSK/OPS/REL |
| Full ECR/ECO capability | `DEFER` | Core v0 uses a lightweight change record and exact release evidence | Approved PLM change-management increment | Future DOC-01/03/04/07 |
| Additional deep CAD profiles | `DEFER` | First profile proves the adapter seam; breadth follows evidence | Successful IRONCAD profile and prioritized tool request | DOC-02 capability assessment |

Every evidenced reference capability omitted from Core v0 must still receive a controlled coverage
disposition. Deferral does not erase the long-term target.

### 8.1 Immediate documentation and qualification preparation

| Work | Owner / needed input | Exit before next commitment |
|---|---|---|
| Pin the Core v0 Vault boundary | Project user; assistant prepares | Record one configured Vault in Core v0, the future multi-vault seam and the explicitly deferred runtime behavior. Q-15 remains `PARTIAL / NO WINNER`; record no inferred runtime `PASS`. |
| Resolve remaining specification gaps | Principal Product Author; user and Product Decision Authority | SPEC-OPEN-02…08 resolved or explicitly dispositioned at the relevant decision; context confirmation is only partial closure of 05/06 |
| Gather IT and format constraints | User with system management/technical support | OS/browser/CAD and license inventory, approved host/install/update/security boundary |
| Prepare workload and recovery evaluation | User/assigned Operations authority | Representative file/corpus/concurrency profile, backup location/custody, incident clock and primary/backup operator |
| Propose permitted technical evaluations | Principal Product Author; required company authorization | Exact scope and test procedures for TECH-Q-01…10; no production code or installation authorized by this roadmap |

## 9. Internal-company value and claim boundary

| Value/claim area | Required treatment | Status |
|---|---|---|
| Internal engineering outcome | Measure control, integrity, release-risk, quality, maintainability or evidenced efficiency | Reference-backed hypothesis; internal validation `BLOCKED` |
| Technical evidence | Pin dataset, environment, identities, scope, result and limitation | `NOT-RUN` |
| Representative adoption | Requires named pilot group, project, users and Internal Adoption Authority | `BLOCKED` |
| Commercial objective | Pricing, revenue, acquisition, market share, market fit and external buyers | `DEFERRED`; no current target or delivery task. Apply the safeguards in `IE-GOV-COMMERCIAL-001` when related work is touched. |
| Future commercial authorization | External pilot, offer, installation, external-data processing or sale | Separate Commercial Readiness Gate; several years away; all gate evidence `NOT-RUN` and required Legal/Security authorities `BLOCKED` until assigned |

## 10. Pilot and rollout claim boundary

| Claim status | Required evidence and authority | Current result |
|---|---|---|
| Canonical Demo Dataset | Approved synthetic data and exact technical evidence | `NOT-RUN` |
| Core v0 internal-use verification | Bounded execution with exact identities, environment and 2–5 recorded Windows machines | `NOT-RUN` |
| Single-Actor Functional Acceptance | One person may operate separate test identities; evidence remains limited | `NOT-RUN` |
| Internal Operational Need Validation | Representative internal roles and attributable need evidence | `BLOCKED`: group/project not assigned |
| Internal Pilot Acceptance | Representative evidence and named Internal Adoption Authority | `BLOCKED` |
| Operational rollout authorization | Exact released scope, accepted residual risk and recovery readiness | `BLOCKED`; outside current stage |

## 11. Typed trace, supporting records and rendition controls

| Link type | Target and purpose | Result |
|---|---|---|
| `SOURCE-DECISION` | Accepted constitution, product ADRs and stakeholder decisions establishing internal scope, Release Spine and three boss decision axes | Linked at repository baseline; exact decision ledger to be instantiated before `Proposed` |
| `SOURCE-EVIDENCE` | Product knowledge, reference-coverage records and prototype evidence | Knowledge sources and `IE-GOV-COVERAGE-001@0.3` exist; exact target-runtime evidence remains `BLOCKED` |
| `DOWNSTREAM` | DOC-01…DOC-08, three decision briefs and later increments | Eight Core Drafts, three brief Drafts and initial GOV/VVP records instantiated |
| `CHANGE` | [IE-CHG-ROADMAP-CV0-001](registers/CHG-2026-09-21-core-v0-roadmap-rebaseline.md), [IE-CHG-COMMERCIAL-DIR-001](registers/CHG-2026-09-17-internal-first-commercial-direction.md), retained predecessor change records and [Work Item](https://github.com/devphuclam/IDEAEngineering/issues/1) | Draft 0.16 selects the Core v0 execution plan and one-Vault delivery scope while preserving the future multi-vault seam; execution, `PG4` and Commercial Readiness Gate evidence remain `NOT-RUN`. |
| `VERIFICATION` | VVP/VEV gate and Release Spine evidence | `NOT-RUN` |
| `RELEASE` | REL manifest for a future implementation/release | `NOT APPLICABLE` to this draft |
| `RENDITION` | [Appendix A](planning/DOC-07-appendix-A-task-breakdown-december-2026.md), [Gantt](planning/idea-roadmap-december-2026.html) and [Kanban CARIO register](planning/idea-technical-pilot-kanban-cario.md); source pins in the change records | All are current renditions of `IE-PLAN-DEC2026-003@0.1`. The Kanban register contains 53 delivery cards and 7 zero-effort decision/milestone cards and follows the company board states; implementation evidence remains evidence-driven. No DOC-07 Word/PDF is rewritten. |

<!-- AUTHOR CONTENT END -->

## Contract references

- [DOC-07 class template](../../definition/DOC-07-mvp-roadmap-and-delivery-plan.md)
- [Core document catalogue](../../definition/README.md)
- [Gate package contract](../../../../specs/003-controlled-documentation/contracts/gate-package.md)
- [Control fields and status](../../../../specs/003-controlled-documentation/contracts/control-fields-and-status.md)
- [Project domain language](../../../../CONTEXT.md)
