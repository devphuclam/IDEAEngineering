# P06 Recovery View Source and Rendition Review

## Control envelope

| Field | Recorded value |
|---|---|
| Stable Supporting Record ID | `IE-VEV-P06-DIAGRAM-001` |
| Class / version / status | `VEV` / `0.2` / `Reviewed` |
| Product normativity | `INFORMATIVE`; source/rendition evidence, not a recovery requirement or test result |
| Repository process authority / instruction state | `NOT-APPLICABLE` / `NOT-APPLICABLE` |
| Date / applicable baseline | 2026-09-24 / [DOC-05@0.23](../DOC-05-architecture-description.md) working-copy SHA-256 `a1d708943073838d6717e36b72ab255f3269c529190127c4975f150f19628c8f` |
| Owner / operator / reviewer | Principal Product Author / assistant renderer / focused author review plus Project Reviewer guided documentary acceptance; independent architecture, operations and security review `NOT-RUN` |
| Acceptance authority | Product Decision Authority for exact successor architecture; acceptance `NOT-RUN` |
| Source / upstream trace | [Change record](CHG-2026-09-24-p06-recovery-diagram-clarification.md), [diagram-method note](../../../../research/2026-09-24-p06-diagram-method-review.md), DOC-05 §§3.1–3.2 and 9.3–9.4, DOC-04 `REQ-OPS-003/004` and `REQ-IAM-004` |
| Exact source/render pin | [Render manifest](../evidence/IE-VEV-P06-DIAGRAM-001/render-results.json): working-copy source hash, per-diagram hashes, SVG/PNG hashes, renderer versions and dimensions; HEAD `d9948c5672b07eceef545d380a48aa9b055ab626` is provenance only and **does not contain these edits** |
| Downstream trace | [Two-view full-resolution gallery](../evidence/IE-VEV-P06-DIAGRAM-001/index.html), [standalone SVG check](../evidence/IE-VEV-P06-DIAGRAM-001/svg-open-results.json), [P06 final guided-review disposition](../../../../../specs/004-technical-pilot-readiness/evidence/P06-GUIDED-REVIEW-DISPOSITION-20260924.md) and later `VVP-013/014` execution |
| Supersession | Focused successor for `ARCH-VIEW-SEQ-011` only, plus new `ARCH-VIEW-ACT-003`; the rest of [IE-VEV-VAULT-XFER-002](VEV-2026-09-18-vault-transfer-diagram-review.md) remains the predecessor full-gallery evidence |
| Review trigger | Either source diagram, governing requirement, P06 procedure, renderer or source hash changes |
| Access / retention | `INTERNAL`; retain source, script, manifest, SVG/PNG and predecessor evidence |
| Evidence boundary | No software recovery, application/schema rollback, operational RTO/RPO, independent specialist review or PG3/PG4 result is established by this rendition. The separate P06 guided review accepts these views only for PH0 documentary use. |

## 1. Views and rationale

| View | Model kind and question | Why maintained separately |
|---|---|---|
| `ARCH-VIEW-SEQ-011` | UML Sequence: how is one approved coordinated set restored and checked before a named reopen decision? | It shows the participants, exact backup/restore exchange and independent security evidence after route selection. Its success response was corrected to follow the already-issued authorization. |
| `ARCH-VIEW-ACT-003` | UML-style Activity: after a failed release/migration, when does evidence permit forward repair, full recovery or neither? | It shows guarded route selection and the remain-restricted branch without adding another participant-heavy sequence. `SEQ-011` expands only the recovery branch. |

Mermaid is the editable notation/renderer, not a claim of formal UML tool interchange or ISO/IEC/IEEE
42010 conformance. Each view has a stable ID, explicit concern/audience/scope/exclusions/trace,
legend, accessible title/description and adjacent long description in DOC-05.

## 2. Focused checks

