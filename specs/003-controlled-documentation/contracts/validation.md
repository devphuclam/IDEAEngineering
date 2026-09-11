# Contract: Documentation Validation

Validation for this increment is repository/documentation validation. It does not claim that the
future IDEA application, an external reference product, or a production deployment has passed.

## Automated/static checks

Run from the repository root:

```powershell
rg -n "^DOC-0[1-8]" docs/product/definition
rg -n "NEEDS CLARIFICATION|TODO|TBD|\{\{|\}\}" docs/product/definition specs/003-controlled-documentation -g '*.md' -g '!specs/003-controlled-documentation/contracts/validation.md' -g '!specs/003-controlled-documentation/checklists/requirements.md'
git diff --check
```

Expected results for an approved template baseline:

- the catalogue contains exactly eight core classes and nine supporting classes;
- no unresolved template marker remains in approved content;
- links resolve to the intended source records;
- `git diff --check` reports no whitespace errors.

The retained Validation Pack must identify its source as an immutable parent commit plus a scoped
SHA-256 manifest. The manifest hashes canonical LF-normalized UTF-8 content so Git line-ending
conversion cannot change the assessed identity. It lists every assessed source artifact and excludes
the result ledger itself to avoid circular hashing; a working-tree label without that manifest is not
an exact baseline. The excluded ledger records the canonical SHA-256 of the completed manifest file
and may additionally record the digest of its canonical entry set; those two values must be named
separately.

The first command is a content-presence check after the template files are created; it is not a
substitute for reviewing authority boundaries.

## Structural and trace checks

| Check | Evidence | Related criteria |
|---|---|---|
| Catalogue completeness | Eight core rows, nine supporting rows, owner/input/output/gate/non-ownership fields | SC-001 |
| Common control envelope | Sample approved instances contain every applicable field and no prompts/sample values | SC-002 |
| Placement exercise | At least 20 criterion-selected information items placed by authors without maintainer help, with authority links and one-owner decisions | SC-003 |
| Requirement trace | Every approved requirement has source, rationale, acceptance, verification and lifecycle-appropriate links | SC-004–SC-005 |
| Evidence classification | Seeded reference cases retain class/scope and do not become internal validation automatically | SC-006 |
| Gate package | Exact input baselines, one outcome and complete conditional actions | SC-007 |
| HCD/accessibility routing | Reviewer identifies the surface profile and conditional sources in under 10 minutes | SC-008 |
| Rendition identity | DOCX/PDF source ID/version/baseline and stale status are visible | SC-009 |
| Reviewer navigation | Decision, evidence, owner, risk and next action located without private chat/source code | SC-010 |
| Internal boundary | Core templates contain no commercial objectives | SC-011 |
| Pilot claims | Dataset, technical, single-actor, internal-validation, pilot-acceptance and rollout statuses remain distinct | SC-012 |
| MVP scope | Release Spine, generic baseline, one deep CAD profile and metric set are present without unsupported breadth claims | SC-013 |
| Pilot data | Repository contains only approved synthetic/metadata evidence; sensitive data has approved storage record | SC-014 |
| Claim comprehension | At least 90% of walkthrough participants classify sampled claims correctly | SC-015 |
| Coverage register completeness | Every entry in the GOV-owned Material Coverage Inventory at its explicit as-of baseline has exactly one matching record with DDM evidence, proactive benchmark comparison, disposition, owner/rationale, IDEA trace, increment and verification; omissions are visible | SC-016 |
| Locale profile coverage | Each `DOC-04`/`DOC-08` template declares 9 locale-surface cells (`en`/`vi`/`ja` × Desktop/Web/Web-rendered Desktop), distinguishes English source, records fallback/review/preference and preserves Unicode/Japanese scenarios | SC-017 |
| Validation Pack integrity | Required strata and minimum counts are enumerated; every result has selection rationale, exact baseline, environment, date, owner and evidence link | SC-018 |
| Independence/representativeness | Human review records author/owner separation, competence or gap, participant population and `BLOCKED`/`NOT-RUN` when minimums are unavailable | SC-019 |

