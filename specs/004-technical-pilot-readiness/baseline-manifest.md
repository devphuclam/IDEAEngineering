# P01 Baseline Manifest

**Manifest ID**: `IE-INC-READY-001-BL-001`
**Prepared**: 2026-09-17
**Status**: Draft; author reconciliation complete, project review `NOT-RUN`
**Contract**: [baseline-manifest-contract.md](contracts/baseline-manifest-contract.md)

## 1. Approved predecessor

The authority is [IE-CHG-PDA-APPROVAL-001](../../docs/product/instances/idea-engineering/registers/CHG-2026-09-17-product-decision-authority-approval.md),
which pins the management review to Git commit
`f269a0445737a7efd7f406ee51517149a8967afa`.

| Axis | Approved source | SHA-256 recorded by approval evidence | Disposition |
|---|---|---|---|
| Feature | `FEATURE-001@0.12` — 14 controlled Feature groups | `7EA54E945F8DD110BE73485EBD697FDDAB58DFC34912C8055FA1691DD71A461B` | `APPROVED` |
| Spec | Normative `DOC-04@0.13` — 87 controlled `REQ-*` rows | `8776A83B5BDD2B27AE5164CFFACC84DC1C82D3250AD666376BC965AD22A9AA3D` | `APPROVED` |
| Tech | `TECH-001@0.14` | `D87934ABFBBD475F3EDBA8E345D5B39120CD597F67D82A16057FBA7D77E96FEA` | `APPROVED` |
| Tech support | `IE-KNW-TECH-DEC-001@0.6` | `4C50E83C1B57FF17127A2AAC4E502FE1E1D4D85EC45EF1D187FA00CB0C864166` | Included in approved Tech axis |
| Tech views | `IE-ARC-TECH-VIEW-001@0.2` | `38E66FE86A864BE85AB6139C17877C1DF5322EA17C5D575772FF7FF341B256D0` | Included in approved Tech axis |

Supporting sources used during that review were DOC-01@0.6, DOC-03@0.7, DOC-06@0.16,
DOC-08@0.12 and VVP@0.16. Their exact content is resolved by the pinned approval commit; the approval
record does not publish separate SHA-256 rows for them.

## 2. Later Vault successor Draft

The table records the current source content at repository commit
`4e5c964727e16486ea60fe4b7c3cc7daafed24e1`. These hashes identify the Draft delta; they are not
approval evidence.

| Current source | Version | Current SHA-256 | Authority state |
|---|---:|---|---|
| `DOC-04-software-requirements-specification.md` | 0.14 | `2D3D2FCA07B6F21123EE5BB6A7AE3BE0BEE6208E27805F7B938C9F9BEC848DAE` | Exact successor PDA disposition `NOT-RUN` |
| `DOC-05-architecture-description.md` | 0.21 | `B88DA148D22F288E5B41A6FF0224A574F43418EC2D3938CC5C0D9D74D50350C1` | Draft successor |
| `DOC-06-data-integration-and-migration-specification.md` | 0.17 | `DDAF79E9FF44D46CF71F3104F642F0E8BE274D6D7DEF544C4BCB9FAE781079F0` | Draft successor |
| `DOC-07-mvp-roadmap-and-delivery-plan.md` | 0.14 | `0DC6BDF34D4BEB090571D2B310CC2F10D3C145BD51BA36832A6B44E8E8997869` | Planning source; no product approval effect |
| `DOC-08-ui-ux-and-interaction-specification.md` | 0.13 | `822B6FAE1B3ACEBA15E77C883364EC6580BBE285B77AC270A2C3C3AE85DC51E0` | Draft successor |
| `VVP-core-v0-verification-validation-plan.md` | 0.17 | `BCF7C2097258BD0C850F8A0D99C9BD4C5D6B93E7D72BB5CEB4FBAF4957597543` | Verification procedures `NOT-RUN` |
| `idea-product-lifecycle-architecture.md` | 0.4 | `FDD9421FB41366DB3746DE94137333EE9FBAE6A7DADBD82AAAB7AB25706F0F68` | Proposed; PG3 remains `BLOCKED` as recorded |
| `IDEA-core-v0-technology-architecture-views.md` | 0.3 | `F18A3B181739AA6A813166EB639D9360C8F1395399EDC14DEBFC5AD063D8BB8D` | Exact successor PDA disposition `NOT-RUN` |
| `TECH-001-technology-and-architecture-proposal.md` | 0.15 | `340B68AC8A5259F79A0627B2973FF4033F808571710A0330617FC5E3B8924A72` | Predecessor 0.14 approved; successor 0.15 `NOT-RUN` |
| `CHG-2026-09-17-multi-location-vault-transfer-architecture.md` | 0.1 | `8AAA462CC6D7E7E3838F6BB450F28F1D1F492630EA3B58158D29F45223048244` | Project user selected drafting direction; exact PDA disposition `NOT-RUN` |

