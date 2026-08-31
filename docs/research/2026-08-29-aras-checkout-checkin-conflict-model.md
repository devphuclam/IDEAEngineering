# Aras Claim, Check-in/Check-out, and Stale-Content Conflict Model

Date: 2026-08-29  
Question: How does Aras Innovator handle claim/lock, edit/save, unclaim/unlock, versionable generations, concurrent or stale updates, files/documents, and recovery from conflicts? How should those observations inform the current IDEA prototype flow?  
Source policy: This note uses first-party Aras documentation and Aras-published release notes only. Platform behavior, Product Engineering behavior, connector behavior, and configuration-dependent behavior are kept separate. Aras observations are competitor evidence and are not, by themselves, IDEA requirements or a parity claim.

## Short answer

Aras does not document one universal `Checkout -> Check-in -> Release` state machine. The vocabulary and boundary depend on the layer:

- **Core platform:** an Item is locked/claimed, updated, optionally versioned, and unlocked. The built-in `edit` action is a convenience sequence (lock, update, unlock); `version` creates a new generation and applies an update to it. ([Methods, Platform 33](https://docs.aras.com/methods/0000019f-d65e-d08f-a1df-df7e64130000))
- **Product Engineering (PE):** versionable ItemTypes use Claim/Save/Unclaim and lifecycle promotion. Claiming prevents another user from editing; a Claim-Save-Unclaim cycle creates a new generation, while a released revision requires a new revision before further edits. ([Item Claiming, Release 32](https://www.aras.com/community/documentationlibrary/Innovator/32/Content/Innovator%2024%20Docs/Aras%20PE%2014%20-%20User%27s%20Guide/Item%20Claiming.htm), [Versioning and Promoting, Platform 33](https://docs.aras.com/aras-innovator-platform-33/versioning-and-promoting/0000019f-179e-dcff-a7bf-5f9f80ee0000))
- **Modern platform UI:** since the Aras Innovator 2023 release, Claim is independent of Edit. A claim can remain across Done/Discard, tab closure, and sessions; the item is unlocked only when it is neither claimed nor in Edit. ([2023 Release Notes](https://aras.com/wp-content/uploads/2024/04/Aras-Innovator-2023-Release-Release-Notes.pdf), section 1.1.2)
- **Document/file applications:** a Document is versionable but a File Item is immutable/non-versionable; changing a Document replaces its File reference in a new Document version. The Office Connector and Technical Documentation Framework (TDF) provide explicit outdated/stale warnings with replace/discard/cancel choices, not a documented general-purpose binary merge. ([Managing Document Files, Release 32](https://www.aras.com/community/documentationlibrary/Innovator/32/Content/Innovator%2024%20Docs/Aras%20PE%2014%20-%20User%27s%20Guide/Managing%20Document%20Files.htm), [File Handling Overview, Release 32](https://www.aras.com/community/documentationlibrary/Innovator/32/Content/Innovator%2024%20Docs/File%20Handling/Overview.htm), [Creating Content, Platform 33](https://docs.aras.com/aras-innovator-platform-33/creating-content/0000019f-1799-dcff-a7bf-5f99d8420000))

The strongest lesson for IDEA is to separate **edit authority**, **local working-copy freshness**, **generation/revision identity**, and **lifecycle/release state**. A stale publish must be rejected atomically and preserve local work. The current IDEA `Refresh baseline -> Reapply local changes -> Check-in` sequence is a deliberate, safer IDEA reconciliation policy; it is not a command sequence established by the Aras documents reviewed here.

## Evidence by layer

| Layer and source | Documented behavior | What is not established by that source |
|---|---|---|
| Core platform methods ([Methods](https://docs.aras.com/methods/0000019f-d65e-d08f-a1df-df7e64130000)) | `update` requires a locked Item. For a versionable Item, the first update after locking creates a new version unless `version='0'` is supplied. `edit` performs lock/update/unlock. `lock` and `unlock` expose the corresponding Item operations. `version` creates a new generation, moves the lock to the new generation, and then updates it. | The page does not define a universal optimistic-concurrency token, merge algorithm, lease expiry, or a UI-level Check-in contract for every ItemType. |
| Core API / OData ([OData Interface](https://docs.aras.com/aras-innovator-platform-33/aras-innovator-odata-interface/0000019f-179d-dcff-a7bf-5f9de2b60000)) | OData exposes `PATCH` operations corresponding to edit, update, lock, and unlock. OData Change Sets are documented as an atomic group of modifications/actions: a failure rolls the set back. | The reviewed OData material does not define `expectedGeneration` compare-and-swap semantics or show that every PE/UI save uses one Change Set. `If-Match:*` is an upsert/AML-merge form, not evidence of a strict generation precondition. |
| PE claiming and Item view ([Item Claiming](https://www.aras.com/community/documentationlibrary/Innovator/32/Content/Innovator%2024%20Docs/Aras%20PE%2014%20-%20User%27s%20Guide/Item%20Claiming.htm), [Item View](https://www.aras.com/community/documentationlibrary/Innovator/32/Content/Innovator%2024%20Docs/Aras%20PE%2014%20-%20User%27s%20Guide/Item%20View.htm)) | Claim explicitly locks an item; only the claimant may edit. The UI shows a different claim flag for self/another user. Save continues editing; Done saves and unclaims; Discard reverts and unclaims; Refresh loads latest information; Edit claims and enters edit mode. | These pages are PE 14 / Release 32 application guidance. They do not describe every newer platform mode, custom lifecycle, server event, or crash/lease recovery policy. |
| Modern claim/edit separation ([Innovator 2023 Release Notes](https://aras.com/wp-content/uploads/2024/04/Aras-Innovator-2023-Release-Release-Notes.pdf)) | Claim and Edit are independent. Done/Discard or closing a tab/session does not remove a claim. `locked_by_id` remains set while either Claim or Edit is active and clears only when neither is active. Persistent Claim can span edit cycles/sessions and can avoid excess automatic versions. | This is a release-specific enhancement. It does not mean every older PE guide, connector, or customer configuration has identical labels or defaults. |
| PE versioning/lifecycle ([Versioning and Promoting](https://docs.aras.com/aras-innovator-platform-33/versioning-and-promoting/0000019f-179e-dcff-a7bf-5f9f80ee0000)) | Versionable Items retain history as generations. Claim -> Save -> Unclaim creates a new generation. A Released revision cannot be changed; further work requires a new revision in Preliminary. Promotion follows a configured lifecycle. | The page does not say that every promotion creates a generation, nor that all deployments use the same states, revision rules, or approval workflow. |
| PE Documents/files ([Managing Document Files](https://www.aras.com/community/documentationlibrary/Innovator/32/Content/Innovator%2024%20Docs/Aras%20PE%2014%20-%20User%27s%20Guide/Managing%20Document%20Files.htm), [File Handling Overview](https://www.aras.com/community/documentationlibrary/Innovator/32/Content/Innovator%2024%20Docs/File%20Handling/Overview.htm)) | Files live in the Vault and are not versionable. File Items are immutable and cannot be updated directly. A versionable Document is edited, then its File reference is added/replaced/removed; old Document versions keep references to old Files. | This does not establish a filesystem-style file lock, binary diff/merge, or how a custom CAD connector handles every representation. |
| TDF stale referenced content ([Creating Content](https://docs.aras.com/aras-innovator-platform-33/creating-content/0000019f-1799-dcff-a7bf-5f99d8420000)) | TDF tracks the modification timestamp of referenced content. If the referenced Item changed independently, a stale-content dialog offers **Save** (overwrite the referenced changes), **Discard Local Changes** (revert to latest), or **Cancel** (no update). Explicit and implicit edit modes have different lock/update/unlock sequences. | This is TDF application behavior, not a platform-wide merge protocol. It documents overwrite/revert choices, not a three-way merge or field-level/binary merge. |
| Office Connector 27 ([User Guide PDF](https://www.aras.com/community/DocumentationLibrary/ALL%20PDFs/Flare%20PDF/Flare%20PDF/OC/27/Aras%20Office%20Connector%2027%20-%20User%20Guide.pdf)) | Edit auto-claims; Save to Aras keeps the claim; Save and Close removes it. An outdated local file can use Get Latest Version after a warning that local changes will be lost. If the local file is newer than Aras, the documented choices are Keep Current File, Get Aras File, or Cancel. A complete Claim -> Save -> Unclaim cycle creates one generation; repeated saves in the same cycle update that generation. | Connector behavior is not proof of core PE behavior in all releases. The guide does not describe automatic Office/CAD binary merging or a server-side generation CAS. |
| Claim conflict UX ([Innovator 29 Release Notes](https://aras.com/wp-content/uploads/2024/04/Aras-Innovator-29-Release-Notes.pdf)) | Aras fixed claim/unclaim behavior and error messages for attempts from multiple sessions/applications; messages provide conflict-resolution guidance, and non-conflicting retries can continue without interruption. | The release note confirms that conflict UX exists, but does not specify a complete Refresh/Reapply workflow, stale Check-in transaction, or lease-recovery algorithm. |

## Aras behavior in the scenarios that matter here

### 1. One editor and repeated saves

The older PE user-guide flow is Claim (explicitly or implicitly through Edit), Save while continuing to edit, then Done to save and unclaim. Discard reverts the unsaved work and unclaims. In the newer platform, Claim and Edit are independent: an author can keep a persistent claim while opening and closing several edit cycles. This is important because **Save/Done is not universally the same thing as releasing edit authority**. The release notes explicitly describe persistent claims as a way to avoid creating an automatic version for every edit cycle.

For IDEA, the equivalent should be two independent facts:

1. who owns the Reservation and whether it is a persistent hold or an edit-session hold; and
2. whether the working copy has unsaved/dirty changes.

### 2. A second user tries to edit

Claim is the documented authority boundary: another user sees the item as claimed by someone else and cannot edit it. Aras release notes show that same-item, multi-session claim conflicts are a supported UX concern, with guidance in the error message. The reviewed public material does not establish a universal force-takeover rule, a timeout/lease policy, or what happens after every kind of client crash. Those must remain configuration/unknown questions until a specific Aras deployment is tested.

### 3. A local document becomes stale

The Office Connector gives the clearest user-facing precedent. When the local file is outdated, Get Latest Version warns that local changes will be lost and replaces the session file after confirmation. If the local file is newer, the user can keep the local file, fetch the Aras file, or cancel. TDF has a similar stale-content warning, but its Save option explicitly overwrites the referenced Item's newer changes.

Neither source describes automatic binary merge. Therefore a safe IDEA policy should never silently replace local CAD/Office work and should not call a generation-number refresh a merge.

### 4. A version is saved and then released

PE documents distinguish versioning from lifecycle promotion. Claim -> Save -> Unclaim creates a generation; Promote advances a configured lifecycle; a Released revision is not edited in place and must be revised. The platform methods also expose `version` and `update` as separate operations. Consequently, a UI label such as `Publish`, `Check-in`, or `Release` must name one operation and explain the others instead of implying that they are synonyms.

### 5. A file is replaced

Aras treats the File Item as immutable. The versionable container (Document or CAD Item) is changed and points to a new File Item; historical container generations keep the old reference. This is materially different from checking out a mutable filesystem file. A design that locks the container and records a new artifact reference is closer to the documented model than one that overwrites a shared file in place.

## Mapping to the current IDEA prototype

The prototype currently models a Reservation bound to a document/workspace and an expected Generation, rejects a stale Check-in, keeps local work, then offers `Refresh baseline` and `Reapply local changes`. The following classification keeps the mapping honest:

| Current prototype concept | Aras evidence | Classification and recommendation |
|---|---|---|
| `Reserve` / `Checkout` establishes owner and workspace | PE Claim locks an Item for one editor; claim flags show owner | **Aligned design lesson, not name parity.** Keep Reservation at the container/Item level. Add a distinction between a persistent hold and an edit-session hold, learned from the 2023 Claim-independent-of-Edit behavior. |
| `expectedGeneration` versus current Working Head | Aras PE has generations, but the reviewed public API docs do not specify a generic generation compare-and-swap precondition | **IDEA safety policy.** Keep the server-side precondition and label it as IDEA optimistic concurrency, not as an Aras-native command. |
| Stale Check-in is rejected and creates no new Generation | Aras locks normally prevent a second editor; TDF detects stale referenced timestamps and asks before saving | **Good IDEA strengthening.** Make rejection atomic, retain the Reservation until the user chooses a disposition, and write an audit event. Do not claim that every Aras save behaves this way. |
| `Refresh baseline` | PE `Refresh` loads latest view data; Office Get Latest replaces the local file with a loss warning | **Adaptation.** Refresh must never overwrite dirty local bytes. Consider naming the current simulated action `Acknowledge/rebase intent`; offer an explicit `Get latest and discard local` path when replacement is intended. |
| `Reapply local changes` | No equivalent generic Aras command is documented. TDF offers Save-overwrite, Discard, or Cancel; Office Connector offers Keep Current/Get Aras/Cancel | **IDEA-only manual reconciliation.** Retain the command only when it means a human has compared/reapplied changes. Do not imply automatic three-way merge. |
| Check-in always releases Reservation | Office Connector Save to Aras retains claim; Save and Close releases it; modern core Claim can persist after Done/Discard | **Divergence to fix in the model.** Make disposition explicit: `Save & continue` (retain) versus `Finish & release` (release). Keep lifecycle `Submit review`/`Promote`/`Release` separate from content commit. |
| `Release` pins exact Generation and does not create one | PE version history and lifecycle promotion are separate, but universal exact-pin semantics are not established in the reviewed sources | **IDEA policy.** Keep exact-generation pinning because it protects review evidence; label it as an IDEA control rather than Aras parity. |
| Local work survives stale rejection | Office Get Latest can discard local work after confirmation; TDF Discard Local Changes explicitly reverts | **Intentional stronger safety rule.** Preserve the rejected local copy by default as an attached recovery artifact or detached candidate; require explicit confirmation before destructive replacement. |
| Files/representations are changed through a versioned container | Aras File Items are immutable; Document versions point to old/new Files | **Semantically compatible.** Keep artifact digest/representation identity separate from the container Generation. Storage and Vault implementation remain an IDEA architecture choice. |

## Proposed IDEA state and command model

The prototype should present four axes rather than one overloaded status field:

1. **Reservation/claim:** `Available`, `Reserved by me (edit session)`, `Reserved by me (persistent hold)`, `Reserved by another`, `Reservation lost/expired`.
2. **Working copy:** `Not open`, `Clean`, `Dirty`, `Outdated`, `Stale conflict`, `Detached candidate`.
3. **Lifecycle/gate:** `Start`, `In Work`, `Under Review`, `Released` (names and transitions remain configurable).
4. **Identity:** stable Document ID, Business Revision, immutable Generation, and artifact/representation digest.

A safe happy path is:

```text
Available
  -> Reserve (owner + workspace + base Generation)
  -> Open working copy
  -> Save draft (no new Generation)
  -> Check-in / commit Generation (server rechecks owner + workspace + base Generation)
  -> choose disposition: Save & continue OR Finish & release
  -> Submit review / Approve / Release (lifecycle actions, separate from commit)
```

The server-side stale path is:

```text
Check-in request
  ├─ owner/workspace/base Generation valid -> create exactly one immutable Generation
  └─ mismatch or lost Reservation -> reject atomically; create no Generation; preserve local work
       -> conflict modal: Get latest & discard local | Keep local as candidate | Cancel
       -> optional Compare for formats that support it
       -> explicit Reopen/Reserve and manual reapply against the latest baseline
       -> recheck current Generation; if the head moved again, return to conflict
```

Recommended command semantics:

- **Reserve:** obtain authority for one container, actor, and workspace; record the base Generation and a lease/heartbeat if leases are part of the implementation.
- **Open working copy:** materialize the selected Generation and record its artifact digests.
- **Save draft:** persist local/workspace metadata without advancing the immutable Generation.
- **Refresh latest:** read the authoritative head. If the copy is dirty, do not replace bytes; expose the conflict choices instead.
- **Get latest & discard local:** destructive replacement, always confirmed, with an audit record.
- **Keep local as candidate:** preserve the local bytes and detach them from the current head; it must not overwrite the authoritative Generation.
- **Reapply local changes:** a human-confirmed reconciliation step. It is not an automatic merge and must leave evidence of what was compared.
- **Check-in / commit Generation:** atomically validate Reservation ownership, workspace, lifecycle permissions, and expected Generation; create one Generation (or none on failure).
- **Save & continue / Finish & release:** explicit Reservation disposition. This is the IDEA equivalent of the two modern Aras outcomes without claiming identical implementation.
- **Submit review / Approve / Release:** lifecycle and evidence actions. They operate on an exact Generation and must not be hidden inside Check-in.
- **Recover Reservation:** authorized recovery only; never silently take over a live claim.

Use separate conflict classes so each has a truthful remedy:

| Conflict class | Trigger | Default response |
|---|---|---|
| `CLAIMED_BY_OTHER` | Reserve/claim finds another owner | Show owner/workspace and latest read-only data; no local publish. |
| `OUTDATED_LOCAL` | Local baseline is older than current head before a commit | Get latest (confirm loss), Keep local as candidate, or Cancel; Compare where supported. |
| `STALE_CHECKIN` | Commit `expectedGeneration` differs from current head | Reject atomically; preserve local work; require explicit reconciliation and revalidation. |
| `RESERVATION_LOST` / `LEASE_EXPIRED` | Owner/lease no longer valid | Preserve local work; reacquire only if the head is unchanged, otherwise use the stale path. |
| `LIFECYCLE_BLOCKED` | State or permission disallows edit/commit | Read-only explanation and the required transition/role; no forced write. |

This model keeps the useful Aras ideas—claim ownership, immutable historical generations, separate lifecycle promotion, explicit outdated-file choices, and visible conflict guidance—while making IDEA's stronger guarantees explicit: no silent overwrite, no unreviewed binary merge, exact-generation evidence pinning, and local-work preservation.

## Decisions that still require IDEA/target validation

The following are not answered by the reviewed Aras documents and must not be silently filled in:

- whether a particular deployment uses a lease, timeout, or administrator recovery for abandoned claims;
- whether a custom ItemType, CAD connector, or workflow creates a generation on every update/promotion;
- whether a multi-item or multi-file commit is one atomic server transaction in the selected integration;
- how relationship generations and representation digests are copied or replaced in a custom adapter;
- whether a specific connector offers a format-aware compare/merge tool;
- exact DDM behavior for stale publish and Reservation disposition (the local DDM target audit remains the authority for that question).

## Source notes and limits

- Sources were accessed 2026-08-29 and are linked directly above. They span Platform 33, Innovator 2023/29 release notes, Product Engineering Release 32 guidance, and Office Connector 27; edition and configuration boundaries matter.
- Aras documentation uses different terms (`Claim`, `Edit`, `Save`, `Done`, `Unclaim`, `Promote`, `Release`, and `CheckinManager`) for different layers. The [CheckinManager documentation](https://docs.aras.com/aras-innovator-platform-33/using-checkinmanager/0000019f-179d-dcff-a7bf-5f9d2f7c0000) and [File API](https://docs.aras.com/file-api/0000019f-179b-dcff-a7bf-5f9bdea40002) concern file transfer and replacement; they should not be treated as proof that lifecycle Release is a file Check-in.
- No licensed Aras runtime, database, source code, or customer configuration was inspected. Where this report says “not established,” that is an evidence boundary, not a claim that Aras cannot implement the behavior.
- Competitor observations are inputs to design judgment. They do not change the accepted IDEA ADRs or become requirements until captured, justified, and verified through the project’s normal documentation/specification process.
