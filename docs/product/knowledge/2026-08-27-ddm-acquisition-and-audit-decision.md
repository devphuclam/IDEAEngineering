# DDM Acquisition and Runtime-Audit Decision

| Field | Value |
|---|---|
| Document ID | `IE-KNW-DDM-002` |
| Decision date | 2026-08-27 |
| Evidence cut-off | 2026-08-27, Asia/Bangkok |
| Status | Decided - acquire only through an authorized vendor path; runtime audit remains gated |
| Source scope | DDM/CSI first-party public pages, first-party PDFs, and the official DesignDataManager video channel only |
| Evidence classes | `VENDOR-PUBLIC`, `INFERENCE`, `UNKNOWN`, `IDEA DECISION` |
| Related baseline | [DDM vendor-public capability baseline](ddm-vendor-public-baseline.md) |
| Related execution plan | [DDM target package and runtime audit plan](ddm-target-audit-plan.md) |

## 1. Decision

Do **not** obtain DDM from an unofficial mirror or treat an old tutorial package as the current product. The current official acquisition path that could be verified is vendor-mediated:

- the official install-media page asks the reader to contact CSI for installation or evaluation codewords and exposes an **Install Media Request** mail link, not a public installer link ([DDM Customer Install Media](https://www.designdatamanager.com/ddm-install-media/), accessed 2026-08-27);
- the official release matrix says to contact CSI support for the latest-version download link ([DDM Release Matrix](https://www.designdatamanager.com/services/ddm-release-matrix/), accessed 2026-08-27);
- the official support database is behind a login/registration screen ([CSI Customer Support Database](https://support.csi-europe.com/), accessed 2026-08-27); and
- a public form exists to request a vendor-scheduled one-hour remote demo ([1hr Online Demo Request](https://www.designdatamanager.com/contact-2/requestademo/), accessed 2026-08-27).

Therefore:

- `VENDOR-PUBLIC`: CSI publicly provides request/contact paths for a demo, installation media, evaluation codewords, and support-gated downloads ([install media](https://www.designdatamanager.com/ddm-install-media/), [demo](https://www.designdatamanager.com/contact-2/requestademo/), [release matrix](https://www.designdatamanager.com/services/ddm-release-matrix/); all accessed 2026-08-27).
- `UNKNOWN`: whether a current self-service public trial or unauthenticated public installer exists. None was identified on the current first-party install, release, demo, support, legal, or sitemap surfaces reviewed. This is an evidence gap, not proof of absence.
- `VENDOR-PUBLIC` (historical): CSI advertised a 60-day DDM trial in March 2016, but that historical post does not establish a trial duration, entitlement, build, or acquisition route in 2026 ([official 2016 trial post](https://www.designdatamanager.com/2016/03/01/tweet-undecided-on-a-plm-solution-trial-ddm-for-60-da/), accessed 2026-08-27).

The recommendation is to **finish the public-evidence baseline now, then request an authorized evaluation package only if the implementation-sensitive unknowns matter to IDEA**. Tutorial evidence is sufficient for product vocabulary, visible happy paths, capability mapping, and test design. It is not sufficient for target-build behavior, entitlement, multi-user conflict semantics, transaction atomicity, security, recovery, API contracts, or measured performance.

## 2. Why a current target package cannot be inferred from the public material

The official release matrix currently lists `DDM 2026.04` as its newest enhancement release and links a 74-item release document issued 2026-04-17 ([release matrix](https://www.designdatamanager.com/services/ddm-release-matrix/), [DDM 2026.04 full release list](https://www.designdatamanager.com/wp-content/uploads/DOC-000201751DDM-2026.04-Release-ListDoc.pdf); both accessed 2026-08-27). However, the official system/support matrix labels the platform `DDM 2026.x` and includes CAD-compatibility statements that refer to `DDM 2026.07`, including IronCAD 2027 support from that release ([System Requirements and Support Matrix](https://www.designdatamanager.com/services/system-requirements/), accessed 2026-08-27).

This does not prove that either page is wrong. It proves that a target build cannot be selected from tutorials or page headings alone. Before any runtime claim, CSI must identify the supplied edition, modules, exact release/build/patch, supported CAD pairing, package signer, and package hash.

The same caution applies to licensing. A still-published DDM CAD data sheet says a CAD user license is drawn from a single floating concurrent-user server pool, while the public product matrix uses per-user wording and separates CAD, Office, and Web capabilities ([DDM CAD data sheet, issue 2022.02](https://www.designdatamanager.com/wp-content/uploads/00000001642022.02Data-Sheet-DDM-CADDoc.pdf), [DDM Product Matrix](https://www.designdatamanager.com/products/ddm-product-matrix/); both accessed 2026-08-27). These public descriptions are useful acquisition questions, but they do not establish the current contractual entitlement or runtime enforcement for a future evaluation package.

## 3. What tutorial evidence proves and does not prove

| Dimension | What first-party tutorial/public evidence establishes | What remains unproven without an identified target |
|---|---|---|
| Product surface and vocabulary | DDM publicly demonstrates CAD, Office, Web, project-folder, workflow, BOM, lifecycle, Issue/Revision, File Version, Reserve, and Reference concepts ([IRONCAD tutorials](https://www.designdatamanager.com/ironcad-tutorials/), [DDM Office tutorials](https://www.designdatamanager.com/ddm-office-tutorials/), [Product Matrix](https://www.designdatamanager.com/products/ddm-product-matrix/); accessed 2026-08-27). | Internal object identities, database schema, service boundaries, enabled modules, defaults, and exact terminology in a supplied build. |
| Target build | A video proves that the recorded vendor demonstration displayed the shown behavior. CSI itself warns that some videos show an older interface and recommends viewing the latest material for current look and feel ([Product Videos](https://www.designdatamanager.com/product-videos/), accessed 2026-08-27). | Exact version/build/patch, binary provenance, configuration, upgrade history, compatibility, and whether the behavior is unchanged in the acquired package. |
| Entitlement | Public material distinguishes CAD, Office, Web, and Multi-Site offerings and publishes licensing descriptions ([Product Matrix](https://www.designdatamanager.com/products/ddm-product-matrix/), [DDM CAD data sheet](https://www.designdatamanager.com/wp-content/uploads/00000001642022.02Data-Sheet-DDM-CADDoc.pdf); accessed 2026-08-27). | Contractual rights, evaluation duration, seat count, feature flags, license-server behavior, offline use, expiry behavior, permitted test users/VMs, and audit/reverse-engineering rights. |
| Concurrency | The public data sheet's “floating concurrent user” wording concerns license-seat consumption, not necessarily concurrent modification of engineering objects ([DDM CAD data sheet](https://www.designdatamanager.com/wp-content/uploads/00000001642022.02Data-Sheet-DDM-CADDoc.pdf), accessed 2026-08-27). Tutorials show sequential user flows. | Two-user races, lock granularity, partial acquisition, same-user replay, stale working copies, disconnect/timeout behavior, forced release, and publish conflicts. These require at least two authorized identities and controlled concurrent runs. |
| Reserve and Reference | The official Office tutorial demonstrates reserving an item to a project folder, identifying where an item is reserved/referenced, and referencing a document; the official IronCAD tutorials demonstrate reserving assembly-related items and referencing up-issued items ([Office Working with Folders](https://www.youtube.com/watch?v=rlH1fXReZ9Q&t=305s), [IRONCAD tutorials](https://www.designdatamanager.com/ironcad-tutorials/); accessed 2026-08-27). | Server-side owner key, lock/lease protocol, assembly-to-child propagation, whether Reference is immutable or merely non-owning in the UI, bypass paths, crash persistence, and conflict resolution at check-in. |
| Check-in atomicity | The official tutorials establish visible successful Store/Save/Up-Issue flows, and the release list records product changes, but neither source specifies a database/file transaction contract ([IRONCAD Store/Load tutorial](https://www.youtube.com/watch?v=QXWKsTQcaCg&t=85s), [DDM 2026.04 full release list](https://www.designdatamanager.com/wp-content/uploads/DOC-000201751DDM-2026.04-Release-ListDoc.pdf); accessed 2026-08-27). | Whether assembly, child files, metadata, BOM, history, and reservation release commit atomically; rollback behavior on file, SQL, network, process, or client failure; idempotency; orphan detection; and reconciliation. |
| Security | CSI publicly describes secure access, business-unit access controls, audit trail, and authorized browser access ([Product Matrix](https://www.designdatamanager.com/products/ddm-product-matrix/), [DDM Web](https://www.designdatamanager.com/products/ddm-web-2/); accessed 2026-08-27). The 2026.04 release list also describes a read-only SQL reporting account ([DDM 2026.04 full release list](https://www.designdatamanager.com/wp-content/uploads/DOC-000201751DDM-2026.04-Release-ListDoc.pdf), accessed 2026-08-27). | Authentication and MFA policy, authorization precedence on every path, session/token handling, transport protection, service identities, secret storage, database/file permissions, update trust, audit tamper resistance, and vulnerability posture. Marketing wording is not security assurance. |
| Recovery | The 2026.04 release list describes an upgrade prompt that creates a database backup and lets the operator stop when backup did not complete ([DDM 2026.04 full release list](https://www.designdatamanager.com/wp-content/uploads/DOC-000201751DDM-2026.04-Release-ListDoc.pdf), accessed 2026-08-27). | Backup scope across SQL, vault files, configuration, keys, licenses, and replicas; coordinated restore; consistency after interruption; RPO/RTO; restore validation; disaster recovery; and purge safety. |
| API and integration | The product matrix advertises ERP/MRP integration, and the release list exposes read-only SQL reporting as a named capability ([Product Matrix](https://www.designdatamanager.com/products/ddm-product-matrix/), [DDM 2026.04 full release list](https://www.designdatamanager.com/wp-content/uploads/DOC-000201751DDM-2026.04-Release-ListDoc.pdf); accessed 2026-08-27). | A supported public API/SDK, schemas, versioning, authentication, authorization, webhooks/events, compatibility guarantees, retries, duplicate handling, idempotency, and support boundaries. Public integration claims must not be relabelled as a general Open API. |
| Performance and scale | The 2026.04 release list reports an improvement to Creo Load Manager on high-latency networks, while system requirements publish hardware bands by user count ([DDM 2026.04 full release list](https://www.designdatamanager.com/wp-content/uploads/DOC-000201751DDM-2026.04-Release-ListDoc.pdf), [System Requirements](https://www.designdatamanager.com/services/system-requirements/); accessed 2026-08-27). | Reproducible latency, throughput, capacity, scaling curve, dataset size, cache state, network profile, concurrent-user load, error rate, and tail latency. A release-note improvement is not a benchmark. |

## 4. Decision by IDEA objective

| IDEA objective | Are tutorials enough? | Is authorized package/runtime evidence needed? |
|---|---|---|
| Establish vendor vocabulary and a preliminary capability map | Yes. Preserve vendor wording and evidence date. | No. |
| Understand visible happy-path UX and derive interview questions | Yes. | No, unless current-build UX parity matters. |
| Design IDEA's own PDM-to-PLM architecture | Yes as comparative input, not as an implementation specification. IDEA requirements still need independent stakeholder rationale and acceptance criteria. | No for architecture baseline; yes only to resolve a material behavior question. |
| Claim exact DDM behavior or parity for a current build | No. | Yes. |
| Resolve two-user Reserve/Reference, checkout, stale-write, or assembly/child conflict behavior | No. | Yes, with at least two authorized identities and a pinned build/configuration. |
| Determine check-in transaction boundaries or failure recovery | No. | Yes, including controlled interruption and restore tests. |
| Assess entitlement, security, supported API, recovery, replication, or performance | No. | Yes, plus vendor documentation and written authorization appropriate to the test. |
| Copy DDM implementation details | No. Public tutorials do not grant this right or reveal a complete implementation. | Runtime access still does not grant copying or disassembly rights; the governing license and applicable law must permit the exact activity. |

## 5. Staged gates

### Gate 0 - Public-evidence baseline

**Status:** complete enough to support IDEA architecture discussion and to design a future audit.

Actions:

1. Record only first-party propositions, dates, direct URLs, and visible tutorial behavior.
2. Preserve contradictions and `UNKNOWN` outcomes, especially `2026.04` versus public `2026.07` compatibility wording ([release matrix](https://www.designdatamanager.com/services/ddm-release-matrix/), [support matrix](https://www.designdatamanager.com/services/system-requirements/); accessed 2026-08-27).
3. Convert observations into candidate questions and test hypotheses, not IDEA requirements or DDM implementation claims.

**Exit/stop rule:** if IDEA only needs capability discovery, vocabulary, and architecture inputs, stop here. There is no present need to acquire DDM.

### Gate 1 - Authorized acquisition

Use only CSI or an authorized reseller/support path. The official public path is to request demo/media/evaluation help from CSI ([install media](https://www.designdatamanager.com/ddm-install-media/), [demo request](https://www.designdatamanager.com/contact-2/requestademo/), [contact](https://www.designdatamanager.com/contact-2/); accessed 2026-08-27).

Obtain in writing before download or installation:

1. legal entity and authorized users;
2. evaluation agreement/EULA and any support terms;
3. permitted purpose: interoperability evaluation, behavior testing, security testing, traffic/log capture, static metadata inspection, and clean-room comparison, as applicable;
4. prohibited activity, especially decompilation, disassembly, circumvention, credential sharing, redistribution, publication, and production use;
5. permitted number of servers, clients, CAD integrations, identities, sites, and concurrent sessions;
6. exact product/edition/modules, release/build/patch, supported IronCAD/CAD versions, trial duration, expiry behavior, and required licensing/activation connectivity;
7. official installer location, expected SHA-256 or equivalent digest, signing identity/certificate expectation, prerequisites, release notes, install guide, backup/restore guide, and uninstall procedure; and
8. permission to use synthetic data and to retain sanitized test evidence without redistributing CSI binaries, keys, proprietary documentation, or customer data.

The public [Terms of Use](https://www.designdatamanager.com/contact-2/termsofuse/) applies to website use and says website material is owned or licensed and unauthorized use/reproduction is restricted (accessed 2026-08-27). It is **not evidence of the software EULA or of permission to reverse engineer the product**. Software audit rights therefore remain `UNKNOWN` until CSI supplies the governing terms and the organization confirms the scope, with legal review where needed.

**Gate decision:** do not proceed when the package source, target build, license scope, audit permission, or signer/digest expectation is unresolved.

### Gate 2 - Static package manifest

Perform this gate before execution, inside a quarantine or disposable analysis environment:

1. record acquisition channel, time, filename, byte size, cryptographic hash, Authenticode signer, certificate chain, timestamp, and malware-scan result;
2. inventory installer packages, file/version metadata, manifests, declared prerequisites, services, scheduled tasks, drivers, COM registrations, ports/endpoints, server/client roles, database dependencies, CAD-integration components, update components, and licensing components;
3. compare the package identity with vendor-supplied release/support documentation;
4. identify expected external connectivity and activation before allowing network egress; and
5. do not decompile, disassemble, bypass licensing, extract protected implementation material, or publish package contents unless the written authorization explicitly permits it.

**Gate decision:** stop on an unofficial source, unexpected/invalid signature, digest mismatch, unexplained driver/service, prohibited activity, or unresolved high-risk external dependency.

### Gate 3 - Isolated runtime audit

Use disposable Windows server/client virtual machines, snapshots, a segmented test network, synthetic CAD/documents, and non-production identities. CSI's current public baseline lists Windows Server 2019/2022/2025 with SQL Server 2019/2022/2025 for DDM 2026.x, and Windows 10/11 clients ([System Requirements and Support Matrix](https://www.designdatamanager.com/services/system-requirements/), accessed 2026-08-27). Treat those as planning inputs; the vendor-supplied package documentation controls the actual test topology.

Minimum controls:

1. no production vault, database, identity provider, credentials, network share, email, ERP/MRP, supplier/customer data, or customer CAD;
2. deny outbound network access by default; allow only documented licensing/update endpoints when explicitly approved and record the exception;
3. separate administrator, engineer A, engineer B, and read-only/reference identities; never share credentials;
4. pin package hash, exact module entitlement, configuration export, VM snapshots, CAD version, dataset, clock/time zone, and test-case revision;
5. capture before/after UI state, database/file observations where authorized, logs, process/service state, network observations where authorized, and rollback result; and
6. stop on unexpected privilege escalation, production dependency, destructive propagation, uncontrolled external traffic, licensing ambiguity, or inability to restore the snapshot.

Audit order:

1. identity, Issue/Revision/File Version, physical-file generation, and no-op save;
2. Reserve/Reference ownership, assembly/child scope, partial acquisition, two-user races, stale working copies, disconnect, crash, transfer/break, and check-in conflict;
3. database/file/BOM/history/reservation atomicity with controlled client, service, SQL, file-store, and network interruption;
4. authorization across CAD, Office, Web, file store, SQL reporting, and background services;
5. backup/restore and upgrade rollback, including consistency and orphan reconciliation;
6. supported integration/API discovery and failure semantics; and
7. performance last, using declared datasets, cache/network profiles, concurrency, percentiles, error rate, and repeatable scripts.

**Gate decision:** only observations tied to the pinned package/configuration become `TARGET-RUNTIME FACT` evidence. They must not be generalized to every DDM edition or release.

## 6. Acquisition request checklist

When the organization is ready to contact CSI, request answers and artifacts rather than asking only for “a download”:

- Which exact DDM release/build is the current evaluation build on 2026-08-27, and why does the public release matrix show `2026.04` while the support matrix contains `2026.07` compatibility entries ([release matrix](https://www.designdatamanager.com/services/ddm-release-matrix/), [support matrix](https://www.designdatamanager.com/services/system-requirements/); accessed 2026-08-27)?
- Which CAD, Office, Web, Multi-Site, reporting, workflow, BOM, and integration modules are enabled?
- Is licensing named, floating-concurrent, per product, per module, per server, or a combination, and are two-user concurrency tests permitted?
- Is there a current trial/evaluation term, duration, expiry behavior, offline grace period, and cleanup/uninstall process?
- Which EULA/evaluation clauses govern interoperability analysis, black-box behavior testing, static package metadata, security testing, packet/log capture, screenshots, publication, and clean-room implementation?
- Can CSI provide the installer hash/signing identity, release notes, system requirements, port/service list, data-flow/deployment diagram, supported API/integration documents, backup/restore runbook, and upgrade/rollback procedure?
- Does CSI require assisted installation or remote support, and if so, can assistance occur only inside the isolated test environment with session recording and explicit operator control?

No form, account registration, email, or media request was submitted while preparing this decision.

## 7. Verdict

**Tutorial is enough for:** vendor vocabulary, product-surface inventory, demonstrated happy paths, preliminary capability comparison, stakeholder questions, and the design of reproducible audit scenarios.

**Package/runtime audit is needed for:** exact target build and entitlement; licensing concurrency; two-user Reserve/Reference and assembly/child conflict behavior; check-in/DB/file atomicity; security enforcement; backup/restore and crash recovery; supported API/integration contracts; replication semantics; and measured performance.

**Before downloading or installing:** obtain official CSI media and written governing terms; confirm the exact build/modules/CAD pairing and permitted audit scope; verify source, hash, and signature; prepare disposable isolated infrastructure and synthetic data; and define stop/rollback conditions. Until those conditions are satisfied, remain at Gate 0 and contact CSI rather than acquiring DDM elsewhere.

## 8. First-party source register

All sources below were accessed on **2026-08-27**. No secondary source was used for this decision.

| ID | Direct first-party source | Purpose |
|---|---|---|
| `S-01` | [DDM Customer Install Media](https://www.designdatamanager.com/ddm-install-media/) | Official media/evaluation-codeword and support-request path |
| `S-02` | [DDM Release Matrix](https://www.designdatamanager.com/services/ddm-release-matrix/) | Latest public release labels and instruction to contact support for download link |
| `S-03` | [DDM 2026.04 Full Release List](https://www.designdatamanager.com/wp-content/uploads/DOC-000201751DDM-2026.04-Release-ListDoc.pdf) | Release details; retrieved PDF SHA-256 `DAD7BCFD87F61A188D8EA5C1D26A47393E184122E7AEE7E2B5578B37717AA569` |
| `S-04` | [System Requirements and Support Matrix](https://www.designdatamanager.com/services/system-requirements/) | DDM 2026.x server/client/SQL baseline and CAD compatibility notes |
| `S-05` | [CSI Customer Support Database](https://support.csi-europe.com/) | Login/registration-gated support surface |
| `S-06` | [1hr Online Demo Request](https://www.designdatamanager.com/contact-2/requestademo/) | Vendor-scheduled demo route |
| `S-07` | [Official 2016 trial post](https://www.designdatamanager.com/2016/03/01/tweet-undecided-on-a-plm-solution-trial-ddm-for-60-da/) | Historical trial evidence only; not current availability |
| `S-08` | [DDM Product Matrix](https://www.designdatamanager.com/products/ddm-product-matrix/) | Public product/module/capability and licensing wording |
| `S-09` | [DDM CAD data sheet, issue 2022.02](https://www.designdatamanager.com/wp-content/uploads/00000001642022.02Data-Sheet-DDM-CADDoc.pdf) | Historical/currently published floating-concurrent licensing wording; retrieved PDF SHA-256 `00F6C34B0721C1DFBAF918B25B2C7E55FE0D1F472DF82873B471B679AF5963AE` |
| `S-10` | [IRONCAD Tutorials](https://www.designdatamanager.com/ironcad-tutorials/) | Official visible Store/Load/Version/Reserve/Reference/change flows |
| `S-11` | [DDM Office Tutorials](https://www.designdatamanager.com/ddm-office-tutorials/) | Official visible lifecycle/folder/Reserve/Reference/approval flows |
| `S-12` | [Official DesignDataManager Product Videos](https://www.designdatamanager.com/product-videos/) | Vendor warning that some videos show an older interface |
| `S-13` | [DDM Web](https://www.designdatamanager.com/products/ddm-web-2/) | Public browser-access and access-control wording |
| `S-14` | [CSI Terms of Use](https://www.designdatamanager.com/contact-2/termsofuse/) | Website terms only; not a software EULA |
| `S-15` | [CSI Contact](https://www.designdatamanager.com/contact-2/) | Official vendor contact path |
