# DDM Reserve, Reference, and Check-in/Check-out Conflict Model

Date: 2026-08-31
Question: What does DDM establish about Reserve/Reference, Checkout/Check-in, stale or concurrent conflicts, parent-child scope, reservation release/retain, and versioning?
Source policy: CSI/Design Data Manager first-party public material and the repository's admitted evidence baselines only. DDM here means CSI's **Design Data Manager**, not another product using the DDM acronym. No prototype, specification, requirement, or runtime was changed.

## Conclusion

DDM publicly evidences Reserve/Reference workflows, CAD Store/Load, separate File Version and Issue/Revision concepts, and scope-selection controls. It does **not**, in the sources reviewed here, establish a universal `Checkout -> edit -> Check-in -> release reservation` contract or a complete stale/concurrent-write protocol. The admitted [DDM baseline](../product/knowledge/ddm-vendor-public-baseline.md), especially `VP-04`–`VP-06` and its target-unknown register, explicitly preserves these limits.

There is **no admitted DDM `TARGET-RUNTIME FACT` evidence** in that baseline. The repository has relevant icVault runtime tests, but those are a different product and must not be used to fill DDM's gaps. A target-specific DDM answer remains gated by the [authorized target audit plan](../product/knowledge/ddm-target-audit-plan.md).

## 1. Evidence ledger

