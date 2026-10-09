import fs from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { checkContract, sourceHashes, json, stableJSON } from './contract.mjs';

const __filename = fileURLToPath(import.meta.url);
const TOOL_DIR = path.dirname(__filename);
const REPO_ROOT = path.resolve(TOOL_DIR, '../..');
const CATALOG_PATH = path.join(TOOL_DIR, 'data/api-catalog.json');
let DATA_DIR, OUTPUT_DIR, ARCHIVE_DIR, exportDate, exportDateTime;
let Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, HeadingLevel, AlignmentType, BorderStyle, WidthType, ShadingType, ImageRun, Header, Footer, PageNumber, ExcelJS;

function loadCatalog() {
  return json(CATALOG_PATH);
}

// The old exporter still consumes its editorial catalog. These declared sources
// now supply the missing current HTTP adapters instead of only logging route counts.
function crawlRepository(packet) {
  console.log('--- ĐỐI SOÁT NGUỒN API ---');
  for (const source of packet.config.surfaces) console.log('[SOURCE] ' + source.openapi);
  for (const source of new Set(packet.operations.map(entry=>entry.contract.semanticSource)))
    console.log('[SEMANTIC] ' + source);
  console.log('[DESIGN] ' + packet.config.designSource);
  return packet.catalog;
}

function smartMergeCatalog(catalog, sources) {
  const existing = new Map(catalog.endpoints.map(entry=>[entry.code,entry]));
  const newCount = sources.endpoints.filter(entry=>!existing.has(entry.code)).length;
  const updatedCount = sources.endpoints.filter(entry=>existing.has(entry.code)
    && stableJSON(existing.get(entry.code)) !== stableJSON(entry)).length;
  catalog.endpoints = sources.endpoints;
  catalog.provenance = sources.provenance;
  if (newCount) {
    const versions = [catalog.metadata.version,...catalog.metadata.revisions.map(entry=>entry.version)]
      .map(Number).filter(Number.isFinite);
    catalog.metadata.version = (Math.max(...versions) + 0.1).toFixed(1);
    catalog.metadata.documentCode = catalog.metadata.documentCode.replace(/Phiên bản [\d.]+/,
      'Phiên bản ' + catalog.metadata.version);
    catalog.metadata.revisions.push({
      version:catalog.metadata.version,date:new Date().toLocaleDateString('vi-VN'),
      author:'Codex',description:'Bổ sung ' + newCount + ' API/thẻ từ nguồn đã đối soát; giữ nội dung biên tập của catalog cũ.'
    });
  }
  const text = stableJSON(catalog);
  if (fs.readFileSync(CATALOG_PATH,'utf8').replace(/\r\n/g,'\n') !== text) {
    fs.writeFileSync(CATALOG_PATH + '.tmp',text);
    fs.renameSync(CATALOG_PATH + '.tmp',CATALOG_PATH);
  }
  console.log('[SMART MERGE] Cập nhật ' + updatedCount + ' mục, bổ sung ' + newCount + ' mục; giữ metadata/lịch sử và diễn giải.');
  return catalog;
}

