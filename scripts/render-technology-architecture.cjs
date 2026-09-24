// Render the controlled technology architecture view set with the repository's Mermaid/Chrome convention.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { pathToFileURL } = require('node:url');
const { chromium } = require(process.env.IDEA_PLAYWRIGHT_PATH || 'playwright');

const root = path.resolve(__dirname, '..');
const sourcePath = path.join(
  root,
  'docs/product/instances/idea-engineering/technology/IDEA-core-v0-technology-architecture-views.md',
);
const evidenceId = process.env.IDEA_ARCH_EVIDENCE_ID;
if (!evidenceId) {
  throw new Error('Set IDEA_ARCH_EVIDENCE_ID to the new evidence record; do not overwrite historical evidence.');
}
if (!/^IE-VEV-[A-Z0-9-]+$/.test(evidenceId)) {
  throw new Error(`Invalid IDEA_ARCH_EVIDENCE_ID: ${evidenceId}`);
}

const out = path.join(
  root,
  'docs/product/instances/idea-engineering/evidence',
  evidenceId,
);
const sha = value => crypto.createHash('sha256').update(value).digest('hex');
const html = value => String(value).replace(/[&<>\"]/g, character => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
}[character]));

(async () => {
  const content = fs.readFileSync(sourcePath, 'utf8');
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1800, height: 1400 }, deviceScaleFactor: 1 });
  await page.setContent('<html><body><div id="view"></div></body></html>');
  await page.addScriptTag({ url: 'https://cdn.jsdelivr.net/npm/mermaid@11.12.0/dist/mermaid.min.js' });
  await page.evaluate(() => mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'strict',
    theme: 'neutral',
    flowchart: { curve: 'basis', htmlLabels: true, nodeSpacing: 35, rankSpacing: 45 },
  }));

  const results = [];
  for (const match of content.matchAll(/```mermaid\r?\n([\s\S]*?)```/g)) {
    const before = content.slice(0, match.index);
    const ids = [...before.matchAll(/##\s+`?(TECH-D\d{2})`?\s+—/g)];
    const id = ids.at(-1)?.[1];
    if (!id || results.some(result => result.id === id)) {
      throw new Error(`Missing or duplicate technology view ID: ${id}`);
    }
    if (!match[1].includes('accTitle:') || !match[1].includes('accDescr:')) {
      throw new Error(`Missing accessibility alternative: ${id}`);
    }
    const title = match[1].match(/^\s*(?:%%\s*)?accTitle:\s*(.+)\r?$/m)?.[1].trim();
    const description = match[1].match(/^\s*(?:%%\s*)?accDescr:\s*(.+)\r?$/m)?.[1].trim();
    if (!title || !description) {
      throw new Error(`Empty accessibility alternative: ${id}`);
    }

    const rendered = await page.evaluate(
      async ({ code, number }) => (await mermaid.render(`technologyDiagram${number}`, code)).svg,
      { code: match[1], number: results.length },
    );
    const svg = await page.evaluate(({ renderedSvg, titleText, descriptionText }) => {
      document.querySelector('#view').innerHTML = renderedSvg;
      const element = document.querySelector('#view svg');
      element.style.maxWidth = 'none';
      element.style.width = `${element.viewBox.baseVal.width}px`;
      element.setAttribute('role', 'img');
      if (!element.querySelector(':scope > title')) {
        const titleElement = document.createElementNS('http://www.w3.org/2000/svg', 'title');
        titleElement.textContent = titleText;
        element.insertBefore(titleElement, element.firstChild);
      }
      if (!element.querySelector(':scope > desc')) {
        const descriptionElement = document.createElementNS('http://www.w3.org/2000/svg', 'desc');
        descriptionElement.textContent = descriptionText;
        element.querySelector(':scope > title').after(descriptionElement);
      }
      return new XMLSerializer().serializeToString(element);
    }, { renderedSvg: rendered, titleText: title, descriptionText: description });

    fs.writeFileSync(path.join(out, `${id}.svg`), svg);
    await page.locator('#view svg').screenshot({ path: path.join(out, `${id}.png`) });
    results.push({ id, title, description, status: 'PASS — RENDER', svgSha256: sha(svg) });
  }

  const expected = Array.from({ length: 8 }, (_, index) => `TECH-D${String(index + 1).padStart(2, '0')}`);
  const actual = results.map(result => result.id);
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`Expected ${expected.join(', ')}, rendered ${actual.join(', ')}`);
  }

  const openFailures = [];
  for (const result of results) {
    await page.goto(pathToFileURL(path.join(out, `${result.id}.svg`)).href);
    const check = await page.evaluate(() => ({
      root: document.documentElement.nodeName,
      parserErrors: document.querySelectorAll('parsererror').length,
      text: document.documentElement.textContent.slice(0, 500),
    }));
    if (check.root.toLowerCase() !== 'svg'
      || check.parserErrors
      || /this page contains the following errors/i.test(check.text)) {
      openFailures.push({ id: result.id, ...check });
    }
  }
  fs.writeFileSync(path.join(out, 'svg-open-results.json'), JSON.stringify({
    evidenceId,
    checkedAt: new Date().toISOString(),
    count: results.length,
    failures: openFailures,
    status: openFailures.length ? 'FAIL' : 'PASS',
  }, null, 2));
  if (openFailures.length) {
    throw new Error(`Standalone SVG failures: ${JSON.stringify(openFailures)}`);
  }

  const navigation = results.map(result =>
    `<a href="#${result.id}"><code>${result.id}</code><br>${html(result.title)}</a>`,
  ).join('');
  const cards = results.map(result =>
    `<article id="${result.id}"><h2>${html(result.title)}</h2>` +
    `<p><code>${result.id}</code> — ${html(result.description)}</p>` +
    `<a href="${result.id}.svg" aria-label="Open ${html(result.id)} at full size">` +
    `<img src="${result.id}.svg" alt="${html(result.title)}"></a></article>`,
  ).join('');
  fs.writeFileSync(path.join(out, 'index.html'), `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>IDEA Core v0 — Technology Architecture Views</title><style>body{font:16px Arial,sans-serif;margin:24px auto;padding:0 20px;max-width:1680px;color:#172b4d;line-height:1.45}nav{display:grid;grid-template-columns:repeat(auto-fit,minmax(270px,1fr));gap:8px;margin:20px 0}nav a{padding:10px;border:1px solid #ccd5df;border-radius:4px}article{border-top:1px solid #ccd5df;padding:24px 0}img{max-width:100%;height:auto}h2{font-size:20px;margin-bottom:4px}a{color:#155ca0}code{font-weight:bold}</style><h1>IDEA Core v0 — Technology Architecture Views</h1><p>Eight focused views. Select an image to open its SVG at full resolution. These are Draft engineering-baseline views; rendering is not implementation evidence or Product Decision Authority approval.</p><nav>${navigation}</nav>${cards}</html>`);
  fs.writeFileSync(path.join(out, 'render-results.json'), JSON.stringify({
    evidenceId,
    renderedAt: new Date().toISOString(),
    browser: browser.version(),
    mermaid: '11.12.0',
    source: {
      path: path.relative(root, sourcePath).replaceAll('\\', '/'),
      sha256: sha(content),
    },
    results,
  }, null, 2));

  console.log(JSON.stringify({ evidenceId, count: results.length, standaloneSvg: 'PASS', output: out }));
  await browser.close();
})().catch(error => {
  console.error(error);
  process.exit(1);
});
