// Current Vault review renditions; preserve predecessor evidence folders.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const cp = require('node:child_process');
const { pathToFileURL } = require('node:url');
const { chromium } = require(process.env.IDEA_PLAYWRIGHT_PATH || 'playwright');
const sharp = require(process.env.IDEA_SHARP_PATH || 'sharp');
const root = path.resolve(__dirname, '..');
const evidenceId = process.env.IDEA_VAULT_EVIDENCE_ID;
if (!evidenceId) {
  throw new Error('Set IDEA_VAULT_EVIDENCE_ID to a new evidence record; do not overwrite historical evidence.');
}
if (!/^IE-VEV-[A-Z0-9-]+$/.test(evidenceId)) {
  throw new Error(`Invalid IDEA_VAULT_EVIDENCE_ID: ${evidenceId}`);
}
const base = 'docs/product/instances/idea-engineering';
const output = path.join(root, base, 'evidence', evidenceId);
if (fs.existsSync(output) && fs.readdirSync(output).length > 0) {
  throw new Error(`Evidence directory already exists: ${evidenceId}; choose a new successor ID.`);
}
const inputs = [
  `${base}/DOC-05-architecture-description.md`,
  `${base}/DOC-06-data-integration-and-migration-specification.md`,
  `${base}/technology/IDEA-core-v0-technology-architecture-views.md`,
  'docs/reports/IDEA-DDM-multi-location-vault-sharepoint-word-update-guide-2026-09-17.md',
];
const hash = s => crypto.createHash('sha256').update(s).digest('hex');
const normalize = s => s.replace(/\r\n/g, '\n');
let activeBrowser;
const escape = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

