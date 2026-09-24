# IDEA Engineering Core v0 Technology Recommendation — Change Record

## Control envelope

| Field | Recorded value |
|---|---|
| Stable Supporting Record ID | `IE-CHG-TECH-DEC-001` |
| Supporting class / version | `CHG` / `Draft 0.1` |
| Date | 13-09-2026 |
| Owner / internal reviewer | Principal Product Author prepares; project-user review of the complete Tech recommendation `NOT-RUN` |
| Approver | Product Decision Authority for Tech; decision `NOT-RUN` |
| Applicable baseline | `IDEA-C1-ANALYSIS-DESIGN-001`; origin/main `1f3f9306dedc0bc8a5f3b61a6dd8975e84b7c6f8` at change start; DOC-01@0.6, DOC-02@0.2, DOC-03@0.7, DOC-04@0.13, DOC-05@0.16, DOC-06@0.16, DOC-07@0.5, DOC-08@0.12, GOV@0.3, VVP@0.16 |
| Final controlled source set | Same baseline with `DOC-07@0.6`; the DOC-07 increment is metadata/routing-only and does not alter schedule, tasks, hours, product semantics or gate state |
| Evidence class | Informative technology evidence consumed into an engineering recommendation; not implementation, qualification, product approval or gate evidence |
| Access / retention | `INTERNAL`; retain with the matrix, TECH brief, research synthesis and future qualification records |
| Product normativity | `INFORMATIVE`; no FTR/REQ/product behavior is created or changed |
| Change status | Recommendation authored; focused validation recorded below; remote push/SHA is verified after the focused commit and reported separately |

## 1. Reason and scope

The technology research synthesis `IE-RES-TECH-20260913-001` was mature enough to support a final
engineering recommendation but intentionally did not choose an overall stack. This change creates
the controlled decision matrix `IE-KNW-TECH-DEC-001@0.1` and refreshes the Vietnamese management brief
`TECH-001` from `0.8` to `0.9`.

The recommendation selects one coherent Core v0 baseline: `.NET 10/ASP.NET Core`, PostgreSQL 18,
EF Core/Npgsql, React/TypeScript/Vite, WPF/WebView2, a per-user .NET Workspace, a private filesystem
Artifact Store, an optional isolated Windows Format Worker, and an Ubuntu-first native deployment.
Java 25 + Eclipse Temurin 25/Spring Boot and SQL Server remain explicit alternatives. The document records exactly which evidence
and qualification work is still `NOT-RUN`.

This is an engineering recommendation for Product Decision Authority review. It does not approve a
technology, authorize implementation, pass PG3/PG4, or turn any research/competitor observation into
an IDEA requirement.

## 2. Predecessor and affected records

| Record | Before | After | Treatment |
|---|---|---|---|
| `TECH-001` | `0.8`; SHA-256 `F9B7959B94EF854AB1E08651FD81BB4AA9C03E84F0D9C1CAF08EB3F59A39136F` | `0.9` | Rewritten as the current selected recommendation, alternatives, PG3 pre-decision and qualification map. |
| Technology decision matrix | None | `IE-KNW-TECH-DEC-001@0.1` | New controlled informative artifact linked to the research synthesis and TECH-001. |
| Instance catalogue | TECH `Draft 0.8`, no matrix route | TECH `Draft 0.9`, matrix and this CHG routed | Index/reference update only. |
| DOC-07 metadata references | `DOC-07@0.5` with Tech `0.8` in the current roadmap references | `DOC-07@0.6` with Tech `0.9` and “recommendation presented” wording | Version/routing metadata only; no roadmap task, hour, gate or product obligation changed. |
| Feature / Spec / Core DOC-01…DOC-06 and DOC-08 | Unchanged | Unchanged | No product requirement, scope or architecture semantic change. |
| VVP / gate state | Existing procedures and gates; results `NOT-RUN`/`BLOCKED` | Unchanged | No qualification or PG result is invented. |

## 3. Decision content admitted by this change

1. `.NET 10 LTS + ASP.NET Core 10` is the recommended Server runtime because it consolidates the
   primary runtime family across the Windows Workspace and installed shell for a small initial team.
   This is not a performance or enterprise-superiority claim.
2. PostgreSQL 18 is the recommended relational database because its transaction, locking, JSON,
   index, PITR/WAL and licensing-optional profile fits the known context. SQL Server 2025 remains a
   supported alternative where company operations/licensing evidence is materially stronger.
3. EF Core 10/Npgsql is the default persistence path; module-owned raw Npgsql is a measured escape
   hatch. EF migration bundles are the sole schema authority.
4. React 19.3 + TypeScript 7 + Vite 8.3/Node.js 24 LTS is the current client-only Web baseline. WPF + WebView2
   Evergreen and a separate .NET 10 per-user Workspace preserve the current Desktop/Web-rendered
   Desktop surface and Windows file boundary.
5. Search begins with a rebuildable PostgreSQL Discovery Projection. Artifact bytes remain in a
   private server-managed filesystem adapter. Format conversion remains a separate, exact-profile
   Windows worker with manual upload fallback.
6. Ubuntu Server 26.04 LTS is the primary OS recommendation, conditional on complete-stack Q-14;
   Ubuntu 24.04 LTS and Windows Server 2025 are fallbacks. Native package/systemd on one non-HA VM is
   recommended; Kubernetes, microservices and a mandatory broker are outside Core v0.

## 4. Qualification and approval boundary

All Q-01…Q-14 rows in the matrix and TECH-001 remain `NOT-RUN`. Comparative Java, SQL Server, WinUI,
browser-agent, Tauri and other branches are `DEFERRED`, not failed. The minimum evidence before a
Product Decision Authority Tech approval request includes the company OS/edition/license/signing/
support disposition, transaction/security slices (Q-01/Q-02/Q-05/Q-06/Q-08/Q-11) and complete
platform compatibility (Q-14). This record does not label any of them `PASS`.

Product Decision Authority Approval: `NOT-RUN`.

## 5. Impact and invariants

- **No Product Scope Change.** FTR and REQ sets are unchanged.
- DOC-01…DOC-08 meanings, accepted ADRs, DDM capability semantics and VVP procedures are unchanged.
- Artifact Custody and the Application Use-case Transaction Coordinator retain their existing narrow
  ownership; no God Module is created.
- Server-established `ActorContext`, IDEA Access Policy, owner `OwnerCommandOutcome`, Audit/outbox
  atomicity, `Store → Server → Workspace`, provider-neutral Artifact IDs, Representation acceptance,
  Restricted Recovery Mode and Reservation `Active → Ended / Expired / Recovered` remain unchanged.
- Product Decision Authority, PG3 and PG4 remain `NOT-RUN`; no implementation authorization is added.

## 6. Verification record

The following fields are intentionally completed after the focused change is validated:

| Check | Result | Evidence |
|---|---|---|
| Markdown/link and diff inspection | `PASS` (focused) | `git diff --check` and a local-link existence check over all changed Markdown files completed 2026-09-13; no broken local links or whitespace errors reported. |
| `pwsh -NoProfile -File scripts/validate-ddm-capability-matrix.ps1` | `PASS` | `PASS: 100 unique DDM-CAP rows; 41 sources; 19 categories; FTR-001…014 present; enums and summary totals valid.` |
| Slow full-repository verifier | `NOT-RUN` | Explicitly skipped per user instruction; this is not a PASS claim |
| Remote `main` push and SHA check | `NOT-RUN` at authoring time | To be recorded after the focused commit |
