# Linux Server Technology Rationale Refinement — Change Record

## Control envelope

| Field | Recorded value |
|---|---|
| Stable Supporting Record ID | `IE-CHG-TECH-LINUX-002` |
| Supporting class / version | `CHG` / `Draft 0.1` |
| Date | 13-09-2026 |
| Owner / internal reviewer | Principal Product Author prepares; review of the successor recommendation `NOT-RUN` |
| Approver | Product Decision Authority for Tech; review/acceptance `NOT-RUN` |
| Repository process authority / instruction state | `NOT-APPLICABLE` / `NOT-APPLICABLE` |
| Applicable baseline | `IDEA-C1-ANALYSIS-DESIGN-001`; starting `origin/main` `1345098012c8462274fab61082cb7007e85ae838`; DOC-05@0.17, `IE-KNW-TECH-DEC-001@0.2`, `TECH-001@0.10` |
| Final controlled source set | DOC-05@0.18 (technology-neutral architecture wording), `IE-KNW-TECH-DEC-001@0.3`, `TECH-001@0.11`; DOC-01/02/03/04/06/07/08, GOV/VVP, ADR and diagram semantics unchanged |
| Evidence class | Focused correction of engineering inference against existing controlled sources; no new research, Product Scope, test or approval evidence |
| Source / upstream trace | [`IE-RES-TECH-20260913-001`](../../../../research/2026-09-13-technology-selection-evidence-synthesis.md), [`IE-RES-TECH-LINUX-20260913-001`](../../../../research/2026-09-13-linux-first-server-platform-support-check.md), current DOC-04/05/06 and predecessor Tech records |
| Downstream trace | [technology matrix](../../../knowledge/2026-09-13-core-v0-technology-decision-matrix.md), [TECH-001](../decision-briefs/TECH-001-technology-and-architecture-proposal.md), [DOC-05](../DOC-05-architecture-description.md), [catalogue](../README.md), [version history](../decision-briefs/VERSION-HISTORY.md) |
| Product normativity | `INFORMATIVE`; no FTR/REQ/product behavior created or changed |
| Supersedes / Superseded by | Refines the current Tech recommendation recorded by `IE-CHG-TECH-LINUX-001@0.1`; that record remains immutable historical provenance. Superseded by `NOT-APPLICABLE`. |
| Access / retention | `INTERNAL`; retain with predecessor hashes and later qualification/decision records |
| Effective date / review trigger | Effective product decision `NOT-APPLICABLE`; revisit on PDA disposition, failed qualification, changed vendor support or a material company platform constraint |
| Change status | Engineering rationale refined; Product Decision Authority `NOT-RUN`; remote push/SHA recorded after execution |

## 1. Correction decision

Java remains the narrowly recommended Linux-first Core v0 Server runtime. The correction removes
claims that JDBC, hypothetical Integration adapters or hypothetical Batch workloads make Java the
winner. The positive differentiators are Spring Modulith's direct module-boundary verification and
module test/documentation/observability support where applicable, a coherent mature Linux Server
platform, and JDK distribution/support optionality. IDEA domain ownership remains the architecture
authority. No performance, scale or generic “enterprise” superiority is asserted.

The comparison is now symmetric: Spring JDBC/`JdbcClient` and raw Npgsql are equivalent explicit-SQL
paths for this decision; JPA/Hibernate/Spring Data and EF Core are mature ORM paths that both require
module-specific fit evidence. Java's longer JDK runway does not freeze Spring or its transitive graph,
and .NET 10's 2028 support date does not prove higher full-stack burden. Q-13 owns that measurement.

## 2. Dependency and session disposition

The first controlled build uses ordinary Spring Security server-side sessions on one Server instance.
`REQ-IAM-004` is addressed by one-instance session invalidation plus request- and commit-time
eligibility revalidation. Restart invalidates sessions safely while Workspace local candidates remain
preserved. Spring Session JDBC is conditional because no approved multi-instance or session-survival
requirement exists; its tables, cleanup, backup and lifecycle cost are not accepted by default.

