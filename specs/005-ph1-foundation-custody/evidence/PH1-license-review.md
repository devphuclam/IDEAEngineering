# PH1 dependency, rights and clean-room review

| Control | Value |
|---|---|
| Stable ID / class / version | IE-VEV-PH1-LICENSE-REVIEW / intake reconciliation review / 0.5 |
| Status / disposition | Draft / T036 IN_PROGRESS; substantive local review performed, remaining provenance/notice and authority gaps explicit; not legal or commercial clearance |
| Owner / author / reviewer | Engineering / Codex CODEX_ONLY / Project Reviewer Nguyễn Huỳnh Phúc Lâm; Legal Review remains separate |
| Baseline / date | PR38 at 874088695d0b65e6d71b40078d6f55e623087b0a; 2026-10-06 Asia/Ho_Chi_Minh |
| Authority / normativity | Authorized T036 evidence review only; INFORMATIVE; no new execution/import/license right |
| Classification / retention | INTERNAL; preserve historical rights decisions, exceptions, failures and exact inventories |
| Upstream / downstream | [External intake](../../../docs/agents/external-source-intake.md), FR-012 / [tasks](../tasks.md), separate integration/Legal Review |
| Change / supersession / trigger | v0.5 records R36-04 human acceptance and actual package/native/special-term closure matrix; v0.4 and historical findings preserved; version/hash/graph/use or distribution change reopens applicable intake |
| Tailoring | STANDARD-GUIDED under IE-STD-AUTH-001; inspection of retained source/evidence, not an independent legal opinion, signature audit or third-party reproducible build |

## 1. Actual review and exact inventory identity

**Current reading rule, v0.5:** R36-04 was accepted at engineering level by the Project Reviewer
against head 8af0a6a05d19106960c9f2674aa1fd9e49231dde on 2026-10-06. The older OPEN/access/
pending paragraphs below retain their historical observation states. For the current R36-01–03
frontier and exact remaining action, read the [whole T036 matrix](PH1-T036-closure-matrix.md)
and [native correspondence](../../../docs/research/2026-10-06-t036-native-correspondence.md).
No historical finding has been rewritten as PASS; no T036/PH1 acceptance is inferred.

No restore, install, download, Maven execution, application test, database change or verifier was
performed for this review. Historical execution authority is not extended to a new build.

| Current evidence | Observed identity and reconciliation |
|---|---|
| [Resolved Server inputs](../../../docs/research/inventories/f05a-t028-t030-resolved-inputs.tsv) | SHA-256 036afc60a252566bcdf72c4026d160bd31c27c477645c2f626aa61588f6039ca; 456 role rows, including 264 model POMs and 96 compile/runtime/test JAR rows; role overlap means these are not 456 unique runtime artifacts |
| [Server rights](../../../docs/research/inventories/f05a-t028-t030-server-rights.tsv) | 96 rows: 36 APPROVED-WITH-OBLIGATIONS, 58 APPROVED-WITH-OBLIGATIONS_INTERNAL_ONLY, 2 historical BLOCKED-LEGAL; Jakarta Annotation and Tomcat bundled mixed terms remain explicit |
| [Tool rights](../../../docs/research/inventories/f05a-t028-t030-tool-rights.tsv) | 95 rows: 79 APPROVED-WITH-OBLIGATIONS, 10 BLOCKED-LEGAL, 6 KNOWN_TERMS_PROCESS_REVIEW; coordinates/paths may repeat between tool realms |
| Cross-reference | Every resolved JAR row maps by SHA-256 to retained Server/tool rights: zero unmapped resolved JAR rows. Mapping proves trace, not legal approval or exhaustive POM rights closure |
| Qualified Gateway package runtime | f05a-q02-root05-package-runtime.tsv SHA-256 26e58cde5024665d3f7481b7f7e2569c78f6e6e910b43a74450603e4585f787f; retain collection graph versus actual package distinctions |
| Windows Node 24.19.0 | Executable SHA-256 3602f2bb1a10f2cbab4c36886218a33c1ab3db87290e73b033c46c77147d0237; project-wide APPROVED-WITH-OBLIGATIONS, not just T033/T034 |
| Retained Node LICENSE | [Full notice text](../../../docs/third-party/node-24.19.0/LICENSE.txt), SHA-256 148eacf7863ef4329224a29398623077200a27194aa075569faf4a0a85566ca5; 44 inventory sections; MIT is not a substitute for all bundled terms |
| Web lock | apps/web/package-lock.json SHA-256 350e5d24057c55d6acef6fba71b73948e2711d9279c12e2fe52071b815f611b; 88 non-root entries with metadata labels: 51 MIT, 23 Apache-2.0, 12 MPL-2.0, 1 ISC, 1 BSD-3-Clause. Labels alone are not exact legal-text evidence |
| Read-only Windows Web cache inspection | [Exact file inventory](../../../docs/research/inventories/ph1-web-local-legal-files-20261006.tsv): primary checkout apps/web/node_modules, 44 installed packages, zero version mismatch against this lock; 43 packages have top-level LICENSE/LICENCE/NOTICE files hashed; native @rolldown/binding-win32-x64-msvc has no such top-level file. The other 44 lock entries are absent here; absence is not a blanket exclusion from all historical Ubuntu executions |

