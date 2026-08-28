# IDEA Engineering Domain Language

IDEA Engineering is the canonical C1 product context for controlled engineering data. It begins with PDM capability, evolves toward PLM inside the same product, and participates in an IDEA Platform only after another independent capability unit exists.

## Product and platform scope

**IDEA Engineering**:
The independently implemented internal company product that owns controlled engineering data and its PDM-to-PLM lifecycle inside C1, uses the DDM Reference Baseline as its default long-term behavioral target, and admits reviewed Aras-informed improvements. It is built for the company's own engineering work and is not currently a commercial multi-customer offering.
_Avoid_: IDEA Platform, DDM implementation clone, icVault clone, commercial SaaS offering, ungoverned departmental script

**Internal Operational Value**:
The evidenced benefit IDEA Engineering provides to the company through controlled Product Definition, reduced wrong-baseline and release risk, protected engineering work, attributable decisions, recoverability, maintainability, and measured workflow efficiency. Sales, revenue, market share, customer acquisition, and market fit are not current product outcomes.
_Avoid_: unmeasured savings claim, commercial business case, competitor feature count

**DDM Reference Baseline**:
The controlled, version- and evidence-scoped set of externally observable DDM capabilities, workflows, and user-visible semantics that forms IDEA Engineering's default long-term behavioral target. It excludes DDM source, internal schema, undocumented protocol, branding, and other implementation material.
_Avoid_: DDM codebase, marketing checklist, unscoped complete parity claim

**Aras Quality Benchmark**:
The controlled set of official Aras Innovator behaviors used proactively to identify improvements to the DDM Reference Baseline and to resolve gaps where DDM evidence is insufficient. It is not a second full-product parity target.
_Avoid_: Aras clone, fallback used only after design is complete, automatic replacement of DDM behavior

**Behavioral Coverage Disposition**:
The reviewed outcome for one reference behavior: `ADOPT` preserves the evidenced DDM behavior, `ADAPT` deliberately improves or constrains it, `ADAPT-ARAS` adopts an evidenced stronger Aras pattern, `DEFER` schedules it later, `EXCLUDE` rejects it with rationale, and `UNKNOWN` preserves insufficient evidence.
_Avoid_: implementation status, evidence class, silent divergence

**Operating Organization**:
The company governance boundary that owns and operates IDEA Engineering for internal use, including its applicable users, access policy, controlled product data, configuration, retention obligations, and audit evidence. The current product scope has one Operating Organization; a later separately governed internal scope requires an explicit product decision and does not turn the product into a commercial tenant service.
_Avoid_: customer account, Microsoft Entra tenant, deployment instance, commercial tenant

**Bootstrap Custodian**:
A named human identity designated when the Operating Organization is provisioned to activate its first Access Policy and establish a recoverable governance path. Normal policy authority replaces bootstrap authority after activation; the last effective recovery path cannot be removed without an eligible replacement, and a platform operator has no implicit company-data authority.
_Avoid_: permanent super-administrator, unnamed deployment account, implicit provider access

**Policy Adoption Authorization**:
The authorization used to approve or activate a candidate Governed Policy Definition under the currently active policy or an explicit bootstrap or break-glass authority. A candidate policy can never grant the authority needed for its own adoption.
_Avoid_: self-authorizing policy, proposed-role evaluation, silent privilege escalation

**Single-Actor Governance Exception**:
An explicit attributable exception allowing one actor to perform otherwise separated governance actions when no independent actor is available. It records the affected policy or baseline and remains evidence of a review gap; it can never be presented as independent approval.
_Avoid_: normal self-approval, hidden role overlap, independent-review evidence

**Configuration Governance Class**:
The governed classification that routes a configuration change as Operational Configuration, a Governed Policy Definition, or a Solution Configuration Package according to its authority, blast radius, runtime effect, and deployment needs. The class determines its control path; IDEA does not impose one universal approval chain on every setting.
_Avoid_: risk label alone, administrator role, one workflow for all configuration

**Operational Configuration**:
Organization-owned configuration designed for authorized administration in a running service without a solution deployment. Its class defines permitted actors, validation, Audit Evidence, effective timing, and recovery; only explicitly reversible low-impact settings may take effect immediately without an independent disposition.
_Avoid_: personal preference treated as a software release, unaudited live edit, Governed Policy Definition

**Governed Policy Definition**:
A stable organization-owned policy identity with editable Draft content and immutable activated versions. Each policy kind defines its applicable review, approval, quorum, separation, and activation roles; retained decisions, running processes, and released evidence remain pinned to the exact version that governed them.
_Avoid_: one global approval chain, mutable active policy, retroactive reinterpretation

