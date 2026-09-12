# Java/Spring versus C#/.NET for IDEA Engineering

**Evidence snapshot:** 2026-09-11  
**Question:** Is there a sound reason IDEA Engineering should not use Java, and what actually
distinguishes Java/Spring from C#/.NET for the proposed Server, Windows Desktop and Workspace?

## Disposition

There is no evidenced product or architecture constraint that prevents IDEA Engineering from using
Java/Spring. Java can implement the proposed modular monolith, HTTP Interfaces, relational
transactions, PostgreSQL access, transactional publication and Linux/container deployment.

The current preference for .NET is narrower: IDEA already proposes a Windows-native Desktop and
Workspace. Using C#/.NET for both those components and the Server reduces the number of runtime and
language families that a small initial team must build, patch and diagnose. That is an **IDEA
inference**, not proof that Java is less capable, less enterprise-ready or slower.

This note therefore keeps three real options open:

- **A — .NET Server + .NET Windows client/Workspace**;
- **B — Java/Spring Server + .NET Windows client/Workspace**;
- **C — Java/Spring Server + Java Desktop/Workspace**.

The present evidence gives A a conditional maintainability advantage, not an approval. B can become
the better choice if company Java/Spring skill and support are materially stronger. C is technically
credible, but it changes the currently proposed desktop/rendered-UI boundary and has the largest
qualification backlog.

## Evidence rules

| Class | Meaning in this note |
|---|---|
| `OFFICIAL FACT` | A current first-party project/vendor source states a capability, support period or license fact. |
| `IDEA INFERENCE` | A consequence reasoned from IDEA's confirmed context: Windows engineering PCs, file/CAD work, one initial operator, 50–100 intended users and no dedicated DevOps role. |
| `QUALIFICATION UNKNOWN` | Feasibility for IDEA has not been demonstrated with an exact version, machine, file corpus, installer, security boundary or recovery test. |
| `COMPETITOR OBSERVATION` | Evidence about Aras or DDM; it is not sufficient by itself to create an IDEA requirement or select a stack. |

## 1. Runtime, lifecycle and licensing

### .NET candidate

- `OFFICIAL FACT`: Microsoft's current [.NET support policy](https://dotnet.microsoft.com/en-us/platform/support/policy/dotnet-core)
  lists .NET 10 as an active LTS release, released 2025-11-11 and supported through 2028-11-14.
  LTS receives three years of free patches, and a supported installation must remain current on
  released patches.
