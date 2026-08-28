# Supporting Record Template Index

This directory is the index for exactly nine supporting record classes. The records provide governed
cross-cutting evidence and links; they never replace authority held by a Core Product Document or a
higher-authority constitution, ADR, standards register or clean-room register.

| Class | Template / record purpose | Authority boundary | Required inputs | Required outputs | First / later gates | Accountable role | Core consumers | Explicit non-ownership boundary |
|---|---|---|---|---|---|---|---|---|
| `GOV` | [Governance and standards](GOV-governance-and-standards.md) — roles, gates, standards and coverage governance | Owns governance dispositions, standards applicability, the Material Coverage Inventory and Behavioral Coverage Register | Constitution, `CONTEXT.md`, standards register, accepted ADRs, lawful reference evidence and risks | Role/gate rules, standards dispositions, closed coverage denominator and one coverage disposition per entry | `PG0` / `PG1`–`PG7` when affected | Life-cycle/Quality Authority with Product Decision Authority | All DOCs | Core product requirements, architecture, implementation and source-evidence custody |
| `CLR` | [Clean-room provenance](CLR-clean-room-provenance.md) — source identity, evidence class and transfer limits | Owns lawful-access, provenance, handling and permitted-transfer evidence | Authorized source metadata/artifact, access basis, hash/edition, scope and handling classification | Admissibility record, evidence class, limitations, transfer boundary and downstream trace | `PG0` / each gate consuming external evidence | Provenance owner | DOC-01, DOC-02, DOC-04, DOC-05, DOC-06 | Product need, requirement, design or parity decision |
| `RSK` | [Risk register](RSK-risk-register.md) — treatment, residual disposition and escalation | Owns risk identity, treatment state, residual risk and escalation trace | DOC/requirement/design/evidence baseline, hazard or uncertainty, owner and impact | Treatment, due trigger, residual disposition, escalation and affected-item links | `PG1` / `PG2`–`PG7` when risk is material | Risk owner | DOC-01, DOC-02, DOC-04, DOC-05, DOC-06, DOC-07 | Product scope, requirement or architecture decision authority |
| `VVP` | [Verification and validation plan](VVP-verification-validation-plan.md) — methods, environments, procedures and expected evidence | Owns how an approved requirement or claim will be evaluated | Exact requirement/claim, configuration baseline, risk, acceptance and independence needs | Method, environment, procedure, expected evidence, sampling and sufficiency rules | `PG2` / `PG3`–`PG5` and later change review | Verification lead | DOC-04, DOC-05, DOC-06, DOC-08 | Executed result or product/release approval |
| `VEV` | [Verification evidence](VEV-verification-evidence.md) — actual result, configuration, deviation and retained evidence | Owns what was executed and observed against one exact configuration | Approved VVP/procedure, exact baseline/environment, executor and evidence source | Attributable result, timestamp, deviations, limitations, residual risk and evidence links | `PG5` / `PG6`–`PG7` when consumed | Verifier | DOC-04, DOC-05, DOC-06, DOC-07, DOC-08 | Requirement, design, gate or release authority |
| `CMP` | [Configuration management](CMP-configuration-management.md) — controlled identities, versions, baselines and renditions | Owns controlled-item identity, status accounting, baseline membership and rendition identity | Controlled DOC/record identities, versions, `CHG`, rendition and release inputs | Exact baselines, status/version accounting, manifests and rendition state | `PG0` / `PG1`–`PG7` | Configuration manager | All DOCs | Product content, business revision meaning or release authorization |
| `CHG` | [Change records](CHG-change-records.md) — material change, impact, review and effective baseline | Owns the traceable proposal/decision for a material baseline change | Trigger, affected exact baselines, impact/risk analysis and reviewer/approver authority | Decision, conditional actions, effective successor baseline and history links | Affected `PG0`–`PG7` gate / all downstream gates | Change owner | All affected DOCs | Silently rewriting the affected authoritative DOC, requirement or design |
| `REL` | [Release baselines](REL-release-baselines.md) — immutable manifest, claim boundary and recovery evidence | Owns release-package pins, release disposition, known issues and recovery trace | DOC-07 release scope, CMP pins, VEV, risks, provenance, rollback/recovery and authority | Immutable release manifest, authorized claim boundary, residual risks and recovery links | `PG6` / `PG7` and successor release review | Release authority | DOC-07 and affected DOCs | Product requirement/design authority or operational rollout beyond approved scope |
| `OPS` | [Operations and retirement](OPS-operations-and-retirement.md) — support, incident, recovery, retention and retirement | Owns operational handoff/readiness, incidents, recovery evidence, learning and retirement records | REL package, support/retention requirements, incidents, risks, changes and accountable operation role | Readiness disposition, support record, incident/recovery trace, learning and retirement evidence | `PG7` / operational and retirement reviews | Operations role when assigned | DOC-01, DOC-03, DOC-04, DOC-07 | Product definition, release composition or unapproved control/write-back authority |

The `GOV` record owns the closed Material Coverage Inventory denominator at an explicit as-of
baseline/date. Each inventory entry has exactly one Behavioral Coverage Register record at that
baseline. The register is a sub-register, not a tenth supporting class.

## Common record rules

Supporting instances use the common envelope in the parent [template README](../README.md), including
stable identity, class, owner, status, `major.minor` version, exact baseline, dates, roles, typed links,
evidence/claim status, change history, classification, retention and authored-content delimiters.
Missing authority or evidence remains `UNKNOWN`, `BLOCKED`, or `NOT-RUN` with an owner and resolution
path. A supporting record cannot silently rewrite a Core Product Document.

The nine concrete supporting-record files are instruction-only scaffolds until their substantive
records are populated and approved. This index and the feature contracts remain the navigation and
field boundary.
