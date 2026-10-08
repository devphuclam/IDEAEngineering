# Nginx development-entry qualification

| Control | Value |
|---|---|
| Stable ID / class / version | IE-VER-NGINX-DEV-49-001 / verification record / 0.1 |
| Status / product normativity | Draft / INFORMATIVE; no new product requirement |
| Repository process authority / instruction state | NOT-APPLICABLE; not a repository policy |
| Owner / author | Project user / Codex, CODEX_ONLY |
| Reviewer / acceptance authority | Agent Standards and Spec review recorded below; independent human acceptance NOT-RUN / Project user |
| Baseline / evidence date | main `7fd542b36a2a0887721b82df5dca323da8809058` / 2026-10-08, Asia/Ho_Chi_Minh |
| Classification / retention | INTERNAL; preserve source lineage, sanitized results, hashes, notices and private on-host diagnostic logs; no database deletion |
| Upstream trace | [Issue #49](https://github.com/devphuclam/IDEAEngineering/issues/49), [intake/recipe](intake.md), TECH-D02/TECH-D05 in [technology views](../../../docs/product/instances/idea-engineering/technology/IDEA-core-v0-technology-architecture-views.md) |
| Downstream trace | [operator guide](README.md), [PR #50](https://github.com/devphuclam/IDEAEngineering/pull/50) |
| Change / supersession | New development qualification; checkpoint failures below preserved. Supersedes / superseded by NOT-APPLICABLE |
| Review trigger | Source behavior, package/tool/library hash, target/ownership, trust, certificate validity or distribution scope changes |
| Evidence status | EXECUTED engineering PASS for the listed seams only; human acceptance NOT-RUN |

This tailored verification envelope applies IE-STD-AUTH-001 information-item and
verification controls. It is STANDARD-GUIDED, not standards conformity, legal
approval, product gate acceptance or production certification. The prospective
intake recipe's initial IN_PROGRESS/NOT-RUN statements are historical planning
state; this record is the current execution disposition.

## 1. Objective, configuration and procedure

Qualify actual browser → Nginx HTTPS → existing packaged Server HTTPS → retained
synthetic PostgreSQL through the Windows owned launcher. Oracle and boundaries
were agreed before implementation in the user conversation and intake recipe.

| Identity | Exact value |
|---|---|
| Final executed deployment/test source | `a040cf21ab99948c55c4f871c63fad398302c8c9` |
| Controlled remote files | Published at `b1de93c43333c04478dbb5cc3e1b4d91ccc3525d`; byte-identical at final executed source |
| Application/Web source | `9d3732cb173e8094195b9bdd60b5588ac3cfa42e` (retained accepted package, not rebuilt) |
| Application JAR SHA-256 | `318a52cf1e658a53bc9fa54137346c15277060667998d2f10f33454d15bb8c1c` |
| Ubuntu deployment / control root | `/home/phuclam/idea-nginx-dev-20261008-49` / `/home/phuclam/idea-nginx-dev-control-49`, private phuclam-owned roots |
| Nginx / backend listeners | Only `127.0.0.1:18448` / `127.0.0.1:18449` |
| Windows entry | Owned SSH forward on `127.0.0.1:18448`; `https://localhost:18448/` |
| Database / schema | `idea_ddm_iam_ui_20261007_46` / `iam_ui_c3b8cde44f9a4d1199306c381c12d1bb` |
| Roles | Existing schema owner `idea_ddm_migrator`; runtime `idea_ddm_app`; no new role/credential |
| Nginx binary | Ubuntu 1.28.3-2ubuntu1.11, SHA-256 `94eb839f1cdc7f3f42062d352b504fe406e2f888d83b554af7ea25bcdc9506f5` |
| JDK / Node | Existing JDK 25.0.4.1+1; admitted Windows Node 24.19.0, exact intake hash |
| Browser / automation | Headed installed Chrome 155.0.8059.39; existing Playwright/playwright-core 1.62.1, no browser/package download |
| TLS | Previously trusted certificate; exact fingerprint and validity in README/intake; dedicated Nginx upstream trust, no TLS bypass or trust-store modification |

Before transfer, all six committed controlled files matched `inputs.sha256`.
Git archive used command-local `core.autocrlf=false`; no global/repository Git
configuration was changed. Local archive and remote archive SHA-256 both equal
`590b97cbe59a6e3fadba8e70669310bb988b92e51099c75fd6cf05eddc728fda`.
Remote `packet-v4` extraction passed **6/6** raw-byte input checks, then bash
syntax checks for control/provision/upstream test scripts passed. Existing JDK
`jar` extracted the ZIP; no missing `unzip` installation was attempted.

Final Windows commands, from the feature worktree, with the pinned Node binary:

```powershell
& 'C:/Users/TD-999/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe' tests/nginx-dev/status.test.mjs
& 'C:/Users/TD-999/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe' tests/nginx-dev/browser.mjs
```

The browser harness reads only the existing mode-600 synthetic fixture in RAM.
It does not retain password, cookie, CSRF, proof, HAR, trace or screenshot values.
Normal Chrome trust and endpoint verification are used. No product mutation,
adoption, role grant, migration, bootstrap, seed or database cleanup is invoked.
Session login/logout writes are the expected existing Server behavior.

## 2. RED, corrected failures and final GREEN

| Source/stage | Actual outcome and disposition |
|---|---|
| Initial Status RED | Authored launcher absent; read-only Status assertion failed. Genuine missing first-party behavior, not a license/certificate prerequisite failure. |
| `3bc0c2b...` Status GREEN | Controlled 5-file export/input checks passed; Status truthfully returned NOT_PROVISIONED; status test PASS. |
| Initial private extraction / TLS export | Exact two packages and rights passed. OpenSSL passin/passout reused a one-line password file and export failed. No listener or database change; original failure retained. |
| `385e5c0...` | Encrypted-key pipe repair qualified export. Start then stopped on package-default fastcgi temp directory; newly owned backend cleaned up. No system directory creation. |
| `184046b...` | All temp directories bounded to private root; actual Nginx/Server Start RUNNING. Browser N01/N02 passed; login observation incomplete, not whole-browser PASS. |
| `b658aa5...` | Real login/context 200; account list 403. Harness incorrectly assumed historical fixture still had account.read. No role/data change was made to satisfy that assumption. |
| `274a814...` | N01–N06 passed with current-authority oracle. N07 wrongly read the `ss` peer wildcard as a LOCAL wildcard listener. Parser failure, not an exposed listener. |
| `b1de93c...` | Control/review repairs and upstream negative harness published. Status PASS; browser stopped at preflight because predecessor dev/forward was already STOPPED, rather than assumed RUNNING. No qualification success claimed. |
| `a040cf2...` | Preserve observed predecessor state, including STOPPED. Final Status **1/1 PASS**; actual browser/proxy qualification **9/9 PASS**, exits 0/0. |

These are distinct source executions, not one aggregated run. Original source,
archives and private diagnostic logs remain retained; no failed checkpoint is
rewritten into PASS. Final source adds no application behavior change.

## 3. Final observed oracle

| Case | Expected / observed outcome | Result |
|---|---|---|
| N01 TLS | Trusted frontend health 200/UP; untrusted client and wrong endpoint refused; certificate fingerprint exact. Negotiated TLSv1.3 / TLS_AES_256_GCM_SHA384 | PASS |
| N02 packaged Web | Actual login form, no Vite injection; anonymous session/docs 401 | PASS |
| N03 identity/cookie/current authority | UI login 200; same retained server-established Actor; context 200. Current account.read absent → list403 + truthful UI refusal. Cookie Secure/HttpOnly/Strict/host-only and JS unreadable | PASS |
| N04 origin/CSRF | Unexpected Host400, cross-origin403, wrong CSRF logout403; valid session still200 | PASS |
| N05 Swagger | Actual UI/allowlisted CSS+bundle200; unknown asset404, direct Swagger WebJar404; Try it out session200 → logout204 → session401 | PASS |
| N06 owned restart | Stop/Status STOPPED → Start READY; old proof401; same synthetic login/credential and Actor succeed after restart | PASS |
| N07 preservation | Exact LOCAL listeners 127.0.0.1 only; predecessor listening addresses/PIDs unchanged; previous dev/forward STOPPED and absent forward-state file remain unchanged; database UP | PASS |
| N08 private state | Password controls cleared; no credential/cookie/CSRF/proof copied into retained DOM/storage/URL/console/error evidence; ordinary logout204 | PASS |
| N09 upstream TLS | Two isolated private config variants on the same owned frontend: wrong verified name502 and untrusted upstream502, with corresponding TLS error reason verified privately. No application success. Restore canonical config → health200/RUNNING; predecessor state unchanged | PASS |

N09 stops/restarts **only the owned Nginx process**, keeps its owned backend
running, and uses the same port rather than a second listener. System CA bundle
is read only for the negative case. EXIT cleanup restores the canonical config.
No error-log content is published. TLS negatives test both browser-facing TLS
and Nginx-to-Server verification, not merely configuration text.

## 4. Postflight, retained evidence and limitations

After the final run: controlled files **6/6**, binary/tool manifest **5/5**,
shared-library manifest **8/8** (including libzstd and dynamic loader), TLS
manifest **2/2**, both package hashes and application JAR hash unchanged.
`ss` confirmed only `127.0.0.1:18448` and `127.0.0.1:18449` for this slice.
Status: `RUNNING;NGINX=UP;SERVER=UP;POSTGRESQL=UP;UPSTREAM_TLS=VERIFIED`.
New entry/forward intentionally remain running for human review.

Sanitized final logs:

| Local retained log | SHA-256 |
|---|---|
| `C:/Users/TD-999/.codex/nginx-dev-49/status-a040cf2.log` | `066a27eee621669d58df7d391e8e7c0bce4e897fe7a48584290a6b6f05997293` |
| `C:/Users/TD-999/.codex/nginx-dev-49/browser-a040cf2.log` | `97d9bab1118f3d6590384213b825592215e8b1ccbf565202ef058753eb323405` |

Hashes identify retained files; they do not make private on-host raw logs
independently readable through GitHub. No independent raw-log review claim.
The data-preservation oracle is same stable Actor and valid existing credential
after owned restart plus bounded launch source; not a byte-for-byte database
backup/restore comparison. Account-list refusal is **not** proof of a new role
grant or account-management mutation through this slice.

Ownership/occupied-port/input-drift error handling is source-reviewed; a complete
fault-injection matrix for every branch is NOT-RUN. No broad resilience claim.
TLSv1.2 is configured but was not negotiated by the successful recorded probe.
Whole Java/Web suites, Maven/package, verifier, production/HA/multi-site,
Gateway byte transfer, fresh-public migration and human acceptance are NOT-RUN
or outside scope. No timer action, deployment to company data or auto merge.

## 5. Two-axis agent review

Standards and Spec review renewal is pending publication of this record.
Their initial findings prompted ownership revalidation, exact certificate pin,
explicit authoring-envelope tailoring, frontend health checks, upstream TLS
negatives and exact predecessor-state preservation. Agent review is separate
from independent human acceptance and does not authorize merge.
