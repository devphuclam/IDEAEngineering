# SPEC-001 — Đặc tả sản phẩm IDEA Engineering Core v0

| Thông tin | Nội dung |
|---|---|
| Mã tài liệu | SPEC-001 |
| Phiên bản / ngày soạn | 0.4 / 03-09-2026 |
| Trạng thái | Draft — chờ anh review; chưa có quyết định Spec của sếp |
| Mục đích | Xác định sản phẩm phải hoạt động thế nào và kiểm tra theo điều kiện nào |
| Phạm vi | 14 nhóm tính năng trong FEATURE-001@0.3; 61 yêu cầu có mã trong DOC-04@0.1 |
| Người soạn / review | Principal Product Author / người dùng dự án; bản 0.4 chưa được review |
| Người quyết định | Sếp — Product Decision Authority |
| Kết quả kiểm thử sản phẩm | Chưa thực hiện — NOT-RUN |

## 1. Phạm vi và cách đọc

IDEA Engineering dùng trong nội bộ công ty để quản lý tài liệu thiết kế từ lúc đưa vào hệ thống,
sửa, xét duyệt đến phát hành và tra cứu lại. Người dùng tiếp tục sửa file bằng Office/CAD; IDEA
kiểm soát danh tính tài liệu, các bản đã lưu, quyền sửa, cấu trúc sản phẩm và lịch sử quyết định.

**Feature** quyết định có làm một tính năng hay không. **Spec** quy định tính năng đó phải làm đúng
điều gì. **Tech** lựa chọn cách xây dựng để đáp ứng các quy định đó. Bản này không chọn ngôn ngữ lập
trình, database hoặc bộ công cụ làm giao diện.

Các yêu cầu dưới đây là đề xuất để review, chưa phải một bộ yêu cầu đã phê duyệt. Mỗi yêu cầu giữ
nguyên mã REQ của tài liệu nguồn; mã này dùng để nối tính năng, thiết kế và kết quả kiểm thử sau này.

- Cột **Yêu cầu** nêu hành vi sản phẩm phải đáp ứng.
- Cột **Kiểm tra thế nào là đạt?** nêu kết quả cần quan sát; không phải kết quả đã chạy.
- Mặc định các yêu cầu có mức **bắt buộc trong Core v0**, trạng thái Draft. Hai ngoại lệ về mức ưu
  tiên là REQ-UX-006 và REQ-OPS-005 được ghi ngay tại dòng tương ứng.
- Ví dụ giúp giải thích quy tắc, không thay thế quy tắc hoặc bổ sung phạm vi ngoài Feature.
- Những điểm chưa đủ rõ nằm ở mục 10. Có 61 mã yêu cầu không đồng nghĩa là Spec đã đầy đủ để duyệt:
  một số chi tiết từ tài liệu dữ liệu/giao diện vẫn cần hoàn thiện và liên kết trước khi chốt.

