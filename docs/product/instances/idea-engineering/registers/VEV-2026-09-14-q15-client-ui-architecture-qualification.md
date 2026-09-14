# Q-15 Client/UI Architecture Vertical Slice Qualification — Execution Record

## Control envelope

| Field | Recorded value |
|---|---|
| Stable Supporting Record ID | `IE-VEV-TECH-Q15-001` |
| Supporting class / version / status | `VEV` / `0.1` / `Draft` |
| Qualification state | **`Q-15 PARTIAL`**; `NO WINNER — MORE QUALIFICATION REQUIRED` |
| Date / operator | 2026-09-14 ICT / Principal Product Author in the local Windows workspace |
| Owner / reviewer / acceptance authority | Principal Product Author; independent Client, security, accessibility and operations review `NOT-RUN`; Product Decision Authority acceptance `NOT-RUN` |
| Product normativity | `INFORMATIVE` qualification evidence only; no Product requirement, architecture approval, technology selection or gate result |
| Repository process authority / instruction state | `NOT-APPLICABLE` / `NOT-APPLICABLE` |
| Applicable baseline | `IDEA-C1-ANALYSIS-DESIGN-001`; starting repository commit `c97ead832e026972a95f75a6c1933579fd49ac13`; `IE-KNW-TECH-DEC-001@0.5`; `TECH-001@0.13`; `IE-RES-TECH-CLIENT-20260914-001@0.3`; `IE-CHG-TECH-CLIENT-002@0.1` |
| Exact qualification source | Commit `5556f60fc79b539556e492c05e25e9c21c11e8e1` (`feat: implement q15 client qualification slice`) |
| Source / upstream trace | [technology matrix](../../../knowledge/2026-09-13-core-v0-technology-decision-matrix.md), [TECH-001](../decision-briefs/TECH-001-technology-and-architecture-proposal.md), [Client/UI correction](CHG-2026-09-14-client-ui-stack-review-correction.md), [lifecycle evidence](../../../../research/2026-09-14-flutter-dotnet-lifecycle-support-evidence.md), [Q-15 harness](../../../../../qualification/q15/README.md) |
| Downstream trace | [controlled evidence package](../evidence/IE-VEV-TECH-Q15-001/20260914-local-01/README.md), future completed Q-15 run and Product Decision Authority disposition |
| Access / retention | `INTERNAL`; retain with exact source commit, dependency locks, fixture/contracts, run ledger and raw retained measurements |
| Change record / predecessor | Initial Q-15 execution record; predecessor `NOT-APPLICABLE`; records the first bounded implementation and local qualification run |
| Supersedes / Superseded by | `NOT-APPLICABLE` / `NOT-APPLICABLE` |
| Review trigger | Complete the blocked mandatory gates, change either candidate topology or shared contract, change the machine/fixture/measurement envelope, or obtain Product Decision Authority criteria and disposition |
| Evidence status | Builds and bounded automated tests recorded below; direct Dart FFI `PASS` for the exact harness; overall Q-15 `PARTIAL`; comparative winner and total lifecycle `QUALIFICATION-UNKNOWN` |

This record applies `IE-STD-AUTH-001@0.2`: a test result is bounded to the exact source,
environment, fixture and command; missing corporate or human evidence remains `BLOCKED` or
`NOT-RUN`. It does not turn the qualification `.NET` API test double into the selected Server. The
shared backend direction remains Ubuntu Server, Java 25/Spring and PostgreSQL; the protected local
component remains the separate `.NET 10` Workspace.

## 1. Decision question and result

Q-15 asks whether either of these installed-client architectures has enough measured evidence to
become the recommended IDEA Client/UI stack:

```text
A control: React → WebView2 message → WPF → Win32 named pipe → .NET Workspace
B primary: Flutter Windows → direct Dart FFI → Win32 named pipe → .NET Workspace
```

Both implementations are runnable against the same bounded fixture and contracts. Option B
completed the automated Windows harness flow through direct Dart FFI; Option A separately proved
its browser business surface and its WebView2/WPF-to-Workspace bridge. Mandatory corporate-image,
multi-user security, accessibility, IME, install/update/rollback and complete performance evidence
is absent. Therefore the result is **`NO WINNER — MORE QUALIFICATION REQUIRED`**. Option A remains
the provisional qualification control, not a proven lower-risk architecture. The recommendation,
Product Scope, FTR, REQ, Feature, Spec, Server, Module boundaries, accepted ADR meaning and PG state
do not change.

## 2. Phase 0 readiness inspection

The following table records the executable repository state before Q-15 source was added at the
starting commit. Product documents and research existed, but no production or qualification
implementation of this slice existed.

