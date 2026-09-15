# IDEA Technology Stack Documentation Standard

| Field | Value |
|---|---|
| Stable Document ID | `IE-STD-TECH-STACK-001` |
| Document Class | `AGENT-GUIDE` / technology-stack documentation standard |
| Title | IDEA Technology Stack Documentation Standard |
| Version | `0.1` |
| Status | `Draft` |
| Artifact Role | Reusable repository-local standard for technology-selection records, management briefs and technology architecture views; not a Core Product Document |
| Product Normativity | `INFORMATIVE` — this standard creates no product Feature or Requirement and selects no technology |
| Repository Process Authority | `NORMATIVE` — contributors preparing an in-scope technology decision set follow this standard while its instruction state is effective |
| Repository Instruction State | `Effective` |
| Owner | Product Decision Authority; named owner `BLOCKED` until assigned |
| Author | Principal Product Author / repository maintainers; named attribution `BLOCKED` |
| Reviewer | Product Decision Authority; review `NOT-RUN` |
| Acceptance Authority | Product Decision Authority; acceptance `NOT-RUN` |
| Applicable Baseline | Current IDEA Engineering repository baseline |
| Effective Date | Repository instruction effective 2026-09-15; product effective date `NOT-APPLICABLE` until accepted |
| Classification | `INTERNAL` |
| Source / Upstream Trace | [`IE-STD-AUTH-001@0.2`](product-document-authoring-standard.md); [standards register](../governance/standards-register.md); [`IE-RES-TECHDOC-STD-20260915-001`](../research/2026-09-15-technology-stack-documentation-standard-basis.md) |
| Downstream Trace | Technology decision matrices, `TECH-*` management briefs, technology architecture view sets, qualification plans/evidence, change records and release baselines; first application: `IE-KNW-TECH-DEC-001@0.6` and `TECH-001@0.14` |
| Change Record | Initial controlled standard; [`IE-CHG-TECH-BASELINE-001`](../product/instances/idea-engineering/registers/CHG-2026-09-15-core-v0-technology-stack-baseline.md) records its first application |
| Supersedes / Superseded by | `NOT-APPLICABLE` / `NOT-APPLICABLE` |
| Review Trigger | A baselined source edition changes; the technology-decision vocabulary or authority model changes; a new deployment/client class creates a material concern; or an audit finds evidence, decision and approval conflated |
| Retention Disposition | Retain while referenced by a controlled technology decision; supersede through an explicit version and change record |
| Evidence Status | `STANDARD-GUIDED`; no ISO/IEC/IEEE or arc42 conformity or certification claim |

This standard refines the common authoring controls in `IE-STD-AUTH-001`. Its repository instruction
state does not mean that the Product Decision Authority has accepted this document or any technology
described with it. Product approval remains a separate recorded act.

## 1. Document Control

Every controlled technology document exposes, at minimum, a stable ID, class, title, version,
status, normativity, owner, author, reviewer, acceptance authority, applicable baseline, date,
classification, sources, downstream consumers, change record, supersession, review trigger,
retention rule and evidence status. A document version is not a Git commit; the commit is evidence
of the exact repository state.

Use `UNKNOWN`, `BLOCKED`, `NOT-RUN` and `NOT-APPLICABLE` rather than inventing values. `Draft`,
`Proposed`, `Approved`, `Superseded` and `Retired` describe document state. They do not describe a
test result.

## 2. Purpose

A technology decision set explains what the system needs from technology, what candidates were
considered, what Engineering selected, what remains to be qualified, who can approve the selection
and what evidence can reopen it. It must let a later maintainer reproduce the reasoning without
mistaking a recommendation for a Product Decision Authority approval.

## 3. Decision Scope

State the included product increment, client/server surfaces, data classes, deployment environments
and operations horizon. State exclusions explicitly. Separate these decision axes when they can
change independently:

