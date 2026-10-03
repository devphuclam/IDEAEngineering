# F04 T026 — Exact Fresh-Public Database Authorization

| Control | Value |
|---|---|
| Stable ID / class | `IE-RES-F04-T026-FRESH-PUBLIC-AUTH-20261003` / bounded successor process authorization |
| Version / status / normativity | `0.1` / Approved for the exact scope below / INFORMATIVE |
| Repository instruction state | NOT-APPLICABLE; no product, legal, commercial or deployment approval |
| Owner / author | Engineering / Codex |
| Reviewer / acceptance authority | Project Reviewer Nguyễn Huỳnh Phúc Lâm; explicit human approval in this conversation on 2026-10-03 |
| Applicability / baseline | Issue #31 / Draft PR #32; T026-A/B only; proposal in F04 results v0.8 §34 at publication head `d71c71acc531e6448178a9f9bc5dd3b580236ff5` |
| Application/test baseline | `f817d8fb4a910185204ed37bd01b78070832196b`; successors may add the controlled execution wrapper/authorization/evidence only, not change qualified application/tests/migrations/dependencies |
| Effective date | 2026-10-03; prospective after this record is committed and before creation/execution |
| Classification / retention | INTERNAL; retain with F04 execution records and private host evidence |
| Upstream | [Approved proposal](../../specs/005-ph1-foundation-custody/evidence/F04-outcome-results.md#34-single-remaining-execution-authority-proposal), [tooling authority](2026-10-02-f04-buildtool-execution-authorization.md), [Python clarification](2026-10-02-f04-python-harness-authorization.md), supplied Project Reviewer decision |
| Downstream | Exact-name database setup wizard; T026 fresh-public runner; current F04 results/matrix; whole-F04 review |
| Change / supersession | Adds only the separately approved fresh-public target to T026. Does not rewrite original schema-only authority or prior execution evidence. Supersedes/superseded by NOT-APPLICABLE |
| Review trigger / expiry | Tool/artifact/hash/dependency/target/scope change, missing cache, authority withdrawal or whole-F04 acceptance; changed assumptions block execution |
| Evidence / tailoring | Explicit human authorization, not runtime PASS. STANDARD-GUIDED bounded information/configuration/test trace under IE-STD-AUTH-001; parent F04 results §15 pins exact standards editions/tailoring; no conformity claim |

## Authority provenance

The human explicitly approved the entire exact §34 proposal, including the database name,
template0/no-reuse rule, existing roles, ordered tests, offline build, direct packaged main,
retention and stop conditions. This conversation is the authorization source.

The human reported that an attempted GitHub connector approval comment failed with
`403 Resource not accessible by integration`; no comment was created by that attempt.
Do not represent this as a GitHub approval review or an existing approval comment. A later
Codex publication of this authorization is a trace record, not an independently cast human vote.

## Exact additional database boundary

Only new `idea_ddm_f02_f03b_closure_f04_20261003_t026`, PostgreSQL 18.6 at
`127.0.0.1:5432` on the existing server. An operator with existing PostgreSQL admin/sudo
authority creates it from template0, only after checking its name absent. Existing name means
STOP, never reuse/adopt/delete. Database owner is existing `idea_ddm_migrator`; runtime is
existing `idea_ddm_app`. No new role or credential. Limit initial ACLs to admitted access,
retain exact creation marker and witness empty public tables/functions/Flyway history before
first migration. Credentials stay in the controlled private source or terminal only.

## Authorized sequence

After the unchanged exact tooling/cache preflight:

1. `DataBaselineTest` — fresh V1–V8 first8/repeat0, real process/database health and its bounded
   failing-DDL rollback fixture.
2. `DatabasePrivilegeTest` — distinct app/migrator authentication, ownership and DDL refusal.
3. `F03BPublicMigrationTest` — current full inventory/history/checksums, zero pending,
   append-only protections and Flyway-history ACL repair under the exact test DB.
4. Offline package, retain exact JAR/source/hash and confirm build tools are excluded.
5. Direct packaged `DatabaseMigrationCommand` twice via PropertiesLauncher: both repeat0,
   unchanged history/checksums. Do not invoke the wrapper with its non-offline nested build.

Only the existing Temurin25.0.4.1+1, Maven3.9.16 `-o`, CPython3.14.4 `-I -S` stdlib,
Node24.21.0/npm11.19.0, admitted nine-artifact inventory/descriptor and qualified cached graph
are allowed. Any missing/changed tool/artifact/hash/dependency/target is STOP; no download,
install, version substitution or migration change. Preserve V1–V8 byte-for-byte.

## Retention and closure boundary

Keep the new DB for review; no automatic DROP DATABASE or broad/public cleanup. Only the
existing test's exact owned rollback schema/temp directory may be cleaned after owned JVMs stop.
Failed/partial setup leaves the exact DB retained and named, not silently repaired/reused.
Old F02/F03 test DBs, preview, company/production data and Vault remain outside this execution.
No migration/bootstrap/preview deployment beyond the approved fresh test target.

After actual execution, submit whole-F04 technical evidence for Project Reviewer acceptance.
Keep F04 IN_PROGRESS, Issue #31 OPEN, PR #32 Draft, T023–T026 unchecked, verifier NOT-RUN.
No merge, F05 or tracker/timer action is authorized by this decision.
