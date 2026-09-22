# IDEA Engineering — Danh sách Kanban CARIO cho Core v0

| Thông tin kiểm soát | Nội dung |
|---|---|
| Stable ID | `IE-PLAN-DEC2026-002-KANBAN` |
| Phiên bản / trạng thái | `0.5` / `Current planning baseline` |
| Loại tài liệu | Danh sách công việc để nhập và theo dõi trên Kanban nội bộ |
| Tài liệu chủ quản | [DOC-07 — IE-PROD-ROADMAP-001@0.17](../DOC-07-mvp-roadmap-and-delivery-plan.md) |
| Kế hoạch áp dụng | `IE-PLAN-DEC2026-003@0.2` |
| Nguồn phân rã | [Phụ lục A](DOC-07-appendix-A-task-breakdown-december-2026.md) và [Gantt](idea-roadmap-december-2026.html) |
| Người chuẩn bị / review | Principal Product Author chuẩn bị; người dùng dự án review |
| Product normativity | `INFORMATIVE`; không tạo Feature, Spec hoặc Tech mới |
| Phân loại | `INTERNAL` |
| Bằng chứng thực hiện | `PLN01`–`PLN03` hoàn thành theo ghi nhận hồi tố được người dùng dự án xác nhận; thực thi sản phẩm và `PG4` vẫn `NOT-RUN` |
| Thay đổi | [IE-CHG-PLAN-ID-001](../registers/CHG-2026-09-22-planning-card-identity-correction.md); predecessor [IE-CHG-ROADMAP-CV0-001](../registers/CHG-2026-09-21-core-v0-roadmap-rebaseline.md) |

Đây là danh sách nhập liệu cho **Kanban CARIO của công ty**, không phải một kế hoạch độc lập. Người
nhận việc có thể đọc trực tiếp từ mục 2. Mỗi card nói rõ mục đích, việc cần làm và điều kiện hoàn
thành. Nếu ngày, số giờ hoặc thứ tự công việc ở đây khác DOC-07/Phụ lục A/Gantt thì phải sửa từ kế
hoạch gốc, không sửa riêng card để che sai lệch.

## 1. Cách dùng với Kanban của công ty

### 1.1 Trạng thái

| Trạng thái trên board | Cách dùng |
|---|---|
| `Chưa bắt đầu` | Card chưa được nhận hoặc công việc cần làm trước chưa hoàn thành. Card mới khởi tạo ở trạng thái này; `PLN01`–`PLN03` là ba ngoại lệ đã hoàn thành trước ngày bắt đầu triển khai chính thức. |
| `Đang thực hiện` | Chỉ card đang được làm thật. Với một người viết code, tối đa **một** card thực hiện ở trạng thái này. |
| `Hoàn thành` | Đầu ra và điều kiện hoàn thành trong card đã được kiểm tra; có link commit/test/evidence khi áp dụng. |
| `Tạm ngưng` | Không thể tiếp tục vì đang chờ quyết định, quyền, môi trường hoặc công việc khác. Phải ghi lý do, người xử lý và mốc bị ảnh hưởng. |
| `Hủy` | Chỉ dùng khi card được loại bỏ hoặc thay thế bằng thay đổi có ghi nhận; không dùng để giấu việc trễ. |
| `Quá hạn` | Cảnh báo do ngày hiện tại vượt hạn mà card chưa hoàn thành. Nếu công cụ tự đưa card vào cột này thì để hệ thống phân loại theo hạn; không chủ động khởi tạo card ở đây. |

Luồng bình thường là:

```text
Chưa bắt đầu → Đang thực hiện → Hoàn thành
                      ├──────→ Tạm ngưng → Đang thực hiện
                      └──────→ Hủy (chỉ khi có lý do được ghi nhận)
```

Board hiện không có cột `Ready` hoặc `Review`. Công việc cần hoàn thành trước và điều kiện bắt đầu
được ghi ngay trong card.
Việc review nằm trong điều kiện hoàn thành hoặc một card mốc riêng; không tự tạo thêm trạng thái
ngoài hệ thống của công ty.

### 1.2 Giới hạn công việc đang làm

- `Đang thực hiện`: tối đa **1 card thực hiện** vì kế hoạch hiện chỉ cam kết một người viết code.
- Card mốc có thể được mở để thu thập ý kiến nhưng không được dùng để lách giới hạn trên.
- Chỉ nhận card khi các card ở cột `Cần trước` đã hoàn thành và mốc mở giai đoạn đã đạt.
- Card tiếp theo ưu tiên theo thứ tự công việc và ngày kế hoạch, không đánh dấu toàn bộ danh sách là ưu tiên cao.

### 1.3 CARIO

| Ký hiệu | Nghĩa dùng trong kế hoạch |
|---|---|
| `A` | Trách nhiệm chính: chịu trách nhiệm cuối cùng về kết quả của card. |
| `R+` | Thực hiện chính: người trực tiếp làm phần lớn công việc khi đã được giao chính thức. |
| `R` | Thực hiện: người cùng thực hiện một phần công việc khi đã được giao chính thức. |
| `C` | Tham vấn: cung cấp ý kiến chuyên môn trước khi chốt kết quả. |
| `I` | Nhận thông tin: được thông báo kết quả hoặc thay đổi có liên quan. |
| `O` | Giám sát: theo dõi tiến độ/rủi ro nhưng không thay người chịu trách nhiệm chính. |

Mã vai trò dùng trong bảng:

| Mã | Người/vai trò thực tế |
|---|---|
| `LEAD` | Người dùng dự án — kỹ sư phần mềm chính, người review và người chịu trách nhiệm thực hiện v0 |
| `PDA` | Sếp — Product Decision Authority cho Feature, Spec và Tech |
| `PROC` | Người quản lý/người anh am hiểu quy trình, không giả định là người viết code |
| `DEV2` | Kỹ sư phần mềm dự bị; hiện chỉ nhận thông tin cho tới khi được giao việc rõ ràng |
| `QLHT` | Phòng Quản lý hệ thống |
| `HTKT` | Phòng Hỗ trợ kỹ thuật |
| `SPEC` | Người review chuyên môn về bảo mật, lưu trữ hoặc định dạng file; hiện chưa chỉ định người cụ thể |
| `PILOT` | Người tham gia quan sát đợt áp dụng nội bộ Core v0; hiện chưa chỉ định |

Quy tắc nguồn lực hiện tại:

- Card thực hiện gán `A = LEAD`. `LEAD` trực tiếp làm trong v0.
- Không gán khống `R+` hoặc `R`. Khi `DEV2` hoặc người khác được giao thật, cập nhật card đó và
  số giờ ước lượng còn lại.
- Nếu phần mềm CARIO bắt buộc có `R+`, chỉ gán `LEAD` thêm vai trò `R+` khi hệ thống cho phép cùng
  một người mang hai vai trò. Không tạo một người thực hiện giả để đủ biểu mẫu.
