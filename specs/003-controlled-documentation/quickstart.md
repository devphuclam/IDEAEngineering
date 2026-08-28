# Quickstart: Validate the Controlled Documentation Baseline

This guide validates the documentation design for the eight core document classes. It does not
build or run a production application.

## Prerequisites

- A checkout of the `codex/controlled-documentation-baseline` branch.
- The repository-local `.specify/` integration.
- Read [`AGENTS.md`](../../AGENTS.md), [`CONTEXT.md`](../../CONTEXT.md), the
  [constitution](../../.specify/memory/constitution.md), the [standards register](../../docs/governance/standards-register.md)
  and the [clean-room register](../../docs/governance/clean-room-transfer-register.md).
- No production credentials, company-sensitive pilot data or restricted source material in the
  checkout.

## 1. Validate the plan artifacts

From the repository root:

```powershell
Get-Content -LiteralPath 'specs/003-controlled-documentation/spec.md' -Raw
Get-Content -LiteralPath 'specs/003-controlled-documentation/plan.md' -Raw
Get-Content -LiteralPath 'specs/003-controlled-documentation/data-model.md' -Raw
Get-ChildItem -LiteralPath 'specs/003-controlled-documentation/contracts' -File
git diff --check
```

Expected result: the feature contains the spec, plan, research, data model, quickstart and document
contracts; no whitespace error is reported. A clean command result does not approve the product
baseline by itself.

## 2. Validate the eight-class catalogue after templates are created

The implementation tasks will create the authoritative template directory
`docs/product/definition/`. Run:

```powershell
$catalogue = Get-Content -LiteralPath 'docs/product/definition/README.md' -Raw
$ids = [regex]::Matches($catalogue,'(?m)^\|\s*`DOC-0[1-8]`\s*\|') |
  ForEach-Object { $_.Value }
"Core class rows: $($ids.Count)"
rg -n '^\|\s*`(GOV|CLR|RSK|VVP|VEV|CMP|CHG|REL|OPS)`\s*\|' docs/product/definition
rg -n 'Aras|pricing|revenue|customer acquisition|market-share|market-fit' docs/product/definition -g 'DOC-*.md'
```

Expected result: exactly eight core rows and nine supporting rows; the last scan returns no matches
in the core templates. The competitor-name scan is scoped to `DOC-*.md`; supporting research and
GOV coverage records may contain reference-product names and comparison evidence.

## 3. Validate common control and status rules

For a representative Draft, Proposed and Approved instance, inspect the control envelope and confirm:

1. Stable ID is different from class code, path and Git commit.
2. Version follows `major.minor` and status is one of `Draft`, `Proposed`, `Approved`, `Superseded`
   or `Retired`.
3. Gate outcome is separately one of `PASS`, `PASS-WITH-ACTIONS`, `FAIL` or `BLOCKED`.
4. An approved item has no prompt/sample value and every gap has `UNKNOWN`, `BLOCKED`,
   `NOT APPLICABLE` or a controlled action with owner and resolution path.
5. `Start`/`In Work` are not used as document statuses.

## 4. Validate traceability and evidence boundaries

Walk one sample chain in both directions:

```text
Evidence → Finding/lesson → Need or Decision → Requirement
  → Architecture/interaction/ADR → Change → Verification → Release
```

Confirm that each link identifies the exact item and version/baseline. Use a reference observation
to demonstrate that `Reference-Coverage Evidence` may support a `Reference-Backed Product Hypothesis`
but cannot become `Internal Operational Need Validation` or an IDEA requirement without independent
need/decision evidence.

## 5. Validate gates and pilot claims

Prepare a small review package and verify:

- PG0–PG7 inputs and outputs are present in the gate contract;
- missing independent review or required authority records `BLOCKED`;
- `PASS-WITH-ACTIONS` actions include owner, affected baseline, due condition/date, expiry and
  escalation;
- a one-human/two-identity exercise is labeled `Single-Actor Functional Acceptance`;
- a Technical Pilot Verification without Internal Adoption Authority does not produce Internal Pilot
  Acceptance or rollout authorization;
