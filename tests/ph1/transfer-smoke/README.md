# T033/T034 actual client qualification

This first-party Node harness uses the project-admitted Node24.19.0 Windows x64
binary only (SHA-2563602f2bb1a10f2cbab4c36886218a33c1ab3db87290e73b033c46c77147d0237).
No npm package, installation, network resolution, listener or trust-store change.

## First vertical slice — source publication before execution

Approved seam: client file-to-range preparation for the frozen 1MiB range profile.
Input: a fresh OS-temp `idea-f05-client-*` directory containing synthetic bytes.
Command, from repository root:

```powershell
& 'C:/Users/TD-999/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe' --test tests/ph1/transfer-smoke/client-transfer.test.mjs
```

Before execution commit/push source, record Git SHA and SHA-256 of both `.mjs`
inputs, and verify the admitted binary hash/version. Rehash inputs/tool afterwards.
RED oracle: named CLIENT_RANGE_READER_NOT_IMPLEMENTED failure, not a missing tool.
GREEN oracle: exact half-open range, original bytes and known literal chunk digest.
Successor qualification also reads a sparse 64MiB synthetic zero file, requiring
64 contiguous ranges of exactly1MiB with known literal SHA-256 per range. This
qualifies the existing bounded reader, not network transfer or throughput.
Next tracer tests the frozen Gateway response interface: i64 verified bytes,
u32 Receipt length, exact opaque Receipt bytes. Zero Receipt is progress only;
truncated/trailing/oversized response or impossible progress must refuse. Named
CLIENT_PROGRESS_NOT_IMPLEMENTED is the RED witness. This parser does not verify
Receipt authority; that remains the independent Server acceptance boundary.
Cleanup removes only the exact fresh synthetic fixture in the test's `finally`.
Hash/version drift STOP; no silent download/replacement. Retain safe test output,
source identities and counts. No password, Grant, Receipt, cookie or CSRF capture.

This test is client preparation only, **not** actual HTTPS/Server/PostgreSQL/Gateway
qualification. T033/T034 remain unchecked until real-transfer and refusal matrices
execute. Actual transfer must use ordinary Server session/CSRF, direct Gateway
bytes, normal TLS verification and independent Server custody acceptance.
Private storage paths are never client-selected; no permission-free product route
or manufactured Receipt is introduced by this local slice. PR38 Draft/Open;
verifier NOT-RUN; no merge or timer action.
