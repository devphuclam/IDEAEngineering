# T043 actual Chrome Web qualification — successor

| Control field | Value |
|---|---|
| Stable ID / class | `IE-VER-T043-WEB-BROWSER-20261001` / verification record |
| Version / status / normativity | `0.3` / Draft / INFORMATIVE; client execution, not whole-card/gate acceptance |
| Owner / author / reviewer | Project Reviewer / Codex / internal Standards and Spec review complete; external PASS WITH NOTES received at `24ecdf0c9d5246223837ba1c3b349b3005cb5be4` |
| Baseline / date | PH1 F03-B, Issue #24 / 2026-10-01 +07:00 |
| Upstream | Spec v0.7 FR-005/014; [W01–W10 contract](../contracts/ph1-boundaries.md#t043-web-qualification-contract); [accepted packaging repair](T043-web-packaging-repair-20261001.md) |
| Downstream / disposition | PR #25; accepted W01–W10, T043-Web SATISFIED; historical combined T043 unchecked; Desktop successor, not a F03-B blocker; whole-card acceptance PENDING |
| Change / supersession | Supersedes v0.2 control envelope; append approved delivery-scope reconciliation. Execution and received review history unchanged, including the historical [partial browser record](T043-web-qualification-20261001.md) |
| Classification / retention | INTERNAL; retain sanitized results/source/hashes in Git; no secret values, HAR, trace, storageState or screenshot retained |
| Review trigger / tailoring | Web/Server/tool/browser/TLS/fixture/oracle change; focused verification under repository authoring standard, no conformity or production claim |

## Exact configuration

| Item | Witness |
|---|---|
| Actual Web and Server source | `2fe89d481842f4cf26078c07d4b78fb3bdacd7c4`; exact executable JAR from clean Maven packaging, not a test-only Web page |
| Executed qualification source | `738eb5ae05600b443ad2c107e1352de6dac45def`; `qualify-chrome.mjs`, `run-browser-fixture.sh`, `WebQualificationFixture.java` in `tests/ph1/web-qualification/` |
| Trace | `git diff 2fe89d4..738eb5a -- apps/server apps/web database/migrations` is empty; intervening changes are delivery records and external fixtures only |
| Actual client | Windows 11 Pro 10.0.26200 build 26200; Google Chrome `154.0.8037.92`, headed `channel: chrome`, fresh test context |
| Tooling | Admitted Codex-bundled Playwright/playwright-core `1.62.1`; [intake](../../../docs/research/2026-10-01-t043-browser-tool-intake.md). LICENSE/NOTICE and ThirdPartyNotices hashes rechecked. No package/browser download; runner Node `24.16.0` |
| Application host/build | Ubuntu 26.04.1; Temurin `25.0.4.1+1`; Web built with Node `24.21.0`, npm `11.19.0`; PostgreSQL `18.6` |
| HTTPS | Actual IDEA Server `127.0.0.1:18444`; loopback SSH forward to its owned Ubuntu JVM; also trusted `https://localhost:18444` for host scope |
| Certificate | SAN localhost/127.0.0.1; `CN=IDEA T043 loopback test`; SHA-256 `71D16C7626E9ED97C84EC6167FE8E88CB753BFF5135EE547FB221EB0828D3DE2`; SHA-1 `754395850240E7524360D2AEDDEFA66796BA9BDB`; authorized CurrentUser Root trust rechecked; valid 01/10–08/10/2026. Normal Chrome TLS validation, no bypass |
| Database / roles | Dedicated `idea_ddm_f03a_20260930_c91e7a42`; fresh `t043_web_00b2efe7f8a74cfa9827fe87e4129dfc`; schema owned/migrated V1–V7 by `idea_ddm_migrator`, runtime exactly `idea_ddm_app`. No public/dev/F02/Vault writes |
| Retained result interval | 13:22:47.280–13:22:55.809 on 2026-10-01 +07:00; environment preparation preceded this interval |
| Fixture archive SHA-256 | `59C0F27A1F4B1D52BDD65858412273CA40B0EE27F1DD72EAC94ACCC654978639`; local/server bytes match |
| JAR SHA-256 | `733F93D6AE4A5D9DB42E79EC6E4F60812C89855FD2BB3508EEEF815F98230C22`, rechecked by each fixture invocation |
| Web index / asset SHA-256 | `5F4AB29878C576DDD0DAFF5472457D8CD65B6CE48A48CD7863E5B393C2947E79` / `A34548822CF5CADF32E485F6B302052105407894DFACBE77A9717A3A12BB6552` from the exact accepted JAR |
| Web lockfile SHA-256 | `350E5D24057C55D6ACEF6FB6A71B73948E2711D9279C12E2FE52071B815F611B`, unchanged |

Command from the exact committed Windows worktree:

```text
node tests/ph1/web-qualification/qualify-chrome.mjs C:/Users/TD-999/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright 00b2efe7f8a74cfa9827fe87e4129dfc
```

The remote fixture files were exported from the same commit into a new mode-700
`/home/phuclam/idea-t043-browser-00b2efe7f8a74cfa9827fe87e4129dfc` and syntax-checked.
They use only the qualified JAR's classes/libraries. A random synthetic password exists in
harness RAM/SSH stdin, never command arguments or files/logs. PostgreSQL credentials stay in
the approved private host file/environment. Browser request/cookie values are compared in memory;
only statuses/Booleans are retained. No unsafe automatic failure artifacts are enabled.

## Fixture boundary

All final cases were GREEN for already implemented behavior; no application change or invented
behavioral RED. The clean-package RED/GREEN remains separate. The local fixture bootstraps a
synthetic administrator, assigns Account Administrator v1 explicitly, and creates an ordinary
target through the existing services. Direct migrator credential/ACTIVE seeding establishes only
a **test precondition**, not setup/redemption/lifecycle qualification. W08 invokes the existing
disable owner through a separately authorized local fixture ActorContext; that context never
authenticates the browser. No production test route, JWT or browser-storage bearer was added.

## Actual W01–W10 results

| Case | Chrome/application witness | Result |
|---|---|---|
| W01 | Same-origin actual Server shell and built assets 200; React main renders; anonymous protected GET 401; signed-out UI | PASS |
| W02 | Actual form POST 200 with Server-named CSRF header, then session GET 200. UI Actor equals Server response/fixture. Body/query/header observations contain no authoritative ActorId | PASS |
| W03 | Wrong-password form 401; no authenticated UI; password control/state empty. Exactly one submission during bounded settle observation, no automatic credential retry | PASS |
| W04 | External tool omits login CSRF → 403/signed-out refusal. Invalid logout CSRF → 403/refused UI; does not claim the eligible session ended | PASS |
| W05 | Actual Chrome cookie Secure/HttpOnly/SameSite=Strict; observed login Set-Cookie has these flags and no Domain. JS cannot read it; anonymous proof rotates on successful login. Values not retained | PASS |
| W06 | Actual requests to trusted localhost do not carry the 127.0.0.1 proof; protected GET 401; separate anonymous localhost cookie is not the original proof | PASS |
| W07 | Actual logout 204 → protected GET 401/identity cleared/new CSRF. Reload stays signed out; subsequent actual form sign-in/protected GET succeeds | PASS |
| W08 | Separate synthetic owner fixture disables ordinary target; actual Web reload/session GET 401 and UI clears identity | PASS |
| W09 | Eligible reload → 200/current identity; after logout/invalidation reload → 401/signed out. No stored-password submission/alternate auth mechanism | PASS |
| W10 | Aborted session request on reload → safe connection error/no stale identity; aborted login → safe refusal/empty password. Typed password is not restored after full-page unmount/remount. Completed-submit/remount DOM/URL/storage snapshots and console/page-error observations contain no password/CSRF/session values; session cookie JS-unreadable | PASS |

Negative CSRF/network injection is external tooling on actual Web requests, not application controls.
W10 is an observed control/state, persistence and diagnostics result, not formal JavaScript heap
erasure or browser/OS password-manager qualification. Transient password control/submission is
permitted. Existing Server expiry/reset/throttle matrices are not repeated as client cases.

Sanitized stdout (W04 and W09 each split into two actions):

```text
W01=PASS; W03=PASS; W04-login=PASS; W02=PASS; W05=PASS; W04-logout=PASS
W09-eligible=PASS; W06=PASS; W07=PASS; W10-network=PASS; W08=PASS; W09-invalidated=PASS
csrfHeader=true; cookieAttributes=true; authoritativeActorSent=false; secretLeak=false
CLEANUP=PASS
```

## Artifacts, cleanup and review

Sanitized stdout `.tmp/t043-chrome-738eb5a.log` SHA-256:
`58A055264B54F075ED4D3E2B334C87177A200B077D422C44414D72A2CCB8E71B`.
Host Server log `/home/phuclam/idea-t043-browser-00b2efe7f8a74cfa9827fe87e4129dfc/server.log`,
mode `600 phuclam`, SHA-256 `10C7D78AFACF9B44CC07813E510D7E4247536C8857F6A49461AA30097D9DA022`.
Private raw-log access is not independent GitHub inspection; hashes identify files only.

Cleanup closed its created browser, terminated its SSH forward/exact JVM, then checked schema
name/owner/run marker before dropping only that schema. Post-run: **0** schemas for the three
successful UUID runs and the failed setup attempt; port 18444 not listening; retained public
Flyway version still 3. Synthetic schema data was removed; archives/logs remain for review.
The old fixed-name exploratory schema and unrelated JVMs were untouched.

Preparation history: attempt `e47d12c567bf48ffa7b4392ca1411c10` refused before creating a schema:
the private access file held passwords only, not usernames. This is an environment refusal, not
product RED. The runner now pins both exact role names. Internal review found partial-prepare and
browser-close cleanup risks; `9cae029fd091016787b11320f1877c0f670c1faf` added a creation marker
and isolated teardown catches. Both concerns are closed by source review. That source and the
stronger request-header oracle at `1f115d9f1674e3268f99c012825060ae0fa9156b` each passed the
same Chrome cases in fresh UUID fixtures. Final `738eb5a` only makes environment-key selection/
TLS file reading secret-scanner-friendly, then reruns every case. Scanner findings were variable
references, not committed credentials; scanner rules were not weakened.

Earlier sanitized log hashes: `9cae029` → `2F44450B13153E20C628AE5A403CDD5C0AC0A8CD6CAF91A2619927C84FC151DA`;
`1f115d9` → `02BF7A3189109E38E86A048F952E940B5B785137346199B0F4E9404379661FBF`.
Forced partial-prepare/browser-close error branches are source-reviewed, not separately fault-injected PASS.

**Standards:** zero documented breaches/actionable Fowler smells; two teardown concerns resolved.
**Spec:** zero blocking W-oracle/scope defects; cleanup note resolved; header observation accepted.
These are separate read-only source reviews, not independent execution. External Web review PENDING.

No application code, dependency, policy, lockfile or V1–V7 changed after the accepted packaged source.
Full Server/F03-A/data regressions were NOT-RUN in this browser-only successor; fresh public V4–V7
is NOT-RUN and cannot be replaced by the UUID fixture migration. Desktop and final F03-B
reconciliation remain outstanding. Build-tool exception remains internal T043 only; resolve broader
use before F04/F05/general builds. T043 unchecked, F03-B IN_PROGRESS, Issue #24 OPEN, verifier
NOT-RUN, no merge/Tracker action. No production/HA/recovery/multi-Vault/T036/commercial claim.

## Received external review — 2026-10-01

The Project Reviewer relayed GPT Web **PASS WITH NOTES** for PR #25 at
`24ecdf0c9d5246223837ba1c3b349b3005cb5be4`, comparing the accepted packaging checkpoint,
executed qualification source `738eb5ae` and actual packaged source `2fe89d48`.
The reviewer accepted W01–W10 with **BLOCKER 0, MAJOR 0, MINOR 0**. This supersedes the
pending external disposition above; execution/source/artifact history remains unchanged.
The received text SHA-256 is `323096BEBBF8C5C0217956D52488A65538B813F385A9541EB6A6F90DDC4B3E17`.
It is a user-relayed review, not a GitHub approval event or independent raw-log inspection.

Two reusable-harness hardening notes remain; neither invalidates the final Web run:

| Note | Reviewer observation | Required next-use action / status |
|---|---|---|
| JVM shutdown before schema removal | `run-browser-fixture.sh` sends SIGTERM and waits, but does not assert the owned JVM is dead before dropping the schema. Final execution separately witnessed the closed port and cleanup PASS. | Before reusing this runner, refuse schema cleanup if the verified owned PID remains alive, or force-stop only that PID and assert termination. Source repair/test NOT-RUN. |
| ActorId header-value oracle | `qualify-chrome.mjs` checks header names, body and query, but not all header values against the fixture ActorId. Current actual Web source does not send ActorId. | Strengthen the oracle before next reuse to check header values as well as names/body/query; retain only a Boolean. Source repair/test NOT-RUN. |

Private host log access remains a declared limitation. The reviewer did not request application
Web/Server changes. Next is the separately agreed Desktop seam/test contract, then authorized
implementation and real-client execution. T043 remains unchecked, F03-B IN_PROGRESS,
Issue #24 OPEN, verifier NOT-RUN; no merge or Tracker action.

## Current delivery disposition — 2026-10-01

The Project Reviewer accepted the Web portion of T043 and approved reconciliation with Issue
#24: **T043-Web SATISFIED; Desktop/Workspace binding belongs to a successor Work Item, not a
F03-B blocker**. The previous next-Desktop instructions are historical and are superseded by
the [F03-B closure matrix](F03-B-closure-matrix.md). Exact binding/custody semantics require a
separate agreed seam/test contract after F03-B closes; no Desktop implementation is authorized
here. Keep the original combined T043 marker unchecked.

This adds no execution or change to accepted source/artifacts, W01–W10, review limitations or
the two harness next-use notes. Resolve T044 tooling before fresh isolated public V1–V7 and
affected regression. F03-B IN_PROGRESS, Issue #24 OPEN, verifier NOT-RUN; no merge or Tracker action.
