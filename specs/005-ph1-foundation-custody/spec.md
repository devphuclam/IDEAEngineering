# Feature Specification: PH1 Foundation and Single-Vault Custody

**Feature Branch**: `codex/ph1-foundation-f01`
**Created**: 2026-09-25
**Version / owner**: `0.9` / Principal Product Author
**Status**: Draft — delivery specification for the PG4-authorized PH1 increment, not a new Product Decision Authority approval
**Increment**: `IE-INC-PH1-FOUNDATION-CUSTODY-001`
**Classification / verification**: `INTERNAL` / F01–F04 accepted results belong to retained per-card evidence; F05 qualification/runtime `NOT-RUN`; whole-PH1 acceptance incomplete
**Input**: Deliver only F01–F05 of the approved roadmap (72 planned task hours): a buildable application foundation, controlled data and account foundations, attributable business outcomes, and one direct Client-to-Gateway-to-Vault transfer smoke path.

**Clerical successor 2026-10-03 / Work Item #37**: v0.9 corrects current status only.
Requirements, scenarios and historical evidence are unchanged. See the
[F03-B closure matrix](evidence/F03-B-closure-matrix.md) and
[F04 accepted results](evidence/F04-outcome-results.md). The frozen F05 preparation
retains its original v0.8 input at the recorded commit; this successor does not rewrite that freeze.

## Authority and Scope Boundary

The [PG4 decision](../004-technical-pilot-readiness/pg4-gate-record.md) authorizes this exact PH1 increment. The [frozen PH0 manifest](../004-technical-pilot-readiness/baseline-manifest.md) and [PG2/PG3 approval report](../../docs/product/instances/idea-engineering/registers/CHG-2026-09-25-pg2-pg3-approval.md) identify the controlling product sources. This Spec Kit file organizes delivery and acceptance of their F01–F05 subset; it does not introduce a new Feature, alter a `REQ-*` obligation, select another Tech Stack, or approve the wider Core v0 scope. If a statement here conflicts with a controlled product requirement or architecture decision, stop and resolve the conflict through the owning source.

PH1 implements **one Gateway/Vault endpoint** and retains the approved separation between file identity and physical storage location. It must leave the Vault identity/location and Adapter boundary usable by a later multi-Vault increment. PH1 does **not** implement or claim a second Vault, replication, repair, failover, a Format Worker job, CAD/Office conversion, Logical Document lifecycle, Checkout/Check-in, Review/Release, multi-GB performance, production recovery, shared rollout or commercial readiness.

This is a **PH1 delivery boundary, not cancellation of the Core v0 document flow**. The
[current roadmap](../../docs/product/instances/idea-engineering/planning/DOC-07-appendix-A-task-breakdown-december-2026.md)
schedules document identity and Generation in PH2, Workspace with Checkout/Reference/Check-in in
PH3, and Review/Release in PH4; PH5 checks the integrated flow again. F05 in PH1 proves only a
direct file-transfer and custody boundary, not a completed document Check-in.

The user’s PG4 decision authorizes implementation but is not evidence that any PH1 application test has passed. Each F01–F05 completion result requires its own executed test and retained evidence. Starting the F01-A effort timer remains a separate Tracker action.

## Clarifications

### Session 2026-09-30

- Q: May an effective Super Administrator explicitly assign Account Administrator to itself? → A: Yes, using its already granted, organization-scoped permission to assign that exact role. The new assignment remains separate, version-pinned, reasoned and audited; Super alone has no account CRUD permission. Other delegates cannot broaden their authority or exceed their delegation limits.

The Project Reviewer confirmed this bounded F03-A interpretation of `REQ-AUTH-010` during
implementation review. It does not authorize arbitrary self-grants, alter other delegation limits,
or claim a new Product Decision Authority approval for the frozen PG2/PG3 baseline.

- Q: How is the first password set for a pending account in F03-B? → A: An eligible Account Administrator issues a target-bound, single-use setup proof that expires after 15 minutes. In development, deliver it only through the protected synthetic test harness; do not add public registration or company email integration, or put credentials/proofs in Git, logs or chat.
- Q: What session expiry and invalidation rules apply in F03-B development, and must tests wait for the real deadlines? → A: Expire after 2 hours without eligible activity or 8 hours from sign-in, whichever comes first. Logout revokes the current session; account disablement or password reset revokes all affected sessions; re-enable requires fresh sign-in and never revives old sessions. Keep local candidate files. Tests use controlled time or isolated seconds-based settings, not hours of waiting.
- Q: What password and failed-login policy applies to synthetic F03-B accounts? → A: At least 15 characters without mandatory upper/lowercase, digit or symbol mixtures; retain the qualified BCrypt limit of 72 UTF-8 bytes and reject over-limit input rather than truncating. Five failed sign-ins within 15 minutes temporarily block that login for 15 minutes; this is not permanent account disablement. MFA is outside this synthetic development profile, not waived for a future live rollout.

