# PH0 Readiness Register

**Increment**: `IE-INC-READY-001` — Technical Pilot Implementation Readiness
**Version / status**: `0.1` / Draft
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
| Reviewer | Người dùng dự án; review `NOT-RUN` |
| Applicable baseline | PH0 source set trên branch `codex/technical-pilot-speckit`; predecessor approval và successor Draft được tách trong [baseline-manifest.md](baseline-manifest.md) |
| Source/change trace | [IE-CHG-PH0-CORR-001](../../docs/product/instances/idea-engineering/registers/CHG-2026-09-17-ph0-readiness-correction.md) |
| Evidence rule | Không ghi `PASS` nếu chưa có bằng chứng chạy trên đúng baseline |
| Retention | `INTERNAL`; giữ cùng increment PH0 |

## 3. Work-package status

| Work package | Mục tiêu ngắn | Task IDs | Owner | Due condition | Gate effect | Task state | Result | Evidence link | Blocker / deviation |
|---|---|---|---|---|---|---|---|---|---|
| `P01` | Ghim baseline đã duyệt và phân biệt successor | T004–T006 | Principal Product Author / project reviewer | Trước P02 | `BLOCKS_PG4` nếu chưa xác định được baseline | `IN-PROGRESS` | `NOT-RUN` | [baseline-manifest.md](baseline-manifest.md); [PH0 correction](../../docs/product/instances/idea-engineering/registers/CHG-2026-09-17-ph0-readiness-correction.md) | T004–T005 hoàn tất ở cấp tác giả; T006 review chưa chạy |
| `P02` | Chốt một canonical Technical Pilot scenario | T007–T011 | Principal Product Author / project reviewer | Sau P01 | `BLOCKS_PG4` | `NOT-RUN` | `NOT-RUN` | `NOT-RUN` | Chưa lập scenario |
| `P03` | Ghi mọi quyết định và dependency còn mở | T012–T016 | Principal Product Author và authority tương ứng | Sau P01–P02 | `BLOCKS_PG4` hoặc `DEFERRED_SCOPE` theo từng dòng | `NOT-RUN` | `NOT-RUN` | `NOT-RUN` | Chưa phân công đủ authority |
| `P04` | Mô tả môi trường delivery được phép | T017, T021–T022 | Principal Product Author / QLHT khi cần | Trước P07 | `BLOCKS_PG4` nếu thiếu điều kiện bắt buộc | `NOT-RUN` | `NOT-RUN` | `NOT-RUN` | Chưa có hồ sơ môi trường |
| `P05` | Chuẩn bị fixture và ma trận verification | T018–T019, T021–T022 | Principal Product Author / reviewer phù hợp | Trước P07 | `BLOCKS_PG4` nếu thiếu dữ liệu hoặc location cần thiết | `NOT-RUN` | `NOT-RUN` | `NOT-RUN` | Chưa có dataset được phép |
| `P06` | Lập kế hoạch rollback, recovery và security review | T020–T022 | Principal Product Author / specialist reviewer | Trước P07 | `BLOCKS_PG4` nếu thiếu review material | `NOT-RUN` | `NOT-RUN` | `NOT-RUN` | Reviewer chuyên môn `NOT-RUN` |
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

P03 phải bổ sung câu hỏi, lựa chọn, khuyến nghị, due condition, reopen trigger và impact cụ thể
theo [decision-and-evidence-register.md](contracts/decision-and-evidence-register.md).

## 5. Readiness-check index

| Check family | Planned checks | Method / baseline | Result | Evidence |
|---|---|---|---|---|
| P01 baseline | `P01-BASELINE-*` | Hash và authority record | `NOT-RUN` | `NOT-RUN` |
| P02 scenario | `P02-SCENARIO-*` | Walkthrough và trace review | `NOT-RUN` | `NOT-RUN` |
| P03 decisions | `P03-DECISION-*` | Register inspection | `NOT-RUN` | `NOT-RUN` |
| P04 environment | `P04-ENV-*` | Profile review | `NOT-RUN` | `NOT-RUN` |
| P05 dataset | `P05-DATA-*` | Fixture/matrix inspection | `NOT-RUN` | `NOT-RUN` |
| P06 recovery/security | `P06-RECOVERY-*`, `P06-SECURITY-*` | Procedure and reviewer-competence review | `NOT-RUN` | `NOT-RUN` |
| P07 gate | `P07-GATE-*` | Attributable authority decision | `NOT-RUN` | `NOT-RUN` |

## 6. Change log

| Version | Date | Change | Evidence |
|---|---|---|---|
| 0.1 | 2026-09-17 | Initial PH0 register; all work packages and checks initialized `NOT-RUN`. | T001 |
| 0.2 | 2026-09-17 | Ghi nhận T001–T005 hoàn tất ở cấp tác giả; P01 vẫn `IN-PROGRESS`, readiness result và reviewer disposition vẫn `NOT-RUN`. | T004–T005; T006 còn mở |
