# IDEA Engineering Future Commercial Readiness Register

> **How to read this record:** IDEA Engineering is internal-only for the foreseeable product
> horizon. This register prevents avoidable legal and architectural debt; it is not a commercial
> roadmap, legal opinion, compliance certificate or permission to sell.

## Control envelope

| Field | Recorded value |
|---|---|
| Stable Supporting Record ID | `IE-GOV-COMMERCIAL-001` |
| Supporting class / version / status | `GOV` / `0.1` / `Draft` |
| Date / legal-source check | 2026-09-17 |
| Owner | Commercial Readiness Coordinator; project user is the interim holder |
| Reviewers | Legal Review Authority `BLOCKED`; Security / Operations Authority `BLOCKED` for external deployment |
| Approver | Commercial Decision Authority proposed for the boss; attributable acceptance `NOT-RUN` |
| Current product stage | Internal analysis, design and Technical Pilot preparation |
| Commercial horizon | Several years away; no target date or external release commitment |
| Source decision | [IE-CHG-COMMERCIAL-DIR-001](CHG-2026-09-17-internal-first-commercial-direction.md) |
| Evidence status | Direction recorded; all external-use, legal, market and commercial-gate results are `NOT-RUN` |
| Access / retention | `INTERNAL`; review on each material product-boundary change and before any external trigger |

## 1. Current rule

The current product is built and verified for company use. Work required only for selling the
product is deferred. When current implementation work touches an area that is expensive to replace,
the safeguards in section 2 apply so the product can later be assessed without a complete rewrite.

Three statements must remain separate:

1. **Internal use now** — the only current operating purpose.
2. **Commercially extendable design** — a long-term constraint, not proof of readiness.
3. **Commercial authorization** — a future decision that cannot occur before the gate in section 4.

## 2. Safeguards applied during the internal years

| ID | Safeguard | Practical rule now | Evidence expected over time |
|---|---|---|---|
| `CR-NOW-01` | Clean-room development | Learn observable behavior and public concepts; do not copy proprietary implementation material or branding. | Source/provenance note for material references and imported assets. |
| `CR-NOW-02` | Third-party component control | Complete the [external-source intake](../../../../agents/external-source-intake.md) before importing a dependency, copied/adapted material or vendored project. Public availability is not reuse permission; missing or incompatible rights keep the source reference-only or blocked. | Reproducible source identity, license disposition, obligations, dependency inventory, required notices and later SBOM. |
| `CR-NOW-03` | Company-neutral configuration | Do not hard-code named people, departments, one customer workflow or one site into executable policy. | Configuration tests and review of seeded data. |
| `CR-NOW-04` | Organization and Project isolation | Preserve explicit ownership and authorization scope even though the first deployment has one Operating Organization. | Negative isolation tests; no claim of SaaS multi-tenancy. |
| `CR-NOW-05` | Data portability | Keep authoritative metadata, file digests, relationships and release evidence exportable and restorable through a governed format. | Export/restore contract and repeatable drill. |
| `CR-NOW-06` | Deployment separation | Keep product configuration, identity, Artifact custody and site-specific infrastructure replaceable through defined boundaries. | Deployment/configuration description and adapter contracts. |
| `CR-NOW-07` | One maintained product | Customer or department variation uses configuration, policies, adapters or reviewed extensions instead of permanent source forks. | Extension/configuration ownership rules. |
| `CR-NOW-08` | Controlled updates | Schema and stored-data changes need migration, compatibility and rollback treatment. | Versioned migration and rollback evidence. |
| `CR-NOW-09` | No hidden outbound data | Logs remain within the approved deployment by default. A future support bundle or telemetry path must be explicit, inspectable, redactable and attributable. | Data-flow view, configuration and audit evidence. |
| `CR-NOW-10` | Evidence-bound claims | Do not promise security, compatibility, performance, availability, RPO/RTO or regulatory compliance beyond verified evidence. | Claim-to-evidence register and named accepting authority. |
| `CR-NOW-11` | Future license seam | Product capability and data access must not depend on a hard-coded commercial scheme. Exact entitlement enforcement remains deferred. | Architecture boundary only; runtime/tool choice `NOT-RUN`. |
| `CR-NOW-12` | Customer-controlled exit | Avoid storage or identity decisions that make a future customer unable to retrieve its governed data and evidence. | Export, handover, retention and verified deletion procedure before sale. |

