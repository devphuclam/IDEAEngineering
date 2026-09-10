# FEATURE-001 — Tính năng và phạm vi IDEA Engineering Core v0

| Thông tin | Nội dung |
|---|---|
| Mã tài liệu | FEATURE-001 |
| Phiên bản / ngày soạn | 0.3 / 03-09-2026 |
| Trạng thái | Draft — chờ anh review; chưa có quyết định của sếp |
| Mục đích | Thống nhất sản phẩm cần có những tính năng nào và phần nào chưa làm |
| Người soạn | Principal Product Author — trợ lý hỗ trợ soạn tài liệu |
| Người review nội bộ | Người dùng dự án; chưa review bản 0.3 |
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

Tài liệu này giữ nguyên 14 nhóm tính năng của phạm vi đang đề xuất. Bản mới làm rõ ý và giới hạn,
không bổ sung một phạm vi sản phẩm mới.

## 2. Ai sẽ dùng?

| Người sử dụng | Công việc cần làm |
|---|---|
| Kỹ sư / người soạn tài liệu | Đưa file vào hệ thống, tìm đúng tài liệu, Checkout, sửa bằng Office/CAD, Check-in và gửi xét duyệt. |
| Người xét duyệt | Xem đúng bản được gửi, kiểm tra các tài liệu liên quan, phê duyệt hoặc trả lại kèm lý do. |
| Người có quyền phát hành | Kiểm tra đủ điều kiện và phát hành đúng bộ hồ sơ đã xác nhận. |
| Người quản trị | Thiết lập thông tin tài liệu, cách đánh số, nhóm người dùng, quyền và quy trình phù hợp với công ty. |
| Người tra cứu / kiểm tra hồ sơ | Xem bản được phép sử dụng, lịch sử thay đổi và bằng chứng xét duyệt, phát hành. |

Một người có thể làm nhiều công việc nếu chính sách cho phép. Tuy nhiên, theo quy tắc mặc định đang
đề xuất, người đã soạn hoặc sửa một Revision không tự phê duyệt hay phát hành Revision đó. Người đủ
điều kiện phê duyệt có thể đồng thời là người phát hành nếu được phân quyền.

Vai trò review tài liệu dự án của anh và vai trò phê duyệt tài liệu trong sản phẩm là hai việc khác
nhau. Chưa có danh sách người dùng thật hoặc người phê duyệt để thử nghiệm.

## 3. Danh mục tính năng Core v0

Tất cả 14 nhóm dưới đây thuộc phạm vi Core v0 đề xuất. “Có trong phạm vi” không có nghĩa là đã được
lập trình hoặc kiểm thử. Các mức bắt buộc và điều kiện nghiệm thu cụ thể nằm trong Spec.

### 3.1. Đưa tài liệu vào và làm việc hằng ngày

