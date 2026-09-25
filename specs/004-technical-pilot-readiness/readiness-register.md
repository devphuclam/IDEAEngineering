# PH0 Readiness Register

**Increment**: `IE-INC-READY-001` — Technical Pilot Implementation Readiness
**Version / status**: `4.6` / Draft; P01–P06 `COMPLETE / PASS` for their stated documentary or
scoped decisions; P07 remains `NOT-RUN`
**Prepared**: 2026-09-19
**Purpose**: Sổ theo dõi P01–P07 và bằng chứng cần có trước quyết định `PG4`.
**Authority**: [tasks.md](tasks.md) và các contract trong [contracts/](contracts/).
**Product boundary**: Không thay thế DOC-04, DOC-05 hoặc các quyết định Feature/Spec/Tech.

## 1. Cách đọc sổ

- `Task state` theo dõi tiến độ của PH0; `Gate Execution State` và `Gate Outcome` chỉ áp dụng
  cho PG4 và không được dùng thay cho nhau.
- Kết quả của một readiness check chỉ là `PASS`, `FAIL`, `BLOCKED` hoặc `NOT-RUN` khi có
  phương pháp, baseline và bằng chứng tương ứng.
- PG4 có `Gate Execution State`: `NOT-RUN`, `IN-PROGRESS`, `COMPLETE`. Trước khi có quyết định,
  `Gate Outcome` là `NOT-APPLICABLE`; khi hoàn tất, kết quả là `PASS`, `PASS-WITH-ACTIONS`,
  `FAIL` hoặc `BLOCKED` theo [PG4 contract](contracts/pg4-gate-record.md).
- `NOT-RUN` không có nghĩa là đạt. `BLOCKED` phải nêu rõ thứ còn thiếu, người xử lý và ảnh hưởng.

## 2. Control envelope

| Trường | Giá trị |
|---|---|
| Stable record ID | `IE-INC-READY-001-REG-001` |
| Owner / executor | Principal Product Author; tên người chịu trách nhiệm cụ thể `BLOCKED` trước khi review |
| Reviewer | Project user acting as Project Reviewer; T006/P01 disposition `PASS` on 2026-09-22 for the exact reviewed manifest hash recorded below |
| Historical P01 review input | `IE-INC-READY-001-BL-001` at `a2cb58961c9f264152ff7395c9158b78f3cfe224`; retained as historical traceability and not the current T006 review input |
| Analyzed PH0 content baseline | Source set analyzed at `ad49bbf67a291f542b6464532185f7d701a9f298`; includes the PH0 scenario, environment, data and recovery preparation plus the author-side T021 reconciliation |
| Current PH0 source reconciliation | Current successor source set and authority states reconciled at `109c766e369793b0caa2c4cc3a576df528eddb92`; exact hashes are in [baseline-manifest.md](baseline-manifest.md), Section 2 |
| Reviewed execution-planning input | `IE-PLAN-DEC2026-003@0.2`, DOC-07@0.17, Appendix A@0.9 and Kanban@0.5 at commit `303b7225...` were reviewed on 2026-09-22; later non-material corrections remain separately pinned for T023. |
| Reviewed P01/T006 evidence | [`P01-BASELINE-001-reviewed-manifest.json`](evidence/P01-BASELINE-001-reviewed-manifest.json), SHA-256 `28F33DE52C0B4C69888EBAE3F28006C1620F90EEFDF8C4ED696016A15D1F3594`; Project Reviewer result `PASS` on 2026-09-22. |
| Declared project roles | Current project user: `Project Reviewer` for P01/P02/P03 and `PG4 Gate Authority` for PH1 readiness. These role declarations do not create a review result or gate outcome. |
| PDA approval reporting rule | When the project user reports that the Product Decision Authority approved something, confirm the exact scope, baseline/hash and date with the user before recording it as PDA evidence. |
| Approved predecessor authority | `IE-CHG-PDA-APPROVAL-001` pins the approved predecessor to `f269a0445737a7efd7f406ee51517149a8967afa` |
| Approved predecessor axes | `FEATURE-001@0.12` — `APPROVED`; normative `DOC-04@0.13` — `APPROVED`; `TECH-001@0.14` — `APPROVED` |
| Pinned successor snapshot for P01 | `DOC-04@0.15`, `DOC-05@0.22`, `DOC-06@0.18`, `DOC-08@0.13`, `VVP@0.18`, `TECH-001@0.15` and the multi-location Vault source set are pinned at commit `109c766e...` in [baseline-manifest.md](baseline-manifest.md), Section 2. Newer Draft sources, including DOC-05@0.26 and VVP@0.19, are not retroactively part of that snapshot; T023 must freeze the exact successor reviewed for PG4. The Node.js 24 delta is in Section 2.1 and execution-planning sources in Sections 3.2–3.3. |
| Successor authority state | [`IE-CHG-PDA-APPROVAL-004`](../../docs/product/instances/idea-engineering/registers/CHG-2026-09-25-pg2-pg3-approval.md) records the user's report of boss approval on 2026-09-25 for current PG2/PG3 sources. PG3 gate use is bounded to PH1 F01–F05; ADR-0009 remains Proposed due a workflow-scope conflict. T023 must pin the exact PG4 input. Earlier limited approvals remain historical. |
| Proposed PG4 successor | `IE-INC-PH1-FOUNDATION-CUSTODY-001` — PH1 F01–F05, “Khung hệ thống chạy được”, 72h; proposal only, no feature directory exists |
| Source/change trace | [IE-CHG-PH0-CORR-001](../../docs/product/instances/idea-engineering/registers/CHG-2026-09-17-ph0-readiness-correction.md) |
| Evidence rule | Không ghi `PASS` nếu chưa có bằng chứng phù hợp với phương pháp và đúng baseline; review tài liệu không thay kiểm thử ứng dụng. |
| Retention | `INTERNAL`; giữ cùng increment PH0 |

## 3. Work-package status

| Work package | Mục tiêu ngắn | Task IDs | Owner | Due condition | Gate effect | Task state | Result | Evidence link | Blocker / deviation |
|---|---|---|---|---|---|---|---|---|---|
| `P01` | Ghim baseline đã duyệt và phân biệt successor | T004–T006 | Principal Product Author / project reviewer | Trước P02 | `BLOCKS_PG4` nếu chưa xác định được baseline | `COMPLETE` | `PASS` | [baseline manifest](baseline-manifest.md); [review evidence](evidence/P01-BASELINE-001-reviewed-manifest.json), SHA-256 `28F33DE...1F3594` | T006 completed by the Project Reviewer on 2026-09-22; this result identifies sources only and does not approve a successor or PG4 |
| `P02` | Chốt một canonical Technical Pilot scenario | T007–T011 | Principal Product Author / project reviewer | Sau P01 | `BLOCKS_PG4` | `COMPLETE` | `PASS` — documentary scenario only | [review disposition](evidence/P02-T011-GUIDED-REVIEW-20260925.md); [canonical-scenario.md](canonical-scenario.md); [trace-matrix.md](trace-matrix.md) | Project Reviewer accepted all 13 T011 points on 2026-09-25 for the exact source hashes in Section 9.1. Application checks remain `NOT-RUN`; P03 and PG4 are separate. |
| `P03` | Ghi mọi quyết định và dependency còn mở | T012–T016 | Principal Product Author và authority tương ứng | Sau P01–P02 | `BLOCKS_PG4` hoặc `DEFERRED_SCOPE` theo từng dòng | `COMPLETE` | `PASS` — documentary decision capture; implementation qualification remains separate | Mục 5; [T016 decision evidence](evidence/P03-T016-DECISIONS-20260925.md) | D1/D2/D4/D5 are resolved for their stated PH1 scope; endpoint, application accounts, runtime qualification and later commercial/deployment checks remain later evidence |
| `P04` | Mô tả môi trường delivery được phép | T017, T021–T022 | Principal Product Author / Project Reviewer; later deployment owner to be assigned | Trước P07 | `BLOCKS_PG4` nếu thiếu điều kiện bắt buộc | `COMPLETE` | `PASS` | [P04 review evidence](evidence/P04-ENV-REVIEW-20260924.md); [Execution Register P04 record](../../planning/idea-technical-pilot-execution-register.json); [environment profile](environment-profile.md); [Ubuntu development runbook](../../deploy/development/README.md); [native runtime intake](../../docs/research/2026-09-23-p04-ubuntu-native-runtime-intake.md); [server template](../../config/idea-core-v0.server.env.example) | Project Reviewer directed a server review and authorized `PASS` if the one-developer development scope is met. The review passed that scoped environment and the Execution Register records P04 as `COMPLETED / PASS` at revision 10. Live SSH confirmed Ubuntu 26.04.1, installed runtimes, active loopback PostgreSQL and mounted artifact storage; Reviewer-supplied evidence confirms Vault directory permissions and separate database-role logins/privileges. Build, Flyway, application endpoints and Vault Adapter I/O remain `NOT-RUN` because IDEA source projects do not yet exist. DHCP address is acceptable for this single-developer setup; reserve DNS/IP before shared use. This PASS does not decide P05/P06/PG4 or accepted deployment. |
| `P05` | Chuẩn bị fixture và ma trận verification | T018–T019, T021–T022 | Principal Product Author / Project Reviewer | Trước P07 | `BLOCKS_PG4` nếu thiếu dữ liệu hoặc location cần thiết | `COMPLETE` | `PASS` | [test-data-and-verification.md](test-data-and-verification.md); [server fixture evidence](evidence/P05-SERVER-FIXTURES-20260924.md); [Execution Register P05 record](../../planning/idea-technical-pilot-execution-register.json) | Project Reviewer accepted the synthetic preparation on 2026-09-24. The server files, manifest, owner/mode, sizes and SHA-256 matched; Execution Register revision 12 closes P05. Application checks, PH1 accounts, multi-GB measurement and a second Vault remain outside this result. |
| `P06` | Lập kế hoạch rollback, recovery và security review | T020–T022 | Principal Product Author / assigned Project Reviewer | Trước P07 | `BLOCKS_PG4` nếu thiếu review material | `COMPLETE` | `PASS` | [recovery-and-security-plan.md](recovery-and-security-plan.md); [D3 scope evidence](evidence/D3-REVIEW-SCOPE-20260924.md); [guided review Step 1](evidence/P06-GUIDED-REVIEW-STEP1-20260924.md); [guided review Step 2](evidence/P06-GUIDED-REVIEW-STEP2-20260924.md); [guided review Step 3](evidence/P06-GUIDED-REVIEW-STEP3-20260924.md); [final disposition](evidence/P06-GUIDED-REVIEW-DISPOSITION-20260924.md); [Execution Register](../../planning/idea-technical-pilot-execution-register.json) | Project Reviewer completed the card on 2026-09-24; Execution Register revision 18 records `COMPLETED / PASS`, 1.6167 actual hours and 0 remaining hours. Result scope is PH0 documentary readiness. Runtime abuse, rollback and restore tests remain `NOT-RUN`. |
| `P07` | Chuẩn bị và ghi quyết định PG4 | T023–T027 | Gate authority | Sau P01–P06 | Quyết định authorization của PH1 | `NOT-RUN` | `NOT-RUN` | `NOT-RUN` | Chưa tổ chức gate |

DeliveryCard P07 có thể bắt đầu sau các card tiền nhiệm để ghi giờ T011/T016 và chuẩn bị gate;
WorkPackage P02/P03 vẫn giữ kết quả review riêng. T026 chỉ được quyết định sau các review và
nguồn bắt buộc. Đóng card P07 cần một kết quả PG4 đã ghi, kể cả `FAIL`/`BLOCKED`; chỉ
`PASS` hoặc `PASS-WITH-ACTIONS` hợp lệ mới cho phép F01-A.

