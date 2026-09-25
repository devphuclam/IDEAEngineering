// Render only the newly changed DOC-05 Check-in scope view; retain older galleries.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const cp = require('node:child_process');
const { pathToFileURL } = require('node:url');
const { chromium } = require(process.env.IDEA_PLAYWRIGHT_PATH || 'playwright');
const sharp = require(process.env.IDEA_SHARP_PATH || 'sharp');

const root = path.resolve(__dirname, '..');
const source = 'docs/product/instances/idea-engineering/DOC-05-architecture-description.md';
const id = 'ARCH-VIEW-ACT-004';
const evidenceId = 'IE-VEV-WS-SCOPE-002';
const canonicalOutput = path.join(root, 'docs/product/instances/idea-engineering/evidence', evidenceId);
const output = path.resolve(process.env.IDEA_WS_SCOPE_OUTPUT_DIR || canonicalOutput);
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const escape = value => String(value).replace(/[&<>"']/g,
  ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);

async function main() {
  if (fs.existsSync(output)) throw new Error(`Evidence target already exists: ${output}`);
  const document = fs.readFileSync(path.join(root, source), 'utf8').replace(/\r\n/g, '\n');
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
  if (!title || !description) throw new Error('Accessible title and description are required');

  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1800, height: 1400 }, deviceScaleFactor: 1 });
    await page.setContent('<html><body style="margin:0;background:#fff"><div id="view"></div></body></html>');
    await page.addScriptTag({ url: 'https://cdn.jsdelivr.net/npm/mermaid@11.12.0/dist/mermaid.min.js' });
    await page.evaluate(() => mermaid.initialize({
      startOnLoad: false, securityLevel: 'strict', theme: 'neutral',
      themeVariables: { fontFamily: 'Arial, sans-serif', fontSize: '17px' },
      flowchart: { curve: 'linear', htmlLabels: true, nodeSpacing: 45, rankSpacing: 65 },
    }));
    await page.evaluate(async sourceCode => mermaid.parse(sourceCode), code);
    const rendered = await page.evaluate(async sourceCode =>
      (await mermaid.render('checkinScopeDecision', sourceCode)).svg, code);
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
    }, { rendered, title, description });

    fs.mkdirSync(output, { recursive: true });
    fs.writeFileSync(path.join(output, `${id}.mmd`), code);
    const svgPath = path.join(output, `${id}.svg`);
    const pngPath = path.join(output, `${id}.png`);
    fs.writeFileSync(svgPath, svg);
    await page.locator('#view svg').screenshot({ path: pngPath });
    const { width, height } = await sharp(pngPath).metadata();
    await page.goto(pathToFileURL(svgPath).href);
    const opened = await page.evaluate(() => ({
      root: document.documentElement.localName,
      parserErrors: document.querySelectorAll('parsererror').length,
      title: document.documentElement.querySelector('title')?.textContent || '',
    }));
    if (opened.root !== 'svg' || opened.parserErrors || !opened.title) {
      throw new Error(`Standalone SVG invalid: ${JSON.stringify(opened)}`);
    }
    const result = {
      evidenceId, id, title, description, source,
      sourceCommitAtRender: cp.execFileSync('git', ['rev-parse', 'HEAD'],
        { cwd: root, encoding: 'utf8' }).trim(),
      sourceState: 'WORKING_COPY — commit does not by itself pin these edits',
      sourceSha256: sha256(fs.readFileSync(path.join(root, source))),
      diagramSha256: sha256(code), svgSha256: sha256(svg),
      pngSha256: sha256(fs.readFileSync(pngPath)),
      renderedAt: new Date().toISOString(),
      renderer: { mermaid: '11.12.0', chrome: browser.version() },
      dimensions: { width, height }, standaloneSvg: 'PASS',
      reviewBoundary: 'Rendering and SVG opening only; semantic and visual review are separate',
    };
    fs.writeFileSync(path.join(output, 'render-results.json'), JSON.stringify(result, null, 2) + '\n');
    fs.writeFileSync(path.join(output, 'index.html'), `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Check-in scope decision</title><style>body{font:16px Arial,sans-serif;color:#172b4d;max-width:1500px;margin:28px auto;padding:0 24px;line-height:1.45}img{max-width:100%;height:auto}a{color:#145c9e}</style><h1>${escape(id)} — ${escape(title)}</h1><p>${escape(description)}</p><p>The three scope-policy branches were approved on 25 September 2026. The architecture view is still Draft; software tests have not run.</p><a href="${id}.svg"><img src="${id}.svg" alt="${escape(title)}"></a><p><a href="${id}.svg">Open full-resolution SVG</a> · <a href="${id}.png">Open PNG</a></p></html>`);
    process.stdout.write(JSON.stringify({ output, id, width, height, standaloneSvg: 'PASS' }) + '\n');
  } finally {
    await browser.close();
  }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
