GOV

# Governance and Standards Record

> **Template state**: `INSTRUCTION-ONLY`. This supporting record governs roles, standards,
> applicability, gates and reference-coverage decisions. It does not own Core Product Document
> requirements or implementation.

## Common control envelope

| Field | Recorded value / instruction |
|---|---|
| Stable Record ID | `UNKNOWN` until assigned |
| Record Class | `GOV` |
| Title | `UNKNOWN` |
| Owner | `UNKNOWN` until a governance authority is named |
| Record Status | `Draft` for this scaffold; use `Draft`, `Proposed`, `Approved`, `Superseded`, or `Retired` |
| Record Version | `0.1` scaffold; instance uses `major.minor` |
| Applicable Baseline | `UNKNOWN` or exact governance/product/gate baseline |
| Effective Date | `NOT APPLICABLE` until approval |
| Authors / Reviewers / Approvers | Attributable identities, competence and authority basis |
| Source / Downstream Links | Constitution, standards register, DOCs, gate packages, CHG and VEV links |
| Evidence / Claim Status | Classify each standard or reference decision |
| Change History | `UNKNOWN` or `CHG`/Work Item links |
| Access Classification / Retention Rule | Approved classification and retention rule |
| Content State | `INSTRUCTION-ONLY` until authored and reviewed |

The common envelope is explicit for this `GOV` instance:

| Common field | Recorded value / instruction |
|---|---|
| Stable Document/Record ID | `UNKNOWN` |
| Class/type | `GOV` |
| Title | `UNKNOWN` |
| Owner | `UNKNOWN` |
| Status | `Draft`, `Proposed`, `Approved`, `Superseded`, or `Retired` |
| Version | `major.minor` |
| Applicable Baseline | `UNKNOWN` |
| Effective Date | `NOT APPLICABLE` until approved |
| Authors | `UNKNOWN` |
| Reviewers | `UNKNOWN` |
| Approvers | `UNKNOWN` |
| Source Links | `UNKNOWN` |
| Downstream Links | `UNKNOWN` |
| Evidence / Claim Status | `UNKNOWN` |
| Change History | `UNKNOWN` |
| Access Classification | `UNKNOWN` |
| Retention Rule | `UNKNOWN` |
| Content State | `INSTRUCTION-ONLY` |

## Authored-content boundary

<!-- AUTHOR CONTENT START -->

## 1. Roles and authority

| Role / authority | Scope | Eligible decisions | Separation / competence | Assignment status |
|---|---|---|---|---|
| Product Decision Authority | `UNKNOWN` | Scope, specification, technology and gate decisions within mandate | `UNKNOWN` | `UNKNOWN` |
| Life-cycle / Quality Authority | `UNKNOWN` | Governance, standards and quality dispositions | `UNKNOWN` | `UNKNOWN` |
| Independent reviewer | `UNKNOWN` | Review only within competence | Must not author or own the decision | `UNKNOWN` |

## 2. Standards applicability register