function escapeHTML(value) {
  return String(value ?? '').replace(/[&<>"']/g, char =>
    ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
}
// Helper to convert multiline strings safely into OpenXML TextRuns (no literal \n in <w:t>)
function createSafeTextRuns(text, options = {}) {
  if (!text) return [new TextRun({ text: "", ...options })];
  const clean = String(text).replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const lines = clean.split('\n');
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


// 4. GENERATE WORD (.DOCX) DOCUMENT — CHUẨN SPEC-001 & PHÂN NHÓM PHASE RÕ RÀNG
async function generateDocx(catalog) {
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

  const implementedList = catalog.endpoints.filter(e => e.method !== 'UNKNOWN');
  const designList = catalog.endpoints.filter(e => e.method === 'UNKNOWN');

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
          // Khối metadata theo chuẩn SPEC-001
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

          // Logo chính thức
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
                      new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: "4. Ma trận tổng hợp các endpoint (Phân theo Phase)" })] }),
                      new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: "    4.1 Nhóm API đã triển khai (Phase 1 — Sẵn sàng tích hợp)" })] }),
                      new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: "    4.2 Nhóm API quy hoạch các Phase tiếp theo (Phase 2 CPD...)" })] }),
                      new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: "5. Đặc tả chi tiết từng giao tiếp kỹ thuật" })] }),
                      new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: "    5.1 Chi tiết các API đã triển khai (Phase 1)" })] }),
                      new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: "    5.2 Chi tiết các API quy hoạch các Phase tiếp theo (Phase 2 CPD...)" })] }),
                    ]
                  })
                ]
              })
            ]
          }),

          new Paragraph({ pageBreakBefore: true }),

          // 1. PHẠM VI VÀ QUY ƯỚC KIẾN TRÚC CHUNG
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
                  "bao gồm các HTTP operation hiện có của Server/Gateway và các operation CPD còn DESIGN. " +
                  "Đối soát source không thay thế runtime qualification, deployment hoặc nghiệm thu; nguồn semantic và trạng thái được ghi ở từng operation."
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
              new TextRun("Server session-authenticated mutations dùng X-CSRF-TOKEN từ GET /api/v1/identity/csrf. Gateway dùng signed Grant; credential redemption dùng target-bound proof. Không áp cùng một cơ chế xác thực cho mọi POST.")
            ],
          }),
          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({ text: "• Thẩm quyền phân quyền (RBAC): ", bold: true }),
              new TextRun("Máy chủ xác định danh tính ActorId và quyền hạn thực tế độc lập dựa trên phiên làm việc; Client không được phép tự chỉ định quyền hạn trong request payload.")
            ],
          }),

          // 2. LỊCH SỬ THAY ĐỔI PHIÊN BẢN
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

          // 3. QUY TRÌNH PHỐI HỢP ĐA THÀNH PHẦN
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 150 },
            children: [new TextRun({ text: "3. Quy trình phối hợp đa thành phần (Call flows)", bold: true, color: "111827" })],
          }),
          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: "Luồng semantic được quản lý ở tài liệu Identity/Session, Feature 009 và PH1 boundary. Không tự sinh một protocol mới từ route; xem semanticSource tại từng operation."
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

          // 4. MA TRẬN TỔNG HỢP CÁC ENDPOINT (PHÂN TÁCH 2 PHÂN HỆ RÕ RÀNG)
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 150 },
            children: [new TextRun({ text: "4. Ma trận tổng hợp các endpoint Core v0", bold: true, color: "111827" })],
          }),

          // 4.1 Danh mục API đã triển khai
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 150, after: 100 },
            children: [new TextRun({ text: `4.1 Danh mục API đã triển khai (Phase 1 — Sẵn sàng tích hợp: ${implementedList.length} API)`, bold: true, color: "15803D" })],
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
              ...implementedList.map(item => new TableRow({
                children: [
                  new TableCell({ borders: borderThin, children: [new Paragraph({ children: [new TextRun({ text: item.code, bold: true })] })] }),
                  new TableCell({ borders: borderThin, children: [new Paragraph({ children: createSafeTextRuns(item.name) })] }),
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: item.method === 'GET' ? "F0FDF4" : "EFF6FF" },
                    borders: borderThin,
                    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: item.method, bold: true, color: item.method === 'GET' ? "15803D" : "1D4ED8" })] })]
                  }),
                  new TableCell({ borders: borderThin, children: [new Paragraph({ children: [new TextRun({ text: item.path, font: "Consolas", size: 18 })] })] }),
                  new TableCell({ borders: borderThin, children: [new Paragraph({ children: createSafeTextRuns(item.auth) })] }),
                  new TableCell({ borders: borderThin, children: [new Paragraph({ children: [new TextRun({ text: item.status, bold: true, color: "15803D" })] })] }),
                ],
              })),
            ],
          }),

          new Paragraph({ spacing: { after: 150 } }),

          // 4.2 Danh mục quy hoạch các Phase tiếp theo
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 150, after: 100 },
            children: [new TextRun({ text: `4.2 Danh mục quy hoạch các Phase tiếp theo (Phase 2 CPD... — Đang thiết kế: ${designList.length} API)`, bold: true, color: "C2410C" })],
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ width: { size: 10, type: WidthType.PERCENTAGE }, shading: headerShading, borders: borderThin, children: [new Paragraph({ children: [new TextRun({ text: "Mã", bold: true, color: "FFFFFF" })] })] }),
                  new TableCell({ width: { size: 24, type: WidthType.PERCENTAGE }, shading: headerShading, borders: borderThin, children: [new Paragraph({ children: [new TextRun({ text: "Tên chức năng", bold: true, color: "FFFFFF" })] })] }),
                  new TableCell({ width: { size: 10, type: WidthType.PERCENTAGE }, shading: headerShading, borders: borderThin, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Giai đoạn", bold: true, color: "FFFFFF" })] })] }),
                  new TableCell({ width: { size: 28, type: WidthType.PERCENTAGE }, shading: headerShading, borders: borderThin, children: [new Paragraph({ children: [new TextRun({ text: "Phạm vi thiết kế", bold: true, color: "FFFFFF" })] })] }),
                  new TableCell({ width: { size: 14, type: WidthType.PERCENTAGE }, shading: headerShading, borders: borderThin, children: [new Paragraph({ children: [new TextRun({ text: "Quyền hạn", bold: true, color: "FFFFFF" })] })] }),
                  new TableCell({ width: { size: 14, type: WidthType.PERCENTAGE }, shading: headerShading, borders: borderThin, children: [new Paragraph({ children: [new TextRun({ text: "Trạng thái", bold: true, color: "FFFFFF" })] })] }),
                ],
              }),
              ...designList.map(item => new TableRow({
                children: [
                  new TableCell({ borders: borderThin, children: [new Paragraph({ children: [new TextRun({ text: item.code, bold: true })] })] }),
                  new TableCell({ borders: borderThin, children: [new Paragraph({ children: createSafeTextRuns(item.name) })] }),
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: "FFF7ED" },
                    borders: borderThin,
                    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: item.phase || "Phase 2", bold: true, color: "C2410C" })] })]
                  }),
                  new TableCell({ borders: borderThin, children: [new Paragraph({ children: [new TextRun({ text: item.path, font: "Consolas", size: 18 })] })] }),
                  new TableCell({ borders: borderThin, children: [new Paragraph({ children: createSafeTextRuns(item.auth) })] }),
                  new TableCell({ borders: borderThin, children: [new Paragraph({ children: [new TextRun({ text: item.status, bold: true, color: "C2410C" })] })] }),
                ],
              })),
            ],
          }),

          new Paragraph({ pageBreakBefore: true }),

          // 5. ĐẶC TẢ CHI TIẾT TỪNG GIAO TIẾP KỸ THUẬT (PHÂN NHÓM 5.1 & 5.2)
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 150 },
            children: [new TextRun({ text: "5. Đặc tả chi tiết từng giao tiếp kỹ thuật", bold: true, color: "111827" })],
          }),

          // 5.1 Nhóm API đã triển khai
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 180, after: 120 },
            children: [new TextRun({ text: "5.1 Nhóm API đã triển khai (Phase 1 — Sẵn sàng gọi trực tiếp)", bold: true, color: "15803D" })],
          }),

          ...implementedList.flatMap(item => renderEndpointCard(item, borderThin, subHeaderShading)),

          new Paragraph({ pageBreakBefore: true }),

          // 5.2 Nhóm API quy hoạch Phase tiếp theo
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 180, after: 120 },
            children: [new TextRun({ text: "5.2 Nhóm API quy hoạch các Phase tiếp theo (Phase 2 CPD... — Đang thiết kế)", bold: true, color: "C2410C" })],
          }),
          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: "Ghi chú quy chuẩn: Các endpoint trong mục này đang ở giai đoạn đặc tả thiết kế nghiệp vụ (DESIGN). " +
                  "Các chi tiết DTO và route HTTP dây truyền tải cụ thể sẽ được xác lập chính thức khi hoàn tất kiểm chuẩn giai đoạn tương ứng.",
                italics: true,
                color: "6B7280"
              })
            ]
          }),

          ...designList.flatMap(item => renderEndpointCard(item, borderThin, subHeaderShading)),
        ],
      },
    ],
  });

  const docxFile = path.join(OUTPUT_DIR, 'IDEA_Core_v0_API_Contract.docx');
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(docxFile, buffer);
  return docxFile;
}

