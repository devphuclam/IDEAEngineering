# PH0 Readiness Register

**Increment**: `IE-INC-READY-001` — Technical Pilot Implementation Readiness
**Version / status**: `1.1` / Draft; author preparation through T021 recorded, readiness results remain `NOT-RUN`
**Prepared**: 2026-09-17
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
| Reviewer | Project reviewer; disposition `NOT-RUN` vì chưa có bản ghi review có thể truy nguyên |
| Historical P01 review input | `IE-INC-READY-001-BL-001` at `a2cb58961c9f264152ff7395c9158b78f3cfe224`; this is the immutable input for T006 and is not the current PH0 package baseline |
| Analyzed PH0 content baseline | Source set analyzed at `ad49bbf67a291f542b6464532185f7d701a9f298`; includes the PH0 scenario, environment, data and recovery preparation plus the author-side T021 reconciliation |
| Approved predecessor authority | `IE-CHG-PDA-APPROVAL-001` pins the approved predecessor to `f269a0445737a7efd7f406ee51517149a8967afa` |
| Approved predecessor axes | `FEATURE-001@0.12` — `APPROVED`; normative `DOC-04@0.13` — `APPROVED`; `TECH-001@0.14` — `APPROVED` |
| Draft successor delta | `DOC-04@0.14`, `DOC-05@0.21`, `DOC-06@0.17`, `TECH-001@0.15` and the multi-location Vault successor are later Draft inputs listed with hashes in [baseline-manifest.md](baseline-manifest.md), Section 2 |
| Successor authority state | Approved predecessor exists; exact successor delta disposition `NOT-RUN`. Successor content is not approved by inclusion. |
| Proposed PG4 successor | `IE-INC-PH1-FOUNDATION-CUSTODY-001` — PH1 F01–F05, “Khung hệ thống chạy được”, 72h; proposal only, no feature directory exists |
| Source/change trace | [IE-CHG-PH0-CORR-001](../../docs/product/instances/idea-engineering/registers/CHG-2026-09-17-ph0-readiness-correction.md) |
| Evidence rule | Không ghi `PASS` nếu chưa có bằng chứng chạy trên đúng baseline |
| Retention | `INTERNAL`; giữ cùng increment PH0 |

## 3. Work-package status

| Work package | Mục tiêu ngắn | Task IDs | Owner | Due condition | Gate effect | Task state | Result | Evidence link | Blocker / deviation |
|---|---|---|---|---|---|---|---|---|---|
| `P01` | Ghim baseline đã duyệt và phân biệt successor | T004–T006 | Principal Product Author / project reviewer | Trước P02 | `BLOCKS_PG4` nếu chưa xác định được baseline | `IN-PROGRESS` | `NOT-RUN` | [baseline-manifest.md](baseline-manifest.md); `P01-BASELINE-001` (chưa thực thi) | T004–T005 hoàn tất ở cấp tác giả; T006 cần project reviewer ghi nhận disposition |
| `P02` | Chốt một canonical Technical Pilot scenario | T007–T011 | Principal Product Author / project reviewer | Sau P01 | `BLOCKS_PG4` | `NOT-RUN` | `NOT-RUN` | [canonical-scenario.md](canonical-scenario.md); [trace-matrix.md](trace-matrix.md) | Hồ sơ scenario đã chuẩn bị; P01 review và P02 walkthrough chưa chạy |
| `P03` | Ghi mọi quyết định và dependency còn mở | T012–T016 | Principal Product Author và authority tương ứng | Sau P01–P02 | `BLOCKS_PG4` hoặc `DEFERRED_SCOPE` theo từng dòng | `NOT-RUN` | `NOT-RUN` | Mục 5 dưới đây | Các decision record đã chuẩn bị; chưa có authority disposition |
| `P04` | Mô tả môi trường delivery được phép | T017, T021–T022 | Principal Product Author / QLHT khi cần | Trước P07 | `BLOCKS_PG4` nếu thiếu điều kiện bắt buộc | `NOT-RUN` | `NOT-RUN` | [environment-profile.md](environment-profile.md) | Profile đã chuẩn bị; host/license/secret review chưa chạy |
| `P05` | Chuẩn bị fixture và ma trận verification | T018–T019, T021–T022 | Principal Product Author / reviewer phù hợp | Trước P07 | `BLOCKS_PG4` nếu thiếu dữ liệu hoặc location cần thiết | `NOT-RUN` | `NOT-RUN` | [test-data-and-verification.md](test-data-and-verification.md) | Matrix đã chuẩn bị; fixture/hash/location chưa được provision |
| `P06` | Lập kế hoạch rollback, recovery và security review | T020–T022 | Principal Product Author / specialist reviewer | Trước P07 | `BLOCKS_PG4` nếu thiếu review material | `NOT-RUN` | `NOT-RUN` | [recovery-and-security-plan.md](recovery-and-security-plan.md) | Kế hoạch đã chuẩn bị; specialist review/restore chưa chạy |
| `P07` | Chuẩn bị và ghi quyết định PG4 | T023–T027 | Gate authority | Sau P01–P06 | Quyết định authorization của PH1 | `NOT-RUN` | `NOT-RUN` | `NOT-RUN` | Chưa tổ chức gate |

`Result` ở trên là kết quả readiness, không phải trạng thái hoàn thành task. P01 chỉ chuyển sang
`COMPLETE` sau khi T006 ghi nhận review và disposition; các work package còn lại vẫn ở trạng thái
khởi tạo `NOT-RUN`.

## 4. Open-decision and dependency index

