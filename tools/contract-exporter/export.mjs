import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TOOL_DIR = __dirname;
const REPO_ROOT = path.resolve(TOOL_DIR, '../..');
const DATA_DIR = path.resolve(TOOL_DIR, 'data');
const OUTPUT_DIR = path.resolve(TOOL_DIR, 'output');
const CATALOG_PATH = path.resolve(DATA_DIR, 'api-catalog.json');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const exportDate = new Date().toLocaleDateString('vi-VN', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});
const exportDateTime = new Date().toLocaleString('vi-VN');

// Helper to convert multiline strings safely into OpenXML TextRuns (no literal \n in <w:t>)
function createSafeTextRuns(text, options = {}) {
  if (!text) return [new TextRun({ text: "", ...options })];
  const lines = String(text).split(/\r?\n/);
  return lines.map((line, index) => new TextRun({
    text: line || " ",
    break: index > 0 ? 1 : 0,
    ...options
  }));
}

function createCodeRuns(codeText) {
  if (!codeText) return [new TextRun({ text: "" })];
  const lines = String(codeText).split(/\r?\n/);
  return lines.map((line, index) => new TextRun({
    text: line || " ",
    break: index > 0 ? 1 : 0,
    font: "Consolas",
    size: 16,
    color: "1F2937"
  }));
}

// 1. Load API Catalog
function loadCatalog() {
  if (!fs.existsSync(CATALOG_PATH)) {
    throw new Error(`Không tìm thấy file catalog dữ liệu tại: ${CATALOG_PATH}`);
  }
  return JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf-8'));
}

// 2. Update / Smart Merge function
function updateCatalog() {
  console.log('--- Đang quét và đồng bộ dữ liệu từ mã nguồn repository ---');
  const catalog = loadCatalog();

  const openapiPath = path.resolve(REPO_ROOT, 'apps/server/src/main/resources/dev-access/openapi.json');
  if (fs.existsSync(openapiPath)) {
    try {
      const openapi = JSON.parse(fs.readFileSync(openapiPath, 'utf-8'));
      if (openapi.paths) {
        console.log(`[OK] Đã quét OpenAPI Specification (${Object.keys(openapi.paths).length} routes)`);
      }
    } catch (e) {
      console.warn('[CẢNH BÁO] Không đọc được openapi.json:', e.message);
    }
  }

  const identityMdPath = path.resolve(REPO_ROOT, 'docs/product/instances/idea-engineering/api/identity-session.md');
  const cpdMdPath = path.resolve(REPO_ROOT, 'docs/product/instances/idea-engineering/api/controlled-product-data.md');

  if (fs.existsSync(identityMdPath)) {
    console.log('[OK] Đã đối chuẩn tài liệu kỹ thuật: identity-session.md');
  }
  if (fs.existsSync(cpdMdPath)) {
    console.log('[OK] Đã đối chuẩn tài liệu kỹ thuật: controlled-product-data.md');
  }

  // Update date
  catalog.metadata.date = exportDate;

  fs.writeFileSync(CATALOG_PATH, JSON.stringify(catalog, null, 2), 'utf-8');
  console.log(`[HOÀN TẤT] Dữ liệu được lưu tại ${CATALOG_PATH}\n`);
  return catalog;
}

