# FEATURE-001 — Tính năng và phạm vi IDEA Engineering Core v0

| Thông tin | Nội dung |
|---|---|
| Mã tài liệu | FEATURE-001 |
| Phiên bản / ngày soạn | 0.12 / 09-09-2026 |
| Trạng thái | Draft — đã đồng bộ nguồn hiện hành; phạm vi 14 nhóm tính năng không đổi; sếp chưa quyết định |
| Mục đích | Thống nhất sản phẩm cần có những tính năng nào và phần nào chưa làm |
| Người soạn | Principal Product Author — trợ lý hỗ trợ soạn tài liệu |
| Người review nội bộ | Người dùng dự án — đã xác nhận cách dùng Version/Generation ngày 04-09-2026; hướng tạo PDF từ CAD, cấu hình workflow, phân quyền linh hoạt, danh tính item/folder, BOM là dữ liệu cấu trúc và ranh giới đầu ra phòng ban ngày 07-09-2026; các nội dung còn lại của bản mới chưa có kết quả review toàn bộ |
| Người quyết định | Sếp — Product Decision Authority |
| Phạm vi sử dụng | Nội bộ công ty |

## 1. Chúng ta định làm sản phẩm gì?

IDEA Engineering quản lý tài liệu và dữ liệu thiết kế của công ty: biết tài liệu nào đang được sửa,
ai đang sửa, bản nào đã được duyệt và bộ hồ sơ nào đã được phát hành để sử dụng.

Core v0 là phạm vi đầu tiên cần xây dựng. Mục tiêu là làm trọn một công việc: **đưa tài liệu vào hệ
thống → sửa có kiểm soát → xét duyệt → phát hành → lấy lại đúng bộ hồ sơ đã phát hành**.

Đây không phải phần mềm thay thế Office hoặc CAD. Kỹ sư vẫn làm việc trong các ứng dụng đang dùng;
IDEA quản lý tài liệu trước và sau quá trình đó. Sản phẩm dùng trong nội bộ, không có phạm vi bán
dịch vụ, thuê bao hoặc thanh toán.

Ba tài liệu trình sếp có nhiệm vụ khác nhau:

| Tài liệu | Câu hỏi cần quyết định |
|---|---|
| Feature — bản này | Làm những tính năng nào? Cái gì làm trước, cái gì để sau? |
| [Spec](SPEC-001-product-specification.md) | Mỗi tính năng phải hoạt động ra sao? Khi nào cho phép, khi nào từ chối, kiểm tra thế nào là đạt? |
| [Tech](TECH-001-technology-and-architecture-proposal.md) | Dùng công nghệ và cách tổ chức hệ thống nào để đáp ứng Spec? |

Tài liệu giữ 14 mã tính năng. Bản 0.4 bổ sung đăng nhập và quản trị tài khoản vào FTR-011. Bản 0.5
chốt một cách đánh số bản nội dung: mỗi Revision có Version `1, 2, 3…`; Generation là mã snapshot
bất biến của hệ thống; không có thêm trường Version Sequence. Bản 0.6 làm rõ PDF/STEP và các file
trung gian là bản dẫn xuất gắn với đúng Generation nguồn. IDEA có thể tạo tự động qua Adapter và
công cụ đã được kiểm chứng; nơi chưa đủ điều kiện thì cho phép người dùng tạo ngoài rồi tải lên.
Bản 0.7 làm rõ Core v0 có thể dùng nhiều workflow có phiên bản theo loại tài liệu, cung cấp một quy
trình mặc định và chưa cần trình thiết kế kéo-thả. Bản 0.8 làm rõ tài khoản/đăng nhập và quyền trên
tài liệu là hai lớp khác nhau: người quản trị được thay chính sách qua chức năng có kiểm soát mà
không sửa code; file JSON chỉ có thể dùng để nhập/xuất cấu hình, không tự tạo quyền. Các xác nhận này
không thay cho quyết định Feature của sếp và không tự chuyển kết quả review của bản 0.3 sang toàn bộ
bản mới. Bản 0.9 làm rõ tài liệu là một item có mã ổn định: đổi tên, chuyển folder/divider hoặc thêm
liên kết không tạo tài liệu mới; Save-As/Create Copy mới tạo danh tính mới và phải giữ nguồn gốc.
Bản 0.10 làm rõ BOM là một cách xem dữ liệu từ đúng mốc cấu trúc sản phẩm; Excel, PDF hoặc CSV chỉ
là bản xuất hoặc dữ liệu đề nghị nhập và không tự trở thành cấu trúc chính thức. Bản 0.11 làm rõ
đầu ra của các phòng ban có thể là tài liệu, cấu trúc hoặc bằng chứng được kiểm soát; các con số về
giờ, chi phí, mua hàng, gia công hoặc tiến độ chỉ là thông tin tham khảo trong Core v0, không tự biến
IDEA thành phần mềm chấm công, tính giá, mua hàng, sản xuất hoặc quản lý dự án.

