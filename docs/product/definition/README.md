# IDEA Engineering Product-Definition Templates

**Template baseline**: Instruction-only scaffold for the controlled internal IDEA Engineering
product-definition set. This directory is the navigation entry point; it is not, by itself, an
approved product baseline.

## Authoring boundary

The eight `DOC-01` through `DOC-08` files are Core Product Document classes. Each authored instance
must use the common control envelope below, keep one authoritative owner for each statement, and
retain typed links to evidence, needs, decisions, requirements, changes, verification and releases.
Markdown is the editable authority. DOCX/PDF files are non-authoritative renditions pinned to one
exact source ID, document version and baseline.

Core documents use English headings and field vocabulary. Product UI obligations are recorded as
`en`, `vi`, and `ja` Locale Profile cells in `DOC-04` and `DOC-08`; a locale rendition never replaces
the English source. The product is internal to the company: value statements describe operational
control, engineering-data integrity, release-risk reduction, quality, maintainability and evidenced
efficiency. Commercial objectives do not belong here.

## Core catalogue

| Class | Template | Authority boundary | Required inputs | Required outputs | First/later gates | Supporting records | Primary consumers | Accountable role | Explicit non-ownership boundary |
|---|---|---|---|---|---|---|---|---|---|
| `DOC-01` | [Product Vision and Scope](DOC-01-product-vision-and-scope.md) | Internal purpose, problem hypothesis, stakeholders, boundary, trajectory, non-goals and success measures | Internal need/evidence, accepted decisions | Scope, value, boundaries, success measures | `PG1` / `PG2`, `PG3`, `PG7` when changed | GOV, CLR, RSK, CHG | DOC-02, DOC-03, DOC-07 | Product Decision Authority | Detailed software requirements, architecture, implementation and release execution |
| `DOC-02` | [Feasibility and Options Assessment](DOC-02-feasibility-and-options-assessment.md) | Feasibility questions, current process, options, evidence, risks, prototype boundary and recommendation | DOC-01, current-process evidence, constraints | Option comparison, bounded recommendation, capability-profile decision | `PG1` / `PG2`, `PG4` when selected | GOV, CLR, RSK, VVP, CHG | DOC-01, DOC-04, DOC-05, DOC-07 | Product Decision Authority-designated feasibility owner | Approved requirements, architecture or roadmap authority |
| `DOC-03` | [Business Requirements](DOC-03-business-requirements.md) | Internal stakeholder needs, actors, scenarios, business rules, priorities, constraints and acceptance intent | DOC-01, stakeholder evidence, decisions | Stable needs, scenarios, rules, acceptance intent | `PG1` / `PG2`, `PG3`, `PG7` | GOV, CLR, RSK, CHG | DOC-04, DOC-07, DOC-08 | Product Decision Authority-designated business-needs owner | Implementation and architecture design |
| `DOC-04` | [Software Requirements Specification](DOC-04-software-requirements-specification.md) | Uniquely identified, verifiable functional and quality obligations | DOC-03, DOC-08, approved decisions | Requirement ledger, acceptance and verification obligations | `PG2` / `PG3`, `PG4`, `PG5`, `PG7` | GOV, VVP, VEV, RSK, CHG | DOC-05, DOC-06, DOC-07, DOC-08 | Product Decision Authority-designated requirements owner | Business vision, architecture selection and delivery sequencing |
| `DOC-05` | [Architecture Description](DOC-05-architecture-description.md) | System context, boundaries, views, responsibilities, interfaces, quality scenarios, risks and ADR links | DOC-04, approved decisions and constraints | Architecture views, responsibilities, interfaces, quality implications | `PG3` / `PG4`, `PG5`, `PG7` | GOV, VVP, VEV, RSK, CHG | DOC-06, DOC-07, DOC-08 | Product Decision Authority-designated architecture owner | Business-needs/requirements ownership and delivery priority |
| `DOC-06` | [Data, Integration, and Migration Specification](DOC-06-data-integration-and-migration-specification.md) | Data ownership, identity, lifecycle, exchange, migration, reconciliation and failure obligations | DOC-04, DOC-05, data evidence and decisions | Data/integration contract, mapping, reconciliation and recovery obligations | `PG2` / `PG3`, `PG4`, `PG5` | GOV, VVP, VEV, RSK, CHG | DOC-05, DOC-07 | Product Decision Authority-designated data/integration owner | Product scope, business need and architecture authority outside data/integration |
| `DOC-07` | [MVP Roadmap and Delivery Plan](DOC-07-mvp-roadmap-and-delivery-plan.md) | Bounded increments, release spine, dependencies, gate prerequisites, exit evidence and deferred scope | DOC-01/02/03, approved requirements/design | Increment records, dependency/exit plan, deferred-scope ledger | `PG1` / `PG2`, `PG3`, `PG4`, `PG7` | GOV, CMP, CHG, REL, OPS | All affected DOCs | Product Decision Authority-designated delivery owner | Changing approved requirements or architecture by roadmap assertion |
| `DOC-08` | [UI/UX and Interaction Specification](DOC-08-ui-ux-and-interaction-specification.md) | Users, journeys, interaction states, usability, accessibility profiles, components and evaluation | DOC-03, DOC-04, HCD/accessibility evidence | Interaction, surface, locale and evaluation obligations | `PG1` / `PG2`, `PG3`, `PG4`, `PG5` | GOV, VVP, VEV, RSK, CHG | DOC-03, DOC-04, DOC-05 | Product Decision Authority-designated product/HCD owner | Product vision, business needs, system architecture and requirements authority |

