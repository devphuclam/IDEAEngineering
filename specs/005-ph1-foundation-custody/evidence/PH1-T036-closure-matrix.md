# T036 actual-use, notice and rights disposition matrix

| Control | Value |
|---|---|
| Stable ID / class / version | IE-VEV-PH1-T036-CLOSURE / review packet / 0.3 |
| Status / result | T036 COMPLETED / PASS WITH NOTES for bounded PH1 current use; exhaustive native coverage remains UNKNOWN |
| Owner / author / reviewer | Engineering / Codex CODEX_ONLY / Project Reviewer Nguyễn Huỳnh Phúc Lâm; Legal Review Authority separate |
| Baseline / evidence date | PR38 reviewed head 8af0a6a05d19106960c9f2674aa1fd9e49231dde; 2026-10-06 Asia/Ho_Chi_Minh |
| Scope / normativity | INFORMATIVE; retained-artifact and reference-only rights review; no new runtime, build, import, deployment or use authorization |
| Classification / retention | INTERNAL; retain historical source, grants, exceptions, failures and access limitations |
| Upstream / downstream | [License review](PH1-license-review.md), FR-012 / [T036](../tasks.md), human closure disposition |
| Change / trigger / tailoring | Successor reconciliation after R36-04 acceptance; graph/version/packaging/use drift reopens affected row; STANDARD-GUIDED under IE-STD-AUTH-001 |

## 1. Review result and completion oracle

**Current reading rule, v0.3:** section 7 records the human-directed bounded current-use
closure after disclosure of the native coverage limit. NOT-CLOSED/IN_PROGRESS in sections
1–6 is historical, not the current task state. No historical UNKNOWN changes to complete PASS.

**Current reading rule, v0.2:** sections 1–5 below preserve the predecessor review before
the 2026-10-06 comply-and-use decision and supplemental repair. Their OPEN/classification-only
Legal Review wording is historical, not the current gate. Section 6 is the current disposition.

R36-04 is accepted at engineering level by the Project Reviewer in the conversation, against
8af0a6a… on 2026-10-06. It is not reopened. The review confirmed genuine RED, real/repeat Web
builds, three exact notice files/links and 261 unchanged non-static entries. No GitHub review
event is inferred from conversation acceptance.

This packet completes a reproducible inventory and classifies the remaining actions. It does
not claim that classifying an obligation satisfies it. Whole T036 needs the required notice
retention and native transitive evidence, plus an accountable disposition for the intended use.
Future commercial distribution is separate; known build-only terms do not automatically block
the accepted historical engineering results or establish a future runtime license prohibition.

| Frontier | Requirement → observed evidence | Current disposition / owner / next action |
|---|---|---|
| R36-01 | 89 nested JAR observations, exact hashes, legal entry names/hashes; 191 Server/tool input-role rows; all 88 Web lock entries classified on both exercised platforms | Actual mapping performed. Notice completeness OPEN for the named package gaps in §3. Engineering packaging supplies exact admitted notices before claiming a complete delivery bundle |
| R36-02 | Six native package archives/binaries compared with lock integrity; publisher source/build/notice correspondence | Source/package identity substantially established; complete Rolldown compiled Rust notice coverage OPEN. Other native transitive completeness is not inferred from binary identity. See [native correspondence](../../../docs/research/2026-10-06-t036-native-correspondence.md). Engineering must produce the platform/feature-selected dependency-to-terms map for the intended native delivery scope, or obtain publisher evidence; do not infer every Cargo.lock entry is shipped |
| R36-03 | §4 separates actually packaged mixed terms, build/test-only terms and truly excluded missing-right material | Historical bounded uses remain authorized as recorded, not legal approval. Prospective custom/reciprocal scope still requires Legal Review. No new process exception or branch of a dual license is elected here |
| R36-04 | Accepted exact real Web/repeat/projection qualification | CLOSED at engineering level; only packaging/graph drift reopens it |
| Whole T036 / PH1 | Accepted F01–F05 and T035 remain unchanged | IN_PROGRESS / not accepted. This review does not close Issue37, merge PR38, alter timer or declare production/commercial readiness |

## 2. Exact actual-use projection

[Nested package map](../../../docs/research/inventories/ph1-packaged-notice-map-20261006.tsv)
records all 32 Gateway and 57 retained Server projection runtime JARs. Both package SHA-256s
were independently rechecked before in-memory ZIP inspection:

- Gateway product source 0aefb56f4f87b337ce4cc614f51b5f96ac2e86c9;
  c26b870e22a6ffb6ed9acbcbcd1dd20208004226c4d09a399e227983023a14e1.
- Server R36-04 projection dde3f36b1ad015d46c46585b78d77b660f7a62037e7ca7215574ec7186bcc151;
  unchanged non-static contents of accepted development JAR 7f0a628d…53c. It is not a newly
  packaged final-F05 Server or a deployed notice repair.

