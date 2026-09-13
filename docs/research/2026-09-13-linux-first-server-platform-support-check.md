# Linux-first Server Platform Support Check for IDEA Engineering

| Control field | Value |
|---|---|
| Stable Research ID | `IE-RES-TECH-LINUX-20260913-001` |
| Document class / version | `RESEARCH-FACT-CHECK` / `Draft 0.1` |
| Artifact role / Product normativity | `INFORMATIVE RESEARCH INPUT` / `INFORMATIVE`; no product requirement, technology approval or gate result |
| Repository process authority / instruction state | `NOT-APPLICABLE` / `NOT-APPLICABLE` |
| Owner / author | Product Decision Authority, named owner `UNKNOWN`; repository author attribution `UNKNOWN` |
| Reviewer / acceptance authority | Product Decision Authority; review `NOT-RUN`, acceptance `NOT-RUN` |
| Applicable baseline | `IDEA-C1-ANALYSIS-DESIGN-001`; Tech-context re-evaluation of `IE-KNW-TECH-DEC-001@0.1` and `TECH-001@0.9` |
| Evidence retrieval date | 2026-09-13 (Asia/Saigon) |
| Access classification / retention | `INTERNAL`; retain with the successor matrix/brief and change record as dated source evidence |
| Source / upstream trace | First-party sources cited per row; earlier [`IE-RES-TECH-20260913-001`](2026-09-13-technology-selection-evidence-synthesis.md) remains a distinct prior synthesis |
| Downstream trace | [`IE-KNW-TECH-DEC-001@0.2`](../product/knowledge/2026-09-13-core-v0-technology-decision-matrix.md), [`TECH-001@0.10`](../product/instances/idea-engineering/decision-briefs/TECH-001-technology-and-architecture-proposal.md) |
| Change record | [`IE-CHG-TECH-LINUX-001@0.1`](../product/instances/idea-engineering/registers/CHG-2026-09-13-linux-first-server-runtime-re-evaluation.md); new focused research ID, no predecessor version or predecessor SHA |
| Supersedes / Superseded by | `NOT-APPLICABLE` / `NOT-APPLICABLE`; this is a focused new check, not a rewrite of the earlier synthesis |
| Review trigger | Vendor lifecycle/package/support change, Q-14 evidence that contradicts the published path, or a material company platform constraint |
| Evidence / decision status | First-party publication facts recorded; IDEA operational qualification `NOT-RUN`; no stack selected by this research record |

## Scope and evidence classification

The project user supplied a new **Tech-context** input: prefer a Linux-first IDEA Server, give
existing Windows Server infrastructure zero selection weight, and permit a Server runtime different
from the Windows Desktop/Workspace. This is user context, not official vendor evidence, Product Scope
or an approval of Linux/Java. This record checks only current first-party support relevant to that
challenge. The controlled matrix makes the separate engineering recommendation.

Control tailoring: this focused research check uses the stable ID, dated source/evidence trace,
limitations, reviewer state, change link and retention controls from `IE-STD-AUTH-001@0.2`. It has no
independent product requirement, approval/effective date, predecessor version or verification result.

| Question | First-party publication fact | Limit: not an IDEA result |
|---|---|---|
| Ubuntu LTS lifecycles | Canonical lists 26.04 LTS standard security maintenance through May 2031 and 24.04 LTS through May 2029 ([Ubuntu release cycle](https://ubuntu.com/about/release-cycle)). | Exact host patch/hardening/company support policy `NOT-RUN`. |
| .NET alternative on Ubuntu 26.04 | Microsoft's Ubuntu guide includes Ubuntu 26.04 and .NET 10 in Ubuntu package-manager feeds ([Ubuntu .NET install](https://learn.microsoft.com/en-us/dotnet/core/install/linux-ubuntu-install)). | .NET was not eliminated for OS incompatibility; IDEA .NET build not run. |
| PostgreSQL on Ubuntu 26.04 | PostgreSQL's PGDG Ubuntu page lists `resolute (26.04, LTS)` as supported; its package pool contains `postgresql-18_18.6-1.pgdg26.04+2_amd64.deb` ([PGDG Ubuntu](https://www.postgresql.org/download/linux/ubuntu/), [PGDG PostgreSQL 18 package pool](https://apt.postgresql.org/pub/repos/apt/pool/main/p/postgresql-18/)). | Exact PostgreSQL repository pin, schema, driver, backup/restore `NOT-RUN`. |
| Named Java distribution | Eclipse Adoptium lists Java 25 LTS community availability to at least September 2031; its Linux guide names `temurin-25-jdk`, its `resolute` package index contains that package, and its API publishes a Linux x64 Temurin 25 binary ([support](https://adoptium.net/support/), [Linux install](https://adoptium.net/installation/linux/), [`resolute` Release](https://packages.adoptium.net/artifactory/deb/dists/resolute/Release), [`amd64` Packages](https://packages.adoptium.net/artifactory/deb/dists/resolute/main/binary-amd64/Packages), [Temurin API](https://api.adoptium.net/v3/assets/latest/25/hotspot?architecture=x64&image_type=jdk&os=linux&vendor=eclipse)). | Community updates are not a commercial support SLA; exact entitlement and patch drill `NOT-RUN`. |
| Spring on Java/Linux | Spring Boot 4.1.1 requires Java 17+, supports Java through 26, accepts Maven 3.6.3+, and documents executable JAR + systemd service operation ([requirements](https://docs.spring.io/spring-boot/system-requirements.html), [systemd](https://docs.spring.io/spring-boot/how-to/deployment/installing.html)). | Exact Boot/Temurin/systemd hardening and update/rollback `NOT-RUN`. |
| Java DB/migration dependencies | Boot 4.1.1 coordinates pgJDBC, Flyway core and PostgreSQL module; Flyway lists PostgreSQL 18 among verified versions ([Boot coordinates](https://docs.spring.io/spring-boot/appendix/dependency-versions/coordinates.html), [Flyway PostgreSQL](https://documentation.red-gate.com/fd/postgresql-database-277579325.html)). | Exact version graph, SQL migrations, licensing and rollback/restore `NOT-RUN`. |
| Backup, reverse proxy and telemetry primitives | PostgreSQL 18 documents base backup/WAL/PITR; Ubuntu publishes an Nginx `resolute` package; Boot documents Actuator/Micrometer/OpenTelemetry support ([base backup](https://www.postgresql.org/docs/18/app-pgbasebackup.html), [PITR](https://www.postgresql.org/docs/18/continuous-archiving.html), [Nginx](https://packages.ubuntu.com/resolute/nginx), [observability](https://docs.spring.io/spring-boot/reference/actuator/observability.html)). | Coordinated DB/Artifact/config/key recovery, cert handling, exporter/backend, redaction and incident runbook `NOT-RUN`. |

The research supports distinguishing **published platform/component support** from **whole-stack
operational qualification**. It does not claim that IDEA has installed, benchmarked, secured,
restored or passed Q-01…Q-14. No Product Scope Change; no FTR/REQ, DOC-04/05/06/08, DDM capability,
ADR or PG state is changed by this record.
