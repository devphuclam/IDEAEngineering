# PH0 Readiness Register

**Increment**: `IE-INC-READY-001` — Technical Pilot Implementation Readiness
**Version / status**: `0.5` / Draft; author preparation through T020 recorded, readiness results remain `NOT-RUN`
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
| Applicable baseline | PH0 source set trên branch `main` at `a2cb58961c9f264152ff7395c9158b78f3cfe224`; predecessor approval và successor Draft được tách trong [baseline-manifest.md](baseline-manifest.md) |
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

Các dòng dưới đây là nhóm cần đưa vào sổ chi tiết ở P03. Chưa có dòng nào được đóng chỉ bằng
khuyến nghị của Engineering.

| Decision / dependency | Nội dung cần xác định | Owner | Closure evidence | Affected work | Gate effect | State |
|---|---|---|---|---|---|---|
| `D0` | Disposition chính xác cho Vault successor nhiều location | Product Decision Authority | Quyết định có ID, baseline và ngày | P01–P07 | `BLOCKS_PG4` | `OPEN` |
| `D1` | Artifact Gateway và Format Worker: runtime/toolchain, license và qualification | Engineering + QLHT/authority phù hợp | Profile được duyệt và evidence qualification | P03–P06 | `BLOCKS_PG4` hoặc `DEFERRED_SCOPE` | `OPEN` |
| `D2` | Hai identity và hai Vault location có được cấp trong môi trường thử không | QLHT / Operations | Xác nhận cấp phát và failure-domain description | P04–P06 | `BLOCKS_PG4` | `OPEN` |
| `D3` | Người review chuyên môn cho security, recovery và storage | Project authority | Tên vai trò/người review và phạm vi | P06–P07 | `BLOCKS_PG4` | `OPEN` |
| `D4` | Fixture multi-GB, provenance và thời hạn lưu | Principal Product Author + data custodian | Dataset profile và digest | P05–P06 | `BLOCKS_PG4` hoặc `DEFERRED_SCOPE` | `OPEN` |
| `D5` | Dependency hoặc asset bên ngoài có được phép dùng không | Principal Product Author + legal/company owner | External-source intake record | P03–P06 | `BLOCKS_PG4` | `OPEN` |

P03 phải ghi đủ câu hỏi, lựa chọn, khuyến nghị, due condition, reopen trigger và impact cụ thể
theo [decision-and-evidence-register.md](contracts/decision-and-evidence-register.md). Mục dưới
đây là hồ sơ tác giả chuẩn bị; không phải authority disposition.

## 5. Decision records prepared for P03

| ID | Question / current state | Engineering recommendation and options/trade-offs | Accountable owner / authority | Due condition / closure evidence | Affected work / gate effect | Reopen trigger |
|---|---|---|---|---|---|---|
| `D0` | Successor Vault-transfer disposition: `OPEN`; current successor is Draft and exact PDA disposition `NOT-RUN`. | Keep predecessor approval separate; do not inherit the successor. Options: approve exact successor after review, revise it, or defer Vault successor while keeping approved baseline. | Product Decision Authority | Before P07/PG4; decision ID, date, exact source hashes and updated baseline manifest. | P01–P07; `BLOCKS_PG4`. | Any change to successor source, approval record or Vault architecture. |
| `D1` | Artifact Gateway and Format Worker runtime/toolchain/license/qualification: `OPEN` / runtime `UNKNOWN`. | Keep Gateway and Worker as separate boundaries. Select Worker boundary for Core v0, but do not select its runtime/toolchain until qualification. Options: qualify approved Windows toolchain, revise boundary, or defer format jobs. | Engineering + QLHT/Operations + applicable authority | Before P04/P05/P07; approved environment/profile, license intake and qualification evidence. | P03–P06; `BLOCKS_PG4` or `DEFERRED_SCOPE`. | Runtime, licensed application, adapter profile or deployment topology changes. |
| `D2` | Test identities and Vault locations/failure domains: `OPEN`. | Provision two native identities and at least two logical Vault locations only when QLHT/Operations confirms ownership and isolation. Do not infer independent humans or physical failure domains from names. | QLHT / Operations | Before P04/P05; attributable allocation, endpoint/location IDs, access evidence and failure-domain description. | P04–P06; `BLOCKS_PG4`. | Host, network, identity or storage topology changes. |
| `D3` | Specialist reviewer competence and independence: `OPEN`. | Name separate security, recovery/storage and verification reviewers; two identities controlled by one person are not independent-human review. | Project authority / applicable Quality or Security authority | Before P06/P07; named reviewer, scope, competence basis and review record. | P06–P07; `BLOCKS_PG4`. | Scope, reviewer availability or required assurance level changes. |
| `D4` | Multi-GB fixture provenance, digest, retention and disposal: `OPEN`. | Use synthetic, reproducible fixtures; do not commit real company files or unlicensed payloads. Options: qualify a generated large fixture, use a bounded smaller fixture with explicit deferral, or defer large-transfer execution. | Principal Product Author + data custodian | Before P05; dataset profile, generator/version, size/digest, retention/disposal and provenance record. | P05–P06; `BLOCKS_PG4` or `DEFERRED_SCOPE`. | Fixture generator, size, license, retention or test objective changes. |
| `D5` | External source/dependency/license intake: `OPEN`. | No import until exact source/version/license/commercial-use state is recorded. Unresolved source remains `REFERENCE-ONLY` or `BLOCKED-LEGAL`. | Principal Product Author + legal/company owner | Before any inclusion and before P07; completed [external-source-intake.md](../../docs/agents/external-source-intake.md) record and obligation review. | P03–P06; `BLOCKS_PG4`. | Source/version/license or commercial target changes. |

