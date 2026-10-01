# Implementation Plan: PH1 Foundation and Single-Vault Custody

**Branch**: `codex/f03b-authentication-sessions` | **Date**: 2026-10-01 | **Spec**: [PH1 specification v0.7](spec.md)

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
   public schema, the historical F02 database, `idea_ddm_dev` or Vault. The separately authorized
   T044 fresh-public run uses a completely new test database under the closure procedure below.
   A test failure is not a card PASS.
7. Qualify browser cookie/CSRF behavior and the native-client binding before claiming the
   corresponding client path. Retain same-origin HTTPS and Secure/HttpOnly/SameSite cookies;
   page JavaScript must never read the session cookie. Web password entry/submission may use
   transient controlled-input state, cleared after submission and on unmount even on refusal/error.
   Do not persist/copy the password elsewhere or expose it in URL, DOM text, diagnostics, logs,
   browser storage or retained evidence. CSRF may remain in RAM. This follows spec's 2026-10-01
   Web clarification; the separate Desktop/WebView2 custody boundary is unchanged. The Project
   Reviewer approved the [T043 Web contract](contracts/ph1-boundaries.md#t043-web-qualification-contract)
   on 2026-10-01, with environment prerequisites below. A loopback HTTP harness must disclose its
   test-only transport/cookie overrides; it cannot qualify HTTPS or Windows protected custody.

Pre/post-design Constitution check: this refinement implements FR-005/014 under the existing
PH1 authority, keeps live policy `SPEC-OPEN-06` open, and retains pre-use intake and truthful
NOT-RUN states. It requests no constitutional exception or new product-gate approval.
The initial anonymous-session tracer and reviewed first-setup/reset checkpoints are retained in
the evidence record. T046 received external PASS WITH NOTES at
`281e46651e774b44a0b2e1c18fe30bd50a1f3151`; see [review receipt](evidence/F03-identity-results.md#22-external-review-of-t046).
The approved unknown-identifier clarification is in spec v0.6. Read-only `speckit-analyze`
preceded the authorized T041 implementation. Its throttling successor is recorded in
[execution evidence](evidence/F03-identity-results.md#24-t041-throttling-checkpoint);
external PASS WITH NOTES at `74c2d3dbeabc38bc292f22220e358aaa5e0f46d3` is recorded in
[§25](evidence/F03-identity-results.md#25-external-review-of-t041). The authorized HTTP account
create/disable/re-enable successor ran from `a0874f40555f1119b830f043a7aaf5bda8752d8a`;
[§26](evidence/F03-identity-results.md#26-http-account-administration-checkpoint) retains 98
scoped checks, including normalized-login and zero-login Account repairs. It uses read-only
eligibility at admission and under the security-write lock;
accepted activity shares the owner mutation's transaction. Client ActorId is never authority.
External PASS WITH NOTES at `171173a5266fa5c9a732f2fe1316fb1c5c0f836d` is received in
[§27](evidence/F03-identity-results.md#27-external-review-of-http-account-administration).
The Project Reviewer authorized test-process restart qualification next. Use
`ServerRestartFlowTest` with two real child JVMs at the same loopback endpoint and the same
test-owned UUID schema. Qualify retained metadata, old-cookie refusal, fresh sign-in with a
new runtime ID, pre-revoked/idle-expired refusal and durable throttle continuity. Keep the
existing detailed expiry/logout/reset/re-enable tests; add no production mechanism unless
qualification exposes a gap. A first GREEN is qualification of existing behavior, not a
fabricated RED → GREEN. Exact execution and review are in
[§28](evidence/F03-identity-results.md#28-server-restart-and-session-continuity-qualification).
The Project Reviewer relayed external PASS WITH NOTES for the restart slice and then authorized
T043 Web first; preserve the historical execution and its private-log review limitation.
F03-B remains IN_PROGRESS; Issue #24 open, verifier NOT-RUN and no merge.

### T043 Web implementation order (approved 2026-10-01)

Use the actual `apps/web` React CSR build served by the actual IDEA Server, matching the selected
Tech baseline. Packaging/copying `apps/web/dist` into Server static resources and narrowly public
GET shell/assets are part of this slice; a test-only HTML page or separate static server is not.
API authority remains deny-by-default. Do not add a general API or SPA fallback that hides refusals.

Before the first RED, qualify normally trusted test HTTPS and the browser/tooling prerequisites
in the [contract](contracts/ph1-boundaries.md#t043-web-qualification-contract). Direct Server TLS
on an isolated high port is a test fixture, not evidence for the selected managed deployment.
The operator authorized the Windows current-user certificate store on 2026-10-01; present the
exact certificate fingerprint before trust. Leave machine-wide stores unchanged.

Use installed branded Chrome. Playwright is optional: exact version, transitive license/provenance
intake and an internal/approved package source must precede use. Do not install packages from
the Internet or download Chromium. If automation is unavailable, retain BLOCKED for automation
and use the approved manual actual-Chrome procedure; missing TLS trust blocks browser execution.

Run vertical slices: same-origin shell/assets → CSRF → login/protected-session UI → logout/refusal
→ observed cookie/security properties → invalidated-session UI. Each first RED must expose missing
actual Web behavior/integration, not a certificate or package failure. Qualify previously correct
Server behavior without inventing a RED or changing it unnecessarily. Retain exact Web/Server
source and artifacts per checkpoint. Web W01–W10 subsequently received external PASS WITH NOTES;
its portion of T043 is SATISFIED. Desktop/Workspace binding belongs to a successor Work Item,
not the F03-B closure boundary. The historical combined T043 marker remains unchecked.

### F03-B scope reconciliation and closure (approved 2026-10-01)

Issue #24 explicitly separates Desktop binding qualification. The Project Reviewer accepted
Web W01–W10 and approved reconciling delivery records with that authority. This changes delivery
wording, not the selected WPF/WebView2/Workspace architecture or a frozen product requirement.
Desktop qualification remains NOT-RUN for a successor Work Item; its exact binding/custody
semantics require an agreed seam/test contract after F03-B closure. No successor is created or
implemented by this reconciliation, and no new feature checkpoint or card hours are added.

Follow the [closure matrix](evidence/F03-B-closure-matrix.md) in order: scope reconciliation →
T040 coverage → T042 coverage → resolve a demonstrated requirement gap, if any → fresh isolated
V1–V7 → T044 affected regression → whole-F03-B external review. Map existing implementation and
execution instead of rewriting it because a task marker is unchecked. The logout comparison
subsequently led to an explicitly approved repair, followed by an approved Flyway history ACL
repair; neither creates a new product scope or changes immutable V1–V7. Actual results and
retained failures are in [F03 §39](evidence/F03-identity-results.md#39-f03-b-closure-execution-and-review-submission).

Before **any** F03-B closure Maven invocation, including logout qualification and T044, verify
its approved cached build-tool artifacts. `exec-maven-plugin`
3.6.3 is bound to `generate-resources`; ordinary `test/package` and the current runners use it.
The [intake exception](../../docs/research/2026-10-01-t043-maven-web-build-intake.md) admits only
internal T043 build/test. The separate [closure process exception](../../docs/research/2026-10-01-f03b-closure-buildtool-exception.md)
authorizes only Issue #24 / PR #25 T040/T042/T044 and necessary regression using the same nine
JARs, exact hashes/graph and offline cache. Preflight missing/hash-changed/additional artifacts
are BLOCKED; no downloads or extension to F04/F05/general development. Keep actual Web packaging
and prove these tools stay outside application dependencies/`BOOT-INF/lib`. No legal clearance.

The fresh run's `public` means **only** the public schema of a completely new database such as
`idea_ddm_f02_f03b_closure_<run-id>` (the prefix satisfies existing data-test guards). Pin the
exact new name before creation; refuse an existing name or nonempty initial schema. Never use
`idea_ddm_dev`, the historical F02 database or retained F03-A public evidence. Migrate as
`idea_ddm_migrator`, use `idea_ddm_app` at runtime, retain initial emptiness, V1–V7 history/checksum
validation, zero pending/repeat migrations and all applicable ownership/privilege assertions.

Execution receipt: fresh V1–V7 first 7/repeat 0, full public ownership/privileges, final 108-test
regression and repaired-package actual Chrome W01–W10 PASS. Next is external whole-F03-B review,
then human acceptance; technical task markers do not record whole-card acceptance. The matrix
pins each separate exact source, rather than combining historical test counts into one run.

Keep F03-B IN_PROGRESS, Issue #24 OPEN and verifier NOT-RUN. F04 owns its future owner-command
race; company policy/MFA, T036/commercial, deployment and merge are separate. Final matrix review
and Project Reviewer whole-card acceptance are still required.

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

Client qualification order remains: agree the actual client seam → define failing tests/evidence
contract → implement if needed → execute that real client and retain platform evidence. T043-Web
is SATISFIED by accepted W01–W10. Desktop follows in a successor Work Item, not as a F03-B blocker.
Java HTTP evidence is not client qualification; unexecuted successor paths remain NOT-RUN/BLOCKED.
