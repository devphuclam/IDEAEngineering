# P06 Guided Review — Step 2: Expired or Stale Work

| Field | Record |
|---|---|
| Evidence ID / class | `P06-GUIDED-REVIEW-STEP2-20260924` / guided documentary review note |
| Version / status | `0.1` / Draft |
| Product normativity | Informative; no new product requirement or approval |
| Increment / work package | `IE-INC-READY-001` / P06, T022 |
| Review date | 2026-09-24 (Asia/Ho_Chi_Minh) |
| Reviewer / author | Current Project Reviewer accepted the proposed treatment subject to consistency with existing diagrams; assistant checked that condition and prepared this trace |
| Reviewed plan | [P06 plan](../recovery-and-security-plan.md) `@0.3`, SHA-256 `625F4BBD13BF8BA01AC92989814C2BC09327AD45342AEF8127CA35A70352D9F7`, §2.2 |
| Requirement basis | Approved predecessor `DOC-04@0.13` at commit `f269a0445737a7efd7f406ee51517149a8967afa`, `REQ-WS-010/011/013/014`; current [DOC-04](../../../docs/product/instances/idea-engineering/DOC-04-software-requirements-specification.md) `@0.15` is a Draft successor |
| Architecture source | Current [DOC-05](../../../docs/product/instances/idea-engineering/DOC-05-architecture-description.md) `@0.22`, SHA-256 `E03B5577F86883CD1E5374779434CD3B4B4A75B3BF241C812A1E612F266341AA`, §7; diagram content remains Draft, not an executed test or separate Product Decision Authority approval |
| Result boundary | Step 2 documentary explanation accepted after diagram comparison; P06 overall review, reviewer competence assessment, application tests and PG4 remain `NOT-RUN` |
| Classification / retention | `INTERNAL`; retain with P06 evidence, supersede if the reviewed rule or source diagram changes |

## Reviewer input and resolution

The proposed treatment was: network loss does not immediately end a Reservation; an expired Reservation cannot authorize Check-in; stale expected Generation or invalid work scope refuses publication while preserving the edited local file; the engineer receives explicit safe next actions, with no automatic CAD/Office merge or overwrite.

The Project Reviewer answered on 2026-09-24: **“Tôi nhớ là tôi có vẽ một mớ các cái Diagram để bạn làm theo đấy. Nếu phù hợp thì làm theo. Nhưng cái bạn đề xuất là ổn đấy.”** This is acceptance conditional on the existing diagrams. The source check below found the proposed treatment consistent, with the qualifications recorded here.

## Diagrams used, not newly invented

| Controlled view | Model kind and purpose | Relevant conclusion |
|---|---|---|
| [`ARCH-VIEW-STATE-002`](../../../docs/product/instances/idea-engineering/evidence/IE-VEV-VAULT-XFER-002/ARCH-VIEW-STATE-002.svg) | UML State Machine; lifecycle of one server Reservation record | Network loss is not a state transition. Lease deadline changes `Active` to `Expired`. A terminal old record never becomes `Active` again; any later Checkout creates a new Reservation against the current head. |
| [`ARCH-VIEW-SEQ-002`](../../../docs/product/instances/idea-engineering/evidence/IE-VEV-VAULT-XFER-002/ARCH-VIEW-SEQ-002.svg) | UML Sequence; atomic Check-in or refusal | Stale, unauthorized or invalid scope is refused; local work and prior heads are preserved. Failed Check-in ends no still-valid Reservation. The Server revalidates current head, entitlement and other gates at commit time. |
| [`ARCH-VIEW-STATE-003`](../../../docs/product/instances/idea-engineering/evidence/IE-VEV-VAULT-XFER-002/ARCH-VIEW-STATE-003.svg) | Local Reference condition/state view; combines local integrity with server freshness | A modified Reference is a separate case from an expired Checkout. Only a verified current Generation may be converted through a fresh Checkout; stale or unknown conditions preserve local work and prohibit a direct publish claim. |
| [`ARCH-VIEW-SEQ-005`](../../../docs/product/instances/idea-engineering/evidence/IE-VEV-VAULT-XFER-002/ARCH-VIEW-SEQ-005.svg) | UML Sequence; modified-Reference choices | Current and stale Reference paths require explicit user choice; the stale path uses a safe copy/current download, Create Copy or deliberate manual reapply, never automatic binary merge. |

The SVGs are from the maintained `IE-VEV-VAULT-XFER-002` gallery. Its full-document source pins are older than current DOC-05 `@0.22`; the current Markdown diagram blocks were compared with the corresponding hashes in the [render manifest](../../../docs/product/instances/idea-engineering/evidence/IE-VEV-VAULT-XFER-002/render-results.json) and still match. Current Markdown is the source used for this review. Rendition matching is not runtime or independent specialist verification.

## Step 2 finding and limits

The P06 plan §2.2 agrees with the diagrams and the approved predecessor requirement semantics. A fresh Checkout is permitted only after validating the **current** Working Head; it cannot resurrect the expired Reservation or convert stale local work directly into a publishable current file. Governed Reservation Recovery is an authorized, reasoned and audited action, not an unrestricted engineer command. The exact lease duration and renewal/grace policy remain open configuration inputs and are not set by this review.

No documentary contradiction was identified for this narrow Step 2. Runtime stale-write, expiry, local-preservation and recovery cases remain `NOT-RUN`; this note does not close the remaining P06 recovery, backup, rollback, security or competence review.
