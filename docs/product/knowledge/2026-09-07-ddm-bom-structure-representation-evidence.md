# DDM Product Structure, BOM and Export Evidence Finding

| Field | Value |
|---|---|
| Document ID | `IE-KNW-DDM-006` |
| Status | Bounded research finding; not a target-runtime fact |
| Question | Does publicly demonstrated DDM behavior treat Product Structure/BOM as managed data, or only as Excel/PDF files? |
| Source scope | The admitted DDM vendor-public baseline, its cited official Product Structure/BOM tutorials and the controlled target-audit plan |
| Access date | 2026-09-07 |
| Evidence classes | `VENDOR-PUBLIC`, `INFERENCE`, `UNKNOWN`, `IDEA RECOMMENDATION` |
| Product change made | None; the recommendation is adopted only through a separate controlled change record |

## Conclusion

Public DDM material demonstrates Product Structure and BOM editing as application behavior: users
work with components, occurrences, quantity/position fields and a structure view, then export data
to Excel or through a Web surface. This supports the conclusion that an Excel file is an output of
the demonstrated BOM capability, not the only meaning of BOM.

The public sources do not prove DDM's internal occurrence keys, immutable structure snapshots,
atomic multi-row edits, reconciliation with CAD, or how an exported file is pinned to the exact
structure that produced it. Those details remain `UNKNOWN` until an authorized target package is
tested.

## What may and may not be concluded

| Observation | Evidence class | Safe conclusion | Boundary |
|---|---|---|---|
| Product Structure and BOM Editor surfaces are demonstrated. | `VENDOR-PUBLIC — DEMONSTRATED` | DDM visibly manages a structured engineering view rather than presenting only a folder of files. | Internal schema and authority keys are not visible. |
| Quantity and position are edited in the demonstrated BOM workflow. | `VENDOR-PUBLIC — DEMONSTRATED` | Occurrence-level BOM data exists in the user flow. | Stable occurrence identity, validation and transaction rules are not proven. |
| Excel and Web export are demonstrated from the structure/BOM surface. | `VENDOR-PUBLIC — DEMONSTRATED` | A spreadsheet/export is a representation or handover of managed data. | Exact source pin, digest, producer version and stale-output behavior are not established. |
| A controlled Excel/PDF file can also be managed as its own document. | `INFERENCE` | The generic document-management capability could retain such a file as a controlled item. | Public evidence does not establish its relationship to an authoritative BOM snapshot. |

## IDEA recommendation for correction point 12

Adopt the visible objective while stating IDEA's authority boundary explicitly:

1. **Product Structure** is authoritative managed data. A published structure is retained as one
   immutable **Structure Snapshot** with exact occurrence and Generation pins.
2. A **BOM** is a governed view of one exact Structure Snapshot for an identified purpose/profile.
   It is not synonymous with an Excel, PDF or CSV file.
3. An Excel/PDF/CSV **BOM Representation** records the exact Structure Snapshot and BOM profile that
   produced it, its content digest and producer information. It remains historical after the source
   advances and is shown as `Needs update`, not silently relabeled current.
4. An uploaded Excel/CSV **BOM Import Candidate** has no authority until the system validates it,
   shows the proposed changes and the user confirms one atomic operation. Failure creates no partial
   Product Structure.
5. If a parts list is governed as an independent Logical Document rather than generated output, its
   relationship to the exact Structure Snapshot and selected Generation must be explicit.
6. A Release Record pins the exact Structure Snapshot and the exact required representations or
   independent controlled documents. It never resolves a floating “latest BOM”.

Rules 2–6 are IDEA requirements chosen for exact history and safe failure. They must not be
presented as confirmed DDM internals or a DDM parity claim.

## Remaining target-audit questions

- Are occurrence identities stable across CAD, BOM, Web, export, where-used and Up-Issue?
- Does DDM retain an exact structure baseline, and what event creates it?
- Are multi-row BOM changes atomic when validation or CAD reconciliation fails?
- Can an export be traced to one exact BOM/structure state and later identified as stale?
- How does the target distinguish a generated BOM output from an independently controlled parts-list
  document?

These questions remain owned by items 12–13 of the
[DDM target audit plan](ddm-target-audit-plan.md).

## Sources

1. [DDM vendor-public capability baseline](ddm-vendor-public-baseline.md), proposition `VP-07` and
   its cited official Product Structure, BOM Editor and Web BOM/export tutorials.
2. [DDM target package and runtime audit plan](ddm-target-audit-plan.md), questions 12–13.
3. [Behavioral coverage register](../instances/idea-engineering/registers/GOV-material-and-behavioral-coverage.md),
   `MAT-DDM-007 / COV-DDM-007`.
