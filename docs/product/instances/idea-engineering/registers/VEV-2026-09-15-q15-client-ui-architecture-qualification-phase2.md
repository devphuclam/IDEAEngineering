# Q-15 Client/UI Architecture Vertical Slice Qualification — Phase 2 Execution Record

## Control envelope

| Field | Recorded value |
|---|---|
| Stable Supporting Record ID | `IE-VEV-TECH-Q15-002` |
| Supporting class / version / status | `VEV` / `0.1` / `Draft` |
| Qualification state | **`Q-15 PARTIAL`**; `NO WINNER — MORE QUALIFICATION REQUIRED` |
| Date / operator | 2026-09-15 ICT / Principal Product Author in the local Windows workspace |
| Owner / reviewer / acceptance authority | Principal Product Author; independent Client, security, accessibility and operations review `NOT-RUN`; Product Decision Authority acceptance `NOT-RUN` |
| Product normativity | `INFORMATIVE` qualification evidence only; no Product requirement, architecture approval, technology selection or gate result |
| Repository process authority / instruction state | `NOT-APPLICABLE` / `NOT-APPLICABLE` |
| Applicable baseline | `IDEA-C1-ANALYSIS-DESIGN-001`; `IE-KNW-TECH-DEC-001@0.5`; `TECH-001@0.13`; predecessor `IE-VEV-TECH-Q15-001` |
| Exact qualification source | Commit `3ae5f22fe1dc6d81175142fabb5619e1d831fae0` (`feat: complete q15 phase2 qualification controls`) |
| Source / upstream trace | [technology matrix](../../../knowledge/2026-09-13-core-v0-technology-decision-matrix.md), [TECH-001](../decision-briefs/TECH-001-technology-and-architecture-proposal.md), [Phase 1 Q-15 record](VEV-2026-09-14-q15-client-ui-architecture-qualification.md), [Win32 research](../../../../research/2026-09-15-q15-win32-overlapped-error-semantics.md), [Q-15 harness](../../../../../qualification/q15/README.md) |
| Downstream trace | [Phase 2 evidence package](../evidence/IE-VEV-TECH-Q15-002/20260915-local-01/README.md), future completed Q-15 run and Product Decision Authority disposition |
| Access / retention | `INTERNAL`; retain with exact source commit, dependency locks, fixture/contracts, run ledger and raw retained measurements |
| Change record / predecessor | Phase 2 successor to `IE-VEV-TECH-Q15-001`; removes identified A/B evidence asymmetries without overwriting predecessor evidence |
| Supersedes / Superseded by | Supersedes `IE-VEV-TECH-Q15-001` for the Phase 2 qualification view; superseded by `NOT-APPLICABLE` |
| Review trigger | Complete blocked mandatory gates, change either candidate topology or shared contract, change machine/fixture/measurement envelope, or obtain Product Decision Authority criteria and disposition |
| Evidence status | Bounded Phase 2 automated evidence recorded; overall Q-15 remains `PARTIAL`; comparison and lifecycle outcome remain `QUALIFICATION-UNKNOWN` |

This record applies `IE-STD-AUTH-001@0.2`. The package is bounded to the exact source, environment,
fixture and commands. Missing corporate or human evidence remains `BLOCKED` or `NOT-RUN`. It does
not turn the qualification `.NET` API harness into the selected Server. The shared backend direction
remains Ubuntu Server, Java 25/Spring and PostgreSQL; the protected local component remains the
separate `.NET 10` Workspace.

## 1. Phase 2 question and result

Phase 2 asked whether the two client/UI candidates could be exercised through equivalent UI and
Workspace boundaries while deliberately breaking the direct FFI lane and repairing the grid/tree
state risks identified in Phase 1.

```text
Option A control: React → WebView2 message → WPF → Win32 named pipe → .NET Workspace
Option B challenger: Flutter Windows → Dart FFI + narrow Win32 error shim → Win32 named pipe → .NET Workspace
```