Đây chỉ là mục điều hướng, không phải bản ghi quyết định thứ hai. P03 phải ghi đủ câu hỏi,
lựa chọn, khuyến nghị, due condition, reopen trigger và impact cụ thể theo
[decision-and-evidence-register.md](contracts/decision-and-evidence-register.md). Các bản ghi
`D0`–`D5` duy nhất nằm ở Mục 5; chúng là hồ sơ tác giả chuẩn bị, chưa phải authority disposition.

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
| `D0` | Successor Vault-transfer disposition: `OPEN`; approved predecessor exists; exact successor delta disposition `NOT-RUN`. | Option A: approve exact multi-location successor. Option B: require revision. Option C: keep successor outside PH1 as `DEFERRED_SCOPE` (recommended for F01–F05). | Product Decision Authority | Before P07/PG4; decision ID, date, exact source hashes and authority rationale. | D0 review `BLOCKS_PG4`; Option C affects only PH1 scope and preserves later requirements. | Reopen before W06/multi-location custody or any durability/failover claim. |
| `D1` | Gateway and Format Worker qualification: `OPEN`; split into PH1 Gateway path and later Format Worker path. | D1-A: qualify the minimum single-endpoint Gateway path for F05. D1-B: keep Format Worker boundary selected for Core v0 but defer its runtime/toolchain/format qualification for PH1 (recommended). | Engineering + QLHT/Operations + applicable authority | Before P04/P05/P07 for D1-A: allowed adapter/runtime/license and one endpoint. D1-B reopens at first format-processing work package. | D1-A `BLOCKS_PG4` if missing; D1-B is `DEFERRED_SCOPE` only by authority choice. | Format conversion, preview, extraction, representation generation or licensed CAD/Office processing enters scope. |
| `D2` | PH1 environment and identity allocation: `OPEN`. | Required now: one Windows workstation, one Server host, one PostgreSQL, one Gateway/Vault endpoint, one direct Client→Gateway path and two native IDEA accounts. Defer second location/failure-domain evidence. | QLHT / Operations | Before P04/P05; attributable host, network, account and endpoint allocation evidence. Do not claim allocation from a plan. | Minimum allocation `BLOCKS_PG4` if absent; second location is later scope. | Host, network, identity or storage topology changes; reopen before multi-location work. |
| `D3` | PH1 review competence and timing: `OPEN`. | Require suitable security and verification review for account/session, authorization, Grant, Receipt, custody and Audit. Defer recovery/storage-specialist scope only if authority permits and PH1 makes no backup/failover/production-recovery claim. | Project authority / applicable Quality or Security authority | Before the applicable PG4/P06 review; record reviewer, scope, competence basis and timing. No extra signature or independence rule is invented. | Candidate security/verification review `BLOCKS_PG4` if required evidence is missing; later recovery review may be `DEFERRED_SCOPE`. | Backup, restore, failover, production recovery or assurance-level changes. |
| `D4` | Fixture size and provenance: `OPEN`. | Accept one deterministic bounded synthetic fixture for PH1 (generator/version, size, SHA-256, provenance and disposal owner); defer multi-GB/throughput/concurrency/resource qualification (recommended). | Principal Product Author + data custodian | Before P05; fixture profile and retention/disposal evidence. Human authority must choose bounded or large fixture. | Bounded fixture supports PH1; large-transfer evidence remains later unless authority requires it. | First multi-GB/large-transfer, throughput, concurrency or resource-limit claim. |
| `D5` | External source/dependency/license intake: `OPEN`. | No new external inclusion is identified yet. Freeze the concrete F01–F05 dependency set, then reconcile already approved/internal/platform-provided components separately from new sources requiring exact intake. | Principal Product Author + legal/company owner | Before inclusion and before P07: exact name/version/source/license/use/distribution/approval state for every new source. | No manufactured blocker; an unresolved new source becomes `REFERENCE-ONLY` or `BLOCKED-LEGAL`. | New package, runtime, SDK, converter, asset, source or future commercial distribution model. |

Engineering recommendations above do not close decisions. An authority must record the disposition
and the evidence in a later controlled change/review record.

### 5.1 T016 decision-capture forms

These forms are the human capture surface for T016. They are not decision records until the named
authority fills the choice, date and rationale. The proposed successor under review is fixed to
`IE-INC-PH1-FOUNDATION-CUSTODY-001` / F01–F05 / 72h; no alternative PH1 is introduced here.

#### D0 — Multi-location Vault successor

| Field | Prepared entry / human entry |
|---|---|
| Decision ID | `D0` |
| Exact question | Có phê duyệt successor Vault nhiều location cho baseline đang xem xét không? |
| Recommended option | **C —** giữ successor ngoài PH1 dưới `DEFERRED_SCOPE`; F01–F05 dùng một Gateway/Vault endpoint có kiểm soát. |
| Alternative options | A — phê duyệt đúng successor; B — yêu cầu sửa trước khi phê duyệt. |
| Required authority | Product Decision Authority |
| Decision baseline | Approved predecessor at `f269a044...`; successor delta hashes in `baseline-manifest.md` §2; exact successor delta disposition `NOT-RUN`. |
| Effect on PH1 | Không cần hai location, replication, failover, repair hoặc durability claim. D0 vẫn phải được authority trả lời trước PG4. |
| Reopen trigger | Trước W06/multi-location custody hoặc bất kỳ claim nào về failover/durability. |
| Human choice | `A / B / C: __________` |
| Date | `________________` |
| Rationale | `________________________________________________________________` |

#### D1 — Gateway path and Format Worker

| Field | Prepared entry / human entry |
|---|---|
| Decision ID | `D1` (canonical record; D1-A/D1-B are subquestions, not new authority IDs) |
| Exact question | PH1 cần qualify phần nào của Artifact custody và phần nào được defer? |
| Recommended option | **D1-A:** qualify one allowed Gateway/adapter path for Client→Gateway, scoped Grant, digest, Receipt and private staging. **D1-B:** `DEFERRED_SCOPE` Format Worker runtime/toolchain/format qualification. |
| Alternative options | Require a Gateway revision before PH1; bring Format Worker qualification into PH1; or defer the whole F05 path (requires roadmap/gate impact review). |
| Required authority | Engineering + QLHT/Operations + applicable authority |
| Decision baseline | Current Tech/architecture successor inputs; selected Worker boundary is retained, exact Worker runtime/toolchain remains `NOT-RUN`. |
| Effect on PH1 | D1-A is required before F05. PH1 performs no CAD/Office conversion, preview, extraction or representation generation. |
| Reopen trigger | First work package that executes CAD/Office processing or requires a licensed format tool. |
| Human choice | `D1-A: __________ ; D1-B: __________` |
| Date | `________________` |
| Rationale | `________________________________________________________________` |

