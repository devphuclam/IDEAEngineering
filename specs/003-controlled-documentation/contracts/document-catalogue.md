# Contract: Core Document Catalogue

## Purpose

The catalogue is the single navigation entry point for the controlled product-definition set. It
must answer, for every class, what the document is for, who is accountable, what it consumes and
produces, which gate first reviews it, which later gates revisit it, and what it must not own.

## Core classes (exactly eight)

| ID | Controlled class | Authoritative content | First gate | Required consumers |
|---|---|---|---|---|
| `DOC-01` | Product Vision and Scope | Internal purpose, Problem Hypothesis/evidence class, Internal Operational Value, stakeholders, boundary, trajectory, non-goals and success measures | `PG1` | DOC-02, DOC-03, DOC-07 |
| `DOC-02` | Feasibility and Options Assessment | Current-process baseline, options, evaluation criteria, evidence, risks, prototype boundary, recommendation and decision status | `PG1` | DOC-01, DOC-04, DOC-05, DOC-07 |
| `DOC-03` | Business Requirements | Internal needs, actors, operational scenarios, business processes/rules, priorities, constraints and acceptance intent | `PG1` | DOC-04, DOC-07, DOC-08 |
| `DOC-04` | Software Requirements Specification | Verifiable functional, interface, data, quality, security, privacy, operational, support and retirement obligations | `PG2` | DOC-05, DOC-06, DOC-07, DOC-08, VVP |
| `DOC-05` | Architecture Description | Context, boundaries, viewpoints/views, responsibilities, interfaces, quality scenarios, risks, ADRs and verification implications | `PG3` | DOC-06, DOC-07, VVP, CHG |
| `DOC-06` | Data, Integration, and Migration Specification | Data ownership/identity/lifecycle, relationships, integrity, classification, exchange, migration, reconciliation and failure behavior | `PG2` | DOC-05, DOC-07, VVP, CHG |
| `DOC-07` | MVP Roadmap and Delivery Plan | Bounded increments, MVP Release Spine, dependencies, owners, gate prerequisites, exit evidence, rollback and deferred scope | `PG1` | All affected DOCs, CHG, REL |
| `DOC-08` | UI/UX and Interaction Specification | Users/context, journeys, information architecture, interaction states, usability objectives, accessibility profiles, component contracts and evaluation | `PG1` | DOC-03, DOC-04, DOC-05, VVP, VEV |

All eight classes are internal IDEA product-definition artifacts. None may introduce pricing,
revenue, external buyer objectives, or competitor-comparison narrative.

## Supporting classes (exactly nine)

| ID | Class | Primary purpose |
|---|---|---|
| `GOV` | Governance and standards | Roles, gates, standards editions, applicability and tailoring; owns the Material Coverage Inventory and Behavioral Coverage Register as register/sub-register shapes |
| `CLR` | Clean-room provenance | Source identity/hash, evidence class, lawful access and transfer limits |
| `RSK` | Risk register | Risk, treatment, owner, status, residual risk and escalation |
| `VVP` | Verification and validation plan | Procedures, configurations, methods and expected evidence |
| `VEV` | Verification evidence | Executed result, exact environment, outcome, deviations and evidence |
| `CMP` | Configuration management | Controlled items, baselines, versions, status accounting and version watch |
| `CHG` | Change record | Material change, impact analysis, review, approval and effective baseline |
| `REL` | Release baseline | Immutable manifest, hashes, provenance, known issues, risk and recovery |
| `OPS` | Operations and retirement | Support, incident, recovery, retention, operation and retirement evidence |

Traceability is a view over these classes, not an additional competing source class.

## Behavioral Coverage Register boundary

The Material Coverage Inventory and Behavioral Coverage Register are GOV-owned register or governed
sub-register shapes. They do not add a tenth supporting class and are not core-document authorities.
The inventory is a closed, versioned denominator at an explicit as-of baseline/date. Each inventory
entry is a stable material-area identity with an inclusion criterion or explicit exclusion rationale,
owner and `CHG` history; each entry receives exactly one matching coverage record at that baseline with:

- inventory/material-area identity and DDM target version, edition, configuration, evidence and
  limitations;
- proactive applicable quality-benchmark comparison, evidenced advantage or limitation, affected
  stakeholders and risks;
- one disposition: `ADOPT`, `ADAPT`, `ADAPT-ARAS`, `DEFER`, `EXCLUDE`, or `UNKNOWN`;
- decision owner, rationale, owning IDEA requirement or decision, delivery increment, verification
  result and links; and
- explicit visibility for every omitted evidenced DDM behavior (`DEFER` or `EXCLUDE`) and for
  inaccessible or insufficient evidence (`UNKNOWN` or `BLOCKED`).

An inventory addition, removal or scope change is not effective until its `CHG` record and successor
as-of baseline are recorded.

Reference names and comparison evidence belong in this supporting record (or linked supporting
research), never in the eight core document templates.

## Catalogue entry contract

Each row/entry must contain:

- class ID and exact title;
- purpose and authority boundary;
- accountable role and preparation/review roles;
- required inputs and evidence classes;
- owned decisions/information;
- required outputs and downstream consumers;
- first and later applicable gates;
- explicit non-ownership boundaries;
- links to the relevant template, standards applicability records and supporting registers.

If a named person or specialist reviewer is not yet assigned, the role gap is recorded as `UNKNOWN`
or `BLOCKED` with an owner and resolution path; the catalogue must not silently invent an approver.

## Authority rule

When information could appear in more than one class, the catalogue assigns one authoritative owner.
Other classes link to that item and may record only their own conclusion or impact. An accepted ADR,
`CONTEXT.md`, the constitution or a standards/clean-room register cannot be copied into a core
document as a competing authority.
