# Q-15 Win32 `ReadFile`/`WriteFile` `OVERLAPPED` error semantics

| Control field | Value |
|---|---|
| Stable Research ID | `IE-RES-TECH-CLIENT-OVERLAPPED-20260915-001` |
| Document class / version / status | `RESEARCH-EVIDENCE` / `0.1` / `Draft` |
| Product normativity | `INFORMATIVE`; this record creates no Product requirement, technology decision, qualification result or approval |
| Repository process authority / instruction state | `NOT-APPLICABLE` / `NOT-APPLICABLE` |
| Owner / author | Principal Product Author; named person attribution `BLOCKED` before `Proposed` |
| Reviewer / acceptance authority | Product Decision Authority; review and acceptance `NOT-RUN` |
| Applicable baseline | IDEA Engineering Q-15 Phase 2 Win32 interop research context at local repository commit `9629455b6dff6fbc4cb75a115bc1a4c93fcff3be`; no remote-baseline assertion |
| Evidence date / source access | `2026-09-15` (Asia/Saigon) |
| Classification / retention | `INTERNAL`; retain with the Q-15 technology evidence chain |
| Source / upstream trace | [`IE-STD-AUTH-001@0.2`](../agents/product-document-authoring-standard.md), [Q-15 Client/UI evidence](2026-09-14-flutter-client-ui-stack-evidence.md) and the first-party Microsoft sources registered below |
| Downstream trace | [Q-15 qualification record](../product/instances/idea-engineering/registers/VEV-2026-09-14-q15-client-ui-architecture-qualification.md) and future Product Decision Authority review; no downstream decision or approval is created here |
| Change record / predecessor | Initial research record; predecessor `NOT-APPLICABLE`; created to resolve the Phase 2 Win32 `OVERLAPPED` error-semantics question; Product Scope impact `NONE` |
| Supersedes / Superseded by | `NOT-APPLICABLE` / `NOT-APPLICABLE` |
| Review trigger | A Microsoft API-contract change; a material Dart/Flutter native-interoperation change; Q-15 rerun; or Product Decision Authority review |
| Evidence status | First-party Microsoft Learn API and guidance pages reviewed at the access date; Dart FFI last-error atomicity and the immediate-success byte-count handoff remain `UNKNOWN` under the Microsoft-only source boundary |

Control tailoring under `IE-STD-AUTH-001@0.2`: this record uses Microsoft Learn first-party pages as
the sole external evidence set, records source tension instead of resolving it by assumption, and
separates direct API facts from bounded Q-15 implications. It does not change Feature, Spec, Tech,
FTR, REQ, architecture, qualification or gate state.

## 1. Research question and boundary

This record answers how Win32 `ReadFile` and `WriteFile` behave when a handle is opened with
`FILE_FLAG_OVERLAPPED` and a valid, unique `OVERLAPPED` structure is supplied:

1. How to classify immediate `TRUE`, `FALSE` + `ERROR_IO_PENDING`, and `FALSE` + another error.
2. How `GetOverlappedResult` and `GetOverlappedResultEx` expose completion, bytes, incomplete,
   timeout and final error states.
3. What cancellation through `CancelIoEx` guarantees, and what it does not guarantee.
4. What the Microsoft `GetLastError` contract requires, and whether that contract establishes
   atomic capture through two separate Dart FFI calls.

This is an API-semantics note only. It does not select a Client/UI option, certify the current
qualification harness, set acceptance thresholds or claim a Q-15 winner.

Evidence labels used below are:

| Label | Meaning |
|---|---|
| `DIRECT-FIRST-PARTY-FACT` | Microsoft Learn directly documents the stated Win32 API behavior. |
| `IDEA-INFERENCE` | A bounded implication for a Q-15 binding, not a Microsoft promise or Product decision. |
| `SOURCE-TENSION` | Two first-party pages describe adjacent cases differently or leave a handoff implicit; the conflict is retained. |
| `SOURCE-GAP` / `UNKNOWN` | The reviewed Microsoft-only source set does not establish the requested interop contract. |

