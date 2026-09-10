# IDEA Engineering Workspace, Transfer and Storage Re-baseline

## Control envelope

| Field | Recorded value |
|---|---|
| Stable Supporting Record ID | `IE-CHG-WS-SCALE-001` |
| Supporting Class / Version | `CHG` / `Draft 0.2` |
| Date | 10-09-2026 |
| Owner / internal reviewer | Principal Product Author prepares; project user confirmed Q26–Q32 design direction in discussion; review of the exact successor files remains `NOT-RUN` |
| Approver | Product Decision Authority for Feature, Spec and Tech as applicable; no decision recorded |
| Applicable baseline | `IDEA-C1-ANALYSIS-DESIGN-001` |
| Evidence class | Controlled requirements/domain/architecture/design change plus bounded vendor/target research; not implementation, test or approval evidence |
| Access / retention | `INTERNAL`; retain with affected sources, vendor evidence limits and predecessor history |

## 1. Reason and boundary

The preceding Draft established immutable Generations, Checkout/Reference, optimistic concurrency,
logical all-or-none Change Sets and principal–role–scope RBAC. Q26–Q32 still left important failure
and scale behavior implicit: when a Reservation expires, what happens to a modified Reference, how a
large/multi-document Check-in resumes, whether storage identity is tied to one provider, and whether
administrators may create arbitrary executable Permission codes or copied per-document ACLs.

The project user accepted the recommendations below as IDEA design direction. This change updates
the controlled Markdown sources only. It does not implement the product, mutate the prototype or
Human/Word copies, select a storage vendor/topology, choose numeric lease defaults, execute a test or
record Product Decision Authority approval.

## 2. Evidence boundary and local Aras follow-up

The comparison source is
[DDM/Aras Checkout, Reference and Check-in research](../../../../research/2026-09-10-ddm-aras-checkout-reference-checkin-comparison.md).
DDM public material proves visible Reserve/Reference work surfaces but not lease/recovery or
cross-store Check-in protocol. Official Aras material proves Claim/Unclaim, explicit stale-local-file
choices, chunked Vault transactions and atomic OData Change Sets only within their stated scopes. It
does not prove end-to-end IDEA semantics.

After the user reopened the local Aras server on 10-09-2026, an authorized read-only audit logged in
to the recorded `InnovatorSolutions` target (`14.35.0.44037`) and queried live state/schema:

- 6 current CAD rows had `locked_by_id`, all for one lock owner; their Item `modified_on` values ran
  from 01-07-2026 to 15-07-2026;
- CAD, Document, Part, Project and Project Package exposed `locked_by_id` and `not_lockable`; no
  property name matching lease, expiry, heartbeat or session was present on those Item Types; and
- the retained 24-06-2026 read-only snapshot has SHA-256
  `71954844A994A63482F2C356303DC3BEFAFAFC23A0BEC6D77FBB17E23D8314B0`.

The first observation is `TARGET-RUNTIME FACT`; schema/snapshot observations are
`TARGET-STATIC FACT`. They establish server-persisted lock data on this target, not that Aras has no
timeout/recovery elsewhere. No live Claim, Unclaim, Check-in or file mutation was performed **during
this initial audit**.

The user subsequently authorized a controlled runtime experiment on one dedicated CAD/File fixture
whose names start with `ZZ-IDEA-RUNTIME-CICO`. The full evidence matrix and cleanup state are recorded
in [Aras runtime Workspace experiment](../../../../research/2026-09-10-aras-runtime-workspace-experiment.md).
The experiment established, for the exact target and account used, that:

- server lock state survives across two tokens of the same user, while the second token can also
  update and unlock the first token's lock;
- native `version` creates a new Generation, but admin could lock/update a historical Generation by
  exact ID;
- the deployed custom Check-in Method checks lock ownership and unlocks after success, but does not
  check current head, expected Generation, digest or Operation ID and accepted a stale historical
  Generation;
- invalid-File Check-in failed without changing the native File and retained the lock; same-File
  Check-in succeeded, released the lock and changed `modified_on` without a semantic No Change result;
- an unlocked Reference-style download matched the fixture digest, while the studied connector had
  no server Reference manifest; and
- the studied Vault client buffers a complete file and multipart payload in memory.

These are bounded `TARGET-RUNTIME FACT` and `TARGET-STATIC FACT` observations, not
Aras-wide claims. They reinforce the section 3 contracts; they do not create a new IDEA requirement,
record a product test result or change any Product Decision Authority state. Final AML verification
found all four test Generations unlocked and Generation 4 current. Existing business/demo CAD records
were not used by the mutation experiment.

## 3. Internally confirmed design decisions

### 3.1 Reservation and successful Check-in

