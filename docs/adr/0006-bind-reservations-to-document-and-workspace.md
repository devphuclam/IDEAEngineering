---
status: accepted
date: 2026-08-26
decision-id: IE-ADR-C1-005
---

# Bind Reservations to Document and Workspace with optimistic concurrency

A Reservation binds one Logical Document, actor, Managed Workspace, lease, and expected Generation; product-structure relationships do not propagate it. Because IDEA runs outside design software, a Reservation is not a file-system lock: local files may still change, but Server rejects non-owner or stale publish, preserves local work, and never auto-merges proprietary binary edits.
