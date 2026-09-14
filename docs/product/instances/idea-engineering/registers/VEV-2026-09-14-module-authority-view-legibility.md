# Module Authority View Legibility and Rendition Record

## Control envelope

| Field | Recorded value |
|---|---|
| Stable Supporting Record ID | `IE-VEV-ARCH-CORR-005` |
| Supporting class / version / status | `VEV` / `0.1` / `Draft` |
| Date / operator | 2026-09-14 14:07 ICT / Principal Product Author in the local workspace |
| Owner / reviewer / acceptance authority | Principal Product Author; independent architecture, security and HCD review `NOT-RUN`; Product Decision Authority acceptance `NOT-RUN` |
| Product normativity | `INFORMATIVE` source/rendition evidence only; no new requirement, architecture approval or technology decision |
| Repository process authority / instruction state | `NOT-APPLICABLE` / `NOT-APPLICABLE` |
| Applicable baseline | `IDEA-C1-ANALYSIS-DESIGN-001`; DOC-05@0.20 and DOC-06@0.16 |
| Exact rendered working-copy source | DOC-05 SHA-256 `25e29192f68e756cb54c8589207cbbd9877ae1f7279cb384f2079bb6d2be5b71`; DOC-06 SHA-256 `11db41f439cb801fc510ac1f959340d1435df5e25d8096862bb05169c76c9a93` |
| Portable source pin | DOC-05 LF-normalized SHA-256 `2e78ceaf87005dd6adb0b743086506cecfbcf54475448f6f18cf888ddec1d48b`, filtered Git blob `d8f68a8212380bf782fe3b12bb623e1563fadb63`; DOC-06 LF-normalized SHA-256 `6a86fbe5ada75b743f29619a5ce3107df8a271e239a8015cd9681eddf21c258d`, filtered Git blob `482f866d39d94c60a1d9478b91ca7b8347f19157` |
| Source / upstream trace | [IE-CHG-DOC-REVIEW-001@0.2](CHG-2026-09-14-post-pull-document-review-corrections.md), [DOC-05 diagram policy](../DOC-05-architecture-description.md#32-diagram-authoring-and-review-policy), [prior VEV-004](VEV-2026-09-14-post-pull-architecture-view-correction.md) |
| Downstream trace | [current gallery](../evidence/IE-VEV-ARCH-CORR-005/index.html), [render manifest](../evidence/IE-VEV-ARCH-CORR-005/render-results.json), [current SVG](../evidence/IE-VEV-ARCH-CORR-005/ARCH-VIEW-MOD-001.svg), [current PNG](../evidence/IE-VEV-ARCH-CORR-005/ARCH-VIEW-MOD-001.png), [instance catalogue](../README.md), future management renditions |
| Access / retention | `INTERNAL`; retain with exact Markdown sources, generated SVG/PNG, manifest and predecessor evidence |
| Supersession / review trigger | Supersedes VEV-004 **for the current source/rendition baseline only**. Rerender under a new ID after any maintained view-source change. |
| Evidence status | Mermaid render and standalone SVG XML parsing `PASS`; focused author inspection of the changed PNG `PASS`; independent architecture/security/HCD review and controlled-rendition acceptance remain `BLOCKED` / `NOT-RUN` |

## 1. Reason for correction

The VEV-004 rendition of `ARCH-VIEW-MOD-001` placed too many ownership, caller and evidence
relationships in one arrow graph. Several labels crossed or touched other labels when the SVG was
opened at full size. A four-column responsibility-matrix draft removed the crossings but did not
function as an architecture diagram and was rejected during author review.

DOC-05@0.20 therefore separates the concerns:

- the existing Module table remains the detailed responsibility and non-authority catalogue;
- `ARCH-VIEW-MOD-001` is a C4 Component Diagram limited to the protected-command control path;
- `ARCH-VIEW-MOD-002` retains Workspace, Artifact Custody and publication responsibilities;
- activity and sequence views retain administrator and runtime behaviour.

This is a presentation and view-scope correction. It changes no Module owner, RBAC rule, product
requirement, workflow, interface contract or technology decision.

## 2. Declared model kind and review question

| Attribute | Current declaration |
|---|---|
| View ID and name | `ARCH-VIEW-MOD-001` — C4 Component Diagram for the protected command path inside IDEA Server |
| Model kind | C4 Component Diagram rendered with Mermaid flowchart notation |
| Question answered | How does a protected product command reach only its declared authoritative owner Modules and obtain RBAC decisions? |
| Intended audience | Software maintainers, security reviewers and architecture reviewers |
| Scope | Coordinator, product-state owners, Access Policy and its authoritative fact providers inside one IDEA Server container |
| Explicit exclusions | People/administrator roles, UI, Workspace/Artifact paths, deployment, workflow timing, database tables and detailed messages |
| Notation | Container border, typed Module boxes, responsibility text, directional labelled calls and a visible legend; color is supplementary only |

The project tailors ISO/IEC/IEEE 42010:2022 for view/viewpoint organization and uses the C4
Component Diagram as this view's model kind. This record does not claim independent standards
conformance or qualified architecture acceptance.

## 3. Render and inspection result

The controlled renderer processed all Mermaid blocks in the exact DOC-05/DOC-06 sources into the
new `IE-VEV-ARCH-CORR-005` folder using Mermaid 11.12.0 and Chrome 152.0.7977.83 at
`2026-09-14T07:07:19.418Z`. The manifest contains 30 distinct View IDs, non-empty accessible titles
and descriptions, 30 SVG files, 30 PNG files and per-SVG SHA-256 values.

| Check | Actual result | Boundary |
|---|---|---|
| Source hash against render manifest | `PASS` for the exact DOC-05@0.20 and DOC-06@0.16 byte streams recorded above | Any later source edit requires a new evidence ID and rendition. |
| Mermaid inventory and render | `PASS`, 30/30 views | Rendering does not prove semantic correctness. |
| Standalone SVG XML syntax | `PASS`, 30/30 files parsed | No product runtime is involved. |
| Changed-view visual inspection | `PASS` for the generated `ARCH-VIEW-MOD-001.png`: title, container, seven Module boxes, arrow labels and legend are visible; no label or edge overlap was observed | Author inspection only; independent HCD/architecture review remains `NOT-RUN`. |
| Changed-view semantic focus | `PASS` against the declared question: coordinator, owners, Access Policy and the two fact providers are shown; unrelated responsibilities are routed to the table and companion views | This does not approve the underlying Draft architecture. |
| Independent architecture/security/HCD review and management-layout acceptance | `BLOCKED` / `NOT-RUN` | Requires named reviewers and the final management rendition. |

The current `ARCH-VIEW-MOD-001.svg` has SHA-256
`d4d22ef2f1af62c462da6ba3a165fa2f2e6fd79c3df7020b4a4a57606f20d723` according to the render
manifest.

## 4. Remaining acceptance work

`VVP-016` qualified architecture/security/HCD review, final management-layout acceptance and
product verification remain open. This evidence proves only that the current source rendered,
parsed and passed the focused author legibility inspection described above.
