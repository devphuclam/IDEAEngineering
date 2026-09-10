# IDEA Engineering — Danh sách công việc đến tháng 12/2026

Ngày lập: 05/09/2026. Bản phân rã để review và theo dõi roadmap; chưa phải lệnh bắt đầu code.

| Thông tin kiểm soát | Nội dung |
|---|---|
| Tài liệu chủ quản | [DOC-07 — IE-PROD-ROADMAP-001@0.4](../DOC-07-mvp-roadmap-and-delivery-plan.md) |
| Mã phụ lục / trạng thái | IE-PROD-ROADMAP-001-APP-A — Draft 0.4 |
| Kế hoạch áp dụng | IE-PLAN-DEC2026-001@0.1 — Draft |
| Người chuẩn bị / review | Principal Product Author chuẩn bị; người dùng dự án review |
| Phân loại | INTERNAL |
| Thay đổi và nguồn | [IE-CHG-ROADMAP-001](../registers/CHG-2026-09-05-roadmap-task-integration.md) |

Đây là **phụ lục A của DOC-07**, không phải DOC thứ chín hay một bộ yêu cầu mới. Nội dung task
tiếng Việt được giữ để thuận tiện phân công. DOC-07 giữ kế hoạch tổng hợp và điều kiện chuyển bước;
phụ lục này giữ chi tiết task. [Gantt](idea-roadmap-december-2026.html) là bản minh họa của cùng
kế hoạch. Khi đổi ngày/giờ/phụ thuộc phải đồng bộ cả ba, không duy trì ba lịch độc lập.

## 1. Cách đọc và sử dụng

- Có **56 task công việc**, mỗi task 4–16 giờ; thêm **4 khoản dự phòng**. Mỗi task có đầu ra để kiểm tra, không chỉ có tên công việc.
- Giữ quỹ của Gantt: **676 giờ công việc + 80 giờ dự phòng = 756 giờ**. Đây là phân bổ ban đầu trong quỹ đã đề xuất, chưa phải ước lượng được xác nhận từ tốc độ triển khai thực tế.
- Một mình anh là người code. Trợ lý hỗ trợ soạn, lập trình và kiểm tra nhưng không được tính như một người code thứ hai. Người anh làm cùng hỗ trợ nghiệp vụ/dùng thử trong phạm vi được giao.
- Giờ task gồm phần triển khai, test tập trung, cập nhật tài liệu và chuẩn bị/demo review của anh. Thời gian chờ sếp, IT hoặc reviewer không được bảo đảm bằng số giờ này; vắng người hoặc chờ lâu có thể đẩy lùi lịch.
- UI và test được làm cùng từng tính năng ở B–F. G là hoàn thiện chung và ngôn ngữ; H là kiểm chứng liên thông, môi trường, tải, bảo mật và khôi phục, không phải đến cuối mới bắt đầu test.
- Những task sửa code chỉ được đánh xong khi có ca kiểm tra lỗi trước khi sửa, kết quả kiểm tra sau khi sửa, review phù hợp và tài liệu liên quan được cập nhật. Test trong danh sách này đều là công việc cần làm, chưa phải bằng chứng đã đạt.
- Giữ đủ 14 nhóm tính năng Core v0; không đổi yêu cầu để ép vừa lịch. Tìm kiếm nâng cao, workflow designer đầy đủ, ERP/MRP, đăng nhập công ty, nhiều địa điểm, ECR/ECO đầy đủ và tích hợp sâu thêm CAD vẫn nằm ngoài đợt này theo phạm vi hiện có.
- Bản này chia công việc ở mức roadmap. Các task có thể chia tiếp khi tới increment tương ứng; Spec Kit vẫn quản lý spec/plan/tasks triển khai. Không sửa `specs/003-controlled-documentation` để biến nó thành feature Core.
- Trạng thái khởi tạo của danh sách là **chưa thực hiện theo kế hoạch này**. Tài liệu/prototype đã làm trước được dùng lại làm đầu vào; không vì có trong danh sách mà coi phải làm lại từ đầu.

## 2. Quỹ thời gian và điều kiện giữ mốc

| Khoản | Giờ |
|---|---:|
| Công việc A–I | 676 |
| Dự phòng R01–R04 | 80 |
| Tổng đã phân bổ | **756** |
| Quỹ dự kiến 07/09–31/12: 84 ngày thường × 8 giờ + 11 thứ Bảy × 8 giờ | **760** |
| Chưa phân bổ, ngoài 80 giờ dự phòng | 4 |

Các thứ Bảy dự kiến: 12/09, 19/09, 26/09, 03/10, 10/10, 17/10, 24/10, 07/11, 14/11, 21/11, 28/11 năm 2026. Lịch này chưa trừ ngày nghỉ/lễ, nghỉ phép hoặc công việc phát sinh khác; phải xác nhận lại lịch làm việc trước khi dùng làm cam kết. Nếu chỉ làm 5 ngày/tuần, quỹ là 672 giờ và thiếu 84 giờ so với tổng kế hoạch 756 giờ.

Ngày từng task bên dưới là vị trí dự kiến trong lịch một người làm tuần tự, không phải lịch đã cam kết. “½ đầu / ½ sau” là bốn giờ đầu/cuối của ngày làm việc, không ấn định giờ bắt đầu ca. Lịch tài nguyên tuần tự không có nghĩa mọi task đều có quan hệ kỹ thuật với task ngay trước nó; cột “Cần trước” ghi các điều kiện chính.

**Hai lần phải tính lại:** sau F03 để xác định rủi ro IRONCAD, và sau B06 ngày 30/09 để dùng số giờ thực tế của đợt Core đầu. Nếu một phần vượt quỹ, ghi rõ tác động, dùng dự phòng có theo dõi hoặc đổi dự báo; không bỏ test, tự hạ mức tích hợp hay tự coi gate đã đạt.

## 3. Tổng quan theo nhóm

