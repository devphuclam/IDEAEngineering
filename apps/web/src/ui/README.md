# IDEA Engineering — UI Kit Foundation (Increment 1)

## Tổng quan kiến trúc
UI Kit Foundation Increment 1 được xây dựng theo định hướng thẩm mỹ **Nordic Functionalist kết hợp Technical Precision**, phục vụ ứng dụng web chuyên ngành quản trị kỹ thuật và dữ liệu sản phẩm (DDM/PLM/IAM). Kiến trúc tuân thủ nghiêm ngặt chuẩn accessibility WCAG 2.1 AA, tính toàn vẹn của DOM ngữ nghĩa và nguyên tắc bảo mật fail-closed.

---

## 1. Design Tokens (`src/ui/tokens`)

Design Tokens được định nghĩa dưới dạng CSS Custom Properties trong `tokens.css` và TypeScript types trong `tokens.ts`.

### Theme & Density Matrix
- **Themes**:
  - `data-theme="light"` (Mặc định): Nền sáng trung tính, độ tương phản cao, tối ưu cho môi trường văn phòng kỹ thuật.
  - `data-theme="dark"`: Nền tối với sắc độ than chì kỹ thuật (charcoal), giảm mỏi mắt khi làm việc ban đêm.
- **Density**:
  - `data-density="comfortable"` (Mặc định): Spacing thoáng, padding cân đối, phù hợp thao tác đọc và điều hướng tổng thể.
  - `data-density="compact"`: Spacing thu gọn 25-30%, tăng mật độ hiển thị dữ liệu cho bảng và thanh công cụ chuyên dụng.

### Bảng màu Semantic (Tokens)
- **Primary / Brand**: `--idea-color-primary`, `--idea-color-primary-hover`, `--idea-color-primary-subtle`
- **Surface**: `--idea-color-surface`, `--idea-color-surface-subtle`, `--idea-color-surface-sunken`
- **Text**: `--idea-color-text`, `--idea-color-text-muted`, `--idea-color-text-subtle`
- **Borders**: `--idea-color-border`, `--idea-color-border-subtle`
- **Feedback**:
  - `--idea-color-success` (Xác nhận, kích hoạt thành công)
  - `--idea-color-warning` (Cảnh báo, phiên hết hạn)
  - `--idea-color-danger` (Lỗi từ chối, thao tác xóa)
  - `--idea-color-info` (Thông tin trạng thái hệ thống)
- **RBAC Classification**:
  - `--idea-badge-highest`: Phân loại HIGHEST (Đỏ mận kỹ thuật)
  - `--idea-badge-admin`: Phân loại ADMINISTRATION (Xanh đậm chuyên trách)
  - `--idea-badge-business`: Phân loại BUSINESS (Xám thép nghiệp vụ)

---

## 2. Hướng dẫn sử dụng Components (`src/ui/primitives`)

### Button (`Button.tsx`)
Hỗ trợ các biến thể ngữ nghĩa và kích thước:
```tsx
import { Button } from './ui/primitives/Button';

<Button variant="primary" size="md" onClick={handleSave}>Lưu thay đổi</Button>
<Button variant="secondary" size="sm">Hủy bỏ</Button>
<Button variant="danger" size="sm">Xóa bản ghi</Button>
<Button variant="ghost" size="sm">Đóng</Button>
```

### Input (`Input.tsx`)
Hỗ trợ ô nhập liệu tiêu chuẩn, icon tìm kiếm, nhãn lỗi và trạng thái `aria-invalid`:
```tsx
import { Input } from './ui/primitives/Input';

<Input
  placeholder="Tìm kiếm..."
  value={query}
  onChange={(e) => setQuery(e.target.value)}
  icon="🔍"
  errorMessage={hasError ? "Mã vai trò không hợp lệ" : undefined}
/>
```

### Badge (`Badge.tsx`)
Hiển thị phân loại RBAC và trạng thái bản ghi:
```tsx
import { Badge } from './ui/primitives/Badge';

<Badge variant="highest">HIGHEST</Badge>
<Badge variant="admin">ADMINISTRATION</Badge>
<Badge variant="business">BUSINESS</Badge>
```

