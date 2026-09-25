# IDEA Engineering Core v0 Verification and Validation Plan

> **Supporting-record state**: controlled `Draft 0.19`. This plan defines how the proposed Core v0
> requirements will be checked. Product-behavior procedures remain `NOT-RUN`. A predecessor
> source/rendition audit for `VVP-016` was recorded on 12-09-2026 in
> `IE-VEV-ARCH-CORR-003`; the current full-set review and qualified acceptance remain `NOT-RUN`.
> This plan is not itself the result evidence.

## Common control envelope

| Field | Recorded value |
|---|---|
| Stable Record ID | `IE-VVP-CORE-001` |
| Record Class | `VVP` |
| Title | IDEA Engineering Core v0 Verification and Validation Plan |
| Owner | Principal Product Author; named Verification Authority `BLOCKED` before PG2/PG5 as applicable |
| Record Status | `Draft` |
| Record Version | `0.19` |
| Applicable Baseline / Effective Date | `IE-SPEC-CORE-V0-001@0.15` / `NOT APPLICABLE` until approval |
| Authors / Reviewers / Approvers | Principal Product Author (assistant prepares) / project user (internal document review); required independent/specialist reviewers and Verification Authority not assigned |
| Source Links | [DOC-04](../DOC-04-software-requirements-specification.md), [DOC-05](../DOC-05-architecture-description.md), [DOC-06](../DOC-06-data-integration-and-migration-specification.md), [DOC-08](../DOC-08-ui-ux-and-interaction-specification.md), [DOC-07](../DOC-07-mvp-roadmap-and-delivery-plan.md), [DDM/Aras workspace comparison](../../../../research/2026-09-10-ddm-aras-checkout-reference-checkin-comparison.md), [Vault-transfer provenance](../../../../research/2026-09-17-vault-transfer-and-multi-location-provenance.md) |
| Downstream Links | [earlier architecture-view VEV](VEV-2026-09-10-architecture-view-review.md), [predecessor architecture-correction VEV](VEV-2026-09-12-architecture-consistency-correction.md), [architecture-correction VEV-002](VEV-2026-09-12-architecture-consistency-correction-002.md), [architecture-correction VEV-003](VEV-2026-09-12-architecture-consistency-correction-003.md), future product VEV result records, PG2–PG6 gate packages and REL manifest |
| Evidence / Claim Status | Plan Draft; the Approval Policy correction and three-branch Check-in scope policy are PDA-approved under `IE-CHG-PDA-APPROVAL-002/003`, but product procedures remain `NOT-RUN`; `VVP-016` remains `BLOCKED` overall |
| Latest Change (0.19) | Add WS-09…11 to verify the approved Check-in scope policy: unresolved dependency, required unreserved change, and unrelated unreserved change with scope reconfirmation. See [IE-CHG-PDA-APPROVAL-003](CHG-2026-09-25-pda-approval-checkin-scope.md). |
| Change History | 0.18: add default-deny, policy opt-in, conflicting-policy, pinned-policy and self-Release-separation checks; [IE-CHG-APPROVAL-POLICY-001](CHG-2026-09-19-approval-policy-self-approval.md). 0.17: add verification for scoped direct Workspace–Artifact Gateway transfer, authenticated Transfer Receipt, multi-location selection/failover, durability-policy replication/repair and the rule that replica is not backup; [IE-CHG-VAULT-XFER-001](CHG-2026-09-17-multi-location-vault-transfer-architecture.md). 0.16: add focused checks for CPD Generation-manifest `ArtifactReference` versus owner-specific BOM/Format ArtifactId/digest pins; owner-only refusal `OwnerCommandOutcome` recording in IAM/Product Structure/Controlled Product Data; rollback dispositions that cannot masquerade as committed state; and Product Structure owner-UoW acceptance before a BOM export is retained; require the new successor architecture-view audit; [IE-CHG-ARCH-CORR-003](CHG-2026-09-12-architecture-consistency-correction-003.md). 0.15: add focused verification for named BOM Import coordination/UoW, material account outcome/audit/outbox atomicity, explicit commit-time authorization refusal branches, Artifact byte custody versus Representation metadata acceptance and the read-only IAM eligibility query seam; require the successor corrected-baseline architecture-view audit; [IE-CHG-ARCH-CORR-002](CHG-2026-09-12-architecture-consistency-correction-002.md). Earlier history remains in controlled change records. |
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
| `VVP-002` — `REQ-WS-001`…`REQ-WS-006`, `REQ-WS-014` | Task/contract tests for scope preview, Checkout, Reference, materialization, modified-Reference choices, scan states and reconfirmation, including WS-09…11 for the approved scope policy. | Two actors and at least two Workspaces, including the same Actor opening two independent Workspaces; root plus related Office/CAD fixtures and distinct local/server digests. | Workspace Manifests, Reservation status, digests, screenshots/interaction logs and command results proving one Workspace cannot reuse another Workspace's Reservation and Reference has no direct publish authority. | Verification + HCD roles `BLOCKED` | `NOT-RUN` |
| `VVP-003` — `REQ-WS-007`…`REQ-WS-012`, `REQ-WS-015/016`, `QRS-001/002/011/013` | Fault injection at Transfer Grant issue/expiry/replay, direct chunk upload, Gateway digest verification, forged/missing Transfer Receipt, Artifact Custody candidate verification, preflight, shared relational unit-of-work commit, response and reconciliation; OperationId status/replay. | Exact future Gateway/Vault adapters with controllable faults and multi-document/multi-GB fixtures. | Zero partial public Change Sets/Generations, no prematurely ended Reservation, preserved local files, resumed verified ranges and one idempotent terminal result per OperationId. A completed byte transfer or forged receipt cannot publish. For each material outcome, owner state, Owner Command Outcome, Audit Evidence and outbox are atomic; coordinator has no generic CRUD authority. | Verification Authority `BLOCKED` | `NOT-RUN` |
| `VVP-004` — `REQ-WS-010/011/013/014`, `QRS-003` | Concurrency matrix: stale head (including a request naming an exact historical Generation ID), wrong owner, same Actor/wrong Workspace, different Actor, active/expired/recovered Reservation, modified Reference and dependency advanced. Run historical-ID attempts through ordinary and privileged identities; privileged product administration shall not silently bypass current-head publication rules. | Two actors, two Workspaces, ordinary and privileged Role Assignments, exact binary fixtures and expected/current Generation pins. | Zero invalid publish or automatic binary merge/overwrite; before/after authoritative and local digests; response-contract checklist and attributable Audit. A governed repair path, if later specified, remains distinct from Check-in. | Verification Authority `BLOCKED` | `NOT-RUN` |
| `VVP-005` — `REQ-STR-*` | Graph fixtures for exact pins, occurrences, child advance, unresolved/missing relation, cycle and reproduction; section 1.2 SR-01…03/06 distinguishes excluded siblings from required dependencies; section 1.7 BM-01…06 covers BOM view/export/import and independent parts lists. Confirmed BOM import additionally exercises the named BOM Import coordinator, shared relational UoW, per-owner outcomes and all-or-none behavior. BOM export additionally exercises candidate byte storage followed by Product Structure source/profile/business revalidation and owner-UoW metadata acceptance. | Canonical multi-level Product Structure; planned pump/cabinet fixture, two BOM profiles and candidate files below. | Snapshot/BOM manifests and digests, occurrence/profile/source pins, owner-specific BOM Representation ArtifactId/digest fields and retained status only after Product Structure commit; refusal/reconciliation evidence when byte storage succeeds but metadata acceptance fails; difference previews and unchanged authoritative baselines after rejected/faulted operations; no partial Structure Snapshot, Generation or Working Head after injected failure. | Structure reviewer `BLOCKED` | `NOT-RUN` |
| `VVP-006` — `REQ-LC-*`, `QRS-004` | Workflow/approval/release state-machine tests, document-class workflow selection, definition/policy-version change, default and opt-in self-approval, conflicting-policy evaluation, actor separation, missing/invalid configuration and release fault injection; SR-01…06 in section 1.2 and WF-01…06 in section 1.4. | At least two Document Classes, two Workflow Definitions/versions, author/editor and eligible approver identities, exact policy versions (including one opt-in and one blocking policy) and planned release-scope fixture. | Definition/assignment pins, policy evaluation and decision records, explicit self-vs-independent result, state history, release manifests and zero invalid Release; no retroactive reinterpretation, partial success or unconfirmed cascade. | Lifecycle/Quality reviewer `BLOCKED` | `NOT-RUN` |
| `VVP-007` — `REQ-GOV-*`, `REQ-AUTH-*`, `REQ-AUD-*`, `QRS-005/010` | Principal–role–scope authorization, Project access, constrained delegation, policy/definition replacement, workflow assignment/activation, form/JSON candidate import, numbering concurrency/idempotency, cross-path/cross-Organization authorization and evidence reconciliation; prove that server/IAM establishes ActorContext, Access Policy resolves current IAM/Project evidence through a read-only eligibility query port without mutation re-entry, an immutable Authorization Decision remains separate from Owner Command Outcome, and commit-time revalidation defeats TOCTOU; initial and commit-time refusal branches must be terminal; PA-01…04, RBAC-01…10, AC-01…05, WF-01/02/04/05 and DH-01…04. | Two Organizations and Projects; Actor/direct Group principals; built-in/custom roles; Organization/Project/resource Scopes; Web/Desktop/transfer/preview/export/worker paths. | Authorization/configuration decision matrix, server-established context, assignments/role versions, candidate/import/activation records, allocation ledger, exact value/definition/Generation pins, separate decision/owner-outcome and RBAC/business-gate evidence, Audit completeness/tamper results and proof that reference data creates no unapproved operational result. | Security/Quality reviewers `BLOCKED` | `NOT-RUN` |
| `VVP-008` — `REQ-FMT-*`, `QRS-008` | Generic conformance per enabled format plus exact IRONCAD profile tests, CAD Representation CR-01…05 in section 1.3 and malformed/oversized/timeout fixtures. Verify that Artifact Custody stores/verifies immutable bytes only, while Format Intelligence revalidates and accepts authoritative Representation metadata in its owner UoW with owner-specific exact ArtifactId/digest pins, Owner Command Outcome, Audit Evidence and applicable outbox; those pins are not CPD Generation-manifest `ArtifactReference` records; inject metadata failure after byte storage. | Exact extension, application, Adapter/converter/tool versions, license and execution mode `BLOCKED`; isolated worker limits `UNKNOWN`. | Capability report; automatic/manual provenance; source/derivative digests; owner-specific representation pins; `Current`/`Needs update` transitions; required/optional Release response; bounded failure results; byte-storage success alone never makes metadata current and failed acceptance leaves a private/unreferenced candidate for reconciliation. | Format/Security reviewers `BLOCKED` | `NOT-RUN` |
| `VVP-009` — `REQ-UX-*`, administration journeys | Canonical 1440×900 task walkthrough, page/panel scroll observation, keyboard/focus/modal/drawer/icon/error-state checks, including BOM source/profile labels, administration responsibility separation, Who/Role/Where assignment, effective-access explanation and a large import-difference preview. | Exact future Web/Desktop/admin builds and browser/toolkit versions `UNKNOWN`. | Task log, captures, focus/semantic inspection and deviations; evidence that users distinguish account from Project/product access, RBAC from business gates, authoritative structure, exports and import candidates. | HCD/accessibility reviewers `BLOCKED` | `NOT-RUN` |
| `VVP-010` — `REQ-LOC-*`, `QRS-007` | Same task/resource/fallback/Unicode suite over all nine locale/surface cells. | Versioned resource catalogue plus `en`/`vi`/`ja`; Japanese IME/font environment `UNKNOWN`. | Resource-key diff, persisted preference, round-trip fixtures, clipping/parity and linguistic review. | Locale reviewers `BLOCKED` | `NOT-RUN` |
| `VVP-011` — `REQ-SEC-*`, `REQ-IAM-004/005`, `REQ-AUTH-006…010`, `REQ-WS-016` | Secret scan/raw-Vault denial; role/assignment and scope bypass attempts; Transfer Grant expiry/replay/revocation/range escalation; forged Transfer Receipt; native-session isolation; `WebView → Desktop → Workspace → CAD/Office` origin/frame/message/path boundary; server/IAM ActorContext establishment; scoped Workspace–Gateway transfer; worker sandbox. | Exact candidate stack/build plus two Windows user sessions, malicious/unapproved content, old cookie/token, expired/removed assignments and transfer grants. | Denied unauthorized operations and escalation, no permanent Vault credential or raw storage path exposed to client code, no publication from forged/expired transfer evidence, local candidates preserved and source digests unchanged. | Security reviewer `BLOCKED` | `NOT-RUN` |
| `VVP-012` — `REQ-OPS-001/002` | Crash/restart, staging expiry, outbox replay and projection-rebuild scenarios. | Future approved stores/adapters and fault controls. | Reconciliation ledger; no private candidate exposed; committed authority unchanged. | Operations reviewer `BLOCKED` | `NOT-RUN` |
| `VVP-013` — `REQ-OPS-003/004/005`, `QRS-006`; account recovery-state implications | Lose the server, restore database/Artifacts/configuration/keys to an isolated replacement, reconcile every retained Generation and exercise login/open/Check-in/reproduction. Invalidate restored sessions and enter Restricted Recovery Mode. Do not automatically reconcile post-recovery-point security/access changes: independently prove each change, reconcile it through the named governed path, then obtain an explicit reopen decision. | Approved coordinated recovery set, representative corpus/topology, incident clock/business calendar and available operator/key custody. | Zero missing/mismatched in-scope identities/Artifacts; retained evidence separating recovered facts, independently proved changes, reconciliation decisions and explicit reopen; raw wall/working time and recovered-point gap versus preliminary four-working-hour/one-hour goals. | Operations/Quality authority `BLOCKED` | `NOT-RUN` |
| `VVP-014` — `REQ-OPS-005` | Measure versioned concurrent workload, transfer/processing failures, latency percentiles, throughput/resources, availability and restore metrics. | 50–100 total intended users is context, not concurrent load. Actual file sizes/corpus/growth, topology/thresholds and support hours need approval; RTO/RPO goals from TECH-CTX-008 remain unqualified. | Raw metrics and environment manifest; threshold comparison with honest fail/blocked disposition. | Initial operator may be the user; long-term Operations authority `UNKNOWN` | `NOT-RUN`; prerequisites `BLOCKED` |
| `VVP-015` — `REQ-IAM-001…007`, `REQ-AUTH-009`, `QRS-009` | Native sign-in/out without company provider; Account-Administrator-only issue/reset/suspend; one-use proof; old-session and concurrent command revocation; account/Product access separation; Actor rename/history. Exercise that every material account/security mutation commits IAM state, Owner Command Outcome, material Audit Evidence and applicable outbox atomically; failed sign-in is independently auditable without an authoritative mutation. | At least Account Administrator, Project Administrator, ordinary engineer and independently eligible approver; approved security policy, Web/native/rendered sessions and two Organizations. | Attributable account/security events, denied signup/replay/product action by account-only admin, stable history, preserved local digests and no revived revoked sessions; transaction/fault evidence proves no partial account mutation or missing outcome/audit/outbox. No independent-human review inferred from test personas. | Security/Verification roles `BLOCKED` | `NOT-RUN` |
| `VVP-016` — architecture-view quality | Inspect every maintained architecture/data view against its catalogue metadata, legend, abstraction/Scope, terminology, cross-view consistency, text alternative and actual rendering at intended screen/page size. The review includes the approved Check-in scope-policy branches while keeping policy approval separate from view acceptance. It also checks that control-plane calls remain distinct from direct scoped byte transfer; Gateway/Vault nodes never acquire product-publication authority; a Transfer Receipt is not shown as Check-in success; logical Artifact identity is separate from Artifact Locations; and replication is not labelled backup. | Exact current DOC-05@0.25 and DOC-06@0.18 Markdown baseline and pinned rendering tool/version; qualified reviewer and controlled full-set rendition still `BLOCKED`. | View-by-view checklist, parse/build result, rendered captures, defects and review disposition; syntax success alone cannot PASS. | Architecture/HCD reviewers `BLOCKED` | Current full-set architecture-view audit `NOT-RUN`; focused and predecessor VEV records do not replace it. |
| `VVP-017` — `REQ-OPS-006…008`, `QRS-012/014`; storage part of `REQ-OPS-003/004` | Provider-substitution and multi-location rehearsal through Artifact Custody: policy-based location selection, direct Gateway transfer, copy by digest, verified replication/repair, read failover, cutover, rollback, reconciliation and source retirement without changing product identities. | At least two logical Vault locations using initial/alternate test adapters, retained manifests/releases/holds, multi-GB samples and fault controls; exact technologies and required location counts `UNKNOWN`. | Identical Artifact/Generation/Release identities and digests across locations; no unreadable retained Artifact; successful safe location reselection/rollback on injected failure; provider/path absent from product identity; ordinary Workspace receives only a scoped Transfer Grant and never a permanent Vault credential. Evidence distinguishes replica health from independent backup/recovery. | Data/Operations/Quality reviewers `BLOCKED` | `NOT-RUN` |

