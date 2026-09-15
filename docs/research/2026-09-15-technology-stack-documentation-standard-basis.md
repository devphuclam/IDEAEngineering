# Official Basis for an IDEA Technology Stack Documentation Standard

| Control field | Value |
|---|---|
| Stable Research ID | `IE-RES-TECHDOC-STD-20260915-001` |
| Document class | `RESEARCH-NOTE` |
| Title | Official Basis for an IDEA Technology Stack Documentation Standard |
| Version | `0.1` |
| Status | `Draft` |
| Artifact role | `INFORMATIVE RESEARCH INPUT` for a future reusable IDEA documentation standard |
| Product normativity | `INFORMATIVE` — this note creates no product requirement and selects no technology |
| Repository process authority | `NOT-APPLICABLE` |
| Repository instruction state | `NOT-APPLICABLE` |
| Owner | Product Decision Authority; named owner `UNKNOWN` |
| Author | Repository maintainers; named attribution `UNKNOWN` |
| Reviewer | Product Decision Authority; review `NOT-RUN` |
| Acceptance authority | Product Decision Authority; acceptance `NOT-RUN` |
| Evidence date / access date | `2026-09-15` (Asia/Bangkok) |
| Applicable baseline | IDEA Engineering source commit `3a5b83f5ff64dc4b8335826d04732b029425b0ed` |
| Classification | `INTERNAL` |
| Source / upstream trace | `IE-GOV-STD-001`, `IE-STD-AUTH-001`, and sources `SRC-01`–`SRC-06` in Section 3 |
| Downstream trace | [`IE-STD-TECH-STACK-001@0.1`](../agents/technology-stack-documentation-standard.md); Product Decision Authority approval remains `NOT-RUN` |
| Change record | Initial research note; no predecessor |
| Supersedes / Superseded by | `NOT-APPLICABLE` / `NOT-APPLICABLE` |
| Review trigger | A cited publication is revised, withdrawn or superseded; arc42 template convention changes materially; or the future local standard changes scope |
| Retention disposition | Retain with the technology-documentation design record; supersede explicitly |
| Evidence status | `PRIMARY-SOURCE-CHECKED`; clause-level assessment `BLOCKED`; conformity `NOT-CLAIMED` |

## 1. Purpose and research boundary

This note verifies the official basis that may inform a reusable IDEA Technology Stack
Documentation Standard. It answers four bounded questions:

1. Which requested editions are actually published on the evidence date?
2. What does each official public source directly establish at catalogue or documentation level?
3. Which concepts can IDEA safely adapt as a local documentation convention?
4. Which claims remain unavailable without lawful access to the complete normative publications?

The evidence chain is:

`Official source → directly supported fact → bounded IDEA interpretation → future local standard`

The future local standard would be a `PROJECT-CONVENTION`. None of the cited publications chooses
a programming language, framework, database, deployment platform or technology winner for IDEA.
This note does not create that standard and does not change Feature, Spec, Tech, architecture or
gate authority.

## 2. Method and evidence classes

Only first-party public pages from ISO and arc42 were used for external facts. The check used the
page state visible on `2026-09-15`; it did not use a purchased ISO/IEC/IEEE publication, a copied
standard, or a secondary summary.

| Evidence class | Meaning in this note |
|---|---|
| `DIRECT-SOURCE-FACT` | Public metadata or scope information stated by the organization that owns the publication or template |
| `BOUNDED-INTERPRETATION` | A conservative IDEA use derived from one or more direct facts; not a clause requirement |
| `PROJECT-CONVENTION-CANDIDATE` | A proposed local organization rule that still requires project approval |
| `UNKNOWN` | The public source does not establish the fact |
| `BLOCKED` | The check requires lawful normative-text access or another unavailable prerequisite |
| `NOT-RUN` | A planned assessment or approval has not been performed |

No protected normative text is reproduced. Public page content is paraphrased and used only to
identify edition, status, scope and safe navigation concepts.

## 3. Official source and edition register

