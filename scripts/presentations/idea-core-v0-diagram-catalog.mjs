import fs from "node:fs/promises";
import path from "node:path";

const DOC05 = "docs/product/instances/idea-engineering/DOC-05-architecture-description.md";
const DOC06 = "docs/product/instances/idea-engineering/DOC-06-data-integration-and-migration-specification.md";
const TECH = "docs/product/instances/idea-engineering/technology/IDEA-core-v0-technology-architecture-views.md";

export const usedViews = {
  "DATA-VIEW-CORE-001": { slide: "6", mode: "Management simplification", reason: "Giải thích danh tính tài liệu, Revision, Version và Generation." },
  "ARCH-VIEW-MOD-002": { slide: "7", mode: "Management simplification", reason: "Xác định ranh giới trách nhiệm của Workspace và Server." },
  "ARCH-VIEW-SEQ-002": { slide: "7", mode: "Management simplification", reason: "Làm rõ Check-in nguyên tử và cách giữ công việc khi stale." },
  "DATA-VIEW-WS-001": { slide: "7", mode: "Management simplification", reason: "Giải thích bằng chứng Workspace, Reservation và kết quả Check-in." },
  "ARCH-VIEW-SEQ-003": { slide: "9", mode: "Management simplification", reason: "Giải thích Review và Release trên một baseline chính xác." },
  "ARCH-VIEW-RBAC-001": { slide: "10, 16", mode: "Direct reuse + Management simplification", reason: "Đối chiếu mô hình Principal, Role, Scope và Role Assignment hiện hành." },
  "DATA-VIEW-AUTH-001": { slide: "10", mode: "Management simplification", reason: "Giải thích dữ liệu lưu quyền mà không dùng mô hình phân quyền cũ." },
  "TECH-D01": { slide: "12", mode: "Management simplification", reason: "Tóm tắt các khối công nghệ đã chọn và ranh giới Format Worker." },
  "TECH-D03": { slide: "13", mode: "Management simplification", reason: "Gắn mỗi công nghệ với đúng trách nhiệm và thẩm quyền." },
  "TECH-D04": { slide: "17", mode: "Direct reuse", reason: "Cho phép xem sâu runtime, protocol và trust zone khi cần." },
  "TECH-D05": { slide: "18", mode: "Direct reuse", reason: "Cho phép xem sâu deployment, backup và failure boundary khi cần." },
  "TECH-D08": { slide: "14", mode: "Management simplification", reason: "Giải thích trigger mở lại quyết định mà không định trước kết quả." },
};

function cleanCell(value) {
  return value.trim().replaceAll("`", "").replace(/\s+/g, " ");
}

function titleMapFrom(text) {
  const map = new Map();
  for (const match of text.matchAll(/\*\*`((?:ARCH|DATA)-VIEW-[A-Z0-9-]+)` — ([^*\r\n]+?)\.\*\*/g)) {
    map.set(match[1], match[2].trim());
  }
  return map;
}

function parseArchitectureCatalogue(doc05, doc06) {
  const titles = new Map([...titleMapFrom(doc05), ...titleMapFrom(doc06)]);
  const rows = [];
  for (const line of doc05.split(/\r?\n/)) {
    if (!/^\| `(?:ARCH|DATA)-VIEW-/.test(line)) continue;
    const cells = line.split("|").slice(1, -1).map(cleanCell);
    if (cells.length < 6) continue;
    const [id, location, purpose, audience] = cells;
    rows.push({
      id,
      title: titles.get(id) ?? "TITLE NOT FOUND",
      source: id.startsWith("DATA-") ? `${DOC06} (${location.split("/").at(-1)?.trim() ?? location})` : `${DOC05} (${location.split("/").at(-1)?.trim() ?? location})`,
      viewType: location.split("/")[0].trim(),
      purpose,
      audience,
    });
  }
  return rows;
}

function parseTechnologyCatalogue(text) {
  const rows = [];
  const matches = [...text.matchAll(/^## (TECH-D\d{2}) — ([^\r\n]+)$/gm)];
  for (let i = 0; i < matches.length; i += 1) {
    const match = matches[i];
    const start = match.index;
    const end = matches[i + 1]?.index ?? text.length;
    const block = text.slice(start, end);
    const read = (label) => block.match(new RegExp(`^\\| ${label.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")} \\| ([^\\r\\n]+) \\|$`, "m"))?.[1]?.trim() ?? "NOT RECORDED";
    rows.push({
      id: match[1],
      title: match[2].trim(),
      source: TECH,
      viewType: cleanCell(read("Viewpoint / notation")),
      purpose: cleanCell(read("Purpose")),
      audience: cleanCell(read("Stakeholders / concerns")),
    });
  }
  return rows;
}

export async function loadDiagramCatalogue(repo) {
  const [doc05, doc06, tech] = await Promise.all([
    fs.readFile(path.join(repo, DOC05), "utf8"),
    fs.readFile(path.join(repo, DOC06), "utf8"),
    fs.readFile(path.join(repo, TECH), "utf8"),
  ]);
  const rows = [...parseArchitectureCatalogue(doc05, doc06), ...parseTechnologyCatalogue(tech)];
  if (rows.length !== 38) throw new Error(`Expected 38 controlled views, found ${rows.length}`);
  if (rows.some((row) => row.title === "TITLE NOT FOUND")) throw new Error("At least one controlled view title could not be verified from current source");
  return rows.map((row) => {
    const use = usedViews[row.id];
    return {
      ...row,
      used: use ? "YES" : "NO",
      slide: use?.slide ?? "—",
      reason: use?.reason ?? "Không phục vụ trực tiếp quyết định FEATURE, SPEC hoặc TECH trong management review này. Giữ lại trong controlled package để tra cứu chuyên sâu.",
      mode: use?.mode ?? "—",
    };
  });
}

function escapeCell(value) {
  return String(value).replaceAll("|", "\\|").replace(/\r?\n/g, " ");
}

export async function writeDiagramInventory(repo, outputPath, commit) {
  const rows = await loadDiagramCatalogue(repo);
  const body = rows.map((row) => `| ${escapeCell(row.id)} | ${escapeCell(row.title)} | ${escapeCell(row.source)} | ${escapeCell(row.viewType)} | ${escapeCell(row.purpose)} | ${escapeCell(row.audience)} | ${row.used} | ${row.slide} | ${escapeCell(row.reason)} |`).join("\n");
  const markdown = `# IDEA Engineering Core v0 — Controlled Diagram Inventory\n\n` +
    `- Baseline commit: \`${commit}\`\n` +
    `- Controlled views verified from current repository source: **${rows.length}**\n` +
    `- Views used in the management presentation: **${rows.filter((row) => row.used === "YES").length}**\n` +
    `- “Used” means the view is reused, simplified, synthesised from, or linked from the presentation.\n\n` +
    `| ID | Exact Title | Source | View Type | Purpose | Audience | Used? | Slide | Reason for Use/Exclusion |\n` +
    `|---|---|---|---|---|---|:---:|---:|---|\n${body}\n`;
  await fs.writeFile(outputPath, markdown, "utf8");
  return rows;
}
