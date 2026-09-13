# IDEA Engineering Core v0 Technology Decision Matrix

| Control field | Value |
|---|---|
| Stable knowledge ID | `IE-KNW-TECH-DEC-001` |
| Document class | `IE-KNW` controlled engineering decision artifact |
| Title | IDEA Engineering Core v0 Technology Decision Matrix |
| Version | `0.2` |
| Status | `Draft` |
| Artifact role | `INFORMATIVE ENGINEERING RECOMMENDATION`; decision input for `TECH-001`, not a Core Product Document |
| Product normativity | `INFORMATIVE` — this artifact creates no product requirement and does not approve a product, architecture or technology |
| Repository process authority | `NOT-APPLICABLE` |
| Repository instruction state | `NOT-APPLICABLE` |
| Owner | Product Decision Authority; named owner `UNKNOWN` |
| Author | Principal Product Author; accountable attribution before `Proposed` is `BLOCKED` |
| Reviewer | Product Decision Authority; review `NOT-RUN` |
| Acceptance authority | Product Decision Authority; acceptance `NOT-RUN` |
| Evidence / decision date | `2026-09-13` (Asia/Saigon) |
| Applicable product baseline | `IDEA-C1-ANALYSIS-DESIGN-001`; DOC-01@0.6, DOC-02@0.2, DOC-03@0.7, DOC-04@0.13, DOC-05@0.17 (candidate Tech rows only), DOC-06@0.16, DOC-07@0.7, DOC-08@0.12, GOV@0.3, VVP@0.16, accepted ADRs |
| Source / upstream trace | [`IE-RES-TECH-20260913-001`](../../research/2026-09-13-technology-selection-evidence-synthesis.md); fresh [`IE-RES-TECH-LINUX-20260913-001`](../../research/2026-09-13-linux-first-server-platform-support-check.md); dated Java/.NET and deployment notes; first-party support sources in section 2B; project-user Tech context recorded by [`IE-CHG-TECH-LINUX-001@0.1`](../instances/idea-engineering/registers/CHG-2026-09-13-linux-first-server-runtime-re-evaluation.md); [`CONTEXT.md`](../../../CONTEXT.md); [`DOC-04`](../instances/idea-engineering/DOC-04-software-requirements-specification.md); [`DOC-05`](../instances/idea-engineering/DOC-05-architecture-description.md); [`DOC-06`](../instances/idea-engineering/DOC-06-data-integration-and-migration-specification.md); [`DOC-08`](../instances/idea-engineering/DOC-08-ui-ux-and-interaction-specification.md); accepted ADRs; [`IE-STD-AUTH-001@0.2`](../../agents/product-document-authoring-standard.md); [`standards register`](../../governance/standards-register.md) |
| Downstream trace | [`TECH-001@0.10`](../instances/idea-engineering/decision-briefs/TECH-001-technology-and-architecture-proposal.md); instance catalogue; version history; [`IE-CHG-TECH-LINUX-001`](../instances/idea-engineering/registers/CHG-2026-09-13-linux-first-server-runtime-re-evaluation.md); future qualification records |
| Change record | [`IE-CHG-TECH-LINUX-001@0.1`](../instances/idea-engineering/registers/CHG-2026-09-13-linux-first-server-runtime-re-evaluation.md); predecessor `IE-KNW-TECH-DEC-001@0.1`, SHA-256 `A8BB495522E012AB3E71A23441BA6B3F97E82640A71AF3A4727FEE8353640C34` |
| Supersedes / Superseded by | Supersedes `IE-KNW-TECH-DEC-001@0.1`; superseded by `NOT-APPLICABLE` |
| Review trigger | Product Decision Authority changes the stack; a selected component fails qualification; a support/licensing change; a material DOC-04/05/06/08 or ADR change; or a new company platform constraint |
| Retention disposition | Retain as controlled engineering decision provenance; supersede only through an explicit change record |
| Decision state | Engineering Recommendation: `COMPLETE`; Product Decision Authority Approval: `NOT-RUN`; PG3/PG4: `NOT-RUN` |
| Evidence status | `INFORMATIVE RESEARCH INPUT + ENGINEERING RECOMMENDATION`; qualification evidence is `NOT-RUN` |
| Product-scope effect | **No Product Scope Change.** No FTR, REQ, DOC-01…DOC-08 meaning, DDM capability semantics, ADR decision or gate state is changed. |

## 1. Purpose, authority and decision rule

This matrix consumes the controlled technology evidence and the current IDEA product/architecture
baseline to make one coherent Core v0 engineering recommendation. It is a decision view, not a new
requirements or architecture authority. `DOC-04` remains the normative SRS and `DOC-05` remains the
normative architecture description. `TECH-001` is the Vietnamese management-facing view of this
matrix.

The authority chain is deliberately visible:

```text
Primary/official evidence + Linux-first Tech context
        ↓
IE-RES-TECH-20260913-001 (informative synthesis)
        ↓
IE-KNW-TECH-DEC-001 (engineering recommendation)
        ↓
TECH-001 (management decision view)
        ↓
Product Decision Authority approval (NOT-RUN)
```

The recommendation optimizes for correctness, maintainability, a Linux-first headless Server,
Windows engineering integration, transaction integrity, recovery, security, modular boundaries and
a small operating team. It does not optimize for theoretical maximum scale. Approximately 50–100
intended users is context, not a concurrency or capacity guarantee. Multi-GB Artifacts remain outside
the relational database.

The project user supplied a new Tech-context input on 2026-09-13: prefer a Linux-first Server and give
the existence of current Windows Server infrastructure **zero selection weight**. This is neither a
Linux/Java approval nor Product Scope. Decision A (Server OS), Decision B (Server runtime/framework)
and Decision C (Windows Desktop/Workspace runtime) are therefore evaluated independently. Sharing
C#/.NET across B and C is a maintainability advantage only; it is not a Server architecture
requirement because Linux Server and Windows client already have separate deployment, patching,
supervision, diagnostics, installer and failure domains.

Each matrix disposition uses the controlled vocabulary below:

| Disposition | Meaning in this artifact |
|---|---|
| `SELECT` | Engineering recommends this Core v0 baseline, subject to named qualification where shown. |
| `ALTERNATIVE` | Credible runner-up; not the Core v0 baseline. It may replace the selection only after the stated trigger and review. |
| `DEFER` | Preserve as a future option; no Core v0 adoption is justified by current evidence. |
| `REJECT FOR CORE V0` | Explicitly outside the current Core v0 envelope; this is not a claim that the technology is generally bad. |
| `QUALIFICATION REQUIRED` | A concrete execution/configuration/licensing test is needed before the recommendation can be used operationally. It is not a test result or approval. |

No numeric score is used. A candidate that fails a mandatory correctness, security, custody or
recovery condition is removed until corrected. Cost, performance and maintainability measurements
rank surviving candidates; they do not turn an unrun experiment into a pass.

### Standards tailoring

The matrix is `STANDARD-GUIDED`, not a conformity or certification claim. `STD-INFO-001`
(ISO/IEC/IEEE 15289:2019) supplies controlled-item traceability; `STD-ARC-001`
(ISO/IEC/IEEE 42010:2022) supplies decision/viewpoint vocabulary; `STD-QUAL-001/002`
(ISO/IEC 25010:2023 and ISO/IEC 25030:2019) guide measurable qualification; `STD-TEST-001…004`
(ISO/IEC/IEEE 29119 family) guide retained test evidence; and `STD-CM-001` (ISO 10007:2017)
guides version/change/rollback control. These standards do not prescribe .NET, Java, PostgreSQL,
WPF or any other selected technology.

# Recommended IDEA Engineering Core v0 Technology Stack

The following is the single recommended baseline. “Selected” means Engineering recommends it; it
does not mean the Product Decision Authority has approved it.

