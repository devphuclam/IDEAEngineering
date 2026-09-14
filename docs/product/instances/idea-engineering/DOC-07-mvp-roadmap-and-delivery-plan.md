# IDEA Engineering Analysis, Design and Core v0 Delivery Roadmap

> **Instance state**: controlled `Draft 0.8`. This roadmap plans work and decision presentations. It
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
| Document Version | `0.8` |
| Applicable Baseline | `IDEA-C1-ANALYSIS-DESIGN-001` |
| Effective Date | `NOT APPLICABLE` until approval |
| Authors | `Principal Product Author`; named identity to be recorded before `Proposed` |
| Reviewers | Project user performs internal document review; independent/specialist review remains separately unassigned |
| Approvers | `Product Decision Authority` decides Feature, Spec and Tech; named identity and decision dates are not yet recorded |
| Source Links | [Product templates](../../definition/README.md), [domain language](../../../../CONTEXT.md), [architecture baseline](../../../architecture/idea-product-lifecycle-architecture.md), [design lessons](../../knowledge/idea-design-lessons.md) |
| Downstream Links | [Task appendix A](planning/DOC-07-appendix-A-task-breakdown-december-2026.md), [Gantt view](planning/idea-roadmap-december-2026.html), three decision briefs, supporting records and later implementation increments |
| Evidence / Claim Status | `IDEA DECISION` for accepted planning rules; execution and gate evidence remains `NOT-RUN` |
| Change History | 0.8: route the current DOC-05@0.19, TECH-001@0.11 and technology matrix@0.3; correct the 87-requirement count and make stale Feature/Spec/Tech brief pins explicit. Schedule, 56 tasks, 756 hours and all decision/gate states remain unchanged; [IE-CHG-DOC-REVIEW-001](registers/CHG-2026-09-14-post-pull-document-review-corrections.md). 0.7: routed TECH-001@0.10 and DOC-05@0.17 at that historical baseline; [IE-CHG-TECH-LINUX-001](registers/CHG-2026-09-13-linux-first-server-runtime-re-evaluation.md). Earlier history remains in the linked change records. |
| Access Classification | `INTERNAL` |
| Retention Rule | Retain with the product-definition baseline; exact organizational retention period is `UNKNOWN`, owner `Product Decision Authority`, review trigger before `Approved` |
| Content State | `COMPLETE CONTROLLED DRAFT` with explicit unresolved actions |

## Indexed increment identity

The rows in this version are roadmap candidates. Before an increment becomes `Proposed`, it receives
an independent controlled increment record with its source baseline, owner, version, gate, trace and
exit evidence. The roadmap index is navigation only.

| Increment Record ID | Source Roadmap Baseline | Status | Version | Owner | First / later gate | Requirement and design trace | Exit evidence |
|---|---|---|---|---|---|---|---|
| `IE-INC-FEATURE-001` | `IE-PROD-ROADMAP-001@0.8` | `Draft` | `0.1` | Principal Product Author | `PG1` / `PG2` on material scope change | DOC-01/02/03, coverage records, `FEATURE-001` | Feature decision, source pins and open-action disposition |
| `IE-INC-SPEC-001` | `IE-PROD-ROADMAP-001@0.8` | `Draft` | `0.1` | Principal Product Author | `PG2` / `PG3` on requirement change | DOC-03/04/06/08, `SPEC-001` | Spec decision, trace and V&V readiness |
| `IE-INC-TECH-001` | `IE-PROD-ROADMAP-001@0.8` | `Draft` | `0.1` | Principal Product Author | `PG3` / `PG4` on technology change | DOC-02/04/05/06/08, ADRs, `TECH-001` | Tech decision, architecture review and risk disposition |
| `IE-INC-READY-001` | `IE-PROD-ROADMAP-001@0.8` | `Draft` | `0.1` | Principal Product Author | `PG4` | Approved Feature/Spec/Tech baselines and supporting records | Bounded implementation plan, tests, migration/recovery and gate result |

