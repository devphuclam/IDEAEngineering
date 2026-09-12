# Technology Selection Evidence Synthesis for IDEA Engineering

| Control field | Value |
|---|---|
| Stable Research ID | `IE-RES-TECH-20260913-001` |
| Document class | `RESEARCH-SYNTHESIS` |
| Title | Technology Selection Evidence Synthesis for IDEA Engineering |
| Version | `0.1` |
| Status | `Draft` |
| Artifact role | `INFORMATIVE RESEARCH INPUT` |
| Product normativity | `INFORMATIVE` — this artifact creates no product requirement and does not approve a stack |
| Repository process authority | `NOT-APPLICABLE` |
| Repository instruction state | `NOT-APPLICABLE` |
| Owner | Product Decision Authority; named owner `UNKNOWN` |
| Author | Repository maintainers; named attribution `UNKNOWN` |
| Reviewer | Product Decision Authority; review `NOT-RUN` |
| Acceptance authority | Product Decision Authority; acceptance `NOT-RUN` |
| Evidence date / retrieval | `2026-09-13` (Asia/Saigon) |
| Applicable baseline | IDEA Engineering catalogue baseline; Q18 and the technology decision remain open |
| Source / upstream trace | Five dated technology research notes, IDEA instance catalogue, DOC-04/DOC-05/DOC-06/DOC-08, VVP and ADR-0004 |
| Downstream trace | Future `TECH-001` revision and qualification records only; no downstream approval is created here |
| Supersedes / Superseded by | `NOT-APPLICABLE` / `NOT-APPLICABLE` |
| Decision status | `NOT-RUN` — no overall Java/.NET/client/database winner is selected |
| Evidence status | `INFORMATIVE RESEARCH INPUT`; source limits and qualification gaps are explicit |

## 1. Purpose and decision boundary

This synthesis corrects and connects the five dated technology notes. It is deliberately not the
final Tech Stack decision. It records current facts, bounded IDEA implications, candidate-level
recommendations and executable qualification work so a later `TECH-001` can be reviewed against
evidence rather than assumption.

The authority chain remains:

`Primary source → research claim → IDEA implication → this synthesis → later Tech decision`

The catalogue, DOC-04, DOC-05, DOC-06, DOC-08, VVP, ADR-0004, FTR and REQ records remain authoritative
for product meaning. If this research appears to conflict with them, the disposition is
`FOLLOW-UP PRODUCT DECISION REQUIRED`; this file does not silently alter the product documents.

Known context is intentionally bounded: approximately 50–100 intended users at one site (not a
concurrency promise), individual multi-GB Artifacts stored outside relational metadata, a Windows
engineering-PC fleet, a separately protected per-user Workspace boundary, and an open future
capacity envelope. The current server starts as a modular monolith candidate. VVP evidence and
capacity thresholds remain `NOT-RUN`.

## 2. Normalized evidence taxonomy

The five source notes used overlapping labels. This synthesis uses the following controlled set:

| Class | Meaning and limit |
|---|---|
| `FORMAL-STANDARD` | ISO/IETF standard semantics. A standard does not mandate IDEA's runtime or topology. |
| `INDUSTRY-SPECIFICATION` | OpenAPI, CloudEvents, OpenID Connect or another published interoperability specification. It defines a contract, not product ownership. |
| `OFFICIAL-PRODUCT-FACT` | A first-party project/vendor page directly states a capability, version or compatibility fact. |
| `OFFICIAL-LIFECYCLE-LICENSING` | A first-party support, servicing, edition or license term. Support entitlement and free use are separate questions. |
| `OFFICIAL-GUIDANCE-PATTERN` | A publisher's architecture/security/operations guidance and its trade-offs. It is not an IDEA capacity result. |
| `FIRST-PARTY-PUBLIC-PRACTICE` | A product team publicly exposes a practice or interface. Its undisclosed internals are not inferred. |
| `COMPETITOR-OBSERVATION` | Aras/DDM/Windchill or another product observation. It can show that an architecture family is credible, never that IDEA must copy it. |
| `IDEA-INFERENCE` | A bounded interpretation of a fact under IDEA's known context. It is not a requirement or approval. |
| `QUALIFICATION-UNKNOWN` | The exact IDEA behavior has not been built/measured or the source is insufficient. The required test is stated explicitly. |

The words `ADVANTAGE`, `DISADVANTAGE`, `DRAW`, `UNKNOWN` and `QUALIFICATION REQUIRED` are
comparative dispositions, not numeric scores.

## 3. Authority and candidate boundary

- Q18 is still open. The WPF/.NET/WebView2 shape in `TECH-001` is an unapproved candidate, not an
  approved requirement.
- A relational database, search projection, outbox, Adapter, Artifact custody boundary and
  Transaction Coordinator are architectural candidates. They must not become new product authority
  or unrestricted “God Modules”.
- `ArtifactReference` remains Controlled Product Data. Artifact bytes and conversion workers remain
  separate custody concerns. A Transaction Coordinator may orchestrate a named business operation;
  it is not generic CRUD authority.
- A browser + local agent that removes a required `Desktop` or `Web-rendered Desktop` surface would
  require a separate Spec/product decision. It is not a Tech-only substitution.
- Competitor SQL Server/.NET evidence is comparison evidence only. It does not close the PostgreSQL,
  Java or .NET decision.

## 4. Current verified technology facts

The rows below separate fact, IDEA implication, qualification and decision status. Exact versions are
retrieval snapshots, not a promise that an unapproved future build will use them.

