import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import os from 'node:os';
import { spawnSync } from 'node:child_process';
import { checkContract, json, projectCatalog, stableJSON } from './contract.mjs';

const tool = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(tool,'../..');

// Each mutation lives in a new owned temporary repository. Never modify the working source.
function fixture(run) {
  const target=fs.mkdtempSync(path.join(os.tmpdir(),'idea-contract-test-'));
  try {
    for (const folder of ['apps/server/src/main','apps/gateway/src/main',
      'specs/009-iam-rbac-ui-integration/contracts','specs/005-ph1-foundation-custody/contracts',
      'docs/product/instances/idea-engineering/api']) {
      fs.cpSync(path.join(root,folder),path.join(target,folder),{recursive:true});
    }
    for (const file of ['export.mjs','contract.mjs','contract-config.json','source-review.json','data/api-catalog.json']) {
      const dest=path.join(target,'tools/contract-exporter',file);
      fs.mkdirSync(path.dirname(dest),{recursive:true}); fs.copyFileSync(path.join(tool,file),dest);
    }
    return run(target);
  } finally {
    // target is the exact mkdtemp-created test root, not a workspace/home directory.
    assert.ok(path.basename(target).startsWith('idea-contract-test-'));
    fs.rmSync(target,{recursive:true});
  }
}
function editOas(target,edit) {
  const file=path.join(target,'apps/server/src/main/resources/dev-access/openapi.json');
  const doc=json(file);edit(doc);fs.writeFileSync(file,stableJSON(doc));
}
function cli(target,...args) {
  return spawnSync(process.execPath,[path.join(target,'tools/contract-exporter/export.mjs'),...args],{encoding:'utf8'});
}

test('published catalogue includes the actual account directory HTTP adapter', () => {
  const catalog = JSON.parse(fs.readFileSync(path.join(tool, 'data/api-catalog.json'), 'utf8'));
  assert.ok(catalog.endpoints.some(e =>
    e.method === 'GET' && e.path === '/api/v1/administration/accounts'),
    'implemented account directory must not disappear from the exported contract');
});

test('all 46 actual Server/Gateway operations are covered; CPD remains nine DESIGN cards', () => {
  const result=checkContract(root);
  assert.deepEqual(result.errors,[]);
  assert.equal(result.routes.length,46);
  assert.equal(result.operations.length,46);
  assert.equal(result.catalog.endpoints.filter(e=>e.method==='UNKNOWN').length,9);
  assert.equal(result.catalog.endpoints.length,55);
});

test('new executable route without contract refuses check AND update without writes', () => fixture(target=>{
  const dir=path.join(target,'apps/server/src/main/java/com/idea/ddm');
  fs.writeFileSync(path.join(dir,'NewController.java'),'@RestController class NewController { @GetMapping("/api/v1/new-capability") Object read(){return null;} }');
  const catalogPath=path.join(target,'tools/contract-exporter/data/api-catalog.json');
  const before=fs.readFileSync(catalogPath,'utf8');
  for (const args of [['--check'],['--update','--data-only']]) {
    const result=cli(target,...args);
    assert.equal(result.status,1);
    assert.match(result.stderr,/UNDOCUMENTED_ROUTE server GET \/api\/v1\/new-capability/);
  }
  assert.equal(fs.readFileSync(catalogPath,'utf8'),before);
  assert.equal(fs.existsSync(path.join(target,'tools/contract-exporter/output')),false);
}));

test('method drift is rejected, not silently smart-merged',()=>fixture(target=>{
  editOas(target,doc=>{
    const item=doc.paths['/api/v1/administration/accounts'];
    item.post=item.get;delete item.get;
  });
  const result=checkContract(target);
  assert.ok(result.errors.some(e=>e.includes('UNDOCUMENTED_ROUTE server GET')));
  assert.ok(result.errors.some(e=>e.includes('STALE_CONTRACT_ROUTE server POST')));
}));

test('deleted source route leaves a stale contract finding',()=>fixture(target=>{
  const file=path.join(target,'apps/server/src/main/java/com/idea/ddm/identity/IdentityAccountAdministration.java');
  fs.writeFileSync(file,fs.readFileSync(file,'utf8').replace('@GetMapping("/accounts")',''));
  assert.ok(checkContract(target).errors.some(e=>e.includes('STALE_CONTRACT_ROUTE server GET /api/v1/administration/accounts')));
}));

test('request/response DTO or owner behavior change requires explicit source review',()=>fixture(target=>{
  const file=path.join(target,'apps/server/src/main/java/com/idea/ddm/identity/IdentityDirectoryQueries.java');
  fs.writeFileSync(file,fs.readFileSync(file,'utf8').replace('String displayName','String renamedField'));
  assert.ok(checkContract(target).errors.some(e=>e.includes('SOURCE_REVIEW_REQUIRED')&&e.includes('IdentityDirectoryQueries.java')));
  assert.equal(cli(target,'--update','--data-only').status,1);
}));

