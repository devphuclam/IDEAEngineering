DOC-08

# UI/UX and Interaction Specification

> **Template state**: `INSTRUCTION-ONLY`. This structure records user, interaction, human-centred
> design and accessibility obligations for the internal IDEA product. It is not a universal
> conformance claim.
>
> **Authority**: DOC-08 owns users/context, journeys, information architecture, task flows,
> interaction states and rationale, usability objectives, surface-specific accessibility profiles,
> component/semantic contracts and evaluation strategy. DOC-03 owns business rules and DOC-04 owns
> software requirements.

## Control envelope

| Field | Recorded value / instruction |
|---|---|
| Stable Document ID | `UNKNOWN` until assigned |
| Document Class | `DOC-08` |
| Title | `UNKNOWN` |
| Owner | `UNKNOWN` until an accountable product/design owner is named |
| Document Status | `Draft` for this scaffold; instance uses `Draft`, `Proposed`, `Approved`, `Superseded`, or `Retired` |
| Document Version | `0.1` scaffold version; instance uses `major.minor` |
| Applicable Baseline | `UNKNOWN` or exact requirements/increment/gate baseline |
| Effective Date | `NOT APPLICABLE` until approval |
| Authors / Reviewers / Approvers | Attributable identities plus HCD/accessibility competence and independence basis |
| Source Links | DOC-03 needs, DOC-04 requirements, evidence, standards applicability and decisions |
| Downstream Links | DOC-04, DOC-05, DOC-07, VVP, VEV, RSK and CHG |
| Evidence / Claim Status | Classify usability, accessibility, localization and pilot claims separately |
| Change History | `UNKNOWN` or `CHG`/Work Item links |
| Access Classification / Retention Rule | Approved classification and retention rule |
| Content State | `INSTRUCTION-ONLY` until authored, reviewed and trace-complete |

## Authored-content boundary

<!-- AUTHOR CONTENT START -->

## 1. Users and operating context

<!-- Identify internal roles, tasks, environment, assistive technology context, constraints and representative population. -->

| Role / context | Goal and task | Environment / device | Accessibility or language need | Evidence / population status |
|---|---|---|---|---|
| `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |

## 2. Journey and task-flow model

| Journey / task ID | Trigger and preconditions | Steps and decision points | Success / failure outcome | Requirement / evidence trace |
|---|---|---|---|---|
| `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |

Include normal, error, cancellation, recovery, offline and permission-denied paths where applicable.
Do not silently turn a design preference into a business rule or software requirement.

## 3. Information architecture and navigation

| Area / object | Hierarchy and entry point | Findability / labeling rule | Cross-document authority link | Status |
|---|---|---|---|---|
| `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |

## 4. Interaction states and rationale

| Component / state | Trigger | Visible state and feedback | Keyboard/pointer/assistive behavior | Failure/recovery behavior | Rationale / trace |
|---|---|---|---|---|---|
| `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |

State semantics must remain consistent across surfaces. Record loading, empty, read-only, editable,
conflict, validation-error, unauthorized, offline and success states when they apply.

## 5. Surface-specific HCD and accessibility profiles

For each applicable surface, record the exact source, classification and applicability in GOV. WCAG,
WAI-ARIA, EN 301 549 or another source may be `APPLY`, `TAILOR`, `NOT-APPLICABLE`, or `BLOCKED` only
after the exact edition, scope, evidence expectation and review owner are recorded. A checklist score
does not establish conformance.

| Surface profile | Primary interaction boundary | Conditional source/applicability | Manual evidence | Assistive evidence | Known limitation / status |
|---|---|---|---|---|---|
| Desktop | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |
| Web | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |
| Web-rendered Desktop | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |

## 6. Locale Profile matrix

The controlled source and field vocabulary are English. `DOC-08` and `DOC-04` declare the same
3-by-3 matrix: one profile per `en`/`vi`/`ja` × Desktop/Web/Web-rendered Desktop cell. A complete
matrix contains nine locale-surface cells.

| Cell ID | Locale | Surface | Resource catalogue | English fallback | Locale review status | Persisted preference | Unicode / Japanese input and search evidence | Cross-locale parity result |
|---|---|---|---|---|---|---|---|---|
| `en-desktop` | `en` | Desktop | `UNKNOWN` | `UNKNOWN` | `NOT APPLICABLE` or `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |
| `en-web` | `en` | Web | `UNKNOWN` | `UNKNOWN` | `NOT APPLICABLE` or `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |
| `en-web-rendered-desktop` | `en` | Web-rendered Desktop | `UNKNOWN` | `UNKNOWN` | `NOT APPLICABLE` or `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |
| `vi-desktop` | `vi` | Desktop | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |
| `vi-web` | `vi` | Web | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |
| `vi-web-rendered-desktop` | `vi` | Web-rendered Desktop | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |
| `ja-desktop` | `ja` | Desktop | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | IME, normalization, width, search, font fallback, line breaking | `UNKNOWN` |
| `ja-web` | `ja` | Web | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | IME, normalization, width, search, font fallback, line breaking | `UNKNOWN` |
| `ja-web-rendered-desktop` | `ja` | Web-rendered Desktop | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | IME, normalization, width, search, font fallback, line breaking | `UNKNOWN` |

Run the same cross-locale task suite plus catalogue, input and search scenarios for every cell. Keep
user-authored Unicode unchanged; runtime translation is not authority. A missing resource, fallback,
review, preference or scenario is `UNKNOWN`/`BLOCKED`.

## 7. Component and semantic contracts

| Component / pattern | Semantic role and name | Inputs / outputs | State and error contract | Requirement / architecture trace | Status |
|---|---|---|---|---|---|
| `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |

