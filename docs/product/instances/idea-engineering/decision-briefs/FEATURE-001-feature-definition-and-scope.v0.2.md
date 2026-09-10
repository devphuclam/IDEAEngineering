# FEATURE-001 — Đề xuất phạm vi tính năng Core v0

Tài liệu này dùng để trình sếp duyệt **phạm vi tính năng của Core v0**. Nội dung tập trung vào việc
sản phẩm sẽ làm được gì và những gì chưa làm trong giai đoạn đầu. Phần lựa chọn công nghệ sẽ được
trình riêng sau khi Specification đã được thống nhất.

## 1. Nội dung đề nghị sếp duyệt

| Nội dung | Đề xuất |
|---|---|
| Phạm vi Core v0 | Xây dựng một quy trình hoàn chỉnh từ lúc đưa tài liệu vào hệ thống đến khi tài liệu được review, approve, release và mở lại đúng bản đã release. |
| Cách triển khai | Làm `Store Existing` trước, sau đó mới làm chức năng tạo tài liệu mới (`New`) trên cùng một mô hình quản lý. |
| Phạm vi định dạng | Trước hết quản lý file theo nguyên tắc chung; sau đó làm sâu với IRONCAD để kiểm chứng khả năng quản lý CAD. |
| Phạm vi chưa làm | Các chức năng PLM mở rộng như Advanced Search, ERP/MRP, Multi-site và Workflow Designer đầy đủ sẽ làm ở giai đoạn sau. |

Quyết định ở bước này chỉ xác nhận **Feature**. Nó chưa quyết định cách thiết kế hệ thống, database,
framework hay hạ tầng triển khai.

## 2. Core v0 sẽ giải quyết việc gì?

Core v0 là phiên bản đầu tiên cần chứng minh được một quy trình quản lý tài liệu kỹ thuật trọn vẹn:

1. Đưa một file kỹ thuật đang có vào hệ thống.
2. Cấp mã định danh và quản lý lịch sử thay đổi của tài liệu.
3. Cho phép người dùng Checkout tài liệu về máy để chỉnh sửa.
4. Check-in kết quả trở lại hệ thống mà không ghi đè nhầm thay đổi của người khác.
5. Review và approve đúng phiên bản cần duyệt.
6. Release tài liệu cùng Product Structure liên quan.
7. Khi cần, mở lại hoặc khôi phục đúng dữ liệu đã release.

Mục tiêu của Core v0 không phải là làm ngay toàn bộ hệ thống PLM. Mục tiêu là làm chắc phần cốt lõi
trước, bao gồm cả những trường hợp có xung đột hoặc lỗi.

## 3. Các tính năng đề xuất

