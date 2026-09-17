import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { Presentation, PresentationFile } from "@oai/artifact-tool";
import JSZip from "jszip";
import { usedViews, writeDiagramInventory } from "./idea-core-v0-diagram-catalog.mjs";

const REPO = "C:/Users/TD-999/Research/Projects/IDEA/IDEAEngineering";
const SKILL_DIR = "C:/Users/TD-999/.codex/plugins/cache/openai-primary-runtime/presentations/26.909.61513/skills/presentations";
const RUNTIME_PYTHON = "C:/Users/TD-999/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe";
const RUNTIME_NODE_MODULES = "C:/Users/TD-999/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules";
process.env.RUNTIME_NODE_MODULES = RUNTIME_NODE_MODULES;
const TMP_DIR = path.join(REPO, ".tmp", "idea-core-v0-feature-spec-tech-deck");
const FINAL_PPTX = path.join(REPO, "docs", "reports", "IDEA-Engineering-Core-v0-Feature-Spec-Tech-Management-Review-2026-09-16-FINAL.pptx");
const MAPPING_MD = path.join(REPO, "docs", "reports", "IDEA-Engineering-Core-v0-Feature-Spec-Tech-Management-Review-source-map.md");
const INVENTORY_MD = path.join(REPO, "docs", "reports", "IDEA-Engineering-Core-v0-controlled-diagram-inventory-2026-09-16.md");
const COMMIT = "f269a0445737a7efd7f406ee51517149a8967afa";
const GH = `https://github.com/devphuclam/IDEAEngineering/blob/${COMMIT}/`;
const ARCH_EVIDENCE = path.join(REPO, "docs", "product", "instances", "idea-engineering", "evidence", "IE-VEV-ARCH-CORR-005");
const TECH_EVIDENCE = path.join(REPO, "docs", "product", "instances", "idea-engineering", "evidence", "IE-VEV-TECH-VIEW-002");
const hyperlinkManifest = [];

const W = 1280;
const H = 720;
const FONT = "Arial";

const C = {
  navy: "#102744",
  navy2: "#17385F",
  blue: "#2169A8",
  cyan: "#2F8FC2",
  paleBlue: "#EAF3F9",
  paleCyan: "#E8F7F9",
  ink: "#162638",
  slate: "#4B6075",
  steel: "#7890A6",
  line: "#CBD8E3",
  soft: "#F4F7FA",
  white: "#FFFFFF",
  amber: "#C58A1E",
  paleAmber: "#FFF4DD",
  green: "#2D8A62",
  paleGreen: "#E7F5EE",
  red: "#B94A55",
  paleRed: "#FBEAEC",
  purple: "#6C5AA8",
  palePurple: "#F0EDFA",
};

const slidesMeta = [
  { title: "FEATURE → SPEC → TECH", section: "DECISION FRAME", sources: ["DOC-01@0.6", "DOC-04@0.13", "DOC-05@0.20"] },
  { title: "Feature — Core v0 cung cấp những năng lực gì?", section: "FEATURE", sources: ["DOC-01@0.6", "DOC-03@0.7", "FEATURE-001@0.12"] },
  { title: "Feature — Core v0 làm gì và không làm gì?", section: "FEATURE", sources: ["DOC-01@0.6", "DOC-04@0.13"] },
  { title: "Spec — Hệ thống bắt buộc phải vận hành đúng như thế nào?", section: "SPEC", sources: ["DOC-04@0.13", "VVP@0.16"] },
  { title: "Spec — Danh tính và lịch sử dữ liệu", section: "SPEC", sources: ["DOC-04@0.13", "DOC-06@0.16"] },
  { title: "Spec — Chỉnh sửa tài liệu mà không phá lịch sử", section: "SPEC", sources: ["DOC-04@0.13", "DOC-05@0.20", "DOC-06@0.16", "DOC-08@0.12"] },
  { title: "Spec — Product Structure phải tái tạo được lịch sử", section: "SPEC", sources: ["DOC-04@0.13", "DOC-05@0.20", "DOC-06@0.16"] },
  { title: "Spec — Release là một baseline chính xác", section: "SPEC", sources: ["DOC-04@0.13", "DOC-05@0.20", "DOC-06@0.16"] },
  { title: "Spec — Correctness phải giữ được cả khi có lỗi", section: "SPEC", sources: ["DOC-04@0.13", "DOC-05@0.20", "DOC-06@0.16"] },
  { title: "Spec — Requirement chỉ hoàn chỉnh khi kiểm chứng được", section: "SPEC", sources: ["DOC-04@0.13", "VVP@0.16"] },
  { title: "Tech — Engineering hiện thực Spec bằng kiến trúc nào?", section: "TECH", sources: ["DOC-05@0.20", "TECH-001@0.14", "TECH-VIEWS@0.2"] },
  { title: "Tech — Công nghệ nào chịu trách nhiệm gì?", section: "TECH", sources: ["TECH-001@0.14", "TECH-MATRIX@0.6"] },
  { title: "Tech — Các phương án đã được xem xét", section: "TECH", sources: ["TECH-001@0.14", "TECH-MATRIX@0.6", "TECH-VIEWS@0.2"] },
  { title: "Ba quyết định cần Management review", section: "DECISION", sources: ["FEATURE-001@0.12", "DOC-04@0.13", "TECH-001@0.14"] },
];

const naturalSpeakerNotes = [
  [
    "Sơ đồ mở đầu đặt buổi review theo đúng thứ tự từ nhu cầu đến thực hiện.",
    "Feature, Spec và Tech là ba quyết định riêng. Product Decision Authority vẫn chưa ghi nhận quyết định nào, trạng thái hiện tại là NOT-RUN.",
    "Đây không phải kế hoạch triển khai và cũng chưa chứng minh hệ thống đã sẵn sàng để xây dựng.",
    "Khi trình bày, tôi đi từ trái sang phải và dừng ở ba điểm management cần chốt.",
  ],
  [
    "Slide này liệt kê 12 Controlled Views thực sự được dùng trong buổi review.",
    "Mỗi ID mở đúng bản SVG tại commit baseline đã dùng để tạo deck. Inventory 38 view vẫn nằm ở deliverable riêng.",
    "Các view không xuất hiện ở đây vẫn còn hiệu lực. Tôi chỉ loại chúng khỏi main deck vì chúng không hỗ trợ trực tiếp cho quyết định management.",
    "Có thể mở view chi tiết khi cần đọc nhãn nhỏ hoặc kiểm tra source semantics.",
  ],
  [
    "Đây là bản đồ năng lực rút từ 14 controlled Feature groups.",
    "Năm nhóm xung quanh Core v0 tạo thành một vòng đời dữ liệu kỹ thuật có kiểm soát, không phải danh sách màn hình hay sơ đồ module.",
    "Điểm cần xác nhận là các nhóm năng lực này đã phản ánh đúng sản phẩm công ty cần hay chưa.",
    "Sơ đồ không cho biết Feature nào đã được code hoặc đã PASS qualification.",
  ],
  [
    "Hai cột xác định ranh giới Core v0 trước khi Engineering đi sâu hơn vào thiết kế.",
    "Bên trái là phần sản phẩm phải giải quyết. Bên phải là phần để sau hoặc nằm ngoài phạm vi hiện tại.",
    "Các mục để sau không bị loại vĩnh viễn và cũng không được ngầm tính vào Core v0.",
    "Câu hỏi cuối slide là nội dung management cần xác nhận.",
  ],
  [
    "Slide này tách Feature, Spec và Tech để tránh một quyết định bị hiểu thành phê duyệt cả ba lớp.",
    "Spec giữ các quy tắc đúng của sản phẩm và nghĩa vụ kiểm chứng. Tech chỉ chọn cách Engineering đáp ứng các quy tắc đó.",
    "Con số 87 là số requirement trong SRS hiện hành, không phải số requirement đã được kiểm chứng.",
    "Khi trình bày, tôi đi từ capability sang correctness contract rồi mới sang giải pháp kỹ thuật.",
  ],
  [
    "Đây là bản rút gọn của DATA-VIEW-CORE-001.",
    "Tôi dùng sơ đồ này vì Checkout, Review và Release đều phụ thuộc vào việc phân biệt Document, Revision, Version và Generation.",
    "Document giữ danh tính ổn định. Generation là snapshot nội dung bất biến do hệ thống ghi nhận.",
    "G001 đến G004 chỉ là mã minh họa, không phải quy tắc numbering hoặc một loại Version thứ hai.",
    "Khi trình bày, đi từ Document sang Revision A, sau đó sang Revision B.",
  ],
  [
    "Slide này gom trách nhiệm Workspace, Checkout, Reference và Check-in vào một luồng dễ theo dõi.",
    "Checkout mở một controlled editing session. Khi Check-in, Server kiểm tra lại quyền, reservation, baseline và phạm vi trước lúc commit.",
    "Check-in thành công kết thúc quyền giữ sửa trong phạm vi đã xác nhận. Nếu thất bại, hệ thống giữ local work để người dùng xử lý tiếp.",
    "Các mũi tên không mô tả chunk transfer, điều hướng UI hoặc cơ chế tự merge CAD và Office.",
    "Phần Reference ở dưới là nhánh riêng và không có quyền ghi ngược vào tài liệu gốc.",
  ],
  [
    "Structure Snapshot giữ đúng Generation của từng thành phần tại thời điểm Release.",
    "Tôi dùng bản rút gọn này để giải thích vì sao một baseline cũ vẫn tái tạo được sau khi các component có Generation mới.",
    "S12 tiếp tục trỏ tới B3 và C9. Nó không tự chạy theo head hiện tại.",
    "Sơ đồ không quy định bảng database, giao diện BOM hoặc cơ chế tự lan truyền Revision mới.",
  ],
  [
    "Ở slide này có một ý chính: Release giữ đúng baseline đã được duyệt.",
    "Server kiểm tra lại exact Generation, Structure Snapshot, approval, quyền hiện hành và Artifact trước khi tạo Release Record.",
    "Vài tháng sau, hệ thống phải lấy lại đúng baseline đó thay vì chọn file mới nhất.",
    "Approval chưa đủ để bảo đảm Release thành công, và một Project không bắt buộc phải phát hành toàn bộ tài liệu cùng lúc.",
  ],
  [
    "Khối A dùng mô hình quyền hiện hành: Security Principal, exact Role Definition Version và Authorization Scope tạo thành Role Assignment.",
    "Sau khi tìm được assignment phù hợp, Server mới áp dụng Permission và business gates.",
    "Ba khối còn lại cho thấy cách giữ correctness khi dữ liệu stale, request phải retry hoặc một bước xử lý thất bại.",
    "Đây không phải mô hình Account Type hoặc Permission Policy cũ. Audit chỉ ghi bằng chứng, không cấp quyền và không thay quyết định nghiệp vụ.",
  ],
  [
    "Chuỗi phía trên nối requirement với acceptance, verification và bằng chứng thực thi.",
    "Tôi dùng ví dụ Release để cho thấy một câu yêu cầu phải dẫn đến cách kiểm tra cụ thể.",
    "Việc đã viết verification method chưa có nghĩa là kết quả PASS. Executed evidence phải được ghi riêng sau khi chạy kiểm chứng.",
    "Đọc chuỗi trên trước, sau đó đối chiếu ví dụ ở phần dưới.",
  ],
  [
    "Sơ đồ này rút gọn TECH-D01 và phần deployment liên quan trong TECH-D05.",
    "React cung cấp business UI dùng chung. Java/Spring giữ Core Server authority. Workspace .NET xử lý ranh giới Windows và file cục bộ.",
    "Format Worker boundary đã được chọn, nhưng chỉ dùng khi CAD, Office hoặc license yêu cầu. Runtime và toolchain cụ thể vẫn chưa được chọn, qualification còn NOT-RUN.",
    "Đây chưa phải topology production, sizing, HA design hoặc bằng chứng các technology đã PASS.",
  ],
  [
    "Bảng này gắn từng technology với một trách nhiệm và ranh giới công việc cụ thể.",
    "Java/Spring giữ Core Server. .NET nằm ở Windows integration boundary. React là business UI chung cho Web và Desktop.",
    "Cách chia này tránh tạo hai backend hoặc hai bộ giao diện nghiệp vụ cạnh tranh.",
    "Bảng chưa chọn runtime và toolchain cho Format Worker, cũng chưa chứng minh compatibility hay operational readiness.",
  ],
  [
    "TECH-D08 ghi baseline Engineering, alternative và điều kiện mở lại từng quyết định.",
    "Khi trigger xảy ra, Successor Decision có thể giữ baseline hiện tại hoặc chọn một alternative đã qualification.",
    "Trigger không tự động chọn .NET, Flutter hoặc Microservices.",
    "Q-15 vẫn là PARTIAL / NO WINNER. Flutter vẫn là viable evaluated alternative, còn Product Decision Authority chưa phê duyệt baseline.",
  ],
  [
    "Slide cuối phần chính tách ba quyết định management cần đưa ra.",
    "Feature xác nhận phạm vi. Spec xác nhận correctness contract. Tech xác nhận Engineering baseline được phép đi tiếp sang qualification.",
    "Mỗi quyết định có thể nhận kết quả khác nhau hoặc kèm điều kiện riêng.",
    "Slide chưa ghi nhận approval. Product Decision Authority vẫn ở trạng thái NOT-RUN.",
  ],
  [
    "Đây là ARCH-VIEW-RBAC-001 nguyên bản dùng làm source cho bản rút gọn ở slide 10.",
    "Cần nhìn mối liên kết giữa Security Principal, exact Role Definition Version, Authorization Scope và Role Assignment.",
    "Vị trí đường nối không biểu thị thứ tự đánh giá. Đây cũng không phải workflow người dùng, thiết kế UI hoặc database schema.",
    "Mở SVG toàn độ phân giải nếu cần kiểm tra từng quan hệ.",
  ],
  [
    "Đây là TECH-D04 nguyên bản về runtime boundary, protocol và trust zone.",
    "View này nằm ở appendix để trả lời câu hỏi kỹ thuật khi cần, thay vì làm nặng phần trình bày chính.",
    "Nó chưa ấn định port, số host, firewall rule, capacity, HA hoặc runtime cụ thể của Format Worker.",
    "Khi đọc, bắt đầu từ Web và Windows user zone, đi xuống Server trust zone rồi xem Worker contract ở bên phải.",
  ],
  [
    "Đây là TECH-D05 nguyên bản về deployment và failure boundary của Engineering baseline.",
    "Sơ đồ cho thấy Server VM là một failure domain, backup tách riêng và Windows Format Worker được cô lập.",
    "Nó chưa phải production topology được duyệt, chưa có capacity result và không cam kết HA.",
    "Khi cần đọc nhãn nhỏ, mở controlled SVG bằng hyperlink trên slide.",
  ],
];