- product capability and externally observable behavior;
- software architecture and authority boundaries;
- technology family and version policy;
- exact build/package configuration;
- operational qualification and production approval.

A technology record must not silently change Feature, Requirement, architecture semantics or gate
state. Any real conflict is routed to the owning document and change authority.

## 4. System / Entity of Interest

Identify the entity whose stack is being selected: product, subsystem, deployable unit, client,
worker, data platform or build/release system. Name its boundary and the authoritative architecture
source. A framework is never the entity of interest and does not become the owner of IDEA domain
state merely because it supplies a library mechanism.

## 5. Stakeholders

Record the stakeholders whose concerns materially shape the choice. The minimum review considers:

| Stakeholder | Typical concern |
|---|---|
| Product Decision Authority | Scope fit, decision risk, cost and approval boundary |
| Engineering owner | Correctness, implementation seams, maintainability and delivery |
| Product/architecture owner | Preservation of behavior, module authority and interfaces |
| Security reviewer | Identity, authorization, trust boundaries, supply chain and secrets |
| Operations/IT | Supported platform, deployment, monitoring, backup, recovery and patching |
| User/UX/accessibility reviewer | Interaction capability, locale, assistive behavior and client fit |
| Data/integration owner | Transaction integrity, migration, interoperability and retention |
| Release/support owner | Reproducible build, rollback, diagnosis and lifecycle burden |

If a required stakeholder is unavailable, record the resulting review as `BLOCKED` or `NOT-RUN`.

## 6. Concerns

List the questions the decision must answer before comparing products. At minimum consider product
fit, authoritative ownership, transaction/recovery behavior, security, client/platform fit,
interoperability, operability, maintainability, lifecycle/support, licensing, skills, deployment,
data growth, large-file behavior, accessibility and exit/migration cost. Link each material concern
to its stakeholder and evidence or qualification plan.

## 7. Constraints

Separate approved constraints from preferences and assumptions. For each constraint record its
source, authority, affected boundary and review trigger. Existing machines, competitor choices,
developer familiarity and vendor popularity are context; none becomes a hard constraint without an
authorized source.

## 8. Quality Goals

Use relevant concepts from the ISO/IEC 25010:2023 product-quality model as a coverage aid, without
claiming conformity. Do not score every technology against every characteristic and do not create
weights merely to make a table produce a winner.

| Quality concern | Technology-selection question | Examples of suitable evidence |
|---|---|---|
| Functional suitability | Can the candidate realize the approved obligations without changing their meaning? | Contract/vertical-slice result, gap analysis, supported capability |
| Performance efficiency | Does it meet an approved workload and resource target? | Representative benchmark with configuration and raw measurements |
| Compatibility | Can required components and environments coexist and exchange data correctly? | Official support matrix, contract test, versioned interoperability run |
| Interaction capability | Can users complete required Web/Desktop tasks, locale and accessibility flows? | Usability/accessibility/IME evidence on the exact surface |
| Reliability | Can the system refuse safely, recover and preserve authoritative/local state? | Failure injection, retry/idempotency, restore and crash-recovery evidence |
| Security | Are identity, authorization, trust, secrets and supply-chain boundaries controlled? | Threat review, negative tests, SBOM, provenance and patch evidence |
| Maintainability | Can named owners build, diagnose, change and patch the stack? | Dependency inventory, architecture tests, onboarding and incident exercise |
| Flexibility | Can an anticipated, approved variation occur behind a stable seam? | Interface/evolution view, migration rehearsal, replaceable Adapter proof |
| Safety | Can a technology failure create unacceptable harm or loss, and is the response bounded? | Hazard/risk treatment and verified fail-safe behavior where applicable |

An official product claim establishes availability or support only within its stated scope. It is
not an IDEA quality result. An IDEA test result is limited to its exact build, fixture and environment.

## 9. Architecture Context

