# Option B — Flutter Web / Flutter Windows

> Qualification implementation only.

The same Dart presentation/state code builds for Web and Windows. On Windows,
`lib/workspace/workspace_client_windows.dart` calls the Win32 named-pipe APIs
directly through `dart:ffi`. There is no C++ shim, Flutter plugin, or custom native
bridge. The generated Windows runner is unmodified except for product labeling.

Web intentionally reports that local Workspace IPC is unavailable; it does not
send a filesystem path or pretend browser JavaScript can call the native pipe.
The installed Windows build runs the complete typed-intent lane.
