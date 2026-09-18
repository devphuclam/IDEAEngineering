# PH0 Fresh Cross-Artifact Analysis

**Record ID**: `IE-ANALYSIS-PH0-002`
**Date**: 2026-09-18
**Status**: Draft; fresh analysis complete, reviewer-owned checks remain open
**Scope**: PH0 Spec Kit sources, readiness contracts, scenario/trace package, P04–P06 preparation and the readiness register
**Method**: Read-only structural and consistency analysis, followed by controlled remediation outside the analyzer
**Historical record**: [IE-ANALYSIS-PH0-001](analysis-findings.md) remains unchanged and records the earlier baseline

## 1. Analysis baseline and source hashes

The fresh verification pass used repository `HEAD` `e0981ba32d003fe2fcabcd5ff7d02443059feafd`.
The PH0 content baseline recorded in the readiness register is `ad49bbf67a291f542b6464532185f7d701a9f298`;
the following `e0981ba` commit only pins that baseline in the control envelope. The T006 historical
input remains `a2cb58961c9f264152ff7395c9158b78f3cfe224` and was not reinterpreted.

| Source | SHA-256 |
|---|---|
| `specs/004-technical-pilot-readiness/spec.md` | `5DFC8296DB6B7F03EE4B99036BED707A212FB2832868A91F9612785ABB8FDFAA` |
| `specs/004-technical-pilot-readiness/plan.md` | `B836C2E2C14890A6BF3B441A65537783B9C35A16E73E7C9BDE0B016C0AD28525` |
| `specs/004-technical-pilot-readiness/tasks.md` | `D6CA33071998D2FE180EB71E1432E50251C0B13FB7D71AD6E86DE1F3618FE10A` |
| `specs/004-technical-pilot-readiness/data-model.md` | `1149B20C51654353E2E36E71CA60E5BC47EE1BCF7B7D5C5B5620B2CCE61C49F4` |
| `specs/004-technical-pilot-readiness/contracts/decision-and-evidence-register.md` | `B72C4A0E55F4D0B6B4C73628167424B3DD38FCE0B9806ACA03EC7A50C7D7887C` |
| `specs/004-technical-pilot-readiness/contracts/pg4-gate-record.md` | `DCC1305CDD83FD5BBEEE89CA21DF21D25EDDA4222518B3DDA393F3C56187D88D` |
| `specs/004-technical-pilot-readiness/canonical-scenario.md` | `1704BBA06BA13CD31310D624E6705450FAC99F0C87D6751D4EE803AF22E22134` |
| `specs/004-technical-pilot-readiness/trace-matrix.md` | `DF62D919A965D81205631291B2ED1465C4A41D511B9E8D809399617ECF75F7E1` |
| `specs/004-technical-pilot-readiness/readiness-register.md` | `DEA4AD4880586D72DDE3FA5B38131B8EEF6DE0244BE75375CFCEE69952AB1022` |
| `specs/004-technical-pilot-readiness/environment-profile.md` | `D0EFD96FA8D857398E199FCC72F4961C9F2149D00DBA803E3C75D149E0779A07` |
| `specs/004-technical-pilot-readiness/test-data-and-verification.md` | `5EF6F8D9F31FA62FEFE5E4C8BFDB39058E50309F71542ED460AD54756E39E07` |
| `specs/004-technical-pilot-readiness/recovery-and-security-plan.md` | `F9950E46CB39C49EC8D3E584D79B330450799927ED0394EBAE9A4C2D0B87CBA8` |
| `specs/004-technical-pilot-readiness/checklists/readiness.md` | `643274DBDC62DA2DEB01D5F615B23E4CC155BA54EBA10BBC3BBDA2CF59262F3D` |
| `.specify/memory/constitution.md` | `D24721C79D50EB556E43A0E49E412C565355008A43C7B7A6E55253E039C4CBDC` |

## 2. Findings from the fresh pass

| ID | Finding | Disposition | Result |
|---|---|---|---|
| `F-BASE-001` | The readiness register used one baseline description for two different purposes: the historical input used by T006 and the newer PH0 package that contains the scenario, environment, data and recovery records. That made it possible to read the historical `a2cb589` pin as if it were the current PH0 package. | Added separate control-envelope rows for the immutable T006 input, the analyzed PH0 content baseline `ad49bbf`, the approved predecessor `f269a044`, and the Draft successor source set. | `RESOLVED` in `readiness-register.md` |
| `F-DEC-001` | D0–D5 appeared once in an abbreviated dependency table and again as detailed records, obscuring the one-record-per-decision rule. | Removed the duplicate table and retained a navigation paragraph plus one detailed D0–D5 table. | `RESOLVED` in `readiness-register.md` |

T021 was then completed at author level. The environment, fixture and recovery documents are now
cross-checked against D0–D5, and missing prerequisites are explicitly retained as `BLOCKED`,
`UNKNOWN` or `NOT-RUN`. No reviewer result or authority decision was created by that cross-check.

## 3. Verification results

| Check | Result | Evidence |
|---|---|---|
| Spec Kit prerequisite resolution | `PASS` for locating the active feature directory; this is not a product readiness result | `check-prerequisites.ps1 -Json -RequireSpec -RequireTasks -IncludeTasks` resolved `specs/004-technical-pilot-readiness` |
| Local requirement/task coverage | `PASS` for structural coverage | 26 local requirements (17 FR + 9 SC); 0 missing task references |
| Task identifiers | `PASS` for uniqueness | 32 task IDs; 32 unique; no duplicate checkbox IDs |
| D0–D5 decision identity | `PASS` for register structure | Exactly one detailed row for each of D0, D1, D2, D3, D4 and D5 |
| Required PH0 preparation records | `PASS` for presence | Scenario, trace, environment, test-data, recovery/security, contracts and checklist are present |
| Placeholder scan | `PASS` | No uncontrolled `TBD`, `TODO`, `NEEDS CLARIFICATION` or `assume approved` matches outside the excluded intentional files |
| Template-marker scan | `PASS` | No `[FEATURE NAME]`, `[DATE]`, `[Brief Title]` or `What happens when` markers |
| Whitespace validation | `PASS` | `git diff --check -- specs/004-technical-pilot-readiness` returned no error |
| Scenario trace rows | `PASS` for presence | 21 trace rows cover the canonical paths and P03–P07 outputs; every evidence status remains `NOT-RUN` |

These are documentary consistency results only. They are not runtime, security, backup/restore,
performance, license, Vault-topology or Product Decision Authority results.

## 4. Task and gate state after analysis

- Completed author tasks include T001–T005, T007–T010, T012–T015, T017–T021 and T028–T030.
- T006, T011, T016, T022–T027 and T031–T032 remain open because they require reviewer, authority,
  execution or gate evidence.
- P01 remains `IN-PROGRESS`; P02–P07 remain `NOT-RUN`.
- D0–D5 remain `OPEN`.
- PG4 execution state remains `NOT-RUN` and outcome remains `NOT-APPLICABLE`.
- Production implementation remains unauthorized; no product code was started.

## 5. Conclusion

The fresh analysis found no remaining actionable cross-artifact consistency defect after the two
remediations above. It does not approve the PH0 package, close any decision, or authorize PG4. The
next valid actions are the named human reviews and evidence collection recorded in
[readiness-register.md](readiness-register.md), not implementation.