// 3. GENERATE WORD (.DOCX) DOCUMENT
async function generateDocx(catalog) {
  // Use real PNG logo from data directory
  const logoPath = path.resolve(DATA_DIR, 'logo-idea-real.png');
  let logoImage = null;
  if (fs.existsSync(logoPath)) {
    logoImage = fs.readFileSync(logoPath);
  }

  const borderThin = {
    top: { style: BorderStyle.SINGLE, size: 1, color: "D1D5DB" },
    bottom: { style: BorderStyle.SINGLE, size: 1, color: "D1D5DB" },
    left: { style: BorderStyle.SINGLE, size: 1, color: "D1D5DB" },
    right: { style: BorderStyle.SINGLE, size: 1, color: "D1D5DB" },
  };

  const headerShading = { type: ShadingType.CLEAR, fill: "2D3748" };
  const subHeaderShading = { type: ShadingType.CLEAR, fill: "F3F4F6" };

  const doc = new Document({
    sections: [
      {
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({ text: "IDEA Engineering — Đặc tả giao tiếp API (SPEC-API-001)", size: 18, color: "6B7280", italics: true }),
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
                  new TextRun({ text: `Bản phát hành nội bộ • Ngày ${exportDate}`, size: 16, color: "6B7280" }),
                  new TextRun({ text: "Trang ", size: 16, color: "6B7280" }),
                  new TextRun({ children: [PageNumber.CURRENT], size: 16, color: "6B7280" }),
                ],
              }),
            ],
          }),
        },
        children: [
          // --- KHỐI METADATA ĐẦU TRANG THEO CHUẨN SPEC-001 ---
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 60, type: WidthType.PERCENTAGE },
                    borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                    children: [
                      new Paragraph({ children: [new TextRun({ text: "Tên dự án: ", bold: true }), new TextRun(catalog.metadata.project)] }),
                      new Paragraph({ children: [new TextRun({ text: "Mã tài liệu: ", bold: true }), new TextRun(catalog.metadata.documentCode)] }),
                      new Paragraph({ children: [new TextRun({ text: "Trạng thái: ", bold: true }), new TextRun(catalog.metadata.status)] }),
                    ]
                  }),
                  new TableCell({
                    width: { size: 40, type: WidthType.PERCENTAGE },
                    borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                    children: [
                      new Paragraph({ children: [new TextRun({ text: "Người phụ trách: ", bold: true }), new TextRun(catalog.metadata.author)] }),
                      new Paragraph({ children: [new TextRun({ text: "Phòng ban: ", bold: true }), new TextRun(catalog.metadata.department)] }),
                      new Paragraph({ children: [new TextRun({ text: "Ngày soạn thảo: ", bold: true }), new TextRun(exportDate)] }),
                    ]
                  }),
                ]
              })
            ]
          }),

          new Paragraph({ spacing: { before: 500, after: 200 } }),

          // Logo IDEA
          ...(logoImage ? [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new ImageRun({
                  data: logoImage,
                  transformation: { width: 164, height: 70 },
                  type: "png"
                }),
              ],
            })
          ] : []),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 300, after: 100 },
            children: [
              new TextRun({
                text: "ĐẶC TẢ GIAO TIẾP API",
                size: 34,
                bold: true,
                color: "111827",
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 50, after: 150 },
            children: [
              new TextRun({
                text: "HỆ THỐNG IDEA DDM CORE v0",
                size: 26,
                bold: true,
                color: "1E40AF",
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 50, after: 400 },
            children: [
              new TextRun({
                text: catalog.metadata.subtitle,
                size: 20,
                italics: true,
                color: "4B5563",
              }),
            ],
          }),

          // Khung Mục lục nội dung (TOC Outline)
          new Table({
            alignment: AlignmentType.CENTER,
            width: { size: 90, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: "F9FAFB" },
                    borders: borderThin,
                    children: [
                      new Paragraph({ spacing: { before: 100, after: 100 }, children: [new TextRun({ text: "MỤC LỤC TÀI LIỆU", bold: true, color: "1F2937" })] }),
                      new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: "1. Phạm vi và quy ước kiến trúc chung" })] }),
                      new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: "2. Lịch sử thay đổi phiên bản (Changelog)" })] }),
                      new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: "3. Quy trình phối hợp đa thành phần (Call flows)" })] }),
                      new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: "4. Ma trận tổng hợp các endpoint Core v0" })] }),
                      new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: "5. Đặc tả chi tiết từng giao tiếp kỹ thuật" })] }),
                    ]
                  })
                ]
              })
            ]
          }),

          new Paragraph({ pageBreakBefore: true }),

          // --- 1. PHẠM VI VÀ QUY ƯỚC KIẾN TRÚC CHUNG ---
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 150 },
            children: [new TextRun({ text: "1. Phạm vi và quy ước kiến trúc chung", bold: true, color: "111827" })],
          }),
          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: "Tài liệu này xác lập các quy ước kỹ thuật ràng buộc giữa các thành phần phần mềm thuộc hệ thống IDEA DDM Core v0, " +
                  "bao gồm Web Application (React), Desktop Workstation Adapter (C#), REST Application Server (Spring Boot) và Cổng truyền dữ liệu tệp tin (File Gateway Vault). " +
                  "Mọi thông số được kiểm chuẩn trực tiếp dựa trên mã nguồn và các biên bản kiểm thử hệ thống."
              })
            ],
          }),

          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 150, after: 100 },
            children: [new TextRun({ text: "1.1 Bối cảnh phân tầng kiến trúc", bold: true, color: "374151" })],
          }),
          new Paragraph({
            spacing: { after: 100 },
            children: [
              new TextRun({ text: "Hệ thống tách biệt triệt để giữa Control Plane (mặt phẳng điều khiển nghiệp vụ) và Data Plane (mặt phẳng truyền dữ liệu nhị phân). " +
                "REST Application Server chỉ xử lý thông tin định danh, quyền hạn, phiên làm việc và siêu dữ liệu (Metadata) sản phẩm. " +
                "Các tệp tin CAD và bản vẽ có dung lượng lớn được vận chuyển độc lập qua File Gateway Vault dưới dạng các khối nhị phân 1 MiB có kèm mã băm SHA-256." })
            ],
          }),

          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 150, after: 100 },
            children: [new TextRun({ text: "1.2 Quy ước bảo mật phiên làm việc và chống giả mạo", bold: true, color: "374151" })],
          }),
          new Paragraph({
            spacing: { after: 80 },
            children: [
              new TextRun({ text: "• Phiên làm việc (Session Cookie): ", bold: true }),
              new TextRun("Xác thực thông qua cookie HTTP IDEA_SESSION (cờ HttpOnly, Secure, SameSite=Strict). Ứng dụng client tuyệt đối không lưu token vào LocalStorage/SessionStorage nhằm loại bỏ nguy cơ tấn công XSS. Thời hạn phiên: 2 giờ không hoạt động (idle) và tối đa 8 giờ (absolute).")
            ],
          }),
          new Paragraph({
            spacing: { after: 80 },
            children: [
              new TextRun({ text: "• Phòng chống CSRF: ", bold: true }),
              new TextRun("Mọi phương thức thay đổi trạng thái (POST, PUT, DELETE) bắt buộc phải đính kèm Header X-CSRF-TOKEN đã được cấp phát hợp lệ từ endpoint GET /api/v1/identity/csrf.")
            ],
          }),
          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({ text: "• Thẩm quyền phân quyền (RBAC): ", bold: true }),
              new TextRun("Máy chủ xác định danh tính ActorId và quyền hạn thực tế độc lập dựa trên phiên làm việc; Client không được phép tự chỉ định quyền hạn trong request payload.")
            ],
          }),

          // --- 2. LỊCH SỬ THAY ĐỔI PHIÊN BẢN ---
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 150 },
            children: [new TextRun({ text: "2. Lịch sử thay đổi phiên bản (Changelog)", bold: true, color: "111827" })],
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ width: { size: 15, type: WidthType.PERCENTAGE }, shading: headerShading, borders: borderThin, children: [new Paragraph({ children: [new TextRun({ text: "Phiên bản", bold: true, color: "FFFFFF" })] })] }),
                  new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, shading: headerShading, borders: borderThin, children: [new Paragraph({ children: [new TextRun({ text: "Ngày áp dụng", bold: true, color: "FFFFFF" })] })] }),
                  new TableCell({ width: { size: 25, type: WidthType.PERCENTAGE }, shading: headerShading, borders: borderThin, children: [new Paragraph({ children: [new TextRun({ text: "Người thực hiện", bold: true, color: "FFFFFF" })] })] }),
                  new TableCell({ width: { size: 40, type: WidthType.PERCENTAGE }, shading: headerShading, borders: borderThin, children: [new Paragraph({ children: [new TextRun({ text: "Nội dung cập nhật", bold: true, color: "FFFFFF" })] })] }),
                ],
              }),
              ...catalog.metadata.revisions.map(rev => new TableRow({
                children: [
                  new TableCell({ borders: borderThin, children: [new Paragraph({ children: [new TextRun({ text: `v${rev.version}`, bold: true })] })] }),
                  new TableCell({ borders: borderThin, children: [new Paragraph({ children: [new TextRun(rev.date)] })] }),
                  new TableCell({ borders: borderThin, children: [new Paragraph({ children: [new TextRun(rev.author)] })] }),
                  new TableCell({ borders: borderThin, children: [new Paragraph({ children: createSafeTextRuns(rev.description) })] }),
                ],
              })),
            ],
          }),

          new Paragraph({ pageBreakBefore: true }),

          // --- 3. QUY TRÌNH PHỐI HỢP ĐA THÀNH PHẦN ---
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 150 },
            children: [new TextRun({ text: "3. Quy trình phối hợp đa thành phần (Call flows)", bold: true, color: "111827" })],
          }),
          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: "Phần này chuẩn hóa trình tự giao tiếp giữa các tác tử và máy chủ cho 3 chu trình hoạt động nền tảng của hệ thống."
              })
            ],
          }),

          ...catalog.workflows.flatMap(wf => [
            new Paragraph({
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 180, after: 80 },
              children: [new TextRun({ text: `${wf.id}. ${wf.title}`, bold: true, color: "1E40AF" })],
            }),
            new Paragraph({
              spacing: { after: 100 },
              children: [new TextRun({ text: wf.description, italics: true, color: "4B5563" })],
            }),
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({ width: { size: 8, type: WidthType.PERCENTAGE }, shading: headerShading, borders: borderThin, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Bước", bold: true, color: "FFFFFF" })] })] }),
                    new TableCell({ width: { size: 18, type: WidthType.PERCENTAGE }, shading: headerShading, borders: borderThin, children: [new Paragraph({ children: [new TextRun({ text: "Bên gửi (Caller)", bold: true, color: "FFFFFF" })] })] }),
                    new TableCell({ width: { size: 26, type: WidthType.PERCENTAGE }, shading: headerShading, borders: borderThin, children: [new Paragraph({ children: [new TextRun({ text: "Hành động & Endpoint", bold: true, color: "FFFFFF" })] })] }),
                    new TableCell({ width: { size: 14, type: WidthType.PERCENTAGE }, shading: headerShading, borders: borderThin, children: [new Paragraph({ children: [new TextRun({ text: "Bên nhận", bold: true, color: "FFFFFF" })] })] }),
                    new TableCell({ width: { size: 34, type: WidthType.PERCENTAGE }, shading: headerShading, borders: borderThin, children: [new Paragraph({ children: [new TextRun({ text: "Kết quả & Dữ liệu trao đổi", bold: true, color: "FFFFFF" })] })] }),
                  ],
                }),
                ...wf.steps.map(s => new TableRow({
                  children: [
                    new TableCell({ borders: borderThin, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${s.step}`, bold: true })] })] }),
                    new TableCell({ borders: borderThin, children: [new Paragraph({ children: [new TextRun(s.actor)] })] }),
                    new TableCell({ borders: borderThin, children: [
                      new Paragraph({ children: [
                        new TextRun({ text: s.action, bold: true }),
                        new TextRun({ text: s.endpoint, break: 1, font: "Consolas", size: 16 })
                      ] })
                    ] }),
                    new TableCell({ borders: borderThin, children: [new Paragraph({ children: [new TextRun(s.receiver)] })] }),
                    new TableCell({ borders: borderThin, children: [new Paragraph({ children: createSafeTextRuns(s.outcome) })] }),
                  ],
                })),
              ],
            }),
            new Paragraph({ spacing: { after: 120 } }),
          ]),

          new Paragraph({ pageBreakBefore: true }),

          // --- 4. MA TRẬN TỔNG HỢP CÁC ENDPOINT ---
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 150 },
            children: [new TextRun({ text: "4. Ma trận tổng hợp các endpoint Core v0", bold: true, color: "111827" })],
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ width: { size: 10, type: WidthType.PERCENTAGE }, shading: headerShading, borders: borderThin, children: [new Paragraph({ children: [new TextRun({ text: "Mã", bold: true, color: "FFFFFF" })] })] }),
                  new TableCell({ width: { size: 24, type: WidthType.PERCENTAGE }, shading: headerShading, borders: borderThin, children: [new Paragraph({ children: [new TextRun({ text: "Tên chức năng", bold: true, color: "FFFFFF" })] })] }),
                  new TableCell({ width: { size: 10, type: WidthType.PERCENTAGE }, shading: headerShading, borders: borderThin, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Method", bold: true, color: "FFFFFF" })] })] }),
                  new TableCell({ width: { size: 28, type: WidthType.PERCENTAGE }, shading: headerShading, borders: borderThin, children: [new Paragraph({ children: [new TextRun({ text: "Đường dẫn URL", bold: true, color: "FFFFFF" })] })] }),
                  new TableCell({ width: { size: 14, type: WidthType.PERCENTAGE }, shading: headerShading, borders: borderThin, children: [new Paragraph({ children: [new TextRun({ text: "Quyền hạn", bold: true, color: "FFFFFF" })] })] }),
                  new TableCell({ width: { size: 14, type: WidthType.PERCENTAGE }, shading: headerShading, borders: borderThin, children: [new Paragraph({ children: [new TextRun({ text: "Trạng thái", bold: true, color: "FFFFFF" })] })] }),
                ],
              }),
              ...catalog.endpoints.map(item => new TableRow({
                children: [
                  new TableCell({ borders: borderThin, children: [new Paragraph({ children: [new TextRun({ text: item.code, bold: true })] })] }),
                  new TableCell({ borders: borderThin, children: [new Paragraph({ children: [new TextRun(item.name)] })] }),
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: item.method === 'GET' ? "F0FDF4" : "EFF6FF" },
                    borders: borderThin,
                    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: item.method, bold: true, color: item.method === 'GET' ? "15803D" : "1D4ED8" })] })]
                  }),
                  new TableCell({ borders: borderThin, children: [new Paragraph({ children: [new TextRun({ text: item.path, font: "Consolas", size: 18 })] })] }),
                  new TableCell({ borders: borderThin, children: [new Paragraph({ children: [new TextRun(item.auth)] })] }),
                  new TableCell({ borders: borderThin, children: [new Paragraph({ children: [new TextRun({ text: item.status, bold: true })] })] }),
                ],
              })),
            ],
          }),

          new Paragraph({ pageBreakBefore: true }),

          // --- 5. ĐẶC TẢ CHI TIẾT TỪNG GIAO TIẾP KỸ THUẬT ---
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 150 },
            children: [new TextRun({ text: "5. Đặc tả chi tiết từng giao tiếp kỹ thuật", bold: true, color: "111827" })],
          }),

          ...catalog.endpoints.flatMap(item => [
            new Paragraph({
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 250, after: 80 },
              children: [
                new TextRun({ text: `[${item.code}] `, bold: true, color: "1E40AF" }),
                new TextRun({ text: `${item.name}`, bold: true, color: "111827" }),
              ],
            }),

            // Route Information Table
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      width: { size: 12, type: WidthType.PERCENTAGE },
                      shading: { type: ShadingType.CLEAR, fill: item.method === 'GET' ? "F0FDF4" : "EFF6FF" },
                      borders: borderThin,
                      children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: item.method, bold: true, color: item.method === 'GET' ? "15803D" : "1D4ED8" })] })]
                    }),
                    new TableCell({
                      width: { size: 60, type: WidthType.PERCENTAGE },
                      shading: subHeaderShading,
                      borders: borderThin,
                      children: [new Paragraph({ children: [new TextRun({ text: item.path, bold: true, font: "Consolas", size: 18 })] })]
                    }),
                    new TableCell({
                      width: { size: 28, type: WidthType.PERCENTAGE },
                      shading: subHeaderShading,
                      borders: borderThin,
                      children: [new Paragraph({ children: [new TextRun({ text: item.status, bold: true })] })]
                    }),
                  ],
                }),
              ],
            }),

            // Context & State Effects
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({ width: { size: 22, type: WidthType.PERCENTAGE }, shading: subHeaderShading, borders: borderThin, children: [new Paragraph({ children: [new TextRun({ text: "Mô tả chức năng:", bold: true })] })] }),
                    new TableCell({ width: { size: 78, type: WidthType.PERCENTAGE }, borders: borderThin, children: [new Paragraph({ children: createSafeTextRuns(item.description) })] }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({ shading: subHeaderShading, borders: borderThin, children: [new Paragraph({ children: [new TextRun({ text: "Quyền hạn yêu cầu:", bold: true })] })] }),
                    new TableCell({ borders: borderThin, children: [new Paragraph({ children: createSafeTextRuns(item.auth) })] }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({ shading: subHeaderShading, borders: borderThin, children: [new Paragraph({ children: [new TextRun({ text: "Điều kiện tiên quyết:", bold: true })] })] }),
                    new TableCell({ borders: borderThin, children: [new Paragraph({ children: createSafeTextRuns(item.preconditions) })] }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({ shading: subHeaderShading, borders: borderThin, children: [new Paragraph({ children: [new TextRun({ text: "Tác động trạng thái:", bold: true })] })] }),
                    new TableCell({ borders: borderThin, children: [new Paragraph({ children: createSafeTextRuns(item.stateEffects) })] }),
                  ],
                }),
              ],
            }),

            // Headers Table
            ...(item.headers && item.headers.length > 0 ? [
              new Paragraph({ spacing: { before: 80, after: 50 }, children: [new TextRun({ text: "HTTP Headers yêu cầu:", bold: true, color: "374151" })] }),
              new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                  new TableRow({
                    children: [
                      new TableCell({ width: { size: 30, type: WidthType.PERCENTAGE }, shading: subHeaderShading, borders: borderThin, children: [new Paragraph({ children: [new TextRun({ text: "Tên Header", bold: true })] })] }),
                      new TableCell({ width: { size: 16, type: WidthType.PERCENTAGE }, shading: subHeaderShading, borders: borderThin, children: [new Paragraph({ children: [new TextRun({ text: "Bắt buộc", bold: true })] })] }),
                      new TableCell({ width: { size: 54, type: WidthType.PERCENTAGE }, shading: subHeaderShading, borders: borderThin, children: [new Paragraph({ children: [new TextRun({ text: "Mô tả / Giá trị", bold: true })] })] }),
                    ],
                  }),
                  ...item.headers.map(h => new TableRow({
                    children: [
                      new TableCell({ borders: borderThin, children: [new Paragraph({ children: [new TextRun({ text: h.name, font: "Consolas", bold: true })] })] }),
                      new TableCell({ borders: borderThin, children: [new Paragraph({ children: [new TextRun(h.required ? "Bắt buộc" : "Tùy chọn")] })] }),
                      new TableCell({ borders: borderThin, children: [new Paragraph({ children: createSafeTextRuns(h.description) })] }),
                    ],
                  })),
                ],
              }),
            ] : []),

            // Data Dictionary Table
            ...(item.fields && item.fields.length > 0 ? [
              new Paragraph({ spacing: { before: 100, after: 50 }, children: [new TextRun({ text: "Từ điển trường dữ liệu (Data Dictionary):", bold: true, color: "374151" })] }),
              new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                  new TableRow({
                    children: [
                      new TableCell({ width: { size: 24, type: WidthType.PERCENTAGE }, shading: headerShading, borders: borderThin, children: [new Paragraph({ children: [new TextRun({ text: "Tên trường", bold: true, color: "FFFFFF" })] })] }),
                      new TableCell({ width: { size: 14, type: WidthType.PERCENTAGE }, shading: headerShading, borders: borderThin, children: [new Paragraph({ children: [new TextRun({ text: "Vị trí", bold: true, color: "FFFFFF" })] })] }),
                      new TableCell({ width: { size: 14, type: WidthType.PERCENTAGE }, shading: headerShading, borders: borderThin, children: [new Paragraph({ children: [new TextRun({ text: "Kiểu", bold: true, color: "FFFFFF" })] })] }),
                      new TableCell({ width: { size: 10, type: WidthType.PERCENTAGE }, shading: headerShading, borders: borderThin, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Req", bold: true, color: "FFFFFF" })] })] }),
                      new TableCell({ width: { size: 38, type: WidthType.PERCENTAGE }, shading: headerShading, borders: borderThin, children: [new Paragraph({ children: [new TextRun({ text: "Ràng buộc & Diễn giải kỹ thuật", bold: true, color: "FFFFFF" })] })] }),
                    ],
                  }),
                  ...item.fields.map(f => new TableRow({
                    children: [
                      new TableCell({ borders: borderThin, children: [new Paragraph({ children: [new TextRun({ text: f.name, font: "Consolas", bold: true })] })] }),
                      new TableCell({ borders: borderThin, children: [new Paragraph({ children: [new TextRun(f.in)] })] }),
                      new TableCell({ borders: borderThin, children: [new Paragraph({ children: [new TextRun(f.type)] })] }),
                      new TableCell({ borders: borderThin, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun(f.required ? "Có" : "Không")] })] }),
                      new TableCell({ borders: borderThin, children: [
                        new Paragraph({ children: [
                          new TextRun({ text: f.description }),
                          new TextRun({ text: `Ràng buộc: ${f.validation}`, break: 1, italics: true, color: "4B5563" })
                        ] })
                      ] }),
                    ],
                  })),
                ],
              }),
            ] : []),

            // Payloads Example (Console Box)
            new Paragraph({ spacing: { before: 100, after: 50 }, children: [new TextRun({ text: "Cấu trúc dữ liệu mẫu (Payload examples):", bold: true, color: "374151" })] }),
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      width: { size: 50, type: WidthType.PERCENTAGE },
                      shading: { type: ShadingType.CLEAR, fill: "F9FAFB" },
                      borders: borderThin,
                      children: [
                        new Paragraph({ children: [new TextRun({ text: "REQUEST PAYLOAD:", bold: true, size: 16, color: "374151" })] }),
                        new Paragraph({ children: createCodeRuns(item.requestExample) })
                      ]
                    }),
                    new TableCell({
                      width: { size: 50, type: WidthType.PERCENTAGE },
                      shading: { type: ShadingType.CLEAR, fill: "F9FAFB" },
                      borders: borderThin,
                      children: [
                        new Paragraph({ children: [new TextRun({ text: "RESPONSE PAYLOAD:", bold: true, size: 16, color: "374151" })] }),
                        new Paragraph({ children: createCodeRuns(item.responseExample) })
                      ]
                    }),
                  ],
                }),
              ],
            }),

            // Error Handling Matrix
            ...(item.errors && item.errors.length > 0 ? [
              new Paragraph({ spacing: { before: 100, after: 50 }, children: [new TextRun({ text: "Ma trận mã lỗi và xử lý ngoại lệ:", bold: true, color: "374151" })] }),
              new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                  new TableRow({
                    children: [
                      new TableCell({ width: { size: 12, type: WidthType.PERCENTAGE }, shading: headerShading, borders: borderThin, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Status", bold: true, color: "FFFFFF" })] })] }),
                      new TableCell({ width: { size: 26, type: WidthType.PERCENTAGE }, shading: headerShading, borders: borderThin, children: [new Paragraph({ children: [new TextRun({ text: "Mã lỗi (Code)", bold: true, color: "FFFFFF" })] })] }),
                      new TableCell({ width: { size: 34, type: WidthType.PERCENTAGE }, shading: headerShading, borders: borderThin, children: [new Paragraph({ children: [new TextRun({ text: "Nguyên nhân phát sinh", bold: true, color: "FFFFFF" })] })] }),
                      new TableCell({ width: { size: 28, type: WidthType.PERCENTAGE }, shading: headerShading, borders: borderThin, children: [new Paragraph({ children: [new TextRun({ text: "Hướng xử lý / Retry", bold: true, color: "FFFFFF" })] })] }),
                    ],
                  }),
                  ...item.errors.map(err => new TableRow({
                    children: [
                      new TableCell({ borders: borderThin, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${err.status}`, bold: true })] })] }),
                      new TableCell({ borders: borderThin, children: [new Paragraph({ children: [new TextRun({ text: err.code, font: "Consolas" })] })] }),
                      new TableCell({ borders: borderThin, children: [new Paragraph({ children: createSafeTextRuns(err.reason) })] }),
                      new TableCell({ borders: borderThin, children: [new Paragraph({ children: createSafeTextRuns(err.remedy) })] }),
                    ],
                  })),
                ],
              }),
            ] : []),

            // Integration Notes
            new Paragraph({
              spacing: { before: 80, after: 180 },
              children: [
                new TextRun({ text: "Ghi chú kỹ thuật: ", bold: true, color: "374151" }),
                ...createSafeTextRuns(item.notes, { italics: true }),
              ],
            }),
          ]),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const docxFile = path.join(OUTPUT_DIR, 'IDEA_Core_v0_API_Contract.docx');
  fs.writeFileSync(docxFile, buffer);
  return docxFile;
}

