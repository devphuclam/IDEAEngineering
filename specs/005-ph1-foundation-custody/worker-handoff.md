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
| CHK006: owner outcome/Audit | T023–T026 | Internal accepted/refused/confirmed-failure and concurrent retry/access results; database assertions prove required Audit/event fate, immutable original provenance and no partial sample outcome. Follow the approved F04 contract; no general product RBAC/delivery claim. |
| CHK007–008: control, bytes, custody | T028–T034 | Actual Client→Gateway route and candidate/Receipt/accepted-metadata assertions. No Generation or Check-in result is created by the PH1 fixture transfer. |
| CHK009–010: failures and future multi-vault seam | T028–T034 | Each detailed check below has retained test/review evidence, not merely source comments. |
| CHK011: measurable acceptance | T012/T013, T017, T022, T026, T034, T035 | Actual results for all six SC criteria on the stated platforms, including both fixture sizes. Preserve NOT-RUN/BLOCKED/FAIL where applicable. |
| CHK012: intake (review state in checklist) | T002, T027, T036 | Exact dependency source/version/license/intended-use records before use, followed by reconciliation with the resolved dependency graph. |

Scope/trace items require source review; behavior items require executed tests. Neither substitutes
for the other. Before closing a card, inspect every applicable row; before claiming PH1 complete,
T035 must account for all rows. An unresolved required result keeps completion open. Do not implement
deferred capabilities merely to turn a scope-boundary row green.

## Current F04 design-to-implementation handoff

