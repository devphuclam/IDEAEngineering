# T027 isolated JSR305 exclusion experiment

Synthetic qualification only, Issue37 / PR38. Exact user authorization: 2026-10-03,
"EXECUTE BOUNDED JSR305 EXCLUSION EXPERIMENT". This package is not Gateway product code.

## Published inputs and single-use execution

Publish this directory, the exclusion research and proposed graph, and the successor
authorization record before execution. `inputs.sha256` hashes every experiment input
using committed LF bytes. Record the manifest's own hash and exact published commit
in the PR publication receipt. No self-referential checksum is claimed.

Owned extraction root:
`/home/phuclam/idea-f05a-20261003-37/jsr305-exclusion-05`.
It must initially be absent. Transfer an exact-source Git archive; compare its SHA-256
on Windows and Ubuntu. Extract using the pinned existing JDK jar utility.
No third-party archive, install, cache replacement or Python tool is used.

From the owned extraction root:
`bash tests/ph1/f05-qualification/jsr305-exclusion/run.sh <exact-published-40-hex-SHA>`.

Runner validates committed inputs and installed tooling before creating fresh
`run/repository`, `run/application`, `run/empty-home`, `run/logs`, `run/legal`.
A pre-existing run directory, repository/input symlink, hash drift, unknown artifact or missing cache
input stops execution. No automatic retry, download or dynamic graph repair.
The four installed rust-coreutils /usr/bin aliases are explicitly resolved to their
known /usr/lib/cargo/bin/coreutils/<name> files and verified at identical pinned hashes;
this does not permit symlinked cache inputs or isolated-repository links.

## Exact Maven command

One invocation; four direct goals, no lifecycle. Empty controlled user/global settings.
Process environment is rebuilt with only JAVA_HOME, owned HOME, PATH, LANG and
MAVEN_SKIP_RC=true. No Maven RC, inherited options, extension or ancestral .mvn.
Global toolchains must have no active entry; the Java user.home/.m2/toolchains.xml
must be absent. Isolating process HOME alone is not treated as proof of this.

```text
/home/phuclam/.m2/wrapper/dists/apache-maven-3.9.16/510fba38/bin/mvn
--offline --batch-mode --no-transfer-progress -X -Dstyle.color=never
--settings <package>/empty-settings.xml
--global-settings <package>/empty-settings.xml
-Dmaven.repo.local=<owned-root>/run/repository
-f <owned-root>/run/application/pom.xml
org.apache.maven.plugins:maven-resources-plugin:3.5.0:resources
org.apache.maven.plugins:maven-compiler-plugin:3.15.0:compile
org.apache.maven.plugins:maven-jar-plugin:3.5.1:jar
org.springframework.boot:spring-boot-maven-plugin:4.1.1:repackage
```

The isolated repository has exactly 99 pinned JARs and 242 pinned model POMs.
115 collection rows: application38, Resources9, Compiler14, Jar16, Boot38.
Only JSR305 is removed from the historical116-row/100-unique graph.
All required artifact POMs, parent POMs and BOMs come from existing controlled cache
bytes. No JSR305 JAR/POM/provider, alternate version, symlink or default-cache fallback.
Maven-origin bookkeeping, if generated, is retained, not an executable input.

## Actual graph and package oracle

Maven debug dependency collection and actual plugin realm Included entries must match
the exact candidate and established Maven-core filtering. Resources6, Compiler12,
Jar14, Boot35 own-realm inputs; installed Maven core remains the pinned52-JAR set.
Malformed/missing diagnostics are STOP, not a static-graph PASS.
JSR305 resolution/loading attempt, missing class, graph drift or Maven failure is STOP.
No old legally blocked graph is executed to manufacture a RED test.

Executable JAR: Boot4.1.1 JarLauncher, synthetic BootProbe Start-Class, Java25 bytecode,
exact embedded loader class bytes from pinned loader-tools. Application collection
remains exactly38. BOOT-INF/lib is exactly32 names/full hashes: that pinned collection
minus only the six exact4.1.1 starters approved in
[root04 reconciliation](../../../../docs/research/2026-10-03-f05a-q02-jsr305-root04-results.md#5-proposed-package-set-reconciliation--not-implemented).
The successor user approval authorizes that proposal for root05. The oracle pins each
omission's exact coordinate/version/hash, dependencies-starter manifest type and zero
class entries; it permits no seventh omission, extra JAR or generic starter exclusion.
Roots01–04 and their prior oracle results remain preserved.
The outer first-party output allows only the three approved Maven metadata entry names;
cached/core/nested JARs keep the original provider checks. A detector self-check runs
before Maven. Reject JSR305 classes, alternate provider, extra
runtime/build-tool dependencies and jarmode-tools. Nested original JAR byte identity
preserves embedded legal contents; the run/legal companion retains the inspected legal
entries, Maven legal files and embedded loader archive. Existing source-handling,
acknowledgement and notice duties remain; this is no commercial/legal approval.

Freeze exact produced JAR SHA-256 before the following conditional smoke.

## Predeclared bounded non-web Boot smoke

Only after Maven, graph and package oracles PASS:
```text
/opt/idea/tools/jdk-25.0.4.1+1/bin/java
-jar <owned-root>/run/application/target/t027-jsr305-exclusion-0.1.0.jar
--spring.main.web-application-type=none
```

30-second owned-process limit. BootProbe must observe active non-web
AnnotationConfigApplicationContext, print UP for Boot4.1.1/Java25, close it, then
print CLOSED and exit0. No HTTP listener, DB, TLS, Server call, Vault or product route.

## STOP, retention and boundaries

Missing/hash/version/model/graph/tooling drift: STOP and reopen intake. Do not repair
dynamically. JSR305 required by execution: GRAPH REPAIR NOT JUSTIFIED; preserve logs
and refer existing BLOCKED-LEGAL evidence for Legal Review/publisher clarification.
An unrelated harness/tooling failure is BLOCKED/NOT-RUN, not proof JSR305 is required.
Keep the exact owned directory and artifacts for review; no broad cleanup.

Maven timeout180s and smoke30s stop only owned child processes. Logs/files are private;
inputs contain no credentials, tokens or proofs. No new dependencies, network access,
install, verifier, listener, DB/TLS provisioning, preview change, timer, merge or F05
product implementation. Q01 PASS unchanged; whole T027/F05-A not inferred.
