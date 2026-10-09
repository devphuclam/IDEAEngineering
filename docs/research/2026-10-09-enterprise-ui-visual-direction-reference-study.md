# Enterprise UI visual direction — bounded reference study

| Control | Value |
|---|---|
| Stable ID / class | `IE-RES-UI-VISUAL-20261009` / research note |
| Version / status | `0.2` / `Draft` |
| Product normativity / use | `INFORMATIVE` / `REFERENCE-ONLY` |
| Process instruction | `NOT-APPLICABLE`; this note creates no execution gate |
| Owner / author | Product Decision Authority / repository research worker; named attribution `UNKNOWN` |
| Reviewer / acceptance | User liked the visual concept in conversation on 2026-10-09 and authorized publication; formal product/runtime acceptance `NOT-RUN` |
| Baseline | Inspected UI source `77031ed33ffc29ac2eda08d69948685ff5c5e1c1` |
| Evidence date | 2026-10-09; official live documentation, publication/revision identity `UNKNOWN` |
| Classification / retention | `INTERNAL`; retain as reference provenance for subsequent visual decisions |
| Upstream / downstream | [Inspected UI Kit direction at the source pin](https://github.com/devphuclam/IDEAEngineering/blob/77031ed33ffc29ac2eda08d69948685ff5c5e1c1/apps/web/src/ui/README.md); [visual concept handoff](../../prototypes/iam-visual-concept.md) |
| Change / supersession | Initial bounded study `0.1` retained in this conversation's work; `0.2` records subsequent visual preference and publication authorization without changing source observations |
| Review trigger | Intended reuse, changed source guidance, or approved visual direction |
| Evidence status | Official documented guidance; no IDEA runtime or usability qualification |

## Purpose and tailoring

Learn how established enterprise systems organize productive interfaces before proposing an IDEA visual upgrade.
This is not a replacement product vision, component-library selection, or implementation authorization.
The control envelope is tailored under the [authoring standard](../agents/product-document-authoring-standard.md), using its ISO/IEC/IEEE 15289:2019 `STANDARD-GUIDED` information-item discipline; no conformity claim is made.

## Primary-source observations

1. **Typography has roles, not just sizes.** Fluent distinguishes body, caption, subtitle and title styles. Its Web body example is 14px/20px, while 10px is a caption role. Native system fonts are supported, so a new downloaded font is not necessary to establish a credible hierarchy. [Microsoft Fluent 2 typography](https://fluent2.microsoft.design/typography)

2. **Spacing explains relationships.** Fluent uses proximity, alignment and a flexible four-pixel spacing ramp to distinguish groups and importance. Its guidance warns that overly dense information can overwhelm; the ramp serves composition rather than mechanically prescribing every gap. [Microsoft Fluent 2 layout](https://fluent2.microsoft.design/layout)

3. **Surface hierarchy and semantic color are different tools.** Fluent uses neutral surfaces to establish focus, reserves semantic color for meaningful status and feedback, and discourages oversized brand-color surfaces that obscure hierarchy. Color is not a substitute for additional status indicators. [Microsoft Fluent 2 color](https://fluent2.microsoft.design/color)

4. **Density is a deliberate table profile.** Carbon documents 24px extra-small, 32px small and 40px default medium rows for different workloads. Headers, toolbars and associated controls use compatible sizing rather than independent compression. These are Carbon examples, not adopted IDEA dimensions. [IBM Carbon data-table sizing](https://www.carbondesignsystem.com/building-blocks/core/components/data-table/guidelines)

5. **Dense data needs width and action hierarchy.** Carbon places tables in the main content area, discourages cramped containers and unnecessary truncation, and separates global table actions from row actions. Its toolbar guidance limits visible actions and provides overflow for extras. [IBM Carbon data-table placement and toolbar](https://www.carbondesignsystem.com/building-blocks/core/components/data-table/guidelines)

6. **Voice stays recognizable; tone responds to the situation.** Atlassian varies tone with user confidence, uncertainty, stress and success. It prioritizes clear, accurate, concise guidance; playful expression is conditional, not appropriate everywhere. Its own personality traits are not being adopted for IDEA. [Atlassian voice and tone](https://atlassian.design/guidelines/brand/personality/)

## IDEA interpretations — recommendations, not decisions

- Keep the productive workbench objective: readable repeated tasks, data scanning and consequence comprehension. Marketing hero typography, decorative gradients, animated spectacle and card-heavy layouts are not a default solution for this workload.
- Try a small semantic typography ladder on one real page. Give ordinary labels, body content and table cells readable priority; reserve smaller text for secondary metadata. Fluent's numbers are comparison material, not an automatic migration rule.
- Make comfortable and compact modes differ mainly through spacing and row/control heights; avoid treating compact as a request to shrink every word. Check whole-page rhythm, not isolated tokens.
- Establish distinct canvas, working surface and selected/detail surface using restrained neutrals. Use one controlled accent for focus/action; preserve truthful error, refusal, warning and success semantics.
- Preserve the current component and security architecture. Adjust composition, proportions, typography, icon consistency and copy within it before considering any new library, font or dependency.
- Translate technical copy for the person's task while preserving exact role/version/scope semantics. A security refusal needs a plain explanation and safe next step, not humor or apparent success.

The existing label “Nordic Functionalist + Technical Precision” and token inventory are a starting vocabulary.
They do not independently demonstrate quality: proportions, readable hierarchy, content, repeated patterns and real-page composition still need visual judgment.

## Visual preference successor — 2026-10-09

The initial study left personality, density and comparison-page choices open. Subsequent user
conversation approved one isolated Roles & Permissions concept, then confirmed “Tôi thấy được đấy”
after seeing it. This is visual preference feedback, not acceptance of product behavior.

| Topic | Direction for the visual concept |
|---|---|
| Personality | Modern, calm, precise, with recognizable IDEA character |
| Brand | Existing unmodified IDEA logo as the brand anchor; neutral surfaces and restrained blue interaction accent |
| Density and theme | Comfortable/light default; compact spacing and dark-mode alternatives |
| First comparison page | Roles & Permissions; synthetic data, independent of the actual application |
| Further implementation | Preserve current API, authority and security behavior; application UI Kit migration is separate future work |

For context, the original study questions were:

| Question | Unresolved decision |
|---|---|
| Personality | Which traits should dominate, and which visual/wording behaviors should be avoided? |
| Visual reference | Which actual product screen feels right, and which aspects—not the whole brand—are preferred? |
| Density and theme | Daily comfortable baseline, compact specialist use, and initial light/dark priority |
| First comparison page | Account, Role catalogue, or another currently implemented screen |
| Visual acceptance | Preferred direction evaluated at actual working size; no aesthetic preference inferred from a style name |

## Limits and checks

- The sources describe their publishers' systems. They do not prove IDEA users prefer those systems or create IDEA requirements.
- No third-party code, prose, illustration, icon, font or component library was imported. No package or asset was downloaded; reuse would require separate intake.
- Documentation is live and unversioned here; exact publisher revision and content checksum remain `UNKNOWN`.
- The UI inspection pin is from an unmerged UI branch, not the publication's `main` baseline. The publication does not include that branch's application changes.
- The concept was rendered in the in-app browser and visually inspected; the user supplied positive visual feedback. This is not application/browser qualification or accessibility conformance evidence; the complete interaction check was not executed.
- Document local-link existence and whitespace: `PASS` after the bounded checks recorded with this publication.
- Application/runtime tests, browser qualification and verifier: `NOT-RUN`.