`Result` ở trên là kết quả readiness, không phải trạng thái hoàn thành task. P01 chỉ chuyển sang
`COMPLETE` sau khi reviewer ghi nhận bằng chứng và disposition tương ứng. P04 `PASS` chỉ bao phủ
môi trường phát triển nội bộ một người. P05 `PASS` chỉ bao phủ dữ liệu tổng hợp và hồ sơ thử đã
chuẩn bị. P06 is `COMPLETE / PASS` for its documented PH0 readiness scope; runtime security and
recovery checks remain `NOT-RUN`. P02 đã `COMPLETE / PASS` cho review tài liệu;
 P03 đã `COMPLETE / PASS` cho việc ghi và phân loại các quyết định D0–D5; P07/PG4 chưa có kết quả.

## 4. Open-decision and dependency index

Đây chỉ là mục điều hướng, không phải bản ghi quyết định thứ hai. P03 phải ghi đủ câu hỏi,
lựa chọn, khuyến nghị, due condition, reopen trigger và impact cụ thể theo
[decision-and-evidence-register.md](contracts/decision-and-evidence-register.md). Các bản ghi
`D0`–`D5` duy nhất nằm ở Mục 5. Mỗi quyết định đã có disposition trong phạm vi ghi rõ;
phần qualification/runtime còn lại được giữ thành điều kiện của F05 hoặc mốc sau. P03/T016 đã
`COMPLETE / PASS` cho documentary decision capture; điều này không phải PG4.

## 4.1 PH1 scope locked to the roadmap

The proposed PG4 successor is fixed to **PH1 — F01–F05 — Khung hệ thống chạy được — 72h**.
This register does not compare or introduce another PH1 candidate.

| Roadmap card | Bounded purpose |
|---|---|
| `F01` | Source/build/test skeleton for Web, Desktop, Server and test projects |
| `F02` | PostgreSQL and migration path |
| `F03` | Controlled bootstrap, native account and session boundary |
| `F04` | Transaction and Audit seam |
| `F05` | Control-plane/data-plane smoke path with one bounded Gateway/Vault endpoint |

PH1 does not implement Logical Document/Revision/Version/Generation, Checkout/Check-in,
multi-location failover, Format Worker processing, CAD/Office conversion, multi-GB qualification,
Review/Release or production rollout. The proposed ID
`IE-INC-PH1-FOUNDATION-CUSTODY-001` is a planning label only; no PH1 feature directory exists.

## 5. Decision records prepared for P03

| ID | Question / current state | Engineering recommendation and options/trade-offs | Accountable owner / authority | Due condition / closure evidence | Affected work / gate effect | Reopen trigger |
|---|---|---|---|---|---|---|
| `D0` | `RESOLVED` for the approved Vault-transfer design and bounded PH1 F05 use. The Project Reviewer reports the boss's 2026-09-25 approval of the current PG2/PG3 sources; PH1 implements one Gateway/Vault endpoint while multi-location implementation is later. | Approve the design, including direct Client→Gateway transfer and future multi-location custody. Implement only the single-endpoint F05 slice in PH1; defer replication, repair and failover implementation. This is not deferral of the design or permission to route bytes through the business Server. | Product Decision Authority; Project Reviewer reports and bounds gate use | [`IE-CHG-PDA-APPROVAL-004`](../../docs/product/instances/idea-engineering/registers/CHG-2026-09-25-pg2-pg3-approval.md) pins the 2026-09-25 report and exact source hashes; T023 must still freeze the PG4 input. | D0 no longer blocks the PH1 scope. PG3 gate use remains bounded to F01–F05 because ADR-0009 has an unresolved workflow-scope conflict; D1/D2/D4/D5 and PG4 remain separate. | Reopen before W06/multi-location custody or any durability/failover claim. |
| `D1` | Gateway and Format Worker qualification: `RESOLVED_FOR_PH1_PLAN`; exact runtime/adapter qualification remains `NOT-RUN`. | D1-A: qualify one single-endpoint Gateway/Adapter path for F05, with scoped Grant, digest, Receipt and private staging; record owner, source/license intake and the F05 verification plan. D1-B: retain the selected Format Worker boundary for Core v0 but defer exact runtime/toolchain/format qualification. | Engineering + current development server operator + applicable authority | Before F05 acceptance: qualify the exact adapter/runtime/license and running endpoint. D1-B reopens at the first format-processing work package. | `NONE` for documentary PG4 preparation once the boundary/owner/plan are recorded; `BLOCKS_LATER_MILESTONE` for F05 acceptance until the endpoint and transfer evidence exist. | Format conversion, preview, extraction, representation generation or licensed CAD/Office processing enters scope. |
| `D2` | `RESOLVED_FOR_PH1_ENVIRONMENT`; application accounts/endpoint qualification remains `NOT-RUN`. The Project Reviewer selected Ubuntu Server 26 for one-developer Java Server/Web/native PostgreSQL/one-Vault development; Windows remains the Desktop/Workspace/CAD machine. | Use the qualified development host, native PostgreSQL and one filesystem Vault for PH1 preparation; create native IDEA test accounts and verify Windows-to-one-Gateway connectivity during F03/F05. Preserve one monorepo and defer a second location/failure-domain claim. | Project Reviewer/current development server operator; later Operations owner to be named | Before PH1 acceptance: native IDEA test accounts, one permitted Gateway endpoint and the client path. Later accepted deployment and additional users require their own network, account and operations evidence. | `NONE` for the P03 decision record; `BLOCKS_LATER_MILESTONE` for the affected PH1 runtime checks until application accounts/endpoint evidence exist. Second location remains deferred implementation scope. | Host, network, identity or storage topology changes; reopen before multi-location work. |
| `D3` | `RESOLVED` for the current P06 documentary scope. The Project Reviewer reported the boss's 2026-09-24 approval and delegation; the reviewer’s introductory competence basis, guided material, findings and `PASS` disposition are recorded. | Review account/session, authorization, Grant, Receipt, custody and Audit for PH1 before accepting applicable P06/PG4 evidence. Defer recovery/storage specialist review only while PH1 makes no backup/failover/production-recovery claim. | Boss as reported Product Decision Authority; current Project Reviewer assigned directly to Security/Verification review | Current documentary condition satisfied by [D3 evidence](evidence/D3-REVIEW-SCOPE-20260924.md) and the [P06 final disposition](evidence/P06-GUIDED-REVIEW-DISPOSITION-20260924.md). No extra signature or independence rule is invented. | P06 documentary result is `PASS`; runtime and PG4 evidence remain separate. | Reopen for backup, restore, failover, production recovery, operational SLA or assurance-level changes. |
| `D4` | `RESOLVED_FOR_PH1_FIXTURE_SCOPE`: Product Decision Authority accepted the deterministic 1 KiB and 64 MiB synthetic files for PH1 smoke; server fixture directory is separate from the Vault and review/delete remains 2027-01-31. | Use the bounded files with generator/version, size, SHA-256, provenance and disposal owner; defer multi-GB/throughput/concurrency/resource qualification to Q03 or a later authority decision. | Project Reviewer as data custodian and PG4 Gate Authority under the reported delegation | P05 server files, manifest, hashes, owner and retention evidence are recorded. PH1 transfer checks must still be run when F05 exists. | `NONE` for the bounded PH1 scope; `BLOCKS_LATER_MILESTONE` for any multi-GB, throughput, concurrency or resource-limit claim. No performance claim follows. | First multi-GB/large-transfer, throughput, concurrency or resource-limit claim. |
| `D5` | `RESOLVED_FOR_INTERNAL_PH1_INTAKE`: use the existing native PostgreSQL 18.6, Temurin 25.0.4.1+1 and Node.js 24.21.0 development artifacts under the intake rule; Docker/Windows ZIP evidence stays historical. | Before first use, record exact source/version/license/use/distribution for each new package or asset; create application lockfiles and transitive/security review when F01 introduces source. Keep unclear commercial rights `REFERENCE-ONLY` or `BLOCKED-LEGAL`. | Principal Product Author + legal/company owner when required | Current native runtime intake is recorded. Every new package, SDK, converter, asset, source or future commercial distribution model reopens the intake. | `NONE` for the current internal PH1 preparation; `BLOCKS_LATER_MILESTONE` only for an unreviewed dependency at the moment it would be used. No Tech Stack change or commercial-rights conclusion is authorized. | Selected native package/source, upstream terms, intended distribution model or another runtime/asset/source changes. |

The 2026-09-25 authority dispositions are recorded in the forms below and in
[P03-T016-DECISIONS-20260925](evidence/P03-T016-DECISIONS-20260925.md). They close only the
documentary decision scope; they do not qualify an unbuilt endpoint or application runtime.

### 5.1 T016 decision-capture forms

These forms are the human capture surface for T016. D0/D3 cite separate decision evidence;
blank D1/D2/D4/D5 choices are not decision records. The proposed successor is fixed to
`IE-INC-PH1-FOUNDATION-CUSTODY-001` / F01–F05 / 72h; no alternative PH1 is introduced here.

#### D0 — Vault-transfer design and PH1 implementation boundary (`RESOLVED` for PH1)

| Field | Prepared entry / human entry |
|---|---|
| Decision ID | `D0` |
| Exact question | Phần nào của successor Vault-transfer được phê duyệt cho PH1 F05, và phần nào chỉ được hoãn đến giai đoạn nhiều Vault? |
| Engineering proposal before decision | C — approve only the F05 slice and defer the rest of the successor. The reported authority disposition below supersedes that narrower approval proposal. |
| Authority disposition as reported | The boss approved the whole current requirements/design source set on 2026-09-25. PH1 implements only the one-endpoint F05 slice; multi-location design is approved but its implementation is later. |
| Required authority | Product Decision Authority |
| Decision baseline | [`IE-CHG-PDA-APPROVAL-004`](../../docs/product/instances/idea-engineering/registers/CHG-2026-09-25-pg2-pg3-approval.md) lists exact 2026-09-25 source hashes; predecessor `f269a044...` and the earlier Vault direction remain separately pinned. T023 must freeze the gate input. |
| Effect on PH1 | F05 dùng đường truyền trực tiếp Client→Gateway; PH1 không chứng minh hai location, replication, failover, repair hay mức durability vận hành. PG3 gate use is bounded to F01–F05 while ADR-0009 remains Proposed. |
| Reopen trigger | Trước W06/multi-location custody hoặc bất kỳ claim nào về failover/durability. |
| Project Reviewer confirmation | The project user confirmed the reported boss approval date/scope and the one-endpoint PH1 boundary on 2026-09-25. |
| Authority date and rationale | 2026-09-25; approve the design baseline while staging implementation. See the decision report; no signed minutes were supplied. |

#### D1 — Gateway path and Format Worker

