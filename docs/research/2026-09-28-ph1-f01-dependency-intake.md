# PH1 F01 Dependency Intake

| Control field | Value |
|---|---|
| Stable Research ID | `IE-RES-PH1-F01-DEP-001` |
| Document class / title | `RESEARCH-NOTE` / PH1 F01 Dependency Intake |
| Version / status | `0.10` / `Draft` |
| Product normativity | `INFORMATIVE` — records source/license evidence; does not change Feature, Tech or product scope |
| Repository process authority / instruction state | `NOT-APPLICABLE` / `NOT-APPLICABLE` |
| Owner / author | Engineering / repository maintainer |
| Reviewer / acceptance authority | Project Reviewer accepted the one-time T002 internal build/test timing exception for late NuGet and direct Web legal-file evidence on 2026-09-28; Product Decision Authority product acceptance `NOT-RUN` |
| Evidence date | 2026-09-28 (Asia/Ho_Chi_Minh) |
| Applicable baseline | PG4-authorized `IE-INC-PH1-FOUNDATION-CUSTODY-001`, F01-A; selected Java 25, React 19.3, TypeScript 7, Vite 8.3, WPF/WebView2 and .NET 10 families |
| Intended use | `DEPENDENCY` for internal development/build/test only; no customer packaging, redistribution or commercial-use approval |
| Upstream trace | F01-A/T002; `TECH-001`; P04 Ubuntu runtime intake; PH1 plan and external-source intake procedure |
| Downstream trace | F01-A/T003–T012; F01-B/T013; PH1/T036 dependency/license review |
| Change / Work Item trace | GitHub Issue #12, F01-A; source commit recorded in `evidence/F01-A-source-and-scope.md` |
| Classification / retention | `INTERNAL`; retain while these dependency versions are used and with later dependency inventory/SBOM |
| Evidence status | npm lock graph resolved and screened; eight direct Web legal-file sets inspected after first import; all four approved foundation smoke/build checks passed from clean platform-specific archives of source commit `c600f7be41f0732cb57d521017bae0565ab229bd`. The current Windows NuGet graph, 14 exact archives and license/notice evidence are recorded in the linked NuGet audit; the historical restore linkage remains qualified. The Project Reviewer accepted one-time timing exceptions for late NuGet and direct Web legal-file evidence covering only past internal F01-A build/test. Commercial distribution review remains `BLOCKED-LEGAL`. |
| Control tailoring | Research note, not a product decision: no effective product date or requirement acceptance. Source evidence, review limits and intended-use conditions are recorded here; later evidence does not retrospectively satisfy the before-first-use rule. |
| Supersession / review trigger | Supersedes this note's `0.9` revision; no successor identified. Re-review on exact package/version, source/license, resolved graph, packaging model or intended-use change, and before a distribution decision. The exception does not cover a new import. |

## 1. Disposition

**Direct-package disposition: `APPROVED-WITH-OBLIGATIONS` for internal F01 development only.**
This is not a qualification of every package in the resolved graphs. The initial Windows restore
used NuGet transitive packages before their exact license/notice evidence was retained. The
Project Reviewer accepted a one-time timing exception for that past internal F01-A build/test
use on 2026-09-28; its NuGet-specific scope, residual risk, owner, expiry and follow-up are in the
[NuGet transitive audit](2026-09-28-ph1-f01-nuget-transitive-audit.md). That audit records the current
14-package Windows build/test graph, exact local archives, license and notice evidence, and the
limit on linking those assets to the historical clean restore. It does not make the
before-first-use condition retrospectively true. Do not infer that the successful build or
package metadata cured that gap. A separate late direct-Web legal-file exception is recorded
below. The versions below are pinned to named upstream publishers;
license expressions and known notice obligations are recorded here. Keep required notices with
any copy of the corresponding package or runtime. Do not bundle these development tools or
runtimes in a customer package under this record. No commercial package or distribution model is
approved by this intake. The separate [commercial-license scope note](2026-09-28-ph1-f01-commercial-license-scope.md)
explains why commercially usable license families do not equal an approved IDEA release.