- Trợ lý soạn tài liệu không phải nguồn lực công ty nên không được đưa vào CARIO.
- `PDA` được thông báo tại các mốc giai đoạn; chỉ card `G-D0` yêu cầu quyết định Feature/Spec/Tech
  của `PDA`. Các mốc kỹ thuật không tạo thêm trục duyệt thứ tư.

### 1.4 Trường cần nhập cho mỗi card

| Trường | Giá trị/cách ghi |
|---|---|
| Tên task | Dùng nguyên tên trong bảng, gồm `[Giai đoạn][Mã card]` để tìm kiếm được. |
| Trạng thái ban đầu | `Chưa bắt đầu`. `PLN01`–`PLN03` đã hoàn thành; card triển khai tiếp theo có thể nhận là `P04` hoặc `P05` khi đúng điều kiện phụ thuộc. |
| Ưu tiên | Dùng giá trị đang được cấu hình trên board công ty; chỉ card đã đủ điều kiện bắt đầu hoặc mốc sắp đến mới được nâng ưu tiên. |
| Thời gian | Tất cả ngày trong bảng thuộc năm 2026. Dùng ngày bắt đầu–hạn trong bảng; AM/PM là nửa ngày kế hoạch, không phải cam kết làm ngoài giờ. |
| Nội dung | Chép mục “Xong khi”; bổ sung link source/commit/test/evidence khi thực hiện. |
| Đơn vị/Ban | Chọn đơn vị thực tế trên hệ thống công ty; tài liệu này không tự đặt tên tổ chức. |
| CARIO | Gán theo sáu cột `A/R+/R/C/I/O`; dấu `—` nghĩa là chưa gán. |

Quan hệ với Gantt: card không có hậu tố dùng chính mã đó làm work package cha; card có hậu tố
`-A/-B` thuộc work package cùng mã sau khi bỏ hậu tố, ví dụ `W04-A` và `W04-B` cùng thuộc `W04`.

### 1.5 Những từ xuất hiện nhiều trên card

| Từ | Hiểu đơn giản |
|---|---|
| `Workspace` | Thư mục làm việc trên máy kỹ sư, nơi chứa file đang sửa hoặc đang tham khảo. |
| `Vault` | Kho do hệ thống quản lý để lưu file; một file có thể có bản sao đã kiểm tra tại nhiều Vault. |
| `Artifact` | Nội dung file thực tế được lưu trong Vault. |
| `Logical Document` | Hồ sơ tài liệu có một mã ổn định; các Revision, Version và Generation là những bản thuộc hồ sơ đó. |
| `Generation` | Bản chụp chính xác của tài liệu sau một lần Check-in; đã tạo thì không sửa lại. |
| `Revision / Version` | Revision là đợt thay đổi lớn của tài liệu; Version là các lần cập nhật bên trong Revision đó. |
| `Document Class` | Loại tài liệu và bộ thông tin/quy tắc áp dụng cho loại đó. |
| `Checkout` | Giữ quyền sửa một tài liệu để người khác không đồng thời ghi thay đổi lên tài liệu đó. |
| `Reference` | Lấy tài liệu về để xem hoặc đối chiếu; không có quyền Check-in thay đổi vào bản gốc. |
| `Check-in` | Gửi thay đổi từ Workspace vào hệ thống và kết thúc quyền giữ sửa khi thành công. |
| `Gateway` | Thành phần nhận hoặc gửi file trực tiếp giữa máy người dùng và Vault; file không phải đi xuyên qua Server nghiệp vụ. |
| `Transfer Grant` | Quyền truyền file tạm thời, chỉ đúng người, đúng file, đúng chiều và đúng nơi nhận. |
| `Audit` | Lịch sử có thể kiểm tra lại: ai làm, làm lúc nào, với dữ liệu nào và kết quả ra sao. |
| `Review / Release` | Review là xem xét một bản cụ thể; Release là phát hành một bộ hồ sơ cụ thể sau khi đủ điều kiện. |
| `Release Package` | Bộ hồ sơ đã phát hành, gồm đúng file, thông tin và cấu trúc đã được xác nhận tại thời điểm phát hành. |
| `Core v0` | Bản nội bộ nhỏ nhưng cài đặt và sử dụng được cho luồng chính; chưa phải rollout toàn công ty hay bản thương mại. |
| `PG4` | Điểm kiểm tra xem tài liệu, môi trường, dữ liệu thử, cách kiểm tra và rủi ro đã đủ để bắt đầu code hay chưa. |

### 1.6 Nguyên tắc dài hạn áp dụng khi làm card liên quan

IDEA DDM vẫn chỉ phục vụ nội bộ trong vài năm tới. Không tạo thêm card bán hàng, thu phí, SaaS,
license server hoặc hỗ trợ khách hàng vào kế hoạch này. Khi một card chạm đúng khu vực liên quan,
người thực hiện phải giữ các nguyên tắc sau trong chính điều kiện hoàn thành của card đó:

- không chép mã nguồn, tài sản hoặc nội dung độc quyền từ sản phẩm tham khảo;
- trước khi đưa dự án, mã, thư viện, SDK, font, icon hoặc bộ chuyển đổi bên ngoài vào IDEA, làm đủ
  [external-source intake](../../../../agents/external-source-intake.md); repo public nhưng chưa có
  license phù hợp chỉ được dùng để tham khảo;
- không viết cứng tên người, phòng ban, một quy trình công ty hoặc một vị trí máy chủ vào logic sản phẩm;
- không âm thầm gửi log, dữ liệu sử dụng hoặc nội dung tài liệu ra ngoài môi trường được duyệt;
- thay đổi database và dữ liệu lưu trữ phải có đường migration, rollback, export và restore phù hợp;
- không ghi lời hứa về bảo mật, tương thích, tốc độ, RPO/RTO hoặc tuân thủ nếu chưa có bằng chứng.

Danh sách đầy đủ và cổng phải qua trước khi làm với khách hàng ngoài công ty nằm tại
[IE-GOV-COMMERCIAL-001](../registers/GOV-future-commercial-readiness.md). Các nguyên tắc này không
thay đổi 53 card, 512 giờ công việc, 88 giờ dự phòng kỹ thuật, 32 giờ đệm vận hành hoặc mốc 31/12.

## 2. Danh sách 53 card thực hiện

### 2.1 PH0 — Lập kế hoạch và sẵn sàng triển khai, 32 giờ

