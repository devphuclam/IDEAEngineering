---
status: proposed
date: 2026-08-27
decision-id: IE-ADR-C1-008
---

# Separate operational configuration, governed policy, and solution-package paths

IDEA Engineering classifies each configurable concern into one of three governance paths rather than imposing one author-review-activate workflow on every setting.

Operational Configuration is administered in the running service by authorized Operating Organization identities. Its configuration class controls validation, audit, effective timing, and recovery; only settings explicitly classified as reversible and low impact may take effect immediately without an independent disposition.

A Governed Policy Definition has a stable identity, editable Draft content, and immutable activated versions. The policy kind defines its own eligible authors, reviewers, approvers, activation authority, quorum, and separation rules. Activation selects one exact version for new decisions or processes; retained decisions, running processes, and released evidence remain pinned to the version that governed them. Changing a Draft therefore stays flexible without permitting an active policy to reinterpret history.

A Solution Configuration Package contains changes to the delivered solution, including schema, forms, adapters, executable rules, and seeded definitions. It is source-controlled, reviewed, verified outside production, and promoted as an exact release artifact. Direct production modification is prohibited except through a time-bounded Break-Glass Configuration Change with attributable evidence, recovery, and mandatory reconciliation into the governed source.

Product Decision Authority governs product specifications, feature scope, selected technology, and product defaults. It does not become the mandatory approver for every operational setting or organization-owned policy. The Operating Organization can delegate configuration authority through its policies without requiring controlled-state modules to hard-code role names.

Provisioning identifies at least one named Bootstrap Custodian who may activate the first Access Policy. Later candidate policies are adopted only under the currently active policy or an explicit bootstrap or break-glass authority; a candidate policy cannot authorize its own adoption. Where the pilot has only one available actor, an explicit Single-Actor Governance Exception may permit necessary role overlap, but the resulting evidence is not independent approval.

## Consequences

- Every configurable concern declares exactly one Configuration Governance Class and the evidence needed to change or activate it.
- The seeded classification treats personal preferences, locale, and non-authoritative notifications as reversible Operational Configuration; identity and group membership remain sensitive Operational Configuration requiring reason and audit; access, approval, workflow, revision, retention, numbering, metadata, format-capability, and release rules are Governed Policy Definitions; schema, forms, adapters, executable rules, and product seed changes are Solution Configuration Packages.
- The Operating Organization may strengthen the governance path for a concern but cannot silently reclassify it into a weaker path than the product permits.
- Harmless, reversible operational changes avoid a full solution-release pipeline.
- Access, approval, workflow, revision, retention, numbering, metadata, format-capability, and release policies use immutable activated versions where retained behavior must remain explainable.
- Running processes and retained evidence never follow a floating latest policy.
- Solution changes are reproducible from reviewed source and non-production verification rather than existing only as live database state.
- Emergency production changes remain possible but are conspicuous, temporary, recoverable, and reconciled.
- The authorization model must bootstrap an accountable organization owner and narrowly controlled emergency authority without allowing a policy to silently grant itself broader authority.
- Configuration import or merge is not treated as atomic activation or rollback; deployment and recovery evidence remain explicit.
- Detailed break-glass interaction, authentication, custodian, expiry, and after-action procedures are deferred to operational design; the non-bypass, attribution, expiry, recovery, and reconciliation principles are binding now.
- Organization-configuration export/import and product-default upgrade/merge mechanics are deferred beyond MVP. Until implemented, no import or product update may silently activate configuration or mutate an organization's active policy.
- This proposal is informed by [configuration-governance research](../research/2026-08-27-aras-configuration-governance.md), but the decision and resulting product documents use IDEA terminology and independently verifiable requirements.
- This ADR remains Proposed until the Product Decision Authority reviews the configuration boundary and its seeded defaults.
