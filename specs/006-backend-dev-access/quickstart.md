# Backend development access — human handoff

Procedure, not execution evidence. Issue #26; launcher integration authorized on 2026-10-02.
Swagger preview qualified/loaded on 2026-10-02; PR #27 remains open for final human acceptance and
has not been merged.

## Prerequisites

Windows OpenSSH and ordinary certificate trust; Ubuntu Java/PostgreSQL and inspected retained JAR.
New isolated DB provisioning needs a user-operated sudo console. No build/download for US1.
Passwords are entered only in the terminal/Web, never chat.

## Available now

Provisioning was completed on 2026-10-01 for `idea_ddm_preview_20261001_26` and login `preview.dev`.
Use the test password chosen privately during setup. No password is in this document or Git.

Last verified 2026-10-02: the persistent preview runs application source
`2a74130b88cffe1ee96d28014c7a0ec080d1a199`, packaged JAR SHA-256
`7f0a628d2efd94405ba5f083295c23e6faf0246da86c8dd019f669f69482d53c`. Launcher Status reported
process UP, PostgreSQL UP, trusted HTTPS, and Swagger AVAILABLE. This identifies the deployed
generation; it is not a future-uptime guarantee or human acceptance.

On Windows, double-click the root `IDEA-Dev.cmd` in the project checkout and choose Start, Status or Stop.
Main checkout: `C:\Users\TD-999\Research\Projects\IDEA\IDEAEngineering`.
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

Health: `/health` and `/health/database` at that HTTPS origin.
Swagger: **https://localhost:18444/dev-api/**, using the same ordinary Web session:

1. Open the Backend, refresh after restart, then sign in as `preview.dev` with your test password.
2. Open Swagger in the same browser/profile. Anonymous access returns 401; sign in at the Web first.
3. Expand `GET /api/v1/identity/session`, choose **Try it out**, then **Execute**. An eligible
   session returns 200 with the Server-derived identity.
4. `POST /api/v1/identity/logout` sends CSRF automatically; success 204 signs out that session.
   Another session request then returns 401. Sign in at the Web again before further use.

Do not paste cookies/tokens; there is no Authorize input or JWT. Password/proof/CSRF operations are
documentation-only. Account administration still needs an explicit scoped Account Administrator
assignment: the preview Super does not receive it implicitly, so those attempts may return 403.
Credential delivery stays disabled. This is not Account Management UI, document Checkout/Check-in
or Desktop/Workspace implementation.

The updated launcher reports AVAILABLE only for an identified documentation-capable runtime plus
actual HTTPS probe. Legacy/unidentified generations report UNVERIFIED without a working-link claim.
The main launcher from the earlier US1 merge can still start this upgraded Server, but its earlier
NOT_INSTALLED text remains until the Swagger PR is integrated. Use the actual link above.

Do not run the SQL/wizard again against a new or renamed target. The one-time setup refuses an
existing database. To resume only a failed initial console bootstrap, the controlled helper is
`bash /home/phuclam/idea-dev-preview-26/bootstrap-preview.sh` in an interactive SSH console;
it does not recreate the database. UUID inputs currently require no surrounding spaces.

## Failures and limits

- SSH failure: confirm hotspot/Server reachability and the IDEA key; never bypass host-key checks.
- `ENVIRONMENT_OVERRIDE_REFUSED`: the SSH environment contains Spring/servlet/JVM overrides.
  Use the controlled preview configuration, not an inherited override. Status/Stop remain available.
- Local/remote port conflict: stop the unrelated owner yourself or ask for diagnosis; launcher does
  not adopt/kill it. Do not manually edit PID records to authorize Stop.
- TLS failure: the current approved loopback certificate expires **2026-10-08 10:58:09 +07**.
  Renew/trust through a separately reviewed fingerprint; do not disable validation.
- Setup/runtime credentials remain in mode-600 files under the mode-700 remote preview directory.
  Server startup uses only app credentials; migration is not run on Start.
- Current preview: application source `2a74130b88cffe1ee96d28014c7a0ec080d1a199`, artifact
  SHA-256 `7f0a628d2efd94405ba5f083295c23e6faf0246da86c8dd019f669f69482d53c`; the controlled
  backend launcher pins this exact hash. V1–V7, product identity code and existing Web bytes are
  unchanged. The predecessor package/controller are retained as recoverable backups. No product
  gate, timer or Swagger merge is inferred.

## Verification

Focused `tests/backend-dev-access/launcher-contract.test.ps1` plus approved real start/status/stop
and browser exercise. Retain TLS/ownership/port/refusal and data-retention outcomes in
`evidence/launcher-results.md`. No verifier, mock-database success or retained DB cleanup.
Never label an unexecuted scenario PASS.
Swagger HTTP/browser/package and successor launcher results: [swagger-results.md](evidence/swagger-results.md).
