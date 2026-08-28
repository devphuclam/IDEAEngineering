DOC-02

# Feasibility and Options Assessment

> **Template state**: `INSTRUCTION-ONLY`. This is the class template for independently identifiable
> feasibility instances; it does not make a production feasibility or technology decision.
>
> **Authority**: DOC-02 owns feasibility questions, current-process baseline, option evaluation,
> evidence, risks, bounded prototype conclusions and recommendation. It does not own requirements,
> architecture or a release schedule.

## Control envelope

| Field | Recorded value / instruction |
|---|---|
| Stable Document ID | `UNKNOWN` until the living DOC-02 class or instance identity is assigned |
| Document Class | `DOC-02` |
| Feasibility Instance ID | `UNKNOWN`; independent identity for every indexed assessment |
| Title | `UNKNOWN` |
| Owner | `UNKNOWN` or attributable Product Decision Authority / Principal Product Author |
| Document Status | `Draft` for this scaffold; instance values are `Draft`, `Proposed`, `Approved`, `Superseded`, or `Retired` |
| Document Version | `0.1` scaffold version; instance content uses `major.minor` |
| Applicable Baseline | `UNKNOWN`; exact input product/need/evidence baseline |
| Applicable Gate | `PG1` initially; record later gate when an option is selected |
| Effective Date | `NOT APPLICABLE` until the instance is approved |
| Authors / Reviewers / Approvers | Attributable identities, competence, independence and authority basis |
| Source Links | Typed links to DOC-01/03, evidence, GOV and RSK |
| Downstream Links | Typed links to DOC-04/05/06/07 and `CHG` |
| Evidence / Claim Status | Classify every observation, prototype result and recommendation |
| Change History | `UNKNOWN` or `CHG`/Work Item links |
| Access Classification / Retention Rule | Approved repository/storage classification and retention rule |
| Content State | `INSTRUCTION-ONLY` until the instance is complete and reviewed |

Indexed records must not rely on an index row for authority. Each record repeats its own instance ID,
source baseline, status, version, owner, gate and trace fields. A Git commit is evidence of repository
state, not the feasibility instance version.

## Authored-content boundary

<!-- AUTHOR CONTENT START -->

## 1. Feasibility question and decision frame

<!-- State one bounded question, why it matters to the internal product, decision owner, deadline/trigger and success evidence. -->

| Field | Recorded value |
|---|---|
| Feasibility question | `UNKNOWN` |
| Decision needed | `UNKNOWN` |
| Internal context / affected workflow | `UNKNOWN` |
| Decision owner and review trigger | `UNKNOWN` |

## 2. Current-process baseline

<!-- Describe the observed internal process, control points, failure modes and measurable baseline. Cite exact evidence and limitations. -->

| Process step | Actor / data | Current control | Pain or risk | Evidence |
|---|---|---|---|---|
| `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |

## 3. Options and evaluation

Evaluate the same internal criteria for each option. Do not treat a reference observation as internal
validation, and do not copy protected implementation material.

| Option | Scope and assumptions | Internal fit | Data/control risk | Effort/maintainability | Evidence | Disposition |
|---|---|---|---|---|---|---|
| Buy or configure | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |
| Adapt or integrate | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |
| Independent build | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |

### 3.1 Evaluation criteria

<!-- Define measurable criteria and weighting only when approved. Include correctness, traceability, security/privacy, operability, accessibility, maintainability and internal value as applicable. -->

| Criterion ID | Definition / metric | Weight or priority | Evidence method | Owner |
|---|---|---|---|---|
| `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |

## 4. Evidence, risks and unknowns

| Evidence / risk / unknown | Class or status | Limitation / impact | Treatment or resolution path | Owner |
|---|---|---|---|---|
| `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |

Use `UNKNOWN` or `BLOCKED` when source access, authority, competence or configuration is missing.

## 5. Bounded prototype and capability profile

### 5.1 Throwaway prototype boundary

<!-- If a prototype is used before PG2, identify the explicit question, non-production environment, expiry, evidence limits and disposal/retention. It cannot establish production requirements, architecture, security or quality readiness. -->

| Prototype field | Recorded value |
|---|---|
| Explicit question | `UNKNOWN` |
| Environment and data class | `UNKNOWN` |
| Expiry / disposal condition | `UNKNOWN` |
| Evidence produced and limitation | `UNKNOWN` |
| Production-baseline status | `NOT APPLICABLE` until later approved evidence |

### 5.2 Format capability profile

<!-- Record the Generic Controlled-File Baseline and one selected deep CAD profile only when approved. Add later profiles through controlled change. -->

| Profile | Enabled format/scope | Identity/version/digest controls | Semantic capability evidence | Status |
|---|---|---|---|---|
| Generic Controlled-File Baseline | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |
| Selected deep CAD profile | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |

## 6. Recommendation and gate disposition

<!-- State the recommended option, rejected/deferred alternatives, conditions, affected baselines and next decision. -->

| Field | Recorded value |
|---|---|
| Recommendation | `UNKNOWN` |
| Rationale and evidence | `UNKNOWN` |
| Required follow-up | `UNKNOWN` |
| Gate outcome | `NOT-RUN` until an attributable review (`PASS`, `PASS-WITH-ACTIONS`, `FAIL`, or `BLOCKED`) |
| Indexed trace to DOC-07 increment | `UNKNOWN` |

## Typed trace, supporting records and rendition controls

| Link type | Required target and purpose | Result |
|---|---|---|
| `SOURCE-NEED` / `SOURCE-DECISION` | DOC-01 framing, internal process evidence, decision or accepted ADR | `UNKNOWN` |
| `DOWNSTREAM` | DOC-04/05/06/07 consequence or indexed increment selected by this assessment | `UNKNOWN` |
| `CHANGE` | `CHG`/Work Item, affected option/profile and successor baseline | `UNKNOWN` |
| `VERIFICATION` | VVP procedure, prototype limitation or VEV result with exact environment | `UNKNOWN` |
| `RELEASE` | REL manifest only when an approved option is included in a release | `UNKNOWN` |
| `RENDITION` | DOCX/PDF source instance ID, version, baseline, date and current/stale status | `UNKNOWN` |

An indexed assessment retains its own identity and source baseline; a catalogue row or rendition is
not an authority substitute. A rendition generated from an earlier assessment becomes `Stale` when
the source instance changes, and comments are redirected to the authoritative Markdown instance.

<!-- AUTHOR CONTENT END -->

## Contract references

- [Core document catalogue](../../../specs/003-controlled-documentation/contracts/document-catalogue.md)
- [Evidence and trace](../../../specs/003-controlled-documentation/contracts/evidence-and-trace.md)
- [Gate package](../../../specs/003-controlled-documentation/contracts/gate-package.md)
- [Control fields and status](../../../specs/003-controlled-documentation/contracts/control-fields-and-status.md)
