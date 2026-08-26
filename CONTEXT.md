# Development Workspace Template

A reusable repository baseline for starting multiple software projects with a consistent developer environment, agent guidance, and collaboration workflow. It is product-agnostic and does not encode the domain model of any one application.

## Language

**Development Workspace Template**:
A reusable repository baseline cloned or generated to start a new project with shared development and collaboration conventions.
_Avoid_: PDM template, project-specific starter

**Core Workspace**:
The stack-neutral layer shared by every generated project. It contains collaboration rules, agent guidance, security defaults, documentation conventions, and the reproducible verification entry point.
_Avoid_: application starter, framework template

**Shared Agent Workspace**:
A logical team workspace around one Generated Project that centralizes durable work coordination, Agent Run state, and integration evidence without requiring participants to share one filesystem or session.
_Avoid_: shared Codespace, shared Agent session

**Agent Run**:
One attributable, auditable execution attempt of an Agent against a claimed Work Item within exactly one Agent Sandbox. A retry is a new Agent Run linked to the earlier attempt.
_Avoid_: anonymous Agent activity, shared Agent session

**Agent Sandbox**:
An isolated execution environment owned by one Agent Run so concurrent work cannot directly overwrite another run's files or mutable state.
_Avoid_: shared working directory, shared Agent filesystem

**Agent Orchestration Layer**:
An optional layer that coordinates multi-user work submission, claims, dependencies, Agent Runs, and integration while preserving the Core Workspace contract and isolated execution.
_Avoid_: shared Codespace, multi-user shell

**Agent Control Plane**:
The authenticated coordination surface within the Agent Orchestration Layer that accepts work intent, manages durable run state, and dispatches work without exposing a shared mutable checkout.
_Avoid_: shared shell, shared repository process

**Agent Runner**:
An execution component that starts or resumes an Agent Run inside its assigned Agent Sandbox and reports durable status and evidence to the Agent Orchestration Layer.
_Avoid_: shared Agent process, shared development shell

**Local Agent Runner**:
An Agent Runner operated from a human-controlled development environment under that person's identities while participating in the Shared Agent Workspace through durable coordination.
_Avoid_: central service account, shared developer login

**Managed Agent Runner**:
An organization-operated Agent Runner hosted in managed infrastructure and authorized only through approved workload identities and credentials.
_Avoid_: uploaded personal session, shared human account

**Runner Adapter**:
An interchangeable boundary that maps Agent Sandbox lifecycle operations onto an approved local or managed execution environment and fails explicitly when required capabilities are unavailable.
_Avoid_: silent infrastructure fallback, mandatory cloud runtime

**Run Owner**:
The single human or automation identity authorized to issue instructions to an active Agent Run. Ownership may be transferred through an explicit Agent Handoff but is never concurrent.
_Avoid_: simultaneous controllers, anonymous operator

**Agent Handoff**:
An explicit transfer of Run Owner responsibility that preserves the Agent Run context and prevents overlapping control.
_Avoid_: shared control, informal takeover

**Agent Checkpoint**:
A durable recovery boundary from which a later Agent Run can safely continue after handoff, failure, or sandbox destruction.
_Avoid_: uncommitted sandbox state, local-only recovery

**Work Claim**:
A time-bounded exclusive reservation connecting one Work Item to at most one active Agent Run and its Run Owner. An expired claim releases the Work Item without erasing run evidence.
_Avoid_: permanent lock, untracked assignment

**Change Scope**:
The expected paths and semantic seams affected by a Work Item. Scope overlap informs dependency and integration ordering but is not a hard file lock.
_Avoid_: file ownership, mandatory path lock

**Integration Queue**:
The dependency-aware ordered flow that incorporates candidate changes one at a time against the latest integration target and records required verification evidence.
_Avoid_: merge race, first-push-wins

**Run Evidence**:
The durable, attributable record of an Agent Run's relevant work state, code checkpoint, verification results, and outcome, excluding credentials and unnecessary sensitive content.
_Avoid_: raw secret log, unverifiable success claim

**AI Workload Credential**:
An organization-approved non-personal credential scoped to a Managed Agent Runner's AI workload and governed independently from any developer's interactive account.
_Avoid_: personal ChatGPT token, shared developer credential

**Stack Profile**:
An optional layer that adds language-, framework-, database-, or API-specific tooling and real setup, lint, test, and build behavior to the Core Workspace without changing its collaboration contract.
_Avoid_: mandatory stack, core dependency

**Platform Adapter**:
An optional integration layer that connects a Generated Project to a source host, CI/CD system, or cloud platform while preserving the Core Workspace contract. Azure DevOps, Azure Pipelines, and Azure infrastructure are separate adapter concerns and may be adopted independently.
_Avoid_: mandatory cloud, bundled Azure stack

**Work Item**:
A provider-neutral unit of planned work that can be represented by GitHub Issues, Azure Boards, or another tracker selected by a Platform Adapter.
_Avoid_: GitHub Issue when referring to the cross-platform concept

**Generated Project**:
An independent repository created from a released Development Workspace Template. After creation, its team owns its code and decides which later template changes to adopt.
_Avoid_: synchronized clone, template mirror

**Template Release**:
A versioned snapshot of the Development Workspace Template with release notes and an explicit migration path. Generated Projects adopt later releases intentionally rather than receiving automatic overwrites.
_Avoid_: silent update, forced synchronization
