# API exporter restart verification

| Control | Value |
|---|---|
| ID / version / status | `IE-VER-API-EXPORTER-RESTART-20261009` / `0.2` / Draft |
| Class / authority | Engineering verification; informative, no product requirement or acceptance decision |
| Scope / owner | Work Item #53; repository maintainers |
| Author / review | Primary engineering worker; two-axis engineering review completed; independent human acceptance `NOT-RUN` |
| Date / classification | 2026-10-09, `Asia/Ho_Chi_Minh`; INTERNAL |
| Baseline | `main@91cf6c25e516ce2b3ae628d59c2a20b90076bcff` |
| Current executed source | `9010545027f653fc66bf4cdd0ec98471984d51be` |
| Historical exporter source | `8d62d5cdc45eab079e036e75c0a295773b05a2e7`; historical result below preserved |
| Change / supersession | Fresh restart requested by user; predecessor PR #54 retained as historical, not the current candidate |
| Retention / review trigger | Retain with #53; recheck changed source, contract, renderer, runtime or dependency |
| Evidence / tailoring | Actual focused tool execution; grouped control envelope, no standards-conformity claim |

## Current result — shared-source Swagger and dev adoption

User authorized this successor after observing incomplete Swagger. Canonical Server/Gateway contracts now feed both the original Word/Excel/HTML exporter and the generated Swagger resource. No business endpoint, Java, migration, runtime library, dependency graph, session/CSRF/RBAC or Frontend behavior changed.

At the current executed source:

- Exporter tests **43/43 PASS**, launcher/topology tests **5/5 PASS**, headed Chrome **7/7 PASS**; zero failures/cancelled/skipped in the final runs. These are focused documentation/integration checks, not a whole-feature regression.
- `--update`, read-only `--check`, repeat `--update`: PASS; 46 HTTP operations, 55 catalogue entries. First export retained a new sequential snapshot; the repeat preserved it without duplication. All three original output formats regenerated, with no AI attribution.
- Live Swagger at `https://localhost:18448/dev-api/` shows **46 operations / eight groups** and the exact generated resource hash. It exposes descriptions and schemas without unlocking documentation-only administration, credentials or Gateway submission. Nine CPD DESIGN cards are not invented HTTP routes.
- Ordinary synthetic sign-in retained the same Actor; session Try it out returned200, bad-CSRF logout403, valid Swagger logout204 then session401. Allowlisted assets200, unknown/direct Swagger WebJar404; normal TLS, no credential/token/cookie retained.
- Existing Backend was stopped/restarted through its owned controller. Before/after Actor/Account/Login metadata and credential-presence snapshots were byte-identical; Nginx edge state unchanged; primary checkout Frontend/HMR and SSH entry remain UP. PostgreSQL UP; no migration/bootstrap/reseed/reset.

| Artifact identity | Exact value |
|---|---|
| Unchanged application lineage | `9d3732cb173e8094195b9bdd60b5588ac3cfa42e` |
| Documentation source | `ca310947ebc2115bf166a2688952c1f6ecaeb126` |
| Deployed JAR | `/home/phuclam/idea-api-docs-20261009-53-01/idea-server-documentation.jar` |
| Deployed JAR SHA-256 | `103b5bc8fa628f7a83e56dfa3393e24b7f29d3d9c7f7e201dc344385da2e0a44` |
| Served OpenAPI SHA-256, exact LF bytes | `b1472c764ac8f06933ffbe595f676641bb35b458bcd4af3572ad313978edcc42` |
| Adopted controller source | `675eb88c8aa23370561744fb896adac0748fcbc4` |

Package qualification compared every non-directory ZIP entry: **379 unchanged non-documentation entries**, including **276 classes and 57 runtime libraries**. Only `BOOT-INF/classes/dev-access/openapi.json` changed. No application recompilation/Maven execution; original package, backed-up controls, archives and private metadata snapshots retained. This is resource-only dev convergence, not a claim that application code was rebuilt from the documentation commit.

RED lineage is preserved: predecessor Swagger projection had44 instead of46 operations; actual live predecessor Chrome passed trust/sign-in then failed complete-document coverage (old11-operation document). After adoption a first-party browser selector failed S04; `9010545` corrected the selector to the actual path element, without product/oracle change, then all seven cases passed. Review also found a pre-adoption recovery gap; `675eb88` added owned recovery through all adoption checks before execution. Recovery is source-reviewed, not fault-injection qualified.

