# IDEA Technology Stack: Primary-Source Evidence

Date and retrieval snapshot: 2026-09-03

Status: research evidence and qualification input; no stack approval or production implementation.

## Scope and evidence boundary

The supplied planning context is an internal engineering PDM application for **50–100 total intended users at one site**, not 50–100 simultaneous users. Engineering PCs run Windows; a new company-controlled server is proposed. IDEA-native accounts come first, with other/company login later. The user administers accounts and may initially operate the server; server experience is known, dedicated DevOps capacity is not.

The accepted architectural boundaries remain a modular-monolith server, Windows Desktop plus a protected per-user Workspace process, generic immutable Artifact storage, and isolated external format workers. Nothing here introduces an IDEA add-in inside CAD/Office. Preliminary recovery objectives—four working hours and at most a one-hour recovery-point gap—are not validated SLAs.

“Verified” below means an official publisher documents the capability or condition. “Implication” is analysis for IDEA; “open” requires company decision or qualification. No installed package inventory, company licenses, operational performance, or recovery result was verified.

## Compact claim/source register

Publisher dates are included where exposed; otherwise the retrieval date above applies.

| Subject | Verified statement and source |
|---|---|
| .NET / ASP.NET Core | The [support policy](https://dotnet.microsoft.com/en-us/platform/support/policy/dotnet-core), updated 2026-08-11, covers runtime, SDK, ASP.NET Core and EF Core. .NET 10 LTS: released 2025-11-11, listed end of support 2028-11-14. .NET 8 LTS: end of support 2026-11-10. |
| PostgreSQL 18 | The [versioning policy](https://www.postgresql.org/support/versioning/) lists first release 2025-09-25, final release 2030-11-14 and current minor 18.6; the linked release notice is dated 2026-08-13. Major versions receive five years of community support. |
| EF/Npgsql compatibility | [Npgsql EF provider 10.0.3 metadata](https://www.nuget.org/packages/Npgsql.EntityFrameworkCore.PostgreSQL/10.0.3), updated 2026-07-10, targets `net10.0`, requires EF Core/Relational `>=10.0.4,<11.0.0` and Npgsql `>=10.0.3`. These are published dependencies, not installed versions. |
| Identity | The [.NET 10 Identity API guide](https://learn.microsoft.com/en-us/aspnet/core/security/authentication/identity-api-authorization?view=aspnetcore-10.0), updated 2026-03-23, documents cookies and proprietary bearer tokens, not an OAuth/OIDC token server. |
| Frontend licenses | Current repositories identify [React as MIT](https://github.com/react/react/blob/main/LICENSE), [TypeScript as Apache-2.0](https://github.com/microsoft/TypeScript/blob/main/LICENSE.txt), and [Vite as MIT](https://github.com/vitejs/vite/blob/main/LICENSE). This is not a license audit of their dependency trees. |
| Desktop | [WPF](https://learn.microsoft.com/en-us/dotnet/desktop/wpf/overview/) runs on Windows even though .NET itself is cross-platform. [Windows App SDK](https://learn.microsoft.com/en-us/windows/apps/windows-app-sdk/) supplies WinUI 3 and can also supplement WPF/WinForms. |
| SQL Server alternative | [SQL Server 2025 editions](https://learn.microsoft.com/en-us/sql/sql-server/editions-and-components-of-sql-server-2025?view=sql-server-ver17), updated 2026-07-20, distinguish Standard/Enterprise Developer from production editions: both Developer editions are development/test only. |
| Java alternative | [Spring Boot 4.1.1 requirements](https://docs.spring.io/spring-boot/system-requirements.html) specify Java 17 minimum, compatibility through Java 26, and Spring Framework 7.0.9 or later. Runtime compatibility is not a JDK-vendor support entitlement. |

## Runtime, database and licensing implications

.NET 10 is a sensible qualification candidate for new work because .NET 8 has little support runway remaining at this snapshot. This is a lifecycle argument, not a measured feature/performance advantage. Supported operation requires current patches and a supported OS; framework-dependent versus self-contained delivery changes who delivers runtime updates. The latter must be republished/patched by the application owner. ([.NET policy](https://dotnet.microsoft.com/en-us/platform/support/policy/dotnet-core))

A source discrepancy remains visible: [EF Core 10 What's New](https://learn.microsoft.com/en-us/ef/core/what-is-new/ef-core-10.0/whatsnew) states support until **2028-11-10**, while the .NET-family policy above states **2028-11-14** and explicitly includes EF Core in scope. Do not silently substitute one date for the other or promise the later date for every component; confirm the release-specific schedule at qualification. EF10 requires the .NET 10 SDK/runtime.

Microsoft states that [.NET has no licensing charges, including commercial use](https://dotnet.microsoft.com/en-us/platform/free). However, “everything is MIT” would be inaccurate: [.NET licensing information](https://github.com/dotnet/core/blob/main/license-information.md) distinguishes MIT source/library packages from official Windows product distributions under the .NET Library License. [Windows-specific information](https://github.com/dotnet/core/blob/main/license-information-windows.md) also identifies separately licensed native binaries used by WPF. Preserve relevant licenses/notices; development tools, Windows, support contracts, and format-worker products require their own checks.

PostgreSQL's [license](https://www.postgresql.org/about/licence/) permits use and redistribution without a fee subject to its notice conditions. Both [Npgsql](https://github.com/npgsql/npgsql/blob/main/LICENSE) and its [EF provider](https://github.com/npgsql/efcore.pg/blob/main/LICENSE) use PostgreSQL-license terms; [EF Core uses MIT](https://github.com/dotnet/efcore/blob/main/LICENSE.txt). These licenses do not supply an operator or a contracted response time. PostgreSQL's [versioning policy](https://www.postgresql.org/support/versioning/) recommends the current minor release; a major upgrade requires planned dump/reload or `pg_upgrade`, not an assumed transparent patch.

PostgreSQL supports [atomic database transactions](https://www.postgresql.org/docs/18/tutorial-transactions.html). Its default [Read Committed isolation](https://www.postgresql.org/docs/18/transaction-iso.html) is not serial execution; stricter isolation can require whole-transaction retries. **IDEA implication:** enforce expected-Generation checks, constraints and publish invariants explicitly. A database transaction alone does not make an external Artifact-store write atomic.

[PITR](https://www.postgresql.org/docs/18/continuous-archiving.html) needs a base backup and an uninterrupted required WAL sequence. `pg_dump` is not a WAL-replay base backup; recovery covers the database cluster rather than an arbitrary subset. WAL does not back up manually edited server configuration or IDEA's external artifacts. Archiving normally waits for completed segments, so low write volume can delay durable archival; failures and lag require monitoring. **IDEA implication:** the one-hour gap and four-working-hour recovery objective need a coordinated database/artifact/configuration recovery design and measured drills, not a claim that “PostgreSQL supports backups.”

The [Npgsql 10 EF release notes](https://www.npgsql.org/efcore/release-notes/10.0.html) document PostgreSQL 18-specific support. Qualify an aligned EF10/provider10/Npgsql10 combination, exact patch versions, migrations and real PostgreSQL concurrency behavior; availability of compatible packages is not qualification evidence.

## Native accounts, authorization and session revocation

[Identity](https://learn.microsoft.com/en-us/aspnet/core/security/authentication/identity?view=aspnetcore-10.0) manages user/password records, claims, roles and account mechanisms. [UserManager](https://learn.microsoft.com/en-us/dotnet/api/microsoft.aspnetcore.identity.usermanager-1?view=aspnetcore-10.0) supplies creation, password, lockout and related management APIs. **IDEA implication:** an authorized administration UI can orchestrate these mechanisms, but the framework is not a complete company account-administration console. Administrator-only provisioning, account suspension, recovery, audit evidence and protection of the last recovery-capable administrator need designed workflows.

Identity supports [multiple external login providers](https://learn.microsoft.com/en-us/aspnet/core/security/authentication/social/?view=aspnetcore-10.0). Keep IDEA's stable internal user identity and product permissions independent of a later provider's identifiers/claims. Company login is technically extensible, but protocol, provisioning, identity linking and company approval remain open.

[Role authorization](https://learn.microsoft.com/en-us/aspnet/core/security/authorization/roles?view=aspnetcore-10.0) checks framework roles/claims; it does not define IDEA's object-, lifecycle- or policy-specific permissions. **IDEA implication:** authentication administration and product authorization remain separate responsibilities. Protected server operations must evaluate current account eligibility and the applicable IDEA policy; hiding a desktop/browser command is insufficient.

The [Identity API guide](https://learn.microsoft.com/en-us/aspnet/core/security/authentication/identity-api-authorization?view=aspnetcore-10.0) recommends browser cookies and documents non-JWT bearer tokens for clients unable to use cookies. Its local registration/login recipe uses Email and Password, so adopting it must not silently decide IDEA's username or recovery-channel policy.

Cookie security stamps are periodically checked; the [default interval is 30 minutes](https://learn.microsoft.com/en-us/dotnet/api/microsoft.aspnetcore.identity.securitystampvalidatoroptions.validationinterval?view=aspnetcore-10.0). For the built-in bearer option, the [Identity guide](https://learn.microsoft.com/en-us/aspnet/core/security/authentication/identity-api-authorization?view=aspnetcore-10.0) identifies access-token expiry as a limit on remaining session validity after security-sensitive changes. Password changes, logout or deleting a client token must not be presented as instantaneous revocation of every copied token.

**Qualification requirement:** demonstrate rejection on each protected server operation after suspension, revocation or permission removal, including previously issued credentials and long-lived connections. Define password/blocklist policy, throttling, MFA population, recovery delivery, key protection and compromise response; default framework settings are not security-policy approval.

Desktop authentication remains open. Do not invent an OAuth authorization-code exchange around Identity's `/login`. If a maintained OAuth/OIDC server is selected, [RFC 8252](https://www.rfc-editor.org/rfc/rfc8252) (October 2017) specifies external-user-agent authorization and PKCE for public native clients. Otherwise qualify a supported framework-session integration with its actual security properties. Neither choice is approved here.

## Browser UI and Windows Desktop

React's [official new-app guidance](https://react.dev/learn/creating-a-react-app) recommends a framework. Its [from-scratch guidance](https://react.dev/learn/build-a-react-app-from-scratch) permits Vite when constraints justify it, while assigning routing, data fetching and other framework concerns to the application team. A framework can support client-side/static deployment; it does not automatically require another production application server.

**IDEA implication:** React + TypeScript + Vite is a candidate, not a complete UI architecture. Compare a framework-supported SPA configuration with an explicitly bounded SPA design. The team still owns server-side authorization, CSRF/session integration, input validation, accessibility, data/error/loading behavior and dependency maintenance. Type annotations and a bundler are not security boundaries.

[Vite's rolling support policy](https://vite.dev/releases) currently gives regular patches to 8.2; 8.1/7.3 receive important/security fixes and 8.0/6.4 security fixes. Older ranges are unsupported. This is not a .NET-style fixed LTS promise. Exact React/TypeScript/Vite, build-runtime and third-party versions need a maintained lockfile, license inventory and upgrade qualification.

For Desktop, WPF on .NET 10 can reduce the number of distinct runtime families to maintain **if** it meets the required UI and integration needs. This is an IDEA-specific proposal: Microsoft [recommends WinUI 3 for new native Windows apps](https://learn.microsoft.com/en-us/windows/apps/). [WinForms](https://learn.microsoft.com/en-us/dotnet/desktop/winforms/overview/) remains an alternative for simpler forms-oriented scope, not an assumed fit for the entire engineering workspace.

Windows App SDK has its own servicing schedule. The [2026-08-25 policy page](https://learn.microsoft.com/en-us/windows/apps/windows-app-sdk/release-channels) labels the servicing row “2.0,” lists “2.4.0” under “Latest patch version,” and gives 2027-04-29 as end of servicing; 1.8 ends 2026-09-09. The [2.0 release notes](https://learn.microsoft.com/en-us/windows/apps/windows-app-sdk/release-notes/windows-app-sdk-2-0) separately identify 2.4.0, released 2026-08-13, and explain aligned product/package SemVer and major-version package families. Thus WinUI 3, the 2.x servicing family and an exact SDK package are different identifiers; no package is selected here.

Backward compatibility to Windows 10 1809 does not grant support to an expired Windows edition. Inventory actual PC editions/builds against [Windows App SDK policy](https://learn.microsoft.com/en-us/windows/apps/windows-app-sdk/release-channels) and the [.NET 10 OS matrix](https://github.com/dotnet/core/blob/main/release-notes/10.0/supported-os.md), updated 2026-04-06.

A separate per-user executable is technically feasible using [.NET Generic Host](https://learn.microsoft.com/en-us/dotnet/core/extensions/generic-host). [CurrentUserOnly named pipes](https://learn.microsoft.com/en-us/dotnet/api/system.io.pipes.pipeoptions?view=net-10.0) check the Windows account and elevation level. These are implementation building blocks, not proof of a protected Workspace process. Qualify startup, per-user IPC, restart/logout/update behavior and local-work preservation; same-user IPC is not isolation from every process running as that user.

## Alternatives and unresolved decisions

Microsoft's [SQL Server licensing guidance](https://www.microsoft.com/licensing/guidance/SQL) distinguishes Per Core and Standard Server + CAL models. Existing company entitlements and operational expertise could justify evaluating SQL Server 2025 Standard. Confirm the actual agreement, indirect access, virtualization and recovery rights; neither Developer edition permits production use. No price or entitlement is assumed.

[Spring Boot](https://spring.io/projects/spring-boot/) is a standalone-server alternative with an [Apache-2.0 license](https://github.com/spring-projects/spring-boot/blob/main/LICENSE.txt). Its [support policy](https://spring.io/support-policy/) distinguishes support periods and subscription extensions. A supported Java distribution, Spring minor line, dependency lifecycle and operator expertise must be selected together; JDK distribution-specific license and support terms remain open. Consider this option if company skills materially favor it, not as an inferred need for microservices.

Company decisions still needed include stack ownership, patch/release cadence, server OS, desktop packaging/signing, identity/recovery policy, exact component licenses and support purchasing. Qualification must establish real workflow/concurrency correctness and recovery evidence. Total user count alone cannot select hardware, topology or an SLA.

Method: official documentation, publisher repositories and owner-published package metadata only. A small Firecrawl search and two support-page reads succeeded; other page reads failed DNS resolution, so the available web reader completed the checks. No setup changes, package installation, production execution or company-system inspection occurred.

## Hosting and rendered-Desktop supplement

The primary author separately checked these sources on 2026-09-03 while integrating the note.

- The [.NET 10 supported-OS matrix](https://github.com/dotnet/core/blob/main/release-notes/10.0/supported-os.md), dated 2026-04-06, explicitly lists Ubuntu 24.04 and Windows Server 2025. Its Ubuntu row does not list 26.04. [Canonical's lifecycle page](https://ubuntu.com/about/release-cycle) lists Ubuntu 24.04 standard security maintenance through May 2029 and the newer 26.04 through May 2031; extended maintenance/support has separate conditions. **IDEA inference:** evaluate 24.04 as the initial Linux candidate against the exact .NET/package combination, rather than inferring support just because another OS is newer. IT/operator preference and supported-component qualification can change the choice; no OS has been approved or installed.
- [Windows Server 2025 lifecycle](https://learn.microsoft.com/en-us/lifecycle/products/windows-server-2025) identifies the Fixed Lifecycle Policy and covered editions. This does not establish an IDEA/company Windows Server license or entitlement. The attempted Firecrawl page read failed DNS; the available web reader returned the lifecycle page.
- [WebView2 security guidance](https://learn.microsoft.com/en-us/microsoft-edge/webview2/concepts/security) requires treating web content as untrusted, checking origin/navigation and validating messages/host-object parameters; it discourages generic native proxies. **IDEA proposal:** a WPF shell may reuse React in a rendered region, but only a narrow, validated, manifest-scoped bridge may reach native Workspace commands. No arbitrary filesystem/shell access, external-page privilege inheritance or native token exposure to JavaScript is acceptable. This is an architecture obligation, not a verified isolation result.
- [WebView2 best practices](https://learn.microsoft.com/en-us/microsoft-edge/webview2/concepts/developer-guide) recommend Evergreen for most apps and regular compatibility testing. [Distribution guidance](https://learn.microsoft.com/en-us/microsoft-edge/webview2/concepts/distribution) requires the runtime, describes managed/offline delivery and explains that running apps must adopt a new runtime through controlled restart/recreation. **IDEA proposal:** prefer an IT-managed Evergreen route; a fixed runtime requires explicit patch/redistribution ownership. Windows PCs alone do not prove runtime availability or install permission.
- The public abstract of [ISO/IEC/IEEE 42010:2022](https://www.iso.org/standard/74393.html), edition 2, November 2022, concerns the structure/expression of architecture descriptions, viewpoints and related frameworks/languages. It does not select an IDEA stack. The proposal uses an explicit context/concern/view/rationale structure without claiming access to every normative clause or assessed conformance.

These checks justify documentation proposals only. Private filesystem versus object storage,
native sessions, exact Web/native sign-in experience, server sizing, recovery implementation,
company approvals and total operating cost still need the qualification recorded in DOC-05/Tech.
