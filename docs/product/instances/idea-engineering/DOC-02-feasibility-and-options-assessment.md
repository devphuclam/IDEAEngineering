# IDEA Engineering Core v0 Feasibility and Options Assessment

> **Instance state**: controlled `Draft 0.2`. This assessment supports a decision to continue
> analysis and design. It is not evidence that Core v0 is production-feasible, production-ready or
> preferable on cost, schedule or operations before the identified evidence exists.

## Control envelope

| Field | Recorded value |
|---|---|
| Stable Document ID | `IE-PROD-FEAS-001` |
| Document Class | `DOC-02` |
| Feasibility Instance ID | `IE-FEA-C1-001` |
| Title | IDEA Engineering Core v0 Feasibility and Options Assessment |
| Owner | `Principal Product Author`; named person attribution is `BLOCKED` before `Proposed` |
| Document Status | `Draft` |
| Document Version | `0.2` |
| Applicable Baseline | `IDEA-C1-ANALYSIS-DESIGN-001` |
| Applicable Gate | `PG1`; later technology selection requires `PG3` |
| Effective Date | `NOT APPLICABLE` until approval |
| Authors | `Principal Product Author`; named identity not yet recorded |
| Reviewers | Project user performs internal document review; formal attribution and any required independent/specialist qualification remain to be recorded |
| Approvers | Product Decision Authority for the relevant Feature/Tech decisions; identity and decisions are `UNKNOWN` |
| Source Links | [DOC-01](DOC-01-product-vision-and-scope.md), [DOC-03](DOC-03-business-requirements.md), [product architecture baseline](../../../architecture/idea-product-lifecycle-architecture.md), [accepted design lessons](../../knowledge/idea-design-lessons.md), [interactive prototype](../../../../prototypes/controlled-document-workspace.html) |
| Downstream Links | [DOC-04](DOC-04-software-requirements-specification.md), [DOC-05](DOC-05-architecture-description.md), [DOC-06](DOC-06-data-integration-and-migration-specification.md), [DOC-08](DOC-08-ui-ux-and-interaction-specification.md), [DOC-07](DOC-07-mvp-roadmap-and-delivery-plan.md), [FEATURE-001](decision-briefs/FEATURE-001-feature-definition-and-scope.md), [TECH-001](decision-briefs/TECH-001-technology-and-architecture-proposal.md) |
| Evidence / Claim Status | `BOUNDED DESIGN FEASIBILITY`; production, cost, schedule and operational feasibility remain `UNKNOWN` or `BLOCKED` |
| Change History | 0.2: confirmed operating context and technology evaluation inputs; prior 0.1 retained by [IE-CHG-TECH-001](registers/CHG-2026-09-03-tech-context-and-proposal.md) |
| Access Classification | `INTERNAL` |
| Retention Rule | Retain with the product-definition baseline; exact organizational period is `UNKNOWN`, owned by Product Decision Authority and reviewed before `Approved` |
| Content State | `COMPLETE CONTROLLED DRAFT` with explicit unresolved actions |

<!-- AUTHOR CONTENT START -->

## 1. Feasibility question and decision frame

| Field | Recorded value |
|---|---|
| Feasibility question | Is there enough controlled product, domain and prototype evidence to continue an independent Core v0 design through Spec and Tech decisions while keeping buy/configure and adapt/integrate alternatives visible? |
| Decision needed | At PG1, decide whether the independent-build direction may proceed to detailed Spec preparation for the bounded Release Spine. Do not select the production stack until the Tech decision. |
| Internal context / affected workflow | Internal engineering-document intake, local Office/CAD work, version publication, structure, review, release and exact-baseline recovery. The measured current process is not yet available. |
| Decision owner and review trigger | Product Decision Authority; review FEATURE-001 after DOC-01/02/03, DOC-07 and the closed coverage register are pinned. Reassess at PG3 when Spec, deployment constraints and technology evidence exist. |

The independent-build direction was requested before this assessment. That direction permits focused
design work; it does not remove the obligation to state what is unknown about buying, configuring or
integrating an existing system.

### 1.1 Confirmed planning inputs

