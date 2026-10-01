# T043 Web Qualification — Partial Checkpoint

| Field | Value |
|---|---|
| Stable ID | `IE-VER-T043-WEB-20261001` |
| Status | `PARTIAL / PASS WITH LIMITS`; whole T043 and F03-B remain `IN_PROGRESS` |
| Evidence date | 2026-10-01 |
| Web source | `2d2bcfc` (`feat(web): add same-origin T043 qualification slice`); execution used the same worktree before commit with no source/test changes between execution and commit |
| Server source | `2d2bcfc` packaged on the test server; execution used the same worktree before commit with no source/test changes between execution and commit |
| Browser | Branded Chrome `154.0.8037.92` |
| Server boundary | IDEA Server HTTPS on `127.0.0.1:18443` through an SSH loopback forward to Ubuntu test server |
| Certificate | Subject `CN=IDEA T043 loopback test`; SAN `localhost`, `127.0.0.1`; SHA-256 `71D16C7626E9ED97C84EC6167FE8E88CB753BFF5135EE547FB221EB0828D3DE2`; trusted in Windows `CurrentUser\\Root` |
| Database boundary | Existing F03A database, isolated schema `t043_web_20261001`; runtime uses `idea_ddm_app`, schema owned/migrated by `idea_ddm_migrator` |
| Test data | Synthetic organization/Actor/Account/Login Identity only; no company account or Vault data |
| Raw browser/server log | `NOT-RETAINED` where it could contain credentials, cookies or proof; observations below are sanitized |

## Executed browser observations

| ID | Observation / oracle | Result |
|---|---|---|
| W01 | Open the built Web bundle from the actual IDEA Server over normally trusted HTTPS; `main` and login form render | `PASS` |
| W02 | Web obtains CSRF through same-origin `/api/v1/identity/csrf`; no alternate token/storage mechanism appears in the UI | `PASS` |
| W03 | Synthetic login through the Web form establishes a Server session; the page shows the Server-derived Actor, not a client-supplied Actor ID | `PASS` |
| W04 | Protected session UI is visible only after the Server accepts the login | `PASS` |
| W05 | Web logout returns to anonymous state; the isolated database shows one session record and one revoked record | `PASS` |
| W06 | Wrong synthetic password is refused and the password control is empty after refusal | `PASS` |
| W07 | Password is not retained in the password control after success/refusal; no console warning/error was observed | `PASS` |
| W08 | Secure/HttpOnly/SameSite/host-only attributes observed directly from Chrome Network `Set-Cookie` details | `NOT-RUN` |
| W09 | `127.0.0.1` to `localhost` host-scope behavior with a SAN-matching certificate | `NOT-RUN` |
| W10 | Reload/invalidated-session UI after Server restart and the separate Desktop client qualification | `NOT-RUN` / separate checkpoint |

The synthetic password was entered only into the local test browser and is not recorded here. No
password, cookie, CSRF token, private key or credential verifier is retained in repository evidence.
The login refusal before the isolated schema was correctly wired was treated as environment setup
failure, not as a Web result; the final W01–W07 observations were rerun after schema binding and
synthetic identity setup.

## Affected server regression

The exact worktree used for the Web qualification was also exercised with the existing PostgreSQL
and HTTP regression suite against the controlled test database. Result: **105 tests, 0 failures,
0 errors, 24 skipped; Maven BUILD SUCCESS**. The run used PostgreSQL 18.6, Java 25.0.4.1 and
bounded temporary `f03b_<UUID>` schemas; no production schema or Vault data was used.

## Limits and next action

This record does not claim F03-B completion, production readiness, commercial clearance, Desktop
qualification, HTTP session restart qualification, or cookie-attribute PASS. Next T043 action is
to capture the browser Network cookie evidence without exposing values, then run the approved
Desktop checkpoint. `verify-template` remains `NOT-RUN`; verifier remains `NOT-RUN`.
