# DDM Target Package and Runtime Audit Plan

| Field | Value |
|---|---|
| Document ID | `IE-VVP-DDM-001` |
| Status | Proposed; execution blocked until acquisition/authorization gate passes |
| Basis | `IE-KNW-DDM-001` and `RS-DDM-BL-001` |
| Target | One exactly identified authorized DDM package/deployment |
| Default method | Read-only first; reversible state changes only in a disposable/restorable lab |
| Production fault injection | Prohibited |

## 1. Entry gate

No package/static/runtime claim is admissible until the audit owner records:

- commercial product/edition and entitled modules;
- exact release, patch, component build/file versions, package name, acquisition channel/date, SHA-256, and signer;
- written authorization and the applicable license/static-analysis boundary;
- installation/upgrade/clone/restore history;
- client/server components, host roles, identities, OS, SQL, design-tool versions, storage/network placement, and site count;
- database/configuration/dataset identity and observation timestamp;
- isolation, backup/reset, synthetic-data, evidence-storage, redaction, and stop procedures.

Historical tutorials, current public material, package static facts, and target runtime facts remain separate evidence strata.

## 2. Ranked audit matrix

| Rank | Question | Safe method | Required evidence | Stop condition |
|---:|---|---|---|---|
| 1 | Can the target be uniquely identified and reproduced? | Read About/version, package metadata, hashes, signer, configuration/schema markers | Target identity ledger and package/component manifest | Provenance/license unclear or lawful hashes unavailable |
| 2 | What is the actual component/network topology? | Correlate services, processes, configs, connections, SQL sessions, logs, and host roles during normal reads | Topology and process/port/identity matrix with secrets redacted | Unrelated traffic/credentials or ambiguous ownership |
| 3 | What client→database/file/service seams are statically visible? | Inspect authorized installer tables, configs, dependencies, registrations, and connection metadata | Dependency/config/endpoint map and hashes | License disallows; bypass/decryption/decompilation would be required |
| 4 | Are item, Issue/Revision, File Version, and physical Generation distinct identities? | Use synthetic items and ordinary Save/Up-Issue/Load; compare UI, catalogue/rows, files, and hashes | Identity map and before/after evidence | No isolated data or reliable correlation |
| 5 | Are historical Generations immutable? | Hash all versions before/after supported edits on a clone; inspect read access | Hash timeline, history, ACL, audit result | Requires unsupported lower-layer writes or corruption risk |
| 6 | Is Save/version creation coherent across database and file storage? | Observe normal saves and approved interruption scenarios on a restorable clone | Timeline, staging/final/orphan state, transaction/log markers, retry/recovery | No verified restore, production scope, or vendor prohibition |
| 7 | Does Reserve prevent lost update and recover from crash/reconnect? | Two users/clients; concurrent reserve/edit/save; approved client termination/disconnect in lab | Owner/state sequence, conflict UI, DB/log and recovery/override audit | No cleanup path or other users could be affected |
| 8 | Is Reference identity/version-aware and distinct from Reserve? | Create references, Up-Issue source, reconnect, compare two-user UI/relation/history | Relation key, pinned/latest behavior, visibility and persistence | Relation cannot be isolated/removed safely |
| 9 | Is authorization consistent across every client and lower-layer path? | Dedicated allow/deny principals across CAD/Office/Web/reporting/file/export/preview | Expected/actual matrix, groups/state, path, denial/audit evidence | Requires impersonating real users or exposing protected data |
| 10 | What transport/certificate settings protect SQL, file, and Web channels? | Scoped connection observation, config/certificate inspection, SQL encryption-state read | Protocol, TLS/cert validation, SQL state, redacted references | Capture leaks unrelated data or requires interception |
| 11 | Are secrets exposed in configuration, logs, temporary data, or support exports? | Security-approved search of authorized directories/exports; record only location/type/protection | Redacted finding, ACL, retention/rotation | A live secret is encountered: stop and notify owner |
| 12 | Does Product Structure/BOM have stable occurrence and snapshot semantics? | Controlled reused-part/non-drawn-item assembly across CAD, BOM, Web, export, where-used, and Up-Issue | Graph, occurrence/quantity keys, version baseline, cross-surface evidence | Missing entitlement or production-asset risk |
| 13 | Are multi-row BOM edits atomic and reconciled with CAD structure? | Controlled BOM changes and supported validation failures | Transaction timeline, validation, audit, final cross-surface consistency | Rollback/reset unproven or external EUM could trigger |
| 14 | Are workflow/approval quorum, races, and audit deterministic? | Disposable workflow with two test approvers; approve/reject/resubmit and near-concurrent decisions | Definition version, assignments, timestamps, final state, audit/notifications | Real notifications or no isolated workflow |
| 15 | Is Change Order a first-class ECR/ECO model in this target? | Inspect entitlement/config/schema and minimal synthetic Change Order | Object/relationship/baseline/package/workflow identity map | Capability not entitled: record BLOCKED, not absent |
| 16 | Is number allocation unique with defined rollback/distributed behavior? | Dedicated test rule/range; concurrent requests and supported cancellation | Request/result timeline, config, collision/gap/rollback evidence | Could consume production sequence or affect users |
| 17 | Are metadata changes typed, migratable, validated, and indexed? | Disposable definitions/items; catalogue and ordinary search before/after | Type/default/null/validation/index/search/rollback map | Change cannot be isolated or reversed |
| 18 | Can backup/export restore one complete consistent DDM state? | Inspect backup definitions; restore only to approved isolated lab; reconcile checksums/counts/config/history | Backup manifest, restore log, measured RPO/RTO, integrity reconciliation | Copy/license/security/isolation prerequisites fail |
| 19 | Does purge respect lifecycle, dependencies, audit, retention, and recovery? | Read rules first; purge disposable versions only after verified lab restore | Candidate/dependency/rule snapshot, approval/audit, before/after hashes/rows | Production, legal hold unclear, or backup/restore unproven |
| 20 | Does EUM/watched-folder integration define retry, idempotency, and failure handling? | Synthetic isolated endpoint; unique/duplicate/invalid inputs and approved destination unavailability | Correlation, retries, duplicate result, error/audit/dead-letter evidence | Real ERP/folder/data/secrets or business outage risk |
| 21 | Which API/event surfaces are supported public, internal, or reporting-only? | Inventory installed docs/config/endpoints/metadata; documented read operations only | Classified surface catalogue, auth/version contract, redacted sample | Would require bypass, fuzzing, unsupported write, or unauthorized decompilation |
| 22 | What are multisite ordering, lag, conflict, and partition-recovery semantics? | Authorized two-site lab with synthetic changes and approved disconnect/reconnect | Synchronized timeline, lag, conflict/resolution, notification, final hashes/counts | Production site, no rollback/clocks, or license/vendor block |
| 23 | Do published statistics/health views match measurable state? | Compare Admin views with read-only SQL/file/OS counters under known synthetic conditions | Metric definitions, timestamps, source samples, discrepancies | Expensive/privileged query or production load risk |
| 24 | What performance/capacity is reproducible for a defined workload? | Pre-approved production-like lab; warm/cold repeats and resource monitoring | Dataset/config/topology, latency distributions, throughput, errors, resources | Production, uncontrolled load, no repeatability, or denial-of-service risk |