Supporting class ownership remains exactly nine: `GOV`, `CLR`, `RSK`, `VVP`, `VEV`, `CMP`, `CHG`,
`REL`, and `OPS`. The GOV-owned Material Coverage Inventory and Behavioral Coverage Register are
register/sub-register shapes within `GOV`, not a tenth class. Supporting record scaffolds are listed
in [registers/README.md](registers/README.md).

## Common control envelope

Every core and supporting instance records the applicable fields below. `UNKNOWN`, `BLOCKED`, and
`NOT APPLICABLE` are controlled outcomes, not permission to invent a value. Before `Proposed` or
`Approved`, every `UNKNOWN` or `BLOCKED` field needs an owner, resolution action and review trigger.

| Field | Authoring rule |
|---|---|
| Stable Document/Record ID | Semantic identity independent of class code, path and Git commit |
| Class/type | Exactly one core or supporting class |
| Title | Human-readable label; never identity |
| Owner | Attributable accountable role/person; an unassigned required owner blocks the gate |
| Document/record status | `Draft`, `Proposed`, `Approved`, `Superseded`, or `Retired`; separate from gate outcome |
| Document/record version | `major.minor` content version; `1.0` is the first approved version |
| Applicable baseline | Exact product, increment, policy or gate baseline |
| Effective date | Date/time from which the approved item is authoritative |
| Authors, reviewers, approvers | Identities plus competence/independence and authority basis where applicable |
| Source and downstream links | Typed links to upstream evidence/need/decision and downstream design/change/verification/release |
| Evidence/claim status | One controlled evidence class or claim status whenever a claim is present |
| Change history | `CHG`/Work Item and prior-version links with impact disposition |
| Access classification | Repository or approved-storage classification |
| Retention rule | Applicable rule or `NOT APPLICABLE` |
| Content state | `INSTRUCTION-ONLY`, `COMPLETE CONTROLLED DRAFT`, or an approved state |

### Identity and revision rule

`Document Version` is the controlled content version of a DOC instance. `Product Generation` is an
immutable published product snapshot, `Business Revision` is a governed business milestone, and a
Git commit is supporting repository evidence. None of these values silently substitutes for another.
Indexed `DOC-02` feasibility instances and `DOC-07` increment records carry their own instance IDs,
source baseline, status, version, owner, gate and trace fields; an index is never a second authority.

