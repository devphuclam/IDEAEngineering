# Feature 009 — Engineering Closure Matrix

| Field | Value |
|---|---|
| ID / class / version / state | IE-VR-IAM-UI-CLOSURE-001 / verification crosswalk / 0.3 / Approved human-acceptance closure |
| Authority / owner / author | INFORMATIVE; no new requirement or gate decision / Project user / Codex, CODEX_ONLY |
| Baseline / date / classification | Accepted spec/design and task package aaa5596a; predecessor reviewed 73b5d95; final repaired application/Web/test/harness 9d3732cb173e8094195b9bdd60b5588ac3cfa42e / 2026-10-08 Asia/Ho_Chi_Minh / INTERNAL |
| Reviewer / acceptance / effective | Independent predecessor FAIL (S1/F1 HIGH, F2 MEDIUM) and repair retained; human Project user accepted the successor and explicitly authorized integration on 2026-10-08 at c379c6a / ACCEPTED, successor PG5 PASS, section23 / not a deployment authorization |
| Upstream / downstream / change | [Spec](../spec.md), [operations](../contracts/operations.md), [permissions](../contracts/permission-delegation.md), [tasks](../tasks.md) / reviewer handoff / Issue #46, PR #47 |
| Evidence / retention / trigger | [Readiness sections16–23](../integration-readiness.md), historical + successor exact run ledgers and separate human acceptance; retain in Git / source, contract, supported rights, graph or environment change |
| Supersession / limits | Historical checkpoints unchanged; no raw-log access, verifier, deployment, live adoption, Desktop or production claim |

## 1. Operation → owner/source → tests → exact execution → disposition

Paths below identify the actual owner implementation, not another implementation workflow.
`S<n>` means the retained exact-source execution table in readiness section `<n>`, not an
unidentified run. Earlier owner suites were not all rerun at the final Inspector SHA. Their
affected shared evaluator, schema, Identity/session and Web boundaries were requalified in S21.
S22 records the three externally requested repairs and affected successor tests, not a full
same-SHA rerun. Every row's **successor external disposition is ACCEPTED** under the human
Project user's whole-feature acceptance and explicit integration authorization in S23.
Prior independent FAIL is retained; engineering PASS alone did not establish PG5.

