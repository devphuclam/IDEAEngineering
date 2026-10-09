# API contract exporter

Nguồn HTTP có kiểm soát → catalog GENERATED → Word / Excel / HTML.
Không còn “Smart Merge” tự đoán API.

Giữ bộ 3 tài liệu và bố cục của tool trên `main`: không thêm định dạng hay thiết kế lại.
Bảng dữ liệu chỉ liệt kê tham số, trường request/response chính và kiểu model lồng nhau;
không bung cả cây schema hoặc lặp schema lỗi. Ràng buộc và ma trận lỗi vẫn giữ.
Schema đầy đủ ở OpenAPI nguồn; mục DESIGN chỉ là chỉ mục ngắn đến thẻ thiết kế gốc.

## Chạy từ root repository

~~~powershell
node .\tools\contract-exporter\export.mjs --check
node --test .\tools\contract-exporter\contract.test.mjs
node .\tools\contract-exporter\export.mjs --update --open
node .\tools\contract-exporter\export.mjs --check
~~~

Nếu đang ở **tools/contract-exporter**, dùng đường dẫn ngắn:

~~~powershell
npm run check
npm test
npm run update
~~~

**Không lặp lại tools/contract-exporter trong đường dẫn khi đang ở chính thư mục đó.**

Check/test chỉ dùng Node built-ins, không tải package, không cần Server/PostgreSQL. Lượt execution
đã ghi nhận dùng Node 24.19.0 được project chấp nhận. Nếu PATH là Node khác, dùng binary đã admit,
không tự install/upgrade. Trên workstation hiện tại:

~~~powershell
& 'C:\Users\TD-999\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' .\tools\contract-exporter\export.mjs --check
~~~

Expected baseline Issue #53:

~~~text
API CONTRACT CHECK = PASS; routes=46; operations=46
~~~

44 Server operations (42 product + 2 health), 2 Gateway operations; 9 CPD cards vẫn DESIGN/UNKNOWN.
Catalog = 55 mục. Số lượng được thay đổi khi API thật đổi; PASS này **không phải runtime/security PASS**.

## Kết quả và version

Output tại tools/contract-exporter/output/:

- IDEA_Core_v0_API_Contract.docx
- IDEA_Core_v0_API_Contract.xlsx
- IDEA_Core_v0_API_Contract.html

--open mở browser mặc định Windows; có thể mở HTML thủ công. Rendering dùng docx/exceljs đã có
trong lockfile, không thay graph và không tự cài khi thiếu. Thiếu cache vẫn chạy được check/test
hoặc --update --data-only. Rendering thiếu dependency báo lỗi, không giả vờ xuất thành công.

Version/date/status là metadata trong contract-config.json, không tự tăng vì bấm update.
Repeat cùng nội dung giữ archive cũ. Output/archive bị Git ignore; lịch sử predecessor giữ trong Git.

## Nguồn sửa và quy trình API change

| Nội dung | Nguồn |
|---|---|
| Server HTTP/schema | [openapi.json](../../apps/server/src/main/resources/dev-access/openapi.json) |
| Gateway binary/signed Grant | [gateway-openapi.json](../../docs/product/instances/idea-engineering/api/gateway-openapi.json) |
| Authority/state/atomicity/concurrency/retry/trace | x-idea-contract tại từng operation, dẫn semanticSource về owner contract |
| CPD DESIGN | [controlled-product-data.md](../../docs/product/instances/idea-engineering/api/controlled-product-data.md) |
| Source review/config | [contract-config.json](contract-config.json), [source-review.json](source-review.json) |
| Generated output data | data/api-catalog.json — không sửa trực tiếp |

1. Sửa API theo owner requirement/contract đã duyệt. Quyết định chưa có phải UNKNOWN, không invent.
2. Sửa canonical OpenAPI tương ứng: operationId, parameters, schema, responses và x-idea-contract.
3. Review controller/DTO/owner/security diff; thêm source mới vào reviewedSources khi cần. Sau review,
   cập nhật **từng** fingerprint bị đổi trong source-review.json. Lệnh dưới chỉ in hashes,
   **không tự chấp nhận**: node tools/contract-exporter/export.mjs --print-source-hashes.
   Không bulk-refresh để che lỗi; ghi lý do review trong PR.
4. Chạy application tests theo Work Item, rồi --update, --check và npm test.
5. Commit source + contract + generated catalog cùng PR, review semantic diff trước merge.
   Xem [change/versioning template](../../docs/product/instances/idea-engineering/api/handoff/template.md).

--check read-only, exit 0 khi đạt / exit 1 khi thiếu-lệch. --update cũng check source/OpenAPI
trước ghi, không dùng placeholder để một API mới “đủ contract”. Catalog stale sau contract hợp lệ
mới được regenerate.

Server session và Gateway Grant là hai authority/origin khác nhau. Test qualification routes
không thành product API. Dev documentation resources chỉ exclude bằng source + method + exact
path. Các Swagger adapter mới được mô tả nhưng giữ documentation-only, không mở thêm Try it out
cho mutation/credential operation.

Đầu mối bàn giao vẫn là [API Documentation](../../docs/product/instances/idea-engineering/api/handoff/README.md).

## Tự thử lỗi thật, không phá source

~~~powershell
node --test .\tools\contract-exporter\contract.test.mjs
~~~

31 tests tạo fixture repository tạm riêng, thử thiếu API,
đổi method/path variable/DTO, xóa route/parameter, ref/schema lỗi, thiếu authority và sửa catalog.
Expected các lỗi bị từ chối/exit 1, không ghi output; chính tests PASS khi guard bắt lỗi đúng.
Cleanup chỉ exact thư mục tạm đã tạo.

Rendering qualification riêng (cần cache hiện có):

~~~powershell
node --test .\tools\contract-exporter\render.test.mjs
~~~

Expected 2 PASS: đọc Word/Excel OOXML thật và mọi operation; chạy HTML script, tab 46 HTTP / 9
DESIGN; repeat archive; text escaping. Không đồng nghĩa actual-browser hoặc Word layout review.

## CI và required merge check

[Workflow](../../.github/workflows/api-contract.yml) chạy read-only check/test, không npm install.
Runner phải cung cấp đúng approved Node; thiếu/sai binary thì fail preflight, không tự download.

Workflow **không tạo branch protection**. Maintainer cần xác minh runner và đặt
API contract synchronization thành required check trên main để thật sự chặn merge.
Repository hiện chưa enforce check này; CI/rule activation không được suy từ local PASS.

## Giới hạn

- Scanner tĩnh: Spring literal mappings + hai login/logout adapters, không phải runtime
  registered-route introspection. Không tuyên bố bắt mọi framework/registration.
- Dynamic/composed/implicit mappings và registration mới chưa hỗ trợ fail-closed; cần adapter
  được test trước dùng. Pins bắt drift ở các owner liệt kê, không tự chứng minh semantic đúng.
- Schema/ref/parameter/metadata checks là bounded validation, không phải full OpenAPI conformance.
- DESIGN không có fabricated DTO. Không export secret value. Không deploy/DB/verifier/auto-merge.

[Verification and handoff](verification.md).
