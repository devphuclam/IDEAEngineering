# Phase 2 interpretation errata carried by Q15-003

This successor note does not edit or invalidate the retained `IE-VEV-TECH-Q15-002` package. It
narrows statements that could otherwise be read more strongly than their raw evidence.

| Topic | Controlled Phase 3 interpretation |
|---|---|
| Home / End | Phase 2 did not retain an executed assertion that the selected first/last row became visible. Corrected source and focused checkpoint tests exist at `0d8d0f7`; a new immutable execution is `BLOCKED` in this environment. |
| IME | Injecting or rendering Vietnamese/Japanese Unicode text is not real VI/JA IME composition or reconversion evidence. Real IME remains `BLOCKED`. |
| Accessibility | React ARIA and Flutter Semantics are implementation evidence only. Narrator, high contrast and an overall accessibility result remain `BLOCKED`. |
| Full flow | The Option A installed full UI flow and the Option B Windows UI flow remain distinct from the direct API/Workspace smoke. The latter is not UI evidence. |
| Direct FFI | In current Option B, “direct Dart FFI” means Dart FFI into the narrow C++ transport shim. It no longer means separate Dart calls directly to error-sensitive Win32 APIs. |
| Native shim | The current shim owns the Win32 operation object through terminal completion and contains typed connection/I/O/error capture only. Its existence and maintenance cost must remain explicit. |
| Release | Phase 2 Option A and Option B Windows observations were not a comparable Release-to-Release performance run. Phase 3 retains that comparison as `BLOCKED`. |
| Browser parity | Phase 2 Flutter JS/Wasm executed a three-case subset and exposed public renderer/font origins. It is not full browser parity or controlled-origin/offline qualification. |
| Readiness | The Phase 2 `Q15_UI_READY` marker means the login UI was rendered, visible and enabled. This successor calls that concept `LOGIN_UI_READY`; `Q15_ENGINEERING_READY` was not measured. |

