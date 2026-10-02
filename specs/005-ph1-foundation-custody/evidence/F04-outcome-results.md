# F04 outcome results — schema foundation checkpoint

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
