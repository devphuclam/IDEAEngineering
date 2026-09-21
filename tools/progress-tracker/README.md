# IDEA Engineering — Progress Tracker (prototype)

Đây là công cụ local để ghi nhận trạng thái thực tế của các Delivery Card vào
`planning/idea-technical-pilot-execution-register.json`. Nó không phải backend của IDEA và không
thay thế Project Management Compiler.

## Chạy

Nhấp đúp vào:

`run-idea-progress-tracker.cmd`

Script mở một local server ở `http://localhost:8097/` và mở trình duyệt. Không cần cài package hay
database. Đóng cửa sổ PowerShell để dừng.

## Cách dùng

1. Chọn một card ở bảng bên trái.
2. Bấm **Bắt đầu** khi thật sự bắt tay vào làm. Công cụ kiểm tra giới hạn một card đang làm và
   dependency trực tiếp.
3. Cuối ngày nhập **Giờ đã làm** và **Giờ còn lại**, rồi bấm **Ghi nhận hôm nay**.
4. Khi bị chặn, chọn/tạm dừng và ghi rõ lý do.
5. Khi đầu ra và điều kiện hoàn thành đã được kiểm tra, nhập mô tả bằng chứng, rồi bấm **Hoàn
   thành card**.

Mỗi lần ghi nhận sẽ tăng `registerRevision` và cập nhật
`manifest.execution.expectedRegisterRevision` trong cùng thao tác. Công cụ không tự đoán số giờ.

## Trước khi giao cho Project Management Compiler

Đây là local preview. Sau khi cập nhật:

```powershell
pwsh -NoProfile -File .\scripts\validate-project-management-source.ps1 -RunFixtures
```

Nếu validator đạt, review diff, commit cả Execution Register và manifest lên `main`, sau đó cho
Project Management Compiler import đúng commit mới. Compiler không tự đọc thay đổi chưa commit.
