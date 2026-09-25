# T031 Readiness Checklist — reviewer preview

**Evidence ID**: `P07-T031-CHECKLIST-PREVIEW-20260925`  
**Status**: `READY-FOR-REVIEW`; this file proposes findings and does not mark the checklist.  
**Reviewer**: Project user acting as Project Reviewer  
**Baseline**: T023 source freeze `a9924f467585354cda8017b0f578954a8af0dfd7`; control record `c0656468c4922728a97215a0886c50bc497181a9`.

## How to use this preview

Mỗi dòng dưới đây trả lời: tiêu chí đang hỏi gì, hồ sơ nào chứng minh và có giới hạn nào không.
`PROPOSED PASS` chỉ là đề xuất để reviewer đọc; chỉ reviewer mới chuyển `[ ]` thành `[x]` trong
`checklists/readiness.md`. Một mục `PASS` không có nghĩa sản phẩm đã chạy và không tự tạo PG4.

| Items | Nội dung đối chiếu | Evidence / giới hạn | Đề xuất |
|---|---|---|---|
| CHK001–CHK005 | Predecessor Feature/Spec/Tech có commit/hash/authority; successor tách riêng; hash không thay approval; xung đột prose xử lý bằng discrepancy; multi-Vault cần authority riêng | [baseline manifest](../baseline-manifest.md) §§1–2.4; [PG2/PG3 authority](../../../docs/product/instances/idea-engineering/registers/CHG-2026-09-25-pg2-pg3-approval.md); ADR-0009 còn Proposed | `PROPOSED PASS` |
| CHK006–CHK010 | Một canonical scenario có actor/precondition/step/outcome/evidence; trace không tự tạo REQ; mandatory/deferred/prohibited tách nhau; PH0/PH1/Technical Pilot/Core v0 không nhập nhằng | [canonical scenario](../canonical-scenario.md); [trace matrix](../trace-matrix.md); [P02 review](P02-T011-GUIDED-REVIEW-20260925.md) | `PROPOSED PASS` |
| CHK011–CHK015 | Mỗi decision có owner, due condition, closure evidence, gate effect và reopen trigger; recommendation khác authority; `BLOCKED`/`NOT-RUN`/defer không bị coi là success | [readiness register](../readiness-register.md) §5; [P03/T016](P03-T016-DECISIONS-20260925.md) | `PROPOSED PASS` |
| CHK016–CHK021 | Environment, fixture/provenance/identity/digest, logical location vs failure domain, failure matrix, coordinated recovery và reviewer competence đều có yêu cầu rõ | [environment profile](../environment-profile.md); [test data](../test-data-and-verification.md); [recovery/security plan](../recovery-and-security-plan.md); P04/P05/P06 evidence | `PROPOSED PASS`; CHK016 đã reviewer-marked |
| CHK022–CHK024 | Intake bao phủ software/source/content/model/dataset/font/asset/service; source/version/license trước import; internal-first tách khỏi Commercial Readiness Gate | [external-source-intake](../../../docs/agents/external-source-intake.md); readiness register D5; [native runtime intake](../../../docs/research/2026-09-23-p04-ubuntu-native-runtime-intake.md) | `PROPOSED PASS` |
| CHK025–CHK030 | Mỗi P01–P07 có owner/source/result/evidence; PG4 chỉ authorize successor cụ thể; missing evidence/authority chặn; prohibited inferences đủ; không tự thêm performance threshold; không code trước PG4 PASS | [readiness register](../readiness-register.md); [PG4 package](../pg4-review-package.md); [PG4 contract](../contracts/pg4-gate-record.md) | `PROPOSED PASS` |
| CHK031–CHK033 | Gate Execution State, Gate Outcome và check result tách nhau; conditional action đủ owner/baseline/due/expiry/escalation/rationale; authorization chỉ mở exact successor với PG2/PG3 + attributable PASS/PASS-WITH-ACTIONS | [PG4 contract](../contracts/pg4-gate-record.md); [quickstart](../quickstart.md); [PG4 package](../pg4-review-package.md) | `PROPOSED PASS` |

## Reviewer response surface

Anh có thể trả lời theo một trong hai cách:

1. `Xác nhận T031 theo đề xuất` — tôi sẽ đánh dấu CHK001–CHK033 sau khi ghi lại xác nhận này.
2. Nêu nhóm hoặc mã CHK cần sửa — tôi sẽ sửa hồ sơ, không đánh dấu mục đó cho đến khi anh xác nhận lại.

