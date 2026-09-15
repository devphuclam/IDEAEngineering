# IDEA Engineering Core v0 Technology Architecture View Set

| Control field | Value |
|---|---|
| Stable Document ID | `IE-ARC-TECH-VIEW-001` |
| Document class | `ARC` / Technology Architecture View Set |
| Title | IDEA Engineering Core v0 Technology Architecture View Set |
| Version / status | `0.1` / `Draft` |
| Artifact role | Focused views of the Engineering-selected Core v0 technology baseline; companion to the decision matrix and TECH-001, not a replacement for DOC-05 |
| Product normativity | `INFORMATIVE` — visualizes the selected implementation direction and creates no FTR/REQ/product behavior |
| Repository process authority / instruction state | `NOT-APPLICABLE` / `NOT-APPLICABLE` |
| Owner / author | Principal Product Author; named attribution `BLOCKED` before `Proposed` |
| Reviewer / acceptance authority | Architecture/technology review `NOT-RUN`; Product Decision Authority review and acceptance `NOT-RUN` |
| Applicable baseline | `IDEA-C1-ANALYSIS-DESIGN-001`; DOC-05@0.20; `IE-KNW-TECH-DEC-001@0.6`; `TECH-001@0.14` |
| Source / upstream trace | [`IE-STD-TECH-STACK-001@0.1`](../../../../agents/technology-stack-documentation-standard.md); [DOC-05](../DOC-05-architecture-description.md); [`IE-KNW-TECH-DEC-001@0.6`](../../../knowledge/2026-09-13-core-v0-technology-decision-matrix.md); [`TECH-001@0.14`](../decision-briefs/TECH-001-technology-and-architecture-proposal.md); accepted ADRs |
| Downstream trace | [`IE-VEV-TECH-VIEW-001`](../registers/VEV-2026-09-15-technology-architecture-view-set.md); rendered [SVG/PNG view package](../evidence/IE-VEV-TECH-VIEW-001/index.html); future implementation and release records |
| Change record | [`IE-CHG-TECH-BASELINE-001`](../registers/CHG-2026-09-15-core-v0-technology-stack-baseline.md); initial view set |
| Supersedes / superseded by | `NOT-APPLICABLE` / `NOT-APPLICABLE` |
| Review trigger | Technology baseline, deployment topology, protocol, trust boundary, build/release path or client reopen disposition changes |
| Access / retention | `INTERNAL`; retain with the technology baseline and successor history |
| Evidence status | Mermaid sources authored; rendering and standalone-SVG opening are recorded separately by `IE-VEV-TECH-VIEW-001`; a rendered image is not architecture approval |

## Reading rule and notation

These eight views answer different questions. They deliberately omit class-level design, database
tables and full domain behavior already owned by DOC-05/DOC-06. A box is a logical software/runtime
boundary unless a view explicitly labels it as a machine or deployment node. “Container” in TECH-D02
uses the C4 meaning (an application or data store), not Docker.

| Visual convention | Meaning in every view |
|---|---|
| Solid box and solid relationship | Selected Core v0 engineering direction or required relationship |
| Dashed box/relationship | Alternative, conditional, external or planned-but-not-implemented element as labelled |
| `[SELECT]`, `[ALTERNATIVE]`, `[CONDITIONAL]`, `[DEFER]`, `[REJECT CORE V0]` | Authoritative text status; color is not required to interpret it |
| Arrow | Dependency, call or transfer in the labelled direction; not a time sequence unless stated |
| Boundary | Process, trust, node or responsibility boundary named in that view |

## TECH-D01 — Technology Stack Overview

| View metadata | Recorded value |
|---|---|
| View ID / title | `TECH-D01` — Technology Stack Overview |
| Purpose | Show the selected Web, installed Windows, Server, storage and Windows-format technology families in one readable overview. |
| Stakeholders / concerns | Product Decision Authority, Engineering, IT; scope fit, principal runtimes, technology ownership and deployment shape. |
| Viewpoint / notation | Technology stack overview; Mermaid flowchart with grouped runtime boundaries. |
| Source | Matrix@0.6 sections 2/6–8; TECH-001@0.14; DOC-05 container/deployment views. |
| Current status / authority | `Draft`; Engineering baseline selected; exact technology disposition is owned by Matrix/TECH, architecture semantics by DOC-05. |
| Qualification boundary | Does not prove compatibility, security, capacity, HA, deployability or Product Decision Authority approval. Q-01…Q-14 remain `NOT-RUN`; Q-15 remains `PARTIAL / NO WINNER`. |

