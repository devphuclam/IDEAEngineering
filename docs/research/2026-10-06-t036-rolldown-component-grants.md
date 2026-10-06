# T036 Rolldown exact lock component grants: conservative reference inventory

| Control | Value |
|---|---|
| Stable ID / class / version / status | `IE-RES-T036-ROLLDOWN-GRANTS-20261006-001` / `RESEARCH-EVIDENCE` / `0.1` / `Draft` |
| Normativity / process authority / instruction state | `INFORMATIVE` / `NOT-APPLICABLE` / `NOT-APPLICABLE` |
| Owner / author / reviewer | Engineering intake owner, named person `UNKNOWN` / Codex delegated research worker / Project Reviewer, review `NOT-RUN` |
| Acceptance authority | Current-use comply-and-use authority supplied by the user; whole-T036 acceptance `NOT-RUN`; external Legal Review acceptance `NOT-RUN` |
| Baseline / date | T036 current internal Web build tooling; Rolldown `1.2.11`, source commit `8df421985114ecfaf52cce038d4a5a6ea8c05408`; accessed `2026-10-06` |
| Classification / retention | `INTERNAL`; retain with exact-version intake and predecessor evidence |
| Upstream trace | [Current-use research](2026-10-06-t036-native-current-use.md), [delivery scope](2026-10-06-t036-native-delivery-scope.md), [source rights](2026-10-06-t036-rolldown-rights.md), [intake guide](../agents/external-source-intake.md) |
| Downstream trace | [T036 closure matrix](../../specs/005-ph1-foundation-custody/evidence/PH1-T036-closure-matrix.md); [component inventory](inventories/t036-rolldown-lock-grants-20261006.tsv) |
| Change / supersession | New component-grant research; supplements and preserves predecessor observations, does not overwrite historical dispositions |
| Review trigger | Version, source, checksum, feature/target, modifications, tool delivery or obligation changes |
| Evidence status | Actual publisher/source grant texts observed for 81 external locked identities; complete component grant coverage `UNKNOWN`; compiled SBOM `NOT-ESTABLISHED` |

Control tailoring: ISO/IEC/IEEE 15289:2019 (`STD-INFO-001`, `STANDARD-GUIDED`) supplies the
information-item envelope. This record separates observed source terms, inferred applicability,
user-authorized current-use disposition and future delivery qualification. No conformity claim.

## Scope and actual result