| Nhóm | Nội dung | Số task | Giờ |
|---|---|---:|---:|
| A | Thiết kế và chuẩn bị | 7 | 48 |
| B | Tài khoản, phân quyền và Audit | 6 | 80 |
| C | Quản lý tài liệu | 6 | 80 |
| D | Workspace, Checkout và Check-in | 8 | 120 |
| E | Cấu trúc, xét duyệt và phát hành | 7 | 100 |
| F | IRONCAD | 7 | 88 |
| G | UI và ba ngôn ngữ | 4 | 40 |
| H | Kiểm chứng và vận hành | 7 | 80 |
| I | Dùng thử và chuẩn bị nghiệm thu | 4 | 40 |
| R | Dự phòng, không tính là tính năng hay task đã giao | 4 khoản | 80 |

## 4. Task theo đúng thứ tự lịch

Giờ trong bảng không bao gồm cộng thêm một khoản test/review giống nhau ở cuối mỗi nhóm; đã tính trong quỹ task. Khi có thay đổi phạm vi, phải sửa ước lượng thay vì giấu phần việc vào dự phòng.

### 4.1. Thiết kế ban đầu — 28 giờ

Dự kiến: 07/09 đến 10/09 (½ đầu) (2026).

| Mã | Công việc | Giờ | Ngày dự kiến | Cần trước | Đầu ra và cách biết đã xong |
|---|---|---:|---|---|---|
| A01 | Xác nhận bộ tài liệu làm căn cứ | 4 | 07/09 → 07/09 (½ đầu) | Tài liệu hiện có | Ghi đúng bản Feature, Spec, Tech đã gửi sếp và quyết định hiện có; đối chiếu thay đổi nội dung thực sự. Không viết lại những phần đã chốt chỉ vì cách diễn đạt khác nhau. |
| A02 | Chốt phần tìm kiếm và cấu hình ban đầu | 8 | 07/09 (½ sau) → 08/09 (½ đầu) | A01 | Có ví dụ tra cứu, phạm vi kết quả theo quyền; danh mục loại tài liệu, trường bắt buộc, đánh số, nhóm/quyền và quy trình ban đầu. Mỗi điểm chưa quyết định có người xử lý. |
| A03 | Chốt dữ liệu thử và điều kiện sử dụng | 8 | 08/09 (½ sau) → 09/09 (½ đầu) | A01 | Có file mẫu, phiên bản Office/CAD, bộ dữ liệu IRONCAD, mức tải cần đo, chính sách tài khoản, lưu giữ và mục tiêu khôi phục. Phân biệt phần đã biết với phần cần IT xác nhận. |
| A04 | Rà thiết kế và chuẩn bị điều kiện kiểm chứng | 8 | 09/09 (½ sau) → 10/09 (½ đầu) | A02, A03 | Rà ranh giới Server, UI và Workspace; chuẩn bị phép thử Check-in, quyền và khôi phục. Gửi sớm nhu cầu môi trường, cài đặt/license, người review và nhóm dùng thử; có phạm vi được phép cho thử IRONCAD. |

### 4.2. Thử IRONCAD sớm — 24 giờ

Dự kiến: 10/09 (½ sau) đến 14/09 (½ đầu) (2026).

| Mã | Công việc | Giờ | Ngày dự kiến | Cần trước | Đầu ra và cách biết đã xong |
|---|---|---:|---|---|---|
| F01 | Khảo sát sớm file IRONCAD và công cụ được phép | 8 | 10/09 (½ sau) → 11/09 (½ đầu) | A04 | Ghi phiên bản file .ics/ứng dụng, khả năng cần đọc, công cụ/license và điều kiện chạy ngoài CAD. Có quyền dùng file mẫu và môi trường thử; thiếu quyền thì báo sớm, không tự cài. |
| F02 | Thử đọc trên bộ file IRONCAD mẫu | 8 | 11/09 (½ sau) → 12/09 (½ đầu) | F01 | Thực hiện phép thử có phạm vi được cho phép, chỉ với công cụ/phiên bản hợp lệ. Lưu kết quả đọc thông tin/cấu trúc hoặc tạo bản xem cần thiết; giữ file gốc, nêu rõ khả năng chưa chứng minh. |
| F03 | Kết luận thử sớm và tác động đến kế hoạch | 8 | 12/09 (½ sau) → 14/09 (½ đầu) | F02 | Có bảng khả năng đạt/chưa đạt, phương án xử lý điểm khó và ước lượng cập nhật. Nếu chưa có đường đáp ứng mức tích hợp sâu, trình quyết định lại; hết 24 giờ không mặc nhiên là đạt. |

### 4.3. Hoàn thiện thiết kế và điều kiện bắt đầu — 20 giờ

Dự kiến: 14/09 (½ sau) đến 16/09 (2026).

| Mã | Công việc | Giờ | Ngày dự kiến | Cần trước | Đầu ra và cách biết đã xong |
|---|---|---:|---|---|---|
| A05 | Cập nhật thiết kế sau thử IRONCAD | 8 | 14/09 (½ sau) → 15/09 (½ đầu) | A04, F03 | Ghi khả năng đạt/chưa đạt trên file thật, ảnh hưởng đến thiết kế và thời gian. Chuẩn bị quyết định cho phần bị ảnh hưởng; không tự hạ mức hỗ trợ sâu thành chỉ lưu/mở file. |
| A06 | Chuẩn bị đợt triển khai đầu tiên | 8 | 15/09 (½ sau) → 16/09 (½ đầu) | A05 | Có phạm vi đợt đầu, yêu cầu liên quan, ca nghiệm thu, kế hoạch test và phục hồi. Khi mở increment Core thì dùng Spec Kit để tạo task triển khai; không dùng lại feature 003 về documentation. |
| A07 | Kiểm tra điều kiện bắt đầu code | 4 | 16/09 (½ sau) → 16/09 | A06; người quyết định/reviewer/IT có mặt khi cần | Có kết quả review và quyết định áp dụng cho đúng phạm vi Feature, Spec, Tech; môi trường và kế hoạch kiểm tra sẵn sàng. Điểm thiếu quyền hoặc review bắt buộc phải được xử lý, không tự cho qua vì tới ngày. |

### 4.4. Dự phòng điều kiện bắt đầu — 16 giờ

Dự kiến: 17/09 đến 18/09 (2026).

**R01 — 16 giờ.** Xử lý việc tồn từ review, thử sớm hoặc điều kiện bắt đầu. Nếu chưa đủ quyền/môi trường/đầu vào thì không bắt đầu B01 chỉ vì hết 16 giờ.

