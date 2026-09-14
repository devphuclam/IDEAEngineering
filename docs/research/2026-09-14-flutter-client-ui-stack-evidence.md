# Client/UI stack re-evaluation evidence for IDEA Engineering

| Control field | Value |
|---|---|
| Stable Research ID | `IE-RES-TECH-CLIENT-20260914-001` |
| Document class / version / status | `RESEARCH-COMPARISON` / `0.3` / `Draft` |
| Product normativity | `INFORMATIVE`; this study creates no Product requirement and approves no Tech choice |
| Repository process authority / instruction state | `NOT-APPLICABLE` / `NOT-APPLICABLE` |
| Owner / author | Principal Product Author; named person attribution `BLOCKED` before `Proposed` |
| Reviewer / acceptance authority | Product Decision Authority; review and acceptance `NOT-RUN` |
| Applicable baseline | IDEA Engineering Core v0 Client/UI candidate baseline at repository `main` SHA `814b81bc3dcdd9caa0203b5aa62ccaf909514e97` |
| Evidence date / retrieval | `2026-09-14` (Asia/Saigon) |
| Classification / retention | `INTERNAL`; retain with the Tech evidence chain |
| Source / upstream trace | Current [IDEA catalogue](../product/instances/idea-engineering/README.md), [DOC-05](../product/instances/idea-engineering/DOC-05-architecture-description.md), [DOC-08](../product/instances/idea-engineering/DOC-08-ui-ux-and-interaction-specification.md), [TECH-001](../product/instances/idea-engineering/decision-briefs/TECH-001-technology-and-architecture-proposal.md), [technology decision matrix](../product/knowledge/2026-09-13-core-v0-technology-decision-matrix.md) and dated first-party sources cited below |
| Downstream trace | Current successor [technology matrix `IE-KNW-TECH-DEC-001@0.5`](../product/knowledge/2026-09-13-core-v0-technology-decision-matrix.md), [TECH-001@0.13](../product/instances/idea-engineering/decision-briefs/TECH-001-technology-and-architecture-proposal.md), DOC-07@0.10 routing and [change record `IE-CHG-TECH-CLIENT-002@0.1`](../product/instances/idea-engineering/registers/CHG-2026-09-14-client-ui-stack-review-correction.md); no downstream approval is created here |
| Change record / predecessor | [IE-CHG-TECH-CLIENT-002@0.1](../product/instances/idea-engineering/registers/CHG-2026-09-14-client-ui-stack-review-correction.md); predecessor `IE-RES-TECH-CLIENT-20260914-001@0.2` at repository commit `814b81bc3dcdd9caa0203b5aa62ccaf909514e97`, SHA-256 `29EC4980B7555BA391B3EC15F400C9FA65830699642DE3CEFC6149225237083D`; revision `0.3` makes Option A a provisional qualification control, corrects the Flutter Q-15 IPC branch to direct Dart FFI-first and preserves all unrun outcomes; Product Scope impact `NONE` |
| Supersedes / Superseded by | Supersedes `IE-RES-TECH-CLIENT-20260914-001@0.2`; superseded by `NOT-APPLICABLE` |
| Review trigger | Product Decision Authority review; approved Client/UI requirement or roadmap change; relevant framework/runtime support change; or completion of the controlled Option A/Option B qualification |
| Evidence status | Publication facts current at retrieval; IDEA Client/UI benchmark and qualification evidence `NOT-RUN` |

Control tailoring under `IE-STD-AUTH-001@0.2`: this comparison records time-sensitive vendor
facts, separates evidence from recommendation and retains every untested product-specific outcome as
`QUALIFICATION-UNKNOWN`. It does not change Feature, Spec, Tech, FTR, REQ, architecture, gate state
or Product Scope.

## 1. Question and decision boundary

The study asks whether the current Client/UI engineering recommendation should remain:

```text
Web:              React + TypeScript
Desktop:          WPF + WebView2, reusing the React business UI
Local Workspace:  separate per-user .NET process
```

or whether Flutter Web + Flutter Windows should replace the presentation layer while the protected
`.NET Workspace` remains separate. React browser-first, Electron, Tauri and WinUI 3 are comparison
controls.

The repository baseline compared here is React `19.3` + TypeScript `7` + Vite `8.3` for Web,
WPF `net10.0-windows` + WebView2 Evergreen for Desktop, and a separate per-user `.NET 10`
Workspace. Those versions are dated proposal inputs, not approved Product requirements.

The Server remains authoritative for identity, authorization, Product Definition, workflow,
release and document state. The Workspace continues to own local custody, durable transfer and
recovery responsibilities assigned by the current architecture. A UI toolkit does not acquire those
authorities.

Evidence labels used below are:

| Label | Meaning |
|---|---|
| `OFFICIAL-PRODUCT-FACT` | A current first-party source states a capability, implementation or supported platform. |
| `OFFICIAL-LIFECYCLE-LICENSING` | A first-party source states a release, servicing, signing or support fact. |
| `OFFICIAL-GUIDANCE-PATTERN` | First-party security, accessibility, testing or deployment guidance. |
| `IDEA-INFERENCE` | A bounded consequence under IDEA's current requirements; not a vendor fact or approval. |
| `QUALIFICATION-UNKNOWN` | The exact IDEA behavior has not been implemented and measured. |

No popularity claim, unsourced benchmark or numeric score is used.

## 2. Disposition

| Option | Candidate | Disposition | Controlled rationale |
|---|---|---|---|
| A | React + WPF + WebView2 + `.NET Workspace` | `SELECT — PROVISIONAL QUALIFICATION CONTROL`; `QUALIFICATION REQUIRED` | Retain as the controlled starting/reference implementation because it matches the current documented Web/Desktop proposal and supplies a consistent comparator for Q-15. This is not evidence that its hop count, implementation effort or lifecycle risk is lower; the exact IDEA vertical slice, accessibility, deployment and resource envelope remain `NOT-RUN`. |
| B | Flutter Web + Flutter Windows + `.NET Workspace` | `ALTERNATIVE`; `QUALIFICATION REQUIRED` | Flutter is a serious challenger with supported Web and Windows targets, one Dart presentation model and first-party native-extension seams. It has not yet demonstrated IDEA's data-heavy grid/tree behavior, browser-native behavior, Web/Windows accessibility, EN/VI/JA IME, secure external-process Workspace IPC, signed update/rollback or support policy. |
| C | React browser-first + `.NET Workspace` | `CONDITIONAL`; `FOLLOW-UP PRODUCT DECISION REQUIRED` | It could remove an installed shell and embedded-renderer bridge, but the current Spec explicitly carries Desktop and Web-rendered Desktop surface obligations. Removing them is not a Tech-only substitution. Browser-to-agent discovery and authentication also remain unqualified. |
| D | React + Electron | `REJECT FOR CORE V0` | It reuses React, but IDEA would own a bundled Chromium, Node and Electron patch train. Electron supports only its latest three stable majors and releases a major approximately every eight weeks. That extra runtime authority has no evidenced Core v0 advantage over the current WebView2 route. |
| E | React + Tauri | `ALTERNATIVE`; `QUALIFICATION REQUIRED` | It reuses React and offers a capability-scoped Rust/WebView boundary, but adds Rust/Tauri while the `.NET Workspace` still remains. Exact IPC, accessibility, installer, updater-key custody, lifecycle and recovery behavior are unproved. |
| F | WinUI 3 + WebView2 | `ALTERNATIVE`; `QUALIFICATION REQUIRED` | It preserves React/WebView2 reuse and supplies a current Windows-native shell. It does not yet show a product benefit over WPF sufficient to justify migration, and the Windows App SDK has its own servicing clock. |

