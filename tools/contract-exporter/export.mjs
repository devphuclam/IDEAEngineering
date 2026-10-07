import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  WidthType,
  ShadingType,
  ImageRun,
  Header,
  Footer,
  PageNumber
} from 'docx';
import ExcelJS from 'exceljs';

import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TOOL_DIR = __dirname;
const REPO_ROOT = path.resolve(TOOL_DIR, '../..');
const OUTPUT_DIR = path.resolve(TOOL_DIR, 'output');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// 1. Get current Git Commit SHA & Date
let gitCommit = 'UNKNOWN';
try {
  gitCommit = execSync('git rev-parse --short HEAD', { cwd: REPO_ROOT }).toString().trim();
} catch {}

const exportDate = new Date().toLocaleDateString('vi-VN', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});
const exportDateTime = new Date().toLocaleString('vi-VN');

// 2. Define API Catalog Data (Single source compiled from OpenAPI & Markdown specs)
const apiCatalog = [
  // --- Group 1: Xác thực & Phiên làm việc ---
  {
    group: 'Xác thực & Phiên làm việc',
    code: 'AUTH-01',
    name: 'Lấy mã bảo vệ CSRF',
    method: 'GET',
    path: '/api/v1/identity/csrf',
    auth: 'Công khai (Public)',
    status: 'ĐÃ TRIỂN KHAI (PASS)',
    description: 'Cấp mã CSRF token và tên header bảo vệ để thực hiện các thao tác thay đổi trạng thái nhạy cảm. Token được lưu tạm trong bộ nhớ client.',
    request: 'Không có body. Headers: Accept: application/json',
    response: '{\n  "headerName": "X-CSRF-TOKEN",\n  "token": "csrf_token_string..."\n}',
    statusCodes: '200 OK: Thành công\n500: Lỗi máy chủ',
    notes: 'Bắt buộc gọi trước khi thực hiện Đăng nhập hoặc các POST command.'
  },
  {
    group: 'Xác thực & Phiên làm việc',
    code: 'AUTH-02',
    name: 'Đăng nhập hệ thống (Login)',
    method: 'POST',
    path: '/api/v1/identity/login',
    auth: 'Công khai (Kèm CSRF)',
    status: 'ĐÃ TRIỂN KHAI (PASS)',
    description: 'Xác thực thông tin đăng nhập bằng username và password. Khi thành công, Server tự động thiết lập Session Cookie (HttpOnly, SameSite=Strict).',
    request: 'Form-urlencoded:\nusername=admin\npassword=******\nHeader: X-CSRF-TOKEN: ...',
    response: '{\n  "actorId": "ACT-001",\n  "accountId": "ACC-001",\n  "status": "ACTIVE"\n}',
    statusCodes: '200 OK: Đăng nhập thành công\n401 Unauthorized: Sai thông tin\n403 Forbidden: Thiếu/sai CSRF',
    notes: 'Không lưu mật khẩu hoặc token vào LocalStorage. Cookie được quản lý tự động bởi trình duyệt.'
  },
  {
    group: 'Xác thực & Phiên làm việc',
    code: 'AUTH-03',
    name: 'Kiểm tra phiên hiện tại (Session)',
    method: 'GET',
    path: '/api/v1/identity/session',
    auth: 'Yêu cầu Đăng nhập',
    status: 'ĐÃ TRIỂN KHAI (PASS)',
    description: 'Lấy thông tin định danh ActorId, AccountId và phạm vi của phiên làm việc đang hoạt động.',
    request: 'Không có body. Gửi kèm Session Cookie.',
    response: '{\n  "actorId": "ACT-001",\n  "accountId": "ACC-001",\n  "displayName": "Nguyễn Văn A",\n  "role": "ACCOUNT_ADMINISTRATOR"\n}',
    statusCodes: '200 OK: Phiên hợp lệ\n401 Unauthorized: Chưa đăng nhập hoặc phiên đã hết hạn (2h idle / 8h max)',
    notes: 'ActorId do Server xác định tuyệt đối, Client không được quyền giả mạo.'
  },
  {
    group: 'Xác thực & Phiên làm việc',
    code: 'AUTH-04',
    name: 'Đăng xuất hệ thống (Logout)',
    method: 'POST',
    path: '/api/v1/identity/logout',
    auth: 'Yêu cầu Đăng nhập',
    status: 'ĐÃ TRIỂN KHAI (PASS)',
    description: 'Hủy bỏ phiên làm việc hiện tại, thu hồi hiệu lực Session Cookie trên máy chủ.',
    request: 'Không có body. Header: X-CSRF-TOKEN',
    response: '204 No Content',
    statusCodes: '204 No Content: Đăng xuất thành công\n401 Unauthorized: Phiên không tồn tại',
    notes: 'Gọi lại I03 sau khi đăng xuất sẽ nhận mã 401.'
  },

  // --- Group 2: Quản trị Tài khoản & Phân quyền IAM ---
  {
    group: 'Quản trị Tài khoản & IAM',
    code: 'IAM-01',
    name: 'Tạo tài khoản mới',
    method: 'POST',
    path: '/api/v1/identity/accounts',
    auth: 'Account Administrator',
    status: 'ĐÃ TRIỂN KHAI (PASS)',
    description: 'Khởi tạo danh tính tài khoản người dùng mới ở trạng thái PENDING, chưa có mật khẩu và chưa được gán quyền dự án.',
    request: '{\n  "operationId": "UUID",\n  "organizationId": "ORG-001",\n  "displayName": "Lê Kỹ Sư",\n  "login": "lekysu"\n}',
    response: '{\n  "actorId": "ACT-002",\n  "accountId": "ACC-002",\n  "status": "PENDING",\n  "securityVersion": 1\n}',
    statusCodes: '201 Created: Tạo thành công\n403 Forbidden: Không đủ quyền quản trị\n409 Conflict: Trùng tên đăng nhập',
    notes: 'Chỉ tạo định danh. Muốn cấp quyền dự án phải qua phân quyền Project Administrator riêng.'
  },
  {
    group: 'Quản trị Tài khoản & IAM',
    code: 'IAM-02',
    name: 'Vô hiệu hóa tài khoản (Disable)',
    method: 'POST',
    path: '/api/v1/identity/accounts/{actorId}/disable',
    auth: 'Account Administrator',
    status: 'ĐÃ TRIỂN KHAI (PASS)',
    description: 'Tạm khóa tài khoản, lập tức chấm dứt và từ chối mọi phiên làm việc đang hoạt động của người dùng.',
    request: 'URL Param: actorId\nBody: { "reason": "Tạm nghỉ công tác" }',
    response: '{\n  "actorId": "ACT-002",\n  "status": "DISABLED"\n}',
    statusCodes: '200 OK: Khóa thành công\n404 Not Found: Không tìm thấy tài khoản\n409 Conflict: Tài khoản đã bị khóa',
    notes: 'Không xóa dữ liệu lịch sử và các chữ ký trước đó của người dùng.'
  },
  {
    group: 'Quản trị Tài khoản & IAM',
    code: 'IAM-03',
    name: 'Kích hoạt lại tài khoản (Re-enable)',
    method: 'POST',
    path: '/api/v1/identity/accounts/{actorId}/re-enable',
    auth: 'Account Administrator',
    status: 'ĐÃ TRIỂN KHAI (PASS)',
    description: 'Mở khóa tài khoản đã bị vô hiệu hóa để người dùng có thể đăng nhập trở lại.',
    request: 'URL Param: actorId',
    response: '{\n  "actorId": "ACT-002",\n  "status": "ACTIVE"\n}',
    statusCodes: '200 OK: Mở khóa thành công\n404 Not Found: Không tìm thấy\n409 Conflict: Tài khoản đang hoạt động',
    notes: 'Người dùng vẫn giữ nguyên mật khẩu cũ trừ khi có yêu cầu reset.'
  },
  {
    group: 'Quản trị Tài khoản & IAM',
    code: 'IAM-04',
    name: 'Cấp mã xác lập mật khẩu lần đầu (Setup Proof)',
    method: 'POST',
    path: '/api/v1/identity/accounts/{actorId}/setup-proof',
    auth: 'Account Administrator',
    status: 'ĐÃ TRIỂN KHAI (PASS)',
    description: 'Tạo mã Proof dùng một lần để gửi riêng cho nhân viên mới tự đặt mật khẩu ban đầu. Admin không bao giờ được biết mật khẩu.',
    request: 'URL Param: actorId',
    response: '{\n  "proofToken": "PROOF-SECRET-XYZ...",\n  "expiresAt": "2026-10-08T12:00:00Z"\n}',
    statusCodes: '200 OK: Cấp mã thành công\n403 Forbidden: Không có quyền\n409 Conflict: Tài khoản đã có mật khẩu',
    notes: 'Mã proof hết hạn sau 24 giờ và tự hủy sau khi sử dụng 1 lần.'
  },
  {
    group: 'Quản trị Tài khoản & IAM',
    code: 'IAM-05',
    name: 'Đổi mật khẩu bằng mã Proof',
    method: 'POST',
    path: '/api/v1/identity/credentials/change-with-proof',
    auth: 'Công khai (Kèm Proof Token)',
    status: 'ĐÃ TRIỂN KHAI (PASS)',
    description: 'Người dùng gửi mã Proof nhận được kèm mật khẩu mới để kích hoạt tài khoản hoặc reset mật khẩu.',
    request: '{\n  "proofToken": "PROOF-SECRET-XYZ...",\n  "newPassword": "SecretPassword123!"\n}',
    response: '{\n  "success": true,\n  "message": "Thiết lập mật khẩu thành công"\n}',
    statusCodes: '200 OK: Thành công\n400 Bad Request: Mật khẩu yếu\n401 Unauthorized: Proof sai hoặc hết hạn',
    notes: 'Sau khi đổi mật khẩu, mã proof mất hiệu lực vĩnh viễn.'
  },

  // --- Group 3: Cổng Chuyển giao & Lưu giữ File (Gateway Vault) ---
  {
    group: 'Cổng Truyền file & Vault',
    code: 'VLT-01',
    name: 'Tải lên từng mảnh file (Range Upload)',
    method: 'POST',
    path: '/transfer/range',
    auth: 'Kèm Transfer Grant hợp lệ',
    status: 'ĐÃ TRIỂN KHAI (PASS)',
    description: 'Đẩy từng chunk 1 MiB của file CAD/tài liệu nhị phân lên File Gateway Vault. Kèm mã băm SHA-256 từng chunk để kiểm tra toàn vẹn tức thì.',
    request: 'Binary Body (1 MiB)\nHeaders:\nX-IDEA-Grant: ...\nX-IDEA-Range-Start: 0\nX-IDEA-Range-End: 1048576\nX-IDEA-Chunk-SHA256: ...',
    response: 'Binary 12-byte: [8 bytes verifiedBytes][4 bytes receiptLength]',
    statusCodes: '200 OK: Chunk hợp lệ\n400 Bad Request: Sai SHA-256 hoặc sai tọa độ byte\n403 Forbidden: Grant hết hạn',
    notes: 'Kích thước chunk chuẩn là 1 MiB (1.048.576 bytes). Hỗ trợ truyền tiếp khi mạng gián đoạn.'
  },
  {
    group: 'Cổng Truyền file & Vault',
    code: 'VLT-02',
    name: 'Kiểm tra tiến độ & Lấy lại biên lai (Transfer Status)',
    method: 'GET',
    path: '/transfer/status',
    auth: 'Kèm Transfer Grant hợp lệ',
    status: 'ĐÃ TRIỂN KHAI (PASS)',
    description: 'Truy vấn số byte an toàn đã nhận trên Gateway để truyền tiếp (Resume) khi mất kết nối, hoặc lấy lại Receipt nếu đã xong mà không cần upload lại.',
    request: 'Header: X-IDEA-Grant: ...',
    response: 'Binary 12-byte: [verifiedBytes (BigInt64BE)][receiptLength (UInt32BE)] + [Receipt ký số]',
    statusCodes: '200 OK: Thành công\n403 Forbidden: Grant không hợp lệ',
    notes: 'Giúp khôi phục biên lai chuyển giao mà không tải lại một byte dữ liệu nào.'
  },

  // --- Group 4: Quản lý Dữ liệu Sản phẩm PDM (Controlled Product Data - CPD) ---
  {
    group: 'Dữ liệu Sản phẩm PDM (CPD)',
    code: 'CPD-01',
    name: 'Kiểm tra & Cảnh báo trùng lặp file (Store Existing)',
    method: 'POST',
    path: '/api/v1/cpd/store-existing/inspect',
    auth: 'Kỹ sư dự án (Project Member)',
    status: 'THIẾT KẾ (DESIGN - PH2)',
    description: 'Quét file sẵn có trên máy tính trước khi đưa vào Vault: so sánh mã băm, tên file để cảnh báo trùng lặp chi tiết Part/Assembly có sẵn.',
    request: '{\n  "fileName": "PUMP_VALVE.prt",\n  "fileDigest": "sha256:...",\n  "sizeBytes": 5242880\n}',
    response: '{\n  "isDuplicate": false,\n  "candidates": [],\n  "suggestedClass": "CAD_PART"\n}',
    statusCodes: '200 OK: Kiểm tra xong\n409 Conflict: Phát hiện trùng lặp cần xác nhận',
    notes: 'Ngăn chặn việc đăng ký trùng lặp mã chi tiết hoặc ghi đè mù mờ.'
  },
  {
    group: 'Dữ liệu Sản phẩm PDM (CPD)',
    code: 'CPD-02',
    name: 'Truy vấn thông tin tài liệu & Thế hệ hiện tại',
    method: 'GET',
    path: '/api/v1/cpd/documents/{documentId}',
    auth: 'Đọc theo quyền Dự án (Project Scope)',
    status: 'THIẾT KẾ (DESIGN - PH2)',
    description: 'Lấy thông tin tài liệu logic, mã số, tên gọi, loại Document Class, Revision hiện hành (A, B...), Version (1, 2...) và thế hệ bất biến (Generation).',
    request: 'URL Param: documentId',
    response: '{\n  "documentId": "DOC-2026-0001",\n  "classId": "CAD_ASSEMBLY",\n  "title": "Cụm Bơm Áp Suất",\n  "currentRevision": "A",\n  "currentVersion": 1,\n  "generationId": "GEN-001"\n}',
    statusCodes: '200 OK: Thành công\n403 Forbidden: Ngoài quyền dự án\n404 Not Found: Không tồn tại',
    notes: 'Lọc kết quả nghiêm ngặt theo phân quyền Dự án (RBAC Scope).'
  },
  {
    group: 'Dữ liệu Sản phẩm PDM (CPD)',
    code: 'CPD-03',
    name: 'Xem lịch sử thế hệ bất biến (Revision/Generation History)',
    method: 'GET',
    path: '/api/v1/cpd/documents/{documentId}/history',
    auth: 'Đọc theo quyền Dự án',
    status: 'THIẾT KẾ (DESIGN - PH2)',
    description: 'Truy xuất toàn bộ cây phả hệ lịch sử sửa đổi của tài liệu qua các đợt Check-in/Release. Mỗi thế hệ được cố định vĩnh viễn không bị sửa đổi.',
    request: 'URL Param: documentId',
    response: '{\n  "documentId": "DOC-2026-0001",\n  "revisions": [\n    { "revision": "A", "versions": [{ "version": 1, "generation": "GEN-001", "releasedAt": "..." }] }\n  ]\n}',
    statusCodes: '200 OK: Thành công\n404 Not Found: Không tìm thấy',
    notes: 'Bảo đảm tính toàn vẹn kiểm toán (Audit Trail) cho hồ sơ kỹ thuật sản phẩm.'
  }
];

