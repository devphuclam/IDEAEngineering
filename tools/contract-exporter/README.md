# Công cụ xuất API Contract

Giữ mẫu Word, Excel và HTML hiện tại; cập nhật dữ liệu từ contract nguồn.
Không tự tạo API, quyền hoặc DTO chưa được quyết định.

## Thao tác

Trong thư mục `tools/contract-exporter`:

~~~powershell
npm run update
npm run check
npm test
~~~

`update` đối soát nguồn, cập nhật catalog + OpenAPI phục vụ Swagger và xuất ba file.
`check` không ghi file; nguồn/catalog thiếu hoặc lệch trả exit code 1.
`test` kiểm tra cập nhật và nội dung file xuất trong fixture riêng.

Từ root repository:

~~~powershell
node tools/contract-exporter/export.mjs --update --open
node tools/contract-exporter/export.mjs --check
~~~

Không lặp đường dẫn tool khi đang đứng trong chính thư mục đó.
Lượt kiểm chứng dùng Node 24.19.0 được dự án chấp nhận, không dùng Node khác từ PATH.
Binary workstation: `C:/Users/TD-999/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe`.

## Đầu ra

Trong `output/`:

- `IDEA_Core_v0_API_Contract.docx`
- `IDEA_Core_v0_API_Contract.xlsx`
- `IDEA_Core_v0_API_Contract.html`

Snapshot ở `output/archive/`; cùng nội dung không tạo bản trùng.
Giữ metadata, người phụ trách, diễn giải tiếng Việt và lịch sử.
Không cho tên AI lọt vào nội dung hoặc metadata file xuất.
Bảng dữ liệu liệt kê trường trực tiếp và tên model lồng nhau; schema đầy đủ ở OpenAPI.
Retry ghi một lần cho mỗi thao tác, không lặp nguyên đoạn trong mọi dòng lỗi.

## Nguồn và cập nhật API

| Nội dung | Nguồn |
|---|---|
| Server HTTP/schema | [server-openapi.json](../../docs/product/instances/idea-engineering/api/server-openapi.json) |
| Gateway HTTP/schema | [gateway-openapi.json](../../docs/product/instances/idea-engineering/api/gateway-openapi.json) |
| Quyền/state/concurrency/retry | Contract ngữ nghĩa được từng operation dẫn về |
| CPD thiết kế | [controlled-product-data.md](../../docs/product/instances/idea-engineering/api/controlled-product-data.md) |
| Metadata, tên/nhóm/diễn giải, workflows | [api-catalog.json](data/api-catalog.json) |
| Nguồn và review | [contract-config.json](contract-config.json), [source-review.json](source-review.json) |
| Swagger phục vụ bởi Backend | [openapi.json](../../apps/server/src/main/resources/dev-access/openapi.json), được tạo từ hai nguồn trên |

1. Cập nhật code và contract/OpenAPI theo quyết định đã duyệt.
2. Review source/DTO/quyền/lỗi; cập nhật nguồn và từng fingerprint liên quan.
   `node export.mjs --print-source-hashes` chỉ in hash, không tự chấp nhận.
3. Chạy update, check và test; review/commit source + contract + catalog.
4. Không sửa Word/Excel/HTML bằng tay.

Swagger tại `https://localhost:18448/dev-api/` chia nhóm 46 thao tác hiện hữu,
hiển thị quyền/state/giao dịch/retry và schema từ cùng nguồn của tool xuất.
Gateway chỉ đọc tài liệu, không proxy bytes qua Server hoặc nhập Grant ở console.
API credential và các adapter đang documentation-only giữ khóa Try it out.
CPD DESIGN không được biến thành endpoint. Sau update cần cập nhật package Backend
và restart có kiểm soát; HMR Frontend không cập nhật OpenAPI trong JAR.

Thiếu contract, method/path lệch, schema/ref lỗi hoặc source chưa review phải được sửa
ở nguồn. Update dừng trước khi ghi, không tự đoán để che thiếu sót.
Wire chưa chốt giữ DESIGN/UNKNOWN, không dựng endpoint hoặc JSON giả.

## Giới hạn

46 HTTP operations: 44 Server, 2 Gateway; 9 CPD DESIGN; tổng 55 mục.
Grant/Receipt nội bộ và route qualification không thành API sản phẩm.
Scanner hỗ trợ cách đăng ký Spring hiện tại, không phải introspection mọi framework.
Validation OpenAPI có phạm vi giới hạn, không phải chứng nhận OpenAPI đầy đủ.
Check/update dữ liệu chỉ dùng Node built-ins; xuất Word/Excel dùng cache docx/exceljs
hiện có theo lockfile. Thiếu dependency báo lỗi, không tự install.
Không thay business API/session/CSRF, không migrate/seed hoặc thêm CI/branch protection.
Việc cập nhật package dev chỉ thay resource tài liệu, không thay class/runtime libraries.
