# Feature Specification: PH1 Foundation and Single-Vault Custody

**Feature Branch**: `codex/p07-gate-readiness`
**Created**: 2026-09-25
**Version / owner**: `0.1` / Principal Product Author
**Status**: Draft — delivery specification for the PG4-authorized PH1 increment, not a new Product Decision Authority approval
**Increment**: `IE-INC-PH1-FOUNDATION-CUSTODY-001`
**Classification / verification**: `INTERNAL` / PH1 application results `NOT-RUN`
**Input**: Deliver only F01–F05 of the approved roadmap (72 planned task hours): a buildable application foundation, controlled data and account foundations, attributable business outcomes, and one direct Client-to-Gateway-to-Vault transfer smoke path.

## Authority and Scope Boundary

The [PG4 decision](../004-technical-pilot-readiness/pg4-gate-record.md) authorizes this exact PH1 increment. The [frozen PH0 manifest](../004-technical-pilot-readiness/baseline-manifest.md) and [PG2/PG3 approval report](../../docs/product/instances/idea-engineering/registers/CHG-2026-09-25-pg2-pg3-approval.md) identify the controlling product sources. This Spec Kit file organizes delivery and acceptance of their F01–F05 subset; it does not introduce a new Feature, alter a `REQ-*` obligation, select another Tech Stack, or approve the wider Core v0 scope. If a statement here conflicts with a controlled product requirement or architecture decision, stop and resolve the conflict through the owning source.

PH1 implements **one Gateway/Vault endpoint** and retains the approved separation between file identity and physical storage location. It must leave the Vault identity/location and Adapter boundary usable by a later multi-Vault increment. PH1 does **not** implement or claim a second Vault, replication, repair, failover, a Format Worker job, CAD/Office conversion, Logical Document lifecycle, Checkout/Check-in, Review/Release, multi-GB performance, production recovery, shared rollout or commercial readiness.

The user’s PG4 decision authorizes implementation but is not evidence that any PH1 application test has passed. Each F01–F05 completion result requires its own executed test and retained evidence. Starting the F01-A effort timer remains a separate Tracker action.

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

**Acceptance Scenarios**:

1. **Given** a new installation with no initial administrator, **When** the controlled bootstrap is executed, **Then** one attributable administrator account becomes available without opening public registration.
2. **Given** an active native account, **When** its credentials are verified, **Then** the resulting session is associated with its stable Actor; the client cannot choose another Actor for a protected request.
3. **Given** a signed-out, disabled or revoked session, **When** it is reused, **Then** the protected request is refused.

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

### Edge Cases

- Bootstrap is repeated, attempted without its required authority, or started with an existing administrator.
- The database becomes unavailable before a command commits or after a client loses its response.
- A disabled account or revoked session tries to reuse a previously issued transfer permission.
- A grant is stale, used for the wrong Artifact/operation, or presented at the wrong endpoint.
- The Gateway receives bytes but the Server has not verified a receipt; an orphan candidate must not be described as a committed Artifact.
- Two identical client requests or a lost acknowledgement must not create an untraceable duplicate outcome.
- A physical Vault path changes while logical Artifact/Vault/location identities remain stable.
- A new package, SDK or asset lacks an exact source/version/license intake; its use is blocked until that intake is resolved.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001 (F01)**: The PH1 source MUST provide documented, repeatable build and basic-check entry points for its Web, Desktop, Server and test projects; the result of each executed check MUST be retainable.
- **FR-002 (F01)**: Repository configuration MUST contain no working secret; required local values MUST be described without committing credentials.
- **FR-003 (F02)**: A fresh permitted development database MUST be constructible from identifiable, ordered changes, with a recorded bounded rollback check and separate application/database health outcomes.
- **FR-004 (F03)**: Initial administrator creation MUST use a controlled bootstrap path; public self-registration MUST NOT be available in PH1.
- **FR-005 (F03)**: A protected request MUST use a verified session associated with one stable Actor; sign-out, disablement and revocation MUST prevent reuse as an eligible session.
- **FR-006 (F04)**: A successful sample business command MUST retain its business result and required Audit evidence with the same correlation identity; Audit evidence MUST NOT determine or mutate that result.
- **FR-007 (F04)**: A refused or failed sample command MUST have an attributable refusal/failure result without a false successful business-state change.
- **FR-008 (F05)**: For the approved single-endpoint smoke path, the Server MUST issue only a scoped, time-bounded transfer permission after eligibility checks, and the client MUST send file bytes to the Gateway, not through the business Server.
- **FR-009 (F05)**: The Server MUST record a successful Artifact custody result only after verifying a Gateway receipt for the expected operation, byte count and digest; an unverified candidate MUST remain distinct from committed metadata.
- **FR-010 (F05)**: The custody record MUST preserve stable Artifact, Vault and location identity independently of the Adapter-owned physical storage path, so later multi-Vault work does not require file identity to equal one machine path.
- **FR-011 (F05)**: Wrong, expired, mismatched, interrupted or duplicate transfer attempts MUST have a defined refusal, retry or reconciliation outcome; no attempt may be silently marked successful.
- **FR-012 (PH1)**: Before first use, each newly introduced third-party package, SDK, source, asset or runtime MUST have its exact source, version, license and intended use recorded under the repository intake rule. PH1 acceptance MUST NOT claim commercial distribution rights from internal-use evidence alone.