#### D2 — Minimum PH1 environment

| Field | Prepared entry / human entry |
|---|---|
| Decision ID | `D2` |
| Exact question | QLHT/Operations có cấp được môi trường tối thiểu cho F01–F05 không? |
| Recommended option | **Required now:** one permitted Windows workstation, one Server host, one PostgreSQL instance, one Gateway/Vault endpoint, one direct Client→Gateway path and two native IDEA accounts (bootstrap/admin test identity and ordinary test actor). **Deferred:** second location and failure-domain evidence. |
| Alternative options | Approve a different permitted allocation; require revision; or block PH1 until allocation exists. |
| Required authority | QLHT / Operations |
| Decision baseline | `environment-profile.md`, `test-data-and-verification.md`; allocation is not assumed from the planning profile. |
| Effect on PH1 | One endpoint is enough for F05. Two Vault locations are not a PH1 prerequisite. |
| Reopen trigger | Host/network/identity/storage topology changes or before multi-location work. |
| Human choice | `________________` |
| Date | `________________` |
| Rationale | `________________________________________________________________` |

#### D3 — Specialist review scope and timing

| Field | Prepared entry / human entry |
|---|---|
| Decision ID | `D3` |
| Exact question | Phạm vi và thời điểm review nào là đủ cho account/session, authorization, Grant, Receipt, custody và Audit trong PH1? |
| Recommended option | Require suitable security and verification review for the PH1 boundary before the applicable PG4/P06 evidence is accepted. Defer recovery/storage-specialist work only if authority permits and PH1 makes no backup, failover or production-recovery claim. |
| Alternative options | Require all recovery/storage review now; require review before merge; or require a narrower review before PH1 acceptance. |
| Required authority | Project authority and applicable Quality/Security authority |
| Decision baseline | Constitution, `recovery-and-security-plan.md`, PH0 P06 contract; no extra signature or independence rule is added. |
| Effect on PH1 | Missing required security/verification evidence keeps the relevant P06/PG4 result `NOT-RUN` or `BLOCKED`. |
| Reopen trigger | Backup, restore, failover, production recovery or assurance-level scope enters the increment. |
| Human choice | `________________` |
| Date | `________________` |
| Rationale | `________________________________________________________________` |

#### D4 — PH1 fixture size and provenance

| Field | Prepared entry / human entry |
|---|---|
| Decision ID | `D4` |
| Exact question | PH1 có được dùng fixture tổng hợp có kích thước giới hạn để kiểm tra custody smoke path không? |
| Recommended option | Accept one deterministic bounded synthetic fixture with generator/version, size, SHA-256, provenance and retention/disposal owner; defer multi-GB, throughput, concurrency and resource-limit qualification. |
| Alternative options | Keep a large fixture mandatory now; or require revision of the fixture profile before PH1. |
| Required authority | Principal Product Author + data custodian; Product Decision Authority for scope effect |
| Decision baseline | `test-data-and-verification.md`, QRS-011/QRS-013 and D4 evidence contract. |
| Effect on PH1 | Bounded fixture proves Grant/digest/Receipt/private staging only; it does not prove large-transfer performance. |
| Reopen trigger | First multi-GB, throughput, concurrency or memory/resource-limit claim. |
| Human choice | `________________` |
| Date | `________________` |
| Rationale | `________________________________________________________________` |

#### D5 — External dependency intake

| Field | Prepared entry / human entry |
|---|---|
| Decision ID | `D5` |
| Exact question | Bộ dependency cụ thể của F01–F05 có thêm source bên ngoài chưa được kiểm soát không? |
| Recommended option | No new external inclusion identified yet. Freeze the concrete dependency set; reconcile already approved/internal/platform-provided items separately, and intake every new source before inclusion. |
| Alternative options | Approve an exact new source after intake; replace it with an internal/platform capability; or keep it `REFERENCE-ONLY`/`BLOCKED-LEGAL`. |
| Required authority | Principal Product Author + legal/company owner where a new source exists |
| Decision baseline | [external-source-intake.md](../../docs/agents/external-source-intake.md) and the exact PH1 dependency manifest. |
| Effect on PH1 | Do not manufacture a blocker before a concrete new source is identified; any unresolved new source blocks its inclusion. |
| Reopen trigger | New package, runtime, SDK, converter, asset, source or future commercial distribution model. |
| Human choice | `________________` |
| Date | `________________` |
| Rationale | `________________________________________________________________` |

| PH1 dependency need | Current category | Intake treatment |
|---|---|---|
| Java/Temurin/Spring/PostgreSQL server path | Existing Tech/architecture baseline; exact installed versions and support state still require P04 evidence | Reconcile against the frozen manifest; do not assume a new source or a new Tech selection. |
| React/TypeScript/Web and WPF/WebView2/.NET Workspace build path | Existing Tech/architecture baseline; exact workstation versions still require P04 evidence | Reconcile against the frozen manifest; no new UI stack decision. |
| One Artifact Gateway/Vault adapter for F05 | Exact adapter/runtime/provider is not yet selected | Intake and license evidence only if the concrete implementation adds a source not already approved. |
| CAD/Office converter or Format Worker | Explicitly excluded from PH1 | No PH1 dependency; D1-B reopens at format-processing work. |
| New package, SDK, source, asset or service not listed above | New external inclusion | Record exact name/version/source/license/use/distribution/approval before inclusion. |