| Layer | Classification | Selected technology | Core v0 boundary and qualification |
|---|---|---|---|
| Server language/runtime | `SELECT` | Java 25 LTS / Eclipse Temurin 25 | Named Linux runtime distribution with community availability listed to at least September 2031; the Adoptium `resolute` feed publishes `temurin-25-jdk`. Use a supported current Java 25 patch; commercial SLA/support remains a separate Q-13 decision. |
| Server framework | `SELECT` | Spring Boot 4.1.x + Spring Modulith 2.1.x | Boot 4.1.1 officially supports Java through 26. Modulith verifies module cycles, API-only access and declared dependencies; IDEA ownership still comes from the architecture, not framework defaults. |
| Server build/dependency authority | `SELECT` | Maven Wrapper + Spring Boot dependency management/BOM | Pin Maven through `mvnw`, the Boot 4.1.x line and the resolved dependency graph; produce repeatable build, checksums, license inventory and SBOM. Exact patches and commercial-support entitlement remain Q-13/Q-14 `NOT-RUN`. |
| Architecture style | `SELECT` | Deep-module modular monolith | One deployable Server with explicit owner Modules and narrow Interfaces; no generic CRUD authority and no service-per-module requirement. Extraction remains a measured future option. |
| Database | `SELECT` | PostgreSQL 18 (major line) | Metadata, authorization, workflow, structure, Audit, search projection and outbox. Use the supported minor current at qualification (18.6 was the evidence-date minor); Q-02, Q-07 and Q-14 are `NOT-RUN`. |
| Persistence | `SELECT` | Spring JDBC/`JdbcClient` + Boot-managed pgJDBC | SQL-first, module-owned mappings and queries make transaction/query ownership explicit. One Spring-managed relational transaction/UoW spans the named cross-module operation where required. JPA/Hibernate, Spring Data JDBC and jOOQ are not parallel defaults. |
| Schema migration | `SELECT` | Boot-managed Flyway + versioned reviewed SQL; expand–migrate–contract | `flyway-core` plus `flyway-database-postgresql` is the sole schema authority and PostgreSQL 18 is a Flyway verified version. Migration runs as an explicit release/preflight operation; destructive down migration is not assumed. |
| Account/authentication | `SELECT` | Spring Security 7.1.x + Spring Session JDBC for maintained credential/session primitives; custom stable Actor/Account/Login Identity records | Web uses secure HttpOnly, SameSite cookies plus CSRF protection. Spring roles/authorities never become IDEA Access Policy. Server/IAM establishes `ActorContext`; Desktop bootstrap, refresh, revocation and DPAPI storage are Q-06/Q-08 `NOT-RUN`. |
| Authorization | `SELECT` | IDEA Access Policy module | Product authority evaluates server-established ActorContext, IAM eligibility, Project/Group membership, Role Assignments, Role Definition versions and scope hierarchy; owner business gates and commit-time revalidation follow. Framework roles/claims are not the product RBAC model. |
| API | `SELECT` | Versioned HTTPS JSON REST with OpenAPI 3.1 contract | Server remains authoritative. Stable Resource/Operation IDs, explicit expected-state fields and idempotency keys are required at the contract level; no direct database access from clients. Tooling compatibility remains Q-01/Q-14 `NOT-RUN`. |
| Integration publication | `SELECT` | Transactional outbox in PostgreSQL + bounded Spring dispatcher + per-system Spring Integration Adapter | Audit evidence/outbox and authoritative owner outcome commit in the declared relational UoW. Consumers are idempotent and tolerate duplicate/reordered delivery. No broker is mandatory initially. |
| Web frontend | `SELECT` | React 19.3 client-side application | React major line is selected; patch is pinned in lockfile. Web is a CSR workbench served by IDEA Server; no SSR/RSC requirement is introduced. Accessibility, localization and security-surface tests remain `NOT-RUN`. |
| Web language/compiler | `SELECT` | TypeScript 7.0 CLI/type-checking baseline | TypeScript 7 is the source compiler line, with exact patch pinned at qualification. A TypeScript 6 compatibility lane is `QUALIFICATION REQUIRED` only for plugins/tools that consume the not-yet-stable programmatic compiler API; it is not a second production compiler. |
| Web build tool | `SELECT` | Vite 8.3 line | Static, reproducible build; Node build runtime is Node.js 22 LTS with the Vite minimum (`22.12+`) and a current supported patch. Use `npm ci` and committed `package-lock.json`; no server-side Node runtime is required in production. |
| Web routing | `SELECT` | React Router 7 data APIs in declarative/data mode | Route loaders/actions and error boundaries stay client-side; API remains independently authoritative. SSR, RSC and a full-stack Node framework are `DEFER` unless a later product decision creates a concrete need. Exact router/plugin compatibility is Q-01/Q-13 `NOT-RUN`. |
| Search | `SELECT` | Rebuildable relational Discovery Projection in PostgreSQL 18 | Exact ID/business-number lookup, title/metadata predicates, deterministic sort, paging and permission predicates use owner-controlled indexes/projections. ICU/`pg_trgm`/text-search choices and Japanese tokenization are Q-03 `NOT-RUN`; no promise of Japanese behavior yet. |
| Desktop shell | `SELECT` | Installed WPF `net10.0-windows` shell hosting the React workbench through WebView2 | Preserves the current Web/Desktop/Web-rendered Desktop surface while keeping native responsibilities narrow. WPF wins over WinUI 3 for the first bake because its mature Windows integration and longer-stable framework boundary reduce client lifecycle risk; Q-10 remains `NOT-RUN`. |
| Embedded renderer | `SELECT` | WebView2 Evergreen | Prefer centrally serviced security updates on company-managed Windows PCs. Fixed Version is the fallback only if offline/IT policy forbids Evergreen; it transfers renderer patch ownership to IDEA and is Q-10/Q-11 `NOT-RUN`. |
| Workspace runtime | `SELECT` | Separate per-user `.NET 10` executable | Owns local materialization/custody, hashing, resumable transfer, journal, external CAD/Office launch and recovery state; it never owns Product Definition state. It is not a machine-wide privileged service. |
| Workspace IPC | `SELECT` | Current-user-restricted named pipes with authenticated, versioned, scope-bound messages | OS ACLs plus application authentication, replay/size/version checks and safe reconnect. No generic filesystem/shell/host-object command. Cross-user/cross-Workspace evidence is Q-08 `NOT-RUN`. |
| Artifact store | `SELECT` | Provider-neutral private server-managed filesystem-backed adapter on a protected volume | Content-addressed immutable byte organization; IDEA Server is the only normal access path. Database stores metadata, IDs, digests and references; it does not store Artifact bytes. Direct SMB/user paths are outside the contract. |
| Format Worker | `SELECT` | Separate Windows worker boundary/process with exact CAD/Office/Format Adapter profile | Worker creates a candidate; Format Intelligence/Product Structure owner validates and associates it with the exact source Generation. Manual representation upload remains a first-class fallback. IRONCAD automation, license and version are Q-09 `NOT-RUN`. |
| Server OS | `SELECT — platform direction` | Ubuntu Server 26.04 LTS | Canonical maintenance, Temurin 25 packages, PostgreSQL PGDG and Nginx package availability are officially established. Exact IDEA hardening, certificates, update, monitoring, backup/restore and company-policy build remain Q-14 `NOT-RUN`; Ubuntu 24.04 is a compatibility alternative, not the default. |
| Deployment packaging | `SELECT` | Signed/versioned Spring Boot executable-JAR application bundle + systemd; host-managed Temurin 25; configuration/secrets outside bundle | The Boot plugin and systemd support this smaller delivery authority. Release preflight, Flyway step, checksum/signature/SBOM, health check and recoverable rollback are required. A custom `.deb`, self-contained `jlink` image and container are not initial requirements. |
| Reverse proxy / TLS posture | `SELECT` | Company-approved Nginx baseline in front of HTTPS Server; managed certificate and modern TLS policy | No claim that Nginx itself supplies identity or authorization. Certificate custody, headers, origin policy and renewal runbook are Q-06/Q-11/Q-14 `NOT-RUN`. |
| Background processing | `SELECT` | Bounded Spring task execution/scheduling for outbox/maintenance; Spring Batch for restartable import/export; Format Worker separate | Jobs have Operation IDs, leases/retry limits and idempotent handlers. Spring Integration supplies per-system adapters. Kafka/RabbitMQ/Redis are not required initially. |
| Observability | `SELECT` | Spring Boot Actuator + Micrometer Observation + OpenTelemetry/OTLP + structured JSON logs; JFR/`jcmd` for JVM diagnostics | Audit Evidence remains a separate authoritative record. Export backend/retention is replaceable and company-selected; cardinality, redaction, JVM diagnostic capture and incident runbook are Q-12 `NOT-RUN`. |
| Backup/recovery posture | `SELECT` (qualification-gated) | PostgreSQL base backup + WAL/PITR, coordinated Artifact/config/policy/key backup, off-primary controlled target | Restore must produce a mutually usable DB + Artifact + configuration/key point. One VM is not HA. RTO ≤4 working hours and RPO ≤1 hour remain preliminary objectives and Q-07 `NOT-RUN`. |

## 2A. Decision register: why each selected layer is conditional but concrete

The stack table is the compact view. This register makes the decision, evidence class, trade-off,
remaining qualification and reconsideration trigger explicit for every selected layer. A trigger is
not an expectation that the selection will change; it is the controlled point at which Engineering
would reopen it.