Chỉ ghi số giờ sử dụng khi có việc phát sinh cụ thể. Nếu không cần dùng thì giữ lại quỹ hoặc kéo công việc sau lên sau khi đủ điều kiện; không tạo việc cho đủ giờ.

### 4.5. Tài khoản, phân quyền và Audit — 80 giờ

Dự kiến: 19/09 đến 30/09 (2026).

| Mã | Công việc | Giờ | Ngày dự kiến | Cần trước | Đầu ra và cách biết đã xong |
|---|---|---:|---|---|---|
| B01 | Dựng môi trường chạy và kiểm tra tự động | 12 | 19/09 → 21/09 (½ đầu) | A07 đạt điều kiện | Chạy được Server, database, kho file thử và UI tối thiểu trên môi trường được phép. Có lệnh build/test, quản lý thay đổi database và mẫu kiểm tra từ UI đến Server; không cài thành phần chưa được phép. |
| B02 | Tạo tài khoản quản trị đầu tiên và đăng nhập | 16 | 21/09 (½ sau) → 23/09 (½ đầu) | B01 | Thiết lập admin đầu tiên đúng một lần; admin cấp tài khoản, người dùng kích hoạt, đăng nhập/đăng xuất. Không có đăng ký công khai, mật khẩu mặc định dùng chung hoặc lối tạo admin lại. |
| B03 | Khóa tài khoản và khôi phục đăng nhập | 12 | 23/09 (½ sau) → 24/09 | B02 | Đổi/đặt lại mật khẩu dùng bằng chứng một lần, có hạn; khóa/thu hồi phiên làm phiên cũ mất quyền ở lần truy cập tiếp theo và kiểm tra lại trước khi ghi nhận lệnh. Lịch sử người dùng và bản sửa trên máy được giữ. |
| B04 | Phân quyền theo nhóm, vai trò và trạng thái | 12 | 25/09 → 26/09 (½ đầu) | B02, B03 | Có chính sách được đánh phiên bản, thử cả đường UI và gọi API trực tiếp. Không lộ dữ liệu ngoài phạm vi công ty/quyền; admin tài khoản không tự được xem, duyệt hoặc phát hành tài liệu. |
| B05 | Ghi lịch sử thao tác và thông báo | 16 | 26/09 (½ sau) → 29/09 (½ đầu) | B04 | Lưu người, thời điểm, đối tượng, mã thao tác, chính sách và kết quả. Không sửa/xóa Audit qua quản trị thông thường; thông báo chỉ sinh từ kết quả đã ghi nhận và có thể gửi lại khi lỗi. |
| B06 | Hoàn thiện màn hình quản trị và demo đợt đầu | 12 | 29/09 (½ sau) → 30/09 | B02–B05 | Cấp/khóa/khôi phục tài khoản từ UI; kiểm thử lại đăng nhập, quyền, Audit và việc không được xóa đường khôi phục cuối cùng. Demo cho anh review và cập nhật ước lượng còn lại vào 30/09. |

### 4.6. Quản lý tài liệu — 80 giờ

Dự kiến: 01/10 đến 12/10 (2026).

| Mã | Công việc | Giờ | Ngày dự kiến | Cần trước | Đầu ra và cách biết đã xong |
|---|---|---:|---|---|---|
| C01 | Thiết lập loại tài liệu, trường thông tin và đánh số | 12 | 01/10 → 02/10 (½ đầu) | B06 | Có cấu hình có phiên bản; cấp số đồng thời/gửi lại không trùng, không cấp lại ngoài ý muốn. Thay biểu mẫu hoặc chính sách không làm đổi cách hiểu dữ liệu lịch sử. |
| C02 | Tiếp nhận file có sẵn | 16 | 02/10 (½ sau) → 05/10 (½ đầu) | C01 | Đăng ký tài liệu, lưu file tạm và kiểm tra tên/thông tin/dấu kiểm tra nội dung để cảnh báo trùng; người dùng chọn tạo riêng, liên kết hoặc hủy. Không tự gộp danh tính; dữ liệu tạm chưa là bản chính thức. |
| C03 | Tạo tài liệu mới | 8 | 05/10 (½ sau) → 06/10 (½ đầu) | C02 | Luồng New dùng cùng danh tính, quyền, kho nội dung và quy tắc bản đầu với Store Existing. Tài liệu chưa có nội dung được giữ ở Start, không thể duyệt hoặc phát hành. |
| C04 | Lưu bản đầu và quản lý lịch sử | 16 | 06/10 (½ sau) → 08/10 (½ đầu) | C02, C03, B04, B05 | Có primitive Check-in bản đầu cho một tài liệu với quyền sửa và phạm vi được xác nhận; tạo Revision A, Version 1 và Generation cùng lúc, thành công bỏ giữ. Thử tăng Version/No Change bằng cùng quy tắc sẽ dùng ở D05; không mở đường lưu bỏ qua Checkout. |
| C05 | Tìm và duyệt tài liệu theo quyền | 12 | 08/10 (½ sau) → 09/10 | C04, A02 | Tra được theo các trường/phạm vi đã chốt ở A02; lọc và phân trang cơ bản. Dữ liệu ngoài quyền không xuất hiện trong kết quả, số lượng hay chi tiết trả về. |
| C06 | Hoàn thiện màn hình tài liệu và demo | 16 | 10/10 → 12/10 | C01–C05 | Dùng cây/danh sách, nhập thông tin, xem file và mở đúng bản lịch sử. Thử đổi tên không đổi mã tài liệu, cảnh báo trùng và truy cập sai quyền; demo quản lý tài liệu ngày 12/10. Luồng Workspace nhiều file tiếp tục ở D. |

### 4.7. Workspace, Checkout và Check-in — 120 giờ

Dự kiến: 13/10 đến 29/10 (2026).

