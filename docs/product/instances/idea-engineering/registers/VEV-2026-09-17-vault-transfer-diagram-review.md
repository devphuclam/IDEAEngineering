# Multi-location Vault Source, Rendition and Diagram Review

## Control envelope

| Field | Recorded value |
|---|---|
| Stable Supporting Record ID | `IE-VEV-VAULT-XFER-001` |
| Supporting class / version / status | `VEV` / `0.1` / `Draft` |
| Date / operator | 2026-09-17 / Principal Product Author in the local workspace |
| Owner / reviewer / acceptance authority | Principal Product Author; focused author review recorded here; independent architecture/security/HCD review `NOT-RUN`; exact successor Product Decision Authority acceptance `NOT-RUN` |
| Product normativity | `INFORMATIVE`; source/rendition review only, no product or technology selection |
| Repository process authority / instruction state | `NOT-APPLICABLE` / `NOT-APPLICABLE` |
| Applicable baseline | DOC-04@0.14; DOC-05@0.21; DOC-06@0.17; technology view set@0.3; TECH-001@0.15; VVP@0.17 |
| Source / upstream trace | [IE-CHG-VAULT-XFER-001](CHG-2026-09-17-multi-location-vault-transfer-architecture.md), [ADR-0013](../../../../adr/0013-separate-artifact-control-and-data-planes.md), [DOC-05 diagram policy](../DOC-05-architecture-description.md#32-diagram-authoring-and-review-policy), [technology documentation standard](../../../../agents/technology-stack-documentation-standard.md) |
| Exact source pins | Working-copy byte-stream SHA-256, LF-normalized SHA-256 and per-diagram hashes in the [render manifest](../evidence/IE-VEV-VAULT-XFER-001/render-results.json). The starting Git HEAD is provenance, not a claim that the successor source is committed. |
| Downstream trace | [Current SVG/PNG gallery](../evidence/IE-VEV-VAULT-XFER-001/index.html), [standalone SVG checks](../evidence/IE-VEV-VAULT-XFER-001/svg-open-results.json), [Word-update guide](../../../../reports/IDEA-DDM-multi-location-vault-sharepoint-word-update-guide-2026-09-17.md), VVP-016 and future SharePoint editorial updates |
| Supersession | Supersedes `IE-VEV-ARCH-CORR-005` and `IE-VEV-TECH-VIEW-002` only as current source/rendition evidence for the Vault successor. Their historical results remain unchanged. |
| Review trigger | Any diagram-source change, transfer/location-policy change or change to the renderer configuration |
| Access / retention | `INTERNAL`; retain source, manifest, SVG/PNG and predecessor records together |
| Evidence boundary | Rendering and author review do not prove throughput, security, failover, replication, backup restoration, HA or runtime correctness. Those procedures remain `NOT-RUN`. |

## 1. Reason and changes

The first Vault successor edited Markdown but did not produce successor images. The predecessor
gallery therefore still showed obsolete byte paths. Source inspection also found a format-output
sequence that still implied byte transfer through a Server Module, and technology control arrows
whose direction could make receipts or product finalization look like Gateway commands.

This update renders the entire current set and corrects the affected paths:

- `ARCH-VIEW-SEQ-012` is a new UML Sequence Diagram for exact read failover.
- `ARCH-VIEW-SEQ-013` is a new UML Sequence Diagram for verified replica creation and eligibility.
- `ARCH-VIEW-SEQ-010` sends worker input and automatic/manual output bytes through scoped Gateway
  transfers. Format Intelligence receives metadata and verified custody evidence.
- `ARCH-VIEW-SEQ-002` shows prepare, direct upload, policy-required replication, finalize,
  commit-time refusals and No Change. Server internals are represented at a Server-container level;
  companion Module/authorization views retain the detailed ownership contracts.
- `ARCH-VIEW-SEQ-006` resumes missing ranges inside its transfer loop. A replacement upload location
  cannot inherit another location's range acknowledgements as proof of stored bytes.
- Updated container/deployment/security/data/technology views agree on direct payload transfer,
  authenticated receipts, one-to-many locations and independent backup.
- `MGMT-VLT-001…003` are three explicitly declared management simplifications in the Word guide.
  They trace to maintained controlled views; they are not new normative architecture authorities.

## 2. Standards and model kinds

The project uses its tailored ISO/IEC/IEEE 42010:2022 architecture-description convention to state
view identity, concern, audience, scope, model kind, rationale and trace. It uses C4-style
Container/Deployment/Component views for static responsibility and topology, UML Sequence for
ordered interactions, ER/domain views for identity/cardinality, and trust-boundary data-flow views
for security seams. Mermaid 11.12.0 is the renderer, not the architecture standard.

Each new view declares its type, purpose, audience, exclusions, legend, requirement trace and text
alternative immediately beside its source. This is a standard-guided author review, not a formal
conformance or certification assessment.

## 3. Requirement-to-view review

| New requirement or retained rule | View evidence | Author review criterion |
|---|---|---|
| One business Backend may remain on one host; Vault supports multiple locations | CON-001, DEP-001, EVO-001; TECH-D02/D05; MGMT-VLT-001 | Server remains the control authority; Gateway/Vault locations are independently addressable. No HA inference is made. |
| Large payloads bypass the business Backend | CON-001, SEQ-001/002/006/010, SEC-001; TECH-D02/D04/D05 | Client/worker payload arrows reach Gateway/Vault. Server arrows carry control, manifests, policy inputs or verified results. |
| Scoped grants and authenticated receipts | SEQ-001/002/006/010/012, SEC-001; DATA-VIEW-ART-001 | Grant is limited to the exact operation/object/direction/ranges/size/digest/expiry. A receipt is evidence, not permission to publish. Exact cryptographic mechanism remains unselected. |
| Prepare/finalize and authoritative all-or-none Check-in | SEQ-002; MGMT-VLT-002; unchanged SEQ-007 | Finalize uses the same OperationId and confirmed input; current authorization and business/custody gates precede commit. Known pre-commit refusal publishes nothing. Lost-response resolution uses OperationId. |
| Successful Check-in ends the confirmed hold, including No Change | SEQ-002; MGMT-VLT-002; retained STATE-002/004 | No Change creates no Generation; confirmed Reservation disposition still ends the hold on success. Refusal does not claim an ended hold. |
| Stale/error paths preserve local work | SEQ-002/006/012; retained SEQ-005/007 | Local candidates/verified progress are retained. No implicit CAD/Office overwrite or merge is introduced. |
| Same logical Artifact, several physical locations | DATA-VIEW-ART-001, EVO-001, SEQ-012/013; MGMT-VLT-003 | Identity and digest stay fixed. A different serving location cannot silently substitute a newer Version. |
| Read failover and resumable transfer | SEQ-006/012; ST-06 | Replacement read grant refers to the same Artifact/digest/size; only missing exact ranges are fetched. No eligible copy means refusal. Upload relocation reconciles actual target ranges separately. |
| Vault-to-Vault replication without Client reupload | SEQ-013, EVO-001, TECH-D05 | Authorized storage nodes exchange immutable bytes directly. Only complete digest-verified target evidence creates an eligible location. |
| Durability policy controls completion | SEQ-002/013; ST-07 | Only eligible verified copies count. A required copy blocks finalization while unresolved; exact counts/failure domains are not invented. |
| Replica does not replace backup | DEP-001, EVO-001; retained SEQ-011; TECH-D05; MGMT-VLT-003 | Online replication and coordinated independent backup remain different flows and verification objectives. |
| Product-state and format acceptance owners remain separate | MOD-001/002, SEQ-002/010 | Gateway and worker never own Generation/Release/Representation acceptance. Existing Module and relational UoW boundaries remain. |

ID suffixes in this table refer to the full `ARCH-VIEW-*` IDs in DOC-05. Technical view titles,
accessible descriptions, source paths and hashes are in the current manifest. Unchanged RBAC,
Review/Release and technology reopen diagrams are rendered from their current source but are not
claimed to be newly designed for the Vault change.

## 4. Verification result

| Check | Result | Limit |
|---|---|---|
| Explicit view identity, accessibility metadata and Mermaid parse | `PASS`, 43 sources | 28 architecture + 4 data + 8 technology + 3 management views |
| SVG/PNG render | `PASS`, 43/43 | 18 controlled diagrams updated/new, 22 controlled diagrams unchanged, and 3 new management simplifications; differences compare LF-normalized diagram code with starting HEAD |
| Standalone browser open and XML parsing | `PASS`, 43/43 | Each SVG is opened as a file, not only embedded in HTML; XML serialization prevents invalid HTML void tags in standalone SVG |
| Focused visual QA | `PASS — AUTHOR REVIEW`, 18 affected controlled views and 3 Word figures | Contact-sheet and focused full-resolution inspection; corrected replica note is readable, overview now fits a narrower canvas, and arrow directions match the reviewed paths. Automated text/HTML-label boundary inspection found zero issues in these 21 views. Final insertion/layout in the user's Word remains outside this review. |
| Source pin and current-gallery correspondence | `PASS` | Exact source/diagram/output hashes checked against the final manifest; no predecessor image is substituted |
| Requirement/view semantic correspondence | `PASS — AUTHOR REVIEW` against section 3 | Does not claim independent specialist review or that the implementation exists |
| Runtime verification and independent architecture/security/HCD acceptance | `NOT-RUN` | Scoped-grant security, failover, concurrency, replica durability and restore procedures remain planned |

Renderer: [render-vault-transfer-review.cjs](../../../../../scripts/render-vault-transfer-review.cjs),
Mermaid 11.12.0, Chrome 152.0.7977.83. Runtime/library paths come from the bundled local dependency
runtime; no package installation was needed. The manifest records the actual render timestamp,
dimensions, source hashes, diagram hashes and output hashes.

## 5. Remaining decisions

Exact Gateway runtime/toolchain/provider, Vault count/topology, failure-domain separation,
minimum verified-copy policy, replication lag, capacity and throughput objectives remain open.
These do not prevent reviewing the proposed flows, but they prevent a claim of measured operational
readiness. Existing Tech Stack, Q-15 `PARTIAL / NO WINNER`, Product Scope and PG3/PG4 states remain
unchanged. The predecessor PDA approval remains attached to its exact baseline; it is not
automatically transferred to the Vault successor.
