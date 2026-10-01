# T043 Maven Web Build Tool Intake

| Field | Value |
|---|---|
| Stable ID | `IE-RES-T043-MAVEN-WEB-INTAKE-20261001` |
| Class / version / status | External-source intake / `0.1` / `Draft` |
| Product normativity | `INFORMATIVE`; no product behavior or commercial clearance |
| Owner / author | Project Reviewer / Codex |
| Reviewer / acceptance | Independent license review `NOT-RUN`; user-authorized internal-use exception below |
| Applicability / date | Issue #24, PR #25, T043 packaging repair / 2026-10-01 |
| Use | `DEPENDENCY`: unmodified Maven build-tool execution only; not an application dependency |
| Classification / retention | `INTERNAL`; retain with this checkpoint and any superseding intake |
| Upstream | [source intake rule](../agents/external-source-intake.md), [T043 contract](../../specs/005-ph1-foundation-custody/contracts/ph1-boundaries.md#t043-web-qualification-contract) |
| Downstream | `apps/server/pom.xml`; clean-package regression; later T036 inventory |
| Change / supersession | New review-request repair intake; supersedes `NOT-APPLICABLE` |
| Review trigger | Any version, dependency graph, distribution or use-scope change; use outside T043 |
| Evidence status | Exact published artifacts and actual license texts inspected before execution |

## Source and scoped disposition

MojoHaus `org.codehaus.mojo:exec-maven-plugin:3.6.3` runs the repository-owned Node build script in
Maven's `generate-resources` phase. Canonical sources are [Maven Central](https://repo.maven.apache.org/maven2/org/codehaus/mojo/exec-maven-plugin/3.6.3/)
and [MojoHaus](https://www.mojohaus.org/exec-maven-plugin/). Tag `3.6.3` resolves to commit
`fe1fa8c1631e599f34c766b33485b220f38bc17e`; the
[license at that commit](https://github.com/mojohaus/exec-maven-plugin/blob/fe1fa8c1631e599f34c766b33485b220f38bc17e/LICENSE.txt)
is Apache-2.0. Retrieval and inspection date: 2026-10-01.

Plexus includes additional license texts, so ordinary pre-use legal review was not claimed.
The user explicitly authorized an exception on 2026-10-01 for **these exact checksummed tools,
only internal T043 build/test**, preserving the terms and excluding commercial redistribution.
Disposition: `APPROVED-WITH-OBLIGATIONS` **under that limited process exception**, not legal approval.
The ordinary custom-license gate remains `BLOCKED-LEGAL` outside this exception; Engineering must
obtain the designated Legal Review Authority's disposition before expanded use or distribution.
This is not the earlier Clean Plugin late-intake exception, and no new Clean Plugin use is needed.

## Exact artifact inventory

All JARs and matching POMs were retrieved from `https://repo.maven.apache.org/maven2/` using their
exact group/artifact/version paths. The plugin's own `META-INF/maven/plugin.xml`, not a current
website dependency table, supplied the eight runtime dependencies below.

| Artifact | JAR SHA-256 | Terms inspected |
|---|---|---|
| `org.codehaus.mojo:exec-maven-plugin:3.6.3` | `389D6D7B681B4B6BACE1EB7B415703889AC011B2B8A8C133A6E5BCF738758AA0` | Source `LICENSE.txt`: Apache-2.0; no embedded LICENSE/NOTICE |
| `org.apache.maven.resolver:maven-resolver-api:1.9.24` | `C0CE14849298720DCF3B09FE9E263B3C576D2D6CD43C61F8AA9D6117E04E5E47` | Embedded Apache-2.0 LICENSE and NOTICE |
| `org.apache.maven.resolver:maven-resolver-util:1.9.24` | `AEB7E776A8C47B1C317A2581F299E2525B044CB8ABDE31164E970BBBEFAB12B1` | Embedded Apache-2.0 LICENSE and NOTICE |
| `org.codehaus.plexus:plexus-utils:4.0.2` | `8957274E75FE2C278B1428DD16A0DAEEE1DD38152CB6EFF816177AC28FCCB697` | Apache-2.0 LICENSE/NOTICE plus three supplemental texts below |
| `org.codehaus.plexus:plexus-xml:3.0.1` | `C1A510A87A62BD2D74AC1472DD31C3F9E9B0B8B8568F37D77C0F135415BEBD05` | Same license/notice and supplemental texts as Plexus Utils |
| `org.apache.commons:commons-exec:1.6.0` | `13DCF3850478EF8DE5D24D298A60EED5E8305EB20538FE632C82EA1DFF6B5EA0` | Embedded Apache-2.0 LICENSE.txt and NOTICE.txt |
| `org.ow2.asm:asm:9.9.1` | `6F3828A215C920059A5EFA2FB55C233D6C54EC5CADCA99CE1B1BDD10077C7DDD` | BSD-3-Clause source header, exact published sources JAR |
| `org.ow2.asm:asm-commons:9.9.1` | `C2319E014CE7199F2B7F7D56D6BB991863168C3F4B6CD6C9F542A4937EF7EF88` | BSD-3-Clause source header, exact published sources JAR |
| `org.ow2.asm:asm-tree:9.9.1` | `0F3555096B720B820BBACAB0B515589BEE0200BEE099BDA14C561738AE837BA1` | BSD-3-Clause source header, exact published sources JAR |

License identity checks:

- Plugin/source and Resolver/Plexus Apache LICENSE SHA-256:
  `CFC7749B96F63BD31C3C42B5C471BF756814053E847C10F3EB003417BC523D30`.
- Resolver API/Util NOTICE hashes respectively:
  `6B9BF2C4FD2B1F84D8CB88D5CD040744DE30CCBEDEBB86EDF45C1888D4C6793A`,
  `9E7EBE763825B132FAF0899F367FB0F81489B366086741278EF9748B50269FC8`.
- Both Plexus NOTICE hashes:
  `D478D95476787007320DF9DAFB15C932849281E2ACE56E2AACDAC475D29470D7`.
- Commons Exec LICENSE.txt/NOTICE.txt hashes respectively:
  `B1D2870F1A00E4D7F56576E5F0870CBA109E041F8AF66866CF5B499478E654E7`,
  `4DDB61C39258E94981CC7B002E419B97BD40F1ACBD91C2F62DE1BC5201172642`.

Both Plexus JARs retain these identical supplemental files, read in full:

| Embedded file | SHA-256 | Obligations to preserve |
|---|---|---|
| `licenses/extreme.indiana.edu.license.TXT` | `0D01B41CFC401BCF852125959D07B1A6BD578F1A7850907C329E4A70B2874DB2` | Indiana University ExtremeLab 1.1.1 terms; copyright/conditions/disclaimer, acknowledgements, endorsement and product-naming restrictions |
| `licenses/javolution.license.TXT` | `A7436C952FA2DC0701860CF4187D1E8E8E6DE6720DEC0AE9E0B641BC50EEBCED` | Javolution BSD-style terms; copyright/conditions/disclaimer |
| `licenses/thoughtworks.TXT` | `B2F730309348C7A19009DCADD92A5D55D75FD54E6DF4A818EBA7A388656FAED9` | ThoughtWorks BSD-style terms; copyright/conditions/disclaimer and no endorsement |

ASM binaries contain no standalone license file. Exact published sources JARs were inspected,
without copying their implementation into IDEA: `AnnotationVisitor.java`, `AdviceAdapter.java`
and `AbstractInsnNode.java` carry the INRIA/France Telecom BSD-3-Clause headers. Sources JAR hashes
respectively: `057E39AA1800B25BC8944846A376509990F49B7FE1E07192B1D6E48E1A780EB2`,
`196E1B24B51F35FE9B09C930E159830DCDED8B113AB2B7394D8AC353752D8A00`,
`9D1FE261FA1D29904CA9DBC76878396E76BC225191676A8C16AD2669A205321A`.

## Compliance actions and limits

Engineering keeps tool artifacts unmodified with their original terms/notices in the build cache;
does not vendor them, use their trademarks or include them in `BOOT-INF/lib`; and checks the resolved
plugin graph/checksums before execution. Any additional execution dependency needs its own intake.
No protected third-party source/text is adapted into the product. POM parent/descriptor metadata
does not become an IDEA runtime dependency.

T036 owns any later commercial packaging/notice/SBOM work. This record admits no new application
dependency, changes no Web lockfile, and proves neither the packaging repair nor browser qualification.
Actual execution and independent product review remain separate evidence. New fields above are
tailored build-tool intake controls, not a standards conformity or legal opinion claim.