| Card | Tên task nhập Kanban | Giờ | Thời gian | Cần trước | Nội dung ghi trên card |
|---|---|---:|---|---|---|
| `PLN01` | `[PH0][PLN01] Xây dựng và chốt WBS Core v0` | 4 | Hoàn thành 21/09; kế hoạch gốc 23/09 AM | — | **Mục đích:** biến mục tiêu Core v0 thành danh sách công việc có thể giao và theo dõi. **Cần làm:** phân rã công việc thành 35 work package và 53 Delivery Card; ghi giờ, đầu ra, điều kiện hoàn thành và quan hệ phụ thuộc. **Xong khi:** WBS có một bản hiện hành, tổng 512 giờ và không lẫn các việc đã duyệt với việc còn phải làm. |
| `PLN02` | `[PH0][PLN02] Lập Gantt, lịch làm việc và milestone` | 4 | Hoàn thành 21/09; kế hoạch gốc 23/09 AM | PLN01 | **Mục đích:** cho biết công việc diễn ra khi nào và mốc nào chặn giai đoạn tiếp theo. **Cần làm:** xếp WBS theo lịch làm việc Việt Nam, giờ cam kết, quỹ dự phòng và các mốc MS0–MS5. **Xong khi:** Gantt kết thúc ngày 31/12/2026, khớp 512 giờ công việc và 632 giờ tổng quỹ. |
| `PLN03` | `[PH0][PLN03] Thiết lập Kanban CARIO và cơ chế ghi nhận tiến độ` | 4 | Hoàn thành 21/09; kế hoạch gốc 23/09 PM–24/09 AM | PLN02 | **Mục đích:** biến kế hoạch thành các card dễ đọc và có dữ liệu thực tế để Project Management Compiler hiển thị. **Cần làm:** chuẩn bị card, CARIO, trạng thái, tracker, Execution Register và Work Journal. **Xong khi:** có thể chọn card, ghi bắt đầu/dừng/hoàn thành và đọc được actual, remaining, blocker, evidence. |
| `P04` | `[PH0][P04] Chuẩn bị môi trường và cách build, test hệ thống` | 4 | 24/09 PM | PLN03 | **Mục đích:** người phát triển có thể dựng hệ thống theo một cách lặp lại được. **Cần làm:** ghi máy được phép dùng, lệnh build/test, cách lưu cấu hình và mật khẩu, cách cập nhật hoặc quay lại cấu trúc database. **Xong khi:** có hướng dẫn đủ để dựng lại môi trường mà không cài công cụ trái quy định. |
| `P05` | `[PH0][P05] Chuẩn bị dữ liệu và tài khoản dùng để thử` | 4 | 25/09 AM | PLN03 | **Mục đích:** các lần thử dùng cùng một bộ dữ liệu. **Cần làm:** chuẩn bị tài liệu mẫu, file lớn đại diện, hai tài khoản thử, một Vault và danh sách tình huống đúng/sai. **Xong khi:** bộ dữ liệu được đặt tên, quản lý và dùng lại được. |
| `P06` | `[PH0][P06] Chuẩn bị cách quay lui, sao lưu và kiểm tra bảo mật` | 8 | 25/09 PM–28/09 AM | P04, P05 | **Mục đích:** thử nghiệm không làm mất dữ liệu hoặc file đang sửa. **Cần làm:** ghi cách quay lại phiên bản trước, giữ Workspace, khôi phục đồng bộ database với file và phần cần người có chuyên môn bảo mật xem. **Xong khi:** có phương án xử lý rõ cho từng trường hợp thất bại chính. |
| `P07` | `[PH0][P07] Kiểm tra đã đủ điều kiện bắt đầu code chưa` | 4 | 28/09 PM | PLN01, PLN02, PLN03, P04, P05, P06 | **Mục đích:** chỉ bắt đầu khi những điều kiện quan trọng đã rõ. **Cần làm:** kiểm tra tài liệu, phạm vi, môi trường, dữ liệu thử, cách kiểm tra và rủi ro còn lại. **Xong khi:** PG4 được ghi `PASS`, `PASS-WITH-ACTIONS`, `BLOCKED` hoặc `NOT-RUN`, kèm lý do. |

| Card | A | R+ | R | C | I | O |
|---|---|---|---|---|---|---|
| PLN01 | LEAD | — | — | PROC | PDA, DEV2 | — |
| PLN02 | LEAD | — | — | PROC | PDA, DEV2 | — |
| PLN03 | LEAD | — | — | PROC | PDA, DEV2 | — |
| P04 | LEAD | — | — | QLHT, HTKT | DEV2 | PROC |
| P05 | LEAD | — | — | PROC, HTKT | DEV2 | — |
| P06 | LEAD | — | — | QLHT, HTKT, SPEC | DEV2 | PROC |
| P07 | LEAD | — | — | PDA, QLHT, HTKT, SPEC | DEV2 | PROC |

### 2.2 PH1 — Khung hệ thống chạy được, 72 giờ

| Card | Tên task nhập Kanban | Giờ | Thời gian | Cần trước | Nội dung ghi trên card |
|---|---|---:|---|---|---|
| `F01-A` | `[PH1][F01-A] Tạo bộ khung mã nguồn có thể build được` | 8 | 30/09 | P07 | **Mục đích:** có điểm bắt đầu chung cho các phần của hệ thống. **Cần làm:** tạo cấu trúc mã nguồn cho Web, Desktop, Server và các bài test; ghi lệnh build. **Xong khi:** một người khác chạy đúng lệnh và build được toàn bộ bộ khung. |
| `F01-B` | `[PH1][F01-B] Tạo kiểm tra tự động cơ bản và ngăn lộ mật khẩu` | 8 | 01/10 | F01-A | **Mục đích:** phát hiện lỗi sớm và không đưa thông tin bí mật vào mã nguồn. **Cần làm:** tạo các kiểm tra cơ bản, file cấu hình mẫu và bước phát hiện mật khẩu/khóa bị ghi nhầm. **Xong khi:** kiểm tra chạy lặp lại và kho mã nguồn không chứa mật khẩu thật. |
| `F02` | `[PH1][F02] Tạo database và kiểm tra nâng hoặc quay lại cấu trúc dữ liệu` | 12 | 02/10–03/10 AM | F01-B | **Mục đích:** có thể dựng database mới và phục hồi khi cập nhật lỗi. **Cần làm:** tạo các bước cập nhật cấu trúc PostgreSQL, thử dựng database sạch, thử quay lại trong phạm vi cho phép và thêm kiểm tra tình trạng kết nối. **Xong khi:** các bước này chạy được bằng lệnh đã ghi. |
| `F03-A` | `[PH1][F03-A] Tạo tài khoản quản trị ban đầu và chức năng khóa tài khoản` | 8 | 03/10 PM–05/10 AM | F01-B, F02 | **Mục đích:** hệ thống có người quản trị đầu tiên nhưng không mở đăng ký tự do. **Cần làm:** tạo tài khoản quản trị theo quy trình kiểm soát; cho phép tạo và khóa tài khoản; ghi lịch sử thao tác. **Xong khi:** chỉ người có quyền mới quản lý được tài khoản. |
| `F03-B` | `[PH1][F03-B] Làm đăng nhập, đăng xuất và thu hồi phiên làm việc` | 8 | 05/10 PM–06/10 AM | F03-A | **Mục đích:** kiểm soát ai đang sử dụng hệ thống. **Cần làm:** làm đăng nhập, đăng xuất, hết hạn/thu hồi phiên và kiểm tra tài khoản còn được phép dùng hay không. **Xong khi:** phiên bị thu hồi không thể tiếp tục gọi chức năng được bảo vệ. |
| `F04` | `[PH1][F04] Ghi thay đổi nghiệp vụ và lịch sử thao tác trong cùng giao dịch` | 12 | 06/10 PM–07/10 | F02, F03-B | **Mục đích:** biết ai đã làm gì mà không có tình trạng nghiệp vụ thành công nhưng lịch sử bị thiếu. **Cần làm:** cho một lệnh mẫu ghi kết quả và bản ghi Audit bằng cùng mã liên kết giao dịch. **Xong khi:** thành công thì có cả hai; thất bại thì không để lại kết quả dở dang. |
| `F05-A` | `[PH1][F05-A] Cho Server cấp quyền truyền file tạm thời` | 8 | 08/10 | F01-B, F04 | **Mục đích:** file được truyền trực tiếp mà vẫn đúng quyền. **Cần làm:** để Client xin truyền file; Server kiểm tra quyền rồi cấp Transfer Grant ghi rõ người, thao tác, file, chiều truyền và nơi nhận. **Xong khi:** quyền chỉ dùng được đúng phạm vi và thời gian đã cấp. |
| `F05-B` | `[PH1][F05-B] Thử truyền một file trực tiếp đến Vault qua Gateway` | 8 | 09/10 | F05-A | **Mục đích:** chứng minh file không phải đi xuyên qua Server nghiệp vụ. **Cần làm:** truyền một file qua Gateway, kiểm tra file nhận đủ và gửi kết quả về Server. **Xong khi:** Server chỉ ghi thông tin file sau khi kết quả truyền hợp lệ, còn nội dung file đi thẳng tới Vault. |

