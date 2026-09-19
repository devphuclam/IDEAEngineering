# PH0 Readiness Contracts

These contracts define how PH0 records exchange authority and evidence. They are repository document
contracts, not product APIs.

| Contract | Owns | Does not own |
|---|---|---|
| [Baseline manifest](baseline-manifest-contract.md) | Exact source identity, predecessor/successor separation and decision trace | Product behavior or approval itself |
| [Decision and evidence register](decision-and-evidence-register.md) | Open prerequisites, checks, blockers and retained evidence | Feature/Spec/Tech decisions |
| [PG4 review package](pg4-review-package.md) | Minimum pre-decision summary, evidence index and proposed successor boundary | The gate authority's decision or authorization |
| [PG4 gate record](pg4-gate-record.md) | One attributable gate outcome and exact authorization boundary | Runtime verification or whole-roadmap approval |

Every consumer must resolve exact IDs and versions. A convenient current file path is not a
substitute for a baseline pin.