| Field | Prepared entry / human entry |
|---|---|
| Decision ID | `D1` (canonical record; D1-A/D1-B are subquestions, not new authority IDs) |
| Exact question | PH1 cần qualify phần nào của Artifact custody và phần nào được defer? |
| Recommended option | **D1-A:** qualify one allowed Gateway/adapter path for Client→Gateway, scoped Grant, digest, Receipt and private staging. **D1-B:** `DEFERRED_SCOPE` Format Worker runtime/toolchain/format qualification. |
| Alternative options | Require a Gateway revision before PH1; bring Format Worker qualification into PH1; or defer the whole F05 path (requires roadmap/gate impact review). |
| Required authority | Engineering + current development server operator + applicable authority |
| Decision baseline | Current Tech/architecture successor inputs; selected Worker boundary is retained, exact Worker runtime/toolchain remains `NOT-RUN`. |
| Effect on PH1 | PG4 cần phương án triển khai D1-A và kế hoạch kiểm tra; endpoint chạy thật và phép thử truyền file là kết quả cần đạt trong F05. PH1 không làm CAD/Office conversion, preview, extraction hoặc representation generation. |
| Reopen trigger | First work package that executes CAD/Office processing or requires a licensed format tool. |
| Human choice | `D1-A: Chốt boundary/owner/verification plan; D1-B: DEFERRED_SCOPE` |
| Date | `2026-09-25` |
| Rationale | PH1 cần một Gateway/Vault endpoint; exact runtime/adapter/license sẽ qualify trong F05. Format Worker boundary giữ cho Core v0 nhưng chưa qualify runtime/toolchain. |

#### D2 — Minimum PH1 environment

| Field | Prepared entry / human entry |
|---|---|
| Decision ID | `D2` |
| Exact question | Ubuntu development host đã cấp có đáp ứng môi trường tối thiểu cho F01–F05 và đường kết nối Windows client không? |
| Recommended option | **For P04 now:** inspect the allocated Ubuntu development server, qualify native PostgreSQL 18 and one filesystem Vault location, record the current developer as development-secret custodian, and retain Windows for Desktop/Workspace/CAD. **Before PH1 acceptance:** show one permitted Gateway endpoint, the required client path and two native IDEA test accounts. **Later:** accepted-deployment operations and second-location/failure-domain evidence. |
| Alternative options | Approve a different permitted allocation; require revision; or block PH1 until allocation exists. |
| Required authority | Project Reviewer/current development server operator for the development allocation; later accepted-deployment owner to be named |
| Decision baseline | `environment-profile.md`, `test-data-and-verification.md`; allocation is not assumed from the planning profile. |
| Effect on PH1 | One endpoint is enough for F05. Two Vault locations are not a PH1 prerequisite. |
| Reopen trigger | Host/network/identity/storage topology changes or before multi-location work. |
| Human choice | `Chốt môi trường Ubuntu 26 + PostgreSQL native + một Vault; Windows là client/Workspace; endpoint và native IDEA accounts làm trong F03/F05` |
| Date | `2026-09-25` |
| Rationale | PH1 cần một endpoint; multi-vault là thiết kế đã duyệt nhưng implementation để sau. |

#### D3 — Specialist review scope and timing

| Field | Prepared entry / human entry |
|---|---|
| Decision ID | `D3` |
| Exact question | Phạm vi và thời điểm review nào là đủ cho account/session, authorization, Grant, Receipt, custody và Audit trong PH1? |
| Recommended option | Require suitable security and verification review for the PH1 boundary before the applicable PG4/P06 evidence is accepted. Defer recovery/storage-specialist work only if authority permits and PH1 makes no backup, failover or production-recovery claim. |
| Alternative options | Require all recovery/storage review now; require review before merge; or require a narrower review before PH1 acceptance. |
| Required authority | Project authority and applicable Quality/Security authority |
| Decision baseline | Constitution, `recovery-and-security-plan.md`, PH0 P06 contract; no extra signature or independence rule is added. |
| Effect on PH1 | The P06 documentary condition is satisfied. Runtime security/verification evidence remains required before any matching PH1/PG4 claim. |
| Reopen trigger | Backup, restore, failover, production recovery or assurance-level scope enters the increment. |
| Human choice | Recommended PH1 scope confirmed; direct Security/Verification review assigned to the current Project Reviewer. Guided P06 review completed with result `PASS`; introductory competence and the no-independent-review limit are recorded. |
| Date | `2026-09-24` (reported boss approval and user confirmation) |
| Rationale | Keep runtime Security/Verification evidence separate from the accepted P06 plan. Defer recovery/storage specialist review only without backup, failover or production-recovery claims. See [D3 evidence](evidence/D3-REVIEW-SCOPE-20260924.md) and the [P06 final disposition](evidence/P06-GUIDED-REVIEW-DISPOSITION-20260924.md). |

#### D4 — PH1 fixture size and provenance

| Field | Prepared entry / human entry |
|---|---|
| Decision ID | `D4` |
| Exact question | PH1 có được dùng fixture tổng hợp có kích thước giới hạn để kiểm tra custody smoke path không? |
| Recommended option | Accept one deterministic bounded synthetic fixture with generator/version, size, SHA-256, provenance and retention/disposal owner; defer multi-GB, throughput, concurrency and resource-limit qualification. |
| Alternative options | Keep a large fixture mandatory now; or require revision of the fixture profile before PH1. |
| Required authority | Principal Product Author + data custodian; Product Decision Authority for scope effect |
| Decision baseline | `test-data-and-verification.md`, QRS-011/QRS-013 and D4 evidence contract. |
| Effect on PH1 | If the Product Decision Authority accepts this profile, the bounded fixture can support PH1 Grant/digest/Receipt/private-staging checks; a successful check would not prove large-transfer performance. |
| Reopen trigger | First multi-GB, throughput, concurrency or memory/resource-limit claim. |
| Human choice | `Chốt fixture 1 KiB + 64 MiB cho PH1 smoke; nhiều GB để Q03/later` |
| Date | `2026-09-25` |
| Rationale | Đủ kiểm tra Grant/digest/Receipt/private staging, không suy ra throughput hay scale. |

#### D5 — External dependency intake

| Field | Prepared entry / human entry |
|---|---|
| Decision ID | `D5` |
| Exact question | Bộ dependency cụ thể của F01–F05 có thêm source bên ngoài chưa được kiểm soát không? |
| Recommended option | Retain the Docker image and Windows Temurin ZIP as historical candidates. Pin and qualify native Ubuntu PostgreSQL 18, Temurin 25 and Node.js 24 package sources/versions before use; freeze future lockfiles and keep unresolved sources `REFERENCE-ONLY` or `BLOCKED-LEGAL`. |
| Alternative options | Approve an exact new source after intake; replace it with an internal/platform capability; or keep it `REFERENCE-ONLY`/`BLOCKED-LEGAL`. |
| Required authority | Principal Product Author + legal/company owner where a new source exists |
| Decision baseline | [external-source-intake.md](../../docs/agents/external-source-intake.md) and the exact PH1 dependency manifest. |
| Effect on PH1 | PostgreSQL, Temurin và Node.js bản native đã có bằng chứng cài đặt/sức khỏe; exact package intake vẫn phải đối chiếu. Future application lockfiles chỉ có thể kiểm tra khi F01–F05 tạo source; nguồn chưa rõ quyền dùng sẽ chặn đúng lần sử dụng đó, không đổi Tech Stack ngầm. |
| Reopen trigger | New package, runtime, SDK, converter, asset, source or future commercial distribution model. |
| Human choice | `Chốt intake trước khi dùng; giữ native PostgreSQL 18.6, Temurin 25.0.4.1+1 và Node.js 24.21.0 cho nội bộ; lockfile kiểm khi F01 tạo source` |
| Date | `2026-09-25` |
| Rationale | Không đổi Tech Stack và không suy ra quyền thương mại từ hồ sơ phát triển nội bộ. |

| PH1 dependency need | Current category | Intake treatment |
|---|---|---|
| Java/Temurin/Spring/PostgreSQL server path | Existing Tech/architecture baseline; native PostgreSQL, Temurin and Node.js installation evidence exists, while future application packages have not been selected/installed | Reconcile installed runtime intake now; inspect application dependencies and lockfiles before their first use, without inventing a new Tech selection. |
| React/TypeScript/Web and WPF/WebView2/.NET Workspace build path | Existing Tech/architecture baseline; application source and its lockfiles do not exist before PH1 | Record the planned build boundary now; qualify exact workstation packages and application lockfiles when F01 creates them. |
| One Artifact Gateway/Vault adapter for F05 | Exact adapter/runtime/provider is not yet selected | Intake and license evidence only if the concrete implementation adds a source not already approved. |
| CAD/Office converter or Format Worker | Explicitly excluded from PH1 | No PH1 dependency; D1-B reopens at format-processing work. |
| New package, SDK, source, asset or service not listed above | New external inclusion | Record exact name/version/source/license/use/distribution/approval before inclusion. |

The forms above record the 2026-09-25 authority dispositions for D1, D2, D4 and D5 within their
stated PH1/documentary scope. They do not qualify an unbuilt endpoint, application account,
Format Worker or future dependency. D0 and D3 remain resolved only to their stated scopes.

## 6. Readiness-check index

| Check family | Planned checks | Method / baseline | Result | Evidence |
|---|---|---|---|---|
| P01 baseline | `P01-BASELINE-*` | Hash và authority record | `PASS` | [reviewed manifest](evidence/P01-BASELINE-001-reviewed-manifest.json), SHA-256 `28F33DE52C0B4C69888EBAE3F28006C1620F90EEFDF8C4ED696016A15D1F3594` |
| P02 scenario | `P02-SCENARIO-*` | Walkthrough và trace review | `PASS` for the exact documentary inputs; application checks `NOT-RUN` | [P02/T011 review](evidence/P02-T011-GUIDED-REVIEW-20260925.md) |
| P03 decisions | `P03-DECISION-*` | Register inspection | `PASS` for documentary D0–D5 dispositions; runtime/application checks remain `NOT-RUN` | §5 and [T016 decision evidence](evidence/P03-T016-DECISIONS-20260925.md) |
| P04 environment | `P04-ENV-*` | Profile and live-host review | `PASS` | [P04 review evidence](evidence/P04-ENV-REVIEW-20260924.md) |
| P05 dataset | `P05-DATA-*` | Fixture/matrix inspection | `PASS` for preparation only; application checks `NOT-RUN` | [Server fixture evidence](evidence/P05-SERVER-FIXTURES-20260924.md) |
| P06 recovery/security | `P06-RECOVERY-*`, `P06-SECURITY-*` | Procedure and reviewer-competence review; PH0 documentary scope | `PASS`; runtime checks `NOT-RUN` | [Final guided-review disposition](evidence/P06-GUIDED-REVIEW-DISPOSITION-20260924.md) |
| P07 gate | `P07-GATE-*` | Attributable authority decision | `NOT-RUN` | `NOT-RUN` |

## 7. T021 author-side cross-check

T021 đã hoàn tất ở cấp tác giả: các hồ sơ P04–P06 được đối chiếu với D0–D5 và mọi điều kiện
chưa có bằng chứng đều được giữ ở `BLOCKED`, `UNKNOWN` hoặc `NOT-RUN`. Việc này không đóng
decision, không tạo reviewer evidence và không chuyển readiness result sang `PASS`.