Option A completed an installed full business flow. Option B completed its Windows UI flow, its
separate direct API/Workspace smoke, ten controlled FFI failure cases, and Web JS/Wasm subsets.
Neither candidate has production Server, corporate deployment, real IME, assistive technology,
multi-user/elevation, artifact-application or complete active-performance evidence. The result is
**`NO WINNER — MORE QUALIFICATION REQUIRED`**. Option A remains the provisional qualification
control, not a proven lower-risk architecture; Option B remains a qualified challenger, not an
approved replacement.

## 2. Corrections made

| Finding | Phase 2 treatment | Evidence |
|---|---|---|
| Option A had no installed full flow | Added a narrow DOM-only WebView2 script and WPF polling hook; the test process never calls API/Workspace directly | [`option-a-installed-ui-integration.json`](../evidence/IE-VEV-TECH-Q15-002/20260915-local-01/option-a-installed-ui-integration.json) |
| Overlapped FFI false-return semantics | ReadFile/WriteFile and completion error capture moved into a two-function native shim; only `ERROR_IO_PENDING` waits; other immediate errors are classified | [`q15_io_shim.cpp`](../../../../../qualification/q15/option-b/flutter/windows/runner/q15_io_shim.cpp), [Win32 research](../../../../research/2026-09-15-q15-win32-overlapped-error-semantics.md) |
| Flutter requested-page cache could survive a new search | `pagingKey`/dataset generation resets requested, selection, edit and scroll state; stale asynchronous results are ignored | [`grid-tree-regression.json`](../evidence/IE-VEV-TECH-Q15-002/20260915-local-01/grid-tree-regression.json) |
| Flutter grid header/body horizontal desynchronization | One outer horizontal viewport/controller contains header and body | same regression evidence |
| React equivalent hidden risks | React loaded-page keys include generation/query/profile/offset; production browser refresh/stale-result and alignment tests added | same regression evidence |
| Option B API smoke was conflated with UI flow | Runner report now records `kind = api-workspace-smoke`; UI and smoke reports are separate files | [`option-b-windows-ui-integration.json`](../evidence/IE-VEV-TECH-Q15-002/20260915-local-01/option-b-windows-ui-integration.json), [`option-b-api-workspace-smoke.json`](../evidence/IE-VEV-TECH-Q15-002/20260915-local-01/option-b-api-workspace-smoke.json) |

## 3. Executed result summary

The complete machine ledger and raw links are in [`execution-results.json`](../evidence/IE-VEV-TECH-Q15-002/20260915-local-01/execution-results.json).

| Evidence group | Actual result | Scope and limitation |
|---|---|---|
| Shared Workspace protocol | `PASS`, 18/18 | Existing framed/HMAC/version/session/replay/correlation/path-boundary suite; multi-user/elevation remains blocked |
| Shared API harness | `PASS`, 10/10 | Qualification test double only; not Java/Spring/PostgreSQL evidence |
| Option A bridge | `PASS`, 8/8 plus retained runtime smoke | Typed WebView2 origin/schema/version/allowlist checks; predecessor runtime smoke remains separate from the installed full flow |
| Option A installed full UI flow | `PASS`, 1/1 | Login → search 100k×20 → detail → checkout → open Workspace → check-in; report asserts UI/bridge/IPC boundary |
| Option A production Web | `PASS`, 6/6 | Edge direct URL, keyboard critical flow, locale/failure states, alignment/refresh and resource-transfer attachment |
| Option B Flutter Windows UI | `PASS`, 1/1 | Critical widget flow reaches authoritative check-in; test runner output retained |
| Option B direct Dart FFI | `PASS`, 32/32 | Repeated OpenDocument round trips through the narrow shim-backed overlapped path |
| Option B FFI fault injection | `PASS`, 10/10 | Actual controlled pipe disappearance, partial/truncated/malformed/oversized/MAC/correlation/timeout cases; classifications retained |
| Option B API/Workspace smoke | `PASS` | Separate direct smoke; not counted as UI integration |
| Option B Flutter Web JS / Wasm | `PASS`, 3/3 each | Browser subset and actual resource timing attachments; full frozen browser matrix remains incomplete |
| Grid/tree regression | `PASS` | React production browser suite 6/6; Flutter widget suite 4/4 |
| Common Q15_UI_READY | `PASS` | 20 retained warm/restart samples for each candidate; thresholds are not approved |

