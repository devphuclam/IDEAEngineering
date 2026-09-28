# PH1 F01 Dependency Intake

| Control field | Value |
|---|---|
| Stable Research ID | `IE-RES-PH1-F01-DEP-001` |
| Document class / title | `RESEARCH-NOTE` / PH1 F01 Dependency Intake |
| Version / status | `0.6` / `Draft` |
| Product normativity | `INFORMATIVE` — records source/license evidence; does not change Feature, Tech or product scope |
| Repository process authority / instruction state | `NOT-APPLICABLE` / `NOT-APPLICABLE` |
| Owner / author | Engineering / repository maintainer |
| Reviewer / acceptance authority | Project Reviewer / Product Decision Authority acceptance `NOT-RUN` |
| Evidence date | 2026-09-28 (Asia/Ho_Chi_Minh) |
| Applicable baseline | PG4-authorized `IE-INC-PH1-FOUNDATION-CUSTODY-001`, F01-A; selected Java 25, React 19.3, TypeScript 7, Vite 8.3, WPF/WebView2 and .NET 10 families |
| Intended use | `DEPENDENCY` for internal development/build/test only; no customer packaging, redistribution or commercial-use approval |
| Upstream trace | F01-A/T002; `TECH-001`; P04 Ubuntu runtime intake; PH1 plan and external-source intake procedure |
| Downstream trace | F01-A/T003–T012; F01-B/T013; PH1/T036 dependency/license review |
| Change / Work Item trace | GitHub Issue #12, F01-A; source commit recorded in `evidence/F01-A-source-and-scope.md` |
| Classification / retention | `INTERNAL`; retain while these dependency versions are used and with later dependency inventory/SBOM |
| Evidence status | npm lock graph resolved and screened; all four approved foundation smoke/build checks passed from clean platform-specific archives of source commit `c600f7be41f0732cb57d521017bae0565ab229bd`. Exact NuGet transitive license/notice evidence remains incomplete although Windows package restore already ran; T002 therefore remains open. Commercial distribution review is `BLOCKED-LEGAL` until separately completed. |
| Control tailoring | Research note, not a product decision: no effective product date or requirement acceptance. Source evidence and intended-use limits are recorded here; package-level license/notice gaps remain explicit rather than inferred as cleared. |
| Supersession / review trigger | Supersedes this note's `0.5` revision; no successor identified. Re-review on exact package/version, source/license, resolved graph, packaging model or intended-use change, and before F01-A closure. |

## 1. Disposition

**Direct-package disposition: `APPROVED-WITH-OBLIGATIONS` for internal F01 development only.**
This is not a completed disposition for the full resolved dependency graph or T002. The initial
Windows restore used NuGet transitive packages before their exact license/notice evidence was
retained; record this as an order-of-work deviation. Do not infer that the successful build or
package metadata cured that gap. The versions below are pinned to named upstream publishers;
license expressions and known notice obligations are recorded here. Keep required notices with
any copy of the corresponding package or runtime. Do not bundle these development tools or
runtimes in a customer package under this record. No commercial package or distribution model is
approved by this intake.

The npm lock graph is pinned in `apps/web/package-lock.json` (SHA-256
`1C011F5EBFEA15E039E236B4713C3ED7E0B1657A654A95887B3B13D0C84B803D`): 88 exact package
versions, all resolved from `registry.npmjs.org` with lockfile integrity values. A read-only
screen of each exact registry version's declared license metadata found 51 MIT, 23 Apache-2.0,
12 MPL-2.0, one ISC and one BSD-3-Clause package; none had missing license metadata or a
non-registry tarball. The 12 MPL-2.0 entries are `lightningcss@1.33.0` and its 11
platform-specific packages. They are part of the Web build-tool dependency graph, not the
produced application runtime. Keep them out of customer runtime bundles; if the build tools or
their binaries are later redistributed, review MPL source/notice obligations for that exact
distribution. This metadata screen is not a substitute for T013/T036 review of actual package
notices, optional-platform inclusion, or any future distribution bundle.

The Maven project dependency graph resolved to 75 exact packages (46 compile/runtime and 29 test)
with Spring Boot 4.1.1, Spring Modulith 2.1.1 and Java 25. The captured Maven dependency-tree JSON
has SHA-256 `c36f53c13aacaa18caea5026b53295ecda230bc9170da325412aa65a19756049` and is retained as
`specs/005-ph1-foundation-custody/evidence/F01-A-server-dependency-tree.json`. The compile/runtime
graph is Apache-2.0-dominant. Notable exact exceptions/obligations are:

