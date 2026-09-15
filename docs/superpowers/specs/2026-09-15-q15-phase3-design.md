# Q-15 Phase 3 Decision-Grade Qualification Design

| Control field | Value |
|---|---|
| Artifact class | `IMPLEMENTATION-DESIGN`; repository process aid, not a Product document |
| Status | `Approved input` — transcribes the user-supplied Phase 3 task for execution |
| Product normativity | `INFORMATIVE`; creates no FTR, REQ, architecture, Spec, Tech or gate decision |
| Baseline | `8bc0f955247a5c635498dbd76dce9527a2070b13` |
| Qualification predecessor | `IE-VEV-TECH-Q15-002` |
| Product Decision Authority state | `NOT-RUN` |

## Objective and non-goals

Phase 3 hardens and measures the existing Option A and Option B qualification implementations. It
must either produce evidence strong enough to propose an engineering winner or retain `NO WINNER —
MORE QUALIFICATION REQUIRED`. It does not research the framework choice from zero, implement a
Product feature, change Product Scope, alter Server/DB/modular-monolith decisions, or record PG3/PG4
progress.

## Native transport design

Option B retains a narrow, typed C++ ABI for named-pipe transport only. The ABI performs each
`GetLastError`-sensitive Win32 call and captures its error before returning to Dart. An I/O start
returns exactly one state: immediate success with byte count, pending with an opaque operation
handle, or immediate failure with error and stage.

A pending operation is a native-owned object containing a duplicated pipe handle, one manual-reset
event, one `OVERLAPPED`, and a native buffer. Dart never owns or frees those members. Completion
observation returns terminal success/failure, wait timeout, still-pending, or wait failure. Caller
timeout requests targeted cancellation but is not terminal completion. If completion is not
observed within the bounded cleanup interval, ownership transfers to a native reaper that retains
all objects until `GetOverlappedResult` observes a terminal result. Only terminal operations may be
released synchronously.

The ABI may open/close the named pipe, start read/write, wait/query completion, request cancellation,
transfer cleanup ownership and return diagnostic counters. It may not expose arbitrary Win32,
filesystem, path, process or business operations.

## UI and Web design

Flutter's grid keeps one horizontal controller and gains an explicit vertical controller.
Boundary/page navigation updates the logical selection, requests the needed page, scrolls to the
row's exact virtual offset and retains grid focus. Tests observe selection, viewport visibility,
page request, focus, edit, multi-select and context-menu behavior; source handlers alone are not
evidence.

Flutter Web builds use the SDK-supported local CanvasKit/Skwasm output and an explicit bootstrap
configuration pointing renderer and fallback-font URLs to the controlled application origin. The
app declares legally redistributable bundled fonts that cover English, Vietnamese and Japanese.
Browser tests abort public `gstatic.com` requests, record every request origin, exercise both JS and
Wasm release outputs, and distinguish text rendering from real IME composition.

## Measurement and evidence design

Competitive Windows runs use actual Release binaries, the same API/Workspace/fixture/machine and a
recorded counterbalanced order. `Q15_UI_READY` is retained only as `LOGIN_UI_READY` semantics. A
second `Q15_ENGINEERING_READY` milestone requires successful login, rendered search surface,
known Workspace availability, initial 100k-page rendering and accepted keyboard input. Raw output
precedes every normalized summary.

Resource capture records the process tree, working set, private bytes, CPU, handle and thread counts.
Repeated timeout/cancel/reconnect diagnostics look for monotonic or unbounded growth but do not claim
proof of no leak. Browser parity, IME, accessibility, cross-user/elevation and corporate deployment
are executed only where the current environment can produce real evidence; otherwise they remain
`BLOCKED`, `NOT-RUN` or `NOT-APPLICABLE`.

## Evidence and decision boundary

Phase 1 and Phase 2 packages remain immutable. Phase 3 creates `IE-VEV-TECH-Q15-003` with a new run
ID, exact baseline/source commits, commands, environment, raw files, normalized ledgers and a SHA-256
manifest. Any correction to a predecessor claim is recorded as a successor erratum. Matrix or
TECH-001 changes only if decision-grade evidence materially changes the engineering recommendation;
Product Decision Authority review remains separate.