| Component | Exists at baseline | Runnable at baseline | Suitable for Q-15 at baseline | Gap / treatment |
|---|---|---|---|---|
| Production Java Server | No | No | No | Not fabricated. A loopback `.NET` API test double was created only for equal Client comparison. |
| Executable API / authentication | No | No | No | Shared OpenAPI, opaque-session semantics and deterministic API harness created. Server establishes Actor; client-supplied `ActorId` is refused. |
| Workspace executable | No | No | No | One shared `.NET 10` Workspace harness created for both candidates. |
| Named-pipe protocol | Documentation only | No | No | Versioned, framed, HMAC-authenticated, size-bounded shared qualification protocol created. |
| React frontend | No | No | No | Option A business surface created. |
| WPF/WebView2 shell | No | No | No | Narrow Option A host/typed bridge created; no XAML business-screen duplicate. |
| Flutter project | No | No | No | Flutter Web/Windows candidate created with direct Dart FFI first. |
| Shared test fixtures | No | No | No | Deterministic users, documents, locales and configurable size profiles created. |
| Q-15 build/test scripts | No | No | No | Reproducible candidate-only scripts created; repository verifiers are not called. |
| Q-15 performance harness | No | No | No | Frozen measurement definition and warm-start sampler created; several required metrics remain unmeasured. |

This gap required **qualification implementation preparation**. Results below are valid evidence
for the bounded harness, not production-equivalent Server or corporate deployment evidence.

## 3. Frozen common harness and fairness controls

Both candidates use:

- `IE-Q15-FIXTURE-001@1.0.0`, seed `15092026`, workspace `WS-Q15-001`;
- the same OpenAPI, session semantics, Document IDs, failure cases and locale strings;
- the same `idea-q15-workspace-v1` framed named-pipe protocol and same `.NET 10` Workspace process;
- the same large profile: 100,000 rows, 20 columns, 10,000 hierarchy nodes, depth 12;
- the same EN/VI/JA Unicode fixtures and proposed keyboard script;
- loopback API/network, one physical machine and Release builds;
- one untimed warm-up followed by ten retained restart samples for startup measurement.

No third-party grid/tree package was used by either candidate; both use custom virtualization. This
avoids giving one candidate a paid or mature component advantage, but does not prove that either
custom implementation is production-suitable. Performance acceptance thresholds were not approved,
so `THRESHOLD BLOCKED` was frozen before timing.

The qualification API is a test double. It returns authoritative checkout/check-in outcomes and
keeps Reservation states in the existing `Active → Ended / Expired / Recovered` lifecycle. Neither
Client claims commit without a Server result. Presentation IPC carries typed intents, not artifact
bytes, arbitrary paths or shell commands; Workspace retains local custody.

## 4. Execution environment

| Item | Exact run value |
|---|---|
| Machine | Intel Core i5-13500H; 12 cores / 16 logical processors; 16,868,962,304 bytes RAM |
| Operating system | Windows 11 Home Single Language, version `10.0.26200`, build `26200`, 64-bit |
| Network / image | Loopback on one development machine; not a controlled corporate Windows image |
| .NET | SDK `10.0.302`; executed test/runtime baseline `10.0.10` |
| Node / npm | Node `v24.18.0`; npm `11.16.0` |
| Flutter / Dart | Flutter `3.47.4` stable, commit `9584c6713b324636289d067944a46fd6b49df14b`; Dart `3.13.3` |
| Browser | Edge `153.0.4234.32`; Chrome `152.0.7977.84` |
| WebView2 runtime | `152.0.4191.66` |

The exact machine-readable snapshot is in
[`environment.json`](../evidence/IE-VEV-TECH-Q15-001/20260914-local-01/environment.json).

## 5. Executed tests and bounded results

