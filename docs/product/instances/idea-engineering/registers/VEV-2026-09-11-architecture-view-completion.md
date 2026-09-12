# Kiểm tra bộ sơ đồ kiến trúc bổ sung

| Trường | Giá trị |
|---|---|
| Mã | IE-VEV-ARCH-VIEW-002 |
| Ngày | 11-09-2026 |
| Nguồn | DOC-05@0.13 và DOC-06@0.13; hash chính xác trong render-results.json |
| Thực hiện | Codex; kiểm tra nội bộ bản thiết kế theo yêu cầu người dùng |
| Công cụ | Mermaid 11.12.0; Playwright và Chrome cài sẵn; phiên bản Chrome ghi trong kết quả |
| Kết quả render | 30/30 sơ đồ; 26 DOC-05 và 4 DOC-06 |
| Kết quả mở SVG độc lập | 30/30 PASS; không còn lỗi XML parser khi mở trực tiếp bằng trình duyệt |
| Giới hạn | Kiểm tra source và hình render; không phải kiểm chứng phần mềm hay duyệt kiến trúc độc lập |

[Mở bộ sơ đồ](../evidence/IE-VEV-ARCH-VIEW-002/index.html) ·
[Kết quả và hash](../evidence/IE-VEV-ARCH-VIEW-002/render-results.json) ·
[Kết quả mở SVG độc lập](../evidence/IE-VEV-ARCH-VIEW-002/svg-open-results.json).

Mỗi view có ID, mục đích, phạm vi, nguồn yêu cầu, chú giải và diễn giải bên cạnh trong DOC-05.
Script `scripts/render-architecture.cjs` kiểm tra ID duy nhất, mô tả accessibility và render toàn bộ
Mermaid. SVG là bản phóng to; PNG là ảnh kiểm tra. Bản xem HTML mở trực tiếp trên máy và dùng SVG
cục bộ. Khi render lại, công cụ cần truy cập bản Mermaid đã ghim trên CDN.

Lần kiểm tra mở trực tiếp ban đầu tái hiện lỗi XML trên 7 SVG có nhãn xuống dòng: Mermaid trả về
thẻ HTML `<br>` trong `foreignObject`, trong khi tài liệu SVG độc lập yêu cầu cú pháp XML. Bộ sinh
hiện tuần tự hóa DOM bằng `XMLSerializer` trước khi ghi file. Script
`scripts/check-architecture-svg.cjs` mở từng SVG qua URL `file:` trong Chrome và từ chối mọi
`parsererror`; lần kiểm tra sau sửa đạt 30/30. Việc chuẩn hóa chỉ sửa cách đóng gói SVG, không thay
đổi nội dung kiến trúc trong Markdown.

| View mới | Nội dung kiểm tra trực quan và logic |
|---|---|
| ACT-002 | Reference phải có Checkout trước khi Check-in; bổ sung Reject/Withdraw; bố cục dọc giúp đọc thay vì thu nhỏ một dải ngang |
| SEQ-008 | Kiểm tra quyền người quản trị trước thay đổi tài khoản; session cũ bị từ chối; công việc local được giữ lại |
| STATE-005 | Hai đối tượng có vòng đời riêng; assignment ghim phiên bản Role; hiệu lực phụ thuộc thời gian và đánh giá quyền hiện tại |
| SEQ-009 | Upload đi qua Server; lỗi validation không cho xác nhận; commit kiểm tra Checkout và lifecycle, giữ nguyên tính nguyên tử |
| SEQ-010 | Có cả đường tự động và thủ công; source, digest, profile và producer được kiểm tra; lỗi không thay nguồn |
| SEQ-011 | Khôi phục từ bộ backup, kiểm tra đủ database/file/configuration/key; thu hồi session đã phục hồi và đối soát quyền trước mở lại |
| SEC-001 | Phân biệt luồng dữ liệu với thứ tự kiểm tra quyền; có bảng nguy cơ và kiểm soát; nhiều đường nối cần xem SVG phóng to |

Tất cả bảy ảnh mới đã được xem trực tiếp. Các sequence cần trang ngang hoặc xem phóng to; không
nên ép vào cột văn bản hẹp. 23 hình cũ được render lại để kiểm tra cú pháp; hồ sơ kiểm tra hình cũ
vẫn nằm ở VEV-001. Phần security hiện là data-flow và bảng nguy cơ/kiểm soát kiến trúc, chưa phải
đánh giá threat model đầy đủ theo một phương pháp chuyên biệt.

Thay đổi: [CHG](CHG-2026-09-11-architecture-view-completion.md).
