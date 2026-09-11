---
status: accepted
date: 2026-08-26
decision-id: IE-ADR-C1-004
---

# Use immutable Generations and atomic Check-in Change Sets

A Logical Document keeps stable identity and every changed Product Definition publishes as a new immutable Generation. A multi-document Check-in publishes all selected changes or none after staging, digest validation, and verified immutable materialization; metadata, Working Heads, evidence, and outbox commit together, while unreferenced candidates remain private and eligible for reconciliation.

Clarification accepted on 2026-09-10: this is logical all-or-none publication, not a claim that the
database and Artifact store share one physical ACID transaction. Large Artifacts are staged through
resumable, checksummed chunks; one database transaction makes the verified manifests, Generations,
Working Heads, Change Set, Audit/outbox and in-scope Reservation release authoritative. A stable
`OperationId`, status query and reconciliation make an interrupted or uncertain retry idempotent and
prevent a partially successful document set from becoming public.
