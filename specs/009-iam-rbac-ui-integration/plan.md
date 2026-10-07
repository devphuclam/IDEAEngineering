# Implementation Plan: Native Account and Scoped RBAC UI Integration

Branch: codex/iam-rbac-ui-integration-spec | Date: 2026-10-07 | [Spec](spec.md)

## Control and disposition

| Field | Value |
|---|---|
| ID / class / version / state | IE-PLAN-IAM-UI-001 / Spec Kit implementation design / 0.4 / Draft Backend-first gate metadata successor; technical design unchanged |
| Authority / owner / author | INFORMATIVE candidate design / Project user / Codex, CODEX_ONLY |
| Baseline | Main 4e5244430ea89ffe878819e1279f6e05c60d610a; spec review PASS at e227cb1df60e70a1294628b4f153ad50d8f034c6 |
| Reviewer / acceptance | Project Reviewer DESIGN REVIEW PASS at 0a1de66627fccc4597ac753f6c642d1d8d5f7d1d on 2026-10-07, supplied through human conversation / explicit human PG2/PG3 PASS for 5b2fb9f; subsequent human Backend-first PG4 PASS-WITH-ACTIONS with HTTPS/Chrome NOT-RUN, see execution-envelope.md section 5; not inferred from design review |
| Date / effective / classification / retention | 2026-10-07 Asia/Ho_Chi_Minh / NOT-APPLICABLE / INTERNAL / Git |
| Change / source / downstream | Issue #46 / [change record](../../docs/product/instances/idea-engineering/registers/CHG-2026-10-07-iam-rbac-ui-integration-baseline.md), [research](research.md) / checklist, tasks, Analyze, gated TDD |
| Supersession / trigger / evidence | No accepted implementation replaced / permission, role, scope, delivery or interface change / source-inspected design; runtime NOT-RUN |
| Standards tailoring | IE-STD-AUTH-001; STD-ARC-001 ownership/views, STD-INFO-001 identity, STD-TEST-001…004 verification design; no conformity claim |

## Summary

