# Development access state

Issue #26, engineering support only. Existing V1–V7 and account/session semantics are unchanged.

| Record | Ownership and invariant |
|---|---|
| Runtime configuration | Server-user mode 600; fixed preview DB, distinct roles, TLS paths and artifact hash. No secret in Git/argv. |
| Remote ownership | PID + process start ticks + exact working directory/JAR/Java identity; refuse stopping mismatches. |
| Local tunnel ownership | PID + start time + exact executable/command line for the launcher-owned OpenSSH forward; foreign occupied ports refused. `%LOCALAPPDATA%/IDEA/dev-preview-26/tunnel.json`, outside Git and shared across checkout paths for this one preview. No credentials stored. |
| Preview data | New `idea_ddm_preview_20261001_26.public`, least-privilege app; normal Stop never removes it. |

States: NOT_PROVISIONED -> STOPPED -> STARTING -> READY -> STOPPED.
FAILED/UNVERIFIED never implies READY. Repeated Start reuses verified ownership only; restart needs
fresh authentication. Provisioning is distinct from readiness. No broad cleanup/drop command exists.
