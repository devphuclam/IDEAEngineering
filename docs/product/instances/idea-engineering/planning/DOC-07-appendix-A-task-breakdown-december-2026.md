# IDEA Engineering — Phụ lục A: Kế hoạch Core v0 đến 31/12/2026

Ngày cập nhật forecast: 22/09/2026. Đây là bản phân rã để review, lập increment và theo dõi;
không phải lệnh bắt đầu code hay bằng chứng đã triển khai.

| Thông tin kiểm soát | Nội dung |
|---|---|
| Tài liệu chủ quản | [DOC-07 — IE-PROD-ROADMAP-001@0.17](../DOC-07-mvp-roadmap-and-delivery-plan.md) |
| Mã phụ lục / trạng thái | `IE-PROD-ROADMAP-001-APP-A` — Current planning baseline 0.9 |
| Kế hoạch áp dụng | `IE-PLAN-DEC2026-003@0.2` — Current |
| Người chuẩn bị / review | Principal Product Author chuẩn bị; người dùng dự án review |
| Phân loại | `INTERNAL` |
| Thay đổi và nguồn | [IE-CHG-PLAN-ID-001](../registers/CHG-2026-09-22-planning-card-identity-correction.md); predecessor [IE-CHG-ROADMAP-CV0-001](../registers/CHG-2026-09-21-core-v0-roadmap-rebaseline.md) |
| Bản trước | Kế hoạch 56 task/756 giờ tại Git commit `aabf02ffdef4ca901a84d39af5a467d39fd2c0d2`; không dùng để điều hành thực hiện |

Phụ lục này thuộc DOC-07, không phải DOC thứ chín, SRS mới hoặc bộ Feature mới. DOC-07 giữ
quyền quyết định kế hoạch; phụ lục giữ work package. [Gantt](idea-roadmap-december-2026.html) chỉ
là bản nhìn trực quan của cùng một baseline. [Danh sách Kanban CARIO](idea-technical-pilot-kanban-cario.md)
phân rã 35 work package thành 53 card delivery và 7 card quyết định/milestone để nhập vào công cụ
nội bộ; nó không thay đổi effort, dependency hoặc thẩm quyền của kế hoạch.

## 1. Cách sử dụng

- Có **35 work package**, tổng cộng **512 giờ công việc**, **88 giờ dự phòng kỹ thuật** và
  **32 giờ đệm vận hành**.
- Mốc 31/12 là **Core v0 áp dụng nội bộ**: một bản nhỏ cài được trên nhiều máy Windows và chạy
  được luồng chính trong phạm vi pilot. Đây chưa phải rollout toàn công ty hoặc bản thương mại.
- Kế hoạch dùng 79 ngày làm việc từ 23/09 đến 31/12, mỗi ngày 8 giờ: thứ Hai–thứ Sáu và thứ Bảy
  tuần 1, 3, 5 của tháng; thứ Bảy tuần 2 và 4 được nghỉ. Tổng quỹ là **632 giờ**. Ngày lễ, nghỉ phép
  hoặc việc khác phải được ghi vào forecast thực tế, không tự giảm giờ công việc đã cam kết.
- Người dùng dự án là coder chính duy nhất. Trợ lý không được tính thành người phát triển thứ hai.
- Mỗi work package gồm triển khai, kiểm tra tập trung, cập nhật tài liệu và chuẩn bị review. Test
  không được dồn hết tới PH5.
- Trước mỗi phase có code, tạo một increment Spec Kit riêng với spec, plan, checklist và task
  thực thi. Không dùng feature `003-controlled-documentation` làm feature sản phẩm.
- Không thay đổi 14 nhóm Feature, yêu cầu Spec hoặc Tech Stack để ép vừa lịch. Những phần chưa nằm
  trong Core v0 vẫn thuộc sản phẩm hoặc increment sau.
- `PLN01`–`PLN03` đã hoàn thành trước ngày bắt đầu triển khai chính thức và được ghi nhận hồi tố;
  các work package còn lại khởi tạo ở trạng thái `NOT-RUN`. Ba việc lập kế hoạch không phải bằng
  chứng rằng phần mềm đã được triển khai.

## 2. Quỹ thời gian

