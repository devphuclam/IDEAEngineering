# Solidmakarna DDM public capability evidence — scratch inventory

| Field | Value |
|---|---|
| Research record | `RS-DDM-CAP-20260912-001` (scratch evidence input; not a canonical IDEA knowledge ID) |
| Status | Public-evidence collection for the DDM Capability Inventory and IDEA gap-matrix work item |
| Publisher scope | Solidmakarna AB (DDM distributor/support partner) and Concurrent Systems Incorporation / DesignDataManager (DDM publisher) |
| Access date | 2026-09-12 |
| Repository baseline inspected | `2e9e9aa56d29e4bba586a0a17426bc95b99420c2` (`origin/main` at time of research) |
| Target runtime | None. No DDM package, edition, licence entitlement, configuration or installed target was available for this note. |
| Product decision status | This note creates no IDEA requirement, Feature, Spec, Tech or architecture decision. |

## 1. Purpose and evidence boundary

This note records what public Solidmakarna/DesignDataManager material documents or visibly
demonstrates about Design Data Manager (DDM). It is an external evidence input to the later
canonical capability inventory and IDEA Engineering gap matrix. It is intentionally separate from
the normative IDEA Product Documents and from the pre-existing admitted DDM knowledge records.

The source set demonstrates vendor vocabulary, product surfaces and selected happy-path flows. It
does **not** prove DDM's internal schema, authoritative identity keys, transaction boundaries,
security enforcement, backup correctness, replication consistency, API contract, performance,
current edition parity or entitlement. A public page's silence is `UNKNOWN`, not proof of absence.

Evidence labels used below:

- `CONFIRMED-OFFICIAL` — capability directly documented by CSI/DesignDataManager or Solidmakarna's DDM product page.
- `CONFIRMED-OBSERVED` — a first-party/official tutorial or video visibly demonstrates the user flow; it does not prove backend implementation.
- `SUPPORTED-SECONDARY` — reseller/distributor material supports the observation but is not the DDM publisher's normative documentation.
- `INFERRED` — a reasonable interpretation of observable behavior; never treat it as an internal DDM fact.
- `UNKNOWN` — the reviewed public material is insufficient to decide.

Historical video/release evidence is tied to the dated or labelled context in its source. It is not
silently upgraded to a claim about the latest DDM build. Where a page makes a marketing claim (for
example, “up to 10 times faster”), the claim is recorded as a claim, not as an independently
reproduced benchmark.

## 2. Source catalogue

All URLs below were reachable or traceable from the vendor/distributor public sites during this
research. Pages and videos were reviewed on 2026-09-12 unless the source context explicitly gives an
earlier publication/release date. Existing repository findings are cited where they contain the
bounded interpretation of a historical tutorial or release note.