| Evidence group | Actual result | Scope and limitation |
|---|---|---|
| Shared Workspace protocol | `PASS`, 18/18 | Framing, HMAC, version/scope/session checks, replay/request reuse, timeout, restart, concurrency, malformed/oversized/truncated input, unknown operation and typed-path refusal in the qualification protocol. Different Windows user and elevation mismatch were not exercised. |
| Shared API harness | `PASS`, 10/10 | Session-established Actor, expiry, 100k fixture, error/refusal/empty cases, spoofed Actor refusal, conflicts/stale/uncertain and authoritative check-in ending Reservation. This is a test double, not the Java Server. |
| Option A bridge | `PASS`, 8/8 | Origin, schema/version/size/operation allowlist and reset-related boundary checks. |
| Option A React unit | `PASS`, 4/4 | Deterministic selection behavior. |
| Option A browser E2E on Edge | `PASS`, 3/3 | Login/search, 100k×20 grid, exact detail, locale switch and distinct empty/refused/error/expired states. Does not traverse the installed WPF bridge. |
| Option A WPF/WebView2 Release build | `PASS` | Runnable installed-shell build against the exact source. |
| Option A installed bridge smoke | `PASS` | WebView loaded, origin validated and `GetWorkspaceStatus` round trip accepted by the shared Workspace. It is not the entire business flow. |
| Flutter static analysis | `PASS` | No reported analysis issue for the candidate source. |
| Flutter widget tests | `PASS`, 3/3 | Shared presentation/widget behaviors covered by the committed tests. |
| Flutter Web JS Release build / Edge E2E | `PASS`; 2/2 E2E | Login, large search/detail, locale switch and distinct failure states. Browser Workspace IPC is intentionally unavailable. |
| Flutter Web Wasm Release build / Edge E2E | `PASS`; 2/2 E2E | Same bounded Web cases. Correct `.mjs`/`.wasm` MIME and COOP/COEP headers were required. |
| Flutter Windows Release build | `PASS` | Runnable Windows candidate. |
| Flutter Windows direct-FFI repetition | `PASS`; 32/32 OpenDocument round trips | Direct Dart FFI, overlapped Win32 named-pipe I/O, no custom C++ shim/plugin. |
| Flutter Windows critical full flow | `PASS`, 1 run | Login → search → 100k×20 browser → detail → checkout → Workspace Open → authoritative check-in; EN/VI/JA widgets and keyboard editing included. It remains a bounded local harness run. |
| Repository documentation/diagram verifiers | `NOT-RUN — execution instruction` | Direct user instruction prohibited repository verifier scripts. No CI/status-check PASS is claimed. |

The run ledger and raw retained browser/startup/full-flow results are under the
[`20260914-local-01` evidence package](../evidence/IE-VEV-TECH-Q15-001/20260914-local-01/README.md).

## 6. Candidate dispositions

| Area | Option A — React/WebView2/WPF | Option B — Flutter Web/Windows |
|---|---|---|
| Build | `PASS` for React and WPF Release builds | `PASS` for Web JS, Web Wasm and Windows Release builds |
| Functional | Browser subset `PASS`; installed bridge smoke `PASS`; end-to-end installed business flow `NOT-RUN`; total `QUALIFICATION-UNKNOWN` | Windows bounded full flow `PASS`; Web subsets `PASS`; production-equivalent flow `QUALIFICATION-UNKNOWN` |
| Security / IPC | Shared protocol and A bridge suites `PASS`; different-user/elevation gates `BLOCKED`; total `QUALIFICATION-UNKNOWN` | Shared protocol and 32 direct-FFI round trips `PASS`; different-user/elevation gates `BLOCKED`; total `QUALIFICATION-UNKNOWN` |
| Performance | Ten warm/restart startup samples and one idle-memory snapshot retained; thresholds `BLOCKED`; comparative outcome `QUALIFICATION-UNKNOWN` | Same evidence shape; thresholds `BLOCKED`; comparative outcome `QUALIFICATION-UNKNOWN` |
| Accessibility | Keyboard/semantic attributes exercised in focused automation; assistive technology, high contrast, scaling and human review `BLOCKED` | Same; Web and Windows assistive-technology evidence `BLOCKED` |
| IME | Unicode and inline-edit widgets exercised; real Vietnamese/Japanese composition, cancel, focus-change and reconversion `BLOCKED` | Same |
| Install/update | Signing, clean install, N→N+1, interruption, rollback and corporate deployment `BLOCKED` | Same |
| Lifecycle | Adjacent runtime facts captured; actual upgrade rehearsal, dependency servicing effort and company patch policy `QUALIFICATION-UNKNOWN` | Same |

## 7. Direct Dart FFI finding

The first Flutter Windows OpenDocument run reproduced a direct-FFI failure: the code made a
separate `GetLastError` FFI call after overlapped `ReadFile`/`WriteFile`, and observed Win32 error
zero. That is not a reliable atomic error capture because arbitrary VM work may change the
thread-local last-error value between calls. A minimal integration test repeating OpenDocument 32
times was red before the correction.

The direct client was corrected to pass a null synchronous-byte-count pointer for overlapped I/O,
wait on a manual-reset event based on the wait result, then obtain completion with
`GetOverlappedResult`. The original reproduction and the critical flow then passed. This supports
the exact direct Dart FFI lane in this harness; it does not prove every production IPC lifecycle or
deployment condition. No C ABI, C++ shim or custom Flutter plugin was introduced, so fallback use is
**`NO`**.

## 8. Performance and resource evidence

### 8.1 Warm/restart startup samples

| Candidate | n | External min / mean / p50 / p95 / p99 / max (ms) |
|---|---:|---|
| Option A | 10 | `890.3790 / 907.7648 / 899.1120 / 948.3023 / 948.3023 / 948.3023` |
| Option B | 10 | `1180.1614 / 1341.6150 / 1204.1641 / 2185.7328 / 2185.7328 / 2185.7328` |