```mermaid
flowchart TB
    accTitle: IDEA Core v0 selected technology stack overview
    accDescr: Browser and a Windows engineering PC use one React business interface. The Windows desktop hosts it through WebView2 in a narrow WPF shell and calls a separate per-user dotnet Workspace through an authenticated named pipe. Both clients call a Java Spring Server on Ubuntu through HTTPS JSON. The Server uses PostgreSQL and a private Artifact Store and may dispatch controlled work to a separate Windows Format Worker.

    subgraph Clients[Client surfaces]
      direction LR
      Browser[Browser<br/>React 19.3 + TypeScript 7]
      subgraph WinPC[Windows engineering PC]
        direction TB
        React[React business UI<br/>Vite 8.3 build]
        WV[WebView2]
        WPF[WPF .NET 10<br/>narrow shell]
        Pipe[Authenticated and versioned<br/>Named Pipe]
        WS[Per-user .NET 10 Workspace]
        Tools[IRONCAD / Office<br/>local engineering files]
        React --> WV --> WPF --> Pipe --> WS --> Tools
      end
    end

    subgraph Linux[Ubuntu Server 26.04 LTS]
      direction TB
      Nginx[Nginx<br/>managed TLS entry]
      App[Java 25 / Temurin 25<br/>Spring Boot 4.1.x<br/>Spring Modulith 2.1.x]
      DB[(PostgreSQL 18)]
      Store[(Private Artifact Store<br/>filesystem-backed Adapter)]
      Nginx --> App
      App -->|Spring JDBC / pgJDBC| DB
      App -->|private Adapter| Store
    end

    Worker[Windows Format Worker<br/>IRONCAD / Office profile]
    Browser -->|HTTPS / JSON REST| Nginx
    React -->|HTTPS / JSON REST| Nginx
    WS -->|HTTPS / API| Nginx
    App -.->|versioned controlled contract| Worker

    classDef selected fill:#e8f1fb,stroke:#172b4d,stroke-width:2px,color:#111;
    classDef data fill:#fff,stroke:#172b4d,stroke-width:2px,color:#111;
    classDef external fill:#fffaf0,stroke:#5f6368,stroke-width:1.5px,stroke-dasharray:5 3,color:#111;
    class Browser,React,WV,WPF,Pipe,WS,Nginx,App selected;
    class DB,Store data;
    class Tools,Worker external;
```

**Text alternative.** The same React/TypeScript business UI serves Browser and Desktop. Desktop adds
WebView2, a narrow WPF .NET 10 shell and an authenticated/versioned Named Pipe to a separate per-user
.NET 10 Workspace. Browser, embedded React and Workspace call the Ubuntu-hosted Java/Spring Server
through HTTPS. The Server alone accesses PostgreSQL and the private Artifact Store and uses a
versioned contract for an isolated Windows Format Worker.

## TECH-D02 — C4 Container / Technology Boundary View

| View metadata | Recorded value |
|---|---|
| View ID / title | `TECH-D02` — C4 Container / Technology Boundary View |
| Purpose | Identify the independently running applications/data stores and the technology/protocol crossing each boundary. |
| Stakeholders / concerns | Architecture, implementation, security and operations reviewers; executable ownership, trust and integration seams. |
| Viewpoint / notation | C4-style Container view rendered with Mermaid flowchart notation; a C4 Container is not a Docker container. |
| Source | DOC-05 `ARCH-VIEW-CON-001`; Matrix@0.6; TECH-001@0.14. |
| Current status / authority | `Draft`; DOC-05 owns container responsibilities; Matrix/TECH own exact selected technologies. |
| Qualification boundary | Does not establish process count under load, ports, host count, network rules, capacity or HA. |

