# PH0 — Technical Pilot Implementation Readiness

`IE-INC-READY-001` là increment chuẩn bị quyết định có thể bắt đầu một phần triển khai tiếp theo
hay chưa. PH0 chỉ tạo hồ sơ, trace và evidence plan; không tạo mã sản phẩm, không chọn lại Tech
Stack và không phê duyệt successor baseline.

## Đọc theo thứ tự

1. [spec.md](spec.md) — phạm vi, user stories, FR/SC và ranh giới PH0.
2. [plan.md](plan.md) — work package P01–P07 và cách tổ chức hồ sơ.
3. [baseline-manifest.md](baseline-manifest.md) — predecessor đã duyệt và successor Draft.
4. [readiness-register.md](readiness-register.md) — sổ công việc, dependency và kết quả.
5. [trace-matrix.md](trace-matrix.md) — đường trace từ PH0 tới nguồn Feature/Spec/Tech.
6. [research.md](research.md) và [data-model.md](data-model.md) — quyết định thiết kế hồ sơ.
7. [quickstart.md](quickstart.md) — cách reviewer chạy các kiểm tra tài liệu.
8. [contracts/](contracts/) — quy tắc cho manifest, decision/evidence và PG4.
9. [checklists/requirements.md](checklists/requirements.md) — checklist chất lượng spec đã tạo.
10. [checklists/readiness.md](checklists/readiness.md) — checklist do reviewer giữ quyền đánh dấu.

## Trạng thái hiện tại

| Nội dung | Trạng thái |
|---|---|
| PH0 source package | `Draft` |
| P01–P07 execution | P01 `IN-PROGRESS`; P02–P07 `NOT-RUN` |
| PG4 Gate Execution State | `NOT-RUN` |
| PG4 Gate Outcome | `NOT-APPLICABLE` until an attributable decision |
| Production implementation | Unauthorized |
| Product Feature/Spec/Tech baseline | Unchanged; predecessor approval remains pinned separately |

## Quy tắc không được suy diễn

- `PASS` trong một readiness check không phải Product Decision Authority approval.
- Hoàn thành hồ sơ không chứng minh runtime, bảo mật, hiệu năng, recovery hay production readiness.
- Chỉ PG4 `PASS` hoặc `PASS-WITH-ACTIONS` hợp lệ mới có thể cho phép đúng successor increment;
  các điều kiện bắt buộc và PG2/PG3 baseline phải được đáp ứng.
- Successor multi-location Vault, Format Worker runtime/toolchain và các giá trị qualification
  vẫn giữ trạng thái riêng của chúng.

## Tài liệu liên quan

- [DOC-07 Appendix A](../../docs/product/instances/idea-engineering/planning/DOC-07-appendix-A-task-breakdown-december-2026.md)
- [PH0 correction record](../../docs/product/instances/idea-engineering/registers/CHG-2026-09-17-ph0-readiness-correction.md)
- [Product instance catalogue](../../docs/product/instances/idea-engineering/README.md)
