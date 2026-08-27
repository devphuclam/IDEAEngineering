---
status: accepted
date: 2026-08-26
decision-id: IE-ADR-C1-002
---

# No IDEA code runs inside design tools

IDEA Engineering uses no add-in, plug-in, macro, injection, or extension that runs inside design software. IDEA Desktop and Workspace Service operate outside those applications through a Managed Workspace and persisted files; this supports multiple tools and reduces vendor coupling, while accepting that IDEA cannot observe unsaved in-memory state or prevent local edits and must enforce publish authority at the Server seam.