```mermaid
flowchart TB
    accTitle: C4 style container and technology boundaries for IDEA Core v0
    accDescr: An engineer uses either a browser or the IDEA Desktop. The Desktop contains a narrow WPF and WebView2 host for the React interface. A separate Workspace process manages local engineering files and tools. All protected product calls go to one IDEA Server. The Server owns product coordination and uses PostgreSQL, a private Artifact Store and a separate Format Worker through labelled contracts.

    Engineer([Engineer])
    Browser[Container: Browser Workbench<br/>React + TypeScript]
    Desktop[Container: IDEA Desktop<br/>WPF .NET 10 + WebView2 + React]
    Workspace[Container: IDEA Workspace<br/>per-user .NET 10 process]
    Server[Container: IDEA Server<br/>Java 25 + Spring Boot + Modulith]
    Database[(Container: PostgreSQL 18<br/>authoritative relational data)]
    Artifacts[(Container: Artifact Store<br/>private immutable bytes)]
    Worker[Container: Format Worker<br/>Windows-native processing]
    Apps[External systems<br/>IRONCAD / Office]

    Engineer -->|uses| Browser
    Engineer -->|uses| Desktop
    Browser -->|HTTPS JSON REST| Server
    Desktop -->|HTTPS JSON REST| Server
    Desktop -->|authenticated versioned Named Pipe| Workspace
    Workspace -->|HTTPS API| Server
    Workspace -->|approved file/process interaction| Apps
    Server -->|JDBC| Database
    Server -->|private storage Adapter| Artifacts
    Server <--> |versioned controlled Adapter/API| Worker
    Worker -->|licensed format operation| Apps

    classDef person fill:#fff,stroke:#111,stroke-width:2px,color:#111;
    classDef selected fill:#e8f1fb,stroke:#172b4d,stroke-width:2px,color:#111;
    classDef data fill:#fff,stroke:#172b4d,stroke-width:2px,color:#111;
    classDef external fill:#fffaf0,stroke:#5f6368,stroke-width:1.5px,stroke-dasharray:5 3,color:#111;
    class Engineer person;
    class Browser,Desktop,Workspace,Server selected;
    class Database,Artifacts data;
    class Worker,Apps external;
```

**Text alternative.** The running containers are Browser Workbench, IDEA Desktop, IDEA Workspace,
IDEA Server, PostgreSQL, Artifact Store and Format Worker. IRONCAD/Office are external. Product calls
use HTTPS JSON; the Desktop-to-Workspace seam uses an authenticated/versioned Named Pipe; Server data
access uses JDBC and a private storage Adapter; format work uses a versioned controlled contract.

## TECH-D03 — Technology Layer Mapping

| View metadata | Recorded value |
|---|---|
| View ID / title | `TECH-D03` — Technology Layer Mapping |
| Purpose | Map each selected technology to its bounded responsibility and show where IDEA domain authority remains. |
| Stakeholders / concerns | Developers and architecture reviewers; framework role, domain ownership and prevention of accidental authority leakage. |
| Viewpoint / notation | Responsibility/layer mapping; Mermaid flowchart. |
| Source | Matrix@0.6 selected-stack records; DOC-05 Module ownership; accepted ADRs C1-003…006. |
| Current status / authority | `Draft`; Matrix/TECH own selection, DOC-05 owns business authority and Module boundaries. |
| Qualification boundary | Does not prescribe classes/packages or prove that module checks and runtime controls are implemented. |

```mermaid
flowchart TB
    accTitle: Technology to responsibility layer mapping
    accDescr: The presentation layer uses React and TypeScript, a narrow Windows shell uses WPF and WebView2, and local integration belongs to the dotnet Workspace. Spring Boot hosts API and application coordination while Spring Modulith checks module structure. Spring Security authenticates, IDEA Access Policy authorizes, Spring JDBC and PostgreSQL persist relational state, Flyway controls schema change, Artifact Custody controls bytes, and systemd Nginx and telemetry support operations.

    P[Presentation<br/>React + TypeScript<br/><b>renders business UI only</b>]
    Shell[Windows native shell<br/>WPF + WebView2<br/><b>hosts approved intents only</b>]
    Local[Local integration<br/>.NET Workspace<br/><b>owns local custody and tool launch</b>]
    API[API and application<br/>Spring Boot<br/><b>hosts use cases and REST boundary</b>]
    Modules[Module structure<br/>Spring Modulith<br/><b>checks boundaries; IDEA Modules own state</b>]
    Security[Security<br/>Spring Security + IDEA Access Policy<br/><b>authentication is not product authorization</b>]
    Persist[Persistence<br/>Spring JDBC / JdbcClient / pgJDBC<br/><b>owner Modules own SQL and mappings</b>]
    Migration[Migration<br/>Flyway + reviewed SQL<br/><b>sole schema-change authority</b>]
    Data[(Relational data<br/>PostgreSQL 18)]
    Custody[Artifact custody<br/>private filesystem Adapter<br/><b>owns immutable bytes, not Product Definition</b>]
    Ops[Operations<br/>Nginx + systemd + telemetry + backup]

    P --> Shell --> Local
    P --> API
    Local --> API
    API --> Modules --> Security --> Persist --> Data
    Migration --> Data
    Modules --> Custody
    Ops -. supervises and observes .-> API
    Ops -. protects and recovers .-> Data
    Ops -. protects and recovers .-> Custody

    classDef selected fill:#e8f1fb,stroke:#172b4d,stroke-width:2px,color:#111;
    classDef authority fill:#fff,stroke:#172b4d,stroke-width:2px,color:#111;
    class P,Shell,Local,API,Modules,Security,Persist,Migration,Ops selected;
    class Data,Custody authority;
```