test('unresolved references refuse publication',()=>fixture(target=>{
  editOas(target,doc=>doc.paths['/api/v1/administration/accounts'].get.responses['200'].content['application/json'].schema={$ref:'#/components/schemas/DoesNotExist'});
  assert.ok(checkContract(target).errors.some(e=>e.includes('Unresolved OpenAPI reference')));
}));

test('required path parameters cannot disappear',()=>fixture(target=>{
  editOas(target,doc=>doc.paths['/api/v1/administration/accounts/{account}'].get.parameters=[]);
  assert.ok(checkContract(target).errors.some(e=>e.includes('Missing required path parameter account')));
}));

test('duplicate operation identities refuse publication',()=>fixture(target=>{
  editOas(target,doc=>doc.paths['/api/v1/administration/accounts'].get.operationId='currentSession');
  assert.ok(checkContract(target).errors.some(e=>e.includes('Duplicate operationId')));
}));

test('missing authority/retry metadata cannot be replaced with guesses',()=>fixture(target=>{
  editOas(target,doc=>delete doc.paths['/api/v1/administration/accounts'].get['x-idea-contract'].authority);
  assert.ok(checkContract(target).errors.some(e=>e.includes('Missing contract authority')));
}));

test('modified generated catalogue is stale; update restores it deterministically',()=>fixture(target=>{
  const file=path.join(target,'tools/contract-exporter/data/api-catalog.json');
  const edited=json(file);edited.endpoints.pop();fs.writeFileSync(file,stableJSON(edited));
  assert.ok(checkContract(target).errors.some(e=>e.startsWith('STALE_EXPORT_CATALOG')));
  assert.equal(cli(target,'--update','--data-only').status,0);
  const once=fs.readFileSync(file,'utf8');
  assert.equal(cli(target,'--update','--data-only').status,0);
  assert.equal(fs.readFileSync(file,'utf8'),once);
  assert.equal(cli(target,'--check').status,0);
}));

test('--check is read-only and needs no renderer/npm dependencies',()=>fixture(target=>{
  const file=path.join(target,'tools/contract-exporter/data/api-catalog.json');
  const before=fs.readFileSync(file,'utf8');
  const result=cli(target,'--check','--json');
  assert.equal(result.status,0,result.stderr);
  assert.equal(JSON.parse(result.stdout).status,'PASS');
  assert.equal(fs.readFileSync(file,'utf8'),before);
  assert.equal(fs.existsSync(path.join(target,'tools/contract-exporter/output')),false);
}));

test('login and logout filter routes are discovered from actual framework source',()=>{
  const result=checkContract(root);
  assert.ok(result.routes.some(r=>r.method==='POST'&&r.path==='/api/v1/identity/login'&&r.source.endsWith('IdentityHttpSecurity.java')));
  assert.ok(result.routes.some(r=>r.method==='POST'&&r.path==='/api/v1/identity/logout'&&r.source.endsWith('LogoutBoundary.java')));
});

test('unsupported dynamic mapping fails closed rather than disappearing',()=>fixture(target=>{
  fs.writeFileSync(path.join(target,'apps/server/src/main/java/DynamicController.java'),
    '@RestController class DynamicController { @GetMapping(PATH_CONSTANT) Object read(){return null;} }');
  assert.ok(checkContract(target).errors.some(e=>e.includes('Unsupported mapping syntax')));
}));

test('implicit mapping fails closed',()=>fixture(target=>{
  fs.writeFileSync(path.join(target,'apps/server/src/main/java/ImplicitController.java'),
    '@RestController class ImplicitController { @GetMapping Object read(){return null;} }');
  assert.ok(checkContract(target).errors.some(e=>e.includes('Implicit/unsupported route annotation')));
}));

test('mapping-looking comments are not executable routes',()=>fixture(target=>{
  fs.writeFileSync(path.join(target,'apps/server/src/main/java/Comment.java'),
    '// @GetMapping("/fake")\nclass Comment { String s="//not a comment"; }');
  assert.deepEqual(checkContract(target).errors,[]);
}));

test('Gateway status is POST with binary response, Account path uses Account identity',()=>{
  const catalog=projectCatalog(checkContract(root));
  const status=catalog.endpoints.find(e=>e.code==='VLT-02');
  assert.equal(status.method,'POST');
  assert.ok(status.fields.some(f=>f.in.includes('application/octet-stream')&&f.validation.includes('binary')));
  const disable=catalog.endpoints.find(e=>e.code==='IAM-02');
  assert.equal(disable.path,'/api/v1/identity/accounts/{account}/disable');
});

test('reset supports DISABLED + exact Login Identity; re-enable can return PENDING',()=>{
  const result=checkContract(root);
  const proof=result.catalog.endpoints.find(e=>e.code==='IAM-04');
  assert.match(proof.preconditions,/ACTIVE or DISABLED/);
  assert.ok(proof.fields.some(f=>f.name==='loginIdentityId'));
  assert.match(result.catalog.endpoints.find(e=>e.code==='IAM-03').preconditions,/otherwise PENDING/);
});

