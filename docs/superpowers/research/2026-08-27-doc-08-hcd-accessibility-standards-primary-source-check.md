# DOC-08 Human-centred Design and Accessibility Baseline — Primary-source Check

| Field | Value |
|---|---|
| Document ID | `IE-RES-DOC08-STD-001` |
| Document purpose | Verify the current editions and public status of candidate human-centred design, usability, interaction and accessibility sources, then recommend a lean standards-guided baseline for `DOC-08` |
| Evidence cut-off | 2026-08-27 |
| System of interest | `C1 — IDEA Engineering` |
| Planned surfaces considered | IDEA Web and native IDEA Desktop; web-rendered content embedded in Desktop remains a Web surface for the rendered portion |
| Source policy | ISO catalogue; W3C Recommendations; ETSI publications/work programme; European Commission and EUR-Lex only |
| Content policy | Public metadata and short paraphrases only; no reproduction of protected normative clauses |
| Conformity position | Research record and project recommendation only; no conformity, compliance, legal or certification claim |

## 1. Reading rules and limitations

This note distinguishes:

- **Source fact** — title, edition, publication state, date, lifecycle state or high-level scope supported by the linked publisher page.
- **Project recommendation** — a proposed IDEA Engineering classification or working rule derived from those facts. It is not a statement by the publisher and is not yet an approved project baseline.

The ISO catalogue pages are enough to select editions and understand public scope, but not to perform clause-level tailoring. Applying protected ISO publications beyond public metadata requires lawful access to the exact normative text. W3C Recommendations and ETSI publications are publicly readable, but their availability does not by itself establish that IDEA conforms to them.

`STANDARD-GUIDED`, `STANDARD-GUIDED, CONDITIONAL` and `REFERENCE/WATCH` below have the meanings already defined by [`IE-GOV-STD-001`](../../governance/standards-register.md). A conditional technical source becomes relevant only when its named surface exists. A conditional regulatory or procurement source also requires an explicit applicability decision; this research note does not supply legal advice.

## 2. Recommended decision

The lean set is four cross-surface ISO publications plus WCAG for Web. WAI-ARIA remains technology-conditional. EN 301 549, ISO/IEC 40500 and ISO/IEC 29138-1 remain reference/watch items until their respective activation or revision triggers occur.

