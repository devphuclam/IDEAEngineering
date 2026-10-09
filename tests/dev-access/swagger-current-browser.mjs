import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';

const origin='https://localhost:18448';
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const modules='C:/Users/TD-999/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/';
const expected=sha(readFileSync(fileURLToPath(new URL('../../apps/server/src/main/resources/dev-access/openapi.json',import.meta.url))));
let browser,page,context,fixture,stage='PREFLIGHT',leaked=false;
const secrets=new Set();
const check=(value)=>{if(!value)throw Error('Oracle refused');};
async function run(name,action){stage=name;await action();console.log(name+'=PASS');}
async function operation(route,method){
  const block=page.locator(`.opblock[data-path="${route}"]`).filter({has:page.locator('.opblock-summary-method',{hasText:method})});
  await block.locator('.opblock-summary').click();
  await block.getByRole('heading',{name:'Responses',exact:true}).first().waitFor();
  return block;
}
try{
  assert.equal(process.version,'v24.19.0');
  assert.equal(sha(readFileSync(process.execPath)),'3602f2bb1a10f2cbab4c36886218a33c1ab3db87290e73b033c46c77147d0237');
  assert.equal(sha(readFileSync('C:/Program Files/Google/Chrome/Application/chrome.exe')),'d3784ffbf1f6109348416064b3e4cd739b06fa61d89a81b262c780df9f32270c');
  for(const name of ['playwright','playwright-core']){
    assert.equal(JSON.parse(readFileSync(modules+name+'/package.json')).version,'1.62.1');
    assert.equal(sha(readFileSync(modules+name+'/LICENSE')),'45873d00a0dd243596deb4aa23b2493b3d1f0671921bf2538ea431d7380220eb');
    assert.equal(sha(readFileSync(modules+name+'/NOTICE')),'6d602191187b35b9b01d2cffa01c8469c2c8d9de8a96f1bf868e0f264f51c81d');
  }
  const remote=spawnSync('C:/Windows/System32/OpenSSH/ssh.exe',[
    '-i','C:/Users/TD-999/.ssh/idea_ddm_dev_ed25519','-o','BatchMode=yes','-o','StrictHostKeyChecking=yes','-o','ConnectTimeout=8',
    'phuclam@192.168.137.33',
    'test "$(stat -c %U:%a /home/phuclam/idea-iam-ui-20261007-46/run-assignment-qualification-44/fixture.private.json)" = phuclam:600 && cat /home/phuclam/idea-iam-ui-20261007-46/run-assignment-qualification-44/fixture.private.json'
  ],{encoding:'utf8',windowsHide:true,timeout:15000});
  check(remote.status===0);fixture=JSON.parse(remote.stdout);check(fixture.source==='9d3732cb173e8094195b9bdd60b5588ac3cfa42e');
  secrets.add(fixture.adminPassword);
  const {chromium}=createRequire(import.meta.url)(modules+'playwright');
  browser=await chromium.launch({channel:'chrome',headless:false});check(browser.version()==='155.0.8059.39');
  context=await browser.newContext();page=await context.newPage();page.setDefaultTimeout(15000);
  page.on('console',message=>{leaked||=[...secrets].some(value=>value&&message.text().includes(value));});
  page.on('pageerror',error=>{leaked||=[...secrets].some(value=>value&&error.message.includes(value));});
  page.on('request',request=>{leaked||=[...secrets].some(value=>value&&request.url().includes(value));});
  await run('S01_TRUSTED_HTTPS_ANONYMOUS_REFUSAL',async()=>{
    const response=await page.goto(origin+'/health/database');check(response.status()===200);
    check(await page.evaluate(async()=>(await fetch('/dev-api/openapi.json')).status)===401);
  });
  await run('S02_EXISTING_IDENTITY_LOGIN',async()=>{
    await page.goto(origin);await page.getByRole('form',{name:'Đăng nhập',exact:true}).waitFor();
    await page.locator('[name=username]').fill(fixture.adminLogin);await page.locator('[name=password]').fill(fixture.adminPassword);
    const response=page.waitForResponse(r=>new URL(r.url()).pathname==='/api/v1/identity/login'&&r.request().method()==='POST');
    await page.getByRole('button',{name:'Đăng nhập',exact:true}).click();check((await response).status()===200);
    await page.getByTestId('session-actor').waitFor();
    check(await page.evaluate(async()=>(await(await fetch('/api/v1/identity/session')).json()).actorId)===fixture.adminActorId);
    const cookie=(await context.cookies(origin)).find(value=>value.name==='IDEA_SESSION');
    check(cookie&&cookie.secure&&cookie.httpOnly&&cookie.sameSite==='Strict');secrets.add(cookie.value);
  });
  await run('S03_COMPLETE_SHARED_CONTRACT_46_OPERATIONS',async()=>{
    await page.goto(origin+'/dev-api/');await page.locator('#swagger-ui .opblock').first().waitFor();
    await page.waitForFunction(()=>document.querySelectorAll('#swagger-ui .opblock').length===46);
    check(await page.locator('#swagger-ui .opblock').count()===46);
    const source=await page.evaluate(async()=>await(await fetch('/dev-api/openapi.json')).text());
    check(sha(source)===expected);
    check(new Set(JSON.parse(source).tags.map(entry=>entry.name)).size===8);
  });
  await run('S04_ADMIN_DESCRIPTIONS_SCHEMAS_AND_SAFE_GATEWAY',async()=>{
    const account=await operation('/api/v1/administration/accounts','GET');
    check((await account.innerText()).includes('Thẩm quyền'));check((await account.innerText()).includes('Retry'));
    check(await account.getByRole('button',{name:'Try it out',exact:true}).count()===0);
    for(const route of ['/transfer/range','/transfer/status']){
      const block=await operation(route,'POST');check((await block.innerText()).includes('Client → Gateway'));
      check(await block.getByRole('button',{name:'Try it out',exact:true}).count()===0);
    }
    const proof=await operation('/api/v1/identity/accounts/{account}/credential-proofs','POST');
    check(await proof.getByRole('button',{name:'Try it out',exact:true}).count()===0);
  });
  await run('S05_ALLOWLIST_AND_SESSION_TRYOUT',async()=>{
    check(JSON.stringify(await page.evaluate(async()=>Promise.all(['/dev-api/assets/swagger-ui.css','/dev-api/assets/swagger-ui-bundle.js','/dev-api/assets/unknown.js','/webjars/swagger-ui/5.32.14/swagger-ui.css'].map(async p=>(await fetch(p)).status))))==='[200,200,404,404]');
    const block=await operation('/api/v1/identity/session','GET');
    await block.getByRole('button',{name:'Try it out',exact:true}).click();
    const response=page.waitForResponse(r=>new URL(r.url()).pathname==='/api/v1/identity/session');
    await block.getByRole('button',{name:'Execute',exact:true}).click();check((await response).status()===200);
  });
  await run('S06_BAD_CSRF_REFUSAL',async()=>{
    check(await page.evaluate(async()=>(await fetch('/api/v1/identity/logout',{method:'POST',headers:{'X-CSRF-TOKEN':'synthetic-invalid'}})).status)===403);
    check(await page.evaluate(async()=>(await fetch('/api/v1/identity/session')).status)===200);
  });
  await run('S07_SWAGGER_LOGOUT_204_THEN_401',async()=>{
    const block=await operation('/api/v1/identity/logout','POST');
    await block.getByRole('button',{name:'Try it out',exact:true}).click();
    const response=page.waitForResponse(r=>new URL(r.url()).pathname==='/api/v1/identity/logout'&&r.request().method()==='POST');
    await block.getByRole('button',{name:'Execute',exact:true}).click();check((await response).status()===204);
    check(await page.evaluate(async()=>(await fetch('/api/v1/identity/session')).status)===401);
    check(!leaked);
  });
  console.log('SWAGGER_CURRENT_CHROME=PASS;CASES=7;BROWSER=155.0.8059.39;TLS_BYPASS=false;SECRETS_RETAINED=false');
}catch{
  console.error('SWAGGER_CURRENT_CHROME=FAIL;STAGE='+stage+';NO_RAW_ERROR_OR_SECRET_RETAINED=true');process.exitCode=1;
}finally{
  // Revoke only this harness's own eligible session, including after a RED witness.
  if(page&&context){try{await page.evaluate(async()=>{
    if((await fetch('/api/v1/identity/session')).status!==200)return;
    const csrf=await(await fetch('/api/v1/identity/csrf')).json();
    await fetch('/api/v1/identity/logout',{method:'POST',headers:{[csrf.headerName]:csrf.token}});
  });}catch{}}
  await browser?.close();fixture=null;secrets.clear();
}
