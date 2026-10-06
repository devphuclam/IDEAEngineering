# T036 Rolldown 1.2.11 source rights and native binding provenance

| Control field | Value |
|---|---|
| Stable Research ID | `IE-RES-T036-ROLLDOWN-20261006-001` |
| Class / version / status | `RESEARCH-EVIDENCE` / `0.1` / `Draft` |
| Product normativity | `INFORMATIVE`; no product requirement, intake approval or execution authority |
| Repository process authority / instruction state | `NOT-APPLICABLE` / `NOT-APPLICABLE` |
| Owner / author | Engineering intake owner `UNKNOWN`; Codex delegated research agent |
| Reviewer / acceptance authority | Project Reviewer review `NOT-RUN`; Legal Review Authority acceptance `NOT-RUN` |
| Applicable baseline | T036, branch `codex/f05a-t027-preflight`; exact candidate version `1.2.11` |
| Evidence / retrieval date | `2026-10-06`; read-only official publisher pages and existing local package files |
| Classification / retention | `INTERNAL`; retain with T036 and dependency intake evidence |
| Upstream trace | [External Source and License Intake](../agents/external-source-intake.md); [authoring standard](../agents/product-document-authoring-standard.md) |
| Downstream trace | [PH1 T036 review](../../specs/005-ph1-foundation-custody/evidence/PH1-license-review.md); [local legal-file inventory](inventories/ph1-web-local-legal-files-20261006.tsv) |
| Change / supersession | Initial research record; predecessor and successor `NOT-APPLICABLE` |
| Review trigger | Candidate version/artifact, source identity, usage/distribution model, notice evidence or authority changes |
| Evidence status | `OFFICIAL-RELEASE`, `EXACT-TAG-SOURCE`, `OFFICIAL-LICENSE-TEXT`, `LOCAL-OBSERVATION`; binary-source attestation and full transitive rights closure `UNKNOWN` |

Control tailoring: this research note uses the information-item identity, evidence chain, baseline,
review and retention controls of `IE-STD-AUTH-001@0.2`. Standards applicability is
`STD-INFO-001`, ISO/IEC/IEEE 15289:2019, `STANDARD-GUIDED`; no conformity claim. It is an
evidence input to a controlled dependency intake, not the intake decision itself.

## Exact source and scope

The material under examination is existing `rolldown@1.2.11` and
`@rolldown/binding-win32-x64-msvc@1.2.11`, plus the matching Linux GNU candidate
`@rolldown/binding-linux-x64-gnu@1.2.11`. Intended-use classification is `DEPENDENCY`
for the already recorded internal Web build/test tooling; later product distribution qualification
is outside this note. Research itself is `REFERENCE-ONLY`: no upstream source, license text or
binary is imported by this note.