| Prerequisite | Source | Current evidence state | Decision / gate effect |
|---|---|---|---|
| Host allocation and network path | [environment-profile.md](environment-profile.md), Sections 1–2; [static-IP evidence](evidence/P07-UBUNTU-HOST-STATIC-IP-20260925.md) | Authenticated SSH inventory confirms Ubuntu 26.04.1 LTS, static development address `192.168.137.33`, resources and dedicated artifact mount; application endpoints remain `NOT-RUN` | D2 decision is resolved for PH1 environment scope; application endpoint evidence remains a later PH1 condition |
| OS, runtime and tool versions | [environment-profile.md](environment-profile.md), Sections 1–2 | Ubuntu OS/Git/filesystem observed. Exact Temurin 25, Node.js 24/npm and PostgreSQL 18.6 versions checked; separate database-role login and schema privilege checks passed. Product build and Gateway/Vault Adapter I/O remain untested. | D1 decision is resolved for the plan; exact Gateway/Adapter and Format Worker qualification remains `NOT-RUN` |
| License and external-source intake | [environment-profile.md](environment-profile.md), Section 2; D5; [native Ubuntu intake](../../docs/research/2026-09-23-p04-ubuntu-native-runtime-intake.md) | Internal-development artifact identities, hashes and direct license terms recorded; installed license-file presence checked. Full transitive/security and commercial-redistribution review plus future application lockfiles remain open. | D5 is resolved for current internal PH1 intake; each new source still requires intake before use |
| Test identities | [test-data-and-verification.md](test-data-and-verification.md), Section 2; D2 | Synthetic identity profiles are defined; native IDEA account allocation and access remain `NOT-RUN` | D2 decision is resolved for the environment; account/endpoint evidence remains a PH1 implementation condition |
| Vault locations and failure domain | [test-data-and-verification.md](test-data-and-verification.md), Section 3; D0/D2; [`IE-CHG-PDA-APPROVAL-004`](../../docs/product/instances/idea-engineering/registers/CHG-2026-09-25-pg2-pg3-approval.md) | Future one-to-many custody design is approved as reported; exact topology, isolation, operational second location and failover remain `UNKNOWN` / `NOT-RUN` | D0 is resolved for the PH1 single-endpoint scope; D2 remains open for qualification. No operational multi-location guarantee is claimed. |
| Dataset, provenance and retention | [test-data-and-verification.md](test-data-and-verification.md), Sections 1 and 5; [server fixture evidence](evidence/P05-SERVER-FIXTURES-20260924.md); D4 | P05 profile, generator, expected digests, custodian and review/delete date are recorded; observed server files, manifest, size, hashes and ownership match the preparation baseline | Project Reviewer P05 preparation `PASS`; D4 is resolved for bounded PH1 smoke, with no large-transfer claim |
| Secret/configuration ownership | [environment-profile.md](environment-profile.md), Sections 3–4; [Windows client template](../../config/idea-core-v0.env.example); [Ubuntu development template](../../config/idea-core-v0.server.env.example) | Separate non-secret Windows-client and Ubuntu-development templates prepared. Project Reviewer / LEAD holds development credentials; a later accepted-deployment owner is still to be named. | P04 development-scope result is `PASS`; later deployment ownership remains open. No secret value is requested or stored in either tracked template. |
| Specialist reviewer competence and independence | [recovery-and-security-plan.md](recovery-and-security-plan.md), Section 4; [D3 evidence](evidence/D3-REVIEW-SCOPE-20260924.md) | Current Project Reviewer completed the guided review with introductory security knowledge; the competence limit is explicit and no independent-human review is claimed. | D3 is satisfied for the current documentary scope; reopen when a deferred specialist claim enters scope |
| Backup, restore and rollback | [recovery-and-security-plan.md](recovery-and-security-plan.md), Sections 2.4–2.5 | Procedure review is `PASS`; execution and restore evidence remain `NOT-RUN` | No runtime recoverability claim is made |
| Security review and abuse cases | [recovery-and-security-plan.md](recovery-and-security-plan.md), Section 3 | Documentary review is `PASS`; specialist and runtime evidence remain `NOT-RUN` | P06 result is `PASS` for the documented plan; runtime and PG4 outcomes remain separate |
| Artifact Gateway / Format Worker qualification | [environment-profile.md](environment-profile.md), Section 2; D1 | Worker boundary is selected for Core v0; exact Gateway/Adapter and Format Worker runtime/toolchain/license qualification `NOT-RUN` | D1 plan is resolved; F05 endpoint qualification and later format processing remain separate |

**T021 disposition:** `COMPLETE` as an author-side reconciliation only. P04 and P05 subsequently
received scoped `PASS` results, and P06 received `PASS` for its documentary plan. Runtime P06
checks remain `NOT-RUN`. D0–D5 now have recorded 2026-09-25 dispositions within their stated
scope; endpoint, application-account, format-processing and future dependency evidence remains
separate and is not implied by this decision capture.

## 8. T006 review evidence and human action

| Field | Recorded value |
|---|---|
| Check ID | `P01-BASELINE-001` |
| Author package state | `REVIEWED` — source identity and authority-state reconciliation complete; Project Reviewer result recorded below |
| Exact input baseline | `IE-INC-READY-001-BL-001@0.2`; product-successor source reconciliation at `109c766e369793b0caa2c4cc3a576df528eddb92` plus execution plan `IE-PLAN-DEC2026-003@0.2` at commit `303b7225ebd0fab1cbef850c6dbc4881d960672b` |
| Exact review-evidence hash | [`P01-BASELINE-001-reviewed-manifest.json`](evidence/P01-BASELINE-001-reviewed-manifest.json), SHA-256 `28F33DE52C0B4C69888EBAE3F28006C1620F90EEFDF8C4ED696016A15D1F3594` |
| Reviewer / date | Project user acting as Project Reviewer / 2026-09-22 |
| `BL-DISC-001` disposition | `ACCEPTED` — the later attributable approval record governs the exact predecessor; historical status prose is retained. |
| `BL-DISC-002` disposition | Approved predecessor exists; limited PDA policy approval and confirmed Vault direction are recorded separately; remaining successor sources stay separate inputs; exact successor/PH1 disposition remains `NOT-RUN` and tracked as `D0`. |
| `BL-DISC-002` reviewer disposition | `ACCEPTED` — approved predecessor, limited policy approval, confirmed Vault direction and remaining successor states remain separate; D0 is not resolved by this review. |
| `BL-DISC-003` disposition | `ACCEPTED` — Appendix A@0.6 retains the historical correction; the reviewed planning input is Appendix A@0.9 and `IE-PLAN-DEC2026-003@0.2` at commit `303b7225...`. |
| Result | `PASS` — source identity and authority-state separation are reproducible. This does not approve a product successor, resolve D0, decide PG4 or authorize PH1. |
| Required human action | `COMPLETE` — the Project Reviewer inspected the prepared summary and explicitly recorded `PASS`. |
| Gate effect | P01 is `COMPLETE`/`PASS` and T011/P02 review may begin. P02–P07 and PG4 remain `NOT-RUN`. |

### 8.1 T006 compact human decision block

The Project Reviewer completes only the blank fields below. The recommended result is guidance,
not a recorded review result.

| Field | Prepared value / reviewer entry |
|---|---|
| Review ID | `P01-BASELINE-001` |
| Exact baseline | `IE-INC-READY-001-BL-001@0.2`: product-successor source reconciliation at `109c766e369793b0caa2c4cc3a576df528eddb92` plus execution plan `IE-PLAN-DEC2026-003@0.2` at commit `303b7225ebd0fab1cbef850c6dbc4881d960672b` |
| Review evidence | [`P01-BASELINE-001-reviewed-manifest.json`](evidence/P01-BASELINE-001-reviewed-manifest.json), SHA-256 `28F33DE52C0B4C69888EBAE3F28006C1620F90EEFDF8C4ED696016A15D1F3594` |
| `BL-DISC-001` disposition | `ACCEPTED` — later attributable approval record governs the exact predecessor; historical wording remains |
| `BL-DISC-002` disposition | `ACCEPTED` — approved predecessor and successor authority states remain separate; exact successor/PH1 disposition remains outside T006 |
| `BL-DISC-003` disposition | `ACCEPTED` — historical Appendix A@0.6 correction and reviewed Appendix A@0.9 execution baseline are correctly separated |
| Known evidence limitation | No separate signed minutes or digital-signature artifact exists; PH0 governance does not require one. Reviewer decides whether the existing attributable approval record is sufficient. |
| Reviewer identity | Project user acting as `Project Reviewer` |
| Review date | `2026-09-22` |
| Result | `PASS` |
| Rationale | The approved predecessor, later deltas and current execution plan are separately identifiable and reproducible. The absence of a separately signed minute is retained as an evidence limitation, not a blocker. |

Do not add a signature requirement. A reviewer result does not approve the successor delta or
authorize PH1; it only records T006/P01 evidence.

## 9. Review handoff preparation

Các mục dưới đây đã được chuẩn bị để reviewer dùng khi thực hiện T011, T016, T022 và T031.
Chúng không thay thế review hoặc runtime evidence.

| Review task | Prepared source identity | Reviewer state | Required action |
|---|---|---|---|
| T011 — scenario walkthrough | `canonical-scenario.md` SHA-256 `284E9F829EFE0EABFC4BFEB9AE836B6F86BF1B91A97C4C8F928720697C82B301`; `trace-matrix.md` SHA-256 `E9C66CE89F26C6529126265F9DD872E176BF65145B234158B7DCA0182DC0CADD`; pin the successor set again at T023 | `COMPLETE / PASS` | [Project Reviewer disposition](evidence/P02-T011-GUIDED-REVIEW-20260925.md) records all 13 results. Runtime tests remain `NOT-RUN`. |
| T016 — decision review | Mục 5, `D0`–`D5`, [decision evidence](evidence/P03-T016-DECISIONS-20260925.md) and [PDA approval report](../../docs/product/instances/idea-engineering/registers/CHG-2026-09-25-pg2-pg3-approval.md) | `COMPLETE / PASS` — documentary decision capture | D0–D5 have owner, date, baseline, effect and reopen trigger. Endpoint, application-account, format-processing and future dependency qualification remain later evidence; T023 must freeze the newer source set. |
| T022 — P04/P05/P06 result review | P04 profile SHA-256 `78D7E8905D6E79CBE2DD16E17631AE693DA39EA5872A24ED21A404A700036BFF`; [P04 review evidence](evidence/P04-ENV-REVIEW-20260924.md), SHA-256 `5B687457E19ADAB2F0B3F595E3D95CC828F1AB838494D3C794A80B9EADEF3CB1`. P05: `test-data-and-verification.md@0.4` SHA-256 `07526BB9490C548397AD85A689776EE8CEAC47FDE307025971743E92519AE007` and [server fixture evidence](evidence/P05-SERVER-FIXTURES-20260924.md), SHA-256 `2498FB0AB6DA1EEE80545C092BFFDACF0EEC35D31D1E11B62B224C77CBF4B4FF`; P06: `recovery-and-security-plan.md@0.5` SHA-256 `9B8064F1A1B3D5428D723B1BF87EB744C04A2B32E072C89C8B933A26D2657700`; [review disposition](evidence/P06-GUIDED-REVIEW-DISPOSITION-20260924.md), SHA-256 `0A92FBE2B3DA99503CB841B39D5E0C95D3AA1A889767ED1D2500868BF44B73F6`; Steps 1–3 SHA-256 `81F37FB4FE952F66A051B9A4E614D22D6B0A1D57F33EAB5AC0315CCEC425F1A8`, `402DD9C73EE14F14F992BA46DBBA12522F2148DF2C5B57C80B9E912630179B3D`, `E89FED41A18F230FE32094F04B0B84E9F83F30097E821F667B2375F30CC980C9` | `COMPLETE` | Project Reviewer recorded P06 `PASS`; tracker P06 is `COMPLETED / PASS` at Execution Register revision 18. All three package results, reviewers, evidence links and hashes are present. |
| T031 — checklist review | [readiness checklist](checklists/readiness.md), CHK016 reviewed for P04 environment-record completeness; other items remain unchecked; analyzed package baseline `ad49bbf...` | `IN-PROGRESS` | Project Reviewer evaluates remaining checklist items; checklist approval is quality evidence only and cannot authorize PG4 |

### Review-assistant re-evaluation notes (not controlled results)

