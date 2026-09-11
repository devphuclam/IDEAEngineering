# Đối chiếu DDM và Aras cho Checkout, Reference và Check-in nhiều tài liệu

| Thuộc tính | Giá trị |
| --- | --- |
| Ngày kiểm tra nguồn | 2026-09-10 |
| Phạm vi | Q26–Q28: thời hạn/thu hồi Checkout; file Reference bị sửa; Check-in nhiều tài liệu và khôi phục khi lỗi |
| Trạng thái | Research note — không phải Feature, Spec, ADR hoặc quyết định sản phẩm mới |
| Nguồn được phép | Nguồn chính thức của nhà cung cấp và bằng chứng đã được tiếp nhận trong repository |

## 1. Kết luận ngắn

1. **DDM công khai cho thấy có luồng Reserve và Reference, nhưng không công khai đủ chi tiết để kết luận cách hết hạn, tự giải phóng, cưỡng chế thu hồi hoặc khôi phục sau sự cố.** Những phần đó phải ghi là `UNKNOWN`, không được đoán từ giao diện.
2. **Aras dùng cơ chế Claim/Unclaim khá rõ:** một Item chỉ do một người claim; lưu để tiếp tục làm thì vẫn giữ claim; lưu và đóng thì unclaim. Tài liệu chính thức còn nói claim có thể tồn tại qua nhiều phiên làm việc. Nguồn công khai không thiết lập một TTL hay heartbeat mặc định.
3. **Không tìm thấy primitive tổng quát của Aras tương đương hoàn toàn với DDM Reference.** Office Connector có View Mode gần nhất: mở bản không claim để đọc/copy; nếu bản trên server đã đổi thì bản cục bộ cũ không thể claim để sửa trực tiếp. `Save As to Aras` tạo một file/tài liệu mới, không ghi đè bản gốc.
4. **Aras công khai nhiều mảnh ghép giao dịch tốt** — OData Change Set rollback toàn bộ khi một request lỗi, Vault có upload transaction, upload theo chunk và checksum, CheckInManager nhận nhiều Item. Tuy nhiên, các nguồn này **không chứng minh** một lời hứa tổng quát rằng mọi Check-in nhiều tài liệu đều nguyên tử xuyên database + Vault, có retry idempotent và luôn giữ nguyên trạng thái claim sau mọi loại lỗi.
5. Với IDEA, nên giữ các quyết định đã chấp nhận: Reservation gắn với document + workspace + lease + expected Generation; Check-in nhiều tài liệu có kết quả logic “tất cả hoặc không tài liệu nào”; server chặn stale publish; file cục bộ được bảo toàn và không tự merge CAD/Office. Chi tiết đề xuất ở mục 7 không phải là tuyên bố “DDM/Aras làm y như vậy”.

## 2. Quy tắc đọc bằng chứng

Tài liệu dùng các lớp bằng chứng đã định nghĩa trong [clean-room transfer register](../governance/clean-room-transfer-register.md):

- `VENDOR-PUBLIC`: tài liệu, release note hoặc video trên kênh chính thức của nhà cung cấp.
- `TARGET-RUNTIME FACT`: kết quả quan sát trên đúng target đã nhận diện; không tự động chuyển thành sự thật về DDM nói chung.
- `TARGET-STATIC FACT`: cấu hình, schema hoặc snapshot đọc được từ đúng target; chứng minh dữ liệu/cấu trúc đã thấy, không tự chứng minh hành vi khi chạy.
- `IDEA DECISION`: quyết định đã được repository chấp nhận.
- `UNKNOWN`: nguồn đã xem không thiết lập hành vi. `UNKNOWN` không có nghĩa là sản phẩm không có chức năng đó.

Các thuật ngữ Reserve/Claim/Checkout chỉ được so theo mục đích sử dụng. Chúng **không được coi là cùng một giao thức nội bộ** nếu nhà cung cấp không công bố điều đó.

## 3. Q26 — Checkout hết hạn, giải phóng và khôi phục

### 3.1 DDM thiết lập được điều gì

