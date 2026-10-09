# Issue51 — separated Web / Backend qualification

| Control | Value |
|---|---|
| ID / class / version | IE-VEV-DEV-SEPARATE-051 / bounded engineering verification record / 0.1 |
| Date / owner / author | 2026-10-09, Asia/Ho_Chi_Minh / Project user / Codex, CODEX_ONLY |
| Scope / authority | [Issue51](https://github.com/devphuclam/IDEAEngineering/issues/51): independent Backend/Frontend and configurable upstreams; ordinary IAM contract unchanged |
| Status / review | Engineering PASS; human acceptance/merge pending; two-axis read-only review below |
| Classification / retention | INTERNAL, synthetic only; retain prior packets/failures and current controlled roots; no DB deletion |
| Baseline / candidate | `main@43762acb689fac41033ff25fde1d9227367de796`; [Draft PR52](https://github.com/devphuclam/IDEAEngineering/pull/52) |
| Execution source | Backend package `31bf7d67bd1b3fa0b3a07a2ffe8001d6d41f4687`; final launcher/config/browser `1f36e21f9e9a4ee4b2fccf1e6c468b2f34b0f3f8` |
| Trace / reopen trigger | [recipe](README.md), authored tests under `tests/dev-access`; requalify affected source/upstream/tool/TLS/data changes |

## Outcome and limits

The actual Windows checkout supplies Web source through Vite. Browser HTTPS and
HMR/WSS pass through Ubuntu Nginx; APIs still reach the retained real Server and
PostgreSQL. Frontend stop/restart does not stop Backend or invalidate its current
session. A missing Vite upstream returns502, not the predecessor bundled UI.

Web and Backend build independently. The new `backend-only` profile packages
without a Web directory or resources; the default bundled package is preserved.
This qualification does not replace the retained Server JAR or deploy new business
code. Relative browser APIs and configurable, verified edge upstreams preserve
the original ordinary HttpOnly session/CSRF/RBAC contract.

Actual topology qualified: Windows Web source + Ubuntu edge/Backend. Arbitrary
externally hosted HTTPS Web/Backend selection has source/configuration/unit
evidence, not an executed remote-fleet or multi-site qualification. No direct
cross-origin browser API, HA, SSO, replication, production TLS or Gateway claim.

## Executed checks

| Check | Exact source / result | Oracle |
|---|---|---|
| Full dev-access Node suite | final config source `1f36e21...`,7/7 PASS | independent upstreams, explicit routing, malformed/raw-control refusal, source selection and denied synthetic `.env`, safe cross-drive/junction build output |
| Windows lifecycle suite | launcher source unchanged from `a1c682f...`,6/6 PASS | stale generation refused; unreachable SSH still attempts local cleanup; external Backend never locally started; failed readiness rolls back new edge/forward; native Windows atomic state replacement |
| Standalone Web build | build source `ebfbf94...`, repeated on `31bf7d6...`: PASS | TypeScript noEmit + cached Vite8.3.1;40 modules; static `dist`; React/ReactDOM/scheduler3 notices with pinned license bytes |
| Backend-only package | `31bf7d6...`: PASS | fresh exported source, no `apps/web`, offline Maven profile; executable JAR,0 static Web resources,57 runtime JAR hashes equal retained predecessor; JSR305 not selected |
| Actual headed Chrome | `a1c682f...`:9/9 PASS; repeated on final source `1f36e21...`:9/9 PASS | actual edited primary Windows checkout, trusted HTTPS, real Server/session/CSRF/Swagger, ownership and cleanup |
| Current packet integrity | final source renderer: PASS | six files, exact same manifest hash as executed root04; Bash syntax PASS |
| Diff / repository hygiene | PASS | no application Java, migrations, dependency/lock versions or user UI changes introduced |
| Full PH1/Feature009 business regression | NOT-RUN | business implementation unchanged; focused entry/build/browser checks are the affected seam |
| `verify-template` | NOT-RUN | not requested and not implied by engineering checks |

Commands, using the admitted Node binary explicitly:

```text
node --test tests/dev-access/*.test.mjs
powershell -NoProfile -File tests/dev-access/lifecycle.test.ps1
node apps/web/scripts/build.mjs
bash tests/dev-access/package.sh
node tests/dev-access/browser.mjs C:/Users/TD-999/Research/Projects/IDEA/IDEAEngineering/apps/web
```

The package script executes only offline cached Maven3.9.16 with Java25.0.4.1:
`mvn -o -B -X -s <controlled-settings> -gs <controlled-settings>
-Dmaven.repo.local=/home/phuclam/.m2/repository -Dmaven.test.skip=true
-Pbackend-only package`. No dependency acquisition, Web build, DB fixture,
migration, bootstrap or runtime launch occurs during this package check.

### Browser oracles

| ID | Observed PASS boundary |
|---|---|
| D01 | actual local Web over normally trusted HTTPS; anonymous session401 |
| D02 | owned synthetic module changed A→B in primary checkout, updated through `wss://localhost:18448/__vite_hmr`; probe removed |
| D03 | actual UI sign-in200, stable Server Actor; Secure/HttpOnly/Strict cookie; bad CSRF403 and session remains200 |
| D04 | actual Swagger; authored assets200, unknown/direct-WebJar404; Swagger logout204 then session401 |
| D05 | Frontend stop leaves Backend PID/start identity and endpoint intact; restart preserves eligible session; obsolete cleanup cannot stop successor |
| D06 | owned Vite/reverse interruption returns UI502 while API session200; no bundled fallback |
| D07 | explicitly selected review mode serves retained qualified package without Vite |
| D08 | user-edited UI file hashes and predecessor socket/PIDs unchanged; no observed secret in retained DOM/storage/URL/console |
| D09 | owned shutdown; no18448/18449/18450 listener; retained DB and unrelated predecessor processes untouched |

## Exact artifacts and retention

- Current owned root: `/home/phuclam/idea-dev-access-20261009-51-04`, ownerphuclam:700.
- Executed six-file packet `inputs.sha256` hash:
  `72657bd29e8dda8f8092ac31823dc3c87ce3af2da952d2b893edfa4b29508517`.
- Exact Git archive transfer hash for Backend-only source:
  `fe617a688b4d5f2ef81b98217f514a66f19b74ca4d25cbd9f67bbc11cc84800d`.
  Remote archive matches; extracted source manifest checked before/after package.
- Backend-only build JAR hash:
  `d7e337a1a741669e8f5be7db843cfa6901a84b0d9373321427fa29531a45934f`.
  This build artifact is NOT the persistent running Server.
- Retained running Server source/JAR stays `9d3732cb173e8094195b9bdd60b5588ac3cfa42e` /
  `318a52cf1e658a53bc9fa54137346c15277060667998d2f10f33454d15bb8c1c`.
- DB/schema remains `idea_ddm_iam_ui_20261007_46` /
  `iam_ui_c3b8cde44f9a4d1199306c381c12d1bb`; runtime `idea_ddm_app`, owner
  `idea_ddm_migrator`. Actual login establishes the retained synthetic Actor.
  Existing authority/refusals remain unchanged; no reseed or role grant.
- Private Maven debug log hash:
  `5a704cfc1ee1cebaaf6c7eb2ec979d5247d421ddef3cb16763cf6a9b5403d314`.
  Before/after source-check log hashes both:
  `fc48b5d989974c36e63d57f2aba2576b70b7be12fc814a3cc86e3ce70f4126a4`.
  Private host log access is not independent public raw-log review; hash is identity,
  not a substitute for reading its content.
- Final sanitized browser ledger on Windows:
  `C:/Users/TD-999/.codex/idea-dev-access-51/browser-final.log`, SHA256
  `bf842f9933b666a3bbdeefc316fe090ecd224633b9ae3c518060e6835cab13cf`.
  Only bounded PASS identifiers/counts are retained, not password/cookie/token/HAR.
- Tool and TLS pins remain those in the recipe; no download/install, system trust
  change, license-intake expansion or company data. Synthetic credentials only
  read privately in harness RAM, never committed or printed. No HAR/trace retained.

## Failures and source lineage — not rewritten as PASS

1. Initial focused RED showed the missing new topology seam. The existing
   snapshot limitation is a source-level observation, not an invented runtime RED.
2. Root01 (`e72a9bb...`) started the independent Backend but Nginx configuration
   failed because distro-default FastCGI temp paths attempted `/var/lib/nginx`.
   Local new resources were cleaned; Backend separately stopped. No ready claim.
3. `12ddb5d...` pins all five temporary paths to an owned root; root02 actual
   local Web/HTTPS entry started PASS, then stopped through its owned launcher.
4. `ebfbf94...` repairs reviewed output containment, generation-safe cleanup,
   local cleanup after SSH failure, startup rollback and external endpoint health.
   `45ed397...` corrects a browser oracle to probe Backend directly while edge is
   stopped; `31bf7d6...` matches Web CA preflight and external-host selection.
5. Root03 was transferred but never executed; preserved unchanged. Root04 is
   fresh. Its Backend-only build passed under `31bf7d6...`.
6. Launcher execution exposed Windows PowerShell null-backup replacement failure.
   `7f5c8bb...` repairs atomic state replacement and adds the real Windows6th
   lifecycle check. Node-launched PowerShell then exposed inherited module search
   mismatch; `a1c682f...` explicitly selects installed host-native modules, without
   changing global/user paths. Browser9/9 passed on that source.
7. Standards review found URL-parser normalization could admit raw controls into
   generated shell settings. `1f36e21...` rejects original controls/non-string
   values before parsing and requires canonical origins. Focused suite7/7 passed;
   generated current packet remains byte-identical to root04.
   Final source Chrome qualification repeated9/9 PASS; cleanup passed again.

## Two-axis review

Standards: prior ownership/output/configuration findings repaired; read-only
successor review at `1f36e21...` reports0 remaining findings. Spec: read-only
review at `a1c682f...` reports0 missing/wrong/scope-creep requirements; its explicit
remote-host qualification limitation is retained above. Neither report is a
GitHub human approval or production acceptance. No merge is performed here.