// 3. GENERATE WORD (.DOCX) DOCUMENT
async function generateDocx() {
  const logoPath = path.resolve(REPO_ROOT, 'logo-idea.png');
  let logoImage = null;
  if (fs.existsSync(logoPath)) {
    logoImage = fs.readFileSync(logoPath);
  }

  const tableBorder = {
    top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
    bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
    left: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
    right: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
  };

  const doc = new Document({
    sections: [
      {
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({ text: "IDEA Engineering — Tài liệu Đặc tả Hợp đồng API (API Contract)", size: 18, color: "888888", italics: true }),
                ],
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.SPACE_BETWEEN,
                children: [
                  new TextRun({ text: `Bản phát hành ngày ${exportDate} | Git: ${gitCommit}`, size: 16, color: "888888" }),
                  new TextRun({ text: "Trang ", size: 16, color: "888888" }),
                  new TextRun({ children: [PageNumber.CURRENT], size: 16, color: "888888" }),
                ],
              }),
            ],
          }),
        },
        children: [
          // --- TRANG BÌA ---
          new Paragraph({ spacing: { before: 800, after: 400 } }),
          ...(logoImage ? [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new ImageRun({
                  data: logoImage,
                  transformation: { width: 140, height: 140 },
                }),
              ],
            })
          ] : []),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 400, after: 200 },
            children: [
              new TextRun({
                text: "DỰ ÁN IDEA ENGINEERING",
                size: 26,
                bold: true,
                color: "1F497D",
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 200 },
            children: [
              new TextRun({
                text: "ĐẶC TẢ HỢP ĐỒNG GIAO TIẾP API",
                size: 38,
                bold: true,
                color: "0F243E",
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 600 },
            children: [
              new TextRun({
                text: "Hồ sơ chuẩn hóa giao tiếp giữa Backend, Frontend, Desktop và Đối tác tích hợp",
                size: 22,
                italics: true,
                color: "555555",
              }),
            ],
          }),

          // Metadata Table
          new Table({
            alignment: AlignmentType.CENTER,
            width: { size: 90, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: "F2F2F2" },
                    children: [new Paragraph({ children: [new TextRun({ text: "Mã tài liệu kiểm soát:", bold: true })] })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun("IE-API-CONTRACT-DOC-001")] })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: "F2F2F2" },
                    children: [new Paragraph({ children: [new TextRun({ text: "Phiên bản hợp đồng:", bold: true })] })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun("v1.0 (Core v0 Released Baseline)")] })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: "F2F2F2" },
                    children: [new Paragraph({ children: [new TextRun({ text: "Thời điểm xuất bản:", bold: true })] })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun(exportDateTime)] })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: "F2F2F2" },
                    children: [new Paragraph({ children: [new TextRun({ text: "Mã nguồn Git Commit:", bold: true })] })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun(gitCommit)] })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: "F2F2F2" },
                    children: [new Paragraph({ children: [new TextRun({ text: "Đơn vị chủ trì:", bold: true })] })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun("IDEA Engineering System Architecture Team")] })],
                  }),
                ],
              }),
            ],
          }),

          new Paragraph({ pageBreakBefore: true }),

          // --- PHẦN 1: TÓM LƯỢC ĐIỀU HÀNH ---
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 200 },
            children: [new TextRun({ text: "PHẦN 1. TÓM LƯỢC ĐIỀU HÀNH CHO BAN GIÁM ĐỐC", bold: true, color: "1F497D" })],
          }),
          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({
                text: "Tài liệu này xác lập bản cam kết kỹ thuật (API Contract) chính thức của dự án IDEA Engineering. " +
                  "Mục đích nhằm đồng bộ hóa 100% giữa các đội ngũ phát triển: Backend (Java/Spring Boot), Frontend Web (React), " +
                  "Desktop Workstation (C#) và các đối tác tích hợp bên ngoài (như hệ thống ERP/MRP). " +
                  "Mọi thông tin trong tài liệu được đối chuẩn trực tiếp từ mã nguồn thực tế và hồ sơ kiểm thử trong Git."
              }),
            ],
          }),

          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 150 },
            children: [new TextRun({ text: "1.1 Thống kê tiến độ & Khối lượng API", bold: true, color: "333333" })],
          }),

          // Thống kê Table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ shading: { type: ShadingType.CLEAR, fill: "1F497D" }, children: [new Paragraph({ children: [new TextRun({ text: "Chỉ số", bold: true, color: "FFFFFF" })] })] }),
                  new TableCell({ shading: { type: ShadingType.CLEAR, fill: "1F497D" }, children: [new Paragraph({ children: [new TextRun({ text: "Số lượng / Tỷ lệ", bold: true, color: "FFFFFF" })] })] }),
                  new TableCell({ shading: { type: ShadingType.CLEAR, fill: "1F497D" }, children: [new Paragraph({ children: [new TextRun({ text: "Ghi chú đánh giá", bold: true, color: "FFFFFF" })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun("Tổng số Endpoint đã chuẩn hóa")] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "14 Endpoint", bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun("Phủ trọn vẹn Phase 1 và mở đầu Phase 2")] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun("Đã kiểm thử thành công (PASS)")] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "11 Endpoint (78.6%)", bold: true, color: "008000" })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun("Đạt chuẩn 100% Phase 1 (Auth, IAM, Vault Transfer)")] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun("Đang thiết kế (DESIGN)")] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "3 Endpoint (21.4%)", bold: true, color: "D9534F" })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun("Đang chuẩn bị triển khai cho Phase 2 (CPD PDM)")] })] }),
                ],
              }),
            ],
          }),

          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 150 },
            children: [new TextRun({ text: "1.2 Nguyên tắc thiết kế & Ranh giới bảo mật cốt lõi", bold: true, color: "333333" })],
          }),
          new Paragraph({
            spacing: { after: 100 },
            children: [
              new TextRun({ text: "1. Cơ chế phiên HttpOnly Cookie: ", bold: true }),
              new TextRun("Không lưu trữ Token vào LocalStorage/JavaScript để loại bỏ hoàn toàn nguy cơ tấn công XSS đánh cắp tài khoản.")
            ],
          }),
          new Paragraph({
            spacing: { after: 100 },
            children: [
              new TextRun({ text: "2. Chống giả mạo CSRF: ", bold: true }),
              new TextRun("Mọi thao tác thay đổi dữ liệu (POST/PUT/DELETE) bắt buộc phải có mã bảo vệ CSRF được cấp phát hợp lệ.")
            ],
          }),
          new Paragraph({
            spacing: { after: 100 },
            children: [
              new TextRun({ text: "3. Tách biệt Control Plane và Data Plane: ", bold: true }),
              new TextRun("REST API Server không chạm vào dữ liệu file nhị phân nặng; việc truyền file do File Gateway Vault xử lý riêng biệt qua các mảnh 1 MiB.")
            ],
          }),
          new Paragraph({
            spacing: { after: 200 },
            children: [
              new TextRun({ text: "4. Phân quyền do Server làm chủ: ", bold: true }),
              new TextRun("Phía giao diện Client không được tự xưng quyền hạn; Server thẩm định quyền hạn (RBAC) trên từng request độc lập.")
            ],
          }),

          new Paragraph({ pageBreakBefore: true }),

          // --- PHẦN 2: DANH MỤC MA TRẬN API ---
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 200 },
            children: [new TextRun({ text: "PHẦN 2. MA TRẬN TỔNG HỢP TOÀN BỘ API CORE V0", bold: true, color: "1F497D" })],
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ shading: { type: ShadingType.CLEAR, fill: "1F497D" }, children: [new Paragraph({ children: [new TextRun({ text: "Mã", bold: true, color: "FFFFFF" })] })] }),
                  new TableCell({ shading: { type: ShadingType.CLEAR, fill: "1F497D" }, children: [new Paragraph({ children: [new TextRun({ text: "Tên chức năng", bold: true, color: "FFFFFF" })] })] }),
                  new TableCell({ shading: { type: ShadingType.CLEAR, fill: "1F497D" }, children: [new Paragraph({ children: [new TextRun({ text: "Method", bold: true, color: "FFFFFF" })] })] }),
                  new TableCell({ shading: { type: ShadingType.CLEAR, fill: "1F497D" }, children: [new Paragraph({ children: [new TextRun({ text: "Đường dẫn URL", bold: true, color: "FFFFFF" })] })] }),
                  new TableCell({ shading: { type: ShadingType.CLEAR, fill: "1F497D" }, children: [new Paragraph({ children: [new TextRun({ text: "Quyền hạn", bold: true, color: "FFFFFF" })] })] }),
                  new TableCell({ shading: { type: ShadingType.CLEAR, fill: "1F497D" }, children: [new Paragraph({ children: [new TextRun({ text: "Trạng thái", bold: true, color: "FFFFFF" })] })] }),
                ],
              }),
              ...apiCatalog.map(item => new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: item.code, bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun(item.name)] })] }),
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: item.method === 'GET' ? "E6F4EA" : "E8F0FE" },
                    children: [new Paragraph({ children: [new TextRun({ text: item.method, bold: true, color: item.method === 'GET' ? "137333" : "1A73E8" })] })]
                  }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun(item.path)] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun(item.auth)] })] }),
                  new TableCell({
                    children: [new Paragraph({
                      children: [new TextRun({
                        text: item.status.includes('PASS') ? "✅ Sẵn sàng" : "⏳ Thiết kế",
                        bold: true,
                        color: item.status.includes('PASS') ? "008000" : "D9534F"
                      })]
                    })]
                  }),
                ],
              })),
            ],
          }),

          new Paragraph({ pageBreakBefore: true }),

          // --- PHẦN 3: ĐẶC TẢ CHI TIẾT TỪNG API ---
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 200 },
            children: [new TextRun({ text: "PHẦN 3. ĐẶC TẢ KỸ THUẬT CHI TIẾT TỪNG API (CHO DEV & ĐỐI TÁC)", bold: true, color: "1F497D" })],
          }),

          ...apiCatalog.flatMap(item => [
            new Paragraph({
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 250, after: 100 },
              children: [
                new TextRun({ text: `[${item.code}] ${item.name}`, bold: true, color: "1F497D" }),
                new TextRun({ text: ` — ${item.method} ${item.path}`, bold: true, color: "555555" }),
              ],
            }),
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({ width: { size: 25, type: WidthType.PERCENTAGE }, shading: { type: ShadingType.CLEAR, fill: "F2F2F2" }, children: [new Paragraph({ children: [new TextRun({ text: "Mô tả nghiệp vụ:", bold: true })] })] }),
                    new TableCell({ width: { size: 75, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun(item.description)] })] }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({ shading: { type: ShadingType.CLEAR, fill: "F2F2F2" }, children: [new Paragraph({ children: [new TextRun({ text: "Quyền hạn yêu cầu:", bold: true })] })] }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun(item.auth)] })] }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({ shading: { type: ShadingType.CLEAR, fill: "F2F2F2" }, children: [new Paragraph({ children: [new TextRun({ text: "Request (Đầu vào):", bold: true })] })] }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: item.request, font: "Consolas", size: 18 })] })] }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({ shading: { type: ShadingType.CLEAR, fill: "F2F2F2" }, children: [new Paragraph({ children: [new TextRun({ text: "Response (Đầu ra):", bold: true })] })] }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: item.response, font: "Consolas", size: 18 })] })] }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({ shading: { type: ShadingType.CLEAR, fill: "F2F2F2" }, children: [new Paragraph({ children: [new TextRun({ text: "Mã trạng thái & Lỗi:", bold: true })] })] }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun(item.statusCodes)] })] }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({ shading: { type: ShadingType.CLEAR, fill: "F2F2F2" }, children: [new Paragraph({ children: [new TextRun({ text: "Lưu ý tích hợp:", bold: true })] })] }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: item.notes, italics: true })] })] }),
                  ],
                }),
              ],
            }),
            new Paragraph({ spacing: { after: 150 } }),
          ]),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const docxFile = path.join(OUTPUT_DIR, 'IDEA_Core_v0_API_Contract.docx');
  fs.writeFileSync(docxFile, buffer);
  console.log('✅ Generated DOCX:', docxFile);
  return docxFile;
}

