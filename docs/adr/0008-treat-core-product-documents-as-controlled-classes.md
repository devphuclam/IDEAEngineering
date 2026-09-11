---
status: accepted
date: 2026-08-27
decision-id: IE-ADR-DOC-001
---

# Treat core product documents as controlled information-item classes

`DOC-01` through `DOC-08` identify controlled information-item classes, not physical files or instance IDs; every instance has its own semantic stable ID, version, status, and baseline identity. The class code remains separate from the stable ID, and an existing controlled artifact retains its established ID when adopted into a class. Document versions use `major.minor`: `0.x` for Draft or Proposed content, `1.0` for the first Approved version, a major increment for a material authority or contract change, and a minor increment for compatible content; a Git commit is baseline evidence rather than the document version. `DOC-01`, `DOC-03`, `DOC-04`, `DOC-05`, `DOC-06`, and `DOC-08` each maintain a product-level living baseline, while `DOC-02` owns indexed feasibility assessment records and `DOC-07` owns a living roadmap plus increment delivery records. This hybrid preserves one navigable product authority without forcing decision and delivery history into eight ever-growing files or recreating a complete document set for every increment.