| Standard/policy ID | Exact edition/source | Classification | Surface/scope | Applicability | Tailoring rationale | Objective evidence | Owner / review trigger |
|---|---|---|---|---|---|---|---|
| `STD-LC-001` | ISO/IEC/IEEE 15288:2023 | `STANDARD` | `GOV`; lifecycle framing for DOC-01…DOC-08 and supporting records | `TAILOR` | Select only lifecycle activities needed for the documentation baseline; PG0 approval remains pending | Lawful source record and clause-to-field tailoring matrix before PG0 | Life-cycle / Quality Authority (assignment `UNKNOWN`); PG0 or edition change |
| `STD-LC-002` | ISO/IEC/IEEE 12207:2026 | `STANDARD` | `GOV`; software lifecycle framing for DOC-04…DOC-08 and V&V records | `TAILOR` | Tailor software-lifecycle activities to the internal documentation increment; no implementation claim | Lawful source record and approved tailoring matrix before the applicable gate | Life-cycle / Quality Authority (assignment `UNKNOWN`); PG0 or edition change |
| `STD-LC-003` | ISO/IEC/IEEE 24748-1:2024 | `STANDARD-GUIDED` | `GOV`; integrated lifecycle tailoring and gate model | `TAILOR` | Use one integrated lifecycle map without creating duplicate bureaucracy | Lawful source record, lifecycle crosswalk and PG0 review | Life-cycle / Quality Authority (assignment `UNKNOWN`); lifecycle or edition change |
| `STD-INFO-001` | ISO/IEC/IEEE 15289:2019 | `STANDARD-GUIDED` | All controlled DOC and supporting-record information items | `TAILOR` | Use the information-item concepts that fit the English Markdown source and controlled registers | Field crosswalk, source authority and review record | Principal Product Author; template or edition change |
| `STD-REQ-001` | ISO/IEC/IEEE 29148:2018 | `STANDARD` | DOC-03, DOC-04, requirement-bearing DOC-06/DOC-08, VVP | `TAILOR` | Tailor requirement quality, trace and acceptance fields to the IDEA requirement contract | Clause-to-field matrix, reviewed requirement sample and exact baseline | Requirements owner (assignment `UNKNOWN`); PG2 or edition change |
| `STD-ARC-001` | ISO/IEC/IEEE 42010:2022 | `STANDARD` | DOC-05 and architecture views referenced by DOC-06/DOC-08 | `TAILOR` | Tailor stakeholder/view/concern fields without preselecting a runtime stack | Architecture-view crosswalk and independent architecture review | Architecture owner (assignment `UNKNOWN`); PG3 or edition change |
| `STD-QUAL-001` | ISO/IEC 25010:2023 | `STANDARD` | DOC-04, DOC-05, DOC-06 and DOC-08 quality characteristics | `TAILOR` | Select measurable quality characteristics only where an IDEA requirement or risk needs them | Quality-characteristic mapping, metric definition and verification evidence | Quality Authority (assignment `UNKNOWN`); PG2/PG3 or edition change |
| `STD-QUAL-002` | ISO/IEC 25030:2019 | `STANDARD` | DOC-04 quality requirements and linked VVP/RSK records | `TAILOR` | Tailor quality-requirement wording and measurable thresholds to approved scope | Requirement-to-metric trace and executed V&V evidence | Quality Authority (assignment `UNKNOWN`); PG2 or edition change |
| `STD-HCD-001` | ISO 9241-210:2019 | `STANDARD-GUIDED` | DOC-08 across Desktop, Web and Web-rendered Desktop | `TAILOR` | Apply human-centred activities proportionate to the internal product and available participants | HCD activity record, participant/competence record and reviewed profile | HCD owner (assignment `UNKNOWN`); PG3 or surface change |
| `STD-HCD-002` | ISO 9241-11:2018 | `STANDARD-GUIDED` | DOC-08 usability goals and task evidence | `TAILOR` | Select context-of-use and usability measures for the approved task set | Context/task definition and usability evidence | HCD owner (assignment `UNKNOWN`); PG3 or task/surface change |
| `STD-HCD-003` | ISO 9241-110:2020 | `STANDARD-GUIDED` | DOC-08 interaction principles and UI behavior | `TAILOR` | Tailor interaction guidance to the declared surface profiles; do not treat it as product conformance | Interaction-to-task crosswalk and reviewer disposition | HCD owner (assignment `UNKNOWN`); PG3 or interaction change |
| `STD-A11Y-001` | ISO 9241-171:2025 | `STANDARD-GUIDED` | DOC-08 software accessibility across declared surfaces | `BLOCKED` | Specialist applicability and evidence plan are not yet approved | Lawful source record, specialist review and accessibility evidence plan | HCD/Accessibility Authority (assignment `UNKNOWN`); PG3 or edition change |
| `STD-A11Y-002` | WCAG 2.2 Recommendation (2024-12-12) | `STANDARD-GUIDED, CONDITIONAL` | DOC-08 Web and Web-rendered regions only | `BLOCKED` | Web scope and success-criterion selection require an approved surface profile | Source record, selected success criteria, automated/manual evidence and specialist review | HCD/Accessibility Authority (assignment `UNKNOWN`); Web-surface change or PG3 |
| `STD-A11Y-003` | ISO/IEC 40500:2025 | `REFERENCE/WATCH` | DOC-08 only when an external requirement needs the ISO designation for WCAG 2.2 | `NOT-APPLICABLE` | No external designation requirement is approved in this internal increment | Scope decision and compatibility mapping before activation | HCD/Accessibility Authority (assignment `UNKNOWN`); external requirement or edition change |
| `STD-A11Y-004` | ISO/IEC 29138-1:2018 | `REFERENCE/WATCH` | DOC-08 accessibility-needs discovery when an optional needs inventory is approved | `NOT-APPLICABLE` | Optional discovery guidance is not an implementation or evaluation requirement here | Needs-inventory decision and reviewed evidence before activation | HCD/Accessibility Authority (assignment `UNKNOWN`); needs scope or edition change |
| `STD-A11Y-005` | WAI-ARIA 1.2 Recommendation (2023-06-06) | `STANDARD-GUIDED, CONDITIONAL` | DOC-08 custom Web semantics where native semantics are insufficient | `BLOCKED` | Additive use is conditional; native host semantics remain the default | Source record, role/state mapping and assistive-technology evidence | HCD/Accessibility Authority (assignment `UNKNOWN`); Web component or edition change |
| `STD-A11Y-006` | EN 301 549 V3.2.1 (2021-03) | `REFERENCE/WATCH` | DOC-08 only if an approved contractual or regulatory scope activates it | `NOT-APPLICABLE` | No such scope is currently approved; activation requires a controlled decision | Scope decision and impact analysis before activation | Life-cycle / Quality Authority (assignment `UNKNOWN`); contract/regulatory scope change |
| `STD-TEST-001` | ISO/IEC/IEEE 29119-1:2022 | `STANDARD-GUIDED` | VVP/VEV testing concepts and vocabulary | `TAILOR` | Select terminology needed to describe this documentation Validation Pack | Terminology crosswalk and approved VVP | Verification Authority (assignment `UNKNOWN`); VVP or edition change |
| `STD-TEST-002` | ISO/IEC/IEEE 29119-2:2021 | `STANDARD-GUIDED` | VVP test processes and Validation Pack execution | `TAILOR` | Tailor process steps to criterion-based documentation checks | Process mapping, execution log and retained evidence | Verification Authority (assignment `UNKNOWN`); VVP or edition change |
| `STD-TEST-003` | ISO/IEC/IEEE 29119-3:2021 | `STANDARD-GUIDED` | VVP/VEV test documentation and retained results | `TAILOR` | Use only document structures needed for exact baseline and result traceability | Document crosswalk and retained result ledger | Verification Authority (assignment `UNKNOWN`); VVP/VEV or edition change |
| `STD-TEST-004` | ISO/IEC/IEEE 29119-4:2021 | `STANDARD-GUIDED` | VVP/VEV test techniques where a selected check needs one | `TAILOR` | Select techniques by risk and evidence need; no blanket technique claim | Technique selection rationale and execution evidence | Verification Authority (assignment `UNKNOWN`); selected technique or edition change |
| `STD-TEST-005` | ISO/IEC/IEEE 29119-5:2024 | `STANDARD-GUIDED, CONDITIONAL` | VVP/VEV only if keyword-driven testing is approved for an increment | `BLOCKED` | Capability is not in the current documentation scope; activate through a controlled decision | Capability decision, lawful source and technique evidence before use | Verification Authority (assignment `UNKNOWN`); increment scope or edition change |
| `STD-TEST-006` | ISO/IEC TR 29119-6:2021 | `STANDARD-GUIDED` | VVP/VEV agile-tailoring guidance where an increment uses it | `TAILOR` | Use only for an approved agile increment and document the tailoring rationale | Increment VVP, tailoring record and execution evidence | Verification Authority (assignment `UNKNOWN`); increment method or edition change |
| `STD-CM-001` | ISO 10007:2017 | `STANDARD-GUIDED` | CMP, CHG, REL and all controlled baseline identities | `TAILOR` | Tailor configuration-management guidance to the Markdown authority and Product Generation/Business Revision model | Configuration baseline, change record and release manifest | Configuration Authority (assignment `UNKNOWN`); baseline or edition change |
| `STD-SEC-001` | ISO/IEC 27001:2022 plus Amendment 1:2024 | `STANDARD-GUIDED, CONDITIONAL` | `GOV`, `RSK` and `OPS` only when an approved organizational ISMS scope includes IDEA | `BLOCKED` | No organizational ISMS scope or certification claim is approved by this documentation increment | Scope decision, risk/control mapping and organizational approval | Security/Quality Authority (assignment `UNKNOWN`); ISMS scope or edition change |
| `STD-SEC-002` | ISO/IEC 27002:2022 | `STANDARD-GUIDED` | `RSK`, security requirements and `OPS` risk-selected controls | `TAILOR` | Select controls by approved risk and information boundary; no certification claim | Control-selection rationale, risk trace and verification evidence | Security Authority (assignment `UNKNOWN`); risk or edition change |
| `STD-SEC-003` | ISO/IEC 27034-1:2011 with Cor 1:2014 | `STANDARD-GUIDED` | Security requirements, architecture, threat/risk treatment and VVP | `TAILOR` | Integrate application-security concerns only where the approved product scope needs them | Security trace, threat/risk treatment and V&V evidence | Security Authority (assignment `UNKNOWN`); scope or edition change |
| `STD-SSD-001` | NIST SP 800-218 SSDF v1.1 | `STANDARD-GUIDED` | Future implementation/build/release work and related security records | `NOT-APPLICABLE` | Production implementation is out of scope for this documentation increment; activate at the applicable gate | Increment scope decision and secure-development evidence before use | Security/Architecture Authority (assignment `UNKNOWN`); implementation scope change |
| `STD-WEB-001` | OWASP ASVS 5.0.0 | `STANDARD-GUIDED, CONDITIONAL` | Future Web/API surfaces only if selected by approved architecture | `NOT-APPLICABLE` | No runtime Web/API surface is selected in this increment | Approved surface decision, version pin and ASVS mapping before use | Security/Architecture Authority (assignment `UNKNOWN`); Web/API scope change |
| `STD-SBOM-001` | SPDX Specification 3.0.1 | `STANDARD-GUIDED` | Future dependency inventory and `REL` release package | `NOT-APPLICABLE` | No production dependency/release package is created by this documentation increment | Release scope decision and exact schema-pinned SBOM before use | Release/Configuration Authority (assignment `UNKNOWN`); release scope or schema change |
| `STD-SBOM-002` | ISO/IEC 5962:2021 | `REFERENCE/WATCH` | Future release/SBOM schema compatibility mapping | `NOT-APPLICABLE` | Watch-only ISO designation; it is not identical to SPDX 3.0.1 | Schema compatibility record if an external requirement activates it | Release/Configuration Authority (assignment `UNKNOWN`); external requirement or edition change |
| `STD-PROV-001` | SLSA v1.2 | `STANDARD-GUIDED` | Future build-integrity and release-provenance evidence | `NOT-APPLICABLE` | No build or production release is in scope for this documentation increment | Approved release scope and provenance attestation before use | Release/Security Authority (assignment `UNKNOWN`); build/release scope change |
| `STD-PROJ-001` | IDEA Engineering Constitution and `CONTEXT.md` (controlled repository sources) | `PROJECT-CONVENTION` | All DOC and supporting records in this increment | `APPLY` | Repository-local boundaries and terminology are mandatory; they do not assert external conformity | Constitution/CONTEXT links and post-change consistency analysis | Product Decision Authority; constitution or domain-language change |

