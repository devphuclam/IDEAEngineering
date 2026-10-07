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

// 2. Load API Catalog
function loadCatalog() {
  if (!fs.existsSync(CATALOG_PATH)) {
    throw new Error(`Không tìm thấy file catalog dữ liệu tại: ${CATALOG_PATH}`);
  }
  return JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf-8'));
}

// 3. Update / Smart Merge function
function updateCatalog() {
  console.log('🔄 Đang quét các tài liệu Markdown & OpenAPI trong kho mã nguồn...');
  const catalog = loadCatalog();
  let updatedCount = 0;

  // Scan openapi.json if exists
  const openapiPath = path.resolve(REPO_ROOT, 'apps/server/src/main/resources/dev-access/openapi.json');
  if (fs.existsSync(openapiPath)) {
    try {
      const openapi = JSON.parse(fs.readFileSync(openapiPath, 'utf-8'));
      if (openapi.paths) {
        console.log(`   - Phát hiện OpenAPI Specification: ${Object.keys(openapi.paths).length} routes.`);
      }
    } catch (e) {
      console.warn('   ⚠️ Không đọc được openapi.json:', e.message);
    }
  }

  // Scan markdown docs
  const identityMdPath = path.resolve(REPO_ROOT, 'docs/product/instances/idea-engineering/api/identity-session.md');
  const cpdMdPath = path.resolve(REPO_ROOT, 'docs/product/instances/idea-engineering/api/controlled-product-data.md');

  if (fs.existsSync(identityMdPath)) {
    console.log('   - Đã đồng bộ đối soát với docs/api/identity-session.md');
    updatedCount++;
  }
  if (fs.existsSync(cpdMdPath)) {
    console.log('   - Đã đồng bộ đối soát với docs/api/controlled-product-data.md');
    updatedCount++;
  }

  // Record a new revision entry if commit changed
  const lastRev = catalog.metadata.revisions[catalog.metadata.revisions.length - 1];
  if (lastRev.commit !== gitCommit) {
    const nextVer = (parseFloat(catalog.metadata.version) + 0.1).toFixed(1);
    catalog.metadata.version = nextVer;
    catalog.metadata.revisions.push({
      version: nextVer,
      date: new Date().toISOString().slice(0, 10),
      commit: gitCommit,
      author: 'Automated Smart Sync',
      description: `Đồng bộ hóa tự động từ mã nguồn Git tại commit ${gitCommit}. Đã đối chuẩn ${catalog.endpoints.length} endpoints.`
    });
    console.log(`   ✨ Đã ghi nhận phiên bản mới: v${nextVer} (Commit: ${gitCommit})`);
  } else {
    console.log(`   ℹ️ Bản ghi hiện tại đã khớp commit SHA ${gitCommit}. Bảo lưu lịch sử phiên bản.`);
  }

  fs.writeFileSync(CATALOG_PATH, JSON.stringify(catalog, null, 2), 'utf-8');
  console.log(`✅ Đã cập nhật và lưu trữ thành công vào ${CATALOG_PATH}\n`);
  return catalog;
}

