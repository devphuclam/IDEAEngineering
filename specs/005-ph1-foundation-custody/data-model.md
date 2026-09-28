# PH1 data model — foundation and one Vault

**Status:** Delivery design, 2026-09-28. This is the F01–F05 subset of
[DOC-06](../../docs/product/instances/idea-engineering/DOC-06-data-integration-and-migration-specification.md),
not a new product schema approval. Column names and SQL types are implementation decisions in F02;
the ownership and invariants below are binding for PH1. No Logical Document, Generation,
Checkout, Review or Release record is created by this increment.

| Record | Minimum identity and data | Owner and relationship | PH1 invariant |
|---|---|---|---|
| Actor | Stable `ActorId`; display identity | Identity and Accounts; may have one native IDEA Account | Never take `ActorId` from an untrusted client request. Disablement does not reassign history. |
| IDEA Account / Login Identity | Account ID, linked `ActorId`, login identifier, password verifier, status/security version | Identity and Accounts | Bootstrap is controlled and one-time; no public registration. Credentials and verifier never enter Audit or source. |
| Session | Opaque session identity, `ActorId`, security version, expiry/revocation state | Identity and Accounts | A disabled account, logout or revocation makes protected reuse ineligible. A cookie/token is proof, not Actor identity. |
| Sample owner operation | `OperationId`, `ActorId`, command kind, correlation ID, accepted/refused result | PH1 sample authoritative owner; one result for an idempotent operation | It demonstrates the owner/Audit transaction, not a document workflow or general-purpose product object. |
| Audit Evidence | Evidence ID, `OperationId`, `ActorId`, action, target, timestamp, outcome/reason | Audit Evidence; references owner operation | Append-only. A committed successful owner result and its required evidence share one relational transaction. Audit does not decide the result. |
| Vault Endpoint | Stable `VaultId`/endpoint identity, adapter kind, eligibility | Artifact Custody | PH1 configures one endpoint. Identity is not its hostname, directory or Adapter key. |
| Transfer | `TransferId`, `OperationId`, `ActorId`, direction, endpoint ID, expected size/digest, state | Artifact Custody; later custody result is separate from owner product result | One operation identifies retries. Bytes in a private candidate do not imply committed custody. |
| Transfer Grant | Grant ID, exact Transfer/Operation/endpoint/direction/object claims, allowed byte range, expiry, status | Server-issued, Gateway-validated | A grant is short-lived and scoped; secret material is not retained in domain or Audit fields. Wrong endpoint/object/expiry fails closed. |
| Transfer Receipt | Receipt ID, Transfer/Operation/endpoint/candidate correlation, accepted size/digest, verification status | Gateway produces; Server validates | A verified receipt supports custody acceptance; it is neither a Check-in nor a Generation. Forged or mismatched evidence cannot commit metadata. |
| Artifact | Stable `ArtifactId`, content digest, byte count | Artifact Custody; one or more Locations may later represent it | ID and digest are independent of path. PH1 has no Generation manifest reference. |
| Artifact Location | Stable `LocationId`, `ArtifactId`, `VaultId`, opaque Adapter key, verification state | Artifact Custody | PH1 creates at most one verified location per accepted fixture; physical path stays private to Adapter. Do not encode one-Vault cardinality into Artifact identity. |

## State and transaction rules

- Session: `Active` → `Expired` or `Revoked`; disabling an account invalidates eligibility without
  deleting the Actor or historical outcomes.
- Transfer: `Preparing` → `Transferring` → `Verified` → `Consumed`; failure, expiry or an
  indeterminate response leads to `Failed`, `Expired` or `NeedsReconciliation`. An idempotent
  retry of the same `OperationId` must resolve the prior state before creating another result.
- Location: private candidate → verified location. A failed checksum or unverified receipt
  cannot produce a successful Artifact/Location result; an orphan candidate remains private for
  reconciliation/expiry. Physical cleanup is separately governed.
- F04 owner result, required Audit Evidence and any required outbox record commit or roll back as
  one PostgreSQL unit of work. File bytes cannot join that transaction; F05 must verify the
  Gateway Receipt before the relational custody acceptance.
- Only one Vault is configured and tested in PH1. The distinct `ArtifactId`, `VaultId`,
  `LocationId` and Adapter key are the extension seam, **not** evidence that multi-Vault works.

## Validation boundaries

Required IDs must be non-empty and stable; expected size must be non-negative; digest algorithm
and encoded value must be explicit and compared with actual bytes; grant expiry must be finite;
the receipt must match the exact transfer, endpoint, expected size and digest. Exact SQL types,
length limits and grant duration belong to F02/F05 implementation qualification, not to an
unapproved product rule. F05 fixtures are the approved synthetic 1 KiB and 64 MiB files only.
