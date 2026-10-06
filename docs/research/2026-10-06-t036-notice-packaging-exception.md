# T036 bounded runtime-notice packaging repair

| Control | Value |
|---|---|
| Stable ID / class / version / status | IE-RES-T036-NOTICE-PACKAGING-20261006 / process exception and execution receipt / 0.2 / Approved for bounded scope; focused packaging qualification PASS |
| Owner / author / reviewer | Engineering / Codex CODEX_ONLY / Project Reviewer Nguyễn Huỳnh Phúc Lâm, explicit conversation approval “Được” after the narrow proposal |
| Applicability / date | Issue37 / PR38, R36-04 Web runtime notices only / 2026-10-06 Asia/Ho_Chi_Minh |
| Normativity / authority | INFORMATIVE product; prospective internal/offline build/test process exception only; no legal/company/commercial clearance or new rights |
| Upstream / downstream | [Review v0.3](../../specs/005-ph1-foundation-custody/evidence/PH1-license-review.md#8-authenticated-retained-package-inspection--v03-successor), [external intake](../agents/external-source-intake.md), [Node admission](2026-10-05-node24190-project-admission.md) / build-web-static.mjs and notice packaging regression |
| Retention / supersession / trigger | INTERNAL; historical exceptions and RED retained unchanged; supersedes no historical grant; drift of tool/artifact/graph/version/hash/intended use reopens gate |
| Tailoring | STANDARD-GUIDED IE-STD-AUTH-001; bounded process/verification packet, not conformity or independent legal advice |

## Approved scope and deliberately narrow execution path

The human approved retaining admitted React/ReactDOM/scheduler notices with the real Web/Server
output and checking packaging using already inspected tooling/cache, offline, without dependency
change or preview deployment. Approval is T036-only and expires at this repair qualification,
abandonment or scope drift. It does not waive missing grants or settle other R36 findings.

Actual selected path avoids Maven/plugin execution entirely: approved Windows Node24.19.0 builds
the real locked Web; installed JDK jar updates a **fresh copy** of the retained qualified Server
JAR with the newly generated static resources. This is a packaging projection test, not a fresh
full-F05 Server build or new accepted application artifact. No dependency graph, Boot loader,
compiled Server class, migration or nested runtime JAR is rebuilt/replaced. Verify those bytes
remain identical in the copied JAR, and run the notice test against the actual ZIP entries.
The normal Maven resources configuration already copies this generated directory into static/;
this repair adds no plugin/POM change. Maven/full lifecycle, application tests and HTTP/browser
qualification remain NOT-RUN unless separately executed under an exact admitted path.

## Exact inputs, intended use and obligations

- Windows Node executable: existing project-admitted24.19.0, SHA-256
  3602f2bb1a10f2cbab4c36886218a33c1ab3db87290e73b033c46c77147d0237.
- JDK jar: existing `/opt/idea/tools/jdk-25.0.4.1+1/bin/jar`, SHA-256
  033a730b1e74f26f7345ec4754bd6fa8a0d075973475d18695b386da516738b2.
- Existing Server input copy: `/home/phuclam/.local/share/idea/dev-preview-26/server.jar`,
  SHA-256 7f0a628d2efd94405ba5f083295c23e6faf0246da86c8dd019f669f69482d53c.
- Web lock: SHA-256 350e5d24057c55d6acef6fba71b73948e2711d9279c12e2fe52071b815f611b;
  use existing Windows cache,44 matching installed packages, no npm install/ci/download.
- Notice material only: `react@19.3.0`, `react-dom@19.3.0`, `scheduler@0.28.0` LICENSE,
  each SHA-256 da6d3703ed11cbe42bd212c725957c98da23cbff1998c05fa4b3d976d1a58e93.
  Canonical publisher facebook/react; package identity/source terms already reviewed in T036
  inventory. Use COPY-OR-ADAPT for **unmodified generated notice copies**, no source vendoring.
  Disposition APPROVED-WITH-OBLIGATIONS for notice retention: exact MIT copyright, permission
  and disclaimer preserved byte-for-byte; no implied endorsement. Engineering owns retention.

Owned local root: worktree `.tmp/t036-notices-20261006-01`; refuse existing root. Owned remote
root `/home/phuclam/idea-t036-notices-20261006-01`; refuse existing root. Keep all results for
review; never overwrite retained input JAR or mutate/deploy preview. Working node_modules is an
ignored **copy** of existing cache; preserve the primary checkout/cache unchanged.

## Seam, command sequence and oracle

Test seam: generated real Web directory and packaged ZIP entries, not mocked internal functions.
`tests/ph1/web-qualification/check-runtime-notices.ps1 -Artifact <directory-or-JAR>` checks
exact three notice hashes plus links from index.html under existing public `/assets/` surface.

1. Publish authorization/test source before RED. Copy retained JAR to fresh local root, verify
   source/copy hash, run checker: missing notice is expected genuine RED, not a build failure.
2. Implement minimum build/index repair; publish exact source before build. Hash source inputs
   and cache/legal/tool pins. Copy cache into the isolated worktree, never install.
3. Run Node directly: cached TypeScript CLI with `--noEmit`, then cached Vite build and the real
   `apps/server/scripts/build-web-static.mjs` path as appropriate. Prefer direct cached CLI if
   bundled npm is unavailable; do not acquire npm. Record actual command/path, not an imagined
   standard lifecycle. Build output must remain below apps/server/target.
4. Check generated output, repeat real build/check and compare notice bytes; no stale notice PASS.
5. Transfer only generated static bytes into fresh remote `BOOT-INF/classes/static`, freeze hash
   manifest and compare local/remote raw bytes. Copy retained JAR, then installed `jar --update
   --file <owned-copy.jar> -C <owned-root> BOOT-INF/classes/static`. No product process runs.
6. Copy updated JAR back and run checker. Compare every original non-static ZIP entry's content
   hash and entry set with predecessor, including loader/manifest/classes/migrations/nested JARs.
   Only static content may change; repeat update/check. Final inputs/tool hashes unchanged.

PASS requires genuine RED, all three exact notices and index links in real repeat Web output and
copied Server package, transfer identity and unchanged non-static entries. It closes R36-04 only;
no all-T036/PH1/production/commercial acceptance. STOP on missing cache, input/hash/version drift,
unexpected graph/network/DB/listener need or mutation outside owned targets. First-party defects
can be repaired prospectively with failed attempts retained. No verifier, timer action or merge.

## Actual execution receipt — 2026-10-06

Authorization/test publication: 11bd379b3cde01c0986e4795bd6b9a73c6ff8d5a, pushed before RED.
Implementation source: b2d361a01ab523e53786f0dd741c7e68cba16b04, pushed before real build.
Successor checker/source: fa4cb5c852d5993916b3bc4997c39631a73441c5, pushed before non-static
comparison and final real Web build; only the checker changed since b2d361a.

| Actual command / independent oracle | Result |
|---|---|
| `pwsh -NoProfile -File tests/ph1/web-qualification/check-runtime-notices.ps1 -Artifact .tmp/t036-notices-20261006-01/predecessor.jar` | Genuine RED: `RUNTIME_NOTICE_MISSING_OR_DUPLICATE=assets/licenses/react.txt`; predecessor hash matches 7f0a628d…53c. Input retained unchanged |
| Admitted Windows Node directly executes `apps/server/scripts/build-web-static.mjs <worktree>/apps/server/target/t036-notice-01` | Real TypeScript noEmit + Vite8.3.1 build PASS,15 modules. Admitted Node-only distribution has no npm CLI, so the published fallback runs existing `typescript/bin/tsc` and `vite/bin/vite.js` directly. No npm/package acquisition or plugin used |
| Notice checker against generated directory, including repeat and final-source build | PASS on each run:3 exact SHA-256 notices +3 index links. Vite empties the generated output on repeat; notices are regenerated, not stale leftovers |
| Local/remote raw generated transfer checks | 5/5 PASS before JDK jar update: index, unchanged compiled JS,3 notice files |
| Installed JDK `jar --update --file <fresh-owned-copy.jar> -C <owned-root> BOOT-INF/classes/static` | PASS, repeat PASS. Existing accepted preview JAR and all old evidence preserved; no preview deployment/start/stop |
| Checker against updated JAR with `-BaselineArtifact <predecessor.jar>` | PASS twice:3 exact notices,3 links,261 non-static entry names/content hashes unchanged. No class, SQL, loader, manifest or nested library change |
| Final source/tool/lock/input rehash | Node/JDK pins and predecessor JAR unchanged; copied cache reconciled1602/1602 files to unchanged primary cache before final-source build. No graph/version/installed-package change |

Output package projection SHA-256:
`dde3f36b1ad015d46c46585b78d77b660f7a62037e7ca7215574ec7186bcc151`,
same after repeat jar update and transfer back. This is **not** a newly compiled final-F05 Server
release artifact and is not deployed/reviewer-accepted. Generated Web index SHA-256
`6adc2b6e92446ff413854c9c5958b44f5d0c7cc88f9001a381988c5489da36c2`;
compiled JS SHA-256 remains `a34548822cf5cadf32e485f6b302052105407894dfacbe77a9717a3a12bb6552`,
identical to predecessor. Each runtime notice remains the admitted `da6d3703…a58e93` bytes.

Final first-party raw working-file hashes (not a claim that every Windows byte has Git LF layout):

| File | SHA-256 |
|---|---|
| apps/server/scripts/build-web-static.mjs | 859634a3151e52e354fe57d7335ea73b047a40104debc0e61acd09213c11239d |
| apps/web/index.html | 4726dcbd221aa4da02b07199c556215c3e5890b6f09fdec99b5919bbd6d0baf9 |
| tests/ph1/web-qualification/check-runtime-notices.ps1 | 9cbd34ed1338da0a21166eb54238c51f3552ed832f37d9881983873e4d900d69 |

Cache reconciliation aggregate:1602 records, sorted by source full path, each relative
slash-normalized path + TAB + SHA-256, joined LF with final LF; UTF-8 SHA-256
`5e38eec0c9a9eaf9b258670164d731606e7f5bf71506e2b954a9d73669a3d70e`.
This full-file comparison occurred after initial copy/build and before final-source rerun;
it is not falsely described as before the first build. Initial execution used existing reviewed
exact-version cache; production notice-copy checks pin versions/legal hashes on every build.
No publisher archive attestation or independent upstream rebuild is implied.

Retained evidence: controlled source/checker and this command/result record, original copied JAR,
generated output and two projection copies under the owned local root; remote static/projection
under the owned remote root. No new durable raw-log file was created: the actual RED/GREEN command
outputs are retained in the task transcript. Exact hashes identify retained files, not independent
review of a private log. Primary cache, preview and database were unchanged. No cleanup of retained
roots or other worktrees. Focused R36-04 engineering repair = PASS; external review remains separate.
Maven/full executable build, HTTP/browser/application suites, verifier and all-T036 closure NOT-RUN.
