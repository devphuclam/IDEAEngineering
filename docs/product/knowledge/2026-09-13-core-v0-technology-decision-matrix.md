# IDEA Engineering Core v0 Technology Decision Matrix

| Control field | Value |
|---|---|
| Stable knowledge ID | `IE-KNW-TECH-DEC-001` |
| Document class | `IE-KNW` controlled engineering decision artifact |
| Title | IDEA Engineering Core v0 Technology Decision Matrix |
| Version | `0.1` |
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
| Applicable product baseline | `IDEA-C1-ANALYSIS-DESIGN-001`; DOC-01@0.6, DOC-02@0.2, DOC-03@0.7, DOC-04@0.13, DOC-05@0.16, DOC-06@0.16, DOC-07@0.6, DOC-08@0.12, GOV@0.3, VVP@0.16, accepted ADRs |
| Source / upstream trace | [`IE-RES-TECH-20260913-001`](../../research/2026-09-13-technology-selection-evidence-synthesis.md); dated technology notes; [`CONTEXT.md`](../../../CONTEXT.md); [`DOC-04`](../instances/idea-engineering/DOC-04-software-requirements-specification.md); [`DOC-05`](../instances/idea-engineering/DOC-05-architecture-description.md); [`DOC-06`](../instances/idea-engineering/DOC-06-data-integration-and-migration-specification.md); [`DOC-08`](../instances/idea-engineering/DOC-08-ui-ux-and-interaction-specification.md); accepted ADRs; [`IE-STD-AUTH-001@0.2`](../../agents/product-document-authoring-standard.md); [`standards register`](../../governance/standards-register.md) |
| Downstream trace | [`TECH-001@0.9`](../instances/idea-engineering/decision-briefs/TECH-001-technology-and-architecture-proposal.md); instance catalogue; version history; [`IE-CHG-TECH-DEC-001`](../instances/idea-engineering/registers/CHG-2026-09-13-technology-decision-recommendation.md); future qualification records |
| Change record | [`IE-CHG-TECH-DEC-001@0.1`](../instances/idea-engineering/registers/CHG-2026-09-13-technology-decision-recommendation.md); new artifact, no predecessor |
| Supersedes / Superseded by | Supersedes `NOT-APPLICABLE`; superseded by `NOT-APPLICABLE` |
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
Primary/official evidence
        ↓
IE-RES-TECH-20260913-001 (informative synthesis)
        ↓
IE-KNW-TECH-DEC-001 (engineering recommendation)
        ↓
TECH-001 (management decision view)
        ↓