| Card | A | R+ | R | C | I | O |
|---|---|---|---|---|---|---|
| F01-A | LEAD | — | — | — | DEV2 | PROC |
| F01-B | LEAD | — | — | QLHT | DEV2 | PROC |
| F02 | LEAD | — | — | QLHT | DEV2 | PROC |
| F03-A | LEAD | — | — | QLHT | DEV2 | PROC |
| F03-B | LEAD | — | — | QLHT | DEV2 | PROC |
| F04 | LEAD | — | — | SPEC | DEV2 | PROC |
| F05-A | LEAD | — | — | QLHT, HTKT, SPEC | DEV2 | PROC |
| F05-B | LEAD | — | — | QLHT, HTKT, SPEC | PDA, DEV2 | PROC |

### 2.3 PH2 — Quản lý tài liệu lõi, 96 giờ

| Card | Tên task nhập Kanban | Giờ | Thời gian | Cần trước | Nội dung ghi trên card |
|---|---|---:|---|---|---|
| `C01-A` | `[PH2][C01-A] Tạo loại tài liệu và các trường thông tin` | 8 | 14/10 | F05-B | **Mục đích:** hệ thống biết mỗi loại tài liệu cần lưu thông tin gì. **Cần làm:** tạo một Document Class mẫu, các trường bắt buộc và cách lưu phiên bản cấu hình. **Xong khi:** thay đổi cấu hình mới không làm sai cách hiểu các tài liệu đã tạo trước đó. |
| `C01-B` | `[PH2][C01-B] Tạo mã tài liệu không bị trùng khi nhiều người cùng thao tác` | 8 | 15/10 | C01-A | **Mục đích:** mỗi tài liệu có một mã riêng. **Cần làm:** tạo quy tắc đánh số và thử hai yêu cầu cấp số cùng lúc. **Xong khi:** không có hai tài liệu nhận cùng mã và lỗi không để lại hồ sơ nửa chừng. |
| `C02-A` | `[PH2][C02-A] Tiếp nhận file đã có và cảnh báo tài liệu có thể bị trùng` | 8 | 16/10 | C01-B | **Mục đích:** đưa tài liệu hiện có vào hệ thống mà không tạo trùng âm thầm. **Cần làm:** nhận file vào vùng tạm và tìm những tài liệu có thể là cùng một hồ sơ. **Xong khi:** người dùng thấy danh sách nghi trùng trước khi hệ thống tạo định danh mới. |
| `C02-B` | `[PH2][C02-B] Cho người dùng chọn tạo mới, liên kết hoặc hủy việc tiếp nhận file` | 12 | 17/10–19/10 AM | C02-A | **Mục đích:** quyết định trùng tài liệu phải do người có quyền xác nhận. **Cần làm:** cho phép tạo tài liệu mới, liên kết với tài liệu có sẵn hoặc hủy; ghi vị trí file đã lưu. **Xong khi:** hệ thống không tự gộp hai tài liệu và không để file tạm vô chủ. |
| `C03-A` | `[PH2][C03-A] Tạo tài liệu mới với Revision và Version đầu tiên` | 8 | 19/10 PM–20/10 AM | C02-B | **Mục đích:** tài liệu tạo mới và tài liệu tiếp nhận dùng cùng một cách quản lý. **Cần làm:** tạo Logical Document mới với Revision A và Version 1. **Xong khi:** tài liệu có mã ổn định và mở đúng Revision/Version. |
| `C03-B` | `[PH2][C03-B] Lưu Generation không thể sửa và xem lại lịch sử` | 12 | 20/10 PM–21/10 | C03-A | **Mục đích:** giữ lại chính xác nội dung ở từng lần Check-in. **Cần làm:** tạo Generation mới cho bản được gửi vào hệ thống và cho phép xem lại Generation cũ. **Xong khi:** tạo bản mới không làm thay đổi bất kỳ Generation nào đã có. |
| `C04-A` | `[PH2][C04-A] Tìm và lọc những tài liệu người dùng được phép xem` | 8 | 22/10 | C03-B, F03-B | **Mục đích:** người dùng tìm nhanh nhưng không nhìn thấy tài liệu ngoài quyền. **Cần làm:** tìm theo mã, tên, loại và trạng thái; áp dụng quyền ngay khi lấy kết quả. **Xong khi:** kết quả và tổng số không chứa tài liệu ngoài quyền. |
| `C04-B` | `[PH2][C04-B] Mở đúng Generation mà không làm lộ tài liệu ngoài quyền` | 12 | 23/10–26/10 AM | C04-A | **Mục đích:** mở đúng bản người dùng đã chọn. **Cần làm:** kiểm tra quyền ở trang chi tiết và đường gọi trực tiếp vào hệ thống (API), kể cả khi người dùng nhập thẳng địa chỉ. **Xong khi:** tài liệu hợp lệ mở đúng Generation; truy cập trái quyền bị từ chối và không lộ thông tin. |
| `C05-A` | `[PH2][C05-A] Hoàn thiện luồng tạo, tìm và mở tài liệu trên Web` | 8 | 26/10 PM–27/10 AM | C04-B | **Mục đích:** có một luồng sử dụng hoàn chỉnh trên Web. **Cần làm:** nối các màn hình với Server để người dùng tạo hoặc tiếp nhận, tìm và mở tài liệu. **Xong khi:** luồng chính chạy liên tục mà không cần sửa dữ liệu bằng tay. |
| `C05-B` | `[PH2][C05-B] Hoàn thiện cùng luồng trên Desktop và kiểm tra xuyên suốt` | 12 | 27/10 PM–28/10 | C05-A | **Mục đích:** Web và Desktop dùng cùng quy tắc tài liệu. **Cần làm:** nối luồng trên Desktop và tạo bài test từ Client tới Server/database. **Xong khi:** đường chính chạy được, còn yêu cầu trái quyền bị từ chối lặp lại được. |

