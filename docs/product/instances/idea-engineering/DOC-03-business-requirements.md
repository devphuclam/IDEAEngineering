# IDEA Engineering Core v0 Business Requirements

> **Instance state**: controlled `Draft 0.6`. These are internal product needs and business rules
> for the proposed Core v0 scope. They do not select a technology stack and do not become approved
> software obligations until the Feature decision and their DOC-04 translation are controlled.

## Control envelope

| Field | Recorded value |
|---|---|
| Stable Document ID | `IE-PROD-BREQ-001` |
| Document Class | `DOC-03` |
| Title | IDEA Engineering Core v0 Business Requirements |
| Owner | `Principal Product Author`; named person attribution is `BLOCKED` before `Proposed` |
| Document Status | `Draft` |
| Document Version | `0.6` |
| Applicable Baseline | `IDEA-C1-ANALYSIS-DESIGN-001` |
| Effective Date | `NOT APPLICABLE` until approval |
| Authors | `Principal Product Author`; named identity not yet recorded |
| Reviewers | Project user performs internal document review; formal attribution and any required independent/specialist qualification remain to be recorded |
| Approvers | `Product Decision Authority` for Feature; identity, decision and date are `UNKNOWN` |
| Source Links | [DOC-01](DOC-01-product-vision-and-scope.md), [DOC-02](DOC-02-feasibility-and-options-assessment.md), [accepted design lessons](../../knowledge/idea-design-lessons.md), [domain language](../../../../CONTEXT.md), [coverage register](registers/GOV-material-and-behavioral-coverage.md) |
| Downstream Links | [DOC-04](DOC-04-software-requirements-specification.md), requirement-bearing [DOC-06](DOC-06-data-integration-and-migration-specification.md) and [DOC-08](DOC-08-ui-ux-and-interaction-specification.md), [DOC-07](DOC-07-mvp-roadmap-and-delivery-plan.md), [FEATURE-001](decision-briefs/FEATURE-001-feature-definition-and-scope.md), [VVP](registers/VVP-core-v0-verification-validation-plan.md) and CHG records; future RSK |
| Evidence / Claim Status | Proposed needs derived from accepted product decisions and bounded reference evidence; internal representative validation remains `BLOCKED` |
| Change History | 0.6: clarify the accepted separation between Account Administration, PDM Administration, Business Group membership and Workflow Roles; no document, approval or release authority is added. 0.5: replace obsolete “future” links and reconcile current Feature/requirement references; [IE-CHG-SOURCE-RECON-001](registers/CHG-2026-09-09-cross-document-reconciliation.md). 0.4 classified departmental deliverables separately from operational reference data and deferred time/cost/purchasing/manufacturing/project-management authority. 0.3 clarified Version/Generation. 0.2 added native accounts and confirmed planning context. |
| Access Classification | `INTERNAL` |
| Retention Rule | Retain with the product-definition baseline; exact organizational period is `UNKNOWN`, owned by Product Decision Authority and reviewed before `Approved` |
| Content State | `COMPLETE CONTROLLED DRAFT` with explicit unresolved actions |

<!-- AUTHOR CONTENT START -->

## 1. Internal stakeholders and actors

