---
status: accepted
date: 2026-08-26
decision-id: IE-ADR-C1-004
---

# Use immutable Generations and atomic Check-in Change Sets

A Logical Document keeps stable identity and every changed Product Definition publishes as a new immutable Generation. A multi-document Check-in publishes all selected changes or none after staging, digest validation, and verified immutable materialization; metadata, Working Heads, evidence, and outbox commit together, while unreferenced candidates remain private and eligible for reconciliation.
