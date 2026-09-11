# DDM Item, Name and Folder Identity Evidence Finding

| Field | Value |
|---|---|
| Document ID | `IE-KNW-DDM-005` |
| Status | Bounded research finding; not a target-runtime fact |
| Question | How does publicly demonstrated DDM behavior distinguish a managed item from its visible name and folder placement? |
| Source scope | Official DesignDataManager tutorial videos, a DDM/IronCAD partner tutorial index, and the admitted local DDM public-evidence audit |
| Access date | 2026-09-07 |
| Evidence classes | `VENDOR-PUBLIC`, `INFERENCE`, `UNKNOWN`, `IDEA RECOMMENDATION` |
| Product change made | None |

## Conclusion

The public DDM tutorials present a managed item as more than a Windows file name or physical folder path. Creating and storing an item includes assigning managed properties such as part number, description and category, then choosing a DDM folder. The tutorials expose **moving an item to a divider**, **renaming an item**, and **creating a copy with Save-As** as separate operations. DDM Office also demonstrates **Reserve To** and **Reference To** as different item–folder relationships.

This visible behavior is consistent with DDM maintaining an internal item identity while names and folder relationships can change. It does not reveal DDM's database key, prove that the key is immutable, or establish every edge case after rename, move, copy, reference or Issue/File Version change. Those internal facts remain `UNKNOWN` until an authorized target-runtime audit is completed.

## What DDM visibly does

| DDM operation | Publicly demonstrated effect | Evidence classification | What may safely be concluded |
|---|---|---|---|
| Create and store | The user stores a CAD item in DDM, assigns part number, description and category, and chooses a folder/current working folder. | `VENDOR-PUBLIC — DEMONSTRATED` | Managed metadata and folder selection are explicit parts of the store flow. The tutorial does not reveal the persistence key. |
| Move to divider | An existing item is moved inside a folder to an ad hoc divider. | `VENDOR-PUBLIC — DEMONSTRATED` | Folder organization can be changed through a dedicated operation; the tutorial does not show a new item being created by the move. |
| Rename item | Renaming is performed as an item operation in the DDM/IRONCAD workflow. | `VENDOR-PUBLIC — DEMONSTRATED` | Rename is distinct from Save-As and from moving the item. Exact identifier and history behavior after every rename remains unverified. |
| Save-As | The tutorial creates a copy of an existing assembly using Save-As. | `VENDOR-PUBLIC — DEMONSTRATED` | Copying is a separate user intention from renaming or moving. Whether every Save-As path always creates a new internal identity must be verified against an authorized target. |
| Reserve To | DDM Office reserves the managed item to the user's Workbench or a selected project folder and grants modification rights in the demonstrated flow. | `VENDOR-PUBLIC — DEMONSTRATED USER FLOW` | Reserve changes the user's working/modification relationship to an existing item. Lock keys, timeout, crash recovery and server enforcement are not publicly proven. |
| Reference To | A Released or Superseded item can be referenced into a project folder/divider without granting modification rights in the demonstrated flow. | `VENDOR-PUBLIC — DEMONSTRATED USER FLOW` | A folder can present a relationship to an existing controlled item without treating it as a new editable copy. Reference persistence and exact Issue/File Version pinning remain unknown. |

## Interpretation boundary

The separation of **Move**, **Rename**, **Save-As**, **Reserve To** and **Reference To** strongly suggests that DDM users act on a managed item whose visible name and folder context are attributes or relationships, not its only identity. This is an `INFERENCE` from observable behavior, not proof of DDM's internal schema.

Current public evidence does not settle:

- the database primary key or whether it is immutable;
- whether one item can appear in several ordinary folders, apart from explicit Reference behavior;
- whether a Reference follows the latest Issue/File Version or pins a particular one;
- what rename does to physical working filenames and every CAD link type;
- transaction and rollback behavior if move, rename, copy or reference fails part-way through.

These questions remain in the [DDM target audit plan](ddm-target-audit-plan.md) and require an identified, authorized DDM package/runtime.

## IDEA recommendation for correction point 11

Adopt the visible DDM mental model, but specify IDEA's identity rules explicitly:

1. A **Logical Document** receives one stable `DocumentId`. The ID is not derived from file name, Windows path, business number, Revision or Generation.
2. A **folder/divider** is an organizational relationship. Moving or linking an item changes where users find it; it does not create a new Logical Document.
3. **Rename** keeps the same `DocumentId`. If the changed name/title is controlled content, it is recorded through Check-in as a new Generation; changing only a navigation alias or folder placement is an audited metadata/relationship change.
4. **Save-As / Create Copy** creates a new Logical Document with a new `DocumentId` and records which source document it came from.
5. **Reference** points to an existing controlled document or an explicitly selected Revision/Generation; it does not silently duplicate the file.
6. Physical server paths remain an implementation detail and are not shown or accepted as business identity.

The first four rules align with the user-facing distinctions demonstrated by DDM. Exact pinning, audit and failure semantics are IDEA requirements that must be justified and verified independently; they must not be presented as confirmed DDM internals.

## Sources

All sources were accessed on **2026-09-07**.

1. [DDM Tutorials (IronCAD) — Copying Models and Drawings and Renaming](https://www.youtube.com/watch?v=l7ST9GeA8jM) — official DesignDataManager channel; chapters demonstrate creating dividers, Save-As, moving items and renaming items.
2. [DDM Office — Working with Folders](https://www.youtube.com/watch?v=rlH1fXReZ9Q) — official DesignDataManager channel; demonstrates Workbench, Reserve To and Reference To user flows.
3. [DDM IronCAD Workshops](https://en.solidmakarna.se/supportblogg/ddm-ironcad-workshops) — DDM/IronCAD partner index dated 2024-03-20; lists the official tutorial chapters and timestamps for store, metadata, folder selection, File Version, move, rename and Save-As.
4. [DDM vendor-public capability baseline](ddm-vendor-public-baseline.md) — admitted propositions and public-evidence limits.
5. [DDM target package and runtime audit plan](ddm-target-audit-plan.md) — controlled tests required to resolve internal item, Issue/Revision, File Version and physical Generation identities.
