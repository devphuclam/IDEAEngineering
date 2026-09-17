# Research: Technical Pilot Implementation Readiness

**Feature**: [spec.md](spec.md)
**Date**: 2026-09-17
**Purpose**: Resolve the planning choices needed for PH0 without starting new technology research or
reopening approved product decisions.

## Decision 1 — Scope one Spec Kit increment to PH0

**Decision**: `004-technical-pilot-readiness` covers only `P01`–`P07` and ends with the recorded
`PG4` result. Each later code-bearing phase receives a separate Spec Kit increment.

**Rationale**: DOC-07 explicitly requires a separate plan/task set before each implementation phase.
PH0 has a distinct outcome: decide whether a bounded next increment is safe to start. Mixing PH0 and
all Technical Pilot implementation would let unresolved entry conditions hide inside a large task
list and would weaken the `PG4` boundary.

**Alternatives considered**:

- One Spec Kit feature for PH0–PH5: rejected because it would authorize no code yet while pretending
  the full implementation plan is actionable.
- Reuse `003-controlled-documentation`: rejected because DOC-07 explicitly says it is not a product
  implementation feature.

## Decision 2 — Pin approval to the approval record, not a planning snapshot

**Decision**: The approved predecessor is the Feature/Spec/Tech baseline identified by
`IE-CHG-PDA-APPROVAL-001` at commit `f269a0445737a7efd7f406ee51517149a8967afa`.
Commit `aabf02ff...` remains a predecessor roadmap/planning snapshot and is not the approval baseline.

**Rationale**: The approval record is later, attributable evidence that identifies the decision
authority, date, exact sources and content hashes. The task appendix uses `aabf02ff...` as a plan
history dependency, but that commit cannot replace the recorded approval commit.

**Alternatives considered**:

- Use current `main` as the approved baseline: rejected because it contains later successor changes.
- Treat each current document version as approved if its predecessor was approved: rejected because
  approval does not flow silently to a material successor.

## Decision 3 — Keep the Vault successor as a separate decision

**Decision**: The successor set led by DOC-04@0.14, DOC-05@0.21, DOC-06@0.17, DOC-08@0.13,
VVP@0.17, architecture@0.4, technology views@0.3 and TECH-001@0.15 remains a Draft delta with exact
Product Decision Authority disposition `NOT-RUN`.

**Rationale**: The project user selected the architecture direction for drafting. The change record,
ADR and successor documents all state that this did not approve the exact successor Spec/Tech
baseline. D0 must either approve/require change/defer/reject the successor or keep it outside the
first authorized implementation increment.

**Alternatives considered**:

- Infer approval from the boss's earlier concern about multiple Vault locations: rejected because a
  need and an exact controlled-baseline decision are different evidence.
- Remove the successor from planning: rejected because it is an explicit management need and a
  critical dependency that must be dispositioned visibly.

## Decision 4 — Treat missing operational values as managed dependencies

**Decision**: Exact hosts, Gateway runtime/toolchain, Vault endpoints, location-count policy, file
corpus, test identities, reviewer competence and qualification thresholds are recorded in the PH0
decision/evidence register. They are not guessed in the feature spec.

**Rationale**: Their values affect implementation and verification, but the repository already
classifies many as `UNKNOWN`, `BLOCKED` or `NOT-RUN`. P03–P06 exist to assign owners and evidence.
Inventing numbers would create false requirements and could contradict the authority that must
supply them.

**Alternatives considered**:

- Ask the user to select every value before planning: rejected because many values require company,
  infrastructure, license or specialist evidence rather than preference.
- Use common defaults and revise later: rejected for gate-critical security, durability and recovery
  values; defaults may be proposed only in the owned decision record with rationale.

## Decision 5 — Separate document contracts instead of one large readiness report

**Decision**: Use narrow contracts for the baseline manifest, decision/evidence register and `PG4`
gate record. Other PH0 records conform to those contracts and link rather than duplicate authority.

**Rationale**: Applying `codebase-design` to the documentation domain produces deep modules with
small interfaces: source identity, readiness state and gate authorization change for different
reasons. A single report would couple them and make later evidence updates rewrite the gate record.

**Alternatives considered**:

- One PH0 document containing all details: rejected because authority, evidence and decision history
  would be difficult to compare and supersede safely.
- Edit DOC-04/05/06 to carry readiness values: rejected because those documents own product behavior,
  architecture and data, not delivery execution state.

## Decision 6 — Preserve future commercial legality without adding commercial scope

**Decision**: Apply the repository external-source intake to every proposed dependency or adapted
source and retain a separate future Commercial Readiness Gate. Do not add customer, billing,
licensing-enforcement, public SaaS or sales requirements to PH0.

**Rationale**: The product is internal-first for several years but is intended to remain capable of a
lawful later commercial assessment. License and provenance errors made now can make later sale
impossible; commercial-only features would distract from the internal Technical Pilot.

**Alternatives considered**:

- Ignore commercial constraints until launch: rejected because license/provenance debt may be
  irreversible.
- Build multi-customer/commercial functionality now: rejected because it is outside approved scope.

## Decision 7 — Use honest evidence states

**Decision**: Readiness checks use `PASS`, `FAIL`, `BLOCKED` and `NOT-RUN`. A product gate separately
records execution state (`NOT-RUN`, `IN-PROGRESS`, `COMPLETE`) and outcome (`NOT-APPLICABLE` until
a decision; then `PASS`, `PASS-WITH-ACTIONS`, `FAIL` or `BLOCKED`). No due date, completed document
or author review creates a pass by itself.

**Rationale**: The constitution controls the permitted gate outcomes and requires approved PG2/PG3
baselines before production implementation. A valid conditional pass retains complete action records
and cannot waive missing mandatory prerequisites. The earlier three-value PH0 wording conflicted
with this authority; the approved correction aligns Appendix A and this package without changing a
gate decision or the constitution.

**Alternatives considered**:

- Use percentage complete: rejected because it does not express missing authority or failed evidence.
- Treat authored documents as executed evidence: rejected because design and runtime proof are
  different evidence classes.

## Clarification Result

No critical product-behavior ambiguity requires a user question before planning. Remaining unknowns
are explicit PH0 work products with owners and gate effects. If P03 finds that an unknown changes
approved behavior rather than implementation readiness, the change must return to the applicable
Feature, Spec or Tech authority before `PG4`.
