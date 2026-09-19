# SPEC-001 — Đặc tả sản phẩm IDEA Engineering Core v0

| Thông tin | Nội dung |
|---|---|
| Mã tài liệu | SPEC-001 |
| Phiên bản / ngày soạn | 0.15 / 19-09-2026 |
| Trạng thái | Draft — successor làm rõ Approval Policy theo hướng Microsoft-style; quyết định PDA cho successor `NOT-RUN` |
| Mục đích | Xác định sản phẩm phải hoạt động thế nào và kiểm tra theo điều kiện nào |
| Phạm vi | 14 nhóm tính năng trong FEATURE-001@0.12; hành vi chuẩn được đối chiếu với DOC-04@0.15 (90 yêu cầu có mã) |
| Người soạn / review | Principal Product Author / người dùng dự án; đã xác nhận hướng phát hành theo cụm, tạo PDF từ CAD, cấu hình workflow, ranh giới phân quyền, danh tính item/folder, BOM là dữ liệu cấu trúc, phạm vi đầu ra phòng ban và policy tự duyệt theo hướng Microsoft-style; bản 0.15 chưa được review toàn bộ |
| Người quyết định | Sếp — Product Decision Authority |
| Kết quả kiểm thử sản phẩm | Chưa thực hiện — NOT-RUN |

## 1. Phạm vi và cách đọc

IDEA Engineering dùng trong nội bộ công ty để quản lý tài liệu thiết kế từ lúc đưa vào hệ thống,
sửa, xét duyệt đến phát hành và tra cứu lại. Người dùng tiếp tục sửa file bằng Office/CAD; IDEA
kiểm soát danh tính tài liệu, các bản đã lưu, quyền sửa, cấu trúc sản phẩm và lịch sử quyết định.

**Feature** quyết định có làm một tính năng hay không. **Spec** quy định tính năng đó phải làm đúng
điều gì. **Tech** lựa chọn cách xây dựng để đáp ứng các quy định đó. Bản này không chọn ngôn ngữ lập
trình, database hoặc bộ công cụ làm giao diện.

Bản 0.5 bổ sung bảy yêu cầu về tài khoản IDEA và làm rõ mục tiêu khôi phục. Bản 0.6 giải quyết
SPEC-OPEN-01: chỉ dùng Version trong Revision và Generation, không dùng Version Sequence. Người dùng
dự án đã xác nhận riêng quy tắc này. Bản 0.7 bổ sung tình huống phát hành cụm bơm trong khi tủ điện
và toàn bộ máy còn đang thiết kế, cùng các trường hợp kiểm tra ở mục 8.1. Bản 0.8 làm rõ cách tạo
PDF/neutral file tự động hoặc thủ công, cách gắn kết quả với đúng Generation CAD nguồn và cách xử
lý khi kết quả cũ hoặc tạo thất bại tại mục 8.2. Bản 0.9 làm rõ nhiều workflow có phiên bản, cách
chọn theo loại tài liệu, các phần được cấu hình và quy trình mặc định tại mục 8.3. Bản 0.10 tách rõ
Identity khỏi Access Policy và quy định JSON chỉ là định dạng nhập/xuất ứng viên cấu hình tại mục
8.4. Bản 0.11 quy định rõ Move/Rename giữ nguyên tài liệu, Create Copy tạo tài liệu mới và folder
không phải đường dẫn lưu file tại mục 8.5. Bản 0.12 phân biệt BOM được quản lý với bản Excel/PDF/CSV,
quy định cách xuất, nhập và kiểm tra tại mục 8.6. Ba yêu cầu REQ-STR-004…006 được bổ sung, nâng tổng
số lên 74. Bản 0.13 làm rõ đầu ra phòng ban dùng các cơ chế tài liệu/cấu trúc/bằng chứng hiện có;
giờ, chi phí, mua hàng, gia công, tiến độ và hoàn thành chỉ là thông tin tham khảo nếu chưa có Feature
và hợp đồng tích hợp được duyệt riêng. Tổng số vẫn là 74 mã REQ. Bản 0.13 chưa được review toàn bộ và
sếp chưa quyết định Spec. Bản 0.15 tách quyền đủ điều kiện khỏi quy tắc Approval Policy: `Approve`
chỉ cho biết ai đủ điều kiện; `AllowSelfApproval` là cấu hình phiên bản, mặc định tắt, không cấp
quyền và không vượt policy khác yêu cầu người duyệt độc lập. `Release` vẫn là quyền riêng. Nội dung
này được ghi tại [IE-CHG-APPROVAL-POLICY-001](../registers/CHG-2026-09-19-approval-policy-self-approval.md).
Mã REQ nối từng yêu cầu với thiết kế và kết quả kiểm thử sau này.

- Cột **Yêu cầu** nêu hành vi sản phẩm phải đáp ứng.
- Cột **Kiểm tra thế nào là đạt?** nêu kết quả cần quan sát; không phải kết quả đã chạy.
- Mặc định các yêu cầu có mức **bắt buộc trong Core v0**, trạng thái Draft. Hai ngoại lệ về mức ưu
  tiên là REQ-UX-006 và REQ-OPS-005 được ghi ngay tại dòng tương ứng.
- Ví dụ giúp giải thích quy tắc, không thay thế quy tắc hoặc bổ sung phạm vi ngoài Feature.
- Những điểm chưa đủ rõ nằm ở mục 10. SPEC-OPEN-01 đã giải quyết; còn bảy điểm mở trong bản brief
  lịch sử. Con số 74 thuộc bản tóm tắt cũ và không đồng nghĩa là successor Spec đã đầy đủ để duyệt:
  một số chi tiết từ tài liệu dữ liệu/giao diện vẫn cần hoàn thiện và liên kết trước khi chốt.