### Key Entities

- **Actor, IDEA Account, Login Identity and Session**: Distinct identity, sign-in and eligibility concepts; an account/login change does not erase the stable Actor.
- **Operation and Audit Evidence**: One attempted command and the attributable record of its outcome, joined by a correlation identity.
- **Transfer Grant and Receipt**: Bounded permission for one attempted transfer and Gateway evidence about the resulting candidate bytes; neither alone is a committed Artifact.
- **Artifact, Vault and Location**: Logical file identity and custody location, distinct from the Adapter's physical path. PH1 uses one endpoint and keeps these identities separable for future locations.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001 (F01)**: A clean-checkout reviewer can run all four named project build/check entry points and retain an actual pass/fail result for each, with zero working secrets committed.
- **SC-002 (F02)**: One fresh database can be built from the recorded change set; one supported rollback case and both healthy/unavailable database conditions produce distinguishable recorded outcomes.
- **SC-003 (F03)**: The documented bootstrap, sign-in, sign-out, disable and revocation scenarios each have an executed result; all protected retries with invalidated sessions are refused.
- **SC-004 (F04)**: For the allowed, refused and forced-failure sample commands, the retained evidence identifies the Actor, correlation identity and actual outcome; zero successful results lack their required Audit evidence.
- **SC-005 (F05)**: Both approved synthetic fixtures (1 KiB and 64 MiB) complete the one-endpoint transfer path with matching size and SHA-256; denied, wrong-digest and interrupted attempts produce zero false successful custody results.
- **SC-006 (boundary)**: The F05 review can identify separate Artifact, Vault, location and physical-path fields and demonstrate that one stored file's logical identity does not depend on its Adapter path. This is a seam check, not a second-Vault test.

## Assumptions

- F01–F05 and their 72 planned task hours are the entire PH1 scope authorized by PG4; their task-level split remains in the current planning/Kanban sources.
- P04 supplies a one-developer development environment, not an accepted shared or production deployment. P05 supplies synthetic 1 KiB and 64 MiB fixtures, not large-file or concurrency evidence.
- The selected technology and detailed interface/transaction rules remain in the approved Tech, architecture and data sources. This delivery specification records outcomes and does not choose an alternative stack or transfer protocol.
- F01–F05 produce their own runtime evidence. PH0 documentary PASS and PG4 PASS do not pre-accept any PH1 test.
- Later multi-Vault implementation, operational recovery, Format Worker qualification and commercial clearance require their own scoped decisions and evidence.

## Approved-Source Trace

This table locates the owning sources; local `FR-*` numbers above are delivery checks, not new
`DOC-04` requirement IDs. The [current PH1 roadmap](../../docs/product/instances/idea-engineering/planning/DOC-07-appendix-A-task-breakdown-december-2026.md) supplies F01–F05 scope and effort.

| PH1 card | Approved-source connection | Boundary retained |
|---|---|---|
| F01 | `REQ-SEC-001`; DOC-05 application/client boundary | No permanent client-side credential or physical Vault path. |
| F02 | DOC-07 F02; DOC-05/06 data ownership and migration design | A development migration/rollback check is not an operational restore claim. |
| F03 | `REQ-IAM-001/002/004/007`; DOC-05 identity boundary | Bootstrap/account/session only; no public registration or implicit document authority. |
| F04 | `REQ-AUD-001/002`; DOC-05 owner/Audit transaction boundary | Audit records but does not decide the business outcome. |
| F05 | `REQ-SEC-001/002`, `REQ-OPS-001/006`; DOC-05 Artifact transfer/custody interfaces | One Gateway/Vault endpoint now; `REQ-OPS-007/008` multi-location selection, replication and repair remain later implementation and verification work. |
