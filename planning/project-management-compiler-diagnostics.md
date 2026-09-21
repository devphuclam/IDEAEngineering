# Project Management Compiler Source Diagnostics

| Field | Value |
|---|---|
| Stable ID | `IE-PMC-DIAGNOSTICS-001` |
| Version / status | `0.1.0` / `Draft` |
| Scope | Diagnostics emitted while validating or importing the IDEAEngineering project-management source package. |
| Product impact | None; diagnostics do not change Product Scope or gate state. |

Each diagnostic contains `code`, `severity`, `entityKind`, `entityId`, `sourcePath`, `field`,
`message` and `recommendedAction`. Empty entity fields are permitted for repository-wide errors.

| Code | Severity | Meaning | Required action |
|---|---|---|---|
| `PMC-CONTRACT-001` | ERROR | Contract version is absent or malformed. | Correct the manifest/register version. |
| `PMC-CONTRACT-002` | ERROR | Contract version is not in the explicit support table. | Upgrade the reader or migrate through a reviewed successor. |
| `PMC-SCHEMA-001` | ERROR | A JSON instance does not conform to the selected Execution Register schema. | Correct the instance or publish a reviewed contract/schema successor. |
| `PMC-MANIFEST-001` | ERROR | A required manifest field or authority role is missing/duplicated. | Restore one declared source for every required role. |
| `PMC-PATH-001` | ERROR | A path is absolute, escapes the repository or is undeclared. | Replace it with an allowed repository-relative path. |
| `PMC-PATH-002` | ERROR | A declared file does not exist or resolves outside the repository. | Restore the file or correct the manifest. |
| `PMC-SNAPSHOT-001` | WARNING | Candidate is a dirty working-tree preview, not an official Git snapshot. | Commit and validate the exact snapshot before handoff. |
| `PMC-SNAPSHOT-002` | ERROR | Declared inputs come from different snapshots or revisions. | Recreate one atomic candidate snapshot. |
| `PMC-IDENTITY-001` | ERROR | `kind + id` is duplicated. | Preserve one owner record and correct the duplicate. |
| `PMC-IDENTITY-002` | ERROR | A baseline Delivery Card is absent from the Execution Register. | Add an explicit `NOT_RECORDED` record or controlled disposition. |
| `PMC-IDENTITY-003` | ERROR | Register contains an unknown Delivery Card. | Add the Card through planning change control or remove the invalid record. |
| `PMC-STATE-001` | ERROR | Execution or result state is invalid/inconsistent. | Use the controlled vocabulary and completion rules. |
| `PMC-EFFORT-001` | ERROR | Actual or remaining effort is negative/non-numeric, or reserve usage is not a non-negative 0.5-hour increment. | Correct the record and retain correction history. |
| `PMC-COMPLETE-001` | ERROR | A completed Card lacks finish, zero remaining effort or evidence. | Supply completion evidence or revert the state. |
| `PMC-EVIDENCE-001` | ERROR | Required evidence is missing, local-only or outside the repository. | Add controlled evidence or a permitted external URI. |
| `PMC-DEPENDENCY-001` | ERROR | A dependency refers to an unknown entity. | Correct the predecessor reference. |
| `PMC-DEPENDENCY-002` | ERROR | Dependency graph contains a cycle. | Remove the circular dependency through planning review. |
| `PMC-CALENDAR-001` | WARNING | Forecast calendar differs from the approved Baseline calendar. | Keep both visible and request rebaseline if the new calendar becomes a commitment. |
| `PMC-CALENDAR-002` | ERROR | Calendar timezone/rule is invalid or ambiguous. | Use the controlled timezone and explicit workday rules. |
| `EXEC-STALE-001` | WARNING | An in-progress Card has no update for more than two working days. | Record actual, remaining or an attributable no-change review. |
| `EXEC-REMAINING-001` | WARNING | Remaining effort has not been reviewed within seven days. | Review and record the current remaining effort. |
| `EXEC-UNRECORDED-001` | INFO | No attributable actual execution fact exists for the Card. | Record evidence when execution genuinely begins; do not infer history. |
| `PMC-SOURCE-001` | ERROR | Source totals do not equal 35 Work Packages, 53 Delivery Cards, seven gates/milestones, 512 work hours, 88 technical-reserve hours and 32 operational-buffer hours. | Reconcile the owning planning source before import. |
| `PMC-FIXTURE-001` | ERROR | A fixture result or diagnostic differs from its expected oracle. | Fix the validator/contract or review the fixture successor. |

Waivers may apply only to explicitly waivable warnings. Schema, identity, authority, path,
dependency-cycle and atomic-snapshot errors cannot be waived for import.