| Mã | Công việc | Giờ | Ngày dự kiến | Cần trước | Đầu ra và cách biết đã xong |
|---|---|---:|---|---|---|
| D01 | Dựng Workspace trên Windows | 16 | 13/10 → 14/10 | C06 | UI Desktop dùng cùng hành vi với Web; có manifest theo người/phiên để biết file thuộc tài liệu/bản nào. Giao tiếp UI–Workspace được xác thực; đóng/mở lại không mất bản đang sửa, phiên Windows khác không điều khiển được. |
| D02 | Chọn phạm vi Checkout và Reference | 12 | 15/10 → 16/10 (½ đầu) | D01, C04 | Mở rộng quyền sửa bản đầu thành luồng Workspace: hiển thị root/tài liệu liên quan, xác nhận từng item lấy để sửa hay tham khảo. Ghi đúng người, Workspace, bản nền và hạn giữ; không tự Checkout cả cây. |
| D03 | Tải đúng file và mở bằng Office/CAD | 12 | 16/10 (½ sau) → 17/10 | D02 | Truyền file theo quyền có giới hạn; kiểm tra dấu kiểm tra nội dung trước khi báo sẵn sàng. File sai/hỏng không được mở như bản hợp lệ; dùng liên kết ứng dụng của Windows, không chạy mã IDEA trong Office/CAD. |
| D04 | Nhận biết thay đổi trước Check-in | 16 | 19/10 → 20/10 | D03 | Quét lại toàn bộ file; phân biệt chưa thay đổi, đã sửa có Checkout, đã sửa không có Checkout, thiếu file, bản cũ và chưa xác định. Chỉ xét nội dung đã Save; không dùng nhãn Dirty và không coi mất mạng là bản mới nhất. |
| D05 | Check-in nhiều tài liệu cùng lúc | 16 | 21/10 → 22/10 | D04, C04 | Tái sử dụng quy tắc bản đầu/lịch sử C04; xác nhận phạm vi, kiểm tra lại quyền/bản nền/nội dung/cấu trúc, ghi toàn bộ hoặc không ghi. Thành công kể cả No Change đều bỏ giữ đúng phạm vi; lỗi không làm mất quyền còn hợp lệ. |
| D06 | Xử lý mất mạng, gửi lại và dừng giữa Check-in | 16 | 23/10 → 24/10 | D05 | Dùng cùng mã thao tác để tra/gửi lại kết quả, không tạo thêm bản. Gây lỗi khi truyền, ghi file và commit; không lộ dữ liệu dở dang, đối soát được file tạm, giữ được bản trên máy. |
| D07 | Xử lý bản làm việc đã cũ | 16 | 26/10 → 27/10 | D06 | Chỉ rõ item và bản nền/bản hiện tại; giữ bản sửa riêng trước khi lấy bản mới. Người dùng chọn lấy lại bản mới, áp dụng lại sửa đổi hoặc Save As; xác nhận lại trước Check-in, không tự gộp CAD/Office hay ghi đè. |
| D08 | Gia hạn/khôi phục Checkout và demo hai người | 16 | 28/10 → 29/10 | D02–D07 | Cấu hình hạn giữ/gia hạn; khôi phục cần quyền, lý do và Audit, không bỏ kiểm tra bản nền. Demo hai tài khoản/hai Workspace, sai chủ, hết hạn, offline rồi nối lại và stale; đối chiếu file trước/sau để chứng minh không mất bản sửa. |

### 4.8. Dự phòng luồng file — 16 giờ

Dự kiến: 30/10 đến 02/11 (2026).

**R02 — 16 giờ.** Xử lý lỗi hoặc chậm phát hiện trong luồng Workspace/Check-in trước khi chuyển sang cấu trúc và phát hành.

Chỉ ghi số giờ sử dụng khi có việc phát sinh cụ thể. Nếu không cần dùng thì giữ lại quỹ hoặc kéo công việc sau lên sau khi đủ điều kiện; không tạo việc cho đủ giờ.

### 4.9. Cấu trúc, xét duyệt và phát hành — 100 giờ

Dự kiến: 03/11 đến 17/11 (½ đầu) (2026).

| Mã | Công việc | Giờ | Ngày dự kiến | Cần trước | Đầu ra và cách biết đã xong |
|---|---|---:|---|---|---|
| E01 | Quản lý cấu trúc và tài liệu liên quan | 16 | 03/11 → 04/11 | D08, khép việc ảnh hưởng trong R02 | Có quan hệ/occurrence ổn định và snapshot ghim đúng bản từng tài liệu. Thử nhiều cấp, vòng, thiếu/không đủ quyền và child có bản mới; cấu trúc lịch sử không tự đổi. |
| E02 | Thiết lập quy trình và chính sách có phiên bản | 16 | 05/11 → 06/11 | E01, B04 | Có quy trình ban đầu, trạng thái, đường chuyển và quyền; định nghĩa khác với lần chạy. Đổi chính sách chỉ ảnh hưởng phạm vi được phép, không tự sửa lịch sử; chưa làm workflow designer kéo-thả đầy đủ. |
| E03 | Gửi xét duyệt, duyệt, trả lại và rút xét duyệt | 12 | 07/11 → 09/11 (½ đầu) | E02 | Quyết định gắn đúng bản và phạm vi; người soạn/sửa không tự duyệt hay phát hành theo chính sách ban đầu. Thiếu người đủ quyền hoặc lý do trả lại thì từ chối; sửa nội dung phải quay lại quy trình hợp lệ. |
| E04 | Phát hành đúng phạm vi đã xác nhận | 16 | 09/11 (½ sau) → 11/11 (½ đầu) | E03 | Hiển thị đủ thành phần, kiểm tra lại bản/cấu trúc/phê duyệt/quyền và ngoại lệ hợp lệ tại lúc ghi nhận. Sai một item dừng cả phạm vi; không âm thầm phát hành cả cây. Bằng chứng định dạng bắt buộc còn thiếu thì vẫn chặn. |
| E05 | Xuất và lấy lại bộ hồ sơ đã phát hành | 16 | 11/11 (½ sau) → 13/11 (½ đầu) | E04 | Gói có manifest, file, thông tin, cấu trúc/BOM, dấu kiểm tra và nguồn gốc. Khi bản hiện hành đã thay đổi vẫn lấy lại đúng bộ cũ; đối chiếu gói với Release Record, không dùng bản mới nhất thay thế. |
| E06 | Tạo Revision tiếp theo | 12 | 13/11 (½ sau) → 14/11 | E05 | Từ bản đã Released, tạo Revision mới với Version 1, quy trình mới và bản ghi lý do/nguồn thay đổi. Giữ nguyên bản phát hành trước; nội dung bất biến có thể được dùng lại mà không dùng chung trạng thái sửa. |
| E07 | Hoàn thiện màn hình duyệt/phát hành và kiểm tra liên thông | 12 | 16/11 → 17/11 (½ đầu) | E01–E06 | Chạy từ bộ tài liệu nhiều cấp đến phê duyệt, Release, xuất bộ cũ và Revision mới. Thử self-approval, thiếu quan hệ, bản thay đổi giữa chừng, đổi chính sách và lỗi khi ghi Release; lưu bằng chứng cùng UI. |

