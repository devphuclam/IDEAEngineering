# Option A — React / WebView2 / WPF

> Qualification implementation only.

`web` contains the business UI for browser and installed-shell use. `desktop`
contains only a WPF host, loopback static-file server, strict WebView2 boundary,
and the typed client for the shared Workspace named pipe. No business screen is
duplicated in XAML.

The Web surface cannot directly open local files. When hosted by the WPF shell,
the same React action emits an allowlisted intent. The shell validates origin,
protocol, bridge session, size, operation and payload before calling Workspace.