// Helper render thẻ Endpoint trong Word
function renderEndpointCard(item, borderThin, subHeaderShading) {
  const isImplemented = item.method !== 'UNKNOWN';
  return [
    new Paragraph({
      heading: HeadingLevel.HEADING_3,
      spacing: { before: 250, after: 80 },
      children: [
        new TextRun({ text: `[${item.code}] `, bold: true, color: isImplemented ? "1E40AF" : "C2410C" }),
        new TextRun({ text: `${item.name}`, bold: true, color: "111827" }),
        new TextRun({ text: `  (${item.phase || 'Phase 1'})`, italics: true, color: "6B7280", size: 18 }),
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
              shading: { type: ShadingType.CLEAR, fill: item.method === 'GET' ? "F0FDF4" : (item.method === 'POST' ? "EFF6FF" : "FFF7ED") },
              borders: borderThin,
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: item.method, bold: true, color: item.method === 'GET' ? "15803D" : (item.method === 'POST' ? "1D4ED8" : "C2410C") })] })]
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
              children: [new Paragraph({ children: [new TextRun({ text: item.status, bold: true, color: isImplemented ? "15803D" : "C2410C" })] })]
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

    new Paragraph({ spacing: { after: 60 } }),

    // Headers & Fields
    ...(item.headers && item.headers.length > 0 ? [
      new Paragraph({ spacing: { before: 80, after: 40 }, children: [new TextRun({ text: "HTTP Headers bắt buộc:", bold: true, color: "4B5563" })] }),
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({
            children: [
              new TableCell({ width: { size: 28, type: WidthType.PERCENTAGE }, shading: subHeaderShading, borders: borderThin, children: [new Paragraph({ children: [new TextRun({ text: "Tên Header", bold: true })] })] }),
              new TableCell({ width: { size: 16, type: WidthType.PERCENTAGE }, shading: subHeaderShading, borders: borderThin, children: [new Paragraph({ children: [new TextRun({ text: "Bắt buộc", bold: true })] })] }),
              new TableCell({ width: { size: 56, type: WidthType.PERCENTAGE }, shading: subHeaderShading, borders: borderThin, children: [new Paragraph({ children: [new TextRun({ text: "Diễn giải", bold: true })] })] }),
            ]
          }),
          ...item.headers.map(h => new TableRow({
            children: [
              new TableCell({ borders: borderThin, children: [new Paragraph({ children: [new TextRun({ text: h.name, font: "Consolas", bold: true })] })] }),
              new TableCell({ borders: borderThin, children: [new Paragraph({ children: [new TextRun(h.required ? "BẮT BUỘC" : "Tùy chọn")] })] }),
              new TableCell({ borders: borderThin, children: [new Paragraph({ children: createSafeTextRuns(h.description) })] }),
            ]
          }))
        ]
      })
    ] : []),

    // Data Dictionary / Fields
    ...(item.fields && item.fields.length > 0 ? [
      new Paragraph({ spacing: { before: 80, after: 40 }, children: [new TextRun({ text: "Cấu trúc tham số và trường dữ liệu (Data Dictionary):", bold: true, color: "4B5563" })] }),
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({
            children: [
              new TableCell({ width: { size: 14, type: WidthType.PERCENTAGE }, shading: subHeaderShading, borders: borderThin, children: [new Paragraph({ children: [new TextRun({ text: "Vị trí", bold: true })] })] }),
              new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, shading: subHeaderShading, borders: borderThin, children: [new Paragraph({ children: [new TextRun({ text: "Tên trường", bold: true })] })] }),
              new TableCell({ width: { size: 12, type: WidthType.PERCENTAGE }, shading: subHeaderShading, borders: borderThin, children: [new Paragraph({ children: [new TextRun({ text: "Kiểu", bold: true })] })] }),
              new TableCell({ width: { size: 12, type: WidthType.PERCENTAGE }, shading: subHeaderShading, borders: borderThin, children: [new Paragraph({ children: [new TextRun({ text: "Bắt buộc", bold: true })] })] }),
              new TableCell({ width: { size: 42, type: WidthType.PERCENTAGE }, shading: subHeaderShading, borders: borderThin, children: [new Paragraph({ children: [new TextRun({ text: "Ràng buộc & Diễn giải kỹ thuật", bold: true })] })] }),
            ]
          }),
          ...item.fields.map(f => new TableRow({
            children: [
              new TableCell({ borders: borderThin, children: [new Paragraph({ children: [new TextRun(f.in)] })] }),
              new TableCell({ borders: borderThin, children: [new Paragraph({ children: [new TextRun({ text: f.name, font: "Consolas", bold: true })] })] }),
              new TableCell({ borders: borderThin, children: [new Paragraph({ children: [new TextRun(f.type)] })] }),
              new TableCell({ borders: borderThin, children: [new Paragraph({ children: [new TextRun(f.required ? "BẮT BUỘC" : "Tùy chọn")] })] }),
              new TableCell({ borders: borderThin, children: [new Paragraph({ children: [
                new TextRun({ text: f.validation ? `[${f.validation}] ` : "", bold: true, color: "4B5563" }),
                ...createSafeTextRuns(f.description)
              ] })] }),
            ]
          }))
        ]
      })
    ] : []),

    // Request / Response Examples
    new Paragraph({ spacing: { before: 80, after: 40 }, children: [new TextRun({ text: "Mẫu gói tin gửi (Request) & Phản hồi (Response):", bold: true, color: "4B5563" })] }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({ width: { size: 50, type: WidthType.PERCENTAGE }, shading: subHeaderShading, borders: borderThin, children: [new Paragraph({ children: [new TextRun({ text: "Request Payload / Query", bold: true })] })] }),
            new TableCell({ width: { size: 50, type: WidthType.PERCENTAGE }, shading: subHeaderShading, borders: borderThin, children: [new Paragraph({ children: [new TextRun({ text: "Response / Body (xem media type)", bold: true })] })] }),
          ]
        }),
        new TableRow({
          children: [
            new TableCell({ borders: borderThin, shading: { type: ShadingType.CLEAR, fill: "F9FAFB" }, children: [new Paragraph({ children: createCodeRuns(item.requestExample || "Không có nội dung body.") })] }),
            new TableCell({ borders: borderThin, shading: { type: ShadingType.CLEAR, fill: "F9FAFB" }, children: [new Paragraph({ children: createCodeRuns(item.responseExample || "204 No Content") })] }),
          ]
        })
      ]
    }),

    // Error Matrix
    ...(item.errors && item.errors.length > 0 ? [
      new Paragraph({ spacing: { before: 80, after: 40 }, children: [new TextRun({ text: "Danh mục mã lỗi và hướng xử lý (Error Handling):", bold: true, color: "4B5563" })] }),
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({
            children: [
              new TableCell({ width: { size: 12, type: WidthType.PERCENTAGE }, shading: subHeaderShading, borders: borderThin, children: [new Paragraph({ children: [new TextRun({ text: "HTTP", bold: true })] })] }),
              new TableCell({ width: { size: 24, type: WidthType.PERCENTAGE }, shading: subHeaderShading, borders: borderThin, children: [new Paragraph({ children: [new TextRun({ text: "Mã lỗi", bold: true })] })] }),
              new TableCell({ width: { size: 38, type: WidthType.PERCENTAGE }, shading: subHeaderShading, borders: borderThin, children: [new Paragraph({ children: [new TextRun({ text: "Nguyên nhân phát sinh", bold: true })] })] }),
              new TableCell({ width: { size: 26, type: WidthType.PERCENTAGE }, shading: subHeaderShading, borders: borderThin, children: [new Paragraph({ children: [new TextRun({ text: "Hướng xử lý", bold: true })] })] }),
            ]
          }),
          ...item.errors.map(err => new TableRow({
            children: [
              new TableCell({ borders: borderThin, children: [new Paragraph({ children: [new TextRun({ text: String(err.status), bold: true })] })] }),
              new TableCell({ borders: borderThin, children: [new Paragraph({ children: [new TextRun({ text: err.code, font: "Consolas" })] })] }),
              new TableCell({ borders: borderThin, children: [new Paragraph({ children: createSafeTextRuns(err.reason) })] }),
              new TableCell({ borders: borderThin, children: [new Paragraph({ children: createSafeTextRuns(err.remedy) })] }),
            ]
          }))
        ]
      })
    ] : []),

    // Technical Notes
    new Paragraph({ spacing: { before: 80, after: 180 }, children: [new TextRun({ text: "Ghi chú kỹ thuật: ", bold: true, color: "4B5563" }), ...createSafeTextRuns(item.notes)] }),
  ];
}