Gateway was copied read-only from its retained owned server target to ignored local
`.tmp/t036-mapping-20261006-01/gateway.jar`; the Server projection was already retained.
No JAR was executed or modified. Nested ZIPs were opened in memory through PowerShell/.NET.
Legal-entry matching includes suffix forms such as `asm.license` and bundled JavaScript
`*.LICENSE.txt`; `.class` files are excluded from the legal-text column. A filename/hash
presence check proves retention, not substantive completeness of every embedded component.

[Input-role dispositions](../../../docs/research/inventories/ph1-actual-use-dispositions-20261006.tsv)
cover the retained 96 Server JAR rows and 95 Maven/core/provider rows. Zero tool rows match a
payload JAR in either inspected package. ArchUnit 1.4.2 really is packaged in Server; it is not
excluded merely because it is commonly a test library. Server also has the Boot-injected
`spring-boot-jarmode-tools:4.1.1` (062a9edf…97f), with matching Apache LICENSE/NOTICE. This
historical payload is absent from the qualified Gateway, whose repackage configuration excludes it.
The 264 model-POM rows remain model inputs, not 264 application JARs.

The final F05 actual Server execution at e542b461… used compiled classes and the qualified
Surefire/HTTP seam, not this historical executable Server package. Its retained runner directly
invokes offline resources/testResources/compile/testCompile/test goals; it does not repackage.
Thus compile/runtime versus test/provider roles remain visible, and no final-F05 package claim
is reconstructed from a predecessor JAR. The exact resolved graph remains the retained
[input inventory](../../../docs/research/inventories/f05a-t028-t030-resolved-inputs.tsv).

[Web platform projection](../../../docs/research/inventories/ph1-web-platform-projection-20261006.tsv)
contains all 88 non-root lock entries: 44 installed with locked versions on Windows x64;
44 installed with matching versions in the retained Ubuntu x64/glibc Web cache, with three
native substitutions (TypeScript, Rolldown GNU, LightningCSS GNU). There are zero observed
version mismatches. The other 44 entries on each surface are absent optional platform/libc
packages, not rights-approved imports. Linux versions were read from retained package.json
files; the initial shell quoting failures produced no version evidence and no cache changes.
React/ReactDOM/scheduler are Web-bundled runtime. Other installed entries are available
build/test inputs, not proof every installed tool executes in each build, nor shipped node_modules.

Desktop/Workspace remains the F01 scaffold and locked 14-package build/test audit. WebView2
SDK is the one Desktop dependency; other NuGet packages are test/build scoped. No new Desktop
delivery bundle or Evergreen runtime/installer has been created or qualified by F03/F05.
Retain the [exact NuGet audit](../../../docs/research/2026-09-28-ph1-f01-nuget-transitive-audit.md),
including its signed-content/archive distinction and historical byte-identity limits.

## 3. Notice delivery gaps discovered by actual mapping

| Exact packaged material | Observed retention | Action / qualification boundary |
|---|---|---|
| SnakeYAML 2.6 and JSpecify 1.0.1, both packages | No matching embedded legal text; Gateway has no outer license/notice entries. Exact upstream grants and copyright material already retained in the rights research | Engineering must accompany delivered copies with their exact applicable license/copyright material. An upstream URL/intake record is not itself delivery of that material. Grant evidence is established, not BLOCKED for lack of an Apache grant |
| HikariCP 7.0.2; flyway-database-postgresql 12.4.0; jmolecules-events/jstereotype 2.0.1 in retained Server | No matching embedded legal text. Flyway core carries a LICENSE, but module-specific coverage must be explicit | Map exact publisher texts to each copy and retain them in delivery packaging; do not assume another dependency's generic Apache text proves full module notice coverage |
| ArchUnit 1.4.2 in Server | Contains shaded ASM `asm.license` hash ae8d5e9f…f197, but no main Apache/Guava legal file matched | Preserve the ASM material; add or demonstrate delivery of ArchUnit/contained Guava applicable texts. Existing intake already identified runtime reach and these bundled obligations |
| Swagger UI 5.32.14 | Four nested JS license bundles, plus outer Swagger LICENSE and NOTICE; all exact entry hashes in map | Retained legal material observed; use the already substantive dev-intake disposition, not a zero-dependency/Apache-only conclusion |
| pgJDBC 42.7.13 | Main BSD text plus four OnGres SCRAM/Stringprep license entries | Retention observed for all five grants; no flattening into Apache-2.0 |
| React/ReactDOM/scheduler | Three exact texts/links in Server static projection | Accepted R36-04; no repeat execution requested |