test('external refs are refused',()=>fixture(target=>{
  editOas(target,doc=>doc.paths['/api/v1/administration/accounts'].get.responses['200'].content['application/json'].schema={$ref:'https://unapproved.invalid/schema'});
  assert.ok(checkContract(target).errors.some(e=>e.includes('External OpenAPI reference')));
}));

test('another controller cannot hide a new API behind the documentation prefix',()=>fixture(target=>{
  fs.writeFileSync(path.join(target,'apps/server/src/main/java/HiddenController.java'),
    '@RestController class HiddenController { @GetMapping("/dev-api/new-business-api") Object read(){return null;} }');
  assert.ok(checkContract(target).errors.some(e=>e.includes('UNDOCUMENTED_ROUTE server GET /dev-api/new-business-api')));
}));

test('unreviewed custom filter cannot silently become another HTTP surface',()=>fixture(target=>{
  fs.writeFileSync(path.join(target,'apps/server/src/main/java/NewFilter.java'),
    'class NewFilter extends OncePerRequestFilter { void doFilterInternal(){} }');
  assert.ok(checkContract(target).errors.some(e=>e.includes('Unreviewed filter/servlet registration')));
}));

test('path variable identity must match the executable contract',()=>fixture(target=>{
  editOas(target,doc=>{
    const old='/api/v1/administration/accounts/{account}';
    doc.paths[old.replace('{account}','{actorId}')]=doc.paths[old];delete doc.paths[old];
    doc.paths[old.replace('{account}','{actorId}')].get.parameters[0].name='actorId';
  });
  assert.ok(checkContract(target).errors.some(e=>e.includes('UNDOCUMENTED_ROUTE server GET /api/v1/administration/accounts/{account}')));
}));

test('configuration paths cannot escape the repository',()=>fixture(target=>{
  const file=path.join(target,'tools/contract-exporter/contract-config.json');
  const config=json(file);config.reviewedSources.push('../outside.java');fs.writeFileSync(file,stableJSON(config));
  const result=cli(target,'--check');
  assert.equal(result.status,1);assert.match(result.stderr,/Path escapes repository/);
}));

test('new Swagger descriptions do not unlock Try it out or promise login 503',()=>{
  const doc=json(path.join(root,'apps/server/src/main/resources/dev-access/openapi.json'));
  for(const [route,item] of Object.entries(doc.paths)) {
    if(route.startsWith('/api/v1/administration/')||route==='/api/v1/projects/{id}')
      for(const operation of Object.values(item))assert.equal(operation['x-idea-documentation-only'],true);
  }
  assert.equal(doc.paths['/api/v1/identity/login'].post.responses['503'],undefined);
  assert.equal(doc.paths['/api/v1/identity/login'].post['x-idea-documentation-only'],true);
  assert.equal(doc.paths['/api/v1/identity/credentials'].post['x-idea-documentation-only'],true);
  assert.equal(doc.paths['/api/v1/identity/accounts/{account}/credential-proofs'].post.responses['200'].content['application/json'].schema.$ref,'#/components/schemas/IssuedProof');
});

test('business type fields in a valid JSON example are not schema declarations',()=>fixture(target=>{
  editOas(target,doc=>{
    doc.paths['/api/v1/administration/assignments'].post.requestBody.content['application/json'].example=
      {principal:{type:'ACTOR',id:'00000000-0000-4000-8000-000000000001'}};
  });
  assert.deepEqual(checkContract(target,{checkCatalog:false}).errors,[]);
}));

test('invalid actual schema shape is refused',()=>fixture(target=>{
  editOas(target,doc=>doc.components.schemas.Bad={type:'array'});
  assert.ok(checkContract(target).errors.some(e=>e.includes('Array schema needs items')));
}));

test('fully qualified Spring annotations cannot hide an undocumented route',()=>fixture(target=>{
  fs.writeFileSync(path.join(target,'apps/server/src/main/java/QualifiedController.java'),
    '@org.springframework.web.bind.annotation.RestController class QualifiedController { @org.springframework.web.bind.annotation.GetMapping("/api/v1/qualified") Object read(){return null;} }');
  assert.ok(checkContract(target).errors.some(e=>e.includes('UNDOCUMENTED_ROUTE server GET /api/v1/qualified')));
}));

test('documented refusal/nullable/public semantics match actual boundaries',()=>{
  const doc=json(path.join(root,'apps/server/src/main/resources/dev-access/openapi.json'));
  const schema=doc.components.schemas;
  for(const [name,field] of [['Role','managementScope'],['AssignmentPreview','before'],['AssignmentPreview','beforeRole'],
    ['Resolution','scope'],['Resolution','retryProfile'],['History','correlationId']])
    assert.equal(schema[name].properties[field].nullable,true,name+'.'+field);
  const refusals=doc.paths['/api/v1/administration/assignments'].post.responses;
  assert.match(refusals['401'].description,/empty/i);assert.match(refusals['403'].description,/empty/i);
  for(const route of ['/health','/health/database','/api/v1/identity/csrf'])
    assert.doesNotMatch(doc.paths[route].get['x-idea-contract'].concurrency,/password proof|eligibility\/security-version/);
});