**Solution Configuration Package**:
An exact versioned delivery unit for schema, forms, adapters, executable rules, seeded definitions, and other changes that alter the delivered solution. It is source-controlled, reviewed, verified outside production, and promoted as a release artifact rather than edited as ordinary Operational Configuration.
_Avoid_: runtime preference, database-only customization, unreviewed production edit

**Break-Glass Configuration Change**:
A time-bounded exceptional production change made under explicitly delegated emergency authority, with exact scope, actor, reason, before/after evidence, recovery action, and mandatory reconciliation into the governed configuration source. It cannot become the routine path for configuration delivery.
_Avoid_: permanent bypass, silent administrator override, substitute for normal promotion

**Organizational Isolation**:
The requirement that the Operating Organization's identities, policy, controlled product data, configuration, and audit evidence cannot be confused with or exposed to an unauthorized external organization, environment, or any later explicitly separated internal governance scope. It is a defense-in-depth boundary and does not imply multi-customer tenancy.
_Avoid_: multi-tenant SaaS requirement, environment label alone, access control alone

**Company-Controlled Deployment**:
The pilot operating constraint that IDEA Engineering can run in an on-premises or private-cloud environment controlled by the company, without a mandatory public-cloud dependency. It does not by itself select a vendor, identity provider, physical topology, or tenancy model.
_Avoid_: public-SaaS requirement, desktop-only product, selected deployment architecture

**Minimum Viable Product (MVP)**:
The first minimum end-to-end IDEA Engineering product baseline verified against its approved requirements using the Canonical Demo Dataset. Its mandatory proof follows the MVP Release Spine and includes the Generic Controlled-File Baseline plus one evidenced deep CAD Format Capability Profile. The MVP label and synthetic-data results establish only the evidenced functional scope; internal user acceptance, productivity improvement, and operational readiness remain `UNKNOWN` until representative measurements exist, while commercial market viability is `NOT APPLICABLE`.
_Avoid_: prototype, production-ready release, internal-adoption evidence, full PLM scope

**Pilot-Ready Baseline**:
An exact MVP baseline that has passed the Canonical Demo Dataset verification and a Representative Pilot Project verification using at least two distinct identities for Reservation, conflict, review, approval, and release paths. Those identities may be operated by one person for bounded functional verification under a Single-Actor Functional Acceptance; that evidence is explicitly limited and is not representative-user acceptance or independent review. A technical pilot verification may proceed without an Internal Adoption Authority, but Pilot-Ready does not authorize operational rollout. Pilot-Ready establishes readiness for a controlled internal pilot by evidencing correctness, conflict safety, traceability, exact-baseline reproduction, controlled release, and tested recovery; it does not establish company-wide acceptance, productivity improvement, operational authorization, or production readiness.
_Avoid_: MVP label alone, synthetic-data evidence alone, company-wide rollout approval, production-ready release

**MVP Release Spine**:
The mandatory end-to-end proof in which a Design Engineer creates or stores existing Product Definition, obtains explicit Reserved or Reference workspace scope, edits through an external application, publishes an exact Generation and Structure Snapshot, creates the applicable Business Revision evidence, submits that exact baseline for independent review, and obtains Approval, Release Record, and reproducible Controlled Release Package. Negative paths prove stale or unauthorized publish rejection while preserving local work.
_Avoid_: disconnected feature checklist, vault-only demonstration, administrator-only scenario, release without exact pins

**Representative Pilot Project**:
A controlled, sanitized copy of a small real internal engineering project that retains representative file types, governed metadata, parent-child structure, and workflow complexity without becoming a live production migration. It is exercised by at least two distinct named identities after the synthetic Canonical Demo Dataset passes.
_Avoid_: synthetic dataset, live production cutover, arbitrary showcase files, company-wide acceptance evidence

**MVP Evidence Claim**:
The bounded statement supported by MVP and Pilot-Ready verification: IDEA preserves controlled Product Definition, prevents stale or unauthorized publication, retains rejected local work, records attributable review and release history, reproduces an exact Released Baseline, and restores the tested baseline consistently. Time savings, internal adoption, operational readiness, return on internal investment, and complete reference-product parity require separate measured evidence; commercial market fit is outside product scope.
_Avoid_: unmeasured productivity promise, parity claim from feature presence, company-wide rollout claim

**MVP Success Metric Set**:
The initial evidence set for the MVP Release Spine: every tested Released Baseline reproduces exactly; no stale, unauthorized, wrong-workspace, or insufficient-evidence publish or Release is accepted; every rejected local work item remains recoverable; required audit and exact-pin evidence is complete; and the tested baseline restores consistently. Efficiency and adoption metrics are separate later measurements.
_Avoid_: feature count, unmeasured time saving, synthetic pass presented as internal acceptance