### Architecture-view review protocol

`VVP-016` is performed against one exact DOC-05/DOC-06 source baseline and one generated rendition.
It has seven separate checks; passing only the Mermaid parser is insufficient.

1. **Inventory:** every Mermaid block has one unique catalogue View ID, title, model kind, question,
   stakeholders/concerns, Scope, exclusions, baseline/status, trace and text alternative.
2. **Notation:** the pinned renderer parses the source; the selected C4-style or UML model kind is
   used consistently and no line/color/icon carries undocumented meaning.
3. **Semantic review:** elements have one type/responsibility, arrows are directional and labelled,
   multiplicities/transitions/guards agree with the surrounding contract, and the view answers only
   its stated question.
4. **Cross-view review:** the same domain term and owner mean the same thing in context, Module,
   state, sequence and data views. In particular, Workflow is independent of Reservation; Reservation
   uses only `Active → Ended / Expired / Recovered` while `Released` belongs to Business Revision;
   Reference has no direct publish entitlement; `LocalIntegrity × ServerFreshness` may be `Unknown`;
   old Reservations never reactivate; private candidates are not Generations; Artifact Custody owns
   bytes/locations rather than Product Definition; CPD `ArtifactReference` is only a Generation-manifest
   relation/value while BOM/Format modules keep owner-specific exact ArtifactId/digest pins; Audit owns
   only Audit Evidence; each authoritative owner records its own refusal outcome; a rolled-back UoW is
   never described as committed; the coordinator has no generic CRUD or outcome authority; BOM export
   retention requires a committed Product Structure owner UoW; and only a committed Check-in Operation
   proves publication and in-scope release.
