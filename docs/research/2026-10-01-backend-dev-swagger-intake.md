# Backend Development Swagger Intake

| Field | Value |
|---|---|
| Stable ID / class | `IE-RES-DEVACCESS-SWAGGER-INTAKE-20261001` / external-source inspection and intake |
| Version / status / normativity | `0.3` / Approved for the bounded Engineering use below / INFORMATIVE; no product requirement or commercial clearance |
| Owner / author / reviewer | Engineering / Codex / Project Reviewer Nguyen Huynh Phuc Lam; independent license review NOT-RUN |
| Applicability / evidence date | Issue #26 US2, internal engineering development console / 2026-10-02 |
| Intended use | DEPENDENCY: one unmodified Swagger UI WebJar; COPY-OR-ADAPT: unchanged upstream license/notice texts only |
| Classification / retention | INTERNAL; retain in Git with Issue #26; inspection downloads outside tracked source |
| Upstream / downstream | [Source-intake rule](../agents/external-source-intake.md), primary sources below / [T012–T015](../../specs/006-backend-dev-access/tasks.md), [approved seam](../../specs/006-backend-dev-access/contracts/swagger.md) |
| Change / supersession / trigger | New record, no predecessor; version/graph/hash/terms/use/distribution change reopens intake |
| Evidence / tailoring | Exact-tag pre-use inspection; 2026-10-02 successor runtime graph/notices/package and bounded HTTP/browser qualification PASS below. Tailored research/intake envelope, no conformity claim |
| Current disposition | APPROVED-WITH-OBLIGATIONS for exact Swagger UI 5.32.14 internal development hosting; all springdoc/Swagger Core/validation/Jackson candidates remain REFERENCE-ONLY |

## Primary-source findings