Engineering recommendations above do not close decisions. An authority must record the disposition
and the evidence in a later controlled change/review record.

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

## 7. T006 review evidence and human action

| Field | Recorded value |
|---|---|
| Check ID | `P01-BASELINE-001` |
| Exact input baseline | `IE-INC-READY-001-BL-001`; current repository commit `a2cb58961c9f264152ff7395c9158b78f3cfe224` |
| Exact manifest hash | `SHA-256 21F6E196E7786924BF5B9A20C377F9B3BA5E9D6C7AAC7FAC8020EB1001E09B93` |
| Reviewer / date | Project reviewer / `NOT-RUN` — no attributable review record exists in the repository |
| `BL-DISC-001` disposition | Author reconciliation: later attributable approval record governs the exact predecessor; historical status prose is retained. Reviewer confirmation: `NOT-RUN`. |
| `BL-DISC-002` disposition | Successor sources remain separate Draft inputs; exact Product Decision Authority disposition is still `NOT-RUN` and tracked as `D0`. |
| `BL-DISC-003` disposition | Appendix A@0.6 contains the author correction under `IE-CHG-PH0-CORR-001`; reviewer confirmation that the planning discrepancy is acceptable remains `NOT-RUN`. |
| Result | `NOT-RUN` — this is not P01 acceptance and does not approve any successor. |
| Required human action | Project reviewer must inspect the manifest, approval record, Appendix A@0.6 and the three discrepancy dispositions, then record reviewer identity, date, exact manifest hash and `PASS`, `FAIL` or `BLOCKED` with evidence. |
| Gate effect | Until that action is recorded, P01 remains `IN-PROGRESS`, its readiness result remains `NOT-RUN`, and `PG4` cannot be decided. |

## 8. Change log

| Version | Date | Change | Evidence |
|---|---|---|---|
| 0.1 | 2026-09-17 | Initial PH0 register; all work packages and checks initialized `NOT-RUN`. | T001 |
| 0.2 | 2026-09-17 | Ghi nhận T001–T005 hoàn tất ở cấp tác giả; P01 vẫn `IN-PROGRESS`, readiness result và reviewer disposition vẫn `NOT-RUN`. | T004–T005; T006 còn mở |
| 0.3 | 2026-09-18 | Hoàn tất phân tích chéo và remediation A1–A6; các readiness result P01–P07 không thay đổi. | T028–T030; [analysis-findings.md](analysis-findings.md) |
| 0.4 | 2026-09-18 | Chuẩn bị hồ sơ T006 với manifest hash, disposition của BL-DISC-001…003 và hành động reviewer; không tự ghi nhận review hoặc PASS. | `P01-BASELINE-001`; T006 vẫn mở |
| 0.5 | 2026-09-18 | Chuẩn bị canonical scenario, trace cụ thể, P03 decision records và hồ sơ P04–P06; không chuyển readiness result khỏi `NOT-RUN`. | T007–T010, T012–T015, T017–T020 |
