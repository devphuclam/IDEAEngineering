# P01 Baseline Manifest

**Manifest ID / version**: `IE-INC-READY-001-BL-001@0.2`
**Prepared**: 2026-09-19; planning-source reconciliation refreshed 2026-09-22; Node.js 24 delta and one-Vault view correction recorded 2026-09-23
**Status**: Draft; P01 reviewer result is recorded separately; later approved deltas retain their own authority records
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

## 2. Current successor source set and mixed authority state

The table records the current source content at repository commit
`109c766e369793b0caa2c4cc3a576df528eddb92`. These hashes identify the exact current source set;
they are not, by themselves, approval evidence. The Product Decision Authority approval recorded in
`IE-CHG-PDA-APPROVAL-002` is limited to the Approval Policy self-approval correction at its own
decision baseline. `IE-CHG-VAULT-XFER-001` records confirmed Multi-location Artifact Custody
direction, but does not approve every current successor hash.

| Axis | Stable document ID | Version | Repository path | Git commit | SHA-256 | Authority record | Disposition | Evidence link |
|---|---|---:|---|---|---|---|---|---|
| Spec | `IE-PROD-SREQ-001` | 0.15 | `docs/product/instances/idea-engineering/DOC-04-software-requirements-specification.md` | `109c766e369793b0caa2c4cc3a576df528eddb92` | `EC5AB1C9D0FA449F2D290AFF9502665F68C58AA9AD44B379249155C124C6C7FF` | [`IE-CHG-PDA-APPROVAL-002`](../../docs/product/instances/idea-engineering/registers/CHG-2026-09-19-pda-approval-approval-policy.md) | `PARTIALLY APPROVED — Approval Policy correction only; remaining successor requirements NOT-RUN` | [`DOC-04`](../../docs/product/instances/idea-engineering/DOC-04-software-requirements-specification.md) |
| Architecture | `IE-PROD-ARCH-001` | 0.22 | `docs/product/instances/idea-engineering/DOC-05-architecture-description.md` | `109c766e369793b0caa2c4cc3a576df528eddb92` | `E03B5577F86883CD1E5374779434CD3B4B4A75B3BF241C812A1E612F266341AA` | [`IE-CHG-PDA-APPROVAL-002`](../../docs/product/instances/idea-engineering/registers/CHG-2026-09-19-pda-approval-approval-policy.md); [`IE-CHG-VAULT-XFER-001`](../../docs/product/instances/idea-engineering/registers/CHG-2026-09-17-multi-location-vault-transfer-architecture.md) | `PARTIALLY APPROVED — policy correction only; Vault direction confirmed; remaining successor architecture approval NOT-RUN` | [`DOC-05`](../../docs/product/instances/idea-engineering/DOC-05-architecture-description.md) |
| Data | `IE-PROD-DATA-001` | 0.18 | `docs/product/instances/idea-engineering/DOC-06-data-integration-and-migration-specification.md` | `109c766e369793b0caa2c4cc3a576df528eddb92` | `2A2B8008265383CC13684853929C30592DAF1E9B1F439F11C6C4AB9D88EC4057` | [`IE-CHG-PDA-APPROVAL-002`](../../docs/product/instances/idea-engineering/registers/CHG-2026-09-19-pda-approval-approval-policy.md); [`IE-CHG-VAULT-XFER-001`](../../docs/product/instances/idea-engineering/registers/CHG-2026-09-17-multi-location-vault-transfer-architecture.md) | `PARTIALLY APPROVED — policy/data correction only; remaining successor data disposition NOT-RUN` | [`DOC-06`](../../docs/product/instances/idea-engineering/DOC-06-data-integration-and-migration-specification.md) |
| Roadmap | `IE-PROD-ROADMAP-001` | 0.14 | `docs/product/instances/idea-engineering/DOC-07-mvp-roadmap-and-delivery-plan.md` | `109c766e369793b0caa2c4cc3a576df528eddb92` | `0DC6BDF34D4BEB090571D2B310CC2F10D3C145BD51BA36832A6B44E8E8997869` | Document control envelope; predecessor Product Decision Authority record remains separate | `PLANNING SOURCE — no product approval effect` | [`DOC-07`](../../docs/product/instances/idea-engineering/DOC-07-mvp-roadmap-and-delivery-plan.md) |
| UI/UX | `IE-PROD-UX-001` | 0.13 | `docs/product/instances/idea-engineering/DOC-08-ui-ux-and-interaction-specification.md` | `109c766e369793b0caa2c4cc3a576df528eddb92` | `822B6FAE1B3ACEBA15E77C883364EC6580BBE285B77AC270A2C3C3AE85DC51E0` | [`IE-CHG-VAULT-XFER-001`](../../docs/product/instances/idea-engineering/registers/CHG-2026-09-17-multi-location-vault-transfer-architecture.md) for direction only | `SUCCESSOR DRAFT — exact successor approval NOT-RUN` | [`DOC-08`](../../docs/product/instances/idea-engineering/DOC-08-ui-ux-and-interaction-specification.md) |
| Verification | `IE-VVP-CORE-001` | 0.18 | `docs/product/instances/idea-engineering/registers/VVP-core-v0-verification-validation-plan.md` | `109c766e369793b0caa2c4cc3a576df528eddb92` | `66259876425120D62F2E94808BAE21D159A3D53A97137E71D1E3A2113AD539A8` | [`IE-CHG-PDA-APPROVAL-002`](../../docs/product/instances/idea-engineering/registers/CHG-2026-09-19-pda-approval-approval-policy.md) | `PARTIALLY APPROVED — policy verification additions only; procedures and results NOT-RUN` | [`VVP`](../../docs/product/instances/idea-engineering/registers/VVP-core-v0-verification-validation-plan.md) |
| Product architecture | `IE-ARC-C1-001` | 0.4 | `docs/architecture/idea-product-lifecycle-architecture.md` | `109c766e369793b0caa2c4cc3a576df528eddb92` | `FDD9421FB41366DB3746DE94137333EE9FBAE6A7DADBD82AAAB7AB25706F0F68` | [`IE-CHG-VAULT-XFER-001`](../../docs/product/instances/idea-engineering/registers/CHG-2026-09-17-multi-location-vault-transfer-architecture.md) | `CONFIRMED DIRECTION — exact successor architecture approval NOT-RUN; PG3 remains BLOCKED` | [`lifecycle architecture`](../../docs/architecture/idea-product-lifecycle-architecture.md) |
| Technology views | `IE-ARC-TECH-VIEW-001` | 0.3 | `docs/product/instances/idea-engineering/technology/IDEA-core-v0-technology-architecture-views.md` | `109c766e369793b0caa2c4cc3a576df528eddb92` | `759996C252A9AFCB3DCFE190EE72756888DAD13D62E57D905D0694A3854C1F0E` | [`IE-VEV-VAULT-XFER-002`](../../docs/product/instances/idea-engineering/registers/VEV-2026-09-18-vault-transfer-diagram-review.md); [`IE-CHG-VAULT-XFER-001`](../../docs/product/instances/idea-engineering/registers/CHG-2026-09-17-multi-location-vault-transfer-architecture.md) | `AUTHOR-REVIEWED RENDITION; exact successor PDA approval NOT-RUN` | [`technology view set`](../../docs/product/instances/idea-engineering/technology/IDEA-core-v0-technology-architecture-views.md) |
| Tech brief | `TECH-001` | 0.15 | `docs/product/instances/idea-engineering/decision-briefs/TECH-001-technology-and-architecture-proposal.md` | `109c766e369793b0caa2c4cc3a576df528eddb92` | `340B68AC8A5259F79A0627B2973FF4033F808571710A0330617FC5E3B8924A72` | [`IE-CHG-PDA-APPROVAL-002`](../../docs/product/instances/idea-engineering/registers/CHG-2026-09-19-pda-approval-approval-policy.md); predecessor [`IE-CHG-PDA-APPROVAL-001`](../../docs/product/instances/idea-engineering/registers/CHG-2026-09-17-product-decision-authority-approval.md) | `PARTIALLY APPROVED — policy correction only; Tech successor disposition NOT-RUN; Q-15 unchanged` | [`TECH-001`](../../docs/product/instances/idea-engineering/decision-briefs/TECH-001-technology-and-architecture-proposal.md) |
| Product spec brief | `SPEC-001` | 0.15 | `docs/product/instances/idea-engineering/decision-briefs/SPEC-001-product-specification.md` | `109c766e369793b0caa2c4cc3a576df528eddb92` | `2F70D77D4D637206292C157FE62732F8D8AA23B7176EE5942390D0FF6FCD47DE` | [`IE-CHG-PDA-APPROVAL-002`](../../docs/product/instances/idea-engineering/registers/CHG-2026-09-19-pda-approval-approval-policy.md) | `PARTIALLY APPROVED — policy correction only; remaining successor brief NOT-RUN` | [`SPEC-001`](../../docs/product/instances/idea-engineering/decision-briefs/SPEC-001-product-specification.md) |
| Vault change record | `IE-CHG-VAULT-XFER-001` | 0.2 | `docs/product/instances/idea-engineering/registers/CHG-2026-09-17-multi-location-vault-transfer-architecture.md` | `109c766e369793b0caa2c4cc3a576df528eddb92` | `399B210E69BE686DC39D8BA5DA3EE065918BAE9A1E8A0A1360B98A044A6F3408` | Record itself; project user and Product Decision Authority confirmation in §3.1 | `CONFIRMED DESIGN DIRECTION — PH1 may use one endpoint; exact successor source approval and runtime qualification remain open` | [`IE-CHG-VAULT-XFER-001`](../../docs/product/instances/idea-engineering/registers/CHG-2026-09-17-multi-location-vault-transfer-architecture.md) |
| Approval-policy change | `IE-CHG-APPROVAL-POLICY-001` | 0.1 | `docs/product/instances/idea-engineering/registers/CHG-2026-09-19-approval-policy-self-approval.md` | `109c766e369793b0caa2c4cc3a576df528eddb92` | `BE07050EB80A5FE7A81322276F2AECE420689FEFF58C78C270A912C00087F7E7` | [`IE-CHG-PDA-APPROVAL-002`](../../docs/product/instances/idea-engineering/registers/CHG-2026-09-19-pda-approval-approval-policy.md) | `PDA APPROVED — policy correction only; no implementation or gate authorization` | [`approval-policy change`](../../docs/product/instances/idea-engineering/registers/CHG-2026-09-19-approval-policy-self-approval.md) |
| PDA approval record | `IE-CHG-PDA-APPROVAL-002` | 0.1 | `docs/product/instances/idea-engineering/registers/CHG-2026-09-19-pda-approval-approval-policy.md` | `109c766e369793b0caa2c4cc3a576df528eddb92` | `A05720BCE10F5C17D23C68F4CC86841D453E357E7FE5517532E182623F35BA2E` | Record itself; Product Decision Authority, 2026-09-19 | `AUTHORITY RECORD — limited approval of Approval Policy correction; not approval of the whole successor set` | [`IE-CHG-PDA-APPROVAL-002`](../../docs/product/instances/idea-engineering/registers/CHG-2026-09-19-pda-approval-approval-policy.md) |
| Vault rendition evidence | `IE-VEV-VAULT-XFER-002` | 0.1 | `docs/product/instances/idea-engineering/registers/VEV-2026-09-18-vault-transfer-diagram-review.md` | `109c766e369793b0caa2c4cc3a576df528eddb92` | `2A6A443A8765F824C38B4087CEF68F36D0DF70E83BF0BF20D33A536AC68FC9C7` | Record itself; author-focused rendition review | `EVIDENCE ONLY — rendering/source correspondence; runtime and exact successor acceptance NOT-RUN` | [`IE-VEV-VAULT-XFER-002`](../../docs/product/instances/idea-engineering/registers/VEV-2026-09-18-vault-transfer-diagram-review.md) |

