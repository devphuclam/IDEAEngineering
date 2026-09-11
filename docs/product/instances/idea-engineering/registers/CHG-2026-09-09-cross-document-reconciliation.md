# IDEA Engineering Cross-document Source Reconciliation

## Control envelope

| Field | Recorded value |
|---|---|
| Stable Supporting Record ID | `IE-CHG-SOURCE-RECON-001` |
| Supporting Class / Version | `CHG` / `Draft 0.1` |
| Date | 09-09-2026 |
| Owner / internal reviewer | Principal Product Author prepares; project user requested the overall consistency cleanup; review of this exact result is `NOT-RUN` |
| Applicable baseline | `IDEA-C1-ANALYSIS-DESIGN-001` |
| Evidence class | Repository-document reconciliation; not runtime, user, reference-product or approval evidence |
| Access / retention | `INTERNAL`; retain with the affected controlled Markdown sources |

## Problem and disposition

The current Feature and Spec already reflected the accepted design clarifications through item/folder
identity, BOM/file boundaries and departmental outputs. Tech and DOC-07 still cited older Core, VVP
and brief versions. Other current Core documents contained a smaller set of obsolete current-version
references, two stray file labels and one link to the predecessor prototype.

This change synchronizes the current Markdown source set in one controlled pass. It does **not**:

- add, remove or reprioritize a Feature;
- add, remove or change a requirement or close a Spec open point;
- change the proposed technology stack or architecture;
- change the December schedule, its 56 tasks or 756-hour allocation;
- change a review, boss decision, verification result or product-gate state; or
- edit or regenerate a submitted Word, Human or PDF copy.

## Changed current sources

| Source | Successor | Treatment |
|---|---|---|
| DOC-01 | 0.4 → 0.5 | Current Feature link only; product scope unchanged. |
| DOC-03 | 0.4 → 0.5 | Replace obsolete “future” links and current Feature/requirement references; business rules unchanged. |
| DOC-04 | 0.9 → 0.10 | Current Feature and VVP pins only; 74 requirement IDs retained. |
| DOC-05 | 0.8 → 0.9 | Current Feature/Spec inputs and removal of the stray `DOC-05` line; architecture unchanged. |
| DOC-06 | 0.9 → 0.10 | Current Feature and VVP pins only; data/integration behavior unchanged. |
| DOC-07 | 0.4 → 0.5 | Current brief/Core/VVP/GOV and count references; remove stray `DOC-07` line; schedule and task content unchanged. |
| DOC-08 | 0.5 → 0.6 | Current Feature/VVP pins and current IDEA DDM prototype link; interaction obligations unchanged. |
| Feature | 0.11 → 0.12 | Current Core/roadmap/Spec pins only; 14 FTR retained. |
| Spec | 0.13 → 0.14 | Current Feature/Core/VVP pins only; 74 REQ and seven open points retained. |
| Tech | 0.7 → 0.8 | Current Feature/Spec/Core/VVP pins; proposed stack and alternatives unchanged. |
| VVP | 0.10 → 0.11 | Current Spec/Core pins only; 15 objectives and all procedure/result states retained. |
| Catalogue / version ledger | Current index | Record the synchronized versions and preserve exact-version review boundaries. |

DOC-02@0.2 and GOV@0.3 are unchanged because their current content and references did not require
revision.

## Preserved predecessor set

[Pre-change archive](../history/2026-09-09-before-cross-document-reconciliation.zip) contains the
13 affected authority/index sources before reconciliation, with their repository-relative paths.
Archive SHA-256: `dc4865df645e3dd9b08fd47b5f715e01173479bf5a6e74d7849c6839076fb8ac`.

