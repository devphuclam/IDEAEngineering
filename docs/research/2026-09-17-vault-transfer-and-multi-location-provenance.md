# Nguồn gốc mẫu truyền file lớn và Vault nhiều vị trí

| Trường kiểm soát | Giá trị |
|---|---|
| Stable Research ID | `IE-RES-VLT-XFER-20260917-001` |
| Document class / version / status | `ARCHITECTURE-RESEARCH` / `0.1` / `Draft` |
| Product normativity | `INFORMATIVE` — tài liệu này không tạo yêu cầu hoặc quyết định kiến trúc mới |
| Repository process authority / instruction state | `NOT-APPLICABLE` / `NOT-APPLICABLE` |
| Owner / author | Principal Product Author / IDEA Engineering research support |
| Reviewer / acceptance authority | Product Decision Authority; review và acceptance `NOT-RUN` |
| Applicable baseline | Câu hỏi về luồng Client–Backend–Vault và Vault nhiều vị trí, ngày 2026-09-17 |
| Evidence date | Truy cập nguồn ngày 2026-09-17 |
| Classification / retention | `INTERNAL`; giữ cùng hồ sơ nghiên cứu kiến trúc |
| Source / upstream trace | Tài liệu chính thức của Aras, AWS, Microsoft Azure và Google Cloud được dẫn trực tiếp bên dưới |
| Downstream trace | ADR-0013; `IE-CHG-VAULT-XFER-001`; product lifecycle architecture@0.4; DOC-04@0.14, DOC-05@0.21, DOC-06@0.17, DOC-08@0.13, VVP@0.17 and TECH-001@0.15 |
| Change record / predecessor | Bản đầu tiên; không có predecessor |
| Supersession / review trigger | Kiểm tra lại khi chọn công nghệ Vault, thay đổi topology hoặc thay đổi hợp đồng truyền file |
| Evidence status | `OFFICIAL-PRODUCT-FACT` và `IDEA-INFERENCE` được tách riêng; chưa phải kết quả benchmark |

Control tailoring theo `IE-STD-AUTH-001@0.2`: đây là ghi chú nghiên cứu ngắn. Tài liệu giữ nguồn,
release context, giới hạn bằng chứng và phép suy luận; không tự mở lại Feature, Spec hoặc Tech đã duyệt.

## 1. Trả lời ngắn

Phương án được đề xuất **không phải tự nghĩ hoàn toàn**, cũng không phải sao chép nguyên kiến trúc
của DDM. Nó tổng hợp ba nhóm mẫu đã được công bố chính thức:

1. **Aras Innovator:** tách Vault Server khỏi Application Server; upload trực tiếp vào Vault theo
   transaction và từng chunk; một file có thể nằm ở nhiều Vault; hệ thống chọn Vault đọc theo vị
   trí/ưu tiên và sao chép bằng replication rule.
2. **Object storage hiện đại:** Backend cấp quyền ghi có giới hạn cho đúng object và thời gian;
   Client dùng quyền đó để truyền dữ liệu trực tiếp tới storage thay vì để Backend chuyển tiếp byte.
3. **Giao thức truyền file lớn:** multipart/resumable upload, checksum, retry phần bị lỗi và truyền
   song song có giới hạn.

Tên `Artifact Gateway`, `Transfer Grant`, `ArtifactId` và quy tắc commit Generation là cách IDEA
diễn đạt và kết hợp các mẫu trên. Chúng **không phải tên thành phần được chứng minh là của Aras hay
DDM**.

## 2. Bản đồ nguồn gốc