Ngoài phạm vi: tích hợp ERP/MRP tổng quát, ECR/ECO đầy đủ, workflow designer hoàn chỉnh, đồng bộ nhiều
cơ sở, lệnh quản trị offline, Purge tự động và sản phẩm thương mại. Xem đầy đủ tại
[Feature, mục 5](FEATURE-001-feature-definition-and-scope.md#5-những-phần-chưa-đưa-vào-core-v0).

## 2. Người dùng, dữ liệu và trạng thái

### 2.1. Vai trò sử dụng

| Vai trò | Việc được thực hiện khi có quyền | Điều không được mặc nhiên suy ra |
|---|---|---|
| Người soạn / kỹ sư | Đăng ký tài liệu, Checkout, sửa, Check-in và gửi xét duyệt. | Là chủ tài liệu không có nghĩa là được tự duyệt Revision mình đã sửa. |
| Người xét duyệt / phê duyệt | Xem đúng bản được gửi; phê duyệt hoặc trả lại theo chính sách. | Một tài khoản bất kỳ không được thay cho người phê duyệt còn thiếu. |
| Người có quyền phát hành | Xác nhận phạm vi và phát hành khi đủ điều kiện. | Không được bỏ qua kiểm tra chỉ vì nút Release đang hiển thị. |
| Người quản trị | Quản lý nhóm, quyền, biểu mẫu, đánh số và định nghĩa quy trình. | Quyền quản trị thông thường không cho sửa lịch sử hoặc tự bỏ qua điều kiện độc lập. |
| Người tra cứu / kiểm tra hồ sơ | Xem và xuất dữ liệu trong quyền được cấp, đọc Audit. | Có đường dẫn file không đồng nghĩa có quyền truy cập. |

Trong dự án, anh review tài liệu và sếp quyết định Feature/Spec/Tech. Việc đó không tự gán cho hai
người một vai trò vận hành trong phần mềm. Danh sách người dùng và quyền thật còn phải được xác định.

### 2.2. Các khái niệm cần phân biệt

| Khái niệm | Cách hiểu trong Spec này |
|---|---|
| Tài liệu / Logical Document | Một đối tượng được quản lý lâu dài, có mã ổn định; có thể gồm file chính và các file liên quan. Không chỉ là tên file trên Windows. |
| Mã định danh / Document ID | Mã để hệ thống luôn nhận ra đúng tài liệu dù file được đổi tên hoặc chuyển thư mục. |
| Mã nghiệp vụ / Business Number | Số tài liệu theo quy tắc của công ty. Có thể cấu hình cách cấp số; khác Document ID. |
| Revision | Đợt sửa đổi có kiểm soát, ví dụ A rồi B. Revision đã phát hành phải được giữ nguyên khi bắt đầu Revision tiếp theo. |
| Version | Bản trong một Revision theo mô hình nguồn. Quy tắc định dạng và quan hệ với trường Version Sequence còn phải làm rõ tại SPEC-OPEN-01; không dùng con số trên prototype để tự chốt. |
| Version Sequence | Trường số thứ tự bắt đầu từ 1 và tăng trong một Revision theo DOC-06. Nguồn đang yêu cầu phân biệt trường này với Version nhưng chưa giải thích đủ sự khác nhau. |
| Generation | Mốc dữ liệu chính xác, không bị sửa lại sau Check-in: gắn nội dung file, thông tin tài liệu và cấu trúc tại thời điểm đó. Dùng để biết đúng bản nào đã được xem, duyệt hoặc phát hành. |
| Workspace | Nơi IDEA quản lý các bản làm việc trên máy của một người dùng. File ở đây chưa mặc nhiên là nội dung chính thức trên hệ thống. |
| Checkout / Reference | Checkout lấy quyền sửa trong phạm vi xác nhận; Reference lấy đúng bản để tham khảo mà không có quyền Check-in vào tài liệu đó. |
| Audit | Lịch sử có kiểm soát về người thực hiện, thời điểm, đối tượng, quyết định và kết quả. |

Generation phục vụ việc xác định chính xác dữ liệu. Ví dụ, hồ sơ phát hành đã dùng một mốc G-014 thì
sau này phải lấy lại G-014, không đổi sang G-015 chỉ vì đó là mốc mới nhất. Các mã G-014/G-015 ở đây
chỉ là ví dụ, không quy định cách đánh mã của sản phẩm.

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

Vòng đời mặc định: **Start → In Work → Under Review → Released**. Đây là quy trình ban đầu có cấu
hình, không phải quy trình duy nhất được đóng cứng trong chương trình.

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

## 3. Dữ liệu đầu vào, đầu ra và nguyên tắc chung

| Dữ liệu / hồ sơ | Đầu vào hoặc nội dung cần có | Kết quả và điều kiện bảo toàn | Liên kết |
|---|---|---|---|
| Đăng ký tài liệu | File có sẵn hoặc yêu cầu tạo mới; thông tin theo loại tài liệu; nguồn gốc nhập. | Cấp danh tính riêng; giữ nguyên file gốc; cảnh báo khả năng trùng, không tự gộp. | REQ-ID-001/005/006; DOC-06 mục 5 |
| Thông tin tài liệu | Giá trị các trường theo đúng phiên bản biểu mẫu và quy tắc kiểm tra. | Dữ liệu gắn phiên bản quy tắc đã dùng; thiếu/sai thông tin phải được chỉ rõ. | REQ-GOV-003 |
| Bản nội dung / Generation | File và dấu kiểm tra nội dung, thông tin đã kiểm tra, cấu trúc và nguồn tạo dữ liệu. | Mốc bất biến; thay đổi tiếp theo tạo mốc mới, không ghi đè mốc cũ. | REQ-ID-002/004; REQ-WS-008/009 |
| Bộ file làm việc | Danh sách tài liệu, mốc cần lấy, chế độ Checkout/Reference, người dùng và Workspace. | Chỉ báo sẵn sàng sau khi xác minh đúng nội dung tải về. | REQ-WS-001…004 |
| Cấu trúc sản phẩm | Các thành phần, lần xuất hiện, quan hệ và mốc tài liệu cụ thể. | Lưu được đúng cấu trúc lịch sử; không âm thầm thay bằng bản mới nhất. | REQ-STR-001…003 |
| Hồ sơ xét duyệt | Người tham gia, bản gửi duyệt, phạm vi, phiên bản workflow và chính sách. | Quyết định không tự áp dụng cho bản đã thay đổi. | REQ-LC-001…005 |
| Hồ sơ / gói phát hành | Phạm vi đã xác nhận, quyết định duyệt, file, thông tin, cấu trúc và bằng chứng. | Lấy lại đúng bộ đã phát hành; sai/thiếu một thành phần phải được báo. | REQ-LC-006…008 |
| Lịch sử thao tác | Người thực hiện, thời điểm, thao tác, đối tượng, chính sách và kết quả. | Ghi bổ sung, không cho sửa/xóa bằng quyền quản trị thông thường. | REQ-AUD-001/002 |

Tên file, đường dẫn hoặc ngày sửa file không được dùng như bằng chứng tài liệu đã được duyệt.
Lịch sử và nhãn Revision nhập từ kho cũ cần được đối chiếu; không tự coi chúng tương đương lịch sử
phê duyệt trong IDEA. Chuyển đổi hàng loạt dữ liệu cũ nằm ngoài phạm vi hiện tại.

## 4. Yêu cầu chức năng và quy tắc nghiệp vụ

### 4.1. Tiếp nhận và nhận diện tài liệu

Tính năng liên quan: FTR-001, FTR-002. Cách kiểm tra tổng hợp: VVP-001.

| Mã | Yêu cầu | Kiểm tra thế nào là đạt? |
|---|---|---|
| REQ-ID-001 | Hệ thống phải dùng một Document ID ổn định, không phụ thuộc tên file, đường dẫn, mã nghiệp vụ, Revision hoặc Generation. | Đổi tên, chuyển thư mục, Check-in và tạo Revision; Document ID vẫn không đổi và truy được lịch sử. |
| REQ-ID-002 | Hệ thống phải phân biệt Business Revision, Version trong Revision, Version Sequence và Generation, không dùng tên này thay cho tên khác. | Đối chiếu mô hình dữ liệu, chuyển trạng thái và giao diện. Chưa thể kết luận đạt trước khi xử lý SPEC-OPEN-01 về Version/Version Sequence. |
| REQ-ID-003 | Tài liệu ở Start được phép chưa có Generation hoặc mốc làm việc hiện tại; không được gửi duyệt, phát hành hoặc coi là bản tham chiếu đã phát hành khi chưa có bản nội dung hoàn chỉnh. | Tạo tài liệu chưa có nội dung; các thao tác cần bản nội dung bị từ chối; không có Generation rỗng được tạo cho đủ số. |
| REQ-ID-004 | Theo chính sách ban đầu, lần ghi nhận nội dung đầu tiên phải tạo trọn Revision A, Version 1, Generation đầu tiên và mốc làm việc hiện tại trong cùng kết quả thành công. | Gây lỗi trước khi hoàn tất: không có phần tạo dở được xem là bản hợp lệ. Thành công: có đúng một bộ dữ liệu đầu tiên hoàn chỉnh. |
| REQ-ID-005 | Khi tiếp nhận file có sẵn, hệ thống phải kiểm tra thông tin, tên/đường dẫn và dấu kiểm tra nội dung để báo khả năng trùng; người dùng chọn tạo riêng, liên kết hoặc hủy. | Dùng các file trùng tên, trùng nội dung và khác thông tin; có cảnh báo phù hợp, không tự gộp hai danh tính tài liệu. |
| REQ-ID-006 | Tạo mới và tiếp nhận file có sẵn phải dùng cùng mô hình tài liệu/Generation, quyền truy cập, Audit, vòng đời và điều kiện phát hành. | Đi qua cả hai cách tạo; không có đường nào bỏ qua kiểm tra hoặc dùng một kiểu lịch sử riêng. |

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

### 4.5. Cấu trúc sản phẩm và tài liệu liên quan

Tính năng liên quan: FTR-007, FTR-009. Cách kiểm tra: VVP-005.

| Mã | Yêu cầu | Kiểm tra thế nào là đạt? |
|---|---|---|
| REQ-STR-001 | Mỗi bản cấu trúc phải giữ nguyên các thành phần/lần xuất hiện/quan hệ và trỏ đến đúng Generation của tài liệu liên quan để có thể dựng lại sau này. | Lưu cấu trúc nhiều cấp, sau đó tạo bản mới ở các tài liệu; mở cấu trúc cũ vẫn ra đúng các mốc và quan hệ ban đầu. |
| REQ-STR-002 | Tài liệu con có bản mới không được tự sửa cấu trúc hoặc hồ sơ phát hành của tài liệu cha; muốn dùng bản con mới phải ghi nhận thay đổi của cha và xét duyệt theo quy tắc. | Tăng bản của tài liệu con; hồ sơ cha cũ không đổi. Chỉ một thay đổi mới có kiểm soát mới ghi nhận việc dùng bản con mới. |
| REQ-STR-003 | Quan hệ bắt buộc bị thiếu, không giải quyết được, không có quyền hoặc phụ thuộc ngoài chưa đáp ứng phải được chỉ rõ và chặn Release, trừ ngoại lệ phát hành được duyệt đúng phạm vi. | Release bị chặn khi thiếu điều kiện. Nếu có ngoại lệ, kiểm tra đủ đối tượng/mốc được áp dụng, người chịu trách nhiệm, lý do, rủi ro, bằng chứng, người duyệt, thời hạn và điều kiện xem xét lại. |

Ngoại lệ phát hành không phải nút “bỏ qua lỗi”. Nó là một quyết định có phạm vi và trách nhiệm rõ
ràng; một ngoại lệ của bản trước không tự cho phép phát hành bản sau.

### 4.6. Xét duyệt, phát hành và tạo Revision tiếp theo

Tính năng liên quan: FTR-002, FTR-008, FTR-009, FTR-010, FTR-011. Cách kiểm tra: VVP-006.

| Mã | Yêu cầu | Kiểm tra thế nào là đạt? |
|---|---|---|
| REQ-LC-001 | Mỗi lần chạy quy trình phải gắn đúng phiên bản định nghĩa workflow và chính sách phê duyệt; đổi định nghĩa sau đó không được diễn giải lại lịch sử quy trình cũ. | Đổi chính sách sau khi bắt đầu xét duyệt; hồ sơ cũ vẫn chỉ ra và áp dụng đúng phiên bản đã gắn, trừ chuyển đổi được duyệt riêng. |
| REQ-LC-002 | Gửi xét duyệt phải xác định đúng Generation và toàn bộ phạm vi; thay đổi nội dung không được thừa hưởng việc duyệt đang chờ của bản trước. | Thực hiện rút xét duyệt hoặc trả lại về In Work theo chính sách, sửa và gửi lại; lần duyệt mới gắn đúng bản mới, không dùng quyết định của bản cũ. |
| REQ-LC-003 | Chính sách ban đầu phải có một người phê duyệt đủ điều kiện và độc lập với người soạn/sửa Revision; người soạn/sửa không tự phê duyệt hoặc phát hành Revision đó. | Người soạn/sửa bị từ chối ở cả Approve và Release. Người phê duyệt độc lập được Release nếu có quyền tương ứng. |
| REQ-LC-004 | Quyết định xét duyệt phải lưu người thực hiện, thời điểm, đúng phạm vi/bản, chính sách và lý do theo loại quyết định; trả lại bắt buộc có lý do. | Trả lại mà không có lý do bị từ chối; quyết định hợp lệ truy được đầy đủ thông tin và bản được quyết định. |
| REQ-LC-005 | Khi chưa xác định được người tham gia bắt buộc đủ điều kiện, hệ thống phải chặn gửi duyệt, phê duyệt hoặc phát hành tại bước cần vai trò đó và chỉ rõ vai trò còn thiếu. | Không có người phê duyệt đủ điều kiện: không tự gán cho người soạn hoặc tài khoản bất kỳ để đi tiếp. |
| REQ-LC-006 | Trước Release, người dùng phải xem và xác nhận đúng phạm vi; lúc hoàn tất hệ thống phải kiểm tra lại mọi Generation, cấu trúc, phê duyệt, quyền và ngoại lệ liên quan. | Thay đổi một điều kiện sau lúc xem trước nhưng trước khi hoàn tất; cả phạm vi bị từ chối nếu không còn hợp lệ. |
| REQ-LC-007 | Release phải cùng hoàn tất chuyển trạng thái và tạo một hồ sơ phát hành bất biến cho phạm vi đã xác nhận; không phát hành một phần hoặc tự thêm tài liệu ngoài phạm vi. | Gây lỗi tại từng bước; không có hồ sơ thành công dở dang. Thành công chỉ bao gồm phạm vi được xác nhận. |
| REQ-LC-008 | Gói hồ sơ phát hành phải có danh sách thành phần, thông tin được quản lý, cấu trúc/BOM, file, dấu kiểm tra nội dung và nguồn gốc của đúng lần phát hành. | Xuất rồi đối chiếu từng thành phần với hồ sơ phát hành; không thiếu file, sai mốc hoặc âm thầm lấy bản hiện tại thay bản lịch sử. |
| REQ-LC-009 | Tạo Revision mới phải giữ nguyên Revision và hồ sơ đã phát hành, tạo Revision tiếp theo với quy trình mới và bản đầu số 1; được dùng lại nội dung bất biến nhưng không dùng chung trạng thái có thể sửa. | Sau khi sửa Revision mới, bản đã phát hành vẫn nguyên vẹn; phân biệt được quy trình cũ/mới và kiểm tra đúng nội dung được dùng lại. |

### 4.7. Quyền, quy trình, thông tin tài liệu và đánh số

Tính năng liên quan: FTR-008, FTR-011, FTR-012. Cách kiểm tra: VVP-007.

| Mã | Yêu cầu | Kiểm tra thế nào là đạt? |
|---|---|---|
| REQ-GOV-001 | Mỗi danh tính, cấu hình chính sách, trạng thái và hồ sơ Audit phải thuộc đúng một tổ chức quản lý; không cho truy cập chéo ngoài quyền. | Thử dữ liệu của hai tổ chức giả lập: không đọc, sửa hoặc tham chiếu trái phép sang tổ chức kia. Đây là kiểm thử cách ly dữ liệu, không phải bổ sung sản phẩm thương mại nhiều khách hàng. |
| REQ-GOV-002 | Phân quyền phải cấu hình theo vai trò, nhóm và trạng thái bằng chính sách có phiên bản, được kiểm tra và giải thích thống nhất trên Web, Desktop, truyền file, xem trước, xuất file và xử lý nền. | Cùng một người/thao tác/đối tượng cho kết quả quyền nhất quán trên các đường truy cập; không thể vượt quyền bằng cách bỏ qua giao diện. |
| REQ-GOV-003 | Biểu mẫu thông tin, phân loại, quy tắc kiểm tra và đánh số phải có định danh và phiên bản; dữ liệu đã lưu gắn đúng phiên bản đã dùng, không tự đổi khi kích hoạt biểu mẫu mới. | Đổi định nghĩa trường hoặc quy tắc; dữ liệu cũ giữ nguyên và truy được định nghĩa cũ. Chuyển dữ liệu sang định nghĩa mới là thao tác riêng có kiểm soát. |
| REQ-GOV-004 | Mã nghiệp vụ phải duy nhất trong phạm vi được cấu hình, cấp lại cùng yêu cầu không tạo số trùng hoặc số mới ngoài ý muốn, và khác Document ID. | Cấp số đồng thời và gửi lại yêu cầu; không trùng số. Xử lý hủy hoặc khoảng trống số đúng chính sách đã chọn, không tự mặc định. |
| REQ-GOV-005 | Thay đổi chính sách quan trọng phải tạo phiên bản mới áp dụng cho các lần sử dụng sau; chuyển hồ sơ đang có sang quy tắc mới cần xem trước, phê duyệt và Audit. | Hồ sơ cũ không đổi chỉ vì bật chính sách mới. Thử chuyển đổi có/không đủ phê duyệt và đối chiếu lịch sử chuyển đổi. |

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
| REQ-FMT-002 | Khả năng đọc thuộc tính, cấu trúc, xem trước hoặc chuyển đổi phải được mô tả trong hồ sơ hỗ trợ định dạng có phiên bản, nêu rõ không hỗ trợ, làm thủ công, dùng bộ đọc hoặc công cụ ngoài được duyệt và nguồn tạo kết quả. | Đối chiếu đúng phiên bản bộ đọc/ứng dụng với dữ liệu thử; chỉ công bố khả năng đã có bằng chứng, không tự suy ra từ phần mở rộng file. |
| REQ-FMT-003 | IRONCAD là hướng tích hợp sâu đầu tiên; thêm định dạng hoặc công cụ sau này phải qua cùng giao tiếp mà không đổi quy tắc danh tính, Generation, Checkout hoặc Release. | Thử thêm một hồ sơ hỗ trợ định dạng tại cùng điểm mở rộng; các quy tắc cốt lõi không đổi. Phiên bản IRONCAD thực tế còn chờ SPEC-OPEN-04. |
| REQ-FMT-004 | Không được chạy mã IDEA bên trong Office/CAD; đọc dữ liệu, tạo bản xem hoặc chuyển đổi phải tách khỏi ứng dụng thiết kế và lỗi xử lý không được làm hỏng file gốc. | Kiểm tra thành phần triển khai; thử công cụ xử lý lỗi hoặc dừng giữa chừng: file gốc và trạng thái sản phẩm không bị thay đổi sai. |
| REQ-FMT-005 | Bản xem trước hoặc file chuyển đổi phải được nhận diện là dữ liệu dẫn xuất, gắn Generation nguồn và công cụ/phiên bản đã tạo; không thay nguồn chính thức. | Nguồn có bản mới: bản xem của nguồn cũ không được hiển thị như bản xem hiện tại. Truy được nguồn và công cụ đã tạo. |

Lưu được file PDF không đồng nghĩa đã kiểm chứng chữ ký số PDF. Mở được file CAD cũng không đồng
nghĩa đọc được cấu trúc lắp ráp. Mức hỗ trợ phải được nêu riêng cho từng định dạng và phiên bản.

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

RPO là mức mất dữ liệu tối đa được chấp nhận khi có sự cố; RTO là thời gian tối đa để khôi phục dịch
vụ. Spec này chưa đặt các con số đó thay công ty. Cũng chưa có cam kết số người dùng đồng thời,
dung lượng file tối đa hoặc thời gian phản hồi.

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

## 9. Kế hoạch kiểm tra và điều kiện kết luận

Nguồn kế hoạch: [VVP-001…014](../registers/VVP-core-v0-verification-validation-plan.md).
Mọi kết quả hiện là **NOT-RUN**. Bảng dưới là cách tổ chức kiểm tra, không phải một danh sách đã được
tick đạt. Mỗi mã yêu cầu tại mục 4, 5 và 7 đều có điều kiện kiểm tra riêng.

| Mã kế hoạch | Phạm vi kiểm tra | Bằng chứng cần lưu |
|---|---|---|
| VVP-001 | Danh tính, bản đầu, Revision/Version/Generation — REQ-ID-* | Dữ liệu trước/sau và lịch sử các bản; kết quả xử lý SPEC-OPEN-01. |
| VVP-002 | Phạm vi Checkout/Reference, lấy file, kiểm tra trước Check-in — REQ-WS-001…006 | Danh sách đã xác nhận, file/dấu kiểm tra, kết quả thao tác và ảnh giao diện. |
| VVP-003 | Check-in cùng thành công/cùng thất bại và gửi lại thao tác — REQ-WS-007…012 | Kết quả gây lỗi từng bước; không có bản dữ liệu tạo dở hoặc kết quả trùng. |
| VVP-004 | Bản đã cũ, sai người/Workspace, hết hạn và khôi phục — REQ-WS-010/011/013 | Kết quả từ chối/khôi phục, bản trước/sau trên máy, Audit. |
| VVP-005 | Cấu trúc và mốc tài liệu liên quan — REQ-STR-* | Cấu trúc nhiều cấp, trường hợp quan hệ vòng/thiếu dữ liệu, kết quả dựng lại bản cũ. |
| VVP-006 | Quy trình, phê duyệt, Release, Revision mới — REQ-LC-* | Quyết định, phiên bản chính sách, phạm vi, hồ sơ phát hành và thử lỗi. |
| VVP-007 | Quyền, cấu hình, đánh số và Audit — REQ-GOV-*, REQ-AUD-* | Ma trận quyền, cấp số đồng thời/gửi lại, đối soát sự kiện và thử can thiệp lịch sử. |
| VVP-008 | Khả năng từng định dạng và IRONCAD — REQ-FMT-* | File thử, phiên bản ứng dụng/bộ đọc, khả năng đạt/chưa đạt và lỗi xử lý có giới hạn. |
| VVP-009 | Luồng giao diện, cuộn, icon, bàn phím, hộp thoại — REQ-UX-* | Cấu hình hiển thị, ảnh, nhật ký thao tác và đánh giá tiếp cận theo phạm vi. |
| VVP-010 | Anh/Việt/Nhật trên ba bề mặt — REQ-LOC-* | Chín ô kiểm tra ngôn ngữ/bề mặt, kiểm tra nhập–lưu–mở lại, bản dịch và fallback. |
| VVP-011 | Bí mật truy cập, truyền file, cách ly phiên và xử lý file — REQ-SEC-* | Kết quả quét, thử truy cập trái phép, giới hạn tài nguyên và dữ liệu gốc được giữ. |
| VVP-012 | Dữ liệu tạm, dừng/khởi động lại, thông báo và dữ liệu phụ — REQ-OPS-001/002 | Hồ sơ đối soát và khôi phục phần phụ, đối chiếu kết quả nghiệp vụ chính thức. |
| VVP-013 | Sao lưu và khôi phục — REQ-OPS-003/004 | Danh sách sao lưu, môi trường khôi phục và đối chiếu toàn bộ bản thuộc diện lưu giữ. |
| VVP-014 | Quy mô, tốc độ, tính sẵn sàng, RPO/RTO — REQ-OPS-005 | Tải và ngưỡng được duyệt, số đo gốc, cấu hình môi trường, kết luận theo từng ngưỡng. |

Một kết quả kiểm tra phải nêu phiên bản yêu cầu và phần mềm, dữ liệu/cấu hình/môi trường, người và
ngày thực hiện, kết quả mong đợi/thực tế, bằng chứng và sai lệch. Thiếu bằng chứng không được ghi đạt.

Một người đóng nhiều tài khoản giả lập có thể kiểm tra chức năng có giới hạn, nhưng không thay cho
người xét duyệt độc lập hoặc người dùng đại diện. Bản HTML đã review chỉ chứng minh hướng bố cục và
cách tương tác; không chứng minh lưu trữ thật, phân quyền thật, giao dịch đồng thời hoặc khôi phục.

## 10. Các điểm phải làm rõ trước khi chốt

Những mục sau là khoảng trống của đặc tả/đầu vào, không phải lỗi đã quan sát trên một sản phẩm chạy
thật. Người soạn có trách nhiệm chuẩn bị đề xuất; khi thiếu người chuyên môn thì báo anh để phân
công hoặc quyết định cách xử lý, không tự coi là đã có người đủ điều kiện.

| Mã | Nội dung cần làm rõ | Người chuẩn bị / quyết định | Mốc phải giải quyết |
|---|---|---|---|
| SPEC-OPEN-01 | Version và Version Sequence khác nhau ở đâu, tăng khi nào, hiển thị thế nào; sửa chỗ chưa thống nhất giữa DOC-03/04/06/08 và thuật ngữ dự án. | Người soạn đối chiếu mô hình, anh review, sếp quyết định Spec. | Trước duyệt phần REQ-ID-002 và bộ Spec liên quan; không tự thay bằng cách đánh số của prototype. |
| SPEC-OPEN-02 | Tìm/duyệt cơ bản đã nằm trong phạm vi nhưng chưa có yêu cầu đủ chi tiết: tra theo thông tin nào, trong phạm vi nào, kết quả theo quyền ra sao và kiểm tra thế nào. | Người soạn viết yêu cầu từ công việc thực tế, anh review, sếp quyết định mức phạm vi. | Trước chốt Spec phần tìm/duyệt; cấp mã và cập nhật nguồn/trace theo quy trình, không ngầm đưa tìm kiếm nâng cao vào Core v0. |
| SPEC-OPEN-03 | Các giá trị cấu hình nghiệp vụ ban đầu: loại tài liệu, trường bắt buộc, chuẩn hóa để so sánh, đánh số, vai trò/nhóm, quy trình, thời hạn giữ sửa/gia hạn và điều kiện khôi phục. | Người soạn cùng người quản trị đề xuất; sếp quyết định nghiệp vụ. Người vận hành cụ thể chưa được chỉ định. | Chốt cấu hình làm cơ sở nghiệm thu trước khi duyệt các phần Spec phụ thuộc; xác minh lại trước thử nghiệm thực tế. |
| SPEC-OPEN-04 | Danh sách định dạng và phiên bản ứng dụng được hỗ trợ; khả năng sâu cần có ở IRONCAD; file mẫu và giới hạn dung lượng. | Người soạn cùng kỹ thuật thiết kế đề xuất; sếp quyết định phạm vi; chuyên môn định dạng kiểm chứng. | Trước cam kết hỗ trợ từng định dạng và chạy VVP-008; chưa được gọi “hỗ trợ mọi file”. |
| SPEC-OPEN-05 | Tải sử dụng, dung lượng, số người dùng, thời gian phản hồi, tính sẵn sàng, RPO/RTO và ngưỡng giới hạn xử lý file/truyền file. | Người phụ trách vận hành/bảo mật chưa được chỉ định; người soạn tổng hợp, sếp quyết định các cam kết. | Ghi rõ chủ sở hữu và phương pháp đo khi chốt kế hoạch; chỉ duyệt REQ-OPS-005 cho triển khai khi tải/môi trường/ngưỡng đã được chốt và có bằng chứng. |
| SPEC-OPEN-06 | Hệ điều hành, trình duyệt, kích thước màn hình/tỷ lệ hiển thị, bộ gõ/phông Nhật, cơ chế đăng nhập, mạng và hạ tầng được công ty cho phép. | Người soạn lấy thông tin từ IT; sếp quyết định ràng buộc, phần lựa chọn trình ở Tech. | Trước chốt phạm vi hỗ trợ bắt buộc của Spec và quyết định Tech; 1440×900 hiện chỉ là khung kiểm tra demo. |
| SPEC-OPEN-07 | Dự án/người dùng đại diện, người phê duyệt đủ điều kiện và người đánh giá bảo mật, dữ liệu, khả năng tiếp cận, ngôn ngữ, vận hành. | Sếp chọn hoặc giao anh thu xếp; người soạn nêu nhiệm vụ và phần còn thiếu. | Trước các bước review/gate và thử nghiệm yêu cầu vai trò đó; không dùng self-review làm bằng chứng độc lập. |
| SPEC-OPEN-08 | Phân loại truy cập, thời hạn lưu dữ liệu/Audit, điều kiện giữ hồ sơ, bộ dữ liệu sao lưu và cách bảo quản thành phần mật mã phục vụ khôi phục. | Người soạn cùng IT/chất lượng/vận hành đề xuất; người có thẩm quyền trong công ty quyết định. | Trước duyệt chính sách liên quan và thử sao lưu/khôi phục; giao diện Purge đầy đủ vẫn ngoài phạm vi. |

Các nhóm vấn đề về nghiệp vụ, định dạng, vai trò và môi trường đã có trong BREQ-GAP-001…006 cùng
DOC-06/08/VVP. SPEC-OPEN-01 và SPEC-OPEN-02 nêu rõ thêm phần thiếu nhất quán/thiếu chi tiết nhìn thấy
khi viết lại. Chúng chưa phải quyết định thay mô hình hay thêm một yêu cầu đã được duyệt.

## 11. Nội dung trình sếp quyết định và trạng thái review

Đề nghị sếp xem xét hành vi và điều kiện đạt trong Spec, đặc biệt:

1. Check-in thành công hoặc không có thay đổi đều bỏ giữ đúng phạm vi; Check-in lỗi không làm mất
   bản sửa và không tự hủy quyền còn hợp lệ.
2. Duyệt và phát hành phải gắn đúng bản, đúng cấu trúc, đúng người đủ quyền; không phát hành một phần.
3. File, thông tin, chính sách và lịch sử phải đủ để lấy lại bộ hồ sơ cũ; khả năng xử lý từng định
   dạng phải được chứng minh riêng.
4. Mức sử dụng, định dạng, môi trường và các điểm còn mở tại mục 10 cần được chốt hoặc có quyết định
   điều kiện/phạm vi rõ ràng trước khi dùng làm cam kết.

| Nội dung kiểm soát | Trạng thái |
|---|---|
| Review nội bộ SPEC-001@0.4 | Chưa thực hiện; chờ anh review |
| Lần đồng ý với SPEC-001@0.3 | Đã được anh rút lại; không còn hiệu lực |
| Quyết định Feature của sếp | Chưa có; là điều kiện trước quyết định Spec |
| Quyết định Spec của sếp | Chưa có — NOT-RUN |
| Khả năng chốt toàn bộ Spec lúc này | Chưa đủ: có điểm thuật ngữ, chi tiết và đầu vào cần giải quyết tại mục 10 |
| Kiểm thử / thẩm định / cho phép sử dụng thật | Chưa thực hiện hoặc chưa có quyết định; không suy ra từ việc viết xong tài liệu |

Khi có quyết định, phải ghi người quyết định, thời điểm, phiên bản Spec/Feature và nguồn được xem
xét, nội dung đồng ý, phần loại trừ và việc còn phải làm. Đồng ý bản Spec không đồng nghĩa phê duyệt
Tech hoặc cho phép triển khai production.

## Phụ lục A — Liên kết về tính năng và tài liệu nguồn

### A.1. Kiểm soát số lượng và nguồn yêu cầu

| Nhóm mã | Số yêu cầu | Tính năng chính liên quan |
|---|---:|---|
| REQ-ID | 6 | FTR-001, FTR-002 |
| REQ-WS | 13 | FTR-003, FTR-004, FTR-005, FTR-006 |
| REQ-STR | 3 | FTR-007, FTR-009 |
| REQ-LC | 9 | FTR-002, FTR-008, FTR-009, FTR-010 |
| REQ-GOV | 5 | FTR-008, FTR-011, FTR-012 |
| REQ-AUD | 2 | FTR-011 |
| REQ-FMT | 5 | FTR-004, FTR-013 |
| REQ-UX | 6 | FTR-003, FTR-007, FTR-009, FTR-011, FTR-013, FTR-014 |
| REQ-LOC | 3 | FTR-014 |
| REQ-SEC | 4 | FTR-004, FTR-011, FTR-013 |
| REQ-OPS | 5 | FTR-005, FTR-008, FTR-010, FTR-011 |
| Tổng | 61 | 14 nhóm tính năng |

Bảng trên để tra cứu nhóm, không thay thế liên kết từng yêu cầu trong DOC-04. Toàn bộ 61 mã giữ nguyên;
các cột tiếng Việt tại mục 4, 5 và 7 diễn giải yêu cầu và điều kiện kiểm tra từ nguồn đó. Dữ liệu và
giao tiếp ở mục 3/6, cùng chi tiết giao diện ở mục 5, còn đọc theo DOC-06/08 được ghim bên dưới.
Trước khi duyệt, những chi tiết cần yêu cầu riêng phải được bổ sung vào nguồn và trace, không chỉ
xuất hiện trong bản trình sếp.

### A.2. Phiên bản nguồn

| Nguồn | Mã / phiên bản | Vai trò |
|---|---|---|
| [Feature](FEATURE-001-feature-definition-and-scope.md) | FEATURE-001@0.3 — Draft | Phạm vi 14 nhóm tính năng; chưa có quyết định của sếp |
| [DOC-03](../DOC-03-business-requirements.md) | IE-PROD-BREQ-001@0.1 — Draft | Quy tắc nghiệp vụ và các khoảng trống đầu vào |
| [DOC-04](../DOC-04-software-requirements-specification.md) | IE-PROD-SREQ-001@0.1 — Draft | Nguồn của 61 mã yêu cầu, mức ưu tiên và trace |
| [DOC-06](../DOC-06-data-integration-and-migration-specification.md) | IE-PROD-DATA-001@0.1 — Draft | Mô hình dữ liệu, nhập file, giao tiếp, tính bất biến và nguồn dữ liệu |
| [DOC-08](../DOC-08-ui-ux-and-interaction-specification.md) | IE-PROD-UX-001@0.1 — Draft | Người dùng, luồng giao diện, cách hiển thị trạng thái và ngôn ngữ |
| [VVP](../registers/VVP-core-v0-verification-validation-plan.md) | IE-VVP-CORE-001@0.1 — Draft | 14 nhóm kiểm tra dự kiến; tất cả NOT-RUN |
| [Thuật ngữ và ràng buộc dự án](../../../../../CONTEXT.md) | Bản làm việc được ghim SHA-256 trong sổ phiên bản | Ranh giới sản phẩm, mô hình tài liệu và điều kiện làm việc offline; quy tắc Check-in riêng của Core v0 đọc theo DOC-03/04 |

Bộ tài liệu: IDEA-C1-ANALYSIS-DESIGN-001. Bộ yêu cầu nguồn: IE-SPEC-CORE-V0-001@0.1.
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
| 0.4 — hiện tại | Viết lại thành đặc tả: đặt 61 mã bên cạnh yêu cầu/điều kiện kiểm tra; bổ sung cách đọc dữ liệu, giao tiếp, tình huống lỗi và danh sách điểm cần chốt; giữ phạm vi và mức ưu tiên của nguồn. Chờ review mới. |

Một số nguồn cũ vẫn tham chiếu FEATURE-001@0.2 hoặc SPEC-001@0.3. Các bản đó được lưu trong
[sổ phiên bản](VERSION-HISTORY.md); tham chiếu cũ không xác nhận đã review hoặc duyệt bản hiện tại.
