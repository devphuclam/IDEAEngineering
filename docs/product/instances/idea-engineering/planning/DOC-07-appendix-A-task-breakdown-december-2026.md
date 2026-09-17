# IDEA Engineering — Phụ lục A: Kế hoạch Technical Pilot đến 31/12/2026

Ngày lập lại kế hoạch: 17/09/2026. Đây là bản phân rã để review, lập increment và theo dõi;
không phải lệnh bắt đầu code hay bằng chứng đã triển khai.

| Thông tin kiểm soát | Nội dung |
|---|---|
| Tài liệu chủ quản | [DOC-07 — IE-PROD-ROADMAP-001@0.13](../DOC-07-mvp-roadmap-and-delivery-plan.md) |
| Mã phụ lục / trạng thái | `IE-PROD-ROADMAP-001-APP-A` — Draft 0.5 |
| Kế hoạch áp dụng | `IE-PLAN-DEC2026-002@0.1` — Draft |
| Người chuẩn bị / review | Principal Product Author chuẩn bị; người dùng dự án review |
| Phân loại | `INTERNAL` |
| Thay đổi và nguồn | [IE-CHG-ROADMAP-TP-001](../registers/CHG-2026-09-17-technical-pilot-roadmap-rebaseline.md) |
| Bản trước | Kế hoạch 56 task/756 giờ tại Git commit `aabf02ffdef4ca901a84d39af5a467d39fd2c0d2`; không dùng để điều hành thực hiện |

Phụ lục này thuộc DOC-07, không phải DOC thứ chín, SRS mới hoặc bộ Feature mới. DOC-07 giữ
quyền quyết định kế hoạch; phụ lục giữ work package. [Gantt](idea-roadmap-december-2026.html) chỉ
là bản nhìn trực quan của cùng một baseline. [Danh sách Kanban CARIO](idea-technical-pilot-kanban-cario.md)
phân rã 35 work package thành 53 card delivery và 7 card quyết định/milestone để nhập vào công cụ
nội bộ; nó không thay đổi effort, dependency hoặc thẩm quyền của kế hoạch.

## 1. Cách sử dụng

- Có **35 work package**, tổng cộng **512 giờ công việc** và **88 giờ dự phòng có kiểm soát**.
- Mốc 31/12 là **Technical Pilot**: một luồng xuyên suốt chạy được và có bằng chứng kiểm tra. Đây
  không phải toàn bộ Core v0, production acceptance hoặc triển khai cho cả công ty.
- Kế hoạch dùng 75 ngày làm việc trong tuần, mỗi ngày 8 giờ. Thứ Bảy không được tính sẵn.
- Người dùng dự án là coder chính duy nhất. Trợ lý không được tính thành người phát triển thứ hai.
- Mỗi work package gồm triển khai, kiểm tra tập trung, cập nhật tài liệu và chuẩn bị review. Test
  không được dồn hết tới PH5.
- Trước mỗi phase có code, tạo một increment Spec Kit riêng với spec, plan, checklist và task
  thực thi. Không dùng feature `003-controlled-documentation` làm feature sản phẩm.
- Không thay đổi 14 nhóm Feature, yêu cầu Spec hoặc Tech Stack để ép vừa lịch. Những phần chưa nằm
  trong Technical Pilot vẫn thuộc sản phẩm hoặc increment sau.
- Mọi work package khởi tạo ở trạng thái `NOT-RUN`.

## 2. Quỹ thời gian

| Phase | Khoảng ngày | Giờ công việc | Dự phòng | Tổng quỹ |
|---|---|---:|---:|---:|
| PH0 — Sẵn sàng triển khai | 18/09–02/10 | 64 | 24 | 88 |
| PH1 — Khung hệ thống chạy được | 05/10–16/10 | 72 | 8 | 80 |
| PH2 — Quản lý tài liệu lõi | 19/10–06/11 | 96 | 24 | 120 |
| PH3 — Workspace và multi-location Vault | 09/11–04/12 | 144 | 16 | 160 |
| PH4 — Review và Release | 07/12–18/12 | 72 | 8 | 80 |
| PH5 — Ổn định và Technical Pilot | 21/12–31/12 | 64 | 8 | 72 |
| **Tổng** | **18/09–31/12** | **512** | **88** | **600** |