// 5. GENERATE EXCEL (.XLSX) WORKBOOK — 4 SHEETS KÈM PHÂN NHÓM GIAI ĐOẠN (PHASE)
async function generateXlsx(catalog) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = catalog.metadata.author;
  workbook.created = new Date();
  workbook.properties.date1904 = true;

  const headerFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2D3748' } };
  const subHeaderFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF3F4F6' } };
  const headerFont = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
  const borderThin = {
    top: { style: 'thin', color: { argb: 'FFD1D5DB' } },
    bottom: { style: 'thin', color: { argb: 'FFD1D5DB' } },
    left: { style: 'thin', color: { argb: 'FFD1D5DB' } },
    right: { style: 'thin', color: { argb: 'FFD1D5DB' } },
  };

  // --- SHEET 1: THÔNG TIN DỰ ÁN & LỊCH SỬ ---
  const ws1 = workbook.addWorksheet('1. Thong tin & Lich su');
  ws1.views = [{ showGridLines: true }];
  ws1.columns = [{ width: 28 }, { width: 55 }, { width: 35 }];

  ws1.addRow(['IDEA ENGINEERING — HỒ SƠ ĐẶC TẢ GIAO TIẾP API', '']);
  ws1.getCell('A1').font = { name: 'Segoe UI', size: 15, bold: true, color: { argb: 'FF1F2937' } };
  ws1.addRow([catalog.metadata.subtitle, '']);
  ws1.getCell('A2').font = { name: 'Segoe UI', size: 10, italics: true, color: { argb: 'FF4B5563' } };
  ws1.addRow([]);

  ws1.addRow(['Mã tài liệu:', catalog.metadata.documentCode]);
  ws1.addRow(['Phiên bản tài liệu:', `v${catalog.metadata.version}`]);
  ws1.addRow(['Trạng thái duyệt:', catalog.metadata.status]);
  ws1.addRow(['Người phụ trách kỹ thuật:', catalog.metadata.author]);
  ws1.addRow(['Phòng ban ban hành:', catalog.metadata.department]);
  ws1.addRow(['Ngày biên dịch hồ sơ:', exportDate]);
  ws1.addRow([]);

  ws1.addRow(['LỊCH SỬ THAY ĐỔI PHIÊN BẢN (REVISION HISTORY)']);
  ws1.getCell('A10').font = { name: 'Segoe UI', size: 11, bold: true, color: { argb: 'FF1F2937' } };

  const revHeader = ws1.addRow(['Phiên bản', 'Ngày ban hành', 'Người thực hiện', 'Nội dung cập nhật']);
  revHeader.height = 24;
  [1, 2, 3, 4].forEach(c => {
    const cell = revHeader.getCell(c);
    cell.font = headerFont;
    cell.fill = headerFill;
    cell.border = borderThin;
  });

  catalog.metadata.revisions.forEach(rev => {
    const row = ws1.addRow([`v${rev.version}`, rev.date, rev.author, rev.description]);
    row.height = 20;
    row.eachCell((cell) => { cell.border = borderThin; cell.font = { name: 'Segoe UI', size: 9 }; });
  });

  // --- SHEET 2: MA TRẬN API (MASTER MATRIX) ---
  const ws2 = workbook.addWorksheet('2. Ma tran API');
  ws2.views = [{ showGridLines: true, state: 'frozen', ySplit: 4 }];

  ws2.getCell('A1').value = 'MA TRẬN TỔNG HỢP GIAO TIẾP API — IDEA DDM CORE v0';
  ws2.getCell('A1').font = { name: 'Segoe UI', size: 12, bold: true, color: { argb: 'FF1F2937' } };
  ws2.getCell('A2').value = `Tổng số endpoint: ${catalog.endpoints.length} | Ngày xuất: ${exportDate} | Phiên bản: v${catalog.metadata.version}`;
  ws2.getCell('A2').font = { name: 'Segoe UI', size: 9, italics: true, color: { argb: 'FF6B7280' } };

  ws2.columns = [
    { header: '', key: 'stt', width: 6 },
    { header: '', key: 'phase', width: 16 },
    { header: '', key: 'group', width: 26 },
    { header: '', key: 'code', width: 12 },
    { header: '', key: 'name', width: 34 },
    { header: '', key: 'method', width: 10 },
    { header: '', key: 'path', width: 44 },
    { header: '', key: 'auth', width: 28 },
    { header: '', key: 'status', width: 20 },
    { header: '', key: 'notes', width: 50 },
  ];

  const h2Headers = ['STT', 'Giai đoạn (Phase)', 'Nhóm chức năng', 'Mã API', 'Tên chức năng', 'Method', 'Đường dẫn URL Endpoint', 'Quyền hạn gọi', 'Trạng thái', 'Ghi chú kỹ thuật'];
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
      phase: item.phase || 'Phase 1',
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
      if (colNum === 1 || colNum === 2 || colNum === 4 || colNum === 6) {
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      }
      if (colNum === 2) {
        cell.font = { name: 'Segoe UI', bold: true, color: { argb: (item.method !== 'UNKNOWN') ? 'FF15803D' : 'FFC2410C' } };
      }
      if (colNum === 6) {
        cell.font = { name: 'Segoe UI', bold: true, color: { argb: item.method === 'GET' ? 'FF15803D' : (item.method === 'POST' ? 'FF1D4ED8' : 'FFC2410C') } };
      }
      if (colNum === 7) {
        cell.font = { name: 'Consolas', size: 9 };
      }
      if (colNum === 9) {
        cell.font = { name: 'Segoe UI', bold: true, color: { argb: item.method !== 'UNKNOWN' ? 'FF15803D' : 'FFC2410C' } };
      }
    });
  });
  ws2.autoFilter = 'A4:J4';

  // --- SHEET 3: DATA DICTIONARY ---
  const ws3 = workbook.addWorksheet('3. Data Dictionary');
  ws3.views = [{ showGridLines: true, state: 'frozen', ySplit: 4 }];

  ws3.getCell('A1').value = 'TỪ ĐIỂN THAM SỐ VÀ TRƯỜNG DỮ LIỆU (DATA DICTIONARY)';
  ws3.getCell('A1').font = { name: 'Segoe UI', size: 12, bold: true, color: { argb: 'FF1F2937' } };
  ws3.getCell('A2').value = 'Dùng cho lập trình viên Backend, Frontend và QA thiết kế kịch bản kiểm thử (Test Matrix)';
  ws3.getCell('A2').font = { name: 'Segoe UI', size: 9, italics: true, color: { argb: 'FF6B7280' } };

  ws3.columns = [
    { header: '', key: 'stt', width: 6 },
    { header: '', key: 'phase', width: 14 },
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

  const h3Headers = ['STT', 'Giai đoạn', 'Mã API', 'Tên chức năng', 'Vị trí', 'Tên trường (Field Name)', 'Kiểu dữ liệu', 'Bắt buộc', 'Quy tắc / Giới hạn validation', 'Diễn giải kỹ thuật', 'Giá trị mẫu'];
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
          phase: item.phase || 'Phase 1',
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
          if (colNum === 1 || colNum === 2 || colNum === 3 || colNum === 5 || colNum === 8) {
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
          }
          if (colNum === 6) {
            cell.font = { name: 'Consolas', size: 9, bold: true };
          }
          if (colNum === 8) {
            cell.font = { name: 'Segoe UI', bold: true, color: { argb: f.required ? 'FFB91C1C' : 'FF6B7280' } };
          }
        });
      });
    }
  });
  ws3.autoFilter = 'A4:K4';

  // --- SHEET 4: ERROR CATALOG ---
  const ws4 = workbook.addWorksheet('4. Error Catalog');
  ws4.views = [{ showGridLines: true, state: 'frozen', ySplit: 4 }];

  ws4.getCell('A1').value = 'DANH MỤC MÃ LỖI VÀ QUY TẮC XỬ LÝ (ERROR CATALOG & RETRY RULES)';
  ws4.getCell('A1').font = { name: 'Segoe UI', size: 12, bold: true, color: { argb: 'FF1F2937' } };
  ws4.getCell('A2').value = 'Quy ước mã lỗi HTTP, mã lỗi hệ thống và cách phản hồi tương ứng của Client';
  ws4.getCell('A2').font = { name: 'Segoe UI', size: 9, italics: true, color: { argb: 'FF6B7280' } };

  ws4.columns = [
    { header: '', key: 'stt', width: 6 },
    { header: '', key: 'phase', width: 14 },
    { header: '', key: 'code', width: 12 },
    { header: '', key: 'apiName', width: 28 },
    { header: '', key: 'status', width: 14 },
    { header: '', key: 'errorCode', width: 26 },
    { header: '', key: 'reason', width: 48 },
    { header: '', key: 'remedy', width: 44 },
  ];

  const h4Headers = ['STT', 'Giai đoạn', 'Mã API', 'Tên chức năng', 'HTTP Status', 'Mã lỗi hệ thống (Error Code)', 'Nguyên nhân phát sinh', 'Hướng xử lý / Quy tắc Retry'];
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
      item.errors.forEach((err) => {
        const row = ws4.addRow({
          stt: errCounter++,
          phase: item.phase || 'Phase 1',
          code: item.code,
          apiName: item.name,
          status: err.status,
          errorCode: err.code,
          reason: err.reason,
          remedy: err.remedy,
        });
        row.height = 22;
        row.eachCell((cell, colNum) => {
          cell.border = borderThin;
          cell.font = { name: 'Segoe UI', size: 10 };
          if (colNum === 1 || colNum === 2 || colNum === 3 || colNum === 5) {
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
          }
          if (colNum === 5) {
            cell.font = { name: 'Segoe UI', bold: true, color: { argb: err.status >= 500 ? 'FFB91C1C' : 'FFC2410C' } };
          }
          if (colNum === 6) {
            cell.font = { name: 'Consolas', size: 9, bold: true };
          }
        });
      });
    }
  });
  ws4.autoFilter = 'A4:H4';

  const xlsxFile = path.join(OUTPUT_DIR, 'IDEA_Core_v0_API_Contract.xlsx');
  await workbook.xlsx.writeFile(xlsxFile);
  return xlsxFile;
}