Current readiness metadata: [controlled envelope](execution-envelope.md) and
[handoff section 10](integration-readiness.md#10-current-backend-first-execution-gate--2026-10-07)
supersede the historical NOT-RUN environment/gate observations below. Accepted technical design
is unchanged; no T008+ implementation has started. The only source adjustment is the separately
authorized build-tool JSR305 exclusion proven necessary by the actual offline acquisition graph.

Connect the useful existing presentation to Identity and Accounts, Project Governance and Access
Policy. Reuse ordinary session/CSRF and qualified account commands. Add missing owner queries,
Project/Group state, constrained role administration and one current all-path evaluator. No new
service, identity protocol or generic policy framework. [Permissions](contracts/permission-delegation.md)
and [operation contracts](contracts/operations.md) are exact proposed design, not implemented routes.

D09/D10/D11 are incorporated through their Core owners in the reviewed written design. Q15 adds a
separately bounded console adoption transition, not bootstrap reuse or widening Super@1. Written
design was accepted at the exact source above; formal applicable gate dispositions and execution
readiness must still be recorded before implementation. The authorized Analyze repair changes only
work decomposition, ordering and review metadata, not the accepted technical contracts.

## Technical Context

| Concern | Selection / execution limit |
|---|---|
| Language/dependencies | Existing Java 25, Boot 4.1.1, JDBC/PostgreSQL; React 19.3.0, TypeScript 7.0.2, Vite 8.3.1. No graph/version change. |
| Platform/type | Linux modular Server; same-origin React CSR served by actual packaged Server over trusted HTTPS. Native ordinary HttpOnly session + existing CSRF. |
| Storage | One Operating Organization; additive successor after V1–V10, no SQL generated/executed here. |
| Testing | Real Server/PostgreSQL JUnit owner/HTTP tests; Web tests and actual trusted browser. No H2/mock authority acceptance. |
| Scope/performance | Administrative journeys, not scale expansion. Bounded lists up to 100; no fabricated latency/load target. |
| Constraints | Stable IDs, immutable versions, no auto grants, narrow SQL writes, current commit eligibility, no secret retention. |
| Tooling readiness | Exact installed JDK/Maven/cache/Node/browser hashes, rights and owned DB/TLS targets checked before execution. Prior work-item-specific exceptions do not transfer. |
| Environment unknowns | Current host/cache/target availability NOT-RUN; execution preflight resolves them. No install/download implied. |

## Constitution Check

Author design assessment, not a PG2/PG3/PG4 PASS; assessed before research and after design.

| Principle | Disposition |
|---|---|
| I — clean-room/intake | Confirmed IDEA semantics and admitted source; no new import. Future external artifact requires intake. |
| II — docs before code | Spec/design accepted for task planning; explicit applicable PG2/PG3/PG4 dispositions and exact execution envelope still required before implementation. |
| III — trace/change | Core owner mapping + Q15 transition; FR/operation/oracle crosswalk; historic approval hashes preserved. |
| IV — truthful results | New behavior DESIGN; runtime/verifier NOT-RUN. Document checks do not prove implementation. |
| V — least privilege/recovery | Exact delegation, membership applicability, private handoff, narrow owner writes, atomic evidence and last-recovery protection. |
| VI — continuity | CODEX_ONLY, no specialist prerequisite/competing workflow/timer restart. |

No Constitution exception proposed. Implementation gate remains NOT-RUN.

## Project Structure and deep module seams

Feature directory contains spec, readiness, plan, research, data-model, contracts and quickstart.
The reviewer-owned design checklist records the accepted-source quality assessment separately from
runtime results. The [93-task worklist](tasks.md) is generated and repaired through Spec Kit;
its old-to-new ID crosswalk preserves predecessor trace. No implementation task is complete.

| Source home | Interface and implementation locality |
|---|---|
| apps/server/src/main/java/com/idea/ddm/identity | IAM eligible context, redacted directory and existing account/proof commands; credential/session internals stay private. |
| apps/server/src/main/java/com/idea/ddm/project (proposed) | Project Governance queries/commands own membership/Group/history rules. |
| Access Policy code currently in identity | Extend/extract one authoritative evaluator and role administration module; existing and new owner callers share it. No parallel RBAC model. |
| Existing relational UoW/security-write lock | Current IAM, assignment/delegation, membership and owner version checked before shared commit; no distributed coordinator. |
| apps/web/src | Actual client adapter/state + selectively reused presentation; no fake profile/Organization/security success. |
| apps/server/src/test/java; existing qualification harness homes | Same owner interfaces as callers, named fixtures, affected regressions and real Web qualification. |
| database/migrations | Future additive schema and exact non-granting seed manifest. |

Without these deep modules, callers would duplicate scope, eligibility, delegation, current-path
resolution and atomic evidence. Do not add pass-through interfaces without a concrete need.

## Delivery sequence, not executable tasks

1. Record accepted written Core/catalogue/contracts/adoption design; complete read-only Analyze
   and obtain explicit applicable execution-readiness gates before any source/test/schema work.
2. Preserve seeds/tests; qualify additive data/least privilege, actual IAM/UoW, Project-owned
   authorization read facts and the one shared evaluator. Qualify shared Web/session/error state
   before owner screens. Separately qualify synthetic explicit Q15 adoption using these foundations.
3. Actual context/directory/detail + account UI; exact setup/private handoff, recipient redemption
   and explicit reissue tests. Wire actual account/recipient routes and qualify this slice now.
4. Project/Group/participation + PA and actual participant read query; real HTTP adapters/tests
   use the foundational evaluator; wire and qualify actual Project routes in this slice.
5. Assignment preview/grant/revoke/regrant/replace uses the same evaluator; qualify the wizard,
   then Custom-role composition/activation/successor and content-based delegation enforcement.
6. Safe all-path inspection/history/operation resolution, with one adapter owner and actual routes.
7. Final actual browser/keyboard/refusal/uncertain-response qualification and affected predecessor
   regression; exact evidence and independent review before integration.

Prerequisite fixtures never count as another slice's implementation. New authority is evaluable
before an owner uses it. Live console adoption needs its own exact-target execution approval.

## Risk and readiness

| Risk | Treatment / oracle |
|---|---|
| No successor grant authority | Q15 current Super reauthentication → separate exact Super@2 grant; no seed/old-row/HTTP bypass. |
| Historic tuple prevents regrant | Preserve history; one-unended-tuple uniqueness and new ID on regrant; concurrent regression. |
| Blanket database writes | Restricted owner functions; migrator ownership and direct-DML denial qualification. |
| Stale session/delegation/membership | Existing coordinated security-write lock + real eligibility seam, including new HTTP role commands. |
| Lost response/proof | Operation-specific resolution; no plaintext retrieval or blind success/retry. |
| Privileged Custom Role disguise | Classify by constituent action/delegation content, not label; validate composition and grant. |
| Super successor omitted from recovery | Check effective supported versions and Account state under same lock. |

## Complexity Tracking

No violation requiring justification. One evaluator, owner schemas and narrow database functions
address demonstrated requirements; broker, arbitrary conditions, bulk-grant coordinator and
distributed IAM remain deferred. Plan publication is not execution, rollout, timer or merge authority.