Quỹ này chưa trừ ngày lễ, nghỉ phép hoặc công việc khác. Chờ sếp, IT, license, máy chủ hoặc
reviewer là rủi ro lịch, không phải giờ triển khai. Khi dùng dự phòng phải ghi nguyên nhân, số giờ,
task bị ảnh hưởng và phần cần test lại.

## 3. Phase, milestone và đường găng

`PH*` là khoảng thực hiện có thời lượng và effort. `MS*` là điểm review có thời lượng bằng không.
`D0` là quyết định Spec/Tech cần thiết trước `MS0`; nó không phải một phase triển khai.

```text
D0 — quyết định Vault successor ─────────────┐
                                             ↓
PH0 — readiness ── MS0/PG4 ── PH1 ── MS1 ── PH2 ── MS2 ── PH3 ── MS3 ── PH4 ── MS4 ── PH5 ── MS5
```

Vì chỉ có một coder và các phase chạy nối tiếp, **toàn bộ PH0–PH5 nằm trên đường găng**. `D0` và
`MS0` là dependency chặn đầu vào; các milestone sau chặn phase kế tiếp. Dự phòng nằm ở cuối từng
phase nhưng không phải một công việc hay quyền bỏ qua gate.

## 4. Work package theo thứ tự thực hiện

### 4.1 PH0 — Sẵn sàng triển khai, 64 giờ

| Mã | Công việc | Giờ | Cần trước | Đầu ra và cách biết đã xong |
|---|---|---:|---|---|
| P01 | Ghim baseline đã được duyệt | 8 | Commit `aabf02ff…` và hồ sơ duyệt | Có manifest nêu đúng Feature, Spec, Tech đã duyệt và phần Vault phát sinh sau duyệt; không gộp hai baseline thành một. |
| P02 | Chốt phạm vi Technical Pilot | 8 | P01 | Có một canonical scenario từ đăng nhập đến lấy lại Release Package, danh sách phần bắt buộc và phần chuyển sang increment sau. |
| P03 | Phân loại quyết định còn mở | 8 | P01, P02 | Mỗi quyết định về Gateway, Vault, môi trường, dữ liệu thử, quyền và người review có owner, hạn xử lý và ảnh hưởng nếu chưa có. |
| P04 | Chuẩn bị môi trường và cấu trúc delivery | 12 | P03 | Ghi máy phát triển/server được phép, quy trình build/test, quản lý secret/configuration, database migration và cách tạo increment; không cài công cụ chưa được phép. |
| P05 | Chuẩn bị dữ liệu và test strategy | 8 | P02 | Có bộ tài liệu tổng hợp hợp lệ, file lớn đại diện, hai identity thử, hai vị trí Vault thử và ma trận đường chính/đường lỗi. |
| P06 | Lập kế hoạch migration, rollback, backup và security review | 12 | P03–P05 | Có phương án quay lại schema/app, giữ Workspace cục bộ, khôi phục metadata–Artifact đồng bộ và phạm vi review bảo mật cần người phù hợp. |
| P07 | Review readiness và ghi kết quả PG4 | 8 | P01–P06 | Có checklist, blocker, residual risk, kế hoạch increment PH1 và kết luận `PASS`, `BLOCKED` hoặc `NOT-RUN`; ngày tới hạn không tự biến thành `PASS`. |

### 4.2 PH1 — Khung hệ thống chạy được, 72 giờ

| Mã | Công việc | Giờ | Cần trước | Đầu ra và cách biết đã xong |
|---|---|---:|---|---|
| F01 | Tạo khung source, build và kiểm tra tự động | 16 | P07 đạt `PG4` | Web, Desktop, Server và test projects build bằng lệnh đã ghi; kiểm tra cơ bản chạy lặp lại; configuration không chứa secret thật. |
| F02 | Khởi tạo PostgreSQL và migration | 12 | F01 | Database mới dựng được từ migration; rollback thử được trong phạm vi cho phép; health check phân biệt app với database. |
| F03 | Tạo bootstrap admin, tài khoản và session | 16 | F01, F02 | Superuser chỉ được tạo theo bootstrap kiểm soát; đăng nhập/đăng xuất/khóa phiên hoạt động; không có đăng ký công khai. |
| F04 | Dựng transaction và Audit seam | 12 | F02, F03 | Một lệnh mẫu ghi kết quả nghiệp vụ và Audit có cùng correlation; Audit không tự quyết định nghiệp vụ và không sửa qua UI thường. |
| F05 | Chạy smoke path control plane/data plane | 16 | F01–F04 | Client xin lệnh từ Server, nhận quyền truyền ngắn hạn, gửi một Artifact qua Gateway và Server ghi metadata sau khi xác minh receipt; byte không đi xuyên business Server. |