let diagramNoteCursor = 0;

function addText(slide, text, x, y, w, h, opts = {}) {
  const shape = slide.shapes.add({
    geometry: "textbox",
    position: { left: x, top: y, width: w, height: h },
    fill: "none",
    line: { fill: "none", width: 0 },
  });
  shape.text = text;
  shape.text.style = {
    typeface: FONT,
    fontSize: opts.size ?? 24,
    bold: opts.bold ?? false,
    color: opts.color ?? C.ink,
    alignment: opts.align ?? "left",
    autoFit: "none",
  };
  shape.name = opts.name ?? `text-${Math.round(x)}-${Math.round(y)}-${text.slice(0, 16)}`;
  return shape;
}

function addBox(slide, x, y, w, h, opts = {}) {
  const shape = slide.shapes.add({
    geometry: opts.geometry ?? "roundRect",
    position: { left: x, top: y, width: w, height: h },
    fill: opts.fill ?? C.white,
    line: { fill: opts.line ?? C.line, width: opts.lineWidth ?? 1.2, style: opts.lineStyle ?? "solid" },
  });
  if (opts.text !== undefined) {
    shape.text = opts.text;
    shape.text.style = {
      typeface: FONT,
      fontSize: opts.size ?? 23,
      bold: opts.bold ?? false,
      color: opts.color ?? C.ink,
      alignment: opts.align ?? "center",
      autoFit: "none",
    };
  }
  shape.name = opts.name ?? `box-${Math.round(x)}-${Math.round(y)}`;
  return shape;
}

function addLine(slide, x, y, w, h = 3, color = C.line) {
  return addBox(slide, x, y, w, h, { geometry: "rect", fill: color, line: color, lineWidth: 0, name: `line-${x}-${y}` });
}

function addArrowText(slide, symbol, x, y, w, h, color = C.blue, size = 30) {
  return addText(slide, symbol, x, y, w, h, { size, color, bold: true, align: "center" });
}

function addPill(slide, text, x, y, w, fill, color = C.navy, opts = {}) {
  return addBox(slide, x, y, w, opts.h ?? 34, {
    text,
    fill,
    line: opts.line ?? fill,
    lineWidth: 0.8,
    size: opts.size ?? 16,
    bold: true,
    color,
    name: opts.name,
  });
}

function addBullet(slide, text, x, y, w, opts = {}) {
  addBox(slide, x, y + 8, 9, 9, { geometry: "ellipse", fill: opts.dot ?? C.blue, line: opts.dot ?? C.blue, lineWidth: 0 });
  addText(slide, text, x + 20, y, w - 20, opts.h ?? 42, { size: opts.size ?? 19, color: opts.color ?? C.ink, bold: opts.bold ?? false });
}

function addHeader(slide, index, title, section, sources) {
  slide.background.fill = C.white;
  addBox(slide, 0, 0, 14, H, { geometry: "rect", fill: section === "FEATURE" ? C.cyan : section === "SPEC" ? C.blue : section === "TECH" ? C.purple : C.navy, line: "none", lineWidth: 0 });
  addText(slide, section, 54, 28, 280, 24, { size: 14, bold: true, color: section === "FEATURE" ? C.cyan : section === "SPEC" ? C.blue : section === "TECH" ? C.purple : C.navy });
  addText(slide, title, 54, 56, 1160, 54, { size: 32, bold: true, color: C.navy });
  addLine(slide, 54, 116, 1170, 2, C.line);
  addText(slide, sources.join(" · "), 54, 683, 1030, 20, { size: 11, color: C.steel });
  addText(slide, String(index).padStart(2, "0"), 1170, 680, 54, 24, { size: 13, bold: true, color: C.steel, align: "right" });
}

function addNotes(slide, lines) {
  slide.speakerNotes.textFrame.setText(lines.join("\n"));
  slide.speakerNotes.setVisible(true);
}

function controlledViewUrl(id) {
  const folder = id.startsWith("TECH-") ?
    "docs/product/instances/idea-engineering/evidence/IE-VEV-TECH-VIEW-002" :
    "docs/product/instances/idea-engineering/evidence/IE-VEV-ARCH-CORR-005";
  return `${GH}${folder}/${id}.svg`;
}

function addSourceLink(slide, slideNumber, id, title, x = 930, y = 122, w = 292, h = 22) {
  const friendlyTitles = {
    "DATA-VIEW-CORE-001": "Released baseline identity",
    "ARCH-VIEW-SEQ-002": "Atomic Check-in",
    "ARCH-VIEW-SEQ-003": "Review and Release",
    "DATA-VIEW-AUTH-001": "Authorization data",
    "ARCH-VIEW-RBAC-001": "RBAC domain",
    "TECH-D01": "Technology Stack",
    "TECH-D03": "Technology Layers",
    "TECH-D04": "Runtime & Protocol",
    "TECH-D05": "Deployment",
    "TECH-D08": "Decision Reopen Map",
  };
  const friendlyTitle = friendlyTitles[id] ?? title;
  const name = `source-link-${slideNumber}-${id}`;
  addText(slide, `${id} · ${friendlyTitle} ↗`, x, y + 3, w, h - 3, {
    size: 9.5,
    bold: true,
    color: C.blue,
    align: "right",
    name,
  });
  hyperlinkManifest.push({ slideNumber, shapeName: name, target: controlledViewUrl(id), id });
}

function addDiagramMeta(slide, slideNumber, { mode, source, why, link }) {
  const prefix = source.includes("·") ? "Sources:" : mode === "Management simplification" ? "Simplified from" : mode === "Direct reuse" ? "Controlled view" : "Based on";
  addText(slide, `${prefix} ${source}`, 54, 125, 730, 15, { size: 9.2, color: C.steel, name: `diagram-source-${slideNumber}` });
  if (link) addSourceLink(slide, slideNumber, link.id, link.title, 798, 122, 424, 22);
}

function addDiagramNotes(slide, diagram, lines = []) {
  const notes = naturalSpeakerNotes[diagramNoteCursor];
  if (!notes) throw new Error(`Missing natural speaker notes for diagram ${diagramNoteCursor + 1}`);
  diagramNoteCursor += 1;
  addNotes(slide, notes.flatMap((paragraph, index) => index === notes.length - 1 ? [paragraph] : [paragraph, ""]));
}

