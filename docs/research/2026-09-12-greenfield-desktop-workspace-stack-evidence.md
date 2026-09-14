# Greenfield Desktop and Workspace stack evidence for IDEA Engineering

| Control field | Value |
|---|---|
| Stable Research ID | `IE-RES-TECH-DESKTOP-20260912-001` |
| Document class / version / status | `RESEARCH-COMPARISON` / `0.1` / `Draft` |
| Product normativity | `INFORMATIVE`; Desktop/Workspace candidates are not an approved Tech choice |
| Repository process authority / instruction state | `NOT-APPLICABLE` / `NOT-APPLICABLE` |
| Owner / author | Principal Product Author; named person attribution `BLOCKED` before `Proposed` |
| Reviewer / acceptance authority | Project user for internal review; Product Decision Authority acceptance `NOT-RUN` |
| Applicable baseline | `IDEA-C1-ANALYSIS-DESIGN-001`; Windows Desktop/Workspace candidate comparison |
| Evidence date / control update | 2026-09-12; dated source addendum 2026-09-13 / control update 2026-09-14 |
| Classification / retention | `INTERNAL`; retain with the Tech evidence chain |
| Source / upstream trace | Official client/runtime sources cited per claim; [DOC-05](../product/instances/idea-engineering/DOC-05-architecture-description.md) and [DOC-08](../product/instances/idea-engineering/DOC-08-ui-ux-and-interaction-specification.md) for IDEA boundaries |
| Downstream trace | [Technology evidence synthesis](2026-09-13-technology-selection-evidence-synthesis.md), [technology decision matrix](../product/knowledge/2026-09-13-core-v0-technology-decision-matrix.md) |
| Change record / predecessor | [IE-CHG-DOC-REVIEW-001](../product/instances/idea-engineering/registers/CHG-2026-09-14-post-pull-document-review-corrections.md); previously uncontrolled note SHA-256 `e5a345ba8c3cd84441387a34d6e482b03816eb3b2ec36ca57782ce143176dbcb` |
| Supersession / review trigger | No controlled predecessor; review when supported client runtimes or approved Workspace constraints change |
| Evidence status | Dated first-party publication facts and IDEA inferences; installed-client and security qualification `NOT-RUN` |

Control tailoring under `IE-STD-AUTH-001@0.2`: this comparison preserves source dates, limitations
and decision trace. It has no independent product requirement, effective product date, controlled
predecessor version or executed client result.

**Evidence snapshot:** 2026-09-12  
**Question:** Starting from a clean slate, which client architecture and technology candidates best
fit IDEA Engineering's Windows Desktop and Managed Workspace obligations, without assuming .NET?

## Disposition

Q18 is **not decided**, and the earlier WPF/.NET 10/WebView2 labels are not a user decision. They are
explicitly unapproved Tech candidates in [DOC-05](../product/instances/idea-engineering/DOC-05-architecture-description.md)
and [DOC-08](../product/instances/idea-engineering/DOC-08-ui-ux-and-interaction-specification.md).

The first decision is architectural, not linguistic:

1. a Web/React workbench plus a separately installed, signed, per-user Workspace agent;
2. an installed Web-rendered shell plus a separately protected Workspace process; or
3. a fully native UI plus a separately protected Workspace process.

Only after that choice should IDEA select the shell toolkit and Workspace runtime. The Server,
Desktop shell and Workspace engine do not need the same runtime. A Java Server with a .NET or Rust
Windows agent is a coherent system when the HTTPS and Workspace contracts remain explicit.

The current draft SRS nevertheless names all three `Web`, `Desktop` and `Web-rendered Desktop`
surface cells in `REQ-UX-001` and its locale matrix. Therefore option 1 is **not** a technology-only
substitution if it removes the installed Desktop/Web-rendered Desktop surface. It would first need
an explicit Spec/surface-scope decision and corresponding SRS, architecture, UX and VVP updates. An
ordinary browser plus agent must not be described as already satisfying a required Web-rendered
Desktop cell.

The evidence supports this greenfield shortlist for qualification:

| Priority | Architecture candidate | Why it remains |
|---|---|---|
| `S1` | **React workbench in the managed browser + signed per-user Workspace agent**, with .NET 10 and Rust implemented as competing agent spikes | Maximizes reuse of the already proposed Web UI and removes an embedded Web/native bridge. .NET has the best evidenced first-party Windows IPC, credential-protection and COM path; Rust is a credible small native-agent alternative. Browser-to-agent discovery, authentication and lifecycle are still a mandatory security gate. If the installed Desktop/Web-rendered Desktop surface is removed, S1 also requires an upstream Spec decision; it cannot be selected as a Tech-only equivalent. |
| `S2` | **Tauri 2 + React shell + Rust Workspace process/sidecar** | Reuses React, uses Windows WebView2 rather than shipping another Chromium, and supplies a capability-scoped bridge and signed updater. It remains conditional because neither Tauri nor Rust offers the multi-year LTS contract found in .NET/Java, and exact Windows/CAD integration is unproved. |
| `S3` | **WinUI 3 or WPF + WebView2 shell + .NET 10 Workspace process** | Has the strongest first-party Windows integration and security primitives. It is justified only if an installed integrated shell produces material UX/operational value over S1. WinUI and WPF are separate sub-candidates: Microsoft recommends WinUI 3 for new native Windows apps, while WPF is the mature Windows-only framework. |