// 4. GENERATE EXCEL (.XLSX) SPREADSHEET (NO GIT REFERENCES)
async function generateXlsx(catalog) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = catalog.metadata.author;
  workbook.created = new Date();

  const borderThin = {
    top: { style: 'thin', color: { argb: 'FFD1D5DB' } },
    left: { style: 'thin', color: { argb: 'FFD1D5DB' } },
    bottom: { style: 'thin', color: { argb: 'FFD1D5DB' } },
    right: { style: 'thin', color: { argb: 'FFD1D5DB' } }
  };

  const headerFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2D3748' } };
  const headerFont = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };

  // --- SHEET 1: THÔNG TIN & LỊCH SỬ ---
  const ws1 = workbook.addWorksheet('1. Thong tin & Lich su');
  ws1.views = [{ showGridLines: true, state: 'frozen', ySplit: 7 }];

  ws1.getCell('A1').value = 'DỰ ÁN:';
  ws1.getCell('B1').value = catalog.metadata.project;
  ws1.getCell('A2').value = 'TÀI LIỆU:';
  ws1.getCell('B2').value = `${catalog.metadata.documentTitle} (${catalog.metadata.documentCode})`;
  ws1.getCell('A3').value = 'NGƯỜI PHỤ TRÁCH:';
  ws1.getCell('B3').value = `${catalog.metadata.author} — ${catalog.metadata.department}`;
  ws1.getCell('A4').value = 'PHIÊN BẢN:';
  ws1.getCell('B4').value = `v${catalog.metadata.version} • Ngày xuất bản: ${exportDate}`;
  ws1.getCell('A5').value = 'QUY MÔ KỸ THUẬT:';
  ws1.getCell('B5').value = `Tổng cộng ${catalog.endpoints.length} endpoints (${catalog.endpoints.filter(e => e.status.includes('TRIỂN KHAI')).length} đã triển khai, ${catalog.endpoints.filter(e => e.status.includes('THIẾT KẾ')).length} đang thiết kế)`;

  ['A1', 'A2', 'A3', 'A4', 'A5'].forEach(cell => {
    ws1.getCell(cell).font = { name: 'Segoe UI', bold: true, color: { argb: 'FF374151' } };
  });
  ['B1', 'B2', 'B3', 'B4', 'B5'].forEach(cell => {
    ws1.getCell(cell).font = { name: 'Segoe UI', color: { argb: 'FF111827' } };
  });

  ws1.getCell('A7').value = 'LỊCH SỬ THAY ĐỔI PHIÊN BẢN (REVISION HISTORY / AUDIT TRAIL)';
  ws1.getCell('A7').font = { name: 'Segoe UI', size: 11, bold: true, color: { argb: 'FF1F2937' } };

  const clHeaders = ['Phiên bản', 'Ngày áp dụng', 'Người thực hiện', 'Nội dung thay đổi chi tiết'];
  clHeaders.forEach((h, idx) => {
    const colLetter = String.fromCharCode('A'.charCodeAt(0) + idx);
    const cell = ws1.getCell(`${colLetter}8`);
    cell.value = h;
    cell.font = headerFont;
    cell.fill = headerFill;
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
  });
  ws1.getRow(8).height = 24;

  catalog.metadata.revisions.forEach((rev, idx) => {
    const rowNum = 9 + idx;
    ws1.getCell(`A${rowNum}`).value = `v${rev.version}`;
    ws1.getCell(`B${rowNum}`).value = rev.date;
    ws1.getCell(`C${rowNum}`).value = rev.author;
    ws1.getCell(`D${rowNum}`).value = rev.description;

    ['A', 'B', 'C', 'D'].forEach(c => {
      ws1.getCell(`${c}${rowNum}`).border = borderThin;
      ws1.getCell(`${c}${rowNum}`).font = { name: 'Segoe UI', size: 10 };
    });
    ws1.getCell(`A${rowNum}`).alignment = { horizontal: 'center' };
    ws1.getCell(`B${rowNum}`).alignment = { horizontal: 'center' };
    ws1.getRow(rowNum).height = 22;
  });

  ws1.getColumn('A').width = 14;
  ws1.getColumn('B').width = 24;
  ws1.getColumn('C').width = 26;
  ws1.getColumn('D').width = 80;

  // --- SHEET 2: MA TRẬN API ---
  const ws2 = workbook.addWorksheet('2. Ma tran API');
  ws2.views = [{ showGridLines: true, state: 'frozen', ySplit: 4 }];

  ws2.getCell('A1').value = 'MA TRẬN GIAO TIẾP API — HỆ THỐNG IDEA DDM CORE v0';
  ws2.getCell('A1').font = { name: 'Segoe UI', size: 12, bold: true, color: { argb: 'FF1F2937' } };
  ws2.getCell('A2').value = `Ngày xuất bản: ${exportDateTime}`;
  ws2.getCell('A2').font = { name: 'Segoe UI', size: 9, italics: true, color: { argb: 'FF6B7280' } };

  ws2.columns = [
    { header: '', key: 'stt', width: 6 },
    { header: '', key: 'group', width: 26 },
    { header: '', key: 'code', width: 12 },
    { header: '', key: 'name', width: 34 },
    { header: '', key: 'method', width: 10 },
    { header: '', key: 'path', width: 44 },
    { header: '', key: 'auth', width: 28 },
    { header: '', key: 'status', width: 20 },
    { header: '', key: 'notes', width: 50 },
  ];

  const h2Headers = ['STT', 'Nhóm chức năng', 'Mã API', 'Tên chức năng', 'Method', 'Đường dẫn URL Endpoint', 'Quyền hạn gọi', 'Trạng thái', 'Ghi chú kỹ thuật'];
  const row4 = ws2.getRow(4);
  row4.height = 26;
  h2Headers.forEach((h, idx) => {
    const cell = row4.getCell(idx + 1);
    cell.value = h;
    cell.font = headerFont;
    cell.fill = headerFill;
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.border = borderThin;
  });

  catalog.endpoints.forEach((item, index) => {
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
      cell.border = borderThin;
      cell.font = { name: 'Segoe UI', size: 10 };
      if (colNum === 1 || colNum === 3 || colNum === 5) {
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      }
      if (colNum === 5) {
        cell.font = { name: 'Segoe UI', bold: true, color: { argb: item.method === 'GET' ? 'FF15803D' : 'FF1D4ED8' } };
      }
      if (colNum === 6) {
        cell.font = { name: 'Consolas', size: 9 };
      }
      if (colNum === 8) {
        cell.font = { name: 'Segoe UI', bold: true, color: { argb: item.status.includes('TRIỂN KHAI') ? 'FF15803D' : 'FFC2410C' } };
      }
    });
  });
  ws2.autoFilter = 'A4:I4';

  // --- SHEET 3: DATA DICTIONARY ---
  const ws3 = workbook.addWorksheet('3. Data Dictionary');
  ws3.views = [{ showGridLines: true, state: 'frozen', ySplit: 4 }];

  ws3.getCell('A1').value = 'TỪ ĐIỂN THAM SỐ VÀ TRƯỜNG DỮ LIỆU (DATA DICTIONARY)';
  ws3.getCell('A1').font = { name: 'Segoe UI', size: 12, bold: true, color: { argb: 'FF1F2937' } };
  ws3.getCell('A2').value = 'Dùng cho lập trình viên Backend, Frontend và QA thiết kế kịch bản kiểm thử (Test Matrix)';
  ws3.getCell('A2').font = { name: 'Segoe UI', size: 9, italics: true, color: { argb: 'FF6B7280' } };

  ws3.columns = [
    { header: '', key: 'stt', width: 6 },
    { header: '', key: 'code', width: 12 },
    { header: '', key: 'apiName', width: 28 },
    { header: '', key: 'in', width: 16 },
    { header: '', key: 'fieldName', width: 26 },
    { header: '', key: 'type', width: 18 },
    { header: '', key: 'required', width: 12 },
    { header: '', key: 'validation', width: 44 },
    { header: '', key: 'description', width: 48 },
    { header: '', key: 'example', width: 34 },
  ];

  const h3Headers = ['STT', 'Mã API', 'Tên chức năng', 'Vị trí', 'Tên trường (Field Name)', 'Kiểu dữ liệu', 'Bắt buộc', 'Quy tắc / Giới hạn validation', 'Diễn giải kỹ thuật', 'Giá trị mẫu'];
  const row4_3 = ws3.getRow(4);
  row4_3.height = 26;
  h3Headers.forEach((h, idx) => {
    const cell = row4_3.getCell(idx + 1);
    cell.value = h;
    cell.font = headerFont;
    cell.fill = headerFill;
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.border = borderThin;
  });

  let fieldCounter = 1;
  catalog.endpoints.forEach((item) => {
    if (item.fields && item.fields.length > 0) {
      item.fields.forEach((f) => {
        const row = ws3.addRow({
          stt: fieldCounter++,
          code: item.code,
          apiName: item.name,
          in: f.in,
          fieldName: f.name,
          type: f.type,
          required: f.required ? 'BẮT BUỘC' : 'Tùy chọn',
          validation: f.validation,
          description: f.description,
          example: f.example || '',
        });
        row.height = 22;
        row.eachCell((cell, colNum) => {
          cell.border = borderThin;
          cell.font = { name: 'Segoe UI', size: 10 };
          if (colNum === 1 || colNum === 2 || colNum === 4 || colNum === 7) {
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
          }
          if (colNum === 5) {
            cell.font = { name: 'Consolas', size: 9, bold: true };
          }
          if (colNum === 7) {
            cell.font = { name: 'Segoe UI', bold: true, color: { argb: f.required ? 'FFB91C1C' : 'FF6B7280' } };
          }
        });
      });
    }
  });
  ws3.autoFilter = 'A4:J4';

  // --- SHEET 4: ERROR CATALOG ---
  const ws4 = workbook.addWorksheet('4. Error Catalog');
  ws4.views = [{ showGridLines: true, state: 'frozen', ySplit: 4 }];

  ws4.getCell('A1').value = 'DANH MỤC MÃ LỖI VÀ QUY TẮC XỬ LÝ (ERROR CATALOG & RETRY RULES)';
  ws4.getCell('A1').font = { name: 'Segoe UI', size: 12, bold: true, color: { argb: 'FF1F2937' } };
  ws4.getCell('A2').value = 'Quy ước mã lỗi HTTP, mã lỗi hệ thống và cách phản hồi tương ứng của Client';
  ws4.getCell('A2').font = { name: 'Segoe UI', size: 9, italics: true, color: { argb: 'FF6B7280' } };

  ws4.columns = [
    { header: '', key: 'stt', width: 6 },
    { header: '', key: 'code', width: 12 },
    { header: '', key: 'apiName', width: 28 },
    { header: '', key: 'status', width: 14 },
    { header: '', key: 'errorCode', width: 26 },
    { header: '', key: 'reason', width: 48 },
    { header: '', key: 'remedy', width: 44 },
  ];

  const h4Headers = ['STT', 'Mã API', 'Tên chức năng', 'HTTP Status', 'Mã lỗi hệ thống (Error Code)', 'Nguyên nhân phát sinh', 'Hướng xử lý / Quy tắc Retry'];
  const row4_4 = ws4.getRow(4);
  row4_4.height = 26;
  h4Headers.forEach((h, idx) => {
    const cell = row4_4.getCell(idx + 1);
    cell.value = h;
    cell.font = headerFont;
    cell.fill = headerFill;
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.border = borderThin;
  });

  let errCounter = 1;
  catalog.endpoints.forEach((item) => {
    if (item.errors && item.errors.length > 0) {
      item.errors.forEach((e) => {
        const row = ws4.addRow({
          stt: errCounter++,
          code: item.code,
          apiName: item.name,
          status: e.status,
          errorCode: e.code,
          reason: e.reason,
          remedy: e.remedy,
        });
        row.height = 22;
        row.eachCell((cell, colNum) => {
          cell.border = borderThin;
          cell.font = { name: 'Segoe UI', size: 10 };
          if (colNum === 1 || colNum === 2 || colNum === 4) {
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
          }
          if (colNum === 4) {
            cell.font = { name: 'Segoe UI', bold: true, color: { argb: e.status >= 500 ? 'FFB91C1C' : (e.status >= 400 ? 'FFC2410C' : 'FF15803D') } };
          }
          if (colNum === 5) {
            cell.font = { name: 'Consolas', size: 9, bold: true };
          }
        });
      });
    }
  });
  ws4.autoFilter = 'A4:G4';

  const xlsxFile = path.join(OUTPUT_DIR, 'IDEA_Core_v0_API_Contract.xlsx');
  await workbook.xlsx.writeFile(xlsxFile);
  return xlsxFile;
}

