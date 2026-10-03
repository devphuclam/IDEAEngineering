# F04 Internal Build/Test Execution Authorization

| Field | Value |
|---|---|
| Stable ID / class | `IE-RES-F04-BUILDTOOL-AUTH-20261002` / bounded successor process authorization |
| Version / status | `0.1` / Approved for the scope below |
| Product normativity | INFORMATIVE; no product, legal, commercial or deployment approval |
| Owner / author | Engineering / Codex |
| Authorization / authority | Project Reviewer Nguyen Huynh Phuc Lam; explicit supplied authorization, 2026-10-02, before F04 execution |
| Applicability | Work Item [#31](https://github.com/devphuclam/IDEAEngineering/issues/31), Spec Kit 005 T023–T026 only |
| Baseline / start source | `53c1e174cb0410658752ee48ee97ac1dce05ba6b`; design accepted in PR #30 / ADR-0014; individual executions pin their own committed source |
| Classification / retention | INTERNAL; retain with F04 execution evidence and historical intake |
| Upstream | [Exact nine-artifact inventory](2026-10-01-t043-maven-web-build-intake.md#exact-artifact-inventory), [intake rule](../agents/external-source-intake.md), Project Reviewer authorization |
| Downstream | [T023–T026 units](../../specs/005-ph1-foundation-custody/tasks.md#f04-implementation-units), F04 qualification evidence |
| Change / supersession | New F04 authority; does not rewrite or extend historical T043, F03-B or Issue #26 exceptions |
| Review trigger / expiry | Artifact/version/hash/graph/tool/scope/database/architecture change, missing cache, withdrawal or F04 whole-card acceptance |
| Evidence / limits | Read-only artifact/database preflight PASS; F04 runtime tests NOT-RUN at record creation; Legal Review/T036 remain separate |

## Authorized tooling and source

Use installed Temurin `25.0.4.1+1`, Maven `3.9.16`, PostgreSQL `18.6` and the unchanged
repository build/dependency graph (Boot `4.1.1`, Flyway `12.4.0`, pgJDBC `42.7.13`). The inherited
actual-Web lifecycle uses the already preflighted Node `24.21.0` / npm `11.19.0` and locked Web
cache; no new package or runtime is admitted.

Maven is **offline only**, using
`/home/phuclam/.m2/wrapper/dists/apache-maven-3.9.16/510fba38` and
`/home/phuclam/.m2/repository`. The historical inventory linked above is the authoritative list
of the exact nine build-only JAR coordinates/hashes. Recheck all nine and the plugin descriptor's
eight dependencies before each execution. Keep license/notice material and exclude build tools
from application dependencies and `BOOT-INF/lib`. This authorization grants no additional rights.

## Controlled PostgreSQL boundary

Only `127.0.0.1:5432/idea_ddm_f03a_20260930_c91e7a42` is authorized. Each execution creates a
new, run-owned `f04_<UUID>` schema through `idea_ddm_migrator`. Runtime is `idea_ddm_app`, with
no database/schema CREATE. Existing `public`, historical schemas, company/development databases,
preview runtime/database and Vault remain untouched. Credentials come only from the controlled
private source, never repository, command arguments, output or evidence.

Cleanup may drop only the exact newly created schema, after owned resources stop and qualification
evidence is retained. No Flyway/Maven clean, public-schema migration, V1–V7 change, F03 historical
evidence rewrite, verifier, F05, deployment or installation/download is authorized.

## Preflight receipt and stop conditions

On 2026-10-02, read-only checks on `ideaddmserver` confirmed all nine JAR SHA-256 values,
the exact eight-dependency descriptor and descriptor SHA-256
`186E94C4147FC6600DBB0865B50FF3783D19B6F9A0FA06732521706AE2605A96`. The 95-artifact retained
F03-B tree was cached; all 57 packaged runtime JARs matched cache (one embedded in cached
Boot loader tools). The Web lock SHA-256 was
`350E5D24057C55D6ACEF6FB6A71B73948E2711D9279C12E2FE52071B815F611B`; eight direct package
versions matched. Build graph equals qualified source `2a74130b88cffe1ee96d28014c7a0ec080d1a199`.

Both exact database roles authenticated in read-only mode. Neither has superuser/CREATEDB/
CREATEROLE/replication/BYPASSRLS. App DB/public CREATE is false; migrator is database owner and
can create schemas. Historical public retains 23 tables and successful V1–V3; no F04 schema
existed at preflight. Preflight is not complete offline resolution or a F04 behavioral PASS.

Missing/hash-mismatched/new/version-changed/graph-changing artifacts or changed assumptions stop
execution. No network fallback or replacement install is permitted; obtain new intake/authority.
The approved first unit is F04SchemaTest RED, then minimum additive T025-A V8 after rechecking
numbering. Do not prebuild later owner behavior. Gemini T024-A remains gated by pinned Audit
contract, relevant schema GREEN and focused Audit RED. T023–T026 completion and F04 acceptance
require their full evidence/review; a green slice alone is insufficient.

Control tailoring: information/configuration/verification trace is STANDARD-GUIDED under
IE-STD-AUTH-001. No standards-conformity, production, recovery or commercial claim.