**PDM Application**:
An application that controls engineering product-definition data such as documents, artifacts, product structure, versions, revisions, workflow, and access.
_Avoid_: PLM when the scope is only engineering product-definition control

**PLM Application**:
A PDM Application extended to control change, decisions, release packages, and collaboration across the product lifecycle inside the same product boundary.
_Avoid_: integration layer, separate platform tier

**PDM-to-PLM Evolution**:
The growth of IDEA Engineering from PDM to PLM without replacing its identity/version foundation or transferring business ownership to the Platform.
_Avoid_: migration from C to D, mandatory rewrite

**Platform Capability Unit (C)**:
An independently useful business capability with its own owner, authoritative state, contract, and lifecycle; IDEA Engineering is C1.
_Avoid_: deployment process, technical helper, microservice split

**IDEA Platform**:
The ecosystem formed when at least two independent Platform Capability Units cooperate through shared interoperability capability.
_Avoid_: IDEA Engineering by itself, planned collection of empty modules

**Interoperability Fabric (D)**:
Platform-level capability that connects Platform Capability Units without owning their internal data or business rules.
_Avoid_: shared application, shared database, C1 business layer

**Cross-Application Link**:
An identified relationship from an object in one Platform Capability Unit to an object owned by another.
_Avoid_: copied record, relationship wholly inside one application

## Controlled product definition

**Product Definition**:
The governed artifacts, metadata, structure, and provenance required to reproduce and understand an engineering object at an exact point in its lifecycle.
_Avoid_: IDEA Product Definition Baseline, product-development documentation, current file folder, mutable latest data

**Logical Document**:
A controlled product-data identity that remains stable across Generations, Business Revisions, and workflow transitions.
_Avoid_: physical file, path, one version

**Artifact**:
Immutable binary content identified by a digest and referenced by a Generation Manifest.
_Avoid_: Logical Document, workspace path

**Generation**:
An immutable published snapshot of a Logical Document's Product Definition at one point in time.
_Avoid_: Business Revision, latest file, save operation

**Generation Manifest**:
The complete definition of a Generation, including artifact digests, versioned metadata, structure reference, and applicable provenance.
_Avoid_: mutable metadata row, unverified upload list

**Business Revision**:
A governed business milestone of a Logical Document, such as `A` or `B`, created according to a Revision Policy.
_Avoid_: Generation, save count, vault version

**Revision Scheme Version**:
An immutable, organization-owned rule that defines the ordered Business Revision labels applicable to specified document classes, including allocation, exhaustion, and non-reuse behavior. The seeded scheme explicitly orders `A` through `Z`; exhaustion fails closed until an approved successor scheme is activated, and no algorithm silently invents a later label. Another validated scheme may be activated without reinterpreting existing Revisions.
_Avoid_: free-text Revision, Generation counter, mutable global sequence, reused Revision label, implicit `AA` continuation

**Version within Revision**:
The ordered Generation number inside one Business Revision, beginning at `1` and increasing only when changed Product Definition is published.
_Avoid_: Business Revision, local file version

**Working Head**:
The exact published Generation used as the concurrency base for the next controlled change to a Logical Document.
_Avoid_: Released baseline, unqualified latest

**Release Record**:
Immutable evidence that pins a Business Revision to the exact Generation and Structure Snapshot that passed release gates.
_Avoid_: current Workflow State, pointer that follows Working Head

**Check-in Change Set**:
One or more Logical Document changes published all-or-nothing by a successful Check-in.
_Avoid_: upload batch, unrelated Check-ins grouped by time

**Controlled Release Package**:
An export derived from one exact Release Record and containing its manifest, governed metadata, Structure Snapshot or BOM representation, and applicable Artifacts with digests and provenance. It is a portable rendition of a released baseline, not a mutable integration channel or ERP/MRP write-back.
_Avoid_: latest-file ZIP, database export, release record replacement, bidirectional integration

**Release Scope**:
The user-confirmed closure of exact Logical Documents, Business Revisions, Generations, and one Structure Snapshot evaluated for one Release operation. Every required entry is shown as already released, candidate, excluded, unresolved, or blocked before confirmation; required exclusions and ineligible entries fail closed.
_Avoid_: hidden recursive cascade, root-only release, latest-at-read-time structure

**Release Exception**:
An approved, attributable disposition for one exact unresolved or externally controlled dependency that would otherwise block Release, recording owner, rationale, affected baseline, risk, evidence, expiry or review condition, and approver. It never silently removes the dependency or represents it as controlled.
_Avoid_: warning dismissal, hidden omission, permanent blanket waiver

**Store Existing**:
The controlled onboarding of an existing persisted file into a newly registered Logical Document and Managed Workspace so that its first successful Check-in creates the initial governed Generation. It is distinct from bulk legacy migration.
_Avoid_: uncontrolled upload, full repository migration, direct vault copy

