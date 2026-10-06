# Bộ bàn giao API — bản đọc cho quản lý

`IE-API-HANDOFF-MGT-001`, v0.1, Draft, INFORMATIVE. Các trường kiểm soát kế thừa
[hồ sơ đầu mối](README.md); tài liệu nội bộ, chưa duyệt chia sẻ ngoài.

## Chúng ta đang có gì?

**Bổ sung v0.2 đang chờ review:** [CPD-1/CPD-2](../controlled-product-data.md) có catalogue
và chín operation card chi tiết về tiếp nhận/tạo identity, đọc đúng baseline/lịch sử và
navigation theo quyền. [Hướng dẫn tiếng Việt](../cpd-guide.vi.md) giải thích luồng.
Đây là DESIGN, không phải tính năng đã triển khai; chưa có URL/payload CPD được chốt.
Bộ khung bàn giao v0.1 đã được chấp nhận qua PR #43; phần nội dung gốc bên dưới giữ theo
publication v0.1. Nội dung CPD mới chờ acceptance theo Issue #44.

API contract là thỏa thuận về cách các thành phần trao đổi: gửi gì, nhận gì, ai có quyền,
điều kiện thực hiện và phải xử lý thế nào khi lỗi hoặc mất phản hồi.

Hiện đã có catalogue thao tác toàn Core v0 và contract chi tiết cho Identity/Session.
Reviewer đã chấp nhận bản v0.1 qua PR #41. Phần chi tiết mô tả chín route hiện có:
CSRF, đăng nhập, xem phiên, đăng xuất, tạo/vô hiệu hóa/kích hoạt lại tài khoản,
cấp proof thiết lập/reset mật khẩu và đổi credential bằng proof.

Catalogue giúp biết phạm vi và chủ sở hữu; nó chưa cung cấp payload/URL chi tiết của mọi domain.
Swagger là công cụ đọc/thử một phần API phát triển, không thay thế toàn bộ bộ bàn giao.

## Bàn giao cho ai thì đưa gì?

| Người nhận | Tài liệu | Điều có thể xác nhận |
|---|---|---|
| Team Backend, Web/Desktop và QA | Contract chi tiết + OpenAPI hiện có + evidence + phiếu bàn giao | Thống nhất hành vi và điều kiện tích hợp |
| Sếp / quản lý dự án | Bản này + bảng readiness tại đầu mối | Phần nào đã giao, phần nào còn phải thiết kế |
| Đối tác | Bản brief được duyệt chia sẻ cho đúng người nhận | Phạm vi đánh giá, giới hạn và nội dung cần thỏa thuận tiếp |

## Để bàn giao thật, còn phải điền gì?

Tên team/người nhận, phiên bản được giao, đầu mối hỗ trợ, môi trường được phép dùng,
quyền truy cập và tiêu chí nghiệm thu của lần bàn giao. Mật khẩu và token không nằm trong hồ sơ.
Người nhận xác nhận riêng: đã nhận tài liệu, đã thống nhất contract hay đã tích hợp/test xong.

Với domain chưa có wire contract, team phải chốt thao tác, dữ liệu, quyền, lỗi và retry trước
khi dùng làm căn cứ triển khai. Không cần làm hết toàn Core một lượt; hoàn thiện theo feature
thực tế, cùng một mẫu và quy trình review.

## Giới hạn cần nhớ

Core v0 chưa hứa cung cấp public integration API cho đối tác. Chưa bàn giao Account Management UI,
Desktop binding, môi trường production, cam kết vận hành hay kết nối ERP/MRP.
Bản hub mới là phương án tổ chức bàn giao chờ review; không tự mở rộng phạm vi sản phẩm.

Đầu mối duy nhất: [API handoff hub](README.md). Mỗi lần bàn giao nên gửi đường dẫn gắn đúng
Git revision và phiếu xác nhận, để hai team không làm theo hai bản khác nhau.
