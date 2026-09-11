# Aras Innovator Configuration-Governance Pattern

Date: 2026-08-27  
Question: How does Aras Innovator keep configuration flexible while controlling who may change it and how changes reach a live environment?  
Evidence policy: Aras vendor documentation is recorded as competitor evidence. Local target material is used only as a routing or corroboration signal. IDEA product choices are identified separately as design inferences.

## Short answer

Aras does not evidence one universal approval workflow for every kind of configuration. Its documented pattern has two distinct layers:

1. **In-database administration.** Business objects and much of the application definition are modeled as Items. Identities and Permissions control who may discover, retrieve, create, claim, update, or delete an Item. ItemType permissions, `Can Add`, and Life Cycle state permissions provide different control points. Authorized administrators can therefore configure particular definitions through the application rather than through a single hard-coded author-review-activate chain.
2. **Solution configuration management.** Related configuration Items are collected into Package Definitions, exported as AML files, tracked in source control, reviewed and tested, and promoted between environments. Aras DevOps documents forks/branches, pull requests, automated validation, SIT/UAT/pre-production gates, qualification approvals, deployment pipelines, and approved baselines.

This split provides flexibility, but the reviewed sources do not establish that every active administrative definition is an immutable version, that every direct edit receives independent approval, or that package import is an atomic reversible activation. Those safeguards must not be inferred from the Aras name.

## 1. Runtime administrative configuration

### Configuration is data made from Items