## 2. Ai sẽ dùng?

| Người sử dụng | Công việc cần làm |
|---|---|
| Kỹ sư / người soạn tài liệu | Đưa file vào hệ thống, tìm đúng tài liệu, Checkout, sửa bằng Office/CAD, Check-in và gửi xét duyệt. |
| Người xét duyệt | Xem đúng bản được gửi, kiểm tra các tài liệu liên quan, phê duyệt hoặc trả lại kèm lý do. |
| Người có quyền phát hành | Kiểm tra đủ điều kiện và phát hành đúng bộ hồ sơ đã xác nhận. |
| Người quản trị | Thiết lập thông tin tài liệu, cách đánh số, nhóm người dùng, quyền và quy trình phù hợp với công ty. |
| Người quản trị tài khoản — anh phụ trách ban đầu | Cấp, khóa và hỗ trợ khôi phục tài khoản IDEA; không vì có quyền này mà tự được xem mọi tài liệu hoặc phê duyệt. |
| Người tra cứu / kiểm tra hồ sơ | Xem bản được phép sử dụng, lịch sử thay đổi và bằng chứng xét duyệt, phát hành. |

Một người có thể làm nhiều công việc nếu chính sách cho phép. Tuy nhiên, theo quy tắc mặc định đang
đề xuất, người đã soạn hoặc sửa một Revision không tự phê duyệt hay phát hành Revision đó. Người đủ
điều kiện phê duyệt có thể đồng thời là người phát hành nếu được phân quyền.

Vai trò review tài liệu dự án và quyền phê duyệt trong sản phẩm là hai việc khác nhau. Anh đã nhận
việc quản trị tài khoản ban đầu; chưa có danh sách đầy đủ người dùng/người phê duyệt để thử nghiệm.
Dự kiến khoảng 50–100 người dùng tại một địa điểm, chưa phải số người thao tác đồng thời đã đo.

## 3. Danh mục tính năng Core v0

Tất cả 14 nhóm dưới đây thuộc phạm vi Core v0 đề xuất. “Có trong phạm vi” không có nghĩa là đã được
lập trình hoặc kiểm thử. Các mức bắt buộc và điều kiện nghiệm thu cụ thể nằm trong Spec.

### 3.1. Đưa tài liệu vào và làm việc hằng ngày

| Mã | Tính năng | Người dùng cần làm được gì? | Giới hạn cần hiểu |
|---|---|---|---|
| FTR-001 | Đưa tài liệu có sẵn vào hệ thống và tạo tài liệu mới | Đăng ký file hiện có, kiểm tra khả năng trùng tài liệu; hoặc tạo tài liệu mới theo cùng cách quản lý. | Ưu tiên luồng tiếp nhận file có sẵn. Không tự gộp hai tài liệu chỉ vì trùng tên hoặc nội dung; chưa bao gồm chuyển đổi hàng loạt kho dữ liệu cũ. |
| FTR-002 | Quản lý danh tính, vị trí và lịch sử tài liệu | Theo dõi cùng một tài liệu khi đổi tên hoặc chuyển folder/divider; phân biệt Revision, Version và Generation; mở lại đúng bản cũ; tạo bản sao mới khi người dùng chọn Save-As/Create Copy. | Tên và folder không phải danh tính tài liệu. Move/Rename giữ nguyên Document ID; thay đổi tên thuộc thông tin được kiểm soát phải đi qua Check-in. Create Copy cấp Document ID mới và lưu quan hệ với tài liệu nguồn. Version chỉ tăng khi Check-in có thay đổi tạo Generation mới; không có Version Sequence riêng. |
| FTR-003 | Checkout hoặc lấy bản tham chiếu | Chọn rõ tài liệu nào lấy để sửa, tài liệu nào chỉ lấy để tham khảo; biết ai đang giữ quyền sửa. | Không tự Checkout toàn bộ tài liệu con. Bản tham chiếu không có quyền Check-in vào tài liệu gốc. |
| FTR-004 | Làm việc bằng Office/CAD đang có | Lấy đúng bộ file về Workspace trên máy, kiểm tra file tải về và mở bằng ứng dụng được Windows liên kết. | IDEA không chạy mã bên trong Office/CAD. Chỉ đọc được nội dung đã lưu ra file; không biết phần đang sửa nhưng chưa Save trong ứng dụng. |
| FTR-005 | Check-in thay đổi và kết thúc Checkout | Xem danh sách file có thay đổi, xác nhận phạm vi, đưa thay đổi vào hệ thống và không còn giữ các tài liệu vừa Check-in thành công. | Cả phạm vi đã xác nhận phải cùng thành công hoặc cùng không được ghi nhận. Nếu không có thay đổi thì không tạo thêm bản, nhưng vẫn kết thúc Checkout của phạm vi đó. |
| FTR-006 | Xử lý khi bản làm việc đã cũ hoặc không còn quyền sửa hợp lệ | Biết tài liệu nào có vấn đề, giữ được công việc trên máy và chọn cách lấy bản mới, áp dụng lại thay đổi hoặc nhờ người có quyền xử lý. | Không ghi đè bản mới trên hệ thống; không tự gộp file CAD/Office. Check-in thất bại không tự xóa file hay thu hồi quyền Checkout còn hợp lệ. |