## 2. Rights, use and provenance disposition

| Group / retained record | Known evidence / obligations | Current disposition and limit |
|---|---|---|
| F01 direct Web and initial NuGet | [Direct intake](../../../docs/research/2026-09-28-ph1-f01-dependency-intake.md), [NuGet audit](../../../docs/research/2026-09-28-ph1-f01-nuget-transitive-audit.md) | Exact direct Web legal files and 14 NuGet packages were inspected; accepted late-evidence exceptions do not make before-first-use compliance retrospectively true |
| NuGet/Desktop foundation | Exact nupkg/nuspec hashes and publisher license traces; retain WebView2 SDK third-party notices | No changed Desktop/Workspace definitions or Web lock since F01-B clean source. Installer/Evergreen runtime and future distribution remain separate; unidentified notice material is not evidence that an LGPL library is actually shipped |
| Web transitive graph | [T043 intake](../../../docs/research/2026-10-01-t043-web-dependency-intake.md), lock and successor local file inventory | v0.2 substantive local text review covers the 43 packages with legal files, including full Vite/Vitest bundled notices and TypeScript NOTICE. Exact Rolldown native source grant established separately; native binary/transitive correspondence and shipped-notice mapping remain OPEN. See §5–7, not a blanket MIT conclusion |
| F02/F03/Server graph | Exact pgJDBC, Flyway, Security and current 96-JAR inventory; Log4j2/no-Logback retained | Known rights and use records retained. BSD/SCRAM/stringprep, notices and Jakarta/Tomcat mixed material are not flattened into Apache-2.0 |
| android-json exact publication | [Rights gate](../../../docs/research/2026-10-05-f05a-t028-t030-graph-rights-gate.md) §5.3: official Vaadin Git blob cfc785eb62a5628097185ddf69e67f4e7b5c1ea3; six source headers inspected reference-only in RAM | Exact attributable Apache-2.0 evidence closes the former grant gap; does not claim a reproducible source-to-JAR build |
| JSR305 historical plugin path | Historical missing attributable exact grant BLOCKED-LEGAL; root05 exclusion qualification retained | Old graph rights finding remains. Qualified JSR305-free Gateway experiment does not create rights for the excluded JSR305 artifact or authorize arbitrary later Server packaging |
| Maven/Plexus/Sisu/JDOM/core tooling | Exact cached hashes/realms and known ExtremeLab/Javolution/ThoughtWorks, interpolation custom/legacy, EPL/CDDL/GPL+Classpath and JDOM terms | Existing bounded process exceptions permit only their specified internal work. They are not legal approval; no general future-use authority follows from F05 execution. Unclear coverage/custom terms need their recorded review owner |
| T029–T034 successor exception | [Exact scope](../../../docs/research/2026-10-05-t029-t034-process-exception.md) | Preserve known terms and obligations. Scope expires at sprint completion or drift; does not authorize a new T036 build or F06/general development |
| Node and bundled components | [Project admission](../../../docs/research/2026-10-05-node24190-project-admission.md), full LICENSE and inventory | Normal approved project use; retain ICU/Unicode/NAIST–ICOT notices, attribution/disclaimers, redistribution obligations and future SBOM. Does not admit another Node version or npm package |
| Swagger UI 5.32.14 | [Dev intake](../../../docs/research/2026-10-01-backend-dev-swagger-intake.md), unmodified WebJar legal text and accepted Issue26 seam | Internal development use only as recorded; zero Maven children does not mean zero bundled JavaScript licenses. Reference-only springdoc/other candidates are not actual dependencies |
| First-party/clean-room provenance | Repository source and [clean-room register](../../../docs/governance/clean-room-transfer-register.md); independent PH1 implementation with separately inventoried third-party imports | No competitor code import identified by this review; this is source/record inspection, not a forensic originality guarantee. Third-party wrapper/legal text retains its provenance; notices do not become first-party authorship |