See the [published procedure](../../tests/dev-access/swagger-current-packet.md) and [retained successor execution record](evidence/20261009-swagger-current.txt). Existing qualified JDK25.0.4.1+1, Node24.19.0, Chrome155.0.8059.39 and Playwright/core1.62.1 used; no new source rights, dependency, download/install, trust store or listener.

Successor execution record SHA-256 (committed LF bytes): `d9e982b9e83ad1a519c411af70f27896ae21096720ccc67825b38fe4468d5de3`.

Final postflight rechecked the package inputs, installer/candidate controls, adopted controls, JAR and JDK binaries: unchanged; identity snapshots still compare equal. Ten relative documentation links and `git diff --check` passed. Two-axis engineering review found no remaining actionable issue after the recovery and browser-helper repairs; this does not constitute independent human acceptance.

Current limits: independent human acceptance and rendered Word layout **NOT-RUN**. Private host snapshots are not available through GitHub; byte-identity assertions do not replace independent raw-file access. No full application regression, production/multi-host/Gateway transfer qualification or verifier. Draft PR #55 / Issue #53 remain open; no merge. Primary worktree user edits untouched.

## Historical result — exporter-only checkpoint

- Original Word/Excel/HTML exporter and layouts retained; inputs cover 46 actual HTTP operations and nine CPD DESIGN cards.
- Metadata, responsible person, editorial Vietnamese text, workflows and history retained. Technical fields come from controlled sources.
- Concise direct-field/model references; retry appears once per operation. No fabricated DESIGN wire details.
- Output content and Word/Excel core metadata contain no listed AI names. Source attribution with such a name fails before catalog/output writes.
- Source checks reject missing/stale/unreviewed routes and invalid supported schemas. A new synthetic route first fails, then appears in all three formats only after a complete reviewed contract is supplied.
- Two source-semantic review findings were repaired: login/logout retry is not read-only replay; credential-proof stale/ineligible-target refusal is 403, not an invented 409. Targeted tests: RED 0/2, then GREEN 2/2.
- Two-axis engineering review: spec findings closed; no actionable standards finding. This is not Project Reviewer acceptance.

## Historical exact execution

Approved existing Windows Node `24.19.0`, SHA-256
`3602f2bb1a10f2cbab4c36886218a33c1ab3db87290e73b033c46c77147d0237`.
Renderer dependencies use the unchanged admitted lockfile/cache; no download or install.

Working directory: `tools/contract-exporter` in the fresh `codex/api-contract-restart` worktree.
Each command below used the approved binary's full absolute path, not PATH selection.

```text
node --test contract.test.mjs render.test.mjs restart.test.mjs
node export.mjs --update
node export.mjs --check
node export.mjs --update
```

| Oracle | Actual result |
|---|---|
| Focused tests | 41/41 PASS; failures/cancelled/skipped 0; 17.1794455 seconds |
| Source/contract check | PASS; 46 routes / 46 HTTP operations |
| Default exports | Word, Excel and HTML generated; 55 entries, v1.2 |
| Same-source repeat | 0 changed / 0 new; no duplicate entries/revision/archive; previous snapshots preserved |
| Final tracked tree | Clean after exact-source execution |

[Retained command output](evidence/20261009-restart-node-test.txt), SHA-256 of committed LF bytes:
`ce5e59503cb54402aee9b7fa34ad584b2de8bf3793217972afa612147a42207e`.
Earlier 39/39 at `c5cf33b` and predecessor executions are historical, not combined with this run.

## Historical limits and handoff

Rendered Word page/layout inspection is `NOT-RUN`: the bundled runtime has no available Word renderer. Content/OOXML checks do not prove visual layout. Word remains an unqualified-layout preview, not a layout-approved final handoff.

Maven, PostgreSQL, application runtime, browser product qualification, deployment and verifier are `NOT-RUN`; not needed for this source/export-tool increment. No Java, business API, schema, migration, dependency graph, deployment or CI changes. The scanner and schema checks are bounded, not universal framework introspection or a full OpenAPI certification.

Next: Project Reviewer checks the fresh Draft PR and generated samples. No merge or Issue closure authorized by this record. The main worktree's unrelated UI/catalog edits remain untouched.