5. **Trace review:** every critical relation/transition maps to an existing requirement, Interface,
   ADR, risk or VVP case; a competitor observation is not accepted as the trace source.
6. **Accessibility and rendition:** each block has `accTitle`/`accDescr` plus a nearby structured long
   description. Inspect the actual rendered page/screen for clipping, overlap, line crossings,
   contrast, font size and reading order without depending on color.
7. **Disposition:** record defects and reviewer identity/competence. A view is `PASS` only when all
   applicable checks pass on the same source digest and rendition; otherwise record `FAIL`,
   `BLOCKED` or `NOT-RUN` honestly.

The retained evidence row for each view shall contain: View ID; source-document ID/version and file
digest; renderer/tool version; parse result; semantic result; cross-view result; trace result;
accessibility/rendition result; reviewer/date; defects; and final disposition. The
[12-09 author audit](VEV-2026-09-12-architecture-consistency-correction-003.md) belongs to a
predecessor source. The focused
[Check-in view review](VEV-2026-09-25-checkin-scope-approved-policy-view-review.md) covers one
DOC-05@0.25 view only. The full current DOC-05/DOC-06 set and independent architecture/HCD
acceptance remain `NOT-RUN`.

### 1.1 Recovery and account acceptance detail

VVP-013 must establish a **usable coordinated** recovery point, not just PostgreSQL WAL replay.
Inject delayed/missing Artifact backup and absent/corrupt key/configuration cases; a database-only
success cannot PASS. Compare incident time to the latest complete recovery point (preliminary gap
≤ one hour), and service acceptance to the approved working-hour clock (preliminary ≤ four hours).
Record elapsed wall time as well. Scope/calendar/start clock, operator availability and representative
corpus must be agreed before execution. A target missed remains FAIL/undemonstrated, not a reduced
scope disguised as success.

