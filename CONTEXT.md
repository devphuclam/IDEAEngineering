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

**Actor**:
The stable accountable identity to which IDEA attributes a command, decision or Audit event within an Operating Organization. It remains distinguishable from the login name or authentication method used at the time, and an automated actor cannot substitute for a required eligible human approver.
_Avoid_: username, email address, session token, assumed approval authority

**IDEA Account**:
An organization-owned account through which a person authenticates as a stable Actor, with explicit eligibility and recovery controls. Core v0 starts with administrator-issued native accounts; disabling or changing a login does not erase the Actor's retained product history.
_Avoid_: document owner role, open self-registration, company-login integration assumed complete

**Login Identity**:
A verified sign-in identity explicitly associated with an IDEA Account, such as its native login or a later approved provider-and-subject pair. Adding or changing a login method does not create document privileges, change the stable Actor, or merge accounts merely because names or email addresses match.
_Avoid_: Actor ID, automatic email matching, group claim as final product permission

**Security Principal**:
An Actor or Business Group that may receive a Role Assignment. A future automated integration may use a separately governed service principal, but an IDEA Account, Login Identity, Organizational Department or job title is not itself the recipient of product authority.
_Avoid_: username, session, department, document owner, implied administrator

**Permission**:
A stable locale-neutral action code owned by the IDEA product, such as `document.read`, `document.checkout`, `review.approve` or `project.membership.assign`. Administrators may compose supported Permissions into Role Definitions but cannot invent a new executable Permission through configuration alone. A Permission only establishes eligibility to attempt that action; the owning Module still enforces lifecycle, Checkout, current-Generation, independence and completeness rules.
_Avoid_: button label, job title, unrestricted CRUD, business-rule bypass

**Role Definition**:
A stable named definition whose active immutable version contains a collection of Permissions and the resource kinds to which they may apply. Built-in Role Definitions are supplied by IDEA and cannot be edited; a Custom Role Definition is changed by creating, validating and activating a successor version rather than overwriting the active version. Activation makes that successor available for new Role Assignments; it does not silently retarget an existing Role Assignment, which remains pinned to its exact predecessor version until an authorized replacement is explicitly confirmed and audited.
_Avoid_: Group, account type, Role Assignment, hard-coded named user, mutable permission list

**Authorization Scope**:
The identified resource boundary within which a Role Assignment applies. Core v0 uses the hierarchy Operating Organization (the whole IDEA system) → Project → individual governed resource; a parent assignment applies to descendants only where the Role Definition and optional condition cover the requested resource and action. This inheritance is evaluated from the governing Role Assignment at request time; it is not copied into an independent mutable ACL on every descendant. Document Folder, Organizational Department, Document Class and lifecycle state are not Scope levels.
_Avoid_: UI location, department, matching group name, implicit global authority

**Role Assignment**:
The attributable association that grants one Security Principal one exact Role Definition version at one Authorization Scope, optionally constrained by an effective period and an explicit authorization condition. It may target an Actor directly or a Business Group; Group assignment is the normal personnel-management path, while every direct assignment remains visible and auditable. Changing the active Custom Role version does not mutate this association; moving it to a successor is a separate governed replacement.
_Avoid_: Group Membership, Workflow Assignment, account creation, role name without scope

**Administrator**:
An Actor who has an effective Role Assignment containing one or more administration Permissions at an explicit Authorization Scope. Administrator is not an account type or a fixed rank: the same Actor may hold several independently assigned administrative roles, and none implies document, Approval or Release authority unless another applicable Role Assignment grants it.
_Avoid_: all-powerful account, hidden superuser, department identity, administrator hierarchy

**Account Administrator**:
The built-in Role Definition that permits named personnel, normally from the System Management Department, to issue, activate, suspend, recover and maintain IDEA Accounts and Login Identities within the assigned Scope. It does not manage Project Membership, Business Group Membership, Role Definitions or Role Assignments and grants no document, Approval or Release authority.
_Avoid_: department account, project access administrator, role administrator, document superuser, password reader

**Super Administrator**:
The protected built-in Role Definition used only for initial bootstrap and governed recovery of the highest administration authority. Only an effective Super Administrator may add or remove this role; IDEA refuses removal of the last effective recovery path. The role is not intended for routine engineering or administration and every assignment change is audited.
_Avoid_: daily account, shared root password, invisible bypass, automatic document authority

