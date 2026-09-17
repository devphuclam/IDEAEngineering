# Commercial Software License Intake Guidance for IDEA

| Control field | Value |
|---|---|
| Stable Research ID | `IE-RES-LIC-20260917-001` |
| Document class / version / status | `RESEARCH-GUIDANCE` / `0.1` / `Draft` |
| Product normativity | `INFORMATIVE`; this record does not approve a component, create a product requirement, or change IDEA's commercial model |
| Repository process authority / instruction state | `NOT-APPLICABLE` / `NOT-APPLICABLE`; the controlling intake procedure remains [External Source and License Intake](../agents/external-source-intake.md) |
| Owner / author | Product Decision Authority owner `BLOCKED`; prepared as research guidance by a repository agent |
| Reviewer / acceptance authority | Legal Review Authority review `NOT-RUN`; Product Decision Authority acceptance `NOT-RUN` |
| Applicable baseline | IDEA Engineering repository at 2026-09-17; future proprietary commercial product/distribution is a planning assumption, not an approved offering |
| Evidence date | 2026-09-17 |
| Classification / retention | `INTERNAL`; retain with license-intake and future-commercial-readiness evidence |
| Source / upstream trace | Official license texts and steward guidance cited inline; [External Source and License Intake](../agents/external-source-intake.md) |
| Downstream trace | Candidate-specific third-party intake records, dependency/license inventory, software bill of materials (SBOM), packaging notices, and Legal Review Authority decisions; none created by this note |
| Change record / predecessor | Initial research record; no predecessor |
| Supersession / review trigger | Re-review when a candidate project/version/license, delivery model, linking boundary, copied material, jurisdiction, product market, or company policy changes |
| Evidence status | `OFFICIAL-LICENSE-TEXT` and `OFFICIAL-STEWARD-GUIDANCE`; candidate-specific provenance, dependency closure, legal interpretation, and compliance verification `NOT-RUN` |

Control tailoring under `IE-STD-AUTH-001@0.2`: this research item retains stable identity,
source/evidence/interpretation separation, review state, baseline, and review triggers. It contains no
normative IDEA requirement, effective product date, implementation result, or legal approval.

## 1. Purpose, answer, and limits

