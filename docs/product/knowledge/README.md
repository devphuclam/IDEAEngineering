# IDEA Engineering Product Knowledge

This directory contains product-facing knowledge admitted from controlled icVault/DDM research. It is an input to IDEA decisions; it is not a competitor implementation archive, parity specification, or substitute for stakeholder requirements.

## Route by question

| Question | Read |
|---|---|
| What does an IDEA domain term mean? | [Root domain language](../../../CONTEXT.md) |
| What was directly observed in the identified icVault environment? | [icVault observed behavior](icvault-observed-behavior.md) |
| What has DDM publicly claimed or demonstrated? | [DDM vendor-public baseline](ddm-vendor-public-baseline.md) |
| Is a DDM package/runtime audit still needed? | [DDM acquisition and audit decision](2026-08-27-ddm-acquisition-and-audit-decision.md) |
| What must an authorized DDM target audit test? | [DDM target audit plan](ddm-target-audit-plan.md) |
| Which product lessons were accepted from the research? | [IDEA design lessons](idea-design-lessons.md) |
| What architecture applies those lessons? | [IDEA product lifecycle architecture](../../architecture/idea-product-lifecycle-architecture.md) |
| Where did an admitted conclusion come from? | [Clean-room transfer register](../../governance/clean-room-transfer-register.md) |
| Which standards and editions govern the work? | [Standards register](../../governance/standards-register.md) |

## Reading rules

1. Preserve the evidence class attached to every claim.
2. Scope icVault facts to the identified audited deployment and recorded tests.
3. Scope DDM public claims to the cited vendor material, date, release wording, and demonstrated UI.
4. Treat `UNKNOWN` and `BLOCKED` as visible outcomes, not missing documentation to fill by assumption.
5. Use [IDEA design lessons](idea-design-lessons.md) to cross the evidence-to-product seam.
6. Create an IDEA requirement only from a stakeholder need with its own rationale, acceptance criterion, and verification method.
7. Resolve conflicts in favor of newer controlled evidence only after recording the new source hash and supersession.

## Coverage snapshot

As of 2026-08-27, the admitted baseline covers:

| Area | Controlled coverage |
|---|---|
| icVault | 9 topology claims, 8 identity/version claims, all 22 Checkout/Reference/Check-in scenarios, structure/workflow/metadata, storage/security/recovery, unknowns, and prohibited overclaims |
| DDM public evidence | 16 first-party propositions, 10 target-unknown groups, 8 public-source contradiction classes, and explicit tutorial limits |
| DDM future target audit | 24 ranked questions with entry, legal/safety, evidence-output, stop, and exit gates |
| IDEA translation | 21 accepted design lessons, 20 core invariants, 11 baseline quality scenarios, and 6 product ADRs |

“Complete” here means that the product-relevant conclusions admitted from the fixed source artifacts
are represented and bounded. It does not mean every raw screenshot, trace, database row, tutorial
frame, or competitor implementation detail has been copied into the product repository.

## Sources of truth

- Product terminology: `CONTEXT.md`.
- Accepted architecture: `docs/architecture/` and accepted ADRs.
- Product standards editions: `docs/governance/standards-register.md`.
- Admitted research provenance: `docs/governance/clean-room-transfer-register.md`.
- Raw evidence and proprietary research artifacts: external controlled research workspace, never this directory.

If a knowledge document and an accepted ADR disagree, surface the conflict. A finding cannot silently override a product decision, and a decision cannot relabel evidence.
