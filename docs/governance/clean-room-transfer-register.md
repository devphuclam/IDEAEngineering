# IDEA Engineering Clean-Room Knowledge Transfer Register

| Field | Value |
|---|---|
| Document ID | `IE-GOV-CLR-001` |
| Status | Accepted baseline |
| Effective date | 2026-08-27 |
| System of interest | `C1 — IDEA Engineering` |
| Decision authority | Product Owner |
| Source repository | Controlled research workspace outside this product repository |
| Transfer objective | Preserve classified, reviewed learning without copying competitor implementation or proprietary evidence |

## 1. Transfer rule

IDEA Engineering accepts independently authored product knowledge, not competitor implementation material. Every transferred conclusion must preserve its evidence class and point to a fixed source artifact hash. The approved DDM objective makes an evidenced externally observable DDM behavior a default coverage candidate, and the Aras Quality Benchmark may motivate an improvement; neither bypasses the controlled IDEA requirement or decision record with rationale, acceptance criterion, and verification method.

The permitted chain is:

```text
Authorized source artifact + SHA-256
  → classified atomic finding
  → IDEA design lesson
  → accepted decision or stakeholder-backed requirement
  → architecture/change
  → verification evidence
```

## 2. Evidence classes

| Class | Meaning | Permitted use |
|---|---|---|
| `TARGET-RUNTIME FACT` | Direct, reproducible observation of an identified runtime/build/configuration under recorded test conditions | Describe only that target and test scope |
| `TARGET-STATIC FACT` | Direct observation of an authorized package, binary, configuration, schema catalogue, or offline export | Describe static presence; not runtime enforcement |
| `VENDOR-PUBLIC` | First-party vendor statement, tutorial, release material, or public UI demonstration | Establish what the vendor published or demonstrated |
| `INFERENCE` | Bounded interpretation supported by named facts but not directly observed | Form a falsifiable design question or risk |
| `UNKNOWN` | Available evidence cannot answer the atomic question | Preserve the gap and resolution path |
| `BOUNDARY` | Explicit statement of what named evidence does not establish | Prevent a scoped observation from becoming a broader claim |
| `BLOCKED` | Verification cannot proceed under current access, authorization, license, safety, or environment constraints | Record prerequisite and owner; never report PASS/FAIL |
| `IDEA DECISION` | Product choice accepted for IDEA after considering needs, risks, alternatives, and standards | Control architecture and implementation |
| `IDEA REQUIREMENT` | Stakeholder-backed, uniquely identified, verifiable obligation | Drive acceptance and traceability |

Absence from public material is `UNKNOWN`, never proof of absence. A visible UI control proves the displayed interaction only; it does not prove server enforcement, transactionality, security, persistence, or performance.

## 3. Fixed source artifact ledger

Paths below are relative to the external research repository. The product repository does not require that machine-local location at build or runtime.

| Source ID | External source path | SHA-256 | Admissible transfer |
|---|---|---|---|
| `RS-DOM-001` | `CONTEXT.md` | `FBC525EEFA37525EF604ED16AADA24EB048F839D45D793BAF34AAEA69CAD5004` | Canonical product terminology after product review |
| `RS-ICV-KB-001` | `icVault_Knowledge_Base_CANONICAL_2026-08-07.md` | `6D73923ABAF3AFC057F401514C4C5B16849ADBCB0332061CC0CDC568C2BC3C83` | Classified observations, limitations, and design lessons |
| `RS-DDM-BL-001` | `Audit/DDM/DDM_Reverse_Engineering_Baseline_20260826.md` | `83E2B662BE0408757A475128F3C629570EC7C86972F4271FFC6F6BEFA3262DB2` | Vendor-public propositions, unknowns, audit gates, and design lessons |
| `RS-ARC-001` | `docs/superpowers/specs/2026-08-26-idea-pdm-to-platform-architecture-design.md` | `EA477E3257E9B43222EC7EE2D34520449041E2385BFFCA7CBEFC49BF9579E78A` | Accepted IDEA architecture content |
| `RS-ROADMAP-001` | `docs/process/2026-08-26-idea-pdm-software-delivery-roadmap.md` | `9A90BC8C4644CF41421D0BBEDEE86BB5184C2DB7FE14E12D43004894296EC5D6` | Delivery sequencing and discovery gates |
| `RS-STD-001` | `References/IDEA_Engineering_Standards_Governance_Baseline_20260826.md` | `90DBDA52D782C2BDF9CB8E638CB99A88521003FD9015B55C30A804BC00A17DBD` | Standards applicability conclusions; normative clauses remain external |
| `RS-ADR-001` | `docs/adr/0001-c1-pdm-to-plm-and-d-after-c2.md` | `82AE3F6A4F5FA9546355EDA3A814E0974EC39E3E47C4C7C006EFDEE826AF3FBC` | C1/D evolution decision |
| `RS-ADR-002` | `docs/adr/0002-no-code-inside-design-tools.md` | `9C57BA5634538BBB3D61EA6478AE41DDFB676B9750AE60D9CBC6C6CC3D4975B7` | External design-tool integration decision |
| `RS-ADR-003` | `docs/adr/0003-modular-monolith-with-deep-module-boundaries.md` | `5B102BA4DF8D17F5D0C0FEE3FCABD22B9B8D26C0472F2989390F2477772B2E4A` | Initial C1 module/deployment decision |
| `RS-ADR-004` | `docs/adr/0004-immutable-generation-and-atomic-change-set.md` | `945C4B0480E8B2C9CEB50A28CDAD2ECCB11189224E7609C451E71577A6EE357D` | Generation and Check-in atomicity decision |
| `RS-ADR-005` | `docs/adr/0005-document-workspace-reservation-and-optimistic-concurrency.md` | `5C95D3A74609612B8C47F10E02EDB19D4F2C8700C8770F4B9260498388AA79C7` | Reservation/concurrency decision |
| `RS-ADR-006` | `docs/adr/0006-generic-format-baseline-and-external-format-intelligence.md` | `95062B87566708B58E3BDF11CF43AA940C0A13EEE98244D18C7D77E9C44B57CB` | Format capability decision |

