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
git rev-parse 04e6a97e537eba51d5344f7b6f6f2d5edb87f9ee
function Get-DvpCanonicalSha256 {
  param([Parameter(Mandatory)][string]$LiteralPath)
  $canonicalText = Get-Content -LiteralPath $LiteralPath -Raw
  $canonicalText = $canonicalText.Replace(([string][char]13 + [string][char]10), [string][char]10)
  $canonicalText = $canonicalText.Replace([string][char]13, [string][char]10)
  $canonicalBytes = [System.Text.UTF8Encoding]::new($false).GetBytes($canonicalText)
  $canonicalSha = [System.Security.Cryptography.SHA256]::Create()
  try {
    $digestBytes = $canonicalSha.ComputeHash($canonicalBytes)
    return [BitConverter]::ToString($digestBytes).Replace('-', '').ToLowerInvariant()
  }
  finally {
    $canonicalSha.Dispose()
  }
}
$manifestRoot = (Get-Location).Path
$manifestEntries = Get-Content -LiteralPath 'specs/003-controlled-documentation/validation-baseline-manifest.sha256'
$manifestCount = 0
foreach ($manifestEntry in $manifestEntries) {
  if ($manifestEntry -match '^(?<expected>[0-9a-fA-F]{64})  (?<relative>.+)$') {
    $manifestPath = Join-Path $manifestRoot $Matches.relative
    $manifestActual = Get-DvpCanonicalSha256 -LiteralPath $manifestPath
    if ($manifestActual -ne $Matches.expected) {
      throw "SHA-256 mismatch: $($Matches.relative)"
    }
    $manifestCount++
  }
}
"Verified $manifestCount manifest entries"
"Manifest file SHA-256: $(Get-DvpCanonicalSha256 -LiteralPath 'specs/003-controlled-documentation/validation-baseline-manifest.sha256')"
```

Expected result: the feature contains the spec, plan, research, data model, quickstart and document
contracts; no whitespace error is reported; the parent commit resolves and every canonical
LF-normalized UTF-8 content hash in the scoped manifest verifies. This normalization makes the
manifest stable across Git line-ending conversion. `validation-results.md` is the ledger for this
assessed set and is excluded from the manifest to avoid circular hashing. A clean command result does
not approve the product baseline by itself. Compare the printed manifest-file hash with the exact
value retained in the excluded ledger; do not confuse it with an optional digest of the manifest's
entry lines.

## 2. Validate the eight-class catalogue after templates are created

The implementation tasks will create the authoritative template directory
`docs/product/definition/`. Run:

```powershell
$catalogue = Get-Content -LiteralPath 'docs/product/definition/README.md' -Raw
$ids = [regex]::Matches($catalogue,'(?m)^\|\s*`DOC-0[1-8]`\s*\|') |
  ForEach-Object { $_.Value }
