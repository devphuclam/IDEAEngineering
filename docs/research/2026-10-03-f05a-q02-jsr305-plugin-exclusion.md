# F05-A / T027 Q02 — same-version plugin dependency exclusion research

| Control | Value |
|---|---|
| Stable ID / class | `IE-RES-F05A-Q02-JSR305-EXCLUSION-20261003` / technical research record |
| Version / status | `0.2 / Draft`; research retained, bounded experiment separately authorized |
| Product normativity / instruction state | `INFORMATIVE / NOT-APPLICABLE`; neither a product requirement nor execution authorization |
| Owner / author / worker mode | Engineering / Codex / `CODEX_ONLY`, bounded reference-only research, with an isolated research worker contributing primary-source inspection |
| Reviewer / acceptance authority | Project Reviewer Nguyễn Huỳnh Phúc Lâm; review and acceptance `NOT-RUN` |
| Applicability / evidence date | Exact Boot Maven plugin `4.1.1`, Maven `3.9.16`, Resolver `1.9.27`, Tomlj `1.0.0`; internal T027 `repackage` candidate; accessed 2026-10-03 |
| Effective date | `NOT-APPLICABLE`; proposal not adopted by this record |
| Classification / retention | `INTERNAL`; retain with exact graph, source identities and successor qualification record |
| Baseline / change record | [Issue #37](https://github.com/devphuclam/IDEAEngineering/issues/37), [PR #38](https://github.com/devphuclam/IDEAEngineering/pull/38); read-only project baseline `e6cd0039e5f6da2499f61cd3cf81a9c349694fa2`; local proposal only; PR head and current execution inventories remain unchanged |
| Upstream trace | [Exact effective graph inventory](inventories/f05a-q02-effective-graphs.tsv), [rights record](2026-10-03-f05a-q02-upstream-rights.md), [intake procedure](../agents/external-source-intake.md) |
| Downstream trace | Engineering graph-narrowing decision and separately authorized Q02 isolated-repository qualification; not future commercial clearance |
| Supersedes / superseded by | `NOT-APPLICABLE / NOT-APPLICABLE`; JSR305 legal disposition is not revised |
| Review trigger | Maven/Resolver/Boot/Tomlj version, artifact hash, effective model, plugin dependency, alternate JSR305 path, goal or execution-environment change |
| Evidence / tailoring | Exact primary-source observations and separately attributed parent-worker cached-bytecode observations; source-supported inference, dynamic qualification `NOT-RUN`. [IE-STD-AUTH-001](../agents/product-document-authoring-standard.md) tailoring: ISO/IEC/IEEE 15289:2019 identity and ISO 10007:2017 trace `STANDARD-GUIDED`, no conformity claim |
| Current disposition | `REFERENCE-ONLY`; proposed same-version exclusion is technically supported by inspected source; operational graph and goal success remain `NOT-RUN` |

## Result and boundary

Standard Maven plugin dependency configuration can express the proposed narrowing: declare the
already present `org.springframework.boot:spring-boot-buildpack-platform:4.1.1` directly under
the Boot plugin's `dependencies`, with a transitive exclusion of
`com.google.code.findbugs:jsr305`. Exact Maven/Resolver source shows that this explicit dependency
is dominant over the matching dependency in the plugin artifact descriptor **before traversal**.
It does not leave two different buildpack edges to be reconciled by nearest-version selection.
The exclusion then propagates through buildpack → Tomlj to filter JSR305.

This is a source-supported proposal, not proof that the effective execution graph has changed
or `repackage` succeeds. The application POM, cached artifacts, graph, framework/version,
source implementation and licensing dispositions were not changed. No Maven, Boot, application,
plugin class, installation, package resolution, listener or verification workflow was run.
Official source text was read into memory; no remote artifact was retained or imported.

The target is the standalone T027 qualification POM proposed in
[Q02 intake §7](2026-10-03-f05a-t027-q02-intake.md#7-proposed-offline-command-package--not-run--blocked-legal),
which has not been created or executed. **Do not modify `apps/server/pom.xml` or the persistent
preview.** Its proposed Boot plugin was pinned to `4.1.1`, with `includeTools=false` and no
plugin dependencies; this proposal replaces only the latter condition. The added declaration
names an existing same-version graph component, not a new library or alternate implementation.
The intentional graph delta is removal of JSR305 from the plugin subtree, not a runtime change.
This does not settle rights in the existing JSR305 publication or permit using it elsewhere.

## Exact source identity and reviewed text

All raw SHA-256 hashes below were calculated from the HTTPS response bytes in memory on
2026-10-03. They identify the reviewed text, not a reproduced or authenticated binary build.
Release identities are [Maven `maven-3.9.16`](https://github.com/apache/maven/releases/tag/maven-3.9.16)
→ commit `2bdd9fddda4b155ebf8000e807eb73fd829a51d5`,
[Resolver `maven-resolver-1.9.27`](https://github.com/apache/maven-resolver/releases/tag/maven-resolver-1.9.27)
→ commit `bac936257dc7daf7eb14b7082551a054f16641db`, and
[Boot `v4.1.1`](https://github.com/spring-projects/spring-boot/releases/tag/v4.1.1)
→ commit `6fdf67ea1552691e932604d4bf67a5e08ff0b0ea`.
Tomlj `1.0.0` uses the previously established exact commit
`0c1f92a925461fe755f5da62a07dcdb2e9537dbe` (annotated tag
`5d5e6158a3d96d765811fa0e47dadfc3a43f8b02`).

| ID / official raw source | SHA-256 | Direct observation |
|---|---|---|
| ME-01 [Maven root POM](https://raw.githubusercontent.com/apache/maven/maven-3.9.16/pom.xml) | `5a761e32d3f3b5d65a70345cab4a327730c1d2000bb935bae7276dcc8fa81738` | Exact Maven source sets `resolverVersion` to `1.9.27`. |
| ME-02 [DefaultPluginDependenciesResolver.java](https://raw.githubusercontent.com/apache/maven/maven-3.9.16/maven-core/src/main/java/org/apache/maven/plugin/internal/DefaultPluginDependenciesResolver.java) | `81eb3943ef4ca2608cdc801aa74f1ed07dff59e3f4a2e143a2793edc4a60c872` | `resolveInternal` sets the plugin artifact as the collect root; converts each `plugin.getDependencies()` item, normalizes non-system scope to runtime, and adds it to the `CollectRequest` before collection. It retains the session selector plus a wagon exclusion. |
| ME-03 [RepositoryUtils.java](https://raw.githubusercontent.com/apache/maven/maven-3.9.16/maven-core/src/main/java/org/apache/maven/RepositoryUtils.java) | `47997a290e615ee35c73f995e17560b032cad08177bee945dfa4f050db7cee80` | `toDependency` carries model exclusions into the Aether dependency. `toExclusion` uses model group/artifact and wildcard classifier/extension. |
| ME-04 [DependencyCollectorDelegate.java](https://raw.githubusercontent.com/apache/maven-resolver/maven-resolver-1.9.27/maven-resolver-impl/src/main/java/org/eclipse/aether/internal/impl/collect/DependencyCollectorDelegate.java) | `23aa047abfa1c3f9bab6fcedcd8743fc7ec7cd1e6c9b5ebee4f598e70d94bd89` | Root descriptor dependencies are merged as recessive behind request dependencies. `mergeDeps` keeps each dominant dependency object and drops a recessive item with the same `getId`: group, artifact, classifier, extension. Version is not part of that key. |
| ME-05 [ExclusionDependencySelector.java](https://raw.githubusercontent.com/apache/maven-resolver/maven-resolver-1.9.27/maven-resolver-util/src/main/java/org/eclipse/aether/util/graph/selector/ExclusionDependencySelector.java) | `b59990c518e9d79f557c5ac8138457fed2db79640ef09b5f11ce4b0dc14c072e` | `deriveChildSelector` merges the current dependency's exclusions with inherited exclusions; `selectDependency` rejects an artifact matching group/artifact/classifier/extension, supporting `*`. |
| ME-06 [MavenRepositorySystemUtils.java](https://raw.githubusercontent.com/apache/maven/maven-3.9.16/maven-resolver-provider/src/main/java/org/apache/maven/repository/internal/MavenRepositorySystemUtils.java) | `8d661b806d0ab9a026b3bf8ec21a2db7b5a4d7b906accc36e6de358a3d22eab7` | Default session selector includes `ExclusionDependencySelector`; nearest-version conflict resolution is a separate graph transformer. |
| ME-07 [DefaultRepositorySystemSessionFactory.java](https://raw.githubusercontent.com/apache/maven/maven-3.9.16/maven-core/src/main/java/org/apache/maven/internal/aether/DefaultRepositorySystemSessionFactory.java) | `baa6275c8ba02b58e298d8faba1e2013546d0ca49a3af0509ddb13a4623b0da7` | Actual Maven session factory starts with `MavenRepositorySystemUtils.newSession()`, linking ME-06 to the normal session rather than relying on an unrelated example. |
| ME-08 [Boot plugin build.gradle](https://raw.githubusercontent.com/spring-projects/spring-boot/v4.1.1/build-plugin/spring-boot-maven-plugin/build.gradle) | `0c69f5b54dbda8099ce3df60a546121f6d0cd483589b628080e1e20497bebc46` | Plugin declares buildpack platform and loader tools project dependencies. |
| ME-09 [Buildpack platform build.gradle](https://raw.githubusercontent.com/spring-projects/spring-boot/v4.1.1/buildpack/spring-boot-buildpack-platform/build.gradle) | `c7100066f73cea5563f42fa285e890b3cec55a2141afba748b3f42674cfaad23` | Buildpack platform explicitly declares `org.tomlj:tomlj:1.0.0`. |
| ME-10 [RepackageMojo.java](https://raw.githubusercontent.com/spring-projects/spring-boot/v4.1.1/build-plugin/spring-boot-maven-plugin/src/main/java/org/springframework/boot/maven/RepackageMojo.java) | `942e98e607c6dbae325eb66f8f5c930b84701e2264b628c4bb9093a27721ad17` | The execution path constructs/configures loader-tools `Repackager` and calls its `repackage`; this file has no Tomlj or buildpack-platform imports. |
| ME-11 [AbstractPackagerMojo.java](https://raw.githubusercontent.com/spring-projects/spring-boot/v4.1.1/build-plugin/spring-boot-maven-plugin/src/main/java/org/springframework/boot/maven/AbstractPackagerMojo.java) | `5c4453171833f7ac314a5f5ac6df992d79c991849673855a72893ede29caa732` | Configures loader-tools layout/main class/layers and application artifact libraries. Custom layers use XML; this source has no Tomlj/buildpack imports. |
| ME-12 [BuildImageMojo.java](https://raw.githubusercontent.com/spring-projects/spring-boot/v4.1.1/build-plugin/spring-boot-maven-plugin/src/main/java/org/springframework/boot/maven/BuildImageMojo.java) | `761926d1ed73d7b7bac95b824576d552672f03709a54c96cfae9a831ae423974` | Separate image-building goal imports buildpack platform classes and constructs `Builder` to build its request. No image build is proposed here. |
| ME-13 [BuildpackCoordinates.java](https://raw.githubusercontent.com/spring-projects/spring-boot/v4.1.1/buildpack/spring-boot-buildpack-platform/src/main/java/org/springframework/boot/buildpack/platform/build/BuildpackCoordinates.java) | `c6a7c77f8a6693084c2225bf7a18d5952611ba917186b126045f65398cf75f37` | `fromToml(InputStream, Path)` calls `Toml.parse`; the result is read for buildpack ID, version, stacks and order. This is affirmative Tomlj usage in the buildpack implementation, not in the inspected repackage source path. |
| ME-14 [Tomlj build.gradle](https://raw.githubusercontent.com/tomlj/tomlj/0c1f92a925461fe755f5da62a07dcdb2e9537dbe/build.gradle) | `f1eed8620131d401742174c40aae9f266cb84f025901c6e3c530df1f288537f8` | Production dependencies include ANTLR runtime and JSR305 under `compile`. JSR305 is not declared `compileOnly` here. |
| ME-15 [Tomlj package-info.java](https://raw.githubusercontent.com/tomlj/tomlj/0c1f92a925461fe755f5da62a07dcdb2e9537dbe/src/main/java/org/tomlj/package-info.java) | `1dc5d4c19258e40361ef45bef68ea6b68edc9bcb306ce687aaad9a6764d5ee90` | Package is annotated with `javax.annotation.ParametersAreNonnullByDefault`. |
| ME-16 [Tomlj Parser.java](https://raw.githubusercontent.com/tomlj/tomlj/0c1f92a925461fe755f5da62a07dcdb2e9537dbe/src/main/java/org/tomlj/Parser.java) | `25dd1211e8e4dbcf930493f9db8129638ab49cd5b8d5541f2ebc1d45a16e1558` | Parsing uses ANTLR lexer/parser and visitors; inspected JSR305 usage is the `Nullable` annotation, not a JSR305 executable parsing API. |

## Mechanism: observation → inference

ME-02 and ME-03 establish that a dependency declared inside the plugin element becomes an
explicit collect dependency with its exclusions intact. ME-04 establishes the missing decisive
step: explicit request dependencies dominate same-key root-descriptor dependencies. For the
same existing unclassified JAR buildpack dependency, the plugin POM's corresponding buildpack
item is discarded, and the explicit item's exclusion remains attached. This conclusion is
not dependent on an assumption that two parallel paths happen to choose the right exclusion.

ME-05 through ME-07 establish exclusion selection and inheritance. When the selected buildpack
edge introduces the JSR305 group/artifact exclusion, descendants inherit it, including Tomlj's
JSR305 dependency. Exclusion matches the component, not only version `3.0.2`; its intended scope
here is the already inventoried subtree. If another unexcluded path introduces JSR305, that path
can still retain it and must be checked in the complete effective graph.

Expected delta, conditional on the actual effective plugin model using this declaration:

| Baseline path | Proposed result |
|---|---|
| Boot plugin `4.1.1` → buildpack platform `4.1.1` | Same component/version; explicit collect edge carries exclusion |
| buildpack platform → Tomlj `1.0.0` | Retained |
| Tomlj → ANTLR runtime `4.7.2` | Retained; no ANTLR exclusion proposed |
| Tomlj → JSR305 `3.0.2` | Filtered from this subtree; total-graph absence `NOT-RUN` |
| Boot plugin → loader tools `4.1.1` and remaining dependencies | No intended change |

Project dependencies and plugin dependencies are separate. An application dependency exclusion
does not implement this plugin-realm change. Nor does Boot's repackage archive `excludes`
configuration remove the plugin's own dependency. The exclusion belongs inside a plugin
dependency, not directly below the plugin element and not on an added JSR305 dependency itself.

## Proposed configuration, not applied

In the future standalone qualification POM, pin the following Boot plugin stanza.
Do not apply it to a product POM in this proposal-only task. Keep the application's 38-JAR
selection, Java 25 release and the other three admitted plugins unchanged.

```xml
<plugin>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-maven-plugin</artifactId>
  <version>4.1.1</version>
  <configuration>
    <includeTools>false</includeTools>
  </configuration>
  <dependencies>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-buildpack-platform</artifactId>
      <version>4.1.1</version>
      <type>jar</type>
      <scope>runtime</scope>
      <exclusions>
        <exclusion>
          <groupId>com.google.code.findbugs</groupId>
          <artifactId>jsr305</artifactId>
        </exclusion>
      </exclusions>
    </dependency>
  </dependencies>
</plugin>
```

Exact stanza identity: UTF-8, LF, one trailing newline, SHA-256
`bc37c555b88e0f265a3cdcbba65a3d4215a731be259caee46d29505de1e6cb03`.
This pins the proposed snippet, **not a complete or executed POM**. The full POM, main-class
source, settings and runner must be reviewed/pinned separately before execution.

This is ordinary model configuration; no upstream POM/JAR/source patch, replacement dependency,
framework migration, shading, class deletion, optional fake implementation or license waiver is
proposed. A later Boot update must revisit the explicit version and evidence; the pin must not
silently force this buildpack version into another Boot plugin version.

## Cached identities and static-use bounds

These exact hashes come from the baseline graph inventory. The parent Engineering worker
separately reported a read-only, in-memory ZIP/constant-pool scan of the corresponding cached
JARs and `javap` inspection; this research worker did not independently repeat that scan. Reading
class bytes and disassembling them is not executing their code. No source-to-binary rebuild is
claimed. The primary worker integrated the static findings below; no dynamic qualification occurred.

| Artifact | JAR SHA-256 | POM SHA-256 |
|---|---|---|
| Boot Maven plugin `4.1.1` | `c8e1a3f44dab037f9ff23d31a1db00e937da5a56c96404d91e83fdc22c13bd56` | `cc0890a4a1aa27c128f8fb056d824ddac03bd7b480e292a42ab551965e2f12d8` |
| Buildpack platform `4.1.1` | `732e099296492e24b60894553dab8349da84dc2f02c84322ac3e6eadb7968539` | `908ca6b1639d2226826be54684b8ffe89a7da7a0e1dee00ace98aa8690fb0e48` |
| Loader tools `4.1.1` | `b26911978c785fcb894b398c5a781e409682309bf083b9587083fdd02be06a96` | `c86c88cac082444ee4733d542ea6208fdc54574b50d97beed9973ee811bd16fe` |
| Tomlj `1.0.0` | `32697c7567b2921c473678a820b13fc64700aa87bb14576eeb48d0ed5847cfd4` | `ad8192007f73450c51c880305f14dd22ac551449b721b585fc51231422cb0913` |
| JSR305 `3.0.2`, removal target only | `766ad2a0783f2687962c8ad74ceecc38a28b9f72a2d085ee438b7813e928d0c7` | `19889dbdf1b254b2601a5ee645b8147a974644882297684c798afe5d63d78dfe` |

Parent-reported bounded observations:

- All 96 Tomlj classes were scanned. Five contained JSR305-related UTF-8 constants; the only
  matching values were annotation descriptors for `Nullable` and `ParametersAreNonnullByDefault`.
  There were zero `CONSTANT_Class` JSR305 entries. Thus there were no direct JSR305 member-owner
  references and no separate literal dotted/binary JSR305 names among all inspected UTF-8
  constants. Annotation descriptor strings remain; they are not removed by an exclusion.
- `package-info.class` contains `RuntimeVisibleAnnotations` for
  `ParametersAreNonnullByDefault`. Calling this dependency categorically compile-only would be
  inaccurate. The absence of executable JSR305 owner references does not prove absence of
  computed reflection, generic annotation enumeration or VM resolution effects.
- Boot plugin's 59 classes had seven buildpack-referencing classes (`BuildImageMojo` and three
  inner classes, `CacheInfo`, `Docker`, `Image`), with no repackage/AbstractPackager buildpack
  references and no Tomlj references. Buildpack's 202 classes had one Tomlj user,
  `BuildpackCoordinates`, consistent with ME-13. Loader tools' 74 classes had no Tomlj,
  buildpack or JSR305 references.

Together, exact source and these separately reported binary observations provide strong static
support that the narrow `repackage` path does not require JSR305 parsing/executable services.
They do **not** guarantee Maven/Sisu goal discovery, plugin realm loading, reflective handling
or actual repackage operation without it. They also do not qualify `build-image` or other goals.

## Decision and remaining proof

Engineering may consider the same-version explicit buildpack exclusion as the minimal
standard-Maven graph-narrowing proposal. Adoption, actual POM change and any experiment require
the main owner to record the new scope and authority. This note itself performs none of them.
Existing unresolved JSR305 rights remain `BLOCKED-LEGAL`; elimination from an actually used graph,
if demonstrated, would avoid that use rather than create missing rights.

Dynamic proof is `NOT-RUN`. A meaningful separately authorized experiment must establish an
owned isolated local repository with JSR305 JAR/POM demonstrably absent, only approved exact
retained artifact pairs and required model POMs, no fallback repository/network resolution,
and the intended effective model. It must inspect the full plugin graph/realm and then qualify
the narrow repackage goal. Merely succeeding against the existing cache, where JSR305 remains
available, would not establish absence. Do not execute a baseline/RED experiment that uses the
rights-blocked JSR305 component. Missing allowed prerequisites stay blocked; no install or
replacement is inferred. Experiment design here is not execution authorization.

Acceptance needs (1) actual effective plugin dependency carrying the exclusion; (2) no other
JSR305 path or plugin-realm member; (3) no new/unreviewed component or version; (4) narrow goal
success with JSR305 unavailable; and (5) refreshed exact graph/package/legal trace. No such
acceptance, operational success or future commercial clearance is claimed by this research.



## Reconciled candidate set — prediction, not the actual-used graph

The primary worker reran the repository's existing read-only cache-model inspector with a
single **in-memory** change: the plugin root's buildpack child dependency carries the proposed
JSR305 exclusion. The controlled inspector file and all cached POM/JAR files were untouched.
This uses XML/model traversal, not Maven collection or plugin execution; its count is a
prediction that must be compared to the future actual realm.

| Set | Current frozen static baseline | Proposed static subset |
|---|---:|---:|
| Application JAR rows | 38 | 38, byte/hash unchanged |
| Resources plugin rows | 9 | 9 |
| Compiler plugin rows | 14 | 14 |
| Jar plugin rows | 16 | 16 |
| Boot plugin acquisition rows, including root | 39 | 38 |
| Total graph rows / unique acquired coordinates | 116 / 100 | 115 / 99 |
| Traversed model POMs | 243 | 242 |
| Boot rows after predicted Maven core-GA filtering | 36 | 35; actual realm NOT-RUN |

The only acquired coordinate removed is JSR305. Tomlj and ANTLR remain. The inspector also
finds the Commons Lang 3.16.0 test dependency and Micrometer Commons 1.16.7 optional dependency
on JSR305 already omitted; neither creates a retained second path. Model POM absence must also
be proved in the isolated experiment, not inferred from package contents.

The [proposed subset annex](inventories/f05a-q02-jsr305-exclusion-proposed-graph.tsv) preserves
all nine baseline graph columns/hashes for the remaining 115 rows and adds
`proposal_state=PROPOSED_NOT_RESOLVED_NOT_EXECUTED`. UTF-8 LF file SHA-256:
`e6457192813137df29a930a77f37a940285174eb6db20971d7774944b4f9e3a3`.
It is **not** the actual-used inventory and does not replace the current graph.

Rights accounting in this proposed 99-coordinate subset would be 88
APPROVED-WITH-OBLIGATIONS, one APPROVED and ten known-term BLOCKED-LEGAL process-gated
components. The 52 installed Maven core rows remain unchanged (47 ordinary Engineering rights
dispositions, five legal process gates). The accepted JSR305 finding remains BLOCKED-LEGAL
in the historical/current rights record. No rights or execution-admission field is changed
by this research.

## Separately reviewed experiment contract — NOT AUTHORIZED / NOT-RUN

The smallest useful next experiment is the existing four direct offline goals with the
standard plugin exclusion, **in a local repository where JSR305 cannot be supplied**.
A successful package built against the unrestricted existing cache is not sufficient.

### Preconditions and authority

1. Reviewer approves the graph-narrowing candidate and exact experiment. The frozen process
   exception covers the predecessor graph and explicitly reopens on graph change; record a
   bounded successor scope confirmation for the proposed 99-coordinate subset before use.
   Do not silently change/backdate the original exception or create a JSR305 license waiver.
2. Pin full first-party POM, synthetic non-web Boot probe source/main class, runner, settings
   and exact source commit/hashes before invoking Maven. No product Gateway service is created.
3. Rehash the existing Temurin JDK 25.0.4.1+1, Maven 3.9.16 / Resolver 1.9.27, all retained
   acquired artifacts, required model POMs and the 52 Maven core JARs against existing inputs.
   Keep all known license/NOTICE/acknowledgement/source-handling obligations.
4. Create a fresh owned child beneath `/home/phuclam/idea-f05a-20261003-37`; collision STOP.
   Leave the Q01 `qualification` child, original Maven cache and preview untouched.
   Populate a **non-symlinked isolated repository** using only the exact 99 cached JAR/POM
   pairs and 242 required cached model POMs, plus only already controlled cache-origin
   metadata if Maven requires it. JSR305 JAR/POM/path/classes must not be present. Record
   copies/hashes and metadata; missing offline prerequisites mean STOP, not downloads.
5. Confirm no injected Maven options, alternate classpath, user extensions, `.mvn`,
   Maven home extension or other JSR305 class provider. Use empty controlled user/global
   settings. Record the checked Maven-core distribution/class inventory and environment
   names/controlled values without retaining credential-bearing configuration.
   A runtime unable to meet these input controls remains BLOCKED.

### Proposed commands — do not execute in this task

`<owned-child>` below is a placeholder for the future reviewed exact directory, not an
executable command packet yet. Run the four goals in **one invocation**, not lifecycle
`package/test`, so the Jar goal establishes the project artifact before repackage.

```bash
JAVA_HOME=/opt/idea/tools/jdk-25.0.4.1+1 \
  /home/phuclam/.m2/wrapper/dists/apache-maven-3.9.16/510fba38/bin/mvn \
  --offline --batch-mode --no-transfer-progress -X \
  --settings "<owned-child>/empty-settings.xml" \
  --global-settings "<owned-child>/empty-settings.xml" \
  -Dmaven.repo.local="<owned-child>/repository" \
  -f "<owned-child>/pom.xml" \
  org.apache.maven.plugins:maven-resources-plugin:3.5.0:resources \
  org.apache.maven.plugins:maven-compiler-plugin:3.15.0:compile \
  org.apache.maven.plugins:maven-jar-plugin:3.5.1:jar \
  org.springframework.boot:spring-boot-maven-plugin:4.1.1:repackage
```

Diagnostic output is retained only after secret review; empty settings/source must not
contain credentials. No Help/Dependency/Clean/Exec/Surefire plugin, image building,
lifecycle build hook, npm/pip, install/deploy, DB, TLS, listener or verifier is included.
Do not run an old-graph baseline that consumes legally blocked JSR305 just to obtain RED.

If the package and actual-input oracle below pass, a separately explicit approved final
step may launch that exact synthetic JAR in non-web mode with the existing JDK:
`java -jar "<exact-qualified-package>" --spring.main.web-application-type=none`.
The runner must identify/own/bound the process, confirm the expected Boot-context-up marker
and controlled shutdown, and open no port. This distinguishes successful repackage from
a usable executable JAR. Boot execution is still **NOT AUTHORIZED** in the current task.

### Actual-input and package oracle

- Actual collection/realm diagnostics match the proposed component versions/hashes with
  no JSR305 selected, resolved or loaded; no fallback to the original cache. Check the
  selected plugin acquisition set separately from core-filtered runtime realm rows.
  Maven success alone is insufficient if the actual graph cannot be inspected.
- Only the expected graph subset and existing 52-core inventory may be execution inputs.
  No substitute `javax.annotation` implementation, new dependency/version/extension or
  unreviewed artifact is permitted.
- Executable JAR manifest: Boot `JarLauncher`, exact synthetic `Start-Class`, Java25
  source/release, expected Boot4.1.1 embedded loader contents. Inspect loader identity
  against the already pinned tooling source rather than just accepting a manifest label.
- `BOOT-INF/lib` equals the selected 38 application JARs by names and full SHA-256.
  No JSR305, Tomlj, ANTLR, buildpack-platform, Maven/plugin/Plexus/Sisu, Logback, database,
  Security, Swagger, new application JAR or jarmode-tools payload appears. Nested class/
  entry inspection must also reject hidden JSR305 classes; checking filenames alone is weak.
- Preserve embedded legal material and accompany internal recipients with required readable
  source/legal copies and notices; links alone do not discharge copy obligations.
- Freeze actual source SHA, complete actual graph/input identities, package SHA-256,
  command/result and retained sanitized log hashes. Do not call the static annex actual-used.
- Non-web launch, if separately authorized, proves only this Boot/package slice; it does
  not qualify TLS, Adapter, Gateway product implementation, grants/receipts or whole T027.

### Failure predictions and STOP / rollback

| Observation | Disposition |
|---|---|
| Maven still attempts to resolve JSR305 | Offline missing-artifact/plugin-resolution failure; graph exclusion is not proved. STOP. Do not expose the original cache or admit the blocked artifact. |
| Maven/Sisu discovery or goal loading requires JSR305 despite the inspected path | Possible `NoClassDefFoundError`, `ClassNotFoundException`, `TypeNotPresentException`, component/injection failure. STOP; keep the failure evidence. |
| Goal exits zero but package graph/manifest/loader/rights oracle differs | FAIL, not qualified; no runtime/package acceptance. |
| Hash/version/graph/path/environment drift, missing approved bytes or new required component | BLOCKED; reopen exact intake. No install, replacement, third-party patch, framework change or weaker evidence. |
| Ordinary standard exclusion cannot pass the bounded experiment | Reassess the exact failure once; if no clean same-artifact repair exists, `GRAPH REPAIR NOT JUSTIFIED`, escalate the accepted JSR305 package to Legal Review/publisher clarification. |

No product/cache state changes require rollback in this proposal. A future failed experiment
retains its bounded owned directory/logs for review; do not delete broad directories or
run the predecessor rights-blocked graph. If the candidate is rejected, leave the
controlled baseline unchanged rather than claiming that the old blocked execution is usable.

## Historical v0.1 handoff boundary — before experiment authorization

Q01 remains PASS. Accepted process-exception freeze and JSR305 BLOCKED-LEGAL finding are
preserved as human decisions from the current conversation, not invented GitHub comments.
Q02 graph repair is a reviewable **candidate**; Maven/Boot, actual realm/package and this
experiment are NOT-RUN / NOT AUTHORIZED. PR38 remains Draft/Open. No commit/push, merge,
Gateway code, database, TLS, preview, timer/Tracker or verifier action is performed here.

| Version | Date / project timezone | Change |
|---|---|---|
| 0.1 | 2026-10-03 / Asia/Ho_Chi_Minh | Exact source/bytecode research, proposed same-version plugin-edge exclusion, static subset and bounded offline proof contract; no application/POM change or execution |
| 0.2 | 2026-10-03 / Asia/Ho_Chi_Minh | Publish retained proposal with separately authorized exact first-party experiment; preceding research/no-execution claims remain historical |

## Current successor — bounded experiment authorization

The user subsequently authorized **EXECUTE BOUNDED JSR305 EXCLUSION EXPERIMENT**.
See [controlled successor](2026-10-03-t027-jsr305-experiment-authorization.md) and
[exact package](../../tests/ph1/f05-qualification/jsr305-exclusion/README.md).
Publish source and all input hashes before execution. Maven/Boot result is NOT-RUN
at this publication. The old proposal-only command restrictions above describe
the v0.1 research stage; they are not a claim that this new execution lacks authority.
JSR305 BLOCKED-LEGAL history and the original process-exception freeze are unchanged.
Only the explicitly narrowed standalone graph and conditional non-web smoke are
authorized; no product POM, Gateway implementation, DB/TLS/listener/preview, timer,
verifier or merge. Actual graph, package and runtime success are not inferred.