| Mã | Tính năng | Người dùng cần làm được gì? | Giới hạn cần hiểu |
|---|---|---|---|
| FTR-001 | Đưa tài liệu có sẵn vào hệ thống và tạo tài liệu mới | Đăng ký file hiện có, kiểm tra khả năng trùng tài liệu; hoặc tạo tài liệu mới theo cùng cách quản lý. | Ưu tiên luồng tiếp nhận file có sẵn. Không tự gộp hai tài liệu chỉ vì trùng tên hoặc nội dung; chưa bao gồm chuyển đổi hàng loạt kho dữ liệu cũ. |
| FTR-002 | Quản lý mã tài liệu và lịch sử các bản | Theo dõi một tài liệu xuyên suốt các lần sửa; phân biệt bản đang làm, Revision và bản đã phát hành; mở lại đúng bản cũ khi cần. | Đổi tên file không làm đổi danh tính tài liệu. Cách gọi Version/Version Sequence còn một điểm cần làm rõ trong Spec; không dùng hai tên như thể đã chốt cùng một nghĩa. |
| FTR-003 | Checkout hoặc lấy bản tham chiếu | Chọn rõ tài liệu nào lấy để sửa, tài liệu nào chỉ lấy để tham khảo; biết ai đang giữ quyền sửa. | Không tự Checkout toàn bộ tài liệu con. Bản tham chiếu không có quyền Check-in vào tài liệu gốc. |
| FTR-004 | Làm việc bằng Office/CAD đang có | Lấy đúng bộ file về Workspace trên máy, kiểm tra file tải về và mở bằng ứng dụng được Windows liên kết. | IDEA không chạy mã bên trong Office/CAD. Chỉ đọc được nội dung đã lưu ra file; không biết phần đang sửa nhưng chưa Save trong ứng dụng. |
| FTR-005 | Check-in thay đổi và kết thúc Checkout | Xem danh sách file có thay đổi, xác nhận phạm vi, đưa thay đổi vào hệ thống và không còn giữ các tài liệu vừa Check-in thành công. | Cả phạm vi đã xác nhận phải cùng thành công hoặc cùng không được ghi nhận. Nếu không có thay đổi thì không tạo thêm bản, nhưng vẫn kết thúc Checkout của phạm vi đó. |
| FTR-006 | Xử lý khi bản làm việc đã cũ hoặc không còn quyền sửa hợp lệ | Biết tài liệu nào có vấn đề, giữ được công việc trên máy và chọn cách lấy bản mới, áp dụng lại thay đổi hoặc nhờ người có quyền xử lý. | Không ghi đè bản mới trên hệ thống; không tự gộp file CAD/Office. Check-in thất bại không tự xóa file hay thu hồi quyền Checkout còn hợp lệ. |

### 3.2. Kiểm soát bộ hồ sơ và phát hành

| Mã | Tính năng | Người dùng cần làm được gì? | Giới hạn cần hiểu |
|---|---|---|---|
| FTR-007 | Quản lý cấu trúc sản phẩm và tài liệu liên quan | Biết một cụm sản phẩm gồm những thành phần, tài liệu và bản cụ thể nào; xem lại đúng cấu trúc đã dùng trước đây. | Một tài liệu con có bản mới không tự thay đổi bộ hồ sơ cũ. Quan hệ chưa xác định được phải được chỉ rõ. |
| FTR-008 | Gửi xét duyệt, phê duyệt hoặc trả lại | Gửi đúng bản cần duyệt; người phù hợp xem và quyết định; khi bị trả lại hoặc rút xét duyệt thì tiếp tục sửa theo quy trình. | Quyết định duyệt gắn với bản cụ thể, không tự chuyển sang bản đã sửa. Chưa làm trình thiết kế quy trình kéo-thả hoàn chỉnh. |
| FTR-009 | Phát hành bộ hồ sơ đã đủ điều kiện | Xem trước phạm vi phát hành, kiểm tra quyền, bản tài liệu, cấu trúc và quyết định duyệt, rồi xác nhận phát hành. | Không phát hành một phần ngoài ý người dùng. Thiếu điều kiện ở một mục thì dừng cả phạm vi đang xác nhận. |
| FTR-010 | Lấy lại bộ hồ sơ đã phát hành | Xuất đúng file, thông tin tài liệu, cấu trúc/BOM và bằng chứng đi kèm của lần phát hành cần tra cứu. | Đây là lấy đúng hồ sơ lịch sử, không lấy “bản mới nhất hiện nay”. Sao lưu và khôi phục dữ liệu còn phải được kiểm thử riêng. |

### 3.3. Quản trị và sử dụng trong công ty