| Card | A | R+ | R | C | I | O |
|---|---|---|---|---|---|---|
| C01-A | LEAD | — | — | PROC | DEV2 | — |
| C01-B | LEAD | — | — | PROC | DEV2 | — |
| C02-A | LEAD | — | — | PROC | DEV2 | — |
| C02-B | LEAD | — | — | PROC | DEV2 | — |
| C03-A | LEAD | — | — | PROC | DEV2 | — |
| C03-B | LEAD | — | — | PROC | DEV2 | — |
| C04-A | LEAD | — | — | PROC | DEV2 | — |
| C04-B | LEAD | — | — | PROC | DEV2 | — |
| C05-A | LEAD | — | — | PROC | DEV2 | — |
| C05-B | LEAD | — | — | PROC | PDA, DEV2 | — |

### 2.4 PH3 — Workspace và Checkout/Check-in, 136 giờ

| Card | Tên task nhập Kanban | Giờ | Thời gian | Cần trước | Nội dung ghi trên card |
|---|---|---:|---|---|---|
| `W01-A` | `[PH3][W01-A] Lưu trạng thái thư mục làm việc của kỹ sư` | 8 | 31/10 | C05-B | **Mục đích:** hệ thống biết file nào người dùng đang làm và bắt đầu từ bản nào. **Cần làm:** lưu tài liệu, đường dẫn, Generation nền và trạng thái đã/chưa lưu trong Workspace. **Xong khi:** đóng ứng dụng không làm mất thông tin về công việc đang dở. |
| `W01-B` | `[PH3][W01-B] Mở lại Workspace không mất việc và không lẫn người dùng` | 12 | 02/11–03/11 AM | W01-A | **Mục đích:** công việc cục bộ an toàn qua lần đóng/mở ứng dụng. **Cần làm:** lưu danh sách file của Workspace và ràng buộc nó với đúng người dùng/phiên Windows. **Xong khi:** đúng người mở lại thấy đủ công việc; người khác không điều khiển được Workspace đó. |
| `W02-A` | `[PH3][W02-A] Checkout đúng tài liệu cần sửa` | 8 | 03/11 PM–04/11 AM | W01-B | **Mục đích:** tránh hai người cùng ghi thay đổi vào một tài liệu. **Cần làm:** cho người dùng chọn và xác nhận từng tài liệu cần giữ để sửa. **Xong khi:** Checkout không tự giữ cả cây và tại một thời điểm chỉ có một quyền giữ sửa hợp lệ cho mỗi tài liệu. |
| `W02-B` | `[PH3][W02-B] Mở tài liệu để tham khảo bằng Reference` | 12 | 04/11 PM–05/11 | W02-A | **Mục đích:** kỹ sư có thể lấy tài liệu liên quan về xem mà không khóa người khác. **Cần làm:** tạo chế độ Reference trong Workspace và chặn việc gửi thay đổi lên bản gốc. **Xong khi:** file tham khảo mở được nhưng không thể Check-in vào tài liệu gốc. |
| `W03-A` | `[PH3][W03-A] Cấp quyền truyền file đúng người, đúng file và đúng nơi` | 12 | 06/11–07/11 AM | W02-B, F05-B | **Mục đích:** file truyền trực tiếp tới Vault nhưng không bỏ qua kiểm soát của Server. **Cần làm:** cấp Transfer Grant ghi rõ người dùng, thao tác, file, chiều truyền, nơi nhận và thời hạn. **Xong khi:** grant sai thông tin hoặc hết hạn đều bị từ chối. |
| `W03-B` | `[PH3][W03-B] Truyền file lớn theo từng phần và tiếp tục khi bị gián đoạn` | 12 | 07/11 PM–09/11 | W03-A | **Mục đích:** không phải gửi lại toàn bộ file lớn khi mạng chập chờn. **Cần làm:** chia file thành phần nhỏ, tiếp tục từ phần còn thiếu và kiểm tra mã nội dung sau khi truyền. **Xong khi:** file nhận đủ, đúng nội dung; file thiếu hoặc sai không được công nhận. |
| `W04-A` | `[PH3][W04-A] Kiểm tra toàn bộ điều kiện trước khi Check-in` | 12 | 10/11–11/11 AM | W03-B, C03-B | **Mục đích:** không ghi một bộ thay đổi sai hoặc dở dang. **Cần làm:** kiểm tra lại quyền, Checkout, Generation nền, file và cấu trúc liên quan ngay trước lúc ghi. **Xong khi:** một điều kiện sai làm toàn bộ Check-in bị từ chối và không để lại hồ sơ nửa chừng. |
| `W04-B` | `[PH3][W04-B] Hoàn tất Check-in và bỏ quyền giữ sửa` | 12 | 11/11 PM–12/11 | W04-A | **Mục đích:** gửi thay đổi vào hệ thống và giải phóng tài liệu sau khi thành công. **Cần làm:** nếu có thay đổi thì tạo Generation mới; nếu không đổi thì ghi kết quả `No Change`; kết thúc Checkout đúng phạm vi trong cả hai trường hợp. **Xong khi:** tài liệu không còn bị người dùng giữ sau Check-in thành công. |
| `W05-A` | `[PH3][W05-A] Từ chối bản làm việc đã cũ nhưng giữ file người dùng` | 12 | 13/11–16/11 AM | W04-B | **Mục đích:** không ghi đè thay đổi mới hơn và không làm mất công việc cục bộ. **Cần làm:** phát hiện Generation nền đã cũ, giải thích lý do từ chối và giữ nguyên file trong Workspace. **Xong khi:** không có Generation sai được tạo và người dùng vẫn còn bản mình đã sửa để xử lý tiếp. |
| `W05-B` | `[PH3][W05-B] Gửi lại an toàn sau khi mất phản hồi` | 12 | 16/11 PM–17/11 | W05-A | **Mục đích:** người dùng không biết kết quả vẫn có thể thử lại mà không tạo hai bản. **Cần làm:** dùng cùng mã thao tác để hỏi trạng thái hoặc gửi lại sau khi mất mạng/phản hồi. **Xong khi:** cùng một thao tác chỉ tạo tối đa một Generation và luôn trả về cùng kết quả đã ghi. |
| `W06-A` | `[PH3][W06-A] Cấu hình Vault mà không viết cứng một máy lưu file` | 8 | 18/11 | W03-B, W05-B | **Mục đích:** Core v0 dùng một Vault nhưng không khóa thiết kế vào một máy cụ thể. **Cần làm:** tách định danh Vault, địa chỉ truy cập và vị trí lưu khỏi tài liệu nghiệp vụ; truy cập qua ranh giới Artifact Custody/Gateway đã chọn. **Xong khi:** đổi cấu hình máy hoặc vị trí lưu của Vault không làm đổi mã tài liệu, Generation hay logic Check-in. |
| `W06-B` | `[PH3][W06-B] Kiểm tra đường mở rộng thêm Vault trong tương lai` | 12 | 19/11–20/11 AM | W06-A | **Mục đích:** chứng minh có chỗ mở rộng multi-vault mà chưa xây replication, failover hoặc chọn Vault trong Core v0. **Cần làm:** kiểm tra mô hình định danh và adapter có thể nhận thêm Vault/location; ghi rõ phần chưa triển khai và test ranh giới bằng cấu hình thay thế. **Xong khi:** việc thêm adapter/location sau này không buộc sửa document identity hoặc module nghiệp vụ; chức năng multi-vault vẫn được ghi `NOT-RUN`. |
| `W07` | `[PH3][W07] Trình diễn trọn luồng với hai người dùng và một Vault` | 4 | 20/11 PM | W06-B | **Mục đích:** chứng minh luồng Core v0 hoạt động cùng nhau đúng phạm vi. **Cần làm:** dùng hai tài khoản và hai Workspace để thử Checkout, Reference, Check-in, bản cũ và gửi lại với một Vault được cấu hình. **Xong khi:** file đi trực tiếp giữa Client và Vault; Audit nối được yêu cầu, lần truyền và kết quả; cấu hình không viết cứng một máy lưu file. |

