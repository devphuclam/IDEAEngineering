# T036 native tooling: selected source paths and delivery-scope closure

| Control | Value |
|---|---|
| Stable ID / class / version | IE-RES-T036-NATIVE-20261006-002 / RESEARCH-EVIDENCE / 0.1 |
| Status / result | Draft; bounded source-path investigation COMPLETE; full compiled native component/notice coverage UNKNOWN |
| Normativity / instruction state | INFORMATIVE / NOT-APPLICABLE; no legal admission or execution authority |
| Owner / author / reviewer | Engineering intake / Codex delegated research worker / Project Reviewer; Legal Review acceptance NOT-RUN |
| Baseline / evidence date | T036, PR38 reconciliation e25b237; 2026-10-06 Asia/Ho_Chi_Minh |
| Classification / retention | INTERNAL; retain exact source references and limits with native intake |
| Upstream / downstream | [Native correspondence](2026-10-06-t036-native-correspondence.md), [intake](../agents/external-source-intake.md) / [T036 matrix](../../specs/005-ph1-foundation-custody/evidence/PH1-T036-closure-matrix.md) |
| Change / supersession | Successor scope investigation; supplements, does not overwrite, IE-RES-T036-NATIVE-20261006-001 |
| Trigger / tailoring | Version, target, feature, delivery or rights drift reopens review; STD-INFO-001 / ISO/IEC/IEEE 15289:2019 STANDARD-GUIDED; no conformity claim |

## 1. Question, method and bounded answer

Can existing cache identity and official source recipes establish a complete compiled Rust
dependency-to-notice closure without new crate acquisition or a native rebuild? **No complete
closure is established by this investigation.** It does establish the correct source roots,
features, target exclusions and concrete missing evidence. Unknown coverage is not proof that
a license grant is absent, and is not a fabricated blanket commercial prohibition.

The six native byte/cache/lock comparisons remain the predecessor observations. This successor
does not rerun or revise them. New inspection is REFERENCE-ONLY: official tag files and GitHub
tree/release metadata, plus read-only existence checks for local Cargo caches. No upstream
text/archive entered IDEA, no package was installed or executed, and no build was run.

Official tag references resolved on this date to Rolldown
`8df421985114ecfaf52cce038d4a5a6ea8c05408` and LightningCSS
`c6a0c3cebf3395635e61075d2c81a96a710d4910` through their publisher Git ref APIs.
These are source identities, not publisher attestations for the cached binary.

## 2. Selected source paths and exclusions

