# Post-pull Architecture View Source and Rendition Record

## Control envelope

| Field | Recorded value |
|---|---|
| Stable Supporting Record ID | `IE-VEV-ARCH-CORR-004` |
| Supporting class / version / status | `VEV` / `0.1` / `Draft` |
| Date / operator | 2026-09-14 10:19 ICT / Principal Product Author in the local workspace |
| Owner / reviewer / acceptance authority | Principal Product Author; independent architecture, security, HCD and verification review `NOT-RUN`; Product Decision Authority acceptance `NOT-RUN` |
| Product normativity | `INFORMATIVE` source/rendition evidence only; no new requirement or architecture approval |
| Repository process authority / instruction state | `NOT-APPLICABLE` / `NOT-APPLICABLE` |
| Applicable baseline | `IDEA-C1-ANALYSIS-DESIGN-001`; DOC-05@0.19 and DOC-06@0.16 |
| Exact rendered working-copy source | DOC-05 SHA-256 `34c085c6d02b0019a7fdf0a251b1d21aef54e38659fe4552a3e4c3c4b1609843`; DOC-06 SHA-256 `11db41f439cb801fc510ac1f959340d1435df5e25d8096862bb05169c76c9a93` |
| Portable committed-source pin | DOC-05 LF-normalized SHA-256 `25a8c6fb5ba780b5163389c42b7ae4e95d8b41ba91aed13834e7f69f43cb827e`, Git blob `7356d8d533509af2978d0ea3d1ecefc7a08c6f16`; DOC-06 LF-normalized SHA-256 `6a86fbe5ada75b743f29619a5ce3107df8a271e239a8015cd9681eddf21c258d`, Git blob `482f866d39d94c60a1d9478b91ca7b8347f19157` |
| Source / upstream trace | [IE-CHG-DOC-REVIEW-001](CHG-2026-09-14-post-pull-document-review-corrections.md), [DOC-04](../DOC-04-software-requirements-specification.md), [previous VEV-003](VEV-2026-09-12-architecture-consistency-correction-003.md) |
| Downstream trace | [current gallery](../evidence/IE-VEV-ARCH-CORR-004/index.html), [render manifest](../evidence/IE-VEV-ARCH-CORR-004/render-results.json), [instance catalogue](../README.md), future management renditions |
| Access / retention | `INTERNAL`; retain with exact Markdown sources, generated SVG/PNG, manifest and the predecessor audit |
| Supersession / review trigger | Supersedes VEV-003 **for the current source/rendition baseline only**; predecessor assertions remain historical. Rerender under a new ID after any maintained view-source change. |
| Evidence status | Focused rendering and XML parsing recorded below; standalone browser-open sweep and full repository verifier `NOT-RUN`; qualified review and controlled-rendition acceptance `BLOCKED` |

## 1. Method and observed result

The existing `scripts/render-architecture.cjs` rendered the Mermaid blocks in the exact
DOC-05/DOC-06 source files above into the new, previously absent evidence folder
`IE-VEV-ARCH-CORR-004`. The run used Mermaid 11.12.0 and Chrome 152.0.7977.83 at
`2026-09-14T03:19:29.279Z`. The renderer hashes the local working-copy bytes, which may have CRLF
line endings on Windows; the separate LF-normalized hash and staged Git blob above make the
committed text reproducible across checkout settings. The manifest records 30 distinct View IDs,
each with a non-empty
`accTitle` and `accDescr`, 30 SVGs, 30 PNGs and their SVG SHA-256 values. All 30 generated SVGs
were subsequently parsed as XML without error. This is a focused source/rendition check, not the
repository verifier or an IDEA runtime test.

| Check | Actual result | Boundary |
|---|---|---|
| Source hash against rendered manifest | `PASS` for the exact DOC-05@0.19 and DOC-06@0.16 byte streams above | A later source edit requires a new rendition. |
| Mermaid inventory and render | `PASS`, 30/30 views | Rendering does not prove architecture correctness. |
| Standalone SVG XML syntax | `PASS`, 30/30 files parsed | Full browser-file opening sweep `NOT-RUN` in this correction. |
| Author inspection of changed views | `ARCH-VIEW-SEQ-003` and `ARCH-VIEW-ACT-001` viewed as actual generated PNGs | The long sequence and activity require zoom/full-size SVG links; they are not accepted as small inline figures. |
| Independent architecture/security/HCD review and final management layout | `BLOCKED` / `NOT-RUN` | No qualified reviewer or final controlled DOCX/PDF check is claimed. |

## 2. Changed-view disposition

| View | Source correction | Rendition |
|---|---|---|
| [ARCH-VIEW-SEQ-003](../evidence/IE-VEV-ARCH-CORR-004/ARCH-VIEW-SEQ-003.svg) | Submit and Approve/Reject each establish ActorContext, evaluate current authorization, revalidate at commit and retain Lifecycle-owned outcome plus Audit evidence. Release still validates the separately confirmed exact scope. | Rendered and XML-parseable; high-resolution SVG link required for review because 12 participants and refusal branches do not fit legibly in a narrow Word column. |
| [ARCH-VIEW-ACT-001](../evidence/IE-VEV-ARCH-CORR-004/ARCH-VIEW-ACT-001.svg) | A Project Administrator confirms an existing Group assignment or explicitly requests one under delegated Role/Principal/Scope limits. Access Policy validates and records/refuses it; it does not initiate the assignment. | Rendered and XML-parseable; full-size view required because the authority lanes are tall. |

The remaining 28 maintained views were regenerated from the same source baseline; no claim of a
fresh independent semantic inspection is made for those views. The prior VEV-003 manifest's DOC-05
and DOC-06 source hashes do not reproduce from the committed starting baseline. That record is
retained rather than silently rewritten, but this new exact-source manifest is the one to use for
current navigation and discussion. The seven XML-repaired files in the older VEV-VIEW-001 folder
have a separate [repair note](../evidence/IE-VEV-ARCH-VIEW-001/README.md); they are not current
architecture views.

## 3. Remaining acceptance work

`VVP-016` qualified architecture/security/HCD review, final rendition acceptance and product
verification remain open. This author evidence does not turn any Product Decision Authority
decision, PG gate, implementation result or operational qualification into `PASS`.
