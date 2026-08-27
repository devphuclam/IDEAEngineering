# IDEA Engineering Domain Language

IDEA Engineering is the canonical C1 product context for controlled engineering data. It begins with PDM capability, evolves toward PLM inside the same product, and participates in an IDEA Platform only after another independent capability unit exists.

## Product and platform scope

**IDEA Engineering**:
The independent product that owns controlled engineering data and its PDM-to-PLM lifecycle inside C1.
_Avoid_: IDEA Platform, DDM clone, icVault clone

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
_Avoid_: current file folder, mutable latest data

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

**Document Disposition**:
The governed retention state of a Logical Document: Active, Trashed, PurgePending, or Purged.
_Avoid_: Workflow State, direct storage deletion

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

**Reference**:
Workspace access to an exact Generation without a Reservation or permission to publish a new Generation for that Logical Document.
_Avoid_: Checkout, untracked copy

**Reservation Disposition**:
The explicit Check-in outcome that releases or retains Reservations in the confirmed scope.
_Avoid_: hidden auto-unlock, global cancel

## Product structure and format

**Related Document**:
A Logical Document dependency that must be resolved when materializing or validating Product Structure.
_Avoid_: attachment when the document participates in engineering structure

**Structure Snapshot**:
An immutable occurrence/dependency graph that pins the identities needed to reproduce a Product Definition.
_Avoid_: mutable assembly graph, flat file list, latest dependency

**Format Capability Profile**:
A versioned declaration of the evidenced generic-vaulting, extraction, structure, preview, conversion, and fidelity capability for one file format/tool combination.
_Avoid_: unsupported claim that a software product is simply "integrated"

**Product Profile**:
A governed grouping of format capabilities and user experience for a domain such as CAD or Office; it owns no controlled product state.
_Avoid_: domain module, authoritative data silo

## Lifecycle governance

**Workflow State**:
The current business state of an object under one identified Workflow Definition Version.
_Avoid_: generic status without a governing workflow

**Approval Decision**:
An attributable Approve or Reject decision for a pending transition with before-state, after-state, and evidence.
_Avoid_: manual status edit

**Revision Policy**:
The rules that determine which transitions create a new Business Revision and its baseline Generation.
_Avoid_: hidden side effect of approval

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