- **T006:** No applicable PH0 governance rule or baseline-manifest contract requires signed minutes,
  wet/digital signature or a separately signed approval artifact. `IE-CHG-PDA-APPROVAL-001`
  contains the decision date, authority, reporter, exact approved commit, source versions, hashes
  and three recorded dispositions. The absent signed artifact is retained as an evidence limitation,
  not an automatic blocker. The Project Reviewer accepted the recorded decision evidence and
  recorded `PASS` on 2026-09-22; T006/P01 is complete for the reviewed manifest hash in Section 8.
- **P02-R13:** The P02 Audit trace uses exact `REQ-AUD-001/002`; the previous wildcard ambiguity
  is resolved. The Project Reviewer accepted this trace with the other 12 points in
  [the T011 disposition](evidence/P02-T011-GUIDED-REVIEW-20260925.md). Runtime verification remains `NOT-RUN`.

### 9.1 T011 compact human decision block

The Project Reviewer accepted all 13 points on 2026-09-25. The concise results below are backed by
[the guided review evidence](evidence/P02-T011-GUIDED-REVIEW-20260925.md); they are documentary
review results, not application test results.

| Check | Review point | Result (`PASS`/`FAIL`/`BLOCKED`) | Finding / note |
|---|---|---|---|
| `P02-R01` | Normal path: login → Logical Document/Generation → Checkout/Reference → Workspace digest → changed Check-in → Review → Approval → Release → historical retrieval → Audit | `PASS` | Ordered path accepted. |
| `P02-R02` | No-change Check-in ends the in-scope hold and creates no new Generation/Version | `PASS` | No new content identity. |
| `P02-R03` | RBAC denial and business gate refusal identify the reason | `PASS` | Eligibility and business gate separate. |
| `P02-R04` | Stale Generation does not overwrite and local work remains | `PASS` | Safe local recovery retained. |
| `P02-R05` | Wrong Workspace or non-owner is refused | `PASS` | No publication on refusal. |
| `P02-R06` | Modified Reference cannot publish to its original Logical Document | `PASS` | Copy and confirmed discard separate. |
| `P02-R07` | Interrupted transfer preserves the candidate and provides recovery path | `PASS` | Private staging is not publication. |
| `P02-R08` | Lost response retries only the same `OperationId` and identical input | `PASS` | No second business operation. |
| `P02-R09` | Changed Check-in is refused during `Under Review`; local edits do not change the submitted Generation. Withdraw/Reject closes the Round before a revised Check-in and new Submit. | `PASS` | New Round inherits no prior decision. |
| `P02-R10` | Invalid Release scope is refused without silent cascade | `PASS` | Whole confirmed scope refused. |
| `P02-R11` | Historical Controlled Release Package is retrieved by exact digest/baseline | `PASS` | Prior release remains pinned. |
| `P02-R12` | Mandatory, deferred and prohibited scope are distinct | `PASS` | Deferral does not delete scope. |
| `P02-R13` | Every path traces to REQ, architecture and VVP; Audit uses exact `REQ-AUD-001` and `REQ-AUD-002` | `PASS` | 20 P02 trace rows checked; no explicit ID missing. |

| T011 capture field | Reviewer entry |
|---|---|
| Scenario SHA-256 | `284E9F829EFE0EABFC4BFEB9AE836B6F86BF1B91A97C4C8F928720697C82B301` |
| Trace-matrix SHA-256 | `E9C66CE89F26C6529126265F9DD872E176BF65145B234158B7DCA0182DC0CADD` |
| Reviewer identity | Project user acting as Project Reviewer |
| Review date | 2026-09-25 (Asia/Ho_Chi_Minh) |
| Overall T011 disposition | `PASS` — P02 documentary scenario review only |
| Overall rationale | Reviewer accepted Q1–Q10 recommendations and then confirmed Q11–Q13. No P02 documentary blocker; runtime and P03 decisions remain separate. |
| Review evidence | [P02-T011-GUIDED-REVIEW-20260925](evidence/P02-T011-GUIDED-REVIEW-20260925.md), SHA-256 `092CDA971D0F1F85EA0AD3AF4F60B5EDA7C8DC1717FBB565666032B09D9D1DB4` |

## 10. PH0 Human Action Board

Đây là bảng điều hướng bàn giao, không phải nguồn thẩm quyền mới. Bản ghi chính vẫn là
[baseline-manifest.md](baseline-manifest.md), Mục 5 của sổ này, các contract và checklist được
liên kết. Phân loại dùng trong bảng:

- **A — Agent-executable now**: có thể kiểm tra hoặc chuẩn bị bằng bằng chứng repository hiện có.
- **B — Agent-preparable, human-decidable**: có thể chuẩn bị hồ sơ; người có thẩm quyền phải review hoặc quyết định.
- **C — Blocked by external/company evidence**: cần môi trường, người, dữ liệu, license hoặc xác nhận công ty.
- **D — Gate-authority only**: chỉ authority được chỉ định mới được ghi kết quả.

| Action ID | Task / package | Phân loại | Vai trò hoặc authority bắt buộc | Việc phải làm và bằng chứng cần xem | Trạng thái hiện tại | Ảnh hưởng / kết quả sau khi hoàn tất |
|---|---|---|---|---|---|---|
| `HA-001` | T006 / P01 | B | Project Reviewer | Xem [baseline manifest](baseline-manifest.md), approval record, reviewed planning sources and BL-DISC-001…003; retain one reproducible review-evidence file. | `COMPLETE` / `PASS`; Project Reviewer, 2026-09-22; [evidence](evidence/P01-BASELINE-001-reviewed-manifest.json) SHA-256 `28F33DE...1F3594` | P01 complete; P02 review may begin; D0 and PG4 remain open. |
| `HA-002` | T011 / P02 | B | Project Reviewer; chỉ thêm vai trò khác nếu governance/authority chỉ định | Walkthrough 13 mục ở Mục 10.1 trên `canonical-scenario.md` và `trace-matrix.md`; xác nhận hash và ghi result/evidence. | `COMPLETE / PASS` on 2026-09-25; [review evidence](evidence/P02-T011-GUIDED-REVIEW-20260925.md) | P02 documentary review complete; no requirement or runtime result created. |
| `HA-003` | T016 / P03 — D0 | D | Product Decision Authority | Đối chiếu quyết định duyệt thiết kế Vault-transfer ngày 2026-09-25 với phạm vi triển khai một endpoint của F05 và source hashes. | `RESOLVED` for PH1; [decision report](../../docs/product/instances/idea-engineering/registers/CHG-2026-09-25-pg2-pg3-approval.md) | Giữ thiết kế nhiều Vault nhưng hoãn triển khai tới work package sau; D0 không tự giải quyết D1/D2/D4/D5 hoặc PG4. |
| `HA-004` | T016 / P03 — D1 | C/D | Engineering + current development server operator + authority phù hợp | Ghi riêng D1-A Gateway path cần cho F05 và D1-B Format Worker deferred; xác nhận adapter/runtime/license/endpoint chỉ cho D1-A. | `RESOLVED_FOR_PH1_PLAN`; runtime/toolchain `NOT-RUN` | D1-A chặn F05 acceptance nếu chưa có endpoint/transfer evidence; D1-B mở khi có format-processing work. |
| `HA-005` | T016 / P03 — D2 | C | Project Reviewer/current development server operator; later Operations owner when named | Xác nhận Ubuntu development host, native PostgreSQL, một Vault, Windows client path và secret owner; trước PH1 acceptance xác nhận Gateway endpoint và native accounts. Không yêu cầu hai location cho PH1. | `RESOLVED_FOR_PH1_ENVIRONMENT`; host, PostgreSQL, one Vault and static route evidenced; app endpoint/accounts remain `NOT-RUN` | Phân biệt server phát triển với accepted deployment; không suy diễn runtime PASS từ việc cấp máy. |
| `HA-006` | T016 / P03 — D3 | C/D | Boss as reported Product Decision Authority; current Project Reviewer assigned the direct Security/Verification review | PH1 scope and conditional recovery/storage deferral were confirmed on 2026-09-24; record the reviewer's competence basis, examined material, findings and disposition. | `RESOLVED` for the P06 documentary scope: assignment, introductory competence basis, guided material, findings and disposition are recorded | Reopen when backup, failover, production recovery, operational SLA or another claim requires specialist review; this resolution does not close PG4. |
| `HA-007` | T016 / P03 — D4 | C | Project Reviewer as data custodian and PG4 Gate Authority under reported delegation | Chấp nhận bounded synthetic fixture cho PH1; giữ generator/version, size, SHA-256, provenance và retention/disposal owner; defer large-transfer claims. | `RESOLVED_FOR_PH1_FIXTURE_SCOPE`; bounded fixture provisioning verified | Bounded fixture chỉ hỗ trợ PH1 smoke; không đưa file thật/unlicensed payload vào pilot. |
| `HA-008` | T016 / P03 — D5 | C/D | Principal Product Author + legal/company owner khi cần | Ghim intake trước khi dùng; native PostgreSQL 18.6, Temurin 25.0.4.1+1 và Node.js 24.21.0 cho nội bộ; lockfiles/security review khi F01 tạo source. | `RESOLVED_FOR_INTERNAL_PH1_INTAKE`; current runtime evidence exists, future package/commercial review remains open | D5 chặn đúng dependency chưa được intake; không tự kết luận quyền thương mại hoặc đổi stack. |
| `HA-009` | T022 / P04 | C/B | Project Reviewer/current development server operator | Review máy Ubuntu mới, đường SSH/client, native PostgreSQL, one filesystem Vault/Gateway endpoint, allowed versions, secret/config owner, license, build/test entry points và migration controls; Windows giữ Desktop/Workspace/CAD. | `IN-PROGRESS`; SSH/OS/resource, Vault, native runtime, bootstrap và hai role DB login đã có bằng chứng; app source/build, client IDEA endpoint và Adapter I/O chưa có để chạy, chờ Reviewer disposition cho phạm vi P04 | Ghi riêng P04 `PASS`/`FAIL`/`BLOCKED`/`NOT-RUN`; không đổi Tech baseline hoặc coi một môi trường dev là accepted deployment. |
| `HA-010` | T022 / P05 | C/B | Project Reviewer as data custodian and reviewer; current server operator when needed | Review the two Test Persona profiles, bounded synthetic fixture, server manifest, size/digest, provenance and retention. Native IDEA accounts, Gateway endpoint, Grant/Receipt/private-staging behavior and interruption/retry checks are PH1 execution prerequisites, not P05 preparation results. Multi-GB measurement remains Q03; no second Vault is created. | `COMPLETE / PASS` for P05 preparation; server fixture evidence and Project Reviewer disposition recorded | Do not claim application behavior or independent-human review. |
| `HA-011` | T022 / P06 | C/B | Current Project Reviewer assigned directly to Security/Verification review; recovery/storage reviewer when later scope requires | Review PH1 rollback/local preservation, session/key handling, Grant/Receipt, trust boundaries, abuse cases and reviewer competence. Full backup/restore/failover evidence remains later under D3's no-claim condition. | `PASS`; scope and competence limit are recorded in the final disposition | Runtime tests and independent specialist review remain `NOT-RUN`; reopen the competence decision if a deferred recovery/storage claim enters scope. |
| `HA-012` | T023 / P07 preparation | B | Principal Product Author; reviewer/authority sau đó | Lập inventory hash cho exact reviewed source set và freeze manifest chỉ sau khi P01–P06 có result hợp lệ. | Chưa đủ điều kiện; không được freeze sớm | Chuẩn bị được inventory; chưa hoàn tất T023, không đổi baseline lịch sử. |
| `HA-013` | T024 / P07 preparation | B | Principal Product Author, sau đó reviewer | Chạy documentary checks trên manifest đã freeze và ghi command, baseline, result, evidence; hiện chỉ có thể chuẩn bị command set. | `NOT-RUN`; exact reviewed baseline chưa tồn tại | T024 chỉ hoàn tất khi result gắn với baseline review, không dùng check hiện tại để tự mở PG4. |
| `HA-014` | T025 / P07 preparation | B | Principal Product Author; gate reviewer | Chuẩn bị package với exact proposed successor `IE-INC-PH1-FOUNDATION-CUSTODY-001`, F01–F05/72h, exclusions, blockers, residual risks/owners và prohibited inferences. | Chưa được lập thành package vì P03 và các gate inputs còn thiếu; P01/P02/P04/P05/P06 có result | Có thể chuẩn bị package draft; chưa đánh dấu T025 complete. |
| `HA-015` | T031 / handoff | B | Project Reviewer | Đánh giá toàn bộ CHK001–CHK033; chỉ đánh `[x]` khi reviewer chấp nhận tiêu chí chất lượng; ghi finding bên cạnh item hoặc change record. | `IN-PROGRESS`; CHK016 đã đánh dấu, 32 mục còn lại chưa được chấp nhận | Checklist trở thành requirements-quality evidence; không thay P01–P07 hoặc PG4. |
| `HA-016` | T026 / P07 | D | PG4 Gate Authority | Xem manifest, P01–P06 evidence, PG2/PG3 baselines, blockers, risks và proposed successor; ghi execution state, outcome, authority, date và rationale theo contract. | `NOT-RUN`; outcome `NOT-APPLICABLE` | Có thể ghi một trong bốn outcome hợp lệ; trước đó không có PH1 authorization. |
| `HA-017` | T027 / PH1 transition | D | PG4 Gate Authority + Principal Product Author thực hiện sau authorization | Chỉ tạo PH1 directory nếu T026 có attributable `PASS` hoặc valid `PASS-WITH-ACTIONS`, PG2/PG3 đã duyệt và điều kiện còn hiệu lực. | Bị chặn bởi T026 | Nếu đủ điều kiện mới được tạo increment code-bearing; nếu không, production vẫn unauthorized. |
| `HA-018` | T032 / final handoff | B | Principal Product Author sau khi có T026 | Cập nhật README bằng final status, exact gate record, remaining blockers và authorized next action; giữ nguyên `NOT-RUN` nơi chưa có evidence. | Chưa đến thời điểm cập nhật | Hoàn tất handoff sau gate; không dùng README để thay gate record. |

