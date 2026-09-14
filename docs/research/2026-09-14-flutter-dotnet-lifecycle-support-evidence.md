# Flutter/Dart and .NET 10 lifecycle-support evidence for Q-15

| Control field | Value |
|---|---|
| Stable Research ID | `IE-RES-TECH-CLIENT-LIFECYCLE-20260914-001` |
| Document class / version / status | `RESEARCH-EVIDENCE` / `0.1` / `Draft` |
| Product normativity | `INFORMATIVE`; this record creates no Product requirement, technology decision, qualification result or approval |
| Repository process authority / instruction state | `NOT-APPLICABLE` / `NOT-APPLICABLE` |
| Owner / author | Principal Product Author; named person attribution `BLOCKED` before `Proposed` |
| Reviewer / acceptance authority | Product Decision Authority; review and acceptance `NOT-RUN` |
| Applicable baseline | IDEA Engineering Q-15 Client/UI lifecycle-evidence subset at local repository `main` commit `c97ead832e026972a95f75a6c1933579fd49ac13`; no remote-baseline assertion |
| Evidence date / source access | `2026-09-14` (Asia/Saigon) |
| Classification / retention | `INTERNAL`; retain with the Q-15 technology evidence chain |
| Source / upstream trace | [`IE-STD-AUTH-001@0.2`](../agents/product-document-authoring-standard.md), [Client/UI evidence `IE-RES-TECH-CLIENT-20260914-001@0.3`](2026-09-14-flutter-client-ui-stack-evidence.md) and [technology matrix `IE-KNW-TECH-DEC-001@0.5`](../product/knowledge/2026-09-13-core-v0-technology-decision-matrix.md) |
| Downstream trace | [Q-15 qualification record](../product/instances/idea-engineering/registers/VEV-2026-09-14-q15-client-ui-architecture-qualification.md) and future Product Decision Authority review; no downstream decision or approval is created here |
| Change record / predecessor | Initial evidence record; predecessor `NOT-APPLICABLE`; created to isolate current Flutter/Dart servicing facts and the explicit .NET 10 LTS horizon; Product Scope impact `NONE` |
| Supersedes / Superseded by | `NOT-APPLICABLE` / `NOT-APPLICABLE` |
| Review trigger | A new Flutter stable release; a material Flutter or Dart support/security-policy change; a Microsoft change to the .NET 10 lifecycle; Q-15 execution; or Product Decision Authority review |
| Evidence status | First-party publication facts captured at the access date; product-specific lifecycle operations, update/rollback qualification and support entitlement `NOT-RUN` |

Control tailoring under `IE-STD-AUTH-001@0.2`: this research item uses claim-level source and
evidence fields, retains source silence as `UNKNOWN`, and separates direct publication facts from
IDEA inference. It does not change Feature, Spec, Tech, FTR, REQ, architecture, Product Scope or any
gate state.

## 1. Research question and boundary

This record answers only the lifecycle portion of Q-15:

1. What Flutter stable SDK release was current on the access date, and what release-channel,
   support and security-servicing model do the Flutter and Dart teams publish?
2. What support horizon does Microsoft publish for .NET 10 LTS?

It does not compare implementation quality, performance, accessibility, IPC correctness, update
success, staffing, commercial support entitlement or total cost. It does not select React/WPF,
Flutter or any other Client/UI option. Q-15 implementation and measurement remain `NOT-RUN`.

Evidence labels used below are:

| Label | Meaning |
|---|---|
| `DIRECT-FIRST-PARTY-FACT` | An official vendor/project source directly publishes the stated release or policy fact. |
| `IDEA-INFERENCE` | A bounded operational implication for Q-15, not a vendor promise or Product decision. |
| `SOURCE-GAP` | The reviewed first-party source set does not publish the claimed contract; the answer remains `UNKNOWN` rather than being treated as absent in all possible channels. |

## 2. Source register