| Phase | Khoảng ngày | Giờ công việc | Dự phòng kỹ thuật | Đệm vận hành | Tổng quỹ |
|---|---|---:|---:|---:|---:|
| PH0 — Lập kế hoạch và sẵn sàng triển khai | 21/09 thực tế; baseline 23/09–29/09 | 32 | 0 | 8 | 40 |
| PH1 — Khung hệ thống chạy được | 30/09–13/10 | 72 | 8 | 8 | 88 |
| PH2 — Quản lý tài liệu lõi | 14/10–30/10 | 96 | 16 | 0 | 112 |
| PH3 — Workspace và Checkout/Check-in | 31/10–26/11 | 136 | 32 | 8 | 176 |
| PH4 — Review và Release | 27/11–14/12 | 88 | 16 | 0 | 104 |
| PH5 — Ổn định và áp dụng nội bộ | 15/12–31/12 | 88 | 16 | 8 | 112 |
| **Tổng** | **23/09–31/12** | **512** | **88** | **32** | **632** |

Quỹ 632 giờ là **baseline allocation** của kế hoạch. Dự phòng kỹ thuật dùng cho việc phát sinh
trong phạm vi đã chốt; đệm vận hành dùng cho review, chuyển môi trường và gián đoạn có kiểm soát.
Hai phần này không phải task và không tự biến thành scope mới. Khi dùng phải ghi nguyên nhân, số
giờ, card bị ảnh hưởng, người xác nhận và phần cần kiểm tra lại.

## 3. Phase, milestone và đường găng

`PH*` là khoảng thực hiện có thời lượng và effort. `MS*` là điểm review có thời lượng bằng không.
`D0` là quyết định Spec/Tech cần thiết trước `MS0`; nó không phải một phase triển khai.

```text
G-D0 — ghi nhận baseline đã duyệt ───────────┐
                                             ↓
PH0 — readiness ── MS0/PG4 ── PH1 ── MS1 ── PH2 ── MS2 ── PH3 ── MS3 ── PH4 ── MS4 ── PH5 ── MS5
```

Vì chỉ có một coder và các phase chạy nối tiếp, **toàn bộ PH0–PH5 nằm trên đường găng**. `D0` và
`MS0` là dependency chặn đầu vào; các milestone sau chặn phase kế tiếp. Dự phòng nằm ở cuối từng
phase nhưng không phải một công việc hay quyền bỏ qua gate.

## 4. Work package theo thứ tự thực hiện

### 4.1 PH0 — Lập kế hoạch và sẵn sàng triển khai, 32 giờ

| Mã | Công việc | Giờ | Cần trước | Đầu ra và cách biết đã xong |
|---|---|---:|---|---|
| PLN01 | Xây dựng và chốt WBS Core v0 | 4 | Kế hoạch 31/12 và phạm vi Core v0 đã được người dùng dự án xác nhận | Có 35 work package và 53 Delivery Card với giờ, đầu ra, điều kiện hoàn thành và dependency; tổng công việc bằng 512 giờ. |
| PLN02 | Lập Gantt, lịch làm việc và milestone | 4 | PLN01 | Có lịch từ 23/09 đến 31/12/2026 theo lịch làm việc đã chốt; work package, reserve, buffer và MS0–MS5 khớp cùng một baseline. |
| PLN03 | Thiết lập Kanban CARIO và cơ chế ghi nhận tiến độ | 4 | PLN02 | Có card dễ đọc, CARIO, Execution Register, Work Journal và tracker để ghi actual, remaining, blocker và evidence; Project Management Compiler đọc được nguồn này. |
| P04 | Chuẩn bị môi trường và cấu trúc delivery | 4 | PLN03 | Ghi máy phát triển/server được phép, quy trình build/test, quản lý secret/configuration, database migration và cách tạo increment; không cài công cụ chưa được phép. |
| P05 | Chuẩn bị dữ liệu và test strategy | 4 | PLN03 | Có bộ tài liệu mẫu, file lớn đại diện, hai identity thử, một Vault và ma trận đường chính/đường lỗi. |
| P06 | Lập kế hoạch migration, rollback, backup và security review | 8 | P04, P05 | Có phương án quay lại schema/app, giữ Workspace cục bộ, khôi phục metadata–Artifact đồng bộ và phạm vi review bảo mật cần người phù hợp. |
| P07 | Review readiness và ghi kết quả PG4 | 4 | PLN01–PLN03, P04–P06 | Có checklist, blocker, residual risk và phạm vi PH1. Ghi riêng trạng thái đánh giá và kết quả PG4; ngày tới hạn không tự biến thành được duyệt. |

PG4 ghi riêng hai thông tin:

- **Trạng thái đánh giá (Gate Execution State)**: `NOT-RUN` — chưa đánh giá; `IN-PROGRESS` —
  đang đánh giá; `COMPLETE` — đã ghi quyết định. Khi chưa có quyết định, kết quả là `NOT-APPLICABLE`.
- **Kết quả đánh giá (Gate Outcome)**: `PASS`, `PASS-WITH-ACTIONS`, `FAIL` hoặc `BLOCKED`.
  `COMPLETE` không có nghĩa là đạt; `NOT-RUN` không phải kết quả duyệt.