**Text alternative.** React/TypeScript owns presentation; WPF/WebView2 only hosts the installed UI;
Workspace owns local custody and tool launch. Spring Boot hosts APIs/use cases, Modulith checks rather
than creates Module ownership, Spring Security authenticates and IDEA Access Policy authorizes.
Owner Modules retain SQL/state authority through JDBC/PostgreSQL; Flyway owns schema migration;
Artifact Custody owns bytes; Nginx/systemd/telemetry/backup are operational mechanisms.

## TECH-D04 — Runtime & Protocol View

| View metadata | Recorded value |
|---|---|
| View ID / title | `TECH-D04` — Runtime & Protocol View |
| Purpose | Make every selected process-to-process protocol and principal trust boundary explicit. |
| Stakeholders / concerns | Security, implementation and integration reviewers; authentication, versioning, protocol ownership and refusal boundaries. |
| Viewpoint / notation | Runtime communication/data-flow view; Mermaid flowchart with trust-zone grouping. |
| Source | DOC-05 security/container views; Matrix@0.6 sections 5–8; TECH-001@0.14. |
| Current status / authority | `Draft`; protocol families selected by Engineering; detailed contracts and security controls remain owned by DOC-04/05/06. |
| Qualification boundary | Does not assert TLS, origin, Named Pipe authentication, JDBC, worker or large-file tests have passed. |

```mermaid
flowchart TB
    accTitle: IDEA Core v0 runtimes protocols and trust boundaries
    accDescr: Browser React and embedded React call the Spring Server with versioned HTTPS JSON REST. Embedded React sends allowlisted structured messages to WPF. WPF calls the per-user Workspace using an authenticated and versioned Named Pipe. Workspace calls the Server through HTTPS. Server uses JDBC to PostgreSQL, a private Adapter to the Artifact Store and a versioned integration contract to the Windows Format Worker.

    subgraph UntrustedUI[Web trust zone]
      BReact[Browser React runtime]
      EReact[Embedded React runtime]
    end
    subgraph NativeUser[Windows user zone]
      WPF[WPF host process]
      WS[Per-user Workspace process]
    end
    subgraph ServerZone[Server trust zone]
      Spring[Spring Server process]
      PG[(PostgreSQL process)]
      FS[(Artifact storage Adapter/volume)]
    end
    subgraph WorkerZone[Worker isolation zone]
      FW[Windows Format Worker]
    end

    BReact -->|HTTPS JSON REST<br/>OpenAPI 3.1 contract| Spring
    EReact -->|HTTPS JSON REST<br/>OpenAPI 3.1 contract| Spring
    EReact -->|allowlisted structured<br/>WebView2 message| WPF
    WPF -->|authenticated + versioned<br/>Named Pipe| WS
    WS -->|HTTPS API<br/>session and operation scope| Spring
    Spring -->|JDBC / pgJDBC| PG
    Spring -->|private provider-neutral Adapter| FS
    Spring <--> |versioned job/result contract| FW

    classDef selected fill:#e8f1fb,stroke:#172b4d,stroke-width:2px,color:#111;
    classDef data fill:#fff,stroke:#172b4d,stroke-width:2px,color:#111;
    class BReact,EReact,WPF,WS,Spring,FW selected;
    class PG,FS data;
```

