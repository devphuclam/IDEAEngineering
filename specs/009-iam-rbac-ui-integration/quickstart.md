# Planned Validation Guide — Not an Execution Authorization

| Field | Value |
|---|---|
| ID / class / version / state | IE-VVP-IAM-UI-001 / feature validation design / 0.4 / Draft Account + Project/Group execution guidance; technical oracles unchanged |
| Authority / owner / author / reviewer | INFORMATIVE / test/integration owner / Codex / Project Reviewer DESIGN REVIEW PASS at 0a1de66627fccc4597ac753f6c642d1d8d5f7d1d; PG2/PG3/PG4 PASS; Account and Project/Group engineering milestones in handoff sections 16–18, independent US2 implementation review NOT-RUN |
| Baseline / change / date | Spec e227cb1d + [plan](plan.md) / Issue #46 / 2026-10-08 Asia/Ho_Chi_Minh |
| Effective / classification / retention / supersession / trigger | NOT-APPLICABLE / INTERNAL / Git / no old run replaced / contract, source, environment or tooling change |

## Current Account and Project/Group milestones

Account MVP has actual same-origin packaged Web + Server + PostgreSQL + trusted headed Chrome
qualification, with the authored Login/Admin presentation retained. [Handoff section 16](integration-readiness.md#16-account-ui-mvp-fast-delivery-milestone--2026-10-07)
is the historical Account exact-source result and command record. Historical validation design below is
not relabelled as execution. PG2/PG3/PG4 are PASS under [the envelope](execution-envelope.md).
T034 is now closed by [section 17](integration-readiness.md#17-t034-account-reissue-coverage-closure--2026-10-08).
Project/Group UI-P01–P13 and its actual UI are qualified in [section 18](integration-readiness.md#18-projectgroup-usable-vertical-slice--2026-10-08):
HTTP/owner/data/atomicity 6/3/3/3, affected Account 12, Web 36 and actual Chrome 8 all PASS.
These are explicitly distinct-source runs. Assignment, Custom Role and inspector are still
DESIGN/unavailable. There is **no persistent Account/Project UI deployment** yet:
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

Future runtime command templates (NOT-RUN and not complete execution packets):

    mvn -o -Dtest=<published focused test classes> test
    npm run test
    npm run build

Exact Maven directory/repository/goals and package lifecycle must be inspected because existing
generate-resources binds Web tooling. Missing/new/hash-drift artifact STOP; no npm install/ci,
Maven download, trust bypass or broad DB cleanup. New test class/runner names belong to tasks;
do not claim these commands are runnable before implementation and approved preflight.

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

The table below retains planned whole-feature oracles. Actual Account portions V01/V02/V08 and synthetic V09 are retained in handoff section 16, T034 successor in section 17, and Project V03 plus bounded Project V07/V08 in section 18. Assignment/Custom/Inspector/final cross-screen qualification remains NOT-RUN; Project participation is not general assignment qualification.

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
