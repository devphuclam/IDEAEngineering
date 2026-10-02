# Development Swagger qualification results

| Control | Value |
|---|---|
| Stable ID / version / status | `IE-VER-DEVACCESS-SWAGGER-001` / `0.1` / Draft |
| Class / normativity | Engineering verification / INFORMATIVE; no product gate or deployment approval |
| Owner / author / reviewer | Engineering / Codex / Project Reviewer Nguyen Huynh Phuc Lam; external whole-feature review and human acceptance NOT-RUN |
| Authority / applicability | User-approved Issue #26 HTTP/browser seam, 2026-10-02; isolated internal preview only |
| Baseline | Application executed/packaged from `daa8c10304db5f61184c285d1735af3d2c0b491d`; preview/harness pins at `fe0288c73695060bb52cf35f9b00f37190c98d19` |
| Evidence date / classification | 2026-10-02, Asia/Bangkok (+07) / INTERNAL |
| Upstream / downstream | [spec](../spec.md), [approved seam](../contracts/swagger.md), [intake](../../../docs/research/2026-10-01-backend-dev-swagger-intake.md) / [tasks](../tasks.md), [human handoff](../quickstart.md) |
| Change / retention / supersession | New record; retain with Issue #26; source/summary in Git, private raw logs on controlled hosts; no historical F03 evidence rewritten |
| Review trigger | API contract, initializer, dependency, package, browser, trust, runtime/data scope or launcher ownership changes |
| Standards tailoring | STD-TEST-001..004 and STD-CM-001, STANDARD-GUIDED verification/configuration trace; no conformity claim |

## 1. Preconditions and exact configuration

- Actual packaged IDEA Server, same-origin React Web and unmodified Swagger UI 5.32.14. Only the
  admitted WebJar was added. Springdoc and the other inspection candidates were not imported.
- Final executable SHA-256:
  `48FE98659DB3C075B771A90FD0F4FC61F79A01C01CC941114DB9A5299A685BDE`.
  The archive of `daa8c103...` supplies Server/Web/V1–V7 source; later changes only pin this
  artifact in preview helpers and the browser harness. They do not change packaged application code.
