# IE-VEV-TECH-Q15-001 — local evidence package 20260914-local-01

This package retains the bounded Q-15 results executed against qualification source commit
`5556f60fc79b539556e492c05e25e9c21c11e8e1`, starting from repository baseline
`c97ead832e026972a95f75a6c1933579fd49ac13`.

It is `INTERNAL`, `INFORMATIVE` evidence for `Q-15 PARTIAL`. It does not contain production data,
establish a Product requirement, select a winner, approve a technology, change Product Scope or
change any PG state.

## Package contents

| File | Provenance |
|---|---|
| [`environment.json`](environment.json) | Exact local tool/machine snapshot used to contextualize the run. |
| [`execution-results.json`](execution-results.json) | Normalized command/test ledger, including blocked and failed-attempt provenance. |
| [`option-b-full-flow.json`](option-b-full-flow.json) | Machine-generated Flutter Windows critical-flow report. |
| [`performance/option-a-startup.json`](performance/option-a-startup.json) | Machine-generated Option A startup summary with all ten retained samples. |
| [`performance/option-b-startup.json`](performance/option-b-startup.json) | Machine-generated Option B startup summary with all ten retained samples. |
| [`performance/resource-and-size.json`](performance/resource-and-size.json) | One-snapshot resource observations and Release output sizes. |
| [`maintenance-inventory.json`](maintenance-inventory.json) | Consistent source/dependency inventory; staffing and effort are not inferred. |
| [`browser/option-a-edge.json`](browser/option-a-edge.json) | Lossless test-result projection of the Playwright JSON report for Option A. |
| [`browser/option-b-edge-js.json`](browser/option-b-edge-js.json) | Lossless test-result projection of the Playwright JSON report for Flutter Web JS. |
| [`browser/option-b-edge-wasm.json`](browser/option-b-edge-wasm.json) | Lossless test-result projection of the Playwright JSON report for Flutter Web Wasm. |
| [`manifest.sha256`](manifest.sha256) | SHA-256 values for every retained JSON evidence file's committed LF byte stream. |

Startup and full-flow files are direct copies of the generated local reports. Browser files retain
the test names, timestamps, durations and result counts while omitting no test result. The normalized
ledger records source/build/unit/integration outcomes observed in the terminal where no separate
machine report was produced. Ignored local custody files and logs are not promoted as product
artifacts and contain synthetic fixture data only.

The user explicitly prohibited repository verifier execution. Repository documentation/diagram
verifiers and CI status checks are therefore `NOT-RUN`; this package makes no PASS claim for them.