**Text alternative.** React-to-Server and Workspace-to-Server calls use versioned HTTPS JSON REST.
Embedded React crosses an allowlisted WebView2 message boundary into WPF. WPF crosses a separate
authenticated/versioned Named Pipe boundary to Workspace. Server alone uses JDBC to PostgreSQL and
a private Adapter to Artifact storage; its Format Worker exchange uses a versioned contract.

## TECH-D05 — Deployment View

| View metadata | Recorded value |
|---|---|
| View ID / title | `TECH-D05` — Deployment View |
| Purpose | Place selected deployables on initial machines and show failure-domain and backup boundaries. |
| Stakeholders / concerns | IT, operations, security and release reviewers; installation, supervision, recovery and availability claims. |
| Viewpoint / notation | C4-style Deployment view rendered with Mermaid flowchart notation. |
| Source | DOC-05 deployment/recovery views; Matrix@0.6 section 8; TECH-001@0.14. |
| Current status / authority | `Draft`; Engineering-selected initial topology, subject to company/PDA review and Q-07/Q-14. |
| Qualification boundary | **Core v0 baseline is not HA.** Host sizing, network policy, production entitlement, restore result and operating approval remain unqualified. |

```mermaid
flowchart TB
    accTitle: Initial Core v0 deployment with explicit non high availability boundary
    accDescr: Engineer Windows computers run a browser, WPF WebView2 Desktop, per-user Workspace and external engineering tools. Other company devices may use the browser. One Ubuntu Server virtual machine runs Nginx, Temurin and Spring Boot, PostgreSQL and the private Artifact volume. A separate Windows host may run the Format Worker. A separate failure-domain backup target receives coordinated database artifact configuration policy and key backups. The single server virtual machine is explicitly not high availability.

    subgraph EngineerPC[Engineer Windows PC]
      Browser[Browser]
      Desktop[IDEA Desktop<br/>WPF + WebView2]
      Workspace[IDEA Workspace<br/>per-user .NET 10]
      CAD[IRONCAD / Office]
      Desktop --> Workspace --> CAD
    end

    CompanyBrowser[Node: Company browser client]

    subgraph ServerVM[Ubuntu Server 26.04 VM]
      NoHA[Deployment boundary<br/><b>SINGLE FAILURE DOMAIN — NOT HA</b>]
      Proxy[Nginx / managed TLS]
      Server[Temurin 25<br/>Spring Boot executable JAR<br/>systemd]
      DB[(PostgreSQL 18)]
      Store[(Protected Artifact volume)]
      NoHA --> Proxy --> Server
      Server --> DB
      Server --> Store
    end

    subgraph FormatHost[Windows Format Worker host]
      Worker[Versioned worker/Adapter]
      Licensed[Licensed IRONCAD / Office]
      Worker --> Licensed
    end

    Backup[(Node: controlled backup target<br/>SEPARATE FAILURE DOMAIN)]

    Browser -->|HTTPS| Proxy
    CompanyBrowser -->|HTTPS| Proxy
    Workspace -->|HTTPS| Proxy
    Server <--> |controlled contract| Worker
    DB -. base backup + WAL/PITR .-> Backup
    Store -. immutable Artifact backup .-> Backup
    Server -. config / policy / key set .-> Backup

    classDef selected fill:#e8f1fb,stroke:#172b4d,stroke-width:2px,color:#111;
    classDef external fill:#fffaf0,stroke:#5f6368,stroke-width:1.5px,stroke-dasharray:5 3,color:#111;
    classDef warning fill:#fff,stroke:#111,stroke-width:3px,color:#111;
    class Browser,Desktop,Workspace,Proxy,Server,DB,Store selected;
    class CompanyBrowser,Worker,Licensed external;
    class NoHA,Backup warning;
```

**Text alternative.** Windows engineer PCs run Browser/Desktop/Workspace and external tools. One
Ubuntu VM runs Nginx, Spring Boot/Temurin, PostgreSQL and the protected Artifact volume. An optional
separate Windows host runs licensed format processing. Coordinated database, Artifact,
configuration/policy and key material goes to another failure domain. The single VM is not HA.

## TECH-D06 — Technology Dependency View