| Candidate | Current official item at cut-off | Proposed IDEA disposition | Decision rationale |
|---|---|---|---|
| Human-centred design | [`ISO 9241-210:2019`](https://www.iso.org/standard/77520.html), Edition 2; confirmed in 2025 | `STANDARD-GUIDED` — core | Process backbone for planning and carrying out human-centred design across the interactive-system life cycle |
| Usability | [`ISO 9241-11:2018`](https://www.iso.org/standard/63500.html), Edition 2; confirmed in 2023 | `STANDARD-GUIDED` — core | Defines the usability outcome and context concepts needed to make usability objectives and evaluation evidence meaningful |
| Interaction principles | [`ISO 9241-110:2020`](https://www.iso.org/standard/75258.html), Edition 2; confirmed in 2025 | `STANDARD-GUIDED` — core | Technology-independent interaction principles for requirements, design and evaluation across Web and Desktop |
| Software accessibility | [`ISO 9241-171:2025`](https://www.iso.org/standard/86308.html), Edition 2; published 2025-12 | `STANDARD-GUIDED` — core | Current cross-surface software-accessibility source covering Web, mobile, office and other interactive software; it replaced the 2008 edition |
| Web accessibility | [`WCAG 2.2`](https://www.w3.org/TR/2024/REC-WCAG22-20241212/), W3C Recommendation 2024-12-12 | `STANDARD-GUIDED, CONDITIONAL` — core for Web | Public, testable, technology-independent Web-content success criteria; use A and AA as the planned coverage target for controlled IDEA Web scope |
| ISO designation for WCAG | [`ISO/IEC 40500:2025`](https://www.iso.org/standard/91029.html), Edition 2 | `REFERENCE/WATCH` | Avoid a duplicate operational baseline: use the W3C Recommendation directly; activate the ISO designation only for an approved contractual/interoperability need. ISO already marks the 2025 publication for revision |
| Accessibility-needs inventory | [`ISO/IEC 29138-1:2018`](https://www.iso.org/standard/71953.html), Edition 1 | `REFERENCE/WATCH` | Useful discovery aid, but it does not provide requirements or an evaluation process, and ISO moved it to revision on 2026-08-26 |
| Web semantics | [`WAI-ARIA 1.2`](https://www.w3.org/TR/2023/REC-wai-aria-1.2-20230606/), W3C Recommendation 2023-06-06 | `STANDARD-GUIDED, CONDITIONAL` | Apply to custom Web widgets or structures when native host-language semantics are insufficient; do not use it as a replacement for semantic HTML or as a substitute for WCAG |
| European ICT accessibility | [`EN 301 549 V3.2.1 (2021-03)`](https://www.etsi.org/deliver/etsi_en/301500_301599/301549/03.02.01_60/en_301549v030201p.pdf) | `REFERENCE/WATCH` | No applicable EU/procurement scope is yet baselined and V4.1.0 is awaiting publication. Promote the exact then-applicable edition to `STANDARD-GUIDED, CONDITIONAL` only through an approved scope/change decision |

Explicit exclusions from a new baseline:

- `ISO 9241-171:2008` is withdrawn and replaced by the 2025 edition.
- `ISO/IEC 40500:2012` represented WCAG 2.0 and is withdrawn; it must not be used as the current Web baseline.
- WAI-ARIA 1.3 and EN 301 549 V4.1.0 are not published final baselines at the evidence cut-off.

## 3. Primary-source findings

### 3.1 Human-centred design, usability and interaction

#### ISO 9241-210:2019

**Source fact**

- Exact title: *Ergonomics of human-system interaction — Part 210: Human-centred design for interactive systems*.
- Edition 2, published 2019-07; ISO reports stage 90.93 and confirmation on 2025-05-22.
- The public scope covers requirements and recommendations for human-centred design principles and activities throughout the life cycle of computer-based interactive systems. It supplies a process framework, not detailed coverage of every HCD method or all project-management concerns.
- Official source: [ISO catalogue](https://www.iso.org/standard/77520.html).

**Project recommendation**

Use it to govern how `DOC-08` is produced and iterated: context-of-use research, user requirements, design exploration, evaluation and iteration must leave controlled evidence. Do not turn the standard into a one-time UI checklist.

#### ISO 9241-11:2018

**Source fact**

- Exact title: *Ergonomics of human-system interaction — Part 11: Usability: Definitions and concepts*.
- Edition 2, published 2018-03; ISO reports stage 90.93 and confirmation on 2023-10-30.
- The publication frames usability as an outcome of use and defines concepts for applying usability to systems, products and services. Its public scope explicitly says it does not prescribe a design or evaluation process.
- Official source: [ISO catalogue](https://www.iso.org/standard/63500.html).

**Project recommendation**

Use it to ensure every usability objective in `DOC-04`/`DOC-08` identifies the relevant users, goals or tasks, context and measurable outcome. `ISO 9241-210` supplies the process; `ISO 9241-11` supplies the outcome model.

#### ISO 9241-110:2020

**Source fact**

- Exact title: *Ergonomics of human-system interaction — Part 110: Interaction principles*.
- Edition 2, published 2020-05; ISO reports stage 90.93 and confirmation on 2025-10-30.
- The public scope provides technology-independent interaction principles and general design recommendations for analysts, UI designers, developers, evaluators and buyers. It does not prescribe aesthetics, branding or domain-specific interaction rules.
- Official source: [ISO catalogue](https://www.iso.org/standard/75258.html).

**Project recommendation**

Use the lawfully accessed principles as the controlled review lens for task flows, system feedback, control, learnability, user-error handling and expectation consistency. Record decisions and deviations; do not copy protected clause text into the repository.

### 3.2 Cross-surface software accessibility

#### ISO 9241-171:2025

**Source fact**

- Exact title: *Ergonomics of human-system interaction — Part 171: Software accessibility*.
- Edition 2, published 2025-12 at stage 60.60; it replaced and withdrew `ISO 9241-171:2008`.
- Its public scope specifies requirements and gives guidance for accessible software across a broad range of physical, sensory and cognitive abilities. It explicitly spans examples including mobile, office and Web software and complements `ISO 9241-11` and `ISO 9241-210`.
- It covers software working with assistive technology but does not specify assistive-technology behaviour itself.
- Official source: [ISO catalogue](https://www.iso.org/standard/86308.html).

**Project recommendation**

This is the core accessibility source for the whole IDEA interactive system, including native Desktop. WCAG must not be treated as sufficient coverage for a native Desktop application merely because some concepts appear transferable.

#### ISO/IEC 29138-1:2018 and its revision

**Source fact**

- Exact title: *Information technology — User interface accessibility — Part 1: User accessibility needs*.
- Edition 1, published 2018-11. ISO confirmed it in 2024, then moved it to stage 90.92, “to be revised,” on 2026-08-26.
- The public scope identifies accessibility needs that diverse users can have in different contexts. It expressly does not provide requirements, processes or evaluation methods and is not designed for certification, regulation or contractual use.
- The replacement project, [`ISO/IEC AWI 29138-1`](https://www.iso.org/standard/95214.html), Edition 2, was approved on 2026-08-26 at stage 10.99; it is not a published replacement.
- Official sources: [published 2018 edition](https://www.iso.org/standard/71953.html); [Edition 2 AWI](https://www.iso.org/standard/95214.html).

**Project recommendation**

Consult the 2018 needs inventory during discovery where useful, with source attribution, but do not make it a separate baseline obligation while its replacement has only just begun. Reassess when Edition 2 is published.

### 3.3 Web accessibility and semantics

#### W3C WCAG 2.2

**Source fact**

- The current dated publication is *Web Content Accessibility Guidelines (WCAG) 2.2*, W3C Recommendation 2024-12-12. The stable latest-version URI resolves to that Recommendation.
- WCAG 2.2 supplies testable, technology-independent Web-content success criteria. It covers Web content across device types, while acknowledging that it does not address every accessibility need.
- W3C states that WCAG 2.2 extends 2.1, that content conforming to 2.2 also conforms to 2.0 and 2.1, and that WCAG 2.2 removed success criterion 4.1.1. Formal obligations pinned to earlier versions may therefore still need separate reporting for that criterion.
- Official sources: [dated Recommendation](https://www.w3.org/TR/2024/REC-WCAG22-20241212/); [stable latest-version URI](https://www.w3.org/TR/WCAG22/); [publication history](https://www.w3.org/standards/history/WCAG22/).

**Project recommendation**

For an IDEA Web surface, map every applicable Level A and AA success criterion to a requirement, design response and verification result. Consider Level AAA criteria only from user need, context and risk; do not set a blanket AAA target. Do not claim WCAG conformance until the exact scope, complete pages/processes, accessibility-supported technologies, non-interference conditions and evidence have been assessed against the Recommendation's conformance section.

#### ISO/IEC 40500:2025

**Source fact**

- Exact title: *Information technology — W3C Web Content Accessibility Guidelines (WCAG) 2.2*.
- Edition 2, published 2025-09. The 2012 WCAG 2.0 edition is withdrawn.
- ISO currently marks Edition 2 at stage 90.92 and says it is expected to be replaced by [`ISO/IEC DIS 40500`](https://www.iso.org/standard/94018.html), currently under development, within the coming months.
- Official source: [ISO catalogue](https://www.iso.org/standard/91029.html).

**Project recommendation**

Keep the ISO designation as a compatibility and contract watch entry. Operationally baseline one WCAG source, the exact W3C Recommendation, instead of creating two mappings for the same WCAG 2.2 subject. If a customer or authority requires the ISO designation, open a change record and assess the then-current ISO edition before activation.

#### WAI-ARIA 1.2

**Source fact**

- *Accessible Rich Internet Applications (WAI-ARIA) 1.2* is a W3C Recommendation dated 2023-06-06.
- It defines roles, states and properties used to convey custom Web UI semantics and behaviour to assistive technologies.
- W3C says WAI-ARIA supplements native host-language semantics rather than replacing them; authors should use the native feature when it provides equivalent accessibility.
- [`WAI-ARIA 1.3`](https://www.w3.org/TR/2026/WD-wai-aria-1.3-20260604/) is a Working Draft dated 2026-06-04, not the current Recommendation.
- Official sources: [WAI-ARIA 1.2 dated Recommendation](https://www.w3.org/TR/2023/REC-wai-aria-1.2-20230606/); [WAI-ARIA 1.3 Working Draft](https://www.w3.org/TR/2026/WD-wai-aria-1.3-20260604/).

**Project recommendation**

Activate WAI-ARIA 1.2 only for Web components that need semantics unavailable from the native host language. Require semantic HTML first, version-pinned ARIA validation and assistive-technology/keyboard testing. ARIA correctness alone neither satisfies WCAG nor proves a component is usable.

### 3.4 EN 301 549 and European applicability

**Source fact**

- The latest published item remains *EN 301 549 V3.2.1 (2021-03) — Accessibility requirements for ICT products and services*. Its clauses cover more than Web content, including other ICT and software concerns, and its Web requirements are based on WCAG 2.1.
- The European Commission identifies V3.2.1 as the latest version harmonised for Directive (EU) 2016/2102 on public-sector websites and mobile applications. It also explains that a particular version gains the relevant EU legal effect only when its reference is published in the Official Journal, and that WCAG 2.2 is not automatically substituted into the V3.2.1 mapping.
- ETSI's current project page still labels V3.2.1 the latest published version. The V4.1.0 revision work item, associated with standardisation request M/587 and Directives 2016/2102/EU and 2019/882, reached “final deliverable adopted for publication” on 2026-08-24. Its public document is still labelled “Final draft” and “On Approval.” At the evidence cut-off it was not yet listed by ETSI as the latest published version and no Official Journal reference was shown for it.
- Official sources: [published V3.2.1](https://www.etsi.org/deliver/etsi_en/301500_301599/301549/03.02.01_60/en_301549v030201p.pdf); [V4.1.0 final draft](https://www.etsi.org/deliver/etsi_en/301500_301599/301549/04.01.00_30/en_301549v040100va.pdf); [ETSI project status](https://labs.etsi.org/rep/HF/en301549); [ETSI V4.1.0 work item](https://portal.etsi.org/webapp/WorkProgram/Report_WorkItem.asp?SearchPage=TRUE&WKI_ID=64282); [European Commission harmonisation explanation](https://digital-strategy.ec.europa.eu/en/policies/web-accessibility-directive-standards-and-harmonisation); [Commission Implementing Decision (EU) 2021/1339](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32021D1339).

**Project recommendation**

Do not make EN 301 549 the unconditional IDEA product baseline. Activate the exact applicable version only after product market, customer, procurement and legal scope are known. If V3.2.1 is activated before a later version is both published and applicable, retain its additional ICT requirements and WCAG 2.1 mapping; a WCAG 2.2 project target alone must not be reported as EN 301 549 or EU legal conformity.

## 4. Lean DOC-08 operating model

The sources have distinct jobs and should not be collapsed into one checklist:

| Layer | Controlling source | Required IDEA use |
|---|---|---|
| HCD process | `ISO 9241-210:2019` | Plan and evidence context research, user requirements, design alternatives, evaluation and iteration |
| Usability outcome | `ISO 9241-11:2018` | Define measurable usability objectives tied to identified users, tasks/goals and contexts |
| Interaction quality | `ISO 9241-110:2020` | Review interaction flows, states and behaviours against technology-independent principles |
| Cross-surface accessibility | `ISO 9241-171:2025` | Design and evaluate accessible software across Web and native Desktop, including assistive-technology interoperability |
| Web success criteria | W3C WCAG 2.2 | On Web/web-rendered surfaces, map applicable Level A and AA criteria to requirements, designs and tests |
| Custom Web semantics | WAI-ARIA 1.2 | Only when native semantics are insufficient; pair with keyboard and assistive-technology verification |
| Regulated/procured ICT | Exact applicable EN 301 549 version | Only after an approved scope decision; maintain the exact legal/contract mapping separately |

Surface boundary rules:

1. Native IDEA Desktop is governed by the cross-surface HCD/usability/interaction/accessibility set; WCAG is not its sole accessibility specification.
2. A WebView or other Web-rendered region inside Desktop also receives the WCAG Web profile for that region, without removing native-shell accessibility obligations.
3. Accessibility requirements belong in `DOC-04`; `DOC-08` supplies the interaction/design response and evaluation design. Neither document may silently create business rules owned by `DOC-03`.
4. Automated checks are supporting evidence only. Keyboard, assistive-technology and user evaluation must be selected from requirement, risk and context; an automated score is not a conformance claim.
5. Each exception or unmet target needs identity, impact, risk, accountable owner, approval and planned disposition. “Not tested” must never be reported as pass.

## 5. Minimum controlled content to add to the DOC-08 template

The eventual `DOC-08` template should require these sections or equivalent traceable information:

1. **Document control and applicable profile** — version, owner/reviewer/approver, status, surfaces, applicable standard IDs, tailoring decisions and baseline.
2. **Users and context of use** — user groups, goals/tasks, environments, devices, constraints, languages/locales and evidence sources; avoid unsupported personas.
3. **Accessibility needs** — ability-related and situational needs, input/output modes, assistive technologies and unresolved evidence gaps.
4. **Journeys, task flows and information architecture** — including permission, conflict, offline/recovery and complete-process boundaries.
5. **Interaction-principle assessment** — design response, rationale and deviations for the selected `ISO 9241-110` principles.
6. **Usability objectives** — measurable outcome, context, method, threshold, sample/participant rationale and acceptance link.
7. **Accessibility profile by surface** — cross-surface `ISO 9241-171` mapping; WCAG A/AA mapping for Web; conditional ARIA/EN mappings where activated.
8. **Component semantics and interaction contracts** — accessible name/role/state/value, focus and keyboard behaviour, announcements, zoom/reflow, contrast, target/input behaviour and error recovery as applicable.
9. **State inventory** — default, empty, loading, partial, error, validation, permission denied, conflict, disconnected, success, destructive confirmation and recovery states.
10. **Evaluation and evidence plan** — expert review, automated checks, keyboard/assistive-technology combinations, usability evaluation, defects, retest and residual risk.
11. **Traceability and change impact** — links to stakeholder need, `DOC-04` requirement, component/prototype, test result, issue/change record and release baseline.

## 6. Proposed `standards-register.md` delta

This section is a proposed edit for later approval; this research task does not modify the register.

### 6.1 Add a human-centred design and accessibility subsection

| ID | Source and baselined edition | Project class | IDEA Engineering use | Operationalized through | Status note |
|---|---|---|---|---|---|
| `STD-HCD-001` | [ISO 9241-210:2019](https://www.iso.org/standard/77520.html), *Ergonomics of human-system interaction — Part 210: Human-centred design for interactive systems* | `STANDARD-GUIDED` | Govern evidence-backed HCD activities and iteration across the interactive-system life cycle | `CON`, `REQ`, `DOC-08`, `VVP`, `VEV`; PG1–PG5 | Published Edition 2; confirmed in 2025 |
| `STD-HCD-002` | [ISO 9241-11:2018](https://www.iso.org/standard/63500.html), *Ergonomics of human-system interaction — Part 11: Usability: Definitions and concepts* | `STANDARD-GUIDED` | Define context-bound usability outcomes and measurable usability objectives | Quality model, `REQ`, `DOC-08`, `VVP`, `VEV`; PG1–PG5 | Published Edition 2; confirmed in 2023 |
| `STD-HCD-003` | [ISO 9241-110:2020](https://www.iso.org/standard/75258.html), *Ergonomics of human-system interaction — Part 110: Interaction principles* | `STANDARD-GUIDED` | Review interaction requirements, flows, states and behaviour across Web and Desktop | `REQ`, `DOC-08`, design system, `VVP`, `VEV`; PG2–PG5 | Published Edition 2; confirmed in 2025 |
| `STD-A11Y-001` | [ISO 9241-171:2025](https://www.iso.org/standard/86308.html), *Ergonomics of human-system interaction — Part 171: Software accessibility* | `STANDARD-GUIDED` | Cross-surface accessible-software requirements and guidance for Web and native Desktop | Accessibility `REQ`, `DOC-08`, component specifications, `VVP`, `VEV`; PG1–PG5 | Published Edition 2; replaces withdrawn 2008 edition |
| `STD-A11Y-002` | [W3C WCAG 2.2, Recommendation 2024-12-12](https://www.w3.org/TR/2024/REC-WCAG22-20241212/) | `STANDARD-GUIDED, CONDITIONAL` | Level A and AA coverage target for IDEA Web and Web-rendered content; exact conformance claims require separate assessment | Web accessibility `REQ`, `DOC-08`, Web component acceptance, `VVP`, `VEV`; PG2–PG5 | Current WCAG 2.2 dated Recommendation; track errata and later Recommendations |
| `STD-A11Y-003` | [ISO/IEC 40500:2025](https://www.iso.org/standard/91029.html), *Information technology — W3C Web Content Accessibility Guidelines (WCAG) 2.2* | `REFERENCE/WATCH` | ISO-designation compatibility for WCAG 2.2; activate only for an approved external requirement | Standards/contract mapping and accessibility profile | Published Edition 2 but already at stage 90.92 with a successor DIS; avoid duplicate operational mapping |
| `STD-A11Y-004` | [ISO/IEC 29138-1:2018](https://www.iso.org/standard/71953.html), *Information technology — User interface accessibility — Part 1: User accessibility needs* | `REFERENCE/WATCH` | Optional accessibility-needs discovery inventory; not an implementation requirement or evaluation method | `CON`, stakeholder research and `DOC-08` evidence references | Published Edition 1; moved to revision on 2026-08-26; Edition 2 AWI under development |
| `STD-A11Y-005` | [WAI-ARIA 1.2, Recommendation 2023-06-06](https://www.w3.org/TR/2023/REC-wai-aria-1.2-20230606/) | `STANDARD-GUIDED, CONDITIONAL` | Accessible semantics for custom Web widgets/structures when native host-language semantics are insufficient | Web component contracts, lint/validation, keyboard and assistive-technology tests; PG3–PG5 | WAI-ARIA 1.3 is a Working Draft and not the baseline |
| `STD-A11Y-006` | [EN 301 549 V3.2.1 (2021-03)](https://www.etsi.org/deliver/etsi_en/301500_301599/301549/03.02.01_60/en_301549v030201p.pdf), *Accessibility requirements for ICT products and services* | `REFERENCE/WATCH` | Track the latest published/harmonised state; promote the exact relevant edition to `STANDARD-GUIDED, CONDITIONAL` only for an approved EU, procurement, customer, contractual or regulatory scope | Applicability register and version watch; if activated, `REQ`, `DOC-08`, `VVP`, `VEV`, release evidence | V3.2.1 is latest published and WAD-harmonised at cut-off; V4.1.0 is a final draft adopted for publication but not yet the published/OJ baseline |

### 6.2 Add fast-routing entries

| When doing this work | Start with | Required IDEA output |
|---|---|---|
| Plan HCD or write `DOC-08` | `STD-HCD-001`–`STD-HCD-003`, `STD-A11Y-001` | Context evidence, usability objectives, interaction rationale, accessibility profile and evaluation plan |
| Specify/evaluate IDEA Web accessibility | `STD-A11Y-001`, `STD-A11Y-002`; add `STD-A11Y-005` for custom semantics | Criterion-to-requirement/design/test mapping plus keyboard and assistive-technology evidence |
| Specify/evaluate native Desktop accessibility | `STD-A11Y-001` plus selected platform accessibility guidance | Native accessibility requirements, component/accessibility-API contracts and verification evidence |
| Assess an EU/customer accessibility obligation | `STD-A11Y-006`, the exact contract/law and competent advice | Approved applicability/version record, scoped requirement mapping and evidence; no inferred legal claim |

### 6.3 Add gate-crosswalk inputs

| Gate | Proposed minimum HCD/accessibility addition |
|---|---|
| `PG0` | Approve the HCD/accessibility classifications, lawful ISO access plan, owner, tailoring method and conditional-scope decision rules |
| `PG1` | Identify users, contexts, accessibility needs, evidence gaps and initial usability/accessibility risks |
| `PG2` | Baseline measurable usability and accessibility requirements with surface profile and verification method |
| `PG3` | Baseline `DOC-08`, interaction/accessibility design responses, component contracts and evaluation strategy |
| `PG4` | Link the increment to applicable UI states, WCAG/ARIA/native requirements, test design, participant/assistive-technology needs and rollback/recovery behaviour |
| `PG5` | Retain results for the exact controlled configuration, including manual and assistive-technology evidence, defects, waivers and residual risks |
| `PG6` | Confirm the release accessibility profile, known limitations, support information and any externally claimed scope |

## 7. Proposed version-watch additions

| Watch item | State at 2026-08-27 | Trigger for IDEA impact review |
|---|---|---|
| ISO/IEC 40500 | Edition 2 (2025) remains published but is at stage 90.92; successor DIS under development | Publication of the replacement International Standard or an external demand for the ISO designation |
| ISO/IEC 29138-1 Edition 2 | AWI approved 2026-08-26 at stage 10.99 | Publication of Edition 2; do not baseline an AWI/WD |
| W3C WCAG 2.2 | Current dated Recommendation is 2024-12-12 and has an errata channel | A revised Recommendation, material erratum or approved policy/contract version change |
| WAI-ARIA 1.3 | Working Draft 2026-06-04 | Publication as a W3C Recommendation plus browser/assistive-technology support assessment |
| EN 301 549 V4.1.0 | Final deliverable adopted for publication 2026-08-24; V3.2.1 remains latest published and currently WAD-harmonised at cut-off | ETSI publication, then separately any Official Journal citation/applicability decision; do not silently replace V3.2.1 |

## 8. Baseline-control and claim rule

The standards register may select editions, classifications and intended project uses. It must not state that IDEA is ISO conformant, WCAG conformant, EN 301 549 conformant or legally compliant merely because `DOC-08` cites a source.

Before any external claim, the project needs an approved scope, exact edition, clause/criterion applicability map, lawful access where needed, controlled product configuration, objective evidence, deviations/risks and authorized assessment. Version monitoring creates a `CHG`/impact review; it never silently replaces the baseline.

## 9. Official navigation ledger

| Source group | Official navigation |
|---|---|
| Human-centred design and usability | [ISO 9241-210:2019](https://www.iso.org/standard/77520.html), [ISO 9241-11:2018](https://www.iso.org/standard/63500.html), [ISO 9241-110:2020](https://www.iso.org/standard/75258.html) |
| Software accessibility and user needs | [ISO 9241-171:2025](https://www.iso.org/standard/86308.html), [ISO/IEC 29138-1:2018](https://www.iso.org/standard/71953.html), [ISO/IEC AWI 29138-1](https://www.iso.org/standard/95214.html) |
| WCAG | [W3C WCAG 2.2 dated Recommendation](https://www.w3.org/TR/2024/REC-WCAG22-20241212/), [W3C latest WCAG 2.2](https://www.w3.org/TR/WCAG22/), [ISO/IEC 40500:2025](https://www.iso.org/standard/91029.html) |
| ARIA | [WAI-ARIA 1.2 Recommendation](https://www.w3.org/TR/2023/REC-wai-aria-1.2-20230606/), [WAI-ARIA 1.3 Working Draft](https://www.w3.org/TR/2026/WD-wai-aria-1.3-20260604/) |
| European ICT accessibility | [ETSI EN 301 549 V3.2.1](https://www.etsi.org/deliver/etsi_en/301500_301599/301549/03.02.01_60/en_301549v030201p.pdf), [ETSI V4.1.0 final draft](https://www.etsi.org/deliver/etsi_en/301500_301599/301549/04.01.00_30/en_301549v040100va.pdf), [ETSI project](https://labs.etsi.org/rep/HF/en301549), [ETSI V4.1.0 work item](https://portal.etsi.org/webapp/WorkProgram/Report_WorkItem.asp?SearchPage=TRUE&WKI_ID=64282), [European Commission standards/harmonisation page](https://digital-strategy.ec.europa.eu/en/policies/web-accessibility-directive-standards-and-harmonisation), [Decision (EU) 2021/1339](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32021D1339) |
