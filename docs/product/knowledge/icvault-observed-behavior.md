# icVault Observed Behavior Baseline

| Field | Value |
|---|---|
| Document ID | `IE-KNW-ICV-001` |
| Status | Admitted product-knowledge baseline |
| Source class | `TARGET-RUNTIME FACT`, `TARGET-STATIC FACT`, `INFERENCE`, and explicit `UNKNOWN`/`BOUNDARY` |
| Source artifact | `RS-ICV-KB-001` |
| Source SHA-256 | `6D73923ABAF3AFC057F401514C4C5B16849ADBCB0332061CC0CDC568C2BC3C83` |
| Primary observation window | 2026-08-13 through 2026-08-26 |
| Intended use | Product questions, risk discovery, and traceable IDEA design lessons |

## 1. Scope and interpretation

These findings describe the audited icVault client/server environment and recorded experiments. They are not universal statements about every icVault release, license, configuration, or deployment.

- `TARGET-RUNTIME FACT`: directly observed behavior of the identified audited runtime under recorded test conditions.
- `TARGET-STATIC FACT`: directly observed package, configuration, catalogue, filesystem, service, or offline state of the identified target.
- `INFERENCE`: a bounded interpretation of named facts that still needs a falsifying test.
- `UNKNOWN`: evidence is insufficient.
- `BOUNDARY`: a conclusion the evidence explicitly does not support.

Raw screenshots, traces, database extracts, server paths, addresses, and credentials remain in the controlled research workspace. This document retains the product-relevant semantics and limitations.

## 2. Observed deployment and topology

| Claim ID | Class | Admitted finding | Scope/limit |
|---|---|---|---|
| `ICV-TOP-001` | TARGET-RUNTIME FACT | The audited client reported version `1.0.4.5`. | Identifies only the audited client package. |
| `ICV-TOP-002` | TARGET-RUNTIME FACT | The client process opened a direct SQL Server connection and a separate file-transfer channel. | Does not prove every supported deployment uses the same topology. |
| `ICV-TOP-003` | TARGET-RUNTIME FACT | The captured SQL session used a privileged SQL identity and reported transport encryption disabled. | Deployment-specific security finding; sensitive connection details are excluded here. |
| `ICV-TOP-004` | TARGET-RUNTIME FACT | Get Files used WinSCP over plain passive FTP and downloaded root/related artifacts concurrently. | Captured operation only; optional storage backends may differ. |
| `ICV-TOP-005` | TARGET-RUNTIME FACT | Historical Check-in traces showed parallel FTP uploads directly to final generation paths; no FTP staging rename was observed. | Absence is limited to captured traces, not proof that staging never exists elsewhere. |
| `ICV-TOP-006` | TARGET-RUNTIME FACT | SQL metadata entry time preceded observed FTP upload start for a Check-in. | Establishes ordering in the captured operation, not the complete transaction protocol. |
| `ICV-TOP-007` | TARGET-STATIC FACT | The audited server stored SQL metadata and physical vault artifacts on the same host/volume. | Deployment-specific continuity risk, not a product-wide topology claim. |
| `ICV-TOP-008` | TARGET-STATIC FACT | The server also hosted unrelated Aras Innovator IIS applications; no icVault IIS application was identified in the audited control plane. | Does not exclude optional web/integration components absent from this deployment. |
| `ICV-TOP-009` | INFERENCE | The audited core client architecture is a two-channel client: direct database access plus direct file transfer. | Strongly supported by live connections/traces; still scoped to this environment. |

## 3. Identity, version, and persistence