### 3.2. Kiểm soát bộ hồ sơ và phát hành

| Mã | Tính năng | Người dùng cần làm được gì? | Giới hạn cần hiểu |
|---|---|---|---|
| FTR-007 | Quản lý cấu trúc sản phẩm, BOM và tài liệu liên quan | Biết một cụm sản phẩm gồm những thành phần, lần xuất hiện, số lượng, vị trí, tài liệu và bản cụ thể nào; xem BOM theo mục đích đã chọn và xem lại đúng cấu trúc đã dùng trước đây. | Cấu trúc được quản lý trong hệ thống mới là dữ liệu chính thức. Excel/PDF/CSV không tự trở thành BOM chính thức; bản nhập phải được kiểm tra, xem trước và xác nhận. Một tài liệu con có bản mới không tự thay đổi bộ hồ sơ cũ. |
| FTR-008 | Gửi xét duyệt, phê duyệt hoặc trả lại | Dùng workflow phù hợp với loại tài liệu; gửi đúng bản cần duyệt; người thuộc vai trò/nhóm được cấu hình xem và quyết định; khi bị trả lại hoặc rút xét duyệt thì tiếp tục sửa theo quy trình. | Core v0 có quy trình mặc định Start → In Work → Under Review → Released và cho phép cấu hình nhiều workflow có phiên bản. Quyết định duyệt gắn với bản cụ thể; chưa làm trình thiết kế kéo-thả hoàn chỉnh. |
| FTR-009 | Phát hành bộ hồ sơ đã đủ điều kiện | Xem trước phạm vi phát hành, kiểm tra quyền, bản tài liệu, cấu trúc và quyết định duyệt, rồi xác nhận phát hành. | Không phát hành một phần ngoài ý người dùng. Thiếu điều kiện ở một mục thì dừng cả phạm vi đang xác nhận. |
| FTR-010 | Lấy lại bộ hồ sơ đã phát hành | Xuất đúng file, thông tin tài liệu, mốc cấu trúc, BOM/bản xuất BOM và bằng chứng đi kèm của lần phát hành cần tra cứu. | Hồ sơ phải chỉ rõ BOM được tạo từ mốc cấu trúc nào. Đây là lấy đúng hồ sơ lịch sử, không lấy “bản mới nhất hiện nay”. Sao lưu và khôi phục dữ liệu còn phải được kiểm thử riêng. |

### 3.3. Quản trị và sử dụng trong công ty