## 3. Legal, license, and safety controls

- Use only packages, systems, accounts, data, and networks covered by explicit organizational authorization.
- Confirm license terms and applicable law before installer inspection, static analysis, runtime observation, or fault scenarios.
- Preserve licensing, activation, authentication, authorization, MFA, encryption, signing, and technical protection measures.
- Use ordinary documented access; no credential guessing/recovery/replay, protection bypass, public-endpoint probing, or external penetration testing.
- Keep proprietary installers, binaries, databases, backups, customer content, and licensed documents in controlled storage; product records contain hashes and sanitized evidence only.
- Use synthetic data and dedicated accounts.
- Prefer read-only methods. State-changing checks run only in a disposable/restorable non-production deployment with owner, rollback, and stop conditions.
- Never interrupt production, alter production ACLs, consume production numbering, purge production data, partition production replication, or run production load/fault tests under this plan.
- Report an unmet prerequisite as `BLOCKED`; never substitute or call it PASS.

## 4. Required outputs

- Target Identity Ledger and authorized-scope record;
- installer/static artifact manifest with hashes, versions, signer, and acquisition provenance;
- component/deployment/trust topology and process-port-endpoint matrix;
- identity map for Document, Issue/Revision, File Version/Generation, occurrence, Reference/Reserve, workflow/change, user/group/role, and audit;
- storage/transaction map with staging, commit, compensation, integrity, and recovery;
- authorization matrix across role/group/state/action/client/store;
- evidence packet per hypothesis with procedure, before/after, hashes, limits, and review;
- failure/recovery matrix for crash, disconnect, partial commit, retry, duplicate, restore, purge, and replication;
- security/trust register;
- integration surface catalogue;
- performance report with reproducible workload and distributions;
- UNKNOWN/BLOCKED register;
- separate DDM Fact Ledger and IDEA Design-Lesson updates.

## 5. Exit criteria

DDM target discovery is sufficient to inform IDEA requirements only when:

1. one exact target and evidence stratum are fixed;
2. each target fact is reproducible and independently reviewed;
3. topology and trust seams are bounded;
4. identity/version, Reserve/Reference, atomicity, structure, workflow/change, metadata/numbering/ACL, security, recovery, and integration have valid results or explicit blockers;
5. relevant concurrency, interruption, retry, partial-failure, and recovery behavior is tested safely;
6. negative findings document entitlement, role, configuration, and search coverage;
7. contradictions remain explicit or are resolved by stronger scoped evidence;
8. legal, license, confidentiality, privacy, and non-redistribution review passes;
9. every adopted or adapted behavior has a controlled coverage disposition and an IDEA requirement or decision with scope, rationale, acceptance criteria, and verification evidence.

Passing this plan still does not authorize copying DDM implementation. It permits only parity claims scoped to the identified target, configuration, tested coverage, and retained objective evidence.