### 2.1 Approved Node.js 24 Web-build delta — 2026-09-23

The Product Decision Authority approved Node.js 24 LTS as the IDEA Web-build family after the P01
review baseline was recorded. This limited decision does not retroactively change the P01 review
input and does not approve every successor delta. For current P04 execution, the rows below
supersede only the technology matrix, Tech brief and technology-view rows in Section 2.

| Source | Current identity | SHA-256 | Authority / disposition |
|---|---|---|---|
| Technology Decision Matrix | `IE-KNW-TECH-DEC-001@0.7` | `2ADD647A1453605D883A1C9FD1497619367A4F13E9AADD0FBCFA1FEB4CE6C525` | Node.js 24 Web-build family `APPROVED`; other authority states follow their records |
| Tech brief | `TECH-001@0.16` | `E928B1ECE0AB10C81495775E85D5B1352D390BEAA4A53C63D5E0D52EAAC1998F` | Node.js 24 Web-build family `APPROVED`; exact Web build `NOT-RUN` |
| Technology views | `IE-ARC-TECH-VIEW-001@0.4` | `E2F63222BA343479A7A4493A6E0F33C52A34F648B25A9A50645B1223562C938E` | TECH-D07 updated; source/rendition review separate from runtime qualification |
| Change authority | `IE-CHG-TECH-NODE24-001@0.1` | `3FED5F295782CA20F443BAB2C9C633A758BE8F10C5B64EB3FEF03A00D17F8885` | Current limited approval record |
| Research evidence | `IE-RES-NODE24-20260923-001@0.1` | `8B8F3AE6A9D7AAE4990A6FD0A55E88E3581210F768FB3D349927A1A0BB092FFF` | Official lifecycle/compatibility/license facts plus local observation; informative only |

