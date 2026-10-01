# T043 Web Qualification — Partial Checkpoint

| Field | Value |
|---|---|
| Stable ID | `IE-VER-T043-WEB-20261001` |
| Version / document status | `0.2` / `Draft` |
| Verification disposition | `PARTIAL`; whole T043 and F03-B remain `IN_PROGRESS`; reviewer acceptance pending |
| Class / normativity | Verification record / `INFORMATIVE` |
| Author / owner / reviewer | Codex / Project Reviewer / external review `NOT-RUN` for this checkpoint |
| Classification / retention | INTERNAL; retain with Work Item #24 and the PH1 feature evidence |
| Upstream trace | Work Item #24; spec v0.7; [approved W01–W10 contract](../contracts/ph1-boundaries.md#t043-web-qualification-contract) |
| Change record | v0.2 expands traceability, separates browser observations from contract acceptance, and identifies skipped regression suites; source is unchanged |
| Evidence date | 2026-10-01 |
| Web source | `2d2bcfc4892cb6903fa3196ae6fc47dbd8424121`; execution used the worktree before commit; this is a retrospective source association, not execution from a committed archive |
| Server source | `2d2bcfc4892cb6903fa3196ae6fc47dbd8424121`; packaged from a worktree copy; on 2026-10-01 all 36 Java main/test, migration, pom and application-properties files compared equal by SHA-256 between local and remote copies |
| Browser | Branded Chrome `154.0.8037.92` |
| Build/runtime | Local Web Node `24.16.0`; Ubuntu Server Java `25.0.4.1`, PostgreSQL `18.6` |
| Server boundary | IDEA Server HTTPS on `127.0.0.1:18443` through an SSH loopback forward to Ubuntu test server |
| Certificate | Subject `CN=IDEA T043 loopback test`; SAN `localhost`, `127.0.0.1`; SHA-256 `71D16C7626E9ED97C84EC6167FE8E88CB753BFF5135EE547FB221EB0828D3DE2`; trusted in Windows `CurrentUser\\Root` |
| Database boundary | Dedicated test database `idea_ddm_f03a_20260930_c91e7a42`, isolated schema `t043_web_20261001`; runtime uses `idea_ddm_app`, schema owned/migrated by `idea_ddm_migrator`. The schema has a fixed test name, differing from the approved UUID-name prerequisite; bounded isolation was used but prerequisite conformity is not claimed |
| Test data | Synthetic organization/Actor/Account/Login Identity only; no company account or Vault data |
| Raw browser/server log | `NOT-RETAINED` where it could contain credentials, cookies or proof; observations below are sanitized |

## Executed browser observations

These B identifiers describe the observations made through actual Chrome. They do not replace
or renumber the approved contract's W01–W10 cases. Observation PASS applies only to the stated
UI/database fact; it is not acceptance of the broader contract case.

| ID | Observation / oracle | Result |
|---|---|---|
| B01 | Actual IDEA Server-served bundle opens through normally trusted HTTPS; `main` and login form render | `PASS` |
| B02 | Form sign-in succeeds with the application's same-origin CSRF flow; direct request/header capture was not retained | UI outcome observed; network oracle `NOT-RUN` |
| B03 | Synthetic sign-in shows authenticated UI and the Actor returned by Server | `PASS` for UI outcome; outbound request inspection `NOT-RUN` |
| B04 | Protected session UI appears after successful form sign-in | `PASS` for UI outcome |
| B05 | Web logout returns to anonymous UI; database contains one session record and one revoked record | `PASS` for UI/database outcome; browser status-code oracle `NOT-RUN` |
| B06 | Wrong synthetic password is refused by the UI and the password control is empty afterward | `PASS` for UI outcome |
| B07 | Password control is empty after success/refusal; browser tooling reports no console warnings/errors | `PASS` for these observations; broader storage/leak/exception/unmount checks `NOT-RUN` |

## Disposition against the approved Web contract