- `jakarta.annotation:jakarta.annotation-api:3.0.0` is dual-licensed `EPL-2.0 OR
  GPL-2.0 WITH Classpath-exception-2.0`; keep its `META-INF/LICENSE.md` and
  `META-INF/NOTICE.md`. No license branch is selected for a future distribution here.
- `commons-logging:commons-logging:1.3.6` embeds Apache-2.0 license and NOTICE text in its JAR;
  `org.slf4j:slf4j-api:2.0.18` embeds its MIT license. Their Maven POMs do not declare license
  metadata, so the artifact files and upstream license records—not the missing POM fields—were
  checked.
- `org.springframework.boot:spring-boot-starter-log4j2:4.1.1` resolves Log4j 2.25.5 under
  Apache-2.0. The graph contains no Logback artifacts; this avoids bringing the default LGPL-2.1
  alternative into the Server runtime. Preserve applicable Log4j notices if its JAR is redistributed.
- `org.springframework.modulith:spring-modulith-core:2.1.1` brings
  `com.tngtech.archunit:archunit:1.4.2` into the resolved Server runtime graph. ArchUnit is
  Apache-2.0 and redistributes ASM under BSD and Google Guava under Apache-2.0; retain the exact
  artifact's bundled license files/notices if the Server artifact is ever distributed. ArchUnit
  is not a direct application feature dependency; this is the current Modulith transitive graph.
- Six JUnit 6.0.3 artifacts are EPL-2.0 and test-scoped only. They do not enter the Server runtime
  artifact. Test-scoped `jakarta.activation-api:2.1.4` is EDL-1.0. Other test libraries include
  Apache-2.0/BSD-3-Clause/MIT dependencies; Byte Buddy 1.18.11 additionally embeds ASM 9.10.1 under
  BSD-3-Clause and carries its license/NOTICE files.

The graph resolved and `./mvnw -B -Dmaven.repo.local=... verify` passed on the P04 Ubuntu host from
a clean archive of tested source commit `c600f7be41f0732cb57d521017bae0565ab229bd`, using a fresh
Maven Wrapper home and local repository. The exact NuGet transitive license/notice review, full
build-tool/plugin inventory and tracked-secret/broader reproducibility work remain assigned to
T013/T036. That later review does not permit adding a new direct dependency without intake.

No code, diagram, data, or asset is copied from Aras, DDM, or another product. The Maven Wrapper
script is the only upstream build script expected to be copied; it is limited to Apache Maven's
official `only-script` distribution and must retain its upstream copyright/license notice.

## 2. Exact direct candidates