"Core class rows: $($ids.Count)"
rg -n '^\|\s*`(GOV|CLR|RSK|VVP|VEV|CMP|CHG|REL|OPS)`\s*\|' docs/product/definition
rg -n -i -e 'Aras' -e 'Innovator' -e 'DDM' docs/product/definition -g 'DOC-*.md'
rg -n '^\| Commercial objectives? \|' docs/product/definition -g 'DOC-*.md'
```

Expected result: exactly eight core rows and nine supporting rows; the competitor-name scan for
`Aras`, `Innovator` and `DDM` returns no matches in core templates. The commercial-boundary scan returns only the three expected explicit
`NOT APPLICABLE` exclusion rows in DOC-01, DOC-03 and DOC-07; commercial terms are never goals,
metrics or requirements. Supporting research and GOV coverage records may contain reference-product
names and comparison evidence.

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

## 7. Criterion-selected 20-item placement exercise

Select the following items as a fixed, criterion-based exercise. An author records the expected
authority before opening a second document, then records the actual placement and evidence link. The
exercise is complete only when every class is represented and shared/non-ownership cases are kept as
typed references rather than duplicated rules.

| Item ID | Selected information item | Expected authority | Selection rationale | Expected author outcome | Actual outcome |
|---|---|---|---|---|---|
| `PLAC-001` | Internal problem hypothesis and value boundary | `DOC-01` | Core vision case | One `DOC-01` statement with evidence class | `NOT-RUN` |
| `PLAC-002` | Feasibility question and option recommendation | `DOC-02` | Core feasibility case | Indexed assessment with source baseline | `NOT-RUN` |
| `PLAC-003` | Stakeholder need and business scenario | `DOC-03` | Core business case | Stable need with actor, context and acceptance intent | `NOT-RUN` |
| `PLAC-004` | Testable software obligation | `DOC-04` | Core requirements case | Requirement ID, source, acceptance and verification | `NOT-RUN` |
| `PLAC-005` | System boundary and responsibility view | `DOC-05` | Core architecture case | View/reference without implementation commitment | `NOT-RUN` |
| `PLAC-006` | Data ownership and reconciliation obligation | `DOC-06` | Core data case | Data/integration record with integrity and recovery link | `NOT-RUN` |
| `PLAC-007` | Bounded increment and exit evidence | `DOC-07` | Core roadmap case | Indexed increment with gate and release trace | `NOT-RUN` |
| `PLAC-008` | Interaction state and surface evaluation | `DOC-08` | Core HCD case | Interaction contract with surface/locale profile | `NOT-RUN` |
| `PLAC-009` | Standard edition and applicability decision | `GOV` | Supporting governance case | Exact source, classification, applicability and owner | `NOT-RUN` |
| `PLAC-010` | Lawful source access and evidence hash | `CLR` | Supporting provenance case | Admissible provenance record and transfer limit | `NOT-RUN` |
| `PLAC-011` | Material risk and residual treatment | `RSK` | Supporting risk case | One risk owner and escalation path | `NOT-RUN` |
| `PLAC-012` | Verification method and expected evidence | `VVP` | Supporting planning case | Procedure/configuration/evidence expectation | `NOT-RUN` |
| `PLAC-013` | Executed verification result | `VEV` | Supporting evidence case | Exact result, timestamp and deviation record | `NOT-RUN` |
| `PLAC-014` | Controlled item identity and baseline manifest | `CMP` | Supporting configuration case | Stable ID/version/baseline accounting | `NOT-RUN` |
| `PLAC-015` | Material change impact across affected areas | `CHG` | Supporting change case | Typed impact links and effective baseline | `NOT-RUN` |
| `PLAC-016` | Immutable release manifest and claim boundary | `REL` | Supporting release case | Exact pins, evidence and authorization | `NOT-RUN` |
| `PLAC-017` | Incident, recovery or retirement learning | `OPS` | Supporting operations case | Operational record linked back to owning DOC | `NOT-RUN` |
| `PLAC-018` | Shared owner/status/version envelope fact | `CMP` (shared control owner) | Shared-fact/non-ownership case | Other documents link the one control authority | `NOT-RUN` |
| `PLAC-019` | Reference observation with limited transfer | `CLR`/`GOV` | Non-ownership/reference case | `Reference-Coverage Evidence`; not an IDEA requirement by itself | `NOT-RUN` |
| `PLAC-020` | Gate outcome and conditional action | `GOV` | Cross-cutting authority case | One gate outcome plus action owner/baseline/expiry/escalation | `NOT-RUN` |

The author must record the actual result, authority link and reviewer disposition in the retained
Validation Pack ledger. A reference observation cannot become an IDEA requirement without an
independent internal need or approved decision with rationale, acceptance and verification.

## 8. PG2/PG3 review-package walkthrough and failure classifications

Assemble a package from exact document versions and record one gate outcome. The following failure
classes are explicit:

| Failure or missing prerequisite | Required disposition |
|---|---|
| Missing exact input version, source hash or baseline | `BLOCKED`; name the configuration owner |
| Missing independent reviewer or reviewer competence | `BLOCKED` or `NOT-RUN`; record `Specialist Review Gap` |
| Missing participant population for representativeness | `BLOCKED` or `NOT-RUN`; do not generalize from one actor |
| Broken, orphaned, stale or unjustified circular trace | `FAIL` or `BLOCKED` until repaired/dispositioned through `CHG` |
| Acceptance or verification procedure absent | `BLOCKED`; file-count completeness is not a pass |
| Conditional action lacks owner, affected baseline, due condition/date, expiry or escalation | `FAIL` or `BLOCKED`; no incomplete `PASS-WITH-ACTIONS` |
| Architecture/design statement overrides an approved requirement | `FAIL`/`BLOCKED`; create a typed change and re-review |

For PG2, inspect `DOC-03`, `DOC-04`, requirement-bearing `DOC-06`/`DOC-08`, `VVP`, risks and
standards. For PG3, inspect `DOC-05`, applicable `DOC-06`/`DOC-08`, ADRs, risks and V&V strategy.
Record reviewer identity, competence, author/owner separation, exact baseline, one outcome and next
gate link.

## 9. Evidence-to-release trace walkthrough

Walk this chain forward and backward with exact IDs and versions:

```text
Evidence → Finding → Need/Decision → Requirement → Design/ADR
  → CHG/Work Item → VEV → REL → Rendition