The forms above preserve official `OPEN` states. A recommendation, including D0 Option C or D4
bounded-fixture treatment, is not an authority disposition.

## 6. Readiness-check index

| Check family | Planned checks | Method / baseline | Result | Evidence |
|---|---|---|---|---|
| P01 baseline | `P01-BASELINE-*` | Hash và authority record | `NOT-RUN` | `NOT-RUN` |
| P02 scenario | `P02-SCENARIO-*` | Walkthrough và trace review | `NOT-RUN` | `NOT-RUN` |
| P03 decisions | `P03-DECISION-*` | Register inspection | `NOT-RUN` | `NOT-RUN` |
| P04 environment | `P04-ENV-*` | Profile review | `NOT-RUN` | `NOT-RUN` |
| P05 dataset | `P05-DATA-*` | Fixture/matrix inspection | `NOT-RUN` | `NOT-RUN` |
| P06 recovery/security | `P06-RECOVERY-*`, `P06-SECURITY-*` | Procedure and reviewer-competence review | `NOT-RUN` | `NOT-RUN` |
| P07 gate | `P07-GATE-*` | Attributable authority decision | `NOT-RUN` | `NOT-RUN` |

## 7. T021 author-side cross-check

T021 đã hoàn tất ở cấp tác giả: các hồ sơ P04–P06 được đối chiếu với D0–D5 và mọi điều kiện
chưa có bằng chứng đều được giữ ở `BLOCKED`, `UNKNOWN` hoặc `NOT-RUN`. Việc này không đóng
decision, không tạo reviewer evidence và không chuyển readiness result sang `PASS`.

| Prerequisite | Source | Current evidence state | Decision / gate effect |
|---|---|---|---|
| Host allocation and network path | [environment-profile.md](environment-profile.md), Sections 1–2 | Server host, network path and exact allocation `BLOCKED` / `NOT-RUN` | D2 remains `OPEN`; P04/P05/P06 remain `NOT-RUN`; PG4 blocked if this is required for the selected pilot |
| OS, runtime and tool versions | [environment-profile.md](environment-profile.md), Section 2 | Baseline is a planning profile; installed versions and qualification evidence `NOT-RUN` | D1 remains `OPEN`; no runtime/toolchain is implied for the Format Worker |
| License and external-source intake | [environment-profile.md](environment-profile.md), Section 2; D5 | Exact license/usage evidence `BLOCKED` until intake and company/legal review | D5 remains `OPEN`; no external asset may be included by assumption |
| Test identities | [test-data-and-verification.md](test-data-and-verification.md), Section 2; D2 | Synthetic identity profiles are defined; allocation and access evidence `BLOCKED` / `NOT-RUN` | D2 remains `OPEN`; two profiles do not imply two independent humans |
| Vault locations and failure domain | [test-data-and-verification.md](test-data-and-verification.md), Section 3; D0/D2 | `VAULT-LOC-A/B` are logical candidates; exact topology, isolation and failover `UNKNOWN` / `BLOCKED` | D0 and D2 remain `OPEN`; no multi-location guarantee is claimed |
| Dataset, provenance and retention | [test-data-and-verification.md](test-data-and-verification.md), Sections 1 and 5; D4 | Synthetic fixtures are specified; generation, digest, retention and disposal evidence `NOT-RUN` | D4 remains `OPEN`; P05 remains `NOT-RUN` |
| Secret/configuration ownership | [environment-profile.md](environment-profile.md), Section 3 | Owner and approved handling path still require confirmation; `NOT-RUN` | P04 remains `NOT-RUN`; no secrets are requested or stored in this package |
| Specialist reviewer competence and independence | [recovery-and-security-plan.md](recovery-and-security-plan.md), Section 4; D3 | Reviewer names, scope and competence evidence `BLOCKED` | D3 remains `OPEN`; P06 remains `NOT-RUN` |
| Backup, restore and rollback | [recovery-and-security-plan.md](recovery-and-security-plan.md), Sections 2.4–2.5 | Procedure is prepared; execution and restore evidence `NOT-RUN` | P06 remains `NOT-RUN`; no recoverability claim is made |
| Security review and abuse cases | [recovery-and-security-plan.md](recovery-and-security-plan.md), Section 3 | Threat/control plan is prepared; specialist review and runtime evidence `NOT-RUN` | P06 remains `NOT-RUN`; D3 remains `OPEN` |
| Artifact Gateway / Format Worker qualification | [environment-profile.md](environment-profile.md), Section 2; D1 | Worker boundary is selected for Core v0; exact runtime/toolchain/license qualification `NOT-RUN` | D1 remains `OPEN`; no deployment choice is implied |

**T021 disposition:** `COMPLETE` as an author-side reconciliation only. P04, P05 and P06
readiness results remain `NOT-RUN`; D0–D5 remain `OPEN`; no prerequisite is presented as closed.

## 8. T006 review evidence and human action

| Field | Recorded value |
|---|---|
| Check ID | `P01-BASELINE-001` |
| Exact input baseline | `IE-INC-READY-001-BL-001`; current repository commit `a2cb58961c9f264152ff7395c9158b78f3cfe224` |
| Exact manifest hash | `SHA-256 21F6E196E7786924BF5B9A20C377F9B3BA5E9D6C7AAC7FAC8020EB1001E09B93` |
| Reviewer / date | Project reviewer / `NOT-RUN` — no attributable review record exists in the repository |
| `BL-DISC-001` disposition | Author reconciliation: later attributable approval record governs the exact predecessor; historical status prose is retained. Reviewer confirmation: `NOT-RUN`. |
| `BL-DISC-002` disposition | Approved predecessor exists; successor sources remain separate Draft inputs; exact successor delta disposition `NOT-RUN` and tracked as `D0`. |
| `BL-DISC-003` disposition | Appendix A@0.6 contains the author correction under `IE-CHG-PH0-CORR-001`; reviewer confirmation that the planning discrepancy is acceptable remains `NOT-RUN`. |
| Result | `NOT-RUN` — this is not P01 acceptance and does not approve any successor. |
| Required human action | Project reviewer must inspect the manifest, approval record, Appendix A@0.6 and the three discrepancy dispositions, then record reviewer identity, date, exact manifest hash and `PASS`, `FAIL` or `BLOCKED` with evidence. |
| Gate effect | Until that action is recorded, P01 remains `IN-PROGRESS`, its readiness result remains `NOT-RUN`, and `PG4` cannot be decided. |