Electron is retained as a **comparison control**, not the leading recommendation: it has excellent
React compatibility, documented isolation patterns and an updater, but IDEA would own an eight-week
major-version cadence while distributing Chromium and Node with the application. JavaFX remains a
valid **conditional candidate**, not a claim that Java is weak: it must first close the JavaFX
WebKit, Windows per-user IPC, signed auto-update and CAD/Office native-integration gaps. Qt/C++ is
only a contingency if an exact CAD SDK or COM-heavy adapter makes its native integration decisive.

This is not a final stack approval. The shortlist must pass the prototype gates in this note before
one complete proposal can be put to management.

## Evidence classes

| Normalized class | Historical label / meaning in this note |
|---|---|
| `OFFICIAL-PRODUCT-FACT` / `OFFICIAL-LIFECYCLE-LICENSING` | `OFFICIAL FACT`: a current IDEA document or first-party project/vendor source states a requirement, capability, lifecycle, packaging or license fact. |
| `IDEA-INFERENCE` | A consequence reasoned from IDEA's confirmed product boundary and cited official facts; it is not vendor fact or approval. |
| `QUALIFICATION-UNKNOWN` | `QUALIFICATION UNKNOWN`: IDEA has not demonstrated the result on the exact Windows, CAD/Office, installer, network, file corpus and security configuration. |
| `FORMAL-STANDARD` / `INDUSTRY-SPECIFICATION` | A cited standard/specification contract; it does not select a client toolkit. |
| `COMPETITOR-OBSERVATION` | Evidence about Aras/DDM or another product; it cannot create an IDEA requirement. |

No generic benchmark, popularity claim or vendor slogan is treated as selection evidence. Runtime
RAM, start time, package size and multi-GB behavior remain unknown until the same IDEA vertical slice
is measured on the same machine.

## 1. What the product actually obliges the client to do

| Confirmed obligation | Evidence and architectural consequence |
|---|---|
| Windows engineering PCs, browser/Desktop surfaces and ordinary Office/CAD applications | `OFFICIAL FACT`: DOC-08 identifies company Windows desktops and browser/Desktop use. `IDEA INFERENCE`: cross-platform desktop reach has no current product value by itself; Windows integration and managed rollout evidence should carry more weight. |
| Open and save outside IDEA | `OFFICIAL FACT`: `REQ-WS-004` and `REQ-FMT-004` require verified materialization followed by OS-association launch; IDEA code is not assumed inside the design application. `IDEA INFERENCE`: all candidates can satisfy the baseline through an OS open operation. COM, add-ins and in-process CAD integration are not selection requirements today. |
| Durable local custody | `OFFICIAL FACT`: `REQ-WS-008/010/011/013/014` require failed, stale, revoked or interrupted work to remain locally safe, with explicit recovery instead of overwrite or automatic CAD/Office merge. `IDEA INFERENCE`: Workspace durability and update/crash isolation matter more than the shell's visual toolkit. |
| Multi-GB, resumable transfer | `OFFICIAL FACT`: `REQ-WS-012/015`, DOC-06 `DATA-REL-031` and `UX-JRN-002/003` require digest-verified streaming chunks/ranges, resume without whole-file buffering and idempotent Operation/Transfer identities. `IDEA INFERENCE`: every candidate needs application-level staging, hashing and a durable transfer journal; no UI framework supplies the correctness contract. |
| A protected per-user Workspace boundary | `OFFICIAL FACT`: `REQ-SEC-003` and DOC-05 `IF-WORKSPACE-IPC` prohibit another user/session from reading or commanding the Workspace. DOC-05's candidate is a per-user process, not a privileged machine-wide service. `IDEA INFERENCE`: OS-user ACLs are necessary but not sufficient; messages still need protocol versioning, authentication, replay handling and Workspace/session scope. |
| A narrow Web/native boundary when a Web-rendered shell exists | `OFFICIAL FACT`: DOC-05 requires approved origins/frames, allowlisted versioned messages, validation of every navigation/message and no generic host object, filesystem or shell proxy. `IDEA INFERENCE`: an embedded renderer is a privileged boundary, not merely a way to reuse React. |
| Signed, recoverable delivery | `OFFICIAL FACT`: DOC-05 requires versioned bundles, license inventory, protected configuration, representative preflight, signing where policy requires, and rollback/recovery that preserves the Workspace. `QUALIFICATION UNKNOWN`: company certificate, installer authority, admin/per-user install policy, offline policy and update channel are not approved. |
| Equivalent meanings across surfaces | `OFFICIAL FACT`: `REQ-UX-001`, DOC-08's shared semantic contracts and VVP-009 require Web, Desktop and Web-rendered Desktop to preserve product meanings. DOC-05 currently shows React as a Tech candidate, not an approved requirement. `IDEA INFERENCE`: React reuse is valuable because it can reduce duplicate presentation logic, but semantic-contract reuse is mandatory even if the native view code differs. |
| Future enterprise scale | `OFFICIAL FACT`: the catalogue states 50–100 intended users, individual multi-GB Artifacts and an open future capacity envelope; VVP evidence is still `NOT-RUN`. `IDEA INFERENCE`: server/database/storage architecture governs concurrent enterprise scale. Client choice governs per-PC resource use, transfer durability, security and rollout fleet cost; choosing Java, .NET or Rust on the client does not by itself make the Server scale. |