| Area | Exact source/version for F01 | License / obligation found | Use and limit |
|---|---|---|---|
| Java runtime | Existing P04 host: Eclipse Temurin `25.0.4.1+1`, Linux x64 HotSpot; SHA-256 and official source are recorded in [P04 runtime intake](2026-09-23-p04-ubuntu-native-runtime-intake.md). | GPLv2 with Classpath Exception; the exact archive carries additional legal notices. Preserve its bundled `NOTICE`/license files. | Internal build/runtime on the allocated Ubuntu host only; do not copy/bundle from that host under this record. |
| Spring Boot | `org.springframework.boot:spring-boot-starter-parent:4.1.1`; `spring-boot-starter`, `spring-boot-starter-log4j2`, `spring-boot-starter-webmvc`, and `spring-boot-starter-test` `4.1.1`. Official stable release and Java/Maven requirements checked. | Apache License 2.0 for Spring Boot. Log4j 2.25.5 is Apache-2.0; default `spring-boot-starter-logging` is excluded and the resolved graph has no Logback. Test starter includes EPL-2.0 JUnit test dependencies; they remain test-scoped. | Internal Server scaffold and HTTP smoke test only. Java 25 satisfies the official Boot 4.1.1 runtime range. No product behavior or distribution is cleared. |
| Spring Modulith | `org.springframework.modulith:spring-modulith-starter-core:2.1.1`, version managed by the direct project property/BOM. | Apache License 2.0. Preserve copyright/license and any applicable `NOTICE`; exact resolved graph remains for T036. | Selected modularity framework for internal Server foundation. No additional Modulith test starter is needed for the minimal F01 smoke test. |
| Apache Maven | Binary distribution `3.9.16`, obtained from Apache's official ZIP endpoint. Verified SHA-512 `ed41650d42485cfc243fad22158caf9cbb5dc408ce7a09ddb94dd42a019de929ca43065bfa450612cf12bf78b5cafa3884b96c090de326ff590448c933454af3`; wrapper-pinned SHA-256 `5af3b743dd8b876b5c45da33b676251e5f1687712644abb4ee519ca56e1d89ce`. | Apache License 2.0. Wrapper checks the ZIP SHA-256 before use; retain Maven distribution license/notice files if the tool is copied or redistributed. Maven's bundled components are separate from the Maven core license and remain part of build-tool inventory. | Build tool only; not an IDEA Server runtime or customer deliverable. Maven Wrapper 3.3.4 requires `unzip` for this ZIP; without it, its `.tar.gz` fallback conflicts with the pinned ZIP checksum. The verified P04-host run used the installed BusyBox `unzip` applet through a temporary PATH shim; never disable checksum validation. |
| Apache Maven Wrapper | `maven-wrapper` scripts `3.3.4`, type `only-script`; official Apache source release `maven-wrapper-3.3.4-source-release.zip`, SHA-512 `8659504fac71a179681ba508a6a0ecb790678080488ae123c16151fa4c88aa89a9689b0b73b0c4830ab8ab867d586c2b13bab872ca4eed0ffe585c14dc8e9ae6`, verified against Apache's sidecar. The committed `mvnw` content matches the release's `only-mvnw` resource after LF-normalizing line endings and replacing the release version placeholder with `3.3.4`; file SHA-256 `CAE96CEF89EBEA3531221F4AE17C23CF8EDF67D00EAE8306D4186AE1BBED4D02`. No wrapper JAR or downloaded wrapper code artifact is needed for this type. | Apache License 2.0. The script retains the Apache copyright/license header. | `apps/server/mvnw` bootstrap script only. It downloads the pinned Maven distribution above; wrapper does not select application technology. |
| React UI runtime | `react:19.3.0`, `react-dom:19.3.0`, upstream React release/tag. | MIT. Retain copyright and MIT license text with redistributed copies. | Internal Web UI source/runtime; no server-side rendering or React Server Components package is needed for F01. |
| React type definitions | `@types/react:19.3.0`, `@types/react-dom:19.3.0`, DefinitelyTyped/npm package metadata. | MIT. Retain copyright/license with any redistributed package copies. | Development-only type checking; exact package integrity and graph recorded in npm lockfile. |
| Vite Web build | `vite:8.3.1`, `@vitejs/plugin-react:6.1.1`; official Vite/plugin releases. | Vite and plugin are MIT-licensed. Vite's distributed package lists bundled third-party notices/licenses; preserve them if the build tool package is redistributed. | Build/test tooling only. Node 24 is the already selected build family; no Node server is selected. |
| Vitest | `vitest:5.0.2`, official release. | MIT, with bundled third-party notices/licenses in the published distribution; preserve when redistributing test tooling. | Development test runner only. The exact npm graph and bundled notices are checked from lock/package artifacts before F01-B review. |
| TypeScript | `typescript:7.0.2`, official Microsoft TypeScript Go release/package. | Apache License 2.0. Retain license/notice; its npm graph includes platform-specific optional packages that must remain visible in the lockfile review. | Type checker/compiler only; no TypeScript runtime is packaged in Web output. |
| Windows WebView2 SDK | NuGet `Microsoft.Web.WebView2:1.0.4191.47` from the Microsoft-owned NuGet package. Its package license file contains BSD-style redistribution conditions. | Retain copyright, conditions and disclaimer in source/binary redistribution; do not use Microsoft/contributor names to endorse the product. | Internal WPF build dependency. This is the SDK package, **not** the Evergreen WebView2 Runtime. Runtime servicing and installer redistribution remain separate/not selected here. |
| .NET test projects | Microsoft `MSTest.Sdk:4.4.1` (test projects only), official NuGet/Microsoft Learn package family; `dotnet test` runner behavior follows the SDK's documented Microsoft Testing Platform mode. | MIT for the Microsoft test SDK/framework; retain license text for redistributed test dependencies. Resolved NuGet graph remains for F01-B/T013 and T036. | F01 startup checks only; test framework choice does not alter the selected product technology. No test package enters the product runtime. |
| .NET SDK/runtime | Existing P04 Windows toolchain: .NET SDK `10.0.300` and .NET 10 targeting/build packs, as captured in the F01 environment check. | Microsoft product terms; this record does not copy or redistribute the SDK/runtime. Any future installer containing .NET or WebView2 runtime needs a separate exact package/EULA intake. | WPF and Workspace only; explicitly not the Format Worker toolchain. |
| Node/npm | Existing P04 Ubuntu Node.js `24.21.0` / npm `11.19.0`; the exact archive hash and included licenses are in [P04 runtime intake](2026-09-23-p04-ubuntu-native-runtime-intake.md). | Node core uses MIT; the exact release carries licenses for bundled components. Retain the release license files if copying or redistributing the runtime. | Web build/development tool only, not the selected production Server runtime. |