[TECH-CTX-001…008](registers/CHG-2026-09-03-tech-context-and-proposal.md) records the user's confirmed
Windows/client, single-site/user-count, native-account, initial administration/operations, rough
document-volume, internal-cost and preliminary recovery context. These inputs allow a justified
Tech comparison; they do not establish a measured current process, concurrent load, deployment
permission, numeric budget or operational feasibility.

The revised [DOC-05](DOC-05-architecture-description.md) compares server, database, Web, Desktop,
account, file-store and hosting choices separately. Its [primary-source evidence](../../../research/2026-09-03-idea-tech-stack-primary-sources.md)
supports lifecycle/license/capability statements only. Company entitlements and total support costs
still require validation.

## 2. Current-process baseline

No representative company process observation has been admitted yet. The table below therefore
records the minimum evidence still required rather than inventing a current-state baseline.

| Process step | Actor / data | Current control | Pain or risk | Evidence |
|---|---|---|---|---|
| Receive or create engineering files | Design Engineer; Office/CAD files | `UNKNOWN` | Duplicate identity, inconsistent metadata or untracked source | `BLOCKED`: nominate pilot project and sample set; owner Product Decision Authority; trigger before internal need validation |
| Edit and share working files | Design Engineer and collaborators | `UNKNOWN` | Overwrite, stale edit, unclear edit authority or lost local work | `BLOCKED`: conduct representative walkthrough; owner Principal Product Author; trigger before Spec approval |
| Distinguish version and revision | Engineering/Quality | `UNKNOWN` | Different meanings may be attached to file version and business revision | `BLOCKED`: capture current terminology and examples; owner Principal Product Author; trigger before Spec approval |
| Review and release | Reviewer/Approver; document/structure baseline | `UNKNOWN` | Approval may not identify one exact reproducible state | `BLOCKED`: capture current approval evidence and authority; owner Product Decision Authority; trigger before Feature/Spec decisions as applicable |
| Restore or reproduce a released state | Quality/Operations; metadata, files and structure | `UNKNOWN` | Backup or copied files may not reconstruct an exact baseline | `BLOCKED`: define pilot restore scope; owner Operations/Quality authority, assignment `UNKNOWN`; trigger before PG4 |

## 3. Options and evaluation

| Option | Scope and assumptions | Internal fit | Data/control risk | Effort/maintainability | Evidence | Disposition |
|---|---|---|---|---|---|---|
| Buy or configure | Procure and configure a PDM/PLM product. Exact product, edition, entitlement, deployment and migration boundary are not selected. | `PARTIAL CONTEXT`: internal purpose, Windows clients and cost principles are known; representative workflow, numeric budget, procurement and hosting approval remain absent. | May provide mature controls, but exact semantics, extensibility, data ownership and export/recovery guarantees are unverified. | License, implementation, customization, upgrade and support effort are `UNKNOWN`. | Public reference behavior is available; target-package and internal-fit evidence are not. | `DEFER ASSESSMENT`: retain as a future comparison; not rejected on unsupported cost or fit claims. |
| Adapt or integrate | Extend an existing internal repository/platform or integrate separate document, workflow and storage components. The candidate internal platform is not named. | `UNKNOWN`: existing systems, owners, APIs, data and constraints have not been inventoried. | Fragmented authority could make identity, transaction and release evidence inconsistent unless one owner contract is established. | Reuse may reduce some work but integration, migration and operational ownership are unmeasured. | No admitted internal platform inventory or proof-of-fit. | `BLOCKED`: owner Product Decision Authority; inventory existing capabilities before claiming reuse. |
| Independent build | Design Core v0 around one authoritative identity/release model, with ordinary external Office/CAD tools and a bounded first deep format profile. | Direction matches the accepted internal product intent and permits explicit semantics. Representative user fit remains unvalidated. | Highest risk is implementing incorrect domain or operational assumptions; mitigated by staged Feature/Spec/Tech decisions and exact negative paths. | Enables controlled modular ownership, but delivery capacity, support cost and schedule are unmeasured. | Domain architecture, accepted design lessons, prototype interaction evidence and fixed public reference inventory. | `RECOMMEND CONTINUE TO SPEC`, not production approval. Reassess at PG3/PG4. |

