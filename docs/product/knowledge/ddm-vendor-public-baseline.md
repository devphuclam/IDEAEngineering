# DDM Vendor-Public Capability Baseline

| Field | Value |
|---|---|
| Document ID | `IE-KNW-DDM-001` |
| Status | Admitted public-evidence baseline |
| Evidence date | 2026-08-26 |
| Source class | `VENDOR-PUBLIC` plus explicit `UNKNOWN`/`INFERENCE` |
| Source artifact | `RS-DDM-BL-001` |
| Source SHA-256 | `83E2B662BE0408757A475128F3C629570EC7C86972F4271FFC6F6BEFA3262DB2` |
| Target-runtime evidence available | None |

## 1. Reading rule

This baseline records what DDM/CSI publicly published or demonstrated. It does not identify an installed target build, enabled module set, license entitlement, configuration, topology, data model, enforcement rule, transaction boundary, security posture, recovery capability, or measured performance.

A tutorial frame proves the displayed vendor demonstration in its cited historical context. It cannot be relabelled as `TARGET-RUNTIME FACT`.

## 2. First-party public propositions

| ID | Vendor-public proposition | First-party source | Limit |
|---|---|---|---|
| `VP-01` | DDM publishes a Windows/SQL Server deployment profile for DDM 2026.x, Windows 10/11 clients, Windows Server 2019/2022/2025, and listed SQL Server variants. | [System Requirements and Support Matrix](https://www.designdatamanager.com/support/system-requirements/#matrix) | Requirements/recommendations do not identify a target topology or installed edition. |
| `VP-02` | The public release matrix listed enhancement releases through DDM 2026.04 and linked a 74-item release list. | [Release Matrix](https://www.designdatamanager.com/services/ddm-release-matrix/), [2026.04 release list](https://www.designdatamanager.com/wp-content/uploads/DOC-000201751DDM-2026.04-Release-ListDoc.pdf) | Does not prove a future target runs 2026.04; another official page referenced 2026.07 compatibility notes. |
| `VP-03` | DDM distinguishes CAD, Office, and Web surfaces and markets search, central repository, revision control, numbering, history, workflows, audit, ERP/MRP integration, and replication. | [Product Matrix](https://www.designdatamanager.com/products/ddm-product-matrix/) | Product matrix is not implementation, entitlement, completeness, enforcement, or benchmark evidence. |
| `VP-04` | Official IRONCAD tutorials demonstrate Store, Load, and specific File Version flows. | [IRONCAD tutorials](https://www.designdatamanager.com/ironcad-tutorials/), [Store/Load tutorial](https://www.youtube.com/watch?v=QXWKsTQcaCg&t=85s) | Adapter contract, current parity, save cardinality, failure handling, and atomicity remain unknown. |
| `VP-05` | Official material distinguishes item/model Issue or Revision from File Version and demonstrates Up-Issue/change-note behavior. | [Office lifecycle](https://www.youtube.com/watch?v=jwxlEuOIOSY&t=490s), [IRONCAD Up-Issue](https://www.youtube.com/watch?v=vc0rVTcmong&t=400s) | Initial/reset rules, immutable physical generation, and failed-save behavior need target tests. |
| `VP-06` | DDM demonstrates Reserve and Reference flows and modification-rights language. | [Office Reserve/Reference tutorial](https://www.youtube.com/watch?v=rlH1fXReZ9Q&t=305s), [Reserve/Reference enhancement](https://www.designdatamanager.com/2016/09/08/ddm-2016-08-whats-new-reserve-to-reference-to-enhancements/) | Lock protocol, owner key, lease, two-user conflict, crash persistence, cleanup, and server enforcement remain unknown. |
| `VP-07` | DDM demonstrates product structure, BOM editing, quantity/position, Excel export, and Web structure/export surfaces. | [Product structure](https://www.youtube.com/watch?v=QXWKsTQcaCg&t=1095s), [BOM Editor](https://www.youtube.com/watch?v=kofHQvmBxvw), [Web BOM/export](https://www.youtube.com/watch?v=rL8tYmwsWHo&t=280s) | Occurrence identity, snapshot pinning, derived alignment, and CAD/Web consistency remain unknown. |
| `VP-08` | Official tutorials demonstrate free/advanced search, saved search, and a public/private control. | [Search tutorial](https://www.youtube.com/watch?v=SXQnnOEitaw), [April 2026 workshop](https://www.youtube.com/watch?v=7M5CnWvfGZs&t=56s) | Visibility, ownership, ACL precedence, indexing, completeness, and performance remain unknown. |
| `VP-09` | DDM demonstrates graphical workflow, formal decisions, reject/resubmit, release, actor/time history, and Change Order workflow. | [Formal Approvals](https://www.youtube.com/watch?v=v8hzVUZjm2w), [Web workflow](https://www.youtube.com/watch?v=1zIyOZVxa3c), [Graphical Workflow Tool](https://www.designdatamanager.com/products/graphical-workflow-tool/) | Workflow-definition versioning, races/quorum, immutable release, transactionality, and first-class ECR/ECO schema remain unknown. |
| `VP-10` | Admin tutorials demonstrate users, groups, lifecycle-aware access controls, attributes/categories/validation, and auto-numbering. | [Admin tutorials](https://www.designdatamanager.com/ddm-admin-tutorials/), [System Access](https://www.youtube.com/watch?v=IAoU2iPDYxs), [Auto-numbering](https://www.youtube.com/watch?v=pDV2VgCAeXg) | ACL precedence/enforcement, schema migration, and number-allocation concurrency/rollback remain unknown. |
| `VP-11` | DDM publicly demonstrates a browser client, Web workflow, and preview-related surfaces. | [Web tutorials](https://www.designdatamanager.com/ddmwebtutorials/), [Web login/search/BOM](https://www.youtube.com/watch?v=rL8tYmwsWHo), [first Web release](https://www.youtube.com/watch?v=XxeNMpomBQk&t=158s) | A visible preview control does not prove renderer capability, backend topology, authorization, or current parity. |
| `VP-12` | Release material claims domain authentication and later MFA/2FA behavior for Web/Office/Admin. | [DDM 2025.10 release list](https://www.designdatamanager.com/wp-content/uploads/DOC-000184911.pdf), [November 2025 workshop](https://www.youtube.com/watch?v=yp4GJhT3yuM) | Password, identity-provider trust, token/session, cookie, service-authentication, and target policy remain unknown. |
| `VP-13` | DDM publishes EUM/BOM-to-ERP/MRP paths using XML and later XML-to-CSV/alternate XML, Routing Server, Web manual send, and watched-folder behavior. | [BOM and Enterprise Update Manager](https://www.designdatamanager.com/products/bill-of-materials/), [2024.07 release list](https://www.designdatamanager.com/wp-content/uploads/DOC-000159541DDM-2024.07-Release-ListDoc.pdf), [2025.01 release list](https://www.designdatamanager.com/wp-content/uploads/DOC-000176841DDM-2025.01-Release-ListDoc.pdf) | Contract, direction, retry, duplicate handling, idempotency, failure audit, and general API support remain unknown. |
| `VP-14` | Release material names SQL-connected deployment, Secure/Remote File Servers, Routing Server, Action Server, Web components, an internal WCF layer, and read-only SQL reporting. | [2024.07 release list](https://www.designdatamanager.com/wp-content/uploads/DOC-000159541DDM-2024.07-Release-ListDoc.pdf), [2026.04 release list](https://www.designdatamanager.com/wp-content/uploads/DOC-000201751DDM-2026.04-Release-ListDoc.pdf) | Internal WCF/reporting is not evidence of a supported general Open API. Component names do not establish business authority. |
| `VP-15` | DDM claims database/Admin metadata replication, file-server replication, multisite priority conflict notification, and continued local work during outage. | [DDM Multi-Site](https://www.designdatamanager.com/solutions/ddm-multisite/), [Replicator datasheet](https://www.designdatamanager.com/wp-content/uploads/00000007552022.02Data-Sheet-DDM-ReplicatorDoc.pdf) | Ordering, consistency, lag, merge, failover, partition recovery, and capacity are unproven. |
| `VP-16` | DDM 2026.04 material demonstrates Database Statistics and purge controls/rules; official training names maintenance, export, backup, and recovery topics. | [2026.04 release list](https://www.designdatamanager.com/wp-content/uploads/DOC-000201751DDM-2026.04-Release-ListDoc.pdf), [DDM Admin training](https://www.designdatamanager.com/services/training-3/ddm-admin-training/) | Backup completeness/schedule, restore correctness, RPO/RTO, legal hold, safe purge, cleanup, and operational SLA remain unknown. |

## 3. What tutorials are sufficient to establish

Tutorials and first-party public material are sufficient for:

- product-surface inventory and vocabulary used by the vendor;
- demonstrated happy-path task flows and visible interaction concepts;
- candidate stakeholder interviews and discovery questions;
- a preliminary capability map;
- identifying comparison dimensions for IDEA;
- planning an authorized target-runtime audit;
- rejecting unsupported claims that DDM has never publicly shown a capability.

They are not sufficient for:

- exact current build, installed modules, license entitlement, or configuration;
- authoritative identity keys or Issue/Revision/File Version storage semantics;
- Reserve/Reference ownership, lease, race, timeout, crash, and stale-write behavior;
- Check-in cardinality, DB/file transaction boundaries, atomicity, retry, idempotency, or orphan recovery;
- product-structure occurrence identity, exact-version pinning, BOM consistency, or release baseline;
- ACL precedence and enforcement across every client/store;
- password, MFA, token/session, transport, service-identity, secret-storage, and signing implementation;
- workflow-definition versioning, approval races, tamper resistance, or ECR/ECO object model;
- supported public APIs, compatibility policy, webhooks, or event contracts;
- replication ordering, partition behavior, conflict resolution, RPO/RTO, restore correctness, purge safety, or benchmarked performance.

## 4. Target package/runtime unknown register

| Group | Questions that require an identified authorized target |
|---|---|
| Package and topology | Exact edition/build/patch, signer/hash, enabled modules, upgrade history, services/processes, server/client roles, database/file/Web/background/licensing components |
| Identity and version | Stable item/document identity, Issue/Revision/File Version/physical Generation keys, no-op behavior, revision baseline, immutable history |
| Reserve and Reference | Owner key, requested scope, parent/child propagation, partial acquisition, same-user replay, lease/timeout, disconnect, crash recovery, transfer/break, stale publish |
| Product structure and BOM | Occurrence identity, exact-version pinning, manual/derived relationships, where-used, CAD/Web/export consistency, structure release baseline |
| Workflow and change | Definition versioning, allowed transitions, quorum/races, reject/resubmit, revision effects, ECR/ECO/change package semantics, notification/audit transactionality |
| Metadata, numbering, and ACL | Schema typing/evolution, uniqueness and retry of number allocation, role/group/state precedence, deny behavior, enforcement at every data path |
| Database, file store, and atomicity | Schema constraints, staging, upload/commit ordering, crash windows, checksums, orphan detection, idempotency, reconciliation, retention/purge |
| Security and trust | Authentication/MFA/session, transport protection, service identity, credentials/secrets, signing/update trust, database/file/reporting permissions |
| Recovery, multisite, and performance | Backup coverage, coordinated restore, RPO/RTO, replication order/lag/partition/conflict, observability, representative latency/throughput/capacity |
| Integration and API | Supported versus internal interfaces, schemas/versioning/auth, EUM direction/retry/duplicate/dead-letter semantics, reporting boundary |

## 5. Known public-source contradictions

| Topic | Preserved evidence |
|---|---|
| Release labels | The support matrix referenced DDM 2026.x and included 2026.07 CAD notes while the release matrix listed 2026.04 as its newest enhancement release. Neither identifies a target package. |
| Web BOM | An official Web tutorial showed structure/BOM/export while the current Product Matrix left related Web cells blank. Edition/date/entitlement cause is unknown. |
| Historical parity | Many official indexed tutorials were published in 2020–2021. They prove historical vendor demonstrations, not current defaults or target parity. |
| Security wording | “Secure access,” SSL, MFA, and audit claims do not prove every underlying trust boundary or configuration. |
| WCF/reporting | Internal WCF and read-only reporting do not establish a supported general API. |
| Change Order | A graphical Change Order workflow does not by itself prove first-class ECR/ECO domain objects. |
| Replication | Public replication/multisite claims do not establish consistency, ordering, failover, or benchmarks. |
| Public silence | Failure to find a public description is an evidence gap, not capability absence. |

## 6. Minimum evidence before a target claim

A future DDM runtime/static claim is admissible only when it records:

1. target product/edition/modules, exact release/build/patch, signer/hash, acquisition channel, and authorization;
2. deployment/configuration/dataset identity and observation time;
3. evidence class, reproducible procedure, actor/host/site, prerequisites, before/after state, and stable evidence locator;
4. limitations and alternative explanations;
5. safe rollback/stop conditions for state-changing tests;
6. reviewer disposition;
7. separation between the DDM result and any IDEA requirement or decision.

Target discovery should resolve identity/version and DB-file atomicity first, then Reserve/Reference and authorization, product structure/workflow, security/recovery, integration/multisite, and finally performance.

## 7. Prohibited overclaims

This baseline does not establish that DDM:

- has or lacks a specific internal architecture, schema, API, encryption mechanism, or recovery protocol;
- behaves in the target exactly as an older tutorial;
- provides every marketed capability in every edition;
- implements Reserve as a particular lock/lease algorithm;
- provides atomic Check-in or immutable Generations;
- is secure or insecure based solely on public wording;
- meets any performance, availability, recovery, or scalability target;
- should be cloned by IDEA.

The current acquisition recommendation is maintained separately in [DDM acquisition and audit decision](2026-08-27-ddm-acquisition-and-audit-decision.md).