The Project Reviewer confirmed the F03-B development profile on 2026-09-30. It qualifies
synthetic-account development and testing only; it does not settle `SPEC-OPEN-06` for real
company accounts or claim production security approval. F03-A acceptance is unchanged.

- Q: How does Account Administrator gain setup/reset authority without expanding v1 assignments? → A: The Project Reviewer approved protected successor `account-administrator@2` on 2026-09-30. It contains `account.create`, `account.disable`, `account.re-enable`, `account.credential.setup.issue` and `account.credential.reset.issue`. Version 1 and its assignments remain unchanged. The existing Super assignment permission may grant a separate, exact supported v2 Role Assignment at Organization Scope with assigner, reason, Access Policy outcome and Audit; it grants no implicit Super setup/reset authority. First setup applies only to a pending account without a credential. Proof-bound redemption needs no Account Administrator role. Reset remains a distinct purpose/path. Preserve v1/F03-A regressions; neither `SPEC-OPEN-03` nor `SPEC-OPEN-06` closes for the wider product.

- Q: Can a disabled synthetic account reset its credential without being re-enabled? → A: Yes. The Project Reviewer authorized the relayed review proposal subject to Engineering checking the baseline on 2026-09-30; Engineering confirmed it matches REQ-IAM-003/004 and the contract. Reset is allowed for ACTIVE or DISABLED accounts that already have a credential. Its separate, target/login/security-version-bound one-use proof expires after 15 minutes in the synthetic profile. Redemption replaces the credential, increments security_version and invalidates all affected sessions/prior credential proofs atomically with IAM outcome and Audit. It preserves the account status and actor.disabled_at. A DISABLED account cannot sign in even with the new password; separate re-enable at the new expected version is required, followed by fresh sign-in with the new credential. Re-enable does not change the password. PENDING/no-credential accounts use first setup, never reset. This supersedes the unaccepted ACTIVE-only recommendation; it is not a new live-company policy or product-gate approval.

- Q: Which Login Identity does reset target when an Account has more than one? → A: The Project Reviewer requires `loginIdentityId` on every RESET issuance, including single-login accounts. Validate that exact Login Identity's Account, Organization, expected security version, existing credential and ACTIVE/DISABLED eligibility. Never select a first row or infer a login. Redemption changes only that pinned Login Identity's credential; the Account version still increments and every old Account session is revoked. Other Login Identities keep their credentials and can establish fresh sessions when the Account is ACTIVE. V1–V6 remain immutable; T046 is the successor repair, not reopening historical T045 or rewriting evidence §20.
- Q: What are the exact temporary-block boundaries and resource limits? → A: Use a rolling 15-minute failure window per normalized login; a failure exactly 15 minutes old no longer counts. Failure five starts a 15-minute block. During it, attempts neither increment failures nor reset/extend `blocked_until`; at that deadline retry is allowed. Successful eligible sign-in clears current failure state atomically with session establishment. Concurrent updates must be atomic. Keep generic refusal and equivalent qualified password work on blocked paths; arbitrary unknown login identifiers must not create unbounded durable state. This approval is for clarification/test planning only; implement throttling only after T046's external review and successor Spec Kit analyze.
- Q: Must unknown login identifiers have their own failed-login state? → A: No. The Project Reviewer approved tracking only existing Login Identities. An unknown identifier creates zero failure-observation records, is always refused generically and retains the qualified dummy-password work. Existing identities retain the approved rolling-window/block rules; Account eligibility still determines whether sign-in is allowed. The choice applies only to this synthetic development profile, not a general request-rate or production denial-of-service guarantee.

### Session 2026-10-01

- Q: May the Web sign-in password temporarily exist in a password control or page JavaScript? → A: Yes, only for password entry and request submission. Controlled-input framework state is permitted when needed; it must not retain the password after submission or component unmount, including refusal or error paths. Do not persist or copy the password elsewhere, or expose it in a URL, DOM text, diagnostics, logs, localStorage/sessionStorage or retained evidence. CSRF may exist in RAM; the session cookie must never be readable by page JavaScript. This clarifies the Web boundary, not the separate Desktop/WebView2 custody rule. At the time of this clarification, approval of the remaining T043 HTTPS/browser seam and test contract was pending; the later approval is recorded below and does not rewrite this historical clarification.

This delivery clarification supersedes only the overbroad Web password wording in the plan and
boundary contract. It preserves the frozen product approvals and all historical execution evidence;
spec v0.6's authentication, reset and throttling semantics are unchanged.