| Mã | Tính năng | Người dùng cần làm được gì? | Giới hạn cần hiểu |
|---|---|---|---|
| FTR-011 | Đăng nhập, quản trị tài khoản, phân quyền và xem lịch sử | Dùng tài khoản IDEA; quản trị viên cấp/khóa/hỗ trợ đặt lại mật khẩu. Quyền thông thường được cấp qua nhóm/vai trò theo loại, phạm vi và trạng thái tài liệu; thay đổi nhân sự bằng cách đổi thành viên nhóm. Người được giao quyền quản trị có thể thay chính sách mà không sửa code; thay đổi được kiểm tra, kích hoạt và ghi Audit. | Đăng nhập chỉ xác định người dùng, không tự cấp quyền tài liệu. Không tự đăng ký công khai; quyền quản trị tài khoản không tự cho phép đọc/duyệt. Gán quyền thẳng cho một người chỉ là ngoại lệ có phạm vi, lý do, thời hạn và Audit. File JSON chỉ dùng để nhập/xuất cấu hình có kiểm soát, không phải nguồn quyền đang có hiệu lực. |
| FTR-012 | Thiết lập thông tin tài liệu và cách đánh số | Chọn các trường thông tin cần nhập, quy tắc kiểm tra, phân loại và cách cấp số phù hợp từng loại tài liệu. Có thể giữ giờ, chi phí dự kiến, tình trạng mua hàng/gia công hoặc tiến độ như thông tin tham khảo khi cần cho hồ sơ kỹ thuật. | Đổi biểu mẫu hoặc quy tắc đánh số không tự làm thay đổi dữ liệu cũ. Mã nghiệp vụ không thay thế mã định danh ổn định của hệ thống. Việc lưu một giá trị tham khảo không tự tính toán, tạo giao dịch mua hàng/sản xuất, đánh dấu hoàn thành hoặc làm tài liệu chuyển trạng thái. |
| FTR-013 | Quản lý nhiều định dạng, mở rộng khả năng đọc CAD | Quản lý file theo cùng cơ chế; đọc thuộc tính/cấu trúc và tạo PDF, STEP hoặc bản xem trước khi từng định dạng, ứng dụng và công cụ đã được kiểm chứng. | IRONCAD là hướng tích hợp sâu đầu tiên. Bản dẫn xuất phải gắn đúng Generation nguồn. Có thể tạo tự động qua Adapter hoặc tải lên thủ công; lưu và mở được file không đồng nghĩa đã hỗ trợ sâu. |
| FTR-014 | Giao diện làm việc rõ ràng, hỗ trợ Anh – Việt – Nhật | Tìm và xem tài liệu theo ngữ cảnh; thấy bước tiếp theo và lý do chưa thực hiện được; mở chi tiết khi cần; đổi ngôn ngữ giao diện. | Tìm/duyệt cơ bản thuộc Core v0, tìm kiếm nâng cao để sau. Yêu cầu tìm kiếm chi tiết, môi trường hiển thị và đánh giá khả năng tiếp cận còn phải chốt trong Spec. |

Các quy tắc về an toàn dữ liệu, bảo mật, sao lưu và khôi phục là điều kiện của các tính năng trên,
không phải tính năng tùy chọn có thể bỏ để làm demo nhanh hơn. Riêng yêu cầu tiếp cận bằng bàn phím
REQ-UX-006 hiện được nguồn xếp mức “nên đáp ứng trước triển khai”; không tự nâng thành một cam kết
đã hoàn tất.

## 4. Một ví dụ để hình dung kết quả

Ví dụ minh họa: công ty đang thiết kế cụm bơm P-100, gồm mô hình CAD, bản vẽ và tài liệu thông số.
Tên sản phẩm và người trong ví dụ chỉ phục vụ giải thích, không phải dữ liệu thử nghiệm đã được duyệt.

| Bước | Công việc | Kết quả cần thấy |
|---|---|---|
| 1 | Kỹ sư đưa bộ file P-100 hiện có vào hệ thống. | Có tài liệu được nhận diện rõ; khả năng trùng được báo để người dùng quyết định. |
| 2 | Chọn sửa mô hình CAD, lấy tài liệu thông số để tham khảo. | Phạm vi Checkout và Reference tách rõ, không lấy quyền sửa ngoài lựa chọn. |
| 3 | Mở CAD, sửa và Save trên máy. | Thay đổi còn là bản làm việc trên máy; chưa phải bản được phát hành. |
| 4 | Check-in. | Hệ thống kiểm tra cả phạm vi, ghi nhận thay đổi hợp lệ và bỏ giữ các tài liệu đã xác nhận. |
| 5 | Gửi bản mới để xét duyệt. | Người duyệt nhìn đúng file và cấu trúc đi kèm, không phải một bản có thể âm thầm bị thay thế. |
| 6 | Người đủ điều kiện phê duyệt; người có quyền phát hành xác nhận phạm vi. | Có hồ sơ quyết định và lần phát hành cụ thể. |
| 7 | Sau này cần lấy lại bộ hồ sơ của lần phát hành đó. | Lấy lại đúng các bản đã phát hành, kể cả khi công việc hiện tại đã có bản mới hơn. |