## 3. Planning sources at input commit `4e5c964`

| Source | Input identity | SHA-256 | Use |
|---|---|---|---|
| DOC-07 Appendix A | `IE-PROD-ROADMAP-001-APP-A@0.5` | `C45DFA3482B6C821883D254EBC6FE17847215988753A866BBD5BB82CDF6E45C5` | Owns `P01`–`P07` work-package breakdown |
| Technical Pilot Kanban | `IE-PLAN-DEC2026-002-KANBAN@0.3` | `55A2CE9DDA64EFF8DAEE2E4AC88CE1329CE9D990E21C876B17FEEB355A541ABC` | Human work-tracking rendition; does not change authority |
| Approval record | `IE-CHG-PDA-APPROVAL-001@0.1` | `88B1831C684D4186E28F3F5441ECEAE18134073CE937302B047C0DC9B45A224B` | Owns the exact predecessor approval evidence |

The Appendix A reference to `aabf02ffdef4ca901a84d39af5a467d39fd2c0d2` identifies the prior
roadmap snapshot. It is not the Feature/Spec/Tech approval baseline. P01 uses the later approval
record and `f269a044...` for product authority while retaining `aabf02ff...` as plan history.

### 3.1 Author-corrected planning successor

Appendix A@0.6 is the working-tree successor of the input Appendix A@0.5 above. It corrects P01
authority wording and P07 gate terminology under
[IE-CHG-PH0-CORR-001](../../docs/product/instances/idea-engineering/registers/CHG-2026-09-17-ph0-readiness-correction.md).
Its SHA-256 on 2026-09-17 is `C512592FACFBF3A83F9964FB41B3BAD0B8831225856B276309AFC9A2F3321613`.
This is an author-correction pin, not a frozen gate-review commit or a passed P01 review. T004/T023
must reconcile and freeze the actual reviewed source set before any gate decision.

## 4. Recorded discrepancies

| ID | Observation | Resolution for PH0 |
|---|---|---|
| `BL-DISC-001` | `FEATURE-001@0.12` still contains pre-meeting wording that says the boss had not decided, while the exact file hash is the one approved later. | The later attributable approval record governs the decision; do not rewrite the approved historical source merely to modernize status prose. |
| `BL-DISC-002` | The current repository contains successor Spec/Tech sources after the approved commit. | Keep successor hashes in section 2 and require D0 disposition; do not inherit approval. |
| `BL-DISC-003` | Input Appendix A@0.5 names the old roadmap commit as a P01 prerequisite. | Author-corrected in Appendix A@0.6 under `IE-CHG-PH0-CORR-001`: `f269a044...` is the product approval pin and `aabf02ff...` is retained plan history. P01 reviewer confirmation remains `NOT-RUN`. |

## 5. P01 exit state

The baseline and successor delta are now identifiable from one manifest. P01 is not declared
complete until the project reviewer confirms this manifest and `BL-DISC-003` is either corrected in
the planning source or explicitly accepted as a documented discrepancy. D0 and `PG4` remain
`NOT-RUN`.

## 6. Author reconciliation record

| Field | Result |
|---|---|
| Reconciled by / date | Principal Product Author / 2026-09-17 |
| Method | Recompute SHA-256 for each successor source in section 2 and Appendix A@0.6 in section 3.1; compare work-package rows with input commit `4e5c964` |
| Result | `PASS` — all recorded successor hashes match the current sources; Appendix A@0.6 pin matches; 35 work-package rows retain their hours and dependencies |
| Scope of result | Source identity and schedule reconciliation only; this is not P01 reviewer acceptance, Product Decision Authority approval or PG4 evidence |
| Evidence | T004/T005 command output retained in `IE-CHG-PH0-CORR-001`; P01 reviewer confirmation and successor disposition remain `NOT-RUN` |