| Claim ID | Class | Admitted finding | Product significance |
|---|---|---|---|
| `ICV-ID-001` | TARGET-STATIC FACT | File history rows used a composite key of logical file UUID plus vault version. Checkout state used one row per logical file UUID. | Supports separating stable Logical Document identity from Generation identity. |
| `ICV-ID-002` | INFERENCE | The file UUID behaves as Logical Document identity and vault version behaves as stored Generation sequence. | Terminology is an interpretation, not a vendor contract. |
| `ICV-ID-003` | TARGET-RUNTIME FACT | A changed subsequent Check-in increased visible file version from 1 to 2 and registered/retrieved an external-linked related file. | Demonstrates version progression and relation-aware retrieval in the tested flow. |
| `ICV-ID-004` | TARGET-RUNTIME FACT | A no-change Check-in returned success without increasing the visible version. | Success does not necessarily mean a new Generation was created. |
| `ICV-ID-005` | TARGET-RUNTIME FACT | Approval with the tested RenewRevision behavior changed Revision from 0 to A and reset visible Version to 0; Reject returned workflow state to Draft without reversing Revision A/Version 0. | Exact numbering rules beyond the tested transition remain unknown. |
| `ICV-ID-006` | TARGET-RUNTIME FACT | A stale local Version 3 was refused after another user had published Version 4, even after the Checkout row was released. | Demonstrates optimistic stale-version protection in addition to Checkout ownership. |
| `ICV-ID-007` | TARGET-RUNTIME FACT | The stale Check-in did not create Version 5 or overwrite Version 4. | No automatic merge was observed. |
| `ICV-ID-008` | TARGET-RUNTIME FACT | The version-selection screen selected an existing authoritative snapshot for the scene. | It was not a two-branch merge or conflict-resolution engine. |

## 4. Checkout, Reference, and Check-in experiments

The root scene and its external-linked children were registered as separate logical files. Tests were predominantly sequential on one audited client with two user accounts; simultaneous request races remain untested.

| Test | Class | Setup/action | Observed result | Exact conclusion and limit |
|---|---|---|---|---|
| `TH1` | TARGET-RUNTIME FACT | Checkout only the assembly root versus use the explicit Checkout-all option. | Root-only created only the root lock; Checkout-all created separate rows for each eligible registered related file. | Assembly relation does not silently propagate one lock. Bulk scope creates independent logical-file locks. |
| `TH2` | TARGET-RUNTIME FACT | B Checkout child, then A Checkout parent. | Both Checkouts coexisted with different owners. | Child Checkout neither locks nor blocks parent Checkout. |
| `TH3` | TARGET-RUNTIME FACT | B requested Checkout of the same parent already held by A. | UI returned a generic success message, but ownership remained A and no B row appeared. | The second Checkout was not granted; success text alone is not evidence of acquisition. |
| `TH4` | TARGET-RUNTIME FACT | A Check-in parent while B held child. | Parent Check-in completed; both Checkout rows remained. | Child ownership did not block root-only Check-in in this flow; Check-in did not release either lock. |
| `TH5` | TARGET-RUNTIME FACT | A Cancel Checkout on parent, then B Checkout parent while retaining child. | Parent was released independently; B later held parent and child. | Cancel operates on selected logical-file ownership, not the whole assembly. |
| `TH6` | TARGET-RUNTIME FACT | A Checkout parent, then B Checkout child. | Both Checkouts coexisted. | Parent Checkout does not lock a child. |
| `TH7` | TARGET-RUNTIME FACT | B Check-in child while A held parent. | Child Check-in completed; both locks remained. | Parent ownership did not block child-only Check-in; release was a separate action. |
| `TH8` | TARGET-RUNTIME FACT | A attempted to cancel B's child Checkout. | icVault excluded the other user's row and left it intact. | An ordinary non-owner could not force-cancel another user's Checkout in the tested UI flow. |
| `TH9` | TARGET-RUNTIME FACT | One user Checkout parent and child. | Two independent rows existed for the same owner. | There is no observed one-lock-per-user or assembly-wide lock rule. |
| `TH10` | TARGET-RUNTIME FACT | Same user Check-in parent while retaining child. | Check-in completed and both locks remained. | Root Check-in and lock release are distinct actions. |
| `TH11` | TARGET-RUNTIME FACT | Same user Check-in child while retaining parent. | Check-in completed and both locks remained. | Child Check-in did not release child or parent. |
| `TH12` | TARGET-RUNTIME FACT | A created a Reference, logged out, and B inspected the all-users view. | A later still saw the Reference; B did not see A's row. | Reference appeared user-scoped in visibility; cross-client visibility and exact persistence remain UNKNOWN. |
| `TH13` | TARGET-RUNTIME FACT | Same user created Reference and Checkout for the same logical file. | A Reference row and Checkout row coexisted. | Reference and Checkout are not mutually exclusive states. |
| `TH14` | TARGET-RUNTIME FACT | User removed all References while also holding Checkout. | Reference disappeared and Checkout remained until separately cancelled. | Unreference and Cancel Checkout are independent. |
| `TH15` | TARGET-RUNTIME FACT | User Check-in without product-data changes. | Success, no visible version increment, Checkout remained. | A no-op Check-in is possible and does not imply release. |
| `TH16` | TARGET-RUNTIME FACT | B attempted Check-in while A held Checkout of that file. | Check-in was rejected as owned by another user. | Server-side Check-in path enforced current Checkout owner in the tested flow. |
| `TH17` | TARGET-RUNTIME FACT | A attempted no-op Check-in of a registered file without first taking Checkout. | Success, no version increment, no Checkout row. | Checkout was not required for this no-op; changed unreserved publish was not proven. |
| `TH18` | TARGET-RUNTIME FACT | A used Checkout-all on a scene with registered and unregistered related content. | Root plus two registered related logical files received separate rows; unregistered geometry did not. | “All” meant eligible registered related files, not every internal geometry item. |
| `TH19` | TARGET-RUNTIME FACT | Same user repeated Checkout on the same logical file. | One row remained; no duplicate lock appeared. | Same-user repeated acquisition was idempotent at the observed lock-list level. |
| `TH20` | TARGET-RUNTIME FACT | B held one child; A requested Checkout-all. | A received a conflict and acquired no root/other-child locks. | This bulk request behaved all-or-none. General atomicity for every bulk command remains unproven. |
| `TH21` | TARGET-RUNTIME FACT | A edited and saved a local child while B held its Checkout, then A attempted Check-in. | The design application allowed the local save; icVault rejected A's Check-in; B's ownership and vault version remained. | Checkout did not prevent local editing. Enforcement occurred at publish, with no merge observed. |
| `TH22` | TARGET-RUNTIME FACT | B published Version 4 and released Checkout; A retained a separately edited Version 3 and declined refresh. | icVault warned that Version 4 existed and rejected A's stale Check-in. | Lost update was prevented after lock release; local work required explicit reconciliation. |

