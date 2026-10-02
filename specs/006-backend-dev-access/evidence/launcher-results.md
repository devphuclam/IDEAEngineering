# Backend preview launcher results

| Control | Value |
|---|---|
| Stable ID / version / status | `IE-VER-DEVACCESS-LAUNCHER-001` / `0.4` / Draft |
| Class / normativity | Engineering verification record / INFORMATIVE; no product gate or deployment approval |
| Owner / author / reviewer | Engineering / Codex / Project Reviewer Nguyen Huynh Phuc Lam; agent Standards/Spec source review recorded below; independent external review NOT-RUN |
| Authority / applicability | User-approved launcher seam and three-stage setup, 2026-10-01; Issue #26 US1 only |
| Baseline | Launcher worktree snapshot over `92d9c84ef24b2c3c4c6f01ad1df104e9c28880d0`; exact executed file hashes below |
| Evidence date / classification | 2026-10-01 original execution; 2026-10-02 integration checks / INTERNAL |
| Upstream / downstream | [spec](../spec.md), [contract](../contracts/launcher.md), user confirmations / [tasks](../tasks.md), [handoff](../quickstart.md) |
| Retention / change / supersession | Retain in Git with Issue #26; new record, no predecessor; private runtime state remains on host, outside Git |
| Review trigger | Launcher/helper/artifact, trust, credentials/data scope or startup lifecycle changes |
| Standards tailoring | STD-TEST-001..004 and STD-CM-001, STANDARD-GUIDED verification/configuration trace; no conformity claim |

Current successor: the 2026-10-02 Swagger-qualified preview and refreshed launcher are recorded in
[Swagger results](swagger-results.md). Sections below retain the original US1 package/observations;
their NOT_INSTALLED label is historical, not the current preview capability.

## Original US1 objective and controlled configuration

Make the already accepted Backend usable by its developer without a transient qualification
harness. No Maven build, dependency import, company data, Vault access, verifier or F03-B source
change occurred. Swagger is NOT_INSTALLED; Issue #26 remains open.

- Host/user: `192.168.137.33` / `phuclam`; installed Temurin 25.0.4.1+1 and PostgreSQL 18.6.
- New database: `idea_ddm_preview_20261001_26.public`, created only after the user's sudo confirmation.
- Runtime directory: `/home/phuclam/.local/share/idea/dev-preview-26`, mode 700.
- Runtime/operator configuration: mode 600; privately entered credentials, not copied from old test
  access files. Server receives app credentials only; startup never runs migrations.
- Retained executable: `server.jar`, SHA-256
  `ac4f74e1fe5453b7716e13da970027ba403d695340974ca13503f3d8989332ff`;
  its original package source is `38b99f50de09370a8e8554cc80fc66a0afa70b62`, **not** the launcher SHA.
- HTTPS origin: `https://localhost:18444/`; Ubuntu binds loopback, Windows uses an owned OpenSSH
  forward. Default host-key validation and ordinary Windows TLS validation were used.
- Approved certificate SHA-256:
  `71D16C7626E9ED97C84EC6167FE8E88CB753BFF5135EE547FB221EB0828D3DE2`;
  expires 2026-10-08 10:58:09 +07. No ignore flag, trust callback or warning bypass.
- Synthetic login: `preview.dev`; the user chose its password privately. No credential-proof
  delivery switch was enabled.

## TDD and actual outcomes

Each new behavior was introduced after a failing public-boundary test, rather than creating the
whole imagined suite first. Later lifecycle/port assertions qualify already implemented behavior;
no artificial application change was made merely to produce another RED.