## 2. First-party Microsoft source register

All external sources below are current Microsoft Learn pages retrieved on `2026-09-15`. The page
footer date is retained where visible; a footer date is not treated as a future compatibility or
support promise.

| Source ID | Microsoft authority / page | Publication context | Evidence use and limitation |
|---|---|---|---|
| `MS-OV-01` | [ReadFile function](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-readfile) | Win32 API reference; page footer `2025-07-22` | Return values, `ERROR_IO_PENDING`, overlapped handle/structure and buffer lifetime; device-specific errors remain open. |
| `MS-OV-02` | [WriteFile function](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-writefile) | Win32 API reference; page footer `2025-03-03` | Return values, `ERROR_IO_PENDING`, overlapped handle/structure and buffer lifetime; device-specific errors remain open. |
| `MS-OV-03` | [Synchronous and asynchronous I/O](https://learn.microsoft.com/en-us/windows/win32/fileio/synchronous-and-asynchronous-i-o) | Win32 guidance; page footer `2025-07-08` | Immediate completion, `TRUE` with an asynchronous handle, event/completion-port lifetime caution and cancellation overview. |
| `MS-OV-04` | [Synchronous and Overlapped Pipe I/O](https://learn.microsoft.com/en-us/windows/win32/ipc/synchronous-and-overlapped-input-and-output) | Named-pipe guidance; page footer `2021-01-07` | Explicit `TRUE`/pending/other-error classification for `ReadFile`/`WriteFile`; older guidance, so API-reference instructions remain separately recorded. |
| `MS-OV-05` | [Named Pipe Server Using Overlapped I/O](https://learn.microsoft.com/en-us/windows/win32/ipc/named-pipe-server-using-overlapped-i-o) | Microsoft sample and explanation; page footer `2022-10-25` | States that immediate operations return their result and bytes, and that `GetOverlappedResult` reports pending operations only. The sample's output-pointer usage is not treated as a universal API rule. |
| `MS-OV-06` | [GetOverlappedResult function](https://learn.microsoft.com/en-us/windows/win32/api/ioapiset/nf-ioapiset-getoverlappedresult) | Win32 API reference; page footer `2022-09-23` | Same handle/`OVERLAPPED`, blocking versus nonblocking completion, `ERROR_IO_INCOMPLETE`, final bytes and final status. |
| `MS-OV-07` | [GetOverlappedResultEx function](https://learn.microsoft.com/en-us/windows/win32/api/ioapiset/nf-ioapiset-getoverlappedresultex) | Win32 API reference; page footer `2024-05-29` | Bounded wait, `ERROR_IO_INCOMPLETE`, `WAIT_TIMEOUT`, `WAIT_IO_COMPLETION` and alertable-wait behavior. |
| `MS-OV-08` | [OVERLAPPED structure](https://learn.microsoft.com/en-us/windows/win32/api/minwinbase/ns-minwinbase-overlapped) | Win32 structure reference; page footer `2022-09-23` | Pending/completed status in `Internal`, byte count in `InternalHigh`, event signaling and no-reuse lifetime rules. |
| `MS-OV-09` | [CancelIoEx function](https://learn.microsoft.com/en-us/windows/win32/fileio/cancelioex-func) | Win32 API reference; page footer `2021-01-07` | Targeted cancellation request, `ERROR_NOT_FOUND`, no-wait behavior, race outcomes and `ERROR_OPERATION_ABORTED`. |
| `MS-OV-10` | [Canceling Pending I/O Operations](https://learn.microsoft.com/en-us/windows/win32/fileio/canceling-pending-i-o-operations) | Win32 cancellation guidance; page footer `2023-05-01` | Driver cancellation limits, not-reuse-until-completion guidance and timeout-then-cancel pattern. Its embedded polling sample is not used to override the `GetOverlappedResult` API reference. |
| `MS-OV-11` | [GetLastError function](https://learn.microsoft.com/en-us/windows/win32/api/errhandlingapi/nf-errhandlingapi-getlasterror) | Win32 API reference; page footer `2024-02-06` | Per-thread storage, immediate capture requirement, success-path caveat and non-exhaustive error-code contract. |

## 3. Direct Win32 semantics

| Claim ID | Evidence class | Directly documented fact | Source | Limitation / inference boundary |
|---|---|---|---|---|
| `OV-SEM-001` | `DIRECT-FIRST-PARTY-FACT` | Overlapped `ReadFile`/`WriteFile` requires a handle opened with `FILE_FLAG_OVERLAPPED` and a valid, unique `OVERLAPPED` pointer. The read/write buffer and structure must remain valid until the operation completes; they must not be freed, modified or reused while pending. | `MS-OV-01`, `MS-OV-02`, `MS-OV-08` | This note does not qualify a particular Dart structure layout, allocator or handle topology. |
| `OV-SEM-002` | `DIRECT-FIRST-PARTY-FACT` | If the operation finishes before the initiating function returns, the return value indicates success or failure. For a successful immediate read/write, Microsoft’s pipe guidance says the transferred byte count is also returned. The event is not reset for an operation that finished before return. | `MS-OV-03`, `MS-OV-04`, `MS-OV-05` | The API references separately say that `lpNumberOfBytesRead`/`lpNumberOfBytesWritten` should be `NULL` for an overlapped handle and that `GetOverlappedResult` supplies bytes. The supported byte-count handoff for an immediate `TRUE` call with a null pointer is therefore a `SOURCE-TENSION`, not silently resolved here. |
| `OV-SEM-003` | `DIRECT-FIRST-PARTY-FACT` | If the operation is not finished when the initiating function returns, `ReadFile`/`WriteFile` returns `FALSE` and `GetLastError` returns `ERROR_IO_PENDING`. Microsoft explicitly says this code is not a failure: it means the asynchronous operation is pending. | `MS-OV-01`, `MS-OV-02`, `MS-OV-03`, `MS-OV-04` | `ERROR_IO_PENDING` classifies initiation as accepted/pending; it is not the operation’s final success or failure status. |
| `OV-SEM-004` | `DIRECT-FIRST-PARTY-FACT` | For asynchronous pipe read/write, if an error is already known when the function returns, the return value is `FALSE` and `GetLastError` is something other than `ERROR_IO_PENDING`. This is the immediate-error branch; the pending wait/`GetOverlappedResult` path applies only to `ERROR_IO_PENDING`. | `MS-OV-01`, `MS-OV-02`, `MS-OV-04` | Microsoft does not publish a closed exhaustive list of errors. `GetLastError` says error codes can vary by OS or device driver. |
| `OV-SEM-005` | `DIRECT-FIRST-PARTY-FACT` | `GetOverlappedResult` must receive the same handle and `OVERLAPPED` used to start the operation. With `bWait=TRUE`, it waits when `Internal` is `STATUS_PENDING`; with `bWait=FALSE`, a still-pending operation returns `FALSE` and `GetLastError` returns `ERROR_IO_INCOMPLETE`. | `MS-OV-06`, `MS-OV-08` | `ERROR_IO_INCOMPLETE` is the completion-query polling result; it is distinct from the initiating call’s `ERROR_IO_PENDING`. |
| `OV-SEM-006` | `DIRECT-FIRST-PARTY-FACT` | Microsoft’s named-pipe guidance says `GetOverlappedResult` reports only operations whose results were pending; it does not report an operation completed before the initiating `ReadFile`/`WriteFile` returned. For a completed operation, `OVERLAPPED.Internal` holds the completion status and `InternalHigh` is documented as the transferred byte count when completion has no errors, although both members were originally reserved for system use and their behavior may change. | `MS-OV-05`, `MS-OV-08` | A binding must choose and qualify a supported immediate-success byte-count path; an unconditional `GetOverlappedResult` after initiating `TRUE` is not supported by this guidance. |
| `OV-SEM-007` | `DIRECT-FIRST-PARTY-FACT` | `GetLastError` is maintained per calling thread. Microsoft says to call it immediately when the preceding function’s return value indicates that it contains useful information, because another call can set or clear the value. A successful call may set last-error to zero or leave it unchanged, depending on the API. | `MS-OV-03`, `MS-OV-11` | The value after `TRUE` is not a reliable success discriminator; branch on the Boolean result first. |
| `OV-SEM-008` | `DIRECT-FIRST-PARTY-FACT` | Microsoft notes that `WriteFile` can return `TRUE` with `GetLastError` equal to `ERROR_SUCCESS` even on an asynchronous handle. When an I/O completion port is attached, a completion packet can still be delivered for that immediate completion. | `MS-OV-03` | This completion-port lifetime warning is not itself a claim that an event-based direct client receives a later callback. It does establish that `TRUE` must be interpreted together with the selected completion-notification model. |

### 3.1 Initiating-call state machine

The documented control flow is:

```text
ReadFile/WriteFile(handle, buffer, length, byteCount?, overlapped)
  |
  +-- TRUE --------------------------------------------------------------+
  |   operation completed before return; consume the immediate result   |
  |   (do not treat GetLastError as a required success signal)           |
  |
  +-- FALSE -> capture GetLastError immediately -------------------------+
      |
      +-- ERROR_IO_PENDING
      |   request accepted and still pending; retain buffer/OVERLAPPED
      |   until a terminal completion is observed
      |
      +-- any other error
          request completed with an immediate error; report that error
          and do not wait as though a pending operation existed
```

The `TRUE` branch above deliberately says “consume the immediate result” rather than prescribing
one byte-count pointer shape. The Microsoft pages agree on completion classification but leave a
source tension between the pipe guide’s immediate byte-count wording and the API references’ null
pointer recommendation for overlapped handles (see `OV-SEM-002` and `OV-SEM-006`).

## 4. Completion, timeout and cancellation

| Claim ID | Evidence class | Directly documented fact | Source | Q-15 implication |
|---|---|---|---|---|
| `OV-CAN-001` | `DIRECT-FIRST-PARTY-FACT` | A pending operation resets its `OVERLAPPED.hEvent` to nonsignaled; completion sets the event signaled. Microsoft recommends a separate manual-reset event per simultaneous operation and says not to reuse the structure or buffer until completion. | `MS-OV-01`, `MS-OV-02`, `MS-OV-06`, `MS-OV-08` | An event wait is a completion signal, not a substitute for the final status/byte-count query. |
| `OV-CAN-002` | `DIRECT-FIRST-PARTY-FACT` | `GetOverlappedResult` has no timeout parameter. `bWait=TRUE` waits for completion; `bWait=FALSE` returns immediately with `ERROR_IO_INCOMPLETE` while the operation remains pending. | `MS-OV-06` | A polling loop must preserve `ERROR_IO_INCOMPLETE` as “not finished,” not as an operation failure. |
| `OV-CAN-003` | `DIRECT-FIRST-PARTY-FACT` | `GetOverlappedResultEx` adds a timeout. With zero milliseconds and an in-progress operation it returns `FALSE` + `ERROR_IO_INCOMPLETE`; with a nonzero interval that elapses it returns `FALSE` + `WAIT_TIMEOUT`; `INFINITE` waits until completion or an alertable completion condition. | `MS-OV-07` | `WAIT_TIMEOUT` is a wait result. The page does not say that the underlying I/O is canceled by the timeout. |
| `OV-CAN-004` | `DIRECT-FIRST-PARTY-FACT` | `CancelIoEx` marks outstanding I/O for cancellation, can target one `OVERLAPPED`, affects the current process even when another thread issued the request, and does not wait for canceled operations to finish. If no request is found it returns `FALSE` + `ERROR_NOT_FOUND`. | `MS-OV-09`, `MS-OV-10` | A successful cancel call means “cancellation requested,” not “the operation is now canceled.” Keep the structure and buffers alive until terminal completion. |
| `OV-CAN-005` | `DIRECT-FIRST-PARTY-FACT` | Microsoft lists three possible final outcomes after cancellation: the operation can complete normally, complete canceled with `ERROR_OPERATION_ABORTED`, or fail with another relevant error. Cancellation can lose a race with normal completion, and drivers may not support cancellation correctly. | `MS-OV-09`, `MS-OV-10` | Always inspect final completion status; never infer the outcome from the `CancelIoEx` return alone. |
| `OV-CAN-006` | `IDEA-INFERENCE` | A bounded timeout flow is: observe `WAIT_TIMEOUT`; request targeted `CancelIoEx`; retain `OVERLAPPED`/buffers; wait or query until terminal completion; then classify normal success, `ERROR_OPERATION_ABORTED` or another final error. | `MS-OV-06`, `MS-OV-07`, `MS-OV-09`, `MS-OV-10` | This is a Q-15 handling pattern, not a new Product requirement. The final error must be captured immediately after the final query indicates it is useful. |

The cancellation article includes an embedded polling sample that compares a failed
`GetOverlappedResult` call with `ERROR_IO_PENDING`. The current `GetOverlappedResult` API reference
specifies `ERROR_IO_INCOMPLETE` for `bWait=FALSE` while pending. This note follows the API reference
for that status and records the sample as an outdated or inconsistent example, rather than
silently copying the comparison.

## 5. Last-error capture across Dart FFI

| Claim ID | Evidence class | Finding | Evidence basis | Disposition |
|---|---|---|---|---|
| `OV-FFI-001` | `DIRECT-FIRST-PARTY-FACT` | The Win32 contract is per OS thread: call `GetLastError` immediately on the same calling thread after a return value indicates useful error data. | `MS-OV-11` | Required for both the initiating `ReadFile`/`WriteFile` branch and a failed final completion query. |
| `OV-FFI-002` | `IDEA-INFERENCE` | A separate FFI call to `GetLastError` is semantically safe only if the interop layer guarantees same-thread execution with no intervening call that can change last-error. | `MS-OV-11` | This is the condition derived from Microsoft’s per-thread/immediate rule, not a Dart guarantee. |
| `OV-FFI-003` | `SOURCE-GAP` / `UNKNOWN` | The reviewed Microsoft-only pages do not define Dart VM/FFI thread affinity, scheduling or atomic adjacency between two Dart-to-native calls. Therefore they cannot establish that a separate Dart FFI `GetLastError` lookup atomically captures the error from the preceding `ReadFile`/`WriteFile` call. | `MS-OV-11`; no Microsoft Dart-FFI contract in the source set | Do not label separate-call capture `PASS` from these sources alone. A native wrapper that invokes the Win32 operation and captures `GetLastError` in one native call is a candidate mitigation; its correctness still needs Q-15 qualification. |
| `OV-FFI-004` | `IDEA-INFERENCE` | Treat the initiating call as a three-value result `(succeededImmediately, initialErrorIfFalse, pending)` and the completion query as a separate terminal result. Do not replace `FALSE` + immediate-error classification with “wait for every FALSE,” because Microsoft documents non-`ERROR_IO_PENDING` as the immediate-error branch. | `MS-OV-01` through `MS-OV-07`, `MS-OV-11` | This preserves error meaning even when FFI atomicity is unresolved. It is a handling implication, not a Product decision. |

Under the requested Microsoft-only boundary, the answer to “can Dart FFI safely capture last-error
atomically?” is therefore **`UNKNOWN`**. Microsoft specifies what must be true of the native call
pair; it does not specify that Dart’s separate FFI calls satisfy that condition. This is not a
claim that every Dart FFI implementation definitely changes threads or inserts an intervening
call. It is a source-bounded statement that such safety is not established by the reviewed
first-party Microsoft documentation.

## 6. Controlled unknowns and evidence disposition

| Unknown ID | State | Missing evidence | Why it remains open |
|---|---|---|---|
| `UNK-OV-001` | `UNKNOWN` | Supported byte-count retrieval for an immediate `TRUE` `ReadFile`/`WriteFile` when the API-reference-recommended asynchronous byte-count pointer is `NULL` | Microsoft’s pipe guide says immediate read/write bytes are returned, while the current API references recommend `NULL` and `GetOverlappedResult` for overlapped handles; the named-pipe guide also says `GetOverlappedResult` reports pending operations only. |
| `UNK-OV-002` | `UNKNOWN` | Dart VM/FFI same-thread and no-intervening-call guarantee for a separate `GetLastError` lookup | No Microsoft Learn page in the reviewed set specifies Dart FFI execution or scheduling semantics. |
| `UNK-OV-003` | `UNKNOWN` | Whether the target named-pipe driver and exact Windows image honor targeted `CancelIoEx` cancellation in every tested state | Microsoft says driver support and cancelable state are required; no target-driver qualification is part of this source review. |
| `UNK-OV-004` | `UNKNOWN` | Exact final-error propagation shape from the target pipe/driver after timeout, cancellation race, peer close or malformed protocol data | Microsoft documents representative status classes but says the complete error list can vary by OS/device/driver. |
| `UNK-OV-005` | `NOT-RUN` | Q-15 executable qualification of immediate success, pending, immediate error, timeout, cancellation race, peer close and repeated direct-FFI calls | This record performs documentation review only and does not run qualification code or verifier scripts. |

| Evidence item | Disposition | Evidence |
|---|---|---|
| Microsoft first-party source review | `COMPLETE — DOCUMENTATION SNAPSHOT` | Eleven Microsoft Learn Win32 API/guidance pages registered above, accessed 2026-09-15. |
| Initiating-call three-way classification | `COMPLETE — DOCUMENTED` | Immediate completion, `ERROR_IO_PENDING` and other-error branches are directly documented. |
| Completion query and timeout status | `COMPLETE — DOCUMENTED` | `GetOverlappedResult`/`GetOverlappedResultEx` statuses and timeout behavior are directly documented. |
| Cancellation final-status semantics | `COMPLETE — DOCUMENTED` | `CancelIoEx` request/race/terminal-status behavior and `ERROR_OPERATION_ABORTED` are directly documented. |
| Dart FFI last-error atomicity | `UNKNOWN` | Microsoft’s per-thread/immediate rule is documented; Dart interop call-pair guarantees are not. |
| Immediate-success byte-count handoff with null pointer | `SOURCE-TENSION` / `UNKNOWN` | First-party pages do not reconcile the pipe-guide wording with the current API-reference recommendation. |
| Q-15 implementation, benchmark or winner | `NOT-RUN` | This note does not execute, modify or adjudicate the qualification harness. |
| Repository/documentation verifier scripts | `NOT-RUN — execution instruction` | The task explicitly prohibited verifier execution. |
| Product Decision Authority review / acceptance | `NOT-RUN` | No independent review or acceptance evidence was supplied. |

Final evidence statement: Microsoft documents `TRUE` as an operation completed before return,
`FALSE` + `ERROR_IO_PENDING` as an accepted pending operation, and `FALSE` + another error as an
immediate error for overlapped pipe I/O. `GetOverlappedResult` is for pending operations and uses
`ERROR_IO_INCOMPLETE` while a nonblocking query is still pending; `GetOverlappedResultEx` adds
`WAIT_TIMEOUT` but does not itself cancel the operation. `CancelIoEx` is a nonblocking cancellation
request whose final result may be normal, `ERROR_OPERATION_ABORTED` or another error. Microsoft
requires same-thread immediate `GetLastError` capture, but the reviewed Microsoft-only source set
does not establish atomic capture across separate Dart FFI calls. Winner and recommendation remain
`NOT-APPLICABLE`; Q-15 outcome is not assigned by this research record.