| Project view-review check | Result and limit |
|---|---|
| Inventory and identity | `PASS — SOURCE`: both IDs occur once as view headings; new `ACT-003` is registered in DOC-05 §3.1. DOC-05 now has 29 views; DOC-06 retains four. |
| Notation and syntax | `PASS — SOURCE/RENDER`: Mermaid 11.12.0 parsed both exact blocks. `SEQ-011` is a sequence; `ACT-003` uses guarded decision/merge flowchart notation under the declared UML-style Activity profile. |
| Source semantics | `AUTHOR REVIEW`: the corrected sequence return is after the named authorization; the activity does not let an unproven forward repair or incomplete recovery set reach reopening. This is not independent correctness approval. |
| Cross-view correspondence | `AUTHOR REVIEW`: the Activity recovery branch points to `SEQ-011`; both require exact evidence, Restricted Recovery Mode and an explicit named reopen decision. No old-binary-only schema rollback path appears. |
| Requirement and P06 trace | `PASS`; scope: P06 documentary use. Compared with `REQ-OPS-003/004`, `REQ-IAM-004`, `QRS-006`, `VVP-013/014` and P06 plan §2.5. Historical Step 1–3 evidence remains pinned to DOC-05@0.22; the final disposition separately reconciles and accepts DOC-05@0.23 without rewriting those records. |
| Accessibility and standalone rendition | `PASS — RENDER`: SVG contains title/description; both standalone files opened as SVG in Chrome with zero XML parser errors. PNGs are available for insertion/QA; full-resolution SVG is the review format. |
| Visual inspection | `PASS — FOCUSED AUTHOR QA`: inspected both final PNGs at full or scaled-to-screen resolution. Labels, arrowheads, guarded branches and safe terminal outcomes are visible; no clipping, overlap or crossing branch lines found. The Activity is intentionally tall (910×2379 px) so branches remain traceable; it is **not** a one-slide management simplification. The Sequence is 2250×1732 px. |

The [reproducible focused renderer](../../../../../scripts/render-p06-recovery-views.cjs) used
Mermaid `11.12.0` and Chrome `154.0.8037.57`; exact result hashes and timestamp are in the
manifest. It rendered only these two changed views, not another duplicate 33-view package.

### Per-view disposition at the exact source digest

| Required record | `ARCH-VIEW-SEQ-011` | `ARCH-VIEW-ACT-003` |
|---|---|---|
| Source document/version/hash | `IE-PROD-ARCH-001@0.23`; SHA-256 `a1d708943073838d6717e36b72ab255f3269c529190127c4975f150f19628c8f` | Same source/version/hash |
| Renderer and parse | Mermaid `11.12.0`, Chrome `154.0.8037.57`; `PASS` | Same renderer; `PASS` |
| Semantic / cross-view | Author review: success return follows named authorization; agrees with Restricted Recovery Mode and `ACT-003`. Project Reviewer accepted P06 documentary use; qualified independent review `NOT-RUN`. | Author review: guarded routes, common validation and safe restriction agree with `SEQ-011`. Project Reviewer accepted P06 documentary use; qualified independent review `NOT-RUN`. |
| Requirement / verification trace | Author review: `REQ-OPS-003/004`, `REQ-IAM-004`, `QRS-006`, `VVP-013/014`; independent check `NOT-RUN`. | Same trace plus P06 §2.5; independent check `NOT-RUN`. |
| Accessibility / rendition | `PASS` title, description, standalone SVG XML, PNG and full-image inspection; 2250×1732 px. | `PASS` same checks; 910×2379 px. |
| Reviewer/date/defects | Assistant focused author QA, 2026-09-24; contradictory final result corrected, no remaining visual defect observed. | Assistant focused author QA, 2026-09-24; new view, no visual defect observed. |
| Final controlled view disposition | `PASS`; scope: P06 documentary use. Product architecture acceptance and qualified independent review remain `NOT-RUN`. | `PASS`; same scope and limit. |

## 3. Disposition

Source/render `PASS` is limited to parsing, SVG/PNG production, standalone XML opening and focused
visual inspection. The Project Reviewer also accepted both views for P06 documentary use after the
DOC-05@0.23 reconciliation recorded in the final guided-review disposition. Independent
architecture/security/operations review, actual application/schema rollback and coordinated restore
remain `NOT-RUN`. This evidence cannot approve the successor architecture or create a product-gate
result.
