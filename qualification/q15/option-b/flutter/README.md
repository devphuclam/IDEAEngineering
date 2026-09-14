# IDEA Q-15 Option B Flutter client

> **Qualification implementation only — not production source.**

This Flutter project builds the shared Q-15 presentation slice for Web and
Windows. The Windows target uses the direct Dart FFI named-pipe client in
`lib/workspace/workspace_client_windows.dart`; the Web target deliberately
reports native Workspace IPC as unavailable.

From this directory:

```powershell
flutter pub get
flutter analyze
flutter test
flutter build web --release
flutter build web --wasm --release
flutter build windows --release
```

The Windows integration tests require the shared API and Workspace harnesses
plus a process-scoped `IDEA_Q15_WORKSPACE_SECRET`. Use
`../../scripts/Invoke-Q15WindowsIntegration.ps1` from the repository root for a
reproducible local run. That script does not invoke repository verifier scripts.