After a restore, the procedure enters **Restricted Recovery Mode**. It invalidates restored sessions
and preserves the recovered security/account state as evidence, but it does not pretend that every
post-recovery-point security change can be reconstructed automatically. Each such change needs
independent proof and a named governed reconciliation; only an explicit reopen decision ends the
mode.

VVP-015 must exercise affected old cookies/access tokens after password recovery, suspension and
revocation, including transfer/resume, Role Assignment removal, Check-in and Release races. Recheck authority
before commit and at defined streaming checkpoints; do not demand impossible recall of downloaded
bytes. Include disabled-account restore/reenable, first-admin setup reuse and an authorized Account
Administrator attempting Project and product actions. Last-Super-path safeguards belong to RBAC-08.
No test should claim protection from all
privileged reset/OS-admin impersonation; those risks also need organizational controls and review.

VVP-009/010 adds UX-JRN-009/010/014/015 to applicable locale/surface cells. VVP-011 covers WebView2 update,
unapproved navigation/frame messages, token handling, protected per-user bridge behavior, server-established
ActorContext and no direct Workspace-to-Store path. No new case was executed during documentation authoring.

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
| `WF-04` — policy-controlled self-approval and separation | Run the default policy, an explicitly opt-in `AllowSelfApproval` policy, and two applicable policies where one requires an independent approver. Attempt self-Approve and self-Release, then use an eligible independent actor. | Default self-action is refused; opt-in self-Approve works only after RBAC and business-gate checks; the blocking policy still requires another actor; self-Approve never grants Release. The rule is data/policy, not hard-coded, and old instances retain their original policy. | `REQ-LC-003`; `REQ-GOV-002`; `IE-CHG-APPROVAL-POLICY-001`; `NOT-RUN` |
| `WF-05` — invalid definition or missing actor | Attempt activation with a missing target state/transition/rule; separately start or advance a valid definition whose mandatory role has no eligible member. | Invalid configuration cannot activate, or the affected action is blocked with the exact missing rule/role. No automatic assignment, skipped step or weakened policy occurs. | `REQ-LC-005`; `REQ-GOV-005`; `NOT-RUN` |
| `WF-06` — required evidence and notification failure | Require a reason/evidence on a decision and fail notification delivery before/after the authoritative outcome as applicable. | Missing required input refuses the decision. A committed outcome stays authoritative despite notification failure; replay derives only from committed events and does not duplicate the decision. | `REQ-LC-004`; `REQ-OPS-002`; `NOT-RUN` |