The external measurement principle is the same—process launch until process exit after a readiness
report—but includes process-exit overhead. The internal values are **not comparable**: A measures
WebView loading + bridge + pipe, while B starts after Flutter's first frame and times the pipe lane.
All samples, including Option B's `2185.7328 ms` value, are retained. Cold-cache startup was
`NOT-RUN`; no outlier was excluded; no performance winner is assigned.

### 8.2 One-snapshot resource and build-size observations

| Observation | Option A | Option B | Status |
|---|---:|---:|---|
| Idle working set after 10 s | 596,488,192 bytes across WPF + six WebView2 processes | 333,647,872 bytes in one process | One sample only; `QUALIFICATION-UNKNOWN` |
| Idle private bytes | 331,460,608 | 333,619,200 | One sample only; `QUALIFICATION-UNKNOWN` |
| Windows Release output | 29,511,377 bytes / 24 files, excluding WebView2 user-data | 28,501,220 bytes / 15 files | Build-output observation, not installed footprint |
| Web Release output | React dist 1,735,235 bytes / 4 files, including 1,451,297-byte source map | JS output 41,865,209 bytes / 41 files; Wasm output 44,050,583 bytes / 43 files | Flutter totals include renderer/fallback variants and are not an initial-download metric |

Active/peak memory, comparable CPU over the critical interval, input/scroll/edit latency,
long-task/frame timing and build duration were `NOT-RUN`. The raw evidence therefore cannot support
a framework performance conclusion.

## 9. Maintainability inventory

The same nonblank physical-line rule was applied to both candidates. Measured candidate-specific
runtime/test code is recorded in
[`maintenance-inventory.json`](../evidence/IE-VEV-TECH-Q15-001/20260914-local-01/maintenance-inventory.json).
Option A spans React/TypeScript plus WPF/.NET/WebView2 and a custom typed bridge. Option B spans
Dart/Flutter plus one 450-line direct-FFI/Win32 client; its Windows runner files are generated rather
than a custom plugin. Both also depend on the same `.NET` Workspace and API harness for this run.

Actual named maintenance owners, team proficiency, defect effort, patch effort and upgrade effort
remain `BLOCKED` or `QUALIFICATION-UNKNOWN`. Line counts and dependency counts describe the current
prototype; they do not establish total cost or architectural risk.

## 10. Mandatory blockers and not-run work

| Missing evidence | State | Required completion condition |
|---|---|---|
| Real Java/Spring Server, PostgreSQL, HTTPS and production authorization | `BLOCKED` | Execute against the selected production-like backend without changing Client semantics. |
| Different Windows user and elevation mismatch | `BLOCKED` | Controlled multi-account/elevation environment and retained denial evidence. |
| Corporate Windows/browser policy, multi-monitor/DPI and real native-dialog behaviors | `BLOCKED` | Representative company image and hardware. |
| IRONCAD/Office launch, large artifact transfer, resumability and real custody recovery | `BLOCKED` | Approved applications, representative files and production-equivalent Workspace/Store path. |
| Real VI/JA IME composition/reconversion | `BLOCKED` | Approved IME setup and human-observed shared script. |
| Screen reader, high contrast, scaling and accessibility reviewer | `BLOCKED` | Separate Web/Windows AT environment and named reviewer. |
| Signing, clean install, update interruption and rollback | `BLOCKED` | Company certificate, packaging and deployment/update system. |
| Full frozen Web navigation/clipboard/upload/download/print matrix | `NOT-RUN` | Execute every applicable scenario and record explicit non-applicable items. |
| Cold startup and full interaction/frame/resource measurement set | `NOT-RUN` | Approved thresholds and same-principle instrumentation across both candidates. |
| Flutter Web `flutter drive` | `BLOCKED` | A configured WebDriver endpoint; Flutter integration-test Web device invocation was not supported in the attempted local path. Playwright covered the retained browser subset instead. |
| Independent review and PDA disposition | `NOT-RUN` | Named reviewers and Product Decision Authority action. |

## 11. Lifecycle evidence and conclusion

Fresh first-party evidence identifies Flutter `3.47.4` / Dart `3.13.3` as current stable for the run
and describes a rolling current-stable servicing model; the reviewed sources publish no fixed
multi-year Flutter `3.47.x` support horizon. Microsoft lists .NET 10 as active LTS, with the policy
snapshot's current patch `10.0.12` and end of support `2028-11-14`. These are different support
contract shapes, not an automatic winner. Candidate dependency cadence, company patch policy,
upgrade rehearsal, rollback and actual maintenance effort remain unmeasured; total lifecycle result
is **`QUALIFICATION-UNKNOWN`**.

Final disposition:

```text
Q-15 STATUS:           PARTIAL
CURRENT WINNER:        NO WINNER — MORE QUALIFICATION REQUIRED
RECOMMENDATION CHANGED: NO
PRODUCT SCOPE CHANGED:  NO
PRODUCT / PG DECISION:  NOT-RUN
```
