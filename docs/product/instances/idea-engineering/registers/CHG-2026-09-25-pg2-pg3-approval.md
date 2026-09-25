# Product Decision Authority Approval — PG2 Requirements and PG3 Design

## Control envelope

| Field | Recorded value |
|---|---|
| Stable Supporting Record ID | `IE-CHG-PDA-APPROVAL-004` |
| Class / version / record status | `CHG` / `0.1` / `Draft` record |
| Decision / date | PG2 and PG3 source approval reported / 2026-09-25, after the same-day DOC-05 and VVP corrections; gate use of PG3 is bounded to PH1 as recorded below |
| Decision authority | Project boss acting as Product Decision Authority and independent approver of the authored baseline |
| Decision reported by | Project user acting as Project Reviewer; the user confirmed the date, whole current-document scope and inclusion of the five Proposed ADRs in this review |
| Evidence class | User-reported management decision; no signed minutes or approval-system event supplied |
| Applicable source commit | `4920f6896cf88735a7174d36246945e5209ad3ca`; exact file hashes below |
| Product normativity | Approves the pinned PG2 requirements and PG3 architecture/design source set; creates no new Feature, Requirement or technology selection |
| Downstream | P03/T016, T023 baseline freeze, P07/PG4 review, approved-status renditions of the source documents and ADR index |
| Access / retention | `INTERNAL`; retain with the pinned source set and later gate record |

## Reported approval scope

The project user reports that the Product Decision Authority approved **the whole current PG2 and
PG3 source set** on 2026-09-25, including the Check-in correction made that day. PG2 covers
DOC-03, DOC-04 and requirement-bearing DOC-06/DOC-08. PG3 covers DOC-05, design-bearing
DOC-06/DOC-08, the applicable five ADRs, the risk/threat treatment in DOC-05, and the VVP
strategy. This is not merely approval of the earlier 2026-09-17 Feature/Spec/Tech predecessor or
the narrow 2026-09-19/25 policy corrections.

The Project Reviewer then found that the as-reviewed ADR-0009 still claims a graphical Workflow
Designer in MVP, contrary to FEATURE-001 FTR-008 and DOC-04. The user chose to leave ADR-0009
`Proposed` until that conflict is resolved. Accordingly, **PG3 may be used for the bounded PH1
F01–F05 baseline only**; it is not recorded as a clean whole-Core-v0 PG3 PASS. F01–F05 do not
implement workflow design. This scoped treatment records the user's decision without erasing the
boss's reported wider review.

The approved **design** includes the control-plane/data-plane separation and future multi-location
Artifact Custody. The bounded **PH1 implementation** remains F01–F05 with one Gateway/Vault
endpoint; multiple Vaults, replication, repair and failover are not PH1 deliverables. Design
approval does not prove a running Gateway or select its exact runtime/provider.

## Exact source content at the reported decision

The files below were unchanged in the repository worktree when their SHA-256 values were computed.
Their `Draft`/`Proposed` labels at the decision point are historical source content; this record
captures the later reported authority disposition. An editorial approved-status rendition must
refer back to these hashes rather than replacing them in this decision record.

| PG2/PG3 source | Version/status at decision | SHA-256 |
|---|---|---|
| [DOC-03](../DOC-03-business-requirements.md) | 0.7 / Draft | `047602DF7DDD571A3445D0ED8BE4AEB47E6BD68262D8E6412039782637D4E0FC` |
| [DOC-04](../DOC-04-software-requirements-specification.md) | 0.15 / Draft | `11120D2A7D57ABE5A2B1582DAD088635382998EA0A7B03EB1A94F44A9EB4310B` |
| [DOC-05](../DOC-05-architecture-description.md) | 0.26 / Draft | `8AD78E1B861BCE9A356E85096D8044588DAFA4E17C0CFAD2E16EAF61A1089323` |
| [DOC-06](../DOC-06-data-integration-and-migration-specification.md) | 0.18 / Draft | `CEB2768CABE5F5AF477CCE0452B474B549EC052A4C48171F491882002C7580DE` |
| [DOC-08](../DOC-08-ui-ux-and-interaction-specification.md) | 0.13 / Draft | `C60778FD2051067F98892CA15F353D654FBBD2EBA885287BBE35C05122CB1FB9` |
| [VVP](VVP-core-v0-verification-validation-plan.md) | 0.19 / Draft plan | `9FB09538D3A885CFE00FA8EFCD321F16691DBACA7B0BFCDC08FE2FB663F0C856` |
| [ADR-0009](../../../../adr/0009-use-ddm-baseline-and-aras-quality-benchmark.md) | Proposed | `0F3FEFA5AC9AA81E95F569AEF7791DF7485D3785FC5B0E5A531A319E5B2FE9CC` |
| [ADR-0010](../../../../adr/0010-separate-configuration-governance-paths.md) | Proposed | `E7FCCD43A63FFC6898B9231324B1F3F970389AA6B9AF81281D154EF1EE9E0B30` |
| [ADR-0011](../../../../adr/0011-one-governing-project-per-logical-document.md) | Proposed | `39A886B599D63F9E2D2330D3CBD7B63B26F64C47DE11650A1549603DFC4EACB1` |
| [ADR-0012](../../../../adr/0012-use-principal-role-scope-rbac.md) | Proposed | `78581AE589FCD8C4D9633591CBFEC8EFA324BB3D7392B6A8823C20179F11336E` |
| [ADR-0013](../../../../adr/0013-separate-artifact-control-and-data-planes.md) | Proposed | `49C86103F9FA2262DA8EF8C95B0F5CF88F0EFDE1E113842855D5695BDC41B802` |

DOC-07 owns the proposed PH1 work scope and PG4 owns the implementation-readiness decision;
neither was approved by this PG2/PG3 disposition. TECH-001@0.16, Q-15, Format Worker
runtime/toolchain and the Gateway runtime/provider retain their separate recorded states.

## Limits and next control steps

- This is the Project Reviewer's attributable report of the boss's decision. It does not claim
  signed minutes, an independent specialist test, implemented behavior or a product test result.
- The Product Decision Authority is separate from the author. No additional specialist review
  evidence was supplied; open DOC-05 risks and any gate-specific specialist need remain visible.
- Current source headers, ADR front matter, catalogue and baseline manifest still describe the
  earlier Draft/Proposed state. Update them as controlled successor renditions, citing this record
  and preserving the approved source hashes above.
- Reconcile PG2 acceptance/trace and the PH1-relevant PG3 risk, threat, quality and ADR coverage
  before using this approval as a PG4 prerequisite. ADR-0009 remains `Proposed`; a whole-Core-v0
  PG3 PASS requires its scope conflict to be resolved by a controlled successor decision.
- PG4 is still `NOT-RUN`; P03 D1/D2/D4/D5 qualification and any open authority/verification
  evidence retain their own gate effects. No PH1 production implementation, company rollout,
  multi-location runtime, commercial-use, scale or recovery claim follows from this record.