| View metadata | Recorded value |
|---|---|
| View ID / title | `TECH-D06` — Technology Dependency View |
| Purpose | Show permitted direct technology dependency direction without listing transitive packages or creating cycles. |
| Stakeholders / concerns | Developers, maintainers and supply-chain reviewers; coupling, replaceable seams and dependency authority. |
| Viewpoint / notation | Technology dependency view; Mermaid flowchart. |
| Source | Matrix@0.6 dependency classes; DOC-05 deep-Module rules; ADR C1-003. |
| Current status / authority | `Draft`; selected dependency direction, not package-level implementation evidence. |
| Qualification boundary | Does not prove resolved dependency versions, license/SBOM completeness or Modulith boundary tests. |

```mermaid
flowchart TB
    accTitle: Selected direct technology dependency directions
    accDescr: React and TypeScript depend on the versioned REST contract rather than domain modules. The WPF shell depends on WebView2 and a Workspace client contract. Workspace depends on the named-pipe protocol and the Server API contract. The Spring application hosts IDEA domain modules, which use Spring Modulith boundary checks and owner interfaces. Persistence uses Spring JDBC JdbcClient then pgJDBC then PostgreSQL. Flyway is the separate schema migration authority. Domain modules do not depend on React WPF WebView2 or Workspace technology.

    UI[React + TypeScript UI] --> REST[Versioned REST / OpenAPI contract]
    WPF[WPF narrow shell] --> WV[WebView2]
    WPF --> WSC[Workspace client contract]
    WSC --> Pipe[Authenticated Named Pipe protocol]
    WS[.NET Workspace] --> Pipe
    WS --> REST

    REST --> Boot[Spring Boot application boundary]
    Boot --> Domain[IDEA domain Modules<br/><b>NO client-technology dependency</b>]
    Domain --> Modulith[Spring Modulith<br/>boundary verification]
    Domain --> OwnerPorts[Owner Interfaces]
    OwnerPorts --> JDBC[Spring JDBC / JdbcClient]
    JDBC --> Driver[pgJDBC]
    Driver --> PG[(PostgreSQL 18)]
    Flyway[Flyway + reviewed SQL] --> PG
    OwnerPorts --> Artifact[Artifact Store Interface]
    Artifact --> FS[(Filesystem-backed Adapter)]

    classDef selected fill:#e8f1fb,stroke:#172b4d,stroke-width:2px,color:#111;
    classDef contract fill:#fff,stroke:#111,stroke-width:2px,color:#111;
    class UI,WPF,WV,WS,Boot,Domain,Modulith,JDBC,Driver,Flyway selected;
    class REST,WSC,Pipe,OwnerPorts,Artifact,PG,FS contract;
```

**Text alternative.** Client technologies depend on REST or Workspace contracts and never on IDEA
domain Modules. WPF depends on WebView2 and the Workspace client contract; Workspace implements the
Named Pipe side and consumes the Server API. Spring Boot hosts domain Modules; Modulith checks their
boundaries. Owner Interfaces lead to JDBC/pgJDBC/PostgreSQL or Artifact Store Interface/adapter.
Flyway separately controls schema migration. No dependency cycle is intended.

## TECH-D07 — Build / Packaging / Deployment Pipeline

| View metadata | Recorded value |
|---|---|
| View ID / title | `TECH-D07` — Build / Packaging / Deployment Pipeline |
| Purpose | Show the selected build outputs and required release controls before deployment to each runtime family. |
| Stakeholders / concerns | Engineering, release, security and operations; reproducibility, provenance, signing, SBOM, package ownership and rollback. |
| Viewpoint / notation | Build/release pipeline design; Mermaid flowchart. |
| Source | Matrix@0.6 build/deployment decisions; TECH-001@0.14; standards register supply-chain guidance. |
| Current status / authority | `SELECTED DESIGN / IMPLEMENTATION NOT-RUN`; Engineering baseline selected, no CI/release-pipeline PASS. |
| Qualification boundary | The diagram is a design. It does not claim CI, signing, SBOM generation, package publication, migration or rollback is implemented. |

