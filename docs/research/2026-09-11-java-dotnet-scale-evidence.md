# Java 25/Spring Boot 4.1 versus .NET 10/ASP.NET Core for IDEA Server scale

**Evidence snapshot:** 2026-09-11  
**Scope:** Server runtime only. This note does not select the Windows Desktop/Workspace stack.  
**Question:** Does Java/Spring or C#/.NET provide a materially stronger path for scaling IDEA
Engineering into a large enterprise system?

## Normalized evidence classes

| Normalized class | Historical label / meaning in this note |
|---|---|
| `OFFICIAL-PRODUCT-FACT` / `OFFICIAL-LIFECYCLE-LICENSING` | `OFFICIAL FACT`: a first-party platform/project source states a capability, constraint, support or license term. |
| `IDEA-INFERENCE` | A bounded conclusion derived from official facts and IDEA's controlled requirements; it is not a measured result. |
| `QUALIFICATION-UNKNOWN` | `UNKNOWN`: the current IDEA evidence does not establish a result; qualification or a decision is still required. |
| `FORMAL-STANDARD` / `INDUSTRY-SPECIFICATION` | A cited standard/specification claim; it does not mandate Java or .NET. |
| `COMPETITOR-OBSERVATION` | Evidence about another product, never an IDEA requirement. |

No third-party language benchmark, consultancy comparison or competitor implementation is used as
selection evidence here.

## Executive finding

1. **`OFFICIAL FACT`: both runtimes have production concurrency, server GC, Linux/container,
   horizontal-deployment and observability mechanisms.** The available official material does not
   establish that either runtime has a universally higher HTTP throughput or lower latency.
2. **`IDEA INFERENCE`: IDEA's accepted scale envelope does not create a runtime ceiling for either
   candidate.** The initial context is 50–100 intended users at one site, not 100 concurrent
   requests. Multi-GB Artifact transfer must stream without whole-file buffering. A future Project
   corpus of hundreds of TB belongs in an independently scalable Artifact store, not in a Java or
   .NET process heap.
3. **`IDEA-INFERENCE`: Java/Spring has criterion-level advantages, but not a proven raw-performance
   edge.** Spring supplies first-party Modulith, Integration and Batch facilities directly relevant
   to IDEA's modular-monolith, ERP/MES/BI adapter and future migration/processing needs. Java 25 also
   has a longer evidenced runtime support runway through named distribution/support programs. These
   findings do not own the complete cross-stack decision.
4. **`IDEA INFERENCE`: .NET remains technically capable of the same system scale.** ASP.NET Core's
   asynchronous I/O, Kestrel, server/background GC, worker services and diagnostics form a credible
   large-server stack. A correct .NET implementation may beat an incorrect Java implementation and
   vice versa.
5. **`QUALIFICATION-UNKNOWN`: performance winner.** A synthesis may record a criterion-level Java
   ecosystem/lifecycle advantage, but it must not claim “Java scales better/faster than .NET” until both
   finalists run the same representative IDEA workload on the same hardware and PostgreSQL/storage
   topology.

**Research disposition (criterion-level only):** carry **Java 25 LTS + a named JDK
distribution/support channel + Spring Boot 4.1.x** as a strong Server candidate for modularity,
integration/batch breadth and runtime-support optionality. Carry **.NET 10/ASP.NET Core** as an
equally credible Server candidate with a Windows/tooling consolidation advantage. This note does not
select an overall system winner; the cross-stack synthesis and qualification matrix own that scope.

## 1. What “scale” means for IDEA

### Controlled IDEA context

- `OFFICIAL FACT` (repository authority):
  [`DOC-01`](../product/instances/idea-engineering/DOC-01-product-vision-and-scope.md)
  records approximately 50–100 intended users at one site and explicitly says this is not measured
  concurrency or validated demand.
- `OFFICIAL FACT` (repository authority):
  [`REQ-WS-015`](../product/instances/idea-engineering/DOC-04-software-requirements-specification.md)
  requires resumable, digest-verified, streaming transfer of multi-GB Artifacts without requiring
  the complete Artifact to fit in client or server memory.
- `OFFICIAL FACT` (repository authority):
  [`REQ-OPS-006`](../product/instances/idea-engineering/DOC-04-software-requirements-specification.md)
  separates product identity from storage provider/path and admits a future Project envelope of
  hundreds of TB. The governing change record explicitly says this is not initial sizing, a
  benchmark or a capacity promise.