### Dialog (`Dialog.tsx`) & Overlay Stacking (`overlayStack.ts`)
Hộp thoại modal với cơ chế React Portal đưa nội dung ra ngoài `#appRoot` (vào `#idea-overlay-root`), tích hợp focus trap, phím Escape, và quản lý nested inert:
```tsx
import { Dialog } from './ui/primitives/Dialog';

<Dialog
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Xác nhận hủy thay đổi"
  description="Cảnh báo trước khi rời khỏi form"
  footer={
    <>
      <Button variant="secondary" onClick={() => setIsOpen(false)}>Tiếp tục sửa</Button>
      <Button variant="danger" onClick={handleDiscard}>Hủy bỏ</Button>
    </>
  }
>
  <p>Dữ liệu chưa lưu sẽ bị mất. Bạn có chắc chắn không?</p>
</Dialog>
```

### Drawer (`Drawer.tsx`)
Bảng trượt slide-over từ cạnh phải, phục vụ các luồng cấu hình phức tạp (như tạo Role Candidate):
```tsx
import { Drawer } from './ui/primitives/Drawer';

<Drawer
  isOpen={isDrawerOpen}
  onClose={() => setIsDrawerOpen(false)}
  title="Tạo Custom Role Candidate mới"
  description="Authoritative Server Lifecycle"
  footer={<Button variant="primary" onClick={handlePrepare}>Chuẩn bị Candidate</Button>}
>
  {/* Form fields */}
</Drawer>
```

### Semantic DataTable (`DataTable.tsx`)
Bảng HTML ngữ nghĩa hoàn chỉnh (`<table>`, `<thead>`, `<tbody>`, `<th>`, `<tr>`, `<td>`), không dùng thư viện ngoài, hỗ trợ:
- Sắp xếp đa chiều (Click header để luân chuyển: ascending → descending → none)
- `aria-sort` strictly nằm trên thẻ `<th>` của cột sortable
- Lọc tìm kiếm theo query hoặc custom `filterFn`
- Điều hướng bằng bàn phím (Phím mũi tên `ArrowUp`, `ArrowDown`, chọn dòng bằng `Enter` hoặc `Space`)
```tsx
import { DataTable, Column } from './ui/table/DataTable';

const columns: Column<RoleView>[] = [
  { key: 'roleCode', header: 'Mã vai trò', sortable: true, width: '200px' },
  { key: 'displayName', header: 'Tên hiển thị', sortable: true },
  { key: 'classification', header: 'Phân loại', sortable: true, render: (r) => <Badge variant="business">{r.classification}</Badge> },
];

<DataTable
  data={roles}
  columns={columns}
  getRowId={(r) => r.roleVersionId}
  selectedId={selectedId}
  onSelectRow={(r) => setSelectedRole(r)}
  ariaLabel="Danh sách vai trò"
/>
```

### AppShell (`AppShell.tsx`) & InspectorLayout (`InspectorLayout.tsx`)
Khung ứng dụng tiêu chuẩn Workbench / Hub:
- Header với logo, breadcrumbs, action controls
- Sidebar có thể thu gọn / mở rộng
- Inspector layout trượt bên phải hiển thị chi tiết và candidate diff, phím tắt `Alt+I` bị chặn tự động khi có modal/drawer overlay mở phía trên.

---

## 3. Kiến trúc Overlay Stacking (`overlayStack.ts`)
Để giải quyết triệt để lỗi vô hiệu hóa (inert) con cháu khi `#appRoot.inert = true`:
1. `getOverlayRoot()` tự động khởi tạo hoặc lấy container `#idea-overlay-root` là con trực tiếp của `document.body` (song song với `#appRoot`).
2. Khi mở Drawer/Dialog: Portal gắn element vào `#idea-overlay-root`.
3. Khi xếp chồng (Nested Overlays: Dialog mở đè lên Drawer):
   - Layer dưới cùng (`#appRoot`) đã bị `inert = true`.
   - Layer trung gian (Drawer) được gán `inert = true` và `aria-hidden = "true"`.
   - Layer trên cùng (Dialog) giữ nguyên tính tương tác đầy đủ, focus trap hoạt động bình thường.
4. Khi đóng Dialog: Drawer được khôi phục `inert = false` và nhận lại focus từ trigger element.
5. Khi đóng Drawer: `#appRoot` được gỡ bỏ `inert = false`.