- Ubuntu: PostgreSQL 18.6, Temurin 25.0.4.1+1, Node.js 24.21.0; Maven 3.9.16 runs offline.
  Every Maven invocation first checked the exact nine build-tool artifacts authorized separately
  by [the Issue #26 exception](../../../docs/research/2026-10-02-devaccess-buildtool-exception.md).
- HTTP tests use real Server/real PostgreSQL, distinct app/migrator roles, and UUID test schemas
  inside the synthetic preview DB. Their loopback HTTP/cookie override is not browser/TLS evidence.
- Browser: installed headed Chrome **154.0.8037.92**, bundled Playwright **1.62.1** after
  [Issue #26-only pre-use admission](../../../docs/research/2026-10-02-devaccess-browser-tool-intake.md).
  No package/browser download, ignore-TLS option, trace, HAR or saved browser-auth state.
- Actual browser HTTPS fixture: `https://localhost:18445/`, independent owned JVM and SSH forward;
  final schema `devaccess_browser_21859a109f674ebdbd74c7c05fff42b6`. Random synthetic credential
  exists only in process memory/stdin. Fixture cleanup stopped the identified JVM before dropping
  its exact owner-marked schema. Company data, public preview identities and Vault were not altered.
- Certificate SHA-256:
  `71D16C7626E9ED97C84EC6167FE8E88CB753BFF5135EE547FB221EB0828D3DE2`,
  ordinary user trust, SAN localhost/127.0.0.1; expiry 2026-10-08 10:58:09 +07.

## 2. RED and repairs retained

| Boundary / initial observation | Repair / successor disposition |
|---|---|
| Default-off documentation returned authentication refusal instead of unavailable | Pre-security default-off boundary returns 404 for documentation/WebJar resources; actual HTTP GREEN |
| Enabled actual UI initially 404 | Application serves its real UI, authored contract and allowlisted assets; HTTP GREEN |
| Swagger definition request omitted `method`, initializer threw on `toUpperCase` | Treat absent method as Fetch's GET; actual UI loaded 11 operations |
| Early sensitive-operation check ran during loading and falsely appeared satisfied | Invalidated that observation; wait for resolved Responses. True RED at `9286706...` showed Try out. Correct wrapper accounts for Swagger's prepended state; final Chrome S03 PASS |
| Login documentation promised 503 not implemented by the sign-in filter | HTTP RED at `04de43c...`; remove the unsupported promise, retain generic 401 and CSRF 403 |
| Proof result omitted `expiresAt`, then marked response `proof` request-only | Actual HTTP REDs; explicit response schema includes sensitive read-only proof and read-only date-time expiry, still documentation-only |
| Anonymous 401 was treated as proof Swagger existed on an old package | Actual old-runtime Windows test RED. Require artifact-generation receipt plus HTTPS probe; legacy generation now UNVERIFIED with no documentation URL |

Harness-only failures were also corrected: distinguish Chrome's empty-401 navigation, await resolved
operation controls, handle wait rejection, select one Responses heading after execution and await
CSRF response observation. These are not application defects. Package qualification initially
failed on a mistyped expected WebJar hash and stale copied notice line endings; correct the literal,
preserve admitted source bytes and rebuild. No different artifact was admitted to hide a mismatch.

## 3. Final executed results

| Command / seam | Oracle and actual outcome |
|---|---|
| `bash tests/backend-dev-access/run-swagger-http-checks.sh <isolated apps/server>` at `daa8c103...` | **5/5 PASS**, zero failure/error/skip: default-off 404; actual authenticated UI/assets/OpenAPI/fields; ordinary session, bad-CSRF 403 without logout, eligible logout 204, subsequent session/docs 401; existing health smoke |
| Offline `mvn -o -B -DskipTests package`, after nine-artifact preflight | BUILD SUCCESS; package identity above. This packaging command does not claim an additional test run |
| `python3 tests/backend-dev-access/check-swagger-package.py <candidate> <retained predecessor>` | PASS: runtime delta exactly one pinned WebJar; previous dependencies byte-identical; Log4j2/no Logback; V1–V7 and actual Web bundle unchanged; exact Apache LICENSE/NOTICE packaged; no build-tool JARs in BOOT-INF/lib |
| Actual `swagger-qualification.mjs` at harness `fe0288c...`, final packaged source `daa8c103...` | **7/7 PASS**, table below; cleanup PASS |
| Windows `launcher-documentation.test.ps1 -ExpectedState UNVERIFIED` before upgrade | PASS on prior running generation; no claimed Swagger link |
| Windows `launcher-documentation.test.ps1` after upgrade | PASS: identified AVAILABLE and actual URL |
| Windows `launcher-runtime.test.ps1` on final package | **6/6 PASS**: trusted HTTPS/PG; identified Swagger address; repeated Start same PID; owned Stop and stopped Status; occupied local port preserved; restart READY |
| Ubuntu `controller-contract.test.sh` with final controller | **6/6 PASS**: unprovisioned/stopped/idempotent/foreign PID; legacy ownership receipt emits UNVERIFIED; real identified Java starts/stops |
| Ubuntu `environment-contract.test.sh` | **3 groups PASS**: database/Spring/servlet/JVM overrides refused without value echo/state creation; Status/Stop remain usable |

| Actual Chrome case | Observed result |
|---|---|
| S01 Anonymous documentation | Browser network 401 |
| S02 Actual Swagger | Server-served UI/assets/definition 200; no cookie-paste Authorize input |
| S03 Sensitive operations | Resolved login/CSRF/proof-issue/proof-redeem operations have no Try out |
| S04 Current session | Swagger Execute returns visible 200 |
| S05 Bad CSRF | Real outbound invalid-header logout returns visible 403; current session still 200 |
| S06 Eligible logout | Automatic current JSON CSRF header; visible 204 |
| S07 After logout | Loaded Swagger Execute shows 401, not success |

At tested checkpoints, password/cookie/CSRF values were absent from DOM text/markup, URL and
local/session storage; cookie was not JavaScript-readable; no observed diagnostic secret or
authoritative outbound ActorId. The harness retains only paths, statuses and booleans. It does
not claim exhaustive constant-time analysis, browser-memory erasure or protection from a hostile
same-user browser. Existing product APIs, not Swagger, remain the authorization/eligibility authority.

## 4. Evidence identity and access limits

| Retained log | SHA-256 |
|---|---|
| Private server `/home/phuclam/idea-devaccess-final-28/http-response-final.log` | `16663BD80F6C5E1F84B7D7B2DD14202A500B05FD33BE326037949B242048C844` |
| Private server `.../package-response-final.log` | `472EB01B5E525B0EF2C78260593A1145DE7037CE6E2660D62A2138DF2B4CCF93` |
| Private server `.../proof-contract-red.log` | `5AD1CC83BA777F7B25036CAD0F8392CCD4846966B185EF56D1EE10066D094309` |
| Private server `.../proof-response-red.log` | `127022494D328B066FF01EE0732F5BEE2804858B404C3CFFC87B51AB9ACBB516` |
| Local ignored `.tmp/swagger-browser-successor-4.log`, true sensitive-Try-out RED | `69969F43BC412AF30AB88BC93432C6E178DFA0F7E352C30D238480FCF751E9E9` |
| Local ignored `.tmp/swagger-browser-last-qualified.log`, final Chrome GREEN | `926BCEEFE95C60C6B53F8400497996861C91288625054BC9982F5C0A257F024A` |
| Local ignored `.tmp/swagger-controller-last-green.log` | `BEE703297A25762D78AB2FA123C3C8FBF0BD953CC34648CBCBEB955D11B9CAE8` |
| Local ignored `.tmp/swagger-upgrade-final.log` | `13C41D5EE51299014276C57B068C2E3DEF893210AA7623F1B1DAB0B3CE400242` |
| Local ignored `.tmp/swagger-launcher-last-green.log` | `2356CE281FA4A5FDDB6624764DCE7CFC54EF429816CA96672C1F2DAC9AA217E8` |

Raw private logs are not independently accessible to a GitHub-only reviewer. Hashes identify the
retained files, not independent inspection of their contents. The source, commands and sanitized
observations above are reviewable in Git; no working credential is published.
Final read-only catalog check found **0** UUID `devaccess_`/`devaccess_browser_` test schemas and no
port-18445 fixture listener. Only the owned persistent preview on port 18444 remains running.

## 4.1. Source review disposition

Standards review at `7c50c5db5981f937bce0013115086f479545b998`: 0 remaining hard violations,
0 actionable baseline smells. Spec recheck at `fe0288c73695060bb52cf35f9b00f37190c98d19`:
0 remaining findings after fixing false documentation availability and issued-proof response fields.
These are agent read-only source reviews, not independent human approval. Later documentation edits
receive a focused source/link/secret check; production code is unchanged after the qualified source.

Final documentation recheck at `84c1372611d412f2cf8f00fccb81304f021a3479`: Spec axis 0 remaining
findings. Author rechecked the small post-Standards schema/test/pin delta and documentation;
`git diff --check`, 35 local Markdown target checks and the tracked UTF-8 secret scan PASS.
The scan recognized 10 exact synthetic fixtures and skipped 233 known binary files; this is not
an exhaustive binary-secret assessment. An additional Standards-agent refresh did not execute
(pending initialization, canceled); the recorded Standards disposition remains the earlier source
review, with subsequent affected changes covered by the stated author/Spec rechecks, not a fabricated
new independent review.

Convergence assessed 12 FR, 5 SC, 7 acceptance scenarios, nine plan decisions and all five core
constitutional principles against the current scoped implementation and evidence: 0 actionable
missing/partial/contradicting/unrequested buildable findings. No empty convergence phase was added.
[PR #27](https://github.com/devphuclam/IDEAEngineering/pull/27) supplies the published read-only
review surface and reviewer instructions. Engineering tasks are complete; acceptance and merge are not.

## 5. Preview handoff and exclusions

Final package installed in the owned preview directory, same DB/configuration and synthetic identity.
Pre/post upgrade checks preserved bootstrap Actor/Account IDs, actor/account/login/assignment counts
and seven migration histories; private configuration bytes unchanged. Previous JAR/controller backups
remain recoverable. No migrations/bootstrap/role assignment ran during upgrade/start.

During initial upgrade readiness, a guarded owned negative-TLS fixture was found active. Readiness
correctly failed; after owned Stop, its exact stored hashes authorized byte-identical restoration and
removal of its temporary key/files. Subsequent ordinary trusted HTTPS returned READY. This does not
rewrite the earlier negative-test record or claim a known cause for the leftover fixture.

Human password-bearing login against the final package is NOT-RUN by the agent; the developer can
fresh sign in using the privately chosen `preview.dev` credential. Automated synthetic sign-in was
qualified above. Whole-feature human acceptance, independent external review and Swagger merge are
separate, NOT-RUN actions. Issue #26 remains open. Verifier NOT-RUN. No Account Management UI,
Desktop/Workspace binding, F04/F05, live proof delivery, company data, production/commercial/T036
clearance, HA, backup/restore or broader F03 regression claim.

## 6. Authenticated direct-WebJar allowlist repair — 2026-10-02

Focused finding: with development documentation enabled, Spring's ordinary WebJar mapping also
served `/webjars/swagger-ui/**`; the earlier boundary returned 404 on that route only when
documentation was disabled. The authored `/dev-api/assets/{file}` allowlist did not constrain this
separate mapping.

The RED test was added and run at source commit
`3e4e97e5ae5dbc80b17ebf570fec5dcde3a015b0`. On an authenticated ordinary session, both authored
asset URLs and the unknown-file refusal passed; direct `/webjars/swagger-ui/5.32.14/swagger-ui.css`
returned 200 where the contract required 404. Six total tests ran: one intended assertion failure,
zero errors and zero skips; disabled-documentation and Server health tests passed. Private RED log:
`/home/phuclam/idea-devaccess-red-web-3e4e/http-red-confirmed.log`, SHA-256
`0431B847EBE7FC44B1B179832E7C708B75834A6987BC02498287E2943B2F1D26`.

Minimal GREEN at application/test commit `2a74130b88cffe1ee96d28014c7a0ec080d1a199` makes the
filter return 404 for `/webjars/swagger-ui` and descendants regardless of the feature flag. Disabled
`/dev-api/**` behavior remains unchanged. An authenticated HTTP regression requires CSS and JS
under `/dev-api/assets/` to return 200, an unknown asset and direct CSS/JS WebJar URLs to return 404.
The existing disabled-documentation test continues to check the direct WebJar route while the flag
is off.

| Affected rerun | Result |
|---|---|
| Real PostgreSQL / HTTP suite, source `2a74130b88cffe1ee96d28014c7a0ec080d1a199` | **6/6 PASS**, zero failures/errors/skips; Maven BUILD SUCCESS. Private log `http-green.log`, SHA-256 `338E24B6FB2E84876670D9AEE9CE8415D1118BE9D06FE5BB443FFE700D0CE23F` |
| Offline Maven package after preflight of the previously authorized nine build-tool JARs | BUILD SUCCESS; no downloads. JAR SHA-256 `7F0A628D2EFD94405BA5F083295C23E6FAF0246DA86C8DD019F669F69482D53C`; private package log SHA-256 `1223C862B5F7F62AE0F9F6D9758BD00B265DB7B36C0CBF886DABA2B4621404BB` |
| Read-only package comparison to the retained pre-Swagger Server JAR | PASS: only the admitted Swagger WebJar runtime addition; existing runtime JARs, migrations and built Web bytes match; notices remain; build tools are absent from the application package |
| Actual HTTPS/headed Chrome 154.0.8037.92 with admitted Playwright 1.62.1; harness commit `bfef8459208fa4706c209feb7f00f33c287223e9`, application JAR from the source above | **7/7 PASS**, owned fixture cleanup PASS. In an authenticated browser, `/dev-api/assets/swagger-ui.css` and `/dev-api/assets/swagger-ui-bundle.js` each returned 200; unknown returned 404; direct `/webjars/swagger-ui/5.32.14/swagger-ui.css` and `swagger-ui-bundle.js` each returned 404. Existing sign-in, bad CSRF, eligible logout and post-logout refusal cases passed. Sanitized runner output is retained in the Codex result; no HAR, trace, screenshot, cookie, password or CSRF value was saved |

The package is an isolated test artifact; this repair did not upgrade the developer's persistent
preview. No dependency/version, session/authentication/CSRF behavior, OpenAPI contract, schema or
business API changed. PR #27 is the review surface for this successor evidence; its current head SHA
is supplied in the PR and this handoff.
