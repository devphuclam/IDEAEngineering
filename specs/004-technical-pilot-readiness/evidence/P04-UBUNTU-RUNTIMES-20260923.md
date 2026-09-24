# P04 Ubuntu development-runtime observation

| Field | Value |
|---|---|
| Evidence ID | `P04-UBUNTU-RUNTIMES-20260923` |
| Date | 2026-09-23 to 2026-09-24, Asia/Ho_Chi_Minh |
| Target | `ideaddmserver`, Ubuntu 26.04.1 LTS / x86_64 |
| Evidence classes | Official upstream metadata and checksum; agent-observed SSH runtime output; Project Reviewer-supplied privileged command output |
| Scope | Native PostgreSQL, Temurin and Node development tools; PostgreSQL database/role bootstrap |
| Excludes | Application build, Flyway migration, Gateway/Vault integration, accepted deployment and commercial redistribution |

## 1. Artifact integrity and runtime

The agent downloaded the two official Linux x64 archives to a restricted
`/home/phuclam/idea-ddm-downloads` directory. Before extraction, the host's `sha256sum` matched
the independently pinned upstream SHA-256 values in the [native runtime intake](../../../docs/research/2026-09-23-p04-ubuntu-native-runtime-intake.md).
The Project Reviewer performed privileged extraction into `/opt/idea/tools`; the agent then
checked the installed executables over SSH. The Node tree was changed to `root:root` after the
archive initially preserved unknown numeric ownership.

| Tool | Observed result |
|---|---|
| Temurin JDK | `java` and `javac` 25.0.4.1; runtime build `Temurin-25.0.4.1+1`; installed `NOTICE` and `legal/java.base/LICENSE` present |
| Node.js / npm | Node `v24.21.0`; npm `11.19.0` with explicit per-command Node `PATH`; installed `LICENSE` present; Node directory `755 root:root` |
| PostgreSQL | Ubuntu packages `postgresql-18` and `postgresql-client-18` at `18.6-0ubuntu0.26.04.1`; `psql 18.6`; cluster `18/main` online; service active; `pg_isready -h 127.0.0.1 -p 5432` accepting; listener on loopback only |
| Ubuntu package notices | All eight newly installed packages had `/usr/share/doc/<package>/copyright` present; names and versions are recorded in the native runtime intake |

No system-wide Java/Node `PATH` change is claimed. The direct license/notice check does not
qualify all transitive licenses or future customer packaging.

## 2. Database bootstrap

The reviewed, no-password [bootstrap SQL](../../../deploy/development/bootstrap-postgresql.sql)
had local and transferred SHA-256
`654f51a7762b44e0ab0896890883a6fa30ceb299e81e3d7ff7bbb28c31365cb8`.
The Project Reviewer ran it under the local `postgres` administrator in their own SSH terminal.
Their supplied output reported `DO`, two `CREATE ROLE`, `CREATE DATABASE`, expected `REVOKE` /
`GRANT` and `ALTER DEFAULT PRIVILEGES` results, with no error. This supports creation of
`idea_ddm_dev`, `idea_ddm_migrator` and `idea_ddm_app`; the agent did not receive a sudo password.

The script deliberately does not contain passwords. On 2026-09-24 the Project Reviewer used
interactive `psql \password` prompts to assign different credentials to the two roles, then ran
separate TCP login tests against `127.0.0.1:5432`. Supplied non-secret results:

```text
idea_ddm_app|idea_ddm_dev|f
idea_ddm_migrator|idea_ddm_dev|t
```

The last field is `has_schema_privilege(current_user, 'public', 'CREATE')`. Thus the application
role connects but cannot create schema objects, while the migration role can. The agent did not
receive or inspect either password. Flyway migration and an actual IDEA application connection
remain `NOT-RUN`.

## 3. P04 disposition

The exact internal development runtimes are present and basically healthy, and the two database
roles passed distinct login/privilege checks. This runtime observation alone does not decide P04.
The Project Reviewer later recorded `PASS` for the one-developer development-environment scope in
[P04 review evidence](P04-ENV-REVIEW-20260924.md). The result does not qualify application build,
Flyway migration, Gateway/Vault I/O, accepted deployment or PG4.
