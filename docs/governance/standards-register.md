# IDEA Engineering Standards Applicability and Version Register

| Field | Value |
|---|---|
| Document ID | `IE-GOV-STD-001` |
| Artifact status | Proposed for Product Owner review and PG0 approval |
| System of interest | `C1 — IDEA Engineering` |
| Baseline snapshot | 2026-08-26 |
| Accountable role | Life-cycle and Quality Authority |
| Approval authority | Product Owner with the applicable PG0 authorities |
| Supersedes | None |
| Review cadence | Event-driven and at least annually |
| Conformity claim | None |

## 1. Purpose and reading rule

This register is the product-local source of truth for:

- the standards and open specifications selected for IDEA Engineering;
- the exact editions currently baselined or watched;
- how each source is intended to be used by the project;
- which product information items and gates operationalize it;
- which decisions remain project conventions;
- when the baseline must be checked or changed.

Use this file before repeating standards research:

| Question | Read |
|---|---|
| Which edition and official page are we using? | Sections 3 and 9 |
| Which source applies to the work I am doing? | Section 4 |
| Which source contributes to a product gate? | Section 5 |
| Is the source actually adopted or only guidance? | Sections 2, 3 and 6 |
| Has a newer edition appeared? | Section 7 |
| What does a clause specifically require? | The lawfully obtained normative text and approved tailoring matrix, not this summary |

The supporting public-source verification note is
[`IE-RES-STD-SOURCE-001`](../superpowers/research/2026-08-26-idea-engineering-standards-primary-source-check.md).
The architecture that applies this baseline is
[`IE-ARC-BOOT-001`](../superpowers/specs/2026-08-26-idea-engineering-repository-bootstrap-pg0-design.md).

This register intentionally paraphrases only public scope information. It does not reproduce protected normative clauses.

## 2. Classification and approval state

### 2.1 Project classification

| Classification | Meaning in IDEA Engineering |
|---|---|
| `STANDARD` | The named edition is intended to become the normative basis for the identified project process or information item after lawful access, tailoring and PG0 approval. |
| `STANDARD-GUIDED` | Selected concepts or practices are deliberately used, but the project does not claim conformity to the entire publication. |
| `STANDARD-GUIDED, CONDITIONAL` | Guidance becomes applicable only when the named technology, technique, surface or organizational scope exists. |
| `REFERENCE/WATCH` | The item explains compatibility or a future change but is not currently an adopted project basis. |
| `PROJECT-CONVENTION` | A controlled local choice used to realize project outcomes; it is not mandated by the cited publication. |

### 2.2 Current approval state

All entries in this document are a **proposed PG0 baseline** until this artifact and its tailoring approach are approved. A row marked `STANDARD` is therefore a target classification, not a present conformity statement.

Before any `STANDARD` row becomes an approved normative project basis, IDEA Engineering must evidence:

1. lawful access to the exact normative edition;
2. an applicability and tailoring map;
3. accountable and approving roles;
4. required objective evidence;
5. accepted deviations and associated risk;
6. the effective product baseline and review date.

Public catalog pages are adequate for edition selection and this design baseline. They are not adequate for clause-level conformance assessment.

## 3. Master standards register

### 3.1 Life-cycle and information management