### 10.1 T011 reviewer checklist

Reviewer đã ghi kết quả 13 mục tại §9.1 và trong
[bằng chứng T011](evidence/P02-T011-GUIDED-REVIEW-20260925.md). Bảng sau giữ vai trò
điều hướng tới từng nguồn đã review:

| Check | Nội dung cần xác nhận | Nguồn |
|---|---|---|
| `P02-R01` | Normal path: login → Logical Document/Generation → Checkout/Reference → Workspace digest → changed Check-in → Review → Approval → Release → historical retrieval → Audit | `canonical-scenario.md` §4; `trace-matrix.md` §2 |
| `P02-R02` | No-change Check-in kết thúc quyền giữ sửa đúng phạm vi, không tạo Generation/Version mới | `canonical-scenario.md` §5 |
| `P02-R03` | RBAC denial và business gate bị từ chối đúng lý do | `canonical-scenario.md` §6; trace rows RBAC |
| `P02-R04` | Stale Generation không overwrite và vẫn giữ local work | `canonical-scenario.md` §6 |
| `P02-R05` | Wrong Workspace hoặc non-owner bị từ chối | `canonical-scenario.md` §6 |
| `P02-R06` | Modified Reference không bị ghi vào tài liệu gốc | `canonical-scenario.md` §6 |
| `P02-R07` | Interrupted transfer giữ candidate và có đường recovery | `canonical-scenario.md` §6; `recovery-and-security-plan.md` §2.1 |
| `P02-R08` | Lost response chỉ retry cùng OperationId và input hợp lệ | `canonical-scenario.md` §6; `test-data-and-verification.md` §4 |
| `P02-R09` | Chặn changed Check-in khi `Under Review`; local edit không đổi Generation đã gửi. Withdraw/Reject rồi mới Check-in và gửi Round mới | `canonical-scenario.md` §6; `ARCH-VIEW-STATE-001`, `ARCH-VIEW-SEQ-003` |
| `P02-R10` | Invalid Release scope bị chặn, không silent cascade | `canonical-scenario.md` §6–§7 |
| `P02-R11` | Historical Controlled Release Package truy xuất đúng digest/baseline | `canonical-scenario.md` §4; `trace-matrix.md` §2 |
| `P02-R12` | Mandatory/deferred/prohibited scope được phân biệt | `canonical-scenario.md` §7 |
| `P02-R13` | Mỗi step/path có trace hợp lý tới REQ, architecture và VVP; unresolved trace giữ `NOT-RUN` | `trace-matrix.md` §2–§3 |

### 10.2 P04–P06 evidence handoff

| Package | Reviewer phải xem | Kết quả được phép ghi |
|---|---|---|
| `P04` Environment | Host/network, allowed OS/runtime/tool versions, secret/config owner, company approval, license, build/test entry points, migration controls, prohibited actions | `PASS`, `FAIL`, `BLOCKED` hoặc `NOT-RUN`; profile không tự chứng minh host đã cấp |
| `P05` Data/verification | Synthetic fixture, identity separation, Artifact size/digest, logical Vault locations versus failure domains, provenance, retention/disposal, normal/denied/stale/interrupted/retry matrix | `PASS`, `FAIL`, `BLOCKED` hoặc `NOT-RUN`; two identities không đồng nghĩa two humans |
| `P06` Recovery/security | Rollback, local Workspace preservation, metadata/Artifact reconciliation, coordinated backup/restore, session/key handling, trust boundaries, abuse cases, reviewer competence | `COMPLETE / PASS` for documentary plan review; runtime checks remain separately `NOT-RUN` |

### 10.3 P04–P06 minimum-evidence matrix for PH1 F01–F05

This matrix separates **readiness to start PH1** from **proof that PH1 works**. It does not
delete or weaken any approved requirement. An application build, IDEA account or running Gateway
cannot be a PG4 prerequisite when F01–F05 are the work that will create them.

| Evidence item | Before PG4: readiness evidence | During PH1: completion evidence | Later scope / limit |
|---|---|---|---|
| Ubuntu build and deployment path | P04 host/tool inventory, source/build plan, external configuration and owner | F01 reproducible native build, exact source commit and artifact hash | Accepted-deployment qualification remains separate |
| Ubuntu host and Windows access route | P04 host/SSH/network inventory, Vault mount and permitted tool intake | F01/F05 application connectivity and endpoint checks | No production deployment inference |
| PostgreSQL and migration | P04 installed instance, distinct role logins/privileges; F02 migration plan | F02 migrations and application connection tests | No production HA inference |
| Gateway/Vault endpoint | D0 approved PH1 design slice; D1-A proposed adapter/runtime/owner and intake plan; P04 one Vault directory | F05 exact runtime/license, running endpoint, private staging and receipt tests | One endpoint does not prove multi-location |
| Direct Client→Gateway path | Approved F05 control/data-plane design and planned network route | F05 prove bytes bypass business Server under scoped Grant and Receipt | Multi-location routing/failover later |
| Native IDEA accounts | F03 account/session design and test-persona plan | F03 create and test two IDEA accounts | Two accounts do not mean independent humans |
| Deterministic fixture | P05 1 KiB/64 MiB files, generator/version, SHA-256, provenance and disposal owner; D4 scope decision | F05 transfer and digest checks using the fixtures | Multi-GB, throughput and concurrency later |
| Grant/Receipt/session security | P06 reviewed threat/verification plan and D3 scope decision | F03/F05 execute matching positive and negative tests | No full security assurance inference |
| Transaction and Audit seam | P06 review plan and F04 design | F04 transaction/Audit behavior tests | Full Check-in/Review/Release later |
| Two Vault locations | D0 states exactly what is deferred | None for F01–F05 | W06/MS3 and VVP-017 |
| Multi-location recovery/failover | D0 explicitly defers or requires it with rationale | None for F01–F05 if deferred | W06/MS3 and VVP-017 |
| Multi-GB fixture and resource limits | D4 separates bounded smoke evidence from performance qualification | No multi-GB claim from F05 fixture | W03/W05, QRS-011/QRS-013 |
| Format Worker and CAD/Office processing | D1-B records selected boundary, exact runtime/toolchain `NOT-RUN` and reopen trigger | No format job in F01–F05 | First format-processing work package, VVP-008 |
| Production backup/restore and RTO/RPO | P06 explicitly excludes production recovery claims; authority decides any exception | No production recovery claim from PH1 | Later operations/Technical Pilot, VVP-013/014 |
| P04/P05/P06 result records | T022 records separate results and evidence identities | Runtime checks remain scoped to F01–F05 | Documentary PASS is not runtime PASS |

### 10.4 T031 checklist evidence map

| Checklist range | Evidence đang có | Reviewer action |
|---|---|---|
| CHK001–CHK005 | `baseline-manifest.md`, T006 package, D0 | Xác nhận identity/authority và ghi từng item; không suy ra approval từ hash |
| CHK006–CHK010 | `canonical-scenario.md`, `trace-matrix.md`, PH0 spec/plan | Kiểm tra scenario, trace và boundary PH0/PH1/Core v0 |
| CHK011–CHK015 | Readiness register §5, decision contract, D0–D5 | Xác nhận owner, due condition, closure evidence, gate effect và reopen trigger |
| CHK016–CHK021 | `environment-profile.md`, `test-data-and-verification.md`, `recovery-and-security-plan.md` | Xác nhận đủ môi trường, dữ liệu, recovery/security và reviewer competence |
| CHK022–CHK024 | D5, external-source intake, Constitution internal-first/commercial boundary | Xác nhận license/provenance và không suy diễn commercial readiness |
| CHK025–CHK033 | Contracts, quickstart, PG4 contract, tasks and this register | Xác nhận measurement, outcome semantics và exact successor authorization |

#### 10.4.1 Item-level handoff map

The reviewer can use this map without searching the task list. Checklist markers remain unchecked.

