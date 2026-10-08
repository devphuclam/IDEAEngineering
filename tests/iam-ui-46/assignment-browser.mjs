import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {readFile} from "node:fs/promises";
import {spawnSync} from "node:child_process";
import {createRequire} from "node:module";

const [source,manifest,label]=process.argv.slice(2);
assert.match(source??"",/^[0-9a-f]{40}$/);assert.match(manifest??"",/^[0-9a-f]{64}$/);assert.match(label??"",/^assignment-qualification-[0-9]{2}$/);
const root=`/home/phuclam/idea-iam-ui-20261007-46/run-${label}`,url="https://localhost:18446/",prefix="/api/v1/administration/assignments";
const sha=bytes=>createHash("sha256").update(bytes).digest("hex");
const sshOptions=["-i","C:/Users/TD-999/.ssh/idea_ddm_dev_ed25519","-o","BatchMode=yes","-o","StrictHostKeyChecking=yes","-o","ConnectTimeout=8"];
let stage="preflight",browser,fixture,leak=false,callerActor=false;const secrets=[],passed=[];
function pass(name){passed.push(name);console.log(`${name}=PASS`);}
async function login(page,name,password){
  await page.goto(url);await page.getByRole("form",{name:"Đăng nhập",exact:true}).waitFor();
  await page.locator('[name="username"]').fill(name);await page.locator('[name="password"]').fill(password);
  const response=page.waitForResponse(r=>new URL(r.url()).pathname==="/api/v1/identity/login"&&r.request().method()==="POST");
  await page.getByRole("button",{name:"Đăng nhập",exact:true}).click();assert.equal((await response).status(),200);await page.getByTestId("session-actor").waitFor();
}
const dialog=page=>page.getByRole("dialog");
async function next(page){await dialog(page).getByRole("button",{name:"Tiếp tục →",exact:true}).click();}
async function wizard(page,{scope="ORGANIZATION",group=false,filterGroup=false,role}){
  await page.getByRole("button",{name:"Thêm phân quyền vai trò",exact:true}).click();
  await dialog(page).getByLabel("Phạm vi assignment",{exact:true}).selectOption(scope);await next(page);
  if(group){await dialog(page).getByLabel("Loại principal",{exact:true}).selectOption("PROJECT_GROUP");await dialog(page).getByLabel("Chọn Group principal",{exact:true}).selectOption(fixture.groupId);}
  else{
    if(filterGroup)await dialog(page).getByLabel("Lọc người trong Group (không cấp cho Group)",{exact:true}).selectOption(fixture.groupId);
    await dialog(page).getByLabel("Actor đích",{exact:true}).selectOption(fixture.memberActorId);
  }
  await next(page);await dialog(page).getByLabel("Exact Role code + version",{exact:true}).selectOption(role);
  const preview=page.waitForResponse(r=>r.request().method()==="POST"&&new URL(r.url()).pathname===prefix+"/preview");await next(page);
  assert.equal((await preview).status(),200);await dialog(page).getByRole("form",{name:"Xác nhận phân quyền",exact:true}).waitFor();
  assert.ok((await dialog(page).innerText()).includes("commit sẽ kiểm lại"));
}
async function confirm(page,path,status=201){
  const form=dialog(page).getByRole("form",{name:"Xác nhận phân quyền",exact:true});await form.locator('[name="reason"]').fill("Synthetic assignment browser qualification");await form.locator('input[type="checkbox"]').check();
  const response=page.waitForResponse(r=>r.request().method()==="POST"&&new URL(r.url()).pathname===path);await form.locator('button[type="submit"]').click();const r=await response;assert.equal(r.status(),status);return r.json();
}
async function settled(page){await page.getByTestId("assignment-status").filter({hasText:"Server đã xác nhận assignment"}).waitFor();}
async function open(page,id){await page.getByRole("button",{name:`Mở assignment ${id}`,exact:true}).click();await page.getByRole("complementary",{name:"Chi tiết assignment",exact:true}).getByText(id,{exact:true}).waitFor();}
async function end(page,id,status=200){
  const form=page.getByRole("form",{name:"Kết thúc assignment",exact:true});await form.locator('[name="reason"]').fill("Synthetic independent assignment termination");await form.locator('input[type="checkbox"]').check();
  const response=page.waitForResponse(r=>r.request().method()==="POST"&&new URL(r.url()).pathname===`${prefix}/${id}/end`);await form.locator('button[type="submit"]').click();const r=await response;assert.equal(r.status(),status);
}
async function privacy(page){const content=await page.evaluate(()=>({text:document.body.innerText,url:location.href,local:JSON.stringify(localStorage),session:JSON.stringify(sessionStorage),cookie:document.cookie}));for(const secret of secrets)for(const value of Object.values(content))assert.equal(value.includes(secret),false);assert.equal(content.cookie.includes("IDEA_SESSION="),false);}
try{
  assert.equal(process.version,"v24.19.0");assert.equal(sha(await readFile(process.execPath)),"3602f2bb1a10f2cbab4c36886218a33c1ab3db87290e73b033c46c77147d0237");
  assert.equal(sha(await readFile("C:/Program Files/Google/Chrome/Application/chrome.exe")),"d3784ffbf1f6109348416064b3e4cd739b06fa61d89a81b262c780df9f32270c");
  const base="C:/Users/TD-999/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/";
  for(const name of ["playwright","playwright-core"])assert.equal(JSON.parse(await readFile(base+name+"/package.json","utf8")).version,"1.62.1");
  const read=spawnSync("C:/Windows/System32/OpenSSH/ssh.exe",[...sshOptions,"phuclam@192.168.137.33",`test "$(stat -c '%U:%a' ${root}/fixture.private.json)" = phuclam:600 && cat ${root}/fixture.private.json`],{encoding:"utf8",windowsHide:true,timeout:10000});
  assert.equal(read.status,0);fixture=JSON.parse(read.stdout);read.stdout="";assert.equal(fixture.source,source);secrets.push(fixture.adminPassword,fixture.memberPassword,fixture.ordinaryPassword);
  const {chromium}=createRequire(import.meta.url)(base+"playwright");browser=await chromium.launch({channel:"chrome",headless:false});assert.equal(browser.version(),"155.0.8059.39");
  const contexts=await Promise.all([browser.newContext(),browser.newContext()]);
  for(const context of contexts){context.on("page",page=>page.on("console",message=>{if(secrets.some(secret=>message.text().includes(secret)))leak=true;}));context.on("request",request=>{
    if(Object.entries(request.headers()).some(([key,value])=>/^(actorid|x-actor-id)$/i.test(key)||value===fixture.adminActorId))callerActor=true;
    if(secrets.some(secret=>request.url().includes(secret)))leak=true;
  });}
  const page=await contexts[0].newPage(),ordinary=await contexts[1].newPage();
  stage="actual-context-role-catalogue";await login(page,fixture.adminLogin,fixture.adminPassword);await page.goto(url+"#rbac");await page.getByRole("heading",{name:"Phân Quyền Vai Trò RBAC",exact:true}).waitFor();
  await page.getByRole("button",{name:"Danh mục vai trò",exact:true}).click();await page.getByRole("table",{name:"Danh mục vai trò",exact:true}).waitFor();
  const cookie=(await contexts[0].cookies(url)).find(value=>value.name==="IDEA_SESSION");assert.ok(cookie&&cookie.secure&&cookie.httpOnly&&cookie.sameSite==="Strict"&&cookie.domain==="localhost");
  await page.getByRole("button",{name:"Bảng gán vai trò",exact:true}).click();pass("R01_AUTHORED_RBAC_REAL_CATALOGUE_SESSION");
  const aa1="9d80f77e-85a6-4c12-a72d-8ef6b7e0a002",aa2="9d80f77e-85a6-4c12-a72d-8ef6b7e0a003",aa3="9d80f77e-85a6-4c12-a72d-8ef6b7e0a004",pa="9d80f77e-85a6-4c12-a72d-8ef6b7e0a007";
  stage="organization-actor-exact-independent-role";await wizard(page,{role:aa1});const first=await confirm(page,prefix);await settled(page);assert.equal(first.principal.actorId,fixture.memberActorId);assert.equal(first.roleVersionId,aa1);
  await wizard(page,{role:pa});const independent=await confirm(page,prefix);await settled(page);assert.notEqual(first.assignmentId,independent.assignmentId);await open(page,first.assignmentId);pass("R02_SCOPE_ACTOR_EXACT_ROLE_MULTIPLE_INDEPENDENT_ASSIGNMENTS");
  stage="atomic-replace-ended-history";await page.getByRole("button",{name:"Thay thế assignment",exact:true}).click();await dialog(page).getByLabel("Exact Role code + version",{exact:true}).selectOption(aa2);await next(page);
  const replacement=await confirm(page,`${prefix}/${first.assignmentId}/replace`,200);await settled(page);assert.equal(replacement.predecessor.assignmentId,first.assignmentId);assert.ok(replacement.predecessor.revokedAt);assert.notEqual(replacement.successor.assignmentId,first.assignmentId);assert.equal(replacement.successor.roleVersionId,aa2);
  const stale=await contexts[0].newPage();await stale.goto(url+"#rbac");await open(stale,independent.assignmentId);
  await open(page,independent.assignmentId);await end(page,independent.assignmentId);await settled(page);await open(page,replacement.successor.assignmentId);pass("R03_REPLACE_NEW_ID_END_PRESERVES_OTHER_ROLE_HISTORY");
  stage="stale-version-refusal";await end(stale,independent.assignmentId,409);await stale.getByTestId("assignment-status").filter({hasText:"Dữ liệu đã thay đổi"}).waitFor();await stale.close();pass("R04_STALE_VERSION_NO_FALSE_SUCCESS");
  stage="project-filtered-actor-versus-group-principal";await wizard(page,{scope:fixture.projectId,filterGroup:true,role:fixture.businessRoleId});const actorGrant=await confirm(page,prefix);await settled(page);assert.equal(actorGrant.principal.kind,"ACTOR");assert.equal(actorGrant.principal.actorId,fixture.memberActorId);assert.equal(actorGrant.scope.projectId,fixture.projectId);
  await wizard(page,{scope:fixture.projectId,group:true,role:fixture.businessRoleId});const groupGrant=await confirm(page,prefix);await settled(page);assert.equal(groupGrant.principal.kind,"PROJECT_GROUP");assert.equal(groupGrant.principal.groupId,fixture.groupId);pass("R05_PROJECT_GROUP_FILTER_NOT_GROUP_PRINCIPAL");
  stage="design-nonselectable-and-ordinary-refusal";await page.getByRole("button",{name:"Thêm phân quyền vai trò",exact:true}).click();await dialog(page).getByLabel("Phạm vi assignment",{exact:true}).selectOption("ORGANIZATION");await next(page);await dialog(page).getByLabel("Actor đích",{exact:true}).selectOption(fixture.memberActorId);await next(page);
  const roleSelect=dialog(page).getByLabel("Exact Role code + version",{exact:true});assert.equal(await roleSelect.locator('option[value="9d80f77e-85a6-4c12-a72d-8ef6b7e0a006"]').isDisabled(),true);assert.equal(await roleSelect.locator('option[value="9d80f77e-85a6-4c12-a72d-8ef6b7e0a008"]').isDisabled(),true);
  await page.keyboard.press("Escape");await dialog(page).waitFor({state:"detached"});await login(ordinary,fixture.ordinaryLogin,fixture.ordinaryPassword);await ordinary.goto(url+"#rbac");await ordinary.getByTestId("assignment-status").filter({hasText:"Server từ chối"}).waitFor();assert.equal(await ordinary.getByRole("button",{name:"Thêm phân quyền vai trò",exact:true}).count(),0);pass("R06_UNQUALIFIED_ROLE_DISABLED_ORDINARY_FAIL_CLOSED");
  stage="committed-response-loss-exact-resolution";await wizard(page,{role:aa3});const form=dialog(page).getByRole("form",{name:"Xác nhận phân quyền",exact:true});await form.locator('[name="reason"]').fill("Synthetic lost assignment response");await form.locator('input[type="checkbox"]').check();
  const loss=await contexts[0].newCDPSession(page);let lostStatus,attempts=0;
  await loss.send("Fetch.enable",{patterns:[{urlPattern:"*/api/v1/administration/assignments",requestStage:"Response"}]});
  loss.on("Fetch.requestPaused",async event=>{if(event.request.method!=="POST")return loss.send("Fetch.continueResponse",{requestId:event.requestId});lostStatus=event.responseStatusCode;attempts++;await loss.send("Fetch.failRequest",{requestId:event.requestId,errorReason:"Failed"});});
  await form.locator('button[type="submit"]').click();await dialog(page).getByRole("alert").waitFor();assert.equal(lostStatus,201);assert.equal(attempts,1);assert.equal(await form.locator("fieldset").evaluate(v=>v.disabled),true);
  await loss.send("Fetch.disable");await loss.detach();const resolved=page.waitForResponse(r=>r.request().method()==="POST"&&new URL(r.url()).pathname===prefix);
  await dialog(page).getByRole("button",{name:"Resolve lại cùng OperationId",exact:true}).click();assert.equal((await resolved).status(),201);await settled(page);pass("R07_LOST_RESPONSE_SAME_INTENT_RESOLVES_NO_DUPLICATE");
  stage="read-unavailable-no-fabricated-success";await page.route("**/api/v1/administration/assignments?*",route=>route.fulfill({status:503,body:""}));await page.getByRole("button",{name:"Tải lại assignment",exact:true}).click();await page.getByTestId("assignment-status").filter({hasText:"Không lấy được dữ liệu"}).waitFor();assert.equal(await page.getByRole("table",{name:"Bảng phân quyền vai trò",exact:true}).count(),0);await page.unroute("**/api/v1/administration/assignments?*");await page.getByRole("button",{name:"Tải lại assignment",exact:true}).click();await page.getByRole("table",{name:"Bảng phân quyền vai trò",exact:true}).waitFor();pass("R08_UNAVAILABLE_READ_NOT_EMPTY_SUCCESS");
  stage="keyboard-responsive-private-session";await page.setViewportSize({width:780,height:900});await page.getByRole("button",{name:"Thêm phân quyền vai trò",exact:true}).click();assert.equal(await dialog(page).getByRole("heading",{name:"Thêm phân quyền vai trò",exact:true}).evaluate(v=>document.activeElement===v),true);
  await page.keyboard.press("Tab");assert.equal(await dialog(page).evaluate(v=>v.contains(document.activeElement)),true);await page.keyboard.press("Shift+Tab");assert.equal(await dialog(page).evaluate(v=>v.contains(document.activeElement)),true);await page.keyboard.press("Escape");await dialog(page).waitFor({state:"detached"});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);for(const tab of [page,ordinary])await privacy(tab);assert.equal(leak||callerActor,false);
  await page.getByRole("button",{name:"Đăng xuất",exact:true}).click();await page.getByRole("form",{name:"Đăng nhập",exact:true}).waitFor();await page.reload();await page.getByRole("form",{name:"Đăng nhập",exact:true}).waitFor();pass("R09_KEYBOARD_RESPONSIVE_PRIVACY_LOGOUT");
  for(const context of contexts)await context.close();console.log(`ASSIGNMENT_BROWSER=PASS;SOURCE=${source};CASES=${passed.length};HTTPS=NORMAL_TRUST;CHROME=155.0.8059.39;RETAINED_SECRETS=0`);
}catch{console.error(`ASSIGNMENT_BROWSER=FAIL;STAGE=${stage};NO_PRIVATE_DIAGNOSTICS_RETAINED=true`);process.exitCode=1;}
finally{if(browser)await browser.close();secrets.length=0;fixture=undefined;}
