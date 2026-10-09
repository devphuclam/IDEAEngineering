import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const tool=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(tool,'../..');
test('check detects missing administration contracts without writing exports',()=>{
  const target=fs.mkdtempSync(path.join(os.tmpdir(),'idea-contract-restart-'));
  try {
    for(const folder of ['apps/server/src/main','apps/gateway/src/main','docs/product/instances/idea-engineering/api',
      'specs/009-iam-rbac-ui-integration/contracts','specs/005-ph1-foundation-custody/contracts']){
      fs.cpSync(path.join(root,folder),path.join(target,folder),{recursive:true});
    }
    const dest=path.join(target,'tools/contract-exporter');
    fs.mkdirSync(dest,{recursive:true});
    for(const file of ['export.mjs','contract.mjs','swagger.mjs','contract-config.json','source-review.json','package.json','data/api-catalog.json']){
      if(!fs.existsSync(path.join(tool,file))) continue;
      const out=path.join(dest,file);fs.mkdirSync(path.dirname(out),{recursive:true});fs.copyFileSync(path.join(tool,file),out);
    }
    fs.copyFileSync(path.join(root,'logo-idea.png'),path.join(target,'logo-idea.png'));
    fs.symlinkSync(path.join(tool,'node_modules'),path.join(dest,'node_modules'),'junction');
    const oasPath=path.join(target,'docs/product/instances/idea-engineering/api/server-openapi.json');
    const oas=JSON.parse(fs.readFileSync(oasPath,'utf8'));
    if(oas.paths['/api/v1/administration/accounts']) delete oas.paths['/api/v1/administration/accounts'].get;
    fs.writeFileSync(oasPath,JSON.stringify(oas));
    const result=spawnSync(process.execPath,[path.join(dest,'export.mjs'),'--check'],{encoding:'utf8'});
    assert.equal(result.status,1,'incomplete source contracts must not pass');
    assert.match(result.stderr,/UNDOCUMENTED_ROUTE server GET \/api\/v1\/administration\/accounts/);
    assert.equal(fs.existsSync(path.join(dest,'output')),false,'check is read-only');
  } finally {
    assert.ok(path.basename(target).startsWith('idea-contract-restart-'));
    fs.rmSync(target,{recursive:true,force:true});
  }
});
