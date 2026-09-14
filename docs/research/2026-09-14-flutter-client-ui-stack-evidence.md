# Client/UI stack re-evaluation evidence for IDEA Engineering

| Control field | Value |
|---|---|
| Stable Research ID | `IE-RES-TECH-CLIENT-20260914-001` |
| Document class / version / status | `RESEARCH-COMPARISON` / `0.1` / `Draft` |
| Product normativity | `INFORMATIVE`; this study creates no Product requirement and approves no Tech choice |
| Repository process authority / instruction state | `NOT-APPLICABLE` / `NOT-APPLICABLE` |
| Owner / author | Principal Product Author; named person attribution `BLOCKED` before `Proposed` |
| Reviewer / acceptance authority | Product Decision Authority; review and acceptance `NOT-RUN` |
| Applicable baseline | IDEA Engineering Core v0 Client/UI candidate baseline at repository `main` SHA `77563061a7d6159ca5adc954be45c4da57df8a44` |
| Evidence date / retrieval | `2026-09-14` (Asia/Saigon) |
| Classification / retention | `INTERNAL`; retain with the Tech evidence chain |
| Source / upstream trace | Current [IDEA catalogue](../product/instances/idea-engineering/README.md), [DOC-05](../product/instances/idea-engineering/DOC-05-architecture-description.md), [DOC-08](../product/instances/idea-engineering/DOC-08-ui-ux-and-interaction-specification.md), [TECH-001](../product/instances/idea-engineering/decision-briefs/TECH-001-technology-and-architecture-proposal.md), [technology decision matrix](../product/knowledge/2026-09-13-core-v0-technology-decision-matrix.md) and dated first-party sources cited below |
| Downstream trace | Input to a future [technology-matrix](../product/knowledge/2026-09-13-core-v0-technology-decision-matrix.md) or [TECH-001](../product/instances/idea-engineering/decision-briefs/TECH-001-technology-and-architecture-proposal.md) revision only; no downstream approval is created here |
| Change record / predecessor | New research comparison; no controlled predecessor |
| Supersedes / Superseded by | `NOT-APPLICABLE` / `NOT-APPLICABLE` |
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
| A | React + WPF + WebView2 + `.NET Workspace` | `SELECT`; `QUALIFICATION REQUIRED` | Retain as the engineering recommendation because React serves the browser and the same business UI can run in WebView2, while the small WPF/.NET shell and Workspace use directly documented Windows and same-user IPC primitives. The exact IDEA vertical slice, accessibility, deployment and resource envelope remain `NOT-RUN`. |
| B | Flutter Web + Flutter Windows + `.NET Workspace` | `ALTERNATIVE`; `QUALIFICATION REQUIRED` | Flutter is a serious challenger with supported Web and Windows targets, one Dart presentation model and first-party native-extension seams. It has not yet demonstrated IDEA's data-heavy grid/tree behavior, browser-native behavior, Web/Windows accessibility, EN/VI/JA IME, secure external-process Workspace IPC, signed update/rollback or support policy. |
| C | React browser-first + `.NET Workspace` | `CONDITIONAL`; `FOLLOW-UP PRODUCT DECISION REQUIRED` | It could remove an installed shell and embedded-renderer bridge, but the current Spec explicitly carries Desktop and Web-rendered Desktop surface obligations. Removing them is not a Tech-only substitution. Browser-to-agent discovery and authentication also remain unqualified. |
| D | React + Electron | `REJECT FOR CORE V0` | It reuses React, but IDEA would own a bundled Chromium, Node and Electron patch train. Electron supports only its latest three stable majors and releases a major approximately every eight weeks. That extra runtime authority has no evidenced Core v0 advantage over the current WebView2 route. |
| E | React + Tauri | `ALTERNATIVE`; `QUALIFICATION REQUIRED` | It reuses React and offers a capability-scoped Rust/WebView boundary, but adds Rust/Tauri while the `.NET Workspace` still remains. Exact IPC, accessibility, installer, updater-key custody, lifecycle and recovery behavior are unproved. |
| F | WinUI 3 + WebView2 | `ALTERNATIVE`; `QUALIFICATION REQUIRED` | It preserves React/WebView2 reuse and supplies a current Windows-native shell. It does not yet show a product benefit over WPF sufficient to justify migration, and the Windows App SDK has its own servicing clock. |

