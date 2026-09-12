// Render controlled architecture views without changing their Markdown sources.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { chromium } = require(process.env.IDEA_PLAYWRIGHT_PATH || 'playwright');
const root = path.resolve(__dirname, '..');
const base = 'docs/product/instances/idea-engineering';
const out = path.join(root, base, 'evidence/IE-VEV-ARCH-VIEW-002');
const sha = s => crypto.createHash('sha256').update(s).digest('hex');
const html = s => String(s).replace(/[&<>\"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
(async () => {
  fs.mkdirSync(out, {recursive:true});
  const browser = await chromium.launch({channel:'chrome', headless:true});
  const page = await browser.newPage({viewport:{width:1800,height:1200},deviceScaleFactor:1});
  await page.setContent('<html><body><div id="view"></div></body></html>');
  await page.addScriptTag({url:'https://cdn.jsdelivr.net/npm/mermaid@11.12.0/dist/mermaid.min.js'});
  await page.evaluate(() => mermaid.initialize({startOnLoad:false,securityLevel:'strict',theme:'neutral'}));
  const results = [], sources = [];
  for (const name of ['DOC-05-architecture-description.md','DOC-06-data-integration-and-migration-specification.md']) {
    const content = fs.readFileSync(path.join(root,base,name),'utf8');
    sources.push({name,sha256:sha(content)});
    for (const match of content.matchAll(/```mermaid\r?\n([\s\S]*?)```/g)) {
      const before = content.slice(0,match.index);
      const ids = [...before.matchAll(/\*\*`((?:ARCH|DATA)-VIEW-[A-Z]+-\d+)`/g)];
      const id = ids.at(-1)?.[1];
      if (!id || results.some(r=>r.id===id)) throw Error('Missing or duplicate view ID: '+id);
      if (!match[1].includes('accTitle:') || !match[1].includes('accDescr:')) throw Error('Missing alternative: '+id);
      const title = match[1].match(/^\s*accTitle:\s*(.+)\r?$/m)?.[1].trim();
      const description = match[1].match(/^\s*accDescr:\s*(.+)\r?$/m)?.[1].trim();
      if (!title || !description) throw Error('Empty alternative: '+id);
      const rendered = await page.evaluate(async ({code,n}) => (await mermaid.render('diagram'+n,code)).svg,{code:match[1],n:results.length});
      const svg = await page.evaluate(renderedSvg => {
        document.querySelector('#view').innerHTML=renderedSvg;
        const el=document.querySelector('#view svg');
        el.style.maxWidth='none';
        el.style.width=el.viewBox.baseVal.width+'px';
        // Mermaid returns HTML-label markup. Serializing the live DOM as XML makes void HTML
        // elements such as <br> valid when the generated SVG is opened as a standalone file.
        return new XMLSerializer().serializeToString(el);
      },rendered);
      fs.writeFileSync(path.join(out,id+'.svg'),svg);
      await page.locator('#view svg').screenshot({path:path.join(out,id+'.png')});
      results.push({id,title,description,status:'PASS — RENDER',svgSha256:sha(svg)});
    }
  }
  const newIds=['ACT-002','SEQ-008','STATE-005','SEQ-009','SEQ-010','SEQ-011','SEC-001'].map(s=>'ARCH-VIEW-'+s);
  const cards=results.map(r=>`<article id="${r.id}"><h2>${html(r.title)}</h2><p><code>${r.id}</code> — ${html(r.description)}</p><a href="${r.id}.svg" aria-label="Mở ${html(r.id)} ở kích thước đầy đủ"><img src="${r.id}.svg" alt="${html(r.title)}"></a></article>`).join('');
  fs.writeFileSync(path.join(out,'index.html'),`<!doctype html><html lang="vi"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>IDEA — Kiến trúc</title><style>body{font:16px Arial;margin:24px auto;padding:0 20px;max-width:1680px;color:#172b4d;line-height:1.45}nav{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:8px;margin:20px 0}nav a{padding:10px;border:1px solid #ccd5df;border-radius:4px}article{border-top:1px solid #ccd5df;padding:24px 0}img{max-width:100%;height:auto}h2{font-size:20px;margin-bottom:4px}a{color:#155ca0}code{font-weight:bold}</style><h1>IDEA — Bộ sơ đồ kiến trúc</h1><p>${results.length} sơ đồ. Bấm hình để mở SVG ở kích thước đầy đủ. Đây là bản thiết kế Draft, chưa phải bằng chứng phần mềm đã triển khai.</p><h2>Bảy sơ đồ bổ sung</h2><nav>${newIds.map(id=>{const r=results.find(x=>x.id===id);return `<a href="#${id}"><code>${id}</code><br>${html(r.title)}</a>`}).join('')}</nav>${cards}</html>`);
  fs.writeFileSync(path.join(out,'render-results.json'),JSON.stringify({renderedAt:new Date().toISOString(),browser:browser.version(),mermaid:'11.12.0',sources,results},null,2));
  console.log(JSON.stringify({count:results.length,newIds,output:out}));
  await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
