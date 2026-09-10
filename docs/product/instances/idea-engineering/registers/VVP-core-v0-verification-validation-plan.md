# IDEA Engineering Core v0 Verification and Validation Plan

> **Supporting-record state**: controlled `Draft 0.11`. This plan defines how the proposed Core v0
> requirements will be checked. Every result remains `NOT-RUN`; this document is not test evidence.

## Common control envelope

| Field | Recorded value |
|---|---|
| Stable Record ID | `IE-VVP-CORE-001` |
| Record Class | `VVP` |
| Title | IDEA Engineering Core v0 Verification and Validation Plan |
| Owner | Principal Product Author; named Verification Authority `BLOCKED` before PG2/PG5 as applicable |
| Record Status | `Draft` |
| Record Version | `0.11` |
| Applicable Baseline / Effective Date | `IE-SPEC-CORE-V0-001@0.10` / `NOT APPLICABLE` until approval |
| Authors / Reviewers / Approvers | Principal Product Author (assistant prepares) / project user (internal document review); required independent/specialist reviewers and Verification Authority not assigned |
| Source Links | [DOC-04](../DOC-04-software-requirements-specification.md), [DOC-06](../DOC-06-data-integration-and-migration-specification.md), [DOC-08](../DOC-08-ui-ux-and-interaction-specification.md), [DOC-07](../DOC-07-mvp-roadmap-and-delivery-plan.md) |
| Downstream Links | Future VEV result records, PG2–PG6 gate packages and REL manifest |
| Evidence / Claim Status | Plan Draft; all procedures and claims `NOT-RUN` |
| Change History | 0.11: reconcile the current Spec and Core-document pins; no verification objective, procedure or result changed; [IE-CHG-SOURCE-RECON-001](CHG-2026-09-09-cross-document-reconciliation.md). 0.10 added departmental-handoff and Operational Reference Data procedures DH-01…04 under VVP-007. 0.9 added BOM query/export/import and independent-parts-list procedures. 0.8 added item/folder/Rename/Create Copy procedures. 0.7 added authorization/policy-import procedures. 0.6 added workflow procedures. 0.5 added CAD Representation procedures. 0.4 added staged-release procedures. 0.3 clarified Version semantics. 0.2 added account and recovery cases. |
| Access Classification | `INTERNAL`; only synthetic test data may be committed to the repository |
| Retention Rule | Retain with exact requirements/build/evidence baseline; organizational period `UNKNOWN`, owner Product Decision Authority/Quality authority |
| Content State | `COMPLETE CONTROLLED DRAFT` with explicit environment, population and reviewer gaps |

<!-- AUTHOR CONTENT START -->

## 1. Verification objectives and methods

`IE-DATA-CANONICAL-001` is the planned synthetic Canonical Demo Dataset identity. Its content,
manifest and version will be created only after Spec approval. A later Representative Pilot Project
is a different data/evidence class and shall not be committed to Git automatically.