**Privileged Role Administrator**:
The built-in Role Definition that manages non-Super-Administrator Role Definitions and administrative Role Assignments within its Scope. It cannot grant or revoke Super Administrator, cannot make a candidate policy authorize its own activation and receives no product-data authority merely by managing roles.
_Avoid_: Super Administrator, Account Administrator, project member manager, self-authorizing policy

**Product Configuration Administrator**:
The built-in Role Definition that prepares and, where separately authorized, activates governed document-class, metadata, numbering, workflow, localization and format configuration. It does not provision accounts, manage Group Membership, assign privileged roles, or receive document, Approval or Release authority by implication.
_Avoid_: PDM superuser, Account Administrator, Project Administrator, automatic approver

**Project Administrator**:
The built-in Role Definition that manages Project Membership, Project Groups and permitted product Role Assignments inside the assigned Project. It may assign only approved Role Definitions that are assignable at that Scope and cannot create accounts, change system-wide Role Definitions, grant Super Administrator or operate another Project.
_Avoid_: Account Administrator, global role administrator, project owner with unrestricted data access

**Audit Reader**:
The built-in read-only Role Definition for viewing and exporting authorized Audit and access-decision evidence within its Scope. It cannot alter evidence, configuration, membership, Role Assignments or product state.
_Avoid_: auditor with write access, log administrator, approval authority

**Organizational Department**:
The company unit associated with a person's IDEA Account for administration and wayfinding, such as Design Engineering or System Management. A department is neither an Actor nor an authorization grant.
_Avoid_: login account, permission group, business role, authorization boundary

**Project**:
A governed engineering scope within which membership, groups, roles and product permissions are evaluated. Being eligible in one Project does not create eligibility or authority in another Project.
_Avoid_: Document Folder, Product Structure root, Organizational Department, company-wide permission

**Governing Project**:
The single Project that owns authority to modify, review and Release one Logical Document. Use of that document by another Project does not transfer its ownership or permit the consuming Project to change its Product Definition.
_Avoid_: current viewing Project, every Project that references the document, Document Folder, shared ownership

**Project Membership**:
The attributable association that makes an eligible Actor a participant in one Project for an effective period. Project Membership grants no document action by itself; applicable direct or Business-Group Role Assignments determine authority within that Project.
_Avoid_: IDEA Account, company employment, implicit document access, membership inherited across Projects

**Cross-Project Reference**:
An attributable relationship from a consuming Project to one exact Released Business Revision and Generation governed by another Project. It grants no modification authority, never follows an unqualified latest version, and remains subject to access policy on both the consuming and governing scopes.
_Avoid_: shared document ownership, editable copy, floating latest link, Document Placement

**Shared Library**:
A separately governed future scope that may own reusable Released Logical Documents for controlled use across Projects. It is not a folder or a shortcut for giving every Project authority over the same document.
_Avoid_: public folder, company-wide write access, multiple Governing Projects, unmanaged file share

**Business Group**:
A governed Security Principal with an explicit organization or Project scope. A Project-scoped Business Group contains eligible Project Members and may receive Role Assignments; membership or authority never carries to another Project merely because a Group has the same name. Core v0 does not allow one Business Group to contain another Business Group.
_Avoid_: department, shared account, direct user grant, document owner, login account, group with implicit global scope

**Project Group**:
A Business Group whose scope is exactly one Project, such as that Project's mechanical-design group. Membership is evaluated only through an active Project Membership and does not carry to a similarly named group in another Project.
_Avoid_: Organizational Department, global group by name, Product Structure branch, Workflow task

**Project Role**:
A business-facing name for a Role Definition intended to be assigned at Project Scope, such as Design Engineer, Reviewer or Release Authority. It is not a separate object nested inside a Project Group: a Role Assignment connects the Role Definition to an Actor or Project Group at the applicable Project Scope.
_Avoid_: Login Identity, job title, Group Membership, Workflow Assignment, second role model

**Permission Set**:
An obsolete drafting term replaced by Role Definition. In the canonical RBAC model, a Role Definition version already contains its Permissions; IDEA must not maintain a second independently assignable Permission Set layer.
_Avoid_: new domain object, second authorization hierarchy, separately assigned permission bundle