<!-- AUTHOR CONTENT START -->

## 1. Roadmap intent and constraints

| Field | Recorded value |
|---|---|
| Roadmap objective | Reuse the existing Feature, Spec and Tech material, complete affected design/readiness decisions, and plan the Core v0 Release Spine through conditional MVP acceptance by 31 December 2026. No production implementation starts before its applicable gates. |
| Source product baseline | `IDEA-C1-ANALYSIS-DESIGN-001`; fixed reference-product public baseline dated 2026-08-26; target-runtime semantics remain explicitly unverified. |
| Planning assumptions | Assistant acts as Principal Product Author, the project user reviews documents, and the boss decides Feature, Spec and Tech. The user initially administers native accounts and may operate the server; dedicated DevOps, independent/specialist competence and long-term support are not assumed. |
| Constraints | Internal-company product; clean-room behavioral design; eight Core Product Documents remain detailed authority; three Vietnamese decision briefs are the boss-facing views; English Markdown remains editable authority; no production implementation before applicable gates. |
| Planning horizon | 7 September–31 December 2026; conditional single-coder forecast in section 3.2. Production slices remain unauthorized until their applicable requirements, design and `PG4` readiness pass. |

## 2. Decision presentation plan

The Product Decision Authority reads three concise briefs, not the complete eight-document source
set. Each brief pins its exact source versions and presents one decision axis only.

| Presentation | Purpose | Required preparation | Demonstration / evidence | Requested boss decision | Readiness |
|---|---|---|---|---|---|
| `FEATURE-001` | Confirm Core v0 capability scope, priority and exclusions | DOC-01/02/03 drafts, closed material inventory, coverage dispositions, updated DOC-07 | Interactive prototype as draft design evidence; feature map and deferred-scope list | Approve, require changes, defer or reject the Feature baseline | `Draft 0.12`: 14 FTR; source pins are stale against current Core drafts; full review and boss decision remain `NOT-RUN` |
| `SPEC-001` | Confirm observable behavior, rules, failure handling and acceptance | Approved Feature baseline; DOC-04 plus requirement-bearing DOC-06/08 content; VVP trace | Release Spine scenarios including stale, unauthorized, wrong-workspace and recovery paths | Approve, require changes, defer or reject the Spec baseline | `Draft 0.14`: stale against DOC-04@0.13 with 87 requirements; seven points remain open; full review and Feature decision remain prerequisites |
| `TECH-001` | Confirm architecture and technology choices | Approved Spec baseline; DOC-02/04/05/06/08 design; technology ADRs and risk analysis | Architecture views, deployable hosts, data flow, candidate comparison and bounded technical spikes | Approve, require changes, defer or reject the Tech baseline | `Draft 0.11`: Linux-first Java Server recommendation remains a candidate; source pins need refresh for DOC-05@0.19 and DOC-07@0.8; review, Spec decision, IT constraints and qualification remain open |

The briefs may be rendered as DOCX or PDF for the meeting. A rendition never replaces its pinned
Markdown source. A changed source makes the earlier rendition `Stale`.

The states above distinguish the current Core drafts from decision briefs that still pin earlier
sources. This routing correction is not a fresh review or approval: prior exact-version review
evidence remains attached to the versions on which it was recorded. Spec behavior and schedule
content are unchanged; the separate `IE-KNW-TECH-DEC-001@0.3`/`TECH-001@0.11` recommendation is
not a Product Decision Authority approval.
Do not infer a new approval from a version update.

## 3. Bounded analysis and design increments