Product Decision Authority approval (NOT-RUN)
```

The recommendation optimizes for correctness, maintainability, Windows engineering integration,
transaction integrity, recovery, security, modular boundaries and a small operating team. It does
not optimize for theoretical maximum scale. Approximately 50–100 intended users is context, not a
concurrency or capacity guarantee. Multi-GB Artifacts remain outside the relational database.

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
| Server language/runtime | `SELECT` | C# / `.NET 10 LTS` | One primary runtime family for Server, Desktop shell and Workspace. Use a supported `.NET 10.x` patch current at qualification; Q-01, Q-12 and Q-13 remain `NOT-RUN`. |
| Server framework | `SELECT` | ASP.NET Core 10 / Kestrel | HTTPS JSON endpoints, hosted background workers and diagnostics. Module boundaries are enforced by solution/project references, analyzers and architecture tests; the framework does not supply IDEA ownership automatically. |
| Architecture style | `SELECT` | Deep-module modular monolith | One deployable Server with explicit owner Modules and narrow Interfaces; no generic CRUD authority and no service-per-module requirement. Extraction remains a measured future option. |
| Database | `SELECT` | PostgreSQL 18 (major line) | Metadata, authorization, workflow, structure, Audit, search projection and outbox. Use the supported minor current at qualification (18.6 was the evidence-date minor); Q-02, Q-07 and Q-14 are `NOT-RUN`. |
| Persistence | `SELECT` | EF Core 10 + Npgsql EF provider 10.x for ordinary owner aggregates; bounded raw Npgsql for named streaming/locking/bulk/search/outbox paths | One per-module ownership rule and shared relational UoW where the architecture requires atomic business outcomes. Dapper is not the default. Provider compatibility is tested, not inferred from matching version numbers. |
| Schema migration | `SELECT` | EF Core reviewed migration bundles; expand–migrate–contract | One schema authority. Migrations run as an explicit release/preflight operation, are idempotent and reviewed; no automatic destructive down migration. Rollback uses forward repair or database restore, not an assumption that application rollback reverses schema. |
| Account/authentication | `SELECT` | ASP.NET Core Identity for IDEA Login Identity, credentials, lockout, recovery and session primitives; custom stable Actor/Account domain records | Web uses secure HttpOnly, SameSite cookies plus CSRF protection. Server/IAM establishes `ActorContext`; a client-supplied ActorId is never trusted. Desktop bootstrap, refresh, revocation and DPAPI storage are Q-06/Q-08 `NOT-RUN`. |
| Authorization | `SELECT` | IDEA Access Policy module | Product authority evaluates server-established ActorContext, IAM eligibility, Project/Group membership, Role Assignments, Role Definition versions and scope hierarchy; owner business gates and commit-time revalidation follow. Framework roles/claims are not the product RBAC model. |
| API | `SELECT` | Versioned HTTPS JSON REST with OpenAPI 3.1 contract | Server remains authoritative. Stable Resource/Operation IDs, explicit expected-state fields and idempotency keys are required at the contract level; no direct database access from clients. Tooling compatibility remains Q-01/Q-14 `NOT-RUN`. |
| Integration publication | `SELECT` | Transactional outbox in PostgreSQL + bounded hosted dispatcher + per-system Adapter | Audit evidence/outbox and authoritative owner outcome commit in the declared relational UoW. Consumers are idempotent and tolerate duplicate/reordered delivery. No broker is mandatory initially. |
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
| Server OS | `SELECT` (conditional) | Ubuntu Server 26.04 LTS | Honors the current-LTS preference and fits `.NET` + PostgreSQL. Q-14 must prove every selected package/backup/monitoring component is officially supported. Ubuntu Server 24.04 LTS is the supported fallback if that matrix is not qualified; Windows Server 2025 is the company-policy fallback. |
| Deployment packaging | `SELECT` | Versioned Debian package(s) + systemd services; configuration/secrets outside package | Native deployment minimizes storage and recovery layers for one operator. Release preflight, signed artifact/SBOM, migration bundle, health checks and recoverable rollback are required; exact IT signing/admin policy is Q-10/Q-14 `NOT-RUN`. |
| Reverse proxy / TLS posture | `SELECT` | Company-approved Nginx baseline in front of HTTPS Server; managed certificate and modern TLS policy | No claim that Nginx itself supplies identity or authorization. Certificate custody, headers, origin policy and renewal runbook are Q-06/Q-11/Q-14 `NOT-RUN`. |
| Background processing | `SELECT` | ASP.NET Core hosted workers for bounded outbox/maintenance jobs; Format Worker remains separate | Jobs have Operation IDs, leases/retry limits and idempotent handlers. Kafka/RabbitMQ/Redis are not required for the initial workload. |
| Observability | `SELECT` | OpenTelemetry SDK/instrumentation for .NET and Web + structured JSON logs + metrics/traces via OTLP; `dotnet-monitor`/EventPipe for diagnostics | Audit Evidence remains a separate authoritative record. Export backend/retention is replaceable and company-selected; cardinality, redaction and incident runbook are Q-12 `NOT-RUN`. |
| Backup/recovery posture | `SELECT` (qualification-gated) | PostgreSQL base backup + WAL/PITR, coordinated Artifact/config/policy/key backup, off-primary controlled target | Restore must produce a mutually usable DB + Artifact + configuration/key point. One VM is not HA. RTO ≤4 working hours and RPO ≤1 hour remain preliminary objectives and Q-07 `NOT-RUN`. |

## 2A. Decision register: why each selected layer is conditional but concrete

The stack table is the compact view. This register makes the decision, evidence class, trade-off,
remaining qualification and reconsideration trigger explicit for every selected layer. A trigger is
not an expectation that the selection will change; it is the controlled point at which Engineering
would reopen it.

| Selected layer | Decision and evidence | Main trade-off | Qualification still required | Reconsideration trigger |
|---|---|---|---|---|
| Server language/runtime | Select C#/.NET 10 LTS; `OFFICIAL-LIFECYCLE-LICENSING` plus `IDEA-INFERENCE` on Windows-runtime consolidation | Java has stronger documented module/integration breadth; .NET adds Microsoft lifecycle dependency | Q-01, Q-12, Q-13 and named patch/SBOM runbook | Same-fixture Java slice materially wins correctness/support/cost or a mandatory Spring contract appears |
| Server framework | Select ASP.NET Core 10/Kestrel; `OFFICIAL-PRODUCT-FACT` and .NET candidate evidence | Framework primitives do not enforce IDEA Module ownership automatically | Architecture tests, Q-01 and diagnostics run | Required protocol/diagnostic gap cannot be closed without disproportionate custom code |
| Architecture style | Select deep-module modular monolith; accepted ADRs + `OFFICIAL-GUIDANCE-PATTERN` + `IDEA-INFERENCE` | One process is a shared failure domain and needs disciplined boundaries | Boundary checks in Q-01/Q-13 and restore/incident evidence | Measured independent scale/isolation or independently staffed Module justifies extraction |
| Database | Select PostgreSQL 18; `OFFICIAL-PRODUCT-FACT`/lifecycle/license plus `IDEA-INFERENCE` | Company must own PostgreSQL operations, collation and backup expertise | Q-02, Q-03, Q-07, Q-14 and production edition/support disposition | SQL Server estate has documented material DBA/license/restore advantage |
| Persistence | Select EF Core 10 + Npgsql with bounded raw Npgsql; synthesis §7 `OFFICIAL-PRODUCT-FACT` + `IDEA-INFERENCE` | ORM translation/tracking can hide query cost; hybrid paths add conventions | Provider pair, lock/stream/bulk/outbox tests Q-01/Q-02/Q-04/Q-05 | Repeated mandatory paths require a different owner-safe data-access strategy |
| Schema migration | Select reviewed EF migration bundles; `IDEA-INFERENCE` constrained by recovery/architecture rules | Application rollback does not undo a destructive schema change | Expand/contract rehearsal, backup/restore and migration review | Migration tooling cannot produce safe repeatable upgrades on the supported matrix |
| Account/authentication | Select ASP.NET Identity plus custom Actor/Account; official Identity guidance + DOC-05/06 boundary | Native account/session and future company login need two evolution paths | Q-06, Q-08, Q-11, secure storage and revocation | Company identity mandate or native-session threat result makes the path unacceptable |
| Authorization | Select IDEA Access Policy; accepted architecture/data contracts + `IDEA-INFERENCE` | Product policy engine remains custom and must not be replaced by framework roles | Q-01/Q-06/Q-11 authorization/refusal evidence | A later approved policy authority changes the ownership contract |
| API | Select versioned HTTPS JSON REST/OpenAPI 3.1; `INDUSTRY-SPECIFICATION` + architecture fit | HTTP versioning and large-transfer controls require explicit design | Q-01/Q-04 contract, streaming and TLS tests | Named integration needs a materially different protocol with approved contract |
| Integration publication | Select transactional outbox + bounded dispatcher/Adapters; `OFFICIAL-GUIDANCE-PATTERN` + architecture inference | In-process delivery has finite throughput and retry ownership | Q-05 and consumer contract tests | Measured delivery volume/isolation or company platform requires a broker |
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
| Server OS | Select Ubuntu 26.04 LTS conditional; lifecycle facts + user context + `IDEA-INFERENCE` | Complete-stack package/support evidence is not yet demonstrated | Q-14; fallback 24.04/Windows policy disposition | Any selected component lacks official support or IT rejects Linux |
| Deployment packaging | Select Debian package + systemd; topology/operations guidance + `IDEA-INFERENCE` | Native packages require careful service/secrets/rollback runbooks | Q-10/Q-14 install, patch, migration and rollback rehearsal | Company platform standard materially lowers risk for a supported container path |
| Reverse proxy/TLS | Select company-approved Nginx baseline; `IDEA-INFERENCE` deployment boundary | Certificate/header/origin operations remain company work | Q-06/Q-11/Q-14 TLS and renewal tests | Company standard proxy or managed gateway is demonstrably safer/easier |
| Background processing | Select bounded ASP.NET hosted workers; official Worker Services fact + architecture inference | In-process workers share Server failure/restart and finite throughput | Q-05/Q-12 crash, retry, lease and lag tests | Workload needs independent scheduling/isolation or a supported broker |
| Observability | Select OpenTelemetry/OTLP + structured logs/metrics/traces; official ecosystem facts | Protocol does not choose backend, retention or on-call ownership | Q-12 cardinality, redaction, correlation and incident drill | Company observability standard or diagnosis threshold cannot be met |
| Backup/recovery | Select PostgreSQL base/WAL/PITR plus coordinated off-primary copies; official PostgreSQL/NIST guidance + architecture inference | Backup of DB alone cannot restore external Artifact bytes or keys | Q-07 measured restore and integrity/RTO/RPO | Company recovery policy or measured objective requires separate HA/storage topology |

## 3. Server runtime decision — .NET is the Core v0 recommendation

### 3.1 Final disposition

| Candidate | Classification | Disposition |
|---|---|---|
| `.NET 10 LTS + ASP.NET Core 10 + C#` | `SELECT` | Recommended Core v0 Server baseline. |
| `Java 25 LTS + Eclipse Temurin 25 + Spring Boot 4.1.x` | `ALTERNATIVE` | First-class runner-up; reconsider if the explicit triggers in section 3.3 occur. Temurin support/SLA and an Oracle JDK alternative remain a qualification input. |

