# Contract: Evidence, Clean-Room Transfer and Traceability

## Evidence record

Every evidence reference records:

- stable evidence ID and source artifact URI/path;
- exact source hash, edition or target version/configuration;
- observation/publication date and lawful-access basis;
- one evidence class;
- scope, limitations and stop conditions;
- permitted transfer and repository handling classification;
- linked finding, design lesson, decision or requirement.

The clean-room classes are `TARGET-RUNTIME FACT`, `TARGET-STATIC FACT`, `VENDOR-PUBLIC`, `INFERENCE`,
`UNKNOWN`, `BOUNDARY`, `BLOCKED`, `IDEA DECISION`, and `IDEA REQUIREMENT`.

## Reference-product boundary

DDM is the default long-term behavioral coverage target. An evidenced DDM behavior is an `ADOPT`
candidate unless an approved IDEA disposition records `ADAPT`, `ADAPT-ARAS`, `DEFER` or `EXCLUDE`.
Official Aras material is a quality benchmark and fallback for DDM gaps, not a second parity target.

Reference observations from DDM, Aras, icVault or another external source are recorded as
`Reference-Coverage Evidence`. They may support a `Reference-Backed Product Hypothesis` and a
product-direction decision. They do not alone establish `Internal Operational Need Validation` or
an IDEA requirement. A requirement additionally needs an IDEA stakeholder need or approved product
decision, rationale, acceptance criterion, verification method and approval.

## Material Coverage Inventory and Behavioral Coverage Register contract

The GOV-owned Material Coverage Inventory is the closed denominator for the controlled translation
layer. It records stable material-area IDs, inclusion criteria, explicit exclusions, owner, exact as-of
baseline/date and `CHG` history. The Behavioral Coverage Register is a register/sub-register, not a
tenth supporting class; it contains exactly one record for every inventory entry at that baseline. Each
record must contain:

| Field | Required content |
|---|---|
| Behavior identity | Stable behavior/material-area ID and concise scope |
| Inventory linkage | Material Coverage Inventory ID and exact as-of baseline/date |
| DDM reference | Target version/edition/configuration, evidence IDs, limitations and access boundary |
| Quality benchmark | Proactive applicable benchmark comparison, evidenced advantage/limitation and affected stakeholders/risks |
| Product disposition | `ADOPT`, `ADAPT`, `ADAPT-ARAS`, `DEFER`, `EXCLUDE`, or `UNKNOWN` |
| Decision trace | Decision owner, rationale, owning IDEA requirement/decision and increment |
| Verification | Planned/executed evidence, exact baseline, result and links |
| Omission visibility | Every omitted evidenced DDM behavior is `DEFER` or `EXCLUDE`; unresolved access/evidence is `UNKNOWN` or `BLOCKED` |

An evidenced DDM behavior is a default `ADOPT` candidate only after the applicable benchmark
comparison is recorded. A material `ADAPT` or `ADAPT-ARAS` outcome must identify the DDM limitation,
the improvement, impact and approval; neither source authorizes copied implementation material.

Inventory additions, removals and scope changes require a `CHG` record and a successor effective
baseline before the completeness denominator changes.

Core `DOC-01` through `DOC-08` contain only approved IDEA product language. Reference names,
citations and comparison narrative remain in supporting research, coverage registers, ADRs or
governance records. No source code, binary, schema, proprietary documentation, visual asset or
undisclosed protocol may cross the clean-room boundary.

## Permitted transfer chain

```text
Authorized source + fixed hash
  → classified atomic finding
  → design lesson / bounded inference
  → approved IDEA decision or independently evidenced stakeholder need
  → requirement
  → architecture/interface/ADR
  → change/work item
  → verification result
  → release baseline
```

Each arrow is a typed trace link. A view of the chain is derived from authoritative items and cannot
become a second source for requirement, design, test or release content.

## Bidirectional trace contract

The implementation of the documentation system must let a reviewer navigate both directions:

| Upstream item | Downstream item(s) |
|---|---|
| Evidence/finding | Design lesson, product decision or stakeholder need |
| Product decision/need | Requirement(s) |
| Requirement | Architecture, interface, interaction response or ADR |
| Any material baseline change | `CHG`/Work Item, impact analysis and affected artifacts |
| Requirement/design | Verification plan and executed evidence |
| Verification evidence | Release baseline and rendition |

Links identify exact IDs and versions/baselines. Broken, stale, orphaned or unjustified circular
links affecting a gate are visible and block that gate until repaired or formally dispositioned.

## Claim-status separation

The following statuses are independent and must not be collapsed:

| Claim/evidence status | What it proves | What it does not prove |
|---|---|---|
| `Reference-Coverage Evidence` | An externally observable capability or published behavior within recorded scope | Internal need, production readiness or implementation parity |
| `Reference-Backed Product Hypothesis` | Approved product direction for further documentation/feasibility | Representative-user validation or measured internal value |
| `Canonical Demo Dataset` | Deterministic synthetic demonstration input | Real internal-user acceptance or production migration |
| `Technical Pilot Verification` | Bounded functional/safety/trace/recovery evidence in an approved environment | Operational rollout or adoption |
| `Single-Actor Functional Acceptance` | Limited multi-identity functional evidence operated by one human | Independent review or representative-user acceptance |
| `Internal Operational Need Validation` | Evidence from representative company roles/workflows confirming the internal problem and desired outcome | Technical correctness by itself |
| `Internal Pilot Acceptance` | Attributable authorization for a controlled internal pilot after required evidence | Company-wide rollout unless separately authorized |
| `Operational rollout authorization` | Named authority's decision for the approved scope | Broader scope than the exact baseline |
| `UNKNOWN` / `BLOCKED` | A visible evidence or prerequisite gap | PASS, FAIL or implied completion |

## Pilot-data handling

Repository content may contain the approved synthetic Canonical Demo Dataset and safe metadata. A
sanitized or production-derived Representative Pilot Project stays in a company-approved storage
boundary with classification, owner, access, retention and handling records; it is not automatically
committed to Git.

## Locale/source-language boundary

The controlled editable source and field vocabulary are English. Product locale obligations are a
separate `DOC-04`/`DOC-08` Locale Profile for one cell in the complete 3-by-3 matrix: `en`, `vi`, and
`ja` across Desktop, Web and Web-rendered regions (9 cells per core template). The profile records the
Localized Resource Catalogue, English fallback,
Vietnamese/Japanese review status, persisted locale preference, Unicode preservation, and Japanese
IME/normalization/width/search/font-fallback/line-breaking evidence or `UNKNOWN`/`BLOCKED` status.
Runtime auto-translation is not an authority, and localized DOCX/PDF renditions do not replace the
English source.