### Authored-content delimiter

Instructions and examples remain outside the authored boundary. Each template contains the following
literal delimiters. Author product content only between them and keep the instructions as comments or
controlled guidance:

```text
<!-- AUTHOR CONTENT START -->
<!-- authored IDEA product content only -->
<!-- AUTHOR CONTENT END -->
```

### Evidence and gate guardrails

- A reference observation is `Reference-Coverage Evidence`; it is not internal need validation by
  itself. Every requirement still needs a stable ID, source, rationale, acceptance criterion and
  verification method.
- A missing source, reviewer, specialist or participant population remains `UNKNOWN`, `BLOCKED`, or
  `NOT-RUN`. It is never converted to `PASS` by a static count.
- Gate outcomes are only `PASS`, `PASS-WITH-ACTIONS`, `FAIL`, or `BLOCKED`; conditional actions name
  an owner, affected baseline, due condition/date, expiry and escalation.
- Standards are recorded with an exact edition, classification, applicability/tailoring disposition
  and evidence expectation. A citation alone is not a conformity claim.
- No production stack, API, database, deployment topology, copied implementation material or
  commercial objective is authorized by these templates. Production implementation remains gated by
  approved PG2 requirements, PG3 architecture/design and PG4 increment readiness.

### Internal-company value boundary

The eight core documents describe an internal company product. Permitted value statements concern
engineering-data integrity, operational control, release-risk reduction, quality, maintainability and
measured efficiency. Pricing, revenue, customer acquisition, market-share, market-fit and
external-buyer objectives are `NOT APPLICABLE` to this baseline.

### Typed trace and rendition navigation

Each core/supporting item exposes typed `SOURCE`, `DOWNSTREAM`, `CHANGE`, `VERIFICATION`, `RELEASE`
and, where distributed, `RENDITION` links. The links identify stable item IDs, versions and exact
baselines. A trace view is navigational only; it never becomes a second authority or silently copies a
statement into another document. A material change is recorded in `CHG`/Work Item, and a DOCX/PDF
rendition records source ID/version/baseline, rendition date, producer where material, status,
classification and retention. Source changes make old renditions `Stale`, deliberate replacement
makes them `Superseded`, and withdrawal records its reason.

### Supporting evidence and reference boundary

Reference observations are retained in `CLR`, `GOV` coverage records, research or approved ADRs as
`Reference-Coverage Evidence`. They may inform a bounded product hypothesis, but they do not become
an internal need, requirement, acceptance or release claim without a separate IDEA decision and
evidence chain. Restricted, unlicensed or production-sensitive material remains outside the
repository; only approved metadata and controlled-storage links may be retained here.

The `GOV`-owned Material Coverage Inventory is the closed denominator at an explicit as-of
baseline/date. It has exactly one Behavioral Coverage Register record per inventory entry, including
target evidence, limitations, proactive benchmark comparison, disposition, owner/rationale, IDEA
trace, increment and verification. The coverage register is a sub-register, not a tenth supporting
class.

## Contract references

The templates implement the information-item contracts in
[`specs/003-controlled-documentation/contracts/`](../../../specs/003-controlled-documentation/contracts/)
and the terminology in [`CONTEXT.md`](../../../CONTEXT.md). The retained sampling and review protocol
is [`quickstart.md`](../../../specs/003-controlled-documentation/quickstart.md); its locale matrix is
three surfaces × three locales = nine locale-surface cells per core-template matrix.

## Status of this directory

This baseline supplies reusable authoring structure. It does not assert that all substantive fields
are populated, that a gate has passed, that the product is conformant, or that reference-product parity
has been demonstrated. Execute the retained Validation Pack and record actual results in the feature
ledger before making those claims.