| Contract ID | Disposition | Evidence / remaining oracle |
|---|---|---|
| W01 Same origin | `PARTIAL` | B01; browser asset and anonymous-session HTTP status inspection remains unexecuted |
| W02 Sign-in | `PARTIAL` | B02–B04; direct CSRF-header, request identity and status inspection remains unexecuted |
| W03 Wrong password | `PARTIAL` | B06; direct generic HTTP 401 and automatic-retry observation remains unexecuted |
| W04 Bad CSRF | `NOT-RUN` | No actual Web submission was exercised with omitted/invalid CSRF |
| W05 Cookie | `NOT-RUN` | Secure/HttpOnly/SameSite/host-only, rotation and JavaScript unreadability were not directly observed |
| W06 Host scope | `NOT-RUN` | No 127.0.0.1 → localhost browser check |
| W07 Logout | `PARTIAL` | B05; browser 204/401 and subsequent fresh sign-in with new CSRF remain unexecuted |
| W08 Invalidation | `NOT-RUN` | No actual Web request after authorized account disablement |
| W09 Reload | `NOT-RUN` | Eligible and invalidated reload cases remain unexecuted |
| W10 Error/secrets | `PARTIAL` | B07; controlled network-error, storage, URL, diagnostics and unmount oracles remain unexecuted |

The synthetic password was entered only into the local test browser and is not recorded here. No
password, cookie, CSRF token, private key or credential verifier is retained in repository evidence.
The login refusal before the isolated schema was correctly wired was treated as environment setup
failure, not as a Web result; the final W01–W07 observations were rerun after schema binding and
synthetic identity setup. This browser run was exploratory qualification after implementation;
it does not supply the approved behavioral RED → GREEN evidence. Missing tooling or certificate
setup was not counted as a behavioral RED.

## Affected server regression

Command: `./mvnw -o test` in `/home/phuclam/idea-t043-web-build/apps/server`, with the two
test-role credentials loaded from the private host file and `IDEA_F03B_TEST_DATABASE_NAME`
set to the dedicated test database. No credentials are retained here. Result: **105 declared,
81 executed, 24 skipped, 0 failures, 0 errors; Maven BUILD SUCCESS**, finished
2026-10-01 11:35:02 +07:00. Tests used bounded UUID schemas.

| Suite | Executed / skipped | Disposition |
|---|---|---|
| HttpSessionFlowTest | 76 / 0 | PASS |
| ServerRestartFlowTest | 3 / 0 | PASS |
| ServerSmokeTest | 2 / 0 | PASS |
| IdentityFlowTest | 0 / 20 | NOT-RUN in this run; `IDEA_F03_TEST_DATABASE_NAME` was not set |
| DataBaselineTest | 0 / 3 | NOT-RUN in this run; dedicated F02 variable was not set |
| DatabasePrivilegeTest | 0 / 1 | NOT-RUN in this run; dedicated F02 variable was not set |

This is not a complete F03-A or fresh-public migration regression. Historical evidence remains
separate. Surefire XML reports stay on the host; their recorded hashes do not constitute
independent review of raw logs:

| Host report under `apps/server/target/surefire-reports/` | SHA-256 |
|---|---|
| TEST-com.idea.ddm.identity.HttpSessionFlowTest.xml | `c3b49f4ff4c03316982a4441974bbb657aa5216f75cf3e37f684ad600f5d5860` |
| TEST-com.idea.ddm.identity.ServerRestartFlowTest.xml | `495f6f42a6aa552e6a557c1503ef6f530abd469a537d21cec38cc34aa111bd0b` |
| TEST-com.idea.ddm.ServerSmokeTest.xml | `82b84f08147f2f151072cc130b529fb2db8108232eb15762a56bed469e1ad366` |

Build artifacts observed on 2026-10-01:

| Artifact | SHA-256 |
|---|---|
| Local Web `dist/index.html` | `5F4AB29878C576DDD0DAFF5472457D8CD65B6CE48A48CD7863E5B393C2947E79` |
| Local Web `dist/assets/index-DJQKxs3r.js` | `A34548822CF5CADF32E485F6B302052105407894DFACBE77A9717A3A12BB6552` |
| Host `target/idea-server-0.1.0-SNAPSHOT.jar` | `dc4021e5f6c414e097bbe11d194cdc3684dd7d5a02c173032ea9b94c29e9578c` |

The two local Web static-render tests and `npm run build` passed. Static-render tests alone
do not exercise browser authentication, CSRF, cookie policy, storage or failure handling.

## Limits and next action

This record does not claim F03-B completion, production readiness, commercial clearance, Desktop
qualification or cookie-attribute PASS. Next T043 action is to close the Web prerequisites and
unexecuted W oracles, retaining direct browser evidence without secret values. Desktop then
follows as a separate checkpoint. The existing server restart regression above does not substitute
for actual Web invalidation/reload behavior. `verify-template` remains `NOT-RUN`.