- `OFFICIAL FACT`: Microsoft states that [.NET has no licensing costs, including commercial
  use](https://dotnet.microsoft.com/en-us/platform/free). This must not be shortened to “every .NET
  binary is MIT”: the official [.NET licensing information](https://github.com/dotnet/core/blob/main/license-information.md)
  identifies MIT distributions on Linux/macOS and the .NET Library License for Windows product
  distributions, plus third-party notices and separately licensed Windows components.
- `IDEA INFERENCE`: .NET 10 gives a clear, unified lifecycle for the proposed ASP.NET Core Server and
  WPF/Workspace code, but its November 2028 end date creates a planned major-upgrade obligation
  during a long-lived product's life.

### Java/Spring candidate

- `OFFICIAL FACT`: Oracle's current [Java SE support roadmap](https://www.oracle.com/java/technologies/java-se-support-roadmap.html)
  identifies Java 25 as an LTS release. Oracle's table lists Premier Support to at least September
  2030 and Extended Support to at least September 2033 for entitled Oracle customers. The same page
  says Oracle JDK 25 is currently offered to all users under its No-Fee Terms and Conditions.
- `OFFICIAL FACT`: “Java 25 LTS” does not identify one support entitlement. Eclipse Adoptium's
  [Temurin roadmap](https://adoptium.net/support/) lists Temurin 25 community support through at
  least September 2031, explains that community support has no SLA, and points users needing an SLA
  to commercial support providers. OpenJDK source is distributed under
  [GPLv2 with the Classpath Exception](https://openjdk.org/legal/gplv2+ce.html); the exception permits
  linking covered libraries with independent modules under other terms, subject to the applicable
  licenses.
- `OFFICIAL FACT`: [Spring Boot 4.1.1 system requirements](https://docs.spring.io/spring-boot/system-requirements.html)
  state Java 17 minimum and compatibility through Java 26, so Java 25 is within its stated range.
  Spring Boot itself uses the [Apache License 2.0](https://github.com/spring-projects/spring-boot/blob/main/LICENSE.txt).
- `OFFICIAL FACT`: a long-lived JDK does not make the entire Spring stack share that lifecycle.
  Spring's [support policy](https://spring.io/support-policy) gives Boot minor releases a minimum
  13-month OSS-support period and describes longer subscription support, including an additional
  period for the last minor line in a major generation.
- `IDEA INFERENCE`: if Java is selected now, **Java 25 LTS plus an explicitly named distribution and
  support channel** is the defensible runtime candidate. “Java LTS” alone is not a reproducible or
  costed choice. Spring Boot and all other dependencies still require their own upgrade calendar.

### Safe lifecycle conclusion

Java has the longer evidenced runtime runway under the cited Temurin/Oracle programs. .NET has the
shorter but simpler Microsoft product-family schedule. Neither fact establishes lower total cost:
IDEA must separately account for framework, database driver, desktop renderer, build tools,
commercial support (if required), testing and operator time.

## 2. Server architecture, Linux, containers and PostgreSQL

The proposed server architecture does not choose the language:

- `OFFICIAL FACT`: [Spring Modulith](https://spring.io/projects/spring-modulith) supports discovering,
  verifying, testing, observing and documenting domain-driven application modules in a Spring Boot
  application. Its [event publication registry](https://docs.spring.io/spring-modulith/reference/events.html)
  records listener publications in the original business transaction and retains incomplete
  publications for retry. The documentation also distinguishes this registry/externalization from
  more advanced outbox implementations; IDEA must qualify exact delivery and duplicate semantics
  rather than treating a framework switch as proof of the Q5 contract.
- `OFFICIAL FACT`: transactional outbox is an architecture response to the database/message
  dual-write problem, not a .NET feature. The official
  [AWS pattern description](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html)
  requires the business change and outbox entry to commit together and requires consumers to be
  idempotent because duplicate delivery can occur.
- `OFFICIAL FACT`: Spring Boot applications can be containerized with Dockerfiles or
  [Cloud Native Buildpacks](https://docs.spring.io/spring-boot/reference/packaging/container-images/index.html).
  Adoptium publishes [DEB/RPM/APK installation paths](https://adoptium.net/installation/linux/),
  including a `temurin-25-jdk` package, and lists Linux and Windows among
  [Temurin supported platforms](https://adoptium.net/supported-platforms/).
- `OFFICIAL FACT`: Microsoft publishes official
  [.NET runtime and SDK container images](https://learn.microsoft.com/en-us/dotnet/core/docker/introduction)
  for Linux and Windows. Its current
  [Ubuntu installation guide](https://learn.microsoft.com/en-us/dotnet/core/install/linux-ubuntu-install)
  lists .NET 10 support on Ubuntu 26.04.
- `OFFICIAL FACT`: PostgreSQL supplies an open-source
  [pure-Java JDBC driver](https://jdbc.postgresql.org/), while
  [Npgsql](https://www.npgsql.org/doc/index.html) supplies the .NET data provider. PostgreSQL is not
  a discriminator between the two runtime choices.

`IDEA INFERENCE`: both candidates fit the recommended Ubuntu + Docker/Compose + PostgreSQL topology.
Exact Ubuntu 26.04/JDK/container-base support, architecture, patch source and image provenance remain
qualification items for the selected Java distribution; the existence of a generic Linux package
is not that qualification.

No current primary evidence justifies choosing either runtime on generic “enterprise scale” or
performance claims. IDEA needs workload-specific measurements before using those as selection
criteria.

## 3. Windows Desktop, rendered UI and native integration

### What .NET demonstrably provides

- `OFFICIAL FACT`: [WPF](https://learn.microsoft.com/en-us/dotnet/desktop/wpf/overview/) is part of
  .NET and runs only on Windows.
- `OFFICIAL FACT`: Microsoft provides a supported
  [WebView2 SDK path for WPF](https://learn.microsoft.com/en-us/microsoft-edge/webview2/get-started/wpf),
  including host-to-web and web-to-host messaging. WebView2 has its own runtime, update and security
  lifecycle; sharing .NET does not remove that boundary.
- `OFFICIAL FACT`: [.NET P/Invoke](https://learn.microsoft.com/en-us/dotnet/standard/native-interop/pinvoke)
  calls functions, callbacks and structures in unmanaged libraries. This establishes a native
  interop mechanism, not compatibility with a particular CAD/Office API.

### What Java demonstrably provides

- `OFFICIAL FACT`: JavaFX is available for Windows. The current
  [JavaFX roadmap](https://gluonhq.com/products/javafx/) lists JavaFX 25 as an active LTS line and
  provides Windows x64 artifacts. The OpenJFX
  [getting-started guide](https://openjfx.io/openjfx-docs/) supports Maven/Gradle dependency delivery,
  platform-specific native libraries and custom runtime images.
- `OFFICIAL FACT`: JavaFX [`WebView`](https://openjfx.io/javadoc/26/javafx.web/javafx/scene/web/WebView.html)
  displays Web content, and [`WebEngine`](https://openjfx.io/javadoc/26/javafx.web/javafx/scene/web/WebEngine.html)
  supports JavaScript plus two-way communication between Java and page code. This makes a
  Java-hosted rendered region possible; it does not prove compatibility, security or UX parity with
  the current React + WebView2 concept.
- `OFFICIAL FACT`: Java's
  [Foreign Function & Memory API](https://openjdk.org/jeps/454) was finalized in JDK 22 and enables
  Java code to call native libraries and process native data. JNI also remains available. It would
  therefore be unsupported to claim that Java lacks native interoperability.
- `OFFICIAL FACT`: the JDK's
  [`jpackage`](https://docs.oracle.com/en/java/javase/26/jpackage/packaging-overview.html) creates
  platform-specific installable packages for Windows, Linux and macOS, includes an application
  runtime, and supports file associations. Packaging a Java Windows application is feasible.
- `OFFICIAL FACT`: JavaFX support is a separate decision from JDK support. Oracle's Java SE roadmap
  explicitly excludes JavaFX from its general client/server support-table assurance, OpenJFX points
  LTS questions to Gluon, and Gluon describes guaranteed security patches as part of its
  [JavaFX LTS plans](https://gluonhq.com/services/javafx-support/).

### Safe desktop conclusion

Both ecosystems have native calls, web-content embedding and Windows packaging. There is no source
basis here for declaring Java native interop categorically weaker.

`QUALIFICATION UNKNOWN`: only an IDEA-specific spike can determine whether WPF/WebView2 or
JavaFX/WebView better satisfies the actual boundary: multi-GB local work, per-user Workspace IPC,
Windows file associations, CAD/Office launch and save behavior, protected web/native commands,
keyboard/focus/scaling/accessibility, installer signing, managed updates and preservation of
un-checked-in work during failure. No cited API page proves those outcomes.

## 4. The three end-to-end options

### A — .NET Server + .NET Windows client/Workspace

**Shape:** C#/.NET 10 + ASP.NET Core modular monolith; PostgreSQL via aligned Npgsql/EF Core;
WPF + WebView2 Desktop; .NET Workspace.

**Evidence-based strength:** Server, native shell and Workspace share C# and the .NET runtime family.
For the current small-team context, fewer language/runtime families should reduce duplicated build,
dependency, diagnostic and patch procedures.

**Important limit:** that is `IDEA INFERENCE`, not a measured saving. React/TypeScript, PostgreSQL,
Docker and WebView2 remain separate technologies. .NET 10's support ends in 2028, WPF is
Windows-only, and company C# competence is not yet evidenced.

**Select A when:** C#/.NET skill is at least comparable to Java skill, keeping one runtime family
across Server and Windows components matters, and the WPF/WebView2 spike passes.

### B — Java/Spring Server + .NET Windows client/Workspace

**Shape:** Java 25 LTS from a named distribution + Spring Boot 4.1.x modular monolith; PostgreSQL via
pgJDBC and a qualified persistence layer; WPF + WebView2 Desktop; .NET Workspace.

**Evidence-based strength:** preserves the current Windows-client design while allowing the Server
to use the mature Spring ecosystem, its explicit modularity tooling and longer JDK runtime runway.

**Trade-off:** IDEA would maintain Java/JVM/Maven-or-Gradle/Spring on the Server and
C#/.NET/NuGet/WPF/WebView2 on Windows. `IDEA INFERENCE`: with one initial operator and no dedicated
DevOps role, two backend/client runtime families increase the number of patch feeds, build chains,
diagnostic conventions and competency paths. A stable versioned client/server contract limits
coupling but does not remove that work.

**Select B when:** existing company or maintainers' Java/Spring capability is materially stronger
than C#/.NET, or an established Java operational standard/support path outweighs the second-runtime
cost. Under those conditions B may be safer than A, not merely an acceptable fallback.

### C — Java/Spring Server + Java Desktop/Workspace

**Shape:** Java 25 LTS + Spring Boot Server; JavaFX Desktop/Workspace; JavaFX WebView/WebEngine if a
rendered React region is retained; jpackage delivery; FFM/JNI for proven native integration needs.

**Evidence-based strength:** one language/JVM family can cover Server, Desktop and Workspace;
JavaFX has current Windows artifacts, web embedding, native interop paths and native packaging.

**Trade-off:** this is not a component substitution inside the current proposal. It replaces the
WPF/WebView2 boundary with JavaFX/WebView, introduces a separately governed JavaFX support line,
and requires new evidence for the React bridge and each Windows/CAD/Office integration. Calling it
inferior would be unjustified; calling it already equivalent would also be unjustified.

**Select C when:** the organization deliberately wants a Java end-to-end skill base and an exact
prototype demonstrates the Desktop/Workspace obligations at acceptable maintenance and support
cost.

## 5. What genuinely distinguishes the choices for IDEA

| Criterion | A | B | C |
|---|---|---|---|
| Server architecture fit | Credible | Credible | Credible |
| Ubuntu/container/PostgreSQL fit | Credible | Credible | Credible |
| Runtime families for Server + native client | One .NET family | Java plus .NET | One JVM family, plus separately supported JavaFX |
| Retains current WPF/WebView2 proposal | Yes | Yes | No |
| Runtime LTS runway in cited source | .NET 10 to 2028-11-14 | Java 25 program extends materially longer | Same Java runway; JavaFX has a separate support channel |
| Company/team competence | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |
| Exact CAD/Office/native proof | `NOT-RUN` | `NOT-RUN` | `NOT-RUN` |
| Exact end-to-end operating cost | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |

The decisive facts are therefore not “Java versus .NET” in the abstract. They are:

1. who will maintain the code and which ecosystem they can review/debug safely;
2. whether one or two runtime families are acceptable during the small-team phase;
3. which Desktop/Workspace candidate passes an identical Windows/CAD/Office/security spike;
4. which exact support and licensing path the company is willing to own;
5. which candidate passes the same transaction, file-transfer, restore and patch drill.

## 6. Recommendation to carry into the Tech review

Keep **A as the current slight recommendation**, because it preserves the proposed Windows client
and minimizes runtime-family diversity under the known small-team operating context. Present it as
a conditional maintainability choice, not as “Java cannot do this.”

Keep **B as a first-class alternative**. If the user's/company's maintainable expertise and support
path are substantially Java/Spring-oriented, B should replace A for the Server despite the dual
runtime. That private organizational fact cannot be inferred from public technical sources.

Keep **C as a qualified alternative**, not a paper equivalence. Advance it only after the same
Desktop/Workspace slice is tested against WPF/WebView2 and demonstrates the required integration,
security, update and recovery behavior.

Do not use Aras's current .NET runtime as the deciding argument. It is a
`COMPETITOR OBSERVATION` showing that .NET can serve a PLM product, not an IDEA requirement. The
public DDM evidence does not establish its internal implementation language. Neither competitor
fact closes this decision.

## 7. Minimum evidence before selection

- Record the actual maintainer/company skill and support ownership for Java/Spring and C#/.NET.
- Name exact candidates: .NET 10 patch line, or Java 25 distribution/support channel plus Spring
  Boot minor line; never approve an unqualified “latest LTS”.
- Run one identical Server slice in the finalists: PostgreSQL transaction, immutable Artifact
  publication, outbox record, retry/idempotency, authorization revalidation and recovery.
- If C remains shortlisted, compare one identical Desktop/Workspace slice against A/B: signed
  install, per-user IPC, protected rendered-UI bridge, CAD/Office open-save detection, interrupted
  transfer recovery and update while local work exists.
- Produce a dependency/license inventory and a three-year patch/major-upgrade calendar for the full
  stack, not only the base runtime.
- Select only after measured results and review; current status remains `NOT-RUN`.