1. Reservation is server-authoritative and binds Logical Document, Actor, Workspace, expected
   Generation and a configurable lease.
2. At most one conflicting Reservation is `Active`. Minimum recorded states are `Active`, `Expired`,
   `Released` and `Recovered`.
3. Sign-out, app exit or network loss does not release immediately. Lease expiry removes publish
   entitlement but never deletes/transfers local work.
4. A confirmed successful changed or semantic No Change Check-in releases every in-scope
   Reservation. There is no “retain Checkout after Check-in” option.
5. A failed/uncommitted Check-in releases none of its in-scope Reservations. Independent lease expiry
   may still occur according to the server clock.
6. Cancel and recovery are governed operations. Recovery requires applicable authority, reason,
   attributable Audit and a new current-head Reservation before further publish.

### 3.2 Modified Reference and stale work

1. Reference pins one exact Generation and grants no direct publish authority for the original
   Logical Document.
2. CAD/Office may still change the local file. A digest difference is shown as **Đã thay đổi trên
   máy**, not “Dirty”.
3. Explicit conversion to Checkout succeeds only when the expected Generation remains current and
   the server can grant a new Reservation.
4. If stale or held by another actor, IDEA preserves the local file and offers explicit safe paths:
   keep a safe copy and obtain current bytes separately, Create Copy, deliberately reapply changes,
   or discard only after confirmation.
5. IDEA does not automatically merge or overwrite CAD/Office content.

### 3.3 Multi-document Check-in and large transfers

1. Each confirmed Check-in uses one `CheckinOperationId` and exact document/expected-Generation/
   Reservation/Workspace/digest scope.
2. Multi-document success is logically all-or-none. This is not represented as one physical ACID
   transaction spanning database and storage.
3. Immutable candidates are staged privately using resumable checked chunks/ranges. A candidate is
   not a published Generation.
4. One authoritative database transaction publishes manifest references, Generations, Working
   Heads, Change Set, Audit/outbox and release of the confirmed Reservations.
5. A status query and idempotent retry distinguish committed, resumable, failed and
   reconciliation-needed outcomes. Reusing an OperationId with changed input is refused.
6. Transfer interfaces must support individual multi-GB Artifacts without loading the complete file
   into application memory.

### 3.4 Storage evolution and authorization configuration

1. Product manifests identify immutable Artifacts by stable identity/digest, never filesystem path,
   bucket or provider key.
2. A controlled storage adapter and Artifact Location records permit verified copy, dual-location
   cutover, rollback and later provider replacement without changing product history.
3. The design envelope allows a future Project corpus of hundreds of TB. This is not initial sizing,
   a benchmark or a promise that an untested topology can carry that load.
4. IDEA owns a stable catalogue of executable Permission codes. Administrators may compose supported
   codes into versioned Role Definitions but cannot invent new executable codes through data/JSON.
5. Parent Scope grants are evaluated against the current resource hierarchy at request time; IDEA
   does not copy an inherited ACL into every document.

### 3.5 Architecture-model clarification

1. Business Revision Workflow, Reservation status, Workspace Entry condition and Check-in Operation
   status are four independent state owners. A UI may present them together but no implementation
   may store or infer them as one generic document status.
2. `Released`, `Expired` and `Recovered` Reservation records never return to `Active`. A later
   permitted Checkout creates a new `ReservationId` against the current head.
3. A Reference's local digest condition and current-head freshness are independent. Only explicit
   current-head Checkout can turn a modified current Reference into publish-eligible work; stale
   local content remains preserved for deliberate handling.
4. Candidate transfer can resume without publication. Only the authoritative `Committed` Check-in
   Operation state proves the complete result and release of every confirmed Reservation.
5. The maintained view package uses the project-tailored ISO/IEC/IEEE 42010 organization, C4-style
   high-level structure and selected UML state/sequence/class semantics. Mermaid is editable source,
   not the architecture method or evidence that the rendered view passed review.

## 4. Controlled-source impact