Ngoài phạm vi: tích hợp ERP/MRP tổng quát; chấm công; tính chi phí; mua hàng; điều hành gia công/sản
xuất; quản lý tiến độ dự án; ECR/ECO đầy đủ; workflow designer hoàn chỉnh; đồng bộ nhiều cơ sở, lệnh
quản trị offline, Purge tự động và sản phẩm thương mại. Các giá trị thuộc những nghiệp vụ này vẫn có
thể được giữ làm thông tin tham khảo trong hồ sơ kỹ thuật. Xem đầy đủ tại
[Feature, mục 5](FEATURE-001-feature-definition-and-scope.md#5-những-phần-chưa-đưa-vào-core-v0).

## 2. Người dùng, dữ liệu và trạng thái

### 2.1. Vai trò sử dụng

| Vai trò | Việc được thực hiện khi có quyền | Điều không được mặc nhiên suy ra |
|---|---|---|
| Người soạn / kỹ sư | Đăng ký tài liệu, Checkout, sửa, Check-in và gửi xét duyệt. | Mặc định không tự duyệt; chỉ được tự duyệt nếu Approval Policy Version cho phép và vẫn phải có quyền `Approve`. |
| Người xét duyệt / phê duyệt | Xem đúng bản được gửi; phê duyệt hoặc trả lại theo chính sách. | Một tài khoản bất kỳ không được thay cho người phê duyệt còn thiếu. |
| Người có quyền phát hành | Xác nhận phạm vi và phát hành khi đủ điều kiện. | Không được bỏ qua kiểm tra chỉ vì nút Release đang hiển thị. |
| Người quản trị nghiệp vụ | Quản lý nhóm, quyền, biểu mẫu, đánh số và định nghĩa quy trình. | Quyền quản trị thông thường không cho sửa lịch sử hoặc tự bỏ qua điều kiện độc lập. |
| Người quản trị tài khoản — anh phụ trách ban đầu | Cấp, khóa và hỗ trợ khôi phục tài khoản IDEA. | Không tự được đọc bản vẽ, thay chính sách nghiệp vụ, duyệt hoặc phát hành chỉ nhờ quyền quản trị tài khoản. |
| Người tra cứu / kiểm tra hồ sơ | Xem và xuất dữ liệu trong quyền được cấp, đọc Audit. | Có đường dẫn file không đồng nghĩa có quyền truy cập. |

Trong dự án, anh review tài liệu và sếp quyết định Feature/Spec/Tech. Riêng việc anh quản trị tài
khoản ban đầu đã được xác nhận trong phiên làm rõ Tech; điều đó không tự gán quyền duyệt tài liệu
trong sản phẩm. Danh sách đầy đủ người dùng, quyền và người vận hành lâu dài vẫn cần chốt.

### 2.2. Các khái niệm cần phân biệt

| Khái niệm | Cách hiểu trong Spec này |
|---|---|
| Tài liệu / Logical Document | Một đối tượng được quản lý lâu dài, có mã ổn định; có thể gồm file chính và các file liên quan. Không chỉ là tên file trên Windows. |
| Mã định danh / Document ID | Mã để hệ thống luôn nhận ra đúng tài liệu dù file được đổi tên hoặc chuyển thư mục. |
| Folder/divider tài liệu | Cách tổ chức để người dùng tìm và nhóm tài liệu trong IDEA; không phải thư mục vật lý mà server dùng để lưu file. |
| Vị trí tài liệu / Document Placement | Quan hệ đưa một tài liệu vào folder/divider. Chuyển vị trí hoặc thêm liên kết không tạo một tài liệu mới. |
| Create Copy / Save-As | Lệnh tạo một tài liệu mới từ tài liệu đang có; tài liệu mới nhận Document ID riêng và giữ thông tin về nguồn. |
| Mã nghiệp vụ / Business Number | Số tài liệu theo quy tắc của công ty. Có thể cấu hình cách cấp số; khác Document ID. |
| Revision | Đợt sửa đổi có kiểm soát, ví dụ A rồi B. Revision đã phát hành phải được giữ nguyên khi bắt đầu Revision tiếp theo. |
| Version | Số thứ tự bản nội dung trong một Revision: `1, 2, 3…`. Version bắt đầu từ 1, tăng đúng một đơn vị khi Check-in có thay đổi tạo Generation mới, không tăng khi Check-in không có thay đổi và trở lại 1 khi tạo Revision mới. Không có trường Version Sequence riêng. |
| Generation | Mã của một snapshot bất biến, ví dụ G-0101. Hệ thống tạo Generation khi ghi nhận nội dung đầu tiên, Check-in có thay đổi hoặc tạo bản đầu của Revision mới. Mã này xác định chính xác dữ liệu trong lịch sử, xử lý xung đột, xét duyệt và Release; người dùng không phải tự đặt mã. |
| Product Structure / Structure Snapshot | Product Structure là dữ liệu thành phần và quan hệ của sản phẩm đang được quản lý. Mỗi mốc được công bố thành Structure Snapshot bất biến, giữ đúng từng lần xuất hiện và Generation của thành phần. |
| BOM / BOM View Profile | BOM là bảng xem một Structure Snapshot cho một mục đích cụ thể, ví dụ BOM kỹ thuật hoặc danh sách bàn giao. BOM View Profile quy định cột, lọc, thứ tự và quy tắc hiển thị. BOM không đồng nghĩa với một file Excel hoặc PDF. |
| BOM Representation | File Excel, PDF, CSV hoặc dạng xuất khác được tạo từ đúng một Structure Snapshot và BOM View Profile. Đây là bản xuất để xem/bàn giao, không phải dữ liệu cấu trúc chính thức. |
| BOM Import Candidate | File hoặc dữ liệu được đưa vào để đề nghị thay đổi cấu trúc. Nó chỉ trở thành dữ liệu chính thức sau khi được kiểm tra, xem trước phần thêm/sửa/xóa và xác nhận thành công. |
| Đầu ra phòng ban | Tài liệu, cấu trúc, hồ sơ phát hành hoặc bằng chứng do một phòng ban cung cấp/tiếp nhận. Tên phòng ban cho biết trách nhiệm bàn giao, không tự biến mọi công việc của phòng đó thành tính năng của IDEA. |
| Thông tin tham khảo vận hành | Giờ, chi phí dự kiến, tình trạng mua hàng/gia công, tiến độ hoặc hoàn thành được giữ để hiểu bối cảnh kỹ thuật. Trong Core v0, IDEA không phải nguồn tính toán hay hệ thống giao dịch chính thức cho các nghiệp vụ này. |
| Workspace | Nơi IDEA quản lý các bản làm việc trên máy của một người dùng. File ở đây chưa mặc nhiên là nội dung chính thức trên hệ thống. |
| Checkout / Reference | Checkout lấy quyền sửa trong phạm vi xác nhận; Reference lấy đúng bản để tham khảo mà không có quyền Check-in vào tài liệu đó. |
| Audit | Lịch sử có kiểm soát về người thực hiện, thời điểm, đối tượng, quyết định và kết quả. |

Generation phục vụ việc xác định chính xác dữ liệu. Ví dụ, hồ sơ phát hành đã dùng một mốc G-014 thì
sau này phải lấy lại G-014, không đổi sang G-015 chỉ vì đó là mốc mới nhất. Các mã G-014/G-015 ở đây
chỉ là ví dụ, không quy định cách đánh mã của sản phẩm.

Ví dụ một tài liệu đang ở Revision A:

| Sự kiện | Revision | Version | Generation | Giải thích |
|---|---:|---:|---|---|
| Nội dung đầu tiên được Check-in | A | 1 | G-0100 | Bản nội dung đầu tiên của Revision A. |
| Check-in sau khi sửa | A | 2 | G-0101 | Có thay đổi nên Version tăng 1 và tạo Generation mới. |
| Check-in nhưng không có thay đổi | A | 2 | G-0101 | Không tăng Version, không tạo Generation; Checkout vẫn kết thúc. |
| Tạo Revision mới | B | 1 | G-0102 | Revision đổi sang B, Version bắt đầu lại từ 1 và có baseline bất biến mới. |

Số `0.13` ở đầu tài liệu này là **phiên bản của file Spec**, không phải Version của tài liệu kỹ thuật
đang được IDEA quản lý.

Ba việc dễ nhầm:

| Thao tác | Kết quả |
|---|---|
| Save trong Office/CAD | Lưu phần đang sửa ra file trên máy. Chưa Check-in, chưa phát hành. |
| Check-in | Đưa thay đổi hợp lệ vào hệ thống; nếu thành công hoặc không có thay đổi thì kết thúc Checkout của phạm vi đã xác nhận. |
| Release | Xác nhận phát hành đúng phạm vi đã đủ điều kiện xét duyệt và sử dụng. Không đồng nghĩa với Save hoặc Check-in. |

“Publish” trong một số tài liệu kỹ thuật nguồn là bước ghi nhận bản dữ liệu vào hệ thống, không phải
một lần phát hành nghiệp vụ. Trong luồng người dùng của Core v0, bước lưu thay đổi này được gọi là
Check-in; không thêm một lệnh “Publish” trùng nghĩa vào luồng làm việc.

### 2.3. Trạng thái vòng đời và trạng thái làm việc là hai việc khác nhau

Core v0 cung cấp quy trình mặc định **Start → In Work → Under Review → Released**. Hệ thống có thể
lưu nhiều Workflow Definition có phiên bản. Mỗi loại tài liệu chỉ đến một phiên bản mặc định đang
được phép dùng; người có quyền có thể chọn workflow khác khi chính sách của loại tài liệu cho phép.
Một lần chạy đã bắt đầu luôn giữ nguyên phiên bản workflow và chính sách đã chọn.

Phần cấu hình của Core v0 gồm trạng thái, bước chuyển hợp lệ, vai trò/nhóm thực hiện, số quyết định
cần có, lý do hoặc bằng chứng bắt buộc và thông báo. Có thể quản trị bằng dữ liệu hoặc biểu mẫu có
kiểm tra; chưa cần màn hình kéo-thả. Thay đổi cấu hình tạo phiên bản mới và không tự sửa các quy
trình đang chạy hoặc lịch sử cũ.

| Tình huống | Kết quả cần có |
|---|---|
| Mới đăng ký tài liệu, chưa có bản nội dung hoàn chỉnh | Có thể ở Start và chưa có Generation. |
| Ghi nhận bản nội dung đầu tiên thành công | Chuyển sang In Work theo quy trình ban đầu; không để lộ bản dữ liệu tạo dở. |
| Gửi xét duyệt | Gắn đúng bản tài liệu và phạm vi xét duyệt với quy trình đang áp dụng. |
| Bị trả lại hoặc rút xét duyệt đúng điều kiện | Trở về In Work theo chính sách; lần gửi lại phải xác nhận đúng bản mới. |
| Đủ điều kiện và xác nhận Release | Lưu hồ sơ phát hành cho đúng phạm vi đó. |
| Muốn sửa tài liệu đã phát hành | Tạo Revision tiếp theo; không sửa nội dung của Revision đã phát hành. |

Riêng Checkout và tình trạng file trên máy được theo dõi độc lập. Một file có thể chưa thay đổi,
có thay đổi, bị thiếu hoặc đã cũ so với hệ thống. “Đang chờ người duyệt” không phải lỗi Check-in;
“Có thay đổi” cũng không có nghĩa là được phép ghi đè bản mới hơn.

### 2.4. Bối cảnh sử dụng mới được xác nhận

Dự kiến 50–100 người dùng ở một địa điểm; máy kỹ sư là Windows. Giai đoạn đầu dùng tài khoản IDEA
do quản trị viên cấp, chưa cần nối tài khoản từ phần mềm nội bộ công ty. Anh có thể vận hành server
ban đầu, nhưng chưa có DevOps hoặc người thay thế đã được phân công.

Một bộ tài liệu liên quan được ước lượng hàng trăm MB đến GB. Đây không phải giới hạn một file,
dung lượng toàn kho hoặc số đo tải. Phiên bản Windows/trình duyệt/CAD, quyền cài đặt và số người
thao tác đồng thời phải xác nhận riêng. Mục tiêu khôi phục sơ bộ nằm ở mục 7.2; nguồn câu trả lời
được lưu trong [CHG bối cảnh Tech](../registers/CHG-2026-09-03-tech-context-and-proposal.md).

## 3. Dữ liệu đầu vào, đầu ra và nguyên tắc chung

| Dữ liệu / hồ sơ | Đầu vào hoặc nội dung cần có | Kết quả và điều kiện bảo toàn | Liên kết |
|---|---|---|---|
| Đăng ký tài liệu | File có sẵn hoặc yêu cầu tạo mới; thông tin theo loại tài liệu; nguồn gốc nhập. | Cấp danh tính riêng; giữ nguyên file gốc; cảnh báo khả năng trùng, không tự gộp. | REQ-ID-001/005/006; DOC-06 mục 5 |
| Thông tin tài liệu | Giá trị các trường theo đúng phiên bản biểu mẫu và quy tắc kiểm tra. | Dữ liệu gắn phiên bản quy tắc đã dùng; thiếu/sai thông tin phải được chỉ rõ. | REQ-GOV-003 |
| Bản nội dung / Generation | File và dấu kiểm tra nội dung, thông tin đã kiểm tra, cấu trúc và nguồn tạo dữ liệu. | Mốc bất biến; thay đổi tiếp theo tạo mốc mới, không ghi đè mốc cũ. | REQ-ID-002/004; REQ-WS-008/009 |
| Bộ file làm việc | Danh sách tài liệu, mốc cần lấy, chế độ Checkout/Reference, người dùng và Workspace. | Chỉ báo sẵn sàng sau khi xác minh đúng nội dung tải về. | REQ-WS-001…004 |
| Cấu trúc sản phẩm | Các thành phần, lần xuất hiện, quan hệ và mốc tài liệu cụ thể. | Lưu được đúng Structure Snapshot lịch sử; không âm thầm thay bằng bản mới nhất. | REQ-STR-001…003 |
| BOM được quản lý | Một Structure Snapshot cụ thể và BOM View Profile được chọn; các lần xuất hiện, bản thành phần, số lượng, vị trí và trường theo profile. | Truy vấn lại cho cùng một nguồn/profile phải ra đúng dữ liệu; Excel/PDF/CSV không tự trở thành cấu trúc chính thức. | REQ-STR-004 |
| Bản xuất BOM | Structure Snapshot, BOM View Profile, định dạng đầu ra và người/yêu cầu tạo. | File xuất giữ đúng nguồn, profile, dấu kiểm tra và thông tin tạo; nguồn/profile đổi thì bản cũ vẫn giữ lịch sử nhưng báo `Needs update`. | REQ-STR-005 |
| Dữ liệu đề nghị nhập BOM | Excel/CSV hoặc payload, mốc cấu trúc gốc, mapping và người đề nghị. | Chỉ thay đổi cấu trúc sau khi kiểm tra, xem trước phần thêm/sửa/xóa và xác nhận; lỗi hoặc mốc gốc đã cũ thì không thay đổi một phần. | REQ-STR-006 |
| Hồ sơ xét duyệt | Người tham gia, bản gửi duyệt, phạm vi, phiên bản workflow và chính sách. | Quyết định không tự áp dụng cho bản đã thay đổi. | REQ-LC-001…005 |
| Hồ sơ / gói phát hành | Phạm vi đã xác nhận, quyết định duyệt, file, thông tin, cấu trúc và bằng chứng. | Lấy lại đúng bộ đã phát hành; sai/thiếu một thành phần phải được báo. | REQ-LC-006…008 |
| Lịch sử thao tác | Người thực hiện, thời điểm, thao tác, đối tượng, chính sách và kết quả. | Ghi bổ sung, không cho sửa/xóa bằng quyền quản trị thông thường. | REQ-AUD-001/002 |
| Tài khoản / Actor / phiên đăng nhập | Mã người dùng ổn định, tên đăng nhập, trạng thái tài khoản và phiên; thông tin thiết lập/khôi phục được bảo vệ riêng. | Đổi tên hoặc khóa không sửa lịch sử; bí mật đăng nhập không nằm trong hồ sơ tài liệu/gói phát hành hoặc log. | REQ-IAM-001…007; DOC-06 |
| Folder/divider và vị trí tài liệu | Folder cha/con, divider và quan hệ đặt/liên kết tài liệu; có thể chọn một bản lịch sử cụ thể khi tạo liên kết. | Move/Rename không đổi Document ID; liên kết không nhân đôi file; Create Copy tạo Document ID mới và giữ nguồn gốc. | REQ-ID-007…009; DOC-06 mục 2–3 |
| Đầu ra phòng ban và thông tin tham khảo vận hành | CAD/PDF/software/hướng dẫn/checklist hoặc cấu trúc/bằng chứng bàn giao; có thể kèm giờ, chi phí dự kiến, trạng thái mua hàng/gia công, tiến độ hoặc hoàn thành. | Hồ sơ kỹ thuật đi qua quy tắc tài liệu/cấu trúc/Release hiện có. Giá trị tham khảo gắn đúng định nghĩa và Generation; không tự tạo giao dịch, kết quả tính toán, trạng thái hoàn thành hoặc bước chuyển Workflow/Release. | BR-029; REQ-GOV-003; DOC-06 mục 1, 3–5 |

Tên file, đường dẫn hoặc ngày sửa file không được dùng như bằng chứng tài liệu đã được duyệt.
Lịch sử và nhãn Revision nhập từ kho cũ cần được đối chiếu; không tự coi chúng tương đương lịch sử
phê duyệt trong IDEA. Chuyển đổi hàng loạt dữ liệu cũ nằm ngoài phạm vi hiện tại.

## 4. Yêu cầu chức năng và quy tắc nghiệp vụ

### 4.1. Tiếp nhận và nhận diện tài liệu

Tính năng liên quan: FTR-001, FTR-002. Cách kiểm tra tổng hợp: VVP-001.

| Mã | Yêu cầu | Kiểm tra thế nào là đạt? |
|---|---|---|
| REQ-ID-001 | Hệ thống phải dùng một Document ID ổn định, không phụ thuộc tên file, đường dẫn, mã nghiệp vụ, Revision hoặc Generation. | Đổi tên, chuyển thư mục, Check-in và tạo Revision; Document ID vẫn không đổi và truy được lịch sử. |
| REQ-ID-002 | Hệ thống phải phân biệt Business Revision, Version trong Revision và Generation. Version bắt đầu từ 1 trong mỗi Revision, tăng đúng một lần khi Check-in có thay đổi tạo Generation mới, không tăng khi không có thay đổi và trở lại 1 khi tạo Revision mới. Hệ thống không được lưu hoặc hiển thị thêm một trường Version Sequence cùng nghĩa. | Đối chiếu mô hình dữ liệu, chuyển trạng thái, Audit và giao diện qua bốn trường hợp tại mục 2.2; mỗi trường hợp phải cho đúng Revision, Version và Generation. |
| REQ-ID-003 | Tài liệu ở Start được phép chưa có Generation hoặc mốc làm việc hiện tại; không được gửi duyệt, phát hành hoặc coi là bản tham chiếu đã phát hành khi chưa có bản nội dung hoàn chỉnh. | Tạo tài liệu chưa có nội dung; các thao tác cần bản nội dung bị từ chối; không có Generation rỗng được tạo cho đủ số. |
| REQ-ID-004 | Theo chính sách ban đầu, lần ghi nhận nội dung đầu tiên phải tạo trọn Revision A, Version 1, Generation đầu tiên và mốc làm việc hiện tại trong cùng kết quả thành công. | Gây lỗi trước khi hoàn tất: không có phần tạo dở được xem là bản hợp lệ. Thành công: có đúng một bộ dữ liệu đầu tiên hoàn chỉnh. |
| REQ-ID-005 | Khi tiếp nhận file có sẵn, hệ thống phải kiểm tra thông tin, tên/đường dẫn và dấu kiểm tra nội dung để báo khả năng trùng; người dùng chọn tạo riêng, liên kết hoặc hủy. | Dùng các file trùng tên, trùng nội dung và khác thông tin; có cảnh báo phù hợp, không tự gộp hai danh tính tài liệu. |
| REQ-ID-006 | Tạo mới và tiếp nhận file có sẵn phải dùng cùng mô hình tài liệu/Generation, quyền truy cập, Audit, vòng đời và điều kiện phát hành. | Đi qua cả hai cách tạo; không có đường nào bỏ qua kiểm tra hoặc dùng một kiểu lịch sử riêng. |
| REQ-ID-007 | Hệ thống phải quản lý folder/divider và vị trí tài liệu bằng danh tính và quan hệ riêng, không lấy đường dẫn vật lý của file làm cấu trúc nghiệp vụ. Move hoặc thêm/bỏ liên kết chỉ thay đổi vị trí tổ chức; không tạo Logical Document, Revision, Version hoặc Generation mới. Liên kết đến bản lịch sử phải ghim đúng Revision và Generation đã chọn. | Chuyển một tài liệu giữa các folder, thêm liên kết ở folder khác rồi bỏ liên kết; Document ID và lịch sử không đổi, không có Generation/file trùng. Với liên kết lịch sử, mở lại vẫn ra đúng bản đã chọn sau khi tài liệu có bản mới. |
| REQ-ID-008 | Rename phải giữ nguyên Document ID. Đổi nhãn dùng riêng cho điều hướng chỉ tạo Audit; đổi tên hoặc tiêu đề thuộc Product Definition phải đi qua Checkout/Check-in và tạo Generation theo quy tắc thay đổi nội dung, không ghi đè bản cũ. | Thử cả đổi nhãn điều hướng và đổi tên được kiểm soát: cùng Document ID; trường hợp thứ nhất không tăng Version/Generation, trường hợp thứ hai tạo đúng một Version/Generation mới và giữ bản trước. |
| REQ-ID-009 | Create Copy/Save-As phải tạo một Logical Document với Document ID mới, ghi quan hệ và bản nguồn, đồng thời không kế thừa ngầm quyền giữ sửa, quyết định duyệt hoặc trạng thái Released của nguồn. | Tạo copy từ bản In Work và Released: file mới có Document ID riêng, truy được nguồn; không sửa nguồn, không được coi là đã duyệt/phát hành và chỉ dùng dữ liệu được phép đọc. |

### 4.2. Checkout, Reference và mở file làm việc

Tính năng liên quan: FTR-003, FTR-004, FTR-013. Cách kiểm tra: VVP-002, VVP-004.

| Mã | Yêu cầu | Kiểm tra thế nào là đạt? |
|---|---|---|
| REQ-WS-001 | Trước khi lấy file về Workspace, hệ thống phải cho xem tài liệu gốc và các tài liệu liên quan đã biết, để xác nhận Checkout hoặc Reference cho từng tài liệu; không tự lan quyền sửa xuống tài liệu con. | Chọn các chế độ khác nhau trong một bộ file; chỉ lấy theo phạm vi đã xác nhận. Thay đổi phạm vi phải xác nhận lại. |
| REQ-WS-002 | Mỗi tài liệu chỉ được có một quyền giữ sửa còn hiệu lực, gắn đúng tổ chức, người dùng, Workspace, Generation dự kiến và thời hạn theo chính sách. | Hai người hoặc hai Workspace cùng yêu cầu sửa; không được dùng quyền của người/Workspace khác hoặc tạo hai quyền giữ hợp lệ cho một tài liệu. |
| REQ-WS-003 | Reference phải lấy đúng Generation đã chọn và không cấp quyền Check-in vào tài liệu gốc; giao diện phải phân biệt với Checkout. | Mở được bản tham chiếu được phép xem; thử Check-in phần sửa từ bản này bị từ chối. |
| REQ-WS-004 | Workspace phải kiểm tra đúng Generation và dấu kiểm tra file trước khi báo sẵn sàng; mở bằng ứng dụng Windows liên kết, không chạy mã IDEA bên trong Office/CAD. | File tải thiếu/sai không được báo Ready; có hướng khôi phục. File hợp lệ mở được bằng ứng dụng đã cấu hình mà không cần add-in IDEA. |

### 4.3. Check-in: kiểm tra, ghi nhận và bỏ giữ

Tính năng liên quan: FTR-005, FTR-006. Cách kiểm tra: VVP-002, VVP-003.

Đầu vào là phạm vi người dùng xác nhận, file đã Save, thông tin tài liệu và mốc mà Workspace đã lấy.
Đầu ra là kết quả thành công, không có thay đổi hoặc bị từ chối; tải file lên chưa đồng nghĩa với
Check-in thành công.

| Mã | Yêu cầu | Kiểm tra thế nào là đạt? |
|---|---|---|
| REQ-WS-005 | Trước Check-in, hệ thống phải kiểm tra toàn bộ phạm vi làm việc và phân loại: không thay đổi, có thay đổi khi đang Checkout, thay đổi nhưng không Checkout, thiếu file, bản đã cũ hoặc chưa xác định được. | Bộ dữ liệu có đủ từng tình huống được hiển thị đúng bằng nhãn dễ hiểu; không chỉ kiểm tra file đang chọn. |
| REQ-WS-006 | Người dùng phải xác nhận chính xác phạm vi Check-in; tài liệu liên quan bị sửa nhưng không có Checkout phải được loại khỏi phạm vi hoặc chặn theo chính sách, không được ghi nhận ngầm. | Có file phụ thuộc bị sửa ngoài quyền; hệ thống không ghi nhận file đó. Nếu thay đổi phạm vi, phải cho người dùng xác nhận lại trước khi tiếp tục. |
| REQ-WS-007 | Các tài liệu có thay đổi hợp lệ trong phạm vi đã xác nhận phải được ghi nhận cùng nhau thành một nhóm thay đổi, hoặc không tài liệu nào được ghi nhận. | Gây lỗi ở từng bước nhận file, kiểm tra và hoàn tất; không xuất hiện một phần nhóm thay đổi như thể đã thành công. |
| REQ-WS-008 | Nếu file, thông tin đã chuẩn hóa và cấu trúc không có thay đổi thực chất, Check-in phải trả kết quả “Không có thay đổi”, không tạo thêm Generation/số bản và kết thúc Checkout trong phạm vi xác nhận. | Check-in một bộ không đổi so với bản đã lấy: lịch sử bản không tăng; có kết quả thao tác và không còn giữ các tài liệu trong phạm vi. |
| REQ-WS-009 | Khi Check-in thay đổi thành công, hệ thống phải tạo một Generation cho mỗi tài liệu thay đổi, chuyển mốc làm việc hiện tại tương ứng và kết thúc Checkout đúng phạm vi xác nhận. | So sánh trước/sau: chỉ tài liệu thay đổi có Generation mới; các tài liệu ngoài phạm vi không bị mất quyền giữ hoặc đổi bản. |

Việc so sánh “không thay đổi” không chỉ dựa vào ngày sửa file. Nó xét nội dung file, thông tin được
quản lý và cấu trúc theo quy tắc chuẩn hóa đã áp dụng; dữ liệu tạm, bộ nhớ đệm hoặc bản xem trước
không tự được tính là thay đổi nghiệp vụ.

### 4.4. Bản đã cũ, lỗi quyền và kết quả chưa rõ

Tính năng liên quan: FTR-003, FTR-005, FTR-006. Cách kiểm tra: VVP-003, VVP-004.

| Mã | Yêu cầu | Kiểm tra thế nào là đạt? |
|---|---|---|
| REQ-WS-010 | Hệ thống phải từ chối Check-in khi mốc đã cũ, sai người giữ, sai Workspace, quyền hết hiệu lực/không đủ điều kiện, không được phép hoặc phạm vi sai; không ghi đè hệ thống, xóa hay ghi đè công việc trên máy. | Với từng lỗi, không có dữ liệu chính thức bị đổi; file trên máy còn nguyên. Quyền Checkout còn hợp lệ không tự bị thu hồi vì Check-in thất bại. |
| REQ-WS-011 | Khi có xung đột, hệ thống phải chỉ rõ tài liệu, người giữ nếu người xem được phép biết, Generation đã lấy và hiện tại, phần công việc còn an toàn và các cách xử lý hợp lệ; không tự gộp file CAD/Office. | Người dùng xác định được bản nào đã cũ và có thể chọn lấy bản mới rồi áp dụng lại thay đổi, Save As, thử lại hoặc khôi phục có kiểm soát tùy điều kiện. Không có bước ngầm ghi đè bản trên máy. |
| REQ-WS-012 | Khi gửi lại cùng mã thao tác Check-in, hệ thống phải trả hoặc tiếp tục đúng thao tác đó, không tạo một lần ghi nhận mới. | Mô phỏng mất phản hồi và gửi lại cùng Operation ID; chỉ có tối đa một kết quả cuối cùng và không có Generation/nhóm thay đổi bị tạo trùng. |
| REQ-WS-013 | Thời hạn giữ sửa, gia hạn và khôi phục phải theo chính sách có thể cấu hình; khôi phục cần quyền phù hợp, lý do, Audit và vẫn kiểm tra Generation hiện tại. | Thử hết hạn, gia hạn, khôi phục sai/đúng quyền và bản đã cũ. Không dùng khôi phục để bỏ qua kiểm tra phiên bản; thời hạn cụ thể còn chờ SPEC-OPEN-03. |

Ví dụ: kỹ sư lấy G-014 về máy. Nếu bản hiện tại trên hệ thống đã thành G-015 trước khi Check-in,
hệ thống từ chối dùng G-014 làm nền để ghi đè. Bản kỹ sư đã sửa vẫn được giữ. Người dùng lấy G-015,
so sánh và áp dụng lại phần cần giữ một cách có chủ ý, rồi kiểm tra lại trước khi Check-in.
Đây không phải thao tác tự động gộp hai file.

### 4.5. Cấu trúc sản phẩm, BOM và tài liệu liên quan

Tính năng liên quan: FTR-007, FTR-009, FTR-010. Cách kiểm tra: VVP-005/006/009.

| Mã | Yêu cầu | Kiểm tra thế nào là đạt? |
|---|---|---|
| REQ-STR-001 | Mỗi bản cấu trúc phải giữ nguyên các thành phần/lần xuất hiện/quan hệ và trỏ đến đúng Generation của tài liệu liên quan để có thể dựng lại sau này. | Lưu cấu trúc nhiều cấp, sau đó tạo bản mới ở các tài liệu; mở cấu trúc cũ vẫn ra đúng các mốc và quan hệ ban đầu. |
| REQ-STR-002 | Tài liệu con có bản mới không được tự sửa cấu trúc hoặc hồ sơ phát hành của tài liệu cha; muốn dùng bản con mới phải ghi nhận thay đổi của cha và xét duyệt theo quy tắc. | Tăng bản của tài liệu con; hồ sơ cha cũ không đổi. Chỉ một thay đổi mới có kiểm soát mới ghi nhận việc dùng bản con mới. |
| REQ-STR-003 | Quan hệ bắt buộc bị thiếu, không giải quyết được, không có quyền hoặc phụ thuộc ngoài chưa đáp ứng phải được chỉ rõ và chặn Release, trừ ngoại lệ phát hành được duyệt đúng phạm vi. | Release bị chặn khi thiếu điều kiện. Nếu có ngoại lệ, kiểm tra đủ đối tượng/mốc được áp dụng, người chịu trách nhiệm, lý do, rủi ro, bằng chứng, người duyệt, thời hạn và điều kiện xem xét lại. |
| REQ-STR-004 | BOM phải là bảng xem từ đúng một Structure Snapshot theo BOM View Profile có phiên bản. Mỗi dòng phải giữ được lần xuất hiện, đúng Generation của thành phần, số lượng, vị trí và các trường được cấu hình. Chỉ lưu một file Excel/PDF/CSV không được coi là đã quản lý BOM. | Mở hai profile khác nhau trên cùng một mốc cấu trúc, rồi tạo bản mới cho một thành phần: bảng của mốc cũ vẫn giữ đúng dòng và bản cũ. Tải lên một spreadsheet thông thường không tự tạo hoặc sửa cấu trúc. |
| REQ-STR-005 | Mỗi bản xuất BOM phải ghi đúng Structure Snapshot, phiên bản BOM View Profile, định dạng, dấu kiểm tra file và thông tin tạo. Khi nguồn/profile có bản mới, bản xuất cũ vẫn được giữ nhưng phải báo `Needs update`. Nếu parts list/BOM là một tài liệu độc lập, phải ghi rõ Generation của tài liệu đó và mốc cấu trúc mà nó mô tả; không được tự lấy “bản mới nhất”. | Xuất Excel/PDF, sau đó đổi cấu trúc/profile và kiểm tra lại; file cũ vẫn mở được với nguồn cũ và không được gọi là bản hiện hành. Với tài liệu parts list độc lập, Release/lấy lại hồ sơ phải dùng đúng Generation và quan hệ đã chọn. |
| REQ-STR-006 | Excel/CSV hoặc dữ liệu dùng để nhập BOM chỉ là ứng viên thay đổi. Hệ thống phải kiểm tra schema, mapping, quyền, tham chiếu và mốc cấu trúc gốc; hiển thị phần thêm/sửa/xóa để người dùng xác nhận. Khi chấp nhận, toàn bộ thay đổi phải cùng tạo Structure Snapshot và Generation mới hoặc không thay đổi gì. | Nhập một ứng viên hợp lệ và các ứng viên sai định dạng, thiếu thành phần, không có quyền, dùng mốc gốc đã cũ hoặc gặp lỗi giữa chừng. Chỉ ứng viên hợp lệ đã xác nhận tạo đúng một kết quả hoàn chỉnh; các trường hợp còn lại giữ nguyên cấu trúc cũ. |

Ngoại lệ phát hành không phải nút “bỏ qua lỗi”. Nó là một quyết định có phạm vi và trách nhiệm rõ
ràng; một ngoại lệ của bản trước không tự cho phép phát hành bản sau.

### 4.6. Xét duyệt, phát hành và tạo Revision tiếp theo

Tính năng liên quan: FTR-002, FTR-008, FTR-009, FTR-010, FTR-011. Cách kiểm tra: VVP-006.

| Mã | Yêu cầu | Kiểm tra thế nào là đạt? |
|---|---|---|
| REQ-LC-001 | Hệ thống phải lưu được nhiều định nghĩa workflow có phiên bản, gán một phiên bản mặc định theo loại tài liệu và ghim đúng định nghĩa/chính sách khi bắt đầu một lần chạy. Đổi hoặc kích hoạt phiên bản mới không được diễn giải lại quy trình đang chạy hay lịch sử cũ. | Tạo hai workflow, gán mặc định khác nhau cho hai loại tài liệu rồi kích hoạt phiên bản mới; mỗi lần chạy chọn đúng cấu hình và hồ sơ cũ vẫn áp dụng phiên bản đã ghim, trừ chuyển đổi được duyệt riêng. |
| REQ-LC-002 | Gửi xét duyệt phải xác định đúng Generation và toàn bộ phạm vi; thay đổi nội dung không được thừa hưởng việc duyệt đang chờ của bản trước. | Thực hiện rút xét duyệt hoặc trả lại về In Work theo chính sách, sửa và gửi lại; lần duyệt mới gắn đúng bản mới, không dùng quyết định của bản cũ. |
| REQ-LC-003 | Chính sách mặc định phải có một người phê duyệt đủ điều kiện và độc lập với người soạn/sửa Revision. Một Approval Policy Version về sau có thể bật `AllowSelfApproval`, nhưng tùy chọn này không cấp `Approve`, không vượt policy khác yêu cầu người độc lập và không cấp `Release`. Số người cần quyết định, vai trò/nhóm, điều kiện tự duyệt và quy tắc kết luận phải thuộc phiên bản chính sách, không đóng cứng trong code. | Chính sách mặc định từ chối tự duyệt; policy đã bật rõ ràng chỉ cho phép khi RBAC và business gate đạt; policy xung đột vẫn yêu cầu người khác; lượt đang chạy giữ policy đã ghim; tự duyệt không kéo theo Release. |
| REQ-LC-004 | Quyết định xét duyệt phải lưu người thực hiện, thời điểm, đúng phạm vi/bản, chính sách và lý do theo loại quyết định; trả lại bắt buộc có lý do. | Trả lại mà không có lý do bị từ chối; quyết định hợp lệ truy được đầy đủ thông tin và bản được quyết định. |
| REQ-LC-005 | Khi chưa xác định được người tham gia bắt buộc đủ điều kiện, hoặc workflow thiếu bước chuyển/cấu hình bắt buộc, hệ thống phải chặn khởi tạo, gửi duyệt, phê duyệt hoặc phát hành tại đúng bước và chỉ rõ vai trò hay quy tắc còn thiếu. | Không có người phê duyệt đủ điều kiện hoặc cấu hình bước chuyển không hợp lệ: không tự gán người, bỏ qua bước hay tự nới chính sách để đi tiếp. |
| REQ-LC-006 | Trước Release, người dùng phải xem và xác nhận đúng phạm vi; lúc hoàn tất hệ thống phải kiểm tra lại mọi Generation, cấu trúc, phê duyệt, quyền và ngoại lệ liên quan. | Thay đổi một điều kiện sau lúc xem trước nhưng trước khi hoàn tất; cả phạm vi bị từ chối nếu không còn hợp lệ. |
| REQ-LC-007 | Release phải cùng hoàn tất chuyển trạng thái và tạo một hồ sơ phát hành bất biến cho phạm vi đã xác nhận; không phát hành một phần hoặc tự thêm tài liệu ngoài phạm vi. | Gây lỗi tại từng bước; không có hồ sơ thành công dở dang. Thành công chỉ bao gồm phạm vi được xác nhận. |
| REQ-LC-008 | Gói hồ sơ phát hành phải có danh sách thành phần, thông tin được quản lý, cấu trúc/BOM, file, dấu kiểm tra nội dung và nguồn gốc của đúng lần phát hành. | Xuất rồi đối chiếu từng thành phần với hồ sơ phát hành; không thiếu file, sai mốc hoặc âm thầm lấy bản hiện tại thay bản lịch sử. |
| REQ-LC-009 | Tạo Revision mới phải giữ nguyên Revision và hồ sơ đã phát hành, tạo Revision tiếp theo với quy trình mới và bản đầu số 1; được dùng lại nội dung bất biến nhưng không dùng chung trạng thái có thể sửa. | Sau khi sửa Revision mới, bản đã phát hành vẫn nguyên vẹn; phân biệt được quy trình cũ/mới và kiểm tra đúng nội dung được dùng lại. |

### 4.7. Quyền, quy trình, thông tin tài liệu và đánh số

Tính năng liên quan: FTR-008, FTR-011, FTR-012. Cách kiểm tra: VVP-007.

| Mã | Yêu cầu | Kiểm tra thế nào là đạt? |
|---|---|---|
| REQ-GOV-001 | Mỗi danh tính, cấu hình chính sách, trạng thái và hồ sơ Audit phải thuộc đúng một tổ chức quản lý; không cho truy cập chéo ngoài quyền. | Thử dữ liệu của hai tổ chức giả lập: không đọc, sửa hoặc tham chiếu trái phép sang tổ chức kia. Đây là kiểm thử cách ly dữ liệu, không phải bổ sung sản phẩm thương mại nhiều khách hàng. |
| REQ-GOV-002 | Phân quyền phải dùng Access Policy đã được kích hoạt và có phiên bản. Quyền thông thường được cấp qua nhóm/vai trò và xét thêm loại/phạm vi, trạng thái tài liệu cùng hành động; thay đổi nhân sự bằng Membership thay vì sửa từng tài liệu. Không đóng cứng tên vai trò trong code và không coi role/claim đăng nhập là toàn bộ quyền sản phẩm. Quyền gán thẳng cho một Actor chỉ được dùng như ngoại lệ có phạm vi, lý do, thời hạn và Audit. Mọi đường truy cập phải nhận cùng quyết định từ Server; JSON chỉ là dữ liệu ứng viên để nhập/xuất, không tự có hiệu lực. | Thêm/bỏ một người khỏi nhóm làm thay đổi đúng quyền từ mốc có hiệu lực mà không sửa code hay từng tài liệu. Quyền trực tiếp thiếu phạm vi/lý do/thời hạn bị từ chối. Sửa JSON trên máy, tự thay role/claim ở phía client hoặc bỏ qua giao diện không tạo thêm quyền. |
| REQ-GOV-003 | Biểu mẫu thông tin, phân loại, quy tắc kiểm tra và đánh số phải có định danh và phiên bản; dữ liệu đã lưu gắn đúng phiên bản đã dùng, không tự đổi khi kích hoạt biểu mẫu mới. Giờ, chi phí dự kiến, tình trạng mua hàng/gia công, tiến độ hoặc hoàn thành nếu được cấu hình hoặc lưu trong tài liệu chỉ là thông tin tham khảo vận hành, trừ khi một Feature và hợp đồng nguồn có thẩm quyền được phê duyệt riêng. Sự hiện diện của các giá trị này không tự tính toán, tạo giao dịch hoặc làm Workflow/Release chuyển trạng thái. | Đổi định nghĩa trường hoặc quy tắc; dữ liệu cũ giữ nguyên và truy được định nghĩa cũ. Lưu một bộ giá trị tham khảo và tài liệu liên quan: người dùng tra cứu được đúng bối cảnh, nhưng hệ thống không tạo kết quả chi phí/mua hàng/gia công, không đánh dấu sản phẩm/dự án hoàn thành và không tự chuyển vòng đời. Chuyển dữ liệu sang định nghĩa mới là thao tác riêng có kiểm soát. |
| REQ-GOV-004 | Mã nghiệp vụ phải duy nhất trong phạm vi được cấu hình, cấp lại cùng yêu cầu không tạo số trùng hoặc số mới ngoài ý muốn, và khác Document ID. | Cấp số đồng thời và gửi lại yêu cầu; không trùng số. Xử lý hủy hoặc khoảng trống số đúng chính sách đã chọn, không tự mặc định. |
| REQ-GOV-005 | Thay đổi chính sách quan trọng phải tạo phiên bản mới áp dụng cho các lần sử dụng sau; chuyển hồ sơ đang có sang quy tắc mới cần xem trước, phê duyệt và Audit. Cấu hình nhập vào phải được kiểm tra cấu trúc, ý nghĩa, tham chiếu và quyền kích hoạt; bản lỗi, cũ hoặc không được phép không làm thay đổi chính sách đang dùng. | Hồ sơ cũ không đổi chỉ vì bật chính sách mới. Thử nhập JSON sai, thiếu nhóm, dùng bản cũ hoặc kích hoạt trái phép đều bị từ chối; chính sách đang hoạt động không đổi và có Audit phù hợp. |

### 4.8. Lịch sử thao tác và quyết định

Tính năng liên quan: FTR-011. Cách kiểm tra: VVP-007.

| Mã | Yêu cầu | Kiểm tra thế nào là đạt? |
|---|---|---|
| REQ-AUD-001 | Hệ thống phải ghi kết quả Check-in, xung đột/khôi phục, phân quyền, workflow, phê duyệt, Release, xuất file và thao tác phá hủy thuộc phạm vi áp dụng; ghi người/thời điểm, mã thao tác liên quan, đối tượng, mốc nguồn/chính sách và kết quả. | Đối chiếu từng tình huống bắt buộc với Audit: không thiếu sự kiện hoặc trường bắt buộc; truy được quyết định thành công và bị từ chối theo quy định. |
| REQ-AUD-002 | Audit phải là lịch sử ghi bổ sung; quyền quản trị thông thường không được sửa hoặc xóa sự kiện, và việc thử can thiệp bị từ chối phải được ghi lại. | Thử sửa/xóa lịch sử bằng quyền quản trị thông thường: bị từ chối và có dấu vết. Thời hạn lưu giữ và việc hủy dữ liệu đặc biệt phải theo chính sách riêng. |

### 4.9. Định dạng file và khả năng đọc dữ liệu thiết kế

Tính năng liên quan: FTR-004, FTR-013. Cách kiểm tra: VVP-008.

| Mã | Yêu cầu | Kiểm tra thế nào là đạt? |
|---|---|---|
| REQ-FMT-001 | Mỗi định dạng được cho phép phải được quản lý chung về danh tính, file bất biến/dấu kiểm tra, thông tin, Checkout/Reference, Check-in, Audit, khôi phục và mở bằng ứng dụng liên kết. | Chạy bộ kiểm tra quản lý file dùng chung cho từng định dạng được bật; không gọi là hỗ trợ chỉ dựa vào việc tải lên thành công. |
| REQ-FMT-002 | Khả năng đọc thuộc tính, cấu trúc, xem trước hoặc chuyển đổi phải được mô tả trong hồ sơ hỗ trợ định dạng có phiên bản. Mỗi khả năng phải ghi rõ: không hỗ trợ, làm thủ công, nhờ ứng dụng CAD đã cài, dùng bộ đọc hoặc dùng bộ chuyển đổi độc lập; đồng thời ghi phiên bản ứng dụng, Adapter/công cụ và điều kiện chạy. | Đối chiếu đúng đường xử lý, phiên bản ứng dụng/Adapter/công cụ với dữ liệu thử; chỉ công bố khả năng đã có bằng chứng, không tự suy ra từ phần mở rộng file. |
| REQ-FMT-003 | IRONCAD là hướng tích hợp sâu đầu tiên; thêm định dạng hoặc công cụ sau này phải qua cùng giao tiếp mà không đổi quy tắc danh tính, Generation, Checkout hoặc Release. | Thử thêm một hồ sơ hỗ trợ định dạng tại cùng điểm mở rộng; các quy tắc cốt lõi không đổi. Phiên bản IRONCAD thực tế còn chờ SPEC-OPEN-04. |
| REQ-FMT-004 | Core v0 không bắt buộc cài mã IDEA chạy bên trong Office/CAD. Việc đọc dữ liệu, tạo bản xem hoặc chuyển đổi đi qua Adapter/worker riêng; thành phần này có thể gọi chức năng export đã kiểm chứng của ứng dụng CAD trên máy hoặc một bộ chuyển đổi độc lập được duyệt. Add-in chạy trong CAD, nếu cần sau này, phải được xem xét như một khả năng riêng. | Kiểm tra đúng đường xử lý đã khai báo; gây lỗi, timeout hoặc dừng công cụ giữa chừng: file gốc và trạng thái chính thức của sản phẩm không bị thay đổi sai. |
| REQ-FMT-005 | Bản xem trước, PDF, STEP hoặc file chuyển đổi là dữ liệu dẫn xuất, không thay file nguồn. Mỗi bản phải gắn đúng Generation và dấu kiểm tra của file nguồn, cùng phiên bản ứng dụng/Adapter/công cụ đã tạo. Kết quả chỉ được ghi là `Current` khi khớp Generation đang xét; nếu nguồn đã đổi thì ghi `Needs update`. Tạo tự động và tải lên thủ công dùng cùng quy tắc này. Nếu chính sách phát hành bắt buộc phải có PDF đúng bản thì thiếu/sai bản phải chặn Release; nếu không bắt buộc thì cảnh báo. | Tạo tự động và tải lên thủ công cho một Generation; sau đó tạo Generation CAD mới và thử cho bộ chuyển đổi lỗi. Truy được nguồn/công cụ, PDF cũ chuyển sang `Needs update`, file nguồn không bị hỏng; Release chặn hoặc cảnh báo đúng chính sách đã chọn. |

Lưu được file PDF không đồng nghĩa đã kiểm chứng chữ ký số PDF. Mở được file CAD cũng không đồng
nghĩa đọc được cấu trúc lắp ráp. Mức hỗ trợ phải được nêu riêng cho từng định dạng và phiên bản.

### 4.10. Đăng nhập và quản trị tài khoản IDEA

Tính năng liên quan: FTR-011. Cách kiểm tra: VVP-015, cùng VVP-007/011 ở các đường phân quyền và
truyền file. Bảy yêu cầu này được giữ trong DOC-04@0.4, chờ review; không chọn công nghệ đăng nhập
tại đây. Đăng nhập qua tài khoản công ty và nhà cung cấp ngoài để sau.

| Mã | Yêu cầu | Kiểm tra thế nào là đạt? |
|---|---|---|
| REQ-IAM-001 | Hệ thống phải cho đăng nhập/đăng xuất bằng tài khoản IDEA mà không cần nối hệ thống tài khoản công ty; thao tác được bảo vệ cần tài khoản và phiên hợp lệ. | Cấp tài khoản và thử trên Web/Desktop khi chưa cấu hình đăng nhập công ty; sai thông tin hoặc phiên đã đăng xuất không được truy cập chức năng cần đăng nhập. |
| REQ-IAM-002 | Chỉ người được giao quyền quản trị tài khoản mới được cấp tài khoản trong tổ chức; không cho tự đăng ký công khai. | Quản trị viên cấp được tài khoản và có Audit; người chưa đăng nhập hoặc người dùng thường gọi trực tiếp API cấp tài khoản đều bị từ chối. |
| REQ-IAM-003 | Kích hoạt, đổi và hỗ trợ đặt lại mật khẩu phải bảo vệ thông tin đăng nhập; mã/đường dẫn thiết lập hoặc đặt lại chỉ dùng một lần, có hạn và đúng tài khoản. Không cho xem mật khẩu hiện tại. | Thử mã hết hạn, dùng lại hoặc sai tài khoản đều thất bại; không thấy mật khẩu hiện tại trong trang quản trị/log; đổi hoặc đặt lại thu hồi các phiên cũ liên quan. Cách gửi, thời hạn và chính sách cần duyệt trước dùng thật. |
| REQ-IAM-004 | Sau khi khóa tài khoản hoặc thu hồi phiên được ghi nhận, các yêu cầu truy cập tiếp theo từ phiên cũ phải bị từ chối, kể cả cookie/token chưa hết hạn. Lệnh đang chạy phải kiểm tra lại trước khi ghi nhận; không xóa bản sửa trên máy hoặc lịch sử người thực hiện. | Thử dùng lại cookie/token cũ, tải tiếp file và Check-in/phát hành đồng thời với khóa tài khoản. Không ghi nhận lệnh không còn hợp lệ; tác vụ đang chạy dừng/kiểm tra lại tại điểm đã quy định. Mở lại tài khoản không tự làm phiên cũ hợp lệ. |
| REQ-IAM-005 | Quyền quản trị tài khoản không tự cho phép đọc tài liệu, thay chính sách nghiệp vụ, phê duyệt hoặc phát hành. Các việc đó cần quyền và điều kiện riêng. | Dùng tài khoản chỉ có quyền quản trị tài khoản: cấp/khóa được trong quyền, nhưng không tự đọc bản vẽ hay phê duyệt. Nếu được cấp thêm vai trò khác thì vẫn phải tuân thủ điều kiện độc lập. |
| REQ-IAM-006 | Mỗi người được quản lý bằng mã Actor/tài khoản ổn định trong tổ chức; đổi tên đăng nhập hoặc khóa tài khoản không sửa lại chủ sở hữu, quyết định duyệt hay Audit cũ. Sau này nối cách đăng nhập khác phải xác minh và liên kết rõ. | Đổi tên/khóa rồi xem hồ sơ cũ vẫn đúng người; trùng tên/email không tự gộp tài khoản. Phần nối nhà cung cấp đăng nhập để sau, nhưng không được làm đổi nguyên tắc này. |
| REQ-IAM-007 | Lần thiết lập đầu phải tạo quản trị viên có danh tính rõ qua thủ tục một lần; không dùng mật khẩu chung có sẵn hoặc để cửa tạo admin công khai. Không được bỏ đường quản trị/khôi phục cuối cùng khi chưa có người hoặc phương án thay thế được phép. | Thiết lập xong thì gọi lại không tạo thêm quyền; thử bỏ quản trị viên cuối cùng khi chưa có thay thế bị từ chối và có Audit. Tạo admin tài khoản không tự tạo quyền mở tài liệu hay phê duyệt. |

Không mặc định có đăng nhập một lần giữa mọi phần Web/native. Các lựa chọn mật khẩu, MFA, thời hạn
phiên, cách cấp/khôi phục và điểm dừng của luồng truyền file đang chạy cần chính sách và kiểm chứng.
Đặc biệt, đặt lại mật khẩu là quyền nhạy cảm có nguy cơ bị lạm dụng; tách tên vai trò không tự loại
hết rủi ro mạo danh bởi người có quyền quản trị. File đã tải về cũng không thể bị thu hồi chỉ bằng
việc khóa tài khoản.

## 5. Giao diện và ngôn ngữ

### 5.1. Giao diện làm việc

Tính năng liên quan: FTR-003, FTR-007, FTR-009, FTR-011, FTR-013, FTR-014.
Cách kiểm tra: VVP-009.

| Mã | Yêu cầu | Kiểm tra thế nào là đạt? |
|---|---|---|
| REQ-UX-001 | Web, Desktop và phần Web hiển thị trong Desktop phải dùng nhất quán tên gọi, trạng thái, danh tính và cách hiểu Checkout, Check-in, xét duyệt, Release. | Thực hiện cùng công việc trên ba bề mặt; không có tên gọi hoặc hành vi mâu thuẫn. |
| REQ-UX-002 | Với tài liệu đang chọn, giao diện phải cho biết trạng thái, người đang giữ quyền sửa, bước tiếp theo được phép và lý do nếu chưa làm được. | Người dùng chỉ ra được tài liệu đang làm, hành động tiếp theo và nguyên nhân chưa thực hiện được mà không phải đoán từ màu/nút bị mờ. |
| REQ-UX-003 | Ở khung kiểm tra 1440×900, thông tin nhận diện, lệnh chính, bước tiếp theo và tổng quan phải xem được mà không cuộn cả trang; vùng danh sách dài cùng loại dữ liệu được phép cuộn riêng. | Đo tại đúng khung kiểm tra, có ảnh và số đo cuộn trang/vùng. Đây chưa phải kích thước màn hình tối thiểu cam kết cho triển khai thật. |
| REQ-UX-004 | File, quan hệ, Audit đầy đủ và thông tin phụ phải mở trong drawer/modal hoặc trang riêng theo cùng loại dữ liệu; khi đóng giữ vị trí công việc và trả focus về điều khiển đã mở phần chi tiết. | Mở, cuộn và đóng từng phần chi tiết; tài liệu đang chọn và vị trí được giữ; focus trở về đúng điều khiển đã mở, không làm biến dạng bố cục chính. |
| REQ-UX-005 | Các nhóm định dạng phải có icon và nhãn dễ phân biệt; loại tài liệu, trạng thái, sẵn sàng hay lỗi không được thể hiện chỉ bằng màu. | Đối chiếu các file cùng/khác nhóm và cách đọc nhãn; vẫn nhận biết được ý nghĩa nếu bỏ màu. |
| REQ-UX-006 | Các thao tác tương tác cần dùng được bằng bàn phím, có focus nhìn thấy, tên dễ hiểu và quản lý focus trong hộp thoại; lỗi phải nêu nơi sai và cách xử lý. **Mức nguồn: nên đáp ứng trước triển khai; đánh giá chuyên môn chưa có.** | Kiểm tra chỉ dùng bàn phím và công cụ hỗ trợ trên từng bề mặt áp dụng; ghi rõ phần chưa đạt. Không coi walkthrough demo là bằng chứng tiếp cận đầy đủ. |

Quy tắc trình bày chi tiết đã có ở DOC-08: cây bên trái để chọn tài liệu; vùng giữa dành cho công
việc chính; cột phải có thông tin kiểm soát và Audit gần đây. Không lặp lại cùng thông tin ở nhiều
vùng chỉ để lấp chỗ trống. Chờ đến lượt người duyệt dùng cách trình bày trung tính; màu đỏ dành cho
lỗi hoặc rủi ro thực sự.

Các nhãn làm việc dùng “Có thay đổi”, “Không thay đổi”, “Bản đã cũ” và tên thao tác quen thuộc.
Cách tổ chức prototype là bằng chứng thiết kế, không phải bằng chứng sản phẩm đã đáp ứng các yêu
cầu trên.

### 5.2. Anh – Việt – Nhật

Tính năng liên quan: FTR-014. Cách kiểm tra: VVP-010.

| Mã | Yêu cầu | Kiểm tra thế nào là đạt? |
|---|---|---|
| REQ-LOC-001 | Giao diện phải có tiếng Anh, Việt, Nhật, lưu lựa chọn ngôn ngữ của người dùng và dùng tiếng Anh khi thiếu bản dịch của một nhãn. | Chạy cùng bộ thao tác trên ba ngôn ngữ × ba bề mặt; kiểm tra lựa chọn được lưu và nhãn thiếu có bản tiếng Anh thay thế. |
| REQ-LOC-002 | Mã danh tính, quyền, hành động và trạng thái phải độc lập với ngôn ngữ; đổi ngôn ngữ không được đổi quyền hoặc kết quả nghiệp vụ. | Đổi ngôn ngữ giữa các bước; cùng đối tượng/chính sách vẫn cho cùng quyền và chuyển trạng thái. |
| REQ-LOC-003 | Nội dung do người dùng nhập phải giữ nguyên Unicode và không tự dịch; tiếng Nhật phải được kiểm tra ở thao tác ghép chữ bằng IME, chuẩn hóa ký tự, ký tự rộng/hẹp, phông dự phòng, xuống dòng và tìm kiếm. | Nhập, lưu, mở lại và tìm các chuỗi Việt/Nhật, gồm ký tự rộng/hẹp và các cách biểu diễn Unicode tương đương; đối chiếu nội dung, ghép chữ, thay phông và lỗi cắt chữ trên từng bề mặt áp dụng. Review ngôn ngữ chưa được thực hiện. |

## 6. Giao tiếp với ứng dụng và các phần của hệ thống

Bảng này quy định thông tin và điều kiện trao đổi, chưa chọn giao thức, API cụ thể hoặc công nghệ.
Chi tiết thiết kế sẽ nằm trong Tech và DOC-05/06.

| Giao tiếp | Thông tin trao đổi | Kết quả phải bảo đảm | Liên kết |
|---|---|---|---|
| Web/Desktop với hệ thống quản lý tài liệu | Người dùng, tổ chức, đối tượng, thao tác, thông tin nhập và mốc đang làm việc. | Kiểm tra quyền, trạng thái và dữ liệu ở nơi xử lý chính thức; phản hồi kết quả hoặc lý do từ chối. Giao diện không tự quyết định quyền. | REQ-GOV-001/002; REQ-WS-010 |
| Workspace lấy và mở file | Danh sách file/mốc, chế độ, thông tin quyền truyền file và dấu kiểm tra nội dung. | Lấy đúng bản, kiểm tra nội dung trước khi Ready; mở bằng ứng dụng được Windows liên kết. | REQ-WS-001…004; REQ-SEC-002/003 |
| Workspace gửi Check-in | Mã thao tác, phạm vi xác nhận, mốc dự kiến, file và thông tin đã sửa. | File nhận dở là dữ liệu tạm, chưa phải bản dùng chung; gửi lại cùng thao tác không tạo trùng kết quả. | REQ-WS-006…012; REQ-OPS-001 |
| Công cụ đọc hoặc chuyển đổi định dạng | File đầu vào chính xác, hồ sơ khả năng hỗ trợ, công cụ/phiên bản; đầu ra là dữ liệu trích xuất hoặc bản xem. | Không sửa file gốc; kết quả có nguồn rõ ràng; kết quả từ nguồn cũ không thay bản xem hiện tại. | REQ-FMT-002…005; REQ-SEC-004 |
| Tra cứu và xuất hồ sơ | Người yêu cầu, quyền, bản tài liệu hoặc hồ sơ phát hành cần lấy. | Chỉ trả dữ liệu được phép; bộ hồ sơ lịch sử dùng đúng mốc, không đổi thành bản mới nhất. | REQ-LC-008; REQ-GOV-002; REQ-AUD-001 |
| Thông báo và dữ liệu phục vụ tìm/hiển thị | Kết quả nghiệp vụ đã được ghi nhận hoàn tất. | Gửi thông báo chậm hoặc lỗi không đổi một Check-in/Release thành công thành thất bại, cũng không tạo thành công giả. | REQ-OPS-002 |

Làm việc khi mất kết nối chỉ có thể tiếp tục với file đã có trên máy trong điều kiện được phép.
Checkout, Check-in, phê duyệt và Release cần kết nối để xác minh quyền và dữ liệu hiện tại; không có
phạm vi tự thực hiện các lệnh đó khi offline rồi mặc nhiên ghi nhận sau.

## 7. Chất lượng, bảo mật và vận hành

### 7.1. Bảo mật tại các điểm truy cập

Tính năng liên quan: FTR-004, FTR-011, FTR-013. Cách kiểm tra: VVP-011.

| Mã | Yêu cầu | Kiểm tra thế nào là đạt? |
|---|---|---|
| REQ-SEC-001 | Gói Web, Desktop, Workspace, bộ xử lý định dạng và cấu hình phía người dùng không được chứa thông tin truy cập trực tiếp database hoặc bí mật truy cập kho file dài hạn. | Quét gói triển khai/cấu hình và thử truy cập trực tiếp kho dữ liệu: không tìm thấy bí mật bị phát tán; truy cập trái phép bị từ chối. |
| REQ-SEC-002 | Truyền file phải có xác thực và quyền ngắn hạn giới hạn đúng đối tượng/thao tác; quyền hết hạn, sai đối tượng hoặc bị dùng lại trái phép phải bị từ chối và ghi Audit. | Thử tải đúng quyền, sai file, hết hạn và phát lại yêu cầu trái phép; chỉ yêu cầu hợp lệ được thực hiện. Thời hạn cụ thể chờ chính sách/Tech. |
| REQ-SEC-003 | Giao tiếp Desktop–Workspace phải xác thực theo phiên người dùng; người hoặc phiên khác trên cùng máy không được điều khiển hay đọc Workspace ngoài quyền. | Đăng nhập hai người/phiên trên cùng máy và thử truy cập chéo; bị từ chối, không lộ dữ liệu. |
| REQ-SEC-004 | Xử lý file không tin cậy phải được cách ly, giới hạn đọc/ghi, thời gian, RAM, CPU và dung lượng đầu ra bằng cấu hình; lỗi không làm đổi sai file gốc hoặc trạng thái sản phẩm. | Dùng file lỗi, quá lớn hoặc xử lý quá lâu; tiến trình bị giới hạn và dữ liệu gốc còn nguyên. Các ngưỡng cụ thể chưa được chốt. |

### 7.2. Tính nhất quán, sao lưu và khôi phục

Tính năng liên quan: FTR-005, FTR-008, FTR-010, FTR-011.
Cách kiểm tra: VVP-012, VVP-013, VVP-014.

| Mã | Yêu cầu | Kiểm tra thế nào là đạt? |
|---|---|---|
| REQ-OPS-001 | File tạm đang nhận, file không được thao tác nào ghi nhận và dữ liệu hết hạn phải không xuất hiện như dữ liệu chính thức; gián đoạn cần được đối soát và ghi kết quả xử lý. | Dừng/khởi động lại giữa lúc nhận file; không đọc được bản tạo dở như bản hợp lệ; có hồ sơ đối soát dữ liệu tạm. |
| REQ-OPS-002 | Thông báo và dữ liệu phụ phục vụ hiển thị/tìm kiếm chỉ được dựa trên kết quả đã ghi nhận; chúng không quyết định Check-in, phê duyệt hoặc Release có thành công hay không. | Làm chậm hoặc gây lỗi gửi thông báo/cập nhật dữ liệu phụ; kết quả nghiệp vụ chính xác được giữ và có thể cập nhật lại phần phụ. |
| REQ-OPS-003 | Bản sao lưu phải bao gồm file, thông tin, cấu trúc, chính sách/cấu hình và thành phần mật mã cần thiết tại một mốc nhất quán. | Kiểm tra danh sách và dấu kiểm tra các thành phần sao lưu; thiếu thành phần phải được báo. Có đủ bản sao chưa được coi là đã khôi phục thành công. |
| REQ-OPS-004 | Thử khôi phục phải đối chiếu mọi Generation còn thuộc diện lưu giữ với đúng bản dữ liệu, cấu trúc và dấu kiểm tra file; báo mọi phần thiếu, hỏng hoặc không khớp. | Khôi phục trong môi trường cách ly và đối soát đầy đủ: chỉ đạt khi không có Generation phải giữ bị thiếu, không giải quyết được hoặc sai nội dung. |
| REQ-OPS-005 | Trước sử dụng thật, phải đo quy mô, độ trễ, tính sẵn sàng, RPO và RTO theo tải/môi trường đã duyệt. **Bắt buộc trước triển khai; hiện BLOCKED vì chưa có người phụ trách, tải, ngưỡng và phương pháp đo được chốt.** | Có cấu hình/tải thử, số đo, cách thống kê độ trễ (phân vị được chọn) và so sánh với ngưỡng được duyệt. Chưa đủ các đầu vào này thì không duyệt yêu cầu cho triển khai và không báo đạt. |

RPO nói về độ lùi của mốc dữ liệu khôi phục; RTO nói về thời gian khôi phục dịch vụ. Anh đã đồng ý
**mục tiêu sơ bộ: khôi phục trong 4 giờ làm việc, mốc dữ liệu không lùi quá 1 giờ** khi có sự cố máy
chủ nghiêm trọng cần khôi phục từ sao lưu. Đây là mục tiêu để thiết kế/thử nghiệm, chưa phải SLA
hoặc kết quả đã đạt; REQ-OPS-005 vẫn bị chặn cho triển khai.

Trước đo phải chốt giờ làm việc/cách bắt đầu tính, người thực hiện, bộ dữ liệu và dấu hiệu dịch vụ
đã dùng lại được. Mốc khôi phục phải có đủ cả database, file, cấu hình và khóa cần thiết; không lấy
mốc mới nhất của database làm mốc đạt khi file còn thiếu. Các phiên cũ phải bị vô hiệu hóa và các
thay đổi quyền/tài khoản sau mốc sao lưu cần được đối soát trước mở lại truy cập. VVP-013/014 quy
định cách thử. Vẫn chưa có cam kết tải đồng thời, dung lượng file tối đa hoặc thời gian phản hồi.

Các điều kiện như “không ghi nhận một phần”, “không mất bản sửa trên máy”, “không phát hành sai bản”
và “khôi phục đúng nội dung” được kiểm tra ngay trong từng yêu cầu. Không chỉ đánh giá bằng cảm giác
giao diện nhanh hoặc dễ dùng.

## 8. Kịch bản minh họa để cùng kiểm tra cách hiểu

Ví dụ dùng cụm bơm P-100, mô hình CAD và tài liệu thông số. Đây là tình huống minh họa từ các yêu
cầu, không phải kết quả thử sản phẩm. Chi tiết file, người dùng và cấu hình sẽ nằm trong bộ dữ liệu
kiểm thử có phiên bản.

| Tình huống | Điều kiện / thao tác | Kết quả cần quan sát | Yêu cầu liên quan |
|---|---|---|---|
| Tiếp nhận bộ file đầu tiên | Kỹ sư chọn file CAD và tài liệu thông số; hệ thống thấy một file có khả năng trùng. | Người dùng quyết định tạo riêng, liên kết hoặc hủy. Bản đầu chỉ trở thành hợp lệ khi được ghi nhận hoàn chỉnh. | REQ-ID-003…006 |
| Sửa có tài liệu tham chiếu | Checkout mô hình CAD, lấy thông số ở chế độ Reference; sửa và Save mô hình. | Workspace cho biết đúng quyền mỗi tài liệu. Chưa Check-in thì hệ thống chưa coi bản sửa trên máy là bản mới chính thức. | REQ-WS-001…004 |
| Check-in có thay đổi | Người dùng xác nhận phạm vi hợp lệ, tất cả điều kiện vẫn đúng. | Mỗi tài liệu thay đổi có một Generation mới, toàn phạm vi cùng hoàn tất và không còn giữ các tài liệu đã xác nhận. | REQ-WS-007/009 |
| Check-in không có thay đổi | Đã có bản nền hợp lệ; file, thông tin và cấu trúc không đổi. | Báo không có thay đổi, không tăng số bản/Generation, kết thúc Checkout trong phạm vi. | REQ-WS-008 |
| Bản đã cũ hoặc file liên quan không có Checkout | Hệ thống đã có mốc mới hơn, hoặc một file Reference bị sửa. | Nêu từng vấn đề, không ghi nhận ngầm file ngoài quyền, không ghi đè/mất file trên máy; người dùng xử lý và xác nhận lại. | REQ-WS-005/006/010/011 |
| Mất phản hồi sau Check-in | Kết nối đứt khi người dùng chưa biết thao tác đã hoàn tất chưa. | Kiểm tra/gửi lại cùng mã thao tác để lấy đúng kết quả; không tạo thêm một lần Check-in. | REQ-WS-012 |
| Duyệt và phát hành | Gửi đúng bộ; người độc lập đủ quyền phê duyệt; người có quyền Release xác nhận phạm vi. | Quyết định gắn đúng bản; mọi điều kiện được kiểm tra lại. Sai một mục thì không phát hành dở dang. | REQ-LC-002…007 |
| Tạo Revision mới và lấy lại hồ sơ cũ | Bộ P-100 đã Released; kỹ sư tạo Revision tiếp theo, sửa; sau đó cần lấy lại lần phát hành trước. | Revision mới có quy trình riêng; bộ hồ sơ phát hành trước vẫn lấy lại đúng như cũ. | REQ-LC-008/009; REQ-STR-002 |

### 8.1. Phát hành cụm bơm trước, tủ điện tiếp tục thiết kế

Máy M-100 gồm cụm bơm P-100 và tủ điện E-100. Hồ sơ cụm bơm đã được phê duyệt đúng bản; tủ điện
và hồ sơ toàn bộ máy vẫn ở In Work. Trong trường hợp đầu tiên, cụm bơm không có phụ thuộc bắt buộc
chưa đáp ứng từ tủ điện. Việc cùng thuộc một máy không tự buộc cả hai cụm phải phát hành cùng lúc.

| Hồ sơ trong ví dụ | Bản được chọn | Trạng thái trước khi phát hành | Xử lý trong đợt phát hành cụm bơm |
|---|---|---|---|
| Cụm bơm P-100 / mô hình lắp ráp | Revision A — Version 3 | Under Review, đã Approved | Có trong phạm vi |
| Bản vẽ cụm bơm | Revision A — Version 4 | Under Review, đã Approved | Có trong phạm vi; tài liệu bắt buộc của cụm bơm |
| BOM cụm bơm | Revision A — Version 2 | Under Review, đã Approved | Có trong phạm vi; tài liệu bắt buộc của cụm bơm |
| Tủ điện E-100 | Revision A — Version 2 | In Work | Ngoài phạm vi; tiếp tục thiết kế |
| Hồ sơ toàn bộ máy M-100 | Revision A — Version 2 | In Work | Ngoài phạm vi; chưa phát hành toàn bộ máy |

Mỗi bản trên được nhận diện bằng Generation cụ thể; các mã và số bản chỉ là dữ liệu minh họa.
Người có quyền xem trước danh sách, kiểm tra điều kiện và xác nhận phát hành hồ sơ cụm bơm.
Khi thành công, ba hồ sơ được chọn chuyển sang Released; hồ sơ tủ điện và toàn bộ máy giữ nguyên
trạng thái In Work. Release không tự tăng Revision hoặc Version và không sửa cấu trúc đã lưu của
toàn bộ máy. Hệ thống lưu một hồ sơ phát hành chứa đúng các bản, cấu trúc và file đã xác nhận.

| Mã tình huống | Thao tác cần kiểm tra | Kết quả cần quan sát | Yêu cầu liên quan |
|---|---|---|---|
| SR-01 | Phát hành phạm vi cụm bơm đã đủ điều kiện như bảng trên. | Chỉ các hồ sơ đã chọn được phát hành; tủ điện và toàn bộ máy vẫn In Work. Hồ sơ phát hành ghi đúng các bản, không tự thêm tài liệu ngoài phạm vi. | REQ-LC-006/007; REQ-STR-001/002 |
| SR-02 | Trong một biến thể dữ liệu, cụm bơm cần tài liệu kích thước kết nối với tủ điện nhưng tài liệu đó bị thiếu, chưa xác định đúng bản hoặc chưa đủ điều kiện phát hành. Thử cả trường hợp bỏ một tài liệu bắt buộc khỏi danh sách. Không có ngoại lệ phát hành hợp lệ trong các lần thử này. | Chỉ rõ tài liệu/quan hệ và lý do thiếu điều kiện; toàn bộ phạm vi bị chặn. Không thể bỏ một phụ thuộc bắt buộc khỏi danh sách để vượt kiểm tra. | REQ-STR-003; REQ-LC-006/007 |
| SR-03 | Bổ sung đúng bản của tài liệu phụ thuộc: bản đó đã Released, hoặc đã Approved và được người dùng xác nhận đưa vào cùng lần phát hành. | Có thể phát hành khi các điều kiện còn lại đều đạt. Bản đã Released được dùng lại đúng mốc; tài liệu mới được thêm phải xuất hiện trong phạm vi xác nhận. | REQ-STR-001/003; REQ-LC-006/007 |
| SR-04 | Sau khi xem trước phạm vi nhưng trước khi hoàn tất, thu hồi quyền hoặc làm mất hiệu lực quyết định duyệt của một tài liệu bắt buộc. | Hệ thống kiểm tra lại và từ chối cả phạm vi; không phát hành theo kết quả kiểm tra đã cũ. | REQ-LC-006/007 |
| SR-05 | Gây lỗi trong lúc ghi trạng thái và hồ sơ phát hành, trước khi giao dịch hoàn tất. | Không có tài liệu được chuyển sang Released dở dang hoặc hồ sơ báo thành công một phần. Dữ liệu đã tồn tại trước thao tác vẫn giữ nguyên. | REQ-LC-007 |
| SR-06 | Sau SR-01, tiếp tục sửa và Check-in tủ điện. Tạo Revision mới của bản vẽ cụm bơm, sửa rồi Check-in; sau đó mở/xuất lại đợt phát hành cụm bơm trước đó. | Hồ sơ cũ vẫn gồm đúng các Generation, cấu trúc và nội dung file ban đầu. Bản vẽ vẫn được lấy ở A/4; không tự thay bằng Revision mới. Muốn cụm bơm hoặc toàn bộ máy dùng bản mới phải ghi nhận thay đổi và xét duyệt riêng. | REQ-LC-008/009; REQ-STR-001/002 |

Phụ thuộc cần kiểm tra phải được ghi nhận thành quan hệ hoặc tài liệu đầu vào. Hệ thống kiểm tra
được bản tài liệu, trạng thái và điều kiện đã khai báo; tính đúng của kích thước hay khả năng lắp
khớp vẫn cần kỹ sư xác nhận trong nội dung xét duyệt.

Quy trình và bằng chứng cần lưu nằm tại [VVP, mục 1.2](../registers/VVP-core-v0-verification-validation-plan.md#12-staged-release-acceptance-detail).
Cả sáu tình huống đều là kế hoạch kiểm thử, trạng thái **NOT-RUN**.

### 8.2. Tạo PDF từ CAD và giữ đúng bản nguồn

Với người dùng, IDEA có thể tạo PDF ngay sau khi Check-in CAD nếu hồ sơ hỗ trợ định dạng đã xác
minh một đường tự động. Về kỹ thuật, IDEA không được giả định có một bộ chuyển đổi dùng được cho mọi
CAD. Adapter sẽ dùng đúng ứng dụng CAD đã cài hoặc bộ chuyển đổi độc lập đã được kiểm chứng. Nếu chưa
có đường tự động phù hợp, người dùng có thể export bằng ứng dụng CAD rồi tải PDF lên.

Hai cách đều tạo một **Representation**: bản dẫn xuất để xem hoặc bàn giao, không thay file CAD gốc.
Representation phải chỉ về đúng Generation CAD đã tạo ra nó. Khi CAD có Generation mới, PDF cũ vẫn
được giữ trong lịch sử nhưng hiển thị `Needs update`, không được giới thiệu là PDF hiện tại.

| Mã tình huống | Thao tác cần kiểm tra | Kết quả cần quan sát | Yêu cầu liên quan |
|---|---|---|---|
| CR-01 | Check-in một bản vẽ IRONCAD trong cấu hình đã xác minh chức năng tự động tạo PDF. | Adapter/worker tạo PDF, ghi đúng Generation và dấu kiểm tra file CAD nguồn, phiên bản ứng dụng/Adapter/công cụ; PDF là `Current` và file CAD vẫn là nguồn chính thức. | REQ-FMT-002/003/004/005 |
| CR-02 | Với định dạng chưa có đường tự động, export PDF trong ứng dụng thiết kế rồi tải lên và chọn đúng Generation nguồn. | Hệ thống kiểm tra quyền, định dạng và dấu kiểm tra, lưu người/thời điểm/nguồn; PDF thủ công dùng cùng quan hệ và trạng thái như PDF tự động. | REQ-FMT-001/002/005; REQ-AUD-001 |
| CR-03 | Tạo Generation CAD mới sau khi đã có một PDF `Current`. | PDF cũ được giữ để tra lịch sử nhưng chuyển thành `Needs update`; không tự gắn nó cho Generation mới hoặc hiển thị như bản hiện tại. | REQ-FMT-005 |
| CR-04 | Làm bộ chuyển đổi lỗi, timeout hoặc trả kết quả không hợp lệ. Thử riêng chính sách PDF bắt buộc và không bắt buộc khi Release. | File CAD và trạng thái chính thức không bị sửa. Chính sách bắt buộc chặn Release và nêu lý do; chính sách không bắt buộc cảnh báo nhưng không gọi PDF cũ là hiện tại. | REQ-FMT-004/005; REQ-LC-006/007 |
| CR-05 | Thêm một Adapter hoặc công cụ CAD thứ hai qua cùng giao tiếp. | Quy tắc Logical Document, Generation, Check-in, Representation và Release không đổi; khả năng mới chỉ được bật cho đúng phiên bản/cấu hình đã kiểm chứng. | REQ-FMT-002/003/005 |

Quy trình chi tiết nằm tại [VVP, mục 1.3](../registers/VVP-core-v0-verification-validation-plan.md#13-cad-representation-acceptance-detail).
Cả năm tình huống đều là kế hoạch kiểm thử, trạng thái **NOT-RUN**.

### 8.3. Cấu hình workflow mà không làm sai lịch sử

Core v0 có thể phục vụ nhiều loại tài liệu mà không đóng cứng một quy trình duy nhất. Mỗi lần bắt
đầu workflow phải xác định loại tài liệu, Workflow Definition Version, Approval Policy Version và
người tham gia đủ điều kiện. Quy trình mặc định vẫn là **Start → In Work → Under Review → Released**;
Reject hoặc Withdraw chỉ trở về In Work khi bước chuyển và người thực hiện đều hợp lệ.

| Mã tình huống | Thao tác cần kiểm tra | Kết quả cần quan sát | Yêu cầu liên quan |
|---|---|---|---|
| WF-01 | Cấu hình hai workflow hợp lệ và gán mặc định khác nhau cho hai loại tài liệu. | Tài liệu mới của mỗi loại bắt đầu đúng workflow mặc định; không cần sửa code để thay đổi phép gán. | REQ-LC-001; REQ-GOV-002/005 |
| WF-02 | Bắt đầu một lần xét duyệt, sau đó kích hoạt phiên bản workflow hoặc chính sách mới. | Lần đang chạy và lịch sử cũ giữ đúng phiên bản đã ghim; lượt bắt đầu sau dùng phiên bản mới. | REQ-LC-001; REQ-GOV-005 |
| WF-03 | Chạy quy trình mặc định qua Submit, Approve và Release; chạy riêng Reject và Withdraw. | Chỉ các bước chuyển được khai báo mới được thực hiện; Reject/Withdraw hợp lệ trở về In Work và quyết định gắn đúng Generation/phạm vi. | REQ-LC-002/004/006/007 |
| WF-04 | Chạy ba biến thể: policy mặc định với người soạn thử tự Approve/Release; policy mới bật `AllowSelfApproval`; và hai policy cùng áp dụng trong đó một policy yêu cầu người độc lập. | Mặc định tự duyệt bị từ chối; policy opt-in chỉ cho tự Approve khi đủ RBAC/business gate; policy xung đột vẫn yêu cầu người khác; tự Approve không tự cấp Release. | REQ-LC-003; REQ-GOV-002 |
| WF-05 | Bỏ trống vai trò bắt buộc hoặc tạo cấu hình thiếu bước chuyển, điều kiện hay quyết định cần thiết. | Hệ thống không kích hoạt hoặc không cho đi tiếp tại đúng bước; nêu rõ phần cấu hình/vai trò còn thiếu và không tự nới chính sách. | REQ-LC-005; REQ-GOV-005 |
| WF-06 | Cấu hình số người cần duyệt, lý do/bằng chứng bắt buộc và thông báo; thử cả kết quả thành công và lỗi gửi thông báo. | Quyết định chỉ hoàn tất khi đủ điều kiện. Lỗi thông báo không làm đổi kết quả nghiệp vụ đã commit; sự kiện có thể được gửi lại từ kết quả chính thức. | REQ-LC-003/004; REQ-OPS-002 |

Quy trình chi tiết nằm tại [VVP, mục 1.4](../registers/VVP-core-v0-verification-validation-plan.md#14-workflow-configuration-acceptance-detail).
Cả sáu tình huống đều là kế hoạch kiểm thử, trạng thái **NOT-RUN**.

### 8.4. Thay đổi quyền mà không sửa code

Tài khoản và quyền tài liệu là hai lớp khác nhau. Identity dùng để xác định người đang đăng nhập và
tình trạng tài khoản/phiên. Access Policy của IDEA mới quyết định người đó được làm gì với tài liệu
cụ thể ở trạng thái hiện tại. Chính sách chính thức nằm trong dữ liệu do Server quản lý; JSON chỉ có
thể chuyển một bản cấu hình đề nghị vào hoặc ra khỏi hệ thống.

| Mã tình huống | Thao tác | Kết quả phải có | Liên kết |
|---|---|---|---|
| AC-01 | Quản trị viên được phép tạo bản chính sách mới bằng biểu mẫu, đổi quyền của một nhóm trên phạm vi/loại tài liệu, rồi thêm hoặc bỏ một người khỏi nhóm và xem trước khác biệt. | Không cần sửa/triển khai lại code hoặc sửa từng tài liệu. Bản đang hoạt động chưa đổi trước khi kích hoạt; thay đổi Membership có mốc hiệu lực và bản mới có mã/phiên bản riêng. | REQ-GOV-002/005 |
| AC-02 | Nhập một file JSON hợp lệ chứa cùng đề nghị thay đổi. | Hệ thống kiểm tra cấu trúc, tham chiếu, phạm vi và người thực hiện; hiển thị bản xem trước. Việc tải file lên chưa cấp quyền. | REQ-GOV-002/005 |
| AC-03 | Sửa file JSON trên máy để tự thêm quyền Approve/Release, hoặc gọi trực tiếp API/đường dữ liệu không được phép. | Không có quyền mới. Server từ chối đường không hợp lệ, không cung cấp thông tin đăng nhập database cho Web/Desktop và ghi kết quả cần Audit. | REQ-GOV-001/002; REQ-SEC-001 |
| AC-04 | Người có thẩm quyền kích hoạt ứng viên hợp lệ rồi thực hiện cùng một hành động trước và sau mốc kích hoạt. | Chỉ thao tác sau mốc hiệu lực dùng chính sách mới. Quyết định, workflow và Release cũ vẫn đọc đúng phiên bản chính sách đã dùng trước đây. | REQ-GOV-002/005; REQ-AUD-001 |
| AC-05 | Nhập cấu hình sai định dạng, thiếu nhóm/tham chiếu, dùng trên bản cơ sở đã cũ, để ứng viên tự cấp quyền kích hoạt cho chính nó hoặc tạo quyền trực tiếp không đủ phạm vi/lý do/thời hạn. | Từ chối toàn bộ; chính sách đang dùng không đổi. Nêu lỗi có thể xử lý và không cho ứng viên tự tạo thẩm quyền thông qua chính nội dung của nó. | REQ-GOV-002/005; REQ-IAM-005 |

Quy trình chi tiết nằm tại [VVP, mục 1.5](../registers/VVP-core-v0-verification-validation-plan.md#15-authorization-and-policy-import-acceptance-detail).
Cả năm tình huống là kế hoạch kiểm thử, trạng thái **NOT-RUN**. Core v0 chưa bắt buộc hỗ trợ nhập
JSON nếu biểu mẫu quản trị đã đáp ứng việc thay đổi quyền; nếu có nhập JSON thì phải đi qua cùng quy
trình kiểm tra và kích hoạt.

### 8.5. Giữ đúng tài liệu khi đổi tên, chuyển folder hoặc tạo bản sao

Người dùng nhìn thấy folder/divider để tổ chức công việc, nhưng IDEA quản lý tài liệu bằng Document
ID. Vì vậy chuyển vị trí và đổi tên không được âm thầm biến tài liệu thành một tài liệu khác. Ngược
lại, khi người dùng chủ động chọn Create Copy/Save-As thì hệ thống phải tạo danh tính mới và giữ dấu
vết về tài liệu nguồn.

| Mã tình huống | Thao tác | Kết quả phải có | Liên kết |
|---|---|---|---|
| IF-01 | Chuyển tài liệu từ folder thiết kế sang folder của cụm bơm, sau đó đổi divider. | Document ID, Revision, Version, Generation và lịch sử không đổi; chỉ vị trí tổ chức và Audit thay đổi. Không di chuyển file vật lý theo đường dẫn do người dùng nhìn thấy. | REQ-ID-001/007 |
| IF-02 | Thêm một liên kết của tài liệu đã có vào folder khác rồi xóa liên kết đó. | Không tạo tài liệu/file/Generation trùng. Tài liệu gốc và các vị trí còn lại không bị xóa; quyền xem vẫn được kiểm tra trên tài liệu đích. | REQ-ID-007; REQ-GOV-001/002 |
| IF-03 | Tạo liên kết tới một Revision/Generation lịch sử, sau đó Check-in bản mới của tài liệu. | Liên kết lịch sử vẫn mở đúng bản đã chọn; không tự nhảy sang Working Head mới. | REQ-ID-007; REQ-LC-008 |
| IF-04 | Đổi một nhãn chỉ dùng để hiển thị trong cây điều hướng. | Giữ nguyên Document ID và Generation; ghi Audit của thay đổi tổ chức. | REQ-ID-008; REQ-AUD-001 |
| IF-05 | Đổi tên hoặc tiêu đề thuộc Product Definition rồi Check-in. | Giữ Document ID; tạo đúng một Version/Generation mới, giữ nguyên bản cũ và áp dụng đầy đủ kiểm tra Checkout/stale. | REQ-ID-008; REQ-WS-006…010 |
| IF-06 | Chọn Create Copy/Save-As từ một tài liệu In Work hoặc Released. | Tạo Document ID mới, ghi bản nguồn và người thực hiện; không đổi tài liệu nguồn, không kế thừa ngầm Checkout, Approval hoặc Released. | REQ-ID-009; REQ-AUD-001 |

Các tình huống này thuộc [VVP, mục 1.6](../registers/VVP-core-v0-verification-validation-plan.md#16-item-name-folder-and-copy-identity-acceptance-detail),
trạng thái **NOT-RUN**. Chúng làm rõ cách IDEA thực hiện hành vi người dùng đã chọn; không phải tuyên
bố đã biết cấu trúc database nội bộ của sản phẩm tham chiếu.

### 8.6. BOM là dữ liệu cấu trúc, không phải chỉ là file Excel/PDF

Trong IDEA, Product Structure là dữ liệu chính thức về các thành phần và quan hệ. BOM là một cách
xem đúng mốc cấu trúc đó theo mục đích đã chọn. File Excel, PDF hoặc CSV có thể dùng để bàn giao hoặc
đề nghị nhập dữ liệu, nhưng bản thân file không tự trở thành cấu trúc chính thức.

Ví dụ: cùng một cụm bơm có thể có BOM kỹ thuật và danh sách bàn giao với các cột khác nhau. Hai bảng
phải chỉ rõ cùng hoặc khác Structure Snapshot, dùng profile nào và được tạo khi nào. Nếu một phòng
ban duy trì parts list như tài liệu độc lập, IDEA quản lý nó như một Logical Document có Generation
riêng và ghi quan hệ với đúng mốc cấu trúc; không trộn nó với bản Excel/PDF được hệ thống sinh ra.

| Mã tình huống | Thao tác | Kết quả phải có | Liên kết |
|---|---|---|---|
| BM-01 | Mở hai BOM View Profile trên cùng một Structure Snapshot; sau đó tạo bản mới cho một thành phần và mở lại mốc cũ. | Mỗi bảng ghi rõ snapshot/profile, lần xuất hiện, Generation thành phần, số lượng/vị trí và trường theo profile. Bảng của mốc cũ không tự lấy bản thành phần mới. | REQ-STR-004 |
| BM-02 | Xuất Excel và PDF từ một BOM đang xem. | Mỗi file là BOM Representation có mốc cấu trúc, phiên bản profile, định dạng, dấu kiểm tra và thông tin tạo; file không thể sửa ngược cấu trúc chính thức. | REQ-STR-005; REQ-AUD-001 |
| BM-03 | Tạo Structure Snapshot hoặc BOM View Profile mới sau khi đã xuất file. | File cũ vẫn mở và đối chiếu được với nguồn cũ, nhưng khi so với nguồn/profile mới phải báo `Needs update`; không âm thầm đổi nhãn thành bản hiện hành. | REQ-STR-005 |
| BM-04 | Tải Excel/CSV hợp lệ lên để đề nghị thay đổi BOM, kiểm tra mapping và xem trước phần thêm/sửa/xóa rồi xác nhận. | Trước xác nhận, cấu trúc không đổi. Sau xác nhận hợp lệ, tạo đúng Structure Snapshot và Generation mới như bản xem trước trong một kết quả trọn vẹn. | REQ-STR-006 |
| BM-05 | Thử file sai schema, thiếu tham chiếu, người không có quyền, mốc gốc đã cũ và lỗi giữa lúc ghi nhận. | Từ chối toàn bộ, không tạo cấu trúc/Generation dở dang và giữ nguyên mốc cũ; có lý do và Audit phù hợp. | REQ-STR-006; REQ-AUD-001 |
| BM-06 | Liên kết một parts list được quản lý như tài liệu riêng với đúng Structure Snapshot, sau đó thay đổi một phía và thử phát hành/lấy lại hồ sơ cũ. | Giao diện và dữ liệu phân biệt tài liệu riêng với BOM Representation. Sai mốc phải hiện rõ; hồ sơ hợp lệ ghim đúng snapshot, profile và Generation/file cần thiết, còn hồ sơ cũ không chạy theo bản mới nhất. | REQ-STR-005; REQ-LC-006…008 |

Các tình huống này thuộc [VVP, mục 1.7](../registers/VVP-core-v0-verification-validation-plan.md#17-product-structure-bom-and-file-boundary-acceptance-detail),
trạng thái **NOT-RUN**. Chúng làm rõ hành vi IDEA cần có; nguồn công khai chỉ cho thấy sản phẩm tham
chiếu có giao diện Product Structure/BOM, sửa số lượng/vị trí và xuất Excel/Web, không chứng minh
cách lưu trữ hoặc giao dịch nội bộ của sản phẩm đó.

### 8.7. Đầu ra phòng ban không tự trở thành tính năng của PDM

Một phòng ban có thể bàn giao CAD, PDF, phần mềm, hướng dẫn, checklist, BOM hoặc bằng chứng. IDEA
quản lý những nội dung phù hợp như tài liệu, Product Structure hoặc hồ sơ Release hiện có. Việc một
bảng bàn giao có thêm số giờ, chi phí dự kiến, tình trạng mua hàng/gia công hay phần trăm tiến độ
không có nghĩa Core v0 phải thay thế phần mềm chấm công, kế toán, ERP/MRP, sản xuất hoặc quản lý dự án.

Các giá trị đó có thể được cấu hình thành trường hoặc nằm trong một tài liệu được kiểm soát để người
dùng hiểu bối cảnh. Chúng không tự tạo giao dịch, kết quả tính toán, trạng thái hoàn thành hoặc bước
chuyển vòng đời. Nếu sau này công ty muốn IDEA làm chủ một nghiệp vụ như vậy, phải duyệt Feature mới
hoặc hợp đồng tích hợp chỉ rõ hệ thống nguồn, dữ liệu, quyền ghi, xử lý lỗi và Audit.

| Mã tình huống | Thao tác | Kết quả phải có | Liên kết |
|---|---|---|---|
| DH-01 | Đưa CAD/PDF/software/hướng dẫn/checklist của nhiều phòng ban vào hồ sơ kỹ thuật, liên kết với đúng cấu trúc và phát hành một phạm vi đủ điều kiện. | Mỗi nội dung dùng đúng Document ID, Revision, Version, Generation, quan hệ và bằng chứng hiện có; lấy lại được đúng bộ đã phát hành. Không sinh thêm loại giao dịch chỉ vì tên phòng ban hoặc loại đầu ra. | REQ-ID-001…004; REQ-STR-001/002; REQ-LC-006…008 |
| DH-02 | Cấu hình và lưu giờ, chi phí dự kiến, tình trạng mua hàng/gia công, tiến độ và hoàn thành trong trường thông tin hoặc tài liệu liên quan. | Tra cứu được giá trị, nguồn/người cung cấp, định nghĩa trường và Generation. Không tự tính tổng, tạo đơn mua/gia công, ghi nhận sản xuất, đánh dấu sản phẩm/dự án hoàn thành hoặc chuyển Workflow/Release. | REQ-GOV-003; REQ-AUD-001 |
| DH-03 | Cập nhật tài liệu hoặc giá trị tham khảo, sau đó mở lại một hồ sơ phát hành cũ. | Thay đổi có kiểm soát tạo Version/Generation theo quy tắc hiện có; hồ sơ cũ giữ nguyên giá trị và định nghĩa đã ghim, không bị diễn giải lại theo biểu mẫu mới. | REQ-ID-002/004; REQ-GOV-003/005; REQ-LC-008 |
| DH-04 | Thử đồng bộ ra hệ thống ngoài, suy ra “máy đã hoàn thành” từ việc tài liệu được Released hoặc dùng giá trị tham khảo để tự chuyển trạng thái khi chưa có Feature/hợp đồng tích hợp được duyệt. | Không tạo giao dịch hoặc trạng thái có thẩm quyền. Chỉ một Feature/hợp đồng tích hợp được duyệt riêng mới có thể cho phép đường xử lý đó; thao tác bị từ chối hoặc không được cung cấp trong Core v0. | REQ-GOV-003/005; REQ-LC-006/007; REQ-AUD-001 |

Các tình huống này thuộc [VVP, mục 1.8](../registers/VVP-core-v0-verification-validation-plan.md#18-departmental-handoff-and-operational-reference-data-acceptance-detail),
trạng thái **NOT-RUN**. Chúng xác nhận ranh giới trách nhiệm của IDEA, không phải tuyên bố rằng sản
phẩm đã tích hợp với hệ thống vận hành khác.

## 9. Kế hoạch kiểm tra và điều kiện kết luận

Nguồn kế hoạch: [VVP-001…015](../registers/VVP-core-v0-verification-validation-plan.md).
Mọi kết quả hiện là **NOT-RUN**. Bảng dưới là cách tổ chức kiểm tra, không phải một danh sách đã được
tick đạt. Mỗi mã yêu cầu tại mục 4, 5 và 7 đều có điều kiện kiểm tra riêng.

| Mã kế hoạch | Phạm vi kiểm tra | Bằng chứng cần lưu |
|---|---|---|
| VVP-001 | Danh tính, folder/vị trí, Rename/Create Copy và Revision/Version/Generation — REQ-ID-* | Dữ liệu trước/sau và lịch sử chứng minh Move/Rename giữ Document ID, Create Copy cấp ID mới, liên kết lịch sử giữ đúng bản, Version bắt đầu/tăng/reset đúng quy tắc và không có Version Sequence riêng. |
| VVP-002 | Phạm vi Checkout/Reference, lấy file, kiểm tra trước Check-in — REQ-WS-001…006 | Danh sách đã xác nhận, file/dấu kiểm tra, kết quả thao tác và ảnh giao diện. |
| VVP-003 | Check-in cùng thành công/cùng thất bại và gửi lại thao tác — REQ-WS-007…012 | Kết quả gây lỗi từng bước; không có bản dữ liệu tạo dở hoặc kết quả trùng. |
| VVP-004 | Bản đã cũ, sai người/Workspace, hết hạn và khôi phục — REQ-WS-010/011/013 | Kết quả từ chối/khôi phục, bản trước/sau trên máy, Audit. |
| VVP-005 | Cấu trúc, BOM và mốc tài liệu liên quan — REQ-STR-* | Cấu trúc nhiều cấp, quan hệ vòng/thiếu dữ liệu, phân biệt cụm ngoài phạm vi với phụ thuộc bắt buộc, BOM view/export/import, parts list độc lập và kết quả dựng lại bản cũ; SR-01…03/06 và BM-01…06. |
| VVP-006 | Quy trình, phê duyệt, Release, Revision mới — REQ-LC-* | Quyết định, phiên bản chính sách, phạm vi, hồ sơ phát hành và thử lỗi; SR-01…06 tại mục 8.1, WF-01…06 tại mục 8.3 và BM-06 tại mục 8.6. |
| VVP-007 | Quyền, cấu hình, đánh số, dữ liệu tham khảo và Audit — REQ-GOV-*, REQ-AUD-* | Ma trận quyền, thay cấu hình workflow/chính sách, nhập/xem trước/kích hoạt ứng viên cấu hình, cấp số đồng thời/gửi lại, đối soát sự kiện, thử can thiệp lịch sử và ranh giới đầu ra phòng ban; WF-01/02/04/05, AC-01…05 và DH-01…04. |
| VVP-008 | Khả năng từng định dạng và IRONCAD — REQ-FMT-* | File thử, phiên bản ứng dụng/Adapter/công cụ, đường tạo tự động/thủ công, quan hệ với Generation nguồn, trạng thái `Current`/`Needs update`, chính sách Release và lỗi xử lý có giới hạn; CR-01…05 tại mục 8.2. |
| VVP-009 | Luồng giao diện, cuộn, icon, bàn phím, hộp thoại — REQ-UX-* | Cấu hình hiển thị, ảnh, nhật ký thao tác và đánh giá tiếp cận theo phạm vi, gồm việc phân biệt cấu trúc chính thức, BOM Representation và BOM Import Candidate trong BM-01…06. |
| VVP-010 | Anh/Việt/Nhật trên ba bề mặt — REQ-LOC-* | Chín ô kiểm tra ngôn ngữ/bề mặt, kiểm tra nhập–lưu–mở lại, bản dịch và fallback. |
| VVP-011 | Bí mật truy cập, truyền file, cách ly phiên và xử lý file — REQ-SEC-* | Kết quả quét, thử truy cập trái phép, giới hạn tài nguyên và dữ liệu gốc được giữ. |
| VVP-012 | Dữ liệu tạm, dừng/khởi động lại, thông báo và dữ liệu phụ — REQ-OPS-001/002 | Hồ sơ đối soát và khôi phục phần phụ, đối chiếu kết quả nghiệp vụ chính thức. |
| VVP-013 | Sao lưu và khôi phục — REQ-OPS-003/004 | Danh sách sao lưu, môi trường khôi phục và đối chiếu toàn bộ bản thuộc diện lưu giữ. |
| VVP-014 | Quy mô, tốc độ, tính sẵn sàng, RPO/RTO — REQ-OPS-005 | Tải và ngưỡng được duyệt, số đo gốc, cấu hình môi trường, kết luận theo từng ngưỡng. |
| VVP-015 | Cấp/đăng nhập/khôi phục/khóa tài khoản, thu hồi phiên, tách quyền và giữ lịch sử — REQ-IAM-* | Thử tài khoản/phiên cũ, đăng ký trái phép, khôi phục dùng lại, quyền tài liệu, admin đầu/cuối và bản sửa được bảo toàn. |

Một kết quả kiểm tra phải nêu phiên bản yêu cầu và phần mềm, dữ liệu/cấu hình/môi trường, người và
ngày thực hiện, kết quả mong đợi/thực tế, bằng chứng và sai lệch. Thiếu bằng chứng không được ghi đạt.

Một người đóng nhiều tài khoản giả lập có thể kiểm tra chức năng có giới hạn, nhưng không thay cho
người xét duyệt độc lập hoặc người dùng đại diện. Bản HTML đã review chỉ chứng minh hướng bố cục và
cách tương tác; không chứng minh lưu trữ thật, phân quyền thật, giao dịch đồng thời hoặc khôi phục.

## 10. Các điểm phải làm rõ trước khi chốt

Những mục sau là khoảng trống của đặc tả/đầu vào, không phải lỗi đã quan sát trên một sản phẩm chạy
thật. Người soạn có trách nhiệm chuẩn bị đề xuất; khi thiếu người chuyên môn thì báo anh để phân
công hoặc quyết định cách xử lý, không tự coi là đã có người đủ điều kiện.

### 10.1. Điểm đã giải quyết

| Mã | Quyết định đã chốt | Xác nhận và ảnh hưởng |
|---|---|---|
| SPEC-OPEN-01 | Mỗi Business Revision có một Version bắt đầu từ 1. Check-in có thay đổi tăng Version đúng một lần và tạo đúng một Generation mới; No Change không tăng Version/không tạo Generation; Revision mới bắt đầu lại ở Version 1. Không có trường Version Sequence riêng. | Người dùng dự án xác nhận ngày 04-09-2026. Đã đồng bộ REQ-ID-002, mô hình dữ liệu, kiến trúc, UI và prototype. Đây là review nội bộ của điểm này, chưa phải quyết định Spec của sếp. |

### 10.2. Điểm còn mở

| Mã | Nội dung cần làm rõ | Người chuẩn bị / quyết định | Mốc phải giải quyết |
|---|---|---|---|
| SPEC-OPEN-02 | Tìm/duyệt cơ bản đã nằm trong phạm vi nhưng chưa có yêu cầu đủ chi tiết: tra theo thông tin nào, trong phạm vi nào, kết quả theo quyền ra sao và kiểm tra thế nào. | Người soạn viết yêu cầu từ công việc thực tế, anh review, sếp quyết định mức phạm vi. | Trước chốt Spec phần tìm/duyệt; cấp mã và cập nhật nguồn/trace theo quy trình, không ngầm đưa tìm kiếm nâng cao vào Core v0. |
| SPEC-OPEN-03 | Các giá trị cấu hình nghiệp vụ ban đầu: loại tài liệu, trường bắt buộc, chuẩn hóa để so sánh, đánh số, vai trò/nhóm, quy trình, thời hạn giữ sửa/gia hạn và điều kiện khôi phục. | Người soạn cùng người quản trị đề xuất; sếp quyết định nghiệp vụ. Người vận hành cụ thể chưa được chỉ định. | Chốt cấu hình làm cơ sở nghiệm thu trước khi duyệt các phần Spec phụ thuộc; xác minh lại trước thử nghiệm thực tế. |
| SPEC-OPEN-04 | **Đã rõ một phần:** tạo tự động đi qua Adapter và ứng dụng/bộ chuyển đổi đã kiểm chứng; tải lên thủ công dùng cùng quan hệ với Generation nguồn; chưa giả định bộ chuyển đổi chung cho mọi CAD. Còn thiếu danh sách định dạng, phiên bản ứng dụng, đường tự động cụ thể của IRONCAD, file mẫu, license và giới hạn dung lượng. | Người soạn cùng kỹ thuật thiết kế đề xuất; sếp quyết định phạm vi; chuyên môn định dạng kiểm chứng. | Trước cam kết hỗ trợ từng định dạng và chạy VVP-008; chưa được gọi “hỗ trợ mọi file”. |
| SPEC-OPEN-05 | **Đã rõ một phần:** 50–100 tổng người dùng tại một địa điểm; bộ file ước lượng MB–GB; mục tiêu sơ bộ RTO 4 giờ làm việc / RPO 1 giờ. Còn thiếu tải đồng thời, file lớn/tổng kho/tăng trưởng, độ trễ, tính sẵn sàng, giới hạn worker/truyền file và cách tính giờ khôi phục. | Anh có thể vận hành ban đầu; người lâu dài/thay thế và reviewer chuyên môn chưa được chỉ định. | Chốt tải/môi trường/cách đo, rồi thử và so với mục tiêu được duyệt trước khi cho REQ-OPS-005 đạt điều kiện triển khai. |
| SPEC-OPEN-06 | **Đã rõ một phần:** máy kỹ sư Windows, tài khoản IDEA trước, anh quản trị tài khoản; IT/quản lý hệ thống và hỗ trợ kỹ thuật xử lý quyền cài/triển khai. Còn thiếu phiên bản OS/browser/CAD, hiển thị/bộ gõ Nhật, mạng/server và chính sách mật khẩu/MFA/phiên/kênh khôi phục. | Anh làm việc với các phòng liên quan; người soạn đề xuất; sếp quyết định Spec/Tech trong phạm vi thẩm quyền. | Trước chốt hỗ trợ và thử tài khoản/dữ liệu thật; đăng nhập công ty để sau, 1440×900 vẫn chỉ là khung kiểm tra demo. |
| SPEC-OPEN-07 | Dự án/người dùng đại diện, người phê duyệt đủ điều kiện và người đánh giá bảo mật, dữ liệu, khả năng tiếp cận, ngôn ngữ, vận hành. | Sếp chọn hoặc giao anh thu xếp; người soạn nêu nhiệm vụ và phần còn thiếu. | Trước các bước review/gate và thử nghiệm yêu cầu vai trò đó; không dùng self-review làm bằng chứng độc lập. |
| SPEC-OPEN-08 | Phân loại truy cập, thời hạn lưu dữ liệu/Audit, điều kiện giữ hồ sơ, bộ dữ liệu sao lưu và cách bảo quản thành phần mật mã phục vụ khôi phục. | Người soạn cùng IT/chất lượng/vận hành đề xuất; người có thẩm quyền trong công ty quyết định. | Trước duyệt chính sách liên quan và thử sao lưu/khôi phục; giao diện Purge đầy đủ vẫn ngoài phạm vi. |

Các nhóm vấn đề về nghiệp vụ, định dạng, vai trò và môi trường đã có trong BREQ-GAP-001…006 cùng
DOC-06/08/VVP. SPEC-OPEN-01 đã được giải quyết theo bảng trên. SPEC-OPEN-02…08 vẫn là bảy điểm mở;
việc ghi rõ trách nhiệm và mốc xử lý không có nghĩa là các điểm đó đã được sếp duyệt.

## 11. Nội dung trình sếp quyết định và trạng thái review

Đề nghị sếp xem xét hành vi và điều kiện đạt trong Spec, đặc biệt:

1. Check-in thành công hoặc không có thay đổi đều bỏ giữ đúng phạm vi; Check-in lỗi không làm mất
   bản sửa và không tự hủy quyền còn hợp lệ.
2. Duyệt và phát hành phải gắn đúng bản, đúng cấu trúc, đúng người đủ quyền; không phát hành một phần.
3. Workflow có thể thay theo loại tài liệu và phiên bản, nhưng mỗi lần chạy phải giữ đúng cấu hình
   đã chọn; cấu hình sai hoặc thiếu người bắt buộc thì không được tự bỏ qua.
4. File, thông tin, chính sách và lịch sử phải đủ để lấy lại bộ hồ sơ cũ; khả năng xử lý từng định
   dạng phải được chứng minh riêng.
5. Move/Rename phải giữ đúng danh tính tài liệu; Create Copy phải tạo danh tính mới; folder người
   dùng nhìn thấy không được trở thành đường dẫn vật lý quyết định danh tính.
6. BOM phải xuất phát từ đúng mốc cấu trúc và profile; Excel/PDF/CSV chỉ là bản xuất hoặc dữ liệu
   đề nghị nhập, không được âm thầm trở thành cấu trúc chính thức.
7. Đầu ra phòng ban được quản lý như tài liệu/cấu trúc/bằng chứng phù hợp; các giá trị về giờ, chi
   phí, mua hàng, gia công, tiến độ hoặc hoàn thành không tự biến IDEA thành hệ thống vận hành nghiệp vụ đó.
8. Mức sử dụng, định dạng, môi trường và các điểm còn mở tại mục 10 cần được chốt hoặc có quyết định
   điều kiện/phạm vi rõ ràng trước khi dùng làm cam kết.

| Nội dung kiểm soát | Trạng thái |
|---|---|
| Review nội bộ SPEC-001@0.15 | PARTIAL — kế thừa nội dung bản 0.13 nhưng không tự kế thừa kết quả review toàn bản; các quyết định trước đây và policy tự duyệt theo hướng Microsoft-style đã được xác nhận riêng; toàn bộ bản 0.15 chưa được review trọn vẹn |
| Review bản trước | [RVW-FEATURE-SPEC-20260903-001](VERSION-HISTORY.md#5-ghi-nhận-review-nội-bộ-ngày-03-09-2026) giữ cho Feature 0.3 / Spec 0.4; không tự áp dụng cho bản mới |
| Lần đồng ý với SPEC-001@0.3 | Đã được anh rút lại; không còn hiệu lực |
| Quyết định Feature của sếp | Chưa có; là điều kiện trước quyết định Spec |
| Quyết định Spec của sếp | Chưa có — NOT-RUN |
| Khả năng chốt toàn bộ Spec lúc này | Chưa đủ: còn bảy điểm chi tiết và đầu vào cần giải quyết tại mục 10 |
| Kiểm thử / thẩm định / cho phép sử dụng thật | Chưa thực hiện hoặc chưa có quyết định; không suy ra từ việc viết xong tài liệu |

Khi có quyết định, phải ghi người quyết định, thời điểm, phiên bản Spec/Feature và nguồn được xem
xét, nội dung đồng ý, phần loại trừ và việc còn phải làm. Đồng ý bản Spec không đồng nghĩa phê duyệt
Tech hoặc cho phép triển khai production.

## Phụ lục A — Liên kết về tính năng và tài liệu nguồn

### A.1. Kiểm soát số lượng và nguồn yêu cầu

| Nhóm mã | Số yêu cầu | Tính năng chính liên quan |
|---|---:|---|
| REQ-ID | 9 | FTR-001, FTR-002 |
| REQ-WS | 13 | FTR-003, FTR-004, FTR-005, FTR-006 |
| REQ-STR | 6 | FTR-007, FTR-009, FTR-010 |
| REQ-LC | 9 | FTR-002, FTR-008, FTR-009, FTR-010 |
| REQ-GOV | 5 | FTR-008, FTR-011, FTR-012 |
| REQ-AUD | 2 | FTR-011 |
| REQ-FMT | 5 | FTR-004, FTR-013 |
| REQ-UX | 6 | FTR-003, FTR-007, FTR-009, FTR-011, FTR-013, FTR-014 |
| REQ-LOC | 3 | FTR-014 |
| REQ-SEC | 4 | FTR-004, FTR-011, FTR-013 |
| REQ-OPS | 5 | FTR-005, FTR-008, FTR-010, FTR-011 |
| REQ-IAM | 7 | FTR-011 |
| Tổng | 74 | 14 nhóm tính năng |

Bảng trên để tra cứu nhóm, không thay thế liên kết từng yêu cầu trong DOC-04. Giữ nguyên 61 mã cũ,
thêm bảy mã REQ-IAM-001…007, ba mã REQ-ID-007…009 và ba mã REQ-STR-004…006, tổng 74. Các cột tiếng Việt ở mục
4, 5 và 7 diễn giải yêu cầu và điều kiện kiểm tra từ cùng nguồn. Dữ liệu và
giao tiếp ở mục 3/6, cùng chi tiết giao diện ở mục 5, còn đọc theo DOC-06/08 được ghim bên dưới.
Trước khi duyệt, những chi tiết cần yêu cầu riêng phải được bổ sung vào nguồn và trace, không chỉ
xuất hiện trong bản trình sếp.

### A.2. Phiên bản nguồn

| Nguồn | Mã / phiên bản | Vai trò |
|---|---|---|
| [Feature](FEATURE-001-feature-definition-and-scope.md) | FEATURE-001@0.12 — Draft | Phạm vi 14 nhóm tính năng; làm rõ item/folder, BOM/file và đầu ra phòng ban; chưa có quyết định của sếp |
| [DOC-03](../DOC-03-business-requirements.md) | IE-PROD-BREQ-001@0.5 — Draft | Quy tắc nghiệp vụ, phạm vi đầu ra phòng ban và các khoảng trống đầu vào |
| [DOC-04](../DOC-04-software-requirements-specification.md) | IE-PROD-SREQ-001@0.10 — Draft | Nguồn của 74 mã yêu cầu, mức ưu tiên và trace; REQ-GOV-003 làm rõ dữ liệu vận hành tham khảo |
| [DOC-06](../DOC-06-data-integration-and-migration-specification.md) | IE-PROD-DATA-001@0.10 — Draft | Mô hình dữ liệu, folder/vị trí/copy, BOM view/export/import, đầu ra phòng ban, Workflow/Representation/Access Policy, tính bất biến và nguồn dữ liệu |
| [DOC-08](../DOC-08-ui-ux-and-interaction-specification.md) | IE-PROD-UX-001@0.6 — Draft | Người dùng, luồng giao diện, tác động của Move/Rename/Create Copy, BOM và ngôn ngữ |
| [VVP](../registers/VVP-core-v0-verification-validation-plan.md) | IE-VVP-CORE-001@0.11 — Draft | 15 nhóm kiểm tra dự kiến; gồm DH-01…04 cùng các bộ SR/CR/WF/AC/IF/BM, tất cả `NOT-RUN` |

Bản 0.14 chỉ đồng bộ các phiên bản nguồn. Không thêm hoặc bỏ yêu cầu, không đóng bảy điểm Spec
còn mở và không tạo kết quả kiểm thử hay quyết định của sếp.
| [Thuật ngữ và ràng buộc dự án](../../../../../CONTEXT.md) | Bản làm việc được ghim SHA-256 trong sổ phiên bản | Ranh giới sản phẩm, mô hình tài liệu và điều kiện làm việc offline; quy tắc Check-in riêng của Core v0 đọc theo DOC-03/04 |

Bộ tài liệu: IDEA-C1-ANALYSIS-DESIGN-001. Bộ yêu cầu nguồn: IE-SPEC-CORE-V0-001@0.9.
Dấu kiểm tra SHA-256 nằm trong [sổ phiên bản](VERSION-HISTORY.md).

Đây là bản tiếng Việt phục vụ quyết định, không phải một bộ yêu cầu có thẩm quyền tách khỏi tài liệu
nguồn. Nếu một nguồn thay đổi, phải đối chiếu và cập nhật bản trình; không mặc nhiên giữ kết quả review
hoặc quyết định trước đó. Các điểm mâu thuẫn được nêu ra để giải quyết, không được âm thầm sửa chỉ
trong bản tiếng Việt.

## Phụ lục B — Cách viết và lịch sử

Cấu trúc được tổ chức theo nội dung cần có của đặc tả: phạm vi, người dùng, dữ liệu, hành vi, giao tiếp,
chất lượng, điều kiện kiểm tra, liên kết nguồn và việc chưa chốt. Cách viết tham khảo nguyên tắc của
[ISO/IEC/IEEE 29148:2018](https://www.iso.org/standard/72089.html) và hướng dẫn
[SRS của NASA](https://swehb.nasa.gov/spaces/7150/pages/16449740/SWE-109+-+Software+Requirements+Specification).
Đây không phải tuyên bố đã đánh giá tuân thủ toàn bộ tiêu chuẩn; cũng không coi một thứ tự chương là
mẫu bắt buộc cho mọi sản phẩm.

| Phiên bản | Diễn giải |
|---|---|
| [0.3](SPEC-001-product-specification.v0.3.md) | Giữ lại nguyên nội dung bản kể theo tình huống P-100 và trạng thái đã rút đồng ý. Không dùng như bản được duyệt. |
| 0.4 — bản đã được review, giữ trong lịch sử | Viết lại thành đặc tả: đặt 61 mã bên cạnh yêu cầu/điều kiện kiểm tra; bổ sung cách đọc dữ liệu, giao tiếp, tình huống lỗi và danh sách điểm cần chốt; giữ phạm vi và mức ưu tiên của nguồn. Anh đã duyệt nội bộ ngày 03-09-2026; không đổi nội dung yêu cầu hoặc đóng các điểm còn mở khi ghi nhận review. |
| 0.5 | Thêm bảy yêu cầu tài khoản, ghi đúng bối cảnh và mục tiêu khôi phục sơ bộ, cập nhật nguồn/trace; không tự đóng các điểm Spec còn mở. |
| 0.6 | Giải quyết SPEC-OPEN-01: giữ một Version trong mỗi Revision, giữ Generation làm snapshot bất biến và loại bỏ Version Sequence. |
| 0.7 | Bổ sung tình huống phát hành cụm bơm trong khi tủ điện và hồ sơ toàn máy còn In Work. |
| 0.8 | Làm rõ cách tạo PDF/neutral file và gắn Representation với đúng Generation CAD nguồn. |
| 0.9 | Làm rõ nhiều workflow có phiên bản, lựa chọn theo loại tài liệu, phần được cấu hình và WF-01…06; giữ nguyên 68 mã REQ. |
| 0.10 | Tách Identity khỏi Access Policy; quy định JSON chỉ là định dạng nhập/xuất ứng viên và thêm AC-01…05. |
| 0.11 | Quy định folder/vị trí độc lập với đường dẫn vật lý, Move/Rename giữ danh tính và Create Copy tạo danh tính mới; thêm REQ-ID-007…009 và IF-01…06, tổng 71 mã REQ. |
| 0.12 | Phân biệt BOM được quản lý với file Excel/PDF/CSV; quy định BOM View Profile, BOM Representation, BOM Import Candidate và parts list độc lập; thêm REQ-STR-004…006 và BM-01…06, tổng 74 mã REQ. |
| 0.13 | Làm rõ đầu ra phòng ban dùng các cơ chế tài liệu/cấu trúc/bằng chứng hiện có; dữ liệu giờ, chi phí, mua hàng, gia công, tiến độ và hoàn thành chỉ là thông tin tham khảo nếu chưa có Feature/hợp đồng tích hợp được duyệt riêng; thêm DH-01…04, giữ 74 mã REQ. |
| 0.14 | Đồng bộ phiên bản Feature, DOC-03/04/06/08 và VVP; không đổi 74 yêu cầu, không đóng bảy điểm còn mở và không tạo quyết định Spec. |
| 0.15 — hiện tại | Ghi nhận successor tách RBAC khỏi Approval Policy; `AllowSelfApproval` mặc định tắt, chỉ bật theo policy version, không vượt policy độc lập và không cấp Release; PDA review của successor `NOT-RUN`. |

Các nguồn trước thay đổi Tech được giữ trong archive của
[CHG Tech](../registers/CHG-2026-09-03-tech-context-and-proposal.md). Quyết định Version được ghi tại
[CHG Version](../registers/CHG-2026-09-04-version-model-clarification.md). [Sổ phiên bản](VERSION-HISTORY.md)
ghim bản mới và giữ nguyên phạm vi review cũ. [CHG Workflow](../registers/CHG-2026-09-07-workflow-configuration.md)
ghi quyết định cấu hình workflow. [CHG phân quyền](../registers/CHG-2026-09-07-authorization-data-boundary.md)
ghi ranh giới Identity/Access Policy/JSON. [CHG danh tính item/folder](../registers/CHG-2026-09-07-item-folder-identity.md)
ghi các quy tắc Move/Rename/Create Copy và IF-01…06. [CHG BOM/cấu trúc](../registers/CHG-2026-09-07-bom-structure-representation.md)
ghi ranh giới BOM/file và BM-01…06. [CHG phạm vi đầu ra phòng ban](../registers/CHG-2026-09-07-departmental-deliverable-scope.md)
ghi ranh giới hồ sơ kỹ thuật/dữ liệu vận hành và DH-01…04. [CHG đồng bộ nguồn](../registers/CHG-2026-09-09-cross-document-reconciliation.md)
ghi lần cập nhật 0.14; bản hiện hành chưa được tự coi là đã duyệt toàn bộ.
