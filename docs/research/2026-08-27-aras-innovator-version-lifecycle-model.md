# Aras Innovator Versionable-Item and Life-Cycle Model

Date: 2026-08-27  
Question: In Aras Innovator, which identity remains stable, what identifies a stored version and major revision, where is life-cycle state recorded, and what happens after release?  
Source policy: Official Aras documentation only. The conclusion for IDEA is explicitly separated from documented Aras behavior.

## Short answer

Aras uses a **combined model**, not one life-cycle field on a separate stable logical-item record and not a separate life-cycle object for each major revision:

- `config_id` groups the stored generations of one versionable Item configuration. Each stored generation has an `id` and a positive `generation`; `(config_id, generation)` must be unique. Generation 1 starts with `config_id = id`. For a versionable Item, only the last generation in the `config_id` sequence is marked `is_current = 1`. ([Aras Innovator 35 Data Synchronization Services Programmer's Guide](https://www.aras.com/community/DocumentationLibrary/ALL%20PDFs/Flare%20PDF/Flare%20PDF/Innovator%2035/Aras%20Innovator%2035%20-%20Data%20Synchronization%20Services%20Programmer%27s%20Guide.pdf), [Aras Web Service requirements](https://docs.aras.com/aras-innovator-release-40/web-service/0000019f-3770-d087-a79f-f7736d6b0000))
- `major_rev` is a property on those stored Item generations. It is validated against the ItemType's Revision List. Aras' versions UI can display several generations with the same revision value, so a major revision is a grouping/coordinate across versions rather than a separately documented Item aggregate. ([Aras Innovator 35 Data Synchronization Services Programmer's Guide](https://www.aras.com/community/DocumentationLibrary/ALL%20PDFs/Flare%20PDF/Flare%20PDF/Innovator%2035/Aras%20Innovator%2035%20-%20Data%20Synchronization%20Services%20Programmer%27s%20Guide.pdf), [Item Revisions and Versions, Release 32](https://www.aras.com/community/documentationlibrary/Innovator/32/Content/Innovator%2024%20Docs/Aras%20PE%2014%20-%20User%27s%20Guide/Item%20Revisions%20and%20Versions.htm))
- `state` and `current_state` are system properties of an Item generation: `state` is the label and `current_state` identifies the Life Cycle State. The versions UI exposes State, Revision, and Generation for historical rows. Conceptually, however, Aras documentation describes the **Item instance** as traversing its Life Cycle, and promotion acts on the current Item. ([Aras Web Service requirements](https://docs.aras.com/aras-innovator-release-40/web-service/0000019f-3770-d087-a79f-f7736d6b0000), [Versioning and Promoting](https://docs.aras.com/aras-innovator-platform-33/versioning-and-promoting/0000019f-179e-dcff-a7bf-5f9f80ee0000), [About Life Cycles](https://docs.aras.com/aras-innovator-platform-33/about-life-cycles/0000019f-1798-dcff-a7bf-5f9971fd0000))

Therefore, Aras' persisted state is **generation-level**, while the user-visible life-cycle subject is the **current version of the stable Item configuration**. `major_rev` participates in the release/revise rules but is not documented as a standalone object owning its own workflow instance.

## Documented behavior

1. For a Product Engineering versionable Item, a Claim-Save-Unclaim change creates a new generation. Earlier versions are read-only. Multiple generations may remain within one major revision. ([Versioning and Promoting](https://docs.aras.com/aras-innovator-platform-33/versioning-and-promoting/0000019f-179e-dcff-a7bf-5f9f80ee0000))
2. Promotion moves the Item through states defined by its Life Cycle Map. Promotion is recorded in Item history alongside state, revision, and generation. The reviewed documentation does **not** establish that every promotion necessarily creates a new generation, so that must not be inferred. ([Versioning and Promoting](https://docs.aras.com/aras-innovator-platform-33/versioning-and-promoting/0000019f-179e-dcff-a7bf-5f9f80ee0000))
3. A Life Cycle State may be marked Released and Not Lockable. State-specific permissions may replace the Item's other permissions. These are configurable Life Cycle Map semantics, not universal hard-coded state names. ([State Property, Release 33](https://www.aras.com/community/documentationlibrary/Innovator/33/Content/Innovator%2024%20Docs/Life%20Cycles/State%20Property.htm))
4. In the Product Engineering behavior documented by Aras, a Released revision cannot be changed. `Create New Revision` creates the next major revision in Preliminary; the released predecessor remains historical/read-only. Express change management similarly defines Revise as creating a new revision of a released Part and describes the predecessor as superseded by the new revision. ([Versioning and Promoting](https://docs.aras.com/aras-innovator-platform-33/versioning-and-promoting/0000019f-179e-dcff-a7bf-5f9f80ee0000), [Express Change Management, Release 35](https://www.aras.com/community/documentationlibrary/Innovator/35/Content/Innovator%2024%20Docs/Aras%20PE%2014%20-%20User%27s%20Guide/Express%20Change%20Management.htm))
5. At the platform Life Cycle Map level, a state flagged Released can be configured so the next Lock/Unlock/Edit sequence moves the Item back to the map's Start state and increments `major_rev`. Product Engineering's documented default presents the new revision as Preliminary. These are two views of configurable platform/application behavior, not evidence that every Aras deployment uses identical state names or transitions. ([Creating a Life Cycle Map](https://docs.aras.com/creating-a-life-cycle-map/0000019f-179a-dcff-a7bf-5f9b02ec0000), [Versioning and Promoting](https://docs.aras.com/aras-innovator-platform-33/versioning-and-promoting/0000019f-179e-dcff-a7bf-5f9f80ee0000))

A simplified evidence-backed picture is:

```text
config_id = stable configuration chain
  generation 1, major_rev A, state Preliminary, is_current 0
  generation 2, major_rev A, state Released,    is_current 0
  generation 3, major_rev B, state Preliminary, is_current 1
```

The exact generation numbers in this illustration are illustrative; the relationships among `config_id`, `generation`, `major_rev`, state, and `is_current` are the documented part.

## Design inference for IDEA

If IDEA wants to learn from Aras while preserving IDEA's accepted immutable-Generation rule, the clean model is:

- **Logical Document** owns stable identity and the pointer to the current working configuration; it should not have one authoritative `In Work`/`Released` state for all revisions.
- **Business Revision** owns the authoritative Workflow Instance/current life-cycle state. This permits Revision A to remain Released while Revision B is In Work.
- **Generation** belongs to exactly one Business Revision and remains immutable. It records or references the life-cycle/approval context at publication, but it should not be the mutable authoritative workflow carrier.
- Approval and Release must pin the exact Generation that was evaluated.

This is an IDEA design inference, **not** a claim that Aras persists a separate Business Revision or Workflow Instance in that form. Aras' public model instead exposes `major_rev` and life-cycle fields on Item-generation records. The recommendation adopts Aras' visible release/revise semantics without copying its storage representation.

## Edition and evidence limits

- Identity/system-property evidence is from Aras Innovator 35 DSS documentation and the current Release 40 Web Service documentation; life-cycle and Product Engineering evidence is from Release 33/35 pages embedding Product Engineering 14 guidance, published or surfaced by Aras in 2025-2026.
- Aras is configurable. ItemType versioning method, Revision List, Life Cycle Map, permissions, workflows, and change-management application can change observed behavior.
- No licensed implementation source, database inspection, or authorized runtime test was used. Transaction boundaries, exact event ordering, whether a particular promotion allocates a generation, relationship-copy behavior, and customized revise semantics remain unverified.
- These competitor facts may inform a design lesson; they are not by themselves an IDEA requirement or parity commitment.
