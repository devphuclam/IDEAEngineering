import {useEffect,useRef,useState,type FormEvent,type KeyboardEvent} from "react";
import {createIamClient,type AdministrationContext,type AssignmentGrant,type AssignmentPrincipal,type AssignmentProposal,type AssignmentScope,type AssignmentView,type AssignmentPreview,type BoundedPage,type GroupView,type ProjectView,type RoleView,type IamResult,type ParticipationInterval} from "../../api/iamClient";
import {RbacView} from "../../components/admin/RbacView";
import {outcomeMessage} from "../iamIntegration/IamStatus";

const client=createIamClient();
type Target={actorId:string;displayName:string};
type Pending={operationId:string;run():Promise<IamResult<unknown>>};
export function AssignmentWizard({context,onInvalidated}:{context:AdministrationContext;onInvalidated():void}){
  const [scope,setScope]=useState<AssignmentScope>({kind:"ORGANIZATION",organizationId:context.organizationId});
  const [projects,setProjects]=useState<BoundedPage<ProjectView>|null>(null),[groups,setGroups]=useState<BoundedPage<GroupView>|null>(null);
  const [roles,setRoles]=useState<BoundedPage<RoleView>|null>(null),[page,setPage]=useState<BoundedPage<AssignmentView>|null>(null);
  const [targets,setTargets]=useState<BoundedPage<Target>|null>(null),[targetFilter,setTargetFilter]=useState("");
  const [selected,setSelected]=useState<AssignmentView|null>(null),[replacing,setReplacing]=useState<AssignmentView|null>(null);
  const [mode,setMode]=useState<"ACTOR"|"PROJECT_GROUP">("ACTOR"),[groupFilter,setGroupFilter]=useState("");
  const [principal,setPrincipal]=useState<AssignmentPrincipal|null>(null),[roleId,setRoleId]=useState("");
  const [step,setStep]=useState<1|2|3|4|null>(null),[preview,setPreview]=useState<AssignmentPreview|null>(null);
  const [from,setFrom]=useState(""),[until,setUntil]=useState("");
  const [busy,setBusy]=useState(false),[message,setMessage]=useState(""),[operation,setOperation]=useState("");
  const [pending,setPending]=useState<Pending|null>(null);
  const epoch=useRef(0),targetEpoch=useRef(0),alive=useRef(true),modal=useRef<HTMLDivElement>(null),title=useRef<HTMLHeadingElement>(null),status=useRef<HTMLParagraphElement>(null),returnFocus=useRef<HTMLElement|null>(null);
  const locked=busy||pending!==null;const canGrant=context.actions.some(a=>a.startsWith("role.assignment.manage."));
  const interval=():ParticipationInterval=>({effectiveFrom:from?new Date(from).toISOString():null,effectiveUntil:until?new Date(until).toISOString():null});
  function failed(result:IamResult<unknown>){setMessage(outcomeMessage(result));if(result.kind==="refused"&&result.status===401){setPage(null);setRoles(null);setStep(null);onInvalidated();}}
  async function load(s=scope,offset=0){
    const request=++epoch.current;setPage(null);setRoles(null);setSelected(null);setPreview(null);
    const [r,a]=await Promise.all([client.loadRoles(s),client.loadAssignments(s,undefined,offset)]);
    if(!alive.current||request!==epoch.current)return false;
    if(r.kind==="confirmed")setRoles(r.value);else failed(r);
    if(a.kind==="confirmed")setPage(a.value);else failed(a);
    return r.kind==="confirmed"&&a.kind==="confirmed";
  }
  async function targetPage(offset=0,filter=targetFilter,group=groupFilter,principalMode=mode){
    const request=++targetEpoch.current;setTargets(null);setPrincipal(null);setPreview(null);
    if(principalMode==="PROJECT_GROUP")return;
    const result=scope.kind==="ORGANIZATION"?await client.loadAccounts(filter,offset):group?await client.loadGroupMembers(group,filter,offset):await client.loadProjectMembers(scope.projectId,filter,offset);
    if(!alive.current||request!==targetEpoch.current)return;
    if(result.kind!=="confirmed"){failed(result);return;}
    if(scope.kind==="ORGANIZATION"){
      const p=result.value as Awaited<ReturnType<typeof client.loadAccounts>> extends IamResult<infer T>?T:never;
      setTargets({...p,items:p.items.filter(a=>a.status==="ACTIVE").map(a=>({actorId:a.actorId,displayName:a.displayName}))});
    }else{
      const p=result.value as Awaited<ReturnType<typeof client.loadProjectMembers>> extends IamResult<infer T>?T:never;
      setTargets(group?{items:p.items.filter(m=>m.eligible).map(m=>({actorId:m.targetActorId,displayName:m.displayName})),offset:p.offset,limit:p.limit,hasMore:p.hasMore}:p.eligibleTargets);
    }
  }
  useEffect(()=>{alive.current=true;void load();if(context.actions.includes("project.admin.read"))void client.loadProjects().then(r=>{if(alive.current){if(r.kind==="confirmed")setProjects(r.value);else failed(r);}});return()=>{alive.current=false;epoch.current++;targetEpoch.current++;};},[context.actorId,context.organizationId]);
  useEffect(()=>{if(step!==null)requestAnimationFrame(()=>title.current?.focus());},[step]);
  async function changeScope(value:string){
    const s:AssignmentScope=value==="ORGANIZATION"?{kind:"ORGANIZATION",organizationId:context.organizationId}:{kind:"PROJECT",organizationId:context.organizationId,projectId:value};
    targetEpoch.current++;setScope(s);setPrincipal(null);setGroupFilter("");setTargets(null);setRoleId("");setPreview(null);setGroups(null);const loaded=await load(s);if(!loaded)return;const request=epoch.current;
    if(s.kind==="PROJECT"){const g=await client.loadGroups(s.projectId);if(alive.current&&request===epoch.current){if(g.kind==="confirmed")setGroups(g.value);else failed(g);}}
  }
  function open(before:AssignmentView|null=null){
    returnFocus.current=document.activeElement as HTMLElement;setReplacing(before);setPreview(null);setPrincipal(before?.principal??null);setRoleId("");setFrom("");setUntil("");setTargets(null);setMode(before?.principal.kind??"ACTOR");setGroupFilter("");setMessage("");setStep(before?3:1);
  }
  function close(){if(locked)return;setStep(null);setPreview(null);setReplacing(null);requestAnimationFrame(()=>returnFocus.current?.focus());}
  function keydown(event:KeyboardEvent<HTMLDivElement>){
    if(event.key==="Escape"&&!locked){event.preventDefault();close();}
    if(event.key!=="Tab")return;const list=[...event.currentTarget.querySelectorAll<HTMLElement>('button:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex="0"]')].filter(e=>e.offsetParent!==null);const first=list[0],last=list.at(-1);
    if(event.shiftKey&&(document.activeElement===first||document.activeElement===title.current)){event.preventDefault();last?.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}
  }
  function proposal():AssignmentProposal|null{if(!principal||!roleId)return null;return {principal,scope,roleVersionId:roleId,interval:interval(),...(replacing?{assignmentId:replacing.assignmentId,expectedVersion:replacing.version}:{})};}
  async function next(){
    if(locked)return;if(step===1){setStep(2);await targetPage();return;}if(step===2){if(principal)setStep(3);return;}
    if(step===3){const input=proposal();if(!input)return;setBusy(true);setPreview(null);try{const result=await client.previewAssignment(input);if(!alive.current)return;if(result.kind==="confirmed"){setPreview(result.value);setStep(4);}else failed(result);}finally{if(alive.current)setBusy(false);}}
  }
  async function execute(intent:Pending){
    if(busy)return;setBusy(true);setOperation(intent.operationId);setMessage("Server kiểm tra current IAM, delegation và version trước commit…");
    try{const result=await intent.run();if(!alive.current)return;if(result.kind==="confirmed"){
      setPending(null);setStep(null);setPreview(null);setReplacing(null);const refreshed=await load();if(alive.current&&refreshed)setMessage("Server đã xác nhận assignment. Lịch sử và các Role độc lập khác được giữ nguyên.");
    }else{setPending(result.kind==="unresolved"?intent:null);failed(result);if(result.kind==="stale"||result.kind==="refused"){setPreview(null);setStep(null);setSelected(null);}}}
    finally{if(alive.current){setBusy(false);requestAnimationFrame(()=>status.current?.focus());}}
  }
  function confirm(event:FormEvent<HTMLFormElement>){
    event.preventDefault();if(locked||!preview?.allowed)return;const input=proposal();if(!input)return;const reason=String(new FormData(event.currentTarget).get("reason"));const operationId=crypto.randomUUID();
    if(replacing){const id=replacing.assignmentId;const replace={operationId,scope,expectedVersion:replacing.version,newRoleVersionId:input.roleVersionId,interval:input.interval,reason};void execute({operationId,run:()=>client.replaceAssignment(id,replace)});}
    else{const grant:AssignmentGrant={...input,operationId,reason};void execute({operationId,run:()=>client.grantAssignment(grant)});}
  }
  function end(event:FormEvent<HTMLFormElement>){event.preventDefault();if(locked||!selected)return;const a=selected,input={operationId:crypto.randomUUID(),scope:a.scope,expectedVersion:a.version,reason:String(new FormData(event.currentTarget).get("reason"))};void execute({operationId:input.operationId,run:()=>client.endAssignment(a.assignmentId,input)});}
  const scopeControl=<label>Phạm vi assignment<select aria-label="Phạm vi assignment" value={scope.kind==="ORGANIZATION"?"ORGANIZATION":scope.projectId} disabled={locked||replacing!==null} onChange={e=>void changeScope(e.target.value)}><option value="ORGANIZATION">Organization · {context.organizationName}</option>{projects?.items.map(p=><option key={p.projectId} value={p.projectId}>Project · {p.name} — {p.projectId}</option>)}</select></label>;
  return <div className="account-layout assignment-layout">
    <RbacView inactive={step!==null} assignments={page?.items??null} roles={roles?.items??null} busy={locked||step!==null} canGrant={canGrant} selectedId={selected?.assignmentId} onAdd={()=>open()} onSelect={setSelected}
      status={<><p role="status" aria-live="polite" ref={status} tabIndex={-1} data-testid="assignment-status" className="status-message">{message}</p>{operation&&<p className="hint">Operation: <code>{operation}</code></p>}{pending&&<div role="alert"><p>Kết quả chưa rõ. Không tự gửi lại hoặc tạo OperationId mới. Resolve dùng đúng intent đã gửi.</p><button type="button" disabled={busy} onClick={()=>void execute(pending)}>Resolve lại cùng OperationId</button></div>}</>}>
      <div className="admin-toolbar">{step===null&&scopeControl}<button type="button" className="admin-btn" disabled={locked||step!==null} onClick={()=>void load()}>Tải lại assignment</button></div>
      {projects?.hasMore&&<button type="button" disabled={locked||step!==null} onClick={()=>void client.loadProjects("",projects.offset+projects.limit).then(r=>{if(r.kind==="confirmed")setProjects(r.value);else failed(r);})}>Trang Project tiếp theo</button>}
      {page&&<Pager page={page} disabled={locked||step!==null} change={offset=>void load(scope,offset)} />}
      {roles?.hasMore&&<button type="button" disabled={locked} onClick={()=>void client.loadRoles(scope,roles.offset+roles.limit).then(r=>{if(r.kind==="confirmed")setRoles(r.value);else failed(r);})}>Trang role tiếp theo</button>}
    </RbacView>
    <aside inert={step!==null} className="admin-inspector" aria-label="Chi tiết assignment"><div className="admin-inspector-body">{!selected?<p>Chọn assignment để xem exact version, người cấp, reason và history.</p>:<>
      <h2>{selected.roleCode}@{selected.roleVersion}</h2><dl><dt>Assignment ID</dt><dd>{selected.assignmentId}</dd><dt>Role Version ID</dt><dd>{selected.roleVersionId}</dd><dt>Principal</dt><dd>{selected.principal.kind} · {selected.principal.kind==="ACTOR"?selected.principal.actorId:selected.principal.groupId}</dd><dt>Assigned by</dt><dd>{selected.assignedBy}</dd><dt>Reason</dt><dd>{selected.reason}</dd><dt>Interval</dt><dd>{selected.effectiveFrom} → {selected.effectiveUntil??"Không định thời kết thúc"}</dd><dt>Version</dt><dd>{selected.version}</dd><dt>Canonical end</dt><dd>{selected.revokedAt??"Chưa kết thúc"} · {selected.endReason}</dd></dl>
      {canGrant&&!selected.revokedAt&&<><button className="admin-btn" type="button" disabled={locked} onClick={()=>open(selected)}>Thay thế assignment</button><form aria-label="Kết thúc assignment" className="form-card" onSubmit={end}><fieldset disabled={locked}><legend>Kết thúc assignment riêng</legend><p>Không xóa history hoặc Role khác. Server bảo vệ last effective Super recovery và kiểm quyền hiện tại.</p><label>Lý do kết thúc<input name="reason" required maxLength={500} /></label><label className="check-label"><input type="checkbox" required />Tôi xác nhận đúng assignment và hậu quả kết thúc.</label><button type="submit">Xác nhận kết thúc assignment</button></fieldset></form></>}
    </>}</div></aside>
    {step!==null&&<div className="admin-drawer-overlay"><div ref={modal} className="admin-drawer-panel" role="dialog" aria-modal="true" aria-labelledby="assignment-wizard-title" onKeyDown={keydown}>
      <div className="admin-drawer-head"><h2 className="admin-drawer-title" id="assignment-wizard-title" tabIndex={-1} ref={title}>{replacing?"Thay thế assignment":"Thêm phân quyền vai trò"}</h2><button className="admin-btn" type="button" disabled={locked} onClick={close}>Đóng</button></div>
      <div className="admin-drawer-steps">{["Phạm vi","Đối tượng","Role / version","Xác nhận"].map((label,i)=><span className={`admin-step-pill ${step===i+1?"active":""}`} key={label} aria-current={step===i+1?"step":undefined}>{i+1}. {label}</span>)}</div>
      <div className="admin-drawer-body"><p className="hint">Mỗi assignment có ID riêng. Cấp thêm một role không thay thế các role khác; không tự tạo membership.</p>
        {step===1&&<>{scopeControl}<p className="hint">Organization rộng hơn Project nhưng chỉ áp dụng đúng supported profile. Group luôn thuộc một Project, không phải Department/global scope.</p></>}
        {step===2&&<><label>Loại principal<select aria-label="Loại principal" value={mode} disabled={locked} onChange={e=>{const value=e.target.value as typeof mode;setMode(value);setPrincipal(null);setPreview(null);targetEpoch.current++;if(value==="ACTOR")void targetPage(0,targetFilter,groupFilter,value);}}><option value="ACTOR">Actor · cấp riêng cho người được chọn</option><option value="PROJECT_GROUP" disabled={scope.kind!=="PROJECT"}>Project Group · cấp cho principal Group</option></select></label>
          {scope.kind==="PROJECT"&&<label>{mode==="ACTOR"?"Lọc người trong Group (không cấp cho Group)":"Chọn Group principal"}<select aria-label={mode==="ACTOR"?"Lọc người trong Group (không cấp cho Group)":"Chọn Group principal"} value={mode==="ACTOR"?groupFilter:principal?.kind==="PROJECT_GROUP"?principal.groupId:""} onChange={e=>{if(mode==="ACTOR"){setGroupFilter(e.target.value);void targetPage(0,"",e.target.value);}else setPrincipal(e.target.value?{kind:"PROJECT_GROUP",groupId:e.target.value}:null);}}><option value="">{mode==="ACTOR"?"Mọi Actor hợp lệ cùng Organization":"Chọn exact Group"}</option>{groups?.items.map(g=><option key={g.groupId} value={g.groupId}>{g.name} — {g.groupId}</option>)}</select></label>}
          {groups?.hasMore&&scope.kind==="PROJECT"&&<button type="button" onClick={()=>void client.loadGroups(scope.projectId,"",groups.offset+groups.limit).then(r=>{if(r.kind==="confirmed")setGroups(r.value);else failed(r);})}>Trang Group tiếp theo</button>}
          {mode==="ACTOR"&&<><form aria-label="Lọc Actor đích" onSubmit={e=>{e.preventDefault();void targetPage();}}><label>Tìm người<input maxLength={200} value={targetFilter} onChange={e=>setTargetFilter(e.target.value)} /></label><button type="submit">Tìm người</button></form><label>Actor đích<select aria-label="Actor đích" value={principal?.kind==="ACTOR"?principal.actorId:""} onChange={e=>setPrincipal(e.target.value?{kind:"ACTOR",actorId:e.target.value}:null)}><option value="">Chọn exact Actor</option>{targets?.items.map(t=><option key={t.actorId} value={t.actorId}>{t.displayName} — {t.actorId}</option>)}</select></label>{targets&&<Pager page={targets} disabled={locked} change={offset=>void targetPage(offset)} />}</>}
        </>}
        {step===3&&<><label>Exact Role code + version<select aria-label="Exact Role code + version" value={roleId} onChange={e=>{setRoleId(e.target.value);setPreview(null);}}><option value="">Chọn version đã qualify</option>{roles?.items.map(r=><option key={r.roleVersionId} value={r.roleVersionId} disabled={!r.selectable||!r.scopeKinds.includes(scope.kind)||!r.principalKinds.includes(principal?.kind??"ACTOR")}>{r.displayName} · {r.roleCode}@{r.version}{r.selectable?"":" · DESIGN / chưa đủ điều kiện"}</option>)}</select></label><label>Hiệu lực từ (bỏ trống = lần commit đầu)<input type="datetime-local" value={from} onChange={e=>{setFrom(e.target.value);setPreview(null);}} /></label><label>Hiệu lực đến (bỏ trống = unbounded)<input type="datetime-local" value={until} onChange={e=>{setUntil(e.target.value);setPreview(null);}} /></label><p className="hint">Chọn role không đồng nghĩa có quyền cấp. Bước tiếp theo lấy delegation preview từ Server.</p></>}
        {step===4&&preview&&<form id="assignment-confirm" aria-label="Xác nhận phân quyền" onSubmit={confirm}><fieldset disabled={locked}>
          <h3>{preview.role.roleCode}@{preview.role.version}</h3><code>{preview.role.roleVersionId}</code><dl><dt>Scope</dt><dd>{preview.scope.kind} · {preview.scope.kind==="PROJECT"?preview.scope.projectId:preview.scope.organizationId}</dd><dt>Principal</dt><dd>{preview.principal.kind} · {preview.principal.kind==="ACTOR"?preview.principal.actorId:preview.principal.groupId}</dd></dl>
          <p>{preview.allowed?"Delegation preview cho phép · commit sẽ kiểm lại":"Server từ chối delegation; không được xác nhận cấp."}</p><ul>{preview.consequences.map(c=><li key={c}>{c}</li>)}</ul><p className="hint">Không phải membership hay đảm bảo owner-specific engineering gates đều đạt.</p>
          <label>Lý do cấp / thay thế<input name="reason" maxLength={500} required /></label><label className="check-label"><input type="checkbox" required />Tôi đã kiểm tra exact scope, principal, role version và hậu quả.</label><button className="admin-btn primary" type="submit" disabled={!preview.allowed}>Xác nhận phân quyền trên Server</button>
        </fieldset></form>}
        {message&&<p role="status" className="status-message">{message}</p>}{pending&&<div role="alert"><p>Kết quả chưa rõ. Giữ nguyên intent và OperationId; không tạo grant mới.</p><button type="button" disabled={busy} onClick={()=>void execute(pending)}>Resolve lại cùng OperationId</button></div>}
      </div>
      <div className="admin-drawer-footer">{step>1&&<button className="admin-btn" type="button" disabled={locked||(replacing!==null&&step===3)} onClick={()=>{setPreview(null);setStep((step-1) as 1|2|3);}}>← Quay lại</button>}{step<4&&<button className="admin-btn primary" type="button" disabled={locked||(step===2&&!principal)||(step===3&&!roleId)} onClick={()=>void next()}>Tiếp tục →</button>}</div>
    </div></div>}
  </div>;
}
function Pager({page,disabled,change}:{page:BoundedPage<unknown>;disabled:boolean;change(offset:number):void}){return <div className="actions"><button type="button" disabled={disabled||page.offset===0} onClick={()=>change(Math.max(0,page.offset-page.limit))}>Trang trước</button><button type="button" disabled={disabled||!page.hasMore} onClick={()=>change(page.offset+page.limit)}>Trang sau</button></div>;}