The direct versions are pinned exactly in the project files/lockfile; these pins do not freeze
security updates indefinitely. A version change reopens this intake for that component and its
resolved graph.

## 3. Conditions before first application build or integration

| Condition | Owner | Required evidence |
|---|---|---|
| Keep direct package sources and versions equal to this intake; use only official publisher endpoints/repositories. | F01 implementer | Project files and source URLs. |
| Keep the reviewed npm graph aligned with `apps/web/package-lock.json`; inspect exact package notices, optional-platform behavior and any future bundle before integration/distribution. | F01 implementer | Initial metadata screen recorded here; F01-B/T013 and PH1/T036 complete actual notice/bundle review. |
| Recheck the pinned Maven project graph when direct versions change; review exact license/notice files and the Maven build-plugin distribution before packaging. | F01 implementer | Graph hash and notable obligations recorded above; F01-B/T013 and PH1/T036 before integration/distribution. |
| Restore the NuGet test and WebView2 packages on the Windows target; inspect exact package licenses/dependencies, including WPF target assets. | F01 implementer | F01-B/T013 and PH1/T036. |
| Keep the pinned Maven wrapper URL and checksum paired; make `unzip` available (a BusyBox `unzip` shim works on the current P04 host) and never disable checksum enforcement to bypass a missing extraction tool. | F01 implementer | T005 tool inventory; wrapper ZIP checksum verified against Apache's official SHA-512 sidecar. |
| If any dependency has a custom, non-commercial, field-of-use, unclear, reciprocal/network-copyleft or redistribution-restricted term, do not use it; request Legal Review Authority disposition. | Engineering + Legal Review Authority | New controlled intake decision before use. |
| Before external/customer distribution, choose the packaging model, inventory every shipped runtime and transitive component, generate an SBOM, assemble notices/source obligations, and obtain legal/company approval. | Engineering + Legal Review Authority | Separate commercial-release review; this intake is not that approval. |

Internal development is permitted only within the stated scope and recorded obligations. It does
not establish that all future package updates, all transitive components, a deployment bundle, or
commercial distribution are legally cleared.

## 4. Primary sources checked on 2026-09-28

