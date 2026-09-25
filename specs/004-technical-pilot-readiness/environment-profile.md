# PH0 Environment Profile

**Increment**: `IE-INC-READY-001`
**Record ID**: `IE-PH0-P04-ENV-001`
**Version / status**: `1.5` / Draft; P04 execution `IN-PROGRESS`, readiness result `PASS`
**Owner**: Principal Product Author
**Reviewer**: Project Reviewer for the development layout and allocated development host;
future accepted deployment operations require a separately named owner
**Boundary**: This profile defines the permitted pilot environment. It does not install software,
select an unapproved runtime, start production services or authorize implementation.

## 1. Environment classes

| Class | Permitted use | Recorded state |
|---|---|---|
| Windows engineering workstation | WPF/WebView2 Desktop, per-user `.NET` Workspace, browser review and approved external CAD/Office association. It may hold a Git editing checkout; the Linux services are built/run on the development server. | The current Windows machine was inspected on 2026-09-23. Windows-specific client build, native bridge and CAD/Office checks remain `NOT-RUN`. |
| Allocated Ubuntu development server | Native Java Server, React Web/Node.js build, PostgreSQL and one filesystem Vault for one-developer development. | Authenticated SSH inventory on 2026-09-23 confirmed Ubuntu 26.04.1 LTS, x86_64, 6 CPUs, 14 GiB RAM, Git and SSH access. Native PostgreSQL 18.6 is online on loopback; checksum-verified Temurin 25.0.4.1+1 and Node.js 24.21.0 run from `/opt/idea/tools`. Product build and integration remain `NOT-RUN`. |
| Development Vault location | One initial server filesystem location at `/srv/idea/artifacts/vault-01`, addressed through stable `VaultId=VAULT-01` and `LocationId=SERVER-DEV-01`. | The dedicated ext4 mount has 108 GiB total, 103 GiB available; its root is mode `750`, owned by `idea-server`. The Project Reviewer found only `lost+found`, then created `vault-01` with mode `700` and verified `idea-server` write eligibility. Adapter I/O and backup remain `NOT-RUN`. This is runtime data outside Git, not a second failure domain. |
| Later accepted deployment | A separately qualified deployment using the approved Linux-first Server direction. | The development host does not by itself prove production readiness, backup/restore, HTTPS, client-network access or a second Vault location. Those decisions retain their own evidence. |
| Synthetic test storage | Repository-safe manifests, digests and synthetic fixtures only. | No company production file or real credential may be committed. |

### 1.1 Current workstation observation — 2026-09-23

| Item | Observed value | P04 interpretation |
|---|---|---|
| Operating system | Windows 11 Pro, version `10.0.26200`, build `26200`, 64-bit | Windows client development machine; Linux Server evidence is recorded separately after SSH inventory. |
| Git | `2.54.0.windows.1` | Available. |
| .NET SDK | `10.0.300` | Available for future WPF/Workspace work; no product project exists before PG4. |
| Docker | Client `29.7.2`; `desktop-linux` context; engine unavailable during inspection | Historical temporary candidate only; Docker is no longer part of the selected P04 development setup. |
| Node.js / npm | Node `24.16.0`; npm `12.0.2` | Historical Windows observation. The Web build targets Ubuntu, where Node 24.21.0 and npm 11.19.0 are installed; Web build remains `NOT-RUN`. |
| Java / Maven / PostgreSQL client | Commands not found | This Windows observation does not decide Linux Server readiness. Ubuntu inventory is recorded below. |

### 1.2 Ubuntu development host observation — 2026-09-23 to 2026-09-24