Both candidates are technically credible. The evidence does not establish a universal throughput,
scalability or “enterprise-grade” winner. Java has real advantages: Spring Modulith offers directly
documented module verification, and Spring Integration/Batch broaden the integration and batch
portfolio. Java 25 also gives distribution/support optionality. Those advantages do not outweigh the
Core v0 cost of introducing a second primary server runtime when the selected installed shell and
the lowest-unknown Workspace path are already .NET on Windows.

The recommendation is therefore based on operational consolidation, not a performance claim:

1. The known engineering fleet is Windows and the Workspace must handle named pipes, current-user
   isolation, DPAPI, COM/P/Invoke, external CAD/Office launch, file custody and diagnostics.
2. A .NET Server, WPF shell and .NET Workspace give one main language/runtime/toolchain family for
   the highest-risk cross-component debugging and patch runbook.
3. ASP.NET Core, EF Core/Npgsql, Worker Services and OpenTelemetry provide credible primitives for
   the modular monolith, explicit owner transactions, streaming and bounded background work.
4. A future extraction boundary is preserved by Module ownership and HTTP/event contracts; Java is
   not required to obtain scale or independent services later.
5. At 50–100 intended users and one initial site, the evidence does not justify paying the second
   server-runtime cost solely for Spring's broader integration portfolio.

