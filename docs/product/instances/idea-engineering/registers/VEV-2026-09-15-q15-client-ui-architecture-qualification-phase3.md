# Q-15 Client/UI Architecture Vertical Slice Qualification — Phase 3

## Control envelope

| Field | Recorded value |
|---|---|
| Stable Supporting Record ID | `IE-VEV-TECH-Q15-003` |
| Supporting class / version / status | `VEV` / `0.1` / `Draft` |
| Qualification state | **`Q-15 PARTIAL`**; `NO WINNER — MORE QUALIFICATION REQUIRED` |
| Date / operator | 2026-09-15 ICT / Principal Product Author in the local Windows workspace |
| Owner / reviewer / acceptance authority | Principal Product Author; independent Client/security/accessibility/operations review `NOT-RUN`; Product Decision Authority acceptance `NOT-RUN` |
| Product normativity | `INFORMATIVE`; no Product requirement, architecture approval, technology selection or gate result |
| Repository process authority / instruction state | `NOT-APPLICABLE` / `NOT-APPLICABLE` |
| Applicable baseline | Continuation checkpoint `0d8d0f7d918691ab13b388ad09f5a1c94e858b55`; predecessor `IE-VEV-TECH-Q15-002`; original Phase 3 start trace `8bc0f955247a5c635498dbd76dce9527a2070b13` |
| Exact implementation source | `47fa6d0a029954b9de2daf579c28335a5cf68a32` |
| Source / upstream trace | [Phase 2 record](VEV-2026-09-15-q15-client-ui-architecture-qualification-phase2.md), [Phase 3 research](../../../../research/2026-09-15-q15-phase3-win32-and-flutter-offline-runtime-evidence.md), [Phase 3 plan](../../../../../docs/superpowers/plans/2026-09-15-q15-phase3.md), [Q-15 harness](../../../../../qualification/q15/README.md) |
| Downstream trace | [Phase 3 evidence package](../evidence/IE-VEV-TECH-Q15-003/20260915-local-01/README.md), future run on a controlled Flutter/toolchain environment and Product Decision Authority disposition |
| Classification / retention | `INTERNAL`; retain with exact source, raw output, environment snapshot and manifest |
| Change record / predecessor | Successor to `IE-VEV-TECH-Q15-002`; hardens Win32 I/O and narrows evidence claims without overwriting Phase 1/2 records |
| Supersedes / Superseded by | Supersedes `IE-VEV-TECH-Q15-002` only for the current Phase 3 qualification view / `NOT-APPLICABLE` |
| Review trigger | Flutter/toolchain prerequisites become available, either topology changes, or Product Decision Authority reviews residual risk |
| Evidence status | Native hardening evidence `PASS`; mandatory Flutter Web/Windows and Release comparison evidence `BLOCKED`; overall `PARTIAL` |

This record follows `IE-STD-AUTH-001@0.2`. `PASS`, `BLOCKED` and `NOT-RUN` apply only to the
explicit evidence scope below. They do not create a conformity claim or select a Product technology.

## 1. Question and result

Phase 3 asked whether hardening and decision-grade evidence were sufficient to select between:

```text
Option A: React → WebView2 → WPF → .NET Workspace
Option B: Flutter Web / Flutter Windows → Dart FFI → narrow C++ shim → .NET Workspace
```

The answer remains **no**. A real defect in Option B's detached-read cleanup was reproduced and
fixed, and the native layer now completes 100 timeout/cancel/reconnect cycles without an outstanding
operation. However, this machine cannot run Flutter, produce controlled-origin Web builds or build
a comparable Option B Release executable. Phase 3 is therefore `PARTIAL`; the technical result is
`NO WINNER`, with `MEDIUM` confidence in that disposition.

## 2. Win32 and Flutter IPC

| Concern | Result | Evidence boundary |
|---|---|---|
| Immediate successful read/write | `PASS` | Native regression distinguishes immediate success from pending; exact-source raw output is retained. |
| Pending successful read/write | `PASS` | Only `FALSE + ERROR_IO_PENDING` enters completion observation. |
| Immediate read/write failure | `PASS` | Peer-close cases remain terminal failures without entering a false pending path. |
| Cancellation lifetime | `PASS` | Timeout returned to the caller is separate from native terminal cleanup; operation/buffer/event ownership is retained. |
| Detached successful read | `PASS` | A late successful read is no longer misclassified as `ERROR_INSUFFICIENT_BUFFER`; discarded delivery is counted explicitly. |
| Same-call `GetLastError` capture | `PASS` | Error-sensitive transport calls and conditional capture remain in the narrow native ABI. |
| 100 timeout/cancel/reconnect cycles | `PASS` | 100/100 timeout observations and reconnects; zero `QUALIFICATION-UNKNOWN`; final active operations = 0. |
| Flutter/Dart FFI destructive suite | `BLOCKED` | Flutter executable and local package configuration are unavailable. Native PASS is not promoted to Flutter IPC PASS. |