| Source ID | Title / publisher | URL | Date or context | What it actually supports | Limitation |
|---|---|---|---|---|---|
| `S01` | DDM — Solidmakarna AB | [solidmakarna.se/program/ddm](https://en.solidmakarna.se/program/ddm) | Current distributor product page; no exact DDM build stated | Product/project file organization; CAD plus Office/email/images; project folders; versions/history; graphical workflow; users/groups/processes/workflows/parts lists/change management | Distributor overview and marketing copy; no schema, enforcement or benchmark |
| `S02` | DDM IronCAD Workshops — Solidmakarna AB | [support blog](https://en.solidmakarna.se/supportblogg/ddm-ironcad-workshops) | 2024-03-20; links to CSI's DDM tutorials | Chapter-level inventory: integration setup, working directory, store, metadata, folder selection, STEP/DXF, File Version, search favourite, product structure, Reserve, BOM editor, quantity/position, Excel export, reports, Release Manager, Change Order, tasks, Up-Issue, permissions, Save-As and rename | Chapter list is not a current target test; some linked videos are historical |
| `S03` | DDM 2025.01 release announcement — Solidmakarna AB | [solidmakarna.se/aktuellt/ddm-2025-01-har-nu-slappts](https://en.solidmakarna.se/aktuellt/ddm-2025-01-har-nu-slappts) | Published 2025-03-21; DDM 2025.01 | Names Workbench, Administrator, DDM Web Dashboard, improved IRONCAD interface; says IRONCAD/SolidWorks 2025 support and “up to 10x” open/save performance | Vendor/distributor release claim; scope, workload and measurement method are not supplied |
| `S04` | DDM download entry — Solidmakarna AB | [download-centre/ddm](https://en.solidmakarna.se/download-center/ddm) | Entry launched 2022-03-01; “all versions” field | Describes DDM as a PDM integrating directly into IRONCAD, with lifecycle management, version control and centralized tracking | Download metadata does not identify a target installer/build or entitlement |
| `S05` | DDM Product Matrix — DesignDataManager / CSI | [DDM Product Matrix](https://www.designdatamanager.com/products/ddm-product-matrix/) | Current public matrix reviewed 2026-09-12 | CAD/Office/Web surfaces, supported CAD names, search, central repository, revision/history, numbering, workflow/approval/change, projects/tasks, notifications, preview, reuse, BOM, audit, ERP/MRP, replication, browser access, Windows/SQL deployment and licensing wording | Matrix cells are capability/marketing declarations; edition/module availability and runtime enforcement are unknown |
| `S06` | CAD, Project & Document Management — DesignDataManager / CSI | [CAD and document management](https://www.designdatamanager.com/solutions/cad-and-document-management/) | Current public feature page | Office/email/image management; project tasks with RACI/RAG; part/model-centric history; SQL-backed search, category browser, recent items and favourites; thumbnail/PDF generation; Where Used; drawing title-block population/change notes; configurable numbering | Does not specify data model, transactionality, indexing completeness or current licensed configuration |
| `S07` | Bill of Materials Editor & ERP Interface — DesignDataManager / CSI | [BOM and EUM](https://www.designdatamanager.com/products/bill-of-materials/) | Current public feature page | BOM quantity adjustment and non-modelled item addition; automatic BOM; BOM comparison; non-CAD BOM creation; ERP/MRP publication through XML; SharePoint/full document transfer; manual update option | Does not prove occurrence keys, snapshots, import semantics, stale output or atomicity |
| `S08` | Graphical Workflow Tool — DesignDataManager / CSI | [Graphical Workflow Tool](https://www.designdatamanager.com/solutions/graphical-workflow-tool/) | Current public feature page | Multiple workflows; engineering change, new-product and document signoff use cases; graphical preview; formal/informal state changes; audit wording; no-programming configuration; named out-of-box workflow starting points | Does not prove versioned definitions, approval race handling, quorum, transactionality or first-class ECR/ECO objects |
| `S09` | DDM Multi-Site — DesignDataManager / CSI | [DDM Multi-Site](https://www.designdatamanager.com/solutions/ddm-multisite/) | Current public solution page | Multi-site/replication product surface; repository baseline also records database/admin-metadata and file-server replication wording | Replication order, lag, conflict resolution, failover, partition recovery and capacity are unproven |
| `S10` | System Requirements and Support Matrix — DesignDataManager / CSI | [system requirements](https://www.designdatamanager.com/services/system-requirements/) | Public DDM 2026.x matrix; exact target not supplied | Planning profile for Windows clients/servers and listed SQL Server versions; repository baseline records Windows 10/11 and Server 2019/2022/2025 wording | Requirements do not establish an installed topology, edition, licence or performance envelope |
| `S11` | DDM Release Matrix — DesignDataManager / CSI | [release matrix](https://www.designdatamanager.com/services/ddm-release-matrix/) | Public release index; baseline observed through DDM 2026.04 | Release labels and links to release lists; establishes that dated release notes are available | Public matrix and compatibility page have had different latest-version wording; no target package identity |
| `S12` | DDM 2026.04 Full Release List — CSI | [2026.04 release PDF](https://www.designdatamanager.com/wp-content/uploads/DOC-000201751DDM-2026.04-Release-ListDoc.pdf) | DDM 2026.04 release-specific | Repository baseline records Database Statistics/purge controls, workflow UI updates, Quick Save/Load, preview/attachment handling, CAD support and read-only SQL reporting wording | Historical release note; feature text is not a complete contract or proof of current installation |
| `S13` | DDM 2024.07 Full Release List — CSI | [2024.07 release PDF](https://www.designdatamanager.com/wp-content/uploads/DOC-000159541DDM-2024.07-Release-ListDoc.pdf) | DDM 2024.07 release-specific | Repository baseline records Routing Server, Secure/Remote File Server and integration/reporting details | Release-specific; internal component names are not a supported public API contract |
| `S14` | DDM 2025.01 Full Release List — CSI | [2025.01 release PDF](https://www.designdatamanager.com/wp-content/uploads/DOC-000176841DDM-2025.01-Release-ListDoc.pdf) | DDM 2025.01 release-specific | Repository baseline records XML-to-CSV/alternate XML, EUM and watched-folder/manual send changes | Release-specific; retry, duplicate and idempotency semantics are not documented |
| `S15` | DDM CAD data sheet — CSI | [CAD data sheet, issue 2022.02](https://www.designdatamanager.com/wp-content/uploads/00000001642022.02Data-Sheet-DDM-CADDoc.pdf) | 2022.02 data sheet | CAD integration, revision/file management, search, automatic related/PDF formats, BOM/ERP and floating concurrent-user wording | Old sheet; licensing wording must not be generalized to current contracts |
| `S16` | DDM Office data sheet — CSI | [Office data sheet, issue 2022.02](https://www.designdatamanager.com/wp-content/uploads/00000001452022.02Data-Sheet-DDM-OfficeDoc.pdf) | 2022.02 data sheet | Office/document-management surface and workflow vocabulary | Historical feature sheet; no current target or internal semantics |
| `S17` | DDM Web data sheet — CSI | [Web Client data sheet, issue 2025.01](https://www.designdatamanager.com/wp-content/uploads/00000001592025.01Data-Sheet-DDM-Web-ClientDoc.pdf) | 2025.01 data sheet | Browser/Web client product surface | Does not prove that a given Web feature is enabled in a target edition |
| `S18` | DDM Replicator data sheet — CSI | [Replicator data sheet, issue 2022.02](https://www.designdatamanager.com/wp-content/uploads/00000007552022.02Data-Sheet-DDM-ReplicatorDoc.pdf) | 2022.02 data sheet | Multi-site replication product surface | Does not establish consistency, conflict or recovery guarantees |
| `S19` | Creating IRONCAD Parts, Assemblies and Drawings — DesignDataManager channel | [official tutorial](https://www.youtube.com/watch?v=QXWKsTQcaCg) | Historical tutorial; chapter times indexed by `S02` | Store, part number/description/category, folder, STEP/DXF, specific File Version, drawing, assembly/product structure and reservation flows | Happy-path video; exact build, save cardinality, failure and transaction behavior unknown |
| `S20` | BOM Management and Release Manager — DesignDataManager channel | [official tutorial](https://www.youtube.com/watch?v=kofHQvmBxvw) | Historical tutorial; chapter times indexed by `S02` | BOM editor, Bill of Quantity, columns/order/quantity/add/link, Excel export, BOM reports, Release Manager, selected scope, workflow and staged release sequence | Demonstrates success only; no interruption, rollback or exact release pinning |
| `S21` | Web BOM/search/workflow — DesignDataManager channel | [Web tutorial](https://www.youtube.com/watch?v=rL8tYmwsWHo) | Historical Web tutorial; chapters referenced by baseline | Browser login/search, product structure/BOM/export and Web workflow surfaces | Tutorial age, edition and entitlement are unknown; does not prove a current Web deployment |
| `S22` | Search tutorial — DesignDataManager channel | [official search tutorial](https://www.youtube.com/watch?v=SXQnnOEitaw) | Historical tutorial | Search and saved-search/favourite interaction | Does not prove index scope, full-text semantics, ACL filtering, completeness or performance |
| `S23` | Formal Approvals — DesignDataManager channel | [official approvals tutorial](https://www.youtube.com/watch?v=v8hzVUZjm2w) | Historical tutorial | Formal decision/approval and reject/resubmit interaction | Does not prove quorum/races, immutable records or transaction boundaries |
| `S24` | Web Workflow — DesignDataManager channel | [official Web workflow tutorial](https://www.youtube.com/watch?v=1zIyOZVxa3c) | Historical tutorial | Web workflow and lifecycle interaction | Does not prove workflow-definition versioning or current parity |
| `S25` | Configuring System Access — DesignDataManager channel | [official admin tutorial](https://www.youtube.com/watch?v=IAoU2iPDYxs) | Historical tutorial; demonstrated window labelled `2020.04.200622` in repository finding | Users, groups, business units, lifecycle states, access-control matrix, profiles, effective-permission summary and user actions | Historical demonstration; does not disclose precedence, enforcement, migration or current UI |
| `S26` | DDM Office — Working with Folders — DesignDataManager channel | [official Office tutorial](https://www.youtube.com/watch?v=rlH1fXReZ9Q) | Historical tutorial | Workbench, Reserve To, Reference To and modification-rights distinction | Does not prove owner key, lease, exact version pin, crash behavior or server enforcement |
| `S27` | Copying Models and Drawings and Renaming — DesignDataManager channel | [official copy/rename tutorial](https://www.youtube.com/watch?v=l7ST9GeA8jM) | Historical tutorial | Dividers, Save-As/copy, moving items and renaming as distinct user actions | Does not prove identity-key semantics, path behavior, history or failure handling |
| `S28` | DDM Administration Basic Course — CSI | [admin training](https://www.designdatamanager.com/services/training-3/ddm-admin-training/) | Current training outline; no build stated | Names accounts/profiles, groups, business units, ACLs, lifecycle, maintenance, export, backup and recovery as administration topics | Course outline is a capability/topic claim, not proof of a runnable current feature or recovery result |
| `S29` | DDM 2017.05 Attachment Management — CSI | [attachment management release note](https://www.designdatamanager.com/2017/06/13/ddm-2017-05-whats-new-attachment-management/) | DDM 2017.05 release-specific | Repository finding records automatic neutral attachments and regeneration on CAD save for named integrations | Historical, integration-specific wording; no universal current renderer/worker/transaction claim |
| `S30` | DDM 2016.05 manual attachments/PDF audit — CSI | [attachment and PDF preview note](https://www.designdatamanager.com/2016/06/21/ddm-2016-05-whats-new-manually-added-neutral-file-attachments-and-audit-on-pdf-previews-in-ddm-web/) | DDM 2016.05 release-specific | Additional neutral attachments and an audit event for viewing a PDF preview in DDM Web | Historical release note; does not define source lineage or current behavior |
| `S31` | DDM 2017.10 CAD integration updates — CSI | [CAD integration note](https://www.designdatamanager.com/2017/10/09/ddm-2017-10-whats-new-updates-changes-creo-ironcad-inventor-cad-integrations/) | DDM 2017.10 release-specific | Repository finding records integration-specific neutral output (including SolidWorks STL wording) | Does not establish behavior for every adapter or current release |
| `S32` | DDM public baseline already admitted in IDEA | [vendor-public baseline](../product/knowledge/ddm-vendor-public-baseline.md) | Evidence record dated 2026-08-26; source SHA recorded there | 16 bounded first-party propositions, contradictions and target-runtime unknown register | This is an admitted synthesis, not a new runtime observation; preserve its evidence limits |
| `S33` | CAD Parameter Mapping / drawing title-block guidance — Solidmakarna AB | [CAD Parameter Mapping](https://www.solidmakarna.se/supportblogg/anpassa-ritningshuvudet-mot-ddm) | Distributor support article; published 2023-03-06 | Describes mapping attributes between DDM and IRONCAD, including CAD→DDM, DDM→CAD or bidirectional direction | Distributor guidance and an IRONCAD-specific example; current version and other adapters unknown |

## 3. DDM-native capability inventory

The IDs in this table are stable for this scratch inventory. They are deliberately DDM-native and
are not `FTR-*`, `REQ-*` or IDEA domain IDs. Each row is an individual externally observable
capability or an explicit unknown, rather than a broad “DDM has PDM” heading.

### A. Document / Item Management

| Capability ID | DDM capability / observable behavior | Class | Source(s) | Context and limit |
|---|---|---|---|---|
| `DDM-CAP-DOC-001` | Central repository gathers CAD, Office documents, e-mail, images and other project data. | `CONFIRMED-OFFICIAL` | `S01`, `S05`, `S06` | Public product descriptions; repository topology and storage authority unknown. |
| `DDM-CAP-DOC-002` | Store a CAD part/assembly/drawing after assigning part number, description, category and a folder. | `CONFIRMED-OBSERVED` | `S02`, `S19` | Historical IRONCAD tutorial chapters; persistence key and failed-store behavior unknown. |
| `DDM-CAP-DOC-003` | Manage non-CAD Office documents, e-mails, imagery and other digital files. | `CONFIRMED-OFFICIAL` | `S01`, `S05`, `S06`, `S16` | Vendor feature wording; file-type limits and metadata contract unknown. |
| `DDM-CAP-DOC-004` | Assign/view item properties, categories and CAD-mapped attributes. | `CONFIRMED-OFFICIAL` | `S05`, `S06`, `S33` | Public feature wording and distributor configuration guidance; schema typing/evolution unknown. |
| `DDM-CAP-DOC-005` | Create/pin folders or dividers and set a current working folder. | `CONFIRMED-OBSERVED` | `S02`, `S19`, `S27` | Tutorial flow; folder identity, inheritance and transaction semantics unknown. |
| `DDM-CAP-DOC-006` | Move an item to a divider and rename it as distinct operations. | `CONFIRMED-OBSERVED` | `S02`, `S27` | Tutorial demonstrates separate commands; identifier/history effect unknown. |
| `DDM-CAP-DOC-007` | Create a copy with Save-As, distinct from move and rename. | `CONFIRMED-OBSERVED` | `S02`, `S27` | Tutorial demonstrates the user intent; whether every path creates a new internal identity is unknown. |
| `DDM-CAP-DOC-008` | Link an existing item into a folder/project through Reference To, distinct from Reserve To. | `CONFIRMED-OBSERVED` | `S26`, `S32` | Office tutorial shows non-modifying reference language; relation persistence/version pin unknown. |
| `DDM-CAP-DOC-009` | Keep additional/neutral file attachments associated with a managed record. | `CONFIRMED-OFFICIAL` | `S29`, `S30` | Historical release notes and tutorial terminology; attachment lineage/authority unknown. |
| `DDM-CAP-DOC-010` | Use reusable item/document templates. | `UNKNOWN` | `S01`–`S33` reviewed | No reviewed first-party source proves template behavior; public silence is not absence. |
| `DDM-CAP-DOC-011` | Stable logical item identity independent of visible name and Windows path. | `INFERRED` | `S02`, `S26`, `S27` | Separate Move/Rename/Save-As/Reference actions imply this user model; database key and immutability are not shown. |
| `DDM-CAP-DOC-012` | Alias or navigation link semantics beyond Reference To. | `UNKNOWN` | `S02`, `S26`, `S27` | Reference is shown, but generic aliases, multiple ordinary placements and follow-latest rules are not proven. |

### B. Version / Revision / History

| Capability ID | DDM capability / observable behavior | Class | Source(s) | Context and limit |
|---|---|---|---|---|
| `DDM-CAP-VER-001` | Manage CAD/document Issue or Revision states. | `CONFIRMED-OFFICIAL` | `S05`, `S06`, `S15`, `S16` | Product matrix/data sheets and tutorials; DDM semantics must not be equated to IDEA Revision. |
| `DDM-CAP-VER-002` | Display/select a specific CAD File Version and load an earlier version. | `CONFIRMED-OBSERVED` | `S02`, `S19` | Historical IRONCAD tutorial; exact version identity and immutability unknown. |
| `DDM-CAP-VER-003` | Retrieve the historical version used by a product/project record. | `CONFIRMED-OFFICIAL` | `S06` | “Correct historical version used” wording; no exact reconstruction test. |
| `DDM-CAP-VER-004` | Up-Issue a model/drawing and carry a change note/revision update. | `CONFIRMED-OBSERVED` | `S02`, `S27`, `S32` | Historical Change Order/Up-Issue flow; state transition and failure behavior unknown. |
| `DDM-CAP-VER-005` | Compare BOMs between assembly Issue levels. | `CONFIRMED-OFFICIAL` | `S07`, `S20` | BOM page and tutorial; comparison algorithm and exact identity rules unknown. |
| `DDM-CAP-VER-006` | View file/revision history or audit history. | `CONFIRMED-OFFICIAL` | `S01`, `S05`, `S06` | Public history/audit wording; immutability and tamper resistance unknown. |
| `DDM-CAP-VER-007` | Roll back/revert a revision or File Version. | `UNKNOWN` | `S05`, `S06`, `S19`, `S20` | Specific-version loading is not proof of revert semantics. |
| `DDM-CAP-VER-008` | A precise, immutable physical Generation distinct from Issue/Revision/File Version. | `UNKNOWN` | `S19`, `S32` | Public material exposes terms but not internal key/cardinality/immutability semantics. |
| `DDM-CAP-VER-009` | Branch/merge version lines or conflict merge. | `UNKNOWN` | `S01`–`S33` reviewed | No public source reviewed demonstrates branch/merge. |

### C. Checkout / Check-in / File Work

| Capability ID | DDM capability / observable behavior | Class | Source(s) | Context and limit |
|---|---|---|---|---|
| `DDM-CAP-WRK-001` | Reserve an item to a Workbench or selected project folder. | `CONFIRMED-OBSERVED` | `S02`, `S19`, `S26` | Historical tutorials; lock key, scope and lease unknown. |
| `DDM-CAP-WRK-002` | Reference an item without granting modification rights in the demonstrated flow. | `CONFIRMED-OBSERVED` | `S26`, `S32` | UI wording is observable; server enforcement and exact version pin unknown. |
| `DDM-CAP-WRK-003` | Show a reservation/reference relationship and associated modification-rights language. | `CONFIRMED-OBSERVED` | `S26`, `S32` | Demonstrated UI concept; permission precedence and owner identity unknown. |
| `DDM-CAP-WRK-004` | Store/Save/Load through the IRONCAD integration. | `CONFIRMED-OBSERVED` | `S02`, `S19` | Happy path only; save cardinality, failure and atomicity unknown. |
| `DDM-CAP-WRK-005` | Reserve affected items into a Change Order/project folder. | `CONFIRMED-OBSERVED` | `S02`, `S20` | Tutorial chapter sequence; propagation/partial acquisition semantics unknown. |
| `DDM-CAP-WRK-006` | Explicit UnReserve/cancel or undo a reservation. | `UNKNOWN` | `S25`, `S26`, `S32` | An `UnReserve` action label is present in historical admin evidence, but the complete user behavior and failure semantics are not demonstrated. |
| `DDM-CAP-WRK-007` | Resolve two-user stale edits or conflicting Check-in. | `UNKNOWN` | `S19`, `S26`, `S32` | No public concurrent test, conflict trace or policy is available. |
| `DDM-CAP-WRK-008` | Commit CAD files, metadata, relationships, history and reservation release atomically. | `UNKNOWN` | `S19`, `S20`, `S32` | Successful Store/Release is not proof of a shared transaction boundary. |
| `DDM-CAP-WRK-009` | Offline/local work during outage and reconnect/reconciliation. | `CONFIRMED-OFFICIAL` for a public multi-site claim; `UNKNOWN` for exact semantics | `S09`, `S18`, `S32` | Public Multi-Site material claims continued local work during outage in the admitted baseline; merge/order/recovery are unknown. |
| `DDM-CAP-WRK-010` | Workspace cleanup, orphan detection or recovery after interrupted file work. | `UNKNOWN` | `S12`, `S28`, `S32` | Maintenance/backup/recovery topics do not prove a workspace reconciliation contract. |
| `DDM-CAP-WRK-011` | All-or-none multi-document Check-in. | `UNKNOWN` | `S19`, `S20`, `S32` | No public source shows a multi-document failure test. |
| `DDM-CAP-WRK-012` | Automatic reference/dependency discovery and dependent-file handling. | `CONFIRMED-OFFICIAL` at product-surface level; exact behavior `UNKNOWN` | `S05`, `S06`, `S19` | Multi-CAD and assembly integration are documented/demonstrated; dependency graph, stale detection and atomic handling are unproven. |

### D. Search / Browse / Navigation

| Capability ID | DDM capability / observable behavior | Class | Source(s) | Context and limit |
|---|---|---|---|---|
| `DDM-CAP-SRCH-001` | Free/simple search across managed data. | `CONFIRMED-OFFICIAL` | `S05`, `S06`, `S22` | Product matrix/page and tutorial; index scope and completeness unknown. |
| `DDM-CAP-SRCH-002` | Advanced/property/category search. | `CONFIRMED-OFFICIAL` | `S05`, `S06`, `S22` | Public wording; filter semantics and performance unknown. |
| `DDM-CAP-SRCH-003` | Save a search as a favourite. | `CONFIRMED-OBSERVED` | `S02`, `S22` | Tutorial chapter; ownership/sharing and versioning unknown. |
| `DDM-CAP-SRCH-004` | Browse recent items. | `CONFIRMED-OFFICIAL` | `S06` | Public feature page; retention and permission filtering unknown. |
| `DDM-CAP-SRCH-005` | Browse categories and filter/sort result views. | `CONFIRMED-OFFICIAL` | `S06`, `S22` | Page/tutorial wording; UI and query semantics may vary by client. |
| `DDM-CAP-SRCH-006` | Full-text search over document contents. | `UNKNOWN` | `S05`, `S06`, `S22` | “Search” does not prove content indexing or Office/PDF text extraction. |
| `DDM-CAP-SRCH-007` | Where Used queries on parts, assemblies, drawings and documents. | `CONFIRMED-OFFICIAL` | `S06` | Public feature claim; exact relation/version semantics unknown. |
| `DDM-CAP-SRCH-008` | Used By/relationship navigation across every reference kind. | `UNKNOWN` | `S06`, `S19`, `S26` | Where Used is documented, but universal relationship traversal is not shown. |
| `DDM-CAP-SRCH-009` | Permission-filtered search result completeness and no-leak behavior. | `UNKNOWN` | `S05`, `S22`, `S25` | Access controls and search are separately shown; their enforcement interaction is unproven. |
| `DDM-CAP-SRCH-010` | Graphical relationship/product browsing. | `UNKNOWN` | `S02`, `S06`, `S08` | Graphical workflow is not evidence of a relationship graph view. |

### E. CAD / Office Integration

| Capability ID | DDM capability / observable behavior | Class | Source(s) | Context and limit |
|---|---|---|---|---|
| `DDM-CAP-CAD-001` | 3D multi-CAD integration for Creo Parametric, SOLIDWORKS, Autodesk Inventor, IRONCAD and Solid Edge. | `CONFIRMED-OFFICIAL` | `S05` | Matrix names adapters; behavior/versions/licence per adapter unknown. |
| `DDM-CAP-CAD-002` | 2D CAD integration for AutoCAD and Creo Elements Direct/Drafting. | `CONFIRMED-OFFICIAL` | `S05` | Matrix names adapters; no universal CAD support claim is made. |
| `DDM-CAP-CAD-003` | IRONCAD store/load, File Version selection and assembly integration. | `CONFIRMED-OBSERVED` | `S02`, `S19` | Historical tutorial; exact IRONCAD/DDM compatibility and atomicity unknown. |
| `DDM-CAP-CAD-004` | SOLIDWORKS support in DDM 2025.01 and named multi-CAD product matrix. | `CONFIRMED-OFFICIAL` | `S03`, `S05` | Release/page claim; installed integration and version matrix unknown. |
| `DDM-CAP-CAD-005` | CAD dependency/reference handling for assemblies/drawings. | `CONFIRMED-OFFICIAL` at integration level | `S05`, `S06`, `S19` | Assembly/product-structure flow is shown; complete dependency graph and stale rules unknown. |
| `DDM-CAP-CAD-006` | Transfer DDM attributes into CAD drawing title blocks. | `CONFIRMED-OFFICIAL` | `S06`, `S33` | Public feature/configuration guidance; mapping conflict and commit semantics unknown. |
| `DDM-CAP-CAD-007` | Transfer drawing change notes to update revision-history table. | `CONFIRMED-OFFICIAL` | `S06` | Public feature wording; exact format/CAD support unknown. |
| `DDM-CAP-CAD-008` | Configure CAD parameter mapping direction (CAD→DDM, DDM→CAD or both). | `SUPPORTED-SECONDARY` | `S33` | Distributor support guidance; current version/adapter coverage unknown. |
| `DDM-CAP-CAD-009` | Automatic PDF generation for managed CAD/drawings. | `CONFIRMED-OFFICIAL` | `S05`, `S06`, `S19`, `S29` | Current marketing plus historical tutorial/release claim; renderer/execution path unknown. |
| `DDM-CAP-CAD-010` | Generate neutral formats such as STEP, SAT, Parasolid, STL, DXF/DWG or 3D PDF through named adapters. | `CONFIRMED-OBSERVED` plus release-specific official claim | `S02`, `S19`, `S29`, `S30`, `S31` | Output is shown for named integrations; format support is not universal and version/licensing limits unknown. |
| `DDM-CAP-CAD-011` | Regenerate an existing neutral attachment when CAD is saved. | `CONFIRMED-OFFICIAL` (historical release-specific) | `S29`, repository CAD representation finding | DDM 2017.05 wording; not a current universal guarantee. |
| `DDM-CAP-CAD-012` | Automatic Checkout/Check-in initiated by a CAD add-in. | `UNKNOWN` | `S02`, `S19` | CAD-integrated Store/Save is shown, but the precise Checkout/Check-in protocol is not. |
| `DDM-CAP-CAD-013` | Maintain drawing/model relationship in the managed workflow. | `CONFIRMED-OBSERVED` | `S02`, `S19` | Tutorial shows drawing/model creation/link context; relation identity/history unknown. |
| `DDM-CAP-CAD-014` | Manage Microsoft Office documents and e-mails. | `CONFIRMED-OFFICIAL` | `S01`, `S05`, `S06`, `S16` | Product surface; Office add-in behavior and file transaction semantics unknown. |
| `DDM-CAP-CAD-015` | Add-in/toolbar integration in IRONCAD and DDM CAD options. | `CONFIRMED-OBSERVED` | `S02`, `S19` | Tutorial chapters show integration setup; API/extension contract unknown. |
| `DDM-CAP-CAD-016` | Headless/background conversion service, renderer ownership and licensing prerequisites. | `UNKNOWN` | `S06`, `S19`, `S29` | Public evidence proves output, not mechanism, process identity or server conversion. |
| `DDM-CAP-CAD-017` | Detect stale/outdated representations and gate Release on source match. | `UNKNOWN` | `S06`, `S19`, `S20`, `S29` | Automatic regeneration is not proof of stale state, source pin or release gate. |
| `DDM-CAP-CAD-018` | Support-current-version compatibility policy for each named CAD adapter. | `CONFIRMED-OFFICIAL` only as a published support claim | `S03`, `S05`, `S10`, `S11` | DDM 2025.01/2026.x materials differ; exact target support matrix remains unverified. |

### F. Product Structure / BOM

| Capability ID | DDM capability / observable behavior | Class | Source(s) | Context and limit |
|---|---|---|---|---|
| `DDM-CAP-BOM-001` | View product structure derived from CAD assemblies. | `CONFIRMED-OBSERVED` | `S02`, `S19`, `S20` | Tutorial shows structure surface; occurrence identity unknown. |
| `DDM-CAP-BOM-002` | Define/manage product structures independently from a CAD model. | `CONFIRMED-OFFICIAL` | `S05`, `S07` | Product matrix/BOM page claim; storage and authority semantics unknown. |
| `DDM-CAP-BOM-003` | Edit a BOM in the BOM Editor. | `CONFIRMED-OBSERVED` | `S02`, `S20` | Tutorial; validation and transaction boundaries unknown. |
| `DDM-CAP-BOM-004` | Modify quantities. | `CONFIRMED-OBSERVED` | `S02`, `S20` | Tutorial; units/validation/occurrence identity unknown. |
| `DDM-CAP-BOM-005` | Set position numbers and reorder BOM rows. | `CONFIRMED-OBSERVED` | `S02`, `S20` | Tutorial; persistence and conflict behavior unknown. |
| `DDM-CAP-BOM-006` | Add non-modelled items such as consumables to a BOM. | `CONFIRMED-OFFICIAL` | `S07`, `S20` | BOM page and tutorial; item identity and sourcing semantics unknown. |
| `DDM-CAP-BOM-007` | Hide items not required on a BOM view. | `CONFIRMED-OBSERVED` | `S02`, `S20` | Demonstrated UI setting; whether hidden means filtered, excluded or profile-driven is unknown. |
| `DDM-CAP-BOM-008` | Compare BOMs across assembly Issue levels. | `CONFIRMED-OFFICIAL` | `S07` | Public BOM comparison claim; exact diff semantics unknown. |
| `DDM-CAP-BOM-009` | Export BOM to Excel. | `CONFIRMED-OBSERVED` | `S02`, `S20` | Tutorial; output provenance/staleness unknown. |
| `DDM-CAP-BOM-010` | Generate/view BOM reports. | `CONFIRMED-OBSERVED` | `S02`, `S20` | Tutorial; report templates and audit are unknown. |
| `DDM-CAP-BOM-011` | Publish full BOM information to an ERP/MRP system through EUM/XML. | `CONFIRMED-OFFICIAL` | `S07`, `S13`, `S14` | Public EUM and release wording; schema, retry, duplicate and idempotency unknown. |
| `DDM-CAP-BOM-012` | Publish BOM or full documents to SharePoint. | `CONFIRMED-OFFICIAL` | `S07` | Public page; target configuration and error handling unknown. |
| `DDM-CAP-BOM-013` | Import Excel/CSV BOM into authoritative structure with preview/validation. | `UNKNOWN` | `S07`, `S20` | Export is shown; import/acceptance semantics are not proven. |
| `DDM-CAP-BOM-014` | Stable occurrence identity and exact structure snapshot/baseline. | `UNKNOWN` | `S02`, `S07`, `S20` | Structure and quantity are shown; snapshot/key semantics absent. |
| `DDM-CAP-BOM-015` | Reopen a released BOM exactly after later component Issues. | `UNKNOWN` | `S20`, repository staged-release finding | Staged release is demonstrated; exact released membership/version reproduction is not. |
| `DDM-CAP-BOM-016` | Where Used traversal for structure occurrences. | `CONFIRMED-OFFICIAL` at generic item level; occurrence behavior `UNKNOWN` | `S06`, `S20` | Where Used page claim does not prove occurrence/snapshot semantics. |

### G. Preview / Visualization / Representations

| Capability ID | DDM capability / observable behavior | Class | Source(s) | Context and limit |
|---|---|---|---|---|
| `DDM-CAP-PRE-001` | Preview managed documents/files. | `CONFIRMED-OFFICIAL` | `S05`, `S17` | Product matrix/Web data sheet; supported format list and access controls unknown. |
| `DDM-CAP-PRE-002` | Automatically generate thumbnails for CAD data. | `CONFIRMED-OFFICIAL` | `S06`, `S15` | Marketing/data sheet wording; renderer/queue/failure semantics unknown. |
| `DDM-CAP-PRE-003` | Automatically create/open a PDF preview for a drawing. | `CONFIRMED-OBSERVED` | `S19`, `S30` | Historical IRONCAD tutorial and PDF preview release note; current parity unknown. |
| `DDM-CAP-PRE-004` | Browser/Web surface for viewing managed data and product structure. | `CONFIRMED-OFFICIAL` plus observed tutorial | `S05`, `S17`, `S21` | Web product surface and tutorial; edition/entitlement and exact viewer capabilities unknown. |
| `DDM-CAP-PRE-005` | Keep neutral formats/PDF as attachments or previews of a managed record. | `CONFIRMED-OFFICIAL` | `S29`, `S30` | Historical release wording; no source Generation pin is shown. |
| `DDM-CAP-PRE-006` | Print/publish a representation or report. | `CONFIRMED-OFFICIAL` for BOM/SharePoint paths; general publishing `UNKNOWN` | `S07`, `S20` | Specific outputs are shown; broad publishing/print policy unknown. |
| `DDM-CAP-PRE-007` | Display representation freshness/stale/failed status after source change. | `UNKNOWN` | `S06`, `S19`, `S29` | Regeneration claim does not prove a visible state model. |
| `DDM-CAP-PRE-008` | Pin each representation to exact source Issue/File Version and digest. | `UNKNOWN` | `S19`, `S29`, `S30` | Public material does not expose an immutable source pointer or digest. |

### H. Workflow / Review / Approval

| Capability ID | DDM capability / observable behavior | Class | Source(s) | Context and limit |
|---|---|---|---|---|
| `DDM-CAP-WF-001` | Configure graphical workflows for business processes. | `CONFIRMED-OFFICIAL` | `S08`, `S05` | Vendor workflow page; definition storage/versioning unknown. |
| `DDM-CAP-WF-002` | Build multiple workflows without a stated numerical limit. | `CONFIRMED-OFFICIAL` | `S08` | Page says no limits; this is a vendor claim, not a capacity test. |
| `DDM-CAP-WF-003` | Use formal state-based or informal permission-based state changes. | `CONFIRMED-OFFICIAL` | `S08`, `S20` | Workflow page and tutorial; lifecycle/review/release distinction may vary by setup. |
| `DDM-CAP-WF-004` | See an interactive graphical workflow preview. | `CONFIRMED-OFFICIAL` | `S08` | Product page; accessibility/current UI unknown. |
| `DDM-CAP-WF-005` | Configure engineering change, new-product, internal-audit, non-conformance, corrective-action/CAPA and document-signoff workflows. | `CONFIRMED-OFFICIAL` | `S08` | Named generic starting points; customer configuration and object model unknown. |
| `DDM-CAP-WF-006` | Formal approval/decision with reject/resubmit. | `CONFIRMED-OBSERVED` | `S20`, `S23`, `S24` | Official videos; approval persistence/race semantics unknown. |
| `DDM-CAP-WF-007` | Change lifecycle state and release selected items/folders through workflow. | `CONFIRMED-OBSERVED` | `S02`, `S20` | Tutorial; release authority and atomicity unknown. |
| `DDM-CAP-WF-008` | Change Order creates tasks and allows work reassignment. | `CONFIRMED-OBSERVED` | `S02`, `S20` | Tutorial; task object/notification semantics unknown. |
| `DDM-CAP-WF-009` | Record workflow actor/time/history/audit trail. | `CONFIRMED-OFFICIAL` | `S05`, `S08`, `S23` | Public audit wording and visible decisions; tamper resistance/transactionality unknown. |
| `DDM-CAP-WF-010` | Workflow notifications. | `CONFIRMED-OFFICIAL` | `S05`, `S21` | Product matrix/Web surface; channels/retry/preferences unknown. |
| `DDM-CAP-WF-011` | Parallel/serial approval, quorum or delegated approval. | `UNKNOWN` | `S08`, `S23`, `S24` | Formal approval is shown; topology/rules are not. |
| `DDM-CAP-WF-012` | Version workflow definitions while preserving historical runtime instances. | `UNKNOWN` | `S08`, `S20`, `S24` | No public versioning contract reviewed. |
| `DDM-CAP-WF-013` | First-class ECR/ECO/change-order domain object with durable scope and outcome. | `UNKNOWN` | `S02`, `S08`, `S20` | Change Order workflow is shown, but object schema/authority is not. |
| `DDM-CAP-WF-014` | Workflow comments/discussions/decision rationale. | `UNKNOWN` | `S20`, `S23`, `S24` | No reviewed source proves comments as a first-class feature. |

### I. Release / Controlled Baselines

| Capability ID | DDM capability / observable behavior | Class | Source(s) | Context and limit |
|---|---|---|---|---|
| `DDM-CAP-REL-001` | Release Manager controls lifecycle/release actions. | `CONFIRMED-OBSERVED` | `S02`, `S20` | Historical tutorial; authority and transactionality unknown. |
| `DDM-CAP-REL-002` | Select an assembly/subassembly scope for release. | `CONFIRMED-OBSERVED` | `S20`, repository staged-release finding | Tutorial demonstrates selected scope; dependency rules unknown. |
| `DDM-CAP-REL-003` | Release related drawings/items along with selected scope. | `CONFIRMED-OBSERVED` | `S20` | Tutorial; exact membership model unknown. |
| `DDM-CAP-REL-004` | Release one subassembly before parent/other sibling assemblies. | `CONFIRMED-OBSERVED` | `S20`, staged-release finding | Visible staged flow; no claim about every configuration. |
| `DDM-CAP-REL-005` | Remove already Released items from a later approval folder/action. | `CONFIRMED-OBSERVED` | `S20`, staged-release finding | Tutorial sequence; no universal cascade rule. |
| `DDM-CAP-REL-006` | Pin exact Revision/File Version/physical member identity in a Release Record. | `UNKNOWN` | `S20`, `S32` | Specific-version loading and release selection do not prove immutable pins. |
| `DDM-CAP-REL-007` | Reproduce a complete historical released package after newer Issues exist. | `UNKNOWN` | `S20`, `S32` | No exact package reconstruction demonstration. |
| `DDM-CAP-REL-008` | Automatically gate release on complete dependencies or fresh required representations. | `UNKNOWN` | `S20`, `S29` | Release tutorial shows selected scope, not dependency/representation gates. |
| `DDM-CAP-REL-009` | Up-Issue/revise an item after release. | `CONFIRMED-OBSERVED` | `S02`, `S20` | Up-Issue and lifecycle actions are shown; exact release history semantics unknown. |
| `DDM-CAP-REL-010` | Create/export a formal release package with durable evidence. | `UNKNOWN` | `S05`, `S20` | Release Manager and reports are shown; package schema/evidence completeness unknown. |

### J. Users / Groups / Permissions / Administration

| Capability ID | DDM capability / observable behavior | Class | Source(s) | Context and limit |
|---|---|---|---|---|
| `DDM-CAP-SEC-001` | Dedicated DDM Administration surface. | `CONFIRMED-OBSERVED` | `S25`, `S28` | Historical admin application; current UI/module entitlement unknown. |
| `DDM-CAP-SEC-002` | Create/search/edit users and disable/enable/reset password. | `CONFIRMED-OBSERVED` | `S25` | Window labelled `2020.04.200622`; no current authentication proof. |
| `DDM-CAP-SEC-003` | Create/manage user groups. | `CONFIRMED-OBSERVED` | `S25`, `S28` | Historical UI/training; membership semantics unknown. |
| `DDM-CAP-SEC-004` | Configure business units and organizational access context. | `CONFIRMED-OBSERVED` | `S25`, `S28` | Historical UI/training; hierarchy and segregation unknown. |
| `DDM-CAP-SEC-005` | Configure profiles. | `CONFIRMED-OBSERVED` | `S25`, `S28` | Historical UI/training; profile authority unknown. |
| `DDM-CAP-SEC-006` | Configure group × lifecycle-state × action access-control matrix. | `CONFIRMED-OBSERVED` | `S25` | Directly visible matrix; precedence and enforcement not shown. |
| `DDM-CAP-SEC-007` | Explain an effective permission through a user summary and granting group. | `CONFIRMED-OBSERVED` | `S25` | Historical permission summary; no guarantee of complete explanation model. |
| `DDM-CAP-SEC-008` | Configure item/folder access controls tied to lifecycle state. | `CONFIRMED-OFFICIAL` plus observed UI | `S05`, `S25`, `S28` | Public matrix/training/UI; folder inheritance and conflict rules unknown. |
| `DDM-CAP-SEC-009` | Secure access and authorized browser/workstation use. | `CONFIRMED-OFFICIAL` | `S05`, `S17` | Product wording; transport/session/identity enforcement unknown. |
| `DDM-CAP-SEC-010` | Domain authentication and/or MFA/2FA in named release material. | `CONFIRMED-OFFICIAL` (release-specific claim) | `S12`, `S32` | Historical release/web workshop claims; current policy and protocol unknown. |
| `DDM-CAP-SEC-011` | Account/permission changes are audited. | `CONFIRMED-OBSERVED` for user audit action; general policy audit `UNKNOWN` | `S25`, `S28`, `S32` | User “Show audit” is visible; immutable permission-change evidence not proven. |
| `DDM-CAP-SEC-012` | Explicit deny/inheritance/exception precedence across item, folder, state and project. | `UNKNOWN` | `S25`, `S28` | Matrix exists; conflict resolution is not documented. |
| `DDM-CAP-SEC-013` | Authorization enforced consistently through CAD, Office, Web, SQL/reporting and integration paths. | `UNKNOWN` | `S05`, `S21`, `S25`, `S32` | Multiple clients are named; cross-path enforcement is untested. |
| `DDM-CAP-SEC-014` | Login/session events, token/cookie behavior and service identities. | `UNKNOWN` | `S12`, `S17`, `S25` | Public wording does not disclose implementation. |

### K. Projects / Organizational Separation

| Capability ID | DDM capability / observable behavior | Class | Source(s) | Context and limit |
|---|---|---|---|---|
| `DDM-CAP-PRJ-001` | Gather files and product data in project folders. | `CONFIRMED-OFFICIAL` | `S01`, `S06` | Product page; project-folder authority and identity unknown. |
| `DDM-CAP-PRJ-002` | Create actions/tasks against folders or projects. | `CONFIRMED-OFFICIAL` | `S05`, `S06` | RACI/RAG attributes named; task lifecycle unknown. |
| `DDM-CAP-PRJ-003` | Make project data accessible to project members. | `CONFIRMED-OFFICIAL` | `S01` | Public statement; membership/ACL enforcement unknown. |
| `DDM-CAP-PRJ-004` | Use business units as an organizational/access boundary. | `CONFIRMED-OBSERVED` | `S25`, `S28` | Historical admin UI/training; segregation/inheritance unknown. |
| `DDM-CAP-PRJ-005` | Reserve/reference existing items into project folders. | `CONFIRMED-OBSERVED` | `S19`, `S26` | User flow; cross-project version and authority behavior unknown. |
| `DDM-CAP-PRJ-006` | Cross-project reuse with controlled access scope. | `UNKNOWN` | `S01`, `S26`, `S32` | Reuse/reference is visible; scope and follow-version policy are not. |
| `DDM-CAP-PRJ-007` | Project start/due dates and RACI/RAG context. | `CONFIRMED-OFFICIAL` | `S06`, `S15` | Public feature/data-sheet wording; reporting/reminder behavior unknown. |

### L. Audit / Traceability

| Capability ID | DDM capability / observable behavior | Class | Source(s) | Context and limit |
|---|---|---|---|---|
| `DDM-CAP-AUD-001` | Full audit trail is a marketed DDM capability. | `CONFIRMED-OFFICIAL` | `S05`, `S08` | Public claim; coverage, retention and immutability unknown. |
| `DDM-CAP-AUD-002` | Record/view revision/file history. | `CONFIRMED-OFFICIAL` | `S01`, `S06`, `S19` | Product wording/tutorial; event schema unknown. |
| `DDM-CAP-AUD-003` | Record workflow decisions with actor/time context. | `CONFIRMED-OBSERVED` plus official claim | `S08`, `S20`, `S23` | Visible approval/history flow; tamper resistance/atomicity unknown. |
| `DDM-CAP-AUD-004` | Record an audit event when a PDF preview is viewed in DDM Web. | `CONFIRMED-OFFICIAL` (historical release-specific) | `S30` | DDM 2016.05 note; current edition behavior unknown. |
| `DDM-CAP-AUD-005` | User audit action/permission summary. | `CONFIRMED-OBSERVED` | `S25` | Historical admin UI; scope and retention unknown. |
| `DDM-CAP-AUD-006` | Export/report audit history for compliance. | `UNKNOWN` | `S05`, `S20`, `S25`, `S28` | Audit and reports are separately named; export semantics not shown. |
| `DDM-CAP-AUD-007` | Login/session/security event history. | `UNKNOWN` | `S12`, `S17`, `S25` | No reviewed source proves it. |
| `DDM-CAP-AUD-008` | Tamper-resistant/append-only audit evidence. | `UNKNOWN` | `S05`, `S08`, `S25` | “Audit trail” marketing wording is not a tamper-resistance proof. |

### M. Import / Export / Migration

| Capability ID | DDM capability / observable behavior | Class | Source(s) | Context and limit |
|---|---|---|---|---|
| `DDM-CAP-IMP-001` | Export BOM to Excel. | `CONFIRMED-OBSERVED` | `S02`, `S20` | Tutorial; exact source state/provenance unknown. |
| `DDM-CAP-IMP-002` | Publish BOM to ERP/MRP through XML/EUM. | `CONFIRMED-OFFICIAL` | `S07`, `S13`, `S14` | Vendor feature/release wording; contract/retry/idempotency unknown. |
| `DDM-CAP-IMP-003` | Publish to SharePoint and transfer full documents. | `CONFIRMED-OFFICIAL` | `S07` | Public page; destination auth/error semantics unknown. |
| `DDM-CAP-IMP-004` | EUM manual update option for long-lead-time items. | `CONFIRMED-OFFICIAL` | `S07` | Public BOM page; workflow/control unknown. |
| `DDM-CAP-IMP-005` | Route/export XML through Routing Server, watched-folder or Web/manual send paths. | `CONFIRMED-OFFICIAL` (release-specific) | `S13`, `S14`, `S32` | Historical release wording; installed components and operational guarantees unknown. |
| `DDM-CAP-IMP-006` | XML-to-CSV or alternate XML output. | `CONFIRMED-OFFICIAL` (release-specific) | `S14` | DDM 2025.01 release wording; schema/version support unknown. |
| `DDM-CAP-IMP-007` | Bulk registration/mass import of files or metadata. | `UNKNOWN` | `S05`, `S07`, `S28` | No reviewed first-party source proves general mass import. |
| `DDM-CAP-IMP-008` | Import Excel/CSV as a governed BOM candidate. | `UNKNOWN` | `S07`, `S20` | Export is evidenced; import/preview/acceptance is not. |
| `DDM-CAP-IMP-009` | Package/archive export and import. | `UNKNOWN` | `S05`, `S28` | No public package contract reviewed. |
| `DDM-CAP-IMP-010` | Migration/restore that preserves identity, history, relationships and permissions. | `UNKNOWN` | `S28`, `S32` | Training mentions backup/recovery topics only; correctness is unproven. |

### N. Administration / Configuration

| Capability ID | DDM capability / observable behavior | Class | Source(s) | Context and limit |
|---|---|---|---|---|
| `DDM-CAP-CFG-001` | Configure document/item attributes, categories and validation. | `CONFIRMED-OBSERVED` plus official claim | `S05`, `S06`, `S25` | Historical admin UI and product wording; schema migration unknown. |
| `DDM-CAP-CFG-002` | Configure automatic/customer numbering. | `CONFIRMED-OFFICIAL` plus observed tutorial | `S05`, `S06`, `S25` | Public claim/tutorial; uniqueness, concurrency and rollback unknown. |
| `DDM-CAP-CFG-003` | Configure lifecycle states and state-specific access. | `CONFIRMED-OBSERVED` | `S20`, `S25`, `S28` | Historical UI/tutorial; state transition authority unknown. |
| `DDM-CAP-CFG-004` | Configure graphical workflows without programming. | `CONFIRMED-OFFICIAL` | `S08` | Vendor claim; definition versioning and deployment safety unknown. |
| `DDM-CAP-CFG-005` | Configure CAD parameter mapping and data direction. | `SUPPORTED-SECONDARY` | `S33`, `S06` | Distributor guidance; adapter/version coverage unknown. |
| `DDM-CAP-CFG-006` | Configure folders/dividers/project organization. | `CONFIRMED-OBSERVED` | `S02`, `S25`, `S27` | UI/tutorial; folder migration/inheritance unknown. |
| `DDM-CAP-CFG-007` | Configure file/secondary-format generation rules. | `CONFIRMED-OFFICIAL` (historical/feature claim) | `S05`, `S29`, `S30` | Release/feature wording; current options and worker behavior unknown. |
| `DDM-CAP-CFG-008` | Configure user profiles. | `CONFIRMED-OBSERVED` | `S25`, `S28` | Historical UI/training; profile authority unknown. |
| `DDM-CAP-CFG-009` | Configure Web branding/custom logo. | `CONFIRMED-OFFICIAL` (data-sheet/product claim) | `S05`, `S17` | Public Web wording; current edition/limits unknown. |
| `DDM-CAP-CFG-010` | Configure scripts, rules or public extension hooks. | `UNKNOWN` | `S05`, `S08`, `S15` | No supported scripting/API contract was identified. |
| `DDM-CAP-CFG-011` | Admin maintenance, database statistics and purge controls. | `CONFIRMED-OFFICIAL` (release-specific) | `S12`, `S28` | DDM 2026.04/training context; safe purge/retention semantics unknown. |
| `DDM-CAP-CFG-012` | Admin backup/restore configuration and runbook. | `CONFIRMED-OFFICIAL` as training topic; behavior `UNKNOWN` | `S28`, `S32` | Topic is named, but no public restore result or runbook contract. |

### O. Notifications / Tasks / Collaboration

| Capability ID | DDM capability / observable behavior | Class | Source(s) | Context and limit |
|---|---|---|---|---|
| `DDM-CAP-TASK-001` | Create actions against folders/projects with RACI/RAG attributes. | `CONFIRMED-OFFICIAL` | `S06` | Product page; task state model unknown. |
| `DDM-CAP-TASK-002` | Automatically create Change Order tasks. | `CONFIRMED-OBSERVED` | `S02`, `S20` | Tutorial; task commit/assignment semantics unknown. |
| `DDM-CAP-TASK-003` | Reassign workflow work. | `CONFIRMED-OBSERVED` | `S02`, `S20` | Tutorial; authorization/audit behavior unknown. |
| `DDM-CAP-TASK-004` | Notifications associated with workflows/projects. | `CONFIRMED-OFFICIAL` | `S05`, `S21` | Product matrix/Web surface; channels, retries and subscriptions unknown. |
| `DDM-CAP-TASK-005` | Subscription/watch/reminder controls. | `UNKNOWN` | `S05`, `S21`, `S28` | Notifications are named, but subscription/reminder semantics are not proven in reviewed primary sources. |
| `DDM-CAP-TASK-006` | Comments/discussions attached to tasks or approvals. | `UNKNOWN` | `S20`, `S23`, `S24` | No reviewed source proves first-class discussion behavior. |
| `DDM-CAP-TASK-007` | Inbox/task queue with due-state tracking. | `UNKNOWN` | `S03`, `S21`, `S28` | Workbench/Web/task surfaces are named; queue semantics are not. |
| `DDM-CAP-TASK-008` | Deadline reminders/escalations. | `UNKNOWN` | `S06`, `S28` | Project dates are claimed; reminder/escalation behavior is unproven. |

### P. Reporting

| Capability ID | DDM capability / observable behavior | Class | Source(s) | Context and limit |
|---|---|---|---|---|
| `DDM-CAP-RPT-001` | BOM reports. | `CONFIRMED-OBSERVED` | `S02`, `S20` | Tutorial; report definition/versioning unknown. |
| `DDM-CAP-RPT-002` | Audit trail/history reporting surface. | `CONFIRMED-OFFICIAL` | `S05`, `S08`, `S25` | Public claim/UI; report completeness/export unknown. |
| `DDM-CAP-RPT-003` | Project/task status reports. | `UNKNOWN` | `S01`, `S06`, `S20` | Project/task features do not prove a reporting surface. |
| `DDM-CAP-RPT-004` | Reports and watermarks in Administration. | `CONFIRMED-OBSERVED` | `S25` | Historical admin ribbon; current module and output semantics unknown. |
| `DDM-CAP-RPT-005` | Read-only SQL reporting account/interface. | `CONFIRMED-OFFICIAL` (release-specific) | `S12`, `S32` | Release note wording; not evidence of a supported write API. |
| `DDM-CAP-RPT-006` | Database statistics for users, CAD versions and disk usage. | `CONFIRMED-OFFICIAL` (DDM 2026.04 claim) | `S12` | Release-specific feature; metric definitions/accuracy unknown. |
| `DDM-CAP-RPT-007` | Custom report designer/query builder. | `UNKNOWN` | `S05`, `S12`, `S25` | Reports are named; a general custom builder is not proven. |

### Q. Deployment / Operations

| Capability ID | DDM capability / observable behavior | Class | Source(s) | Context and limit |
|---|---|---|---|---|
| `DDM-CAP-OPS-001` | Windows/SQL Server deployment profile. | `CONFIRMED-OFFICIAL` | `S05`, `S10`, `S15` | Public matrix/data sheet; exact topology and licence unknown. |
| `DDM-CAP-OPS-002` | Windows client/server support profile. | `CONFIRMED-OFFICIAL` | `S05`, `S10` | Matrix lists versions; target build not identified. |
| `DDM-CAP-OPS-003` | Published DDM 2026.x support wording for Windows 10/11, Server 2019/2022/2025 and listed SQL variants. | `CONFIRMED-OFFICIAL` | `S10`, `S32` | Planning input, not installed-environment evidence. |
| `DDM-CAP-OPS-004` | Access through an authorised workstation and standard browser for Web. | `CONFIRMED-OFFICIAL` | `S05`, `S17`, `S21` | Public Web wording/tutorial; security and browser compatibility unknown. |
| `DDM-CAP-OPS-005` | Single physical or virtual deployment option in product matrix. | `CONFIRMED-OFFICIAL` | `S05` | Matrix wording; does not prohibit other topologies. |
| `DDM-CAP-OPS-006` | Multi-site replication option. | `CONFIRMED-OFFICIAL` | `S09`, `S18` | Product/data-sheet claim; consistency/failover unknown. |
| `DDM-CAP-OPS-007` | Secure/Remote File Server, Routing Server, Action Server and Web components named in release material. | `CONFIRMED-OFFICIAL` (release-specific) | `S12`, `S13`, `S32` | Component names are not an architecture or API guarantee. |
| `DDM-CAP-OPS-008` | Performance improvement claim up to 10x open/save in DDM 2025.01. | `CONFIRMED-OFFICIAL` as vendor claim | `S03` | No workload, baseline, percentile or independent benchmark. |
| `DDM-CAP-OPS-009` | Improvements for large assemblies/high-latency environments. | `CONFIRMED-OFFICIAL` (release-specific) | `S03`, `S12` | Release wording; measurable capacity unknown. |
| `DDM-CAP-OPS-010` | Database statistics/health visibility. | `CONFIRMED-OFFICIAL` (release-specific) | `S12` | Feature claim; no independent metric validation. |
| `DDM-CAP-OPS-011` | Backup/recovery topics in official administration training. | `CONFIRMED-OFFICIAL` as training topic; behavior `UNKNOWN` | `S28` | No backup scope, restore result, RPO/RTO or runbook was public. |
| `DDM-CAP-OPS-012` | Unlimited scalability/per-user licensing wording. | `CONFIRMED-OFFICIAL` as product-matrix claim | `S05` | Not a capacity test; CAD data sheet's floating concurrent-user wording differs. |
| `DDM-CAP-OPS-013` | Floating concurrent-user licence pool versus per-user product-matrix wording. | `CONFIRMED-OFFICIAL` as conflicting public wording | `S05`, `S15`, `S32` | Contract/edition/seat semantics require vendor clarification. |
| `DDM-CAP-OPS-014` | Upgrade, rollback and safe deployment procedure. | `UNKNOWN` | `S03`, `S11`, `S28` | Release availability is not an upgrade/rollback runbook. |
| `DDM-CAP-OPS-015` | RPO/RTO, failover and measured replication recovery. | `UNKNOWN` | `S09`, `S18`, `S28`, `S32` | Public replication/backup claims do not establish recovery objectives. |

### R. Integration / API / Extension

| Capability ID | DDM capability / observable behavior | Class | Source(s) | Context and limit |
|---|---|---|---|---|
| `DDM-CAP-INT-001` | ERP/MRP integration through Enterprise Update Manager. | `CONFIRMED-OFFICIAL` | `S05`, `S07` | Product feature; contract/auth/retry unknown. |
| `DDM-CAP-INT-002` | SharePoint publication/full document transfer. | `CONFIRMED-OFFICIAL` | `S07` | Product page; destination semantics unknown. |
| `DDM-CAP-INT-003` | XML/CSV/alternate-XML exchange paths. | `CONFIRMED-OFFICIAL` (release-specific) | `S13`, `S14` | Release notes; schema/versioning unknown. |
| `DDM-CAP-INT-004` | Routing Server, watched-folder and Web/manual send integration modes. | `CONFIRMED-OFFICIAL` (release-specific) | `S13`, `S14`, `S32` | Release-specific names/flows; operational guarantees unknown. |
| `DDM-CAP-INT-005` | Read-only SQL reporting interface/account. | `CONFIRMED-OFFICIAL` (release-specific) | `S12`, `S32` | Reporting-only wording; not a general business API. |
| `DDM-CAP-INT-006` | Internal WCF layer mentioned in release evidence. | `CONFIRMED-OFFICIAL` (release-specific) | `S12`, `S32` | Internal component name; public support/contract not established. |
| `DDM-CAP-INT-007` | Supported public REST/SOAP/Open API or SDK. | `UNKNOWN` | `S05`, `S07`, `S12`, `S32` | No public general API contract was identified. |
| `DDM-CAP-INT-008` | Webhooks/event hooks and versioned integration events. | `UNKNOWN` | `S07`, `S13`, `S14` | EUM/export paths are not evidence of webhooks. |
| `DDM-CAP-INT-009` | CAD add-ins/toolbar extension point. | `CONFIRMED-OBSERVED` | `S02`, `S19` | Integration UI is shown; extensibility contract unknown. |
| `DDM-CAP-INT-010` | External-system authentication, schemas, retries, deduplication and idempotency. | `UNKNOWN` | `S07`, `S13`, `S14`, `S32` | Public integration feature claims do not disclose these controls. |
| `DDM-CAP-INT-011` | PDM/PLM interoperability beyond named CAD/ERP/SharePoint paths. | `UNKNOWN` | `S05`, `S07`, `S32` | No broad neutral PDM/PLM API or exchange contract reviewed. |
| `DDM-CAP-INT-012` | Public scripting/custom rules/extensions. | `UNKNOWN` | `S08`, `S15`, `S32` | “No programming” workflow configuration is not a scripting API. |

### S. Other / vendor-service capabilities

| Capability ID | DDM capability / observable behavior | Class | Source(s) | Context and limit |
|---|---|---|---|---|
| `DDM-CAP-OTH-001` | ISO/FDA audit/compliance support positioning. | `CONFIRMED-OFFICIAL` as vendor positioning | `S01`, `S08` | Support/marketing statement; does not prove certification or customer compliance. |
| `DDM-CAP-OTH-002` | Vendor-provided training/support and configured installation service. | `CONFIRMED-OFFICIAL` as service offering | `S01`, `S28` | Service capability, not necessarily DDM product behavior. |
| `DDM-CAP-OTH-003` | DDM-specific CAD toolbox/component authoring such as IC Mechanical. | `NOT A DDM CAPABILITY / OUTSIDE INVENTORY` | `S01` | This is an adjacent IRONCAD/IC Mechanical product concern, not evidence that DDM owns the modeling capability. |
| `DDM-CAP-OTH-004` | Other DDM-native capability outside families A–R. | `UNKNOWN` | `S01`–`S33` reviewed | No additional independently proven DDM-native family was needed for this scratch inventory. |

## 4. Evidence summary by family

Counts below count inventory rows, not features in a contract. A row can contain a bounded
qualification such as “official claim, exact semantics unknown”; that qualification is retained in
the matrix. The evidence columns count rows containing that label; therefore the columns are not
mutually exclusive when one row contains both an official/observed surface and an `UNKNOWN` exact
semantic. `SUPPORTED-SECONDARY` and `INFERRED` are not silently counted as official confirmation.

| Family | Inventory rows | Rows with official evidence | Rows with observed evidence | Secondary | Inferred | Rows containing `UNKNOWN` |
|---|---:|---:|---:|---:|---:|---:|
| A Document / Item | 12 | 4 | 5 | 0 | 1 | 2 |
| B Version / Revision | 9 | 4 | 2 | 0 | 0 | 3 |
| C Checkout / File Work | 12 | 2 | 5 | 0 | 0 | 7 |
| D Search / Browse | 10 | 5 | 1 | 0 | 0 | 4 |
| E CAD / Office | 18 | 10 | 4 | 1 | 0 | 3 |
| F Product Structure / BOM | 16 | 6 | 7 | 0 | 0 | 4 |
| G Preview / Representation | 8 | 5 | 1 | 0 | 0 | 3 |
| H Workflow / Approval | 14 | 7 | 3 | 0 | 0 | 4 |
| I Release / Baseline | 10 | 0 | 6 | 0 | 0 | 4 |
| J Security / Administration | 14 | 3 | 8 | 0 | 0 | 4 |
| K Projects / Organization | 7 | 4 | 2 | 0 | 0 | 1 |
| L Audit / Traceability | 8 | 3 | 2 | 0 | 0 | 3 |
| M Import / Export / Migration | 10 | 5 | 1 | 0 | 0 | 4 |
| N Administration / Configuration | 12 | 6 | 4 | 1 | 0 | 2 |
| O Tasks / Collaboration | 8 | 2 | 2 | 0 | 0 | 4 |
| P Reporting | 7 | 3 | 2 | 0 | 0 | 2 |
| Q Deployment / Operations | 15 | 13 | 0 | 0 | 0 | 3 |
| R Integration / API | 12 | 6 | 1 | 0 | 0 | 5 |
| S Other | 4 | 2 | 0 | 0 | 0 | 1 |
| **Total (overlap allowed)** | **206** | **90** | **56** | **2** | **1** | **63** |

The table is a triage aid only. Because some rows carry a mixed “surface is evidenced, exact
semantics unknown” qualification, a later canonical matrix should preserve the row-level class and
not derive a false completeness percentage from these counts.

## 5. High-value unknowns requiring an authorized target or vendor clarification

These are the most consequential unknowns for an IDEA comparison. They are not findings that DDM
lacks the capability.

| Area | Unknown that public evidence cannot resolve | Minimum next evidence |
|---|---|---|
| Identity/version | Internal item key; Issue/Revision/File Version relationship; immutable physical Generation; Save-As identity rule | Pinned authorized package, schema-neutral black-box identity/version test and vendor terminology clarification |
| Reserve/Reference | Owner key, scope/propagation, lease/expiry, same-user replay, disconnect/crash, forced release, stale Check-in | Two-user isolated runtime scenarios with before/after state and safe rollback |
| Check-in atomicity | Database/file/metadata/history/BOM/reservation transaction boundary, retries, idempotency and orphan recovery | Fault-injection or supported failure scenarios in disposable target environment |
| Search | Full-text scope, permission filtering, result completeness, saved-search ownership and performance | Controlled corpus/index test across CAD/Office/Web users |
| CAD conversion | Renderer/API mechanism, foreground/background execution, licensing, supported format/version matrix, failed conversion handling | Vendor-supported integration test with exact CAD/DDM builds and format corpus |
| Representations | Exact source Issue/File Version pin, digest, freshness/stale status and Release gate | Create source advance/failure scenarios; inspect retained metadata and Release Manager behavior |
| Product Structure/BOM | Occurrence identity, structure snapshots, BOM comparison semantics, Excel import acceptance, exact released baseline | Multi-level structure fixture and controlled export/import/release tests |
| Workflow/change | Definition versioning, runtime pinning, approval race/quorum/delegation, comments, ECR/ECO object authority | Two-actor workflow tests and configuration/version audit |
| Authorization | ACL precedence, inheritance/deny, cross-client enforcement, permission-change lifecycle and audit | Matrix conflict tests across CAD/Office/Web/reporting paths |
| Release | Exact membership/version pin, dependency gate, atomic multi-item release, historical package reconstruction | Staged-release test with later revisions and injected interruption |
| Integration/API | Supported public API/SDK, schemas, auth, events, retries, duplicate handling, idempotency | Vendor interface documentation and permitted read-only contract test |
| Replication/recovery | Ordering, lag, conflict resolution, partition recovery, backup coverage, restore correctness, RPO/RTO | Multi-site lab with synthetic data, snapshot/restore and measured evidence |
| Capacity | User/concurrency envelope, large assemblies, file size/corpus growth and latency distributions | Reproducible workload benchmark; do not substitute “unlimited scalability” marketing language |

## 6. Evidence contradictions and temporal cautions

1. **Release labels differ.** The repository's admitted baseline observed DDM 2026.04 as the public
   enhancement release while the support/compatibility material contained 2026.07 wording. Neither
   identifies the build that would be installed for an evaluation.
2. **Web BOM surface differs by source.** An official Web tutorial demonstrates structure/BOM/export,
   while the public Product Matrix has left some related Web cells blank. Edition, date and
   entitlement are unknown.
3. **Historical tutorials are not current parity.** Several videos show older interfaces; the admin
   demonstration visibly carries `2020.04.200622`. They prove a vendor demonstration in that
   context only.
4. **Licensing wording differs.** The Product Matrix uses per-user wording, while the 2022.02 CAD
   data sheet describes a floating concurrent-user pool. This is a vendor clarification question,
   not an inferred current contract.
5. **Marketing terms are not assurances.** “Secure access”, “full audit”, “unlimited scalability”,
   “automatic” and “up to 10x” are retained as vendor claims. They do not prove implementation,
   enforcement, capacity or compliance.
6. **Internal component names are bounded.** SQL, WCF, Action Server, Routing Server and file-server
   names in release material do not establish a supported general Open API or business authority.

## 7. Explicit non-claims

This evidence note does not claim that DDM:

- uses IDEA's `Revision`, `Version`, `Generation`, `Reservation`, `Reference` or `ReleaseRecord` semantics;
- provides atomic multi-document Check-in, atomic Release or digest-pinned representations;
- has a particular database schema, lock/lease algorithm, API, message bus, encryption mechanism or recovery protocol;
- enforces every permission through every client/store/reporting path;
- supports every CAD format or every feature in every edition;
- meets any user-count, latency, throughput, RPO/RTO or availability target;
- has or lacks a capability solely because no public source was found.

No IDEA requirement or product decision should be generated from a row without a separate product
decision and traceability step. The existing admitted records remain the source of controlled
interpretation: [DDM vendor-public baseline](../product/knowledge/ddm-vendor-public-baseline.md),
[item/folder identity finding](../product/knowledge/2026-09-07-ddm-item-name-folder-identity-evidence.md),
[BOM finding](../product/knowledge/2026-09-07-ddm-bom-structure-representation-evidence.md),
[CAD representation finding](../product/knowledge/2026-09-07-ddm-cad-neutral-representation-evidence.md),
[staged-release finding](../product/knowledge/2026-09-07-ddm-staged-release-evidence.md), and
[administration/permission UI finding](../product/knowledge/2026-09-09-ddm-administration-permissions-ui-evidence.md).

## 8. Recommended use by the canonical gap-matrix author

1. Preserve these `DDM-CAP-*` identities if they are imported into the canonical knowledge artifact;
   do not renumber them merely to group rows.
2. Map each capability to IDEA only after checking the current authoritative `DOC-04` requirements
   and the current DOC-05/DOC-06/DOC-08 contracts. Architecture, prototypes and VVP plans are not
   implementation evidence.
3. Keep `COVERED`, `PARTIAL`, `MISSING`, `DEFERRED`, `OUT-OF-SCOPE`, `NOT-APPLICABLE` and `UNKNOWN`
   separate from the DDM evidence class. A DDM unknown cannot be treated as a missing IDEA feature.
4. Treat high-value rows in the unknown register as target-audit or vendor-clarification questions,
   not as requirements.
5. Keep the DDM public source class separate from any later IDEA relevance or gap severity. DDM
   surface parity is a candidate, not an automatic Core v0 commitment.

This file is a scratch research note requested for the external-evidence subtask. It does not
replace the canonical `IE-KNW-DDM-*` capability-inventory artifact and does not authorize a product
scope change.