This does **not** claim .NET is faster, safer by default, more enterprise-grade or cheaper in every
company. Q-01, Q-12 and Q-13 must exercise the same contract and failure cases against the selected
baseline. If Java is later selected, the Server/Workspace contract and IDEA domain boundaries remain
language-neutral.

### 3.2 Criterion-level comparison

| IDEA criterion | .NET candidate | Java candidate | Engineering reading |
|---|---|---|---|
| Owner transaction/correctness | ASP.NET Core + EF/Npgsql plus explicit relational UoW | Spring transactions plus JPA/JDBC/jOOQ | `DRAW`; Q-01/Q-02/Q-05, not framework marketing, decide. |
| Module-boundary verification | Project/assembly rules, analyzers and architecture tests must be named and run | Spring Modulith 2.1.1 gives a stronger directly documented module-check path | Java `ADVANTAGE`; .NET qualification is explicit, not hidden. |
| Integration/batch portfolio | Worker Services and named Adapters | Spring Integration/Batch are broader first-party offerings | Java `ADVANTAGE`, but no current IDEA requirement mandates that breadth. |
| Windows Workspace/native boundary | First-party .NET named pipes, DPAPI, COM/P/Invoke and diagnostics | Java Server still needs a .NET/Rust/other Windows Workspace | .NET `ADVANTAGE` at the actual highest-unknown boundary. |
| Streaming multi-GB bytes | Async streams and bounded buffers are available | Streams and bounded buffers are available | `DRAW`; Q-04 correctness and memory evidence decide. |
| Runtime families | One primary family across Server/Desktop/Workspace, plus WebView2/App SDK clocks | Java Server plus .NET Workspace and the same client clocks | .NET `ADVANTAGE` for small-team consolidation; exact patch burden remains `UNKNOWN`. |
| Lifecycle/support | Simple Microsoft .NET 10 LTS line through 2028-11-14 | JDK distribution optionality, but Spring/JDK/driver clocks must align | Java `ADVANTAGE` on optionality; support contract and patch calendar are Q-13/Q-14. |
| Identity primitives | ASP.NET Core Identity cookie/session primitives | Spring Security/session primitives | `DRAW`; IDEA Account/Actor/Access Policy remain custom either way. |
| Observability | OpenTelemetry, `dotnet-monitor`, EventPipe | OpenTelemetry, Actuator/Micrometer, JFR | `DRAW`; common redaction/runbook test Q-12. |
| Future extraction | Stateless ASP.NET nodes/workers can split after measured trigger | Stateless Spring modules/workers can split after measured trigger | `DRAW`; module ownership, not language, controls extraction. |
| Small-team support | Fewer primary runtime/toolchain families | Potentially better if the company has established Java support | `UNKNOWN`; company skill is evidence to collect, not infer. |

### 3.3 Reconsideration triggers for Java

Engineering should switch the Server recommendation only if a recorded review shows one or more of
the following, with evidence rather than preference:

- the company has a supported Java 25 distribution, Spring BOM, security/operations owner and
  incident support path that materially reduces risk;