| Stakeholder / actor | Internal context | Need or responsibility | Evidence / decision link | Population status |
|---|---|---|---|---|
| Design Engineer | Creates, stores, edits and relates Office/CAD engineering material. | Know which exact item is being changed, work locally through normal tools, publish deliberately and recover safely. | `BN-001`…`BN-004`, `BS-001`…`BS-004` | Role accepted; representative people/project `BLOCKED` pending Product Decision Authority nomination |
| Reviewer | Examines an exact proposed baseline and records findings without changing its content. | See exact Generation, Revision, structure, evidence and allowed action. | `BN-005`, `BS-005` | Seeded role; eligible independent person not assigned |
| Approver | Makes an approval/rejection decision under the applicable policy. | Receive a complete eligible scope; rationale and decision must be attributable. | `BN-005`, `BR-012`…`BR-015` | Seeded role; independent approver assignment `BLOCKED` |
| Release Authority | Releases only an approved, complete and reproducible scope. | Ensure release pins exact documents, structure, approvals and policy versions. | `BN-005`…`BN-007`, `BS-006` | Role may be combined only when policy explicitly permits; named authority `UNKNOWN` |
| PDM Administrator | Governs document classes, metadata, numbering, Access Policy, workflow, localization and format profiles. | Define what governed groups may do and which groups are eligible for Workflow Roles, without provisioning accounts or making routine membership changes. | `BN-006`, `BN-008`, `BN-009`, `BR-016`…`BR-018` | Project user may perform this duty during development; future production assignees and review remain `UNKNOWN` before PG3 |
| Quality / Auditor | Investigates what happened and whether an exact baseline can be reproduced. | Read immutable audit, decision, manifest, structure and recovery evidence. | `BN-005`…`BN-007`, `BS-007` | Specialist population and competence `BLOCKED` until assigned |
| Security / Operations | Supports identity, access, backup, restore and reliable operation. | Have explicit operational boundaries and fail-safe controls. | `BN-006`, `BN-007`, `BN-010` | User may operate initially; long-term authority/environment and validated targets remain open |
| Account Administrator | In normal company operation, one or more named people from System Management perform this duty. | Manage Actors, IDEA Accounts, Login Identities, Business Groups and explicit group membership within delegated scope. This duty does not define Access Policy or workflow and does not grant document, Approval or Release authority. | `BN-011`, `BS-009`, `BR-016`…`BR-018`, `BR-025`…`BR-028`; `TECH-CTX-003/004` | The project user may hold temporary bootstrap/superuser capability during development; the production assignee and security policy remain pending |
| Principal Product Author | Converts approved Feature intent into controlled business and software requirements. | Maintain exact trace and record gaps without presenting assumptions as facts. | Instance README and DOC-07 | Organizational role assigned; named attribution pending |
| Product Decision Authority | Decides the Feature baseline, then later Spec and Tech. | Receive concise, source-pinned decision views and explicit alternatives/unknowns. | FEATURE-001 and DOC-07 | Organizational role assigned; named decision record pending |

The [Tech-context decision](registers/CHG-2026-09-03-tech-context-and-proposal.md) records user-confirmed
planning inputs, not representative workflow validation. During development the project user may
hold temporary bootstrap, account and PDM administration capability. This is not the production
role model: routine Account Administration belongs to named System Management personnel, while PDM
Administration is separately assigned. Long-term support and eligible specialists are not assigned.

## 2. Business needs

The status `PROPOSED` means the need is sufficiently described for the Feature decision. It does not
mean the need is validated by representative users or approved for implementation.