**Short answer.** Many open-source licenses permit software to be used in a commercial product.
That does **not** mean every such license permits IDEA to distribute an entirely proprietary,
closed-source combination with no conditions. The Open Source Definition requires an open-source
license not to restrict business use and to permit redistribution and derived works; individual
licenses can still impose notice, source-availability, copyleft, patent, modification-marking, or
relinking conditions. ([OSI Open Source Definition](https://opensource.org/osd))

For a conventional proprietary commercial binary, exact components under `MIT`, `BSD-2-Clause`,
`BSD-3-Clause`, or `Apache-2.0` are commonly viable **intake candidates** when their notice and
other conditions can be fulfilled. `MPL-2.0`, `EPL-2.0`, and the LGPL family can also permit a
proprietary larger application in defined arrangements, but their covered-source and boundary
conditions need candidate-specific engineering and legal review. GPL and AGPL components are not
blanket-prohibited from commercial use—the GNU licenses permit charging for copies—but their
copyleft conditions normally conflict with distributing a linked proprietary combined work; AGPL
also adds a source-offer condition for a modified program used remotely over a network.
([GPLv3 text](https://www.gnu.org/licenses/gpl-3.0.html),
[GNU license FAQ](https://www.gnu.org/licenses/gpl-faq.html),
[AGPLv3 section 13](https://www.gnu.org/licenses/agpl-3.0.html#section13))

This is engineering intake guidance, **not legal advice**. It does not approve any license family,
project, package, asset, dataset, font, model, SDK, or commercial release. Every intake must review
the **exact project, owner, version/tag/commit, artifact, license text, notices, file-level
exceptions, transitive dependencies, and intended use/distribution model**. A family name or SPDX
identifier is an identity aid, not a substitute for the terms actually shipped by the project.

## 2. Terms that must not be collapsed

| Term | Working meaning for intake |
|---|---|
| Commercial use | Use connected with commercial advantage or business activity. Open-source licenses do not prohibit a field of endeavor, but may impose conditions on copying, modification, combination, or distribution. |
| Proprietary distribution | Delivering IDEA under terms intended to keep IDEA-owned source closed and restrict recipients' copying/modification. This can coexist with some third-party open-source parts only when both sets of terms can be satisfied. |
| Internal use | Running software without transferring a copy outside the relevant legal entity. Do not assume contractors, affiliates, customers, hosted tenants, or separately incorporated group companies are “internal.” |
| SaaS / network use | Users interact with server-side software without necessarily receiving its executable. Ordinary GPL distinguishes mere network interaction from conveyance; AGPL has an additional network condition for modified versions. Browser-delivered JavaScript, desktop agents, plug-ins, and download helpers are copies delivered to users even when the server is SaaS. ([GPLv3 section 0](https://www.gnu.org/licenses/gpl-3.0.html#section0), [GNU FAQ on web use](https://www.gnu.org/licenses/gpl-faq.html#UnreleasedMods), [AGPLv3 section 13](https://www.gnu.org/licenses/agpl-3.0.html#section13)) |
| Distribution / conveyance | Transfer of a copy or the license-specific equivalent. Exact definitions differ among GPLv3, MPL, EPL, and other texts; “not sold” does not mean “not distributed.” |
| Aggregate / larger work / combined work / derivative work | License-specific and sometimes law-dependent boundaries. Merely putting separate programs on one medium is not automatically the same as linking them, but process separation, IPC, plug-in APIs, generated code, and shared data structures require facts, not labels. |
| Corresponding Source | For GPL-family licenses, the source and associated material required by the exact license to build, install, run, and modify the covered object code; it is not satisfied by pointing to a different upstream version. ([GPLv3 section 1](https://www.gnu.org/licenses/gpl-3.0.html#section1), [GNU binary-distribution FAQ](https://www.gnu.org/licenses/gpl-faq.html#DistributeExtendedBinary)) |
| Open source vs. source-available | OSI-approved open source must meet the Open Source Definition. Publicly visible source or a custom “source-available” label does not prove permission for commercial reuse or proprietary distribution. ([OSI approved licenses](https://opensource.org/licenses), [OSI Open Source Definition](https://opensource.org/osd)) |

## 3. Practical disposition for proprietary commercial distribution

These rows are screening dispositions, not candidate approvals. `CANDIDATE` means “may proceed to
exact intake”; `LEGAL-REVIEW` means “do not import before specialist review”; `BLOCKED` means “no
reuse under the evidence presently available.”

| License / material class | Proprietary commercial distribution screening | Principal obligations and risks | Intake disposition |
|---|---|---|---|
| MIT (`MIT`) | Permits use, modification, sublicensing, sale, and distribution. | Include the copyright and permission notice in all copies or substantial portions; warranty and liability are disclaimed. ([MIT text](https://opensource.org/license/mit)) | `CANDIDATE — APPROVED-WITH-OBLIGATIONS` only after exact project/version and dependency review. |
| BSD 2-Clause (`BSD-2-Clause`) | Permits source and binary redistribution with or without modification. | Retain the notice, conditions, and disclaimer in source; reproduce them in binary documentation/other materials. ([BSD-2-Clause text](https://opensource.org/license/bsd-2-clause)) | `CANDIDATE — APPROVED-WITH-OBLIGATIONS`. |
| BSD 3-Clause (`BSD-3-Clause`) | Same basic proprietary-distribution fit as BSD-2-Clause. | BSD-2 duties plus no use of copyright-holder/contributor names to endorse or promote the derived product without permission. ([BSD-3-Clause text](https://opensource.org/license/bsd-3-clause)) | `CANDIDATE — APPROVED-WITH-OBLIGATIONS`; check marketing and trademark use. |
| Apache License 2.0 (`Apache-2.0`) | Permits source/object distribution and different terms for modifications or the derivative work as a whole, subject to the license. | Give recipients the license; mark changed files; retain pertinent copyright, patent, trademark, and attribution notices; reproduce applicable `NOTICE` attributions. Includes a contributor patent grant with termination if the licensee files specified patent litigation; grants no trademark rights beyond descriptive/NOTICE use. ([Apache-2.0 sections 2–7](https://www.apache.org/licenses/LICENSE-2.0)) | `CANDIDATE — APPROVED-WITH-OBLIGATIONS`; patent posture, NOTICE, and trademarks must be reviewed. |
| Mozilla Public License 2.0 (`MPL-2.0`) | Mozilla describes MPL as file-level copyleft and expressly permits a Larger Work, including proprietary new files; its FAQ says static linking into a larger proprietary work is possible under MPL's boundaries. | Modified/covered files remain MPL; executable distribution requires informing recipients how to obtain the Covered Software source; preserve notices and license availability. New files containing no MPL code may remain under other terms. Boundary mistakes, generated/amalgamated files, and copied code can expand covered scope. ([MPL-2.0 sections 3.1–3.4](https://www.mozilla.org/en-US/MPL/2.0/), [Mozilla MPL FAQ Q8–Q12](https://www.mozilla.org/en-US/MPL/2.0/FAQ/)) | `LEGAL-REVIEW — POTENTIALLY COMPATIBLE`; approve only a documented file boundary and source-delivery plan. |
| Eclipse Public License 2.0 (`EPL-2.0`) | Can coexist with proprietary material when the proprietary portion is not an EPL `Modified Work`; the text excludes declarations/interfaces/types/classes/structures/files used solely to link, bind by name, or subclass from `Modified Works`. | If the Program is distributed, make its source available under section 3.2, state how to obtain it, include the EPL, and preserve notices. Patent grants/termination and secondary-license notices require review. A commercial distributor must also assess EPL section 4's defense/indemnity obligation for specified claims caused by its acts or omissions. Eclipse says whether linking creates a derivative work depends on all facts and circumstances. ([EPL-2.0 sections 1–4](https://www.eclipse.org/legal/epl/epl-v20.html), [Eclipse legal FAQ Q26–Q27](https://www.eclipse.org/legal/epl/faq/)) | `LEGAL-REVIEW — POTENTIALLY COMPATIBLE`; never infer approval from “dynamic linking” alone. |
| GNU Lesser GPL 2.1 / 3.0 (`LGPL-2.1-only`, `LGPL-2.1-or-later`, `LGPL-3.0-only`, `LGPL-3.0-or-later`) | Intended to permit proprietary applications to use the covered library if the relevant combination conditions are met. | Preserve notices/license; provide covered library source when conveying it; allow replacement/relinking with a modified library and reverse engineering for debugging those modifications. Static linking generally requires application object files or another effective relinking mechanism; dynamically shipping the library still requires its source. LGPLv3 operates as additional permissions to GPLv3 and has its own Combined Work conditions. ([LGPLv2.1 section 6](https://www.gnu.org/licenses/old-licenses/lgpl-2.1.html#section6), [LGPLv3 section 4](https://www.gnu.org/licenses/lgpl-3.0.html#section4), [GNU static/dynamic FAQ](https://www.gnu.org/licenses/gpl-faq.html#LGPLStaticVsDynamic)) | `LEGAL-REVIEW — POTENTIALLY COMPATIBLE`; dynamic linking lowers some operational burden but is not automatic compliance. |
| GNU GPL 2.0 / 3.0 (`GPL-2.0-*`, `GPL-3.0-*`) | Commercial sale is allowed. Distribution of a modified or linked/combined GPL-covered program generally requires the combined covered work and corresponding source under the GPL; that normally conflicts with keeping that combined work proprietary. | Exact version (`only` vs `or-later`), linking/combination, source delivery, installation information for some GPLv3 User Products, notices, and license compatibility matter. Separate independent programs or mere aggregation can fall outside the combined work, but an executable split or IPC label alone does not decide the boundary. ([GPLv2 sections 2–3](https://www.gnu.org/licenses/old-licenses/gpl-2.0.html), [GPLv3 sections 5–6](https://www.gnu.org/licenses/gpl-3.0.html), [GNU FAQ on aggregation and communicating modules](https://www.gnu.org/licenses/gpl-faq.html#MereAggregation)) | `BLOCKED-LEGAL` for a linked/combined proprietary distributed product unless an applicable exception or separate commercial license is verified. Standalone tools and true aggregates still require exact review. |
| GNU Affero GPL 3.0 (`AGPL-3.0-*`) | Has GPLv3 distribution obligations and adds a network condition: a modified version supporting remote network interaction must prominently offer those users its Corresponding Source at no charge. | A proprietary SaaS/server combination can create source-disclosure risk even without transferring the server executable. The condition applies to the modified covered version and may affect a combined work; exact architecture and modification facts are essential. ([AGPLv3 section 13](https://www.gnu.org/licenses/agpl-3.0.html#section13), [GNU AGPL FAQ](https://www.gnu.org/licenses/gpl-faq.html#AGPLv3InteractingRemotely)) | `BLOCKED-LEGAL` for proprietary network services or combined works unless dual/commercial licensing or a reviewed separation resolves the conflict. |
| CC0 1.0 (`CC0-1.0`) for assets/data | Intended to waive copyright and related rights to the extent allowed, with a fallback license, allowing commercial copying/modification. | CC0 does not affect patent or trademark rights, or third-party privacy/publicity rights, and gives no warranty about the work or copyright status. ([CC0 deed and legal-code link](https://creativecommons.org/publicdomain/zero/1.0/)) | `CANDIDATE`; provenance and non-copyright rights remain required. Do not use the label “public domain” without evidence. |
| CC BY 4.0 (`CC-BY-4.0`) for assets/data/documentation | Permits sharing and adaptation, including commercially. | Give appropriate attribution, license link, copyright/disclaimer information when supplied, source link when practicable, and change indication; do not imply endorsement or add legal/technical restrictions that negate licensed rights. Other privacy, publicity, moral, patent, and trademark rights may remain. ([CC BY 4.0 deed](https://creativecommons.org/licenses/by/4.0/), [CC BY 4.0 legal code](https://creativecommons.org/licenses/by/4.0/legalcode)) | `CANDIDATE — APPROVED-WITH-OBLIGATIONS` for the exact non-software material. |
| CC BY-SA 4.0 (`CC-BY-SA-4.0`) | Commercial use is allowed, but distributing adapted material invokes ShareAlike. | CC BY duties plus license adapted contributions under the same or an officially compatible license; product EULA/DRM must not impose prohibited additional restrictions on the licensed material. ([CC BY-SA 4.0 deed](https://creativecommons.org/licenses/by-sa/4.0/)) | `LEGAL-REVIEW`; risk depends on whether IDEA adapts the asset and how it is packaged/licensed. |
| Any Creative Commons `NC` term | `NonCommercial` prohibits use primarily intended for commercial advantage or monetary compensation. | Commercial IDEA use is not covered by the public license without separate permission. ([CC license considerations](https://creativecommons.org/share-your-work/licensing-considerations/version4/), [CC BY-NC 4.0 deed](https://creativecommons.org/licenses/by-nc/4.0/)) | `REJECTED` for commercial product use unless a separate commercial grant is executed and recorded. |
| Any Creative Commons `ND` term | Allows sharing unadapted material under conditions, but not distribution of adapted material. | Cropping, recoloring, editing, translation, conversion beyond mere format change, compositing, or other transformation may create adaptation risk. ([CC BY-ND 4.0 deed](https://creativecommons.org/licenses/by-nd/4.0/)) | `REJECTED` for an asset expected to be modified; otherwise `BLOCKED-LEGAL` until the exact unchanged-use case is reviewed. |
| SIL Open Font License 1.1 (`OFL-1.1`) | Permits commercial use, bundling, embedding, and redistribution with proprietary software. Documents/artwork made using or embedding the font do not inherit OFL. | Font software and modifications remain OFL; do not sell the font by itself; retain copyright/license information when distributing the font; modified fonts may not use Reserved Font Names without permission. ([SIL OFL text and FAQ](https://software.sil.org/oflt/)) | `CANDIDATE — APPROVED-WITH-OBLIGATIONS`; confirm the exact font package, Reserved Font Names, modification, web-font delivery, and notices. |
| Proprietary SDK, CAD/Office API, converter, plug-in kit, runtime, media pack, or marketplace asset | “Free download,” “royalty-free,” or an open-source wrapper does not establish commercial redistribution rights in the proprietary binary/content. | EULA may limit users, seats, servers, territory, field of use, output, benchmarking, modification, reverse engineering, cloud use, sublicensing, redistribution, support, audit, or runtime packaging. Separate trademark, export, telemetry, data, and generated-output terms may apply. | `BLOCKED-LEGAL` and company approval until the exact EULA/order/entitlement and deployment are reviewed. |
| Custom, source-available, ethical-use, research-only, evaluation-only, non-production, or unknown terms | Public source visibility is not permission for the intended commercial proprietary use. A custom license may permit some business uses while restricting others. | Restrictions can be incompatible with IDEA's market, hosting, distribution, or customer terms; automated scanners may not interpret them. | `BLOCKED-LEGAL`; do not import while terms or authority are unclear. |
| No license / missing grant | Default copyright applies; a public GitHub repository alone does not permit reuse, modification, or distribution. GitHub's hosting terms allow viewing/forking in the service but do not provide the general reuse permission IDEA needs. ([GitHub licensing documentation](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository)) | README claims, badges, package metadata, prior forks, or community assumptions do not replace a grant from the rights holder. | `BLOCKED`; keep `REFERENCE-ONLY`, copy nothing, or obtain a documented license from the rights holder. |

## 4. Use-model matrix

| Intended use | What usually changes the obligation analysis | Required IDEA treatment |
|---|---|---|
| Internal evaluation, no external copy | Permissive-license notice duties often attach on distribution rather than execution. GNU's FAQ states a company can modify GPL software and use it internally without releasing it outside the organization. This does not settle whether a contractor, affiliate, hosted customer, or AGPL remote user is inside the same boundary. ([GNU FAQ on unreleased modifications](https://www.gnu.org/licenses/gpl-faq.html#GPLRequireSourcePostedPublic)) | Record the legal entity, users, hosts, data, and whether any installer, browser code, desktop agent, container image, VM, or source copy leaves that boundary. Internal use today does not approve later distribution. Treat AGPL and external-user network access as Legal Review triggers. |
| SaaS / hosted service | Ordinary GPL says mere network interaction without transfer of a copy is not conveyance; GNU's FAQ says a modified GPL server need not publish source solely because it runs a website. AGPL section 13 differs for a modified version supporting remote interaction. Client-delivered code is still distributed. ([GPLv3 section 0](https://www.gnu.org/licenses/gpl-3.0.html#section0), [GNU web-use FAQ](https://www.gnu.org/licenses/gpl-faq.html#UnreleasedMods), [AGPLv3 section 13](https://www.gnu.org/licenses/agpl-3.0.html#section13)) | Inventory server components separately from browser/mobile/desktop-delivered components. Screen all network-copyleft or custom hosted-service terms. Do not call SaaS “internal” merely because IDEA operates the server. |
| Binary installer, desktop app, appliance, on-premises server, plug-in | A copy reaches the customer; notice, license-text, source, relinking, and installation-information conditions may activate. Bundled transitive libraries are included even when not called directly by IDEA code. | Produce a release-specific license inventory/SBOM, third-party notices, source bundle or durable source-offer mechanism where required, and verification that the shipped bytes match the reviewed versions. |
| Source copy or adaptation | Copied lines, generated/amalgamated source, ports to another language, modified assets, patches, and embedded examples may remain covered even if renamed or placed in a new file. GNU's FAQ treats translation to another language as modification; MPL/EPL define their own covered boundaries. ([GNU FAQ on translation](https://www.gnu.org/licenses/gpl-faq.html#TranslateCode), [MPL-2.0 definitions and section 3](https://www.mozilla.org/en-US/MPL/2.0/), [EPL-2.0 definitions and section 3](https://www.eclipse.org/legal/epl/epl-v20.html)) | Record file/line provenance and modification history. Preserve headers. Do not remove attribution to “clean up” copied code. Review generated code/templates under their explicit output terms. |
| Dynamic linking | MIT/BSD/Apache generally do not distinguish it for copyleft scope. LGPL commonly supports proprietary dynamic linking when replacement/reverse-engineering and library-source duties are met. GPL does not create a universal safe harbor merely because the link is dynamic. EPL says linking is fact-dependent; MPL expressly permits proprietary Larger Works under its file boundary. | Record library loading, ABI/API, callbacks, shared memory/data structures, packaging, replaceability, and whether the library ships with IDEA. Obtain Legal Review for GPL/EPL/LGPL and any custom license. |
| Static linking | Copies library code into the executable. LGPL normally requires object files or an equivalent method enabling relink with a modified library; GPL combination risk remains; MPL can permit a proprietary Larger Work while covered files remain MPL. | Prefer a verified dynamic arrangement when it materially simplifies LGPL compliance, but do not treat that as approval. For static use, prove the exact relinking and source-delivery package before release. |
| Separate process, CLI, plug-in, IPC, or service | A process boundary can support a separate-program analysis, but tight/intimate communication, a bespoke protocol, shared control flow/data, required pairing, or shipping as one product can change the facts. The GNU FAQ distinguishes pipes/sockets/command-line communication from shared address-space linkage but says communication semantics and intimacy matter. ([GNU FAQ on aggregation and communication](https://www.gnu.org/licenses/gpl-faq.html#MereAggregation), [GNU FAQ on plug-ins](https://www.gnu.org/licenses/gpl-faq.html#GPLAndPlugins)) | Document deployability, substitutability, protocol, ownership, packaging, and whether either side is independently useful. Do not design a nominal process split as a license conclusion; submit the actual architecture for review. |
| Fonts, icons, images, audio/video, documentation, sample files, CAD templates | These may have licenses different from the surrounding code repository. CC terms, OFL, stock-media terms, personality/privacy rights, trademarks, and embedded third-party material apply separately. | Create one line item per asset family and source. Retain attribution placement requirements and proof of provenance. Never infer an icon/font/media license from the code package license. |
| Datasets, schemas, models, weights, and generated output | Copyright, sui generis database rights, privacy, contract/API terms, model licenses, and source-data rights may differ. CC 4.0 addresses some database rights, but not every third-party right. ([CC BY 4.0 legal code, section 4](https://creativecommons.org/licenses/by/4.0/legalcode)) | Record dataset and model terms separately from code. Verify rights to input, weights, outputs, redistribution, commercial use, personal data, and refreshes. A software SPDX ID is not an approval for data or model weights. |
| SDK/API under an EULA | Header files, samples, runtime DLLs, redistributables, API access, cloud services, and output may each have different terms. | Review the exact vendor agreement, order, entitlement, redistribution list, server/client topology, and customer flow-downs. Preserve evidence of company authorization. |

## 5. License identity and compatibility controls

1. Use the exact current SPDX expression only after matching it to the governing text. The SPDX
   License List provides standardized identifiers, names, texts, and permanent URLs; it also
   distinguishes exceptions and deprecated identifiers. SPDX inclusion does not itself mean OSI
   approval or compatibility with IDEA. ([SPDX License List](https://spdx.org/licenses/))
2. Preserve `-only` versus `-or-later`. `GPL-2.0-only` is not the same grant as
   `GPL-2.0-or-later`; the same rule applies to LGPL and AGPL identifiers.
3. Interpret `OR` as a recipient choice among licenses and `AND` as simultaneous obligations.
   Verify the project's actual grant supports the expression; a scanner-inferred expression is
   evidence to inspect, not authority.
4. Record exceptions with `WITH`, such as a verified classpath, linking, runtime, or font
   exception. Review the exact exception text and the files to which it applies. Do not generalize
   one project's exception to another GPL-family component.
5. Check root and nested `LICENSE`, `COPYING`, `NOTICE`, `AUTHORS`, file headers, package manifests,
   generated/vendored directories, binary metadata, release archives, and the project's official
   licensing page. Conflicts remain `BLOCKED-LEGAL` until resolved by authoritative evidence.
6. Review every transitive runtime dependency and redistributed build/runtime component. A direct
   dependency's permissive license does not relicense its dependencies.
7. Treat trademarks separately. MIT/BSD permissions do not necessarily grant a brand license;
   Apache 2.0 expressly excludes trademark rights except limited descriptive/NOTICE use.
8. Treat patents separately. Apache-2.0, MPL-2.0, EPL-2.0, and GPLv3 contain patent provisions, but
   scope, contributor coverage, termination, third-party patents, and standards-essential claims
   still need candidate-specific review.

## 6. Candidate intake checklist

### Identity and evidence

- [ ] Record project name, rights holder/owner, canonical official URL, exact version/tag/commit,
  retrieval date, artifact filename, and checksum where practical.
- [ ] Preserve the exact license, notice, exception, and attribution files from that source state.
- [ ] Confirm license scope at file/package level; resolve conflicts between repository, release,
  package metadata, website, and headers.
- [ ] Record the exact SPDX expression without replacing the underlying evidence.
- [ ] Inventory transitive dependencies and separately licensed examples, tests, generated code,
  documentation, icons, fonts, media, data, models, native binaries, and SDK redistributables.
- [ ] Confirm the licensor has not marked the material evaluation-only, non-production,
  non-commercial, research-only, or subject to a separate EULA.

### Intended use and architecture

- [ ] Classify the intake as `REFERENCE-ONLY`, `DEPENDENCY`, `COPY-OR-ADAPT`, or
  `FORK-OR-VENDOR` under the repository intake procedure.
- [ ] State internal, hosted/SaaS, customer binary, on-premises, source delivery, marketplace,
  plug-in, and appliance uses separately.
- [ ] Record whether IDEA modifies, copies, translates, generates from, subclasses, links
  statically/dynamically, loads as a plug-in, invokes as a process, or communicates over a network.
- [ ] Draw the actual delivery boundary: server, browser code, desktop process, installer,
  customer environment, build system, update service, and source-download endpoint.
- [ ] Identify every legal entity and external user that receives a copy or interacts remotely;
  do not assume contractor/affiliate/customer status.

### Obligations and release controls

- [ ] Map copyright/license text, attribution, `NOTICE`, change-marking, endorsement/trademark,
  patent, source, written-offer, relinking/replacement, reverse-engineering, installation-information,
  ShareAlike, network-source, and EULA flow-down obligations to named owners.
- [ ] Define where recipients will see third-party notices and how the release process proves they
  are included.
- [ ] For source obligations, retain the exact Corresponding Source and build/install scripts for
  the shipped binary; define access duration and release/version mapping.
- [ ] For LGPL, test replacement/relinking with a modified compatible library and ensure IDEA's
  EULA does not prohibit the reverse engineering needed for that purpose.
- [ ] For MPL/EPL, identify covered/modified files and test the source-delivery path.
- [ ] For AGPL, identify all remote users and the prominent source-offer mechanism for the exact
  running modified version; if IDEA will not meet it, keep the candidate blocked.
- [ ] For CC/OFL assets, build attribution/font-license output and confirm modification, Reserved
  Font Names, ShareAlike, privacy/publicity, and trademark handling.
- [ ] Record any security, export, support, update, vulnerability, or abandonment risk separately;
  license permission is not technical qualification or vendor support.

### Disposition and maintenance

- [ ] Obtain one recorded disposition: `REFERENCE-ONLY`, `APPROVED`,
  `APPROVED-WITH-OBLIGATIONS`, `BLOCKED-LEGAL`, or `REJECTED`.
- [ ] Obtain Legal Review Authority and company approval where this guidance flags it; record the
  actual decision, scope, conditions, approver, and date rather than citing this note as approval.
- [ ] Update the dependency/license inventory, SBOM, attribution package, source archive, and
  release checklist before shipping.
- [ ] Reconcile scanner output with the reviewed source; retain false-positive/false-negative
  decisions. Automation does not replace license evidence or legal interpretation.
- [ ] Reopen intake on version, license, exception, source owner, dependency graph, copied material,
  linking/hosting/distribution model, customer terms, market, or jurisdiction change.

## 7. Red flags requiring stop or escalation

- No license, an absent license file, “all rights reserved,” or no clear statement connecting the
  license to the material.
- License indicated only by repository topic, badge, package registry metadata, scanner guess,
  blog post, or a downstream fork.
- Custom terms, Commons Clause/additional restrictions, “source available,” ethical/field-of-use,
  non-commercial, research/evaluation-only, non-production, or “free for personal use” language.
- GPL/AGPL code proposed for linking, incorporation, generated output, browser delivery, or a
  server/service without a verified exception, dual license, or Legal Review disposition.
- LGPL static linking without a tested relinking package; EULA terms prohibiting all reverse
  engineering; or an updater/signing model that prevents installation of a modified library.
- MPL/EPL covered files copied into IDEA-owned files, generated amalgamations, or unclear file and
  module boundaries.
- `NOTICE`, attribution, author, patent, or trademark files omitted from a package or stripped by
  bundling/minification.
- `GPL-2.0`/`LGPL-2.1`/`AGPL-3.0` recorded without `-only` or `-or-later`, or an exception named
  without its exact text and file scope.
- Dual-license text where `OR` versus `AND` is unclear, or where the chosen commercial option has
  no executed entitlement.
- Assets/data/fonts/models assumed to inherit the repository's code license; third-party content
  embedded in a permissively licensed repository; or missing model/data provenance.
- Proprietary SDK/runtime redistributed because its wrapper/sample is open source, because it is
  installed on a developer machine, or because a vendor download page is public.
- Source-offer plan that points only to upstream, a different version, patches without base source,
  or a short-lived URL not tied to the shipped binary.
- A candidate described as “approved” without an exact source identity, intended use, obligations,
  owner, release evidence, and review authority.

## 8. Evidence register and limitations

| Evidence class | Official sources used | What they establish | Limitation |
|---|---|---|---|
| Open-source definition and identifiers | [OSI Open Source Definition](https://opensource.org/osd), [OSI approved licenses](https://opensource.org/licenses), [SPDX License List](https://spdx.org/licenses/) | Open-source criteria; current identifier/list mechanism. | Does not decide compatibility or approve a project/version for IDEA. |
| Permissive license text | [MIT](https://opensource.org/license/mit), [BSD-2-Clause](https://opensource.org/license/bsd-2-clause), [BSD-3-Clause](https://opensource.org/license/bsd-3-clause), [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0) | Granted rights and express conditions for these canonical texts. | A project can add exceptions, use variants, or contain separately licensed material. |
| Weak/file/library copyleft | [MPL-2.0 text](https://www.mozilla.org/en-US/MPL/2.0/), [Mozilla MPL FAQ](https://www.mozilla.org/en-US/MPL/2.0/FAQ/), [EPL-2.0 text](https://www.eclipse.org/legal/epl/epl-v20.html), [Eclipse legal FAQ](https://www.eclipse.org/legal/epl/faq/), [LGPLv2.1](https://www.gnu.org/licenses/old-licenses/lgpl-2.1.html), [LGPLv3](https://www.gnu.org/licenses/lgpl-3.0.html) | License-defined covered scope, distribution/source conditions, and steward guidance. | Boundary/derivative-work conclusions depend on facts and governing law; FAQs are guidance, not the license. |
| Strong/network copyleft | [GPLv2](https://www.gnu.org/licenses/old-licenses/gpl-2.0.html), [GPLv3](https://www.gnu.org/licenses/gpl-3.0.html), [AGPLv3](https://www.gnu.org/licenses/agpl-3.0.html), [GNU license FAQ](https://www.gnu.org/licenses/gpl-faq.html) | Canonical GNU terms and FSF explanations of internal use, source delivery, linking, SaaS, LGPL, and AGPL. | Does not establish a court ruling, local-law conclusion, or candidate-specific architecture disposition. |
| Assets, data, and fonts | [Creative Commons FAQ](https://creativecommons.org/faq/), [CC 4.0 considerations](https://creativecommons.org/share-your-work/licensing-considerations/version4/), [CC BY 4.0 legal code](https://creativecommons.org/licenses/by/4.0/legalcode), [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/), [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/), [CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0/), [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/), [SIL OFL 1.1 and FAQ](https://software.sil.org/oflt/) | Official terms and steward guidance for the named materials/licenses. | CC recommends software-specific licenses rather than CC licenses for software; other rights and material-specific terms remain. |
| No-license repositories | [GitHub licensing documentation](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository) | Default copyright/no general reuse permission; limited hosting-service view/fork context. | Jurisdiction-specific statutory exceptions and separately negotiated grants require Legal Review. |

### Overall limitations

- No candidate repository, package archive, lockfile, container, installer, executable, font, asset,
  dataset, model, or SDK agreement was inspected. Dependency and license scans are `NOT-RUN`.
- No jurisdiction, customer contract, procurement term, patent portfolio, trademark permission,
  export rule, privacy/publicity right, or company entitlement was evaluated.
- The terms “derivative work,” “combined work,” “distribution,” and similar concepts can require
  legal interpretation. This record deliberately identifies escalation points rather than claiming
  a universal technical rule.
- The only reusable conclusion is the intake method: **review the exact project/version/license and
  exact use before import, preserve the evidence and obligations, and obtain the required authority.**