| Source ID | Owning authority and official source | Edition/status verified on 2026-09-15 | Directly supported fact | Limitation |
|---|---|---|---|---|
| `SRC-01` | ISO, [ISO/IEC/IEEE 42010:2022](https://www.iso.org/standard/74393.html) | Edition 2; published `2022-11`; stage `60.60` | The publication addresses the structure and expression of an architecture description, distinguishes an entity's architecture from its description, and recognizes architecture viewpoints and model kinds. It does not prescribe an architecting process, notation, tool, recording format or medium. | The public abstract is not the normative publication and is insufficient for a conformity checklist. |
| `SRC-02` | ISO, [ISO/IEC 25010:2023](https://www.iso.org/standard/78176.html) | Edition 2; published `2023-11`; stage `60.60`; the 2011 edition is shown as withdrawn | The publication defines a product-quality model with nine characteristics and subordinate characteristics for specifying, measuring and evaluating ICT and software-product quality. The public scope identifies requirements, design, testing, quality control and acceptance as possible uses. | The catalogue page does not provide the complete characteristic definitions, measures or a project evaluation method. |
| `SRC-03` | ISO, [ISO/IEC/IEEE 15289:2019](https://www.iso.org/standard/74909.html) | Edition 4; published `2019-07`; confirmed in 2025; now at stage `90.92` and marked to be revised; a replacement committee draft is under development | The publication addresses the purpose and content of life-cycle information items through generic information-item types. Its public scope permits information items to be combined or subdivided for organizational or project needs. | Its public mapping names ISO/IEC/IEEE 12207:2017 and ISO/IEC/IEEE 15288:2015. It does not establish an exact mapping to the newer 12207:2026 or 15288:2023 editions. |
| `SRC-04` | ISO, [ISO/IEC/IEEE 12207:2026](https://www.iso.org/standard/90219.html) | **Edition 2; published `2026-04`; stage `60.60`**; ISO shows the 2017 edition as withdrawn | The requested 2026 edition exists and is a published International Standard. Its public scope covers a common software life-cycle process framework across conception, development, operation, support and retirement, and allows concurrent, iterative, recursive and incremental application. It does not prescribe one life-cycle model or development method. The page points to 15289 for information-item content. | The public abstract does not expose the full process outcomes, activities, tasks or tailoring obligations. |
| `SRC-05` | arc42, [official documentation reference](https://docs.arc42.org/) and [template overview](https://arc42.org/overview/) | Live official documentation accessed `2026-09-15`; twelve-section convention | arc42 organizes architecture documentation into twelve tailorable sections covering goals, constraints, context, strategy, building blocks, runtime, deployment, cross-cutting concepts, decisions, quality, risks and glossary. | arc42 is an open documentation template/convention, not an ISO/IEC/IEEE standard and not evidence of standards conformity. |
| `SRC-06` | arc42, [official download page](https://arc42.org/download/) | The English download is labelled version `9.0` (`2025-07`); the same page notes locale-specific history, including German `9.1` (`2025-12`) | Official templates are offered in multiple languages and formats, including Markdown and Word. The site presents arc42 as free and open source. | The page does not establish one locale-independent version shared by every translation. A project importing a template must pin language, version and preferably the retrieved package digest. |

### 3.1 Edition findings

- `ISO/IEC/IEEE 42010:2022`: **verified published**, Edition 2.
- `ISO/IEC 25010:2023`: **verified published**, Edition 2; it replaces the withdrawn 2011 edition.
- `ISO/IEC/IEEE 15289:2019`: **verified as the current published edition**, Edition 4, but it is
  now under revision at stage `90.92`; a replacement committee draft is in development.
- `ISO/IEC/IEEE 12207:2026`: **verified published**, Edition 2, publication date `2026-04`; the
  earlier 2017 edition is withdrawn. There is no edition mismatch in citing `12207:2026`.
- arc42: the official English download is version `9.0` from July 2025. Version identity is
  locale-sensitive; the live documentation should not be called “arc42 9.1” without naming the
  particular language/package.

## 4. Concepts IDEA can safely adapt

The following are `BOUNDED-INTERPRETATION`, not assertions that a source mandates the proposed
local form.

### 4.1 Controlled-document envelope

From the public scope of `SRC-03`, IDEA can safely use a controlled information-item discipline for
technology documentation: stable identity, stated purpose, audience, version, status, ownership,
sources, decision state, traceability, change history, review trigger and supersession. The exact
field set comes from IDEA's existing `IE-STD-AUTH-001`; the ISO catalogue page does not itself prove
that every local field is mandatory.

The future standard can permit one information item to be divided into maintainable records, or
several related items to be combined, when identity, authority, traceability and status remain
clear. This is preferable to creating duplicate documents merely to mimic a publication outline.

### 4.2 Architecture-description discipline

From `SRC-01`, IDEA can distinguish:

- the system or technology decision being described from the document that describes it;
- the relevant entity and boundary from its environment;
- a viewpoint from the resulting view and its models;
- architectural description from requirements, implementation code and operational evidence;
- selected notation and tooling from the architectural meaning being communicated.

A technology-stack document can therefore identify its intended stakeholders and concerns, select
only the views needed to answer those concerns, state each view's purpose and notation, and keep
rationale and trade-offs near the relevant decision. Stakeholder/concern fields and exact trace
rules are local tailoring informed by the current IDEA architecture-authoring rule; their
clause-level relationship to 42010 is `BLOCKED` without the normative text.

### 4.3 Quality-driven technology evaluation

From `SRC-02`, IDEA can use a product-quality model as a coverage aid so that a stack comparison is
not reduced to feature count or personal preference. A future local standard can require authors to
name the quality concerns that materially drive a technology decision, connect them to approved
requirements or scenarios, define how they will be evaluated, and distinguish published evidence
from IDEA measurements.

Citation of ISO/IEC 25010 does not demonstrate that any quality characteristic is satisfied. A
claim such as acceptable performance, security, reliability or maintainability still needs an
approved measure and objective evidence. Where no evaluation has occurred, the result is
`NOT-RUN`, not `PASS`.

### 4.4 Life-cycle and change discipline

From `SRC-04`, IDEA can treat a technology stack as a life-cycle commitment rather than a one-time
selection. A reusable document can track acquisition or adoption, development, operation, support,
maintenance and retirement concerns; it can also record version watch, upgrade triggers,
deprecation, migration and replacement.

The life-cycle source does not choose a delivery method. IDEA may retain its own gates, iterative
workflow and review process as `PROJECT-CONVENTION`; those choices are not “required by 12207.”

### 4.5 Readable navigation convention

From `SRC-05` and `SRC-06`, IDEA can use arc42 as a **navigation and presentation convention** for
architecture-related parts of a technology-stack document. Particularly useful drawers are:

- purpose, goals and stakeholders;
- constraints and decision boundary;
- system context and external interfaces;
- solution strategy;
- building-block, runtime and deployment views;
- cross-cutting technology concepts;
- architectural decisions and rejected alternatives;
- quality requirements and evaluation scenarios;
- risks, technical debt and glossary.

The future local standard should tailor this structure rather than require empty sections. It may
reference separate controlled ADRs, requirements, evidence and diagrams instead of copying them.
arc42 provides the filing convention; it does not replace 42010 concepts, 25010 quality evidence,
12207 life-cycle governance or 15289 information-item control.

## 5. Candidate structure for the future local standard

This section is a `PROJECT-CONVENTION-CANDIDATE`, not an approved standard. A future drafting task
may use the following reusable content model:

| Candidate section | Purpose and evidence basis |
|---|---|
| Control envelope | Stable identity, version, status, authority, applicability, change and supersession; local tailoring informed by `SRC-03` |
| Purpose, audience and decision boundary | State what decision or baseline the document supports and what it does not decide |
| System and technology scope | Identify the entity, environment, external interfaces and technology layers; architecture-description discipline informed by `SRC-01` |
| Approved drivers | Trace business constraints, requirements, quality scenarios and operational limits; quality coverage informed by `SRC-02` |
| Stack inventory | Record component role, exact version or version policy, distribution, support source, licence evidence, owner and status without implying approval |
| Architecture views | Provide only concern-driven context, building-block, runtime, deployment and cross-cutting views; use explicit viewpoint/purpose/notation metadata |
| Decision analysis | Separate facts, IDEA interpretation, options, criteria, trade-offs, risks, recommendation and authorized decision |
| Qualification and evidence | Record configuration, method, expected result, retained evidence and `PASS`/`FAIL`/`BLOCKED`/`NOT-RUN` disposition |
| Life-cycle plan | Record update, support, vulnerability response, compatibility, migration, retirement and review triggers; informed by `SRC-04` |
| Traceability and source register | Connect requirements, architecture, ADRs, risks, verification and official sources |
| Glossary | Define each technology and architecture term once and use it consistently; arc42 navigation informed by `SRC-05` |

This content model should reference existing controlled records rather than turn one technology
document into a duplicate requirements specification, architecture description, test report and
release record.

## 6. Limitations, mismatches and blockers

### 6.1 ISO/IEC/IEEE 15289 edition coupling

There is a real temporal mismatch to manage, but it is not evidence that 15289:2019 is invalid.
ISO still lists Edition 4 as the published edition; it also marks it for revision and shows a
replacement committee draft. Its public scope is explicitly based on the 2017 software-life-cycle
and 2015 system-life-cycle editions, whereas the IDEA register now selects 12207:2026 and
15288:2023.

**Bounded disposition:** continue using 15289:2019 as `STANDARD-GUIDED` information-item guidance,
retain explicit local mappings to current life-cycle editions, and review the mapping when the
replacement is published. Do not claim that the old process-to-information-item map exactly covers
12207:2026.

### 6.2 Clause-level access

The official public pages establish identifiers, editions, status and high-level scope. They do
not provide enough evidence to create a clause-by-clause conformity, tailoring or coverage matrix.

| Assessment | Result | Resolution needed |
|---|---|---|
| Exact 42010 architecture-description obligations | `BLOCKED` | Lawfully obtain the normative Edition 2 text and authorize a clause-level review |
| Exact 25010 characteristic/subcharacteristic definitions and application | `BLOCKED` | Lawfully obtain the normative Edition 2 text and map only approved quality concerns |
| Exact 15289 information-item content and current process mapping | `BLOCKED` | Lawfully obtain Edition 4 and reconcile it with 12207:2026/15288:2023; repeat when the successor is published |
| Exact 12207:2026 process outcomes, activities, tasks and tailoring | `BLOCKED` | Lawfully obtain Edition 2 and create an approved applicability/tailoring map |
| Product Decision Authority approval of a reusable IDEA standard | `NOT-RUN` | Draft, review and approve a separate controlled repository guide |

### 6.3 arc42 version boundary

The English template version is verified as `9.0`, but the official download page shows that some
translations have their own update history. If IDEA copies template files, the exact language,
template version, retrieval date and package digest should be recorded. If IDEA only uses the live
twelve-section convention as guidance, the access date and official URLs are sufficient, subject
to a later material-change review.

## 7. Explicit no-conformity boundary

This note does **not** claim that IDEA Engineering, an IDEA document, or a future technology-stack
documentation standard conforms to ISO/IEC/IEEE 42010:2022, ISO/IEC 25010:2023,
ISO/IEC/IEEE 15289:2019 or ISO/IEC/IEEE 12207:2026. It also does not claim certification,
compliance, audit readiness or complete coverage.

Conformity cannot be inferred from:

- citing an official catalogue page;
- using an arc42 outline;
- naming viewpoints, quality characteristics or life-cycle stages;
- creating a document with the candidate sections in this note; or
- marking a local check `PASS` without the controlled configuration and objective evidence.

Any future conformity claim would require lawful access to the applicable normative text, an
approved scope and tailoring decision, clause-level assessment, objective evidence, accepted
deviations and the authorized decision. Those activities are currently `BLOCKED` or `NOT-RUN`.

## 8. Research disposition

### Verified facts

- All four requested ISO/IEC/IEEE or ISO/IEC editions exist as published editions on the evidence
  date.
- `ISO/IEC/IEEE 12207:2026` is published Edition 2, not a draft; `12207:2017` is withdrawn.
- `ISO/IEC/IEEE 15289:2019` remains the published Edition 4 but is under active revision watch.
- arc42 provides a current official twelve-section architecture-documentation convention; the
  English downloadable template is version 9.0.

### Bounded interpretation

Together, the sources provide a defensible basis for a local documentation convention that
separates controlled-document identity, architecture views, quality-driven evaluation, life-cycle
governance and readable navigation. The local standard must state that this combination is IDEA's
tailoring, not a structure prescribed jointly by the sources.

### Decision state

The reusable `IE-STD-TECH-STACK-001@0.1` has been authored as a Draft repository-process standard.
Product Decision Authority review and acceptance remain `NOT-RUN`. No technology selection or
product decision is made by this research note.

## 9. Non-impact statement

This artifact makes **No Product Scope Change**. It changes no Feature, Spec, Tech decision, FTR,
REQ, architecture semantics, ADR, quality threshold, qualification result or PG gate state. It
does not alter the standards register. Any edition-status discrepancy identified here requires a
separate controlled register change.