A future graphical designer must produce the same validated definitions and cannot bypass activation,
versioning, authorization or Audit. Its absence does not block these Core v0 data/API checks.

### 1.5 Project access, RBAC and governed policy acceptance detail

Procedure set `IE-VVP-RBAC-001@0.1` expands VVP-007/009/011/015 for `REQ-AUTH-001…010`,
`REQ-IAM-002/005`, `REQ-GOV-001/002/005`, `REQ-AUD-001/002` and `REQ-SEC-001`. Every case below is
`NOT-RUN`; this is a verification design, not evidence that authorization has been implemented.

Use two Organizations, Projects `P-100` and `E-100`, Linh and an unrelated engineer, Account,
Project, Privileged Role and Super administrators, an Audit Reader, direct Project Groups and
separate author/approver/releaser identities. Prepare built-in and Custom Role Definitions,
Organization/Project/resource Scopes, current/expired assignments, one supported condition and one
unsupported condition. Record stable IDs, exact role versions, Scope, effective period, reason,
assigning Actor, expected version and before/after authorization state for each case.

#### Project access and responsibility separation

| Case | Procedure | Required observations and evidence | Trace / result |
|---|---|---|---|
| `PA-01` — account is not Project access | Account Administrator creates and activates Linh, then attempts to add Linh to `P-100`, a Group and a product role. | Account operations succeed within Scope. Project/Group/Role operations are unavailable or refused; Linh still has no product Permission. Audit separates successful account work from denied access work. | `REQ-IAM-002/005`; `REQ-AUTH-009`; `NOT-RUN` |
| `PA-02` — Project and Group membership | Project Administrator for `P-100` adds Linh as a Project Member and then directly to `Cơ khí P-100`. | Both changes are separate, attributable and limited to `P-100`. Membership alone grants no action until an applicable Role Assignment exists. | `REQ-AUTH-003/005/009`; `NOT-RUN` |
| `PA-03` — no nested or cross-Project Group | Attempt to add one Group to another, add a non-member to a Project Group and reuse the same Group name in `E-100` to gain access. | Every invalid path is refused atomically. Same-name Groups remain different Security Principals; no membership or Permission crosses Projects. | `REQ-AUTH-003/005/006`; `NOT-RUN` |
| `PA-04` — constrained Project administration | Project Administrator for `P-100` assigns an allowed `Design Engineer` role to `Cơ khí P-100`, then attempts an admin role, a disallowed role, Scope `E-100` and a system-wide Scope. | Only the delegated P-100 assignment succeeds. Other attempts leave assignments unchanged and identify the violated role/Scope limit in permitted Audit. | `REQ-AUTH-004/009/010`; `NOT-RUN` |

#### Principal–Role–Scope behavior