// 4. GENERATE EXCEL (.XLSX) SPREADSHEET
async function generateXlsx() {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'IDEA Engineering';
  workbook.created = new Date();

  // --- SHEET 1: TỔNG QUAN & THỐNG KÊ ---
  const ws1 = workbook.addWorksheet('1. Tổng quan & Thống kê');
  ws1.views = [{ showGridLines: true }];

  ws1.mergeCells('B2:H2');
  ws1.getCell('B2').value = 'BÁO CÁO TỔNG QUAN TIẾN ĐỘ & DANH MỤC API CONTRACT (IDEA CORE V0)';
  ws1.getCell('B2').font = { name: 'Arial', size: 15, bold: true, color: { argb: 'FFFFFFFF' } };
  ws1.getCell('B2').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F497D' } };
  ws1.getCell('B2').alignment = { vertical: 'middle', horizontal: 'center' };
  ws1.getRow(2).height = 36;

  ws1.getCell('B4').value = 'Thời điểm xuất bản:';
  ws1.getCell('B4').font = { bold: true };
  ws1.getCell('C4').value = exportDateTime;

  ws1.getCell('B5').value = 'Mã Git Commit SHA:';
  ws1.getCell('B5').font = { bold: true };
  ws1.getCell('C5').value = gitCommit;

  ws1.getCell('B6').value = 'Trạng thái phiên bản:';
  ws1.getCell('B6').font = { bold: true };
  ws1.getCell('C6').value = 'v1.0 Baseline Approved';

  // KPI Boxes
  const kpis = [
    { label: 'TỔNG SỐ ENDPOINT', val: apiCatalog.length, col: 'B', color: 'FF1F497D' },
    { label: 'ĐÃ TRIỂN KHAI (PASS)', val: apiCatalog.filter(i => i.status.includes('PASS')).length, col: 'D', color: 'FF137333' },
    { label: 'ĐANG THIẾT KẾ (PH2)', val: apiCatalog.filter(i => i.status.includes('DESIGN')).length, col: 'F', color: 'FFD93025' },
  ];

  kpis.forEach(k => {
    ws1.mergeCells(`${k.col}8:${String.fromCharCode(k.col.charCodeAt(0) + 1)}8`);
    ws1.mergeCells(`${k.col}9:${String.fromCharCode(k.col.charCodeAt(0) + 1)}9`);
    const cTitle = ws1.getCell(`${k.col}8`);
    const cVal = ws1.getCell(`${k.col}9`);

    cTitle.value = k.label;
    cTitle.font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
    cTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: k.color } };
    cTitle.alignment = { horizontal: 'center', vertical: 'middle' };

    cVal.value = k.val;
    cVal.font = { name: 'Arial', size: 20, bold: true, color: { argb: k.color } };
    cVal.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF2F2F2' } };
    cVal.alignment = { horizontal: 'center', vertical: 'middle' };
  });
  ws1.getRow(8).height = 24;
  ws1.getRow(9).height = 36;

  // --- SHEET 2: MA TRẬN API CORE ---
  const ws2 = workbook.addWorksheet('2. Danh mục API Core v0');
  ws2.views = [{ showGridLines: true }];

  ws2.columns = [
    { header: 'STT', key: 'stt', width: 6 },
    { header: 'Nhóm chức năng', key: 'group', width: 26 },
    { header: 'Mã API', key: 'code', width: 12 },
    { header: 'Tên chức năng', key: 'name', width: 32 },
    { header: 'Method', key: 'method', width: 10 },
    { header: 'Đường dẫn URL Endpoint', key: 'path', width: 44 },
    { header: 'Quyền hạn gọi', key: 'auth', width: 28 },
    { header: 'Trạng thái', key: 'status', width: 24 },
    { header: 'Ghi chú nghiệp vụ', key: 'notes', width: 45 },
  ];

  // Header styling
  const headerRow = ws2.getRow(1);
  headerRow.height = 28;
  headerRow.eachCell((cell) => {
    cell.font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F497D' } };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
  });

  apiCatalog.forEach((item, index) => {
    const row = ws2.addRow({
      stt: index + 1,
      group: item.group,
      code: item.code,
      name: item.name,
      method: item.method,
      path: item.path,
      auth: item.auth,
      status: item.status,
      notes: item.notes,
    });
    row.height = 22;
    row.eachCell((cell, colNum) => {
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFE0E0E0' } },
        left: { style: 'thin', color: { argb: 'FFE0E0E0' } },
        bottom: { style: 'thin', color: { argb: 'FFE0E0E0' } },
        right: { style: 'thin', color: { argb: 'FFE0E0E0' } }
      };
      if (colNum === 1 || colNum === 3 || colNum === 5) {
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      }
      if (colNum === 5) { // Method
        cell.font = { bold: true, color: { argb: item.method === 'GET' ? 'FF137333' : 'FF1A73E8' } };
      }
      if (colNum === 8) { // Status
        cell.font = { bold: true, color: { argb: item.status.includes('PASS') ? 'FF008000' : 'FFD93025' } };
      }
    });
  });

  // --- SHEET 3: CHI TIẾT PAYLOAD & LỖI ---
  const ws3 = workbook.addWorksheet('3. Chi tiết Payload & Mã lỗi');
  ws3.views = [{ showGridLines: true }];

  ws3.columns = [
    { header: 'Mã API', key: 'code', width: 12 },
    { header: 'Tên chức năng', key: 'name', width: 28 },
    { header: 'Endpoint', key: 'path', width: 36 },
    { header: 'Request Payload mẫu', key: 'request', width: 45 },
    { header: 'Response Payload mẫu', key: 'response', width: 45 },
    { header: 'Các mã lỗi có thể gặp', key: 'statusCodes', width: 40 },
  ];

  const headerRow3 = ws3.getRow(1);
  headerRow3.height = 28;
  headerRow3.eachCell((cell) => {
    cell.font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F497D' } };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
  });

  apiCatalog.forEach(item => {
    const row = ws3.addRow({
      code: item.code,
      name: item.name,
      path: item.path,
      request: item.request,
      response: item.response,
      statusCodes: item.statusCodes,
    });
    row.height = 55;
    row.eachCell(cell => {
      cell.alignment = { wrapText: true, vertical: 'top' };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFE0E0E0' } },
        left: { style: 'thin', color: { argb: 'FFE0E0E0' } },
        bottom: { style: 'thin', color: { argb: 'FFE0E0E0' } },
        right: { style: 'thin', color: { argb: 'FFE0E0E0' } }
      };
    });
  });

  const xlsxFile = path.join(OUTPUT_DIR, 'IDEA_Core_v0_API_Contract.xlsx');
  await workbook.xlsx.writeFile(xlsxFile);
  console.log('✅ Generated XLSX:', xlsxFile);
  return xlsxFile;
}

(async () => {
  console.log('🚀 Đang bắt đầu biên dịch tài liệu API Contract...');
  const docx = await generateDocx();
  const xlsx = await generateXlsx();
  console.log('\n🎉 HOÀN THÀNH XUẤT XƯỞNG!');
  console.log('📄 File Word: ', docx);
  console.log('📊 File Excel:', xlsx);
})();