| Objective / requirement or claim | Method / procedure | Exact configuration and environment | Expected evidence | Owner | Status |
|---|---|---|---|---|---|
| `VVP-001` — `REQ-ID-*` | State/model and persisted identity tests covering registration, folder/placement, Move/link/unlink, Rename, Create Copy, first/changed/No Change Check-in and Create Revision; IF-01…06 below. | Future approved build + `IE-DATA-CANONICAL-001`; logical folder/divider fixtures; storage/runtime pins `UNKNOWN`. | Identity/state ledger, relationships and manifests proving Move/Rename retain `DocumentId`, Create Copy allocates a new identity with provenance, historical links remain exact, Version increments/reset correctly and no duplicate Version Sequence field exists. | Verification Authority `BLOCKED` | `NOT-RUN` |
| `VVP-002` — `REQ-WS-001`…`REQ-WS-006` | Task/contract tests for scope preview, Checkout, Reference, materialization, scan states and reconfirmation. | Two actors, two Workspaces, root plus related Office/CAD fixtures. | Workspace Manifests, digests, screenshots/interaction logs and command results. | Verification + HCD roles `BLOCKED` | `NOT-RUN` |
| `VVP-003` — `REQ-WS-007`…`REQ-WS-012`, `QRS-001`, `QRS-002` | Fault injection at upload, validation, object materialization and transaction steps; OperationId replay. | Exact future adapters/stores with controllable faults. | Zero partial public Change Sets/Generations and one idempotent terminal result per OperationId. | Verification Authority `BLOCKED` | `NOT-RUN` |
| `VVP-004` — `REQ-WS-010/011/013`, `QRS-003` | Concurrency matrix: stale head, wrong owner, wrong Workspace, lease/recovery, Reference modification and dependency advanced. | Two actors, two Workspaces, exact binary fixtures and expected/current Generation pins. | Zero invalid publish; before/after local digests; response-contract checklist and Audit. | Verification Authority `BLOCKED` | `NOT-RUN` |
| `VVP-005` — `REQ-STR-*` | Graph fixtures for exact pins, occurrences, child advance, unresolved/missing relation, cycle and reproduction; section 1.2 SR-01…03/06 distinguishes excluded siblings from required dependencies; section 1.7 BM-01…06 covers BOM view/export/import and independent parts lists. | Canonical multi-level Product Structure; planned pump/cabinet fixture, two BOM profiles and candidate files below. | Snapshot/BOM manifests and digests, occurrence/profile/source pins, difference previews and unchanged authoritative baselines after rejected/faulted operations. | Structure reviewer `BLOCKED` | `NOT-RUN` |
| `VVP-006` — `REQ-LC-*`, `QRS-004` | Workflow/approval/release state-machine tests, document-class workflow selection, definition/policy-version change, actor separation, missing/invalid configuration and release fault injection; SR-01…06 in section 1.2 and WF-01…06 in section 1.4. | At least two Document Classes, two Workflow Definitions/versions, author/editor and independent-approver identities, exact policy versions and planned release-scope fixture. | Definition/assignment pins, decision records, state history, release manifests and zero invalid Release; no retroactive reinterpretation, partial success or unconfirmed cascade. | Lifecycle/Quality reviewer `BLOCKED` | `NOT-RUN` |
| `VVP-007` — `REQ-GOV-*`, `REQ-AUD-*`, `QRS-005/010` | Policy replacement including workflow assignment/activation, form/JSON candidate import, numbering concurrency/idempotency, cross-path/cross-Organization authorization and evidence reconciliation; WF-01/02/04/05, AC-01…05 and departmental-handoff boundary DH-01…04. | Two Organizations; Web/Desktop/transfer/preview/export/worker paths; versioned workflow, Access Policy and metadata configuration; representative departmental files/reference values. | Authorization/configuration decision matrix, candidate/import/activation records, allocation ledger, exact value/definition/Generation pins, Audit completeness/tamper results and proof that reference data creates no unapproved operational result. | Security/Quality reviewers `BLOCKED` | `NOT-RUN` |
| `VVP-008` — `REQ-FMT-*`, `QRS-008` | Generic conformance per enabled format plus exact IRONCAD profile tests, CAD Representation CR-01…05 in section 1.3 and malformed/oversized/timeout fixtures. | Exact extension, application, Adapter/converter/tool versions, license and execution mode `BLOCKED`; isolated worker limits `UNKNOWN`. | Capability report; automatic/manual provenance; source/derivative digests; `Current`/`Needs update` transitions; required/optional Release response; bounded failure results. | Format/Security reviewers `BLOCKED` | `NOT-RUN` |
| `VVP-009` — `REQ-UX-*` | Canonical 1440×900 task walkthrough, page/panel scroll observation, keyboard/focus/modal/drawer/icon/error-state checks, including BOM source/profile labels and a large import-difference preview. | Exact future Web/Desktop builds and browser/toolkit versions `UNKNOWN`. | Task log, captures, focus/semantic inspection and deviations; evidence that users distinguish authoritative structure, exports and import candidates. | HCD/accessibility reviewers `BLOCKED` | `NOT-RUN` |
| `VVP-010` — `REQ-LOC-*`, `QRS-007` | Same task/resource/fallback/Unicode suite over all nine locale/surface cells. | Versioned resource catalogue plus `en`/`vi`/`ja`; Japanese IME/font environment `UNKNOWN`. | Resource-key diff, persisted preference, round-trip fixtures, clipping/parity and linguistic review. | Locale reviewers `BLOCKED` | `NOT-RUN` |
| `VVP-011` — `REQ-SEC-*`, `REQ-IAM-004/005` | Secret scan/direct-store denial; transfer expiry/replay/revocation; native-session isolation; WebView2 origin/frame/message/path boundary; worker sandbox. | Exact candidate stack/build plus two Windows user sessions, malicious/unapproved content, old cookie/token and transfer grants. | Denied unauthorized operations, no native credential exposure to JavaScript, local candidates preserved, source digests unchanged. | Security reviewer `BLOCKED` | `NOT-RUN` |
| `VVP-012` — `REQ-OPS-001/002` | Crash/restart, staging expiry, outbox replay and projection-rebuild scenarios. | Future approved stores/adapters and fault controls. | Reconciliation ledger; no private candidate exposed; committed authority unchanged. | Operations reviewer `BLOCKED` | `NOT-RUN` |
| `VVP-013` — `REQ-OPS-003/004/005`, `QRS-006`; account recovery-state implications | Lose the server, restore database/Artifacts/configuration/keys to an isolated replacement, reconcile every retained Generation and exercise login/open/Check-in/reproduction. Invalidate restored sessions and reconcile post-recovery-point access changes before reopening. | Approved coordinated recovery set, representative corpus/topology, incident clock/business calendar and available operator/key custody. | Zero missing/mismatched in-scope identities/Artifacts; healthy-service acceptance; raw wall/working time and recovered-point gap versus preliminary four-working-hour/one-hour goals. | Operations/Quality authority `BLOCKED` | `NOT-RUN` |
| `VVP-014` — `REQ-OPS-005` | Measure versioned concurrent workload, transfer/processing failures, latency percentiles, throughput/resources, availability and restore metrics. | 50–100 total intended users is context, not concurrent load. Actual file sizes/corpus/growth, topology/thresholds and support hours need approval; RTO/RPO goals from TECH-CTX-008 remain unqualified. | Raw metrics and environment manifest; threshold comparison with honest fail/blocked disposition. | Initial operator may be the user; long-term Operations authority `UNKNOWN` | `NOT-RUN`; prerequisites `BLOCKED` |
| `VVP-015` — `REQ-IAM-001…007`, `QRS-009` | Native sign-in/out without company provider; admin-only issue/reset/suspend; one-use proof; old-session and concurrent command revocation; account/product privilege separation; Actor rename/history and first/last-admin safeguards. | At least account-only admin, ordinary engineer and independently eligible approver; approved security policy, Web/native/rendered sessions and two Organizations for negative isolation tests. | Attributable account/security events, denied signup/replay/escalation, stable history, preserved local digests and no revived revoked sessions. No independent-human review inferred from test personas. | Security/Verification roles `BLOCKED` | `NOT-RUN` |

