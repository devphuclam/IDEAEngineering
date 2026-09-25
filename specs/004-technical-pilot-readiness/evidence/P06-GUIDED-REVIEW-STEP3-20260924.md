# P06 Guided Review — Step 3: Database and Vault Divergence

| Field | Record |
|---|---|
| Evidence ID / class | `P06-GUIDED-REVIEW-STEP3-20260924` / guided documentary review note |
| Version / status | `0.1` / Draft |
| Product normativity | Informative; no new requirement, architecture decision or Product Decision Authority approval |
| Increment / work package | `IE-INC-READY-001` / P06, T022 |
| Review date | 2026-09-24 (Asia/Ho_Chi_Minh) |
| Reviewer / author | Current Project Reviewer requested the existing-diagram check and accepted following the diagrams if they cover the case; assistant performed the source/rendition comparison and prepared this trace |
| Reviewed plan | [P06 plan](../recovery-and-security-plan.md) `@0.3`, SHA-256 `625F4BBD13BF8BA01AC92989814C2BC09327AD45342AEF8127CA35A70352D9F7`, §2.3 |
| Architecture source | [DOC-05](../../../docs/product/instances/idea-engineering/DOC-05-architecture-description.md) `@0.22`, SHA-256 `E03B5577F86883CD1E5374779434CD3B4B4A75B3BF241C812A1E612F266341AA` |
| Data source | [DOC-06](../../../docs/product/instances/idea-engineering/DOC-06-data-integration-and-migration-specification.md) `@0.18`, SHA-256 `2A2B8008265383CC13684853929C30592DAF1E9B1F439F11C6C4AB9D88EC4057` |
| Source status | Current DOC-05/06 and multi-location Vault details are Draft successors. The reviewed diagrams do not by themselves approve that successor or prove implementation. |
| Result boundary | The two questioned cases are covered by existing views; no new diagram is required. P06 overall result, reviewer competence assessment, application tests and PG4 remain `NOT-RUN`. |
| Classification / retention | `INTERNAL`; retain with P06 evidence; supersession `NOT-APPLICABLE` until a source or scope change requires a successor note |
| Review trigger | Change to Check-in commit, private staging, Artifact identity, Vault eligibility or exact-read failover rules |

## Question and reviewer direction

The question was whether the maintained diagrams already resolve both: (A) bytes uploaded to a Vault but no authoritative Check-in commit, and (B) a Generation references an Artifact for which no eligible verified copy can be served. The Project Reviewer answered: **“Mấy cái sơ đồ có giải quyết vụ này chưa? Nếu chưa thì vẽ sơ đồ để giải quyết vấn đề này và làm theo đúng như những gì đã vẽ trong sơ đồ là được.”** This authorizes use of the existing controlled views if their contents cover the question; it is not a new Product Decision Authority disposition.

## Existing-view coverage

| Case | Controlled view and model kind | Behavior fixed by the current Draft design |
|---|---|---|
| File transfer completes, Check-in does not commit | [`ARCH-VIEW-SEQ-006`](../../../docs/product/instances/idea-engineering/evidence/IE-VEV-VAULT-XFER-002/ARCH-VIEW-SEQ-006.svg), UML Sequence | Gateway/Vault verify bytes and return a Transfer Receipt for a **private candidate**. The Server reports transfer status, not Check-in success. |
| Same operation before and at commit | [`ARCH-VIEW-STATE-004`](../../../docs/product/instances/idea-engineering/evidence/IE-VEV-VAULT-XFER-002/ARCH-VIEW-STATE-004.svg), UML State Machine; [`ARCH-VIEW-SEQ-002`](../../../docs/product/instances/idea-engineering/evidence/IE-VEV-VAULT-XFER-002/ARCH-VIEW-SEQ-002.svg), UML Sequence | Only the authoritative relational commit makes the complete Check-in result public. Refusal or proved rollback publishes no Generation; uncertain outcome is held for reconciliation, not guessed from a file's presence. |
| Candidate versus published identity | [`DATA-VIEW-ART-001`](../../../docs/product/instances/idea-engineering/evidence/IE-VEV-VAULT-XFER-002/DATA-VIEW-ART-001.svg), UML-style ER/domain view | `STAGED_CANDIDATE` and `TRANSFER_RECEIPT` are separate from the committed Generation's `ARTIFACT_REFERENCE`. A physical location is not document identity. |
| One serving Vault fails or has no valid bytes | [`ARCH-VIEW-SEQ-012`](../../../docs/product/instances/idea-engineering/evidence/IE-VEV-VAULT-XFER-002/ARCH-VIEW-SEQ-012.svg), UML Sequence | Custody may choose another **eligible, verified location for the same ArtifactId, digest and size**. If none exists, it returns a bounded refusal and does not substitute a different Version or unverified file. Core v0's one-Vault setup has no second location to use. |
| A replica is incomplete or corrupt | [`ARCH-VIEW-SEQ-013`](../../../docs/product/instances/idea-engineering/evidence/IE-VEV-VAULT-XFER-002/ARCH-VIEW-SEQ-013.svg), UML Sequence | The target remains private/ineligible until exact size and digest verification succeeds; a replica is neither a backup nor a Check-in result. |

These views answer different questions at their declared abstraction levels. A single combined diagram would duplicate the existing transfer, publication, identity, replica-eligibility and read-failover models without adding a missing rule. P06 §2.3 therefore uses the maintained views rather than creating another architecture view.

## Source/render and verification limits

The six current Mermaid blocks above match their per-diagram SHA-256 values in the [render manifest](../../../docs/product/instances/idea-engineering/evidence/IE-VEV-VAULT-XFER-002/render-results.json). The `ARCH-VIEW-STATE-004`, `ARCH-VIEW-SEQ-006`, `ARCH-VIEW-SEQ-012` and `DATA-VIEW-ART-001` PNGs were inspected at readable size for the branches relevant to this review. The gallery's full-document source pin predates DOC-05 `@0.22`/DOC-06 `@0.18`; the matching block hashes support use of these unchanged diagrams, but the current Markdown remains the source of truth.

This is source/rendition and documentary coverage only. Planned `WS-03/07/08` and `ST-02/05/06/07` fault, corruption, receipt, failover and repair checks remain `NOT-RUN`. Private-candidate cleanup, retained-reference protection and actual recovery are separate operational verification concerns; this review does not declare them tested or P06 complete.