The controlled applicability vocabulary is exactly `APPLY`, `TAILOR`, `NOT-APPLICABLE`, or
`BLOCKED`. `APPLY` means the approved project convention is used as written; it never means that an
external standard has been shown to conform. The classification vocabulary is exactly `STANDARD`,
`STANDARD-GUIDED`, `STANDARD-GUIDED, CONDITIONAL`, `REFERENCE/WATCH`, or `PROJECT-CONVENTION`.

Citation alone never proves conformity. A new edition enters through controlled impact review and does
not silently replace the effective baseline.

## 3. Gate model

| Gate | Minimum inputs | Authority / independent review | One permitted outcome | Conditional action fields |
|---|---|---|---|---|
| `PG0`–`PG7` | `UNKNOWN` | `UNKNOWN` | `PASS`, `PASS-WITH-ACTIONS`, `FAIL`, or `BLOCKED` | Owner, affected baseline, due condition/date, expiry, escalation |

## 4. Material Coverage Inventory

The inventory is a closed denominator at an explicit as-of baseline/date. It is a register shape within
GOV, not a tenth supporting class.

| Inventory ID | Material behavior/product area | Inclusion criterion | Explicit exclusion rationale | As-of baseline/date | Owner | Review trigger | CHG history |
|---|---|---|---|---|---|---|---|
| `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `NOT APPLICABLE` or `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |

Additions, removals and scope changes require a `CHG` record and successor effective inventory
baseline. The denominator is never inferred from whichever coverage rows happen to exist.

## 5. Behavioral Coverage Register

There is exactly one coverage record for every Material Coverage Inventory entry at its recorded
as-of baseline. Reference names and comparison evidence stay in this supporting record or linked
research; core DOCs contain only approved IDEA language.

| Inventory ID / Coverage ID | DDM target version/edition/configuration | Evidence and limitations | Proactive quality-benchmark comparison | Advantage/limitation and stakeholder/risk | Disposition | Owner / rationale | IDEA trace / increment | Verification / result |
|---|---|---|---|---|---|---|---|---|
| `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` or `NO-STRONGER-PATTERN` | `UNKNOWN` | `ADOPT`, `ADAPT`, `ADAPT-ARAS`, `DEFER`, `EXCLUDE`, `UNKNOWN`, or `BLOCKED` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |

An evidenced behavior cannot be marked `ADOPT` until its applicable proactive comparison is recorded.
Every omitted evidenced behavior is visible as `DEFER` or `EXCLUDE`; inaccessible evidence is
`UNKNOWN` or `BLOCKED`.

## 6. Governance decisions and open gaps

| Decision / gap ID | Statement | Authority / evidence | Impacted baseline | Owner and resolution trigger | Status |
|---|---|---|---|---|---|
| `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |

## 7. Gate package contract

Each gate package names the exact input IDs, versions and source baseline before review. The package
records reviewer and approver identity, role, competence and independence basis, decision date,
rationale, affected scope, one outcome, and every conditional action. File-count completeness is not
evidence of a passing gate.

| Gate | Minimum exact inputs | Required authority / independence basis | Exit evidence | Outcome / action rule |
|---|---|---|---|---|
| `PG0` | Constitution, catalogue, applicable `GOV`/`CLR`/`CMP` and standards records | Product Decision Authority; independent governance review where available | Governance, lawful-access, standards and configuration foundation | One of `PASS`, `PASS-WITH-ACTIONS`, `FAIL`, `BLOCKED` |
| `PG1` | `DOC-01`, indexed `DOC-02`, initial `DOC-03`, admitted evidence and risks | Product Decision Authority; reviewer competence recorded | Internal problem/value hypothesis, feasibility options and assumptions | Same four outcomes; unresolved authority is `BLOCKED` |
| `PG2` | `DOC-03`, `DOC-04`, requirement-bearing `DOC-06`/`DOC-08`, `VVP`, risks and trace | Approver plus independent requirements review where applicable | Source-traceable, measurable requirements and acceptance/verification obligations | No production authorization without `PASS` or safe `PASS-WITH-ACTIONS` |
| `PG3` | `DOC-05`, applicable `DOC-06`/`DOC-08`, ADRs, risks and V&V strategy | Architecture/HCD/data competence; author/owner separation | Approved views, responsibilities, interfaces, quality and risk responses | Missing specialist competence is `BLOCKED` or `NOT-RUN` |
| `PG4` | Bounded `DOC-07` increment, affected approved baselines, `CHG`, tests, dependencies, migration and rollback | Product Decision Authority and readiness reviewer | Increment scope and recovery readiness pinned | Actions must not invalidate requirements, design, tests or rollback |
| `PG5` | Exact increment baseline, `VVP`, `VEV`, defects, waivers and coverage | Independent verification/acceptance review where required | Executed evidence against the exact configuration | Unrun or substitute evidence cannot be `PASS` |
| `PG6` | `REL` manifest, exact item pins, `VEV`, residual-risk and recovery evidence | Release authority with required approval | Immutable release package and truthful claims | Missing approval, evidence or recovery keeps gate `BLOCKED` |
| `PG7` | Applicable `OPS`, `RSK`, `CHG`, release and updated core baselines | Operational authority and accountable product owner | Support, retention, incident, learning and retirement readiness | One outcome plus traceable follow-up actions |

## 8. Validation Pack and coverage ownership

`GOV` owns the closed Material Coverage Inventory denominator and its Behavioral Coverage Register.
The inventory has one explicit as-of baseline/date, inclusion criteria and explicit exclusions. Each
inventory entry has exactly one coverage record at that baseline. The record retains target evidence,
limitations, proactive benchmark comparison, one disposition, owner/rationale, IDEA trace, increment
and verification. A missing source, comparison, owner or reviewer remains `UNKNOWN` or `BLOCKED`.

The retained Documentation Validation Pack is owned by the Principal Product Author for preparation
and by a designated reviewer for acceptance. It contains the minimum strata/counts in the VVP record;
selection rationale, exact baseline, environment, date, owner, evidence link and disposition are
required for every item. Human absence is recorded rather than inferred away.

## 9. Standards and unresolved-authority rules

Every standards row records an exact edition or controlled source, one classification, one
applicability disposition, tailoring rationale, objective-evidence expectation, owner and review
trigger. A citation alone is not a conformity claim. Changes of edition enter through `CHG` impact
review and do not silently rewrite dependent documents.

For every `UNKNOWN` or `BLOCKED` field, record the owner, resolution action, affected baseline and
review trigger. The field may remain unresolved in `Draft`; it blocks `Proposed`, `Approved` or the
applicable gate until the required authority/evidence is present or an authorized disposition is
recorded.

## 10. Reconciled standards navigation baseline

The product-local standards register remains `Proposed` for PG0. The entries below are navigation to
the authoritative rows in section 2, not a second source of truth and not a conformity or approval
claim. The disposition shown here is the section 2 applicability value.

| Register ID | Exact proposed edition/source | Intended classification/scope | Section 2 applicability |
|---|---|---|---|
| `STD-LC-001` | ISO/IEC/IEEE 15288:2023 | `STANDARD`; system life cycle | `TAILOR` |
| `STD-LC-002` | ISO/IEC/IEEE 12207:2026 | `STANDARD`; software life cycle | `TAILOR` |
| `STD-LC-003` | ISO/IEC/IEEE 24748-1:2024 | `STANDARD-GUIDED`; lifecycle tailoring | `TAILOR` |
| `STD-INFO-001` | ISO/IEC/IEEE 15289:2019 | `STANDARD-GUIDED`; information-item content | `TAILOR` |
| `STD-REQ-001` | ISO/IEC/IEEE 29148:2018 | `STANDARD`; requirements | `TAILOR` |
| `STD-ARC-001` | ISO/IEC/IEEE 42010:2022 | `STANDARD`; architecture description | `TAILOR` |
| `STD-QUAL-001` | ISO/IEC 25010:2023 | `STANDARD`; quality model | `TAILOR` |
| `STD-QUAL-002` | ISO/IEC 25030:2019 | `STANDARD`; quality requirements | `TAILOR` |
| `STD-HCD-001` | ISO 9241-210:2019 | `STANDARD-GUIDED`; human-centred design | `TAILOR` |
| `STD-HCD-002` | ISO 9241-11:2018 | `STANDARD-GUIDED`; usability | `TAILOR` |
| `STD-HCD-003` | ISO 9241-110:2020 | `STANDARD-GUIDED`; interaction | `TAILOR` |
| `STD-A11Y-001` | ISO 9241-171:2025 | `STANDARD-GUIDED`; cross-surface software accessibility | `BLOCKED` |
| `STD-A11Y-002` | WCAG 2.2 Recommendation (2024-12-12) | `STANDARD-GUIDED, CONDITIONAL`; Web/rendered regions | `BLOCKED` |
| `STD-A11Y-003` | ISO/IEC 40500:2025 | `REFERENCE/WATCH`; WCAG ISO designation | `NOT-APPLICABLE` |
| `STD-A11Y-004` | ISO/IEC 29138-1:2018 | `REFERENCE/WATCH`; accessibility-needs discovery | `NOT-APPLICABLE` |
| `STD-A11Y-005` | WAI-ARIA 1.2 Recommendation (2023-06-06) | `STANDARD-GUIDED, CONDITIONAL`; custom Web semantics | `BLOCKED` |
| `STD-A11Y-006` | EN 301 549 V3.2.1 (2021-03) | `REFERENCE/WATCH`; conditional contractual/regulatory scope | `NOT-APPLICABLE` |
| `STD-TEST-001` | ISO/IEC/IEEE 29119-1:2022 | `STANDARD-GUIDED`; testing concepts and vocabulary | `TAILOR` |
| `STD-TEST-002` | ISO/IEC/IEEE 29119-2:2021 | `STANDARD-GUIDED`; test processes | `TAILOR` |
| `STD-TEST-003` | ISO/IEC/IEEE 29119-3:2021 | `STANDARD-GUIDED`; test documentation | `TAILOR` |
| `STD-TEST-004` | ISO/IEC/IEEE 29119-4:2021 | `STANDARD-GUIDED`; test techniques | `TAILOR` |
| `STD-TEST-005` | ISO/IEC/IEEE 29119-5:2024 | `STANDARD-GUIDED, CONDITIONAL`; keyword-driven testing | `BLOCKED` |
| `STD-TEST-006` | ISO/IEC TR 29119-6:2021 | `STANDARD-GUIDED`; agile tailoring guidance | `TAILOR` |
| `STD-CM-001` | ISO 10007:2017 | `STANDARD-GUIDED`; configuration management | `TAILOR` |
| `STD-SEC-001` | ISO/IEC 27001:2022 + Amendment 1:2024 | `STANDARD-GUIDED, CONDITIONAL`; organizational ISMS scope | `BLOCKED` |
| `STD-SEC-002` | ISO/IEC 27002:2022 | `STANDARD-GUIDED`; risk-selected security controls | `TAILOR` |
| `STD-SEC-003` | ISO/IEC 27034-1:2011 + Cor 1:2014 | `STANDARD-GUIDED`; application security | `TAILOR` |
| `STD-SSD-001` | NIST SP 800-218 SSDF v1.1 | `STANDARD-GUIDED`; secure development | `NOT-APPLICABLE` |
| `STD-WEB-001` | OWASP ASVS 5.0.0 | `STANDARD-GUIDED, CONDITIONAL`; future Web/API | `NOT-APPLICABLE` |
| `STD-SBOM-001` | SPDX Specification 3.0.1 | `STANDARD-GUIDED`; future release SBOM | `NOT-APPLICABLE` |
| `STD-SBOM-002` | ISO/IEC 5962:2021 | `REFERENCE/WATCH`; SPDX ISO compatibility | `NOT-APPLICABLE` |
| `STD-PROV-001` | SLSA v1.2 | `STANDARD-GUIDED`; future release provenance | `NOT-APPLICABLE` |
| `STD-PROJ-001` | IDEA Engineering Constitution and `CONTEXT.md` | `PROJECT-CONVENTION`; repository-local controls | `APPLY` |

## 11. Reconciled open-decision register

| Gap ID | Unresolved decision | Current status | Owner | Resolution path / trigger | Affected baseline |
|---|---|---|---|---|---|
| `GAP-AUTH-001` | Named Product Decision Authority and Life-cycle/Quality Authority assignments | `UNKNOWN` | Product Owner | Record attributable assignments before PG0/PG1 approval | All DOC/GOV baselines |
| `GAP-REV-001` | Independent requirements/architecture/HCD reviewer and competence | `BLOCKED` | Product Decision Authority | Name reviewer or retain `Specialist Review Gap`; required before material PG2/PG3 | DOC-04/05/08 |
| `GAP-DDM-001` | Exact target version, edition, configuration and authorized evidence scope | `BLOCKED` | Provenance/GOV owner | Complete lawful target acquisition/audit and freeze inventory as-of baseline | Coverage register |
| `GAP-COV-001` | Material Coverage Inventory ID, denominator, owner and as-of date | `BLOCKED` | Life-cycle/Quality Authority | Assign owner; seed stable material-area IDs through controlled `CHG` | GOV coverage baseline |
| `GAP-STD-001` | PG0 approval, lawful normative access and tailoring matrices | `BLOCKED` | Life-cycle/Quality Authority | Approve standards register and objective-evidence mappings | GOV/DOC-04/05/08/VVP |
| `GAP-FMT-001` | Enabled generic formats and first deep CAD capability profile | `UNKNOWN` | Product Decision Authority | Decide through indexed DOC-02 evidence before PG2/PG4 | DOC-02/06/07 |
| `GAP-PILOT-001` | Representative Pilot Project, intended users and Internal Adoption Authority | `UNKNOWN` | Product Decision Authority | Nominate approved data boundary, participants and authority before pilot acceptance | DOC-03/07, VEV, REL |
| `GAP-LOC-001` | Localized Resource Catalogue, Vietnamese/Japanese reviewers and locale evidence | `BLOCKED` | Product/HCD owner | Assign catalogue and reviewers; execute both 9-cell matrices | DOC-04/08 |
| `GAP-THR-001` | Performance, capacity, availability, RPO/RTO and retention thresholds | `UNKNOWN` | Applicable requirement/risk owners | Establish from internal needs and risk analysis before approval | DOC-04/06, RSK, OPS |
| `GAP-TECH-001` | Runtime stack, API, database, identity provider, deployment and object store | `NOT APPLICABLE` to this increment | Future architecture owner | Decide only after approved PG2 requirements and during PG3 | Future DOC-05/06 |

Accepted ADRs control C1 evolution, external design-tool boundary, modular-monolith direction,
immutable Generations/change sets, Reservation concurrency, generic vaulting/format intelligence and
controlled DOC classes. Proposed ADRs remain input for review, not silently approved authority.

<!-- AUTHOR CONTENT END -->

## Contract references

- [Catalogue contract](../../../../specs/003-controlled-documentation/contracts/document-catalogue.md)
- [Control fields and status](../../../../specs/003-controlled-documentation/contracts/control-fields-and-status.md)
- [Evidence and trace](../../../../specs/003-controlled-documentation/contracts/evidence-and-trace.md)
- [Gate package](../../../../specs/003-controlled-documentation/contracts/gate-package.md)