### 8.1 T006 compact human decision block

The Project Reviewer completes only the blank fields below. The recommended result is guidance,
not a recorded review result.

| Field | Prepared value / reviewer entry |
|---|---|
| Review ID | `P01-BASELINE-001` |
| Exact baseline | `IE-INC-READY-001-BL-001` at `a2cb58961c9f264152ff7395c9158b78f3cfe224` |
| Manifest hash | `SHA-256 21F6E196E7786924BF5B9A20C377F9B3BA5E9D6C7AAC7FAC8020EB1001E09B93` |
| `BL-DISC-001` disposition | Author reconciliation: later attributable approval record governs the exact predecessor; historical wording remains. Reviewer confirmation: `________________` |
| `BL-DISC-002` disposition | Approved predecessor exists; exact successor delta disposition `NOT-RUN`. Reviewer confirmation: `________________` |
| `BL-DISC-003` disposition | Appendix A@0.6 correction under `IE-CHG-PH0-CORR-001`; reviewer confirmation: `________________` |
| Known evidence limitation | No separate signed minutes or digital-signature artifact exists; PH0 governance does not require one. Reviewer decides whether the existing attributable approval record is sufficient. |
| Reviewer identity | `________________` |
| Review date | `________________` |
| Allowed result | `PASS` / `FAIL` / `BLOCKED` |
| Rationale | `________________________________________________________________` |

Do not add a signature requirement. A reviewer result does not approve the successor delta or
authorize PH1; it only records T006/P01 evidence.

## 9. Review handoff preparation

Các mục dưới đây đã được chuẩn bị để reviewer dùng khi thực hiện T011, T016, T022 và T031.
Chúng không thay thế review hoặc runtime evidence.

| Review task | Prepared source identity | Reviewer state | Required action |
|---|---|---|---|
| T011 — scenario walkthrough | `canonical-scenario.md` SHA-256 `1704BBA06BA13CD31310D624E6705450FAC99F0C87D6751D4EE803AF22E22134`; `trace-matrix.md` SHA-256 `408B61494A10D9CB53FF763F3D38DD77FE15791347CEFD3780597DF0161D3B00` | `NOT-RUN` | Project reviewer walks the normal, no-change and negative paths and records attributable disposition |
| T016 — decision review | Mục 5, `D0`–`D5`, analyzed package baseline `ad49bbf...` | `NOT-RUN` | Authority records one disposition per decision with ID, date, baseline, evidence and reopen trigger |
| T022 — P04/P05/P06 result review | `environment-profile.md` SHA-256 `D0EFD96FA8D857398E199FCC72F4961C9F2149D00DBA803E3C75D149E0779A07`; `test-data-and-verification.md` SHA-256 `5EF6F8D9F31FA62FEFE5E4C8BFDB39058E50309F71542ED460AD54756E39E07C`; `recovery-and-security-plan.md` SHA-256 `F9950E46CB39C49EC8D3E584D79B330450799927ED0394EBAE9A4C2D0B87CBA8` | `NOT-RUN` | Reviewer records separate P04, P05 and P06 outcomes; missing prerequisites stay `BLOCKED`/`NOT-RUN` |
| T031 — checklist review | [readiness checklist](checklists/readiness.md), all unchecked items; analyzed package baseline `ad49bbf...` | `NOT-RUN` | Project reviewer evaluates unchecked items; checklist approval is quality evidence only and cannot authorize PG4 |

### Review-assistant re-evaluation notes (not controlled results)

- **T006:** No applicable PH0 governance rule or baseline-manifest contract requires signed minutes,
  wet/digital signature or a separately signed approval artifact. `IE-CHG-PDA-APPROVAL-001`
  contains the decision date, authority, reporter, exact approved commit, source versions, hashes
  and three recorded dispositions. The absent signed artifact is retained as an evidence limitation,
  not an automatic blocker. Recommended Project Reviewer disposition: `PASS`, subject to accepting
  the recorded decision evidence. T006 remains `NOT-RUN` until the Project Reviewer records it.
- **P02-R13:** The P02 Audit trace now uses exact `REQ-AUD-001/002`; the previous wildcard ambiguity
  is resolved. Recommended reviewer disposition: `PASS`, subject to the walkthrough and trace review.
  T011 remains `NOT-RUN` until the Project Reviewer records it.

### 9.1 T011 compact human decision block

The Project Reviewer records one result for every row. No result is pre-filled.

| Check | Review point | Result (`PASS`/`FAIL`/`BLOCKED`) | Finding / note |
|---|---|---|---|
| `P02-R01` | Normal path: login → Logical Document/Generation → Checkout/Reference → Workspace digest → changed Check-in → Review → Approval → Release → historical retrieval → Audit | `________` | `________________` |
| `P02-R02` | No-change Check-in ends the in-scope hold and creates no new Generation/Version | `________` | `________________` |
| `P02-R03` | RBAC denial and business gate refusal identify the reason | `________` | `________________` |
| `P02-R04` | Stale Generation does not overwrite and local work remains | `________` | `________________` |
| `P02-R05` | Wrong Workspace or non-owner is refused | `________` | `________________` |
| `P02-R06` | Modified Reference cannot publish to its original Logical Document | `________` | `________________` |
| `P02-R07` | Interrupted transfer preserves the candidate and provides recovery path | `________` | `________________` |
| `P02-R08` | Lost response retries only the same `OperationId` and identical input | `________` | `________________` |
| `P02-R09` | Review is invalidated when exact Generation or scope changes | `________` | `________________` |
| `P02-R10` | Invalid Release scope is refused without silent cascade | `________` | `________________` |
| `P02-R11` | Historical Controlled Release Package is retrieved by exact digest/baseline | `________` | `________________` |
| `P02-R12` | Mandatory, deferred and prohibited scope are distinct | `________` | `________________` |
| `P02-R13` | Every path traces to REQ, architecture and VVP; Audit uses exact `REQ-AUD-001` and `REQ-AUD-002` | `________` | `________________` |

