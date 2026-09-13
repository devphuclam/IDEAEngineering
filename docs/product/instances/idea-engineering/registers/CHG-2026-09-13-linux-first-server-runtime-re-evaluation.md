# Linux-first Server Runtime Re-evaluation — Change Record

## Control envelope

| Field | Recorded value |
|---|---|
| Stable Supporting Record ID | `IE-CHG-TECH-LINUX-001` |
| Supporting class / version | `CHG` / `Draft 0.1` |
| Date | 13-09-2026 |
| Owner / internal reviewer | Principal Product Author prepares; review of the full successor recommendation `NOT-RUN` |
| Approver | Product Decision Authority for Tech; review/acceptance `NOT-RUN` |
| Repository process authority / instruction state | `NOT-APPLICABLE` / `NOT-APPLICABLE` |
| Applicable baseline | `IDEA-C1-ANALYSIS-DESIGN-001`; starting `origin/main` `af62654627ad52bfe9d1ece46be4bb25ef41d383`; DOC-05@0.16, DOC-07@0.6, `IE-KNW-TECH-DEC-001@0.1`, `TECH-001@0.9` |
| Final controlled source set | DOC-05@0.17 (candidate Tech rows only), DOC-07@0.7 (routing only), `IE-KNW-TECH-DEC-001@0.2`, `TECH-001@0.10`; DOC-01/02/03/04/06/08, GOV/VVP and ADR semantics unchanged |
| Evidence class | Project-user Tech-context input + first-party support facts + bounded IDEA engineering inference; not Product Scope or test/approval evidence |
| Source / upstream trace | [`IE-RES-TECH-LINUX-20260913-001`](../../../../research/2026-09-13-linux-first-server-platform-support-check.md), [`IE-RES-TECH-20260913-001`](../../../../research/2026-09-13-technology-selection-evidence-synthesis.md), dated Java/.NET/deployment notes, current DOC-04/05/06/07/08 |
| Downstream trace | [technology matrix](../../../knowledge/2026-09-13-core-v0-technology-decision-matrix.md), [TECH-001](../decision-briefs/TECH-001-technology-and-architecture-proposal.md), [DOC-07](../DOC-07-mvp-roadmap-and-delivery-plan.md), [catalogue](../README.md), [version history](../decision-briefs/VERSION-HISTORY.md) |
| Product normativity | `INFORMATIVE`; no FTR/REQ/product behavior created or changed |
| Supersedes / Superseded by | Supersedes the engineering recommendation in `IE-CHG-TECH-DEC-001@0.1` for current Tech selection only; that record remains immutable historical provenance. Superseded by `NOT-APPLICABLE`. |
| Access / retention | `INTERNAL`; retain with predecessor hashes and subsequent qualification/decision records |
| Effective date / review trigger | Effective product decision `NOT-APPLICABLE`; revisit on PDA disposition, failed selected-stack qualification, changed vendor support or a material company platform constraint |
| Change status | Engineering recommendation authored; focused static validation recorded below; Product Decision Authority `NOT-RUN`; remote push/SHA reported after execution |

## 1. New context and decision boundary

The project user clarified that the IDEA Server should be considered Linux-first, the mere existence
of current Windows Server infrastructure must provide **zero** selection advantage, and the Server
may use a different runtime family from the Windows Desktop/Workspace if the Server architecture is
stronger. This is a Tech-context input, not approval of Ubuntu, Java, a stack, Product Scope or PG3/PG4.

The prior `TECH-001@0.9` recommendation gave substantial weight to one C#/.NET family across Server
and Windows client. The successor separates (A) Server OS, (B) Server runtime/framework and (C)
Windows Desktop/Workspace runtime. C# reuse remains a maintainability advantage only. Linux Server
and Windows clients already have independent deployment, patching, security, supervision, diagnostics
and failure domains.

## 2. Predecessor and affected records

| Record | Before / SHA-256 | After | Treatment |
|---|---|---|---|
| Technology matrix | `IE-KNW-TECH-DEC-001@0.1`; `A8BB495522E012AB3E71A23441BA6B3F97E82640A71AF3A4727FEE8353640C34` | `@0.2` | Reopen Server OS/runtime and dependent Server layers; retain Client and Product authority boundaries. |
| TECH-001 | `@0.9`; `B1A67D253066765B9834EF232648394B5F585B2A7B2B30ACF7D5B79984BCE04C` | `@0.10` | Current management-facing recommendation and challenge/questions. |
| DOC-05 | `@0.16`; `AEED0BADFB1F04458E0D45C3E743DEAF0AE4844E501AFB768A291D175D5F6999` | `@0.17` | Synchronize only outdated Server-side candidate technology and platform wording. All Mermaid diagram sources, Module ownership, interfaces, data-flow and architecture semantics are unchanged. Previous VEV for the exact `@0.16` view source remains historical. |
| DOC-07 | `@0.6`; `D6C2486C8B1854B0930FDA2764B62279B6F4062FD35112D8FF42406A4A111689` | `@0.7` | Route current Tech brief/version only; schedule, 56 tasks, 756 hours, increments and gates unchanged. |
| Instance/knowledge catalogues and brief version history | Current `@0.1` matrix / Tech `@0.9` / DOC-05 `@0.16` / DOC-07 `@0.6` routes | Current successor routes | Navigation and history only; historical snapshots retained. |
| Product requirements, semantics, diagram content, DDM, accepted ADRs and VVP | Current controlled baselines | Unchanged | No new requirement, architecture behavior, review or gate result. |