| Item | Observed value | P04 interpretation |
|---|---|---|
| Host and access | `ideaddmserver`; authenticated SSH as `phuclam`; static development address `192.168.137.33/24` observed on 2026-09-25 after the user-applied Netplan change | The address is now stable for this development host. It is still not an accepted-deployment route; application endpoint and client-service checks remain `NOT-RUN`. Earlier DHCP observations remain historical evidence. |
| Operating system / architecture | Ubuntu 26.04.1 LTS / `x86_64` | Matches the selected Ubuntu Server 26.04 LTS direction. |
| CPU / memory / clock | 6 CPUs; 14 GiB RAM; 4 GiB swap; `Asia/Ho_Chi_Minh`; NTP synchronized | Development capacity observed, not a performance or availability qualification. |
| System filesystem | 98 GiB total, 86 GiB available at `/` | Keep Vault payloads off the OS filesystem. |
| Artifact filesystem | Dedicated ext4 mount `/srv/idea/artifacts`; 108 GiB total, 103 GiB available; mode `750`, owner `idea-server:idea-server` | The Project Reviewer inspected the mount, found only `lost+found`, created `vault-01` as `idea-server` with mode `700`, and confirmed service-account write eligibility. Actual Adapter I/O remains untested. This capacity does not qualify GB-per-file/TB-per-project scale. |
| Installed tools / services | Git `2.53.0`; Temurin 25.0.4.1+1; Node.js 24.21.0 / npm 11.19.0; PostgreSQL 18.6 (`18/main` online, `127.0.0.1:5432`) | Exact development runtime identities and basic health observed. The Project Reviewer verified separate app/migrator TCP logins and schema privileges; application build and service integration remain `NOT-RUN`. See [native runtime intake](../../docs/research/2026-09-23-p04-ubuntu-native-runtime-intake.md). |

## 2. Candidate tool and version profile

The table records the current Engineering baseline without turning a candidate into runtime evidence.

| Boundary | Candidate / decision | Qualification or approval still required |
|---|---|---|
| Web client | React + TypeScript according to the approved Tech successor; Node.js 24 LTS Web build/development preview on Ubuntu. | Official Linux Node.js 24.21.0 archive checksum and installed `node`/`npm` versions verified. Web package lock, build and browser check remain `NOT-RUN`. |
| Windows shell / Workspace | WPF + WebView2; `.NET` build/publish applies specifically to WPF + Workspace. | Windows image, WebView2 servicing and native bridge review remain `NOT-RUN`. |
| IDEA Server | Java 25 / Temurin 25 / Spring Server is built and run natively on the Ubuntu development host from a versioned source commit. | Official Linux Temurin 25.0.4.1+1 archive checksum and installed `java`/`javac` versions verified. IDEA Server source/build/service start remain `NOT-RUN`. The previously pinned Windows Temurin ZIP is historical research. |
| PostgreSQL | One native PostgreSQL 18 development instance on Ubuntu with separate application and migration roles. | Ubuntu 18.6 server/client packages installed; `18/main` online, `pg_isready` accepts loopback connections. Project Reviewer ran bootstrap SQL, assigned separate passwords interactively and verified both TCP logins: app schema `CREATE=f`, migrator `CREATE=t`. Flyway migration and application connection remain `NOT-RUN`. The Docker image pin is historical. |
| Artifact Gateway / Vault Adapter | The future Gateway boundary is preserved. Core v0 begins with one filesystem-backed Vault location identified independently from documents and folders. | D1-A plan is recorded for PH1; exact Gateway runtime/toolchain, Adapter and endpoint remain `NOT-RUN`. The local filesystem path is not multi-location evidence and does not authorize direct client access to stored bytes. |
| Format Worker | Separate Windows boundary selected for CAD/Office/Format Adapter profiles. | Exact worker runtime/toolchain, licensed application availability and format qualification are `NOT-RUN`; the worker itself is not labelled conditional. |
| Database migration | Flyway versioned SQL owned by the Server delivery boundary after an approved implementation increment. Applied migrations are immutable; later changes use a new migration. | PostgreSQL 18.6 and the development database/roles are installed; no Flyway application-schema migration has run in PH0. Destructive/incompatible change recovery requires the coordinated backup/restore procedure from P06 rather than an invented automatic down-migration. |

No dependency may be downloaded or installed only because it is convenient. Any external source,
runtime, converter, font or SDK must first have an exact version, license and commercial-use state
recorded through [external-source-intake.md](../../docs/agents/external-source-intake.md).
The earlier Docker Desktop, PostgreSQL image and Windows Temurin findings are retained as historical intake in
[`IE-RES-PH0-DEP-20260923-001`](../../docs/research/2026-09-23-p04-development-runtime-license-intake.md);
they do not qualify the current Ubuntu dependency set. [Native Ubuntu intake](../../docs/research/2026-09-23-p04-ubuntu-native-runtime-intake.md)
records exact development artifacts, checksums, installed versions and direct license terms;
full transitive/security and future commercial distribution review remain open.