| Operations | Owner / source | Tests / actual client | Exact executed source / evidence | Engineering status |
|---|---|---|---|---|
| UI-I01, UI-I02 | IAM [IdentityDirectoryQueries](../../../apps/server/src/main/java/com/idea/ddm/identity/IdentityDirectoryQueries.java) | IdentityAccountUiContractTest; Account Web/Chrome; access reads deny wrong scope | S16 historical Account; affected 818ccbdd6b8c15cb8e81ca4bbb2b5ecb0cda7286 S18; Account6 + reissue5 at 0c92f7597ff1dc924a3a40a431d05c4fa3277157 S19; final Web/Chrome11bba5f S21 | IMPLEMENTED / qualified |
| UI-I03, UI-I04 | IAM [IdentityAdministration](../../../apps/server/src/main/java/com/idea/ddm/identity/IdentityAdministration.java), [IdentityAccountAdministration](../../../apps/server/src/main/java/com/idea/ddm/identity/IdentityAccountAdministration.java) | IdentityAccountUiContractTest, AccountIsolationTest, IdentityFlowTest, HttpSessionFlowTest; real Account journey | S16; affected Account/isolation at 818ccbd S18; Identity20 at a451459a2d20cda8f0dcbbc1564bc32570559ace and HTTP83 at 5d60b2765c42017be2b2b04391405730f7e63c89 S21 | IMPLEMENTED / qualified; stable IDs, no implicit grants |
| UI-I05, UI-I06 | IAM [CredentialSetupService](../../../apps/server/src/main/java/com/idea/ddm/identity/CredentialSetupService.java), [CredentialResetService](../../../apps/server/src/main/java/com/idea/ddm/identity/CredentialResetService.java), [IdentityController](../../../apps/server/src/main/java/com/idea/ddm/identity/IdentityController.java) | CredentialProofReissueTest, IdentityAccountUiContractTest, HttpSessionFlowTest; private handoff/recipient UI | S16 Account browser at b50272136295a9f2fed7142ba6442e44c6738d17; T034 15a98ca0281330283614db8e784011afd8532c62 S17; affected reissue S18/S19; HTTP83 at 5d60b27 S21 | IMPLEMENTED / qualified; no proof replay guarantee from metadata |
| UI-P01, UI-P02, UI-P03, UI-P04, UI-P05, UI-P06, UI-P07, UI-P08, UI-P09, UI-P10, UI-P11, UI-P12, UI-P13 | Project Governance [ProjectGovernanceQueries](../../../apps/server/src/main/java/com/idea/ddm/project/ProjectGovernanceQueries.java), [ProjectGovernanceAdministration](../../../apps/server/src/main/java/com/idea/ddm/project/ProjectGovernanceAdministration.java), [ProjectParticipationAdministration](../../../apps/server/src/main/java/com/idea/ddm/project/ProjectParticipationAdministration.java) | ProjectGovernanceHttpContractTest / ContractTest / DataTest / AtomicityTest; actual Project UI/Chrome | HTTP 5f1fca9f6c650381b1e47d7eb426776730367d1a, data f25a3a0de0bc3036368f5ecee318926ef21e97d5, owner/atomicity 818ccbd, browser 1d3fbd4d35650ec2c561032ae605e440a639473c S18; affected HTTP/atomicity S19; final real create/navigation11bba5f S21 | IMPLEMENTED / qualified; administration ≠ technical participation |
| UI-R01, UI-R05, UI-R06, UI-R07, UI-R08, UI-R09 | Access Policy [RoleCatalogueQueries](../../../apps/server/src/main/java/com/idea/ddm/access/RoleCatalogueQueries.java), [RoleAssignmentAdministration](../../../apps/server/src/main/java/com/idea/ddm/access/RoleAssignmentAdministration.java) | RoleAssignmentContractTest / AtomicityTest / RecoveryTest, AuthorizationDecisionTest; original role wizard/Chrome | Historical S19–21; successor Assignment17/evaluator22 at 1601b6e0f03e91148fb2a0ece723cd3de6080bb7, actual Chrome9 + Web62 at 9d3732cb173e8094195b9bdd60b5588ac3cfa42e S22 | IMPLEMENTED / repair qualified; ordinary AA + PA + PRA independent grants; exact predecessor/content diff/interval, canonical committed scope/replay; no unsupported version unlock |
| UI-R02, UI-R03, UI-R04 | Access Policy [RoleDefinitionCandidateService](../../../apps/server/src/main/java/com/idea/ddm/access/RoleDefinitionCandidateService.java), [RoleDefinitionActivationService](../../../apps/server/src/main/java/com/idea/ddm/access/RoleDefinitionActivationService.java) | CustomRoleContractTest / AtomicityTest / ImmutabilityTest; actual authored Custom Role UI/Chrome | HTTP/atomicity/immutable15 at 2a572ba39757b7bd2632de119cc2d508fc7b3bed; browser f223e3ee348847490927b5d484a8b996e4fda173 S20; successor Custom15 at 1601b6e, Web62/navigation at 9d3732c S22 | IMPLEMENTED / qualified; unchanged supported composition ceiling, immutable successor, no automatic assignment retarget |
| UI-R10 | Access Policy [AccessInspectionQueries](../../../apps/server/src/main/java/com/idea/ddm/access/AccessInspectionQueries.java), existing [AuthorizationDecisionService](../../../apps/server/src/main/java/com/idea/ddm/access/AuthorizationDecisionService.java) | AccessInspectionContractTest / PrivacyTest / AtomicityTest; AccessInspectionPage Web; Chrome I01/I02/I06 | Historical S21; successor Inspector14 + evaluator22 at 1601b6e, Web62/Chrome8 at 9d3732c S22 | IMPLEMENTED / qualified; all-path advisory snapshot, owner business gates NOT_EVALUATED; Audit Reader-only does not gain inspection |
| UI-A01 | Existing [AccessInspectionController](../../../apps/server/src/main/java/com/idea/ddm/access/AccessInspectionController.java) / AccessInspectionQueries with Audit owner [AuditEvidenceRepository](../../../apps/server/src/main/java/com/idea/ddm/audit/AuditEvidenceRepository.java) read port | Inspector contract/privacy/atomicity: independent read, scope/target/page, refusal, no mutation, storage failure; actual Chrome I03/I04 | Successor Inspector14 at 1601b6e, Web62/Chrome8 at 9d3732c S22 | IMPLEMENTED / repair qualified; bounded attributable administration history, safe retained before/after, independent audit.read; null means not retained, no full Audit export |
| UI-O01 | Each respective owner result with separately authorized query in [AccessInspectionQueries](../../../apps/server/src/main/java/com/idea/ddm/access/AccessInspectionQueries.java), [CommittedAdministrationScope](../../../apps/server/src/main/java/com/idea/ddm/access/CommittedAdministrationScope.java) | Inspector poisoned-scope privacy/no-mutation, canonical Assignment replay; actual Chrome I04/I05; original owner response-loss tests S18–20 | Successor Inspector14/Assignment17 at 1601b6e, Chrome8 at 9d3732c S22 | IMPLEMENTED / repair qualified; committed attempt determines scope, non-disclosing UNRESOLVED, safe metadata, never query replay. Legacy IAM metadata-only |
| UI-C01 | Access Policy + IAM [SuperSuccessorAdoptionService](../../../apps/server/src/main/java/com/idea/ddm/access/SuperSuccessorAdoptionService.java), [SuperSuccessorAdoptionCommand](../../../apps/server/src/main/java/com/idea/ddm/identity/SuperSuccessorAdoptionCommand.java) | SuperSuccessorAdoptionTest / NegativeTest; actual packaged PTY console and repeat | Exact owner executions S15 and actual package b502721 S16; final regression does not rerun live adoption | IMPLEMENTED / synthetic qualification only; no live-estate authority |

