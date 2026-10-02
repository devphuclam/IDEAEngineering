# Feature Specification: Human-operated Backend development access

**Feature Branch**: `codex/backend-dev-access`
**Created**: 2026-10-01
**Status**: Draft
**Input**: User-approved manual start/status/stop, persistent synthetic development data, actual Backend access and Swagger; Account Management UI comes later.

| Control | Value |
|---|---|
| Identity / version | `IE-SPK-DEVACCESS-001` / `0.1` |
| Owner / author / reviewer | Engineering / Codex / Project Reviewer Nguyễn Huỳnh Phúc Lâm |
| Authority | User approval on 2026-10-01, including the launcher test boundary; no product gate or release authorization |
| Applicability | Single-developer, non-operational access to accepted F03-B functionality |
| Normativity | Engineering delivery contract only; no new IDEA business permissions or account semantics |
| Classification / retention | INTERNAL; retain with [Work Item #26](https://github.com/devphuclam/IDEAEngineering/issues/26) |
| Baseline / upstream | Accepted F03-B source at `92d9c84ef24b2c3c4c6f01ad1df104e9c28880d0`; [development runbook](../../deploy/development/README.md) |
| Downstream / change | [plan](plan.md), [tasks](tasks.md); new development-support Work Item, not a reopening of Issue #24 |
| Supersession / review trigger | None; change to access route, data scope, artifacts, security or startup lifecycle requires review |
| Evidence | Specification only; implementation/execution status is recorded separately in [launcher results](evidence/launcher-results.md); no whole-feature acceptance implied |

## User Scenarios & Testing

### User Story 1 - Open and control the existing Backend (Priority: P1)

The developer opens the development Backend without reconstructing a test harness and knows its host, port, health and browser address. Development data survives a normal stop/start.

**Why this priority**: The developer currently has no running application to use.

**Independent Test**: Use the human launcher, check actual process/database health, sign in and out with a synthetic account, stop, start again and sign in with the same account.

**Acceptance Scenarios**:

1. **Given** completed controlled provisioning, **When** the developer chooses Start, **Then** readiness is reported only after valid encrypted access and healthy process/database responses; the browser opens the actual application.
2. **Given** an owned running instance, **When** Status is requested, **Then** the developer sees host, port, access address and accurate readiness without any credential values.
3. **Given** that instance, **When** Stop is requested, **Then** only its processes/connections are stopped, no data is removed, and restarting allows a fresh sign-in to the same identity.
4. **Given** a connectivity, certificate, configuration or port failure, **When** Start/Status is requested, **Then** the launcher gives an actionable failure and never reports READY or opens an unrelated application.

### User Story 2 - Inspect and exercise implemented APIs (Priority: P2)

The developer uses interactive API documentation to view the implemented endpoints, request fields, results and refusals against the same isolated instance.

**Why this priority**: Backend-only functions need an observable human interface before administration screens exist.

**Independent Test**: Open the documentation, perform one allowed read and one controlled authenticated mutation, and observe an anonymous or invalid-CSRF refusal.

**Acceptance Scenarios**:

1. **Given** the development documentation is enabled, **When** opened, **Then** it describes actual implemented APIs, including the existing sign-in/sign-out boundaries, without claiming unimplemented operations.
2. **Given** ordinary sign-in, **When** a documented protected operation is tried, **Then** existing session, permissions and request-protection rules apply; a rejected operation is never displayed as success.
3. **Given** documentation is not enabled, **When** its resources are requested, **Then** the development documentation is unavailable; no public operational API console is introduced.

### Edge Cases

- Repeated Start must reuse only a verified owned instance, not create a second Server.
- An occupied local or remote port must not be adopted as the IDEA instance.
- A stale/reused process identifier must not authorize stopping another process.
- Closing the browser does not delete data; Stop is an explicit operation.
- Certificate expiry or loss of trust is a prerequisite failure, never a reason to bypass TLS.
- Missing provisioning is distinguishable from a stopped provisioned instance.
- Swagger availability and the existing proof-delivery limitations must not be represented as Account Management UI completion.

## Requirements

### Functional Requirements

- **FR-001**: The launcher MUST display the development host, port and local browser address on Start and Status.
- **FR-002**: The developer MUST be able to start, inspect and stop the instance manually, without an automatic boot service.
- **FR-003**: Start MUST report READY only after actual encrypted process and database health checks succeed.
- **FR-004**: Stop MUST affect only verified processes/connections owned by this launcher.
- **FR-005**: Normal stop/start MUST retain synthetic data and permit a fresh sign-in to the same identity; it MUST NOT preserve an old authenticated runtime session.
- **FR-006**: The preview MUST use a separately provisioned synthetic database and MUST NOT write company, development-business, retained verification databases or Vault data.
- **FR-007**: Connection, certificate, configuration and port failures MUST produce a failed result without falsely reporting readiness.
- **FR-008**: Passwords, session cookies and credential proofs MUST NOT enter source control, command arguments or retained launcher evidence.
- **FR-009**: Interactive documentation MUST describe implemented operations and allow controlled requests through existing authentication, authorization and request-protection boundaries.
- **FR-010**: Development documentation MUST be disabled unless explicitly enabled for this isolated development instance.
- **FR-011**: New dependencies/tooling MUST receive exact-source intake and appropriate scope authorization before use; an expired F03-B exception MUST NOT be inherited.
- **FR-012**: The handoff MUST explain start/status/stop, addresses, account setup, implemented capabilities and unfinished capabilities.

### Key Entities

- **Development instance**: One identified artifact, isolated data estate and owned runtime; not a production deployment.
- **Launcher ownership record**: Evidence identifying only the started processes and connections; not authentication proof.
- **Synthetic test account**: An actual IDEA identity created through the controlled bootstrap path, without company credentials or implied product authority.

## Success Criteria

- **SC-001**: The developer can open the existing application and see process/data readiness without entering build or remote-start commands.
- **SC-002**: One complete start/sign-in/sign-out/stop/start/fresh-sign-in exercise retains the same identity and leaves unrelated data unchanged.
- **SC-003**: Every exercised connectivity, certificate and port failure reports failure rather than readiness.
- **SC-004**: The developer can inspect implemented API operations, complete an eligible request and see an ineligible request refused using the interactive documentation.
- **SC-005**: Retained source/evidence contains zero working passwords, session-cookie values or credential-proof values.

## Assumptions and scope

- One developer uses the existing Ubuntu host from Windows through an encrypted private access route. Manual launching was approved; auto-start services and firewall changes are excluded.
- P1 can reuse the inspected existing executable without rebuilding. P2 requires separately admitted documentation dependencies and build-tool scope.
- Provisioning administrator authority and interactive initial credential entry are prerequisites; the developer enters secrets locally, never in chat.
- Account Management UI, live proof-delivery qualification, Desktop/Workspace binding, F04/F05 implementation, company data, production/commercial readiness and verifier execution are excluded.
- PR #25 integration, progress publication and effort recording are separate actions. No timer or merge is inferred from approval of this feature.
