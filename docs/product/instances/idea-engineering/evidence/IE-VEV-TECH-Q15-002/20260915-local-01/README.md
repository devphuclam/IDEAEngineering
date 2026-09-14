# IE-VEV-TECH-Q15-002 — local Phase 2 evidence package 20260915-local-01

This immutable successor package traces `IE-VEV-TECH-Q15-001` and records the Phase 2 Q-15
Client/UI vertical-slice qualification run against source commit
`3ae5f22fe1dc6d81175142fabb5619e1d831fae0`, starting from baseline
`9629455b6dff6fbc4cb75a115bc1a4c93fcff3be`.

It is `INTERNAL`, `INFORMATIVE` evidence for **`Q-15 PARTIAL`**. It does not establish a product
requirement, approve a technology, select a winner, change Product Scope, or change any PG state.
The predecessor package remains historical and is not overwritten.

## Package contents

| File | Provenance |
|---|---|
| [`environment.json`](environment.json) | Exact local machine, toolchain, fixture and fairness snapshot. |
| [`execution-results.json`](execution-results.json) | Normalized command/test ledger with raw-result links and explicit blocked/not-run outcomes. |
| [`option-a-installed-ui-integration.json`](option-a-installed-ui-integration.json) | Machine-generated Option A React → WebView2 → WPF → Workspace installed-flow report. |
| [`option-a-bridge-smoke.json`](option-a-bridge-smoke.json) | Retained predecessor WPF/WebView2 runtime bridge smoke; kept distinct from the installed full UI flow. |
| [`option-b-windows-ui-integration.json`](option-b-windows-ui-integration.json) | Machine-generated Option B Windows UI/direct-FFI runner summary; UI and direct FFI lanes remain separate entries. |
| [`option-b-api-workspace-smoke.json`](option-b-api-workspace-smoke.json) | Machine-generated direct API/Workspace smoke; `kind` explicitly identifies it as non-UI evidence. |
| [`ffi-fault-summary.json`](ffi-fault-summary.json) | Machine-generated ten-case controlled FFI failure classification summary. |
| [`grid-tree-regression.json`](grid-tree-regression.json) | Cross-candidate paging-generation and header/body-alignment result projection. |
| [`browser-parity.json`](browser-parity.json) | Explicit PASS/NOT-RUN/NOT-APPLICABLE classification for the executed browser subset and remaining frozen matrix. |
| [`performance/ui-ready-option-a.json`](performance/ui-ready-option-a.json) | All 20 Option A `Q15_UI_READY` samples plus summary. |
| [`performance/ui-ready-option-b.json`](performance/ui-ready-option-b.json) | All 20 Option B `Q15_UI_READY` samples plus summary. |
| [`browser/option-a-react-production.json`](browser/option-a-react-production.json) | Raw Playwright JSON for six Option A production-Web tests. |
| [`browser/option-b-flutter-web-js.json`](browser/option-b-flutter-web-js.json) | Raw Playwright JSON for three Flutter Web JS tests. |
| [`browser/option-b-flutter-web-wasm.json`](browser/option-b-flutter-web-wasm.json) | Raw Playwright JSON for three Flutter Web Wasm tests. |
| `browser/*-transfer-metrics.json` | Decoded machine-generated PerformanceResourceTiming attachments; actual transfer/encoded/decoded sizes, request names and durations. |
| [`maintenance-inventory.json`](maintenance-inventory.json) | Phase 2 maintenance delta, including the two-file native shim and C++/CMake cost. |
| `raw/` | Retained TRX, Playwright JSON/log, runner logs, fault-server logs, API/Workspace logs and every UI-ready sample. |
| [`manifest.sha256`](manifest.sha256) | SHA-256 values for every committed JSON/Markdown evidence file in the package, generated after authoring. |

The raw fault runner filenames retain the runner's historical `.machine.jsonl` suffix, but the
captured content is the actual `flutter test --reporter expanded` output used by the run. No raw
output is converted into a PASS claim without the corresponding runner result.

## Phase 2 result

Option A now has an installed full UI flow and a production Web browser run. Option B now has a
separate Windows UI lane, separate direct API/Workspace smoke, direct FFI fault-injection coverage,
and a narrow native shim for atomic Win32 overlapped-I/O error capture. Both candidates use the same
fixture, API harness, Workspace, protocol and core operation intent. The common readiness signal has
20 warm/restart samples per candidate.

The executable evidence is stronger and more symmetric, but mandatory corporate/human/deployment
gates remain incomplete. The resulting disposition is therefore:

```text
Q-15 STATUS:           PARTIAL
CURRENT WINNER:        NO WINNER — MORE QUALIFICATION REQUIRED
RECOMMENDATION CHANGED: NO
```

Repository documentation/diagram verifiers and CI/status checks are `NOT-RUN` under the explicit
user instruction. This package makes no verifier or CI PASS claim.
