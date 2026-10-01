# PH1 implementation handoff — GPT 6 Luna

This is an execution guide, not another plan or product authority. Use [tasks.md](tasks.md)
as the only task list. Scope: PH1 F01–F05. Read this before implementing or reviewing these tasks.

## Start each work session

1. Read repository `AGENTS.md`, [Spec Kit workflow](../../docs/agents/spec-kit.md),
   [spec](spec.md), [plan](plan.md), and the current task list. Inspect branch, HEAD and dirty
   files; preserve work already present. Report the actual checkout being used.
2. Read the [reviewer checklist](checklists/ph1-requirements-review.md) for current approval state.
   A checked item accepts requirement quality; its implementation obligations remain to be delivered.
   Do not skip outstanding reviewer decisions or mark reviewer items yourself.
3. Use project-local `speckit-implement` for authorized execution and `tdd` for behavior.
   Start with the earliest incomplete task whose dependencies and review conditions are met.
   Keep each work unit bounded to one task or a test/implementation pair for the same behavior.
4. Follow the [diagram guide](../../docs/product/instances/idea-engineering/ph1-diagram-guide.md)
   when implementing transfer. Read [data model](data-model.md) and
   [boundary contract](contracts/ph1-boundaries.md) at F02/F05. If they conflict with their
   governing DOC-04/05/06 sources, report the exact conflict before changing behavior.

## Coverage of the entire reviewer checklist

At T035, retain one row per CHK ID in `evidence/PH1-coverage-review.md` with governing FR/SC,
implementation/source path, test or review evidence path, actual result and remaining action.
Use the existing card evidence files named in tasks.md; do not create a competing task register.

| Checklist | Tasks that deliver or verify the approved content | Completion evidence |
|---|---|---|
| CHK001–002: scope | T001, T035 | Compare delivered source and configuration with F01–F05. Exactly one Gateway/Vault is configured for PH1; later document workflow, multi-vault and Format Worker remain scheduled/deferred, not claimed delivered. |
| CHK003: trace | T035 | Every local FR-001–014 maps to its governing source and applicable implementation/test evidence. Missing trace remains an explicit gap. |
| CHK004–005: identity/session | T018–T022, refinement T038–T046, T023/T025 | Executed tests for server-derived Actor, first/repeated bootstrap, exact-login credential recovery, sign-out, disable/revoke, re-enable with fresh login, and commit-time invalidation. Preserve evidence of the controlled race ordering. |
| CHK006: owner outcome/Audit | T023–T026 | Allowed, refused, forced-failure and same-ID retry results; database assertions prove outcome/Audit consistency and no partial success. |
| CHK007–008: control, bytes, custody | T028–T034 | Actual Client→Gateway route and candidate/Receipt/accepted-metadata assertions. No Generation or Check-in result is created by the PH1 fixture transfer. |
| CHK009–010: failures and future multi-vault seam | T028–T034 | Each detailed check below has retained test/review evidence, not merely source comments. |
| CHK011: measurable acceptance | T012/T013, T017, T022, T026, T034, T035 | Actual results for all six SC criteria on the stated platforms, including both fixture sizes. Preserve NOT-RUN/BLOCKED/FAIL where applicable. |
| CHK012: intake (review state in checklist) | T002, T027, T036 | Exact dependency source/version/license/intended-use records before use, followed by reconciliation with the resolved dependency graph. |

Scope/trace items require source review; behavior items require executed tests. Neither substitutes
for the other. Before closing a card, inspect every applicable row; before claiming PH1 complete,
T035 must account for all rows. An unresolved required result keeps completion open. Do not implement
deferred capabilities merely to turn a scope-boundary row green.

## Current F03-B Web qualification handoff

Use spec v0.7, FR-001–014 and refinement T038–T046. T045 remains `[X]` as historical
implementation/execution at `976bd031913edb3e4554af6e23744a1dd55d8527`; do not reopen it or
rewrite evidence §20. T046 ran from `1e69ac61d2e8f53c742fd1041c36a5bf2c3bf142` and received
external PASS WITH NOTES at `281e46651e774b44a0b2e1c18fe30bd50a1f3151` (§22). Preserve V1–V6
and the exact-login repair; no single-login invariant or implicit selector.