| Card | A | R+ | R | C | I | O |
|---|---|---|---|---|---|---|
| W01-A | LEAD | — | — | HTKT | DEV2 | PROC |
| W01-B | LEAD | — | — | HTKT | DEV2 | PROC |
| W02-A | LEAD | — | — | PROC | DEV2 | — |
| W02-B | LEAD | — | — | PROC | DEV2 | — |
| W03-A | LEAD | — | — | QLHT, HTKT, SPEC | DEV2 | PROC |
| W03-B | LEAD | — | — | QLHT, HTKT, SPEC | DEV2 | PROC |
| W04-A | LEAD | — | — | PROC, SPEC | DEV2 | — |
| W04-B | LEAD | — | — | PROC, SPEC | DEV2 | — |
| W05-A | LEAD | — | — | PROC, SPEC | DEV2 | — |
| W05-B | LEAD | — | — | SPEC | DEV2 | PROC |
| W06-A | LEAD | — | — | QLHT, HTKT, SPEC | DEV2 | PROC |
| W06-B | LEAD | — | — | QLHT, HTKT, SPEC | DEV2 | PROC |
| W07 | LEAD | — | — | QLHT, HTKT, SPEC | PDA, DEV2 | PROC |

### 2.5 PH4 — Review và Release, 88 giờ

| Card | Tên task nhập Kanban | Giờ | Thời gian | Cần trước | Nội dung ghi trên card |
|---|---|---:|---|---|---|
| `L01-A` | `[PH4][L01-A] Lưu cấu trúc sản phẩm và đúng phiên bản từng thành phần` | 8 | 27/11 | W07 | **Mục đích:** biết chính xác bộ phận nào và bản tài liệu nào nằm trong cấu trúc tại một thời điểm. **Cần làm:** lưu cấu trúc, số lượng, vị trí lắp và Generation của từng thành phần. **Xong khi:** mở lại cấu trúc vẫn thấy đúng bộ dữ liệu đã được chụp. |
| `L01-B` | `[PH4][L01-B] Chặn cấu trúc thiếu tài liệu bắt buộc, sai quyền hoặc tạo vòng` | 8 | 30/11 | L01-A | **Mục đích:** không đưa một cấu trúc sai sang review hoặc phát hành. **Cần làm:** kiểm tra thành phần bắt buộc, quyền truy cập và quan hệ vòng. **Xong khi:** lỗi bị chỉ rõ; tài liệu không phải phụ thuộc bắt buộc vẫn được tiếp tục ở trạng thái In Work. |
| `L02-A` | `[PH4][L02-A] Gửi đúng Generation vào vòng review` | 8 | 01/12 | L01-B | **Mục đích:** người review xem đúng nội dung cần duyệt. **Cần làm:** tạo một đợt Review ghi rõ tài liệu, Generation, phạm vi và bộ quy tắc đang áp dụng. **Xong khi:** nội dung của đợt Review không tự đổi theo các lần Check-in sau. |
| `L02-B` | `[PH4][L02-B] Duyệt hoặc từ chối đúng người và không dùng lại kết quả cũ` | 8 | 02/12 | L02-A | **Mục đích:** quyết định review chỉ có giá trị cho đúng bản và đúng người có thẩm quyền. **Cần làm:** kiểm tra vai trò/phạm vi, chặn tự duyệt khi cần độc lập và bỏ hiệu lực quyết định cũ khi nội dung thay đổi. **Xong khi:** bản mới phải được review lại. |
| `L03-A` | `[PH4][L03-A] Cho người dùng xem và xác nhận bộ tài liệu sẽ phát hành` | 8 | 03/12 | L02-B | **Mục đích:** tránh phát hành nhầm hoặc thiếu tài liệu. **Cần làm:** hiển thị mã, tên, Generation, cấu trúc và phụ thuộc bắt buộc trong phạm vi Release. **Xong khi:** người dùng xác nhận rõ một bộ hồ sơ cụ thể trước khi hệ thống ghi Release. |
| `L03-B` | `[PH4][L03-B] Phát hành toàn bộ hoặc không ghi gì nếu có lỗi` | 16 | 04/12–05/12 | L03-A | **Mục đích:** không tạo hồ sơ phát hành thành công dở dang. **Cần làm:** kiểm tra lại quyền, kết quả duyệt, phạm vi, cấu trúc và việc file đã được lưu an toàn ngay trước khi ghi. **Xong khi:** tất cả đạt thì Release được tạo; chỉ một lỗi cũng làm toàn bộ thao tác bị từ chối. |
| `L04` | `[PH4][L04] Tạo gói phát hành có thể lấy lại và mở Revision tiếp theo` | 16 | 07/12–08/12 | L03-B | **Mục đích:** sau này vẫn lấy được đúng bộ hồ sơ đã giao. **Cần làm:** tạo Release Package gồm danh sách file, thông tin tài liệu, cấu trúc và mã kiểm tra; cho phép mở Revision mới để làm tiếp. **Xong khi:** bản mới không làm thay đổi hoặc mất gói đã phát hành trước đó. |
| `L05` | `[PH4][L05] Trình diễn cụm bơm phát hành trước và các trường hợp bị chặn` | 16 | 09/12–10/12 | L01-B, L04 | **Mục đích:** chứng minh phần hoàn thành có thể phát hành độc lập đúng quy tắc. **Cần làm:** Release cụm bơm trong khi tủ điện vẫn In Work; đồng thời thử thiếu phụ thuộc, tự duyệt và thay đổi phạm vi giữa chừng. **Xong khi:** luồng hợp lệ thành công và từng trường hợp sai đều bị chặn có lý do. |

