# T028/T030 Server Grant — actual graph and prospective rights gate

| Control | Value |
|---|---|
| Stable ID / class / version / status | `IE-RES-F05A-T028-T030-GRAPH-RIGHTS-20261005` / execution preflight and rights reconciliation / `0.1 / Draft` |
| Normativity / repository instruction state | `INFORMATIVE / NOT-APPLICABLE`; no new product requirement or exception |
| Owner / author / worker | Engineering / Codex / `CODEX_ONLY`; named accountable intake owner `UNKNOWN` |
| Reviewer / acceptance authority | Project Reviewer for execution/process scope; Legal Review Authority for legal disposition; this successor review `NOT-RUN` |
| Date / timezone | 2026-10-05 / Asia/Ho_Chi_Minh |
| Work Item / PR / input | Issue #37 / PR #38 Draft/Open / accepted proposal source `36e73e13522c5d010511a67d5736f675ddaf93e1` |
| Authority | Project Reviewer conversation attachment: “APPROVED — proceed with the bounded T028/T030 Server Grant vertical slice”; read-only reconciliation and publication authorized, execution conditional on no unresolved rights/cache gate |
| Intended use / classification / retention | Unmodified cached Server internal build/test, T028/T030 only / INTERNAL / retain with F05 checkpoint and successors |
| Upstream | [Execution proposal](2026-10-05-f05a-t028-t030-execution-proposal.md), [intake procedure](../agents/external-source-intake.md), [Q02 rights](2026-10-03-f05a-t027-q02-intake.md), [Maven core rights](2026-10-03-f05a-q02-maven-core-realm.md) |
| Downstream / change trigger | Exact RED execution packet after gate closure; tool/artifact/hash/graph/use change reopens reconciliation |
| Supersession | Current reconciliation successor; does not rewrite historical graph observations, rights or expired exceptions |
| Evidence / tailoring | Direct cached-byte/model/realm observations and labeled bytecode inference; information/configuration control STANDARD-GUIDED under the repository authoring standard; no standards/legal/commercial clearance |

## 1. Current result

**Read-only cached resolution succeeds; T028/T030 goal execution remains BLOCKED-LEGAL.**
No Maven goal, Server test, product implementation, migration, database provisioning, listener,
Web build, download/install, verifier, Tracker action or merge ran in this reconciliation.
T027 remains COMPLETE/PASS, not reopened. PR #38 remains Draft/Open.

This is not the previous naive descriptor/POM union. The installed Maven 3.9.16 resolver built
the effective Server model offline and resolved the actual three plugin acquisitions/realms.
All observed paths/hashes are retained in the [resolved-input inventory](inventories/f05a-t028-t030-resolved-inputs.tsv).
The [embedded legal inventory](inventories/f05a-t028-t030-embedded-legal.tsv) records ZIP-entry
hashes, not legal admission or a blanket Apache conclusion. Rights not yet reconciled to an
applicable disposition remain unadmitted; discovery of license entries is not final review.

The genuine remaining authority gate is the established pre-use Legal Review process for
known custom/reciprocal terms. The [T027 exception](2026-10-03-t027-process-exception.md)
expired at T027 closure and explicitly does not cover Surefire or later work. This record does
not silently extend it. The new instruction permits use **if** rights/cache gates close; it
does not explicitly waive the still-recorded known-term Legal Review gate.

## 2. Actual read-only inputs and observations