| Case | Procedure | Required observations and evidence | Trace / result |
|---|---|---|---|
| `RBAC-01` — canonical objects | Create/read supported Permission, Role Definition/version, Authorization Scope and Role Assignment records; inspect API/data contracts. | Each object has one stable meaning. No assignable `Permission Set`, administrator-account class or second Project-role object exists. | `REQ-AUTH-001/002`; `NOT-RUN` |
| `RBAC-02` — direct and Group assignments | Give the same product Permission first through `Cơ khí P-100`, then through a direct Linh assignment at `P-100`; remove them separately. | Either valid path can contribute an additive grant. Effective Access names the contributing assignment; direct assignment is visibly marked and audited. Removal affects only subsequent requests and does not rewrite history. | `REQ-AUTH-004…007`; `NOT-RUN` |
| `RBAC-03` — immutable role successor | Attempt to edit a built-in role, then change an active Custom Role based on its current version. Activate the successor, exercise an existing assignment, create a new assignment that selects the successor, and finally replace the existing assignment through the governed path. | Built-in edit is refused. Custom change creates an immutable successor. Activation alone leaves the existing assignment on its predecessor; the new assignment uses the successor. Explicit replacement records the preview, actor, reason and exact before/after versions, while retained decisions remain unchanged. | `REQ-AUTH-002/009/010`; `NOT-RUN` |
| `RBAC-04` — Scope hierarchy | Assign a role at Organization, `P-100` and one resource in separate runs; attempt actions at descendants, siblings and another Project. | Parent Scope applies only to covered descendants/actions and supported conditions. Siblings, other Projects, folders, departments, Document Classes and matching lifecycle labels do not become Scope by implication. | `REQ-AUTH-003/004`; `NOT-RUN` |
| `RBAC-05` — time and conditions | Exercise not-yet-effective, active and expired assignments plus supported and unsupported conditions. | Only currently valid assignments with supported true conditions contribute. Unsupported condition cannot be activated; historical decisions retain evaluated inputs. | `REQ-AUTH-004/006`; `NOT-RUN` |
| `RBAC-06` — additive grant and no general deny | Combine two positive assignments, remove one, then request an ungranted action; attempt to create a general explicit-deny rule. | Positive Permissions combine; removal leaves only remaining grants; no grant means blocked. Core v0 refuses a user-configurable general deny construct. | `REQ-AUTH-006`; `NOT-RUN` |
| `RBAC-07` — constrained delegation and self-escalation | Privileged Role Administrator and Project Administrator attempt permitted and forbidden role/principal/Scope assignments, including broadening their own authority. | Only operations inside the administrator's allowed roles, principal classes and descendant Scopes succeed. Self-broadening and unauthorized admin assignment fail atomically with attributable reason. | `REQ-AUTH-009/010`; `NOT-RUN` |
| `RBAC-08` — Super Administrator recovery | With two effective recovery holders, remove one; then attempt to remove the last, grant Super as a non-Super administrator and use Super for a product action without a separate product role. | Authorized non-last removal may succeed. Last-path removal and non-Super grant fail. Super alone creates no document, Approval or Release Permission. All attempts are audited; Core v0 does not claim two-person approval. | `REQ-AUTH-009/010`; `NOT-RUN` |
| `RBAC-09` — explain Effective Access safely | Inspect Linh/action/resource results for Group grant, direct grant, expired assignment, missing grant and wrong Project as an authorized reader and as a restricted requester. | Explanation separates server-established ActorContext, account, membership, role/version, Scope/condition and immutable RBAC Authorization Decision; restricted requester receives a safe reason without unauthorized resource disclosure. No impersonation or client-supplied ActorId trust occurs. | `REQ-AUTH-006/007`; `REQ-AUD-001/002`; `NOT-RUN` |
| `RBAC-10` — RBAC grant is not business completion | Grant Linh an action, then separately violate lifecycle state, Checkout owner/Workspace, expected Generation, review independence and Release completeness; change or remove an applicable assignment/state after the initial decision and before commit. | RBAC result may be granted, but the authoritative Module refuses each invalid or commit-time-revalidated action without state change. The immutable Authorization Decision and separately persisted owner Command Outcome identify the distinct policy/business results; Audit/outbox remain atomic with the authoritative outcome. | `REQ-AUTH-008`; affected owner requirements; `NOT-RUN` |

#### Governed configuration/import boundary

If JSON import is not implemented in Core v0, execute the form/API and common authorization cases;
record JSON-only variants as `NOT APPLICABLE` only after an approved scope explicitly excludes that
interface. Do not claim JSON support from a stored configuration example.

| Case | Procedure | Required observations and evidence | Trace / result |
|---|---|---|---|
| `AC-01` — governed form/API change | Create a valid Custom Role or other policy successor through the governed form/API, preview the difference, activate as authorized, then repeat the affected action. | No code or per-document edit is needed. Authority changes only at the recorded version/assignment effective point; base/new IDs, actor, Scope, difference and Audit are retained. | `REQ-GOV-002/005`; `REQ-AUTH-002/004`; `NOT-RUN` |
| `AC-02` — import is only a candidate | Upload a valid JSON candidate representing the same definition change, pause before activation and attempt the newly proposed action. | Upload/validation produces a candidate and preview only; proposed authority is still absent. Separate authorized activation creates one immutable version. | `REQ-GOV-002/005`; `REQ-AUTH-002/010`; `NOT-RUN` |
| `AC-03` — client/raw-storage bypass | Modify a local JSON/client claim or `ActorId` to add Approve/Release; call protected endpoints directly; inspect Web/Desktop/Workspace packages and attempt direct database access, raw Vault access or Transfer Grant escalation. | Server/IAM establishes ActorContext; Access Policy resolves its own IAM/Project evidence and emits a decision before the authoritative Module applies business gates. No client/Vault credential, raw provider path, out-of-scope grant or client-only change grants authority; denial does not leak cross-scope data. | `REQ-GOV-001/002`; `REQ-AUTH-006…008`; `REQ-SEC-001`; `REQ-WS-016`; `NOT-RUN` |
| `AC-04` — exact definition history | Execute the same action before and after authorized Role Definition activation; reopen retained decisions, Workflow instances and Releases created under the predecessor. | New assignments may use the successor. Retained assignments/evidence resolve the exact predecessor and are not reinterpreted. | `REQ-GOV-002/005`; `REQ-AUTH-002/004`; `REQ-AUD-001`; `NOT-RUN` |
| `AC-05` — invalid, stale or self-authorizing candidate | Separately submit malformed schema, unknown Permission/principal/Scope, stale base pin, unauthorized activation and a payload that attempts to grant its proposer adoption authority. | Every variant fails atomically; active definitions, Role Assignments and historical decisions remain semantically unchanged. Error and permitted Audit identify the reason without secrets. | `REQ-GOV-002/005`; `REQ-AUTH-002/010`; `NOT-RUN` |

Framework identity roles or claims may establish login context but cannot replace these product RBAC
checks. A database or serialized payload is storage or transport, not proof that an authorization
decision is correct.

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

### 1.9 Workspace concurrency, Reference and transfer acceptance detail

Procedure set `IE-VVP-WORKSPACE-SAFETY-001@0.3` expands VVP-002/003/004 for
`REQ-WS-001…016`, `REQ-OPS-001/002/007/008` and `QRS-001…003/011/013/014`. Every case is `NOT-RUN`. Public
DDM/Aras material and the local Aras read-only audit explain the comparison boundary; they do not
substitute for an IDEA result.

