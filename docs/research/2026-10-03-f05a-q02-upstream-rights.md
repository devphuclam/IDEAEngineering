# F05-A / T027 Q02 — exact upstream rights and build-tool supplements

| Control | Value |
|---|---|
| Stable ID / class | `IE-RES-F05A-Q02-UPSTREAM-RIGHTS-20261003` / external-source rights research record |
| Version / status | `0.3 / Draft` |
| Product normativity / repository instruction | `INFORMATIVE / NOT-APPLICABLE`; no product requirement or execution authorization |
| Owner / author / worker mode | Engineering / Codex / `CODEX_ONLY`, bounded research worker |
| Reviewer / acceptance authority | Project Reviewer Nguyễn Huỳnh Phúc Lâm; review and acceptance `NOT-RUN`; Legal Review Authority owns unresolved legal terms and future commercial review |
| Applicability / evidence date | F05-A / T027 Q02 internal unmodified Boot runtime candidates and the ten additional build-tool coordinates below; accessed 2026-10-03 |
| Effective date | `NOT-APPLICABLE`; research is not an approved gate decision |
| Classification / retention | `INTERNAL`; retain with T027 intake, source identities, downstream package evidence and successor decisions |
| Baseline / change record | [Work Item #37](https://github.com/devphuclam/IDEAEngineering/issues/37), [PR #38](https://github.com/devphuclam/IDEAEngineering/pull/38); repository inspection baseline `33f22635f2e0282a761b40908f4a883042e28022`; new record |
| Upstream trace | [Candidate inventory](2026-10-03-f05a-t027-boot-cache-inventory.md), [runtime cache hashes](inventories/f05a-q02-runtime-cache.tsv), [embedded legal-file inventory](inventories/f05a-q02-runtime-legal-files.tsv), [intake procedure](../agents/external-source-intake.md) |
| Downstream trace | Q02 exact used-graph intake and future scoped command/package; later T036 commercial/SBOM review |
| Supersedes / superseded by | `NOT-APPLICABLE / NOT-APPLICABLE`; historical intake decisions are not altered |
| Review trigger | Version, tag/commit, cached hash, production content, dependency graph, modification, packaging, recipient, hosting or distribution model changes |
| Evidence status / tailoring | Direct primary-source release, API tree and file observations; license interpretation is Engineering inference. Research control envelope tailored under [IE-STD-AUTH-001](../agents/product-document-authoring-standard.md); ISO/IEC/IEEE 15289:2019 information identity and ISO 10007:2017 configuration trace are `STANDARD-GUIDED`, with no conformity claim |
| Current disposition | `REFERENCE-ONLY` for this inspection; runtime/build-tool candidates remain `NOT_ADMITTED` until the controlled Q02 intake records its disposition and completes the actions below; JSR305 3.0.2 rights remain `BLOCKED-LEGAL` |

## Scope and result

Intended later use is `DEPENDENCY`: unchanged `org.yaml:snakeyaml:2.6` and
`org.jspecify:jspecify:1.0.1` in the bounded internal T027 Boot build/runtime qualification.
No upstream implementation, examples, documentation, website, logo, media, test suite or build
tool is imported by this record. Source files and legal texts were read remotely into memory;
only this authored summary and provenance enter the repository.

The missing embedded-license observations have exact upstream rights evidence for both versions.
This conclusion comes from the actual release license files and production copyright headers,
not a POM license label or a predecessor version. It does not establish the complete Q02 graph,
authenticate a cached binary as a publisher build, fulfill packaging actions, admit a dependency,
qualify Boot or clear a later commercial offering.

## Exact sources and claims

All source observations below were accessed on 2026-10-03. The publisher-controlled repository
and its hosting API are primary evidence. SHA-256 values were calculated over raw file bytes
decoded from the hosting API's Base64 response without writing those files locally. Git blob
IDs are configuration identities, not SHA-256 file digests.

| Claim / source | Direct observation | Interpretation and limit |
|---|---|---|
| Q02-R01 / SY-01 | The [official SnakeYAML GitHub repository](https://github.com/snakeyaml/snakeyaml) describes itself as a mirror of [Codeberg SnakeYAML](https://codeberg.org/snakeyaml/snakeyaml). The [Codeberg exact tag object](https://codeberg.org/api/v1/repos/snakeyaml/snakeyaml/git/tags/db74116c641984aae1c40b6f4b94c72e2efafa4d) identifies `snakeyaml-2.6`, annotated-tag object `db74116c641984aae1c40b6f4b94c72e2efafa4d`, target commit `9f02cc56e5afb989ca5baac1e0052c3f006cdbec`, dated `2026-02-26T20:18:17Z`. | Canonical current source identity is Codeberg, not an arbitrary fork. Tag API reports an unsigned tag; cryptographic publisher verification is not claimed. The exact source POM retains its historical Bitbucket URLs. |
| Q02-R02 / SY-02 | [SnakeYAML LICENSE.txt at the exact commit](https://codeberg.org/snakeyaml/snakeyaml/src/commit/9f02cc56e5afb989ca5baac1e0052c3f006cdbec/LICENSE.txt), read in full using its [contents API](https://codeberg.org/api/v1/repos/snakeyaml/snakeyaml/contents/LICENSE.txt?ref=9f02cc56e5afb989ca5baac1e0052c3f006cdbec), contains Apache License 2.0 sections 1–9. Git blob `d9a10c0d8e868ebf8da0b3dc95bb0be634c34bfe`; SHA-256 `a6cba85bc92e0cff7a450b1d873c0eaa2e9fc96bf472df0247a26bec77bf3ff9`. | Exact release rights text is established independently of metadata. This file ends at the terms; its byte hash differs from JSpecify's license, which also has the appendix. |
| Q02-R03 / SY-03 | [Exact SnakeYAML pom.xml](https://codeberg.org/snakeyaml/snakeyaml/src/commit/9f02cc56e5afb989ca5baac1e0052c3f006cdbec/pom.xml) says version `2.6`; raw SHA-256 `2773b0e948964d21e37b0e1dcf39025e627b873e0ce6aa2a47e23c374303e0c4` equals the cached POM inventory value. [Yaml.java](https://codeberg.org/snakeyaml/snakeyaml/src/commit/9f02cc56e5afb989ca5baac1e0052c3f006cdbec/src/main/java/org/yaml/snakeyaml/Yaml.java) and [module-info.java](https://codeberg.org/snakeyaml/snakeyaml/src/commit/9f02cc56e5afb989ca5baac1e0052c3f006cdbec/src/main/java9/module-info.java) bear SnakeYAML copyright and Apache 2.0 headers. | Exact source/POM correspondence is observed; it does not prove JAR reproducibility or artifact authenticity. The POM is used for identity, not as a substitute license grant. |
| Q02-R04 / SY-04 | The exact production external subtree contains [Escaper.java](https://codeberg.org/snakeyaml/snakeyaml/src/commit/9f02cc56e5afb989ca5baac1e0052c3f006cdbec/src/main/java/org/yaml/snakeyaml/external/com/google/gdata/util/common/base/Escaper.java), [PercentEscaper.java](https://codeberg.org/snakeyaml/snakeyaml/src/commit/9f02cc56e5afb989ca5baac1e0052c3f006cdbec/src/main/java/org/yaml/snakeyaml/external/com/google/gdata/util/common/base/PercentEscaper.java), and [UnicodeEscaper.java](https://codeberg.org/snakeyaml/snakeyaml/src/commit/9f02cc56e5afb989ca5baac1e0052c3f006cdbec/src/main/java/org/yaml/snakeyaml/external/com/google/gdata/util/common/base/UnicodeEscaper.java). Each legal header identifies Google Inc., 2008, and Apache 2.0. | Supplemental third-party copyright attribution exists even though the candidate JAR inventory found no standalone legal entry. These three observed headers contain no additional license grant or custom restriction. Preserve their attribution in later packaging evidence; do not infer it from another SnakeYAML version. |
| Q02-R05 / JS-01 | [Official JSpecify 1.0.1 release](https://github.com/jspecify/jspecify/releases/tag/v1.0.1) links to commit `ce9bec0b8895f424d999d31e3a1bd33694ee4c0c`; the [exact tag reference API](https://api.github.com/repos/jspecify/jspecify/git/ref/tags/v1.0.1) confirms a commit reference at that SHA. [gradle.properties](https://github.com/jspecify/jspecify/blob/ce9bec0b8895f424d999d31e3a1bd33694ee4c0c/gradle.properties) says group `org.jspecify`, version `1.0.1`. | Exact version/source identity is established. Release statements about semantic compatibility are not runtime qualification evidence. |
| Q02-R06 / JS-02 | [JSpecify LICENSE at the exact commit](https://github.com/jspecify/jspecify/blob/ce9bec0b8895f424d999d31e3a1bd33694ee4c0c/LICENSE), read in full through its [contents API](https://api.github.com/repos/jspecify/jspecify/contents/LICENSE?ref=ce9bec0b8895f424d999d31e3a1bd33694ee4c0c), contains Apache License 2.0 and the application appendix. Git blob `d645695673349e3947e8e5ae42332d0ac3164cd7`; SHA-256 `cfc7749b96f63bd31c3c42b5c471bf756814053e847c10f3eb003417bc523d30`. | Actual exact-release license evidence replaces the missing embedded text; a source URL alone does not fulfill the future obligation to accompany recipients with a license copy. |
| Q02-R07 / JS-03 | [Exact AUTHORS](https://github.com/jspecify/jspecify/blob/ce9bec0b8895f424d999d31e3a1bd33694ee4c0c/AUTHORS), SHA-256 `e70db5d4e0bd433a8b9357518dd8f8847c434826d9587cfc35eca1e1d5a57d3f`, identifies Google LLC, Oracle America, Inc. and SpotBugs Team as copyright authors. The four annotation classes, package-info and module-info were checked at this commit; their legal headers name The JSpecify Authors and Apache 2.0. | AUTHORS is a copyright identity record, not a separate custom license. Retain its provenance and copyright attribution with the unmodified dependency; no IDEA branding permission follows. |

### Production tree and notice-search limits

The [SnakeYAML root contents API](https://codeberg.org/api/v1/repos/snakeyaml/snakeyaml/contents?ref=9f02cc56e5afb989ca5baac1e0052c3f006cdbec)
lists `LICENSE.txt` and no root `NOTICE` or `COPYRIGHT` file. The full recursive repository API
truncated at 1,000 entries, so it does not establish absence of other files across the repository.
The exact production [Java subtree](https://codeberg.org/api/v1/repos/snakeyaml/snakeyaml/git/trees/b42fbc6c42a98d02d7657285f9dcd18728f1e257?recursive=true)
and [Java 9 subtree](https://codeberg.org/api/v1/repos/snakeyaml/snakeyaml/git/trees/8724e80884c265a6c417bfd194b91af29fe2664a?recursive=true)
both returned `truncated=false`. No separate license/notice/copyright-named file appeared there;
the three external Google classes above remain affirmative attribution evidence. This is not a
full source-header audit of every SnakeYAML class, test, documentation or build-tool component.

The [JSpecify exact recursive tree](https://api.github.com/repos/jspecify/jspecify/git/trees/ce9bec0b8895f424d999d31e3a1bd33694ee4c0c?recursive=1)
returned `truncated=false`. Its only license-named files are `LICENSE` and the Java header template;
it has `AUTHORS` and no separate `NOTICE`-named file. All six production Java legal headers were
checked: [NonNull](https://github.com/jspecify/jspecify/blob/ce9bec0b8895f424d999d31e3a1bd33694ee4c0c/src/main/java/org/jspecify/annotations/NonNull.java),
[NullMarked](https://github.com/jspecify/jspecify/blob/ce9bec0b8895f424d999d31e3a1bd33694ee4c0c/src/main/java/org/jspecify/annotations/NullMarked.java),
[NullUnmarked](https://github.com/jspecify/jspecify/blob/ce9bec0b8895f424d999d31e3a1bd33694ee4c0c/src/main/java/org/jspecify/annotations/NullUnmarked.java),
[Nullable](https://github.com/jspecify/jspecify/blob/ce9bec0b8895f424d999d31e3a1bd33694ee4c0c/src/main/java/org/jspecify/annotations/Nullable.java),
[package-info](https://github.com/jspecify/jspecify/blob/ce9bec0b8895f424d999d31e3a1bd33694ee4c0c/src/main/java/org/jspecify/annotations/package-info.java),
and [module-info](https://github.com/jspecify/jspecify/blob/ce9bec0b8895f424d999d31e3a1bd33694ee4c0c/src/java9/java/module-info.java).
No additional term was identified in those inspected legal headers. Documentation/site and build
dependencies are outside the intended binary dependency use; this record does not admit them.

## Cached candidates to reconcile

These identities are copied from the existing [observed runtime cache table](inventories/f05a-q02-runtime-cache.tsv),
not freshly fetched or independently rehashed here. No cached JAR was executed.

| Coordinate | Cached JAR SHA-256 | Cached POM SHA-256 |
|---|---|---|
| `org.yaml:snakeyaml:2.6` | `c8f7a98e7394adda02f6317249710e4d1b4c7a25aa8c7eace0c2eea52eb8bf85` | `2773b0e948964d21e37b0e1dcf39025e627b873e0ce6aa2a47e23c374303e0c4` |
| `org.jspecify:jspecify:1.0.1` | `070d75f261fe4c5b8202508366715f7f2d4660f88c8ef7e6d3575e48c9683b66` | `55b38bf1a7b1d8ea518cf2f4f3ae9aaa236e61bbf0b6bd31ffb49753a059dd5e` |

The source-to-binary content/authentication check is `NOT-RUN`. Engineering owns reconciling
these candidates with the exact admitted graph and retaining package-content evidence before use.
Any mismatch reopens intake; it is not repaired by substituting another installed version.

## Obligations for the proposed bounded use

The following interpretation is derived from the actual two Apache 2.0 license files above.
Actions are prospective Engineering intake controls; no completed packaging or legal decision
is claimed. Both license files cover sections 1–9, including the same substantive conditions.

| Obligation / condition | Application to internal unmodified dependency use | Owner and concrete action / current state |
|---|---|---|
| Copyright grant, sections 1–2 | Reproduction/use of the unchanged components is covered subject to the license conditions; separable interface linking is excluded from the license's derivative-work definition. | Engineering records exact `DEPENDENCY` scope in Q02 intake; current admission `NOT_ADMITTED`. |
| License copy, section 4(a) | Other recipients of copies receive the license. No special internal-use exception is inferred. | Engineering retains each exact license text/hash and includes a readable copy with the internal qualification package before distribution; `NOT-RUN`. A provenance link alone is insufficient. |
| Copyright/attribution, sections 4(c)–(d) | Retain applicable source attributions if source/derivative material is distributed. A distributed derivative includes applicable upstream NOTICE attributions if such a NOTICE belongs to its distribution. | Engineering retains SnakeYAML attribution, the three Google 2008 attributions and JSpecify AUTHORS provenance/copyrights in the package's third-party record; inspect the actual package for any additional notices before disposition; `NOT-RUN`. No root NOTICE was found in the inspected source states, but future package evidence still owns distribution completeness. |
| Modification notices, section 4(b) | No upstream modification is planned; modification marking becomes applicable if files change. | Engineering keeps dependency bytes unchanged and reopens intake on modification; no upstream modification performed. |
| Patent grant/termination, section 3 | Grant covers the defined contributor patent claims; specified patent litigation terminates the Work's patent license. | Engineering carries the license text; Legal Review Authority handles any relevant patent dispute/uncertainty. No independent patent-clearance claim. |
| Trademark, section 6 | No general trademark/name/logo permission is granted. | Engineering uses names only for provenance and avoids upstream logos/branding; no asset imported. |
| Contributor terms, section 5 | Intentionally submitted contributions have the stated default license, subject to separate agreements. | Engineering does not submit upstream contributions in this task; any later contribution is separately reviewed. |
| Warranty/liability, sections 7–9 | Upstream warranty/liability limitations apply; accepting support/warranty liability is on the distributor's behalf and carries the stated indemnity condition. | Engineering retains terms; Legal Review Authority evaluates any later support/warranty offering. No support/warranty undertaking is made here. |
| Source-offer/copyleft/network use, commercial/field/seat restrictions | No corresponding-source, relinking, network-copyleft, noncommercial, field-of-use, seat/server fee or export-specific condition was identified in the inspected licenses/headers. | Engineering inference limited to the inspected exact materials; any conflicting or supplemental term blocks intake for Legal Review. This is not future-commercial clearance. |

Research finding: exact Apache 2.0 source evidence is available for both candidates, with the
copyright supplements stated above. Engineering can consume this finding in a bounded
`APPROVED-WITH-OBLIGATIONS` intake proposal once actual-use identity, package notices and their
retention actions are reconciled. This note itself leaves admission open. Later distribution,
commercial offering and complete Software Bill of Materials (SBOM) review remain owned by
T036 / [IE-GOV-COMMERCIAL-001](../product/instances/idea-engineering/registers/GOV-future-commercial-readiness.md).

## Verification and handoff

| Check | Actual result / limit |
|---|---|
| Exact source identity and legal text | `PASS` for primary-source inspection only: both tags/commits established; full exact licenses read; supplemental headers and copyright records inspected; raw legal file hashes retained above. |
| Cached binary provenance/content correspondence | `NOT-RUN`; SnakeYAML source POM hash equals the existing cache POM hash, but this does not authenticate either JAR. |
| License/notice copying and package completeness | `NOT-RUN`; no upstream legal text or package imported. |
| Reviewer/Legal acceptance and runtime admission | `NOT-RUN`; no authority or dependency disposition changed. |
| Repository document/link validator | `NOT-RUN`; excluded from this bounded research worker task. |
| Maven/Boot/build/test/database/TLS/port/preview/verifier | `NOT-RUN`; no execution or provisioning in this task. |

Prepared on isolated branch `codex/q02-upstream-rights` from the baseline above. Only this file
was authored; no commit, push, merge, Work Item update, timer or Tracker action was taken.
Next action: the continuity owner integrates the research note and reconciles the two exact
source records and notice actions into the complete Q02 pre-use package.

| Version | Date | Change |
|---|---|---|
| 0.1 | 2026-10-03 | Exact SnakeYAML 2.6 and JSpecify 1.0.1 upstream rights, supplemental copyright evidence, raw license hashes, inspection limits and prospective internal-use obligations |
| 0.2 | 2026-10-03 | Add ten exact build-tool candidate rights investigations, license-option selections, remote cached identities and unresolved JSR305 3.0.2 rights |
| 0.3 | 2026-10-03 | Establish exact ASM9.7 and jdependency2.10 wrapper/shaded rights; retain precise unresolved JSR3053.0.2 publication-to-source linkage |

## Additional build-tool rights investigation — 2026-10-03

This section extends the original two-runtime investigation to ten additional coordinates in the
candidate Boot plugin/build graph. Intended use is `DEPENDENCY`, unchanged internal T027
build-tool execution only. Their presence here does not authorize Maven execution or put them in
the Gateway runtime package. Source/build tools that upstream used to produce these binaries are
not themselves selected IDEA dependencies by this record.

The authorized cache is `/home/phuclam/.m2/repository` on the SSH development host
`192.168.137.33`, user `phuclam`. Read-only targeted directory searches found no exact
`*-sources.jar` for any of these ten coordinates. Existing cached JAR/POMs were hashed with
`sha256sum`; JNA legal entries were streamed with `/usr/bin/busybox unzip -p` without extraction.
An initial WSL availability check did not access this cache and supplies no artifact evidence.
No package was downloaded, installed, resolved or executed. Official remote source/legal files
were read in memory; hashes below use their raw response bytes.

### Exact release and rights findings

The GitHub tag reference APIs established the pinned identities below before their unauthenticated
rate limit was reached. Subsequent legal texts were read from the same publisher's raw-file
endpoint pinned to the established commit. The failed API responses were not treated as file
contents or valid hashes. All findings remain informative research proposals for the continuity
owner's controlled intake; the terms and package-retention actions still precede dependency use.

| Claim / coordinate | Exact primary-source evidence | Rights finding / proposed disposition for the bounded build-tool use |
|---|---|---|
| Q02-R08 / `org.jspecify:jspecify:1.0.0` | [v1.0.0 tag reference](https://api.github.com/repos/jspecify/jspecify/git/ref/tags/v1.0.0) points to `b2a10e14bb81c1b7cb6e488c112fe55cb2218d7d`. Exact [LICENSE](https://github.com/jspecify/jspecify/blob/b2a10e14bb81c1b7cb6e488c112fe55cb2218d7d/LICENSE) was read in full; [AUTHORS](https://github.com/jspecify/jspecify/blob/b2a10e14bb81c1b7cb6e488c112fe55cb2218d7d/AUTHORS) identifies Google LLC and SpotBugs Team. The exact recursive tree was untruncated and showed no NOTICE file. | Apache-2.0; proposal `APPROVED-WITH-OBLIGATIONS`, retain exact LICENSE and copyright provenance. This is separate evidence for 1.0.0, not an inferred extension of 1.0.1; the AUTHORS contents differ. |
| Q02-R09 / `net.java.dev.jna:jna:5.17.0` and `jna-platform:5.17.0` | [5.17.0 tag reference](https://api.github.com/repos/java-native-access/jna/git/ref/tags/5.17.0) points to `695ae749e7bfd92f88324147c5d96b7129efec3e`. Exact [LICENSE](https://github.com/java-native-access/jna/blob/695ae749e7bfd92f88324147c5d96b7129efec3e/LICENSE) explicitly offers `Apache-2.0 OR LGPL-2.1-or-later`; exact [AL2.0](https://github.com/java-native-access/jna/blob/695ae749e7bfd92f88324147c5d96b7129efec3e/AL2.0) read in full. Both cached JARs contain byte-identical `META-INF/LICENSE`, `META-INF/AL2.0` and `META-INF/LGPL2.1`. | Select the offered Apache-2.0 option for both unmodified build-tool binaries; proposal `APPROVED-WITH-OBLIGATIONS`, subject to libffi notice action below. The LGPL source/relinking alternative is not selected. Keep all original embedded legal entries unchanged; do not strip the unused option. |
| Q02-R10 / JNA native supplement | Exact [native/libffi/LICENSE](https://github.com/java-native-access/jna/blob/695ae749e7bfd92f88324147c5d96b7129efec3e/native/libffi/LICENSE) grants MIT terms and identifies Anthony Green, Red Hat, Inc. and others, 1996–2022. [LICENSE-BUILDTOOLS](https://github.com/java-native-access/jna/blob/695ae749e7bfd92f88324147c5d96b7129efec3e/native/libffi/LICENSE-BUILDTOOLS) explicitly distinguishes certain GPL-v2 build/test tooling from libffi itself and says libffi is not derived from that tooling. Cached `jna` includes native dispatch libraries. | Preserve libffi copyright and permission text alongside JNA's Apache option for internal copies. The main JNA choice does not replace MIT retention. No libffi source-build tooling/test suite is imported or executed here; importing/rebuilding it would reopen intake. This is not an audit or admission of upstream build-tool packages. |
| Q02-R11 / `org.tomlj:tomlj:1.0.0` | [1.0.0 tag reference](https://api.github.com/repos/tomlj/tomlj/git/ref/tags/1.0.0) identifies annotated tag `5d5e6158a3d96d765811fa0e47dadfc3a43f8b02`, targeting `0c1f92a925461fe755f5da62a07dcdb2e9537dbe`. Exact [LICENSE](https://github.com/tomlj/tomlj/blob/0c1f92a925461fe755f5da62a07dcdb2e9537dbe/LICENSE) was read in full. Its untruncated recursive tree showed no NOTICE file. | Apache-2.0; proposal `APPROVED-WITH-OBLIGATIONS`, retain full license and applicable copyright attribution. ANTLR and JSR305 remain separate graph/rights entries; tomlj's license does not admit them. |
| Q02-R12 / `org.antlr:antlr4-runtime:4.7.2` | [4.7.2 tag reference](https://api.github.com/repos/antlr/antlr4/git/ref/tags/4.7.2) identifies annotated tag `bf07d4e5faf9aa1d1e69ce92b3bfb36b15cd1633`, targeting `be58ebffde8e29c154192c019608f0a5b8e6a064`. Exact [LICENSE.txt](https://github.com/antlr/antlr4/blob/be58ebffde8e29c154192c019608f0a5b8e6a064/LICENSE.txt) has the BSD-3-Clause grant, ANTLR Project copyright 2012–2017 and separate MIT notices for JavaScript codepoint functions. | BSD-3-Clause for the selected Java runtime; proposal `APPROVED-WITH-OBLIGATIONS`. Preserve copyright, conditions and disclaimer with any internal binary copies; no ANTLR/contributor endorsement. Keep the upstream legal file intact. Its JavaScript notices are recorded source evidence; no JavaScript runtime is selected by this Java coordinate. |
| Q02-R13 / `org.slf4j:slf4j-api:1.7.36` | [v_1.7.36 tag reference](https://api.github.com/repos/qos-ch/slf4j/git/ref/tags/v_1.7.36) identifies annotated tag `e4b93526e5f005e9ab7750c993520ab2b680166c`, targeting `e9ee55cca93c2bf26f14482a9bdf961c750d2a56`. Exact API-module [LICENSE.txt](https://github.com/qos-ch/slf4j/blob/e9ee55cca93c2bf26f14482a9bdf961c750d2a56/slf4j-api/LICENSE.txt) is MIT, QOS.ch Sarl copyright 2004–2022. | MIT; proposal `APPROVED-WITH-OBLIGATIONS`, include copyright and permission notice in internal copies/substantial portions. Other SLF4J modules have separate files; they are not admitted by this API-module finding. |
| Q02-R14 / `javax.inject:javax.inject:1` | The [official Release 1](https://github.com/javax-inject/javax-inject/releases/tag/1) identifies tag `1` and commit `1e4a33307a1a2c5f38dd87e9458591a02b6f2f41`. Exact six API source legal headers under [src/javax/inject](https://github.com/javax-inject/javax-inject/tree/1e4a33307a1a2c5f38dd87e9458591a02b6f2f41/src/javax/inject) were read: Inject, Named, Provider, Qualifier, Scope and Singleton. Each explicitly grants Apache 2.0 terms with JSR-330 Expert Group copyright 2009. The tag's POM hash equals the cached POM below. | Apache-2.0 from actual exact-release source headers, not metadata alone; proposal `APPROVED-WITH-OBLIGATIONS`. Retain Expert Group attribution and an Apache 2.0 license copy. This covers the API binary only; no specification/TCK redistribution or conformance claim. |
| Q02-R15 / `org.tukaani:xz:1.12` | [v1.12 tag reference](https://api.github.com/repos/tukaani-project/xz-java/git/ref/tags/v1.12) identifies annotated tag `9c58916d2b169de9409875a6361e633a0d678004`, targeting `107a519fac1e6789101ad9c234afe3dc407be7f5`. Exact [COPYING](https://github.com/tukaani-project/xz-java/blob/107a519fac1e6789101ad9c234afe3dc407be7f5/COPYING) and [LICENSES/0BSD.txt](https://github.com/tukaani-project/xz-java/blob/107a519fac1e6789101ad9c234afe3dc407be7f5/LICENSES/0BSD.txt) grant use/copy/modify/distribute for any purpose with or without fee. Exact build.xml explicitly identifies 0BSD and the XZ for Java authors/contributors. | 0BSD, not an assumption of a predecessor's public-domain terms; proposal `APPROVED` for bounded rights compatibility, with cache/graph/admission still open. The inspected grant contains no attribution-retention condition; Engineering retains COPYING/provenance as intake evidence and keeps any existing package attribution. |
| Q02-R16 / `com.github.luben:zstd-jni:1.5.7-9` | [v1.5.7-9 tag reference](https://api.github.com/repos/luben/zstd-jni/git/ref/tags/v1.5.7-9) points to `ea32a0208b74446922647c33b82c6a151ab06e8e`. Exact root [LICENSE](https://github.com/luben/zstd-jni/blob/ea32a0208b74446922647c33b82c6a151ab06e8e/LICENSE) is BSD-2-Clause; native [LICENSE](https://github.com/luben/zstd-jni/blob/ea32a0208b74446922647c33b82c6a151ab06e8e/src/main/native/LICENSE) is BSD-3-Clause. The exact [zstd.h](https://github.com/luben/zstd-jni/blob/ea32a0208b74446922647c33b82c6a151ab06e8e/src/main/native/zstd.h) legal header explicitly offers the BSD-style or GPL-v2 alternative. The exact [xxhash.h](https://github.com/luben/zstd-jni/blob/ea32a0208b74446922647c33b82c6a151ab06e8e/src/main/native/common/xxhash.h) header makes the same choice and identifies Yann Collet / Meta Platforms, Inc. Cached JAR includes native binaries and no standalone legal-named entry. | Select the offered BSD option for native code, together with BSD-2-Clause for the JNI wrapper; proposal `APPROVED-WITH-OBLIGATIONS`. Preserve Luben Karavelov and Facebook/Meta/xxHash attribution, both BSD license conditions/disclaimers, and avoid endorsement. Do not classify this entire binary as only BSD-2-Clause or silently select GPL. |
| Q02-R17 / `com.google.code.findbugs:jsr305:3.0.2` | Cached exact POM identifies [Google Code jsr-305](https://code.google.com/archive/p/jsr-305/) and an Apache license label, but has no exact release commit. Exact cached sources JAR is absent. No exact-release license/header source tied to this Maven publication was established. The [Google-hosted historical RI LICENSE](https://chromium.googlesource.com/external/jsr-305/+/fdfdc61084f5084c0ea2fd344c3840c4bda3e893/ri/LICENSE) gives BSD-3-Clause, but its relationship to the 3.0.2 binary is `UNKNOWN`. | `BLOCKED-LEGAL`: neither the metadata's Apache label nor a historical RI BSD license proves the rights for these exact bytes. Do not infer a grant from a current fork, another artifact/version or a third-party notice. Engineering owns finding attributable exact package/source evidence; Legal Review Authority resolves conflicting/unclear terms before use. |

The inferred compatibility proposals above address rights only. They do not change the current
`NOT_ADMITTED` cache disposition or exercise Project Reviewer/Legal Review authority. Apache
obligations use the earlier table; MIT/BSD retention and no-endorsement conditions remain distinct.
For JNA/zstd license alternatives, the actual inspected grant permits selection; this is not a
waiver of copyleft for code lacking such an option. No LGPL/GPL-only component is admitted here.

### Legal-file and supplement hashes

Files below were read in full where their license option is selected; the GPL/LGPL alternative
is recorded for identity, without claiming a complete copyleft compliance review. JNA's embedded
selected texts were read in full and their hashes equal the source files. No notices were stripped.

| Exact source file / pinned identity above | SHA-256 |
|---|---|
| JSpecify 1.0.0 LICENSE | `cfc7749b96f63bd31c3c42b5c471bf756814053e847c10f3eb003417bc523d30` |
| JSpecify 1.0.0 AUTHORS | `7353fdb5b1feba97c03ee2d142cad73681d07d30d70b4aac92bfd7cf7c0f315f` |
| JNA 5.17.0 LICENSE; both JARs META-INF/LICENSE | `07c938b23950ab7d47a24ef35f9f5da3a05ae164278dc959ad6994135ed59ff1` |
| JNA 5.17.0 AL2.0; both JARs META-INF/AL2.0 | `0d542e0c8804e39aa7f37eb00da5a762149dc682d7829451287e11b938e94594` |
| Both JNA JARs META-INF/LGPL2.1, unselected option | `eea173a556abac0370461e57e12aab266894ea6be3874c2be05fd87871f75449` |
| JNA 5.17.0 native/libffi/LICENSE | `2c9c2acb9743e6b007b91350475308aee44691d96aa20eacef8e199988c8c388` |
| JNA 5.17.0 native/libffi/LICENSE-BUILDTOOLS, outside binary dependency scope | `e67978cd18816c0cb7d29aaaacde7b7447402c2fb321a051698890a8eaedda94` |
| tomlj 1.0.0 LICENSE | `b40930bbcf80744c86c46a12bc9da056641d722716c378f5659b9e555ef833e1` |
| ANTLR 4.7.2 LICENSE.txt | `b1b379fcaf3219593a4c433feb1b35c780bed23fafaae440b1ae2771a9521e3a` |
| SLF4J 1.7.36 slf4j-api/LICENSE.txt | `6fbe2eaf44b193b8a40eed9208f52848572224ad8d7672dd09418aa174847e73` |
| javax.inject 1 Inject.java, including actual grant header | `04cefc686b5ea6d0d40d569d2345a3a6f0a5f6baa5c39976f047fbbd7bc5cf9f` |
| XZ 1.12 COPYING | `1e77ef26cee5216d6531e49cbf2f6111a0270dc7b322fc65477063c5aff88766` |
| XZ 1.12 LICENSES/0BSD.txt | `0b01625d853911cd0e2e088dcfb743261034a091bb379246cb25a14cc4c74bf1` |
| zstd-jni 1.5.7-9 LICENSE | `289a6adada5726047b9e68bf607cc44fbbac953bbb4fd29f53ffe75b5cb3e7b1` |
| zstd-jni 1.5.7-9 src/main/native/LICENSE | `2c1a7fa704df8f3a606f6fc010b8b5aaebf403f3aeec339a12048f1ba7331a0b` |
| zstd-jni 1.5.7-9 src/main/native/COPYING, unselected GPL alternative | `f9c375a1be4a41f7b70301dd83c91cb89e41567478859b77eef375a52d782505` |
| zstd-jni 1.5.7-9 src/main/native/zstd.h, alternative-license header | `9b4bc8245565c98ccfc61c07749928b57e7c0f6fddb0530c4f6aa1971893d88b` |
| zstd-jni 1.5.7-9 src/main/native/common/xxhash.h, supplement header | `8cb837b21a8fe9a6b9dbcd0961ab16e733bfcbfa9e003f3a496ce07ae80aa8ee` |

### Exact cached build-tool identities

These are fresh read-only SHA-256 observations on the authorized SSH host, not publisher
authentication or reproducible-build results. The cache path is derived from the coordinate
under the root stated above. Existing rows in [plugin cache inventory](inventories/f05a-q02-plugin-cache.tsv)
match the observations for SLF4J, javax.inject, XZ and zstd-jni; the other six coordinate rows
are recorded here for the continuity owner to reconcile into the extended used graph.

| Coordinate | JAR SHA-256 | POM SHA-256 |
|---|---|---|
| `org.jspecify:jspecify:1.0.0` | `1fad6e6be7557781e4d33729d49ae1cdc8fdda6fe477bb0cc68ce351eafdfbab` | `cdab929a3b95211f43d2090c5e2d0dfe8465960e378bc32b35841dab324433a6` |
| `net.java.dev.jna:jna:5.17.0` | `b3a9408e7c51e08ef0e3bfcc08f443f6ec0f6191ba8cd7c18d53d2b22e5bdbc0` | `501a0ff05d84a4ad10f6de25be94f49398b70a31be8f3a0ed9f4c6b44fbefee4` |
| `net.java.dev.jna:jna-platform:5.17.0` | `b7e3d46c87bad2eb409b0e704916bcd81206168e357312dfddd0e253679cd9e0` | `0a30b797adb6822147ef98cb249ef3fbf4a243542aa86bf9f42fad9e68305a44` |
| `org.tomlj:tomlj:1.0.0` | `32697c7567b2921c473678a820b13fc64700aa87bb14576eeb48d0ed5847cfd4` | `ad8192007f73450c51c880305f14dd22ac551449b721b585fc51231422cb0913` |
| `org.antlr:antlr4-runtime:4.7.2` | `4c518b87d4bdff8b44cd8cbc1af816e944b62a3fe5b80b781501cf1f4759bbc4` | `dc09cba98c25d3c06e4aec516885d4c3af03062ba55f4fe6283fc9cf176a60fb` |
| `com.google.code.findbugs:jsr305:3.0.2` | `766ad2a0783f2687962c8ad74ceecc38a28b9f72a2d085ee438b7813e928d0c7` | `19889dbdf1b254b2601a5ee645b8147a974644882297684c798afe5d63d78dfe` |
| `org.slf4j:slf4j-api:1.7.36` | `d3ef575e3e4979678dc01bf1dcce51021493b4d11fb7f1be8ad982877c16a1c0` | `fb046a9c229437928bb11c2d27c8b5d773eb8a25e60cbd253d985210dedc2684` |
| `javax.inject:javax.inject:1` | `91c77044a50c481636c32d916fd89c9118a72195390452c81065080f957de7ff` | `943e12b100627804638fa285805a0ab788a680266531e650921ebfe4621a8bfa` |
| `org.tukaani:xz:1.12` | `3e158a87bd73d8afb4b6e8239c013b7d049c48563f45860ce99cd2e448cf4a6b` | `937b44d869c059c39f07ae194d8cd6219f5aebf2200ef9707f0b50b7837da281` |
| `com.github.luben:zstd-jni:1.5.7-9` | `087d02f39a46ab79b18f883ac7c3a3d6c2df1fd3bf7eaafeade699e0743d0dbe` | `4412e133520b8f9d01d3601080ce7fe146ee486f6a5a69ca9278d4a4ec69704d` |

### Actions, unresolved evidence and verification limits

Engineering owns recording selected license options in the final Q02 intake, preserving original
JNA embedded texts and supplying the missing selected license/attribution texts with any internal
copies of the other binaries. Native libffi and Zstandard/xxHash notices are additional actions,
not fulfilled by a wrapper's main license. No source/header import or notice packaging has been
performed; those actions are `NOT-RUN`.

Exact JSR305 3.0.2 rights and release-source identity remain `BLOCKED-LEGAL`. Engineering's next
action is to obtain attributable exact-version source/legal evidence within the authorized
inspection policy or present the unresolved rights question to Legal Review Authority. A proposed
exception requires an attributable applicable authority decision; no former-scope exception or
metadata-only Apache claim closes it. Research did not conclude that the binary is necessarily
copyleft or unlicensed; it concluded that the available exact evidence is insufficient.

Source-to-binary authentication, native build provenance, full source-header audits, complete
plugin dependency resolution, actual-used Maven realm filtering, legal/package completeness,
reviewer acceptance and any build/runtime qualification remain `NOT-RUN`. The published tag/file
observations are `PASS` for nine coordinates' bounded rights inspection; JSR305's exact rights
inspection is `BLOCKED`, not a failed runtime test. No future commercial clearance follows.

All original task boundaries remain: no package download/install, Maven/Boot/build/test/database,
TLS, listener/port, preview, verifier, commit/push/merge, Work Item write or timer action. The only
authored path remains this research note in the same isolated worktree.

## Evidence-only blocker checkpoint — version 0.3

This bounded follow-up reviews the three standalone ASM 9.7 coordinates, jdependency 2.10
and JSR305 3.0.2. Intended use remains unchanged internal T027 build-tool `DEPENDENCY` use
only. No used graph was edited. An absent embedded LICENSE is a proof/packaging gap, not
proof that rights do not exist. Actual exact-release terms can close the rights-proof gap;
Engineering still owns notice delivery and controlled intake. This section supersedes no
earlier authority decision and grants no commercial clearance.

### ASM exact release evidence and disposition proposal

The publisher's [ASM_9_7 tag API](https://git.ow2.org/api/v4/projects/asm%2Fasm/repository/tags/ASM_9_7)
reports target object `0e57baee3373d9ee40068ceb78dc0dbc4bf8484a`, resolved commit
`bde266f0d59dd12739ad15a39f1da43a61143eed`, and tag creation `2024-03-23T14:28:59Z`.
The [exact build.gradle](https://git.ow2.org/asm/asm/-/blob/bde266f0d59dd12739ad15a39f1da43a61143eed/build.gradle)
sets release version `9.7` for the subprojects. OW2's service now answers on `git.ow2.org`;
its API retains historical `gitlab.ow2.org` web URLs. No signature verification is claimed.

The [exact LICENSE.txt](https://git.ow2.org/asm/asm/-/blob/bde266f0d59dd12739ad15a39f1da43a61143eed/LICENSE.txt)
was read in full. It grants source/binary redistribution and use, with or without modification,
under three retention/no-endorsement conditions and a warranty/liability disclaimer: the actual
BSD-3-Clause terms, copyright 2000–2011 INRIA and France Telecom. Legal headers were also read
in full in the exact modules' [ClassReader.java](https://git.ow2.org/asm/asm/-/blob/bde266f0d59dd12739ad15a39f1da43a61143eed/asm/src/main/java/org/objectweb/asm/ClassReader.java),
[Remapper.java](https://git.ow2.org/asm/asm/-/blob/bde266f0d59dd12739ad15a39f1da43a61143eed/asm-commons/src/main/java/org/objectweb/asm/commons/Remapper.java)
and [ClassNode.java](https://git.ow2.org/asm/asm/-/blob/bde266f0d59dd12739ad15a39f1da43a61143eed/asm-tree/src/main/java/org/objectweb/asm/tree/ClassNode.java).
Each contains that grant, attribution and disclaimer, not only a license identifier.
The [root tree](https://git.ow2.org/api/v4/projects/asm%2Fasm/repository/tree?ref=bde266f0d59dd12739ad15a39f1da43a61143eed&per_page=100)
lists LICENSE.txt (Git blob `4d191851af43ec3857c72aeadb09ae15fabe3cad`) and no root NOTICE.
This is not an all-file header or third-party source audit.

| Claim / exact coordinate | Evidence and Engineering rights proposal | Required action before recipient copies / limit |
|---|---|---|
| Q02-R18 / `org.ow2.asm:asm:9.7` | Exact common release license plus core production grant above; `APPROVED-WITH-OBLIGATIONS` proposal, BSD-3-Clause | Supply the exact copyright, three conditions and disclaimer in documentation/materials accompanying internal binary copies. Do not imply INRIA, France Telecom or contributor endorsement. |
| Q02-R19 / `org.ow2.asm:asm-commons:9.7` | Same exact release license plus commons production grant above; `APPROVED-WITH-OBLIGATIONS` proposal, BSD-3-Clause | Same binary-retention/no-endorsement actions; keep this coordinate's identity separate from core and tree. |
| Q02-R20 / `org.ow2.asm:asm-tree:9.7` | Same exact release license plus tree production grant above; `APPROVED-WITH-OBLIGATIONS` proposal, BSD-3-Clause | Same binary-retention/no-endorsement actions; preserve source copyright/conditions/disclaimer if source is later copied. |

Read-only SSH ZIP listings show 45, 34 and 45 entries respectively, with no standalone
license/notice entry. No exact sources JAR exists in their targeted cache directories. Those
observations do not negate the actual upstream grants. No source-offer, relinking, network
copyleft or custom/noncommercial restriction was identified in these inspected BSD terms.
Missing license delivery remains an Engineering action (`NOT-RUN`), not unknown rights.

### jdependency exact wrapper and shaded-content scope

Q02-R21: the [official jdependency-2.10 release](https://github.com/tcurdt/jdependency/releases/tag/jdependency-2.10)
links to [commit 025abcded11e228f1e4b7968898fc947b74b1d82](https://github.com/tcurdt/jdependency/commit/025abcded11e228f1e4b7968898fc947b74b1d82).
Its [LICENSE.txt](https://github.com/tcurdt/jdependency/blob/025abcded11e228f1e4b7968898fc947b74b1d82/LICENSE.txt)
contains Apache 2.0 sections 1–9 and appendix, copyright 2010–2019 Torsten Curdt and contributors;
the exact [Clazz.java header](https://github.com/tcurdt/jdependency/blob/025abcded11e228f1e4b7968898fc947b74b1d82/src/main/java/org/vafer/jdependency/Clazz.java)
grants Apache 2.0 and identifies the jdependency developers, 2010–2023. Both actual grants
were reviewed. Its [exact POM](https://github.com/tcurdt/jdependency/blob/025abcded11e228f1e4b7968898fc947b74b1d82/pom.xml)
identifies version 2.10 and has the same SHA-256 as the POM embedded in the cached JAR.
The separate cache POM is dependency-reduced and has a different hash; no mismatch repair
or binary authenticity claim is made.

The release's shade configuration includes Commons IO 2.15.1 and ASM 9.6 core/analysis/
commons/util/tree, with minimization and package relocation. This is identity/content evidence,
not a grant inferred from its license metadata. The actual cached ZIP listing confirms relocated
`org/vafer/jdeb/shaded/commons/io` and `org/vafer/jdeb/shaded/objectweb/asm` core/commons classes.
No relocated analysis/util/tree class appeared in the full listing; upstream build-time inputs
are not automatically extra standalone graph admissions. The existing package is unchanged by
IDEA even though upstream shading transformed bundled classes.

| Shaded rights supplement | Actual primary evidence | Obligation / Engineering proposal |
|---|---|---|
| ASM 9.6, not standalone 9.7 | [Exact ASM_9_6 API](https://git.ow2.org/api/v4/projects/asm%2Fasm/repository/tags/ASM_9_6): target `87418cbf6d6aa2c935d3362e8e41c04b046d06ae`, commit `85cf1aeb0d08be8446f6efbda962817d2a9707dd`. Its actual [LICENSE.txt](https://git.ow2.org/asm/asm/-/blob/85cf1aeb0d08be8446f6efbda962817d2a9707dd/LICENSE.txt) was read in full; same BSD-3-Clause terms, same raw hash as 9.7. | Retain INRIA / France Telecom copyright, conditions and disclaimer with the shaded binary's accompanying materials; no endorsement. No ASM BSD text is embedded in this cached package, so supplement delivery is `NOT-RUN`. Equality is an observation of both exact files, not prior-version inference. |
| Commons IO 2.15.1 | [Official release tag](https://github.com/apache/commons-io/releases/tag/rel%2Fcommons-io-2.15.1) resolves to `dc51644d5adbb0c461efb58380ec51fbca10005d`. Exact [LICENSE.txt](https://github.com/apache/commons-io/blob/dc51644d5adbb0c461efb58380ec51fbca10005d/LICENSE.txt) was reviewed in full; [NOTICE.txt](https://github.com/apache/commons-io/blob/dc51644d5adbb0c461efb58380ec51fbca10005d/NOTICE.txt) names Apache Commons IO and ASF copyright 2002–2023. Both hashes equal jdependency's embedded META-INF entries; its embedded Commons IO pom.properties says 2.15.1. | Apache-2.0: preserve embedded readable license/NOTICE, relevant attribution and patent/trademark/disclaimer terms; do not strip them. Source tag matching supports exact bundled terms, not reproducible-build proof. |

Proposal for `org.vafer:jdependency:2.10`: `APPROVED-WITH-OBLIGATIONS` rights compatibility,
**Apache-2.0 wrapper AND Apache-2.0 Commons IO AND BSD-3-Clause shaded ASM 9.6**. The wrapper's
license is not a blanket grant for bundled ASM. Engineering must preserve embedded Commons IO
notices, supply the wrapper's applicable copyright/license and missing ASM terms with recipient
copies, and retain the upstream shading provenance. Source modification notices become relevant
if modified source files are supplied; none were supplied here. No corresponding-source/copyleft
condition was identified in these selected texts. Complete notice packaging remains `NOT-RUN`;
admission is still `NOT_ADMITTED` until the controlled intake acts.

### Raw legal/header identity hashes

All listed source bytes were read from exact tag/commit text endpoints into memory. Source SHA-256
values do not authenticate the binaries. Selected full legal texts and listed legal headers were
reviewed; source implementation bodies are not a complete correctness/license audit.

| Exact file | SHA-256 |
|---|---|
| ASM 9.7 LICENSE.txt; separately inspected ASM 9.6 LICENSE.txt | `293b6af371eee28b0ff16f0334ea19e20a3d5522143faa4b95b346855507879a` |
| ASM 9.7 build.gradle | `99a3cfc608cc4dbf7281f0ddce7580f98cdf0520f71c15a632829dd577737c2e` |
| ASM 9.7 ClassReader.java | `dd4801e41dc29b4668ff1696b27d0bfee4f6cd590b18d05f78355fe93e178226` |
| ASM 9.7 Remapper.java | `a475cdc04fb77128b366b94004a64475e8df7e1a94c1db08041c5768544ae586` |
| ASM 9.7 ClassNode.java | `b73520c92850d196cbe0c0b663d73668b5bf5a58ecc98297b619baaa0d9d0904` |
| jdependency 2.10 LICENSE.txt | `3fd8fb58cebed748a895cdd5c546f7b042730a0469ce7090f9ca0040a4b19b10` |
| jdependency 2.10 Clazz.java | `d65b41b5733961aa878fcb5c433419b8f1fdb0309e079ade3dd111eb79816339` |
| jdependency 2.10 source POM; embedded META-INF/maven/org.vafer/jdependency/pom.xml | `366ef38550cfb2744df274ef898a1f7cde316ad7902a6b823e7c5b511ad4bf33` |
| Commons IO 2.15.1 LICENSE.txt; jdependency embedded META-INF/LICENSE.txt | `8c6db340475136df3c1201d458fa5755698eace76e510471ecc9d857d6083dac` |
| Commons IO 2.15.1 NOTICE.txt; jdependency embedded META-INF/NOTICE.txt | `d881568c91b929923350fa3b9db693a0b1e6ae9de972087822e4e87802561c6a` |
| JSR305 3.0.2 cached META-INF/MANIFEST.MF, identity metadata only | `9329f6c6942e128348908339b59dbf209642c148dda83f1cf55fc8516a023092` |

### Exact cached pairs and remaining decision blocker

These pairs are copied without change from the continuity owner's
[effective-graph inventory](inventories/f05a-q02-effective-graphs.tsv). They bind this rights
research to candidates; no graph is reconstructed or altered here.

| Coordinate | Cached JAR SHA-256 | Cached POM SHA-256 |
|---|---|---|
| `org.ow2.asm:asm:9.7` | `adf46d5e34940bdf148ecdd26a9ee8eea94496a72034ff7141066b3eea5c4e9d` | `de00115f1d84f3a0b2ee3a4b6f6192d066f86d185d67b9d1522f2c80feac5f00` |
| `org.ow2.asm:asm-commons:9.7` | `389bc247958e049fc9a0408d398c92c6d370c18035120395d4cba1d9d9304b7a` | `5acee3ee7252ed90b8074c755d022787499a95fafff98ac4a685107c4da409b4` |
| `org.ow2.asm:asm-tree:9.7` | `62f4b3bc436045c1acb5c3ba2d8ec556ec3369093d7f5d06c747eb04b56d52b1` | `a34ea1e3e4128c01038db43c6976e88c779cf5af84b0505da266dfe6965668ec` |
| `org.vafer:jdependency:2.10` | `1dcd8355ab9ebced687715bf1252eb2aee5d0e74497a2014fd3387cfce8df85f` | `ab53f259ab5f6483d3dbb0235469e078d4a22cfd890771ab04f87db3a5b46067` |
| `com.google.code.findbugs:jsr305:3.0.2` | `766ad2a0783f2687962c8ad74ceecc38a28b9f72a2d085ee438b7813e928d0c7` | `19889dbdf1b254b2601a5ee645b8147a974644882297684c798afe5d63d78dfe` |

Q02-R22: JSR305 was revisited without changing Q02-R17. Its exact cached manifest says
Bundle-Version 3.0.2 and Bundle-License Apache 2.0, but supplies no grant text or release commit.
The targeted source-cache search is empty. The POM's Google Code project, historical RI BSD
license and current FindBugs repository do not establish a publisher-attested source mapping
for the exact cached publication. The attempted current repository path `pom/jsr305/pom.xml`
does not exist; it is not evidence of absent rights. Third-party redistribution notices and
modern repackagings were not accepted as upstream grants. GitHub unauthenticated API rate
limiting also occurred; successful raw text observations above remain valid.

The missing link is **publisher-attributable exact 3.0.2 source/legal content (or an explicit
grant covering this published binary), linked to the candidate's bytes**, sufficient to determine
which actual terms and notices apply. This is not a finding of proven copyleft, a custom
restriction or intrinsically unlicensable software. It is a genuine unresolved rights-evidence
question under the current no-download boundary, not just a missing JAR LICENSE file.
Disposition proposal remains `BLOCKED-LEGAL`, never metadata-only `APPROVED`.

Engineering cannot waive that gap. The continuity owner can ask for one precise instruction:
authorize a separately bounded inspection of publisher-published exact-version source/legal
material not available in the cache (if company policy permits), obtain an attributable explicit
rights clarification/Legal Review Authority decision covering these exact bytes, or separately
authorize a graph/version change and new intake. None of these actions is performed or assumed
here. A later source-material inspection might resolve the gap; if its provenance/grants still
conflict, the authority decision remains necessary. Existing scope exceptions do not apply by
analogy and no choice clears future commercial distribution.

Checkpoint: exact primary legal inspection is `PASS` for the three ASM modules and jdependency's
wrapper/bundled selected terms; JSR305 exact grant/source linkage is `BLOCKED`. Recipient notice
package completion, binary authentication, full shaded reproducibility, all-file header audit,
reviewer/Legal acceptance and controlled admission remain `NOT-RUN`. No Maven/Boot/build/test,
database/TLS/port/preview/verifier, install/download/archive materialization, remote host write, graph change,
commit/push/merge or timer action was taken. Only this informative note was amended to 0.3.