function extract(content, source) {
  return [...content.matchAll(/```mermaid\r?\n([\s\S]*?)```/g)].map(match => {
    const before = content.slice(0, match.index);
    const ids = [...before.matchAll(/(?:\*\*`((?:ARCH|DATA)-VIEW-[A-Z]+-\d+)`|##\s+`?(TECH-D\d{2})`?\s+—|\*\*View ID:\*\*\s+`(MGMT-VLT-\d{3})`)/g)];
    const id = ids.at(-1)?.slice(1).find(Boolean);
    if (!id) throw new Error(`Missing explicit ID in ${source}`);
    const code = normalize(match[1]);
    const title = code.match(/^\s*(?:%%\s*)?accTitle:\s*(.+)$/m)?.[1].trim();
    const description = code.match(/^\s*(?:%%\s*)?accDescr:\s*(.+)$/m)?.[1].trim();
    if (!title || !description) throw new Error(`Missing text alternative: ${id}`);
    const syntax = code.match(/^\s*(flowchart|sequenceDiagram|stateDiagram-v2|classDiagram|erDiagram)/m)?.[1];
    const local = before.slice(ids.at(-1).index);
    const declaredType = local.match(/\*\*Model profile:\*\*\s*([\s\S]*?);/)?.[1]
      || local.match(/\| Viewpoint \/ notation \| (.+?) \|/)?.[1]
      || local.match(/\*\*Loại hình:\*\*\s*([^\r\n]+)/)?.[1];
    const type = declaredType?.replace(/\s+/g, ' ').trim()
      || ({ flowchart: 'Mermaid flowchart notation — model kind declared beside source', sequenceDiagram: 'UML Sequence Diagram', 'stateDiagram-v2': 'UML State Machine', classDiagram: 'UML-style domain model', erDiagram: 'ER domain view' })[syntax];
    if (!type) throw new Error(`Unrecognized notation: ${id}`);
    return { id, title, description, type, source, code, diagramSha256: hash(code) };
  });
}

(async () => {
  fs.mkdirSync(output, { recursive: true });
  const baselineCommit = cp.execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
  const sources = [], views = [];
  for (const source of inputs) {
    const content = fs.readFileSync(path.join(root, source), 'utf8');
    let predecessor = [];
    if (!source.startsWith('docs/reports/')) {
      predecessor = extract(cp.execFileSync('git', ['show', `HEAD:${source}`], { cwd: root, encoding: 'utf8' }), source);
    }
    sources.push({ path: source, sha256: hash(content), lfSha256: hash(normalize(content)) });
    for (const view of extract(content, source)) {
      if (views.some(v => v.id === view.id)) throw new Error(`Duplicate ID: ${view.id}`);
      const prior = predecessor.find(v => v.id === view.id);
      view.change = !prior ? 'NEW' : prior.diagramSha256 === view.diagramSha256 ? 'UNCHANGED' : 'UPDATED';
      views.push(view);
    }
  }
  const browser = activeBrowser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1800, height: 1400 }, deviceScaleFactor: 1 });
  await page.setContent('<html><body style="margin:0;background:white"><div id="view"></div></body></html>');
  await page.addScriptTag({ url: 'https://cdn.jsdelivr.net/npm/mermaid@11.12.0/dist/mermaid.min.js' });
  await page.evaluate(() => mermaid.initialize({ startOnLoad: false, securityLevel: 'strict', theme: 'neutral' }));
  for (const view of views) {
    try { await page.evaluate(async code => mermaid.parse(code), view.code); }
    catch (error) { throw new Error(`${view.id}: ${error.message}`); }
  }
  console.log(`PARSE PASS: ${views.length} explicit view IDs`);
  const results = [];
  for (const [number, view] of views.entries()) {
    await page.evaluate(({ management }) => mermaid.initialize({
      startOnLoad: false, securityLevel: 'strict', theme: management ? 'base' : 'neutral',
      themeVariables: { fontFamily: 'Arial, sans-serif', fontSize: management ? '18px' : '16px',
        ...(management ? { primaryColor: '#eaf2fb', primaryTextColor: '#142d4c', primaryBorderColor: '#52799d', lineColor: '#365e83', secondaryColor: '#f2f6fa', tertiaryColor: '#ffffff' } : {}) },
      flowchart: { curve: 'linear', htmlLabels: true, nodeSpacing: 42, rankSpacing: 65 },
      sequence: { useMaxWidth: false, wrap: true, width: management ? 175 : 155, messageMargin: 30 },
    }), { management: view.id.startsWith('MGMT-') });
    const rendered = await page.evaluate(async ({ code, number }) => (await mermaid.render(`vaultDiagram${number}`, code)).svg, { code: view.code, number });
    const svg = await page.evaluate(({ rendered, title, description }) => {
      const container = document.querySelector('#view');
      container.innerHTML = rendered;
      const element = container.querySelector('svg');
      element.style.maxWidth = 'none';
      element.style.width = `${element.viewBox.baseVal.width}px`;
      element.setAttribute('role', 'img');
      for (const [tag, value] of [['title', title], ['desc', description]]) {
        if (!element.querySelector(`:scope > ${tag}`)) {
          const child = document.createElementNS('http://www.w3.org/2000/svg', tag);
          child.textContent = value;
          element.insertBefore(child, element.firstChild);
        }
      }
      return new XMLSerializer().serializeToString(element);
    }, { rendered, title: view.title, description: view.description });
    fs.writeFileSync(path.join(output, `${view.id}.svg`), svg);
    await page.locator('#view svg').screenshot({ path: path.join(output, `${view.id}.png`) });
    const dimensions = await sharp(path.join(output, `${view.id}.png`)).metadata();
    results.push({ ...view, code: undefined, status: 'PASS — RENDER', width: dimensions.width, height: dimensions.height,
      svgSha256: hash(svg), pngSha256: hash(fs.readFileSync(path.join(output, `${view.id}.png`))) });
    console.log(`${view.id}: ${view.change} ${dimensions.width}x${dimensions.height}`);
  }
  const failures = [];
  for (const result of results) {
    await page.goto(pathToFileURL(path.join(output, `${result.id}.svg`)).href);
    const check = await page.evaluate(() => ({ root: document.documentElement.nodeName, parserErrors: document.querySelectorAll('parsererror').length,
      text: document.documentElement.textContent.slice(0, 500) }));
    if (check.root.toLowerCase() !== 'svg' || check.parserErrors || /this page contains the following errors/i.test(check.text)) failures.push({ id: result.id, ...check });
  }
  await browser.close();
  fs.writeFileSync(path.join(output, 'render-results.json'), JSON.stringify({ evidenceId, baselineCommit, renderedAt: new Date().toISOString(), browser: browser.version(), mermaid: '11.12.0', sources, results }, null, 2));
  fs.writeFileSync(path.join(output, 'svg-open-results.json'), JSON.stringify({ evidenceId, checkedAt: new Date().toISOString(), count: results.length, failures, status: failures.length ? 'FAIL' : 'PASS' }, null, 2));
  if (failures.length) throw new Error(`Standalone SVG failures: ${JSON.stringify(failures)}`);

  const management = results.filter(v => v.id.startsWith('MGMT-'));
  const updated = results.filter(v => !v.id.startsWith('MGMT-') && v.change !== 'UNCHANGED');
  const unchanged = results.filter(v => !v.id.startsWith('MGMT-') && v.change === 'UNCHANGED');
  const nav = group => group.map(v => `<a href="${v.id}.svg">${escape(v.id)} — ${escape(v.title)}</a>`).join('');
  const cards = group => group.map(v => `<article id="${v.id}"><h2>${escape(v.title)}</h2><p><b>${escape(v.id)}</b> · ${escape(v.type)} · ${escape(v.change)}</p><p>${escape(v.description)}</p><a href="${v.id}.svg"><img src="${v.id}.svg" alt="${escape(v.title)}"></a><p><a href="${v.id}.svg">Mở SVG đầy đủ ↗</a> · <a href="${v.id}.png">Mở PNG ↗</a></p></article>`).join('');
  fs.writeFileSync(path.join(output, 'index.html'), `<!doctype html><html lang="vi"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>IDEA DDM — Vault nhiều vị trí</title><style>body{font:16px Arial,sans-serif;color:#172b4d;max-width:1500px;margin:30px auto;padding:0 24px;line-height:1.5}h1{font-size:28px}h2{font-size:22px}nav{display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:10px}a{color:#145c9e}nav a{padding:8px;border:1px solid #ced9e3}article{padding:24px 0;border-top:1px solid #ced9e3}img{max-width:100%;height:auto}summary{cursor:pointer;font-size:22px;padding:18px 0}small{color:#486079}</style><h1>IDEA DDM — Vault nhiều vị trí</h1><p>File lớn truyền trực tiếp qua Gateway. Server kiểm tra quyền và quyết định kết quả nghiệp vụ.</p><p>${results.length} hình từ nguồn hiện hành: ${management.length} hình dành cho báo cáo Word và ${results.length - management.length} controlled views. Bấm vào hình hoặc tên để mở SVG ở kích thước đầy đủ.</p><h2>Ba hình để cập nhật Word</h2><nav>${nav(management)}</nav>${cards(management)}<details open><summary>Sơ đồ kỹ thuật đã sửa hoặc bổ sung (${updated.length})</summary><nav>${nav(updated)}</nav>${cards(updated)}</details><details><summary>Sơ đồ còn lại — đã rà mức độ ảnh hưởng và render cùng baseline (${unchanged.length})</summary><nav>${nav(unchanged)}</nav></details><small>Draft. Nguồn và mã kiểm tra nằm trong render-results.json. Render và kiểm tra hình không phải kết quả kiểm thử hệ thống hay xác nhận hiệu năng.</small></html>`);
  const qa = path.join(output, 'qa');
  fs.mkdirSync(qa, { recursive: true });
  const focus = [...management, ...updated];
  for (let offset = 0; offset < focus.length; offset += 6) {
    const group = focus.slice(offset, offset + 6), tiles = [];
    for (const [index, view] of group.entries()) {
      const column = index % 2, row = Math.floor(index / 2);
      const tile = await sharp(path.join(output, `${view.id}.png`)).resize(770, 530, { fit: 'inside', withoutEnlargement: true }).toBuffer();
      const size = await sharp(tile).metadata();
      const label = Buffer.from(`<svg width="790" height="42"><rect width="790" height="42" fill="#eaf2fb"/><text x="12" y="27" font-family="Arial" font-size="20" fill="#172b4d">${escape(view.id)} — ${view.change}</text></svg>`);
      tiles.push({ input: label, left: column * 800, top: row * 595 });
      tiles.push({ input: tile, left: column * 800 + Math.round((790 - size.width) / 2), top: row * 595 + 50 });
    }
    await sharp({ create: { width: 1600, height: Math.ceil(group.length / 2) * 595, channels: 3, background: '#fff' } }).composite(tiles).png().toFile(path.join(qa, `contact-${String(offset / 6 + 1).padStart(2, '0')}.png`));
  }
  console.log(JSON.stringify({ evidenceId, count: results.length, updated: updated.length, management: management.length, standaloneSvg: 'PASS', output }));
})().catch(async error => { console.error(error); await activeBrowser?.close(); process.exitCode = 1; });