These hashes identify the working-copy source prepared for the controlled successor. A repository
commit pin is `NOT-YET-RECORDED`; no uncommitted source is represented as if it had a Git commit ID.
Q-15 remains `PARTIAL / NO WINNER`; Product Scope, PG3 and PG4 are unchanged.

### 2.2 Core v0 one-Vault view correction — 2026-09-23

The current technology view set keeps the selected multi-vault extension boundary but depicts only
one configured Vault in the Core v0 runtime. A future second Vault is marked `DEFER`; it is not a
Core v0 deployment claim. This consistency correction changes neither the selected technology stack
nor the approved Node.js 24 Web-build decision.

| Source | Current identity | SHA-256 | Authority / disposition |
|---|---|---|---|
| Technology views | `IE-ARC-TECH-VIEW-001@0.5` | `C2CD8A579AE80731D0152296290F5532C4C7836C1198A74BC4F46B90ADB4D29E` | One-Vault Core v0 depiction corrected; future multi-vault seam retained; product authority unchanged |
| Change record | `IE-CHG-PH0-CORR-002@0.1` | `NOT-YET-RECORDED` | Documentary consistency correction only |
| Rendition evidence | `IE-VEV-TECH-VIEW-004@0.1` | `NOT-YET-RECORDED` | Source/render/open and focused author-review evidence only; runtime and independent review `NOT-RUN` |

