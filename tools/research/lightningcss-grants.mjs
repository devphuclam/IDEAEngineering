// First-party reference-only screen. No archives, packages, cache or output writes.
// stdout contains hashes/observations, never copied upstream legal text.
import { createHash } from 'node:crypto';
const commit = 'c6a0c3cebf3395635e61075d2c81a96a710d4910';
const lockUrl = `https://raw.githubusercontent.com/parcel-bundler/lightningcss/${commit}/Cargo.lock`;
const hash = x => createHash('sha256').update(x).digest('hex');
let rateLimited = false;
async function get(url) {
  if (rateLimited) throw new Error('ACCESS-DEFERRED-AFTER-429');
  const r = await fetch(url, { signal: AbortSignal.timeout(25000) });
  if (r.status === 429) rateLimited = true;
  if (!r.ok) throw new Error(`HTTP-${r.status}`);
  return await r.text();
}
function decode(x) {
  return x.replace(/<[^>]*>/g, '').replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n,16)))
    .replace(/&#([0-9]+);/g, (_, n) => String.fromCodePoint(+n))
    .replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&apos;|&#39;/g,"'").replace(/&amp;/g,'&');
}
function source(html) {
  const block = html.match(/<div id="source-code"[\s\S]*?<pre[^>]*>([\s\S]*?)<\/pre>/);
  if (!block) throw new Error('NO-SOURCE-TEXT');
  return decode(block[1]);
}
function grants(text) {
  const out = [];
  if (/Permission is hereby granted, free of charge/i.test(text)) out.push('MIT');
  if (/Apache License[\s\S]{0,80}Version 2\.0/i.test(text) && /TERMS AND CONDITIONS FOR USE/.test(text)) out.push('Apache-2.0');
  if (/Mozilla Public License[\s\S]{0,80}Version 2\.0/i.test(text) && /2\.1\.?[\s\S]{0,50}Grants/.test(text)) out.push('MPL-2.0');
  if (/Redistribution and use in source and binary forms/i.test(text)) out.push(/Neither the name|names of its contributors/i.test(text) ? 'BSD-3-Clause' : 'BSD-style');
  if (/Permission to use, copy, modify, and\/or distribute this software/i.test(text)) out.push('ISC');
  if (/This is free and unencumbered software released into the public domain/i.test(text)) out.push('Unlicense');
  if (/Boost Software License[\s\S]{0,40}1\.0/i.test(text)) out.push('BSL-1.0');
  if (/Creative Commons Legal Code[\s\S]*CC0|CC0 1\.0 Universal/.test(text)) out.push('CC0-1.0');
  if (/zlib|altered source versions must be plainly marked/i.test(text) && /origin of this software must not be misrepresented/i.test(text)) out.push('Zlib');
  return out;
}
const lock = await get(lockUrl);
const packages = lock.split('[[package]]').slice(1).map(b => {
  const field = k => b.match(new RegExp(`^${k} = "([^"]+)"`, 'm'))?.[1] || '';
  return { name:field('name'), version:field('version'), source:field('source'), checksum:field('checksum') };
});
let cursor = 0;
const rows = Array(packages.length);
async function worker() {
  while (cursor < packages.length) {
    const i = cursor++; const p = packages[i];
    const row = {...p, legal:[], metadataLicense:'', status:'UNKNOWN', error:''};
    rows[i] = row;
    if (!p.source) { row.status='LOCAL-SOURCE'; continue; }
    if (!p.source.startsWith('registry+')) { row.error='NON-REGISTRY'; continue; }
    const base = `https://docs.rs/crate/${p.name}/${p.version}/source/`;
    try {
      const listing = await get(base);
      const identity = listing.match(/<script id="crate-metadata"[^>]*>([\s\S]*?)<\/script>/);
      if (!identity || JSON.parse(identity[1]).version !== p.version) throw new Error('VERSION-MISMATCH');
      const files = [...listing.matchAll(/href="\.\/([^"/]+)"/g)].map(m=>m[1]);
      const paths = files.filter(f=>/^(licen[sc]e|copying|notice|copyright|unlicense)([-._].*)?$/i.test(f));
      for (const path of paths) {
        const url=base+path;
        try { const text=source(await get(url)); row.legal.push({path,url,sha256:hash(text),terms:grants(text),bytes:Buffer.byteLength(text)}); }
        catch(e) { row.legal.push({path,url,error:e.message}); }
      }
      if(files.includes('Cargo.toml')) {
        const manifest=source(await get(base+'Cargo.toml'));
        row.metadataLicense=manifest.match(/^license\s*=\s*"([^"]+)"/m)?.[1] || '';
        row.manifestSha256=hash(manifest);
      }
      row.status = row.legal.some(x=>x.terms?.length) ? 'GRANT-TEXT-OBSERVED' : 'UNKNOWN';
    } catch(e) { row.error=e.message; }
    // A separate metadata read failure cannot erase already observed actual grant text.
    if (row.legal.some(x=>x.terms?.length)) row.status='GRANT-TEXT-OBSERVED';
  }
}
await Promise.all(Array.from({length:6},worker));
console.log(JSON.stringify({lockUrl,lockSha256:hash(lock),count:packages.length,rows}));