**Document Disposition**:
The governed retention state of a Logical Document: Active, Trashed, PurgePending, or Purged.
_Avoid_: Workflow State, direct storage deletion

**Retention Policy Version**:
An immutable, organization-owned rule for retention periods, holds, restore eligibility, purge eligibility, and required purge evidence. The seeded MVP policy performs no scheduled automatic purge; an authorized purge requires an impact dry run, Audit Evidence, and enforcement of released-baseline, structure, approval, reference, and hold constraints.
_Avoid_: immediate delete, silent cleanup schedule, legal-hold replacement, unaudited purge

## Collaboration and workspace

**Managed Workspace**:
A local file area whose manifest identifies exact Generations, digests, and access modes while external design applications read and write ordinary files.
_Avoid_: Vault storage, unmanaged working folder

**Workspace Manifest**:
The controlled record that maps each materialized local file to its Logical Document, exact Generation, digest, and access mode.
_Avoid_: directory listing, cache index without product identity

**Checkout**:
The user action that requests Reservations for a confirmed scope and materializes that scope into a Managed Workspace.
_Avoid_: download, Reference, operating-system write permission

**Reservation**:
A temporary exclusive right for one actor and Managed Workspace to publish a new Generation for one Logical Document; it cannot prevent an external application from editing a local file.
_Avoid_: assembly-wide lock, file-system lock, Reference

**Reservation Lease**:
The renewable period during which a Reservation remains valid. Expiry removes the right to publish but does not delete local work, waive expected-Generation validation, or permit a stale overwrite.
_Avoid_: permanent checkout, local-file expiry, silent force unlock

**Offline Workspace Operation**:
The ability to open, reference, or edit already materialized workspace files while the service is unavailable. Offline operation cannot acquire a new Reservation, Check in, recover a Reservation, approve, or Release; reconnection revalidates the Reservation Lease and expected Generation, and any conflict fails closed while preserving local work.
_Avoid_: full offline command replay, offline approval, stale overwrite, deletion of conflicting local work

**Reference**:
Workspace access to an exact Generation without a Reservation or permission to publish a new Generation for that Logical Document.
_Avoid_: Checkout, untracked copy

**Reservation Disposition**:
The explicit Check-in outcome that releases or retains Reservations in the confirmed scope.
_Avoid_: hidden auto-unlock, global cancel

**Reservation Recovery**:
An authorized, reasoned, and audited recovery or break of one Reservation. It may transfer or remove publish entitlement according to policy but never bypasses expected-Generation validation, deletes local work, or permits a stale overwrite.
_Avoid_: force overwrite, silent administrator unlock, conflict resolution

## Product structure and format

**Related Document**:
A Logical Document dependency that must be resolved when materializing or validating Product Structure.
_Avoid_: attachment when the document participates in engineering structure

**Structure Snapshot**:
An immutable occurrence/dependency graph that pins the identities needed to reproduce a Product Definition.
_Avoid_: mutable assembly graph, flat file list, latest dependency

**Structure Resolution Policy**:
A versioned rule that determines whether a working view resolves stored exact pins, latest working Revisions, or latest Released Revisions. A dynamic view may reveal newer children but cannot rewrite a Structure Snapshot or Release Record; adopting a newer child is an explicit parent change.
_Avoid_: silent update-to-latest, released baseline mutation, display filter treated as stored structure

**Draft Dependency Pin**:
An exact Generation reference stored in an unreleased Structure Snapshot. It may identify an In Work or Released dependency according to policy and must remain visibly non-released when applicable; it cannot enter a Release Record unless the dependency is Released, included in the same confirmed release scope, or covered by an explicit valid exception.
_Avoid_: floating latest, hidden unresolved dependency, released-baseline pin

**Generic Controlled-File Baseline**:
The format-independent capability applied to each explicitly enabled file type: stable Logical Document identity, immutable Artifact and Generation control, digest verification, governed metadata, Reservation and Check-in, manual relationship support, workflow, access, audit, retention, and exact-baseline export. It does not imply semantic parsing, structure extraction, preview, conversion, or round-trip fidelity for that format.
_Avoid_: unrestricted arbitrary-file promise, deep format integration, unsupported semantic understanding

**Format Capability Profile**:
A versioned declaration of the evidenced generic-vaulting, extraction, structure, preview, conversion, and fidelity capability for one file format/tool combination.
_Avoid_: unsupported claim that a software product is simply "integrated"

**Representation**:
A non-authoritative preview, thumbnail, neutral file, or other derivative tied to one exact source Generation and producer version. Failure to create it preserves the original Artifact and blocks Release only when the applicable Format Capability Profile or Release Policy makes that Representation required evidence.
_Avoid_: original Artifact, Product Definition authority, silently stale preview