| Claim | Source / observation | Interpretation and limitation |
|---|---|---|
| SWG-01 | [Springdoc parent v3.1.1](https://github.com/springdoc/springdoc-openapi/blob/v3.1.1/pom.xml) pins Boot 4.1.0, Swagger Core 2.2.55 and Swagger UI 5.32.14. The [compatibility guidance](https://springdoc.org/#what-is-the-compatibility-matrix-of-springdoc-openapi-with-spring-boot) describes Boot 4 / springdoc 3 families. | Candidate `org.springdoc:springdoc-openapi-starter-webmvc-ui:3.1.1`; exact IDEA Boot 4.1.1 / Java 25 / Log4j2 qualification remains NOT-RUN. Family support is not execution evidence. |
| SWG-02 | [UI](https://github.com/springdoc/springdoc-openapi/blob/v3.1.1/springdoc-openapi-starter-webmvc-ui/pom.xml), [WebMVC API](https://github.com/springdoc/springdoc-openapi/blob/v3.1.1/springdoc-openapi-starter-webmvc-api/pom.xml) and [common](https://github.com/springdoc/springdoc-openapi/blob/v3.1.1/springdoc-openapi-starter-common/pom.xml) form the starter chain. Common adds Boot starter/validation and Swagger Core Jakarta. | Exclude starter-logging on this path. Optional/provided/test dependencies are not automatically runtime additions. Preserve actual resolved graph before claiming the delta. |
| SWG-03 | [Boot 4.1.1 dependency management](https://github.com/spring-projects/spring-boot/blob/v4.1.1/platform/spring-boot-dependencies/build.gradle) mediates Jackson, validation and WebJars versions; [locator 1.1.4 POM](https://github.com/webjars/webjars-locator-lite/blob/webjars-locator-lite-1.1.4/pom.xml) declares JSpecify. | Consumer mediation matters: upstream-parent versions alone are not the application's resolved versions. Exact transitive inventory is required before use. |
| SWG-04 | [CSRF transformer](https://github.com/springdoc/springdoc-openapi/blob/v3.1.1/springdoc-openapi-starter-common/src/main/java/org/springdoc/ui/AbstractSwaggerIndexTransformer.java) reads a CSRF cookie to attach a header. [Security customizer](https://github.com/springdoc/springdoc-openapi/blob/v3.1.1/springdoc-openapi-starter-common/src/main/java/org/springdoc/core/configuration/SpringDocSecurityConfiguration.java) recognizes a UsernamePasswordAuthenticationFilter login path. | IDEA uses JSON CSRF acquisition, so the built-in cookie convention is insufficient. Explicitly document existing login/logout contracts; no auth or credential-delivery bypass. |

These are directly documented observations; the interpretation column is Engineering inference,
not an upstream guarantee. Candidate source metadata can be inspected in a quarantine directory,
but no candidate class/asset is linked, executed or committed as an application dependency until
the disposition is completed.

## Exact-source rights and pre-use obligations

- Springdoc v3.1.1: [LICENSE](https://github.com/springdoc/springdoc-openapi/blob/v3.1.1/LICENSE)
  Apache-2.0 and [COPYRIGHT](https://github.com/springdoc/springdoc-openapi/blob/v3.1.1/COPYRIGHT).
- Swagger Core v2.2.55: [LICENSE](https://github.com/swagger-api/swagger-core/blob/v2.2.55/LICENSE)
  Apache-2.0 and [NOTICE](https://github.com/swagger-api/swagger-core/blob/v2.2.55/NOTICE).
- Swagger UI v5.32.14: [LICENSE](https://github.com/swagger-api/swagger-ui/blob/v5.32.14/LICENSE)
  Apache-2.0, [NOTICE](https://github.com/swagger-api/swagger-ui/blob/v5.32.14/NOTICE), and bundled
  [JavaScript notices](https://github.com/swagger-api/swagger-ui/blob/v5.32.14/dist/swagger-ui-bundle.js.LICENSE.txt).
  The WebJar has no declared Maven children, but its bundled JavaScript still has notice obligations.
- Locator lite 1.1.4: [LICENSE.md](https://github.com/webjars/webjars-locator-lite/blob/webjars-locator-lite-1.1.4/LICENSE.md)
  MIT. [JSpecify v1.0.1](https://github.com/jspecify/jspecify/blob/v1.0.1/LICENSE) is Apache-2.0.
- Bundled DOMPurify 3.4.13 has an [alternative-license grant](https://github.com/cure53/DOMPurify/blob/3.4.13/LICENSE):
  MPL-2.0 OR Apache-2.0. Engineering proposes the Apache-2.0 option for this internal dependency;
  verify the actual packaged grant/notices before disposition. This is not a claim that all bundled
  JavaScript is Apache-2.0, nor that commercial redistribution is cleared.

Engineering owns retaining the exact archive checksums, license/copyright/NOTICE files and any
required bundled acknowledgements with the Server-served distribution. T036 owns later commercial
SBOM/distribution review. Missing/custom/conflicting terms trigger Legal Review before reuse.
Do not copy upstream implementation into IDEA or use upstream names/logos as IDEA branding.

## Separate build-tool authorization

The [2026-10-02 exception](2026-10-02-devaccess-buildtool-exception.md) authorizes the historical
exact nine-artifact build inventory for Issue #26 only. Preflight on 2026-10-02 matched all nine
JARs and the eight-coordinate plugin descriptor graph; no Maven goal ran. The existing inspection
helper's final line still says F03B_CLOSURE_TOOLING_PREFLIGHT because it is reused unchanged; that
label does not extend the old authority. Current authorization comes solely from the new record.

## Bounded selection and pre-use disposition — 2026-10-02

The primary-source inspection above evaluated the original springdoc candidate. Engineering selects
the smaller `org.webjars:swagger-ui:5.32.14` dependency instead: its published POM declares **zero
Maven dependencies**. Serve its actual Swagger UI against an explicitly authored OpenAPI contract
for the implemented endpoints, including filter-based login/logout. This avoids importing the
springdoc/Swagger Core/validation/Jackson 2 graph for a developer-support console. It changes no
approved authentication, permission or business behavior. Trade-off: the authored contract must be
updated and HTTP-qualified when the supported API changes; no automatic discovery claim is made.

Canonical artifact: [exact Maven Central publication](https://repo.maven.apache.org/maven2/org/webjars/swagger-ui/5.32.14/).
Retrieved on the Windows workstation into ignored `.tmp/swagger-intake-20261002`, not the application
or Maven cache. JAR SHA-256:
`D17CA6B09C60518574C14D4A40318DC58A11EA92A962E94F30E5A286E1EFA4A6`.
The exact POM identifies Apache-2.0; the full upstream license and notice were separately read,
because the WebJar omits the standalone upstream files:

| Material / exact source | SHA-256 / inspected obligations |
|---|---|
| Upstream Swagger UI v5.32.14 LICENSE | `CFC7749B96F63BD31C3C42B5C471BF756814053E847C10F3EB003417BC523D30`; Apache-2.0, preserve license/attributions, patent conditions; no trademark grant |
| Upstream Swagger UI v5.32.14 NOTICE | `0D20D1ADEF18AEE3F40DD258172155521CE702AC445CB5F7B7D60ED32DAD2FB2`; preserve SmartBear notice |
| Packaged `swagger-ui-bundle.js.LICENSE.txt` and `swagger-ui-es-bundle.js.LICENSE.txt` | Both `C07853F3704B510A864EB56561CA4F36E0347FDAEFC5176611C57575E4B5593D`; full embedded notices read, MIT/BSD copyrights and DOMPurify alternative-license notice preserved |
| Packaged `swagger-ui-es-bundle-core.js.LICENSE.txt` | `BF5CC2BED1CCDB8226570E53B495CF514D0344DBC3F8718E59B7EBEC9E0D9280`; embedded MIT notices |
| Packaged `swagger-ui-standalone-preset.js.LICENSE.txt` | `AD43BB2DCE8515F9B917266073E3B3B132C4778ED7190726004CA0E47F24337E`; embedded MIT/BSD notices |

The bundled notices identify classnames, extend, buffer, JSON-Patch, repeat-string, ieee754,
safe-buffer, React/scheduler/use-sync-external-store and DOMPurify. Preserve all original notices
and do not edit/rebundle/minify the third-party JavaScript. The exact DOMPurify 3.4.13 LICENSE
provides the Apache-2.0 option; that option is selected, not a claim of an MPL-only obligation.
MIT/BSD notice obligations remain distinct from the UI's Apache license. No new custom, noncommercial
or required-copyleft term was identified in the material inspected for this bounded internal use.

Engineering's required actions before hosting: retain the unmodified WebJar and all embedded notices;
package the separately pinned upstream Apache LICENSE/NOTICE under `third-party/swagger-ui/`; expose
a readable developer notice link; disable docs/assets by default and qualify actual browser behavior.
Commercial redistribution/SBOM completeness remains under T036, not cleared here.

The other 16 candidate JARs downloaded for inspection were **not** linked, executed, admitted or put
in the application cache. Their checksum observations do not authorize importing them. Maven resolved
graph/package verification and actual-browser qualification remain NOT-RUN; an unexpected new
runtime coordinate or artifact hash change blocks execution and reopens this intake.

## Successor qualification — 2026-10-02

The NOT-RUN statement above describes the pre-use intake checkpoint. Later
[executed evidence](../../specs/006-backend-dev-access/evidence/swagger-results.md) records exactly one
runtime addition matching the admitted WebJar hash, unchanged previous runtime graph, exact packaged
upstream LICENSE/NOTICE and embedded notices, no build-tool runtime leakage, default-off HTTP,
5/5 HTTP tests and 7/7 actual headed Chrome cases. Existing Web and V1–V7 bytes are unchanged.
No new version/graph or commercial/legal disposition is authorized by that result.
