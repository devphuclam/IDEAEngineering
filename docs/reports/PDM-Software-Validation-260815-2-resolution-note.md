# Ghi nhận xử lý các điểm chưa phù hợp trong PDM Software Validation

| Nội dung | Ghi nhận |
|---|---|
| Tài liệu bối cảnh | [PDM Software Validation 260815-2.pdf](<../../PDM Software Validation 260815-2.pdf>) |
| Ngày tổng hợp | 09-09-2026 |
| Trạng thái | Các khác biệt giữa PDF và hướng thiết kế hiện tại đã được xử lý |
| Tài liệu được thay thế | `PDM-Software-Validation-260815-2-hieu-dinh-Feature-Spec.docx` đã bị xóa vì phản ánh trạng thái cũ |
| Phạm vi | Phần PDM trong PDF; không xét nội dung chữ ký số |

PDF là nguồn cung cấp bối cảnh về dự án mẫu, hồ sơ và các phòng ban. PDF không phải tài liệu quyết
định Feature, Spec hoặc Tech. Khi nội dung khác nhau, dùng
[Feature](../product/instances/idea-engineering/decision-briefs/FEATURE-001-feature-definition-and-scope.md),
[Spec](../product/instances/idea-engineering/decision-briefs/SPEC-001-product-specification.md),
[Tech](../product/instances/idea-engineering/decision-briefs/TECH-001-technology-and-architecture-proposal.md)
và [ngôn ngữ miền](../../CONTEXT.md) hiện hành.

## Các điểm đã giải quyết

| STT | Vấn đề trong PDF | Hướng xử lý đã thống nhất |
|---:|---|---|
| 01 | Gọi toàn bộ sản phẩm là API | IDEA DDM là ứng dụng PDM nội bộ. API là giao tiếp kỹ thuật giữa các thành phần hoặc với hệ thống ngoài; API tích hợp tổng quát chưa thuộc Core v0. |
| 02 | Con số năm người dễ bị hiểu là năm người cùng phát triển phần mềm | Nhóm có hai người Firmware không tham gia sâu, một người quản lý hiểu quy trình, một người Software dự bị và anh là người phát triển chính. Kế hoạch không được suy ra từ tổng số thành viên của nhóm. |
| 03 | Mặc định dùng chung server hoặc dữ liệu của Aras và icVault | Server hiện có đang chứa database MySQL của Aras và icVault. IDEA không dùng chung database hay quyền của hai hệ thống đó. PostgreSQL là phương án đang được đề xuất cho dữ liệu IDEA và vẫn thuộc quyết định Tech. |
| 04 | Trộn phần mềm CAD, loại hồ sơ và định dạng thành một danh sách hỗ trợ | Document Class, Engineering Discipline, Document Purpose và File Format là các cấu hình riêng. Mục tiêu dài hạn là đưa các định dạng cần thiết lên Level 3; MVP chỉ làm trước tập định dạng đã chọn. Level 3 được định nghĩa và kiểm chứng riêng cho từng định dạng và công cụ. |
| 05 | Cho phép tăng Version trên Revision đã Released | Revision đã Released được giữ nguyên. Khi cần cải tiến, tạo Business Revision tiếp theo; Version trong Revision mới bắt đầu từ 1. |
| 06 | Yêu cầu mọi tài liệu trong một bộ phát hành có cùng Version | Release Record ghim đúng Revision, Version và Generation của từng tài liệu. Các tài liệu trong cùng bộ không cần có cùng số Version và không được sửa trực tiếp bản đã Released. |
| 07 | Release cuốn chiếu nhưng không xác định rõ phạm vi | Có thể phát hành riêng một cụm khi phạm vi đó đủ phụ thuộc bắt buộc. Cụm bơm có thể Released trong khi tủ điện và hồ sơ toàn máy vẫn In Work. Phạm vi đã xác nhận phải cùng thành công hoặc cùng không được ghi nhận. |
| 08 | Bản PDF từ CAD không chỉ ra đúng bản nguồn | PDF hoặc neutral file là Representation gắn với đúng Generation nguồn, digest và công cụ tạo. Khi CAD có bản mới, Representation cũ được giữ theo lịch sử nhưng không được coi là bản hiện tại. Có thể tạo tự động qua Adapter hoặc tải lên thủ công theo cùng quy tắc. |
| 09 | Nói workflow linh hoạt nhưng không nêu nguyên tắc | Workflow có phiên bản và có thể cấu hình theo Document Class. Luồng ban đầu là Start, In Work, Under Review và Released. Hệ thống phải chặn bước chuyển khi thiếu người đủ điều kiện hoặc cấu hình không hợp lệ. |
| 10 | Xem JSON và database như hai phương án phân quyền | Identity quản lý tài khoản và đăng nhập. Access Policy quyết định quyền theo Actor, Business Group, phạm vi, Document Class, trạng thái và thao tác. Database giữ chính sách có hiệu lực; JSON chỉ có thể là dữ liệu nhập hoặc xuất và phải qua kiểm tra, xem trước và kích hoạt. |
| 11 | Dùng tên file hoặc thư mục làm danh tính tài liệu | Mỗi Logical Document có DocumentId ổn định. Move hoặc đổi cách hiển thị không tạo tài liệu mới; Create Copy tạo DocumentId mới và lưu quan hệ với nguồn. Folder không phải đường dẫn lưu file vật lý hay ranh giới cấp quyền nội dung. |
| 12 | Xem BOM là một file Excel hoặc PDF | Product Structure và Structure Snapshot là dữ liệu cấu trúc được quản lý. Excel, CSV hoặc PDF chỉ là Representation hoặc Import Candidate cho đến khi được kiểm tra và chấp nhận. |
| 13 | Biến mọi đầu ra phòng ban thành chức năng của PDM | Core v0 quản lý tài liệu kỹ thuật, cấu trúc, quyền, xét duyệt, Release và bằng chứng. Giờ công, chi phí, mua hàng, gia công và tiến độ chỉ là dữ liệu tham khảo nếu chưa có Feature hoặc hợp đồng tích hợp riêng được duyệt. |
| 14 | Một tên hồ sơ của Phòng Thiết kế điện trong PDF có thể bị sao chép nhầm | Tên trong PDF không được dùng làm quy tắc cố định. Tên hồ sơ và quan hệ bàn giao là dữ liệu nghiệp vụ có thể cấu hình; giá trị dùng thật phải được xác nhận khi lập cấu hình hoặc dữ liệu pilot. |
| 15 | Dòng QA/QC còn để TBD | Không tự gán toàn bộ quyền Approve hoặc Release cho QA/QC. Workflow Role và Access Policy xác định người đủ điều kiện. Nếu một bước bắt buộc chưa có người phù hợp, hệ thống báo thiếu vai trò và chặn bước đó. |

