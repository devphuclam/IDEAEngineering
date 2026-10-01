# Implementation Plan: PH1 Foundation and Single-Vault Custody

**Branch**: `codex/f03b-authentication-sessions` | **Date**: 2026-10-01 | **Spec**: [PH1 specification v0.6](spec.md)

**Input**: PG4-authorized `IE-INC-PH1-FOUNDATION-CUSTODY-001`, Delivery Cards F01-A through F05-B (72 planned hours).

## Summary

Build the smallest working path through a Web client, Windows Desktop/Workspace, Java Server,
PostgreSQL and one Gateway/Vault. F01 establishes repeatable builds; F02 adds versioned data;
F03 establishes attributable sessions; F04 makes a sample business outcome and Audit atomic;
F05 sends the 1 KiB and 64 MiB synthetic files directly from Client to Gateway and accepts
custody metadata only after a verified receipt. The Server remains the control plane. Artifact,
Vault and Location identifiers never derive from a filesystem path.

The [PG4 record](../004-technical-pilot-readiness/pg4-gate-record.md) authorizes this increment.
The [roadmap cards](../../docs/product/instances/idea-engineering/planning/idea-technical-pilot-kanban-cario.md)
own its order and planned hours. This plan refines implementation; it does not amend DOC-04/05/06,
the selected Tech baseline, or the PG4 decision.

## Technical Context

| Concern | PH1 decision or limit |
|---|---|
| Languages and runtimes | Java 25/Eclipse Temurin 25 for Server; React 19.3/TypeScript 7/Vite 8.3 built with Node.js 24; WPF and per-user Workspace on .NET 10. Exact package patches and resolved graphs require intake before first use. |
| Server framework | Spring Boot 4.1.x and Spring Modulith 2.1.x; Spring Security with ordinary server-side sessions; JDBC/JdbcClient and Boot-managed pgJDBC. Maven Wrapper and Boot BOM control the build. |
| Storage | PostgreSQL 18 for authoritative metadata, Audit and operation state; one filesystem-backed Vault behind Artifact Custody. Flyway versioned SQL is the only schema migration authority. |
| Gateway | Separate Artifact Gateway/Vault boundary is selected. Exact Gateway runtime, toolchain and Adapter profile remain `NOT-RUN`; F05-A must qualify and record them before its implementation. F01-A does not silently choose them. |
| Interfaces | Versioned HTTPS/JSON control API; a scoped Grant and authenticated Receipt cross the Gateway boundary. Client sends bytes to Gateway. Contract details for this increment are in [contracts/ph1-boundaries.md](contracts/ph1-boundaries.md). |
| Development platforms | Ubuntu 26.04 development Server with native PostgreSQL and one Vault; Windows engineering machine for WPF/Workspace. P04 accepts this one-developer environment, not shared deployment. |
| Testing | Build/basic checks for each F01 project; fresh-schema and bounded rollback checks; bootstrap/session denial; atomic command/Audit failure injection; 1 KiB/64 MiB size and SHA-256 plus denied, mismatch and interruption transfers. Retain exact command, source commit, environment and result. |
| Performance and scale | PH1 has no throughput, concurrency, multi-GB or SLA acceptance target. Future multi-GB Artifacts and multi-Vault locations shape the identity and streaming seams only. |
| Security and licensing | No real secret in Git. No public registration, client-authoritative ActorId, direct database/Vault access, or permanent Vault credential. Record exact source/version/license before importing each new package, SDK, runtime or asset. |

## Constitution Check

*Gate: checked before research and again after design.*

| Principle | Plan response | Result |
|---|---|---|
| I. Clean-room product and lawful source intake | Implement only approved IDEA behavior; record exact third-party package and license before use. No competitor code or material enters source. | PASS for plan; dependency intake is an F01 execution prerequisite. |
| II. Controlled documentation before implementation | PG2/PG3 are approved for F01–F05 and PG4 is `COMPLETE/PASS` for this exact successor. | PASS for PH1 scope. |
| III. Traceability and controlled change | Tasks map to F01–F05, local FR/SC and owning DOC-04/05/06 rules. A material product change returns to its owning record. | PASS for plan. |
| IV. Measurable quality and truthful claims | Each story has an executed-result target; planned tests and P04/P05 fixtures do not count as PH1 runtime PASS. | PASS for plan. |
| V. Least privilege and recovery | Identity, Grant, Receipt, candidate and committed custody remain distinct; failure paths refuse false success. Development rollback is not production restore. | PASS for plan. |