| Candidate/component | `OFFICIAL-PRODUCT-FACT` or `OFFICIAL-LIFECYCLE-LICENSING` | `IDEA-INFERENCE` | Qualification | Decision status |
|---|---|---|---|---|
| Java 25 | Oracle identifies Java 25 as LTS, with Premier Support to Sep 2030 and Extended Support to Sep 2033 for entitled customers. Oracle's NFTC FAQ states free commercial/production use through Sep 2028 under its conditions. Eclipse Temurin lists `25.0.4.1+1` and community availability at least to Sep 2031 without an Eclipse SLA ([Oracle roadmap](https://www.oracle.com/java/technologies/java-se-support-roadmap.html), [Oracle FAQ](https://www.oracle.com/java/technologies/javase/jdk-faqs.html), [Temurin support](https://adoptium.net/support/), [Temurin release](https://adoptium.net/news/2026/09/eclipse-temurin-8u504-110321-170201-210121-25041-26021-available)) | A named Java 25 distribution/support channel can be a long-lived Server baseline. | Verify chosen distribution, container image provenance, patch automation and any commercial SLA; do not say “Java 25 is free forever.” | `NOT-RUN`; candidate only |
| Java 26 | Oracle downloads list `26.0.2.1`; it is a non-LTS line with support only through Sep 2026 ([Oracle downloads](https://www.oracle.com/java/technologies/downloads/)) | Useful for experiments, not a default late-life baseline. | Run compatibility tests only if a Java 26 feature is required. | `NOT-RUN` |
| Spring Boot / Framework | Spring Boot `4.1.1` requires Java 17+ and Spring Framework `7.0.9+`; official build support is Maven `3.6.3+` and Gradle `8.14+`/`9.x`, with Tomcat `11.0.x`, Jetty `12.1.x` and GraalVM `25` paths. Boot dependency management owns compatible subversions ([system requirements](https://docs.spring.io/spring-boot/system-requirements.html), [dependency coordinates](https://docs.spring.io/spring-boot/appendix/dependency-versions/coordinates.html)) | Java 25 is inside the documented range; framework lifecycle is shorter and distinct from JDK lifecycle. | Build the exact Boot BOM, native/container image and database driver graph in CI; record Maven/Gradle and Linux image provenance. | `NOT-RUN` |
| Spring Modulith | Stable `2.1.1` supports module verification, module-scoped integration testing, observability and documentation; 2.2 M1 is preview ([project](https://spring.io/projects/spring-modulith), [release](https://spring.io/blog/2026/08/26/spring-modulith-2-2-m1-2-1-1-2-0-8-and-1-4-13-released/)) | `ADVANTAGE` for making ADR-0004 module boundaries executable in a Java candidate. | Confirm Boot 4.1.1 + Modulith 2.1.1 in a clean build and test boundary rules. | `NOT-RUN` |
| Spring Security / Session | Spring Security docs list `7.1.1`; Boot 4.1.1 manages that line. Spring Session JDBC/Redis supplies persistence options ([Security reference](https://docs.spring.io/spring-security/reference/getting-spring-security.html), [Boot coordinates](https://docs.spring.io/spring-boot/appendix/dependency-versions/coordinates.html), [Session docs](https://docs.spring.io/spring-session/reference/)) | Framework primitives can support authentication/session controls but do not define IDEA's Actor/Account/Access Policy domain. | Qualify session persistence, fixation, CSRF, concurrent sessions, logout and revocation. | `NOT-RUN` |
| Spring Data / Batch / Integration | Data 2026.0.1 is the current train; Data JPA `4.1.1`, Batch `6.0.5` and Integration `7.1.1` are current project lines in the 2026-08 release pages ([Data](https://spring.io/blog/2026/08/20/spring-data-2026/), [Data JPA](https://docs.spring.io/spring-data/jpa/reference/), [Batch](https://spring.io/blog/2026/08/20/spring-batch-6-0-5-and-6-1-0-M1-available-now/), [Integration](https://docs.spring.io/spring-integration/reference/)) | `ADVANTAGE` for a Java candidate's documented integration and restartable-job breadth; the exact Boot-compatible versions remain BOM-owned. | Exercise an ERP/MES/BI adapter, restart/retry and outbox flow against the real contract. | `NOT-RUN` |
| Micrometer / OpenTelemetry / JFR | Micrometer support is on the `1.17.x` line; OpenTelemetry has Java and .NET implementations; JFR is integrated with the JDK ([Micrometer support](https://micrometer.io/support/), [OpenTelemetry](https://opentelemetry.io/docs/languages/), [JFR tools](https://docs.oracle.com/en/java/javase/25/troubleshoot/diagnostic-tools.html)) | `DRAW` at platform level; runbook quality matters more than language. | Verify metric cardinality, trace propagation, JFR capture policy and retention. | `NOT-RUN` |
| .NET / ASP.NET Core | .NET support policy lists `10.0.12` as the current patch on 2026-09-08; .NET 10 LTS ends 2028-11-14. ASP.NET Core/Kestrel, Worker Services, `dotnet-monitor`, OpenTelemetry and Linux/container support are first-party paths ([.NET policy](https://dotnet.microsoft.com/en-us/platform/support/policy), [Kestrel](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/servers/kestrel?view=aspnetcore-10.0), [Workers](https://learn.microsoft.com/en-us/dotnet/core/extensions/workers), [diagnostics](https://learn.microsoft.com/en-us/dotnet/core/diagnostics/), [dotnet-monitor](https://learn.microsoft.com/en-us/dotnet/core/diagnostics/dotnet-monitor), [OpenTelemetry](https://opentelemetry.io/docs/languages/)) | `ADVANTAGE` for one Microsoft runtime/toolchain across Server and Windows Workspace; not proof of better server scale. | Run the same vertical slice, patch drill and Workspace tests as the Java candidate. | `NOT-RUN` |
| EF Core / Npgsql | EF Core 10 is LTS through 2028-11-10 and requires .NET 10. Npgsql's official repository activity lists `10.0.3`; provider compatibility must be checked rather than inferred from matching numbers ([EF Core 10](https://learn.microsoft.com/en-us/ef/core/what-is-new/ef-core-10.0/whatsnew), [Npgsql](https://www.npgsql.org/doc/release-notes/10.0.html), [EF provider](https://www.npgsql.org/efcore/release-notes/10.0.html)) | A coherent .NET/PostgreSQL path exists; Dapper/raw Npgsql should be named exceptions, not a default folklore optimization. | Build migrations, locks, bulk/stream paths, provider patch and diagnostics tests. | `NOT-RUN` |
| PostgreSQL | PostgreSQL `18.6` is the current supported minor; the major line is supported to Nov 14 2030. The PostgreSQL License is permissive/open source ([versioning](https://www.postgresql.org/support/versioning/), [18 docs](https://www.postgresql.org/docs/18/), [license](https://www.postgresql.org/about/licence/)) | `ADVANTAGE` on licensing optionality and long support; operations, backup and skill can still cost more than license price. | Qualify company operations, monitoring, backup, PITR, HA, collation and restore. | `NOT-RUN`; finalist |
| SQL Server 2025 | GA Nov 18 2025; mainstream support ends Jan 7 2031 and extended support Jan 7 2036. Linux release notes list SQL Server 2025 CU8 GDR build `17.0.4085.5` on 2026-09-08. Express has 1 socket/4 cores, 1,410 MB buffer pool and 10 GB relational DB limits; Standard/Enterprise features differ materially ([lifecycle](https://learn.microsoft.com/en-us/lifecycle/products/sql-server-2025), [Linux releases](https://learn.microsoft.com/en-us/sql/linux/sql-server-linux-release-notes?view=sql-server-ver17), [editions](https://learn.microsoft.com/en-us/sql/linux/sql-server-linux-editions-and-components-2025?view=sql-server-ver17)) | `ADVANTAGE` where company SQL Server operations/support already exist; production licensing and edition limits are real trade-offs. DDM use is competitor evidence only. | Qualify license/edition, HA, restore, FTS, Linux distro and operator ownership. | `NOT-RUN`; finalist |
| React / TypeScript / Vite | React `19.3.0` is current stable (2026-09-09); TypeScript `5.9`; Vite `8.3` line. Vite 8 requires Node `20.19+` or `22.12+` ([React versions](https://react.dev/versions), [React 19.3](https://react.dev/blog/2026/09/09/react-19-3), [TypeScript 5.9](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-9.html), [Vite releases](https://vite.dev/releases), [Vite 8](https://vite.dev/blog/announcing-vite8)) | React + TypeScript + Vite is a valid client-only CSR candidate behind a separate IDEA Server. React framework guidance does not automatically require SSR/RSC. | Qualify Router mode, accessibility/localization, cache invalidation, code splitting, security headers and bundle patching. | `NOT-RUN` |
| Windows App SDK / WinUI 3 | Stable Windows App SDK `2.4.0` released 2026-08-13; 2.x servicing ends 2027-04-29 and 1.8 maintenance ended 2026-09-09 ([downloads](https://learn.microsoft.com/en-us/windows/apps/windows-app-sdk/downloads), [channels](https://learn.microsoft.com/en-sg/windows/apps/windows-app-sdk/release-channels)) | Microsoft guidance recommending WinUI 3 for new native Windows applications is vendor guidance, not proof of lower IDEA lifecycle risk than WPF. | Qualify packaging, no-admin policy, scaling/accessibility, update rollback and the separate App SDK clock. | `NOT-RUN` |
| WebView2 | Evergreen is recommended for automatic security updates; Fixed Version shifts runtime size and patch ownership to IDEA. Runtime availability is not guaranteed on every clean image ([Evergreen vs Fixed](https://learn.microsoft.com/en-us/microsoft-edge/webview2/concepts/evergreen-vs-fixed-version), [enterprise](https://learn.microsoft.com/en-us/microsoft-edge/webview2/concepts/enterprise)) | `ADVANTAGE` for centrally serviced WebView2 only if fleet policy permits it; Fixed may be necessary for offline control but increases ownership. | Test runtime presence/bootstrap, origin/navigation/message validation and host-object exposure. | `NOT-RUN` |
| Tauri / Rust | Tauri core `2.11.5` is the current release line; Windows uses WebView2, capabilities scope commands, sidecars are explicit, and updater metadata is signed. Rust stable `1.98.1` was released 2026-09-03; Rust has no multi-year LTS ([Tauri releases](https://v2.tauri.app/release/), [capabilities](https://v2.tauri.app/security/capabilities/), [sidecar](https://v2.tauri.app/develop/sidecar/), [updater](https://v2.tauri.app/plugin/updater/), [Rust releases](https://blog.rust-lang.org/releases/)) | Credible challenger with React reuse and a scoped bridge; do not call it lighter without IDEA measurements. | Qualify IPC, native integration, sidecar custody, installer/signing, rollback and team support. | `NOT-RUN`; challenger |
| JavaFX | Oracle reintroduced JavaFX support in 2026. JavaFX 25 corresponds to JDK 25 and is supported to Sep 2030 under the applicable Oracle arrangement; JavaFX 25.0.4 is listed. Gluon offers a separate commercial LTS/backport path ([Oracle JVP roadmap](https://www.oracle.com/java/technologies/jvp-support-roadmap.html), [Oracle JavaFX downloads](https://www.oracle.com/java/technologies/downloads/javafx/), [Gluon support](https://gluonhq.com/services/javafx-support/)) | Support evidence is stronger than the older note stated, but JavaFX/WebKit is still a separate renderer and native boundary. | Qualify React/WebKit, SSO/WebAuthn, IPC, installer/update, accessibility and CAD/Office behavior. | `NOT-RUN`; conditional |
| Ubuntu / Windows Server | Ubuntu 24.04 LTS security maintenance runs to May 2029; 26.04 LTS to May 2031. Windows Server 2025 LTSC has a separate 5+5 servicing lifecycle (Microsoft lifecycle page lists mainstream to Nov 2029 and extended to Nov 2034) ([Ubuntu cycle](https://ubuntu.com/about/release-cycle), [Windows Server lifecycle](https://learn.microsoft.com/en-us/lifecycle/products/windows-server-2025)) | Do not prefer Ubuntu 24.04 merely because it was earlier. .NET supports both Ubuntu 24.04 and 26.04; SQL Server 2025's documented path is Ubuntu 24.04, so the 26.04 combination is `QUALIFICATION-UNKNOWN`. | Verify the complete Java/.NET + DB + backup + monitoring image; record OS and distro patch ownership. | `NOT-RUN` |

## 5. Java versus .NET: criterion-level comparison

Both runtimes are technically credible Server runtimes. No official source establishes a universal
throughput or scalability winner. The comparison below is deliberately non-numeric.

| IDEA criterion | Candidate A — Unified .NET | Candidate B — Java Server + .NET Workspace | Evidence-safe disposition |
|---|---|---|---|
| DOC-04 correctness and transaction safety | ASP.NET Core + EF/Npgsql can implement explicit owner transactions and streaming | Spring transaction stack + JPA/jOOQ/JDBC can implement the same | `DRAW`; vertical slice `QUALIFICATION REQUIRED` |
| Modular boundary enforcement | Project/assembly rules and selected analyzers must be named | Spring Modulith 2.1.1 directly verifies package/module boundaries | `ADVANTAGE` Java evidence; .NET enforcement `QUALIFICATION REQUIRED` |
| Integration and restartable processing | Worker Services/resilience primitives; exact adapters remain to be chosen | Spring Integration/Batch provide a broader first-party portfolio | `ADVANTAGE` Java ecosystem; not a product requirement |
| Search fit | Relational Discovery Projection, indexes and provider-specific FTS remain to be qualified | Same relational projection and provider-specific FTS choices remain to be qualified | `DRAW`; Unicode/Japanese contract `QUALIFICATION REQUIRED` |
| Raw HTTP/CPU performance | Async/Kestrel/server GC are credible | Async/virtual threads/JVM GC are credible | `UNKNOWN`; same workload only |
| Multi-GB Artifact streaming | Streams and bounded buffers are feasible | Streams and bounded buffers are feasible | `DRAW`; correctness dominates |
| Windows Workspace and native path | First-party named pipes, DPAPI, COM/P/Invoke and .NET tooling | B still uses .NET Workspace; Java Server does not reduce that capability | `ADVANTAGE` for .NET at Workspace boundary |
| CAD/Office boundary | Windows shell open/save and optional COM path are documented; exact app behavior is unproven | Same .NET Workspace boundary in B; Java Server is not the native adapter | `DRAW`; external open/save and any SDK path `QUALIFICATION REQUIRED` |
| Backup/restore and recovery | Database/Artifact/config/key restore can be orchestrated | Same recovery contract; Spring Batch can assist jobs but does not supply the drill | `DRAW`; RTO/RPO `NOT-RUN` |
| Runtime families | One primary language/runtime family, plus WebView2/App SDK clocks | Java Server plus .NET Workspace and WebView2/App SDK clocks | `ADVANTAGE` A for consolidation; exact maintenance cost `UNKNOWN` |
| Lifecycle/support optionality | Microsoft schedule is simple; .NET 10 LTS ends 2028-11-14 | Java 25 has Oracle/Temurin choices, but Spring has separate clocks | `ADVANTAGE` B on optionality; `QUALIFICATION REQUIRED` for support contract |
| Identity/account implementation | ASP.NET Core Identity primitives and documented cookie path | Spring Security/Spring Session primitives; IDEA account domain remains custom | `DRAW`; domain design and revocation tests required |
| Installer/update/rollback | MSIX/traditional installer and WebView2 Evergreen/Fixed are documented choices | Server can be Java while .NET Workspace retains the same Windows delivery choice | `DRAW`; signed dirty-workspace-safe rollback `QUALIFICATION REQUIRED` |
| Observability/incident diagnosis | `dotnet-monitor`, EventPipe, metrics/traces | Actuator/Micrometer, OpenTelemetry and JFR | `DRAW`; common runbook and redaction `QUALIFICATION REQUIRED` |
| SBOM/dependency patch burden | .NET/NuGet + Windows/WebView2/App SDK clocks | JDK + Maven/Gradle/Spring + .NET Workspace clocks | `UNKNOWN`; inventory and patch calendar required |
| Future extraction/scaling | Stateless ASP.NET nodes/workers can split later | Stateless Spring modules/workers can split later | `DRAW`; module ownership and measurements decide |
| Small-team operations | Fewer server/client runtime families | More families, but potentially stronger Spring integration familiarity | `UNKNOWN`; company skill is an input, not inferred |
| Commercial support/licensing | .NET no runtime license charge, Windows components and DB separate | JDK distribution/support plus Spring/driver/desktop terms | `UNKNOWN`; cost inventory required |

**Fact:** Java has a criterion-level advantage in explicit modularity/integration/batch evidence and
JDK support optionality. **Fact:** .NET has a criterion-level advantage at the Windows Workspace
boundary and in runtime consolidation. **Recommendation:** carry A and B to the same qualification
slice. **Qualification:** performance, cost, team support and recovery remain `NOT-RUN`.
**Decision status:** no overall winner.

## 6. Database and search decision evidence

### 6.1 PostgreSQL 18

`OFFICIAL-PRODUCT-FACT`: PostgreSQL 18.6 is the current supported minor. PostgreSQL 18 first
released 2025-09-25 and the official five-year versioning policy lists the expected final release
date as **2030-11-14**. Always use the official table for future changes
([versioning](https://www.postgresql.org/support/versioning/)).

The PostgreSQL License permits use, modification and redistribution with notices; it does not
provide an operational SLA. PostgreSQL supports Linux and Windows distributions through their own
packaging channels. WAL plus a base backup provides continuous archiving/PITR; `pg_dump` alone is
not a WAL base backup ([license](https://www.postgresql.org/about/licence/), [continuous archiving](https://www.postgresql.org/docs/18/continuous-archiving.html)).

PostgreSQL supplies JSON types, B-tree/GiST/GIN and other indexes, transaction isolation, row locks
and advisory locks. ICU collations support case/accent/normalization choices, but behavior depends
on the ICU version; a collation-version change can require REINDEX/refresh
([collations](https://www.postgresql.org/docs/current/collation.html), [ALTER COLLATION](https://www.postgresql.org/docs/18/sql-altercollation.html)).
Built-in text search has a default parser and language configurations; `pg_trgm` supports similarity
and indexed `LIKE`/`ILIKE`. Neither source proves IDEA's exact Japanese tokenization, width folding,
permission-filtered paging or title semantics ([text parsers](https://www.postgresql.org/docs/18/textsearch-parsers.html), [pg_trgm](https://www.postgresql.org/docs/18/pgtrgm.html)).

Authentication, TLS, encryption-at-rest, key custody, monitoring and OS service hardening remain
deployment responsibilities rather than automatic PostgreSQL features. Replication/HA choices,
connection pooling, upgrade (`pg_upgrade`/dump-reload), alerting and administration runbooks must be
owned by the company operator and included in the restore drill.

**IDEA implication:** PostgreSQL is a strong candidate for authoritative metadata, Audit and outbox
transactions while Artifact bytes remain outside the database. **Qualification:** operator skill,
replication/HA choice, encryption/key operations, backup restore and Japanese search behavior.
**Decision status:** `NOT-RUN`; not approved.

### 6.2 SQL Server 2025

`OFFICIAL-LIFECYCLE-LICENSING`: SQL Server 2025 is GA on 2025-11-18, mainstream-supported to
2031-01-07 and extended-supported to 2036-01-07. Windows and Linux are supported. SQL Server 2025
packages support Ubuntu 24.04 (from CU1); no official evidence in the current matrix establishes
Ubuntu 26.04 support ([lifecycle](https://learn.microsoft.com/en-us/lifecycle/products/sql-server-2025), [Ubuntu quickstart](https://learn.microsoft.com/en-us/sql/linux/install-upgrade/quickstart-install-ubuntu?view=sql-server-ver17)).

Express is free but has the documented 1-socket/4-core, 1,410 MB buffer-pool and 10 GB relational
database limits. Standard and Enterprise have materially different Always On availability-group
features; Express has no equivalent HA feature. Developer is for development/test, not production
([edition matrix](https://learn.microsoft.com/en-us/sql/linux/sql-server-linux-editions-and-components-2025?view=sql-server-ver17)).
Full recovery supports log backups and point-in-time restore; Express defaults to simple recovery,
which excludes log backups/PITR and several HA features ([recovery models](https://learn.microsoft.com/en-us/sql/relational-databases/backup-restore/recovery-models-sql-server?view=sql-server-ver17)).
SQL Server Full-Text Search documents more than 50 languages, including Japanese, but language
support is not proof of IDEA's exact contains/folding/permission/sort contract
([Full-Text Search](https://learn.microsoft.com/en-us/sql/relational-databases/search/full-text-search?view=sql-server-ver17)).

SQL Server administration also carries edition-specific security, backup, monitoring, patch/CU and
Always On configuration work. Tooling and Windows/Linux support are mature vendor surfaces, but the
chosen edition, production license, backup target, keys and operator skill still determine the real
cost and recovery result.

**IDEA implication:** SQL Server is a real comparator where company DBA/support and existing
operations materially reduce risk. **Qualification:** production edition/license, Ubuntu/Windows
matrix, HA/restore, FTS semantics and operator ownership. **Decision status:** `NOT-RUN`.

### 6.3 Core v0 search posture

Start by qualifying a relational Discovery Projection before adding a dedicated search service. Both
databases can plausibly provide exact ID/Business Number lookup, title/name predicates, metadata
filters, deterministic sort, paging and permission predicates with ordinary indexes. That is an
`IDEA-INFERENCE`, not a pass.

The search slice must include Vietnamese and Japanese text, case folding, width normalization,
Unicode normalization, `contains` behavior, stale/rebuildable projections and concurrent permission
changes. PostgreSQL ICU/`pg_trgm` and SQL Server FTS are alternatives, not interchangeable semantics.

A dedicated OpenSearch/Elasticsearch/Lucene service is justified only if measured evidence shows a
named trigger such as: required p95/p99 latency cannot be met with the relational projection after
index/query tuning; recall/precision for the approved corpus is unacceptable; index size or rebuild
window exceeds an agreed limit; or change-feed/recovery requirements cannot be met. Until then,
adding a second indexing authority increases deployment, security, backup and reconciliation cost.

## 7. Persistence-layer decision evidence

### 7.1 Java options

| Option | Strengths for IDEA | Risks/limits | Bounded recommendation |
|---|---|---|---|
| Hibernate ORM / JPA | Unit-of-work, optimistic/pessimistic locking, entity mapping and mature transaction integration | N+1/query surprises, implicit flushes and aggregate mapping can hide SQL; bulk paths need care | `QUALIFICATION REQUIRED`; use only with explicit aggregate/query rules |
| Spring Data JPA | Repository conventions, JPA/Envers integration and Boot support | Does not remove JPA fetch/locking/migration decisions | Candidate for straightforward aggregate owners, not generic CRUD authority |
| jOOQ | Explicit SQL, PostgreSQL features, generated schema types and predictable complex queries | Stable OSS `3.21.8` supports Java 21; jOOQ 3.22 Java 25 support is listed as TBA/preview, and commercial editions have separate licensing ([jOOQ support matrix](https://www.jooq.org/download/support-matrix-jdk), [notes](https://www.jooq.org/notes), [licensing](https://www.jooq.org/legal/licensing)) | `QUALIFICATION REQUIRED`; choose Java 21-compatible OSS or costed commercial Java 25 path only after license/support review |
| Spring JDBC / `JdbcClient` | Explicit SQL and transaction control with low mapping magic | More mapping code and schema discipline | Good for owner-specific queries and outbox/locking paths |
| Spring Data JDBC | Aggregate-oriented mapping with less ORM behavior | Limited relationship/query model for complex structures | Candidate for bounded aggregates, not all IDEA data |
| Hybrid | JPA/Data JDBC for simple aggregates plus jOOQ/JDBC for search, locking, bulk and outbox | Two mapping styles and migration/test discipline | Allowed only with a per-module ownership rule and diagnostics |

**Fact:** no persistence library supplies IDEA's transaction boundary, owner authority, outbox or
recovery semantics. **Recommendation:** compare a named hybrid against a named single approach;
do not choose JPA because Boot supports it. **Decision status:** `NOT-RUN`.

### 7.2 .NET options

| Option | Strengths for IDEA | Risks/limits | Bounded recommendation |
|---|---|---|---|
| EF Core 10 + Npgsql | Migrations, LINQ, change tracking, optimistic concurrency and PostgreSQL transactions | Query translation surprises, tracking/N+1 and provider-specific feature timing | Candidate baseline for ordinary aggregate owners after exact-version build |
| Dapper | Explicit SQL and low mapping overhead | No aggregate/unit-of-work policy by itself; easy to scatter ownership | Use only in named read/bulk paths with module-owned SQL and tests |
| Raw Npgsql | Exact PostgreSQL protocol/features, streaming and copy/bulk control | Highest application responsibility for mapping, retries and diagnostics | Use for named multi-GB/outbox/search paths where measurements require it |
| Hybrid EF + Dapper/raw | Can match tool to query shape | Multiple conventions and transaction/migration traps | Allowed only with an explicit per-module ownership table |

**Fact:** EF Core 10 and Npgsql 10.x are not interchangeable version guarantees. **Recommendation:**
start with EF Core/Npgsql for authoritative aggregates and add Dapper/raw Npgsql only where a
measured path needs it. **Qualification:** transaction scope, optimistic/pessimistic locks, bulk
streaming, migrations, provider patching and outbox tests. **Decision status:** `NOT-RUN`.

## 8. Identity, account and authorization boundary

### 8.1 .NET account path

ASP.NET Core Identity provides users, passwords, roles/claims, hashing, lockout, security stamps,
recovery and cookie/API plumbing. Microsoft recommends secure cookies for browser applications. Its
built-in API bearer token is proprietary to the ASP.NET Core Identity platform: it is not JWT,
OAuth or OIDC, and a separate standards-compliant identity provider/component is required for those
contracts ([Identity API authorization](https://learn.microsoft.com/en-us/aspnet/core/security/authentication/identity-api-authorization?view=aspnetcore-10.0), [Identity configuration](https://learn.microsoft.com/en-us/aspnet/core/security/authentication/identity-configuration?view=aspnetcore-10.0)).

**IDEA implication:** a secure same-site cookie plus CSRF controls is the initial Web candidate.
Desktop/Workspace credentials still need secure local storage, expiry/refresh, revocation, device
and Workspace binding, reauthentication and logout behavior. The built-in Identity schema is not
the product's Principal–Role–Scope model.

### 8.2 Java account path

Spring Security `7.1.1` provides authentication, password encoders, session fixation protection,
CSRF, concurrent-session controls and logout/session invalidation primitives. Spring Session JDBC
can persist sessions; OAuth2/OIDC client/resource-server support is a separate configured feature
([session management](https://docs.spring.io/spring-security/reference/7.0/servlet/authentication/session-management.html), [CSRF](https://docs.spring.io/spring-security/reference/servlet/exploits/csrf.html), [Spring Session](https://docs.spring.io/spring-session/reference/)).

Spring Security is a framework, not an IDEA Account domain. IDEA must own stable Actor, Account,
Login Identity, eligibility/version, recovery evidence, Audit and Access Policy records. The server
must establish Actor from the authenticated session/token; never trust a client-supplied ActorId.
Authorization resolves IAM eligibility, Project/Group membership, Role Definition versions and
scope hierarchy, then owner business gates and commit-time revalidation determine the outcome.

**Decision status:** both account paths are `NOT-RUN`; future company OIDC remains a separate
integration decision.

## 9. Client and Workspace candidates

### 9.1 Windows native shell

Microsoft recommends WinUI 3/Windows App SDK for new native Windows apps. WPF is a mature Windows
framework with a different lifecycle and deployment profile. Neither recommendation proves lower
IDEA risk. Both can host WebView2, launch external Office/CAD applications through the Windows shell,
use native/COM interop and protect a separately installed Workspace process.

The comparison must include DPI/scaling, keyboard/focus, accessibility/high contrast, no-admin
installation, MSIX versus traditional installer, update/rollback with dirty local work, WebView2
runtime presence and per-user process custody. Windows App SDK servicing is independent of .NET LTS.

### 9.2 Browser + signed Workspace agent

Edge Local Network Access (LNA) governs/prompts public-origin requests to local/loopback targets;
the documented loopback allowlist policy applies to Edge `146+`, and enterprise policies can
allowlist matching origins. A localhost endpoint plus CORS is not an
authentication model. The agent channel must test secure context/TLS, authenticated loopback,
origin allowlisting, anti-CSRF, DNS-rebinding defense, one-time pairing, replay protection and
cross-user/cross-Workspace refusal ([Edge LNA](https://learn.microsoft.com/en-us/deployedge/ms-edge-local-network-access), [loopback policy](https://learn.microsoft.com/en-us/deployedge/microsoft-edge-policies/loopbacknetworkallowedforurls)).

Alternatives are: authenticated loopback; an extension + native-messaging host (requires installed
extension/registration); one-time custom-protocol launch coordinated with the Server; or an
installed WebView2 shell. Each has different enterprise-policy and installer ownership. If this
option removes the required Desktop/Web-rendered Desktop surface, the disposition is
`FOLLOW-UP PRODUCT DECISION REQUIRED`.

### 9.3 Tauri/Rust

Tauri 2's capability/permission model scopes commands by window/WebView/origin and its updater
requires signatures; those controls do not make insecure Rust code or an unpatched WebView safe.
Sidecars, MSI/NSIS and WebView2 bootstrap are available. Updater signatures are not Windows
Authenticode or enterprise trust. Rust's six-week stable cadence has no multi-year LTS contract.

Carry Tauri as a challenger only if the same G1–G10 custody, IPC, native integration, installer and
team tests pass. Do not use generic package-size/RAM claims.

### 9.4 JavaFX

Oracle's 2026 Java Verified Portfolio change means the old statement “Oracle excludes JavaFX from
support” is no longer correct. JavaFX 25/JDK 25 has a documented Oracle support path to Sep 2030,
and Gluon has a separate commercial LTS path. JavaFX still uses WebKit rather than WebView2 and its
Java/JS bridge, installer/update, per-user IPC, accessibility and CAD/Office behavior remain
`QUALIFICATION-UNKNOWN`. Corrected support evidence does not select JavaFX.

## 10. Deployment and topology

Ubuntu 24.04 LTS has standard security maintenance to May 2029; Ubuntu 26.04 LTS to May 2031.
.NET 10 is supported on both. SQL Server 2025 has an official Ubuntu 24.04 path, while the exact
SQL Server 2025 + Ubuntu 26.04 combination is currently `QUALIFICATION-UNKNOWN`. PostgreSQL 18's
packaging and support must be tested on the chosen distro. Windows Server 2025 remains the current
LTSC Windows host candidate with a separate 5+5 servicing clock.

For Core v0, compare the following topologies rather than treating Docker/Compose or Kubernetes as
mandatory:

| Topology | What it buys | What must be qualified |
|---|---|---|
| Native Server package + directly managed DB | Fewer container/storage layers for one operator | Service account, patch/rollback, secrets, logs, startup and backup |
| Containerized Server + managed/direct DB | Repeatable image and isolated runtime | Image provenance, volume durability, restore, secrets, startup ordering |
| One company-managed VM | Simple initial operations and bounded failure domain | It is a candidate, not a production capacity claim; restore and failure-domain tests required |
| Separate DB/storage host | Independent I/O/backup and future scaling | Network/auth latency, patch coordination and operator burden |
| Separate Windows Format Worker | License/OS/resource isolation for CAD/Office/converters | Candidate custody/output contract, queue/retry, license and worker health |
| Kubernetes/HA cluster | Platform-level scheduling/scale when a real need exists | No current IDEA requirement or operator evidence; do not add by default |

Backup must cover relational state, immutable Artifact custody, configuration/policy and required
cryptographic material, with off-primary storage and a measured restore drill. One VM is not
“production-ready” merely because the account count is small.

## 11. System-level finalists

### Candidate A — Unified .NET

**Fact:** .NET 10/ASP.NET Core, PostgreSQL 18 or SQL Server 2025, React/TypeScript Web and a
.NET Windows Workspace form a coherent candidate. WinUI/WPF remains an internal client comparison;
WebView2 is a separate lifecycle.

**IDEA implication:** A minimizes primary language/runtime families and has the strongest currently
documented Windows IPC/credential/native path. It does not prove lower server latency, lower total
cost or better product architecture.

**Recommendation:** carry A to the shared vertical slice with explicit module-boundary checks,
EF/Npgsql ownership and Web/Workspace security tests.

**Qualification:** Q-01–Q-14 below; company support and deployment policy.

**Decision status:** `NOT-RUN`; not approved.

### Candidate B — Java Server + .NET Windows Workspace

**Fact:** Java 25/Spring Boot 4.1.x/Spring Modulith plus React Web and a .NET Workspace is coherent;
the Server and Workspace contracts are language-neutral.

**IDEA implication:** B has criterion-level advantages in explicit module verification and the
Spring Integration/Batch ecosystem, while paying a second runtime-family cost. It retains the
lowest-unknown Windows Workspace path.

**Recommendation:** carry B as a first-class alternative when the company can own the named Java
distribution/support path and the Boot BOM.

**Qualification:** exact Java/Boot/DB driver build, persistence hybrid, account/session path,
container image and shared Server slice.

**Decision status:** `NOT-RUN`; not approved.

### Client challenger — Browser + agent / Tauri

**Fact:** a managed React browser plus signed agent avoids an embedded privileged renderer; Tauri
2.11.5 + Rust 1.98.1 supplies a WebView2 shell and scoped bridge.

**IDEA implication:** Browser + agent can reduce UI duplication, but browser policy/LNA and installer
coordination become central. Tauri can reuse React but adds Rust/toolchain and updater ownership.

**Recommendation:** retain S1 and S2 as challengers only when they do not silently remove a required
surface and when G1–G10 pass.

**Qualification:** authenticated local channel, cross-user isolation, dirty-workspace-safe update,
CAD/Office launch/save and team operations.

**Decision status:** `NOT-RUN`; no client winner.

## 12. Qualification backlog

All rows are `NOT-RUN`. The owner and threshold must be agreed before execution; an experiment plan
is not a PASS.

| ID / question | Candidates | Preconditions | Exact test | Evidence produced | Threshold / owner | Status |
|---|---|---|---|---|---|---|
| `Q-01` Server vertical slice | A, B | Same API contract, schema, storage and TLS | Implement authenticated Check-out/Reference/Check-in/Release slice with immutable Generation, AuthorizationDecision, commit-time revalidation, outbox and idempotent retry | Source, migration, trace, audit/outbox rows, failure log | All-or-none owner outcome; Product/Tech reviewers | `NOT-RUN` |
| `Q-02` DB transaction/concurrency | PostgreSQL 18, SQL Server 2025; A/B | Same fixture and isolation goals | Run conflicting Reservation/Generation/Release operations, optimistic/pessimistic locks, deadlock/timeouts and retry | SQL plans, lock graphs, terminal states, p95 timings | No lost update or unauthorized commit; Data/Tech owner | `NOT-RUN` |
| `Q-03` Search Unicode/JA | PostgreSQL projection, SQL Server projection | Approved corpus and permission model | Exact ID/title/filter/sort/page queries in Vietnamese/Japanese; case/width/normalization/contains; rebuild after change | Recall/precision set, query plans, p95/p99, rebuild duration | Contract thresholds pre-approved; Product/Data owner | `NOT-RUN` |
| `Q-04` Multi-GB transfer/custody | A, B, S1, S2, S3 | Representative 1/5/10+ GB files and failure injector | Stream upload/download with digest, interrupt network/process/power, resume missing ranges, duplicate OperationId | Digests, journal, memory/RSS, orphan/candidate report | No byte corruption/duplicate publish; Workspace owner | `NOT-RUN` |
| `Q-05` Outbox/idempotency | A, B | Same DB and event contract | Crash before/after commit and during delivery; duplicate and reordered delivery; same key/different input | DB transaction log, event IDs, consumer dedupe, replay report | Exactly one authoritative outcome; Integration owner | `NOT-RUN` |
| `Q-06` Account/session revocation | A, B | Cookie/token policy and two sessions | Login, fixation, CSRF, concurrent sessions, logout, revoke, expiry, reauthentication and Workspace binding | Security traces, session table, denial evidence | Revoked session cannot command owner operation; Security owner | `NOT-RUN` |
| `Q-07` Backup/restore | PostgreSQL, SQL Server; chosen topology | Off-primary backup target and keys | Restore DB + Artifact + config/policy + crypto material; replay outbox; simulate severe failure | Restore transcript, RTO/RPO, integrity report | RTO ≤4 working hours/RPO ≤1 hour only if approved measurement confirms; Operations owner | `NOT-RUN` |
| `Q-08` Windows Workspace IPC | .NET, Rust, JavaFX candidates | Two Windows users, two Workspaces, elevated/non-elevated processes | Attempt cross-user, cross-Workspace, replayed, oversized and wrong-version messages; test reconnect | ACL/config, protocol traces, refusal evidence | No unauthorized read/command; Security/Workspace owner | `NOT-RUN` |
| `Q-09` Office/IRONCAD open/save | A/B Workspace and client challengers | Exact company app/OS/bitness fixtures | Materialize verified file, launch by OS association, edit/save/close externally, detect stale/in-use/error without add-in | App/version matrix, custody journal, state mapping | No overwrite or false success; Workspace/Product owner | `NOT-RUN` |
| `Q-10` Client install/update/rollback | WPF, WinUI, browser agent, Tauri, JavaFX | Clean company images, signer and offline policy | Install per-user/admin, missing WebView2, online/offline update, dirty Workspace, forced failure, rollback/version skew | Installer logs, signatures, SBOM/license inventory, preserved local work | Signed, recoverable, policy-compliant; Release/IT owner | `NOT-RUN` |
| `Q-11` Web/native attack surface | WebView2, browser agent, Tauri, JavaFX | Threat model and test origins | Test navigation/redirect/iframe/popup/forged messages; LNA, CSRF, DNS rebinding, hostile origin, custom protocol replay | Security test report and policy settings | No generic filesystem/shell/host object; Security owner | `NOT-RUN` |
| `Q-12` Observability/incident diagnosis | A, B, clients | Common telemetry schema and redaction policy | Inject transfer failure, deadlock, auth denial, outbox lag and worker crash; diagnose from logs/metrics/traces/JFR/EventPipe | Dashboard, trace correlation, incident runbook and time-to-diagnose | Agreed diagnosis time/cardinality; Operations owner | `NOT-RUN` |
| `Q-13` Team/toolchain maintainability | A, B, S1, S2 | Named maintainers and support owners | Build/patch/debug the same slice, rotate an incident, update dependencies and reproduce build | Time/steps, patch inventory, SBOM, support cost and unresolved defects | Thresholds agreed by management; Engineering owner | `NOT-RUN` |
| `Q-14` DB/platform compatibility | Java/.NET × PostgreSQL/SQL Server × Ubuntu/Windows | Candidate container/native images | Build and restore exact matrix, including SQL Server 2025 + Ubuntu 24.04/26.04 and chosen Java distribution | Image SBOM, package/lifecycle matrix, restore logs | No unsupported production combination; Platform owner | `NOT-RUN` |

Mandatory product, security and custody failures remove a candidate until corrected. Resource,
maintainability and cost measurements rank survivors; they do not create an automatic numeric score.

## 13. Synthesis disposition

### Facts

- Java/Spring and .NET/ASP.NET Core are both credible Server runtimes for the known IDEA envelope.
- Java has a criterion-level advantage in first-party module verification and integration/batch
  breadth; .NET has a criterion-level advantage in Windows Workspace primitives and runtime
  consolidation.
- PostgreSQL 18 is a strong database candidate; SQL Server 2025 remains a materially different,
  supportable comparator. Neither is approved.
- React + TypeScript + Vite can support a client-only SPA backed by a separate Server; SSR/RSC is
  not established as an IDEA need.
- JavaFX support evidence was corrected, but JavaFX client integration remains unqualified.

### Current research recommendations

- Carry Candidate A and Candidate B to the same Server/database/identity/restore qualification.
- Carry browser + signed agent and Tauri/Rust as client challengers, preserving the Desktop surface
  decision boundary.
- Start search with a rebuildable relational projection and add a dedicated search service only on a
  measured trigger.
- Use explicit per-module persistence ownership and do not make a generic Transaction Coordinator or
  Artifact Custody module a new CRUD authority.
- Name runtime distributions, BOMs, database editions, support contracts and patch calendars before
  a Tech proposal is reviewable.

### Qualification and decision status

All qualification rows are `NOT-RUN`. Relative performance, total cost, company skill, support SLA,
OS/DB combinations, client integration and recovery are `UNKNOWN` until the tests produce evidence.
No overall stack winner exists in this research artifact. A final selection remains
`FOLLOW-UP PRODUCT DECISION REQUIRED` and must be recorded through the repository Tech/PG process.

## 14. Source ledger

The five dated notes retain their historical source dates and detailed limitations:

1. [Aras and DDM technology evidence](2026-09-11-aras-ddm-technology-stack-evidence.md) —
   `COMPETITOR-OBSERVATION`.
2. [Enterprise integration and deployment evidence](2026-09-11-enterprise-integration-deployment-evidence.md) —
   standards, guidance and public-practice evidence.
3. [Java/.NET scale evidence](2026-09-11-java-dotnet-scale-evidence.md) — criterion-level Server
   comparison; no overall winner.
4. [Java versus .NET IDEA evidence](2026-09-11-java-vs-dotnet-idea-evidence.md) — corrected
   JavaFX and scope-limited client/runtime comparison.
5. [Greenfield Desktop/Workspace evidence](2026-09-12-greenfield-desktop-workspace-stack-evidence.md) —
   corrected Windows App SDK, JavaFX, browser-agent, Tauri and current frontend facts.

Primary current-source groups used by this synthesis:

- [PostgreSQL versioning](https://www.postgresql.org/support/versioning/), [PostgreSQL 18 docs](https://www.postgresql.org/docs/18/), [PostgreSQL PITR](https://www.postgresql.org/docs/18/continuous-archiving.html), [ICU collations](https://www.postgresql.org/docs/current/collation.html), [text parser](https://www.postgresql.org/docs/18/textsearch-parsers.html), [pg_trgm](https://www.postgresql.org/docs/18/pgtrgm.html).
- [SQL Server 2025 lifecycle](https://learn.microsoft.com/en-us/lifecycle/products/sql-server-2025), [Linux release notes](https://learn.microsoft.com/en-us/sql/linux/sql-server-linux-release-notes?view=sql-server-ver17), [editions/components](https://learn.microsoft.com/en-us/sql/linux/sql-server-linux-editions-and-components-2025?view=sql-server-ver17), [recovery models](https://learn.microsoft.com/en-us/sql/relational-databases/backup-restore/recovery-models-sql-server?view=sql-server-ver17), [Full-Text Search](https://learn.microsoft.com/en-us/sql/relational-databases/search/full-text-search?view=sql-server-ver17).
- [Oracle Java roadmap](https://www.oracle.com/java/technologies/java-se-support-roadmap.html), [Oracle FAQ](https://www.oracle.com/java/technologies/javase/jdk-faqs.html), [Temurin support](https://adoptium.net/support/), [Spring Boot requirements](https://docs.spring.io/spring-boot/system-requirements.html), [Spring Boot coordinates](https://docs.spring.io/spring-boot/appendix/dependency-versions/coordinates.html), [Spring Modulith](https://spring.io/projects/spring-modulith), [Spring Security](https://docs.spring.io/spring-security/reference/), [Spring Data](https://spring.io/projects/spring-data/).
- [.NET support policy](https://dotnet.microsoft.com/en-us/platform/support/policy), [EF Core 10](https://learn.microsoft.com/en-us/ef/core/what-is-new/ef-core-10.0/whatsnew), [Npgsql compatibility](https://www.npgsql.org/doc/compatibility.html), [ASP.NET Identity bearer semantics](https://learn.microsoft.com/en-us/aspnet/core/security/authentication/identity-api-authorization?view=aspnetcore-10.0), [Windows App SDK downloads](https://learn.microsoft.com/en-us/windows/apps/windows-app-sdk/downloads), [WebView2 Evergreen/Fixed](https://learn.microsoft.com/en-us/microsoft-edge/webview2/concepts/evergreen-vs-fixed-version).
- [React versions](https://react.dev/versions), [React 19.3](https://react.dev/blog/2026/09/09/react-19-3), [TypeScript 5.9](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-9.html), [Vite releases](https://vite.dev/releases), [Edge LNA](https://learn.microsoft.com/en-us/deployedge/ms-edge-local-network-access), [Tauri releases](https://v2.tauri.app/release/), [Rust releases](https://blog.rust-lang.org/releases/).
- [Ubuntu release cycle](https://ubuntu.com/about/release-cycle), [Windows Server release information](https://learn.microsoft.com/en-us/windows/release-health/windows-server-release-info), [Oracle JavaFX roadmap](https://www.oracle.com/java/technologies/jvp-support-roadmap.html), [Gluon JavaFX support](https://gluonhq.com/services/javafx-support/).

The current-source URLs above are the authoritative pages used for the `2026-09-13` research pass;
their individual publication/release dates control, while the linked dated notes explicitly retain
earlier historical snapshots. A source establishes only the scope shown in its row; no source is
used to infer undisclosed competitor internals or an IDEA requirement.

## 15. Non-impact statement

This artifact makes **No Product Scope Change**. It changes no FTR, REQ, Feature, Spec, Tech
approval, architecture semantics, DOC-01…DOC-08 meaning, DDM capability semantics, ADR decision,
`SPEC-OPEN` status or PG gate state. It declares neither PG3 nor PG4 PASS. All unresolved technology
and qualification decisions remain explicitly open.