| Increment ID | Objective and scope | Required baseline | Dependencies | Owner | Gate | Status |
|---|---|---|---|---|---|---|
| `IE-INC-FEATURE-001` | Author vision, feasibility, business needs, coverage and the Feature brief | DOC-01/02/03, DOC-07, GOV coverage | Named source identities; fixed public baseline; Product Decision Authority availability | Principal Product Author | `PG1` | `Draft` |
| `IE-INC-SPEC-001` | Translate approved scope into verifiable functional, information, quality, security, operational, localization and interaction requirements | Approved Feature decision; DOC-03/04/06/08; VVP/RSK | Feature stability; explicit thresholds or owned `UNKNOWN` values | Principal Product Author | `PG2` | `Draft` |
| `IE-INC-TECH-001` | Select architecture and technology against approved requirements | Approved Spec decision; DOC-02/04/05/06/08; ADR/RSK | Spec stability; official lifecycle/support evidence; deployment constraints | Principal Product Author; boss decides Tech | `PG3` | `Draft` |
| `IE-INC-READY-001` | Establish a bounded, testable and recoverable implementation increment | Approved Feature, Spec and Tech; DOC-07; VVP/RSK/CMP/CHG | Named implementation scope; test, migration, rollback and review readiness | Principal Product Author | `PG4` | `Draft` |

### 3.1 Candidate implementation vertical slices after PG4

These slices are planning candidates only. They do not authorize code.

1. **Accounts and controlled identity** — Controlled first-admin setup, native accounts/session
   eligibility, account/product permission separation and Audit, then Logical Document, metadata,
   numbering, Artifact and immutable Generation foundations. The first document flow cannot bypass
   account/owner authorization; this is one bounded foundation slice, not a separate identity product.
2. **Safe workspace publish** — Store Existing first, then New on the same model; Checkout,
   Reference, Check-in, stale conflict, recovery and local-work preservation.
3. **Engineering release** — Structure Snapshot, review, independent Approval, Release Record,
   Controlled Release Package and exact reproduction.
4. **Format depth** — Generic controlled-file baseline plus the first deep IRONCAD capability profile,
   without executing IDEA code inside the design tool.
5. **Internal pilot and UX hardening** — Canonical demo first; representative internal evidence only
   when a pilot project and eligible participants are assigned.


### 3.2 December 2026 schedule and task appendix

**Schedule baseline: `IE-PLAN-DEC2026-001@0.1`, Draft, prepared 5 September 2026.**
The target is a bounded Core v0 MVP acceptance by **31 December 2026**, not company-wide rollout,
complete reference-product parity or standards conformity.

The package has one planning authority:

- **This DOC-07** owns the summary, schedule assumptions, dependencies, responsibility and gates.
- **[Appendix A — 56 tasks](planning/DOC-07-appendix-A-task-breakdown-december-2026.md)** is a subordinate
  part of this DOC-07, with task IDs, planned dates/hours, prerequisites, outputs, completion criteria,
  and Feature/requirement/VVP links. Its Vietnamese text is the retained task description, not an
  independent requirement specification or a ninth Core Product Document.
- **[Interactive Gantt](planning/idea-roadmap-december-2026.html)** is the unchanged captured visual
  view of the same schedule. Its source hash, sandbox and CSP preservation are recorded in the
  [change record](registers/CHG-2026-09-05-roadmap-task-integration.md). Future schedule changes must
  reconcile this view with the appendix; a prior Gantt is not a second calendar to maintain separately.

All 56 task records start as **not executed under this plan**. Existing documents and the reviewed
prototype are reused as inputs; inclusion of a preparation task does not erase that prior work.
Task IDs below are planning identifiers, not claims that implementation increments or 56 tracker
issues already exist. Spec Kit still owns the later production increment's spec, plan and execution
tasks; feature `003-controlled-documentation` is not repurposed as Core implementation.

#### Capacity and estimation basis

| Item | Planned hours / condition |
|---|---|
| Work in groups A–I | **676 hours** across **56 tasks**, each 4–16 hours |
| Contingency R01–R04 | **80 hours**, already included in the total |
| Total allocated | **756 hours** |
| Available weekday capacity | 84 weekdays × 8 hours = **672 hours**, before unconfirmed holidays, leave or other assignments |
| Proposed additional capacity | 11 Saturdays × 8 hours = **88 hours** |
| Total conditional capacity | **760 hours**; 4 hours unallocated in addition to the 80-hour contingency |
| Five-day-only scenario | 672 available hours versus 756 planned: **84 hours short** |
| Estimation confidence | Initial allocation within the prior Gantt budget, not a measured delivery rate or fixed commitment |