## 5. What Checkout did and did not mean

The admitted model for the audited flow is:

```text
Checkout request
  → one ownership row per selected registered logical file
  → local files remain editable by external design software
  → Check-in validates owner when a Checkout exists
  → Check-in also validates stale version
  → merge/reconciliation remains a user workflow
```

Therefore:

- Checkout was a server-recorded publish reservation, not an operating-system file lock.
- Parent and child were independent reservation subjects.
- explicit bulk selection assembled multiple independent reservations;
- a local modification was not proof of publish authority;
- a generic success dialog did not prove every requested row succeeded;
- Check-in and Cancel Checkout were separate in most audited flows;
- the version-selection screen replaced/repointed a workspace snapshot and did not merge binary changes.

The audit observed inconsistent lock-release outcomes across earlier and later Check-in flows. The configuration or condition controlling automatic release remains `UNKNOWN`; IDEA must make Reservation Disposition explicit rather than inherit this ambiguity.

## 6. Product structure, workflow, metadata, and access

| Claim ID | Class | Admitted finding | Limit |
|---|---|---|---|
| `ICV-STR-001` | TARGET-STATIC FACT | Assembly-part and custom-property rows were stored separately from file-history rows. | Internal schema is not a product model to copy. |
| `ICV-STR-002` | TARGET-RUNTIME FACT | Removing one file-history Generation during a controlled experiment left assembly-part and custom-property rows orphaned. | The mutation included manual test intervention; it demonstrates missing DB constraints, not normal UI behavior. |
| `ICV-STR-003` | TARGET-STATIC FACT | The audited database catalogue reported no foreign-key constraints and only clustered primary-key indexes in the collected index dump. | Snapshot-specific; later schema/configuration may differ. |
| `ICV-WF-001` | TARGET-RUNTIME FACT | The tested workflow moved Draft → Review → Released on approval and Review → Draft on rejection. | Quorum, concurrent decisions, workflow-definition versioning, and rollback atomicity remain unknown. |
| `ICV-WF-002` | TARGET-RUNTIME FACT | Approval history and status transitions were persisted and visible in tested data/UI. | Append-only/tamper resistance was not proven. |
| `ICV-META-001` | TARGET-RUNTIME FACT | Category, status, custom properties, auto-numbering configuration, and ACL administration surfaces existed. | End-to-end ACL enforcement and number-allocation concurrency were not completed. |
| `ICV-META-002` | TARGET-RUNTIME FACT | The Auto Number UI required valid registered external-linked content in the tested flow. | Allocation behavior with configured numbering policies remains unknown. |
| `ICV-META-003` | TARGET-STATIC FACT | The observed numbering-definition table and number-type list were empty. | This identifies only the inspected target state; it does not establish behavior with configured policies. |