**Workflow Role**:
A policy-defined responsibility required by a Workflow step, such as Approver or Release Authority. It resolves eligible Actors from applicable Role Assignments, including assignments made to Project Groups; satisfying it does not create authority outside the applicable policy, Project, scope and state.
_Avoid_: job title, account type, permanent global permission, named person

**Business Group Membership**:
A governed association that places an eligible Actor or Project Member directly in one Business Group within its explicit scope. Project Administration manages Project-scoped membership separately from account provisioning; Core v0 has no Group-to-Group Membership, and membership alone grants nothing until a Role Assignment applies to that Group.
_Avoid_: department identity, account permission, routine direct user grant, document ownership, membership inferred from a matching group name

**Effective Permission**:
The explainable allow-or-blocked result for one Actor, action, resource and current state. Core v0 combines positive Permissions from every currently valid direct or Business-Group Role Assignment whose Scope and condition cover the resource; absence of a grant means blocked and there is no general configurable explicit-deny rule. The explanation identifies the account eligibility, Group Memberships, Role Assignments, Role Definition versions, Scope resolution and subsequent business gates that contributed to the result.
_Avoid_: role-name guess, hidden permission, authentication success, administrator assumption, general explicit-deny rule

**Administration Scope**:
The Authorization Scope of an administrative Role Assignment. It is not a separate hierarchy from product RBAC.
_Avoid_: second scope model, global authority by default, folder placement, department label

**Permission Inspection**:
A read-only evaluation that explains an Actor's Effective Permission for a selected action, resource and state without creating a session as that Actor. Persona switching belongs only to Development Administration Mode.
_Avoid_: impersonation, login as user, hidden simulation, production persona switch

**Account Suspension**:
The reversible loss of sign-in eligibility for an IDEA Account while its Actor identity, attribution and retained membership history remain intact. Reactivation does not silently validate prior business access; applicable memberships must be reviewed before use resumes.
_Avoid_: account deletion, Actor deletion, history removal, automatic access restoration

**Development Administration Mode**:
A non-operational test capability restricted to development environments that lets a designated developer exercise role-specific paths and manage synthetic data. It is absent from pilot and live operation and never constitutes an Actor's business authority.
_Avoid_: superuser, production bypass, permanent administrator, hidden role

**Bootstrap Custodian**:
A named human identity designated when the Operating Organization is provisioned to activate its first Access Policy and establish a recoverable governance path. Normal policy authority replaces bootstrap authority after activation; the last effective recovery path cannot be removed without an eligible replacement, and a platform operator has no implicit company-data authority.
_Avoid_: permanent super-administrator, unnamed deployment account, implicit provider access

**Policy Adoption Authorization**:
The authorization used to approve or activate a candidate Governed Policy Definition under the currently active policy or an explicit bootstrap or break-glass authority. Where separation is required, the activating Actor differs from the author; a Single-Actor Governance Exception remains explicit, and a candidate policy can never grant the authority needed for its own adoption.
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

**Core v0**:
The first bounded production-implementation target for the approved MVP Release Spine. It proves controlled identity, safe workspace publication, exact structure and release, and one deep CAD profile before broader PDM-to-PLM capabilities are added; the name does not mean the inherited Core Workspace, a prototype, the whole future PLM product, or production readiness before the applicable gates pass.
_Avoid_: Core Workspace, UI prototype, complete DDM parity, full PLM scope, implementation authorization by name alone

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
A controlled product-data identity that remains stable across names, Document Placements, Generations, Business Revisions, and workflow transitions.
_Avoid_: physical file, path, folder entry, one version

**Document Class**:
A configurable governed classification of Logical Documents that selects applicable metadata, numbering, Workflow, permitted source formats, and Release evidence. Engineering discipline, document purpose, file format, and folder placement remain separate classifications.
_Avoid_: file extension, software application, department, folder, hard-coded type list

**Engineering Discipline**:
A configurable classification such as mechanical, electrical, pneumatic, or control engineering that describes the engineering domain of a Logical Document. It does not by itself determine file format, document authority, or access.
_Avoid_: Document Class, Organizational Department, permission group, file format

**Document Purpose**:
A configurable classification describing why a Logical Document is used, such as design, manufacturing, procurement, assembly, inspection, or handover. It does not turn planning or operational activity into controlled product state.
_Avoid_: Workflow State, Organizational Department, Document Class, business transaction

