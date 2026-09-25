# Architecture and qualification evidence

This directory exposes only evidence packages that are still useful for current review or current
qualification. A rendered image is evidence of a source/render check; it is not evidence that the
product has been implemented or that a runtime behavior has passed.

## Packages kept expanded

| Package | Why it remains expanded |
|---|---|
| [`IE-VEV-TECH-VIEW-004`](IE-VEV-TECH-VIEW-004/index.html) | Current TECH-D01…D08 rendition; Core v0 shows one configured Vault and a non-runtime future multi-vault extension seam. |
| [`IE-VEV-P06-DIAGRAM-001`](IE-VEV-P06-DIAGRAM-001/index.html) | Focused successor for the two DOC-05@0.23 recovery views; it does not duplicate the full gallery. |
| [`IE-VEV-WS-SCOPE-002`](IE-VEV-WS-SCOPE-002/index.html) | Current DOC-05@0.25 Check-in scope view; the three-branch policy is approved, while the architecture view and runtime tests remain unaccepted/unrun. |
| [`IE-VEV-WS-SCOPE-001`](IE-VEV-WS-SCOPE-001/index.html) | Pre-approval DOC-05@0.24 rendition retained with its exact source/hash record. |
| [`IE-VEV-TECH-VIEW-003`](IE-VEV-TECH-VIEW-003/index.html) | Predecessor Node.js 24 rendition retained for traceability. |
| [`IE-VEV-VAULT-XFER-002`](IE-VEV-VAULT-XFER-002/index.html) | Pinned predecessor full-gallery multi-location Vault views and three Vietnamese management figures; the two P06 recovery views have a focused successor above. |
| [`IE-VEV-VAULT-XFER-001`](IE-VEV-VAULT-XFER-001/index.html) | Predecessor Vault successor rendition retained for traceability. |
| [`IE-VEV-ARCH-CORR-005`](IE-VEV-ARCH-CORR-005/index.html) | Exact architecture-rendition predecessor used by the 16-09 management-review baseline. |
| [`IE-VEV-TECH-VIEW-002`](IE-VEV-TECH-VIEW-002/index.html) | Predecessor technology rendition retained for traceability. |
| `IE-VEV-TECH-Q15-001…003` | Bounded qualification evidence, not duplicate presentation renders. |

The expanded render packages keep both formats only where they are still used: SVG is the
full-resolution review format; PNG supports Word/PowerPoint insertion, thumbnails and visual QA.
Future source changes must not create another full duplicate package unless a new controlled
evidence baseline is actually required.

## Archived render packages

Seven superseded, fully expanded render packages were removed from the active checkout on
17-09-2026:

- `IE-VEV-ARCH-VIEW-001`
- `IE-VEV-ARCH-VIEW-002`
- `IE-VEV-ARCH-CORR-001…004`
- `IE-VEV-TECH-VIEW-001`

Their 364 original files—including manifests, SVG, PNG and review material—remain recoverable from
Git history at predecessor commit `f269a0445737a7efd7f406ee51517149a8967afa`. They are not copied
into an archive inside the repository because that would duplicate about 19 MB of historical
binary data in Git.

Do not restore a whole package into the active evidence directory merely for browsing. Read a file
from that commit or restore a specific package into a temporary directory only when a historical
audit requires it.
