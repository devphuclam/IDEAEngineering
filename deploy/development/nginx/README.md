# Nginx development entry

Đầu vào dev đã chạy thật: **https://localhost:18448/**.
Swagger: **https://localhost:18448/dev-api/**, chỉ dùng sau khi đăng nhập.

Luồng hiện tại: browser → SSH loopback → Nginx HTTPS `127.0.0.1:18448`
→ packaged IDEA Server HTTPS `127.0.0.1:18449` → PostgreSQL test hiện có.
Web được Server phục vụ từ JAR, không phải trang HTML giả hay Vite thay thế.

Đây là deployment dev riêng cho [Issue #49](https://github.com/devphuclam/IDEAEngineering/issues/49),
chưa phải production, LAN/multi-site, HA hoặc triển khai Gateway. Không đổi
Java, UI, API, phân quyền, schema hoặc dependency của ứng dụng.

## Mở / xem trạng thái / dừng

Trong PowerShell Windows trên máy dev đã cấu hình, chọn một lệnh:

```powershell
$nginxLauncher = 'C:\Users\TD-999\.codex\worktrees\nginx-dev-entry\IDEAEngineering\deploy\development\nginx\launch.ps1'
& $nginxLauncher -Action Start
& $nginxLauncher -Action Status
& $nginxLauncher -Action Stop
```

`Start` kiểm hash, quyền sở hữu tiến trình, TLS và database rồi mới báo
`NGINX_ENTRY=READY`. Nó không mở browser tự động.

`Status` của bản đang chạy báo `NGINX_DEV_STATE=RUNNING`, `NGINX=UP`,
`SERVER=UP`, `POSTGRESQL=UP`, `UPSTREAM_TLS=VERIFIED` và
`NGINX_DEV_FORWARD=RUNNING`. `DEGRADED` hoặc lỗi không phải thành công.

`Stop` chỉ dừng forward mới và hai tiến trình do launcher này sở hữu. Không
xóa database, tài khoản, file chứng chỉ hay package; không dừng bản dev cũ.
Không cần chạy `provision.sh` lại cho bản đã provision.

Các path/port trong slice này được pin cho đúng máy Windows và tài khoản Ubuntu
đã duyệt; đây chưa phải installer dùng chung cho mọi máy.

## Đăng nhập và thử Swagger

Sử dụng tài khoản **synthetic** hiện có `iam-assignment.admin`; không dùng tài
khoản/mật khẩu công ty. Để xem private handoff, tại `apps/web` của repo chạy
`npm run dev:credentials` trong terminal tương tác. Không gửi hoặc chụp mật khẩu.

Sau đăng nhập, mở `/dev-api/`, thử GET session → 200, POST logout → 204,
rồi GET session → 401. Swagger vẫn dùng ordinary HttpOnly session và CSRF
của Server; không có JWT hoặc quyền ngầm từ Nginx.

Fixture đã được dùng trong human review trước đó, nên quyền hiện tại không
nhất thiết giống fixture ban đầu. Ở lượt qualification này, context trả 200
nhưng Actor không có `account.read`: danh sách Account trả 403 và UI thông báo
thiếu quyền. Đây là refusal đúng; không tự cấp role để làm màn hình hết lỗi.

## TLS, dữ liệu và rollback

- Chứng chỉ test đã được trust bình thường, SAN `localhost` + `127.0.0.1`.
  SHA-256 `6cee40386182902343aeb0ad6db1110656b1c293dcc3c33fbc3fe32251d965ad`.
  Hết hạn **2026-10-14T05:19:50Z**; launcher từ chối khi còn dưới một giờ.
  Gia hạn là thao tác riêng, không bỏ qua TLS warning.
- Database giữ nguyên `idea_ddm_iam_ui_20261007_46`, schema
  `iam_ui_c3b8cde44f9a4d1199306c381c12d1bb`; runtime chỉ dùng
  `idea_ddm_app`. Không chạy migration, bootstrap hoặc seed.
- Runtime/process state, encrypted key và private logs nằm trong
  `/home/phuclam/idea-nginx-dev-20261008-49`, owner `phuclam`, mode 700.
  Không commit key/password hoặc đưa raw private log vào evidence.
- Rollback: dùng `Stop` ở trên rồi quay về đường dev cũ của repo nếu cần.
  Bản preview 18444 và Feature009 18446/Vite5173 không bị launcher này sửa.
  Bản dev cũ đã Dừng thì vẫn Dừng, không tự mở lại.
- Khi SSH/hotspot mất kết nối, hash drift, port bị chiếm hoặc ownership/TLS
  không khớp: xem lỗi, không kill tiến trình khác hay tải package thay thế.

Xem [exact intake/recipe](intake.md) và [executed results/limits](results.md).
Human acceptance và merge vẫn là bước riêng; PR không được tự merge.
