# IDEA Engineering Product Knowledge

This directory contains product-facing knowledge admitted from controlled icVault, DDM, and Aras research. It supports IDEA's DDM Reference Baseline and Aras Quality Benchmark; it is not a competitor implementation archive or, by itself, sufficient evidence for an unscoped complete-parity claim.

## Route by question

| Question | Read |
|---|---|
| What does an IDEA domain term mean? | [Root domain language](../../../CONTEXT.md) |
| What was directly observed in the identified icVault environment? | [icVault observed behavior](icvault-observed-behavior.md) |
| What has DDM publicly claimed or demonstrated? | [DDM vendor-public baseline](ddm-vendor-public-baseline.md) |
| What DDM capabilities map to IDEA coverage and gap decisions? | [DDM capability inventory and IDEA gap matrix](2026-09-12-ddm-capability-inventory-and-idea-gap-matrix.md) |
| What technology stack is recommended for IDEA Engineering Core v0? | [Core v0 Technology Decision Matrix](2026-09-13-core-v0-technology-decision-matrix.md) — informative engineering recommendation; Product Decision Authority approval remains `NOT-RUN` |
| Does DDM have a separate administration and permission UI? | [DDM administration and permission UI evidence](2026-09-09-ddm-administration-permissions-ui-evidence.md) |
| Which Microsoft authorization patterns are useful for IDEA DDM? | [Microsoft authorization patterns for IDEA DDM](2026-09-09-microsoft-authorization-patterns-for-idea-ddm.md) |
| Does DDM demonstrate releasing one subassembly before the whole product? | [DDM staged-release evidence finding](2026-09-07-ddm-staged-release-evidence.md) |
| How does DDM handle PDF and neutral representations generated from CAD? | [DDM CAD neutral-representation evidence finding](2026-09-07-ddm-cad-neutral-representation-evidence.md) |
| How does DDM distinguish an item from its visible name and folder placement? | [DDM item, name and folder identity evidence finding](2026-09-07-ddm-item-name-folder-identity-evidence.md) |
| Is a BOM managed structure or only an Excel/PDF file? | [DDM Product Structure, BOM and export evidence finding](2026-09-07-ddm-bom-structure-representation-evidence.md) |
| Is a DDM package/runtime audit still needed? | [DDM acquisition and audit decision](2026-08-27-ddm-acquisition-and-audit-decision.md) |
| What must an authorized DDM target audit test? | [DDM target audit plan](ddm-target-audit-plan.md) |
| How are DDM baseline behavior and Aras improvements governed? | [ADR-0009](../../adr/0009-use-ddm-baseline-and-aras-quality-benchmark.md) |
| What Aras lifecycle and workflow patterns have been studied? | [Aras version/lifecycle research](../../research/2026-08-27-aras-innovator-version-lifecycle-model.md) and [workflow/approval comparison](../../research/2026-08-27-ddm-first-workflow-approval-policy.md) |
| What evidence exists for Reservation expiry, modified Reference and multi-document Check-in? | [DDM/Aras Checkout, Reference and Check-in comparison](../../research/2026-09-10-ddm-aras-checkout-reference-checkin-comparison.md) and the bounded [Aras runtime Workspace experiment](../../research/2026-09-10-aras-runtime-workspace-experiment.md) |
| Which product lessons were accepted from the research? | [IDEA design lessons](idea-design-lessons.md) |
| What architecture applies those lessons? | [IDEA product lifecycle architecture](../../architecture/idea-product-lifecycle-architecture.md) |
| Where did an admitted conclusion come from? | [Clean-room transfer register](../../governance/clean-room-transfer-register.md) |
| Which standards and editions govern the work? | [Standards register](../../governance/standards-register.md) |

## Reading rules

1. Preserve the evidence class attached to every claim.
2. Scope icVault facts to the identified audited deployment and recorded tests.
3. Scope DDM public claims to the cited vendor material, date, release wording, and demonstrated UI.
4. Scope Aras claims to the cited official edition, application, configuration context, and demonstrated behavior; an application-specific Aras pattern is not automatically platform-wide.
5. Treat `UNKNOWN` and `BLOCKED` as visible outcomes, not missing documentation to fill by assumption.
6. Use [IDEA design lessons](idea-design-lessons.md) and ADR-0009 to cross the evidence-to-product seam.
7. Record an evidenced DDM behavior as a coverage candidate, compare applicable Aras behavior proactively, and keep DDM Evidence Authority/Mode/Temporal separate from IDEA Coverage, Product Disposition, Gap Criticality, Product Priority and Gate Effect.
8. Create each IDEA requirement with a stable identity, source trace, product rationale, acceptance criterion, and verification method; the approved DDM objective does not replace requirement control.
9. Resolve conflicts in favor of newer controlled evidence only after recording the new source hash and supersession.

## Coverage snapshot

As of 2026-09-14, the admitted baseline covers:

| Area | Controlled coverage |
|---|---|
| icVault | 9 topology claims, 8 identity/version claims, all 22 Checkout/Reference/Check-in scenarios, structure/workflow/metadata, storage/security/recovery, unknowns, and prohibited overclaims |
| DDM public evidence | 16 first-party propositions, 10 target-unknown groups, 8 public-source contradiction classes, and explicit tutorial limits |
| DDM capability inventory | `IE-KNW-DDM-007@0.3`: 100 DDM-native capability rows across families A–S, with orthogonal Evidence Authority/Mode/Temporal axes, IDEA `COVERED/PARTIAL/ABSENT/UNKNOWN`, separate product disposition, gap criticality, priority, gate effect and open-point impact |
| Technology decision | `IE-KNW-TECH-DEC-001@0.5`: Linux-first Java/Temurin/Spring Server recommendation unchanged; React/WPF/WebView2 is the provisional Q-15 qualification control and Flutter Web/Windows the direct-Dart-FFI-first challenger; Core/Conditional/Deferred dependencies remain explicit; Q-01…Q-15 `NOT-RUN`, no Tech or gate approval |
| DDM future target audit | 24 ranked questions with entry, legal/safety, evidence-output, stop, and exit gates |
| Aras comparison | Official lifecycle/version and workflow/approval patterns admitted with explicit application and evidence limits |
| IDEA translation | 22 accepted design lessons, 44 core invariants, 13 baseline quality scenarios, 7 accepted product ADRs, and 1 proposed product ADR |

“Complete” here means that the product-relevant conclusions admitted from the fixed source artifacts
are represented and bounded. It does not mean full DDM behavioral coverage has been demonstrated or
that raw screenshots, traces, database rows, tutorial frames, or competitor implementation details
have been copied into the product repository.

## Sources of truth

- Product terminology: `CONTEXT.md`.
- Accepted architecture: `docs/architecture/` and accepted ADRs.
- Product standards editions: `docs/governance/standards-register.md`.
- Admitted research provenance: `docs/governance/clean-room-transfer-register.md`.
- Raw evidence and proprietary research artifacts: external controlled research workspace, never this directory.

If a knowledge document and an accepted ADR disagree, surface the conflict. A finding cannot silently override a product decision, and a decision cannot relabel evidence.
