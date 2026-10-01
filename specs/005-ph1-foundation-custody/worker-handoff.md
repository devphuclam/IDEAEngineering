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

## Current F03-B HTTP account-administration handoff

Use spec v0.6, FR-001–014 and refinement T038–T046. T045 remains `[X]` as historical
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

Keep F03-B IN_PROGRESS, Issue #24 open and verifier NOT-RUN. No merge or whole-card PASS.

Next authorized slice (Project Reviewer, 2026-10-01): contracted HTTP account creation,
disablement and re-enablement. Run one RED → GREEN behavior at a time at real HTTP/PostgreSQL.
Derive ActorContext only from the authenticated principal. Reuse the existing F03-A owner and
permission evaluator with current session eligibility at admission and locked mutation; refresh
idle activity only in the successful owner's transaction. Verify CSRF, v1/v2 and wrong/absent/
revoked authority, invalidated/expired sessions, stable identity/history and required-write
rollback. Retain each actual result, then exact-source regression and external checkpoint review.
Actual clients and fresh public V4–V7 remain separate outstanding work.

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
