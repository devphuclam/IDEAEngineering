# PG4 Gate Record — PH1 Foundation Custody

| Field | Decision |
|---|---|
| Gate / increment | `PG4` / `IE-INC-READY-001` |
| Record version / status | `0.2` / Decided; 0.2 adds the T027 successor link, with no change to the 0.1 decision |
| Decision date | 2026-09-25 (Asia/Ho_Chi_Minh) |
| Decision authority | Project user acting as delegated `PG4 Gate Authority` |
| Review participants | Project user: Project Reviewer and PG4 Gate Authority; assistant: package preparation and source/evidence cross-check. The boss's PG2/PG3 approval is reported separately in `IE-CHG-PDA-APPROVAL-004`. |
| Reviewed manifest | [IE-INC-READY-001-BL-001@0.2](baseline-manifest.md), SHA-256 `E37731C0037FCB4F1DBB1E8AFECC3A4C89384439D417BE8E4EAAE8553A93E2CA` |
| Frozen product/planning source commit | `a9924f467585354cda8017b0f578954a8af0dfd7`; manifest control record at `c0656468c4922728a97215a0886c50bc497181a9` |
| Reviewer checklist evidence | [T031 review](evidence/P07-T031-REVIEW-20260925.md) committed at `d480193968ef507fdb29d44ea1276915dd315954` |
| Gate Execution State / Gate Outcome | `COMPLETE` / `PASS` |
| Authorization State | `ACTIVE` for the exact successor below |
| Access / retention | `INTERNAL`; retain with PH0 source, review and later successor evidence |

## Decision and authority basis

The Gate Authority selected **“Chốt PG4 PASS cho PH1 F01–F05”** in response to the explicit
25-09-2026 gate question. That question named the 72-hour PH1 scope, first card F01-A, one
Gateway/Vault endpoint, required future multi-Vault extension boundary, P01–P06 and T031 results,
and the ADR-0009 exclusion. This record transcribes that decision; the prior
[PG4 review package](pg4-review-package.md) was a recommendation, not the decision.

PG2 and PG3 evidence is [IE-CHG-PDA-APPROVAL-004](../../docs/product/instances/idea-engineering/registers/CHG-2026-09-25-pg2-pg3-approval.md),
the Project Reviewer's attributable report of the boss's 25-09-2026 approval of the exact current
sources after the same-day corrections. Its SHA-256 is
`039DD4951CDF9E05A7C0CD605E98B0073C149A204458B335905217C8F396B0AD`.
PG2 covers the current DOC-03, DOC-04 and requirement-bearing DOC-06/DOC-08 sources. PG3 use
for this gate covers DOC-05, design-bearing DOC-06/DOC-08, applicable ADR-0010–0013 and the VVP
strategy **only for F01–F05**. ADR-0009 remains `Proposed` due its graphical-workflow conflict;
F01–F05 do not implement workflow design. This is not a clean whole-Core-v0 PG3 claim.

## Entry-criteria review