| ID | Tính năng | Người dùng có thể làm gì? | Ý nghĩa |
|---|---|---|---|
| `FTR-001` | Tiếp nhận và tạo tài liệu | Dùng `Store Existing` để đưa file có sẵn vào quản lý. Sau đó có thể dùng `New` để tạo tài liệu mới trên cùng hệ thống. | Hỗ trợ cả tài liệu hiện có và tài liệu tạo mới mà không phải dùng hai cách quản lý khác nhau. |
| `FTR-002` | Định danh, Revision và Version | Mỗi tài liệu có một Stable ID. Hệ thống phân biệt rõ Business Revision, Version và Generation của tài liệu. | Tránh nhầm tài liệu chỉ vì file bị đổi tên, chuyển thư mục hoặc đã có phiên bản mới. |
| `FTR-003` | Checkout và Reference | Người dùng chọn tài liệu nào cần Checkout để sửa và tài liệu nào chỉ cần lấy về làm Reference. | Chỉ giữ quyền chỉnh sửa đối với tài liệu thật sự cần sửa; không tự động Checkout cả cây tài liệu. |
| `FTR-004` | Vùng làm việc trên máy người dùng | Hệ thống đưa đúng Generation của tài liệu về Workspace. Người dùng mở và sửa bằng Word, Excel, IRONCAD hoặc ứng dụng đã cài trên Windows. | Người dùng tiếp tục làm việc bằng phần mềm quen thuộc; IDEA không cần chạy bên trong phần mềm thiết kế. |
| `FTR-005` | Check-in có kiểm soát | Trước khi Check-in, hệ thống cho người dùng xem những file nào đã thay đổi và xác nhận phạm vi cần lưu. Nếu có nhiều tài liệu, hệ thống lưu toàn bộ hoặc không lưu tài liệu nào. | Tránh tình trạng một phần dữ liệu đã được lưu nhưng phần còn lại bị lỗi. Check-in thành công, hoặc xác nhận không có thay đổi, sẽ kết thúc Checkout trong phạm vi đó. |
| `FTR-006` | Xử lý tài liệu Out of date | Nếu trên hệ thống đã có Generation mới hơn, Check-in bị từ chối. Hệ thống cho biết bản đang dùng và bản hiện tại, đồng thời giữ nguyên file người dùng đã sửa để xử lý tiếp. | Không ghi đè thay đổi của người khác và không làm mất công việc đang nằm trên máy người dùng. |
| `FTR-007` | Product Structure | Lưu một Structure Snapshot ghi rõ assembly đang dùng đúng Generation nào của từng tài liệu hoặc component liên quan. | Có thể xem lại và tái tạo đúng cấu trúc tại thời điểm đã lưu hoặc release, thay vì tự động lấy bản mới nhất. |
| `FTR-008` | Review và Approval | Gửi tài liệu đi review; approve, reject hoặc rút khỏi quá trình review; lưu lại người thực hiện, thời điểm và lý do. | Quyết định duyệt luôn gắn với đúng tài liệu cần duyệt. Mặc định, người approve phải độc lập với người chuẩn bị tài liệu. |
| `FTR-009` | Release | Release đúng Generation và Structure Snapshot đã được approve. Nếu một tài liệu bắt buộc còn lỗi hoặc chưa đủ điều kiện, toàn bộ phạm vi release bị dừng. | Không tạo ra một bản release thiếu file, sai cấu trúc hoặc chưa được duyệt đầy đủ. |
| `FTR-010` | Release Package | Tạo gói dữ liệu gồm file, metadata, Product Structure, lịch sử phê duyệt và thông tin kiểm tra cần thiết để mở lại đúng bản đã release. | Gói release là một baseline có kiểm soát, không chỉ là file ZIP chứa những file mới nhất. |
| `FTR-011` | Phân quyền và Audit | Cấu hình quyền theo role, group và trạng thái tài liệu. Các thao tác quan trọng được lưu trong Audit. | Có thể thay đổi cách phân quyền sau này mà không phải sửa các quy tắc cốt lõi của hệ thống; đồng thời biết ai đã làm gì. |
| `FTR-012` | Metadata và đánh số | Quản lý trường thông tin, quy tắc kiểm tra dữ liệu và cách cấp Business Number theo từng policy. | Dữ liệu được nhập thống nhất và có thể điều chỉnh quy tắc khi quy trình công ty thay đổi. Business Number không thay thế Stable ID. |
| `FTR-013` | Quản lý nhiều định dạng file | Danh sách định dạng được phép sử dụng có thể cấu hình. Office, PDF và IRONCAD được kiểm tra theo khả năng thực tế của từng loại. | Có thể thêm phần mềm thiết kế khác sau này mà không phải thay đổi mô hình quản lý tài liệu. Việc lưu được file không có nghĩa là hệ thống đã hiểu cấu trúc bên trong file. |
| `FTR-014` | Giao diện ba ngôn ngữ | Giao diện hỗ trợ tiếng Anh, tiếng Việt và tiếng Nhật. Nội dung do người dùng nhập được giữ nguyên. | Nhân sự ở các nhóm ngôn ngữ khác nhau có thể dùng cùng hệ thống; tiếng Anh là ngôn ngữ dự phòng khi bản dịch còn thiếu. |

Tất cả 14 tính năng trên được đề xuất là **bắt buộc đối với Core v0**. Mức độ chi tiết, điều kiện
nghiệm thu và cách hệ thống phải phản hồi sẽ được quy định trong tài liệu Specification.

## 4. Luồng chính dùng để demo

