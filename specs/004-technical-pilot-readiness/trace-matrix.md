# PH0 Trace Matrix

**Increment**: `IE-INC-READY-001`
**Version / status**: `0.7` / Draft; T009 author trace and P02/T011 reviewer walkthrough recorded; P03/T016 documentary decision capture `PASS`; P04/P05/P06 scoped results `PASS`, application verification `NOT-RUN`
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

## 2. Trace đã gắn cho canonical scenario (T009)

Các nguồn sản phẩm trong bảng dưới đây là các phiên bản của predecessor được pin trong
`f269a044...`; chúng không biến Draft successor thành Approved. Mỗi dòng là một trace claim cần
được reviewer kiểm tra. Hai ngoại lệ có quyết định riêng là
[`IE-CHG-PDA-APPROVAL-002`](../../docs/product/instances/idea-engineering/registers/CHG-2026-09-19-pda-approval-approval-policy.md)
cho Approval Policy và
[`IE-CHG-PDA-APPROVAL-003`](../../docs/product/instances/idea-engineering/registers/CHG-2026-09-25-pda-approval-checkin-scope.md)
cho ba nhánh Check-in. `DOC-05@0.26` và `VVP@0.19` là nguồn Draft hỗ trợ đối chiếu hai quyết định
có phạm vi hẹp này, không phải toàn bộ successor đã được duyệt. `NOT-RUN` là trạng thái
verification của PH0, không phải thiếu ID.

