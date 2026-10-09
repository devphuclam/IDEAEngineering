import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import vm from 'node:vm';
import {inflateRawSync} from 'node:zlib';
import {fileURLToPath} from 'node:url';
import {json} from './contract.mjs';
import {renderContract} from './render.mjs';

const tool=path.dirname(fileURLToPath(import.meta.url));
// Read OOXML members using only JDK-independent Node built-ins; no ZIP dependency added.
function member(file,name) {
  const data=fs.readFileSync(file); let end=data.length-22;
  while(end>=0&&data.readUInt32LE(end)!==0x06054b50)end--;
  assert.ok(end>=0,'ZIP end record');
  let pos=data.readUInt32LE(end+16);
  for(let i=0;i<data.readUInt16LE(end+10);i++){
    assert.equal(data.readUInt32LE(pos),0x02014b50);
    const method=data.readUInt16LE(pos+10),size=data.readUInt32LE(pos+20);
    const length=data.readUInt16LE(pos+28),extra=data.readUInt16LE(pos+30),comment=data.readUInt16LE(pos+32);
    if(data.subarray(pos+46,pos+46+length).toString()===name){
      const local=data.readUInt32LE(pos+42);
      const start=local+30+data.readUInt16LE(local+26)+data.readUInt16LE(local+28);
      const bytes=data.subarray(start,start+size);
      return (method===8?inflateRawSync(bytes):bytes).toString('utf8');
    }
    pos+=46+length+extra+comment;
  }
  throw Error('Missing ZIP member '+name);
}
function pageScript(html) {
  const script=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
  assert.ok(script,'one embedded script');
  const elements=new Map();
  const document={body:{classList:{toggle(){}}},querySelectorAll:()=>[],getElementById(id){
    if(!elements.has(id))elements.set(id,{innerHTML:'',addEventListener(){},style:{}});
    return elements.get(id);
  }};
  const context=vm.createContext({document,navigator:{clipboard:{writeText:()=>Promise.resolve()}},setTimeout(){}});
  vm.runInContext(script,context);
  return {elements,tab:tab=>vm.runInContext('setTab('+JSON.stringify(tab)+')',context)};
}

test('actual Word/Excel/HTML export retains every operation and truthful HTTP/DESIGN tabs',async()=>{
  const target=fs.mkdtempSync(path.join(os.tmpdir(),'idea-contract-render-'));
  try {
    const catalog=json(path.join(tool,'data/api-catalog.json'));
    const files=await renderContract(catalog,tool,target);
    const doc=member(files[0],'word/document.xml');
    const excel=member(files[1],'xl/sharedStrings.xml');
    const html=fs.readFileSync(files[2],'utf8');
    for(const entry of catalog.endpoints){
      assert.ok(doc.includes(entry.code),'Word '+entry.code);
      assert.ok(excel.includes(entry.code),'Excel '+entry.code);
      assert.ok(html.includes(entry.code),'HTML '+entry.code);
    }
    const page=pageScript(html);
    const count=()=>[...page.elements.get('contentArea').innerHTML.matchAll(/class="api-card"/g)].length;
    assert.equal(count(),55);
    page.tab('implemented');assert.equal(count(),46);
    page.tab('design');assert.equal(count(),9);
    const before=fs.readdirSync(path.join(target,'archive'));
    await renderContract(catalog,tool,target);
    assert.deepEqual(fs.readdirSync(path.join(target,'archive')),before,'repeat preserves archive');
  } finally {
    assert.ok(path.basename(target).startsWith('idea-contract-render-'));
    fs.rmSync(target,{recursive:true});
  }
});

test('contract text cannot become executable HTML or terminate the data script',async()=>{
  const target=fs.mkdtempSync(path.join(os.tmpdir(),'idea-contract-render-'));
  try {
    const catalog=json(path.join(tool,'data/api-catalog.json'));
    catalog.endpoints[0].description='</script><img src=x onerror="throw 1">';
    const files=await renderContract(catalog,tool,target);
    const html=fs.readFileSync(files[2],'utf8');
    const page=pageScript(html);
    assert.ok(page.elements.get('contentArea').innerHTML.includes('&lt;img'));
    assert.ok(!page.elements.get('contentArea').innerHTML.includes('<img src=x'));
  } finally {
    assert.ok(path.basename(target).startsWith('idea-contract-render-'));
    fs.rmSync(target,{recursive:true});
  }
});