Chỉ `PASS` hoặc `PASS-WITH-ACTIONS` hợp lệ mới cho phép thực hiện đúng increment PH1 được ghi,
với yêu cầu PG2 và kiến trúc/thiết kế PG3 đã được duyệt. Với `PASS-WITH-ACTIONS`, từng việc còn lại
phải có người chịu trách nhiệm, baseline ảnh hưởng, hạn/điều kiện xử lý, thời điểm hết hiệu lực và
đường báo cáo nếu chưa xử lý. Những việc đó không được làm mất tính hợp lệ của yêu cầu, kiến trúc,
xử lý rủi ro, thiết kế kiểm tra hoặc khả năng rollback; không dùng duyệt có điều kiện để bỏ qua
đầu vào bắt buộc còn thiếu. `FAIL`, `BLOCKED` hoặc chưa đánh giá đều không cho phép bắt đầu code.

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

### 4.4 PH3 — Workspace và Checkout/Check-in, 136 giờ

| Mã | Công việc | Giờ | Cần trước | Đầu ra và cách biết đã xong |
|---|---|---:|---|---|
| W01 | Workspace Windows và manifest cục bộ | 20 | C05 | Workspace nhớ tài liệu, Generation nền, đường dẫn và trạng thái Save; đóng/mở lại không mất công việc; session Windows khác không điều khiển được. |
| W02 | Checkout và Reference theo phạm vi | 20 | W01 | Người dùng xác nhận từng tài liệu lấy để sửa hoặc tham khảo; Checkout không tự giữ cả cây; Reference không tạo quyền ghi vào bản gốc. |
| W03 | Transfer Grant và truyền file tiếp tục được | 24 | W02, F05 | Grant ngắn hạn ghim actor, operation, artifact, chiều và endpoint; upload/download chia phần, tiếp tục được và xác minh digest. |
| W04 | Check-in nguyên tử và No Change | 24 | W03, C03 | Check-in xác nhận phạm vi, kiểm tra lại quyền/bản nền/file/cấu trúc và ghi toàn bộ hoặc không ghi; Changed và No Change đều kết thúc Checkout đúng phạm vi. |
| W05 | Stale, mất mạng và retry cùng OperationId | 24 | W04 | Bản làm việc cũ bị từ chối rõ ràng, file cục bộ được giữ; mất phản hồi được tra lại/gửi lại bằng cùng OperationId, không tạo Generation trùng. |
| W06 | Một Vault cấu hình được và ranh giới mở rộng | 20 | W03–W05 | Core v0 đọc/ghi qua một Vault không viết cứng một máy; định danh Vault/location và adapter cho phép bổ sung nơi lưu sau này mà không sửa document identity. Replication, failover và chọn Vault vẫn `NOT-RUN`. |
| W07 | Demo hai identity và kiểm tra ranh giới | 4 | W01–W06 | Hai identity/hai Workspace chạy Checkout, Reference, Check-in, stale và retry với một Vault; Server không chuyển byte file; Audit nối được intent, transfer và commit. |

### 4.5 PH4 — Review và Release, 88 giờ

| Mã | Công việc | Giờ | Cần trước | Đầu ra và cách biết đã xong |
|---|---|---:|---|---|
| L01 | Structure Snapshot và phụ thuộc bắt buộc | 16 | W07 | Snapshot ghim đúng Generation/occurrence; vòng, thiếu quyền và dependency bắt buộc chưa đủ bị phát hiện; sibling không bắt buộc có thể tiếp tục In Work. |
| L02 | Submit, Review, Approve/Reject | 16 | L01 | Review Round ghim Generation và policy; người không đủ role/scope bị từ chối; sửa nội dung sau submit không thừa hưởng quyết định cũ. |
| L03 | Release đúng phạm vi | 24 | L02 | Người dùng xem và xác nhận phạm vi; hệ thống kiểm tra lại bản, structure, approval, quyền và durability policy; một lỗi làm toàn bộ Release không commit. |
| L04 | Release Package và Revision sau Release | 16 | L03 | Gói chứa manifest, file, metadata, structure và digest; lấy lại đúng gói cũ sau khi có bản mới; Revision tiếp theo không sửa lịch sử cũ. |
| L05 | Demo luồng phát hành và negative paths | 16 | L01–L04 | Cụm bơm được Release trong khi tủ điện vẫn In Work; thiếu dependency, self-approval hoặc scope đổi giữa chừng đều bị chặn có bằng chứng. |

### 4.6 PH5 — Ổn định và áp dụng nội bộ, 88 giờ

