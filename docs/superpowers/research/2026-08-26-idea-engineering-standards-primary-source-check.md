# IDEA Engineering Standards Baseline — Primary-source Edition and Status Check

| Field | Value |
|---|---|
| Document ID | `IE-RES-STD-SOURCE-001` |
| Document purpose | Verify edition, public status and high-level scope of the proposed standards baseline using first-party sources |
| Evidence cut-off | 2026-08-26 |
| System of interest | `C1 — IDEA Engineering` |
| Source policy | ISO/IEC/IEEE catalogue pages; NIST; OWASP; SPDX/Linux Foundation; SLSA official project only |
| Content policy | Public metadata and short paraphrases only; no reproduction of copyrighted clauses |
| Conformity position | Research record only; no conformity, compliance or certification claim |

## 1. Reading rules and limitations

This note distinguishes two kinds of statements:

- **Source fact** means a title, edition, publication state, date, lifecycle state or high-level scope supported by the linked first-party page.
- **Project recommendation** means a proposed IDEA Engineering baseline decision derived from those facts. It is not a statement made by the standards publisher.

The public catalogue abstracts are enough to identify editions and intended subject matter, but they are not a substitute for lawfully obtained normative texts. Any future claim of conformity would require controlled access to the applicable publications, explicit tailoring and applicability records, objective evidence, and an appropriate assessment. Repository practices alone do not establish organizational certification.

## 2. Findings that affect the proposed baseline

The following are **source facts** that require either an explicit baseline pin or a watch caveat:

1. `ISO/IEC/IEEE 12207:2026` is published and has replaced the withdrawn 2017 edition. The proposed 2026 pin is valid as of the evidence cut-off.
2. `ISO/IEC/IEEE 29148:2018` remains the published edition, but ISO marks it “to be revised”; an Edition 3 DIS is under development.
3. `ISO 10007:2017` remains published, but ISO marks it “to be revised”; an Edition 4 working draft is under development.
4. NIST SSDF v1.1 remains the final publication. SSDF v1.2 is only a draft as of the evidence cut-off.
5. OWASP ASVS v5.0.0 is the latest stable release. The repository's `master` branch and its generated “bleeding edge” release are not stable baselines.
6. SPDX 3.0.1 is the current stable SPDX community specification; SPDX 3.1-RC1 is a pre-release. The currently published ISO standard, `ISO/IEC 5962:2021`, is specifically SPDX v2.2.1, while an ISO DIS for SPDX v3.0 is under development. These must not be represented as the same publication.
7. SLSA v1.2 is the current Approved specification and supersedes v1.1 as the project version to consider.
8. “ISO/IEC/IEEE 29119 Parts 1–4 and TR 29119-6” should be expanded to exact editions: Part 1:2022; Parts 2–4:2021; and `ISO/IEC TR 29119-6:2021`.
9. `ISO/IEC/IEEE 15289:2019` remains the current published Edition 4, but ISO marks it for revision; its public abstract maps older 2017 life-cycle editions, so IDEA should use it as information-content guidance with an explicit local mapping.
10. `ISO/IEC/IEEE 29119-5:2024` is a published Edition 2 for keyword-driven testing; it is conditional for IDEA and must not be treated as a general test requirement.
11. `ISO/IEC 27034-1:2011` remains current after confirmation in 2022 and has a published Cor 1:2014; it supplies application-security concepts and guidance, not a product certification claim.
12. `ISO/IEC 5962:2021` is the published ISO Edition 1 for SPDX V2.2.1 and is marked for revision; its DIS successor for SPDX V3.0 is not the current published standard.

## 3. ISO/IEC/IEEE lifecycle, requirements, architecture and quality publications

### 3.1 ISO/IEC/IEEE 15288:2023

**Source fact**

