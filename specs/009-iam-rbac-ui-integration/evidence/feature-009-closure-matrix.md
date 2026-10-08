# Feature 009 — Engineering Closure Matrix

| Field | Value |
|---|---|
| ID / class / version / state | IE-VR-IAM-UI-CLOSURE-001 / verification crosswalk / 0.1 / Draft engineering reviewer packet |
| Authority / owner / author | INFORMATIVE; no new requirement or gate decision / Project user / Codex, CODEX_ONLY |
| Baseline / date / classification | Accepted spec/design and task package aaa5596a; final production a451459; final package/Web/browser 11bba5f / 2026-10-08 Asia/Ho_Chi_Minh / INTERNAL |
| Reviewer / acceptance / effective | Internal Standards and Spec source reviews recorded separately in section21; independent whole-feature acceptance / PG5 pending / not a deployment authorization |
| Upstream / downstream / change | [Spec](../spec.md), [operations](../contracts/operations.md), [permissions](../contracts/permission-delegation.md), [tasks](../tasks.md) / reviewer handoff / Issue #46, PR #47 |
| Evidence / retention / trigger | [Readiness sections16–21](../integration-readiness.md), exact run ledgers; retain in Git / source, contract, supported rights, graph or environment change |
| Supersession / limits | Historical checkpoints unchanged; no raw-log access, verifier, deployment, live adoption, Desktop or production claim |

## 1. Operation → owner/source → tests → exact execution → disposition

Paths below identify the actual owner implementation, not another implementation workflow.
`S<n>` means the retained exact-source execution table in readiness section `<n>`, not an
unidentified run. Earlier owner suites were not all rerun at the final Inspector SHA. Their
affected shared evaluator, schema, Identity/session and Web boundaries were requalified in S21.
Every row's **external disposition is PENDING**; engineering PASS does not establish PG5.