| Checklist item | Review surface | Human action |
|---|---|---|
| `CHK001` | T006 / approved predecessor block | Confirm commit, versions, hashes and approval record. |
| `CHK002` | T006 | Confirm hash is identity evidence, not approval. |
| `CHK003` | T006 / baseline-manifest §2 | Confirm successor delta is separate and `NOT-RUN`. |
| `CHK004` | T006 / baseline-manifest discrepancies | Confirm conflict-resolution rule. |
| `CHK005` | T006 + D0 | Confirm multi-location successor needs its own authority decision. |
| `CHK006` | T011 R01–R12 | Walk the canonical scenario and record each result. |
| `CHK007` | T011 R13 | Confirm every path traces to REQ, architecture and VVP. |
| `CHK008` | T011 R12 | Confirm mandatory/deferred/prohibited are separate. |
| `CHK009` | T011 R12 + proposed PH1 boundary | Confirm deferred scope is preserved, not deleted. |
| `CHK010` | T011 R12 + PH1 lock | Confirm PH0, PH1, Technical Pilot and Core v0 boundaries. |
| `CHK011` | T016 D0–D5 forms | Confirm owner, due condition, evidence, effect and reopen trigger. |
| `CHK012` | T016 D0–D5 forms | Confirm recommendation is not authority disposition. |
| `CHK013` | T016 D2/D4 + T022 | Confirm environment/data dependencies are owned and explicit. |
| `CHK014` | T016 + T022 + PG4 | Confirm `BLOCKED`/`NOT-RUN`/defer is explicit. |
| `CHK015` | T016 D0–D5 | Confirm every deferred item has a reopen trigger. |
| `CHK016` | P04 / HA-009 | Review versions, licenses, config/secret owner and allowed commands. |
| `CHK017` | P05 / D4 / HA-010 | Review synthetic classification, identity separation, size/digest and provenance. |
| `CHK018` | D0/D2 + P05 | Distinguish logical locations from independent failure domains. |
| `CHK019` | P05/P06 | Confirm normal, denied, stale, interrupted, retry and recovery classes. |
| `CHK020` | P06 / HA-011 | Review app/schema/metadata/Artifact/Workspace recovery coverage. |
| `CHK021` | D3/P06 | Confirm trust boundaries, abuse cases, competence and missing-review effect. |
| `CHK022` | D5 | Confirm intake covers source, package, asset, model, font, dataset and service. |
| `CHK023` | D5 | Confirm exact source/version/license intake before inclusion. |
| `CHK024` | D5 + PG4 prohibited inferences | Confirm internal-first scope and separate Commercial Readiness Gate. |
| `CHK025` | P01–P07 evidence index | Confirm owner, exact source, executed result and evidence link per package. |
| `CHK026` | PG4 contract | Confirm PASS authorizes only the named PH1 successor. |
| `CHK027` | PG4 contract | Confirm missing authority/environment/evidence/review prevents PASS. |
| `CHK028` | PG4 contract | Confirm no Core v0, production, rollout, SLA or commercial inference. |
| `CHK029` | T011/P04/P05/P06 | Confirm measurable checks do not invent later thresholds. |
| `CHK030` | PG4 contract / T027 | Confirm no implementation before attributable gate result. |
| `CHK031` | PG4 contract | Confirm execution state, outcome and check results stay separate. |
| `CHK032` | PG4 contract | Confirm conditional-action fields and no waived mandatory input. |
| `CHK033` | PG4 contract / proposed PH1 boundary | Confirm exact approved PG2/PG3 baseline and named successor limits. |

### 10.5 Contract-over-gating review

The current PH0 contract requires attributable P04, P05 and P06 results before P07/PG4. That
requirement is retained. The contract does **not** automatically require a full multi-location,
multi-GB, Format Worker or production backup qualification when the proposed PH1 excludes those
capabilities; the authority must record the scope treatment in D0–D5/T016 and PG4.

If a reviewer or authority interprets the current contract as requiring those later capabilities
to be fully qualified before the F01–F05 gate, classify it as:

`CONTRACT OVER-GATE — controlled PH0 contract change required before deferral.`

Do not amend the contract or silently move evidence between milestones in this author-prepared run.

### 10.6 Authority boundary for the current project user

Theo xác nhận của người dùng hiện tại, người dùng giữ hai vai trò trong increment này:

- **Project Reviewer** cho P01/P02/P03 và checklist reviewer-owned;
- **PG4 Gate Authority** cho quyết định readiness của PH1.

Các vai trò này là thông tin trách nhiệm đã được người dùng khai báo; kết quả review và gate vẫn
phải có ngày, baseline, evidence và disposition riêng. Người dùng không tự được suy ra là
Product Decision Authority, QLHT/Operations, Security reviewer, Recovery/Storage reviewer,
Verification reviewer, data custodian hoặc legal/company owner nếu chưa có authority tương ứng.

Product Decision Authority vẫn là sếp của người dùng. Khi người dùng báo “sếp đã duyệt”, người
ghi hồ sơ phải nhắc lại phạm vi, baseline/hash và ngày để người dùng xác nhận trước khi ghi nhận
đó là PDA approval evidence. Đây là quy tắc ghi nhận authority, không phải suy diễn approval từ
chat history.

Việc một người có thể giữ nhiều vai trò không tự tạo independence; phạm vi và competence phải
được ghi trong evidence của P04–P06 khi cần.

## 11. Critical path to PG4

Đây là **điều kiện phải đủ trước PG4**, không phải thứ tự thời gian đã xảy ra:

- T006/P01 và T011/P02 đã có kết quả; T016/P03 còn phải được review.
- T022 đã ghi riêng kết quả P04, P05 và P06. Nhánh này đã hoàn thành trước T011/T016;
  không ghi lại như một bước tuần tự sau chúng.
- Khi các nguồn bắt buộc đã rõ: T023 ghim manifest → T024 chạy kiểm tra → T025 lập gói;
  T031 hoàn tất review checklist trên cùng baseline.
- T026 ghi quyết định PG4. T027 chỉ mở PH1 nếu `PASS` hoặc `PASS-WITH-ACTIONS` hợp lệ;
  T032 ghi trạng thái bàn giao dù gate cho phép hay chặn.

Các nhánh có thể chạy song song sau khi prerequisite tương ứng được mở:

- Sau P01/P02 và khi owner đã được chỉ định: D1–D5 có thể được authority/QLHT/data/legal xử lý song song.
- Trong T022: P04 environment, P05 data và P06 recovery/security có thể review song song, nhưng P05/P06 vẫn phụ thuộc evidence D2–D4.
- T031 có thể chuẩn bị checklist song song với T022, nhưng review cuối vẫn phải nhìn cùng baseline và không thay result P01–P06.
- T023–T025 chỉ là chuẩn bị; không dùng chúng để bỏ qua T006/T011/T016/T022.

`PG4` chưa thể bắt đầu chỉ dựa trên P01–P06: P03, T023–T025, T031 và authority prerequisites
vẫn cần hoàn tất. Không có đường tắt từ hồ sơ tác giả sang PH1.

### 11.1 Remaining sequential human path

1. T006/P01 is complete with `PASS` for the manifest hash recorded in §8.1.
2. T011/P02 đã `COMPLETE / PASS` cho đúng scenario và trace hash trong §9.1.
3. Authorities complete T016 using the six forms in §5.1; D3 is satisfied for the current P06 documentary scope, while the other decisions still need their applicable dispositions.
4. P04, P05 and P06 have separate recorded results. Before PG4, reviewers and authorities provide any remaining PH1 minimum evidence; P06 runtime checks remain `NOT-RUN`.
5. Principal Product Author freezes the exact reviewed manifest and runs T023–T025.
6. Project Reviewer completes T031; checklist markers remain reviewer-owned.
7. PG4 Gate Authority completes T026. Only an attributable `PASS` or valid `PASS-WITH-ACTIONS`
   naming the exact PH1 successor can authorize implementation.
8. T027 may create the PH1 Spec Kit directory only after that authorization.

### 11.2 Parallel actions available now

- The Project Reviewer/current server operator can verify the new Ubuntu host, one native PostgreSQL instance, one Gateway/Vault path and Windows access for D2.
- Engineering and the current server operator can identify the minimum D1-A Gateway adapter/runtime/license;
  no Format Worker qualification is needed for the F01–F05 scope unless authority chooses otherwise.
- Security and Verification owners can nominate reviewers and review the Grant/Receipt/session
  boundary without claiming production security or recovery acceptance.
- The data custodian can prepare the bounded synthetic fixture profile for D4.
- The Principal Product Author can inventory native Ubuntu PostgreSQL 18, Temurin 25, Node.js 24
  and future package locks for D5; no install/runtime result is reported before evidence exists.

## 12. Change log