## Thông tin quản trị đã làm rõ thêm

- Linh Nguyễn là Design Engineer, không phải quản trị viên.
- Trong giai đoạn hiện tại, anh đảm nhiệm PDM Administrator. Thiết kế cho phép bổ sung nhiều PDM
  Administrator về sau.
- Khi vận hành bình thường, người được Phòng Quản lý hệ thống chỉ định đảm nhiệm Account
  Administrator. Phòng ban không được dùng như một tài khoản chung.
- Một người có thể được giao cả hai nhóm quyền, nhưng quyền quản trị tài khoản và quyền cấu hình PDM
  vẫn được kiểm tra riêng.
- Development Administration Mode chỉ dùng trong môi trường phát triển; nó không phải quyền
  superuser của môi trường pilot hoặc vận hành.

## Ranh giới của ghi nhận này

Các điểm trên đã hết mâu thuẫn với hướng thiết kế hiện tại. Điều đó không có nghĩa Feature, Spec
hoặc Tech đã được sếp phê duyệt, phần mềm đã được xây dựng hay các kiểm tra đã đạt.

Các giá trị như bộ lọc tìm kiếm, danh mục cấu hình ban đầu, định dạng và phiên bản công cụ cụ thể,
tải đồng thời, kích thước kho, chính sách tài khoản, thời hạn lưu dữ liệu và người tham gia pilot vẫn
phải được chốt hoặc kiểm chứng ở bước tương ứng. Đây là đầu vào còn thiếu của Spec và kế hoạch triển
khai, không phải bất cập chưa xử lý của PDF.