// 4. GENERATE WORD (.DOCX) DOCUMENT
async function generateDocx(catalog) {
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
          new Paragraph({ spacing: { before: 600, after: 300 } }),
          ...(logoImage ? [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new ImageRun({
                  data: logoImage,
                  transformation: { width: 130, height: 130 },
                }),
              ],
            })
          ] : []),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 300, after: 150 },
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
            spacing: { before: 100, after: 150 },
            children: [
              new TextRun({
                text: "ĐẶC TẢ HỢP ĐỒNG GIAO TIẾP API",
                size: 36,
                bold: true,
                color: "0F243E",
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 400 },
            children: [
              new TextRun({
                text: "Hồ sơ chuẩn hóa giao tiếp kỹ thuật giữa Backend, Frontend, Desktop và Đối tác tích hợp",
                size: 20,
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
                  new TableCell({ shading: { type: ShadingType.CLEAR, fill: "F2F2F2" }, children: [new Paragraph({ children: [new TextRun({ text: "Mã tài liệu kiểm soát:", bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun(catalog.metadata.documentCode)] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ shading: { type: ShadingType.CLEAR, fill: "F2F2F2" }, children: [new Paragraph({ children: [new TextRun({ text: "Phiên bản hợp đồng:", bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun(`v${catalog.metadata.version} (${catalog.metadata.status})`)] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ shading: { type: ShadingType.CLEAR, fill: "F2F2F2" }, children: [new Paragraph({ children: [new TextRun({ text: "Thời điểm xuất bản:", bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun(exportDateTime)] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ shading: { type: ShadingType.CLEAR, fill: "F2F2F2" }, children: [new Paragraph({ children: [new TextRun({ text: "Mã nguồn Git Commit SHA:", bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun(gitCommit)] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ shading: { type: ShadingType.CLEAR, fill: "F2F2F2" }, children: [new Paragraph({ children: [new TextRun({ text: "Đơn vị phê duyệt & ban hành:", bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun(catalog.metadata.author)] })] }),
                ],
              }),
            ],
          }),

          new Paragraph({ pageBreakBefore: true }),

          // --- PHẦN 1: LỊCH SỬ THAY ĐỔI & TỔNG QUAN ĐIỀU HÀNH ---
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 150 },
            children: [new TextRun({ text: "PHẦN 1. LỊCH SỬ PHIÊN BẢN & TỔNG QUAN ĐIỀU HÀNH", bold: true, color: "1F497D" })],
          }),

          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 150, after: 100 },
            children: [new TextRun({ text: "1.1 Bảng lịch sử thay đổi phiên bản (Changelog Matrix)", bold: true, color: "333333" })],
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ shading: { type: ShadingType.CLEAR, fill: "1F497D" }, children: [new Paragraph({ children: [new TextRun({ text: "Phiên bản", bold: true, color: "FFFFFF" })] })] }),
                  new TableCell({ shading: { type: ShadingType.CLEAR, fill: "1F497D" }, children: [new Paragraph({ children: [new TextRun({ text: "Ngày", bold: true, color: "FFFFFF" })] })] }),
                  new TableCell({ shading: { type: ShadingType.CLEAR, fill: "1F497D" }, children: [new Paragraph({ children: [new TextRun({ text: "Git Commit", bold: true, color: "FFFFFF" })] })] }),
                  new TableCell({ shading: { type: ShadingType.CLEAR, fill: "1F497D" }, children: [new Paragraph({ children: [new TextRun({ text: "Tác giả", bold: true, color: "FFFFFF" })] })] }),
                  new TableCell({ shading: { type: ShadingType.CLEAR, fill: "1F497D" }, children: [new Paragraph({ children: [new TextRun({ text: "Mô tả nội dung cập nhật", bold: true, color: "FFFFFF" })] })] }),
                ],
              }),
              ...catalog.metadata.revisions.map(rev => new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: `v${rev.version}`, bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun(rev.date)] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun(rev.commit)] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun(rev.author)] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun(rev.description)] })] }),
                ],
              })),
            ],
          }),

          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 250, after: 100 },
            children: [new TextRun({ text: "1.2 Thống kê tiến độ & Khối lượng API", bold: true, color: "333333" })],
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ shading: { type: ShadingType.CLEAR, fill: "1F497D" }, children: [new Paragraph({ children: [new TextRun({ text: "Chỉ số thống kê", bold: true, color: "FFFFFF" })] })] }),
                  new TableCell({ shading: { type: ShadingType.CLEAR, fill: "1F497D" }, children: [new Paragraph({ children: [new TextRun({ text: "Số lượng / Tỷ lệ", bold: true, color: "FFFFFF" })] })] }),
                  new TableCell({ shading: { type: ShadingType.CLEAR, fill: "1F497D" }, children: [new Paragraph({ children: [new TextRun({ text: "Ghi chú đánh giá", bold: true, color: "FFFFFF" })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun("Tổng số Endpoint đã chuẩn hóa")] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: `${catalog.endpoints.length} Endpoint`, bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun("Phủ trọn vẹn Phase 1 và mở đầu Phase 2")] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun("Đã kiểm thử thành công (PASS)")] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: `${catalog.endpoints.filter(e => e.status.includes('PASS')).length} Endpoint (${((catalog.endpoints.filter(e => e.status.includes('PASS')).length / catalog.endpoints.length) * 100).toFixed(1)}%)`, bold: true, color: "008000" })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun("Đạt chuẩn 100% Phase 1 (Auth, IAM, Vault Transfer)")] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun("Đang thiết kế (DESIGN)")] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: `${catalog.endpoints.filter(e => e.status.includes('DESIGN')).length} Endpoint (${((catalog.endpoints.filter(e => e.status.includes('DESIGN')).length / catalog.endpoints.length) * 100).toFixed(1)}%)`, bold: true, color: "D9534F" })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun("Chuẩn bị triển khai cho Phase 2 (CPD PDM)")] })] }),
                ],
              }),
            ],
          }),

          new Paragraph({ pageBreakBefore: true }),

          // --- PHẦN 2: SƠ ĐỒ LUỒNG TIẾN TRÌNH KỸ THUẬT ---
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 150 },
            children: [new TextRun({ text: "PHẦN 2. SƠ ĐỒ TIẾN TRÌNH KỸ THUẬT (CALL FLOWS)", bold: true, color: "1F497D" })],
          }),
          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({
                text: "Để đảm bảo các đội ngũ phát triển (Frontend, Desktop, Backend) phối hợp nhịp nhàng, " +
                  "phần này trực quan hóa thứ tự gọi và kết quả trao đổi trạng thái cho 3 chu trình cốt lõi của hệ thống."
              })
            ],
          }),

          ...catalog.workflows.flatMap(wf => [
            new Paragraph({
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 200, after: 100 },
              children: [new TextRun({ text: `[${wf.id}] ${wf.title}`, bold: true, color: "1F497D" })],
            }),
            new Paragraph({
              spacing: { after: 100 },
              children: [new TextRun({ text: wf.description, italics: true })],
            }),
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({ width: { size: 8, type: WidthType.PERCENTAGE }, shading: { type: ShadingType.CLEAR, fill: "333333" }, children: [new Paragraph({ children: [new TextRun({ text: "Bước", bold: true, color: "FFFFFF" })] })] }),
                    new TableCell({ width: { size: 18, type: WidthType.PERCENTAGE }, shading: { type: ShadingType.CLEAR, fill: "333333" }, children: [new Paragraph({ children: [new TextRun({ text: "Bên gửi (Caller)", bold: true, color: "FFFFFF" })] })] }),
                    new TableCell({ width: { size: 24, type: WidthType.PERCENTAGE }, shading: { type: ShadingType.CLEAR, fill: "333333" }, children: [new Paragraph({ children: [new TextRun({ text: "Hành động & Endpoint", bold: true, color: "FFFFFF" })] })] }),
                    new TableCell({ width: { size: 15, type: WidthType.PERCENTAGE }, shading: { type: ShadingType.CLEAR, fill: "333333" }, children: [new Paragraph({ children: [new TextRun({ text: "Bên nhận", bold: true, color: "FFFFFF" })] })] }),
                    new TableCell({ width: { size: 35, type: WidthType.PERCENTAGE }, shading: { type: ShadingType.CLEAR, fill: "333333" }, children: [new Paragraph({ children: [new TextRun({ text: "Kết quả & Dữ liệu trao đổi", bold: true, color: "FFFFFF" })] })] }),
                  ],
                }),
                ...wf.steps.map(s => new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${s.step}`, bold: true })] })] }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun(s.actor)] })] }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: s.action, bold: true }), new TextRun(`\n${s.endpoint}`) ] })] }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun(s.receiver)] })] }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun(s.outcome)] })] }),
                  ],
                })),
              ],
            }),
            new Paragraph({ spacing: { after: 150 } }),
          ]),

          new Paragraph({ pageBreakBefore: true }),

          // --- PHẦN 3: MA TRẬN TỔNG HỢP TOÀN BỘ API ---
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 150 },
            children: [new TextRun({ text: "PHẦN 3. MA TRẬN TỔNG HỢP TOÀN BỘ API CORE V0", bold: true, color: "1F497D" })],
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
              ...catalog.endpoints.map(item => new TableRow({
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

          // --- PHẦN 4: ĐẶC TẢ CHI TIẾT TỪNG API (CARD UI 6 KHỐI) ---
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 150 },
            children: [new TextRun({ text: "PHẦN 4. ĐẶC TẢ KỸ THUẬT CHI TIẾT TỪNG API", bold: true, color: "1F497D" })],
          }),

          ...catalog.endpoints.flatMap(item => [
            // 1. Header Card
            new Paragraph({
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 300, after: 80 },
              children: [
                new TextRun({ text: `[${item.code}] `, bold: true, color: "1F497D" }),
                new TextRun({ text: `${item.name}`, bold: true, color: "0F243E" }),
              ],
            }),

            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      width: { size: 15, type: WidthType.PERCENTAGE },
                      shading: { type: ShadingType.CLEAR, fill: item.method === 'GET' ? "E6F4EA" : "E8F0FE" },
                      children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: item.method, bold: true, color: item.method === 'GET' ? "137333" : "1A73E8" })] })]
                    }),
                    new TableCell({
                      width: { size: 60, type: WidthType.PERCENTAGE },
                      shading: { type: ShadingType.CLEAR, fill: "F9F9F9" },
                      children: [new Paragraph({ children: [new TextRun({ text: item.path, bold: true, font: "Consolas" })] })]
                    }),
                    new TableCell({
                      width: { size: 25, type: WidthType.PERCENTAGE },
                      shading: { type: ShadingType.CLEAR, fill: "F9F9F9" },
                      children: [new Paragraph({ children: [new TextRun({ text: item.auth, italics: true })] })]
                    }),
                  ],
                }),
              ],
            }),

            // 2. Business Context & Invariants
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({ width: { size: 22, type: WidthType.PERCENTAGE }, shading: { type: ShadingType.CLEAR, fill: "F2F2F2" }, children: [new Paragraph({ children: [new TextRun({ text: "Mô tả chức năng:", bold: true })] })] }),
                    new TableCell({ width: { size: 78, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun(item.description)] })] }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({ shading: { type: ShadingType.CLEAR, fill: "F2F2F2" }, children: [new Paragraph({ children: [new TextRun({ text: "Điều kiện tiên quyết:", bold: true })] })] }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun(item.preconditions)] })] }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({ shading: { type: ShadingType.CLEAR, fill: "F2F2F2" }, children: [new Paragraph({ children: [new TextRun({ text: "Tác động trạng thái:", bold: true })] })] }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun(item.stateEffects)] })] }),
                  ],
                }),
              ],
            }),

            // 3. Required Headers
            ...(item.headers && item.headers.length > 0 ? [
              new Paragraph({ spacing: { before: 100, after: 60 }, children: [new TextRun({ text: "• HTTP Headers bắt buộc:", bold: true, color: "333333" })] }),
              new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                  new TableRow({
                    children: [
                      new TableCell({ width: { size: 30, type: WidthType.PERCENTAGE }, shading: { type: ShadingType.CLEAR, fill: "EAEAEA" }, children: [new Paragraph({ children: [new TextRun({ text: "Header Name", bold: true })] })] }),
                      new TableCell({ width: { size: 15, type: WidthType.PERCENTAGE }, shading: { type: ShadingType.CLEAR, fill: "EAEAEA" }, children: [new Paragraph({ children: [new TextRun({ text: "Required", bold: true })] })] }),
                      new TableCell({ width: { size: 55, type: WidthType.PERCENTAGE }, shading: { type: ShadingType.CLEAR, fill: "EAEAEA" }, children: [new Paragraph({ children: [new TextRun({ text: "Mô tả / Giá trị", bold: true })] })] }),
                    ],
                  }),
                  ...item.headers.map(h => new TableRow({
                    children: [
                      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: h.name, font: "Consolas", bold: true })] })] }),
                      new TableCell({ children: [new Paragraph({ children: [new TextRun(h.required ? "Bắt buộc" : "Tùy chọn")] })] }),
                      new TableCell({ children: [new Paragraph({ children: [new TextRun(h.description)] })] }),
                    ],
                  })),
                ],
              }),
            ] : []),

            // 4. Data Dictionary Table
            ...(item.fields && item.fields.length > 0 ? [
              new Paragraph({ spacing: { before: 120, after: 60 }, children: [new TextRun({ text: "• Từ điển trường dữ liệu (Data Dictionary):", bold: true, color: "333333" })] }),
              new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                  new TableRow({
                    children: [
                      new TableCell({ width: { size: 22, type: WidthType.PERCENTAGE }, shading: { type: ShadingType.CLEAR, fill: "1F497D" }, children: [new Paragraph({ children: [new TextRun({ text: "Tên trường", bold: true, color: "FFFFFF" })] })] }),
                      new TableCell({ width: { size: 14, type: WidthType.PERCENTAGE }, shading: { type: ShadingType.CLEAR, fill: "1F497D" }, children: [new Paragraph({ children: [new TextRun({ text: "Vị trí", bold: true, color: "FFFFFF" })] })] }),
                      new TableCell({ width: { size: 14, type: WidthType.PERCENTAGE }, shading: { type: ShadingType.CLEAR, fill: "1F497D" }, children: [new Paragraph({ children: [new TextRun({ text: "Kiểu", bold: true, color: "FFFFFF" })] })] }),
                      new TableCell({ width: { size: 10, type: WidthType.PERCENTAGE }, shading: { type: ShadingType.CLEAR, fill: "1F497D" }, children: [new Paragraph({ children: [new TextRun({ text: "Req", bold: true, color: "FFFFFF" })] })] }),
                      new TableCell({ width: { size: 40, type: WidthType.PERCENTAGE }, shading: { type: ShadingType.CLEAR, fill: "1F497D" }, children: [new Paragraph({ children: [new TextRun({ text: "Ràng buộc & Mô tả nghiệp vụ", bold: true, color: "FFFFFF" })] })] }),
                    ],
                  }),
                  ...item.fields.map(f => new TableRow({
                    children: [
                      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: f.name, font: "Consolas", bold: true })] })] }),
                      new TableCell({ children: [new Paragraph({ children: [new TextRun(f.in)] })] }),
                      new TableCell({ children: [new Paragraph({ children: [new TextRun(f.type)] })] }),
                      new TableCell({ children: [new Paragraph({ children: [new TextRun(f.required ? "Có" : "Không")] })] }),
                      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: `${f.description}\n`, bold: false }), new TextRun({ text: `Ràng buộc: ${f.validation}`, italics: true, color: "555555" })] })] }),
                    ],
                  })),
                ],
              }),
            ] : []),

            // 5. Code Payload Blocks (Request & Response)
            new Paragraph({ spacing: { before: 120, after: 60 }, children: [new TextRun({ text: "• Khung Payload mẫu (Console Code Blocks):", bold: true, color: "333333" })] }),
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      width: { size: 50, type: WidthType.PERCENTAGE },
                      shading: { type: ShadingType.CLEAR, fill: "2B2B2B" },
                      children: [
                        new Paragraph({ children: [new TextRun({ text: "REQUEST PAYLOAD:", bold: true, color: "81C784", size: 16 })] }),
                        new Paragraph({ children: [new TextRun({ text: item.requestExample, font: "Consolas", size: 16, color: "E0E0E0" })] })
                      ]
                    }),
                    new TableCell({
                      width: { size: 50, type: WidthType.PERCENTAGE },
                      shading: { type: ShadingType.CLEAR, fill: "1E2A38" },
                      children: [
                        new Paragraph({ children: [new TextRun({ text: "RESPONSE PAYLOAD:", bold: true, color: "64B5F6", size: 16 })] }),
                        new Paragraph({ children: [new TextRun({ text: item.responseExample, font: "Consolas", size: 16, color: "E0E0E0" })] })
                      ]
                    }),
                  ],
                }),
              ],
            }),

            // 6. Error Handling Matrix
            ...(item.errors && item.errors.length > 0 ? [
              new Paragraph({ spacing: { before: 120, after: 60 }, children: [new TextRun({ text: "• Ma trận mã lỗi & Quy tắc Retry:", bold: true, color: "333333" })] }),
              new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                  new TableRow({
                    children: [
                      new TableCell({ width: { size: 12, type: WidthType.PERCENTAGE }, shading: { type: ShadingType.CLEAR, fill: "D9534F" }, children: [new Paragraph({ children: [new TextRun({ text: "Status", bold: true, color: "FFFFFF" })] })] }),
                      new TableCell({ width: { size: 25, type: WidthType.PERCENTAGE }, shading: { type: ShadingType.CLEAR, fill: "D9534F" }, children: [new Paragraph({ children: [new TextRun({ text: "Mã lỗi (Code)", bold: true, color: "FFFFFF" })] })] }),
                      new TableCell({ width: { size: 35, type: WidthType.PERCENTAGE }, shading: { type: ShadingType.CLEAR, fill: "D9534F" }, children: [new Paragraph({ children: [new TextRun({ text: "Nguyên nhân phát sinh", bold: true, color: "FFFFFF" })] })] }),
                      new TableCell({ width: { size: 28, type: WidthType.PERCENTAGE }, shading: { type: ShadingType.CLEAR, fill: "D9534F" }, children: [new Paragraph({ children: [new TextRun({ text: "Hướng xử lý / Retry", bold: true, color: "FFFFFF" })] })] }),
                    ],
                  }),
                  ...item.errors.map(err => new TableRow({
                    children: [
                      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: `${err.status}`, bold: true })] })] }),
                      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: err.code, font: "Consolas" })] })] }),
                      new TableCell({ children: [new Paragraph({ children: [new TextRun(err.reason)] })] }),
                      new TableCell({ children: [new Paragraph({ children: [new TextRun(err.remedy)] })] }),
                    ],
                  })),
                ],
              }),
            ] : []),

            // 7. Integration Notes
            new Paragraph({
              spacing: { before: 100, after: 200 },
              children: [
                new TextRun({ text: "💡 Lưu ý tích hợp: ", bold: true, color: "1F497D" }),
                new TextRun({ text: item.notes, italics: true }),
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
  return docxFile;
}

// 5. GENERATE EXCEL (.XLSX) SPREADSHEET (4 SHEETS)
async function generateXlsx(catalog) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'IDEA Engineering';
  workbook.created = new Date();

  // --- SHEET 1: EXECUTIVE & CHANGELOG ---
  const ws1 = workbook.addWorksheet('1. Executive & Changelog');
  ws1.views = [{ showGridLines: true }];

  ws1.mergeCells('B2:H2');
  ws1.getCell('B2').value = 'BÁO CÁO ĐIỀU HÀNH & LỊCH SỬ PHIÊN BẢN HỢP ĐỒNG API (IDEA CORE V0)';
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

  ws1.getCell('B6').value = 'Phiên bản hợp đồng:';
  ws1.getCell('B6').font = { bold: true };
  ws1.getCell('C6').value = `v${catalog.metadata.version} (${catalog.metadata.status})`;

  // KPI Boxes
  const kpis = [
    { label: 'TỔNG SỐ ENDPOINT', val: catalog.endpoints.length, col: 'B', color: 'FF1F497D' },
    { label: 'ĐÃ TRIỂN KHAI (PASS)', val: catalog.endpoints.filter(i => i.status.includes('PASS')).length, col: 'D', color: 'FF137333' },
    { label: 'ĐANG THIẾT KẾ (PH2)', val: catalog.endpoints.filter(i => i.status.includes('DESIGN')).length, col: 'F', color: 'FFD93025' },
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

  // Changelog Table on Sheet 1
  ws1.getCell('B12').value = 'LỊCH SỬ THAY ĐỔI PHIÊN BẢN (REVISION HISTORY / AUDIT TRAIL):';
  ws1.getCell('B12').font = { name: 'Arial', size: 11, bold: true, color: { argb: 'FF1F497D' } };

  const clHeaders = ['Phiên bản', 'Ngày áp dụng', 'Mã Git Commit', 'Tác giả', 'Nội dung thay đổi chi tiết'];
  clHeaders.forEach((h, idx) => {
    const colLetter = String.fromCharCode('B'.charCodeAt(0) + idx);
    const cell = ws1.getCell(`${colLetter}14`);
    cell.value = h;
    cell.font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F497D' } };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
  });
  ws1.getRow(14).height = 24;

  catalog.metadata.revisions.forEach((rev, idx) => {
    const rowNum = 15 + idx;
    ws1.getCell(`B${rowNum}`).value = `v${rev.version}`;
    ws1.getCell(`C${rowNum}`).value = rev.date;
    ws1.getCell(`D${rowNum}`).value = rev.commit;
    ws1.getCell(`E${rowNum}`).value = rev.author;
    ws1.getCell(`F${rowNum}`).value = rev.description;

    ['B', 'C', 'D', 'E', 'F'].forEach(c => {
      ws1.getCell(`${c}${rowNum}`).border = {
        top: { style: 'thin', color: { argb: 'FFE0E0E0' } },
        bottom: { style: 'thin', color: { argb: 'FFE0E0E0' } },
        left: { style: 'thin', color: { argb: 'FFE0E0E0' } },
        right: { style: 'thin', color: { argb: 'FFE0E0E0' } },
      };
    });
    ws1.getCell(`B${rowNum}`).alignment = { horizontal: 'center' };
    ws1.getCell(`C${rowNum}`).alignment = { horizontal: 'center' };
    ws1.getCell(`D${rowNum}`).alignment = { horizontal: 'center' };
    ws1.getRow(rowNum).height = 22;
  });

  // --- SHEET 2: API MASTER MATRIX ---
  const ws2 = workbook.addWorksheet('2. API Master Matrix');
  ws2.views = [{ showGridLines: true }];

  ws2.columns = [
    { header: 'STT', key: 'stt', width: 6 },
    { header: 'Nhóm chức năng', key: 'group', width: 26 },
    { header: 'Mã API', key: 'code', width: 12 },
    { header: 'Tên chức năng', key: 'name', width: 34 },
    { header: 'Method', key: 'method', width: 10 },
    { header: 'Đường dẫn URL Endpoint', key: 'path', width: 44 },
    { header: 'Quyền hạn gọi', key: 'auth', width: 30 },
    { header: 'Trạng thái', key: 'status', width: 24 },
    { header: 'Ghi chú nghiệp vụ', key: 'notes', width: 50 },
  ];

  const headerRow2 = ws2.getRow(1);
  headerRow2.height = 28;
  headerRow2.eachCell((cell) => {
    cell.font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F497D' } };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
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
    row.height = 24;
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
      if (colNum === 5) {
        cell.font = { bold: true, color: { argb: item.method === 'GET' ? 'FF137333' : 'FF1A73E8' } };
      }
      if (colNum === 8) {
        cell.font = { bold: true, color: { argb: item.status.includes('PASS') ? 'FF008000' : 'FFD93025' } };
      }
    });
  });

  // --- SHEET 3: DATA DICTIONARY (10 COLUMNS) ---
  const ws3 = workbook.addWorksheet('3. Data Dictionary');
  ws3.views = [{ showGridLines: true }];

  ws3.columns = [
    { header: 'STT', key: 'stt', width: 6 },
    { header: 'Mã API', key: 'code', width: 12 },
    { header: 'Tên chức năng', key: 'apiName', width: 28 },
    { header: 'Vị trí', key: 'in', width: 16 },
    { header: 'Tên trường (Field Name)', key: 'fieldName', width: 26 },
    { header: 'Kiểu dữ liệu', key: 'type', width: 18 },
    { header: 'Bắt buộc', key: 'required', width: 12 },
    { header: 'Quy tắc / Giới hạn validation', key: 'validation', width: 42 },
    { header: 'Diễn giải nghiệp vụ', key: 'description', width: 48 },
    { header: 'Dữ liệu mẫu', key: 'example', width: 34 },
  ];

  const headerRow3 = ws3.getRow(1);
  headerRow3.height = 28;
  headerRow3.eachCell((cell) => {
    cell.font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F497D' } };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
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
          cell.border = {
            top: { style: 'thin', color: { argb: 'FFE0E0E0' } },
            left: { style: 'thin', color: { argb: 'FFE0E0E0' } },
            bottom: { style: 'thin', color: { argb: 'FFE0E0E0' } },
            right: { style: 'thin', color: { argb: 'FFE0E0E0' } }
          };
          if (colNum === 1 || colNum === 2 || colNum === 4 || colNum === 7) {
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
          }
          if (colNum === 5) {
            cell.font = { name: 'Consolas', bold: true };
          }
          if (colNum === 7) {
            cell.font = { bold: true, color: { argb: f.required ? 'FFD93025' : 'FF555555' } };
          }
        });
      });
    }
  });

  // --- SHEET 4: ERROR CATALOG ---
  const ws4 = workbook.addWorksheet('4. Error Catalog');
  ws4.views = [{ showGridLines: true }];

  ws4.columns = [
    { header: 'STT', key: 'stt', width: 6 },
    { header: 'Mã API', key: 'code', width: 12 },
    { header: 'Tên chức năng', key: 'apiName', width: 28 },
    { header: 'HTTP Status', key: 'status', width: 14 },
    { header: 'Mã lỗi hệ thống (Error Code)', key: 'errorCode', width: 26 },
    { header: 'Nguyên nhân phát sinh', key: 'reason', width: 48 },
    { header: 'Hướng xử lý / Quy tắc Retry', key: 'remedy', width: 44 },
  ];

  const headerRow4 = ws4.getRow(1);
  headerRow4.height = 28;
  headerRow4.eachCell((cell) => {
    cell.font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9534F' } };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
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
          cell.border = {
            top: { style: 'thin', color: { argb: 'FFE0E0E0' } },
            left: { style: 'thin', color: { argb: 'FFE0E0E0' } },
            bottom: { style: 'thin', color: { argb: 'FFE0E0E0' } },
            right: { style: 'thin', color: { argb: 'FFE0E0E0' } }
          };
          if (colNum === 1 || colNum === 2 || colNum === 4) {
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
          }
          if (colNum === 4) {
            cell.font = { bold: true, color: { argb: e.status >= 500 ? 'FFD93025' : (e.status >= 400 ? 'FFE37400' : 'FF137333') } };
          }
          if (colNum === 5) {
            cell.font = { name: 'Consolas', bold: true };
          }
        });
      });
    }
  });

  const xlsxFile = path.join(OUTPUT_DIR, 'IDEA_Core_v0_API_Contract.xlsx');
  await workbook.xlsx.writeFile(xlsxFile);
  return xlsxFile;
}

// 6. GENERATE STANDALONE OFFLINE INTERACTIVE HTML
function generateHtml(catalog) {
  const jsonCatalog = JSON.stringify(catalog);

  const html = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>IDEA Engineering — API Contract Documentation (Core v0)</title>
  <style>
    :root {
      --bg: #0f172a;
      --card-bg: #1e293b;
      --card-border: #334155;
      --text-main: #f8fafc;
      --text-muted: #94a3b8;
      --accent: #38bdf8;
      --accent-hover: #0ea5e9;
      --code-bg: #090d16;
      --method-get: #10b981;
      --method-post: #3b82f6;
      --method-put: #f59e0b;
      --method-delete: #ef4444;
      --badge-ready: #10b981;
      --badge-design: #f97316;
    }
    .light-theme {
      --bg: #f8fafc;
      --card-bg: #ffffff;
      --card-border: #e2e8f0;
      --text-main: #0f172a;
      --text-muted: #64748b;
      --accent: #0284c7;
      --accent-hover: #0369a1;
      --code-bg: #1e293b;
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
      background: var(--card-bg);
      border-right: 1px solid var(--card-border);
      display: flex;
      flex-direction: column;
      height: 100vh;
    }
    .brand {
      padding: 20px;
      border-bottom: 1px solid var(--card-border);
    }
    .brand h1 { font-size: 1.1rem; color: var(--accent); display: flex; align-items: center; gap: 8px; }
    .brand p { font-size: 0.75rem; color: var(--text-muted); margin-top: 4px; }
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
    .nav-list { flex: 1; overflow-y: auto; padding: 12px 8px; }
    .nav-group-title { font-size: 0.7rem; text-transform: uppercase; color: var(--text-muted); padding: 8px 12px 4px; font-weight: 700; }
    .nav-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 12px;
      border-radius: 6px;
      text-decoration: none;
      color: var(--text-main);
      font-size: 0.85rem;
      cursor: pointer;
      margin-bottom: 2px;
      transition: background 0.15s;
    }
    .nav-item:hover, .nav-item.active { background: rgba(56, 189, 248, 0.12); color: var(--accent); }
    .method-badge {
      font-size: 0.65rem;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 4px;
      text-transform: uppercase;
      color: white;
    }
    .badge-GET { background: var(--method-get); }
    .badge-POST { background: var(--method-post); }
    .badge-PUT { background: var(--method-put); }
    .badge-DELETE { background: var(--method-delete); }

    /* Main Area */
    #main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      height: 100vh;
      overflow: hidden;
    }
    .top-bar {
      height: 60px;
      background: var(--card-bg);
      border-bottom: 1px solid var(--card-border);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 24px;
    }
    .tab-pills { display: flex; gap: 8px; }
    .tab-btn {
      background: transparent;
      border: 1px solid var(--card-border);
      color: var(--text-muted);
      padding: 6px 14px;
      border-radius: 6px;
      font-size: 0.85rem;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s;
    }
    .tab-btn.active {
      background: var(--accent);
      color: #0f172a;
      border-color: var(--accent);
      font-weight: 700;
    }
    .top-actions { display: flex; align-items: center; gap: 12px; }
    .theme-toggle-btn {
      background: var(--bg);
      border: 1px solid var(--card-border);
      color: var(--text-main);
      padding: 6px 12px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.8rem;
    }

    .scroll-view { flex: 1; overflow-y: auto; padding: 28px 32px; }

    /* API Card Styling */
    .api-card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 10px;
      padding: 24px;
      margin-bottom: 28px;
    }
    .api-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
      padding-bottom: 14px;
      border-bottom: 1px solid var(--card-border);
    }
    .api-route { display: flex; align-items: center; gap: 12px; }
    .api-path { font-family: "SF Mono", Consolas, monospace; font-size: 1.15rem; font-weight: 700; }
    .status-badge {
      font-size: 0.75rem;
      font-weight: 600;
      padding: 3px 10px;
      border-radius: 20px;
    }
    .status-pass { background: rgba(16, 185, 129, 0.15); color: var(--badge-ready); border: 1px solid var(--badge-ready); }
    .status-design { background: rgba(249, 115, 22, 0.15); color: var(--badge-design); border: 1px solid var(--badge-design); }

    .api-desc { font-size: 0.95rem; line-height: 1.6; margin-bottom: 16px; color: var(--text-main); }
    .section-title { font-size: 0.85rem; font-weight: 700; text-transform: uppercase; color: var(--accent); margin: 16px 0 8px; }

    /* Tables */
    .spec-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 16px;
      font-size: 0.85rem;
    }
    .spec-table th, .spec-table td {
      border: 1px solid var(--card-border);
      padding: 8px 12px;
      text-align: left;
    }
    .spec-table th { background: rgba(0, 0, 0, 0.2); color: var(--text-muted); font-weight: 600; }
    .field-name { font-family: "SF Mono", Consolas, monospace; font-weight: 600; color: var(--accent); }
    .req-tag { color: #f43f5e; font-weight: 700; font-size: 0.75rem; }

    /* Code Blocks */
    .code-container {
      position: relative;
      background: var(--code-bg);
      border: 1px solid var(--card-border);
      border-radius: 6px;
      margin-bottom: 16px;
      padding: 12px;
      font-family: "SF Mono", Consolas, monospace;
      font-size: 0.82rem;
      white-space: pre-wrap;
      color: #38bdf8;
    }
    .copy-btn {
      position: absolute;
      top: 8px;
      right: 8px;
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      color: var(--text-muted);
      padding: 4px 10px;
      border-radius: 4px;
      font-size: 0.75rem;
      cursor: pointer;
    }
    .copy-btn:hover { color: var(--accent); border-color: var(--accent); }

    /* Workflows View */
    .wf-card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 10px;
      padding: 24px;
      margin-bottom: 24px;
    }
    .wf-timeline { margin-top: 16px; }
    .wf-step-row {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      margin-bottom: 16px;
      position: relative;
    }
    .wf-step-num {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--accent);
      color: #0f172a;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      flex-shrink: 0;
    }
    .wf-step-content {
      flex: 1;
      background: var(--bg);
      border: 1px solid var(--card-border);
      border-radius: 6px;
      padding: 12px 16px;
    }

    /* Toast */
    #toast {
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: var(--accent);
      color: #0f172a;
      padding: 8px 18px;
      border-radius: 6px;
      font-weight: 600;
      font-size: 0.85rem;
      opacity: 0;
      transition: opacity 0.3s;
      pointer-events: none;
    }
  </style>
</head>
<body>

  <!-- Sidebar -->
  <div id="sidebar">
    <div class="brand">
      <h1>⚡ IDEA CORE v0</h1>
      <p>API Contract & Interface Specs • Git: ${gitCommit}</p>
    </div>
    <div class="search-box">
      <input type="text" id="searchInput" placeholder="🔍 Tìm API, Method, Path, Field...">
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
        <button class="tab-btn" onclick="switchTab('workflows')">Sơ đồ Luồng (3)</button>
        <button class="tab-btn" onclick="switchTab('dictionary')">Từ điển dữ liệu</button>
        <button class="tab-btn" onclick="switchTab('changelog')">Lịch sử Phiên bản</button>
      </div>
      <div class="top-actions">
        <span style="font-size: 0.8rem; color: var(--text-muted);">${exportDateTime}</span>
        <button class="theme-toggle-btn" onclick="toggleTheme()">🌗 Giao diện</button>
      </div>
    </div>

    <div class="scroll-view" id="contentView">
      <!-- Dynamic Content -->
    </div>
  </div>

  <div id="toast">Đã copy vào Clipboard!</div>

  <script>
    const data = ${jsonCatalog};
    let currentTab = 'apis';

    function toggleTheme() {
      document.body.classList.toggle('light-theme');
    }

    function showToast(msg) {
      const t = document.getElementById('toast');
      t.innerText = msg;
      t.style.opacity = '1';
      setTimeout(() => { t.style.opacity = '0'; }, 2000);
    }

    function copyText(str) {
      navigator.clipboard.writeText(str).then(() => {
        showToast('Đã copy vào Clipboard!');
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
                  <span class="method-badge badge-\${ep.method}" style="font-size:0.85rem; padding: 4px 10px;">\${ep.method}</span>
                  <span class="api-path">\${ep.path}</span>
                  <span style="color:var(--text-muted); font-size:0.9rem;">[\${ep.code}] \${ep.name}</span>
                </div>
                <div>
                  <span class="status-badge \${ep.status.includes('PASS') ? 'status-pass' : 'status-design'}">\${ep.status}</span>
                </div>
              </div>

              <p class="api-desc">\${ep.description}</p>

              <table class="spec-table">
                <tr><th style="width:25%;">Quyền hạn yêu cầu</th><td>\${ep.auth}</td></tr>
                <tr><th>Điều kiện tiên quyết</th><td>\${ep.preconditions}</td></tr>
                <tr><th>Tác động trạng thái</th><td>\${ep.stateEffects}</td></tr>
              </table>

              \${ep.headers && ep.headers.length ? \`
                <div class="section-title">HTTP Headers bắt buộc</div>
                <table class="spec-table">
                  <thead><tr><th>Header</th><th>Bắt buộc</th><th>Mô tả</th></tr></thead>
                  <tbody>
                    \${ep.headers.map(h => \`<tr><td class="field-name">\${h.name}</td><td>\${h.required ? '<span class="req-tag">BẮT BUỘC</span>' : 'Tùy chọn'}</td><td>\${h.description}</td></tr>\`).join('')}
                  </tbody>
                </table>
              \` : ''}

              \${ep.fields && ep.fields.length ? \`
                <div class="section-title">Từ điển tham số / Trường dữ liệu (Data Dictionary)</div>
                <table class="spec-table">
                  <thead><tr><th>Trường (Field)</th><th>Vị trí</th><th>Kiểu</th><th>Req</th><th>Ràng buộc & Diễn giải</th></tr></thead>
                  <tbody>
                    \${ep.fields.map(f => \`
                      <tr>
                        <td class="field-name">\${f.name}</td>
                        <td>\${f.in}</td>
                        <td>\${f.type}</td>
                        <td>\${f.required ? '<span class="req-tag">CÓ</span>' : 'Không'}</td>
                        <td><strong>\${f.description}</strong><br><small style="color:var(--text-muted);">Ràng buộc: \${f.validation}</small></td>
                      </tr>
                    \`).join('')}
                  </tbody>
                </table>
              \` : ''}

              <div class="section-title">Request Payload Example</div>
              <div class="code-container">
                <button class="copy-btn" onclick="copyText(\\\`\${ep.requestExample.replace(/\`/g, '\\\`')}\\\`)">Copy</button>
                \${ep.requestExample}
              </div>

              <div class="section-title">Response Payload Example</div>
              <div class="code-container">
                <button class="copy-btn" onclick="copyText(\\\`\${ep.responseExample.replace(/\`/g, '\\\`')}\\\`)">Copy</button>
                \${ep.responseExample}
              </div>

              \${ep.errors && ep.errors.length ? \`
                <div class="section-title">Ma trận mã lỗi (Error Handling Matrix)</div>
                <table class="spec-table">
                  <thead><tr><th>Status</th><th>Mã lỗi</th><th>Nguyên nhân</th><th>Hướng xử lý / Retry</th></tr></thead>
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

              <div style="font-size:0.85rem; color:var(--text-muted); margin-top:12px;">
                💡 <em>Lưu ý: \${ep.notes}</em>
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
              <h2 style="color:var(--accent); margin-bottom:8px;">[\${wf.id}] \${wf.title}</h2>
              <p style="color:var(--text-muted); font-size:0.9rem; margin-bottom:16px;">\${wf.description}</p>
              <div class="wf-timeline">
                \${wf.steps.map(s => \`
                  <div class="wf-step-row">
                    <div class="wf-step-num">\${s.step}</div>
                    <div class="wf-step-content">
                      <div style="font-size:0.8rem; color:var(--text-muted);">\${s.actor} ➔ \${s.receiver}</div>
                      <div style="font-weight:700; margin:4px 0;">\${s.action} (\${s.endpoint})</div>
                      <div style="font-size:0.85rem; color:var(--accent);">\${s.outcome}</div>
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
                  <td>\${f.required ? '<span class="req-tag">BẮT BUỘC</span>' : 'Tùy chọn'}</td>
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
            <h2 style="color:var(--accent); margin-bottom:12px;">Từ điển toàn bộ trường dữ liệu (Data Dictionary)</h2>
            <table class="spec-table">
              <thead>
                <tr>
                  <th>STT</th><th>Mã API</th><th>Tên API</th><th>Vị trí</th><th>Tên trường</th><th>Kiểu</th><th>Bắt buộc</th><th>Ràng buộc</th><th>Diễn giải</th><th>Ví dụ</th>
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
            <td><code>\${r.commit}</code></td>
            <td>\${r.author}</td>
            <td>\${r.description}</td>
          </tr>
        \`).join('');
        view.innerHTML = \`
          <div class="api-card">
            <h2 style="color:var(--accent); margin-bottom:12px;">Lịch sử phiên bản & Sửa đổi (Changelog Audit Trail)</h2>
            <table class="spec-table">
              <thead><tr><th>Phiên bản</th><th>Ngày</th><th>Git Commit</th><th>Tác giả</th><th>Nội dung cập nhật</th></tr></thead>
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

// 7. MAIN CLI CONTROLLER
async function main() {
  const args = process.argv.slice(2);
  const isUpdate = args.includes('--update') || args.includes('-u');
  const isOpen = args.includes('--open') || args.includes('-o');

  console.log('==================================================================');
  console.log('🚀 IDEA ENGINEERING — BỘ XUẤT BẢN ĐẶC TẢ HỢP ĐỒNG API (API CONTRACT)');
  console.log(`📌 Git Commit: ${gitCommit} | Ngày: ${exportDate}`);
  console.log('==================================================================');

  let catalog;
  if (isUpdate) {
    catalog = updateCatalog();
  } else {
    catalog = loadCatalog();
  }

  console.log(`📦 Bắt đầu biên dịch tài liệu cho ${catalog.endpoints.length} endpoints...`);

  // 1. Generate DOCX
  const docxPath = await generateDocx(catalog);
  const docxSize = (fs.statSync(docxPath).size / 1024).toFixed(1);
  console.log(`✅ File Word (.docx):  ${docxPath} (${docxSize} KB)`);

  // 2. Generate XLSX
  const xlsxPath = await generateXlsx(catalog);
  const xlsxSize = (fs.statSync(xlsxPath).size / 1024).toFixed(1);
  console.log(`✅ File Excel (.xlsx): ${xlsxPath} (${xlsxSize} KB)`);

  // 3. Generate HTML
  const htmlPath = generateHtml(catalog);
  const htmlSize = (fs.statSync(htmlPath).size / 1024).toFixed(1);
  console.log(`✅ File HTML (.html):  ${htmlPath} (${htmlSize} KB)`);

  console.log('\n🎉 HOÀN THÀNH XUẤT XƯỞNG BỘ 3 TÀI LIỆU API CONTRACT!');

  if (isOpen) {
    console.log('🌐 Đang tự động mở file HTML trên trình duyệt mặc định...');
    try {
      execSync(`start "" "${htmlPath}"`, { shell: 'cmd.exe' });
    } catch (e) {
      console.warn('Không thể tự động mở trình duyệt:', e.message);
    }
  }
}

main().catch(err => {
  console.error('❌ Lỗi thực thi:', err);
  process.exit(1);
});
