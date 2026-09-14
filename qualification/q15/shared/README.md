# Shared Q-15 qualification boundary

This is the single source of truth for candidate-neutral contracts and fixtures.
Neither client may change a scenario, dataset size, semantic state, or measurement
definition without changing this shared baseline first and recording the deviation.

The Server establishes the Actor from opaque session proof. Client payloads contain
no authoritative `ActorId`. The UI sends only a typed Workspace intent; it never
sends file bytes, shell commands, or arbitrary paths over the presentation/native
bridge. The Workspace remains responsible for local custody, materialization,
hashing, journal state, resumable-transfer state, and approved-process launch.
