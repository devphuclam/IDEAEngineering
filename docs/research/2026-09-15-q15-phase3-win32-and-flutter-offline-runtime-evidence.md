# Q-15 Phase 3 Win32 overlapped I/O and Flutter Web offline-runtime evidence

| Control field | Value |
|---|---|
| Stable Research ID | `IE-RES-TECH-Q15-PHASE3-20260915-001` |
| Document class / version / status | `RESEARCH-EVIDENCE` / `0.1` / `Draft` |
| Product normativity | `INFORMATIVE`; this record creates no Product requirement, technology decision, qualification result, Q-15 winner or approval |
| Repository process authority / instruction state | `NOT-APPLICABLE` / `NOT-APPLICABLE` |
| Owner / author | Principal Product Author; named person attribution `BLOCKED` before `Proposed` |
| Reviewer / acceptance authority | Product Decision Authority; review and acceptance `NOT-RUN` |
| Applicable baseline | IDEA Engineering Q-15 Phase 3 research context at local repository commit `8bc0f955247a5c635498dbd76dce9527a2070b13`; no remote-baseline assertion |
| Evidence date / source access | `2026-09-15` (Asia/Saigon) |
| Classification / retention | `INTERNAL`; retain with the Q-15 technology evidence chain |
| Source / upstream trace | [`IE-STD-AUTH-001@0.2`](../agents/product-document-authoring-standard.md), [Q-15 Phase 2 evidence](../product/instances/idea-engineering/registers/VEV-2026-09-15-q15-client-ui-architecture-qualification-phase2.md), [prior Win32 semantics research](2026-09-15-q15-win32-overlapped-error-semantics.md), and the dated first-party sources registered below |
| Downstream trace | Future Q-15 Phase 3 implementation and successor verification/evidence record; no downstream decision or approval is created here |
| Change record / predecessor | Initial record; predecessor `NOT-APPLICABLE`; adds a fresh first-party Phase 3 research snapshot without superseding the Phase 2 evidence or prior Win32 research; Product Scope impact `NONE` |
| Supersedes / Superseded by | `NOT-APPLICABLE` / `NOT-APPLICABLE` |
| Review trigger | Material Microsoft API-contract or Flutter toolchain/runtime change; Q-15 Phase 3 execution; or Product Decision Authority review |
| Evidence status | First-party Microsoft Learn, Flutter documentation, Flutter API and version-pinned Flutter source reviewed at the access date; executable interoperability, cancellation, asset-origin and offline qualification `NOT-RUN` |

Control tailoring under `IE-STD-AUTH-001@0.2`: this record identifies dated first-party sources,
assigns a claim ID and evidence class to each material finding, retains source tensions and separates
vendor facts from bounded IDEA interpretations. It does not modify implementation, Matrix,
TECH-001, Feature, Spec, FTR, REQ, architecture, Product Scope or gate state.

## 1. Questions and evidence boundary

This record supports two Phase 3 questions without deciding either candidate:

1. What current Microsoft first-party sources require for named-pipe connection, overlapped
   read/write initiation, completion, timeout, cancellation, native-object lifetime and
   `GetLastError` capture.
2. What current Flutter first-party sources establish for locally served CanvasKit/Skwasm
   resources, fallback-font configuration, bundled application fonts and Web runtime behavior when
   public third-party origins are unavailable.

Evidence labels used below are:

| Label | Meaning |
|---|---|
| `DIRECT-FIRST-PARTY-FACT` | A current vendor API reference or product document directly states the behavior. |
| `VERSION-PINNED-FIRST-PARTY-SOURCE` | Behavior is present in official source at the exact Flutter commit used by Q-15; it is not promoted to an eternal toolchain promise. |
| `IDEA-INFERENCE` | A conservative implementation or qualification implication derived from cited facts; not a vendor promise or Product decision. |
| `SOURCE-TENSION` | First-party sources leave an adjacent handoff inconsistent or under-specified; this record preserves rather than guesses through it. |
| `UNKNOWN` / `NOT-RUN` | The source set does not establish the claim, or the required executable observation was not performed. |

No Stack Overflow answer, third-party blog, package marketing page or unsourced benchmark is used
as normative evidence.

## 2. First-party source register

### 2.1 Microsoft Win32 sources

All Microsoft sources were retrieved on `2026-09-15`. A page-footer date identifies the retrieved
publication snapshot; it is not a future compatibility promise.