### 4.10. Tích hợp IRONCAD — 64 giờ

Dự kiến: 17/11 (½ sau) đến 26/11 (½ đầu) (2026).

| Mã | Công việc | Giờ | Ngày dự kiến | Cần trước | Đầu ra và cách biết đã xong |
|---|---|---:|---|---|---|
| F04 | Xây giao tiếp bổ sung định dạng | 16 | 17/11 (½ sau) → 19/11 (½ đầu) | E07, F03, A05 | Khai báo profile và nguồn gốc phiên bản công cụ; phân biệt lưu/mở file với khả năng đọc sâu. Dùng adapter thử để chứng minh thêm định dạng không phải sửa quy tắc danh tính, Checkout và Release. |
| F05 | Đọc thông tin và cấu trúc IRONCAD | 16 | 19/11 (½ sau) → 21/11 (½ đầu) | F04 | Thực hiện đúng khả năng sâu đã được chốt sau thử sớm; đối chiếu dữ liệu trích xuất với file mẫu. Quan hệ không giải được phải hiện rõ; phần chưa đạt không được trình bày như đã hỗ trợ. |
| F06 | Tạo và quản lý bản xem theo profile | 16 | 21/11 (½ sau) → 24/11 (½ đầu) | F05 | Triển khai khả năng preview/chuyển đổi thuộc profile đã chốt; ghim đúng Generation và phiên bản công cụ. Bản xem là dữ liệu phụ, không thay file gốc; kết quả cũ không được hiển thị như kết quả của bản mới. |
| F07 | Cách ly xử lý file và kiểm chứng IRONCAD | 16 | 24/11 (½ sau) → 26/11 (½ đầu) | F04–F06 | Giới hạn đầu vào/đầu ra, thời gian và tài nguyên theo cấu hình được duyệt. Thử file lỗi, dừng worker, bản lớn và chạy lại; file gốc không đổi. Ghi ma trận khả năng/phiên bản và demo luồng cùng Workspace/phát hành. |

### 4.11. Dự phòng CAD — 16 giờ

Dự kiến: 26/11 (½ sau) đến 28/11 (½ đầu) (2026).

**R03 — 16 giờ.** Xử lý phần tích hợp CAD vượt dự kiến; kiểm tra lại kết quả bị ảnh hưởng trước khi hoàn thiện UI chung.

Chỉ ghi số giờ sử dụng khi có việc phát sinh cụ thể. Nếu không cần dùng thì giữ lại quỹ hoặc kéo công việc sau lên sau khi đủ điều kiện; không tạo việc cho đủ giờ.

### 4.12. UI và ba ngôn ngữ — 40 giờ

Dự kiến: 28/11 (½ sau) đến 04/12 (½ đầu) (2026).

| Mã | Công việc | Giờ | Ngày dự kiến | Cần trước | Đầu ra và cách biết đã xong |
|---|---|---:|---|---|---|
| G01 | Hoàn thiện bố cục chung Web và Desktop | 12 | 28/11 (½ sau) → 30/11 | F07, khép việc ảnh hưởng trong R03 | Rà UI đã xây ở B–F: ở khung kiểm tra 1440×900 xem được danh tính, lệnh chính, bước tiếp và overview không cuộn cả trang; chỉ danh sách cùng loại cuộn, chi tiết mở drawer/modal. Icon có nhãn, trạng thái không chỉ dựa vào màu. |
| G02 | Hoàn thiện Anh–Việt–Nhật | 12 | 01/12 → 02/12 (½ đầu) | G01 | Hoàn thiện bộ nhãn, lỗi, thông báo và trợ giúp đã xây dần; lưu lựa chọn ngôn ngữ, dùng English khi thiếu nhãn. Đổi ngôn ngữ không đổi mã/quyền/quy tắc; đưa bản dịch cho người đủ khả năng review. |
| G03 | Kiểm tra dữ liệu tiếng Việt/Nhật và bộ gõ | 8 | 02/12 (½ sau) → 03/12 (½ đầu) | G02 | Nhập–lưu–tìm–mở lại tên file/thông tin Unicode; thử IME Nhật, ký tự rộng, xuống dòng và font. Giữ nội dung người nhập, không tự dịch dữ liệu nghiệp vụ. |
| G04 | Kiểm tra bàn phím, focus và các bề mặt | 8 | 03/12 (½ sau) → 04/12 (½ đầu) | G03 | Thử cùng luồng trên Web, Desktop và vùng UI Web trong Desktop với ba ngôn ngữ; thao tác bàn phím được, focus đúng khi đóng hộp thoại. Lưu lỗi và kết quả review ngôn ngữ/khả năng tiếp cận, không tự nhận review chuyên môn đã đạt. |

### 4.13. Kiểm chứng và vận hành — 80 giờ

Dự kiến: 04/12 (½ sau) đến 18/12 (½ đầu) (2026).

