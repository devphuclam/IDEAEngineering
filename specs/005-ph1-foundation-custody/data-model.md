# PH1 data model — foundation and one Vault

**Status:** Delivery design, 2026-09-28. This is the F01–F05 subset of
[DOC-06](../../docs/product/instances/idea-engineering/DOC-06-data-integration-and-migration-specification.md),
not a new product schema approval. Column names and SQL types are implementation decisions in F02;
the ownership and invariants below are binding for PH1. No Logical Document, Generation,
Checkout, Review or Release record is created by this increment.

| Record | Minimum identity and data | Owner and relationship | PH1 invariant |
|---|---|---|---|
| Actor | Stable `ActorId`; display identity | Identity and Accounts; may have one native IDEA Account | Never take `ActorId` from an untrusted client request. Disablement does not reassign history. |
| IDEA Account / Login Identity | Account ID, linked `ActorId`; distinct Login Identity ID, login identifier and verifier; Account status/security version | Identity and Accounts; one Account has 0..* Login Identities under DOC-06 | No assumption of one login per Account. RESET requires the exact Login Identity ID and validates its Account/Organization/version/credential/state. Bootstrap is one-time; no public registration. Credentials/verifiers never enter Audit or source. |
| Account Administrator Role Definition version | Protected role-version ID, role code, exact version and Permissions | Access Policy | Version 1 keeps its three account lifecycle actions. Version 2 adds distinct setup/reset issuance Permissions; no overwrite or automatic assignment retargeting. Only exact supported versions are assignable. |
| Administrative Role Assignment | Assignment ID, Actor principal, exact role-version ID, Organization Scope, assigned_by, reason and evidence | Access Policy | Super grants v1/v2 through its existing assignment Permission; Super alone cannot issue credential proof. Each successor assignment has its own outcome/Audit. |
| Session | Internal SessionId, linked Account/Actor, security version, issued time, last eligible activity, absolute expiry and revocation state | Identity and Accounts; native HTTP session registry owns live proof binding | Disabled/stale-version, expired or revoked proof is ineligible. Last eligible activity controls idle expiry; absolute expiry cannot move. Retained metadata cannot restore proof after restart. Never expose a live proof through ActorContext JSON or Audit. |
| Credential setup/reset proof | ProofId, target Account/Login Identity, purpose, captured security version, digest of high-entropy proof, issue/expiry/consumption state | Identity and Accounts | One successful use at the bound target/state; no plaintext proof in storage/Audit. Redemption changes credential/state and required outcome/Audit atomically. A disabled target cannot become active through reset. Live delivery/recovery qualification remains separate. |
| Failed-login observation | Existing Login Identity ID, at most five failure timestamps and one blocked-until value | Identity and Accounts; at most one state record per existing Login Identity, located through normalized login | Apply spec v0.6's window/block rules atomically. Unknown identifiers create zero state records. Successful eligible sign-in clears only the current login's state atomically with session establishment. Blocked refusal retains equivalent password work. Temporary block is not disablement or identity replacement. |
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
- Credential proof: issued → consumed, expired or superseded. Successful redemption consumes
  exactly one proof; replay/wrong-target/stale-account-version attempts change no credential.
  V5 implements FIRST_SETUP only for PENDING/no-verifier targets. Proof-authorized redemption
  activates that same account and increments its security version atomically; no administrator
  role is required of the holder. V6 adds separate RESET proof for ACTIVE/DISABLED targets with
  an existing credential. Issuance requires an explicit Login Identity ID even for a single-login
  Account; validate the exact tuple, never infer the first login. V6 already supplies the proof's
  Account/Login Identity foreign key, so T046 changes no migration. Reset preserves account status
  and Actor disablement, replaces only the pinned login's verifier and increments Account security
  version while revoking all old Account sessions atomically. Sibling credentials remain unchanged
  and allow fresh sign-in only when the Account is ACTIVE.
  Captured versions make prior proofs stale; later re-enable requires the new expected version
  and never changes the verifier. Login-block records remain a later additive slice.
- Failed-login state is bounded by existing Login Identities, not submitted strings: at most one
  state record with five timestamps and one block deadline per identity; zero unknown-identifier
  state, including cache or queue entries. Discard timestamps at or before `now - 15 minutes`
  before evaluating an attempt. Record a new failure only outside an active block; once the fifth
  failure starts a block, preserve its deadline and add no further timestamps during it. Expiry
  is evaluated on access, so an idle expired record cannot still count as failures. No background
  cleanup job or arbitrary-name capacity pool is required. An empty bounded record may remain
  attached to its existing identity. Successful eligible sign-in clears that identity's state;
  another login on the same Account has independent failure state. No traffic-driven history
  table is added by this design. These are planned constraints, not executed evidence.
- Password length is checked as Unicode code points for the minimum, and UTF-8 bytes for the
  already-qualified BCrypt maximum. Reject rather than truncate; do not silently normalize or
  trim a submitted password. Numeric values are owned by spec's synthetic development profile.
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