| Need ID | Actor / context | Desired outcome | Current consequence | Source / evidence class | Priority | Status |
|---|---|---|---|---|---|---|
| `BN-001` | Design Engineer; every controlled item | One stable Logical Document identity remains recognizable across file locations, Versions, Generations and Business Revisions. | Internal frequency/impact `UNKNOWN`; risk hypothesis is duplicate or ambiguous engineering identity. | `IDEA DECISION`; `DL-001` | `Must` | `PROPOSED` |
| `BN-002` | Design Engineer; local Office/CAD work | The user explicitly obtains Checkout or Reference scope, works through normal installed applications, and knows what may be published. | Internal frequency/impact `UNKNOWN`; risk hypothesis is unclear edit authority or accidental scope. | `IDEA DECISION`; `DL-003`, `DL-017` | `Must` | `PROPOSED` |
| `BN-003` | Design Engineer; Check-in | A confirmed Check-in publishes all intended changes atomically, creates no partial visible result, and releases the confirmed hold after success or semantic NoChange. | Internal baseline `UNKNOWN`; risk hypothesis is partial or misleading published state. | `IDEA DECISION`; architecture quality scenarios | `Must` | `PROPOSED` |
| `BN-004` | Design Engineer; conflict/interruption | Stale, unauthorized or wrong-workspace publication is rejected while local work remains intact and recoverable. | Internal baseline `UNKNOWN`; risk hypothesis is overwrite or loss of engineering work. | `IDEA DECISION`; `DL-003`, `DL-016` | `Must` | `PROPOSED` |
| `BN-005` | Reviewer, Approver, Release Authority | Review, approval and release identify one exact Generation/Structure baseline, eligible actors, decisions, reasons and governing policy. | Internal process evidence `BLOCKED`; risk hypothesis is an approval detached from exact content. | `IDEA DECISION`; `DL-010` | `Must` | `PROPOSED` |
| `BN-006` | Administrator, Security, Quality | Access, lifecycle, metadata, numbering, format and approval behavior is configurable, versioned, attributable and enforced by the owning resource. | Current policy model `UNKNOWN`; risk hypothesis is hard-coded or inconsistent authority. | `IDEA DECISION`; `DL-019`, `DL-020` | `Must` | `PROPOSED` |
| `BN-007` | Quality, Auditor, Operations | One released baseline can be exported, restored and reproduced with exact identity, structure, metadata, file and digest evidence. | Restore capability/baseline `BLOCKED`; risk hypothesis is irreproducible released data. | `IDEA DECISION`; Release Spine | `Must` | `PROPOSED` |
| `BN-008` | Design Engineer, Administrator | New file types can enter a Generic Controlled-File Baseline, while deeper format behavior is enabled only by a separately evidenced Capability Profile. | Format inventory and tool versions `UNKNOWN`; risk hypothesis is false semantic-support claims or redesign per tool. | `IDEA DECISION`; `DL-012`, `DL-025` | `Must` | `PROPOSED` |
| `BN-009` | Users in supported locales | Product-controlled interface text is available in English, Vietnamese and Japanese; user-authored content is not silently translated. | User/language evidence `BLOCKED`; risk hypothesis is misunderstanding at decision points. | Stakeholder decision; localization direction | `Must` for resource architecture; representative usability `Should before rollout` | `PROPOSED` |
| `BN-010` | Product Decision Authority and internal stakeholders | Product claims distinguish demo, technical verification, single-actor test, representative need validation, pilot acceptance and rollout authorization. | Single-person project creates a risk of overstating evidence. | `IDEA DECISION`; `DL-030` | `Must` | `PROPOSED` |
| `BN-011` | User and Account Administrator; initial company rollout | Use administrator-issued native IDEA accounts without depending on company-login integration; manage governed Business Groups and membership as the normal personnel-access path; recover or disable access while retaining attributable history. | Company account integration is not yet understood; unsafe account, membership or reset privileges would undermine document controls. | `TECH-CTX-003/004`, user-confirmed administration model; requirements remain proposed | `Must` | `PROPOSED` |

## 3. Operational scenarios and processes

