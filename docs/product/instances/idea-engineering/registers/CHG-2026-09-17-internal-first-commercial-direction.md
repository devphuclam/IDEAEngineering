# Internal-First and Future Commercial Direction Change

## Control envelope

| Field | Recorded value |
|---|---|
| Stable Supporting Record ID | `IE-CHG-COMMERCIAL-DIR-001` |
| Supporting class / version / status | `CHG` / `0.1` / `Draft` |
| Date | 2026-09-17 |
| Owner / author | Principal Product Author; named person attribution `BLOCKED` before `Proposed` |
| Review source | Project user accepted the recommended direction on 2026-09-17 after a two-round design interview |
| Decision authority | Current Feature/Spec/Tech approval remains with Product Decision Authority. A future Commercial Decision Authority is proposed for the boss; attributable acceptance of that additional authority is `NOT-RUN`. |
| Product normativity | Records the selected successor direction and its limits. It does not add a commercial Feature, requirement, sale authorization or current delivery task. |
| Applicable baseline | `IDEA-C1-ANALYSIS-DESIGN-001`; internal Technical Pilot baseline remains current |
| Downstream trace | DOC-01@0.7, DOC-07@0.14, `CONTEXT.md`, `IE-GOV-COMMERCIAL-001@0.1`, Kanban CARIO@0.3 and the instance catalogue |
| Evidence status | Stakeholder direction recorded; legal applicability, commercial readiness, external deployment and market validation are `NOT-RUN` |
| Access / retention | `INTERNAL`; retain with the product-definition baseline and any later commercial-readiness decision |

## 1. Decision

IDEA Engineering remains an **internal company product for the next several years**. Core v0, the
December 2026 Technical Pilot and the current Feature/Spec/Tech baseline do not include selling,
billing, subscription management, customer onboarding or a public SaaS service.

The long-term direction is nevertheless to avoid designing the product into a company-specific
dead end. A separately approved successor may later be offered commercially. That possibility is a
design constraint and governance obligation now; it is not a current revenue target or release
commitment.

The current roadmap dates, hours, milestones and Kanban cards are unchanged.

## 2. Decisions accepted for the long-term direction

| Area | Selected direction |
|---|---|
| Initial market | Vietnam-first if commercialization is later authorized; international operation requires a separate legal, localization and support assessment. |
| Initial delivery model | On-premises or private deployment first. SaaS remains a later option and is not being built now. |
| Product data | The customer remains owner or controller of its engineering data as defined by contract and applicable law; IDEA receives only the rights required to provide the agreed service. |
| Product license | Proprietary product. Third-party components, fonts, icons, SDKs and converters require recorded provenance, license review and distribution rights. |
| Reference products | Clean-room behavioral learning only. Do not copy source code, internal schema, undocumented protocol, text, screenshots, branding or proprietary assets from reference products. |
| External projects and assets | Complete the controlled source/license intake before adding a dependency, copied/adapted material or vendored project. No license means no reuse permission. |
| Current work | Preserve difficult-to-retrofit foundations only. Do not create a separate commercial implementation stream during the internal stage. |
| License activation | Keep a future entitlement boundary, but defer the mechanism. The preferred future direction is offline-capable signed licensing or manual activation, with no kill switch or mandatory phone-home. |
| Telemetry | No hidden transfer of product or customer data. Future telemetry and support bundles must be explicit, reviewable, redactable and auditable. |
| Customer variation | Maintain one product codebase. Use governed configuration, policy, adapters and extension contracts instead of permanent customer source forks. |
| Product name | `IDEA DDM` remains an internal working name until trademark, name and domain clearance are completed. |

## 3. Governance separation

| Authority / role | Responsibility | Current state |
|---|---|---|
| Product Decision Authority | Continues to decide Feature, Spec and Tech. | Existing role; approved predecessor remains unchanged. |
| Commercial Decision Authority | Decides whether IDEA may enter an external pilot, be offered or be sold. | Boss proposed; attributable acceptance `NOT-RUN`. |
| Legal Review Authority | Decides legal applicability and accepts the legal package; engineering does not self-certify legal compliance. | `BLOCKED`: not assigned. |
| Security / Operations Authority | Accepts the external operating boundary, support model, security risk and recoverability evidence. | `BLOCKED`: not assigned for an external deployment. |
| Commercial Readiness Coordinator | Maintains the readiness register and prepares evidence; cannot approve its own legal or commercial conclusions. | Project user selected as interim coordinator. |

The same person may later hold more than one role only through an explicit company assignment. The
roles remain separate in records so that authorship, advice and approval are not confused.

## 4. Effect on controlled sources

| Source | Effect |
|---|---|
| DOC-01 | Records an internal-first purpose and a deferred commercial trajectory. Current internal scope remains explicit. |
| DOC-07 | Changes only the claim boundary and route to the readiness register. No schedule, effort, milestone or implementation authorization changes. |
| Kanban CARIO | Adds one cross-cutting guardrail section and no card, hour, dependency, date or milestone. |
| Feature / Spec / Tech briefs | No content change. The exact Product Decision Authority approval already recorded remains pinned to its reviewed baseline. |
| DOC-03 / DOC-04 | No new business or software requirement is created. Commercial capabilities require a future approved successor. |
| Architecture / technology | No stack, topology, Q-15 result, PG3 or PG4 state changes. Future safeguards are applied when related code or design is touched. |
| Commercial readiness | `IE-GOV-COMMERCIAL-001` separates safeguards needed now from work deferred until an external trigger occurs. |

## 5. Non-effects

This record does **not**:

- claim that IDEA is commercially ready;
- authorize external installation, external data processing, marketing or sale;
- create a delivery date for a commercial edition;
- establish legal advice or a compliance certification;
- add billing, licensing enforcement, SaaS tenancy, marketplace or customer-support features to
  Core v0;
- change the current Tech Stack, Q-15, Product Scope of the Technical Pilot, Product Decision
  Authority approval, PG3 or PG4.
