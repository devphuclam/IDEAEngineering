# Planned Validation Guide — Not an Execution Authorization

| Field | Value |
|---|---|
| ID / class / version / state | IE-VVP-IAM-UI-001 / feature validation design and result wayfinding / 0.6 / Draft review-repair successor packet; historical technical oracles unchanged |
| Authority / owner / author / reviewer | INFORMATIVE / test/integration owner / Codex / Project Reviewer DESIGN REVIEW PASS at 0a1de66627fccc4597ac753f6c642d1d8d5f7d1d; PG2/PG3/PG4 PASS; engineering evidence in handoff sections 16–22; predecessor independent review FAIL, successor PG5 pending |
| Baseline / change / date | Spec e227cb1d + [plan](plan.md) / Issue #46 / 2026-10-08 Asia/Ho_Chi_Minh |
| Effective / classification / retention / supersession / trigger | NOT-APPLICABLE / INTERNAL / Git / no old run replaced / contract, source, environment or tooling change |

## Current engineering milestone — 92/93 tasks

Account MVP has actual same-origin packaged Web + Server + PostgreSQL + trusted headed Chrome
qualification, with the authored Login/Admin presentation retained. [Handoff section 16](integration-readiness.md#16-account-ui-mvp-fast-delivery-milestone--2026-10-07)
is the historical Account exact-source result and command record. Historical validation design below is
not relabelled as execution. PG2/PG3/PG4 are PASS under [the envelope](execution-envelope.md).
T034 is now closed by [section 17](integration-readiness.md#17-t034-account-reissue-coverage-closure--2026-10-08).
Project/Group UI-P01–P13 and its actual UI are qualified in [section 18](integration-readiness.md#18-projectgroup-usable-vertical-slice--2026-10-08):
HTTP/owner/data/atomicity 6/3/3/3, affected Account 12, Web 36 and actual Chrome 8 all PASS.
Assignment, immutable Custom Role and Inspector/final integration results are retained in
sections 19–21. The [whole-feature matrix](evidence/feature-009-closure-matrix.md) maps every
operation and all FR/SC groups to actual source/tests and executed evidence. Section 21 is the
historical pre-review qualification, not final acceptance. [Current section 22](integration-readiness.md#22-independent-review-repair-successor--2026-10-08)
repairs all three independent findings: authoritative committed scope, qualified independent
history and ordinary AA/PA/PRA grants, exact confirmation diff/interval. Server171 are distinct-source
runs; Web62 + TypeScript and actual InspectorChrome8/AssignmentChrome9 PASS at
`9d3732cb173e8094195b9bdd60b5588ac3cfa42e`. History is a bounded read-only owner projection,
not a general Audit export. T093 and successor PG5 await external review. There is **no persistent UI deployment** yet:
qualification port 18446 was closed, owned schema removed and database retained. Do not mistake
an ephemeral test URL or the unchanged predecessor preview at 18444 for this package.

## Prerequisites and exact commands

Written design/catalogue/console contract is accepted for task planning. [Tasks](tasks.md)
T001–T007 prepare the envelope, run read-only Analyze and obtain explicit applicable PG2/PG3/PG4
and execution readiness before any production/test/schema writing or runtime/setup command.
Publish permitted commands/targets and pin each later RED/GREEN run's exact source,
binary/cache/license hashes, separate migrator/app, approved new DB or owned UUID schema,
synthetic native identities and trusted HTTPS fixture.
No current DB/listener/root approved by this document; no old build exception carried forward.

Source/template checks are available now:

    git diff --check
    ./.specify/scripts/powershell/check-prerequisites.ps1 -Json -PathsOnly

Historical pre-readiness runtime templates (not the commands used for qualification):

    mvn -o -Dtest=<published focused test classes> test
    npm run test
    npm run build

Exact Maven directory/repository/goals and package lifecycle must be inspected because existing
generate-resources binds Web tooling. Missing/new/hash-drift artifact STOP; no npm install/ci,
Maven download, trust bypass or broad DB cleanup. New test class/runner names belong to tasks;
do not claim these commands are runnable before implementation and approved preflight.

Current bounded commands are the published direct-offline runners; do not substitute Maven
lifecycle `test/package`, PATH Node, npm install or an old process exception. Examples below
identify executed final targets, not authorization to overwrite/reuse them:

    bash tests/iam-ui-46/run-owner-tests.sh <a451459 full SHA> <its manifest> final-qualification-08 AccessInspectionContractTest 5 PASS
    bash tests/iam-ui-46/run-owner-tests.sh <a451459 full SHA> <its manifest> final-qualification-09 AccessInspectionPrivacyTest 3 PASS
    bash tests/iam-ui-46/run-owner-tests.sh <a451459 full SHA> <its manifest> final-qualification-10 AccessInspectionAtomicityTest 2 PASS
    pwsh tests/iam-ui-46/run-web-tests.ps1 -SourceRoot <11bba5f raw export> -SourceSha <11bba5f full SHA> -Oracle PASS -ExpectedCount 60
    bash tests/iam-ui-46/account-browser.sh <11bba5f full SHA> <its manifest> final-qualification-13 build
    pwsh tools/iam-ui-readiness/package-preflight.ps1 -JarPath <identical transferred JAR> -RepositoryRoot <11bba5f raw export>
    bash tests/iam-ui-46/account-browser.sh <11bba5f full SHA> <its manifest> final-qualification-13 start
    <approved Windows Node> tests/iam-ui-46/inspection-browser.mjs <11bba5f full SHA> <its manifest> final-qualification-13
    bash tests/iam-ui-46/account-browser.sh <11bba5f full SHA> <its manifest> final-qualification-13 verify
    bash tests/iam-ui-46/account-browser.sh <11bba5f full SHA> <its manifest> final-qualification-13 stop

Exact manifests/archives/logs and retained RED/harness failures are in
[section 21](integration-readiness.md#21-access-inspector-and-final-engineering-qualification--2026-10-08)
and its [Server ledger](evidence/inspection-final-runs.tsv). Final health-negative qualification
used direct offline Surefire `ServerSmokeTest` against the already compiled `5d60b27` target;
it was not a product PostgreSQL health claim. Every actual browser uses installed Chrome155,
Playwright1.62.1, normal certificate trust and the owned ephemeral loopback18446 fixture.
Database retained, marked schemas/listeners/private fixture removed; preview18444 untouched.

The examples above are historical S21 commands. Current repair execution uses the same admitted
direct-offline boundaries with fresh labels; exact Server selectors/counts/targets are retained
in the [S22 ledger](evidence/review-repair-runs.tsv). Representative actual successor commands:

    bash tests/iam-ui-46/run-owner-tests.sh 1601b6e0f03e91148fb2a0ece723cd3de6080bb7 8d788375d60db63b686a1e0f76966acc825a28784b8442585f5d02828679615f inspection-qualification-20 AccessInspectionContractTest 7 PASS
    bash tests/iam-ui-46/run-owner-tests.sh 9d3732cb173e8094195b9bdd60b5588ac3cfa42e 29e1975f3fae8b0fe9a2d085fa8783654179528863b3e2591af4a2851cceee7f final-qualification-44 HttpSessionFlowTest 83 PASS
    pwsh tests/iam-ui-46/run-web-tests.ps1 -SourceRoot <raw 9d3732c export>/source -SourceSha 9d3732cb173e8094195b9bdd60b5588ac3cfa42e -Oracle PASS -ExpectedCount 62
    bash tests/iam-ui-46/account-browser.sh 9d3732cb173e8094195b9bdd60b5588ac3cfa42e 29e1975f3fae8b0fe9a2d085fa8783654179528863b3e2591af4a2851cceee7f inspection-qualification-41 build
    <approved Windows Node> tests/iam-ui-46/inspection-browser.mjs 9d3732cb173e8094195b9bdd60b5588ac3cfa42e 29e1975f3fae8b0fe9a2d085fa8783654179528863b3e2591af4a2851cceee7f inspection-qualification-41
    <approved Windows Node> tests/iam-ui-46/assignment-browser.mjs 9d3732cb173e8094195b9bdd60b5588ac3cfa42e 29e1975f3fae8b0fe9a2d085fa8783654179528863b3e2591af4a2851cceee7f assignment-qualification-43

Each browser run also uses its exact label's build → package-preflight → start → verify → stop
recipe already shown above. Owned SSH forwarding is temporary and exact-PID terminated; synthetic
passwords stay in memory/mode600 fixture, never command arguments. These commands identify runs
already executed, not permission to reuse roots, launch an active listener or redeploy preview.

## Qualification order

- T008–T024: named fixtures, eligibility/UoW, additive schema, Project-owned read facts and the
  single shared evaluator, plus Web adapter/error/state. No second evaluator pending US3.
- T025–T029: separate synthetic Q15 console qualification; live adoption needs its own exact
  target/operator authorization and is not bootstrap or migration setup.
- T030–T042: real account/private handoff/recipient redemption, with reissue RED tests for exact
  login + purpose, other-login/purpose isolation, outcome/Audit rollback and lost-response privacy.
  Wire actual routes here; intentional temporary proof/password controls are allowed then cleared.
- T043–T054: Project/Group owner plus UI-P01–P13 real HTTP adapters/tests and actual Web routes,
  using the already-qualified evaluator. T055–T064 adds assignment UI-R05–R09/wizard only.
- T065–T074: immutable Custom Role; T075–T082: single UI-R10/UI-A01/UI-O01 query adapter/inspector.
- T083–T087: final actual browser/accessibility/network/recovery matrix, not first client wiring;
  T088–T093: affected regression, trace/handoff and independent review packet.

Every slice writes/executes its focused RED before minimum GREEN and qualifies actual HTTP/Web
where applicable before recording completion. Presentation/owner tests alone are not real HTTP
adapter/browser acceptance. The final suite is not the first execution of earlier story tests.

## Scenario/oracle crosswalk

The table below retains planned whole-feature oracles. Actual Account V01/V02/V08 and synthetic V09 are in handoff section 16, T034 successor in section 17, Project in section 18, assignments in section 19, Custom Role in section 20, pre-review Inspector/final integration in section 21, and externally requested repair qualification in section 22. These are engineering results, not independent whole-feature acceptance. Project participation is not general product authorization; UI-A01 now qualifies independent bounded administration history, not general Audit export.

| Case | FR / SC | Procedure and expected oracle |
|---|---|---|
| V01 real account | 001–005/030; SC001/009 | Eligible/ordinary/wrong-scope HTTP + Web reads/create/disable/re-enable. Stable IDs, zero implicit membership/roles, PENDING truthful, no fake session. |
| V02 private credentials | 006–009; SC001/007 | Exact first setup, ambiguous legacy selector refusal, multi-login ACTIVE/DISABLED reset, expiry/use/stale/security-version, lost issuance/reissue; zero secret retention/disabled reenable. |
| V03 owner scope | 010–013; SC002/004 | Org PA create, P PA cross-create refusal; admin not member; Group target must be current same-Project member; zero creator grants. |
| V04 independent grants | 014–019; SC003–005 | Linh AA/PA/PRA, person filter vs Group mode, overlapping direct/Group paths, one revoke, exact scope/version/interval. Unrelated access preserved; no administrative Group loophole. |
| V05 immutable custom | 020/021; SC005/006 | Candidate/activation/diff/replacement; built-in edits, unsupported permission/condition, disguised delegation, stale base and self-authorization refuse. Old assignments unchanged. |
| V06 explanation | 022; SC003/004/009 | All applicable paths, revoked/expired/disabled/membership cases, permission union, safe redaction; no owner-gate claim. |
| V07 atomic/race/retry | 023–025; SC007 | Real session revoke/disable + membership/delegation removal before commit, stale owner, forced result/decision/Audit/commit failure, concurrent same-ID/tuple and lost response. Zero partial/duplicate success; legacy retry not overclaimed. |
| V08 Web/keyboard | 026–028; SC008/009 | Actual trusted browser, session/CSRF/error/refusal, focus/keyboard/dialog behavior, reload and privacy. No client caller ActorId, persisted bearer or mock success. |
| V09 recovery/adoption | 018/019/029/030; SC005/009 | Synthetic current Super reauth and exact console successor; repeat, wrong Actor/Org, stale/disabled/revoked/blocked reauth, evidence fault; old seed/grant/marker retained, no duplicate grant. Last effective Actor preserved across supported versions. |
| V10 data/privilege regression | 015–024/029/030; SC005–007/009 | Upgrade + fresh isolated migrations, old seed checksums, narrow owner function/42501 direct-DML probes, all-path evidence and retained IDs/history; affected old F03/health/other touched owner regressions. |

Retain exact source, commands, tool/package/target identities, counts/results and bounded cleanup
disposition. Logs/screenshots contain no passwords/proof/cookies/CSRF. Use expected versus actual
columns, preserve genuine RED/failed runs, never label unresolved commit as rollback.

Stop only for authority/intake/environment/data-boundary changes or actual unsafe defects.
Normal authorized TDD defects are repaired within future execution scope, not misreported as
acceptance. Verifier, deployment, production/company pilot and merge remain separate, NOT-RUN.