Proposed Saturdays in 2026: **12, 19, 26 September; 3, 10, 17, 24 October; 7, 14, 21, 28 November**.
The user must confirm the actual working calendar. Holidays, leave and unrelated work have not
been deducted. Waiting for decisions, IT access, licenses or reviewers can move the end date even
if active effort remains within budget; contingency hours do not guarantee external availability.

The project user is the only coder. Assistant support does not add a second coder's capacity.
The collaborating colleague may help with business explanation and pilot work when assigned; no
coding or independent-specialist capacity is assumed for that person. Each task's hours include
its focused implementation, test, documentation and review/demo preparation effort. UI and tests
are built with B–F; G completes shared UI/localization and H verifies integration and operations.
Do not add the same test hours a second time.

#### Work-package summary

| Group | Output | Tasks | Hours | Main dependency / proof |
|---|---|---:|---:|---|
| A | Reconciled inputs, reviewed design and implementation readiness | A01–A07 (7) | 48 | Reuse current briefs; F01–F03 informs A05; A07/gates before B01 |
| B | Native accounts, access policy, Audit and working administration UI | B01–B06 (6) | 80 | A07; account administration does not grant document approval; revoke old sessions |
| C | Store Existing/New, controlled identity/history, metadata/numbering and basic authorized find/browse | C01–C06 (6) | 80 | B; initial Check-in already enforces entitlement and exact scope; no ungoverned upload path |
| D | Windows Workspace, Checkout/Reference, atomic Check-in and conflict recovery | D01–D08 (8) | 120 | C; success and No Change end Checkout; failure preserves local work and valid entitlement |
| E | Exact structure, versioned workflow, Approval/Release, export and new Revision | E01–E07 (7) | 100 | D and relevant R02 findings resolved; exact historic release remains reproducible |
| F | Early IRONCAD qualification followed by the approved deep format profile | F01–F07 (7) | 88 | 24 hours early after A04; 64 hours implementation after E; early spike alone is not deep support |
| G | Shared UI refinement and English/Vietnamese/Japanese behavior | G01–G04 (4) | 40 | E/F and relevant R03 findings resolved; UI already built progressively |
| H | Integrated verification, security/load checks, restore, installation and operations | H01–H07 (7) | 80 | B–G; approved environment/workload, IT and competent reviews |
| I | Representative pilot, fixes, retest and acceptance package | I01–I04 (4) | 40 | H07 passes; authorized dataset, eligible participants and acceptance authority |
| R | Contingency at readiness, file-flow, CAD and final acceptance boundaries | R01–R04 (4 reserves, not extra implementation tasks) | 80 | Track actual use and affected retest; no automatic gate clearance |

The appendix maps all **14 Feature groups** and **74 currently identified requirements** to planned
work, plus the **15 VVP objectives**. This is a coverage map, not evidence of implementation or full
verification. A02 must finish the basic find/browse detail; any newly admitted requirements require
trace and estimate updates. The scope and deferrals in section 8 are unchanged.

#### Resource sequence

Dates are in 2026. A half-day is four allocated working hours, not a promised appointment.
The sequence uses one coder without double-booked effort. Actual start also depends on the gates
and inputs, not just the prior row ending.