**Current disposition: F04 COMPLETED / ACCEPTED / PASS.** Project Reviewer accepted
head `ac6c96e1090eb4d38aefca607af066dcd6330a67` on 2026-10-03; see
[closure record](evidence/F04-outcome-results.md#38-whole-f04-acceptance-and-closure-publication).
The execution guidance below is retained for trace, not an instruction to rerun or reopen F04.

Historical design frontier closed by the Project Reviewer on 2026-10-02; documentation Work Item
[#29](https://github.com/devphuclam/IDEAEngineering/issues/29), branch `codex/f04-design-baseline`,
base `7a3ebd8b6ea9c5f70976ae400f712dd5fcba0d70`. That documentation-only change delivered no Java
or migration; #29 is closed after PR #30 merged at `53c1e174cb0410658752ee48ee97ac1dce05ba6b`.
Use spec v0.8, FR-001–014, [ADR-0014](../../docs/adr/0014-retain-owner-committed-event-foundation.md),
[F04 contract](contracts/ph1-boundaries.md#f04-internal-qualification-contract) and
[T023–T026 units](tasks.md#f04-implementation-units). `tasks.md` remains the only task list.

The separate F04 authority is now recorded in
[IE-RES-F04-BUILDTOOL-AUTH-20261002](../../docs/research/2026-10-02-f04-buildtool-execution-authorization.md).
Prospective Python admission is separately recorded in
[IE-RES-F04-PYTHON-AUTH-20261002](../../docs/research/2026-10-02-f04-python-harness-authorization.md);
the historical omission is preserved, not retroactively approved.
Current implementation Work Item: [#31](https://github.com/devphuclam/IDEAEngineering/issues/31),
accepted for closure; branch `codex/f04-owner-foundation`, base `53c1e174cb0410658752ee48ee97ac1dce05ba6b`.
Worktree: `C:/Users/TD-999/.codex/worktrees/f04-design-baseline/IDEAEngineering` (reused isolated checkout).
Current exact executed source: `088ee3fed5175e387a629a7bc4d5ea5a943cdbb0` for fresh-public/package;
application/test content equals full regression `f817d8fb4a910185204ed37bd01b78070832196b`.
Changed seams: additive V8, schema/predecessor fixtures, caller-Connection Audit append and scoped
offline runner, plus named real-HTTP principal fixture, internal sample owner, caller-Connection
event append and IAM eligibility adapter. No product route/Permission/Role or F03 semantic change.
C adds canonical sample result/access resolution, bounded per-OperationId PostgreSQL session
lock across refusal rollback, safe physical discard and deterministic real-PG concurrency/fault
qualification. Only the sample service and two test fixtures change after the accepted B head.
Codex implemented Audit after its focused RED; Gemini was not dispatched.

The exact offline build-admission preflight is enforced by the scoped runner. T023-A/T025-A
schema, T024-A Audit, T023-B/minimum T025-B, T023-C/T025-C and T023-D/T025-D execution are recorded in
[F04 outcome results](evidence/F04-outcome-results.md) v1.0: owner 21/21 (B 3 + C 13 + D 5), schema 7/7,
predecessor 1/1 and Audit 7/7 = 36/36 at `f817d8fb4a910185204ed37bd01b78070832196b`. All 62 C-run schema cleanup receipts
are COMPLETE; [exact receipt index](evidence/F04-C-execution-receipts.json) retains both actual
REDs and each four-suite regression. The separate [D receipt index](evidence/F04-D-execution-receipts.json)
retains 24 passing suite runs, one expected RED and one interrupted non-PASS attempt; all 26
D schemas have confirmed exact-owned cleanup. The prospective Python clean 15/15
requalification is separately traced at `1255568...`; the five no-build
admission cases remain the separately traced execution at `acc8db5...`.
T023–T026 are complete under explicit whole-card acceptance; no timer/actual-effort action is inferred. Any changed tool,
artifact, graph, database boundary or architecture reopens the execution gate.

Historical checkpoint procedure: the scoped Bash runner was used separately with `F04SchemaTest`,
`F04PredecessorMigrationTest`, `AuditEvidenceRepositoryTest` or `OwnerOutcomeTest` from the exact archive; its approved
Maven command is offline `-o -B -Dtest=<selector> test`. Use only the controlled test DB and fresh
tagged f04 schema. Read the evidence for commands/hashes/limits before rerunning.
B/C/D have external acceptance for continuation. D has executed real IAM disable and HTTP logout
security-first/reverse orderings, atomic refusal handoff, old-proof refusal and re-enable/fresh-session
recovery. T026 permitted regression and a whole-contract matrix are now in evidence sections 29–34
and the separate T026 receipt index. Current-chain expectations include V8; migrations and
historical evidence are unchanged. The §34 package was authorized by the human in this conversation
on 2026-10-03, not by a GitHub approval comment (connector attempt failed403).
[Successor authorization](../../docs/research/2026-10-03-f04-t026-fresh-public-authorization.md)
preceded execution. Sections 35–37 and the [fresh-public receipt index](evidence/F04-T026-fresh-public-receipts.json)
record 8/8, first8/repeat0, offline package and two direct packaged repeat0 from `088ee3f...`.
Only new `idea_ddm_f02_f03b_closure_f04_20261003_t026` was used and remains retained for review.
Whole-card acceptance is now recorded in §38; no technical checkpoint remains inside F04.
PR #32 is merged and Issue #31 is completed; consult their provider records for integration.
The current unit is F05-A / T027: IN_PROGRESS; Q01 key-separation PASS, remaining qualification NOT-RUN. The user
explicitly started F05-A on 2026-10-03; its local Tracker timer is separate from this PR.
Work Item [#37](https://github.com/devphuclam/IDEAEngineering/issues/37) initially authorized
clerical cleanup, read-only inventory and [execution proposal](../../docs/research/2026-10-03-f05a-t027-preflight.md).
Successor user Q1/Q2 approval authorizes writing the minimal qualification harness, not running
it: [Q01 source/tooling/command package](../../docs/research/2026-10-03-f05a-t027-q01-execution-package.md).
The user subsequently approved Q01 execution; package §7 records PASS at exact source/runner
`d01ad4a057a8a14c840320f0c664f6838d12a47e`. No blanket T027 execution approval follows.
Before continuing Q02, read [the exact intake successor](../../docs/research/2026-10-03-f05a-t027-q02-intake.md).
Q01 has Project Reviewer PASS. Static application/plugin/model/core graphs are reconciled;
Eight initial rights-evidence gaps are resolved. Intake v0.3 retains eleven acquisition
and five installed-core BLOCKED-LEGAL dispositions;89 acquisition/47 core ordinary rights
dispositions are not execution authority.
The [T027 process exception](../../docs/research/2026-10-03-t027-process-exception.md) is
approved and [frozen](../../docs/research/2026-10-03-t027-process-exception-freeze.md):99 known-term
acquisition/52 core inputs, unchanged exact versions/hashes/graph, offline internal T027 only,
Issue37/PR38. It waives only the repository process gate; all actual terms and duties remain.
No legal/company-license/commercial approval, extra rights, whole-F05 or other-work-item use.
JSR305 is explicitly excluded. See [upstream v0.4](../../docs/research/2026-10-03-f05a-q02-upstream-rights.md#authorized-exact-jsr305-publication-inspection--version-04):
official exact sources were inspected memory-only, with four CC BY2.5 grants and27 files
without an established applicable grant. Full JSR305 rights remain BLOCKED-LEGAL.
Historical old-graph finding stays BLOCKED-LEGAL. The user has now authorized the bounded
[JSR305 exclusion experiment](../../docs/research/2026-10-03-t027-jsr305-experiment-authorization.md):
publish exact standalone source/settings/runner/hashes, construct an isolated offline repository,
run only four pinned direct Maven goals, inspect exact graph/package, then conditionally run
the predeclared non-web Boot smoke. See its package README for exact input/STOP controls.
No automatic replacement, original .m2 mutation, installation or further rights waiver.
Published experiment source is `3efad42448ff6950de6dfa57f5c04f5d14871aeb`.
The [first-party archive preflight](../../docs/research/2026-10-03-f05a-q02-jsr305-preflight-stop.md)
STOPPED: seven exported documentation/TSV files became CRLF and failed committed LF hashes.
Java runner/repository construction/Maven/Boot are NOT-RUN; no runtime or graph PASS.
Candidate graph115rows/99unique and runtime38 are expected only. Preserve the failed archive;
corrected exact-byte source export/owned target requires gate clearance before retry.
The narrowed graph is prospectively authorized
by the explicit successor, not retroactively inserted into the historical frozen exception.
Remaining T027 stays NOT-RUN and Q01 stays PASS. No runtime success is inferred.
Do not restart the timer or infer qualification/provisioning authority. Use
[IE-RES-PH1-F05-GATEWAY-QUAL-001@1.0](../../docs/research/2026-09-28-ph1-f05-gateway-qualification.md),
first frozen on 2026-10-03, with its [freeze record](../../docs/research/2026-10-03-f05-preparation-freeze-record.md).
Content SHA-256: `a14a58ce17549d39097ed192e0a6195cadc3ee820eae2b736743f26b13544cef`.
Worker mode CODEX_ONLY. The subsequent preflight authorization does not authorize Gateway code,
database/certificate/tunnel provisioning, build/qualification execution or inherited F04 tooling.
Do not create/reuse another target, rerun the retained public database, DROP the review database
or deploy the package for closure. Preserve private raw-log access limitation. Verifier remains
NOT-RUN and is not an F04 acceptance blocker.

After implementation authorization, CODEX owns schema, owner/transaction/event/IAM coordination,
concurrency tests, exact-source regression/evidence. Only **T024-A** is GEMINI-SAFE after CODEX
fixes the supplied-Connection Audit contract, schema and failing test. Its output still receives
CODEX integration review. A Gemini worker changes only that repository class; a need to change
schema, ownership, transaction, identity or tests returns to CODEX. This is allocation, not an
instruction to dispatch an implementation worker during documentation closure.

Approved reader rule belongs only to the synthetic sample: currently eligible originating Actor,
including a fresh session. Immutable original Actor is provenance, not universal read authority.
No product API/Permission, mutable demo entity, generic registry/payload or dispatcher is planned.
V8 is implemented and schema-qualified; preserve V1–V8 and all
historical F03 evidence. Keep rollback, terminal business refusal and uncertainty distinct.

## Accepted F03-B receipt and historical checkpoint guidance

The approved reconciliation, logout/history repairs, closure execution and whole-card technical review are completed; see [closure matrix](evidence/F03-B-closure-matrix.md) and [F03 §39–41](evidence/F03-identity-results.md#39-f03-b-closure-execution-and-review-submission).
Final source `989bf5a9fc09c03ee2d5fa88d09b3cee78335616` passed 108 checks; fresh public/package `38b99f50de09370a8e8554cc80fc66a0afa70b62`, final public checks `989bf5a9...` and actual browser `9238b7e8ad6878687e72823e7bed1d4f083b9699` have separate PASS receipts (§39–40) and unchanged production content.
Whole-card technical review at `92d9c84ef24b2c3c4c6f01ad1df104e9c28880d0`: PASS WITH NOTES.
Project Reviewer whole-card acceptance: **COMPLETE / ACCEPTED**.
Card status: **F03-B = COMPLETED / PASS**.
Work item status: **Issue #24 = CLOSED**.
Actual effort: Progress Tracker recorded **11 giờ 20 phút** (11.3333h, revision 32 published).
PR #25 integrated into `main` via merge commit `25ef993524b9d309f28d61adeef0095355c9c66e`.
Desktop/WebView2/Workspace binding transferred to separate successor Work Item. Verifier remains NOT-RUN.

The following F03 guidance/versions describe historical checkpoints, not the current F04 task.
The accepted F03-B receipt above supersedes their former open/IN_PROGRESS instructions.
At those checkpoints use spec v0.7, FR-001–014 and refinement T038–T046. T045 remains `[X]` as historical
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
ACID: no tentative proof is eligible without committed database state. The four-step client method
remains qualification seam → failing test/evidence contract → implementation if needed → actual
client evidence. T043-Web is now SATISFIED; Desktop is a successor Work Item, not a F03-B blocker.
Java HTTP harness results cannot replace actual client qualification.

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
exact-source, UUID-owned fixture. Do not reopen packaging
without a new defect. Historical build-tool intake remains internal T043 only. The separate
[closure exception](../../docs/research/2026-10-01-f03b-closure-buildtool-exception.md) admits the same
nine exact JARs for F03-B T040/T042/T044 only, conditional on offline-cache/hash/graph preflight;
F04/F05/general development still need separate authority. For existing Ubuntu
runner scripts, prepend the qualified Node 24 `bin` directory to the process PATH and prepare the
locked Web dependencies per [quickstart](quickstart.md); no global PATH change/hidden install.
External restart PASS WITH NOTES was relayed by the Project Reviewer; preserve its private-log
access limitation and historical evidence. Preserve immutable migrations.
The [actual Chrome successor](evidence/T043-web-browser-successor-20261001.md) now retains
W01–W10 PASS on unchanged actual Web/Server source `2fe89d4`, with qualification harness
`738eb5ae05600b443ad2c107e1352de6dac45def`, normal trusted HTTPS and a fresh UUID-owned fixture.
No package install/TLS bypass or secret evidence. Read §32 for execution, cleanup and limits.
External Web PASS WITH NOTES at `24ecdf0c9d5246223837ba1c3b349b3005cb5be4` is received in
[§33](evidence/F03-identity-results.md#33-external-review-of-actual-t043-webbrowser-checkpoint).
Both [next-use hardening notes](evidence/T043-web-browser-successor-20261001.md#closure-requalification--2026-10-01)
were repaired before closure Web reuse; actual Chrome W01–W10 passed on the repaired Server.
Web W01–W10 satisfies the Web portion of T043;
keep the historical umbrella marker unchecked, not a Desktop condition on F03-B acceptance.
T040/T042/shared Server tasks and T044 are technically satisfied by §39 and the matrix.
Logout contract comparison led to an explicitly approved, executed repair; prior failures are
retained. Whole-card external review and Project Reviewer acceptance remain PENDING.

Desktop/WebView2/Workspace binding is NOT-RUN and deferred to a successor Work Item after F03-B
closes; no successor issue is created yet. Preserve separate session contexts, actual IDEA Web
over HTTPS, server-mediated short-lived binding and Windows per-user protected custody. Exact
issue/redeem/refresh/revoke/reauth/replay/cross-user/same-user-hostile-client semantics require an
agreed seam/test contract there, not invention in PR #25. The F01 scaffold is not authentication
evidence. F04 still owns its separate owner-command race.

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
