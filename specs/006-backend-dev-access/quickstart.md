# Backend development access — human handoff

Procedure, not execution evidence. Branch `codex/backend-dev-access`, Issue #26.

## Prerequisites

Windows OpenSSH and ordinary certificate trust; Ubuntu Java/PostgreSQL and inspected retained JAR.
New isolated DB provisioning needs a user-operated sudo console. No build/download for US1.
Passwords are entered only in the terminal/Web, never chat.

## Available now (US1)

Provisioning was completed on 2026-10-01 for `idea_ddm_preview_20261001_26` and login `preview.dev`.
Use the test password chosen privately during setup. No password is in this document or Git.

On Windows, double-click the root `IDEA-Dev.cmd` in this worktree and choose Start, Status or Stop.
It uses built-in Windows PowerShell 5.1, not `pwsh` or a Maven build.

Command-line alternatives from this checkout:

```text
IDEA-Dev.cmd Start
IDEA-Dev.cmd Status
IDEA-Dev.cmd Stop
```

Backend: `phuclam@192.168.137.33`, bound to Ubuntu loopback `127.0.0.1:18444`.
Browser: **https://localhost:18444/** over the launcher-owned SSH forward.
Start opens the browser only after real HTTPS process and PostgreSQL health both return UP.
Closing a browser tab does not stop the Server. Stop preserves synthetic data; Start again requires
fresh authentication. Refresh the page after a runtime restart before signing in again.

Health: `/health` and `/health/database` at that HTTPS origin. Swagger NOT_INSTALLED in the first
slice; arrives separately after intake/build/qualification. No Account Management UI, documents,
Checkout/Check-in or Desktop/Workspace is provided by this launcher.

Do not run the SQL/wizard again against a new or renamed target. The one-time setup refuses an
existing database. To resume only a failed initial console bootstrap, the controlled helper is
`bash /home/phuclam/idea-dev-preview-26/bootstrap-preview.sh` in an interactive SSH console;
it does not recreate the database. UUID inputs currently require no surrounding spaces.

## Failures and limits

- SSH failure: confirm hotspot/Server reachability and the IDEA key; never bypass host-key checks.
- Local/remote port conflict: stop the unrelated owner yourself or ask for diagnosis; launcher does
  not adopt/kill it. Do not manually edit PID records to authorize Stop.
- TLS failure: the current approved loopback certificate expires **2026-10-08 10:58:09 +07**.
  Renew/trust through a separately reviewed fingerprint; do not disable validation.
- Setup/runtime credentials remain in mode-600 files under the mode-700 remote preview directory.
  Server startup uses only app credentials; migration is not run on Start.
- This preview reuses the retained accepted package from PR #25; it does not depend on that PR
  already being merged. No push/merge or delivery timer is inferred for this branch.

## Verification

Focused `tests/backend-dev-access/launcher-contract.test.ps1` plus approved real start/status/stop
and browser exercise. Retain TLS/ownership/port/refusal and data-retention outcomes in
`evidence/launcher-results.md`. No verifier, mock-database success or retained DB cleanup.
Never label an unexecuted scenario PASS.