The npm lock graph is pinned in `apps/web/package-lock.json` (SHA-256
`350E5D24057C55D6ACEF6FB6A71B73948E2711D9279C12E2FE52071B815F611B`): 88 exact package
versions, all resolved from `registry.npmjs.org` with lockfile integrity values. A read-only
screen of the `license` field on each of the 88 exact `node_modules/*` lockfile entries found 51 MIT, 23 Apache-2.0,
12 MPL-2.0, one ISC and one BSD-3-Clause package; none had missing license metadata or a
non-registry tarball. The 12 MPL-2.0 entries are `lightningcss@1.33.0` and its 11
platform-specific packages. They are part of the Web build-tool dependency graph, not the
produced application runtime. Keep them out of customer runtime bundles; if the build tools or
their binaries are later redistributed, review MPL source/notice obligations for that exact
distribution. This metadata screen is not a substitute for T013/T036 review of actual package
notices, optional-platform inclusion, or any future distribution bundle. The lockfile retains
the per-package source URL, version, integrity and declared license; its `dev`/`optional` fields
show build-only or platform-dependent reach where present. The whole graph is admitted for this
bounded internal F01 build/test use, not as a customer distribution inventory.

**F01-B hash correction (2026-09-29):** Version `0.9` recorded
`1C011F5EBFEA15E039E236B4713C3ED7E0B1657A654A95887B3B13D0C84B803D`, which does not match the
lockfile bytes. Recalculation from the tracked file at source commit
`b5c4701cf5a1cd37ae8295ed4af1621a6b522d03` gives the SHA-256 above. The lockfile contents, package
versions and license-family counts were not changed by this correction.

### Direct Web package legal files inspected after the initial import

On 2026-09-28, the eight direct npm packages in the existing local `apps/web/node_modules`
installation were checked read-only. Each `package.json` version matched its exact
`node_modules/<name>` entry in the pinned lockfile; each entry has a versioned
`registry.npmjs.org` tarball URL and SHA-512 integrity value in that lockfile. The table identifies
the actual legal files read, not merely package metadata or a mutable upstream `main` branch.
SHA-256 is of the named local file. The local installation was **not retained from the clean
Ubuntu test archive**, so this check does not prove the historical archive bytes or that these
files were read before first import.

| Exact direct package | Legal file(s) read in local package | SHA-256 of legal file(s) |
|---|---|---|
| `react@19.3.0` | `LICENSE` (MIT) | `DA6D3703ED11CBE42BD212C725957C98DA23CBFF1998C05FA4B3D976D1A58E93` |
| `react-dom@19.3.0` | `LICENSE` (MIT) | `DA6D3703ED11CBE42BD212C725957C98DA23CBFF1998C05FA4B3D976D1A58E93` |
| `@types/react@19.3.0` | `LICENSE` (MIT) | `C2CFCCB812FE482101A8F04597DFC5A9991A6B2748266C47AC91B6A5AAE15383` |
| `@types/react-dom@19.3.0` | `LICENSE` (MIT) | `C2CFCCB812FE482101A8F04597DFC5A9991A6B2748266C47AC91B6A5AAE15383` |
| `vite@8.3.1` | `LICENSE.md` (MIT; includes bundled notices) | `387DD7BAA307083401A27C58C362C30832F5BA1DBA84F10CC22C33401523F45C` |
| `@vitejs/plugin-react@6.1.1` | `LICENSE` (MIT) | `29B68325FE026047D13E187B44C33B2ACACF7DC647DEC4583702E59F235E13B5` |
| `vitest@5.0.2` | `LICENSE.md` (MIT; includes bundled notices) | `D47EB4EEDDB0A8B7776ABD645D9C2D18E14BF6A5FFA52AC75FC3647D672D0260` |
| `typescript@7.0.2` | `LICENSE` (Apache-2.0); `NOTICE.txt` (third-party notices) | `A7D00BFD54525BC694B6E32F64C7EBCF5E6B7AE3657BE5CC12767BCE74654A47`; `F5C708B59114507B8B27B48181B6883D106BBCA0C1634BBEE45B5E344237B66B` |

The local package files support the stated direct-package license families and notice-retention
actions for internal use. They do **not** complete an archive-by-archive legal-file review for the
other 80 npm lock entries or qualify a customer bundle. T013/T036 retain that reconciliation.

