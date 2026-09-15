# Q-15 Phase 3 continuation handoff

Date: `2026-09-15` (Asia/Saigon)

Work Item: user-provided **Q-15 Client/UI Architecture Vertical Slice Qualification — Phase 3**; no repository Work Item identifier was supplied.

Checkpoint branch before direct integration: `codex/q15-client-qualification`

Baseline: `8bc0f955247a5c635498dbd76dce9527a2070b13` (`origin/main` when Phase 3 work began)

Receiving target: a fresh company checkout of `origin/main`

This is an implementation checkpoint, not the completed Phase 3 verification/evidence package and
not a Product technology decision. It changes no Product Scope, FTR, REQ, architecture, Spec,
Tech, DDM capability semantics, PG3 or PG4 state.

## Start here on the company machine

1. Read repository `AGENTS.md`, `docs/agents/collaboration.md`,
   `docs/agents/product-document-authoring-standard.md`, the IDEA instance catalogue, and the
   product-knowledge index before editing.
2. Fetch and fast-forward from `origin/main`; confirm the checked-out commit contains this file.
3. Read, in order:
   - `docs/superpowers/specs/2026-09-15-q15-phase3-design.md`
   - `docs/superpowers/plans/2026-09-15-q15-phase3.md`
   - `docs/research/2026-09-15-q15-phase3-win32-and-flutter-offline-runtime-evidence.md`
   - this handoff
4. Continue the unchecked plan items. Do not rewrite the immutable Phase 1/2 evidence. Use
   successor ID `IE-VEV-TECH-Q15-003` for Phase 3.

## Changed seams in this checkpoint

- Option B native I/O: a typed, named-pipe-only ABI now owns the duplicated pipe handle, event,
  `OVERLAPPED` object and backing buffer until terminal completion. It distinguishes immediate
  success, pending and immediate failure; cancellation is only a request; a still-pending operation
  can transfer to a native cleanup thread.
- Option B Dart FFI: direct `kernel32` calls, caller-owned `OVERLAPPED` storage and separated
  `GetLastError` reads were removed. Dart now consumes the typed ABI and exposes qualification-only
  native diagnostics.
- Native regression executable: covers immediate read/write, pending read/write, peer-close
  failures, cancel race, aborted completion and detached cleanup.
- Flutter grid: owns a vertical scroll controller and tests observable Home/End/PageUp/PageDown,
  Space, Enter, Shift+F10, selected row, requested page, viewport and focus restoration.
- React grid: PageUp/PageDown and Space were added; index-based viewport movement now works for
  virtual rows that are not yet in the DOM; context-menu close restores grid focus. A Playwright
  test exercises the observable behavior.
- Research/design/plan: fresh first-party Win32 and Flutter Web runtime evidence plus the approved
  Phase 3 design and execution plan were added.

## Verification actually executed at the checkpoint

Repository documentation/diagram verifier scripts: `NOT-RUN` by explicit user instruction.

| Focused command / observation | Result |
|---|---|
| Initial Flutter Windows Release build with the new native test but old ABI | `FAIL` as expected (TDD RED: typed ABI symbols/types absent) |
| Flutter Windows Release build after ABI implementation | `PASS` |
| `q15_io_shim_tests.exe` | `PASS`; immediate read `1`, immediate write `1`, pending read `3`, pending write `1`, aborted `4`, detached cleanup `1`, final active operation count `0` |
| `Invoke-Q15WindowsIntegration.ps1` | `PASS`; 32 direct-FFI Workspace round trips and Windows critical surface; repository verifiers remained `NOT-RUN` |
| `flutter analyze` | `PASS`, no issues |
| `flutter test test --reporter expanded` | `PASS`, `5/5` |
| React `npm test -- --reporter=verbose` | `PASS`, `4/4` |
| React `npm run build` | `PASS` |
| `npx playwright test tests-e2e/phase3-keyboard.spec.ts --reporter=list` | `PASS`, `1/1` after the test first exposed PageDown and End viewport defects |

The commands above are development checks. Their console output was not yet copied into immutable
`IE-VEV-TECH-Q15-003` evidence, so the final evidence status is still pending.

## Unresolved risks and remaining work

1. Review the opaque-operation ABI and run the complete ten-case FFI fault suite plus the planned
   100+ timeout/cancel/reconnect cycles with raw resource snapshots. In particular, deliberately
   exercise a cancellation/completion race during detached read cleanup and decide whether a
   successful detached read should be counted as discarded-success instead of
   `ERROR_INSUFFICIENT_BUFFER`; do not hide the observed branch.
2. Run the full React E2E suite and repeat all affected Release builds at the exact implementation
   SHA used for evidence. The focused tests passing here do not qualify the whole candidate.
3. Complete Plan Task 3: Flutter JS and Wasm controlled-origin renderer resources, legal bundled
   EN/VI/JA fonts, public-origin blocklist, actual runtime-mode/network capture and payload ledger.
   Do not claim full offline/PWA behavior from a public-origin blocklist test.
4. Complete Plan Task 4: actual Option A/Option B Release installed flows, common
   `LOGIN_UI_READY`/`Q15_ENGINEERING_READY` definitions and counterbalanced AB/BA process-tree
   measurements. Do not compare Debug against Release.
5. Complete Plan Task 5: refresh/back/forward/clipboard/cold-deep-link/outage/multiple-tab browser
   parity. Preserve real IME, Narrator/high contrast and different-user/elevation tests as
   `BLOCKED` or `NOT-RUN` wherever the company environment cannot execute them.
6. Complete Plan Task 6: create immutable `IE-VEV-TECH-Q15-003`, retain raw output and a SHA-256
   manifest, record Phase 2 errata without changing predecessor evidence, and issue an evidence-only
   `OPTION A`, `OPTION B` or `NO WINNER` result. Product Decision Authority review remains separate.

## Exact next action

After confirming the fresh company checkout and reading the four files above, review
`q15_io_shim.{h,cpp}` against the cited Microsoft contracts, add a deterministic repeated-fault
runner that records terminal outcome and native diagnostic/resource deltas for every cycle, then
run the ten existing fault modes plus at least 100 cancellation/reconnect cycles. Preserve raw
outputs under a new `IE-VEV-TECH-Q15-003/<run-id>/raw/` only after the exact source commit is fixed.

Do not run repository documentation/diagram verifier scripts unless the user explicitly changes
that instruction. Focused Q-15 builds, unit, integration and browser tests are expected.