```mermaid
flowchart TB
    accTitle: Selected design for Core v0 build packaging and deployment pipeline
    accDescr: Controlled source feeds Maven Wrapper for the Server JAR, npm and Vite for React assets, and dotnet for WPF Workspace and Worker binaries. Outputs pass through versioning dependency inventory SBOM checksums signing and release review before a release bundle is assembled. The bundle deploys separately to Linux Server Windows Client and Windows Worker targets. Every stage is selected design with implementation not run.

    Source[(Controlled source<br/>SELECTED DESIGN)]
    Maven[Maven Wrapper + Boot BOM]
    Npm[npm ci + Vite 8.3<br/>Node 22 LTS build line]
    Dotnet[dotnet build/publish<br/>.NET 10]

    Jar[Server executable JAR]
    Web[React static assets]
    Windows[WPF + Workspace<br/>and Worker binaries]

    Controls[Release controls<br/>version + dependency inventory + SBOM<br/>checksums + signing + review<br/><b>IMPLEMENTATION NOT-RUN</b>]
    Package[Signed/versioned release bundles<br/><b>IMPLEMENTATION NOT-RUN</b>]

    Linux[Linux Server target<br/>systemd + host Temurin + Nginx]
    Client[Windows Client target<br/>WPF + WebView2 + Workspace]
    Worker[Windows Worker target<br/>licensed format profile]

    Source --> Maven --> Jar --> Controls
    Source --> Npm --> Web --> Controls
    Source --> Dotnet --> Windows --> Controls
    Controls --> Package
    Package -. deploy and verify .-> Linux
    Package -. deploy and verify .-> Client
    Package -. deploy and verify .-> Worker

    classDef design fill:#e8f1fb,stroke:#172b4d,stroke-width:2px,color:#111;
    classDef notrun fill:#fff,stroke:#111,stroke-width:2px,stroke-dasharray:6 3,color:#111;
    class Source,Maven,Npm,Dotnet,Jar,Web,Windows design;
    class Controls,Package,Linux,Client,Worker notrun;
```

**Text alternative.** Controlled source has three selected build lanes: Maven Wrapper creates the
Server JAR, npm/Vite creates React assets and dotnet creates WPF/Workspace/Worker binaries. Planned
release controls add versioning, dependency inventory, SBOM, checksums, signing and review before
separate Linux Server, Windows Client and Windows Worker bundles are deployed. These controls and
deployments are `IMPLEMENTATION NOT-RUN`, not a claim that CI exists.

## TECH-D08 — Technology Decision & Reopen Map

| View metadata | Recorded value |
|---|---|
| View ID / title | `TECH-D08` — Technology Decision & Reopen Map |
| Purpose | Show current Client and Server dispositions and the controlled route for reconsidering a non-selected candidate. |
| Stakeholders / concerns | Product Decision Authority, Engineering and architecture reviewers; decision finality, viable alternatives and change triggers. |
| Viewpoint / notation | Decision and evolution map; Mermaid flowchart. Status is written in every node and reinforced with solid/dashed borders. |
| Source | Matrix@0.6 sections 3/6 and reopen register; TECH-001@0.14; `IE-CHG-TECH-BASELINE-001`. |
| Current status / authority | `Draft`; Engineering decision `COMPLETE`, Core v0 baseline `SELECTED`, Product Decision Authority `NOT-RUN`. |
| Qualification boundary | Q-15 remains `PARTIAL / NO WINNER`; this map does not turn any candidate into a Q-15 winner or any Engineering disposition into approval. |

