# PH0 Trace Matrix

**Increment**: `IE-INC-READY-001`
**Version / status**: `0.1` / Draft
**Purpose**: Một mặt phẳng trace để nối work package, yêu cầu readiness và nguồn sản phẩm đã
được duyệt. Tài liệu này không tạo `REQ-*` mới và không thay DOC-04.

## 1. Cột bắt buộc

| Cột | Ý nghĩa |
|---|---|
| Work package | `P01`–`P07` theo DOC-07 Appendix A |
| Local FR / SC | `FR-*` hoặc `SC-*` của PH0 spec |
| Approved product REQ | ID `REQ-*` trong predecessor SRS nếu đã xác định; không tự đoán |
| Architecture source | DOC-05/DOC-06 hoặc ADR/view liên quan nếu đã xác định |
| VVP source | Procedure/objective liên quan nếu đã xác định |
| PH0 output | Tên hồ sơ tạo ra |
| Evidence status | `NOT-RUN`, `PASS`, `FAIL`, `BLOCKED` hoặc `NOT-APPLICABLE` |
| Notes / gap | Khoảng trống, giới hạn hoặc lý do chưa trace được |

## 2. Khung trace ban đầu

Các dòng này chỉ xác nhận phạm vi cần trace. Việc gắn từng `REQ-*`, DOC và VVP cụ thể thuộc T009;
`NOT-YET-TRACED` không phải một kết quả đạt.

| Work package | Local FR / SC | Approved product REQ | Architecture source | VVP source | PH0 output | Evidence status | Notes / gap |
|---|---|---|---|---|---|---|---|
| `P01` | `FR-001…003`, `SC-001` | `NOT-YET-TRACED` | `NOT-YET-TRACED` | `NOT-YET-TRACED` | `baseline-manifest.md` | `NOT-RUN` | Cần phân biệt source identity và approval evidence |
| `P02` | `FR-004…006`, `SC-002…003,005` | `NOT-YET-TRACED` | `NOT-YET-TRACED` | `NOT-YET-TRACED` | `canonical-scenario.md` (T007–T010) | `NOT-RUN` | Scenario chưa được lập |
| `P03` | `FR-007…008,013`, `SC-004,006` | `NOT-YET-TRACED` | `NOT-YET-TRACED` | `NOT-YET-TRACED` | `readiness-register.md` | `NOT-RUN` | Cần owner và closure evidence |
| `P04` | `FR-009`, `SC-004,007` | `NOT-YET-TRACED` | `NOT-YET-TRACED` | `NOT-YET-TRACED` | `environment-profile.md` (T017) | `NOT-RUN` | Chưa có environment profile |
| `P05` | `FR-010`, `SC-005…007` | `NOT-YET-TRACED` | `NOT-YET-TRACED` | `NOT-YET-TRACED` | `test-data-and-verification.md` (T018–T019) | `NOT-RUN` | Chưa có fixture được phép |
| `P06` | `FR-011…013`, `SC-005…007` | `NOT-YET-TRACED` | `NOT-YET-TRACED` | `NOT-YET-TRACED` | `recovery-and-security-plan.md` (T020) | `NOT-RUN` | Chưa có review competence |
| `P07` | `FR-014…017`, `SC-008…009` | `NOT-YET-TRACED` | `NOT-YET-TRACED` | `NOT-YET-TRACED` | `pg4-review-package.md`, `pg4-gate-record.md` | `NOT-RUN` | Chưa có gate authority decision |

## 3. Quy tắc hoàn thiện

1. T009 phải thay từng `NOT-YET-TRACED` bằng ID nguồn chính xác hoặc ghi `BLOCKED` kèm lý do;
   không dùng tên tài liệu thay cho `REQ-*` khi một requirement cụ thể là cần thiết.
2. Mỗi kết quả `PASS` hoặc `FAIL` phải trỏ tới baseline và evidence; `BLOCKED` phải có owner;
   `NOT-RUN` phải giữ nguyên nếu chưa thực hiện.
3. Nếu trace phát hiện thay đổi hành vi sản phẩm, dừng ở PH0 và chuyển lại Feature/Spec/Tech
   authority; không tạo một requirement thay thế trong ma trận này.

## 4. Change log

| Version | Date | Change | Evidence |
|---|---|---|---|
| 0.1 | 2026-09-17 | Tạo khung trace cho P01–P07; chưa khẳng định product trace hay verification result. | T002 |
