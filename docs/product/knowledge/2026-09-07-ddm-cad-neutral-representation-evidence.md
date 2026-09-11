# DDM CAD Neutral-Representation Evidence Finding

| Field | Value |
|---|---|
| Document ID | `IE-KNW-DDM-004` |
| Status | Bounded research finding; not a target-runtime fact |
| Question | Does public first-party DDM evidence link PDF/neutral representations to an exact CAD Issue or File Version, identify stale representations, and release the matching PDF? |
| Source scope | CSI/DesignDataManager first-party website, release notes and official DesignDataManager YouTube channel only |
| Access date | 2026-09-07 |
| Evidence classes | `VENDOR-PUBLIC`, `INFERENCE`, `UNKNOWN`, `IDEA RECOMMENDATION` |
| Product change made | None |

## Conclusion

DDM is publicly evidenced to create PDF and other neutral representations from CAD data, keep them as attachments/previews of the relevant record, and regenerate an existing neutral attachment when the CAD item is saved again. This makes **CAD-linked neutral representation with automatic refresh** a reasonable `DDM-EVIDENCED` capability description.

The reviewed sources do **not** establish that each representation carries an immutable pointer to the exact CAD Issue and File Version that produced it, that DDM displays a separate stale/current state after every possible CAD advance, or that Release Manager verifies and pins the matching PDF. Those stronger semantics remain `UNKNOWN`; they must not be presented as DDM parity facts.

## Evidence map

