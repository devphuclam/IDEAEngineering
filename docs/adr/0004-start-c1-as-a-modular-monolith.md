---
status: accepted
date: 2026-08-26
decision-id: IE-ADR-C1-003
---

# Start C1 as a modular monolith with deep modules

The C1 Server begins as a modular monolith whose deep modules expose small interfaces, own authoritative state, and cannot write another module's state. This preserves atomic invariants and simple operations early while retaining seams that may become process boundaries only when measured scale, security, ownership, or failure-isolation requirements justify the added distributed-systems cost.