Prepare two Actors, at least two Workspaces (including two independent Workspaces for one Actor),
ordinary and privileged Role Assignments, current and stale Office/CAD binary fixtures, at least two
related Logical Documents, controllable clocks/network/storage faults and a recorded test-only lease
duration. The test duration is not a proposed production default. Capture document/Generation,
Reservation, Workspace Manifest, Operation/Transfer, candidate, digest, Working Head, Change Set and
Audit state before and after each case.

| Case | Procedure | Required observations and evidence | Trace / result |
|---|---|---|---|
| `WS-01` — disconnect does not release immediately | Checkout one current document, stop renewal by closing/disconnecting the client, query before and after the configured lease boundary, then reconnect the original Workspace. | Before expiry, another actor cannot obtain the conflicting Reservation. After expiry, the old Reservation cannot publish; local bytes remain untouched. If no one else has acquired and the head is unchanged, the original actor may obtain a new Reservation deliberately. | `REQ-WS-002/010/013`; `QRS-003`; `NOT-RUN` |
| `WS-02` — success always ends confirmed Checkout | In separate changed and semantic No Change runs, confirm a scope containing one or more valid Reservations and complete Check-in. | Changed entries create exactly one Version/Generation each; No Change creates none. Both terminal successes mark every confirmed in-scope Reservation `Ended`; no “keep Checkout” option or hidden retained entitlement remains. | `REQ-WS-007…009/013`; `NOT-RUN` |
| `WS-03` — failure ends no Reservation | Inject validation, candidate-verification and pre-commit database faults after at least one file/chunk has staged. | No Working Head, Version, Generation or public Change Set changes. No in-scope Reservation is ended by the failed operation. Local files and permitted private candidates remain recoverable/reconcilable. | `REQ-WS-007/010/013`; `REQ-OPS-001`; `QRS-001`; `NOT-RUN` |
| `WS-04` — governed recovery and returning holder | Expire a Reservation; perform authorized recovery with reason, then have the former holder return before and after another actor changes the head. Include unauthorized recovery. | Recovery never publishes, transfers or deletes the former holder's local work. New work uses a new Reservation/current expected Generation. Unauthorized recovery changes nothing; stale returning work enters the conflict path. Every status and actor/reason is attributable. | `REQ-WS-010/011/013`; `REQ-AUD-001`; `NOT-RUN` |
| `WS-05` — modified current Reference | Materialize as Reference, modify the local file, establish `LocalIntegrity = Modified` and independently verify `ServerFreshness = Current`; attempt direct Check-in, then invoke **Chuyển thành bản làm việc** while no conflicting Reservation exists. | UI identifies **Đã thay đổi trên máy** and the `Modified × Current` condition. Direct Reference Check-in is refused. Explicit conversion obtains a Reservation, retains the same local bytes and requires a newly confirmed Check-in scope; later valid Check-in follows WS-02. | `REQ-WS-003/006/014`; `NOT-RUN` |
| `WS-06` — stale or unknown Reference condition | Modify a Reference, advance the server head or let another actor hold Checkout, then separately lose the local/server observation needed to determine one or both axes; attempt conversion. Exercise safe local copy/current download, Create Copy, deliberate reapply and confirmed discard separately. | `OutOfDate`, `Missing/Unreadable` or either `Unknown` condition refuses conversion/publish without overwrite or automatic CAD/Office merge. The local candidate remains unless the user confirms discard. Current bytes use a separate safe location; Create Copy allocates a new `DocumentId`. | `REQ-WS-010/011/014`; `REQ-ID-009`; `NOT-RUN` |
| `WS-07` — multi-document fault and uncertain response | Confirm two changed documents. Inject failures after staging, during commit and after successful commit but before the client receives the response; query and retry using the same OperationId, then try changed input with that ID. | Pre-commit faults publish none and end no Reservation. A committed operation publishes both and ends both confirmed Reservations even if the response is lost. Status/retry returns the same terminal result without duplicate Version/Generation; changed input is refused. | `REQ-WS-007/012/013`; `QRS-001/002`; `NOT-RUN` |
| `WS-08` — multi-GB resumable direct transfer | Ask the Server to prepare an upload/download, receive a short-lived scoped Transfer Grant, then send a sparse or generated multi-GB fixture directly between Workspace and the selected Artifact Gateway without loading the complete file into application memory. Interrupt repeatedly, replay one accepted chunk/range, corrupt one chunk, expire one grant and resume safely. | Only missing verified ranges resume; replay is idempotent; corrupt data and expired/out-of-scope grants are rejected; final size/digest equals the source. The payload bypasses the Server process, but the Server retains authorization and commit authority. No candidate appears as a Generation before a verified Transfer Receipt is revalidated and the business transaction commits; every failure preserves the local source. Record peak process memory and raw throughput without inventing a PASS threshold. | `REQ-WS-012/015/016`; `REQ-OPS-001/007`; `QRS-011/013`; `NOT-RUN` |
| `WS-09` — dependency scope unknown | Select a root and locally modify a related file without Reservation. Make the format/dependency resolver unable to prove whether that file is required; attempt Check-in, then restore the resolver and scan again. | Before classification is proved, Check-in is blocked and identifies the unresolved file and reason. No file is silently excluded or published; local bytes and still-valid Reservations remain. The fresh scan follows the proved dependency result. | `REQ-WS-005/006/010/013`; `ARCH-VIEW-ACT-004`; `NOT-RUN` |
| `WS-10` — required unreserved change | Select a root with a changed selected file or required dependency lacking an `Active` Reservation; include another valid reserved document in the same proposed Check-in. Attempt Check-in through UI and command boundary. | The complete proposal is refused. No partial Change Set, Generation or Working Head change is published; local bytes and still-valid Reservations remain. The affected file is identified. | `REQ-WS-006/007/010/013`; `ARCH-VIEW-ACT-004`; `NOT-RUN` |
| `WS-11` — unrelated unreserved change | Select one valid checked-out document and locally modify a proven non-required file without Reservation. Inspect the proposed scope; decline once, then repeat and explicitly confirm the reduced exact scope. Advance the dependency relation before commit in a separate run. | The unrelated file is shown as **Modified without Checkout** and excluded. Declining confirms nothing and publishes nothing. Confirming permits only the eligible scope; excluded bytes stay local. If the relation becomes required before commit, revalidation refuses the complete operation rather than silently publishing or excluding it. | `REQ-WS-005/006/007/010/013`; `ARCH-VIEW-ACT-004`, `ARCH-VIEW-SEQ-002`; `NOT-RUN` |

