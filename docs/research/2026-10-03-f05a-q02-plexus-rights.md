# F05-A Q02 — Exact Plexus Family and Supporting Tool Rights Evidence

| Control | Value |
|---|---|
| Stable ID | `IE-RES-F05A-Q02-PLEXUS-RIGHTS-20261003` |
| Class / version / status | Bounded external-source rights research / `0.2` / `Draft` |
| Product normativity | `INFORMATIVE`; creates no product requirement, tooling execution authority or commercial clearance |
| Repository process authority | `NOT-APPLICABLE`; evidence record, not an instruction guide |
| Owner / author | Engineering intake owner, named person `UNKNOWN` / Codex bounded research worker |
| Reviewer / acceptance authority | Project Reviewer and Legal Review Authority; independent review and acceptance `NOT-RUN` |
| Baseline / evidence date | F05-A T027 preparation, Q02; repository `33f2263`; exact versions below; inspected 2026-10-03 |
| Intended use | `DEPENDENCY`: unmodified Maven build-tool/plugin-realm use for internal T027 only; no product-runtime, vendoring, copied implementation or commercial redistribution admission |
| Classification / retention | `INTERNAL`; retain with the F05 evidence baseline and any superseding intake |
| Upstream trace | [F05 preparation freeze](2026-10-03-f05-preparation-freeze-record.md), [F05 preparation package](2026-09-28-ph1-f05-gateway-qualification.md), [external-source intake](../agents/external-source-intake.md), [authoring standard](../agents/product-document-authoring-standard.md) |
| Downstream trace | Q02 exact-used Maven inventory and F05 intake decision; later T036 commercial inventory/SBOM qualification |
| Change / supersession | Bounded successor on branch `codex/q02-plexus-rights`; supersedes this record's `0.1` L4 evidence-gap conclusions with section 7; superseded by `NOT-APPLICABLE` |
| Review trigger | Artifact/hash, tag, graph, use, modification, packaging or distribution changes; resolution of the specific evidence gaps below |
| Evidence status | `DIRECT-OBSERVATION` of existing cached bytes and exact upstream source states; dispositions are Engineering recommendations, not a Legal Review Authority decision |

Control tailoring: this research record combines source identity, rights evidence, obligations and
verification rather than creating a technology decision view set. ISO/IEC/IEEE 15289:2019
(`STD-INFO-001`, `STANDARD-GUIDED`) and ISO 10007:2017 (`STD-CM-001`, `STANDARD-GUIDED`)
are used for information-item and baseline traceability under the repository authoring standard;
no standards conformity claim is made. Named ownership remains `UNKNOWN`; Engineering assigns it
before promoting this Draft to a reviewed disposition.

## Result and boundary

The planned versions do not have one uniform Plexus license. Exact source headers show Apache-2.0,
MIT, legacy Apache-1.1 wording, and EPL-2.0. The most consequential additional gate is
`plexus-interpolation:1.29`: four shipped classes map to Apache-1.1 headers, including three
headers whose acknowledgement/contact text uses Codehaus rather than the standard ASF wording.
Sisu Plexus `0.9.0.M4` has EPL-2.0 source-distribution conditions. Both require the repository's
Legal Review Authority escalation before reuse; internal-tool scope does not waive that rule.

This record supports only the twelve components assigned to this worker. Plexus Utils
`3.6.0`/`4.0.2`/`4.0.3` and Plexus XML `3.0.1`, including their ExtremeLab, Javolution and
ThoughtWorks supplements, are a separate parent-worker inquiry. Nothing here admits their terms
or the complete Maven graph. Earlier T043/F03/F04 execution exceptions do not carry into F05.

Version `0.2` adds a bounded evidence correction for Compiler API/Javac, IO and QDox and an
exact additional-version legal observation for Utils `3.5.1`. Section 7 establishes attributable
project-wide grants and generated-input coverage: missing per-file headers or generated files
at a hand-written-source path alone no longer support an L4 blocker for these four coordinates.
Known custom/EPL authority gates remain unchanged. This is an evidence resolution, not a waiver.

## 1. Exact cached artifact identity

Source `S-CACHE`: existing files read through the authorized, strict-host-key SSH connection to
`phuclam@192.168.137.33`, under `/home/phuclam/.m2/repository`. For coordinate `g:a:v`, the
observed binary is `g.replace('.', '/')/a/v/a-v.jar`; the matching POM has `.pom` instead.
SHA-256 was calculated from each existing file's bytes with Python's standard library. No Maven
command, dependency resolution, download or remote write was performed.

