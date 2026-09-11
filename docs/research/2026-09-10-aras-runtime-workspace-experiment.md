# Kiểm chứng runtime Aras cho Checkout, Check-in và Reference

| Thuộc tính | Giá trị |
| --- | --- |
| Ngày thực hiện | 10-09-2026 |
| Target | Aras Innovator `14.35.0.44037`, database thử nghiệm đã nhận diện |
| Phạm vi | Lock/Unlock, Generation, gắn File, custom Check-in, tải bản tham chiếu và khả năng phục hồi sau lỗi |
| Trạng thái | Bằng chứng nghiên cứu; không phải yêu cầu IDEA, kết quả VVP hoặc phê duyệt sản phẩm |
| An toàn | Chỉ thao tác trên một CAD test có tiền tố `ZZ-IDEA-RUNTIME-CICO`; không sửa CAD nghiệp vụ/demo sẵn có |

## 1. Kết luận

Runtime xác nhận Aras có một nền tảng lock/version/file hữu ích để tham khảo, nhưng custom connector
đang có không đủ chặt để IDEA sao chép nguyên trạng:

1. Lock nằm trên server và chặn cập nhật khi Item chưa lock. Tuy nhiên, trong các lần thử bằng hai
   token của **cùng một tài khoản**, quyền lock đi theo tài khoản chứ không đi theo phiên hoặc
   workspace: token sau có thể cập nhật và unlock lock do token trước tạo.
2. `version` tạo Generation mới và đánh dấu Generation cũ không còn current. Trên tài khoản admin,
   Generation lịch sử vẫn có thể bị lock và update trực tiếp nếu gọi API bằng ID của bản cũ.
3. Method tùy biến `idea_CommitCadCheckin` kiểm tra người giữ lock, gắn File rồi unlock, nhưng không
   kiểm tra current head, expected Generation, digest hoặc Operation ID. Thực nghiệm cho thấy nó có
   thể Check-in vào một Generation lịch sử đã cũ.
4. Method tùy biến không tạo Generation mới khi nội dung được Check-in. Check-in lại đúng File vẫn
   thành công và đổi `modified_on`, nhưng không phân biệt có thay đổi và không có thay đổi về mặt ngữ
   nghĩa.
5. Tải File để đọc không cần lock và bytes tải về khớp hoàn toàn fixture. Connector hiện tại chỉ xem
   đây là mở read-only; nó không lưu một Reference manifest có Generation và digest để phát hiện stale.
6. Mã upload của connector đọc toàn bộ file vào bộ nhớ rồi tạo thêm một payload đầy đủ. Cách này
   không đáp ứng mục tiêu một file có thể lên tới nhiều GB.

Vì vậy, thiết kế IDEA hiện tại nên giữ hướng **mạnh hơn primitive Aras đã quan sát**: Reservation gắn
với Workspace và expected Generation; Reference ghim đúng Generation/digest; Check-in có Operation
ID, upload tiếp tục được, kiểm tra lại current head và kết quả logic tất cả-hoặc-không tài liệu nào.

## 2. Cách đọc bằng chứng

- `TARGET-RUNTIME FACT`: request đã thực sự chạy trên target nêu trên và kết quả đã được quan sát.
- `TARGET-STATIC FACT`: schema, Method code đọc từ target hoặc source snapshot trong workspace nghiên
  cứu; mỗi kết luận phải nói rõ nguồn, không tự chứng minh mọi đường chạy hoặc binary nào đang chạy.
- `INFERENCE`: bài học thiết kế rút ra cho IDEA; không phải tuyên bố về mọi bản Aras hoặc một quyết
  định mới.
- `NOT-RUN`: chưa có bằng chứng thực thi cho trường hợp đó.

Không dùng một phát hiện trên tài khoản admin để suy rộng thành hành vi của mọi người dùng, role,
client hoặc phiên bản Aras.

## 3. Fixture và trạng thái sau thử nghiệm

- CAD test: `ZZ-IDEA-RUNTIME-CICO-20260910-01`.
- File test: `ZZ-IDEA-RUNTIME-CICO-20260910-v1.txt`, 157 byte.
- SHA-256 của fixture và bản tải lại từ Vault:
  `FD7445960F5A0D53255F4992A41C6E18EACAF36A79D6AA55969F10EC649F5B2C`.
- Chuỗi thử tạo bốn Generation trong Revision A. Generation 4 là current; truy vấn thông thường theo
  item number chỉ trả Generation 4.
