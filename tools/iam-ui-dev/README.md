# Feature009 manual-review development entry point

| Control | Value |
|---|---|
| ID / version / class | IE-DEV-IAM-46-001 / 0.1 / internal engineering execution recipe |
| Owner / author | Project user / Codex, CODEX_ONLY |
| Authority / date | User selects dedicated Feature009 test DB and retained synthetic accounts, after requesting npm development flow; 2026-10-08, Asia/Ho_Chi_Minh |
| Status / review | Development path executed PASS; human acceptance and PG5 pending |
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
- Vite: HTTPS `127.0.0.1:5173`; Windows forward `127.0.0.1:5174` only.
  Initial Windows5173 conflict was refused without signalling its unrelated owner.
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

Keep that terminal open; browse `https://localhost:5174/` without any TLS warning.
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

## Actual setup / focused qualification — 2026-10-08

Publication lineage, not a single collapsed execution SHA:

- Initial recipe `da97b6fb7854881610b137ad415fa03322fea5da`; successor
  `b33e19766d6e9d72e5f32f5d470cd88da88ed90e` corrects the package manifest to
  committed LF bytes before transfer/setup. No source-byte mismatch was executed.
- Ubuntu control scripts executed from `b33e197`; their raw exported inputs6/6,
  transfer ZIP identity and remote extracted6/6 passed. ZIP SHA-256
  `f77e94a6617aa875ae8dc8d0042850fe73d06dfa4d67b02d265609ad5bf9caa9`.
- Backend/Vite controls retain their original checked hashes respectively
  `a38eb537cd5bf3aec65544e7b253d0de0645d5c1afbac4aa3d0ef2b2a5d1cfc4` /
  `2a99ac9b21999d56202f900f2024bee93c1c19cd2b82c6cf57eb4edb353db760`.
- Local5173 conflict: safe STOP after remote setup, no unrelated process signalled.
  Windows launcher successor `f684265965600926571c5f9cecf5b24fba2aaad3`
  chooses local5174→remote5173; Ubuntu scripts need no port/source change.
- Initial browser stopped after login200 because a new harness assertion compared
  full UUID to the UI's intentionally abbreviated text. Source diagnosis, not a
  product/proxy authentication defect. Final harness checks the exact IAM session
  Actor and separately waits for the authored display. No UI change.
- Final dev-browser source `21b6584b32a71b4c52aeb246123aba2ab9f35452`, exact file
  `94d50e3f571c653d0f140170dcbaa867a54010b7992fc38aac499a156c4097d8`:
  **4/4 PASS** using normally trusted headed Chrome155.0.8059.39, admitted
  Node24.19.0/Playwright1.62.1. Login200, context200, account-list200, same
  server-established Actor after runtime restart, old proof401, logout204→401,
  actual Secure/HttpOnly/Strict host-only cookie and bounded no-secret persistence.
- Read-only Status: RED before launcher existed; GREEN before provisioning and
  after start. Windows Stop→Status(STOPPED/forwardSTOPPED)→Start succeeded,
  preserving schema/accounts. No broad process termination or cleanup.

Retained target: `idea_ddm_iam_ui_20261007_46` /
`iam_ui_c3b8cde44f9a4d1199306c381c12d1bb`. Initial synthetic fixture has
three accounts; `iam-assignment.admin` has independent Super@2/AA@3/PA@1,
Linh has explicit membership, and ordinary has no role. Passwords remain only
in mode600 fixture data; the human-only terminal command does not retain them.
Schema, credential identities and public-empty boundary are preserved. No
application build/package or whole-feature regression/verifier was rerun.

The repaired JAR and mirrored `apps/web/src` are still the previously qualified
`9d3732c` generation. These development commands do **not** replace production
packaging evidence or independent review. Historical stopped qualification
roots/private-log limitations remain unchanged. This result retains the owned
test processes/forward for the user's next review; stop explicitly when finished.

The Windows launcher was executed directly with PowerShell, not via PATH npm.
PATH currently resolves Node24.16.0/npm11.13.0 under the user's Notes directory;
that runtime is not substituted for admitted Node24.19.0 or the remote24.21.0.
The `dev` npm script is only the convenience alias for this exact PowerShell
command. To use the already checked path without invoking PATH Node/npm:

```powershell
cd C:\Users\TD-999\.codex\worktrees\iam-rbac-ui-spec\IDEAEngineering\apps\web
powershell -NoProfile -File ../../tools/iam-ui-dev/launch.ps1
```

Unchanged standalone tracked-secret detector: exit1/10 findings, **NOT-PASS**;
the historical9 are preserved. New `backend.sh` finding is the shell assignment
reading the existing mode600 TLS password file into the process environment;
it contains no committed password/key bytes. Author disposition: private runtime
read, not a working committed credential; no detector exclusion or false PASS.
Prior user-reported manual PASS is not silently extended to this new source.
