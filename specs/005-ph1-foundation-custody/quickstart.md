# PH1 validation guide

**Procedure updated 2026-10-01:** This guide is not a progress register or test result.
Per-card evidence and the Execution Register own actual status. F03-A acceptance does not
pre-accept F03-B HTTP/session work; retain each executed red/green result separately.

## Before running

Read the [PH1 diagram guide](../../docs/product/instances/idea-engineering/ph1-diagram-guide.md)
before implementing transfer. It identifies the current Gateway/byte-path views and excludes
historical Server-relayed upload images. The full Check-in sequence is later-phase context,
not extra F05 scope.

1. Pin one Git commit for both the Ubuntu Server/Web and Windows Desktop/Workspace checkouts.
   Record host OS, Java/Node/.NET/PostgreSQL versions and build-tool versions.
2. Use the [P04 development environment](../004-technical-pilot-readiness/environment-profile.md)
   and [runbook](../../deploy/development/README.md). The native development database, distinct
   app/migration roles and one Vault root must be checked before writes. No Docker or shared
   production environment is implied by these instructions.
3. Keep filled credentials outside Git, restricted to the local operator/service accounts. Use
   the [configuration example](../../config/idea-core-v0.server.env.example) as field guidance,
   not as a real-secret source.
4. Complete the [external-source intake](../../docs/agents/external-source-intake.md) for each
   exact newly used package or runtime before installing it. A missing intake blocks that use.
5. For F05, regenerate or verify the [P05 fixtures](../004-technical-pilot-readiness/evidence/)
   and their manifest. Their 1 KiB and 64 MiB sizes do not establish a multi-GB claim.

## Run by card

The F01 entry points created under T003–T011 are:

```text
Ubuntu Server:   cd apps/server && ./mvnw -B verify
Ubuntu Web:      cd apps/web && npm ci && npm test && npm run build
Windows Desktop: dotnet test apps/desktop/tests/IdeaDesktop.Tests.csproj
Windows Desktop: dotnet build apps/desktop/IdeaDesktop.csproj
Windows Workspace: dotnet test apps/workspace/tests/IdeaWorkspace.Tests.csproj
Windows Workspace: dotnet build apps/workspace/IdeaWorkspace.csproj
```

These commands are targets, not reports of successful execution. Exact package intake is required
before any new import; the historical NuGet exception in T002 does not waive this rule for another
package or version. T003 provides the wrapper and projects. The pinned
Maven wrapper requires `unzip` on the Ubuntu host to retain its ZIP checksum path. For F02–F05,
the card evidence must include the exact migration, application-start and scenario commands from
each implemented checkpoint; commands for unfinished slices remain planned, never presumed PASS.

| Card | Run and retain | Expected result / limit |
|---|---|---|
| F01-A | From a clean checkout, run each documented Server, Web, Desktop and Workspace build plus basic test command on its qualified platform. | Four actual results tied to commit and tool versions; a planned command is not PASS. |
| F01-B | Repeat automated checks; inspect tracked config and build inputs for working secrets; inspect lockfiles and exact dependency intake. | Repeatable checks and no committed working secret; record any blocked package separately. |
| F02 | Create a fresh, isolated database named `idea_ddm_f02_<run-id>`; set exact, distinct role names `idea_ddm_app` and `idea_ddm_migrator`, and export their credentials separately. Set `IDEA_DATABASE_NAME` and `IDEA_F02_TEST_DATABASE_NAME` to that same database. Run `DataBaselineTest` first to apply V1 once and verify a repeat is a no-op, then run `DatabasePrivilegeTest` against the migrated schema to verify object ownership and refused app DDL. Run the packaged migration command and `ServerSmokeTest` afterward. | One fresh migration, repeat no-op, all baseline objects owned by the migration role, app role cannot create a schema/table, bounded failing DDL rollback in a generated temporary schema, and distinct process/database health. This is not a backup/restore or production recovery result. |
| F03-A/B | Run controlled initial-admin bootstrap twice; create/disable a native test account; sign in/out, revoke, and retry protected calls with old proof. | The second bootstrap reports already initialized with no Actor, account or Role Assignment change; attributable Actor/session; no public registration; all invalidated retries refused. Do not print passwords or session secrets. |
| F04 | Run one allowed, one refused and one forced-failure sample owner command with a fixed `OperationId` per attempt. Query owner/Audit/outbox outcomes. | No successful result without required Audit, no partial success under forced failure, and no duplicate result from a same-ID retry. |
| F05-A/B | Record exact Gateway runtime, Adapter and transport qualification; transfer approved 1 KiB and 64 MiB fixtures directly to one Gateway; compare size and SHA-256 with manifest, then inspect receipt and accepted metadata. Repeat with wrong/expired grant, wrong digest, interruption, lost response and same-ID repeated/changed input. | Matching verified custody for both happy-path fixtures; zero false successful custody for failures. Retries resolve the same operation. Artifact/Vault/Location IDs stay distinct from private Adapter path. No second Vault or throughput claim. |