| Version | Date | Change | Evidence |
|---|---|---|---|
| 0.1 | 2026-09-17 | Initial PH0 register; all work packages and checks initialized `NOT-RUN`. | T001 |
| 0.2 | 2026-09-17 | Ghi nhận T001–T005 hoàn tất ở cấp tác giả; P01 vẫn `IN-PROGRESS`, readiness result và reviewer disposition vẫn `NOT-RUN`. | T004–T005; T006 còn mở |
| 0.3 | 2026-09-18 | Hoàn tất phân tích chéo và remediation A1–A6; các readiness result P01–P07 không thay đổi. | T028–T030; [analysis-findings.md](analysis-findings.md) |
| 0.4 | 2026-09-18 | Chuẩn bị hồ sơ T006 với manifest hash, disposition của BL-DISC-001…003 và hành động reviewer; không tự ghi nhận review hoặc PASS. | `P01-BASELINE-001`; T006 vẫn mở |
| 0.5 | 2026-09-18 | Chuẩn bị canonical scenario, trace cụ thể, P03 decision records và hồ sơ P04–P06; không chuyển readiness result khỏi `NOT-RUN`. | T007–T010, T012–T015, T017–T020 |
| 0.6 | 2026-09-18 | Tách baseline lịch sử T006 khỏi baseline gói PH0 hiện tại; bỏ bảng D0–D5 trùng; ghi T021 cross-check và chuẩn bị các handoff review nhưng giữ nguyên `NOT-RUN`/`OPEN`. | T021; [IE-ANALYSIS-PH0-002](analysis-findings-002.md) |
| 0.7 | 2026-09-18 | Thêm một bảng Human Action Board, checklist T011, evidence map T022/T031, authority boundary và critical path tới PG4; không đóng reviewer/authority task và không đổi gate state. | T006, T011, T016, T022–T027, T031–T032 |
| 0.8 | 2026-09-18 | Sửa lại SHA-256 của `test-data-and-verification.md` trong handoff để khớp với file thực tế; không thay đổi nội dung fixture hoặc readiness result. | T022 hash reconciliation |
| 0.9 | 2026-09-18 | Đổi nhãn `Current PH0 package baseline` thành `Analyzed PH0 content baseline` để không nhầm commit nội dung đã phân tích với repository HEAD; không đổi hash, scope, decision hoặc gate state. | Terminology correction; review-assistant run |
| 1.0 | 2026-09-18 | Ghi nhận re-evaluation T006/P02-R13 và cập nhật hash `trace-matrix.md` sau khi thay wildcard Audit bằng `REQ-AUD-001/002`; reviewer/result/gate states vẫn `NOT-RUN`/`OPEN`. | DOC-04 `REQ-AUD-001/002`; T006/T011 review-assistant correction |
| 1.1 | 2026-09-18 | Khóa đề xuất PH1 theo F01–F05/72h; tách rõ approved predecessor và Draft successor delta; thêm biểu mẫu T006/T011, decision-capture D0–D5, ma trận bằng chứng PH1 và map từng CHK001–CHK033. Không ghi thay người review/authority và không đổi gate state. | PH1 authority-package preparation; states remain `NOT-RUN`/`OPEN` |
| 1.2 | 2026-09-19 | Reconcile current successor source versions/hashes and mixed authority evidence; record the confirmed Vault direction as PH1-scoped architecture evidence without closing exact successor approval; make T006 package `READY-FOR-REVIEW` while keeping reviewer result `NOT-RUN`. | `IE-CHG-PDA-APPROVAL-002`; `IE-CHG-VAULT-XFER-001`; current `baseline-manifest.md` |
| 1.3 | 2026-09-19 | Chọn current manifest/hash làm input T006; ghi vai trò Project Reviewer và PG4 Gate Authority của người dùng hiện tại; quy định phải xác nhận lại phạm vi/baseline trước khi ghi nhận PDA approval. Không đổi readiness result, D0–D5 hoặc PG4 state. | User decision Q14 and grilling round 3; P01 remains `IN-PROGRESS`/`NOT-RUN` |
| 1.4 | 2026-09-22 | Reconcile the current Core v0 execution-planning successor, refresh the candidate T006 manifest hash and retain the approved product predecessor separately. No reviewer result, D0–D5 disposition or PG4 decision is inferred. | `IE-CHG-ROADMAP-CV0-001`; T006 review preparation |
| 1.5 | 2026-09-22 | Record the Project Reviewer's explicit `PASS` for T006/P01 against the exact reviewed manifest hash; accept BL-DISC-001…003 and open T011/P02 without approving a successor, D0, PG4 or PH1. | User response `PASS`; `P01-BASELINE-001` |
| 1.6 | 2026-09-23 | Start P04 and record the Project Reviewer's local-development direction: Windows-hosted Backend/Web/Desktop/Workspace, Docker-provided PostgreSQL, one filesystem Vault, non-secret local configuration and a monorepo-first delivery layout. Installed-tool observations are evidence only; missing entitlement, image, Server/network and provisioning evidence remains `OPEN`/`NOT-RUN`. | P04 tracker session; `environment-profile.md@0.2`; user grilling decisions |
| 1.7 | 2026-09-23 | Record user-confirmed Docker Desktop free-use eligibility; separate local development readiness from later Server/network deployment qualification. D5 and P04 remain open for exact image/runtime, Vault and owner evidence. | User Q8–Q9 confirmation; `environment-profile.md@0.3`; `IE-RES-PH0-DEP-20260923-001` |
| 1.8 | 2026-09-23 | Pin PostgreSQL `18.6-trixie` to immutable index/amd64 manifest digests for temporary local development without pulling it. Keep runtime, vulnerability/transitive-license and Temurin evidence open. | User Q10 decision; `environment-profile.md@0.4`; registry manifest inspection |
| 1.9 | 2026-09-23 | Pin portable Temurin `25.0.4.1+1` Windows x64 ZIP, checksum and external tool root without downloading or changing global PATH. Runtime qualification remains `NOT-RUN`. | User Q11 decision; `environment-profile.md@0.5`; official Adoptium release metadata |
| 2.0 | 2026-09-23 | Record the PDA-approved Node.js 24 LTS Web-build family and reconcile the local `v24.16.0` observation. No Web build result, Q-15 result, Product Scope or PG state changes. | `IE-CHG-TECH-NODE24-001`; `environment-profile.md@0.6`; `IE-RES-NODE24-20260923-001` |
| 2.1 | 2026-09-23 | Replace the non-reproducible P01 hash reference with a standalone reviewed manifest, align current planning-source references and retain P01 `PASS` only for its exact reviewed input. No successor approval, D0 or PG4 result is inferred. | `IE-CHG-PH0-CORR-002`; `P01-BASELINE-001-reviewed-manifest.json` |
| 2.2 | 2026-09-23 | Record the current cross-artifact analysis after P01 completion, Node.js 24 and one-Vault Core v0 consistency corrections; preserve prior analyses as history and keep every readiness/gate state unchanged. | T028–T030; [IE-ANALYSIS-PH0-004](analysis-findings-004.md) |
| 2.3 | 2026-09-23 | Record the confirmed local configuration/secret custodian, separate local P04 prerequisites from later company Server allocation in D2/HA-005, and refresh the T022 environment-profile hash. P04 readiness remains `NOT-RUN`; D2 remains `OPEN`. | Project Reviewer confirmation; `environment-profile.md@0.7` |
| 2.4 | 2026-09-23 | Link the prepared PostgreSQL-only local Compose runbook, record its no-secret syntax check and the direct-source license review, and refresh the T022 environment-profile hash. Whole-image qualification, image pull/runtime, Vault provisioning and reviewer result remain `NOT-RUN`. | User-approved documentary P04 approach; `environment-profile.md@0.8`; `IE-RES-PH0-DEP-20260923-001@0.2` |
| 2.5 | 2026-09-23 | Rebaseline P04 to the new Ubuntu Server 26 development host, native PostgreSQL and one server Vault; keep Windows client work separate, retire the temporary Docker route and leave host/runtime evidence `NOT-RUN`. | Project Reviewer confirmed the split and described a new empty server; `environment-profile.md@0.9`; Ubuntu runbook |
| 2.6 | 2026-09-23 | Record authenticated read-only Ubuntu 26.04.1 host and dedicated artifact mount inventory; select the development Vault path without claiming directory, database or runtime readiness. | SSH inventory; Project Reviewer confirmation; `environment-profile.md@1.0` |
| 2.7 | 2026-09-23 | Record supervised Vault directory creation, checksum-verified Ubuntu Java/Node runtime installation, PostgreSQL 18.6 service and Reviewer-run database/role bootstrap; retain P04 readiness `NOT-RUN` pending login, build and integration evidence. | `environment-profile.md@1.1`; [native runtime intake](../../docs/research/2026-09-23-p04-ubuntu-native-runtime-intake.md); [host evidence](evidence/P04-UBUNTU-HOST-20260923.md) |
| 2.8 | 2026-09-24 | Record separate app/migrator TCP login and schema-privilege results, and the observed DHCP address change; keep P04 reviewer result separate from unavailable application integration tests. | `environment-profile.md@1.2`; [runtime evidence](evidence/P04-UBUNTU-RUNTIMES-20260923.md) |
| 2.9 | 2026-09-24 | Correct two stale environment statements, refresh the exact T022 profile hash and align native runtime intake; no readiness or gate result changed. | `environment-profile.md@1.3`; `IE-RES-PH0-UBU-20260923-001@0.3` |
| 3.0 | 2026-09-24 | Record the scoped P04 `PASS` after Project Reviewer-authorized live-host review; mark CHK016 reviewed, retain the DHCP/shared-use condition and keep application, P05/P06 and PG4 outcomes separate. | [P04 review evidence](evidence/P04-ENV-REVIEW-20260924.md); `environment-profile.md@1.4`; [CHK016](checklists/readiness.md) |
| 3.1 | 2026-09-24 | Close the P04 delivery card as `COMPLETED / PASS` in Execution Register revision 10 and reconcile the readiness summary; P04 scope and its documented `NOT-RUN` limitations are unchanged. | P04 review evidence; Execution Register P04 record; `environment-profile.md@1.4` |
| 3.2 | 2026-09-24 | Record the Project Reviewer-selected P05 fixture profile and two Test Persona profiles; keep server provisioning, P05 result, Product Decision Authority's D4 gate disposition and PH1 account/endpoint execution separate. | `test-data-and-verification.md@0.2`; `fixtures/expected-artifact-digests.json`; server generation `NOT-RUN` |
| 3.3 | 2026-09-24 | Record observed P05 server fixture generation, size/hash/ownership verification and manifest; retain final Project Reviewer disposition `NOT-RUN` pending review. | [`P05-SERVER-FIXTURES-20260924`](evidence/P05-SERVER-FIXTURES-20260924.md); `test-data-and-verification.md@0.3` |
| 3.4 | 2026-09-24 | Record Project Reviewer P05 preparation `PASS` and Execution Register closure at revision 12; keep D4 PH1 gate, application checks and PG4 separate. | [`P05-SERVER-FIXTURES-20260924`](evidence/P05-SERVER-FIXTURES-20260924.md); `test-data-and-verification.md@0.4`; [Execution Register](../../planning/idea-technical-pilot-execution-register.json) |
| 3.5 | 2026-09-24 | Record the Project Reviewer's report and confirmation of boss-approved D3 PH1 review scope and direct Security/Verification assignment; align the P06 plan with current recovery/security architecture. Reconcile P06 task state with the active Execution Register while preserving missing competence, review execution and P06/PG4 results. | [D3 decision evidence](evidence/D3-REVIEW-SCOPE-20260924.md); `recovery-and-security-plan.md@0.3`; [Execution Register](../../planning/idea-technical-pilot-execution-register.json) |
| 3.6 | 2026-09-24 | Record the Project Reviewer's narrow Step 1 confirmation of interrupted-Check-in handling and its approved-predecessor/Draft-successor distinction. Keep P06 result and runtime verification `NOT-RUN`. | [P06 guided review Step 1](evidence/P06-GUIDED-REVIEW-STEP1-20260924.md) |
| 3.7 | 2026-09-24 | Record the Project Reviewer's conditional Step 2 acceptance after matching the expired/stale-work treatment to existing controlled diagrams; no new diagram or product decision. Keep P06 result and runtime verification `NOT-RUN`. | [P06 guided review Step 2](evidence/P06-GUIDED-REVIEW-STEP2-20260924.md) |
| 3.8 | 2026-09-24 | Map the two Step 3 database/Vault divergence cases to current controlled state, sequence and data views, verify per-view source/rendition correspondence, and avoid a duplicate diagram. P06 remains `NOT-RUN`. | [P06 guided review Step 3](evidence/P06-GUIDED-REVIEW-STEP3-20260924.md) |
| 3.9 | 2026-09-24 | Record the Project Reviewer's acceptance of the remaining identity, transfer, local-execution, transaction/Audit and coordinated-recovery controls. Set the P06 documentary result to `PASS` while retaining every runtime check as `NOT-RUN`. | [Final guided-review disposition](evidence/P06-GUIDED-REVIEW-DISPOSITION-20260924.md); `recovery-and-security-plan.md@0.4` |
| 4.0 | 2026-09-24 | Close the P06 Delivery Card as `COMPLETED / PASS` at Execution Register revision 18; reconcile P06 and T022 states, exact evidence hashes, actual effort and remaining effort. P02/P03/P07, PG4 and P06 runtime checks remain separate. | [P06 final disposition](evidence/P06-GUIDED-REVIEW-DISPOSITION-20260924.md); [Execution Register](../../planning/idea-technical-pilot-execution-register.json) |
| 4.1 | 2026-09-25 | Separate P07 review-time accounting from the later T026/PG4 decision; correct the T011 preparation hashes, D3 handoff wording and pre-PG4 dependency description. No P02/P03/P07 or PG4 result is inferred. | P07 Kanban@0.8; PG4 gate contract and Tracker boundary check |
| 4.2 | 2026-09-25 | Align the T011 Review-change wording and preparation hashes with the corrected scenario, trace and DOC-05@0.26 view. Keep all 13 reviewer results and P02/P07/PG4 outcomes unfilled pending review. | `IE-CHG-P07-T011-001`; `IE-VEV-P07-T011-001` |
| 4.3 | 2026-09-25 | Record the Project Reviewer's guided acceptance of all 13 T011 checks and close P02 as `COMPLETE / PASS` for the exact scenario and trace hashes. Keep P03, P07, PG4 and runtime verification separate. | [P02/T011 guided-review evidence](evidence/P02-T011-GUIDED-REVIEW-20260925.md); §9.1 |
| 4.4 | 2026-09-25 | Correct the D0 recommendation: F05 needs the direct-transfer slice of the successor, so only multi-location implementation may be deferred. Separate PG4 readiness evidence from the application/runtime proof produced during F01–F05; update stale native-dependency wording. | Appendix A F05; `IE-CHG-VAULT-XFER-001`; §5 and §10.3 |
| 4.5 | 2026-09-25 | Record D0's reported PDA approval of the current Vault-transfer design and the one-endpoint PH1 boundary. Preserve ADR-0009's workflow conflict and bound PG3 gate use to F01–F05. D1/D2/D4/D5, P03/P07 and PG4 remain open. | [`IE-CHG-PDA-APPROVAL-004`](../../docs/product/instances/idea-engineering/registers/CHG-2026-09-25-pg2-pg3-approval.md); §5 |
| 4.6 | 2026-09-25 | Record the user's D1/D2/D4/D5 dispositions, close P03/T016 as `COMPLETE / PASS` for documentary decision capture, and record the static development-host observation. Runtime endpoints, Format Worker qualification, T023–T025, T031 and PG4 remain separate. | [P03/T016 decision evidence](evidence/P03-T016-DECISIONS-20260925.md); [P07 static-IP observation](evidence/P07-UBUNTU-HOST-STATIC-IP-20260925.md); §5 |