1. Người dùng chọn một file kỹ thuật đang có và thực hiện `Store Existing`.
2. Hệ thống cấp Stable ID và tạo bản ghi quản lý cho tài liệu.
3. Người dùng Checkout tài liệu cần sửa; các tài liệu chỉ dùng để tham khảo được lấy về dưới dạng
   Reference.
4. Người dùng mở file bằng ứng dụng thông thường trên Windows, chỉnh sửa và lưu trên máy.
5. Khi Check-in, hệ thống hiển thị các file đã thay đổi để người dùng xác nhận.
6. Hệ thống tạo Generation mới và Structure Snapshot, sau đó kết thúc Checkout.
7. Tài liệu được gửi review và được một người có thẩm quyền approve.
8. Hệ thống Release đúng Generation và Product Structure đã được duyệt.
9. Người dùng mở lại Release Package và kiểm tra rằng file, metadata và cấu trúc khớp với bản đã
   release.

Prototype HTML hiện tại chỉ minh họa giao diện và cách người dùng thao tác. Nó chưa chứng minh
database, bảo mật, xử lý đồng thời hoặc khả năng vận hành thực tế.

## 5. Những tình huống hệ thống phải xử lý an toàn

| Tình huống | Hệ thống phải xử lý như thế nào? |
|---|---|
| Tài liệu đang được người khác Checkout | Không cho người thứ hai Checkout để sửa hoặc Check-in thay. Chỉ hiển thị thông tin người đang giữ khi người xem có quyền. |
| Bản trên máy đã Out of date | Không cho Check-in đè lên Generation mới. Giữ nguyên file đã sửa trên máy và hướng dẫn người dùng lấy bản mới rồi áp dụng lại thay đổi. |
| Cùng một người nhưng sử dụng Workspace khác | Không tự động dùng lại quyền Checkout của Workspace cũ. Phải thực hiện quy trình chuyển hoặc khôi phục quyền có ghi Audit. |
| Một tài liệu liên quan đã thay đổi nhưng không nằm trong phạm vi Checkout | Cảnh báo và yêu cầu xác nhận lại phạm vi; không âm thầm lưu đè tài liệu đó. |
| Một file bị lỗi trong lần Check-in nhiều tài liệu | Không lưu một phần. Toàn bộ lần Check-in bị dừng để người dùng sửa lỗi rồi thực hiện lại. |
| Không có người đủ điều kiện approve | Dừng quá trình review/release; không tự động chuyển quyền approve cho người soạn tài liệu. |
| Phạm vi Release còn tài liệu lỗi, Out of date hoặc chưa đủ bằng chứng | Không tạo Release Record cho tới khi toàn bộ phạm vi đạt điều kiện. |
| Người dùng Check-in nhưng file không thay đổi | Không tạo Generation mới không cần thiết; ghi nhận kết quả `No Change` và kết thúc Checkout. |

## 6. Các tính năng để lại cho giai đoạn sau

| Nội dung | Vì sao chưa làm trong Core v0? | Khi nào xem xét lại? |
|---|---|---|
| Advanced Search và Saved Query | Chưa cần để chứng minh quy trình quản lý và release tài liệu cốt lõi. Core v0 vẫn phải có chức năng tìm và duyệt tài liệu cơ bản. | Sau khi phần định danh và Check-in đã ổn định. |
| Graphical Workflow Designer đầy đủ | Core v0 chỉ cần một quy trình review/release có thể cấu hình. Công cụ kéo thả để tự thiết kế workflow chưa phải ưu tiên đầu. | Sau khi workflow review/release đầu tiên được kiểm chứng. |
| ERP/MRP và tích hợp hệ thống bên ngoài | Chưa có hệ thống nhận dữ liệu, người phụ trách hoặc giao thức tích hợp cụ thể. | Khi có nhu cầu tích hợp nội bộ được duyệt. |
| Multi-site Replication | Chưa có yêu cầu cụ thể về nhiều địa điểm, đồng bộ dữ liệu và xử lý mất kết nối. | Khi công ty xác định nhu cầu và mô hình triển khai nhiều site. |
| Công cụ Purge và vận hành nâng cao | Chưa thống nhất thời gian lưu dữ liệu, Legal Hold, backup, restore và thẩm quyền xóa. | Khi chính sách lưu trữ và vận hành được duyệt. |
| Quy trình ECR/ECO đầy đủ | Core v0 chỉ cần ghi nhận thay đổi ở mức đủ để review và release tài liệu. | Khi bắt đầu giai đoạn quản lý thay đổi sản phẩm mở rộng. |
| Hỗ trợ sâu các phần mềm CAD khác | Cần dùng IRONCAD để kiểm chứng cách mở rộng trước. | Sau khi IRONCAD profile đạt yêu cầu. |
| Tính năng phục vụ kinh doanh bên ngoài | IDEA Engineering hiện là sản phẩm sử dụng trong nội bộ công ty. | Chỉ xem xét nếu phạm vi sản phẩm được thay đổi chính thức. |