This is an engineering recommendation, not Product Decision Authority acceptance. Option A's
`SELECT` means “use as the provisional qualification control,” not “proven lower-risk,” “winner of
Q-15” or “approved for build.”

## 3. Why Flutter remains a serious challenger

### 3.1 Current React/WPF baseline evidence

- `OFFICIAL-PRODUCT-FACT`: React DOM renders React components through browser built-in HTML and SVG
  elements, including the native form controls on which an internal metadata UI can build
  ([React DOM components](https://react.dev/reference/react-dom/components)).
- `OFFICIAL-PRODUCT-FACT`: first-party release pages record React `19.3`, TypeScript `7` and Vite
  `8.x` lines used by the dated repository proposal
  ([React 19.3](https://react.dev/blog/2026/09/09/react-19-3),
  [TypeScript 7.0](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/),
  [Vite releases](https://vite.dev/releases)).
- `OFFICIAL-PRODUCT-FACT`: Microsoft documents hosting WebView2 in WPF and exposes Windows UI
  Automation for WPF controls
  ([WebView2 in WPF](https://learn.microsoft.com/en-us/microsoft-edge/webview2/get-started/wpf),
  [WPF UI Automation](https://learn.microsoft.com/en-us/dotnet/desktop/wpf/controls/ui-automation-of-a-wpf-custom-control)).
- `IDEA-INFERENCE`: native browser elements, WebView2 and UI Automation are useful foundations, not
  an automatic accessibility or browser-behavior PASS for IDEA. Option A remains subject to the
  same representative qualification discipline as Flutter.

### 3.2 Web suitability and rendering

- `OFFICIAL-PRODUCT-FACT`: Flutter explicitly positions Web for app-centric experiences such as
  complex standalone SPAs, while warning that document-centric static content is better suited to
  the Web's document model ([Flutter Web support](https://docs.flutter.dev/platform-integration/web)).
- `OFFICIAL-PRODUCT-FACT`: Flutter renders its own widget system. On Web it compiles to JavaScript
  or WebAssembly and uses Flutter renderers rather than making ordinary HTML controls the primary
  UI implementation ([architectural overview](https://docs.flutter.dev/resources/architectural-overview),
  [WebAssembly](https://docs.flutter.dev/platform-integration/web/wasm)).
- `OFFICIAL-PRODUCT-FACT`: Flutter describes its Web drawing layer as a combination of DOM, Canvas
  and WebAssembly. The current loader exposes CanvasKit configuration and SkWasm single- versus
  multithreaded controls; bootstrap JavaScript initializes the engine in either build path
  ([Web support](https://docs.flutter.dev/platform-integration/web),
  [Web initialization](https://docs.flutter.dev/platform-integration/web/initialization)).
- `OFFICIAL-PRODUCT-FACT`: `flutter build web --wasm` also produces a JavaScript fallback. Chrome
  and Edge are listed with JavaScript and WebAssembly support; Firefox and Safari are listed as
  JavaScript targets in the current support table. Multithreaded Wasm rendering requires appropriate
  COOP/COEP headers ([supported platforms](https://docs.flutter.dev/reference/supported-platforms),
  [WebAssembly](https://docs.flutter.dev/platform-integration/web/wasm),
  [Web initialization](https://docs.flutter.dev/platform-integration/web/initialization)).
- `IDEA-INFERENCE`: Flutter is technically suitable for an internal SPA category, but that category
  statement is not proof that IDEA's tree, grid, metadata editing, history, download and keyboard
  behavior is equivalent to the browser/React candidate.
- `QUALIFICATION-UNKNOWN`: JavaScript-fallback versus Wasm behavior, initial load, memory, browser
  history, printing, copy/paste, drag/drop and developer diagnostics on the representative IDEA
  slice.

### 3.3 Data-heavy engineering UI

- `OFFICIAL-PRODUCT-FACT`: Flutter's `DataTable` performs a two-pass column layout and a surrounding
  `SingleChildScrollView` mounts and paints the whole child. Flutter points large datasets toward
  pagination, `TableView` or custom scrolling
  ([DataTable API](https://api.flutter.dev/flutter/material/DataTable-class.html),
  [PaginatedDataTable API](https://api.flutter.dev/flutter/material/PaginatedDataTable-class.html)).
- `OFFICIAL-PRODUCT-FACT`: lazy list builders create children on demand, and Flutter supplies focus,
  traversal, shortcuts, mouse and keyboard primitives
  ([long lists](https://docs.flutter.dev/cookbook/lists/long-lists),
  [user input and accessibility](https://docs.flutter.dev/ui/adaptive-responsive/input)).
- `IDEA-INFERENCE`: the framework has building blocks, but neither Flutter core nor React core is an
  enterprise BOM/grid product. The exact grid/tree dependency, license, keyboard contract,
  virtualization model and accessibility behavior need selection and qualification for each option.
- `QUALIFICATION-UNKNOWN`: representative hierarchy depth, row/column volume, inline editing,
  pinned columns, selection, context menu, keyboard-only traversal and state restoration.

### 3.4 Accessibility

- `OFFICIAL-PRODUCT-FACT`: Flutter Web translates its Semantics tree into accessible HTML DOM. Web
  semantics is not enabled by default for performance; the user can activate it or the application
  can call `ensureSemantics()`
  ([Web accessibility](https://docs.flutter.dev/ui/accessibility/web-accessibility)).
- `OFFICIAL-PRODUCT-FACT`: Flutter's assistive-technology guide identifies JAWS and NVDA for
  Windows desktop browsers. The Windows embedder implements an accessibility bridge and native
  accessibility nodes
  ([assistive technologies](https://docs.flutter.dev/ui/accessibility/assistive-technologies),
  [Windows accessibility bridge](https://api.flutter.dev/windows-embedder/classflutter_1_1_accessibility_bridge_windows.html)).
- `IDEA-INFERENCE`: an implemented bridge is not a conformance result. Custom grid/tree semantics,
  focus order and announcements still belong to IDEA and its chosen widget dependencies.
- `QUALIFICATION-UNKNOWN`: WCAG acceptance, Web and native-Windows screen-reader parity, high
  contrast, scaling, full keyboard operation and failure recovery on managed company machines.

### 3.5 Internationalization and IME

- `OFFICIAL-PRODUCT-FACT`: Flutter supports ARB-based localization generation, locale declaration,
  locale-specific formatting and runtime locale selection
  ([internationalization](https://docs.flutter.dev/ui/internationalization)).
- `OFFICIAL-PRODUCT-FACT`: the Windows embedder has IME composition machinery. Flutter 3.47 release
  notes include a Korean IME caret-position fix, showing both active support and the need to test
  composition-sensitive editors
  ([Windows text-input source](https://api.flutter.dev/windows-embedder/text__input__model_8h_source.html),
  [Flutter 3.47 release notes](https://docs.flutter.dev/release/release-notes/release-notes-3.47.0)).
- `QUALIFICATION-UNKNOWN`: Japanese composition/reconversion, Vietnamese input, focus loss and
  restoration, custom grid-cell editors, font fallback, text selection/copy and layout expansion in
  both Web and Windows builds.

### 3.6 Windows native integration and Workspace IPC

- `OFFICIAL-PRODUCT-FACT`: Flutter Windows uses a C++ host and supports native integration through
  plugins, platform channels and Dart FFI. Current Flutter guidance allows FFI binding to Windows
  system DLLs without requiring a custom Flutter plugin
  ([Windows integration](https://docs.flutter.dev/platform-integration/windows/building),
  [platform channels](https://docs.flutter.dev/platform-integration/platform-channels),
  [FFI](https://docs.flutter.dev/platform-integration/bind-native-code)).
- `OFFICIAL-PRODUCT-FACT`: platform channels join Dart to host code inside the Flutter application;
  FFI calls a C ABI. Neither mechanism by itself specifies authenticated IPC with the separate
  `.NET Workspace` process.
- `OFFICIAL-PRODUCT-FACT`: a Win32 named-pipe client opens the pipe with `CreateFile`/`WaitNamedPipe`
  and exchanges bytes with `ReadFile`/`WriteFile`; these are C-callable Windows system APIs
  ([Win32 named-pipe client](https://learn.microsoft.com/en-us/windows/win32/ipc/named-pipe-client)).
- `OFFICIAL-PRODUCT-FACT`: .NET 10 exposes `PipeOptions.CurrentUserOnly`; on Windows it verifies the
  user account and elevation level for named-pipe peers
  ([.NET PipeOptions](https://learn.microsoft.com/en-us/dotnet/api/system.io.pipes.pipeoptions?view=net-10.0)).
- `IDEA-INFERENCE`: Option A can implement the current same-user Workspace candidate in .NET.
  Option B's first Q-15 branch should bind the Win32 named-pipe client API directly with Dart FFI.
  A narrow C ABI/C++ shim or Flutter plugin is a fallback only if a measured FFI blocker requires
  it. Localhost, a local socket, process stdio or FFI itself is not authorization.
- `QUALIFICATION-UNKNOWN`: endpoint discovery, current-user/session isolation, mutual proof,
  framing, size limits, replay defense, version negotiation, restart handshake, malformed-message
  handling and CAD/Office/file-dialog flows.

The installed-client hop inventory is a hypothesis to measure, not a risk conclusion:

```text
A control:  React → WebView2 message → WPF → Win32 named pipe → .NET Workspace
B primary:  Dart → FFI → Win32 named pipe → .NET Workspace
B fallback: Dart → narrow C ABI/C++ shim or plugin → Win32 named pipe → .NET Workspace
```

Fewer visible boxes do not prove lower implementation, security, diagnostic or lifecycle risk.
Q-15 must record the implemented boundaries, code and dependency owners, failure modes and results.

Under the current architecture, multi-GB staging, digesting, resume, journal and recovery remain in
the Workspace rather than crossing a presentation channel as buffered UI data.

### 3.7 Testing, deployment, update and lifecycle

- `OFFICIAL-PRODUCT-FACT`: Flutter supplies unit, widget and integration tests. Its integration-test
  framework cannot operate native platform UI such as native dialogs or platform views
  ([testing overview](https://docs.flutter.dev/testing/overview),
  [testing plugins](https://docs.flutter.dev/testing/testing-plugins)).
- `OFFICIAL-LIFECYCLE-LICENSING`: the current documentation reflects Flutter `3.47.2`; Stable is the
  recommended production channel, with public 2026 release windows around a three-month cadence
  ([SDK archive](https://docs.flutter.dev/install/archive)).
- `OFFICIAL-PRODUCT-FACT`: a Windows Flutter distribution includes the executable, Flutter and
  plugin DLLs, data and the relevant Visual C++ runtime. Flutter documents MSIX and ZIP distribution;
  trusted signing remains an operator responsibility
  ([Windows build and distribution](https://docs.flutter.dev/platform-integration/windows/building),
  [Windows Store deployment](https://docs.flutter.dev/deployment/windows)).
- `QUALIFICATION-UNKNOWN`: multi-year LTS/security servicing, enterprise SLA, a selected signed
  updater, atomic rollback, offline update and Workspace-preserving migration. No current first-party
  Flutter source reviewed here establishes those as a complete product contract.

## 4. Direct answers to the sixteen Flutter/Dart questions

The answers below use only first-party framework/vendor documentation, official API/source
documentation and Microsoft/W3C platform documentation retrieved on `2026-09-14`. A framework's
own issue tracker is not used as proof of a general product defect or performance result. Where an
official source establishes only a mechanism, the IDEA-specific outcome remains
`QUALIFICATION-UNKNOWN`.

| # | Direct answer | Evidence boundary and IDEA consequence |
|---|---|---|
| 1 | **Flutter Web is a credible application-shell candidate, but suitability for IDEA is not established.** Flutter explicitly targets app-centric experiences and SPAs. The exact data-heavy engineering behavior remains `NOT-RUN`. | The official [Web support](https://docs.flutter.dev/platform-integration/web) and [Web FAQ](https://docs.flutter.dev/platform-integration/web/faq) support the application category. Neither supplies evidence for IDEA's row count, tree depth, edit model, clipboard, print/export or accessibility contract. |
| 2 | **Flutter Web uses Flutter's widget/rendering model rather than ordinary HTML controls as the primary implementation.** Its drawing layer uses browser DOM, Canvas and WebAssembly facilities; the loader exposes CanvasKit and SkWasm controls. | Flutter's [Web support](https://docs.flutter.dev/platform-integration/web), [architectural overview](https://docs.flutter.dev/resources/architectural-overview) and [Web initialization](https://docs.flutter.dev/platform-integration/web/initialization) describe the engine/bootstrap/rendering pieces. Web accessibility is projected from Flutter Semantics into accessible HTML DOM rather than inherited automatically from a native HTML control tree. |
| 3 | **The current stable toolchain can build JavaScript or a Wasm-targeted application; the Wasm build also emits JavaScript fallback.** | The [Wasm guide](https://docs.flutter.dev/platform-integration/web/wasm) documents `--wasm`, JS fallback, current renderer/browser limitations and COOP/COEP requirements for multithreaded rendering; deferred Wasm loading remains experimental in the retrieved `3.47.2` documentation. A qualification record would pin the [supported-platform table](https://docs.flutter.dev/reference/supported-platforms) with the build and test actual JS/Wasm selection separately; neither is a performance PASS. |
| 4 | **Accessibility mechanisms exist on Web and Windows, but IDEA accessibility is unqualified.** | [Web accessibility](https://docs.flutter.dev/ui/accessibility/web-accessibility) states that Flutter translates Semantics to accessible HTML DOM and that Web semantics is not enabled by default for performance. The official Windows embedder exposes an [accessibility bridge](https://api.flutter.dev/windows-embedder/classflutter_1_1_accessibility_bridge_windows.html). This does not prove keyboard, focus, screen-reader or custom grid/tree conformance. |
| 5 | **Flutter Windows supports native integration through its C++ Win32 runner, plugins, platform channels and FFI.** | The official [Windows build guide](https://docs.flutter.dev/platform-integration/windows/building), [platform-channel guide](https://docs.flutter.dev/platform-integration/platform-channels) and [native binding guide](https://docs.flutter.dev/platform-integration/bind-native-code) establish extension mechanisms. Each native integration adds code, ownership and tests outside the shared Dart widgets. |
| 6 | **Dart FFI is sufficient to call a C ABI, but that fact alone is not proof of safe, complete Win32, COM or vendor-SDK integration.** | Dart's [C interop guide](https://dart.dev/interop/c-interop) documents dynamic-library and C-function binding. COM also requires apartment/threading, lifetime and marshaling discipline ([Microsoft COM apartments](https://learn.microsoft.com/en-us/windows/win32/com/processes--threads--and-apartments)). A C wrapper, C++ plugin or generated binding can bridge a compatible vendor SDK; the actual IRONCAD/Office/vendor contract remains `QUALIFICATION-UNKNOWN`. |
| 7 | **The plugin/native bridge is a real maintenance seam, not a disqualifier.** | Flutter's [platform integration guidance](https://docs.flutter.dev/platform-integration) says to use a plugin or write platform-specific code when the framework does not cover a capability. IDEA would own API compatibility, C++/CMake or FFI bindings, signing, SBOM, threading, error translation and regression tests for every custom bridge. The burden needs an owned inventory rather than an inference from package counts. |
| 8 | **No first-party evidence reviewed establishes a production-ready enterprise BOM grid/tree for IDEA.** | Flutter core offers `DataTable`, pagination, lazy lists, focus and shortcut primitives, but its own [`DataTable` API](https://api.flutter.dev/flutter/material/DataTable-class.html) warns about whole-child mounting/painting with `SingleChildScrollView`. React core likewise does not ship an enterprise grid. Exact dependency, license, virtualization, edit, keyboard and semantic behavior is `QUALIFICATION REQUIRED` for both A and B. |
| 9 | **Single-window Windows, DPI and input plumbing are implemented; multi-window, multi-monitor and mixed-DPI product behavior remains unqualified.** | The Windows embedder reacts to DPI changes when a window moves across displays ([Flutter window source](https://api.flutter.dev/windows-embedder/flutter__window_8h_source.html)). Official guidance states that an external native window requires explicit lifecycle-message forwarding ([external windows](https://docs.flutter.dev/platform-integration/windows/extern_win)). Proposed qualification covers window creation, ownership, focus, restoration, monitor removal and mixed-DPI placement; no PASS is claimed. |
| 10 | **Yes, Flutter Windows can integrate with the separate per-user `.NET Workspace`, provided the external-process protocol is explicitly implemented and secured.** | Platform channels and FFI connect Dart to code in the Flutter host; they do not authenticate another process. The `.NET Workspace` remains separate and authoritative for its assigned local-custody responsibilities. Discovery, peer identity, request binding, replay defense and recovery remain `QUALIFICATION REQUIRED`. |
| 11 | **The preferred first PoC mechanism is direct Dart FFI binding to the Win32 named-pipe client API.** Add a narrow C ABI/C++ shim or Flutter plugin only when a measured direct-FFI blocker requires it; neither branch is an approved architecture decision. | Dart FFI calls native C APIs, and the Win32 named-pipe client uses C-callable `CreateFile`/`WaitNamedPipe` plus `ReadFile`/`WriteFile`. The Workspace side can enforce `PipeOptions.CurrentUserOnly`; on Windows .NET documents account and elevation checks ([`PipeOptions`](https://learn.microsoft.com/en-us/dotnet/api/system.io.pipes.pipeoptions?view=net-10.0)). Both branches must expose typed operations rather than arbitrary command/path/filesystem proxies and test native handle/memory lifetime, overlapped I/O or bounded blocking, cancellation, session proof, framing/length, replay, correlation, timeout, restart, malformed frames and version negotiation. |
| 12 | **Flutter supports build and package paths for Windows, but IDEA does not yet have a complete managed-update contract.** | Official Flutter guidance lists the executable, Flutter/plugin DLLs, data and Visual C++ runtime and documents Store/MSIX or traditional distribution ([Windows build](https://docs.flutter.dev/platform-integration/windows/building), [Windows deployment](https://docs.flutter.dev/deployment/windows)). Signing identity, staged rollout, offline installation, atomic rollback, updater ownership and Workspace-compatible migration remain `QUALIFICATION-UNKNOWN`. |
| 13 | **A full Flutter Windows presentation can remove WPF and WebView2 from the installed Desktop UI; it cannot remove the browser, the Server API, or the `.NET Workspace`.** | Flutter Windows owns its Win32 runner and engine. Flutter Web remains a browser-delivered target. Native file custody, resumable transfer, recovery and CAD/Office integration do not become presentation responsibilities merely because WebView2 is removed. |
| 14 | **Removing WebView2 removes an embedded browser/DOM host, not every Web capability.** | Flutter's [`Router`](https://docs.flutter.dev/ui/navigation) integrates with browser History and Flutter supports [deep links](https://docs.flutter.dev/ui/navigation/deep-linking). The trade is that ordinary HTML controls/DOM semantics, CSS/Web-component reuse and browser inspection are no longer the primary UI substrate; Flutter supplies its own widget inspector and [DevTools](https://docs.flutter.dev/tools/devtools). Browser-native selection, printing, password-manager/autofill, file interaction and automation therefore require explicit qualification rather than assumed parity. |
| 15 | **Flutter offers potentially broad source reuse across Web and Windows, but no defensible percentage exists before the PoC.** | Shared widgets, state/presentation logic, validation and localization are plausible reuse. Browser adapters, Windows runner/plugins, native dialogs, update integration and Workspace IPC remain platform-specific. Option A already reuses the React business UI in browser and WebView2, so Flutter's incremental saving is principally the narrow native presentation/shell layer, not the entire client. Reuse measurement is `NOT-RUN`. |
| 16 | **A first-class Android/iOS roadmap would materially improve Flutter's relative value and trigger re-evaluation; a hypothetical roadmap does not decide Core v0.** | Flutter officially supports Web, Windows, Android, iOS, macOS and Linux within its published version matrix ([supported platforms](https://docs.flutter.dev/reference/supported-platforms)). Mobile would still need mobile-specific security, offline, UX and Workspace/CAD boundary decisions. **Cross-platform optionality ≠ current product requirement.** |

## 5. Cross-option comparison by required criteria

| Criterion | A: React/WPF | B: Flutter | C: browser-first | D: Electron | E: Tauri | F: WinUI/WebView2 |
|---|---|---|---|---|---|---|
| Web SPA | Native browser DOM/React candidate; `QUALIFICATION REQUIRED` | Supported app-centric Web target; JS/Wasm branches require qualification | Same Web candidate as A | Web build reused inside bundled Chromium | Web build reused inside system WebView | Same WebView2 content as A |
| Windows Desktop | Narrow WPF shell plus reused Web UI | Native-compiled Flutter Windows presentation | Installed shell removed or reduced; product decision required | Chromium/Node desktop shell | Rust/system-WebView shell | Current Windows-native shell |
| Workspace IPC | .NET same-user named-pipe client behind WPF/WebView2 messaging | Direct Dart FFI → Win32 named-pipe client first; narrow shim/plugin only on measured blocker | Secure browser-agent bridge unproved | Node/native bridge plus Workspace protocol | Rust command/capability bridge plus Workspace protocol | Direct .NET path |
| Security surface | Browser + WebView2 + narrow .NET bridge | Browser renderer + Dart engine/plugins + custom IPC | Browser-origin/local-agent bridge | Electron + Chromium + Node + npm + IPC | Tauri + Rust + system WebView + capabilities | Windows App SDK + WebView2 + narrow .NET bridge |
| Maintained ecosystems | React/TS toolchain and .NET client/Workspace | Flutter/Dart and .NET Workspace | React/TS and .NET Workspace | React/TS, Electron/Node and .NET Workspace | React/TS, Rust/Tauri and .NET Workspace | React/TS, Windows App SDK and .NET Workspace |
| UI reuse | One React business UI across Web and embedded Desktop; native shell remains narrow | Potentially one Dart widget model across Web and Windows | One React Web UI | One React UI | One React UI | One React business UI; native shell remains narrow |
| Performance | `NOT-RUN` | `NOT-RUN`; measure JS and Wasm separately | `NOT-RUN` | `NOT-RUN` | `NOT-RUN` | `NOT-RUN` |
| Accessibility | DOM and WPF/UI Automation paths; exact product result `NOT-RUN` | Semantics bridges exist; exact Web/Windows result `NOT-RUN` | DOM path; product result `NOT-RUN` | Chromium path plus desktop shell; `NOT-RUN` | system-WebView path plus shell; `NOT-RUN` | WebView2 plus Windows UI Automation; `NOT-RUN` |
| EN/VI/JA and IME | Standards-based browser inputs plus Windows shell; qualify exact controls | Localization and composition primitives exist; exact controls `NOT-RUN` | Browser path; `NOT-RUN` | Chromium path; `NOT-RUN` | system-WebView path; `NOT-RUN` | WebView2/Windows path; `NOT-RUN` |
| Testing | Web/component/E2E plus .NET shell/IPC tests | unit/widget/integration plus separate full-system native/IPC harness | Web E2E plus agent harness | Web/Electron IPC/E2E harness | Web/Rust/Tauri/IPC harness | Web/.NET/WinUI/IPC harness |
| Deployment/update | Web bundle, signed shell, Evergreen WebView2, Workspace | Web bundle, signed Flutter binary/plugins, Workspace; updater policy unknown | Web bundle plus agent | Signed Electron bundle and rapid runtime patching | Signed Tauri bundle; updater-key custody | Web bundle, Windows App SDK shell, WebView2, Workspace |
| Roadmap optionality | Web plus Windows; other native clients require new work | Strongest optionality for Android/iOS/macOS/Linux | Web reach; native integrations remain platform-specific | Desktop optionality, not mobile | Desktop optionality, not mobile | Windows-only shell plus Web |

> Cross-platform optionality ≠ current product requirement.

### 5.1 Candidate strength, weakness and qualification ledger

| Candidate | Strongest evidenced fit | Material weakness / cost | Unknowns that prevent unconditional selection | Minimum next qualification |
|---|---|---|---|---|
| A — React + WPF/WebView2 | Direct browser-DOM Web path; one React business UI can serve browser and embedded Desktop; narrow .NET shell aligns with current `.NET Workspace` and named-pipe candidate | WebView2 bridge, WPF shell, React bundle and Workspace have coordinated version/failure boundaries; Windows-only shell | Exact grid/tree dependency, bridge hardening, browser/embedded parity, accessibility, resource envelope and signed coordinated update | Full same-slice Option A reference run; use its raw result as the comparison control, not an assumed PASS |
| B — Flutter Web + Flutter Windows | Official Web and Windows targets; potentially one Dart widget/state/localization/test model; first-party native/FFI extension seams; strongest mobile optionality | Flutter-rendered Web semantics and the direct-FFI/native Workspace boundary both need proof; `.NET Workspace` remains, and platform code reduces actual reuse | Grid/tree maturity, browser-native behavior, Web/Windows accessibility, IME, multi-window/DPI, secure IPC, package/update/rollback and measured code reuse | Implement the same slice as A using direct Dart FFI first; add and separately account for a shim/plugin only on a recorded blocker |
| C — React browser-first | Fewest UI containers; direct browser DOM, browser delivery and React reuse | Browser cannot simply assume local filesystem/process authority; the current installed Desktop surface cannot be removed by a Tech study | Secure local-agent discovery/authentication, enterprise browser policy, native dialog/process launch UX, offline/recovery behavior and Product Decision Authority disposition | Threat-model and prototype a no-generic-proxy local bridge; separately obtain the required product-surface decision |
| D — React + Electron | Reuses React and supplies a documented multi-process desktop runtime with one bundled browser version | IDEA owns Electron, bundled Chromium and Node patching plus its bridge and `.NET Workspace`; a safe candidate deliberately excludes broad Node/native exposure | No evidenced Core v0 benefit that offsets runtime/patch ownership; resource, update, accessibility and IPC remain unmeasured | Defer implementation unless a requirement appears that A cannot meet; if reopened, run the same slice and patch-latency/update drill |
| E — React + Tauri | Reuses React; official capabilities/runtime authority can limit WebView command access | Adds Rust/Tauri/plugin ownership while `.NET Workspace` remains; system-WebView behavior and updater-key custody join the operational boundary | Exact command scopes, IPC topology, accessibility, runtime compatibility, signing/update/recovery and team ownership | Threat-model capability files and typed commands, then run same slice plus updater-key recovery exercise |
| F — WinUI 3 + WebView2 | Preserves React/WebView2 reuse and a .NET-native Workspace boundary in a current Windows shell technology | Windows-only, adds Windows App SDK servicing, and a WPF-to-WinUI change has no current evidenced product payoff | Migration/implementation cost, accessibility and deployment difference, packaged/unpackaged policy and coordinated lifecycle | Reopen only for a concrete WPF limitation; benchmark the failing scenario and the same native-shell bridge contract |

### 5.2 Actual ecosystem and maintainership envelope

Java/Spring, PostgreSQL and the stable HTTPS/API contract remain common to every option and are not
reopened. The client-side comparison counts the Workspace even when the UI is shared.

| Candidate | Toolchains/ecosystems that still require named ownership | Build, diagnosis and patch implication |
|---|---|---|
| A | React/TypeScript package graph; WPF/WebView2 and `.NET Workspace` NuGet graph | Web/browser diagnostics plus .NET/native-shell and IPC diagnosis; coordinate Web bundle, shell, Evergreen policy and Workspace compatibility |
| B | Flutter/Dart pub graph; `.NET Workspace`; Dart FFI bindings; C/C++ shim or plugin only if a recorded blocker requires it | Flutter/Chrome DevTools plus FFI/Win32 and .NET/IPC diagnosis; add native C/C++ diagnosis and supply-chain ownership only if the fallback is used; coordinate Web output, signed Windows bundle and Workspace |
| C | React/TypeScript; `.NET Workspace`/local agent and its browser-facing bridge | Web diagnosis plus a separate local-agent/security harness; Web and agent versions need explicit negotiation rather than silent divergence |
| D | React/TypeScript, Electron/Node/native dependencies and `.NET Workspace` | Browser/renderer, Electron main process, native module and Workspace diagnosis; Electron/Chromium/Node patch cadence becomes an IDEA-owned release input |
| E | React/TypeScript, Rust/Cargo/Tauri plugins and `.NET Workspace` | WebView, Rust command/capability and Workspace diagnosis; Tauri/plugin/system-WebView and signing-key changes require coordinated ownership |
| F | React/TypeScript, Windows App SDK/WinUI/WebView2 and `.NET Workspace` | Browser/WebView plus .NET/WinUI and IPC diagnosis; Windows App SDK, Evergreen policy, Web bundle and Workspace versions require coordination |

No repository evidence currently establishes staffing depth, recruiting supply, onboarding time or
bus factor for TypeScript/React, Dart/Flutter, C++, Rust or the Windows UI stacks. Those remain
`UNKNOWN`; public popularity is not substituted for company evidence. Before a selection becomes a
build baseline, each option needs named owners, reproducible CI, locked direct/transitive dependency
inventory, licenses/SBOM, security-advisory intake, patch target, debugging/profiling runbook and a
second maintainer capable of recovery. Flutter therefore does **not** reduce the ecosystem count
while `.NET Workspace` remains; it replaces the React/WPF presentation toolchain with Dart/Flutter
and direct FFI/Win32 responsibilities, plus C/C++ ownership only if the fallback is justified.

## 6. Security and lifecycle facts for the comparison controls

- `OFFICIAL-GUIDANCE-PATTERN`: Microsoft instructs WebView2 hosts to treat all Web content as
  untrusted, validate origins and messages, expose narrow messages rather than generic native
  proxies, restrict navigation and avoid elevated hosts
  ([WebView2 security](https://learn.microsoft.com/en-us/microsoft-edge/webview2/concepts/security),
  [WebView2 performance and messaging](https://learn.microsoft.com/en-us/microsoft-edge/webview2/concepts/performance)).
- `OFFICIAL-LIFECYCLE-LICENSING`: the Evergreen WebView2 Runtime updates independently; Release SDK
  stable APIs are forward-compatible, while managed clients can lag when update policy blocks the
  Runtime. Microsoft guidance instructs applications to feature-detect recent APIs
  ([WebView2 versioning](https://learn.microsoft.com/en-us/microsoft-edge/webview2/concepts/versioning)).
- `OFFICIAL-GUIDANCE-PATTERN`: Electron recommends no Node integration for remote content, context
  isolation, sandboxing, sender validation and narrowly exposed IPC
  ([Electron security](https://www.electronjs.org/docs/latest/tutorial/security),
  [context isolation](https://www.electronjs.org/docs/latest/tutorial/context-isolation)).
- `OFFICIAL-LIFECYCLE-LICENSING`: Electron supports its latest three stable major releases and has
  an eight-week major cadence
  ([Electron releases](https://www.electronjs.org/docs/latest/tutorial/electron-timelines)).
- `OFFICIAL-PRODUCT-FACT`: Electron documents application packaging and an `autoUpdater` path; its
  guidance notes that a private application may need an owned update service
  ([Electron packaging](https://www.electronjs.org/docs/latest/tutorial/application-distribution),
  [Electron updates](https://www.electronjs.org/docs/latest/tutorial/updates)).
- `OFFICIAL-GUIDANCE-PATTERN`: Tauri 2 uses capabilities and runtime authority to constrain which
  windows/WebViews may invoke commands and scopes. Application and plugin dependencies remain part
  of the trusted computing base
  ([Tauri security](https://v2.tauri.app/security/),
  [capabilities](https://v2.tauri.app/security/capabilities/),
  [runtime authority](https://v2.tauri.app/security/runtime-authority/)).
- `OFFICIAL-GUIDANCE-PATTERN`: Tauri updater signatures are mandatory and updater private-key loss
  prevents signing future updates for the installed trust root
  ([Tauri updater](https://v2.tauri.app/plugin/updater/)). Tauri separately documents bundling and
  Windows code-signing routes
  ([Tauri distribution](https://v2.tauri.app/distribute/),
  [Tauri Windows signing](https://v2.tauri.app/distribute/sign/windows/)).
- `OFFICIAL-LIFECYCLE-LICENSING`: Windows App SDK Stable is the supported production channel, with
  major releases no more often than every six months and version-specific end-of-servicing dates
  ([Windows App SDK channels](https://learn.microsoft.com/en-us/windows/apps/windows-app-sdk/release-channels)).

These facts describe maintainership obligations. They do not prove that any candidate is secure or
insecure after IDEA-specific code, dependencies, policy and deployment are added.

Across all six candidates, the Client presents session proof and the Server/IAM establishes the
Actor; a claimed `ActorId` from Web, WebView, Flutter, Electron, Tauri or native shell is never an
authority input. Browser cookie/token handling and any installed-client credential storage remain
separate security decisions and are `QUALIFICATION-UNKNOWN` here. A qualified native bridge exposes
typed use-case operations, validates origin or peer/process/session as applicable, bounds payloads and
paths, correlates requests, rejects replay/stale proof and avoids generic filesystem, shell, COM or
command execution. Framework sandboxing or capability configuration does not replace these product
boundary controls.

## 7. Architecture review challenge

### 7.1 Strongest case FOR Flutter

Flutter can make Web and installed Windows two targets of one presentation architecture rather than
one Web application hosted by two different containers. Shared Dart widgets, state/presentation
logic, validation, localization and widget tests can reduce renderer-bridge-specific UI behavior.
On Windows, a Flutter runner can own native windowing and direct Dart FFI can call the Win32
Workspace protocol client; a deliberately narrow shim/plugin remains a measured fallback. The WebView2 message bridge and WPF
presentation shell can disappear. That is a genuine simplification if the measured product slice
shows high source reuse, native-quality Windows behavior and acceptable Web semantics. If IDEA later
approves first-class mobile clients, Flutter's supported Android/iOS targets make this option more
strategically valuable without changing Server authority.

The strongest pro-Flutter case therefore is not “one codebase” in the abstract. It is one tested
presentation model across the two current surfaces, one UI state/validation model, fewer
container-specific UI defects, and a future mobile path—provided the custom Windows boundary stays
small and the data-heavy/accessibility/update qualifications pass.

### 7.2 Strongest case AGAINST Flutter

Flutter would replace a Web implementation that directly uses the browser DOM with a Flutter-owned
rendering and Semantics model, while IDEA's most demanding screens are precisely custom grid/tree,
keyboard, clipboard, IME and accessibility workflows. The current first-party evidence establishes
mechanisms, not the result IDEA needs. The Windows target also does not eliminate the `.NET
Workspace`; it adds Dart FFI-to-Win32 named-pipe bindings and, only if needed, a custom shim/plugin.
Native handle/memory, async/cancellation, security, lifecycle and debugging remain qualification
seams that the current .NET shell does not cross through FFI.

The strongest anti-Flutter case is consequently the concentration of unresolved risk at both ends:
browser-native behavior on Web and Windows-native/Workspace behavior on Desktop. Rewriting the
existing proposal before the same-slice qualification would trade known but untested seams for more
new and unowned seams without an approved mobile requirement to pay for that trade.

### 7.3 Strongest case FOR current React + WPF/WebView2

React maps the Web surface to browser HTML/SVG, history, security and diagnostic primitives, and the
same React business UI can be served inside WebView2. WPF can remain a narrow Windows shell rather
than duplicate the business UI. Its .NET boundary aligns with the separate `.NET Workspace` and the
current same-user named-pipe candidate, while Microsoft publishes explicit WebView2 origin/message
hardening and Evergreen lifecycle guidance. Under the current Web plus Windows scope, this is the
shortest path from repository architecture to a testable vertical slice and introduces no new UI
language or native ABI bridge.

The strongest case is therefore continuity with the current documented proposal and a well-defined
control implementation—not evidence of fewer actual seams, lower lifecycle risk, or a claim that
WebView2/WPF is automatically secure or fast.

### 7.4 Strongest case AGAINST current React + WPF/WebView2

Option A still operates a Web bundle, a WPF shell, WebView2 runtime policy and a separate Workspace.
Every native capability crossing the embedded renderer needs an origin-checked, narrowly shaped
message contract; navigation, process failure, runtime update and shell/Web version skew add failure
modes that a single Flutter Windows presentation would not have. A narrow shell can also become
accidental duplicate UI over time. If the browser plus secure local agent satisfies all installed
surface needs, WPF and embedded WebView2 may be unnecessary; if Flutter passes the representative
slice, the shell/renderer split may be complexity without enough benefit.

Option A therefore still earns or loses `SELECT` through the same PoC. Existing documentation is
not evidence that its bridge, resource use, accessibility, update coordination or browser/embedded
parity passes.

### 7.5 Is WPF itself necessary?

No first-party technology fact makes WPF logically necessary merely to show Workspace status,
launch an approved process or open a native dialog. A browser plus a separately installed local
agent could expose narrow use cases, and a Flutter Windows runner could own the same shell
responsibilities. However, the current repository carries installed Desktop and Web-rendered
Desktop surface obligations; removing that surface is a Product Decision Authority action rather
than a framework optimization. Option C also leaves browser-to-agent discovery, origin/session
binding, cross-user isolation, update compatibility, focus/error recovery and native UX unproved.

The controlled position is therefore to keep WPF narrow and provisional, not to treat it as Product
Scope. Option C remains `CONDITIONAL`, and Option B remains the installed-client challenger. A
successful browser-agent security/UX prototype or Flutter A/B result can reopen the shell choice;
the existing proposal alone cannot establish that WPF is necessary.

## 8. Required qualification before changing the recommendation

Build the same bounded vertical slice twice—Option A and Option B—without changing Server or
Workspace authority. Before execution, the Product/Engineering reviewers approve the fixture,
machine profile and acceptance thresholds so the experiment cannot move its goalposts afterward.

The proposed slice covers:

1. Document Browser plus hierarchical Product Structure, representative metadata forms and a
   large representative grid/tree corpus.
2. Keyboard-only navigation, multi-selection, inline editing, context menus, browser history and
   deep links.
3. EN/VI/JA runtime language switching, approved company IMEs, font fallback, selection/copy and
   focus recovery.
4. Web accessibility and Windows accessibility with the approved assistive-technology matrix,
   including custom grid/tree semantics.
5. Signed Desktop startup, native file/folder dialog, Workspace status, open with OS association,
   Office/IRONCAD launch and cancellation/error recovery.
6. Authenticated, versioned Workspace IPC under same-user, different-user, elevated/non-elevated,
   stale-session, replay, malformed-frame, restart and concurrent-operation cases.
7. Multi-GB transfer without whole-file UI buffering; Workspace journal/recovery survival across shell
   crash, update and machine restart.
8. Cold/warm startup, idle/active memory, input latency, scroll/edit latency and bundle/install size
   measured on the same managed machine. All results remain `NOT-RUN` until captured.
9. Web and Desktop build reproducibility, dependency/SBOM/license inventory, signing, upgrade,
   rollback and preservation of the Workspace directory.
10. Unit/component/widget, browser E2E, Windows full-system automation, accessibility, visual and
     IPC contract tests, with limitations recorded rather than silently skipped.

For Option B, the first implementation lane is direct Dart FFI to the Win32 named-pipe client API.
Only a recorded direct-FFI blocker may introduce the fallback shim/plugin, which must then be measured
and inventoried as an additional boundary rather than silently folded into Flutter.

### 8.1 Proposed measurable acceptance record

The following are experiment controls, not new Product requirements. Exact scale, environment and
performance thresholds that the current repository leaves `BLOCKED` need approval and freezing in
the qualification record before either build is timed. Until then, the criterion is measurable in
form but its numeric threshold remains `BLOCKED`; no result can be `PASS`.

| Concern | Same-slice measure | Proposed acceptance rule | Current state |
|---|---|---|---|
| Authoritative behavior | Execute Login → Search → Browser → Detail → Checkout → Workspace Open → Check-in-status cases against the same Server fixtures; compare command, refusal and uncertain outcomes and retained local candidate | Both candidates produce the same authorized Server outcome; zero client-created authoritative state; every failure preserves the prior authoritative state and required local candidate | `NOT-RUN` |
| Grid/tree correctness and scale | Freeze representative row count, column count, hierarchy-node count/depth and edit mix; record selection/edit/context-menu correctness plus p50/p95/p99 input-to-visible-response and frame-time distributions | Zero wrong-row edits, lost selection or hidden unresolved rows; performance envelope approved before run and met on the same device/data | Fixture and thresholds `BLOCKED`; test `NOT-RUN` |
| Keyboard workflow | Complete all primary slice operations, tree expand/collapse, grid navigation/edit, dialogs and recovery without a pointer; record unreachable actions, focus loss and focus traps | 100% of the frozen task script completes by keyboard; zero focus traps; documented focus returns after dialog, error and route transitions | `NOT-RUN` |
| Accessibility | Run the same Web and native-Windows task script with the approved browser/screen-reader matrix; inspect accessible name/role/state, focus order and live error/status announcements | Every critical task completes; zero unlabeled critical controls, invisible keyboard focus or silent blocking errors; applicable WCAG profile and specialist acceptance remain subject to DOC-08 authority | Matrix/reviewer `BLOCKED`; test `NOT-RUN` |
| EN/VI/JA and IME | Run DOC-08's nine-cell locale task matrix at the frozen viewport/scales; enter, edit, reconvert, select and copy approved Vietnamese and Japanese strings in forms and grid cells | Same task outcome in all nine cells; exact committed text round-trips; no clipped critical command/state label; no composition loss after focus/route change | Reviewers/IME inventory `BLOCKED`; test `NOT-RUN` |
| Browser behavior | Run direct URL, refresh, back, forward, multi-tab/session-expiry, upload/download, clipboard and print/export cases on every approved browser/version | No stale route represents committed state; unauthorized or expired actions are refused; downloaded/exported identity is exact; behavior differences are recorded, not masked | Browser inventory `BLOCKED`; test `NOT-RUN` |
| Windows behavior | Exercise cold/warm launch, minimize/restore, multiple windows if retained, monitor attach/remove, cross-monitor movement, every approved DPI/scale, drag/drop, native dialogs, notification and process launch/cancel | No off-screen/unrecoverable window, clipped critical action, lost edit, duplicate command or shell crash; DPI/focus/lifecycle observations captured per case | Device/scale inventory `BLOCKED`; test `NOT-RUN` |
| Workspace IPC security | Positive same-user session plus different-user, elevation mismatch, stale proof, replay, malformed/oversized frame, wrong protocol version, timeout, restart and concurrency matrix | Zero protected operations accepted for negative cases; no arbitrary command/path proxy; one correlated result per accepted request; restart/version failure is bounded and preserves local work | Protocol detail `QUALIFICATION-UNKNOWN`; test `NOT-RUN` |
| Transfer and recovery | Interrupt the approved multi-GB fixture at every transfer boundary, crash UI/Workspace separately, restart and resume; capture digest, retransmitted chunks and peak memory | Final digest exact; no premature publish; safely accepted chunks are not needlessly resent; no process requires the whole Artifact in memory; local candidate survives UI failure | Exact size/memory bound `BLOCKED`; test `NOT-RUN` |
| Performance/resources | On one frozen managed machine/network, collect cold/warm usable-start time, bundle/download/install size, idle/active memory, CPU, p50/p95/p99 interaction latency and long-task/frame data for A and B | Publish raw runs and variance; acceptance evaluates the challenger against the pre-registered absolute envelope and non-inferiority margin for every critical journey, with no undocumented excluded outlier | Envelope/margin `BLOCKED`; test `NOT-RUN` |
| Build and update | Reproduce signed builds from locked dependencies/SBOM; install N, update N→N+1, reject tampered package, simulate interruption, execute rollback and verify Workspace compatibility | Reproducible provenance recorded; tampered/unsigned update rejected; interrupted update reaches an explicit recoverable state; rollback retains compatible Workspace data and no stale UI claims success | Signing/updater choice `BLOCKED`; test `NOT-RUN` |
| UI reuse and maintenance | Classify source by shared presentation/domain-client code, Web adapter, Windows adapter, bridge/plugin and test harness; record build steps, languages, direct/transitive dependencies and patch owners | Report measured source/dependency/owner inventory for A and B; no “single codebase” or ecosystem reduction claim without this inventory | `NOT-RUN` |

Option B can replace A in the proposal only if it passes the same product-specific gates, identifies
an owned and supportable grid/tree solution, defines the external `.NET Workspace` IPC client and
does not create a less governable update or security boundary. Failure of one prototype is evidence
about that implementation and fixture, not proof that Flutter as a whole is unsuitable.

## 9. Recommendation for the next controlled decision

**Engineering recommendation: `KEEP CURRENT BASELINE, BUT FLUTTER REMAINS QUALIFICATION
CHALLENGER`.**

Retain Option A in the proposal and add Option B as the explicit challenger used for a time-boxed,
same-slice qualification. Do not approve Flutter, reject Flutter or publish performance claims from
documentation alone. Do not remove the Desktop/Web-rendered Desktop surface through this research
record.

The material reason is not that React is more popular or that Flutter is mobile-oriented. Option A
is retained as the **provisional qualification control** because it is the current documented
proposal: React covers the Web surface, WebView2 reuses that UI in Desktop, and .NET supplies the
current Workspace client. This establishes a consistent starting comparator, not a proven seam-count
or lower-risk advantage. Flutter's stronger presentation-code reuse and future platform optionality
are real, but the latter is not a current requirement and the former does not remove the `.NET
Workspace` ecosystem. Q-15 decides the implemented boundary and risk comparison.

Reopen the recommendation when at least one of these evidence-bearing triggers occurs:

1. Product Decision Authority approves first-class Android or iOS clients, rather than recording
   them as roadmap optionality.
2. The controlled A/B slice shows Flutter meets every critical acceptance rule and materially
   reduces measured presentation/bridge ownership without worsening Web, accessibility, Windows,
   IPC or update outcomes.
3. Option A fails a required behavior because of a demonstrated WPF/WebView2 constraint and the
   same fixture shows Option B can meet it.
4. A supportable Flutter grid/tree and managed Windows update chain are selected with named owners,
   locked dependencies, licensing/SBOM evidence and successful qualification.
5. Flutter or a relevant browser/Windows runtime changes support, rendering, accessibility,
   lifecycle or platform behavior enough to invalidate a dated claim in this record.

If a later authority chooses Flutter, the controlled change extends beyond the decision matrix to
the Client/UI implementation decisions and traces in DOC-05, the surface/toolkit implications in
DOC-08, TECH-001 and any affected ADR; establish Dart/Flutter and plugin dependency authority;
baseline the Windows runner/native plugin, Workspace IPC, deployment/update, security and testing
contracts; and record a controlled change/version chain. Product requirements remain driven by
approved product need rather than rewritten to fit Flutter.

Review and acceptance remain `NOT-RUN`. No Feature, Spec, Tech, FTR, REQ, architecture, DDM
capability meaning, PG state or Product Scope changes in this artifact.