- **Exact title and edition:** *ISO/IEC/IEEE 15288:2023 — Systems and software engineering — System life cycle processes*, Edition 2.
- **Publication/status:** Published 2023-05; ISO lifecycle stage 60.60, International Standard published.
- **High-level scope:** Establishes a common process framework and terminology for the life cycle of human-made systems, their elements and systems of systems.
- **Caveat:** The 2015 edition is withdrawn and replaced by this edition.
- **Official URL:** [ISO/IEC/IEEE 15288:2023](https://www.iso.org/standard/81702.html)

### 3.2 ISO/IEC/IEEE 12207:2026

**Source fact**

- **Exact title and edition:** *ISO/IEC/IEEE 12207:2026 — Systems and software engineering — Software life cycle processes*, Edition 2.
- **Publication/status:** Published 2026-04; ISO lifecycle stage 60.60, International Standard published.
- **High-level scope:** Establishes a common software-life-cycle process framework spanning acquisition, supply, development, operation, maintenance and disposal of software products and services.
- **Caveat:** `ISO/IEC/IEEE 12207:2017` is withdrawn and replaced by the 2026 edition. The publication does not mandate a particular life-cycle model, development method, modelling approach or tool.
- **Official URL:** [ISO/IEC/IEEE 12207:2026](https://www.iso.org/standard/90219.html)

### 3.3 ISO/IEC/IEEE 24748-1:2024

**Source fact**

- **Exact title and edition:** *ISO/IEC/IEEE 24748-1:2024 — Systems and software engineering — Life cycle management — Part 1: Guidelines for life cycle management*, Edition 2.
- **Publication/status:** Published 2024-03; ISO lifecycle stage 60.60, International Standard published.
- **High-level scope:** Provides life-cycle management, model, stage, process-application and adaptation guidance that complements 15288 and 12207.
- **Caveat:** The 2018 edition is withdrawn and replaced by this edition.
- **Official URL:** [ISO/IEC/IEEE 24748-1:2024](https://www.iso.org/standard/84709.html)

### 3.4 ISO/IEC/IEEE 29148:2018

**Source fact**

- **Exact title and edition:** *ISO/IEC/IEEE 29148:2018 — Systems and software engineering — Life cycle processes — Requirements engineering*, Edition 2.
- **Publication/status:** Published 2018-11; last confirmed in 2024, but currently at ISO lifecycle stage 90.92, International Standard to be revised.
- **High-level scope:** Addresses requirements-engineering processes and the associated requirements information items for systems, software products and services across their life cycles.
- **Caveat:** An Edition 3 draft, `ISO/IEC/IEEE DIS 29148`, is under development at stage 40.00 (DIS registered on 2026-07-13). The DIS is not the current published edition.
- **Official URLs:** [published 2018 edition](https://www.iso.org/standard/72089.html); [Edition 3 DIS](https://www.iso.org/standard/94091.html)

### 3.5 ISO/IEC/IEEE 42010:2022

**Source fact**

- **Exact title and edition:** *ISO/IEC/IEEE 42010:2022 — Software, systems and enterprise — Architecture description*, Edition 2.
- **Publication/status:** Published 2022-11; ISO lifecycle stage 60.60, International Standard published.
- **High-level scope:** Specifies the structure and expression of architecture descriptions and requirements for architecture viewpoints, frameworks, description languages and model kinds.
- **Caveat:** The standard concerns architecture descriptions, not requirements for the entity itself, and does not prescribe architecting methods, notations, tools or recording media. The 2011 edition is withdrawn.
- **Official URL:** [ISO/IEC/IEEE 42010:2022](https://www.iso.org/standard/74393.html)

### 3.6 ISO/IEC 25010:2023

**Source fact**

- **Exact title and edition:** *ISO/IEC 25010:2023 — Systems and software engineering — Systems and software Quality Requirements and Evaluation (SQuaRE) — Product quality model*, Edition 2.
- **Publication/status:** Published 2023-11; ISO lifecycle stage 60.60, International Standard published.
- **High-level scope:** Defines a nine-characteristic product-quality model for ICT and software products to support quality specification, measurement and evaluation across the product life cycle.
- **Caveat:** The 2011 edition is withdrawn and replaced by the 2023 edition. The model supplies quality categories; it does not supply IDEA-specific thresholds.
- **Official URL:** [ISO/IEC 25010:2023](https://www.iso.org/standard/78176.html)

### 3.7 ISO/IEC 25030:2019

**Source fact**

- **Exact title and edition:** *ISO/IEC 25030:2019 — Systems and software engineering — Systems and software quality requirements and evaluation (SQuaRE) — Quality requirements framework*, Edition 2.
- **Publication/status:** Published 2019-08; last reviewed and confirmed in 2025, ISO lifecycle stage 90.93.
- **High-level scope:** Provides a framework and governance approach for eliciting, defining and using quality requirements for systems, software products and data.
- **Caveat:** It does not cover non-quality requirements and does not prescribe a particular quality measure or development process.
- **Official URL:** [ISO/IEC 25030:2019](https://www.iso.org/standard/72116.html)

### 3.8 ISO/IEC/IEEE 15289:2019

**Source fact**

- **Exact title and edition:** *ISO/IEC/IEEE 15289:2019 — Systems and software engineering — Content of life-cycle information items (documentation)*, Edition 4.
- **Publication/status:** Published 2019-07; confirmed in 2025; ISO currently shows International Standard to be revised.
- **High-level scope:** Defines the purpose and content of identified systems/software life-cycle and service-management information items and provides generic document types for those items.
- **Caveat:** Its public abstract maps the 2017 editions of 12207 and 15288. IDEA uses it only as information-content guidance and maintains a local mapping to `12207:2026` and `15288:2023`.
- **Official URL:** [ISO/IEC/IEEE 15289:2019](https://www.iso.org/standard/74909.html)

## 4. ISO/IEC/IEEE 29119 software-testing publications

### 4.1 ISO/IEC/IEEE 29119-1:2022

**Source fact**

- **Exact title and edition:** *ISO/IEC/IEEE 29119-1:2022 — Software and systems engineering — Software testing — Part 1: General concepts*, Edition 2.
- **Publication/status:** Published 2022-01; ISO lifecycle stage 60.60.
- **High-level scope:** Defines the general software-testing concepts used across the 29119 series.
- **Caveat:** The 2013 edition is withdrawn.
- **Official URL:** [ISO/IEC/IEEE 29119-1:2022](https://www.iso.org/standard/81291.html)

### 4.2 ISO/IEC/IEEE 29119-2:2021

**Source fact**

- **Exact title and edition:** *ISO/IEC/IEEE 29119-2:2021 — Software and systems engineering — Software testing — Part 2: Test processes*, Edition 2.
- **Publication/status:** Published 2021-10; ISO lifecycle stage 60.60.
- **High-level scope:** Defines generic processes for governing, managing and implementing software testing across software-development life-cycle models.
- **Caveat:** The 2013 edition is withdrawn.
- **Official URL:** [ISO/IEC/IEEE 29119-2:2021](https://www.iso.org/standard/79428.html)

### 4.3 ISO/IEC/IEEE 29119-3:2021

**Source fact**

- **Exact title and edition:** *ISO/IEC/IEEE 29119-3:2021 — Software and systems engineering — Software testing — Part 3: Test documentation*, Edition 2.
- **Publication/status:** Published 2021-10; ISO lifecycle stage 60.60.
- **High-level scope:** Specifies test-documentation templates associated with the test processes in Part 2 and usable across life-cycle models.
- **Caveat:** The 2013 edition is withdrawn.
- **Official URL:** [ISO/IEC/IEEE 29119-3:2021](https://www.iso.org/standard/79429.html)

### 4.4 ISO/IEC/IEEE 29119-4:2021

**Source fact**

- **Exact title and edition:** *ISO/IEC/IEEE 29119-4:2021 — Software and systems engineering — Software testing — Part 4: Test techniques*, Edition 2.
- **Publication/status:** Published 2021-10; ISO lifecycle stage 60.60.
- **High-level scope:** Defines test-design techniques for use with the test-design and implementation process in Part 2.
- **Caveat:** The 2015 edition is withdrawn.
- **Official URL:** [ISO/IEC/IEEE 29119-4:2021](https://www.iso.org/standard/79430.html)

### 4.5 ISO/IEC/IEEE 29119-5:2024

**Source fact**

- **Exact title and edition:** *ISO/IEC/IEEE 29119-5:2024 — Software and systems engineering — Software testing — Part 5: Keyword-driven testing*, Edition 2.
- **Publication/status:** Published 2024-12; International Standard published.
- **High-level scope:** Defines a reference approach, framework requirements, interfaces and data exchange for keyword-driven testing.
- **Caveat:** It applies when the project creates keyword-driven test specifications, frameworks or automation; it is not a general requirement for every IDEA test.
- **Official URL:** [ISO/IEC/IEEE 29119-5:2024](https://www.iso.org/standard/87233.html)

### 4.6 ISO/IEC TR 29119-6:2021

**Source fact**

- **Exact title and edition:** *ISO/IEC TR 29119-6:2021 — Software and systems engineering — Software testing — Part 6: Guidelines for the use of ISO/IEC/IEEE 29119 (all parts) in agile projects*, Edition 1, Technical Report.
- **Publication/status:** Published 2021-07; ISO lifecycle stage 60.60.
- **High-level scope:** Provides guidance and mappings for applying the 29119 series in agile life cycles.
- **Caveat:** The exact designation is `ISO/IEC TR 29119-6:2021`, not `ISO/IEC/IEEE 29119-6`.
- **Official URL:** [ISO/IEC TR 29119-6:2021](https://www.iso.org/standard/81293.html)

## 5. Configuration and information-security publications

### 5.1 ISO 10007:2017

**Source fact**

- **Exact title and edition:** *ISO 10007:2017 — Quality management — Guidelines for configuration management*, Edition 3.
- **Publication/status:** Published 2017-03; confirmed in 2023, but currently at ISO lifecycle stage 90.92, International Standard to be revised.
- **High-level scope:** Provides configuration-management guidance supporting products and services from concept through disposal.
- **Caveat:** An Edition 4 `ISO/WD 10007` is under development; ISO shows stage 20.60. A 2019-07 corrected version affects Spanish only, not English or French.
- **Official URLs:** [published 2017 edition](https://www.iso.org/standard/70400.html); [Edition 4 working draft](https://www.iso.org/standard/92170.html)

### 5.2 ISO/IEC 27001:2022

**Source fact**

- **Exact title and edition:** *ISO/IEC 27001:2022 — Information security, cybersecurity and privacy protection — Information security management systems — Requirements*, Edition 3.
- **Publication/status:** Published 2022-10; International Standard published. ISO lists one amendment.
- **High-level scope:** Specifies requirements for establishing, implementing, maintaining and continually improving an organizational information security management system using risk management.
- **Caveat:** This is an organizational management-system requirements standard. A repository or software product cannot by itself establish organizational ISO/IEC 27001 certification.
- **Official URL:** [ISO/IEC 27001:2022](https://www.iso.org/standard/27001)

### 5.3 ISO/IEC 27001:2022/Amd 1:2024

**Source fact**

- **Exact title and edition:** *ISO/IEC 27001:2022/Amd 1:2024 — Information security, cybersecurity and privacy protection — Information security management systems — Requirements — Amendment 1: Climate action changes*, Amendment to Edition 3.
- **Publication/status:** Published 2024-02; ISO lifecycle stage 60.60. ISO lists a corrected French version dated 2024-08.
- **High-level scope:** Applies the named climate-action amendment to ISO/IEC 27001:2022.
- **Caveat:** It is an amendment to be read with the 2022 base publication, not a standalone replacement edition.
- **Official URL:** [ISO/IEC 27001:2022/Amd 1:2024](https://www.iso.org/standard/88435.html)

### 5.4 ISO/IEC 27002:2022

**Source fact**

- **Exact title and edition:** *ISO/IEC 27002:2022 — Information security, cybersecurity and privacy protection — Information security controls*, Edition 3.
- **Publication/status:** Published 2022-02; ISO lifecycle stage 60.60. ISO lists a corrected English version dated 2022-03.
- **High-level scope:** Provides a reference set of generic information-security controls and implementation guidance, including support for an ISO/IEC 27001 ISMS.
- **Caveat:** ISO explicitly states that 27002 is guidance and is not itself certifiable; certification relates to ISO/IEC 27001.
- **Official URL:** [ISO/IEC 27002:2022](https://www.iso.org/standard/75652.html)

### 5.5 ISO/IEC 27034-1:2011

**Source fact**

- **Exact title and edition:** *ISO/IEC 27034-1:2011 — Information technology — Security techniques — Application security — Part 1: Overview and concepts*, Edition 1, with Cor 1:2014.
- **Publication/status:** Published 2011-11; confirmed in 2022; the corrigendum is published.
- **High-level scope:** Introduces application-security definitions, concepts, principles and processes for in-house, acquired and outsourced applications.
- **Caveat:** It is application-security guidance. It does not establish product architecture, complete modern verification coverage or ISO/IEC 27001 certification.
- **Official URL:** [ISO/IEC 27034-1:2011](https://www.iso.org/standard/44378.html)

## 6. Secure-development and software-supply-chain sources

### 6.1 NIST SP 800-218 — SSDF Version 1.1

**Source fact**

- **Exact title/version:** *NIST SP 800-218 — Secure Software Development Framework (SSDF) Version 1.1: Recommendations for Mitigating the Risk of Software Vulnerabilities*.
- **Publication/status:** Final, published 2022-02-03.
- **High-level scope:** Defines outcome-oriented, high-level secure software-development practices that can be integrated into different SDLC implementations to reduce vulnerabilities and their impact.
- **Caveat:** `SP 800-218 Rev. 1 — SSDF Version 1.2` was released as an Initial Public Draft on 2025-12-17 and is not final as of the evidence cut-off.
- **Official URLs:** [SSDF v1.1 final](https://csrc.nist.gov/pubs/sp/800/218/final); [NIST SSDF publications/status page](https://csrc.nist.gov/Projects/ssdf/publications); [SSDF v1.2 initial public draft](https://csrc.nist.gov/pubs/sp/800/218/r1/ipd)

### 6.2 OWASP Application Security Verification Standard 5.0.0

**Source fact**

- **Exact title/version:** *OWASP Application Security Verification Standard 5.0.0*.
- **Publication/status:** Latest stable version, dated May 2025; release published 2025-05-30.
- **High-level scope:** Provides open security requirements for designing, developing and testing web applications and web services.
- **Caveat:** OWASP describes the repository `master` branch as bleeding edge and potentially in progress. Its generated GitHub “latest” release can therefore be a preview rather than the latest stable release. OWASP recommends version-qualified requirement identifiers because identifiers can change between releases.
- **Official URLs:** [OWASP project page](https://owasp.org/www-project-application-security-verification-standard/); [stable v5.0.0 release](https://github.com/OWASP/ASVS/releases/tag/v5.0.0_release); [versioned source branch](https://github.com/OWASP/ASVS/tree/v5.0.0_release)

### 6.3 SPDX Specification 3.0.1

**Source fact**

- **Exact title/version:** *The System Package Data Exchange® (SPDX®) Specification Version 3.0.1*.
- **Publication/status:** Current stable community specification; patch release published 2024-12-17.
- **High-level scope:** Defines a standardized representation for software bills of materials and related software-supply-chain data.
- **Caveats:**
  - SPDX 3.1-RC1, released 2026-01-24, is explicitly a pre-release leading toward general availability and is not the stable baseline.
  - The published ISO standard is *ISO/IEC 5962:2021 — Information technology — SPDX® Specification V2.2.1*, Edition 1, published 2021-08 and now marked “to be revised.”
  - `ISO/IEC DIS 5962 — Information technology — SPDX® Specification V3.0` is under development at stage 40.60. Therefore SPDX community specification 3.0.1 must not be described as the currently published ISO/IEC 5962 edition.
- **Official URLs:** [SPDX Specification 3.0.1](https://spdx.github.io/spdx-spec/v3.0.1/); [SPDX 3.0.1 release](https://github.com/spdx/spdx-spec/releases/tag/3.0.1); [SPDX 3.1-RC1 pre-release](https://github.com/spdx/spdx-spec/releases/tag/v3.1-RC1); [ISO/IEC 5962:2021](https://www.iso.org/standard/81870.html); [ISO/IEC DIS 5962](https://www.iso.org/standard/93810.html)

### 6.4 ISO/IEC 5962:2021

**Source fact**

- **Exact title and edition:** *ISO/IEC 5962:2021 — Information technology — SPDX® Specification V2.2.1*, Edition 1.
- **Publication/status:** Published 2021-08; ISO currently shows International Standard to be revised and identifies a DIS successor for SPDX V3.0.
- **High-level scope:** Defines a data format for communicating component and metadata information associated with software packages.
- **Caveat:** This ISO publication represents SPDX V2.2.1. It must not be represented as identical to community SPDX Specification 3.0.1, and the DIS successor is not yet the published replacement.
- **Official URL:** [ISO/IEC 5962:2021](https://www.iso.org/standard/81870.html)

### 6.5 SLSA Specification Version 1.2

**Source fact**

- **Exact title/version:** *SLSA specification, Version 1.2*.
- **Publication/status:** Approved; announced as the latest release on 2025-11-24.
- **High-level scope:** Describes incrementally stronger software-supply-chain security guarantees through tracks and levels and defines or recommends attestation formats, including provenance.
- **Caveat:** Version 1.2 is backward compatible with 1.1 and replaces it as the current Approved version. A SLSA version does not by itself select an IDEA target track or level.
- **Official URLs:** [SLSA v1.2 Approved specification](https://slsa.dev/spec/v1.2/); [official v1.2 announcement](https://slsa.dev/blog/2025/11/announce-slsa-v1.2); [specification stages and versioning](https://slsa.dev/spec-stages)

## 7. Project recommendations for IDEA Engineering

Everything in this section is a **project recommendation**, not a fact asserted by the publishers.

| Baseline area | Recommended controlled pin | Recommended disposition |
|---|---|---|
| System life cycle | `ISO/IEC/IEEE 15288:2023` | Retain the current exact pin. |
| Software life cycle | `ISO/IEC/IEEE 12207:2026` | Retain; remove any residual 2017 references from later governed artifacts. |
| Life-cycle tailoring guidance | `ISO/IEC/IEEE 24748-1:2024` | Retain as standards-guided tailoring support. |
| Information-item content | `ISO/IEC/IEEE 15289:2019` | Use as content guidance only; maintain local mappings to the selected 12207/15288 editions and watch its revision. |
| Requirements engineering | `ISO/IEC/IEEE 29148:2018` | Retain as the published baseline; add a version-watch record for Edition 3 and perform impact assessment only after a replacement is published. |
| Architecture description | `ISO/IEC/IEEE 42010:2022` | Retain; do not imply that it mandates a repository tree, technology stack or architecture method. |
| Product quality | `ISO/IEC 25010:2023` | Retain as the quality-model vocabulary; derive measurable IDEA thresholds separately. |
| Quality requirements | `ISO/IEC 25030:2019` | Retain for governing measurable quality requirements. |
| Software testing | `29119-1:2022`, `29119-2:2021`, `29119-3:2021`, `29119-4:2021`, `ISO/IEC TR 29119-6:2021` | Replace the unversioned family shorthand with this exact list; keep the set standards-guided and tailor documentation to project risk. |
| Keyword-driven testing | `ISO/IEC/IEEE 29119-5:2024` | Activate only if IDEA adopts keyword-driven test specifications, frameworks or automation. |
| Configuration management | `ISO 10007:2017` | Retain as standards-guided; watch Edition 4 and do not pre-emptively baseline its working draft. |
| Information-security governance | `ISO/IEC 27001:2022 + Amd 1:2024`; `ISO/IEC 27002:2022` | Retain as standards-guided pending an organizational ISMS decision; make no product or repository certification claim. |
| Application security | `ISO/IEC 27034-1:2011 + Cor 1:2014` | Use as application-security concepts and process guidance alongside risk-based security requirements; do not treat it as a certification basis. |
| Secure development | `NIST SP 800-218, SSDF v1.1` | Retain the final version; track v1.2 as draft only and reassess when NIST publishes a final revision. |
| Web/API verification | `OWASP ASVS v5.0.0` | Pin the stable release and use version-qualified IDs such as `v5.0.0-…`; apply only to relevant Web/API surfaces. |
| SBOM exchange | `SPDX Specification v3.0.1` | Pin the stable community specification for planned IDEA SBOM work, subject to a later tooling/interoperability ADR; explicitly avoid claiming that v3.0.1 is `ISO/IEC 5962:2021`. |
| SBOM ISO compatibility reference | `ISO/IEC 5962:2021` | Keep as a compatibility/reference entry for SPDX V2.2.1; reassess after the ISO revision is published. |
| Supply-chain integrity | `SLSA v1.2` | Pin the current Approved version; choose target track/level only after build and release architecture plus measurable risk requirements exist. |

## 8. Version-watch register

These entries should be rechecked before the affected baseline is approved or whenever the publisher announces a final replacement:

| Watch item | State at 2026-08-26 | Trigger for IDEA impact review |
|---|---|---|
| ISO/IEC/IEEE 29148 Edition 3 | DIS, under development | Publication of a replacement International Standard |
| ISO/IEC/IEEE 15289 revision | International Standard to be revised; successor under development | Publication of a replacement International Standard or a mapping-impacting draft decision |
| ISO 10007 Edition 4 | Working draft, under development | Publication of a replacement International Standard |
| NIST SSDF v1.2 / SP 800-218 Rev. 1 | Initial Public Draft | NIST final publication |
| SPDX 3.1 | RC1 pre-release | Stable community release |
| ISO/IEC 5962 revision for SPDX v3.0 | DIS, under development | Publication of the revised International Standard |
| OWASP ASVS 5.0.x | Stable 5.0.0; patch release planned by project | New stable release plus mapping/impact review |
| SLSA | v1.2 Approved | New Approved specification, not a draft/candidate page |

## 9. Baseline-control rule

The controlled standards register should store, at minimum, the exact identifier/version, title, publisher, official URL, status observed date, IDEA applicability, classification (`STANDARD`, `STANDARD-GUIDED` or `PROJECT-CONVENTION`), owner, lawful-access status, tailoring/deviation decision, affected information items and next review trigger. Automated version monitoring may notify the owner, but it must not silently replace a governed baseline.