Show users, external systems, clients, server boundaries, stores, workers and trust zones relevant
to the choice. Reference the authoritative architecture rather than duplicating its domain model.
Record which architecture invariants every candidate must preserve.

## 10. Candidate Technologies

Define credible candidates at comparable boundaries. Avoid comparing one complete ecosystem with a
single library from another. Record version/date context, delivery/support model and any missing
information. A candidate may be viable even when it is not selected.

## 11. Evaluation Method

State the method before the conclusion. Use mandatory gates for correctness, security, custody and
recovery; a candidate that lacks required evidence remains unqualified rather than receiving a
convenience score. Compare surviving candidates using traceable qualitative findings and approved
measurements. Distinguish:

```text
published source fact
→ evidence-bounded IDEA interpretation
→ Engineering disposition
→ Product Decision Authority decision
```

When a bounded experiment answers a narrower question than the engineering selection, state both
questions and both outcomes. Never rewrite a historical experiment to justify a later decision.

## 12. Decision Matrix

The matrix records one row per independent decision axis or a clearly comparable set. Each row must
show the candidates, disposition, relevant concerns, evidence, trade-off, qualification state and
reopen trigger. A blank cell means `UNKNOWN`, not “no concern”.

Numeric scoring is optional and requires approved measures, weights, evidence and sensitivity
analysis. In their absence, use explicit mandatory gates and evidence-bounded qualitative findings.

## 13. Selected Technology Stack

Every selected technology uses the following record schema, either in one table or through stable
links across the decision set:

| Required field | Rule |
|---|---|
| Technology | Use the canonical product/family name. |
| Role | State what it contributes; avoid generic labels such as “platform”. |
| Layer / boundary | Identify the deployable, Module, client, data, build or operations boundary. |
| Disposition | Use the controlled vocabulary in section 24. |
| Version / version policy | Separate family/major line, exact build pin and update policy. |
| Owner | Name the accountable engineering/operations role or record the gap. |
| Alternatives considered | Link credible alternatives and their dispositions. |
| Relevant quality concerns | Link the concerns that materially affected this choice. |
| Rationale | Explain why it fits this system and this increment; do not claim universal superiority. |
| Dependencies | List direct authorities and required runtime/build relationships, not every transitive package. |
| Operational implications | State deployment, monitoring, backup, support and incident obligations. |
| Security implications | State trust, identity, authorization, secrets and supply-chain impact. |
| Evidence | Link official facts, research and executed records with their evidence class. |
| Qualification state | Record `PASS`, `FAIL`, `PARTIAL`, `BLOCKED` or `NOT-RUN` only for a named objective. |
| Known risks | Record residual uncertainty and owner/action. |
| Upgrade / lifecycle policy | State patch/minor/major handling, support watch and migration/rollback expectation. |
| Reopen trigger | State an observable condition that causes reconsideration. |

The selected stack section also states which dependencies are Core, Conditional or Deferred. It
must not add a Conditional library to the production dependency graph before its trigger and change
decision occur.

## 14. Architecture Views

Create multiple focused views instead of one exhaustive diagram. Every view records:

| Metadata | Required content |
|---|---|
| View ID and title | Stable identity and a question-oriented title |
| Purpose | The single question the view answers |
| Stakeholders and concerns | Intended readers and their decision concerns |
| Viewpoint / notation | C4, UML, data-flow, dependency, pipeline or another named model kind |
| Source | Authoritative document/decision/evidence inputs |
| Current status | Draft/Proposed/Approved independently of render success |
| Authority | What document owns the represented decision |
| Qualification boundary | What the picture does not prove |

Use a consistent direction, legend and abstraction level. Label protocols and trust/process
boundaries. Selected versus alternative status must remain understandable in monochrome and text
alternatives. Avoid crossing lines, tiny labels and giant canvases. Source plus rendered SVG/PNG is
retained when the approved local renderer is available; otherwise retain source and record rendering
`BLOCKED`. A successful render is not architecture approval.

