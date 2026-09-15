# Technology Architecture View Semantic Correction — Change Record

## Control envelope

| Field | Recorded value |
|---|---|
| Stable Supporting Record ID | `IE-CHG-TECH-VIEW-CORR-001` |
| Supporting class / version / status | `CHG` / `0.1` / `Draft` |
| Date | 2026-09-15 |
| Owner / author | Principal Product Author / Principal Product Author |
| Reviewer | Independent technology/architecture reviewer; review `NOT-RUN` |
| Acceptance authority | Product Decision Authority; review/acceptance `NOT-RUN` |
| Repository process authority / instruction state | `NOT-APPLICABLE` / `NOT-APPLICABLE` |
| Applicable baseline | `origin/main` commit `96164e2018c7d34a203d1e0aff0b2b483b924fcf` |
| Predecessor | `IE-ARC-TECH-VIEW-001@0.1`, renderer-recorded source SHA-256 `48B0F3E7D3197A14AFD97C4E35F620DBAC80F210F768C2F8B4E87AA63F5D6C6D`; `IE-CHG-TECH-BASELINE-001@0.1` at the applicable Git baseline |
| Successor | `IE-ARC-TECH-VIEW-001@0.2`; `IE-CHG-TECH-BASELINE-001@0.2`; `IE-VEV-TECH-VIEW-002@0.1` |
| Source / upstream trace | [`IE-STD-TECH-STACK-001@0.1`](../../../../agents/technology-stack-documentation-standard.md), [technology matrix](../../../knowledge/2026-09-13-core-v0-technology-decision-matrix.md), [`TECH-001@0.14`](../decision-briefs/TECH-001-technology-and-architecture-proposal.md), [predecessor VEV](VEV-2026-09-15-technology-architecture-view-set.md) |
| Downstream trace | [Corrected technology view set](../technology/IDEA-core-v0-technology-architecture-views.md), [successor verification](VEV-2026-09-15-technology-architecture-view-correction.md), instance catalogue |
| Change record | This `CHG` is the controlling correction record; no separate Work Item was assigned |
| Supersedes / superseded by | `NOT-APPLICABLE` / `NOT-APPLICABLE` |
| Product normativity | `INFORMATIVE`; no Product Feature, Requirement, behavior or scope is created or changed |
| Classification / retention | `INTERNAL`; retain with predecessor Git state and both evidence packages |
| Review trigger | A Worker boundary/profile/toolchain disposition, Client/Server reopen rule, selected baseline or affected source version changes |
| Evidence status | Corrected source and rendered evidence recorded by `IE-VEV-TECH-VIEW-002`; architecture approval and Worker qualification `NOT-RUN` |
| Change status | Focused semantic correction authored in `Draft`; Product Decision Authority approval and PG3/PG4 remain `NOT-RUN` |

## 1. Corrections

| Issue | Previous implication | Controlled correction |
|---|---|---|
| `TECH-D07` Worker build | The `.NET 10` lane appeared to build WPF, Workspace and Worker binaries. | `dotnet build/publish` now ends at WPF + Workspace. The Worker boundary and exact Format Adapter profile contract are selected; concrete profile values plus its separate build/runtime/toolchain remain qualification-dependent and `NOT-RUN`. |
| `TECH-D08` reopen result | A Client or Server trigger appeared to return automatically to the existing selected baseline. | Each trigger now enters a Successor Decision with two explicit outcomes: retain the current baseline or select the corresponding qualified alternative. |
| Format Worker disposition wording | `IE-CHG-TECH-BASELINE-001@0.1` called the Windows Format Worker “conditional”, conflicting with the selected Matrix/TECH row. | The Worker boundary and exact CAD/Office/Format Adapter profile contract are `SELECT`; deployment/use occurs only when that profile requires it. Concrete profile values and exact runtime/toolchain qualification remain `NOT-RUN`. |

## 2. Explicit non-impact

- The Core v0 Technology Stack selection is unchanged.
- `IE-KNW-TECH-DEC-001@0.6` and `TECH-001@0.14` are unchanged because both already record the
  Format Worker disposition correctly as `SELECT`.
- Q-15 remains `PARTIAL / NO WINNER`.
- Product Scope, Feature, Spec, FTR and REQ are unchanged.
- Product Decision Authority approval remains `NOT-RUN`.
- PG3 and PG4 remain unchanged and `NOT-RUN`.
- No new technology research, Worker toolchain selection or runtime qualification was performed.

## 3. Verification

[`IE-VEV-TECH-VIEW-002@0.1`](VEV-2026-09-15-technology-architecture-view-correction.md)
records the new source hash, 8/8 Mermaid renders, 8/8 standalone SVG opens and focused visual review
of TECH-D07 and TECH-D08. Render success does not approve the architecture or qualify an
implementation.