Nếu gặp lỗi ở bước 4 hoặc 6, hệ thống phải chỉ rõ nguyên nhân và phần dữ liệu vẫn an toàn. Các tình
huống này được đặc tả trong Spec, không chỉ thể hiện bằng luồng demo thành công.

## 5. Những phần chưa đưa vào Core v0

| Chưa làm trong phạm vi này | Phần vẫn phải có |
|---|---|
| Tìm kiếm nâng cao, truy vấn lưu sẵn và công cụ quản trị chỉ mục đầy đủ | Tìm/duyệt tài liệu cơ bản theo quyền; mức chi tiết còn phải chốt trong Spec. |
| Trình thiết kế workflow kéo-thả đầy đủ | Có thể khai báo nhiều workflow có phiên bản, chọn workflow mặc định theo loại tài liệu và cấu hình trạng thái, bước chuyển, vai trò/nhóm, điều kiện duyệt, lý do/bằng chứng bắt buộc và thông báo bằng dữ liệu hoặc biểu mẫu quản trị có kiểm tra. |
| Tích hợp ERP/MRP hoặc API tích hợp tổng quát cho bên ngoài | Các giao tiếp nội bộ cần cho Web, Desktop, Workspace và xử lý file. |
| Đồng bộ nhiều cơ sở, thực hiện lệnh quản trị khi offline | Làm việc với file đã có trên máy; kiểm tra lại quyền và bản tài liệu khi kết nối lại. |
| Tự động xóa vĩnh viễn hoặc giao diện Purge hoàn chỉnh | Bảo toàn dữ liệu và tuân thủ điều kiện lưu giữ đang áp dụng. |
| Quản lý thay đổi ECR/ECO đầy đủ | Tạo Revision mới và ghi nhận lý do, nguồn thay đổi, tài liệu bị ảnh hưởng theo quy tắc hiện có. |
| Tích hợp sâu mọi phần mềm CAD ngay từ đầu | Quản lý file dùng chung và cơ chế bổ sung từng định dạng mà không thay đổi các quy tắc cốt lõi. |
| Dịch vụ thương mại, thuê bao hoặc thu tiền | Sử dụng nội bộ công ty. |
| Đăng nhập qua tài khoản công ty hoặc nhà cung cấp khác ngay giai đoạn đầu | Tài khoản IDEA do quản trị viên cấp; giữ mã người dùng ổn định để nối thêm cách đăng nhập sau khi có yêu cầu và giao thức rõ. |
| Chuyển đổi tự động toàn bộ lịch sử của kho dữ liệu cũ | Tiếp nhận tài liệu có sẵn, giữ nguồn gốc và xác nhận các thông tin chưa đáng tin cậy. |
| Chấm công, tính chi phí, mua hàng, điều hành gia công/sản xuất hoặc quản lý tiến độ dự án | Quản lý tài liệu, cấu trúc và bằng chứng bàn giao của các phòng ban. Các giá trị liên quan có thể được lưu như thông tin tham khảo; muốn IDEA trở thành nơi thực hiện hoặc quyết định các nghiệp vụ này phải có Feature hoặc hợp đồng tích hợp được duyệt riêng. |

## 6. Thứ tự chuẩn bị và thực hiện

Việc chốt Feature, Spec và Tech được thực hiện theo thứ tự đó. Có thể soạn song song để tiết kiệm
thời gian, nhưng quyết định sau không được coi là hợp lệ khi điều kiện quyết định trước chưa đáp ứng.

Sau khi hoàn tất phê duyệt và điều kiện bắt đầu thực hiện, hướng chia công việc là:

1. Thiết lập tài khoản, quyền và Audit; sau đó quản lý danh tính tài liệu, tiếp nhận file và lưu bản đầu tiên.
2. Làm trọn Checkout → sửa → Check-in, gồm cả lỗi và bảo toàn bản trên máy.
3. Làm trọn cấu trúc sản phẩm → xét duyệt → phát hành → lấy lại hồ sơ.
4. Kiểm chứng khả năng xử lý định dạng và phần tích hợp sâu IRONCAD.
5. Hoàn thiện các điều kiện thử nghiệm với người dùng, ngôn ngữ và vận hành.

