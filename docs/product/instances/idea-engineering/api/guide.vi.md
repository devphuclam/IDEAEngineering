# Đọc API contract Core v0 — hướng dẫn theo luồng

| Trường kiểm soát | Giá trị |
|---|---|
| ID / loại | `IE-API-GUIDE-VI-001` / hướng dẫn đọc, không phải nguồn yêu cầu sản phẩm |
| Phiên bản / trạng thái | `0.1` / `Draft`, `INFORMATIVE` |
| Chủ trì / tác giả | Principal Product Author / Codex |
| Review / chấp nhận | Project Reviewer / Product Decision Authority; bản này `NOT-RUN` |
| Nguồn / baseline | [Catalogue tiếng Anh](README.md), [Identity/Session](identity-session.md); `9dab479db929bce88f101cdcbeee91dec50bc25a`, ngày 06/10/2026 |
| Kiểm soát kế thừa | Classification, retention, Work Item #40, worker mode, supersession, effective date và giới hạn bằng chứng theo envelope của catalogue; sửa khi nguồn tiếng Anh thay đổi |

## 1. API contract trả lời điều gì?

Ví dụ “khóa một tài khoản” không chỉ là biết URL. Contract cần cho người viết client và QA biết:

- Gửi dữ liệu nào, đến đúng tài khoản nào?
- Ai được phép làm, trong Organization nào?
- Phải đang ở phiên bản trạng thái nào?
- Thành công thì dữ liệu nào đổi, dữ liệu nào phải giữ nguyên?
- Bị từ chối hoặc mất response thì xử lý thế nào?