All 32 distinct IDs are represented above. S22 qualifies the actual bounded audit projection and
ordinary AA/PA/PRA grant, rather than promoting DESIGN from a flag, fixture or console path.
The sealed Role contents/delegation, schema and 25-code registry are unchanged.

## 2. Requirements and success criteria

Each row is an engineering PASS within the approved supported profile; human whole-feature
acceptance is recorded separately in S23. Core REQ/IF trace remains in the [spec crosswalk](../spec.md#upstream-and-acceptance-trace)
and [operation owner crosswalk](../contracts/operations.md). No original FR or SC was changed.

| Delivery obligations | Criteria | Source / qualification | Boundary |
|---|---|---|---|
| FR-001, FR-002, FR-003, FR-004, FR-005, FR-030 | SC-001, SC-009 | IAM/context/account rows S16/17; affected F03 20+83 + independent bounded history S22 | Native identities, no fallback/implicit access; independently scoped history with safe retained facts, missing historical facts explicit |
| FR-006, FR-007, FR-008, FR-009 | SC-001, SC-007 | Exact-login setup/reset/reissue, required evidence failure, private controls/redemption; S16–19 plus HTTP83/Web60 S21 | DISABLED reset never enables; permitted transient secret controls cleared; lost proof cannot be retrieved via lookup |
| FR-010, FR-011, FR-012, FR-013 | SC-002, SC-004 | Project owner/participation/HTTP/data/atomicity/Chrome S18; shared evaluator22 S21 | No auto-member/grant; Group paths require current membership; no engineering content authority from admin role |
| FR-014, FR-015, FR-016, FR-017 | SC-003, SC-004 | Assignment17/evaluator22 + Inspector14 S22; actual Chrome R02/R03/R05 and Web62 at 9d3732c | Ordinary AA + PA + PRA independently granted to one Actor; exact scope/principal/version, diff/interval; Group filtering is not Group principal |
| FR-018, FR-019, FR-029 | SC-005 | Delegation/recovery/assignment negatives S19/20; Q15 S15/16; immutable seeds/schema16 S21 | No arbitrary self-broadening, built-in mutation or last effective Super removal; no ordinary DESIGN-role grant |
| FR-020, FR-021 | SC-005, SC-006 | Custom15 + browser9 S20; assignment replacement S19; final schema16/Web60 S21 | Candidate is not authority; active content immutable; predecessor assignments/history retained |
| FR-022 | SC-003, SC-004, SC-009 | One evaluator22, Inspector10, actual Chrome I01–I04 S21 | All contributing paths/provenance; advisory RBAC distinct from unexecuted owner business gate |
| FR-023, FR-024, FR-025 | SC-007 | Shared UoW foundation S12–14; owner fault/race/retry S16–20; successor poisoned-scope/replay, atomicity/recovery/read-only/history SELECT failure S22 | Current authority at commit; original committed scope; no partial success; unresolved response ≠ rollback; operation-specific retry |
| FR-026, FR-027, FR-028 | SC-008, SC-009 | Earlier actual journey/browser oracles S16/18/19/20; final I05–I08 and three actual-observation assertion modules S21 | Original authored UI; labels/keyboard/dialog focus/current errors; DESIGN disabled, no second client authority |

SC-008 is the bounded actual tested journeys/controls, not exhaustive accessibility
certification or a claim about every future screen. Native TLS/private controls/CSRF do not
become stored client authority. Current bounded permission availability is 25/25, including real
independent administration history; all eight sealed built-in versions require their unchanged
exact grant envelope. No arbitrary future domain action, general Audit export or DESIGN product
role is made executable.

## 3. Retained evidence and gate

- Final executed application/Web/test/harness: **9d3732cb173e8094195b9bdd60b5588ac3cfa42e**.
- Final Java/Server test source: **1601b6e0f03e91148fb2a0ece723cd3de6080bb7**; only Web parser/manifest changes afterward.
- Successor JARs from the same source, separate actual builds: Inspector **e15e29fe869bf0f6d2b28807a262a569a656fc55c81141f0049141bc3cd13fc5**; Assignment **318a52cf1e658a53bc9fa54137346c15277060667998d2f10f33454d15bb8c1c**. Both exact content oracles pass.
- [Selected Inspector/final Server ledger](inspection-final-runs.tsv), historical
  [Project](project-group-runs.tsv), [Assignment](assignment-runs.tsv), [Custom](custom-role-runs.tsv),
  current [repair execution ledger](review-repair-runs.tsv) and [exact successor F03 schemas](review-repair-f03-schemas.tsv).
- `SELF_MANAGED_MARKED_SCHEMAS` in the final ledger means the existing F03 tests each create/
  remove their own exact source-marked schema via IamRegressionSchemas. It does not mean the
  runner's declared unused schema was created. Actual names are retained in private Maven logs;
  aggregate postflight is zero schemas/public tables. Database retained, no test listener.
- Tracked-secret detector **automated NOT-PASS/exit1/ten reviewed matches** (nine retained in S22
  + dev launcher's private TLS-file read); user's manual PASS report separately retained. No working
  committed credential identified; no exemption, masking, bypass or false automated PASS.
- Private log hashes identify retained artifacts, not independent raw-log access on GitHub.
- **93/93 tasks complete; feature COMPLETED / ACCEPTED / PASS; successor PG5 PASS by human
  approver authority in S23; predecessor independent FAIL retained; verifier NOT-RUN.**
- Reviewed development URL https://localhost:5174/ retains synthetic data and the exact repaired
  application above; no production deployment, live adoption, company data, Desktop or timer
  change. Integration/Issue final state is verified on GitHub after merge.

Next action is explicitly authorized normal PR #47 merge and Issue #46 completed closure after
controlled integration checks. Status publication does not justify new runtime runs; changed
application/test/tooling inputs would require affected successor qualification. Human acceptance
and engineering qualification are not interchangeable evidence classes.