- Q-13 shows a material, agreed maintainability/support/cost advantage for Java;
- Q-01 or Q-12 shows a mandatory .NET correctness/diagnostic gap while the equivalent Java slice
  passes;
- a future approved integration contract requires Spring-specific capability that cannot be added
  as an Adapter without disproportionate risk.

The existence of Aras/DDM or another competitor using Java/.NET/SQL Server is not, by itself, a
switch trigger. Those observations remain `COMPETITOR-OBSERVATION` evidence only.

## 4. Database, persistence and migration decision

### 4.1 PostgreSQL 18 versus SQL Server 2025

| Candidate | Classification | Why it won/lost for Core v0 |
|---|---|---|
| PostgreSQL 18 | `SELECT` | Provides the required relational transactions, row/optimistic locks, JSON and index families; has a long major support line to 2030-11-14 and license optionality; fits an Ubuntu-first topology and the selected .NET/Npgsql path. Operations, backup, collation and support still have real cost. |
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

EF Core 10 + Npgsql EF 10.x is the default authoritative persistence path for ordinary aggregate
owners. Each Module owns its mappings and queries; the Application Use-case Transaction Coordinator
only orchestrates the declared operation and shared relational UoW. It is not a generic CRUD service.

Named raw Npgsql is allowed for measured multi-GB streaming, PostgreSQL `COPY`/bulk work, locking,
search projection rebuilds and outbox delivery. It must remain inside the owning Module, use the same
transaction where required, and retain mapping/retry/diagnostic tests. Dapper is not a default second
convention. No persistence library owns IDEA's business gates, Audit outcome or recovery semantics.

EF migration bundles are the sole schema authority. A release expands schema, deploys compatible
code, migrates data, then contracts old columns only in a later controlled step. Destructive changes
require an explicit backup/restore or forward-repair plan. Application rollback and database rollback
are separate decisions.

## 5. Identity, authorization and API boundary

The selected account path keeps these identities distinct:

```text
Actor ≠ IDEA Account ≠ Login Identity ≠ Security Principal ≠ Role Assignment
```

ASP.NET Core Identity supplies credential hashing, lockout, recovery and session primitives. It does
not become the product's Principal–Role–Scope model. For the first-party Web UI, use secure HttpOnly
SameSite cookies and anti-CSRF controls. Do not describe ASP.NET Identity's proprietary bearer token
as OAuth, OIDC or JWT, and do not build an OAuth server merely to start Core v0.

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
- the shell can use the same `.NET 10` family as Workspace and Server diagnostics;
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

### 8.1 Initial logical/physical topology