| Mã | Công việc | Giờ | Cần trước | Đầu ra và cách biết đã xong |
|---|---|---:|---|---|
| Q01 | Chạy regression Release Spine | 16 | L05 | Kịch bản chuẩn chạy từ tài khoản đến phục hồi Release Package; test tự động và lỗi đã biết được ghim vào đúng build. |
| Q02 | Kiểm tra authorization và security boundary | 12 | Q01 | Gọi API/tải file trái quyền, session bị thu hồi, grant hết hạn/sai endpoint và vượt scope đều bị từ chối; client không chứa secret dài hạn. |
| Q03 | Đo transfer đại diện | 12 | Q01; dữ liệu P05 | Ghi file size, concurrency, đường truyền, tốc độ, retry và tài nguyên; kết quả là evidence của môi trường thử, không suy rộng thành SLA. |
| Q04 | Backup và restore trên môi trường sạch | 16 | Q01 | Khôi phục cùng mốc PostgreSQL, Artifact locations, configuration và key material cần thiết; đối chiếu identity/digest; ghi RPO/RTO đo được. |
| Q05 | Đóng gói và hướng dẫn vận hành | 12 | Q02–Q04 | Có cách cài/cập nhật/rollback được phép, cấu hình môi trường, cảnh báo, account operations và đường xử lý sự cố cho người vận hành ban đầu. |
| Q06 | Cài trên nhiều máy, sửa lỗi chặn và ghi kết quả áp dụng nội bộ | 20 | Q01–Q05 | Diễn tập trước, cài trên 2–5 máy Windows, chạy kịch bản có người quan sát, sửa/retest lỗi chặn và ghi phần đạt/chưa đạt; không tự tuyên bố rollout toàn công ty hoặc bản thương mại. |

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
| 23/09 | D0 / baseline | Người dùng dự án ghi nhận quyết định của Product Decision Authority | Ghim đúng Feature, Spec và Tech đã duyệt; một Vault trong Core v0, ranh giới multi-vault để mở rộng sau |
| 29/09 | MS0 / PG4 | Người dùng dự án; IT/specialist khi quyết định tương ứng cần họ | Cho phép PH1, yêu cầu sửa hoặc giữ `BLOCKED` |
| 13/10 | MS1 | Người dùng dự án | Demo khung chạy; chốt tốc độ thực tế và tính lại PH2–PH5 |
| 30/10 | MS2 | Người dùng dự án; người hỗ trợ nghiệp vụ nếu có | Demo tài liệu lõi và quyền đọc |
| 26/11 | MS3 | Người dùng dự án; người review security/storage phù hợp nếu được giao | Demo Workspace/Checkout/Check-in và ranh giới Vault; reforecast PH4–PH5 |
| 14/12 | MS4 | Người dùng dự án; người nắm quy trình Review/Release | Demo phát hành theo phạm vi và lấy lại lịch sử |
| 31/12 | MS5 | Người dùng dự án và người quan sát được chỉ định | Kết luận Core v0 áp dụng nội bộ đạt phạm vi nào, lỗi/giới hạn nào và bước sau là gì |

## 7. Trace theo nhóm yêu cầu

| Phase | Nhóm yêu cầu chính | V&V trọng tâm |
|---|---|---|
| PH0 | GOV, SEC, OPS và toàn bộ requirement ảnh hưởng first increment | Readiness, baseline, dataset, authority và recovery preparation |
| PH1 | IAM, AUD, SEC, OPS | Account/session, audit correlation, migrations và transfer boundary smoke test |
| PH2 | ID, GOV, UX | Identity, metadata, Generation history, duplicate handling và authorized search |
| PH3 | WS, SEC, OPS, artifact/data contracts | Checkout/Reference/Check-in, idempotency, stale, transfer một Vault và ranh giới mở rộng multi-vault |
| PH4 | STR, LC, GOV | Structure Snapshot, independent Review, Release gate và exact reproduction |
| PH5 | Toàn bộ Release Spine | Regression, authorization, transfer evidence, restore và áp dụng nội bộ có giới hạn |

Chi tiết `REQ-*` và procedure ID phải được chốt trong Spec Kit plan của từng increment. Bảng này
định tuyến, không thay SRS hoặc VVP.

## 8. Cách theo dõi khi thực hiện

Mỗi work package ghi tối thiểu:

| Trường | Cách ghi |
|---|---|
| Status | `NOT-RUN`, `IN-PROGRESS`, `BLOCKED`, `PASS` hoặc `FAIL` theo bằng chứng |
| Planned / actual / remaining hours | Ba số riêng; actual là tổng các phiên làm việc, remaining là ước lượng còn lại và được phép hiệu chỉnh có lý do |
| Blocker | Mô tả, owner, ngày cần xử lý và milestone bị ảnh hưởng |
| Change | Commit/PR/Work Item hoặc change record |
| Test/evidence | Lệnh/kịch bản, môi trường, dữ liệu và kết quả |
| Reforecast | Ngày, nguyên nhân, reserve đã dùng và mốc mới nếu có |

Review tiến độ hằng tuần chỉ cần trả lời: đã xong gì, bằng chứng ở đâu, đang làm gì, bị chặn bởi ai,
ước lượng còn lại thay đổi thế nào và có cần quyết định hay không.

Tracker ghi thời gian theo phiên làm việc: `Bắt đầu/Tiếp tục` mở một phiên, `Dừng tính giờ` đóng
phiên nhưng giữ card ở `IN-PROGRESS`, `Tạm ngưng` chỉ dùng khi có trở ngại thật và `Hoàn thành`
đóng phiên, đặt remaining bằng 0 và yêu cầu bằng chứng. Phiên vượt 8 giờ hoặc đi qua ngày khác phải
được người dùng xác nhận. Sửa giờ phải giữ giá trị trước/sau, lý do và lịch sử; không suy actual từ
khoảng cách giữa ngày bắt đầu và ngày hoàn thành.

## 9. Tài liệu làm căn cứ

- [DOC-07@0.17](../DOC-07-mvp-roadmap-and-delivery-plan.md) — baseline Core v0 23/09–31/12 với 512 giờ task, 88 giờ dự phòng kỹ thuật và 32 giờ đệm vận hành
- [DOC-04 — Software Requirements Specification](../DOC-04-software-requirements-specification.md)
- [DOC-05 — Architecture Description](../DOC-05-architecture-description.md)
- [DOC-06 — Data, Integration and Migration Specification](../DOC-06-data-integration-and-migration-specification.md)
- [DOC-08 — UI/UX and Interaction Specification](../DOC-08-ui-ux-and-interaction-specification.md)
- [VVP](../registers/VVP-core-v0-verification-validation-plan.md)
- [Vault architecture change](../registers/CHG-2026-09-17-multi-location-vault-transfer-architecture.md)
- [Roadmap rebaseline change](../registers/CHG-2026-09-17-technical-pilot-roadmap-rebaseline.md)
- [Core v0 roadmap rebaseline](../registers/CHG-2026-09-21-core-v0-roadmap-rebaseline.md)

## 10. Lịch sử hiệu chỉnh

| Phiên bản | Ngày | Nội dung | Hồ sơ |
|---|---|---|---|
| 0.5 | 17/09/2026 | Baseline 35 work package, 512 giờ và 88 giờ dự phòng; bản trước được giữ trong Git. | `IE-CHG-ROADMAP-TP-001` |
| 0.6 | 17/09/2026 | Sửa nguồn duyệt P01; tách trạng thái và kết quả PG4, thống nhất điều kiện cho phép PH1 theo Constitution; cập nhật liên kết DOC-07@0.14. Giữ nguyên giờ, ngày, scope và dependency. | [IE-CHG-PH0-CORR-001](../registers/CHG-2026-09-17-ph0-readiness-correction.md) |
| 0.7 | 21/09/2026 | Cập nhật lịch forecast: làm thứ Bảy tuần 1, 3, 5; nghỉ tuần 2, 4; giữ nguyên baseline allocation 512 giờ + 88 giờ dự phòng và bổ sung trace 83 ngày / 664 giờ forecast. | [IE-CHG-CALENDAR-TP-001](../registers/CHG-2026-09-21-forecast-calendar-correction.md) |
| 0.8 | 21/09/2026 | Chọn kế hoạch Core v0 23/09–31/12: 512 giờ task, 88 giờ dự phòng kỹ thuật, 32 giờ đệm vận hành; một Vault trong v0, ranh giới multi-vault để mở rộng sau; cập nhật milestone và cách ghi actual qua work session. | [IE-CHG-ROADMAP-CV0-001](../registers/CHG-2026-09-21-core-v0-roadmap-rebaseline.md) |
| 0.9 | 22/09/2026 | Thay ba work package quản lý đã hoàn thành bằng `PLN01`–`PLN03`; giữ 32 giờ PH0, 512 giờ công việc, mốc 31/12 và toàn bộ Feature/Spec/Tech. Ghi nhận 12 giờ thực tế là tiến độ lập kế hoạch, không phải tiến độ code. | [IE-CHG-PLAN-ID-001](../registers/CHG-2026-09-22-planning-card-identity-correction.md) |