## 3. Configuration and secret ownership

| Item | Owner | PH0 rule |
|---|---|---|
| Ubuntu development configuration and PostgreSQL credentials | Project Reviewer / LEAD (current developer/server operator) | Keeps development secrets in a restricted server-local file outside Git; does not print or share values. Application and migration roles have separate credentials. |
| PostgreSQL bootstrap administrator | Project Reviewer / LEAD | Ran the reviewed development-only bootstrap SQL, assigned two separate passwords through interactive `psql` and verified app/migrator logins and schema privileges. The bootstrap identity is not used by the application. |
| Native account bootstrap and reset policy | Account Administrator / QLHT | No public self-registration or shared default password. |
| Later accepted-deployment service identity and database secret | Named Operations owner to be assigned before that deployment | Secrets stay outside source control and outside client/Workspace files; the development operator is not automatically the future production custodian. |
| Vault endpoint and Gateway credentials | Artifact Custody/Operations | Client receives only a short-lived scoped Transfer Grant; no permanent provider path or credential. |
| Format Worker licensed application/configuration | Format/Operations owner | License and worker sandbox evidence required before a format job is called qualified. |
| Backup encryption/key recovery | Operations/Security reviewer | Backup/restore is a coordinated recovery set; exact key custody is `UNKNOWN` until assigned. |

The tracked [Ubuntu development template](../../config/idea-core-v0.server.env.example) lists
server-side names and placeholders; a filled copy belongs in a restricted, ignored server-local
file. The [Windows client template](../../config/idea-core-v0.env.example) contains only the
client-facing development URLs. Neither tracked file contains a real password, token or host
credential. The user previously entered application/migration values in an ignored Windows local
file for the retired Docker plan. The author did not open that file. It must not be copied to the
Ubuntu host; create server-specific development secrets through the controlled setup.

## 4. Repeatable future entry points

The following are named entry points for a future authorized increment, not commands run by PH0.
The exact commands become executable only after PG4 authorizes PH1 and the corresponding source
projects exist:

- `dotnet build` / `dotnet publish`: WPF + Workspace only, after the approved build environment exists.
- `./mvnw verify` and `./mvnw package`: planned Ubuntu entry points for the Java Server through a
  repository-owned Maven Wrapper; not globally installed Maven and not currently runnable.
- `npm ci`, `npm run lint`, `npm test` and `npm run build`: planned Web entry points under the
  approved Node.js 24 LTS family and an exact lockfile. The observed installation is permitted but
  does not become qualification evidence until the commands run against the controlled project.
- [Ubuntu development runbook](../../deploy/development/README.md): authenticated host inventory,
  installed native runtime checks, one-Vault provisioning, secret ownership and future reproducible
  server-side build evidence. No IDEA application build or integration check has passed yet.
- Migration entry point: Flyway versioned SQL owned by the Server delivery boundary; not run in PH0.
- Verification entry point: procedures in the VVP, using the approved synthetic dataset and exact
  environment manifest.

### 4.1 Planned monorepo layout after PG4

P04 selects one repository layout for the first code-bearing increment. Only
`deploy/development/` is prepared now for the Ubuntu runbook; application,
migration and test source directories remain future PH1 work after authorization.

```text
apps/server/          Java/Spring Server
apps/web/             React/TypeScript Web client
apps/desktop/         WPF/WebView2 Windows shell
apps/workspace/       Per-user .NET Workspace process
database/migrations/  Flyway versioned SQL
deploy/development/   Ubuntu development-server runbook
config/               Tracked non-secret templates only
tests/                Cross-boundary verification
```

Three applications do not require three Git repositories. The monorepo remains the default while
one primary developer owns coordinated API, migration and release changes. A successor decision may
split repositories only when independently owned teams, different release cadences, materially
different source-access rules or measured build/repository cost justify the additional coordination.

### 4.2 Ubuntu development and later deployment contract

The new Ubuntu host supports developer work. Because Core v0 currently has one developer and no
acceptance test has been executed, a successful development run is not evidence of accepted
deployment or operational readiness. PH1 implementation and review preserve these rules:

1. The Java Server is packaged as a versioned executable JAR and runs natively on Ubuntu.
2. The server-side checkout resolves to a recorded source commit and dependency lock; a rebuild
   records the commit, tool versions and artifact hash. Windows client work uses the same reviewed
   API/source baseline.