function xmlEscape(value) {
  return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

async function patchPowerPointHyperlinks(pptxPath) {
  const zip = await JSZip.loadAsync(await fs.readFile(pptxPath));
  const applied = [];
  for (const item of hyperlinkManifest) {
    const slidePath = `ppt/slides/slide${item.slideNumber}.xml`;
    const relPath = `ppt/slides/_rels/slide${item.slideNumber}.xml.rels`;
    const slideFile = zip.file(slidePath);
    if (!slideFile) throw new Error(`Missing ${slidePath} while adding hyperlink ${item.id}`);
    let slideXml = await slideFile.async("string");
    const escapedName = item.shapeName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const tagPattern = new RegExp(`<p:cNvPr([^>]*\\bname="${escapedName}"[^>]*)>`);
    const tagMatch = slideXml.match(tagPattern);
    if (!tagMatch) throw new Error(`Shape ${item.shapeName} not found on slide ${item.slideNumber}`);

    let relXml = zip.file(relPath) ? await zip.file(relPath).async("string") :
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"></Relationships>';
    const usedIds = [...relXml.matchAll(/\bId="rId(\d+)"/g)].map((m) => Number(m[1]));
    const relId = `rId${Math.max(0, ...usedIds) + 1}`;
    slideXml = slideXml.replace(tagPattern, `<p:cNvPr$1><a:hlinkClick xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" r:id="${relId}"/>`);
    const relationship = `<Relationship Id="${relId}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink" Target="${xmlEscape(item.target)}" TargetMode="External"/>`;
    relXml = relXml.replace("</Relationships>", `${relationship}</Relationships>`);
    zip.file(slidePath, slideXml);
    zip.file(relPath, relXml);
    applied.push(item);
  }
  if (applied.length !== hyperlinkManifest.length) throw new Error(`Applied ${applied.length}/${hyperlinkManifest.length} hyperlinks`);
  await fs.writeFile(pptxPath, await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" }));
  return applied;
}

async function verifyPowerPointHyperlinks(pptxPath) {
  const zip = await JSZip.loadAsync(await fs.readFile(pptxPath));
  const missing = [];
  for (const item of hyperlinkManifest) {
    const relPath = `ppt/slides/_rels/slide${item.slideNumber}.xml.rels`;
    const relFile = zip.file(relPath);
    const relXml = relFile ? await relFile.async("string") : "";
    if (!relXml.includes(`Target="${xmlEscape(item.target)}"`) || !relXml.includes("relationships/hyperlink")) {
      missing.push(`${item.slideNumber}:${item.id}`);
    }
  }
  if (missing.length) throw new Error(`Hyperlink verification failed: ${missing.join(", ")}`);
  return { expected: hyperlinkManifest.length, verified: hyperlinkManifest.length };
}

function addStep(slide, number, title, sub, x, y, w, fill, accent) {
  addBox(slide, x, y, w, 144, { fill, line: accent, lineWidth: 1.5 });
  addBox(slide, x + 16, y + 16, 38, 38, { geometry: "ellipse", fill: accent, line: accent, text: String(number), size: 18, bold: true, color: C.white });
  addText(slide, title, x + 68, y + 15, w - 84, 34, { size: 24, bold: true, color: C.navy });
  addText(slide, sub, x + 20, y + 66, w - 40, 58, { size: 17, color: C.slate, align: "center" });
}

async function addEvidenceAppendixSlide({ slideNumber, id, title, imagePath, sources, note, diagram }) {
  const slide = presentation.slides.add();
  addHeader(slide, slideNumber, `${id} — ${title}`, "APPENDIX", sources);
  addDiagramMeta(slide, slideNumber, {
    mode: "Direct reuse",
    source: id,
    why: note,
    link: { id, title },
  });
  addBox(slide, 54, 154, 1170, 486, { fill: C.white, line: C.line, lineWidth: 1.1 });
  const image = slide.images.add({
    blob: await fs.readFile(imagePath),
    contentType: "image/png",
    alt: `${id} — ${title}`,
    fit: "contain",
    position: { left: 62, top: 162, width: 1154, height: 470 },
  });
  image.name = `evidence-${id}`;
  addText(slide, "Mở controlled view toàn độ phân giải bằng liên kết phía trên.", 86, 646, 1108, 24, { size: 13, color: C.slate, align: "center" });
  addDiagramNotes(slide, diagram, [
    "This appendix slide reuses the current controlled rendering without redrawing or changing its semantics.",
    "Use the hyperlink on the slide to open the commit-pinned SVG when small labels need full-resolution inspection.",
  ]);
}

const presentation = Presentation.create({ slideSize: { width: W, height: H } });

// Slide 1
{
  const slide = presentation.slides.add();
  slide.background.fill = C.navy;
  addBox(slide, 0, 0, W, 10, { geometry: "rect", fill: C.cyan, line: C.cyan, lineWidth: 0 });
  addText(slide, "IDEA", 72, 38, 170, 44, { size: 30, bold: true, color: C.white });
  addBox(slide, 49, 42, 14, 14, { geometry: "ellipse", fill: "#E1262D", line: "#E1262D", lineWidth: 0 });
  addText(slide, "IDEA Engineering Core v0", 72, 128, 1120, 58, { size: 42, bold: true, color: C.white });
  addText(slide, "Product & Technology Decision Framework", 72, 188, 1120, 40, { size: 26, color: "#BFD7EA" });
  addText(slide, "DOC-01@0.6 · DOC-04@0.13 · DOC-05@0.20", 72, 260, 430, 20, { size: 12, color: "#9FB8CB" });

  const y = 310;
  const xs = [72, 304, 536, 768, 1000];
  const labels = [
    ["Nhu cầu", "Business / Engineering"],
    ["FEATURE", "Phạm vi cần có"],
    ["SPEC", "Điều gì phải luôn đúng"],
    ["TECH", "Cách Engineering xây dựng"],
    ["Thực hiện", "Qualification + Implementation"],
  ];
  labels.forEach((item, i) => {
    const accent = i === 1 ? C.cyan : i === 2 ? "#5EA5D8" : i === 3 ? "#A69ADE" : i === 4 ? C.green : C.steel;
    addBox(slide, xs[i], y, 174, 144, { fill: i === 0 ? "#17385F" : "#16314F", line: accent, lineWidth: 2 });
    addText(slide, item[0], xs[i] + 14, y + 25, 146, 34, { size: 23, bold: true, color: C.white, align: "center" });
    addText(slide, item[1], xs[i] + 15, y + 75, 144, 44, { size: 15, color: "#CADCEB", align: "center" });
    if (i < labels.length - 1) addArrowText(slide, "→", xs[i] + 180, y + 45, 46, 50, "#8EC7E7", 34);
  });
  addText(slide, "Tách ba tầng để phạm vi, quy tắc đúng và giải pháp kỹ thuật không lẫn vai trò.", 72, 525, 1130, 40, { size: 22, color: C.white, align: "center" });
  addText(slide, "Management review · 16/09/2026", 72, 659, 420, 22, { size: 13, color: "#9FB8CB" });
  addText(slide, "DOC-01@0.6 · DOC-04@0.13 · DOC-05@0.20", 745, 659, 463, 22, { size: 11, color: "#9FB8CB", align: "right" });
  addDiagramNotes(slide, {
    what: "A presentation synthesis of the review chain from business need to implementation.",
    why: "It establishes the order of the management discussion before detailed Feature, Spec and Tech views.",
    notice: "FEATURE, SPEC and TECH are separate decisions and Product Decision Authority approval remains NOT-RUN.",
    notInfer: "This is not a delivery plan, approval record or proof of implementation readiness.",
    read: "Read the five stages from left to right.",
  }, [
    "Buổi trình bày này đi theo một chuỗi quyết định: xác định phạm vi, chốt hợp đồng đúng của sản phẩm, rồi mới xem cách Engineering hiện thực.",
    "Feature trả lời cần có năng lực gì, còn Spec quy định năng lực đó phải hành xử đúng ra sao.",
    "Tech chỉ là giải pháp để đáp ứng Feature và Spec, không được tự thay đổi nghiệp vụ.",
    "Ba quyết định hiện vẫn chờ Product Decision Authority xem xét, nên các slide không ngụ ý đã được phê duyệt.",
  ]);
}

// Slide 2 — management review view index
{
  const slide = presentation.slides.add();
  addHeader(slide, 2, "Controlled Views dùng trong buổi review", "DECISION FRAME", ["DOC-05@0.20", "DOC-06@0.16", "TECH-VIEWS@0.2"]);
  addText(slide, "12 view hỗ trợ trực tiếp cho phần trình bày. Inventory 38 view được lưu riêng để tra cứu.", 62, 132, 1150, 24, { size: 14, color: C.slate });
  const addIndexRow = ([id, title, where], x, y, w) => {
    const linkName = `source-link-2-${id}`;
    addText(slide, `${id} · ${title} ↗`, x, y, w - 94, 23, { size: 12.5, bold: true, color: C.blue, name: linkName });
    addText(slide, where, x + w - 90, y + 1, 90, 20, { size: 10.5, bold: true, color: C.steel, align: "right" });
    addLine(slide, x, y + 30, w, 1, C.line);
    hyperlinkManifest.push({ slideNumber: 2, shapeName: linkName, target: controlledViewUrl(id), id });
  };
  const specViews = [
    ["DATA-VIEW-CORE-001", "Released-baseline identity", "Slide 6"],
    ["ARCH-VIEW-MOD-002", "Controlled Workspace responsibilities", "Slide 7"],
    ["ARCH-VIEW-SEQ-002", "Atomic Check-in publication", "Slide 7"],
    ["DATA-VIEW-WS-001", "Workspace and Check-in evidence", "Slide 7"],
    ["ARCH-VIEW-SEQ-003", "Review and exact Release", "Slide 9"],
    ["ARCH-VIEW-RBAC-001", "Principal-role-scope model", "10, 16"],
    ["DATA-VIEW-AUTH-001", "Role Definition, Scope and Assignment", "Slide 10"],
  ];
  const techViews = [
    ["TECH-D01", "Technology Stack Overview", "Slide 12"],
    ["TECH-D03", "Technology Layer Mapping", "Slide 13"],
    ["TECH-D08", "Decision and Reopen Map", "Slide 14"],
  ];
  const appendixViews = [
    ["TECH-D04", "Runtime and Protocol View", "Slide 17"],
    ["TECH-D05", "Deployment View", "Slide 18"],
  ];
  addText(slide, "SPEC / DATA", 62, 176, 650, 24, { size: 15, bold: true, color: C.navy });
  specViews.forEach((view, i) => addIndexRow(view, 62, 212 + i * 48, 650));
  addText(slide, "TECH", 760, 176, 460, 24, { size: 15, bold: true, color: C.purple });
  techViews.forEach((view, i) => addIndexRow(view, 760, 212 + i * 48, 460));
  addText(slide, "APPENDIX / DEEP DIVE", 760, 410, 460, 24, { size: 15, bold: true, color: C.navy });
  appendixViews.forEach((view, i) => addIndexRow(view, 760, 446 + i * 48, 460));
  addText(slide, "26 view còn lại vẫn nằm trong controlled package.", 760, 574, 460, 24, { size: 13, color: C.slate });
  addDiagramNotes(slide, {
    what: "An index of the 12 controlled views actually used in this management review.",
    why: "It lets management open the exact controlled source behind each simplified presentation view.",
    notice: "The 38-view inventory remains separate. Every visible link is pinned to the reviewed commit baseline.",
    notInfer: "Omitted views are not invalid or deleted. They are excluded only because they do not help this management decision.",
    read: "Use the slide references for context and select 'Mở controlled view' for the full-resolution source.",
  }, [
    "Slide này là mục lục các controlled view thực sự được dùng trong management review, không phải toàn bộ diagram catalogue.",
    "Mỗi dòng mở trực tiếp bản SVG tại commit baseline dùng để tạo presentation.",
    "Các slide chính dùng bản rút gọn để management theo dõi. Appendix giữ ba view chi tiết cần xem khi đi sâu.",
    "Inventory 38 view là deliverable riêng và ghi rõ lý do dùng hoặc không dùng từng view.",
  ]);
}

// Slide 3
{
  const slide = presentation.slides.add();
  addHeader(slide, 3, slidesMeta[1].title, slidesMeta[1].section, slidesMeta[1].sources);
  addDiagramMeta(slide, 3, { mode: "Presentation synthesis", source: "FEATURE-001 + DOC-03", why: "Tóm tắt 14 nhóm năng lực", link: null });
  addBox(slide, 493, 258, 294, 164, { fill: C.navy, line: C.navy, text: "IDEA ENGINEERING\nCORE v0", size: 27, bold: true, color: C.white });
  const groups = [
    { x: 74, y: 160, title: "Controlled Product Data", items: "Identity · Revision · Version\nGeneration · Metadata · History", fill: C.paleBlue, accent: C.blue },
    { x: 74, y: 444, title: "Engineering Workspace", items: "Checkout · Reference · Workspace\nCheck-in · Conflict recovery", fill: C.paleCyan, accent: C.cyan },
    { x: 900, y: 160, title: "Product Structure", items: "Relations · Occurrences · BOM\nImmutable Structure Snapshot", fill: C.paleAmber, accent: C.amber },
    { x: 900, y: 444, title: "Governance", items: "Review · Approval · Release\nAuthorization · Audit", fill: C.paleGreen, accent: C.green },
    { x: 424, y: 500, title: "Integration & Access", items: "IRONCAD / Office · Search / Browse\nWeb / Windows · EN / VI / JA", fill: C.palePurple, accent: C.purple, w: 432 },
  ];
  groups.forEach((g) => {
    const w = g.w ?? 306;
    addBox(slide, g.x, g.y, w, 128, { fill: g.fill, line: g.accent, lineWidth: 1.5 });
    addText(slide, g.title, g.x + 16, g.y + 16, w - 32, 32, { size: 21, bold: true, color: C.navy, align: "center" });
    addText(slide, g.items, g.x + 18, g.y + 58, w - 36, 54, { size: 16, color: C.slate, align: "center" });
  });
  addArrowText(slide, "↖", 405, 212, 70, 60, C.steel, 34);
  addArrowText(slide, "↙", 405, 407, 70, 60, C.steel, 34);
  addArrowText(slide, "↗", 803, 212, 70, 60, C.steel, 34);
  addArrowText(slide, "↘", 803, 407, 70, 60, C.steel, 34);
  addArrowText(slide, "↓", 605, 427, 70, 50, C.steel, 34);
  addPill(slide, "14 nhóm Feature được kiểm soát dưới bản đồ năng lực này", 386, 636, 508, C.soft, C.slate, { size: 15 });
  addDiagramNotes(slide, {
    what: "A management capability map synthesised from the 14 controlled Feature groups.",
    why: "It gives management one readable view of the product before discussing detailed requirements.",
    notice: "The five groups form one controlled product-data lifecycle and remain inside the approved Feature baseline.",
    notInfer: "It is not a module diagram, screen map, implementation sequence or proof that any Feature has been implemented.",
    read: "Start at Core v0 in the centre, then read the five capability groups around it.",
  }, [
    "Core v0 không phải một danh sách màn hình, mà là năm nhóm năng lực tạo thành một vòng đời dữ liệu kỹ thuật có kiểm soát.",
    "Điểm khác file server là sản phẩm quản lý danh tính, lịch sử, quyền giữ sửa, cấu trúc và quyết định phát hành như một hệ thống thống nhất.",
    "Mười bốn nhóm Feature chi tiết nằm bên dưới năm nhóm này, nhưng slide chỉ giữ mức quản lý cần ra quyết định.",
    "Nếu một nhóm lớn không đúng nhu cầu công ty, ta điều chỉnh Feature trước khi bàn sâu hơn về Spec hay Tech.",
  ]);
}

// Slide 4
{
  const slide = presentation.slides.add();
  addHeader(slide, 4, slidesMeta[2].title, slidesMeta[2].section, slidesMeta[2].sources);
  addDiagramMeta(slide, 4, { mode: "Presentation synthesis", source: "DOC-01 + DOC-04", why: "Chốt ranh giới Core v0", link: null });
  addBox(slide, 62, 148, 554, 438, { fill: C.paleBlue, line: C.blue, lineWidth: 1.5 });
  addBox(slide, 664, 148, 554, 438, { fill: C.soft, line: C.steel, lineWidth: 1.5 });
  addPill(slide, "TRONG CORE v0", 84, 170, 190, C.blue, C.white, { size: 17 });
  addPill(slide, "NGOÀI PHẠM VI / ĐỂ SAU", 686, 170, 256, C.steel, C.white, { size: 17 });
  const inside = [
    "Controlled Product Data và lịch sử bất biến",
    "Workspace, Checkout, Reference, Check-in",
    "Product Structure, BOM và Structure Snapshot",
    "Review, Approval, Release và lấy lại đúng baseline",
    "Authorization, Audit, Search, CAD/Office và 3 ngôn ngữ",
  ];
  const outside = [
    "ERP / MRP và tích hợp doanh nghiệp tổng quát",
    "Mua hàng, chấm công, tính chi phí, điều hành sản xuất",
    "Quản lý tiến độ dự án đầy đủ và ECR/ECO hoàn chỉnh",
    "Multi-site, bulk migration và bộ Purge tự động",
    "Trình thiết kế workflow kéo-thả và thêm mọi CAD profile",
  ];
  inside.forEach((t, i) => addBullet(slide, t, 92, 232 + i * 58, 490, { size: 18, dot: C.blue, h: 48 }));
  outside.forEach((t, i) => addBullet(slide, t, 694, 232 + i * 58, 490, { size: 18, dot: C.steel, h: 48 }));
  addBox(slide, 62, 610, 1156, 50, { fill: C.navy, line: C.navy, text: "Management review: Phạm vi này đã đúng với Core v0 công ty cần chưa?", size: 20, bold: true, color: C.white });
  addDiagramNotes(slide, {
    what: "A presentation synthesis of the Core v0 scope boundary.",
    why: "Management must approve what the first product release includes before Engineering expands the design.",
    notice: "The left side is committed product scope. The right side remains outside Core v0 or deferred.",
    notInfer: "Items outside Core v0 are not rejected permanently and are not silently included as supporting functions.",
    read: "Compare the two columns, then use the bottom question as the decision point.",
  }, [
    "Core v0 tập trung vào vòng đời controlled engineering/product data và không mở rộng thành ERP hay MRP.",
    "Các đầu ra phòng ban vẫn có thể được quản lý như tài liệu, cấu trúc hoặc bằng chứng, nhưng những nghiệp vụ như mua hàng và tính chi phí chưa trở thành Feature của Core v0.",
    "Ranh giới này giúp đội nhỏ hoàn thành một vòng nghiệp vụ có giá trị trước khi mở rộng.",
    "Câu hỏi dành cho management là ranh giới này đã phản ánh đúng ưu tiên công ty hay chưa.",
  ]);
}

// Slide 5
{
  const slide = presentation.slides.add();
  addHeader(slide, 5, slidesMeta[3].title, slidesMeta[3].section, slidesMeta[3].sources);
  addDiagramMeta(slide, 5, { mode: "Presentation synthesis", source: "DOC-04 + VVP", why: "Phân biệt Feature, Spec và Tech", link: null });
  addStep(slide, 1, "FEATURE", "Năng lực và phạm vi sản phẩm", 64, 210, 262, C.paleCyan, C.cyan);
  addArrowText(slide, "→", 334, 248, 54, 50, C.blue, 34);
  addBox(slide, 396, 150, 488, 390, { fill: C.paleBlue, line: C.blue, lineWidth: 2 });
  addPill(slide, "SPEC = CÁC QUY TẮC SẢN PHẨM PHẢI ĐÁP ỨNG", 434, 170, 412, C.blue, C.white, { size: 15 });
  const specItems = ["Ngữ nghĩa thông tin", "Chuyển trạng thái", "Quy tắc nghiệp vụ", "Quyền và policy", "Hành vi khi lỗi", "Phục hồi và retry", "Acceptance + Verification"];
  specItems.forEach((t, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 426 + col * 220;
    const y = 232 + row * 65;
    addBox(slide, x, y, i === 6 ? 428 : 198, 45, { fill: C.white, line: C.line, text: t, size: 17, bold: i === 6, color: C.ink });
  });
  addArrowText(slide, "→", 894, 248, 54, 50, C.purple, 34);
  addStep(slide, 3, "TECH", "Kiến trúc và công nghệ đáp ứng Spec", 956, 210, 262, C.palePurple, C.purple);
  addPill(slide, "87 yêu cầu có thể truy vết trong SRS hiện hành", 410, 568, 460, C.navy, C.white, { size: 17, h: 42 });
  addDiagramNotes(slide, {
    what: "A presentation synthesis that separates FEATURE, SPEC and TECH responsibilities.",
    why: "It prevents management approval of one layer from being misread as approval of the other two.",
    notice: "SPEC carries the product correctness contract and verification obligations.",
    notInfer: "The diagram does not define document hierarchy, delivery order or current approval status.",
    read: "Read left to right from capability, through the correctness contract, to the Engineering solution.",
  }, [
    "Feature nói hệ thống phải có capability nào, nhưng chưa đủ để developer biết mọi tình huống phải xử lý ra sao.",
    "Spec biến capability thành hợp đồng đúng gồm dữ liệu, trạng thái, quyền, lỗi, phục hồi và cách kiểm chứng.",
    "Ví dụ, Feature có Check-in; Spec mới quy định Check-in phải atomic, phải kiểm tra baseline và không được làm mất công việc cục bộ khi xung đột.",
    "SRS hiện hành có 87 yêu cầu, nhưng presentation chỉ trình bày các invariant quan trọng nhất thay vì đọc danh sách yêu cầu.",
  ]);
}

// Slide 6
{
  const slide = presentation.slides.add();
  addHeader(slide, 6, slidesMeta[4].title, slidesMeta[4].section, slidesMeta[4].sources);
  addDiagramMeta(slide, 6, { mode: "Management simplification", source: "DATA-VIEW-CORE-001", why: "Giải thích lịch sử dữ liệu", link: { id: "DATA-VIEW-CORE-001", title: "Released-baseline identity" } });
  addBox(slide, 64, 154, 300, 460, { fill: C.navy, line: C.navy });
  addText(slide, "LOGICAL\nDOCUMENT", 102, 196, 224, 84, { size: 30, bold: true, color: C.white, align: "center" });
  addText(slide, "Danh tính ổn định\nqua toàn bộ lịch sử", 94, 307, 240, 72, { size: 19, color: "#C9DBEA", align: "center" });
  addPill(slide, "Đổi tên ≠ tài liệu mới", 100, 420, 228, "#26496E", C.white, { size: 16 });
  addPill(slide, "Published Generation bất biến", 82, 474, 264, "#26496E", C.white, { size: 15 });
  addArrowText(slide, "→", 370, 330, 54, 50, C.blue, 36);

  addBox(slide, 430, 150, 350, 464, { fill: C.paleBlue, line: C.blue, lineWidth: 1.5 });
  addPill(slide, "BUSINESS REVISION A", 454, 170, 302, C.blue, C.white, { size: 17 });
  [["Version 1", "G001"], ["Version 2", "G002"], ["Version 3", "G003"]].forEach((r, i) => {
    const y = 242 + i * 104;
    addBox(slide, 468, y, 128, 62, { fill: C.white, line: C.line, text: r[0], size: 19, bold: true });
    addArrowText(slide, "→", 600, y + 6, 48, 44, C.steel, 28);
    addBox(slide, 650, y, 94, 62, { fill: C.paleGreen, line: C.green, text: r[1], size: 19, bold: true, color: C.green });
  });
  addText(slide, "Version tăng trong cùng Revision", 474, 558, 290, 30, { size: 15, color: C.slate, align: "center" });
  addArrowText(slide, "→", 788, 330, 54, 50, C.blue, 36);

  addBox(slide, 848, 150, 370, 464, { fill: C.paleAmber, line: C.amber, lineWidth: 1.5 });
  addPill(slide, "BUSINESS REVISION B", 872, 170, 322, C.amber, C.white, { size: 17 });
  addBox(slide, 912, 292, 128, 68, { fill: C.white, line: C.line, text: "Version 1", size: 19, bold: true });
  addArrowText(slide, "→", 1046, 301, 48, 44, C.steel, 28);
  addBox(slide, 1096, 292, 94, 68, { fill: C.paleGreen, line: C.green, text: "G004", size: 19, bold: true, color: C.green });
  addText(slide, "Revision mới bắt đầu lại từ Version 1", 884, 405, 302, 58, { size: 18, color: C.slate, align: "center" });
  addBox(slide, 872, 494, 322, 72, { fill: C.white, line: C.amber, text: "Generation = snapshot nội dung\nbất biến do hệ thống ghi nhận", size: 17, bold: true, color: C.ink });
  addText(slide, "Hệ thống lưu được toàn bộ lịch sử kỹ thuật của tài liệu.", 410, 635, 834, 30, { size: 21, bold: true, color: C.navy, align: "center" });
  addDiagramNotes(slide, {
    what: "A management simplification of DATA-VIEW-CORE-001.",
    why: "It explains the four identity concepts management must distinguish when reviewing the Spec.",
    notice: "A Logical Document remains stable, Version restarts inside each Revision, and Generation identifies immutable content.",
    notInfer: "The labels G001…G004 are examples, not a database sequence, user-facing numbering rule or second Version system.",
    read: "Read from the stable Logical Document to Revision A history, then to the new Revision B.",
  }, [
    "Logical Document là danh tính ổn định của tài liệu, nên đổi tên hoặc đổi vị trí không tạo tài liệu mới.",
    "Revision là mốc thay đổi nghiệp vụ được quản lý; Version là thứ tự cập nhật bên trong một Revision.",
    "Mỗi Check-in có thay đổi tạo một Generation bất biến và tăng Version; Check-in không thay đổi nội dung không tạo Generation mới.",
    "Khi mở Revision B, Version bắt đầu lại từ 1, còn Generation vẫn là mã snapshot do hệ thống quản lý.",
    "Cách này cho phép truy lại chính xác nội dung đã review hoặc release ở bất kỳ thời điểm nào.",
  ]);
}

// Slide 7
{
  const slide = presentation.slides.add();
  addHeader(slide, 7, slidesMeta[5].title, slidesMeta[5].section, slidesMeta[5].sources);
  addDiagramMeta(slide, 7, { mode: "Management simplification", source: "ARCH-VIEW-MOD-002 · ARCH-VIEW-SEQ-002 · DATA-VIEW-WS-001", why: "Nêu contract Checkout/Check-in", link: { id: "ARCH-VIEW-SEQ-002", title: "Atomic Check-in publication" } });
  const x = [58, 260, 462, 664, 866];
  const labels = [
    ["SERVER", "Current G005", C.navy, C.white],
    ["CHECKOUT", "Reservation\nActor + Workspace + G005", C.paleBlue, C.navy],
    ["WORKSPACE", "Chỉnh sửa cục bộ\ntrong Office / CAD", C.paleCyan, C.navy],
    ["CHECK-IN", "Gửi thay đổi +\nOperationId + phạm vi", C.palePurple, C.navy],
    ["SERVER", "Revalidate tại lúc commit", C.paleAmber, C.navy],
  ];
  labels.forEach((l, i) => {
    addBox(slide, x[i], 176, 170, 134, { fill: l[2], line: i === 0 ? C.navy : C.line, text: l[0], size: 21, bold: true, color: l[3] });
    addText(slide, l[1], x[i] + 12, 232, 146, 64, { size: 14, color: i === 0 ? "#C9DBEA" : C.slate, align: "center" });
    if (i < labels.length - 1) addArrowText(slide, "→", x[i] + 174, 208, 28, 45, C.blue, 25);
  });
  addBox(slide, 1048, 151, 168, 188, { fill: C.soft, line: C.amber, lineWidth: 1.5 });
  ["Đúng quyền?", "Reservation hợp lệ?", "Baseline hiện hành?", "Scope nhất quán?", "Structure hợp lệ?"].forEach((t, i) => addText(slide, `• ${t}`, 1062, 170 + i * 30, 142, 26, { size: 13, color: C.ink }));

  addBox(slide, 742, 388, 220, 132, { fill: C.paleGreen, line: C.green, lineWidth: 1.6 });
  addText(slide, "PASS", 760, 402, 184, 28, { size: 21, bold: true, color: C.green, align: "center" });
  addText(slide, "Tạo G006 cho nội dung đổi\nKết thúc Checkout trong phạm vi", 756, 442, 192, 62, { size: 13.5, color: C.slate, align: "center" });
  addBox(slide, 1000, 388, 220, 132, { fill: C.paleRed, line: C.red, lineWidth: 1.6 });
  addText(slide, "FAIL", 1018, 402, 184, 28, { size: 21, bold: true, color: C.red, align: "center" });
  addText(slide, "Chặn ghi không an toàn\nGiữ local work + giải thích", 1014, 442, 192, 62, { size: 13.5, color: C.slate, align: "center" });
  addArrowText(slide, "↙", 890, 338, 54, 46, C.green, 28);
  addArrowText(slide, "↘", 1090, 338, 54, 46, C.red, 28);

  addBox(slide, 58, 374, 590, 204, { fill: C.soft, line: C.line });
  addPill(slide, "REFERENCE", 82, 394, 136, C.steel, C.white, { size: 16 });
  addText(slide, "Mở bản tham khảo theo đúng Generation nhưng không nhận quyền công bố vào tài liệu gốc.", 82, 444, 528, 50, { size: 18, color: C.ink });
  addText(slide, "Nếu bản Reference bị sửa, UI phải đưa ra lựa chọn an toàn; không Check-in trực tiếp lên bản gốc.", 82, 510, 528, 50, { size: 16, color: C.slate });
  addBox(slide, 684, 542, 536, 72, { fill: C.navy, line: C.navy, text: "Checkout kiểm soát quyền sửa. Check-in gửi thay đổi vào hệ thống.", size: 19, bold: true, color: C.white });
  addDiagramNotes(slide, {
    what: "A management simplification of the controlled Workspace responsibility, Check-in sequence and data views.",
    why: "Checkout, Reference and Check-in are the most important correctness behaviours in the current review.",
    notice: "The Server revalidates at commit time, successful Check-in ends the confirmed hold, and failure preserves local work.",
    notInfer: "The arrows do not define file-transfer chunking, UI navigation or automatic CAD/Office merge behaviour.",
    read: "Follow the upper path left to right for Checkout and Check-in. Read the lower panel separately for Reference.",
  }, [
    "Checkout tạo quyền giữ sửa gắn với người dùng, Workspace và Generation nền, chứ không chỉ tải file về máy.",
    "Check-in là thao tác gửi thay đổi từ Workspace vào hệ thống, nhưng Server vẫn phải kiểm tra lại quyền, Reservation, baseline, phạm vi và cấu trúc tại lúc commit.",
    "Nếu thành công, mọi tài liệu trong phạm vi được xử lý theo nguyên tắc all-or-none; phần Checkout trong phạm vi được kết thúc cả khi không có nội dung thay đổi.",
    "Nếu stale hoặc sai quyền, hệ thống chặn ghi và giữ công việc cục bộ để người dùng xử lý tiếp.",
    "Reference chỉ phục vụ tham khảo; nó không trao quyền công bố thay đổi vào tài liệu gốc.",
  ]);
}

// Slide 8
{
  const slide = presentation.slides.add();
  addHeader(slide, 8, slidesMeta[6].title, slidesMeta[6].section, slidesMeta[6].sources);
  addDiagramMeta(slide, 8, { mode: "Management simplification", source: "DATA-VIEW-CORE-001", why: "Cho thấy Structure Snapshot ghim bản chính xác", link: { id: "DATA-VIEW-CORE-001", title: "Released-baseline identity" } });
  addBox(slide, 64, 154, 350, 446, { fill: C.soft, line: C.line });
  addPill(slide, "CẤU TRÚC TẠI THỜI ĐIỂM RELEASE", 90, 178, 298, C.navy, C.white, { size: 14 });
  addBox(slide, 136, 242, 208, 70, { fill: C.paleBlue, line: C.blue, text: "Assembly A", size: 23, bold: true });
  addLine(slide, 238, 312, 3, 64, C.steel);
  addLine(slide, 146, 374, 188, 3, C.steel);
  const parts = [["Part B", "B3"], ["Part C", "C9"], ["Drawing D", "D2"]];
  parts.forEach((p, i) => {
    const px = 78 + i * 112;
    addLine(slide, px + 56, 374, 3, 28, C.steel);
    addBox(slide, px, 402, 104, 72, { fill: C.white, line: C.line, text: `${p[0]}\n${p[1]}`, size: 16, bold: true });
  });
  addText(slide, "Quan hệ + occurrence + số lượng\nđược ghi nhận cùng baseline", 98, 510, 282, 58, { size: 16, color: C.slate, align: "center" });
  addArrowText(slide, "→", 430, 330, 58, 50, C.blue, 36);

  addBox(slide, 500, 150, 338, 450, { fill: C.paleGreen, line: C.green, lineWidth: 2 });
  addPill(slide, "STRUCTURE SNAPSHOT S12", 530, 176, 278, C.green, C.white, { size: 17 });
  addText(slide, "Exact immutable pins", 542, 228, 254, 32, { size: 20, bold: true, color: C.green, align: "center" });
  [["Assembly A", "Generation hiện hành"], ["Part B", "B3"], ["Part C", "C9"], ["Drawing D", "D2"]].forEach((p, i) => {
    addBox(slide, 546, 286 + i * 62, 246, 46, { fill: C.white, line: C.line, text: `${p[0]}  →  ${p[1]}`, size: 16, bold: i > 0 });
  });
  addText(slide, "Snapshot không trỏ tới “latest”", 544, 548, 250, 28, { size: 16, bold: true, color: C.red, align: "center" });
  addArrowText(slide, "→", 850, 330, 58, 50, C.blue, 36);

  addBox(slide, 920, 154, 298, 446, { fill: C.paleAmber, line: C.amber, lineWidth: 1.5 });
  addPill(slide, "SAU NÀY", 992, 178, 154, C.amber, C.white, { size: 16 });
  addText(slide, "Part B", 964, 260, 98, 30, { size: 18, bold: true, color: C.ink, align: "right" });
  addText(slide, "B3  →  B4", 1074, 260, 108, 30, { size: 18, bold: true, color: C.blue });
  addText(slide, "Part C", 964, 320, 98, 30, { size: 18, bold: true, color: C.ink, align: "right" });
  addText(slide, "C9  →  C10", 1074, 320, 108, 30, { size: 18, bold: true, color: C.blue });
  addBox(slide, 954, 402, 230, 108, { fill: C.white, line: C.amber, text: "S12 vẫn là\nB3 + C9 + D2", size: 23, bold: true, color: C.navy });
  addText(slide, "Lịch sử không tự đổi theo head hiện tại", 958, 530, 222, 44, { size: 15, color: C.slate, align: "center" });
  addDiagramNotes(slide, {
    what: "A management simplification of released-baseline identity and Structure Snapshot semantics.",
    why: "It makes exact historical reproduction visible without showing the full data model.",
    notice: "The snapshot pins exact Generations and does not move when later heads change.",
    notInfer: "It does not prescribe database tables, BOM screen layout or automatic propagation of later revisions.",
    read: "Read left to right from the structure at Release, to the immutable snapshot, to later document changes.",
  }, [
    "Product Structure không chỉ là cây đang thấy hôm nay; hệ thống phải giữ được cấu trúc chính xác tại từng baseline.",
    "Structure Snapshot S12 ghim đúng Generation của từng thành phần và bản vẽ, cùng quan hệ và occurrence liên quan.",
    "Khi Part B hoặc Part C có Generation mới, S12 vẫn giữ B3 và C9 thay vì tự chạy theo bản mới nhất.",
    "Nhờ vậy Release cũ có thể được tái tạo đúng ngay cả khi các tài liệu thành phần tiếp tục phát triển.",
  ]);
}

// Slide 9
{
  const slide = presentation.slides.add();
  addHeader(slide, 9, slidesMeta[7].title, slidesMeta[7].section, slidesMeta[7].sources);
  addDiagramMeta(slide, 9, { mode: "Management simplification", source: "ARCH-VIEW-SEQ-003", why: "Giải thích Release theo baseline", link: { id: "ARCH-VIEW-SEQ-003", title: "Review and exact Release" } });
  addBox(slide, 54, 158, 300, 176, { fill: C.soft, line: C.line });
  addText(slide, "INPUT BASELINE", 78, 176, 252, 28, { size: 17, bold: true, color: C.navy, align: "center" });
  ["Exact Generations", "Structure Snapshot", "Required Representations"].forEach((t, i) => addPill(slide, t, 90, 222 + i * 38, 228, i === 1 ? C.paleGreen : C.white, C.ink, { size: 14, h: 31, line: C.line }));
  addArrowText(slide, "→", 360, 214, 48, 46, C.blue, 30);
  addBox(slide, 416, 178, 142, 84, { fill: C.paleBlue, line: C.blue, text: "REVIEW", size: 20, bold: true });
  addArrowText(slide, "→", 562, 198, 42, 44, C.blue, 26);
  addBox(slide, 608, 178, 142, 84, { fill: C.paleBlue, line: C.blue, text: "APPROVAL", size: 20, bold: true });
  addArrowText(slide, "→", 754, 198, 42, 44, C.blue, 26);
  addBox(slide, 800, 146, 256, 148, { fill: C.paleAmber, line: C.amber, lineWidth: 1.7 });
  addText(slide, "RELEASE REVALIDATION", 818, 162, 220, 28, { size: 17, bold: true, color: C.navy, align: "center" });
  ["Exact baseline", "Đủ approval", "Quyền hiện hành", "Cấu trúc đầy đủ", "Artifact sẵn sàng"].forEach((t, i) => addText(slide, `• ${t}`, 832, 198 + i * 18, 194, 18, { size: 12, color: C.slate }));
  addArrowText(slide, "→", 1062, 198, 42, 44, C.green, 26);
  addBox(slide, 1110, 170, 116, 100, { fill: C.paleGreen, line: C.green, text: "RELEASE\nRECORD", size: 18, bold: true, color: C.green });

  addBox(slide, 54, 366, 1172, 214, { fill: C.navy, line: C.navy });
  addText(slide, "RELEASE", 82, 394, 190, 32, { size: 23, bold: true, color: C.white });
  addText(slide, "R24", 82, 429, 190, 32, { size: 23, bold: true, color: C.white });
  addText(slide, "baseline chính xác", 84, 466, 188, 24, { size: 14, color: "#BFD7EA" });
  const pins = ["Generation pins", "Structure pin(s)", "Approval + policy", "Artifact digests"];
  pins.forEach((t, i) => addBox(slide, 296 + i * 184, 392, 160, 74, { fill: "#1B3C61", line: "#42698D", text: t, size: 16, bold: true, color: C.white }));
  addArrowText(slide, "→", 1038, 404, 48, 48, "#8EC7E7", 28);
  addBox(slide, 1090, 386, 112, 88, { fill: C.white, line: C.white, text: "Controlled\nPackage", size: 15, bold: true, color: C.navy });
  addLine(slide, 82, 500, 1120, 2, "#315377");
  addText(slide, "Vài tháng sau", 84, 518, 170, 28, { size: 15, color: "#BFD7EA" });
  addArrowText(slide, "→", 252, 513, 44, 34, "#8EC7E7", 24);
  addText(slide, "Retrieve R24", 300, 514, 160, 28, { size: 18, bold: true, color: C.white });
  addArrowText(slide, "→", 468, 513, 44, 34, "#8EC7E7", 24);
  addText(slide, "Đúng cùng Generation + Structure Snapshot + controlled artifacts", 520, 512, 640, 34, { size: 18, bold: true, color: C.white });
  addText(slide, "Release không lấy file mới nhất. Release ghim một baseline đã được duyệt và tái tạo được.", 126, 614, 1028, 36, { size: 22, bold: true, color: C.navy, align: "center" });
  addDiagramNotes(slide, {
    what: "A management simplification of ARCH-VIEW-SEQ-003 and the controlled Release baseline.",
    why: "It separates Review, Approval and Release and shows why Release must revalidate the exact baseline.",
    notice: "The Release Record pins Generations, Structure and controlled artifacts that can be retrieved later.",
    notInfer: "Approval alone does not guarantee Release, and the diagram does not mean every item in a Project must be released together.",
    read: "Read the upper path for the decision flow, then the dark lower band for the immutable Release result.",
  }, [
    "Review và Approval luôn làm việc trên một baseline cụ thể gồm Generation, Structure Snapshot và các Representation bắt buộc.",
    "Ngay trước Release, Server kiểm tra lại toàn bộ baseline, approval, quyền hiện hành, cấu trúc và Artifact.",
    "Release Record ghi các pin chính xác; nó không dùng khái niệm file mới nhất hoặc cấu trúc hiện tại.",
    "Khi lấy lại R24 vài tháng sau, hệ thống phải trả đúng cùng baseline đã phát hành, kể cả các tài liệu có Generation mới hơn.",
    "Đó là lý do shared drive không đủ để thay thế cơ chế Release có kiểm soát.",
  ]);
}

// Slide 10
{
  const slide = presentation.slides.add();
  addHeader(slide, 10, slidesMeta[8].title, slidesMeta[8].section, slidesMeta[8].sources);
  addDiagramMeta(slide, 10, { mode: "Management simplification", source: "ARCH-VIEW-RBAC-001 · DATA-VIEW-AUTH-001", why: "Nêu cách Server quyết định quyền", link: { id: "DATA-VIEW-AUTH-001", title: "Role Definition, Scope and Assignment" } });
  const blocks = [
    { x: 58, y: 150, kind: "authorization", title: "A · AUTHORIZATION", accent: C.blue, fill: C.paleBlue, body: ["Current\nPrincipal", "Role Definition\nVersion (exact)", "Authorization\nScope", "Role\nAssignment"], note: "Server tìm assignment phù hợp rồi mới áp dụng Permission và business gates." },
    { x: 650, y: 150, title: "B · STALE / CONFLICT", accent: C.amber, fill: C.paleAmber, body: ["Local baseline G005", "Server current G006", "Chặn ghi không an toàn", "Giữ local work"], note: "Không tự merge nội dung CAD / Office." },
    { x: 58, y: 400, title: "C · RETRY / PARTIAL FAILURE", accent: C.purple, fill: C.palePurple, body: ["Mất mạng / mất response", "Worker lỗi", "Gửi lại cùng OperationId", "Không nhân đôi kết quả"], note: "Retry phải idempotent và có thể tra trạng thái." },
    { x: 650, y: 400, title: "D · AUDIT / RECOVERY", accent: C.green, fill: C.paleGreen, body: ["WHO + WHAT", "WHICH baseline + WHEN", "WHICH policy", "WHAT outcome"], note: "Audit ghi kết quả và bằng chứng, không thay quyết định." },
  ];
  blocks.forEach((b) => {
    addBox(slide, b.x, b.y, 572, 214, { fill: b.fill, line: b.accent, lineWidth: 1.5 });
    addPill(slide, b.title, b.x + 18, b.y + 16, 250, b.accent, C.white, { size: 15 });
    if (b.kind === "authorization") {
      const positions = [b.x + 22, b.x + 150, b.x + 296];
      b.body.slice(0, 3).forEach((t, i) => addBox(slide, positions[i], b.y + 75, i === 1 ? 130 : 110, 62, { fill: C.white, line: C.line, text: t, size: 11.5, bold: true }));
      addText(slide, "+", b.x + 132, b.y + 90, 18, 30, { size: 19, bold: true, color: b.accent, align: "center" });
      addText(slide, "+", b.x + 278, b.y + 90, 18, 30, { size: 19, bold: true, color: b.accent, align: "center" });
      addArrowText(slide, "→", b.x + 408, b.y + 87, 28, 36, b.accent, 20);
      addBox(slide, b.x + 438, b.y + 75, 110, 62, { fill: C.white, line: b.accent, text: b.body[3], size: 13, bold: true });
    } else {
      b.body.forEach((t, i) => {
        addBox(slide, b.x + 24 + i * 132, b.y + 75, 112, 62, { fill: C.white, line: C.line, text: t, size: 14, bold: i === b.body.length - 1 });
        if (i < b.body.length - 1) addArrowText(slide, "→", b.x + 137 + i * 132, b.y + 86, 28, 36, b.accent, 20);
      });
    }
    addText(slide, b.note, b.x + 24, b.y + 157, 522, 38, { size: 15, color: C.slate, align: "center" });
  });
  addPill(slide, "Spec phải xử lý đúng cả lỗi, retry và recovery", 398, 635, 484, C.navy, C.white, { size: 19, h: 40 });
  addDiagramNotes(slide, {
    what: "A management simplification of the current Principal, Role Definition Version, Authorization Scope and Role Assignment model plus failure handling.",
    why: "It shows that permission and correctness remain Server responsibilities when requests fail or arrive with stale data.",
    notice: "Authorization is evaluated for the current Principal, exact Role Definition Version and Scope before business gates run.",
    notInfer: "This is not the retired Account Type or Permission Policy model, and Audit does not grant permission or make the business decision.",
    read: "Read block A as the authority chain. Blocks B to D describe independent failure and evidence concerns.",
  }, [
    "Spec phải giữ đúng không chỉ khi mọi thứ thuận lợi mà cả khi sai quyền, dữ liệu cũ, mất mạng hoặc Worker lỗi.",
    "Server xác định current Principal, tìm Role Assignment gắn đúng Role Definition Version và Authorization Scope, rồi mới áp dụng Permission và business gates.",
    "Khi baseline cục bộ cũ hơn Server, hệ thống chặn ghi và giữ local work thay vì tự merge CAD hoặc Office.",
    "OperationId giúp retry không tạo thêm Generation hay quyết định nghiệp vụ trùng lặp khi response bị mất.",
    "Audit trả lời ai làm gì trên baseline nào, theo policy nào và kết quả ra sao để phục vụ điều tra và phục hồi.",
  ]);
}

// Slide 11
{
  const slide = presentation.slides.add();
  addHeader(slide, 11, slidesMeta[9].title, slidesMeta[9].section, slidesMeta[9].sources);
  addDiagramMeta(slide, 11, { mode: "Presentation synthesis", source: "DOC-04 + VVP", why: "Nối requirement với bằng chứng", link: null });
  const chain = [
    ["Nhu cầu / Rule", C.paleCyan, C.cyan],
    ["REQ-xxx", C.paleBlue, C.blue],
    ["Acceptance", C.paleBlue, C.blue],
    ["Verification", C.palePurple, C.purple],
    ["Executed Evidence", C.paleAmber, C.amber],
    ["PASS / FAIL / BLOCKED", C.paleGreen, C.green],
  ];
  chain.forEach((item, i) => {
    const x = 58 + i * 197;
    addBox(slide, x, 160, 168, 78, { fill: item[1], line: item[2], text: item[0], size: 16, bold: true, color: C.navy });
    if (i < chain.length - 1) addArrowText(slide, "→", x + 168, 177, 29, 38, C.steel, 20);
  });
  addBox(slide, 58, 286, 1164, 306, { fill: C.soft, line: C.line });
  addPill(slide, "VÍ DỤ: REPRODUCE RELEASE CŨ", 84, 310, 296, C.navy, C.white, { size: 16 });
  addText(slide, "Requirement", 86, 374, 170, 28, { size: 17, bold: true, color: C.blue });
  addText(slide, "Released baseline phải tái tạo chính xác.", 250, 370, 420, 36, { size: 19, color: C.ink });
  addText(slide, "Acceptance", 86, 430, 170, 28, { size: 17, bold: true, color: C.blue });
  addText(slide, "Retrieve Release Record cũ trả đúng Generation, Structure Snapshot và Artifact pins.", 250, 420, 860, 46, { size: 18, color: C.ink });
  addText(slide, "Verification", 86, 496, 170, 28, { size: 17, bold: true, color: C.purple });
  const steps = ["1. Tạo release", "2. Tạo Generation mới", "3. Retrieve release cũ", "4. So manifest + identity + hash"];
  steps.forEach((t, i) => {
    addBox(slide, 250 + i * 224, 486, 202, 62, { fill: C.white, line: C.line, text: t, size: 15, bold: true });
    if (i < steps.length - 1) addArrowText(slide, "→", 452 + i * 224, 500, 22, 32, C.steel, 18);
  });
  addText(slide, "Spec tạo điều kiện để chứng minh implementation đúng hay sai, không chỉ mô tả mong muốn.", 122, 620, 1036, 38, { size: 21, bold: true, color: C.navy, align: "center" });
  addDiagramNotes(slide, {
    what: "A presentation synthesis of the requirement-to-verification chain.",
    why: "It shows how management decisions become testable obligations rather than descriptive prose.",
    notice: "Executed evidence is separate from requirements, acceptance criteria and planned verification.",
    notInfer: "A written verification method is not a PASS result, and the slide does not claim current implementation evidence.",
    read: "Read the top chain left to right, then use the lower Release example to see one requirement traced end to end.",
  }, [
    "Một requirement chỉ đủ chất lượng khi có tiêu chí chấp nhận và phương pháp kiểm chứng rõ ràng.",
    "Ví dụ về Release không dừng ở câu phải tái tạo được; acceptance chỉ ra đúng dữ liệu phải trả và verification chỉ ra cách tạo bằng chứng.",
    "Kết quả thực thi sau này phải ghi PASS, FAIL hoặc BLOCKED, không được suy ra từ việc tài liệu đã được viết.",
    "Chuỗi truy vết này giúp management biết điều gì đang được yêu cầu, điều gì đã thiết kế và điều gì thật sự đã được chứng minh.",
  ]);
}

// Slide 12
{
  const slide = presentation.slides.add();
  addHeader(slide, 12, slidesMeta[10].title, slidesMeta[10].section, slidesMeta[10].sources);
  addDiagramMeta(slide, 12, { mode: "Management simplification", source: "TECH-D01 + TECH-D05", why: "Tóm tắt các khối triển khai", link: { id: "TECH-D01", title: "Technology Stack Overview" } });
  addBox(slide, 58, 150, 370, 470, { fill: C.paleBlue, line: C.blue, lineWidth: 1.5 });
  addPill(slide, "WINDOWS ENGINEERING PC", 94, 170, 298, C.blue, C.white, { size: 16 });
  const clientLayers = [
    ["React business UI", "Dùng chung cho Browser và Desktop"],
    ["WPF / WebView2", "Desktop shell hẹp"],
    [".NET 10 Workspace", "Local files, journal, resume, CAD/Office"],
    ["IRONCAD / Office / Files", "Công cụ thiết kế bên ngoài IDEA"],
  ];
  clientLayers.forEach((r, i) => {
    addBox(slide, 92, 232 + i * 86, 302, 64, { fill: i === 3 ? C.white : "#F9FCFE", line: i === 3 ? C.steel : C.line, text: r[0], size: 18, bold: true, color: C.navy });
    addText(slide, r[1], 104, 268 + i * 86, 278, 23, { size: 12, color: C.slate, align: "center" });
    if (i < clientLayers.length - 1) addArrowText(slide, "↓", 220, 296 + i * 86, 50, 24, C.steel, 18);
  });

  addArrowText(slide, "HTTPS / JSON  →", 432, 326, 142, 46, C.blue, 20);
  addBox(slide, 574, 150, 404, 470, { fill: C.soft, line: C.navy, lineWidth: 1.8 });
  addPill(slide, "LINUX SERVER", 682, 170, 188, C.navy, C.white, { size: 16 });
  addBox(slide, 614, 230, 324, 92, { fill: C.white, line: C.navy, text: "Java 25 / Spring Boot\nSpring Modulith", size: 21, bold: true, color: C.navy });
  addText(slide, "Core product authority + modular monolith", 628, 326, 296, 28, { size: 14, color: C.slate, align: "center" });
  addBox(slide, 614, 388, 142, 118, { fill: C.paleGreen, line: C.green, text: "PostgreSQL 18\nMetadata + state", size: 15, bold: true, color: C.ink });
  addBox(slide, 796, 388, 142, 118, { fill: C.paleAmber, line: C.amber, text: "Artifact Store\nImmutable bytes", size: 15, bold: true, color: C.ink });
  addBox(slide, 646, 530, 260, 54, { fill: C.white, line: C.line, text: "Transactional outbox + observability", size: 15, bold: true });
  addArrowText(slide, "→", 988, 326, 44, 46, C.purple, 28);
  addBox(slide, 1032, 202, 190, 290, { fill: C.palePurple, line: C.purple, lineWidth: 1.5 });
  addPill(slide, "WINDOWS FORMAT WORKER", 1048, 220, 158, C.purple, C.white, { size: 12, h: 40 });
  addText(slide, "Boundary đã chọn", 1056, 290, 142, 28, { size: 18, bold: true, color: C.purple, align: "center" });
  addText(slide, "Chỉ dùng khi CAD / Office / license yêu cầu xử lý riêng", 1052, 336, 150, 78, { size: 16, color: C.ink, align: "center" });
  addText(slide, "Runtime / toolchain: chưa chọn\nQualification: NOT-RUN", 1046, 424, 162, 58, { size: 11.5, bold: true, color: C.red, align: "center" });
  addBox(slide, 1032, 520, 190, 64, { fill: C.white, line: C.line, text: "Candidate output\nServer quyết định nhận hay từ chối", size: 13, bold: true });
  addText(slide, "Core Server giữ product authority. Windows boundary xử lý file và format khi cần.", 224, 642, 838, 26, { size: 13, color: C.steel, align: "center" });
  addDiagramNotes(slide, {
    what: "A management simplification of TECH-D01 and deployment concerns from TECH-D05.",
    why: "It shows the principal runtime boundaries without forcing management to read the detailed deployment view.",
    notice: "React supplies the shared business UI, the Server keeps product authority, and the Format Worker boundary is selected while its exact runtime remains unselected.",
    notInfer: "It is not a final host topology, capacity design, HA design or proof that the selected technologies passed qualification.",
    read: "Read from the Windows engineering PC to the Server. Treat the Format Worker as a separate conditional-use boundary.",
  }, [
    "Kiến trúc tách rõ máy kỹ sư Windows, Server Linux và Windows Format Worker khi cần xử lý theo ứng dụng hoặc license.",
    "React là business UI dùng chung; WPF chỉ bọc Desktop và kết nối tới Workspace .NET chịu trách nhiệm với file cục bộ, journal và CAD/Office.",
    "Server Java giữ product authority, PostgreSQL giữ metadata và state, còn Artifact Store giữ bytes bất biến.",
    "Format Worker boundary đã được chọn cho Core v0, nhưng chỉ triển khai hoặc dùng khi CAD, Office hay license yêu cầu.",
    "Runtime và toolchain chính xác của Worker vẫn qualification-dependent và chưa được tài liệu này tự chọn.",
  ]);
}

// Slide 13
{
  const slide = presentation.slides.add();
  addHeader(slide, 13, slidesMeta[11].title, slidesMeta[11].section, slidesMeta[11].sources);
  addDiagramMeta(slide, 13, { mode: "Management simplification", source: "TECH-D03", why: "Gắn công nghệ với trách nhiệm", link: { id: "TECH-D03", title: "Technology Layer Mapping" } });
  const rows = [
    { role: "Business UI", tech: "React + TypeScript", why: "Tìm kiếm, duyệt, review và quản trị trên Web lẫn Desktop", color: C.cyan, fill: C.paleCyan },
    { role: "Windows shell", tech: "WPF + WebView2", why: "Bề mặt Desktop hẹp; tái sử dụng business UI", color: C.blue, fill: C.paleBlue },
    { role: "Local engineering boundary", tech: ".NET 10 Workspace + Named Pipes", why: "File cục bộ, manifest, resume, CAD/Office và IPC có xác thực", color: C.blue, fill: C.paleBlue },
    { role: "Remote contract", tech: "HTTPS / JSON REST / OpenAPI 3.1", why: "Hợp đồng versioned giữa Client, Workspace và Server", color: C.cyan, fill: C.paleCyan },
    { role: "Core Server", tech: "Java 25 + Spring Boot + Modulith", why: "Product authority, transaction, policy, workflow, release và API", color: C.purple, fill: C.palePurple },
    { role: "Server platform", tech: "Ubuntu Server 26.04 LTS", why: "Platform direction; exact operational build còn Q-14 NOT-RUN", color: C.purple, fill: C.palePurple },
    { role: "Authoritative data", tech: "PostgreSQL 18 + Artifact Store", why: "Metadata/state có giao dịch + binary bất biến", color: C.green, fill: C.paleGreen },
    { role: "Format processing", tech: "Windows Format Worker", why: "Boundary đã chọn; exact runtime/toolchain chưa được chọn", color: C.amber, fill: C.paleAmber },
  ].map((row, i) => ({ ...row, y: 166 + i * 58 }));
  addText(slide, "TRÁCH NHIỆM", 66, 147, 260, 18, { size: 11.5, bold: true, color: C.steel });
  addText(slide, "CÔNG NGHỆ", 346, 147, 330, 18, { size: 11.5, bold: true, color: C.steel });
  addText(slide, "RANH GIỚI CÔNG VIỆC", 700, 147, 500, 18, { size: 11.5, bold: true, color: C.steel });
  rows.forEach((r) => {
    addBox(slide, 58, r.y, 1164, 52, { fill: r.fill, line: C.line, lineWidth: 1 });
    addBox(slide, 58, r.y, 10, 52, { geometry: "rect", fill: r.color, line: r.color, lineWidth: 0 });
    addText(slide, r.role, 82, r.y + 12, 246, 30, { size: 14.5, bold: true, color: C.navy });
    addText(slide, r.tech, 346, r.y + 12, 330, 30, { size: 15, bold: true, color: C.ink });
    addText(slide, r.why, 700, r.y + 7, 492, 38, { size: 13.5, color: C.slate });
  });
  addText(slide, "Mỗi technology chỉ chịu trách nhiệm trong boundary đã xác định.", 118, 638, 1044, 26, { size: 16, bold: true, color: C.navy, align: "center" });
  addDiagramNotes(slide, {
    what: "A management simplification of TECH-D03 Technology Layer Mapping.",
    why: "It explains why the stack contains different technology families without assigning duplicate product authority.",
    notice: "Each row gives one technology family a bounded responsibility.",
    notInfer: "The table does not select the exact Format Worker runtime/toolchain and does not prove compatibility or operational readiness.",
    read: "Read across each row from responsibility, to technology, to the boundary of work it owns.",
  }, [
    "Slide này giải thích vì sao hệ thống có cả Java và .NET mà không phải hai backend cạnh tranh.",
    "Java/Spring đảm nhiệm Core Server, còn .NET nằm ở ranh giới Windows cần làm việc với file cục bộ, CAD, Office và Named Pipes.",
    "React là business UI chung cho Web và Desktop, nên WPF không được phát triển thành một bộ giao diện nghiệp vụ thứ hai.",
    "HTTPS JSON REST và OpenAPI 3.1 là hợp đồng versioned giữa Client, Workspace và Server; Ubuntu 26.04 là platform direction nhưng exact operational build còn Q-14 NOT-RUN.",
    "PostgreSQL giữ metadata và state; Artifact Store giữ binary bất biến để không gắn danh tính sản phẩm vào đường dẫn lưu trữ.",
    "Mỗi công nghệ có một trách nhiệm và một ranh giới rõ, giúp qualification và thay thế sau này có kiểm soát.",
  ]);
}

// Slide 14
{
  const slide = presentation.slides.add();
  addHeader(slide, 14, slidesMeta[12].title, slidesMeta[12].section, slidesMeta[12].sources);
  addDiagramMeta(slide, 14, { mode: "Management simplification", source: "TECH-D08", why: "Giải thích điều kiện mở lại", link: { id: "TECH-D08", title: "Technology Decision and Reopen Map" } });
  const decisions = [
    {
      y: 150, label: "SERVER", selected: "Java 25 + Spring Boot / Modulith", alt: ".NET 10 + ASP.NET Core", rationale: "Chọn hẹp vì fit với modular-monolith verification/tooling. .NET vẫn là alternative nghiêm túc.", trigger: "Java fail qualification hoặc burden vượt ngưỡng", color: C.purple, fill: C.palePurple,
    },
    {
      y: 318, label: "CLIENT", selected: "React + WPF / WebView2 + .NET Workspace", alt: "Flutter Web + Windows + .NET Workspace", rationale: "Core v0 cần Web + Windows, tái sử dụng UI và tận dụng Workspace .NET hiện tại.", trigger: "Multi-platform thành yêu cầu hoặc alternative giảm tổng rủi ro", color: C.blue, fill: C.paleBlue,
    },
    {
      y: 486, label: "ARCHITECTURE", selected: "Modular Monolith", alt: "Microservices", rationale: "Transaction, triển khai, debug và backup đơn giản hơn cho quy mô hiện tại.", trigger: "Có evidence về scale, isolation hoặc ownership độc lập", color: C.green, fill: C.paleGreen,
    },
  ];
  decisions.forEach((d) => {
    addBox(slide, 56, d.y, 1168, 142, { fill: d.fill, line: C.line });
    addPill(slide, d.label, 76, d.y + 18, 132, d.color, C.white, { size: d.label === "ARCHITECTURE" ? 11 : 14 });
    addText(slide, "BASELINE ENGINEERING", 230, d.y + 17, 240, 22, { size: 12, bold: true, color: C.steel });
    addText(slide, d.selected, 230, d.y + 43, 330, 42, { size: 19, bold: true, color: C.navy });
    addText(slide, "ALTERNATIVE", 590, d.y + 17, 164, 22, { size: 12, bold: true, color: C.steel });
    addText(slide, d.alt, 590, d.y + 43, 250, 42, { size: 18, bold: true, color: C.ink });
    addText(slide, d.rationale, 230, d.y + 94, 610, 34, { size: 14, color: C.slate });
    addBox(slide, 866, d.y + 12, 334, 118, { fill: C.white, line: d.color, lineWidth: 1.3 });
    addText(slide, "REOPEN TRIGGER", 882, d.y + 22, 302, 17, { size: 11, bold: true, color: d.color, align: "center" });
    addText(slide, d.trigger, 884, d.y + 43, 298, 28, { size: 11.5, color: C.slate, align: "center" });
    addText(slide, "↓  Successor Decision", 884, d.y + 74, 298, 18, { size: 11.5, bold: true, color: C.navy, align: "center" });
    addText(slide, "├ retain current baseline\n└ select qualified alternative", 884, d.y + 94, 298, 30, { size: 10.5, color: C.slate, align: "center" });
  });
  addPill(slide, "Q-15 = PARTIAL / NO WINNER · Flutter vẫn là viable evaluated alternative", 328, 635, 624, C.navy, C.white, { size: 17, h: 38 });
  addDiagramNotes(slide, {
    what: "A management simplification of TECH-D08 Technology Decision and Reopen Map.",
    why: "It records selected baselines, qualified alternatives and neutral reopen logic in one view.",
    notice: "A trigger opens a successor decision that may retain the baseline or select an alternative.",
    notInfer: "A trigger does not automatically select .NET, Flutter or Microservices, and Q-15 remains PARTIAL / NO WINNER.",
    read: "Read each row independently from current baseline and alternative to the reopen condition on the right.",
  }, [
    "Engineering đã chọn một baseline để tiếp tục qualification, nhưng lựa chọn đó chưa phải Product Decision Authority approval.",
    "Java được chọn hẹp cho Core Server; .NET Server vẫn là alternative nghiêm túc và có trigger mở lại rõ ràng.",
    "Q-15 không chứng minh React thắng Flutter; kết luận vẫn là PARTIAL / NO WINNER và Flutter vẫn là phương án khả thi đã đánh giá.",
    "React/WPF được chọn dựa trên phạm vi Web + Windows hiện tại, mức bằng chứng và opportunity cost, không dựa trên tuyên bố benchmark thắng.",
    "Modular Monolith phù hợp ranh giới giao dịch và khả năng vận hành hiện tại; Microservices chỉ hợp lý khi có evidence đủ bù chi phí phân tán.",
  ]);
}

// Slide 15
{
  const slide = presentation.slides.add();
  addHeader(slide, 15, slidesMeta[13].title, slidesMeta[13].section, slidesMeta[13].sources);
  addDiagramMeta(slide, 15, { mode: "Presentation synthesis", source: "FEATURE-001 + DOC-04 + TECH-001", why: "Tách ba quyết định management", link: null });
  const cols = [
    { x: 58, n: "1", title: "FEATURE", q: "Core v0 có giải quyết đúng năng lực và ranh giới công ty cần trước không?", sub: "Capability + Scope Boundary", color: C.cyan, fill: C.paleCyan },
    { x: 444, n: "2", title: "SPEC", q: "Các quy tắc về identity, workspace, structure, quyền, release và recovery có đúng không?", sub: "Correctness Contract", color: C.blue, fill: C.paleBlue },
    { x: 830, n: "3", title: "TECH", q: "Có chấp nhận baseline Engineering này để tiếp tục qualification và implementation không?", sub: "Engineering Baseline", color: C.purple, fill: C.palePurple },
  ];
  cols.forEach((c) => {
    addBox(slide, c.x, 156, 348, 330, { fill: c.fill, line: c.color, lineWidth: 1.7 });
    addBox(slide, c.x + 22, 178, 50, 50, { geometry: "ellipse", fill: c.color, line: c.color, text: c.n, size: 17, bold: true, color: C.white });
    addText(slide, c.title, c.x + 88, 178, 230, 38, { size: 27, bold: true, color: C.navy });
    addText(slide, c.sub, c.x + 26, 244, 296, 28, { size: 16, bold: true, color: c.color, align: "center" });
    addText(slide, c.q, c.x + 30, 300, 288, 116, { size: 20, color: C.ink, align: "center" });
    addPill(slide, "Duyệt · Duyệt có điều kiện · Yêu cầu sửa · Cần thêm bằng chứng", c.x + 24, 430, 300, C.white, C.slate, { size: 10.5, h: 36, line: C.line });
  });
  addBox(slide, 104, 530, 1072, 92, { fill: C.navy, line: C.navy });
  const stages = ["FEATURE decision", "SPEC decision", "TECH baseline", "Qualification", "Implementation"];
  stages.forEach((t, i) => {
    addText(slide, t, 126 + i * 204, 554, 170, 30, { size: 16, bold: true, color: C.white, align: "center" });
    if (i < stages.length - 1) addArrowText(slide, "→", 294 + i * 204, 549, 36, 38, "#8EC7E7", 22);
  });
  addText(slide, "Trạng thái hiện tại: các quyết định Product Decision Authority vẫn NOT-RUN.", 270, 640, 740, 28, { size: 16, bold: true, color: C.red, align: "center" });
  addDiagramNotes(slide, {
    what: "A presentation synthesis of the three decisions requested from Product Decision Authority.",
    why: "It gives management a clear response format for FEATURE, SPEC and TECH without combining them into one approval.",
    notice: "Each decision can receive a different disposition or condition.",
    notInfer: "The slide does not record approval. Product Decision Authority status remains NOT-RUN until an attributable decision is captured.",
    read: "Read the three columns independently, then follow the bottom sequence to see what approval enables next.",
  }, [
    "Management cần đưa ra ba quyết định riêng thay vì phê duyệt chung một khối tài liệu.",
    "Feature xác nhận đúng phạm vi; Spec xác nhận đúng các quy tắc kiểm soát và hành vi; Tech xác nhận baseline Engineering có thể tiếp tục qualification.",
    "Kết quả mỗi trục có thể là đồng ý, đồng ý có điều kiện, yêu cầu sửa hoặc yêu cầu thêm bằng chứng.",
    "Qualification và implementation chỉ đi tiếp trên baseline đã được quyết định; slide không ngụ ý các bước hiện đã PASS.",
    "Tại thời điểm lập bộ slide, Product Decision Authority approval vẫn NOT-RUN.",
  ]);
}

await addEvidenceAppendixSlide({
  slideNumber: 16,
  id: "ARCH-VIEW-RBAC-001",
  title: "Principal-role-scope authorization model",
  imagePath: path.join(ARCH_EVIDENCE, "ARCH-VIEW-RBAC-001.png"),
  sources: ["DOC-05@0.20", "ARCH-VIEW-RBAC-001"],
  note: "Đối chiếu mô hình RBAC hiện hành",
  diagram: {
    what: "The current controlled UML-style authorization domain view.",
    why: "It provides the exact controlled source behind the management simplification on slide 10.",
    notice: "RoleAssignment binds a SecurityPrincipal, exact RoleDefinitionVersion and AuthorizationScope and contributes to an attributable decision.",
    notInfer: "The class layout is not a user workflow, UI design or database schema, and line position does not imply evaluation order.",
    read: "Start with SecurityPrincipal, RoleDefinitionVersion and AuthorizationScope, then trace their links into RoleAssignment and AuthorizationDecision.",
  },
});

await addEvidenceAppendixSlide({
  slideNumber: 17,
  id: "TECH-D04",
  title: "Runtime & Protocol View",
  imagePath: path.join(TECH_EVIDENCE, "TECH-D04.png"),
  sources: ["TECH-VIEWS@0.2", "TECH-D04"],
  note: "Xem sâu protocol và trust zone",
  diagram: {
    what: "The current controlled runtime and protocol view.",
    why: "It answers detailed questions about process boundaries and protocols without loading the main management narrative.",
    notice: "Web, Windows user, Server and Worker run in separate trust zones connected by named, versioned contracts.",
    notInfer: "It does not set ports, host counts, firewall rules, capacity, HA or a final Format Worker runtime/toolchain.",
    read: "Read from the Web and Windows user zones down to the Server trust zone, then follow the separate Worker contract on the right.",
  },
});

await addEvidenceAppendixSlide({
  slideNumber: 18,
  id: "TECH-D05",
  title: "Deployment View",
  imagePath: path.join(TECH_EVIDENCE, "TECH-D05.png"),
  sources: ["TECH-VIEWS@0.2", "TECH-D05"],
  note: "Xem sâu deployment, backup và failure boundary",
  diagram: {
    what: "The current controlled deployment view for the selected Engineering baseline.",
    why: "It shows machine and failure boundaries when management asks how the system will be deployed and recovered.",
    notice: "The Server VM is a single failure domain, backup is separated, and the Windows Format Worker remains isolated.",
    notInfer: "It is not an approved production topology, capacity result, HA commitment or Product Decision Authority approval.",
    read: "Read the Server VM in the centre, then the Engineer PC, isolated Worker and separate backup target around it.",
  },
});

if (diagramNoteCursor !== naturalSpeakerNotes.length) {
  throw new Error(`Speaker note count mismatch: used ${diagramNoteCursor}/${naturalSpeakerNotes.length}`);
}

await fs.mkdir(TMP_DIR, { recursive: true });
await fs.mkdir(path.dirname(FINAL_PPTX), { recursive: true });

const candidatePath = path.join(TMP_DIR, "candidate.pptx");
await (await PresentationFile.exportPptx(presentation)).save(candidatePath);
const hyperlinksApplied = await patchPowerPointHyperlinks(candidatePath);

// Author-time previews and layout snapshots support rapid visual diagnosis.
for (let i = 0; i < presentation.slides.count; i += 1) {
  const slide = presentation.slides.getItem(i);
  const preview = await presentation.export({ slide, format: "png", scale: 1 });
  await fs.writeFile(path.join(TMP_DIR, `author-slide-${i + 1}.png`), new Uint8Array(await preview.arrayBuffer()));
  const layout = await slide.export({ format: "layout" });
  await fs.writeFile(path.join(TMP_DIR, `author-slide-${i + 1}.layout.json`), await layout.text());
}
const montage = await presentation.export({ format: "webp", montage: true, scale: 1 });
await fs.writeFile(path.join(TMP_DIR, "author-montage.webp"), new Uint8Array(await montage.arrayBuffer()));

const { finalizePresentation } = await import(pathToFileURL(path.join(SKILL_DIR, "container_tools", "artifact_tool_utils.mjs")).href);
const requirements = {
  explicitTotalSlideCount: 18,
  requiredNativeTableOwnerSlides: [],
  requiredNativeChartOwnerSlides: [],
};
await fs.rm(FINAL_PPTX, { force: true });
await fs.rm(path.join(TMP_DIR, "validation.json"), { force: true });
const result = await finalizePresentation({
  ...requirements,
  workspaceDir: REPO,
  candidatePath,
  finalPath: FINAL_PPTX,
  pythonExecutable: RUNTIME_PYTHON,
  integrityValidatorPath: path.join(SKILL_DIR, "container_tools", "inspect_presentation_package_integrity.py"),
  layoutValidatorPath: path.join(SKILL_DIR, "container_tools", "inspect_presentation_layout_geometry.py"),
  layoutArgs: [
    "--expected-slide-size-emu", "12192000,6858000",
    "--validate-heading-fit",
  ],
  requiredNativeTableOwnerSlides: [],
  fontPolicy: { basis: "design", families: [FONT] },
  verifyArtifactToolImport: true,
  receiptPath: path.join(TMP_DIR, "validation.json"),
});
const hyperlinkValidation = await verifyPowerPointHyperlinks(FINAL_PPTX);
const diagramInventory = await writeDiagramInventory(REPO, INVENTORY_MD, COMMIT);

const finalSlides = [
  [1, "FEATURE → SPEC → TECH", "Presentation synthesis", "DOC-01@0.6; DOC-04@0.13; DOC-05@0.20"],
  [2, "Controlled Views dùng trong buổi review", "Presentation synthesis", "DOC-05@0.20; DOC-06@0.16; TECH-VIEWS@0.2"],
  [3, slidesMeta[1].title, "Presentation synthesis", "DOC-01@0.6; DOC-03@0.7; FEATURE-001@0.12"],
  [4, slidesMeta[2].title, "Presentation synthesis", "DOC-01@0.6; DOC-04@0.13"],
  [5, slidesMeta[3].title, "Presentation synthesis", "DOC-04@0.13; VVP@0.16"],
  [6, slidesMeta[4].title, "Management simplification", "DATA-VIEW-CORE-001"],
  [7, slidesMeta[5].title, "Management simplification", "ARCH-VIEW-MOD-002; ARCH-VIEW-SEQ-002; DATA-VIEW-WS-001"],
  [8, slidesMeta[6].title, "Management simplification", "DATA-VIEW-CORE-001"],
  [9, slidesMeta[7].title, "Management simplification", "ARCH-VIEW-SEQ-003"],
  [10, slidesMeta[8].title, "Management simplification", "ARCH-VIEW-RBAC-001; DATA-VIEW-AUTH-001"],
  [11, slidesMeta[9].title, "Presentation synthesis", "DOC-04@0.13; VVP@0.16"],
  [12, slidesMeta[10].title, "Management simplification", "TECH-D01; TECH-D05"],
  [13, slidesMeta[11].title, "Management simplification", "TECH-D03"],
  [14, slidesMeta[12].title, "Management simplification", "TECH-D08"],
  [15, slidesMeta[13].title, "Presentation synthesis", "FEATURE-001@0.12; DOC-04@0.13; TECH-001@0.14"],
  [16, "ARCH-VIEW-RBAC-001 — Principal-role-scope authorization model", "Direct reuse", "ARCH-VIEW-RBAC-001"],
  [17, "TECH-D04 — Runtime & Protocol View", "Direct reuse", "TECH-D04"],
  [18, "TECH-D05 — Deployment View", "Direct reuse", "TECH-D05"],
];
const slideList = finalSlides.map(([n, title]) => `${n}. ${title}`).join("\n");
const diagramList = finalSlides.map(([n, title, mode, source]) => `Slide ${n} — ${title} — ${mode} — ${source}`).join("\n");
const sourceRows = finalSlides.map(([n, , , source]) => [n, source]);
const sourceFiles = [
  ["DOC-01@0.6", "docs/product/instances/idea-engineering/DOC-01-product-vision-and-scope.md"],
  ["DOC-03@0.7", "docs/product/instances/idea-engineering/DOC-03-business-requirements.md"],
  ["DOC-04@0.13", "docs/product/instances/idea-engineering/DOC-04-software-requirements-specification.md"],
  ["DOC-05@0.20", "docs/product/instances/idea-engineering/DOC-05-architecture-description.md"],
  ["DOC-06@0.16", "docs/product/instances/idea-engineering/DOC-06-data-integration-and-migration-specification.md"],
  ["DOC-08@0.12", "docs/product/instances/idea-engineering/DOC-08-ui-ux-and-interaction-specification.md"],
  ["FEATURE-001@0.12", "docs/product/instances/idea-engineering/decision-briefs/FEATURE-001-feature-definition-and-scope.md"],
  ["TECH-001@0.14", "docs/product/instances/idea-engineering/decision-briefs/TECH-001-technology-and-architecture-proposal.md"],
  ["IE-KNW-TECH-DEC-001@0.6", "docs/product/knowledge/2026-09-13-core-v0-technology-decision-matrix.md"],
  ["IE-ARC-TECH-VIEW-001@0.2", "docs/product/instances/idea-engineering/technology/IDEA-core-v0-technology-architecture-views.md"],
  ["VVP@0.16", "docs/product/instances/idea-engineering/registers/VVP-core-v0-verification-validation-plan.md"],
];
const sourceLinks = sourceFiles.map(([id, p]) => `- [${id}](${GH}${p})`).join("\n");
const sourceTable = sourceRows.map(([n, s]) => `| ${n} | ${s} |`).join("\n");
const mapping = `# IDEA Engineering Core v0 — Feature / Spec / Tech presentation source map\n\n` +
  `- Presentation: \`${path.relative(REPO, FINAL_PPTX).replaceAll("\\", "/")}\`\n` +
  `- Source generator: \`scripts/presentations/build-idea-core-v0-feature-spec-tech-review.mjs\`\n` +
  `- Source commit: \`${COMMIT}\`\n` +
  `- Slide count: 18\n` +
  `- Controlled diagram inventory: \`${path.relative(REPO, INVENTORY_MD).replaceAll("\\", "/")}\`\n` +
  `- PowerPoint hyperlinks verified: ${hyperlinkValidation.verified}/${hyperlinkValidation.expected}\n` +
  `- Current SRS count represented: 87 requirements\n` +
  `- Q-15 represented as: \`PARTIAL / NO WINNER\`\n` +
  `- Product Decision Authority approval represented as: \`NOT-RUN\`\n\n` +
  `## Final slide list\n\n${slideList}\n\n` +
  `## Diagram inventory\n\n${diagramList}\n\n` +
  `Slides 16–18 directly reuse current controlled renderings. Other diagram slides are marked as Management simplification or Presentation synthesis.\n\n` +
  `## Slide-to-source mapping\n\n| Slide | Controlled source |\n|---:|---|\n${sourceTable}\n\n` +
  `## Exact source links\n\n${sourceLinks}\n\n` +
  `## Validation status\n\n` +
  `- Finalizer result: ${result?.ok === false ? "FAILED" : "PASS"}\n` +
  `- Management simplifications and presentation syntheses remain editable in PowerPoint.\n` +
  `- Direct-reuse appendix views retain their controlled rendering and link to the commit-pinned SVG.\n` +
  `- Controlled view inventory count: ${diagramInventory.length}.\n` +
  `- Real external hyperlinks verified in the PPTX package: ${hyperlinkValidation.verified}.\n` +
  `- No native table or quantitative chart was required.\n` +
  `- Worker runtime/toolchain remains qualification-dependent.\n` +
  `- Technology baseline is Engineering-selected; Product Decision Authority review remains NOT-RUN.\n`;
await fs.writeFile(MAPPING_MD, mapping, "utf8");

console.log(JSON.stringify({ finalPath: FINAL_PPTX, mappingPath: MAPPING_MD, inventoryPath: INVENTORY_MD, tempDir: TMP_DIR, slideCount: presentation.slides.count, hyperlinksApplied: hyperlinksApplied.length, hyperlinkValidation, finalizer: result }, null, 2));