// 6. GENERATE OFFLINE INTERACTIVE HTML — 100% OFFLINE, ZERO CDN, TABS LỌC THEO PHASE
function generateHtml(catalog) {
  const catalogJson = JSON.stringify(catalog).replace(/</g, '\\u003c');
  const implementedCount = catalog.endpoints.filter(e => e.method !== 'UNKNOWN').length;
  const designCount = catalog.endpoints.filter(e => e.method === 'UNKNOWN').length;

  const html = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>IDEA DDM Core v0 — Đặc tả giao tiếp API</title>
  <style>
    :root {
      --bg: #FFFFFF;
      --sidebar-bg: #F8FAFC;
      --text-main: #0F172A;
      --text-muted: #475569;
      --border: #E2E8F0;
      --card-bg: #FFFFFF;
      --card-border: #E2E8F0;
      --accent: #2563EB;
      --code-bg: #F8FAFC;
      --code-border: #E2E8F0;
      --code-text: #0F172A;
      --method-get-bg: #ECFDF5;
      --method-get-text: #047857;
      --method-get-border: #A7F3D0;
      --method-post-bg: #EFF6FF;
      --method-post-text: #1D4ED8;
      --method-post-border: #BFDBFE;
      --method-design-bg: #FFF7ED;
      --method-design-text: #C2410C;
      --method-design-border: #FFEDD5;
      --badge-ready: #059669;
      --badge-design: #EA580C;
    }

    body.dark-theme {
      --bg: #0F172A;
      --sidebar-bg: #1E293B;
      --text-main: #F8FAFC;
      --text-muted: #94A3B8;
      --border: #334155;
      --card-bg: #1E293B;
      --card-border: #334155;
      --accent: #3B82F6;
      --code-bg: #0F172A;
      --code-border: #334155;
      --code-text: #E2E8F0;
      --method-get-bg: rgba(6, 95, 70, 0.2);
      --method-get-text: #34D399;
      --method-get-border: #065F46;
      --method-post-bg: rgba(30, 64, 175, 0.2);
      --method-post-text: #60A5FA;
      --method-post-border: #1E40AF;
      --method-design-bg: rgba(154, 52, 18, 0.2);
      --method-design-text: #FB923C;
      --method-design-border: #9A3412;
      --badge-ready: #10B981;
      --badge-design: #F97316;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background: var(--bg);
      color: var(--text-main);
      display: flex;
      height: 100vh;
      overflow: hidden;
      font-size: 14px;
    }

    /* Sidebar */
    #sidebar {
      width: 320px;
      background: var(--sidebar-bg);
      border-right: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
    }
    .brand {
      padding: 18px 20px;
      border-bottom: 1px solid var(--border);
    }
    .brand h1 { font-size: 1.05rem; font-weight: 700; letter-spacing: -0.01em; color: var(--text-main); }
    .brand p { font-size: 0.76rem; color: var(--text-muted); margin-top: 3px; }

    .search-box { padding: 12px 16px; border-bottom: 1px solid var(--border); }
    .search-box input {
      width: 100%;
      padding: 7px 12px;
      border: 1px solid var(--border);
      border-radius: 6px;
      background: var(--bg);
      color: var(--text-main);
      font-size: 0.82rem;
      outline: none;
    }
    .search-box input:focus { border-color: var(--accent); }

    .nav-list { flex: 1; overflow-y: auto; padding: 12px 0; }
    .nav-group-title {
      font-size: 0.72rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-muted);
      padding: 12px 18px 6px;
    }
    .nav-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 18px;
      cursor: pointer;
      color: var(--text-muted);
      text-decoration: none;
      font-size: 0.82rem;
      transition: background 0.15s;
    }
    .nav-item:hover { background: rgba(0, 0, 0, 0.04); color: var(--text-main); }
    .dark-theme .nav-item:hover { background: rgba(255, 255, 255, 0.04); }
    .nav-item.active { background: rgba(37, 99, 235, 0.08); color: var(--accent); font-weight: 600; }

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
    .badge-TBD { background: var(--method-design-bg); color: var(--method-design-text); border-color: var(--method-design-border); }

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
      <p>Đặc tả API • SPEC-API-001 • v${escapeHTML(catalog.metadata.version)}</p>
    </div>
    <div class="search-box">
      <input type="text" id="searchInput" placeholder="Tìm theo mã API, đường dẫn, tham số...">
    </div>
    <div class="nav-list" id="navList"></div>
  </div>

  <!-- Main View -->
  <div id="main-content">
    <div class="top-bar">
      <div class="tab-pills">
        <button class="tab-btn active" data-tab="all" onclick="setTab('all')">Tất cả (${catalog.endpoints.length})</button>
        <button class="tab-btn" data-tab="implemented" onclick="setTab('implemented')">Đã triển khai (${implementedCount})</button>
        <button class="tab-btn" data-tab="design" onclick="setTab('design')">Quy hoạch Phase 2+ (${designCount})</button>
        <button class="tab-btn" data-tab="workflows" onclick="setTab('workflows')">Quy trình (Call flows)</button>
        <button class="tab-btn" data-tab="matrix" onclick="setTab('matrix')">Ma trận (Matrix)</button>
        <button class="tab-btn" data-tab="changelog" onclick="setTab('changelog')">Lịch sử (Changelog)</button>
      </div>
      <div class="top-actions">
        <button class="theme-toggle-btn" onclick="toggleTheme()">Chuyển chế độ sáng/tối</button>
      </div>
    </div>
    <div class="scroll-view" id="contentArea"></div>
  </div>

  <div id="toast">Đã sao chép vào bộ nhớ tạm</div>

  <script>
    const data = ${catalogJson};
    ${escapeHTML.toString()}
    let currentTab = 'all';

    function toggleTheme() {
      document.body.classList.toggle('dark-theme');
    }

    function showToast(msg) {
      const t = document.getElementById('toast');
      t.innerText = msg;
      t.style.opacity = '1';
      setTimeout(() => { t.style.opacity = '0'; }, 1800);
    }

    function copyFromAttr(btn) {
      const text = decodeURIComponent(btn.getAttribute('data-clipboard') || '');
      copyText(btn, text);
    }

    function copyText(btn, text) {
      navigator.clipboard.writeText(text).then(() => {
        showToast('Đã sao chép vào clipboard');
      });
    }

    function setTab(tab) {
      currentTab = tab;
      document.querySelectorAll('.tab-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.tab === tab);
      });
      renderMain();
      renderNav();
    }

    function renderNav() {
      const nav = document.getElementById('navList');
      let filtered = data.endpoints;
      if (currentTab === 'implemented') {
        filtered = data.endpoints.filter(e => e.method !== 'UNKNOWN');
      } else if (currentTab === 'design') {
        filtered = data.endpoints.filter(e => e.method === 'UNKNOWN');
      }

      const groups = {};
      filtered.forEach(e => {
        const grp = (e.method !== 'UNKNOWN') ? 'PHÂN HỆ 1: ĐÃ TRIỂN KHAI (HTTP)' : 'PHÂN HỆ 2: QUY HOẠCH PHASE TIẾP THEO';
        if (!groups[grp]) groups[grp] = [];
        groups[grp].push(e);
      });

      let html = '';
      for (const [groupName, items] of Object.entries(groups)) {
        html += \`<div class="nav-group-title">\${groupName} (\${items.length})</div>\`;
        items.forEach(item => {
          html += \`
            <a class="nav-item" href="#api-\${escapeHTML(item.code)}">
              <span class="method-badge badge-\${escapeHTML(item.method)}">\${escapeHTML(item.method)}</span>
              <span style="font-weight:500;">[\${escapeHTML(item.code)}]</span>
              <span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">\${escapeHTML(item.name)}</span>
            </a>
          \`;
        });
      }
      nav.innerHTML = html;
    }

    function renderMain() {
      const view = document.getElementById('contentArea');

      if (['all', 'implemented', 'design'].includes(currentTab)) {
        let items = data.endpoints;
        if (currentTab === 'implemented') {
          items = data.endpoints.filter(e => e.method !== 'UNKNOWN');
        } else if (currentTab === 'design') {
          items = data.endpoints.filter(e => e.method === 'UNKNOWN');
        }

        view.innerHTML = items.map(e => {
          const isImplemented = e.method !== 'UNKNOWN';
          return \`
            <div class="api-card" id="api-\${escapeHTML(e.code)}">
              <div class="api-header">
                <div class="api-route">
                  <span class="method-badge badge-\${escapeHTML(e.method)}">\${escapeHTML(e.method)}</span>
                  <span class="api-path">\${escapeHTML(e.path)}</span>
                  <span style="font-size:0.8rem; font-weight:600; color:var(--text-muted);">[\${escapeHTML(e.code)}] \${escapeHTML(e.name)}</span>
                </div>
                <div>
                  <span class="status-badge \${isImplemented ? 'status-pass' : 'status-design'}">\${escapeHTML(e.status)}</span>
                  <span style="font-size:0.75rem; color:var(--text-muted); margin-left:6px;">(\${e.phase || 'Phase 1'})</span>
                </div>
              </div>

              <div class="api-desc">\${escapeHTML(e.description)}</div>

              <div class="section-title">Thông tin ngữ cảnh và thẩm quyền</div>
              <table class="spec-table">
                <tr><th style="width:22%;">Quyền hạn yêu cầu</th><td>\${escapeHTML(e.auth)}</td></tr>
                <tr><th>Điều kiện tiên quyết</th><td>\${escapeHTML(e.preconditions)}</td></tr>
                <tr><th>Tác động trạng thái</th><td>\${escapeHTML(e.stateEffects)}</td></tr>
              </table>

              \${e.headers && e.headers.length ? \`
                <div class="section-title">HTTP Headers bắt buộc</div>
                <table class="spec-table">
                  <thead><tr><th>Tên Header</th><th>Bắt buộc</th><th>Diễn giải</th></tr></thead>
                  <tbody>
                    \${e.headers.map(h => \`
                      <tr>
                        <td class="field-name">\${escapeHTML(h.name)}</td>
                        <td style="color:\${h.required ? '#DC2626' : 'var(--text-muted)'}; font-weight:600;">\${h.required ? 'BẮT BUỘC' : 'Tùy chọn'}</td>
                        <td>\${escapeHTML(h.description)}</td>
                      </tr>
                    \`).join('')}
                  </tbody>
                </table>
              \` : ''}

              \${e.fields && e.fields.length ? \`
                <div class="section-title">Từ điển trường dữ liệu (Data Dictionary)</div>
                <table class="spec-table">
                  <thead><tr><th>Vị trí</th><th>Tên trường</th><th>Kiểu</th><th>Bắt buộc</th><th>Ràng buộc kỹ thuật & Diễn giải</th></tr></thead>
                  <tbody>
                    \${e.fields.map(f => \`
                      <tr>
                        <td>\${escapeHTML(f.in)}</td>
                        <td class="field-name">\${escapeHTML(f.name)}</td>
                        <td>\${escapeHTML(f.type)}</td>
                        <td style="color:\${f.required ? '#DC2626' : 'var(--text-muted)'}; font-weight:600;">\${f.required ? 'BẮT BUỘC' : 'Tùy chọn'}</td>
                        <td><strong>\${f.validation ? '[' + escapeHTML(f.validation) + '] ' : ''}</strong>\${escapeHTML(f.description)}</td>
                      </tr>
                    \`).join('')}
                  </tbody>
                </table>
              \` : ''}

              <div class="section-title">Mẫu gói tin gửi (Request) & Phản hồi (Response)</div>
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
                <div>
                  <div style="font-size:0.75rem; color:var(--text-muted); margin-bottom:4px;">Request</div>
                  <div class="code-container">
                    <button class="copy-btn" data-clipboard="\${encodeURIComponent(e.requestExample || '')}" onclick="copyFromAttr(this)">Sao chép</button>
                    \${escapeHTML(e.requestExample)}
                  </div>
                </div>
                <div>
                  <div style="font-size:0.75rem; color:var(--text-muted); margin-bottom:4px;">Response</div>
                  <div class="code-container">
                    <button class="copy-btn" data-clipboard="\${encodeURIComponent(e.responseExample || '')}" onclick="copyFromAttr(this)">Sao chép</button>
                    \${escapeHTML(e.responseExample)}
                  </div>
                </div>
              </div>

              \${e.errors && e.errors.length ? \`
                <div class="section-title">Danh mục mã lỗi (Error Handling & Retry)</div>
                <table class="spec-table">
                  <thead><tr><th>HTTP Status</th><th>Mã lỗi</th><th>Nguyên nhân phát sinh</th><th>Hướng xử lý / Retry</th></tr></thead>
                  <tbody>
                    \${e.errors.map(err => \`
                      <tr>
                        <td style="font-weight:700; color:\${err.status >= 500 ? '#DC2626' : '#D97706'}">\${escapeHTML(err.status)}</td>
                        <td class="field-name">\${escapeHTML(err.code)}</td>
                        <td>\${escapeHTML(err.reason)}</td>
                        <td>\${escapeHTML(err.remedy)}</td>
                      </tr>
                    \`).join('')}
                  </tbody>
                </table>
              \` : ''}

              <div style="font-size:0.8rem; color:var(--text-muted); margin-top:12px; font-style:italic;">
                Ghi chú kỹ thuật: \${escapeHTML(e.notes)}
              </div>
            </div>
          \`;
        }).join('');
      } else if (currentTab === 'workflows') {
        view.innerHTML = data.workflows.map(wf => \`
          <div class="api-card">
            <h2 style="font-size:1.15rem; color:var(--accent); margin-bottom:6px;">\${escapeHTML(wf.id)}. \${escapeHTML(wf.title)}</h2>
            <p style="color:var(--text-muted); font-size:0.88rem; margin-bottom:16px; font-style:italic;">\${escapeHTML(wf.description)}</p>
            <table class="spec-table">
              <thead><tr><th>Bước</th><th>Bên gửi</th><th>Hành động & Endpoint</th><th>Bên nhận</th><th>Kết quả & Trạng thái</th></tr></thead>
              <tbody>
                \${wf.steps.map(s => \`
                  <tr>
                    <td style="font-weight:700; text-align:center;">\${escapeHTML(s.step)}</td>
                    <td>\${escapeHTML(s.actor)}</td>
                    <td><strong>\${escapeHTML(s.action)}</strong><br><span style="font-family:Consolas; font-size:0.75rem; color:var(--accent);">\${escapeHTML(s.endpoint)}</span></td>
                    <td>\${escapeHTML(s.receiver)}</td>
                    <td>\${escapeHTML(s.outcome)}</td>
                  </tr>
                \`).join('')}
              </tbody>
            </table>
          </div>
        \`).join('');
      } else if (currentTab === 'matrix') {
        const rows = data.endpoints.map(e => \`
          <tr>
            <td style="font-weight:700;">\${escapeHTML(e.code)}</td>
            <td>\${e.phase || 'Phase 1'}</td>
            <td>\${escapeHTML(e.group)}</td>
            <td><strong>\${escapeHTML(e.name)}</strong></td>
            <td><span class="method-badge badge-\${escapeHTML(e.method)}">\${escapeHTML(e.method)}</span></td>
            <td style="font-family:Consolas; font-size:0.78rem;">\${escapeHTML(e.path)}</td>
            <td>\${escapeHTML(e.auth)}</td>
            <td style="font-weight:600; color:\${e.method !== 'UNKNOWN' ? 'var(--badge-ready)' : 'var(--badge-design)'}">\${escapeHTML(e.status)}</td>
          </tr>
        \`).join('');
        view.innerHTML = \`
          <div class="api-card">
            <h2 style="color:var(--text-main); font-size:1.1rem; margin-bottom:12px;">Ma trận tổng hợp các Endpoint Core v0</h2>
            <table class="spec-table">
              <thead><tr><th>Mã API</th><th>Phase</th><th>Nhóm</th><th>Tên chức năng</th><th>Method</th><th>Đường dẫn Endpoint</th><th>Quyền hạn</th><th>Trạng thái</th></tr></thead>
              <tbody>\${rows}</tbody>
            </table>
          </div>
        \`;
      } else if (currentTab === 'changelog') {
        const revRows = data.metadata.revisions.map(r => \`
          <tr>
            <td style="font-weight:700;">v\${escapeHTML(r.version)}</td>
            <td>\${escapeHTML(r.date)}</td>
            <td>\${escapeHTML(r.author)}</td>
            <td>\${escapeHTML(r.description)}</td>
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

// 7. ARCHIVE OUTPUT: Lưu bản snapshot có đánh dấu phiên bản và ngày tháng (Tránh ghi đè)
function getFileSha256(filePath) {
  if (!fs.existsSync(filePath)) return null;
  return createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function resolveArchiveTarget(baseDir, baseName, ext, sourcePath) {
  const sourceHash = getFileSha256(sourcePath);
  let candidate = path.join(baseDir, `${baseName}.${ext}`);

  if (!fs.existsSync(candidate)) {
    return { targetPath: candidate, action: 'created' };
  }

  const existingHash = getFileSha256(candidate);
  if (existingHash === sourceHash) {
    return { targetPath: candidate, action: 'identical_preserved' };
  }

  // Nếu nội dung thay đổi trong cùng ngày và cùng version -> Thêm hậu tố tuần tự _01, _02...
  let seq = 1;
  while (true) {
    const seqName = `${baseName}_${String(seq).padStart(2, '0')}.${ext}`;
    candidate = path.join(baseDir, seqName);
    if (!fs.existsSync(candidate)) {
      return { targetPath: candidate, action: 'sequenced' };
    }
    if (getFileSha256(candidate) === sourceHash) {
      return { targetPath: candidate, action: 'identical_preserved' };
    }
    seq++;
  }
}

function archiveOutput(catalog, docxPath, xlsxPath, htmlPath) {
  const dateStamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const versionSlug = `v${catalog.metadata.version || '1.0'}`;
  const baseName = `IDEA_Core_API_Contract_${versionSlug}_${dateStamp}`;
  const contentHash = getFileSha256(htmlPath);

  const baseHtmlPath = path.join(ARCHIVE_DIR, `${baseName}.html`);
  if (!fs.existsSync(baseHtmlPath)) {
    fs.copyFileSync(docxPath, path.join(ARCHIVE_DIR, `${baseName}.docx`));
    fs.copyFileSync(xlsxPath, path.join(ARCHIVE_DIR, `${baseName}.xlsx`));
    fs.copyFileSync(htmlPath, path.join(ARCHIVE_DIR, `${baseName}.html`));
    console.log(`[LƯU TRỮ ARCHIVE] Đã lưu bản snapshot mới: ${baseName}.*`);
    return;
  }

  if (getFileSha256(baseHtmlPath) === contentHash) {
    console.log(`[LƯU TRỮ ARCHIVE] Bản snapshot ${baseName} đã tồn tại với nội dung đồng nhất (bảo toàn, không ghi đè).`);
    return;
  }

  let seq = 1;
  let targetSeq = null;
  while (true) {
    const seqBase = `${baseName}_${String(seq).padStart(2, '0')}`;
    const seqHtmlPath = path.join(ARCHIVE_DIR, `${seqBase}.html`);
    if (!fs.existsSync(seqHtmlPath)) {
      targetSeq = seqBase;
      break;
    }
    if (getFileSha256(seqHtmlPath) === contentHash) {
      console.log(`[LƯU TRỮ ARCHIVE] Bản snapshot ${seqBase} đã tồn tại với nội dung đồng nhất (bảo toàn, không ghi đè).`);
      return;
    }
    seq++;
  }

  fs.copyFileSync(docxPath, path.join(ARCHIVE_DIR, `${targetSeq}.docx`));
  fs.copyFileSync(xlsxPath, path.join(ARCHIVE_DIR, `${targetSeq}.xlsx`));
  fs.copyFileSync(htmlPath, path.join(ARCHIVE_DIR, `${targetSeq}.html`));
  console.log(`[LƯU TRỮ ARCHIVE] Phát hiện bản snapshot cùng ngày có nội dung mới -> Đã lưu thêm bản tuần tự: ${targetSeq}.*`);
}



export async function renderContract(catalog, toolDir, outputDir) {
  // Lazy loading keeps read-only check and source updates independent of Word/Excel cache.
  ({Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, HeadingLevel, AlignmentType, BorderStyle, WidthType, ShadingType, ImageRun, Header, Footer, PageNumber} = await import('docx'));
  ExcelJS = (await import('exceljs')).default;
  DATA_DIR = path.join(toolDir,'data'); OUTPUT_DIR = outputDir; ARCHIVE_DIR = path.join(outputDir,'archive');
  exportDate = catalog.metadata.date; exportDateTime = catalog.metadata.date;
  fs.mkdirSync(OUTPUT_DIR,{recursive:true}); fs.mkdirSync(ARCHIVE_DIR,{recursive:true});
  const docxPath = await generateDocx(catalog);
  const xlsxPath = await generateXlsx(catalog);
  const htmlPath = generateHtml(catalog);
  archiveOutput(catalog,docxPath,xlsxPath,htmlPath);
  return [docxPath,xlsxPath,htmlPath];
}

// Keep the original export/update/open workflow and the same three output names.
async function main() {
  const args = new Set(process.argv.slice(2));
  const allowed = new Set(['--check','--json','--update','-u','--open','-o','--data-only','--print-source-hashes']);
  for (const arg of args) if (!allowed.has(arg)) throw Error('Unknown argument: ' + arg);
  if (args.has('--print-source-hashes')) {
    console.log(stableJSON(sourceHashes(REPO_ROOT,json(path.join(TOOL_DIR,'contract-config.json')))));
    return;
  }
  const isUpdate = args.has('--update') || args.has('-u');
  const isOpen = args.has('--open') || args.has('-o');
  if (args.has('--check') && isUpdate) throw Error('--check is read-only; do not combine with --update');
  if (args.has('--data-only') && !isUpdate) throw Error('--data-only requires --update');
  const packet = checkContract(REPO_ROOT,{checkCatalog:!isUpdate});
  const summary = {status:packet.errors.length?'FAIL':'PASS',routes:packet.routes.length,
    operations:packet.operations.length,errors:packet.errors};
  if (args.has('--json')) console.log(stableJSON(summary));
  else {
    console.log('API CONTRACT CHECK = ' + summary.status + '; routes=' + summary.routes + '; operations=' + summary.operations);
    for (const error of summary.errors) console.error(error);
  }
  if (packet.errors.length) { process.exitCode=1; return; }
  if (args.has('--check')) return;
  let catalog = loadCatalog();
  if (isUpdate) catalog = smartMergeCatalog(catalog,crawlRepository(packet));
  if (args.has('--data-only')) return;
  console.log('IDEA ENGINEERING — BỘ XUẤT ĐẶC TẢ GIAO TIẾP API (SPEC-API-001)');
  console.log('Phiên bản: v' + catalog.metadata.version + ' | ' + catalog.endpoints.length + ' mục');
  const outputs = await renderContract(catalog,TOOL_DIR,path.join(TOOL_DIR,'output'));
  for (const output of outputs) console.log('EXPORTED ' + output);
  if (isOpen) {
    if (process.platform !== 'win32') throw Error('--open is Windows-only; open the HTML path manually');
    execSync('start "" "' + outputs[2] + '"',{shell:'cmd.exe'});
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename)
  main().catch(error=>{console.error('API CONTRACT ERROR: ' + error.message);process.exitCode=1;});
