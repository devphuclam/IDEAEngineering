# F02 Database and Health Verification Results

| Control field | Value |
|---|---|
| Stable Verification ID | `IE-VEV-PH1-F02-001` |
| Document class / title | `VERIFICATION-RECORD` / F02 Database and Health Verification Results |
| Version / status | `0.1` / `Draft`; T017 execution result is `PASS`; F02 Delivery Card review/closure is pending |
| Product normativity / process authority | `INFORMATIVE` / `NOT-APPLICABLE`; this record creates no product requirement, deployment approval or gate decision |
| Owner / author | F02 Engineering implementer / repository maintainer |
| Reviewer / acceptance authority | Project Reviewer; review and F02 card acceptance `NOT-RUN` |
| Applicable baseline / evidence date | F02 under PH1; initial run 2026-09-29 and role-boundary follow-up 2026-09-30 (Asia/Ho_Chi_Minh); source branch `codex/f02-db-baseline` based on `aa74672a5c4588cb7a18835d0311ad5ebceefdf1` |
| Upstream / downstream trace | PG4-authorized PH1 scope; [F02 task](../tasks.md), GitHub [Work Item #20](https://github.com/devphuclam/IDEAEngineering/issues/20), T014–T017 → F03/F04/F05 |
| Change record / supersession | The initial fresh-database run used the uncommitted source archive identified below. Its migration and application/test sources were subsequently committed in PR #21 at `8001216d2a00b7c1d0b34e4fd6e024e724ae430b`; the packaging correction was included before the resumed packaged-command run. The role-boundary follow-up was run 2026-09-30 from commit `d9b36b3f90aaf559fd20a6f43008db23a9b00263`. No Feature, Spec or Tech baseline changed. |
| Classification / retention | `INTERNAL`; retain with the PH1 source and all three host logs while F02 evidence is relied upon |
| Standards tailoring | `STD-INFO-001` (ISO/IEC/IEEE 15289:2019), `STD-TEST-001` (ISO/IEC/IEEE 29119-1:2022), `STD-TEST-002` (29119-2:2021), `STD-TEST-003` (29119-3:2021) and `STD-TEST-004` (29119-4:2021), all `STANDARD-GUIDED`; tailor their information-item and test-result concepts. This is not a standards-conformity claim. |
| Review trigger / evidence status | Re-review on migration, role grants, datasource/health behavior, package/build configuration or tested source change. Actual F02 test outcomes and limits are recorded below. |

## Disposition

**T017 recorded execution: `PASS` for the checks listed below.** The migration and health checks ran against a dedicated PostgreSQL test database on the Ubuntu development host. The explicit role-boundary follow-up also passed against that database on 2026-09-30. This record does not close the F02 Delivery Card; Project Reviewer acceptance is still required. No backup, restore, production hardening, multi-Vault, transfer, performance or commercial-release claim is made.

## Tested environment and source

| Field | Result |
|---|---|
| Host / operating system | `ideaddmserver`, Ubuntu 26.04.1 LTS |
| Database | Dedicated database `idea_ddm_f02_20260929_a52f44f6`; PostgreSQL 18.6 on loopback. The helper neither creates nor drops databases. |
| Runtime / build | Eclipse Temurin `25.0.4.1+1`; Maven Wrapper `3.3.4`; Apache Maven `3.9.16`; Spring Boot `4.1.1` |
| Tested source | Initial fresh-database run: uncommitted F02 worktree based on `aa74672a5c4588cb7a18835d0311ad5ebceefdf1`, uploaded source archive SHA-256 `6B3FB1E9FD15555F0ED5FA843CD5C25CD835562979C54BBB13748B1C050ED8BA`. Its migration and original application/test sources were later committed in PR #21 at `8001216d2a00b7c1d0b34e4fd6e024e724ae430b`; the packaging correction was included before the resumed run. The role-boundary follow-up used committed source `d9b36b3f90aaf559fd20a6f43008db23a9b00263`, archived with SHA-256 `125F151EB8B6970A6D86A5F74C8906F5628E1B0C74D176648333BF00168A87A0`. |
| Migration | `database/migrations/V1__ph1_foundation.sql`; SHA-256 `1A15298354951AC975201D6A0B12691D69D957386AEBC3083C7EBE9890DE56D4` |
| Integration test | `apps/server/src/test/java/com/idea/ddm/DataBaselineTest.java`; SHA-256 `DB3C19409CAEBB5EE37490E45180A89BE09A761A4DC3026787B0EBA53352F1A7` |
| Build descriptor after correction | `apps/server/pom.xml`; SHA-256 `461163B50D7CBEFD3D452C6D3F95417F20DD897FB11F725ED43BF9DC8510CBED` |

The source snapshot was based on the worktree, not a committed F02 revision. The initial database
integration run preceded adding the Spring Boot packaging plugin; the migration SQL and Java
application/test sources were unchanged by that packaging correction. The original fresh-database
test was not repeated because it asserts that V1 applies to an empty database and that database
already contains the tested V1 migration. The corrected package was then tested against that same
database as a no-op, and the Server smoke test was rerun.

## Executed results

| Check | Command / procedure | Actual result |
|---|---|---|
| Fresh PostgreSQL migration, repeat and app-role access | `sh ./mvnw -B -Dtest=DataBaselineTest test`, using `IDEA_F02_TEST_DATABASE_NAME=idea_ddm_f02_20260929_a52f44f6`; database and migration role were the same isolated target. | Flyway saw an empty `public` schema, applied V1 once, then reported schema version 1 and “No migration necessary” on the second invocation. The `idea_ddm_app` role could see all 12 expected tables: Actor/account/login/session, sample owner/Audit, Vault endpoint, transfer/grant/receipt, Artifact and Artifact Location. `3` tests, `0` failures, `0` errors, `0` skipped; Maven `BUILD SUCCESS`. |
| Bounded PostgreSQL rollback | `DataBaselineTest.failedPostgresMigrationRollsBackItsPartialDdlInAnIsolatedSchema` creates a temporary schema, runs a successful baseline DDL followed by a deliberately failing migration (`SELECT 1 / 0`), then verifies the partial table is absent and drops the temporary schema. | The expected failing migration was logged as rolled back; assertions passed and cleanup ran. This is a bounded DDL rollback test, not a backup/restore or operational recovery test. |
| Corrected packaged migration entry point | `JAVA_HOME=/opt/idea/tools/jdk-25.0.4.1+1 PATH=/opt/idea/tools/jdk-25.0.4.1+1/bin:$PATH sh ./mvnw -B -DskipTests package`; then the F02 runner's `sh ./scripts/database-migrate.sh` against the same database. | Build `BUILD SUCCESS`; the JAR contained `org/springframework/boot/loader/launch/PropertiesLauncher.class`; packaged migration exited `0` and printed `MIGRATIONS_APPLIED=0`. |
| Available-database health | Included in `DataBaselineTest.processAndDatabaseHealthReportSeparateOutcomes`. | With PostgreSQL reachable, `GET /health` returned HTTP `200` / `UP`, and `GET /health/database` returned HTTP `200` / `UP`. |
| Unavailable-database health and disclosure | `sh ./mvnw -B -Dtest=ServerSmokeTest test`, using the test-only unreachable endpoint `127.0.0.1:1/idea_unavailable_test`. | `GET /health` stayed HTTP `200` / `UP`; `GET /health/database` returned HTTP `503` / `DOWN`; response contained neither password nor JDBC URL. `2` tests, `0` failures, `0` errors, `0` skipped; Maven `BUILD SUCCESS`. |
| Combined resumed run | `IDEA_F02_RUN_FRESH_DATABASE_TEST=0 bash apps/server/scripts/run-f02-postgresql-checks.sh`; the flag avoids rerunning the already-passing empty-database assertion and preserves its earlier evidence. | Fresh-database test deliberately `NOT-RERUN`; packaged migration reported `0` applied; both Server smoke tests passed; runner printed `F02_TEST_SUITE=PASS`. |
| Runner role-name guard | `bash -n apps/server/scripts/run-f02-postgresql-checks.sh`; then invoke the runner with both `IDEA_DATABASE_APP_USER` and `IDEA_DATABASE_MIGRATION_USER` set to `idea_ddm_migrator`. | `PASS`: syntax check exited `0`; the runner exited `2` with the expected refusal before prompting or connecting to a database. No database was changed by this check. |
| Supplemental migration/application role boundary | `DatabasePrivilegeTest` checks distinct exact role names, migration ownership of all 12 baseline tables, absence of database/schema `CREATE` privileges for `idea_ddm_app`, and actual rejection of `CREATE SCHEMA` and `CREATE TABLE` by that role. Run on 2026-09-30 from commit `d9b36b3f90aaf559fd20a6f43008db23a9b00263` against the same dedicated F02 database. | `PASS`: 1 test, 0 failures, 0 errors, 0 skipped. The complete resume runner also reported packaged migration `MIGRATIONS_APPLIED=0`, `ServerSmokeTest` 2/2 passed, and `F02_TEST_SUITE=PASS`. |

## Retained host logs and correction history

The runner used `umask 077`; it reads passwords with terminal echo disabled and does not print them.
The three retained server logs contain no password values:

| Log | SHA-256 | Evidence |
|---|---|---|
| `/home/phuclam/idea_ddm_f02_20260929_a52f44f6-test-20260929-165349.log` | `D05C0499B7BA458F3BD0FC7FB7EBB29417C1DB05202B0D0E7F0BF2CB1AEB5222` | Fresh migration, repeat no-op, app table access, expected rollback and `DataBaselineTest` 3/3. Its first packaged-command attempt exposed the defect below. |
| `/home/phuclam/idea_ddm_f02_20260929_a52f44f6-test-20260929-170252.log` | `76A902F244A9BCDFAAE270D1C5C0E37FADD6F4005DFFC0109B7733DD5B61053B` | Corrected packaged migration `0` applied, `ServerSmokeTest` 2/2 and runner `F02_TEST_SUITE=PASS`. |
| `/home/phuclam/idea_ddm_f02_20260929_a52f44f6-review-d9b36b3f-20260930.log` | `FD3402F4DF77FAE657E6A5B919804B8906B2D803F7926C0D61540537A8F2A4BE` | Role-boundary test 1/1, packaged migration `0` applied, `ServerSmokeTest` 2/2 and runner `F02_TEST_SUITE=PASS`; log permissions `600`. |

The first packaged-command attempt failed because the POM did not declare
`spring-boot-maven-plugin`, so the JAR lacked `PropertiesLauncher`. This was not hidden as a pass:
the plugin was added, the JAR was repackaged successfully, its launcher class was checked, and the
packaged migration/no-op plus Server smoke checks were rerun successfully. The failure was in
packaging, not in the V1 database migration; the already-passing first migration evidence was
preserved rather than repeated destructively.

Mockito emitted a non-fatal dynamic-agent warning under Java 25 during the smoke tests. It did not
change test outcomes; revisit if a later JDK removes dynamic self-attachment.

## Limits and follow-up

- F02 uses one local development database only. No second Vault, replication, failover or recovery objective was exercised.
- The 2026-09-30 run verifies only the selected F02 role boundary and the listed smoke checks; it does not claim production authorization, operational backup/restore or multi-Vault behavior.
- No production deployment, concurrent load, real user workflow, authentication, authorization or file transfer is claimed.
- T036 still must inspect the exact resolved transitive dependency/license inventory and preserve applicable notices. The F02 intake allows internal build/test only; it does not clear commercial distribution.
- `verify-template` was not run, per the project instruction for this work.
- F02 Delivery Card review, actual-effort publication and closure remain separate from this T017 execution result.