| Question | Finding | Evidence and boundary |
|---|---|---|
| Does DDM create a neutral file from a CAD model? | `VENDOR-PUBLIC — DEMONSTRATED` | In the official IRONCAD tutorial at [04:30–05:04](https://www.youtube.com/watch?v=QXWKsTQcaCg&t=270s), a STEP file is created as a neutral-file attachment to the part record. The presenter states that later model changes automatically maintain and update it. |
| Does DDM create a PDF from a CAD drawing? | `VENDOR-PUBLIC — DEMONSTRATED` | At [07:41–08:31](https://www.youtube.com/watch?v=QXWKsTQcaCg&t=461s), the tutorial offers DXF/DWG output, states that the PDF is created automatically, shows the drawing linked to its model, and opens the PDF preview from the drawing record. |
| Does a later CAD Save refresh an existing neutral attachment? | `VENDOR-PUBLIC — RELEASE-SPECIFIC CLAIM` | The [DDM 2017.05 Attachment Management release note](https://www.designdatamanager.com/2017/06/13/ddm-2017-05-whats-new-attachment-management/) says that when saving a model or drawing from CAD, an existing neutral attachment is regenerated regardless of the administrator's automatic-generation setting (`DDMC-5335`). It also lists automatic STEP/SAT/Parasolid output and 3D PDF/STL neutral attachments for named CAD integrations. This is historical release wording, not a universal current-target guarantee. |
| Are neutral files attached to the managed item? | `VENDOR-PUBLIC — DEMONSTRATED/CLAIMED` | The tutorial calls STEP a neutral-file attachment to the part record. The [DDM 2016.05 release note](https://www.designdatamanager.com/2016/06/21/ddm-2016-05-whats-new-manually-added-neutral-file-attachments-and-audit-on-pdf-previews-in-ddm-web/) also permits additional file attachments, such as STEP on an existing part or non-drawn part, and records audit when a PDF drawing preview is viewed in DDM Web. It does not define source lineage for a manually added attachment. |
| Does DDM retain history and recognize the CAD version context? | `VENDOR-PUBLIC — PARTIAL` | The same IRONCAD tutorial shows two CAD File Versions and loading a selected earlier version at [05:59–06:24](https://www.youtube.com/watch?v=QXWKsTQcaCg&t=359s). DDM's [CAD, Document & Project Management page](https://www.designdatamanager.com/solutions/cad-and-document-management/) claims that the product shows the correct historical version used and provides automatic thumbnail/PDF generation. Neither source demonstrates the identity of the neutral attachment belonging to each historical File Version. |
| Is an exact source Issue/File Version stored on every PDF/neutral representation? | `UNKNOWN` | The sources show item attachment, automatic regeneration, CAD File Version history and model↔drawing relationships, but no source-version field, immutable representation identity, digest, or historical representation-to-source mapping. |
| Is a representation visibly marked stale after CAD advances or generation fails? | `UNKNOWN` | The happy path regenerates the attachment on Save. No reviewed first-party source shows a stale/outdated label, failure state, retry rule, last-successful-source value, or behavior when CAD Save succeeds but conversion fails. Automatic regeneration is not proof that stale output is impossible. |
| Does Release Manager include and verify the matching PDF? | `UNKNOWN` | The official [Release Manager tutorial](https://www.youtube.com/watch?v=kofHQvmBxvw&t=698s) expands and releases a selected assembly scope with related drawings. It does not show neutral attachments as independently selected release members, a PDF/source match check, or a release gate based on representation freshness. |
| Are CAD Save, neutral generation and lifecycle Release one atomic operation? | `UNKNOWN` | No reviewed source interrupts conversion or Release, inspects rollback, or proves a shared transaction boundary. |

## Conversion mechanism boundary

| Integration/source | What the first-party source actually establishes | What remains unproven |
|---|---|---|
| IRONCAD tutorial, historical demonstrated UI | Generation is invoked from a running IRONCAD session through `Add-ins` → the DDM PDM Integrator Save flow. At [04:30–05:04](https://www.youtube.com/watch?v=QXWKsTQcaCg&t=270s), the presenter says the option will “create a STEP file” as a neutral attachment and that it will be “maintained and updated.” At [07:41–07:51](https://www.youtube.com/watch?v=QXWKsTQcaCg&t=461s), DXF/DWG are optional and “the PDF is created for us automatically.” | The video does not say whether DDM calls an IRONCAD API/export command, drives the UI, embeds its own converter, or delegates to another process. It does not demonstrate headless/server conversion. |
| Creo Parametric, DDM 2017.05 release wording | The release note attributes 3D PDF, SAT, Parasolid, STEP and STL-related behavior to the Creo integration. It says files are saved “from Creo Parametric,” includes a Generate STEP command on the PDM toolbar, and describes automatic storage when models are stored from Creo. | Exact Creo API, installed-version dependency, foreground/background execution, process identity and licensing requirements are not stated. The listed changes are specific to that historical release. |
| SolidWorks, DDM 2017.05/2017.10 release wording | The 2017.05 note says 3D PDFs of SolidWorks parts/assemblies are attached as previews; the [DDM 2017.10 CAD-integration note](https://www.designdatamanager.com/2017/10/09/ddm-2017-10-whats-new-updates-changes-creo-ironcad-inventor-cad-integrations/) adds STL saved from SolidWorks as a neutral attachment. | The rendering/export implementation and whether the installed SolidWorks application must be running are not stated. These sources do not establish behavior for other CAD integrations. |
| Current product wording | DDM's current public page advertises automatic thumbnail/PDF generation, while its 2025 article advertises automated PDF/STEP generation. | Neither page names a DDM-owned renderer, a third-party converter, an Action Server job, or a supported headless conversion contract. |

**Bounded mechanism conclusion:** public evidence demonstrates that DDM **orchestrates conversion through named CAD integrations and CAD-save/PDM-toolbar flows**. It is a reasonable `INFERENCE` that at least some outputs use capabilities of the installed native CAD product, because the action is shown inside IRONCAD and the release notes say output is saved from Creo/SolidWorks. It is not an admissible fact that DDM uses native CAD APIs, nor that DDM contains its own renderer. No named third-party or background conversion service was identified in the reviewed first-party sources; that absence is `UNKNOWN`, not proof that none exists.

## Permitted DDM-alignment statement

The following statement is supported:

> DDM demonstrates automatic PDF/neutral-format generation associated with managed CAD records and regeneration of an existing neutral attachment when CAD is saved.

The following statement is **not** supported by current public evidence:

> DDM pins every PDF to the exact source Generation, detects every outdated PDF, and blocks Release unless the matching PDF is included.

## Recommendation for IDEA Core v0

1. Keep the user-visible DDM-like behavior small: a CAD or drawing record may have PDF/STEP/DXF/DWG representations, users can preview them, and a supported CAD adapter or worker can regenerate them after a new CAD Check-in.
2. Do not require automatic conversion for every declared CAD format in Core v0. Prove it first for the selected deep CAD profile and leave other formats behind the existing capability-profile/adapter boundary.
3. Internally record the exact IDEA source Generation and artifact digest whenever a representation is created or uploaded. Derive `Current` only when it matches the selected source Generation; otherwise show `Needs update`. This is an IDEA integrity safeguard, not a demonstrated DDM fact.
4. Make the release rule configurable by document/format policy. If PDF is required, block Release when it is missing, failed or belongs to another Generation. If PDF is optional, warn without blocking. Do not claim that this policy copies DDM until an authorized target audit proves it.
5. Core v0 may begin with an attributable manual upload plus source-Generation selection, then replace that step with automatic conversion without changing representation identity or release rules.
6. Do not design Core v0 around an assumed universal DDM-style renderer or an assumed headless server conversion. Put conversion behind each format adapter, record its declared execution mode and prerequisites, and qualify the IRONCAD path against the installed native application before promising automation. A manual/export-assisted path remains valid until that proof exists.

This finding does not create or modify an IDEA requirement. Any decision to retain, defer or remove the stronger controls remains with Product Decision Authority.

## First-party sources

All external sources were accessed on **2026-09-07**.

1. [DDM IRONCAD Tutorial Videos](https://www.designdatamanager.com/ironcad-tutorials/) — official topic index for neutral formats, specific File Versions, related drawings and Release Manager.
2. [Creating IRONCAD Parts, Assemblies and Drawings](https://www.youtube.com/watch?v=QXWKsTQcaCg) — official DesignDataManager tutorial; cited narration comes from its English auto-generated captions and displayed workflow.
3. [DDM 2017.05 — Attachment Management](https://www.designdatamanager.com/2017/06/13/ddm-2017-05-whats-new-attachment-management/) — historical release-specific neutral attachment and regeneration statements.
4. [DDM 2016.05 — Manually Added Neutral File Attachments and PDF Preview Audit](https://www.designdatamanager.com/2016/06/21/ddm-2016-05-whats-new-manually-added-neutral-file-attachments-and-audit-on-pdf-previews-in-ddm-web/) — historical manual attachment and preview-audit statements.
5. [DDM CAD, Document & Project Management](https://www.designdatamanager.com/solutions/cad-and-document-management/) — current vendor-public feature wording for historical versions and automatic thumbnail/PDF generation.
6. [BOM Management and the Release Manager](https://www.youtube.com/watch?v=kofHQvmBxvw) — official release workflow demonstration and evidence boundary.
7. [DDM 2017.10 — CAD Integration Updates](https://www.designdatamanager.com/2017/10/09/ddm-2017-10-whats-new-updates-changes-creo-ironcad-inventor-cad-integrations/) — historical SolidWorks STL attachment wording and integration-specific release boundary.
8. [Streamline Your CAD Workflow with Design Data Manager](https://www.designdatamanager.com/2025/09/15/streamline-your-cad-workflow-with-design-data-manager/) — current-generation marketing wording for automated PDF/STEP generation; no mechanism is specified.
9. [DDM CAD data sheet, issue 2022.02](https://www.designdatamanager.com/wp-content/uploads/00000001642022.02Data-Sheet-DDM-CADDoc.pdf) — automatic thumbnail/PDF feature wording; no renderer or execution topology is identified.
10. [DDM vendor-public capability baseline](ddm-vendor-public-baseline.md) and [target audit plan](ddm-target-audit-plan.md) — existing controlled limits and the method required to establish exact target behavior.
