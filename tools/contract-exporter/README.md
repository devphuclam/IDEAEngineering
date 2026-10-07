# IDEA Core v0 - API Contract Exporter

Công cụ tự động trích xuất thông số kỹ thuật API từ các tài liệu Markdown (`identity-session.md`, `controlled-product-data.md`, `overview.vi.md`) và OpenAPI JSON của hệ thống IDEA Core, biên dịch ra bộ tài liệu chuẩn:
1. **File Word (`.docx`)**: Báo cáo kỹ thuật và quản lý chính thức (gồm Trang bìa chuẩn nhận diện thương hiệu IDEA, Tóm tắt quản lý Điều hành, Bảng tổng mục API, và Đặc tả kỹ thuật chi tiết từng endpoint Request/Response/Status code).
2. **File Excel (`.xlsx`)**: Bảng tính ma trận API 3 sheets (Dashboard chỉ số điều hành, Danh mục ma trận 14 API đầy đủ thuộc tính, Chi tiết Payload/Parameters/Mã lỗi).

---

## 🚀 Hướng dẫn sử dụng trên máy Local

Bạn có thể chạy từ bất kỳ thư mục nào trong dự án với **1 lệnh duy nhất**:

### Cách 1: Chạy trực tiếp bằng Node từ thư mục gốc dự án
```bash
node tools/contract-exporter/export.mjs
```

### Cách 2: Chạy qua npm script
```bash
cd tools/contract-exporter
npm run export
```

---

## 📂 Kết quả xuất ra (Output)

Tài liệu được lưu tại thư mục:
`tools/contract-exporter/output/`
- `IDEA_Core_v0_API_Contract.docx` (~70 KB)
- `IDEA_Core_v0_API_Contract.xlsx` (~13 KB)

---

## 🔒 An toàn & Độc lập
- Công cụ được đặt độc lập trong `tools/contract-exporter/`, không làm ảnh hưởng đến cấu trúc `node_modules` hay mã nguồn chính của ứng dụng (`apps/web`, `apps/server`).
- Thư mục `output/` và `node_modules/` đã được cấu hình trong `.gitignore`, không gây rác lịch sử Git.
- Tự động gắn mã Git Commit SHA và nhãn thời gian thực tế tại thời điểm xuất file.