- `OFFICIAL FACT` (repository authority): preliminary severe-server-failure goals are RTO no more
  than four working hours and RPO no more than one hour. These are evaluation goals, not a measured
  SLA; exact workload, percentiles, thresholds and recovery clock remain open under `REQ-OPS-005`.
- `OFFICIAL FACT` (accepted ADR):
  [`ADR-0004`](../adr/0004-start-c1-as-a-modular-monolith.md) starts the Server as a modular monolith
  and permits process separation only when measured scale, security, ownership or failure isolation
  justifies distributed-system cost.

### Consequences

- `IDEA INFERENCE`: initial **user scale** is modest for both platforms. It does not justify a
  microservice architecture, Kubernetes or a language decision.
- `IDEA INFERENCE`: future **data scale** is principally a storage/indexing/backup problem. Keeping
  Artifact bytes out of the application heap, storing stable locations behind an adapter and
  streaming incremental digests matter far more than JVM versus CLR.
- `IDEA INFERENCE`: **transaction scale** will be constrained by PostgreSQL query/lock/index design,
  connection-pool limits and transaction length before language syntax decides the outcome.
- `IDEA INFERENCE`: **integration and team scale** can distinguish the ecosystems because they
  affect module boundaries, adapters, restartable work and how several teams safely evolve the
  system.
- `IDEA INFERENCE`: RTO/RPO do not measure request throughput. They depend on deployability and a
  coordinated, verified restore of database, Artifact store, configuration/policy and cryptographic
  material. Neither runtime supplies that outcome automatically.

## 2. HTTP concurrency and scale-up/scale-out

### Java 25 / Spring Boot 4.1