The Project Reviewer subsequently approved the T043 Web seam/test contract on 2026-10-01,
subject to same-origin delivery by the actual IDEA Server, qualified package sourcing and
normally trusted HTTPS. See [Web qualification contract](contracts/ph1-boundaries.md#t043-web-qualification-contract).
That later approval authorizes Web implementation after environment prerequisites; it does not
claim execution or approve the separate Desktop checkpoint.

### Session 2026-10-02

- Q: What does F04 qualify without creating another product command? → A: The Project Reviewer approved an internal synthetic sample using existing `sample_owner_operation`; no mutable sample entity, new product Permission/Role, HTTP or Swagger operation. A current Server-established eligible Actor/session is still required. ACCEPTED retains owner result, required Audit and an immutable committed event in one transaction; the event claims retention, not delivery. The approved ENVELOPE-9 foundation and Engineering realization are recorded in [ADR-0014](../../docs/adr/0014-retain-owner-committed-event-foundation.md).
- Q: How do refusal, failure and retries differ? → A: A committed sample business REFUSED is terminal for its OperationId and retains owner outcome plus refusal Audit, with no F04 event. A same-ID retry resolves the original committed ACCEPTED/REFUSED result without re-execution or duplicate Audit/event; a new genuine attempt uses a new ID. Confirmed technical rollback retains attributable qualification evidence, not a fabricated durable FAILED owner row. An uncertain commit cannot be called rollback or silently retried as a new success. These sample semantics do not establish universal future owner rules or F05 reconciliation.
- Q: Who may resolve a committed F04 sample result? → A: Only the originating stable Actor, established by Server from a currently eligible session/Account; a fresh valid session for that Actor is allowed. Another Actor, including one in the same Organization, receives non-disclosing refusal without the original outcome/details, mutation, re-execution or duplicate original Audit/event. Original session instance is not authority. This is the sample owner's query policy, separate from provenance/idempotency, not a universal database/store rule. Future owner queries may authorize other readers, and a separately governed access-attempt Audit is not prohibited.

These are Project Reviewer-approved F04 delivery refinements, not new Core requirements, gate
decisions or executed application results. They preserve F03 historical baselines and decisions.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Start and check the application foundation (Priority: P1; F01)

As the primary developer, I need the Web, Desktop, Server and automated-check projects to start from one controlled source so that later work has repeatable entry points and no real secret is stored in the repository.

**Why this priority**: Every later PH1 slice depends on a reproducible foundation.

**Independent Test**: From a clean checkout and documented configuration, run the prescribed build and basic checks for each project; inspect the repository configuration for real credentials.

**Acceptance Scenarios**:

1. **Given** the PH1 source and documented prerequisites, **When** the prescribed commands run, **Then** each F01 project builds and the basic checks return recorded results.
2. **Given** a developer without local secrets, **When** they inspect the repository, **Then** examples explain required values but do not contain working passwords, private keys or tokens.

---

### User Story 2 - Establish controlled data state (Priority: P1; F02)

As the primary developer, I need a reproducible data baseline and a bounded rollback check so that a fresh development database can be created and a failed change can be handled without calling it a production-recovery result.

**Why this priority**: Account, Audit and transfer metadata depend on a known data baseline.

**Independent Test**: Apply the versioned data changes to a fresh development database, repeat the supported migration check, execute the documented rollback test and distinguish application health from database availability.

**Acceptance Scenarios**:

1. **Given** a fresh permitted development database, **When** its recorded changes are applied, **Then** the expected baseline is available and the applied version is identifiable.
2. **Given** a rollback case supported by the PH1 plan, **When** it is executed, **Then** its actual result and limits are recorded; the result is not presented as a backup/restore test.
3. **Given** an unavailable database, **When** health is checked, **Then** the result distinguishes data unavailability from an application-process failure.

---

### User Story 3 - Sign in with a controlled account (Priority: P1; F03)

As an account administrator, I need to bootstrap the initial administrator through a controlled path and manage native accounts and sessions without public self-registration. As a signed-in user, I need sign-out and session invalidation to take effect.

**Why this priority**: Later commands must have an attributable, eligible Actor rather than trusting a client-supplied identity.

**Independent Test**: Bootstrap once under the documented authority, sign in as a test account, sign out or disable it, and retry a protected request with the old session.

Also re-enable the account and prove the old session stays invalid while a fresh sign-in works.
Use the F04 sample owner command to exercise disablement/revocation during an in-flight request.

**Acceptance Scenarios**:

1. **Given** a new installation with no initial administrator, **When** the controlled bootstrap is executed, **Then** one attributable administrator account becomes available without opening public registration.
2. **Given** bootstrap has already completed, **When** it is requested again, **Then** no Actor, account or Role Assignment is created or changed and the caller receives a clear already-initialized result; no additional privilege is granted.
3. **Given** an active native account, **When** its credentials are verified, **Then** the resulting session is associated with its stable Actor; the client cannot choose another Actor for a protected request.
4. **Given** a signed-out, disabled or revoked session, **When** it is reused, **Then** the protected request is refused.
5. **Given** a protected command started with an eligible session, **When** account disablement or session revocation commits before the command's authoritative commit, **Then** commit-time eligibility revalidation coordinated with that security change prevents the command from committing a successful business-state change. A check only at request arrival is insufficient.
6. **Given** an account is re-enabled after disablement, **When** a prior invalidated session is reused, **Then** it remains refused; access requires a fresh eligible sign-in rather than reactivating the old session.
7. **Given** only a Super Administrator assignment, **When** account creation, disablement or re-enablement is attempted, **Then** it is refused. An explicit Account Administrator assignment must first be granted through the ordinary assignment-permission path; its principal may be the assigning Super Administrator under the clarification above.
8. **Given** an eligible Account Administrator at the correct Organization Scope, **When** an account is created, disabled or re-enabled, **Then** the result is attributable and atomic with IAM outcome and Audit; creation grants no Project/Group membership or product role, and disable/re-enable preserves Actor/account/login identities and history. Ordinary users, wrong-role/wrong-scope and revoked assignments are refused.
9. **Given** a pending synthetic account and a correctly bound setup proof, **When** its first credential is set before expiry, **Then** it becomes eligible for fresh sign-in only after successful setup; wrong-target, expired or reused proof attempts leave its credentials and activation state unchanged.
10. **Given** an eligible synthetic session, **When** either development-profile deadline is reached, **Then** a protected request is refused. Eligible activity refreshes only the idle deadline, never the absolute deadline. Logout, account disablement and password reset apply the profile's revocation rules without deleting local candidate files.
11. **Given** a synthetic account undergoing credential setup or sign-in, **When** a password violates the development profile or the failed-login threshold is reached, **Then** setup is refused without changing credentials or login is temporarily blocked as applicable. At the block deadline, an otherwise eligible account can attempt fresh sign-in; this neither re-enables a disabled account nor restores an old session.
12. **Given** an ACTIVE or DISABLED synthetic account and a valid reset proof for its explicitly selected, existing-credential Login Identity, **When** the proof is redeemed, **Then** only that Login Identity's password changes, the Account security version increments and all prior Account sessions/proofs become ineligible in the same transaction as the IAM outcome and Audit. Other Login Identity credentials are unchanged. Account status and Actor disablement are unchanged. A disabled account cannot sign in until separate re-enable; afterward the selected login requires its new password and other logins retain their own credentials. Missing, foreign-account, unknown, wrong-scope, stale-version, expired, wrong-purpose or reused targeting cannot change credentials or enablement.

Scenarios 1, 2, 7 and 8 belong to the F03-A Server-service checkpoint on real PostgreSQL.
Creating a pending account is not credential setup or successful sign-in. HTTP authentication,
session-derived Actor context and old-session behavior remain F03-B; in-flight owner validation
also requires F04 evidence.

**F03-B synthetic development profile** (the measurable values below are Project Reviewer
choices, not universal security rules or company policy):

| Control | Required development behavior |
|---|---|
| First credential setup | Eligible Account Administrator issues a proof bound to the target pending account; successful use sets its first credential. Public registration remains unavailable. |
| Setup proof | One successful use; expires 15 minutes after issue. Wrong-target, expired or reused proofs cannot set credentials or activate an account. |
| Password reset | Separate reset Permission/proof; RESET issuance requires exact `loginIdentityId` belonging to the target Account/Organization, with the expected security version and an existing credential in ACTIVE/DISABLED state. No single-login fallback. The 15-minute, one-use proof pins Account/Login Identity/version. Redemption changes only that login's credential, increments Account version and invalidates all old Account sessions/proofs without changing enablement or Actor disablement. Other credentials are unchanged; re-enable remains separate. |
| Setup delivery | Protected synthetic test harness only; no working password or proof in repository, logs or chat. Live delivery and wider recovery policy require separate qualification. |
| Idle session limit | 2 hours since the last eligible activity; enforced by the Server. |
| Absolute session limit | 8 hours from successful sign-in; activity cannot extend it. The earlier deadline wins; at the deadline the session is expired. |
| Revocation | Logout invalidates the current session. Account disablement or password reset invalidates all affected sessions. Re-enable never restores old sessions; fresh sign-in is required. Preserve local candidate files. |
| New password | At least 15 characters; no mandatory character-class mixture. The currently qualified BCrypt path accepts at most 72 UTF-8 bytes, not 72 characters; reject larger input without truncation. This bounded development constraint does not qualify the future live password policy. |
| Failed-login block | For each existing Login Identity, apply a rolling 15-minute failure window using the normalized login lookup; failures exactly 15 minutes old are excluded. Failure five starts a 15-minute block. Attempts during it neither count nor reset/extend the deadline; at `blocked_until` retry is allowed. Successful eligible sign-in clears that login's failure state atomically with session establishment; concurrent updates are atomic. Generic refusal retains equivalent qualified password work even when blocked. This never changes Account.status or identity. |
| Unknown login identifiers | Create zero failure-observation records. Always refuse generically using the qualified dummy-password path; do not create a Login Identity, account or authenticated session. An anonymous servlet session used for CSRF is not an authenticated session. Attempts before an identity exists do not become its failure history if it is subsequently provisioned. This does not qualify a system-wide request-rate control. |
| MFA | Not required for synthetic development accounts; live policy remains unqualified. |
| Web credential lifecycle (T043) | Password exists only transiently in the password control, necessary controlled-input state and request submission. Clear application password control/state after submission and on unmount, including refusal/error paths; do not restore it for a retry. Do not persist/copy it elsewhere or expose it in URL, DOM text, diagnostics, logs, browser localStorage/sessionStorage or retained evidence. CSRF may remain in RAM; page JavaScript cannot read the session cookie. This is a planned qualification obligation, not an executed result. |

**Fast expiry verification**: Check the configured profile values, including 2-hour idle and
8-hour absolute limits, then exercise setup-proof expiry, idle/absolute expiry, failed-login
observation-window and block deadlines immediately before and at/after each boundary using
controllable test time or an explicitly
isolated seconds-based test configuration. Do not wait 2 or 8 real hours, change the host's clock,
or expose a time-control route to clients. HTTP/session and persistence evidence must still use
the actual Server and PostgreSQL; accelerated timing is not a mock-database substitute or an
8-hour soak result. Record the timing method and any test-only settings with the evidence.

---

### User Story 4 - Retain an attributable outcome (Priority: P1; F04)

As the developer qualifying an internal synthetic owner command, I need its result, required Audit and accepted committed event to identify the same operation so that a result is not accepted with missing atomic companions. Audit records outcomes rather than deciding them; this sample is not a supported product/admin command.

**Why this priority**: Traceability and atomicity must exist before file custody is accepted.

**Independent Test**: On actual Server/PostgreSQL, invoke the internal seam with a Server-established eligible Actor/session. Inspect existing sample owner state and required Audit/event; exercise business refusal, forced rollback, concurrent same-ID retry, result-access denial and disable/revoke-before-commit. No new HTTP route or mutable demo entity is needed.

**Acceptance Scenarios**:

1. **Given** an eligible Actor and valid sample command, **When** it commits, **Then** one accepted owner result, its required Audit and committed event retain the original Actor/Organization/correlation with one atomic fate; event retention is not delivery success.
2. **Given** a business-refused sample command, **When** its refusal commits, **Then** one terminal refused owner result and required refusal Audit remain attributable, with no accepted sample state or F04 event.
3. **Given** a proven technical rollback, **When** state is inspected, **Then** no accepted owner result/event or partial required companion survives; retained qualification evidence identifies failure and confirmed rollback, not a fabricated durable FAILED owner result.
4. **Given** a committed accepted/refused operation, **When** concurrent or later same-ID retries occur, **Then** authorized resolution returns the original result/attribution without re-execution or duplicate original Audit/event. A demonstrably rolled-back attempt with no committed result is not completed.
5. **Given** the originating Actor in a fresh eligible session, **When** it resolves the sample result, **Then** the original result is available; another Actor or ineligible proof receives bounded non-disclosing refusal with no original-result mutation or duplicate companions. This does not define future product-query reader policy.
6. **Given** a sample command admitted with eligible proof, **When** account disablement/session revocation commits before the owner commit, **Then** zero accepted sample owner results/events commit. Attribution may remain in the required refusal-evidence transaction; F04 claims no independent mutable product-resource qualification.

---

### User Story 5 - Transfer one file without relaying bytes through the business Server (Priority: P1; F05)

As an authorized client user, I need the Server to grant a bounded transfer to one Gateway/Vault endpoint, and I need the Server to accept file metadata only after the Gateway confirms the stored bytes. A failed or interrupted attempt must not be reported as a completed custody change.

**Why this priority**: This is the PH1 control-plane/data-plane boundary the PG4 decision opened; it also preserves the extension seam for later Vault locations.

**Independent Test**: Transfer the approved synthetic 1 KiB and 64 MiB fixtures from the client through one Gateway to one Vault, verify size and SHA-256 against the retained manifest, inspect the receipt and metadata order, then exercise denial, mismatch and interruption cases. No second location or throughput claim is inferred.

**Acceptance Scenarios**:

1. **Given** an eligible client request, **When** the Server grants a scoped transfer, **Then** the client sends file bytes to the Gateway rather than through the business Server.
2. **Given** a completed Gateway transfer with matching size and digest, **When** the Server verifies the receipt, **Then** the metadata identifies the exact Artifact, Vault and location without using a physical path as document identity.
3. **Given** an expired/incorrect grant, a digest mismatch or an interrupted transfer, **When** confirmation is attempted, **Then** no successful custody metadata is recorded and the candidate is handled by the documented failure/retry path.

**Failure outcomes for this one-endpoint PH1 transfer** (from DOC-06 `DATA-REL-031` and its
exchange rules):

| Situation | Required outcome |
|---|---|
| Wrong, altered, expired or improperly replayed Grant; forged or mismatched Receipt | Refuse that confirmation and record no successful custody. A replacement Grant, if appropriate, requires fresh eligibility/state checks for the same operation. |
| Missing bytes or size/digest mismatch | Keep the candidate private and ineligible for accepted Artifact custody; retain a failure/reconciliation result. Do not treat stored bytes as a verified Artifact. |
| Interrupted transfer or lost response | Query the existing `OperationId`/`TransferId` result and resume only missing verified ranges when still eligible; a renewed Grant keeps the same operation identity. Do not silently start a second operation. |
| Repeated request | The same operation and unchanged input resolves to its existing progress/result. Changed input under the same operation is an input conflict, not another success. |

This table does not select an HTTP status code, Grant lifetime or Gateway runtime/toolchain.

### Edge Cases

- Bootstrap is repeated, attempted without its required authority, or started with an existing administrator.
- The database becomes unavailable before a command commits or after a client loses its response.
- A disabled account or revoked session tries to reuse a previously issued transfer permission.
- A grant is stale, used for the wrong Artifact/operation, or presented at the wrong endpoint.
- The Gateway receives bytes but the Server has not verified a receipt; an orphan candidate must not be described as a committed Artifact.
- Two identical client requests or a lost acknowledgement must not create an untraceable duplicate outcome.
- A physical Vault path changes while logical Artifact/Vault/location identities remain stable.
- A new package, SDK or asset lacks an exact source/version/license intake; its use is blocked until that intake is resolved.
- A Super Administrator attempts account CRUD without its separate Account Administrator assignment, or an ordinary/delegated actor attempts an unauthorized role grant; both are refused without a privilege change.
- A setup proof is used for another account, repeated, expired, or submitted with a password below 15 characters or above 72 UTF-8 bytes; no failed setup activates the account or changes its credential.
- Rejected/unauthenticated traffic must not keep a session alive; eligible activity cannot extend its absolute deadline. A temporary login block must not disable an account or revive an invalidated session when it expires.
- Two Login Identities share an Account: reset either explicitly, refuse missing/foreign/unknown selectors, preserve the other credential, revoke sessions from both, and reject an outstanding sibling proof after the Account version changes.
- Concurrent sign-in failures reach the threshold, an attempt occurs during a block, or failure-window/block expiry occurs exactly at its deadline. Successful session establishment and failure-state clearing must share one atomic fate.
- Many distinct unknown login identifiers are attempted: zero failure-observation records are created. Provisioning a previously unknown identifier starts without inherited failures; each existing Login Identity's state remains bounded independently of traffic volume.
- Concurrent F04 same-ID acceptance/refusal or a rollback-to-refusal handoff cannot create two terminal results or duplicate companions. Another Actor cannot obtain an original result by supplying its OperationId.
- F04 required Audit/event append or deferred commit fails: no partial accepted state; a lost response with unproven commit is not classified as rollback.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001 (F01)**: The PH1 source MUST provide documented, repeatable build and basic-check entry points for its Web, Desktop, Server and test projects; the result of each executed check MUST be retainable.
- **FR-002 (F01)**: Repository configuration MUST contain no working secret; required local values MUST be described without committing credentials.
- **FR-003 (F02)**: A fresh permitted development database MUST be constructible from identifiable, ordered changes, with a recorded bounded rollback check and separate application/database health outcomes.
- **FR-004 (F03)**: Initial administrator creation MUST use a controlled one-time bootstrap path; after completion a repeated request MUST report that initialization is already complete without creating or changing an Actor, account or Role Assignment, and public self-registration MUST NOT be available in PH1.
- **FR-005 (F03)**: A protected request MUST use a verified session associated with one stable Actor; expiry, sign-out, disablement and revocation MUST prevent reuse as an eligible session. F03-B development MUST enforce User Story 3's idle/absolute limits and password-reset revocation rule. Commands MUST revalidate eligibility before their authoritative commit, coordinated with committed disablement/revocation so an invalid command cannot commit. Re-enabling an account MUST require a fresh eligible session; prior invalidated sessions MUST remain invalid.
- **FR-006 (F04)**: A successful internal sample command MUST retain its existing sample owner result, required Audit and accepted committed event with the original correlation/Actor/Organization and one transaction fate; Audit MUST NOT determine or mutate the result. Concurrent/later same-ID retries MUST resolve the committed result without re-execution or duplicate required companions.
- **FR-007 (F04)**: A business-refused sample command MUST retain a terminal attributable owner outcome and required refusal Audit, with no F04 event. Confirmed technical rollback MUST leave no false successful state and retain attributable qualification failure evidence rather than inventing a durable FAILED outcome; an unproven commit MUST NOT be called rollback. Sample-result resolution MUST apply the originating-Actor/current-eligibility policy in the 2026-10-02 clarification, separate from provenance/idempotency and future product reader policy.
- **FR-008 (F05)**: For the approved single-endpoint smoke path, the Server MUST issue only a scoped, time-bounded transfer permission after eligibility checks, and the client MUST send file bytes to the Gateway, not through the business Server.
- **FR-009 (F05)**: The Server MUST record a successful Artifact custody result only after verifying a Gateway receipt for the expected operation, byte count and digest; an unverified candidate MUST remain distinct from committed metadata.
- **FR-010 (F05)**: The custody record MUST preserve stable Artifact, Vault and location identity independently of the Adapter-owned physical storage path, so later multi-Vault work does not require file identity to equal one machine path.
- **FR-011 (F05)**: Wrong, expired, mismatched, interrupted or duplicate transfer attempts MUST follow the failure-outcome table in User Story 5; no attempt may be silently marked successful, and retry/resume MUST retain the existing operation identity unless an explicit new operation is authorized.
- **FR-012 (PH1)**: Before first use, each newly introduced third-party package, SDK, source, asset or runtime MUST have its exact source, version, license and intended use recorded under the repository intake rule. PH1 acceptance MUST NOT claim commercial distribution rights from internal-use evidence alone.
- **FR-013 (F03-A)**: Account CRUD MUST require an independently assigned Account Administrator role at the exact Organization Scope. Assignment MUST pin the Role Definition version, assigner and reason and commit with its Access Policy outcome and Audit. An effective Super Administrator may explicitly self-assign this exact role only through its existing bounded assignment permission; no account type, named Actor or implicit Super privilege may bypass either check. Account creation MUST grant no membership/product authority, disable/re-enable MUST preserve stable identity/history, and required state/outcome/Audit failure MUST roll back the mutation.
- **FR-014 (F03-B development)**: First credential setup for a pending synthetic account MUST follow the target-bound, single-use proof, protected delivery and password rules in User Story 3's development profile. Account creation alone MUST NOT enable sign-in; failed setup MUST NOT activate the account or consume another account's proof. Sign-in MUST enforce the profile's temporary failed-login block for existing Login Identities without permanently disabling the account or replacing its identity. Unknown identifiers MUST create zero failure-observation records while retaining generic refusal and the qualified dummy-password path.

### Key Entities

- **Actor, IDEA Account, Login Identity and Session**: Distinct identity, sign-in and eligibility concepts; an account/login change does not erase the stable Actor.
- **Role Definition version and Role Assignment**: A protected permission set and a separate attributable principal/version/Organization-Scope grant. Super and Account Administrator are independent assignments, not account types.
- **Operation and Audit Evidence**: One attempted command and the attributable record of its outcome, joined by a correlation identity.
- **Owner Committed Event**: An independently identified immutable statement of a committed owner operation, retaining producer, semantic contract version and original Actor/Organization/correlation. No delivery claim follows from its existence.
- **Transfer Grant and Receipt**: Bounded permission for one attempted transfer and Gateway evidence about the resulting candidate bytes; neither alone is a committed Artifact.
- **Artifact, Vault and Location**: Logical file identity and custody location, distinct from the Adapter's physical path. PH1 uses one endpoint and keeps these identities separable for future locations.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001 (F01)**: A clean-checkout reviewer can run all four named project build/check entry points and retain an actual pass/fail result for each, with zero working secrets committed.
- **SC-002 (F02)**: One fresh database can be built from the recorded change set; one supported rollback case and both healthy/unavailable database conditions produce distinguishable recorded outcomes.
- **SC-003 (F03)**: The documented first/repeated bootstrap, first credential setup, exact-login reset, sign-in/out, expiry, disable, revoke and re-enable scenarios each have an executed result; repeated bootstrap creates zero additional privileges and all protected retries with invalidated sessions are refused. Reset tests exercise both choices on a two-login Account: zero unintended sibling credential changes, zero old-session reuse and zero successful missing/foreign/stale targeting. F03-B proves the development profile's setup-proof, idle/absolute and failed-login deadlines through the fast verification method in User Story 3; at/after expiry there are zero successful protected retries, and during a login block there are zero successful sign-ins. Distinct unknown identifiers create zero failure-observation records; observed state for existing identities stays within the bound in the delivery design. Password boundary cases include below/at 15 characters and at/above 72 UTF-8 bytes, including multibyte input; valid length alone does not qualify a credential or live policy. F04 provides the in-flight command test: committed disablement/revocation before the command commit yields zero successful business-state changes. Re-enabled accounts accept fresh eligible sign-in but refuse prior invalidated sessions.
- **SC-004 (F04)**: Retained evidence identifies Actor, Organization, OperationId, correlation and actual outcome: ACCEPTED has exactly one required Audit and one F04 committed event; business REFUSED has one required refusal Audit and zero F04 events; confirmed rollback has zero accepted/partial records. Concurrent/repeated resolution adds zero original-outcome Audit/events; other-Actor/ineligible resolution discloses zero protected original results. The common event store does not impose one-event-per-operation on other producers. Delivery, general product RBAC and real mutable-resource qualification are not claimed.
- **SC-005 (F05)**: Both approved synthetic fixtures (1 KiB and 64 MiB) complete the one-endpoint transfer path with matching size and SHA-256; denied, wrong-digest, interrupted, lost-response and repeated/changed-input attempts produce zero false successful custody results.
- **SC-006 (boundary)**: The F05 review can identify separate Artifact, Vault, location and physical-path fields and demonstrate that one stored file's logical identity does not depend on its Adapter path. This is a seam check, not a second-Vault test.

## Assumptions

- F01–F05 and their 72 planned task hours are the entire PH1 scope authorized by PG4; their task-level split remains in the current planning/Kanban sources.
- P04 supplies a one-developer development environment, not an accepted shared or production deployment. P05 supplies synthetic 1 KiB and 64 MiB fixtures, not large-file or concurrency evidence.
- The selected technology and detailed interface/transaction rules remain in the approved Tech, architecture and data sources. This delivery specification records outcomes and does not choose an alternative stack or transfer protocol.
- F01–F05 produce their own runtime evidence. PH0 documentary PASS and PG4 PASS do not pre-accept any PH1 test.
- Later multi-Vault implementation, operational recovery, Format Worker qualification and commercial clearance require their own scoped decisions and evidence.
- F03-B's numeric authentication profile is limited to synthetic development/testing. Live-company credential delivery, recovery and security-policy qualification remain open under `SPEC-OPEN-06`.

## Governing-Source Trace

This table locates the owner of each delivery requirement. Local `FR-*` numbers are PH1 delivery
checks, **not** new `DOC-04` SRS requirement IDs or new Product Decision Authority approvals. The
[current PH1 roadmap](../../docs/product/instances/idea-engineering/planning/DOC-07-appendix-A-task-breakdown-december-2026.md)
supplies F01–F05 scope and effort. Constitution and agent procedures govern how work is done;
they do not create a product feature.

| PH1 requirement | Card | Governing source and class | Boundary retained |
|---|---|---|---|
| `FR-001/002` | F01 | DOC-07 F01 delivery plan; `REQ-SEC-001` and DOC-05 client boundary for secrets/access | Build evidence belongs to F01; no permanent client credential or physical Vault path. |
| `FR-003` | F02 | DOC-07 F02 delivery plan; DOC-05/06 data ownership and migration design | A development migration/rollback check is not an operational restore claim. |
| `FR-004/005` | F03 | DOC-04 `REQ-IAM-001/002/004/007`; DOC-05 identity boundary | Bootstrap/account/session only; no public registration or implicit document authority. |
| `FR-006/007` | F04 | DOC-04 `REQ-AUD-001/002`; DOC-05 owner/Audit unit of work, `IF-COMMITTED-EVENT`, `ARCH-VIEW-SEQ-004`; DOC-06 Organization ownership; Project Reviewer 2026-10-02 / [ADR-0014](../../docs/adr/0014-retain-owner-committed-event-foundation.md) | Internal sample and retained event only. Audit does not decide the result; bounded result-access/refusal rules are not universal product RBAC/query semantics. |
| `FR-008/009/010/011` | F05 | DOC-04 `REQ-SEC-001/002`, `REQ-OPS-001/006`; DOC-05/06 Artifact transfer/custody interfaces | One Gateway/Vault endpoint now; `REQ-OPS-007/008` multi-location selection, replication and repair remain later implementation and verification work. |
| `FR-012` | PH1-wide | [Constitution principle I](../../.specify/memory/constitution.md) and [external-source intake](../../docs/agents/external-source-intake.md), both repository process controls | Exact license/source review is required before import/use; internal development does not establish commercial distribution rights. |
| `FR-013` | F03-A | DOC-04 `REQ-IAM-002/003/005`, `REQ-AUTH-004/009/010`; DOC-05 `IF-DIRECTORY-ADMIN` / `IF-RBAC-ADMIN`; [ADR-0012](../../docs/adr/0012-use-principal-role-scope-rbac.md); Project Reviewer clarification on 2026-09-30 | Separate scoped grants; bounded Super self-assignment is explicit, not an implicit CRUD bypass. F03-B session/activation evidence and the broader permission catalogue remain owed. |
| `FR-014` and User Story 3 development profile | F03-B | DOC-04 `REQ-IAM-003/004`, `REQ-SEC-001`; DOC-05 identity boundary; Project Reviewer clarification on 2026-09-30 (development-profile decision) | Synthetic accounts only; does not close `SPEC-OPEN-06`, qualify live recovery/delivery or amend the frozen product approvals. |
