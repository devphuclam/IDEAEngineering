# Ubuntu development server — P04

The newly allocated Ubuntu Server 26 is the development host for the Java Server, React Web
build/development preview, native PostgreSQL and one filesystem Vault. IDEA Desktop, the per-user Workspace
and CAD/Office interaction remain on Windows engineering machines. Core v0 uses one Vault location;
the product identifiers and Artifact Custody boundary preserve later multi-vault work.

An authenticated SSH inventory on 2026-09-23 confirmed Ubuntu 26.04.1 LTS (x86_64),
6 CPUs, 14 GiB RAM and native Git. The host has a dedicated mounted ext4 partition for
IDEA artifacts: 108 GiB total, 103 GiB available at `/srv/idea/artifacts`. The Project Reviewer
confirmed the mount held only `lost+found` and created `vault-01` with mode `700`, owned and
writable by `idea-server`. Native PostgreSQL 18.6 is online on loopback; checksum-verified Temurin
25.0.4.1+1 and Node.js 24.21.0 are installed. The Reviewer ran the database/role bootstrap without
reported error. Separate app/migrator passwords and role logins were then verified interactively,
with no password shared. Application service start and product integration remain unverified. See
[the environment profile](../../specs/004-technical-pilot-readiness/environment-profile.md) for
the evidence state. This runbook describes the environment and operating steps; the attributable
P04 result and its limits are recorded in the [review evidence](../../specs/004-technical-pilot-readiness/evidence/P04-ENV-REVIEW-20260924.md).

## 1. Read-only host inventory

Run these commands in the Ubuntu SSH session and retain the date and relevant output. They do not
install software or change service configuration:

```bash
hostnamectl --static
cat /etc/os-release
uname -m
nproc
free -h
df -h /
command -v git
command -v java
command -v node
command -v psql
ss -ltn
```

Record existing accounts, services, occupied ports and available storage before provisioning.
The user report that the server is new is an allocation input; the inventory establishes what is
actually present. Do not reuse a path or database found to belong to another workload.

## 2. Development layout to qualify

| Component | Planned development location | Evidence still required |
|---|---|---|
| Git source checkout and build | Ubuntu, at the same commit as the reviewed Windows checkout | Git access, commit, build-tool and artifact hashes |
| Java 25 / Temurin 25 Server | Temurin 25.0.4.1+1 under `/opt/idea/tools`; future versioned executable JAR | JDK version/notice checked; IDEA Server build and start untested |
| React/TypeScript Web | Node.js 24.21.0 under `/opt/idea/tools` for build and development preview | Node/npm version/license checked; Web lockfile, build and browser check untested |
| PostgreSQL 18 | Native Ubuntu 18.6 service on loopback; separate `idea_ddm_dev` database | Package/service, bootstrap and distinct role login/privilege checks observed; migration history and application connection untested |
| Filesystem Vault | One server-local location at `/srv/idea/artifacts/vault-01` on the dedicated IDEA artifact partition | Directory ownership/mode and service-account write test passed; actual Adapter I/O and backup remain untested |
| IDEA Desktop / Workspace | Windows engineering machine | Windows build, local-file behavior and Server connection |

The earlier PostgreSQL Docker image and Windows Temurin ZIP intake are retained as historical
research. They are not the current development dependencies. The [native Ubuntu intake](../../docs/research/2026-09-23-p04-ubuntu-native-runtime-intake.md)
records exact internal-development candidates and license obligations under
[external-source intake](../../docs/agents/external-source-intake.md).
The exact Gateway runtime and Format Worker toolchain retain their separate `NOT-RUN` states.

The mounted artifact directory is owned by the `idea-server` system account with mode `750`;
the `phuclam` SSH account cannot inspect or write its contents without an authorized privileged
action. The Project Reviewer inspected it before creating `vault-01`; [the P04 host evidence](../../specs/004-technical-pilot-readiness/evidence/P04-UBUNTU-HOST-20260923.md)
records the result. The 103 GiB currently free is development capacity only; it does not
satisfy the later GB-per-file/TB-per-project objective.

## 3. Configuration and access

Use [the tracked Ubuntu template](../../config/idea-core-v0.server.env.example) only as a list of
expected names. Keep the filled server-local file outside Git with restricted permissions. The
Project Reviewer/current developer owns development credentials; application, migration and
bootstrap database privileges are distinct. The older ignored Windows `.env` copy is not a
server credential source and must not be copied to Ubuntu.

Initial one-developer access can forward the loopback-bound Server and Web ports through SSH.
Before allowing another machine or user to connect, record the intended route, bind address,
authentication and firewall rules. Never expose PostgreSQL or the Vault filesystem directly to
browser/Desktop clients. The future direct large-file transfer follows the scoped Gateway/Grant
design when that boundary is implemented and qualified.

The server-side repository checkout should resolve to the same commit used by the Windows client
work. Record how code reaches the server, the commit ID and the exact build output before calling
a run reproducible. No production source tree is created by PH0; these are entry points for the
authorized code-bearing increment.

For the development database, run the reviewed
[bootstrap SQL](bootstrap-postgresql.sql) as the local PostgreSQL administrator only after
confirming the target role/database names. The script creates two non-privileged login roles and
one database without storing passwords; use interactive `psql` `\password` prompts to set
separate values, then keep them in a restricted server-local configuration file. Application
access and migration ownership are separate. Do not use the `postgres` superuser from IDEA.

## 4. P04 evidence and later runtime checks

P04 covers the development environment and delivery procedure defined by the current Delivery Card.
Its readiness record is based on these outcomes:

1. Confirm the host OS/version, network route, CPU, memory, free storage and existing services.
2. Record exact native package identities and license/notice treatment for PostgreSQL 18,
   Temurin 25 and Node.js 24; then verify installed versions on the server.
3. Create separate development database roles and a single Vault location after checking their
   target names/paths; retain permissions and health evidence without recording passwords.
4. Document the build/test commands, versioned migration entry point, configuration ownership and
   prohibited actions in the controlled environment profile.
5. Record the Project Reviewer's P04 result separately against the Delivery Card and retained
   evidence.

The IDEA application source projects do not yet exist, so the application build, Flyway migration,
Vault Adapter I/O and Windows-to-application endpoint test cannot run in this PH0 setup. They remain
`NOT-RUN` and are not represented as P04 test results. Verify the client route when the endpoints
exist in the authorized implementation increment. P04 PASS is limited to the prepared one-developer
development environment and its documented delivery process; it does not approve deployment,
product integration or PG4.

Later deployment, backup/restore, security and multi-vault claims keep their own review and
verification paths. Do not use this one development machine as evidence for those outcomes.
