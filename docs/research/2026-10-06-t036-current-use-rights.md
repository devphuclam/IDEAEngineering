# T036 current-use rights and compliance disposition

| Control | Value |
|---|---|
| Stable ID / class / version | IE-RES-T036-CURRENT-USE-RIGHTS-20261006 / rights reconciliation / 0.1 |
| Status / normativity | Draft engineering reconciliation; INFORMATIVE for product behavior |
| Decision authority | Explicit Project Reviewer instruction in this conversation on 2026-10-06: identified commercial-use grants default to APPROVED-WITH-OBLIGATIONS; obligations alone do not establish BLOCKED-LEGAL |
| Owner / author / reviewer | Engineering / Codex research worker / Project Reviewer Nguyen Huynh Phuc Lam; no independent legal opinion claimed |
| Baseline / use / date | PR38 successor to e25b237; exact retained inventories below; unmodified PH1 internal engineering runtime/build/test; 2026-10-06 Asia/Ho_Chi_Minh |
| Classification / retention | INTERNAL; retain with historical rights evidence and exceptions |
| Upstream / downstream | [Exact Q02 rights](inventories/f05a-q02-rights-dispositions.tsv), [Maven distribution](inventories/f05a-q02-maven-distribution.tsv), [actual-use map](inventories/ph1-actual-use-dispositions-20261006.tsv) / [T036 matrix](../../specs/005-ph1-foundation-custody/evidence/PH1-T036-closure-matrix.md) |
| Change / supersession | Current scoped disposition supersedes classification-only Legal Review gates for PH1; historical records/results/authorizations remain unchanged |
| Review trigger / tailoring | Version, hash, graph, modification, distribution, missing right or unusable obligation changes; information/configuration control STANDARD-GUIDED under IE-STD-AUTH-001 |
| Evidence / limitation | Actual retained legal texts and exact publisher/source observations; rights compatibility separated from performed packaging compliance and future distribution |

## 1. Decision rule and actual use

The Project Reviewer has accepted complying with identified obligations. A custom acknowledgement,
reciprocal/source condition, patent provision or license classification is not by itself an
unfulfilled company-authority prerequisite for the current use. This is an actual current-use
disposition, not another process exception and not a representation that counsel reviewed it.

The [89-JAR payload map](inventories/ph1-packaged-notice-map-20261006.tsv) distinguishes actual
application copies from Maven/tool copies. The [191-row input-role map](inventories/ph1-actual-use-dispositions-20261006.tsv)
contains exact component hashes and graph roles. The [Q02 rights map](inventories/f05a-q02-rights-dispositions.tsv)
and [52-JAR Maven distribution map](inventories/f05a-q02-maven-distribution.tsv) cover additional
Gateway/plugin/core versions. Those historical inventory disposition columns are not silently
rewritten; this successor supplies their current PH1 reading rule.

No application/source modifications, tooling execution, dependency graph changes or distribution
of Maven/native tooling to customers are introduced by this record. The non-shipping designation
comes from inspected artifact payloads, not from assuming all tools are automatically excluded.
Future shipment of a previously build-only component requires applying its recorded delivery
obligations to that actual shipment, not purchasing a license merely because it is reciprocal.

## 2. Exact current-use dispositions