**Metadata Schema Version**:
An immutable identified definition of governed metadata fields, types, constraints, classification, and applicability. A Logical Document or Generation records the exact schema version used so later extension cannot silently reinterpret prior Product Definition.
_Avoid_: mutable column list, UI form layout, schemaless metadata bag

**Numbering Policy**:
A versioned Operating Organization rule for allocating governed document or item numbers with explicit uniqueness, partition, retry, cancellation, and gap behavior. A business number is not the stable product identity.
_Avoid_: DocumentId, free-text naming convention, hidden database counter

**Product Profile**:
A governed grouping of format capabilities and user experience for a domain such as CAD or Office; it owns no controlled product state.
_Avoid_: domain module, authoritative data silo

## Interaction and localization

**Supported Product Locale**:
One of the MVP user-interface locales `en`, `vi`, or `ja`, applied consistently to Desktop, Web, system messages, notifications, and user help. Locale support changes presentation and interaction text, not product identity, authority, permission, workflow meaning, or user-authored content.
_Avoid_: controlled-document source language, company-authored data language, feature variant

**Localized Resource Catalogue**:
A versioned set of language-neutral resource keys and locale-specific values. English is the base and missing-resource fallback; Vietnamese and Japanese catalogues have their own review status, and no user-facing text is embedded as an authorization or workflow code.
_Avoid_: runtime machine translation, hard-coded UI text, three competing business-rule sources

**Locale Preference**:
The user's persisted choice shared by Desktop and Web. An organization default and the operating-system or browser locale may initialize it, but cannot repeatedly override the user's selection.
_Avoid_: Operating Organization identity, content language, per-session auto-detection without persistence

**User-authored Content**:
Unicode filenames, metadata, descriptions, and other content entered or imported by a user. It is preserved as authored and is not automatically translated when the Product Locale changes.
_Avoid_: localized system resource, invariant business code, translated copy treated as authority

**Locale Review Status**:
The Draft, Proposed, Approved, Superseded, or Retired state of one locale catalogue for an exact product baseline. Machine translation may seed Draft content, but competent human review is required before Approved status; a missing reviewer remains a Specialist Review Gap.
_Avoid_: feature completion percentage, product release status, self-certified translation quality

## Lifecycle governance

**Workflow State**:
The current business state of one Business Revision under one identified Workflow Instance and Workflow Definition Version.
_Avoid_: Logical Document-wide status, Generation mutation, generic status without a governing workflow

**Start**:
The initial Workflow State of a Business Revision. For the initial Revision, the Logical Document may already have a stable identity, allocated business number, and creation metadata before its first Generation; a later Revision begins from the exact released predecessor baseline. Start cannot be approved, released, or treated as a released baseline; under the seeded MVP policy, the initial successful publish creates `Revision A / Version 1` and moves that Revision to In Work.
_Avoid_: Create command, Logical Document-wide state, empty Generation, released baseline

**Workflow Instance**:
The attributable lifecycle execution owned by one Business Revision under one exact Workflow Definition Version. It owns the current Workflow State and transition history; Approval Decisions and Release Records pin the exact Generation evaluated, while the immutable Generation is not mutated merely to record a state transition.
_Avoid_: Logical Document status, mutable Generation, Workflow Definition

**Workflow Definition Version**:
An immutable identified definition of states, transitions, eligible actors, decision rules, required evidence, notifications, and Revision or Release effects. Existing workflow history remains bound to the version that governed it when later definitions are added.
_Avoid_: hard-coded state enum, mutable current workflow, graphical layout as business authority

**Graphical Workflow Designer**:
The validated no-code administration surface for composing and inspecting a Workflow Definition Version as states, activities, paths, assignments, decisions, evidence rules, and notifications. The graphical representation edits the same governed definition as its property views; canvas coordinates and visual styling are not lifecycle authority.
_Avoid_: copied DDM user interface, unvalidated diagram, executable drawing separate from policy

**Seeded Engineering Release Workflow**:
The initial configurable Workflow Definition Version whose normal path is `Start` to `In Work` to `Under Review` to `Released`, with Reject or Rework returning to `In Work` and withdrawal available before the final decision. It may be cloned and changed through the Graphical Workflow Designer; it is a starter template rather than a hard-coded universal lifecycle.
_Avoid_: immutable product-wide workflow, state enum, full change-order process

**Workflow Definition Activation**:
The attributable act that makes one immutable Workflow Definition Version available to new Workflow Instances in the Operating Organization. A later activation does not reinterpret or silently migrate an existing instance; migration is a separate authorized operation with impact preview and Audit Evidence.
_Avoid_: in-place workflow mutation, organization-global mutable template, automatic migration

**Approval Decision**:
An attributable Approve or Reject decision for a pending transition with before-state, after-state, and evidence.
_Avoid_: manual status edit

