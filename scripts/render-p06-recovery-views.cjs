// Focused DOC-05 recovery-view rendition; do not duplicate the full architecture gallery.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const cp = require('node:child_process');
const { pathToFileURL } = require('node:url');
const { chromium } = require(process.env.IDEA_PLAYWRIGHT_PATH || 'playwright');
const sharp = require(process.env.IDEA_SHARP_PATH || 'sharp');

const root = path.resolve(__dirname, '..');
const source = 'docs/product/instances/idea-engineering/DOC-05-architecture-description.md';
const evidenceId = 'IE-VEV-P06-DIAGRAM-001';
const canonicalOutput = path.join(root, 'docs/product/instances/idea-engineering/evidence', evidenceId);
const output = path.resolve(process.env.IDEA_P06_OUTPUT_DIR || canonicalOutput);
const ids = ['ARCH-VIEW-SEQ-011', 'ARCH-VIEW-ACT-003'];
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const escape = value => String(value).replace(/[&<>"']/g,
  ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);
let browser;

function extract(document, id) {
  const heading = `**\`${id}\` — `;
  const start = document.indexOf(heading);
  if (start < 0 || document.indexOf(heading, start + 1) >= 0) {
    throw new Error(`Expected exactly one view heading: ${id}`);
  }
  const fence = document.indexOf('```mermaid\n', start);
  const close = document.indexOf('\n```', fence + 11);
  if (fence < 0 || close < 0 || document.slice(start + heading.length, fence).includes('**`ARCH-VIEW-')) {
    throw new Error(`Missing adjacent Mermaid source: ${id}`);
  }
  const code = document.slice(fence + 11, close).trim() + '\n';
  const title = code.match(/^\s*accTitle:\s*(.+)$/m)?.[1].trim();
  const description = code.match(/^\s*accDescr:\s*(.+)$/m)?.[1].trim();
  if (!title || !description) throw new Error(`Missing accessible title/description: ${id}`);
  return { id, title, description, code, diagramSha256: sha256(code) };
}

(async () => {
  if (fs.existsSync(output) && fs.readdirSync(output).length > 0) {
    if (process.env.IDEA_P06_REFRESH !== '1' || output !== canonicalOutput) {
      throw new Error(`Refusing to overwrite a non-empty evidence directory: ${output}`);
    }
    const expected = [...ids.flatMap(id => [`${id}.svg`, `${id}.png`]),
      'index.html', 'render-results.json', 'svg-open-results.json'].sort();
    const actual = fs.readdirSync(output).sort();
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
      throw new Error('Existing P06 evidence contains unexpected files; refusing refresh.');
    }
    const prior = JSON.parse(fs.readFileSync(path.join(output, 'render-results.json'), 'utf8'));
    if (prior.evidenceId !== evidenceId || !prior.sourceState?.startsWith('WORKING_COPY')) {
      throw new Error('Existing P06 evidence is not an editable working-copy rendition.');
    }
    for (const view of prior.views) {
      if (!ids.includes(view.id) ||
        sha256(fs.readFileSync(path.join(output, `${view.id}.svg`))) !== view.svgSha256 ||
        sha256(fs.readFileSync(path.join(output, `${view.id}.png`))) !== view.pngSha256) {
        throw new Error(`Existing P06 view differs from its manifest: ${view.id}`);
      }
    }
  }
  const document = fs.readFileSync(path.join(root, source), 'utf8').replace(/\r\n/g, '\n');
  const views = ids.map(id => extract(document, id));
  browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1800, height: 1400 }, deviceScaleFactor: 1 });
  await page.setContent('<html><body style="margin:0;background:#fff"><div id="view"></div></body></html>');
  await page.addScriptTag({ url: 'https://cdn.jsdelivr.net/npm/mermaid@11.12.0/dist/mermaid.min.js' });
  await page.evaluate(() => mermaid.initialize({
    startOnLoad: false, securityLevel: 'strict', theme: 'neutral',
    themeVariables: { fontFamily: 'Arial, sans-serif', fontSize: '17px' },
    flowchart: { curve: 'linear', htmlLabels: true, nodeSpacing: 48, rankSpacing: 75 },
    sequence: { useMaxWidth: false, wrap: true, width: 170, messageMargin: 32 },
  }));
  for (const view of views) {
    try { await page.evaluate(async code => mermaid.parse(code), view.code); }
    catch (error) { throw new Error(`${view.id}: ${error.message}`); }
  }

  fs.mkdirSync(output, { recursive: true });
  const results = [];
  for (const [index, view] of views.entries()) {
    const rendered = await page.evaluate(async ({ code, index }) =>
      (await mermaid.render(`p06Recovery${index}`, code)).svg, { code: view.code, index });
    const svg = await page.evaluate(({ rendered, title, description }) => {
      const host = document.querySelector('#view');
      host.innerHTML = rendered;
      const graphic = host.querySelector('svg');
      graphic.style.maxWidth = 'none';
      graphic.style.width = `${graphic.viewBox.baseVal.width}px`;
      graphic.setAttribute('role', 'img');
      for (const [tag, value] of [['title', title], ['desc', description]]) {
        if (!graphic.querySelector(`:scope > ${tag}`)) {
          const element = document.createElementNS('http://www.w3.org/2000/svg', tag);
          element.textContent = value;
          graphic.insertBefore(element, graphic.firstChild);
        }
      }
      return new XMLSerializer().serializeToString(graphic);
    }, { rendered, title: view.title, description: view.description });
    const svgPath = path.join(output, `${view.id}.svg`);
    const pngPath = path.join(output, `${view.id}.png`);
    fs.writeFileSync(svgPath, svg);
    await page.locator('#view svg').screenshot({ path: pngPath });
    const { width, height } = await sharp(pngPath).metadata();
    results.push({ id: view.id, title: view.title, description: view.description,
      diagramSha256: view.diagramSha256, svgSha256: sha256(svg),
      pngSha256: sha256(fs.readFileSync(pngPath)), width, height,
      result: 'RENDERED — semantic and visual review separate' });
  }

  const failures = [];
  for (const view of views) {
    await page.goto(pathToFileURL(path.join(output, `${view.id}.svg`)).href);
    const opened = await page.evaluate(() => ({
      root: document.documentElement.localName,
      errors: document.querySelectorAll('parsererror').length,
      title: document.documentElement.querySelector('title')?.textContent || '',
    }));
    if (opened.root !== 'svg' || opened.errors || !opened.title) failures.push({ id: view.id, ...opened });
  }
  const browserVersion = browser.version();
  await browser.close();
  browser = null;
  const manifest = { evidenceId, source, sourceCommitAtRender: cp.execFileSync('git', ['rev-parse', 'HEAD'],
    { cwd: root, encoding: 'utf8' }).trim(), sourceState: 'WORKING_COPY — commit does not by itself pin these edits',
    sourceSha256: sha256(fs.readFileSync(path.join(root, source))),
    renderedAt: new Date().toISOString(), renderer: { mermaid: '11.12.0', chrome: browserVersion },
    views: results, standaloneSvg: failures.length ? 'FAIL' : 'PASS', standaloneFailures: failures };
  fs.writeFileSync(path.join(output, 'render-results.json'), JSON.stringify(manifest, null, 2) + '\n');
  const cards = results.map(v => `<article><h2>${escape(v.id)} — ${escape(v.title)}</h2><p>${escape(v.description)}</p><a href="${v.id}.svg"><img src="${v.id}.svg" alt="${escape(v.title)}"></a><p><a href="${v.id}.svg">Open full-resolution SVG</a> · <a href="${v.id}.png">Open PNG</a></p></article>`).join('');
  fs.writeFileSync(path.join(output, 'index.html'), `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>P06 recovery views</title><style>body{font:16px Arial,sans-serif;color:#172b4d;max-width:1600px;margin:28px auto;padding:0 24px;line-height:1.45}article{border-top:1px solid #b7c7d9;padding:18px 0}a{color:#145c9e}img{max-width:100%;height:auto}</style><h1>P06 recovery views</h1><p>DOC-05 candidate diagrams. Rendering is not a recovery test or independent architecture approval.</p>${cards}</html>`);
  if (failures.length) throw new Error(`Standalone SVG check failed: ${JSON.stringify(failures)}`);
  console.log(JSON.stringify({ output, count: results.length, standaloneSvg: 'PASS',
    dimensions: results.map(({ id, width, height }) => ({ id, width, height })) }));
})().catch(async error => { console.error(error); await browser?.close(); process.exitCode = 1; });