Spring Integration is conditional on a concrete approved adapter/EIP contract. Spring Batch is
conditional on a real restartable/chunked/skippable workload and recovery contract. Neither is a Core
dependency or runtime-selection reason. Broker, Redis, dedicated search and alternate persistence
authorities remain deferred until their recorded triggers occur.

## 3. Predecessor and affected records

| Record | Before / SHA-256 | After | Treatment |
|---|---|---|---|
| Technology matrix | `IE-KNW-TECH-DEC-001@0.2`; `261389E179C30BFC922C37FACA41867A686722C82502E5C0368008C197E21DA9` | `@0.3` | Correct selection rationale, symmetric persistence/lifecycle comparison, dependency classes, session choice and Q-05/Q-06/Q-13/Q-14. |
| TECH-001 | `@0.10`; `1F8B236E4747AB64559F25EA85EC2B5908600887D24F9F5D7C963FD76CBC128F` | `@0.11` | Present the same corrected recommendation and explicit challenge answers. |
| DOC-05 | `@0.17`; `4A17C77E452C28F46E4F9D83555AED62A21AF7F3A10C7C1CDD5CF14BD1B57B36` | `@0.18` | Preserve Linux-first Server and separate Windows Format Worker boundaries while returning volatile exact technology choices to TECH/matrix authority. Mermaid source and architecture semantics are unchanged. |
| DOC-07 | `@0.7` | unchanged | Historical routing to `TECH-001@0.10` is retained; current successor routing is supplied by the catalogue/change record. No schedule, task or gate edit. |
| Product requirements, Spec, Feature, DDM, accepted ADRs, VVP and PG state | Current controlled baselines | unchanged | No scope, behavior, architecture invariant, validation rule, review or gate result change. |

## 4. Qualification and switch rule

Q-01…Q-14 remain `NOT-RUN`. Q-13 must compare equivalent candidates and retain staffing, patch,
onboarding, incident-response, dependency-lifecycle and SBOM evidence. The runtime recommendation is
reopened when that heterogeneous-stack burden breaches a management-approved materiality threshold
and an equivalent .NET candidate meets every mandatory behavior with lower total risk, or when Java
fails a mandatory qualification that the equivalent .NET candidate passes.

PostgreSQL 18 remains independently selected. Ubuntu 26.04 remains the current platform direction,
and executable-JAR/`systemd` packaging remains the Tech recommendation. The Windows WPF/WebView2
Desktop, .NET Workspace and separate Windows Format Worker remain unchanged.

## 5. Product and architecture non-impact

- **No Product Scope Change.** No FTR, REQ, Feature, Spec, DDM capability semantics or product gate changed.
- No DOC-04, DOC-06 or DOC-08 semantics changed. DOC-05 only moves volatile selection detail back to
  Tech authority; Module ownership, Interfaces, UoW, security, custody, lifecycle and recovery remain.
- No Mermaid diagram source changed. No architecture review, Product Decision Authority acceptance,
  PG3 or PG4 result is claimed.
- Reservation remains `Active → Ended / Expired / Recovered`; `Released` remains Business Revision terminology.

## 6. Verification record

| Check | Result | Evidence |
|---|---|---|
| Focused Markdown/diff/link checks | `PASS` (focused) | `git diff --check` exited 0; all 251 local links in the seven changed Markdown files resolved. |
| Q-status, dependency-class and forbidden-rationale checks | `PASS` (focused) | Matrix and TECH each contain exactly Q-01…Q-14 with every row `NOT-RUN`; both Core graph rows exclude Session JDBC/Integration/Batch; required symmetric comparison and conditional-dependency assertions were found; no Java-advantage row attributes the choice to JDBC, Integration or Batch. |
| DOC-05 Mermaid source identity | `PASS` (source-only) | 26 predecessor and 26 successor Mermaid blocks compared byte-for-byte after line-ending normalization; all were identical. No rendered-diagram or architecture-acceptance result is implied. |
| Slow full-repository/diagram verifier | `NOT-RUN` | Not required for this focused rationale correction; no PASS claim. |
| Remote `main` push and SHA | `NOT-RUN` at authoring time | Confirm after one focused commit. |