Các mục này chưa thuộc Core v0 nhưng vẫn được lưu trong Coverage Register để không bị quên ở những
giai đoạn sau.

## 7. Lợi ích dự kiến

Nếu Core v0 hoạt động đúng như đề xuất, công ty sẽ có khả năng:

- nhận biết chính xác tài liệu nào đang được sử dụng và lịch sử thay đổi của tài liệu đó;
- hạn chế việc ghi đè nhầm hoặc release sai phiên bản;
- giữ lại công việc trên máy người dùng khi xảy ra xung đột;
- biết ai đã Checkout, Check-in, review, approve hoặc release tài liệu;
- mở lại đúng file và Product Structure đã được release;
- bổ sung định dạng file, role và policy mới mà không phải làm lại phần cốt lõi.

Đây là lợi ích **dự kiến** dựa trên phân tích hiện tại. Hiệu quả thực tế và mức độ phù hợp với người
dùng trong công ty chỉ có thể kết luận sau khi chạy pilot với dữ liệu và người dùng đại diện.

## 8. Kết luận đề nghị

Đề nghị sếp xác nhận bốn nội dung:

1. Đồng ý đưa `FTR-001` đến `FTR-014` vào phạm vi Core v0.
2. Đồng ý thứ tự `Store Existing` trước `New`, và quản lý file chung trước khi làm sâu với IRONCAD.
3. Đồng ý để các tính năng tại mục 6 sang giai đoạn sau.
4. Đồng ý dùng một quy trình từ Store Existing đến Release và mở lại Release Package làm tiêu chí
   chính để đánh giá Core v0.

Sau khi phạm vi Feature được duyệt, nhóm dự án sẽ viết Specification để làm rõ từng tính năng phải
hoạt động như thế nào và kiểm tra bằng cách nào.

## 9. Ghi nhận quyết định

| Trường | Nội dung |
|---|---|
| Tài liệu được xem xét | `FEATURE-001`, phiên bản `0.2` |
| Quyết định | `NOT-RUN` — chưa thực hiện |
| Ý kiến hoặc điều kiện kèm theo | Chưa ghi nhận |
| Người quyết định | Chưa ghi nhận |
| Ngày quyết định | Chưa ghi nhận |
| Nội dung cần chỉnh sửa sau quyết định | Chưa ghi nhận |

Việc duyệt Feature không đồng nghĩa với duyệt Specification, Technology hoặc xác nhận rằng sản phẩm
đã được triển khai.

## Phụ lục A — Giải thích thuật ngữ

| Thuật ngữ | Cách hiểu trong tài liệu này |
|---|---|
| Stable ID | Mã định danh cố định của tài liệu trong hệ thống. Đổi tên file hoặc tạo phiên bản mới không làm thay đổi mã này. |
| Logical Document | Bản ghi đại diện cho một tài liệu xuyên suốt lịch sử của nó. |
| Business Revision | Mốc thay đổi nghiệp vụ lớn của tài liệu, ví dụ Revision A, B hoặc C. |
| Version | Lần cập nhật nằm trong một Business Revision. |
| Generation | Bản dữ liệu đã Check-in và được lưu cố định; Generation cũ không bị sửa lại. |
| Checkout | Giữ quyền chỉnh sửa và Check-in một tài liệu trong Workspace xác định. |
| Reference | Lấy tài liệu về để xem hoặc làm dữ liệu tham khảo nhưng không có quyền Check-in thay đổi. |
| Check-in | Đưa phần thay đổi đã xác nhận từ Workspace lên hệ thống để tạo Generation mới. |
| Workspace | Vùng làm việc được quản lý trên máy người dùng. |
| Product Structure | Quan hệ giữa assembly, component, tài liệu và các dependency liên quan. |
| Structure Snapshot | Ảnh chụp Product Structure tại một thời điểm, trong đó từng thành phần được gắn với đúng Generation. |
| Review / Approval | Quá trình kiểm tra và quyết định chấp nhận hoặc từ chối một bản tài liệu cụ thể. |
| Release | Công bố một baseline đã được duyệt để sử dụng chính thức trong phạm vi nội bộ được phép. |
| Release Package | Gói dữ liệu dùng để mở lại hoặc bàn giao đúng baseline đã Release. |
| Audit | Lịch sử có kiểm soát về người thực hiện, thời điểm, hành động và kết quả. |

