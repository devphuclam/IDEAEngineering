# PH1 validation guide

**State on 2026-09-28:** Planned, application checks `NOT-RUN`. This guide tells a reviewer how
to prove each slice after its code exists; it is not evidence that any slice passed.

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

The F01 entry points to create under T003–T011 are:

```text
Ubuntu Server:   cd apps/server && ./mvnw test
Ubuntu Web:      cd apps/web && npm ci && npm test -- --run && npm run build
Windows Desktop: dotnet test apps/desktop/tests/IdeaDesktop.Tests.csproj
Windows Desktop: dotnet build apps/desktop/IdeaDesktop.csproj
Windows Workspace: dotnet test apps/workspace/tests/IdeaWorkspace.Tests.csproj
Windows Workspace: dotnet build apps/workspace/IdeaWorkspace.csproj
```

These commands are targets, not reports of successful execution. T002 must clear exact package
intake before `npm ci` or Maven downloads; T003 must provide the wrapper and projects. For F02–F05,
the card evidence must include the exact migration, application-start and scenario commands added
with those implementations, because no such executable exists yet.

| Card | Run and retain | Expected result / limit |
|---|---|---|
| F01-A | From a clean checkout, run each documented Server, Web, Desktop and Workspace build plus basic test command on its qualified platform. | Four actual results tied to commit and tool versions; a planned command is not PASS. |
| F01-B | Repeat automated checks; inspect tracked config and build inputs for working secrets; inspect lockfiles and exact dependency intake. | Repeatable checks and no committed working secret; record any blocked package separately. |
| F02 | Apply migrations to a fresh permitted dev database; re-run supported migration validation; exercise one bounded rollback/failure case; compare app and data health while DB is unavailable. | Ordered migration history and distinct health outcomes. This is not a backup/restore or production recovery result. |
| F03-A/B | Run controlled initial-admin bootstrap twice; create/disable a native test account; sign in/out, revoke, and retry protected calls with old proof. | The second bootstrap reports already initialized with no Actor, account or Role Assignment change; attributable Actor/session; no public registration; all invalidated retries refused. Do not print passwords or session secrets. |
| F04 | Run one allowed, one refused and one forced-failure sample owner command with a fixed `OperationId` per attempt. Query owner/Audit/outbox outcomes. | No successful result without required Audit, no partial success under forced failure, and no duplicate result from a same-ID retry. |
| F05-A/B | Record exact Gateway runtime, Adapter and transport qualification; transfer approved 1 KiB and 64 MiB fixtures directly to one Gateway; compare size and SHA-256 with manifest, then inspect receipt and accepted metadata. Repeat with wrong/expired grant, wrong digest, interruption, lost response and same-ID repeated/changed input. | Matching verified custody for both happy-path fixtures; zero false successful custody for failures. Retries resolve the same operation. Artifact/Vault/Location IDs stay distinct from private Adapter path. No second Vault or throughput claim. |

For F03, re-enable a disabled test account: its old invalidated session must remain refused,
while a fresh eligible sign-in works. For F04, use controlled synchronization to pause a sample
command after admission, commit account disablement or session revocation, then let the command
reach its commit check. It must produce no successful business-state change. Retain the ordering
evidence; an arbitrary sleep alone does not establish that the race was exercised.

For every run, retain the exact command/procedure, commit, environment, timestamp, actual output,
reviewer and `PASS`/`FAIL`/`BLOCKED`/`NOT-RUN` disposition in the card's evidence record. Update
the repository-owned Execution Register/Work Journal through the
[Progress Tracker](../../tools/progress-tracker/README.md) only when authorized; never replace
actual effort with planned hours. See [PH1 boundary contract](contracts/ph1-boundaries.md)
and [data model](data-model.md) for the interfaces and identity rules being checked.
