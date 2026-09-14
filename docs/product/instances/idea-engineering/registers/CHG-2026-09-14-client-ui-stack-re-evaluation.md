# Client/UI Stack Technology Re-evaluation — Change Record

## Control envelope

| Field | Recorded value |
|---|---|
| Stable Supporting Record ID | `IE-CHG-TECH-CLIENT-001` |
| Supporting class / version | `CHG` / `Draft 0.1` |
| Date | 14-09-2026 |
| Owner / internal reviewer | Principal Product Author prepares; internal review of the successor recommendation `NOT-RUN` |
| Approver | Product Decision Authority for Tech; review/acceptance `NOT-RUN` |
| Repository process authority / instruction state | `NOT-APPLICABLE` / `NOT-APPLICABLE` |
| Applicable baseline | `IDEA-C1-ANALYSIS-DESIGN-001`; starting `origin/main` `30ecb802bf414df33dd076bfdc83652f7d3aa67a`; DOC-05@0.20, DOC-07@0.8, `IE-KNW-TECH-DEC-001@0.3`, `TECH-001@0.11`, `IE-RES-TECH-CLIENT-20260914-001@0.1` |
| Final controlled source set | `IE-RES-TECH-CLIENT-20260914-001@0.2`, `IE-KNW-TECH-DEC-001@0.4`, `TECH-001@0.12`, DOC-07@0.9 routing; DOC-01…06/08, GOV/VVP, ADR and diagram semantics unchanged |
| Evidence class | Fresh first-party technology facts + bounded `IDEA-INFERENCE`; no runtime benchmark, Product requirement, approval or gate evidence |
| Source / upstream trace | [Client/UI research](../../../../research/2026-09-14-flutter-client-ui-stack-evidence.md), [technology synthesis](../../../../research/2026-09-13-technology-selection-evidence-synthesis.md), [DOC-05](../DOC-05-architecture-description.md), [DOC-08](../DOC-08-ui-ux-and-interaction-specification.md), current SRS and accepted ADRs |
| Downstream trace | [technology matrix](../../../knowledge/2026-09-13-core-v0-technology-decision-matrix.md), [TECH-001](../decision-briefs/TECH-001-technology-and-architecture-proposal.md), [DOC-07](../DOC-07-mvp-roadmap-and-delivery-plan.md), [catalogue](../README.md), [version history](../decision-briefs/VERSION-HISTORY.md), future Q-15 evidence |
| Product normativity | `INFORMATIVE`; no FTR/REQ/product behavior created or changed |
| Supersedes / Superseded by | Successor Tech-change record to `IE-CHG-TECH-LINUX-002@0.1`; that record remains immutable historical provenance. Superseded by `NOT-APPLICABLE`. |
| Access / retention | `INTERNAL`; retain with predecessor hashes and later qualification/decision records |
| Effective date / review trigger | Effective product decision `NOT-APPLICABLE`; revisit on PDA disposition, Q-10/Q-11/Q-15 evidence, Client platform policy change or approved cross-platform roadmap expansion |
| Change status | Engineering recommendation refreshed; Product Decision Authority, Q-01…Q-15 and PG3/PG4 `NOT-RUN`; remote push/SHA reported operationally after execution |

## 1. Change decision

The controlled Client/UI recommendation is:

> **KEEP CURRENT BASELINE, BUT FLUTTER REMAINS QUALIFICATION CHALLENGER.**

Option A—React Web plus a narrow WPF/WebView2 installed shell and separate per-user `.NET
Workspace`—remains the Core v0 engineering recommendation. This is not protection of an old choice:
the successor matrix compares it with Flutter Web/Windows, React Browser-only, Electron, Tauri and
WinUI 3 across the required product, security, operations and lifecycle criteria.

Flutter is not rejected. It is an explicit `ALTERNATIVE` + `QUALIFICATION REQUIRED` candidate in
Q-15. Product Decision Authority review and every product-specific qualification remain `NOT-RUN`.

## 2. Candidate disposition

| Option | Candidate | Successor disposition |
|---|---|---|
| A | React + WPF + WebView2 + `.NET Workspace` | `SELECT`; `QUALIFICATION REQUIRED` |
| B | Flutter Web + Flutter Windows + `.NET Workspace` | `ALTERNATIVE`; `QUALIFICATION REQUIRED` challenger |
| C | React Browser + `.NET Workspace` | `CONDITIONAL`; `FOLLOW-UP PRODUCT DECISION REQUIRED` |
| D | React + Electron + `.NET Workspace` | `REJECT FOR CORE V0` |
| E | React + Tauri + `.NET Workspace` | `ALTERNATIVE`; `QUALIFICATION REQUIRED` |
| F | WinUI 3 + WebView2 + `.NET Workspace` | `ALTERNATIVE`; `QUALIFICATION REQUIRED` |

## 3. Reason and reconsideration boundary

