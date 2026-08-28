---
status: proposed
date: 2026-08-27
decision-id: IE-ADR-C1-007
---

# Use DDM as the behavioral baseline and Aras as the quality benchmark

IDEA Engineering uses lawfully available official or authorized DDM evidence as the default behavioral baseline for its PDM and PLM capabilities, workflows, and user-visible semantics. An evidenced DDM behavior enters coverage as `ADOPT` unless an approved decision records `ADAPT`, `ADAPT-ARAS`, `DEFER`, or `EXCLUDE`. Official Aras Innovator material is examined proactively for stronger patterns and is also the first fallback when DDM evidence is silent, ambiguous, version-bound beyond useful interpretation, or otherwise insufficient.

An evidenced Aras advantage does not automatically replace DDM behavior. The comparison records the DDM limitation, Aras advantage, stakeholder effect, risk, and proposed IDEA behavior; a material `ADAPT-ARAS` requires Product Decision Authority approval. If neither source establishes a behavior, it remains `UNKNOWN` until an independently justified and verifiable IDEA decision resolves it.

This strategy applies to externally observable capability and behavior. It does not authorize copying source code, binaries, database schemas, undocumented protocols, visual assets, proprietary documentation, trademarks, or internal implementation. Accepted IDEA invariants, standards applicability, security and safety controls, accessibility, Organizational Isolation, lawful-access limits, and objective verification evidence may require an explicit divergence. Complete DDM behavioral parity cannot be claimed without an identified target version, edition, configuration, lawful evidence scope, and objective coverage results.

## Consequences

- Each comparison records the exact product, source, edition or date, evidence class, demonstrated behavior, limitation, and Behavioral Coverage Disposition.
- Each material product area evaluates both the DDM Reference Baseline and applicable Aras Quality Benchmark; Aras review is not postponed until a DDM gap appears.
- Each question is still marked `DDM EVIDENCED`, `DDM AMBIGUOUS`, or `DDM UNKNOWN`; evidence class and product disposition remain separate.
- Every IDEA requirement needs a stable identity, source trace, product rationale, acceptance criterion, and verification method. The approved DDM parity objective supplies product rationale but does not erase requirement control.
- Differences introduced from Aras or to preserve immutable Generations, exact release baselines, organizational isolation, accessibility, security, reliability, or maintainability are explicit decisions rather than hidden divergences.
- MVP may defer evidenced DDM capability, but each deferral remains visible in the coverage register and does not erase the long-term target.
- Aras names, citations, and comparisons remain in supporting research, the comparison register, and governance records. DOC-01 through DOC-08 express only approved IDEA needs, requirements, behavior, design, and decisions using IDEA product language; they do not name Aras or present competitor comparison as product-definition content.
- This ADR remains Proposed until the Product Decision Authority reviews the exact baseline.

## First application: workflow and approval configuration

The first recorded application is in [DDM-first workflow and approval-policy research](../research/2026-08-27-ddm-first-workflow-approval-policy.md). It primarily demonstrates the fallback path; future product-area reviews also compare Aras proactively for superior patterns:

- DDM directly evidences a graphical, no-code workflow tool whose supplied workflows can be adapted to customer requirements. IDEA therefore includes a Graphical Workflow Designer in MVP scope while independently designing its interface and model.
- DDM does not establish what a definition change does to running work. Aras evidences process creation and assignment from a selected definition, so IDEA activates immutable Workflow Definition Versions for new instances; running instances remain pinned, and migration is separate, previewed, authorized, and audited.
- Neither reference establishes a universal self-approval rule. IDEA seeds an independently governed default: the author or editor cannot approve or release the same Revision, one independent approver is required, and that approver may also release. The rule remains replaceable through a validated organization-owned Approval Policy Version.
- DDM does not establish the empty-role outcome; Aras requires workflow roles to be populated. IDEA fails closed when a required actor cannot be resolved and identifies the configuration defect for administrator repair.
- Public DDM and Aras evidence does not establish the company's required policy boundary. IDEA scopes mutable workflow and approval policy versions to the Operating Organization because Organizational Isolation has priority over competitor behavior; this does not make IDEA a commercial multi-customer service.
