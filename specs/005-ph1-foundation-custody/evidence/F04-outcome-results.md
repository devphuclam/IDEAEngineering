# F04 outcome results — authenticated owner, replay, concurrency and security coordination

| Current control | Value |
|---|---|
| Stable ID / class | `IE-VEV-PH1-F04-OUTCOME-001` / verification execution record |
| Version / document status / normativity | `1.0` / Approved / INFORMATIVE |
| Repository instruction state | NOT-APPLICABLE |
| Execution disposition | F04 COMPLETED / ACCEPTED / PASS; focused F04 36/36 + affected F03/health 108/108 + authorized fresh-public 8/8 + offline package/two packaged repeat0; acceptance recorded in §38 |
| Owner / author | Engineering / Codex |
| Reviewer | Project Reviewer whole-F04 acceptance on 2026-10-03 at `ac6c96e1090eb4d38aefca607af066dcd6330a67`; historical checkpoint reviews retained |
| Acceptance authority | Project Reviewer Nguyễn Huỳnh Phúc Lâm; explicit whole-card acceptance and closure/integration authorization in this conversation on 2026-10-03 (§38); historical failed GitHub connector attempt created no approval comment |
| Applicability / evidence date | `IE-INC-PH1-FOUNDATION-CUSTODY-001`, spec v0.8, Work Item [#31](https://github.com/devphuclam/IDEAEngineering/issues/31), A/B/C/D and T026; 2026-10-03 +07:00 |
| Current executed source | Fresh-public/package `088ee3fed5175e387a629a7bc4d5ea5a943cdbb0`; application/tests unchanged from full regression `f817d8fb4a910185204ed37bd01b78070832196b` |
| Current archive SHA-256 | `0894c38b2643ca3b52b8dd825a25a194babe719e278f59e35433e6fd8824f0af`; historical full-regression archive retained in §31 |
| Classification / retention | INTERNAL; retain with the F04 baseline and associated server logs until separately governed disposition |
| Upstream | [ADR-0014](../../../docs/adr/0014-retain-owner-committed-event-foundation.md), [F04 contract](../contracts/ph1-boundaries.md#f04-internal-qualification-contract), [bounded execution authority](../../../docs/research/2026-10-02-f04-buildtool-execution-authorization.md) |
| Downstream | Completed T023–T026 in [tasks](../tasks.md#f04-implementation-units), [current handoff](../worker-handoff.md#current-f04-design-to-implementation-handoff), PR #32 integration / Work Item #31 closure |
| Change / supersession | Closure-only successor to v0.9. Sections 1–37 and all execution indexes remain unchanged as historical records; §38 supersedes their pending whole-card/task/integration disposition. Historical F02/F03/tooling evidence unchanged. Superseded by NOT-APPLICABLE |
| Review trigger | Source/test/migration/build-input/tool/cache/authority/boundary change or adoption by the next owner; rerun affected checks before extending disposition |
| Standards tailoring | Section 15 pins exact editions and TAILOR disposition for `STD-INFO-001`, `STD-CM-001`, `STD-TEST-001…004`: STANDARD-GUIDED scoped information/configuration/test trace under `IE-STD-AUTH-001`; no conformity claim |

## Historical v0.1 control and schema receipt

The following control table and sections 1–3 describe the earlier v0.1 schema-only checkpoint,
not the current execution or acceptance state. Its incomplete control envelope is superseded
by the current envelope above; its source, hashes and observations are unchanged.

| Control field | Value |
|---|---|
| Stable ID / class | `IE-VEV-PH1-F04-OUTCOME-001` / verification execution record |
| Version / status / normativity | `0.1` / Partial execution / INFORMATIVE |
| Owner / author | Engineering / Codex |
| Applicability / date | Work Item #31, T023-A/T025-A schema foundation, 2026-10-02 +07:00 |
| Acceptance authority | Project Reviewer execution authorization `IE-RES-F04-BUILDTOOL-AUTH-20261002`; whole F04 acceptance NOT-RUN |
| Executed source | `1b7cd914dfa2b13b39afedf86c0de883d8f04e4b` |
| Archive SHA-256 | `a29e80018551cd99b4c7bec3f65d464f06e8385c65546430b24096186295805f` |
| Tool boundary | Temurin 25.0.4.1+1, Maven 3.9.16 offline, PostgreSQL 18.6; exact 9/9 admitted build artifacts |
| Database boundary | `127.0.0.1:5432/idea_ddm_f03a_20260930_c91e7a42`; each run used a tagged `f04_<UUID>` schema; no `public` writes |
| Credential/evidence boundary | Credentials came from the controlled server file; no credential, proof, cookie or password was printed or retained here |

## 1. Executed schema checks

The runner was `apps/server/scripts/run-f04-postgresql-checks.sh`. It creates one uniquely
tagged schema through `idea_ddm_migrator`, runs the selected Maven test offline, retains result
hashes, then drops only that exact tagged schema after the JVM and connections stop.

| Run | Result | Schema | Log SHA-256 | Surefire XML | Surefire text |
|---|---|---|---|---|---|
| `F04SchemaTest` | 7 tests, 0 failures, 0 errors, 0 skipped; Maven exit 0; 8 migrations | `f04_c51021fd138f4c519612777d3919f660` | `5c289dfd804f64aee9f179aa3b4e878c4ed2cb78195b57f7fd9085297c31c864` | `3bfd6081a19a5654829c4c1bcc2b10c7880706d136dbfae5ff62ba712271b576` | `1e914592ad78a3875922ed7a5c87cbb9027622b7067fe69aa9c1af038e52ef82` |
| `F04PredecessorMigrationTest` | 1 test, 0 failures, 0 errors, 0 skipped; Maven exit 0; V8 first failed closed, then 1 applied / repeat 0 | `f04_7817a8c183cd4c7688e2ae32433619ee` | `82c841b4b52fbc1a6c23accba63aa4493542bf0c07685fabd91ea7cfaa32cd9f` | `0e56bdf30e07868db5628dd9c4dc121e66403533a7c35984f39c8af1f96025fd` | `a47956a842d31c1a5355eb9e5d853505d1887536c7ea9165ff77651fea31aa5a` |

The schema suite proves the approved ENVELOPE-9 columns, direct non-destructive Actor/Organization
foreign keys, append-only event and sample-result contents, app INSERT/SELECT-only behavior,
sample-only accepted-event uniqueness independent of contract version, and multiple events for
another synthetic producer without a sample-owner FK. The predecessor run proves that an Actor
without an exact Account/Organization relationship aborts V8 without a history or table residue;
after the relationship is present, V8 succeeds once, repeats with zero pending migration, keeps
predecessor sample rows byte-for-byte represented and leaves historical Audit correlation NULL.

## 2. RED/GREEN trace

Earlier bounded executions remain historical evidence: ENVELOPE-9 absent RED at
`ebde18c044274877853342735cffcd6e143e9fa7`, minimum event GREEN at
`3e8928a55bedfdbb7c289eb9c4ed417a7c1a79d3`, event-retention RED/GREEN at
`cb43a2b50f4dd26a79bc2d903be9739b738693b2` / `8b64873d8476b7ec3a5ea84a013ff873d8dd2d44`,
and provenance RED at `f7048505404fddfad62ec2d4fecf68dda64444e9`. The current source is the
successor containing those repairs and the focused schema regression matrix above.

## 3. Limits and next boundary

This is a partial schema checkpoint, not T023–T026 completion or F04 acceptance. No owner command,
Audit repository, authenticated ActorContext bridge, transaction race, business REFUSED flow,
result reader, HTTP route, product Permission, dispatcher, F05 behavior, verifier or deployment
was executed. Private raw logs are retained on the test host and are identified by hash; their
contents are not independently published here. Next authorized unit is the focused Audit RED
after this schema GREEN; only then may T024-A be delegated to Gemini.

## 4. Successor scope, procedure and oracles

The approved immediate schema/Audit units are implemented. Codex implemented and reviewed the
Audit class after relevant schema GREEN and the focused missing-repository RED; no Gemini worker
was dispatched. The permitted Gemini allocation was not an execution or review claim.

Preconditions: exact admitted tooling/cache; all nine build JARs and plugin descriptor match
the retained inventory; qualified POM/build script/Web manifest/lock/Vite configuration match
source `2a74130b88cffe1ee96d28014c7a0ec080d1a199`, allowing only LF/CRLF archive representation;
eight installed direct Web versions match. JDK, Maven, Node and npm are checked before execution.
PostgreSQL reports version number `180006`; the authenticated app has neither database nor
historical-public schema CREATE. After migration, the fixture also checks its actual app identity
and lack of CREATE on the run-owned schema. Missing/drifted prerequisites block before Maven.
Offline Maven failure is retained; there is no network/install fallback or cache-repair step.

Each source archive contained `apps/server`, `apps/web`, `database` and the two authority/intake
records. Locked `node_modules` came from the retained, unchanged qualified build cache; no install.
Only synthetic UUID Actor/Organization/sample/Audit fixtures were used. These raw database fixture
identities do not establish an authenticated ActorContext and do not qualify the owner seam.

Commands, from the unpacked exact archive with `IDEA_F04_SOURCE_SHA` set to the recorded source:

```bash
bash apps/server/scripts/run-f04-postgresql-checks.sh F04SchemaTest
bash apps/server/scripts/run-f04-postgresql-checks.sh F04PredecessorMigrationTest
bash apps/server/scripts/run-f04-postgresql-checks.sh AuditEvidenceRepositoryTest
```

The runner invokes the admitted Maven executable as `-o -B -Dtest=<selector> test` in `apps/server`.
The normal lifecycle builds actual Web resources; no packaging bypass is used. Connection
passwords come only from the controlled mode-600 file, never command arguments or evidence.

| Requirement / oracle | Source and test | Current result |
|---|---|---|
| Exactly ENVELOPE-9; immutable event/sample retention; non-destructive identity FKs; sample-only uniqueness excluding contract version; independent other producer | V8 / `F04SchemaTest` | 7/7 PASS; migration and real app/migrator SQL witnesses, not owner execution |
| Exact Actor→Account→Organization backfill or atomic migration refusal; retained predecessor fields and nullable historical Audit correlation | V8 / `F04PredecessorMigrationTest` | 1/1 PASS; missing attribution failed/rolled back; corrected synthetic precondition then V8=1, repeat=0 |
| Caller-owned Audit append, exact operation/Actor/correlation/result/reason; required one-row write; SQL/zero-row failures propagate; auto-commit rejected | `AuditEvidenceRepository` / `AuditEvidenceRepositoryTest` | 7/7 PASS; external visibility before commit=0, caller rollback removes append, caller commit retains REFUSED reason |
| Fail closed on changed build admission, without invoking a build or opening DB access | Scoped runner / `qualify-f04-build-preflight.py` | 5/5 PASS at `acc8db51f9f1099e599421cb676bf136d3c1ee74`; later change adds only the database/schema privilege prerequisite and fixture assertions |

This Audit REFUSED fixture qualifies the append boundary only; it is not execution of the
business-refusal transaction, sample owner service, replay or IAM commit-time race.

## 5. Historical v0.2 exact-source reruns

All three runs below used source `82be13ecd2d8b2b339f70a2f47357442dc18cff9` and archive SHA-256
`5f3ae00ffa6711f0a139e34de9d76a5470d4c225c3c71fa7f896fd0fa636591a`.
These v0.2 receipts are retained, not current-source claims. Each exited Maven 0 with zero
failure/error/skip. Results and
Surefire hashes were retained before cleanup; the runner then verified the exact schema owner
and run marker, stopped connections with the completed JVM, dropped only that schema and
confirmed its absence. A foreign/mismatched marker refuses cleanup, rather than reporting success.

| Suite / result | Build directory under `/home/phuclam/` | Exact owned schema | Log under `/home/phuclam/` / SHA-256 |
|---|---|---|---|
| Schema 7/7 | `idea-f04-82be13e-33E63h` | `f04_0703d94517354287b7256d6fd9c23d90` | `idea-f04-schema-CmyP5w2i.log` / `e1cd7367e3dc23ca18fc6a3ef13e159f9da8f44c5dddcb261f30f2f03d0fa6e6` |
| Predecessor 1/1 | `idea-f04-82be13e-JDk5WJ` | `f04_e7a64a03c5bc48e28cc08dd29a931ea6` | `idea-f04-schema-sCGfOMJq.log` / `73f65d4ed1d6b4b90a38d618533b44cac0a09203ffabb1805cfd9ad96e6e6072` |
| Audit 7/7 | `idea-f04-82be13e-4bi9yM` | `f04_919da82a8b4541eeb37d85aad52ae407` | `idea-f04-schema-pdYhRBvi.log` / `77afbccbea9599b1dbda4bb182968bad1a87b4d9c216de64c6183bb92ea63e6b` |

| Suite | Surefire XML SHA-256 | Surefire text SHA-256 |
|---|---|---|
| Schema | `557402de201cc12dd511002339b9ae5c02877dfd22c1fe30a9ef480fec6aee35` | `2b5fb8da291b786da6f9b92e4672d10244dbc1d8fada733966b798bf468df47d` |
| Predecessor | `7555f281346a90f79362502e294431929e38ad7d7c92fd3d77a6c91e778c5dbd` | `4aefea9d6cb0ef98ee819fd3d97b779c4d681e9d5630fe70dcc2f01192153234` |
| Audit | `e0b7445cd02f4dbb9be9fc2410f7303c1094b189773e6cf1cbc4b5166f4d0573` | `ed18d9ac41a447780862fa7edbb8fabba76d6ed02643a0ed7bca498c12271a74` |

## 6. Historical RED/GREEN and qualification provenance

These are execution observations, not retrospective passing claims. Logs remain on the server;
table log names below are relative to `/home/phuclam/`.

| Behavior | Exact source / observed result | Retained log / SHA-256 |
|---|---|---|
| Missing ENVELOPE-9 RED | `ebde18c044274877853342735cffcd6e143e9fa7`; 1 test, 1 failure | `idea-f04-schema-Z4G2lEwV.log` / `decaa82f8b7b032586be0ac9fb926703500b13654dc2cfc719dc249ce2016f80` |
| Minimum schema GREEN | `3e8928a55bedfdbb7c289eb9c4ed417a7c1a79d3`; 1/1 | `idea-f04-schema-INqYRoZh.log` / `0fc64da5d43ec00324e094263bf683c9dd9b2c0f337b7539d176cdd387f4cd64` |
| Sample accepted uniqueness RED | `fd3d87027d155a98dea0f11e85d43d1c7a0fcf8a`; 5 tests, 1 failure | `idea-f04-schema-6pZ3eMJM.log` / `de48e8c81f63f9e9c6d8664ab2309599ff574d11e8f4877129c9242831619030` |
| Sample accepted uniqueness GREEN | `f43f6419c28c9d2ea2d8ab24b025981a5f217613`; 5/5 | `idea-f04-schema-J6GKXHmH.log` / `f26e5b1227194c46a167659da847c70696611f0340a4efd68bc72f0eb711f39d` |
| Sample mutation RED | `30e282ce9f24e1975bc03cb38fa993c3105dfb9b`; 6 tests, 1 failure | `idea-f04-schema-PlVkvKgW.log` / `b45fdeb0db7f12f16417f7e345c12e4a0d130735c5292071cafd7486a0711bbc` |
| Sample mutation GREEN | `cb654082fb93547b92eaedb9a377ac0bd97f5bc4`; 6/6 | `idea-f04-schema-vbqSO4CH.log` / `3ef36f6f0269280faff35107b733a4b26a7ad11cf8a60a79f443fdc68f21fb34` |
| Audit repository absent RED | `bc9b11aa6a00c8999868fb0ef6e9229190247f30`; compilation failed solely for absent repository, tests NOT-RUN | `idea-f04-schema-scykeJGI.log` / `715e24853d1c124c895b71353bfa43860e0aaa51c224de683be8c98d65279512` |
| Missing Audit correlation RED | `d2c4676a4865ba96cc8c6f67eb859f8cfb51c337`; 3 tests, 1 failure | `idea-f04-schema-if9hR4ze.log` / `77c3691f4ed6d9a5e0a89bab57e3aea174b6805b6196dc6ebb19abb509d1a593` |
| Required correlation GREEN | `1dff031f561e861e7ff7d6f3852174011b45576d`; 3/3 | `idea-f04-schema-gdy6EAVp.log` / `da0cc487480ef527ebf2f93b4163daff20bede86e38ebd6d35ac3f851a60cf97` |
| Auto-commit Audit RED | `e999fcf6c6fd97ca15632aa762836d2f6c961902`; 4 tests, 1 failure | `idea-f04-schema-s0azk0JD.log` / `7b1981efa91adc50a06e552b09bcb5c5ee94bac8f72879097a5898c954a4cce7` |
| Caller-transaction guard GREEN | `06474949605f37507cd51eecf3eca6cdad9b059c`; 4/4 | `idea-f04-schema-ugCIqmK8.log` / `4fc48a227f2d8793119655d7af3d77485881ec8c1316a2e2cc27d17c3650ff3d` |
| SQL error propagation, first GREEN | `66218d53a233d6db099b00c0a852d0f4ba71b8f4`; 5/5, real FK `23503`; caller savepoint remains usable | `idea-f04-schema-lY5K3jCE.log` / `9a16ea8ba65617873c5144b1a5543218ee3936a90b70047e1dad2a345f92906d` |
| Suppressed zero-row insert, first GREEN | `4b6caaae07be6decac59a6449ff2d49f9dc82e9b`; 6/6; existing one-row check propagates failure | `idea-f04-schema-DeII6IL8.log` / `79a56901161b859519385c2010aaec5968009a564aaf12280d7a2c2586fdd236` |
| Visibility/refusal provenance, first GREEN | `bbe4f21142becd19da3f6e44dc42a3418412899f`; 7/7; existing caller transaction fate confirmed | `idea-f04-schema-3us5Q0DL.log` / `16204c7c6421749d2de410b713ee690c3eb4120fb8e69de77cb583a39c631b7b` |

The early fixture errors at `f64202d...` (migrator cannot SET ROLE to app) and `02ae13b...`
(second Organization violates the existing singleton baseline) were setup errors, not valid
requirement RED. Successor fixtures authenticate the actual app directly and reuse only their
own schema's Organization. An initial mixed compile error was likewise not the focused Audit
RED; `bc9b11a...` is the cleaned missing-class witness. Interrupted/unconfirmed runs are not
included in passing totals. No error was erased or reclassified as a passing test.

## 7. Review and admission repair

Internal reviews compare design merge `53c1e174cb0410658752ee48ee97ac1dce05ba6b` to
`31d5138dba35f6e05970b16dbbf755a6b9298226`, then inspect successor changes separately.
They read source/spec; neither independently inspected private raw logs or executed tests.

### Standards

Three documented findings: build-admission checks overstated, v0.1 control envelope incomplete,
current handoff still identified documentation-only #29. The successor runner checks qualified
inputs/versions and both database/public CREATE boundaries; the current v0.2 envelope and handoff
separate implementation #31 from historical design #29. The follow-up owned-schema assertion
also checks the actual runtime role. A possible UUID-array fixture Data Clump is a judgment
opportunity, deferred to owned-fixture extraction at T023-B, not a production defect or blocker.

### Spec

One finding: missing unchanged-build-graph admission guard. Read-only successor review at
`acc8db51f9f1099e599421cb676bf136d3c1ee74` confirmed the five pins against the qualified source
and closed this finding; no other schema/Audit mismatch or scope creep found. The later
`82be13e...` adds only database/schema prerequisites and is separately rechecked before handoff.

Admission qualification command: `python3 apps/server/scripts/qualify-f04-build-preflight.py`
from the exact `acc8db5...` archive. Five cases passed: unchanged inputs exit 0; changed POM,
lockfile, installed version and added Maven extension each exit 1 with bounded BLOCKED reason.
No Maven build, credential access or database access occurred. Retained summary:
`/home/phuclam/idea-f04-acc8db5-6lEASw/preflight-results.log`, SHA-256
`323637ea02d411ee18054222a5876235e0d214cf8182eab00f4d00f919792ae2`;
individual fixture logs: `/home/phuclam/idea-f04-preflight-uvt8jmb0`, mode 600.

An earlier preflight-only run at `0a4ccee...` blocked before build/DB because Windows Git archive
converted text line endings. Current and qualified retained POM raw SHA-256 both equalled
`32c4432479955693644a8677b1ed8d209e5b6a823294a11725e8f9afb48d349d` and their Git blobs
matched; the successor normalizes only CRLF to LF for textual Git-blob comparison. No dependency
or authorization change was needed. This guard repair is not falsely called an application RED.

## 8. Current limits and handoff

The three current server logs are mode 600 under phuclam. Retained hashes identify those files;
they do not substitute for independent raw-log inspection through GitHub. Local secret scanning,
diff/trace checks and successor review are recorded at publication, not inferred from Maven.
No source/test/dependency/migration changes after the current executed SHA may inherit these
results without an affected rerun. Documentation-only successors are identified separately.

T023–T026 remain unchecked; #31 remains OPEN and F04 remains IN_PROGRESS. The immediate
schema/Audit checkpoint does not establish owner atomicity, authenticated ActorContext bridge,
business REFUSED, replay/result-access policy, event repository integration or IAM commit races.
Those are the next authorized T023-B through T026 units. Whole-F04 acceptance remains PENDING.
Affected F03/data/health regression is NOT-RUN for this partial checkpoint, not inferred from
prior F03 success. Verifier stays NOT-RUN. No F05, product API/RBAC, dispatcher, preview deployment,
production/recovery/commercial claim or merge was performed. The existing preview is unchanged.

## 9. Final fixture repair and successor execution

The tracked-text secret check initially flagged two environment-variable-name literals in the
test fixture's credential-selection ternary. No credential value was present. The successor
at `a7a577b00f4ea427b609b4b862e6f72309ed94ec` uses an explicit exact app/migrator switch and
rejects an unsupported role. The secret scanner and its exclusions were not changed. This
repair changes only `F04SchemaTest.java` after the v0.2 documentation commit; production Audit,
V8, build inputs and dependency graph are unchanged. Because all three suites use this fixture,
all three were rerun from the successor archive identified in the current control envelope.

Each command is the selector-specific scoped command in section 4. All runs used the admitted
offline tooling and controlled DB, with actual separate app/migrator authentication. All returned
Maven exit 0 with zero failure/error/skip. Schema/Audit runs applied eight migrations; the
predecessor run preserved its missing-attribution rollback witness, then applied V8 once and
repeated with zero new migrations. Result hashes were retained before each exact owned-schema
cleanup; each cleanup returned COMPLETE and confirmed absence after the test JVM completed.

| Suite / result | Build directory under `/home/phuclam/` | Exact owned schema | Log under `/home/phuclam/` / SHA-256 |
|---|---|---|---|
| Schema 7/7 | `idea-f04-a7a577b-kN1pJi` | `f04_7394460252c8490cac929f2b6b671359` | `idea-f04-schema-2galWg2w.log` / `e1719f800e711cd6ac715bf1a52df88bce99ceedcfd090f20717578a26ba8abb` |
| Predecessor 1/1 | `idea-f04-a7a577b-6inkHU` | `f04_69df7a2ac6a54931b77cf51b85b1710f` | `idea-f04-schema-eXBrDpoV.log` / `171a9a7c48f3c08508e380b467030e9969a818f413e9de980a593666ad940064` |
| Audit 7/7 | `idea-f04-a7a577b-M8tZez` | `f04_53ae39ad3bc74758b1e4fb0f4fa3db99` | `idea-f04-schema-xMbggQsz.log` / `fad7a56aa3dabe822ba231aa556ff6d7c50c24639938fba25e995320f4023ee1` |

| Suite | Surefire XML SHA-256 | Surefire text SHA-256 |
|---|---|---|
| Schema | `e07248f89fe54183a1354994559e1feab7f6f785d8c1f4df1442c86f3d1d7bc6` | `e7aa74eb65194d0ffd458af44d262648eefbb00e75ee4b6e7f9d853786a65377` |
| Predecessor | `f4a30a9aadadef6165c0fdc148794e04bce13b4950feb607dd06fc37231b37b9` | `7217313bd457abe88bdccc436ebf8736031a16057ec955c0a33c9af69e59c14f` |
| Audit | `c7135b7b3529762738f6299f0b2f40d58739ac12307511172e24a524dc1ff6e0` | `040436080979b2935647befa83e5bd458cf7b3151dd0fb865ed23aa7516ea228` |

Post-run read-only catalog checks returned `PUBLIC_TABLES=23`, `F04_SCHEMA_COUNT=0`,
`APP_DB_CREATE=false` and `APP_PUBLIC_CREATE=false`. The three successor logs are mode 600,
owned by phuclam. Catalog counts are cleanup/prerequisite witnesses, not an independent comparison
of historical public data or a new public-schema qualification run.

Internal successor reviews at exact source `a7a577b...` remain separate:

- Standards: the three documented findings and follow-up privilege gap are resolved; no new
  documented-standard breach. The possible UUID-array fixture Data Clump remains a non-blocking
  judgment opportunity for T023-B, not a production defect.
- Spec: the unchanged-build admission finding is resolved; no remaining schema/Audit mismatch
  or scope creep in this checkpoint. Unimplemented owner/race behavior stays NOT-RUN.

Both are read-only source/spec reviews, not independent execution or private raw-log review.
The standalone local `tests/ph1/check-no-secrets.ps1` run after the fixture repair returned exit 0:
no secret-like values found; ten exact synthetic fixtures recognized; 233 known binary files
skipped. This is scoped tracked UTF-8 text scanning, not an all-format secret audit.
The publication successor changes only evidence/task/handoff documentation; application/test/
migration/build content must remain identical to the current executed SHA for these results to
apply. External checkpoint review and whole-F04 acceptance remain PENDING; all section 8 limits
remain in force.

Publication uses a `[skip ci]` head commit because the existing active `verify-template.yml`
workflow triggers on push/pull_request, while verifier execution is outside this authorization.
This uses the documented [GitHub skip mechanism](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/skip-workflow-runs),
not a workflow/configuration change or a passing CI result. Any pending required check stays
pending; this draft checkpoint is not authorized for merge.

## 10. Review-discovered Python omission and clean requalification

The Project Reviewer technically accepted the schema/Audit checkpoint for continuation, while
finding that the original F04 tooling authorization omitted the Python harness utility. Prior
15/15 executions remain technically valid PostgreSQL evidence; their tooling-control envelope
was incomplete. Sections 1–9 are historical receipts, not proof Python had prior approval.

Prospective authority is [IE-RES-F04-PYTHON-AUTH-20261002](../../../docs/research/2026-10-02-f04-python-harness-authorization.md),
committed with the guards at `12555689fd38218d5fe28bfa507215acde45187d` before requalification.
Installed `python3 --version` returned CPython 3.14.4; the exact `/usr/bin/python3.14` hash and
standard-library-only import scope are recorded there. The runner pins that interpreter and
invokes `-I -S`; no pip, virtualenv, third-party Python dependency, download or install is used.
Authority is F04 harness-only and prospective; original authorization text remains unchanged.

The three section-4 commands ran from exact source `1255568...` and archive SHA-256
`fad80258426aa4e034647eaee3844ff10e99296f49e153d34b9a6a1b21d5aa6d` (the v0.4 control envelope).
All passed under the repaired tooling envelope: **15 tests, zero failure/error/skip**, offline
Maven exit 0. The runtime receipt on each run reports `F04_PYTHON=CPython-3.14.4; ISOLATED=1;
NO_SITE=1; INTERPRETER_SHA256=EXACT`, followed by the unchanged nine-artifact/build preflight.

| Suite / result | Build under `/home/phuclam/` | Fresh owned schema | Log under `/home/phuclam/` / SHA-256 |
|---|---|---|---|
| Schema 7/7 | `idea-f04-1255568-SxM4c6` | `f04_804260da3a004aff97b99b1a12535667` | `idea-f04-schema-CQvc0iak.log` / `c28d858d493e22e17fba520510d4e0c25821437ddfc1396b6770ff68ab5e1f23` |
| Predecessor 1/1 | `idea-f04-1255568-UO9SQv` | `f04_3f0ae75896c44492a401b41e557d97f4` | `idea-f04-schema-BiGsPWh9.log` / `a5f47948aa9a6015ffe1563fbee582b04622f686d946c28f6917b1d914cc7f2a` |
| Audit 7/7 | `idea-f04-1255568-cLus8N` | `f04_b8da76c81a3e4f00b947df3c997f194d` | `idea-f04-schema-8GM4EqA4.log` / `e9c6fc0fce19d1fbc3bb702e609056e85c0aa2614b2eebd1b80db16ef9dc1c36` |

| Suite | Surefire XML SHA-256 | Surefire text SHA-256 |
|---|---|---|
| Schema | `c4cfbb1f95566e2e72a98345d8927a2f54b1758274b0e4fa5ab8b7c7cae1c7f1` | `28ef0c555283203610af59583b1ae8e002afd8c4063782dd01d591971b7d9ee0` |
| Predecessor | `3635a607f73a3b27214f3f57e79f075c9ab3377c5676ccc47a9f52fb978981dc` | `f89c35abded98e7218f5c7d0db425799a1b48755142c25888fac84b3ca37f541` |
| Audit | `8dd53fdff7b1f1656d5bd4befd822db767d1a4d4ff254107880f484b4bcb034f` | `78369d72c622d083cb97fa3e17970963e5de3cf1c5448b6e11c9fbb8c4677021` |

Each run authenticated the distinct app/migrator roles and used a fresh tagged schema. Each
retained its reports before `F04_OWNED_SCHEMA_CLEANUP=COMPLETE`; the test JVM had completed,
the exact marker/owner was checked and absence confirmed. All three logs are mode 600, owned
by phuclam. No historical-public migration or credentials in output/evidence. Private-log access
limitations remain. The clean requalification allows the approved T023-B tracer to begin, not
T023–T026 completion or whole-F04 acceptance; PR #32 stays Draft and unmerged.

## 11. T023-B authenticated owner RED/GREEN

Objective: qualify only the approved internal authenticated sample seam, not a product command.
Prerequisites: clean section-10 requalification, the exact original tooling/cache plus prospective
Python envelope, real PostgreSQL 18.6, separate app/migrator and fresh run-tagged schemas.
No dependency, migration, production authentication/session behavior or permission changed.

`F04SessionFixture.SignedIn` is a named test value object. It creates a synthetic native identity
through the existing bootstrap service, starts the actual Server on a random loopback HTTP port,
and uses real CSRF/form sign-in plus the existing protected session route. A test-only filter
captures `SessionService.Identity` from the Server security context only after that protected
route returned 200, then calls the existing `SessionService.context(identity)`. Anonymous access
captures nothing; supplied query/header ActorId does not change the established Actor. No F04
HTTP route, Swagger operation or bearer-proof output is introduced. Cookies/CSRF/credentials stay
in test memory and are not printed or retained. Loopback HTTP and `cookie.secure=false` are
test-only transport overrides; this run is not HTTPS or actual-client qualification.

`OwnerSessionEligibility` uses existing IAM eligibility on the owner connection, resolves the
exact Account Organization, and revalidates under the existing security-write lock before commit.
`SampleOwnerCommandService` opens the authoritative transaction. ACCEPTED writes the existing
sample result, required Audit and one common-store ENVELOPE-9 event. The original Actor,
Organization, OperationId and correlation remain exact; EventId is independently allocated and
different from OperationId. Audit's existing table has no Organization/EventId column: the exact
operation link joins its Actor/correlation to the retained owner and event, rather than inventing
new Audit fields. `CommittedEventStore` only appends through the supplied connection; it has no
sample lookup, owner decision, independent connection or commit. DB supplies `recorded_at` using
its transaction timestamp, not a claimed exact wall-clock commit instant or delivery receipt.

The business decision is explicit synthetic fixture input, not an approved product policy.
Business REFUSED writes only its terminal owner result and required refusal Audit in the
refusal-evidence transaction, with `SYNTHETIC_BUSINESS_REFUSAL` and zero event. It does not
refresh successful-session activity. No technical FAILED result is synthesized; a propagated
commit error is not a claim of confirmed rollback. Fault/uncertainty and rollback/refusal handoff
qualification remain C/D work, not inferred from these positive tracer executions.

Command for each exact source below:

```bash
bash apps/server/scripts/run-f04-postgresql-checks.sh OwnerOutcomeTest
```

| Stage | Exact source / actual result | Archive SHA-256 | Build under `/home/phuclam/` | Schema / disposition | Log under `/home/phuclam/` / SHA-256 |
|---|---|---|---|---|---|
| Existing authentication seam qualification | `6ce0e6ac390874b247117a1d521fe7b904b081b4`; 1/1 first GREEN, not fabricated RED | `a6faa5c5514981fd36ed61d5e4776c8607ff98afad836fda098547f0706a7df7` | `idea-f04-6ce0e6a-1KNMN7` | `f04_dc4ddc2bbd8e47c4976628ac1abf5707`; COMPLETE | `idea-f04-schema-FnWAjIql.log` / `c0de8b23db2028016349e4aebd66aa32c0f286ea9c5e78dad9dc306e93727f56` |
| ACCEPTED tracer RED | `c38cf28b967eaf273705b09fa52c7e233dd68688`; testCompile failed only for absent owner/eligibility classes; tests NOT-RUN | `c33716470e0cea8c12c64070277a05e8106b67a017373f18bb218564d19737ab` | `idea-f04-c38cf28-BJ9DQA` | `f04_f621a4028e87409b90c58db144cc80ee`; NOT-CREATED | `idea-f04-schema-hbMQLmrA.log` / `d8e36ab3fb0bf0d59d169a73fd41e6364df0bf2cf47f24f52ae15343cc5831bd` |
| Minimum ACCEPTED GREEN | `0a629dfc7b6d356d4c5eebf6335d83a009472c26`; 2/2, zero failure/error/skip | `e6f7580449f17212058ee2fc26b401d787366866d30afafe48d5b455b2466a61` | `idea-f04-0a629df-MJkBG9` | `f04_8a0667b55add4c7c8366207c6d9156eb`; COMPLETE | `idea-f04-schema-B58zmFZY.log` / `27b3664f47e0691b6e91b437521ad667b7d0c4ee037e879928f763dcf69911d5` |
| REFUSED tracer RED | `a20da3d6388913200b735b6d050904c41f6d1cf9`; 3 tests, 1 error: deliberate REFUSE still unsupported | `2757b12fd997f93c18978e25c9e02751513eb7772522ae96f57bea34bc1023b6` | `idea-f04-a20da3d-wlKFdK` | `f04_952748311cca4b4e8a7be8df1b4e9b1e`; COMPLETE | `idea-f04-schema-pCwPdnFZ.log` / `ae972c07bf535f80cb6e1857292ff53d51facf7b7b42e27b4df0ec41685a7fc9` |
| REFUSED/ACCEPTED GREEN | `fbd1ffc6fff7ed5952907316845a8110491cf779`; 3/3, zero failure/error/skip | Current envelope | `idea-f04-fbd1ffc-59BYJd` | `f04_b9c6695afcd3470398bafe28bbf3a1a5`; COMPLETE | `idea-f04-schema-Apr3eirs.log` / `70f96e377a7101f0d6b3d087afb0b5f7b28f29bbbcc622ff0be9e56076339c2b` |

The accepted test verifies returned provenance plus exactly one independently queried owner,
Audit and event. The refused test verifies returned provenance/reason, one owner/Audit companion
and zero event. The source at `c38cf28...` also routes capture through the original IAM context
factory rather than repeating its constructor. Its compile RED is not falsely claimed as an
executed HTTP/SQL test; that capture is exercised by the successor GREENs.

| Stage | Surefire XML SHA-256 | Surefire text SHA-256 |
|---|---|---|
| Initial fixture | `95f7f8f04285866f5ec76629c75c1976b50417d2910aa7fce6462f4ef13e6331` | `b05dbf995825935f8671f58e142f20d23a838b36926b9ee91939096e7ba67e1e` |
| Accepted GREEN | `ef3fb04e1bbc9d80a66a3d8b289ec7b6b3b9028d68bd071ab668e49cae4a99b8` | `d3fc51e0f656ce5a3e8e4c98506f69d9f41462223a68a8e2e1750004d8ee6779` |
| Refused RED | `afa5a78996d8865928b277c9170b49d10baa193efb27797c439cad0dd4dbcf9d` | `036a7077f67dc746874082395d158bff53ac4bdec410c90e8bc205d56fca1f84` |
| Final owner GREEN | `eb711864de586b2838856e99ea92749510efdd4b318254399f9458d7742eeafe` | `57298f7aa2fc99f5932ebbd21ebf5d1b64957aee533e5daafcd398a7cc51b2c8` |

A mistyped local helper invocation used a nonexistent source object before the final GREEN.
Git archive failed closed before SSH, Maven, schema creation or any test; it is neither a product
RED nor an execution receipt. The final GREEN used the exact committed source above.

## 12. Affected regression on the final owner source

The section-4 three commands ran again from `fbd1ffc...` and its current-envelope archive.
This is **15/15**, in addition to the owner **3/3** at the same source: **18 tests**, zero
failure/error/skip, Maven exit 0. All used pinned isolated Python, unchanged nine build artifacts
and qualified graph/cache, offline Maven, actual app/migrator and the approved database.
These are focused F04 regressions, not a rerun or new claim for whole F03/data/health acceptance.

| Suite / result | Build under `/home/phuclam/` | Fresh owned schema / cleanup | Log under `/home/phuclam/` / SHA-256 |
|---|---|---|---|
| Schema 7/7 | `idea-f04-fbd1ffc-gUm2lL` | `f04_7e7c8632cb6a49c19a1d1432b9f9d7c9`; COMPLETE | `idea-f04-schema-YZSSbX1u.log` / `1abd1781be23dad9dac6c5227030906a129a5a18b18cfe83f9a0257cf3afee5c` |
| Predecessor 1/1 | `idea-f04-fbd1ffc-hNiUgV` | `f04_5d0f126b685f47248c9a5ab8af69d1c5`; COMPLETE | `idea-f04-schema-hPSkYNrI.log` / `4122ae06de7e845d62682066543a3d956ecab9cae32fa14dc95fc751d7d7cad3` |
| Audit 7/7 | `idea-f04-fbd1ffc-M3UCE5` | `f04_5ce8a9d45228493689821b6a36de156a`; COMPLETE | `idea-f04-schema-OKFn5T6P.log` / `b7004fdcde20addf69b55557b3a0d632b4dae075884058012df5dbd79c57836f` |

| Suite | Surefire XML SHA-256 | Surefire text SHA-256 |
|---|---|---|
| Schema | `a3fb198a8624776fac7fabd498a218ac2c0886d4d3ac187757903002f320432f` | `ef7b0f654e171d7ee5c439b8688ece0a562262d5ec1e9a13676ad633e1fbec65` |
| Predecessor | `2b22e50d66cf0c3dd5859297870dcc15d4c12038562a9e22c00b8e8f40ec7863` | `8916f3221f7ec3c4605702232e50492f86a97e898009a51b0f04fad8fdcf1c30` |
| Audit | `eaa108c4ad830d7dbb8bb6ae62dce2e7a4577b204005a20b098aa4547a6ef45a` | `ca811065f88e9404e0059168db2b81a58253f9f9c6c9b109e9bde4ba027a3a22` |

Each completed run stopped its Server/pool/JVM before marker/owner verification and exact-schema
drop; absence was confirmed. The compile RED never created its reserved schema. Logs are mode
600, owned by phuclam; hashes identify private receipts, not independent remote raw-log review.
No public, preview, company or Vault data was an execution/cleanup target.

## 13. Current review boundary and remaining work

Publication after the current executed source must change documentation only. Original tooling
authorization, V1–V8, F03 evidence, dependency/build inputs and the persistent preview remain
unchanged by this successor. Internal reviews and tracked-text secret scan are recorded at
publication; neither is independent execution or human acceptance.

T023-B and minimum T025-B are a partial qualified checkpoint. T023–T026 stay unchecked,
Work Item #31/F04 remain open/IN_PROGRESS and PR #32 stays Draft, unmerged. Next eligible unit
after checkpoint review is T023-C paired with T025-C: canonical same-ID replay, fresh same-Actor
result access, non-disclosure to other Actors/ineligible proof, concurrent accepted/refusal
arbitration, required append/zero-row/deferred-commit faults and retry after confirmed rollback.
Then T023-D/T025-D must qualify disable/revoke-before-commit and reverse ordering under real IAM
coordination. Current source uses the existing final lock/check; it does not claim the race has
been exercised or the full rollback/refusal handoff completed. T026 still owns broader affected
data/identity/health execution and whole-contract evidence/review.

No F05, dispatcher/publishing infrastructure, product HTTP/Swagger/RBAC, mutable demo entity,
general operation service, client binding, production/recovery/HA/commercial approval, tracker
action or merge. Verifier remains NOT-RUN. Sections 1–10 describe their historical control
versions; their “current” wording is not a successor-source claim.

## 14. Publication review and trace checks

Internal read-only reviews compared checkpoint `fb69096f...` with executed source
`fbd1ffc6fff7ed5952907316845a8110491cf779`:

- Standards: zero documented breaches. The named identity/session fixture resolves the earlier
  UUID-array coupling note for authenticated tests. A possible duplicate owner-service setup in
  the two tracer tests remains an optional maintainability note; the distinct SQL oracles stay explicit.
- Spec: zero mismatch or scope-creep findings in the prospective tooling repair and bounded
  T023-B/minimum T025-B ACCEPTED/REFUSED slice. C/D obligations remain explicitly unqualified.

These reviewers did not run tests, access PostgreSQL or independently inspect private raw logs.
The scoped tracked UTF-8 secret scan returned exit 0: no secret-like values found, ten exact
synthetic fixtures recognized and 233 known binary files skipped. This is not an all-format audit.
Diff whitespace check passed. All 78 local Markdown path targets in the five affected records
exist; anchors were NOT-CHECKED. The original tooling authorization, V1–V8, POM/Web inputs,
SessionService and historical F03 evidence have no changes after the previously accepted
schema/Audit checkpoint. Successors after `fbd1ffc...` change only documentation.

A final supplementary read-only SSH catalog probe timed out before executing. Its aggregate
schema-count/privilege observation is NOT-RUN; do not infer a new catalog receipt. The completed
per-run marker/owner checks, exact schema drops and absence confirmations in sections 10–12
remain the executed cleanup evidence. The timeout does not change those retained results.

PR #32 remains OPEN/Draft and Work Item #31 remains OPEN; main is still
`53c1e174cb0410658752ee48ee97ac1dce05ba6b`. Publication uses the existing `[skip ci]` mechanism;
verifier remains NOT-RUN. The publication head and review surface are recorded on PR #32 and
Work Item #31; no merge, F05 or additional implementation is performed at publication.

## 15. T023-C/T025-C scope and execution

The Project Reviewer accepted T023-B for continuation at PR head
`a005f344558b8d4720218b3801e7e5adf3c79a19`, executed source `fbd1ffc...`.
The next assigned unit was the bounded internal sample replay/access/concurrency/fault matrix.
This record does not change the approved sample policy or reopen ADR-0014.

Standards applicability for this record and its subordinate receipt index:

| Register ID | Exact edition | Project classification / disposition | Local applicability and tailoring |
|---|---|---|---|
| STD-INFO-001 | ISO/IEC/IEEE 15289:2019 | STANDARD-GUIDED / TAILOR | Combined verification narrative plus machine-readable receipts; retain separate item identity, configuration, results and limitations |
| STD-CM-001 | ISO 10007:2017 | STANDARD-GUIDED / TAILOR | Pin source/archive/tool/schema/receipt identities and documentation-only successors; no broader configuration-system certification |
| STD-TEST-001 | ISO/IEC/IEEE 29119-1:2022 | STANDARD-GUIDED / TAILOR | Separate verification, acceptance, expected RED, execution result and uncertainty |
| STD-TEST-002 | ISO/IEC/IEEE 29119-2:2021 | STANDARD-GUIDED / TAILOR | Bounded vertical TDD/qualification, prerequisite checks and exact-schema cleanup |
| STD-TEST-003 | ISO/IEC/IEEE 29119-3:2021 | STANDARD-GUIDED / TAILOR | Configuration, procedure, oracle, actual result, retained hashes and review limits in linked records |
| STD-TEST-004 | ISO/IEC/IEEE 29119-4:2021 | STANDARD-GUIDED / TAILOR | Concurrent arbitration, access refusal and required-companion fault cases scoped to F04 C |

This applies the repository register's authoring guidance; it is not a conformity claim.

Objective: resolve one canonical committed result per OperationId; preserve original provenance;
deny other/ineligible callers without disclosing the result; serialize same-ID decisions across
the refusal handoff; prove required-companion faults cannot leave partial success.
Oracles and exact test names are in section 18. Preconditions and commands from sections 4/11
still apply, now under both the original build authority and prospective Python admission.

All C execution used Temurin 25.0.4.1+1, Maven 3.9.16 offline, pinned isolated CPython 3.14.4
(`-I -S`, standard library only), PostgreSQL 18.6, distinct `idea_ddm_migrator`/`idea_ddm_app`,
the exact nine build artifacts/descriptor, five qualified build inputs and eight direct Web
versions. The ordinary build lifecycle used the retained Node 24.21.0/npm 11.19.0 Web cache.
No dependency, migration, tool install/download, public-schema write, company identity or Vault
access was added. Existing pgJDBC 42.7.13/HikariCP 7.0.2 were inspected and qualified in place.

Each suite ran separately from its exact archive:

```bash
bash apps/server/scripts/run-f04-postgresql-checks.sh OwnerOutcomeTest
bash apps/server/scripts/run-f04-postgresql-checks.sh F04SchemaTest
bash apps/server/scripts/run-f04-postgresql-checks.sh F04PredecessorMigrationTest
bash apps/server/scripts/run-f04-postgresql-checks.sh AuditEvidenceRepositoryTest
```

The two focused REDs selected only their named owner method using
`OwnerOutcomeTest#<method>`. The runner executed offline `-o -B -Dtest=<selector> test`.
The [structured receipt index](F04-C-execution-receipts.json) retains all 62 invocations:
exact selector/source/archive/build directory/schema, observed counts/exit, raw-log SHA-256,
both Surefire hashes and cleanup disposition. There are 60 passing suite invocations and two
expected RED invocations, not a claim of 62 passing tests. The final checkpoint total is 31.
Host log modification times are recorded as such, not asserted test-start times.

## 16. Individual vertical slices and source-review repairs

The total column is the owner suite plus unchanged schema 7, predecessor 1 and Audit 7.
Each completed slice below ran all four suites. A previously implemented behavior that first
passed is labelled qualification GREEN; no artificial RED or unnecessary production change was
created. The receipt index gives the complete run configuration for every row.

| Slice | Exact source | Observed witness / disposition | Combined regression |
|---|---|---|---|
| Accepted replay RED | `47fc161da96a398b052918c3e4fef27102e91964` | Fresh HTTP session, same Actor/OperationId: duplicate sample PK, PostgreSQL `23505`; one test/error, Maven 1. Not a fixture failure. | Focused RED only |
| Minimum canonical replay GREEN | `7ceb31742e810ba52232e15625313258b08147bd` | Read committed original under sample lock; retain original correlation/EventId, no second append. | 19/19 |
| Terminal REFUSED replay | `270ee6e8b3cdfa9bc0a78bed8dd079b662ba4b47` | Qualification GREEN: changed ACCEPT input still resolves original REFUSED; 1 owner/1 Audit/0 event. | 20/20 |
| Other Actor / revoked proof | `74896458b01579dd05fe2bb9451d079fe7eda7c5` | Qualification GREEN for both terminal outcomes; no disclosure or companion change. | 21/21 |
| Concurrent ACCEPT/ACCEPT | `5a7505c5b781ffe6612cb0d084b839243138b314` | Qualification GREEN: two actual lock waiters resolve the same retained winner; unrelated ID proceeds. | 22/22 |
| Concurrent ACCEPT/REFUSE | `74f0f708f395ba5f5ea894cd4673c6b2432bd12e` | Qualification GREEN: assert canonical consistency, not scheduler winner. | 23/23 |
| Rollback/refusal handoff | `a05bcae867746773de0f23e0e5bb7832b4b1aced` | Qualification GREEN: REFUSED insert held after rollback; ACCEPT loser remains blocked on the sample lock. | 24/24 |
| Required Audit failure / same-ID retry | `32026787266d0d7da9a0944d1597a3d6d2d7a124` | Qualification GREEN: independent observer confirms 0/0/0; removed fault permits canonical retry. | 25/25 |
| Required event failure | `27799806626bf85ee180f1dff62bde480b61c9e9` | Qualification GREEN: 0 owner/0 Audit/0 event. | 26/26 |
| Suppressed Audit insert | `3b29154f89d471bf0be49e2115cd41626fd4f079` | Qualification GREEN: required zero-row append fails, no partial commit. | 27/27 |
| Suppressed event insert | `325ef99082f904e93868e39aea3e15f2fff5ec5c` | Qualification GREEN: required zero-row append fails, no partial commit. | 28/28 |
| Deferred commit failure | `bbd66fd10f4e279456b37a961f4edd526f20d273` | Qualification GREEN: no success returned; independent 0/0/0 and unchanged session activity prove non-commit. | 29/29 |
| ADR handoff source-review repair | `79c3336283c0520de64bd3ed039d6471c240b50e` | Explicit canonical recheck after rollback and READ_COMMITTED; required by ADR-0014, not a claimed new RED witness. | 29/29 |
| Pooled unlock + abort failure RED | `1a92ecd3395353a009c08c851b7bc9759f20e70a` | Actual Hikari/PG: forced unlock and abort errors expose still-open physical connection at logical pool return; one assertion failure, Maven 1. | Focused RED only |
| Physical discard GREEN | `d4d1c83b4e0139b1252a4361d8b1a1ebbf2a36c7` | Minimal synchronous physical close fallback, shared sample-only discard helper. Actual replacement backend and retained canonical result checked. | 30/30 |
| Bounded lock acquisition | `16b04b2cbb9b9597c41195580d1b8831734545d2` | Qualification GREEN: held PG operation lock times out `57014`; no committed companions, replacement pool connection and same-ID retry work. | 31/31 |
| Final retained REFUSED replay metadata | `4b4b494cbf2a45f8bd9c666c9bc09c7f362d74dd` | Test-only output adds original/retry session metadata and correlation; no application change. | 31/31 |

The first concurrency preparation commit `3afc8d1...` was not executed: its fixture attempted to
read the void result of a PostgreSQL lock function as boolean. The fixture was corrected before
the exact `5a7505c...` execution; it is not recorded as requirement RED or PASS.

RED log identities:

| RED | Retained log | SHA-256 |
|---|---|---|
| Canonical replay | `/home/phuclam/idea-f04-schema-e8ivGhLD.log` | `f933836b707d6dfe43d38fa4457f6bb47358cf29f755f50842ffe68f41c35078` |
| Pooled discard | `/home/phuclam/idea-f04-schema-QjIfu62x.log` | `d188007742080b6a745ca4ab890b33d7aed3e599e716b670cddfcc8ff38ad62a` |

## 17. Canonical implementation and transaction boundary

`SampleOwnerCommandService` acquires sample-only PostgreSQL session advisory lock namespace
`73004001`, with deterministic OperationId-derived key, before admit/create/resolve. Hash
collisions serialize extra IDs but never substitute for the exact UUID result lookup. The
actual PostgreSQL waiter tests also show unrelated IDs are not globally serialized.
The connection is explicitly READ_COMMITTED. The lock remains held across business-refusal
rollback, re-admission, canonical recheck, attributable REFUSED persistence and commit.

Existing committed results are read, not rebuilt from retry input. The private sample read policy
requires the current eligible stable Actor and Organization to match original provenance.
This is not a Core-wide originating-Actor-only query invariant. The service preserves original
outcome/reason/correlation/EventId; it appends neither owner, Audit nor event on replay.
Current eligible-session activity can be updated as authorization activity; it is not a new
owner result or replacement of provenance.

ACCEPTED still commits owner/Audit/event together. REFUSED commits owner/refusal Audit and no
event. Commit coordination remains sample operation lock → existing IAM security-write lock
`73003002` → authoritative commit; no IAM semantics were changed.
Required SQL/zero-row failures propagate. The service does not synthesize durable FAILED or
equate a thrown commit exception with proven rollback.

Acquisition and release are bounded by a five-second JDBC statement timeout. Release must confirm
`pg_advisory_unlock`; failure attempts logical abort and then synchronous physical close before
pool return. The fault wrapper is test-only, around actual Hikari/PG; there is no production
fault switch. If an unlock failure occurs after a confirmed commit, the canonical 1/1/1 remains:
the cleanup error is not rewritten as rollback, and retry resolves that already committed result.

Only three application/test files changed after the accepted B head: the sample service,
`F04SessionFixture` and `OwnerOutcomeTest`. V1–V8, POM/dependencies, IAM production code, event
and Audit appenders, runner and tooling admission records are unchanged.

## 18. Requirement → test → executed evidence matrix

All rows below execute at `4b4b494cbf2a45f8bd9c666c9bc09c7f362d74dd`; actual engineering result
PASS, external C disposition PENDING. Tests are in `OwnerOutcomeTest`, using the named
`F04SessionFixture` real HTTP principal and PostgreSQL fixture.

| Acceptance oracle | Source boundary / test | Observation |
|---|---|---|
| Originating Actor, fresh valid session, exact immutable ACCEPTED provenance | `resolveCommitted` / `freshSessionResolvesOriginalAcceptedWithoutCompanionDuplicates` | Different session reference, same Actor; identical returned original, counts 1/1/1 |
| Original REFUSED remains terminal despite changed decision/correlation | `resolveCommitted` / `freshSessionResolvesTerminalRefusalDespiteChangedDecision` | Identical original reason/result, counts 1/1/0 |
| Another Actor in same Org cannot learn either outcome; revoked original proof is refused | Sample query policy + existing eligibility / `otherActorAndRevokedSessionCannotDiscloseEitherTerminalOutcome` | Fixed other-Actor refusal with no protected cause/suppressed details; revoked proof gets existing Identity refusal; retained results unchanged |
| Concurrent ACCEPT/ACCEPT, no global single-ID bottleneck | `OperationLock` / `concurrentAcceptsResolveOneCanonicalWinner` | Two observed PG waiters, same canonical result, one owner/Audit/event; unrelated ID commits while waiting |
| Opposing decisions, one canonical winner | `OperationLock` / `concurrentAcceptAndRefuseResolveOneCanonicalWinner` | Both resolve winner; event=1 for ACCEPTED, 0 for REFUSED; no scheduler assumption |
| Lock retained across rollback → REFUSED evidence | `execute` / `refusalHandoffRetainsOperationLockUntilRefusalAuditCommits` | PG trigger barrier after rollback; ACCEPT waits; canonical REFUSED 1/1/0 |
| Required Audit failure; confirmed non-commit can retry same ID | Required append/transaction / `requiredAuditFailureRollsBackAllCompanionsThenSameIdCanCommit` | Independent 0/0/0, then fault removed, same ID 1/1/1 with new committed correlation |
| Required event failure | Required append/transaction / `requiredEventFailureCannotCommitOwnerOrAudit` | Independent 0/0/0, no success |
| Required Audit/event zero-row append | Required one-row checks / `suppressedRequiredAuditIsFailureNotPartialSuccess`, `suppressedRequiredEventIsFailureNotPartialSuccess` | Independent 0/0/0, no partial success |
| Deferred failure at commit | Transaction / `deferredCommitFailureIsNotSuccessAndObserverConfirmsNonCommit` | No result returned; independent 0/0/0 and activity unchanged, no FAILED row |
| Pool cannot retain ambiguous operation lock after unlock/abort error | `discard` / `failedUnlockAndAbortDiscardPhysicalConnectionBeforePoolReturn` | Physical connection closed before logical return; replacement backend works; committed result retained and replay-safe |
| Held lock acquisition is bounded | `OperationLock.acquire` / `heldOperationLockTimesOutWithoutCommitAndRetryCanProceed` | Actual `57014`; no companions, lock/replacement connection usable, same ID retry commits |

Deterministic concurrency uses latches plus actual `pg_locks` observations, not sleep-based
scheduling. Fault triggers/functions are migrator-created only in the exact owned test schema,
target the chosen synthetic OperationId and are removed after each case.

Selected final-run provenance (all identifiers are synthetic; session references are database
metadata UUIDs, not browser cookies or bearer authentication proofs):

| Field | ACCEPTED replay | REFUSED replay |
|---|---|---|
| OperationId | `4e149edd-fbc1-4972-b9fe-cbbe1fb589cd` | `ed1edc06-84ac-40be-98ae-94bf6347e4be` |
| Original ActorId | `19e667ca-f317-455a-840e-f72bfcc0c8a5` | same |
| Original OrganizationId | `61943a99-e0f8-4fe7-acc4-8f2dd6321351` | same |
| Original session reference | `8c330161-6ec6-4005-814d-21d80c4ac841` | `42a7efda-de83-4c33-9215-daf4ead792bb` |
| Fresh retry session reference | `b04d12c4-3714-4ee3-891a-84abbe89a1f0` | `da4f4da3-97be-4cb6-ada3-7f3d6d6f623c` |
| Original correlation | `f04-c-original` | `f04-c-original-refusal` |
| Retry correlation, not persisted over original | `f04-c-retry-must-not-overwrite` | `f04-c-retry-accept` |
| Original reason/EventId | NULL / `140f0cd1-ffa0-4bca-810d-91195694280a` | `SYNTHETIC_BUSINESS_REFUSAL` / NULL |

The final opposing-decision run happened to choose ACCEPTED. The test permits either scheduler
winner and asserts the matching event cardinality. The separate held REFUSED handoff test
deterministically proves the zero-event canonical REFUSED loser-resolution path.

## 19. Final exact-source execution and cleanup

Final source `4b4b494...`, archive `c427de8...`, ran all four suites on 2026-10-02.
Each exited Maven 0; failures, errors and skips were zero. Full archive, XML/text and raw-log
hashes are retained in the receipt index, keyed by batch `final-c-regression`.

| Suite / tests | Exact fresh owned schema | Raw log under `/home/phuclam/` | Log SHA-256 |
|---|---|---|---|
| Owner 16/16 | `f04_e3df1debd36446eebae293dae7e82322` | `idea-f04-schema-6BkSDKeC.log` | `1e1cd66a9585ce53da7f5f6859b7e116529ea56f2b204686c398d5a7ceef8675` |
| Schema 7/7 | `f04_62741788076d4e5994c7320648d6d385` | `idea-f04-schema-KItPMGce.log` | `671d8fbf1d7d6cad68a0f6a323500d6bc70ac87941e6a9ded9e1e145d779740f` |
| Predecessor 1/1 | `f04_9bac204d6ad24906a2d8cab0c9407638` | `idea-f04-schema-Gu1Qgwu2.log` | `513da6d5d60ea46f73a647c769c38bf5a36bc6b3adf8fd923a961aa6e9613cb9` |
| Audit 7/7 | `f04_7bd1a62951b34fe28cb37904e38fbb3b` | `idea-f04-schema-VUq1eukL.log` | `2b5e04f404d5471902cbcffaa8ed08a19afb244e0fb00d4736db74a6c6b8ef88` |

Total **31/31** = prior B 3 + C 13 + schema/Audit 15.
Fifteen completed regression batches each retained all four suites. All 62 distinct schemas
(including two REDs) have per-run COMPLETE cleanup receipts: stop owned Server/pool/JVM, verify
exact name/owner/run marker, drop only that schema, confirm absence. No cleanup target was
`public`, another database, preview, company data or Vault.

Raw logs remain mode-600 private host evidence. SHA-256 values were re-observed read-only on
2026-10-03 after quota interruption; no new qualification run was inferred from that hash check.
Public hashes/receipts identify retained evidence but do not replace independent raw-log review.

## 20. Internal source review — separate axes

Reviews compare accepted B head `a005f344...` with final executed source `4b4b494...`.
Neither reviewer ran tests or independently inspected the private execution logs.

### Standards

No remaining documented mandatory breach found. The ADR-0014 handoff finding is closed:
the service rechecks canonical state after rollback under the retained operation lock.
The former disposal duplication is closed by the sample-only discard helper, which attempts
physical close even when abort fails.

One optional heuristic remains: possible Primitive Obsession in the test fixture's
`installAppendFailure(operation, table, boolean suppress, boolean deferred)`.
Named fault modes or small named fixture methods would communicate intent and avoid unsupported
flag combinations. This is a maintainability suggestion, not a standards violation or merge
condition; it is deferred, with no application change after final execution.
The JDBC wrapper and PostgreSQL observers remain approved test boundaries; production contains
no fault-injection switch. No dependency, schema or migration change occurs in the C diff.

### Spec

No remaining actionable findings. The explicit post-rollback canonical recheck is fixed;
pooled unlock/abort discard and bounded-timeout qualification satisfy the identified gaps.
Canonical provenance and current eligibility remain separate. Real-PG concurrency/fault fixtures
are deterministic and scope remains bounded. No scope creep was found.
This is source review only, not execution or Project Reviewer acceptance.

Summary: Standards 0 mandatory findings, 1 optional test-maintainability heuristic;
Spec 0 actionable findings. External C checkpoint review remains PENDING.

## 21. Publication boundary and remaining D obligations

Successors after `4b4b494...` change only this evidence, the structured receipt index and current
task/contract/handoff execution wording. They do not change application/test/migration/dependency/
tooling inputs and therefore do not assert a new executed-source SHA.
Publication checks on 2026-10-03: receipt JSON parses as 62 run records with distinct owned schemas;
15 passing four-suite batches plus two retained REDs; final result 31/31. All referenced source
objects exist. Scoped tracked UTF-8 secret scan exited 0: no secret-like values found, ten exact
synthetic fixtures recognized and 233 known binary files skipped. This is not an all-format
secret audit. Diff whitespace checks passed. All 78 local Markdown path targets in the four
changed Markdown records exist; anchors are NOT-CHECKED. Read-only evidence reviews separately
confirmed source/result/hash alignment and preservation of sections 1–14. PR #32 records the
exact published head; no new test execution is inferred from publication checks.

Stop at C checkpoint publication. T023-D/T025-D still must qualify controlled security-first
disable/per-session revocation before authoritative owner commit, required atomic refusal
evidence as applicable, fresh eligible retry/new operation, and reverse owner-first ordering.
The current final eligibility lock/check is implemented; these IAM race orderings are NOT-RUN.
T026 still owns broader affected F03/data/health and whole-contract review. Whole F04 is
IN_PROGRESS; T023–T026 stay unchecked, Issue #31 OPEN, PR #32 Draft. Verifier NOT-RUN.

No product route/RBAC/Swagger, dispatcher, generic payload/fingerprint/lock framework,
F05 reconciliation, client binding, preview deployment, production/HA/recovery/commercial
qualification, timer correction, whole-card acceptance or merge is performed.

## 22. T023-D/T025-D authority and execution

The relayed Project Reviewer accepted C at PR head
`b6b114e84694d0f8eb2fc6ba87f8e759f35beebb` (executed source `4b4b494...`) and explicitly
authorized D. The review accepts C's sample-only 32-bit lock-key collision trade-off; it does
not authorize a generic operation framework. Sections 1–21 and the C receipt index retain their
historical, then-current wording, including their former pending-review state.

D qualifies admitted-command security loss and the opposite owner-first ordering through real
HTTP-established ActorContext, actual existing IAM account disable/re-enable and qualified
per-session HTTP logout. There is no new product route, Permission, Role Definition or
bootstrap-Actor shortcut. Fixture setup independently grants the existing Account Administrator
v1 assignment to the synthetic operator, using the existing authorized assignment service.

Configuration is unchanged: real PostgreSQL 18.6 at
`127.0.0.1:5432/idea_ddm_f03a_20260930_c91e7a42`, separate
`idea_ddm_migrator`/`idea_ddm_app`, new tagged `f04_[0-9a-f]{32}` schemas only.
Temurin 25.0.4.1+1, Maven 3.9.16 offline, CPython 3.14.4 `-I -S` standard-library harness,
Node 24.21.0/npm 11.19.0 and exact existing cache remain within the two F04 authorization
records. Every execution passed the unchanged nine-artifact/descriptor, five-build-input,
eight-direct-Web-version and exact-runtime preflight. No download, install, new dependency,
migration, public-schema write or preview deployment occurred. Standards editions, classifications
and TAILOR mapping remain as section 15: STANDARD-GUIDED, not conformity.

The real HTTP test transport remains controlled loopback without TLS, as in B/C; this is
Server identity/transaction qualification, not new browser/certificate qualification.
Synthetic credentials, CSRF and ordinary cookies stay private fixture RAM, cleared on fixture
closure. Safe retained session UUIDs are database metadata, never authentication proof.

## 23. D RED and vertical GREEN lineage

The RED uses `OwnerOutcomeTest#committedDisableBeforeOwnerCommitRetainsAttributableRefusal`.
The actual disable commits while the owner is paused after admission. The resumed owner throws
the expected `INELIGIBLE_SESSION`, but an independent observer finds zero owner result where
one terminal REFUSED was required. This is an assertion RED, not an unavailable environment or
an exception alone offered as rollback evidence.

| Slice | Exact source | Actual witness | Four-suite result |
|---|---|---|---|
| Disable-first RED | `58582cb75db413dfbd365e37862b5cca6d4b9668` | 1 test, 1 assertion failure, 0 errors/skips; expected owner 1, actual 0 after committed IAM disable; Maven 1 | Focused RED only |
| Minimum handoff GREEN | `82b574601e878227a25d379f0a339c626fc5592e` | Tentative ACCEPT rolls back; terminal security REFUSED owner/Audit = 1/1, event = 0 | 32/32 |
| Actual HTTP logout-first | `360d2147a311c57c9097747b1e30eaccd46ce4d9` | First GREEN after the general handoff repair; no separate invented logout RED | 33/33 |
| Owner-first disable | `1fe82ef912eee93f98239773c23f5f1f952f47ce` | Owner holds actual IAM lock; actual disable waiter observed; owner 1/1/1 precedes disable | 34/34 |
| Owner-first HTTP logout | `85060ca89f105db5b01929cbaa391f75e41f8550` | Actual POST logout waits, commits after owner; old proof refused, accepted history intact | 35/35 |
| Re-enable/fresh recovery and explicit activity receipts | `eec928d764cdc0b6652fe658d33f9d4e61ae0762` | Old proof stays invalid after re-enable; fresh same-Actor resolves terminal refusal; new ID may accept | 35/35 |
| Required refusal Audit fault / final D | `73abb35b32f5930004add0336f679771eeb77a1d` | Refusal-only zero-row Audit suppressor leaves 0/0/0, no activity refresh/FAILED; original C regression retained | 36/36 |

Only `SampleOwnerCommandService.java` changed in production, at `82b5746...`.
Later D changes qualify already-correct behavior through tests/fixture; first GREEN is honestly
recorded as qualification, not retroactively manufactured RED. V1–V8, IAM production,
`OwnerSessionEligibility`, Audit/event stores, dependencies/build inputs and runner are unchanged.

The RED raw log is `/home/phuclam/idea-f04-schema-oBmTnXEu.log`,
SHA-256 `999323f5df66fbeebbdc2afe6820d5fb3e30b65c9ca5929a45af3053459a6583`;
schema `f04_206f3dd2253e44fbaf235d5dae9694c7` cleanup COMPLETE.
The [D receipt index](F04-D-execution-receipts.json) retains exact archives and both Surefire
report hashes for RED and each passing suite, rather than overwriting predecessor evidence.

## 24. Refusal handoff and deterministic race method

For a new command, initial eligibility admission occurs under the retained sample OperationId
session lock. Test-owned trigger `f04_d_admitted` pauses that exact ACCEPTED operation's insert
after admission but before commit-time IAM coordination. The test observes the PostgreSQL waiter
on namespace `73004992`; actual `IdentityAdministration.disable` or actual HTTP
`POST /api/v1/identity/logout` then commits first. No direct SQL account/status/revoke update
is used as the D mutation being qualified.

The minimum service repair catches only commit-time `IdentityRefusal` for an already admitted
new command. It rolls back all tentative ACCEPT companions, retains the session-level sample
operation lock, rechecks canonical state, and, if none exists, appends original-attribution
terminal REFUSED plus required refusal Audit in one new transaction. It appends no event,
does not re-execute the business decision or re-admit the now-invalid session, and does not
refresh eligible activity. After that commit, it surfaces the original security refusal.
Initial admission and existing-result query refusal remain outside this handoff and cannot
invent an owner row or expose the retained result. Required evidence write failure propagates;
the independent refusal-Audit fault observer finds 0/0/0, not a partial REFUSED or invented FAILED.

For reverse ordering, test-owned `f04_d_activity` pauses the exact session's eligible-activity
update, after owner final eligibility while the owner still holds the existing IAM advisory
transaction lock `73003002`. A `pg_locks` join proves the same backend both waits on barrier
namespace `73004993` and holds the IAM lock. Actual disable or HTTP logout starts on another
caller; its ungranted waiter on that same IAM lock is observed before release. The owner
commits 1/1/1 with the activity update, then the IAM mutation proceeds and invalidates old proof.
Independent retained-state queries prove the later mutation did not rewrite the accepted
owner/Audit/EventId. Pre-release observers see 0/0/0 and the original activity timestamp.

Lock order stays sample OperationId lock → existing IAM transaction lock → commit/rollback.
Rollback releases the IAM transaction lock but not the operation session lock; the refusal
transaction records the already-observed reason rather than falsely treating the old session
as eligible. No reverse acquisition, production pause hook, sleep-only race or generic
coordinator was added. All barrier/fault functions and triggers belong only to the run schema
and are removed before its guarded cleanup.

## 25. D requirement → source/test → executed evidence

All rows execute at `73abb35b32f5930004add0336f679771eeb77a1d`.
Engineering disposition PASS; external D disposition PENDING. Tests are in `OwnerOutcomeTest`.

| Approved oracle | Source boundary / test | Independent observation |
|---|---|---|
| Disable after admission precedes owner commit | Commit-time refusal handoff / `committedDisableBeforeOwnerCommitRetainsAttributableRefusal` | Actual scoped IAM disable; one original REFUSED owner + one original refusal Audit, zero event; old proof HTTP 401 |
| Per-session revocation precedes owner commit | Same handoff / `committedHttpLogoutBeforeOwnerCommitRetainsRefusalAndAllowsFreshSessionResolution` | Actual CSRF-protected HTTP logout 204; terminal 1/1/0, old proof 401; initial invalid new ID 0/0/0 |
| Owner commits before actual disable | Existing IAM coordination / `ownerCommitBeforeDisablePreservesAcceptedHistoryAndSharedActivityFate` | Held IAM lock and mutation waiter observed; accepted 1/1/1 and unchanged historical provenance after disable |
| Owner commits before actual logout | Existing IAM coordination / `ownerCommitBeforeHttpLogoutPreservesAcceptedHistoryAndSharedActivityFate` | Actual HTTP logout waiter; accepted history 1/1/1 remains, old proof 401 |
| Refusal evidence is itself atomic | Required Audit one-row rule / `suppressedCommitTimeRefusalAuditCannotLeavePartialOwnerOrRefreshActivity` | REFUSED-only suppression after candidate rollback fails; independent 0/0/0, no FAILED or activity refresh; operation lock released |
| Re-enable never resurrects old session | Existing IAM re-enable + actual fresh HTTP sign-in in disable-first test | Stable Actor/account; old proof still 401/internal refusal; new proof resolves original REFUSED; genuine new ID 1/1/1 |
| Eligible activity shares owner fate | Controlled private fixture Clock + independent session record observers | Security-first timestamps unchanged; owner-first candidate invisible before commit and later timestamp commits with 1/1/1 |
| Accepted C baseline retained | All 16 existing B/C tests plus schema/predecessor/Audit suites | Canonical retry/access, concurrency/fault/pool-lock regressions remain passing |

Selected final-run witnesses are synthetic; correlation is original and unchanged on fresh replay:

| Direction | OperationId | Original ActorId | OrganizationId | Original correlation | Owner/Audit/event |
|---|---|---|---|---|---|
| Disable first | `88e1ce81-5783-412a-978c-887973dd9bf2` | `1d975917-b441-4582-941a-2b31ed155ecc` | `3ba1982f-c8b6-449b-afb7-90d69e8b9eea` | `f04-d-disable-first` | 1/1/0 REFUSED |
| Logout first | `7409d3db-c6e6-40af-95a2-1832fece2d68` | `dac93187-471e-4d6a-add0-ccf235a0e6b6` | same | `f04-d-logout-first` | 1/1/0 REFUSED |
| Owner before disable | `daf4ab73-4656-42bf-b57b-b7b92ecf789f` | `1e902d89-6083-4c4f-830e-7b4b69ad4972` | same | `f04-d-owner-before-disable` | 1/1/1 ACCEPTED |
| Owner before logout | `e33982f3-e489-4a38-825c-3ccd34a0f4d3` | `dac93187-471e-4d6a-add0-ccf235a0e6b6` | same | `f04-d-owner-before-logout` | 1/1/1 ACCEPTED |
| Required refusal Audit fault | `7e9f34bf-392b-42dd-b787-0bc5cdba529a` | `02da2f07-5de9-4bb9-834d-19c60452293f` | same | `f04-d-refusal-audit-failure` | 0/0/0 confirmed non-commit |

| Activity direction | Before UTC | After UTC | Actual result |
|---|---|---|---|
| Disable first | `2026-10-03T01:30:35.987440Z` | same | Unchanged |
| Logout first | `2026-10-03T01:30:33.987440Z` | same | Unchanged |
| Owner before disable | `2026-10-03T01:30:34.987440Z` | `2026-10-03T01:30:35.987440Z` | Shared committed refresh |
| Owner before logout | `2026-10-03T01:30:32.987440Z` | `2026-10-03T01:30:33.987440Z` | Shared committed refresh |
| Refusal Audit fault | `2026-10-03T01:30:31.987440Z` | same | Unchanged |

The Clock advances inside the private test fixture, not the host or a production route.
Existing C deferred-commit fault retains zero committed companions and unchanged activity; its
fixed-Clock invocation does not independently witness rollback of a changed activity timestamp.
D owner-first tests directly observe the changed activity candidate's shared commit fate.
D does not reimplement F03 timeout/reset/throttling matrices.

## 26. Final D execution, interruption and cleanup

Final exact source `73abb35b32f5930004add0336f679771eeb77a1d`,
archive `8b7e477c882b5b8bc12e41913ea54495242d02c650e0b6ac8e5ddb3b480e459f`,
ran all four suites on 2026-10-03. Each exited Maven 0 with zero failures/errors/skips:
**36/36 = owner 21 (B/C 16 + D 5) + schema 7 + predecessor 1 + Audit 7**.

| Suite / tests | Exact fresh owned schema | Raw log | Log SHA-256 |
|---|---|---|---|
| OwnerOutcomeTest 21/21 | `f04_a01127fb7e6f4214a0104f20b0101f8e` | `/home/phuclam/idea-f04-schema-UMRgtfp7.log` | `113c7e55ea1614899529dcb8eeeb36f1dab865da166e7b62f6579fea497d3f96` |
| F04SchemaTest 7/7 | `f04_0f4fd8170f9e45c0902adebbe060a499` | `/home/phuclam/idea-f04-schema-2kGgPMXN.log` | `80de28d03baf54c2aa904e708f700f040726e3771f9f78d303261679159c05ad` |
| F04PredecessorMigrationTest 1/1 | `f04_4c65b58c416d41f983b04ad99d669b56` | `/home/phuclam/idea-f04-schema-MJe3RkLf.log` | `8f17f3c3aa49fac8ac504efcbc92ffda2909294dfdaa0a7a8c6c4908e80f8fe6` |
| AuditEvidenceRepositoryTest 7/7 | `f04_a995b14ac4aa472f9228330288f0e505` | `/home/phuclam/idea-f04-schema-R4XnuwrB.log` | `cc5eba5cef968884392792192d63161a342867cb847f04108a37e338b7e3beb4` |

The [D receipt index](F04-D-execution-receipts.json) retains 25 completed run receipts:
24 PASS suite runs in six four-suite batches and one expected assertion RED.
It also retains one interrupted first final-source attempt separately, excluded from PASS and
the final test count. That interruption stopped before a terminal Maven/Surefire/cleanup result;
partial successful case output is not treated as a passing checkpoint.

Interrupted schema `f04_49920708dd824bf6b19dee1940552cfc` was later checked against exact source
marker and migrator owner, with no owned Java process remaining. Only that exact run schema was
dropped; absence was confirmed. Its original partial log
`/home/phuclam/idea-f04-schema-7MpEnT1J.log`, SHA-256
`6803a685ffa9fd48fadb0b871f7fa7dfe7560bd2b4104fb4dff20656a3445f5e`, is unchanged and retained.
The separately completed final-source batch above supplies the final 36/36 result.

All 26 distinct D schemas now have confirmed cleanup: completed runs use the unchanged runner's
post-JVM exact schema/name/owner/marker guard; interrupted-run recovery used the same bounded
ownership conditions after process absence. No broad database cleanup or historical evidence
deletion occurred. Logs remain private mode 600; read-only SHA-256/mode/mtime observations were
taken after execution. Hashes identify retained files, not independent raw-log review by a
remote reviewer. No password, cookie, CSRF or bearer proof is recorded.

## 27. Internal D source review — separate axes

Both read-only reviews compare accepted C `b6b114e...` with exact executed source
`73abb35...`. Neither ran tests or independently inspected private host logs.

### Standards

No documented mandatory breach found. Production remains sample-only, retains original
admission provenance and operation lock through the refusal handoff, and shares owner/Audit
transaction fate. No route, role, dependency or migration is introduced. Private fixture
credential/cookie custody and bounded test-owned PostgreSQL barriers preserve the approved
security/qualification boundary.

One optional possible Duplicated Code heuristic remains: explicit owner-first disable and
owner-first HTTP-logout tests repeat their barrier/lock-wait/history sequence. A small helper
could reduce drift later, but the separate cases make their independent ordering and oracle
auditable now. No mandatory refactor or generic race framework is justified for this checkpoint.

### Spec

No missing, incorrect or out-of-scope approved D behavior identified. Initial versus commit-time
refusal is separated; actual security-first and owner-first mutations, old-proof refusal,
re-enable/fresh-session/new-ID recovery, activity fate and atomic required-refusal-Audit failure
have source/test coverage. These source reviews are not external D acceptance.

Summary: Standards **0 mandatory / 1 optional heuristic**; Spec **0 actionable findings**.

Final evidence review corrected one overstatement about the historical C deferred-commit
activity witness: with D's fixed fixture Clock that case does not independently observe a
changed timestamp rolling back. Section 25 now states only the supported observation; no source
or execution was changed. Receipt/source/result/historical-preservation checks otherwise align.

## 28. Publication and next gate

Successors to executed source `73abb35...` update only current contract, evidence/receipt index,
task and handoff wording. They do not claim a new application execution. Historical sections
1–21, C receipt index, F03 evidence and original tooling authorization remain unchanged.
PR #32 records the exact published head independently of the executed source.

Publication checks: the structured index parses as 25 completed receipts (24 PASS, one expected
RED) plus one interrupted non-PASS record; 26 distinct schemas have cleanup, final four-suite
count is 36/36, all source objects exist, historical sections 1–21 and C JSON compare unchanged.
All 81 local Markdown path targets in the four changed Markdown records exist; anchors are
NOT-CHECKED. Scoped tracked UTF-8 secret scan exited 0, recognizing ten exact synthetic fixtures
and skipping 233 known binary files; this is not an all-format secret audit. Diff whitespace
check passed; Spec Kit extension hooks are absent. These checks are not a new qualification run.

Stop after publishing D for external Project Reviewer review. **Do not begin T026 until D
is reviewed.** Remaining T026 owns broader affected F03-A/HTTP/restart/data/health regression,
current additive-V8 chain expectations and whole-contract exact-source evidence/review/acceptance.
A fresh public database would require separate explicit creation authority; no existing public
schema may be used as its substitute. D's four-suite regression is not completion of T026.

Whole F04 remains IN_PROGRESS; T023–T026 unchecked, Issue #31 OPEN, PR #32 Draft.
Verifier NOT-RUN, no merge/F05. No product API/RBAC, dispatcher, Desktop binding, preview
upgrade, production/HA/recovery/commercial qualification or progress/timer action is performed.

## 29. T026 starting witness and bounded successors

The Project Reviewer accepted D at PR head `aaeaadef4165ab4caf1c559cb4d2f497a5872630`
and authorized T026-A/B. Initial checkout was clean on `codex/f04-owner-foundation`,
base `53c1e174cb0410658752ee48ee97ac1dce05ba6b`. Before changes, that exact head passed
owner21 + schema7 + predecessor1 + Audit7 = **36/36**, zero failures/errors/skips;
all four marked schemas were removed. [T026 receipts](F04-T026-execution-receipts.json)
retain exact source/archive/log/Surefire hashes and schema identities for every run.

Successors changed tests/runner only:
`400ad78cf769fe1e3f1995b7d3f22cfd7f372392` bounds existing F03 suites to the approved
F04 DB/roles/markers; `725a61359223f62d7115b67ef136bd7d84c04bd0` updates current V8
expectations and the existing HTTP health oracle.
`f817d8fb4a910185204ed37bd01b78070832196b` repairs a review-found setup-disposition gap:
CREATE SCHEMA and ownership marker commit together; CREATED is emitted before fallible migration/
grants. Runner inventories CREATED as well as READY and reports an exact retained schema
BLOCKED rather than missing it. No automatic nested cleanup after failed setup/shutdown.
Both internal reviews found this gap; Spec follow-up confirmed the narrow repair. Static
review is not execution or human acceptance.

Tooling is unchanged: Temurin25.0.4.1+1, Maven3.9.16 **offline**, PostgreSQL18.6,
CPython3.14.4 `-I -S` stdlib only, Node24.21.0/npm11.19.0.
Every run checked the retained nine build JARs/descriptor, five build-input blobs and eight
direct Web versions. Sources: `/home/phuclam/.m2/repository` and qualified locked Web cache
`/home/phuclam/idea-devaccess-fix-2a74130/apps/web/node_modules`.
Exact hashes remain in the admitted inventory/runner. No download/install/new dependency,
production Java, Web, POM or migration change; original Python admission history unchanged.

## 30. Current V1–V8 expectation review and RED

V1–V7 compare byte-identical to design/main base; V1–V8 are unchanged against accepted D head.
On `400ad78...`, existing HTTP test
`additiveThrottleMigrationRepeatsWithoutChangesAndEnforcesIdentitySizeAndRoleBounds`
failed: current versions expected1–7, actual1–8. One test / one assertion failure / zero error/
skip, Mavenexit1, exact schema cleaned. This intended RED is retained, not a product defect
or retroactive F03 evidence correction. Final HTTP83 includes the corrected assertion.

| Current test | Reconciled expectation | Actual execution |
|---|---|---|
| DataBaselineTest | Fresh V1–V8=8, repeat0, committed-event table visible | AUTHORITY REQUIRED / NOT-RUN; new public DB needed |
| F03BPublicMigrationTest | 27 public tables, 8 validated histories/checksums, zero pending, two migrator-owned functions; terminal sample/event mutation refused | AUTHORITY REQUIRED / NOT-RUN |
| DatabasePrivilegeTest | Original exact separate roles/baseline owner/DDL refusal retained; current full inventory belongs to test above | AUTHORITY REQUIRED / NOT-RUN in fresh public DB |
| HTTP chain test | Versions1–8; existing throttle bounds/privilege/no-op retained | PASS in marked schema |
| F04SchemaTest | ENVELOPE-9, real app append-only privilege, identity FKs | 7/7 PASS in marked schema |
| F04PredecessorMigrationTest | Attributable upgrade once/repeat0; unresolvable provenance rollback/history preserved | 1/1 PASS in marked schema |
| Packaged migration entrypoint | Repeat0/no second application | AUTHORITY REQUIRED / NOT-RUN |

Earlier F02/F03 evidence correctly describes its historical source and remains unchanged.

## 31. Final exact-source regression and health

All eight suites ran from **`f817d8fb4a910185204ed37bd01b78070832196b`**;
archive SHA-256 `0f704e4e3ad9778f37b60b38ae2ed06cbf6bbdc30a24fd32aa24a78e3957a1f0`.
Invocation: controlled F04 runner, `mvn -o -B -Dtest=<suite> test`.
All completed Mavenexit0 with **zero failures/errors/skips**.

| Suite | PASS | Retained host log | Log SHA-256 | Surefire XML SHA-256 |
|---|---:|---|---|---|
| `AuditEvidenceRepositoryTest` | 7/7 | `/home/phuclam/idea-f04-schema-5iDP3spu.log` | `3b8b29fa5128987c951d9a08e080b1413fad2fd1ac91a89dbb2e39ea85c769d5` | `04fa34f80faaf0d7a2c790bf87e070db18a9704d4ce01124b41efac0773ad653` |
| `HttpSessionFlowTest` | 83/83 | `/home/phuclam/idea-f04-schema-EZ5ZyaEK.log` | `1c8bdf65755ccb122341cf7702b3ebb2a63c7cd87be40a9139de0cb97006c152` | `a5ca2323e7ca8cd19cccdfb5bfa1180dfd7d9a577ee0b670d923700af1a00ebf` |
| `IdentityFlowTest` | 20/20 | `/home/phuclam/idea-f04-schema-xLCv6TVv.log` | `b3a7911a4b73009926f3be94adaff14b721e82eb37d3d7fe1e0570a3e010c542` | `426d2352a16711ffa997b6b5c5b3f0d0be893c55877e58a7747407910b46ac68` |
| `ServerRestartFlowTest` | 3/3 | `/home/phuclam/idea-f04-schema-63pEUm88.log` | `ae070ad359c656bacd9f66fe19157771e0883d1dfb741dc0fc15f78ac992d5c6` | `7161ef253bacdfc8319698d218cccde440ab0ac182ae32eab024c09549f4675a` |
| `F04PredecessorMigrationTest` | 1/1 | `/home/phuclam/idea-f04-schema-Uha0zJpc.log` | `6961a0b3dba40c4598a3894a0c942357b76df81723749d6738d6b49fb306c7fc` | `c8f4415a70be60375f6f90ec61f06010d4634490e8fe6748e880201ba8bd4174` |
| `F04SchemaTest` | 7/7 | `/home/phuclam/idea-f04-schema-DSxKYt2n.log` | `4d10db04de2ef9cf63602ec96cfe95575f75785f9645d5951d59a98922e6c42e` | `8beee2d7d67aff118044c04b7ce1819b51f0fd6ea32f0d0ee1152029da56b342` |
| `OwnerOutcomeTest` | 21/21 | `/home/phuclam/idea-f04-schema-mTZq9H42.log` | `5bab2cf8f16d4dbd0b092a6ff958f3279d1211c8fc3bde4e1cfe18cb901e6a50` | `f80e37decf0536b0e76fc320f434b167949cfba27ddd0a7789a1a045da88e234` |
| `ServerSmokeTest` | 2/2 | `/home/phuclam/idea-f04-schema-cmrlJRWK.log` | `1182e131aa1c7483eb1c6747c3245e7abc9396cbc2bbcc562402d01be98ed29a` | `7f111ad931046b14a2dd88072bb4615ce6a6d45229ee7feb19d9eb934f42ef11` |

Focused F04 **36/36**. Affected existing F03/health **108/108**:
Identity20, HTTP83, Restart3, Smoke2. The accepted [F03 closure matrix](F03-B-closure-matrix.md)
owns the reused behavior, including bootstrap/account, setup/reset, logout, disable/re-enable,
revoked/stale proof, throttle and restart continuity; no competing suite or browser/Desktop run.
The existing anonymous HTTP probe now observes actual process and PostgreSQL **200/UP** with
exact `{"status":"UP"}` bodies. Smoke2 retains unreachable DB **503/DOWN** while process
**200/UP**, no password/JDBC disclosure. No endpoint redesign/operational availability claim.

## 32. Custody, interrupted execution and cleanup

Only `127.0.0.1:5432/idea_ddm_f03a_20260930_c91e7a42` was used, with real
`idea_ddm_migrator` / `idea_ddm_app`; unique f04 UUID schemas have
`IDEA_F04_RUN:<exact-source>:<schema>` markers. Migrator migrates, app lacks DB/schema CREATE.
No retained-public write/migration/bootstrap, company/preview/Vault access or new DB.

Index: **20 runs — 18 PASS, one expected RED, one interrupted non-PASS**.
**305 distinct actually created schemas** have cleanup receipts; 110 belong to final eight
suites. Unused runner allocations are NOT-CREATED, not counted as created. Six test-owned restart
children were confirmed stopped. Read-only post-run catalog: `F04_CATALOG_REMAINING=0`,
`F04_PROPOSED_DATABASE_EXISTS=0`, `RETAINED_PUBLIC_TABLES=23`.

The interrupted `725a613...` HTTP run has Surefire83/0/0/0 and83 fixture cleanup receipts,
but no terminal Maven/runner receipt: **INTERRUPTED_NOT_PASS**. Read-only recovery found all
absent; completed successor runs replace it. Other completed `725a613...` receipts remain
intermediate, not final qualification. Raw logs are private mode600; published hashes and
summaries do not imply independent external raw-log inspection.

## 33. Whole-F04 requirement to execution matrix

Every executed row uses final source `f817d8fb4a910185204ed37bd01b78070832196b`, the DB/
roles in §32, and the [T026 index](F04-T026-execution-receipts.json), which retains exact
suite/method names, log/Surefire hashes and individual schema/cleanup identities for each row's
suite. This is executed behavior, not compilation inference. Historical RED/first-GREEN and
A/B/C/D checkpoint dispositions remain in §1–28 and original indexes. Whole-F04 review PENDING.

The owner-method names below belong to `OwnerOutcomeTest`; source seam is
`SampleOwnerCommandService` with supplied-Connection `AuditEvidenceRepository`,
`CommittedEventStore` and existing IAM through `OwnerSessionEligibility`.

| Requirement | Test identity / implementation seam | Actual result and limit |
|---|---|---|
| V8 envelope / append-only event / immutable identity FKs | F04SchemaTest seven methods / V8 + event store | PASS; no payload/dispatcher/delivery |
| Audit ownership, correlation, one-row check, rollback | AuditEvidenceRepositoryTest seven methods / caller Connection | PASS; caller owns transaction |
| Current chain | HTTP additiveThrottleMigration… + F04Schema/Predecessor | PASS for marked schema; fresh public/package BLOCKED |
| Real Server ActorContext | realSignInCapturesServerPrincipalRatherThanClientActorId / F04SessionFixture | PASS; no product API/RBAC |
| ACCEPTED exact Actor/Org/Op/correlation/distinct Event | acceptedCommandRetainsAuthenticatedProvenanceAcrossOwnerAuditAndEvent | PASS, exact original provenance |
| Business REFUSED / required Audit / zero event | businessRefusalRetainsOwnerAndRequiredAuditButNoCommittedEvent | PASS, not technical FAILED |
| Accepted/refused replay | freshSessionResolvesOriginalAcceptedWithoutCompanionDuplicates; freshSessionResolvesTerminalRefusalDespiteChangedDecision | PASS; no payload fingerprint policy |
| Result access | otherActorAndRevokedSessionCannotDiscloseEitherTerminalOutcome | PASS; bounded sample policy, not global Actor-only rule |
| Same-ID concurrency | concurrentAcceptsResolveOneCanonicalWinner; concurrentAcceptAndRefuseResolveOneCanonicalWinner | PASS; one canonical result/companions |
| Refusal handoff serialization | refusalHandoffRetainsOperationLockUntilRefusalAuditCommits | PASS |
| Audit failure and zero row | requiredAuditFailureRollsBackAllCompanionsThenSameIdCanCommit; suppressedRequiredAuditIsFailureNotPartialSuccess | PASS |
| Event failure and zero row | requiredEventFailureCannotCommitOwnerOrAudit; suppressedRequiredEventIsFailureNotPartialSuccess | PASS |
| Deferred commit fault | deferredCommitFailureIsNotSuccessAndObserverConfirmsNonCommit | PASS for confirmed non-commit; not uncertain commit qualification |
| Pool/lock cleanup | failedUnlockAndAbortDiscardPhysicalConnectionBeforePoolReturn; heldOperationLockTimesOutWithoutCommitAndRetryCanProceed | PASS |
| Confirmed rollback retry | requiredAuditFailureRollsBackAllCompanionsThenSameIdCanCommit | PASS; no durable completed/FAILED row from attempted ID |
| Disable-first | committedDisableBeforeOwnerCommitRetainsAttributableRefusal | PASS; zero ACCEPTED/event |
| Logout-first | committedHttpLogoutBeforeOwnerCommitRetainsRefusalAndAllowsFreshSessionResolution | PASS |
| Terminal security REFUSED + Audit | Both security-first tests inspect original provenance and zero event | PASS; atomic refusal handoff |
| Reverse owner-first | ownerCommitBeforeDisablePreservesAcceptedHistoryAndSharedActivityFate; ownerCommitBeforeHttpLogoutPreservesAcceptedHistoryAndSharedActivityFate | PASS |
| Old proof / re-enable / fresh recovery | D ordering methods + existing HTTP/restart | PASS; no old-proof revival |
| Activity transaction fate | D owner-first and refusal activity assertions | PASS within precise §25 limitation |
| Required refusal-Audit failure | suppressedCommitTimeRefusalAuditCannotLeavePartialOwnerOrRefreshActivity | PASS; owner/Audit/event0/0/0 |
| Affected F03-A/HTTP/restart | Identity20 + HTTP83 + Restart3 | PASS; not client/HA requalification |
| Process/database health | Existing anonymous HTTP probe + ServerSmoke2 | PASS; UP/DOWN split and non-disclosure |
| Exact source/tooling/cleanup | Final eight receipt sets / runner and marked fixture | PASS; setup registration review gap repaired |
| Current fresh public/full privileges/package repeat | DataBaseline, DatabasePrivilege, F03BPublicMigration, packaged DatabaseMigrationCommand | AUTHORITY REQUIRED / NOT-RUN |

T023/T024/T025 scoped behavior: SATISFIED BY EVIDENCE for review. T026 remains partial.
Umbrella checkboxes remain unchecked; whole F04 IN_PROGRESS, Issue31 OPEN, PR32 Draft,
verifier NOT-RUN. No merge/F05.

Internal Standards/Spec review checked the exact final source and working publication records.
The schema-registration finding is resolved. Spec review also caught a proposal-only offline
gap: database-migrate.sh rebuilds without explicit -o. Section34 now uses its identical packaged
PropertiesLauncher entrypoint directly after an offline build, rather than invoking that wrapper.
Final receipt consistency, historical preservation, unchanged task markers and local Markdown
path existence passed the scoped publication validator; anchors are NOT-CHECKED. These are
source/record checks, not independent raw-log inspection or Project Reviewer acceptance.
Tracked UTF-8 secret scan exited0: no secret-like values; ten exact synthetic fixtures recognized,
233 known binaries skipped. This is scoped text hygiene, not an all-format security audit.
Diff whitespace check passed; Spec Kit extension hooks are absent. No verifier execution.

## 34. Single remaining execution-authority proposal

**AUTHORITY REQUIRED — proposed only; nothing created or executed.**

New DB: `idea_ddm_f02_f03b_closure_f04_20261003_t026` on existing
`127.0.0.1:5432` PostgreSQL18.6 server. Purpose: T026 current V1–V8 fresh-public/privilege/
package-repeat qualification. Read-only catalog confirms this exact name absent. Create only
from template0; if name exists at execution, abort rather than adopt any old DB.

Creator: human/operator with existing PostgreSQL admin/sudo authority. Owner: existing
`idea_ddm_migrator`; runtime: existing `idea_ddm_app`. No new role/credential.
Revoke PUBLIC connect/schema CREATE, grant only admitted app/migrator access.
Witness initially zero application tables/functions/Flyway history/identity/evidence in public
before migration. No old F02/F03 DB or retained public is reused.

After separately approved exact-name wrapper and unchanged offline preflight, set
IDEA_DATABASE_NAME, IDEA_F02_TEST_DATABASE_NAME and IDEA_F03B_CLOSURE_DATABASE_NAME to this
exact name; host127.0.0.1/port5432 and exact roles, credentials only from private server file:

1. `mvn -o -B -Dtest=DataBaselineTest test`: first8/repeat0 through real DatabaseMigrationCommand,
   positive health, bounded failed-DDL rollback probe.
2. `mvn -o -B -Dtest=DatabasePrivilegeTest test`.
3. `mvn -o -B -Dtest=F03BPublicMigrationTest test`: exact27tables/twofunctions, eight validated
   histories/checksums/no pending, V8 once, role/ownership, actual app DDL and protected mutation
   refusal; controlled Flyway-history ACL drift followed by real repair to SELECT-only.
4. `mvn -o -B -DskipTests package`; invoke the exact packaged migration main twice:
   `java -Dloader.main=com.idea.ddm.migration.DatabaseMigrationCommand -cp target/idea-server-0.1.0-SNAPSHOT.jar org.springframework.boot.loader.launch.PropertiesLauncher`.
   This is the same Java entrypoint used by database-migrate.sh; do not execute that wrapper's
   non-offline nested build. Both packaged invocations apply0, history/checksums unchanged.
   First8 is witnessed in step1, not falsely called a packaged first run. Inspect tooling
   exclusion from package. No Server/preview deployment or bootstrap.

No default/fallback target. Same exact admitted artifacts/tools only; missing/hash-changed input
blocks. Stop only test-owned JVMs. DataBaseline's own exact random rollback schema/temp directory
may be cleaned; retain the new DB for review, no automatic DROP DATABASE/broad/public cleanup.
Any failure retains named disposition. No company/Vault/preview/production data.
After these receipts, update matrix and return for whole-F04 acceptance. This is the sole
remaining execution blocker, not general database, product or F05 authority.

## 35. Successor authorization and exact execution boundary

This is the current successor to the **historical** §34 proposal and §30/33 pending rows.
On 2026-10-03, the human approved its exact database package in this conversation.
[IE-RES-F04-T026-FRESH-PUBLIC-AUTH-20261003](../../../docs/research/2026-10-03-f04-t026-fresh-public-authorization.md)
was committed at **`088ee3fed5175e387a629a7bc4d5ea5a943cdbb0` before execution**.
The human's GitHub connector attempt failed403 and created no comment; this is conversation
authorization, not a GitHub approval review. Original tooling authority and historical evidence
are unchanged.

Only **`idea_ddm_f02_f03b_closure_f04_20261003_t026`**, PostgreSQL18.6 at
127.0.0.1:5432, was used. The sudo wizard required absence before template0 creation and refused
existing names; existing migrator owns the DB and runtime remains existing app. No new roles/
credentials. The human reported setup complete. Codex independently observed before migration:
correct database/owner/marker/version, **public tables0, public functions0, no Flyway history**,
app lacks database/schema CREATE and migrator membership/elevated role attributes.
This clean witness is retained in the [public receipt index](F04-T026-fresh-public-receipts.json);
it does not claim Codex personally entered sudo or independently watched the entire human terminal.

Exact archive SHA-256 **`0894c38b2643ca3b52b8dd825a25a194babe719e278f59e35433e6fd8824f0af`**; application/tests/migrations/build inputs
are identical to full-regression `f817d8fb4a910185204ed37bd01b78070832196b`.
Temurin25.0.4.1+1, Maven3.9.16 offline, isolated stdlib CPython3.14.4, Node24.21.0/npm11.19.0
remain admitted. Preflight matched nine build JARs, exact descriptor, five build inputs, eight Web
direct versions and all57 qualified runtime JARs from existing cache. No resolution/download/install.

A preliminary guard stopped **before database access/Maven execution** because the helper looked
for a versioned jarmode entry inside cached Boot loader tools; its actual entry is
`META-INF/jarmode/spring-boot-jarmode-tools.jar`. Read-only inspection proved the same previously
qualified bytes/hash `062a9edf01809f4a2b48bfc2fe392fedd27448a3a57113bef510576673d4397f`.
Only this lookup was corrected; no tool/artifact/version/graph change or new intake.
This was not a behavioral test FAIL and did not consume the fresh target.

Retained one-off execution harness:
`/home/phuclam/idea-f04-088ee3f-We6qBu/run-t026-fresh-public.sh`, SHA-256 `7d684dc86cf868e221164c44ebf85e5561ffbe5f51978955b80e5476330eeafe`.
Exact wizard hash `9e45568d1a5489446c2459cdb4cfb570cce1e756558aa60bc943879f2a3019c6`; `bash -n` PASS,
ShellCheck NOT-RUN because unavailable (no substitute installed).
Credentials came only from the controlled private file; no values enter commands/public records.
No old F02/F03 DB, preview, company/production data or Vault accessed.

## 36. Fresh-public V1–V8 and packaged repeat results

Ordered actual commands under source **`088ee3fed5175e387a629a7bc4d5ea5a943cdbb0`**:

1. `mvn -o -B -Dtest=DataBaselineTest test`
2. `mvn -o -B -Dtest=DatabasePrivilegeTest test`
3. `mvn -o -B -Dtest=F03BPublicMigrationTest test`
4. `mvn -o -B -DskipTests package`
5. `java -Dloader.main=com.idea.ddm.migration.DatabaseMigrationCommand -cp target/idea-server-0.1.0-SNAPSHOT.jar org.springframework.boot.loader.launch.PropertiesLauncher`, twice.

Database-name variables all pin the exact new target, host127.0.0.1/port5432 and existing exact
roles; no historical runner fallback. All three Maven test commands exit0:
**8 tests, failures0/errors0/skipped0**. Method names, XML hashes and witnesses are in the index.

| Suite | PASS | Retained private log | Log SHA-256 | Surefire XML SHA-256 |
|---|---:|---|---|---|
| `DataBaselineTest` | 3/3 | `/home/phuclam/idea-f04-088ee3f-We6qBu/t026-receipts/DataBaselineTest.log` | `a00d9b12e3358ef73e1884d56272fc771d315b744583675762823bd2a6a2a8c3` | `444f3d62c3bdd2bbd380cdde6f7211b63563698284e56eaf9926b4ffed7dee5c` |
| `DatabasePrivilegeTest` | 1/1 | `/home/phuclam/idea-f04-088ee3f-We6qBu/t026-receipts/DatabasePrivilegeTest.log` | `bb4c65b26763c7938504ba94b44f4b45f6d0be9a8124de5682da9e3352d2d7da` | `d7c2d753369568d209feedb82c927204357ee6301c0ddb4e84e12a3b99f8a964` |
| `F03BPublicMigrationTest` | 4/4 | `/home/phuclam/idea-f04-088ee3f-We6qBu/t026-receipts/F03BPublicMigrationTest.log` | `14d6717f188ba4ab77ba12129c5e9a2d474424155e6af65d15c8f5d9c1568c6c` | `8723ac1d583b1771aaf37f95a615a24819d38a5c64f430a58b1b4631a6268c82` |

First **V1→V8 applied8**, second in-process migrate0 in DataBaselineTest.
Actual HTTP process/database health200/UP and bounded failed-DDL rollback also PASS.
Full public qualification observes **27 migrator-owned tables, two migrator-owned functions,
eight successful non-null versioned checksums, versions1–8, zero pending**.
App authenticates separately, cannot SET ROLE migrator, CREATE SCHEMA/TABLE, mutate protected
definitions/assignments/proof bindings/owner outcome/event or Flyway history (actual42501 probes).
The controlled history-ACL drift test repairs to **app SELECT-only**, even on no-op migrate.
Original role versions/permissions unchanged; no Actor/Account/session/proof/owner/event/Audit
fixture rows remain. V1–V8 were not edited.

Offline package exit0:
`/home/phuclam/idea-f04-088ee3f-We6qBu/apps/server/target/idea-server-0.1.0-SNAPSHOT.jar`,
SHA-256 **`d5397251b2c7b9cba7a46733e7d8aa8b398fafd368d34b94b01179ba8bfa80b8`**.
All57 runtime JAR hashes equal the qualified repaired application graph; nine build-only JARs
are excluded from BOOT-INF/lib. Packaged V1–V8 match archive resource bytes exactly.
The non-offline nested-build wrapper was **not invoked**.

Both direct packaged invocations exit0 and print **MIGRATIONS_APPLIED=0**.
First8 belongs to the fresh test, **not a packaged first-run claim**.
Retained logs `/home/phuclam/idea-f04-088ee3f-We6qBu/t026-receipts/packaged-repeat-1.log` and
`/home/phuclam/idea-f04-088ee3f-We6qBu/t026-receipts/packaged-repeat-2.log` both have SHA-256
`9a62d3256852d02f87988f24fd24774397e078fb3877018fdcbd6484046868bc`.
History before/after is byte-identical, SHA-256
`086aa8c34eba748c845ee921822cb9a5f08790fcafc33fd2318232073980799d`; exact eight Flyway checksums remain in the index.

Post-run: rollback-probe schemas remaining0, full public inventory intact, app historySELECT-only.
New database **RETAINED FOR REVIEW**, no DROP DATABASE/public cleanup. Package retained only
for qualification; no preview deployment, bootstrap or F05.
Raw logs remain private600; public summaries/hashes do not imply independent external log access.

## 37. Current whole-F04 review matrix

This current matrix supersedes only the pending execution dispositions in historical §30/33/34.
The detailed requirement/method mapping in §33 remains valid; its current-chain/package gap is
now closed by §35–36. Full application/test/migration content did not change after `f817d8f...`;
only authorization/publication files differ at the fresh-public executed source.
No unnecessary full-suite rerun or new implementation was introduced for database approval.

| Acceptance requirement | Source/test + executed SHA | Evidence | External disposition / final status |
|---|---|---|---|
| Stable event foundation, additive predecessor upgrade, immutable provenance/append-only privileges | V8, CommittedEventStore; Schema7 + Predecessor1 at `f817d8f...` | §31/33, original T026 index | Schema checkpoint accepted for continuation; executed PASS |
| Caller-Connection required Audit / original Actor, Organization, OperationId, correlation, distinct EventId | AuditEvidenceRepository; Audit7 + authenticated owner B3 within Owner21 at `f817d8f...` | §31/33 and preserved B | B accepted for continuation; executed PASS |
| Business REFUSED + required Audit/no event; terminal replay, same-ID concurrency, bounded result access, forced failures/confirmed rollback | SampleOwnerCommandService; C13 within Owner21 at `f817d8f...` | §31/33 and preserved C | C accepted for continuation; executed PASS |
| Disable/logout before commit, reverse order, attributable refusal, activity fate and old-proof recovery | OwnerSessionEligibility/sample service; D5 within Owner21 at `f817d8f...` | §31/33 and preserved D | D accepted for continuation; executed PASS |
| Affected F03-A, HTTP/session/logout/proof/throttle and runtime restart; process/database health | Identity20 + HTTP83 + Restart3 + Smoke2 at `f817d8f...` | §31 and original T026 index | Earlier F03 acceptance retained; affected regression108 PASS |
| Fresh public V1–V8, first8/repeat0, exact owner/role/privileges/history/checksums/no pending, original role versions | DataBaseline3 + Privilege1 + F03BPublicMigration4 at `088ee3f...` | §35–36 and fresh-public index | Execution authorized; 8/8 PASS; whole-F04 review PENDING |
| Offline exact-source package, admitted graph/build-tool exclusion, direct packaged repeat0 twice/no history change | Packaged DatabaseMigrationCommand at `088ee3f...` | §36 and fresh-public index | Execution PASS; package is not deployment/product readiness |
| Exact tool/target/retention/cleanup trace | Controlled preflight, actual witnesses and private log hashes | §31–32 + §35–36, both indexes | Execution PASS; retained DB and independent raw-log access limitation disclosed |
| Whole card / integration | All rows above | This matrix | **Project Reviewer whole-F04 acceptance PENDING; no merge authority** |

T023–T026 scoped implementation/execution is **SATISFIED BY EVIDENCE FOR REVIEW**.
Keep umbrella tasks unchecked, F04 IN_PROGRESS, Issue31 OPEN, PR32 Draft and verifier NOT-RUN
until the separate whole-card disposition. No dispatcher/delivery, real domain payload/product RBAC,
unknown-commit reconciliation, HA/recovery, Desktop, commercial/T036 or F05 completion claim.
The next action is **whole-F04 acceptance**, not another feature slice or F05.

## 38. Whole-F04 acceptance and closure publication

On **2026-10-03**, Project Reviewer Nguyễn Huỳnh Phúc Lâm explicitly accepted whole F04
as **COMPLETE / ACCEPTED / PASS** in this conversation, at review head
`ac6c96e1090eb4d38aefca607af066dcd6330a67`. Current repository disposition is
**F04 COMPLETED / PASS**, and umbrella **T023, T024, T025 and T026 are complete**.
This human acceptance supersedes the pending dispositions in historical sections 1–37;
those sections and their exact execution receipts have not been rewritten.

The accepted execution lineage remains:

- `f817d8fb4a910185204ed37bd01b78070832196b`: focused F04 **36/36 PASS** and affected
  F03/health **108/108 PASS**, as retained in §31–33 and the original T026 receipt index.
- `088ee3fed5175e387a629a7bc4d5ea5a943cdbb0`: fresh-public **8/8 PASS**, V1–V8 first
  application **8**, repeat **0**, offline package and direct packaged migration repeats
  **0 / 0**, as retained in §35–36 and the fresh-public receipt index.
- No remaining blocker inside the approved F04 acceptance boundary.

Private raw host logs remain an **independent evidence-access limitation**. Public summaries
and retained hashes do not claim that the external reviewer independently read those logs.
`verify-template` remains **NOT-RUN** and is not an F04 acceptance blocker.

This publication changes only current status/evidence/task/handoff records. It does not
change application code, tests, V1–V8, dependencies, runtime/tooling, execution evidence or
receipt hashes, and requires no test rerun. The review database
`idea_ddm_f02_f03b_closure_f04_20261003_t026` remains retained; closure does not authorize
DROP DATABASE, public-schema cleanup or deployment.

The Reviewer separately authorized marking [PR #32](https://github.com/devphuclam/IDEAEngineering/pull/32)
ready and merging it by the established merge-commit method after this closure-only commit,
then closing [Issue #31](https://github.com/devphuclam/IDEAEngineering/issues/31) as completed.
Actual merge SHA and final provider states are recorded in the PR/Issue integration records,
not inferred from engineering qualification or this pre-integration publication.

Only after that merge and Issue closure is **F05-A / T027** eligible to start, using the already
frozen F05 Preparation Package. T027 is Gateway runtime/toolchain/Adapter/transport-security
qualification; it is **not started by this closure**, and F04 tooling authority does not extend
to F05. No new F04 checkpoint or design reopening is required.

Acceptance does not claim event delivery, general product RBAC, real domain payloads,
uncertain-commit reconciliation, HA/recovery, production/commercial/T036 clearance,
Desktop/Workspace completion or F05/whole-PH1 completion. Delivery Card timer/actual-effort
publication remains governed separately by the Progress Tracker workflow; no timer action
or actual-hour estimate is inferred from this closure publication.