| Card | A | R+ | R | C | I | O |
|---|---|---|---|---|---|---|
| L01-A | LEAD | — | — | PROC | DEV2 | — |
| L01-B | LEAD | — | — | PROC | DEV2 | — |
| L02-A | LEAD | — | — | PROC | DEV2 | — |
| L02-B | LEAD | — | — | PROC | DEV2 | — |
| L03-A | LEAD | — | — | PROC | DEV2 | — |
| L03-B | LEAD | — | — | PROC | DEV2 | — |
| L04 | LEAD | — | — | PROC | DEV2 | — |
| L05 | LEAD | — | — | PROC | PDA, DEV2 | — |

### 2.6 PH5 — Ổn định và áp dụng nội bộ, 88 giờ

| Card | Tên task nhập Kanban | Giờ | Thời gian | Cần trước | Nội dung ghi trên card |
|---|---|---:|---|---|---|
| `Q01` | `[PH5][Q01] Kiểm tra lại toàn bộ luồng từ đăng nhập đến lấy gói phát hành` | 16 | 15/12–16/12 | L05 | **Mục đích:** bảo đảm các chức năng đã làm vẫn hoạt động cùng nhau. **Cần làm:** chạy lại kịch bản chuẩn từ đăng nhập, quản lý tài liệu, Workspace, Review, Release đến lấy lại Release Package. **Xong khi:** kết quả được gắn với đúng phiên bản chạy thử và bộ dữ liệu thử; lỗi đã biết được ghi rõ. |
| `Q02` | `[PH5][Q02] Thử các trường hợp truy cập và tải file trái quyền` | 12 | 17/12–18/12 AM | Q01 | **Mục đích:** chứng minh không thể đi vòng qua quyền trên giao diện. **Cần làm:** gọi thẳng vào hệ thống hoặc tải file bằng tài khoản sai quyền, phiên đã bị thu hồi và Transfer Grant sai/hết hạn. **Xong khi:** tất cả trường hợp trái quyền bị từ chối và Client không chứa mật khẩu/khóa dùng lâu dài. |
| `Q03` | `[PH5][Q03] Đo tốc độ truyền file trong môi trường thử` | 12 | 18/12 PM–19/12 | Q01 | **Mục đích:** có số liệu thật trước khi nói về khả năng truyền file. **Cần làm:** ghi kích thước file, số lượt truyền cùng lúc, đường mạng, tốc độ, số lần gửi lại và tài nguyên máy. **Xong khi:** có bảng kết quả kèm môi trường thử; kết quả này chưa phải cam kết chính thức về tốc độ. |
| `Q04` | `[PH5][Q04] Thử khôi phục database và file trên môi trường sạch` | 16 | 21/12–22/12 | Q01 | **Mục đích:** biết bản sao lưu có thực sự dùng được hay không. **Cần làm:** khôi phục database, các vị trí file, cấu hình và khóa cần thiết về cùng một mốc; so sánh mã tài liệu và mã nội dung file. **Xong khi:** ghi thời gian phục hồi, lượng dữ liệu có thể mất và mọi sai lệch. |
| `Q05` | `[PH5][Q05] Viết hướng dẫn cài đặt, cập nhật và xử lý sự cố` | 12 | 23/12–24/12 AM | Q02, Q03, Q04 | **Mục đích:** người vận hành ban đầu không phải đoán cách chạy hệ thống. **Cần làm:** ghi cách cài, cấu hình, cập nhật, quay lại bản trước, xem cảnh báo, quản lý tài khoản và báo sự cố. **Xong khi:** một người khác có thể làm theo trên môi trường được phép. |
| `Q06-A` | `[PH5][Q06-A] Diễn tập trước đợt áp dụng nội bộ và sửa lỗi chặn` | 12 | 24/12 PM–25/12 | Q01, Q02, Q03, Q04, Q05 | **Mục đích:** không dùng buổi có người dùng thật để tìm lỗi cơ bản. **Cần làm:** diễn tập toàn bộ kịch bản và ưu tiên lỗi có thể làm mất file, sai quyền, sai Generation hoặc sai bộ phát hành. **Xong khi:** lỗi chặn đã được sửa và kiểm tra lại, hoặc phạm vi chưa thể áp dụng được ghi rõ. |
| `Q06-B` | `[PH5][Q06-B] Cài Core v0 trên nhiều máy và ghi kết quả áp dụng nội bộ` | 8 | 28/12 | Q06-A | **Mục đích:** xác nhận bản nhỏ có thể cài và dùng trong phạm vi nội bộ đã chốt. **Cần làm:** cài trên 2–5 máy Windows, chạy kịch bản với người quan sát và ghi phần đạt, chưa đạt, lỗi, giới hạn và bước tiếp theo. **Xong khi:** có báo cáo đúng phạm vi; không gọi đây là rollout toàn công ty hoặc bản thương mại. |

| Card | A | R+ | R | C | I | O |
|---|---|---|---|---|---|---|
| Q01 | LEAD | — | — | PROC, SPEC | DEV2 | — |
| Q02 | LEAD | — | — | QLHT, HTKT, SPEC | DEV2 | PROC |
| Q03 | LEAD | — | — | QLHT, HTKT, SPEC | DEV2 | PROC |
| Q04 | LEAD | — | — | QLHT, HTKT, SPEC | DEV2 | PROC |
| Q05 | LEAD | — | — | QLHT, HTKT | DEV2 | PROC |
| Q06-A | LEAD | — | — | PROC, QLHT, HTKT, SPEC, PILOT | DEV2 | — |
| Q06-B | LEAD | — | — | PROC, QLHT, HTKT, SPEC, PILOT | PDA, DEV2 | — |

## 3. Bảy card quyết định và mốc

Các card này có **0 giờ thực hiện**. Chúng dùng để ghi quyết định hoặc kết quả review tại một ngày
cụ thể, không phải công việc ẩn để cộng thêm giờ.