| Sequence | Task range / reserve | Hours | Planned start | Planned finish |
|---|---|---:|---|---|
| Initial design review | A01–A04 | 28 | 7 September | 10 September, first half |
| Early IRONCAD qualification | F01–F03 | 24 | 10 September, second half | 14 September, first half |
| Design reconciliation and first-increment readiness | A05–A07 | 20 | 14 September, second half | 16 September |
| Readiness contingency | R01 | 16 | 17 September | 18 September |
| Accounts, policy and Audit | B01–B06 | 80 | 19 September | 30 September |
| Controlled documents | C01–C06 | 80 | 1 October | 12 October |
| Workspace and Check-in | D01–D08 | 120 | 13 October | 29 October |
| File-flow contingency | R02 | 16 | 30 October | 2 November |
| Structure and engineering release | E01–E07 | 100 | 3 November | 17 November, first half |
| Deep IRONCAD implementation | F04–F07 | 64 | 17 November, second half | 26 November, first half |
| CAD contingency | R03 | 16 | 26 November, second half | 28 November, first half |
| Shared UI and locales | G01–G04 | 40 | 28 November, second half | 4 December, first half |
| System and operational verification | H01–H07 | 80 | 4 December, second half | 18 December, first half |
| Representative pilot and fixes | I01–I04 | 40 | 18 December, second half | 25 December, first half |
| Final contingency and affected retest | R04 | 32 | 25 December, second half | 31 December, first half |

If a reserve is unnecessary, later work may move forward only after its prerequisites pass; retain
the unused budget rather than inventing work to consume it. If a block exceeds its allocation,
record the actual effort and impact, use a named reserve or reforecast. Never silently remove a
feature, reduce the deep format commitment or omit verification to fit the date.

#### Review milestones and responsibilities

| Target date | Demonstrable output / decision | Responsibility and condition |
|---|---|---|
| 18 September | A and the early F probe support the first implementation-ready increment | User reviews; Product Decision Authority/IT/specialists supply their required decisions. A date is not PG4 evidence. |
| 30 September | B06 account/policy/Audit demo; reforecast using actual first-slice effort | User implements/reviews; Principal Product Author prepares comparison and remaining forecast. |
| 12 October | C06 document intake/history/metadata/search demo | User reviews the approved dataset and authorized find/browse results; not the complete multi-file Workspace. |
| 29 October | D08 two-identity/two-Workspace demonstration including stale, expiry, network loss and retry | User performs bounded functional tests; one person operating two identities is not representative-user or independent review evidence. |
| 26 November | E/F release proof and evidenced deep IRONCAD profile | Exact sample/tool/version and reviewed profile required; storing/opening files alone is insufficient. |
| 18 December | H07 verification and recovery evidence sufficient to enter a controlled pilot | Required qualified review and company permissions; unresolved severe failures block transition. |
| 31 December | I04 plus any required R04 work support a bounded MVP acceptance | Eligible pilot participants and acceptance authority; no implied company-wide rollout. |

A01 reconciles the actual submitted Human/editorial copies and recorded decisions against the source
set. Do not repeat settled product decisions or infer a requirement discrepancy from a changed
filename, style or version label alone. A04 requests the environment, license/install conditions,
reviewer availability and representative pilot participants early; H/I do not first discover these needs.