### 2.3 Superseded PH0 source snapshot (historical only)

The earlier source snapshot at commit `4e5c964727e16486ea60fe4b7c3cc7daafed24e1` is retained for
traceability. Its versions and hashes are historical inputs to the earlier author reconciliation;
they must not be used as the current review baseline or treated as current authority evidence.

| Source | Historical version | Historical SHA-256 |
|---|---:|---|
| DOC-04 | 0.14 | `2D3D2FCA07B6F21123EE5BB6A7AE3BE0BEE6208E27805F7B938C9F9BEC848DAE` |
| DOC-05 | 0.21 | `B88DA148D22F288E5B41A6FF0224A574F43418EC2D3938CC5C0D9D74D50350C1` |
| DOC-06 | 0.17 | `DDAF79E9FF44D46CF71F3104F642F0E8BE274D6D7DEF544C4BCB9FAE781079F0` |
| DOC-07 | 0.14 | `0DC6BDF34D4BEB090571D2B310CC2F10D3C145BD51BA36832A6B44E8E8997869` |
| DOC-08 | 0.13 | `822B6FAE1B3ACEBA15E77C883364EC6580BBE285B77AC270A2C3C3AE85DC51E0` |
| VVP | 0.17 | `BCF7C2097258BD0C850F8A0D99C9BD4C5D6B93E7D72BB5CEB4FBAF4957597543` |
| Lifecycle architecture | 0.4 | `FDD9421FB41366DB3746DE94137333EE9FBAE6A7DADBD82AAAB7AB25706F0F68` |
| Technology views | 0.3 | `F18A3B181739AA6A813166EB639D9360C8F1395399EDC14DEBFC5AD063D8BB8D` |
| TECH-001 | 0.15 | `340B68AC8A5259F79A0627B2973FF4033F808571710A0330617FC5E3B8924A72` |
| Vault change record | 0.1 | `8AAA462CC6D7E7E3838F6BB450F28F1D1F492630EA3B58158D29F45223048244` |

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