## 2. Keep the decisions separate

| Decision layer | Alternatives | What must decide it |
|---|---|---|
| UI delivery | managed browser; installed Web-rendered shell; full native shell | Engineer journey, offline/startup needs, SSO, browser-to-agent friction, accessibility and support burden |
| Renderer | managed Edge; Evergreen/Fixed WebView2; bundled Chromium; JavaFX WebKit; no Web renderer | React compatibility, security ownership, patch source and offline deployment policy |
| Workspace process | separate per-user executable; shell process plus separate sidecar | Crash/update isolation, local-work survival, per-user custody and diagnosability |
| Workspace runtime | .NET 10; Rust stable; Java 25; Node/Electron; C++/Qt | Windows primitives, file/transfer proof, support cadence, native adapter needs and team qualification |
| Local command channel | named pipe/local socket; authenticated loopback; extension native messaging; one-time protocol launch plus server-mediated coordination | Cross-user/same-user attack tests, session binding, discoverability, browser policy and recoverability |
| Delivery | MSIX/WiX/other signed installer; jpackage; Electron Forge; Tauri MSI/NSIS; Qt Installer Framework | IT authority, certificate custody, per-user install, offline bootstrap, staged update, rollback and Workspace compatibility |

`IDEA INFERENCE`: selecting “Java versus .NET” before these layers would silently combine several
independent decisions. It would also make server-language preference stand in for Windows-client
evidence.

## 3. Candidate evidence

### 3.1 Full native .NET shell plus .NET Workspace

