import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';

test('normal launcher packet pins the qualified documentation package and keeps independent dev topology',()=>{
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'idea-docs-control-'));
  try{
    const target=path.join(root,'packet');
    const result=spawnSync(process.execPath,[fileURLToPath(new URL('../../tools/dev-access/packet.mjs',import.meta.url)),target],{encoding:'utf8'});
    assert.equal(result.status,0);
    const env=fs.readFileSync(path.join(target,'environment.sh'),'utf8');
    assert.match(env,/jar=\/home\/phuclam\/idea-api-docs-20261009-53-01\/idea-server-documentation.jar/);
    assert.match(env,/jar_sha256=103b5bc8fa628f7a83e56dfa3393e24b7f29d3d9c7f7e201dc344385da2e0a44/);
    assert.match(env,/documentation_source=ca310947ebc2115bf166a2688952c1f6ecaeb126/);
    assert.match(env,/application_source=9d3732cb173e8094195b9bdd60b5588ac3cfa42e/);
    const backend=fs.readFileSync(path.join(target,'backend.sh'),'utf8');
    assert.match(backend,/DOCUMENTATION_SOURCE=\$documentation_source/);
    assert.match(backend,/--spring.flyway.enabled=false/);
    assert.match(fs.readFileSync(path.join(target,'common.sh'),'utf8'),/== "\$jar_sha256"/);
    assert.match(fs.readFileSync(path.join(target,'nginx-dev.conf'),'utf8'),/proxy_pass http:\/\/127\.0\.0\.1:18450/);
    for(const line of fs.readFileSync(path.join(target,'inputs.sha256'),'utf8').trim().split('\n')){
      const [hash,name]=line.split('  ');
      assert.equal(createHash('sha256').update(fs.readFileSync(path.join(target,name))).digest('hex'),hash);
    }
  }finally{
    assert.ok(path.basename(root).startsWith('idea-docs-control-'));fs.rmSync(root,{recursive:true});
  }
});
