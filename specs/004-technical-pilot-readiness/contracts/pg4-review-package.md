# Contract: PG4 Review Package

## Purpose

The PG4 Review Package is the pre-decision handoff assembled by T025. It gives the gate authority
one navigable summary of the PH0 evidence without becoming a second requirements, architecture or
approval source. The package is a review input; only the separate `pg4-gate-record.md` records the
gate authority's result and authorization.

## Required fields and sections

```text
package_id: IE-INC-READY-001-PG4-REVIEW
package_version
prepared_date
prepared_by
reviewed_manifest_id_and_hash
reviewed_git_commit
source_baseline_summary
P01_result_and_evidence
P02_result_and_evidence
P03_result_and_evidence
P04_result_and_evidence
P05_result_and_evidence
P06_result_and_evidence
P07_preparation_status
open_blockers_and_gate_effects
residual_risks_and_owners
proposed_successor_increment
proposed_scope_and_limits
approved_pg2_requirements_baseline_and_evidence
approved_pg3_architecture_design_baseline_and_evidence
evidence_index
prohibited_inferences
decision_route
reopen_or_supersession_trigger
```

## Content rules

- Each P01–P07 row names the source artifact, owner, readiness result, evidence link and any
  `BLOCKED`/`NOT-RUN` limitation. A completed task is not a readiness `PASS`.
- The package distinguishes the approved predecessor from every successor Draft and records the
  exact manifest hash and Git commit reviewed by the gate authority.
- `proposed_successor_increment` is a proposal only. It must include a stable increment ID, feature
  directory (if already authorized to exist), bounded scope and explicit limits. It does not grant
  permission to create code or to begin production implementation.
- The package lists missing PG2/PG3 approval, authority, environment, data, license, security or
  reviewer evidence as blockers or `NOT-RUN`; it must not convert an open decision into an action
  that waives a mandatory entry condition.
- `prohibited_inferences` must state that the package is not a PG4 outcome, full Core v0 approval,
  production acceptance, company rollout, SLA evidence, commercial readiness or permission to use
  customer data.
- `decision_route` identifies the applicable gate authority and points to
  [pg4-gate-record.md](pg4-gate-record.md), which is the only record allowed to authorize the exact
  successor increment.

## Relationship to other contracts

- [baseline-manifest-contract.md](baseline-manifest-contract.md) owns exact source identity and
  predecessor/successor separation.
- [decision-and-evidence-register.md](decision-and-evidence-register.md) owns open decisions,
  blockers, owners and closure evidence.
- This contract owns only the structure of the pre-decision review handoff.
- [pg4-gate-record.md](pg4-gate-record.md) owns the attributable execution state, outcome and
  authorization boundary after the gate authority decides.
