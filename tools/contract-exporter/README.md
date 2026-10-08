# IDEA DDM Core v0 — Công cụ xuất đặc tả giao tiếp API (SPEC-API-001)

Công cụ trích xuất, đối soát và biên dịch hồ sơ đặc tả giao tiếp API của hệ thống **IDEA DDM Core v0** ra 3 định dạng tài liệu kỹ thuật:

1. **Tài liệu Word (`.docx`)**: Hồ sơ kỹ thuật chuẩn theo format quy định của công ty (`SPEC-001`). Gồm khối metadata người phụ trách, logo tỷ lệ chuẩn, phạm vi kiến trúc, lịch sử phiên bản, 3 sơ đồ luồng phối hợp (Call flows), ma trận tổng hợp và đặc tả chi tiết 14 endpoints (Route, Context, Headers, Data Dictionary, Request/Response Payload, Error Matrix).
2. **Bảng tính Excel (`.xlsx`)**: Sổ tay kỹ thuật 4 sheets phục vụ quản lý và thiết kế Test Matrix:
   - `1. Thong tin & Lich su`: Thông tin dự án, quy mô và nhật ký thay đổi phiên bản.
   - `2. Ma tran API`: Danh mục 14 endpoints đầy đủ thuộc tính, có bộ lọc và cố định dòng tiêu đề.
   - `3. Data Dictionary`: Từ điển tham số 10 cột chi tiết (mỗi dòng là một trường dữ liệu) cho QA/Dev.
   - `4. Error Catalog`: Danh mục mã lỗi hệ thống và hướng dẫn xử lý / quy tắc Retry.
3. **Tài liệu HTML (`.html`)**: Trang tra cứu tương tác offline (Zero-CDN, không phụ thuộc Internet):
   - Thiết kế tinh gọn theo chuẩn GitHub Docs / Stripe Docs (không dùng giao diện dashboard màu mè).
   - Tìm kiếm thời gian thực theo mã API, đường dẫn URL, tên trường.
   - Chuyển đổi giao diện Sáng / Tối dịu mắt.
   - Nút sao chép JSON Payload trực tiếp vào bộ nhớ tạm.

---

## Hướng dẫn sử dụng trên máy cục bộ

### 1. Xuất bộ 3 tài liệu
```powershell
node tools/contract-exporter/export.mjs
```
*(Hoặc `npm run export` trong thư mục `tools/contract-exporter`)*

### 2. Cập nhật và đồng bộ đối soát với mã nguồn
Khi có cập nhật tài liệu kỹ thuật hoặc route mới trong repository:
```powershell
node tools/contract-exporter/export.mjs --update
```
*(Hoặc `npm run update`)*
Lệnh này sẽ quét lại `docs/` và `openapi.json`, thực hiện Smart Merge vào `data/api-catalog.json`, tự động ghi nhận phiên bản mới vào lịch sử sửa đổi và xuất ra tài liệu mới.

### 3. Xuất và tự động mở trình duyệt xem file HTML
```powershell
node tools/contract-exporter/export.mjs --open
```

---

## Thư mục kết quả (Output)

Tài liệu được lưu tại thư mục: `tools/contract-exporter/output/`
- `IDEA_Core_v0_API_Contract.docx` (~88 KB)
- `IDEA_Core_v0_API_Contract.xlsx` (~21 KB)
- `IDEA_Core_v0_API_Contract.html` (~63 KB)

---

## Cơ chế lưu trữ và quản lý phiên bản
- File dữ liệu trung tâm: `tools/contract-exporter/data/api-catalog.json` được theo dõi lịch sử qua Git.
- Nhánh làm việc: `feat/api-contract-exporter`. Có thể rollback về nhánh `main` bất cứ lúc nào với lệnh: `git checkout main`.