| Topic | Evidence and exact scope | What remains unknown |
|---|---|---|
| Reserve versus Checkout terminology | `VENDOR-PUBLIC`, historical: a CSI post dated 2016-09-14 says, “Instead of checking items in/out, which runs the risk of being out of date, reserve your items in real time with DDM.” ([2016 SolidWorks post](https://www.designdatamanager.com/2016/09/14/tweet-pdm-for-solidworks-instead-of-checking-items-in/); [official WordPress API record](https://www.designdatamanager.com/wp-json/wp/v2/posts/3400)) | This short marketing statement is not a lock, workspace-freshness, or publish protocol specification. |
| Later Check-in/Check-out terminology | `VENDOR-PUBLIC`, marketing: a CSI post dated 2025-11-03 advertises “check-in/check-out workflows, visual revision histories and fast rollback options.” ([2025 alternative-PDM article](https://www.designdatamanager.com/2025/11/03/embracing-an-alternative-pdm-with-design-data-manager-2/); [official WordPress API record](https://www.designdatamanager.com/wp-json/wp/v2/posts/7798)). The 2025-05-19 IronCAD article also uses file check-in/check-out language. ([2025 IronCAD article](https://www.designdatamanager.com/2025/05/19/unlocking-efficiency-with-ironcad-pdm-our-complete-design-data-management-solution/)) | Whether the vocabulary changed, describes a particular connector, or is only generic marketing. It does not establish that Reserve was removed or that a new protocol replaced it. |
| Reserve and Reference | `VENDOR-PUBLIC`, admitted tutorial evidence: `VP-06` records distinct Reserve/Reference flows and modification-rights language in the Office demonstration. ([Admitted baseline](../product/knowledge/ddm-vendor-public-baseline.md), [official Working with Folders video, 05:05](https://www.youtube.com/watch?v=rlH1fXReZ9Q&t=305s)) | Authoritative owner key; user/folder/workspace binding; Reference persistence, visibility, pinning/latest behavior; whether Reference and Reserve can coexist for the same subject in a target. |
| Selection of related drawings | `VENDOR-PUBLIC`, release-specific: the DDM 2016.03 enhancement post lists an option to include component drawings in the Reserve/Reference-to dialog (`DDMC-3664`). ([2016.03 enhancement](https://www.designdatamanager.com/2016/05/09/ddm-2016-03-whats-new-reserve-to-reference-to-manager-window-enhanced-to-include-drawings/)) | Default scope, recursion depth, parent-child lock independence, eligibility rules, partial acquisition, and atomicity. An inclusion option does not prove an assembly-wide lock. |
| Folder/divider destination | `VENDOR-PUBLIC`, release-specific: the 2016.08 enhancement list identifies choosing a divider within a folder for Reference-to and folder/divider controls in the Reserve/Reference manager. ([2016.08 enhancement](https://www.designdatamanager.com/2016/09/08/ddm-2016-08-whats-new-reserve-to-reference-to-enhancements/)) | The visible destination does not prove the server's ownership identity, permission inheritance, or lock propagation algorithm. |
| Store/Load and File Version | `VENDOR-PUBLIC`, admitted tutorial evidence: `VP-04` records IRONCAD Store/Load and selected File Version flows; `VP-05` distinguishes Issue/Revision from File Version and records Up-Issue/change-note behavior. ([Admitted baseline](../product/knowledge/ddm-vendor-public-baseline.md), [IRONCAD Store/Load video, 01:25](https://www.youtube.com/watch?v=QXWKsTQcaCg&t=85s), [Up-Issue video, 06:40](https://www.youtube.com/watch?v=vc0rVTcmong&t=400s)) | A save's version cardinality; no-op behavior; initial/reset rules; immutability; stale preconditions; file/database commit ordering and recovery. File Version must not automatically be equated to IDEA Generation. |
| Lifecycle release versus revision | `VENDOR-PUBLIC`, training scope: CSI lists Release Manager for changing lifecycle state separately from Issue/Revision Manager for Up-Issue, for both Office documents and CAD structures. ([Office course](https://www.designdatamanager.com/services/training-3/ddm-office-training/), [CAD course](https://www.designdatamanager.com/services/training-3/ddm-cad-training/)) | Lifecycle Release is not evidence of reservation release. The course outline does not define cascading release, exact-version pinning, transactionality, or Check-in disposition. |
| Configurable state effect of Up-Issue | `VENDOR-PUBLIC`, historical release note: `DDMC-4460` discusses configured automatic state changes when Up-Issue changes a prior Released issue to Under Review, and restoring the previous state if the new issue is deleted. ([2016.03 state-change note](https://www.designdatamanager.com/2016/05/09/ddm-2016-03-automatically-modify-state-of-previous-issue-when-deleting-latest-issue-of-an-item/)) | This conditional example is not a universal state machine or proof of immutable release baselines. It reinforces the need to record target configuration. |

The two dated vocabulary sources must be preserved together. Treating the older statement as proof that DDM has no Check-in/Check-out, or treating the newer article as proof of a specific current lock protocol, would overstate the evidence.

## 2. Conflict and scope questions: current disposition

| Scenario | DDM disposition | Evidence needed before a target claim |
|---|---|---|
| B reserves the same item already held by A | `UNKNOWN` beyond public modification-rights language | Two identities; before/after owner state; exact result/denial; server-side enforcement. |
| One user reserves the same subject from two sessions or workspaces | `UNKNOWN` | Owner identity and same-user replay/transfer rules; multi-session test. |
| A holds a parent while B holds a child | `UNKNOWN`; drawing-scope UI is not lock-scope proof | Root-only and explicit bulk acquisition tests with separately registered/reused children. |
| A bulk reserve includes one unavailable child | `UNKNOWN` | Per-item result plus proof of all-or-none or partial-acquisition behavior and cleanup. |
| An external CAD editor saves local bytes without current Reserve | `UNKNOWN` | Separate local-save and server-publish observations; do not equate OS editability with publish authority. |
| A's local version is older after B saves and releases | `UNKNOWN` | Reproducible stale-save test, authoritative version/hash before and after, preserved local-copy evidence. |
| A stale save is rejected without creating a File Version | `UNKNOWN` | Version history, authoritative hashes, request result, and failure/retry evidence. |
| Store/Check-in retains or releases Reserve | `UNKNOWN` | Observe owner state after each supported save/close/release option, including no-op and failure. |
| Client disconnect, crash, abandonment, or administrator recovery | `UNKNOWN` | Identified target's timeout/lease/recovery rules and authorized lab tests. |
| Concurrent updates merge automatically | `UNKNOWN`; no such algorithm is established here | Vendor contract or target demonstration of the specific supported format and merge behavior. |

“Unknown” means not established by the bounded review, not that DDM lacks the behavior. Real-time and rollback marketing are insufficient to prove stale rejection, compare-and-swap, automatic merge, lossless recovery, or atomic multi-file publish.

## 3. Relevant target-runtime comparator — icVault only

The [icVault observed baseline](../product/knowledge/icvault-observed-behavior.md), `IE-KNW-ICV-001`, records client version `1.0.4.5` and observations from 2026-08-13 through 2026-08-26. The following are admitted `TARGET-RUNTIME FACT` results **for that icVault environment, not DDM**:

| icVault tests | Observed result | Limit |
|---|---|---|
| `TH1`, `TH2`, `TH6`, `TH18` | Root and registered related files were separate Checkout subjects; root-only and Checkout-all differed; parent/child ownership could coexist. | Does not establish DDM scope or locking. |
| `TH20` | One conflicting child caused the tested Checkout-all request to acquire none of the requested available files. | One observed bulk flow; simultaneous races and all bulk-command atomicity remain untested. |
| `TH13`, `TH14` | Reference and Checkout coexisted; removing Reference did not cancel Checkout. | icVault-specific relation/visibility behavior, not a DDM Reference definition. |
| `TH4`, `TH7`, `TH10`, `TH11`, `TH15` | Several Check-ins retained Checkout; a no-op returned success without advancing the visible version. | The baseline also records inconsistent earlier release outcomes; the controlling condition remains unknown. |
| `TH16`, `TH21`, `TH22`, `ICV-ID-006`–`008` | Another owner's Checkout blocked publish; a stale local Version 3 was rejected after Version 4 was published and Checkout released; Version 4 was not overwritten and Version 5 was not created. The version-selection screen selected an existing snapshot, not a merge. | Predominantly sequential tests with two accounts; not a simultaneous race, generic merge, or transaction-atomicity proof. |

These results justify asking precise DDM audit questions. They do not justify relabelling an IDEA stale-rejection/reapply flow as DDM parity.

## 4. Implications for the design discussion

`INFERENCE`, not a new IDEA requirement: keep these questions separate when comparing a prototype with DDM:

1. **Edit/publish authority:** who or what holds Reserve, for which selected subject and scope?
2. **Working-copy freshness:** which stored File Version supplied the local copy, and what happens if it changes?
3. **Content/history:** does Store create a new File Version, and what does Up-Issue change?
4. **Reservation disposition:** does the user retain, release, or recover Reserve independently of saving?
5. **Lifecycle:** what exactly does Release Manager change, and for which confirmed structure?

Reserve/Reference management, related-drawing selection, Store/Load, and distinct revision/file-version concepts are DDM-backed capability candidates. `expectedGeneration`, atomic stale rejection, preserve-local-by-default, manual reapply, exact parent-child lock independence, and explicit “save & retain / finish & release” semantics are **not established DDM facts here**. If selected for IDEA, they need their own controlled decision and verification rather than a parity label.

## 5. Provenance and next evidence

- The non-video CSI pages linked above were read on 2026-08-31; the 2016 Reserve and 2025 Check-in terminology pages were also retrieved through Firecrawl into ignored local cache files. Tutorial propositions are reused from admitted baseline `IE-KNW-DDM-001` / `RS-DDM-BL-001` (source SHA-256 `83E2B662BE0408757A475128F3C629570EC7C86972F4271FFC6F6BEFA3262DB2`); this note does not claim a new frame-by-frame video audit.
- The icVault comparator is reused from admitted baseline `RS-ICV-KB-001` (source SHA-256 `6D73923ABAF3AFC057F401514C4C5B16849ADBCB0332061CC0CDC568C2BC3C83`). No raw/proprietary runtime evidence is copied here.
- No DDM installer, licensed manual, database, runtime, or customer configuration was inspected. No claim about current target edition/build, entitlement, enforcement, security, atomicity, recovery, or complete parity is made.
- The next step is the existing [DDM target audit](../product/knowledge/ddm-target-audit-plan.md), especially ranks 4–8 and 12: first identify an authorized target, then test version identity/immutability, save coherence, Reserve/concurrency/recovery, Reference semantics, and product-structure scope. Keep unmet prerequisites `BLOCKED`; do not install or obtain unofficial software to bypass the gate.
