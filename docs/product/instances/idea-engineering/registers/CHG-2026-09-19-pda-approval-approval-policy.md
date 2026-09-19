# Product Decision Authority Approval — Approval Policy Self-Approval Successor

## Control envelope

| Field | Recorded value |
|---|---|
| Stable Supporting Record ID | `IE-CHG-PDA-APPROVAL-002` |
| Supporting Class / Version | `CHG` / `Draft 0.1` record |
| Decision date | 19-09-2026 |
| Decision authority | Product Decision Authority — project boss |
| Decision reported by | Project user; meeting included the project user, project manager and Product Decision Authority |
| Applicable baseline | Git commit `e063df9` (`docs: record policy-controlled self-approval model`) |
| Evidence class | User-reported management decision; no separately signed minutes supplied |
| Access / retention | `INTERNAL`; retain with the affected successor sources and predecessor approval record |

## Decision

The Product Decision Authority approved the **Approval Policy self-approval successor correction**
recorded in [`IE-CHG-APPROVAL-POLICY-001`](CHG-2026-09-19-approval-policy-self-approval.md):

1. RBAC determines whether an actor is eligible for `Approve` at the applicable Scope.
2. A versioned Approval Policy determines whether self-approval is allowed.
3. `AllowSelfApproval` is disabled by default and may be enabled only in a governed policy version.
4. A policy requiring an independent approver still blocks self-only approval, even if another
   applicable policy permits self-approval.
5. `Release` remains a separate Permission and policy decision.
6. The exact Workflow Definition Version and Approval Policy Version are pinned to each Review Round;
   Audit distinguishes self-approval from independent approval.

This approval accepts the successor policy correction only. It does not approve unqualified runtime
behavior, implementation, verification results, the remaining Vault-transfer successor content, the
Technology Stack, Q-15, Product Scope, PG3 or PG4.

## Scope and source pins

| Source | Version | SHA-256 at decision baseline |
|---|---:|---|
| `DOC-04-software-requirements-specification.md` | 0.15 | `0B9A1B183CA8B17350BFB233CF0359546462292AB79878114A6F1C149480133E` |
| `DOC-05-architecture-description.md` | 0.22 | `6290B836D118CF1475B7B8A05DB070502DFDAFCB1E825B433E60F73013AE172A` |
| `DOC-06-data-integration-and-migration-specification.md` | 0.18 | `D35CC3F93BC4BCBBBECF5CB96D20F540A24A4EAD9580B8D97E7B6E9F02AF72F3` |
| `SPEC-001-product-specification.md` | 0.15 | `CFA84C65A3568CABCCA806147EF18E1870F81A5DD13E7E2E9A194F6A55EB8235` |
| `VVP-core-v0-verification-validation-plan.md` | 0.18 | `B9104AA279B322EBE16F6FAED29CA3D4F3320CED7429AAEDC164CDAB407CB061` |

## Preserved decisions and open status

| Item | Status after this decision |
|---|---|
| 14 Feature groups | Unchanged; predecessor approval retained |
| Approved predecessor Feature/Spec/Tech baseline | Preserved; not overwritten |
| Tech Stack and Q-15 | Unchanged (`Q-15 = PARTIAL / NO WINNER`) |
| Product Scope | Unchanged |
| Runtime implementation and VVP procedures | `NOT-RUN` |
| PG3 / PG4 | Unchanged; not advanced by this approval |
| Remaining successor content | Requires its own review/approval where applicable |

## Record limitation

This record is based on the project user's report of the management decision. If the company later
requires signed minutes or an approval-system event, that evidence shall be linked as a successor
record without changing the decision scope recorded here.