Read-only `speckit-analyze` preceded T041 implementation. The runtime successor and its exact
source, RED/GREEN results, internal review and remaining limits are in
[evidence §24](evidence/F03-identity-results.md#24-t041-throttling-checkpoint).
External PASS WITH NOTES at `74c2d3dbeabc38bc292f22220e358aaa5e0f46d3` is received in
[§25](evidence/F03-identity-results.md#25-external-review-of-t041). The received review covered the
[qualification contract](contracts/ph1-boundaries.md#throttling-qualification-contract-planned)
and [sign-in integration](plan.md#planned-sign-in-transaction-integration):

1. Check the fifth-failure tracer RED/GREEN and subsequent rolling/deadline tests. Unknown
   zero-state behavior already existed; its additional state-bound oracle passed without a
   fabricated RED. Anonymous CSRF servlet sessions are not authenticated sessions.
2. Check one row/five timestamps/one deadline per existing Login Identity, controlled-time
   before/at/after boundaries, shared normalized variants and independent L1/L2 state.
3. Check synchronized concurrent counting and qualified refused-path password work, including
   the credentialless successor, with the existing runtime-role restrictions.
4. Check refusal-state persistence and successful clearing/session/IAM/Audit fate. Required-write
   and ordinary Spring binding faults must preserve prior failures and no eligible tentative
   proof. JDBC resources remain request-scoped, never in Identity/HttpSession.
5. Check exact source `b08709c581de195e05aea26450495cd593722059`, its 81-test result and the
   source-to-review-head diff. Unrun clients/fresh-public migration remain NOT-RUN; no merge or
   whole-card completion is implied.

Additive V7 enforces the existing-identity bound and retains least privilege. Do not modify V1–V6.
Do not claim servlet/PostgreSQL distributed
ACID: no tentative proof is eligible without committed database state. T043 still owns four
ordered client steps: qualification seam → failing test/evidence contract → implementation if
needed → actual Web/Desktop evidence. Java HTTP harness results cannot replace client qualification.

For T043, follow spec's accepted 2026-10-01 Web credential-lifecycle clarification. Do not impose
an absolute ban on controlled-input state: clear password control/state after submission and
unmount, including refusal/error, with no persistence, copies elsewhere or diagnostic/evidence
exposure. CSRF may remain in RAM; the session cookie is never page-JavaScript-readable. Desktop
custody is unchanged. The Project Reviewer approved Web first on 2026-10-01. Read the
[T043 Web contract](contracts/ph1-boundaries.md#t043-web-qualification-contract) before code:
qualify trusted HTTPS and legitimate tooling, then one actual Web behavior RED → minimal GREEN.
Serve the built React application from actual IDEA Server; include packaging and narrowly public
GET assets. Optional Playwright uses installed Chrome only after intake/approved package sourcing;
no Internet install. Manual actual Chrome is allowed but cannot waive blocked mandatory oracles.
Missing trust/package is an environment blocker, never the Web RED. Desktop stays separate.

Keep F03-B IN_PROGRESS, Issue #24 open and verifier NOT-RUN. No merge or whole-card PASS.

The authorized HTTP account create/disable/re-enable slice ran from
`a0874f40555f1119b830f043a7aaf5bda8752d8a`: 98 scoped checks, 0 failures/errors/skips.
[§26](evidence/F03-identity-results.md#26-http-account-administration-checkpoint) retains route
RED/GREEN, permission/CSRF/current-session checks, accepted-activity fate, six required-write
faults, lock-time expiry and test-first normalized-login/zero-login Account repairs.
ActorContext comes from the authenticated principal; the existing
F03-A owner revalidates current eligibility before scoped authority and after the lock.

External PASS WITH NOTES at `171173a5266fa5c9a732f2fe1316fb1c5c0f836d` is received in
[§27](evidence/F03-identity-results.md#27-external-review-of-http-account-administration).
The authorized restart slice uses `ServerRestartFlowTest.java`: real process A login and usable
cookie → stop A → real process B on the same endpoint/schema refuses the old cookie → fresh
login/protected request succeeds with a different runtime ID. Read §28 for the exact source and
actual result. The test also witnesses unchanged identity/credential and historical metadata,
pre-revoked/idle-expired refusal, and PostgreSQL throttle survival. Existing behavior was GREEN
on first qualification; production code, dependencies and V1–V7 are unchanged.

The first Web implementation and exploratory Chrome run are now retained in
[T043 partial Web evidence](evidence/T043-web-qualification-20261001.md). Source
`2d2bcfc4892cb6903fa3196ae6fc47dbd8424121` adds the actual React sign-in/out UI, same-origin
Server static bundle packaging and test TLS configuration. The run has partial browser
observations, not full W01–W10 acceptance. The schema used a fixed test name rather than the
planned UUID name; direct cookie/network, bad-CSRF, invalidation/reload and error/leak oracles
remain unexecuted. Maven executed 81 checks and skipped 24; F03-A and fresh data/privilege suites
were not executed in that run. The external reviewer requested one build-integration repair;
[clean packaging successor evidence](evidence/T043-web-packaging-repair-20261001.md) now retains
RED/GREEN from committed archives. Source `2fe89d481842f4cf26078c07d4b78fb3bdacd7c4` makes Maven
build/package actual Web without copying generated assets into source. Verified-HTTPS shell/asset
checks and two Server/two Web smoke tests pass; this is not actual Chrome W01–W10 acceptance.
External packaging PASS WITH NOTES at `82a30adb55482096e421821891734d82ec990351` is received
([§31](evidence/F03-identity-results.md#31-external-review-of-t043-packaging-repair)); the prior
MAJOR is closed. Its authorized follow-up was the actual Chrome run recorded below, using an
exact-source, UUID-owned fixture before the separate Desktop checkpoint. Do not reopen packaging
without a new defect. The build-tool exception is internal T043 only; resolve intake before
F04/F05/general development because ordinary Maven builds invoke that plugin. For existing Ubuntu
runner scripts, prepend the qualified Node 24 `bin` directory to the process PATH and prepare the
locked Web dependencies per [quickstart](quickstart.md); no global PATH change/hidden install.
External restart PASS WITH NOTES was relayed by the Project Reviewer; preserve its private-log
access limitation and historical evidence. Preserve immutable migrations.
The [actual Chrome successor](evidence/T043-web-browser-successor-20261001.md) now retains
W01–W10 PASS on unchanged actual Web/Server source `2fe89d4`, with qualification harness
`738eb5ae05600b443ad2c107e1352de6dac45def`, normal trusted HTTPS and a fresh UUID-owned fixture.
No package install/TLS bypass or secret evidence. Read §32 for execution, cleanup and limits.
Next: external review of the actual Web checkpoint, then propose the separate Desktop seam/test
contract before its implementation/qualification. T043 remains unchecked because both clients
are required. Remaining issuer/logout profiles, Desktop and fresh public V4–V7/data regression are outstanding;
this Java HTTP runner is not client qualification. F04 owns its separate owner-command race.

## Detailed evidence for CHK009 and CHK010

These are acceptance checks for existing requirements, not new product features. Implement their
tests under T028/T029 and execute/retain them under T034; T035 reviews the complete coverage.

| Requirement | Evidence required before calling F05 complete |
|---|---|
| Client → Gateway bytes | Trace the actual fixture transfer endpoint. Server handles control/receipt and does not relay the file payload. |
| Wrong/expired/replayed Grant or mismatched Receipt | Controlled negative tests show no accepted custody. Renewing a Grant rechecks eligibility and retains the original operation. |
| Missing bytes, wrong size or digest | Actual fixture corruption/truncation is refused; query the database to show no false accepted custody. |
| Interrupted transfer | Stop a transfer after confirmed ranges, reconnect, query authoritative progress and transfer only missing ranges. Retain IDs and range evidence, not just a UI percentage. |
| Lost acknowledgement after acceptance | Suppress the response after the Server records acceptance. Retry with the same identity and show the same result, without another accepted outcome. |
| Duplicate and changed-input retry | Same identity/input resolves the existing result; changed input under that identity is refused. Retain result identities and relevant database assertions. |
| Separate Artifact/Vault/Location identity | Schema and tests show explicit relationships; none of these IDs derives from IP, hostname or filesystem path. One Artifact is not structurally limited to one Location by its identity/schema. |
| Private Adapter path | Exercise relocation/configuration change for the one test Vault in an isolated test directory. Preserve IDs and byte integrity; the public contract does not expose the private path. This is not a production migration or a second-Vault test. |
| Future multi-vault seam | Review schema, Adapter interface and callers for hardcoded single-machine/path identity. Retain source references and test assertions. Label this design/test evidence, never multi-vault runtime PASS. |

Use the approved 1 KiB/64 MiB synthetic fixtures. Keep destructive tests away from the real Vault
and retained P05 fixtures. Obtain explicit authorization before destructive or expanded server work.
Document Check-in/Generation publication, a second Vault, replication and failover remain outside PH1.

## Stop and report instead of guessing

- T002: missing exact source/version/license intake blocks importing that dependency.
- T027: qualify the Gateway runtime/toolchain/Adapter and transport profile, refine exact paths in
  T029/T031/T033, then rerun `speckit-analyze` before Gateway code. Do not choose its language implicitly.
- Missing tool, credential, server permission or unavailable environment: state the blocker and
  the smallest user action needed. Never print secrets or substitute mocks for real integration evidence.
- A required scenario fails or has not run: retain `FAIL`, `BLOCKED` or `NOT-RUN`; leave the
  corresponding task/card incomplete. Ask before changing approved scope to avoid a failed check.

## End each work session

Follow [quickstart](quickstart.md) for evidence: exact source revision (plus dirty-state disclosure),
environment, command, expected/actual result and output. Record tests failing for the intended
missing behavior before implementation, then passing afterward. Name remaining tasks and next action.
Use reviewer approval only for requirements approval, never as a runtime test result.

Update task completion only when its acceptance evidence exists. Tracker actions follow explicit
user instructions under repository rules; planned hours are not actual effort. Commit/push authority
and branch integration follow repository collaboration rules and the user's current request.