This is an engineering recommendation, not Product Decision Authority acceptance. Option A's
`SELECT` therefore means “keep as the proposal taken into qualification,” not “approved for build.”

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
  virtualization model and accessibility behavior must be selected and qualified for each option.
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

- `OFFICIAL-PRODUCT-FACT`: Flutter Windows uses a C++ host and supports Win32/COM-facing integration
  through plugins, platform channels and Dart FFI
  ([Windows integration](https://docs.flutter.dev/platform-integration/windows/building),
  [platform channels](https://docs.flutter.dev/platform-integration/platform-channels),
  [FFI](https://docs.flutter.dev/platform-integration/bind-native-code)).
- `OFFICIAL-PRODUCT-FACT`: platform channels join Dart to host code inside the Flutter application;
  FFI calls a C ABI. Neither mechanism by itself specifies authenticated IPC with the separate
  `.NET Workspace` process.
- `OFFICIAL-PRODUCT-FACT`: .NET 10 exposes `PipeOptions.CurrentUserOnly`; on Windows it verifies the
  user account and elevation level for named-pipe peers
  ([.NET PipeOptions](https://learn.microsoft.com/en-us/dotnet/api/system.io.pipes.pipeoptions?view=net-10.0)).
- `IDEA-INFERENCE`: Option A can implement the current same-user Workspace candidate directly in
  .NET. Option B needs a Dart/C++/FFI or another deliberately designed client for the same protocol.
  Localhost, a local socket or process stdio is not authorization by itself.
- `QUALIFICATION-UNKNOWN`: endpoint discovery, current-user/session isolation, mutual proof,
  framing, size limits, replay defense, version negotiation, restart handshake, malformed-message
  handling and CAD/Office/file-dialog flows.

Multi-GB staging, digesting, resume, journal and recovery must remain in the Workspace rather than
crossing a presentation channel as buffered UI data.

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

## 4. Cross-option comparison by required criteria

| Criterion | A: React/WPF | B: Flutter | C: browser-first | D: Electron | E: Tauri | F: WinUI/WebView2 |
|---|---|---|---|---|---|---|
| Web SPA | Native browser DOM/React candidate; `QUALIFICATION REQUIRED` | Supported app-centric Web target; JS/Wasm branches require qualification | Same Web candidate as A | Web build reused inside bundled Chromium | Web build reused inside system WebView | Same WebView2 content as A |
| Windows Desktop | Narrow WPF shell plus reused Web UI | Native-compiled Flutter Windows presentation | Installed shell removed or reduced; product decision required | Chromium/Node desktop shell | Rust/system-WebView shell | Current Windows-native shell |
| Workspace IPC | Direct .NET same-user named-pipe path | Custom Dart/C++/FFI external-process client required | Secure browser-agent bridge unproved | Node/native bridge plus Workspace protocol | Rust command/capability bridge plus Workspace protocol | Direct .NET path |
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

## 5. Security and lifecycle facts for the comparison controls

- `OFFICIAL-GUIDANCE-PATTERN`: Microsoft instructs WebView2 hosts to treat all Web content as
  untrusted, validate origins and messages, expose narrow messages rather than generic native
  proxies, restrict navigation and avoid elevated hosts
  ([WebView2 security](https://learn.microsoft.com/en-us/microsoft-edge/webview2/concepts/security),
  [WebView2 performance and messaging](https://learn.microsoft.com/en-us/microsoft-edge/webview2/concepts/performance)).
- `OFFICIAL-LIFECYCLE-LICENSING`: the Evergreen WebView2 Runtime updates independently; Release SDK
  stable APIs are forward-compatible, while managed clients can lag when update policy blocks the
  Runtime. Applications must feature-detect recent APIs
  ([WebView2 versioning](https://learn.microsoft.com/en-us/microsoft-edge/webview2/concepts/versioning)).
- `OFFICIAL-GUIDANCE-PATTERN`: Electron recommends no Node integration for remote content, context
  isolation, sandboxing, sender validation and narrowly exposed IPC
  ([Electron security](https://www.electronjs.org/docs/latest/tutorial/security),
  [context isolation](https://www.electronjs.org/docs/latest/tutorial/context-isolation)).
- `OFFICIAL-LIFECYCLE-LICENSING`: Electron supports its latest three stable major releases and has
  an eight-week major cadence
  ([Electron releases](https://www.electronjs.org/docs/latest/tutorial/electron-timelines)).
- `OFFICIAL-GUIDANCE-PATTERN`: Tauri 2 uses capabilities and runtime authority to constrain which
  windows/WebViews may invoke commands and scopes. Application and plugin dependencies remain part
  of the trusted computing base
  ([Tauri security](https://v2.tauri.app/security/),
  [capabilities](https://v2.tauri.app/security/capabilities/),
  [runtime authority](https://v2.tauri.app/security/runtime-authority/)).
- `OFFICIAL-GUIDANCE-PATTERN`: Tauri updater signatures are mandatory and updater private-key loss
  prevents signing future updates for the installed trust root
  ([Tauri updater](https://v2.tauri.app/plugin/updater/)).
- `OFFICIAL-LIFECYCLE-LICENSING`: Windows App SDK Stable is the supported production channel, with
  major releases no more often than every six months and version-specific end-of-servicing dates
  ([Windows App SDK channels](https://learn.microsoft.com/en-us/windows/apps/windows-app-sdk/release-channels)).

These facts describe maintainership obligations. They do not prove that any candidate is secure or
insecure after IDEA-specific code, dependencies, policy and deployment are added.

## 6. Required qualification before changing the recommendation

Build the same bounded vertical slice twice—Option A and Option B—without changing Server or
Workspace authority. Before execution, the Product/Engineering reviewers must approve the fixture,
machine profile and acceptance thresholds so the experiment cannot move its goalposts afterward.

The slice must include:

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
7. Multi-GB transfer without whole-file UI buffering; Workspace journal/recovery must survive shell
   crash, update and machine restart.
8. Cold/warm startup, idle/active memory, input latency, scroll/edit latency and bundle/install size
   measured on the same managed machine. All results remain `NOT-RUN` until captured.
9. Web and Desktop build reproducibility, dependency/SBOM/license inventory, signing, upgrade,
   rollback and preservation of the Workspace directory.
10. Unit/component/widget, browser E2E, Windows full-system automation, accessibility, visual and
    IPC contract tests, with limitations recorded rather than silently skipped.

Option B can replace A in the proposal only if it passes the same product-specific gates, identifies
an owned and supportable grid/tree solution, defines the external `.NET Workspace` IPC client and
does not create a less governable update or security boundary. Failure of one prototype is evidence
about that implementation and fixture, not proof that Flutter as a whole is unsuitable.

## 7. Recommendation for the next controlled decision

Retain Option A in the proposal and add Option B as the explicit challenger used for a time-boxed,
same-slice qualification. Do not approve Flutter, reject Flutter or publish performance claims from
documentation alone. Do not remove the Desktop/Web-rendered Desktop surface through this research
record.

The material reason is not that React is more popular or that Flutter is mobile-oriented. It is that
Option A currently has fewer unowned seams against IDEA's Windows-only local custody boundary:
React already covers the Web surface, WebView2 reuses that UI in Desktop, and .NET supplies the
current Workspace and same-user IPC path. Flutter's stronger presentation-code reuse and future
platform optionality are real, but the latter is not a current requirement and the former does not
remove the `.NET Workspace` ecosystem.

Review and acceptance remain `NOT-RUN`. No Feature, Spec, Tech, FTR, REQ, architecture, DDM
capability meaning, PG state or Product Scope changes in this artifact.
