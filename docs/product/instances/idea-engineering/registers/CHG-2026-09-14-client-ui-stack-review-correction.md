# Client/UI Stack Review Correction — Change Record

## Control envelope

| Field | Recorded value |
|---|---|
| Stable Supporting Record ID | `IE-CHG-TECH-CLIENT-002` |
| Supporting class / version | `CHG` / `Draft 0.1` |
| Date | 14-09-2026 |
| Owner / internal reviewer | Principal Product Author prepares; independent internal review of the successor recommendation `NOT-RUN` |
| Approver | Product Decision Authority for Tech; review/acceptance `NOT-RUN` |
| Repository process authority / instruction state | `NOT-APPLICABLE` / `NOT-APPLICABLE` |
| Applicable baseline | `IDEA-C1-ANALYSIS-DESIGN-001`; starting `origin/main` `814b81bc3dcdd9caa0203b5aa62ccaf909514e97`; DOC-07@0.9, `IE-KNW-TECH-DEC-001@0.4`, `TECH-001@0.12`, `IE-RES-TECH-CLIENT-20260914-001@0.2`, `IE-CHG-TECH-CLIENT-001@0.1` |
| Final controlled source set | `IE-RES-TECH-CLIENT-20260914-001@0.3`, `IE-KNW-TECH-DEC-001@0.5`, `TECH-001@0.13`, DOC-07@0.10 routing; DOC-01…06/08, GOV/VVP, ADR and diagram semantics unchanged |
| Evidence class | Architecture-review correction + first-party Dart/Flutter and Win32 API facts + bounded `IDEA-INFERENCE`; no runtime benchmark, Product requirement, approval or gate evidence |
| Source / upstream trace | [Predecessor Client/UI change record](CHG-2026-09-14-client-ui-stack-re-evaluation.md), [Client/UI research](../../../../research/2026-09-14-flutter-client-ui-stack-evidence.md), [technology matrix](../../../knowledge/2026-09-13-core-v0-technology-decision-matrix.md), [TECH-001](../decision-briefs/TECH-001-technology-and-architecture-proposal.md), official Dart/Flutter FFI and Microsoft Win32 named-pipe sources cited by the research |
| Downstream trace | [DOC-07](../DOC-07-mvp-roadmap-and-delivery-plan.md), [catalogue](../README.md), [version history](../decision-briefs/VERSION-HISTORY.md), future Q-08/Q-10/Q-15 evidence |
| Product normativity | `INFORMATIVE`; no FTR/REQ/product behavior created or changed |
| Supersedes / Superseded by | Refines the current Client/UI recommendation recorded by `IE-CHG-TECH-CLIENT-001@0.1`; that record remains immutable historical provenance. Superseded by `NOT-APPLICABLE`. |
| Access / retention | `INTERNAL`; retain with predecessor hashes and later qualification/decision records |
| Effective date / review trigger | Effective product decision `NOT-APPLICABLE`; revisit on PDA disposition, Q-08/Q-10/Q-15 evidence, Client platform policy change or approved cross-platform roadmap expansion |
| Change status | Reviewer correction incorporated; Product Decision Authority, Q-01…Q-15 and PG3/PG4 `NOT-RUN`; remote push/SHA reported operationally if later authorized |

## 1. Corrected decision wording

The engineering recommendation remains:

> **KEEP CURRENT BASELINE, BUT FLUTTER REMAINS QUALIFICATION CHALLENGER.**

This successor changes what “keep” and `SELECT` mean. Option A—React + WPF/WebView2 + separate
per-user `.NET Workspace`—is the **provisional qualification control**, not a proven lower-risk
architecture and not the Q-15 winner. It is retained as the stable starting/reference implementation
because it is the current documented proposal. Actual seam count, implementation effort, security,
diagnostics and lifecycle risk remain `NOT-RUN` for both A and B.

## 2. Review findings and disposition

| Finding | Disposition | Controlled correction |
|---|---|---|
| Option A was described as having fewer unowned seams | `ACCEPT` | Replace the claim with provisional-control wording and show both installed-client hop hypotheses. No lower-risk conclusion exists before Q-15. |
| Q-08 called Flutter deferred although Q-15 selected it | `ACCEPT` | `.NET` named pipes remain the Q-08 baseline; the Flutter alternate client is actively exercised under Q-15. Other alternate clients remain deferred unless separately selected. |
| Q-10 also grouped Flutter with deferred branches | `ACCEPT — ADDITIONAL CONSISTENCY FINDING` | Option A and Flutter are active Q-15 branches; WinUI/browser/Tauri remain optional pre-screen branches unless explicitly selected. |
| Flutter IPC PoC defaulted to a custom C++ plugin | `ACCEPT` | Try direct Dart FFI → Win32 named-pipe API first. Introduce a narrow C ABI/C++ shim or Flutter plugin only on a measured, recorded blocker and repeat the applicable tests for the added boundary. |
| Validator `NOT-RUN` appeared inconsistent with the pasted task | `NO DOCUMENT DEFECT` | The repository user issued a separate, direct and repeated execution instruction not to run verifier scripts and to leave them for manual `.bat` execution. That specific execution override governed the run. No validator or GitHub status-check result is converted to `PASS`. |