Aras describes new functionality as sets of database Items: ItemTypes and instances represent business objects, Forms support interaction, and Methods implement behavior. This makes configuration inspectable and editable through the same general platform rather than requiring every variation to be compiled into product code. ([Package Import Export overview, Release 33](https://www.aras.com/community/documentationlibrary/Innovator/33/Content/Innovator%2024%20Docs/Package%20Import%20Export%20Utilities/Overview.htm))

This is a platform mechanism, not evidence that every configuration Item is versionable or has an approval life cycle.

### Authority is composed from identities, permissions, and state

An Aras Permission assigns rights to Identities. Documented rights include Get, Update, Delete, Can Discover, and Can Change Access. Permissions can be assigned at ItemType level and overridden by a Life Cycle state; `Can Add` separately controls who can create instances of an ItemType. ([Permissions, Platform 33](https://docs.aras.com/aras-innovator-platform-33/permissions/0000019f-1797-dcff-a7bf-5f97bd6f0000), [Configuring Permissions, Product Engineering](https://www.aras.com/community/documentationlibrary/Innovator/20/Content/Innovator%2022%20Docs/Aras%20PE%2014%20-%20Administrator%20Guide/Configuring%20Permissions.htm))

Aras also uses claim/edit/unclaim behavior: claiming an Item prevents concurrent editing by another user, and completing or discarding the edit releases the claim. ([Item View, Product Engineering 14](https://www.aras.com/community/documentationlibrary/Innovator/32/Content/Innovator%2024%20Docs/Aras%20PE%2014%20-%20User%27s%20Guide/Item%20View.htm))

Therefore Aras can delegate different administrative surfaces to different identities without inventing one global `Configuration Administrator` rule. The reviewed sources do not, however, prove a universal independent-review requirement for changes made by an authorized administrator.

### Each definition can own its own life cycle and attachment scope

A Life Cycle Map is created independently, can be shared by multiple ItemTypes, and can vary by Item classification. Its states can supply overriding permissions, lockability, notifications, history templates, relationship behavior, transition validation, and an attached Workflow Map. ([Creating a Life Cycle Map](https://docs.aras.com/creating-a-life-cycle-map/0000019f-179a-dcff-a7bf-5f9b02ec0000))

This demonstrates composable, type-specific governance rather than one approval chain for every configuration kind. It also means behavior depends on the selected maps, permissions, identities, and application configuration; a default Aras state or role is not universal.

### Workflow definitions and running processes are distinct

Current Unified Change Management documentation says creation of a controlled change object creates a Workflow Process from a default Workflow Map; assignment rules then establish the process assignments, and activation fails if that setup has errors. ([UCM execution flow](https://docs.aras.com/unified-change-management-30/execution-flow-ucm30))

This supports separating a reusable definition from a running process. It does **not** by itself prove that every running process pins an immutable historical Workflow Map version or explain what every Aras edition does when an administrator later edits that map. That exact guarantee remains unproven by the reviewed public sources.

## 2. Solution configuration and promotion

### Package Definitions collect a coherent change set

Aras Package Definitions group related configuration Items and declare dependencies. Official guidance lists ItemTypes, Forms, Life Cycle Maps, Workflow Maps, Permissions, Identities, Methods, Sequences, presentation configuration, and other metadata as package candidates. Creating a Package Definition through the application requires administrator authority. ([Creating a Package Definition](https://www.aras.com/community/documentationlibrary/Innovator/25/Content/Innovator%2024%20Docs/Package%20Import%20Export%20Utilities/Creating%20a%20Package%20Definition.htm), [Package data model](https://docs.aras.com/aras-innovator-platform-33/data-model/0000019f-179e-dcff-a7bf-5f9f10d90000))

The export utility represents Items as separate AML files so versions can be compared and merged, and it moves logical packages between databases. Import of an existing package is merge-oriented. ([Package Import Export overview](https://www.aras.com/community/documentationlibrary/Innovator/22/Content/Innovator%2022%20Docs/Package%20Import%20Export%20Utilities/Overview.htm), [Using Package Import Export Utilities](https://docs.aras.com/aras-innovator-platform-33/using-package-import-export-utilities/0000019f-179b-dcff-a7bf-5f9ba14c0000))

A package is therefore a portable configuration change set, not proof of an immutable runtime activation or automatic rollback point.

### Git, review, test, and environment gates govern material solution changes

The Aras DevOps guide treats workflows, reports, integrations, life cycles, forms, and preferences as customer solution configuration. Its distributed model exports these changes to Git, develops them in isolated local environments, reviews them through pull requests, runs automated checks, deploys builds to SIT, and tags an approved commit as a baseline. ([Aras DevOps 1.2 User Guide](https://www.aras.com/community/DocumentationLibrary/ALL%20PDFs/DevOps/Aras%20DevOps%201.2%20-%20User%20Guide.pdf))

The same guide distinguishes development, SIT, UAT, and production progression and describes System, Functional, Data, and Production Qualification approvals before or during production promotion. These are documented solution-delivery practices and, in parts, subscription/cloud policies; they are not evidence that base Innovator universally enforces the same approval sequence for every customer-hosted administrative edit.

### Rollback depends on deployment evidence and recovery practice

The package tool is designed to merge AML into a database. Aras hotfix guidance separately instructs administrators to back up the code tree and database before applying a package and to restore them if application fails. ([Applying Hotfix 076394.30](https://docs.aras.com/aras-innovator-platform-33/applying-hotfix-076394-30))

Consequently, a package import must not be equated with an intrinsically atomic or automatically reversible configuration activation.

## What Aras does well

- Uses one extensible Item/Identity/Permission model instead of hard-coding every role and configuration surface.
- Lets permissions and life-cycle behavior vary by type, classification, and state.
- Separates reusable workflow maps from instantiated workflow processes.
- Groups related schema, UI, rule, and policy Items into dependency-aware packages.
- Moves material solution changes through source control, review, automated checks, test environments, and approved baselines.
- Supports both rapid local iteration and progressively stricter controls as a release approaches production.

## What IDEA should not copy without strengthening

- Do not assume administrator permission is equivalent to independent approval.
- Do not allow an edit to an active policy definition to reinterpret an already-running workflow, approval, release, or retained audit record.
- Do not treat an AML merge as an atomic deployment or a rollback mechanism.
- Do not allow production-only configuration drift that cannot be reconciled to an exported, reviewed package or attributable operational change record.
- Do not require every harmless preference change to traverse the same solution-release pipeline as access, workflow, schema, or executable-rule changes.

## Design inference for IDEA

IDEA should adopt the useful Aras separation but make its safety boundary explicit:

1. **Operational Configuration** — low-blast-radius organization data such as user preferences, notification destinations, group membership, and other explicitly classified settings. Authorized identities may change it directly; each change is validated and audited, and only settings classified as reversible may take effect immediately.
2. **Governed Policy Definition** — access, approval, workflow, revision, retention, numbering, metadata-schema, format-capability, and release policies. Each definition has stable identity and immutable versions. A draft may be edited flexibly, but activation selects an exact version; running processes and released evidence remain pinned to the version that governed them. The applicable definition may choose its own review, quorum, separation, and activation roles rather than inheriting one universal chain.
3. **Solution Configuration Package** — schema changes, forms, adapters, executable rules, seeded templates, and other changes that alter the delivered solution. These are packaged, source-controlled, reviewed, verified in non-production, and promoted as an exact release artifact. Direct production changes are prohibited except through an attributable, time-bounded break-glass procedure followed by reconciliation.

This model is more flexible than one mandatory author-approver-administrator workflow and safer than unrestricted direct editing of active definitions.

## Evidence limits

- Official evidence spans multiple Aras Innovator releases and the optional Aras DevOps offering; edition and subscription boundaries matter.
- The reviewed sources do not prove one universal lifecycle, role model, approval quorum, activation mechanism, or rollback mechanism for every configuration Item.
- The local Aras research workspace contains runtime and implementation observations, but those remain separately scoped target evidence and were not promoted to universal vendor behavior here.
- Every IDEA requirement still needs its own rationale, acceptance criterion, and verification method.