| Archived source | Pre-change identity / SHA-256 |
|---|---|
| DOC-01@0.4 | `7ad6b5a29ce6612d3746478bf23f1363d769726a21294634621de676003ba2d7` |
| DOC-03@0.4 | `42db9bf63a2550ed2801dbbc73581db52b295e1db00587ff6b890e72294fa0c0` |
| DOC-04@0.9 | `b6b56e68595b0d59a87dccf1aff139e45277ad470919058da94324fb2dccc9d3` |
| DOC-05@0.8 | `5ce8409d7cc5773c17a25cd8ecb294ac65bd7bab9a9fa30b65a46ec0f6d2981e` |
| DOC-06@0.9 | `d239efc416d9b5fbf283e43c97edf0572d221c11e5d3ab70fa7c322538e3623b` |
| DOC-07@0.4 | `ae338e17319c22a70b5a6e3a3842121b957c81935f8f64e1a5c27119648727f9` |
| DOC-08@0.5 | `7d67d780fe57edcdbc3fe5dd5bf1719a04e7d674c3ec377ac702e4f6e9c286e5` |
| FEATURE-001@0.11 | `5bd90018287dc2725995fd9d990428266eb0c021225bb23824d287a020539e08` |
| SPEC-001@0.13 | `4e471ad2c56d84d3aced0792a423a627b1a73fd5c515443ffe166bbe471b8e6a` |
| TECH-001@0.7 | `669145050328a71e3717b512b0bf090c1b23faa5a637f6cc1b0757eecb981702` |
| VVP@0.10 | `fdbcb04b9410983ad44d95ae637599b8162a46e618530741818f564c6ca5552b` |
| Instance catalogue before reconciliation | `ada0c0b54009cd9f0a18ec5ccf7848ad7bfbd37e5266d637dc319b86f2b56a8c` |
| Version/source ledger before reconciliation | `c2f71081552b267b32c61668654a50c10deddac1a1e7bf7c89f4b0142822bccd` |

## Successor source hashes

These hashes identify the controlled content sources after reconciliation. Catalogue, ledger and
this CHG are omitted from the table because they cross-reference this record.

| Source | Successor SHA-256 |
|---|---|
| DOC-01@0.5 | `e0bd253165fe71213b2155cf71e03727322a94305c672a3f94be51a7e24de773` |
| DOC-02@0.2 | `3887504f465593eadcbcca6c4f9c6fbba36150790fa7caa68c4ed1381de70ac7` |
| DOC-03@0.5 | `31dfd988b1e3ecf0af79e8ee904abcab3574e36fb3ebb22141c854730d8503dc` |
| DOC-04@0.10 | `a86dc21a49b9f9febef37bac2f74d446d7387202878da22690dd324db1528b67` |
| DOC-05@0.9 | `e3912682ecf0f2651f49d448abb1caaf8c91f4ed1bee92e7375cc1d78f8fa142` |
| DOC-06@0.10 | `c2336c543b23b48b760f1a87ea6a5d088b3ab8d097ceaa2ec14b78d57d78469a` |
| DOC-07@0.5 | `83755a25a57cb4fc0e70abd4eb03e81d4de83b8afe7aee92afe7119972ad6ff0` |
| DOC-08@0.6 | `65b19153de0df9be69035300507ee0f3daec1f5805d960b4a8767f3b51f7f753` |
| FEATURE-001@0.12 | `d70ce3cad2136f09b5a52b1ac1f1488bf9fc74f8432f6995def43328a22e53f4` |
| SPEC-001@0.14 | `75a8154617259c40dafa89142b9f6578325f9fbd1dfb486a5ffc4d7b25102912` |
| TECH-001@0.8 | `0f1ac14d9f96d8e503498cc27205887300bf0e905fbe38a9000fe0bc58309694` |
| GOV@0.3 | `4de0bcf9e28ee2185d48e6cdadb2209b52b081e0b8cbd1970e05f7fa8ee72016` |
| VVP@0.11 | `ac2f259c4f64f7178f68efad971b2b590fd942bff3233c8bc75e1578c414f504` |

## Required verification

Verify current version declarations and cross-pins; 14 FTR and 74 REQ identity sets; 15 VVP
objectives; seven open Spec points; local Markdown links; archive entries and hashes; absence of
merge markers and malformed whitespace; and unchanged roadmap task/hour/date rows. These checks are
document-consistency checks only. They must not be reported as product, usability, load, security,
recovery or reference-product conformance results.