| Criterion | Evidence / disposition |
|---|---|
| Exact reviewed source and authority | [Frozen manifest](baseline-manifest.md#62-t023-freeze-record) and `IE-CHG-PDA-APPROVAL-004`; predecessor and successor authority remain separate. `PASS` for gate identity. |
| P01 baseline review | [P01 reviewed manifest](evidence/P01-BASELINE-001-reviewed-manifest.json), `COMPLETE / PASS` for source identification. |
| P02 scenario and trace | [T011 guided review](evidence/P02-T011-GUIDED-REVIEW-20260925.md), `COMPLETE / PASS` for documentary scope; application tests remain `NOT-RUN`. |
| P03 decisions and dependencies | [T016 decision review](evidence/P03-T016-DECISIONS-20260925.md), `COMPLETE / PASS` for D0–D5 disposition; later runtime qualifications retain their owners. |
| P04 environment | [P04 review](evidence/P04-ENV-REVIEW-20260924.md), `COMPLETE / PASS` for the one-developer Ubuntu/PostgreSQL/one-Vault environment; accepted deployment remains `NOT-RUN`. |
| P05 fixtures | [P05 server fixtures](evidence/P05-SERVER-FIXTURES-20260924.md), `COMPLETE / PASS` for synthetic 1 KiB and 64 MiB preparation; F05 transfer and large-file performance remain `NOT-RUN`. |
| P06 recovery/security plan | [P06 guided disposition](evidence/P06-GUIDED-REVIEW-DISPOSITION-20260924.md), `COMPLETE / PASS` for documentary readiness; runtime abuse, restore and independent specialist verification remain `NOT-RUN`. |
| P07 preparation and quality | [T024 documentary preflight](evidence/P07-T024-PREFLIGHT-20260925.md), [PG4 review package](pg4-review-package.md) and [T031 reviewer disposition](evidence/P07-T031-REVIEW-20260925.md). T031 accepted 32 current requirements-quality criteria; CHK030 is superseded by CHK033, not a current failure. |

No unresolved item in the reviewed package blocks **starting this exact PH1 increment**. The
unbuilt IDEA accounts and Gateway/Adapter are deliverables of F03/F05; they are not falsely
reported as pre-existing runtime evidence. `PASS-WITH-ACTIONS` is not used to waive a missing
mandatory input, and there are no PG4 conditional actions.

## Exact authorization

| Field | Authorized boundary |
|---|---|
| Successor increment | `IE-INC-PH1-FOUNDATION-CUSTODY-001` |
| Spec Kit feature directory | [specs/005-ph1-foundation-custody/](../005-ph1-foundation-custody/spec.md), created under T027 after this decision; no product code is created by this record |
| First delivery card | `F01-A` under the current management plan; starting its effort timer requires the user's separate Tracker instruction |
| Scope and capacity | PH1 F01–F05, 72 planned task hours: source/build/test skeleton, PostgreSQL/migration seam, controlled account/session seam, transaction/Audit seam and one direct Client→Gateway→Vault custody smoke path |
| Vault limit and extension boundary | Implement and test **one** Gateway/Vault endpoint. Preserve stable `VaultId`, `LocationId`, `ArtifactId` and digest while the Vault Adapter owns physical paths; F05 checks this seam. A second Vault, replication, repair and failover are later implementation and verification work. |
| Other exclusions | No Format Worker job or CAD/Office conversion, whole-Core-v0 approval, accepted/production deployment, company rollout, customer data, multi-GB throughput, SLA, recovery-performance or commercial-readiness claim. |

Residual risks remain owned: Engineering/Operations must qualify the later multi-location and
shared-deployment topology; Security/Verification must assess runtime controls and operational
recovery at the applicable later gate; Engineering must check exact package source/version/license
before first use. The current hotspot-backed development host is not a shared deployment route.
These are later work and claim limits, not assertions that the corresponding tests have passed.

Reopen this authorization if the frozen source or approved F01–F05 scope changes materially, a
mandatory authority/evidence item is withdrawn, a new dependency fails license intake, the
one-Vault extension boundary is broken, or work proposes multiple Vaults, Format Worker processing,
production recovery, customer data or commercial distribution under this gate.

## Tracker-readable decision summary

The block below restates this single decision for the repository progress controls.

```pg4-authorization
{
  "gate_id": "PG4",
  "increment_id": "IE-INC-READY-001",
  "reviewed_manifest_id_and_hash": "IE-INC-READY-001-BL-001@0.2; SHA-256 E37731C0037FCB4F1DBB1E8AFECC3A4C89384439D417BE8E4EAAE8553A93E2CA",
  "reviewed_git_commit": "a9924f467585354cda8017b0f578954a8af0dfd7",
  "execution_state": "COMPLETE",
  "outcome": "PASS",
  "decision_date": "2026-09-25",
  "decision_authority": "Project user acting as delegated PG4 Gate Authority",
  "rationale": "P01-P06 scoped results and T023-T025/T031 evidence meet the entry criteria for only PH1 F01-F05; the Gate Authority explicitly chose PASS on 2026-09-25. Unbuilt runtime checks belong to F03/F05, not PH0.",
  "approved_pg2_requirements_baseline_and_evidence": "IE-CHG-PDA-APPROVAL-004; DOC-03@0.7, DOC-04@0.15 and requirement-bearing DOC-06@0.18/DOC-08@0.13 at frozen source commit a9924f467585354cda8017b0f578954a8af0dfd7",
  "approved_pg3_architecture_design_baseline_and_evidence": "IE-CHG-PDA-APPROVAL-004; DOC-05@0.26, design-bearing DOC-06@0.18/DOC-08@0.13, ADR-0010-0013 and VVP@0.19 for PH1 F01-F05 only; ADR-0009 remains Proposed",
  "authorized_successor_increment": "IE-INC-PH1-FOUNDATION-CUSTODY-001",
  "authorized_first_delivery_card": "F01-A",
  "authorization_limits": "Only PH1 F01-F05/72h and one Gateway/Vault endpoint; preserve VaultId/LocationId/ArtifactId/digest and Vault Adapter path ownership. No second Vault, failover, Format Worker job, production deployment, customer data, SLA or commercial claim.",
  "authorization_state": "ACTIVE",
  "conditional_actions": []
}
```
