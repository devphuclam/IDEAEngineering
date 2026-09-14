# Q-15 local execution scripts

These scripts exercise only the isolated Q-15 qualification code. They do not
invoke any repository documentation validator or verifier.

## Source checks and release builds

```powershell
pwsh -NoProfile -File qualification/q15/scripts/Invoke-Q15SourceChecks.ps1 `
  -FlutterCommand D:/Work/Tools/flutter-q15-stable/bin/flutter.bat `
  -IncludeReleaseBuilds
```

This runs the shared .NET tests, Option A bridge tests/build, React unit tests
and build, Flutter analysis/widget tests, and—when requested—the Flutter JS,
Wasm and Windows release builds. Browser E2E is separate because it needs the
API harness and static web server.

Serve a built Flutter Web output with the required `.mjs`/`.wasm` MIME types
and cross-origin-isolation headers before the Option B Playwright run:

```powershell
python qualification/q15/scripts/serve_flutter_web.py `
  --directory qualification/q15/option-b/flutter/build/web --port 5174
```

## Windows Direct FFI integration

```powershell
pwsh -NoProfile -File qualification/q15/scripts/Invoke-Q15WindowsIntegration.ps1 `
  -FlutterCommand D:/Work/Tools/flutter-q15-stable/bin/flutter.bat
```

The script generates an ephemeral test-session secret, starts the loopback API
and shared Workspace in hidden child processes, waits for readiness, runs the
Flutter Windows integration tests, then stops both processes. Logs and custody
output remain under ignored `qualification/q15/.runtime/`.

## Startup samples

With a Workspace harness already running and the same process-scoped secret set:

```powershell
pwsh -NoProfile -File qualification/q15/scripts/Measure-Q15Startup.ps1 `
  -Candidate option-a -ExecutablePath <Option-A-exe> -OutputDirectory <raw-dir>

pwsh -NoProfile -File qualification/q15/scripts/Measure-Q15Startup.ps1 `
  -Candidate option-b -ExecutablePath <Option-B-exe> -OutputDirectory <raw-dir>
```

The result contains every external process-duration sample and the candidate's
internal readiness measurement. Thresholds remain `BLOCKED`; the script reports
measurements, not a winner.
