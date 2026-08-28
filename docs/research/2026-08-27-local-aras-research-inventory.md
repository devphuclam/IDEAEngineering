# Local Aras Innovator Research Inventory

Date: 2026-08-27  
Purpose: determine whether the local Aras research corpus has already been fully reviewed for
IDEA Engineering.  
Scope: local inventory metadata and review status only; no raw runtime/export or proprietary
content is copied into this repository.

## Conclusion

The local Aras corpus has **not** been fully reviewed by the current IDEA documentation effort.
The IDEA repository currently contains three Aras-related research notes that use selected
official Aras documentation as comparative input:

- [Aras version/lifecycle model](2026-08-27-aras-innovator-version-lifecycle-model.md);
- [DDM-first workflow and approval policy](2026-08-27-ddm-first-workflow-approval-policy.md); and
- [PLM retention and structure-release patterns](2026-08-27-plm-retention-and-structure-release-patterns.md).

Those notes are not evidence that the much larger local research and implementation corpus has
been read.  They also do not establish that any local Aras runtime snapshot is current, authorized,
or representative of a supported Aras build.

## Inventory measurements

The measurements below were taken with read-only file enumeration on 2026-08-27.  A matching file
name or text occurrence is an inventory signal, not proof that the file contains a product-relevant
Aras fact.

| Scope | Result |
|---|---:|
| `C:\Users\TD-999\Research\Projects\ArasInnovator` files | 9,613 |
| Aras project Markdown files | 414 |
| Aras project JSON files | 270 |
| Aras project XML files | 828 |
| Aras project DOCX files | 5 |
| Aras project PDF files | 64 |
| Aras project C# files | 808 |
| Aras project AML files | 2 |
| Aras project image files (PNG/JPG/JPEG) | 337 |
| Aras project CAD-like files (`.dwg`, `.ics`, `.ipt`, `.iam`, `.idw`) | 1,122 |
| Text/code files mentioning `Aras` under `C:\Users\TD-999\Research` | 456 |
| Of those matches under `Projects\ArasInnovator` | 439 |
| Of those matches under `Projects\IDEA` | 11 |
| Of those matches under `icVault` | 5 |

The H: path supplied in the earlier task was also checked for text/code matches.  No matching text
file was found under `H:\PRODDEVELP_DP\LAB\P.Lam`; a named `Aras` folder contains two PNG error
screenshots and requires visual review if those incidents are relevant.

## Main corpus and evidence boundary

### 1. Focused Aras learning workspace

Path: `C:\Users\TD-999\Research\Projects\ArasInnovator\copilot-worktrees\StudyCase_0603\aras-learning`

Read-only inventory found 86 files, including 69 Markdown files, 2 JSON files, and 13 code or
script files.  The workspace separates current learning material from archives, handoffs, tasks,
server-data, sample data, and UI images.

The current learning index identifies these as the principal source-of-truth areas:

