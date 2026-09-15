# IE-VEV-TECH-Q15-003 — Phase 3 evidence package `20260915-local-01`

This is the immutable Phase 3 successor to `IE-VEV-TECH-Q15-002`. It records the work performed
against implementation commit `47fa6d0a029954b9de2daf579c28335a5cf68a32`, continuing from
checkpoint `0d8d0f7d918691ab13b388ad09f5a1c94e858b55`.

The package is `INTERNAL` and `INFORMATIVE`. It records **Q-15 `PARTIAL` / `NO WINNER`**. It does
not approve either client technology, change Product Scope, modify Matrix/TECH-001, or change PG3
or PG4. Product Decision Authority review remains `NOT-RUN`.

## Contents

| File | Purpose |
|---|---|
| [`environment.json`](environment.json) | Exact machine, source and available/missing tool snapshot. |
| [`execution-results.json`](execution-results.json) | Normalized PASS/BLOCKED/NOT-RUN ledger for the Phase 3 scope. |
| [`native-results.json`](native-results.json) | Machine-derived native semantics, 100-cycle and diagnostic resource summary. |
| [`comparative-assessment.json`](comparative-assessment.json) | Evidence-bounded A/B comparison without numeric scoring. |
| [`phase2-errata.md`](phase2-errata.md) | Successor interpretation for claims that must not be read more strongly than Phase 2 raw evidence. |
| `raw/native/` | CMake/build output and three retained native executions, including the exact-source run. |
| `raw/flutter-preflight/` | Actual runner output, exit code and eleven-case `BLOCKED` summary from the missing-Flutter preflight. |
| `raw/environment/` | Raw local toolchain output. |
| [`manifest.sha256`](manifest.sha256) | SHA-256 for every other retained package file. |

## Result boundary

The standalone Win32 shim exercises immediate and pending I/O, peer-close failures, cancellation,
detached cleanup and 100 timeout/cancel/reconnect cycles. The exact-source run ended with zero
active operations; every cycle retained a resource snapshot, and no cycle changed handle or thread
count. This is a bounded diagnostic observation, not proof that no leak exists.

The real Flutter/Dart FFI suite, Flutter Web self-hosting, EN/VI/JA controlled-origin run and
Option B Release artifact are `BLOCKED` because Flutter and its local package configuration are not
available. No SDK, package, font or tool was installed. Consequently the Release-to-Release A/B
comparison and a technical winner remain unavailable.

Repository documentation/diagram verifiers and CI/status checks are `NOT-RUN`; this package makes
no PASS claim for them.

