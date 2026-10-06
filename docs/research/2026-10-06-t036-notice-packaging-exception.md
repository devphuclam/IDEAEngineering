# T036 bounded runtime-notice packaging repair

| Control | Value |
|---|---|
| Stable ID / class / version / status | IE-RES-T036-NOTICE-PACKAGING-20261006 / prospective process exception and execution packet / 0.1 / Approved for bounded scope |
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
