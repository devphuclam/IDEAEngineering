# Check-in Scope View Source and Rendition Review

## Control envelope

| Field | Recorded value |
|---|---|
| Stable Supporting Record ID | `IE-VEV-WS-SCOPE-001` |
| Class / version / status | `VEV` / `0.2` / `Draft` pre-approval rendition record |
| Product normativity | `INFORMATIVE`; source/rendition evidence, not a product requirement or test result |
| Date / applicable baseline | 2026-09-25 / DOC-05@0.24 working-copy SHA-256 `561adf492fec909a88d92574327f9b263f246832a1c67c0a1d43916412cc143b`; the linked [retained Mermaid block](../evidence/IE-VEV-WS-SCOPE-001/ARCH-VIEW-ACT-004.mmd) is the surviving exact diagram source, while the current DOC-05 is a later version |
| Owner / operator / reviewer | Principal Product Author / assistant renderer and focused author QA; Project Reviewer and independent architecture/HCD review `NOT-RUN` |
| Acceptance authority | At rendition time, Product Decision Authority policy and architecture acceptance `NOT-RUN`. The policy was later approved under [IE-CHG-PDA-APPROVAL-003](CHG-2026-09-25-pda-approval-checkin-scope.md); architecture acceptance remains `NOT-RUN` |
| Source / upstream trace | [Change record](CHG-2026-09-25-checkin-scope-decision-clarification.md), DOC-05 §§3.1–3.2/7.2, DOC-04 `REQ-WS-005/006/007/010/013`, architecture input §14 |
| Exact source/render pin | [Retained Mermaid source](../evidence/IE-VEV-WS-SCOPE-001/ARCH-VIEW-ACT-004.mmd) SHA-256 `bca5cd47882e37a88385ac924db5c172a1f58bb3a12e3662b96fe54d44cf1858`; [render manifest](../evidence/IE-VEV-WS-SCOPE-001/render-results.json): working-copy source, SVG and PNG SHA-256 values, renderer versions and dimensions; HEAD in the manifest is provenance only and does **not** contain these edits |
| 0.2 amendment | Retain the exact pre-approval Mermaid block and link the subsequent scoped policy approval. Original SVG/PNG and author QA remain unchanged. |
| Downstream trace | [Focused full-resolution gallery](../evidence/IE-VEV-WS-SCOPE-001/index.html), later policy review and `VVP-002/003` execution |
| Supersession | Focused successor for one new DOC-05 view only. Earlier full-gallery views and the separate P06 focused gallery remain historical evidence. |
| Review trigger | Source diagram, `REQ-WS-006`, policy disposition, renderer or source hash changes |
| Access / retention | `INTERNAL`; retain source, renderer, manifest, SVG/PNG and this record |
| Evidence boundary | No software Check-in, file-transfer, product-policy approval, qualified architecture review or PG3/PG4 result is established by rendering. |

## View and method

`ARCH-VIEW-ACT-004` is a UML-style Activity for one Check-in scope decision. Activity notation
was selected because the question is *which guarded path applies*, not the timing of client/server
messages (`ARCH-VIEW-SEQ-002`) or the state lifecycle of one OperationId
(`ARCH-VIEW-STATE-004`). Mermaid is the editable notation and renderer; this is not a claim of
formal UML interchange or ISO/IEC/IEEE 42010 certification. The view has one level of abstraction:
scan, classify, confirm, validate or refuse. The detailed rule, exact authority and exclusions sit
beside the image in DOC-05.

## Focused checks

| Check | Result and limit |
|---|---|
| Stable identity and catalogue | `PASS — SOURCE`: one `ARCH-VIEW-ACT-004` heading, one adjacent Mermaid block and one DOC-05 §3.1 catalogue row. The set now contains 30 DOC-05 views and four DOC-06 data views. |
| Notation and syntax | `PASS — RENDER`: Mermaid 11.12.0 parsed the exact Activity-style guarded flow. The source is retained in DOC-05 and rendered by [the focused script](../../../../../scripts/render-checkin-scope-view.cjs). |
| Requirement and cross-view correspondence | `AUTHOR REVIEW` at rendition time: unknown dependency scope blocks before any exclusion; with known scope, the required-dependency branch blocks under a labelled Draft default and the unrelated-change branch excludes only after new scope confirmation. No branch silently publishes unreserved changes. `ARCH-VIEW-SEQ-002` remains the publication path. `REQ-WS-006` governs; Product Decision Authority acceptance had not yet run for this pre-approval rendition. The later decision is recorded separately. |
| Accessibility and standalone rendition | `PASS — RENDER`: SVG has title and description; standalone SVG opened as SVG in Chrome with zero XML parser errors. The equivalent decision table and long description are adjacent to the source. |
| Visual inspection | `PASS — FOCUSED AUTHOR QA`: final PNG inspected at native size, 1024×2038 px. The unknown-dependency guard, subsequent branches, arrow direction, outcomes and reference to `ARCH-VIEW-SEQ-002` are legible; no clipping, overlapping text or crossing branch lines observed. This is a scrollable full-resolution view, not a one-slide management simplification. |

The render manifest records Chrome `154.0.8037.57`, exact hashes and timestamp. The source
document was a dirty working copy at render time; the recorded Git HEAD must not be used as a
substitute for its source hash.

## Disposition

Source/render/standalone-open and focused author visual QA `PASS` for this single pre-approval
Draft view. At that time, policy and architecture approval had not run. The policy was later
approved under `IE-CHG-PDA-APPROVAL-003`, with a new rendition in
[IE-VEV-WS-SCOPE-002](VEV-2026-09-25-checkin-scope-approved-policy-view-review.md).
Independent architecture/HCD review and application verification remain `NOT-RUN`.