**File Format**:
The identified serialized form of an Artifact, such as IRONCAD `.ics`, PDF, STEP, DWG, XLSX, or DOCX, evaluated through an exact Format Capability Profile. A software product name, document purpose, or engineering discipline is not a File Format.
_Avoid_: Document Class, application name alone, document purpose, unsupported format family claim

**Business Document Number**:
The organization-visible document number allocated, accepted from an existing convention, or received from an approved external source under a Numbering Policy. It is distinct from the stable DocumentId, display title, filename, Business Revision, and Version within Revision.
_Avoid_: DocumentId, filename, Revision label, Generation identity

**Document Folder**:
An organization-owned logical container used to browse and organize Logical Documents and subordinate folders or dividers. It is independent of physical Artifact storage and a document's Managed Workspace path; placing a document in a folder does not itself grant or revoke access to its content.
_Avoid_: physical directory, Artifact location, Logical Document identity, Product Structure, access-control boundary

**Document Placement**:
An identified relationship that makes a Logical Document visible in a Document Folder, either as its primary placement or as an explicit link. Moving or removing a placement does not rename, copy, revise, or create a Generation of the Logical Document; an exact historical link additionally pins the selected Business Revision and Generation.
_Avoid_: physical file copy, Workspace Reference, Product Structure edge, document identity

**Create Copy**:
An explicit operation that creates a new Logical Document with a new `DocumentId` from a selected source and records the source relationship. It is distinct from renaming a document, moving a Document Placement, or adding a link to an existing document.
_Avoid_: Rename, Move, Reference, physical deduplication

**Artifact**:
Immutable binary content identified by a digest and referenced by a Generation Manifest.
_Avoid_: Logical Document, workspace path

**Primary Artifact**:
The source Artifact designated by a Generation Manifest as the authoritative file for that controlled content role. A PDF can be a Primary Artifact when it is the source document, while a PDF generated from CAD is a Representation of the CAD source.
_Avoid_: preview, derivative chosen by extension alone, mutable working file, floating latest file

**Generation**:
An immutable controlled snapshot of a Logical Document's Product Definition, created by the first
content Check-in, a successful changed Check-in, or the baseline of a new Business Revision.
A Generation has a technical identity used for exact history,
concurrency, review and Release pins.
_Avoid_: Business Revision, Version within Revision, latest file, save operation

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
The business-visible order of Generations inside one Business Revision. It begins at `1`, increases
exactly once when a changed Product Definition is successfully checked in, does not increase for a
No Change Check-in, and resets to `1` when a new Business Revision is created.
_Avoid_: Version Sequence, Business Revision, Generation identity, local file version, Controlled Document Version

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
A server-authoritative temporary exclusive right for one actor and Managed Workspace to publish a new Generation for one Logical Document from one expected Generation; it cannot prevent an external application from editing a local file. At most one Reservation for the same Logical Document may be `Active` at a time.
_Avoid_: assembly-wide lock, file-system lock, Reference

**Reservation Lease**:
The renewable period during which an `Active` Reservation remains valid. Loss of connectivity, sign-out or application exit does not immediately release it. Expiry removes the right to publish but does not delete local work, waive expected-Generation validation, silently transfer authority, or permit a stale overwrite.
_Avoid_: permanent checkout, local-file expiry, silent force unlock

**Reservation Status**:
The server-recorded lifecycle of a Reservation: `Active` grants the bounded publish entitlement; `Expired` no longer grants it; `Released` records its normal end after successful changed or No Change Check-in or governed cancel; `Recovered` records that an authorized recovery ended or replaced the old entitlement. Recovery creates no right to publish stale work and never erases a user's local candidate.
_Avoid_: Workflow State, local-file state, silent reassignment, evidence that a user abandoned work

**Offline Workspace Operation**:
The ability to open, reference, or edit already materialized workspace files while the service is unavailable. Offline operation cannot acquire a new Reservation, Check in, recover a Reservation, approve, or Release; reconnection revalidates the Reservation Lease and expected Generation, and any conflict fails closed while preserving local work.
_Avoid_: full offline command replay, offline approval, stale overwrite, deletion of conflicting local work