**Approval Policy Version**:
An immutable identified policy owned by the Operating Organization and defining approval stages, eligible actors or roles, assignment mode, quorum, self-approval allowance, separation between author, approver, and releaser, required comments or evidence, and decision effects. Each Workflow Instance records the exact version used so later configuration cannot reinterpret prior decisions. The seeded MVP policy requires one independent approver: an author or editor cannot approve or release that Revision, while its independent approver may also release it; the company may replace this only by activating another validated policy version.
_Avoid_: hard-coded approver count, Access Policy replacement, mutable approval history

**Actor Eligibility Failure**:
The fail-closed result when a required workflow or approval step cannot resolve an eligible actor under its pinned policy. Submission, workflow start, approval, or release is blocked with the missing role or rule identified for administrator repair; the system never assigns an arbitrary actor or weakens the policy silently.
_Avoid_: auto-approval, fallback to document author, empty assignment accepted as success

**Revision Policy**:
The rules that determine which transitions create a new Business Revision and its baseline Generation.
_Avoid_: hidden side effect of approval

**Lightweight Change Record**:
A governed, identified traceability item required when creating a new Business Revision from a Released baseline. It records the reason, exact source baseline, affected controlled objects, actor, and time; a later full change-control process may reference it, but the MVP record is not itself an ECR or ECO workflow.
_Avoid_: unstructured comment, Audit Event alone, full change order

**Access Policy Version**:
An immutable identified policy definition that evaluates organization-scoped actors, roles or groups, resource state, and requested action. Initial seeded roles are replaceable policy configuration and must not be hard-coded into the modules that own controlled product state.
_Avoid_: authentication mechanism, role name embedded in domain logic, mutable unversioned permission table

## Product-development documentation

**IDEA Product Definition Baseline**:
The controlled product-development documents and supporting records that define, justify, trace, review, and approve IDEA Engineering from vision through delivery.
_Avoid_: Product Definition, eight-file bundle, DDM specification

**Core Product Document**:
One of the eight controlled information-item classes in the IDEA Product Definition Baseline, with a defined authority boundary, lifecycle, and gate role.
_Avoid_: fixed physical file, supporting record, Product Definition artifact

**Document Class Code**:
One of `DOC-01` through `DOC-08`, identifying a Core Product Document class rather than a file, document instance, or version.
_Avoid_: filename, instance ID, version number

**Controlled Document Instance**:
One governed instance of a document class, identified independently of its path by a stable ID, version, status, and applicable baseline.
_Avoid_: Document Class Code, mutable file path, unversioned draft

**Stable Document ID**:
The repository-wide semantic identity of a Controlled Document Instance, such as `IE-ARC-C1-001`; it remains independent of the Document Class Code, path, filename, and document version, and an adopted existing instance retains its established ID.
_Avoid_: DOC-xx class code, file path, version label, renumbering during adoption

**Document Version**:
The `major.minor` content version of a Controlled Document Instance. Versions `0.x` identify Draft or Proposed content, `1.0` is its first Approved version, a major increment changes authority or contract materially, and a minor increment adds compatible content; a Git commit identifies repository evidence but is not the Document Version.
_Avoid_: Stable Document ID, Git commit, date alone, product Generation

**Complete Controlled Draft**:
A Draft in which every required section contains evidence-supported content or an explicit `UNKNOWN`, `BLOCKED`, or `NOT APPLICABLE` disposition with the applicable owner, evidence, and resolution action; it contains no blank section, template prompt, or sample value presented as product content.
_Avoid_: approved baseline, gap-free knowledge, partially filled template

**Principal Product Author**:
The role that prepares product documents, recommendations, self-assessments, evidence, and remediation proposals. The role may perform work across an unstaffed specialty but cannot relabel its own work as the independent review required by a material gate.
_Avoid_: automatic approver, independent reviewer of own work, unnamed document owner

**Product Decision Authority**:
The role accountable for deciding product specifications, feature scope, and selected technology or architecture proposals. In the current project this role is organizationally separate from the Principal Product Author; specialist competence and independent-gate obligations remain explicit rather than being implied by management authority.
_Avoid_: author by default, universal specialist reviewer, undocumented approval

**Internal Adoption Authority**:
The named company role accountable for authorizing `Internal Pilot Acceptance` or broader operational rollout against an exact baseline and its acceptance, risk, support, recovery, and readiness evidence. It is not required merely to execute synthetic verification or a bounded non-production technical pilot. It is distinct from Product Decision Authority even when the company assigns both authorities to the same person; an unassigned authority leaves the applicable adoption or rollout gate `BLOCKED`.
_Avoid_: commercial buyer, Product Decision Authority by implication, informal user enthusiasm, unrecorded go-live approval