If a source file's hash changes, the new version is a new controlled input. Product conclusions do not silently follow the mutable external file.

## 4. Product destination map

| Product artifact | Purpose | Source IDs |
|---|---|---|
| `CONTEXT.md` | Canonical domain language | `RS-DOM-001`, `RS-ARC-001` |
| `docs/product/knowledge/icvault-observed-behavior.md` | Sanitized target-runtime/static findings and limitations | `RS-ICV-KB-001` |
| `docs/product/knowledge/ddm-vendor-public-baseline.md` | First-party public propositions and target unknowns | `RS-DDM-BL-001` |
| `docs/product/knowledge/ddm-target-audit-plan.md` | Authorized package/runtime discovery matrix and exit gate | `RS-DDM-BL-001` |
| `docs/product/knowledge/idea-design-lessons.md` | Explicit evidence-to-product translation | `RS-ICV-KB-001`, `RS-DDM-BL-001`, `RS-ARC-001` |
| `docs/architecture/idea-product-lifecycle-architecture.md` | Accepted C1 architecture baseline | `RS-ARC-001`, `RS-ROADMAP-001`, `RS-STD-001` |
| `docs/adr/0002-*.md` through `docs/adr/0007-*.md` | Accepted hard-to-reverse decisions | `RS-ADR-001` through `RS-ADR-006` |
| `docs/product/knowledge/2026-08-27-ddm-acquisition-and-audit-decision.md` | Current acquisition/runtime-audit recommendation | New first-party public-source research |

Direct public-source research authored inside the product repository is controlled by its dated first-party source register and downloadable-document hashes rather than by an external research-artifact hash. The fixed-hash rule in Section 3 applies when conclusions are transferred from the external research repository.

## 5. Material excluded from the product repository

- installers, executables, libraries, decompiled output, or copied source;
- raw database contents, schema dumps, storage trees, backups, packet captures, or logs;
- credentials, connection strings, internal addresses, personal data, or customer data;
- proprietary vendor documentation or licensed media not authorized for redistribution;
- screenshots, icons, UI assets, and video frames used as raw evidence;
- machine-local caches, rendered intermediates, and duplicate archives;
- unsupported statements that erase the distinction between fact, inference, unknown, decision, and requirement.

The external research workspace remains the evidence repository. Git history is the product record of what was admitted and when.

## 6. Admission and review checklist

A transfer is complete only when:

1. the source artifact and SHA-256 are recorded;
2. each atomic claim has exactly one evidence class;
3. target build/configuration and observation limits are retained where applicable;
4. deployment-specific identifiers and sensitive details are sanitized;
5. vendor observations and IDEA decisions are stored separately;
6. requirements contain independent IDEA stakeholder rationale and verifiable acceptance;
7. local Markdown links and the repository verifier pass;
8. the Product Owner accepts the product-facing artifact.

This register records knowledge admission, not ISO conformity, unscoped or verified-complete vendor parity, or authorization to inspect or redistribute proprietary material.
