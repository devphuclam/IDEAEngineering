# Feature Specification: PH1 Foundation and Single-Vault Custody

**Feature Branch**: `codex/ph1-foundation-f01`
**Created**: 2026-09-25
**Version / owner**: `0.3` / Principal Product Author
**Status**: Draft — delivery specification for the PG4-authorized PH1 increment, not a new Product Decision Authority approval
**Increment**: `IE-INC-PH1-FOUNDATION-CUSTODY-001`
**Classification / verification**: `INTERNAL` / PH1 application results `NOT-RUN`
**Input**: Deliver only F01–F05 of the approved roadmap (72 planned task hours): a buildable application foundation, controlled data and account foundations, attributable business outcomes, and one direct Client-to-Gateway-to-Vault transfer smoke path.

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
| Setup delivery | Protected synthetic test harness only; no working password or proof in repository, logs or chat. Live delivery and wider recovery policy require separate qualification. |
| Idle session limit | 2 hours since the last eligible activity; enforced by the Server. |
| Absolute session limit | 8 hours from successful sign-in; activity cannot extend it. The earlier deadline wins; at the deadline the session is expired. |
| Revocation | Logout invalidates the current session. Account disablement or password reset invalidates all affected sessions. Re-enable never restores old sessions; fresh sign-in is required. Preserve local candidate files. |
| New password | At least 15 characters; no mandatory character-class mixture. The currently qualified BCrypt path accepts at most 72 UTF-8 bytes, not 72 characters; reject larger input without truncation. This bounded development constraint does not qualify the future live password policy. |
| Failed-login block | Five failed sign-ins for the same login within a 15-minute observation window start a 15-minute block. No credential attempt can authenticate during the block. This is temporary login throttling, not account disablement or identity replacement. |
| MFA | Not required for synthetic development accounts; live policy remains unqualified. |

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

As an operator reviewing an authorized command, I need its business result and Audit evidence to identify the same operation so that a result is not accepted without an attributable record. Audit records must report outcomes, not decide them.

**Why this priority**: Traceability and atomicity must exist before file custody is accepted.

**Independent Test**: Execute one allowed and one refused sample command, inspect the resulting business state and Audit evidence, then force a failure at the recorded transaction boundary and check for a partial outcome.

**Acceptance Scenarios**:

1. **Given** an eligible Actor and valid sample command, **When** the command succeeds, **Then** its business outcome and Audit evidence share a correlation identifier and neither is missing.
2. **Given** a refused sample command, **When** it is evaluated, **Then** the refusal remains attributable without the requested business-state change.
3. **Given** a transaction failure before completion, **When** the result is inspected, **Then** no successful business outcome exists without its required Audit evidence.

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

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001 (F01)**: The PH1 source MUST provide documented, repeatable build and basic-check entry points for its Web, Desktop, Server and test projects; the result of each executed check MUST be retainable.
- **FR-002 (F01)**: Repository configuration MUST contain no working secret; required local values MUST be described without committing credentials.
- **FR-003 (F02)**: A fresh permitted development database MUST be constructible from identifiable, ordered changes, with a recorded bounded rollback check and separate application/database health outcomes.
- **FR-004 (F03)**: Initial administrator creation MUST use a controlled one-time bootstrap path; after completion a repeated request MUST report that initialization is already complete without creating or changing an Actor, account or Role Assignment, and public self-registration MUST NOT be available in PH1.
- **FR-005 (F03)**: A protected request MUST use a verified session associated with one stable Actor; expiry, sign-out, disablement and revocation MUST prevent reuse as an eligible session. F03-B development MUST enforce User Story 3's idle/absolute limits and password-reset revocation rule. Commands MUST revalidate eligibility before their authoritative commit, coordinated with committed disablement/revocation so an invalid command cannot commit. Re-enabling an account MUST require a fresh eligible session; prior invalidated sessions MUST remain invalid.
- **FR-006 (F04)**: A successful sample business command MUST retain its business result and required Audit evidence with the same correlation identity; Audit evidence MUST NOT determine or mutate that result.
- **FR-007 (F04)**: A refused or failed sample command MUST have an attributable refusal/failure result without a false successful business-state change.
- **FR-008 (F05)**: For the approved single-endpoint smoke path, the Server MUST issue only a scoped, time-bounded transfer permission after eligibility checks, and the client MUST send file bytes to the Gateway, not through the business Server.
- **FR-009 (F05)**: The Server MUST record a successful Artifact custody result only after verifying a Gateway receipt for the expected operation, byte count and digest; an unverified candidate MUST remain distinct from committed metadata.
- **FR-010 (F05)**: The custody record MUST preserve stable Artifact, Vault and location identity independently of the Adapter-owned physical storage path, so later multi-Vault work does not require file identity to equal one machine path.
- **FR-011 (F05)**: Wrong, expired, mismatched, interrupted or duplicate transfer attempts MUST follow the failure-outcome table in User Story 5; no attempt may be silently marked successful, and retry/resume MUST retain the existing operation identity unless an explicit new operation is authorized.
- **FR-012 (PH1)**: Before first use, each newly introduced third-party package, SDK, source, asset or runtime MUST have its exact source, version, license and intended use recorded under the repository intake rule. PH1 acceptance MUST NOT claim commercial distribution rights from internal-use evidence alone.
- **FR-013 (F03-A)**: Account CRUD MUST require an independently assigned Account Administrator role at the exact Organization Scope. Assignment MUST pin the Role Definition version, assigner and reason and commit with its Access Policy outcome and Audit. An effective Super Administrator may explicitly self-assign this exact role only through its existing bounded assignment permission; no account type, named Actor or implicit Super privilege may bypass either check. Account creation MUST grant no membership/product authority, disable/re-enable MUST preserve stable identity/history, and required state/outcome/Audit failure MUST roll back the mutation.
- **FR-014 (F03-B development)**: First credential setup for a pending synthetic account MUST follow the target-bound, single-use proof, protected delivery and password rules in User Story 3's development profile. Account creation alone MUST NOT enable sign-in; failed setup MUST NOT activate the account or consume another account's proof. Sign-in MUST enforce the profile's temporary failed-login block without permanently disabling the account or replacing its identity.