| Mã | Công việc | Giờ | Ngày dự kiến | Cần trước | Đầu ra và cách biết đã xong |
|---|---|---:|---|---|---|
| H01 | Chạy hồi quy toàn bộ luồng sản phẩm | 12 | 04/12 (½ sau) → 07/12 | G04 | Chạy bộ dữ liệu chuẩn từ tiếp nhận đến lấy lại hồ sơ; kiểm tra liên thông 14 nhóm tính năng và đối chiếu 68 yêu cầu hiện có cùng yêu cầu được bổ sung khi chốt tìm kiếm. Không thay test đã làm ở từng task bằng một lần bấm demo. |
| H02 | Kiểm tra quyền và bảo mật xuyên hệ thống | 12 | 08/12 → 09/12 (½ đầu) | H01 | Thử gọi API/đường tải/xem/xuất trái quyền, phiên bị thu hồi, ranh giới UI–Workspace và phạm vi công ty. Quét gói client để không có mật khẩu database/khóa kho dài hạn; lưu kết quả và xin review đúng phạm vi. |
| H03 | Đo tải và truyền file đại diện | 12 | 09/12 (½ sau) → 10/12 | H02, workload/môi trường A03 được xác nhận | Chạy số người thao tác đồng thời, kích thước file/bộ dữ liệu và ngưỡng đã chốt; đo độ trễ, gián đoạn và chạy lại. Không coi 50–100 tài khoản là 100 người đồng thời; vượt ngưỡng thì ghi lỗi và tính lại. |
| H04 | Thử sao lưu và khôi phục trên môi trường sạch | 16 | 11/12 → 14/12 | H03; vị trí sao lưu và quyền khôi phục được cấp | Khôi phục cùng mốc database, file, cấu trúc, cấu hình/chính sách và thành phần mật mã cần thiết. Đối chiếu mọi Generation thuộc phạm vi thử và dùng lại hồ sơ; đo RPO/RTO theo định nghĩa đã chốt, không lấy việc backup chạy xong làm bằng chứng. |
| H05 | Đóng gói, cài đặt, cập nhật và quay lại bản trước | 12 | 15/12 → 16/12 (½ đầu) | H04; IT xác nhận cách phân phối | Thử bộ cài Server/Desktop theo cách IT cho phép, quản lý cấu hình và thay đổi database. Cập nhật thất bại phải quay lại được theo kịch bản đã kiểm chứng; không làm mất Workspace hay dữ liệu giữ lại. |
| H06 | Viết và chạy thử hướng dẫn vận hành | 8 | 16/12 (½ sau) → 17/12 (½ đầu) | H05 | Hướng dẫn đủ để người được giao cấp/khóa tài khoản, đọc cảnh báo/log, xử lý đầy dung lượng, đối soát dữ liệu tạm và gọi khôi phục. Ghi người phụ trách, người thay thế hoặc phần chưa có người; không mặc định có DevOps. |
| H07 | Review bộ bằng chứng trước dùng thử | 8 | 17/12 (½ sau) → 18/12 (½ đầu) | H01–H06; reviewer và người có thẩm quyền sẵn sàng | Có danh sách test/kết quả, lỗi, hạn chế, phiên bản bộ cài và dữ liệu dùng thử. Hoàn tất review bắt buộc đúng người/phạm vi; chỉ vào pilot khi điều kiện đạt, lỗi nghiêm trọng còn mở thì chưa chuyển bước. |

### 4.14. Dùng thử và chuẩn bị nghiệm thu — 40 giờ

Dự kiến: 18/12 (½ sau) đến 25/12 (½ đầu) (2026).

| Mã | Công việc | Giờ | Ngày dự kiến | Cần trước | Đầu ra và cách biết đã xong |
|---|---|---:|---|---|---|
| I01 | Chuẩn bị buổi dùng thử với dự án đại diện | 8 | 18/12 (½ sau) → 21/12 (½ đầu) | H07 đạt điều kiện; dự án/người dùng/việc sử dụng dữ liệu được phép | Dùng nhóm/người đã thu xếp từ A04; chuẩn bị bản sao được phép của dự án nhỏ, tài khoản/quyền, dữ liệu và hướng dẫn. Không đưa dữ liệu đang dùng chính thức vào thử hoặc coi một người đổi tài khoản là nhiều người dùng đại diện. |
| I02 | Cho người dùng thực hiện công việc thực tế | 12 | 21/12 (½ sau) → 22/12 | I01 | Kỹ sư tiếp nhận, sửa, gửi duyệt; người phù hợp duyệt/phát hành và lấy lại hồ sơ. Ghi chỗ bị vướng, dữ liệu sai và lỗi thao tác; có tình huống mất mạng/bản cũ an toàn, không chỉ chạy happy path. |
| I03 | Sửa lỗi phát hiện trong đợt dùng thử | 12 | 23/12 → 24/12 (½ đầu) | I02 | Ưu tiên lỗi mất dữ liệu, sai quyền, sai bản và luồng không hoàn tất; thêm ca tái hiện, sửa và test lại. Chỉ xử lý trong 12 giờ đã dành; vượt thì sử dụng dự phòng có ghi nhận hoặc tính lại mốc, không âm thầm cắt feature. |
| I04 | Chuẩn bị demo cuối và hồ sơ nghiệm thu | 8 | 24/12 (½ sau) → 25/12 (½ đầu) | I03; kết quả review và thử lại | Tổng hợp phần đã đạt, bằng chứng, lỗi/giới hạn còn lại và hướng dẫn bàn giao. Xin kết luận cho đúng phạm vi sau khi xử lý dự phòng cần thiết; mục tiêu 31/12 là nghiệm thu MVP có điều kiện, không tự cho phép triển khai toàn công ty. |

### 4.15. Dự phòng cuối đợt — 32 giờ

Dự kiến: 25/12 (½ sau) đến 31/12 (½ đầu) (2026).

**R04 — 32 giờ.** Xử lý phát sinh cuối, chạy lại kiểm tra liên quan và hoàn tất kết luận nghiệm thu. Vượt khoản này thì dự báo lại ngày; không tự phát hành khi chưa đạt.

Chỉ ghi số giờ sử dụng khi có việc phát sinh cụ thể. Nếu không cần dùng thì giữ lại quỹ hoặc kéo công việc sau lên sau khi đủ điều kiện; không tạo việc cho đủ giờ.

## 5. Mốc kiểm tra và người cần tham gia