Option A currently has fewer unowned seams against the approved candidate architecture: React serves
the Browser and is reused inside WebView2; WPF stays a narrow shell; `.NET` supplies the current
Workspace and same-user named-pipe path. WPF is not product authority and must not become a second
business UI.

Flutter's one-presentation-language advantage is real, but it does not remove the `.NET Workspace`.
The exact IDEA result for data-heavy grid/tree, browser behavior, Web/Windows accessibility,
EN/VI/JA IME, multi-window/monitor/DPI, external-process authenticated IPC, native CAD/Office flow,
signed update/rollback and long-lived dependency ownership is unknown. No popularity claim or
generic benchmark decides the comparison.

Reopen Flutter selection when an approved roadmap adds first-class Android/iOS or macOS/Linux
clients, the selected WPF/WebView2 path fails a mandatory Q-10/Q-11 gate, company policy makes it
untenable, or Flutter passes Q-15 on the identical slice with every mandatory gate and lower
management-accepted total lifecycle risk.

## 4. Predecessor and affected records

| Record | Before / SHA-256 | After | Treatment |
|---|---|---|---|
| Client/UI research | `IE-RES-TECH-CLIENT-20260914-001@0.1`; `B6CF568DC397408B438BAAE5AFD98BF45965EE470B3FFEEF0E24BEB06106E196` | `@0.2` | Complete the 16-question Flutter/Dart evidence and explicit six-candidate architecture challenge; research remains informative. |
| Technology matrix | `IE-KNW-TECH-DEC-001@0.3`; `DC7B371104DDAFCA312E5612A8483C29D3197D99B40A3AFA3840A45978078698` | `@0.4` | Add Client Decision Matrix, steelman arguments, recommendation/reopen triggers and Q-15 measurable PoC envelope. |
| TECH-001 | `@0.11`; `C60C3497CC32D10744DEFF0AD01A5D30341944C635DFD7DF3564790629BB241C` | `@0.12` | Present the same Client/UI recommendation for management review and refresh current source pins. |
| DOC-07 | `@0.8`; `B4C417DC78310071D76EF63622BD1A04A700C5FEAE39B610ACF353F881006648` | `@0.9` | Routing-only update to current Tech/matrix and Q-15; schedule, 56 tasks, 756 hours, requirements and gate states unchanged. |
| Product requirements, Feature, Spec, DOC-01…06/08, DDM, accepted ADRs, VVP and PG state | Current controlled baselines | unchanged | No scope, behavior, architecture invariant, validation rule, review or gate result change. |

## 5. Qualification boundary

Q-15 compares A and B using the same Server/API, `.NET Workspace`, managed machine/browser images,
data/locale fixture and frozen acceptance envelope. It covers Login → Search → Document Browser →
Document Detail → Checkout → Open/Workspace interaction → Check-in status, including grid/tree,
keyboard, EN/VI/JA IME, accessibility, native dialog/process launch, authenticated IPC,
multi-window/DPI, startup/memory/render responsiveness, installer/update/rollback and hostile cases.

The matrix proposes measurable thresholds. They remain experiment proposals until named owners accept
them; no threshold or candidate has passed. A failure is evidence about the tested build and fixture,
not a universal claim about React, WPF, Flutter or Dart.

## 6. Product and architecture non-impact

- **No Product Scope Change.** No FTR, REQ, Feature, Spec, DDM capability semantic or product gate changed.
- Server recommendation remains Ubuntu Server 26.04 + Java 25/Temurin 25 + Spring Boot/Modulith +
  PostgreSQL. Java/.NET Server, PostgreSQL/SQL Server and modular-monolith/microservice decisions were
  not reopened.
- No DOC-05, DOC-06 or DOC-08 semantic or diagram source changed. Artifact Custody, Transaction
  Coordinator, server-established ActorContext, owner-specific authority, shared relational UoW,
  `Store → Server → Workspace`, Representation acceptance and Restricted Recovery Mode remain.
- Reservation remains `Active → Ended / Expired / Recovered`; `Released` remains Business Revision terminology.
- Product Decision Authority acceptance, Q-01…Q-15, PG3 and PG4 remain `NOT-RUN`.

## 7. Verification record

| Check | Result | Evidence |
|---|---|---|
| Focused source coverage, local-link, metadata and diff review | `PASS` — focused non-validator check | 16/16 Flutter questions, six A–F dispositions and all four required architecture challenges present; 273 local Markdown file links across the eight controlled files resolve; no DOC-05/DOC-06/DOC-08 diff. |
| Repository/diagram validators | `NOT-RUN` | Not executed under the user's explicit verifier instruction; no PASS claim. |
| Client Q-15 PoC | `NOT-RUN` | No implementation or runtime benchmark was executed. |
| Remote `main` push and SHA | `NOT-RUN` at authoring time | Confirm after one focused commit. |