| Operations | Owner / source | Tests / actual client | Exact executed source / evidence | Engineering status |
|---|---|---|---|---|
| UI-I01, UI-I02 | IAM [IdentityDirectoryQueries](../../../apps/server/src/main/java/com/idea/ddm/identity/IdentityDirectoryQueries.java) | IdentityAccountUiContractTest; Account Web/Chrome; access reads deny wrong scope | S16 historical Account; affected 818ccbdd6b8c15cb8e81ca4bbb2b5ecb0cda7286 S18; Account6 + reissue5 at 0c92f7597ff1dc924a3a40a431d05c4fa3277157 S19; final Web/Chrome11bba5f S21 | IMPLEMENTED / qualified |
| UI-I03, UI-I04 | IAM [IdentityAdministration](../../../apps/server/src/main/java/com/idea/ddm/identity/IdentityAdministration.java), [IdentityAccountAdministration](../../../apps/server/src/main/java/com/idea/ddm/identity/IdentityAccountAdministration.java) | IdentityAccountUiContractTest, AccountIsolationTest, IdentityFlowTest, HttpSessionFlowTest; real Account journey | S16; affected Account/isolation at 818ccbd S18; Identity20 at a451459a2d20cda8f0dcbbc1564bc32570559ace and HTTP83 at 5d60b2765c42017be2b2b04391405730f7e63c89 S21 | IMPLEMENTED / qualified; stable IDs, no implicit grants |
| UI-I05, UI-I06 | IAM [CredentialSetupService](../../../apps/server/src/main/java/com/idea/ddm/identity/CredentialSetupService.java), [CredentialResetService](../../../apps/server/src/main/java/com/idea/ddm/identity/CredentialResetService.java), [IdentityController](../../../apps/server/src/main/java/com/idea/ddm/identity/IdentityController.java) | CredentialProofReissueTest, IdentityAccountUiContractTest, HttpSessionFlowTest; private handoff/recipient UI | S16 Account browser at b50272136295a9f2fed7142ba6442e44c6738d17; T034 15a98ca0281330283614db8e784011afd8532c62 S17; affected reissue S18/S19; HTTP83 at 5d60b27 S21 | IMPLEMENTED / qualified; no proof replay guarantee from metadata |
| UI-P01, UI-P02, UI-P03, UI-P04, UI-P05, UI-P06, UI-P07, UI-P08, UI-P09, UI-P10, UI-P11, UI-P12, UI-P13 | Project Governance [ProjectGovernanceQueries](../../../apps/server/src/main/java/com/idea/ddm/project/ProjectGovernanceQueries.java), [ProjectGovernanceAdministration](../../../apps/server/src/main/java/com/idea/ddm/project/ProjectGovernanceAdministration.java), [ProjectParticipationAdministration](../../../apps/server/src/main/java/com/idea/ddm/project/ProjectParticipationAdministration.java) | ProjectGovernanceHttpContractTest / ContractTest / DataTest / AtomicityTest; actual Project UI/Chrome | HTTP 5f1fca9f6c650381b1e47d7eb426776730367d1a, data f25a3a0de0bc3036368f5ecee318926ef21e97d5, owner/atomicity 818ccbd, browser 1d3fbd4d35650ec2c561032ae605e440a639473c S18; affected HTTP/atomicity S19; final real create/navigation11bba5f S21 | IMPLEMENTED / qualified; administration ≠ technical participation |
| UI-R01, UI-R05, UI-R06, UI-R07, UI-R08, UI-R09 | Access Policy [RoleCatalogueQueries](../../../apps/server/src/main/java/com/idea/ddm/access/RoleCatalogueQueries.java), [RoleAssignmentAdministration](../../../apps/server/src/main/java/com/idea/ddm/access/RoleAssignmentAdministration.java) | RoleAssignmentContractTest / AtomicityTest / RecoveryTest, AuthorizationDecisionTest; original role wizard/Chrome | Assignment17 at b38849831618d7229b6dcf66d6bc95ab5dc65861 S19; affected17 at 31a49b9113163ad44a3cc40dfa6480d3abe55d12 S20; browser 6687439cd6c26ee2612effadba69b4e647b3cf42 S19; final evaluator22/Web60 S21 | IMPLEMENTED / qualified; independent exact-role/version grants; DESIGN options not selectable |
| UI-R02, UI-R03, UI-R04 | Access Policy [RoleDefinitionCandidateService](../../../apps/server/src/main/java/com/idea/ddm/access/RoleDefinitionCandidateService.java), [RoleDefinitionActivationService](../../../apps/server/src/main/java/com/idea/ddm/access/RoleDefinitionActivationService.java) | CustomRoleContractTest / AtomicityTest / ImmutabilityTest; actual authored Custom Role UI/Chrome | HTTP/atomicity/immutable15 at 2a572ba39757b7bd2632de119cc2d508fc7b3bed; browser f223e3ee348847490927b5d484a8b996e4fda173 S20; final Web60/navigation S21 | IMPLEMENTED / qualified; immutable successor, no automatic assignment retarget |
| UI-R10 | Access Policy [AccessInspectionQueries](../../../apps/server/src/main/java/com/idea/ddm/access/AccessInspectionQueries.java), existing [AuthorizationDecisionService](../../../apps/server/src/main/java/com/idea/ddm/access/AuthorizationDecisionService.java) | AccessInspectionContractTest / PrivacyTest / AtomicityTest; AccessInspectionPage Web; Chrome I01/I02/I06 | Inspector10 at a451459; evaluator22 at 89c20f066ac068a843c88fcea00db15f896499a7; Web60/Chrome8 at 11bba5ff7eb583d5f594d8dbcdb4388dd1fe2246 S21 | IMPLEMENTED / qualified; all-path advisory snapshot, owner business gates NOT_EVALUATED |
| UI-A01 | Access Policy refusal boundary [AccessInspectionController](../../../apps/server/src/main/java/com/idea/ddm/access/AccessInspectionController.java); Audit projection not implemented | Inspector contract/privacy; Chrome I03 | a451459 / 11bba5f S21 | DESIGN history projection; IMPLEMENTED fail-closed adapter only. No audit.read unlock |
| UI-O01 | Each respective owner result with separately authorized query in [AccessInspectionQueries](../../../apps/server/src/main/java/com/idea/ddm/access/AccessInspectionQueries.java) | Inspector contract/privacy/no-mutation; Chrome I04/I05; original owner response-loss tests S18–20 | a451459 / 11bba5f S21 | IMPLEMENTED / qualified; non-disclosing UNRESOLVED, safe metadata, never replay. Legacy IAM metadata-only |
| UI-C01 | Access Policy + IAM [SuperSuccessorAdoptionService](../../../apps/server/src/main/java/com/idea/ddm/access/SuperSuccessorAdoptionService.java), [SuperSuccessorAdoptionCommand](../../../apps/server/src/main/java/com/idea/ddm/identity/SuperSuccessorAdoptionCommand.java) | SuperSuccessorAdoptionTest / NegativeTest; actual packaged PTY console and repeat | Exact owner executions S15 and actual package b502721 S16; final regression does not rerun live adoption | IMPLEMENTED / synthetic qualification only; no live-estate authority |

All 32 distinct IDs are represented above. No audit projection or DESIGN role is promoted
merely because a catalogue, refusal adapter, fixture assignment or console path exists.

## 2. Requirements and success criteria