| Scenario ID | Trigger / precondition | Normal and negative path | Controlled outcome | Acceptance intent |
|---|---|---|---|---|
| `BS-001` Store Existing | User has an allowed existing file and permission to register it. | Normal: inspect candidate metadata/digest, show possible duplicates, confirm registration. Negative: unsupported, unreadable or duplicate candidate is explained; identity is never silently merged. | One Logical Document and initial controlled content/provenance, or no committed change. | Given a bounded dataset, every accepted item has a stable ID and every rejected/duplicate case has an attributable disposition. |
| `BS-002` New | User requests a new controlled item under an approved class/numbering policy. | Normal: allocate identity/number and materialize a working context. Negative: validation or numbering failure commits no partial item. | New uses the same Logical Document model as Store Existing. | No second identity/version model is introduced for New. |
| `BS-003` Checkout / Reference | User selects a Product Definition and exact document scope. | Normal: confirm each document as Checkout or Reference against current Generation. Negative: conflict, denied access or changed scope fails closed and requires reconfirmation. | One attributable Workspace Manifest with explicit per-document access mode and expected Generation. | No hidden whole-tree Checkout; every materialized document has an explained mode. |
| `BS-004` Check-in / stale recovery | Workspace contains possible changes and user initiates Check-in. | Normal: scan, show changed/unchanged/out-of-date status, confirm and publish atomically. Negative: stale/owner/workspace/scope failure preserves local files and offers refresh/reapply or governed recovery; no binary auto-merge. | Changed scope creates immutable Generation(s); semantic NoChange creates none; successful confirmed scope releases its hold. | All specified failure cases reject server publication without losing the local candidate. |
| `BS-005` Review and decision | A complete proposed baseline is submitted under a versioned policy. | Normal: eligible reviewer/approver sees exact pins and records approve/reject. Negative: missing actor, evidence, quorum or separation blocks the transition; author is not silently substituted. | Immutable decision evidence tied to exact scope and policy. | Every decision identifies actor, time, reason, scope and policy version; ineligible decisions are refused. |
| `BS-006` Release | An approved exact baseline is proposed for release. | Normal: collect/preview required scope, validate eligibility, then release all confirmed items. Negative: stale, unresolved, unauthorized or incomplete entry rejects the full confirmed scope. | Immutable Release Record and Controlled Release Package with exact pins. | No released record is created for a partial or dynamically resolved “latest” scope. |
| `BS-007` Reproduce / restore | Authorized user selects a Release Record or approved recovery point. | Normal: resolve manifest, metadata, artifacts, structure and digests. Negative: missing/mismatched content is visible and the result cannot be marked successful. | Recreated exact released baseline or explicit failed recovery evidence. | Every retained item resolves to the pinned identity and matching digest in the approved test scope. |
| `BS-008` Change governed policy | Authorized administrator proposes a metadata, numbering, access, lifecycle, approval, localization or format-policy change. | Normal: edit a draft definition, review as required and activate one exact version. Negative: invalid/unauthorized change is rejected and retained history stays bound to its prior version. | New policy version applies prospectively; prior processes/releases retain their governing pins. | Activating a policy never silently reinterprets a running workflow or retained release. |
| `BS-009` Manage account and access eligibility | Authorized Account Administrator provisions an account, manages governed group membership or handles recovery. | Normal: create/activate an account, place the Actor in an allowed Business Group, and let the active Access Policy determine product access. Negative: public signup, invalid/reused reset proof, out-of-scope membership, suspended/old session and unauthorized administration are refused. | Account and membership changes are attributable; stable Actor/history remains; local candidates are preserved on session loss. | Account Administration can change membership but cannot define/activate Access Policy or workflow and does not itself imply document/Approval/Release access. |
| `BS-010` Departmental engineering handoff | One department supplies CAD/PDF/software/instructions/checklists together with optional hours, cost or progress context. | Normal: governed engineering deliverables enter the applicable document, structure, review and Release flow; configured reference values remain attributable context. Negative: storing a value or file does not create a purchase, calculate cost, mark manufacturing/project work complete or advance a lifecycle state without a separately approved rule. | Exact handoff documents, structure and evidence are reproducible; no unapproved operational transaction or status is created. | A controlled handoff is demonstrable without turning Core v0 into timekeeping, costing, procurement, manufacturing-execution or project-management software. |

## 4. Business rules and constraints

