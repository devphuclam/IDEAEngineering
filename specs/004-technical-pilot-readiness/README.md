# PH0 — Technical Pilot Implementation Readiness

`IE-INC-READY-001` là increment chuẩn bị quyết định có thể bắt đầu một phần triển khai tiếp theo
hay chưa. PH0 chỉ tạo hồ sơ, trace và evidence plan; không tạo mã sản phẩm hoặc chọn lại Tech
Stack. [PG4 Gate Authority đã quyết định `PASS`](pg4-gate-record.md) ngày 25/09/2026 cho đúng
PH1 F01–F05; quyết định đó không phải kết quả kiểm thử ứng dụng.

## Đọc theo thứ tự

1. [spec.md](spec.md) — phạm vi, user stories, FR/SC và ranh giới PH0.
2. [plan.md](plan.md) — work package P01–P07 và cách tổ chức hồ sơ.
3. [baseline-manifest.md](baseline-manifest.md) — predecessor đã duyệt và successor Draft.
4. [readiness-register.md](readiness-register.md) — sổ công việc, dependency và kết quả.
5. [trace-matrix.md](trace-matrix.md) — đường trace từ PH0 tới nguồn Feature/Spec/Tech.
6. [canonical-scenario.md](canonical-scenario.md) — scenario bắt buộc, đường bình thường và đường lỗi.
7. [environment-profile.md](environment-profile.md) — Ubuntu development host, Windows client boundary and setup limits; [server runbook](../../deploy/development/README.md) lists the P04 checks.
8. [test-data-and-verification.md](test-data-and-verification.md) — fixture synthetic và ma trận kiểm tra.
9. [recovery-and-security-plan.md](recovery-and-security-plan.md) — recovery, backup và security review; [D3 scope record](evidence/D3-REVIEW-SCOPE-20260924.md) ghi phạm vi và người được giao review; [P06 final disposition](evidence/P06-GUIDED-REVIEW-DISPOSITION-20260924.md) ghi kết quả `PASS` và giới hạn bằng chứng.
10. [research.md](research.md) và [data-model.md](data-model.md) — quyết định thiết kế hồ sơ.
11. [quickstart.md](quickstart.md) — cách reviewer chạy các kiểm tra tài liệu.
12. [contracts/](contracts/) — quy tắc cho manifest, decision/evidence và PG4.
13. [checklists/requirements.md](checklists/requirements.md) — checklist chất lượng spec đã tạo.
14. [checklists/readiness.md](checklists/readiness.md) — checklist do reviewer giữ quyền đánh dấu.
15. [analysis-findings.md](analysis-findings.md) — bản phân tích lịch sử và remediation đã được duyệt.
16. [analysis-findings-002.md](analysis-findings-002.md) — bản phân tích mới sau khi bổ sung hồ sơ PH0 và hoàn tất T021 cấp tác giả.
17. [analysis-findings-003.md](analysis-findings-003.md) — bản phân tích lịch sử sau khi xử lý các finding về link, authority wording và baseline metadata.
18. [analysis-findings-004.md](analysis-findings-004.md) — snapshot phân tích ngày 2026-09-23, trước khi ghi kết quả review P04 hiện tại.
19. [PG4 gate record](pg4-gate-record.md) — quyết định và phạm vi được phép bắt đầu.
20. [PH1 delivery specification](../005-ph1-foundation-custody/spec.md) — hồ sơ Spec Kit mở sau quyết định PG4.

## Trạng thái hiện tại

| Nội dung | Trạng thái |
|---|---|
| PH0 source package | `Draft` |
| PH0 work packages | P01–P06 `COMPLETE / PASS` within their documented scopes. P07/T026–T027 and final handoff are complete; [P02/T011](evidence/P02-T011-GUIDED-REVIEW-20260925.md), P03/T016 and P06 are documentary results, not application behavior. P05 covers synthetic fixture preparation only. |
| D3 review scope | Boss-approved PH1 scope and the user's direct Security/Verification assignment were reported and confirmed on 2026-09-24. The guided P06 review records the reviewer’s introductory competence basis, examined material, findings and documentary `PASS`; specialist runtime/operations review remains deferred under the no-claim condition. |
| PG4 Gate Execution State | `COMPLETE` — [decision record](pg4-gate-record.md) |
| PG4 Gate Outcome | `PASS` for `IE-INC-PH1-FOUNDATION-CUSTODY-001`, F01–F05/72 planned task hours only |
| PH1 implementation | Authorized within the exact gate limits; F01-A is the next delivery card, not automatically started |
| DeliveryCard:P07 | Tracked separately in the Execution Register/local Tracker; this README does not close its timer or record actual effort |
| Product Feature/Spec/Tech baseline | Unchanged by this handoff; approved predecessor and current PG2/PG3 evidence remain pinned separately |

## Quy tắc không được suy diễn

- `PASS` trong một readiness check không phải Product Decision Authority approval.
- Hoàn thành hồ sơ không chứng minh runtime, bảo mật, hiệu năng, recovery hay production readiness.
- Chỉ PG4 `PASS` hoặc `PASS-WITH-ACTIONS` hợp lệ mới có thể cho phép đúng successor increment;
  các điều kiện bắt buộc và PG2/PG3 baseline phải được đáp ứng.
- PH1 dùng một Gateway/Vault, giữ `VaultId`, `LocationId`, `ArtifactId`, digest và Adapter path
  ownership tách biệt để còn phát triển multi-vault. Vault thứ hai, replication và failover chưa làm.
- Build, tài khoản IDEA, Gateway transfer, Format Worker runtime/toolchain và các kiểm thử
  ứng dụng chưa có bằng chứng tương ứng vẫn là `NOT-RUN`.
- Đóng DeliveryCard:P07 và bắt đầu F01-A chỉ xảy ra qua thao tác Tracker riêng; không suy diễn
  giờ công hoặc trạng thái card từ quyết định gate.

## Tài liệu liên quan

- [DOC-07 Appendix A](../../docs/product/instances/idea-engineering/planning/DOC-07-appendix-A-task-breakdown-december-2026.md)
- [PH0 correction record](../../docs/product/instances/idea-engineering/registers/CHG-2026-09-17-ph0-readiness-correction.md)
- [PH0 analysis remediation](../../docs/product/instances/idea-engineering/registers/CHG-2026-09-18-ph0-analysis-remediation.md)
- [Product instance catalogue](../../docs/product/instances/idea-engineering/README.md)