For the F02 integration test, run the dedicated helper from an interactive Ubuntu shell after
creating the isolated database described in this card. It prompts for the application and
migration passwords without echoing them, rejects any target outside the `idea_ddm_f02_` prefix,
and writes a mode-600 log in the operator home directory. It does not create or drop databases.
Run from the repository root for a fresh isolated database:

```bash
bash apps/server/scripts/run-f02-postgresql-checks.sh
```

If the fresh-database migration test already passed for this same F02 database, preserve that
result and rerun the role-boundary test plus packaged migration/no-op and server smoke checks with:

```bash
IDEA_F02_RUN_FRESH_DATABASE_TEST=0 bash apps/server/scripts/run-f02-postgresql-checks.sh
```

This resume mode does not repeat or replace the first-migration evidence. It prompts for the app
and migration passwords separately, without echoing them.

For F03, re-enable a disabled test account: its old invalidated session must remain refused,
while a fresh eligible sign-in works. For F04, use controlled synchronization to pause a sample
command after admission, commit account disablement or session revocation, then let the command
reach its commit check. It must produce no successful business-state change. Retain the ordering
evidence; an arbitrary sleep alone does not establish that the race was exercised.

### F03-B fast HTTP/PostgreSQL checks

Use the protected operator credential file, separate `idea_ddm_app`/`idea_ddm_migrator` roles
and existing dedicated `idea_ddm_f03a_20260930_c91e7a42` database. The HTTP test owns only a
new `f03b_<32 hexadecimal UUID>` schema: migrate and remove only that exact schema. Leave
public and retained F03-A state unchanged; no development/F02 database or Vault write.
Missing access is BLOCKED, not permission to substitute an in-memory database.

The scoped runner is `apps/server/scripts/run-f03b-postgresql-checks.sh`. It fails closed if
required credentials/roles/database are missing; any skipped check must be reported NOT-RUN,
not PASS. The anonymous-session tracer is historical evidence. T046's explicit Login Identity
repair received external PASS WITH NOTES at `281e46651e774b44a0b2e1c18fe30bd50a1f3151`; retain
its two-login and refusal regressions. Read-only `speckit-analyze` preceded spec v0.6's authorized
T041 execution. The successor follows one RED → GREEN behavior at a time through the
[throttling contract](contracts/ph1-boundaries.md#throttling-qualification-contract-planned)
and [planned sign-in integration](plan.md#planned-sign-in-transaction-integration).

Run the affected checkpoint from an archive of the exact committed source:

```bash
bash apps/server/scripts/run-f03b-postgresql-checks.sh ServerRestartFlowTest,HttpSessionFlowTest,IdentityFlowTest,ServerSmokeTest
```

Preserve T045/§20 and V1–V6. Spec v0.6 owns rolling-window and resource/timing requirements:
unknown identifiers create zero failure records; each known Login Identity stays within one
record/five timestamps/one deadline. The T041 successor covers concurrent counting, successful
clearing/session fate and binding/write-failure rollback, not only the counter threshold;
see [exact-source evidence](evidence/F03-identity-results.md#24-t041-throttling-checkpoint).
External throttling review is received (evidence §25). The HTTP account-administration successor
has 98 scoped checks at `a0874f40555f1119b830f043a7aaf5bda8752d8a` (evidence §26), through
the same runner/owned-schema boundary. Its external PASS WITH NOTES is received (§27).
For the approved restart slice, `ServerRestartFlowTest` starts/stops only its two owned JVM
Server processes, at the same endpoint on one UUID schema. It never restarts Ubuntu. Its private
test-classpath Clock file advances synthetic time without changing the host clock or adding
a public route. Read [§28](evidence/F03-identity-results.md#28-server-restart-and-session-continuity-qualification)
for the exact-source result; do not infer the result from this procedure. Existing idle/absolute,
logout/reset/re-enable and throttling matrices remain in `HttpSessionFlowTest`. Request external
restart checkpoint review before continuing; do not merge. Client qualification remains
T043's seam → failing tests/evidence contract → implementation if needed → real Web/Desktop
execution, never inferred from this Java HTTP runner.

Check default profile values, then advance test time at setup-proof, idle, absolute and login
block boundaries. Do not wait minutes/hours or change the server's clock. Cookie/session/CSRF
checks use real HTTP; migrations/authentication use real PostgreSQL. An isolated loopback HTTP
profile must disclose transport/cookie overrides and is not HTTPS/Desktop qualification.
Retain hashes and sanitized assertions, never password, proof, cookie or CSRF values in logs.
`verify-template` remains NOT-RUN at the user's instruction.

For every run, retain the exact command/procedure, commit, environment, timestamp, actual output,
reviewer and `PASS`/`FAIL`/`BLOCKED`/`NOT-RUN` disposition in the card's evidence record. Update
the repository-owned Execution Register/Work Journal through the
[Progress Tracker](../../tools/progress-tracker/README.md) only when authorized; never replace
actual effort with planned hours. See [PH1 boundary contract](contracts/ph1-boundaries.md)
and [data model](data-model.md) for the interfaces and identity rules being checked.