**Web timing exception:** The Project Reviewer confirmed in this Codex conversation on
2026-09-28: “Có, mở rộng ngoại lệ T002 đúng phạm vi này” in response to the question naming the
eight direct Web packages and late LICENSE/NOTICE-file evidence. This is a one-time acceptance of
the *recording order* for already performed F01-A internal `npm ci` and build/test at source commit
`c600f7be41f0732cb57d521017bae0565ab229bd`; it does not assert that the exact legal files
were read before first import. Engineering owns the license-file hashes, notice retention and
T013/T036 follow-up. The local install's byte identity with the historical clean Ubuntu install
was not proved, and the other 80 npm packages still have only metadata-level screening here.
This exception expires as an authorization at F01-A card review, remains in the historical record,
and cannot be reused for a new package, version, lockfile graph, customer bundle or commercial
distribution. New imports still require pre-use intake; unclear redistribution terms remain with
the Legal Review Authority.

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
Maven Wrapper home and local repository. The current NuGet graph's exact license/notice review is
recorded in the linked audit, with the Project Reviewer's one-time T002 disposition. Full build-tool/plugin
inventory, tracked-secret/broader reproducibility work, and review of the actual integration or
distribution bundle remain assigned to T013/T036. That later review does not permit adding a new
direct dependency without intake.

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
| .NET test projects | Microsoft `MSTest.Sdk:4.4.1` (test projects only), official NuGet/Microsoft Learn package family; `dotnet test` runner behavior follows the SDK's documented Microsoft Testing Platform mode. | MIT for the Microsoft test SDK/framework; retain license text for redistributed test dependencies. The current resolved Windows graph is recorded in the [NuGet audit](2026-09-28-ph1-f01-nuget-transitive-audit.md); actual shipped/test-tool bundle review remains for F01-B/T013 and T036. | F01 startup checks only; test framework choice does not alter the selected product technology. No test package enters the product runtime. |
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
| Keep the recorded NuGet test and WebView2 package graph aligned with the Windows target; retain the one-time T002 deviation decision and recheck actual shipped assets/notices before integration or distribution. | F01 implementer and Project Reviewer | [Current NuGet audit and accepted exception](2026-09-28-ph1-f01-nuget-transitive-audit.md); F01-B/T013 and PH1/T036 for later bundle checks. |
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
- React [19.3 release](https://react.dev/blog/2026/09/09/react-19-3); exact `react@19.3.0` and `react-dom@19.3.0` package license files were read from the versioned local installation and hashed in the direct Web table above.
- Microsoft TypeScript [7.0.2 release](https://github.com/microsoft/typescript-go/releases/tag/typescript/v7.0.2); exact `typescript@7.0.2` license and notice, plus `@types/react@19.3.0` and `@types/react-dom@19.3.0` licenses, were read and hashed above.
- Vite [8.3 releases/support line](https://vite.dev/releases) and [React plugin upstream](https://github.com/vitejs/vite-plugin-react); exact `vite@8.3.1`, `@vitejs/plugin-react@6.1.1` and `vitest@5.0.2` legal files were read and hashed above.
- Microsoft [WebView2 NuGet 1.0.4191.47](https://www.nuget.org/packages/Microsoft.Web.WebView2/1.0.4191.47), its [exact license text](https://www.nuget.org/packages/Microsoft.Web.WebView2/1.0.4191.47/License), [MSTest SDK 4.4.1](https://www.nuget.org/packages/MSTest.Sdk/4.4.1) and [MSTest SDK documentation](https://learn.microsoft.com/en-us/dotnet/core/testing/unit-testing-mstest-sdk).
- Exact Windows package archives, publisher-pinned licenses and embedded notices are itemized in the [NuGet transitive audit](2026-09-28-ph1-f01-nuget-transitive-audit.md). NuGet's [signed-package metadata definition](https://github.com/NuGet/Home/wiki/Nupkg-Metadata-File) explains why its content hash differs from the full signed archive hash.
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
| 0.7 | 2026-09-28 | Link the exact current NuGet graph/license/notice audit, distinguish later evidence from the original before-first-use deviation, and reserve T002 closure for Project Reviewer disposition. | [NuGet transitive audit](2026-09-28-ph1-f01-nuget-transitive-audit.md); FR-012; T002 |
| 0.8 | 2026-09-28 | Record the Project Reviewer's one-time exception for late NuGet evidence in internal F01-A build/test; retain later distribution and license-review gates. | [NuGet transitive audit](2026-09-28-ph1-f01-nuget-transitive-audit.md); [commercial-license scope](2026-09-28-ph1-f01-commercial-license-scope.md); FR-012; T002 |
| 0.9 | 2026-09-28 | Replace mutable upstream license links for direct Web packages with exact installed package legal-file names and hashes; record the Project Reviewer's one-time internal Web timing exception without erasing the historical or transitive-review limitations. | Versioned local npm packages; pinned Web lockfile; Project Reviewer response on 2026-09-28; F01-A/T002 and F01-B/T013 |
| 0.10 | 2026-09-29 | Correct the recorded npm lockfile SHA-256 after comparing it with the tracked file; package inventory and legal conclusions are unchanged. | F01-B/T013; source commit `b5c4701cf5a1cd37ae8295ed4af1621a6b522d03`; `Get-FileHash` result |