### 1.1 Recovery and account acceptance detail

VVP-013 must establish a **usable coordinated** recovery point, not just PostgreSQL WAL replay.
Inject delayed/missing Artifact backup and absent/corrupt key/configuration cases; a database-only
success cannot PASS. Compare incident time to the latest complete recovery point (preliminary gap
≤ one hour), and service acceptance to the approved working-hour clock (preliminary ≤ four hours).
Record elapsed wall time as well. Scope/calendar/start clock, operator availability and representative
corpus must be agreed before execution. A target missed remains FAIL/undemonstrated, not a reduced
scope disguised as success.

VVP-015 must exercise affected old cookies/access tokens after password recovery, suspension and
revocation, including transfer/resume, group removal, Check-in and Release races. Recheck authority
before commit and at defined streaming checkpoints; do not demand impossible recall of downloaded
bytes. Include disabled-account restore/reenable, first-admin setup reuse, last-recovery-admin removal
and authorized-account-admin attempting product actions. No test should claim protection from all
privileged reset/OS-admin impersonation; those risks also need organizational controls and review.

VVP-009/010 adds UX-JRN-009/010 to applicable locale/surface cells. VVP-011 covers WebView2 update,
unapproved navigation/frame messages, token handling and protected per-user bridge behavior. No new
case was executed during documentation authoring.

### 1.2 Staged release acceptance detail