Post-design check: [data model](data-model.md), [boundary contract](contracts/ph1-boundaries.md)
and [quickstart](quickstart.md) retain the same scope and claims. No constitutional exception is
requested. `NOT-RUN` qualifications are assigned to explicit tasks rather than treated as PASS.

## Project Structure

### Documentation

```text
specs/005-ph1-foundation-custody/
├── spec.md
├── checklists/
├── plan.md
├── research.md
├── data-model.md
├── contracts/ph1-boundaries.md
├── quickstart.md
└── tasks.md                 # Generated by speckit-tasks
```

### Source code

```text
apps/server/                 # Java Server; owner Modules, REST, health and tests
apps/web/                    # React business UI and its basic checks
apps/desktop/                # Narrow WPF/WebView2 shell
apps/workspace/              # Per-user .NET custody process and tests
apps/gateway/                # Added only after F05 runtime/Adapter qualification
database/migrations/         # Server-owned Flyway versioned SQL
config/                      # Non-secret examples; filled values stay outside Git
deploy/development/          # Existing Ubuntu development runbook
tests/ph1/                   # Cross-boundary smoke and failure procedures
```

**Structure decision**: Preserve the monorepo layout selected in the
[P04 environment profile](../004-technical-pilot-readiness/environment-profile.md#41-planned-monorepo-layout-after-pg4).
`apps/gateway/` is a separate future PH1 F05 deliverable, not a reason to split Git repositories.
The Server owns relational authority; the Gateway owns private byte handling through its Adapter.

## Delivery Order and Evidence

1. **F01-A (8 h)**: create the Web, Server, Desktop, Workspace and test skeletons; record build commands and tool versions. A second clean checkout must build them.
2. **F01-B (8 h)**: add repeatable basic checks, non-secret examples, lockfiles and secret scanning; retain actual check results.
3. **F02 (12 h)**: introduce ordered PostgreSQL migrations and health checks; run fresh migration and bounded rollback/failure checks.
4. **F03-A/B (16 h)**: bootstrap and administer native accounts, then sign in/out and revoke sessions; prove invalid sessions are refused.
5. **F04 (12 h)**: use one shared relational transaction for a sample owner result and Audit Evidence; force failure and verify no partial success.
6. **F05-A/B (16 h)**: qualify the Gateway implementation and exact dependency intake, then issue a scoped Grant, transfer both synthetic fixtures, verify Receipt and commit custody metadata; run refusal and interruption cases.

Each card receives its own actual evidence before the Progress Tracker may mark it complete.
The project user starts/stops its timer explicitly; this plan does not record actual effort.

## F03-B execution refinement

Work Item [#24](https://github.com/devphuclam/IDEAEngineering/issues/24) continues the accepted
F03-A services at `79373e95502474e64dd2a72604c2d9629daa9e36`. PR #23 integration and local
F03-A acceptance notes remain separate; reuse the existing worktree, not another checkout.
The Project Reviewer approved the real HTTP/real PostgreSQL test seam on 2026-09-30.

1. Keep ordinary Spring Security server-side sessions. Add only exact, qualified HTTP Security
   dependencies after pre-use intake; exclude starter-logging so the selected Log4j2 graph does
   not acquire Logback. Do not add JWT, Spring Session JDBC or a custom cookie authenticator.
2. Use a deny-by-default HTTP boundary and the routes in [the contract](contracts/ph1-boundaries.md#f03-b-http-refinement).
   Server establishes ActorContext from authenticated session proof. Account management calls
   the existing scoped permission evaluator and owner transaction, never a named-Super bypass.
3. Retain a verified internal session reference in ActorContext. SessionService checks account
   eligibility/security version, per-session revocation and both deadlines. F04 uses the same
   eligibility seam under the existing security-write coordination lock before owner commit.
   Process restart invalidates sessions; persisted metadata cannot resurrect a container session.
4. Add successor migrations only when their slice needs them; preserve reviewed V1–V3. Separate
   session metadata from credential proofs and temporary failed-login state. Credential setup
   uses target-bound proof authority, not an invented administrative grant for a pending account.
   Material security mutation, IAM outcome and required Audit share one transaction.
5. Use the numeric development profile in spec User Story 3 without repeating a live-policy
   approval. Inject test time at the time boundary; compare immediately before/at/after each
   deadline. Leave the host clock unchanged and never expose a time-control HTTP route.
6. Test one behavior at a time with a real HTTP client and PostgreSQL 18. Migrate a UUID-owned
   temporary schema inside the existing dedicated F03-A test database; never migrate/clean its
   public schema, the F02 database, `idea_ddm_dev` or Vault. A test failure is not a card PASS.
7. Qualify browser cookie/CSRF behavior and the native-client binding before claiming the
   corresponding client path. Same-origin HTTPS, Secure/HttpOnly/SameSite cookies and no
   JavaScript-visible credentials remain the baseline. A loopback HTTP harness must disclose
   its test-only transport/cookie overrides; it cannot qualify HTTPS or Windows protected custody.

Pre/post-design Constitution check: this refinement implements FR-005/014 under the existing
PH1 authority, keeps live policy `SPEC-OPEN-06` open, and retains pre-use intake and truthful
NOT-RUN states. It requests no constitutional exception or new product-gate approval.
The initial anonymous-session tracer and reviewed first-setup/reset checkpoints are retained in
the evidence record. T046 received external PASS WITH NOTES at
`281e46651e774b44a0b2e1c18fe30bd50a1f3151`; see [review receipt](evidence/F03-identity-results.md#22-external-review-of-t046).
The approved unknown-identifier clarification is in spec v0.6. Read-only `speckit-analyze`
preceded the authorized T041 implementation. Its throttling successor is recorded in
[execution evidence](evidence/F03-identity-results.md#24-t041-throttling-checkpoint);
external checkpoint review is the next action, not another clarification or F03-B slice.
F03-B remains IN_PROGRESS; Issue #24 open, verifier NOT-RUN and no merge.

## Complexity Tracking

Approved credential slice order (Project Reviewer, 2026-09-30): explicit Account Administrator
v2 assignment and first setup proof; proof redemption/activation; separate reset and session
invalidation; temporary failed-login block. V5 introduces the v2 seed and first-setup data without
changing V1–V4 or existing assignments. The assignment command supports only the exact seeded
v1/v2 IDs and versions, not arbitrary versions sharing a role code. Permission contents are
owned by spec's clarification. Reset's V6 is committed; preserve V1–V6. The exact-login repair
needs no migration because V6 already pins the Account/Login Identity tuple. Throttling adds
V7 without rewriting these baselines. All v1/F03-A tests remain applicable and unchanged.

First-setup issuance checks session eligibility before permission/scope evaluation and again
under the security-write lock. Rejected requests do not refresh idle activity; accepted owner
activity shares the mutation's transaction. The ordinary scoped role evaluator still supplies
permission authority; redemption uses target-bound proof authority.
The synthetic delivery opt-in is off by default and enabled only in the protected Java HTTP
test harness; no browser/email/live credential delivery is qualified by this slice.

No exception to the Constitution is requested. The separate Gateway process follows the already
approved control/data-plane boundary. Only one Gateway/Vault endpoint is built in PH1.

Reset refinement (2026-09-30): use additive V6 and a separate reset service/Permission. Preserve
V1–V5 and F03-A behavior. An existing-credential target may be ACTIVE or DISABLED; reset changes
neither status nor actor.disabled_at. Its one-use proof captures the current security version;
redemption increments it and revokes all account sessions in the same locked IAM transaction.
Prior proofs are thereby stale. Re-enable stays a separate expected-version operation and never
changes the credential. Test both states and failures through the already-approved HTTP/PostgreSQL
seam, not a new client path. No dependency, Core Product Document or product gate is changed.

External-review repair T046: require `loginIdentityId` on RESET issuance and validate it against
the requested Account, Organization, version, credential and state; never choose a first login
or infer one. Only the pinned login's credential changes. Account-wide version/session invalidation
still applies; other Login Identities retain their credentials for fresh eligible sign-in. Keep
historical T045 and evidence §20 unchanged and append successor evidence.

Throttling design: spec v0.6 owns the rolling-window/deadline semantics. Unknown identifiers
create zero failure-observation records. Existing Login Identities have at most one state record,
five timestamps and one block deadline, evaluated on access; see [state rules](data-model.md#state-and-transaction-rules).
There is no arbitrary-name pool, eviction rule or background cleanup requirement. Controlled time
tests cover immediately before, exactly at and after window/block boundaries. The
[qualification contract](contracts/ph1-boundaries.md#throttling-qualification-contract-planned)
requires concurrent updates, successful clearing, fault rollback and equivalent blocked password
work through real HTTP/PostgreSQL. See §24 of the evidence record for execution and its limits.

### Planned sign-in transaction integration

At the pre-throttling head `281e46651e774b44a0b2e1c18fe30bd50a1f3151`, the provider committed
`SessionService.signIn` before ordinary Spring session fixation and SecurityContext persistence.
Its refusal exception also rolled back the current transaction.
Consequently, simply adding counters/clearing inside that method would not meet the approved
failure persistence and success/session atomicity contract. [R8](research.md#r8--sign-in-needs-a-transaction-aware-framework-boundary)
records the pinned framework sequence and the planned integration:

1. Resolve an existing Login Identity by normalized login independently of Account eligibility.
   Unknown identifiers perform qualified dummy verification and generic refusal without state.
   Existing identities use the shared security-write lock; recheck eligibility under that lock.
2. For a refused known-login attempt outside an active block, prune expired timestamps, append
   the failure and set the fifth-failure deadline in one bounded PostgreSQL transaction. Commit
   that failure state before returning the generic refusal; do not throw through a rollback-only
   success path. An active block retains its deadline and observations unchanged. All refused
   valid-length paths, including blocked paths, retain equivalent qualified password work.
3. For eligible credentials, stage the session row, current-login failure-state clearing, IAM
   outcome and Audit in one still-uncommitted transaction. A request-scoped completion object
   owns the JDBC resources; never place a live connection/transaction in a principal or HttpSession.
4. Use a narrow integration around the ordinary Spring form-authentication filter, retaining its
   fixation, CSRF and SecurityContext mechanisms. After fixation/context persistence, verify the
   actual servlet session contains the expected authenticated identity, then commit PostgreSQL
   before publishing HTTP success. A success handler alone is insufficient: earlier binding may
   fail or silently omit persistence. Abort/rollback in every unsuccessful exit and clear/invalidate
   tentative authentication. Do not add a custom cookie parser, JWT or session store.
5. Servlet state and PostgreSQL are not an XA transaction. Provisional container proof remains
   ineligible without its committed database session row; controlled binding/required-write faults
   must leave no eligible proof and preserve prior failure state. A lost network response after a
   valid commit is not a rollback claim. Verify this boundary before claiming sign-in atomicity.

Implement these steps in vertical RED → GREEN cases, not as a prewritten full test suite. Start
with unknown/known state bounds, then rolling-window/deadline behavior, concurrent failures and
finally success/binding fault fate. Preserve the existing F03-A, setup/reset, CSRF/fixation,
session deadlines and health regressions. If the qualified framework seam cannot meet the
contract, report it before weakening the required oracle or changing authentication mechanisms.

T043 client qualification order is: agree the actual client seam → define failing tests/evidence
contract → implement if needed → execute real Web/Desktop and retain platform evidence. Java
HTTP evidence is not client qualification; unexecuted paths remain NOT-RUN/BLOCKED.