- company-derived pilot data is referenced by approved storage metadata rather than committed to Git.

## 5a. Validate the Behavioral Coverage Register

First freeze the GOV-owned Material Coverage Inventory: assign stable material-area IDs, record its
inclusion criterion, explicit exclusions, owner, and exact as-of baseline/date. Then review the
Behavioral Coverage Register/sub-register (it is not a tenth supporting class). The register must have
exactly one record for every inventory entry at that baseline. Each record records the DDM target
version/edition/configuration, evidence and limitations, proactive applicable quality-benchmark
comparison, affected stakeholders/risks, disposition, decision owner/rationale, IDEA requirement/
decision trace, delivery increment and verification. An evidenced DDM behavior cannot be treated as a
complete `ADOPT` record until the comparison is present; every omitted evidenced behavior is visible as
`DEFER`/`EXCLUDE`, and an inaccessible or insufficient case is `UNKNOWN`/`BLOCKED`. Inventory changes
are introduced only through a `CHG` record and a new effective inventory baseline.

## 5b. Execute the Documentation Validation Pack

Create a retained pack record before interpreting percentages or time targets. Use criterion-based
stratified sampling with these minimums:

| Stratum | Minimum | Required cases |
|---|---:|---|
| Class structure | 17 | All 8 core + 9 supporting classes |
| Placement | 20 | Every class, shared-fact and non-ownership cases |
| Requirements | 8 | Functional, interface, data, quality, security/privacy, operational, accessibility, localization |
| Reference coverage | 6 | Evidenced, ambiguous, unknown, stronger-benchmark, no-stronger-pattern, restricted-evidence |
| Gate outcomes | 4 | `PASS`, `PASS-WITH-ACTIONS`, `FAIL`, `BLOCKED` |
| Surface profiles | 3 profiles + 9 locale-surface cells | Native Desktop, Web, Web-rendered Desktop; each surface in `en`, `vi`, and `ja` |
| Renditions | 4 | Current, Stale, Superseded, Withdrawn |
| Pilot/claim statuses | 6 | Canonical Demo Dataset, Technical Pilot Verification, Single-Actor Functional Acceptance, Internal Operational Need Validation, Internal Pilot Acceptance, rollout authorization |

For each item retain a stable ID, stratum, selection rationale, expected result, executed result,
exact baseline, environment, date, owner, evidence link and disposition. Do not generalize from a
convenience sample. For human walkthroughs, use the Product Decision Authority plus an intended
document consumer when both are available; record competence or `Specialist Review Gap` and whether
the participant authored/owns the material decision. The Principal Product Author may help with
usability but is not the independent approver. If the minimum reviewer, competence or population is
unavailable, record `BLOCKED` or `NOT-RUN`.

## 5c. Validate product locale profiles

In each of `DOC-04` and `DOC-08`, inspect the complete 3-by-3 Locale Profile matrix: all 9
locale-surface cells (`en`, `vi`, and `ja` × Desktop, Web, and Web-rendered Desktop). Do not collapse
the three surface profiles into one locale-only sample. Confirm that English Markdown/field vocabulary
is the controlled source, while every cell records the Localized Resource Catalogue, English fallback,
Vietnamese/Japanese review status, persisted preference, Unicode preservation and Japanese
IME/normalization/width/search/font-fallback/line-breaking evidence (or `UNKNOWN`/`BLOCKED`). Localized
DOCX/PDF is optional and never becomes the source authority.

## 6. Validate renditions

For each DOCX/PDF rendition, compare its embedded metadata with the Markdown source:

- source stable document ID;
- exact source version or immutable baseline;
- rendition date and producer identity where material;
- current/stale/superseded status;
- classification, retention and trace links.

Change the source in a controlled Draft and confirm the previous rendition becomes visibly stale or
superseded; it must not become editable authority.

## Evidence interpretation

Record each check as `PASS`, `FAIL`, `BLOCKED` or `NOT-RUN` with the exact baseline and evidence. Do
not convert a blocked check, a missing reviewer, a documentation score or a backup completion into a
claim of ISO conformity, accessibility conformance, product parity, recovery, security or
performance.
