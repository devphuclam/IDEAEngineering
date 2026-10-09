# Current Swagger documentation convergence

| Control | Value |
|---|---|
| ID / version / status | IE-DEV-API-DOCS-053-20261009 / 0.1 / Draft |
| Scope / authority | Issue #53 / PR #55; user authorizes bringing complete shared-source documentation into the existing dev Swagger on 2026-10-09 |
| Owner / author / review | Project user / primary engineering worker / human acceptance NOT-RUN |
| Normativity / classification | Informative engineering packet; INTERNAL; no new product API or authority |
| Baseline / retention | Existing dev topology and exact retained package below; preserve predecessor package, controls and evidence |
| Review trigger | Source, package, tool, TLS, listener, ownership, data target or rights drift |
| Tailoring | Grouped verification/configuration control; no standards conformity or production qualification claim |

## Published procedure and oracles

1. `node tools/contract-exporter/export.mjs --update` validates controlled Server/Gateway sources and produces the original three formats plus the generated Swagger resource. `--check` refuses drift without writes.
2. Freeze the exact commit and LF-byte inputs. Transfer the resource, JDK package probe and shell procedure to fresh owned `/home/phuclam/idea-api-docs-20261009-53-01`; require archive/input hash identity, directory700, files600. No reuse of an existing candidate root.
3. Run `bash /home/phuclam/idea-api-docs-20261009-53-01/package-documentation.sh` using the published source, without Maven. The existing admitted JDK `jar` updates only `BOOT-INF/classes/dev-access/openapi.json` in a fresh copy of the accepted JAR. The Java source-launcher runs only the package qualification probe, not product source compilation.
4. Package oracle: all non-directory entries except that exact resource have identical uncompressed hashes, including classes, nested runtime libraries, manifest, migration and notices. Duplicate ZIP entries, changed/missing/extra payload or document mismatch is FAIL. Freeze resulting JAR SHA-256 before adoption.
5. Controlled adoption: back up the six existing launcher-packet files and manifest under the fresh owned root; stop only the owned Backend using its predecessor controller. Publish candidate artifact path/hash + source identity in the launcher packet, rehash that packet, install those exact controls, and start through the existing owned Backend boundary. Keep Nginx/dev Frontend/SSH entry, config, DB, roles and synthetic identities. If start fails, stop only the new owned process, restore saved controls and restart the old package; never force-kill an unknown process.
6. Before/after startup compare a private metadata snapshot of Actor/Account/Login identity + credential-presence state (no password/verifier/proof). Then use the existing synthetic fixture via private RAM-only handoff to prove the same Actor/credential still signs in.
7. Headed Chrome at `https://localhost:18448/dev-api/`: trusted HTTPS, anonymous401, 46 operations/eight groups, exact served document hash, permission/state/atomicity/retry descriptions, Gateway and sensitive/admin documentation-only Try-out restrictions, asset allowlist, GET session200, bad-CSRF403, Swagger logout204 then session401. No credential/cookie/token output, HAR, trace, storageState or TLS bypass.

## Exact unchanged inputs

- Product source lineage: `9d3732cb173e8094195b9bdd60b5588ac3cfa42e`; documentation successor is separately pinned, not misrepresented as recompiled application code.
- Predecessor JAR: `/home/phuclam/idea-iam-ui-20261007-46/run-assignment-qualification-44/source/apps/server/target/idea-server-0.1.0-SNAPSHOT.jar`, SHA-256 `318a52cf1e658a53bc9fa54137346c15277060667998d2f10f33454d15bb8c1c`.
- Java `25.0.4.1+1`, `/opt/idea/tools/jdk-25.0.4.1+1/bin/java`, SHA-256 `7380ce48ed5013735d2c8414db54adb8f981e7933ff594bd36f3baccddaafba3`.
- Existing JDK jar SHA-256 `033a730b1e74f26f7345ec4754bd6fa8a0d075973475d18695b386da516738b2`; existing input notices/rights retained. No new external graph or distribution.
- Windows Node24.19.0 SHA-256 `3602f2bb1a10f2cbab4c36886218a33c1ab3db87290e73b033c46c77147d0237`.
- Installed Chrome155.0.8059.39 SHA-256 `d3784ffbf1f6109348416064b3e4cd739b06fa61d89a81b262c780df9f32270c`; previously admitted Playwright/core1.62.1; licenses/notices rechecked by harness.
- Existing loopback Nginx18448 / Server18449, retained TLS fingerprint `6cee40386182902343aeb0ad6db1110656b1c293dcc3c33fbc3fe32251d965ad`; no new certificate/trust-store or port.
- Test DB `idea_ddm_iam_ui_20261007_46`, schema `iam_ui_c3b8cde44f9a4d1199306c381c12d1bb`; migrator owner, app runtime. No migration, bootstrap, reseed, proof issuance, credential reset or company data.

## Stop and limits

STOP on mismatched input/tool/package/source, unknown process, occupied target, TLS/trust failure, wrong data boundary or unavailable permitted dependency. Do not download/install, widen listeners, change auth/session/CSRF/RBAC, hide a failed check or manufacture a new API. No full feature suite, verifier or automatic merge.

Gateway routes in the combined Swagger are documentation-only descriptions of a separate Grant-authorized data plane, not Server handlers or Server-session authorization. CPD DESIGN cards remain in the document catalogue, not fabricated HTTP operations. Actual outcomes follow in a separate successor result record.
