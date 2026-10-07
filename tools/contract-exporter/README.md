# IDEA Core v0 - API Contract Exporter

Bộ công cụ tự động trích xuất, đồng bộ và biên dịch đặc tả kỹ thuật API Contract của dự án **IDEA Engineering** ra bộ 3 định dạng tài liệu cao cấp:
1. **File Word (`.docx`)**: Báo cáo kỹ thuật chuẩn Enterprise (Trang bìa nhận diện thương hiệu IDEA, Lịch sử phiên bản Changelog, Tóm lược điều hành, 3 Sơ đồ tiến trình quy trình Call Flows, Ma trận tổng hợp, và Card UI 6 khối đặc tả chi tiết từng endpoint Request/Response/Data Dictionary/Mã lỗi).
2. **File Excel (`.xlsx`)**: Bảng tính 4 sheets chuyên nghiệp cho Quản trị & QA Test Cases:
   - `1. Executive & Changelog`: Dashboard chỉ số và Bảng lịch sử sửa đổi.
   - `2. API Master Matrix`: Danh mục 14+ endpoint chuẩn hóa, có bộ lọc (Filter) và mã màu trực quan.
   - `3. Data Dictionary`: Từ điển trường dữ liệu 10 cột chi tiết (mỗi dòng là một trường dữ liệu) phục vụ thiết kế test case.
   - `4. Error Catalog`: Danh mục mã lỗi hệ thống và hướng dẫn xử lý / quy tắc Retry.
3. **File HTML (`.html`)**: Trang tra cứu tương tác Offline 100% (Zero-CDN, không cần Internet):
   - Tìm kiếm thời gian thực (Live Search), lọc theo Module và Trạng thái.
   - Chuyển đổi giao diện Sáng / Tối (Dark / Light mode).
   - Nút Copy JSON Payload nhanh chóng vào Clipboard.
   - Trực quan hóa 3 sơ đồ luồng người dùng (Workflows).

---

## 🚀 Hướng dẫn sử dụng trên máy Local

### 1. Xuất bộ 3 tài liệu (Export)
```powershell
node tools/contract-exporter/export.mjs
```
*(Hoặc `npm run export` trong thư mục `tools/contract-exporter`)*

### 2. Cập nhật & Đồng bộ thông minh từ Git/Markdown (Update / Sync)
Khi có sự thay đổi về mã nguồn hoặc cập nhật tài liệu kỹ thuật trong repo:
```powershell
node tools/contract-exporter/export.mjs --update
```
*(Hoặc `npm run update`)*
Lệnh này sẽ quét lại `docs/` và `openapi.json`, thực hiện Smart Merge vào `data/api-catalog.json`, tự động ghi nhận vết thay đổi phiên bản (Changelog Audit Trail) và xuất ra bộ tài liệu mới nhất.

### 3. Xuất và tự động mở trình duyệt xem HTML
```powershell
node tools/contract-exporter/export.mjs --open
```

---

## 📂 Thư mục kết quả (Output)

Tài liệu được sinh tại thư mục:
`tools/contract-exporter/output/`
- `IDEA_Core_v0_API_Contract.docx` (~79 KB)
- `IDEA_Core_v0_API_Contract.xlsx` (~21 KB)
- `IDEA_Core_v0_API_Contract.html` (~62 KB)

---

## 🔒 An toàn & Bảo lưu dữ liệu
- File dữ liệu trung tâm: `tools/contract-exporter/data/api-catalog.json` được theo dõi lịch sử qua Git.
- Mọi thao tác cập nhật (update) đều bảo lưu các tùy biến, mô tả tiếng Việt và ghi chú nghiệp vụ.
- Nhánh làm việc: `feat/api-contract-exporter`. Có thể rollback về `main` bất cứ lúc nào với `git checkout main`.