## 8. Usability objectives and evaluation

| Objective ID | User outcome / metric | Method and environment | Participant population | Reviewer independence / competence | Result |
|---|---|---|---|---|---|
| `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `NOT-RUN` |

When the minimum population is available, walkthroughs include the Product Decision Authority and one
intended document consumer. The Principal Product Author may assist with usability but cannot count as
the independent approver. Missing reviewer, competence or population remains `BLOCKED`/`NOT-RUN`.

## 9. Deviations, residual risk and gate readiness

| Deviation / risk | Affected surface/cell | Rationale and impact | Owner / expiry or review trigger | Evidence / CHG link | Status |
|---|---|---|---|---|---|
| `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |

| Gate item | Required evidence | Result |
|---|---|---|
| First review | `PG1` exact baseline and scope | `NOT-RUN` |
| Requirements/design trace | DOC-04 and DOC-05 links for each material interaction obligation | `UNKNOWN` |
| HCD/accessibility review | Surface profile, conditional sources, manual/assistive evidence and specialist assessment | `UNKNOWN` |
| Locale review | Nine cells complete or explicitly `UNKNOWN`/`BLOCKED` | `UNKNOWN` |

## Standards applicability and objective evidence

| Surface | Conditional source | Exact edition / scope | Classification | Applicability / tailoring | Evidence expectation | Status |
|---|---|---|---|---|---|---|
| Native Desktop | HCD/accessibility source selected in `GOV` | `UNKNOWN` | `STANDARD`, `STANDARD-GUIDED` or `PROJECT-CONVENTION` | `APPLY`, `TAILOR`, `NOT-APPLICABLE` or `BLOCKED` | Manual and assistive evidence appropriate to the surface | `UNKNOWN` |
| Web | WCAG Web/rendered profile is required for applicable Web scope; WAI-ARIA is additive only where necessary custom Web semantics are not provided by native host-language semantics | `UNKNOWN` | `STANDARD`, `STANDARD-GUIDED, CONDITIONAL` or `REFERENCE/WATCH` | Exact scope, tailoring and native-semantic boundary | Keyboard, screen-reader and browser evidence where applicable | `UNKNOWN` |
| Web-rendered Desktop | Conditional Web/HCD sources for the rendered region | `UNKNOWN` | `STANDARD-GUIDED, CONDITIONAL` or `PROJECT-CONVENTION` | Rendered-region boundary and approved applicability | Manual/assistive evidence for the rendered region | `UNKNOWN` |

A citation or checklist score is not a conformity claim. Exact edition, lawful access, applicability,
tailoring, owner and objective evidence are required before a claim is made. Native Desktop is not
automatically treated as a Web conformance scope.

## Typed trace, supporting records and rendition controls

| Link type | Required target and purpose | Result |
|---|---|---|
| `SOURCE-NEED` / `SOURCE-DECISION` | DOC-03 need, DOC-04 requirement, approved HCD decision or evidence | `UNKNOWN` |
| `DOWNSTREAM` | Interaction requirement, architecture view, component contract, increment or locale evidence | `UNKNOWN` |
| `CHANGE` | `CHG`/Work Item covering interaction, accessibility, locale, risk, tests and release impact | `UNKNOWN` |
| `VERIFICATION` | VVP/VEV manual, assistive, Unicode and cross-locale task-suite evidence | `UNKNOWN` |
| `RELEASE` | REL baseline and approved claim scope | `UNKNOWN` |
| `RENDITION` | Source-pinned Markdown/DOCX/PDF metadata and stale/superseded state | `UNKNOWN` |

The complete locale/surface matrix remains the authority for product UI obligations. A translated or
stale rendition cannot replace the English source or change an interaction requirement.

<!-- AUTHOR CONTENT END -->

## Contract references

- [Core document catalogue](../../../specs/003-controlled-documentation/contracts/document-catalogue.md)
- [Evidence and trace](../../../specs/003-controlled-documentation/contracts/evidence-and-trace.md)
- [Validation contract](../../../specs/003-controlled-documentation/contracts/validation.md)
- [Project domain language](../../../CONTEXT.md)