| Mã | Tính năng | Người dùng cần làm được gì? | Giới hạn cần hiểu |
|---|---|---|---|
| FTR-011 | Phân quyền, cấu hình quy trình và xem lịch sử thao tác | Cấp quyền theo vai trò/nhóm/trạng thái; điều chỉnh chính sách có kiểm soát; tra cứu ai đã làm gì, với tài liệu nào, khi nào. | Không đóng cứng quyền theo vài tài khoản demo. Đổi chính sách không được sửa lại lịch sử duyệt; chưa chốt danh sách nhóm và thời hạn lưu hồ sơ thật. |
| FTR-012 | Thiết lập thông tin tài liệu và cách đánh số | Chọn các trường thông tin cần nhập, quy tắc kiểm tra, phân loại và cách cấp số phù hợp từng loại tài liệu. | Đổi biểu mẫu hoặc quy tắc đánh số không tự làm thay đổi dữ liệu cũ. Mã nghiệp vụ không thay thế mã định danh ổn định của hệ thống. |
| FTR-013 | Quản lý nhiều định dạng, mở rộng khả năng đọc CAD | Quản lý file theo cùng cơ chế; dùng thêm khả năng đọc thuộc tính, cấu trúc hoặc tạo bản xem trước khi từng định dạng đã được xác minh. | IRONCAD là hướng tích hợp sâu đầu tiên. Các định dạng khác có thể bổ sung qua cùng cơ chế, nhưng không được gọi là hỗ trợ sâu chỉ vì lưu và mở được file. |
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
| Trình thiết kế workflow kéo-thả đầy đủ | Quy trình ban đầu và định nghĩa/chính sách có phiên bản, có thể cấu hình. |
| Tích hợp ERP/MRP hoặc API tích hợp tổng quát cho bên ngoài | Các giao tiếp nội bộ cần cho Web, Desktop, Workspace và xử lý file. |
| Đồng bộ nhiều cơ sở, thực hiện lệnh quản trị khi offline | Làm việc với file đã có trên máy; kiểm tra lại quyền và bản tài liệu khi kết nối lại. |
| Tự động xóa vĩnh viễn hoặc giao diện Purge hoàn chỉnh | Bảo toàn dữ liệu và tuân thủ điều kiện lưu giữ đang áp dụng. |
| Quản lý thay đổi ECR/ECO đầy đủ | Tạo Revision mới và ghi nhận lý do, nguồn thay đổi, tài liệu bị ảnh hưởng theo quy tắc hiện có. |
| Tích hợp sâu mọi phần mềm CAD ngay từ đầu | Quản lý file dùng chung và cơ chế bổ sung từng định dạng mà không thay đổi các quy tắc cốt lõi. |
| Dịch vụ thương mại, thuê bao hoặc thu tiền | Sử dụng nội bộ công ty. |
| Chuyển đổi tự động toàn bộ lịch sử của kho dữ liệu cũ | Tiếp nhận tài liệu có sẵn, giữ nguồn gốc và xác nhận các thông tin chưa đáng tin cậy. |

## 6. Thứ tự chuẩn bị và thực hiện

Việc chốt Feature, Spec và Tech được thực hiện theo thứ tự đó. Có thể soạn song song để tiết kiệm
thời gian, nhưng quyết định sau không được coi là hợp lệ khi điều kiện quyết định trước chưa đáp ứng.

Sau khi hoàn tất phê duyệt và điều kiện bắt đầu thực hiện, hướng chia công việc là:

1. Quản lý danh tính tài liệu, tiếp nhận file và lưu được bản đầu tiên.
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
| Review của anh đối với bản 0.3 | Chưa thực hiện |
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
| [DOC-01](../DOC-01-product-vision-and-scope.md) | IE-PROD-VISION-001@0.1 — Draft | Mục tiêu, đối tượng và ranh giới sản phẩm |
| [DOC-02](../DOC-02-feasibility-and-options-assessment.md) | IE-PROD-FEAS-001@0.1 — Draft | Các hướng thực hiện và điều kiện khả thi |
| [DOC-03](../DOC-03-business-requirements.md) | IE-PROD-BREQ-001@0.1 — Draft | Nhu cầu, kịch bản và quy tắc nghiệp vụ |
| [DOC-04](../DOC-04-software-requirements-specification.md) | IE-PROD-SREQ-001@0.1 — Draft | Liên kết FTR → REQ; các yêu cầu giao diện đã nằm trong phạm vi đề xuất, không được duyệt thay Spec tại đây |
| [DOC-07](../DOC-07-mvp-roadmap-and-delivery-plan.md) | IE-PROD-ROADMAP-001@0.1 — Draft | Thứ tự quyết định và chia giai đoạn |
| [GOV](../registers/GOV-material-and-behavioral-coverage.md) | IE-GOV-COVERAGE-001@0.1 — Draft | Phạm vi đối chiếu, phần có bằng chứng và phần chưa xác minh |
| [Feature 0.2 — bản lịch sử](FEATURE-001-feature-definition-and-scope.v0.2.md) | FEATURE-001@0.2 — Proposed tại lúc lưu; chỉ có review nội bộ | Kế thừa danh mục 14 mã FTR, không kế thừa kết quả review và không tạo quyết định của sếp |

