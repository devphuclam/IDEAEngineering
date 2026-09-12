# Bổ sung bảy sơ đồ kiến trúc logic

| Trường | Giá trị |
|---|---|
| Mã | IE-CHG-ARCH-VIEWS-001 |
| Ngày | 11-09-2026 |
| Trạng thái | Draft; người dùng đã yêu cầu thực hiện, chưa ghi nhận duyệt kiến trúc |
| Phạm vi | DOC-05: Draft 0.12 → 0.13; bảy view và diễn giải tương ứng |
| Nguồn | Các yêu cầu hiện hành trong DOC-04@0.13; Interface và quy tắc có sẵn trong DOC-05; DOC-06@0.13 |

Theo yêu cầu tập trung hoàn tất kiến trúc, đợt này bổ sung:

1. ACT-002: quy trình từ đăng ký tài liệu tới Release và lấy lại đúng hồ sơ.
2. SEQ-008: đăng nhập, thu hồi session và giữ an toàn công việc trên máy.
3. STATE-005: vòng đời phiên bản Role và Role Assignment.
4. SEQ-009: xem, xuất và nhập BOM có kiểm tra, preview và xác nhận.
5. SEQ-010: tạo hoặc nộp Representation gắn với đúng Generation nguồn.
6. SEQ-011: backup và khôi phục một bộ dữ liệu đồng nhất.
7. SEC-001: luồng dữ liệu qua các vùng tin cậy, nguy cơ và biện pháp kiểm soát.

Các trạng thái trong hình là mô hình logic; chưa quy định enum, schema hay giao thức triển khai.
Không thay đổi Requirement, danh mục Permission, lựa chọn Tech hay lịch thực hiện. Việc cập nhật
các bản trình Feature/Spec/Tech, roadmap và prototype được giữ cho bước sau theo chỉ dẫn người dùng.
DOC-06 giữ nguyên. 23 hình và hồ sơ kiểm tra trước được bảo toàn để đối chiếu.

Kiểm tra và bản xem: [VEV-002](VEV-2026-09-11-architecture-view-completion.md).
Các điểm cần review tập trung: điều kiện Check-in khi nhập BOM; Role mới không tự đổi assignment cũ;
thu hồi phiên đăng nhập; tính đồng nhất của bộ backup; worker chỉ trả ứng viên kết quả.

Sau khi mở SVG độc lập phát hiện lỗi XML ở nhãn xuống dòng, bộ sinh được sửa để xuất XML hợp lệ và
thêm kiểm tra hồi quy bằng trình duyệt cho toàn bộ 30 SVG. Đây là sửa lỗi bản dựng; nội dung và ý
nghĩa các view không thay đổi.