- `OFFICIAL FACT`: Java virtual threads are lightweight threads. When a virtual thread blocks on
  supported I/O, the runtime can suspend it and free the carrier OS thread for other work. Oracle
  says they suit high-throughput applications with many tasks waiting on I/O, are not intended for
  long-running CPU-intensive work, and provide higher throughput rather than lower latency.
  [Oracle Java 25 virtual-thread guide](https://docs.oracle.com/en/java/javase/25/core/virtual-threads.html)
- `OFFICIAL FACT`: Oracle's adoption guidance says an application with fewer than roughly 10,000
  virtual threads is unlikely to benefit, warns that native/foreign calls can pin a carrier and
  hinder scalability, and says scarce downstream resources still require explicit limits. A
  database connection pool itself acts as such a limit.
  [Oracle Java 25 virtual-thread guide](https://docs.oracle.com/en/java/javase/25/core/virtual-threads.html)
- `OFFICIAL FACT`: Spring Boot 4.1.1 can enable virtual-thread-backed task execution with Java 21+
  through `spring.threads.virtual.enabled=true`; otherwise it configures a platform-thread pool.
  This setting participates in several Boot integrations but does not remove the need to size
  queues, database pools or external-system concurrency.
  [Spring Boot task execution](https://docs.spring.io/spring-boot/reference/features/task-execution-and-scheduling.html)

### .NET 10 / ASP.NET Core

- `OFFICIAL FACT`: ASP.NET Core is designed around asynchronous I/O. Microsoft's guidance says a
  small pool of threads can handle thousands of concurrent requests while operations await I/O;
  synchronous blocking can starve the ThreadPool and degrade response time. It requires the full
  hot path—including database, remote calls and request/response I/O—to remain asynchronous.
  [ASP.NET Core performance guidance](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/best-practices?view=aspnetcore-10.0)
- `OFFICIAL FACT`: Kestrel is the cross-platform ASP.NET Core server, supports production Linux and
  configurable HTTP connection/stream/timeout limits, and can be deployed behind reverse proxies
  and load balancers.
  [Kestrel overview](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/servers/kestrel?view=aspnetcore-10.0)
- `OFFICIAL FACT`: ASP.NET Core documents distributed cache implementations for server-farm
  scenarios; in-memory state otherwise requires affinity. This is evidence that multiple app
  instances are supported and that state placement—not C# itself—is the scale-out constraint.
  [ASP.NET Core distributed caching](https://learn.microsoft.com/en-us/aspnet/core/performance/caching/distributed?view=aspnetcore-10.0)

### Comparison

| Question | Java/Spring | .NET/ASP.NET Core | Evidence-safe conclusion |
|---|---|---|---|
| Many I/O waits | Straight-line blocking style on virtual threads can release carrier threads during supported blocking I/O. | `async`/`await` releases ThreadPool threads during asynchronous I/O. | Both have a credible high-concurrency model; programming discipline differs. |
| CPU-heavy conversion | Virtual threads do not make CPU work faster. | `async` does not make CPU work faster; Microsoft recommends long CPU work outside request paths. | Bound CPU workers and/or isolate converter processes in either stack. |
| Downstream saturation | Connection pools/semaphores must bound access. | Connection pools/bounded queues must bound access. | Unlimited application concurrency can merely move overload to PostgreSQL/storage/ERP. |
| Horizontal instances | Spring Boot produces Docker-compatible images; shared session/state solutions exist. | .NET produces container images; distributed state/server-farm guidance exists. | Both can scale out once HTTP nodes are stateless and workers/leases/idempotency are coordinated. |

`IDEA INFERENCE`: Java virtual threads are attractive for readable adapter code that performs many
blocking calls. They are not a decisive advantage for the known 50–100-user context, and enabling
them cannot be used as a substitute for backpressure. Conversely, .NET `async` is already a proven
framework-wide model, but one accidental synchronous dependency on a hot path can create ThreadPool
starvation. The two approaches are engineering trade-offs, not a universal ranking.

## 3. Multi-GB Artifacts, memory and garbage collection

### Java

- `OFFICIAL FACT`: G1 is the default collector on most server configurations. Oracle describes it
  as a mostly concurrent collector intended to balance throughput and pause-time goals on
  multiprocessor machines with large memory.
- `OFFICIAL FACT`: Oracle documents multiple collector choices. Parallel GC favors throughput; G1
  targets shorter pauses; ZGC targets very low pauses at a throughput cost. Oracle explicitly says
  collector guidance is only a starting point because performance depends on heap size, live data,
  processors and the application.
  [Java 25 available collectors](https://docs.oracle.com/en/java/javase/25/gctuning/available-collectors.html)
- `OFFICIAL FACT`: G1 treats sufficiently large allocations as “humongous” objects; these can cause
  early collections and, in adverse cases, slow full collections or out-of-memory conditions.
  [Java 25 G1 documentation](https://docs.oracle.com/en/java/javase/25/gctuning/garbage-first-g1-garbage-collector1.html)

### .NET

- `OFFICIAL FACT`: .NET supplies workstation and server GC; server GC is intended for applications
  needing high throughput and scalability. Background GC is available and enabled by default, and
  runtime settings can constrain heap count and heap limits.
  [.NET GC configuration](https://learn.microsoft.com/en-us/dotnet/core/runtime-config/garbage-collector),
  [workstation versus server GC](https://learn.microsoft.com/en-us/dotnet/standard/garbage-collection/workstation-server-gc)
- `OFFICIAL FACT`: Microsoft warns that allocations at or above 85,000 bytes use the Large Object
  Heap and that frequent allocation/deallocation of large objects can cause costly generation-2
  collections and inconsistent performance. It also warns that reading an entire large request
  body into memory can cause OOM and denial of service.
  [ASP.NET Core performance guidance](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/best-practices?view=aspnetcore-10.0)

### IDEA consequence

`IDEA INFERENCE`: neither collector should ever be asked to hold a multi-GB CAD/Office Artifact as a
single managed byte array. The required design is bounded buffers, incremental digest computation,
temporary/staging storage, resumable verified ranges and a separately bounded conversion worker.
With that design, Artifact throughput is dominated by network, disk/object-store behavior, checksum
cost and concurrency limits. GC flexibility is useful operationally but does not select Java or
.NET for IDEA.

`UNKNOWN`: peak resident memory, allocation rate, p99 GC pause and throughput for the actual IDEA
file-size mix. They must be measured for each finalist with identical buffer and concurrency limits.

## 4. Startup, deployment density and containers

- `OFFICIAL FACT`: Spring Boot 4.1.1 requires Java 17 or later and supports through Java 26; Java 25
  is in range. Boot can build Docker-compatible images through Dockerfiles or Cloud Native
  Buildpacks and can layer dependencies separately from application code.
  [Boot system requirements](https://docs.spring.io/spring-boot/system-requirements.html),
  [Boot container images](https://docs.spring.io/spring-boot/reference/packaging/container-images/)
- `OFFICIAL FACT`: Spring Boot/GraalVM native images can reduce startup and memory footprint, but
  operate under a closed-world assumption and impose constraints around reflection, resources,
  serialization, proxies and runtime-dynamic configuration.
  [Spring Boot native-image introduction](https://docs.spring.io/spring-boot/reference/packaging/native-image/introducing-graalvm-native-images.html)
- `OFFICIAL FACT`: .NET can publish Docker-compatible images. Native AOT can reduce startup time and
  memory, but it prohibits or restricts dynamic loading/code generation/reflection-related patterns,
  and ASP.NET Core still lists feature compatibility limitations.
  [.NET container tutorial](https://learn.microsoft.com/en-us/dotnet/core/docker/build-container),
  [.NET Native AOT](https://learn.microsoft.com/en-us/dotnet/core/deploying/native-aot),
  [ASP.NET Core Native AOT compatibility](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/native-aot?view=aspnetcore-10.0)

`IDEA INFERENCE`: IDEA is a long-running on-premises service, not a scale-to-zero function. Cold
start is therefore a secondary criterion. Start with conventional JIT deployments for either
candidate. Do not accept AOT compatibility cost until measurements show startup time or container
density is a real constraint.

`UNKNOWN`: image size, cold/warm startup, steady RSS and deployment density for the eventual
dependency graph. Template-app measurements cannot settle these values.

## 5. Modular-monolith and organization scale

### Concrete Java/Spring capability

- `OFFICIAL FACT`: Spring Modulith 2.1.1 can derive application modules from package structure,
  reject module cycles, reject access to another module's internal packages, enforce declared
  dependencies, run module-scoped integration tests, observe module interactions and generate
  module documentation.
  [Spring Modulith overview](https://spring.io/projects/spring-modulith/),
  [module verification rules](https://docs.spring.io/spring-modulith/reference/verification.html)

### .NET position

- `OFFICIAL FACT`: MSBuild supports references between projects/assemblies; C# `internal` access is
  enforced within an assembly; and .NET provides dependency injection through `IServiceCollection`.
  These primitives can implement ADR-0004's deep modules.
  [MSBuild `ProjectReference`](https://learn.microsoft.com/en-us/visualstudio/msbuild/common-msbuild-project-items?view=visualstudio),
  [C# `internal`](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/keywords/internal),
  [.NET dependency injection](https://learn.microsoft.com/en-us/dotnet/core/extensions/dependency-injection/usage)
- `UNKNOWN`: this research did not establish a Microsoft first-party .NET 10 facility with the same
  combined package-level cycle/API/dependency verification, module-test slicing, runtime observation
  and generated documentation scope as Spring Modulith. A .NET proposal must name the conventions,
  build-time checks or third-party analyzer it will use; it must not assume folder layout enforces
  the boundary.

`IDEA INFERENCE`: Spring Modulith is a genuine advantage for IDEA because it directly operationalizes
the accepted modular-monolith decision and can keep module boundaries visible as the codebase and
number of contributors grow. It does not automatically create good domain boundaries, and it does
not prove higher request throughput.

## 6. Integration and background processing

### Java/Spring

- `OFFICIAL FACT`: Spring Integration implements Enterprise Integration Patterns, message channels,
  routing/transformation and declarative adapters to external systems.
  [Spring Integration overview](https://docs.spring.io/spring-integration/reference/overview.html)
- `OFFICIAL FACT`: Spring Batch provides restartable job metadata and single-process,
  multi-threaded, partitioned and remote processing options. Its own guidance says to measure a
  realistic job and use the simplest implementation that meets the requirement before adding
  parallelism.
  [Spring Batch scaling and parallel processing](https://docs.spring.io/spring-batch/reference/scalability.html)

### .NET

- `OFFICIAL FACT`: .NET Worker Services/`BackgroundService` support long-running, queued,
  CPU-intensive and scheduled work; the official queue example uses a bounded channel to provide
  backpressure.
  [.NET Worker Services](https://learn.microsoft.com/en-us/dotnet/core/extensions/workers),
  [.NET queue service](https://learn.microsoft.com/en-us/dotnet/core/extensions/queue-service)
- `OFFICIAL FACT`: Microsoft provides resilience primitives for transient failures generally and
  `HttpClient` specifically.
  [.NET resilience](https://learn.microsoft.com/en-us/dotnet/core/resilience/)

### IDEA consequence

`IDEA INFERENCE`: both can implement the already recommended versioned API, per-system adapter and
transactional outbox without a broker initially. Java's first-party Spring portfolio gives it an
edge when IDEA later accumulates many ERP/MES/BI routes, restartable imports/exports, migrations and
partitioned processing. That is an ecosystem/productivity advantage; exact adapters, delivery
semantics and failure recovery still require IDEA tests.

`UNKNOWN`: which external systems, protocols, rates, batch sizes and vendor SDKs will actually be
needed. No framework catalogue proves compatibility with an unnamed ERP/MES/BI product.

## 7. Observability and production diagnosis

- `OFFICIAL FACT`: Spring Boot Actuator uses Micrometer Observation for metrics/traces and supports
  OpenTelemetry/OTLP paths. It exports JVM memory, GC, threads, virtual-thread, process, CPU and disk
  metrics.
  [Spring Boot observability](https://docs.spring.io/spring-boot/reference/actuator/observability.html),
  [Spring Boot metrics](https://docs.spring.io/spring-boot/reference/actuator/metrics.html)
- `OFFICIAL FACT`: Java Flight Recorder is integrated into the JVM and supports low-overhead
  continuous production recordings with thread, lock and GC detail.
  [Java 25 diagnostic tools](https://docs.oracle.com/en/java/javase/25/troubleshoot/diagnostic-tools.html)
- `OFFICIAL FACT`: .NET exposes structured logging, metrics and distributed tracing; `dotnet-monitor`
  can collect dumps, traces, logs and metrics from production/container processes, while EventPipe
  tools diagnose CPU, memory, GC, locks and ThreadPool starvation.
  [.NET diagnostics overview](https://learn.microsoft.com/en-us/dotnet/core/diagnostics/),
  [`dotnet-monitor`](https://learn.microsoft.com/en-us/dotnet/core/diagnostics/dotnet-monitor)
- `OFFICIAL FACT`: OpenTelemetry offers maintained Java and .NET language implementations, so a
  vendor-neutral telemetry contract does not require choosing one runtime.
  [OpenTelemetry language implementations](https://opentelemetry.io/docs/languages/)

`IDEA INFERENCE`: observability is a draw at platform level. The selection must instead ensure one
documented dashboard/runbook set: request latency, active transfers, byte throughput, digest
failures, database-pool wait, worker queue depth/age, outbox lag, CPU/RSS/heap, GC pauses and errors.

## 8. Runtime and framework support runway

### Java candidate

- `OFFICIAL FACT`: Java 25 is an LTS release. Eclipse Temurin's roadmap states availability through
  at least September 2031; community support has no SLA and paid providers are separate. Oracle's
  customer roadmap lists Premier Support through September 2030 and Extended Support through
  September 2033, subject to entitlement and licensing terms.
  [Temurin support roadmap](https://adoptium.net/support/),
  [Oracle Java SE support roadmap](https://www.oracle.com/java/technologies/java-se-support-roadmap.html)
- `OFFICIAL FACT`: JDK LTS does not freeze the Spring stack. Spring's current policy gives Boot minor
  releases at least 13 months of OSS support and describes longer subscription support. Managed
  third-party dependencies have their own lifecycles.
  [Spring support policy](https://spring.io/support-policy/)

### .NET candidate

- `OFFICIAL FACT`: .NET 10 is LTS, released 2025-11-11 and supported through 2028-11-14. Microsoft
  requires supported deployments to stay current on released patches; even-numbered LTS releases
  receive three years of support.
  [.NET support policy](https://dotnet.microsoft.com/en-us/platform/support/policy)

### Comparison

`IDEA INFERENCE`: Java offers the longer evidenced **runtime** runway and more distribution/support
choices. This reduces pressure to replace the JVM but does not eliminate regular Spring Boot,
Spring portfolio, driver and library upgrades. .NET provides a simpler single-vendor schedule but
requires a planned major-runtime upgrade roughly every LTS cycle. Neither path is “install once for
ten years.”

If Java is selected, the controlled stack must name the distribution and support contract, for
example **Eclipse Temurin 25 LTS community updates with no SLA** or a separately costed commercial
provider. “Oracle Java 25 LTS is free forever” is not an acceptable licensing/support statement.

## 9. Evidence-based comparison

| Criterion for IDEA Server | Java 25 + Spring Boot 4.1 | .NET 10 + ASP.NET Core | Disposition |
|---|---|---|---|
| Initial 50–100 intended users | More than credible | More than credible | `IDEA INFERENCE`: no discriminator |
| High I/O concurrency | Virtual threads; simple blocking style; must bound scarce resources | Mature async/await pipeline; must avoid sync blocking | `UNKNOWN` winner until measured |
| CPU-heavy conversion | Requires bounded/isolated workers | Requires bounded/isolated workers | `IDEA INFERENCE`: runtime is secondary to worker design |
| Multi-GB transfer | Must stream and avoid humongous heap objects | Must stream and avoid LOH/whole-body allocations | `IDEA INFERENCE`: no discriminator |
| Hundreds-of-TB corpus | External Artifact store behind stable adapter | External Artifact store behind stable adapter | `IDEA INFERENCE`: no discriminator |
| Horizontal HTTP scale | Containerized stateless replicas are feasible | Containerized stateless replicas are feasible | `IDEA INFERENCE`: shared-state design decides |
| Modular-monolith enforcement | Explicit first-party Spring Modulith support | Feasible through project boundaries/checks; exact enforcement package not selected | Java advantage for the current ADR |
| Enterprise adapters/batch | First-party Spring Integration and Spring Batch portfolio | Strong worker/resilience primitives; exact integration library set not selected | Java advantage for future breadth |
| Runtime GC choices | G1/Parallel/ZGC with explicit trade-offs | Server/background GC with tuning controls | `UNKNOWN` winner; measure actual allocation/pause profile |
| Startup/container density | JVM plus optional CDS/CRaC/native paths | JIT plus optional Native AOT | Secondary and `UNKNOWN` for this long-running service |
| Observability/diagnosis | Actuator, Micrometer/OTel, JFR | built-in metrics/OTel, EventPipe/dotnet-monitor | Platform-level draw |
| Runtime LTS runway | Longer under named Temurin/Oracle programs | .NET 10 through 2028-11-14 | Java advantage, with framework-upgrade caveat |

## 10. Why a generic benchmark cannot select the runtime

`OFFICIAL FACT`: the platform owners themselves qualify performance claims:

- Oracle says virtual threads improve throughput, not latency, only for suitable high-concurrency
  waiting workloads; they do not accelerate CPU work.
- Oracle says collector performance depends on heap size, live data, processors and the application.
- Microsoft says database/remote I/O often dominates ASP.NET Core request time, requires measuring
  hot paths, and recommends measuring high-performance techniques before accepting their complexity.
- Spring Batch says to measure a realistic job and retain the simplest execution model that meets
  it before parallelizing.

`IDEA INFERENCE`: a JSON “hello world” benchmark omits IDEA's dominant risks: PostgreSQL
transactions and locks; authorization; multi-GB streaming; incremental hashing; storage latency;
interrupted/resumed operations; outbox work; converter CPU/memory; and recovery. Framework versions,
serializer/ORM choices, warm-up, GC, connection pools and payload mix can reverse a generic result.

Therefore any statement that Java or .NET “wins scale” before an IDEA benchmark is `UNKNOWN`, not a
technical conclusion.

## 11. Required qualification gate

Run the same bounded vertical slice in both finalists before converting the proposal preference
into an approved performance claim:

1. **Environment equality:** same server, OS/container limits, PostgreSQL instance/schema/indexes,
   Artifact storage, TLS/reverse proxy and network path; record every exact version and setting.
2. **Correctness first:** identical immutable Generation publication, authorization revalidation,
   all-or-none metadata transaction, transactional outbox, idempotent retry and digest result.
3. **Workload definition:** approved concurrent actors and operation mix; metadata navigation/search;
   Check-out/Reference; upload/download with representative file distribution including multi-GB;
   interrupted resume; concurrent Check-in conflict; outbox/adapters; bounded worker conversion.
   Do not substitute 50–100 total accounts for concurrent actors.
4. **Warm and cold phases:** record startup/readiness separately; allow comparable JIT warm-up before
   steady-state comparison; do not mix Native AOT/GraalVM with conventional JIT without labeling it
   a separate candidate.
5. **Measures:** throughput; p50/p95/p99 latency; errors/timeouts; CPU; RSS/heap; allocation rate;
   GC pause/time; ThreadPool or virtual-thread/carrier state; database-pool wait/usage; SQL time/locks;
   network/disk bytes; transfer memory; worker queue depth/age; outbox lag.
6. **Failure/recovery:** kill/restart nodes during transfer/publication, verify one logical terminal
   result and exact digests, then run the coordinated restore drill. Measure RTO/RPO separately from
   HTTP performance.
7. **Decision rule:** compare each candidate with pre-approved thresholds. No thresholds currently
   exist, so the present result is `NOT-RUN`/`BLOCKED`, not PASS for either runtime.

## Final disposition for Q18

This note owns Server-scale evidence, not the complete technology decision. Its final disposition is
therefore **criterion-level findings only**:

- `ADVANTAGE` for Java/Spring on the currently evidenced Modulith, Integration and Batch ecosystem
  and on runtime-distribution/support optionality.
- `ADVANTAGE` for .NET on a single-vendor Windows/Server toolchain and the documented Windows
  Workspace primitives considered elsewhere.
- `UNKNOWN` for relative performance, capacity, total cost and company/team maintainability until
  the same IDEA workload is executed on both finalists.
- `FOLLOW-UP PRODUCT DECISION REQUIRED`: the overall Server + Web + Workspace selection belongs to
  [`2026-09-13-technology-selection-evidence-synthesis.md`](2026-09-13-technology-selection-evidence-synthesis.md)
  and later Tech review; this note does not approve Java or .NET.

## 2026-09-13 current-version correction addendum

The 2026-09-11 evidence date is retained for historical source claims. The following current
release facts supersede any implication that an unqualified “latest” version is a reproducible
baseline:

| Component | Current fact at 2026-09-13 | IDEA interpretation / limitation |
|---|---|---|
| Java runtime | Java 25 is LTS; Oracle JDK 25 has Premier Support to Sep 2030 and Extended Support to Sep 2033 for entitled customers. Eclipse Temurin lists `25.0.4.1+1` and community availability at least to Sep 2031, without an Eclipse SLA ([Oracle roadmap](https://www.oracle.com/java/technologies/java-se-support-roadmap.html), [Temurin support](https://adoptium.net/support/), [Temurin release](https://adoptium.net/news/2026/09/eclipse-temurin-8u504-110321-170201-210121-25041-26021-available)) | Name the distribution and support channel; JDK lifecycle does not freeze Spring dependencies. |
| Java 26 | Current non-LTS line; Oracle downloads list `26.0.2.1` and support only through Sep 2026 ([downloads](https://www.oracle.com/java/technologies/downloads/)) | Suitable for experiments, not the long-lived baseline without an explicit decision. |
| Spring Boot / Framework | Boot `4.1.1`; system requirements require Java 17+ and Framework `7.0.9+` ([system requirements](https://docs.spring.io/spring-boot/system-requirements.html)) | Use the Boot BOM rather than independently pinning every Spring module. |
| Spring modules | Modulith `2.1.1`, Security `7.1.1`, Data JPA `4.1.1`, Batch `6.0.5`, Integration `7.1.1` are current project lines; Boot compatibility remains the authority ([Modulith release](https://spring.io/blog/2026/08/26/spring-modulith-2-2-m1-2-1-1-2-0-8-and-1-4-13-released/), [Security](https://docs.spring.io/spring-security/reference/), [Data JPA](https://docs.spring.io/spring-data/jpa/reference/), [Batch release](https://spring.io/blog/2026/08/20/spring-batch-6-0-5-and-6-1-0-M1-available-now/), [Integration](https://docs.spring.io/spring-integration/reference/)) | Individual project release dates are not a shared “Java LTS” date; verify the selected Boot BOM in CI. |
| .NET / EF Core | .NET `10.0.12` is the current patch and LTS ends 2028-11-14; EF Core 10 is supported through 2028-11-10 ([.NET policy](https://dotnet.microsoft.com/en-us/platform/support/policy), [EF10 lifecycle](https://learn.microsoft.com/en-us/ef/core/what-is-new/ef-core-10.0/whatsnew)) | Patch the runtime/SDK and provider together; .NET LTS is not a Windows App SDK or WebView2 promise. |
| Observability | Micrometer `1.17.x` is the current Spring support line; OpenTelemetry and JFR/.NET diagnostics remain separate supported toolchains ([Micrometer support](https://micrometer.io/support/), [OpenTelemetry](https://opentelemetry.io/docs/languages/)) | Confirm exporter, retention and incident runbooks in the qualification slice. |

All rows are `OFFICIAL-PRODUCT-FACT` or `OFFICIAL-LIFECYCLE-LICENSING`; the IDEA implications are
`IDEA-INFERENCE`; no row is a Tech approval. No product scope, Feature/Spec/Tech decision,
architecture semantics, FTR/REQ, DDM capability or PG state is changed.