### 3.2 P01-reviewed execution-planning baseline

The 21-09-2026 roadmap rebaseline supersedes Appendix A@0.6 for execution planning without changing
the approved Feature, Spec or Tech axes. This is the execution baseline reviewed for P01 on
22-09-2026: `IE-PLAN-DEC2026-003@0.2`, controlled by
[`IE-CHG-PLAN-ID-001`](../../docs/product/instances/idea-engineering/registers/CHG-2026-09-22-planning-card-identity-correction.md)
over the roadmap rebaseline in `IE-CHG-ROADMAP-CV0-001`.

| Source | Reviewed identity | Repository commit | Git-blob SHA-256 | Use |
|---|---|---|---|---|
| DOC-07 | `IE-PROD-ROADMAP-001@0.17` | `303b7225ebd0fab1cbef850c6dbc4881d960672b` | `84016B6667FD97B6B3A40ED73F87B18A7FA743ABED0CF363429BB9A0A637E6DD` | Owns the reviewed roadmap and milestone boundary |
| DOC-07 Appendix A | `IE-PROD-ROADMAP-001-APP-A@0.9` | `303b7225ebd0fab1cbef850c6dbc4881d960672b` | `8F032464D798F301A23FE6EA1B98524F42C970136B1AB22188B4C2C741899ABC` | Owns the reviewed 35 work packages and capacity split |
| Kanban CARIO | `IE-PLAN-DEC2026-002-KANBAN@0.5` | `303b7225ebd0fab1cbef850c6dbc4881d960672b` | `DE0230A38C089C7D06CDA55CAA6F3A98745A22E77BD1D872025A3AF454DB3539` | Decomposes the reviewed work packages into delivery cards and decision/milestone cards |
| Compiler baseline reference | `IE-PMC-BASELINE-REF-001` for `IE-PLAN-DEC2026-003@0.2` | `303b7225ebd0fab1cbef850c6dbc4881d960672b` | `37051195F5D47265F932C55525D5BB250E0404D2AED54524723D40534FEDC582` | Machine-readable cross-check only; field-level authority remains in DOC-07, Appendix A and Kanban |

The reviewed planning successor starts on 23-09-2026, targets 31-12-2026, uses one configured Vault in
Core v0 and preserves the Artifact Custody/Gateway seam for later multi-vault work. Multi-vault
runtime behavior remains outside the Core v0 exit condition. The rebaseline does not change the
Feature, Spec or Tech approval pinned in Section 1.

The exact, self-contained review evidence is
[`P01-BASELINE-001-reviewed-manifest.json`](evidence/P01-BASELINE-001-reviewed-manifest.json),
SHA-256 `28F33DE52C0B4C69888EBAE3F28006C1620F90EEFDF8C4ED696016A15D1F3594`. It records the
reviewed source IDs, commit, Git-blob hashes, accepted discrepancies, result and limitations without
depending on mutable prose in this manifest.

### 3.3 Current execution-planning successor

After the review commit, three non-material planning-source corrections normalized machine-readable
dates and expanded dependency references without changing identity, scope, capacity, milestones,
the 31-12 target or the one-Vault Core v0 boundary. The current committed source pin is
`8c3e1af75082b0de4a1bfcdfa13598003744e884` and remains `IE-PLAN-DEC2026-003@0.2`.

| Source | Current identity | Repository commit | Git-blob SHA-256 | Use |
|---|---|---|---|---|
| DOC-07 | `IE-PROD-ROADMAP-001@0.17` | `8c3e1af75082b0de4a1bfcdfa13598003744e884` | `198E1D5D2D611B5410CE08B179645A862F7A6CB843732F3ABD2C9191D8E6C5C0` | Current roadmap and milestone authority |
| DOC-07 Appendix A | `IE-PROD-ROADMAP-001-APP-A@0.9` | `8c3e1af75082b0de4a1bfcdfa13598003744e884` | `6BD7A74E8FE12F87142D0CD64271DB8DC12EBC52B1DD275A571726A540717D72` | Current work-package and capacity authority |
| Kanban CARIO | `IE-PLAN-DEC2026-002-KANBAN@0.5` | `8c3e1af75082b0de4a1bfcdfa13598003744e884` | `E674D4EF4E17BABC723CD44F0D5E3EB62080595FA5BE4015CA1E6538392AF1B4` | Current delivery-card authority |
| Compiler baseline reference | `IE-PMC-BASELINE-REF-001` for `IE-PLAN-DEC2026-003@0.2` | `8c3e1af75082b0de4a1bfcdfa13598003744e884` | `37051195F5D47265F932C55525D5BB250E0404D2AED54524723D40534FEDC582` | Machine-readable cross-check only |