### 1.10 Artifact-storage evolution acceptance detail

Procedure set `IE-VVP-STORAGE-EVOLUTION-001@0.2` expands VVP-017 for `REQ-OPS-003/004/006…008` and
`QRS-012/014`. Prepare two replaceable test providers or Vault locations, retained current/historical Generations, a Release
Package, a held Artifact, multi-GB content and controlled copy/read/cutover faults.

| Case | Procedure | Required observations and evidence | Trace / result |
|---|---|---|---|
| `ST-01` — provider-neutral identity | Resolve the same retained manifests through Artifact Custody against the initial provider, then inspect all product IDs and stored location metadata. | Logical Document, Revision, Version, Generation, Artifact and Release identities contain no provider/path identity; every returned byte matches its manifest digest and ordinary Workspace receives only a scoped Gateway route, never a raw Vault path or permanent provider credential. | `REQ-OPS-003/006/007`; `NOT-RUN` |
| `ST-02` — verified dual-location copy | Artifact Custody copies by digest to the alternate provider with interruption/resume and one corrupted candidate; keep ordinary reads on the source. | Only verified copies become Artifact Locations. Corrupt/incomplete copies cannot serve retained content; source remains readable and authoritative resolution is unchanged. | `REQ-OPS-004/006`; `QRS-011/012`; `NOT-RUN` |
| `ST-03` — cutover and rollback | After complete reconciliation, enable target reads; inject target-read failure and execute the declared rollback before the source-retirement boundary. | Every in-scope current/historical/Released/held Artifact remains resolvable with the same digest. Failure returns to the source without changing product history or publishing content. | `REQ-OPS-003/004/006`; `NOT-RUN` |
| `ST-04` — controlled source retirement | Complete the observation window and second reconciliation, then retire eligible source locations while retaining held/released references. | No required Artifact is deleted or unreadable; retirement evidence identifies exact locations/digests and respects retention/hold. A missing reference blocks retirement rather than weakening history. | `REQ-OPS-003/004/006`; `QRS-012`; `NOT-RUN` |
| `ST-05` — scoped grant and authenticated receipt | Issue one upload grant for a named Operation, Artifact candidate, Gateway, byte range, size/digest and expiry. Attempt cross-operation replay, range enlargement, expiry use, receipt forgery and reuse after terminal commit. | Gateway refuses every out-of-scope transfer; Server rejects missing/forged/mismatched receipts; no unauthorized byte becomes a Generation or public Change Set; security evidence is attributable without storing a permanent Vault credential in the client. | `REQ-WS-016`; `REQ-SEC-001/002`; `QRS-013`; `NOT-RUN` |
| `ST-06` — location selection and read failover | Mark the preferred Vault location unavailable before and during a download, then request the same Artifact while another verified location is healthy. | Artifact Custody selects or reselects only a policy-eligible verified location. Workspace receives the same logical Artifact/digest through a new scoped grant; product identity/history does not change and no raw provider path is exposed. If no eligible location exists, the operation fails clearly instead of serving unverified bytes. | `REQ-OPS-007`; `QRS-014`; `NOT-RUN` |
| `ST-07` — durability policy, replication and repair | Apply a versioned policy requiring more than one eligible location to a candidate fixture; interrupt Vault-to-Vault replication, corrupt one replica, repair it and separately simulate loss of both online replicas while an independent backup remains. | Only digest-verified locations count toward the policy. Required durability blocks the configured Check-in/Release boundary until satisfied; retries do not require Client re-upload and do not create a new Artifact identity. Repair restores a verified location. Replica evidence is never reported as backup evidence, and backup restore remains a separate procedure. | `REQ-OPS-008`; `QRS-014`; `NOT-RUN`; exact counts/failure domains `BLOCKED` |

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
| Internal document review | Project user reviews the assistant-authored plan for completeness, clarity and product fit; author consistency checks remain separate. | Prior exact-version reviews and predecessor PDA approvals are retained. The three-branch Check-in scope policy was approved under `IE-CHG-PDA-APPROVAL-003`; that decision is not evidence that any procedure passed or that VVP@0.19 received independent/qualified review. |
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
| Canonical Demo Dataset verification | `VVP-001`…`VVP-013`, `VVP-015`, `VVP-017` and applicable PA/RBAC/WS/ST procedures on one exact synthetic dataset/build baseline | `NOT-RUN`; dataset/build absent |
| Architecture-view quality | `VVP-016` against exact DOC-05@0.21/DOC-06@0.17 successor sources and generated SVG/PNG | Source/render/open and focused author visual/semantic checks are recorded in [IE-VEV-VAULT-XFER-002](VEV-2026-09-18-vault-transfer-diagram-review.md); qualified review and controlled-rendition acceptance remain `BLOCKED`; runtime procedures remain `NOT-RUN` |
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