3. Server configuration enters through external configuration/environment values. Source code must
   not contain `C:` paths, developer usernames, localhost-only database assumptions or real secrets.
4. Filesystem paths are owned by the Vault Adapter. Product-domain code uses `VaultId`, `LocationId`,
   `ArtifactId` and digest; it does not construct physical Windows or Linux paths.
5. PostgreSQL access uses the supported protocol/schema and Flyway history. A native development
   package does not imply production package or migration qualification.
6. The development Vault path is the selected server-local location
   `/srv/idea/artifacts/vault-01`. Changing a physical path must not change document or Artifact
   identity; the configured logical location is recorded separately for each environment.
7. The later accepted deployment requires its own service-account, filesystem-permission, HTTPS,
   logging, backup and `systemd` evidence. Development access does not qualify those controls.
8. After PG4 authorizes PH1, an authorized check builds the Server, runs its automated tests and
   starts the exact artifact on the Ubuntu development host with PostgreSQL and one Vault.

## 5. Prohibited environment actions

- Do not install SDKs, CLIs, packages, services, converters or licensed applications without the
  applicable company approval and external-source/license record.
- Do not resume the retired Docker/Windows Server-development path as if it were the current P04
  allocation. Any alternative requires an explicit environment decision and evidence update.
- Do not use real production files, credentials or Vault paths in repository fixtures.
- Do not bypass Server/RBAC checks by editing the database, local Workspace Manifest or Vault bytes.
- Do not call a local upload, worker result or database row a passed product verification.

## 6. Readiness status

`P04-ENV-001` readiness review is `PASS` for the one-developer development environment described
here. The Project Reviewer selected Ubuntu Server 26 as the development host for Java Server, React Web, native
PostgreSQL and one filesystem Vault; Windows remains the Desktop/Workspace/CAD machine. The five
Delivery Card outputs are prepared here: permitted environment (§§1–2), future build/test entry
points and Ubuntu runbook (§4), configuration and development secret owner (§3), migration controls
(§§2, 4), and increment layout (§4.1–4.2).
Authenticated SSH and read-only OS/resource/tool inventory identify the development host and its
dedicated artifact mount. The Project Reviewer created the one Vault directory and verified its
service-account write eligibility; [P04 host evidence](evidence/P04-UBUNTU-HOST-20260923.md)
separates agent observations from Reviewer-supplied privileged output. Native dependency
installation is now evidenced; database and limited roles were created by Project Reviewer-supplied
bootstrap output. The Reviewer also verified separate role logins and schema privileges. Actual
Vault Adapter I/O, client application endpoints and application build entry points remain
`NOT-RUN` because the product source projects are not part of this PH0 setup. They are not claimed
as tested by this P04 result. The current development host now uses the user-applied static address
`192.168.137.33` for the hotspot-backed single-developer setup; this is not an accepted-deployment
route. A stable DNS/reserved address and shared-network review are still required before shared use.
Later accepted-deployment ownership and evidence remain separate. See [P04 reviewer result](evidence/P04-ENV-REVIEW-20260924.md)
and [P07 static-IP observation](evidence/P07-UBUNTU-HOST-STATIC-IP-20260925.md).

## Change log

