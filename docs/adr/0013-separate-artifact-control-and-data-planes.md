---
status: proposed
date: 2026-09-17
decision-id: IE-ADR-C1-011
---

# Separate Artifact control and data planes and support multi-location custody

IDEA separates the control plane for a file operation from the data plane that carries the file
bytes. The Client asks the IDEA Server to authorize and prepare an operation. Artifact Custody then
selects an eligible Artifact Gateway and Vault location and issues a short-lived, operation-scoped
`Transfer Grant`. The Client transfers resumable, digest-verified chunks directly through that
Gateway. The Gateway returns an authenticated `Transfer Receipt`; the authoritative owner still
revalidates the operation and commits the Generation, Change Set, Reservation disposition, Audit
Evidence and related relational state.

The IDEA Server therefore remains the authority for Actor context, RBAC, expected Generation,
Reservation, confirmed scope, operation state and publication. An Artifact Gateway is an Adapter at
the byte-custody Seam, not a second product authority. A successful upload or download is not a
successful Check-in, Approval or Release.

One logical Artifact may have several verified `ArtifactLocation` records in different Vaults.
Artifact Custody selects locations according to a versioned storage/durability policy, health,
locality and capacity. Replication copies immutable bytes between Vaults without requiring the
Client to upload the same Artifact again and without changing Artifact, Generation, Revision or
Release identity. A replica is not a backup; coordinated backup and restore remain separate
obligations.

This decision selects the architecture Seam and behavior, not a storage product, Gateway runtime,
protocol implementation, topology count or durability threshold. Exact minimum verified locations
for Check-in and Release, failure-domain rules and operating targets remain controlled Spec/Tech
inputs and cannot be reported as qualified until evidence exists.

## Consequences

- The IDEA Server may initially run on one host without becoming the byte-throughput proxy for every
  large transfer. It remains a control-plane availability dependency.
- Clients receive no database credential, permanent Vault credential, raw provider path or
  unrestricted storage capability. A Transfer Grant is bound to the exact operation, direction,
  object/candidate, expected size/digest, permitted ranges and expiry.
- Artifact Gateway validates the grant, accepted ranges, size and digest and returns a correlated
  Transfer Receipt. It cannot create a Generation or decide that Check-in succeeded.
- Private candidate bytes remain invisible to authoritative reads until the owner commits the
  complete operation. Failed or abandoned candidates remain subject to reconciliation.
- Downloads use the same separation: the Server authorizes and selects a healthy verified location;
  the Client downloads through the selected Gateway and verifies the expected digest.
- Artifact Custody records one logical Artifact and one-to-many physical locations. Location repair,
  replication, failover and retirement never rewrite retained Generation manifests.
- A filesystem implementation places a Gateway near or on the storage node. An object-storage
  implementation may use a provider-native scoped transfer behind the same Interface. Neither option
  is selected by this ADR.
- Exact performance, concurrency, location-count, replication-lag, RPO/RTO and availability values
  remain `BLOCKED` or `NOT-RUN` until the applicable authority approves the profile and verification
  evidence exists.
- This ADR records the internally selected design direction and remains Proposed until the Product
  Decision Authority reviews the exact successor Spec and architecture baseline.

## Evidence and provenance boundary

The architecture is an IDEA synthesis. Official Aras documentation supports the precedent of
multiple Vaults, location priorities, replication and chunked/checksummed upload transactions;
official AWS, Azure and Google documentation supports short-lived scoped direct and resumable
transfer patterns. None of those sources proves that another product uses this exact IDEA design or
that the design has passed IDEA runtime qualification. See
[IE-RES-VLT-XFER-20260917-001](../research/2026-09-17-vault-transfer-and-multi-location-provenance.md).
