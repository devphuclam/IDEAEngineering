# PH1 implementation decision trace

**Status**: Draft delivery planning, 2026-09-28. This note reuses the approved IDEA source set;
it reports no new DDM/Aras observation, product requirement, technology selection or runtime PASS.
The [PG4 record](../004-technical-pilot-readiness/pg4-gate-record.md) limits it to F01–F05.

## R1 — One repository and two development platforms

**Decision**: Keep Web, Server, Desktop, Workspace and tests in the existing monorepo. Build
Server/Web on the prepared Ubuntu development host and Desktop/Workspace on Windows from the
same source commit.

**Rationale**: [P04](../004-technical-pilot-readiness/environment-profile.md#41-planned-monorepo-layout-after-pg4)
selected this source layout and identified the installed runtimes. One developer can coordinate
API, migration and client changes without cross-repository version drift.

**Alternative considered**: Three application repositories. Deferred until separate owners,
release schedules, access rules or measured repository cost justify a split.

## R2 — Server, Web and Windows client stack

**Decision**: Use the selected Java 25/Temurin, Spring Boot 4.1.x/Modulith 2.1.x, PostgreSQL 18,
React 19.3/TypeScript 7/Vite 8.3 with Node 24, WPF/WebView2 and .NET 10 Workspace families.
Pin exact packages, transitive graph and tool versions through intake and build evidence before
first use. The approved Node 24 build family does not select a Node production Server.

**Rationale**: [TECH-001](../../docs/product/instances/idea-engineering/decision-briefs/TECH-001-technology-and-architecture-proposal.md)
and the [technology matrix](../../docs/product/knowledge/2026-09-13-core-v0-technology-decision-matrix.md)
record the Engineering selection and qualification limits. PH1 does not reopen Q-15 or the Tech
baseline.

**Alternative considered**: Flutter or .NET Server. They remain evaluated alternatives under
the existing reopen rules, not parallel PH1 implementations.

## R3 — Relational authority and external bytes

**Decision**: Owner state, owner outcome, Audit and required outbox record share a PostgreSQL
transaction. Artifact bytes remain private outside that transaction. The Server validates a
Gateway Receipt before custody metadata can become successful. A staged file is not a published
document or committed Artifact reference.

**Rationale**: [DOC-05 §5](../../docs/product/instances/idea-engineering/DOC-05-architecture-description.md#5-module-decomposition-and-authority)
assigns state ownership. [DOC-06](../../docs/product/instances/idea-engineering/DOC-06-data-integration-and-migration-specification.md)
distinguishes Artifact, Location, Transfer, Grant, Receipt and Audit. This maintains one
authoritative owner per state and makes interrupted transfer recoverable without false success.

**Alternative considered**: Streaming full file bytes through the business Server or treating
Gateway upload completion as product publication. Neither matches the approved boundary.

## R4 — One Vault now and an extension seam

**Decision**: F05 uses one filesystem-backed Vault location. Persist stable `ArtifactId`,
`VaultId`/Vault Endpoint identity, `LocationId`, size and digest independently from the Adapter's
opaque storage key. The Gateway owns physical path construction.

**Rationale**: [PG4](../004-technical-pilot-readiness/pg4-gate-record.md#exact-authorization)
authorizes one endpoint and requires a later multi-Vault extension path. The [F05 scenario](spec.md#user-story-5---transfer-one-file-without-relaying-bytes-through-the-business-server-priority-p1-f05)
checks the identity boundary with two synthetic fixtures.

**Alternative considered**: Implementing selection, replication, repair and failover now. These
belong to later increments and have no PH1 acceptance evidence.

## R5 — Qualification still owed

**Decision**: F01-A/B must record exact dependency source/version/license and build toolchain
before importing packages. F05-A must record the exact Gateway runtime, Adapter profile, API
compatibility, transfer security and operating environment before Gateway implementation. The
Format Worker runtime/toolchain is outside PH1.

**Rationale**: [external-source intake](../../docs/agents/external-source-intake.md) requires a
disposition before import. [P03 D1](../004-technical-pilot-readiness/readiness-register.md)
explicitly moves Gateway runtime qualification into F05. Planned checks remain `NOT-RUN` until
executed against the exact source and environment.

**Alternative considered**: Assigning a Gateway runtime from the Server stack without
qualification. That would turn an open implementation choice into an unrecorded Tech decision.

## R6 — F03-B HTTP identity and accelerated deadline checks

**Decision**: Reuse the ordinary Spring Security session selection from
[TECH-001](../../docs/product/instances/idea-engineering/decision-briefs/TECH-001-technology-and-architecture-proposal.md)
and the account/session/security-mutation sequence `ARCH-VIEW-SEQ-008` in
[DOC-05](../../docs/product/instances/idea-engineering/DOC-05-architecture-description.md).
The 2026-09-30 synthetic policy and its exact thresholds belong to [spec User Story 3](spec.md),
not this research note. HTTP Security exact-package intake is separate from the crypto-only
[F03-A intake](../../docs/research/2026-09-30-ph1-f03a-security-crypto-intake.md).

**Rationale**: Existing account security_version rejects account-wide invalidation but cannot
alone identify one-session logout or expiry at owner commit. Carry a verified session reference
and revalidate it with current IAM state. Track last eligible activity explicitly so rejected
requests cannot extend idle eligibility. Controlled test time proves deadline behavior without
hours of sleep; the test still runs the actual Server and PostgreSQL.

**Alternatives considered**: JWT, persistence that silently restores sessions after restart,
mock/H2 integration evidence, changing the host clock, or waiting two/eight hours. These do not
deliver the selected boundary or the approved fast test method. Browser TLS/cookie and native
binding/protected-storage qualifications remain explicit execution work, not assumed PASS.