| ID | Source and baselined edition | Project class | IDEA Engineering use | Operationalized through | Status note |
|---|---|---|---|---|---|
| `STD-LC-001` | [ISO/IEC/IEEE 15288:2023](https://www.iso.org/standard/81702.html), *Systems and software engineering — System life cycle processes* | `STANDARD` | Product/system life-cycle backbone from stakeholder need through realization, operation, support and retirement | `GOV`, `CON`, `REQ`, `ARC`, `RSK`, `VVP`, `REL`, `OPS`; PG0–PG7 | Published Edition 2 |
| `STD-LC-002` | [ISO/IEC/IEEE 12207:2026](https://www.iso.org/standard/90219.html), *Systems and software engineering — Software life cycle processes* | `STANDARD` | Software-system and software-element life-cycle backbone integrated with `STD-LC-001` | `GOV`, `REQ`, `ARC`, `CHG`, `VVP`, `VEV`, `REL`, `OPS`; PG0–PG7 | Published Edition 2; replaces the withdrawn 2017 edition |
| `STD-LC-003` | [ISO/IEC/IEEE 24748-1:2024](https://www.iso.org/standard/84709.html), *Systems and software engineering — Life cycle management — Part 1: Guidelines for life cycle management* | `STANDARD-GUIDED` | Tailor one integrated life cycle across the system and software backbones without creating duplicate bureaucracy | `GOV`, tailoring register and gate model; PG0 and material scope changes | Published Edition 2 |
| `STD-INFO-001` | [ISO/IEC/IEEE 15289:2019](https://www.iso.org/standard/74909.html), *Systems and software engineering — Content of life-cycle information items (documentation)* | `STANDARD-GUIDED` | Shape the purpose and minimum useful content of controlled plans, descriptions, specifications, reports, requests and records | All controlled information-item classes; PG0–PG7 | Published Edition 4; confirmed in 2025 and under revision watch; local mappings must reflect newer 15288/12207 editions |

### 3.2 Requirements, architecture and quality

| ID | Source and baselined edition | Project class | IDEA Engineering use | Operationalized through | Status note |
|---|---|---|---|---|---|
| `STD-REQ-001` | [ISO/IEC/IEEE 29148:2018](https://www.iso.org/standard/72089.html), *Systems and software engineering — Life cycle processes — Requirements engineering* | `STANDARD` | Stakeholder needs and uniquely identified, necessary, verifiable and traceable requirements | `CON`, `REQ`, acceptance criteria and trace links; PG1–PG2 | Published Edition 2; confirmed in 2024 and under replacement watch |
| `STD-ARC-001` | [ISO/IEC/IEEE 42010:2022](https://www.iso.org/standard/74393.html), *Software, systems and enterprise — Architecture description* | `STANDARD` | Architecture descriptions organized around the entity of interest, stakeholders, concerns, viewpoints, views, models and rationale | `ARC`, architecture decisions and interface ownership; PG3 | Published Edition 2 |
| `STD-QUAL-001` | [ISO/IEC 25010:2023](https://www.iso.org/standard/78176.html), *Systems and software engineering — Systems and software Quality Requirements and Evaluation (SQuaRE) — Product quality model* | `STANDARD` | Coverage model for product-quality concerns; prevents important quality characteristics from being omitted | Quality model, `REQ`, `ARC`, `RSK`, `VVP`; PG2–PG5 | Published Edition 2 |
| `STD-QUAL-002` | [ISO/IEC 25030:2019](https://www.iso.org/standard/72116.html), *Systems and software engineering — Systems and software Quality Requirements and Evaluation (SQuaRE) — Quality requirements framework* | `STANDARD` | Convert stakeholder quality needs into governed, measurable quality requirements and evaluation evidence | Quality objectives, `REQ`, acceptance criteria, `VVP`, `VEV`; PG2–PG5 | Published Edition 2; confirmed in 2025 |

### 3.3 Testing and verification

| ID | Source and baselined edition | Project class | IDEA Engineering use | Operationalized through | Status note |
|---|---|---|---|---|---|
| `STD-TEST-001` | [ISO/IEC/IEEE 29119-1:2022](https://www.iso.org/standard/81291.html), *Software and systems engineering — Software testing — Part 1: General concepts* | `STANDARD-GUIDED` | Common testing concepts and vocabulary | `VVP`, `VEV`; PG3–PG5 | Published Edition 2 |
| `STD-TEST-002` | [ISO/IEC/IEEE 29119-2:2021](https://www.iso.org/standard/79428.html), *Software and systems engineering — Software testing — Part 2: Test processes* | `STANDARD-GUIDED` | Risk-proportionate test governance, management and implementation processes | `VVP`, increment test strategy, `VEV`; PG3–PG5 | Published Edition 2 |
| `STD-TEST-003` | [ISO/IEC/IEEE 29119-3:2021](https://www.iso.org/standard/79429.html), *Software and systems engineering — Software testing — Part 3: Test documentation* | `STANDARD-GUIDED` | Tailored test information items; combine records where identity, ownership, configuration and result remain clear | `VVP`, test specifications/results and acceptance report; PG3–PG5 | Published Edition 2 |
| `STD-TEST-004` | [ISO/IEC/IEEE 29119-4:2021](https://www.iso.org/standard/79430.html), *Software and systems engineering — Software testing — Part 4: Test techniques* | `STANDARD-GUIDED` | Select and justify appropriate test-design techniques | Test design and coverage rationale; PG4–PG5 | Published Edition 2 |
| `STD-TEST-005` | [ISO/IEC/IEEE 29119-5:2024](https://www.iso.org/standard/87233.html), *Software and systems engineering — Software testing — Part 5: Keyword-driven testing* | `STANDARD-GUIDED, CONDITIONAL` | Apply only if IDEA adopts keyword-driven testing or compatible tool interchange | Conditional `VVP` and test assets | Published Edition 2; not part of the lean mandatory baseline |
| `STD-TEST-006` | [ISO/IEC TR 29119-6:2021](https://www.iso.org/standard/81293.html), *Software and systems engineering — Software testing — Part 6: Guidelines for the use of ISO/IEC/IEEE 29119 (all parts) in agile projects* | `STANDARD-GUIDED` | Tailor the family for iterative/agile delivery without weakening controlled evidence | `VVP`, increment/review workflow; PG3–PG5 | Published Technical Report, Edition 1 |

### 3.4 Configuration and security governance

| ID | Source and baselined edition | Project class | IDEA Engineering use | Operationalized through | Status note |
|---|---|---|---|---|---|
| `STD-CM-001` | [ISO 10007:2017](https://www.iso.org/standard/70400.html), *Quality management — Guidelines for configuration management* | `STANDARD-GUIDED` | Configuration planning, identification, change control, status accounting and audit | `CMP`, `CHG`, baselines and `REL`; PG0–PG7 | Published Edition 3; Edition 4 is under development and is not yet the baseline |
| `STD-SEC-001` | [ISO/IEC 27001:2022](https://www.iso.org/standard/27001) plus [Amendment 1:2024](https://www.iso.org/standard/88435.html), *Information security, cybersecurity and privacy protection — Information security management systems — Requirements* | `STANDARD-GUIDED, CONDITIONAL` | Organization-level information-security governance when IDEA Engineering is within an approved ISMS scope | `GOV`, `RSK`, supplier/incident/operations controls; PG0–PG7 | Published Edition 3 plus published amendment; certification is an organizational decision, not a repository or product claim |
| `STD-SEC-002` | [ISO/IEC 27002:2022](https://www.iso.org/standard/75652.html), *Information security, cybersecurity and privacy protection — Information security controls* | `STANDARD-GUIDED` | Risk-selected security-control guidance for access, assets, change, suppliers, incidents and operations | `RSK`, security requirements, `OPS`; PG2–PG7 | Published Edition 3; guidance is not independently certifiable |
| `STD-SEC-003` | [ISO/IEC 27034-1:2011](https://www.iso.org/standard/44378.html) with Cor 1:2014, *Information technology — Security techniques — Application security — Part 1: Overview and concepts* | `STANDARD-GUIDED` | Integrate application-security concerns into application-management and engineering processes | Security `REQ`, threat/risk treatment, `ARC`, `VVP`; PG2–PG5 | Published Edition 1; confirmed in 2022 |

### 3.5 Primary open security and supply-chain supplements

| ID | Source and baselined edition | Project class | IDEA Engineering use | Operationalized through | Status note |
|---|---|---|---|---|---|
| `STD-SSD-001` | [NIST SP 800-218, SSDF v1.1](https://csrc.nist.gov/pubs/sp/800/218/final), *Secure Software Development Framework (SSDF) Version 1.1* | `STANDARD-GUIDED` | Secure-development outcomes integrated into the 15288/12207 life cycle | Security `REQ`, `RSK`, `CHG`, release/vulnerability practices; PG0–PG7 | Final publication; v1.2 is watched as a draft and does not replace v1.1 |
| `STD-WEB-001` | [OWASP ASVS 5.0.0](https://owasp.org/www-project-application-security-verification-standard/) | `STANDARD-GUIDED, CONDITIONAL` | Version-pinned, verifiable requirements for IDEA Web and applicable web-service/API surfaces | Security `REQ`, Web/API `ARC`, `VVP`, `VEV`; PG2–PG5 | Stable project release dated 2025-05; not a native-desktop standard |
| `STD-SBOM-001` | [SPDX Specification 3.0.1](https://spdx.github.io/spdx-spec/v3.0.1/) ([release](https://github.com/spdx/spdx-spec/releases/tag/3.0.1)) | `STANDARD-GUIDED` | Machine-readable SBOM, component/license identity, relationships and provenance-related metadata | Dependency inventory, release SBOM and `REL`; PG4–PG6 | Current stable project specification at the snapshot date; SPDX 3.1-RC1 is pre-release; each release must pin its exact schema |
| `STD-SBOM-002` | [ISO/IEC 5962:2021](https://www.iso.org/standard/81870.html), *Information technology — SPDX® Specification V2.2.1* | `REFERENCE/WATCH` | Record the relationship between the ISO-published SPDX edition and newer SPDX project schemas | Schema-selection ADR and compatibility evidence | The published ISO edition represents SPDX 2.2.1; it must not be called identical to SPDX 3.0.1 |
| `STD-PROV-001` | [SLSA v1.2](https://slsa.dev/spec/v1.2/) | `STANDARD-GUIDED` | Incremental source/build integrity and verifiable release provenance | Build controls, provenance attestations and `REL`; PG4–PG6 | Approved specification at the snapshot date |

## 4. Fast routing by engineering activity

| When doing this work | Start with | Required IDEA output |
|---|---|---|
| Define or tailor the life cycle | `STD-LC-001`, `STD-LC-002`, `STD-LC-003` | `GOV`, process/tailoring map and gate model |
| Define controlled artifact content | `STD-INFO-001` | Information-item schema with identity, owner, status, version, approval and traceability |
| Establish product context or stakeholder needs | `STD-LC-001`, `STD-REQ-001` | `CON` |
| Write or review requirements | `STD-REQ-001`, `STD-QUAL-001`, `STD-QUAL-002` | `REQ` with measurable acceptance and verification method |
| Describe or review architecture | `STD-ARC-001` plus requirement/quality sources | `ARC`, viewpoints/views/models, interfaces and ADRs |
| Plan testing and V&V | `STD-TEST-001`–`STD-TEST-004`; `STD-TEST-006` for iterative delivery | `VVP` and tailored `VEV` records |
| Manage controlled versions and changes | `STD-CM-001` plus life-cycle sources | `CMP`, `CHG`, identified baselines and status accounting |
| Govern organizational information security | `STD-SEC-001`, `STD-SEC-002` | ISMS-scoped project controls and risk evidence where applicable |
| Engineer application security | `STD-SEC-003`, `STD-SSD-001`; add `STD-WEB-001` for Web/API | Security requirements, threat/risk treatment and verification evidence |
| Produce an SBOM | `STD-SBOM-001`; consult `STD-SBOM-002` for consumer compatibility | Version-pinned SBOM in `REL` |
| Prove source/build lineage | `STD-PROV-001` | Version-pinned provenance/attestation in `REL` |
| Make a repository, stack or tooling choice | Requirements, quality attributes and an ADR | `PROJECT-CONVENTION`; no cited standard decides the choice |

## 5. Gate crosswalk

| Gate | Principal standards input | Minimum use at the gate |
|---|---|---|
| `PG0` | 15288, 12207, 24748-1, 15289, 10007; security governance as applicable | Approve system boundary, standards/tailoring register, roles, gates, clean-room/configuration foundations and version watch |
| `PG1` | 15288, 12207, 29148 | Baseline stakeholders, operational context, authorized findings, needs, assumptions and initial risks |
| `PG2` | 29148, 25010, 25030; 27002/27034/SSDF/ASVS as applicable | Baseline functional, interface, data, quality, security and operational requirements with measurable acceptance and traceability |
| `PG3` | 42010, quality/security sources, 29119 family | Baseline architecture description, decisions, quality scenarios, risk treatment and V&V strategy |
| `PG4` | 12207, 29119, 10007, SSDF, SPDX/SLSA as applicable | Authorize a bounded change with impact, test design, controlled dependencies/toolchain and rollback approach |
| `PG5` | 29119 family, requirements/quality/security sources | Verify the exact controlled configuration; retain results, defects, waivers, coverage and acceptance disposition |
| `PG6` | 15288/12207, 10007, SSDF, SPDX, SLSA | Authorize an immutable release with configuration audit, verification summary, hashes, SBOM, provenance, risk and recovery evidence |
| `PG7` | 15288/12207, security and configuration guidance | Operate, support, respond, change and retire through controlled records and feedback |

The gates are a `PROJECT-CONVENTION`. The cited sources inform the outcomes and information, but do not prescribe the names `PG0`–`PG7`.

## 6. Tailoring and access register

### 6.1 Baseline state

| Item | Current state on 2026-08-26 | Required before PG0 PASS |
|---|---|---|
| Public edition/source verification | Complete; see `IE-RES-STD-SOURCE-001` | Review findings and resolve any discrepancy |
| Lawful normative-text access for `STANDARD` rows | Not evidenced in the product repository | Record access authority/location without committing licensed text |
| Clause/process applicability map | Not yet created | Map apply/tailor/not-applicable decisions to IDEA processes and evidence |
| Accountable role assignment | Roles defined; named assignments not yet baselined | Assign accountable and approving people or record the gate as BLOCKED |
| Tailoring/deviation approval | Not yet approved | Record rationale, risk, approver and effective baseline |
| Conformity/certification scope | None | No action unless a future contractual or organizational decision establishes scope |

### 6.2 Required tailoring-record fields

Every clause/process-level tailoring record must include:

- standard ID and exact edition/amendment;
- clause/process or topic reference without copying protected text;
- disposition: `APPLY`, `TAILOR` or `NOT-APPLICABLE`;
- mapped IDEA process, information item and gate;
- accountable and approving roles;
- objective evidence and verification method;
- rationale, deviation and associated risk;
- effective product baseline;
- review trigger/date and supersession history.

One integrated project process may satisfy multiple sources. Do not create duplicate documents solely because two standards address the same outcome.

## 7. Version-watch register

| Item | Snapshot situation | Required action |
|---|---|---|
| ISO/IEC/IEEE 12207 | 2026 Edition 2 is published and the 2017 edition is withdrawn | Use 2026; impact-map any inherited 2017-based process |
| ISO/IEC/IEEE 29148 | 2018 remains published while a replacement is under development | Keep 2018 baselined; reassess only when a replacement is published |
| ISO/IEC/IEEE 15289 | 2019 remains published but is under revision watch and predates the selected 12207/15288 editions | Use as content guidance; maintain explicit current local mappings |
| ISO 10007 | 2017 remains published while Edition 4 is under development | Use 2017 guidance; reassess after publication, not during draft stage |
| NIST SSDF | v1.1 is final while v1.2 is draft | Keep v1.1; drafts may inform research only |
| OWASP ASVS | 5.0.0 is the stable snapshot baseline | Pin the exact release in requirements and tests; reassess new stable releases |
| SPDX 3.1 | RC1 pre-release | Do not baseline; reassess after stable community release |
| SPDX / ISO/IEC 5962 | SPDX project 3.0.1 is newer than ISO/IEC 5962:2021, which represents SPDX 2.2.1 | Select and pin an operational schema after compatibility validation; never conflate the editions |
| SLSA | v1.2 is Approved at the snapshot date | Pin the exact version in provenance policy and reassess later Approved revisions |

### 7.1 Review triggers

The Life-cycle and Quality Authority opens a controlled review when any of the following occurs:

- an owning organization publishes, amends, confirms, withdraws or supersedes a registered source;
- one year passes since the last source-status review;
- a customer, contract, regulator or certification scope introduces a requirement;
- IDEA adds a materially new system boundary, product profile, deployment model or security exposure;
- C2 or Platform D becomes real rather than hypothetical;
- a tool requires a different SBOM, provenance, test or interoperability version;
- an audit finds the project evidence and tailoring map inconsistent.

### 7.2 Change rule

A new edition never silently replaces the product baseline. It creates a `CHG` record with impact analysis across governance, requirements, architecture, tests, configuration, security, operations and releases. The old baseline remains identifiable until the migration decision is approved.

Drafts may inform research but do not replace published entries unless the project explicitly creates a time-bounded experimental decision.

## 8. What these sources do not decide

The registered sources do not by themselves determine:

- Web/CAD/Office source silos;
- monorepo versus multi-repo;
- folder names or document filenames;
- Git host, branch names or pull-request mechanics;
- agile, waterfall or a named hybrid method;
- programming language, UI framework, database, object store or cloud provider;
- add-ins versus external integration;
- the exact C1 module boundaries;
- whether and when C2 or Platform D exists.

Those are controlled `PROJECT-CONVENTION` or architecture decisions justified by needs, requirements, quality attributes, risk and configuration-control cost. Standards govern how such decisions are specified, reviewed, traced, verified and changed; they do not make the product decision for us.

## 9. Official source ledger

All source-status facts in this baseline were checked against first-party pages on 2026-08-26. The detailed evidence note records the verification result; this ledger is the durable navigation index.

| Source group | Official navigation |
|---|---|
| System/software life cycle | [15288:2023](https://www.iso.org/standard/81702.html), [12207:2026](https://www.iso.org/standard/90219.html), [24748-1:2024](https://www.iso.org/standard/84709.html) |
| Information items | [15289:2019](https://www.iso.org/standard/74909.html) |
| Requirements and architecture | [29148:2018](https://www.iso.org/standard/72089.html), [42010:2022](https://www.iso.org/standard/74393.html) |
| Product quality | [25010:2023](https://www.iso.org/standard/78176.html), [25030:2019](https://www.iso.org/standard/72116.html) |
| Testing | [29119-1:2022](https://www.iso.org/standard/81291.html), [29119-2:2021](https://www.iso.org/standard/79428.html), [29119-3:2021](https://www.iso.org/standard/79429.html), [29119-4:2021](https://www.iso.org/standard/79430.html), [29119-5:2024](https://www.iso.org/standard/87233.html), [TR 29119-6:2021](https://www.iso.org/standard/81293.html) |
| Configuration management | [ISO 10007:2017](https://www.iso.org/standard/70400.html), [working draft Edition 4](https://www.iso.org/standard/92170.html) |
| Information/application security | [27001:2022](https://www.iso.org/standard/27001), [27001 Amendment 1:2024](https://www.iso.org/standard/88435.html), [27002:2022](https://www.iso.org/standard/75652.html), [27034-1:2011](https://www.iso.org/standard/44378.html) |
| Secure software development | [NIST SP 800-218 SSDF v1.1](https://csrc.nist.gov/pubs/sp/800/218/final), [NIST SSDF publications](https://csrc.nist.gov/Projects/ssdf/publications) |
| Web/API verification | [OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/) |
| SBOM | [SPDX specifications](https://spdx.dev/use/specifications/), [SPDX 3.0.1 specification](https://spdx.github.io/spdx-spec/v3.0.1/), [SPDX 3.0.1 release](https://github.com/spdx/spdx-spec/releases/tag/3.0.1), [ISO/IEC 5962:2021](https://www.iso.org/standard/81870.html) |
| Build/source provenance | [SLSA v1.2](https://slsa.dev/spec/v1.2/) |

## 10. Copyright, conformity and certification boundary

- Do not commit licensed ISO/IEC/IEEE normative text unless its license explicitly permits repository distribution.
- Record the controlled access location and authorized readers rather than copying protected material.
- Do not state `ISO compliant`, `ISO conformant` or `certified` without an approved scope, clause/process assessment, objective evidence and the applicable formal decision.
- ISO/IEC 27001 certification, if pursued, belongs to an organizational ISMS scope; repository structure cannot create it.
- An official title, edition and high-level public scope summary are navigation metadata, not a substitute for the normative publication.

## 11. Revision history

| Version | Date | Status | Change |
|---|---|---|---|
| 0.1 | 2026-08-26 | Proposed | Initial product-local register derived from independently verified public sources and the approved architecture direction |
