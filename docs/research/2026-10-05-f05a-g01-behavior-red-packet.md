# G01 behavioral RED — exact execution packet

| Control | Value |
|---|---|
| Stable ID / class / version / status | IE-VEV-F05A-G01-BEHAVIOR-RED-20261005 / qualification packet / 0.1 / Draft |
| Owner / author / worker | Engineering / Codex / CODEX_ONLY |
| Reviewer / authority | Project Reviewer-approved T028/T030 G01 continuation; execution result NOT-RUN at publication |
| Normativity / instruction | Product INFORMATIVE / NOT-APPLICABLE |
| Date / timezone / retention | 2026-10-05 / Asia/Ho_Chi_Minh / INTERNAL, retain with historical PH1 evidence |
| Upstream / downstream | [input freeze](2026-10-05-f05a-t028-t030-input-freeze.md), [initial RED](2026-10-05-f05a-g01-initial-red-results.md), PH1 FR-005/008/011/012 → G01 behavior RED/minimum GREEN |
| Supersession / trigger / tailoring | New execution, no old record rewritten; source/graph/target drift STOP; STANDARD-GUIDED configuration/test information under IE-STD-AUTH-001, no conformity claim |

## Precondition verified after the human sudo step

Live migration-role connection independently returned
`idea_ddm_migrator|idea_ddm_f05a_20261005_t028|idea_ddm_migrator|0`:
exact database/current role/database owner and zero public tables. Live application-role connection
returned `idea_ddm_app|f|f` for database/public CREATE. No company/old DB accessed.
The first read-only query had an escaped-quote syntax error; its corrected query produced the above
witnesses. No failure is counted as PASS; no mutation from that query.

## Published source / command / target

Source SHA is the pushed commit containing these test/helper/skeleton/runner bytes and updated manifest.
The unchanged app POM, V1–V8 and input graph are pinned in `inputs.sha256`. Byte-preserving export
requires full local/remote manifest PASS and matching archive SHA before execution.
Owned fresh target `/home/phuclam/idea-f05a-t028-t030-20261005-37/run-g01-behavior-red-01/source`.

```bash
bash tests/ph1/f05-qualification/server-grant/run-behavior-red.sh <published-source-sha> <manifest-sha256>
```

Five direct offline resources/compiler/Surefire goals only, existing JDK25/Maven3.9.16 pins and
controlled empty settings. Actual observed graph/provider paths must remain in the admitted set;
no new cache/version/download or lifecycle/Web/Boot goal. No credentials in Maven environment or
properties: the test alone reads the existing guarded phuclam600 private file without interpolation
or output, and supplies its DataSource directly to the synthetic Server. Log/frames/keys are private.

`F05DatabaseFixture` authenticates exact roles/new DB, creates a new `f05_<32lowerhex>` schema with
source/run marker, applies existing V1–V8 there, restricts history to SELECT-only for app and checks
app has no database/schema CREATE. No V9 or public migration. Runner waits for owned JVM exit,
then checks exact schema name/owner/source marker before DROP SCHEMA; no DROP DATABASE, reuse,
adoption of an unmarked schema or cleanup beyond this run. Database remains retained.

## Expected RED / STOP

The now-compilable `TransferGrantService` API intentionally throws
`GRANT_ISSUANCE_NOT_IMPLEMENTED`. G01 must reach that call **after** actual HTTP CSRF/sign-in,
protected Server-derived Actor capture and role/migration prerequisites. Expected one test/error,
zero failure/skip, exact marker exception. A missing credential/cache/provider/fixture/compiler
failure is STOP, not G01 RED. No dynamic repair inside this attempt.
The skeleton is not wired/exposed as an application endpoint and does not issue any Grant or
accepted custody; it is an intentional test-first stage, not a supported implementation.
After the genuine RED, publish only the minimum GREEN and any authorized V9 delta/test contract
before a new fresh-target execution. G02–G06 are not implemented by this packet.

Retain exact counts/source/schema/log hashes and original attempts. Private-log independent-review
limitation remains; no whole T028/T030/F05-A completion, Gateway, Receipt acceptance, verifier,
timer/Tracker, merge or preview action.