**Single-Actor Functional Acceptance**:
A bounded functional-acceptance exercise in which one human operates two or more separately provisioned identities to verify permissions, actor separation, conflict handling, workflow, and release behavior. It may support MVP verification and Pilot-Ready status when clearly labeled, but it is not representative-user evidence, independent review, or authority for company-wide rollout.
_Avoid_: independent user acceptance, two-person evidence, self-approval presented as review, production authorization

**Internal Pilot Acceptance**:
The recorded decision that a controlled internal pilot may proceed after representative internal-user evidence, the exact baseline, open risks, support and recovery readiness, and the Internal Adoption Authority's disposition are available. Single-Actor Functional Acceptance alone cannot produce this status.
_Avoid_: Pilot-Ready Baseline, developer sign-off alone, informal trial, commercial customer acceptance

**Technical Pilot Verification**:
A bounded non-production or explicitly approved internal execution of the MVP Release Spine used to verify functional behavior, safety, traceability, and recovery. It may be performed by the Principal Product Author with Test Personas and without an Internal Adoption Authority, but its result cannot be represented as representative-user acceptance, Internal Pilot Acceptance, or operational rollout authorization.
_Avoid_: production go-live, independent user study, company-wide approval, hidden self-certification

**Specialist Review Gap**:
An identified absence of an appropriately competent reviewer for an applicable concern. The Principal Product Author must receive a concrete assessment checklist and remediation recommendation, perform the available preparation, and retain the gap as `BLOCKED` until the required independent disposition exists.
_Avoid_: work not attempted, silent waiver, Agent review presented as accountable human approval

**Canonical Demo Dataset**:
A versioned, deterministic, synthetic dataset that represents the initial CAD and Office structures, Generations, Revisions, relationships, and failure cases needed to demonstrate and verify the MVP without using unapproved company-sensitive or production data.
_Avoid_: arbitrary showcase files, representative internal-user evidence, production migration baseline

**Internal Pilot Evidence Boundary**:
The controlled separation between repository-safe synthetic verification and representative internal-project evidence. The repository may contain the Canonical Demo Dataset and metadata about pilot evidence; sanitized or production-derived project data remains in a company-approved storage boundary with classification, owner, access, retention, and handling records, and is not automatically committed to Git.
_Avoid_: private Git as a data-approval substitute, production data in source control, untracked pilot evidence

**Test Persona**:
A simulated product role used to execute a controlled demo or verification scenario, such as design engineer, second engineer, reviewer/approver, or PDM administrator; it is not evidence that representative users participated.
_Avoid_: validated stakeholder, real-user study participant, shared production identity

**Reference-Coverage Evidence**:
Lawfully available or authorized evidence of an externally observable reference-product capability or behavior. It can establish a Behavioral Coverage Disposition candidate, guide design questions, and support a Reference-Backed Product Hypothesis, but it cannot by itself prove Internal Operational Need Validation, user acceptance, measured operational value, or release readiness.
_Avoid_: stakeholder interview, internal pilot evidence, acceptance evidence, competitor feature treated as requirement

**Reference-Backed Product Hypothesis**:
An approved product-direction hypothesis supported by controlled Reference-Coverage Evidence and the project's DDM baseline objective. It is sufficient to justify continued documentation, feasibility analysis, coverage assessment, and candidate-requirement elicitation, but it is not a claim that representative internal users have validated the problem, priority, workflow, or expected value.
_Avoid_: validated stakeholder need, approved software requirement, internal user acceptance, measured operational value

**Internal Operational Need Validation**:
Controlled evidence from representative company roles, workflows, or approved internal records confirming that an internal problem, priority, context, and desired outcome apply to the company. Until available, the affected internal-need claim remains `UNKNOWN` or `BLOCKED` even when its Reference-Backed Product Hypothesis is accepted for product direction.
_Avoid_: reference-product evidence alone, Product Decision Authority opinion alone, feature-parity decision, technical verification

**Stakeholder Need**:
An identified stakeholder problem, objective, or desired outcome that can justify requirements after review but is not itself a software requirement.
_Avoid_: competitor feature, implementation task, assumed requirement

**Internal Business Requirement**:
An organization-level obligation, policy, constraint, or measurable operating outcome owned by `DOC-03`. Here, “business” means the company's internal engineering operation and governance; it does not imply sales, pricing, external customers, or market requirements.
_Avoid_: commercial requirement, software design, competitor feature, unsupported savings target

**Business Rule**:
A governed business constraint or policy owned by `DOC-03` and referenced, rather than re-authored, by affected software requirements.
_Avoid_: duplicated requirement, implementation rule, UI behavior