| Selected layer | Decision and evidence | Main trade-off | Qualification still required | Reconsideration trigger |
|---|---|---|---|---|
| Server language/runtime | Select Java 25 LTS / Eclipse Temurin 25; fresh official lifecycle, Linux artifact and Ubuntu 26.04 package-feed evidence plus Linux-first `IDEA-INFERENCE` | Adds a second runtime family beside the Windows client; community updates have no Eclipse SLA | Q-01, Q-12, Q-13/Q-14 patch/SBOM/support runbook | Exact Temurin/Boot build fails mandatory qualification or Q-13 proves materially unsustainable cross-runtime cost |
| Server framework | Select Spring Boot 4.1.x + Spring Modulith 2.1.x; official compatibility and module-verification facts | Boot minor lifecycle is separate from the longer JDK line; framework does not create IDEA ownership | Architecture tests, Q-01 and diagnostics run | Upgrade/support cadence or mandatory Server behavior cannot be met on the supported Boot line |
| Server build/dependency authority | Select Maven Wrapper + Boot BOM; official Maven/Boot build and dependency-management facts | Maven/JVM/Spring adds a toolchain beside .NET/NuGet on Windows | Q-13 reproducible build, dependency inventory, SBOM and patch drill | Required dependency cannot remain supported/reproducible or company policy mandates another controlled build path |
| Architecture style | Select deep-module modular monolith; accepted ADRs + `OFFICIAL-GUIDANCE-PATTERN` + `IDEA-INFERENCE` | One process is a shared failure domain and needs disciplined boundaries | Boundary checks in Q-01/Q-13 and restore/incident evidence | Measured independent scale/isolation or independently staffed Module justifies extraction |
| Database | Select PostgreSQL 18; `OFFICIAL-PRODUCT-FACT`/lifecycle/license plus `IDEA-INFERENCE` | Company must own PostgreSQL operations, collation and backup expertise | Q-02, Q-03, Q-07, Q-14 and production edition/support disposition | SQL Server estate has documented material DBA/license/restore advantage |
| Persistence | Select Spring JDBC/`JdbcClient` + pgJDBC; synthesis §7 and official Spring/pgJDBC facts plus explicit-query `IDEA-INFERENCE` | More hand-written mapping/SQL than an ORM and therefore stronger review/test discipline | Exact driver, lock/stream/bulk/outbox and mapping tests Q-01/Q-02/Q-04/Q-05 | Mapping burden or correctness evidence shows a bounded JPA/Data JDBC addition is materially safer |
| Schema migration | Select Boot-managed Flyway/versioned SQL; official Boot coordinates and Flyway PostgreSQL 18 verification | Application rollback does not undo a destructive schema change; Flyway adds its own release/license clock | Expand/contract rehearsal, license inventory, backup/restore and migration review | Tool/support/license cannot produce safe repeatable upgrades on the selected matrix |
| Account/authentication | Select Spring Security + Spring Session JDBC plus custom Actor/Account/Login Identity; official Spring security/session facts + DOC-05/06 boundary | Native account/session and future company login need two evolution paths | Q-06, Q-08, Q-11, secure storage and revocation | Company identity mandate or native-session threat result makes the path unacceptable |
| Authorization | Select IDEA Access Policy; accepted architecture/data contracts + `IDEA-INFERENCE` | Product policy engine remains custom and must not be replaced by framework roles | Q-01/Q-06/Q-11 authorization/refusal evidence | A later approved policy authority changes the ownership contract |
| API | Select versioned HTTPS JSON REST/OpenAPI 3.1; `INDUSTRY-SPECIFICATION` + architecture fit | HTTP versioning and large-transfer controls require explicit design | Q-01/Q-04 contract, streaming and TLS tests | Named integration needs a materially different protocol with approved contract |
| Integration publication | Select transactional outbox + bounded Spring dispatcher/Integration Adapters; official Spring Integration facts + architecture inference | In-process delivery has finite throughput and retry ownership | Q-05 and consumer contract tests | Measured delivery volume/isolation or company platform requires a broker |
| Web frontend | Select React 19.3 CSR; `OFFICIAL-PRODUCT-FACT` + DOC-08 fit | SPA owns client state/cache complexity and has no SSR fallback | Q-01/Q-10 accessibility, security and bundle tests | An approved product need for SEO/SSR or measured client limits appears |
| Web compiler | Select TypeScript 7 CLI; official release fact | TS7 programmatic API compatibility is not yet universal | Plugin/compiler API inventory and Q-13 | Critical maintained plugin cannot support TS7 and TS6 lane cannot isolate it |
| Web build tool | Select Vite 8.3 + Node 22 LTS build; official release/compatibility facts | Vite has no .NET-like LTS and plugin churn is an owner burden | Q-13 reproducible build, lockfile/SBOM and patch drill | Build/release policy or plugin compatibility cannot be maintained |
| Web routing | Select React Router 7 data APIs; `IDEA-INFERENCE` bounded by independent Server authority | Router/data-loader conventions become a client-side dependency | Q-01/Q-13 route/error/accessibility tests | Routing complexity materially exceeds the client-only model or product requires SSR |
| Search | Select rebuildable PostgreSQL Discovery Projection; architecture + synthesis search evidence | Relational text/Japanese behavior may not meet future ranking/linguistic needs | Q-03 corpus, plans, p95/p99 and rebuild | Explicit latency/recall/index/rebuild trigger or independent workload is measured |
| Desktop shell | Select WPF net10 + WebView2; DOC-08 surface + Windows guidance + `IDEA-INFERENCE` | Older Windows-only shell and privileged Web/native boundary need patch discipline | Q-10/Q-11 install, accessibility, navigation/message and rollback | WPF policy/UX/security fails, or WinUI/browser challenger materially passes |
| Embedded renderer | Select WebView2 Evergreen; official Microsoft guidance | IT/offline policy may force IDEA-owned Fixed runtime patching | Q-10/Q-11 runtime presence, origin and host-object tests | Evergreen is prohibited or unavailable on the supported fleet |
| Workspace runtime | Select separate per-user .NET 10; official Windows primitive evidence + DOC-05 contract | Windows-specific runtime reduces cross-platform portability | Q-04/Q-08/Q-09 transfer, IPC and CAD/Office evidence | Workspace requirements expand to a platform where .NET path is materially untenable |
| Workspace IPC | Select current-user named pipes with app authentication; .NET platform fact + security inference | Same-user hostile clients and replay remain application responsibilities | Q-08/Q-11 cross-user, scope, replay and reconnect tests | Named-pipe threat/packaging constraints cannot meet the security contract |
| Artifact store | Select private filesystem-backed adapter; DOC-05/06 + recovery guidance | One storage volume creates capacity/failure-domain and migration work | Q-04/Q-07 custody, digest, orphan and restore tests | Multiple nodes, storage policy or measured volume need justifies object storage |
| Format Worker | Select isolated Windows worker + exact Adapter; PLM worker practice + DOC-05/06 | CAD/Office license/version matrix and worker operations are costly | Q-09 exact app/license/output/provenance tests | A named licensed converter/platform supplies a safer verified path |
| Server OS | Select Ubuntu 26.04 LTS as platform direction; official Canonical/Adoptium/PGDG/Ubuntu-package facts + user context + `IDEA-INFERENCE` | Exact operational build and support ownership are still unproved | Q-14 hardening, patch, backup/restore, monitoring and policy build; 24.04 compatibility path | A selected dependency loses support, IT governance requires another OS, or Linux qualification fails |
| Deployment packaging | Select signed/versioned executable-JAR bundle + systemd with host-managed Temurin; official Boot packaging/systemd facts + `IDEA-INFERENCE` | Application bundle and host JDK have coordinated but distinct rollback/patch steps | Q-14 install, patch, migration, signature/SBOM and rollback rehearsal | IT mandates a managed `.deb`/container or the bundle cannot meet provenance/rollback policy |
| Reverse proxy/TLS | Select company-approved Nginx baseline; `IDEA-INFERENCE` deployment boundary | Certificate/header/origin operations remain company work | Q-06/Q-11/Q-14 TLS and renewal tests | Company standard proxy or managed gateway is demonstrably safer/easier |
| Background processing | Select bounded Spring task execution/scheduling plus Spring Batch where restartability is required; official Spring facts + architecture inference | In-process jobs share Server failure/restart; Batch metadata and retry policy require ownership | Q-05/Q-12 crash, retry, lease, restart and lag tests | Workload needs independent scheduling/isolation or a supported broker/platform |
| Observability | Select Actuator/Micrometer + OpenTelemetry/OTLP + structured logs + JFR/`jcmd`; official ecosystem facts | Protocol/tools do not choose backend, retention or on-call ownership | Q-12 cardinality, redaction, correlation, JVM capture and incident drill | Company observability standard or diagnosis threshold cannot be met |
| Backup/recovery | Select PostgreSQL base/WAL/PITR plus coordinated off-primary copies; official PostgreSQL/NIST guidance + architecture inference | Backup of DB alone cannot restore external Artifact bytes or keys | Q-07 measured restore and integrity/RTO/RPO | Company recovery policy or measured objective requires separate HA/storage topology |

## 2B. Fresh Linux-first platform support check

The following facts were retrieved again from first-party sources on 2026-09-13. They establish
published platform/component support or availability; they are not an IDEA installation, security,
backup or restore result.