| Rule / constraint ID | Rule or constraint | Rationale / source | Affected DOC or data | Verification / review trigger |
|---|---|---|---|---|
| `BR-001` | Logical Document identity is stable and is not a file name, path, business number, Revision or Generation. | `BN-001`; canonical domain language | DOC-04/05/06 | Model and identity tests before PG5 |
| `BR-002` | A published Generation is immutable; change creates a successor rather than modifying retained content in place. | `BN-001`, `BN-003` | DOC-04/05/06 | Invariant and persistence tests |
| `BR-003` | Business Revision, Version within Revision and Generation are distinct controlled concepts. Version begins at 1 in each Revision, increments once for a changed Check-in, does not increment for No Change and resets to 1 for a new Revision. No separate Version Sequence exists. | `BN-001` | DOC-04/05/06/08 | Scenario/table review and invariant tests |
| `BR-004` | Checkout grants publish entitlement for one Logical Document to an eligible owner/workspace; it does not guarantee that local files cannot change. | `BN-002`, `BN-004` | DOC-04/05/08 | Concurrent two-identity/two-workspace tests |
| `BR-005` | Reference materializes a controlled file without publish entitlement. Every document in workspace scope states Checkout or Reference explicitly. | `BN-002` | DOC-04/06/08 | Workspace-manifest tests |
| `BR-006` | Check-in must provide expected Generation, authenticated owner, Workspace identity, confirmed scope and idempotent operation identity. | `BN-003`, `BN-004` | DOC-04/05/06 | Negative-path/fault-injection tests |
| `BR-007` | One confirmed multi-document Check-in is all-or-nothing. No visible Generation may refer to unverified or missing content. | `BN-003` | DOC-04/05/06 | Fault injection at each publish step |
| `BR-008` | Successful changed Check-in or semantic NoChange releases the hold for the confirmed scope. Failed/stale Check-in does not automatically remove a still-valid entitlement. | Stakeholder decision; `BN-003`, `BN-004` | DOC-04/05/08 | State-transition tests |
| `BR-009` | A rejected publication preserves the local candidate and explains what failed, expected/current Generation, permitted owner information and valid recovery actions. | `BN-004` | DOC-04/06/08 | Conflict catalogue and recovery tests |
| `BR-010` | Binary Office/CAD content is not auto-merged. Refresh/reapply obtains the new server baseline while preserving the user's candidate for deliberate comparison/reapplication. | `BN-004` | DOC-04/06/08 | Stale-conflict walkthrough/tests |
| `BR-011` | Product Structure Snapshot is immutable and pins exact member/occurrence/dependency identities needed for reproduction. | `BN-005`, `BN-007` | DOC-04/05/06 | Snapshot resolution and digest tests |
| `BR-012` | Workflow definition and running workflow instance have distinct identities; an instance pins the applicable definition/policy version. | `BN-005`, `BN-006` | DOC-04/05/06 | Policy-change and retained-instance tests |
| `BR-013` | The default release-approval policy requires an eligible independent approver; missing eligibility blocks the decision. Any later exception must be explicit, versioned and attributable. | Stakeholder decision; `BN-005` | DOC-04/05/08 | Role/quorum/separation tests |
| `BR-014` | Release validates the complete confirmed scope before committing. Required exclusion, unresolved dependency, stale item or failed evidence rejects the whole scope. | `BN-005`, `BN-007` | DOC-04/05/06/08 | Negative release-gate tests |
| `BR-015` | Release Record pins exact Generations, Structure Snapshot, approval evidence and governing policy; a released view never resolves dependencies by dynamic latest. | `BN-005`, `BN-007` | DOC-04/05/06 | Exact reproduction tests |
| `BR-016` | Access rules are centrally governed, versioned and explainable; each authoritative resource owner enforces the final decision across Web, Desktop, transfer, preview, export and workers. | `BN-006` | DOC-04/05/06/08 | Cross-path authorization matrix |
| `BR-017` | Business Groups, Workflow Roles, state/action grants and organization policies are configuration, not hard-coded domain behavior. PDM Administration defines their governed meaning and policy; Account Administration maintains Business Group membership within delegated scope. | `BN-006`, `BN-011` | DOC-04/05/06/08 | Change membership and replace a seeded policy independently, then rerun owner-module tests |
| `BR-018` | Metadata schema, validation, numbering, workflow, approval, retention, localization and format capability use stable definitions and versioned activation where they affect controlled meaning. | `BN-006`, `BN-008`, `BN-009` | DOC-04/05/06/08 | Configuration activation/history tests |
| `BR-019` | Generic file control and deeper semantic capabilities are reported separately. No enabled format inherits unverified semantic claims from another format. | `BN-008` | DOC-04/06/08 | Capability-profile conformance matrix |
| `BR-020` | IDEA does not execute code inside design applications; files open via the approved external application boundary. | Product boundary decision | DOC-04/05/06/08 | Package/process boundary verification |
| `BR-021` | Product-controlled UI resources support `en`, `vi` and `ja`, with English fallback; user-authored content remains unchanged unless an explicit translation feature is later approved. | `BN-009` | DOC-04/08 | Locale matrix and fallback tests |
| `BR-022` | Audit records material commands, decisions, policy/source pins and result without turning a log message into a second product authority. | `BN-005`…`BN-007` | DOC-04/05/06 | Evidence completeness and tamper tests |
| `BR-023` | Demo, technical verification, single-actor functional acceptance, internal need validation, pilot acceptance and rollout authorization remain distinct statuses. | `BN-010` | All core docs and VVP/VEV/REL | Gate/review checklist |
| `BR-024` | The product remains internal-only in this baseline; commercial objectives and claims are not requirements. | DOC-01 | DOC-01/03/07 | Review on formal product-boundary change only |
| `BR-025` | Core v0 uses native IDEA accounts first; other/company login is future integration, not a prerequisite for ordinary use. | `BN-011`; `TECH-CTX-003` | DOC-04/05/06/08 | Native sign-in without provider tests |
| `BR-026` | Accounts are administrator-issued, not openly self-registered. Account Administration owns Actors, accounts, Login Identities, Business Groups and explicit membership within delegated scope. It does not define or activate Access Policy/workflow and does not automatically grant document access, policy-adoption authority or Approval/Release eligibility. | `BN-011`; `TECH-CTX-004` | DOC-04/05/06/08 | Provisioning, group-membership and separation tests |
| `BR-027` | Account recovery, suspension and session revocation are controlled and audited; subsequent protected operations reject ineligible access, without deleting safe local work. | `BS-009`; security consequence of native accounts | DOC-04/05/06/08 | Reset/replay/revocation and recovery tests |
| `BR-028` | Stable Actor/account history survives login changes; account linking and bootstrap/recovery authority must be explicit and cannot silently create product privileges. | `BN-011`; existing bootstrap/domain rules | DOC-04/05/06 | Stable-identity and first/last-admin tests |
| `BR-029` | A departmental output list describes handoff context, not an automatic Feature inventory. IDEA Core v0 governs applicable documents, Product Structure and evidence; hours, costs, purchasing/fabrication status, progress and completion are Operational Reference Data unless a separately approved capability or external contract assigns IDEA authority for that process. Their presence alone never calculates a value, records an external business transaction or advances Workflow/Release. | Confirmed correction point 13; `BS-010`; `COV-DDM-013` remains deferred | DOC-01/04/06; Feature/Spec/VVP | Departmental-handoff boundary procedures before affected scope is called implemented |