Mandatory reforecast points are **F03** (tool/profile feasibility and effort) and **B06 on 30 September**
(actual delivery rate). At each completed group, track status, actual/remaining hours, affected task
dependencies and evidence. Escalate missing specialist or company authority to the user instead of
substituting self-review. The boss still decides exactly **Feature, Spec and Tech**; this roadmap does
not add a fourth product decision axis.

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
| Decision acceptance | Separate boss disposition for Feature, Spec and Tech | Exact decision brief plus source manifest | Product Decision Authority | `NOT-RUN` |
| Requirement acceptance | Scenario, acceptance criterion and verification method for every approved obligation | `IE-PROD-SREQ-001@0.10` and `IE-VVP-CORE-001@0.11` | Principal Product Author | Draft authored; review/approval `NOT-RUN` |
| Migration / reconciliation | Store Existing duplicate handling, staging cleanup, digest validation and reconciliation | `IE-PROD-DATA-001@0.10` / future approved Spec baseline | Principal Product Author | Draft authored; execution `NOT-RUN` |
| Rollback / recovery | Stale conflict, preserved local work, Reservation Recovery, failed publish and restore procedures | DOC-04/05/06 and VVP Draft baselines | Principal Product Author | Draft authored; procedures not executed |
| Operational handoff | Deploy/update/rollback, account administration, monitored coordinated backup/restore and primary/backup operator assignment | TECH-001@0.11 candidate, DOC-05@0.19, DOC-06@0.16, future OPS baseline | User may operate initially; system management/technical support approve install/deploy; long-term owner and backup unassigned | `BLOCKED` for rollout |

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
| Multisite replication and offline command replay | `DEFER` | Consistency, recovery and operational requirements are not established | Approved multisite need and topology | Future DOC-04/05/06 |
| Automated purge and broad operations tooling | `DEFER` | Retention and recovery policy are incomplete | Approved retention/operations requirements | Future RSK/OPS/REL |
| Full ECR/ECO capability | `DEFER` | Core v0 uses a lightweight change record and exact release evidence | Approved PLM change-management increment | Future DOC-01/03/04/07 |
| Additional deep CAD profiles | `DEFER` | First profile proves the adapter seam; breadth follows evidence | Successful IRONCAD profile and prioritized tool request | DOC-02 capability assessment |

Every evidenced reference capability omitted from Core v0 must still receive a controlled coverage
disposition. Deferral does not erase the long-term target.

### 8.1 Immediate documentation and qualification preparation

| Work | Owner / needed input | Exit before next commitment |
|---|---|---|
| Refresh and review current decision briefs | Project user; assistant prepares | Feature 0.12, Spec 0.14 and Tech 0.11 are stale against current Core source pins; refresh each brief before presentation and record no inherited `PASS` |
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
| Commercial objective | Pricing, revenue, acquisition, market share, market fit and external buyers | `NOT APPLICABLE` |

## 10. Pilot and rollout claim boundary

| Claim status | Required evidence and authority | Current result |
|---|---|---|
| Canonical Demo Dataset | Approved synthetic data and exact technical evidence | `NOT-RUN` |
| Technical Pilot Verification | Bounded non-production execution with exact identities and environment | `NOT-RUN` |
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
| `CHANGE` | [IE-CHG-DOC-REVIEW-001](registers/CHG-2026-09-14-post-pull-document-review-corrections.md), [IE-CHG-ROADMAP-001](registers/CHG-2026-09-05-roadmap-task-integration.md), [IE-CHG-SOURCE-RECON-001](registers/CHG-2026-09-09-cross-document-reconciliation.md), [IE-CHG-TECH-LINUX-001](registers/CHG-2026-09-13-linux-first-server-runtime-re-evaluation.md) and [Work Item](https://github.com/devphuclam/IDEAEngineering/issues/1) | Draft 0.8 corrects current Core and Tech routing and stale-brief status; schedule, approval and gate unchanged. Earlier reconciliations remain historical. |
| `VERIFICATION` | VVP/VEV gate and Release Spine evidence | `NOT-RUN` |
| `RELEASE` | REL manifest for a future implementation/release | `NOT APPLICABLE` to this draft |
| `RENDITION` | [Appendix A](planning/DOC-07-appendix-A-task-breakdown-december-2026.md) and [Gantt](planning/idea-roadmap-december-2026.html); source pins in the change records | Appendix remains applicable to Draft 0.8 because the schedule is unchanged; Gantt remains the frozen schedule 0.1 view copied unchanged. No DOC-07 Word/PDF created; existing submitted Word originals are not rewritten. |

<!-- AUTHOR CONTENT END -->

## Contract references

- [DOC-07 class template](../../definition/DOC-07-mvp-roadmap-and-delivery-plan.md)
- [Core document catalogue](../../definition/README.md)
- [Gate package contract](../../../../specs/003-controlled-documentation/contracts/gate-package.md)
- [Control fields and status](../../../../specs/003-controlled-documentation/contracts/control-fields-and-status.md)
- [Project domain language](../../../../CONTEXT.md)