```text
Company-managed Ubuntu Server 26.04 LTS VM (single, non-HA candidate)
├── Nginx / managed TLS entry
├── IDEA Server (.NET 10 modular monolith)
│   ├── owner Modules + Application Use-case Transaction Coordinator
│   ├── bounded outbox/background workers
│   └── OpenTelemetry/structured diagnostics
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

The VM is a simple initial failure domain, not HA and not a capacity claim. Native package deployment
is selected over a production container requirement because one operator has fewer storage, startup,
secret and recovery layers to own. Development may use disposable containers where convenient, but
Docker/Compose is not a production authority. Kubernetes, service mesh and a microservice fleet are
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
- `dotnet-monitor`/EventPipe or equivalent .NET diagnostics during an incident.

The repository does not select Grafana, a cloud vendor or a commercial backend. The company must
name export, retention, access and on-call ownership in Q-12/Q-13.

### 8.3 Family versus patch policy

| Family | Selected policy | Qualification/deployment rule |
|---|---|---|
| .NET / ASP.NET Core | `.NET 10 LTS` family | Deploy a supported current patch; support date and security advisories are rechecked each release cycle. |
| EF Core / Npgsql | EF Core 10 + Npgsql EF 10.x | Pin a tested compatible patch pair; do not infer provider compatibility from major numbers. |
| PostgreSQL | Major 18 | Use the current supported minor at qualification and keep a tested upgrade/restore path; no patch is a product requirement. |
| React | 19.3 major line | Pin exact package versions/lockfile and review React security advisories. |
| TypeScript | 7.0 compiler line | Use TS6 only for explicitly identified compiler-API tooling compatibility; remove the lane when dependencies support TS7. |
| Node.js | 22 LTS build line | Minimum 22.12 for Vite 8; build agents use a supported patch and reproducible lockfile. |
| Vite | 8.3 line | Pin patch and review plugin compatibility. |
| WPF / WebView2 | WPF on net10; WebView2 Evergreen | Evergreen patching is company-managed where permitted; Fixed Version requires an IDEA-owned patch calendar. |
| Ubuntu | 26.04 LTS primary; 24.04 LTS fallback | Q-14 proves the complete selected stack, backup and monitoring matrix; OS patch ownership is explicit. |
| Java alternative | Java 25 LTS + Eclipse Temurin 25 + Spring Boot 4.1.x | Not part of the selected production baseline; Temurin support/SLA, BOM, driver, support and cost remain `NOT-RUN`. |
| Dependency delivery | Lockfiles, SBOM and signed/versioned bundles | Monthly security patch review and quarterly planned updates are proposed operating cadence; management has not approved a SLA. |

# Not selected for Core v0

| Technology/approach | Classification | Why it is not the initial choice; reconsideration trigger |
|---|---|---|
| Java 25 + Spring Boot/Modulith | `ALTERNATIVE` | Strong module/integration/batch evidence, but adds a primary server runtime alongside the .NET Windows path. Reconsider on Q-01/Q-13 evidence or a supported company Java platform. |
| SQL Server 2025 | `ALTERNATIVE` | Credible and possibly better where company DBA/licensing/support already exists; no such advantage is evidenced here. Reconsider after edition/license/restore/FTS/platform qualification. |
| Ubuntu Server 24.04 LTS | `ALTERNATIVE` fallback | Retained if Ubuntu 26.04 complete-stack support is not proven; not a discarded technology. |
| Windows Server 2025 | `ALTERNATIVE` fallback | Use if company policy/support materially favors Windows or the Linux matrix fails; licensing and operations require evidence. |
| WinUI 3 / Windows App SDK | `ALTERNATIVE` | Microsoft’s new-app guidance is respected, but the separate shorter servicing clock and unrun packaging/accessibility tests make WPF lower risk for first bake. |
| Browser + signed Workspace agent only | `ALTERNATIVE` / `FOLLOW-UP PRODUCT DECISION REQUIRED` | Could reduce embedded native surface, but cannot silently remove the current Web-rendered Desktop obligation; browser-to-agent security/LNA/installer tests are unrun. |
| Tauri 2 + Rust | `ALTERNATIVE` challenger | React reuse and scoped capabilities are credible, but Rust has no multi-year LTS and adds toolchain/updater/IPC ownership. Reconsider only after G1–G10/Q-08/Q-10/Q-11 pass. |
| Electron | `REJECT FOR CORE V0` | Bundled Chromium/Node and rapid major cadence add renderer and patch ownership not justified by the current Windows scope; no claim that Electron is generally unsuitable. |
| JavaFX | `DEFER` | Corrected 2026 support evidence keeps it viable, but WebKit/React/SSO/IPC/installer/CAD behavior remains unqualified and it does not reduce the .NET Workspace boundary. |
| Qt/C++ | `DEFER` | Adds a C++/Qt licensing and toolchain boundary without a demonstrated product need or React reuse advantage. |
| TypeScript 6 as production compiler | `REJECT FOR CORE V0` | TS7 is the selected source compiler line; TS6 is retained only as a bounded tool/plugin compatibility lane. |
| Dapper as default persistence | `DEFER` | Low mapping overhead alone does not supply aggregate ownership, migrations or UoW discipline; named raw Npgsql remains available where measured. |
| jOOQ/JPA as selected Server persistence | `DEFER` | Applies to the Java branch; exact Java 25/JDK/licensing and hybrid rules are not qualified. |
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
| 1. Strongest argument against the chosen Server runtime? | Java has stronger directly documented module verification and a broader Spring Integration/Batch portfolio. If Q-01/Q-13 shows those capabilities materially reduce defects or support cost, the second runtime family may be worth it. |
| 2. Strongest argument against the chosen database? | PostgreSQL shifts more operational/backup/collation expertise to the company than an already-supported SQL Server estate might. A real DBA/support and restore comparison could reverse the choice. |
| 3. Strongest argument against the chosen Desktop shell? | WPF is Windows-only and older than WinUI 3; WebView2 creates a privileged Web/native boundary and a separate patch clock. Accessibility, packaging or policy failure in Q-10/Q-11 would force a shell review. |
| 4. Which decision has the highest chance of reversal after prototype evidence? | The client path: WPF + WebView2 versus browser + signed agent/Tauri, because IPC, dirty-workspace update, accessibility and CAD/Office behavior are still `NOT-RUN`. |
| 5. Which technology creates the highest long-term patch/operations burden? | The combined Windows delivery surface (WPF, WebView2, Workspace and optional Format Worker), not one isolated library. It has multiple OS/app/license clocks and needs a signed rollback runbook. |
| 6. Which decision most depends on unknown company skill? | Ubuntu/PostgreSQL operations, backup/key custody and Windows packaging/signing/support. Q-13/Q-14 must name owners; the recommendation does not assume the project user is a 24/7 operator. |
| 7. What exact evidence would switch to the runner-up? | A same-fixture Java vertical slice passes correctness/security/recovery, the company provides a named supported JDK/Spring/BOM/runbook, and Q-13 documents a material agreed lifecycle/support advantage over the unified .NET path; or an explicit product/integration decision requires Spring-only capability. |

## 11. PG3 readiness / pre-decision

This section prepares PG3; it does not pass PG3. “Resolved by Engineering Recommendation” means the
matrix has made a coherent choice, not that the Product Decision Authority has accepted it.

| Material Tech question | Status | Evidence still needed / owner |
|---|---|---|
| One Server runtime and framework | `RESOLVED BY ENGINEERING RECOMMENDATION` | .NET 10/ASP.NET Core selected; PDA review and Q-01/Q-13 remain open. |
| One database and persistence/migration authority | `RESOLVED BY ENGINEERING RECOMMENDATION` | PostgreSQL 18 + EF/Npgsql + EF migration authority selected; Q-02/Q-07/Q-14 must qualify it. |
| Identity/account versus product authorization boundary | `RESOLVED BY ENGINEERING RECOMMENDATION` | ASP.NET Identity + custom Actor/Account + IDEA Access Policy selected; security/session tests Q-06/Q-08/Q-11 remain `NOT-RUN`. |
| Web CSR and installed Desktop surface | `RESOLVED BY ENGINEERING RECOMMENDATION` | React CSR + WPF/WebView2 preserves current Spec surface; any removal/change requires a follow-up Product Decision. |
| Workspace runtime and IPC | `RESOLVED BY ENGINEERING RECOMMENDATION` | .NET per-user process + current-user named pipe selected; Q-08 and Q-11 remain `NOT-RUN`. |
| Ubuntu 26.04 complete-stack support | `QUALIFICATION REQUIRED` | Q-14 must verify official support for .NET, PostgreSQL packaging, backup/monitoring and signed packages; use 24.04 fallback if it fails. Platform/IT owner. |
| Production edition, license, certificates, signing and support ownership | `BLOCKED` | Company must name the OS/DB edition, certificate/key custodian, backup target, support/on-call owner and permitted install/update policy. No repository evidence yet. |
| Transaction, concurrency, outbox and module-boundary behavior | `QUALIFICATION REQUIRED` | Q-01, Q-02, Q-05 and architecture tests; Product/Tech/Data owners. |
| Multi-GB transfer, Artifact custody and recovery | `QUALIFICATION REQUIRED` | Q-04 and Q-07 with representative files and failure injection; Workspace/Operations owners. |
| Japanese/Unicode search contract | `QUALIFICATION REQUIRED` | Q-03 approved corpus and thresholds; Data/Product owner. |
| CAD/Office/IRONCAD representation path | `QUALIFICATION REQUIRED` | Q-09 exact application/version/license/worker fixture; Format/Product owner. |
| Client installation, WebView2, native boundary and rollback | `QUALIFICATION REQUIRED` | Q-10/Q-11 clean company images, threat cases and dirty Workspace; IT/Security/Release owners. |
| Operations, observability and maintainability | `QUALIFICATION REQUIRED` | Q-12/Q-13 telemetry runbook, SBOM, patch and support rotation; Operations/Engineering owners. |
| Product Decision Authority review/acceptance of TECH-001@0.9 | `NOT-RUN` | Boss reviews the exact brief and source pins; no approval is implied by this artifact. |
| PG3 gate disposition | `NOT-RUN` | GOV/DOC-07/VVP gate owner records the decision after applicable review; this matrix never writes `PASS`. |

### 11.1 Minimum evidence before a Tech approval request

The following is the minimum decision packet, not a claim that it exists:

1. PDA review of `TECH-001@0.9` and this matrix, including the Java/SQL Server alternatives and
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
| `Q-01` Server vertical slice | .NET 10/ASP.NET Core + PostgreSQL/EF/Npgsql; Java branch `DEFERRED` | Same API contract, schema, Artifact adapter and TLS | Implement authenticated Check-out/Reference/Check-in/Release with immutable Generation, `AuthorizationDecision`, commit-time revalidation, outbox and idempotent retry; retain source, migration, trace, Audit/outbox rows and failure log | Tech/Product correctness; Product/Tech reviewers | `NOT-RUN` |
| `Q-02` DB transaction/concurrency | PostgreSQL 18 selected; SQL Server branch `DEFERRED` | Same fixture and isolation goals | Conflicting Reservation/Generation/Release operations, optimistic/pessimistic locks, deadlock/timeout/retry; retain plans, lock graphs, terminal states and timings | Data/Tech; no lost update or unauthorized commit | `NOT-RUN` |
| `Q-03` Search Unicode/JA | PostgreSQL projection selected; SQL Server projection `DEFERRED` | Approved permission model and Vietnamese/Japanese corpus | ID/title/filter/sort/page, case/width/normalization/contains, permission changes and rebuild; retain recall/precision, plans, p95/p99 and rebuild duration | Product/Data thresholds | `NOT-RUN` |
| `Q-04` Multi-GB transfer/custody | .NET Workspace + filesystem Artifact Store; browser/Tauri branches `DEFERRED` | Representative 1/5/10+ GB files and failure injector | Stream Store→Server→Workspace upload/download, digest, network/process/power interruption, resume ranges and duplicate OperationId; retain digests, journal, memory/RSS and orphan report | Workspace; no corruption or duplicate publish | `NOT-RUN` |
| `Q-05` Outbox/idempotency | PostgreSQL outbox + hosted dispatcher; broker branch `DEFERRED` | Same DB and event contract | Crash before/after commit and during delivery; duplicates/reordering/same-key-different-input; retain transaction log, Event IDs, dedupe and replay report | Integration; one authoritative outcome | `NOT-RUN` |
| `Q-06` Account/session revocation | ASP.NET Identity + cookie/bootstrap path; Java branch `DEFERRED` | Cookie/session policy and two sessions | Fixation, CSRF, concurrent sessions, logout, revoke, expiry, reauth and Workspace binding; retain security traces/session evidence and denial proof | Security; revoked session cannot command owner operation | `NOT-RUN` |
| `Q-07` Backup/restore | PostgreSQL PITR + Artifact/config/key coordinated backup | Off-primary target and key custody | Restore DB, Artifact, config/policy/crypto material; replay outbox and simulate severe failure; retain transcript, measured RTO/RPO and integrity report | Operations; preliminary RTO/RPO only if measured/approved | `NOT-RUN` |
| `Q-08` Windows Workspace IPC | .NET named pipes; Rust/JavaFX branches `DEFERRED` | Two Windows users, two Workspaces, elevated/non-elevated processes | Cross-user/cross-Workspace, replayed, oversized and wrong-version messages; reconnect; retain ACL/config/protocol traces and refusal evidence | Security/Workspace | `NOT-RUN` |
| `Q-09` Office/IRONCAD open/save | WPF/WebView2 + .NET Workspace + separate Windows worker | Exact company app/OS/bitness/license fixture | Materialize verified file, launch by association, edit/save/close, detect stale/in-use/error without add-in; retain app matrix, custody journal and state mapping | Workspace/Product/Format | `NOT-RUN` |
| `Q-10` Client install/update/rollback | WPF + Evergreen WebView2; WinUI/browser/Tauri branches `DEFERRED` | Clean company images, signer and offline policy | Per-user/admin install, missing WebView2, online/offline update, dirty Workspace, forced failure, rollback/version skew; retain logs, signatures, SBOM/license inventory and local-work preservation | IT/Release | `NOT-RUN` |
| `Q-11` Web/native attack surface | WebView2 + WPF + named-pipe boundary | Threat model and test origins | Navigation/redirect/iframe/popup/forged messages, LNA/CSRF/DNS rebinding/hostile origin/custom protocol replay; retain security report and policy settings | Security; no generic filesystem/shell/host object | `NOT-RUN` |
| `Q-12` Observability/incident diagnosis | OpenTelemetry + structured logs/metrics/traces | Common schema and redaction policy | Inject transfer failure, deadlock, auth denial, outbox lag and worker crash; diagnose from telemetry; retain dashboards, trace correlation, runbook and time-to-diagnose | Operations | `NOT-RUN` |
| `Q-13` Team/toolchain maintainability | Unified .NET versus Java runner-up; client alternatives `DEFERRED` | Named maintainers/support owners | Build/patch/debug same slice, rotate incident, update dependencies and reproduce build; retain steps, SBOM, patch inventory, support cost and defects | Engineering/management | `NOT-RUN` |
| `Q-14` DB/platform compatibility | .NET 10 + PostgreSQL 18 + Ubuntu 26.04 native package; 24.04/Windows/Java branches `DEFERRED` | Candidate package/native images and backup target | Build/restore exact matrix; verify official support, driver/provider, package, monitoring and SQL Server comparison paths; retain SBOM, lifecycle matrix and restore logs | Platform/IT; no unsupported production combination | `NOT-RUN` |

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