| Layer | Observed result / limits |
|---|---|
| Effective Server | 96 selected JARs: 63 compile, 4 runtime, 29 test. Parent/imported BOM/model/exclusion/mediation handled by Maven ProjectBuilder, not a handwritten version-union. Server POM SHA-256 `32c4432479955693644a8677b1ed8d209e5b6a823294a11725e8f9afb48d349d` |
| Model POMs | 264 unique POM resolutions observed across Server, plugins and provider reconciliation; paths/hashes retained. POM presence is not class/provider use |
| Resources 3.5.0 | 9 actual acquired JARs; 6 constituents in plugin realm |
| Compiler 3.15.0 | 14 actual acquired JARs; 12 constituents in plugin realm |
| Surefire 3.5.6 | 15 actual acquired JARs; 12 constituents in plugin realm |
| Provider acquisition | 10 selected JARs; platform engine/commons/launcher **1.12.2**, not 1.14.2 |
| Provider alignment | 6 selected JARs resolving launcher/platform 6.0.3; reused project versions are not replacements copied into cache |
| Combined non-core selection | 135 unique cached JAR paths/coordinates across the layers above; duplicate occurrences are separate graph roles, not extra dependencies |
| Core distribution | 52/52 existing Maven lib/boot JAR hashes match the retained exact [distribution inventory](inventories/f05a-q02-maven-distribution.tsv); no new distribution or cache copy |
| Imported core classes | Actual realm `loadClass` origin confirms SLF4J 1.7.36, javax.inject 1, Plexus annotations 2.2.0 and boot Classworlds 2.11.0 in each of the three realms; exact paths/hashes retained as `core-provider-*` rows |
| JSR305 | No JSR305 path/coordinate in this resolved inventory, including observed models. No supplied/loaded JSR305 provider inferred. Historical old-graph BLOCKED-LEGAL remains unchanged; unexpected future acquisition/provider use is STOP |

The provider distinction is material. Inspection of the exact cached Surefire common bytecode
(`AbstractSurefireMojo$JUnitPlatformProviderInfo` and `SurefireDependencyResolver`) shows:
provider singleton collection with no project managed-dependency list, then removal of keys
already in project test dependencies and launcher-version alignment to the project platform.
The 1.12.2 acquisition bytes are real inputs, even where later narrowing removes them from the
provider classpath. Actual goal/forked-provider execution is **NOT-RUN**; the observed collection
and alignment plus bytecode analysis are not represented as an executed test classpath.

The realm has a null parent realm but foreign imports; null parent does not mean no Maven-core
class visibility. Classworlds 2.9.0 and annotations 2.2.0 descriptor entries are not missing
acquisition inputs here. Core Classworlds 2.11.0 is its legitimate installed origin, not a file
substituted into `.m2`. Likewise Commons Lang 3.20.0, Shared Utils 3.3.4 and JUnit platform
1.14.2 are not selected inputs of this actual reconciled path.

## 3. Rights findings and smallest remaining decision

Reuse the exact unchanged evidence, **not** old execution exceptions:

- [F01 dependency intake](2026-09-28-ph1-f01-dependency-intake.md) and F02/F03/Swagger successors
  for their unchanged Server/test artifacts; preserve all bundled/third-party notices.
- [Plexus evidence](2026-10-03-f05a-q02-plexus-rights.md), Q02 upstream rights and exact per-JAR
  [Q02 dispositions](inventories/f05a-q02-rights-dispositions.tsv) for matching bytes.
- [Maven core](2026-10-03-f05a-q02-maven-core-realm.md) and 52 pinned distribution rows.

Concrete already-established unresolved process rows in this selected path:

| Exact material | Retained terms / process issue |
|---|---|
| Plexus Utils 3.6.0 / 4.0.2, XML 3.0.1; core Utils 3.6.1 | Apache plus ExtremeLab 1.1.1, Javolution BSD2, ThoughtWorks BSD3; retain original supplements, acknowledgement/name/endorsement conditions; custom-term process gate |
| Interpolation 1.29, both acquired and core copy | Apache2 plus original altered Apache1.1/Codehaus wording and retained source-coverage concern; no relabeling or self-waiver |
| Acquired Sisu Plexus 0.9.0.M4; core Sisu Inject/Plexus 1.0.0 | EPL2 legal/source-handling material; acquisition remains an input even though filtered out of plugin realm |
| Server Jakarta Annotation 3.0.0 | EPL2/GPL+Classpath alternatives retained; no implied license-branch election |
| Server Tomcat Core 11.0.24 | Apache2 with bundled CDDL/EPL schema material; do not call the whole JAR uniformly Apache |
| Core javax.annotation-api 1.3.2 | Existing exact CDDL/GPL+Classpath evidence and recorded CDDL-version/choice question remain open |

These are **7 selected non-core rows plus 5 core rows** in their existing inventories, not
twelve newly discovered absence-of-license findings. Interpolation occurs in both inventories.
Known-rights/process uncertainty is distinct from missing-grant or missing-cache blockers.