## 3. What remains to close T036

| Gap / owner | Smallest resolution and completion oracle |
|---|---|
| Exact Web graph rights — Engineering intake | Complete substantive review of the hashed cached files and bundled notices; establish native Rolldown coverage and correlate archive integrity/provenance where available. Classify all 88 entries as actually used, excluded on each exercised platform, or unresolved; unused platform packages need no invented use admission. Record missing grants rather than infer them from metadata. This review authorizes no new external archive, registry access or installation |
| Actual integration bundle/notice scope — Engineering packaging | Map packaged Web/Server/Gateway material and provided runtime/build tooling to retained notices; distinguish build-only, shipped and candidate-only components. Existing evidence can be reused; a new build requires applicable tooling authority |
| Known custom/unclear terms beyond bounded execution — Project Reviewer / Legal Review | Resolve exact intended integration/use scope for open dispositions, or explicitly retain blocked future use. Process exceptions do not fill an absent grant or become company legal approval |
| Historical timing and authenticity limits — Engineering / Reviewer | Keep late-intake exceptions, exact-source/source-to-binary limitations and unverified signatures attributable. Acceptance of technical results does not erase these records |

T036 remains unchecked / IN_PROGRESS until exact integration evidence and required dispositions
are complete. Commercial redistribution clearance remains separately NOT-RUN; internal build/test
exceptions do not imply production, redistribution or commercial approval. Conversely, approved
normal Node use is not BLOCKED-LEGAL merely because bundled notices exist.

F05 technical acceptance remains valid in its bounded scope. PH1 closure, PR merge, Work Item
closure and Tracker actual-effort publication are not performed by this document.

## 4. Publication checks

Successor inventory records only package identity, legal filenames, hashes and observation state;
no package code, binary or legal text was imported. Primary checkout was read-only and unchanged.
The v0.1 publication only hashed local files. The v0.2 successor completed reading the local
legal texts, including TypeScript NOTICE and Vite/Vitest bundled notices; this does not prove
that those files enumerate every compiled native dependency or that shipped notices are complete.
Local file-link and Git whitespace checks pass; application tests/verifier remain NOT-RUN in
this review. Current Server/Gateway engineering evidence is reused without a new execution.
Successor verification: 147 relative file links across the review/research/task/handoff records
resolve; all 46 legal-file SHA-256 rows (45 original plus Rolldown THIRD-PARTY-LICENSE) match
the read-only primary cache. These checks do not test application behavior or package delivery.

## 5. Substantive Web terms and obligation ownership — v0.2 successor

Method: read all unique legal texts represented by the 45 original local legal-file rows,
plus Rolldown THIRD-PARTY-LICENSE. Identical hashes permit shared review of identical text,
not shared assumptions about different binaries. No legal text/package was imported or executed.
The source of each local observation is the exact-version cache and hashed filename in the inventory.