### 3.1 Evaluation criteria

No numeric weighting is approved. `Must` criteria are veto conditions; `Should` criteria support the
later comparison but cannot compensate for failure of a `Must` criterion.

| Criterion ID | Definition / metric | Weight or priority | Evidence method | Owner |
|---|---|---|---|---|
| `FEA-CR-001` | One authoritative model can distinguish stable identity, Business Revision, Version and immutable Generation. | `Must` | Model review and invariant scenarios | Principal Product Author; architecture reviewer assignment `BLOCKED` |
| `FEA-CR-002` | Stale, unauthorized or wrong-workspace publish fails closed without losing local work. | `Must` | Negative-path specification and later executable tests | Principal Product Author |
| `FEA-CR-003` | One exact released document/structure baseline can be reproduced with digest evidence. | `Must` | Release/restore specification and later controlled drill | Principal Product Author; Operations/Quality reviewer `UNKNOWN` |
| `FEA-CR-004` | Access, workflow, metadata, numbering and format variation are versioned configuration rather than hard-coded company roles. | `Must` | Architecture responsibility and policy-version review | Principal Product Author |
| `FEA-CR-005` | Generic file control works independently of deep knowledge for any one format. | `Must` | Capability-profile contract and conformance plan | Principal Product Author |
| `FEA-CR-006` | User interactions can be understood in English, Vietnamese and Japanese and are accessible within an approved profile. | `Should` | DOC-08 review and localized test matrix | HCD/localization reviewer assignment `BLOCKED` |
| `FEA-CR-007` | Production operation has acceptable capacity, latency, availability, recovery and maintainability. | `Must before rollout` | Representative pilot and operational evidence | Operations authority assignment `UNKNOWN` |
| `FEA-CR-008` | Total delivery and support effort is acceptable compared with available alternatives. | `Should before implementation commitment` | Cost/schedule estimate and option comparison | Product Decision Authority; inputs `UNKNOWN` |

## 4. Evidence, risks and unknowns

| Evidence / risk / unknown | Class or status | Limitation / impact | Treatment or resolution path | Owner |
|---|---|---|---|---|
| Accepted product architecture and domain lessons | `IDEA DECISION` / design input | Defines semantics and boundaries; it is not an implemented result. | Translate through DOC-03/04/05/06/08 and verify later. | Principal Product Author |
| Interactive HTML prototype | `PROTOTYPE EVIDENCE` | Demonstrates navigation, terminology and selected interaction states only; no backend, transaction, security or production proof. | Retain as UI discussion evidence; replace claims with DOC-08/VVP results. | Principal Product Author |
| Fixed public reference inventory | `REFERENCE EVIDENCE` | Public behavior does not establish installed edition, internal need, complete semantics or implementation. | Maintain one closed inventory and row-by-row dispositions. | Principal Product Author |
| Internal workflow and value baseline | `BLOCKED` | Prevents representative need, adoption, efficiency and process-improvement claims. | Nominate pilot, actors and current-process evidence. Trigger before such claims. | Product Decision Authority |
| Delivery capacity, cost and schedule | `UNKNOWN` | Prevents credible implementation commitment and option economics. | Estimate after Spec/Tech scope and team constraints are available. Trigger before PG4. | Product Decision Authority |
| Security, privacy and deployment constraints | `PARTIALLY CLARIFIED` | Native accounts first and installation-approval departments are known; exact policy, network, hosting, license and support choices remain open. | Evaluate the revised Tech proposal with IT and an eligible security reviewer. | Project user coordinates; Product Decision Authority decides Tech |
| Independent requirements, architecture, HCD and operational review | `BLOCKED` | Self-review cannot provide specialist or independent assurance. | Assign eligible reviewers or keep affected gates `BLOCKED/NOT-RUN`. | Product Decision Authority |

## 5. Bounded prototype and capability profile

### 5.1 Throwaway prototype boundary