Đây là thứ tự dự kiến, không phải lịch giao hàng hay quyết định cho phép viết production code.
Kế hoạch chi tiết được quản lý tại [DOC-07](../DOC-07-mvp-roadmap-and-delivery-plan.md).

## 7. Những thông tin còn cần chốt

| Nội dung còn thiếu | Ai cần cung cấp / quyết định? | Ảnh hưởng |
|---|---|---|
| Nhóm người dùng và một dự án nội bộ đại diện | Sếp chọn; người soạn thu thập công việc thực tế. | Chưa thể khẳng định tính năng phù hợp với toàn công ty hoặc đã sẵn sàng thử nghiệm thực tế. |
| Danh sách định dạng, phiên bản Office/CAD và mức đọc dữ liệu mong muốn | Người soạn cùng kỹ thuật thiết kế đề xuất; sếp quyết định phạm vi. | Chưa có cam kết hỗ trợ chính thức cho từng định dạng và phiên bản. |
| Vai trò, người phê duyệt, quy tắc đánh số và thời hạn lưu hồ sơ | Sếp quyết định nghiệp vụ; quản trị và người phụ trách chất lượng góp ý. | Chưa cấu hình được một quy trình sử dụng thật. |
| Các điểm còn thiếu trong Spec và điều kiện vận hành | Người soạn làm rõ; anh review; sếp quyết định Spec và Tech. | Chưa có cơ sở chốt toàn bộ nghiệm thu hoặc cam kết tốc độ, quy mô, thời gian khôi phục. |

Các khoảng trống đã có mã và bước xử lý cụ thể tại mục 10 của Spec. Nếu chưa có người phù hợp, người
soạn nêu rõ nhiệm vụ để anh phân công hoặc trực tiếp xử lý; không tự ghi một vai trò là đã được đáp ứng.

## 8. Nội dung trình sếp quyết định

Đề nghị sếp xem xét:

1. Có chọn trọn luồng quản lý tài liệu đến phát hành làm phạm vi Core v0 không?
2. Có đồng ý 14 nhóm tính năng và các giới hạn tại mục 3–5 không?
3. Có đồng ý ưu tiên tiếp nhận file có sẵn và chọn IRONCAD làm hướng tích hợp sâu đầu tiên không?
4. Dùng nhóm người dùng, dự án và phạm vi định dạng nào để hoàn thiện Spec và tổ chức thử nghiệm?

