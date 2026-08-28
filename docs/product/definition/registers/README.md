# Supporting Record Template Index

This directory is the index for exactly nine supporting record classes. The records provide governed
cross-cutting evidence and links; they never replace authority held by a Core Product Document or a
higher-authority constitution, ADR, standards register or clean-room register.

| Class | Record purpose | Typical owner | Core consumers |
|---|---|---|---|
| `GOV` | [Governance and standards](GOV-governance-and-standards.md) — roles, gates, standards, Material Coverage Inventory and Behavioral Coverage Register | Life-cycle/Quality Authority with Product Decision Authority | All DOCs |
| `CLR` | [Clean-room provenance](CLR-clean-room-provenance.md) — source hash/edition, evidence class and transfer limits | Provenance owner | DOC-01, DOC-02, DOC-04, DOC-05, DOC-06 |
| `RSK` | [Risk register](RSK-risk-register.md) — risk, treatment, owner, status, residual disposition and escalation | Risk owner | DOC-01, DOC-02, DOC-04, DOC-05, DOC-06, DOC-07 |
| `VVP` | [Verification and validation plan](VVP-verification-validation-plan.md) — procedures, environments and expected evidence | Verification lead | DOC-04, DOC-05, DOC-06, DOC-08 |
| `VEV` | [Verification evidence](VEV-verification-evidence.md) — executed result, configuration, outcome, deviation and retained evidence | Verifier | DOC-04, DOC-05, DOC-06, DOC-07, DOC-08 |
| `CMP` | [Configuration management](CMP-configuration-management.md) — controlled items, baselines, versions, status accounting and rendition identity | Configuration manager | All DOCs |
| `CHG` | [Change records](CHG-change-records.md) — material change, impact analysis, review, approval and effective baseline | Change owner | All affected DOCs |
| `REL` | [Release baselines](REL-release-baselines.md) — immutable manifest, provenance, known issues, residual risk and recovery | Release authority | DOC-07 and affected DOCs |
| `OPS` | [Operations and retirement](OPS-operations-and-retirement.md) — support, incident, recovery, retention, operational learning and retirement | Operations role when assigned | DOC-01, DOC-03, DOC-04, DOC-07 |

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