The missing delivery copies above are an R36-01 finding, not a request to reopen R36-04 or
change Java/dependencies. Smallest repair proposal: a deterministic supplemental notice bundle
using the exact already-intaken material, projected into the affected retained packaging seam,
with a focused retention oracle and unchanged non-notice payload. No such repair/build/import
was executed here. Any required third-party text retention and new packaging execution must
remain inside explicit intake/tooling authority. No preview upgrade follows from this proposal.

## 4. Special-term disposition by actual intended use

| Material / exact scope | Current accountable disposition | Concrete obligation / further authority |
|---|---|---|
| Jakarta Annotation 3.0.0 and Tomcat core 11.0.24; actual Server/Gateway payload | Known mixed/alternative terms; historical internal qualification under recorded bounded process exceptions. Historical BLOCKED-LEGAL entries preserved | Engineering retains exact EPL/GPL+Classpath/CDDL/Apache material and source identity. Legal Review must disposition any prospective production/distribution scope. Existing process exceptions do not elect a legal branch or grant commercial approval |
| Plexus Utils 3.5.1/3.6.0/3.6.1/4.0.2/4.0.3, XML 3.0.1; ExtremeLab/Javolution/ThoughtWorks | Build/core/acquisition only, absent application payload; known terms, bounded historical use; not generally admitted tooling | Keep all supplemental notices, acknowledgements, no-endorsement and source-handling requirements. Engineering owns retention; Legal Review owns broader/custom-term admission before future execution |
| Interpolation 1.29 altered Apache-1.1/headerless coverage | Build/core only; unresolved coverage/custom wording remains BLOCKED-LEGAL for prospective reuse | Legal Review/publisher clarification of exact coverage; preserve original record rather than replacing it with Apache-2.0 metadata |
| Sisu 0.9.0.M4/1.0.0; Maven javax.annotation-api 1.3.2; JUnit provider/test versions | Build/core/test only; recorded reciprocal/alternative terms and historical process scope | Keep distribution/license/NOTICE and corresponding-source identity; no runtime payload introduced by these rows. Prospective scope must respect intake gates |
| JDOM 2.0.6.1, Boot-plugin graph | Build-only custom four-condition BSD-style, not in either application package | Keep attribution, acknowledgement and no-endorsement obligations; Legal Review still owns prospective custom-term admission |
| Historical JSR305 3.0.2 | Missing-right finding preserved; EXCLUDED from the qualified JSR305-free graph and both inspected application packages | No synthetic rights approval. Normal Server Boot packaging remains a separately gated path, not authorized by exclusion in Gateway |
| TypeScript 7.0.2 supplemental Go/W3C/WHATWG/Unicode notices; LightningCSS 1.33.0 MPL; Rolldown 1.2.11 | Build-only; exact source/notice evidence and native cache correspondence established to the limits of the native note | Engineering retains complete supplied texts and native third-party correspondence. Native tool redistribution/source-availability or custom-term expansion needs separate Legal Review; build-tool code is not automatically Web runtime payload |
| Node 24.19.0 Windows binary | Project APPROVED-WITH-OBLIGATIONS under explicit human admission; not a sprint exception | Retain full Node/bundled notices, ICU/Unicode/NAIST–ICOT acknowledgements and disclaimers when applicable; changed version/graph/distribution reopens intake |
| WebView2 SDK 1.0.4191.47 / scaffold | Exact BSD-style SDK text and notices retained; historical internal F01 scope only | Future loader/SDK redistribution and Evergreen runtime/installer terms remain separate. A general LGPL notice does not prove an LGPL library is in the delivered scaffold |

The full [Q02 rights map](../../../docs/research/inventories/f05a-q02-rights-dispositions.tsv)
and Maven core record remain the exact coordinate/hash evidence for Gateway packaging tools,
including the versions outside the 191-row Server/tool projection. Candidate acquisition,
actual plugin realm and runtime payload are not interchangeable. This grouped disposition
does not rewrite those historical rows as a new company Legal Review approval.

## 5. Checks and next decision

PASS: retained package hashes, all 89 nested-JAR identities mapped (88 match existing Server
rights SHA entries; the additional historical Boot jarmode payload is explicitly identified),
zero mapped build-tool payload matches, 88 Web platform rows, zero installed version mismatch.
No full feature suite, Maven, npm install, database action, verifier, deployment or merge ran.
Raw private execution logs remain inaccessible to the external reviewer; hash identity is not
an independent content review. Native package identity is not a reproducible-build attestation.

Next human review should disposition this whole matrix and the bounded R36-01 packaging repair,
while Engineering continues the actual selected Rolldown Rust notice map. If Legal Review scope
must extend beyond the historical internal exceptions, name that scope explicitly rather than
silently expanding it. Keep T036 unchecked and PR38 Draft/Open until required actions or an
explicit bounded acceptance disposition are recorded. No new feature work is needed.

