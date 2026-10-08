import assert from "node:assert/strict";
import {createHash,randomUUID} from "node:crypto";
import {readFile} from "node:fs/promises";
import {spawnSync} from "node:child_process";
import {createRequire} from "node:module";

const [source,manifest,label]=process.argv.slice(2);
assert.match(source??"",/^[0-9a-f]{40}$/);assert.match(manifest??"",/^[0-9a-f]{64}$/);assert.match(label??"",/^project-qualification-[0-9]{2}$/);
const root=`/home/phuclam/idea-iam-ui-20261007-46/run-${label}`,url="https://localhost:18446/";
const sha=bytes=>createHash("sha256").update(bytes).digest("hex");
const sshOptions=["-i","C:/Users/TD-999/.ssh/idea_ddm_dev_ed25519","-o","BatchMode=yes","-o","StrictHostKeyChecking=yes","-o","ConnectTimeout=8"];
let stage="preflight",browser,fixture;const secrets=[],passed=[];let leak=false,callerActor=false;
function pass(name){passed.push(name);console.log(`${name}=PASS`);}
async function login(page,name,password){
  await page.goto(url);await page.getByRole("form",{name:"Đăng nhập",exact:true}).waitFor();
  await page.locator('[name="username"]').fill(name);await page.locator('[name="password"]').fill(password);
  const response=page.waitForResponse(r=>new URL(r.url()).pathname==="/api/v1/identity/login"&&r.request().method()==="POST");
  await page.getByRole("button",{name:"Đăng nhập",exact:true}).click();assert.equal((await response).status(),200);
  await page.getByTestId("session-actor").waitFor();assert.equal(await page.locator('[name="password"]').count(),0);
}
async function projects(page){await page.getByRole("button",{name:"Cổng Quản Trị",exact:true}).click();await page.getByRole("heading",{name:"Dự Án & Nhóm",exact:true}).waitFor();}
async function open(page,name){await page.getByRole("button",{name:`Mở Project ${name}`,exact:true}).click();await page.getByRole("heading",{name,exact:true}).waitFor();}
async function submit(page,name,fields,status){
  const form=page.getByRole("form",{name,exact:true});
  for(const [key,value] of Object.entries(fields)){
    const control=form.locator(`[name="${key}"]`);if(key==="actorId")await control.selectOption(value);else await control.fill(value);
  }
  await form.locator('[name="reason"]').fill("Synthetic Project browser qualification");
  const response=page.waitForResponse(r=>r.request().method()==="POST"&&new URL(r.url()).pathname.startsWith("/api/v1/administration/"));
  await form.locator('button[type="submit"]').click();const result=await response;assert.equal(result.status(),status);return result;
}
async function settled(page){await page.getByTestId("project-status").filter({hasText:"Server đã xác nhận thao tác"}).waitFor();}
async function group(page){await page.getByRole("button",{name:"Mở Group Synthetic browser Group",exact:true}).click();await page.getByRole("region",{name:"Group đã chọn",exact:true}).waitFor();}
async function end(page,isGroup){
  const area=isGroup?page.getByRole("region",{name:"Group đã chọn",exact:true}):page.getByRole("complementary",{name:"Chi tiết Project và Group",exact:true}).locator(':scope > .admin-inspector-body');
  await area.getByRole("button",{name:`Kết thúc ${fixture.memberName}`,exact:true}).first().click();
  const form=page.getByRole("form",{name:"Xác nhận kết thúc Membership",exact:true});await form.locator('input[type="checkbox"]').check();
  await submit(page,"Xác nhận kết thúc Membership",{},200);await settled(page);
}
async function privacy(page){
  const content=await page.evaluate(()=>({text:document.body.innerText,url:location.href,local:JSON.stringify(localStorage),session:JSON.stringify(sessionStorage),cookie:document.cookie}));
  for(const secret of secrets)for(const value of Object.values(content))assert.equal(value.includes(secret),false);
  assert.equal(content.cookie.includes("IDEA_SESSION="),false);
}
try{
  assert.equal(process.version,"v24.19.0");assert.equal(sha(await readFile(process.execPath)),"3602f2bb1a10f2cbab4c36886218a33c1ab3db87290e73b033c46c77147d0237");
  assert.equal(sha(await readFile("C:/Program Files/Google/Chrome/Application/chrome.exe")),"d3784ffbf1f6109348416064b3e4cd739b06fa61d89a81b262c780df9f32270c");
  const base="C:/Users/TD-999/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/";
  for(const name of ["playwright","playwright-core"])assert.equal(JSON.parse(await readFile(base+name+"/package.json","utf8")).version,"1.62.1");
  const read=spawnSync("C:/Windows/System32/OpenSSH/ssh.exe",[...sshOptions,"phuclam@192.168.137.33",`test "$(stat -c '%U:%a' ${root}/fixture.private.json)" = phuclam:600 && cat ${root}/fixture.private.json`],{encoding:"utf8",windowsHide:true,timeout:10000});
  assert.equal(read.status,0);fixture=JSON.parse(read.stdout);read.stdout="";assert.equal(fixture.source,source);secrets.push(fixture.adminPassword,fixture.scopedPassword,fixture.memberPassword);
  const {chromium}=createRequire(import.meta.url)(base+"playwright");browser=await chromium.launch({channel:"chrome",headless:false});assert.equal(browser.version(),"155.0.8059.39");
  const contexts=await Promise.all([browser.newContext(),browser.newContext(),browser.newContext()]);
  for(const context of contexts){context.on("page",page=>page.on("console",message=>{if(secrets.some(secret=>message.text().includes(secret)))leak=true;}));context.on("request",request=>{
    const headers=request.headers();if(Object.entries(headers).some(([key,value])=>/^(actorid|x-actor-id)$/i.test(key)||value===fixture.adminActorId))callerActor=true;
    if(secrets.some(secret=>request.url().includes(secret)))leak=true;
  });}
  const page=await contexts[0].newPage(),scoped=await contexts[1].newPage(),ordinary=await contexts[2].newPage();
  stage="actual-context-project-create";await login(page,fixture.adminLogin,fixture.adminPassword);await projects(page);
  const cookie=(await contexts[0].cookies(url)).find(value=>value.name==="IDEA_SESSION");assert.ok(cookie&&cookie.secure&&cookie.httpOnly&&cookie.sameSite==="Strict"&&cookie.domain==="localhost");
  await page.getByRole("button",{name:"Tạo Project",exact:true}).click();await submit(page,"Tạo Project",{name:"Synthetic browser Project"},201);await settled(page);
  assert.equal(await page.getByTestId("project-version").innerText(),"1");pass("P01_ACTUAL_CONTEXT_ORG_CREATE_NO_IMPLICIT_PARTICIPATION");
  stage="project-group-explicit-participation";
  await submit(page,"Tạo Group",{name:"Synthetic browser Group"},201);await settled(page);await group(page);
  assert.equal(await page.getByRole("form",{name:"Gán Group Membership",exact:true}).locator('select option:not([disabled])').count(),0);
  await submit(page,"Gán Project Membership",{actorId:fixture.memberActorId},201);await settled(page);await group(page);
  await submit(page,"Gán Group Membership",{actorId:fixture.memberActorId},201);await settled(page);pass("P02_PROJECT_MEMBERSHIP_GROUP_TARGET_PREREQUISITE");
  stage="history-end-rejoin";
  // Target the Project history list, not the selected Group's separate history list.
  await page.getByRole("complementary",{name:"Chi tiết Project và Group",exact:true}).getByRole("button",{name:`Kết thúc ${fixture.memberName}`,exact:true}).first().click();
  await page.getByRole("form",{name:"Xác nhận kết thúc Membership",exact:true}).locator('input[type="checkbox"]').check();await submit(page,"Xác nhận kết thúc Membership",{},200);await settled(page);await group(page);
  const region=page.getByRole("region",{name:"Group đã chọn",exact:true});assert.ok((await region.innerText()).includes("INELIGIBLE"));
  await submit(page,"Gán Project Membership",{actorId:fixture.memberActorId},201);await settled(page);await group(page);assert.ok((await region.innerText()).includes("ELIGIBLE"));
  await end(page,true);assert.ok((await region.innerText()).includes("ENDED"));pass("P03_ENDED_HISTORY_REJOIN_NEW_ASSOCIATION_GROUP_ELIGIBILITY");
  stage="scoped-allowed-list";await login(scoped,fixture.scopedLogin,fixture.scopedPassword);await projects(scoped);
  await scoped.getByRole("button",{name:"Mở Project Synthetic scoped Project",exact:true}).waitFor();
  assert.equal(await scoped.getByRole("button",{name:"Tạo Project",exact:true}).count(),0);assert.equal(await scoped.getByRole("table",{name:"Danh sách Project"}).locator("tbody tr").count(),1);
  assert.equal(await scoped.getByRole("button",{name:"Mở Project Synthetic hidden Project",exact:true}).count(),0);
  stage="ordinary-no-admin-action";await login(ordinary,fixture.memberLogin,fixture.memberPassword);assert.equal(await ordinary.getByRole("button",{name:"Cổng Quản Trị",exact:true}).count(),0);
  stage="ordinary-direct-route-refusal";
  await ordinary.goto(url+"#projects");await ordinary.getByTestId("project-status").filter({hasText:"Server từ chối"}).waitFor();assert.equal(await ordinary.getByRole("button",{name:"Tạo Project",exact:true}).count(),0);pass("P04_PROJECT_ONLY_NO_CREATE_ORDINARY_NON_DISCLOSURE");
  stage="stale-exact-version";const second=await contexts[0].newPage();await second.goto(url+"#projects");await open(second,"Synthetic browser Project");
  await submit(second,"Đổi tên Project",{name:"Synthetic browser Project"},200);await settled(second);
  await submit(page,"Đổi tên Project",{name:"Must not overwrite"},409);await page.getByTestId("project-status").filter({hasText:"Dữ liệu đã thay đổi"}).waitFor();
  await page.getByRole("button",{name:"Tải lại Project",exact:true}).click();await open(page,"Synthetic browser Project");await second.close();pass("P05_STALE_VERSION_NO_FALSE_SUCCESS");
  stage="committed-response-loss";const loss=await contexts[0].newCDPSession(page);let lostStatus,attempts=0;
  await loss.send("Fetch.enable",{patterns:[{urlPattern:"*/api/v1/administration/projects",requestStage:"Response"}]});
  loss.on("Fetch.requestPaused",async event=>{if(event.request.method!=="POST")return loss.send("Fetch.continueResponse",{requestId:event.requestId});lostStatus=event.responseStatusCode;attempts++;await loss.send("Fetch.failRequest",{requestId:event.requestId,errorReason:"Failed"});});
  await page.getByRole("button",{name:"Tạo Project",exact:true}).click();await page.getByRole("form",{name:"Tạo Project",exact:true}).locator('[name="name"]').fill("Synthetic lost Project");
  await page.getByRole("form",{name:"Tạo Project",exact:true}).locator('[name="reason"]').fill("Synthetic lost response");await page.getByRole("form",{name:"Tạo Project",exact:true}).locator('button[type="submit"]').click();
  await page.getByTestId("project-status").filter({hasText:"Chưa xác định được kết quả"}).waitFor();assert.equal(lostStatus,201);assert.equal(attempts,1);
  assert.equal(await page.getByRole("form",{name:"Tạo Project",exact:true}).locator("fieldset").evaluate(fieldset=>fieldset.disabled),true);
  assert.equal(await page.getByRole("form",{name:"Tạo Project",exact:true}).locator('[name="name"]').isDisabled(),true);
  await loss.send("Fetch.disable");await loss.detach();const resolved=page.waitForResponse(r=>r.request().method()==="POST"&&new URL(r.url()).pathname==="/api/v1/administration/projects");
  await page.getByRole("button",{name:"Resolve lại cùng OperationId",exact:true}).click();assert.equal((await resolved).status(),201);await settled(page);pass("P06_LOST_RESPONSE_SAME_OPERATION_RESOLUTION_ONCE");
  stage="confirmed-write-unavailable-refresh";
  await page.route("**/api/v1/administration/projects?*",route=>route.fulfill({status:503,body:""}));
  await submit(page,"Đổi tên Project",{name:"Synthetic lost Project"},200);
  await page.getByTestId("project-status").filter({hasText:"Không lấy được dữ liệu"}).waitFor();assert.equal((await page.getByTestId("project-status").innerText()).includes("Server đã xác nhận"),false);
  await page.unroute("**/api/v1/administration/projects?*");await page.getByRole("button",{name:"Tải lại Project",exact:true}).click();pass("P07_UNAVAILABLE_REFRESH_NOT_REPLACED_BY_SUCCESS");
  stage="keyboard-cookie-privacy-logout";await page.setViewportSize({width:780,height:900});await page.keyboard.press("Tab");assert.equal(await page.evaluate(()=>document.activeElement!==document.body),true);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  for(const tab of [page,scoped,ordinary])await privacy(tab);assert.equal(leak||callerActor,false);
  await page.getByRole("button",{name:"Đăng xuất",exact:true}).click();await page.getByRole("form",{name:"Đăng nhập",exact:true}).waitFor();await page.reload();await page.getByRole("form",{name:"Đăng nhập",exact:true}).waitFor();pass("P08_KEYBOARD_RESPONSIVE_PRIVATE_SESSION_LOGOUT");
  for(const context of contexts)await context.close();console.log(`PROJECT_GROUP_BROWSER=PASS;SOURCE=${source};CASES=${passed.length};HTTPS=NORMAL_TRUST;CHROME=155.0.8059.39;RETAINED_SECRETS=0`);
}catch{console.error(`PROJECT_GROUP_BROWSER=FAIL;STAGE=${stage};NO_PRIVATE_DIAGNOSTICS_RETAINED=true`);process.exitCode=1;}
finally{if(browser)await browser.close();secrets.length=0;fixture=undefined;}
