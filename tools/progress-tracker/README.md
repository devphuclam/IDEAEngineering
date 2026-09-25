# IDEA Engineering — Progress Tracker

Đây là công cụ local để ghi nhận trạng thái thực tế của các Delivery Card vào
`planning/idea-technical-pilot-execution-register.json`. Nhật ký phiên làm việc được lưu riêng tại
`planning/idea-progress-work-journal.json`. Công cụ không phải backend của IDEA và không thay thế
Project Management Compiler.

## Chạy

Nhấp đúp vào:

`IDEA-Progress-Tracker.cmd` ở thư mục gốc của dự án.

Script mở một local server ở `http://localhost:8097/` và mở trình duyệt. Không cần cài package hay
database. Nếu tracker đã chạy, lần nhấp tiếp theo chỉ mở lại đúng trang đang chạy. Nếu cổng `8097`
bị một chương trình khác sử dụng, tracker tự thử các cổng tiếp theo đến `8107` và hiển thị địa chỉ
đã chọn. Đóng cửa sổ PowerShell của phiên đang phục vụ để dừng.

## Cách dùng

1. Chọn một card ở bảng bên trái.
   Card P07 hiển thị sáu bước con review đọc từ danh sách Kanban và checklist Spec Kit. Có thể
   tìm `P02`, `P03`, `T011` hoặc `T016` để thấy chúng dưới P07; đây không phải card riêng.
   Dấu checklist đã đánh dấu không tự chuyển kết quả review hoặc PG4 thành `PASS`.
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

### P07 và điều kiện bắt đầu PH1

P07 có thể bắt đầu để ghi giờ review T011/T016 và chuẩn bị hồ sơ PG4. Không được đóng P07 khi
chưa có quyết định PG4 `COMPLETE` với một trong bốn kết quả `PASS`, `PASS-WITH-ACTIONS`, `FAIL`
hoặc `BLOCKED`. `FAIL`/`BLOCKED` vẫn là quyết định đã ghi nhưng **không** mở PH1.

F01-A và các card làm sản phẩm bị chặn cho đến khi hồ sơ
`specs/004-technical-pilot-readiness/pg4-gate-record.md` cho phép đúng successor PH1 theo
[PG4 contract](../../specs/004-technical-pilot-readiness/contracts/pg4-gate-record.md).
Tracker đọc khối `pg4-authorization` trong hồ sơ đó, kiểm tra T011/T016 đã ghi và chặn lại
nếu quyết định bị mở lại hoặc việc duyệt có điều kiện đã hết hạn. Giao diện chỉ hiển thị lý do;
server mới là chỗ từ chối thao tác. Validator cũng từ chối công bố snapshot có card PH1 đang
thực hiện mà không có quyền PG4. Các kiểm tra máy không thay thế review của Gate Authority.

## Ghi nhận qua cuộc trò chuyện với agent

Người dùng có thể yêu cầu agent thực hiện cùng các thao tác bằng câu lệnh rõ ràng:

- `Bắt đầu P04` — mở P04 và bắt đầu một phiên tính giờ.
- `Dừng` — đóng phiên của card đang hoạt động nhưng giữ card ở `Đang thực hiện`.
- `Tiếp tục` — mở phiên mới cho card đang hoạt động.
- `Hoàn thành P04` — kiểm tra điều kiện hoàn thành và bằng chứng rồi đóng card.

Sau khi một card đã hoạt động, có thể bỏ Card ID trong lệnh dừng, tiếp tục hoặc hoàn thành. Câu nói
chung như `làm tiếp đi` không phải lệnh tính giờ vì không xác định chắc chắn card hoặc thời điểm bắt
đầu. Agent phải dùng cùng Progress Tracker/Execution Register, không được tạo một sổ giờ riêng.

Nếu công việc cũ không có phiên timer, chỉ ghi ước lượng hồi tố khi người dùng xác nhận con số. Bản
ghi phải nêu rõ đó là ước lượng, giữ giá trị cũ/mới và lý do trong Work Journal; không được dùng giờ
kế hoạch làm giờ thực tế nếu chưa có xác nhận đó.

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
