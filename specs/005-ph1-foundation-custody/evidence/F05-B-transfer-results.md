# F05-B actual client/transfer qualification

| Control | Value |
|---|---|
| Stable ID / class / version | IE-RES-PH1-F05B-TRANSFER-RESULTS / verification record /0.1 |
| Status / disposition | In progress; client preparation partial PASS, actual end-to-end NOT-RUN |
| Owner / author / authority | Project Reviewer Nguyễn Huỳnh Phúc Lâm /Codex CODEX_ONLY /continuous T028–T034 sprint authorization |
| Baseline / date | Issue37/PR38, frozen T027 v1 envelope/profile;2026-10-05 Asia/Ho_Chi_Minh |
| Normativity / retention | INFORMATIVE, no new product obligation; INTERNAL, preserve execution lineage |
| Upstream | [Sprint](../../../docs/research/2026-10-05-f05-execution-sprint.md), [Node admission](../../../docs/research/2026-10-05-node24190-project-admission.md), T033/T034 |
| Review / limitation | External review pending; local preparation tests are not network transfer, Server or custody acceptance |

## 1. Client preparation — executed RED/GREEN

Published commands/oracles: `tests/ph1/transfer-smoke/README.md`.
Windows x64 admitted Node24.19.0, binary SHA-256
3602f2bb1a10f2cbab4c36886218a33c1ab3db87290e73b033c46c77147d0237.
No npm/dependency/download/install, listener, system trust, database or preview change.
Tests create fresh OS-temp synthetic fixture directories and remove only those exact
fixtures in `finally`. Source is committed/pushed before every execution.

| Exact executed source | Actual result |
|---|---|
| 261ef9f68f0bed3ac0cb77707b82308860b90bc8 | RED1/1: CLIENT_RANGE_READER_NOT_IMPLEMENTED; tool available |
| 0e68ae98fb87a41be5d4e9e65d0862cbca7eedb6 | GREEN1/1: one1KiB half-open range, byte equality and known SHA-256 |
| f6d05b046be6b51a6d91bc1169f06ee43df857ee | PASS2/2: existing reader qualified additionally on64MiB,64 contiguous1MiB ranges |
| 6df8ffbd1d92b03723a63a6efbabf83b0fa86269 | RED:2 PASS/1 FAIL, CLIENT_PROGRESS_NOT_IMPLEMENTED |
| 044f896109ac464cb6c86711af899e2c85f35132 | GREEN3/3,0 failures/skips: zero Receipt remains progress; malformed/trailing/oversized/impossible progress refuses |

Final executed raw source hashes, unchanged before/after run:

- client-transfer.mjs: e939a26b02ad5913601c0d6e31dc19f6c1bf9cb0a4e0f20723807adbac299460
- client-transfer.test.mjs:919f259067cac30ffb6562c1081c40fa1452dc1fb90de8df175718e1cbb610fc
- admitted executable unchanged before/after; version v24.19.0.

First reader RED source hashd8098ccb1df0a653841d64e44fe17671901c4418d9fa1aec357970718d5c81b5;
initial test hash9b4ecd112cc2eb515b27849292d9d3518afe8d4162439b6fbd18fbf70a1d5244.
Reader GREEN source hashdf78d692c89eb76375f45a7f093747d4e3c3ac1da53da2665e0348e1ca873502.
Response RED source hashab6111c0eafadf40623b2a134ac00e2f823ca47068a23aa13694bfd9da792b4e.
Safe test output retained in this task's command outputs; no independent raw-file
log hash is invented. No credential, cookie, CSRF, Grant or Receipt was captured.

The64MiB test uses synthetic zero bytes solely for range preparation; it does not
replace the governing actual transfer fixture/manifest or establish throughput.
Opaque Receipt handling is not signature acceptance; Server remains authoritative.

## 2. Remaining actual qualification

T033/T034 remain unchecked: ordinary Server HTTP session/CSRF control, direct
actual HTTPS Gateway bytes, actual FilesystemVaultAdapter, signed Gateway Receipt,
Server current IAM/controlled-allocation acceptance and committed metadata,
1KiB/64MiB manifest comparisons and affected refusal/retry/renewal/interruption
matrix. Real transfer remains NOT-RUN in this record, not inferred from local3/3.

SSH read-only preflight succeeded; retained qualified Gateway package is present.
Node is not a blocker. No new rights exception is required for unchanged admitted
Node use. PR38 stays Draft/Open; no merge/verifier/timer/Tracker action.