**Reference**:
Workspace access to an exact Generation without a Reservation or permission to publish a new Generation for that Logical Document. An external application may still modify the local bytes; that condition remains local work and cannot be Check-in to the original document unless a new Checkout is acquired against the same current Generation.
_Avoid_: Checkout, untracked copy

**Reservation Disposition**:
The attributable terminal outcome for each Reservation in a Check-in scope. A successful changed or No Change Check-in releases every confirmed in-scope Reservation; a failed or uncommitted operation does not release a still-valid Reservation. It is not a user option to keep Checkout after a successful Check-in.
_Avoid_: retain-after-Check-in option, hidden auto-unlock, global cancel

**Reservation Recovery**:
An authorized, reasoned, and audited recovery or break of one Reservation. It may transfer or remove publish entitlement according to policy but never bypasses expected-Generation validation, deletes local work, or permits a stale overwrite.
_Avoid_: force overwrite, silent administrator unlock, conflict resolution

**Check-in Operation**:
One server-tracked, idempotent attempt identified by a client-supplied `OperationId` to validate and publish one confirmed Check-in scope. It stages and verifies candidate Artifacts before one authoritative commit; retrying the same inputs resumes or returns the same logical result rather than creating another Generation or Change Set.
_Avoid_: upload session alone, one operation per file in an atomic scope, new operation after an uncertain response

## Product structure and format

**Related Document**:
A Logical Document dependency that must be resolved when materializing or validating Product Structure.
_Avoid_: attachment when the document participates in engineering structure

**Structure Snapshot**:
An immutable occurrence/dependency graph that pins the identities needed to reproduce a Product Definition.
_Avoid_: mutable assembly graph, flat file list, latest dependency

**Bill of Materials (BOM)**:
A governed, queryable view of one exact Structure Snapshot for one identified BOM View Profile. It presents controlled occurrence information such as component identity, exact Generation, quantity, position and applicable profile-defined fields; it is not an Excel, PDF or CSV file.
_Avoid_: spreadsheet treated as Product Structure authority, generic "the BOM" without source or purpose, latest-at-read-time list

**BOM View Profile**:
A versioned definition of the purpose, included occurrence fields, filters, ordering and output rules used to produce a BOM view from an exact Structure Snapshot. Different engineering or handover views remain distinguishable rather than competing as one unnamed BOM.
_Avoid_: file format alone, user-local column preference treated as a governed profile, mutable rule that reinterprets an old export

**BOM Representation**:
A non-authoritative Excel, PDF, CSV or other output tied to one exact Structure Snapshot and BOM View Profile, with its content digest and producer provenance. It may be regenerated; after its source or profile advances it remains historical and is identified as `Needs update` rather than current.
_Avoid_: authoritative Product Structure, floating latest export, independent controlled parts-list document without an explicit source relationship

**BOM Import Candidate**:
A non-authoritative spreadsheet or structured payload proposed as changes to one exact base Structure Snapshot. It becomes authoritative only after validation, visible difference preview, user confirmation and one atomic publication that creates a new Structure Snapshot and Generation.
_Avoid_: direct table overwrite, partial row import, uploaded file automatically treated as approved structure

**Departmental Deliverable**:
A governed Logical Document, Generation, Product Structure output, Release Record or other evidence that one department supplies or receives in an engineering handoff. The handoff describes responsibility; it does not make IDEA authoritative for the underlying time, cost, purchasing, manufacturing or project-management process.
_Avoid_: every department output treated as a PDM feature, unversioned handoff file

**Operational Reference Data**:
Hours, cost estimates, purchasing or fabrication state, progress or completion information retained for engineering context without IDEA becoming the system that calculates or executes that business process.
_Avoid_: Workflow State, Release state, authoritative ERP/MRP transaction

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
A versioned declaration of the evidenced generic-vaulting, extraction, structure, preview, conversion, and fidelity capability for one exact file-format and tool combination. New profiles can be added without changing Logical Document, Generation, Reservation, or Release semantics.
_Avoid_: unsupported claim that a software product is simply "integrated"

**Format Support Level**:
A management-facing summary of an exact Format Capability Profile: Level 1 controls and reproduces the file, Level 2 also provides qualified viewing or basic extraction, and Level 3 provides every deeper behavior explicitly promised and verified for that format/tool combination. Level 3 capabilities differ by format and never imply that PDF, spreadsheet, software, and CAD files expose the same semantics.
_Avoid_: one generic integration claim, support inferred from extension, all-formats parity, unverified capability

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

