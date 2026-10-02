# F04 outcome results — schema, Audit and authenticated owner tracer

| Current control | Value |
|---|---|
| Stable ID / class | `IE-VEV-PH1-F04-OUTCOME-001` / verification execution record |
| Version / document status / normativity | `0.5` / Draft / INFORMATIVE |
| Repository instruction state | NOT-APPLICABLE |
| Execution disposition | Partial PASS: owner tracer 3/3, schema 7/7, predecessor 1/1, Audit 7/7; C/D and whole F04 NOT-RUN |
| Owner / author | Engineering / Codex |
| Reviewer | Schema/Audit technically accepted for continuation; successor internal reviews below; external owner-tracer review PENDING |
| Acceptance authority | Project Reviewer Nguyễn Huỳnh Phúc Lâm; bounded execution authorized, T023-B checkpoint/whole-card acceptance PENDING |
| Applicability / evidence date | `IE-INC-PH1-FOUNDATION-CUSTODY-001`, Work Item [#31](https://github.com/devphuclam/IDEAEngineering/issues/31), A units and T023-B/minimum T025-B; 2026-10-02 +07:00 |
| Current executed source | `fbd1ffc6fff7ed5952907316845a8110491cf779` |
| Current archive SHA-256 | `0729758e76f2a16f48aca182ecd626b17667bc709fe473a7b5aa6e0768dfe270` |
| Classification / retention | INTERNAL; retain with the F04 baseline and associated server logs until separately governed disposition |
| Upstream | [ADR-0014](../../../docs/adr/0014-retain-owner-committed-event-foundation.md), [F04 contract](../contracts/ph1-boundaries.md#f04-internal-qualification-contract), [bounded execution authority](../../../docs/research/2026-10-02-f04-buildtool-execution-authorization.md) |
| Downstream | T023–T026 in [tasks](../tasks.md#f04-implementation-units), [current handoff](../worker-handoff.md#current-f04-design-to-implementation-handoff), Work Item #31 review |
| Change / supersession | Successor to v0.4; sections 1–10 retain historical receipts. Sections 11–13 add authenticated owner RED/GREEN, exact-source regression and current limits. Original authorization/F03 evidence remains unchanged. Superseded by NOT-APPLICABLE |
| Review trigger | Source/test/migration/build-input/tool/cache/authority/boundary change or adoption by the next owner; rerun affected checks before extending disposition |
| Standards tailoring | `STD-INFO-001`, `STD-CM-001`, `STD-TEST-001…004`: STANDARD-GUIDED information/configuration/test trace under `IE-STD-AUTH-001`; no conformity claim |

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
