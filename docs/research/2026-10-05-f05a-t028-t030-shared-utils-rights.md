# T028/T030 — Surefire Shared Utils shaded rights

| Control | Value |
|---|---|
| Stable ID / class / version / status | `IE-RES-F05A-T028-T030-SHARED-UTILS-RIGHTS-20261005` / rights research / `0.1 / Draft` |
| Product normativity / instruction state | `INFORMATIVE / NOT-APPLICABLE` |
| Owner / author | Engineering / Codex; accountable intake role Engineering |
| Reviewer / acceptance authority | Project Reviewer for process scope; Legal Review Authority for legal decisions; independent review of this record `NOT-RUN` |
| Date / timezone / applicability | 2026-10-05 / Asia/Ho_Chi_Minh / Issue #37, PR #38, internal offline T028/T030 only |
| Intended use | `REFERENCE-ONLY` official legal/source inspection supporting exact existing dependency intake; no new artifact acquisition |
| Classification / retention | INTERNAL / retain with exact-input and execution lineage |
| Upstream / downstream | [Graph gate](2026-10-05-f05a-t028-t030-graph-rights-gate.md), [embedded legal inventory](inventories/f05a-t028-t030-embedded-legal.tsv), [intake procedure](../agents/external-source-intake.md) / final selected-input admission |
| Change / supersession / trigger | New reconciliation, no historical finding rewritten; re-review on content/version/hash/source/terms/use change |
| Evidence / tailoring | Cached-byte observations and exact publisher grants; all-main-source header inspection; information/configuration control STANDARD-GUIDED, no standards/legal/commercial approval |

## 1. Exact material and grant mapping

The existing `org.apache.maven.surefire:surefire-shared-utils:3.5.6` JAR is SHA-256
`b21563bce49411d872bd48a402af06dfc07670464bfdaa2ef7918f216c42758a`.
Its combined `META-INF/NOTICE` is
`42ee4082970db25e7250697e3f746a580845a055bf6130a389d24ba1675e7a2a`.
The absence of a named LICENSE entry is not treated as a grant. The exact
[Surefire release LICENSE](https://raw.githubusercontent.com/apache/maven-surefire/surefire-3.5.6/LICENSE)
and [module relocation/resource-transformer configuration](https://raw.githubusercontent.com/apache/maven-surefire/surefire-3.5.6/surefire-shared-utils/pom.xml)
establish the containing module and explain consolidated legal packaging, without erasing obligations.

| Contained component | Observed class entries | Exact source grant | Embedded POM SHA-256 |
|---|---:|---|---|
| Maven Shared Utils 3.3.4 | 79 | ASF Apache-2.0 headers across all 64 main Java source files at commit below | `bf83482d96f76d63699d63e125e64f4ac73c8178985733662dbd69af9c60339e` |
| Commons IO 2.22.0 | 428 | [Exact release LICENSE](https://raw.githubusercontent.com/apache/commons-io/rel/commons-io-2.22.0/LICENSE.txt), Apache-2.0 | `6425cec0ea760035efa77277de85f89fa6dbed147ab3dd95b8d2cbc55340accf` |
| Commons Lang 3.20.0 | 421 | [Exact release LICENSE](https://raw.githubusercontent.com/apache/commons-lang/rel/commons-lang-3.20.0/LICENSE.txt), Apache-2.0 | `7ca83b2709c1e7a9e03b576cd41422190379489a80866e542f8c8b955411a2aa` |
| Commons Compress 1.28.0 | 589 | [Exact release LICENSE](https://raw.githubusercontent.com/apache/commons-compress/rel/commons-compress-1.28.0/LICENSE.txt), Apache-2.0 | `033f4c78d632da88d0eb8ead974fc14a264392cebf12ab6c68d6cea7adf0c64a` |
| Commons Codec 1.19.0 | 115 | [Exact release LICENSE](https://raw.githubusercontent.com/apache/commons-codec/rel/commons-codec-1.19.0/LICENSE.txt), Apache-2.0 | `e0f3269fa23de0c83130c5659f5f9514cc5422c0bcdf45f2eae004a78b9fca34` |

These are shaded contents of the containing JAR, not independently acquired dependencies.
Class entries include generated/nested classes; counts are not source-file counts.

## 2. Maven Shared Utils whole-source coverage

The official tag `maven-shared-utils-3.3.4` resolves to
`17091d82508deb9b7067f3434ba16f660ffc5023`.
Reference-only inspection listed the exact tree and read all 64 `src/main/java/**/*.java` files.
**64/64** carried the ASF licensing declaration and Apache License Version 2.0 reference.
No source archive or implementation was imported. This is not a conclusion based solely on a
FileUtils header. Publisher publication and exact-source identity are:

- [Exact tagged POM](https://raw.githubusercontent.com/apache/maven-shared-utils/maven-shared-utils-3.3.4/pom.xml).
- [Versioned publisher site](https://maven.apache.org/shared-archives/maven-shared-utils-3.3.4/).
- [Xpp3Dom](https://raw.githubusercontent.com/apache/maven-shared-utils/maven-shared-utils-3.3.4/src/main/java/org/apache/maven/shared/utils/xml/Xpp3Dom.java) and [XmlPullParserException](https://raw.githubusercontent.com/apache/maven-shared-utils/maven-shared-utils-3.3.4/src/main/java/org/apache/maven/shared/utils/xml/pull/XmlPullParserException.java), explicitly checked.

The Xpp3Dom source describes a reimplementation under its ASF grant; namespace similarity alone
does not import a different project's supplemental terms. This licensing/provenance observation
does not reproduce the publisher's shaded build or independently authenticate cached binaries.

## 3. Metadata and forbidden-provider distinctions

`META-INF/DEPENDENCIES` SHA-256 is
`9d94207e84d6a9f2cc4e56da93e63b94dd7034207b79318e9590a4e721c8cb2e`.
Its inherited descriptions of IO 2.6/Jansi 2.2.0 do not override actual embedded versions or
introduce extra acquisitions. The old Shared Utils POM's `provided` JSR305 declaration is not
a selected provider, applicable grant or permission to acquire JSR305.

The read-only material audit rehashed 139 paths and reports `JSR305_DIRECT_PROVIDER=ABSENT`.
That scan rejects direct Nullable/Nonnull/meta classes, but does not claim an exhaustive arbitrary
renamed/shaded-provider analysis. Actual graph/provider execution guards remain required.
Historical JSR305 `BLOCKED-LEGAL` stays unchanged.

## 4. Bounded disposition, actions and limits

Engineering disposition for this exact shaded material is `APPROVED-WITH-OBLIGATIONS` for the
authorized unchanged internal dependency use, subject to the final overall input/process gate.
No hard missing-grant finding was found in the five contained components.

Engineering preserves cached artifact/legal bytes and combined NOTICE, applicable Apache grant
and copyright/attribution provenance; does not strip notices; and retains patent/trademark,
warranty/disclaimer and acknowledgement conditions. Future modification/distribution requires
reopened intake, license delivery, applicable NOTICE retention and changed-file marking. This
record does not choose reciprocal-license branches for other inputs, approve commercial use or
complete T036. Any changed shaded material/hash/terms or unsatisfied obligation is STOP.

No Maven goal, product test, database, listener, install/download, verifier, timer or merge ran in
this research. Overall gate is not certified here. Document validator `NOT-RUN`; cited source
URLs were inspected. Optional NOTICE requests that did not return are not evidence; the retained
cached combined NOTICE is the actual notice evidence.