## Documentation Validation Pack and sampling protocol

Before interpreting any percentage or time criterion, create a retained Validation Pack record with
the pack ID, baseline, sampling date, selector/owner and the following criterion-based strata:

| Stratum | Minimum population | Required coverage |
|---|---:|---|
| Class structure | 17 class rows | All 8 core and 9 supporting classes |
| Placement | 20 items | Every core/supporting class represented; include shared-fact and non-ownership cases |
| Requirements | 8 items | Functional, interface, data, quality, security/privacy, operational, accessibility and localization |
| Reference coverage | 6 cases | Evidenced, ambiguous, unknown, stronger-benchmark, no-stronger-pattern and restricted-evidence |
| Gate outcomes | 4 cases | `PASS`, `PASS-WITH-ACTIONS`, `FAIL`, `BLOCKED` |
| Surface profiles | 3 profiles + 9 locale-surface cells | Native Desktop, Web and Web-rendered Desktop; each surface is exercised for `en`, `vi`, and `ja` |
| Renditions | 4 cases | Current, Stale, Superseded and Withdrawn |
| Pilot/claim statuses | 6 cases | Canonical Demo Dataset, Technical Pilot Verification, Single-Actor Functional Acceptance, Internal Operational Need Validation, Internal Pilot Acceptance and operational rollout authorization |

Sampling is stratified and criterion-based. Each selected item records a stable ID, stratum,
selection rationale, expected result, executed result, exact baseline, environment, date, owner,
evidence link and disposition. A convenience sample cannot be generalized beyond its stated scope.

For human walkthroughs, use at least two participants when that population exists: the Product
Decision Authority and one intended document consumer. Record each participant's role, independence,
competence or `Specialist Review Gap`, and whether the person authored or owns the material decision.
The Principal Product Author may assist with usability/comprehension but cannot count as the
independent approver. If the minimum reviewer, competence or participant population is unavailable,
record `BLOCKED` or `NOT-RUN` and the missing prerequisite; do not report an unqualified pass.

## Reviewer walkthrough scenarios

1. Locate the authority owner for each of the eight core classes.
2. Place one shared fact in the correct authoritative class and follow the reference from a second
   document.
3. Trace a reference observation to `Reference-Coverage Evidence` and show why it is not an IDEA
   requirement without a separate need/decision.
4. Attempt to pass a gate with no independent reviewer; confirm `BLOCKED` is recorded.
5. Execute the one-human/two-identity scenario; confirm `Single-Actor Functional Acceptance` is
   not called independent review.
6. Review a technical pilot with no Internal Adoption Authority; confirm rollout remains unavailable.
7. Compare a rendition with a changed source and confirm `Stale`/`Superseded` handling.
8. Review the GOV-owned Material Coverage Inventory at its recorded as-of baseline, then confirm each
   inventory entry has exactly one Behavioral Coverage Register record with a proactive benchmark
   comparison, explicit disposition and no silent DDM omission.
9. Review the complete 3-by-3 locale matrix in each applicable `DOC-04`/`DOC-08` template: all 9
   `en`/`vi`/`ja` × Desktop/Web/Web-rendered Desktop cells, including fallback, review-status, Unicode
   and Japanese input/search scenarios.
10. Execute or attempt every Validation Pack stratum; retain exact results and record `BLOCKED` or
    `NOT-RUN` when the required reviewer or population is unavailable.

## Failure and evidence rules

- A failed structural or link check is `FAIL` for the applicable validation item.
- A check prevented by missing access, authority, tool or environment is `BLOCKED` or `NOT-RUN`,
  with the prerequisite and owner recorded.
- A reviewer may record `PASS-WITH-ACTIONS` only when each action has owner, affected baseline,
  due condition/date, expiry and escalation path.
- No static score, documentation completeness count or successful backup is evidence of product
  conformity, recovery, performance, security or vendor parity by itself.
