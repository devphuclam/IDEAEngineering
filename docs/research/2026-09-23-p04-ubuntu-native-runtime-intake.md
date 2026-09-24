# P04 Ubuntu Native Runtime Intake

| Field | Value |
|---|---|
| Stable knowledge ID | `IE-RES-PH0-UBU-20260923-001` |
| Document class / title | `IE-RES` / P04 Ubuntu Native Runtime Intake |
| Version / status | `0.5` / `Draft` |
| Product normativity | `INFORMATIVE`; this records dependency identity and permitted development use, not a Feature, Tech Stack selection, PG4 decision or commercial-release approval |
| Repository process authority / instruction state | `NOT-APPLICABLE` / `NOT-APPLICABLE` |
| Evidence date | 2026-09-23 (Asia/Ho_Chi_Minh) |
| Owner / author | Principal Product Author / Principal Product Author |
| Reviewer / acceptance authority | Project Reviewer for the development environment; legal/company owner for any later distribution question |
| Applicable baseline | P04 Ubuntu 26.04.1 development host; `environment-profile.md@1.4`; Java 25 / Temurin 25, Node.js 24 and PostgreSQL 18 families unchanged |
| Scope / intended use | `DEPENDENCY`: native Ubuntu PostgreSQL service and Temurin runtime for internal Core v0 development; Node.js is the Web build/development-preview tool. No third-party runtime is copied into the IDEA repository or bundled with a customer deliverable at this stage. |
| Source / upstream trace | Official Ubuntu package metadata observed on the allocated host; official PostgreSQL, Eclipse Adoptium and Node.js release/license sources listed below |
| Downstream trace | [Environment profile](../../specs/004-technical-pilot-readiness/environment-profile.md), [P04 runbook](../../deploy/development/README.md), D5 in [readiness register](../../specs/004-technical-pilot-readiness/readiness-register.md) |
| Change / Work Item trace | `IE-INC-READY-001`, P04/T017/T022, D5; no Product Scope or technology decision change |
| Supersedes / superseded by | Earlier [Docker/Windows candidate intake](2026-09-23-p04-development-runtime-license-intake.md) remains historical; this record does not erase its evidence / `NOT-APPLICABLE` |
| Classification / retention | `INTERNAL`; retain with P04 and the later dependency inventory/SBOM |
| Review trigger | Exact package/archive version, source, included components, use or redistribution model changes |
| Evidence status / authority limit | Source identity and direct license terms researched; exact archives downloaded and SHA-256 verified, native packages installed, direct runtime versions checked, and installed license-file presence observed. P04 reviewer result is `PASS` for the one-developer development environment; full transitive license/security review, application build and product integration remain `NOT-RUN`. This is engineering intake, not legal advice or commercial-distribution approval. |

## 1. Decision boundary

The following exact artifacts are candidates **only for the allocated internal development host**.
They do not change the selected technology families and do not approve packaging any runtime in
a future commercial product. A server package installed from Ubuntu and a downloadable archive
are distinct artifacts with different provenance. The old PostgreSQL Docker image and Windows
Temurin ZIP do not qualify these Ubuntu artifacts.

| Component | Exact candidate and primary source | SHA-256 / source evidence | Direct license finding and development disposition |
|---|---|---|---|
| PostgreSQL Server + client | Ubuntu `postgresql-18` and `postgresql-client-18`, version `18.6-0ubuntu0.26.04.1`, `amd64`, from `resolute-updates` / `resolute-security` | Server `.deb` SHA-256 `0536716204dee9152dee758c252936ba41c93b7330395f8abb0c5b86558aa658` from the host's apt index. Both packages installed at the pinned version; `psql 18.6`, cluster `18/main` online and loopback-only on port 5432. Installed copyright files present. | PostgreSQL License permits internal and commercial use subject to its notice. `APPROVED-WITH-OBLIGATIONS` for native internal development only: retain the installed package copyright/license inventory and do not claim the complete Ubuntu dependency set or future redistribution is approved. |
| Eclipse Temurin JDK | Official Adoptium release `jdk-25.0.4.1+1`, Linux `x64` HotSpot archive `OpenJDK25U-jdk_x64_linux_hotspot_25.0.4.1_1.tar.gz` | SHA-256 `dbb698396d478e7fa2b1e50f4103324b2a99b90569ee27c33f2261f9215cf41e` from the official release asset metadata; downloaded archive matched the checksum. Installed in `/opt/idea/tools/jdk-25.0.4.1+1`; `java` and `javac` report 25.0.4.1. Bundled `NOTICE` and `legal/java.base/LICENSE` are present. | Adoptium says Temurin binaries are free to use under GPLv2 with Classpath Exception; OpenJDK also has an Assembly Exception for some code. `APPROVED-WITH-OBLIGATIONS` for unmodified internal JDK use only: retain bundled license/notice files and reassess if bundled or redistributed commercially. |
| Node.js | Official release `v24.21.0` (LTS), Linux `x64` archive `node-v24.21.0-linux-x64.tar.xz` | SHA-256 `fd8e59d5a511510f6a298afb548f18c7d2b1be404d8b4a27d94fbe49f56cb2d6` from official `SHASUMS256.txt`; downloaded archive matched. Installed in `/opt/idea/tools/node-v24.21.0-linux-x64`, root-owned; `node v24.21.0`, npm `11.19.0` with an explicit per-command `PATH`. Bundled `LICENSE` is present. | Node.js core uses MIT; the exact release `LICENSE` includes separately licensed components. `APPROVED-WITH-OBLIGATIONS` as an internal build/development tool only: keep the release license file and reassess if Node or npm dependencies enter a distributed product. |