| Thành phần trong đề xuất IDEA | Nguồn chính thức thiết lập điều gì | Phần IDEA suy luận hoặc phải tự thiết kế |
|---|---|---|
| Client không chuyển toàn bộ file qua Business Backend | Aras Platform 29 công bố Vault OData endpoint riêng: `BeginTransaction`, `UploadFile` vào Vault bằng `Content-Range` và checksum, rồi `CommitTransaction`; Vault chỉ commit sau khi Innovator trả kết quả thành công. [Aras Vault OData interface](https://docs.aras.com/aras-innovator-platform-29/vault-odata-interface/0000019f-d665-d08f-a1df-df65a49e0000) | Exact network topology, token format, timeout, idempotency và crash recovery của IDEA phải được đặc tả và kiểm thử riêng. |
| Quyền upload tạm thời, hẹp | AWS presigned URL cho phép upload đúng object mà bên gửi không cần AWS credentials và URL có thời hạn. [AWS — Uploading objects with presigned URLs](https://docs.aws.amazon.com/AmazonS3/latest/userguide/PresignedUrlUploadObject.html). Azure user-delegation SAS cho phép giới hạn resource, permission và expiry; Microsoft khuyến nghị loại ký bằng Microsoft Entra khi cần SAS. [Microsoft — Create a user delegation SAS](https://learn.microsoft.com/en-us/azure/storage/blobs/storage-blob-user-delegation-sas-create-cli) | `Transfer Grant` là abstraction trung lập nhà cung cấp của IDEA. Phải tự quy định binding với actor, OperationId, object key, kích thước, digest, thời hạn và khả năng thu hồi. |
| Upload theo phần, tiếp tục khi gián đoạn | Amazon S3 multipart upload cho phép upload part độc lập, song song, retry riêng part lỗi, pause/resume và kiểm tra checksum khi hoàn tất. [AWS — Multipart upload overview](https://docs.aws.amazon.com/AmazonS3/latest/userguide/mpuoverview.html). Google Cloud Storage resumable upload trả session URI và cho tiếp tục từ range đã nhận sau gián đoạn. [Google Cloud — Resumable uploads](https://docs.cloud.google.com/storage/docs/resumable-uploads) | Chunk size, số luồng, back-pressure, retry budget, journal cục bộ và chính sách dọn staging của IDEA chưa được các nguồn này quyết định. |
| Một file có nhiều vị trí Vault | Aras Release 37 nói một file có thể tồn tại trên nhiều Vault Server, Innovator theo dõi các Vault đang chứa file và chọn bản sao thích hợp; replication chạy bất đồng bộ. [Aras — Vault Replication overview](https://docs.aras.com/aras-innovator-release-37/overview-v-37) | IDEA cần mô hình `Artifact` logic và `ArtifactLocation` vật lý, trạng thái replica, reconciliation và chính sách khi replica chưa hoàn tất. Tên/mô hình dữ liệu này là của IDEA. |
| Chọn Vault phù hợp với người dùng | Aras Platform 33 dùng Default Vault và Read Priority; tài liệu nói cấu hình ưu tiên có thể dựa trên latency, bandwidth và server load. [Aras — Configuring a User's Preferred Vault](https://docs.aras.com/aras-innovator-platform-33/configuring-a-users-preferred-vault/0000019f-1799-dcff-a7bf-5f9966850001) | Thuật toán chọn Gateway/Vault khi upload, health check, capacity reservation và failover của IDEA vẫn cần quyết định riêng. |
| Sao chép sang một hoặc nhiều Vault | Aras cho phép replication rule copy file từ một Vault sang nhiều Vault đích, tạo replication transaction cho từng đích. [Aras — Creating Replication Rules](https://docs.aras.com/creating-replication-rules/0000019f-2751-d087-a79f-e77354e30000) | Số replica tối thiểu, lúc nào Check-in được trả thành công, khi nào Release bị chặn, RPO/RTO và repair policy là quyết định sản phẩm/vận hành của IDEA. |
| Storage tự quản lý redundancy nhiều nơi | Google Cloud mô tả regional, dual-region và multi-region storage; một object được lưu dư thừa, còn cross-region replication có thể bất đồng bộ. [Google Cloud — Data availability and durability](https://docs.cloud.google.com/storage/docs/availability-durability) | Nguồn này chứng minh một họ giải pháp, không chọn Google Cloud cho IDEA và không thay thế yêu cầu backup/restore. |

## 3. Aras thực sự làm được gì theo tài liệu đã kiểm tra

Các mệnh đề sau có bằng chứng trực tiếp, nhưng phải giữ đúng release context:

- **Platform 29:** Vault có OData upload transaction riêng. Client bắt đầu transaction, gửi chunk
  với `Content-Range` và checksum, rồi yêu cầu commit. Vault phối hợp với Innovator trước khi commit
  phía Vault. Nguồn không thiết lập đầy đủ mọi crash window hoặc safe replay.
- **Platform 33:** quản trị viên có thể cấu hình nhiều Vault; User có Default Vault và thứ tự ưu
  tiên Vault để đọc. Tài liệu nêu latency, bandwidth và server load là các yếu tố cấu hình.
- **Release 37:** một file có thể nằm trong nhiều Vault. Innovator theo dõi vị trí, chọn bản sao khi
  đọc và điều phối replication transaction bất đồng bộ.

Vì các tài liệu thuộc các release khác nhau, chúng chứng minh **họ mẫu kiến trúc của Aras**, không
chứng minh mọi release triển khai giống hệt nhau hoặc IDEA có thể sao chép nguyên giao thức nội bộ.

## 4. Điều không được gán cho DDM

Ghi chú này không dùng DDM làm nguồn cho direct-to-Vault upload, token tạm thời, resumable protocol
hoặc thuật toán chọn replica. Bộ bằng chứng DDM công khai hiện có trong repository chỉ đủ để ghi
nhận bề mặt Multi-Site/replication ở mức sản phẩm; nó không công bố đủ giao thức truyền, token,
consistency, retry, failover hoặc performance để nói “DDM làm đúng như sơ đồ IDEA”. Vì vậy:

- có thể nói phương án phù hợp với bài toán PDM/PLM nhiều Vault;
- có thể nói Aras cung cấp tiền lệ PLM trực tiếp cho nhiều phần;
- không được nói đây là kiến trúc nội bộ của DDM nếu chưa có bằng chứng runtime hoặc tài liệu hãng.

## 5. Kết luận thiết kế có giới hạn

Mẫu hợp lý để tiếp tục đánh giá là:

```text
Client ── lệnh, quyền, trạng thái ──► Business Backend
Client ── byte bằng grant tạm thời ──► Artifact Gateway / Vault được chọn
Vault/Gateway ── receipt + digest ──► Business Backend
Business Backend ── commit metadata ──► PostgreSQL
Vault nguồn ── replication bất đồng bộ ──► Vault khác
```

Đây là **IDEA architecture synthesis** dựa trên nguồn chính thức, chưa phải quyết định chọn AWS,
Azure, Google Cloud hoặc sao chép Aras. Trước khi trở thành baseline triển khai, tối thiểu cần chốt
transfer contract, threat model của grant, commit/reconciliation, replica policy, benchmark mạng và
backup/restore. Tất cả các kiểm chứng đó hiện là `NOT-RUN` nếu không có hồ sơ khác ghi kết quả.