| Nội dung kiểm soát | Trạng thái hiện tại |
|---|---|
| Review của anh đối với bản 0.11 | PARTIAL — cách dùng Version/Generation, hướng tạo PDF từ CAD, cấu hình workflow, ranh giới Identity/Access Policy/JSON, danh tính item/folder, BOM so với Excel/PDF và phạm vi đầu ra phòng ban đã được xác nhận; toàn bộ bản mới chưa được review trọn vẹn |
| Review bản trước | [RVW-FEATURE-SPEC-20260903-001](VERSION-HISTORY.md#5-ghi-nhận-review-nội-bộ-ngày-03-09-2026) chỉ áp dụng Feature 0.3 / Spec 0.4; không tự chuyển sang bản mới |
| Quyết định Feature của sếp | Chưa có — NOT-RUN |
| Quyết định cho phép triển khai hoặc sử dụng thật | Chưa có; không được suy ra từ tài liệu này |
| Nội dung có thể ghi khi sếp quyết định | Đồng ý phạm vi / đồng ý kèm việc cần làm / yêu cầu sửa / chưa đủ thông tin; ghi người quyết định, ngày, phiên bản và phạm vi quyết định |

Phê duyệt phạm vi không xác nhận phần mềm đã tồn tại, đã vượt qua kiểm thử hay đã tuân thủ đầy đủ
một tiêu chuẩn ISO/IEC.

## Phụ lục A — Nguồn và cách quản lý tài liệu

Bản này là bản tiếng Việt để quyết định phạm vi, không tạo một bộ yêu cầu độc lập. Các mã FTR được
kế thừa từ danh mục Feature 0.2 và đã được DOC-04 dùng để liên kết yêu cầu; nội dung nghiệp vụ đối
chiếu DOC-03. Khi có khác biệt, phải xử lý rõ trước khi trình duyệt; không dùng một câu diễn giải
trong bản này để tự thay yêu cầu gốc. Phần giao diện ở FTR-014 được làm rõ theo các REQ-UX đã có
trong DOC-04, không thêm một nhóm tính năng mới.

| Tài liệu nguồn | Mã / phiên bản được dùng | Vai trò |
|---|---|---|
| [DOC-01](../DOC-01-product-vision-and-scope.md) | IE-PROD-VISION-001@0.5 — Draft | Mục tiêu, đối tượng và ranh giới sản phẩm |
| [DOC-02](../DOC-02-feasibility-and-options-assessment.md) | IE-PROD-FEAS-001@0.2 — Draft | Các hướng thực hiện và điều kiện khả thi |
| [DOC-03](../DOC-03-business-requirements.md) | IE-PROD-BREQ-001@0.5 — Draft | Nhu cầu, kịch bản và quy tắc nghiệp vụ |
| [DOC-04](../DOC-04-software-requirements-specification.md) | IE-PROD-SREQ-001@0.10 — Draft | Liên kết FTR → REQ; yêu cầu danh tính/vị trí tài liệu, BOM/cấu trúc, workflow, Access Policy và dữ liệu tham khảo được kiểm soát, không được duyệt thay Spec tại đây |
| [DOC-07](../DOC-07-mvp-roadmap-and-delivery-plan.md) | IE-PROD-ROADMAP-001@0.5 — Draft | Thứ tự quyết định, kế hoạch và chia giai đoạn; lịch và 56 task không đổi |
| [GOV](../registers/GOV-material-and-behavioral-coverage.md) | IE-GOV-COVERAGE-001@0.3 — Draft | Phạm vi đối chiếu, phần có bằng chứng và phần chưa xác minh |
| [Feature 0.2 — bản lịch sử](FEATURE-001-feature-definition-and-scope.v0.2.md) | FEATURE-001@0.2 — Proposed tại lúc lưu; chỉ có review nội bộ | Kế thừa danh mục 14 mã FTR, không kế thừa kết quả review và không tạo quyết định của sếp |

Bộ tài liệu: IDEA-C1-ANALYSIS-DESIGN-001. Nội dung hành vi được đọc cùng SPEC-001@0.14.

Bản 0.12 chỉ đồng bộ các phiên bản nguồn sau đợt làm rõ phạm vi. Không thêm, bỏ hoặc đổi ưu tiên
nhóm tính năng; không kế thừa kết quả review của bản cũ và không tạo quyết định của sếp.
Dấu kiểm tra SHA-256 của các nguồn nằm trong [sổ phiên bản](VERSION-HISTORY.md).

## Phụ lục B — Lịch sử review

| Phiên bản | Diễn giải |
|---|---|
| [0.2](FEATURE-001-feature-definition-and-scope.v0.2.md) | Giữ lại bản đã được anh review về nội dung và cách diễn đạt. Đây không phải quyết định Feature của sếp. |
| 0.3 — bản đã được review, giữ trong lịch sử | Viết lại danh mục theo công việc người dùng, giới hạn và nội dung cần quyết định; không thay 14 mã FTR. Anh đã duyệt nội bộ ngày 03-09-2026 bằng xác nhận mới, không kế thừa review 0.2. Nội dung tính năng được giữ nguyên khi ghi nhận review. |
| 0.4 | Bổ sung tài khoản IDEA và ranh giới quản trị trong FTR-011; đồng bộ nguồn 0.2, giữ 14 mã FTR. |
| 0.5 | Làm rõ FTR-002: dùng một Version trong mỗi Revision và Generation bất biến; loại bỏ Version Sequence. |
| 0.6 | Làm rõ FTR-013: PDF/STEP/bản xem là dữ liệu dẫn xuất của đúng Generation nguồn; hỗ trợ tự động phụ thuộc Adapter/công cụ đã kiểm chứng và có đường tải lên thủ công. |
| 0.7 | Làm rõ FTR-008: hỗ trợ nhiều workflow có phiên bản theo loại tài liệu, một quy trình mặc định cho Core v0 và cấu hình có kiểm soát; trình thiết kế kéo-thả vẫn để sau. |
| 0.8 | Làm rõ FTR-011: Identity quản lý tài khoản/đăng nhập, Access Policy quản lý quyền tài liệu có phiên bản; JSON chỉ là đường nhập/xuất ứng viên cấu hình. |
| 0.9 | Làm rõ FTR-002: tên/folder không phải danh tính; Move/Rename giữ Document ID; Create Copy tạo Document ID mới và giữ nguồn gốc. |
| 0.10 | Làm rõ FTR-007/FTR-010: BOM là cách xem một Structure Snapshot theo mục đích xác định; file Excel/PDF/CSV là bản biểu diễn hoặc dữ liệu đề nghị nhập, không phải cấu trúc chính thức. |
| 0.11 — bản hiện tại | Làm rõ FTR-012 và phạm vi ngoài Core v0: đầu ra phòng ban đi qua tài liệu/cấu trúc/bằng chứng hiện có; giờ, chi phí, mua hàng, gia công, tiến độ và hoàn thành chỉ là thông tin tham khảo nếu chưa có Feature hoặc hợp đồng tích hợp được duyệt riêng. Quyết định Feature của sếp vẫn NOT-RUN. |

[CHG Tech](../registers/CHG-2026-09-03-tech-context-and-proposal.md) lưu nguồn xác nhận bối cảnh
trước đó. [CHG Version](../registers/CHG-2026-09-04-version-model-clarification.md) ghi quyết định
loại bỏ Version Sequence và phạm vi đồng bộ. [CHG CAD Representation](../registers/CHG-2026-09-07-cad-neutral-representation.md)
ghi hướng tạo PDF/neutral file vừa được xác nhận. [CHG Workflow](../registers/CHG-2026-09-07-workflow-configuration.md)
ghi cách cấu hình workflow Core v0. Lịch sử review cũ vẫn giữ đúng phạm vi của nó.
[CHG danh tính item/folder](../registers/CHG-2026-09-07-item-folder-identity.md) ghi quyết định
Move/Rename/Create Copy, nguồn bằng chứng tham khảo và phạm vi đồng bộ của bản 0.9.
[CHG BOM/cấu trúc](../registers/CHG-2026-09-07-bom-structure-representation.md) ghi ranh giới
BOM, Structure Snapshot, bản xuất và dữ liệu đề nghị nhập của bản 0.10.
[CHG phạm vi đầu ra phòng ban](../registers/CHG-2026-09-07-departmental-deliverable-scope.md)
ghi cách phân biệt hồ sơ kỹ thuật được kiểm soát với dữ liệu vận hành chỉ dùng để tham khảo trong bản 0.11.

## Phụ lục C — Tra từ Feature sang Spec

Các mã dưới đây giữ liên kết từng tính năng với 74 yêu cầu có mã trong DOC-04 và bản Spec mới.
Đây là phần tra cứu cho người soạn/review. REQ-IAM-001…007 là phần bổ sung ở nguồn; 61 mã cũ và mức ưu tiên của chúng được giữ. Chi tiết dữ liệu,
giao diện và các điểm chưa có đủ yêu cầu vẫn phải đọc cùng mục 3, 5, 6 và 10 của Spec.

| Tính năng | Yêu cầu có mã liên quan trong Spec |
|---|---|
| FTR-001 | REQ-ID-003…006; REQ-ID-009 |
| FTR-002 | REQ-ID-001…004; REQ-ID-007…009; REQ-LC-009 |
| FTR-003 | REQ-WS-001…003; REQ-WS-013; REQ-UX-002 |
| FTR-004 | REQ-WS-003…004; REQ-FMT-004; REQ-SEC-002…003 |
| FTR-005 | REQ-WS-005…009; REQ-WS-012; REQ-OPS-001 |
| FTR-006 | REQ-WS-005…006; REQ-WS-010…011; REQ-WS-013 |
| FTR-007 | REQ-STR-001…006; REQ-UX-004 |
| FTR-008 | REQ-LC-001…005; REQ-LC-009; REQ-GOV-005; REQ-OPS-002 |
| FTR-009 | REQ-STR-002…003; REQ-LC-003; REQ-LC-005…007; REQ-LC-009; REQ-UX-002 |
| FTR-010 | REQ-STR-004…005; REQ-LC-008; REQ-OPS-003…004 |
| FTR-011 | REQ-LC-001; REQ-LC-004; REQ-GOV-001…002; REQ-GOV-005; REQ-AUD-001…002; REQ-UX-004; REQ-SEC-001…003; REQ-OPS-002; REQ-IAM-001…007 |
| FTR-012 | REQ-GOV-003…005 |
| FTR-013 | REQ-WS-004; REQ-FMT-001…005; REQ-UX-005; REQ-SEC-004 |
| FTR-014 | REQ-UX-001; REQ-UX-003; REQ-UX-005…006; REQ-LOC-001…003 |
