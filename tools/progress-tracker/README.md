# IDEA Engineering — Progress Tracker

Đây là công cụ local để ghi nhận trạng thái thực tế của các Delivery Card vào
`planning/idea-technical-pilot-execution-register.json`. Nhật ký phiên làm việc được lưu riêng tại
`planning/idea-progress-work-journal.json`. Công cụ không phải backend của IDEA và không thay thế
Project Management Compiler.

## Chạy

Nhấp đúp vào:

`run-idea-progress-tracker.cmd`

Script mở một local server ở `http://localhost:8097/` và mở trình duyệt. Không cần cài package hay
database. Đóng cửa sổ PowerShell để dừng.

## Cách dùng

1. Chọn một card ở bảng bên trái.
2. Bấm **Bắt đầu làm** khi thật sự bắt tay vào card. Công cụ kiểm tra giới hạn một card đang làm và
   dependency trực tiếp, ghi mốc bắt đầu rồi mở bộ đếm giờ.
3. Bấm **Dừng tính giờ** khi nghỉ, họp, hết ngày hoặc chuyển sang việc khác. Card vẫn ở trạng thái
   `Đang thực hiện`; chỉ thời gian của phiên đã đóng được cộng vào giờ làm thực tế.
4. Bấm **Tiếp tục tính giờ** để mở phiên mới. Nếu card thật sự bị chặn, dùng **Tạm ngưng công việc**
   và ghi blocker; không dùng trạng thái này chỉ để dừng đồng hồ.
5. **Lưu hiệu chỉnh giờ** chỉ dùng khi cần sửa tổng giờ hoặc ước lượng còn lại. Mọi sửa đổi phải có
   lý do và được giữ trong nhật ký; dữ liệu cũ không bị xóa khỏi dấu vết kiểm tra.
6. Khi đầu ra và điều kiện hoàn thành đã được kiểm tra, nhập bằng chứng rồi bấm **Hoàn thành card**.
   Công cụ đóng phiên đang chạy, ghi mốc hoàn thành và đặt giờ còn lại về `0`.

Mỗi lần ghi nhận sẽ tăng `registerRevision` và cập nhật
`manifest.execution.expectedRegisterRevision` trong cùng thao tác. Giờ thực tế là tổng thời gian
các phiên đã đóng, không phải khoảng thời gian lịch từ lúc bắt đầu đến lúc hoàn thành. Giờ còn lại
được giảm theo thời gian vừa ghi nhận nhưng vẫn là một ước lượng có thể hiệu chỉnh.

Phiên dài hơn tám giờ hoặc đi qua ngày mới phải được người dùng xác nhận trước khi ghi. Nhật ký lưu
thời gian theo phút; màn hình tổng hợp hiển thị theo giờ.

## Trước khi giao cho Project Management Compiler

Các thao tác trên card chỉ tạo bản nháp cục bộ. Nút **Ghi nhận & công bố** thực hiện chuỗi kiểm soát:

1. từ chối nếu không ở nhánh `main` hoặc working tree có thay đổi ngoài ba file tiến độ;
2. chạy validator và fixture;
3. commit Execution Register, manifest và nhật ký phiên làm việc;
4. kiểm tra lại snapshot sạch rồi push lên `origin/main`.

Có thể kiểm tra thủ công trước khi công bố bằng lệnh:

```powershell
pwsh -NoProfile -File .\scripts\validate-project-management-source.ps1 -RunFixtures
```

Nếu công bố thất bại sau khi đã tạo commit, công cụ không tự xóa hoặc viết lại lịch sử Git. Thông
báo lỗi sẽ nêu rõ commit đang nằm cục bộ hay bước push nào chưa đạt. Project Management Compiler
chỉ nhập snapshot từ commit đã push thành công.