| Command / observation | Oracle / actual result |
|---|---|
| `powershell.exe -NoProfile -File tests/backend-dev-access/launcher-contract.test.ps1` | Final 3/3 PASS: missing key exit 2; unreachable SSH exit 1; CMD preserves refusal without PowerShell 7. Initial REDs were absent launcher, unsupported SSH options and absent CMD entry point. No failure reported READY. |
| `bash ...controller-contract.test.sh ...backend.sh` on Ubuntu | 5/5 PASS: unprovisioned; idempotent Stop; stopped Status; forged foreign sleep PID survives; actual retained Java package owned Start/Status/Stop. Initial REDs: absent controller, missing Stop/Status/start behavior. Temporary fixture files removed; no database deleted. |
| Controller termination race during that test | Initial `/proc` disappearance caused failure. Reading process identity now handles exit during verification; rerun PASS. No broad kill or PID-only authority. |
| `powershell.exe -NoProfile -File tests/backend-dev-access/launcher-runtime.test.ps1` | Final 5/5 PASS: actual trusted HTTPS/process/PostgreSQL; repeat Start uses same PID; owned Stop + stopped Status; occupied Windows port is neither adopted nor stopped; restart returns real readiness. First RED was Start exit 3 before action/forward/readiness implementation. |
| First synthetic console bootstrap | FAIL at UUID with leading whitespace, before initialization. Independently inspected `BOOTSTRAP_STATE=UNINITIALIZED`; bounded resume helper preserves DB and prompts through the official console. User subsequently completed setup; no password reset or bypass. |
| User first sign-in/sign-out | User confirmed both succeeded at the actual Web origin. Password never supplied to agent or evidence. |
| User fresh sign-in after Stop/Start | Initial user report was refusal; a read-only diagnostic showed ACTIVE, credential present, actor enabled, zero failures and no active block. User then corrected the observation after refresh/restart and provided a screenshot showing signed-in state. Final observation: PASS. No authentication code/credential change made; initial report retained here, not rewritten. |
| Preview privilege/catalog inspection using app role | `idea_ddm_app\|idea_ddm_preview_20261001_26\|7\|f\|f\|f\|t`: 7 successful histories; no DB CREATE, no public CREATE, no history INSERT, history SELECT allowed. Query printed no verifier/password/proof/session value. |
| Independent packaged no-op migrate, 2026-10-01 17:21:09 +07 | `MIGRATIONS_APPLIED=0`; exact preview DB and migrator validated before command. No Maven/build/new artifact. This does not invent an unretained first-run console receipt. |

Status is read-only; Start/Stop use bounded ownership locks. Remote ownership requires PID/start
ticks, executable, working directory and all Java arguments. Local ownership requires PID/start
time, SSH executable and exact saved command line. Foreign port/process conflicts refuse action.
At the 2026-10-01 handoff the Backend was left RUNNING for the user to interact with.
This is not a claim about availability on a later day.

## Exact executed snapshot

These hashes identify source bytes executed before the first launcher commit. There is no claim
that the accepted Server package was rebuilt from this launcher branch.

| File | SHA-256 |
|---|---|
| `IDEA-Dev.cmd` | `A8C6DE961DFD6CF19F02366A7C2018D9F90BCB9BC30E3D119B313EFDE21C2AC5` |
| `tools/backend-dev-access/launcher.ps1` | `1B76654BB6727FC35C3956BE6EB54CF54B19387DFC50D2893B013AD9B1B0F078` |
| `deploy/development/preview/backend.sh` | `BDA29470D76378EBD2B0007E9DE0BEEA441C9FC5577706B4A7F320D084996FDF` |
| `deploy/development/preview/setup.sh` | `2E271DF764CDA1D683464A887B5DDAF26F0467DB777C7BF6D50C12DA1197229C` |
| `deploy/development/preview/bootstrap-preview.sh` | `CBC6D0E3BF76C76F5B53B39FE63A0D8D5970B0A687808CD8CAB0766B511053BD` |
| `deploy/development/preview/create-preview.sql` | `CA89B207A46A68B2136520C7B38453A4268AE2B0CF711667FE33EDB8C6814485` |
| `tests/backend-dev-access/launcher-contract.test.ps1` | `79079CC1B28713CE654D7CEBD47B69E1D2987D313EA08AB34A77FCAD9DF59D36` |
| `tests/backend-dev-access/launcher-runtime.test.ps1` | `D2BE4691E69C2B59253B40374FB8C550B48A31970E3176EE35836CAA21ED83E6` |
| `tests/backend-dev-access/controller-contract.test.sh` | `CD63F1BE3E939CB6B461411B8A75E0EA065CDB0C79AFFBCB54D4A8381285B6B3` |

Uploaded helper hashes matched the local source hashes. The first setup attempt used predecessor
setup script `7D0903AB6367A58BE98EA535B23A4930E12D450AF04872ECF86ECD53DCCA0C3D`;
the successor adds the bounded resume helper. Its wizard library is copied unchanged from the
project template (newline normalization only).

## Limits and remaining qualification

- Actual negative TLS/expired-certificate launcher execution: NOT-RUN. Positive ordinary trust was
  observed; that does not prove the negative case. Remote occupied-port and malformed/reused local
  PID-profile execution also remain NOT-RUN. T010 stays unchecked until these are qualified.
- This run's first sign-in was logged out before restart; old authenticated-cookie rejection is
  not independently rerun here. That invariant belongs to retained F03-B restart qualification;
  this exercise proves fresh sign-in/data retention, not HA/failover/backup/restore.
- Read-only source/privilege/catalog inspections are not a replacement for prior full F03-B tests.
  No F03-B regression was rerun or claimed from this unchanged retained JAR.
