# Planned Validation Guide — Not an Execution Authorization

| Field | Value |
|---|---|
| ID / class / version / state | IE-VVP-IAM-UI-001 / feature validation design / 0.1 / Draft |
| Authority / owner / author / reviewer | INFORMATIVE / test/integration owner / Codex / Project Reviewer, review NOT-RUN |
| Baseline / change / date | Spec e227cb1d + [plan](plan.md) / Issue #46 / 2026-10-07 Asia/Ho_Chi_Minh |
| Effective / classification / retention / supersession / trigger | NOT-APPLICABLE / INTERNAL / Git / no old run replaced / contract, source, environment or tooling change |

## Prerequisites and exact commands

Accept Core/design/catalogue/console contract; generate reviewer checklist/tasks; Analyze before
execution. Publish exact executed source, binary/cache/license hashes, separate migrator/app,
approved new DB or owned UUID schema, synthetic native identities and trusted HTTPS fixture.
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

## Scenario/oracle crosswalk

All rows are planned, actual result NOT-RUN.

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
