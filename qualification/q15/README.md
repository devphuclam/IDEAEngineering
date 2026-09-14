# Q-15 Client/UI architecture qualification

> **QUALIFICATION CODE — NOT PRODUCTION CODE**

This directory contains the bounded Q-15 comparison between the two Client/UI
architectures described by `IE-KNW-TECH-DEC-001@0.5`. It deliberately does not
implement the IDEA Server, replace the selected Java Server direction, or grant
any product/gate status.

Both candidates use the same synthetic fixture, HTTP contract, Workspace
protocol, `.NET 10` Workspace executable, scenarios, and measurement definitions.

```text
shared API harness ----+---- Option A React -> WebView2 -> WPF --+
                       |                                      |
                       +---- Option B Flutter Web/Windows -----+--> named pipe --> shared .NET Workspace
```

The API harness is a test double written in .NET only because the repository had
no Server implementation when Q-15 started. It is not a proposal to replace the
selected Java/Spring Server. HTTP is bound to loopback for the qualification run;
production HTTPS, PostgreSQL, and real authorization remain outside this harness.

## Layout

| Path | Purpose |
|---|---|
| `shared/contracts` | Frozen OpenAPI and framed named-pipe contracts used by both candidates. |
| `shared/fixtures` | Synthetic users, documents, locale strings, and configurable grid/tree profiles. |
| `shared/scenarios` | Common keyboard and security scripts. |
| `shared/metrics` | Frozen measurement definitions and non-approved threshold boundary. |
| `shared/dotnet` | Qualification API, shared IPC library, Workspace process, and protocol tests. |
| `option-a` | React/TypeScript business UI and narrow WPF/WebView2 shell. |
| `option-b` | Flutter Web/Windows UI and direct Dart FFI named-pipe client. |
| `scripts` | Reproducible build/test/run and evidence-capture entry points. |

## Evidence classification

- A passed build or focused automated test is evidence only for that exact
  command, source commit, environment, and fixture.
- Corporate deployment, signing, updater/rollback, multi-user Windows isolation,
  real CAD/Office launch, real IME, screen-reader and representative-user work
  remain `BLOCKED` or `NOT-RUN` until those environments exist.
- The proposed keyboard target and any performance values are experiment controls,
  not Product requirements or approved service levels.

See `scripts/README.md` for exact commands. Repository-wide verifier scripts are
not invoked by any Q-15 script.