## 3. IPC and seam qualification boundary

The compared installed-client chains are:

```text
A control:  React → WebView2 message → WPF → Win32 named pipe → .NET Workspace
B primary:  Dart → FFI → Win32 named pipe → .NET Workspace
B fallback: Dart → narrow C ABI/C++ shim or Flutter plugin → Win32 named pipe → .NET Workspace
```

The number of drawn boxes is not a risk score. Q-15 records the actual code, privilege boundaries,
authentication, framing, replay refusal, native handle/memory lifetime, overlapped I/O or bounded
blocking, cancellation, restart/recovery, dependencies, diagnostics, build/update ownership and raw
results. The fallback is not allowed merely because a team prefers C++; it requires a reproduced
direct-FFI blocker and becomes an additional measured/supported component.

## 4. Predecessor and affected records

| Record | Before / SHA-256 | After | Treatment |
|---|---|---|---|
| Client/UI research | `IE-RES-TECH-CLIENT-20260914-001@0.2`; `29EC4980B7555BA391B3EC15F400C9FA65830699642DE3CEFC6149225237083D` | `@0.3` | Correct Option A evidence boundary and make the Flutter IPC PoC direct-FFI-first. |
| Technology matrix | `IE-KNW-TECH-DEC-001@0.4`; `47755FD1FBE42847E8613780F120E3A35787C80FBED206D1EBFC73F83D49B714` | `@0.5` | Make A the provisional control; correct Q-08/Q-10 and Q-15 IPC lane. |
| TECH-001 | `@0.12`; `9CF823287CB494F266302FDC5ED269D89A3EE9CEBC42C1AC79FA3D0F0B00357F` | `@0.13` | Present the corrected meaning and qualification topology for management review. |
| DOC-07 | `@0.9`; `3718D592A7F01092578CFD2255DD0BE47D77DF241878E26DD0DE8459A1171607` | `@0.10` | Routing-only update; schedule, 56 tasks, 756 hours, requirements and gate states unchanged. |
| Predecessor change record | `IE-CHG-TECH-CLIENT-001@0.1`; `0D5E211EBF3B5C2BC050E8B96A52D1C10F655B486141ABDE265448FBEFB6C6C1` | retained | Immutable history; its validator `NOT-RUN` remains factually correct. |
| Product requirements, Feature, Spec, DOC-01…06/08, DDM, accepted ADRs, VVP and PG state | Current controlled baselines | unchanged | No scope, behavior, architecture invariant, validation rule, review or gate result change. |

## 5. Product and architecture non-impact

- **No Product Scope Change.** No FTR, REQ, Feature, Spec, DDM capability semantic or product gate changed.
- Server recommendation remains Ubuntu Server 26.04 + Java 25/Temurin 25 + Spring Boot/Modulith +
  PostgreSQL. Java/.NET Server, PostgreSQL/SQL Server and modular-monolith/microservice decisions were
  not reopened.
- DOC-05, DOC-06, DOC-08, all diagram sources and accepted ADR meaning remain unchanged.
- Workspace remains a separate per-user `.NET` process. Flutter direct FFI is only a proposed client
  implementation lane for the existing authenticated, versioned, scope-bound named-pipe contract.
- Product Decision Authority acceptance, Q-01…Q-15, PG3 and PG4 remain `NOT-RUN`.

## 6. Verification record

| Check | Result | Evidence |
|---|---|---|
| Focused source coverage, local-link, metadata and diff review | `PASS` | Eight controlled files present; 275 local Markdown links resolved; 16/16 research questions and six A–F matrix dispositions present; successor versions/predecessors cross-linked; no DOC-05/06/08 diff and no unrelated tracked file in the correction scope. |
| Repository/diagram validators | `NOT-RUN` | Direct user execution override prohibited running verifier scripts in this task; no PASS claim and no GitHub status-check evidence. |
| Client Q-15 PoC | `NOT-RUN` | No implementation, seam measurement or runtime benchmark was executed. |
| Remote `main` push and SHA | `NOT-RUN` | No push is implied by authoring this record. |
