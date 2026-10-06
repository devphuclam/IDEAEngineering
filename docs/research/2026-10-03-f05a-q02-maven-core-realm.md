# F05-A Q02 — Maven 3.9.16 core realm and plugin dependency boundaries

| Control | Value |
|---|---|
| Stable ID / class | `IE-RES-F05A-Q02-MAVEN-REALM-20261003` / bounded execution-readiness research record |
| Version / status | `0.5 / Draft` |
| Product normativity / process instruction | `INFORMATIVE / NOT-APPLICABLE`; creates no product requirement or execution authorization |
| Owner / author / worker mode | Project Reviewer Nguyễn Huỳnh Phúc Lâm / Codex / `CODEX_ONLY` |
| Reviewer / acceptance authority | Project Reviewer; review and acceptance `NOT-RUN` |
| Applicable baseline | [Work Item #37](https://github.com/devphuclam/IDEAEngineering/issues/37), [PR #38](https://github.com/devphuclam/IDEAEngineering/pull/38); repository starting commit `33f2263`; Resources Plugin 3.5.0; installed Maven 3.9.16 |
| Evidence date / effective date | Read-only observations 2026-10-03 / `NOT-APPLICABLE` |
| Classification / retention | `INTERNAL`; retain with Q02/T027 qualification evidence |
| Upstream trace | [Boot candidate inventory](2026-10-03-f05a-t027-boot-cache-inventory.md), [plugin cache table](inventories/f05a-q02-plugin-cache.tsv), [intake procedure](../agents/external-source-intake.md) |
| Downstream trace | Exact Q02 intake and future offline command package; no implementation or gate acceptance follows |
| Change / supersession | New bounded research record; supersedes no historical record; superseded by `NOT-APPLICABLE` |
| Review trigger | Maven/distribution/cache hash change, plugin version/POM/profile/override/exclusion change, or proposed command/session change |
| Evidence status | `OBSERVED` installed bytes and XML; primary-source facts; explicitly labeled static inference; Maven resolution and qualification `NOT-RUN` |

## 1. Question, result and limits

The candidate inventory found no repository JAR/POM pair for
`org.codehaus.plexus:plexus-component-annotations:2.2.0` or
`org.codehaus.plexus:plexus-classworlds:2.9.0`, although the Resources 3.5.0 embedded
`META-INF/maven/plugin.xml` lists both. That absence is confirmed below.

**Bounded finding:** the inspected Resources 3.5.0 POM paths exclude the relevant children
through Maven `provided` scope or an explicit wildcard exclusion. The descriptor's flat list
is not the effective plugin dependency graph. Static source/POM inspection therefore does not
establish either missing pair as a required download for this Resources path.

The two core mechanisms differ. Maven exports annotations classes from its installed 2.2.0
JAR, but does **not** list the annotations coordinate in its core exported-artifact filter.
Classworlds is listed in that filter by group/artifact; the normal command-line parent loader
provides the installed boot 2.11.0. This is Maven's own class realm boundary, not a repository
substitution of 2.11.0 for a required 2.9.0.

Core realm filtering happens after plugin dependency collection/resolution. It cannot by
itself prove that an arbitrary missing POM/JAR on an unexcluded dependency path is harmless.
No Maven goal, effective-model calculation, resolver invocation, build, test or Boot process
was run. Full Q02 closure, rights admission and T027 qualification remain `NOT-RUN`.

## 2. Primary source identity and reference-only disposition

Sources were inspected through official owner repositories on 2026-10-03. Maven paths below
are pinned to tag `maven-3.9.16`; Resolver paths to `maven-resolver-1.9.27`. The source tag is
the pin; independent signed-tag/release authentication is `NOT-RUN`. Installed hashes in §4
are local byte identities, not independent publisher authentication.

| Source ID | Publisher / exact source and relevant symbol |
|---|---|
| S01 | Apache Software Foundation (ASF), [Resources Plugin tag 3.5.0 POM](https://github.com/apache/maven-resources-plugin/blob/maven-resources-plugin-3.5.0/pom.xml): dependency scopes |
| S02 | ASF, [Filtering tag 3.5.0 POM](https://github.com/apache/maven-filtering/blob/maven-filtering-3.5.0/pom.xml): dependency paths |
| S03 | Codehaus Plexus owner repository, [Build API tag 1.2.0 POM](https://github.com/codehaus-plexus/plexus-build-api/blob/plexus-build-api-1.2.0/pom.xml): wildcard exclusions on legacy Build API and Sisu |
| S04 | ASF, [DefaultPluginDependenciesResolver](https://github.com/apache/maven/blob/maven-3.9.16/maven-core/src/main/java/org/apache/maven/plugin/internal/DefaultPluginDependenciesResolver.java): `resolveInternal` |
| S05 | ASF, [DefaultMavenPluginManager](https://github.com/apache/maven/blob/maven-3.9.16/maven-core/src/main/java/org/apache/maven/plugin/internal/DefaultMavenPluginManager.java): `createPluginRealm`, `calcImports` |
| S06 | ASF, [MavenRepositorySystemUtils](https://github.com/apache/maven/blob/maven-3.9.16/maven-resolver-provider/src/main/java/org/apache/maven/repository/internal/MavenRepositorySystemUtils.java): `newSession`; [session factory](https://github.com/apache/maven/blob/maven-3.9.16/maven-core/src/main/java/org/apache/maven/internal/aether/DefaultRepositorySystemSessionFactory.java): `newRepositorySession` |
| S07 | ASF, [ScopeDependencySelector](https://github.com/apache/maven-resolver/blob/maven-resolver-1.9.27/maven-resolver-util/src/main/java/org/eclipse/aether/util/graph/selector/ScopeDependencySelector.java): `deriveChildSelector`; [ExclusionDependencySelector](https://github.com/apache/maven-resolver/blob/maven-resolver-1.9.27/maven-resolver-util/src/main/java/org/eclipse/aether/util/graph/selector/ExclusionDependencySelector.java): wildcard matching and inherited exclusions |
| S08 | ASF, [core extension descriptor](https://github.com/apache/maven/blob/maven-3.9.16/maven-core/src/main/resources/META-INF/maven/extension.xml): exported packages versus exported artifacts |
| S09 | ASF, [DefaultClassRealmManager](https://github.com/apache/maven/blob/maven-3.9.16/maven-core/src/main/java/org/apache/maven/classrealm/DefaultClassRealmManager.java): `createRealm`, `isProvidedArtifact`, `createPluginRealm`, `wireRealm` |
| S10 | ASF, [CoreExportsProvider](https://github.com/apache/maven/blob/maven-3.9.16/maven-core/src/main/java/org/apache/maven/extension/internal/CoreExportsProvider.java), [CoreExtensionEntry](https://github.com/apache/maven/blob/maven-3.9.16/maven-core/src/main/java/org/apache/maven/extension/internal/CoreExtensionEntry.java): discovery of explicit extension descriptors |

Intended use and disposition: `REFERENCE-ONLY`. This record contains original analysis and
coordinate/method/path facts, not copied source, legal text or third-party assets. Maven exact-tag
[LICENSE](https://github.com/apache/maven/blob/maven-3.9.16/LICENSE) and
[NOTICE](https://github.com/apache/maven/blob/maven-3.9.16/NOTICE) were inspected; license identity
is Apache-2.0. S01–S03/S07 carry Apache-2.0 source headers. This reference disposition is not
dependency admission, a full distribution license audit or commercial clearance.

## 3. Evidence claims and engineering interpretation

| Claim ID | Direct fact / evidence | Interpretation and limitation |
|---|---|---|
| Q02-MR-01 | Observed Resources descriptor has eight flat dependency entries, including annotations 2.2.0, classworlds 2.9.0 and Sisu Plexus 0.9.0.M4. It contains no dependency scope/exclusion edges. | Descriptor presence alone cannot identify an actual unexcluded resolution path. This observation preserves the earlier inventory rather than silently changing its missing-cache rows. |
| Q02-MR-02 | S01 and cached Resources POM declare ordinary roots Filtering 3.5.0 and Plexus Utils; Maven Core/Plugin API/Model 3.9.12 are `provided`. S02 Filtering uses Build API 1.2.0; its Maven Core/Model/Settings are `provided`, and its Sisu dependencies are `test`. | Those Maven/Sisu branches are excluded by ordinary plugin collection scope semantics. Neither named missing coordinate is a direct runtime root in these POMs. |
| Q02-MR-03 | S03 and cached Build API 1.2.0 POM place `*:*` child exclusions on both legacy Build API 0.0.7 and Sisu Plexus. Cached Maven Parent 47 manages Sisu Plexus to 0.9.0.M4; the Build API declaration itself says 0.9.0.M2. | Version management does not remove the exclusions. Sisu's children, including annotations/classworlds, are cut off on this path. This is an exclusion analysis, not a claim that a different Sisu version was substituted by this research. |
| Q02-MR-04 | S04 sets the root to the plugin artifact, collects using session selectors plus Wagon exclusion, and resolves with a `provided`/`test` scope filter plus the caller filter. S06 installs scope/optional/exclusion selectors; S07 activates scope filtering below a non-null root dependency and recognizes wildcard exclusions. | Static inference: with these POMs and default session semantics, the two flattened descriptor coordinates have no surviving Resources path. A future harness override, alternate active profile or extension can change the outcome and reopens this analysis. |
| Q02-MR-05 | S05 calls the POM-based plugin dependency resolver before creating its realm. It passes the project extension filter and caller filter; its `calcImports` chooses the project realm or Maven API realm as default foreign import. Installed resolver bytecode shows the same collection-then-resolution order. | The descriptor list is not replayed as the resolver's dependency request. A core realm exclusion is later than resolution and is not a generic missing-cache exemption. |
| Q02-MR-06 | S08 and installed core extension descriptor list classworlds GA among exported artifacts; annotations GA is absent. Both relevant package families are exported. S10 discovers explicit descriptor entries. Scan of installed top-level `lib` and recursive `lib/ext` JARs found only Maven Core's extension descriptor. | Class visibility and artifact-coordinate filtering are separate facts. Presence in Maven `lib` is insufficient to infer an artifact exclusion. Runtime extension/session behavior has not been executed. |
| Q02-MR-07 | S09 `isProvidedArtifact` matches group/artifact without version; `createRealm` omits matching constituents. Its normal plugin parent uses the loader that loaded `ClassWorld`, with foreign imports wired from Maven API. Observed boot identity is classworlds 2.11.0. | The normal CLI classworlds provider is legitimately Maven-owned 2.11.0. It does not make a repository 2.9.0 file exist. Compatibility and actual Resources goal execution remain `NOT-RUN`. |
| Q02-MR-08 | Observed Maven `lib` identity is annotations 2.2.0; installed `bin/m2.conf` loads `lib/*.jar` into `plexus.core`. S08 exports `org.codehaus.plexus.*` and component packages. | Static import-path inference supports annotations class availability through Maven API. There is no annotations GA exclusion. No copy to `.m2/repository`, version override or dependency mutation occurred. |

The bounded conclusion is therefore **POM path excluded / core classes available**, with
different reasons for each coordinate. It is not “both artifact IDs are filtered by core”.
If another plugin or a future explicit plugin dependency introduces either coordinate on an
unexcluded compile/runtime path, the repository absence requires fresh investigation; neither
Maven `lib` presence nor realm filtering is permission to invent or relabel the missing artifact.

## 4. Installed distribution and cache observations

Read-only SSH used the existing identity and pinned host-key checking:
`ssh -i C:/Users/TD-999/.ssh/idea_ddm_dev_ed25519 -o BatchMode=yes -o StrictHostKeyChecking=yes -o ConnectTimeout=5 phuclam@192.168.137.33`.
No credentials/settings contents were read. `ls`, `sha256sum`, bounded `sed`, existing Python 3
ZIP/XML reads and existing JDK `javap` disassembly were used. `unzip` was unavailable; no
substitute was installed. `javap` inspected class files; it did not load/run Maven or plugin code.

Distribution root `M` = `/home/phuclam/.m2/wrapper/dists/apache-maven-3.9.16/510fba38`.
Repository root `R` = `/home/phuclam/.m2/repository`. Every hash is SHA-256 of the observed file
or, where marked, the uncompressed ZIP entry.

| Path relative to `M` | Observed SHA-256 |
|---|---|
| `lib/plexus-component-annotations-2.2.0.jar` | `50edb93c73786e62822b4fe1336e22880fdf147191373cf5c911370e16748fcf` |
| `boot/plexus-classworlds-2.11.0.jar` | `8971f135490070bc5fde7413fcc8db7c997fda4bebfb5c31185900d66edcbbb2` |
| `lib/maven-core-3.9.16.jar` | `5d45c72e3dbfab8b68d15ad4f12777b7d9b5fe4d4adc99c3bd51fb9641fab009` |
| Core JAR entry `META-INF/maven/extension.xml` | `c3471b85b2b658be8469a1e417602949eb9999ffdde989c6887be2547d5c0b49` |
| `lib/maven-resolver-provider-3.9.16.jar` | `72a2d6aad3708e2c708b659b292ae9587a4d170ec88f48466290318730221118` |
| `lib/maven-resolver-util-1.9.27.jar` | `74a12548f0d6aad13c728666288c1e81201c24bd05bb4e4ec8c1558517b379a7` |
| `bin/m2.conf` | `e336769bf93a902baa7a3e827ba55e4cef7de4af2ed1a9541a4261094d748ba9` |
| `bin/mvn` | `f9381d0cb98abaaf9592dae421eddc497e84ed9bfb723b84c111d1350863c3a2` |

Both Plexus JARs contain matching GA/version `pom.properties`; filenames alone were not the
only identity evidence. Core class-entry hashes retained for the inspected resolver/realm code:

| Class entry under `org/apache/maven/` in Core JAR | SHA-256 |
|---|---|
| `plugin/internal/DefaultPluginDependenciesResolver.class` | `b0919c261a20c1213b71c1aa10676917911116905ab50ba953874154109b0962` |
| `plugin/internal/DefaultMavenPluginManager.class` | `b6d949203ce235b2579b6e207ef3e9e135b981eaa95829f9f8cec71a5d4811b8` |
| `classrealm/DefaultClassRealmManager.class` | `4725234e8a28c9ba18c8e96cfb64ffa6b6faedf344e83dbdb115886a767a337e` |

| Path relative to `R` | Observed SHA-256 / result |
|---|---|
| `org/apache/maven/plugins/maven-resources-plugin/3.5.0/maven-resources-plugin-3.5.0.jar` | `2c923c63a197565a3e78f2b16d762d0f49bb83250dd2b1e6286704ea0f447060` |
| Resources JAR entry `META-INF/maven/plugin.xml` | `3eefa2e5be0bc0417024a5cff71febc44522c8ed9ff66e2428ea84d759d4266d` |
| `org/apache/maven/plugins/maven-resources-plugin/3.5.0/maven-resources-plugin-3.5.0.pom` | `9f2275ca2ba3a3ab38caf6c2bc21be787c7305ea5333d1c33f52a530afc0bc7f` |
| `org/apache/maven/shared/maven-filtering/3.5.0/maven-filtering-3.5.0.pom` | `06b492b0244a82434470161f851b247271ec8fdaeea1c29de98abde066f80c64` |
| `org/codehaus/plexus/plexus-build-api/1.2.0/plexus-build-api-1.2.0.pom` | `47c7b0e65718ca89df6fdf5cb3f24a49e076cacd9499236c7e18ad78e993cddb` |
| `org/apache/maven/plugins/maven-plugins/47/maven-plugins-47.pom` | `58ddbb8e429cb5e9054c2f5f7b7cdfeb7adbcdfda21d92b67f67fa2b94edf982` |
| `org/apache/maven/shared/maven-shared-components/47/maven-shared-components-47.pom` | `3bd3d07c910477091bb9602f931f696c4aa115c86a322bff6a604ec7543afc07` |
| `org/apache/maven/maven-parent/47/maven-parent-47.pom` | `82d0112ba1907ff5fd13a2485829c97df66c6a81e075359a561a422f7d1582d3` |
| `org/codehaus/plexus/plexus-component-annotations/2.2.0/plexus-component-annotations-2.2.0.{jar,pom}` | Both `MISSING_IN_REPOSITORY`; SHA-256 `NOT-APPLICABLE` |
| `org/codehaus/plexus/plexus-classworlds/2.9.0/plexus-classworlds-2.9.0.{jar,pom}` | Both `MISSING_IN_REPOSITORY`; SHA-256 `NOT-APPLICABLE` |

Hashes do not admit these tools/dependencies. Full parent/profile/mediation closure belongs
to the separate Q02 graph reconciliation. This record does not extend the former inventory
into a resolved-graph certificate or claim an independently reproduced publisher build.

## 5. Verification disposition and standards tailoring

| Objective / method / oracle | Actual result / disposition |
|---|---|
| Identify missing files at exact coordinates through read-only path checks | Observed both pairs absent; `OBSERVED`, not a build failure |
| Compare descriptor, cached POM boundaries and exact-version primary source | Completed bounded static analysis; conclusion in §1/§3; Project Reviewer review `NOT-RUN` |
| Check installed core exports and resolver order through ZIP/XML/disassembly | Completed read-only inspection; local hash pins in §4; no runtime class-loading PASS |
| Resolve complete effective Q02 graph under final controlled POM/session | `NOT-RUN`; final POM/profile/override/extension configuration not qualified here |
| Build/run Resources or Boot, tests, TLS/DB/port/preview/verifier | `NOT-RUN`; outside this research action |
| Rights admission / command execution approval / gate acceptance | `NOT-RUN`; separate controlled dispositions required |
| Document/link validator | `NOT-RUN`; no repository verifier was invoked |

Tailoring under [IE-STD-AUTH-001](../agents/product-document-authoring-standard.md):
`STD-INFO-001`, ISO/IEC/IEEE 15289:2019, `STANDARD-GUIDED`, applies to identity,
ownership, traceability and evidence limits. `STD-CM-001`, ISO 10007:2017,
`STANDARD-GUIDED`, applies to exact source/distribution/cache identities.
`STD-TEST-001…004`, ISO/IEC/IEEE 29119-1:2022, -2:2021, -3:2021, -4:2021,
`STANDARD-GUIDED`, is tailored to the observation procedure and explicit separation of
planned versus actual execution. This informative research is not a requirement or architecture
decision document; requirement/architecture/data contract fields are `NOT-APPLICABLE`.
No conformity, legal clearance or qualification PASS is claimed.

| Version | Date | Change |
|---|---|---|
| 0.1 | 2026-10-03 | Distinguish Resources POM scope/exclusion paths, core package imports and GA realm filtering; pin read-only installed evidence and preserve NOT-RUN execution |
| 0.2 | 2026-10-03 | Retain complete installed core export policy, intersect four static plugin acquisition graphs, and distinguish resolution inputs from plugin realm constituents |
| 0.3 | 2026-10-03 | Refresh successor graph digest after cache-hash repair; inventory 52 installed distribution JARs and bounded Plexus/Sisu legal evidence; preserve unresolved F05 rights gates |
| 0.4 | 2026-10-03 | Correct direct-optional plugin collection: final Boot acquisition graph39 / potential own-realm36; preserve unpublished32-node observation lineage and all legal gates |

## 6. Complete installed core artifact export set

The installed Core JAR descriptor hashed in §4 contains exactly **47 exported artifact keys**.
The following is the complete ordered GA set observed in that entry, corroborating S08.
These keys have no version, classifier or type qualifier. This is a factual identity inventory,
not copied implementation code or permission to substitute repository files.

```text
classworlds:classworlds
org.codehaus.plexus:plexus-classworlds
org.codehaus.plexus:plexus-component-api
org.codehaus.plexus:plexus-container-default
plexus:plexus-container-default
org.sonatype.spice:spice-inject-plexus
org.sonatype.sisu:sisu-inject-plexus
org.eclipse.sisu:org.eclipse.sisu.plexus
org.apache.maven:maven-artifact
org.apache.maven:maven-aether-provider
org.apache.maven:maven-resolver-provider
org.apache.maven:maven-artifact-manager
org.apache.maven:maven-compat
org.apache.maven:maven-core
org.apache.maven:maven-error-diagnostics
org.apache.maven:maven-lifecycle
org.apache.maven:maven-model
org.apache.maven:maven-model-builder
org.apache.maven:maven-monitor
org.apache.maven:maven-plugin-api
org.apache.maven:maven-plugin-descriptor
org.apache.maven:maven-plugin-parameter-documenter
org.apache.maven:maven-plugin-registry
org.apache.maven:maven-profile
org.apache.maven:maven-project
org.apache.maven:maven-repository-metadata
org.apache.maven:maven-settings
org.apache.maven:maven-settings-builder
org.apache.maven:maven-toolchain
org.apache.maven.wagon:wagon-provider-api
org.apache.maven.resolver:maven-resolver-api
org.apache.maven.resolver:maven-resolver-spi
org.apache.maven.resolver:maven-resolver-impl
org.apache.maven.resolver:maven-resolver-util
org.apache.maven.resolver:maven-resolver-connector-basic
javax.inject:javax.inject
javax.annotation:javax.annotation-api
org.slf4j:slf4j-api
org.fusesource.jansi:jansi
org.sonatype.aether:aether-api
org.sonatype.aether:aether-spi
org.sonatype.aether:aether-impl
org.eclipse.aether:aether-api
org.eclipse.aether:aether-spi
org.eclipse.aether:aether-impl
org.eclipse.aether:aether-util
org.eclipse.aether:aether-connector-basic
```

Notably absent: `org.codehaus.plexus:plexus-component-annotations`, Plexus Utils,
Plexus XML, Maven Archiver and Maven Common Artifact Filters. A matching package import
does not add an artifact key to this list. A non-exported dependency is not removed merely
because it is related to Maven or Plexus.

## 7. Package imports and observed core providers

The same installed descriptor contains these **66 package/type import keys**, reproduced as
factual names to pin the exact observed import policy:

```text
org.apache.maven.*
org.apache.maven.artifact
org.apache.maven.classrealm
org.apache.maven.cli
org.apache.maven.configuration
org.apache.maven.exception
org.apache.maven.execution
org.apache.maven.execution.scope
org.apache.maven.graph
org.apache.maven.lifecycle
org.apache.maven.model
org.apache.maven.monitor
org.apache.maven.plugin
org.apache.maven.profiles
org.apache.maven.project
org.apache.maven.reporting
org.apache.maven.repository
org.apache.maven.rtinfo
org.apache.maven.settings
org.apache.maven.toolchain
org.apache.maven.usability
org.apache.maven.wagon.*
org.apache.maven.wagon.authentication
org.apache.maven.wagon.authorization
org.apache.maven.wagon.events
org.apache.maven.wagon.observers
org.apache.maven.wagon.proxy
org.apache.maven.wagon.repository
org.apache.maven.wagon.resource
org.eclipse.aether.*
org.eclipse.aether.artifact
org.eclipse.aether.collection
org.eclipse.aether.deployment
org.eclipse.aether.graph
org.eclipse.aether.impl
org.eclipse.aether.internal.impl
org.eclipse.aether.installation
org.eclipse.aether.metadata
org.eclipse.aether.repository
org.eclipse.aether.resolution
org.eclipse.aether.spi
org.eclipse.aether.transfer
org.eclipse.aether.version
org.eclipse.aether.util
org.codehaus.plexus.classworlds
org.codehaus.classworlds
org.codehaus.plexus.util.xml.Xpp3Dom
org.codehaus.plexus.util.xml.pull.XmlPullParser
org.codehaus.plexus.util.xml.pull.XmlPullParserException
org.codehaus.plexus.util.xml.pull.XmlSerializer
org.codehaus.plexus.*
org.codehaus.plexus.component
org.codehaus.plexus.configuration
org.codehaus.plexus.container
org.codehaus.plexus.context
org.codehaus.plexus.lifecycle
org.codehaus.plexus.logging
org.codehaus.plexus.personality
javax.inject.*
javax.annotation.*
javax.annotation.security.*
org.slf4j.*
org.slf4j.spi.*
org.slf4j.helpers.*
org.slf4j.event.*
org.fusesource.jansi.*
```

`CoreExports` maps these keys to the exporting core realm. S09 builds `maven.api` with those
foreign imports; S05 normally imports from `maven.api` when no project realm supplies the
default import. S09 also uses the ClassWorld loader as plugin parent. Thus the four plugin
graphs below can obtain Maven/Aether/Sisu/Inject/SLF4J interfaces through the Maven boundary
even when their acquired same-GA JAR is omitted from the plugin's own constituent URLs.
This is static import-policy evidence. Actual class lookup, linkage compatibility and arbitrary
project/core extension effects remain `NOT-RUN`.

Additional observed providers, relative to distribution root `M` from §4:

| Core provider path | SHA-256 |
|---|---|
| `lib/maven-resolver-api-1.9.27.jar` | `a895d222283666a7320ddc76615e2e93a41fabd93ce9a6bf9ddee39272bb87b4` |
| `lib/org.eclipse.sisu.plexus-1.0.0.jar` | `865b5300034fc08c790215d7d97f141914c932191bef9338a7dcef589f7536e9` |
| `lib/slf4j-api-1.7.36.jar` | `d3ef575e3e4979678dc01bf1dcce51021493b4d11fb7f1be8ad982877c16a1c0` |
| `lib/javax.inject-1.jar` | `91c77044a50c481636c32d916fd89c9118a72195390452c81065080f957de7ff` |

Resolver Util 1.9.27 is pinned in §4. Resolver/Sisu/SLF4J embedded `pom.properties` matched
the filenames; the Inject JAR lacked that entry and its bytes match the cached Inject 1 hash
already recorded in the plugin cache table. None of these observations admits new tooling.

## 8. Four static acquisition graphs versus plugin realm constituents

The successor [static effective graph table](inventories/f05a-q02-effective-graphs.tsv)
was inspected from the primary preparation worktree on 2026-10-03. Its observed SHA-256 was
`16d6ba387e05987a4a7e48e6d978d19f5fdc8e6ac94cec8801770f6bdf0a217c`.
This supersedes the earlier observation digest
`267d4d36bbc20736c491a7c730c7e58ecc90226ff6eb2d5ab7e819af4675256e`
after the Resources Utils 3.6.0 pending-cache field was repaired with its actual path/hash;
the graph coordinates and counts did not change.
This research independently crosschecks its row counts and GA intersection with the installed
47-key set; it does not claim a second full Maven effective-model/resolver execution.

**Superseded unpublished observation:** that snapshot's Boot32-node graph omitted the
direct optional Maven Shade Plugin3.6.0 path. It was not a complete acquisition closure.
The auditor's optional-depth selector has now been corrected and rerun read-only:
plugin collection has a non-null root, and Resolver permits its direct optional dependencies.
The current graph table SHA-256 is
`F7EDDBCA7C6B102D3FC6778573A7FC9B05E5E8F046F06B5E6E75A93C9B900257`.
It has116 rows /100 unique acquisition coordinates; Boot39, application38, Resources9,
Compiler14 and Jar16. Seven added nodes are Shade3.6.0, Utils3.5.1,
ASM/ASM-Commons/ASM-Tree9.7, JDOM2 2.0.6.1 and jdependency2.10.
Their exact cache pairs and rights are retained in the
[current Q02 intake](2026-10-03-f05a-t027-q02-intake.md#3-exact-buildplugin-acquisition-closure-and-maven-core).
The table below now describes the corrected graph, not the earlier32-node observation.
No Maven execution was used to establish or repair either snapshot.

The table's column named `realm` identifies an acquisition graph grouping; its rows are
**pre-core-filter dependencies**, not observed URLs in a running plugin realm. Counts include
each plugin root. Full POM parent/import/model input closure is additional to these JAR-node
counts and remains necessary for offline model reconstruction.

| Plugin graph | Static acquisition JAR-node count | Exact coordinates matching core export GA | Potential own-realm constituents after only this filter |
|---|---:|---|---:|
| Resources 3.5.0 | 9 | `org.eclipse.sisu:org.eclipse.sisu.plexus:0.9.0.M4`; `javax.inject:javax.inject:1`; `org.slf4j:slf4j-api:1.7.36` | 6 |
| Compiler 3.15.0 | 14 | `javax.inject:javax.inject:1`; `org.slf4j:slf4j-api:1.7.36` | 12 |
| Jar 3.5.1 | 16 | `javax.inject:javax.inject:1`; `org.slf4j:slf4j-api:1.7.36` | 14 |
| Boot Maven Plugin 4.1.1 | 39 | `org.apache.maven.resolver:maven-resolver-api:1.4.1`; `org.apache.maven.resolver:maven-resolver-util:1.4.1`; `org.slf4j:slf4j-api:1.7.36` | 36 |

Resources 9 agrees with its inspected POM paths: root, Filtering, Utils 3.6.0, Interpolation,
Build API 1.2.0, legacy Build API 0.0.7, Sisu Plexus, Inject and SLF4J. Compiler 14 includes
Plexus XML 3.0.1 through Compiler Manager, beyond the old flat descriptor list; its selected
Utils is 4.0.2. Jar 16 includes its root and selects Utils 4.0.3. The corrected Boot graph
includes no Inject 1 node; the root's exclusions on Common Artifact Filters remove that
path. If a successor graph adds an unexcluded Inject path, it remains an acquisition input
before core filtering. These are static consistency observations, not qualified lifecycle counts.

Two categories remain distinct:

- **Excluded before acquisition:** the Resources annotations/classworlds paths identified in
  §3 are eliminated by POM scope/exclusion selectors. The historic flat descriptor rows remain
  absent in the repository; this source finding supplies a reason they are not included in the
  bounded successor Resources acquisition graph.
- **Acquired, then excluded from the plugin realm:** every coordinate in the table's third
  column remains in the acquisition graph with its actual JAR/POM bytes and hashes. For
  example, Boot's Resolver 1.4.1 JARs/POMs are still model/resolution inputs, although core
  provides Resolver 1.9.27 classes after realm filtering. Resources Sisu 0.9.0.M4 is still
  acquired although the exporting core supplies Sisu 1.0.0. Dropping these acquired rows or
  relabeling their versions as the core provider would conflate two different identities.

No acquisition count is reduced to its own-realm count for cache or rights review. The
default resolver resolves before `DefaultClassRealmManager` filters constituents; its filter
does not prevent the acquisition request. Engineering interpretation for the proposed offline
package: retain both acquired artifact pins and installed provider pins; drift in either
identity reopens review. No install/copy/override has been performed to make the versions match.

The table's 38-node application grouping is separate from plugin realms. In particular,
application SLF4J 2.0.18 is not replaced by Maven SLF4J 1.7.36 or removed with the plugin GA
filter. The Maven filter also does not prune this Boot application's packaged dependencies.
Repackaging/class-loader behavior still needs its own qualification evidence.

These counts express only the installed standard core GA policy applied to the supplied
static graphs. Project/core extensions, realm delegates, missing files, command changes or
effective-model differences can change actual constituents. Runtime graph/realm confirmation,
legal disposition and build/qualification execution remain `NOT-RUN`.

## 9. Installed distribution inventory and bounded F05 rights observations

The [distribution TSV](inventories/f05a-q02-maven-distribution.tsv) records **52** top-level
`M/lib/*.jar` and `M/boot/*.jar` files, with exact paths/SHA-256 and embedded legal-entry
names/hashes. This inventory covers installed distribution bytes; it is not an observed
runtime class-load list or a product dependency inventory. Installed extension subdirectory
contents are not silently included in these 52 top-level rows.

Coordinates normally come from embedded `pom.properties`. ASM 9.9.1, Inject 1 and JSpecify
1.0.0 lack those entries; their bytes were matched to the exact cached coordinate JARs.
AOP Alliance 1.0 and Guice 5.1.0 classes JARs also lack them, and the exact repository
counterparts were absent. Those two rows retain `UNKNOWN_EMBEDDED_COORDINATE` with their
exact filenames, paths and hashes; qualified coordinate provenance remains `UNKNOWN`.
Do not infer a Guice classifier/source identity solely from the filename.

The installed Plexus/Sisu subset is exhaustive for top-level `lib` and `boot` JAR filenames.
No Plexus XML JAR was observed in that subset. The following names are relative to `M`;
all GA/version identities in this table were observed in embedded `pom.properties`.

| Coordinate | JAR path | SHA-256 | Bounded F05 rights state |
|---|---|---|---|
| `org.codehaus.plexus:plexus-utils:3.6.1` | `lib/plexus-utils-3.6.1.jar` | `05a63effd67e2d6b9d610cc82e2bd7473289d34802e57a529b28110f28af5679` | `BLOCKED-LEGAL`: supplemental custom terms; no inherited F05 exception |
| `org.codehaus.plexus:plexus-cipher:2.0` | `lib/plexus-cipher-2.0.jar` | `9a7f1b5c5a9effd61eadfd8731452a2f76a8e79111fac391ef75ea801bea203a` | Apache-2.0; `APPROVED-WITH-OBLIGATIONS` Engineering disposition for unchanged internal core-tool use; execution `NOT_ADMITTED` |
| `org.codehaus.plexus:plexus-sec-dispatcher:2.0` | `lib/plexus-sec-dispatcher-2.0.jar` | `873139960c4c780176dda580b003a2c4bf82188bdce5bb99234e224ef7acfceb` | Apache-2.0; `APPROVED-WITH-OBLIGATIONS` Engineering disposition for unchanged internal core-tool use; execution `NOT_ADMITTED` |
| `org.codehaus.plexus:plexus-component-annotations:2.2.0` | `lib/plexus-component-annotations-2.2.0.jar` | `50edb93c73786e62822b4fe1336e22880fdf147191373cf5c911370e16748fcf` | Apache-2.0; `APPROVED-WITH-OBLIGATIONS` Engineering disposition for unchanged internal core-tool use; execution `NOT_ADMITTED` |
| `org.codehaus.plexus:plexus-interpolation:1.29` | `lib/plexus-interpolation-1.29.jar` | `088d444dbcedfb384630d8686697ece3c401d6f33c8f8b3aa7259ea1c6996878` | `BLOCKED-LEGAL`: exact-byte source evidence identifies custom/legacy Apache-1.1 headers; adjacent Apache-2.0 file does not settle them |
| `org.codehaus.plexus:plexus-classworlds:2.11.0` | `boot/plexus-classworlds-2.11.0.jar` | `8971f135490070bc5fde7413fcc8db7c997fda4bebfb5c31185900d66edcbbb2` | Apache-2.0; `APPROVED-WITH-OBLIGATIONS` Engineering disposition for unchanged internal core-tool use; execution `NOT_ADMITTED` |
| `org.eclipse.sisu:org.eclipse.sisu.inject:1.0.0` | `lib/org.eclipse.sisu.inject-1.0.0.jar` | `3ab8d7bfe68f3b6ec95c1a0a47e628edbc9d76e90634cb0a0ba121fbb11b8e42` | `BLOCKED-LEGAL`: EPL-2.0 qualification/disposition for this use outstanding |
| `org.eclipse.sisu:org.eclipse.sisu.plexus:1.0.0` | `lib/org.eclipse.sisu.plexus-1.0.0.jar` | `865b5300034fc08c790215d7d97f141914c932191bef9338a7dcef589f7536e9` | `BLOCKED-LEGAL`: EPL-2.0 qualification/disposition for this use outstanding |

For Cipher, Dispatcher, Annotations, Interpolation and Classworlds no embedded filename
containing license/notice/copyright was observed. Adjacent distribution legal files provide
actual terms; absence inside a JAR is not absence of rights. This bounded inspection does not
close upstream source/authenticity, distribution-wide notices or the future commercial gate.

The Interpolation JAR hash matches the acquired 1.29 JAR inspected in
[IE-RES-F05A-Q02-PLEXUS-RIGHTS-20261003](2026-10-03-f05a-q02-plexus-rights.md),
claim C03 and source S-INT. That exact-source evidence identifies four Apache-1.1 headers,
three with altered Codehaus acknowledgement/contact wording, plus one headerless mapped
source. The `BLOCKED-LEGAL` disposition applies equally to these installed identical bytes.
This record reuses that evidence with its stated source-to-binary limits; it does not infer
uniform Apache-2.0 licensing from the adjacent distribution file.

The ordinary Apache-2.0 rows above are controlled Engineering rights dispositions limited
to unchanged installed core components as internal T027 tooling, not execution admission.
Engineering retains actual license/notice material,
respects attribution/trademark/patent conditions, and reopens intake on modified/distributed
use. Final reviewed F05 scope/command admission remains `NOT-RUN`; a recommendation is
not acceptance or permission to execute.

| Exact adjacent legal paths, relative to `M` | SHA-256 / read result |
|---|---|
| `lib/plexus-cipher.license`; `lib/plexus-sec-dispatcher.license`; `lib/plexus-component-annotations.license`; `lib/plexus-interpolation.license`; `lib/plexus-utils.license`; `boot/plexus-classworlds.license` | Each `cfc7749b96f63bd31c3c42b5c471bf756814053e847c10f3eb003417bc523d30`; byte-identical Apache-2.0 text; full unique text read |
| `lib/org.eclipse.sisu.inject.license`; `lib/org.eclipse.sisu.plexus.license` | Each `209fe24bf55677bbf81c2b0481c1403201fab57b3b4c609971eba4ec8162b99c`; byte-identical EPL-2.0 text; full unique text read |

Utils 3.6.1 additionally carries the following embedded entries, all read in full except the
Apache LICENSE text, whose hash is identical to the fully read adjacent Apache legal file:

| Entry in `lib/plexus-utils-3.6.1.jar` | SHA-256 / observation |
|---|---|
| `META-INF/LICENSE` | `cfc7749b96f63bd31c3c42b5c471bf756814053e847c10f3eb003417bc523d30`; Apache-2.0 |
| `META-INF/NOTICE` | `d478d95476787007320df9dafb15c932849281e2ace56e2aacdac475d29470d7`; attribution names include Extreme Lab, ASF, ThoughtWorks, Javolution and Rome |
| `licenses/extreme.indiana.edu.license.TXT` | `0d01b41cfc401bcf852125959d07b1a6bd578f1a7850907c329e4a70b2874db2`; Indiana University Extreme Lab 1.1.1, custom acknowledgement/name conditions |
| `licenses/javolution.license.TXT` | `a7436c952fa2dc0701860cf4187d1e8e8e6de6720dec0ae9e0b641bc50eebced`; source/binary notice retention conditions |
| `licenses/thoughtworks.TXT` | `b2f730309348c7a19009dcadd92a5d55d75fd54e6df4a818eba7a388656faed9`; source/binary notice retention and endorsement restriction |

Engineering observation: retaining only the adjacent Apache file would omit Utils' additional
terms/notices. Sisu's EPL-2.0 includes source-availability conditions when distributing the
program and commercial-distributor provisions. This record does not choose a secondary
license, establish whether any future offering is a modified work, or approve commercial use.
The Legal Review Authority owns resolution of these custom/copyleft questions before F05 use
is admitted; the Project Reviewer owns the exact internal tooling scope and command package.
Missing source/rights qualification remains `BLOCKED-LEGAL` when it prevents that disposition.

Historical P04 admission of installed Maven is a separate historical disposition. This record
neither revokes that history nor treats it as a new F05 exception for Utils 3.6.1, Sisu 1.0.0
or any acquired plugin/runtime component. Preserve the installed legal files; no third-party
source/legal text or binaries were imported or changed during this research.

Inspection utility identity: existing `/usr/bin/python3` resolves to `/usr/bin/python3.14`,
version `3.14.4 (main, Aug 20 2026, 10:41:58) [GCC 15.2.0]`, binary SHA-256
`52e0a13e60a981d8c4b6478be2ba5176f69da07948a056bf49cf6f077e30cb41`.
Its standard-library ZIP/XML reads served this read-only inspection only. Python is
`NOT_ADMITTED` as an F05 qualification harness/build/runtime dependency; no such use or
license qualification follows from inspecting files with it. The same distinction applies
to `javap` disassembly. No host files were written, Maven/plugin code executed, package
network access initiated, SDK/package installed, timer/verifier run, commit or push performed.


## 10. Evidence-only rights repair and remaining decision gates (successor 0.5)

This bounded successor closes metadata/evidence gaps in §9; it does not replace the primary
worktree's v0.4 graph correction. Current parent evidence at `4ef16ffe` is Boot **39**, application
**38**, Resources **9**, Compiler **14**, Jar **16**. The parent's corrected graph hash is
`f7eddbca7c6b102d3fc6778573a7fc9b05e5e8f046f06b5e6e75a93c9b900257`.
The original worker's Boot32 draft was superseded by the current §8 Boot39 correction;
this rights-only successor preserves that correction and does not reintroduce its old count.
No new effective-model or resolver execution was performed here.

### 10.1 Exact distribution provenance and repaired coordinates

The installed distribution's root `M/LICENSE` explicitly maps its third-party paths to
coordinates and adjacent legal files; SHA-256
`f414d4d8d468fb5bfd42bb8157c8bdca72255264e13060fb4ce2669b960fe12b`.
Root `M/NOTICE`, SHA-256
`9739dd84556b9458e60c049a24f4c78f3146b0d57cddaf5b4fbfb2f71da259eb`,
was read in full and must be retained. Its Utils 3.2.1 and Sisu 0.3.5 headings are stale
relative to installed 3.6.1 and 1.0.0; those headings do not override installed identity or
actual embedded/adjacent terms. The distribution mapping and actual legal files settle ordinary
tool-component rights evidence; a separate upstream audit of every filename is not required
merely because it lacks an embedded POM. This is not independent release authentication.

`lib/aopalliance-1.0.jar` is now identified as `aopalliance:aopalliance:1.0` by the exact
distribution path/GAV mapping. The JAR contains nine expected `org/aopalliance` classes;
its minimal manifest has no GAV. Its SHA-256 remains
`0addec670fedcd3f113c5c8091d783280d23f75e3acb841b61a9cdb079376a08`.
Adjacent `lib/aopalliance.license` contains the complete two-word text `Public Domain`,
SHA-256 `f6960be1b71d602352d7d9de76a564f54f3dab550b23fa5674049f842116ca55`.
The [AOP Alliance owner page](https://aopalliance.sourceforge.net/) explicitly declares all
its supplied source code public domain. Combined with Apache's exact release mapping, this
repairs the missing rights/provenance evidence for unchanged internal tooling; it is not a
claim of a separate SPDX license identifier or a commercial-distribution legal opinion.

`lib/guice-5.1.0-classes.jar` is `com.google.inject:guice:5.1.0`, type `jar`, classifier
`classes`, not the unclassified standard JAR. Its SHA-256 remains
`142ad4475e19524d2fe3ac995b3f7cbc962fc726f2edb9dbdccc61feab9b2bf9`.
The [exact Maven release parent POM](https://github.com/apache/maven/blob/maven-3.9.16/pom.xml)
sets Guice 5.1.0 and manages that classifier. Installed Core and Embedder embedded POMs declare
the same classifier; their `META-INF/maven/org.apache.maven/{maven-core,maven-embedder}/pom.xml`
entry hashes are respectively
`186f17628c5235d03e34c593122d05fdc1be9694440a54d8213b3f957d6379a4` and
`b3fe6f3e04ed4e4f5dd2fcf58359d3c1c9da4e5e877a8e916b620e97f8913f30`.
The Guice manifest identifies Google, `com.google.inject`, version 5.1.0 and Apache-2.0;
entry SHA-256 `c879f5449e5d2a9c61a364195f2bfb5dff91c091a4be07ef74f0bd7098369019`.
Its embedded Apache license is byte-identical to the fully read text in §9; its embedded
Google/ASF NOTICE has SHA-256
`7e7f20226f26a1c2693c5422fc14c1c961d2b56c928d60ac881ab5ad4735025f` and was read in full.
Root `M/LICENSE` omits the `classes` suffix in its Guice path; the independent release POM,
installed POMs, manifest and actual embedded grant repair that metadata omission without
pretending the standard JAR was acquired or substituting any bytes.

### 10.2 Per-row rights proposal, actual obligations and authority boundary

The 52-row distribution TSV now separates `classifier`, `identity_basis`, `rights_basis`,
`obligation_set`, and `proposed_rights_disposition` from existing `f05_disposition`.
**47** ordinary rows have `APPROVED-WITH-OBLIGATIONS_PROPOSED`; **5** have `BLOCKED-LEGAL`.
The separate `rights_intake_disposition` promotes the47 ordinary evidence proposals to
Engineering `APPROVED-WITH-OBLIGATIONS`, matching the Q02 intake's bounded rights-only
method. Five legal rows remain blocked. This is not reviewed scope/execution acceptance.
Every execution field remains `NOT_ADMITTED`.
`M/` in the TSV means exact root `M` from §4; `JAR!` means that row's actual ZIP entry.
Filename matches for `.class` entries containing “License” do not constitute legal grants.

| Obligation set / count | Actual evidence and bounded obligations |
|---|---|
| `AP2` / 44 | Exact Apache-2.0 embedded text or distribution-mapped adjacent text. Preserve license, copyright, attribution and applicable NOTICE material; identify changes if modified; no implied trademark license; retain patent/termination and warranty provisions. Unchanged internal use is the proposal; redistribution/modification reopens intake. |
| `BSD3` / 1, ASM 9.9.1 | `lib/asm.license`, SHA-256 `8c920015a749851edea93f71116d45dcd6beefa6069b6baf526c0adcaf26979c`, fully read BSD-3-Clause: source retains notices/conditions/disclaimer, binary distributions reproduce them in documentation/materials, no endorsement without permission. |
| `MIT` / 1, SLF4J API 1.7.36 | `lib/slf4j-api.license`, SHA-256 `6fbe2eaf44b193b8a40eed9208f52848572224ad8d7672dd09418aa174847e73`, fully read: retain copyright and permission notice in copies/substantial portions and preserve disclaimer. |
| `PD` / 1, AOP Alliance 1.0 | Exact mapping, adjacent text and owner declaration in §10.1. Retain provenance/legal material under repository intake policy; no new copyleft or custom contractual condition observed. Scope acceptance remains separate. |

The 19 adjacent Apache legal files share SHA-256 `cfc7749b96f63bd31c3c42b5c471bf756814053e847c10f3eb003417bc523d30`:
`commons-cli`, `commons-codec`, `error_prone_annotations`, `failureaccess`, `gson`, `guava`,
`guice`, `httpclient`, `httpcore`, `jansi`, `javax.inject`, `jcl-over-slf4j`, `jspecify`,
`plexus-cipher`, `plexus-component-annotations`, `plexus-interpolation`, `plexus-sec-dispatcher`,
`plexus-utils` under `lib/*.license`, plus `boot/plexus-classworlds.license`.
Commons CLI/Codec embedded Apache texts differ only by blank-line formatting and the sample
license URL's `http`→`https`; read-only comparison found no changed operative clauses.
Retaining the actual complete distribution and embedded notice files covers the ordinary
proposal; generic Apache labeling does not override supplemental/custom terms below.

| Genuine core decision row | Evidence / decision still required |
|---|---|
| Utils 3.6.1 | Exact JAR and supplemental legal hashes in §9. Extreme Lab custom acknowledgement/name terms survive the adjacent Apache label. Legal Review Authority must disposition this exact internal-tool use and its obligations. |
| Interpolation 1.29 | Exact bytes and reused source-to-binary evidence in §9: legacy Apache-1.1/modified Codehaus headers and headerless mapped source. Authority disposition remains required; a distribution label alone cannot waive the contrary source evidence. |
| Sisu Inject 1.0.0 and Sisu Plexus 1.0.0 | Exact JARs and fully read EPL-2.0 adjacent texts in §9. The grant is known, not missing. Authority must record the scoped copyleft exception/obligations; no secondary-license choice or commercial clearance is inferred. |
| Javax Annotation API 1.3.2 | Installed JAR SHA-256 is in the TSV. Embedded `META-INF/LICENSE.txt` SHA-256 `a4c80869daf4350b6773bd5e6ee1d0a6cc52b63db3a3d2dc20961b0cdd272a5c` starts with CDDL 1.0 and includes GPLv2/Classpath text. Adjacent `lib/javax.annotation-api.license` SHA-256 `1b087ad282cb3cd0a11e4e160318eab4ff0995aae7d22e6ac0d30367e196c6e3` starts with CDDL 1.1 and includes GPLv2/Classpath text. Actual grant/exception text is available; this is a version/choice and scoped-copyleft decision, not a no-license finding. Authority must record the chosen route, preserve notices and establish any distribution source obligations; file-header applicability of the exception is not certified by this ZIP inspection. |

CDDL executable distribution invokes corresponding source availability and license/notice
conditions; GPLv2 has source/offer conditions on distributed binaries; the Classpath exception
permits linking qualifying independent modules under their own terms but does not erase the
library's terms or prove applicability to every file. No distribution, modification, license
choice or exception waiver occurred here. These five rows remain `BLOCKED-LEGAL` pending an
exact, attributed decision even though their legal material has been found.

Historical provenance is specifically [F01 dependency intake](2026-09-28-ph1-f01-dependency-intake.md),
§2 Apache Maven row: official Maven 3.9.16 ZIP, SHA-512
`ed41650d42485cfc243fad22158caf9cbb5dc408ce7a09ddb94dd42a019de929ca43065bfa450612cf12bf78b5cafa3884b96c090de326ff590448c933454af3`,
wrapper-pinned SHA-256 `5af3b743dd8b876b5c45da33b676251e5f1687712644abb4ee519ca56e1d89ce`,
build-tool-only use on the P04 host. Its bundled components remain separate from core licensing.
“P04 admitted” is shorthand for that historical host/tool context, not a claim that the P04
native-runtime intake independently reviewed all 52 JARs. This successor neither revokes
history nor expands it into F05 custom/copyleft exceptions, product runtime or customer delivery.

The Project Reviewer still owns the exact F05 internal-tool scope/command admission; Legal
Review Authority owns the five exceptions above. Qualification/build/Boot/DB/TLS/port/verifier
execution remains `NOT-RUN`. Existing Python utility identity and non-admission are unchanged
from §9. Only read-only SSH and reference-only primary text inspection occurred; no artifacts
were downloaded, installed, copied onto the host, executed, committed or pushed.


| Version | Date | Change |
|---|---|---|
| 0.5 | 2026-10-03 | Repair exact distribution coordinates and ordinary rights evidence; preserve current Boot39 graph; identify five core legal decisions without admitting execution |
