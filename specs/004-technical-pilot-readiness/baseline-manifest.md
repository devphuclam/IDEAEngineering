# P01 Baseline Manifest

**Manifest ID / version**: `IE-INC-READY-001-BL-001@0.2`
**Prepared**: 2026-09-19; planning-source reconciliation refreshed 2026-09-22
**Status**: Draft; author reconciliation complete through 2026-09-22, project review `NOT-RUN`
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

### 2.1 Superseded PH0 source snapshot (historical only)

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

### 3.2 Current execution-planning baseline

The 21-09-2026 roadmap rebaseline supersedes Appendix A@0.6 for execution planning without changing
the approved Feature, Spec or Tech axes. The selected execution baseline is
`IE-PLAN-DEC2026-003@0.1`, controlled by
[`IE-CHG-ROADMAP-CV0-001`](../../docs/product/instances/idea-engineering/registers/CHG-2026-09-21-core-v0-roadmap-rebaseline.md).

| Source | Current identity | Repository commit | SHA-256 | Use |
|---|---|---|---|---|
| DOC-07 | `IE-PROD-ROADMAP-001@0.16` | `50d780daa14106c5e8c35d2c5ce98041c938f12f` | `89BFCF5FA6B37A9CDF7B3A25547BA01F8303694B70FB55B20113213AA7035645` | Owns the current roadmap and milestone boundary |
| DOC-07 Appendix A | `IE-PROD-ROADMAP-001-APP-A@0.8` | `50d780daa14106c5e8c35d2c5ce98041c938f12f` | `8F4F79D679E683233D59BF7AE9662C204ADE9614E8B7740615914DE02E91E090` | Owns 35 work packages, 512 task hours, 88 technical-reserve hours and 32 operational-buffer hours |
| Kanban CARIO | `IE-PLAN-DEC2026-002-KANBAN@0.4` | `50d780daa14106c5e8c35d2c5ce98041c938f12f` | `75B3CCC4B759FAF2129B8E8598A2B9910342DEAAEE4DE2E8CBAF7DA840C46D81` | Decomposes the work packages into 53 delivery cards and seven zero-hour decision/milestone cards |
| Compiler baseline reference | `IE-PMC-BASELINE-REF-001` for `IE-PLAN-DEC2026-003@0.1` | `50d780daa14106c5e8c35d2c5ce98041c938f12f` | `6F169BC7B2EE16754CE21D18756BEA3B5A44884F9584E61830AD8A214DD8933F` | Machine-readable cross-check only; field-level authority remains in DOC-07, Appendix A and Kanban |

This planning successor starts on 23-09-2026, targets 31-12-2026, uses one configured Vault in
Core v0 and preserves the Artifact Custody/Gateway seam for later multi-vault work. Multi-vault
runtime behavior remains outside the Core v0 exit condition. The rebaseline does not change the
Feature, Spec or Tech approval pinned in Section 1.

## 4. Recorded discrepancies

| ID | Observation | Resolution for PH0 |
|---|---|---|
| `BL-DISC-001` | `FEATURE-001@0.12` still contains pre-meeting wording that says the boss had not decided, while the exact file hash is the one approved later. | The later attributable approval record governs the decision; do not rewrite the approved historical source merely to modernize status prose. |
| `BL-DISC-002` | The current repository contains newer successor sources after the approved commit, and two limited evidence streams now exist: `IE-CHG-PDA-APPROVAL-002` approves only the Approval Policy correction, while `IE-CHG-VAULT-XFER-001` confirms the multi-location custody direction without pinning whole-successor approval. | Section 2 records the exact current source set and mixed authority state. Do not inherit predecessor approval; do not treat either limited evidence stream as approval of the whole successor. T016/D0 still needs an attributable PH1-scope or exact-successor disposition. |
| `BL-DISC-003` | Input Appendix A@0.5 names the old roadmap commit as a P01 prerequisite. | Author-corrected in Appendix A@0.6 under `IE-CHG-PH0-CORR-001`; the current execution successor is Appendix A@0.8 under `IE-CHG-ROADMAP-CV0-001`. `f269a044...` remains the product approval pin, `aabf02ff...` remains plan history, and `IE-PLAN-DEC2026-003@0.1` is the current execution plan. P01 reviewer confirmation remains `NOT-RUN`. |

## 5. P01 exit state

The approved product baseline, later product-source deltas and current execution-planning baseline
are now identifiable from one manifest. The Vault direction is confirmed for the PH1 boundary (one
operational endpoint with a future one-to-many custody contract), but exact successor approval is
still separate. P01 is not declared complete until the project reviewer confirms this manifest and
the three discrepancy dispositions. D0 remains open for its formal T016/PG4 disposition; PG4
remains `NOT-RUN`.

## 6. Author reconciliation record

| Field | Result |
|---|---|
| Reconciled by / date | Principal Product Author / 2026-09-19 |
| Method | Recompute SHA-256 for each current source in section 2 at commit `109c766e369793b0caa2c4cc3a576df528eddb92`; preserve the approved predecessor and the historical input snapshot; compare work-package rows with input commit `4e5c964` |
| Result | `PASS` — current source identities and mixed authority states are recorded; the historical snapshot is explicitly labelled; Appendix A@0.6 and the 35 work-package rows are retained |
| Scope of result | Source identity, authority-state and schedule reconciliation only; this is not P01 reviewer acceptance, Product Decision Authority approval of the whole successor or PG4 evidence |
| Evidence | Author-side reconciliation in this record; P01 reviewer confirmation, exact successor disposition and PG4 remain `NOT-RUN` |

### 6.1 Planning-source refresh

| Field | Result |
|---|---|
| Reconciled by / date | Principal Product Author / 2026-09-22 |
| Method | Compare the selected Core v0 roadmap change, DOC-07@0.16, Appendix A@0.8, Kanban@0.4 and the Compiler baseline reference; recompute their SHA-256 values; verify that the change record declares no Feature, Spec, Tech, Product Scope, Q-15, PDA, PG3 or PG4 change |
| Result | `PASS` — the current execution plan is identified separately from the approved product baseline and historical planning snapshots |
| Scope of result | Planning-source identity and non-impact only; this does not record the Project Reviewer result, resolve D0 or authorize PH1 |