**Software Requirement**:
A uniquely identified and verifiable obligation owned by `DOC-04`, derived from an eligible Stakeholder Need or approved product decision.
_Avoid_: Business Rule, design choice, roadmap item

**Document Status**:
The lifecycle state of a Controlled Document Instance: Draft, Proposed, Approved, Superseded, or Retired; it is separate from a product-gate outcome.
_Avoid_: PASS, FAIL, BLOCKED, workflow state of a product object

**Gate Decision**:
An attributable disposition of one exact controlled baseline, recording gate, input document IDs and versions, immutable Git evidence, reviewer and approver roles, outcome, rationale, actions, and date. A merge, conversation, or verbal acknowledgement is not itself approval.
_Avoid_: Document Status, Git merge, chat agreement without controlled record

## Repository and delivery tooling (inherited during PG0)

The following terms describe the inherited Core Workspace and Agent Workspace tooling that is
still present while PG0 decides what to retain, replace, or remove. They do not belong to the C1
product domain and must not be confused with a Managed Workspace or a product Reservation.

**Development Workspace Template**:
The reusable repository baseline from which this repository originated.
_Avoid_: IDEA Engineering product, PDM template

**Core Workspace**:
The inherited stack-neutral repository layer containing collaboration rules, agent guidance,
security defaults, documentation conventions, and the current verification entry point.
_Avoid_: C1 application runtime, product architecture

**Shared Agent Workspace**:
A logical collaboration space that coordinates durable work and integration evidence without a
shared filesystem or Agent session.
_Avoid_: Managed Workspace, shared Codespace

**Agent Run**:
One attributable execution attempt against a claimed Work Item in exactly one Agent Sandbox.
_Avoid_: product workflow instance, anonymous Agent activity

**Agent Sandbox**:
An isolated execution environment owned by one Agent Run.
_Avoid_: Managed Workspace, shared working directory

**Agent Orchestration Layer**:
An optional tooling layer that coordinates work submission, claims, Agent Runs, and integration.
_Avoid_: Interoperability Fabric D, C1 Server

**Agent Control Plane**:
The authenticated tooling surface that manages durable Agent Run state and dispatch.
_Avoid_: IDEA product control plane, shared shell

**Agent Runner**:
A tooling component that starts or resumes an Agent Run in its Agent Sandbox and reports evidence.
_Avoid_: Workspace Service, format worker

**Local Agent Runner**:
An Agent Runner operated from a human-controlled development environment under that person's identities.
_Avoid_: C1 Desktop, shared developer login

**Managed Agent Runner**:
An organization-operated Agent Runner authorized through approved workload identities.
_Avoid_: Workspace Service, uploaded personal session

**Runner Adapter**:
The tooling boundary that maps Agent Sandbox lifecycle operations to an approved execution environment.
_Avoid_: file-format adapter, silent infrastructure fallback

**Run Owner**:
The single identity authorized to issue instructions to an active Agent Run.
_Avoid_: product Document owner, concurrent controllers

**Agent Handoff**:
An explicit transfer of Run Owner responsibility that preserves run context and prevents overlapping control.
_Avoid_: Reservation transfer, informal takeover

**Agent Checkpoint**:
A durable recovery boundary from which a later Agent Run can continue.
_Avoid_: Product Definition Generation, uncommitted local-only state

**Work Claim**:
A time-bounded exclusive tooling reservation connecting one Work Item to at most one active Agent Run.
_Avoid_: product Reservation, permanent lock

**Change Scope**:
The expected paths and semantic seams affected by one Work Item.
_Avoid_: Check-in scope, file ownership

**Integration Queue**:
The dependency-aware flow that serializes incorporation of candidate repository changes and evidence.
_Avoid_: C1 integration API, first-push-wins

**Run Evidence**:
The attributable record of an Agent Run's relevant work state, checkpoint, verification, and outcome.
_Avoid_: product Audit Evidence, raw secret log

**AI Workload Credential**:
An organization-approved non-personal credential scoped to a managed AI workload.
_Avoid_: C1 user credential, personal ChatGPT token

**Stack Profile**:
An optional repository layer that supplies real language/framework setup, lint, test, and build behavior.
_Avoid_: Product Profile, mandatory stack

**Platform Adapter**:
An optional repository integration for source hosting, work tracking, CI/CD, or cloud infrastructure.
_Avoid_: Interoperability Fabric D, format adapter

**Work Item**:
A provider-neutral unit of planned repository work represented by the selected tracker adapter.
_Avoid_: C1 workflow task, provider-specific issue when discussing the cross-provider concept

**Generated Project**:
An independently owned repository created from a Development Workspace Template release.
_Avoid_: IDEA Platform, synchronized template mirror

**Template Release**:
A versioned Development Workspace Template snapshot with release notes and an explicit adoption path.
_Avoid_: IDEA product release, silent synchronization