### 4.3 PH2 — Quản lý tài liệu lõi, 96 giờ

| Mã | Công việc | Giờ | Cần trước | Đầu ra và cách biết đã xong |
|---|---|---:|---|---|
| C01 | Cấu hình loại tài liệu, metadata và đánh số | 16 | F05 | Một Document Class mẫu có trường bắt buộc, quy tắc số và versioned configuration; cấp số đồng thời không trùng. |
| C02 | Store Existing và tạo Logical Document | 20 | C01 | Người có quyền đăng ký file sẵn có, xem cảnh báo trùng và quyết định tạo/liên kết/hủy; hệ thống không tự gộp identity. |
| C03 | New và lịch sử Revision/Version/Generation | 20 | C02 | New dùng cùng mô hình; Revision A, Version 1 và immutable Generation được tạo đúng; Generation cũ không bị thay đổi. |
| C04 | Tìm kiếm và đọc theo quyền | 20 | C03, F03 | Tìm theo mã/tên/loại/trạng thái; kết quả, tổng số và chi tiết không làm lộ tài liệu ngoài quyền. |
| C05 | Hoàn thiện vertical slice tài liệu | 20 | C01–C04 | Từ Web hoặc Desktop, người dùng tạo/tiếp nhận, tìm, mở đúng Generation và xem lịch sử; API trái quyền bị từ chối và có test lặp lại. |

### 4.4 PH3 — Workspace và multi-location Vault, 144 giờ

| Mã | Công việc | Giờ | Cần trước | Đầu ra và cách biết đã xong |
|---|---|---:|---|---|
| W01 | Workspace Windows và manifest cục bộ | 20 | C05 | Workspace nhớ tài liệu, Generation nền, đường dẫn và trạng thái Save; đóng/mở lại không mất công việc; session Windows khác không điều khiển được. |
| W02 | Checkout và Reference theo phạm vi | 20 | W01 | Người dùng xác nhận từng tài liệu lấy để sửa hoặc tham khảo; Checkout không tự giữ cả cây; Reference không tạo quyền ghi vào bản gốc. |
| W03 | Transfer Grant và truyền file tiếp tục được | 24 | W02, F05 | Grant ngắn hạn ghim actor, operation, artifact, chiều và endpoint; upload/download chia phần, tiếp tục được và xác minh digest. |
| W04 | Check-in nguyên tử và No Change | 24 | W03, C03 | Check-in xác nhận phạm vi, kiểm tra lại quyền/bản nền/file/cấu trúc và ghi toàn bộ hoặc không ghi; Changed và No Change đều kết thúc Checkout đúng phạm vi. |
| W05 | Stale, mất mạng và retry cùng OperationId | 24 | W04 | Bản làm việc cũ bị từ chối rõ ràng, file cục bộ được giữ; mất phản hồi được tra lại/gửi lại bằng cùng OperationId, không tạo Generation trùng. |
| W06 | Hai vị trí Vault và exact-read failover | 20 | W03–W05 | Một Artifact có hai location đã xác minh; replication không đổi identity; đọc thử location kế tiếp chỉ khi digest đúng; location lỗi không được quảng bá là hợp lệ. |
| W07 | Demo hai identity và kiểm tra ranh giới | 12 | W01–W06 | Hai identity/hai Workspace chạy Checkout, Reference, Check-in, stale, retry và failover; Server không chuyển byte file; Audit nối được intent, transfer và commit. |

### 4.5 PH4 — Review và Release, 72 giờ