New provider evidence is also explicit: JUnit platform engine/commons/launcher **1.12.2**
each contain exact EPL2 text SHA-256
`5aa4cd44c111add178d1c2e2fe36d58a484012c80167df925f826cd64d411bf0` and notice
`c7d843e0faf8a251278c9220f6b5326a42a01f08b855c1ec871bcef6211a7e2a`.
Those full texts were inspected from the exact cache bytes, not inferred from 6.0.3 metadata.
They are acquisition/test tooling only; source/distribution obligations remain visible.

Ordinary Surefire 3.5.6 module JARs, Resolver API/Util 1.4.1 and Common Artifact Filters 3.4.0
expose embedded Apache2 LICENSE and their exact NOTICE entries. Shared Utils 3.5.6 instead
exposes a combined shaded Commons Codec/IO/Lang/Compress NOTICE; it has no separately named
LICENSE entry in this scan. Its whole-project/shaded coverage must be reconciled explicitly
before admission, not inferred from other Surefire modules or silently declared complete.
No blanket rights-count PASS is claimed while this reconciliation remains unfinished.

**Recommended smallest authority decision:** issue a new prospective process exception for
T028/T030 internal/offline build/test only, covering the exact reconciled known-term components
and core envelope, preserving every obligation; not legal approval, new license rights,
commercial/T036 clearance, F05-wide authority or permission to use missing-grant material.
Any artifact/version/hash/graph/use change stops execution. Alternatively retain BLOCKED-LEGAL
until the Legal Review Authority dispositions these exact terms. No process exception has been
created or presumed approved in this publication.

After that decision, finish remaining exact rights/shaded attribution reconciliation, freeze
the admitted input envelope and publish the first G01 RED packet. Existing behavioral/environment
approval does not need to be requested again. A genuinely missing grant still stops execution.

## 4. Reproduction, source hashes and non-execution boundary

Existing JDK `/opt/idea/tools/jdk-25.0.4.1+1`; Maven root
`/home/phuclam/.m2/wrapper/dists/apache-maven-3.9.16/510fba38`; cache
`/home/phuclam/.m2/repository`. No settings credentials were printed.
Read-only scratch `/tmp/idea-f05-graph.vb8ga3` contains first-party audit source/POM/inventory only.

```sh
JAVA=/opt/idea/tools/jdk-25.0.4.1+1/bin/java
M=/home/phuclam/.m2/wrapper/dists/apache-maven-3.9.16/510fba38
"$JAVA" --class-path "$M/lib/*:$M/boot/*" /tmp/idea-f05-graph.vb8ga3/GraphAudit.java /tmp/idea-f05-graph.vb8ga3/pom.xml
"$JAVA" /tmp/idea-f05-graph.vb8ga3/LegalAudit.java /tmp/idea-f05-graph.vb8ga3/f05a-t028-t030-resolved-inputs.tsv
```

Both final reference-only commands exited 0. The model audit invokes resolver/model/realm APIs
but never `executeMojo`; JDK source launch compiles the first-party inspection utility, not
product/test code. LegalAudit rechecks JAR hashes before ZIP reads. The legal text output is
larger than the tool display limit; entry identities were captured, but uninspected/truncated
text is not treated as reviewed. Only explicitly read/reused rights evidence is dispositioned.
An additional metadata-only pass against the final resolved inventory captured all 220 legal
entry rows without display truncation. All 456 resolved-input rows have validated hash/path
shape; the 12 core-provider rows add class origins, not additional repository acquisitions.

| First-party raw-byte input | SHA-256 |
|---|---|
| GraphAudit.java | `274003edb8d8662e6ede0e16c126f880c88c8c139ef71d8113258bb91e8db3f2` |
| LegalAudit.java | `96eee0eba5b298024f5189917c822992f0107bf4496514f4d917cfaee814da03` |
| Resolved-input inventory | `036afc60a252566bcdf72c4026d160bd31c27c477645c2f626aa61588f6039ca` |
| Embedded-legal inventory | `4e333caef94b2cc42609d033aaeea5a1cfeb7685f0f7559e48c63f23f7b65ffc` |

G01–G06, V9, database `idea_ddm_f05a_20261005_t028`, Maven direct goals, provider/test execution,
all regressions and Server Grant checkpoint: **NOT-RUN**. No product source or V1–V8 changed.
No safe-environment claim relies on actually provisioning the DB; that remains the next bounded
step only after execution gate closure. The user's existing UI worktree was not modified.