These safeguards are cross-cutting acceptance considerations when the related area is implemented;
they are not twelve extra 2026 work packages.

### 2.1 External-source decision boundary

Cloning a third-party repository to inspect public behavior does not authorize copying from it.
Source, documentation, examples, icons, fonts, media, data, models, SDKs and converters may carry
different terms. Before any of that material enters IDEA, the intake record must pin the exact
source state, actual license/notice files, intended use, distribution model, obligations and one
disposition: `APPROVED`, `APPROVED-WITH-OBLIGATIONS`, `BLOCKED-LEGAL` or `REJECTED`.

No-license, unclear-license, custom-license, non-commercial, source-disclosure/network-copyleft or
redistribution-limited cases require Legal Review for the intended use. Internal use today does not
establish the right to distribute a commercial product later.

## 3. Work explicitly deferred

| Deferred area | Why it is not built now | Reopen trigger |
|---|---|---|
| Pricing, quotations, billing, subscription and payment | No current external buyer or revenue objective. | Approved commercial business model. |
| License server, metering and online activation | Premature mechanism choice would add operational and privacy burden. | Approved licensing model and Legal/Security review. |
| Public SaaS control plane and tenant operations | First direction is on-premises/private deployment; SaaS is not current scope. | Separate Feature/Spec/Tech decision. |
| Customer self-service portal and marketplace | No approved customer journey or support model. | External product plan and named owner. |
| Commercial contract, EULA, DPA and SLA | Terms depend on offering, data roles, support coverage and verified service levels. | Before any external pilot agreement or offer. |
| Trademark filing and external brand launch | Working name is not cleared for market use. | Before public naming, promotion or domain commitment. |
| International sale | Jurisdiction, export, tax, language, privacy and support duties are unassessed. | Separately approved target country. |

## 4. Commercial Readiness Gate

### 4.1 Trigger

The gate must open before the earliest of these events:

- IDEA is installed for an organization outside the company;
- external engineering or personal data is received;
- a product offer, quotation, contract, paid pilot or public commercial claim is made;
- an external party receives production software, credentials or support access;
- the product name is publicly launched for sale.

An internal demo using sanitized data does not pass this gate and must not be described as an
external pilot.

### 4.2 Required exit evidence

| Gate item | Required outcome | Owner / authority | Current state |
|---|---|---|---|
| `CR-GATE-01` | Commercial Decision Authority and accountable product owner accept an exact offering and market boundary. | Commercial Decision Authority | `BLOCKED`: authority acceptance not recorded |
| `CR-GATE-02` | Company ownership and contributor chain-of-title for source, documents, visuals and brand assets are evidenced. | Legal Review Authority | `BLOCKED`: authority not assigned |
| `CR-GATE-03` | Product name, trademark and domain risks are cleared for the intended market. | Legal / commercial owner | `NOT-RUN` |
| `CR-GATE-04` | Third-party inventory, SBOM, license notices and commercial redistribution rights are accepted, including CAD/Office SDKs and converters. | Legal Review Authority + Engineering | `NOT-RUN` |
| `CR-GATE-05` | Data roles, permitted processing, location, retention, backup, support access, export, return and deletion are contractually and technically defined. | Legal + Security / Operations | `NOT-RUN` |
| `CR-GATE-06` | Threat model, vulnerability intake, supported-version policy, security advisory and incident-response process are operational. | Security / Operations Authority | `NOT-RUN` |
| `CR-GATE-07` | Installation, upgrade, migration, rollback, backup, restore and customer offboarding are demonstrated on the offered deployment model. | Engineering + Operations | `NOT-RUN` |
| `CR-GATE-08` | Compatibility and performance claims are bounded by supported configurations and reproducible evidence. | Product Decision Authority + Engineering | `NOT-RUN` |
| `CR-GATE-09` | Support hours, escalation, maintenance period, end-of-support and any SLA are backed by real staffing and measured capability. | Commercial + Operations authorities | `NOT-RUN` |
| `CR-GATE-10` | Contract set, warranty/limitation positions, DPA where applicable, pricing/tax/invoicing route and customer acceptance process are approved. | Commercial + Legal authorities | `NOT-RUN` |
| `CR-GATE-11` | Product can operate without hidden telemetry or mandatory Internet access; any license/telemetry behavior is disclosed and tested. | Product + Legal + Security authorities | `NOT-RUN` |
| `CR-GATE-12` | A release manifest pins source, binaries, SBOM, configuration, known limitations and approval evidence for the external build. | Product Decision Authority + Release owner | `NOT-RUN` |

