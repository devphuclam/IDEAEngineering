# T043 Web packaging repair

| Field | Value |
|---|---|
| Stable ID / class | `IE-VER-T043-WEB-PACKAGE-20261001` / verification record |
| Version / status | `0.2` / `Draft` |
| Product normativity | `INFORMATIVE`; execution evidence, not product/gate acceptance |
| Owner / author | Project Reviewer / Codex |
| Reviewer / acceptance | External `PASS WITH NOTES` at `82a30adb55482096e421821891734d82ec990351`, relayed by Project Reviewer on 2026-10-01; whole T043/F03-B acceptance `NOT-RUN` |
| Baseline / date | PH1, Issue #24 / 2026-10-01, Asia/Ho_Chi_Minh |
| Source trace | External REQUEST CHANGES at `9090db56fef6602a1898012a5d4f691f108a7310`; [T043 contract](../contracts/ph1-boundaries.md#t043-web-qualification-contract) |
| Downstream | PR #25; T043 remains unchecked; F03-B remains IN_PROGRESS |
| Change / supersession | v0.2 records received external review; execution/source identities are unchanged; does not rewrite [partial browser evidence](T043-web-qualification-20261001.md) |
| Classification / retention | INTERNAL; retain commands, source IDs and sanitized results in Git; host build/log artifacts retained for review |
| Review trigger | Any build, test, Web source, dependency, TLS or environment change |
| Evidence status | Packaging boundary PASS on exact committed archive; browser W01–W10 remain PARTIAL/NOT-RUN |
| Tailoring | Focused build verification; no standards conformity, runtime authentication or commercial clearance claim |

## Finding and repair

The reviewer identified one MAJOR: clean Maven packaging could omit the React application because
the old helper copied Web into an ignored source directory outside Maven's build graph.

The repair binds admitted `exec-maven-plugin:3.6.3` to `generate-resources`. The repository-owned
Node script builds actual `apps/web` into `target/generated-resources/web`; Maven packages that
directory as `static`. Historical copied `src/main/resources/static` is excluded. The script
removes only this project's generated `target/classes/static` after successful Web compilation,
so repeat packaging cannot keep stale hashed assets. Generated files stay ignored.

Missing approved Node 24/bundled npm/locked dependencies fails packaging. No hidden installation,
test-only HTML, application dependency or generated asset commit was added. Exact plugin artifacts,
obligations and the user-authorized internal T043 exception are in the
[pre-execution intake](../../../docs/research/2026-10-01-t043-maven-web-build-intake.md).

## Exact source and environment

| Item | Identity |
|---|---|
| RED committed source | `f50ddad70b9d0989149a332dee8e19d2a35c5cc8`; adds the packaging test to the reviewed predecessor |
| GREEN executed source | `2fe89d481842f4cf26078c07d4b78fb3bdacd7c4` |
| RED Git archive SHA-256 | `8479DB9899BDE555DC69593C90678290A93EA7DA557D6E8B11C3EFD3474FBC0C` |
| GREEN Git archive SHA-256 | `F039E5DF9FB85647FD75E2283FD2B1848D71DDE0174F0251DCDEBA3B558507DA`; local/server bytes match |
| Platform | Ubuntu 26.04.1 LTS, x86-64, Linux 7.0.0-34-generic |
| Tools | Temurin 25.0.4.1+1; Maven wrapper 3.9.16; Node 24.21.0; npm 11.19.0 |
| Web inputs | Unchanged lockfile SHA-256 `350E5D24057C55D6ACEF6FB6A71B73948E2711D9279C12E2FE52071B815F611B`; existing React/TypeScript/Vite graph |
| TLS | Existing test PKCS12, alias `idea-t043`; SAN 127.0.0.1/localhost; certificate SHA-256 `71D16C7626E9ED97C84EC6167FE8E88CB753BFF5135EE547FB221EB0828D3DE2` |

Both source archives were extracted into new directories, not copied from a prepared worktree.
Before GREEN installation/build, `node_modules`, `dist`, Server `target` and copied source `static`
were all absent. Nine admitted plugin/runtime JAR checksums were verified before cache import.
No additional plugin JAR was downloaded by the package run; parent POM metadata was resolved.
This is clean **source/output** execution, not a claim of an empty Maven/npm cache.

Locked dependencies were installed using `npm ci --ignore-scripts --no-audit --no-fund` in the
archive. Linux native tool files were checked before compilation: TypeScript 7.0.2 LICENSE/NOTICE
hashes match the previously inspected files (`A7D00BFD...74654A47`, `F5C708B5...237B66B`); the
existing locked `lightningcss-linux-x64-gnu:1.33.0` carries MPL-2.0 LICENSE SHA-256
`5EBA353FE5076AC3432177F8AB1CF75E3AFCD0584251E37C3BFEAD5F447D040E`.
These are build tools kept outside the application; the existing intake/T036 limits are unchanged.

## Procedures, oracles and actual results

The behavioral test is [check-packaged-web.mjs](../../../tests/ph1/web-qualification/check-packaged-web.mjs).
Its independent oracle is the approved actual-Web integration requirement: the executable JAR must
contain the React root and its hashed assets, then serve those exact bytes through verified HTTPS.
It starts/stops only its own loopback JVM on an allocated port. No DB credentials are loaded;
Flyway startup remains disabled. No migration, sign-in, identity mutation or Vault operation occurs.

| Check | Command / boundary | Actual result |
|---|---|---|
| RED | In RED archive: `JAVA_HOME=/opt/idea/tools/jdk-25.0.4.1+1 ./mvnw -o -DskipTests package`, then Node packaging test | Maven SUCCESS, but test exit 1: `Clean Server package must contain the actual Web index.html`. Behavior RED, not missing tooling/TLS. |
| Clean GREEN package | In GREEN archive: `./mvnw -B -DskipTests -Didea.node.executable=/opt/idea/tools/node-v24.21.0-linux-x64/bin/node package`, with Java 25 | PASS; Maven itself builds real React then packages it; no manual copy/build step |
| Offline repeat + affected Server smoke | `./mvnw -B -o -Dtest=ServerSmokeTest -Didea.node.executable=/opt/idea/tools/node-v24.21.0-linux-x64/bin/node package` | PASS, 2 tests, 0 failures/errors/skips; Web rebuilt in the lifecycle |
| Packaged HTTPS | With existing private TLS environment: `node tests/ph1/web-qualification/check-packaged-web.mjs <exact-built-jar> <test-ca.pem>` | PASS: shell 200, asset 200, both byte-identical to JAR; anonymous protected session 401; TLS verified |
| Existing Web smoke | In archive `apps/web`: `npm test` | PASS, 2 tests; these markup tests do not qualify real browser security |
| Missing Web dependency prerequisite | Second new archive of the same GREEN commit, no `npm ci`: same offline Maven package command | Expected refusal PASS: ENOENT for TypeScript prerequisite, Maven FAILURE, no executable JAR. This is a fail-closed build prerequisite check, not another product RED. |
| Tool packaging | Inspect `jar tf` | Plugin, Resolver, Plexus, Commons Exec and ASM build-tool JARs absent from `BOOT-INF/lib` |

The TLS keystore password was read from the existing restricted fixture file into the child process
environment, never retained in commands/results. The HTTPS client explicitly trusts that certificate
and retains normal certificate/hostname verification; no TLS bypass was used. This is a Node package
boundary, not Chrome cookie/CSRF qualification. No browser version/client PASS is inferred.

Retained sanitized packaging output:

```text
PACKAGED_WEB=PASS; shell=200; assets=1; anonymous_session=401; TLS=VERIFIED
```

## Artifact and log identities

GREEN host root: `/home/phuclam/idea-t043-package-green-2fe89d4`.
Logs have mode 600. Hashes identify retained files; they do not replace independent raw-log access.

| Relative artifact | SHA-256 |
|---|---|
| `apps/server/target/idea-server-0.1.0-SNAPSHOT.jar` | `733F93D6AE4A5D9DB42E79EC6E4F60812C89855FD2BB3508EEEF815F98230C22` |
| `apps/server/target/generated-resources/web/index.html` | `5F4AB29878C576DDD0DAFF5472457D8CD65B6CE48A48CD7863E5B393C2947E79` |
| `apps/server/target/generated-resources/web/assets/index-DJQKxs3r.js` | `A34548822CF5CADF32E485F6B302052105407894DFACBE77A9717A3A12BB6552` |
| `build-online.log` | `12C39E3ECE9A54DD6E0A25377465D380D86644AE23C29356B2A60D4015CBE414` |
| `build-offline-smoke.log` | `E471F73C095A52C459DD74C0BDB1EBF4E4126C612D788D2288EF1C4CC7668028` |
| `packaged-web.log` | `37ED02BDDB95D2813E96EC6606F13813BBC17111D50EA825662DC47652867E2D` |
| `web-tests.log` | `519BC7769763672A985C8114AE427BC72611FA89A557D63EA7266CC64A21C0A1` |
| `npm-ci.log` | `C6B39BFC0A2BE9FD995084195B50FC6459B1CC49175C239DEFEA1B6FFE1D5766` |

RED root `/home/phuclam/idea-t043-package-red-f50ddad`:
`build.log` SHA-256 `3DD659B55D444E5E72DABCAC9F53B92826A776B30BB7F032E9155CB45C098DDC`;
`expected-red.log` SHA-256 `D405AD61B87B84C0ADC57B8249D3694583B16131D841B4645905DF2EB39A47F0`.
Missing-dependency root `/home/phuclam/idea-t043-package-no-web-deps-2fe89d4`:
`expected-refusal.log` SHA-256 `76F21F70FFA1643908C24E531FBCAB7FF8C877F00E4205389A7A60637E9D4889`.

## Disposition and limits

Author verification: the clean-package defect is repaired and its regression passes; external
successor review is still PENDING. Post-execution publication changes documentation only from
the exact GREEN source; source trace must be rechecked at the published head.
Author checks: tracked UTF-8 secret scan PASS; diff whitespace check PASS; new records' local
links and Maven XML parse PASS. Historical F03 evidence sections 1–28 are unchanged; reviewer
checklist markers are untouched and Spec Kit extension hooks are absent.

W01 gains packaging/Server HTTP evidence, **not full actual Chrome W01 PASS**. All browser case
states in the predecessor partial record remain unchanged. Actual Chrome network/cookie/CSRF,
host-scope, invalidation/reload and error/leak qualification still needs its approved UUID-owned
test schema and exact-source run. Desktop, fresh public V4–V7/data regression and final F03-B
reconciliation remain outstanding. The full authentication/identity/data suites were NOT-RUN in
this packaging-only successor; historical executed evidence is not rewritten or called a new run.

No schema, credential, auth policy, migration or Web application behavior changed. F03-B IN_PROGRESS,
Issue #24 OPEN, T043 unchecked, verifier NOT-RUN, no merge, no Tracker/time/progress publication.
No production, HA/failover/recovery, multi-Vault, legal approval or T036/commercial clearance claim.

## Received external review — 2026-10-01

The Project Reviewer relayed **PASS WITH NOTES** for PR #25 head
`82a30adb55482096e421821891734d82ec990351`. The reviewer closed the prior packaging MAJOR and
reported zero new BLOCKER/MAJOR/MINOR findings within this repair. Maven lifecycle integration,
clean-archive RED/GREEN, verified-HTTPS packaged-byte oracle, missing-dependency refusal and
executed-source trace were accepted. From `2fe89d48` to the reviewed head only three delivery
documents changed; application/build/test/dependency/migration content was unchanged.

The remaining note is explicit: the custom-license build-tool exception permits only internal
T043 build/test. Because the plugin runs in the ordinary Maven lifecycle, resolve its intake
scope before F04/F05 or general development use; T036/commercial clearance is not implied.
Private host logs remain unavailable to the external reviewer; recorded hashes are not independent
raw-log inspection. Browser W01–W10, Desktop and fresh-data/full regression obligations are unchanged.
Continue actual Chrome qualification with exact source and a UUID-owned fixture; do not reopen
packaging unless a genuine new defect appears. T043 unchecked, F03-B IN_PROGRESS, Issue #24 OPEN,
verifier NOT-RUN and no merge.