## 6. Final current-use disposition after comply-and-use decision

Authority is the user's explicit 2026-10-06 T036 decision, not a new process exception or
counsel opinion. Known commercially usable grants are APPROVED-WITH-OBLIGATIONS. Supplemental,
reciprocal, patent, source-availability or acknowledgement duties are not automatic legal blocks.
Exact source/version/hash/use records remain unchanged in the historical inventories.

| Frontier | Current result | Performed evidence / remaining boundary |
|---|---|---|
| R36-01 | CLOSED at engineering level for inspected PH1 artifacts | 89 nested JAR / 191 input-role / 88 Web platform mapping retained. Missing applicable runtime texts now accompany Server/Gateway copied artifacts; positive, repeat and wrong-notice oracles executed. 269 Server / 186 Gateway original entries preserve exact uncompressed bytes; only 10 / 4 legal entries added. Not a fresh final-F05 build or preview deployment |
| R36-02 | PARTIAL; compiled external Rust coverage UNKNOWN | Six native archive/binary/source bridges retained; identified Rolldown MIT, LightningCSS MPL and TypeScript Apache/supplemental rights are APPROVED-WITH-OBLIGATIONS. Full target/feature-selected external-crate grant coverage is not established. No identified prohibition or blanket BLOCKED-LEGAL follows; neither parent MIT/MPL nor missing SBOM proves all external grants |
| R36-03 | CLOSED for identified current-use components | [Current rights analysis](../../../docs/research/2026-10-06-t036-current-use-rights.md) and [191-row successor map](../../../docs/research/inventories/ph1-current-use-dispositions-20261006.tsv) record APPROVED-WITH-OBLIGATIONS and retained exact terms. Jakarta uses EPL-2.0 with source location; Tomcat covered schema source locations retained. Plexus, Sisu, Interpolation, JDOM and Maven annotation tooling remain build/core-only, absent inspected application payload. Historical JSR305 missing grant remains excluded, not approved |
| R36-04 | CLOSED, unchanged | Existing human-accepted React/ReactDOM/scheduler qualification is not reopened |
| Whole T036 | NOT-CLOSED; IN_PROGRESS | Only remaining engineering frontier is R36-02 external native coverage. No known-term classification-only legal gate remains. Do not mark whole-task PASS from package-level root grants |

[Performed notice receipt](../../../docs/research/2026-10-06-t036-comply-and-use.md#performed-successor-execution)
records publication/execution lineage, preserved failed projection, exact hashes and limits.
[Native current-use note](../../../docs/research/2026-10-06-t036-native-current-use.md)
distinguishes established rights from coverage UNKNOWN; [delivery-scope research](../../../docs/research/2026-10-06-t036-native-delivery-scope.md)
identifies exact build roots/features, not a purported compiled SBOM.

The smallest remaining resolution is exact publisher component/legal evidence for the selected
Windows/Linux native binaries, or a conservative exact-lock grant inventory labelled as a
superset (not a compiled SBOM), with target/feature correspondence where available. Examples
whose selected-subset correspondence is not yet exhaustive include cssparser 0.37.0,
parcel_sourcemap 2.1.1, rayon 1.10.0 and napi 2.16.13. This is not evidence those licenses are
unusable; it is an incomplete component-to-grant proof. No replacement stack or license purchase
is justified by current evidence. A human acceptance of the disclosed package-level coverage
limit would be separate and must not be restated as exhaustive component review.

PR38 stays Draft/Open; T036 remains unchecked, PH1 not closed. No new feature, verifier,
deployment, merge, database action or timer change. Private raw-log access limitation remains;
retained hashes are not independent log-content review. This is current-use assessment, not
all future commercial distribution readiness.

## 7. Bounded closure publication

The user instructed achieving/closing T036 after the explicit proposal to accept current
exact package/source grants and notices with incomplete independent native coverage retained.
[Final closure receipt](../../../docs/research/2026-10-06-t036-bounded-closure.md)
records that scope, requirement-to-disposition mapping, actual component-study counts,
tool-selection deviation, residual owner/due conditions and reopening triggers.

R36-01/03/04 are satisfied. R36-02 is satisfied for the bounded package-level current-use
assessment WITH RESIDUAL NOTE; complete compiled external Rust rights coverage remains UNKNOWN,
not a universal MIT/MPL grant or exhaustive SBOM claim. Known terms remain
APPROVED-WITH-OBLIGATIONS; actual missing/incompatible rights would reopen intake.
T036 = COMPLETED / PASS WITH NOTES. Independent successor packet review, PH1 gate acceptance,
Issue37 closure and merge remain separate. PR38 Draft/Open; verifier NOT-RUN; preview unchanged.