P01 remains `PASS` for its exact reviewed input in Section 3.2. This later planning successor is a
separate controlled delta and must be included in the T023 freeze before PG4; it does not reopen or
erase the recorded P01 result.

## 4. Recorded discrepancies

| ID | Observation | Resolution for PH0 |
|---|---|---|
| `BL-DISC-001` | `FEATURE-001@0.12` still contains pre-meeting wording that says the boss had not decided, while the exact file hash is the one approved later. | The later attributable approval record governs the decision; do not rewrite the approved historical source merely to modernize status prose. |
| `BL-DISC-002` | The current repository contains newer successor sources after the approved commit, and two limited evidence streams now exist: `IE-CHG-PDA-APPROVAL-002` approves only the Approval Policy correction, while `IE-CHG-VAULT-XFER-001` confirms the multi-location custody direction without pinning whole-successor approval. | Section 2 records the exact current source set and mixed authority state. Do not inherit predecessor approval; do not treat either limited evidence stream as approval of the whole successor. T016/D0 still needs an attributable PH1-scope or exact-successor disposition. |
| `BL-DISC-003` | Input Appendix A@0.5 names the old roadmap commit as a P01 prerequisite. | Author-corrected in Appendix A@0.6 under `IE-CHG-PH0-CORR-001`; P01 reviewed Appendix A@0.9, Kanban@0.5 and plan `IE-PLAN-DEC2026-003@0.2` at `303b7225...` and recorded `PASS`. The `@0.1` planning baseline remains its predecessor. The reviewed `@0.2` input changes no Product Scope or product decision and is included in the future T023 freeze. |

## 5. P01 exit state

The approved product baseline, later product-source deltas, P01-reviewed planning baseline and current
planning successor are identifiable from one manifest. The Project Reviewer recorded P01
`COMPLETE / PASS` on 22-09-2026 for the exact Git source in Section 3.2 and accepted the three
discrepancy dispositions. The Vault direction remains one operational endpoint for Core v0 with a
future one-to-many custody seam. Exact successor approval remains separate, D0 remains open for its
formal T016/PG4 disposition, and PG4 remains `NOT-RUN`.

## 6. Author reconciliation record

| Field | Result |
|---|---|
| Reconciled by / date | Principal Product Author / 2026-09-19 |
| Method | Recompute SHA-256 for each current source in section 2 at commit `109c766e369793b0caa2c4cc3a576df528eddb92`; preserve the approved predecessor and the historical input snapshot; compare work-package rows with input commit `4e5c964` |
| Result | `PASS` — current source identities and mixed authority states are recorded; the historical snapshot is explicitly labelled; Appendix A@0.6 and the 35 work-package rows are retained |
| Scope of result | Historical author reconciliation only; the later Project Reviewer result is recorded separately and does not create Product Decision Authority approval of the whole successor or PG4 evidence |
| Evidence | Author-side reconciliation in this section; P01 later became `PASS`, while exact successor disposition and PG4 remain `NOT-RUN` |

### 6.1 Planning-source refresh

| Field | Result |
|---|---|
| Reconciled by / date | Principal Product Author / 2026-09-22 |
| Method | Compare the P01-reviewed plan `0.1` at commit `303b7225...` with the current plan `0.2` at commit `8c3e1af7...`; compute SHA-256 from Git blob bytes; verify that `IE-CHG-PLAN-ID-001` declares no Feature, Spec, Tech, Product Scope, Q-15, PDA, PG3 or PG4 change |
| Result | `PASS` — the reviewed planning input and current planning successor are separately identified and reproducible |
| Scope of result | Planning-source identity and non-impact only; P01 remains the recorded Project Reviewer result for its exact input; this correction does not resolve D0 or authorize PH1 |