These rules intentionally do not select a programming language, framework, database, object store,
identity provider or deployment topology.

## 5. Priorities, assumptions and non-goals

### 5.1 Priority model

The Product Decision Authority owns priority at the Feature decision:

- `Must`: required in Core v0 or required as a control before its implementation/rollout.
- `Should`: expected when evidence and applicable gate permit, but not allowed to weaken a `Must`.
- `Deferred`: retained with owner and trigger outside the first Core v0 increment.
- `Not Applicable`: outside the approved internal-product boundary.

All `BN-001`…`BN-011` are proposed `Must` needs for the applicable stage, with the representative
usability portion of `BN-009` required before rollout rather than before Feature approval.

### 5.2 Assumptions and unresolved points

| Item | Assumption / gap | Impact | Owner | Resolution trigger | Status |
|---|---|---|---|---|---|
| `BREQ-GAP-001` | Representative internal project, users, workflow and current-state evidence are absent. | Prevents internal need/value validation and representative acceptance. | Product Decision Authority | Before any internal validation/pilot claim | `BLOCKED` |
| `BREQ-GAP-002` | Named independent approver and specialist reviewers are absent. | Prevents independent approval/requirements/HCD/quality assurance where required. | Product Decision Authority | Before affected PG2/PG3 decision or test | `BLOCKED` |
| `BREQ-GAP-003` | Exact generic format allowlist and IRONCAD versions/capabilities are not pinned. | Prevents precise format obligations and conformance scope. | Principal Product Author | DOC-06/DOC-08 and VVP preparation | `UNKNOWN` |
| `BREQ-GAP-004` | The administration boundary is defined, but the initial Business Groups, Workflow Roles, policy grants, delegated administration scopes, retention periods and information classifications are not supplied. | Prevents final seeded policy and operational requirements; it does not reopen the responsibility split. | Product Decision Authority / Security/Quality authority `UNKNOWN` | Before Spec/Tech approval as applicable | `UNKNOWN` |
| `BREQ-GAP-005` | 50–100 total users at one site and rough MB-to-GB document sets are reported; four-working-hour RTO / one-hour RPO are preliminary goals, not measured targets achieved. Concurrent load, file limits, growth, support coverage and thresholds remain open. | Prevents capacity, service and rollout claims. | User may operate initially; long-term Operations authority `UNKNOWN` | Define workload/clock and verify before operational commitments | `PARTIALLY CLARIFIED` |
| `BREQ-GAP-006` | Windows clients and native accounts first are confirmed; exact host/OS/browser/tool versions, account-security policy, recovery channel and IT permissions remain open. Company login is deferred. | Limits deployment/security qualification, not the ability to propose a native-account design. | Project user with system management/technical support; Product Decision Authority for Tech | Before final support/technology commitment | `PARTIALLY CLARIFIED` |