## 15. Runtime / Protocol Model

Identify every process/runtime and the protocol crossing each boundary. For each protocol state the
direction, authentication, versioning, message/data type, size/streaming expectation, timeout,
idempotency/retry and failure ownership. Distinguish an in-process call from HTTP, IPC, database and
storage access.

## 16. Deployment Model

Map deployables to physical/logical nodes, operating systems, trust zones and failure domains.
Separate an initial single-node topology from high availability. Do not imply that a VM, backup,
container or process supervisor provides HA. Record capacity and availability as `UNKNOWN` until
approved objectives and evidence exist.

## 17. Security / Trust Boundaries

Show where identity is established, where authorization is decided, where the resource owner applies
business gates and where credentials/bytes may cross. Record least-privilege, origin/IPC controls,
secret/key custody, administrative boundaries, dependency provenance and revocation/revalidation.
Framework security primitives do not replace IDEA Access Policy or owner business authority.

## 18. Data / Persistence

State authoritative data ownership, database/store roles, transaction boundaries, migration
authority, concurrency, immutable/mutable data, large-byte placement, reconciliation and restore
coupling. A database transaction must not be described as atomically committing external byte
storage unless the implementation truly supplies that guarantee.

## 19. Integration

Identify each real external contract, its owner, Adapter, protocol, version, authentication,
delivery semantics, idempotency and recovery. Do not adopt a broker, integration framework or public
event format only for hypothetical optionality. Record such items as `CONDITIONAL` or `DEFER` until
a named contract or measured trigger exists.

## 20. Build / Packaging

Record source/toolchain versions, dependency authority, lock/BOM policy, reproducible commands,
generated artifacts, checksums/signing, SBOM/provenance, configuration/secrets separation and
package ownership. A proposed CI or signing stage is labelled `SELECTED DESIGN / IMPLEMENTATION
NOT-RUN` until executable evidence exists.

## 21. Operations / Observability

Define service supervision, health/readiness, structured logs, metrics, traces, correlation,
diagnostic capture, retention/redaction, alert/runbook ownership and support clock. Audit Evidence is
an authoritative product record and is not replaced by an operational log.

## 22. Backup / Recovery

List every mutually dependent recovery component: database, Artifact bytes, configuration, active
policy, keys and required release material. State target failure domain, recovery-point selection,
PITR/restore method, integrity checks, session handling, restricted-recovery behavior and measured
RTO/RPO state. A plan or tool capability is not a restore `PASS`.

## 23. Alternatives

For each credible alternative state the benefit, cost, missing evidence and exact reconsideration
condition. “Not selected” does not mean defective or permanently banned. Preserve alternatives that
remain viable so the next review does not repeat research without a trigger.

## 24. Deferred / Conditional / Rejected Technologies

Use the repository disposition vocabulary consistently:

| Disposition | Meaning |
|---|---|
| `SELECT` | Engineering selects the technology for the stated boundary, subject to recorded qualification. |
| `SELECT — CORE V0 ENGINEERING BASELINE` | The selected Core v0 implementation direction. It is not Product Decision Authority approval and not a qualification `PASS`. |
| `ALTERNATIVE` | Credible replacement; not selected for the current baseline. |
| `EVALUATED ALTERNATIVE — NOT SELECTED FOR CORE V0` | A materially evaluated candidate retained for explicit reopen triggers. It did not necessarily fail. |
| `CONDITIONAL` | Not in the default dependency/topology; adopt only after its named trigger and a recorded decision. |
| `DEFER` | Preserve for later; current evidence or scope does not justify adoption. |
| `REJECT FOR CORE V0` | Outside the current increment for a recorded reason; not a universal or permanent prohibition. |
| `QUALIFICATION REQUIRED` | The selected/evaluated configuration still needs named objective evidence. This is not a disposition by itself. |