### Key Entities

- **Actor, IDEA Account, Login Identity and Session**: Distinct identity, sign-in and eligibility concepts; an account/login change does not erase the stable Actor.
- **Role Definition version and Role Assignment**: A protected permission set and a separate attributable principal/version/Organization-Scope grant. Super and Account Administrator are independent assignments, not account types.
- **Operation and Audit Evidence**: One attempted command and the attributable record of its outcome, joined by a correlation identity.
- **Transfer Grant and Receipt**: Bounded permission for one attempted transfer and Gateway evidence about the resulting candidate bytes; neither alone is a committed Artifact.
- **Artifact, Vault and Location**: Logical file identity and custody location, distinct from the Adapter's physical path. PH1 uses one endpoint and keeps these identities separable for future locations.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001 (F01)**: A clean-checkout reviewer can run all four named project build/check entry points and retain an actual pass/fail result for each, with zero working secrets committed.
- **SC-002 (F02)**: One fresh database can be built from the recorded change set; one supported rollback case and both healthy/unavailable database conditions produce distinguishable recorded outcomes.
- **SC-003 (F03)**: The documented first/repeated bootstrap, first credential setup, sign-in/out, expiry, disable, revoke and re-enable scenarios each have an executed result; repeated bootstrap creates zero additional privileges and all protected retries with invalidated sessions are refused. F03-B proves the development profile's setup-proof, idle/absolute and failed-login deadlines through the fast verification method in User Story 3; at/after expiry there are zero successful protected retries, and during a login block there are zero successful sign-ins. Password boundary cases include below/at 15 characters and at/above 72 UTF-8 bytes, including multibyte input; valid length alone does not qualify a credential or live policy. F04 provides the in-flight command test: committed disablement/revocation before the command commit yields zero successful business-state changes. Re-enabled accounts accept fresh eligible sign-in but refuse prior invalidated sessions.
- **SC-004 (F04)**: For the allowed, refused and forced-failure sample commands, the retained evidence identifies the Actor, correlation identity and actual outcome; zero successful results lack their required Audit evidence.
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
| `FR-006/007` | F04 | DOC-04 `REQ-AUD-001/002`; DOC-05 owner/Audit transaction boundary | Audit records but does not decide the business outcome. |
| `FR-008/009/010/011` | F05 | DOC-04 `REQ-SEC-001/002`, `REQ-OPS-001/006`; DOC-05/06 Artifact transfer/custody interfaces | One Gateway/Vault endpoint now; `REQ-OPS-007/008` multi-location selection, replication and repair remain later implementation and verification work. |
| `FR-012` | PH1-wide | [Constitution principle I](../../.specify/memory/constitution.md) and [external-source intake](../../docs/agents/external-source-intake.md), both repository process controls | Exact license/source review is required before import/use; internal development does not establish commercial distribution rights. |
| `FR-013` | F03-A | DOC-04 `REQ-IAM-002/003/005`, `REQ-AUTH-004/009/010`; DOC-05 `IF-DIRECTORY-ADMIN` / `IF-RBAC-ADMIN`; [ADR-0012](../../docs/adr/0012-use-principal-role-scope-rbac.md); Project Reviewer clarification on 2026-09-30 | Separate scoped grants; bounded Super self-assignment is explicit, not an implicit CRUD bypass. F03-B session/activation evidence and the broader permission catalogue remain owed. |
| `FR-014` and User Story 3 development profile | F03-B | DOC-04 `REQ-IAM-003/004`, `REQ-SEC-001`; DOC-05 identity boundary; Project Reviewer clarification on 2026-09-30 (development-profile decision) | Synthetic accounts only; does not close `SPEC-OPEN-06`, qualify live recovery/delivery or amend the frozen product approvals. |