### 5.3 Non-goals and deferred needs

Core v0 does not include a full graphical workflow designer, advanced/saved search administration,
ERP/MRP exchange, general external API, multisite replication, automated purge suite, full ECR/ECO,
bulk legacy migration or additional deep CAD profiles. It does not run IDEA code inside Office/CAD
applications. It also does not perform timekeeping, cost calculation, purchasing, manufacturing
execution or project schedule management merely because those values appear in a departmental
handoff. Company-account integration and open self-registration are not in the initial native-account
scope. These dispositions remain traceable in the coverage register and DOC-07 rather than being
treated as rejected long-term needs.

## 6. Acceptance intent and claim boundaries

| Need / scenario | Acceptance intent | Evidence class/status | Required reviewer | Result |
|---|---|---|---|---|
| `BN-001`…`BN-004`; `BS-001`…`BS-004` | Stable identity and safe workspace publication, including all specified failure paths. | Future technical verification on exact Spec/VVP baseline | Requirements reviewer plus verification role; assignment `BLOCKED` | `NOT-RUN` |
| `BN-005`…`BN-007`; `BS-005`…`BS-007` | Exact, eligible and reproducible review/release baseline with complete evidence. | Future technical verification and controlled walkthrough | Quality/release reviewer and Product Decision Authority; named identities `UNKNOWN` | `NOT-RUN` |
| `BN-008`; format profile | Generic conformance plus separately evidenced first deep profile. | Future capability-profile evidence | Format-domain reviewer; assignment `BLOCKED` | `NOT-RUN` |
| `BN-009` | Locale-resource/fallback verification and later representative usability evidence. | Technical locale verification plus separate user evidence | HCD and Vietnamese/Japanese reviewers; assignments `BLOCKED` | `NOT-RUN` |
| `BN-010` | Every report/gate uses the correct evidence-status label and authority. | Documentation/gate review | Project user for internal document review; independent reviewer where required | `NOT-RUN` |
| `BN-011`; `BS-009` | Native account, Business Group membership, recovery and suspension are safe and attributable; Account Administration does not define policy, bypass product permissions or rewrite Actor history. | Future verification against `REQ-IAM-001…007`, `REQ-GOV-002/005` and `VVP-015` | Security/verification reviewer; qualification and assignment `BLOCKED` | `NOT-RUN` |
| `BS-010`; `BR-029` | Departmental engineering deliverables remain controlled and reproducible while operational reference values create no unapproved time/cost/purchasing/manufacturing/project transaction or lifecycle result. | Future verification against `REQ-GOV-003` and the departmental-handoff procedure set | Requirements/verification reviewer; representative departmental owner `UNKNOWN` | `NOT-RUN` |

## 7. Trace and gate readiness