Bộ tài liệu: IDEA-C1-ANALYSIS-DESIGN-001. Nội dung hành vi được đọc cùng SPEC-001@0.4.
Dấu kiểm tra SHA-256 của các nguồn nằm trong [sổ phiên bản](VERSION-HISTORY.md).

## Phụ lục B — Lịch sử review

| Phiên bản | Diễn giải |
|---|---|
| [0.2](FEATURE-001-feature-definition-and-scope.v0.2.md) | Giữ lại bản đã được anh review về nội dung và cách diễn đạt. Đây không phải quyết định Feature của sếp. |
| 0.3 — bản hiện tại | Viết lại danh mục theo công việc người dùng, giới hạn và nội dung cần quyết định; không thay 14 mã FTR. Chờ anh review lại bản mới; không chuyển kết quả review 0.2 sang 0.3. |

Một số tài liệu nguồn 0.1 vẫn ghi FEATURE-001@0.2. Đó là tham chiếu tới bản lịch sử đã lưu, không phải
bằng chứng duyệt bản 0.3. Các nguồn không bị sửa âm thầm trong lần biên tập này.

## Phụ lục C — Tra từ Feature sang Spec

Các mã dưới đây giữ liên kết từng tính năng với 61 yêu cầu có mã trong DOC-04 và bản Spec mới.
Đây là phần tra cứu cho người soạn/review, không thêm yêu cầu hoặc thay mức ưu tiên. Chi tiết dữ liệu,
giao diện và các điểm chưa có đủ yêu cầu vẫn phải đọc cùng mục 3, 5, 6 và 10 của Spec.

| Tính năng | Yêu cầu có mã liên quan trong Spec |
|---|---|
| FTR-001 | REQ-ID-003…006 |
| FTR-002 | REQ-ID-001…004; REQ-LC-009 |
| FTR-003 | REQ-WS-001…003; REQ-WS-013; REQ-UX-002 |
| FTR-004 | REQ-WS-003…004; REQ-FMT-004; REQ-SEC-002…003 |
| FTR-005 | REQ-WS-005…009; REQ-WS-012; REQ-OPS-001 |
| FTR-006 | REQ-WS-005…006; REQ-WS-010…011; REQ-WS-013 |
| FTR-007 | REQ-STR-001…003; REQ-UX-004 |
| FTR-008 | REQ-LC-001…005; REQ-LC-009; REQ-GOV-005; REQ-OPS-002 |
| FTR-009 | REQ-STR-002…003; REQ-LC-003; REQ-LC-005…007; REQ-LC-009; REQ-UX-002 |
| FTR-010 | REQ-LC-008; REQ-OPS-003…004 |
| FTR-011 | REQ-LC-001; REQ-LC-004; REQ-GOV-001…002; REQ-GOV-005; REQ-AUD-001…002; REQ-UX-004; REQ-SEC-001…003; REQ-OPS-002 |
| FTR-012 | REQ-GOV-003…005 |
| FTR-013 | REQ-WS-004; REQ-FMT-001…005; REQ-UX-005; REQ-SEC-004 |
| FTR-014 | REQ-UX-001; REQ-UX-003; REQ-UX-005…006; REQ-LOC-001…003 |