The shim is limited to typed named-pipe connection, overlapped start/wait/completion, cancellation,
terminal cleanup, native error capture and diagnostics. It contains 495 physical lines across its
`.cpp` and public header at this source. It does not contain business rules, document behavior,
Workspace policy, arbitrary paths, process execution or a generic Win32 proxy.

The bounded resource observation retained 100 before/after snapshots. Handle and thread deltas were
zero in every cycle; private-byte delta was zero and the largest observed per-cycle working-set
delta was 20,480 bytes. This found no obvious monotonic/unbounded growth in the run. It is not proof
that no leak exists.

## 3. Keyboard and visibility

The continuation checkpoint contains corrected React and Flutter source/tests for Home, End,
PageUp, PageDown, arrows, Enter, Space, F2 and Shift+F10 without eagerly rendering 100,000 rows.
The checkpoint handoff reports focused green runs, but this successor does not possess immutable raw
output for a new execution. Flutter is missing and the React/Playwright dependency directories are
absent, so the new Phase 3 execution is `BLOCKED`. The narrower interpretation is recorded in
[`phase2-errata.md`](../evidence/IE-VEV-TECH-Q15-003/20260915-local-01/phase2-errata.md).

## 4. Flutter Web and fonts

Current first-party research identifies a supported controlled-origin path for CanvasKit/Skwasm and
font fallback, but no executable result was possible here.

| Item | Phase 3 result |
|---|---|
| CanvasKit/Skwasm self-hosted | `NO` / `BLOCKED` |
| EN/VI/JA application fonts bundled with redistribution record | `NO` / `BLOCKED` |
| JS and Wasm Release output | `BLOCKED` |
| `gstatic.com` and `fonts.gstatic.com` blocklist run | `BLOCKED` |
| Zero required public runtime requests | `NOT-RUN` |

The latest executed evidence is still Phase 2, where Flutter Web requested public renderer/font
origins. No font was copied from the workstation and no unlicensed binary was committed.

## 5. Release, browser and environment-bound checks

| Item | Result | Reason |
|---|---|---|
| Option A installed Release flow | Retained Phase 2 `PASS` | Historical control evidence; not a new counterbalanced run. |
| Option B installed Release flow | `BLOCKED` | Flutter Release artifact unavailable. |
| A/B Release counterbalancing and resource metrics | `BLOCKED` | A Release versus B Debug is not accepted as competitive evidence. |
| `LOGIN_UI_READY` | Retained Phase 2 observation | This is the narrowed name for visible/enabled login, not engineering readiness. |
| `Q15_ENGINEERING_READY` | `NOT-RUN` | No common Release pair. |
| Full browser parity | `NOT-RUN` | Current production outputs and local Playwright dependencies unavailable. |
| Real VI/JA IME | `BLOCKED` | Unicode injection is not IME composition evidence. |
| Narrator/high contrast | `BLOCKED` | ARIA/Semantics presence is not an assistive-technology result. |
| Different Windows user/elevation | `BLOCKED` | No authorized controlled environment. |
| Corporate deployment and application integrations | `BLOCKED` | No signing/MSI/update/rollback/corporate image/IRONCAD/Office environment. |

## 6. Comparative engineering assessment

| Factor | Current advantage | Reason |
|---|---|---|
| Web | Option A | Broader retained production browser evidence and no observed required public UI-runtime origin; Flutter controlled-origin result is blocked. |
| Windows-native | Option A | Retained installed full flow; Option B's corrected native layer lacks a current hardened Flutter/Release execution. |
| Cross-platform reuse | Option B | One Dart/Flutter UI source targets Web and Windows, excluding the C++ shim and self-hosted runtime assets. |
| Maintenance | `INCONCLUSIVE` | Both options have multiple seams; comparable staffing and patch evidence are absent. |
| Correctness/security | `INCONCLUSIVE` | Native Option B correctness improved, while multi-user/elevation and full hardened end-to-end evidence remain unresolved. |

These factor-level observations do not add up to an approved winner. Mandatory evidence is missing
for Option B precisely where Phase 3 intended to compare it. Choosing A solely because the Flutter
tool is absent would confuse an environment blocker with an architecture result.

## 7. Disposition

```text
Q-15 PHASE 3:           PARTIAL
TECHNICAL WINNER:       NO WINNER
CONFIDENCE:             MEDIUM
RECOMMENDATION CHANGED: NO
PRODUCT DECISION:       NOT-RUN
MATRIX / TECH-001:      UNCHANGED
PRODUCT SCOPE:          UNCHANGED
PG3 / PG4:              UNCHANGED
```

The next meaningful execution requires an approved local Flutter SDK/cache, license-compatible
EN/VI/JA font assets, both Release candidates, and current browser-test dependencies. Repeating
native tests or producing more source-only scaffolding would not resolve the remaining decision gap.