| Exact material / observation | Terms actually observed / concrete compliance action | Owner / disposition limit |
|---|---|---|
| React 19.3.0, ReactDOM 19.3.0, scheduler 0.28.0; other cached MIT texts | Retain each applicable copyright, permission notice and warranty/liability disclaimer with copies/substantial portions. React runtime imports are present in the controlled Web source | Engineering packaging; established local terms, shipped-notice presence remains to be inspected |
| source-map-js 1.2.1 BSD-3-Clause; picocolors 1.1.1 ISC | Retain copyright/conditions/disclaimers; BSD binary redistribution needs accompanying notices and forbids implied endorsement | Engineering packaging; build/test dependency, not automatically a shipped application component |
| expect-type 1.4.0, detect-libc 2.1.2 Apache-2.0 | Full terms inspected: retain license and applicable notices, mark modifications, respect patent-termination/trademark clauses | Engineering intake/packaging; actual lock identity remains authoritative; no distribution approval inferred |
| lightningcss 1.33.0 and cached Windows x64 native legal text, MPL-2.0 | File-level source/notice and executable-form source-availability duties where distributed; larger-work terms do not erase covered-source duties. Identify modifications and source delivery before redistribution | Engineering packaging and Legal Review for the recorded reciprocal-term process gate; internal tool is not automatically copied into Web output |
| Vite 8.3.1 LICENSE.md, full 2322 lines | Core MIT plus bundled MIT, Apache-2.0, BSD-2-Clause, ISC and CC0-labelled material. Preserve the complete publisher bundle, Apache notices and BSD/ISC attribution/disclaimers. Some bundled entries only identify upstream terms; do not call this an independently verified full transitive grant set | Engineering intake; read complete publisher text, exact bundled-source completeness still limited |
| Vitest 5.0.2 LICENSE.md, full 965 lines | Core MIT plus bundled MIT/BSD-3-Clause/ISC notices, including Sinon material. Retain the bundle and no-endorsement/disclaimer requirements. Metadata-only entries are not upgraded to independently inspected upstream grants | Engineering intake; test-only, not automatically shipped |
| TypeScript 7.0.2 and Windows native LICENSE/NOTICE.txt | Apache-2.0 is not the whole bundle: MIT/Unicode/W3C software notices, WHATWG CC-BY-4.0, W3C Community Final Specification Agreement and native Go dependency notices. Retain complete NOTICE; track attribution, license/specification links, modification markings, disclaimers and applicable patent commitments | Engineering intake; supplemental/custom-term applicability needs accountable review, not an invented non-commercial restriction |
| Rolldown 1.2.11 LICENSE and THIRD-PARTY-LICENSE | MIT grant plus Rollup/Evan Wallace MIT notices; preserve both. THIRD-PARTY-LICENSE SHA-256 a877291d800ed43692f3f9ae09d8e01cc6f7293ad39d43896059c188ffbb8b7c | Engineering intake; earlier inventory filename filter missed this file, now explicitly added |