S1 is the publisher's [v1.2.11 release](https://github.com/rolldown/rolldown/releases/tag/v1.2.11),
dated 2026-09-24. Its linked [release commit](https://github.com/rolldown/rolldown/commit/8df421985114ecfaf52cce038d4a5a6ea8c05408)
is `8df421985114ecfaf52cce038d4a5a6ea8c05408`. Canonical publisher/source authority is
`rolldown/rolldown`, with the copyright holder stated in S2. All sources below were accessed
2026-10-06 and refer to tag `v1.2.11`, rather than current `main` or another version.

## Evidence claims

| Claim | Direct evidence and limits |
|---|---|
| R1 — Exact upstream rights text exists | S2: the [LICENSE at v1.2.11](https://github.com/rolldown/rolldown/blob/v1.2.11/LICENSE) supplies an MIT grant from VoidZero Inc. & Contributors, copyright 2024-present. The grant permits use, modification, distribution, sublicensing and sale, subject to retaining copyright and permission notices in copies or substantial portions; warranty/liability disclaimers apply. This is actual terms evidence, beyond a metadata identifier. |
| R2 — Exact parent package and native target identity | S3: [packages/rolldown/package.json at v1.2.11](https://raw.githubusercontent.com/rolldown/rolldown/v1.2.11/packages/rolldown/package.json) identifies `rolldown` version `1.2.11`, `@rolldown/binding`, the binary name and both `x86_64-pc-windows-msvc` / `x86_64-unknown-linux-gnu` targets. It lists LICENSE and THIRD-PARTY-LICENSE in parent package files. Platform package manifests are generated, so these declarations alone do not establish the actual bytes of a published platform artifact. |
| R3 — Explicit bridge to the licensed native source | S4: [build-binding.ts at v1.2.11](https://raw.githubusercontent.com/rolldown/rolldown/v1.2.11/packages/rolldown/build-binding.ts) names `../../crates/rolldown_binding/Cargo.toml` as the build manifest and `rolldown_binding` as the build package. S5: [binding crate manifest](https://raw.githubusercontent.com/rolldown/rolldown/v1.2.11/crates/rolldown_binding/Cargo.toml) declares a `cdylib` and inherits workspace licensing. S6: [workspace Cargo.toml](https://raw.githubusercontent.com/rolldown/rolldown/v1.2.11/Cargo.toml) declares MIT. S2 supplies the actual grant for that exact source state. |
| R4 — Exact Windows and Linux package names/version expectation | S7: [generated loader at v1.2.11](https://raw.githubusercontent.com/rolldown/rolldown/v1.2.11/packages/rolldown/src/binding.cjs), lines 131–141 and 288–298, explicitly loads the MSVC Windows package and GNU Linux package, respectively; both branches expect version `1.2.11`. This proves release-source identity of the Linux candidate; registry publication, archive contents and historical Linux execution were not inspected. |
| R5 — Additional upstream notices exist | S8: [THIRD-PARTY-LICENSE at v1.2.11](https://raw.githubusercontent.com/rolldown/rolldown/v1.2.11/THIRD-PARTY-LICENSE) contains MIT notices for Rollup contributors (2017) and Evan Wallace (2020). The existing local parent package contains the same named notices. S5 lists additional Rust dependencies; S8 is not evidence that every compiled dependency's notices have been qualified. |
| R6 — Existing local Windows cache observation | Read-only inspection of primary checkout `apps/web/node_modules/rolldown/package.json`, LICENSE and THIRD-PARTY-LICENSE identifies `1.2.11` and corresponding parent notices. The native Windows package manifest identifies `1.2.11`, MIT and this publisher repository; its directory contains package.json, README.md and the `.node` binary, with no LICENSE/LICENCE/NOTICE file. Local metadata corroborates identity; it does not replace S2 or attest binary provenance. See the linked inventory for retained hashes. |

## Interpretation and disposition limits

R1–R4 establish an attributable exact-version source grant for the project's native binding source
and a documented path to the named Windows/Linux packages. The earlier claim that native rights
evidence consists only of a local MIT metadata field can therefore be refined: exact upstream
license text and source/build/package correspondence are now available.

The conclusion that a particular installed `.node` binary was built from this source is an
inference, not a verified publisher attestation. An exact binary-to-release/source attestation or
published digest comparison is `UNKNOWN`; no archive, registry or new artifact was accessed.
Full Rust/transitive notice mapping is `UNKNOWN`, and packaging compliance verification is
`NOT-RUN`. The absent native-package license file remains a packaging/notice issue to evaluate;
it neither proves absence of an upstream grant nor proves notice compliance.

Research outcome: `SOURCE-RIGHTS-EVIDENCE-ESTABLISHED` for the exact native source and matching
release-source package identities. Complete binary/dependency intake disposition remains
`BLOCKED` pending the accountable intake owner's provenance and notice-closure decision. No
legal waiver, commercial clearance, new import/build authorization or T036 completion is supplied.

## Verification record

Official release, license and exact-tag source inspection: `PASS` for R1–R5 as stated. Existing
local file inspection: `PASS` for R6 as stated. Searches for the generated platform package manifest
at `packages/rolldown/npm/win32-x64-msvc/package.json` and a guessed release workflow returned
404; the GitHub tree/API views were inaccessible through the web reader. Those retrieval failures
are not evidence that a release or grant is missing. Binary execution, installs, registry access,
archive retrieval, native digest-to-publisher comparison, automated document validation and legal
acceptance: `NOT-RUN`. No source/license text was copied into the repository.