- Raw sudo/console-password transcripts are deliberately not captured. The record relies on user
  confirmations, sanitized command results and exact file hashes, not independent raw-log review.
- At the original 2026-10-01 handoff: focused external code review, whole-feature acceptance,
  Swagger, push/PR/integration: NOT-RUN. Successor source review is recorded below.
- `verify-template`: NOT-RUN by user instruction. No commercial/T036/legal/production clearance.
- Main's three local progress files and the prior F03-B worktree's closure documentation were
  preserved. No timer started, no Issue #24 reopen, no PR #25 merge inferred.

## Focused handoff checks

- Final launcher prerequisite/CMD suite rerun: 3/3 PASS, Windows PowerShell 5.1.
- `git diff --cached --check`: PASS for the staged Issue #26 files.
- Bundled PowerShell 7 running `tests/ph1/check-no-secrets.ps1`: PASS on the staged source set;
  10 exact synthetic fixtures recognized, 233 known binary files skipped. This focused scanner is
  not `verify-template`, and its scope is tracked UTF-8 source, not private server configuration.
- Spec Kit implementation hooks: no `.specify/extensions.yml`; none dispatched. US2 and remaining
  US1 negative qualification are incomplete; no whole-feature completion/acceptance asserted.

## 2026-10-02 integration review and bounded configuration repair

User explicitly requested main integration of the launcher. F03-B was already integrated at main
`a5498e2b3558bb02663cc4fab2de8e82d55dfca4`; launcher delivery was committed as
`f6b13dcadfb6b0463c2b822acbe57985d5a45a1a`. Merge `79e8e0573158de70ebf3ba9ccaa795a473aff29d`
brings that main baseline into the feature branch without changing launcher bytes or replacing
main's progress/closure records. This section does not assert a remote publication outcome.

- Standards axis: 0 findings. Spec axis: one conditional P2 configuration-isolation finding,
  repaired and source-reviewed as closed. No product scope or dependency change.
- Finding: inherited Spring overrides could supersede the validated preview database settings.
  Start now rejects Spring/servlet/JVM override families before side effects and after reading
  private runtime configuration, then pins configuration discovery to packaged
  `classpath:/application.properties`. Status/Stop remain usable. Values are never printed.
- Same approved public Start/Status/Stop seam: new environment contract test initially failed
  (Start returned unprovisioned exit 3 rather than override refusal exit 2). Successor GREEN:
  3 groups PASS, including 13 additional override names and unchanged Status/Stop behavior.
  A dotted-name probe also failed before the NUL-delimited environment-name scan repair.
  Executed with installed Git Bash on Windows; this is refusal qualification, not Linux runtime
  or PostgreSQL qualification. No package install/download or private configuration read.
- Repaired source SHA-256: `deploy/development/preview/backend.sh` =
  `05D530136FF618132ECECB8003487914C6F295138C921A0F9AAF00714FC003BD`;
  `tests/backend-dev-access/environment-contract.test.sh` =
  `8C638A8E300FE182C01D8243E592D9D6BE3984C9994F25CE904230D38C9D4D9A`.
  Original executed hashes above remain historical and are not rewritten.
- Windows launcher prerequisite/CMD suite: 3/3 PASS again. Bash syntax check and diff whitespace
  check: PASS. Repaired controller deployment and real Java/HTTPS/PG lifecycle: NOT-RUN; SSH to
  `192.168.137.33` currently fails. No claim that today's Backend is READY or that the remote
  helper already contains this successor repair.
- GitHub publication attempts currently time out; local integration and remote publication
  remain distinct. Issue #26 remains open for Swagger and outstanding US1 qualification.
- Verifier remains NOT-RUN. Skip-CI commit markers respect the user's no-verifier instruction;
  no repository rule/protection override is authorized or used.

## 2026-10-02 deployed successor qualification

The preceding NOT-RUN/connectivity/publication states are historical, not the present disposition.
Main publication was subsequently verified at `1b289e28c29439eeea32bf521e7034426a3ba8b8`.
The resumed run used that committed launcher/controller source. Three additional qualification
helpers below were executed as a worktree snapshot over that commit; exact hashes identify them.
No Server JAR, product source, migration, credential or account grant changed.

1. Verified the remote helper against historical hash `BDA29470...996FDF`, saved it as
   `backend.pre-02683a3.sh`, and installed the inspected successor at mode 700. Deployed hash:
   `05D530136FF618132ECECB8003487914C6F295138C921A0F9AAF00714FC003BD`.
   One status invocation through PowerShell stdin failed INVALID_ACTION because its final argument
   included CRLF. The install/hash had succeeded; a direct SSH invocation reported RUNNING. No
   controller code was changed to conceal that transport failure.
