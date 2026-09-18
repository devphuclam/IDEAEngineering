# PH0 Environment Profile

**Increment**: `IE-INC-READY-001`  
**Record ID**: `IE-PH0-P04-ENV-001`  
**Version / status**: `0.1` / Draft; P04 execution `NOT-RUN`  
**Owner**: Principal Product Author  
**Reviewer**: QLHT/Operations and project reviewer; not assigned in an attributable record  
**Boundary**: This profile defines the permitted pilot environment. It does not install software,
select an unapproved runtime, start production services or authorize implementation.

## 1. Environment classes

| Class | Permitted use | Recorded state |
|---|---|---|
| Windows engineering workstation | Native account, Web/Desktop client, Managed Workspace and approved external CAD/Office association. | Company-controlled class is known; exact machine image, user-session policy and installed versions `NOT-RUN`. |
| Company-controlled server candidate | Future IDEA Server, relational database, Artifact Gateway/Vault adapters and controlled worker boundaries. | A server is available in the project context; host allocation, OS image, network rules and service ownership require P03/P04 confirmation. |
| Synthetic test storage | Repository-safe manifests, digests and synthetic fixtures only. | No company production file or real credential may be committed. |

## 2. Candidate tool and version profile

The table records the current Engineering baseline without turning a candidate into runtime evidence.

| Boundary | Candidate / decision | Qualification or approval still required |
|---|---|---|
| Web client | React + TypeScript according to the approved Tech predecessor. | Exact build toolchain and approved package lock must be confirmed before PH1. |
| Windows shell / Workspace | WPF + WebView2; `.NET` build/publish applies specifically to WPF + Workspace. | Windows image, WebView2 servicing and native bridge review remain `NOT-RUN`. |
| IDEA Server | Linux-first Java/Temurin/Spring/PostgreSQL Engineering baseline recorded in the knowledge index and approved Tech predecessor. | Actual host image, JDK/runtime versions, service account and deployment qualification remain `NOT-RUN`. |
| Artifact Gateway / Vault Adapter | Candidate boundary in the later multi-location Vault successor Draft; the approved predecessor establishes resumable Artifact custody but not this exact provider/topology disposition. | D0/PDA disposition, provider, topology, durability, throughput and failure-domain qualification remain `UNKNOWN`/`BLOCKED`. |
| Format Worker | Separate Windows boundary selected for CAD/Office/Format Adapter profiles. | Exact worker runtime/toolchain, licensed application availability and format qualification are `NOT-RUN`; the worker itself is not labelled conditional. |
| Database migration | Versioned migrations only after an approved implementation increment. | No migration or database installation is performed in PH0. |

No dependency may be downloaded or installed only because it is convenient. Any external source,
runtime, converter, font or SDK must first have an exact version, license and commercial-use state
recorded through [external-source-intake.md](../../docs/agents/external-source-intake.md).

## 3. Configuration and secret ownership

| Item | Owner to confirm | PH0 rule |
|---|---|---|
| Native account bootstrap and reset policy | Account Administrator / QLHT | No public self-registration or shared default password. |
| Server service identity and database secret | QLHT/Operations | Secrets stay outside source control and outside client/Workspace files. |
| Vault endpoint and Gateway credentials | Artifact Custody/Operations | Client receives only a short-lived scoped Transfer Grant; no permanent provider path or credential. |
| Format Worker licensed application/configuration | Format/Operations owner | License and worker sandbox evidence required before a format job is called qualified. |
| Backup encryption/key recovery | Operations/Security reviewer | Backup/restore is a coordinated recovery set; exact key custody is `UNKNOWN` until assigned. |

## 4. Repeatable future entry points

The following are named entry points for a future authorized increment, not commands run by PH0:

- `dotnet build` / `dotnet publish`: WPF + Workspace only, after the approved build environment exists.
- Server build/test entry point: to be recorded with the selected Java/Temurin/Spring toolchain before
  PH1; no substitute command is invented here.
- Migration entry point: versioned migration runner owned by the Server delivery boundary; not run in
  PH0.
- Verification entry point: procedures in the VVP, using the approved synthetic dataset and exact
  environment manifest.

## 5. Prohibited workstation actions

- Do not install SDKs, CLIs, packages, services, converters or licensed applications without the
  applicable company approval and external-source/license record.
- Do not use Docker or another container runtime as a shortcut for missing approval.
- Do not use real production files, credentials or Vault paths in repository fixtures.
- Do not bypass Server/RBAC checks by editing the database, local Workspace Manifest or Vault bytes.
- Do not call a local upload, worker result or database row a passed product verification.

## 6. Readiness status

`P04-ENV-001` is `NOT-RUN`. A reviewer must confirm host classes, tool/version pins, service/secret
owners, network/Vault allocation, license state and future build entry points before this profile can
support a PG4 decision.

## Change log

| Version | Date | Change | Evidence |
|---|---|---|---|
| 0.1 | 2026-09-18 | Initial permitted-environment profile; unknowns remain visible and no setup was executed. | T017 |