- Kiểm tra AML cuối cùng xác nhận Generation 1–4 đều **unlocked**. File test được gắn ở Generation
  3–4; Generation 1–2 không có File.
- CAD test và File test được giữ lại với tên nhận diện rõ để truy vết bằng chứng. Chúng không phải dữ
  liệu nghiệp vụ hoặc bằng chứng sản phẩm IDEA đã hoạt động.

## 4. Ma trận kiểm chứng runtime

| ID | Thao tác | Kết quả quan sát | Lớp bằng chứng | Ý nghĩa giới hạn |
| --- | --- | --- | --- | --- |
| `ARAS-RT-01` | Token A lock CAD test; token B của cùng tài khoản đọc trạng thái | Token B thấy lock tồn tại | `TARGET-RUNTIME FACT` | Lock được lưu phía server; chưa kiểm tra tài khoản khác |
| `ARAS-RT-02` | Token B gọi lock lần nữa | Server trả `ItemIsAlreadyLockedException` | `TARGET-RUNTIME FACT` | Native lock không biến lần gọi lặp thành success idempotent |
| `ARAS-RT-03` | Token B cập nhật và unlock lock do token A tạo | Cả hai thao tác thành công | `TARGET-RUNTIME FACT` | Trên ca thử này quyền đi theo cùng user, không theo token/session/workspace |
| `ARAS-RT-04` | Unlock lại hoặc update khi CAD không lock | Server lần lượt trả `ItemIsNotLockedException` | `TARGET-RUNTIME FACT` | Client cần xử lý retry/trạng thái hiện tại có chủ ý |
| `ARAS-RT-05` | Gọi native `version` | Tạo ID/Generation mới; bản trước thành `is_current=0` | `TARGET-RUNTIME FACT` | Aras tách các Generation; chưa nói khi nào IDEA phải tạo Generation |
| `ARAS-RT-06` | Admin lock và update Generation lịch sử bằng ID cũ | Thành công | `TARGET-RUNTIME FACT` | Cảnh báo nghiêm trọng cho API tùy biến; phải kiểm tra current head. Chưa thử user thường |
| `ARAS-RT-07` | Gọi custom Check-in khi chưa lock | Bị từ chối; File đã upload vẫn còn | `TARGET-RUNTIME FACT` | Lock owner được kiểm tra, nhưng staging/orphan cần quy trình riêng |
| `ARAS-RT-08` | Token A lock; token B cùng user gọi custom Check-in | Gắn File và unlock thành công; không tạo Generation mới | `TARGET-RUNTIME FACT` | Xác nhận Check-in không bị ràng buộc vào workspace/session trong Method hiện tại |
| `ARAS-RT-09` | Check-in với File ID không tồn tại | Bị từ chối; lock được giữ; native file không đổi | `TARGET-RUNTIME FACT` | Có rollback hữu ích trong lỗi này; không chứng minh mọi crash window |
| `ARAS-RT-10` | Check-in lại đúng File đang gắn | Thành công, unlock, Generation không đổi; `modified_on` đổi | `TARGET-RUNTIME FACT` | Không có semantic no-change result rõ ràng |
| `ARAS-RT-11` | Check-in vào Generation 3 sau khi Generation 4 đã current | Method chấp nhận và cập nhật bản lịch sử; current head vẫn là Generation 4 | `TARGET-RUNTIME FACT` | Method thiếu expected/current-head guard; IDEA không được sao chép hành vi này |
| `ARAS-RT-12` | Tải File qua OData mà không lock | 157 byte tải về khớp SHA-256 fixture | `TARGET-RUNTIME FACT` | Đủ cho đọc bản cụ thể; không tự tạo Reference manifest hoặc quyền publish |
| `ARAS-RT-13` | Đọc trạng thái rút gọn qua OData rồi đối chiếu AML | OData CAD payload không chứa `locked_by_id`/`native_file`; AML trả đúng các trường này | `TARGET-RUNTIME FACT` | UI/client không được coi trường vắng mặt trong projection là “unlocked/no file” |

## 5. Kiểm tra Method và connector

### 5.1 Method đang lưu trên server

`idea_CommitCadCheckin` được đọc trực tiếp từ target, có SHA-256
`2E46A3243E971D92C63EC93D6043A4F8F6355DC1CE26B57E4CDF7E0C5FA4D760` tại thời điểm kiểm tra.
Phân tích cấu trúc Method cho kết quả:

| Có | Không có |
| --- | --- |
| Kiểm tra `locked_by_id` bằng user hiện tại | Kiểm tra `is_current` hoặc current Working Head |
| Cập nhật `native_file` | `expectedGeneration` |
| Unlock sau update thành công | Digest/checksum nội dung |
| Trả Item sau thao tác | `CheckinOperationId`/idempotency |
|  | Tạo Generation mới |

Đây là `TARGET-STATIC FACT`. Các kết quả `ARAS-RT-07…11` cho thấy những khoảng trống quan trọng đã
thực sự xuất hiện ở đường chạy được thử, không chỉ là nhận xét từ code.

### 5.2 Mã connector trong workspace nghiên cứu

Các quan sát sau là `TARGET-STATIC FACT` từ source snapshot trong workspace nghiên cứu, không phải
bằng chứng binary client nào đang chạy:

- `CheckoutAsync` gọi `get`, kiểm tra điều kiện rồi `lock`; `LockToken` trả cho client chỉ là CAD ID.
- `OpenReadOnlyAsync` chỉ gọi `get` và trả `LockToken = null`; không tạo bản ghi Reference phía server.
- `CheckinAsync` gửi `cad_id` và `uploaded_file_id` vào Method tùy biến; request có trường LockToken
  nhưng đường gọi này không truyền token đó cho Method để xác nhận workspace.
- `VaultClient.UploadFileAsync` dùng `File.ReadAllBytes`, ghép toàn bộ file vào một mảng multipart rồi
  mới gửi. `DownloadFileAsync` cũng lấy toàn bộ bytes trước khi ghi file.

Hai source file được xem có SHA-256:

- `HttpArasCadClient.cs`: `DC722A9975C0B22450E22EA88711950C942E6833BB624822625C446A68B3C024`.
- `VaultClient.cs`: `406CC65D0396251DA489D2188D0D9287B16AC8B0E7E25C4F383B6FC2C3C6EF86`.

## 6. Hợp đồng đề xuất cho IDEA

Đây là `INFERENCE`, phải đi qua Spec/ADR/VVP hiện hành trước khi trở thành product
baseline.

### 6.1 Checkout

Server cấp một Reservation gồm ít nhất: Logical Document, Actor, Workspace, expected Generation,
lease và token không thể đoán. Một token đăng nhập khác của cùng user không được quyền dùng Reservation
của Workspace khác nếu không có recovery/transfer được kiểm soát.

### 6.2 Reference

Workspace Manifest phải ghi Logical Document, exact Generation ID, Artifact ID, digest và thời điểm
lấy. Reference cho phép đọc và so sánh nhưng không cho publish ngược bản gốc. Nếu file bị ứng dụng
CAD/Office sửa, giao diện ghi **Đã thay đổi trên máy** và giữ file; không tự merge hoặc ghi đè.

`Chuyển thành bản làm việc` chỉ thành công khi exact Generation còn current và server cấp được
Reservation. Nếu stale, người dùng được lấy bản hiện hành ở vị trí riêng, tạo tài liệu mới hoặc áp dụng
lại thay đổi có chủ ý.

### 6.3 Check-in

1. Client tạo một `CheckinOperationId` và gửi scope chính xác gồm Document, expected Generation,
   Reservation, Workspace, Artifact metadata và digest.
2. File được upload dạng resumable chunks vào vùng candidate riêng; không đọc toàn bộ file vào bộ nhớ.
3. Server preflight toàn scope rồi kiểm tra lại current head ngay trước commit.
4. Một transaction database có thẩm quyền publish các Generation thay đổi, Working Heads, manifest,
   Audit/outbox và release tất cả Reservation trong scope đã xác nhận.
5. Với tài liệu không đổi, không tạo Generation mới nhưng vẫn ghi kết quả No Change và release
   Reservation. Với scope nhiều tài liệu, kết quả nghiệp vụ là tất cả hoặc không tài liệu nào.
6. Retry cùng Operation ID phải trả lại kết quả cũ hoặc tiếp tục phần còn thiếu; đổi input dưới cùng
   Operation ID phải bị từ chối.
7. Nếu kết quả không chắc chắn do timeout, client hỏi trạng thái operation trước khi gửi lại. File local
   chỉ được đề nghị dọn sau khi server xác nhận `Committed`.

### 6.4 Đối chiếu với thiết kế IDEA hiện hành

Thí nghiệm không tạo thêm Feature mới. Các lỗ hổng quan sát được đã có điểm kiểm soát trong Draft
hiện hành:

| Phát hiện runtime | Điểm kiểm soát IDEA đã có | Việc còn phải chứng minh |
| --- | --- | --- |
| Cùng user nhưng token/workspace khác vẫn dùng được lock | `REQ-WS-002/010/013`; Reservation gắn Workspace | VVP đã được làm rõ để có **cùng một Actor ở hai Workspace**, ngoài ca hai Actor; thực thi vẫn `NOT-RUN` |
| Admin sửa được Generation lịch sử; custom Method nhận stale ID | `REQ-WS-010`; ADR-0005/0006; kiểm tra expected Generation/current head | VVP đã thêm exact historical-ID attempt cho ordinary và privileged identities; thực thi vẫn `NOT-RUN` |
| Custom Check-in không tạo Generation | `REQ-WS-009` yêu cầu đúng một Generation cho mỗi tài liệu thay đổi | Chứng minh changed Check-in và Working Head commit cùng nhau |
| Check-in cùng File không có kết quả No Change rõ | `REQ-WS-008`; `WS-02` trong VVP | Chứng minh semantic equality, không chỉ so File ID/timestamp |
| Lỗi File ID giữ lock nhưng File staged còn lại | `REQ-WS-007/013`; `WS-03/07`; reconciliation | Fault-injection ở mọi ranh giới và chính sách candidate/orphan |
| Read-only download không tạo Reference manifest | `REQ-WS-003/014`; Workspace Manifest | Exact Generation/digest, modified-local và stale conversion tests |
| Upload/download buffer toàn file | `REQ-WS-015`; `QRS-011`; `WS-08` | Streaming/resume/memory evidence bằng fixture nhiều GB |

Ca **cùng Actor, khác Workspace** và ca **gọi Generation lịch sử bằng ordinary/privileged identity**
đã được thêm vào mô tả acceptance/VVP của cùng Draft. Chúng không thay đổi nghĩa hoặc số lượng
requirement; chúng làm rõ fixture để không vô tình chỉ kiểm tra hai tài khoản khác nhau rồi bỏ sót lỗ
hổng vừa quan sát. Mọi thực thi IDEA vẫn là `NOT-RUN`.

## 7. Những kiểm chứng chưa chạy

| Trường hợp | Trạng thái | Điều kiện để chạy an toàn |
| --- | --- | --- |
| Hai tài khoản khác nhau cạnh tranh lock | `NOT-RUN` | Cần thêm một identity thử nghiệm với role giống người dùng thực, không dùng admin để suy rộng |
| User thường cố sửa Generation lịch sử | `NOT-RUN` | Cần role/permission fixture độc lập |
| Server/IIS restart khi đang lock | `NOT-RUN` | Cần remote vào server thử nghiệm, cửa sổ gián đoạn được chấp thuận và log trước/sau |
| Ngắt Vault giữa upload/commit | `NOT-RUN` | Cần fixture fault-injection; không thực hiện trên dữ liệu dùng chung |
| Resume/retry file nhiều GB | `NOT-RUN` | Connector hiện tại buffer toàn file nên không dùng nó để kết luận; cần implementation streaming |
| Check-in nhiều CAD all-or-none | `NOT-RUN` | Cần operation fixture nhiều document và điểm lỗi xác định |
| UI Office/CAD connector chính hãng | `NOT-RUN` | Audit hiện tại kiểm tra platform và connector tùy biến, không đại diện mọi connector Aras |

Server mà người dùng có thể remote vào sẽ cần ở vòng fault-injection để lấy log ứng dụng/Vault và
chứng minh trạng thái trước/sau restart. Nó chưa cần cho kết luận hẹp đã có ở tài liệu này.

## 8. Quan hệ với tài liệu khác

- So sánh nguồn công khai và giới hạn bằng chứng:
  [DDM/Aras Checkout, Reference và Check-in](2026-09-10-ddm-aras-checkout-reference-checkin-comparison.md).
- Quyết định thiết kế đang đề xuất:
  [ADR-0005](../adr/0005-use-immutable-generations-and-atomic-change-sets.md) và
  [ADR-0006](../adr/0006-bind-reservations-to-document-and-workspace.md).
- Change record kiểm soát tác động:
  [IE-CHG-WS-SCALE-001](../product/instances/idea-engineering/registers/CHG-2026-09-10-workspace-transfer-storage-decisions.md).
- Kế hoạch kiểm chứng sản phẩm IDEA:
  [VVP Core v0](../product/instances/idea-engineering/registers/VVP-core-v0-verification-validation-plan.md).

Runtime Aras là benchmark và phản ví dụ thiết kế. Nó không được ghi thành kết quả PASS cho sản phẩm
IDEA, không tự thay đổi Feature/Spec, và không chứng minh parity với DDM.