| Exact source / observed fact | Engineering inference and limitation |
|---|---|
| Rolldown [release build](https://github.com/rolldown/rolldown/blob/8df421985114ecfaf52cce038d4a5a6ea8c05408/.github/workflows/reusable-release-build.yml) names Windows MSVC x64 and Linux GNU x64 targets. [build-binding.ts](https://github.com/rolldown/rolldown/blob/8df421985114ecfaf52cce038d4a5a6ea8c05408/packages/rolldown/build-binding.ts) selects `rolldown_binding` and its Cargo manifest | Correct investigation root is the binding crate, not every workspace member or the browser/WASM deliverable. The recipe alone does not authenticate the cached publication |
| Rolldown [binding manifest](https://github.com/rolldown/rolldown/blob/8df421985114ecfaf52cce038d4a5a6ea8c05408/crates/rolldown_binding/Cargo.toml) enables `rolldown` experimental support, lists N-API/Oxc/local crates and selects mimalloc by target | Windows and Linux allocator feature selections differ; default optional tracking allocator is not inferred enabled. Parent MIT does not replace external dependency terms |
| LightningCSS [build recipe](https://github.com/parcel-bundler/lightningcss/blob/c6a0c3cebf3395635e61075d2c81a96a710d4910/scripts/build.js) runs N-API build with Cargo root `node`; [node manifest](https://github.com/parcel-bundler/lightningcss/blob/c6a0c3cebf3395635e61075d2c81a96a710d4910/node/Cargo.toml) selects `lightningcss-napi` bundler/visitor and N-API compat mode | Correct native root is `lightningcss_node`, not CLI or every workspace crate. macOS-only jemallocator in this root is excluded for the exercised Windows/Linux pair |
| LightningCSS [N-API manifest](https://github.com/parcel-bundler/lightningcss/blob/c6a0c3cebf3395635e61075d2c81a96a710d4910/napi/Cargo.toml) enables nodejs/serde and bundler crossbeam/rayon; [root manifest](https://github.com/parcel-bundler/lightningcss/blob/c6a0c3cebf3395635e61075d2c81a96a710d4910/Cargo.toml) supplies default bundler/nodejs/sourcemap | Optional CLI, browser-list/schema and developer/test paths cannot all be called binary payload merely because they exist in Cargo.lock. The selected features still require recursive component/terms mapping |
| [parcel_selectors source manifest](https://github.com/parcel-bundler/lightningcss/blob/c6a0c3cebf3395635e61075d2c81a96a710d4910/selectors/Cargo.toml) identifies the Servo-derived local crate; its [actual LICENSE](https://github.com/parcel-bundler/lightningcss/blob/c6a0c3cebf3395635e61075d2c81a96a710d4910/selectors/LICENSE) is present | Attributable MPL text for this local subtree is established; external cssparser/sourcemap/rayon/N-API terms are not substituted by that text |

The exact [LightningCSS lock](https://github.com/parcel-bundler/lightningcss/blob/c6a0c3cebf3395635e61075d2c81a96a710d4910/Cargo.lock)
records cssparser 0.37.0, parcel_sourcemap 2.1.1, rayon 1.10.0 and napi 2.16.13,
among other dependency and build/test rows. These example identities narrow the missing
evidence; they do not assert the complete compiled subset or elect license alternatives.
The [Rolldown lock](https://github.com/rolldown/rolldown/blob/8df421985114ecfaf52cce038d4a5a6ea8c05408/Cargo.lock)
is likewise a resolution input, not a delivered-license bundle.

## 3. Search result and exact remaining evidence

Publisher recursive tree metadata was inspected for LICENSE/NOTICE, SBOM, `about.toml` and
`deny.toml` paths. Rolldown returned root LICENSE, THIRD-PARTY-LICENSE and two test-fixture
license paths. LightningCSS returned root LICENSE and selectors/LICENSE. This bounded search
found no complete native SBOM/notice manifest; it is not a universal claim that none exists.
The [Rolldown release asset list](https://api.github.com/repos/rolldown/rolldown/releases/tags/v1.2.11)
contained three platform debug-information archives, not such a manifest. The
[LightningCSS release asset list](https://api.github.com/repos/parcel-bundler/lightningcss/releases/tags/v1.33.0)
was empty. No release asset was downloaded. Local Windows `.cargo/registry/src` and
`.cargo/registry/cache` did not exist; this does not claim absence on every machine.

The smallest defensible redistribution-coverage packet still needs:

1. Publisher evidence linking these exact binary/package identities to selected native
   target/feature component versions, or an independently controlled equivalent map.
2. Actual grant/copyright/notice text for that selected recursive subset, including local
   derived code, generated/copied content and target-specific native libraries.
3. Delivery obligations mapped to the proposed distribution model; any source availability,
   notice retention or alternative-license election reviewed by the accountable authority.

A conservative all-lock inventory can be useful research, but cannot be described as the
actual shipped subset. Rebuilding cannot itself replace the missing rights texts. New crate
archives, Rust tooling or builds remain outside this read-only investigation.

## 4. Internal build-only use versus native redistribution

The existing actual-use matrix places these native components in **build tooling**, not the
delivered IDEA Web/Server/Gateway application payload. That classification matters: selling
an application built with a compiler does not itself show that the compiler binary was
redistributed. Conversely, packaging node_modules, a build image or a developer kit could
redistribute native tooling and reopen the delivery scope. No such broader delivery is admitted
by this note. Derived runtime code generated/copied into Web assets must remain separately
mapped; build-only classification is not an assertion that no generated runtime content exists.

The exact [MPL text](https://github.com/parcel-bundler/lightningcss/blob/c6a0c3cebf3395635e61075d2c81a96a710d4910/LICENSE)
distinguishes executable/source distribution obligations in section 3. This supports reviewing
the actual delivery boundary, not imposing a speculative external-distribution claim on the
historical internal build. It does not disposition every transitive component or constitute
company Legal Review approval. The Mozilla FAQ page reader did not expose the relevant body;
no FAQ statement is relied on here.

Recommended review split: accept source/cache/target correspondence only as established;
retain the actual internal-use authority and supplied texts; carry compiled native
redistribution coverage as an explicitly owned successor if native tooling is not delivered
in PH1. If the governing T036 oracle instead requires full native coverage now, this note
names the remaining evidence rather than falsely marking R36-02 or T036 PASS.

Engineering investigation complete within the authorized method. Whole T036 acceptance,
native redistribution approval and company legal disposition remain separate decisions.
No commit/push, Maven/npm execution, database, listener, deployment, verifier or timer action
was performed by this research worker.
