import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const published=()=>JSON.parse(fs.readFileSync(path.join(root,'apps/server/src/main/resources/dev-access/openapi.json'),'utf8'));
const operations=doc=>Object.entries(doc.paths).flatMap(([route,item])=>Object.entries(item)
  .filter(([method])=>['get','post','put','patch','delete','head','options'].includes(method))
  .map(([method,value])=>({route,method,...value})));

test('Swagger describes all current Server and Gateway operations, without invented DESIGN endpoints',()=>{
  const doc=published(), list=operations(doc);
  assert.equal(list.length,46);
  assert.deepEqual(new Set(list.map(op=>op.tags[0])),new Set([
    'System','Identity / Session','Accounts','Projects / Groups','Roles','Assignments','Access','Gateway'
  ]));
  const accounts=doc.paths['/api/v1/administration/accounts'].get;
  assert.match(accounts.description,/Thẩm quyền/);
  assert.match(accounts.description,/Retry/);
  assert.ok(accounts.responses['200'].content['application/json'].schema);
  for(const route of ['/transfer/range','/transfer/status']){
    const op=doc.paths[route].post;
    assert.equal(op['x-idea-documentation-only'],true);
    assert.match(op.description,/Client.*Gateway/);
  }
  assert.equal(list.filter(op=>op['x-idea-surface']==='server').length,44);
  assert.equal(list.filter(op=>op['x-idea-surface']==='gateway').length,2);
  assert.doesNotMatch(JSON.stringify(doc),/\b(?:Codex|ChatGPT|Gemini|Claude|Copilot|OpenAI|Anthropic|DeepSeek|GPT(?:-[0-9.]+)?|AI)\b/i);
});