| Exact coordinate | JAR SHA-256 | Matching POM SHA-256 |
|---|---|---|
| `org.codehaus.plexus:plexus-build-api:1.2.0` | `570AE55A95E1887C3004882D30DC4E9035D2A46BA8D58B991DE04175F141D88F` | `47C7B0E65718CA89DF6FDF5CB3F24A49E076CACD9499236C7E18AD78E993CDDB` |
| `org.codehaus.plexus:plexus-interpolation:1.29` | `088D444DBCEDFB384630D8686697ECE3C401D6F33C8F8B3AA7259EA1C6996878` | `CE0D5634297BB1E065DDDFDC8A2A5675717C08E8F4783EDCF581543711516938` |
| `org.codehaus.plexus:plexus-java:1.5.2` | `1E6A4298E145C1E23AF430B04AC53D76DC11077E0F3D36EF9C027CE790D96505` | `9617B619010DBB95C237E35BFF7EE1D336CBCFD9FF5C229A935A9E3587FF0C37` |
| `org.codehaus.plexus:plexus-compiler-api:2.16.2` | `DB34D13C8D688063A946922F4DE448C909BA43FEC355EA15514495F33072B031` | `AE7CA19E5A3BAFDF92A403EDF8AF5876C746024424059C719B1544DE48384FF8` |
| `org.codehaus.plexus:plexus-compiler-manager:2.16.2` | `99630AC196571A2754BAA143A12723795B13020631902A6DFF18DFB997E59B0E` | `BA8D233DD73FC97C10F84BF23EF8F632CD19CED0F85DC335BE2BDCB8E28E7BD0` |
| `org.codehaus.plexus:plexus-compiler-javac:2.16.2` | `E48141C146D6CB96619AAFB07B2E10E1AC08F339E96AE4067DDD9C2D0F626672` | `B648754E6D99B381F7FC40328849C6F24D454263C03CF89C737D7C29831EB208` |
| `org.codehaus.plexus:plexus-archiver:4.12.0` | `B1E9798A6D711D1E7760D50C78BE8BE746BB546B87DF0A2D7EF67DB5EDA5431E` | `4B3B26C438D0B41D5A0613787115EA4013ADEAE1478314535976B2B3A65FC2F8` |
| `org.codehaus.plexus:plexus-io:3.6.0` | `FC0F3EFFEA7514E4F214DF1AFB672F54C982E78E5CA3B32B34196C7D056A1AA4` | `653432ED213573B6B209DEB7346DC2ED89F20E647DBDB6FC868051B334B31D27` |
| `org.sonatype.plexus:plexus-build-api:0.0.7` | `934171640FBD3D2495C50B79B0D9ADB11E2C83E65BAD157DF8FE34BCAC0FF798` | `E067317A47ED9E84B2BA85A76D3CF72980E2B0DC873A90B9CBFE74FE80C37C17` |
| `org.eclipse.sisu:org.eclipse.sisu.plexus:0.9.0.M4` | `B90579BC652EAC7331436E0A25533FCE14130B9C6E015F2DD3A3D4BB07E942B7` | `90B4BE7A71C979D0C4DEA20C20A28EB9E76A29DF68AB9018CF011019A3E4F562` |
| `com.thoughtworks.qdox:qdox:2.2.0` | `C260C3230B2340AF97D54BF01F7F67EBC57C901922736C881BB11CB981302BE2` | `C850FBAD0B05EADA85CA1BCE22409A75F758AEA0CA1E47A828C6A505AD361FAB` |
| `org.ow2.asm:asm:9.9.1` | `6F3828A215C920059A5EFA2FB55C233D6C54EC5CADCA99CE1B1BDD10077C7DDD` | `ACA68DEE9BA2F6CD90FFDE728EFDC7E3EBFCF59F3F41FBFE248D2D01D5B866AF` |

Claim `C01`: a case-insensitive ZIP-entry name search for `license`, `notice`, `copying` and
`copyright` found no matching entry in these twelve JARs. This is a naming observation, not proof
of absent rights or an exhaustive content scan. No `*-sources.jar` was found under that `.m2`
repository. A separately retained exact ASM source JAR was later inspected (section 4).

## 2. Exact upstream identity and source-header evidence

The POMs establish source/version wayfinding, not rights approval. The modern modules identify
the release tags below; Plexus Java and Compiler obtain their repository/tag from the cached
`plexus-languages:1.5.2` and `plexus-compiler:2.16.2` parent POMs. The legacy Sonatype POM points to
the historical SVN tag, while the project's relocated official Git history retains that release.
Sisu's exact official milestone is separately pinned. All upstream reads were primary-source HTTP
inspection into transient memory; implementation was not copied into this repository.