| Step / path | Work package | Local FR / SC | Approved product REQ | Architecture source | VVP source | PH0 output | Evidence status | Notes / gap |
|---|---|---|---|---|---|---|---|---|
| Native sign-in and ActorContext | `P02` | `FR-004`, `SC-002` | `REQ-IAM-001…007`, `REQ-AUTH-006…009` | `DOC-05@0.20 §7.4, §7.6`; `IF-ACCOUNT-SESSION`, `IF-AUTHORIZATION-DECISION` | `VVP-015`, `RBAC-01…10` | `canonical-scenario.md` | `NOT-RUN` | Exact identity allocation remains D2/P04. |
| Logical Document and exact Generation | `P02` | `FR-004`, `SC-002` | `REQ-ID-001…009`, `REQ-WS-001…004` | `DOC-05@0.20 §1, §7.1`; `ARCH-VIEW-SEQ-001` | `VVP-001`, `IF-01…06` | `canonical-scenario.md` | `NOT-RUN` | Source pin is predecessor; successor delta is not inherited. |
| Explicit Checkout/Reference scope | `P02` | `FR-004`, `SC-002` | `REQ-WS-001…003` | `DOC-05@0.20 §7.1`; `ARCH-VIEW-SEQ-001` | `VVP-002`, `WS-01` | `canonical-scenario.md` | `NOT-RUN` | No hidden cascade. |
| Materialize and digest-check Workspace | `P02` | `FR-004`, `SC-002` | `REQ-WS-003/004` | `DOC-05@0.20 §7.1`; `IF-ARTIFACT-TRANSFER` | `VVP-002` | `canonical-scenario.md` | `NOT-RUN` | Local path/OS association require P04. |
| Scan and confirm Check-in scope | `P02` | `FR-004`, `SC-002/003` | `REQ-WS-005/006` | `DOC-05@0.20 §5.3, §7.1` predecessor; `DOC-05@0.26 ARCH-VIEW-ACT-004` Draft view of the scoped approved policy | `VVP-002`, `WS-02`; planned `WS-09…11` in VVP@0.19 | `canonical-scenario.md` | `NOT-RUN` | `IE-CHG-PDA-APPROVAL-003` approves the three dispositions only; no blanket DOC-05 or runtime approval. |
| Unknown required-dependency scope | `P02` | `FR-004`, `SC-003/005` | `REQ-WS-005/006/010/013` | `DOC-05@0.26 ARCH-VIEW-ACT-004` (Draft view); `IE-CHG-PDA-APPROVAL-003` (policy authority) | `VVP-002`, `WS-09` in VVP@0.19 | `canonical-scenario.md` | `NOT-RUN` | Block, identify unresolved file/reason, preserve local bytes and still-valid Reservations. |
| Required unreserved change | `P02` | `FR-004`, `SC-003/005` | `REQ-WS-005/006/007/010/013` | `DOC-05@0.26 ARCH-VIEW-ACT-004` (Draft view); `IE-CHG-PDA-APPROVAL-003` (policy authority) | `VVP-002/003`, `WS-10` in VVP@0.19 | `canonical-scenario.md` | `NOT-RUN` | Block the complete proposal; no partial publication or loss of still-valid Reservations. |
| Proven unrelated unreserved change | `P02` | `FR-004`, `SC-003/005` | `REQ-WS-005/006/007/010/013` | `DOC-05@0.26 ARCH-VIEW-ACT-004`, `ARCH-VIEW-SEQ-002` (Draft views); `IE-CHG-PDA-APPROVAL-003` (policy authority) | `VVP-002/003`, `WS-11` in VVP@0.19 | `canonical-scenario.md` | `NOT-RUN` | Exclude with visible `Modified without Checkout`, require reduced-scope reconfirmation and revalidate at commit. |
| Private resumable byte transfer | `P02` | `FR-004`, `SC-005` | `REQ-WS-012/015`, `REQ-OPS-001` | `DOC-05@0.20 §9.1`; `ARCH-VIEW-SEQ-006` | `VVP-003`, `WS-08` | `canonical-scenario.md` | `NOT-RUN` | Direct multi-location `REQ-WS-016` is a later successor/D1 qualification, not an approved predecessor trace. |
| Changed atomic Check-in | `P02` | `FR-004`, `SC-002/005` | `REQ-WS-007/009/013` | `DOC-05@0.20 §7.2`; `ARCH-VIEW-STATE-004` | `VVP-003`, `WS-02/03` | `canonical-scenario.md` | `NOT-RUN` | Logical all-or-none, not a claim about physical transfer transaction. |
| NoChange Check-in | `P02` | `FR-004`, `SC-002` | `REQ-WS-008`, `REQ-WS-012/013` | `DOC-05@0.20 §7.2` | `VVP-003`, `QRS-001/002` | `canonical-scenario.md` | `NOT-RUN` | No new Generation or Version. |
| Review exact Generation | `P02` | `FR-004`, `SC-002` | `REQ-LC-001/002` | `DOC-05@0.20 §7.3`; `ARCH-VIEW-SEQ-003` | `VVP-006`, `WF-01…03` | `canonical-scenario.md` | `NOT-RUN` | Workflow source remains Draft product input. |
| Review content-revision attempt | `P02` | `FR-004`, `SC-002/005` | `REQ-LC-002/005` | `DOC-05@0.20 §7.3` predecessor; `DOC-05@0.26 ARCH-VIEW-STATE-001/SEQ-003` Draft clarification | `VVP-006`, `WF-03/05` | `canonical-scenario.md` | `NOT-RUN` | Local edit alone does not change the pinned Generation. Changed Check-in is refused during `Under Review`; Withdraw/Reject closes the Round before a new Check-in and resubmission. |
| Independent decision evidence | `P02` | `FR-004`, `SC-002` | `REQ-LC-003/004/005` | `DOC-05@0.20 §7.3` predecessor; `IE-CHG-PDA-APPROVAL-002` limited policy authority | `VVP-006`, `WF-04…06` | `canonical-scenario.md` | `NOT-RUN` | Pilot uses seeded independent policy; validated versioned policy may separately allow self-approval. Two identities are not two humans. |
| Exact Release and package | `P02` | `FR-004`, `SC-002` | `REQ-LC-006/007/008`, `REQ-STR-001…005` | `DOC-05@0.20 §7.3`; `ARCH-VIEW-SEQ-003` | `VVP-006`, `SR-01…06` | `canonical-scenario.md` | `NOT-RUN` | Approver identity needs separate applicable Release eligibility; Approval is not Release authority. Release scope is confirmed with no silent cascade. |
| Historical package retrieval | `P02` | `FR-004`, `SC-002` | `REQ-LC-008/009`, `REQ-STR-001/002` | `DOC-05@0.20 §7.3` | `VVP-006`, `SR-06` | `canonical-scenario.md` | `NOT-RUN` | Exact digest/provenance must be compared. |
| Audit and owner outcome separation | `P02` | `FR-005`, `SC-002` | `REQ-AUD-001/002`, `REQ-AUTH-006…008`, `REQ-GOV-002` | `DOC-05@0.20 §5.1, §7.6`; `IF-AUTHORIZATION-DECISION` | `VVP-007`, `DH-01…04` | `canonical-scenario.md` | `NOT-RUN` | `REQ-AUD-001` covers attributable outcome evidence; `REQ-AUD-002` covers append-only and ordinary-administration mutation protection. |
| RBAC denial | `P02` | `FR-004`, `SC-003` | `REQ-AUTH-001…010`, `REQ-GOV-002` | `DOC-05@0.20 §5.2, §7.6` | `VVP-007`, `RBAC-01…10` | `canonical-scenario.md` | `NOT-RUN` | Business gates remain separate from RBAC eligibility. |
| Stale / non-owner / wrong Workspace | `P02` | `FR-004`, `SC-003/005` | `REQ-WS-010/011/013/014` | `DOC-05@0.20 §7.2, §7.2.1`; `ARCH-VIEW-SEQ-007` | `VVP-004`, `WS-03/04/05/06/07` | `canonical-scenario.md` | `NOT-RUN` | No auto-merge or overwrite. |
| Interrupted transfer / lost response | `P02` | `FR-004`, `SC-005` | `REQ-WS-007/012/013/015`, `REQ-OPS-001/002` | `DOC-05@0.20 §7.2.1, §9.1`; `ARCH-VIEW-SEQ-006/007` | `VVP-003/004`, `WS-03/07/08` | `canonical-scenario.md` | `NOT-RUN` | Same OperationId and identical inputs only; direct Gateway successor remains D1. |
| P03 decisions and dependency owners | `P03` | `FR-007/008/013`, `SC-004/006` | `REQ-WS-015`, `REQ-OPS-003…008`, `REQ-FMT-001…005`, `REQ-SEC-001…004` | `DOC-05@0.20 §9.1–§9.3, §10`; `ADR C1-011` | `VVP-003`, `VVP-011` | `readiness-register.md`; [P03/T016 evidence](evidence/P03-T016-DECISIONS-20260925.md) | `PASS` for documentary decision capture | D0–D5 have owner/effect/reopen records; exact Gateway/Format Worker/application qualification remains later evidence, not guessed. |
| Environment profile | `P04` | `FR-009`, `SC-004/007` | `REQ-SEC-001…004`, `REQ-OPS-001…008` | `DOC-05@0.20 §4, §9, §10` | `VVP-011`, `VVP-015` | `environment-profile.md`; `evidence/P04-ENV-REVIEW-20260924.md` | `PASS` for P04 environment only | Ubuntu host and native runtime reviewed; application build, Adapter I/O and accepted deployment remain `NOT-RUN`. |
| Synthetic data and verification matrix | `P05` | `FR-010`, `SC-005…007` | `REQ-ID-001…009`, `REQ-WS-001…015`, `REQ-LC-001…009`, `REQ-STR-001…006` | `DOC-05@0.20 §7, §9.1–§9.2`; `DOC-06@0.16 §1` | `VVP-001…007`, `VVP-011` | `test-data-and-verification.md`; `evidence/P05-SERVER-FIXTURES-20260924.md` | `PASS` for P05 preparation only | Server file size/hash and ownership match; application checks and second Vault failure-domain qualification remain `NOT-RUN`. |
| Recovery and security plan | `P06` | `FR-011…013`, `SC-005…007` | `REQ-WS-010…015`, `REQ-AUTH-001…010`, `REQ-SEC-001…004`, `REQ-AUD-001/002` | `DOC-05@0.20 §7.2.1, §9, §10`; `DOC-06@0.16 §1.3–§1.4` | `VVP-003/004/007/011/015` | `recovery-and-security-plan.md`; [guided review](evidence/P06-GUIDED-REVIEW-DISPOSITION-20260924.md) | `PASS` for PH0 documentary readiness | Application, security, rollback and restore execution remain `NOT-RUN`; `REQ-WS-016` is not in approved predecessor. |
| PG4 package/gate | `P07` | `FR-014…017`, `SC-008/009` | `NOT-APPLICABLE` until P01–P06 results exist | `contracts/pg4-gate-record.md` | `quickstart.md §8` | Future `pg4-review-package.md` and `pg4-gate-record.md` | `NOT-RUN` | No gate authority decision; production remains unauthorized. |

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
| 0.2 | 2026-09-18 | Gắn các bước canonical scenario, negative paths và P03–P07 output vào REQ/architecture/VVP IDs; mọi verification vẫn `NOT-RUN`. | T009; `canonical-scenario.md` |
| 0.3 | 2026-09-18 | Làm rõ trace Audit của P02 bằng `REQ-AUD-001/002` thay cho wildcard `REQ-AUD-*`; không thay đổi hành vi, scope hoặc verification result. | DOC-04 `REQ-AUD-001/002`; review-assistant correction |
| 0.4 | 2026-09-24 | Đồng bộ kết quả P04/P05 đã review vào trace; giữ ứng dụng, D4 và PG4 ở trạng thái chưa chạy. | `P04-ENV-REVIEW-20260924`; `P05-SERVER-FIXTURES-20260924` |
| 0.5 | 2026-09-25 | Gắn hai quyết định chính sách được duyệt có phạm vi hẹp vào P02; trace riêng ba nhánh Check-in, làm rõ quyền Release và giữ phân biệt predecessor với Draft successor. T011 và kiểm thử ứng dụng chưa chạy. | `IE-CHG-PDA-APPROVAL-002/003`; `canonical-scenario.md@0.2` |
| 0.6 | 2026-09-25 | Trace the refused changed Check-in under `Under Review` and the new Round after Withdraw/Reject; point the scoped Draft view references to DOC-05@0.26. T011 and runtime verification remain `NOT-RUN`. | `canonical-scenario.md@0.3`; `IE-CHG-P07-T011-001` |
| 0.7 | 2026-09-25 | Record P03/T016 documentary decision capture as `PASS` and link D0–D5 effects/reopen triggers; keep application and Gateway qualification `NOT-RUN`. | `P03-T016-DECISIONS-20260925`; readiness register §5 |
