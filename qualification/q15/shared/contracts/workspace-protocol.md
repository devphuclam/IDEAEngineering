# IDEA Q-15 Workspace protocol v1

Status: **frozen qualification contract; not a production protocol approval**.

## Transport and frame

- Windows byte-mode named pipe: `\\.\pipe\idea-q15-workspace-v1`.
- One request and one correlated response per connection.
- Four-byte unsigned little-endian payload length followed by UTF-8 JSON.
- Maximum request/response JSON payload: 65,536 bytes.
- Partial reads/writes are accumulated; zero-byte/truncated frames are rejected.
- A request timeout closes the client handle. Blocking Win32 I/O must run outside
  the Flutter UI isolate; timeout/cancellation terminates that worker isolate.

## Request

```json
{
  "protocolVersion": "1.0",
  "requestId": "8f7cf88e-6f1b-48bb-940c-bc5acc706d71",
  "workspaceId": "WS-Q15-001",
  "sessionId": "SESSION-Q15-001",
  "sequence": 1,
  "issuedAtUnixMs": 1789344000000,
  "operation": "GetWorkspaceStatus",
  "payload": {},
  "mac": "base64url-hmac-sha256"
}
```

The MAC input is UTF-8 text with exactly these newline-separated fields:

```text
protocolVersion
requestId
workspaceId
sessionId
sequence
issuedAtUnixMs
operation
base64url(sha256(UTF8(payload canonical JSON)))
```

Canonical payload JSON sorts object keys ordinally, retains array order, emits no
insignificant whitespace, and uses JSON scalar spelling. Qualification launch
scripts create an ephemeral session secret; no secret is committed.

## Allowlisted operations

| Operation | Required payload | Workspace result |
|---|---|---|
| `GetWorkspaceStatus` | `{}` | Workspace identity, protocol and readiness. |
| `OpenDocument` | `documentId`, `generationId` | Materialize/hash/journal by internal mapping; never accept a path. |
| `OpenFolder` | `documentId` | Resolve the internally owned materialization folder. |
| `SelectFile` | `documentId`, `artifactRole` | Resolve an allowlisted manifest member. |
| `LaunchApprovedApplication` | `documentId`, `generationId`, `applicationCode` | Launch only an allowlisted application code when the harness opt-in is enabled. |

No operation accepts a shell string, executable path, filesystem path, store
credential, or complete Artifact bytes.

## Authentication/replay rules

`CurrentUserOnly` pipe isolation is necessary but insufficient. Workspace also
validates protocol, Workspace/session identity, timestamp window, HMAC, frame
bounds, request identity, and payload schema. An exact replay receives the cached
correlated result without re-execution. Reuse of a `requestId` with a different
fingerprint is refused. Local candidate files are never deleted on a refusal.
