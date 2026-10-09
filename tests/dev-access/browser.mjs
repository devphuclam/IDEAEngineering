import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, unlinkSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadConfig } from '../../tools/dev-access/topology.mjs';

const config=loadConfig(), origin=config.publicOrigin;
const launcher=fileURLToPath(new URL('../../tools/dev-access/launch.ps1', import.meta.url));
const web=resolve(process.argv[2]);
const fixtureRoot='/home/phuclam/idea-iam-ui-20261007-46/run-assignment-qualification-44';
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const probe=resolve(web, 'src/.idea-dev-51-probe.ts');
const ssh=['-i','C:/Users/TD-999/.ssh/idea_ddm_dev_ed25519','-o','BatchMode=yes','-o','StrictHostKeyChecking=yes','-o','ConnectTimeout=8',`${config.sshUser}@${config.sshHost}`];
let browser, fixture, stage='preflight', leaked=false, ownedProbe=false;
const secrets=new Set();
function remote(command) {
  const result=spawnSync('C:/Windows/System32/OpenSSH/ssh.exe',[...ssh,command],{encoding:'utf8',windowsHide:true,timeout:40000});
  assert.equal(result.status,0,'Remote qualification boundary failed');return result.stdout;
}
function control(action, extra=[]) {
  const result=spawnSync('powershell.exe',['-NoProfile','-File',launcher,'-Action',action,'-NoWait','-NoBrowser','-WebRoot',web,...extra],{encoding:'utf8',windowsHide:true,timeout:60000});
  assert.equal(result.status,0,'Owned control action failed');return result.stdout;
}
function socketState() {
  return remote('ss -H -ltnp "sport = :18444 or sport = :18446 or sport = :5173"').trim().split('\n').filter(Boolean)
    .map(line=>({address:line.trim().split(/\s+/)[3],pids:[...line.matchAll(/pid=(\d+)/g)].map(x=>x[1]).sort()})).sort((a,b)=>a.address.localeCompare(b.address));
}
async function login(page) {
  await page.goto(origin);await page.getByRole('form',{name:'Đăng nhập',exact:true}).waitFor();
  await page.locator('[name=username]').fill(fixture.adminLogin);await page.locator('[name=password]').fill(fixture.adminPassword);
  const response=page.waitForResponse(r=>new URL(r.url()).pathname==='/api/v1/identity/login' && r.request().method()==='POST');
  await page.getByRole('button',{name:'Đăng nhập',exact:true}).click();assert.equal((await response).status(),200);
  await page.getByTestId('session-actor').waitFor();
  assert.equal(await page.evaluate(async()=>(await(await fetch('/api/v1/identity/session')).json()).actorId),fixture.adminActorId);
}
try {
  assert.equal(process.version,'v24.19.0');assert.equal(sha(readFileSync(process.execPath)),'3602f2bb1a10f2cbab4c36886218a33c1ab3db87290e73b033c46c77147d0237');
  assert.equal(sha(readFileSync('C:/Program Files/Google/Chrome/Application/chrome.exe')),'d3784ffbf1f6109348416064b3e4cd739b06fa61d89a81b262c780df9f32270c');
  const modules='C:/Users/TD-999/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/';
  for(const name of ['playwright','playwright-core']) {
    assert.equal(JSON.parse(readFileSync(modules+name+'/package.json')).version,'1.62.1');
    assert.equal(sha(readFileSync(modules+name+'/LICENSE')),'45873d00a0dd243596deb4aa23b2493b3d1f0671921bf2538ea431d7380220eb');
    assert.equal(sha(readFileSync(modules+name+'/NOTICE')),'6d602191187b35b9b01d2cffa01c8469c2c8d9de8a96f1bf868e0f264f51c81d');
  }
  const beforeSockets=socketState();
  const appFiles=['src/App.tsx','src/app/iam.css','src/components/admin/AccountsView.tsx','src/components/admin/ProjectsView.tsx','src/components/admin/RbacView.tsx','src/features/accessAdministration/AssignmentWizard.tsx','src/features/accessInspection/AccessInspectionPage.tsx','src/features/accountAdministration/AccountAdministrationPage.tsx','src/features/projectAdministration/ProjectAdministrationPage.tsx','src/styles/admin.css'];
  const appHashes=appFiles.map(p=>sha(readFileSync(resolve(web,p))));
  assert.ok(control('Dev').includes('FRONTEND=LOCAL_CHECKOUT'));
  const backendIdentity=remote(`cat ${config.remoteRoot}/backend.state`).trim();
  fixture=JSON.parse(remote(`test "$(stat -c '%U:%a' ${fixtureRoot}/fixture.private.json)" = phuclam:600 && cat ${fixtureRoot}/fixture.private.json`));
  assert.equal(fixture.source,'9d3732cb173e8094195b9bdd60b5588ac3cfa42e');
  for(const key of ['adminPassword','memberPassword','ordinaryPassword']) secrets.add(fixture[key]);
  const {chromium}=createRequire(import.meta.url)(modules+'playwright');
  browser=await chromium.launch({channel:'chrome',headless:false});assert.equal(browser.version(),'155.0.8059.39');
  const context=await browser.newContext(),page=await context.newPage();page.setDefaultTimeout(15000);
  page.on('console',m=>{leaked||=[...secrets].some(s=>s && m.text().includes(s));});
  page.on('request',r=>{leaked||=[...secrets].some(s=>s && r.url().includes(s));});
  page.on('response',r=>{if(new URL(r.url()).pathname==='/api/v1/identity/csrf' && r.ok())r.json().then(x=>secrets.add(x.token)).catch(()=>{});});
  stage='actual-source-https';await page.goto(origin);
  assert.ok(await page.evaluate(()=>!!document.querySelector('script[src="/@vite/client"]')));
  assert.equal(await page.evaluate(async()=>(await fetch('/api/v1/identity/session')).status),401);
  console.log('D01_ACTUAL_LOCAL_UI_HTTPS_ANONYMOUS=PASS');
  stage='edge-hmr';assert.equal(existsSync(probe),false);
  const contents=marker=>`export const marker='${marker}';document.documentElement.dataset.ideaDevProbe=marker;if(import.meta.hot)import.meta.hot.accept(m=>{document.documentElement.dataset.ideaDevProbe=m.marker;});\n`;
  writeFileSync(probe,contents('LOCAL_A'),{flag:'wx'});ownedProbe=true;
  let edgeWebsocket=false;
  page.on('websocket',socket=>{if(socket.url().startsWith(`wss://${new URL(origin).host}/__vite_hmr`))edgeWebsocket=true;});
  await page.reload();await page.addScriptTag({type:'module',content:"import('/src/.idea-dev-51-probe.ts');"});
  await page.waitForFunction(()=>document.documentElement.dataset.ideaDevProbe==='LOCAL_A');
  writeFileSync(probe,contents('LOCAL_B'));
  await page.waitForFunction(()=>document.documentElement.dataset.ideaDevProbe==='LOCAL_B');assert.equal(edgeWebsocket,true);
  unlinkSync(probe);ownedProbe=false;
  console.log('D02_LOCAL_SOURCE_HMR_THROUGH_WSS_EDGE=PASS');
  stage='login-csrf';await login(page);
  const cookie=(await context.cookies(origin)).find(c=>c.name==='IDEA_SESSION');
  assert.ok(cookie && cookie.secure && cookie.httpOnly && cookie.sameSite==='Strict' && cookie.domain==='localhost');secrets.add(cookie.value);
  assert.equal(await page.evaluate(async()=>(await fetch('/api/v1/identity/logout',{method:'POST',headers:{'X-CSRF-TOKEN':'synthetic-invalid'}})).status),403);
  assert.equal(await page.evaluate(async()=>(await fetch('/api/v1/identity/session')).status),200);
  console.log('D03_REAL_LOGIN_STABLE_ACTOR_COOKIE_BAD_CSRF=PASS');
  stage='swagger';await page.goto(origin+'/dev-api/');await page.locator('#swagger-ui .opblock').first().waitFor();
  assert.deepEqual(await page.evaluate(async()=>Promise.all(['/dev-api/assets/swagger-ui.css','/dev-api/assets/swagger-ui-bundle.js','/dev-api/assets/unknown.js','/webjars/swagger-ui/5.32.14/swagger-ui.css'].map(async p=>(await fetch(p)).status))),[200,200,404,404]);
  const logout=page.locator('#operations-default-signOut');await logout.locator('.opblock-summary').click();
  await logout.getByRole('button',{name:'Try it out',exact:true}).click();
  const response=page.waitForResponse(r=>new URL(r.url()).pathname==='/api/v1/identity/logout' && r.request().method()==='POST');
  await logout.getByRole('button',{name:'Execute',exact:true}).click();assert.equal((await response).status(),204);
  assert.equal(await page.evaluate(async()=>(await fetch('/api/v1/identity/session')).status),401);
  console.log('D04_SWAGGER_BACKEND_ALLOWLIST_LOGOUT=PASS');
  stage='frontend-independent-stop';await login(page);await page.goto(origin+'/dev-api/');
  const record=JSON.parse(readFileSync('C:/Users/TD-999/.codex/idea-dev-access-51/processes.json','utf8').replace(/^\uFEFF/,''));
  const generation=record.frontend.generation;
  assert.ok(control('FrontendStop').includes('BACKEND_UNCHANGED=true'));
  assert.equal(remote(`cat ${config.remoteRoot}/backend.state`).trim(),backendIdentity);
  // The dev edge is also stopped: check the independent Backend directly here.
  assert.ok(control('Status').includes('BACKEND_ENDPOINT=UP'));
  assert.ok(control('Frontend').includes('FRONTEND=LOCAL_CHECKOUT'));
  assert.equal(await page.evaluate(async()=>(await fetch('/api/v1/identity/session')).status),200);
  assert.ok(control('FrontendStop',['-ExpectedFrontendGeneration',generation]).includes('SKIPPED_SUCCESSOR_GENERATION'));
  assert.ok(control('Status').includes('FRONTEND=UP'));
  await page.goto(origin);await page.getByTestId('session-actor').waitFor();
  assert.equal(remote(`cat ${config.remoteRoot}/backend.state`).trim(),backendIdentity);
  console.log('D05_FRONTEND_STOP_RESTART_SAME_BACKEND_SESSION_STALE_CLEANUP=PASS');
  stage='no-snapshot-fallback';await page.goto(origin+'/dev-api/');
  // Close only the frontend/reverse owned generation, deliberately leaving its edge
  // running to witness HTTP502 instead of a silently adopted bundled UI.
  const kill=spawnSync('powershell.exe',['-NoProfile','-Command',"$r=Get-Content -Raw -LiteralPath 'C:/Users/TD-999/.codex/idea-dev-access-51/processes.json'|ConvertFrom-Json; foreach($k in @('frontend','reverse')){$x=$r.$k;$p=Get-Process -Id $x.pid;$d=Get-CimInstance Win32_Process -Filter ('ProcessId='+$p.Id);if($p.StartTime.ToUniversalTime().ToString('o') -ne $x.started -or $d.ExecutablePath -ne $x.executable -or $d.CommandLine -ne $x.command){throw 'Ownership mismatch'};Stop-Process -Id $p.Id}"],{encoding:'utf8',windowsHide:true,timeout:10000});
  assert.equal(kill.status,0);
  assert.deepEqual(await page.evaluate(async()=>({ui:(await fetch('/')).status,session:(await fetch('/api/v1/identity/session')).status})),{ui:502,session:200});
  console.log('D06_VITE_UNAVAILABLE_502_API_STILL_200=PASS');
  stage='review-mode';assert.ok(control('Start').includes('MODE=review'));await page.goto(origin);
  assert.equal(await page.evaluate(()=>!!document.querySelector('script[src="/@vite/client"]')),false);
  await page.getByTestId('session-actor').waitFor();
  console.log('D07_EXPLICIT_REVIEW_PACKAGE_NOT_LOCAL_SOURCE=PASS');
  stage='privacy-preservation';
  const privateState=await page.evaluate(()=>({markup:document.body.innerHTML,url:location.href,local:Object.values(localStorage),session:Object.values(sessionStorage),cookie:document.cookie}));
  assert.ok(!privateState.cookie.includes('IDEA_SESSION='));assert.ok(![...secrets].some(s=>s && JSON.stringify(privateState).includes(s)) && !leaked);
  assert.deepEqual(appFiles.map(p=>sha(readFileSync(resolve(web,p)))),appHashes);assert.deepEqual(socketState(),beforeSockets);
  console.log('D08_USER_SOURCE_AND_PREDECESSOR_PIDS_UNCHANGED_PRIVATE_STATE=PASS');
  await browser.close();browser=undefined;assert.ok(control('Stop').includes('DATABASE_RETAINED=true'));
  assert.equal(remote('ss -H -ltn "sport = :18448 or sport = :18449 or sport = :18450"').trim(),'');
  assert.deepEqual(socketState(),beforeSockets);
  console.log('D09_OWNED_CLEAN_SHUTDOWN_DATABASE_RETAINED=PASS');
  console.log('DEV_ACCESS_BROWSER=9/9_PASS;NO_MIGRATION_BOOTSTRAP_OR_DEPENDENCY_ACQUISITION=true');
} catch {
  console.error('DEV_ACCESS_BROWSER=STOP;STAGE='+stage+';NO_SECRET_DIAGNOSTICS=true');process.exitCode=1;
} finally {
  if(ownedProbe)unlinkSync(probe);if(browser)await browser.close();fixture=undefined;secrets.clear();
  // Failure cleanup must not affect the independent legacy entry or DB.
  try{control('Stop');}catch{console.error('OWNED_CLEANUP=PENDING;RETRY_AFTER_CONNECTIVITY_RECOVERS');process.exitCode=1;}
}