```

| Scenario | Expected result |
|---|---|
| Complete chain | Both directions locate one authority per statement and the exact release pin |
| Broken link | Affected gate is `BLOCKED` or a repair is authorized in `CHG` |
| Orphan item | Item cannot enter `Proposed`/`Approved` until an owner and source link exist |
| Stale link or rendition | Mark stale/superseded, redirect review to the current source and retain history |
| Unjustified circular link | `FAIL`/`BLOCKED` until a rationale and owner-approved repair are recorded |
| Superseded source | Preserve prior version and link the effective successor; never silently rewrite history |

## 10. Supporting-record placement and coverage walkthrough

Place each cross-cutting fact in its single supporting owner and retain only a concise conclusion in a
core document. Review the GOV-owned inventory at its explicit as-of baseline and require exactly one
coverage record per entry.

| Case | Supporting owner | Required disposition/evidence |
|---|---|---|
| Standards edition changes | `GOV` + `CHG` | New applicability review; dependent DOCs are not silently rewritten |
| Reference behavior is evidenced | `CLR` + `GOV` coverage | `Reference-Coverage Evidence`, comparison and one disposition |
| No stronger benchmark pattern | `GOV` coverage | Explicit `NO-STRONGER-PATTERN`, not missing evidence |
| Restricted or proprietary source | `CLR` | Metadata/controlled-storage link only; repository copy prohibited |
| Cross-document risk | `RSK` | One owner, residual disposition, escalation and typed links |
| Verification result | `VEV` | Exact configuration, result and evidence; no substitution |
| Release/operations fact | `REL`/`OPS` | Exact baseline or operational record linked to owning DOC |

## 11. Two-baseline rendition walkthrough

Create two rendition records from source baselines `BASE-A` and `BASE-B` and compare them without
opening repository history. Record source ID/version, baseline, date, producer, classification and
retention for each.

| Comparison | Expected result |
|---|---|
| `BASE-A` is the current source | Rendition A is `Current` only while it matches `BASE-A` |
| Source advances to `BASE-B` | Rendition A becomes visibly `Stale`; it cannot approve `BASE-B` |
| New rendition generated from `BASE-B` | Rendition B is `Current` with a new rendition ID and exact pin |
| Deliberate replacement/withdrawal | Old rendition is `Superseded` or `Withdrawn` with reason, retention and trace |
| Comment/approval on old rendition | Redirect to Markdown authority and record review/change action |

## 12. Final scope audit

Confirm and retain evidence for every statement below before the next `$speckit-analyze` run:

1. Exactly eight core classes and nine supporting classes exist.
2. The Material Coverage Inventory and Behavioral Coverage Register remain GOV-owned record shapes,
   not a tenth supporting class.
3. English Markdown/field vocabulary remains distinct from product locales `en`, `vi` and `ja`.
4. Both DOC-04 and DOC-08 contain the complete nine-cell locale/surface matrix.
5. No runtime source, API, database schema, deployment topology, identity-provider or format-adapter
   implementation was introduced by this documentation increment.
6. Core documents contain no competitor name/comparison narrative; commercial terms appear only as
   explicit internal-boundary exclusions.
7. No standards conformity, accessibility conformance, product parity, representative acceptance,
   recovery or release claim is made without exact scope and objective evidence.
8. Static checks, retained pack status and every `UNKNOWN`/`BLOCKED` decision are recorded in
   `validation-results.md`; human review remains distinct from structural checks.

## Evidence interpretation

Record each check as `PASS`, `FAIL`, `BLOCKED` or `NOT-RUN` with the exact baseline and evidence. Do
not convert a blocked check, a missing reviewer, a documentation score or a backup completion into a
claim of ISO conformity, accessibility conformance, product parity, recovery, security or
performance.