## Phụ lục B — Thông tin kiểm soát và tài liệu nguồn

### Thông tin kiểm soát

| Trường | Giá trị |
|---|---|
| ID | `FEATURE-001` |
| Trục quyết định | `Feature` |
| Trạng thái | `Proposed` |
| Phiên bản | `0.2` |
| Baseline | `IDEA-C1-ANALYSIS-DESIGN-001` |
| Người chuẩn bị | `Principal Product Author`; chưa ghi nhận danh tính cá nhân |
| Người self-review | `Author Self-Reviewer` (project requester); đã review và xác nhận nội dung ngày 2026-09-03; không thay thế independent review |
| Người quyết định | `Product Decision Authority`; chưa ghi nhận danh tính và ngày quyết định |
| Mức sẵn sàng trình duyệt | `READY FOR FEATURE DECISION`: nội dung đã qua self-review; chờ Product Decision Authority xem xét và ghi quyết định |
| Phân loại | `INTERNAL` |
| Bản DOCX/PDF | Chưa tạo |

### Danh mục tài liệu nguồn

| Tài liệu nguồn | Phiên bản / Baseline | Nội dung được sử dụng |
|---|---|---|
| [`IE-PROD-VISION-001`](../DOC-01-product-vision-and-scope.md) | `0.1` / `IDEA-C1-ANALYSIS-DESIGN-001` | Mục đích nội bộ, phạm vi và kết quả mong muốn |
| [`IE-PROD-FEAS-001` / `IE-FEA-C1-001`](../DOC-02-feasibility-and-options-assessment.md) | `0.1` / `IDEA-C1-ANALYSIS-DESIGN-001` | Lựa chọn khả thi và giới hạn của prototype |
| [`IE-PROD-BREQ-001`](../DOC-03-business-requirements.md) | `0.1` / `IDEA-C1-ANALYSIS-DESIGN-001` | Business needs, các tình huống sử dụng và business rules |
| [`IE-PROD-ROADMAP-001`](../DOC-07-mvp-roadmap-and-delivery-plan.md) | `0.1` / `IDEA-C1-ANALYSIS-DESIGN-001` | Thứ tự Feature → Spec → Tech và kế hoạch Core v0 |
| [`IE-GOV-COVERAGE-001`](../registers/GOV-material-and-behavioral-coverage.md) | `0.1` / `IE-COV-DDM-PUBLIC-2026-08-26-001` | Danh sách 16 nhóm tính năng tham chiếu và hướng xử lý từng nhóm |

Nếu một trong các tài liệu nguồn thay đổi phiên bản hoặc Baseline, `FEATURE-001@0.2` phải được đối
chiếu và cập nhật lại trước khi tiếp tục sử dụng để ra quyết định.

### Kết quả review

| Nội dung | Kết quả |
|---|---|
| Phạm vi review | Cách diễn đạt, khả năng hiểu của người đọc không chuyên, tính đầy đủ của 14 Feature và sự nhất quán với tài liệu nguồn |
| Reviewer | `Author Self-Reviewer` (project requester) |
| Ngày review | 2026-09-03 |
| Kết quả | `PASS` — reviewer xác nhận nội dung phù hợp để trình Product Decision Authority |
| Giới hạn | Đây không phải independent specialist review và không phải quyết định Feature của Product Decision Authority |