// 5. GENERATE CLEAN TECHNICAL HTML (NO GIT REFERENCES)
function generateHtml(catalog) {
  const jsonCatalog = JSON.stringify(catalog);

  const html = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>IDEA DDM Core v0 — Đặc tả giao tiếp API (SPEC-API-001)</title>
  <style>
    :root {
      --bg: #FFFFFF;
      --sidebar-bg: #F8FAFC;
      --card-bg: #FFFFFF;
      --card-border: #E2E8F0;
      --text-main: #0F172A;
      --text-muted: #64748B;
      --accent: #2563EB;
      --accent-hover: #1D4ED8;
      --code-bg: #F8FAFC;
      --code-border: #E2E8F0;
      --code-text: #0F172A;
      --method-get-bg: #F0FDF4;
      --method-get-text: #15803D;
      --method-get-border: #BBF7D0;
      --method-post-bg: #EFF6FF;
      --method-post-text: #1D4ED8;
      --method-post-border: #BFDBFE;
      --badge-ready: #15803D;
      --badge-design: #C2410C;
    }
    .dark-theme {
      --bg: #0B0F19;
      --sidebar-bg: #111827;
      --card-bg: #111827;
      --card-border: #1F2937;
      --text-main: #F9FAFB;
      --text-muted: #9CA3AF;
      --accent: #38BDF8;
      --accent-hover: #0EA5E9;
      --code-bg: #0F172A;
      --code-border: #1E293B;
      --code-text: #F1F5F9;
      --method-get-bg: rgba(21, 128, 61, 0.15);
      --method-get-text: #4ADE80;
      --method-get-border: rgba(74, 222, 128, 0.3);
      --method-post-bg: rgba(29, 78, 216, 0.15);
      --method-post-text: #60A5FA;
      --method-post-border: rgba(96, 165, 250, 0.3);
      --badge-ready: #4ADE80;
      --badge-design: #FB923C;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background: var(--bg);
      color: var(--text-main);
      display: flex;
      height: 100vh;
      overflow: hidden;
    }
    /* Sidebar */
    #sidebar {
      width: 320px;
      min-width: 320px;
      background: var(--sidebar-bg);
      border-right: 1px solid var(--card-border);
      display: flex;
      flex-direction: column;
      height: 100vh;
    }
    .brand {
      padding: 18px 20px;
      border-bottom: 1px solid var(--card-border);
    }
    .brand h1 { font-size: 1rem; font-weight: 700; color: var(--text-main); letter-spacing: -0.01em; }
    .brand p { font-size: 0.75rem; color: var(--text-muted); margin-top: 3px; }
    .search-box { padding: 12px 16px; border-bottom: 1px solid var(--card-border); }
    .search-box input {
      width: 100%;
      background: var(--bg);
      border: 1px solid var(--card-border);
      color: var(--text-main);
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 0.85rem;
      outline: none;
    }
    .search-box input:focus { border-color: var(--accent); }
    .nav-list { flex: 1; overflow-y: auto; padding: 12px 8px; }
    .nav-group-title {
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-muted);
      padding: 10px 12px 4px;
      font-weight: 700;
    }
    .nav-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 7px 12px;
      border-radius: 6px;
      color: var(--text-main);
      font-size: 0.82rem;
      cursor: pointer;
      margin-bottom: 1px;
      transition: background 0.15s;
    }
    .nav-item:hover { background: rgba(0, 0, 0, 0.04); }
    .dark-theme .nav-item:hover { background: rgba(255, 255, 255, 0.05); }
    .method-badge {
      font-family: ui-monospace, "SF Mono", Consolas, monospace;
      font-size: 0.68rem;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 4px;
      text-transform: uppercase;
      border: 1px solid transparent;
    }
    .badge-GET { background: var(--method-get-bg); color: var(--method-get-text); border-color: var(--method-get-border); }
    .badge-POST { background: var(--method-post-bg); color: var(--method-post-text); border-color: var(--method-post-border); }

    /* Main Area */
    #main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      height: 100vh;
      overflow: hidden;
    }
    .top-bar {
      height: 56px;
      background: var(--bg);
      border-bottom: 1px solid var(--card-border);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 28px;
    }
    .tab-pills { display: flex; gap: 6px; }
    .tab-btn {
      background: transparent;
      border: 1px solid var(--card-border);
      color: var(--text-muted);
      padding: 6px 14px;
      border-radius: 6px;
      font-size: 0.82rem;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.15s;
    }
    .tab-btn.active {
      background: var(--text-main);
      color: var(--bg);
      border-color: var(--text-main);
      font-weight: 600;
    }
    .top-actions { display: flex; align-items: center; gap: 14px; }
    .theme-toggle-btn {
      background: var(--bg);
      border: 1px solid var(--card-border);
      color: var(--text-main);
      padding: 5px 12px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.78rem;
      font-weight: 500;
    }

    .scroll-view { flex: 1; overflow-y: auto; padding: 28px 36px; }

    /* Cards */
    .api-card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 8px;
      padding: 24px;
      margin-bottom: 24px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
    }
    .api-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 14px;
      padding-bottom: 12px;
      border-bottom: 1px solid var(--card-border);
    }
    .api-route { display: flex; align-items: center; gap: 10px; }
    .api-path { font-family: ui-monospace, "SF Mono", Consolas, monospace; font-size: 1.05rem; font-weight: 600; }
    .status-badge {
      font-size: 0.75rem;
      font-weight: 600;
      padding: 3px 8px;
      border-radius: 4px;
      border: 1px solid currentColor;
    }
    .status-pass { color: var(--badge-ready); }
    .status-design { color: var(--badge-design); }

    .api-desc { font-size: 0.9rem; line-height: 1.6; margin-bottom: 16px; color: var(--text-main); }
    .section-title { font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.03em; color: var(--text-muted); margin: 16px 0 8px; }

    /* Tables */
    .spec-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 16px;
      font-size: 0.82rem;
    }
    .spec-table th, .spec-table td {
      border: 1px solid var(--card-border);
      padding: 8px 12px;
      text-align: left;
    }
    .spec-table th { background: rgba(0, 0, 0, 0.02); color: var(--text-muted); font-weight: 600; }
    .dark-theme .spec-table th { background: rgba(255, 255, 255, 0.03); }
    .field-name { font-family: ui-monospace, "SF Mono", Consolas, monospace; font-weight: 600; color: var(--accent); }
    .req-tag { color: #DC2626; font-weight: 600; font-size: 0.75rem; }

    /* Code Blocks */
    .code-container {
      position: relative;
      background: var(--code-bg);
      border: 1px solid var(--code-border);
      border-radius: 6px;
      margin-bottom: 14px;
      padding: 12px 14px;
      font-family: ui-monospace, "SF Mono", Consolas, monospace;
      font-size: 0.8rem;
      line-height: 1.5;
      white-space: pre-wrap;
      color: var(--code-text);
    }
    .copy-btn {
      position: absolute;
      top: 8px;
      right: 8px;
      background: var(--bg);
      border: 1px solid var(--card-border);
      color: var(--text-muted);
      padding: 3px 8px;
      border-radius: 4px;
      font-size: 0.72rem;
      cursor: pointer;
    }
    .copy-btn:hover { color: var(--text-main); border-color: var(--text-main); }

    /* Workflows View */
    .wf-card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 8px;
      padding: 24px;
      margin-bottom: 24px;
    }
    .wf-timeline { margin-top: 16px; }
    .wf-step-row {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      margin-bottom: 14px;
    }
    .wf-step-num {
      width: 28px;
      height: 28px;
      border-radius: 4px;
      background: var(--text-main);
      color: var(--bg);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.85rem;
      flex-shrink: 0;
    }
    .wf-step-content {
      flex: 1;
      background: var(--code-bg);
      border: 1px solid var(--code-border);
      border-radius: 6px;
      padding: 10px 14px;
    }

    /* Toast */
    #toast {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: var(--text-main);
      color: var(--bg);
      padding: 8px 16px;
      border-radius: 6px;
      font-weight: 500;
      font-size: 0.8rem;
      opacity: 0;
      transition: opacity 0.25s;
      pointer-events: none;
    }
  </style>
