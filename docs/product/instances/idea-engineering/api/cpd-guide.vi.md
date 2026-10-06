# PH2 — hiểu luồng New / Store Existing và đọc đúng lịch sử

`IE-API-CPD-GUIDE-VI-001`, v0.2, Draft, INFORMATIVE. Trường kiểm soát kế thừa
[contract CPD](controlled-product-data.md). Đây là hướng dẫn thiết kế, không phải chức năng
đã chạy. Bản v0.2 chờ Project Reviewer; không thay quyết định sản phẩm.

## 1. Một tài liệu có nhiều “tọa độ”

| Khái niệm | Ví dụ giả | Ý nghĩa |
|---|---|---|
| Logical Document / DocumentId | D2 | Identity giữ nguyên qua tên, vị trí và các lần thay đổi |
| Business Revision | R1, nhãn A | Mốc nghiệp vụ theo policy; không phải số lần Save |
| Version within Revision | 1, 2 | Thứ tự Generation trong cùng Revision |
| Generation | G1, G2 | Snapshot bất biến để đọc lại chính xác |
| Working Head | G2 tại lúc đọc | Generation nền hiện tại; không đồng nghĩa Released |
| Placement | L1 trong Folder F1 | Vị trí duyệt logic; không phải path Vault và không cấp quyền |

Tên file giống nhau, path giống nhau hoặc digest giống nhau đều không đủ kết luận “cùng tài liệu”.
Revision A Version 1 và Revision B Version 1 là hai tọa độ khác nhau. Không thêm một trường
Version Sequence có cùng nghĩa.

## 2. Store Existing — đưa file đang có vào quản lý

1. Người có quyền chọn file nguồn và Document Class. Hệ thống kiểm readability/profile,
   metadata, tên/path và digest; chỉ hiển thị duplicate candidate trong phạm vi được phép thấy.
2. Người dùng kiểm tra mapping, metadata bắt buộc và business number. Dữ liệu sai phải sửa;
   số cũ không tự trở thành DocumentId; dòng “đã duyệt” trong file không thành Approval.
3. Người dùng chọn rõ tạo identity mới, liên kết identity có sẵn hoặc hủy. Hệ thống không tự gộp.
   Ý nghĩa/payload cụ thể của “liên kết” còn phải chốt U01; không tự chọn một API link.
4. File nguồn vẫn nguyên vẹn. Truyền file thành công chỉ xác minh custody, chưa tạo Generation.
5. Khi first publish đủ quyền, policy, bytes và business gates, một commit tạo đúng baseline:
   Revision A / Version 1 / Generation G1 / Working Head G1 cùng evidence bắt buộc.
   Lỗi không để lộ một baseline thành công dở dang.

Đăng ký identity và first publish là hai mốc khác nhau. Source cho phép đăng ký Start chưa có
Generation; DOC-06 cũng mô tả đường registration/first publish kết hợp. API exposure cụ thể
còn U04, không được quyết bằng việc tự đặt hai endpoint hoặc tự upload rồi đánh dấu thành công.

## 3. New — bắt đầu một tài liệu mới

New dùng cùng mô hình identity, metadata/numbering, access và evidence như Store Existing.
Nếu chưa có nội dung công bố thì có thể có DocumentId nhưng chưa có Working Head.
Không tạo Generation rỗng để làm giao diện trông như đã có file.
First publish theo cùng quy tắc ở trên. Checkout/Check-in và Workspace là dependency được giữ,
không xây protocol mới trong bộ contract này.

## 4. Đọc đúng tài liệu, không đọc nhầm “latest”

- Chọn DocumentId để xem identity và head tại thời điểm truy vấn.
- Khi cần đọc bản lịch sử, chọn chính xác Revision/Version hoặc Generation và kiểm các pin
  thuộc cùng tài liệu. Thiếu pin không được âm thầm thay bằng latest.
- Ví dụ G1 là A/1, G2 là A/2, G3 là B/1. History vẫn giữ G1 sau khi head thành G3.
- Link lịch sử trỏ R1/G1 phải giữ R1/G1. Chuyển Folder không tạo Generation và không cấp quyền.
- Muốn lấy bytes, dùng custody theo đúng Artifact/digest của manifest; không lấy path vật lý
  làm identity. Không có quyền thì không lộ chi tiết hoặc tổng số tài liệu ngoài quyền.

## 5. Khi lỗi hoặc mất phản hồi

Metadata sai: sửa theo feedback. Preview cũ hoặc mất quyền: kiểm lại trước commit.
Truyền file gián đoạn: giữ verified progress theo policy; chưa coi là publish.
Mất phản hồi sau gửi command: chưa biết commit hay rollback, phải resolve cùng OperationId;
không đổi OperationId rồi tạo identity/Generation mới cho “chắc”.

URL tra trạng thái, mã HTTP/error body, payload và paging chưa được chốt. Bảng U01–U09 trong
contract ghi owner và thời điểm cần giải quyết. Đây là thiếu quyết định wire, không phải quyền
cho AI sáng tác API.

## 6. Bản này bàn giao được gì?

Dev/QA có chín operation card và trace để bàn luận, viết kế hoạch kiểm chứng và chốt wire.
[JSON tổng hợp](cpd-examples.json) chỉ minh họa semantic; không copy thành DTO sản phẩm.
[OpenAPI 3.0.3](cpd-openapi.json) chưa có CPD paths vì chưa đủ quyết định.
Không có route CPD IMPLEMENTED được tuyên bố, không chạy runtime test/verifier.
Xem [đầu mối bàn giao](handoff/README.md); khi giao thật phải pin phiên bản, người nhận,
môi trường và phạm vi được duyệt.