| Source ID / official source | Exact release state | Actual rights evidence inspected |
|---|---|---|
| `S-BUILD` [Plexus Build API](https://github.com/codehaus-plexus/plexus-build-api/tree/plexus-build-api-1.2.0) | `plexus-build-api-1.2.0`; API-resolved source state `903ED6C3E9DC767DA4F9AC6CF5A22F0324400BBF` | [LICENSE](https://github.com/codehaus-plexus/plexus-build-api/blob/plexus-build-api-1.2.0/LICENSE), plus both production Java files carry Sonatype Apache-2.0 headers; [BuildContext](https://github.com/codehaus-plexus/plexus-build-api/blob/plexus-build-api-1.2.0/src/main/java/org/codehaus/plexus/build/BuildContext.java) |
| `S-INT` [Plexus Interpolation](https://github.com/codehaus-plexus/plexus-interpolation/tree/08bde474a835fe95795d3099c11c1b9de2d80779) | `plexus-interpolation-1.29`; dereferenced commit `08BDE474A835FE95795D3099C11C1B9DE2D80779` | 47 Apache-2.0 headers, four Apache-1.1 headers detailed below, one headerless file; [Apache-2.0 example](https://github.com/codehaus-plexus/plexus-interpolation/blob/08bde474a835fe95795d3099c11c1b9de2d80779/src/main/java/org/codehaus/plexus/interpolation/AbstractDelegatingValueSource.java) |
| `S-JAVA` [Plexus Languages](https://github.com/codehaus-plexus/plexus-languages/tree/0cbde2aa41466fd464022a4057da10ab8d031b38) | `plexus-languages-1.5.2`; commit `0CBDE2AA41466FD464022A4057DA10AB8D031B38` | All 20 mapped Plexus Java source headers refer to Apache-2.0; [example](https://github.com/codehaus-plexus/plexus-languages/blob/0cbde2aa41466fd464022a4057da10ab8d031b38/plexus-java/src/main/java/org/codehaus/plexus/languages/java/jpms/AbstractBinaryModuleInfoParser.java) |
| `S-COMP` [Plexus Compiler](https://github.com/codehaus-plexus/plexus-compiler/tree/36237da5f5a6c9e1dce4479596e975f5cc045793) | `plexus-compiler-2.16.2`; commit `36237DA5F5A6C9E1DCE4479596E975F5CC045793` | API: 10 MIT, seven Apache-2.0, one headerless. Manager: all three MIT. Javac: two MIT, one Apache-2.0, one headerless. [API MIT](https://github.com/codehaus-plexus/plexus-compiler/blob/36237da5f5a6c9e1dce4479596e975f5cc045793/plexus-compiler-api/src/main/java/org/codehaus/plexus/compiler/AbstractCompiler.java), [Manager MIT](https://github.com/codehaus-plexus/plexus-compiler/blob/36237da5f5a6c9e1dce4479596e975f5cc045793/plexus-compiler-manager/src/main/java/org/codehaus/plexus/compiler/manager/DefaultCompilerManager.java), [Javac MIT](https://github.com/codehaus-plexus/plexus-compiler/blob/36237da5f5a6c9e1dce4479596e975f5cc045793/plexus-compilers/plexus-compiler-javac/src/main/java/org/codehaus/plexus/compiler/javac/JavacCompiler.java) |
| `S-ARCH` [Plexus Archiver](https://github.com/codehaus-plexus/plexus-archiver/tree/plexus-archiver-4.12.0) | `plexus-archiver-4.12.0`; API-resolved source state `FAE223E23BCF2FEE6806543C60CFC24741BA4CB7` | Root [Apache-2.0 LICENSE](https://github.com/codehaus-plexus/plexus-archiver/blob/plexus-archiver-4.12.0/LICENSE); 114 mapped Apache-2.0 headers and 34 headerless sources; [example](https://github.com/codehaus-plexus/plexus-archiver/blob/plexus-archiver-4.12.0/src/main/java/org/codehaus/plexus/archiver/AbstractArchiver.java) |
| `S-IO` [Plexus IO](https://github.com/codehaus-plexus/plexus-io/tree/plexus-io-3.6.0) | `plexus-io-3.6.0`; API-resolved source state `2540AA95FB4A703D06B6A6BAA517B6F45D48BE3C` | Exact [NOTICE.txt](https://github.com/codehaus-plexus/plexus-io/blob/plexus-io-3.6.0/NOTICE.txt) acknowledges ASF; 51 Apache-2.0 headers and four headerless sources; [header example](https://github.com/codehaus-plexus/plexus-io/blob/plexus-io-3.6.0/src/main/java/org/codehaus/plexus/components/io/attributes/AttributeConstants.java) |
| `S-LEGACY` [relocated Sonatype Build API](https://github.com/codehaus-plexus/plexus-build-api/tree/883ea674097b2d147b8efd21ed19f3962b14fd2f) | `plexus-build-api-0.0.7`; commit `883EA674097B2D147B8EFD21ED19F3962B14FD2F` | All four mapped Java sources carry Sonatype Apache-2.0 headers; [exact BuildContext](https://github.com/codehaus-plexus/plexus-build-api/blob/883ea674097b2d147b8efd21ed19f3962b14fd2f/src/main/java/org/sonatype/plexus/build/incremental/BuildContext.java) |
| `S-SISU` [Eclipse Sisu](https://github.com/eclipse-sisu/sisu-project/tree/c9ee92dde343bf5935eabfa028016988fb462ac7) | `milestones/0.9.0.M4`; commit `C9EE92DDE343BF5935EABFA028016988FB462AC7` | Actual root [EPL-2.0 LICENSE](https://github.com/eclipse-sisu/sisu-project/blob/c9ee92dde343bf5935eabfa028016988fb462ac7/LICENSE.txt) and all 138 mapped Plexus source headers; [example](https://github.com/eclipse-sisu/sisu-project/blob/c9ee92dde343bf5935eabfa028016988fb462ac7/org.eclipse.sisu.plexus/src/main/java/org/eclipse/sisu/plexus/DefaultPlexusBeanLocator.java) |
| `S-QDOX` [QDox](https://github.com/paul-hammant/qdox/tree/qdox-2.2.0) | `qdox-2.2.0`; API-resolved source state `9F42358ADFFA576313E8D95A0F763A2AC1A4ABE1` | Actual [LICENSE.txt](https://github.com/paul-hammant/qdox/blob/qdox-2.2.0/LICENSE.txt) names Joe Walnes/QDox Project Team and Apache-2.0. 168 mapped Apache-2.0 headers; 32 headerless; five generated-source paths absent. [parser grammar](https://github.com/paul-hammant/qdox/blob/qdox-2.2.0/src/grammar/parser.y) has an Apache-2.0 header |

Claim `C02`: the source-header screen mapped 649 top-level `.class` ZIP entries to exact release
`src/main/java` paths, excluding inner classes, root `module-info.class` and `META-INF` variants.
It read the first 3,500 characters of each available source and classified recognizable rights
headers. This is broader than one sample header, but is not a complete source-tree, resource,
generated-code, multi-release or reproducible-build audit. Source-to-binary identity is based on
coordinates/POM/tag/class-name correspondence; reproducible binary equivalence was `NOT-RUN`.
No header is not proof of no license. The scan's absence observations are kept distinct from
the grant in an actual root license file.

Actual legal text SHA-256 values, calculated over the HTTP-decoded UTF-8 text (not a packaged
artifact checksum), aid reinspection: `S-BUILD/LICENSE`
`C71D239DF91726FC519C6EB72D318EC65820627232B2F796219E87DCF35D0AB4`;
`S-ARCH/LICENSE` `CFC7749B96F63BD31C3C42B5C471BF756814053E847C10F3EB003417BC523D30`;
`S-IO/NOTICE.txt` `C53634C960163F00BA0B0147CC3DEE5CAF0E6A47BC9909A2FE94B7ADCF5D983E`;
`S-SISU/LICENSE.txt` `209FE24BF55677BBF81C2B0481C1403201FAB57B3B4C609971EBA4EC8162B99C`;
`S-QDOX/LICENSE.txt` `A02E970B1159212C1879FE1078FCF2CFA4F2C45885ED3D27AF805A67EEF1B912`.

## 3. Interpolation's exact legacy/custom header obligations

Claim `C03`: the following four binary class names exist in the exact Interpolation JAR and their
release-source headers contain the complete five-condition Apache Software License 1.1 wording.
The full rights headers, including the disclaimer, were separately read through their closing
comment delimiter. These are source-specific grants; the parent's Apache-2.0 metadata cannot
erase them.

| Exact source at commit `08bde474a835fe95795d3099c11c1b9de2d80779` | Actual differences / attribution | Source text SHA-256, decoded UTF-8 |
|---|---|---|
| [InterpolatorFilterReader.java](https://github.com/codehaus-plexus/plexus-interpolation/blob/08bde474a835fe95795d3099c11c1b9de2d80779/src/main/java/org/codehaus/plexus/interpolation/InterpolatorFilterReader.java) | ASF 2002–2003; acknowledgement uses `http://www.codehaus.org/`; permission contact `codehaus@codehaus.org`; endorsement names Ant/ASF; Apache naming restriction | `D594CE738E02210218AEFA197E4193F499FF3B0AE0D62723D043F030DEB6686B` |
| [multi/MultiDelimiterInterpolatorFilterReader.java](https://github.com/codehaus-plexus/plexus-interpolation/blob/08bde474a835fe95795d3099c11c1b9de2d80779/src/main/java/org/codehaus/plexus/interpolation/multi/MultiDelimiterInterpolatorFilterReader.java) | Same rights header and altered Codehaus acknowledgement/contact wording | `056C4CA6EAE96651AB006B2C67F9EA88AAA1C0CBE7400C5932966268E5EC5959` |
| [os/Os.java](https://github.com/codehaus-plexus/plexus-interpolation/blob/08bde474a835fe95795d3099c11c1b9de2d80779/src/main/java/org/codehaus/plexus/interpolation/os/Os.java) | ASF 2001–2003; ASF acknowledgement uses `http://www.apache.org/`; permission contact `apache@apache.org`; Ant/ASF endorsement and Apache naming restrictions | `2E2476AABB4F434ED9F1A03B34789745F786DB9183F8A0C072CD9A7A872A75C8` |
| [util/StringUtils.java](https://github.com/codehaus-plexus/plexus-interpolation/blob/08bde474a835fe95795d3099c11c1b9de2d80779/src/main/java/org/codehaus/plexus/interpolation/util/StringUtils.java) | ASF 2002; altered Codehaus acknowledgement/contact; endorsement names Jakarta Project, Commons and ASF; Apache naming restriction | `8A36AA23C466D28BDD67CF32425ABE1A03397526A3559D74CF2E34FC2EF22A46` |

Engineering obligation interpretation: retain copyright, all conditions and disclaimer for source
copies, and reproduce them with binary distributions; carry the specified acknowledgement in
end-user documentation or the indicated software acknowledgement location; respect endorsement
and product-name restrictions. Legal Review Authority resolves the altered wording and any
Apache-1.1/Apache-2.0 coexistence question before reuse. Engineering preserves each original
header verbatim in the external evidence/notice bundle rather than silently substituting the
standard Apache-1.1 text. `FixedInterpolatorValueSource.java` is the additional headerless source;
its individual rights coverage is `UNKNOWN` in this screen.

## 4. ASM retained-source evidence

Claim `C04`: the exact ASM `9.9.1` source JAR retained from the earlier T043 inspection exists at
`C:/Users/TD-999/AppData/Local/Temp/idea-exec-intake-3.6.3-caf665202ae04a94bfa362779747ef2d/asm-9.9.1-sources.jar`.
It was rehashed as
`057E39AA1800B25BC8944846A376509990F49B7FE1E07192B1D6E48E1A780EB2`.
The source entry `org/objectweb/asm/AnnotationVisitor.java` was opened from that existing archive;
its full rights header gives INRIA/France Telecom 2000–2011 copyright and all three BSD conditions
and the disclaimer. This is exact source evidence rather than the license name in the POM.
The [earlier retained-source record](2026-10-01-t043-maven-web-build-intake.md) supplies artifact
provenance, not inherited F05 admission. Its remote counterpart is
`/home/phuclam/idea-t043-maven-intake-3.6.3/asm-9.9.1-sources.jar` (local copy reverified here).

Engineering obligations: preserve copyright, conditions and disclaimer with source; reproduce
them in binary-distribution documentation/materials; obtain permission before using holder or
contributor names as endorsement. No copyleft/source-offer condition or explicit patent grant is
present in this inspected header. The [official current ASM license](https://asm.ow2.io/license.html)
corroborates the three-condition text; it is not the exact-version pin. Attempts to retrieve the
official `ASM_9_9_1` tagged legal file from OW2 failed, but the retained exact published sources
provide the required rights evidence. No new source artifact was downloaded.

## 5. Grouped Engineering disposition and compliance ownership

The following are **recommended F05 intake dispositions**, pending integration into the
parent's controlled exact-used tool inventory. They are not an authorization to execute tooling.
`APPROVED-WITH-OBLIGATIONS` recommendations concern only identified ordinary rights with the
listed internal-use controls. They do not confer acceptance or company/legal authority. Any
special or unresolved rights case remains `BLOCKED-LEGAL`; the complete Q02 graph cannot be
reported as admitted from this subset.

| Exact component(s) | Recommended disposition for internal T027 tool use | Basis / remaining action and owner |
|---|---|---|
| Codehaus Build API `1.2.0`; Sonatype Build API `0.0.7`; Plexus Java `1.5.2` | `APPROVED-WITH-OBLIGATIONS` | Actual Apache-2.0 grants in exact production headers, with root LICENSE also present for modern Build API. Engineering retains Apache license text, source attributions and applicable notice material; reviews the resolved graph separately. |
| Compiler Manager `2.16.2` | `APPROVED-WITH-OBLIGATIONS` | All three mapped production files carry actual MIT grants. Engineering preserves Codehaus copyright, permission notice and disclaimer with copies/substantial portions. |
| Compiler API / Javac `2.16.2` | `APPROVED-WITH-OBLIGATIONS` recommendation, revised in `0.2` | Exact-version official module project-license pages contain complete Apache-2.0 grants and identify release `2.16.2`; retain actual MIT file grants as well. Absence of a root-tag LICENSE or individual header does not invalidate the attributable whole-module grant. See C05. |
| Archiver `4.12.0` | `APPROVED-WITH-OBLIGATIONS` | Exact root Apache-2.0 LICENSE and 114 matching headers; 34 files have no individual header but the root project license supplies actual legal evidence. Engineering retains source notices and license, checks material distribution changes and any additional artifact separately. |
| IO `3.6.0` | `APPROVED-WITH-OBLIGATIONS` recommendation, revised in `0.2` | Exact-version official project-license page contains the complete Apache-2.0 grant and identifies release `3.6.0`; retain the exact ASF NOTICE. The root-tag LICENSE absence is an observation, not an unresolved rights conclusion. See C05. |
| Interpolation `1.29` | `BLOCKED-LEGAL` | Exact custom/legacy Apache-1.1 headers coexist with Apache-2.0 and a headerless source. Legal Review Authority evaluates the original wording and scope; Engineering preserves all texts/attributions. |
| Sisu Plexus `0.9.0.M4` | `BLOCKED-LEGAL` | Exact EPL-2.0 license and 138 headers. Source-disclosure/distribution obligations trigger the intake escalation rule. Legal Review Authority dispositions internal T027 use separately from future distribution; Engineering retains the original EPL terms/source identity. |
| QDox `2.2.0` | `APPROVED-WITH-OBLIGATIONS` recommendation, revised in `0.2` | Actual root project grant, all four Apache-2.0 grammar inputs, exact JFlex version/build configuration, actual BSD-3-Clause generator grant and primary output-permission statements establish bounded coverage. Retain QDox/ASF notices and conservatively JFlex BSD-3-Clause notice material; unknown BYacc producer version is an authenticity/rebuild limitation, not proof of absent rights. See C06. |
| ASM `9.9.1` | `APPROVED-WITH-OBLIGATIONS` | Actual BSD-3-Clause header in rehashed exact source JAR. Engineering retains the notice/conditions/disclaimer and observes no-endorsement restrictions. |

Common Apache-2.0 actions (`S-BUILD` and `S-ARCH` actual license texts): Engineering maintains the
license copy and applicable copyright/patent/trademark/attribution notices, includes required
NOTICE attributions upon the relevant distribution, and marks changed files if modification
is later authorized. Copyright and contributor patent grants are subject to the text's scope
and patent-litigation termination; trademark rights are limited. This scope is unmodified
internal tooling. Later distribution, modified sources or commercial packaging reopen intake,
including notice delivery and T036 inventory ownership.

Sisu EPL-2.0 considerations (`S-SISU` actual license): distribution entails making the Program's
source available and telling recipients how to obtain it; distributed source includes the
agreement and notices remain intact. Alternative binary licensing has conditions. Commercial
distribution includes the section 4 indemnity provision; patent-litigation and noncompliance
termination provisions also apply. No secondary license is inferred merely from Exhibit A.
Internal use is the requested model; these observations do not assert that IDEA source must
be disclosed or that commercial deployment is approved. Legal Review Authority owns the
qualification of the actual future packaging/linking/distribution model.

QDox's five absent generated Java paths are under `com/thoughtworks/qdox/parser/impl/`:
`DefaultJavaCommentParser`, `DefaultJavaCommentLexer`, `DefaultJavaCommentParserVal`,
`JFlexLexer`, and `Parser`. An Apache-2.0 grammar header proves the grammar's declared terms,
not automatically every generator skeleton's terms. Section 7 adds the generator/grant evidence
that was missing from `0.1`. Their graph/build generation was not run.

## 6. Verification and handoff

| Objective / procedure | Actual outcome | Limit |
|---|---|---|
| Read exact cached JAR/POM bytes, calculate SHA-256, inspect legal-named entries | `PASS` for the twelve assigned coordinates | Byte identity only; no published-checksum/signature or full graph equivalence claim |
| Inspect exact primary legal texts and mapped production headers | `PASS` for performed reads; 644 of 649 mapped production paths readable, five QDox generated paths absent | Not an exhaustive resource/inner-class/multi-release rights audit; mixed/headerless cases explicitly recorded |
| Rehash retained ASM source JAR and read complete AnnotationVisitor rights header | `PASS` | Historical rights evidence reverified, historical execution exception not inherited |
| Exact custom-header escalation and EPL Legal Review | `BLOCKED-LEGAL` | Company/Legal Review Authority disposition required under intake sections 2–4 |
| Resolve assigned L4 generated/headerless coverage gaps | `PASS` for the `0.2` Engineering evidence resolution in section 7 | Recommended dispositions only; source-to-binary authenticity and rebuild equivalence remain unqualified; no custom/EPL waiver |
| Independent review, controlled inventory integration and final F05 execution admission | `NOT-RUN` | Parent reviewer owns the next step |
| Maven/Boot goals, builds/tests, DB/TLS/ports, preview, timer/tracker, verifier and merge | `NOT-RUN` | Outside this rights-research assignment |

Author self-check: the requested file alone was added in the isolated worktree; exact coordinates,
hashes, primary source links, claim limits and proposed dispositions remain visible. A repository
document/link validator was `NOT-RUN` because verifier execution is excluded from this task.
The next action is for the parent worker to integrate these facts into Q02 and keep all unresolved
Legal Review gates visible. No dependency, source implementation, third-party asset or notice
bundle was imported; no commit or push was made.

## 7. Version 0.2 — attributable whole-project grants and generated-code coverage

The current parent [Q02 intake](2026-10-03-f05a-t027-q02-intake.md) and
[rights inventory](inventories/f05a-q02-rights-dispositions.tsv) were read from the preparation
worktree on 2026-10-03. At that observation they described 116 graph rows / 100 unique
acquisition coordinates, Boot-plugin graph 39 / potential own realm 36, application 38,
and 19 blocked acquisition rows. This worker has not changed those inventories or counts.
The proposed correction below applies to exactly four current L4 coordinates; it does not
close the later ASM `9.7`, jdependency, JSR305, custom-terms or installed-core inquiries.

### C05 — exact official whole-module license text resolves Compiler and IO headerless gaps

The current published sites identify newer versions (Compiler `2.17.1`, IO `3.8.0`) and were
therefore rejected as exact-version evidence. The official repositories retain their earlier
published-site history on `gh-pages`. Read-only GitHub history inspection located the specific
site commits below. These are first-party published **complete project-license texts**, not
a badge, an SPDX label or a third-party dependency summary. The page's project-version field
and the same site's source-control page tie the grant to the exact source release.

| Source ID / exact primary page | Version and source linkage | Actual reviewed legal text and decoded-text SHA-256 |
|---|---|---|
| `S-COMP-API-GRANT` [Compiler API project license at site commit `28244fca3a92a1248bf8e9c2eb3add4ee4bac686`](https://raw.githubusercontent.com/codehaus-plexus/plexus-compiler/28244fca3a92a1248bf8e9c2eb3add4ee4bac686/plexus-compiler-api/licenses.html) | Page title Plexus Compiler Api; version `2.16.2`; published 2026-01-25 | Complete Apache License 2.0, sections 1–9 and appendix, HTML-decoded UTF-8 SHA-256 `CFC7749B96F63BD31C3C42B5C471BF756814053E847C10F3EB003417BC523D30`; full HTML UTF-8 SHA-256 `0C30C6EB725EF5451A88F18ADB6FA656647891E7B1A7A4DBD2AD924E09FCC295` |
| `S-COMP-JAVAC-GRANT` [Javac component project license at the same exact site commit](https://raw.githubusercontent.com/codehaus-plexus/plexus-compiler/28244fca3a92a1248bf8e9c2eb3add4ee4bac686/plexus-compilers/plexus-compiler-javac/licenses.html) | Page title Plexus Javac Component; version `2.16.2`; published 2026-01-25 | Same complete Apache-2.0 text/hash; full HTML UTF-8 SHA-256 `91AACFC5E4732405E179FFBC41EF26DB495536A26147578B5EC9BCE97F2A4F17` |
| `S-IO-GRANT` [IO project license at site commit `3c9a3affaa9e87b21e84f72a3f3f12854773e9ba`](https://raw.githubusercontent.com/codehaus-plexus/plexus-io/3c9a3affaa9e87b21e84f72a3f3f12854773e9ba/licenses.html) | Page title Plexus IO Components; version `3.6.0`; published 2025-11-07 | Same complete Apache-2.0 text/hash; full HTML UTF-8 SHA-256 `517DCAF9956FAE15ACF9EADB5FF08BB1DFC772A14473D3BFD24C998F2CAD0E15` |

The [Compiler site's source-control page](https://raw.githubusercontent.com/codehaus-plexus/plexus-compiler/28244fca3a92a1248bf8e9c2eb3add4ee4bac686/scm.html)
identifies `plexus-compiler-2.16.2`; HTML UTF-8 SHA-256
`49E959A3BE68B80B425179D22EBE9B4A756C20B7C9D27D55D1BE50933F6A91E1`.
The [IO site's source-control page](https://raw.githubusercontent.com/codehaus-plexus/plexus-io/3c9a3affaa9e87b21e84f72a3f3f12854773e9ba/scm.html)
identifies `plexus-io-3.6.0`; HTML UTF-8 SHA-256
`46696740B39AFA95EEB07CC00BD27CB3FCEE2C6A1A00738520E34502E8EAFCBB`.
The site's overview distinguishes the project's own licensing from dependency licenses.
The complete legal payloads match byte-for-byte the Apache text already read in this record;
this use of complete actual text is distinct from accepting only inherited POM metadata.

Engineering interpretation: the explicit official whole-module grant covers its original
headerless files as part of that project. No contrary individual grant was found for
`PlexusLoggerWrapper.java` or `InProcessCompiler.java`. Existing MIT headers remain preserved
as actual source grants/attributions; this observation does not erase or relicense them.
For IO, the actual release NOTICE is still retained alongside its complete project grant.
The recommended internal-use dispositions are therefore `APPROVED-WITH-OBLIGATIONS`, with
O1/O3 in the parent intake; retention of both MIT and Apache notice material for Compiler
and Apache/ASF NOTICE for IO. No special terms were waived to reach that evidence conclusion.

### C06 — exact QDox project grant plus generator-input and output provenance

The exact `qdox-2.2.0` root [LICENSE.txt](https://raw.githubusercontent.com/paul-hammant/qdox/qdox-2.2.0/LICENSE.txt)
is an actual project grant naming Joe Walnes and the QDox Project Team, applying Apache-2.0.
Its UTF-8 SHA-256 remains `A02E970B1159212C1879FE1078FCF2CFA4F2C45885ED3D27AF805A67EEF1B912`.
It does not exclude generated production classes. The exact release
[README](https://raw.githubusercontent.com/paul-hammant/qdox/qdox-2.2.0/README.md)
identifies the custom parser as generated by JFlex and BYacc/J, and describes supplied bootstrap
executables. Its UTF-8 SHA-256 is
`1E5235696A3782244EABC65FC1AC5D94D706E2EF64900EE52ABEBFD9EEF4E097`.

The exact release [build POM](https://raw.githubusercontent.com/paul-hammant/qdox/qdox-2.2.0/pom.xml)
pins `jflex-maven-plugin:1.9.1`, two lexer input definitions and the
`target/generated-sources/parser` output directory. It specifies no custom skeleton.
The two BYacc/J executions identify parser/comment-parser inputs and output class/package names;
their producer is `${qdox.byaccj.executable}`, with OS-specific bootstrap executable paths.
These first-party build instructions explain why searching only `src/main/java` misses the
five generated files. POM UTF-8 SHA-256
`AC30EFE4C70263EF0CB19AD1F69BFA416043626D1F80C9BEFE9C3BF3B6A2B50B`
is a tag-source-text checksum, distinct from the cached publication POM checksum in section 1.

All four exact grammar inputs were inspected and have actual Apache-2.0 grants:

| Exact input / primary source link | Identified output | Input UTF-8 SHA-256 |
|---|---|---|
| [parser.y](https://raw.githubusercontent.com/paul-hammant/qdox/qdox-2.2.0/src/grammar/parser.y) | `Parser`, BYacc/J with `-Jsemantic=Value` | `0627E89CDF501AE6FF2C45B4399554EFB2BDE2E6F77EC2437C540186480A71B4` |
| [commentparser.y](https://raw.githubusercontent.com/paul-hammant/qdox/qdox-2.2.0/src/grammar/commentparser.y) | `DefaultJavaCommentParser` and default semantic-value class `DefaultJavaCommentParserVal` | `A913E08D760403F6C405D9858CCCEDD03D6CB6298D7F8A2031EEE3308B17113F` |
| [lexer.flex](https://raw.githubusercontent.com/paul-hammant/qdox/qdox-2.2.0/src/grammar/lexer.flex) | `%class JFlexLexer` | `8829EA429BE54BEDB7ABFFB12EBB7AA045DAFC7D478342F5CBC89A1CCDA49AD4` |
| [commentlexer.flex](https://raw.githubusercontent.com/paul-hammant/qdox/qdox-2.2.0/src/grammar/commentlexer.flex) | `%class DefaultJavaCommentLexer` | `F738EC2B05B19D79E37E14DD1E537B9D88F12B7CAE3120889944818877D3443D` |

JFlex's exact [v1.9.1 LICENSE.md](https://raw.githubusercontent.com/jflex-de/jflex/v1.9.1/LICENSE.md)
was read in full: actual BSD-3-Clause grant naming Gerwin Klein, Steve Rowe, Régis Décamps and
Google LLC; preserve notices/conditions/disclaimer and no-endorsement terms. Its UTF-8 SHA-256
is `6F9780D32E241518FC3421C04434D08B60F0E90676D15AAD84ABD54A71F2FE53`.
The CC0 comment in that file applies to the license text itself, not all JFlex code.
The exact [default skeleton](https://raw.githubusercontent.com/jflex-de/jflex/v1.9.1/jflex/src/main/resources/jflex/skeleton.default)
is available under the same tagged project; its UTF-8 SHA-256 is
`2F5C1590828D0C104B9075639B07E8CBB4727C3A7CED897F568745DD80BF1E54`.
The [primary JFlex FAQ](https://jflex.de/faq.html) additionally permits use of generated code
without restriction; it corroborates rather than replaces the exact grant. Engineering keeps
the BSD-3-Clause notice material conservatively with the QDox rights evidence; it does not
convert JFlex into an acquired/executed F05 tool.

The [primary BYacc/J home page](https://byaccj.sourceforge.net/) identifies the Java extension
of Berkeley Yacc, the generated parser/value-class model, no runtime library requirement, and
the project's no-license/no-royalty position; its credits identify Berkeley Yacc as public
domain. The [maintainer-controlled project page](https://sourceforge.net/projects/byaccj/)
records Public Domain. These are owner statements, not a license aggregator inference.
The QDox producer executable's exact BYacc/J version/source build remains `UNKNOWN`.
No binary or producer archive was downloaded and no producer was executed to identify it.

Engineering interpretation and limit: the actual QDox project grant includes its generated
production classes; the exact licensed inputs and declared build mapping explain their origin;
the identified generators' primary rights evidence exposes no conflicting output restriction.
That is sufficient for the bounded ordinary internal-use rights recommendation. It does not
prove that the cached binary was reproduced by those exact producer bytes, nor select a
commercial packaging model. Unknown BYacc producer version and unobserved generated source
publication are recorded authenticity/rebuild limitations, not evidence of absent permission.
Recommend `APPROVED-WITH-OBLIGATIONS`: retain QDox/ASF Apache notices and license, and the
conservative JFlex BSD-3-Clause notice material; reopen intake if contrary generated-code terms
or a changed version/distribution/model is later found. The website documentation itself is
reference-only and was not imported or relicensed as IDEA content.

### C07 — exact Utils 3.5.1 supplemental provenance, custom gate unchanged

The additional current acquisition coordinate
`org.codehaus.plexus:plexus-utils:3.5.1` was read from its existing cached JAR at
`/home/phuclam/.m2/repository/org/codehaus/plexus/plexus-utils/3.5.1/plexus-utils-3.5.1.jar`.
Observed SHA-256 `86E0255D4C879C61B4833ED7F13124E8BB679DF47DEBB127326E7DB7DD49A07B`
matches the current parent's rights inventory. The four non-Apache legal texts below were
read in full; the Apache legal entry is byte-identical to the complete text already inspected.

| Actual embedded entry | Uncompressed-byte SHA-256 / exact rights observation |
|---|---|
| `META-INF/LICENSE` | `CFC7749B96F63BD31C3C42B5C471BF756814053E847C10F3EB003417BC523D30`; Apache-2.0 |
| `META-INF/NOTICE` | `D478D95476787007320DF9DAFB15C932849281E2ACE56E2AACDAC475D29470D7`; Indiana University Extreme Lab, ASF, ThoughtWorks, Javolution and Rome attributions |
| `licenses/extreme.indiana.edu.license.TXT` | `0D01B41CFC401BCF852125959D07B1A6BD578F1A7850907C329E4A70B2874DB2`; Extreme Lab 1.1.1 custom grant and acknowledgement/name/endorsement restrictions |
| `licenses/javolution.license.TXT` | `A7436C952FA2DC0701860CF4187D1E8E8E6DE6720DEC0AE9E0B641BC50EEBCED`; BSD-2-Clause copyright/conditions/disclaimer retention |
| `licenses/thoughtworks.TXT` | `B2F730309348C7A19009DCADD92A5D55D75FD54E6DF4A818EBA7A388656FAED9`; ThoughtWorks/CruiseControl BSD-3-Clause retention and no endorsement |

Utils `3.5.1` therefore remains `BLOCKED-LEGAL` under L1. Its exact evidence is no longer an
additional-version proof gap, but the repository's custom-terms authority gate is not closed.
Engineering retains all five entries, acknowledges the named organizations where the original
terms require it and preserves the name/endorsement restrictions; Legal Review Authority owns
the F05 disposition. This supplemental read does not replace the parent's other Utils/XML
version records or expand this worker's inventory scope.

### Actionable handoff

Propose exactly these four row changes in the parent's rights inventory, retaining their
existing hashes and graph memberships:

| Coordinate | Proposed exact terms | Proposed internal unchanged T027 disposition / action |
|---|---|---|
| `org.codehaus.plexus:plexus-compiler-api:2.16.2` | Whole-module Apache-2.0 grant plus retained MIT file notices | `APPROVED-WITH-OBLIGATIONS`; O1 + O3; C05 and S-COMP-API-GRANT |
| `org.codehaus.plexus:plexus-compiler-javac:2.16.2` | Whole-module Apache-2.0 grant plus retained MIT file notices | `APPROVED-WITH-OBLIGATIONS`; O1 + O3; C05 and S-COMP-JAVAC-GRANT |
| `org.codehaus.plexus:plexus-io:3.6.0` | Whole-project Apache-2.0 grant plus exact ASF NOTICE | `APPROVED-WITH-OBLIGATIONS`; O1; C05 and S-IO-GRANT |
| `com.thoughtworks.qdox:qdox:2.2.0` | QDox Apache-2.0 grant; conservative JFlex BSD-3-Clause notice preservation; BYacc/J owner public-domain/output evidence | `APPROVED-WITH-OBLIGATIONS`; O1 + O2 + O3; C06; unknown producer version retained as limitation |

This bounded pass resolves four evidence-only L4 rows for review. The parent recomputes any
aggregate blocked count after integrating all workers' current findings; this record does not
publish a stale successor graph count or declare Q02 PASS. ExtremeLab, Interpolation's altered
Apache-1.1 text and Sisu EPL-2.0 remain known-term Legal Review/company decisions. Other current
parent blockers remain outside this worker's scope. Legal/execution acceptance, notice-bundle
assembly, package audit, signature/authenticity and reproducible-build qualification are
`NOT-RUN`. No package/archive download, clone/install, host write, Maven/Boot execution,
DB/TLS/port/verifier/timer action, graph edit, commit or push occurred.

| Version | Date | Change |
|---|---|---|
| 0.1 | 2026-10-03 | Exact twelve-component artifact and source-header evidence; conservative headerless/generated L4 gaps retained |
| 0.2 | 2026-10-03 | Resolve four assigned evidence-only L4 rows using complete exact official project grants and attributable generator/input evidence; retain source authenticity limits; confirm Utils 3.5.1 custom supplemental gate |