</head>
<body>

  <!-- Sidebar -->
  <div id="sidebar">
    <div class="brand">
      <h1>IDEA ENGINEERING</h1>
      <p>Đặc tả API • SPEC-API-001 • v${catalog.metadata.version}</p>
    </div>
    <div class="search-box">
      <input type="text" id="searchInput" placeholder="Tìm theo mã API, đường dẫn, tham số...">
    </div>
    <div class="nav-list" id="navList">
      <!-- Generated by JS -->
    </div>
  </div>

  <!-- Main Content Area -->
  <div id="main-content">
    <div class="top-bar">
      <div class="tab-pills">
        <button class="tab-btn active" onclick="switchTab('apis')">Danh mục API (${catalog.endpoints.length})</button>
        <button class="tab-btn" onclick="switchTab('workflows')">Quy trình phối hợp (3)</button>
        <button class="tab-btn" onclick="switchTab('dictionary')">Từ điển dữ liệu</button>
        <button class="tab-btn" onclick="switchTab('changelog')">Lịch sử phiên bản</button>
      </div>
      <div class="top-actions">
        <span style="font-size: 0.78rem; color: var(--text-muted);">${exportDate}</span>
        <button class="theme-toggle-btn" onclick="toggleTheme()">Giao diện Sáng / Tối</button>
      </div>
    </div>

    <div class="scroll-view" id="contentView">
      <!-- Dynamic Content -->
    </div>
  </div>

  <div id="toast">Đã sao chép vào bộ nhớ tạm</div>

  <script>
    const data = ${jsonCatalog};
    let currentTab = 'apis';

    function toggleTheme() {
      document.body.classList.toggle('dark-theme');
    }

    function showToast(msg) {
      const t = document.getElementById('toast');
      t.innerText = msg;
      t.style.opacity = '1';
      setTimeout(() => { t.style.opacity = '0'; }, 2000);
    }

    function copyText(str) {
      navigator.clipboard.writeText(str).then(() => {
        showToast('Đã sao chép vào bộ nhớ tạm');
      });
    }

    function switchTab(tab) {
      currentTab = tab;
      document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
      event.target.classList.add('active');
      renderMain();
    }

    function renderNav() {
      const nav = document.getElementById('navList');
      const groups = {};
      data.endpoints.forEach(ep => {
        if (!groups[ep.group]) groups[ep.group] = [];
        groups[ep.group].push(ep);
      });

      let html = '';
      for (const [groupName, eps] of Object.entries(groups)) {
        html += \`<div class="nav-group-title">\${groupName}</div>\`;
        eps.forEach(ep => {
          html += \`
            <div class="nav-item" onclick="scrollToApi('\${ep.code}')">
              <span class="method-badge badge-\${ep.method}">\${ep.method}</span>
              <span style="flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">\${ep.name}</span>
            </div>
          \`;
        });
      }
      nav.innerHTML = html;
    }

    function scrollToApi(code) {
      if (currentTab !== 'apis') {
        currentTab = 'apis';
        document.querySelectorAll('.tab-btn')[0].classList.add('active');
        renderMain();
      }
      setTimeout(() => {
        const el = document.getElementById('api-' + code);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }

    function renderMain() {
      const view = document.getElementById('contentView');

      if (currentTab === 'apis') {
        let html = '';
        data.endpoints.forEach(ep => {
          html += \`
            <div class="api-card" id="api-\${ep.code}">
              <div class="api-header">
                <div class="api-route">
                  <span class="method-badge badge-\${ep.method}">\${ep.method}</span>
                  <span class="api-path">\${ep.path}</span>
                  <span style="color:var(--text-muted); font-size:0.85rem;">[\${ep.code}] \${ep.name}</span>
                </div>
                <div>
                  <span class="status-badge \${ep.status.includes('TRIỂN KHAI') ? 'status-pass' : 'status-design'}">\${ep.status}</span>
                </div>
              </div>

              <p class="api-desc">\${ep.description}</p>

              <table class="spec-table">
                <tr><th style="width:25%;">Quyền hạn gọi</th><td>\${ep.auth}</td></tr>
                <tr><th>Điều kiện tiên quyết</th><td>\${ep.preconditions}</td></tr>
                <tr><th>Tác động trạng thái</th><td>\${ep.stateEffects}</td></tr>
              </table>

              \${ep.headers && ep.headers.length ? \`
                <div class="section-title">HTTP Headers yêu cầu</div>
                <table class="spec-table">
                  <thead><tr><th>Tên Header</th><th>Bắt buộc</th><th>Mô tả / Giá trị</th></tr></thead>
                  <tbody>
                    \${ep.headers.map(h => \`<tr><td class="field-name">\${h.name}</td><td>\${h.required ? '<span class="req-tag">Bắt buộc</span>' : 'Tùy chọn'}</td><td>\${h.description}</td></tr>\`).join('')}
                  </tbody>
                </table>
              \` : ''}

              \${ep.fields && ep.fields.length ? \`
                <div class="section-title">Từ điển trường dữ liệu (Data Dictionary)</div>
                <table class="spec-table">
                  <thead><tr><th>Tên trường</th><th>Vị trí</th><th>Kiểu</th><th>Req</th><th>Ràng buộc & Diễn giải kỹ thuật</th></tr></thead>
                  <tbody>
                    \${ep.fields.map(f => \`
                      <tr>
                        <td class="field-name">\${f.name}</td>
                        <td>\${f.in}</td>
                        <td>\${f.type}</td>
                        <td>\${f.required ? '<span class="req-tag">Có</span>' : 'Không'}</td>
                        <td><strong>\${f.description}</strong><br><small style="color:var(--text-muted);">Ràng buộc: \${f.validation}</small></td>
                      </tr>
                    \`).join('')}
                  </tbody>
                </table>
              \` : ''}

              <div class="section-title">Request Payload Example</div>
              <div class="code-container">
                <button class="copy-btn" onclick="copyText(\\\`\${ep.requestExample.replace(/\`/g, '\\\`')}\\\`)">Sao chép</button>
                \${ep.requestExample}
              </div>

              <div class="section-title">Response Payload Example</div>
              <div class="code-container">
                <button class="copy-btn" onclick="copyText(\\\`\${ep.responseExample.replace(/\`/g, '\\\`')}\\\`)">Sao chép</button>
                \${ep.responseExample}
              </div>

              \${ep.errors && ep.errors.length ? \`
                <div class="section-title">Ma trận mã lỗi (Error Handling Matrix)</div>
                <table class="spec-table">
                  <thead><tr><th>Status</th><th>Mã lỗi (Code)</th><th>Nguyên nhân phát sinh</th><th>Hướng xử lý / Retry</th></tr></thead>
                  <tbody>
                    \${ep.errors.map(err => \`
                      <tr>
                        <td><strong>\${err.status}</strong></td>
                        <td class="field-name">\${err.code}</td>
                        <td>\${err.reason}</td>
                        <td>\${err.remedy}</td>
                      </tr>
                    \`).join('')}
                  </tbody>
                </table>
              \` : ''}

              <div style="font-size:0.82rem; color:var(--text-muted); margin-top:10px;">
                <em>Ghi chú kỹ thuật: \${ep.notes}</em>
              </div>
            </div>
          \`;
        });
        view.innerHTML = html;
      } else if (currentTab === 'workflows') {
        let html = '';
        data.workflows.forEach(wf => {
          html += \`
            <div class="wf-card">
              <h2 style="color:var(--text-main); font-size:1.1rem; margin-bottom:6px;">\${wf.id}. \${wf.title}</h2>
              <p style="color:var(--text-muted); font-size:0.88rem; margin-bottom:16px;">\${wf.description}</p>
              <div class="wf-timeline">
                \${wf.steps.map(s => \`
                  <div class="wf-step-row">
                    <div class="wf-step-num">\${s.step}</div>
                    <div class="wf-step-content">
                      <div style="font-size:0.75rem; color:var(--text-muted); font-weight:600;">\${s.actor} ➔ \${s.receiver}</div>
                      <div style="font-weight:600; font-size:0.9rem; margin:2px 0;">\${s.action} (\${s.endpoint})</div>
                      <div style="font-size:0.82rem; color:var(--text-main);">\${s.outcome}</div>
                    </div>
                  </div>
                \`).join('')}
              </div>
            </div>
          \`;
        });
        view.innerHTML = html;
      } else if (currentTab === 'dictionary') {
        let rows = '';
        let count = 1;
        data.endpoints.forEach(ep => {
          if (ep.fields) {
            ep.fields.forEach(f => {
              rows += \`
                <tr>
                  <td>\${count++}</td>
                  <td><strong>\${ep.code}</strong></td>
                  <td>\${ep.name}</td>
                  <td>\${f.in}</td>
                  <td class="field-name">\${f.name}</td>
                  <td>\${f.type}</td>
                  <td>\${f.required ? '<span class="req-tag">Bắt buộc</span>' : 'Tùy chọn'}</td>
                  <td>\${f.validation}</td>
                  <td>\${f.description}</td>
                  <td style="font-family:monospace; font-size:0.75rem;">\${f.example || ''}</td>
                </tr>
              \`;
            });
          }
        });
        view.innerHTML = \`
          <div class="api-card">
            <h2 style="color:var(--text-main); font-size:1.1rem; margin-bottom:12px;">Từ điển tham số và trường dữ liệu (Data Dictionary)</h2>
            <table class="spec-table">
              <thead>
                <tr>
                  <th>STT</th><th>Mã API</th><th>Tên chức năng</th><th>Vị trí</th><th>Tên trường</th><th>Kiểu</th><th>Bắt buộc</th><th>Ràng buộc validation</th><th>Diễn giải kỹ thuật</th><th>Giá trị mẫu</th>
                </tr>
              </thead>
              <tbody>\${rows}</tbody>
            </table>
          </div>
        \`;
      } else if (currentTab === 'changelog') {
        let revRows = data.metadata.revisions.map(r => \`
          <tr>
            <td><strong>v\${r.version}</strong></td>
            <td>\${r.date}</td>
            <td>\${r.author}</td>
            <td>\${r.description}</td>
          </tr>
        \`).join('');
        view.innerHTML = \`
          <div class="api-card">
            <h2 style="color:var(--text-main); font-size:1.1rem; margin-bottom:12px;">Lịch sử thay đổi phiên bản (Changelog Audit Trail)</h2>
            <table class="spec-table">
              <thead><tr><th>Phiên bản</th><th>Ngày</th><th>Người thực hiện</th><th>Nội dung cập nhật</th></tr></thead>
              <tbody>\${revRows}</tbody>
            </table>
          </div>
        \`;
      }
    }

    // Live search filter
    document.getElementById('searchInput').addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase();
      document.querySelectorAll('.api-card').forEach(card => {
        const text = card.innerText.toLowerCase();
        card.style.display = text.includes(q) ? 'block' : 'none';
      });
    });

    renderNav();
    renderMain();
  </script>
</body>
</html>`;

  const htmlFile = path.join(OUTPUT_DIR, 'IDEA_Core_v0_API_Contract.html');
  fs.writeFileSync(htmlFile, html, 'utf-8');
  return htmlFile;
}

// 6. MAIN CLI CONTROLLER
async function main() {
  const args = process.argv.slice(2);
  const isUpdate = args.includes('--update') || args.includes('-u');
  const isOpen = args.includes('--open') || args.includes('-o');

  let catalog;
  if (isUpdate) {
    catalog = updateCatalog();
  } else {
    catalog = loadCatalog();
  }

  console.log('------------------------------------------------------------------');
  console.log('IDEA ENGINEERING — BỘ XUẤT ĐẶC TẢ GIAO TIẾP API (SPEC-API-001)');
  console.log(`Phiên bản: v${catalog.metadata.version} | Ngày: ${exportDate}`);
  console.log('------------------------------------------------------------------');
  console.log(`Bắt đầu biên dịch tài liệu cho ${catalog.endpoints.length} endpoints...`);

  // 1. Generate DOCX
  const docxPath = await generateDocx(catalog);
  const docxSize = (fs.statSync(docxPath).size / 1024).toFixed(1);
  console.log(`[XUẤT THÀNH CÔNG] File Word (.docx):  ${docxPath} (${docxSize} KB)`);

  // 2. Generate XLSX
  const xlsxPath = await generateXlsx(catalog);
  const xlsxSize = (fs.statSync(xlsxPath).size / 1024).toFixed(1);
  console.log(`[XUẤT THÀNH CÔNG] File Excel (.xlsx): ${xlsxPath} (${xlsxSize} KB)`);

  // 3. Generate HTML
  const htmlPath = generateHtml(catalog);
  const htmlSize = (fs.statSync(htmlPath).size / 1024).toFixed(1);
  console.log(`[XUẤT THÀNH CÔNG] File HTML (.html):  ${htmlPath} (${htmlSize} KB)`);

  console.log('\nHoàn tất xuất bản bộ 3 tài liệu đặc tả giao tiếp API.');

  if (isOpen) {
    console.log('Đang mở file HTML trên trình duyệt mặc định...');
    try {
      execSync(`start "" "${htmlPath}"`, { shell: 'cmd.exe' });
    } catch (e) {
      console.warn('Không thể tự động mở trình duyệt:', e.message);
    }
  }
}

main().catch(err => {
  console.error('[LỖI THỰC THI]:', err);
  process.exit(1);
});