| Source ID | Publisher / authority | Source | Publication or version context | Accessed | Evidence use and limitation |
|---|---|---|---|---|---|
| `FL-SRC-01` | Flutter team | [Flutter SDK archive](https://docs.flutter.dev/install/archive) | Live archive page; 2026 public release windows; page footer reflects Flutter `3.47.2` | 2026-09-14 | Channel purpose and release-window facts. The rendered release table is dynamic, so the machine-readable manifest below controls the current Windows release fact. |
| `FL-SRC-02` | Flutter release infrastructure / Google-hosted official distribution | [Windows release manifest](https://storage.googleapis.com/flutter_infra_release/releases/releases_windows.json) | Dynamic JSON snapshot at access; `current_release.stable = 9584c6713b324636289d067944a46fd6b49df14b` | 2026-09-14 | Current Windows stable version, bundled Dart version, release timestamp, archive and digest. This is a time-sensitive snapshot, not a future support promise. |
| `FL-SRC-03` | Flutter team, official `flutter/flutter` repository | [Verified `3.47.4` release tag](https://github.com/flutter/flutter/releases/tag/3.47.4) | Tag `3.47.4` identifies commit `9584c6713b324636289d067944a46fd6b49df14b` | 2026-09-14 | Independent first-party confirmation that the manifest commit is tagged `3.47.4`; the tag is not a support-duration promise. |
| `FL-SRC-04` | Flutter team, official `flutter/flutter` repository | [Build-release channels at stable commit `9584c671...`](https://github.com/flutter/flutter/blob/9584c6713b324636289d067944a46fd6b49df14b/docs/releases/Flutter-build-release-channels.md) | File pinned to the commit identified by `FL-SRC-02` as current stable | 2026-09-14 | Stable-channel purpose, promotion model and possible hotfix conditions. It does not publish a fixed support duration. |
| `FL-SRC-05` | Flutter team, official `flutter/flutter` repository | [Flutter changelog at stable commit `9584c671...`](https://github.com/flutter/flutter/blob/9584c6713b324636289d067944a46fd6b49df14b/CHANGELOG.md) | File pinned to the current stable commit; general servicing statement at the beginning of the file | 2026-09-14 | Quarterly feature-update philosophy and latest-version-only hotfix statement. Its version entries stop at `3.47.3` while the manifest and tag identify `3.47.4`, so it is not used to identify the current release. |
| `FL-SRC-06` | Flutter team | [Flutter security](https://docs.flutter.dev/security) | Page last updated `2026-07-31`; footer reflects Flutter `3.47.2` | 2026-09-14 | Published security commitment and notification paths. It gives a five-working-day response target for submitted reports, but no fixed remediation/release deadline, backport window or end-of-support date. |
| `DART-SRC-01` | Dart team | [Dart SDK overview and support policy](https://dart.dev/tools/sdk#support-policy) | Documentation assumes Dart `3.13.3`; page last updated `2026-02-04` | 2026-09-14 | Latest-stable support rule, critical/security patch rule and approximate stable cadence for the Dart SDK bundled by Flutter. |
| `MS-SRC-01` | Microsoft .NET product team | [.NET and .NET Core support policy](https://dotnet.microsoft.com/en-us/platform/support/policy/dotnet-core) | Page last updated `2026-09-08`; supported-version table current through `.NET 10.0.12` | 2026-09-14 | Authoritative release type, phase, patch level, support eligibility and exact end-of-support date for .NET 10. |
| `MS-SRC-02` | Microsoft Learn / .NET product documentation | [.NET releases, patches and support](https://learn.microsoft.com/en-us/dotnet/core/releases-and-support) | Page last updated `2026-05-15` | 2026-09-14 | Lifecycle-phase and servicing behavior. `MS-SRC-01` controls the later exact patch and end-date snapshot. |

All external sources above are first-party. No survey, analyst report, community answer or
competitor observation is used.

## 3. Flutter and Dart direct evidence

| Claim ID | Evidence class | Directly documented fact | Source | Temporal applicability | Limitation / inference boundary |
|---|---|---|---|---|---|
| `FL-LC-001` | `DIRECT-FIRST-PARTY-FACT` | The official Windows release manifest identifies Flutter `3.47.4` as the current `stable` release, commit `9584c6713b324636289d067944a46fd6b49df14b`, bundled with Dart `3.13.3`, released `2026-09-11T20:50:31.974077Z`; the official `3.47.4` tag identifies the same commit. | `FL-SRC-02`, `FL-SRC-03` | Point-in-time fact on 2026-09-14 | The manifest can change immediately when a new stable or hotfix release is published. It is not an LTS or longevity statement. |
| `FL-LC-002` | `DIRECT-FIRST-PARTY-FACT` | Flutter designates `stable` as the production release channel. Roughly every third beta is promoted to stable, and the 2026 public release windows target feature releases in February, May, August and November. | `FL-SRC-01`, `FL-SRC-04` | Current published channel model and 2026 schedule | A target window and a general cadence are not guaranteed release dates or a support SLA. |
| `FL-LC-003` | `DIRECT-FIRST-PARTY-FACT` | The Flutter channel policy allows a stable hotfix for high-severity, high-impact or security issues. The Flutter security page commits to security updates for the Flutter version currently on the stable branch. | `FL-SRC-04`, `FL-SRC-06` | Current policy snapshot | The sources do not promise that every defect is backported, give a fixed hotfix interval, or define a response-time SLA for release of a fix. |
| `FL-LC-004` | `DIRECT-FIRST-PARTY-FACT` | Flutter's changelog describes quarterly stable feature updates as a general philosophy and says hotfixes are applied only to the latest stable version; users on older stable versions are directed toward the latest stable channel. | `FL-SRC-05` | Policy text pinned to the current stable commit | “Latest version” is a moving target. The statement does not define support for a frozen older stable line. |
| `FL-LC-005` | `SOURCE-GAP` | The reviewed official Flutter archive, channel, changelog and security sources do not publish a separate Flutter LTS channel, a fixed multi-year servicing duration, or an end-of-support date for Flutter `3.47.x`. | `FL-SRC-01` through `FL-SRC-06` | Source-set finding as of 2026-09-14 | This is not an assertion that no commercial arrangement or future policy can exist. Public fixed-term Flutter support remains `UNKNOWN` in this evidence set. |
| `FL-LC-006` | `DIRECT-FIRST-PARTY-FACT` + `IDEA-INFERENCE` | Some Flutter documentation footers still identify `3.47.2`, and the pinned changelog entries stop at `3.47.3`, while the official release manifest and tag identify `3.47.4` as current stable. | `FL-SRC-01` through `FL-SRC-06` | 2026-09-14 snapshot | The bounded inference is that a generic documentation footer does not uniquely identify the release pin; the release manifest/tag and retained digest can identify the tested SDK. No Product requirement is created here. |
| `DART-LC-001` | `DIRECT-FIRST-PARTY-FACT` | Flutter `3.47.4` bundles Dart `3.13.3`. The Dart team supports only the latest stable Dart SDK; an older major/minor line ceases to be supported when the next major/minor stable ships. Critical and security fixes are provided as needed only for the currently supported line. | `FL-SRC-02`, `DART-SRC-01` | Flutter `3.47.4` bundle and current Dart support policy | Dart's policy does not supply a fixed multi-year horizon for the bundled SDK. Package and plugin lifecycles are outside this statement. |
| `DART-LC-002` | `DIRECT-FIRST-PARTY-FACT` | Dart publishes stable releases on an approximate three-month cadence and patch releases for the current supported version as needed. | `DART-SRC-01` | Current policy snapshot | “On average” is not a guaranteed schedule. |

### 3.1 Evidence-bounded Flutter lifecycle shape

The evidence supports the descriptive label **rolling-current stable servicing** for the public
Flutter/Dart toolchain:

```text
current Flutter stable
  includes one Dart SDK version
  receives possible Flutter hotfixes and current-stable security servicing
  is replaced as the supported target by later stable releases
```

That label is an `IDEA-INFERENCE` summarizing the cited policies. It is not an official Flutter
product name and it does not mean that an upgrade is safe for IDEA before qualification.

## 4. .NET 10 LTS direct evidence

| Claim ID | Evidence class | Directly documented fact | Source | Temporal applicability | Limitation / inference boundary |
|---|---|---|---|---|---|
| `NET-LC-001` | `DIRECT-FIRST-PARTY-FACT` | Microsoft lists .NET 10 as an active LTS release, originally released `2025-11-11`, with end of support on `2028-11-14`. | `MS-SRC-01` | Policy table updated 2026-09-08 and accessed 2026-09-14 | The date applies to the covered .NET release under Microsoft's policy, not automatically to every external package, operating system, installer or adjacent runtime. |
| `NET-LC-002` | `DIRECT-FIRST-PARTY-FACT` | At the policy snapshot, the latest .NET 10 patch is `10.0.12`, released `2026-09-08`. Microsoft conditions support on remaining current with released patch updates. | `MS-SRC-01` | 2026-09-14 snapshot | `10.0.12` will cease to be the current patch when Microsoft publishes a successor. LTS does not mean an application can remain indefinitely on its first patch. |
| `NET-LC-003` | `DIRECT-FIRST-PARTY-FACT` | Microsoft describes .NET LTS as three years of support. Updates are cumulative; the detailed policy describes active support as targeted functional and security servicing, and the final six months as maintenance support limited to security mitigation. | `MS-SRC-01`, `MS-SRC-02` | Current policy model | The exact lifecycle table, rather than a derived calendar calculation, controls phase and end date. |
| `NET-LC-004` | `DIRECT-FIRST-PARTY-FACT` | Microsoft defines end of support as the point after which it no longer provides fixes, updates or online technical assistance for that version. | `MS-SRC-01`, `MS-SRC-02` | Applies at the recorded end date unless Microsoft changes the policy | This does not measure IDEA's migration effort before 2028-11-14. |

The explicit .NET 10 LTS support horizon for this evidence snapshot is therefore:

```text
General availability: 2025-11-11
Support phase:          Active at the 2026-09-08 policy snapshot
Current patch:          10.0.12 (released 2026-09-08)
End of support:         2028-11-14
Support condition:      remain current on released patches
```

## 5. Cross-source interpretation for Q-15

| Claim ID | Evidence class | Interpretation | Evidence basis | Decision boundary |
|---|---|---|---|---|
| `Q15-LC-001` | `IDEA-INFERENCE` | The public Flutter/Dart lifecycle and the .NET 10 lifecycle expose different contract shapes: Flutter/Dart identifies only a moving latest-stable support target, while .NET 10 publishes a fixed LTS end date. | `FL-LC-003` through `DART-LC-002`; `NET-LC-001` through `NET-LC-004` | Different contract shapes do not establish which option has lower total lifecycle risk. |
| `Q15-LC-002` | `IDEA-INFERENCE` | Both candidates require continuing servicing work. Flutter/Dart requires tracking and qualifying successive stable lines to remain within the published support target. .NET 10 requires current patch adoption and a migration before `2028-11-14`. | `FL-LC-004`, `FL-LC-005`, `DART-LC-001`, `NET-LC-002`, `NET-LC-004` | No effort, outage, compatibility or cost comparison has been measured. |
| `Q15-LC-003` | `IDEA-INFERENCE` | A Q-15 lifecycle record can distinguish release discovery, patch intake, compatibility qualification, signed deployment, rollback and end-of-support migration instead of treating “stable” or “LTS” as a complete operational result. | All claims above | The actual procedures and acceptance thresholds require separate authority and execution; they are not created by this research artifact. |

No winner or recommendation follows from these claims. A fixed .NET horizon is more explicit, but
it also creates a known migration deadline. Flutter's rolling current-stable model has no public
multi-year date in the reviewed sources, but this fact alone does not prove unacceptable risk or
greater maintenance effort. Those outcomes depend on the unrun IDEA qualification and the support
arrangements actually available to the company.

## 6. Limitations and controlled unknowns

| Unknown ID | State | Missing evidence | Why it remains open |
|---|---|---|---|
| `UNK-LC-001` | `UNKNOWN` | A public fixed-term Flutter `3.47.x` maintenance or end-of-support date | No such date appears in the reviewed first-party Flutter sources. |
| `UNK-LC-002` | `UNKNOWN` | Contractual enterprise Flutter/Dart support, response time or backport entitlement available to IDEA Engineering | Public project policy is not a company support contract. No vendor quotation or entitlement was supplied. |
| `UNK-LC-003` | `UNKNOWN` | Lifecycle and security ownership for every Flutter package, plugin, native library and Windows installer/updater dependency | Framework support does not automatically cover independent dependencies. No candidate lockfile or SBOM was tested. |
| `UNK-LC-004` | `UNKNOWN` | Actual compatibility effort when moving an IDEA Flutter build between stable releases | No Q-15 implementation or upgrade drill was run. |
| `UNK-LC-005` | `UNKNOWN` | Actual .NET 10 patch and pre-EOS migration effort for the IDEA Workspace or shell | A published horizon does not measure application migration, deployment or rollback. Q-15 remains `NOT-RUN`. |
| `UNK-LC-006` | `UNKNOWN` | Support interaction among .NET 10, WPF, WebView2, Windows, third-party NuGet packages and the chosen deployment model | The .NET policy does not replace the separate lifecycle evidence for every adjacent component. |
| `UNK-LC-007` | `UNKNOWN` | Relative operational cost and total lifecycle risk of the Q-15 control and challenger | No common fixture, staff model, patch drill, upgrade, rollback or incident scenario has been executed. |

The source review did not inspect paid support contracts, private roadmaps or non-public security
reports. It did not test downloaded SDK artifacts, build a Client, install an update or validate a
rollback. Silence in the source set is retained as `UNKNOWN`; it is not converted into a claim that
a capability or commercial offer does not exist.

## 7. Evidence disposition

| Item | Disposition | Evidence |
|---|---|---|
| First-party publication review | `COMPLETE` | Six official Flutter sources, one official Dart source and two Microsoft sources are registered above. |
| Current Flutter stable identification | `COMPLETE — POINT-IN-TIME` | `FL-SRC-02` identifies Flutter `3.47.4` / Dart `3.13.3` at access. |
| .NET 10 LTS horizon identification | `COMPLETE — POINT-IN-TIME` | `MS-SRC-01` lists end of support `2028-11-14`. |
| Q-15 implementation, update and rollback adjudication within this research record | `NOT-RUN` | This source-review artifact does not adjudicate prototype or operational evidence; the separate Q-15 qualification record controls that state. |
| Product Decision Authority review / acceptance | `NOT-RUN` | No independent review or acceptance evidence was supplied. |
| Repository and documentation validators | `NOT-RUN` | Explicit task instruction prohibited validator execution. |

Final evidence statement: Flutter `3.47.4` with Dart `3.13.3` is the current stable Windows SDK
identified by the official release manifest on `2026-09-14`; public Flutter security servicing is
committed to the current stable version, and Dart explicitly supports only its latest stable line.
The reviewed sources publish no fixed multi-year Flutter `3.47.x` horizon. Microsoft explicitly
lists .NET 10 as active LTS through `2028-11-14`, conditional on current patches. This is lifecycle
evidence only: **winner `NOT-APPLICABLE`; recommendation `NOT-APPLICABLE`; Q-15 outcome not assigned by this research record.**