TypeScript NOTICE identifies Go patent material without reproducing it. Reference-only inspection
of the exact official tags now supplies the text for
[x/sync v0.21.0](https://raw.githubusercontent.com/golang/sync/v0.21.0/PATENTS),
[x/sys v0.46.0](https://raw.githubusercontent.com/golang/sys/v0.46.0/PATENTS),
[x/term v0.44.0](https://go.googlesource.com/term/+/refs/tags/v0.44.0/PATENTS) and
[x/text v0.38.0](https://raw.githubusercontent.com/golang/text/v0.38.0/PATENTS), accessed
2026-10-06. Google grants an additional bounded patent license with litigation termination;
the grant excludes claims arising only from further modification. This closes the missing-text
question for these four identified terms, not binary-source attribution, a patent clearance opinion
or a company legal decision. Initial Google Gitiles reads failed for three tags; official GitHub
mirrors subsequently provided exact-tag text. No archive or dependency was acquired.

[Exact Rolldown research](../../../docs/research/2026-10-06-t036-rolldown-rights.md) establishes
upstream MIT text at v1.2.11 and source/build/package correspondence to both Windows MSVC and
Linux GNU binding names. Thus the native source grant is no longer inferred only from metadata.
Installed Windows native binary SHA-256:
cc49bb8c6463e2c85ed1287bf949bf6cfd08d6e0b80be53d2a12eb4500c1bf8c;
manifest SHA-256 6c98310bbd4c636e8d3f8fcf18a56e7f9dbf7ce6981bc3292d501adaad631a6e.
No publisher digest/attestation comparison or complete Rust-native notice closure was performed.
Absence of a license file inside that native package is a packaging question, not proof that
upstream has no grant. These limits remain distinct.

## 6. Actual use and package projection

| Surface | Observed projection / excluded material / remaining check |
|---|---|
| Windows Web cache | All 88 lock entries accounted for: 44 installed with matching version, 44 absent optional platform packages. All absent entries have OS/CPU selectors incompatible with Windows x64 (including Darwin-only fsevents); excluded from this observed Windows cache, not universally excluded from PH1 |
| Exercised Ubuntu Web build | Linux x64 candidates are TypeScript-linux-x64, Rolldown-linux-x64-gnu/musl and lightningcss-linux-x64-gnu/musl. Existing T043 records identify Linux TypeScript/lightningcss notices. Exact selected Linux bindings and full native notice correspondence must be confirmed from retained build inputs; other OS/CPU targets are not Ubuntu x64 inputs |
| Web application versus tooling | Controlled apps/web/src imports React/ReactDOM; scheduler is their runtime dependency. TypeScript/types, Vite/Rolldown/lightningcss and Vitest/test libraries are build/test tooling. Server build-web-static.mjs runs the admitted Web build and packages generated static output, not the whole node_modules directory. A bundler can still embed runtime dependencies; source imports are not a byte-level shipped-notice oracle |
| Server integration | Retained T043 packaging evidence demonstrates actual Web output inside the Server JAR, rather than test-only HTML. Reviewed development generation source 2a74130b88cffe1ee96d28014c7a0ec080d1a199 / JAR 7f0a628d2efd94405ba5f083295c23e6faf0246da86c8dd019f669f69482d53c remains historical, not a newly built final-F05 Server package |
| Gateway integration | Existing qualified product package source 0aefb56f4f87b337ce4cc614f51b5f96ac2e86c9 / JAR c26b870e22a6ffb6ed9acbcbcd1dd20208004226c4d09a399e227983023a14e1; 38 collected runtime coordinates project to 32 packaged JARs after six starter omissions. Retained package oracle excludes JSR305 and build-tool leakage. No independent package-byte reinspection in this review |
| Test/build versus delivery | The 96 Server compile/runtime/test rows and 95 tool-rights rows are not a release SBOM or all shipped libraries. Swagger uses the actual unmodified 5.32.14 WebJar and its retained bundled notices; reference-only springdoc candidates are excluded. Node is project-approved tooling/runtime with retained full notices; this does not make every npm dependency project-approved |

Package-byte reinspection is currently BLOCKED-ACCESS: no controlled JAR exists in the local
Server/Gateway target directories. Primary Web dist is unrelated newer output and is not used as
PH1 evidence. SSH alias resolution failed; direct phuclam@192.168.137.33 reached authentication but
BatchMode refused publickey/password. No credential was requested/read/disclosed and no sudo,
database mutation, rebuild or preview change was attempted. Retained package assertions remain
technical evidence; hashes alone do not independently prove present notice delivery.

## 7. Exact remaining decisions, not another feature slice

| ID / remaining item | Smallest next action / owner / closure oracle |
|---|---|
| R36-01 — exercised native inputs and notice delivery | Restore authenticated read-only SSH access or provide the existing controlled package/input/notice inventories, without passwords in chat. Engineering compares exact Linux bindings and retained Server/Gateway/static notices to qualified hashes; no new build is needed merely to read existing artifacts |
| R36-02 — Rolldown native binary/transitive correspondence | Engineering intake correlates exact published/cache binary provenance and compiled Rust notice coverage to the now-established v1.2.11 source grant. Publisher attestation absence is a declared provenance limitation, not automatically a missing license; reviewer must dispose the exact limitation rather than assume a reproducible build |
| R36-03 — known supplemental/custom/reciprocal terms | Project Reviewer / Legal Review determines the exact intended PH1 integration/internal-use disposition for retained Maven/Plexus/Sisu/JDOM/Jakarta/Tomcat and Web MPL/W3C/CC-BY/Go supplements. Historical bounded exceptions remain valid for their historical execution; no new exception or broad commercial approval is inferred |

All readily available local legal texts have now been reviewed, and official reference-only
source evidence narrowed the native-source/patent gaps. T036 remains IN_PROGRESS because the
above required integration/notice and accountable dispositions are unresolved. This is not a
claim that the components prohibit commercial use, nor a reason to repeat F05 engineering tests.
No change to F05 acceptance, T035, application code, migrations, dependencies, runtime, timer,
verifier or PR Draft/Open state is made. Whole-PH1 acceptance and merge remain separate.

## 8. Authenticated retained-package inspection — v0.3 successor

The v0.2 access failure is resolved, not erased. Windows OpenSSH default identity selection did
not include the existing named key. Explicit `-i C:/Users/TD-999/.ssh/idea_ddm_dev_ed25519`
with `IdentitiesOnly=yes`, `BatchMode=yes` authenticated phuclam@192.168.137.33. No private-key
content was read, no password was supplied, and no SSH/global security configuration changed.

Procedure on 2026-10-06: bounded `find`, `sha256sum`, package-manifest reading, and installed JDK
`jar tf` only. The JAR tool is `/opt/idea/tools/jdk-25.0.4.1+1/bin/jar`, SHA-256
033a730b1e74f26f7345ec4754bd6fa8a0d075973475d18695b386da516738b2.
No Maven, restore, package/build, application launch, listener, database operation or extraction
was performed. R36-01 is no longer BLOCKED-ACCESS; actual notice verification has a finding.

| Exact retained target / observation | Actual result / limitation |
|---|---|
| `/home/phuclam/idea-f05-sprint-20261005-37/gateway-boot-08/source/run/application/target/idea-gateway-0.1.0.jar` | SHA-256 c26b870e22a6ffb6ed9acbcbcd1dd20208004226c4d09a399e227983023a14e1 matches retained qualification. Outer JAR listing confirms 32 runtime JAR entries, no JSR305/build-tool entries. This listing does not independently open nested legal text |
| `/home/phuclam/idea-t043-package-green-2fe89d4/apps/server/target/idea-server-0.1.0-SNAPSHOT.jar` | SHA-256 733f93d6ae4a5d9db42e79ec6e4f60812c89855fd2bb3508eeef815f98230c22 matches historical T043 package |
| `/home/phuclam/.local/share/idea/dev-preview-26/server.jar` | SHA-256 7f0a628d2efd94405ba5f083295c23e6faf0246da86c8dd019f669f69482d53c matches accepted development generation. Static entries are index.html and assets/index-DJQKxs3r.js. Outer legal entries identify Swagger LICENSE.txt/NOTICE.txt; no React/ReactDOM/scheduler legal entry is present |
| T043 generated `assets/index-DJQKxs3r.js` | SHA-256 a34548822cf5cadf32e485f6b302052105407894dfacbe77a9717a3a12bb6552. Zero matches for @license, Copyright, permission notice or THE SOFTWARE IS PROVIDED; no separate generated runtime notice file. Marker search is corroboration, not a general semantic license detector |
| Exact Ubuntu native inputs | Installed package manifests identify `@rolldown/binding-linux-x64-gnu@1.2.11`, `@typescript/typescript-linux-x64@7.0.2`, `lightningcss-linux-x64-gnu@1.33.0`, not musl targets. These are build tools, not automatically runtime Web payload |
| TypeScript Linux legal files | LICENSE a7d00bfd54525bc694b6e32f64c7ebcf5e6b7ae3657be5cc12767bce74654a47 and NOTICE f5c708b59114507b8b27b48181b6883d106bbca0c1634bbee45b5e344237b66b match the substantively reviewed Windows/parent texts |
| LightningCSS Linux legal file | LICENSE 5eba353fe5076ac3432177f8ab1cf75e3afcd0584251e37c3bfead5f447d040e matches retained MPL text identity |
| Rolldown Linux native binary | SHA-256 34e3f5cc135d0fec7f0d9837e30413f1a151037b1568911f074048bf941d68e5; native package has no separate legal file. Source grant is established in §5; compiled transitive notice/provenance disposition remains R36-02 |

**R36-04 — Web runtime notice packaging: OPEN finding.** The retained generated Web output
and reviewed Server outer entries do not retain the React/ReactDOM/scheduler copyright/permission
text identified in §5. Swagger-specific legal files do not satisfy unrelated runtime-library notices.
This is a bounded packaging evidence/compliance gap; it is not an authentication defect, absence
of an MIT grant, or a claim that all dependencies forbid commercial use.

Smallest proposed repair: retain the exact admitted React/ReactDOM/scheduler notices with the real
generated Web/Server package and make that notice material available with delivered Web copies.
Check repeat packaging and the final exact JAR/static output for notice retention. No new package,
framework, version or business API is required. Before new package execution, obtain the bounded
T036 tooling authority needed for the existing Maven/Web lifecycle; expired T029–T034 exceptions
do not authorize this successor build. Do not rebuild/redeploy preview merely during this audit.
Engineering owns notice integration; Project Reviewer owns the bounded execution decision and
disposition; Legal Review remains separate for identified supplemental/custom terms.

Current remaining work: R36-01 package notice closure (access restored, not all nested notices
reinspected), R36-02 native provenance/transitive notices, R36-03 accountable special-term
dispositions, and R36-04 the actual Web notice packaging repair. No T036/PH1 completion,
new application qualification or commercial clearance is claimed.

## 9. R36-04 successor notice-retention repair — v0.4

The human approved the narrow T036 internal/offline repair before execution.
[Controlled successor scope and exact receipt](../../../docs/research/2026-10-06-t036-notice-packaging-exception.md)
records approval, admitted inputs, commands, owned roots, RED/GREEN and qualification limits.
Historical R36-04 finding in §8 remains unchanged.

The real build script now verifies admitted runtime names/versions and LICENSE hashes, copies
their unchanged bytes to generated `assets/licenses/{react,react-dom,scheduler}.txt`, and the Web
index links them. Existing public assets policy is unchanged; no Java/HTTP/authentication/API
change. The admitted Node-only tool layout uses the same locked TypeScript/Vite CLIs without
installing npm; normal available-npm execution remains supported and offline-configured.

Genuine RED on retained accepted Server JAR → actual real Web build GREEN → repeat build GREEN
→ copied JAR packaging projection GREEN. All3 notice hashes/3 links pass;261 non-static entries
remain byte-identical. Final checked source fa4cb5c852d5993916b3bc4997c39631a73441c5; production
implementation b2d361a01ab523e53786f0dd741c7e68cba16b04 unchanged by the successor test commit.
Projection JAR dde3f36b1ad015d46c46585b78d77b660f7a62037e7ca7215574ec7186bcc151 is retained
for review only. It is not a fresh full-F05 Server build, accepted/deployed package or browser
execution. Preview remains on its accepted 7f0a628d…53c predecessor; no rollout occurred.

R36-04 = engineering repair/packaging projection PASS, external disposition pending. This closes
the identified three-library runtime notice retention gap at the qualified packaging seam,
not an exhaustive compiled-dependency license conclusion. T036 remains IN_PROGRESS for R36-01
full actual notice mapping, R36-02 native correspondence/transitive notices and R36-03 accountable
supplemental/custom-term dispositions. No blanket legal/commercial clearance or PH1 acceptance.