**Review Round**:
One identified submission attempt inside a Workflow Instance, pinned to one exact Generation and review scope. Resubmission creates a new Review Round while the withdrawn, rejected, approved, or superseded round remains attributable history.
_Avoid_: new Workflow Instance, overwritten review, mutable approval target

**Review Withdrawal**:
The attributable ending of the current Review Round by its submitter before Release, returning the Business Revision to In Work without recording a rejection. It is distinct from Reviewer rejection and governed administrative recovery.
_Avoid_: Reject, Cancel Checkout, deleted review history, administrator override

**Workflow Definition Version**:
An immutable identified definition of states, transitions, eligible actors, decision rules, required evidence, notifications, and Revision or Release effects. Existing workflow history remains bound to the version that governed it when later definitions are added.
_Avoid_: hard-coded state enum, mutable current workflow, graphical layout as business authority

**Graphical Workflow Designer**:
A deferred no-code administration surface that may later compose and inspect a Workflow Definition Version as states, activities, paths, assignments, decisions, evidence rules and notifications. Core v0 uses validated governed configuration/property forms instead. If the graphical surface is later approved, it edits the same definition; canvas coordinates and visual styling are not lifecycle authority.
_Avoid_: Core v0 requirement, copied reference-product interface, unvalidated diagram, executable drawing separate from policy

**Seeded Engineering Release Workflow**:
The initial configurable Workflow Definition Version whose normal path is `Start` to `In Work` to `Under Review` to `Released`, with Reject or Rework returning to `In Work` and withdrawal available before the final decision. It may be cloned and changed through validated governed configuration; it is a starter template rather than a hard-coded universal lifecycle.
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
An immutable identified policy definition that governs Role Definition versions, assignable Scope rules, Role Assignment conditions and authorization evaluation. Identity and Accounts establishes the Actor and account/session eligibility; it does not grant controlled-document authority by itself. Core v0 denies by default, combines positive Permissions from applicable direct and Business-Group Role Assignments and has no general configurable explicit-deny rule. Initial built-in roles are controlled configuration rather than hard-coded named users, while Custom Role changes create successor versions. JSON may carry a candidate policy for validated import/export, but only an authorized activated version in the server-managed authoritative store has effect.
_Avoid_: authentication mechanism, Identity role treated as complete product authorization, routine per-user grants, role name embedded in domain logic, mutable unversioned permission table, editable JSON file treated as live authority, unexplained deny precedence

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

**Author Self-Review**:
The Principal Product Author's attributable check of completeness, consistency, traceability, and readiness of authored material. It can find and remediate defects but cannot satisfy a requirement for independent, specialist, representative-user, or decision-authority review.
_Avoid_: independent review, specialist approval, boss decision, second human by role label

**Product Decision Authority**:
The role accountable for deciding product specifications, feature scope, and selected technology or architecture proposals. In the current project this role is organizationally separate from the Principal Product Author; specialist competence and independent-gate obligations remain explicit rather than being implied by management authority.
_Avoid_: author by default, universal specialist reviewer, undocumented approval

**Product Decision Axis**:
One of the three subjects decided by the Product Decision Authority: `Feature` defines approved capability scope and priority, `Spec` defines required observable behavior and acceptance, and `Tech` defines the selected architecture and technology realization. Roadmap, evidence, risk, standards, and gate records support these axes but do not create a fourth boss-approval subject.
_Avoid_: eight-document approval checklist, roadmap approval by implication, feature/spec/technology mixed into one undocumented decision

**Product Decision Brief**:
A concise boss-facing controlled view for exactly one Product Decision Axis, pinned to the exact versions of the detailed Core Product Documents and supporting records it summarizes. It is not a second requirements or architecture authority; a source change makes the brief stale, and the attributable decision must be applied back to the affected controlled sources.
_Avoid_: replacement for DOC-01 through DOC-08, unpinned presentation, second source of truth, verbal approval without baseline identity

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
A simulated product role used to execute a controlled demo or verification scenario, such as design engineer, second engineer, reviewer/approver, Account Administrator or Project Administrator; it is not evidence that representative users participated.
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