| T011 capture field | Reviewer entry |
|---|---|
| Scenario SHA-256 | `1704BBA06BA13CD31310D624E6705450FAC99F0C87D6751D4EE803AF22E22134` |
| Trace-matrix SHA-256 | `408B61494A10D9CB53FF763F3D38DD77FE15791347CEFD3780597DF0161D3B00` |
| Reviewer identity | `________________` |
| Review date | `________________` |
| Overall T011 disposition | `PASS` / `FAIL` / `BLOCKED` |
| Overall rationale | `________________________________________________________________` |

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
| `HA-001` | T006 / P01 | B | Project Reviewer | Xem [baseline-manifest.md](baseline-manifest.md), approval record, Appendix A@0.6, manifest hash và BL-DISC-001…003; ghi reviewer, ngày, hash và `PASS`/`FAIL`/`BLOCKED`. | `NOT-RUN`; chưa có reviewer record | Mở P01; P01 chỉ hoàn tất khi có disposition truy nguyên; cho phép bắt đầu review P02, không tự đóng D0. |
| `HA-002` | T011 / P02 | B | Project Reviewer; chỉ thêm vai trò khác nếu governance/authority chỉ định | Walkthrough 13 mục ở Mục 10.1 trên `canonical-scenario.md` và `trace-matrix.md`; xác nhận hash và ghi result/evidence. | `NOT-RUN`; chờ P01 | Đóng hoặc chặn P02; không tạo requirement mới. |
| `HA-003` | T016 / P03 — D0 | D | Product Decision Authority | Chọn D0 Option A/B/C trong Mục 5.1; PH1 F01–F05 khuyến nghị Option C, nhưng không tự ghi disposition. | `OPEN` / `NOT-RUN` | Authority ghi `RESOLVED` hoặc `DEFERRED_SCOPE` với baseline, ngày và rationale. |
| `HA-004` | T016 / P03 — D1 | C/D | Engineering + QLHT/Operations + authority phù hợp | Ghi riêng D1-A Gateway path cần cho F05 và D1-B Format Worker deferred; xác nhận adapter/runtime/license/endpoint chỉ cho D1-A. | `OPEN`; runtime/toolchain `UNKNOWN`/`NOT-RUN` | D1-A thiếu evidence thì chặn F05; D1-B chỉ mở khi có format-processing work. |
| `HA-005` | T016 / P03 — D2 | C | QLHT / Operations | Xác nhận một workstation Windows, một Server, một PostgreSQL, một Gateway/Vault endpoint, direct network path và hai native accounts; không yêu cầu hai location cho PH1. | `OPEN`; allocation `BLOCKED`/`NOT-RUN` | Cho phép P04/P05/P06 chạy đúng môi trường hoặc ghi blocker; không suy diễn allocation từ kế hoạch. |
| `HA-006` | T016 / P03 — D3 | C/D | Project authority; Security/Quality authority cho phạm vi chuyên môn | Chỉ định security và verification review cho PH1; recovery/storage review chỉ defer khi authority cho phép và không có claim backup/failover/production recovery. | `OPEN`; reviewer competence `BLOCKED` | Mở đường cho P06/T031 hoặc giữ `BLOCKED`; không tự thêm yêu cầu chữ ký/independence ngoài governance. |
| `HA-007` | T016 / P03 — D4 | C | Principal Product Author + data custodian; authority quyết định scope | Chọn bounded synthetic fixture hoặc large fixture; bounded fixture phải có generator/version, size, SHA-256, provenance và retention/disposal owner. | `OPEN`; fixture provisioning `NOT-RUN` | Bounded fixture chỉ hỗ trợ PH1 smoke; không đưa file thật/unlicensed payload vào pilot. |
| `HA-008` | T016 / P03 — D5 | C/D | Principal Product Author + legal/company owner khi có source mới | Freeze dependency set; không có external inclusion mới được ghi nhận cho đến hiện tại. Intake từng source/version/license/use/distribution nếu phát sinh. | `OPEN`; không manufacture blocker | D5 chỉ chặn source chưa được intake; không tự kết luận quyền thương mại. |
| `HA-009` | T022 / P04 | C/B | QLHT/Operations và reviewer được chỉ định | Review tối thiểu PH1: host, network, PostgreSQL, Gateway endpoint, allowed versions, secret/config owner, license, build/test entry points và migration controls. | `NOT-RUN`; thiếu host/license/owner evidence | Ghi riêng P04 `PASS`/`FAIL`/`BLOCKED`/`NOT-RUN`; không làm thay đổi Tech baseline. |
| `HA-010` | T022 / P05 | C/B | Verification reviewer + data custodian + QLHT/Operations khi cần | Review hai native accounts, bounded fixture, digest/provenance/retention, one endpoint và F05 Grant/Receipt/private-staging checks; interruption/retry chỉ đưa vào nếu F05 test profile được duyệt yêu cầu. Multi-location/large fixture là later hoặc authority-decision item. | `NOT-RUN`; fixture/allocation chưa provision | Ghi riêng P05 result; không gọi hai identity là hai người độc lập. |
| `HA-011` | T022 / P06 | C/B | Security reviewer + verification reviewer; recovery/storage reviewer khi authority yêu cầu | Review PH1 rollback/local preservation, session/key handling, Grant/Receipt, trust boundaries, abuse cases and reviewer competence. Full backup/restore/failover evidence remains later unless the PH0 contract is explicitly kept mandatory. | `NOT-RUN`; specialist review chưa chạy | Ghi riêng P06 result; missing required competence giữ `BLOCKED`. |
| `HA-012` | T023 / P07 preparation | B | Principal Product Author; reviewer/authority sau đó | Lập inventory hash cho exact reviewed source set và freeze manifest chỉ sau khi P01–P06 có result hợp lệ. | Chưa đủ điều kiện; không được freeze sớm | Chuẩn bị được inventory; chưa hoàn tất T023, không đổi baseline lịch sử. |
| `HA-013` | T024 / P07 preparation | B | Principal Product Author, sau đó reviewer | Chạy documentary checks trên manifest đã freeze và ghi command, baseline, result, evidence; hiện chỉ có thể chuẩn bị command set. | `NOT-RUN`; exact reviewed baseline chưa tồn tại | T024 chỉ hoàn tất khi result gắn với baseline review, không dùng check hiện tại để tự mở PG4. |
| `HA-014` | T025 / P07 preparation | B | Principal Product Author; gate reviewer | Chuẩn bị package với exact proposed successor `IE-INC-PH1-FOUNDATION-CUSTODY-001`, F01–F05/72h, exclusions, blockers, residual risks/owners và prohibited inferences. | Chưa được lập thành package vì P01–P06 chưa có result | Có thể chuẩn bị nội dung; không đánh dấu T025 complete. |
| `HA-015` | T031 / handoff | B | Project Reviewer | Đánh giá toàn bộ CHK001–CHK033; chỉ đánh `[x]` khi reviewer chấp nhận tiêu chí chất lượng; ghi finding bên cạnh item hoặc change record. | `NOT-RUN`; toàn bộ marker còn unchecked | Checklist trở thành requirements-quality evidence; không thay P01–P07 hoặc PG4. |
| `HA-016` | T026 / P07 | D | PG4 Gate Authority | Xem manifest, P01–P06 evidence, PG2/PG3 baselines, blockers, risks và proposed successor; ghi execution state, outcome, authority, date và rationale theo contract. | `NOT-RUN`; outcome `NOT-APPLICABLE` | Có thể ghi một trong bốn outcome hợp lệ; trước đó không có PH1 authorization. |
| `HA-017` | T027 / PH1 transition | D | PG4 Gate Authority + Principal Product Author thực hiện sau authorization | Chỉ tạo PH1 directory nếu T026 có attributable `PASS` hoặc valid `PASS-WITH-ACTIONS`, PG2/PG3 đã duyệt và điều kiện còn hiệu lực. | Bị chặn bởi T026 | Nếu đủ điều kiện mới được tạo increment code-bearing; nếu không, production vẫn unauthorized. |
| `HA-018` | T032 / final handoff | B | Principal Product Author sau khi có T026 | Cập nhật README bằng final status, exact gate record, remaining blockers và authorized next action; giữ nguyên `NOT-RUN` nơi chưa có evidence. | Chưa đến thời điểm cập nhật | Hoàn tất handoff sau gate; không dùng README để thay gate record. |