| Source | Successor | Material change | Evidence state |
|---|---|---|---|
| `CONTEXT.md` | Current glossary | Clarifies Reservation status, modified Reference, Check-in Operation, product-owned Permissions and request-time Scope inheritance. | Domain consistency review pending. |
| ADR-0005 | Clarified Proposed ADR | Defines logical all-or-none publication, private chunk staging, one authoritative database commit and idempotent status/reconciliation. | Product Decision Authority decision `NOT-RUN`. |
| ADR-0006 | Clarified Proposed ADR | Defines lease/disconnect/expiry/recovery and mandatory release after successful changed/No Change Check-in. | Product Decision Authority decision `NOT-RUN`. |
| Product architecture input | 0.2 → 0.3 | Adds workspace/transfer/storage/RBAC invariants and quality scenarios. | `Proposed`; PG3 remains blocked. |
| DOC-04 | 0.12 → 0.13 | Adds `REQ-WS-014/015`, `REQ-OPS-006`, `QRS-011/012`; requirement ledger becomes 87 IDs. | Structural checks may be run; semantic/specialist review `NOT-RUN`. |
| DOC-05 | 0.11 → 0.12 | Adds a focused Workspace responsibility view; separate Reservation, Reference and Check-in Operation state models; exact Checkout, Reference, Check-in and uncertain-result sequences; resumable-transfer/storage-evolution views; and complete per-view metadata/accessibility source. | Internal source and temporary-render review recorded in `IE-VEV-ARCH-VIEW-001`; controlled-rendition and qualified architecture/HCD review `BLOCKED`. |
| DOC-06 | 0.12 → 0.13 | Adds transfer/location records, the cross-authority Workspace/Check-in data view, exchange/reconciliation and provider migration contract. | Static source checks may run; data/security/operations review `NOT-RUN`. |
| DOC-08 | 0.8 → 0.9 | Adds modified-Reference, large-transfer and uncertain-result journeys/states/components. | Prototype/representative usability evidence `NOT-RUN`. |
| VVP | 0.12 → 0.13 | Adds `VVP-017`, WS-01…08 and ST-01…04; expands VVP-002/003/004 and the view-by-view diagram review protocol. | Product procedures `NOT-RUN`; VVP-016 internal source/temporary-render step executed, overall acceptance `BLOCKED`. |
| VEV | New `IE-VEV-ARCH-VIEW-001@0.1` | Pins DOC-05/DOC-06 hashes, renderer environment, 23 scalable renditions, six contact sheets and a view-by-view internal review ledger. | Parse/render sub-check `PASS`; complete VVP-016 outcome `BLOCKED` pending controlled rendition and qualified review. |
| Feature/Spec/Tech briefs, DOC-07, GOV, prototypes and Word/Human copies | Unchanged | Existing source pins may be stale; no submitted/editorial artifact is silently rewritten. | Refresh only after source review and applicable decision. |

## 5. Values and evidence still open

The structural choices above are closed for internal drafting. The following remain open and must
not be guessed:

- numeric Reservation lease, renewal and grace defaults;
- exact format/application versions, sample corpus, license and per-format limits;
- real file-size distribution, concurrency, growth, initial allocation, storage topology and service
  targets within the accepted scale envelope;
- provider products, migration observation window, staging retention and cleanup thresholds;
- security/retention/hold/backup policy and named specialist/operational owners; and
- executed fault-injection, large-transfer, storage migration and representative usability evidence.

They remain controlled by `SPEC-OPEN-03…08`, VVP and the later Tech/operations decision. Their absence
does not reopen the semantics in section 3, but it prevents unsupported implementation or readiness
claims.

## 6. Source checks and work still required

Static source checks run on 10-09-2026 established that:

- DOC-04 contains 87 requirement rows and 87 unique IDs; every row has six populated cells and at
  least one normative `shall`/`shall not`;
- the multiple-obligation heuristic flags 51 rows for semantic atomicity review, but does not by
  itself classify those rows as defects;
- VVP contains 17 unique objectives plus WS-01…08, ST-01…04, PA-01…04 and RBAC-01…10;
- the changed controlled sources have no inconsistent Markdown table rows, broken local links or
  unbalanced code fences; and
- active behavior sources offer no option to retain Checkout after a successful changed or No
  Change Check-in.

The internal VVP-016 source/render review subsequently established that all 23 maintained DOC-05/
DOC-06 Mermaid blocks parse and render with Mermaid 11.12.0 in Chrome 152.0.7977.76. The author
inspected individual views and six contact sheets, then simplified the dense Reference and Check-in
state overviews. Exact source digests, per-view results and limitations are retained in
`IE-VEV-ARCH-VIEW-001`. This is not a controlled Word/PDF rendition or independent review.

The following work remains:

- inspect the final controlled page/screen rendition and obtain qualified architecture/HCD review
  under VVP-016;
- conduct human semantic/atomicity and cross-document reviews;
- review the large-transfer/storage contracts with data, security and operations competence;
- execute WS/ST procedures against an exact implementation; and
- obtain Product Decision Authority decisions through refreshed Feature/Spec/Tech briefs.

These checks establish document-source integrity and a bounded internal Mermaid rendition result.
All product behavior, performance, recovery, migration and usability results remain `NOT-RUN`; final
diagram acceptance remains `BLOCKED` until the exact controlled rendition and qualified review are
completed.