- `OFFICIAL FACT`: Microsoft currently recommends **WinUI 3 with Windows App SDK** for a new native
  Windows application, while describing WPF as a mature Windows-only desktop framework
  ([Windows app development overview](https://learn.microsoft.com/en-us/windows/apps/get-started/),
  [WPF overview](https://learn.microsoft.com/en-us/dotnet/desktop/wpf/overview/)). Therefore “WPF or
  WinUI” is not one interchangeable choice.
- `OFFICIAL FACT`: .NET provides first-party COM interop and native interop. That is the clearest
  documented route if a later qualified CAD/Office adapter truly requires COM
  ([COM interop](https://learn.microsoft.com/en-us/dotnet/standard/native-interop/cominterop),
  [native interoperability](https://learn.microsoft.com/en-us/dotnet/standard/native-interop/)).
- `OFFICIAL FACT`: `UseShellExecute=true` delegates a document open to the Windows shell, which is
  sufficient for IDEA's current external-open baseline
  ([ProcessStartInfo.UseShellExecute](https://learn.microsoft.com/en-us/dotnet/api/system.diagnostics.processstartinfo.useshellexecute)).
- `OFFICIAL FACT`: .NET supplies local full-duplex named pipes; on Windows,
  `PipeOptions.CurrentUserOnly` with `NamedPipeServerStreamAcl` can restrict the pipe to the current
  user. DPAPI can protect data for the current user
  ([pipe operations](https://learn.microsoft.com/en-us/dotnet/standard/io/pipe-operations),
  [named-pipe ACL creation](https://learn.microsoft.com/en-us/dotnet/api/system.io.pipes.namedpipeserverstreamacl.create?view=net-10.0),
  [data protection](https://learn.microsoft.com/en-us/dotnet/standard/security/how-to-use-data-protection)).
- `OFFICIAL-PRODUCT-FACT`: .NET `10.0.12` is the current patch as of 2026-09-13 and the LTS line is
  supported through 2028-11-14. .NET LTS is three years,
  so “LTS” still requires planned major upgrades
  ([.NET support policy](https://dotnet.microsoft.com/en-us/platform/support/policy)).
- `OFFICIAL FACT`: a self-contained/single-file deployment includes the runtime and is specific to an
  OS and architecture; trimming is only safe for compatible applications
  ([single-file deployment](https://learn.microsoft.com/en-us/dotnet/core/deploying/single-file/overview)).
  MSIX packages must be signed with a trusted certificate
  ([MSIX signing overview](https://learn.microsoft.com/en-us/windows/msix/package/signing-package-overview)).
- `IDEA INFERENCE`: .NET is currently the lowest-unknown **Workspace agent** runtime for Windows. That
  does not establish that a full native .NET UI is best. Full WinUI/WPF duplicates the React UI,
  unless a WebView is added and the option becomes a hybrid shell instead.
- `QUALIFICATION UNKNOWN`: WinUI versus WPF focus/scaling/accessibility, MSIX versus traditional
  installer behavior, no-admin installation, update rollback, actual RAM/startup and CAD/Office
  behavior.

### 3.2 .NET shell with WebView2-rendered React

- `OFFICIAL FACT`: WebView2 supports WinUI 3 and WPF, local or remote Web content, and native/Web
  messaging. Microsoft requires origin checks, restricted navigation, schema validation and a
  narrow bridge; host objects can expose native power to Web content
  ([WebView2 in WinUI](https://learn.microsoft.com/en-us/windows/apps/develop/ui/controls/webview2),
  [WebView2 security](https://learn.microsoft.com/en-us/microsoft-edge/webview2/concepts/security),
  [host objects](https://learn.microsoft.com/en-us/microsoft-edge/webview2/how-to/hostobject)).
- `OFFICIAL FACT`: Microsoft recommends the automatically patched Evergreen WebView2 Runtime. A
  Fixed Version shifts patch ownership to IDEA and adds the renderer to delivery
  ([Evergreen versus Fixed](https://learn.microsoft.com/en-us/microsoft-edge/webview2/concepts/evergreen-vs-fixed-version)).
- `OFFICIAL-LIFECYCLE-LICENSING`: Windows App SDK has its own servicing clock, separate from .NET
  LTS. Stable Windows App SDK `2.4.0` was released 2026-08-13 and is the latest patch in the
  Windows App SDK `2.0` servicing family. That servicing family ends 2027-04-29, while the 1.8
  maintenance window ends 2026-09-09
  ([2.0 release notes](https://learn.microsoft.com/en-us/windows/apps/windows-app-sdk/release-notes/windows-app-sdk-2-0),
  [release channels](https://learn.microsoft.com/en-us/windows/apps/windows-app-sdk/release-channels)).
- `IDEA INFERENCE`: this is the strongest installed-shell option if S1's browser-to-agent gate fails
  and Windows integration matters. It is not automatically safer than a browser: IDEA creates a
  privileged bridge and must keep its renderer, shell and agent versions compatible.
- `QUALIFICATION UNKNOWN`: whether an installed shell adds enough value to justify its bridge,
  installer and update surface.

### 3.3 JavaFX shell plus Java Workspace

- `OFFICIAL FACT`: JavaFX `WebEngine` loads Web content, executes JavaScript and supports Java-to-JS
  object exposure; exposed Java objects may make public methods accessible. It uses WebKit, not
  Edge/Chromium
  ([JavaFX 25 WebEngine](https://openjfx.io/javadoc/25/javafx.web/javafx/scene/web/WebEngine.html),
  [JavaFX overview](https://docs.oracle.com/en/java/java-components/javafx/25/javafx-users-guide/what-is-javafx.html)).
- `OFFICIAL FACT`: `jpackage` creates self-contained Windows EXE/MSI packages with a custom Java
  runtime, shortcuts, launchers and file associations. Windows packages are built on Windows and
  require WiX; the documentation does not describe a complete signed updater/rollback service
  ([jpackage overview](https://docs.oracle.com/en/java/javase/25/jpackage/packaging-overview.html),
  [jpackage command](https://docs.oracle.com/en/java/javase/25/docs/specs/man/jpackage.html)).
- `OFFICIAL FACT`: Java `Desktop.open` launches the application associated with a file, satisfying
  the current external-open baseline
  ([Java Desktop API](https://docs.oracle.com/en/java/javase/25/docs/api/java.desktop/java/awt/Desktop.html)).
- `OFFICIAL FACT`: JNI and JDK 25's Foreign Function and Memory API can call native libraries. This
  proves a native path exists, not that a supported Office/CAD COM layer exists
  ([JNI design](https://docs.oracle.com/en/java/javase/25/docs/specs/jni/design.html),
  [FFM API](https://docs.oracle.com/en/java/javase/25/core/foreign-function-and-memory-api.html)).
- `OFFICIAL-LIFECYCLE-LICENSING`: Oracle's Java Verified Portfolio reintroduced JavaFX support in
  2026. JavaFX 25 corresponds to Oracle JDK 25 and is supported to September 2030 under the
  applicable Oracle support arrangement; JavaFX 25.0.4 is listed in the current downloads. Gluon
  separately lists JavaFX 25 as LTS and offers guaranteed long-term builds, backports and security
  fixes through a commercial support offering
  ([Oracle JVP roadmap](https://www.oracle.com/java/technologies/jvp-support-roadmap.html),
  [Oracle downloads](https://www.oracle.com/java/technologies/downloads/javafx/),
  [Gluon roadmap](https://gluonhq.com/products/javafx/),
  [Gluon support](https://gluonhq.com/services/javafx-support/)). This is distinct from choosing a
  Java 25 JDK distribution and its support entitlement.
- `IDEA INFERENCE`: JavaFX is technically credible and a Java Server does not require or forbid it.
  It ranks below the shortlist because using native JavaFX loses React view reuse, while using its
  WebView introduces a second renderer family whose exact React/SSO/WebAuthn behavior is unproved.
- `QUALIFICATION UNKNOWN`: a first-party-equivalent per-user Windows IPC/credential pattern, signed
  auto-update and rollback, JavaFX WebKit compatibility with the actual React bundle, and exact
  CAD/Office native path. These are reasons to qualify JavaFX, not claims that Java cannot build a
  large system.

### 3.4 Electron shell plus Node Workspace

- `OFFICIAL FACT`: Electron ships Chromium and Node.js in its binary and separates main, renderer,
  preload and optional utility processes
  ([Electron prerequisites](https://www.electronjs.org/docs/latest/tutorial/tutorial-prerequisites),
  [process model](https://www.electronjs.org/docs/latest/tutorial/process-model)).
- `OFFICIAL FACT`: Electron requires context isolation, renderer sandboxing, disabled Node integration
  for remote content, IPC sender validation, restricted navigation/new windows and a narrow preload
  API. Raw `ipcRenderer` must not be exposed
  ([security checklist](https://www.electronjs.org/docs/latest/tutorial/security),
  [context isolation](https://www.electronjs.org/docs/latest/tutorial/context-isolation),
  [sandbox](https://www.electronjs.org/docs/latest/tutorial/sandbox)).
- `OFFICIAL FACT`: `shell.openPath` opens a file in the desktop's default application. Native Node
  add-ons can reach platform APIs but require a C++ toolchain and rebuild against Electron
  ([shell API](https://www.electronjs.org/docs/latest/api/shell),
  [native code](https://www.electronjs.org/docs/latest/tutorial/native-code-and-electron)).
- `OFFICIAL FACT`: Electron documents Forge for packaging/signing and provides `autoUpdater` on
  Windows. Electron releases a major every eight weeks and officially supports only the latest
  three stable major versions
  ([distribution](https://www.electronjs.org/docs/latest/tutorial/distribution-overview),
  [updates](https://www.electronjs.org/docs/latest/tutorial/updates),
  [release timelines](https://www.electronjs.org/docs/latest/tutorial/electron-timelines)).
- `IDEA INFERENCE`: Electron offers the least-friction React shell but the highest evidenced renderer
  patch cadence. Bundling Chromium/Node is a structural distribution cost; it is not evidence of a
  particular RAM number or unacceptable performance.
- `QUALIFICATION UNKNOWN`: measured footprint, per-user protected Workspace separation, native
  add-on need, signed enterprise rollout and dirty-workspace-safe update/rollback.

### 3.5 Tauri 2 shell plus Rust Workspace

- `OFFICIAL-PRODUCT-FACT`: Tauri `2.11.5` is the current core release listed on 2026-09-13. Tauri
  uses a Rust core and the operating system WebView; Windows development and
  runtime use WebView2. It accepts React or another static Web frontend
  ([Tauri releases](https://v2.tauri.app/release/), [Tauri prerequisites](https://v2.tauri.app/start/prerequisites/),
  [frontend configuration](https://v2.tauri.app/start/frontend/)).
- `OFFICIAL FACT`: Tauri 2 capabilities restrict commands by window/WebView, origin and scoped
  permission. The documentation explicitly says this cannot protect against insecure Rust code,
  lax scopes or an unpatched system WebView
  ([capabilities](https://v2.tauri.app/security/capabilities/),
  [runtime authority](https://v2.tauri.app/security/runtime-authority/)).
- `OFFICIAL FACT`: Tauri can bundle and launch a sidecar executable with explicit execution and
  argument permissions. Its opener can use the system application for a path
  ([sidecars](https://v2.tauri.app/develop/sidecar/),
  [opener](https://v2.tauri.app/reference/javascript/opener/)).
- `OFFICIAL FACT`: Tauri creates MSI/NSIS installers. Its updater requires signatures and supports
  static or dynamic update metadata; Windows WebView2 may be downloaded, bootstrapped, installed
  offline or bundled as a fixed runtime
  ([Windows installer](https://v2.tauri.app/distribute/windows-installer/),
  [updater](https://v2.tauri.app/plugin/updater/),
  [Windows signing](https://v2.tauri.app/distribute/sign/windows/)). Updater signatures do not
  replace Windows Authenticode/enterprise trust policy.
- `OFFICIAL-LIFECYCLE-LICENSING`: Rust stable preserves language compatibility through editions, but
  the current stable toolchain is `1.98.1` (2026-09-03) and the Rust project supports only the latest
  stable toolchain; a stable version is replaced after six weeks
  ([Rust releases](https://blog.rust-lang.org/releases/), [edition stability](https://doc.rust-lang.org/edition-guide/editions/index.html),
  [Rust release channels](https://doc.rust-lang.org/book/appendix-07-nightly-rust.html)). Tauri's
  security policy identifies supported major versions but publishes no fixed multi-year LTS period
  ([Tauri security policy](https://github.com/tauri-apps/tauri/security/policy)).
- `IDEA INFERENCE`: Tauri is the strongest non-.NET installed-shell challenger: React reuse and a
  scoped bridge come without shipping a second Chromium by default. Its support model means IDEA
  must budget continuous dependency and toolchain updates rather than park on an LTS runtime.
- `QUALIFICATION UNKNOWN`: Rust skill/support inside the company, Windows IPC/credential implementation,
  exact native CAD/Office path, updater recovery and real resource footprint.

### 3.6 Browser/PWA plus a minimal local Workspace agent

- `OFFICIAL FACT`: Edge PWAs can be installed and use service workers/cache for offline behavior
  ([Edge PWA overview](https://learn.microsoft.com/en-us/microsoft-edge/progressive-web-apps/landing/)).
- `OFFICIAL FACT`: browser File System Access requires a secure context, explicit user selection,
  user activation and permissions that may need to be requested again. It is not a general durable
  machine-workspace authority
  ([File System Access](https://developer.chrome.com/docs/capabilities/web-apis/file-system-access),
  [WICG specification](https://wicg.github.io/file-system-access/)).
- `OFFICIAL FACT`: browser native messaging is an extension API: it requires an installed extension,
  a registered native host and allowed extension origins. It is not automatically available to an
  ordinary Web/PWA page
  ([Chrome native messaging](https://developer.chrome.com/docs/extensions/develop/concepts/native-messaging)).
- `OFFICIAL FACT`: current Edge Local Network Access policy prompts or governs Web access to local
  network/loopback targets. Localhost channels must account for browser policy, DNS rebinding, CSRF
  and origin authentication, not only CORS
  ([Edge Local Network Access](https://learn.microsoft.com/en-us/deployedge/ms-edge-local-network-access),
  [Local Network Access specification](https://wicg.github.io/local-network-access/)).
- `IDEA INFERENCE`: the PWA/service worker must not own multi-GB staging, scan/watch/hash or external
  CAD launch. A signed per-user agent must own those duties. This option removes the embedded bridge
  but replaces it with a browser-to-agent initiation/status contract.
- `QUALIFICATION UNKNOWN`: whether IDEA should use a browser extension/native messaging, an
  authenticated loopback endpoint, a one-time custom-protocol launch coordinated through the
  Server, or no direct browser/agent channel. The choice must pass G3/G4 before S1 can win.

### 3.7 Qt/C++ contingency

- `OFFICIAL FACT`: Qt provides `QLocalServer`/`QLocalSocket`; on Windows the channel is a named pipe,
  and `UserAccessOption` restricts access to the creating user. `QDesktopServices::openUrl` opens a
  local file with a suitable external application
  ([QLocalServer](https://doc.qt.io/qt-6/qlocalserver.html),
  [QLocalSocket](https://doc.qt.io/qt-6.8/qlocalsocket.html),
  [QDesktopServices](https://doc.qt.io/qt-6/qdesktopservices.html)).
- `OFFICIAL FACT`: ActiveQt supplies direct COM/ActiveX integration
  ([ActiveQt](https://doc.qt.io/qt-6/activeqt-index.html)).
- `OFFICIAL FACT`: Qt WebEngine embeds Chromium and ships a separate WebEngine process/resources;
  WebChannel can expose QObject properties, signals and public slots to JavaScript
  ([WebEngine architecture](https://doc.qt.io/qt-6/qtwebengine-overview.html),
  [WebEngine deployment](https://doc.qt.io/qt-6/qtwebengine-deploying.html),
  [QWebChannel](https://doc.qt.io/qt-6/qwebchannel.html)).
- `OFFICIAL FACT`: `windeployqt` collects Qt runtime dependencies, while Qt Installer Framework can
  install, update and uninstall components. Qt 6.8 receives five years of LTS maintenance only for
  commercial customers
  ([Windows deployment](https://doc.qt.io/qt-6/windows-deployment.html),
  [Qt Installer Framework](https://doc.qt.io/qtinstallerframework/ifw-overview.html),
  [Qt release support](https://doc.qt.io/qt-6/qt-releases.html)).
- `IDEA INFERENCE`: Qt/C++ adds a C++ and Qt licensing/support decision while React reuse requires
  shipping Chromium again. Keep it outside the primary shortlist unless an exact CAD SDK, COM or
  native-rendering requirement makes that cost worthwhile.
- `QUALIFICATION UNKNOWN`: required Qt modules/license, CAD SDK support matrix, installer signing,
  update rollback, and actual resource use.

## 4. Side-by-side decision matrix

The cells describe evidenced structure, not measured performance.

| Candidate | React reuse | Windows/native path | Local boundary | Packaging/update/support | Current disposition |
|---|---|---|---|---|---|
| Full native WinUI/WPF + .NET agent | Low unless WebView2 is added | Strongest first-party COM/P/Invoke and Windows APIs; OS open is direct | Named pipe current-user ACL + application authentication; DPAPI available | .NET 10 LTS to 2028; WinUI has separate shorter Windows App SDK servicing; MSIX/traditional choices | `S3` only if installed shell value is proved |
| JavaFX + Java agent | Native UI reuse low; WebView uses WebKit | OS open direct; JNI/FFM possible; COM convenience unproved | Standard local sockets exist, but exact per-user Windows enforcement remains a gate | jpackage EXE/MSI; JavaFX LTS backports commercially supported; no evidenced complete updater | Conditional, outside first bake-off |
| Electron + Node agent | Highest | OS open direct; native addon possible with rebuild/toolchain | Mature documented process/preload/IPC model, still application-authenticated | Bundled Chromium/Node; updater available; only latest three majors, eight-week major cadence | Comparison control |
| Tauri + Rust process/sidecar | High | OS open direct; Rust/sidecar path; exact COM/CAD unproved | Capability-scoped Web/native commands; separate agent IPC still IDEA-owned | System WebView2 by default; signed updater; no fixed LTS; Rust latest-only six-week support | `S2` |
| Browser/React + local agent | Highest and one renderer/application UI | Native work delegated to agent | No embedded bridge; browser-to-agent boundary is the central unresolved risk | Browser/Web UI serviced centrally; agent still needs signed installer/updater/rollback | `S1`, subject to pairing gate |
| Qt/C++ + optional WebEngine | Low natively; high only with bundled Chromium | Strong ActiveQt/COM, named pipe and OS open | Qt per-user local socket; WebChannel exposure must be narrowed by IDEA | Qt IFW available; commercial Qt 6.8 LTS to 2029; Chromium/WebEngine distribution if used | Contingency only |

### Package and memory claims that are safe to make

- `OFFICIAL FACT`: Electron and Qt WebEngine distribute Chromium; Tauri and WebView2 Evergreen reuse
  the Windows WebView2 runtime; Java `jpackage` and .NET self-contained deployments include tailored
  runtimes; the browser option reuses the managed browser but still installs an agent.
- `IDEA INFERENCE`: those facts affect patch ownership and installer composition.
- `QUALIFICATION UNKNOWN`: installer bytes, patch delta, idle/active RAM, CPU, start time and disk I/O
  for IDEA. No candidate may be accepted or rejected using an uncited generic “light/heavy” number.

## 5. Prototype gates before final selection

All candidates use the same API stub, React vertical slice where applicable, file corpus, Windows
images and pass/fail evidence. A pretty demo does not pass a custody/security gate.

| Gate | Required experiment and acceptance evidence |
|---|---|
| `G1 — external open/save` | Materialize verified Office and IRONCAD fixtures, launch by Windows association, edit/save/close externally, scan to the exact DOC-04 states and preserve unsaved/in-use/error behavior without an add-in. Record exact app/OS/bitness versions. |
| `G2 — multi-GB custody` | Download and Check-in a representative multi-GB fixture with streaming digest; interrupt network, shell, agent and power at defined points; restart/resume only missing ranges; cap memory by measured threshold; prove original/local candidate survives every failure and duplicate OperationId cannot publish twice. |
| `G3 — per-user/session IPC` | Use two Windows accounts, the same actor with two Workspaces, elevated/non-elevated processes, a replayed session token and a same-user hostile client. Prove cross-user/cross-Workspace refusal, message authentication, protocol version rejection and safe reconnect. ACL ownership alone is not a pass. |
| `G4 — Web/native attack boundary` | For embedded shells, test unapproved navigation, redirect, iframe, popup, forged message, oversized payload and generic path/shell attempts. For browser+agent, test CSRF, DNS rebinding, hostile origins, LNA denial, stale/replayed one-time launch and extension absence. Expose only versioned intent commands; never file bytes or a generic native object. |
| `G5 — install/update/sign/rollback` | On clean company-representative Windows images, perform signed per-user/admin install as policy permits, offline/online prerequisite handling, update with a dirty Workspace, forced update failure, rollback and version-skew recovery. The Workspace manifest and local files must remain readable and unmodified. Produce SBOM/license inventory. |
| `G6 — UI equivalence` | Run the same Checkout, transfer, uncertain Check-in, conflict and modified-Reference journey on Web/Desktop cells at 1440×900, required scaling, keyboard/focus, high contrast and `en`/`vi`/`ja` including Japanese IME. Prove equal terms/states, not pixel identity. |
| `G7 — resource and fleet evidence` | On the same PCs measure cold/warm start, idle/active process tree, RAM/CPU, installer size, update delta, disk growth during 1/5/10+ GB transfer, log volume and recovery time. Use thresholds agreed before measurement. |
| `G8 — operability and support` | Demonstrate structured logs without paths/tokens, crash diagnostics, agent/server compatibility negotiation, staged rollout, health/version inventory and documented patch SLA. Cost the actual .NET/JavaFX/Qt commercial support or signing services if proposed. |
| `G9 — native adapter trigger` | Only if a named CAD/Office capability exceeds OS open/save, prototype its exact supported CLI/COM/SDK with vendor-supported versions, apartment/bitness and headless constraints. Do not select COM convenience for a requirement that does not exist. |
| `G10 — team/toolchain` | Build and maintain one identical vertical slice in the surviving agent runtimes. Record build reproducibility, debugging, test isolation, dependency patching and incident steps. Team familiarity is measured input, not an assumed veto. |

### Selection rule

1. Any failure of G1–G5 removes the candidate until corrected.
2. G6–G8 rank candidates only after the custody/security gates pass.
3. G9 may reopen Qt/C++ or strengthen .NET only when an exact supported integration requires it.
4. Select the smallest number of runtimes that wins on evidenced operations; do not force one
   language across Server and Windows client merely for visual uniformity.

## 6. Answer to the current Java/.NET question

- `OFFICIAL FACT`: nothing in DOC-04/05/06/08 or VVP requires .NET, and the current WPF/WebView2
  labels are candidates with `NOT-RUN` qualification.
- `IDEA INFERENCE`: Java remains fully eligible for the Server. For the Windows Workspace, .NET has
  fewer current unknowns than Java because Microsoft directly documents per-user named-pipe ACLs,
  user-bound secret protection and COM/native integration. That is a client-integration advantage,
  not proof of greater scale or system strength.
- `IDEA INFERENCE`: if maximizing React reuse and minimizing installed UI duplication is the goal,
  the correct comparison is not “WPF versus JavaFX”. It is **browser + agent versus Tauri + Rust
  versus WebView2 shell + .NET agent**, with Electron as a control.
- `QUALIFICATION UNKNOWN`: the winner. G1–G10, company Windows/IT constraints and actual CAD/Office
  versions have not yet supplied the decision evidence.

The defensible management proposal today is therefore: **approve a bounded client architecture
bake-off, not .NET or Java by reputation**. Carry S1, S2 and S3 to the gates; keep the Server-runtime
decision separate; then submit one complete stack with measured evidence and explicit residual
risks for approval or rejection.

## 2026-09-13 current-version and browser-policy correction addendum

The 2026-09-12 evidence date is retained for its original Windows/CAD/Office experiments and
historical source context. The following current facts correct version drift without selecting a
client:

| Component | Current fact at 2026-09-13 | IDEA implication / qualification |
|---|---|---|
| React / TypeScript / Vite | React `19.3.0` is the current stable release (2026-09-09); TypeScript `7.0` is the current stable compiler (stable release announced 2026-07-08; latest listed patch `7.0.2` on 2026-08-20). TypeScript 7 does not yet expose a stable programmatic compiler API, so API consumers and embedded-language tools may need the TypeScript 6 compatibility line while CLI/type-checking adoption is evaluated. Vite `8.3` is the current patch line and Vite 8 requires Node `20.19+` or `22.12+` ([React versions](https://react.dev/versions), [React 19.3](https://react.dev/blog/2026/09/09/react-19-3), [TypeScript 7 announcement](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/), [TypeScript releases](https://github.com/microsoft/TypeScript/releases), [Vite releases](https://vite.dev/releases), [Vite 8](https://vite.dev/blog/announcing-vite8)) | A client-only React CSR SPA backed by a separate IDEA Server remains a valid candidate; React's framework guidance is not a requirement for SSR/RSC. Keep TypeScript 7 compiler use separate from tool/plugin compatibility qualification; choose Router declarative/data/framework mode only after routing, data-fetching and code-splitting needs are qualified. |
| Web security | React Trusted Types support is defense-in-depth, not authentication or authorization ([React 19.3](https://react.dev/blog/2026/09/09/react-19-3)). Edge Local Network Access (LNA) prompts/governs public-origin access to local/loopback targets; the documented loopback allowlist policy applies to Edge `146+` ([Edge LNA](https://learn.microsoft.com/en-us/deployedge/ms-edge-local-network-access), [loopback policy](https://learn.microsoft.com/en-us/deployedge/microsoft-edge-policies/loopbacknetworkallowedforurls)) | `localhost + CORS` is insufficient. S1 must test secure context/TLS, authenticated loopback, origin allowlisting, anti-CSRF, DNS-rebinding defense, one-time pairing/replay protection, enterprise policy and denial behavior. Extension/native messaging requires an installed extension and registered host; custom-protocol launch still needs Server coordination. |
| WebView2 | Evergreen is Microsoft's recommended automatically patched runtime; Fixed Version shifts patch/size/servicing ownership to IDEA ([Evergreen vs Fixed](https://learn.microsoft.com/en-us/microsoft-edge/webview2/concepts/evergreen-vs-fixed-version)) | Company-managed Windows images must be tested for runtime presence, offline bootstrap, navigation/message validation and host-object exposure. WebView2 servicing is separate from .NET and Windows App SDK. |
| Tauri / Rust | Tauri core `2.11.5` is the current release line; Rust stable `1.98.1` was released 2026-09-03 ([Tauri releases](https://v2.tauri.app/release/), [Rust releases](https://blog.rust-lang.org/releases/)) | Tauri/Rust remains a challenger. Rust has no multi-year LTS contract; measure update, sidecar, IPC, native adapter and team support rather than calling it lighter. |
| Windows App SDK / JavaFX | Windows App SDK `2.4.0` is stable and is the latest patch in the `2.0` servicing family, which ends 2027-04-29; Oracle JavaFX 25 support was reintroduced in 2026 and runs with JDK 25 through Sep 2030 under the applicable entitlement ([Windows App SDK 2.0 release notes](https://learn.microsoft.com/en-us/windows/apps/windows-app-sdk/release-notes/windows-app-sdk-2-0), [release channels](https://learn.microsoft.com/en-us/windows/apps/windows-app-sdk/release-channels), [Oracle JVP roadmap](https://www.oracle.com/java/technologies/jvp-support-roadmap.html)) | These independent clocks require separate patch calendars. JavaFX's stronger support fact does not close WebKit/React, IPC, installer, update or CAD/Office qualification. |

All rows are `OFFICIAL-PRODUCT-FACT` or `OFFICIAL-LIFECYCLE-LICENSING`; the IDEA conclusions are
`IDEA-INFERENCE` or `QUALIFICATION-UNKNOWN`. No product scope, Feature/Spec/Tech decision,
architecture semantics, FTR/REQ, DDM capability or PG state is changed.