| Mốc mục tiêu | Việc cần thấy | Điều kiện / người tham gia |
|---|---|---|
| 18/09 | A01–A07 và F01–F03: thiết kế, kết quả thử sớm, đợt đầu đủ điều kiện | Anh review; sếp quyết định đúng ba trục Feature/Spec/Tech khi cần; IT/reviewer xử lý phần thuộc thẩm quyền. Đến ngày không thay cho phê duyệt. |
| 30/09 | B01–B06: tài khoản, quyền, Audit và bản demo chạy được | Anh review và dùng giờ thực tế để tính lại phần còn lại. |
| 12/10 | C01–C06: tiếp nhận/tạo, mã và lịch sử, thông tin và tìm tài liệu | Demo qua UI với dữ liệu được phép; chưa gọi đây là hoàn tất Workspace nhiều file. |
| 29/10 | D01–D08: Checkout/Reference, sửa, Check-in, bản cũ, mất mạng | Thử ít nhất hai danh tính/hai Workspace; một người vận hành hai tài khoản chỉ là kiểm thử chức năng có giới hạn. |
| 26/11 | E và F04–F07: hồ sơ phát hành và mức hỗ trợ IRONCAD đã chốt | Chứng minh trên đúng bộ mẫu/phiên bản; nếu chỉ lưu/mở file thì chưa đủ để đạt tích hợp sâu. |
| 18/12 | H01–H07: bộ kiểm chứng, khôi phục và cách vận hành | Người review phù hợp và các điều kiện vào pilot phải đạt; chưa đủ thì chưa dùng thử trên dữ liệu vận hành. |
| 31/12 | I01–I04 cùng việc phát sinh R04: kết luận cho MVP | Có người dùng/dự án đại diện, bằng chứng và quyết định đúng phạm vi. Không đồng nghĩa cho phép triển khai toàn công ty hoặc đạt toàn bộ phạm vi sản phẩm tham chiếu hoặc tuân thủ đầy đủ ISO/IEC. |

Anh phụ trách triển khai và review nội bộ theo phân công hiện có. Sếp quyết định Feature, Spec, Tech; roadmap là phương tiện trình bày và theo dõi, không thêm trục duyệt thứ tư. Khi thiếu chuyên môn hoặc người độc lập ở một bước bắt buộc, trợ lý nêu nhiệm vụ để anh thu xếp; không dùng tên vai trò để coi đã có người.

## 6. Đối chiếu với Feature, yêu cầu và kế hoạch kiểm tra

Đây là liên kết **công việc dự kiến**, không phải trạng thái phần mềm đã đáp ứng. 68 mã yêu cầu hiện có đều được gắn ít nhất một task bên dưới. Phần tìm/duyệt còn cần hoàn thiện yêu cầu ở A02; nếu sinh thêm mã yêu cầu, phải bổ sung liên kết và xem lại giờ.

| Tính năng | Task chính |
|---|---|
| FTR-001 | C02, C03, C06 |
| FTR-002 | C02, C04, C06, E06 |
| FTR-003 | D02, D08 |
| FTR-004 | A03, D01, D03, F07, H03, H05 |
| FTR-005 | C04, D04, D05, D06, H03 |
| FTR-006 | D04, D06, D07, D08 |
| FTR-007 | E01, E04, E07 |
| FTR-008 | E02, E03, E06, E07 |
| FTR-009 | E04, E07 |
| FTR-010 | E05, E07, H04 |
| FTR-011 | A02, A03, B01, B02, B03, B04, B05, B06, E02, H02, H05, H06 |
| FTR-012 | A02, C01, C06 |
| FTR-013 | A03, A05, D03, F01, F02, F03, F04, F05, F06, F07 |
| FTR-014 | A02, C05, C06, G01, G02, G03, G04 |

| Nhóm yêu cầu | Task có trách nhiệm triển khai/kiểm tra |
|---|---|
| REQ-ID | C02, C03, C04, C06 |
| REQ-WS | C04, D02, D03, D04, D05, D06, D07, D08 |
| REQ-STR | E01, E04, E07, F05 |
| REQ-LC | E02, E03, E04, E05, E06, E07 |
| REQ-GOV | B04, C01, C05, E02, H02 |
| REQ-AUD | B05 |
| REQ-FMT | F04, F05, F06, F07 |
| REQ-UX | C06, D01, G01, G04 |
| REQ-LOC | G02, G03, G04 |
| REQ-SEC | D01, D03, F07, H02, H03, H05 |
| REQ-OPS | B05, C02, D06, H03, H04, H05, H06 |
| REQ-IAM | B02, B03, B04, B06, H02 |

| Bộ kiểm tra đã có | Task thực hiện chính |
|---|---|
| VVP-001 — danh tính và bản | C02–C04, C06, D05, E06 |
| VVP-002 — Checkout/Reference và lấy file | D01–D04 |
| VVP-003 — Check-in toàn vẹn và gửi lại | C04, D05–D06 |
| VVP-004 — xung đột và khôi phục quyền sửa | D07–D08 |
| VVP-005 — cấu trúc | E01, E04, E07 |
| VVP-006 — quy trình, Release, Revision | E02–E07 |
| VVP-007 — quyền, cấu hình, Audit | B04–B06, C01, E02, H02 |
| VVP-008 — định dạng và IRONCAD | F01–F07; F01–F03 chỉ là kiểm chứng sớm, không thay chứng minh tích hợp |
| VVP-009 — bố cục và tương tác | UI trong B–F, G01, G04 |
| VVP-010 — ba ngôn ngữ | G02–G04 |
| VVP-011 — bảo mật và cách ly | B02–B05, D01, D03, F07, H02 |
| VVP-012 — dữ liệu tạm và chạy lại phần phụ | B05, D06, H05–H06 |
| VVP-013 — sao lưu/khôi phục | H04–H06 |
| VVP-014 — tải, môi trường, mục tiêu khôi phục | A03, H03–H04 |
| VVP-015 — tài khoản, phiên và quản trị | B02–B06, D08, H02 |

### Liên kết từng task để tiện tách increment