The exact [Rolldown Cargo.lock](https://raw.githubusercontent.com/rolldown/rolldown/8df421985114ecfaf52cce038d4a5a6ea8c05408/Cargo.lock)
has 405 package rows: 352 external registry identities and 53 local workspace identities.
Its UTF-8 response SHA-256 is
`b9743f023ede3e14296f003282678336e5eca35ae875fba878e5fcf2fb58392d`.
The TSV records each name/version/source, registry archive checksum when present, actual
legal-source URL/text hash, selected grant or exact unresolved outcome, and conservative
binding-root reachability. Registry checksums identify intended archives; this research did
not download those archives or independently compare them with docs.rs source publication.

| Scope | External identities | Actual grant evidence | Exact identities without established grant |
|---|---:|---:|---:|
| Entire lock superset | 352 | 81 | 271 |
| Recursive recorded-edge union from `rolldown_binding` | 348 | 79 | 269 |

The binding union reaches 397 rows, including 49 local workspace rows. Every recorded edge
resolved uniquely by name and, where present, version; ambiguous edges: zero. The union follows
all locked dependencies recursively, including development, build, optional and target branches.
It deliberately does not infer active Cargo features or compilation. In particular, this broad
union still reaches test/WASM/macOS components. The four excluded external rows are not enough
to turn remaining union coverage into an actual compiled-component finding. Neither scope is
a shipped Software Bill of Materials (SBOM). Local rows are separately labelled
`WORKSPACE-SOURCE`; the predecessor root Rolldown MIT/third-party grant assessment applies to
identified publisher material and is not substituted for external crate terms.

## Primary evidence and identification method

54 external rows have complete grant text from their exact version's docs.rs
publication source page, rather than an SPDX metadata field. All discovered root legal files
were attempted and successfully read texts have URLs/hashes in the TSV. For example,
[aho-corasick 1.1.4 LICENSE-MIT](https://docs.rs/crate/aho-corasick/1.1.4/source/LICENSE-MIT)
was read and hashed, but its initial automated matcher failed across a line break; direct manual
reading independently confirmed its MIT grant, notice condition and disclaimer and corrected
that row. Other unmatched texts remain UNKNOWN. Metadata, filenames and package badges alone
were never accepted as a grant. Selecting one actually supplied usable license is an explicit
current-use election, not a claim that other alternatives do not exist.

The canonical Oxc release [crates_v0.151.0 tag reference](https://api.github.com/repos/oxc-project/oxc/git/ref/tags/crates_v0.151.0)
resolved to `bec650f15b457f3bffb6d79b65bf74bfcbaecdce`. Exact source manifests for 27 locked
Oxc identities independently pin the package name, `0.151.0`, and `license.workspace = true`.
The [actual root MIT text](https://raw.githubusercontent.com/oxc-project/oxc/bec650f15b457f3bffb6d79b65bf74bfcbaecdce/LICENSE)
was read and hashed: `95ced5ecf1133fbf41d409b5555c86c344f83f3b019926057ddbc07cfdcc27b3`.
The [actual THIRD-PARTY-LICENSE](https://raw.githubusercontent.com/oxc-project/oxc/bec650f15b457f3bffb6d79b65bf74bfcbaecdce/THIRD-PARTY-LICENSE)
was also read in memory, SHA-256
`77643247a04db72198cea3c8b73751091821b4d51b5448fd65501127a9db5111`.
It supplies attributable MIT, Apache, BSD and ISC notices for copied/derived material.
The TSV links each component manifest/hash plus these actual terms. This is exact source-release
identity and grant evidence; source-release-to-published-crate-byte attestation remains `NOT-RUN`.
The release tree separately lists `crates/oxc_react_compiler/LICENSE`; that crate is not a locked
`0.151.0` identity in this inventory and its separate grant is not claimed assessed here.

Docs.rs legal text hashes are SHA-256 of the HTML-decoded, syntax-markup-stripped source code
block encoded as UTF-8, preserving displayed whitespace. Canonical raw publisher hashes are
of their UTF-8 HTTP response text. They are reproducible evidence fingerprints, not crate/archive
hashes or signatures. No upstream text/source/archive was imported into IDEA. The source/legal
responses existed only in memory; retained files contain first-party research and evidence
summaries. The [first-party probe](rolldown-grant-probe-20261006.ps1) and
[Oxc source probe](rolldown-oxc-source-probe-20261006.ps1) document the bounded procedure.

## Current-use disposition and concrete obligations

Under the user's authority, the 81 verified external rows support
`APPROVED-WITH-OBLIGATIONS` for the identified commercially usable material in current internal
tool use. This is an evidence-backed proposed intake projection, not external Legal Review
approval or whole-T036 acceptance. Engineering intake owns the following compliance actions:

| Verified grant/material | Current-use action | Delivery/modification review trigger |
|---|---|---|
| MIT | Keep copyright, permission notice and disclaimer associated with copies/substantial portions of the tool | Preserve the complete texts in any later supplied tool/source/binary copy |
| Apache-2.0 | Retain license and relevant supplied notices; observe patent-termination conditions and trademark limits | If copies/derivatives are supplied, include license/NOTICE attribution, preserve required source notices and mark modifications |
| ISC | Retain copyright and permission notice with copies; preserve supplied disclaimer | Any later redistribution repeats notice handling |
| Unlicense election | Preserve supplied license/disclaimer and evidence of the publisher's dedication/permissive alternative | Recheck jurisdiction/use or material changes; do not infer patent or trademark rights beyond supplied terms |
| Oxc supplied copied-material notice set | Keep the named third-party notice set alongside the Oxc source-grant evidence; MIT parent does not erase Apache/BSD/ISC notices | Any later native tool/source delivery requires full notice bundle, Apache modification handling and BSD non-endorsement compliance where applicable |

Known reciprocal or custom obligations are not automatically `BLOCKED-LEGAL`. No actual
commercial-use prohibition was established by this probe. Conversely, root MIT and internal
build classification do not create rights for external material whose grant has not yet been
established. The 271 unmatched external exact identities remain `COVERAGE-UNKNOWN`, not a
fabricated legal rejection. They are explicitly enumerated by the TSV's `UNKNOWN` rows, including
binding-union membership. Supplemental shared-family research can supersede specific rows only
with exact identity and actual grant evidence.

## Access limits, verification and bounded conclusion

Successor author review on closure publication corrected adler2's broad automated ISC matcher:
LICENSE-0BSD is retained as an unclassified observation, not selected ISC. The actual complete
Apache-2.0 alternative already observed for the same exact version is selected. Hashes and
81-row grant count unchanged; no new fetch/rerun inferred. Task closure follows the separate
[bounded current-use receipt](2026-10-06-t036-bounded-closure.md), not exhaustive coverage PASS.

The initial concurrent source/legal probe encountered HTTP429 for 214 exact source listings;
additional legal-file attempts also failed and are recorded by exact path. Those are source
access limits, not evidence that a grant is missing. The initial script collected results only
at the end, so already queued work continued after the host began refusing requests. No retry
of that docs.rs batch was run. The retained first-party script now throttles to two requests
and shares a circuit breaker: the first HTTP429 stops further queued host requests. The initial
line-sensitive MIT matcher was corrected for future runs; no unobserved rerun result is claimed.
Canonical publisher source inspection supplied the 27 additional Oxc rows without bypassing
or retrying the blocked docs.rs host. Guessed Microsoft `0.62.2` tag URLs returned HTTP404;
no other version's grant was substituted for those unresolved identities.

Inventory/unique lock-edge parsing and actual legal-source reading: `PASS` within stated scope.
81 exact external grant matches: `ESTABLISHED`. Remaining component rights closure: `UNKNOWN`.
Complete target/feature compiled SBOM, upstream binary attestation, downstream license bundle
verification, automated document validator, external Legal Review and whole-T036 acceptance:
`NOT-RUN`.

The conservative inventory materially advances current-use assessment but does not establish
complete current-use rights coverage: 269 unresolved external identities remain in the binding
lock union. No absence of grant is alleged and none of them is called an actual compiled
blocker without selected-feature evidence. Future native redistribution is a distinct scope;
this note neither authorizes it nor makes it a prerequisite for already identified permissive
current-use rows. No package install/download, cache changes, execution/rebuild, database,
listener, verifier, product-code change, commit or push was performed.