Use `DEFER`, not `DEFERRED`, as the canonical decision disposition. Historical records keep their
original wording. A future document may explain that a planned test branch is “deferred”, but that
does not create a new technology disposition.

## 25. Qualification Evidence

Each qualification item states objective, exact candidate/configuration, preconditions, fixture,
method, expected result, retained evidence, actual result, disposition, operator and reviewer.
`PASS`, `FAIL`, `PARTIAL`, `BLOCKED` and `NOT-RUN` are scoped results. Do not infer a whole-stack pass
from component documentation or a render/build success.

Historical evidence is immutable. A later selection may consume a `PARTIAL / NO WINNER` experiment,
but it must explain the broader selection basis and may not rename that experiment as a win.

## 26. Risks / Technical Debt

Record the risk statement, affected concern, likelihood/impact basis if authorized, owner,
treatment, residual state, evidence and review date/trigger. Distinguish accepted heterogeneous
toolchain or bridge cost from an implementation defect. Avoid “technical debt” as a label for a
deliberate and currently supported trade-off unless a repayment obligation truly exists.

## 27. Decision Rationale

Write rationale in four parts: decision context, evidence that supports it, trade-offs accepted and
evidence still missing. Explain why the choice fits the current scope rather than why the technology
is “best”. Record opportunity cost when further comparison would delay implementation without a
reasonable evidence-backed expectation of changing the decision.

## 28. Reopen Triggers

A trigger is a named observable condition, not a calendar reminder or vague preference. Give each
material trigger a stable ID, condition, affected decision, required evidence and decision owner.
Do not invent a numeric threshold without authority; use “approved mandatory requirement” or
“management-accepted threshold” until one exists.

## 29. Traceability

Maintain bidirectional links among needs/Requirements, architecture decisions and views, technology
matrix, management brief, evidence, risks, qualification items, change record, roadmap and release
baseline. Record version identities, not merely filenames. Research and competitor observations
remain informative and cannot independently create a Requirement or selection.

## 30. Decision / Approval State

Every technology decision set displays these states separately:

```text
Engineering analysis/recommendation
Engineering baseline selection
Qualification result by objective
Product Decision Authority review/approval
Product gate result
Implementation/release state
```

One state never implies another. In particular, `SELECT — CORE V0 ENGINEERING BASELINE` does not
mean `Approved`, and `PARTIAL` evidence does not mean `PASS` or `FAIL`.

## 31. Version History

Every successor records version/date/status, predecessor identity and digest where available,
material changes, unchanged authorities/semantics and the governing change record. Retain historical
evidence and decisions; correct a bad link or stale current-state summary without rewriting the
historical result.

Before committing a technology decision set, confirm:

- all selected technologies have a role, owner, version policy, evidence, risk and reopen trigger;
- all alternatives have a disposition and no viable candidate is described as failed without evidence;
- architecture diagrams match the decision matrix and have text alternatives;
- qualification states match retained evidence;
- Engineering selection, Product Decision Authority approval and PG state are visibly separate;
- no Product Requirement, architecture invariant or gate result changed accidentally;
- applicable link, diagram and document checks were run or recorded truthfully as `BLOCKED`/`NOT-RUN`.

## Standards basis and tailoring

This standard is **informed by** the public scope and selected concepts of
ISO/IEC/IEEE 42010:2022, ISO/IEC 25010:2023, ISO/IEC/IEEE 15289:2019 and
ISO/IEC/IEEE 12207:2026 as registered in `IE-GOV-STD-001`. It uses arc42 as an open, pragmatic
presentation/checklist reference. The local structure is a project convention tailored to IDEA.
No clause-level assessment, formal conformity review or certification has been performed, and no
protected normative text is reproduced here.

| Version | Date | Status | Change |
|---|---|---|---|
| `0.1` | 2026-09-15 | Draft / repository instruction `Effective` | Initial reusable technology-stack documentation standard and first application to the IDEA Engineering Core v0 baseline |
