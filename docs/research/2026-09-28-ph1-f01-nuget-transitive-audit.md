# PH1 F01 NuGet Transitive Intake Audit

| Control field | Value |
|---|---|
| Stable Research ID | `IE-RES-PH1-F01-NUGET-001` |
| Document class / title | `RESEARCH-NOTE` / PH1 F01 NuGet Transitive Intake Audit |
| Version / status | `0.3` / `Draft` |
| Product normativity | `INFORMATIVE`; this records evidence and a recommendation, not a product or legal decision |
| Repository process authority / instruction state | `NOT-APPLICABLE` / `NOT-APPLICABLE` |
| Owner / author | Engineering / Codex research agent |
| Reviewer / acceptance authority | Project Reviewer accepted the one-time internal F01-A order-of-work exception on 2026-09-28; Product Decision Authority product acceptance `NOT-RUN` |
| Evidence date | 2026-09-29 (Asia/Ho_Chi_Minh) |
| Applicable baseline | F01-A package/legal audit source commit `c600f7be41f0732cb57d521017bae0565ab229bd`; F01-B lockfiles generated from `9707aab6184848bd01fa5c261a06f54c3f4d757c` and committed in `6c8b6b35c33e96a83001cdbd3f122647c0e5ca85`; final T013 verification commit `b5c4701cf5a1cd37ae8295ed4af1621a6b522d03`; internal build/test use only |
| Intended use | `DEPENDENCY`: WPF WebView2 SDK and development/test packages; no customer packaging, runtime redistribution, or commercial release qualified |
| Upstream trace | [F01 dependency intake](2026-09-28-ph1-f01-dependency-intake.md), [external-source intake](../agents/external-source-intake.md), [PH1 spec FR-012](../../specs/005-ph1-foundation-custody/spec.md), F01-A/T002 |
| Downstream trace | F01-A Project Reviewer disposition; F01-B/T013; PH1/T036 and later dependency inventory/SBOM |
| Change / Work Item trace | GitHub Issues #12 and #17; F01-A/T002 and F01-B/T013; reviewer decision on 2026-09-28 recorded in §4; T002 status is owned by `tasks.md` |
| Classification / retention | `INTERNAL`; retain while these exact versions are in use and with later dependency inventory/SBOM |
| Evidence status | Four F01-B NuGet lockfiles now pin the clean-source graph; their 13 external package IDs match the 2026-09-28 audit, with no dependency/version change. The earlier four assets snapshots and 14 local package archives remain the exact license evidence. NuGet's signed-content versus full-archive hash distinction and historical provenance limit are retained below. One-time internal-use exception `ACCEPTED` by the Project Reviewer; commercial distribution `BLOCKED-LEGAL`. |
| Standards tailoring | `STD-INFO-001` (ISO/IEC/IEEE 15289:2019, `STANDARD-GUIDED`) is used for identity, status, source and trace fields; no standards-conformity claim. This research note has no effective product date or accepted requirement. |
| Supersession / review trigger | Supersedes this note's `0.2` revision; no successor identified. Re-review on package/version/source, resolved graph, license/notice, project configuration, deployment bundle or intended-use change. The exception cannot be reused for a new import. |

## 1. Scope and reproducibility limit

The [F01-A build record](../../specs/005-ph1-foundation-custody/evidence/F01-A-build-results.md) says Desktop and Workspace restore, test and build passed from clean Windows archives of source commit `c600f7be41f0732cb57d521017bae0565ab229bd`. At audit time the worktree was at `2b1afb0e9730617f05e6f89e12676aa27c9094bc`; `git diff c600f7b HEAD -- apps/desktop apps/workspace` returned no changes. Thus the four project definitions inspected here match the tested source, but the ignored `obj/project.assets.json` files were generated in this worktree and were **not retained from the clean tested archives**. This is an exact audit of the currently resolved Windows graph for those unchanged definitions, not proof that every archive byte used by the historical F01-A restore was identical.

The four assets snapshots, all dated 2026-09-28 local time, have these SHA-256 hashes:

| Project assets snapshot | SHA-256 | Resolved external packages |
|---|---|---:|
| `apps/desktop/obj/project.assets.json` | `95880136A6E7438B2F65022FC23B4E00FCC68C0D59F6E8E1AE18696C184ADF8D` | 1 |
| `apps/desktop/tests/obj/project.assets.json` | `85605A544714331591586ED7767493059F234A3C0FCB2B7E2DCF87D3FB7F1D0B` | 13 |
| `apps/workspace/obj/project.assets.json` | `EB3557CBBE8390A4DAAB5341A37CA5B82E6C30CF4D86A637C3A8F748C19820F2` | 0 |
| `apps/workspace/tests/obj/project.assets.json` | `3EF0758668F4AF95891B17420D39A86878A84A3252C82FAD0CDB79A08CE35811` | 12 |