### 10.1 T011 reviewer checklist

Reviewer phải ghi kết quả cho từng mục, không chỉ ghi một nhận xét chung:

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
| `P02-R09` | Review bị invalidated khi exact Generation hoặc scope thay đổi | `canonical-scenario.md` §6 |
| `P02-R10` | Invalid Release scope bị chặn, không silent cascade | `canonical-scenario.md` §6–§7 |
| `P02-R11` | Historical Controlled Release Package truy xuất đúng digest/baseline | `canonical-scenario.md` §4; `trace-matrix.md` §2 |
| `P02-R12` | Mandatory/deferred/prohibited scope được phân biệt | `canonical-scenario.md` §7 |
| `P02-R13` | Mỗi step/path có trace hợp lý tới REQ, architecture và VVP; unresolved trace giữ `NOT-RUN` | `trace-matrix.md` §2–§3 |

### 10.2 P04–P06 evidence handoff

| Package | Reviewer phải xem | Kết quả được phép ghi |
|---|---|---|
| `P04` Environment | Host/network, allowed OS/runtime/tool versions, secret/config owner, company approval, license, build/test entry points, migration controls, prohibited actions | `PASS`, `FAIL`, `BLOCKED` hoặc `NOT-RUN`; profile không tự chứng minh host đã cấp |
| `P05` Data/verification | Synthetic fixture, identity separation, Artifact size/digest, logical Vault locations versus failure domains, provenance, retention/disposal, normal/denied/stale/interrupted/retry matrix | `PASS`, `FAIL`, `BLOCKED` hoặc `NOT-RUN`; two identities không đồng nghĩa two humans |
| `P06` Recovery/security | Rollback, local Workspace preservation, metadata/Artifact reconciliation, coordinated backup/restore, session/key handling, trust boundaries, abuse cases, reviewer competence | `PASS`, `FAIL`, `BLOCKED` hoặc `NOT-RUN`; backup plan không phải restore evidence |

### 10.3 P04–P06 minimum-evidence matrix for PH1 F01–F05

The matrix narrows the review surface; it does not delete or weaken any approved requirement.
`CONTRACT-REQUIRES-NOW` means the PH0 contract still requires a P04/P05/P06 result before PG4;
it does not mean the later capability must be fully qualified in PH1.