## 7. Storage integrity, security, and recoverability

| Claim ID | Class | Admitted finding | Interpretation boundary |
|---|---|---|---|
| `ICV-STO-001` | TARGET-STATIC FACT | One consistency snapshot mapped all observed metadata rows to nine physical artifacts; the tested design files matched recorded size/hash and no extra artifact was found in the inspected store. | A small clean snapshot does not prove crash consistency. |
| `ICV-STO-002` | TARGET-RUNTIME FACT | Metadata and binary transfer occurred through separate channels, and captured uploads targeted final paths. | Complete commit/rollback behavior was not captured. |
| `ICV-STO-003` | INFERENCE | A crash between metadata mutation and final-path upload could expose missing or partial Product Definition unless another unobserved recovery protocol exists. | This is a risk hypothesis, not a demonstrated crash outcome. |
| `ICV-SEC-001` | TARGET-STATIC FACT | The audited client configuration contained infrastructure connection settings. | Other supported backends or hardened deployments may differ; runtime connection behavior is recorded separately in `ICV-TOP-002`. |
| `ICV-SEC-002` | TARGET-RUNTIME FACT | The captured SQL session reported transport encryption disabled, and captured file transfer used plain FTP. | Scope is the observed deployment, not a universal icVault security statement; IDEA's encrypted-boundary expectation is a separate design decision. |
| `ICV-RCV-001` | TARGET-STATIC FACT | No SQL Server Agent service or Windows scheduled task providing automated icVault backup was found; observed backups were manual full copy-only records. | A separate organizational backup system outside inspected surfaces was not ruled out. |
| `ICV-RCV-002` | TARGET-STATIC FACT | The database used SIMPLE recovery and metadata, artifacts, and observed backups shared one server volume. | Demonstrates the audited deployment's failure-domain concentration. |

## 8. Outstanding unknowns

- exact database transaction boundaries and write sequence for Checkout, Get Files, and Check-in;
- crash behavior between metadata commit, artifact upload, and hash validation;
- simultaneous acquisition race behavior rather than sequential two-user requests;
- lease/timeout, disconnected operation, recovery, transfer, and administrator break semantics;
- configuration that determines whether Check-in releases or retains Checkout;
- complete Revision sequencing after `A` and numbering behavior under concurrency;
- end-to-end ACL precedence and enforcement across UI, database, file transfer, previews, and administration;
- workflow-definition versioning, concurrent approvals, audit immutability, and release baseline pinning;
- backup completeness, coordinated restore, RPO/RTO, and disaster-recovery proof;
- optional web, Azure, MySQL, SQLite, and object-storage configurations not active in the audited environment.

## 9. Prohibited overclaims

This baseline does not establish that:

- every icVault release uses the audited topology;
- icVault universally lacks encryption, recovery, APIs, or optional integrations;
- a Checkout makes external design-tool files read-only;
- an assembly owns one transitive lock;
- the version-selection screen merges competing edits;
- successful Check-in always creates a version or always releases Checkout;
- the observed database schema is suitable for IDEA;
- competitor behavior is an IDEA requirement.

Product translation is controlled by [IDEA design lessons](idea-design-lessons.md) and accepted ADRs.
