# DDM Staged-Release Evidence Finding

| Field | Value |
|---|---|
| Document ID | `IE-KNW-DDM-003` |
| Status | Bounded research finding; not a target-runtime fact |
| Question | Does public first-party DDM evidence establish independent subassembly release and the stronger staged-release safeguards proposed for IDEA? |
| Source scope | CSI/DesignDataManager first-party website and official DesignDataManager YouTube channel only |
| Access date | 2026-09-07 |
| Evidence classes | `VENDOR-PUBLIC`, `INFERENCE`, `UNKNOWN`, `IDEA RECOMMENDATION` |
| Product change made | None |

## Conclusion

DDM is publicly evidenced to support **staged release at the selected assembly/subassembly level**. In the official IRONCAD tutorial, the presenter first opens Release Manager for the head-and-body subassembly, expands its related drawings, selects that scope and sets it to Released. The arm assembly is handled separately immediately afterward, and the top-level assembly is only submitted later through the formal workflow. The later workflow removes items that were already Released. Calling the high-level behavior “DDM-evidenced” or “DDM-aligned” is therefore reasonable.

The reviewed public evidence does **not** establish the stronger contract currently described for IDEA: immutable membership pinned to exact Revision and File Version/Generation, automatic dependency gating, atomic no-partial release under failure, or later reconstruction of the exact released set. Those are IDEA safeguards unless an authorized DDM target audit proves them. Public silence is an evidence gap, not proof that DDM lacks them.

## Evidence map

| Question | Finding | Evidence and boundary |
|---|---|---|
| Can one subassembly be released before the whole product? | `VENDOR-PUBLIC — DEMONSTRATED` | At [11:38–12:45](https://www.youtube.com/watch?v=kofHQvmBxvw&t=698s), the official tutorial releases the head-and-body assembly and related drawings. It then treats the arm assembly separately from [12:56](https://www.youtube.com/watch?v=kofHQvmBxvw&t=776s), and later starts the top-level assembly workflow at [14:21](https://www.youtube.com/watch?v=kofHQvmBxvw&t=861s). |
| Do sibling/parent items automatically release with the first subassembly? | `VENDOR-PUBLIC — DEMONSTRATED SEQUENCE` | They do not do so in the shown sequence: the arm is still handled as a separate release candidate, while the top-level release is performed later. At [15:03](https://www.youtube.com/watch?v=kofHQvmBxvw&t=903s), already-Released items are removed from the later approval folder; at [15:59](https://www.youtube.com/watch?v=kofHQvmBxvw&t=959s), the remaining folder items are described as Work in Progress. The tutorial does not define a universal cascade rule for every configuration. |
| Is release scope user-selectable? | `VENDOR-PUBLIC — DEMONSTRATED` | The informal path expands a subassembly, reserves its related items and selects the items to change state. The formal path can include child components and drawings, or be selective, as narrated at [14:37–15:27](https://www.youtube.com/watch?v=kofHQvmBxvw&t=877s). |
| Can a formal review identify a missing required document? | `VENDOR-PUBLIC — DEMONSTRATED, HUMAN CHECK` | At [16:30–17:09](https://www.youtube.com/watch?v=kofHQvmBxvw&t=990s), the checker notices that the instruction sheet was omitted, rejects the workflow, and the originator adds it. This proves a review/rejection path, not an automatic dependency rule or a system-computed completeness gate. |
| Does DDM record exact Revision plus File Version/Generation membership for the release? | `UNKNOWN` | The tutorial exposes item Issue and lifecycle state, and the official tutorial index also demonstrates loading a specific File Version. Neither source shows an immutable Release Record that pins the exact identity of every released artifact. The admitted baseline already records product-structure snapshot pinning as unknown. |
| Is multi-item release atomic, with no partial release after interruption? | `UNKNOWN` | The successful tutorial contains no controlled interruption, rollback, partial-failure or retry test. A successful multi-item UI operation cannot prove its transaction boundary. |
| Can a user later reopen and reproduce the exact original release after newer revisions exist? | `UNKNOWN` | DDM publicly demonstrates specific-version loading and warns about later component Issues, but the reviewed material does not demonstrate reopening one historical release package and reproducing its complete exact membership. |

## What “DDM-aligned” may mean here

| Proposed IDEA behavior | Permitted label from current evidence |
|---|---|
| User selects and confirms a subassembly release scope; unrelated siblings and the parent can continue separately. | `DDM-EVIDENCED / DDM-ALIGNED` at the visible workflow level |
| The workflow can reject a submission when a reviewer detects an omitted required item. | `DDM-EVIDENCED`, specifically as a human review path |
| The system automatically calculates required dependencies and blocks an incomplete release. | `DDM UNKNOWN`; IDEA safeguard if retained |
| The release pins every member to an exact Revision and physical Version/Generation. | `DDM UNKNOWN`; IDEA safeguard if retained |
| Release commits all selected items atomically or none at all. | `DDM UNKNOWN`; IDEA safeguard if retained |
| Any historical release can later be reproduced exactly despite newer item versions. | `DDM UNKNOWN`; IDEA safeguard if retained |

## Recommendation

Use the six-row business explanation as an **IDEA design summary**, not as a claim that DDM publicly proves all six rows. If the immediate objective is limited to visible DDM parity, keep the first two behaviors: explicit selected scope and a release/review workflow. Treat exact baseline pinning, automatic dependency checks, atomicity and exact reproduction as separately justified IDEA quality controls. Do not delete or weaken an already accepted IDEA requirement solely because public DDM evidence is silent; any such scope change belongs to Product Decision Authority.

## First-party sources

All sources were accessed on **2026-09-07**.

1. [DDM IRONCAD Tutorial Videos](https://www.designdatamanager.com/ironcad-tutorials/) — official index and timestamps for product structure, File Version, Release Manager and Change Order demonstrations.
2. [DDM Tutorials — BOM Management and the Release Manager](https://www.youtube.com/watch?v=kofHQvmBxvw) — official DesignDataManager video; the cited narration is from its English auto-generated captions and the displayed workflow.
3. [DDM CAD Course Overview](https://www.designdatamanager.com/services/training-3/ddm-cad-training/) — identifies Release Manager/state changes for CAD structures separately from Issue/Revision Manager.
4. [DDM vendor-public capability baseline](ddm-vendor-public-baseline.md) — admitted `VP-04`, `VP-05`, `VP-07` and `VP-09` propositions plus explicit snapshot, transaction and release unknowns.
5. [DDM target package and runtime audit plan](ddm-target-audit-plan.md) — controlled method required to resolve exact-version, structure-baseline and transaction claims for an identified authorized target.