| Trace or gate item | Required link / rule | Result |
|---|---|---|
| Need to source | Accepted product decision or bounded source with limitation | The original ten needs trace to DOC-01/design lessons; BN-011 traces to confirmed account context; representative internal evidence remains `BLOCKED` |
| Need to requirement | DOC-04 obligation ID, rationale and acceptance/verification method | DOC-04@0.11 draft has 74 identified obligations, including the current SR/CR/WF/AC/IF/BM/DH scope; review and boss decision remain `NOT-RUN` |
| Need to roadmap | DOC-07 increment and dependency | `IE-INC-FEATURE-001`, followed by `IE-INC-SPEC-001` |
| First gate | `PG1` exact input baseline and outcome | Inputs being prepared; outcome `NOT-RUN` |
| Change impact | CHG on material need change | IE-CHG-TECH-001 records native-account context; [IE-CHG-SPEC-ARCH-QUALITY-001](registers/CHG-2026-09-10-spec-architecture-quality-baseline.md) records the current administration-boundary clarification; no boss approval inferred |

## Internal-company value and claim boundary

| Value/claim area | Required treatment | Status |
|---|---|---|
| Internal operating outcome | Measure the affected internal role, workflow, control, quality, maintainability or evidenced efficiency. | Hypothesis only; representative baseline `BLOCKED` |
| Technical or pilot claim | Pin exact configuration, dataset, scope, limitation, result and authority; technical verification is not adoption. | `NOT-RUN` |
| Commercial objective | Pricing, revenue, acquisition, market share, market fit or external buyers. | `NOT APPLICABLE` |

## Pilot claim/status matrix

| Claim status | Minimum evidence | What it does not prove | Result |
|---|---|---|---|
| `Canonical Demo Dataset` | Approved synthetic dataset and exact test baseline | Internal need, pilot acceptance or rollout | `NOT-RUN` |
| `Technical Pilot Verification` | Approved non-production execution, configuration and VEV result | Representative acceptance or rollout authority | `NOT-RUN` |
| `Single-Actor Functional Acceptance` | One person operating separately provisioned identities, with scope and limitations | Independent review or representative-user acceptance | `NOT-RUN` |
| `Internal Operational Need Validation` | Representative internal roles/workflows and attributable evidence | Technical readiness by itself or rollout authorization | `BLOCKED` |
| `Internal Pilot Acceptance` | Technical evidence, representative internal-user evidence and named authority | Broader rollout beyond approved scope | `BLOCKED` |
| Operational rollout authorization | Named authority, exact scope, accepted residual risk and release baseline | Any claim outside the authorized scope | `BLOCKED` |

## Typed trace, supporting records and rendition controls

| Link type | Required target and purpose | Result |
|---|---|---|
| `SOURCE-NEED` / `SOURCE-DECISION` | DOC-01, accepted design lessons, stakeholder decisions and bounded reference evidence | Linked; representative internal source `BLOCKED` |
| `DOWNSTREAM` | DOC-04 requirement, DOC-07 increment, DOC-06/08 consequence and FEATURE-001 | `FEATURE-001@0.12` and affected sources include the resolved Version model and later accepted scope clarifications; boss decision remains `NOT-RUN` |
| `CHANGE` | CHG/Work Item and impact across requirements, design, risks, tests, operations and release | IE-CHG-TECH-001 and [IE-CHG-SPEC-ARCH-QUALITY-001](registers/CHG-2026-09-10-spec-architecture-quality-baseline.md); predecessor sources retained and successor review required |
| `VERIFICATION` | Future VVP/VEV method and exact result | Acceptance intent stated; execution `NOT-RUN` |
| `RELEASE` | Future REL baseline and authorized claim scope | `NOT APPLICABLE` to this draft |
| `RENDITION` | Source-pinned DOCX/PDF identity and status | No rendition generated |

<!-- AUTHOR CONTENT END -->

## Contract references

- [DOC-03 class template](../../definition/DOC-03-business-requirements.md)
- [Core document catalogue](../../definition/README.md)
- [Evidence and trace](../../../../specs/003-controlled-documentation/contracts/evidence-and-trace.md)
- [Gate package](../../../../specs/003-controlled-documentation/contracts/gate-package.md)
- [Project domain language](../../../../CONTEXT.md)