| Exact material and identity source | Applicable terms / current PH1 disposition | Performed retention and concrete obligations |
|---|---|---|
| Plexus Utils 3.5.1 / 3.6.0 / 3.6.1 / 4.0.2 / 4.0.3 and Plexus XML 3.0.1; exact JAR hashes in the Q02/core/input-role inventories | Apache-2.0 plus ExtremeLab 1.1.1, Javolution BSD-2-Clause, ThoughtWorks BSD-3-Clause and supplied Rome attribution; APPROVED-WITH-OBLIGATIONS for unchanged build/core use | Existing observed JARs retain all supplemental texts and NOTICE. Preserve copyright, conditions, disclaimers, required acknowledgement and name/no-endorsement restrictions. Keep full supplied texts, not merely adjacent Apache text. Not shipped in inspected IDEA application payloads; no corresponding IDEA application notice requirement is fabricated for absent tooling |
| Plexus Interpolation 1.29; JAR 088d444dbcedfb384630d8686697ece3c401d6f33c8f8b3aa7259ea1c6996878 | Apache-2.0 distributor component coverage plus four exact Apache-1.1 source grants, including altered Codehaus acknowledgement/contact wording; APPROVED-WITH-OBLIGATIONS for the unchanged internal copy; coverage judgment detailed in section 3 | Maven distribution retains complete adjacent Apache text. Preserve all four actual legacy headers and copyright/conditions/disclaimer/acknowledgements with any delivery of this tool, including the ASF/Codehaus variants; respect Ant/Jakarta/Commons/ASF endorsement and Apache product-name restrictions. No tool code copied into IDEA source and no tool payload in inspected packages |
| Sisu Plexus 0.9.0.M4; Sisu Inject/Plexus 1.0.0; exact source and binary hashes in [Plexus evidence](2026-10-03-f05a-q02-plexus-rights.md) and core inventory | EPL-2.0; APPROVED-WITH-OBLIGATIONS, build/core only | Full EPL texts retained in the existing Maven distribution; exact milestone source correspondence retained for the acquisition version. Keep copyright/patent/attribution notices and license. If a copy is transferred in a manner covered by EPL distribution, accompany the covered Sisu program with source-availability information for that exact version and preserve recipient source rights. This does not license unrelated IDEA source under EPL |
| Jakarta Annotation API 3.0.0; JAR b01f55552284cfb149411e64eabca75e942d26d2e1786b32914250e4330afaa2 | EPL-2.0 OR GPL-2.0 with Classpath exception; select EPL-2.0 for this PH1 compliance route; APPROVED-WITH-OBLIGATIONS | Existing nested JAR retains exact legal material. Accompany current delivery copies with EPL license, notices and an explicit source-availability statement for the covered component at [the exact 3.0.0 source](https://github.com/jakartaee/common-annotations-api/tree/3.0.0). No secondary/GPL election is needed for this route. Do not infer that merely linking IDEA makes IDEA source a covered modification |
| Tomcat embed-core 11.0.24; JAR e7b966dcaac8c5ffa4f10e44031ebf5b71f2123560c08ac8b7120028615aea08; EL/WebSocket companion copies stay in the actual inventory | Apache-2.0 with bundled JavaEE CDDL / JakartaEE EPL schema material; APPROVED-WITH-OBLIGATIONS | Preserve Tomcat LICENSE/NOTICE and the actual schema notices. Current package contains supplied legal material. Add exact source/location information for covered schema copies in accompanying compliance material using [Tomcat 11.0.24 source](https://github.com/apache/tomcat/tree/11.0.24); retain applicable CDDL/EPL conditions for those files, rather than assigning all Tomcat code that license or disclosing unrelated IDEA code |
| javax.annotation-api 1.3.2; installed Maven-core JAR e04ba5195bcd555dc95650f7cc614d151e4bcd52d29a10b8aa2197f3ab89ab9b | Actual embedded CDDL-1.0 / GPLv2-Classpath material and adjacent CDDL-1.1 / GPLv2-Classpath material; APPROVED-WITH-OBLIGATIONS for the unchanged internal Maven copy | Both exact legal texts remain retained; no contradictory commercial-use prohibition was identified. Do not erase the observed version difference or claim a certified per-file GPL exception. The current scope does not redistribute this component with IDEA. If delivering this tool copy later, identify the applicable file/option coverage and provide covered-component source/notice material before delivery; that future packaging decision is not a PH1 internal-use blocker |
| JDOM 2.0.6.1; JAR 0b20f45e3a0fd8f0d12cdc5316b06776e902b1365db00118876f9175c60f302c | Exact JDOM four-condition BSD-style grant; APPROVED-WITH-OBLIGATIONS, Boot-plugin build only | Embedded full license retained; preserve Jason Hunter/Brett McLaughlin copyright, conditions and disclaimer. No unauthorized JDOM product-name/endorsement use. The acknowledgement is requested, not mandatory; do not invent an advertising requirement. Not in inspected application payloads |

The component-specific grants above permit the identified use; their obligations are to be
fulfilled, not waived. EPL patent/termination and commercial-distributor provisions remain in
the full license, as do Apache patent/trademark rules. This record does not manufacture rights
for an unidentified component or use beyond the applicable grant.

## 3. Interpolation coverage: specific successor evidence, not a missing-header shortcut

The historical [Plexus source screen](2026-10-03-f05a-q02-plexus-rights.md#3-interpolations-exact-legacycustom-header-obligations)
found 47 Apache-2.0 headers, four complete Apache-1.1 grants and one headerless source.
The four grants expressly permit source/binary use and redistribution; altered acknowledgement
wording does not itself prohibit current commercial use. Their terms are preserved separately.

On 2026-10-06 a read-only inspection rechecked the installed Apache Maven 3.9.16 distribution:

| Observed copy | Exact SHA-256 / evidence |
|---|---|
| `/home/phuclam/.m2/wrapper/dists/apache-maven-3.9.16/510fba38/LICENSE` | f414d4d8d468fb5bfd42bb8157c8bdca72255264e13060fb4ce2669b960fe12b |
| `lib/plexus-interpolation.license` | cfc7749b96f63bd31c3c42b5c471bf756814053e847c10f3eb003417bc523d30; complete Apache-2.0 text |
| `lib/plexus-interpolation-1.29.jar` | 088d444dbcedfb384630d8686697ece3c401d6f33c8f8b3aa7259ea1c6996878; identical to selected plugin-cache bytes |

The actual distribution LICENSE explicitly applies Apache-2.0 and its adjacent legal text to
the exact `lib/plexus-interpolation-1.29.jar` copy. This is attributable distributor legal material
accompanying the component, not a POM classification or repository badge. The existing
[Maven core evidence](2026-10-03-f05a-q02-maven-core-realm.md#9-installed-distribution-inventory-and-bounded-f05-rights-observations)
already preserved this material; the fresh read confirms the exact version/hash mapping.

Engineering judgment: this component-wide attached legal coverage supports unchanged internal
use of the identical acquired component, while retaining the source-specific legacy obligations.
A missing individual header does not override that covered-copy evidence. This is an explicit
coverage inference, not a claim of an upstream root grant or forensic certification of every
contributor's ownership. The exact upstream tree has no root LICENSE/LICENSE.txt; its
[headerless file](https://github.com/codehaus-plexus/plexus-interpolation/blob/08bde474a835fe95795d3099c11c1b9de2d80779/src/main/java/org/codehaus/plexus/interpolation/FixedInterpolatorValueSource.java)
was reobserved, and these limitations remain visible. No contrary restriction for the actual
current use was found. A later attributable contrary grant/ownership finding reopens that row;
historical conservative coverage observations remain intact.

## 4. Compliance completion versus rights disposition

For the build/core groups, the observed existing distribution/cache already retains the actual
identified legal material; no third-party source modification or customer tooling shipment is
part of current PH1. Keep exact supplementary source-header material and attribution in the
engineering evidence/notice bundle where the upstream JAR omitted it. Supplementary notice
assembly is a retention action, not acquisition of a different dependency or a new legal grant.

For actual runtime copies, preserve embedded material and supply the missing delivery notices
identified in R36-01, plus covered-component source-availability statements where applicable.
This note records the obligation and current-use approval; it does not certify that a planned
bundle has been generated, checked or delivered. The packaging worker's exact files/hashes and
retention oracle must provide that performed evidence before whole T036 closure.

Historical JSR305 3.0.2 lacks established complete grant coverage. Its old BLOCKED-LEGAL
finding remains truthful, but it is excluded from the qualified Gateway graph and inspected
application payloads. It is not approved here and it does not create a current payload blocker.
If a future graph selects it, missing-right qualification is still required.

No currently identified known-term group above is held BLOCKED-LEGAL merely for custom,
reciprocal, acknowledgement, patent or source-availability classification. Remaining performed
compliance actions belong in the R36-01/R36-02 completion oracle. A genuinely missing grant,
contradictory/restrictive term or an obligation IDEA cannot accept remains a valid blocker.

## 5. Verification and boundaries

Performed: read existing research/inventories; inspect exact installed Maven LICENSE mapping,
adjacent legal text/JAR hashes; reference-only exact publisher source/legal inspection in
memory. No new archive, code or dependency was imported; no Maven, build, install, download,
database, listener, preview, verifier, timer or merge action was performed by this research unit.

Independent private-log review and reproducible-build attestation remain unclaimed. This is not
a universal clearance for every future commercial delivery format. The Project Reviewer's
current comply-and-use decision supersedes classification-only PH1 gates without rewriting
past exception scope, historical BLOCKED observations or execution results.