2. Ubuntu environment-refusal suite: 3 groups PASS. Actual Windows lifecycle suite: 5/5 PASS;
   repeated Start retained the owned PID, Stop removed only owned runtime/tunnel, restart reached
   trusted HTTPS process/database UP under the repaired configuration guard.
3. Windows ownership suite: malformed JSON, foreign process and mismatched creation-time profiles
   each refused Start/Status/Stop with exit 2; the fixture process survived every operation. The
   last case simulates PID reuse with a stale timestamp, not forced OS PID reuse. A separate
   temporary LocalAppData tree preserved the developer's real tunnel profile.
4. Ubuntu controller suite: 5/5 PASS again, including actual retained Java Start/Status/Stop.
   Occupied Ubuntu loopback port: Start returned REMOTE_PORT_OCCUPIED/2; did not create runtime
   state, adopt or stop the owned Node listener fixture. Fixture-only cleanup completed.
5. Negative TLS: generated a one-day untrusted self-signed localhost/127.0.0.1 certificate using
   installed keytool; no Windows trust-store or host-clock change. Backed up private runtime
   configuration, temporarily selected that key store and used the actual Windows launcher.
   Start returned TLS_TRUST_FAILED/1, never READY. In `finally`, stopped the owned test runtime,
   restored original configuration byte-identically and removed the fixture private key/files.
   Original certificate expiry was not accelerated or separately executed.
6. Final Start: READY; PROCESS=UP; DATABASE=UP; TLS=VERIFIED, PID 56330 at this observation.
   This is current-run readiness, not a future uptime guarantee. No database was deleted and no
   synthetic identity/credential was reset. Human fresh-login was not repeated today; the original
   accepted-package human exercise above remains applicable to the unchanged JAR.

| New qualification helper | SHA-256 |
|---|---|
| `tests/backend-dev-access/tunnel-ownership.test.ps1` | `BD725EB9B69CB721F072ECE6941AA12BC00B73A08F2390D24FACE5A4F68C9490` |
| `tests/backend-dev-access/remote-port.test.sh` | `D866A378F4BFF531C0C1AA94CCBB97189A5AAB9BFB243610C79CA5569EDE78BB` |
| `tests/backend-dev-access/tls-refusal-fixture.sh` | `38E7010E1B757469203DE56E48E5339471B6DD26E32FB2243B1172D4E0DCE3A0` |

The new helpers qualify previously implemented behavior and were GREEN initially; no artificial
RED or product change is claimed. T010 is satisfied in its approved US1 scope. Swagger intake,
T013 tests/implementation, external whole-feature review and Issue #26 acceptance remain open.

## 2026-10-02 persistent preview convergence to the Swagger allowlist repair

After the focused PR #27 repair was qualified, the persistent developer preview was converged to
the same application generation for final human review. This successor entry is the current package
identity; prior package hashes and observations above remain historical.

- Exact application/test source: `2a74130b88cffe1ee96d28014c7a0ec080d1a199`.
- Deployed JAR SHA-256: `7f0a628d2efd94405ba5f083295c23e6faf0246da86c8dd019f669f69482d53c`.
- The previously owned runtime was stopped with the normal Windows launcher; its verified PID was
  83142. The predecessor JAR/controller were backed up under new names without replacing existing
  backups. The new backend controller pins the repaired JAR SHA-256; its SHA-256 is
  `f7161030d83609a839905fac48b881ffce09b4eabfbac8d3384ad9c92b0ed058`.
- The normal launcher restarted the preview as PID 92389. Start and final Status both reported
  `PROCESS=UP`, `DATABASE=UP`, `TLS=VERIFIED`, `SWAGGER=AVAILABLE` at
  `https://localhost:18444/dev-api/`.
- Focused `launcher-contract.test.ps1`: 3/3 PASS. Focused
  `launcher-documentation.test.ps1 -ExpectedState AVAILABLE`: PASS. No broad lifecycle suite or
  feature suite was rerun.
- Before/after database snapshots matched for synthetic Actor/Account/LoginIdentity IDs and their
  counts, all nine relevant table counts, and Flyway V1–V7 versions/checksums. Private runtime and
  operator config and setup markers matched byte-for-byte. No migration or bootstrap command ran;
  no password or password verifier was read.
- Final human browser sign-in/acceptance is pending. PR #27 remains open and unmerged.

Detailed identity/count/migration snapshot values are in
[swagger-results.md §7](swagger-results.md#7-persistent-preview-convergence-to-the-allowlist-repair).