| ID | Lớp bằng chứng | Phát hiện |
| --- | --- | --- |
| DDM-26-01 | `VENDOR-PUBLIC` | Video chính thức [DDM Office — Working with Folders](https://www.youtube.com/watch?v=rlH1fXReZ9Q&t=305s) thể hiện luồng Reserve/Reference và ngôn ngữ về quyền sửa. |
| DDM-26-02 | `VENDOR-PUBLIC` | Release note chính thức [Reserve To / Reference To enhancements](https://www.designdatamanager.com/2016/09/08/ddm-2016-08-whats-new-reserve-to-reference-to-enhancements/) xác nhận có Reserve/Reference To Manager; nội dung công khai chủ yếu nói về chọn folder/divider, cột, sắp xếp, pin và tạo folder. |
| DDM-26-03 | `UNKNOWN` | Không có nguồn chính thức đã kiểm tra nào thiết lập owner key, TTL/lease, heartbeat, tự hết hạn, logout/disconnect, crash persistence, admin break/transfer, cảnh báo người giữ cũ hoặc cách phục hồi. |

Kết quả này phù hợp với giới hạn đã ghi tại [DDM vendor-public baseline, VP-06](../product/knowledge/ddm-vendor-public-baseline.md): bằng chứng công khai đủ để nói **có bề mặt Reserve/Reference**, chưa đủ để đặc tả lock protocol.

### 3.2 Aras thiết lập được điều gì

- Trong Aras Office Connector 27, Claim giữ quyền sửa cho một người; Unclaim trả quyền cho người khác. `Save to Aras` lưu nhưng vẫn giữ claim, còn `Save and Close` lưu rồi unclaim. Nếu đang có thay đổi cục bộ mà Unclaim, connector phải hỏi người dùng có chấp nhận mất thay đổi cục bộ hay không. Đây là `VENDOR-PUBLIC`. [Document Claiming and Unclaiming](https://docs.aras.com/office-connector-oc27/document-claiming-and-unclaiming/0000019e-86f8-d30e-abff-8fff51920000)
- Bảng hành vi chính thức cũng xác nhận Update Save giữ claim và Save and Close bỏ claim; việc xóa file cục bộ sau khi đóng là tùy chọn của quản trị viên, không phải hệ quả bắt buộc. [General Settings](https://docs.aras.com/office-connector-oc27/general-settings/0000019e-86fa-d30e-abff-8fff90420000), [Save and Close](https://docs.aras.com/office-connector-oc27/save-and-close/0000019e-86f7-d30e-abff-8ff7e4fb0000)
- Tài liệu Aras PE 14 trong Innovator Release 32 mô tả Claim giữ Item bị khóa qua nhiều session; `Done` lưu rồi unclaim, `Discard` hoàn tác rồi unclaim, và `Unclaim` giải phóng claim. Đây là `VENDOR-PUBLIC` cho release/application được nêu, không phải lời hứa về mọi cấu hình Aras. [Item View](https://www.aras.com/community/documentationlibrary/Innovator/32/Content/Innovator%2024%20Docs/Aras%20PE%2014%20-%20User's%20Guide/Item%20View.htm)
- Nguồn chính thức đã xem **không thiết lập** TTL, heartbeat hay tự hết hạn mặc định; cũng không đủ để mô tả đầy đủ admin recovery sau khi client crash. Phần này là `UNKNOWN`.

### 3.3 Điều không được suy diễn

- Không được viết “DDM tự hết Checkout sau N phút/giờ”.
- Không được viết “Aras dùng lease” chỉ vì IDEA đã chọn lease. Tài liệu công khai được kiểm tra nghiêng về claim tồn tại cho đến khi có thao tác unclaim/done, không công bố hợp đồng TTL.
- Không được coi logout, mất mạng hoặc đóng CAD là bằng chứng người dùng đã bỏ công việc cục bộ.

## 4. Q27 — File Reference bị sửa cục bộ có được publish không?

### 4.1 DDM và target đã quan sát

| ID | Lớp bằng chứng | Phát hiện |
| --- | --- | --- |
| DDM-27-01 | `VENDOR-PUBLIC` | DDM có luồng Reference trên bề mặt người dùng theo video và release note nêu ở Q26. |
| DDM-27-02 | `UNKNOWN` | Nguồn DDM công khai đã xem không thiết lập việc một file Reference bị ứng dụng CAD/Office sửa cục bộ có thể publish ngược bản gốc hay không; cũng không thiết lập quy trình chuyển Reference thành Checkout, merge/reapply hoặc Save As. |
| ICV-27-01 | `TARGET-RUNTIME FACT` | Target icVault đã quan sát cho phép file cục bộ vẫn bị ứng dụng thiết kế sửa, nhưng server từ chối Check-in khi người khác đang giữ Checkout; không thấy merge. |
| ICV-27-02 | `TARGET-RUNTIME FACT` | Target từ chối Check-in từ Version cục bộ cũ sau khi server đã có Version mới; công việc cục bộ phải được xử lý lại có chủ ý. |

Hai dòng target được trích từ [icVault observed behavior, TH21–TH22](../product/knowledge/icvault-observed-behavior.md). Chúng chỉ chứng minh hành vi của deployment đã nhận diện, **không được đổi nhãn thành sự thật về DDM**.

### 4.2 Đối chiếu Aras

- Office Connector `View Mode` mở Document ở trạng thái unclaimed để đọc, copy hoặc dùng Save As. `Edit Mode` mới claim Document. Nếu người khác đã sửa Document trong lúc bản View còn mở, connector không cho claim vì file cục bộ đã outdated. Đây là mẫu kiểm soát stale rõ ràng, nhưng không phải primitive mang tên Reference. [View and Edit Options](https://docs.aras.com/office-connector-oc27/view-and-edit-options/0000019e-86f9-d30e-abff-8fff903f0000)
- Khi file cùng tên đã có trong working directory, connector phân biệt file cục bộ bằng/già hơn/mới hơn bản Aras và đưa lựa chọn có chủ ý: ghi bản Aras đè bản cục bộ, giữ file hiện tại, lấy file Aras hoặc hủy. [Local File Checks](https://docs.aras.com/office-connector-oc27/local-file-checks/0000019e-86f8-d30e-abff-8fffa6a70000)
- Khi mất kết nối, người dùng có thể tiếp tục lưu file cục bộ bằng lệnh Save của Office; sau khi kết nối lại mới Refresh hoặc Save to Aras. Tài liệu không nói thao tác này tự giải quyết mọi conflict. [Offline Use](https://docs.aras.com/office-connector-oc27/offline-use/0000019e-86f9-d30e-abff-8fff4a780000)
- Bản version cũ được mở ở thư mục riêng, chỉ đọc và không thể claim hoặc lưu ngược vào Aras. [Opening Old Versions](https://docs.aras.com/office-connector-oc27/opening-old-versions/0000019e-86fa-d30e-abff-8fffbae20000)
- `Save As to Aras` biến file đang được quản lý thành **một file mới cũng được quản lý**, vì vậy đây là đường tạo bản/tài liệu mới chứ không phải quyền cập nhật bản gốc. [Save As to Aras](https://docs.aras.com/office-connector-oc27/save-as-to-aras/0000019e-86fa-d30e-abff-8fff14250000)

Aras TDF có một cơ chế khác, chỉ dành cho referenced Technical Document content: quản trị viên có thể bật Explicit hoặc Implicit Edit; Implicit Save lock–update–unlock nội dung con, theo dõi modification timestamp và khi stale có thể đưa lựa chọn overwrite/discard/cancel. Đây là `VENDOR-PUBLIC` nhưng **không tương đương Reference của file CAD/Office nói chung** và không được dùng để suy diễn cơ chế Vault. [Creating Content — Editing Referenced Content](https://docs.aras.com/aras-innovator-platform-33/creating-content/0000019f-1799-dcff-a7bf-5f99d8420000)

## 5. Q28 — Check-in nhiều tài liệu: atomicity, lỗi, retry và giữ việc cục bộ

### 5.1 DDM thiết lập được điều gì

- Tutorial chính thức [IRONCAD — Creating Parts, Assemblies and Drawings](https://www.youtube.com/watch?v=QXWKsTQcaCg&t=85s) thể hiện Store/Load và các thao tác với cấu trúc/file. Đây là `VENDOR-PUBLIC` cho luồng nhìn thấy.
- Nguồn công khai được tổng hợp trong [DDM vendor-public baseline, VP-04](../product/knowledge/ddm-vendor-public-baseline.md) **không thiết lập** Check-in cardinality, ranh giới transaction database/file, all-or-none, staging, checksum, retry, idempotency, orphan cleanup, lock disposition sau lỗi hoặc bảo toàn workspace. Tất cả các điểm này là `UNKNOWN` đối với DDM từ nguồn công khai.

### 5.2 Aras thiết lập được điều gì

| Chủ đề | `VENDOR-PUBLIC` xác nhận | Giới hạn bằng chứng |
| --- | --- | --- |
| Gửi nhiều Item/file | CheckInManager nhận cấu trúc lớn có File Items, nhận một Item hoặc nhiều Item trong một AML, và có callback `UploadFilesCompleted`/`CheckinCompleted`; callback upload ném exception khi gặp lỗi. [Using CheckinManager](https://docs.aras.com/aras-innovator-platform-33/using-checkinmanager/0000019f-179d-dcff-a7bf-5f9d2f7c0000) | Việc nhận collection và trả list kết quả không tự chứng minh toàn bộ collection all-or-none. |
| Transaction thay đổi dữ liệu | OData Change Set được định nghĩa là atomic unit; request được xử lý tuần tự và nếu một request lỗi thì toàn bộ request trong Change Set rollback. [Aras Innovator OData Interface — Change Sets](https://docs.aras.com/aras-innovator-platform-33/aras-innovator-odata-interface/0000019f-179d-dcff-a7bf-5f9de2b60000) | Chứng minh phạm vi Change Set, không tự chứng minh file bytes ở Vault và mọi metadata ngoài Change Set cùng commit nguyên tử. |
| Upload file | Vault OData có BeginTransaction trả transaction ID; upload theo chunk có Content-Range và checksum; CommitTransaction hoàn tất upload, gửi biểu diễn Item, rồi Vault commit sau khi Innovator trả thành công. [Vault OData interface](https://docs.aras.com/aras-innovator-platform-29/vault-odata-interface/0000019f-d665-d08f-a1df-df65a49e0000) | Cho thấy protocol phối hợp một upload transaction; không công bố đầy đủ mọi crash window, retry/replay, expiry của transaction hoặc quy tắc dọn staging. |
| Tính bất biến của file | Aras nói File là immutable và phải dùng CheckInManager để thêm file/content; OData Item interface không hỗ trợ update File Item. [API Guide](https://docs.aras.com/aras-innovator-platform-33/api-guide/0000019f-179c-dcff-a7bf-5f9dc08a0000), [OData File operations](https://docs.aras.com/aras-innovator-platform-33/aras-innovator-odata-interface/0000019f-179d-dcff-a7bf-5f9de2b60000) | Không nói một batch nghiệp vụ của IDEA phải dùng đúng mô hình nội bộ Aras. |
| Rollback ở server | Built-in `update` yêu cầu Item đã lock; `edit` thực hiện lock–update–unlock; `version` tạo generation mới. Nếu OnAfter server event trả lỗi, server rollback transaction. [Methods](https://docs.aras.com/methods/0000019f-1798-dcff-a7bf-5f99e57a0000) | Đây là transaction của request/server action được mô tả, không phải lời hứa end-to-end cho client, Vault và nhiều Document. |
| Giữ file cục bộ | Office Connector cho lưu cục bộ khi offline và có các lựa chọn trước khi ghi đè file local. [Offline Use](https://docs.aras.com/office-connector-oc27/offline-use/0000019e-86f9-d30e-abff-8fff4a780000), [Local File Checks](https://docs.aras.com/office-connector-oc27/local-file-checks/0000019e-86f8-d30e-abff-8fffa6a70000) | Đây là hành vi Office Connector, không chứng minh mọi CAD connector hoặc CheckInManager client đều bảo toàn local work như nhau. |

### 5.3 Những gì vẫn là `UNKNOWN` đối với Aras

- Một CheckInManager call chứa nhiều Document có đảm bảo all-or-none xuyên **tất cả** metadata, generation, relationship và file bytes hay không.
- Retry cùng transaction ID có idempotent hay có thể tạo File/Version trùng.
- Server trả timeout sau commit thì client dùng operation ID nào để hỏi lại kết quả.
- Staged upload bị lỗi được giữ bao lâu, dọn ra sao, và orphan được đối soát thế nào trong chính luồng Check-in.
- Claim/lock của từng Item được giữ hay giải phóng sau từng loại lỗi upload, validation, database hoặc network.
- Tất cả connector CAD/Office có cùng hợp đồng bảo toàn file local và conflict recovery hay không.

Tài liệu về retry của **Vault replication** không phải bằng chứng cho retry của Check-in người dùng; hai luồng không được nhập làm một.

## 6. Bảng đối chiếu dùng để chốt Q26–Q28

| Vấn đề | DDM từ nguồn công khai | Aras từ nguồn chính thức | Giới hạn phải giữ | Hướng phù hợp cho IDEA |
| --- | --- | --- | --- | --- |
| Một người giữ quyền sửa | Có bề mặt Reserve | Claim chỉ cho một người sửa | Protocol nội bộ khác nhau/không công khai đầy đủ | Giữ Reservation theo document + actor + workspace đã chốt |
| Hết hạn | `UNKNOWN` | Không thấy TTL mặc định; claim có thể tồn tại qua session | Không được suy ra một con số | Dùng lease IDEA đã chốt; thời hạn cấu hình, có renewal và grace |
| Check-in thành công | `UNKNOWN` về release protocol | Save and Close lưu rồi unclaim; Save thường vẫn claim | Aras có hai lệnh, IDEA đã chọn nghĩa Check-in riêng | Check-in thành công phải kết thúc quyền giữ trong scope xác nhận |
| Logout/mất mạng | `UNKNOWN` | Offline local Save được; không thiết lập auto-unclaim | Mất kết nối không chứng minh bỏ việc | Không giải phóng ngay; lease hết hạn theo server, local work không bị xóa |
| Admin recovery | `UNKNOWN` | Public docs đã xem chưa đủ | Không đoán force-unlock policy | Recovery có quyền riêng, lý do, audit, cảnh báo và kiểm tra stale |
| Reference bị sửa local | `UNKNOWN` | View copy có thể thành outdated; local file có keep/get/cancel | Aras View không phải DDM Reference | Cho phép giữ file local nhưng không publish vào bản gốc khi chưa Checkout |
| Đưa thay đổi Reference lên server | `UNKNOWN` | Có Claim nếu còn current; Save As tạo file mới; TDF có cơ chế riêng | Không dùng TDF overwrite làm quy tắc CAD/Office | Convert to working copy khi acquire lease + generation còn khớp; nếu stale thì xử lý thủ công |
| Check-in nhiều tài liệu | `UNKNOWN` | CheckInManager nhận collection; OData Change Set có rollback | Chưa chứng minh end-to-end cross-store | Một Check-in scope có kết quả logic all-or-none |
| Retry | `UNKNOWN` | Có upload transaction/callback nhưng safe replay chưa công bố | Replication retry không phải Check-in retry | Operation ID/idempotency key và API hỏi trạng thái |
| Lỗi giữa chừng | `UNKNOWN` | Có rollback trong phạm vi được mô tả | Chưa rõ mọi crash window | Không đổi Working Head, không release Reservation; giữ local và candidate để retry/reconcile |

## 7. Đề xuất chi tiết cho IDEA

Phần này là **đề xuất thiết kế có giới hạn**, không phải bằng chứng về nhà cung cấp. Hai quyết định nền đã được chấp nhận là [ADR 0006 — Reservation + optimistic concurrency](../adr/0006-bind-reservations-to-document-and-workspace.md) và [ADR 0005 — immutable Generations + atomic Check-in Change Sets](../adr/0005-use-immutable-generations-and-atomic-change-sets.md).

### 7.1 Đề xuất chốt Q26 — vòng đời Reservation

1. Reservation có các trạng thái server-side tối thiểu: `Active`, `Expired`, `Released`, `Recovered`.
2. `Active` được gia hạn bởi client còn làm việc. Thời hạn, chu kỳ renewal và grace period là cấu hình vận hành; không lấy một con số tưởng tượng từ DDM/Aras.
3. Check-in thành công và Cancel Checkout chủ động phải chuyển Reservation sang `Released` ngay.
4. Logout, đóng ứng dụng hoặc mất mạng **không** tự giải phóng ngay; client có thể còn công việc chưa gửi. Server chỉ thay đổi quyền theo lease.
5. `Expired` không còn cho phép publish. Nó không xóa, đổi tên hoặc ghi đè file trong workspace người dùng.
6. Nếu người giữ cũ quay lại:
   - current Generation chưa đổi và chưa có người giữ mới: cho phép xin Reservation mới rồi tiếp tục;
   - Generation đã đổi hoặc có người giữ mới: đưa vào luồng stale conflict, giữ file cục bộ và yêu cầu người dùng xử lý.
7. `Recovered` chỉ do quyền quản trị phù hợp thực hiện; bắt buộc ghi lý do, người thực hiện, thời gian, Reservation cũ và Generation liên quan. Recovery không được tự publish công việc của người giữ cũ.

### 7.2 Đề xuất chốt Q27 — Reference và file cục bộ đã sửa

1. Reference là bản dùng để đọc/tham chiếu; không trao quyền publish vào Logical Document gốc.
2. IDEA không cố ngăn ứng dụng CAD/Office ghi vào file bằng OS lock. Nếu checksum khác bản đã tải, UI ghi rõ **“Đã thay đổi trên máy”**, không dùng từ “Dirty”.
3. Check-in trực tiếp từ Reference vào bản gốc phải bị từ chối.
4. Người dùng có bốn đường rõ ràng:
   - **Lấy bản mới nhất**: tải current Generation; trước khi ghi đè phải cho giữ bản cục bộ thành bản sao an toàn;
   - **Chuyển thành bản làm việc**: server cấp Reservation và chỉ chấp nhận nếu expected Generation vẫn là bản Reference đã mở;
   - **Lưu thành tài liệu mới**: tạo Logical Document mới khi người dùng chủ ý tách nhánh;
   - **Bỏ thay đổi cục bộ**: chỉ sau xác nhận rõ ràng.
5. Nếu expected Generation đã cũ, không tự merge hoặc tự overwrite. UI giữ file cục bộ, tải bản mới vào vị trí riêng và hướng dẫn “áp dụng lại thay đổi” có chủ ý.

### 7.3 Đề xuất chốt Q28 — Check-in nhiều tài liệu

1. Client tạo một `CheckinOperationId` duy nhất và khai báo chính xác scope: document, expected Generation, Reservation, workspace và file digest.
2. Server preflight toàn bộ scope trước khi publish: quyền, owner/workspace, lease, expected Generation, dependency bắt buộc, tên/loại file, digest và dung lượng.
3. File mới được upload thành immutable candidate, theo chunk có checksum. Candidate chưa được xem là Generation đã publish.
4. Chỉ khi toàn bộ candidate hợp lệ, server commit một database transaction gồm: Generation mới, manifest/file references, Working Head, relationship/evidence cần thiết, audit/outbox và việc release Reservation của đúng scope.
5. Kết quả nghiệp vụ là **tất cả hoặc không tài liệu nào**. Nếu transaction lỗi, không Working Head nào đổi và không Reservation nào bị release.
6. File candidate không được tham chiếu sau lỗi có thể giữ tạm để retry hoặc đưa vào reconciliation; nó không được xuất hiện như một Version hợp lệ đối với người dùng.
7. Retry dùng lại `CheckinOperationId`. Server phải trả lại kết quả cũ nếu operation đã commit, tiếp tục phần upload còn thiếu nếu còn an toàn, hoặc trả conflict nếu input khác. Không tạo Version/Generation trùng.
8. Khi client bị timeout, client hỏi trạng thái operation trước khi gửi lại. Các trạng thái tối thiểu: `Preparing`, `Uploading`, `ReadyToCommit`, `Committed`, `Failed`, `NeedsReconciliation`.
9. File trong workspace chỉ được đề nghị dọn sau khi client xác nhận `Committed`; mọi lỗi phải giữ nguyên file cục bộ và hiển thị lỗi theo từng tài liệu.

Đây là **atomicity logic của hồ sơ**. Không cần giả vờ rằng database và filesystem có một ACID transaction vật lý chung; thay vào đó dùng immutable blobs, một transaction cho trạng thái có thẩm quyền, idempotency và reconciliation để không bao giờ lộ một hồ sơ thành công dở dang.

## 8. Tiêu chí để coi Q26–Q28 đã đủ rõ cho Spec

Q26–Q28 có thể đóng ở mức đặc tả khi Spec ghi rõ và kiểm thử được các điểm sau:

- thao tác nào tạo, gia hạn, release, expire và recover Reservation;
- Check-in thành công giải phóng đúng scope; mọi lỗi trước commit không giải phóng;
- logout/mất mạng không xóa local work;
- Reference không có quyền publish bản gốc;
- chuyển Reference thành bản làm việc phải kiểm tra expected Generation;
- stale conflict không tự overwrite/merge;
- Check-in nhiều tài liệu có một operation ID và một kết quả all-or-none;
- retry sau timeout không tạo Generation trùng;
- candidate/orphan có trạng thái và quy trình reconciliation;
- audit ghi được ai làm gì, với scope và Generation nào.

Con số TTL/renewal/grace có thể là cấu hình vận hành riêng, nhưng hành vi trước, trong và sau khi hết lease phải có acceptance criteria. Nếu chưa có các criteria trên thì chưa nên coi phần Check-in/Checkout là “copy DDM xong”.

## 9. Kiểm tra Aras cục bộ sau khi server được mở lại

### 9.1 Audit chỉ đọc ban đầu

Audit ban đầu dùng target nội bộ đã được ghi nhận là Aras Innovator `14.35.0.44037`, database
`InnovatorSolutions`. Không ghi địa chỉ nội bộ, token hoặc thông tin đăng nhập vào tài liệu. Tất cả
request trong audit này là truy vấn `get`; không Claim, Unclaim, sửa Item hoặc Check-in file.

| ID | Lớp bằng chứng | Quan sát ngày 2026-09-10 | Giới hạn |
| --- | --- | --- | --- |
| `ARAS-LOCAL-01` | `TARGET-RUNTIME FACT` | OAuth đăng nhập thành công và SOAP `ApplyItem` đọc được đúng database đã nhận diện. | Xác nhận target đang phục vụ truy vấn tại thời điểm kiểm tra; không phải kiểm thử sẵn sàng vận hành. |
| `ARAS-LOCAL-02` | `TARGET-RUNTIME FACT` | Truy vấn hiện trạng trả 6 CAD current có `locked_by_id`, cùng một lock owner; `modified_on` của các dòng nằm từ 2026-07-01 đến 2026-07-15. Document, Part, Project và Project Package không có dòng locked trong mẫu truy vấn này. | Chứng minh lock record tồn tại phía server ở target hiện tại. Timestamp của Item không tự chứng minh thời điểm Claim, TTL hoặc lý do lock còn lại. |
| `ARAS-LOCAL-03` | `TARGET-STATIC FACT` | Schema đọc trực tiếp của CAD, Document, Part, Project và Project Package đều có `locked_by_id` và `not_lockable`; không có tên property khớp lease, expiry, heartbeat hoặc session trong năm Item Type này. | Không chứng minh toàn hệ thống không có timeout/recovery ở Method, service, policy hoặc bảng khác. |
| `ARAS-LOCAL-04` | `TARGET-STATIC FACT` | Snapshot chỉ đọc ngày 2026-06-24 có SHA-256 `71954844A994A63482F2C356303DC3BEFAFAFC23A0BEC6D77FBB17E23D8314B0`; snapshot ghi 493 Item Types, 294 Relationship Types, 12.000 Properties, 1.379 Methods, 207 Lists, 36 Lifecycle Maps và 11 Workflow Maps. | Snapshot là bản xuất tĩnh của đúng cấu hình khi thu thập; không thay thế truy vấn hiện tại hoặc kiểm thử hành vi. |

Audit chỉ đọc củng cố một nhận định hẹp: target Aras này dùng lock/claim được lưu trên server và không
biểu diễn lease ngay trên các Item Type đã kiểm tra. Nó **không** thay đổi quyết định IDEA dùng
Reservation lease, vì quyết định IDEA còn nhằm xử lý client crash, người dùng mất mạng và công việc
cục bộ.

### 9.2 Thí nghiệm mutation có kiểm soát

Sau audit ban đầu, người dùng cho phép kiểm tra runtime sâu hơn. Thí nghiệm chỉ dùng một CAD/File test
có tiền tố `ZZ-IDEA-RUNTIME-CICO`, không sửa các CAD nghiệp vụ/demo sẵn có. Ma trận request, digest,
Method hash, giới hạn và trạng thái dọn sau thử nghiệm nằm trong
[Kiểm chứng runtime Aras cho Checkout, Check-in và Reference](2026-09-10-aras-runtime-workspace-experiment.md).

Các phát hiện chính là `TARGET-RUNTIME FACT` cho đúng target và tài khoản đã thử:

- lock tồn tại xuyên hai token của cùng user, nhưng token thứ hai cũng có thể update/unlock lock của
  token thứ nhất; primitive này không gắn quyền sửa với workspace;
- native `version` tạo Generation mới, nhưng tài khoản admin vẫn lock/update được Generation lịch sử
  khi gọi thẳng bằng ID cũ;
- custom `idea_CommitCadCheckin` kiểm tra lock owner và unlock sau thành công, nhưng không kiểm tra
  current head/expected Generation và đã chấp nhận Check-in vào một Generation lịch sử;
- Check-in lại cùng File không tạo Generation mới, nhưng vẫn đổi `modified_on` và không trả một kết
  quả No Change có ngữ nghĩa;
- File tải không lock khớp digest fixture; connector read-only không tạo Reference manifest; và
- connector nghiên cứu buffer toàn bộ file khi upload/download, nên không phù hợp file nhiều GB.

Sau thử nghiệm, cả bốn Generation của CAD test đều unlocked; Generation 4 là current. Đây là benchmark
và phản ví dụ thiết kế, **không** phải kết quả VVP hoặc bằng chứng IDEA đã được triển khai.

## 10. Giới hạn và câu hỏi cần kiểm chứng sau

1. Nếu cần tuyên bố parity chính xác với DDM, phải chạy target audit hai người dùng theo [DDM target audit plan](../product/knowledge/ddm-target-audit-plan.md), đặc biệt cho expire/disconnect/crash/admin recovery, Reference bị sửa và Check-in nhiều tài liệu.
2. Nếu chọn một connector Aras cụ thể làm benchmark, phải khóa rõ application/release (Office Connector, CAD connector, TDF hay core Platform); hành vi của một connector không tự áp dụng cho connector khác.
3. Cần fault-injection trên IDEA tại các ranh giới: upload chunk, hoàn tất candidate, trước/sau database commit, gửi response, release Reservation và outbox delivery.
4. Cần thử lại cùng operation ID sau timeout để chứng minh không tạo Generation trùng và không lộ hồ sơ thành công dở dang.
5. Runtime Aras còn cần một identity không phải admin để kiểm tra cạnh tranh hai người dùng, quyền trên
   Generation lịch sử và recovery. Remote server chỉ cần ở vòng có restart/fault-injection và log
   Vault/IIS; các kiểm tra đó hiện là `NOT-RUN`.

## 11. Nguồn chính

### DDM và bằng chứng repository

- [DDM vendor-public baseline](../product/knowledge/ddm-vendor-public-baseline.md) — `VENDOR-PUBLIC` đã tiếp nhận và danh sách `UNKNOWN`.
- [DDM Office — Working with Folders](https://www.youtube.com/watch?v=rlH1fXReZ9Q&t=305s) — kênh DesignDataManager.
- [DDM 2016.08 Reserve To / Reference To enhancements](https://www.designdatamanager.com/2016/09/08/ddm-2016-08-whats-new-reserve-to-reference-to-enhancements/) — CSI/DesignDataManager.
- [DDM IRONCAD tutorial](https://www.youtube.com/watch?v=QXWKsTQcaCg&t=85s) — kênh DesignDataManager.
- [icVault observed behavior](../product/knowledge/icvault-observed-behavior.md) — `TARGET-RUNTIME FACT`, không phải DDM vendor fact.

### Aras

- [Aras PE 14 / Innovator 32 — Item View](https://www.aras.com/community/documentationlibrary/Innovator/32/Content/Innovator%2024%20Docs/Aras%20PE%2014%20-%20User's%20Guide/Item%20View.htm)
- [Aras Office Connector 27 — Document Claiming and Unclaiming](https://docs.aras.com/office-connector-oc27/document-claiming-and-unclaiming/0000019e-86f8-d30e-abff-8fff51920000)
- [Aras Office Connector 27 — View and Edit Options](https://docs.aras.com/office-connector-oc27/view-and-edit-options/0000019e-86f9-d30e-abff-8fff903f0000)
- [Aras Office Connector 27 — Local File Checks](https://docs.aras.com/office-connector-oc27/local-file-checks/0000019e-86f8-d30e-abff-8fffa6a70000)
- [Aras Office Connector 27 — Offline Use](https://docs.aras.com/office-connector-oc27/offline-use/0000019e-86f9-d30e-abff-8fff4a780000)
- [Aras Innovator Platform 33 — Methods](https://docs.aras.com/methods/0000019f-1798-dcff-a7bf-5f99e57a0000)
- [Aras Innovator Platform 33 — Using CheckinManager](https://docs.aras.com/aras-innovator-platform-33/using-checkinmanager/0000019f-179d-dcff-a7bf-5f9d2f7c0000)
- [Aras Innovator Platform 33 — OData Interface](https://docs.aras.com/aras-innovator-platform-33/aras-innovator-odata-interface/0000019f-179d-dcff-a7bf-5f9de2b60000)
- [Aras Innovator Platform 29 — Vault OData interface](https://docs.aras.com/aras-innovator-platform-29/vault-odata-interface/0000019f-d665-d08f-a1df-df65a49e0000)
- [Aras Innovator Platform 33 — TDF Creating Content](https://docs.aras.com/aras-innovator-platform-33/creating-content/0000019f-1799-dcff-a7bf-5f99d8420000)
