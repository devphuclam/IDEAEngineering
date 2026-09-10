---
status: accepted
date: 2026-08-26
decision-id: IE-ADR-C1-005
---

# Bind Reservations to Document and Workspace with optimistic concurrency

A Reservation binds one Logical Document, actor, Managed Workspace, lease, and expected Generation; product-structure relationships do not propagate it. Because IDEA runs outside design software, a Reservation is not a file-system lock: local files may still change, but Server rejects non-owner or stale publish, preserves local work, and never auto-merges proprietary binary edits.

Clarification accepted on 2026-09-10: loss of connectivity, sign-out or application exit does not
immediately release a Reservation. Lease expiry removes server publish entitlement but never deletes
or transfers local work. Successful changed or No Change Check-in always releases every confirmed
in-scope Reservation; there is no retain-after-Check-in option. Governed cancel and authorized,
reasoned, audited recovery are the other supported end paths, and every renewed or replacement
Reservation must still validate the current expected Generation.