- `docs\core\`: five current IDEA/PDM design documents covering the domain model, IronCAD
  repository, branch/commit gaps, revision automation, and project next steps;
- `docs\reference\`: seven detailed notes covering the Programmer's Guide, Product Engineering
  14, default configuration, REST/API, and change-management-related topics;
- `tasks\` and `handoff\`: active execution state and historical continuity records; and
- `docs\archive\`: superseded plans and learning-status material.

The file `C:\Users\TD-999\Research\Projects\ArasInnovator\copilot-worktrees\StudyCase_0603\aras-learning\docs\archive\HOC-TAP-STATUS.md`
reports a self-assessed `19/19` “Other Documentation” learning status.  That is a claim made by
the source workspace, not an independent audit by IDEA.  The same status names `ARAS-NOTES.md` and
`Aras-Default-Configuration-Reference.md` as consolidated notes.

### 2. Topics visible in the consolidated notes

Heading-level inventory shows broad coverage of:

- ItemTypes, Items, Properties, AML, IOM, server/client methods and events;
- REST/OData, authentication headers, file access, debugging, logging, and CheckinManager;
- lifecycles, workflows, permissions, versioning/promoting, parts and documents;
- BOM structures, instances, alternates, substitutes, effectivity, reports, comparison, and
  where-used;
- CAD Documents, CAD file management, hierarchy, visualization, and comparison;
- change management, e-signature, sourcing, discussions, subscriptions, and notifications;
- CUI, TOC, CMF, Query Builder, Graph Navigation, Extended Classification, PIE, conversion, and
  reporting; and
- localization, default configuration, backup/recovery, platform specifications, and API
  programming patterns.

The headings identify candidate areas for IDEA comparison.  They do not by themselves establish
the detailed semantics, current release, transaction boundary, or quality of the behavior.

### 2.1 First-pass reading of the current core and handoff set

The five `docs\\core` files and the current `handoff\\SESSION-BRIEF.md`,
`handoff\\SESSION-STATUS.md`, and `tasks\\ACTIVE-TASKS.md` were read at a first-pass level on
2026-08-27.  They are useful for routing and implementation history, but they are not a substitute
for a dated, authorized target-runtime test or an official vendor source.

The current core design consistently records these candidate patterns:

- Keep a business PDM structure distinct from a file-derived CAD structure, with an explicit
  mapping between them.
- Treat native CAD files as managed evidence attached to business objects, not as the BOM itself;
  preserve relative paths and file roles so a workspace can be rebuilt.
- Separate work history (`generation`/check-in or commit history) from formal engineering
  revision and lifecycle state; a save or check-in must not silently become a new release
  revision.
- Make server-side lock/lifecycle authority and local workspace session state visible together;
  distinguish available, owned-by-me, owned-by-other, lifecycle-blocked, and stale states.
- Make preview outcomes explicit (`Create`, `Update`, `Reuse`, `Conflict`), keep non-main work
  from changing live structure without an explicit apply/merge operation, and require idempotent
  projection.
- Model repository history with branch head, parent commit, per-file manifest, structure snapshot,
  content hash, and optimistic-concurrency checks instead of only aggregate local counts.

The same set also exposes evidence conflicts that must remain visible:

| Source and date | Claim | Current treatment |
|---|---|---|
| `IDEA-PDM-REVISION-AUTOMATION-BRIDGE-V1.md`, 2026-06-30 | Server-side revise is future work; the client remains guidance-only and only two preconditions are checked | Historical design state; not current runtime proof |
| `handoff\\SESSION-BRIEF.md` and `SESSION-STATUS.md`, 2026-07-01 | `idea_ReviseCad` is deployed, the client path is wired, and an end-to-end live test is next | Source-workspace claim; requires the named live test evidence |
| `PROJECT-NEXT-STEPS-2026-06-25.md` | Clone/pull, repository persistence, conflict handling, idempotency, and lifecycle enforcement remain gaps | Earlier plan; supersession must be demonstrated rather than assumed |
| `tasks\\ACTIVE-TASKS.md`, 2026-07-02 | Core PDM and multilingual tasks are complete; GUI/live-Aras checks were not run from CLI | Static/task status only; not a live acceptance result |

The local Product Engineering notes add candidate quality patterns for later comparison: configurable
version/revision behavior, lifecycle-specific permissions, explicit change-process actions, fixed
versus floating BOM resolution, effectivity, recursive structure comparison, where-used navigation,
and separate native/viewable/additional file roles.  These remain unadmitted local secondary
research notes
until each atomic claim is tied to an authorized source edition or reproducible target observation.

### 2.2 Candidate lessons to validate, not direct requirements

The first-pass notes suggest the following comparison backlog:

| Candidate pattern | Why it is useful to examine | What must not be inferred |
|---|---|---|
| Stable configuration identity plus separate generation and major revision | Keeps work history, formal engineering change, and released baselines distinguishable | A local note is not proof of one universal storage model or exact revision allocation in the target build |
| Lifecycle-specific permissions and lockability | Makes edit, review, release, and change authority explicit per state | Default state names such as 'Preliminary', 'In Review', or 'Released' are configurable and are not IDEA requirements |
| Explicit change actions ('Add', 'Change', 'Delete', interchangeable versus new number) | Gives impact analysis and revision intent a structured vocabulary | A documented application workflow does not prove that every deployment uses the same roles, transitions, or transaction boundary |
| Fixed/float BOM behavior, resolution modes, effectivity, recursive comparison, and where-used | Protects released structure reproducibility while supporting legitimate configuration and impact analysis | 'Latest' resolution is not the same as a persisted released baseline and may expose unreleased children |
| Separate native, viewable, and additional file roles | Clarifies authoring versus derivative evidence and preserves historical file context | File attachment behavior does not prove atomic metadata/file publish, recovery, or orphan cleanup guarantees |
| Actor/time/action/comment/state/revision/generation history | Supports traceability and review evidence | History availability and property-level tracking are configuration-dependent |
| Configurable UI/TOC/identity and portable configuration packages | Supports role-specific, multilingual and maintainable administration | A configurable surface does not by itself establish safe defaults, tenant isolation, or a supported public API |
| Required-role validation and assignment pinning when a workflow instance starts | Prevents silent actor fallback and retroactive reassignment | The local notes do not establish universal quorum, self-approval, or separation-of-duties defaults |

The current IDEA research already admits the first, second, third, and eighth themes in bounded form
through dated official-source notes.  The BOM-resolution, file-role, history, configurable-UI, and
configuration-package themes are the next high-value validation batch; they remain research inputs,
not DOC-01--DOC-08 content.

### 3. Runtime and sample-data material

`StudyCase_0603\server-data` contains 38 files, including JSON/XML snapshots and scripts.  The
workspace also contains PDM sample data, CAD files, screenshots, logs, and export artifacts.  These
are potentially `TARGET-STATIC FACT`, `TARGET-RUNTIME FACT`, or raw operational evidence only after
the target build, configuration, authorization, test procedure, and reviewer are identified.
They remain outside this IDEA repository and are not treated as product requirements by this note.

### 4. Separate ArasPlugin repository

Path: `C:\Users\TD-999\Research\Projects\ArasInnovator\copilot-worktrees\Workspace\ArasPlugin`

This is a separate Git repository, clean at the inventory time, with 5,801 files including 287
Markdown files, 211 JSON files, and 2,447 code files.  It contains three Spec Kit feature areas:

- `001-pdm-cad-launch-action`;
- `002-ironcad-linked-export`; and
- `003-controlled-cad-design-release`.

Its `AGENTS.md` explicitly says not to guess Aras schema or live behavior and distinguishes source,
constitution, specs, context, and ADR authority.  Its specs and code are valuable implementation
history and current-behavior evidence for the ArasPlugin effort, but they are not automatically
authoritative requirements for IDEA Engineering.

### 5. Other local material

The Aras project root also contains a small number of DOCX learning/report files, an IronCAD DLM
archive, an `ARAS01` CAD study, and the DPV2303-001 engineering project with thousands of CAD,
media, drawing, and project artifacts.  These should be classified as learning reports, domain
sample data, or operational/project artifacts before any targeted reading.  A filename containing
“Aras” is not sufficient to admit its contents as evidence.

## What has and has not been reviewed in this turn

### Reviewed for inventory and routing

- `PROJECT-DOCUMENTATION.md` at the Aras project root;
- `aras-learning\README.md`;
- `aras-learning\docs\archive\HOC-TAP-STATUS.md`;
- heading indexes for the consolidated reference and core notes;
- a first-pass reading of the five docs\core files plus the current handoff\SESSION-BRIEF.md,
  handoff\SESSION-STATUS.md, and tasks\ACTIVE-TASKS.md;
- `ArasPlugin\AGENTS.md` and its context/spec file inventory; and
- file counts, paths, Git status, and extension metadata in the scoped directories.

### Not fully reviewed

- the full contents of `ARAS-NOTES.md`, `ARAS-PE14-FULL-NOTES.md`, and the Programmer's Guide
  notes;
- all five local DOCX reports and learning documents;
- the five `docs\core` documents and their supporting handoffs/tasks;
- ArasPlugin feature specs, plans, tasks, contracts, and source code;
- server-data JSON/XML, logs, exports, and CAD/sample artifacts; and
- the two H: drive Aras error screenshots.

## Recommended reading order for IDEA

1. Read the five current `docs\core` files and current `handoff\SESSION-BRIEF.md`,
   `handoff\SESSION-STATUS.md`, and `tasks\ACTIVE-TASKS.md` to establish the latest domain and
   observed behavior.
2. Read the consolidated Product Engineering, default-configuration, and Programmer's Guide
   notes by topic, beginning with identity/version, lifecycle/workflow, permissions, BOM/structure,
   document/CAD files, search/where-used, CUI, API, and recovery.
3. Compare those claims against the ArasPlugin feature specs and current tests, preserving the
   distinction between design intent, current implementation, and live evidence.
4. Inspect runtime/export data only for a named question with authorized target identity and an
   evidence procedure; do not bulk-import it into IDEA.
5. Convert reviewed findings into the supporting DDM/Aras comparison register.  A competitor fact
   may motivate `ADOPT`, `ADAPT`, `ADAPT-ARAS`, `DEFER`, `EXCLUDE`, or `UNKNOWN`, but it does not
   bypass IDEA requirement, architecture, security, or review gates.

## Limitations

- This inventory does not claim that every file on every mounted drive was found; it covers the
  named Research and H: scopes and the project paths above.
- File counts include archives, generated/build output, sample data, and possible duplicates.
- Heading-level inspection is not equivalent to reading or validating the underlying content.
- Local notes may contain stale, inferred, or implementation-specific claims; preserve their source,
  date, target, and evidence class before reuse.
- The inventory itself is a routing aid, not an admission of Aras behavior into IDEA.