| Card | Tên task nhập Kanban | Hạn | Cần trước | Nội dung ghi trên card |
|---|---|---|---|---|
| `G-D0` | `[QUYẾT ĐỊNH][D0] Ghi nhận baseline Feature, Spec và Tech đã duyệt` | 23/09 | — | **Cần ghi nhận:** đúng baseline đã được Product Decision Authority duyệt; Core v0 dùng một Vault, còn khả năng nhiều Vault được giữ bằng ranh giới kiến trúc để làm sau. **Xong khi:** nguồn triển khai không còn lẫn với bản cũ. |
| `G-MS0` | `[MỐC][MS0] Kiểm tra và quyết định có bắt đầu PH1 không` | 29/09 | P07, G-D0 | **Cần xem:** phạm vi, tài liệu, môi trường, dữ liệu thử, cách kiểm tra và các việc đang cản trở. **Xong khi:** ghi `PASS`, `PASS-WITH-ACTIONS`, `BLOCKED` hoặc `NOT-RUN`; chỉ hai kết quả đầu cho phép bắt đầu đúng phạm vi PH1. |
| `G-MS1` | `[MỐC][MS1] Xem bộ khung hệ thống chạy và cập nhật lại lịch` | 13/10 | F05-B | **Cần xem:** đăng nhập, Web, Desktop, Server, PostgreSQL và một lần truyền file qua Gateway. **Xong khi:** demo chạy được, phần chưa đạt được ghi rõ và lịch PH2–PH5 được tính lại theo tốc độ thực tế. |
| `G-MS2` | `[MỐC][MS2] Xem luồng tạo, tìm và mở tài liệu` | 30/10 | C05-B | **Cần xem:** tạo hoặc tiếp nhận tài liệu, cấp định danh, lưu Generation, tìm và mở đúng bản theo quyền. **Xong khi:** luồng chính chạy được và truy cập trái quyền bị từ chối. |
| `G-MS3` | `[MỐC][MS3] Xem Checkout, Reference, Check-in và ranh giới Vault` | 26/11 | W07 | **Cần xem:** hai người dùng thử giữ sửa, tham khảo, gửi thay đổi và xử lý bản cũ/mất phản hồi với một Vault; cấu hình và định danh lưu trữ không khóa thiết kế vào một máy duy nhất. **Xong khi:** luồng an toàn được chứng minh và đường mở rộng nhiều Vault vẫn rõ. |
| `G-MS4` | `[MỐC][MS4] Xem Review, Release và lấy lại gói đã phát hành` | 14/12 | L05 | **Cần xem:** đúng Generation được gửi review, người phù hợp duyệt, đúng bộ hồ sơ được Release và gói cũ vẫn lấy lại được. **Xong khi:** luồng hợp lệ thành công và bộ hồ sơ thiếu/sai bị chặn. |
| `G-MS5` | `[MỐC][MS5] Kết luận Core v0 áp dụng nội bộ đạt tới đâu` | 31/12 | Q06-B | **Cần xem:** bằng chứng của kịch bản chuẩn, kiểm tra quyền, truyền file, phục hồi và cài trên nhiều máy Windows. **Xong khi:** ghi rõ phần đạt, chưa đạt, lỗi, giới hạn và việc tiếp theo; không gọi kết quả này là production rollout hoặc bản thương mại. |

| Card | A | R+ | R | C | I | O |
|---|---|---|---|---|---|---|
| G-D0 | PDA | — | — | LEAD, QLHT, HTKT | PROC, DEV2 | LEAD |
| G-MS0 | LEAD | — | — | QLHT, HTKT, SPEC | PDA, DEV2 | PROC |
| G-MS1 | LEAD | — | — | QLHT, HTKT | PDA, DEV2 | PROC |
| G-MS2 | LEAD | — | — | PROC | PDA, DEV2 | — |
| G-MS3 | LEAD | — | — | QLHT, HTKT, SPEC | PDA, DEV2 | PROC |
| G-MS4 | LEAD | — | — | PROC | PDA, DEV2 | — |
| G-MS5 | LEAD | — | — | PROC, QLHT, HTKT, SPEC, PILOT | PDA, DEV2 | — |

## 4. Khi nào được chuyển card sang Hoàn thành?

Card chỉ chuyển sang `Hoàn thành` khi đáp ứng các điểm áp dụng được:

1. Đầu ra trong mục “Xong khi” đã quan sát được trong môi trường được ghi nhận.
2. Test đường chính và đường lỗi trong phạm vi card đã chạy; chưa chạy phải ghi `NOT-RUN`, bị
   chặn phải ghi `BLOCKED`, không tự ghi `PASS`.
3. Mã nguồn, phần cập nhật database, cấu hình và tài liệu liên quan nằm trong cùng một thay đổi để
   người khác có thể review.
4. Card có link commit/PR/Work Item, lệnh hoặc kịch bản test và evidence cần giữ.
5. Không để mật khẩu/khóa bí mật, dữ liệu công ty không được phép hoặc file thử nằm ngoài nơi lưu đã quy định.
6. Có cách quay lại hoặc giữ an toàn dữ liệu/Workspace khi thay đổi thất bại.
7. Công việc tiếp theo và số giờ ước lượng còn lại được cập nhật; nếu một giai đoạn lệch trên 20%
   thì phải tính lại lịch.

## 5. Kiểm tra số lượng và giờ

| Kiểm tra | Kết quả mong đợi |
|---|---:|
| Card thực hiện | 53 |
| Card quyết định/mốc | 7 |
| Tổng card nhập Kanban | 60 |
| Work package cha | 35 |
| Giờ thực hiện | 512 |
| Giờ quyết định/mốc | 0 |
| Dự phòng không tạo thành card | 88 |
| Đệm vận hành không tạo thành card | 32 |
| Tổng quỹ kế hoạch | 632 |

`RES0…RES5` và đệm vận hành không được tạo thành task. Khi thật sự dùng thời gian này, cập nhật
ước lượng còn lại của card bị ảnh hưởng và ghi số giờ, lý do, người chấp thuận và phần phải test lại.

## 6. Thứ tự nhập ban đầu

1. Tạo board/danh sách cho `IDEA DDM — Core v0 2026` theo quy ước nội bộ.
2. Nhập 60 card; đặt `PLN01`–`PLN03` là `Hoàn thành` theo Execution Register, các card còn lại là `Chưa bắt đầu`.
3. Gán `A = LEAD` cho 53 card thực hiện; giữ `R+` và `R` trống cho đến khi có người thật.
4. Nhập ngày, công việc cần trước và CARIO; không tạo card dự phòng.
5. Sau ba card lập kế hoạch đã hoàn thành, `P04` và `P05` là hai card đủ quan hệ phụ thuộc để nhận;
   vì WIP limit bằng 1, chỉ chọn một card làm trước. Các card khác chỉ chuyển `Đang thực hiện` khi
   đã hoàn thành những việc được ghi trong cột `Cần trước`.
6. Sau mỗi mốc, cập nhật ngày dự kiến của các card chưa bắt đầu thay vì sửa lịch sử card đã xong.

Việc nhập card vào hệ thống CARIO của công ty và gán tài khoản thật vẫn `NOT-RUN`. Ba card lập kế
hoạch đã được ghi nhận trong nguồn dữ liệu dự án; trạng thái đó không được hiểu là đã triển khai
phần mềm.