| Support question | First-party fact established | Decision consequence | IDEA qualification state |
|---|---|---|---|
| Ubuntu lifecycle | Canonical lists Ubuntu 26.04 LTS standard security maintenance through May 2031 and Ubuntu 24.04 LTS through May 2029 ([Ubuntu release cycle](https://ubuntu.com/about/release-cycle)). | 26.04 has the longer current LTS runway and is the Linux platform direction. | Exact patch source, hardening and company ownership `NOT-RUN` in Q-14. |
| .NET alternative on 26.04 | Microsoft's Ubuntu install guide has an Ubuntu 26.04 section and lists .NET 10 in the Ubuntu package-manager feeds ([Microsoft guide](https://learn.microsoft.com/en-us/dotnet/core/install/linux-ubuntu-install)). | The previous .NET finalist is not rejected for lack of Ubuntu 26.04 support. | IDEA .NET deployment qualification was not run. |
| PostgreSQL 18 on 26.04 | PGDG lists `resolute (26.04, LTS)` among supported Ubuntu versions, and its package pool contains `postgresql-18_18.6-1.pgdg26.04+2_amd64.deb` ([PGDG Ubuntu](https://www.postgresql.org/download/linux/ubuntu/), [PGDG PostgreSQL 18 package pool](https://apt.postgresql.org/pub/repos/apt/pool/main/p/postgresql-18/)). | A PostgreSQL 18 package build for 26.04 is published; PostgreSQL 18 remains selected. | Repository provenance, pinning, upgrade and restore `NOT-RUN` in Q-07/Q-14. |
| Named Java distribution on 26.04 | Adoptium lists Java 25 as LTS with community availability to at least September 2031, publishes Linux x64 Temurin 25 artifacts and DEB installation, and its `resolute` repository contains `temurin-25-jdk` ([support](https://adoptium.net/support/), [Linux install](https://adoptium.net/installation/linux/), [`resolute` Release](https://packages.adoptium.net/artifactory/deb/dists/resolute/Release), [`amd64` Packages](https://packages.adoptium.net/artifactory/deb/dists/resolute/main/binary-amd64/Packages)). | Eclipse Temurin 25 is the named selected JDK distribution and an official Ubuntu 26.04 package path exists. | Eclipse community updates carry no SLA; exact support owner, package pin and patch drill `NOT-RUN`. |
| Spring/Java compatibility and service operation | Spring Boot 4.1.1 requires Java 17+, supports through Java 26, and its deployment guide documents executable JARs as `systemd` services ([requirements](https://docs.spring.io/spring-boot/system-requirements.html), [systemd deployment](https://docs.spring.io/spring-boot/how-to/deployment/installing.html)). | Java 25 is within Boot's stated range and native systemd operation is documented. | Exact Boot BOM/JDK/JDBC/Flyway graph and service hardening `NOT-RUN`. |
| Database driver/migration chain | Boot 4.1.1 dependency management lists pgJDBC `42.7.13`, Flyway `12.4.0` and the PostgreSQL database module; Flyway lists PostgreSQL 18 as verified ([Boot coordinates](https://docs.spring.io/spring-boot/appendix/dependency-versions/coordinates.html), [Flyway PostgreSQL](https://documentation.red-gate.com/fd/postgresql-database-277579325.html)). | A coherent managed Java/PostgreSQL dependency chain is published; exact patches remain build inputs, not Product requirements. | Migration rehearsal, licensing inventory and schema rollback/restore `NOT-RUN`. |
| Backup and monitoring dependencies | PostgreSQL 18 documents `pg_basebackup`, WAL archiving and PITR; Spring Boot documents Actuator/Micrometer metrics and OpenTelemetry support; Ubuntu 26.04 publishes Nginx ([base backup](https://www.postgresql.org/docs/18/app-pgbasebackup.html), [PITR](https://www.postgresql.org/docs/18/continuous-archiving.html), [Boot observability](https://docs.spring.io/spring-boot/reference/actuator/observability.html), [Nginx package](https://packages.ubuntu.com/resolute/nginx)). | Required primitives are available on the selected direction; no vendor backend or recovery result is inferred. | Coordinated DB/Artifact/config/key restore, telemetry backend, certificates and runbook remain Q-07/Q-12/Q-14 `NOT-RUN`. |

Therefore Ubuntu 26.04 is no longer described as having unknown base Java/PostgreSQL compatibility.
It is `SELECT — platform direction`; the complete operational build remains `QUALIFICATION REQUIRED`
and Q-14 remains `NOT-RUN`.

## 3. Server runtime decision — Java is the Core v0 recommendation

### 3.1 Final disposition

| Candidate | Classification | Disposition |
|---|---|---|
| `Java 25 LTS + Eclipse Temurin 25 + Spring Boot 4.1.x` | `SELECT` | Recommended Linux-first Core v0 Server baseline. |
| `.NET 10 LTS + ASP.NET Core 10 + C#` | `ALTERNATIVE` | Credible runner-up with simpler cross-system language/tooling consolidation; reconsider only on the explicit triggers in section 3.3. |

Both candidates are technically credible on Ubuntu 26.04. The evidence does not establish a universal
throughput, scalability or “enterprise-grade” winner, so relative performance remains `UNKNOWN` until
the same IDEA workload is executed. After existing Windows infrastructure receives zero weight and
runtime-family consolidation is treated as one maintainability factor, Java wins the Server-specific
decision for four concrete reasons:

1. Spring Modulith directly verifies module cycles, API-only access and allowed dependencies and
   supports module-scoped tests. That is unusually well aligned with IDEA's deep-module modular
   monolith and reduces reliance on locally assembled boundary conventions.
2. Spring Integration and Spring Batch provide a broader maintained vocabulary for future
   ERP/MES/BI adapters and restartable import/export work. They do not create scope, but they reduce
   custom infrastructure if an approved contract later needs those patterns.
3. Java 25 has a longer evidenced runtime runway and multiple distribution/support channels. The
   selected Eclipse Temurin 25 path is published for Ubuntu 26.04; commercial SLA choice remains open.
4. A JDBC-first persistence path keeps SQL, locks, transaction ownership, outbox and projection
   behavior explicit, while Boot's BOM gives one managed dependency graph for the Server.

.NET retains real advantages: ASP.NET Core/Kestrel, async I/O, Worker Services, EF/Npgsql,
OpenTelemetry/EventPipe tooling and C# reuse with the Windows Workspace are all credible. It also
reduces language count and initial onboarding/build-tool breadth. Those benefits lose because they
do not outweigh Java's direct modularity and integration/batch advantages under a Linux-first Server
decision; they are not evidence that .NET is a weaker or less scalable platform.

Two runtime families are an accepted, explicit cost. The Linux Server and Windows client already have
different OS packages, supervisors, security boundaries, diagnostics and release cadences. Their
coupling is controlled by versioned HTTPS/JSON/OpenAPI contracts, stable Resource/Operation IDs,
expected state, idempotency and Server authority—not by shared in-process assemblies. WPF/WebView2 and
the per-user .NET Workspace can therefore evolve behind that contract without making Java aware of
named pipes, DPAPI, CAD/Office launch or local custody. Separate Maven/JVM/Spring and
.NET/NuGet/WPF/WebView2 SBOMs, patch calendars and runbooks are required; Q-13 must measure that burden
and may reopen the decision.

### 3.2 Criterion-level comparison

| IDEA criterion | .NET candidate | Java candidate | Engineering reading |
|---|---|---|---|
| Ubuntu/Linux first-class operation | Microsoft publishes .NET 10 for Ubuntu 26.04 and Linux service/container paths | Temurin publishes Java 25 Linux artifacts and a `resolute` DEB feed; Boot documents systemd | `DRAW`; both have official paths, exact IDEA build Q-14 `NOT-RUN`. |
| Modular-monolith boundary enforcement | Projects/assemblies, analyzers and architecture tests must be selected and composed | Spring Modulith verifies cycles, API-only access and allowed dependencies and supports module tests | Java `ADVANTAGE` directly aligned to the selected architecture. |
| Transaction model | `TransactionScope`/EF/Npgsql can implement explicit relational UoW | Spring transaction management + JDBC can implement explicit relational UoW | `DRAW`; owner/UoW rules and Q-01/Q-02/Q-05 decide correctness. |
| PostgreSQL integration | Npgsql/EF provider and raw Npgsql are mature candidates | pgJDBC, Spring JDBC and Boot-managed pool/dependencies are mature candidates | `DRAW`; exact driver/build tests remain `NOT-RUN`. |
| SQL/query control | EF default needs explicit raw-Npgsql escapes and query-discipline checks | Selected JDBC-first path exposes owner SQL directly | Java `ADVANTAGE` for the selected explicit-query policy; not a performance claim. |
| Background work | Worker Services, hosted services and bounded channels | Boot task execution/scheduling plus Spring Batch/Integration | Java `ADVANTAGE` in maintained breadth; both require leases/idempotency. |
| Enterprise adapters | Named custom adapters plus broad .NET libraries | Spring Integration implements EIP adapters/gateways | Java `ADVANTAGE` for future heterogeneous integration; no new product integration is created. |
| Batch/import/export | Custom Worker/queue patterns and third-party options | Spring Batch supplies restart/skip/retry/chunk/partition primitives | Java `ADVANTAGE` for restartable governed import/export work. |
| Observability | OpenTelemetry, metrics, EventPipe and `dotnet-monitor` | Actuator, Micrometer/OpenTelemetry, JFR and `jcmd` | `DRAW`; Q-12 runbook/redaction/time-to-diagnose remains `NOT-RUN`. |
| Security/account primitives | ASP.NET Core Identity and cookie/session controls | Spring Security and Spring Session JDBC | `DRAW`; IDEA Actor/Account/Access Policy remains custom either way. |
| Streaming multi-GB transfers | Async streams and bounded buffers | Java streams/channels and bounded buffers | `DRAW`; memory, cancellation, resume and integrity require Q-04. |
| Runtime lifecycle | .NET 10 LTS has a single Microsoft line through 2028-11-14 | Temurin 25 lists community availability to at least September 2031 and Java has multiple support channels | Java `ADVANTAGE` on runtime runway/optionality; entitlement still open. |
| Framework lifecycle | .NET/ASP.NET Core follow a simple coordinated Microsoft lifecycle | Boot minor support clock is separate from JDK and dependencies | .NET `ADVANTAGE` for lifecycle simplicity; Java must maintain an upgrade calendar. |
| Patch burden | One Microsoft Server/client family reduces language/tool familiarity | JDK, Boot and Maven graph add feeds beside the .NET Windows path | .NET `ADVANTAGE`; magnitude is `UNKNOWN` until Q-13. |
| SBOM/dependency management | NuGet lock/central package and .NET tooling | Maven Wrapper + Boot BOM and dependency graph | `DRAW`; reproducibility/license/CVE evidence is Q-13/Q-14. |
| systemd/native deployment | .NET supports Linux/systemd deployment | Boot documents executable JAR + systemd deployment | `DRAW`; both are native-service capable. |
| Container optionality | Official .NET container images | Boot buildpacks/Dockerfiles and JDK images | `DRAW`; containers remain optional and Kubernetes is outside Core v0. |
| Operational diagnosis | `dotnet-monitor`, EventPipe, dumps and counters | Actuator, JFR, `jcmd`, dumps and JVM tools | `DRAW`; real incident diagnosis must be measured. |
| Future service extraction | Modules/endpoints/workers can be separated after a measured trigger | Modulith modules/endpoints/workers can be separated after a measured trigger | `DRAW`; ownership/contracts, not language, govern extraction. |
| Future ERP/MES/BI integration | Custom adapters and .NET ecosystem | Spring Integration/Batch provide explicit EIP and restartable-job vocabulary | Java `ADVANTAGE`; every external contract still needs approval and its own Adapter. |
| Team skill | No current repository evidence establishes greater .NET skill | No current repository evidence establishes greater Java skill | `UNKNOWN`; familiarity is not invented. |
| Total cross-system toolchain count | C#/.NET/NuGet can span Server and Windows components | Java/JVM/Maven/Spring on Server plus C#/.NET/NuGet on Windows | .NET `ADVANTAGE`; accepted as a maintainability cost, Q-13 `NOT-RUN`. |
| Relative workload performance | Credible high-throughput async Server | Credible high-throughput Server and virtual-thread option | `UNKNOWN`; no synthetic folklore or fake benchmark selects the winner. |

### 3.3 Reconsideration triggers for .NET

Engineering should switch the Server recommendation back to .NET only if a recorded review shows one
or more of the following, with evidence rather than convenience:

- Q-13 shows that owning Java/JVM/Maven/Spring plus the Windows .NET stack creates a material,
  management-agreed support/onboarding/patch burden that the unified .NET path avoids;
- the exact Temurin 25/Boot/JDBC/Flyway build loses supported status, cannot meet company provenance or
  commercial-support policy, or fails Q-01/Q-12/Q-14 while the equivalent .NET build passes;
- a named mandatory Server requirement exposes a Java-specific correctness, security, diagnostics or
  operations gap and .NET supplies a proven lower-risk path;
- the company adopts a maintained .NET Server platform and staffed support path that is materially
  safer than the selected Java path, independent of existing Windows-machine ownership.

The existence of Aras/DDM or another competitor using Java/.NET/SQL Server is not, by itself, a
switch trigger. Those observations remain `COMPETITOR-OBSERVATION` evidence only.

## 4. Database, persistence and migration decision

### 4.1 PostgreSQL 18 versus SQL Server 2025

| Candidate | Classification | Why it won/lost for Core v0 |
|---|---|---|
| PostgreSQL 18 | `SELECT` | Provides the required relational transactions, row/optimistic locks, JSON and index families; has a long major support line to 2030-11-14 and license optionality; fits the Linux-first topology and Boot-managed pgJDBC path. PGDG publishes the `resolute` package feed. Operations, backup, collation and support still have real cost. |
| SQL Server 2025 | `ALTERNATIVE` | Mature Windows/Linux tooling, Japanese Full-Text Search and strong company DBA/support can materially reduce risk. It loses the initial recommendation because license/edition/backup/support facts are not yet provided and choosing it merely because DDM uses SQL Server would be an invalid competitor inference. |

PostgreSQL is not selected because “free” means no cost. SQL Server is not rejected as weak, and its
documented extended-support horizon is longer than PostgreSQL's current major-line horizon. The
selection nevertheless reflects the current small-team, Linux-acceptable context, portability and
the absence of an established SQL Server entitlement/operations advantage in the repository; those
factors outweigh lifecycle length at this recommendation stage. Q-02, Q-07 and Q-14 must qualify the
real choice.

The relational database stores metadata, authorization, workflow, structure, Audit, search
projection, configuration and outbox rows. Artifact bytes stay in Artifact Custody. PostgreSQL WAL
and PITR do not back up those bytes; the recovery manifest must coordinate both stores.

### 4.2 Conditions that would switch to SQL Server

Reconsider SQL Server 2025 if the company documents an appropriate production edition/license, a
named DBA/backup owner, supported tooling and a materially safer restore/monitoring path, and Q-02,
Q-03, Q-07 and Q-14 show no unacceptable semantic or platform gap. SQL Server Developer remains a
development/test option only; Express's 50 GB ceiling does not make it an automatic production
choice, and edition is a separate decision.

### 4.3 Persistence and schema authority

Spring JDBC/`JdbcClient` with Boot-managed pgJDBC is the default authoritative persistence path.
Each Module owns SQL, mappings and queries; the Application Use-case Transaction Coordinator only
orchestrates the declared operation and a shared Spring-managed relational transaction/UoW when the
architecture requires atomic cross-module outcome. It is not a generic repository or CRUD service.
The JDBC-first choice exposes locking, search projection, outbox and `COPY`/bulk behavior, while
placing more mapping/review work on the team. Streaming multi-GB Artifact bytes remains an Artifact
Custody concern, not an ORM query. Spring Data JPA/Hibernate, Spring Data JDBC and jOOQ were considered:
JPA can hide flush/fetch/query behavior, Data JDBC's aggregate mapping is not a clear universal fit
for IDEA structure, and jOOQ's exact Java 25/license support is not a safe unqualified default.
A bounded additional mapper may be proposed only with owner-specific evidence and one migration
authority; no persistence library owns business gates, Audit outcome or recovery semantics.

Boot-managed Flyway (`flyway-core` plus `flyway-database-postgresql`) and reviewed versioned SQL are
the sole schema authority, including Spring Session/Batch infrastructure tables; disable competing
framework schema auto-initialization. A release expands schema, deploys compatible code, migrates
data, then contracts old columns only in a later controlled step. Run migrations as a preflight/release
action, not an uncontrolled app-start mutation. Destructive changes require a backup/restore or
forward-repair plan. Application rollback and database rollback are separate decisions.

## 5. Identity, authorization and API boundary

The selected account path keeps these identities distinct:

```text
Actor ≠ IDEA Account ≠ Login Identity ≠ Security Principal ≠ Role Assignment
```

Spring Security supplies maintained authentication, password encoding, session-fixation and CSRF
primitives; Spring Session JDBC supplies server-side session storage where needed. IDEA-owned Account
and Login Identity records, lockout/recovery policy and stable Actor remain distinct. Spring roles or
authorities do not become the product's Principal–Role–Scope model. For the first-party Web UI, use
secure HttpOnly SameSite cookies and anti-CSRF controls. Do not build an OAuth/OIDC server merely to
start Core v0.

The server establishes the Actor from authenticated session proof. The client may request an
operation, resource, scope and expected state, but never chooses the authoritative ActorId. Access
Policy resolves IAM eligibility, Project/Group membership, Role Assignments, Role Definition version
and scope hierarchy. The owner Module then applies business gates and commit-time revalidation. A
separate `AuthorizationDecision` is not conflated with an `OwnerCommandOutcome`.

The WPF shell's WebView2 session and the per-user Workspace session use a server-mediated, short-lived
binding. Native session material is protected with Windows per-user storage (DPAPI candidate) and is
never exposed to page JavaScript. The exact bootstrap, refresh, revocation, reauthentication and
same-user hostile-client behavior is Q-06/Q-08/Q-11 `NOT-RUN`. Future company OIDC is an integration
evolution path, not a Core v0 prerequisite.

HTTP contracts are versioned JSON REST and documented with OpenAPI 3.1. An Adapter owns each future
ERP/MES/BI/company-system contract; no external system writes IDEA operational tables directly.
Transactional outbox rows are committed with the authoritative owner outcome and delivered with stable
Event/Operation IDs and idempotent consumers. CloudEvents is `DEFER` until a named external consumer
requires it; a broker is `DEFER` until measured delivery volume, isolation or company platform
support justifies one.

## 6. Web, Desktop and Workspace decisions

### 6.1 Web

React 19.3 + TypeScript 7.0 + Vite 8.3 is the selected client baseline. Node.js 22 LTS (minimum
22.12 for the Vite 8 line) is a build-time dependency, not a production Server runtime. Exact patch
versions are pinned by lockfile and SBOM at qualification. `npm ci` is the reproducible install
contract; dependency upgrades are reviewed rather than silently taking “latest”.

The application is a client-side SPA with React Router 7 data APIs. IDEA Server remains authoritative
for data, authorization and transactions. SSR, RSC and a separate full-stack Node deployment are
`DEFER`: the current internal engineering product has no established SEO or server-rendering need,
and adding another production runtime would increase operations. The TypeScript 6 line is retained
only as a compatibility lane for tools that still need a stable compiler API; it is not a dual
runtime decision.

### 6.2 Installed Desktop shell

The current Spec contains Web, Desktop and Web-rendered Desktop obligations. A browser-only
workbench plus agent cannot silently be called equivalent; removing that surface would require a
follow-up Product Decision. Therefore the Core v0 recommendation is an installed WPF + WebView2
shell, with the React workbench rendered in the shell and native code restricted to approved intent
commands.

WPF is selected over WinUI 3 for the first bake because:

- mature Windows compatibility, accessibility and WebView2 hosting reduce first-bake unknowns;
- the shell can use the same `.NET 10` family as Workspace diagnostics; this does not select the Server;
- Windows App SDK has an independent and materially shorter servicing clock than .NET 10 LTS;
- the internal engineering context values durable file/CAD/Office integration and recoverable
  rollout over adopting the newest native UI guidance alone.

This is not a claim that WinUI 3 is inferior. WinUI 3 is an `ALTERNATIVE` if Q-10 demonstrates a
material accessibility, packaging or support advantage that outweighs its servicing clock.

WebView2 Evergreen is selected when company policy permits centrally patched runtimes. Fixed Version
is an `ALTERNATIVE` only for an offline/policy requirement; IDEA would then own renderer patching,
distribution and vulnerability response.

### 6.3 Workspace

Workspace is a separate per-user `.NET 10` process, not a server-owned Product Definition authority.
It materializes and hashes bytes, maintains a transfer journal, resumes interrupted transfers,
detects local changes, launches external CAD/Office and preserves recovery state. The Core v0 transfer
path remains `Store → Server → Workspace`; no direct store credential or SMB path is exposed.

Current-user named pipes provide the first IPC candidate. Every message has a protocol version,
operation/session scope, size limit, authentication and replay handling. WebView2 or a browser never
receives a generic file-system/shell object. Q-08 and Q-11 remain execution gates.

## 7. Search, Artifact custody and Format Worker

### 7.1 Search

Discovery starts as a rebuildable PostgreSQL relational projection. It handles exact identifiers,
business numbers, titles, metadata filters, deterministic sorting, paging and permission predicates.
PostgreSQL ICU, `pg_trgm` and built-in text search are implementation candidates, not a promise of
Japanese tokenization or a universal linguistic contract. Q-03 must use an approved Vietnamese and
Japanese corpus and record normalization, width/case, recall/precision, plans, p95/p99 and rebuild
evidence.

Elasticsearch/OpenSearch/Lucene is `DEFER`, not “bad”. Extract only after measured relational
triggers: an agreed latency target cannot be met after tuning, approved-corpus recall/precision is
unacceptable, index/rebuild windows exceed an agreed limit, or an independently scalable search
workload is demonstrated. Until then a second indexing authority adds backup, security and
reconciliation cost.

### 7.2 Artifact custody

The initial adapter is a private server-managed filesystem-backed store on a protected volume. It
uses immutable digest-addressed organization and provider-neutral Artifact IDs. Metadata, digest,
content role and references are authoritative in the owning IDEA Module; bytes and locations are
owned by Artifact Custody. A successful byte write is not a successful Generation, Representation or
BOM acceptance. The owner UoW commits metadata, Audit and outbox only after verification.

S3-compatible/object storage is `DEFER` until multiple Server nodes, a storage platform, independent
scale or company policy justifies its operational and migration cost. A provider-neutral adapter and
stable IDs preserve that future path. Direct user access through an SMB share is `REJECT FOR CORE V0`.

### 7.3 Format Worker

Format processing remains a separate boundary, normally a Windows worker when the exact CAD/Office
application or license requires it. A versioned Adapter profile identifies application, converter,
OS, bitness, license and limits. The worker returns a candidate; Format Intelligence or Product
Structure revalidates the source Generation/profile and commits accepted Representation metadata,
owner outcome, Audit and outbox atomically. Manual export/upload follows the same provenance and
acceptance boundary. There is no “universal converter” commitment and no claim that IRONCAD headless
automation works before Q-09.

## 8. Deployment, topology, observability and version policy

### Decision A — Server OS, independent of Server and Windows-client runtimes

| OS | Disposition | Support and operational reading | Reconsideration trigger |
|---|---|---|---|
| Ubuntu Server 26.04 LTS | `SELECT — platform direction` | Canonical standard security maintenance to May 2031; official Temurin 25/PGDG 18/Nginx paths; apt package management and systemd suit a long-lived headless Server. No Windows estate weight is applied. Q-07/Q-12/Q-14 still own restore, monitoring, hardening, certificate, patch, operator and licensing/provenance evidence. | Exact required component or company policy fails 26.04 qualification. |
| Ubuntu Server 24.04 LTS | `ALTERNATIVE` compatibility path | Supported LTS to May 2029 and a viable Linux path when exact 26.04 dependency/policy support is absent; shorter remaining runway may require an earlier OS migration. | Switch only after a named Q-14 incompatibility or IT support condition, not preemptively. |
| Windows Server 2025 | `ALTERNATIVE / CONTINGENCY` | Credible service/security/backup platform but its licensing, patch and operator cost must be evidenced. Existing company Windows machines or Windows engineering PCs do not make this a natural/equal fallback. | IT governance mandate, selected Server component/integration requiring Windows, failed Linux qualification, or materially stronger staffed security/operations support demonstrated. |

There is no measured total-cost ranking or assigned 24/7 operator. Linux-first is the project user's
Tech-context preference, not an approved platform deployment. Platform support is established at the
published component level; the whole-stack operational build remains Q-14 `NOT-RUN`.

### 8.1 Initial logical/physical topology

```text
Company-managed Ubuntu Server 26.04 LTS VM (selected platform direction; single, non-HA candidate)
├── Nginx / managed TLS entry
├── IDEA Server (Temurin 25 + Spring Boot 4.1.x modular monolith)
│   ├── owner Modules + Application Use-case Transaction Coordinator
│   ├── bounded outbox/background jobs and per-system Adapters
│   └── Actuator/Micrometer/OpenTelemetry + structured diagnostics
├── PostgreSQL 18
└── protected private Artifact volume

Independent failure-domain backup target
└── PostgreSQL base/WAL + Artifact + config/policy + required cryptographic material

Optional separate Windows Format Worker
└── exact licensed CAD/Office/converter Adapter profile

Windows engineering PC (per user)
├── IDEA Desktop (WPF + WebView2 Evergreen)
└── IDEA Workspace (.NET 10, current-user named-pipe boundary)
```

The VM is a simple initial failure domain, not HA and not a capacity claim. A signed/versioned
Spring Boot executable-JAR bundle under systemd, with host-managed Temurin 25 and configuration/secrets
outside the bundle, is selected over a mandatory production container or an internally maintained
application `.deb`. Boot publishes the executable archive and systemd path. The release procedure must
pin checksums/signatures and SBOM, preflight the Flyway migration, verify health and preserve a
recoverable old application bundle. Framework-dependent host JDK patching is selected; a
self-contained `jlink` image or internally managed `.deb` is `DEFER` unless IT policy or an evidenced
provenance/rollback need requires it. Development may use disposable containers where convenient,
but Docker/Compose is not production authority. Kubernetes, service mesh and a microservice fleet are
`REJECT FOR CORE V0`; reconsider only with a supported company platform or measured independent-scale
need.

Backup covers DB, immutable bytes, configuration/policy and keys at a mutually usable point. A RAID,
same-VM snapshot or second folder is not an independent recovery proof. Q-07 must measure restore and
validate login, file retrieval, Check-in and Audit/outbox integrity.

### 8.2 Observability baseline

The selected telemetry protocol is OpenTelemetry with replaceable OTLP export. Minimum signals are:

- structured application/security/worker logs with redaction and correlation IDs;
- metrics for request outcomes, DB pool/locks, transfer bytes/rate/failures, outbox lag, queue/worker
  health, storage capacity, process/GC and recovery jobs;
- traces carrying Operation ID and authorization/owner outcome correlation;
- separate immutable Audit Evidence, not merely a log line;
- JVM process/GC diagnostics through JFR/`jcmd` or an equivalent supported JDK incident path.

The repository does not select Grafana, a cloud vendor or a commercial backend. The company must
name export, retention, access and on-call ownership in Q-12/Q-13.

### 8.3 Family versus patch policy

| Family | Selected policy | Qualification/deployment rule |
|---|---|---|
| Java distribution | Eclipse Temurin 25 LTS | Deploy a supported current patch from a verified Adoptium source; community availability is not a commercial SLA. |
| Spring Boot / Modulith | Boot 4.1.x + compatible Modulith 2.1.x | Pin/test Boot BOM and Modulith versions; Boot minor support and patch clocks are distinct from Java 25 LTS. |
| Maven / JDBC / Flyway | Maven Wrapper; Boot-managed pgJDBC and Flyway PostgreSQL module | Pin wrapper and resolved dependency graph, inventory licenses/SBOM and test exact driver/migration combination. |
| PostgreSQL | Major 18 | Use the current supported minor at qualification and keep a tested upgrade/restore path; no patch is a product requirement. |
| React | 19.3 major line | Pin exact package versions/lockfile and review React security advisories. |
| TypeScript | 7.0 compiler line | Use TS6 only for explicitly identified compiler-API tooling compatibility; remove the lane when dependencies support TS7. |
| Node.js | 22 LTS build line | Minimum 22.12 for Vite 8; build agents use a supported patch and reproducible lockfile. |
| Vite | 8.3 line | Pin patch and review plugin compatibility. |
| Windows client .NET / WPF / WebView2 | .NET 10 per-user Workspace and WPF shell; WebView2 Evergreen | Separate from Server runtime. Evergreen patching is company-managed where permitted; Fixed Version requires an IDEA-owned patch calendar. |
| Ubuntu | 26.04 LTS `SELECT — platform direction`; 24.04 LTS compatibility alternative | Official Java/PostgreSQL package paths are established; Q-14 proves the exact operational build and OS patch ownership. |
| Dependency delivery | Lockfiles, SBOM and signed/versioned bundles | Monthly security patch review and quarterly planned updates are proposed operating cadence; management has not approved a SLA. |

# Not selected for Core v0

| Technology/approach | Classification | Why it is not the initial choice; reconsideration trigger |
|---|---|---|
| .NET 10 + ASP.NET Core/Kestrel | `ALTERNATIVE` | Strong Linux support, async I/O, Worker/EF/Npgsql/diagnostics and one language family with Windows client. Reconsider if Q-01/Q-12/Q-13/Q-14 shows a material supported advantage over Java, not because Windows machines already exist. |
| SQL Server 2025 | `ALTERNATIVE` | Credible and possibly better where company DBA/licensing/support already exists; no such advantage is evidenced here. Reconsider after edition/license/restore/FTS/platform qualification. |
| Ubuntu Server 24.04 LTS | `ALTERNATIVE` compatibility path | Retained if an exact required component/backup/monitoring/security package or company policy cannot support 26.04 during Q-14; its standard security maintenance ends May 2029. |
| Windows Server 2025 | `ALTERNATIVE / CONTINGENCY` | Use only if IT governance mandates Windows, a selected Server component/integration requires it, Q-14 Linux qualification fails, or a measured staffed security/operations advantage is material. Existing Windows infrastructure alone has zero selection weight. |
| WinUI 3 / Windows App SDK | `ALTERNATIVE` | Microsoft’s new-app guidance is respected, but the separate shorter servicing clock and unrun packaging/accessibility tests make WPF lower risk for first bake. |
| Browser + signed Workspace agent only | `ALTERNATIVE` / `FOLLOW-UP PRODUCT DECISION REQUIRED` | Could reduce embedded native surface, but cannot silently remove the current Web-rendered Desktop obligation; browser-to-agent security/LNA/installer tests are unrun. |
| Tauri 2 + Rust | `ALTERNATIVE` challenger | React reuse and scoped capabilities are credible, but Rust has no multi-year LTS and adds toolchain/updater/IPC ownership. Reconsider only after G1–G10/Q-08/Q-10/Q-11 pass. |
| Electron | `REJECT FOR CORE V0` | Bundled Chromium/Node and rapid major cadence add renderer and patch ownership not justified by the current Windows scope; no claim that Electron is generally unsuitable. |
| JavaFX | `DEFER` | Corrected 2026 support evidence keeps it viable, but WebKit/React/SSO/IPC/installer/CAD behavior remains unqualified and it does not reduce the .NET Workspace boundary. |
| Qt/C++ | `DEFER` | Adds a C++/Qt licensing and toolchain boundary without a demonstrated product need or React reuse advantage. |
| TypeScript 6 as production compiler | `REJECT FOR CORE V0` | TS7 is the selected source compiler line; TS6 is retained only as a bounded tool/plugin compatibility lane. |
| JPA/Hibernate or Spring Data JDBC as default Server persistence | `DEFER` | Both can be useful for bounded aggregates, but neither is a proven universal fit for IDEA's explicit query/lock/outbox/structure ownership. Add only after measured module-specific need. |
| jOOQ as default Server persistence | `DEFER` | Explicit SQL is attractive, but exact Java 25 edition/licensing/support must be qualified before replacing the selected JDBC-first baseline. |
| Internally managed application `.deb` or self-contained Java image | `DEFER` | Adds release/package/JDK patch ownership without a demonstrated Core v0 requirement; adopt only if IT provenance, signing, support or rollback policy demands it. |
| Elasticsearch/OpenSearch/Lucene | `DEFER` | Dedicated search adds an authority, backup and recovery surface before relational search triggers are measured. |
| Redis | `REJECT FOR CORE V0` | No current cache/session/queue requirement justifies another stateful service; add only with a measured owner and recovery contract. |
| Kafka/RabbitMQ/other mandatory broker | `DEFER` | Transactional outbox plus bounded workers covers the initial integration posture; add on measured volume/isolation or an adopted company platform. |
| CloudEvents | `DEFER` | A useful interoperability option, but no named Core v0 consumer or event contract requires selecting its version yet. |
| S3/MinIO/object-storage infrastructure | `DEFER` | Provider-neutral Artifact contracts preserve migration; current one-site topology does not justify another storage service before Q-04/Q-07. |
| SSR/RSC/Next.js or another full-stack Web runtime | `DEFER` | No established SEO/server-rendering need; would add a production Node runtime and duplicate authority. |
| Microservices, Kubernetes, service mesh or HA cluster | `REJECT FOR CORE V0` | No measured independent-scale requirement or platform team; one VM remains non-HA and must be restored/tested. |
| Direct SMB/shared-folder Artifact access | `REJECT FOR CORE V0` | Violates server-mediated custody and authorization boundary. |
| Universal CAD converter or CAD add-in | `REJECT FOR CORE V0` | Exact application/license/format behavior is unknown; use isolated Adapter/worker plus manual upload fallback. |
| OAuth/OIDC server built for Core v0 | `DEFER` | Native IDEA account/session path is the current context; company OIDC is a future integration decision, not a reason to invent a token authority. |

# Architecture Review Challenge

| Question | Answer against the recommendation |
|---|---|
| 1. Strongest argument against the chosen Server runtime? | Java adds a second language/runtime/build/diagnostic/patch family beside Windows .NET, while Boot minor support is shorter than Temurin 25's runtime runway. Q-13 must show a named team can own this cost. |
| 2. Strongest argument against the chosen database? | PostgreSQL shifts more operational/backup/collation expertise to the company than an already-supported SQL Server estate might. A real DBA/support and restore comparison could reverse the choice. |
| 3. Strongest argument against the chosen Desktop shell? | WPF is Windows-only and older than WinUI 3; WebView2 creates a privileged Web/native boundary and a separate patch clock. Accessibility, packaging or policy failure in Q-10/Q-11 would force a shell review. |
| 4. Which decision has the highest chance of reversal after prototype evidence? | The client path: WPF + WebView2 versus browser + signed agent/Tauri, because IPC, dirty-workspace update, accessibility and CAD/Office behavior are still `NOT-RUN`. |
| 5. Which technology creates the highest long-term patch/operations burden? | The combined Java Server plus Windows WPF/WebView2/.NET Workspace/optional Format Worker patch clocks. A Boot BOM does not make JDK, Windows renderer or CAD licenses share one lifecycle. |
| 6. Which decision most depends on unknown company skill? | Owning Temurin/Boot/Maven/PostgreSQL operations alongside Windows packaging/signing, backup/key custody and incident response. Q-13/Q-14 must name owners; the project user is not assumed to be a 24/7 operator. |
| 7. What exact evidence would switch to the runner-up? | A same-fixture .NET slice meets correctness/security/recovery while Java fails a mandatory condition, or Q-13/Q-14 proves a material, management-accepted total support/patch advantage for .NET independent of Windows-estate inertia. |
| 8. Are we selecting .NET Server because it is the best Linux Server choice, or because Windows clients use .NET? | We are not selecting .NET Server. Its C# reuse is a real maintainability factor, but the Server choice is Java because direct module verification, Integration/Batch and JDK support optionality win after Linux-first criteria are separated. |
| 9. If Desktop/Workspace were language-neutral black boxes behind stable HTTPS/IPC contracts, which Server runtime would Engineering choose? | Java 25/Temurin 25/Spring Boot 4.1.x. The counterfactual removes the only substantial cross-component .NET advantage without weakening Java's Server-specific advantages. IPC remains internal to Windows client; Server sees versioned HTTPS/JSON/OpenAPI contracts. |

## 11. PG3 readiness / pre-decision

This section prepares PG3; it does not pass PG3. “Resolved by Engineering Recommendation” means the
matrix has made a coherent choice, not that the Product Decision Authority has accepted it.

| Material Tech question | Status | Evidence still needed / owner |
|---|---|---|
| One Server runtime and framework | `RESOLVED BY ENGINEERING RECOMMENDATION` | Java 25/Temurin 25 + Spring Boot 4.1.x/Modulith selected; PDA review and Q-01/Q-13 remain open. |
| One database and persistence/migration authority | `RESOLVED BY ENGINEERING RECOMMENDATION` | PostgreSQL 18 + Spring JDBC/pgJDBC + sole Flyway/SQL migration authority selected; Q-02/Q-07/Q-14 must qualify it. |
| Identity/account versus product authorization boundary | `RESOLVED BY ENGINEERING RECOMMENDATION` | Spring Security/Session JDBC + custom Actor/Account/Login Identity + IDEA Access Policy selected; Q-06/Q-08/Q-11 remain `NOT-RUN`. |
| Web CSR and installed Desktop surface | `RESOLVED BY ENGINEERING RECOMMENDATION` | React CSR + WPF/WebView2 preserves current Spec surface; any removal/change requires a follow-up Product Decision. |
| Workspace runtime and IPC | `RESOLVED BY ENGINEERING RECOMMENDATION` | .NET per-user process + current-user named pipe selected; Q-08 and Q-11 remain `NOT-RUN`. |
| Ubuntu 26.04 platform versus operational build | `SELECT — platform direction` / `QUALIFICATION REQUIRED` | Official Temurin 25, Boot Java 25/systemd and PGDG 18/`resolute` paths are established. Q-14 still builds/installs/hardens/patches/restores the exact IDEA stack; 24.04 is a compatibility alternative, Windows a contingency. |
| Production edition, license, certificates, signing and support ownership | `BLOCKED` | Company must name the OS/DB edition, certificate/key custodian, backup target, support/on-call owner and permitted install/update policy. No repository evidence yet. |
| Transaction, concurrency, outbox and module-boundary behavior | `QUALIFICATION REQUIRED` | Q-01, Q-02, Q-05 and architecture tests; Product/Tech/Data owners. |
| Multi-GB transfer, Artifact custody and recovery | `QUALIFICATION REQUIRED` | Q-04 and Q-07 with representative files and failure injection; Workspace/Operations owners. |
| Japanese/Unicode search contract | `QUALIFICATION REQUIRED` | Q-03 approved corpus and thresholds; Data/Product owner. |
| CAD/Office/IRONCAD representation path | `QUALIFICATION REQUIRED` | Q-09 exact application/version/license/worker fixture; Format/Product owner. |
| Client installation, WebView2, native boundary and rollback | `QUALIFICATION REQUIRED` | Q-10/Q-11 clean company images, threat cases and dirty Workspace; IT/Security/Release owners. |
| Operations, observability and maintainability | `QUALIFICATION REQUIRED` | Q-12/Q-13 telemetry runbook, SBOM, patch and support rotation; Operations/Engineering owners. |
| Product Decision Authority review/acceptance of TECH-001@0.10 | `NOT-RUN` | Boss reviews the exact brief and source pins; no approval is implied by this artifact. |
| PG3 gate disposition | `NOT-RUN` | GOV/DOC-07/VVP gate owner records the decision after applicable review; this matrix never writes `PASS`. |

### 11.1 Minimum evidence before a Tech approval request

The following is the minimum decision packet, not a claim that it exists:

1. PDA review of `TECH-001@0.10` and this matrix, including the .NET/SQL Server alternatives and
   explicit switch triggers.
2. Company disposition for Ubuntu 26.04 versus 24.04/Windows Server, production PostgreSQL edition,
   certificates/keys, backup target, signing and named support owners.
3. Q-01/Q-02/Q-05 evidence for one authoritative transaction slice, module boundaries, commit-time
   authorization, Audit/outbox atomicity and idempotent retry.
4. Q-06/Q-08/Q-11 security evidence for server-established Actor, cookies/session revocation, WebView2
   navigation/message controls and cross-user Workspace refusal.
5. Q-14 exact platform/package/driver/restore compatibility evidence.

Q-03/Q-04/Q-07/Q-09/Q-10/Q-12/Q-13 remain implementation/operational qualification work unless a
gate owner explicitly makes one a PG3 entry condition. They cannot be relabeled `PASS` here.

## 12. Qualification backlog (all rows remain NOT-RUN)

The backlog is preserved from the research synthesis and mapped to the selected baseline. A
comparative branch marked `DEFERRED` means it was not executed; it is not a failed test.

| ID / question | Selected stack / comparison | Preconditions | Exact test and retained evidence | Gate relevance / owner | Status |
|---|---|---|---|---|---|
| `Q-01` Server vertical slice | Java 25/Temurin 25 + Boot 4.1.x/Modulith + PostgreSQL/JDBC/Flyway; .NET branch `DEFERRED` | Same API contract, schema, Artifact adapter and TLS | Implement authenticated Check-out/Reference/Check-in/Release with immutable Generation, `AuthorizationDecision`, commit-time revalidation, outbox and idempotent retry; retain source, migration, module-verification result, trace, Audit/outbox rows and failure log | Tech/Product correctness; Product/Tech reviewers | `NOT-RUN` |
| `Q-02` DB transaction/concurrency | PostgreSQL 18 selected; SQL Server branch `DEFERRED` | Same fixture and isolation goals | Conflicting Reservation/Generation/Release operations, optimistic/pessimistic locks, deadlock/timeout/retry; retain plans, lock graphs, terminal states and timings | Data/Tech; no lost update or unauthorized commit | `NOT-RUN` |
| `Q-03` Search Unicode/JA | PostgreSQL projection selected; SQL Server projection `DEFERRED` | Approved permission model and Vietnamese/Japanese corpus | ID/title/filter/sort/page, case/width/normalization/contains, permission changes and rebuild; retain recall/precision, plans, p95/p99 and rebuild duration | Product/Data thresholds | `NOT-RUN` |
| `Q-04` Multi-GB transfer/custody | Temurin/Boot Server + .NET Workspace + filesystem Artifact Store; browser/Tauri branches `DEFERRED` | Representative 1/5/10+ GB files and failure injector | Stream Store→Server→Workspace upload/download, digest, network/process/power interruption, resume ranges and duplicate OperationId; retain digests, journal, both-process memory/RSS and orphan report | Workspace/Server; no corruption or duplicate publish | `NOT-RUN` |
| `Q-05` Outbox/idempotency | PostgreSQL outbox + bounded Spring dispatcher/Integration Adapter; broker branch `DEFERRED` | Same DB and event contract | Crash before/after commit and during delivery; duplicates/reordering/same-key-different-input; retain transaction log, Event IDs, dedupe and replay report | Integration; one authoritative outcome | `NOT-RUN` |
| `Q-06` Account/session revocation | Spring Security + Spring Session JDBC cookie/bootstrap path; .NET branch `DEFERRED` | Cookie/session policy and two sessions | Fixation, CSRF, concurrent sessions, logout, revoke, expiry, reauth and Workspace binding; retain security traces/session evidence and denial proof | Security; revoked session cannot command owner operation | `NOT-RUN` |
| `Q-07` Backup/restore | PostgreSQL PITR + Artifact/config/key coordinated backup | Off-primary target and key custody | Restore DB, Artifact, config/policy/crypto material; replay outbox and simulate severe failure; retain transcript, measured RTO/RPO and integrity report | Operations; preliminary RTO/RPO only if measured/approved | `NOT-RUN` |
| `Q-08` Windows Workspace IPC | .NET named pipes; Rust/JavaFX branches `DEFERRED` | Two Windows users, two Workspaces, elevated/non-elevated processes | Cross-user/cross-Workspace, replayed, oversized and wrong-version messages; reconnect; retain ACL/config/protocol traces and refusal evidence | Security/Workspace | `NOT-RUN` |
| `Q-09` Office/IRONCAD open/save | WPF/WebView2 + .NET Workspace + separate Windows worker | Exact company app/OS/bitness/license fixture | Materialize verified file, launch by association, edit/save/close, detect stale/in-use/error without add-in; retain app matrix, custody journal and state mapping | Workspace/Product/Format | `NOT-RUN` |
| `Q-10` Client install/update/rollback | WPF + Evergreen WebView2; WinUI/browser/Tauri branches `DEFERRED` | Clean company images, signer and offline policy | Per-user/admin install, missing WebView2, online/offline update, dirty Workspace, forced failure, rollback/version skew; retain logs, signatures, SBOM/license inventory and local-work preservation | IT/Release | `NOT-RUN` |
| `Q-11` Web/native attack surface | WebView2 + WPF + named-pipe boundary | Threat model and test origins | Navigation/redirect/iframe/popup/forged messages, LNA/CSRF/DNS rebinding/hostile origin/custom protocol replay; retain security report and policy settings | Security; no generic filesystem/shell/host object | `NOT-RUN` |
| `Q-12` Observability/incident diagnosis | Actuator/Micrometer/OpenTelemetry + logs/metrics/traces + JFR/`jcmd` | Common schema and redaction policy | Inject transfer failure, deadlock, auth denial, outbox lag and worker crash; diagnose from telemetry/JVM capture; retain dashboards, trace correlation, runbook and time-to-diagnose | Operations | `NOT-RUN` |
| `Q-13` Team/toolchain maintainability | Java Server + .NET Windows client versus unified .NET runner-up | Named maintainers/support owners | Build/patch/debug same slice, rotate incident, update Temurin/Boot/Maven/.NET dependencies and reproduce both builds; retain steps, two SBOMs, patch inventory, support entitlement/cost and defects | Engineering/management | `NOT-RUN` |
| `Q-14` DB/platform compatibility | Temurin 25 + Boot 4.1.x/JDBC/Flyway + PostgreSQL 18 + Ubuntu 26.04 executable-JAR/systemd; 24.04/.NET/Windows branches `DEFERRED` | Official base support established; exact signed bundle, repositories, backup target and monitoring fixture | Build/install/harden/patch/restore the exact matrix; prove package provenance, driver/Flyway compatibility, certificates, systemd, monitoring and PostgreSQL/Artifact recovery; retain SBOM, lifecycle matrix and restore logs. Recheck vendor support rather than retesting whether published 26.04 paths exist | Platform/IT; no unsupported production combination | `NOT-RUN` |

## 13. Trace, change and non-impact statement

This matrix traces the recommendation to the evidence synthesis and the current controlled sources;
it does not promote research into a product requirement. The following boundaries are unchanged:

- no FTR or REQ was added, removed or reworded;
- no Feature, Spec, Tech approval or product gate was recorded;
- no DOC-01…DOC-08 semantics or accepted ADR was changed;
- no Artifact Custody or Transaction Coordinator God Module was introduced;
- `Active → Ended / Expired / Recovered` remains the Reservation lifecycle and `Released` remains
  Business Revision terminology only;
- server-established ActorContext, Access Policy/owner-outcome separation, shared relational UoW,
  `Store → Server → Workspace`, provider-neutral Artifact custody, Representation acceptance and
  Restricted Recovery Mode remain the existing architecture contracts;
- all qualification rows and product procedures remain `NOT-RUN`.

The recommendation can be challenged or replaced through a successor matrix and change record. Until
the Product Decision Authority acts, it is an engineering recommendation only.