| Mã | Công việc | Giờ | Cần trước | Đầu ra và cách biết đã xong |
|---|---|---:|---|---|
| L01 | Structure Snapshot và phụ thuộc bắt buộc | 16 | W07 | Snapshot ghim đúng Generation/occurrence; vòng, thiếu quyền và dependency bắt buộc chưa đủ bị phát hiện; sibling không bắt buộc có thể tiếp tục In Work. |
| L02 | Submit, Review, Approve/Reject | 16 | L01 | Review Round ghim Generation và policy; người không đủ role/scope bị từ chối; sửa nội dung sau submit không thừa hưởng quyết định cũ. |
| L03 | Release đúng phạm vi | 20 | L02 | Người dùng xem và xác nhận phạm vi; hệ thống kiểm tra lại bản, structure, approval, quyền và durability policy; một lỗi làm toàn bộ Release không commit. |
| L04 | Release Package và Revision sau Release | 12 | L03 | Gói chứa manifest, file, metadata, structure và digest; lấy lại đúng gói cũ sau khi có bản mới; Revision tiếp theo không sửa lịch sử cũ. |
| L05 | Demo luồng phát hành và negative paths | 8 | L01–L04 | Cụm bơm được Release trong khi tủ điện vẫn In Work; thiếu dependency, self-approval hoặc scope đổi giữa chừng đều bị chặn có bằng chứng. |

### 4.6 PH5 — Ổn định và Technical Pilot, 64 giờ

| Mã | Công việc | Giờ | Cần trước | Đầu ra và cách biết đã xong |
|---|---|---:|---|---|
| Q01 | Chạy regression Release Spine | 12 | L05 | Canonical scenario chạy từ tài khoản đến phục hồi Release Package; test tự động và lỗi đã biết được ghim vào đúng build. |
| Q02 | Kiểm tra authorization và security boundary | 8 | Q01 | Gọi API/tải file trái quyền, session bị thu hồi, grant hết hạn/sai endpoint và vượt scope đều bị từ chối; client không chứa secret dài hạn. |
| Q03 | Đo transfer đại diện | 8 | Q01; dữ liệu P05 | Ghi file size, concurrency, đường truyền, tốc độ, retry và tài nguyên; kết quả là evidence của môi trường thử, không suy rộng thành SLA. |
| Q04 | Backup và restore trên môi trường sạch | 12 | Q01 | Khôi phục cùng mốc PostgreSQL, Artifact locations, configuration và key material cần thiết; đối chiếu identity/digest; ghi RPO/RTO đo được. |
| Q05 | Đóng gói và hướng dẫn vận hành | 8 | Q02–Q04 | Có cách cài/cập nhật/rollback được phép, cấu hình môi trường, cảnh báo, account operations và đường xử lý sự cố cho người vận hành ban đầu. |
| Q06 | Technical Pilot, sửa lỗi chặn và báo cáo | 16 | Q01–Q05 | Chạy demo có người quan sát, ưu tiên lỗi mất file/sai quyền/sai Generation/sai Release, retest và ghi phần đạt/chưa đạt; không tự tuyên bố production ready. |

## 5. Definition of Done áp dụng cho mọi work package

Một work package chỉ được đóng khi:

1. Đầu ra quan sát được đã chạy trong môi trường được ghi nhận.
2. Có test cho đường chính và đường lỗi thuộc phạm vi task; kết quả không chạy được ghi `BLOCKED`
   hoặc `NOT-RUN`, không ghi `PASS`.
3. Mã nguồn, migration, configuration và tài liệu liên quan thay đổi cùng một reviewable change.
4. Requirement, architecture decision và evidence liên quan được liên kết bằng ID ổn định.
5. Không để secret, dữ liệu công ty không được phép hoặc Artifact thử ngoài custody đã định.
6. Có cách quay lại hoặc giữ an toàn dữ liệu/Workspace nếu deployment hay operation thất bại.
7. Demo và hạn chế được viết bằng ngôn ngữ người review hiểu, không chỉ bằng log kỹ thuật.

## 6. Mốc review và quyết định