The selected Ubuntu host's stock `nodejs` apt candidate is 22.22.1, so installing it would not
implement the approved Node.js 24 family. Ubuntu `openjdk-25-jdk` is not silently substituted for
the selected Temurin 25 distribution. The exact Ubuntu PostgreSQL package candidate was confirmed
by `apt-cache policy`; a non-mutating `apt-get --simulate --no-install-recommends` showed eight
new packages (PostgreSQL server/client plus six dependencies), with no upgrades or removals.
The simulation did not itself install anything. The subsequent supervised installation added the
eight expected packages. Installed versions were observed for `libjson-perl` 4.10000-1, `libpq5`
18.6, `liburing2` 2.14-1, PostgreSQL server/client 18.6, `postgresql-client-common` and
`postgresql-common` 290ubuntu1, and `ssl-cert` 1.1.3ubuntu2. Each has an installed
`/usr/share/doc/<package>/copyright` file. Presence is not a completed license-by-license or
vulnerability review for later commercial distribution.

## 2. Sources and license evidence

- [Ubuntu PostgreSQL 18 package index](https://packages.ubuntu.com/resolute-updates/postgresql-18): server package identity is additionally captured from the allocated host's apt metadata. The host's index, not a web page, is the exact package/hash source for installation.
- [PostgreSQL License](https://www.postgresql.org/about/licence/) and [PostgreSQL commercial-use FAQ](https://www.postgresql.org/about/press/faq/): direct project terms; preserve required copyright/license notice on any future copy or redistribution.
- [Official Temurin 25 release](https://github.com/adoptium/temurin25-binaries/releases/tag/jdk-25.0.4.1%2B1), [Adoptium licensing FAQ](https://adoptium.net/docs/faq) and [Adoptium license summary](https://adoptium.net/en-GB/what-we-do): archive identity, direct use terms and GPL exceptions. Review the archive's actual bundled notices after checksum verification.
- [Official Node.js v24.21.0 archive](https://nodejs.org/en/download/archive/v24.21.0), [official checksum list](https://nodejs.org/download/release/v24.21.0/SHASUMS256.txt) and [exact-tag license file](https://github.com/nodejs/node/blob/v24.21.0/LICENSE): binary identity and included third-party terms.

## 3. Obligations and remaining checks

| Check | Owner | Current state |
|---|---|---|
| Verify the exact downloaded JDK/Node archive SHA-256 before extraction; retain immutable source URLs and checksums | Current development server operator | `DONE` for both archives and their stated SHA-256 |
| Record installed PostgreSQL and transitive package names, versions, source and `/usr/share/doc/*/copyright` evidence | Current development server operator | `PARTIAL`: eight exact installed names/versions and copyright-file presence recorded; complete copyright content/security review remains open |
| Retain JDK and Node bundled license/notice material with the internal installation inventory | Current development server operator | `DONE` for installed file presence; later redistribution package review remains open |
| Verify `java`, `node`, `npm`, `psql` and PostgreSQL service versions on the allocated host | Current development server operator | `DONE` for installed runtime/version and loopback service health; application integration not tested |
| Review any later customer packaging/redistribution, transitive dependencies, CAD/Office/Format Adapter licensing and SBOM | Legal/company owner with Engineering | `BLOCKED-LEGAL` for commercial distribution; not required to assert an internal development runtime works |

No IDEA application source currently depends on these packages in an executable project. The
exact internal development runtimes are installed, and separate database role logins/schema
privileges were verified by the Project Reviewer. The P04 environment disposition is recorded in
the [readiness register](../../specs/004-technical-pilot-readiness/readiness-register.md) and its
[review evidence](../../specs/004-technical-pilot-readiness/evidence/P04-ENV-REVIEW-20260924.md).
No application build, Flyway migration or Gateway/Vault integration result is claimed here. D5's
transitive/security review and any future commercial distribution review remain open.

## Change log

| Version | Date | Change | Evidence |
|---|---|---|---|
| 0.1 | 2026-09-23 | Pin exact Ubuntu PostgreSQL package and official Linux Temurin/Node candidates for internal development; separate direct license permission from installed/transitive and commercial-distribution checks. | Host apt metadata and simulation; official sources in Section 2 |
| 0.2 | 2026-09-23 | Record checksum-verified Temurin/Node downloads, supervised native PostgreSQL installation, installed runtime versions and license-file presence. Retain full transitive/commercial review as open. | Authenticated SSH commands and Project Reviewer-supplied privileged command output; exact paths and versions in Sections 1–3 |
| 0.3 | 2026-09-24 | Align the development-host baseline and database-role verification statement with the Reviewer-supplied separate login/privilege results; retain product integration and commercial review as open. | [P04 runtime evidence](../../specs/004-technical-pilot-readiness/evidence/P04-UBUNTU-RUNTIMES-20260923.md) |
| 0.4 | 2026-09-24 | Point to the P04 reviewer disposition while keeping application build, product integration, transitive license/security and commercial distribution review open. | [P04 reviewer result](../../specs/004-technical-pilot-readiness/evidence/P04-ENV-REVIEW-20260924.md) |
| 0.5 | 2026-09-24 | Align the applicable environment-profile version with the recorded P04 development-environment result. | `environment-profile.md@1.4` |