The Desktop test graph contains the Workspace test graph's 12 external IDs plus WebView2. `MSTest.Sdk/4.4.1` is referenced as the two test projects' **MSBuild project SDK**, so it does not appear among `project.assets.json` libraries; including it gives **14 distinct NuGet package IDs** in the F01 Desktop/Workspace source and build/test graph. Project references and .NET framework/targeting packs are not counted as NuGet packages here. The SDK and all packages other than WebView2 are test/build scoped in this F01 graph; presence of the telemetry extension does not establish application telemetry behavior.

For each of the 13 assets packages, `project.assets.json` `sha512` agrees with its local `.nupkg.metadata` `contentHash`. A fresh SHA-512 of the cached `.nupkg` bytes instead agrees with the adjacent `.nupkg.sha512` and differs from those assets/metadata values for all 13. All 13 archives contain `.signature.p7s`. [NuGet's signed-package metadata definition](https://github.com/NuGet/Home/wiki/Nupkg-Metadata-File) says `ContentHash` excludes signature metadata, whereas `.nupkg.sha512` hashes the entire signed archive; the [NuGet.Client package reader at commit `6844270`](https://github.com/NuGet/NuGet.Client/blob/684427012e25096073d04a7643a9d43dc1f2091d/src/NuGet.Core/NuGet.Packaging/PackageArchiveReader.cs) implements these separate hash paths. The observed difference is therefore expected for signed packages, not by itself a provenance failure. We did not independently recalculate the signature-excluded content hash or cryptographically verify the signatures; signature-file presence alone is not signature validation. The table identifies the **local archive inspected**, using its independently computed SHA-256, without asserting byte identity with the historical clean restore. No restore or package download was run for this exact 2026-09-28 archive-history audit; the later F01-B locked restores and clean-source builds are separate evidence recorded below.

### F01-B locked restore evidence (2026-09-29)

The four .NET projects now generate and enforce committed NuGet lockfiles with
`RestorePackagesWithLockFile=true` and `RestoreLockedMode=true`. F01-B generated them from a clean
source export of `9707aab6184848bd01fa5c261a06f54c3f4d757c`; the lockfile SHA-256 values from that
export exactly match those generated in the implementation worktree. The four files were committed
in `6c8b6b35c33e96a83001cdbd3f122647c0e5ca85` and remain unchanged in the final T013 verification
source `b5c4701cf5a1cd37ae8295ed4af1621a6b522d03`. Explicit `dotnet restore
--locked-mode` succeeded for all four projects. The external package IDs and versions match the
existing 2026-09-28 audit; no package, version, license or product technology selection changed.

| Project | Lockfile | SHA-256 | External package entries |
|---|---|---|---:|
| Desktop | [`apps/desktop/packages.lock.json`](../../apps/desktop/packages.lock.json) | `5386CC9B0B11E8D2C2A4BC5402ABE1598BD1E9167E69EFD71DB0A0C5150EB01E` | 1 |
| Desktop tests | [`apps/desktop/tests/packages.lock.json`](../../apps/desktop/tests/packages.lock.json) | `68B9F5A6CD4A1ECD8817BAC15F4E6923FA58393FCDF0AF0670D945AF885984A2` | 13 |
| Workspace | [`apps/workspace/packages.lock.json`](../../apps/workspace/packages.lock.json) | `531D4CF71E5420C1C03DA4C06778BA2A212C7058A3882E7A3A873AE2F811511E` | 0 |
| Workspace tests | [`apps/workspace/tests/packages.lock.json`](../../apps/workspace/tests/packages.lock.json) | `6260CA6026B00B248878A7ACFEFB09C425296547883B2207F9F3D79A38273A69` | 12 |

Lockfiles also contain the corresponding project-reference entry where applicable; those entries
are not NuGet packages. The two test lock graphs together retain the same 13 external package IDs
recorded in §2. `MSTest.Sdk/4.4.1` remains pinned by the exact MSBuild project-SDK reference and
does not appear as a `PackageReference` lock entry. This update makes package resolution repeatable;
it does not extend the one-time T002 exception, complete the T036 bundle/license review, or authorize
customer distribution.

## 2. Exact package and rights evidence

All 14 inspected archives are under the existing Windows global NuGet cache (`C:\Users\TD-999\.nuget\packages\<lowercase-id>\<version>\`). The license column combines each exact archive's `.nuspec` license declaration with the publisher's pinned license text where cited below. `No legal file` means a filename scan of that archive found no separate LICENSE/NOTICE/COPYING/third-party-notice file; it does **not** assert there are no bundled components or obligations. Package SHA-256 values identify the archives actually opened in this review.

| Exact package (publisher package page) | Reach | Exact `.nuspec` license; embedded legal evidence | Local `.nupkg` SHA-256 |
|---|---|---|---|
| [Microsoft.Web.WebView2 1.0.4191.47](https://www.nuget.org/packages/Microsoft.Web.WebView2/1.0.4191.47) | Desktop SDK and Desktop tests | License **file** `LICENSE.txt`: BSD-style three-condition permission, copyright/conditions/disclaimer retention and no endorsement. `NOTICE.txt` present; see §3. No repository commit in nuspec. | `F492BBF547D0DA329553B6727435B677579B1E9F91CC9E4A1AD029366D5F23D0` |
| [MSTest.Sdk 4.4.1](https://www.nuget.org/packages/MSTest.Sdk/4.4.1) | Test project SDK, outside assets libraries | MIT expression; no legal file. Pinned testfx repository commit `9a14d19cb8ef1ec6a2aae81d4223a09190f96593`. | `F35CFFDB88FB38F1E271A972D0B48177053F7B153D633EB2EBBD5E977CE35187` |
| [MSTest.TestAdapter 4.4.1](https://www.nuget.org/packages/MSTest.TestAdapter/4.4.1) | Tests | MIT expression; no legal file; pinned testfx commit. | `50F3B6563D4482ED47D82DB3C7DD45CA9BF13783D563F3640FFFED55FE1421E8` |
| [MSTest.TestFramework 4.4.1](https://www.nuget.org/packages/MSTest.TestFramework/4.4.1) | Tests | MIT expression; no legal file; pinned testfx commit. | `7F90ADE7003EAB8E7806AE4A9C76E12E2C1623E287940C8197B2BAF6FE2EA275` |
| [MSTest.Analyzers 4.4.1](https://www.nuget.org/packages/MSTest.Analyzers/4.4.1) | Tests, via TestFramework | MIT expression; no legal file; pinned testfx commit. | `2CDFDFECDA53513D7C58D76656D02D354D2AB8A0CE34AE8D486587987CB950CE` |
| [Microsoft.Testing.Platform 2.4.1](https://www.nuget.org/packages/Microsoft.Testing.Platform/2.4.1) | Tests | MIT expression; no legal file; pinned testfx commit. | `9D7305CD67E8AF7137685897387B670F6ABAE62DABF44A1F5ABB67CBAA64F2A8` |
| [Microsoft.Testing.Platform.MSBuild 2.4.1](https://www.nuget.org/packages/Microsoft.Testing.Platform.MSBuild/2.4.1) | Tests | MIT expression; no legal file; pinned testfx commit. | `67E59AAF25CF21ECB45E6FBD617391CFCD91AB35AEC4F38B3C34D0E506BB4616` |
| [Microsoft.Testing.Extensions.Telemetry 2.4.1](https://www.nuget.org/packages/Microsoft.Testing.Extensions.Telemetry/2.4.1) | Tests | MIT expression; no legal file; pinned testfx commit. | `593C1CCE612AA264923C18B0A906E77E99703C85E235FD2AD372ABDFE0CF85B7` |
| [Microsoft.Testing.Extensions.TrxReport.Abstractions 2.4.1](https://www.nuget.org/packages/Microsoft.Testing.Extensions.TrxReport.Abstractions/2.4.1) | Tests | MIT expression; no legal file; pinned testfx commit. | `98B8A2EB2C1D83601288E97B1B05AB4F0A92B034C2F1E86C4AD9C40B01A45766` |
| [Microsoft.NET.Test.Sdk 18.9.0](https://www.nuget.org/packages/Microsoft.NET.Test.Sdk/18.9.0) | Tests | MIT expression; no legal file. Pinned vstest repository commit `2b12a89cee3798c4ab3fd301e384d1bd5532f9de`. | `3C19312754A299160BAFCB192104C57719849F05589B3AE5FED2E21DBCF4F5B0` |
| [Microsoft.TestPlatform.ObjectModel 18.9.0](https://www.nuget.org/packages/Microsoft.TestPlatform.ObjectModel/18.9.0) | Tests | MIT expression; no legal file; pinned vstest commit. | `FD124E525502283802D2A67D00B7379D39BB9C66BA84592DCF19B73900EC708A` |
| [Microsoft.TestPlatform.TestHost 18.9.0](https://www.nuget.org/packages/Microsoft.TestPlatform.TestHost/18.9.0) | Tests | MIT expression; `ThirdPartyNotices.txt` present; pinned vstest commit. | `452242A8C198A1A4F45E54A28FA3C4CA3A80B9249BBCDF2C02FD9B818C02D1EE` |
| [Microsoft.CodeCoverage 18.9.0](https://www.nuget.org/packages/Microsoft.CodeCoverage/18.9.0) | Tests | MIT expression; root and `build/netstandard2.0` copies of `ThirdPartyNotices.txt` present; pinned vstest commit. | `7EE6DAC4627C176D819DB2467F1F41EC355970A3EA1E8A6B8BA783EA072FC33D` |
| [Microsoft.ApplicationInsights 2.23.0](https://www.nuget.org/packages/Microsoft.ApplicationInsights/2.23.0) | Tests, via telemetry extension | MIT expression; no legal file. Pinned ApplicationInsights-dotnet repository commit `2faa7e8b157a431daa2e71785d68abd5fa817b53`. | `E6C7F76E0EC26598C7B1E2BE1777E839C84486655E8A878FC4C655BD2E918DBD` |

The exact publisher license sources corresponding to the nuspec repository commits are [testfx MIT LICENSE](https://github.com/microsoft/testfx/blob/9a14d19cb8ef1ec6a2aae81d4223a09190f96593/LICENSE), [vstest MIT LICENSE](https://github.com/microsoft/vstest/blob/2b12a89cee3798c4ab3fd301e384d1bd5532f9de/LICENSE), and [ApplicationInsights-dotnet MIT LICENSE](https://github.com/microsoft/ApplicationInsights-dotnet/blob/2faa7e8b157a431daa2e71785d68abd5fa817b53/LICENSE). These pinned sources grant use with retention of the copyright and permission notice when copies or substantial portions are distributed. Package metadata alone was not treated as a substitute for these source license texts. The exact WebView2 license and notice were read from the package archive above (local extracted-file SHA-256: `LICENSE.txt` `0AF8F1B807512AAE39C2AC1AA4D0CAE65CABECB6FD554B8439A5162A0D6ECA55`; `NOTICE.txt` `106423785C5B7EBA0A8E61D1837F2132E9C828E20AD530F565D981C1DF60DD90`).

## 3. Embedded notice obligations and limits

- WebView2 `NOTICE.txt` lists Antlr3.Runtime `3.5.2-rc1` and StringTemplate4 `4.0.9-rc1`, both with BSD 3-Clause notices and copyright/conditions/disclaimer retention. It also has a general LGPL reverse-engineering allowance paragraph. That paragraph **does not identify an LGPL package in the resolved NuGet graph or prove one is shipped**. Its applicability to a future redistributable bundle is `UNKNOWN`; retain the exact notice and obtain packaging/legal review if the SDK files or loader are shipped. WebView2's package is distinct from the Evergreen WebView2 Runtime, whose exact runtime/installer/EULA are outside this audit.
- CodeCoverage `ThirdPartyNotices.txt` identifies Mono.Cecil `0.11.3` under MIT. TestHost `ThirdPartyNotices.txt` identifies Newtonsoft.Json `13.0.3` and Mono.Cecil `0.11.3` under MIT, and NuGet.Client `6.8.0.117` under Apache-2.0. These are **bundled-component notices**, not separate IDs in the NuGet assets graph. Retain the files with any redistribution of those test packages; no test package is selected as a customer runtime here.
- Eleven MIT-declared packages have no separate legal file matched in their archives. Their repository-pinned MIT text is available at the publisher links above. A filename scan is not a per-binary embedded-component audit, and no commercial bundle inventory was performed. Any shipped copy would need the applicable copyright/permission notice and an exact bundle check.

## 4. Interpretation, deviation and reviewer disposition

**Internal F01-A build/test disposition: `APPROVED-WITH-OBLIGATIONS` under the one-time Project Reviewer exception below.** The observed exact versions have a publisher-pinned MIT license or WebView2's exact BSD-style package license, with the notice retention above. Keep these versions/source identities stable, retain notice evidence with any copied package files, and reopen intake on change. This disposition applies to the inspected internal build/test graph only; it is not a legal clearance for distribution. Customer/runtime redistribution and any unresolved WebView2 notice applicability remain `BLOCKED-LEGAL` until the exact shipped bundle and terms are reviewed by the Legal Review Authority. F01-B/T013 records the clean-source and lockfile evidence; T036 still owns full integration/bundle review.

**Order-of-work deviation:** Windows NuGet restore and F01-A smoke/build checks already ran before exact transitive license/notice evidence was recorded. The later audit cannot make the FR-012/T002 *before-first-use* condition retrospectively true. The Project Reviewer has accepted this as a documented, one-time exception for the past internal build/test use; the exception does not change FR-012 for any future import. T002 may close with this explicit exception, while F01-A completion remains a separate card decision.

| Exception control | Recorded disposition |
|---|---|
| Decision and source | `ACCEPTED` on 2026-09-28 by the Project Reviewer (project user), who stated in this Codex conversation: “Duyệt ngoại lệ T002 cho build/test nội bộ F01-A.” This is a process exception, not Product Decision Authority approval of a release. |
| Exact scope | Past F01-A Windows NuGet restore and scaffold build/test for source commit `c600f7be41f0732cb57d521017bae0565ab229bd`, using the currently audited 14-package graph for unchanged Desktop/Workspace project definitions. Internal development/test only. |
| Rationale | The exact current package graph, publisher license texts and package notices are now retained; the inspected terms support the bounded internal use with notice obligations. The Project Reviewer accepts late evidence without asserting the original timing requirement was met. |
| Residual risk | The ignored assets files and package archives from the historical clean restore were not retained, so their byte-for-byte identity with today's audited cache is unproven. Signatures were not independently verified. Future distribution contents and runtime/installer terms are unreviewed. |
| Owner and approver | Engineering owns version/notice control and the follow-up; the Project Reviewer approved this one-time exception. Legal Review Authority remains the required authority for any unresolved external distribution terms. |
| Expiry and boundary | The exception covers only the historical F01-A use above; its operative scope ends at F01-A card review, while this decision remains in the record. It cannot authorize a new package, version, restore graph, project configuration or commercial deployment; those require intake before first use. |
| Remediation and escalation | Retain this audit; T013 records clean-source/lockfile evidence and T036 reviews the exact integration or distribution bundle. Preserve applicable notices. Escalate any changed or unclear license, WebView2 redistribution or runtime EULA to the Legal Review Authority before external use. |

## 5. Checks and change log

| Check | Outcome | Limit |
|---|---|
| Current source project definitions compared with tested commit | `PASS`: no Desktop/Workspace changes | Does not authenticate ignored historical `obj` files |
| Four current assets files parsed and hashed | `PASS`: package counts and IDs above | Files were not preserved from the tested clean archive |
| 14 cached package `.nuspec` and `.nupkg` files inspected and SHA-256 hashed | `PASS` for local files | No new download or restore; signed-content and full-archive hashes are distinct as explained in §1 |
| F01-B NuGet lockfiles and locked restore | `PASS`: all four project locks match the audited external IDs/versions; explicit `--locked-mode` restore succeeds | No package/license decision changed; SDK patch and commercial bundle remain outside this audit |
| Three pinned upstream MIT license files and exact WebView2 package license/notice reviewed | `PASS` for stated files | No exhaustive per-binary or future bundle review |
| Project Reviewer exception and commercial release approval | One-time internal F01-A exception `ACCEPTED` / commercial distribution `BLOCKED-LEGAL` | Neither changes the original before-first-use evidence or grants a commercial release |

| Version | Date | Change |
|---|---|---|
| 0.1 | 2026-09-28 | Record current F01 Windows NuGet graph, exact local package hashes, publisher license and embedded notice evidence, NuGet signed-package hash semantics, provenance limits, internal-use recommendation and reviewer question. |
| 0.2 | 2026-09-28 | Record the Project Reviewer's one-time T002 exception, its exact scope, rationale, risk, owner, expiry, follow-up and separation from commercial clearance. |
| 0.3 | 2026-09-29 | Add four clean-source NuGet lockfiles and locked-mode restore evidence; confirm the exact external package graph remains the one audited in 0.2. |
