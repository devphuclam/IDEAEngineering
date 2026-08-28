# Contract: Gate Packages and Pilot Dispositions

## Gate decision record

Each gate decision pins one exact baseline and contains:

- gate ID (`PG0` through `PG7`);
- exact input document/record IDs and versions;
- immutable repository evidence or controlled-storage references;
- reviewer and approver identities, roles and independence basis;
- decision date, rationale and affected scope;
- one outcome: `PASS`, `PASS-WITH-ACTIONS`, `FAIL` or `BLOCKED`;
- action owner, affected baseline, due condition/date, expiry and escalation for every conditional
  action;
- links to risks, changes, verification evidence and the next gate.

Completeness by file count is not a pass. Missing authority, lawful access, required evidence or an
independent reviewer is visible and leaves the gate `BLOCKED`.

## Independence and representativeness contract

For a material review or acceptance record, an independent reviewer must not be an author of, or the
owner of the material decision in, the baseline under review. The record names the reviewer's
competence for the concern or records a `Specialist Review Gap`; a Product Decision Authority's
decision authority does not by itself establish specialist competence. When the available human
population meets the Validation Pack minimum, a walkthrough uses at least two participants: the
Product Decision Authority and one intended document consumer. The Principal Product Author may
participate in comprehension/usability work but cannot count as the independent approver. If the
required reviewer, competence or participant population is unavailable, the result is `BLOCKED` or
`NOT-RUN`, never an unqualified pass. A one-human/two-identity exercise remains `Single-Actor
Functional Acceptance`.

## PG0–PG7 minimum package map

| Gate | Minimum core documents | Supporting records/evidence | Exit intent |
|---|---|---|---|
| `PG0` Governance | Constitution, catalogue and applicable DOC-01 framing | `GOV`, `CLR`, `CMP`, standards/tailoring, roles, gate model | Governance, lawful-access, clean-room, standards and configuration foundation approved or explicitly blocked |
| `PG1` Needs and feasibility | `DOC-01`, `DOC-02`, initial `DOC-03` | `GOV`, `CLR`, `RSK`, internal context evidence, reference coverage | Internal problem/value hypothesis, feasibility options, assumptions and initial risks baselined |
| `PG2` Requirements | `DOC-03`, `DOC-04`, requirement-bearing `DOC-06` and `DOC-08` | `VVP`, `RSK`, `CLR`, standards applicability, trace matrix | Measurable, source-traceable requirements approved |
| `PG3` Architecture and design | `DOC-05`, `DOC-06`, `DOC-08`, applicable ADRs | `RSK`, `VVP`, `GOV`, quality/accessibility/security responses | Architecture, interaction/design, risk treatment and V&V strategy approved |
| `PG4` Increment readiness | Affected DOCs and bounded `DOC-07` increment | `CHG`, `CMP`, `VVP`, `RSK`, rollback/migration and dependency evidence | Increment authorized only when requirements, design, tests and recovery remain ready |
| `PG5` Verification and acceptance | Exact increment baseline and applicable DOCs | `VEV`, `VVP`, defects, waivers, coverage, pilot records | Exact controlled configuration verified; unrun/blocked checks remain visible |
| `PG6` Release authorization | `DOC-07` release scope and applicable approved DOCs | `REL`, `CMP`, `VEV`, provenance, SBOM where applicable, risk/recovery | Immutable release manifest authorized with truthful claims and rollback/recovery evidence |
| `PG7` Operate and learn | `DOC-01`, `DOC-03`, `DOC-04`, `DOC-07` updates as applicable | `OPS`, `RSK`, `CHG`, support/incident/recovery/retirement records | Operate, support, change, retain, retire and feed validated learning back into the lifecycle |

The package may link a document at a later gate without making that gate its authority. A lower gate
cannot silently replace an approved higher-authority decision.

## Production implementation gate

Production implementation for an increment is unauthorized until:

1. affected requirements pass `PG2`;
2. architecture/design pass `PG3`; and
3. the bounded increment passes `PG4`, or has `PASS-WITH-ACTIONS` actions that do not invalidate
   requirements, architecture, risk treatment, test design or rollback readiness.

Pre-`PG2` prototypes are throwaway feasibility aids only. They remain outside the production
baseline and cannot prove that requirements, architecture, security, accessibility or quality gates
passed.

## Pilot evidence decision rules

| Situation | Allowed disposition |
|---|---|
| Synthetic dataset exercises the MVP Release Spine | `Canonical Demo Dataset`; supports technical verification only |
| Bounded non-production or approved internal execution | `Technical Pilot Verification`; Internal Adoption Authority is not required to run it |
| One human operates multiple separately provisioned identities | `Single-Actor Functional Acceptance`; not independent review or representative-user acceptance |
| Representative internal roles/workflows confirm the problem and outcome | `Internal Operational Need Validation` |
| Technical readiness plus representative internal-user evidence and named authority | `Internal Pilot Acceptance` |
| Named authority authorizes broader exact scope after pilot evidence | `Operational rollout authorization` |

Passing one row never creates a higher row automatically. No Internal Adoption Authority or
representative-user evidence means Internal Pilot Acceptance and rollout remain unavailable even when
technical checks pass.

## Documentation Validation Pack minimum

The gate-package walkthrough consumes the retained Documentation Validation Pack. Its minimum
strata are: all 17 classes for structural checks; 20 placement items spanning the eight core and nine
supporting classes; 8 cross-domain requirements; 6 reference-coverage cases; 4 gate outcomes; 3
surface profiles plus the complete 9-cell locale matrix (`en`/`vi`/`ja` × Desktop/Web/Web-rendered
Desktop) for one core-template review; 4 rendition states; and 6 pilot/claim statuses. If both
`DOC-04` and `DOC-08` are claimed fully reviewed, retain 18 locale-surface cells. Each item carries a
stable ID, stratum, selection rationale, expected and executed result, exact baseline, environment,
date, owner and evidence link. The pack is criterion-based and stratified; it cannot generalize from
a convenience sample.