| Source ID | First-party source | Publication context | Evidence use / limitation |
|---|---|---|---|
| `MS-P3-01` | Microsoft Learn, [`ReadFile`](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-readfile) | Win32 API reference; footer `2025-07-22` | Async handle/`OVERLAPPED`, return classification, buffer lifetime and async byte-count pointer guidance. |
| `MS-P3-02` | Microsoft Learn, [`WriteFile`](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-writefile) | Win32 API reference; footer `2025-03-03` | Async handle/`OVERLAPPED`, return classification, buffer lifetime and async byte-count pointer guidance. |
| `MS-P3-03` | Microsoft Learn, [`GetOverlappedResult`](https://learn.microsoft.com/en-us/windows/win32/api/ioapiset/nf-ioapiset-getoverlappedresult) | Win32 API reference; footer `2022-09-23` | Same handle/request identity, transferred bytes, wait behavior and `ERROR_IO_INCOMPLETE`. |
| `MS-P3-04` | Microsoft Learn, [`GetOverlappedResultEx`](https://learn.microsoft.com/en-us/windows/win32/api/ioapiset/nf-ioapiset-getoverlappedresultex) | Win32 API reference; footer `2024-05-29` | Bounded/alertable completion wait and `ERROR_IO_INCOMPLETE`, `WAIT_TIMEOUT`, `WAIT_IO_COMPLETION`. |
| `MS-P3-05` | Microsoft Learn, [`CancelIoEx`](https://learn.microsoft.com/en-us/windows/win32/fileio/cancelioex-func) | Win32 API reference; footer `2021-01-07` | Targeted cancellation request, `ERROR_NOT_FOUND`, completion race and no-reuse lifetime rule. |
| `MS-P3-06` | Microsoft Learn, [Canceling Pending I/O Operations](https://learn.microsoft.com/en-us/windows/win32/fileio/canceling-pending-i-o-operations) | Win32 guidance; footer `2023-05-01` | Driver limitations and no-reuse-until-completion rule; its sample status check is retained as a tension, not used to override the API reference. |
| `MS-P3-07` | Microsoft Learn, [`WaitForSingleObject`](https://learn.microsoft.com/en-us/windows/win32/api/synchapi/nf-synchapi-waitforsingleobject) | Win32 API reference; footer `2024-08-22` | Signal/timeout/failure results, handle lifetime and window-thread caution. |
| `MS-P3-08` | Microsoft Learn, [`WaitNamedPipeW`](https://learn.microsoft.com/en-us/windows/win32/api/namedpipeapi/nf-namedpipeapi-waitnamedpipew) | Win32 API reference; footer `2023-02-02` | Availability wait, timeout/error capture and non-reserving success behavior. |
| `MS-P3-09` | Microsoft Learn, [`CreateFileW`](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-createfilew) | Win32 API reference; footer `2023-02-09` | Pipe opening, `INVALID_HANDLE_VALUE`, `FILE_FLAG_OVERLAPPED` and device/open semantics. |
| `MS-P3-10` | Microsoft Learn, [`CreateEventW`](https://learn.microsoft.com/en-us/windows/win32/api/synchapi/nf-synchapi-createeventw) | Win32 API reference; footer `2023-02-09` | Manual/auto reset, initial state, null failure and handle ownership. |
| `MS-P3-11` | Microsoft Learn, [`GetLastError`](https://learn.microsoft.com/en-us/windows/win32/api/errhandlingapi/nf-errhandlingapi-getlasterror) | Win32 API reference; footer `2024-02-06` | Per-thread storage, immediate capture and success-path caveat. |
| `MS-P3-12` | Microsoft Learn, [`OVERLAPPED`](https://learn.microsoft.com/en-us/windows/win32/api/minwinbase/ns-minwinbase-overlapped) | Win32 structure reference; footer `2022-09-23` | Request status, transferred-byte member, event semantics, initialization and no-reuse rules. |
| `MS-P3-13` | Microsoft Learn, [Synchronous and Overlapped Pipe I/O](https://learn.microsoft.com/en-us/windows/win32/ipc/synchronous-and-overlapped-input-and-output) | Named-pipe guidance; footer `2021-01-07` | Three-way initiation behavior, manual-reset event and one request/event pair per simultaneous operation. |
| `MS-P3-14` | Microsoft Learn, [Named Pipe Server Using Overlapped I/O](https://learn.microsoft.com/en-us/windows/win32/ipc/named-pipe-server-using-overlapped-i-o) | Microsoft sample/guidance; footer `2022-10-25` | Immediate versus pending flow and immediate byte-count wording; sample pointer usage is not treated as a universal API rule. |
| `MS-P3-15` | Microsoft Learn, [Synchronous and Asynchronous I/O](https://learn.microsoft.com/en-us/windows/win32/fileio/synchronous-and-asynchronous-i-o) | Win32 guidance; footer `2025-07-08` | Resource lifetime, event-specific waiting and immediate completion under an asynchronous handle. |
| `MS-P3-16` | Microsoft Learn, [Named Pipe Client](https://learn.microsoft.com/en-us/windows/win32/ipc/named-pipe-client) | Microsoft sample/guidance; footer `2021-01-07` | `CreateFile` / `ERROR_PIPE_BUSY` / `WaitNamedPipe` retry pattern; sample is synchronous and does not itself qualify an overlapped client. |

### 2.2 Flutter Web sources

Flutter documentation pages were retrieved on `2026-09-15`. The source-code references are pinned
to Flutter stable commit `9584c6713b324636289d067944a46fd6b49df14b`, the Flutter `3.47.4`
toolchain recorded in the Q-15 Phase 2 evidence. Documentation pages currently identify themselves
as Flutter `3.47.2`; the patch-version difference is explicitly retained.

| Source ID | First-party source | Publication context | Evidence use / limitation |
|---|---|---|---|
| `FL-P3-00` | Flutter infrastructure, [Windows release manifest](https://storage.googleapis.com/flutter_infra_release/releases/releases_windows.json) | Live first-party release metadata retrieved `2026-09-15` | Current stable version/framework/Dart snapshot; point-in-time only. |
| `FL-P3-01` | Flutter Docs, [Flutter web app initialization](https://docs.flutter.dev/platform-integration/web/initialization) | Documentation reflects Flutter `3.47.2`; updated `2026-09-08` | Loader/bootstrap configuration, `canvasKitBaseUrl`, `fontFallbackBaseUrl`, `forceSingleThreadedSkwasm` and custom-callback forwarding caveat. |
| `FL-P3-02` | Flutter Docs, [Support for WebAssembly](https://docs.flutter.dev/platform-integration/web/wasm) | Documentation reflects Flutter `3.47.2`; updated `2026-08-18` | `--wasm`, JavaScript fallback, runtime renderer detection and multi-threaded response-header requirements. |
| `FL-P3-03` | Flutter Docs, [Web FAQ](https://docs.flutter.dev/platform-integration/web/faq) | Current first-party guidance at retrieval | Flutter no longer creates/manages a service worker by default; application-owned service-worker/caching implication. |
| `FL-P3-04` | Flutter Docs, [Use a custom font](https://docs.flutter.dev/cookbook/design/fonts) | Documentation reflects Flutter `3.47.2`; updated `2026-05-05` | Declaring font files, weight/style and using family names in application/theme styles. |
| `FL-P3-05` | Flutter API, [`TextStyle.fontFamilyFallback`](https://api.flutter.dev/flutter/painting/TextStyle/fontFamilyFallback.html) | Current API documentation at retrieval | Ordered application fallback families, then platform default, then missing-glyph box behavior. |
| `FL-P3-06` | Flutter source, [`flutter_command.dart` at `9584c671`](https://github.com/flutter/flutter/blob/9584c6713b324636289d067944a46fd6b49df14b/packages/flutter_tools/lib/src/runner/flutter_command.dart) | Version-pinned official tool source | `web-resources-cdn` defaults `true`; false selects local CanvasKit resources. Source behavior requires re-check after a toolchain change. |
| `FL-P3-07` | Flutter source, [`web.dart` at `9584c671`](https://github.com/flutter/flutter/blob/9584c6713b324636289d067944a46fd6b49df14b/packages/flutter_tools/lib/src/build_system/targets/web.dart) | Version-pinned official build-target source | Default `gstatic` renderer URL, recursive local renderer-resource copy and local Roboto fallback behavior. |
| `FL-P3-08` | Flutter engine source, [`configuration.dart` at `9584c671`](https://github.com/flutter/flutter/blob/9584c6713b324636289d067944a46fd6b49df14b/engine/src/flutter/lib/web_ui/lib/src/engine/configuration.dart) | Version-pinned official engine source | Runtime configuration precedence and defaults: local `canvaskit/` when no build-time URL is injected, public `fonts.gstatic.com` fallback-font base otherwise. |
| `FL-P3-09` | Flutter Docs, [Build and release a web app](https://docs.flutter.dev/deployment/web) | Current first-party deployment guidance at retrieval | `build/web` is the deployable output served by a web server; documentation does not itself prove a given output contains every runtime response. |
| `FL-P3-10` | Flutter source, [`compile.dart` at `9584c671`](https://github.com/flutter/flutter/blob/9584c6713b324636289d067944a46fd6b49df14b/packages/flutter_tools/lib/src/web/compile.dart#L184-L220) | Version-pinned official compiler configuration | JavaScript builds default to CanvasKit; Wasm builds default to Skwasm. |
| `FL-P3-11` | Flutter loader source, [`utils.js`](https://github.com/flutter/flutter/blob/9584c6713b324636289d067944a46fd6b49df14b/engine/src/flutter/lib/web_ui/flutter_js/src/utils.js#L41-L55) and [`loader.js`](https://github.com/flutter/flutter/blob/9584c6713b324636289d067944a46fd6b49df14b/engine/src/flutter/lib/web_ui/flutter_js/src/loader.js#L155-L180) at `9584c671` | Version-pinned official loader source | Resolves the renderer base and passes the same value to CanvasKit and Skwasm loaders. |
| `FL-P3-12` | Flutter loader source, [`canvaskit_loader.js`](https://github.com/flutter/flutter/blob/9584c6713b324636289d067944a46fd6b49df14b/engine/src/flutter/lib/web_ui/flutter_js/src/canvaskit_loader.js#L8-L44) and [`skwasm_loader.js`](https://github.com/flutter/flutter/blob/9584c6713b324636289d067944a46fd6b49df14b/engine/src/flutter/lib/web_ui/flutter_js/src/skwasm_loader.js#L8-L94) at `9584c671` | Version-pinned official loader source | Resolves CanvasKit and selected Skwasm JavaScript/Wasm artifacts below the common base; re-check after Flutter upgrades. |
| `FL-P3-13` | Flutter engine source, [`font_fallback_service.dart`](https://github.com/flutter/flutter/blob/9584c6713b324636289d067944a46fd6b49df14b/engine/src/flutter/lib/web_ui/lib/src/engine/font_fallback_service.dart#L468-L558) and [`font_fallback_data.dart`](https://github.com/flutter/flutter/blob/9584c6713b324636289d067944a46fd6b49df14b/engine/src/flutter/lib/web_ui/lib/src/engine/font_fallback_data.dart#L5-L20) at `9584c671` | Version-pinned official engine source/generated catalogue | Dynamic fallback resolves generated relative paths against `fontFallbackBaseUrl` and fetches on demand; does not itself grant font redistribution rights. |

## 3. Win32 evidence claims

### 3.1 Initiation and completion classification

| Claim ID | Evidence class | Finding | Source | Boundary |
|---|---|---|---|---|
| `P3-WIN-001` | `DIRECT-FIRST-PARTY-FACT` | Asynchronous `ReadFile`/`WriteFile` requires a handle opened with `FILE_FLAG_OVERLAPPED` and a valid, unique `OVERLAPPED` per request. The request structure and I/O buffer remain live and unmodified until the operation completes. | [`MS-P3-01`](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-readfile), [`MS-P3-02`](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-writefile), [`MS-P3-12`](https://learn.microsoft.com/en-us/windows/win32/api/minwinbase/ns-minwinbase-overlapped) | This does not qualify a particular FFI layout, allocator or ownership implementation. |
| `P3-WIN-002` | `DIRECT-FIRST-PARTY-FACT` | When an overlapped pipe operation is complete before the initiating call returns, that return value reports success or failure. A nonzero/`TRUE` result is immediate success; it is not `PENDING`, and the pipe guidance does not direct this branch through the pending `GetOverlappedResult` flow. | [`MS-P3-01`](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-readfile), [`MS-P3-02`](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-writefile), [`MS-P3-13`](https://learn.microsoft.com/en-us/windows/win32/ipc/synchronous-and-overlapped-input-and-output), [`MS-P3-14`](https://learn.microsoft.com/en-us/windows/win32/ipc/named-pipe-server-using-overlapped-i-o) | The supported immediate byte-count handoff remains the separate tension in `P3-WIN-006`. |
| `P3-WIN-003` | `DIRECT-FIRST-PARTY-FACT` | `FALSE` followed immediately by `GetLastError()==ERROR_IO_PENDING` means the request was accepted and remains pending; Microsoft explicitly says `ERROR_IO_PENDING` is not failure. Only this branch enters pending completion observation. | [`MS-P3-01`](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-readfile), [`MS-P3-02`](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-writefile), [`MS-P3-13`](https://learn.microsoft.com/en-us/windows/win32/ipc/synchronous-and-overlapped-input-and-output) | It is an initiation state, not a terminal operation outcome. |
| `P3-WIN-004` | `DIRECT-FIRST-PARTY-FACT` | `FALSE` plus any immediate error other than `ERROR_IO_PENDING` is the immediate-failure branch for overlapped pipe read/write. It must not be treated as an outstanding request merely because the handle is overlapped. | [`MS-P3-01`](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-readfile), [`MS-P3-02`](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-writefile), [`MS-P3-13`](https://learn.microsoft.com/en-us/windows/win32/ipc/synchronous-and-overlapped-input-and-output) | Microsoft does not publish an exhaustive per-device error list. |
| `P3-WIN-005` | `DIRECT-FIRST-PARTY-FACT` | `GetOverlappedResult` receives the same handle and `OVERLAPPED`. With `bWait=FALSE`, a still-pending request produces `FALSE` plus `ERROR_IO_INCOMPLETE`; `GetOverlappedResultEx` can instead apply a finite timeout and distinguishes zero-time incomplete, nonzero `WAIT_TIMEOUT`, and alertable `WAIT_IO_COMPLETION`. | [`MS-P3-03`](https://learn.microsoft.com/en-us/windows/win32/api/ioapiset/nf-ioapiset-getoverlappedresult), [`MS-P3-04`](https://learn.microsoft.com/en-us/windows/win32/api/ioapiset/nf-ioapiset-getoverlappedresultex) | `WAIT_TIMEOUT` is a completion-wait result; neither page says it terminates or cancels the underlying I/O. |
| `P3-WIN-006` | `SOURCE-TENSION` / `UNKNOWN` | The current `ReadFile`/`WriteFile` references say the byte-count output pointer should be `NULL` for asynchronous use and direct callers to `GetOverlappedResult`. The named-pipe sample passes a non-null pointer, says bytes are returned for immediate completion, and says `GetOverlappedResult` reports pending operations only. These first-party pages do not unambiguously specify the portable immediate-success byte-count handoff for the null-pointer path. | [`MS-P3-01`](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-readfile), [`MS-P3-02`](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-writefile), [`MS-P3-12`](https://learn.microsoft.com/en-us/windows/win32/api/minwinbase/ns-minwinbase-overlapped), [`MS-P3-14`](https://learn.microsoft.com/en-us/windows/win32/ipc/named-pipe-server-using-overlapped-i-o) | Do not hide the tension by unconditionally calling `GetOverlappedResult` after `TRUE`. A chosen immediate-byte path needs an explicit source rationale and executable qualification. |

The documented start classification can therefore be represented without conflating initiation and
completion:

```text
ReadFile / WriteFile with a valid OVERLAPPED
  |
  +-- TRUE --------------------------> IMMEDIATE_SUCCESS
  |                                    no pending wait/query path
  |
  +-- FALSE -> capture GetLastError immediately
       |
       +-- ERROR_IO_PENDING ---------> PENDING
       |                                retain request resources
       |
       +-- any other error ----------> IMMEDIATE_FAILURE(errorCode)
                                        no pending wait
```

`IDEA-INFERENCE`: a narrow native start result with discriminated `state`, `errorCode` and
`bytesTransferred` fields is consistent with these branches and prevents the Dart caller from
reconstructing Win32 state from ambiguous values. Microsoft does not prescribe that ABI shape.
Because `P3-WIN-006` is unresolved by documentation alone, `bytesTransferred` on the immediate
branch is qualification-sensitive rather than automatically `PASS`.

### 3.2 Event, wait, timeout and cancellation lifetime

| Claim ID | Evidence class | Finding | Source | Boundary / Phase 3 implication |
|---|---|---|---|---|
| `P3-WIN-007` | `DIRECT-FIRST-PARTY-FACT` | Unused `OVERLAPPED` fields must be zeroed. Its event must be zero or valid; Microsoft recommends a separate manual-reset event for each simultaneous operation. Read/write changes that event to nonsignaled for a pending operation and signals it on completion. | [`MS-P3-10`](https://learn.microsoft.com/en-us/windows/win32/api/synchapi/nf-synchapi-createeventw), [`MS-P3-12`](https://learn.microsoft.com/en-us/windows/win32/api/minwinbase/ns-minwinbase-overlapped), [`MS-P3-13`](https://learn.microsoft.com/en-us/windows/win32/ipc/synchronous-and-overlapped-input-and-output) | An event wakeup indicates that completion can be queried; it does not replace final status and transferred-byte interpretation. |
| `P3-WIN-008` | `DIRECT-FIRST-PARTY-FACT` | `WaitForSingleObject` returns `WAIT_OBJECT_0` for signaled, `WAIT_TIMEOUT` when the interval expires, and `WAIT_FAILED` on failure; only the failure branch directs the caller to `GetLastError`. Closing the waited handle while the wait is pending is undefined. | [`MS-P3-07`](https://learn.microsoft.com/en-us/windows/win32/api/synchapi/nf-synchapi-waitforsingleobject) | A wait timeout is not an I/O terminal state, and `GetLastError` must not be used to reclassify ordinary `WAIT_TIMEOUT`. |
| `P3-WIN-009` | `DIRECT-FIRST-PARTY-FACT` | Microsoft warns that a thread which creates windows must process messages and that an infinite wait on such a thread can deadlock; it points window-owning threads to message-aware wait functions. | [`MS-P3-07`](https://learn.microsoft.com/en-us/windows/win32/api/synchapi/nf-synchapi-waitforsingleobject) | Whether the candidate invokes the blocking wait on a Flutter window/UI thread is `UNKNOWN` until code and runtime-thread behavior are qualified. |
| `P3-WIN-010` | `DIRECT-FIRST-PARTY-FACT` | Successful `CancelIoEx` means cancellation was requested. It does not wait, and the operation can still finish normally, finish with `ERROR_OPERATION_ABORTED`, or fail with another error. `FALSE` plus `ERROR_NOT_FOUND` means no matching request was found, not that a particular terminal result was observed. | [`MS-P3-05`](https://learn.microsoft.com/en-us/windows/win32/fileio/cancelioex-func), [`MS-P3-06`](https://learn.microsoft.com/en-us/windows/win32/fileio/canceling-pending-i-o-operations) | Branch on the eventual completion status, not on the cancel-call return as though it were the I/O outcome. |
| `P3-WIN-011` | `DIRECT-FIRST-PARTY-FACT` | After cancellation is requested, the associated `OVERLAPPED` cannot be freed or reused until the I/O itself has completed. Microsoft also says an underlying driver might not support cancellation correctly or the request might no longer be cancelable. | [`MS-P3-05`](https://learn.microsoft.com/en-us/windows/win32/fileio/cancelioex-func), [`MS-P3-06`](https://learn.microsoft.com/en-us/windows/win32/fileio/canceling-pending-i-o-operations), [`MS-P3-15`](https://learn.microsoft.com/en-us/windows/win32/fileio/synchronous-and-asynchronous-i-o) | A second bounded delay after `CancelIoEx` does not authorize freeing live request memory. |
| `P3-WIN-012` | `IDEA-INFERENCE` | Caller-visible deadline expiry and native-request terminal completion are distinct states. A safe design can return timeout to the caller while transferring the still-live operation to an owner/reaper that retains its `OVERLAPPED`, event and buffer until a terminal completion query; only then can it close/free those resources. | [`MS-P3-03`](https://learn.microsoft.com/en-us/windows/win32/api/ioapiset/nf-ioapiset-getoverlappedresult), [`MS-P3-04`](https://learn.microsoft.com/en-us/windows/win32/api/ioapiset/nf-ioapiset-getoverlappedresultex), [`MS-P3-05`](https://learn.microsoft.com/en-us/windows/win32/fileio/cancelioex-func), [`MS-P3-11`](https://learn.microsoft.com/en-us/windows/win32/api/errhandlingapi/nf-errhandlingapi-getlasterror) | This is an evidence-bounded design implication, not a new Product requirement or proof that any current implementation satisfies it. |

The minimum safe lifetime model implied by the reviewed sources is:

```text
CREATED (OVERLAPPED + buffer + manual-reset event owned)
  |
  +-- immediate success/failure ---------------------------> TERMINAL
  |
  +-- pending -> WAITING
                  |
                  +-- completion --------------------------> TERMINAL
                  |
                  +-- caller deadline expires
                         |
                         +-- report caller timeout separately
                         +-- request CancelIoEx
                         +-- retain native operation ownership
                         +-- continue observing completion
                                      |
                                      +--------------------> TERMINAL

TERMINAL -> read final status/bytes -> close event/handles as owned -> free request/buffer
```

### 3.3 Pipe connection and exact last-error capture

| Claim ID | Evidence class | Finding | Source | Boundary / Phase 3 implication |
|---|---|---|---|---|
| `P3-WIN-013` | `DIRECT-FIRST-PARTY-FACT` | `WaitNamedPipeW` returns success only as an availability observation. A following `CreateFileW` can still fail because the server closed that instance or another client opened it. If no pipe instances exist it returns immediately regardless of the requested timeout; ordinary timeout reports `ERROR_SEM_TIMEOUT`. | [`MS-P3-08`](https://learn.microsoft.com/en-us/windows/win32/api/namedpipeapi/nf-namedpipeapi-waitnamedpipew) | Success is not a reservation. Connection logic needs a bounded retry/state policy, not an assumption that the next open must succeed. |
| `P3-WIN-014` | `DIRECT-FIRST-PARTY-FACT` | `CreateFileW` returns `INVALID_HANDLE_VALUE` on failure and directs the caller to `GetLastError`. `FILE_FLAG_OVERLAPPED` creates the asynchronous I/O handle required by later overlapped read/write; omitting it creates a synchronous handle even if an `OVERLAPPED` pointer is later supplied. | [`MS-P3-09`](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-createfilew), [`MS-P3-15`](https://learn.microsoft.com/en-us/windows/win32/fileio/synchronous-and-asynchronous-i-o) | The pipe-client open path must surface the handle state and exact immediate error together. |
| `P3-WIN-015` | `DIRECT-FIRST-PARTY-FACT` | `CreateEventW` returns `NULL` on failure. A manual-reset event remains signaled until reset; the handle must eventually be closed. | [`MS-P3-10`](https://learn.microsoft.com/en-us/windows/win32/api/synchapi/nf-synchapi-createeventw) | Event ownership and failure cleanup belong in the native transport primitive, not in business/UI code. |
| `P3-WIN-016` | `DIRECT-FIRST-PARTY-FACT` | Last-error storage belongs to the calling OS thread. Microsoft says to capture it immediately when the preceding return value says it is meaningful, because another call can replace or clear it; success can leave a stale value or set a documented success value. | [`MS-P3-11`](https://learn.microsoft.com/en-us/windows/win32/api/errhandlingapi/nf-errhandlingapi-getlasterror) | Never use an unconditionally sampled last-error as the primary success discriminator. |
| `P3-WIN-017` | `UNKNOWN` | The reviewed Microsoft sources do not establish that two separate Dart FFI calls—first a sensitive Win32 API, then `GetLastError`—execute on the same OS thread with no intervening native call. | [`MS-P3-11`](https://learn.microsoft.com/en-us/windows/win32/api/errhandlingapi/nf-errhandlingapi-getlasterror) | A narrow native function that performs the sensitive call and conditional last-error capture before returning a typed result is the conservative mitigation; its implementation still needs qualification. |

The capture conditions are API-specific:

| Native call | Primary result | Capture `GetLastError` in the same native call when | Do not infer |
|---|---|---|---|
| `ReadFile` / `WriteFile` | Boolean | result is `FALSE`; distinguish `ERROR_IO_PENDING` from immediate failure | Do not inspect stale last-error after `TRUE` to decide success. |
| `GetOverlappedResult` | Boolean | result is `FALSE`; distinguish `ERROR_IO_INCOMPLETE`, cancellation and other final errors | Do not confuse its incomplete status with initiation-time `ERROR_IO_PENDING`. |
| `GetOverlappedResultEx` | Boolean | result is `FALSE`; retain its documented incomplete/timeout/alertable/final-error distinctions | A timeout does not mean cancellation or terminal completion. |
| `CancelIoEx` | Boolean | result is `FALSE`, including possible `ERROR_NOT_FOUND` | Success is only a cancellation request; failure does not reveal a specific final I/O outcome. |
| `WaitNamedPipeW` | Boolean | result is `FALSE`, including `ERROR_SEM_TIMEOUT` | Success does not reserve the instance for `CreateFileW`. |
| `CreateFileW` | Handle | handle equals `INVALID_HANDLE_VALUE` | A valid handle must not be rejected because a stale last-error is nonzero. |
| `CreateEventW` | Handle | handle is `NULL` | A valid handle is the primary success signal. |
| `WaitForSingleObject` | Wait code | result is `WAIT_FAILED` | `WAIT_OBJECT_0` and `WAIT_TIMEOUT` are self-describing return codes, not last-error branches. |

`IDEA-INFERENCE`: this evidence supports typed connection/start/wait/complete/cancel functions that
capture conditional last-error internally. It does not support a generic Windows API proxy,
business logic, arbitrary path or process authority, or Workspace policy in the shim.

## 4. Flutter Web runtime and font evidence claims

### 4.1 Renderer assets and runtime origin

| Claim ID | Evidence class | Finding | Source | Boundary |
|---|---|---|---|---|
| `P3-FLW-001` | `DIRECT-FIRST-PARTY-FACT` | Flutter's Web loader accepts `canvasKitBaseUrl`, defined as the base URL used to download `canvaskit.wasm`. It also exposes `forceSingleThreadedSkwasm` for Wasm builds when `SharedArrayBuffer` or required headers are unavailable. | [`FL-P3-01`](https://docs.flutter.dev/platform-integration/web/initialization) | The documentation entry alone does not enumerate every runtime file used by every renderer/variant. |
| `P3-FLW-002` | `VERSION-PINNED-FIRST-PARTY-SOURCE` | In Flutter `9584c671`, the Web-resources-CDN flag defaults to `true`. Unless local resources are selected or a URL was already supplied, the build target injects an engine-revision URL below `https://www.gstatic.com/flutter-canvaskit/`. | [`FL-P3-06`](https://github.com/flutter/flutter/blob/9584c6713b324636289d067944a46fd6b49df14b/packages/flutter_tools/lib/src/runner/flutter_command.dart), [`FL-P3-07`](https://github.com/flutter/flutter/blob/9584c6713b324636289d067944a46fd6b49df14b/packages/flutter_tools/lib/src/build_system/targets/web.dart) | This establishes the pinned tool's default, not that every Phase 3 build actually used it. |
| `P3-FLW-003` | `VERSION-PINNED-FIRST-PARTY-SOURCE` | In the same pinned tool, disabling CDN resources selects local CanvasKit mode. The build target recursively copies the Flutter Web SDK's `canvaskit/` directory into the Web output and marks local-resource use in generated build configuration. | [`FL-P3-06`](https://github.com/flutter/flutter/blob/9584c6713b324636289d067944a46fd6b49df14b/packages/flutter_tools/lib/src/runner/flutter_command.dart), [`FL-P3-07`](https://github.com/flutter/flutter/blob/9584c6713b324636289d067944a46fd6b49df14b/packages/flutter_tools/lib/src/build_system/targets/web.dart) | A directory copy is build evidence, not a zero-public-request runtime result. The output and actual browser network trace still require qualification. |
| `P3-FLW-003A` | `VERSION-PINNED-FIRST-PARTY-SOURCE` | Flutter `9584c671` resolves one renderer base and passes it to both CanvasKit and Skwasm. Their loaders resolve their JavaScript/Wasm artifacts beneath that base, so the locally copied renderer directory is the current source-supported path for both renderer families. | [`FL-P3-11`](https://github.com/flutter/flutter/blob/9584c6713b324636289d067944a46fd6b49df14b/engine/src/flutter/lib/web_ui/flutter_js/src/loader.js#L155-L180), [`FL-P3-12`](https://github.com/flutter/flutter/blob/9584c6713b324636289d067944a46fd6b49df14b/engine/src/flutter/lib/web_ui/flutter_js/src/skwasm_loader.js#L8-L94) | Public initialization docs describe `canvasKitBaseUrl` narrowly as the CanvasKit-Wasm base; its Skwasm use is pinned implementation evidence and must be re-reviewed on upgrade. |
| `P3-FLW-004` | `DIRECT-FIRST-PARTY-FACT` / `IDEA-INFERENCE` | Flutter supports a custom bootstrap file and runtime loader configuration. When a custom `onEntrypointLoaded` callback is supplied, loader configuration is not automatically forwarded; the callback must pass configuration to `initializeEngine` itself. | [`FL-P3-01`](https://docs.flutter.dev/platform-integration/web/initialization) | A configuration placed only on `_flutter.loader.load()` can be silently ineffective in the custom-callback branch; the generated bootstrap must be inspected. |
| `P3-FLW-005` | `DIRECT-FIRST-PARTY-FACT` / `VERSION-PINNED-FIRST-PARTY-SOURCE` | Current source defaults ordinary JavaScript builds to CanvasKit and Wasm builds to Skwasm. A Wasm build also emits JavaScript output and uses it at runtime when WasmGC support is not detected. Multi-threaded WebAssembly rendering requires COEP and COOP response headers; single-threaded Skwasm is separately configurable. | [`FL-P3-10`](https://github.com/flutter/flutter/blob/9584c6713b324636289d067944a46fd6b49df14b/packages/flutter_tools/lib/src/web/compile.dart#L184-L220), [`FL-P3-01`](https://docs.flutter.dev/platform-integration/web/initialization), [`FL-P3-02`](https://docs.flutter.dev/platform-integration/web/wasm) | A locally deployed Wasm build must retain the JavaScript/CanvasKit fallback resources. “Built with `--wasm`” does not prove the browser executed Wasm/Skwasm; runtime mode and response headers must be captured. |

`IDEA-INFERENCE`: for the pinned Phase 3 toolchain, a supportable candidate path to remove the
default public renderer dependency is to build with Web CDN resources disabled, deploy the emitted
renderer directory under the controlled application origin, and verify bootstrap/base-URL
configuration against the produced output. That path is not a `PASS` until JS and Wasm browser
runs show zero required requests to public origins.

### 4.2 Fallback and application fonts

| Claim ID | Evidence class | Finding | Source | Boundary |
|---|---|---|---|---|
| `P3-FLW-006` | `DIRECT-FIRST-PARTY-FACT` / `VERSION-PINNED-FIRST-PARTY-SOURCE` | `fontFallbackBaseUrl` is the base URL for fallback fonts when bundled fonts lack a glyph, and its documented default is `https://fonts.gstatic.com/s/`. The pinned engine resolves generated catalogue paths against that base and fetches the selected font on demand. | [`FL-P3-01`](https://docs.flutter.dev/platform-integration/web/initialization), [`FL-P3-08`](https://github.com/flutter/flutter/blob/9584c6713b324636289d067944a46fd6b49df14b/engine/src/flutter/lib/web_ui/lib/src/engine/configuration.dart), [`FL-P3-13`](https://github.com/flutter/flutter/blob/9584c6713b324636289d067944a46fd6b49df14b/engine/src/flutter/lib/web_ui/lib/src/engine/font_fallback_service.dart#L468-L558) | Without explicit coverage/configuration, a missing glyph can create a public-origin runtime request. |
| `P3-FLW-007` | `DIRECT-FIRST-PARTY-FACT` | Flutter supports declaring font files as application assets in `pubspec.yaml`, including family, weight and style, and selecting those families through theme or `TextStyle`. These files are included with application assets by the build. | [`FL-P3-04`](https://docs.flutter.dev/cookbook/design/fonts) | The project must separately prove that the chosen legal font files cover the required EN/VI/JA glyph corpus. |
| `P3-FLW-008` | `DIRECT-FIRST-PARTY-FACT` | `fontFamilyFallback` is an ordered list consulted after the preferred family; if none contains the glyph, Flutter tries a platform default and ultimately renders a missing-glyph box. | [`FL-P3-05`](https://api.flutter.dev/flutter/painting/TextStyle/fontFamilyFallback.html) | Platform fallback is environment-dependent and is not evidence of deterministic packaged coverage. |
| `P3-FLW-009` | `VERSION-PINNED-FIRST-PARTY-SOURCE` | When local renderer resources are selected and no application family named Roboto already exists, Flutter `9584c671` adds its bundled `Roboto-Regular.ttf` to the application font manifest and output. That branch does not mirror the engine's generated Noto fallback catalogue or replace the separate `fontFallbackBaseUrl` default. | [`FL-P3-07`](https://github.com/flutter/flutter/blob/9584c6713b324636289d067944a46fd6b49df14b/packages/flutter_tools/lib/src/build_system/targets/web.dart#L701-L754), [`FL-P3-08`](https://github.com/flutter/flutter/blob/9584c6713b324636289d067944a46fd6b49df14b/engine/src/flutter/lib/web_ui/lib/src/engine/configuration.dart#L362-L376), [`FL-P3-13`](https://github.com/flutter/flutter/blob/9584c6713b324636289d067944a46fd6b49df14b/engine/src/flutter/lib/web_ui/lib/src/engine/font_fallback_data.dart#L5-L20) | Local renderer mode alone is not evidence of complete Vietnamese/Japanese/symbol/emoji coverage or permission to redistribute unrelated fonts. |
| `P3-FLW-010` | `UNKNOWN` | The reviewed public Flutter documentation exposes `fontFallbackBaseUrl` but does not define a complete, stable, self-hosted fallback-font file inventory, URL layout, license ledger or redistribution procedure for every supported script. | [`FL-P3-01`](https://docs.flutter.dev/platform-integration/web/initialization), [`FL-P3-04`](https://docs.flutter.dev/cookbook/design/fonts), [`FL-P3-08`](https://github.com/flutter/flutter/blob/9584c6713b324636289d067944a46fd6b49df14b/engine/src/flutter/lib/web_ui/lib/src/engine/configuration.dart) | Exact fallback requests and asset paths must be captured from the pinned runtime; license and redistribution evidence must precede committing font binaries. |

`IDEA-INFERENCE`: explicit, legally redistributable app fonts with measured EN/VI/JA glyph coverage
are the stronger deterministic control. Redirecting `fontFallbackBaseUrl` to a controlled origin is
still necessary if runtime fallback remains possible, but the exact files requested must be
observed and provisioned; changing the base URL alone does not create the assets.

### 4.3 Public-origin independence is not complete offline operation

| Claim ID | Evidence class | Finding | Source | Boundary |
|---|---|---|---|---|
| `P3-FLW-011` | `DIRECT-FIRST-PARTY-FACT` | `flutter build web` produces deployable content under `build/web`; current initialization guidance also states that Flutter no longer generates a service worker by default. | [`FL-P3-01`](https://docs.flutter.dev/platform-integration/web/initialization), [`FL-P3-03`](https://docs.flutter.dev/platform-integration/web/faq), [`FL-P3-09`](https://docs.flutter.dev/deployment/web) | Serving all runtime UI assets from the application origin does not make them available after that origin itself becomes unreachable. |
| `P3-FLW-012` | `IDEA-INFERENCE` | “Public third-party origins blocked while the controlled application origin remains reachable” validates public-runtime independence. “All network unavailable after prior/first load” additionally requires an application-owned cache/service-worker or packaged-distribution contract, and server-mediated login/API behavior has a separate availability boundary. | [`FL-P3-01`](https://docs.flutter.dev/platform-integration/web/initialization), [`FL-P3-03`](https://docs.flutter.dev/platform-integration/web/faq), [`FL-P3-09`](https://docs.flutter.dev/deployment/web) | Phase 3 must name the tested network condition. A blocklist run must not be reported as full offline/PWA qualification. |
| `P3-FLW-013` | `NOT-RUN` | No browser run, network capture, font-glyph corpus check or public-origin blocklist test was executed by this research task. | Research-task execution boundary | Renderer/font self-hosting and offline/public-origin status remain executable qualification outcomes, not documentation `PASS` claims. |

## 5. Source tensions and controlled unknowns

| Unknown / tension ID | State | Evidence boundary | Required resolution evidence |
|---|---|---|---|
| `UNK-P3-001` | `SOURCE-TENSION` / `UNKNOWN` | Current read/write API references prefer a null async byte-count pointer, while named-pipe guidance/sample returns immediate bytes through a non-null pointer and limits `GetOverlappedResult` to pending calls. | A documented chosen ABI path plus native regression cases that reliably exercise immediate successful read and write and validate exact byte counts. |
| `UNK-P3-002` | `SOURCE-TENSION` | The cancellation-guidance sample tests a nonblocking `GetOverlappedResult` failure against `ERROR_IO_PENDING`; the current `GetOverlappedResult` reference documents `ERROR_IO_INCOMPLETE`. | Follow the API reference for the binding and retain a raw test for the observed target-Windows status; do not copy the older sample comparison silently. |
| `UNK-P3-003` | `UNKNOWN` | Microsoft defines same-thread immediate `GetLastError`, but this source set does not establish atomicity across separate Dart FFI calls. | One native ABI call per sensitive operation that conditionally captures error before returning, plus integration/fault evidence for its mappings. |
| `UNK-P3-004` | `UNKNOWN` | A cancel request is not terminal, and driver cancellation is not guaranteed. | Repeated timeout/cancel/peer-disappearance cases showing ownership retained until terminal observation, with raw handle/memory diagnostics and honest nondeterministic classifications. |
| `UNK-P3-005` | `UNKNOWN` | Flutter docs expose renderer and fallback bases; they do not supply a complete self-hosted fallback-font inventory and redistribution contract. | Actual runtime request capture, controlled-origin asset manifest, pinned source/version, chosen font families, license/source record and measured EN/VI/JA corpus coverage. |
| `UNK-P3-006` | `NOT-RUN` | Local renderer-resource copying and base configuration do not prove that the browser made no required public request. | JS and Wasm release runs with `gstatic.com` and `fonts.gstatic.com` blocked, raw browser network capture and critical-flow/locale evidence. |
| `UNK-P3-007` | `NOT-RUN` | Wasm build output includes a JavaScript fallback and renderer threading depends on headers/configuration. | Record actual runtime mode, COOP/COEP headers or single-thread choice, resource origins and separate JS/Wasm results. |
| `UNK-P3-008` | `UNKNOWN` | The wait API warns against blocking a window-owning thread, but no reviewed source/run establishes the exact native-call thread used by the candidate. | Code-level thread ownership trace and a responsiveness/cancellation qualification under the installed Flutter Windows build. |

## 6. Evidence-bounded Phase 3 controls

The following are implementation/verification implications, not Product requirements or evidence
that a current candidate already complies:

1. A narrow native transport ABI should expose typed pipe-connect, I/O-start, wait/complete,
   cancel and terminal-cleanup operations. Every last-error-sensitive result should be captured in
   the same native call; the ABI should not expose generic Win32 execution, arbitrary filesystem or
   process authority, or business/Workspace policy.
2. An I/O-start result should preserve `IMMEDIATE_SUCCESS`, `PENDING` and `IMMEDIATE_FAILURE` as
   separate states. Only `PENDING` enters a completion query. The immediate byte-count mechanism
   must be documented and tested rather than assumed through an unconditional query.
3. A caller deadline can end the caller's wait, but a cancel request cannot end native ownership.
   Release `OVERLAPPED`, event and buffer only after terminal completion is observed.
4. A Web build intended to avoid public runtime dependencies should retain a version-coupled
   renderer asset manifest, controlled-origin URLs and explicit font assets/fallback policy. It
   should record asset count/size and patch ownership as operational evidence.
5. The browser qualification must distinguish at least:
   `controlled origin reachable + public origins blocked`, `warm cache with network unavailable`,
   and `first load with all network unavailable`. Only the first condition is required to prove no
   public third-party runtime dependency; the others answer different offline questions.
6. Network evidence must identify whether JavaScript or Wasm actually ran, the renderer/threading
   path, every request origin, and EN/VI/JA glyph samples. Unicode rendering is not IME evidence.

## 7. Evidence disposition

| Evidence item | Disposition | Basis |
|---|---|---|
| Win32 initiation three-way classification | `COMPLETE — DOCUMENTED` | Current Microsoft API and named-pipe guidance agree on immediate success, pending and immediate failure. |
| Pending wait/completion statuses | `COMPLETE — DOCUMENTED` | `GetOverlappedResult`, `GetOverlappedResultEx` and wait return contracts were reviewed. |
| Cancellation and request-resource lifetime | `COMPLETE — DOCUMENTED` | `CancelIoEx` request/race/final-result behavior and no-reuse rule are explicit. |
| Pipe availability/open behavior | `COMPLETE — DOCUMENTED` | `WaitNamedPipeW` success is non-reserving and `CreateFileW` remains the open authority. |
| Native ABI implementation correctness | `NOT-RUN` | No code was changed or executed by this research task. |
| Immediate-success byte-count ABI | `SOURCE-TENSION` / `UNKNOWN` | First-party documents do not cleanly reconcile the current async pointer guidance with the named-pipe sample. |
| Separate Dart FFI last-error atomicity | `UNKNOWN` | Microsoft describes the required OS-thread adjacency, not the Dart call-pair guarantee. |
| Flutter renderer local-build mechanism | `COMPLETE — DOCUMENTED FOR PINNED TOOLCHAIN` | Official configuration docs and Flutter `9584c671` tool source establish the mechanism/defaults. |
| Flutter public-origin independence | `NOT-RUN` | No blocklisted browser/network run occurred in this research task. |
| EN/VI/JA deterministic font coverage and license | `NOT-RUN` / `UNKNOWN` | Mechanisms are documented; no font selection, license record, glyph corpus or payload measurement was performed here. |
| Full offline/PWA behavior | `NOT-RUN`; separate concern | Flutter does not generate a service worker by default, and application/API availability requires an explicit offline contract. |
| Tests / repository verifiers | `NOT-RUN — execution instruction` | The task explicitly prohibited test and verifier execution. |
| Product Decision Authority review / acceptance | `NOT-RUN` | No independent review or acceptance evidence was supplied. |
| Q-15 winner / recommendation change | `NOT-APPLICABLE` | Research evidence alone does not adjudicate the candidates; Matrix and TECH-001 remain unchanged by this record. |

Final evidence statement: Microsoft first-party sources support a strict three-way start result and
require pending request resources to survive timeout and cancellation until terminal completion.
They require conditional, immediate, same-thread `GetLastError` capture but do not establish that
two separate Dart FFI calls satisfy that requirement. Flutter first-party documentation and pinned
tool source support locally built/served renderer resources, configurable fallback-font origin and
bundled app fonts; their defaults can still use public `gstatic` origins. Those mechanisms do not
constitute a runtime `PASS`: public-origin-blocked JS/Wasm runs, actual renderer selection, network
capture, legal EN/VI/JA font coverage and any stronger offline contract remain `NOT-RUN` or
`UNKNOWN`. Q-15's winner and recommendation are not changed by this research record.
