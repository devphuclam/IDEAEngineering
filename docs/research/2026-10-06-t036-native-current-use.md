# T036 native tooling: current-use rights versus compiled-component coverage

| Control | Value |
|---|---|
| Stable ID / class / version | IE-RES-T036-NATIVE-20261006-003 / RESEARCH-EVIDENCE / 0.1 |
| Status / evidence | Draft; exact publisher grants and current-use obligations assessed; full native compiled SBOM NOT-ESTABLISHED |
| Normativity / instruction state | INFORMATIVE / NOT-APPLICABLE; applies the user's T036 comply-and-use decision, not a new license grant |
| Owner / author / reviewer | Engineering intake / Codex delegated research worker / Project Reviewer |
| Baseline / evidence date | T036, PR38; predecessor reconciliation e25b237; 2026-10-06 Asia/Ho_Chi_Minh |
| Classification / retention | INTERNAL; retain with exact native intake and applicable license texts |
| Upstream / downstream | [Correspondence](2026-10-06-t036-native-correspondence.md), [delivery-scope research](2026-10-06-t036-native-delivery-scope.md), latest user T036 decision / [closure matrix](../../specs/005-ph1-foundation-custody/evidence/PH1-T036-closure-matrix.md) |
| Change / supersession | Successor current-use interpretation; preserves predecessor observations and historical dispositions |
| Trigger / tailoring | Version, hash, features, native modifications or actual delivery drift; STD-INFO-001, ISO/IEC/IEEE 15289:2019 STANDARD-GUIDED; no conformity or external Legal Review claim |

## 1. Current-use oracle

The [actual platform projection](inventories/ph1-web-platform-projection-20261006.tsv)
classifies the exercised Windows x64 and Ubuntu x64 GNU native tools as Web build tooling.
The six package/archive/native hashes remain pinned in the correspondence record; this
successor performs no new byte comparison. No retained application payload demonstrates
delivery of these native binaries or node_modules to product recipients. Generated Web runtime
code is a separate notice projection, not automatically a copy of the build executable.

The current user decision admits commercially usable components with their actual obligations.
Reciprocal classification alone is not a BLOCKED-LEGAL condition. Internal use still requires
an applicable grant: absence of external delivery cannot create rights for unidentified code.

## 2. Exact rights and obligations actually established

| Exact material | Direct rights evidence | Current obligation / disposition under user authority |
|---|---|---|
| Rolldown 1.2.11 publisher-owned source, binding crate and supplied Rollup/esbuild-derived notices | [Root MIT grant](https://raw.githubusercontent.com/rolldown/rolldown/8df421985114ecfaf52cce038d4a5a6ea8c05408/LICENSE) and [exact third-party text](https://raw.githubusercontent.com/rolldown/rolldown/8df421985114ecfaf52cce038d4a5a6ea8c05408/THIRD-PARTY-LICENSE); exact build/package bridge in predecessor | APPROVED-WITH-OBLIGATIONS for the identified material: retain copyright, grant and disclaimers with tool copies. Parent LICENSE and THIRD-PARTY-LICENSE are retained and hashed; platform-native absence of a separate legal file does not erase the publisher grant. Do not replace external crate terms with parent MIT. |
| LightningCSS 1.33.0 covered publisher/source material and identified local selectors subtree | [Exact root MPL-2.0](https://raw.githubusercontent.com/parcel-bundler/lightningcss/c6a0c3cebf3395635e61075d2c81a96a710d4910/LICENSE), [selectors LICENSE](https://github.com/parcel-bundler/lightningcss/blob/c6a0c3cebf3395635e61075d2c81a96a710d4910/selectors/LICENSE) | APPROVED-WITH-OBLIGATIONS for identified covered material; preserve supplied MPL notices/disclaimers. Section 2 grants use/exploitation, including commercial rights. Section 3 scopes source/executable distribution duties to covered software; no new outside-organization distribution is established here. |
| TypeScript native 7.0.2 | Exact typescript-go commit, Apache grant and supplied multi-component NOTICE already inspected and hashed in correspondence | APPROVED-WITH-OBLIGATIONS for identified source/package material and supplied notice set. Retain LICENSE/NOTICE; source correspondence is established, reproducibility/signature verification remains NOT-RUN. Do not restate that as full independent compiled SBOM qualification. |

[Mozilla's MPL FAQ Q5/Q6](https://www.mozilla.org/en-US/MPL/2.0/FAQ/) expressly distinguishes
using MPL software, including company use, from distribution outside the organization; internal
modification/distribution does not trigger its external-distribution responsibilities. This
steward guidance corroborates, rather than replaces, the exact license. It does not address
non-MPL external crate rights.

## 3. What remains unknown, and what does not follow

Full target/feature-selected compiled Rust dependency coverage for Rolldown and LightningCSS
has not been established. The delivery-scope note identifies source roots, selected features
and example locked external identities such as cssparser 0.37.0, parcel_sourcemap 2.1.1,
rayon 1.10.0 and napi 2.16.13; it does not inspect every applicable external grant.

This is a bounded engineering inventory/rights-coverage limitation, not evidence of a
commercial-use prohibition or a reason to replace MPL tooling. Nor can this note assert that
every unidentified compiled component is covered by the publisher's MIT/MPL grant. A complete
native redistribution packet remains a future-delivery concern; knowing which applicable
rights permit present use is not exclusively a future concern.

Under the new authority, do not retain a blanket BLOCKED-LEGAL disposition for known MIT/MPL
material merely because the compiled SBOM is incomplete. Any specific remaining BLOCKED-LEGAL
row needs an identified unresolved grant, contradictory term, prohibited use or unaccepted
mandatory obligation. Where the component subset itself is unknown, retain coverage UNKNOWN
and do not invent a specific missing grant or claim complete coverage PASS.

## 4. Smallest bounded resolution and qualification limit

For identified known-term rows, record APPROVED-WITH-OBLIGATIONS and the retained texts now.
For remaining compiled-subset coverage, Engineering can request exact publisher component/legal
evidence, or reference-only inspect exact-source target/feature manifests recursively and the
corresponding actual component grant texts. A conservative all-lock inventory may support
current rights assessment but must be labelled a superset, not an actual compiled SBOM.
Neither a new Rust installation nor a native rebuild is inherently required to read grants.

If the T036 reviewer accepts current-use package-level publisher evidence with this explicit
coverage limitation, record that bounded acceptance rather than claim all external Rust grants
were inspected. If exhaustive component-rights closure is required now, this note does not
satisfy it. No future native tool distribution, general commercial readiness, full SBOM,
legal opinion, test execution or whole-T036 acceptance is asserted.

## 5. Method and verification

Read predecessor research, current inventories and intake rules; reference-only read exact
Rolldown/MPL source licenses and Mozilla steward FAQ on 2026-10-06. Source inspection PASS
for the specifically cited root grants. Full compiled-subset grant inventory UNKNOWN;
artifact distribution changes NOT-RUN. No downloads, installs, package execution, cache writes,
build, database, preview, listener, verifier, commit or push performed by this worker.