## 3. Engineering recommendation and rationale

1. **Server OS:** Ubuntu Server 26.04 LTS `SELECT — platform direction`, because Canonical's standard
   maintenance extends to May 2031 and official Temurin 25/PGDG PostgreSQL 18 package paths for
   `resolute` exist. Ubuntu 24.04 is a compatibility alternative. Windows Server 2025 is
   `ALTERNATIVE / CONTINGENCY` only for an IT mandate, required component/integration, failed Linux
   qualification or evidenced material staffed security/operations advantage.
2. **Server runtime:** Java 25 LTS / Eclipse Temurin 25 + Spring Boot 4.1.x and Spring Modulith 2.1.x
   `SELECT`. Spring Modulith's module verification/testing, Spring Integration/Batch breadth and
   Java 25 support optionality outweigh the maintainability cost of a second runtime family in the
   Linux-first Server comparison. .NET 10/ASP.NET Core remains a strong Linux-capable runner-up;
   neither is declared faster or more scalable without equivalent IDEA workload evidence.
3. **Dependent Server layers:** Spring JDBC/`JdbcClient` + Boot-managed pgJDBC for explicit owner SQL;
   one Flyway/versioned-SQL schema authority; Spring Security and Spring Session JDBC for session/
   authentication primitives, never IDEA Access Policy; bounded Spring task execution/scheduling,
   Spring Integration Adapters and Spring Batch where restartability is required; Actuator/Micrometer,
   OpenTelemetry/OTLP, JFR/`jcmd`; Maven Wrapper/Boot BOM; signed/versioned executable-JAR bundle
   under systemd with host-managed Temurin. No EF/Npgsql/ASP.NET Identity/hosted-worker/
   `dotnet-monitor` selection remains in the Java Server baseline.
4. **Database:** PostgreSQL 18 remains independently selected for transaction/locking/index/JSON,
   rebuildable projection, PITR/WAL, license optionality and Linux/pgJDBC fit. SQL Server 2025 is an
   alternative only on a concrete edition/license/DBA/restore/support case, never because DDM uses it.
5. **Windows boundary:** WPF/WebView2 Desktop, .NET 10 per-user Workspace and a separate Windows
   Format Worker when CAD/Office/license demands remain as previously recommended. Their contract
   with Server is versioned HTTPS/JSON/OpenAPI, stable IDs, expected state and idempotency; native
   IPC remains inside Windows. Two language stacks need separate SBOM/patch/runbooks and Q-13 evidence.

## 4. Support evidence versus qualification

The linked first-party support check establishes published Ubuntu 26.04 and 24.04 lifecycles,
Microsoft .NET 10 on Ubuntu 26.04, Adoptium Temurin 25 package availability on `resolute`, Boot
Java 25/systemd operation, PGDG PostgreSQL 18 `resolute`, and published Flyway/pgJDBC,
PostgreSQL backup and Spring monitoring primitives. It does **not** prove an installed IDEA build.
Q-01…Q-14 remain `NOT-RUN`; comparative branches remain `DEFERRED`, not failed. Q-14 must exercise
exact package provenance, JDK/Boot/JDBC/Flyway graph, certificates/hardening, updates, monitoring,
backup/restore and company policy. Q-13 must name support owners and measure two-runtime burden.
The Product Decision Authority has not reviewed or approved the successor: `NOT-RUN`. PG3/PG4 are
not `PASS`.

## 5. Product and architecture invariants

- **No Product Scope Change.** No FTR/REQ, DOC-04 behavior, DOC-05 architecture semantics, DOC-06
  data semantics, DOC-08 UX obligations, DDM capability semantics or accepted ADR meaning changed.
- DOC-05's maintained diagram content is untouched; `ArtifactReference`/Artifact Custody, narrow
  Transaction Coordinator, owner-specific authority, shared relational UoW, server-established
  ActorContext, `AuthorizationDecision` versus `OwnerCommandOutcome`, Audit/outbox atomicity,
  `Store → Server → Workspace`, Restricted Recovery Mode and Reservation
  `Active → Ended / Expired / Recovered` remain intact.
- No implementation, benchmark, production deployment, license purchase or gate promotion occurred.

## 6. Verification record

| Check | Result | Evidence |
|---|---|---|
| Focused Markdown/link and diff inspection | `PASS` (focused) | `git diff --check` exited 0; local-link existence check covered 275 links in the nine changed Markdown files with 0 missing. |
| Qualification status and diagram-source guard | `PASS` (focused) | Matrix and TECH each contain exactly Q-01…Q-14 once, all ending `NOT-RUN`; DOC-05 has 26 Mermaid blocks before and after, with identical block contents. This is not architecture/HCD approval or a rendered-diagram test. |
| Slow full-repository/diagram verifier | `NOT-RUN` | Skipped per prior user instruction; DOC-05 Mermaid content is unchanged and this is not a rendered-diagram acceptance. No PASS claim. |
| Remote `main` push and SHA check | `NOT-RUN` at authoring time | Confirm after one focused commit. |
