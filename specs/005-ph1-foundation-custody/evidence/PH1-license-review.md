# PH1 dependency, rights and clean-room review

| Control | Value |
|---|---|
| Stable ID / class / version | IE-VEV-PH1-LICENSE-REVIEW / intake reconciliation review / 0.1 |
| Status / disposition | Draft / T036 IN_PROGRESS; partial exact-inventory review, not legal or commercial clearance |
| Owner / author / reviewer | Engineering / Codex CODEX_ONLY / Project Reviewer Nguyễn Huỳnh Phúc Lâm; Legal Review remains separate |
| Baseline / date | PR38 at 874088695d0b65e6d71b40078d6f55e623087b0a; 2026-10-06 Asia/Ho_Chi_Minh |
| Authority / normativity | Authorized T036 evidence review only; INFORMATIVE; no new execution/import/license right |
| Classification / retention | INTERNAL; preserve historical rights decisions, exceptions, failures and exact inventories |
| Upstream / downstream | [External intake](../../../docs/agents/external-source-intake.md), FR-012 / [tasks](../tasks.md), separate integration/Legal Review |
| Change / supersession / trigger | New reconciliation; supersedes NOT-APPLICABLE; version/hash/graph/use or distribution change reopens applicable intake |
| Tailoring | STANDARD-GUIDED under IE-STD-AUTH-001; inspection of retained source/evidence, not an independent legal opinion, signature audit or third-party reproducible build |

## 1. Actual review and exact inventory identity

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
| Web transitive graph | [T043 intake](../../../docs/research/2026-10-01-t043-web-dependency-intake.md), lock and successor local file inventory | OPEN: this worktree has no node_modules, but the primary checkout supplies exact-version legal files for 43 installed packages. Hashing is not full legal review, archive integrity proof or actual shipped-bundle mapping. Native Rolldown needs attributable coverage; optional platform entries must be classified by actual use, not assumed shipped or ignored |
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
Full bundled notice review is not claimed: TypeScript NOTICE and Vite/Vitest bundled notices are
larger than their package metadata label and remain in the substantive-review gap above.
Local file-link and Git whitespace checks pass; application tests/verifier remain NOT-RUN in
this review. Current Server/Gateway engineering evidence is reused without a new execution.