| Task | Yêu cầu hiện có liên quan trực tiếp |
|---|---|
| B02 | REQ-IAM-001, REQ-IAM-002, REQ-IAM-007 |
| B03 | REQ-IAM-003, REQ-IAM-004, REQ-IAM-006 |
| B04 | REQ-GOV-001, REQ-GOV-002, REQ-IAM-005 |
| B05 | REQ-AUD-001, REQ-AUD-002, REQ-OPS-002 |
| B06 | REQ-IAM-001, REQ-IAM-002, REQ-IAM-003, REQ-IAM-004, REQ-IAM-005, REQ-IAM-006, REQ-IAM-007 |
| C01 | REQ-GOV-003, REQ-GOV-004 |
| C02 | REQ-ID-001, REQ-ID-003, REQ-ID-005, REQ-OPS-001 |
| C03 | REQ-ID-003, REQ-ID-006 |
| C04 | REQ-ID-002, REQ-ID-004, REQ-WS-008, REQ-WS-009 |
| C05 | REQ-GOV-002 |
| C06 | REQ-ID-001, REQ-ID-002, REQ-ID-003, REQ-ID-004, REQ-ID-005, REQ-ID-006, REQ-UX-001, REQ-UX-002 |
| D01 | REQ-SEC-003, REQ-UX-001 |
| D02 | REQ-WS-001, REQ-WS-002, REQ-WS-003 |
| D03 | REQ-WS-004, REQ-SEC-002 |
| D04 | REQ-WS-005 |
| D05 | REQ-WS-006, REQ-WS-007, REQ-WS-008, REQ-WS-009, REQ-WS-010 |
| D06 | REQ-WS-007, REQ-WS-012, REQ-OPS-001 |
| D07 | REQ-WS-010, REQ-WS-011 |
| D08 | REQ-WS-010, REQ-WS-011, REQ-WS-012, REQ-WS-013 |
| E01 | REQ-STR-001, REQ-STR-002, REQ-STR-003 |
| E02 | REQ-LC-001, REQ-GOV-005 |
| E03 | REQ-LC-002, REQ-LC-003, REQ-LC-004, REQ-LC-005 |
| E04 | REQ-LC-006, REQ-LC-007, REQ-STR-003 |
| E05 | REQ-LC-008 |
| E06 | REQ-LC-009 |
| E07 | REQ-STR-001, REQ-STR-002, REQ-STR-003, REQ-LC-001, REQ-LC-002, REQ-LC-003, REQ-LC-004, REQ-LC-005, REQ-LC-006, REQ-LC-007, REQ-LC-008, REQ-LC-009 |
| F04 | REQ-FMT-001, REQ-FMT-002, REQ-FMT-003 |
| F05 | REQ-FMT-002, REQ-FMT-003, REQ-STR-001 |
| F06 | REQ-FMT-005 |
| F07 | REQ-FMT-001, REQ-FMT-002, REQ-FMT-003, REQ-FMT-004, REQ-FMT-005, REQ-SEC-004 |
| G01 | REQ-UX-001, REQ-UX-002, REQ-UX-003, REQ-UX-004, REQ-UX-005 |
| G02 | REQ-LOC-001, REQ-LOC-002 |
| G03 | REQ-LOC-003 |
| G04 | REQ-UX-006, REQ-LOC-001, REQ-LOC-002, REQ-LOC-003 |
| H02 | REQ-SEC-001, REQ-SEC-002, REQ-SEC-003, REQ-SEC-004, REQ-GOV-001, REQ-GOV-002, REQ-IAM-004, REQ-IAM-005 |
| H03 | REQ-OPS-005, REQ-SEC-002 |
| H04 | REQ-OPS-003, REQ-OPS-004, REQ-OPS-005 |
| H05 | REQ-SEC-001, REQ-OPS-001, REQ-OPS-003, REQ-OPS-004 |
| H06 | REQ-OPS-001, REQ-OPS-002, REQ-OPS-003, REQ-OPS-004, REQ-OPS-005 |

## 7. Cách theo dõi khi thực hiện

Mỗi lần bắt đầu một task, ghi trạng thái, giờ đã dùng, bằng chứng và việc vướng ngay tại task hoặc Work Item của increment tương ứng. Không tạo thêm một bộ yêu cầu độc lập từ danh sách này.

| Thông tin theo dõi | Cách ghi |
|---|---|
| Trạng thái | Chưa bắt đầu / Đang làm / Chờ đầu vào / Chờ review / Xong |
| Giờ | Dự kiến ban đầu, đã dùng, phần còn lại; ghi riêng khoản dự phòng nếu dùng |
| Kết quả | Link thay đổi, bản demo, kết quả test và tài liệu cập nhật phù hợp task |
| Việc đang vướng | Việc gì, cần ai, ảnh hưởng task sau và thời điểm cần giải quyết |
| Điều kiện đánh Xong | Đạt đầu ra task, có kiểm tra và review phù hợp; không có lỗi nghiêm trọng cản task sau |

**Việc đầu tiên:** làm A01 trong tối đa nửa ngày để xác nhận đúng đầu vào đã nộp, sau đó A02–A04. Không bắt đầu lại tám DOC, không vội dựng toàn bộ Core và không cài công cụ IRONCAD trước khi phạm vi thử được cho phép.

## 8. Tài liệu dùng làm căn cứ

- [Gantt tháng 12/2026 — bản HTML đã cung cấp](idea-roadmap-december-2026.html). Giữ nguyên file này, không sửa trong lần phân rã.
- [DOC-07 — thứ tự quyết định và các điều kiện chuyển bước](../DOC-07-mvp-roadmap-and-delivery-plan.md).
- [Feature — 14 nhóm tính năng](../decision-briefs/FEATURE-001-feature-definition-and-scope.md).
- [DOC-04 — 68 mã yêu cầu hiện có](../DOC-04-software-requirements-specification.md).
- [Spec — hành vi và phần đầu vào cần chốt](../decision-briefs/SPEC-001-product-specification.md).
- [Tech — kiến trúc và TECH-Q-01…08](../decision-briefs/TECH-001-technology-and-architecture-proposal.md).
- [VVP — 15 nhóm kiểm chứng](../registers/VVP-core-v0-verification-validation-plan.md).

Bản ngoài kho dự án được giữ làm nguồn lịch sử; từ lần đồng bộ này, dùng phụ lục trong DOC-07 để theo dõi và cập nhật task.

Bản biên tập trong Human và quyết định của sếp phải được đối chiếu ở A01 khi chốt đầu vào triển khai. Cách viết, tên file hay nhãn phiên bản khác nhau không tự chứng minh thay đổi yêu cầu. Danh sách này không sửa trạng thái duyệt của bất kỳ tài liệu nào.
