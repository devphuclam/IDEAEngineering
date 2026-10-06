# T036 common Rust family grants: exact publisher source followup

| Control | Value |
|---|---|
| Stable ID / class / version | IE-RES-T036-SHARED-GRANTS-20261006-001 / RESEARCH-EVIDENCE / 0.1 |
| Status / normativity / instruction state | Draft / INFORMATIVE / NOT-APPLICABLE |
| Owner / author / reviewer / acceptance | Engineering intake / Codex delegated common-family researcher / Project Reviewer, NOT-RUN / Product Decision Authority, NOT-RUN |
| Baseline / evidence date | T036; Rolldown `8df421985114ecfaf52cce038d4a5a6ea8c05408`; LightningCSS `c6a0c3cebf3395635e61075d2c81a96a710d4910`; 2026-10-06 |
| Classification / retention | INTERNAL / retain with native component intake; supersede on resolution or source drift |
| Upstream / downstream | [Current-use research](../2026-10-06-t036-native-current-use.md), [source scope](../2026-10-06-t036-native-delivery-scope.md), publisher lockfiles / [inventory](ph1-native-shared-grants-20261006.tsv), T036 reviewer consolidation |
| Change / supersession / trigger | New bounded followup; supersedes NOT-APPLICABLE; re-review exact source, lock, target, feature or distribution change |
| Standards tailoring / evidence | STD-INFO-001, ISO/IEC/IEEE 15289:2019 STANDARD-GUIDED; tailored research envelope; DIRECT-PUBLISHER-SOURCE-OBSERVATION plus explicitly bounded engineering interpretation; no conformity claim |

This reference-only investigation establishes exact-source grant text for 45 of 72 unique
common-family crate/version identities selected from both pinned Cargo.lock files. It records
27 identities with exact-source coverage UNKNOWN. It is a family-filtered conservative lock
superset, not either tool's compiled native software bill of materials. It excludes the Oxc
family handled by the other researcher. No blocked docs.rs host was accessed.

## Source evidence

The starting sources are the publisher [Rolldown lock](https://raw.githubusercontent.com/rolldown/rolldown/8df421985114ecfaf52cce038d4a5a6ea8c05408/Cargo.lock)
and [LightningCSS lock](https://raw.githubusercontent.com/parcel-bundler/lightningcss/c6a0c3cebf3395635e61075d2c81a96a710d4910/Cargo.lock).
The TSV carries every selected exact version, lock checksum, canonical repository, tag,
resolved source commit, crate manifest URL/hash and observed legal-text URL/hash. Git remote
tag refs were read in RAM; annotated tags were peeled to commits. Raw publisher manifests
at those immutable commits were checked for the exact crate version before marking a row
EXACT-SOURCE-GRANT-TEXT-OBSERVED. A matching tag name alone was insufficient.

The observed grants cover Serde/core/derive 1.0.228 and 1.0.229; serde_json 1.0.149 and
1.0.151; serde_bytes 0.11.15; proc-macro2 1.0.106 and 1.0.107; quote 1.0.37 and 1.0.47;
syn 1.0.109, 2.0.90, 2.0.119 and 3.0.6; anyhow 1.0.102 and 1.0.104; thiserror/impl
1.0.69 and 2.0.19; Rayon/core 1.10.0/1.12.1 and 1.12.0/1.13.0; seven Crossbeam
crate/version rows; nine N-API rows; windows-core 0.52.0 and windows-sys 0.59.0.
This is source-version correspondence, not a publisher attestation that a specific cached
binary contains every listed crate.

## Actual rights and current-use obligations

The inspected MIT texts grant unrestricted use, copying, modification, distribution,
sublicensing and sale, subject to retaining the copyright and permission notice and
disclaimers. The inspected Apache-2.0 texts contain both copyright and patent grants;
distribution carries section 4 license/notice and modification-marking duties, while
trademark rights remain separate. These findings come from actual fetched legal text,
including the exact [Serde source grants](https://github.com/serde-rs/serde/tree/7fc3b4c30c94f73a96ebd1553f2b090d928fc3a8),
[N-API combined MIT grant](https://raw.githubusercontent.com/napi-rs/napi-rs/39d38278d6b6b44e3cc99cdb97d6abfde46cd573/LICENSE),
and [Windows MIT grant](https://raw.githubusercontent.com/microsoft/windows-rs/308e08ec259027ebbef11b8ef838923626bf821e/license-mit).
The TSV links each actual legal file, rather than only a repository or metadata identifier.

The N-API LICENSE contains two MIT notice sets, LongYinan (2020-present) and GitHub (2018);
both need retention with relevant copies. Crossbeam names its Project Developers (2019);
Rayon's MIT text names the Rust Project Developers (2010); the Windows MIT text names
Microsoft Corporation. Several dtolnay/Serde legal files contain a complete grant without
a named copyright holder; the inventory explicitly records that observation rather than
inventing attribution. Apache appendix placeholders are marked as templates, not real
holder notices. This investigation did not inspect all source headers or separately
enumerate NOTICE files; preserve supplied component notice material in the existing
compliance workflow rather than treating this TSV as the whole distribution packet.

Under the user's accepted comply-and-use authority, the 45 exact-source grant rows are
APPROVED-WITH-OBLIGATIONS for identified current internal tooling use. Engineering intake
owns retaining the applicable complete grant/disclaimer and supplied copyright/notice
sets with tool copies, documenting the selected alternative where relevant, and reopening
delivery qualification before packaging native tools for recipients. No unfamiliar
commercial restriction was identified in these inspected MIT/Apache texts. Reciprocal
classification alone does not create a legal gate, and an inventory gap does not establish
a missing grant or commercial prohibition.

## Remaining coverage and verification

UNKNOWN rows include N-API derive backend 1.0.75, Serde derive internals 0.29.1/0.30.0,
serde_yaml 0.9.34+deprecated, serde-content 0.1.2, serde-detach 0.0.1 and 21 Windows
family identities. The Windows publisher does not provide matching individual tags for
many locked patch versions. A broad release tag can also name a different manifest
version: windows-numerics 0.3.1's superficially matching root tag lacked that crate's
manifest. Its old root grant is recorded as a fetched text observation, but its row
remains UNKNOWN; it is not used to establish rights for that exact crate.

Some legal-file probes returned 404 (for example, an Apache alternative for the two
verified Windows rows). The existing complete MIT text suffices to document the MIT
grant, while the failed probe is retained. A 404 does not prove the publisher lacks all
alternative grants. No nonmatching current/main grant was substituted for unresolved
identities. Unknown rows require exact publisher commit/manifest/legal correspondence or
reuse of already retained exact-package evidence by the consolidating reviewer. This
followup does not invalidate earlier exact-package evidence.

PASS: both lock identities parsed; 72 unique names/versions retained; 45 exact-version
manifests and attributable grant texts inspected and hashed; TSV uniqueness and required
evidence fields checked. UNKNOWN: complete family grant coverage and target/feature
compiled subset. NOT-RUN: archive byte correspondence, binary attestation, native build,
distribution packet verification, full source-header/NOTICE sweep, repository document
validator and overall T036 acceptance.

Hashes identify SHA-256 of UTF-8 encoding of the decoded HTTP text (with its observed
line endings), not a package archive checksum or independently authenticated raw payload
digest. Lock checksum values are observed lock metadata, not archive verification.
Only derived evidence summaries and the [reproduction probe](ph1-native-shared-grant-probe-20261006.ps1)
were written locally. No upstream source/legal text, archive, cache, installation or
native executable was retained or executed; no commit or push was performed.