No single technical test can replace this gate. Failure to assign the required authority is a
`BLOCKED` result, not permission to proceed informally.

## 5. Vietnam legal watchlist

This list identifies subjects that may affect a future offering. It does not decide applicability
or state that the product complies. The Legal Review Authority must confirm the then-current text,
scope and required actions before any external trigger.

| Subject | Primary source checked on 2026-09-17 | Why it is tracked | Current disposition |
|---|---|---|---|
| Personal data | [Law on Personal Data Protection 91/2025/QH15](https://vbpl.vn/TW/Pages/ivbpq-toanvan.aspx?ItemID=179252&Keyword=), effective 2026-01-01; [Decree 356/2025/NĐ-CP](https://vbpl.vn/TW/Pages/vbpq-toanvan.aspx?ItemID=187276), effective 2026-01-01 | Accounts, identities, Audit events and support records may contain personal data. | `TRACK`; applicability and processing roles `NOT-RUN` |
| Data governance | [Data Law 60/2024/QH15](https://vbpl.vn/TW/Pages/ivbpq-toanvan.aspx?ItemID=174877), effective 2025-07-01 | The product stores and processes digital engineering data; future service and transfer models require review. | `TRACK`; legal assessment `NOT-RUN` |
| Cybersecurity | [Cybersecurity Law 116/2025/QH15](https://vbpl.vn/TW/Pages/ivbpq-toanvan.aspx?ItemID=187039), effective 2026-07-01 | External operation creates system-owner, protection and incident-handling questions. | `TRACK`; system classification and obligations `NOT-RUN` |
| Electronic records and transactions | [Law on Electronic Transactions 20/2023/QH15](https://vbpl.vn/thanhtrachinhphu/Pages/vbpq-print.aspx?ItemID=165913), effective 2024-07-01 | Review, approval, release evidence and later contracting may rely on electronic records. | `TRACK`; evidentiary and signature requirements `NOT-RUN` |
| Software copyright and intellectual property | Current Intellectual Property Law and implementing instruments, including [Decree 17/2023/NĐ-CP](https://vbpl.vn/TW/Pages/vbpq-toanvan.aspx?ItemID=160235&Keyword=); the law changed again before this record and must be rechecked at the gate | Source ownership, reference-product boundaries, third-party packages, documentation, icons, fonts and branding. | `TRACK`; chain-of-title and current-law review `NOT-RUN` |
| Customer and contract duties | [Law on Protection of Consumers' Rights 19/2023/QH15](https://vbpl.vn/bokehoachvadautu/Pages/vbpq-toanvan.aspx?ItemID=161263), effective 2024-07-01, plus the law governing the selected B2B offering | Applicability depends on customer type and offering; terms and claims cannot be assumed from a technical design. | `TRACK`; applicability `NOT-RUN` |

The watchlist must be refreshed when the gate opens. A stale legal link or an Engineering
interpretation cannot be used as legal approval.

## 6. Terms used in this register

| Term | Meaning here |
|---|---|
| Internal-first | Internal operation is the present purpose and delivery priority. |
| Commercially extendable | Design choices avoid unnecessary barriers to a later assessed offering; it does not mean commercially ready. |
| External pilot | Any installation, data processing or evaluated use for an organization outside the company. |
| SBOM | Software Bill of Materials: an identified inventory of software components and relevant versions. |
| Chain of title | Evidence showing how the company obtained the rights needed to own, modify and distribute the product material. |
| DPA | Data Processing Agreement: a contract allocating personal-data processing duties where applicable. |
| SLA | Service Level Agreement: an accepted service commitment supported by measurable capability. |
| Telemetry | Product-generated operational or usage information transmitted outside the approved deployment boundary. |
| Kill switch | A remote mechanism that disables customer use. This is not the selected direction. |