| Version | Date | Change | Evidence |
|---|---|---|---|
| 0.1 | 2026-09-18 | Initial permitted-environment profile; unknowns remain visible and no setup was executed. | T017 |
| 0.2 | 2026-09-23 | Record the inspected Windows development machine, local Backend/Web/Desktop split, PostgreSQL-only Docker boundary, one filesystem Vault, non-secret configuration template, future monorepo layout and migration rules. No dependency was installed or started; P04 result remains `NOT-RUN`. | Project Reviewer grilling decisions; local read-only tool inspection; T017/T021 update |
| 0.3 | 2026-09-23 | Record the project user's confirmation that the company satisfies both Docker Desktop free-use thresholds; clarify that current local development is not acceptance evidence and actual Server/network allocation is deferred to Server deployment qualification. | User Q8–Q9 confirmation; `IE-RES-PH0-DEP-20260923-001` |
| 0.4 | 2026-09-23 | Pin PostgreSQL `18.6-trixie` by immutable multi-platform digest and record the `linux/amd64` manifest/source revision without pulling the image. Docker remains a temporary local-development dependency only. | User Q10 decision; Docker registry manifest inspection; `IE-RES-PH0-DEP-20260923-001` |
| 0.5 | 2026-09-23 | Select the portable Temurin `25.0.4.1+1` Windows x64 ZIP, exact SHA-256 and an external tool root. No download, extraction or workstation-wide PATH change was performed. | User Q11 decision; official Adoptium release metadata; `IE-RES-PH0-DEP-20260923-001` |
| 0.6 | 2026-09-23 | Reconcile the PDA-approved Node.js 24 LTS Web-build family with the observed local Node.js `v24.16.0` / npm `12.0.2`. Exact lockfile/build qualification remains `NOT-RUN`. | `IE-CHG-TECH-NODE24-001`; `IE-RES-NODE24-20260923-001` |
| 0.7 | 2026-09-23 | Record Project Reviewer / LEAD as custodian of local development configuration and PostgreSQL credentials; distinguish this from QLHT/Operations custody for later company Server deployment. Map the five documentary P04 outputs without claiming readiness `PASS`. | User confirmation of recommended P04 ownership; P04 Delivery Card |
| 0.8 | 2026-09-23 | Add the pinned PostgreSQL-only Compose model and local runbook, distinguish the bootstrap administrator from future app/migration roles, and record a no-secret syntax check. Direct-source license checks do not close whole-image intake or runtime readiness. | User approval of documentary P04 approach; `docker compose --env-file config/idea-core-v0.env.example -f deploy/development/compose.yaml config --quiet`; `IE-RES-PH0-DEP-20260923-001@0.2` |
| 0.9 | 2026-09-23 | Replace the temporary Windows/Docker development allocation with the newly allocated Ubuntu Server 26. Keep Windows for Desktop/Workspace/CAD, use native PostgreSQL and one server filesystem Vault, retire active Compose/configuration paths, and keep actual server checks `NOT-RUN`. | Project Reviewer confirmed the recommended split and reported a new empty Ubuntu host; active Windows SSH transport observed; agent-side authentication unavailable at this revision. |
| 1.0 | 2026-09-23 | Record authenticated read-only Ubuntu 26.04.1 host, resource, service and mounted-artifact inventory; inspect the empty IDEA mount and create `/srv/idea/artifacts/vault-01` for `idea-server` with mode `700`. Keep Adapter I/O, dependency installation and runtime qualification open. | [P04 host evidence](evidence/P04-UBUNTU-HOST-20260923.md): agent SSH inventory and Project Reviewer-supplied privileged output. |
| 1.1 | 2026-09-23 | Record checksum-verified Ubuntu Temurin/Node installation, native PostgreSQL 18.6 service, installed license-file presence and Reviewer-run database/role bootstrap. Keep passwords, role login, product build and integration evidence open. | [Native runtime intake](../../docs/research/2026-09-23-p04-ubuntu-native-runtime-intake.md); Reviewer-supplied bootstrap output; authenticated SSH runtime checks. |
| 1.2 | 2026-09-24 | Record DHCP address change and Reviewer-run distinct app/migrator login and schema-privilege tests without exposing passwords. Keep future application integration and Vault Adapter I/O `NOT-RUN`. | [P04 runtime evidence](evidence/P04-UBUNTU-RUNTIMES-20260923.md); authenticated SSH and Reviewer-supplied non-secret output. |
| 1.3 | 2026-09-24 | Correct the host-summary and migration rows to reflect the already-recorded PostgreSQL installation and separate role-login results; Flyway and product integration remain `NOT-RUN`. | Editorial consistency check against [P04 runtime evidence](evidence/P04-UBUNTU-RUNTIMES-20260923.md). |
| 1.4 | 2026-09-24 | Record the Project Reviewer-authorized `PASS` for the one-developer P04 environment scope; preserve DHCP, unbuilt applications and untested Vault Adapter I/O as explicit limits. | [P04 reviewer result](evidence/P04-ENV-REVIEW-20260924.md). |
| 1.5 | 2026-09-25 | Record the user-applied static development address `192.168.137.33` and read-only host recheck; keep application endpoints, Adapter I/O, multi-Vault and accepted deployment separate. | [P07 static-IP observation](evidence/P07-UBUNTU-HOST-STATIC-IP-20260925.md). |