| Prototype field | Recorded value |
|---|---|
| Explicit question | Can a dense engineering-document workspace make identity, Checkout/Check-in, lifecycle, structure, conflict and audit information understandable with limited page scrolling? |
| Environment and data class | Local standalone HTML with synthetic internal-demo data; no production services or real engineering records. |
| Expiry / disposal condition | Retain only as analysis/design evidence while its source baseline is relevant; replace or retire through controlled change when DOC-08 or implementation supersedes it. |
| Evidence produced and limitation | Visual and interactive design evidence. It does not prove persistence, concurrent behavior, authorization, file processing, accessibility conformance, performance or operational readiness. |
| Production-baseline status | `NOT APPLICABLE` |

### 5.2 Format capability profile

| Profile | Enabled format/scope | Identity/version/digest controls | Semantic capability evidence | Status |
|---|---|---|---|---|
| Generic Controlled-File Baseline | Configurable allowlist for ordinary controlled files; exact first allowlist is pending Spec/Tech. | Stable Logical Document, immutable Generation, Artifact digest, metadata, audit, access, transfer and recovery regardless of format. | No deep extraction is claimed; each format must pass the generic conformance suite before enablement. | `PROPOSED DIRECTION`; exact formats/evidence `BLOCKED` until DOC-06/VVP |
| First deep CAD profile | IRONCAD in the first profile; exact file families, application versions and extraction depth are not yet pinned. | Same generic controls plus versioned Capability Profile and parser/tool provenance. | Must demonstrate selected structure/dependency semantics without running IDEA code inside the design tool. | `PROPOSED DIRECTION`; environment and acceptance threshold `BLOCKED` until DOC-06/VVP |

Supporting Office and PDF behavior may be part of the initial configured environment, but storing or
previewing a file does not prove semantic understanding. Later design tools must enter through the
same capability-profile contract rather than a new identity model.

## 6. Recommendation and gate disposition

| Field | Recorded value |
|---|---|
| Recommendation | Continue the independent-build direction through detailed Spec and Tech preparation for the bounded Core v0 Release Spine. Keep buy/configure and adapt/integrate visible until target and internal evidence support an honest comparison. |
| Rationale and evidence | The current domain model, architecture direction, coverage inventory and prototype are sufficient to design measurable obligations. They are not sufficient for a production feasibility, cost, schedule or rollout conclusion. |
| Required follow-up | Obtain Feature decision; review the authored DOC-04/06/08 requirements and VVP; collect internal/deployment constraints; review the DOC-05/TECH candidate comparison; estimate capacity/cost/schedule before PG4; assign required reviewers or retain blocks. |
| Gate outcome | `NOT-RUN` — no attributable PG1 review or Product Decision Authority decision is recorded |
| Indexed trace to DOC-07 increment | `IE-INC-FEATURE-001` for PG1; `IE-INC-TECH-001` for the later technology selection |

## Typed trace, supporting records and rendition controls

| Link type | Required target and purpose | Result |
|---|---|---|
| `SOURCE-NEED` / `SOURCE-DECISION` | DOC-01, DOC-03, accepted architecture/design lessons and internal evidence | Sources linked; representative internal evidence `BLOCKED` |
| `DOWNSTREAM` | DOC-04/05/06/08 consequences, DOC-07 increments, FEATURE-001 and TECH-001 | Core and brief Drafts authored; decisions and review evidence remain `NOT-RUN` |
| `CHANGE` | CHG, affected option/profile and successor baseline | `IE-CHG-TECH-001`; confirmed context is distinct from proposed stack and unqualified recovery feasibility |
| `VERIFICATION` | Prototype limitation plus future VVP/VEV evidence | Prototype bounded; production verification `NOT-RUN` |
| `RELEASE` | REL manifest only when an approved option is implemented and released | `NOT APPLICABLE` |
| `RENDITION` | Source-pinned DOCX/PDF identity and status | No rendition generated |

<!-- AUTHOR CONTENT END -->

## Contract references

- [DOC-02 class template](../../definition/DOC-02-feasibility-and-options-assessment.md)
- [Core document catalogue](../../definition/README.md)
- [Evidence and trace](../../../../specs/003-controlled-documentation/contracts/evidence-and-trace.md)
- [Gate package](../../../../specs/003-controlled-documentation/contracts/gate-package.md)
- [Control fields and status](../../../../specs/003-controlled-documentation/contracts/control-fields-and-status.md)