Bản v0.1 dùng Identity/Session đang có làm mẫu cụ thể. Những nghiệp vụ khác nằm trong
[catalogue](README.md#2-domain-and-operation-families) ở mức nhóm thao tác và chủ sở hữu; **chưa tự
đặt URL hay JSON cho chúng**. Nhãn `DESIGN` không có nghĩa là đã gọi được API.

## 2. Luồng đăng nhập → dùng phiên → đăng xuất

```text
Trang IDEA cùng HTTPS origin
  → I01: lấy CSRF, giữ tạm trong RAM
  → I02: gửi username/password dạng form + CSRF
  → 200: Server tạo/đổi session cookie; lấy lại CSRF
  → I03: lấy ActorId/AccountId do Server xác định
  → thực hiện thao tác được phép
  → I04: logout + CSRF
  → 204: phiên hiện tại bị revoke
  → I03 với phiên cũ: 401
```

Cookie HttpOnly do browser giữ và gửi; JavaScript không đọc nó. Không tạo JWT hay lưu bearer vào
localStorage để thay cơ chế này. ActorId nhận về dùng để hiển thị; gửi ActorId khác không cho phép
mạo danh. Đăng nhập thành công cũng **không** tự cấp quyền quản lý account hay quyền tài liệu.

Phiên hết hạn sau 2 giờ không hoạt động hoặc tối đa 8 giờ. Không phải chờ 2–8 giờ để dev/test:
test đã dùng thời gian điều khiển; contract giữ đúng policy thật. Restart Server làm phiên runtime
cũ mất hiệu lực, nhưng không xóa tài khoản hay mật khẩu. Muốn vào lại phải đăng nhập mới.

Không ghi password, cookie, CSRF hay proof thật vào tài liệu/screenshot/log. Password được nhập
tạm trong password control và gửi request, rồi xóa khỏi state hiển thị sau submit/unmount.

## 3. Ví dụ tạo và quản lý account

Một người **có assignment Account Administrator đúng Organization Scope** gọi I05. Request gồm
`operationId`, `organizationId`, `displayName`, `login`. Kết quả `201` trả ActorId, AccountId,
LoginIdentityId, trạng thái `PENDING` và `securityVersion`.

Điều này chỉ tạo danh tính. Nó không thêm người đó vào Project/Group, không cấp Role Assignment
và không cho đọc tài liệu. Super Administrator cũng cần assignment Account Administrator riêng
nếu muốn quản lý account.

Khi disable/re-enable (I06/I07), client gửi version đang biết trong `expectedSecurityVersion` và
lý do. Nếu version đã cũ, Server trả `409`; client không tự tăng số rồi thử để vượt kiểm tra.
ActorId, AccountId và lịch sử được giữ nguyên. Re-enable không đổi mật khẩu; mọi phiên cũ vẫn chết.

Hiện có HTTP account commands nhưng **chưa có Account Management UI hoặc account-list/query API**
được hứa trong bản này. Tài liệu không thể biến phần chưa xây thành tính năng đang có.

## 4. First setup khác reset

| Thao tác | Ý nghĩa |
|---|---|
| Cấp first-setup proof | Account Administrator **v2** có quyền setup riêng; target phù hợp ở `PENDING`, chưa có credential. |
| Redeem first-setup proof | Người giữ proof đúng target dùng I09 để đặt mật khẩu đầu tiên; Account thành `ACTIVE`, nhưng chưa tự đăng nhập. |
| Cấp reset proof | Cần quyền reset riêng của v2 và **LoginIdentityId chính xác**; không đoán login đầu tiên trong Account. |
| Redeem reset proof | Chỉ đổi credential của login đã pin; tăng Account security version và vô hiệu hóa mọi session cũ. |
| Reset account đang `DISABLED` | Vẫn `DISABLED`; Actor vẫn bị khóa. Phải re-enable riêng, rồi đăng nhập mới. |

Proof dùng một lần, hết hạn đúng sau 15 phút, gắn Account + Login Identity + security version.
Người redeem không cần role quản trị: proof đúng target là authority của bước này, CSRF vẫn cần.
Mật khẩu mới: ít nhất 15 ký tự Unicode và tối đa 72 byte UTF-8; không cắt bớt hoặc trim tự động.

Assignment v1 cũ không tự có quyền setup/reset. Và API cấp proof I08 **mặc định trả `503`** vì chưa
qualify kênh delivery thật; trả proof trực tiếp chỉ là chế độ synthetic đã bật có kiểm soát.
Không diễn giải route có trong Swagger thành việc đã có email/reset-password workflow cho công ty.

## 5. Đọc lỗi và retry cho đúng

| Nhìn thấy | Hiểu và làm gì |
|---|---|
| `400` | Request/proof không hợp lệ. Proof hết hạn hoặc đã dùng không phải một lần thành công mới. |
| `401` | Không có phiên đủ điều kiện, hoặc login bị từ chối chung. Không suy ra username tồn tại từ lỗi. |
| `403` | CSRF hoặc quyền/scope không đủ. Lấy CSRF mới không giải quyết thiếu quyền. |
| `409` | Trạng thái/version hoặc login conflict. Đối chiếu state bằng đường được kiểm soát, không ghi đè. |
| `503` | Không khả dụng, kể cả delivery chưa bật. UI không hiển thị thành công. |
| Mất response | Chưa biết transaction đã commit chưa. Không khẳng định rollback, không tự tạo operation mới. |

`operationId` không phải “bùa chống trùng” cho mọi API. Identity hiện không hứa trả lại canonical
result khi gửi lại cùng UUID. Logout đã thành công thì retry bằng phiên cũ có thể là `401`;
proof đã redeem thì dùng lại bị từ chối. Cơ chế retry của Check-in, F04 sample hoặc custody phải
đọc đúng contract của chủ sở hữu, không áp dụng lan sang Identity.

## 6. Cách dùng bản v0.1 để review

Backend đối chiếu field/status/state với [bản chi tiết](identity-session.md). Client dùng đúng
session/CSRF và phân biệt lỗi với thành công. QA dùng test/evidence được dẫn ở cuối bản chi tiết;
tài liệu này không chạy lại hay thay thế chúng.

Những gì chưa biết được ghi `UNKNOWN`, những gì chưa chạy là `NOT-RUN`. Bản này không thêm API,
schema, dependency, UI, gate runtime hay Tracker action. Review tiếp theo là review tài liệu;
không phải tuyên bố toàn Core đã triển khai hoặc production-ready.
