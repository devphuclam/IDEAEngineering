# Supporting Prototype Reports

For current product content, start with the [IDEA document catalogue](../product/instances/idea-engineering/README.md)
and its Feature/Spec/Tech briefs. For new Word work, follow the
[management-document guide](../agents/management-documents.md).

This directory contains the management copy currently in use and supporting review analysis.
These files are supporting material only. They do not replace
`CONTEXT.md`, accepted ADRs, the product-knowledge evidence, the eight Core Product Documents, or a
Spec Kit feature specification.

| File | Disposition | Permitted use |
|---|---|---|
| [IDEA_DDM_review.docx](IDEA_DDM_review.docx) | Current user-edited management copy | Present the current Feature/Spec and UI walkthrough. Preserve the user's manual wording and layout; do not regenerate or overwrite it without an explicit request. |
| [IDEA-DDM_Techstack.docx](IDEA-DDM_Techstack.docx) | Current user-editable Technology Stack presentation | Present the Technology Stack recommendation to management. It remains a supporting copy and does not record Product Decision Authority approval. Do not regenerate or overwrite it without an explicit request. |
| [Technology Stack recommendation v2 source](IDEA-Engineering-Core-v0-technology-stack-recommendation-v2.md) | Current supporting source | Retain the reviewed wording, glossary and standards trace used by the current Word presentation. TECH-001 remains the controlled technology decision brief. |
| [Technology Stack recommendation v1 source](IDEA-Engineering-Core-v0-technology-stack-recommendation.md) and [Word rendition](IDEA-Engineering-Core-v0-technology-stack-recommendation.docx) | Superseded presentation pair | Retained as predecessors from commit `f2174da`; do not use for the next management review because they predate the current navigation and glossary treatment. |
| [PDM Software Validation resolution note](PDM-Software-Validation-260815-2-resolution-note.md) | Current context-resolution note | Record how the differences in the supplied validation PDF were resolved and distinguish them from later Spec inputs or verification work. It is not a product requirement authority. |

The two obsolete Controlled Document Workspace reports were removed from the active directory on
09-09-2026 because they used old UI evidence and no longer represented the current review material.
They remain recoverable in the
[obsolete presentation archive](../product/instances/idea-engineering/history/2026-09-09-obsolete-presentation-artifacts.zip).

A later product decision must be recorded in its owning Markdown document or supporting register
and linked to its evidence. Editing a supporting report or DOCX copy does not change the product
baseline.

The earlier `PDM-Software-Validation-260815-2-hieu-dinh-Feature-Spec.docx` was removed on
09-09-2026 after the user confirmed that the subsequent clarifications resolved its listed PDF
differences. The Markdown resolution note replaces it for project wayfinding; the original PDF
remains a context source.