| Ngày | Review | Người tham gia tối thiểu | Kết quả |
|---|---|---|---|
| Chậm nhất 25/09 | D0 / Vault successor | Product Decision Authority; Principal Product Author chuẩn bị decision delta | Duyệt successor, từ chối hoặc giữ ngoài first increment; không im lặng coi là đã duyệt |
| 02/10 | MS0 / PG4 | Người dùng dự án; Product Decision Authority/IT/specialist khi quyết định tương ứng cần họ | Cho phép PH1, yêu cầu sửa hoặc giữ `BLOCKED` |
| 16/10 | MS1 | Người dùng dự án | Demo khung chạy; chốt tốc độ thực tế và tính lại PH2–PH5 |
| 06/11 | MS2 | Người dùng dự án; người hỗ trợ nghiệp vụ nếu có | Demo tài liệu lõi và quyền đọc |
| 04/12 | MS3 | Người dùng dự án; người review security/storage phù hợp nếu được giao | Demo Workspace/Vault; bắt buộc reforecast PH4–PH5 |
| 18/12 | MS4 | Người dùng dự án; người nắm quy trình Review/Release | Demo phát hành theo phạm vi và lấy lại lịch sử |
| 31/12 | MS5 | Người dùng dự án và người quan sát được chỉ định | Kết luận Technical Pilot: đạt phạm vi nào, lỗi/giới hạn nào, bước sau là gì |

## 7. Trace theo nhóm yêu cầu

| Phase | Nhóm yêu cầu chính | V&V trọng tâm |
|---|---|---|
| PH0 | GOV, SEC, OPS và toàn bộ requirement ảnh hưởng first increment | Readiness, baseline, dataset, authority và recovery preparation |
| PH1 | IAM, AUD, SEC, OPS | Account/session, audit correlation, migrations và transfer boundary smoke test |
| PH2 | ID, GOV, UX | Identity, metadata, Generation history, duplicate handling và authorized search |
| PH3 | WS, SEC, OPS, artifact/data contracts | Checkout/Reference/Check-in, idempotency, stale, transfer, replication và failover |
| PH4 | STR, LC, GOV | Structure Snapshot, independent Review, Release gate và exact reproduction |
| PH5 | Toàn bộ Release Spine | Regression, authorization, transfer evidence, restore và bounded pilot |

Chi tiết `REQ-*` và procedure ID phải được chốt trong Spec Kit plan của từng increment. Bảng này
định tuyến, không thay SRS hoặc VVP.

## 8. Cách theo dõi khi thực hiện

Mỗi work package ghi tối thiểu:

| Trường | Cách ghi |
|---|---|
| Status | `NOT-RUN`, `IN-PROGRESS`, `BLOCKED`, `PASS` hoặc `FAIL` theo bằng chứng |
| Planned / actual / remaining hours | Ba số riêng, không sửa số kế hoạch để che sai lệch |
| Blocker | Mô tả, owner, ngày cần xử lý và milestone bị ảnh hưởng |
| Change | Commit/PR/Work Item hoặc change record |
| Test/evidence | Lệnh/kịch bản, môi trường, dữ liệu và kết quả |
| Reforecast | Ngày, nguyên nhân, reserve đã dùng và mốc mới nếu có |

Review tiến độ hằng tuần chỉ cần trả lời: đã xong gì, bằng chứng ở đâu, đang làm gì, bị chặn bởi ai,
ước lượng còn lại thay đổi thế nào và có cần quyết định hay không.

## 9. Tài liệu làm căn cứ

- [DOC-07@0.14](../DOC-07-mvp-roadmap-and-delivery-plan.md) — 0.14 giữ nguyên schedule này và chỉ bổ sung hướng thương mại dài hạn ngoài phạm vi Technical Pilot
- [DOC-04 — Software Requirements Specification](../DOC-04-software-requirements-specification.md)
- [DOC-05 — Architecture Description](../DOC-05-architecture-description.md)
- [DOC-06 — Data, Integration and Migration Specification](../DOC-06-data-integration-and-migration-specification.md)
- [DOC-08 — UI/UX and Interaction Specification](../DOC-08-ui-ux-and-interaction-specification.md)
- [VVP](../registers/VVP-core-v0-verification-validation-plan.md)
- [Vault architecture change](../registers/CHG-2026-09-17-multi-location-vault-transfer-architecture.md)
- [Roadmap rebaseline change](../registers/CHG-2026-09-17-technical-pilot-roadmap-rebaseline.md)