```mermaid
flowchart TB
    accTitle: Core v0 technology decisions and controlled reopen paths
    accDescr: Engineering selects React WPF WebView2 and dotnet Workspace for the Core v0 client. Flutter is an evaluated alternative not selected for Core v0 and can return only through one of eight named triggers. Tauri remains an alternative with deferred qualification, browser-only with Workspace requires a product decision, and Electron is rejected for Core v0. Engineering selects Java and Spring for Server while dotnet and ASP.NET Core remain an alternative with named reopen triggers. Q15 remains partial with no winner and Product Decision Authority approval remains not run.

    Q15[Q-15 experiment<br/><b>PARTIAL / NO WINNER</b>]
    Eng[Broader Engineering evaluation<br/>scope + architecture + evidence + operations + opportunity cost]
    Q15 --> Eng

    subgraph Client[Client decision]
      A[[React + WPF + WebView2<br/>+ .NET Workspace<br/><b>SELECT — CORE V0 ENGINEERING BASELINE</b>]]
      B[Flutter Web + Windows + Dart<br/>+ narrow C++ shim + .NET Workspace<br/><b>EVALUATED ALTERNATIVE — NOT SELECTED CORE V0</b>]
      T[Tauri + React + Workspace<br/><b>ALTERNATIVE / DEFER QUALIFICATION</b>]
      C[Browser-only + Workspace<br/><b>CONDITIONAL — PRODUCT DECISION REQUIRED</b>]
      E((Electron<br/><b>REJECT FOR CORE V0</b>))
      Triggers[TRIGGER-CLIENT-01…08<br/>approved scope, mandatory failure<br/>or material accepted advantage]
      B -. reopen only on .-> Triggers
      Triggers -. successor decision .-> A
    end

    subgraph Server[Server decision]
      J[[Java 25 + Spring Boot/Modulith<br/><b>SELECT</b>]]
      N[.NET 10 + ASP.NET Core<br/><b>ALTERNATIVE</b>]
      ST[Reopen: mandatory Java qualification gap,<br/>unsustainable two-runtime burden,<br/>or safer supported company .NET platform]
      N -. reconsider on .-> ST
      ST -. successor decision .-> J
    end

    Eng --> A
    Eng --> B
    Eng --> T
    Eng --> C
    Eng --> E
    Eng --> J
    Eng --> N
    PDA[Product Decision Authority<br/><b>NOT-RUN</b>]
    A -. submitted for review .-> PDA
    J -. submitted for review .-> PDA

    classDef selected fill:#e8f1fb,stroke:#111,stroke-width:3px,color:#111;
    classDef alternative fill:#fff,stroke:#111,stroke-width:2px,stroke-dasharray:6 3,color:#111;
    classDef rejected fill:#fff,stroke:#111,stroke-width:3px,color:#111;
    classDef state fill:#fffaf0,stroke:#5f6368,stroke-width:1.5px,color:#111;
    class A,J selected;
    class B,T,C,N alternative;
    class E rejected;
    class Q15,Eng,Triggers,ST,PDA state;
```

**Text alternative.** Q-15 contributes `PARTIAL / NO WINNER` evidence to a broader Engineering
decision. Engineering selects React + WPF/WebView2 + .NET Workspace for Core v0. Flutter remains an
evaluated alternative and returns only through TRIGGER-CLIENT-01…08. Tauri remains an alternative,
browser-only requires a Product decision and Electron is rejected only for Core v0. Java/Spring is
the selected Server direction; .NET/ASP.NET Core remains reopenable. PDA approval is `NOT-RUN`.

## Client reopen trigger register

| Trigger | Observable condition | Decision effect and evidence needed |
|---|---|---|
| `TRIGGER-CLIENT-01` | Android or iOS becomes a first-class approved Product requirement. | Reopen Flutter and other viable cross-platform candidates against the approved mobile scope. |
| `TRIGGER-CLIENT-02` | macOS or Linux Desktop becomes a first-class approved Product requirement. | Reopen the installed-client choice using the exact target platforms and engineering-tool constraints. |
| `TRIGGER-CLIENT-03` | React/WPF/WebView2 has a measured mandatory security defect that cannot be mitigated acceptably. | Reopen with retained threat/test evidence and an approved risk disposition; do not infer Flutter automatically passes. |
| `TRIGGER-CLIENT-04` | The selected client fails an approved mandatory performance requirement. | Compare viable candidates on the same approved workload/configuration and retained measurements. |
| `TRIGGER-CLIENT-05` | The selected client fails an approved mandatory accessibility requirement. | Compare exact Web/Windows assistive behavior with specialist-reviewed evidence. |
| `TRIGGER-CLIENT-06` | Web ceases to be a first-class Product surface. | Re-evaluate the value of a shared DOM/React business UI and all viable native/cross-platform options. |
| `TRIGGER-CLIENT-07` | Measured WPF/WebView2/native-bridge maintenance burden materially exceeds a management-accepted threshold. | Reopen using named ownership, incident, patch, onboarding, build and lifecycle evidence; no arbitrary threshold is invented here. |
| `TRIGGER-CLIENT-08` | A future controlled qualification demonstrates a material total-cost/risk advantage for Flutter. | Create a successor decision using the same mandatory behavior/security/custody gates and obtain the applicable approvals. |

The eight triggers keep Flutter viable without making its unresolved Phase 3 environment work a
Core v0 blocker. A trigger opens a review; it does not automatically switch the baseline.

## View-set version history

| Version | Date | Status | Change |
|---|---|---|---|
| `0.1` | 2026-09-15 | Draft | Initial TECH-D01…D08 set for the Engineering-selected Core v0 baseline; Q-15 remains `PARTIAL / NO WINNER`, PDA and PG states unchanged |