| Evidence item | Classification | Required for PH1 PG4 authorization | Later Technical Pilot evidence | Gate handling / note |
|---|---|---|---|---|
| One permitted Server host | `PH1-REQUIRED` | Yes | — | D2/P04 allocation evidence; no host is assumed from the profile. |
| One PostgreSQL instance and migration path | `PH1-REQUIRED` | Yes | — | F02/P04 evidence; production HA is not implied. |
| One allowed Gateway/Vault endpoint | `PH1-REQUIRED` | Yes | — | D1-A/D2/P04; exact adapter/runtime/license must be recorded. |
| Direct Client→Gateway network path | `PH1-REQUIRED` | Yes | Multi-location routing and failover | F05 must not proxy complete bytes through business Server. |
| Two native IDEA accounts | `PH1-REQUIRED` | Yes | More identities/roles and independent approver | D2; two accounts do not prove two independent humans. |
| Bounded deterministic synthetic fixture | `PH1-REQUIRED` | Yes | Multi-GB corpus and scale profile | D4; record generator/version, size, SHA-256, provenance and disposal. |
| Grant/Receipt/session security review | `PH1-REQUIRED` | Yes | Worker sandbox and broader security suite | D3/P06; review the actual PH1 trust boundary. |
| Transaction + Audit seam review | `PH1-REQUIRED` | Yes | Full Check-in/Review/Release atomic outcomes | F04/P06; Audit does not decide business success. |
| Two Vault locations | `LATER-MILESTONE` | No for F01–F05 | W06/MS3 and VVP-017 | D0/D2 decision is required now; evidence is later. |
| Multi-location recovery/failover review | `LATER-MILESTONE` | No for F01–F05 | W06/MS3, VVP-017 | Defer only if authority accepts D0 Option C. |
| Multi-GB fixture and resource limits | `LATER-MILESTONE` | No for bounded smoke path | W03/W05, QRS-011/QRS-013 | Do not claim performance from the bounded fixture. |
| Format Worker runtime/toolchain and CAD/Office processing | `LATER-MILESTONE` | No format job in PH1 | First format-processing work package, VVP-008 | D1-B remains `DEFERRED_SCOPE` candidate; Worker boundary remains selected. |
| Production backup/restore and RTO/RPO | `LATER-MILESTONE` | No production claim in PH1 | Technical Pilot hardening/operations, VVP-013/014 | If authority insists this is mandatory before PG4, record a contract over-gate; do not silently defer. |
| P04, P05 and P06 result records themselves | `CONTRACT-REQUIRES-NOW` | Yes, under current PH0 tasks/PG4 path | — | T022 must still record separate results; a later-scope item may be `BLOCKED`, `NOT-RUN` or authority-deferred according to the contract. |

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

### 10.4 Authority boundary for the current project user

Repository evidence chưa gán người dùng hiện tại vào một authority cụ thể. Người dùng có thể
thực hiện công việc **Principal Product Author** và có thể là người điều phối hồ sơ, nhưng không
được tự suy ra quyền làm Project Reviewer, Product Decision Authority, QLHT/Operations, Security
reviewer, Recovery/Storage reviewer, Verification reviewer, data custodian, legal/company owner
hoặc PG4 Gate Authority. Việc một người có thể giữ nhiều vai trò chỉ có hiệu lực khi authority
và chính sách công ty cho phép; independence không được suy diễn từ việc có hai tài khoản.

## 11. Critical path to PG4

Đường phụ thuộc hiện tại, theo task và gate contract, là:

`T006 / P01 reviewer disposition`
→ `T011 / P02 scenario review`
→ `T016 / P03 authority dispositions D0–D5`
→ `T022 / P04, P05, P06 evidence results`
→ `T023 / freeze exact reviewed manifest`
→ `T024 / execute documentary checks on that manifest`
→ `T025 / assemble PG4 review package`
→ `T031 / reviewer checklist review`
→ `T026 / PG4 Gate Authority decision`
→ `T027 / PH1 only if valid PASS or PASS-WITH-ACTIONS`
→ `T032 / final handoff status`.

Các nhánh có thể chạy song song sau khi prerequisite tương ứng được mở:

- Sau P01/P02 và khi owner đã được chỉ định: D1–D5 có thể được authority/QLHT/data/legal xử lý song song.
- Trong T022: P04 environment, P05 data và P06 recovery/security có thể review song song, nhưng P05/P06 vẫn phụ thuộc evidence D2–D4.
- T031 có thể chuẩn bị checklist song song với T022, nhưng review cuối vẫn phải nhìn cùng baseline và không thay result P01–P06.
- T023–T025 chỉ là chuẩn bị; không nhảy qua T006/T011/T016/T022.

`PG4` hiện không thể bắt đầu hợp lệ vì P01–P06 chưa có result attributable. Không có đường tắt
từ hồ sơ tác giả sang PH1.

### 11.1 Remaining sequential human path

1. Project Reviewer completes T006 using §8.1.
2. Project Reviewer completes T011 using §9.1.
3. Authorities complete T016 using the six forms in §5.1; D0–D5 remain `OPEN` until then.
4. QLHT/Operations, data custodian, Security and Verification reviewers provide the PH1 minimum
   evidence for P04–P06. Each package receives its own result; no package is closed by author prose.
5. Principal Product Author freezes the exact reviewed manifest and runs T023–T025.
6. Project Reviewer completes T031; checklist markers remain reviewer-owned.
7. PG4 Gate Authority completes T026. Only an attributable `PASS` or valid `PASS-WITH-ACTIONS`
   naming the exact PH1 successor can authorize implementation.
8. T027 may create the PH1 Spec Kit directory only after that authorization.

### 11.2 Parallel actions available now

- QLHT/Operations can verify the one-host/one-PostgreSQL/one-Gateway allocation for D2.
- Engineering and QLHT/Operations can identify the minimum D1-A Gateway adapter/runtime/license;
  no Format Worker qualification is needed for the F01–F05 scope unless authority chooses otherwise.
- Security and Verification owners can nominate reviewers and review the Grant/Receipt/session
  boundary without claiming production security or recovery acceptance.
- The data custodian can prepare the bounded synthetic fixture profile for D4.
- The Principal Product Author can inventory concrete F01–F05 dependencies for D5; no new external
  inclusion is reported until that inventory identifies one.

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
