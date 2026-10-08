# Feature009 manual-review development entry point

| Control | Value |
|---|---|
| ID / version / class | IE-DEV-IAM-46-001 / 0.1 / internal engineering execution recipe |
| Owner / author | Project user / Codex, CODEX_ONLY |
| Authority / date | User selects dedicated Feature009 test DB and retained synthetic accounts, after requesting npm development flow; 2026-10-08, Asia/Ho_Chi_Minh |
| Status / review | Authorized setup; execution NOT-RUN at recipe publication; human acceptance and PG5 pending |
| Scope / classification | Issue46 / Draft PR47; INTERNAL, synthetic manual review only |
| Supersession / retention | Supplements qualification recipes, never rewrites them; retain recipe/results; no automatic schema/database deletion |
| Upstream | [execution envelope](../../specs/009-iam-rbac-ui-integration/execution-envelope.md), [repair handoff §22](../../specs/009-iam-rbac-ui-integration/integration-readiness.md#22-independent-review-repair-successor--2026-10-08) |

## What this does

`npm run dev` in this feature worktree starts a same-origin HTTPS Vite development
surface for the **published repaired Web source**, using the actual Server APIs.
Vite runs on Ubuntu beside the test Server; the Windows command owns only its SSH
forward. The TLS private key stays on Ubuntu. This is not a live synchronization
of arbitrary edits in the Windows checkout. Source changes require an explicitly
updated mirror/package, not silent replacement of the acceptance candidate.

No npm install, npx resolution, Maven build, Java/schema/API change, permission
bypass, preview upgrade, company data, verifier, timer or merge is involved.
Fixtures seed named synthetic prerequisites, not a product adoption operation.

## Exact execution packet

- Accepted review packet: `fa74380503860e9cd9845b644841af6f77c5e470`.
- Reused application/Web/fixture source: `9d3732cb173e8094195b9bdd60b5588ac3cfa42e`.
- Reused JAR: `318a52cf1e658a53bc9fa54137346c15277060667998d2f10f33454d15bb8c1c`.
- Retained input: `run-assignment-qualification-43/source` under
  `/home/phuclam/idea-iam-ui-20261007-46/`; 220-input manifest SHA-256
  `29e1975f3fae8b0fe9a2d085fa8783654179528863b3e2591af4a2851cceee7f`.
- Fresh owned root: `run-assignment-qualification-44`; existing synthetic DB
  `idea_ddm_iam_ui_20261007_46`, one newly generated source-marked `iam_ui_<UUID>`
  schema; existing separate `idea_ddm_migrator` / `idea_ddm_app` only.
- Published control scripts: fresh `manual-dev-01` directory alongside it;
  exact committed script bytes/hash manifest verified before use. No overwrite
  of historical roots. Copy the retained exact source/package/fixture classes,
  check the full manifest/tool/cache pins, then use the existing migrator fixture
  once. Subsequent Start/Stop never seed or migrate again.
- Existing admitted Linux Node24.21.0/hash and Vite8.3.1/React plugin cache only;
  cached Java25/JAR as above. No PATH Node or download. Existing bundle terms remain.
- Server: HTTPS `127.0.0.1:18446`, unchanged packaged configuration.
- Vite: HTTPS `127.0.0.1:5173`; Windows forward `127.0.0.1:5173` only.
- `/api` forwards to HTTPS127.0.0.1:18446 using the dedicated certificate as CA,
  normal endpoint verification, `secure: true`; no CORS/auth change or TLS bypass.
- Existing test certificate SHA-256
  `6cee40386182902343aeb0ad6db1110656b1c293dcc3c33fbc3fe32251d965ad`,
  SANlocalhost/127.0.0.1, expires2026-10-14T05:19:50Z; existing CurrentUser trust,
  no trust-store mutation. PFX/password remain private on Ubuntu.

Commands after publishing/copying and checking the exact control-script manifest:

```bash
bash /home/phuclam/idea-iam-ui-20261007-46/manual-dev-01/backend.sh setup
bash /home/phuclam/idea-iam-ui-20261007-46/manual-dev-01/backend.sh start
```

The fresh schema and synthetic accounts are deliberately retained for this human
review. No DROP operation exists in this launcher. Delete only with separate
approval after resolving exact ownership/marker and stopping owned processes.

## Human commands (Windows, this feature worktree)

```powershell
cd C:\Users\TD-999\.codex\worktrees\iam-rbac-ui-spec\IDEAEngineering\apps\web
npm run dev
```

Keep that terminal open; browse `https://localhost:5173/` without any TLS warning.
In a second **private, non-recorded** terminal, `npm run dev:credentials` gives
the synthetic passwords. Never send them to chat or capture them in evidence.
The command requires an interactive output terminal; automated tests read the
mode600 fixture into transient RAM without printing it.

`iam-assignment.admin`: independently seeded Super@2, AA@3 and PA@1. Linh:
Project/Group membership, initially no administrative roles. Ordinary: no roles.
Use the ordinary UI to grant Linh separate roles when reviewing assignments.

`npm run dev:status` reports runtime/data target without secrets.
`npm run dev:stop` or Ctrl+C stops exact owned processes/forward only; data,
identity IDs, credentials and history remain. Start again uses the same account.
Existing preview18444 and its `preview.dev` account remain untouched.

## Focused oracle / STOP

Before setup: unchanged retained220 source inputs, JAR, tool/cache and certificate
pins; ports5173/18446 unused; fresh exact root. STOP on any mismatch, wrong root,
unknown process, unavailable SSH/DB, expired/untrusted certificate or changed graph.

Qualification: read-only launcher Status; real headed admitted Chrome with normal
trust; anonymous session401; actual authored login200 + server context/account
list200; Secure/HttpOnly/Strict cookie; logout204 then session401. No screenshots,
HAR, request-body/console/token retention. Restart must preserve identity/schema
and allow a fresh sign-in; it must not revive the prior servlet proof.

These checks qualify this development path only. Existing production package and
Feature009 regression evidence remain their separately frozen lineage. This does
not close T093 or imply PG5, deploy, production readiness or merge approval.
