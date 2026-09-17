# Feature Spec and Tech Product Decision Authority Approval Record

## Control envelope

| Field | Recorded value |
|---|---|
| Stable Supporting Record ID | `IE-CHG-PDA-APPROVAL-001` |
| Supporting class / version / status | `CHG` / `0.1` / `Draft` |
| Decision date | 17-09-2026 |
| Decision authority | The boss, acting as `Product Decision Authority` for Feature, Spec and Tech |
| Decision reporter | Project user and internal document reviewer |
| Decision evidence | The project user reported on 17-09-2026 that the Product Decision Authority approved the complete material presented by the project user and Principal Product Author. Signed minutes or a separately signed approval artifact were not supplied to this repository. |
| Applicable baseline | Git commit `f269a0445737a7efd7f406ee51517149a8967afa`; management-review packet dated 16-09-2026 |
| Product normativity | `NORMATIVE` for the three recorded Product Decision Authority dispositions; it creates no additional Feature or Requirement beyond the pinned baseline |
| Repository process authority / instruction state | `NOT-APPLICABLE` / `NOT-APPLICABLE` |
| Source / upstream trace | [Management-review source map](../../../../reports/IDEA-Engineering-Core-v0-Feature-Spec-Tech-Management-Review-source-map.md); [`FEATURE-001@0.12`](../decision-briefs/FEATURE-001-feature-definition-and-scope.md); [`DOC-04@0.13`](../DOC-04-software-requirements-specification.md); [`TECH-001@0.14`](../decision-briefs/TECH-001-technology-and-architecture-proposal.md); [`IE-KNW-TECH-DEC-001@0.6`](../../../knowledge/2026-09-13-core-v0-technology-decision-matrix.md); [`IE-ARC-TECH-VIEW-001@0.2`](../technology/IDEA-core-v0-technology-architecture-views.md) |
| Downstream trace | Product instance catalogue, Feature/Spec/Tech version history, successor approved renditions, gate and delivery planning |
| Supersedes / superseded by | Supersedes the `NOT-RUN` Product Decision Authority disposition for this exact management-review baseline / `NOT-APPLICABLE` |
| Review trigger | Any material change to the approved Feature scope, normative SRS, selected Tech baseline, or a controlled reopen decision |
| Access / retention | `INTERNAL`; retain with the exact presentation, source map, source hashes and successor decision records |

## 1. Exact approval baseline

The decision applies to the management review packet generated from commit
`f269a0445737a7efd7f406ee51517149a8967afa`. The presentation correctly showed Product Decision
Authority approval as `NOT-RUN` before the review; this successor record captures the decision made
after that review.

| Approval axis | Exact controlled baseline presented | Recorded disposition |
|---|---|---|
| Feature | `FEATURE-001@0.12`, interpreted with current DOC-01@0.6, DOC-03@0.7 and DOC-04@0.13; 14 controlled Feature groups | `APPROVED` |
| Spec | Normative `DOC-04@0.13`; 87 controlled `REQ-*` rows, with supporting DOC-06@0.16, DOC-08@0.12 and VVP@0.16 used by the management review | `APPROVED` |
| Tech | `TECH-001@0.14`, `IE-KNW-TECH-DEC-001@0.6` and `IE-ARC-TECH-VIEW-001@0.2` | `APPROVED` |

The concise `SPEC-001@0.14` working brief was already stale against the 87-requirement normative
SRS and was not the Spec authority used by the final management presentation. The approved Spec
decision is therefore pinned to `DOC-04@0.13`, not inferred from the older 74-requirement summary.

## 2. Content hashes

| Item | SHA-256 at approval baseline |
|---|---|
| Final management-review presentation | `C4395BCCB4B654DC96DAB27C27FB09E8203CFBE72FF1360343D75C24E58BEE2C` |
| Management-review source map | `FCCED5F4D660B23E042ECC5D7410530CBDDF48BFBFFD52A885632B7C79E443D3` |
| `FEATURE-001@0.12` | `7EA54E945F8DD110BE73485EBD697FDDAB58DFC34912C8055FA1691DD71A461B` |
| `DOC-04@0.13` | `8776A83B5BDD2B27AE5164CFFACC84DC1C82D3250AD666376BC965AD22A9AA3D` |
| `TECH-001@0.14` | `D87934ABFBBD475F3EDBA8E345D5B39120CD597F67D82A16057FBA7D77E96FEA` |
| `IE-KNW-TECH-DEC-001@0.6` | `4C50E83C1B57FF17127A2AAC4E502FE1E1D4D85EC45EF1D187FA00CB0C864166` |
| `IE-ARC-TECH-VIEW-001@0.2` | `38E66FE86A864BE85AB6139C17877C1DF5322EA17C5D575772FF7FF341B256D0` |

Hashes identify the reviewed content; they do not by themselves prove that a decision occurred.
The decision evidence is the project user's contemporaneous report recorded in the control envelope.

## 3. Preserved boundaries

This Product Decision Authority approval does **not** relabel any separate evidence or gate:

- Q-01…Q-14 remain `NOT-RUN`.
- Q-15 remains `PARTIAL / NO WINNER`; Flutter remains a qualified alternative behind the recorded
  reopen triggers.
- The Format Worker boundary/profile contract remains selected, while the exact Worker
  runtime/toolchain qualification remains `NOT-RUN`.
- Product verification procedures and operational qualification remain at their recorded states.
- Independent requirements, architecture, security, data, format, HCD/accessibility, language and
  operations reviews remain separate where the applicable gate requires them.
- PG3 and PG4 remain `NOT-RUN`; this approval does not authorize production implementation,
  production deployment, infrastructure purchase or a rollout claim.

## 4. Controlled follow-up

1. Produce successor `Approved 1.0` management renditions that carry this decision and pin the
   exact approved sources; do not rewrite the historical presentation or its source map.
2. Refresh the stale Feature and Spec summaries without changing the approved 14 Feature groups or
   the 87 approved requirement rows unless a successor decision is raised.
3. Continue qualification, specialist review and gate work without treating this approval as test
   evidence.
4. Any change to the approved scope, requirement obligation or selected Tech baseline requires an
   impact assessment and a successor Product Decision Authority disposition.