## 4. FFI lane and native shim decision

Fresh Microsoft documentation records that an overlapped ReadFile/WriteFile call may complete
immediately (`TRUE`), return pending (`FALSE` plus `ERROR_IO_PENDING`) or fail immediately with a
different error. Completion is obtained through GetOverlappedResult, and CancelIoEx is asynchronous.
The separate Dart FFI `GetLastError` call did not have an established atomicity guarantee across
the native call boundary; the research note also records the relevant Dart issue evidence.

Phase 2 therefore uses a deliberately narrow C++ shim in the Flutter Windows runner. It captures
the native return value and error code in one function call for start, and completion/error in one
function call for finish. Dart still owns framing, protocol validation, timeout policy and resource
lifecycle; the shim has no business logic, path ownership, generic proxy behavior or Workspace
authority. The new maintenance/toolchain cost is explicit in
[`maintenance-inventory.json`](../evidence/IE-VEV-TECH-Q15-002/20260915-local-01/maintenance-inventory.json).

This changes the Phase 1 “no custom shim/plugin” observation for the current source. It does not
make the native shim a product-wide platform decision or a recommendation to change the Server.

## 5. Performance and transfer evidence

Both candidates implement the same external milestone: process launch until rendered login is
visible and enabled, with bridge availability reported separately. One untimed warm-up and 20
retained samples were executed per candidate.

| Candidate | n | min / mean / max (ms) |
|---|---:|---:|
| Option A React/WebView2/WPF | 20 | `874.3971 / 897.9328 / 952.5237` |
| Option B Flutter Windows | 20 | `1128.9303 / 1274.2134 / 1358.4657` |

These are readiness observations, not approved performance thresholds or a winner. Every sample is
retained under `performance/option-*-samples/` and summarized in the two `ui-ready-*.json` files.

Production Web transfer metrics use actual Edge `PerformanceResourceTiming` entries. Option A
records the Vite production JS/CSS transfer; Flutter JS records `main.dart.js`, and Wasm records
`main.dart.wasm` plus `main.dart.mjs`. The raw Playwright reports retain request names, durations,
transfer size and encoded/decoded body sizes. Cache-state, cold/subsequent comparative runs,
active/peak memory, CPU interval, frame timing and p50/p95/p99 interaction latency are not yet a
decision-grade common measure.

## 6. Remaining blockers and conclusion

Real Java/Spring/PostgreSQL, different-user/elevation security, corporate image/DPI/multi-monitor,
real VI/JA IME composition/reconversion, screen readers/high contrast/scaling, signed install/update/
rollback, IRONCAD/Office/artifact custody, full browser navigation parity, cold/active/peak metrics,
independent review and Product Decision Authority disposition remain `BLOCKED` or `NOT-RUN` as
listed in the package ledger. Repository verifier scripts remain `NOT-RUN` under the explicit user
instruction; no CI/status-check PASS is claimed.

Final disposition:

```text
Q-15 STATUS:           PARTIAL
CURRENT WINNER:        NO WINNER — MORE QUALIFICATION REQUIRED
RECOMMENDATION CHANGED: NO
PRODUCT SCOPE CHANGED:  NO
PRODUCT / PG DECISION:  NOT-RUN
```

No FTR, REQ, architecture, Spec, Tech, DDM capability semantics, Matrix/TECH-001 recommendation,
or PG3/PG4 state changed.