- Spring Boot 4.1.1 [release/current stable](https://docs.spring.io/spring-boot/spring-projects.html), [system requirements](https://docs.spring.io/spring-boot/system-requirements.html), [license](https://github.com/spring-projects/spring-boot).
- Spring Modulith [2.1.1 stable release](https://docs.spring.io/spring-modulith/reference/spring-projects.html), [project and license](https://github.com/spring-projects/spring-modulith).
- Apache Maven [3.9.16 downloads and official SHA-512 sidecars](https://maven.apache.org/download.cgi); [Maven Wrapper 3.3.4 source/checksum and Apache 2.0 license](https://maven.apache.org/tools/wrapper/download.cgi); [only-script semantics](https://maven.apache.org/tools/wrapper/maven-wrapper-plugin/wrapper-mojo.html); [3.3.4 launch script](https://github.com/apache/maven-wrapper/blob/maven-wrapper-3.3.4/maven-wrapper-distribution/src/resources/only-mvnw).
- React [19.3 release](https://react.dev/blog/2026/09/09/react-19-3) and [exact React package metadata/license](https://github.com/react/react/blob/main/packages/react/package.json); React DOM follows the same upstream release and license family.
- Microsoft TypeScript [7.0.2 release](https://github.com/microsoft/typescript-go/releases/tag/typescript/v7.0.2) and [license](https://github.com/microsoft/typescript-go/blob/main/LICENSE); React types [npm package versions](https://www.npmjs.com/package/%40types/react) and [React DOM types](https://www.npmjs.com/package/%40types/react-dom).
- Vite [8.3 releases/support line](https://vite.dev/releases), [Vite package license and bundled notices](https://github.com/vitejs/vite/blob/main/packages/vite/LICENSE.md), [React plugin upstream](https://github.com/vitejs/vite-plugin-react); Vitest [5.0.2 signed release](https://github.com/vitest-dev/vitest/releases) and [license notices](https://github.com/vitest-dev/vitest/blob/main/packages/vitest/LICENSE.md).
- Microsoft [WebView2 NuGet 1.0.4191.47](https://www.nuget.org/packages/Microsoft.Web.WebView2/1.0.4191.47), its [exact license text](https://www.nuget.org/packages/Microsoft.Web.WebView2/1.0.4191.47/License), [MSTest SDK 4.4.1](https://www.nuget.org/packages/MSTest.Sdk/4.4.1) and [MSTest SDK documentation](https://learn.microsoft.com/en-us/dotnet/core/testing/unit-testing-mstest-sdk).
- Spring Boot's [logging guidance](https://docs.spring.io/spring-boot/how-to/logging.html) documents Log4j2 as an alternative; [Apache Log4j](https://logging.apache.org/log4j/2.x/download.cgi) is Apache-2.0. Exact Server graph is retained in `evidence/F01-A-server-dependency-tree.json`.
- Exact package license evidence: [Jakarta Annotations 3.0.0 LICENSE/NOTICE](https://github.com/jakartaee/common-annotations-api/tree/3.0.0), [Jakarta XML Binding API 4.0.5](https://github.com/jakartaee/jaxb-api/tree/4.0.5), [JUnit 6.0.3 license](https://github.com/junit-team/junit-framework/blob/r6.0.3/LICENSE.md), [ArchUnit 1.4.2 README/license and bundled ASM/Guava obligations](https://github.com/TNG/ArchUnit/blob/v1.4.2/README.md), [SLF4J 2.0.18 license](https://github.com/qos-ch/slf4j/blob/v_2.0.18/LICENSE.txt), [Apache Commons Logging](https://github.com/apache/commons-logging), [Byte Buddy 1.18.11 license and embedded ASM note](https://github.com/raphw/byte-buddy/tree/byte-buddy-1.18.11), [Awaitility](https://github.com/awaitility/awaitility), [Objenesis](https://github.com/easymock/objenesis), and [XMLUnit](https://github.com/xmlunit/xmlunit).
- Exact Node.js/Temurin hashes, release sources and bundled-license status are recorded in the existing [P04 Ubuntu runtime intake](2026-09-23-p04-ubuntu-native-runtime-intake.md), not re-inferred here.

## Change log

| Version | Date | Change | Evidence |
|---|---|---|---|
| 0.1 | 2026-09-28 | Record exact F01 direct dependency candidates, publisher sources, license/notice obligations and the internal-only disposition. | Official sources in Section 4; F01-A T002; P04 runtime intake |
| 0.2 | 2026-09-28 | Screen the exact npm lock graph; pin Maven Wrapper and Maven distribution artifacts/checksums; leave resolved Maven/NuGet application graphs and commercial distribution explicitly open. | Official sources/checksums in Section 4; verified npm lock metadata; F01-A T002/T003; P04 runtime intake |
| 0.3 | 2026-09-28 | Record the resolved 75-package Maven project graph, exact notable license/notice obligations, Log4j2 alternative with no Logback, Server build result, and the P04 host's BusyBox `unzip` workaround while retaining the official ZIP checksum. | Maven dependency-tree SHA-256 and Server build evidence; package artifacts/upstream sources in Section 4; official Apache Maven SHA-512 sidecar; F01-A/T006/T009/T012 |
| 0.4 | 2026-09-28 | Add the ArchUnit 1.4.2 runtime-transitive license/notice obligations; record all four individual smoke/build outcomes without treating them as one-commit T012 evidence. | Exact Maven graph; ArchUnit v1.4.2 upstream README; F01-A build results |
| 0.5 | 2026-09-28 | Record clean-source build/test outcomes for all four projects from one committed source revision and preserve remaining NuGet, secret-scan and commercial-distribution boundaries. | F01-A build results, tested commit `c600f7be41f0732cb57d521017bae0565ab229bd` |
| 0.6 | 2026-09-28 | Separate the direct-package internal-use disposition from the incomplete whole-graph qualification; record the NuGet restore order-of-work deviation and keep T002 open. Add research control tailoring and re-review trigger. | Two-axis F01-A review against external-source intake and PH1 FR-012 |