Procedure set `IE-VVP-STAGED-RELEASE-001@0.1` expands existing objectives VVP-005/006 and the
staged-release requirement subset `REQ-STR-001…003`, `REQ-LC-006…009`. It is explained for readers in
[SPEC-001 section 8.1](../decision-briefs/SPEC-001-product-specification.md#81-phát-hành-cụm-bơm-trước-tủ-điện-tiếp-tục-thiết-kế).
All six cases below are `NOT-RUN`. This is a fixture definition, not a created Canonical Demo
Dataset, a runtime result or a reference-product parity claim.

#### Planned fixture and preconditions

Machine M-100 has pump assembly P-100 and electrical cabinet E-100 as siblings. The machine's
existing Structure Snapshot pins both children exactly. The pump's separate Structure Snapshot
pins its required drawing and BOM. In the base case, it has no required outgoing dependency on
the cabinet or parent; sharing a parent does not create such a dependency.

| Fixture alias | Revision / Version | Exact Generation alias | Initial lifecycle / approval | Intended pump Release membership |
|---|---|---|---|---|
| P-100 — pump assembly/model | A / 3 | GP-003 | Under Review / Approved | Candidate; pins pump snapshot SP-003 |
| D-100 — pump drawing | A / 4 | GD-004 | Under Review / Approved | Required candidate in SP-003 |
| B-100 — pump BOM document | A / 2 | GB-002 | Under Review / Approved | Required candidate in SP-003 |
| E-100 — electrical cabinet | A / 2 | GE-002 | In Work | Excluded sibling, not a pump prerequisite |
| M-100 — whole-machine document | A / 2 | GM-002 | In Work | Outside the confirmed scope; pins machine snapshot SM-002 |

The aliases describe synthetic test identities, not product numbering rules. Before execution,
the dataset manifest must bind them to actual Document/Revision/Generation and snapshot IDs,
Artifact digests, relation kinds, required-dependency flags, workflow/policy versions and rights.
Capture before-state manifests, lifecycle states and release records for all five documents.
Use an author/editor persona and an eligible independent approver/releaser persona; all candidate
approvals refer to the exact selected Generations. Ordinary blocking variants contain no valid
Release Exception; exception qualification remains governed by REQ-STR-003 and existing policy tests.

Each variant starts from its recorded fixture state. Adding or changing a dependency creates a
new candidate Generation/snapshot through the normal change and review process; it never edits
SP-003 or a previously approved baseline in place. The fixture must explicitly record the
interface document in cross-cabinet variants. Geometric compatibility remains an engineering
review input; these procedures test declared relationships and eligibility, not automatic CAD validation.

| Case | Procedure | Required observations and evidence | Trace / result |
|---|---|---|---|
| `SR-01` — release the completed pump | Preview and confirm exactly P-100, D-100 and B-100 with SP-003; complete Release using the eligible actor. | Exactly these three candidate Revisions become Released, without Version/Generation increments. Create one immutable Release Record pinning GP-003, GD-004, GB-002, SP-003 and their Artifacts. E-100 and M-100 remain In Work with identical Generations and snapshots. No implicit parent/sibling transition or membership. Retain scope preview, confirmation, before/after state and record manifest. | `REQ-LC-006/007`; `REQ-STR-001/002`; `NOT-RUN` |
| `SR-02` — required dependency blocks | Prepare a pump variant requiring an interface document for the cabinet connection. Separately test missing target, unresolved exact pin and an In Work prerequisite outside the eligible scope. Also attempt to exclude D-100 or the required interface from the confirmed set. | Show the exact blocking relation/target and reason; reject the whole operation with no successful Release Record or partial transitions. Removing a required entry from a view does not remove the prerequisite. Preserve existing records and file content. | `REQ-STR-003`; `REQ-LC-006/007`; `NOT-RUN` |
| `SR-03` — satisfy the dependency explicitly | From the SR-02 variant, test an exact already-Released prerequisite, then an independently approved candidate explicitly added to a newly previewed and confirmed scope. Keep other conditions eligible. | Both paths can succeed. The first retains the exact already-Released pin without releasing it again or modifying its old record; the second includes the additional candidate in the confirmed membership before commit. No silent widening to its other siblings or parents. | `REQ-STR-001/003`; `REQ-LC-006/007`; `NOT-RUN` |
| `SR-04` — eligibility changes after preview | Pause between valid preview/confirmation and commit. In separate runs, revoke the release permission or invalidate the exact approval of a required candidate through an authorized policy action. | Commit-time validation rejects the complete scope. Retain the actual condition change, failure reason and before/after state proving that no candidate was partially released. An unchanged preview is not proof of current eligibility. | `REQ-LC-006/007`; `NOT-RUN` |
| `SR-05` — failure during release | Inject a failure after the first attempted lifecycle write, then during Release Record persistence, each before the transaction commits. Inspect authoritative data after rollback/restart. Also distinguish a lost response after a successful commit. | Pre-commit failures leave original lifecycle states and retained records intact, with no successful partial Release Record. A committed operation has the complete record and all intended transitions even if its response was lost; do not infer rollback from transport failure. Evidence may record a failed attempt, but never mislabel it as a successful release. | `REQ-LC-007`; `NOT-RUN` |
| `SR-06` — reproduce the earlier pump release | After SR-01, save the package manifest/digests. Change and Check-in E-100 normally. Create the next Revision of released D-100, change and Check-in it. Retrieve/export the original pump Release Record again. | Both cabinet work and the drawing's new Revision can progress. The old pump record still resolves GP-003, GD-004, GB-002 and SP-003 with identical metadata, file digests, relations and approval provenance. P-100 and M-100 snapshots do not silently adopt the newer drawing/cabinet. Compare package membership and content, not incidental ZIP timestamps. | `REQ-LC-008/009`; `REQ-STR-001/002`; `NOT-RUN` |

Record each result separately with this procedure version, exact approved build/configuration,
dataset variant, actor roles, input/confirmed scope, expected/observed states, fault point where
applicable, Release Record/package digests and Audit references. A screenshot of the tree alone
cannot prove transaction completeness or historical reproducibility. User confirmation of the
scenario is internal design clarification; it is not an executed test result.

### 1.3 CAD Representation acceptance detail

Procedure set `IE-VVP-CAD-REP-001@0.1` expands existing objective VVP-008 and the unchanged
requirements `REQ-FMT-001…005`. It is explained for readers in
[SPEC-001 section 8.2](../decision-briefs/SPEC-001-product-specification.md#82-tạo-pdf-từ-cad-và-giữ-đúng-bản-nguồn).
All five cases are `NOT-RUN`. They define the required IDEA behavior; the cited DDM research
supports only the bounded reference behavior and is not target-runtime evidence.

The fixture shall include an exact IRONCAD application/file version, one source Generation and
Artifact digest, a versioned Format Capability Profile, declared Adapter/converter versions, a
permitted execution host/license, and Release Policies in which PDF is respectively required and
optional. A manual-upload actor and an additional test Adapter shall be available for the applicable
cases. If any prerequisite is absent, record `BLOCKED`; do not substitute an unrelated converter.

| Case | Procedure | Required observations and evidence | Trace / result |
|---|---|---|---|
| `CR-01` — qualified automatic PDF | Check in an exact IRONCAD drawing Generation and execute the declared application-assisted or standalone conversion path. | One accepted PDF Representation pins the requested source Generation and source digest, records application/Adapter/tool versions and output digest, is `Current`, and does not replace or mutate the CAD Artifact. Retain job identity, environment/license manifest and Audit. | `REQ-FMT-002…005`; `NOT-RUN` |
| `CR-02` — attributable manual PDF | Export outside IDEA, upload the PDF, select the exact source Generation and confirm the operation with an authorized actor. Include wrong-source, wrong-format and unauthorized variants. | The valid upload uses the same Representation identity/provenance contract as automatic output and records actor/time/source. Invalid variants are refused without changing the source or creating a `Current` Representation. | `REQ-FMT-001/002/005`; `REQ-AUD-001`; `NOT-RUN` |
| `CR-03` — source advances | After CR-01 or CR-02, create a later CAD Generation without overwriting history and query both source contexts. | The earlier PDF remains resolvable only with its original Generation and changes to `Needs update` for the newer context. It is never silently relinked, copied forward or presented as current. | `REQ-FMT-005`; `NOT-RUN` |
| `CR-04` — conversion failure and Release policy | Inject timeout, process termination, malformed output, digest/source mismatch and unavailable licensed application. Attempt Release under required-PDF and optional-PDF policy versions. | Each failure preserves source bytes and authoritative state and retains a typed retryable/non-retryable result. Required policy refuses Release with the exact reason; optional policy warns but does not relabel old output as current. Record policy version and commit-time recheck. | `REQ-FMT-004/005`; `REQ-LC-006/007`; `NOT-RUN` |
| `CR-05` — replaceable format path | Run a second test Adapter/profile through the same request/result interface without changing Controlled Product Data or Lifecycle modules. | Core identity, Generation, Check-in, Representation and Release semantics remain unchanged. Capability is visible only for the exact qualified profile/version; undeclared formats remain unsupported. | `REQ-FMT-002/003/005`; `NOT-RUN` |

The procedures do not assume that DDM owns a renderer or that installed engineering-seat licenses
permit headless/server automation. Those facts remain unknown until the exact IDEA environment and
vendor terms are qualified. Manual export/upload is a valid Core v0 path, not evidence that automatic
conversion passed.

### 1.4 Workflow configuration acceptance detail

Procedure set `IE-VVP-WORKFLOW-001@0.1` expands existing objectives VVP-006/007 and the unchanged
requirements `REQ-LC-001…005`, `REQ-GOV-002/005` and `REQ-OPS-002`. It is explained for readers in
[SPEC-001 section 8.3](../decision-briefs/SPEC-001-product-specification.md#83-cấu-hình-workflow-mà-không-làm-sai-lịch-sử).
All six cases are `NOT-RUN`; they define planned checks, not observed product behavior.

Use two Document Classes, two valid Workflow Definitions, at least two versions of one definition,
one invalid definition, author/editor and eligible independent-approver personas, and a controllable
notification failure. Each run records definition, assignment and policy identities/versions,
actors, exact Generation/scope, before/after state, result and Audit references.

| Case | Procedure | Required observations and evidence | Trace / result |
|---|---|---|---|
| `WF-01` — select by Document Class | Assign a different active default Workflow Definition Version to each class and start one instance for each. | Each instance pins the correct default. Changing the assignment uses governed configuration and requires no owner-module code change. | `REQ-LC-001`; `REQ-GOV-002/005`; `NOT-RUN` |
| `WF-02` — activate a new version | Start an instance under version 1, activate version 2, then start another instance and reopen the first/history. | The running/retained version-1 instance is unchanged; the later instance uses version 2. No floating resolution or silent migration occurs. | `REQ-LC-001`; `REQ-GOV-005`; `NOT-RUN` |
| `WF-03` — allowed and refused transitions | Exercise the seeded path plus Reject/Withdraw, then attempt an undeclared transition and act on a changed Generation. | Valid transitions follow the pinned definition; invalid/stale transitions are refused. Reject/Withdraw returns to In Work only under policy, and decisions never move to changed content. | `REQ-LC-002/004/006/007`; `NOT-RUN` |
| `WF-04` — separation and configurable decision rule | Attempt self-approval/release, then use an eligible independent actor. Repeat with another valid decision-count/rule version. | Seeded self-action is refused; configured eligible decisions work. The rule is data/policy, not hard-coded, and old instances retain their original rule. | `REQ-LC-003`; `REQ-GOV-002`; `NOT-RUN` |
| `WF-05` — invalid definition or missing actor | Attempt activation with a missing target state/transition/rule; separately start or advance a valid definition whose mandatory role has no eligible member. | Invalid configuration cannot activate, or the affected action is blocked with the exact missing rule/role. No automatic assignment, skipped step or weakened policy occurs. | `REQ-LC-005`; `REQ-GOV-005`; `NOT-RUN` |
| `WF-06` — required evidence and notification failure | Require a reason/evidence on a decision and fail notification delivery before/after the authoritative outcome as applicable. | Missing required input refuses the decision. A committed outcome stays authoritative despite notification failure; replay derives only from committed events and does not duplicate the decision. | `REQ-LC-004`; `REQ-OPS-002`; `NOT-RUN` |

A future graphical designer must produce the same validated definitions and cannot bypass activation,
versioning, authorization or Audit. Its absence does not block these Core v0 data/API checks.

### 1.5 Authorization and policy import acceptance detail

Procedure set `IE-VVP-AUTH-CONFIG-001@0.1` expands existing objectives VVP-007/011/015 and the
unchanged requirements `REQ-GOV-001/002/005`, `REQ-AUD-001`, `REQ-SEC-001` and `REQ-IAM-005`.
It is explained for readers in
[SPEC-001 section 8.4](../decision-briefs/SPEC-001-product-specification.md#84-thay-đổi-quyền-mà-không-sửa-code).
All five cases are `NOT-RUN`; they define planned checks, not a working authorization system.

Use an account-only administrator, an authorized policy administrator, an engineer and an eligible
approver. Prepare one active Access Policy Version, one valid successor candidate, malformed and
unresolved candidates, a stale-base candidate and a candidate that attempts to grant its own actor
the adoption permission. Exercise Web, Desktop and direct API paths; inspect packaged configuration
for database credentials. If JSON import is not implemented in Core v0, execute AC-01 and the common
authorization cases, record AC-02/05 JSON variants as `NOT APPLICABLE` only after the approved scope
explicitly excludes that interface, and do not claim JSON support.

| Case | Procedure | Required observations and evidence | Trace / result |
|---|---|---|---|
| `AC-01` — change policy and membership through administration | Create a successor policy through the governed form/API, change one group rule by resource class/scope, add/remove one Actor Membership, preview the diff, activate as applicable, then repeat the affected action. | No code or per-document edit is needed. Authority changes only at the recorded policy/Membership effective point. Record base/new IDs, actor, group, scope, diff and Audit. | `REQ-GOV-002/005`; `NOT-RUN` |
| `AC-02` — import is only a candidate | Upload a valid JSON candidate representing the same change, pause before activation and attempt the newly proposed action. | Upload/validation produces a candidate and preview only; the proposed action is still refused. Separate authorized activation creates one immutable version. | `REQ-GOV-002/005`; `NOT-RUN` |
| `AC-03` — client/direct-store bypass | Modify a local JSON/client claim to add Approve/Release; call protected endpoints directly; inspect Web/Desktop/Workspace packages and attempt direct database access. | Every product action is decided by the owning Server module under the active policy. No client/store credential or client-only change grants authority; denials do not leak cross-scope data. | `REQ-GOV-001/002`; `REQ-SEC-001`; `NOT-RUN` |
| `AC-04` — exact policy history | Execute the same action before and after authorized activation; reopen retained decisions, workflow instances and Releases created under the predecessor. | New eligible operations use the successor. Retained evidence resolves the exact predecessor and is not reinterpreted. | `REQ-GOV-002/005`; `REQ-AUD-001`; `NOT-RUN` |
| `AC-05` — invalid, stale or self-authorizing candidate | Separately submit malformed schema, unresolved role/group/scope, stale base pin, unauthorized activation, a payload that attempts to grant its proposer adoption permission, and a direct Actor grant missing scope/reason/expiry. | Every variant fails atomically; active policy and historical decisions remain byte/semantically unchanged. Error and permitted Audit identify the reason without secrets. | `REQ-GOV-002/005`; `REQ-IAM-005`; `NOT-RUN` |

Identity account/role/claim data may contribute Actor or eligibility context, but it cannot replace
the active product Access Policy in these checks. A database or serialized payload is storage or
transport, not proof that an authorization decision is correct.

### 1.6 Item name, folder and copy identity acceptance detail

Procedure set `IE-VVP-ITEM-IDENTITY-001@0.1` expands VVP-001/007/009 for `REQ-ID-007…009` and
`QRS-010`. It is explained for management readers in
[SPEC-001 section 8.5](../decision-briefs/SPEC-001-product-specification.md#85-giữ-đúng-tài-liệu-khi-đổi-tên-chuyển-folder-hoặc-tạo-bản-sao).
All cases are `NOT-RUN`; public reference-product behavior informs the design direction but does not
substitute for an IDEA test result.

Prepare at least two Document Folders with dividers, one In Work document, one Released document,
one later Generation, a navigation alias, controlled name/title metadata and actors with/without
the required source/destination permissions. Record `DocumentId`, `PlacementId`, Revision, Version,
Generation, Artifact digest, source/copy relationship and Audit before and after every operation.

| Case | Procedure | Required observations and evidence | Trace / result |
|---|---|---|---|
| `IF-01` — move placement | Move one document between folders and dividers. | Same `DocumentId`, Revision, Version, Generation and Artifact digest; only Placement hierarchy and attributable Audit change. No user-visible folder value is used as an Artifact path. | `REQ-ID-001/007`; `NOT-RUN` |
| `IF-02` — add and remove link | Add an explicit link to another folder, then remove it. Include an unauthorized destination. | No duplicate document/Artifact/Generation; other placements and target document remain. Unauthorized operation changes nothing and discloses no restricted target data. | `REQ-ID-007`; `REQ-GOV-001/002`; `NOT-RUN` |
| `IF-03` — historical link | Link an exact Revision/Generation, advance the Working Head, then reopen the link. | The link retains and resolves the original pin; it never floats to the later Generation. | `REQ-ID-007`; `REQ-LC-008`; `NOT-RUN` |
| `IF-04` — navigation alias Rename | Rename a placement-only alias. | Same document and Generation; changed alias and Audit only. Search/projection may lag visibly but authoritative resolution by ID remains correct. | `REQ-ID-008`; `REQ-AUD-001`; `NOT-RUN` |
| `IF-05` — controlled Rename | Change controlled document name/title through valid Checkout/Check-in; include stale and unauthorized variants. | Valid change keeps `DocumentId` and creates one Version/Generation; old history remains. Invalid variants publish nothing and preserve local work. | `REQ-ID-008`; `REQ-WS-006…010`; `NOT-RUN` |
| `IF-06` — Create Copy/Save-As | Create from In Work and Released sources; inject failure before commit and retry the same operation. | One new `DocumentId` and exact source provenance per successful logical operation; no inherited Reservation/Approval/Released state; no partial copy on failure and source remains unchanged. | `REQ-ID-009`; `REQ-AUD-001`; `QRS-010`; `NOT-RUN` |

### 1.7 Product Structure, BOM and file-boundary acceptance detail

Procedure set `IE-VVP-BOM-BOUNDARY-001@0.1` expands VVP-005/006/009 for
`REQ-STR-004…006` and the clarified `REQ-LC-008`. It is explained for management readers in
[SPEC-001 section 8.6](../decision-briefs/SPEC-001-product-specification.md#86-bom-là-dữ-liệu-cấu-trúc-không-phải-chỉ-là-file-excelpdf).
All cases are `NOT-RUN`; the public reference-product evidence establishes only visible Product
Structure/BOM/edit/export behavior, not its internal snapshot or transaction rules.

Prepare one multi-level pump Structure Snapshot with reused components and stable occurrences,
quantities and positions; two versioned BOM View Profiles; Excel/PDF export formats; valid,
malformed, unresolved, unauthorized and stale-base import candidates; and one independent
controlled parts-list Logical Document. Record source/profile/candidate/output identities, exact
Generations, payload/output digests, actor, policy, before/after structure and Audit.

| Case | Procedure | Required observations and evidence | Trace / result |
|---|---|---|---|
| `BM-01` — governed BOM view | Resolve two named BOM profiles over one exact snapshot; then advance a child Working Head and query the retained snapshot again. | Each view identifies snapshot/profile and retains stable occurrence, exact component Generation, quantity/position and configured fields. The retained query does not adopt the newer child. | `REQ-STR-004`; `NOT-RUN` |
| `BM-02` — pinned Excel/PDF export | Export Excel and PDF for one exact snapshot/profile and repeat the same logical export request. | Each BOM Representation records source snapshot/profile, format, producer, output digest and actor/result. It is non-authoritative and retry creates no ambiguous duplicate result. | `REQ-STR-005`; `REQ-AUD-001`; `NOT-RUN` |
| `BM-03` — older export after source/profile advance | Create a newer Structure Snapshot and separately activate a later profile version; reopen the previous outputs. | Previous bytes and pins remain reproducible and are identified as `Needs update` relative to the newer source/profile; no old output is silently called current. | `REQ-STR-005`; `NOT-RUN` |
| `BM-04` — preview and accept valid import | Upload a valid Excel/CSV candidate against an exact base, inspect mapping and add/change/remove rows, then confirm. | Candidate changes no structure before confirmation. Success creates exactly the previewed new Structure Snapshot and owning Generation atomically and links the terminal candidate/result. | `REQ-STR-006`; `NOT-RUN` |
| `BM-05` — reject unsafe import | Separately exercise malformed schema, unresolved component, unauthorized actor, stale base and failure during commit; retry one terminal OperationId. | Every variant leaves the authoritative base byte/semantically unchanged, exposes no partial snapshot/Generation and returns one attributable bounded result without duplicate acceptance. | `REQ-STR-006`; `REQ-AUD-001`; `NOT-RUN` |
| `BM-06` — independent controlled parts list and Release | Relate one exact parts-list document Generation to its Structure Snapshot; advance either side; then preview/Release and reproduce the prior package. | UI/data distinguish the independent document from a generated BOM Representation. Mismatch is visible; valid Release pins exact snapshot, profile and required representation/document Generation; prior package never follows latest. | `REQ-STR-005`; `REQ-LC-006…008`; `NOT-RUN` |

### 1.8 Departmental handoff and Operational Reference Data acceptance detail

Procedure set `IE-VVP-DEPARTMENTAL-HANDOFF-001@0.1` expands VVP-007 for `REQ-GOV-003/005`,
`REQ-AUD-001` and the existing document/structure/Release requirements used by the handoff. It is
explained for management readers in
[SPEC-001 section 8.7](../decision-briefs/SPEC-001-product-specification.md#87-đầu-ra-phòng-ban-không-tự-trở-thành-tính-năng-của-pdm).
All four cases are `NOT-RUN`; they define the authority boundary, not an implemented enterprise
integration.

Prepare representative CAD/PDF/software/instruction/checklist files from named synthetic
departments; one Product Structure and Release scope; versioned metadata fields for hours, estimated
cost, purchasing/fabrication status, progress and completion; one prior Release; and no approved
ERP/MRP/procurement/manufacturing/project-management write contract. Record actor, source/department,
metadata definition, Generation, state, Audit and any external-side effect before and after each case.

| Case | Procedure | Required observations and evidence | Trace / result |
|---|---|---|---|
| `DH-01` — governed departmental handoff | Register, relate, review and Release an eligible set of departmental CAD/PDF/software/instruction/checklist outputs through the existing document and Product Structure flows. | Every output retains its exact document/structure identity, Generation and evidence; the old Release is reproducible. No new transaction type or authority appears solely from department/output labels. | `REQ-ID-001…004`; `REQ-STR-001/002`; `REQ-LC-006…008`; `NOT-RUN` |
| `DH-02` — reference values stay contextual | Store the prepared hours, estimated cost, purchasing/fabrication status, progress and completion values as configured metadata and in a controlled status document; query them through permitted paths. | Values remain attributable and pinned to their definition/Generation. No total/cost decision, purchase/fabrication transaction, product/project completion or Workflow/Release transition is created. | `REQ-GOV-003`; `REQ-AUD-001`; `NOT-RUN` |
| `DH-03` — version and historical interpretation | Change a controlled reference value/document, activate a compatible successor metadata definition and reopen the prior Release. | Normal changed-content rules create the applicable new Version/Generation; old data and Release retain the exact predecessor definition/value and are not reinterpreted by the new schema. | `REQ-ID-002/004`; `REQ-GOV-003/005`; `REQ-LC-008`; `NOT-RUN` |
| `DH-04` — refuse invented operational authority | Attempt an unapproved external write, infer “machine complete” from a Released document and use a reference value to advance lifecycle without a separately approved Feature/contract. | Core v0 exposes no successful authoritative transaction or inferred completion/transition. The attempt is unavailable or refused without changing document, structure, lifecycle or external state; permitted Audit records the bounded result. | `REQ-GOV-003/005`; `REQ-LC-006/007`; `REQ-AUD-001`; `NOT-RUN` |

## 2. Validation Pack strata

The controlled-document framework Validation Pack remains separate from the future product test
suite. The minimum strata below ensure evidence classes and product obligations are not represented by
one convenient happy-path sample.

| Stratum | Minimum | Selection rule | Result metadata owner |
|---|---:|---|---|
| Class structure | 17 | All eight Core and nine supporting classes | Principal Product Author |
| Placement | 20 | Every class plus shared/non-ownership cases | Principal Product Author |
| Requirements | 8 | At least one functional, interface, data, quality, security/privacy, operational, accessibility and localization obligation | Verification Authority `BLOCKED` |
| Reference coverage | 6 | Evidenced, ambiguous, unknown, stronger-benchmark, no-stronger-pattern and restricted-evidence cases | Principal Product Author |
| Gate outcomes | 4 | `PASS`, `PASS-WITH-ACTIONS`, `FAIL`, `BLOCKED` | Applicable gate authority |
| Surface profiles and locale cells | 3 profiles + 9 cells | Desktop, Web and Web-rendered Desktop in `en`, `vi`, `ja` | HCD/localization owners `BLOCKED` |
| Renditions | 4 | Current, Stale, Superseded and Withdrawn | Configuration Authority `UNKNOWN` |
| Pilot/claim statuses | 6 | Canonical dataset through rollout authorization | Product Decision/Adoption authorities |

Each selected product case records requirement IDs, procedure version, exact build/configuration,
environment, dataset, expected and observed result, date/time, operator, reviewer, deviations,
evidence location/digest and final disposition.

## 3. Human review and independence

| Review item | Required rule | Evidence / result |
|---|---|---|
| Internal document review | Project user reviews the assistant-authored plan for completeness, clarity and product fit; author consistency checks remain separate. | Prior exact-version reviews are retained. The user confirmed the staged-release, CAD Representation, workflow-configuration, Identity/Access Policy/JSON, item/folder/Rename/Create Copy, BOM/file-boundary and departmental-output-scope directions on 07-09-2026; full review of SPEC-001@0.14 and this plan@0.11 is not inferred. |
| Independent requirements review | Reviewer does not author or own the material requirement decision. | `BLOCKED`: person/competence not assigned. |
| Specialist review | Security, data/format, HCD/accessibility, locale and operations reviewers cover applicable risk. | `BLOCKED`: assignments absent. |
| Product decision | Product Decision Authority decides Feature, then Spec, then Tech on exact source manifests. | Feature/Spec/Tech decisions `NOT-RUN`. |
| Representative validation | At least one intended document consumer plus appropriate roles/project context. | `BLOCKED`: pilot population/project absent. |
| Single-person execution | One person may operate separate Test Personas for bounded functional evidence. | Allowed only as `Single-Actor Functional Acceptance`; never independent or representative acceptance. |

## 4. Gate mapping and change

| Gate | Inputs / evidence | Outcome rule | Re-plan trigger |
|---|---|---|---|
| `PG1` | DOC-01/02/03/07, coverage and FEATURE-001 exact versions | Product Decision Authority records one outcome. | Feature change invalidates dependent Spec Draft. |
| `PG2` | Approved Feature; DOC-03/04/06/08; this VVP; risks/trace | Missing source, acceptance method or required reviewer is `BLOCKED/NOT-RUN`, never PASS. | Requirement, locale, data or acceptance change. |
| `PG3` | Approved Spec; DOC-05/06/08, ADRs and technology evidence | Architecture/design and specialist gaps remain explicit. | Tech/architecture/interface or threat change. |
| `PG4` | Approved Feature/Spec/Tech; bounded increment, test design, migration and rollback | No action may invalidate upstream baselines. | Increment/dependency/recovery scope change. |
| `PG5` | Exact build/config/environment/dataset plus executed VEV | Only observed result can be PASS/FAIL/BLOCKED/NOT-RUN. | Build/config/procedure/environment change. |
| `PG6` | Immutable REL manifest, VEV, known issues, residual risk and restore evidence | Missing approval/recovery keeps release blocked. | Release-manifest or residual-risk change. |

Material requirement or design change updates the affected VVP procedure and marks earlier dependent
evidence stale; it does not rewrite the old result.

## 5. Product acceptance and claim boundary

| Claim | Minimum evidence | Current status |
|---|---|---|
| Canonical Demo Dataset verification | `VVP-001`…`VVP-013` plus `VVP-015` applicable procedures on one exact synthetic dataset/build baseline | `NOT-RUN`; dataset/build absent |
| Technical Pilot Verification | Approved non-production environment and exact executed evidence | `NOT-RUN` |
| Single-Actor Functional Acceptance | Separate Test Personas and declared limitation | `NOT-RUN` |
| Internal Operational Need Validation | Representative internal roles/workflow and attributable evidence | `BLOCKED` |
| Internal Pilot Acceptance | Technical evidence, representative users and Internal Adoption Authority | `BLOCKED` |
| Operational rollout authorization | Exact release, residual-risk, support and recovery readiness | `BLOCKED` |

No successful prototype walkthrough, unit test or backup job may be relabeled as a higher claim.

## 6. Evidence sufficiency

Evidence is sufficient only when it records the requirement/claim, procedure version, source and
build baseline, configuration, environment, dataset, expected/observed result, time, operator,
reviewer and independence/competence, deviations, residual risk, retained evidence link and digest
where applicable. A screenshot alone may support a visual fact but not concurrency, authorization,
transaction, recovery or production-readiness claims.

<!-- AUTHOR CONTENT END -->

## Contract references

- [VVP class template](../../../definition/registers/VVP-verification-validation-plan.md)
- [Validation contract](../../../../../specs/003-controlled-documentation/contracts/validation.md)
- [Gate package](../../../../../specs/003-controlled-documentation/contracts/gate-package.md)
