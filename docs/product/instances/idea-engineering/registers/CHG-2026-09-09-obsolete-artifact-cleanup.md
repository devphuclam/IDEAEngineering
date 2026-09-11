# Obsolete Presentation Artifact Cleanup

| Field | Value |
|---|---|
| Stable Record ID | `IE-CHG-ARTIFACT-CLEANUP-001` |
| State | `Draft` |
| Version | `0.2` |
| Date | `09-09-2026` |
| Scope | Repository hygiene only |

## Reason

Old prototypes, reports and generated Word renditions remained beside the current review material.
Several of them contained earlier terminology, screenshots or document versions and could therefore
be mistaken for the current IDEA DDM direction.

## Removed from active directories

- The predecessor content formerly stored as `prototypes/idea-ddm-workbench.html`. The current
  reviewed Workbench later adopted this filename; it is not the archived predecessor content.
- The v2 and v3 Controlled Document Workspace analysis reports in `docs/reports/`.
- `docs/reports/PDM-Software-Validation-260815-2-hieu-dinh-Feature-Spec.docx`, removed after its
  listed PDF differences were resolved and retained in the Markdown resolution note.
- Generated Feature 0.4/0.5, Spec 0.5/0.6 and Tech 0.3/0.4 Word renditions and their four architecture figures.
- `logo-idea.jpg`, an unreferenced duplicate; `logo-idea.png` remains the project logo.

The empty `decision-briefs/renditions/` directory was also removed. A transient Word lock file in
that directory was not treated as a governed artifact.

## Preserved

- The current Feature, Spec, Tech, DOC-01…DOC-08, registers, research and decision history.
- `prototypes/idea-ddm-workbench-clean.html`, the current review prototype.
- `prototypes/controlled-document-workspace.html`, retained as earlier accepted design evidence.
- `docs/reports/IDEA_DDM_review.docx`, the user's current management copy.
- Management-provided PDF/ICS sources and `logo-idea.png`.
- Git worktrees containing uncommitted work; they require a separate explicit disposition.

## Recovery archive

The 18 removed files were captured before deletion in
[`2026-09-09-obsolete-presentation-artifacts.zip`](../history/2026-09-09-obsolete-presentation-artifacts.zip).

- SHA-256: `2b071c1d597f4536851e5e479f18ed2a8c97257b0cfc6769b73c187a9ddf48cb`
- Archive entries: `18`

The later removal of the correction DOCX was explicitly requested after its current design
resolutions had been consolidated in
[`PDM-Software-Validation-260815-2-resolution-note.md`](../../../../reports/PDM-Software-Validation-260815-2-resolution-note.md).
It was not added to the earlier 18-file archive.

## Impact

This cleanup changes repository navigation and active presentation artifacts only. It does not
change product behavior, Feature/Spec/Tech content, the roadmap, a review result, a boss decision or
a product-gate state. The authoritative Markdown documents keep their existing versions.