Each row is an engineering PASS within the approved supported profile; all await independent
whole-feature acceptance. Core REQ/IF trace remains in the [spec crosswalk](../spec.md#upstream-and-acceptance-trace)
and [operation owner crosswalk](../contracts/operations.md). No original FR or SC was changed.

| Delivery obligations | Criteria | Source / qualification | Boundary |
|---|---|---|---|
| FR-001, FR-002, FR-003, FR-004, FR-005, FR-030 | SC-001, SC-009 | IAM/context/account rows; S16/17; final F03 20+83 S21 | Recorded native identities, no fallback/implicit access; scoped history read refuses until supported |
| FR-006, FR-007, FR-008, FR-009 | SC-001, SC-007 | Exact-login setup/reset/reissue, required evidence failure, private controls/redemption; S16–19 plus HTTP83/Web60 S21 | DISABLED reset never enables; permitted transient secret controls cleared; lost proof cannot be retrieved via lookup |
| FR-010, FR-011, FR-012, FR-013 | SC-002, SC-004 | Project owner/participation/HTTP/data/atomicity/Chrome S18; shared evaluator22 S21 | No auto-member/grant; Group paths require current membership; no engineering content authority from admin role |
| FR-014, FR-015, FR-016, FR-017 | SC-003, SC-004 | Assignment17/browser9 S19/20; evaluator22 and all-path Inspector10 S21 | Exact scope/principal/version, independent multiple roles; Group filtering is not Group principal |
| FR-018, FR-019, FR-029 | SC-005 | Delegation/recovery/assignment negatives S19/20; Q15 S15/16; immutable seeds/schema16 S21 | No arbitrary self-broadening, built-in mutation or last effective Super removal; no ordinary DESIGN-role grant |
| FR-020, FR-021 | SC-005, SC-006 | Custom15 + browser9 S20; assignment replacement S19; final schema16/Web60 S21 | Candidate is not authority; active content immutable; predecessor assignments/history retained |
| FR-022 | SC-003, SC-004, SC-009 | One evaluator22, Inspector10, actual Chrome I01–I04 S21 | All contributing paths/provenance; advisory RBAC distinct from unexecuted owner business gate |
| FR-023, FR-024, FR-025 | SC-007 | Shared UoW foundation S12–14; owner fault/race/retry S16–20; read-only fault/no-mutation and response loss S21 | Current authority at commit; no partial success; unresolved response ≠ failure/rollback; operation-specific retry |
| FR-026, FR-027, FR-028 | SC-008, SC-009 | Earlier actual journey/browser oracles S16/18/19/20; final I05–I08 and three actual-observation assertion modules S21 | Original authored UI; labels/keyboard/dialog focus/current errors; DESIGN disabled, no second client authority |

SC-008 is the bounded actual tested journeys/controls, not exhaustive accessibility
certification or a claim about every future screen. Native TLS/private controls/CSRF do not
become stored client authority. Current permission availability is 24/25: audit.read stays
DESIGN. Whole built-in versions containing it are not ordinary selectable grants.

## 3. Retained evidence and gate

- Final executed package/Web/browser: **11bba5ff7eb583d5f594d8dbcdb4388dd1fe2246**.
- Final production change: **a451459a2d20cda8f0dcbbc1564bc32570559ace**.
- Final qualified JAR: **79224c146ee3719b83ff083fcc8a8b03de933279028710f835b668cbd7d72a09**.
- [Selected Inspector/final Server ledger](inspection-final-runs.tsv), historical
  [Project](project-group-runs.tsv), [Assignment](assignment-runs.tsv), [Custom](custom-role-runs.tsv).
- `SELF_MANAGED_MARKED_SCHEMAS` in the final ledger means the existing F03 tests each create/
  remove their own exact source-marked schema via IamRegressionSchemas. It does not mean the
  runner's declared unused schema was created. Actual names are retained in private Maven logs;
  aggregate postflight is zero schemas/public tables. Database retained, no test listener.
- Tracked-secret detector **NOT-PASS, eight author-reviewed matches**, independent disposition
  pending. No exemption, masking, detector bypass or automated PASS assertion.
- Private log hashes identify retained artifacts, not independent raw-log access on GitHub.
- **92/93 tasks; T093 pending; PG5 NOT-RUN; verifier NOT-RUN; PR Draft/Open; Issue open.**
- No persistent UI deployment, live console adoption, company data, Desktop, merge or timer change.

Next action is independent whole-feature review of the coherent packet. Publish-only status
changes do not justify new runtime runs; changed application/test/tooling inputs would require
the affected successor qualification. No automatic feature acceptance or integration.
