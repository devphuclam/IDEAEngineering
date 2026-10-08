import { useEffect, useRef, useState, type FormEvent } from "react";
import { createIamClient, type AdministrationContext, type BoundedPage, type GroupView, type IamResult, type ParticipationPage, type ParticipationView, type ProjectScope, type ProjectView } from "../../api/iamClient";
import { ProjectsView } from "../../components/admin/ProjectsView";
import { outcomeMessage } from "../iamIntegration/IamStatus";

const client=createIamClient();
type Pending={operationId:string;label:string;run():Promise<IamResult<unknown>>;projectId?:string;groupId?:string};
export function ProjectAdministrationPage({context,onInvalidated}:{context:AdministrationContext;onInvalidated():void}){
  const [page,setPage]=useState<BoundedPage<ProjectView>|null>(null);
  const [project,setProject]=useState<ProjectView|null>(null);
  const [members,setMembers]=useState<ParticipationPage|null>(null);
  const [groups,setGroups]=useState<BoundedPage<GroupView>|null>(null);
  const [group,setGroup]=useState<GroupView|null>(null);
  const [groupMembers,setGroupMembers]=useState<ParticipationPage|null>(null);
  const [filter,setFilter]=useState("");const [targetFilter,setTargetFilter]=useState("");
  const [loading,setLoading]=useState(true);const [busy,setBusy]=useState(false);
  const [message,setMessage]=useState("");const [operation,setOperation]=useState("");
  const [showCreate,setShowCreate]=useState(false);const [pending,setPending]=useState<Pending|null>(null);
  const [ending,setEnding]=useState<{membership:ParticipationView;isGroup:boolean}|null>(null);
  const epoch=useRef(0);const alive=useRef(true);const heading=useRef<HTMLHeadingElement>(null);const messageRef=useRef<HTMLParagraphElement>(null);const createName=useRef<HTMLInputElement>(null);
  const locked=busy||pending!==null;
  const can=(action:string)=>project?.actions.includes(action)===true; // Advisory only; every commit rechecks.
  const scope=(p:ProjectView):ProjectScope=>({kind:"PROJECT",organizationId:p.organizationId,projectId:p.projectId});
  function failed(result:IamResult<unknown>){setMessage(outcomeMessage(result));if(result.kind==="refused"&&result.status===401){setPage(null);setProject(null);setGroup(null);setMembers(null);setGroupMembers(null);onInvalidated();}}
  async function load(offset=0){
    const request=++epoch.current;setLoading(true);setPage(null);setProject(null);setMembers(null);setGroups(null);setGroup(null);setGroupMembers(null);setEnding(null);
    const result=await client.loadProjects(filter,offset);if(!alive.current||request!==epoch.current)return false;
    setLoading(false);if(result.kind==="confirmed"){setPage(result.value);setMessage("Project được phép truy cập, dữ liệu hiện tại từ Server.");return true;}failed(result);return false;
  }
  async function select(id:string,memberOffset=0,groupOffset=0,memberFilter=""){
    const request=++epoch.current;setProject(null);setMembers(null);setGroups(null);setGroup(null);setGroupMembers(null);setEnding(null);
    const [detail,people,teams]=await Promise.all([client.loadProject(id),client.loadProjectMembers(id,memberFilter,memberOffset),client.loadGroups(id,"",groupOffset)]);
    if(!alive.current||request!==epoch.current)return false;
    if(detail.kind!=="confirmed"){failed(detail);return false;}if(people.kind!=="confirmed"){failed(people);return false;}if(teams.kind!=="confirmed"){failed(teams);return false;}
    setProject(detail.value);setMembers(people.value);setGroups(teams.value);setMessage("");requestAnimationFrame(()=>heading.current?.focus());return true;
  }
  async function selectGroup(id:string,offset=0,memberFilter=""){
    const request=++epoch.current;setGroup(null);setGroupMembers(null);setEnding(null);
    const [detail,people]=await Promise.all([client.loadGroup(id),client.loadGroupMembers(id,memberFilter,offset)]);
    if(!alive.current||request!==epoch.current)return false;
    if(detail.kind!=="confirmed"){failed(detail);return false;}if(people.kind!=="confirmed"){failed(people);return false;}
    setGroup(detail.value);setGroupMembers(people.value);setMessage("");return true;
  }
  useEffect(()=>{alive.current=true;void load();return()=>{alive.current=false;epoch.current++;};},[context.actorId,context.organizationId]);
  async function execute(intent:Pending){
    if(busy)return;setBusy(true);setOperation(intent.operationId);setMessage("Server đang kiểm tra quyền và version hiện tại…");
    try{
      const result=await intent.run();if(!alive.current)return;
      if(result.kind==="confirmed"){
        setPending(null);setEnding(null);setShowCreate(false);
        const value=result.value as {projectId?:string};const projectId=intent.projectId??value?.projectId;
        let refreshed=await load(page?.offset??0);
        if(refreshed&&projectId)refreshed=await select(projectId);
        if(refreshed&&intent.groupId)refreshed=await selectGroup(intent.groupId);
        if(alive.current&&refreshed)setMessage("Server đã xác nhận thao tác. Membership/Group history được giữ; không có Role Assignment tự động.");
      }else{
        if(result.kind==="unresolved")setPending(intent);
        else setPending(null);
        failed(result);
        if(result.kind==="stale"){setProject(null);setMembers(null);setGroup(null);setGroupMembers(null);setEnding(null);}
      }
    }finally{if(alive.current){setBusy(false);requestAnimationFrame(()=>messageRef.current?.focus());}}
  }
  function create(event:FormEvent<HTMLFormElement>){
    event.preventDefault();if(locked)return;const data=new FormData(event.currentTarget);const input={operationId:crypto.randomUUID(),organizationId:context.organizationId,name:String(data.get("name")),reason:String(data.get("reason"))};
    void execute({operationId:input.operationId,label:"Tạo Project",run:()=>client.createProject(input)});
  }
  function projectCommand(event:FormEvent<HTMLFormElement>,action:"rename"|"join"|"group"){
    event.preventDefault();if(!project||locked)return;const data=new FormData(event.currentTarget);const p=project;const common={operationId:crypto.randomUUID(),scope:scope(p),reason:String(data.get("reason"))};
    const intent=action==="rename"?{...common,name:String(data.get("name")),expectedVersion:p.version}:action==="group"?{...common,name:String(data.get("name")),expectedProjectVersion:p.version}:{...common,targetActorId:String(data.get("actorId")),expectedProjectVersion:p.version};
    void execute({operationId:common.operationId,label:action,projectId:p.projectId,run:()=>action==="rename"?client.renameProject(p.projectId,intent as Parameters<typeof client.renameProject>[1]):action==="group"?client.createGroup(p.projectId,intent as Parameters<typeof client.createGroup>[1]):client.joinProject(p.projectId,intent as Parameters<typeof client.joinProject>[1])});
  }
  function groupCommand(event:FormEvent<HTMLFormElement>,action:"rename"|"join"){
    event.preventDefault();if(!project||!group||locked)return;const data=new FormData(event.currentTarget);const p=project,g=group;const common={operationId:crypto.randomUUID(),scope:scope(p),reason:String(data.get("reason"))};
    const intent=action==="rename"?{...common,name:String(data.get("name")),expectedVersion:g.version}:{...common,targetActorId:String(data.get("actorId")),expectedGroupVersion:g.version};
    void execute({operationId:common.operationId,label:action,projectId:p.projectId,groupId:g.groupId,run:()=>action==="rename"?client.renameGroup(g.groupId,intent as Parameters<typeof client.renameGroup>[1]):client.joinGroup(g.groupId,intent as Parameters<typeof client.joinGroup>[1])});
  }
  function end(event:FormEvent<HTMLFormElement>){
    event.preventDefault();if(!project||!ending||locked)return;const data=new FormData(event.currentTarget);const p=project,e=ending;const input={operationId:crypto.randomUUID(),scope:scope(p),expectedVersion:e.membership.version,reason:String(data.get("reason"))};
    void execute({operationId:input.operationId,label:"Kết thúc Membership",projectId:p.projectId,...(e.isGroup&&group?{groupId:group.groupId}:{}),run:()=>e.isGroup?client.endGroupMembership(e.membership.membershipId,input):client.endProjectMembership(e.membership.membershipId,input)});
  }
  return <div className="account-layout project-layout">
    <ProjectsView projects={page?.items??null} selectedProjectId={project?.projectId} filter={filter} loading={loading} busy={locked} canCreate={context.actions.includes("project.create")&&!pending}
      onFilterChange={setFilter} onSearch={e=>{e.preventDefault();void load();}} onReload={()=>void load(page?.offset??0)} onSelectProject={p=>{setTargetFilter("");void select(p.projectId);}}
      onOpenCreate={()=>{setShowCreate(true);requestAnimationFrame(()=>createName.current?.focus());}}
      status={<><p role="status" aria-live="polite" tabIndex={-1} ref={messageRef} className="status-message" data-testid="project-status">{message}</p>{operation&&<p className="hint">Operation: <code>{operation}</code></p>}
        {pending&&<div role="alert"><p>Kết quả chưa rõ. Không tạo OperationId mới hoặc tự retry. Có thể resolve bằng đúng yêu cầu ban đầu: {pending.label}.</p><button className="admin-btn" disabled={busy} onClick={()=>void execute(pending)}>Resolve lại cùng OperationId</button></div>}</>}>
      {page&&<Pager page={page} disabled={locked} change={offset=>void load(offset)} />}
      {showCreate&&context.actions.includes("project.create")&&<form className="form-card" aria-label="Tạo Project" onSubmit={create}><fieldset disabled={locked}><legend>Tạo Project · Organization {context.organizationName}</legend>
        <label>Tên Project<input ref={createName} name="name" maxLength={200} required /></label><Reason /><p className="hint">Không tự tạo Project Membership, Group Membership hoặc Role Assignment cho người tạo.</p>
        <button className="admin-btn primary" type="submit">Tạo Project trên Server</button><button className="admin-btn" type="button" onClick={()=>setShowCreate(false)}>Hủy</button></fieldset></form>}
    </ProjectsView>
    <aside className="admin-inspector project-inspector" aria-label="Chi tiết Project và Group"><div className="admin-inspector-body">
      {!project?<p>Chọn Project để quản trị membership và Group thật.</p>:<>
        <h2 tabIndex={-1} ref={heading}>{project.name}</h2><dl><dt>Project ID</dt><dd>{project.projectId}</dd><dt>Project version</dt><dd data-testid="project-version">{project.version}</dd><dt>Phạm vi cố định</dt><dd>Project thuộc {context.organizationName}</dd></dl>
        <p className="hint">Quản trị không đồng nghĩa tham gia kỹ thuật. Kết thúc Project Membership làm Group access ineligible nhưng không xóa lịch sử Group; rejoin có thể phục hồi Group chưa kết thúc.</p>
        {can("project.update")&&<form key={project.projectId+project.version} className="form-card" aria-label="Đổi tên Project" onSubmit={e=>projectCommand(e,"rename")}><fieldset disabled={locked}><legend>Đổi tên Project</legend><label>Tên Project<input name="name" defaultValue={project.name} maxLength={200} required /></label><Reason /><button type="submit">Lưu tên Project</button></fieldset></form>}
        <h3>Project Membership · history</h3><MemberFilter value={targetFilter} set={setTargetFilter} disabled={locked} submit={()=>void select(project.projectId,0,groups?.offset??0,targetFilter)} />
        {members&&<><Memberships page={members} canEnd={can("project.membership.remove")} disabled={locked} onEnd={membership=>setEnding({membership,isGroup:false})} /><Pager page={members} disabled={locked} change={offset=>void select(project.projectId,offset,groups?.offset??0,targetFilter)} />
          {can("project.membership.assign")&&<form className="form-card" aria-label="Gán Project Membership" onSubmit={e=>projectCommand(e,"join")}><fieldset disabled={locked}><legend>Gán Project Membership riêng</legend><Targets page={members} /><Reason /><p className="hint">Account/Actor ACTIVE cùng Organization; hiệu lực từ lần commit đầu tiên, không có quyền sản phẩm tự động.</p><button type="submit">Gán Project Membership</button></fieldset></form>}
          {members.eligibleTargets.hasMore&&<button type="button" disabled={locked} onClick={()=>void select(project.projectId,members.eligibleTargets.offset+members.eligibleTargets.limit,groups?.offset??0,targetFilter)}>Trang đích tiếp theo của Project</button>}
        </>}
        <h3>Group trong Project</h3>{groups&&<><ul className="login-identities">{groups.items.map(g=><li key={g.groupId}><button type="button" disabled={locked} onClick={()=>{setTargetFilter("");void selectGroup(g.groupId);}} aria-label={`Mở Group ${g.name}`}>{g.name}</button><code>{g.groupId}</code><span>Version {g.version}</span></li>)}</ul>{groups.items.length===0&&<p>Chưa có Group.</p>}<Pager page={groups} disabled={locked} change={offset=>void select(project.projectId,members?.offset??0,offset,targetFilter)} /></>}
        {can("project.group.create")&&<form className="form-card" aria-label="Tạo Group" onSubmit={e=>projectCommand(e,"group")}><fieldset disabled={locked}><legend>Tạo Group cùng Project</legend><label>Tên Group<input name="name" maxLength={200} required /></label><Reason /><button type="submit">Tạo Group trên Server</button></fieldset></form>}
        {group&&groupMembers&&<section aria-label="Group đã chọn"><h3>{group.name}</h3><code>{group.groupId}</code><p data-testid="group-version">Group version {group.version}</p>
          {can("project.group.update")&&<form key={group.groupId+group.version} className="form-card" aria-label="Đổi tên Group" onSubmit={e=>groupCommand(e,"rename")}><fieldset disabled={locked}><legend>Đổi tên Group</legend><label>Tên Group<input name="name" defaultValue={group.name} maxLength={200} required /></label><Reason /><button type="submit">Lưu tên Group</button></fieldset></form>}
          <MemberFilter value={targetFilter} set={setTargetFilter} disabled={locked} submit={()=>void selectGroup(group.groupId,0,targetFilter)} />
          <Memberships page={groupMembers} canEnd={can("project.group.membership.remove")} disabled={locked} onEnd={membership=>setEnding({membership,isGroup:true})} /><Pager page={groupMembers} disabled={locked} change={offset=>void selectGroup(group.groupId,offset,targetFilter)} />
          {can("project.group.membership.assign")&&<form className="form-card" aria-label="Gán Group Membership" onSubmit={e=>groupCommand(e,"join")}><fieldset disabled={locked}><legend>Gán Group Membership</legend><Targets page={groupMembers} /><Reason /><p className="hint">Chỉ Actor đang là member hiệu lực của đúng Project. Không có nested Group hay vai trò quản trị ngầm.</p><button type="submit">Gán Group Membership</button></fieldset></form>}
          {groupMembers.eligibleTargets.hasMore&&<button type="button" disabled={locked} onClick={()=>void selectGroup(group.groupId,groupMembers.eligibleTargets.offset+groupMembers.eligibleTargets.limit,targetFilter)}>Trang đích tiếp theo của Group</button>}
        </section>}
        {ending&&<form className="form-card" aria-label="Xác nhận kết thúc Membership" onSubmit={end}><fieldset disabled={locked}><legend>Kết thúc {ending.isGroup?"Group":"Project"} Membership</legend><p>Target: {ending.membership.displayName}; association version {ending.membership.version}. Bản ghi/history vẫn được giữ.</p><Reason /><label className="check-label"><input type="checkbox" required />Tôi đã kiểm tra phạm vi, target và ảnh hưởng đến Group eligibility.</label><button type="submit">Xác nhận kết thúc</button><button type="button" onClick={()=>setEnding(null)}>Hủy</button></fieldset></form>}
      </>}
    </div></aside>
  </div>;
}
function Reason(){return <label>Lý do<input name="reason" maxLength={500} required /></label>;}
function Pager({page,disabled,change}:{page:BoundedPage<unknown>;disabled:boolean;change(offset:number):void}){return <div className="actions"><button type="button" disabled={disabled||page.offset===0} onClick={()=>change(Math.max(0,page.offset-page.limit))}>Trang trước</button><button type="button" disabled={disabled||!page.hasMore} onClick={()=>change(page.offset+page.limit)}>Trang sau</button></div>;}
function MemberFilter({value,set,disabled,submit}:{value:string;set(value:string):void;disabled:boolean;submit():void}){return <form aria-label="Tìm thành viên và đích" onSubmit={e=>{e.preventDefault();submit();}}><label>Tìm thành viên / đích theo tên hoặc login<input value={value} maxLength={200} onChange={e=>set(e.target.value)} /></label><button type="submit" disabled={disabled}>Tìm thành viên / đích</button></form>;}
function Targets({page}:{page:ParticipationPage}){return <><label>Actor đích<select name="actorId" defaultValue="" required><option value="" disabled>Chọn Actor hợp lệ hiện tại</option>{page.eligibleTargets.items.map(t=><option key={t.actorId} value={t.actorId}>{t.displayName} — {t.actorId}</option>)}</select></label>{page.eligibleTargets.hasMore&&<p className="hint">Có thêm đích. Dùng bộ lọc hoặc trang tiếp theo để chọn chính xác.</p>}</>;}
function Memberships({page,canEnd,disabled,onEnd}:{page:ParticipationPage;canEnd:boolean;disabled:boolean;onEnd(member:ParticipationView):void}){return <>{page.items.length===0?<p>Chưa có Membership phù hợp.</p>:<ul className="login-identities">{page.items.map(m=><li key={m.membershipId}><strong>{m.displayName}</strong><code>{m.membershipId}</code><span>{m.endedAt?"ENDED":m.eligible?"ELIGIBLE":"INELIGIBLE"} · version {m.version}</span><span>Từ {m.effectiveFrom} · đến {m.effectiveUntil??"không định thời kết thúc"}</span>{canEnd&&!m.endedAt&&<button type="button" disabled={disabled} onClick={()=>onEnd(m)}>Kết thúc {m.displayName}</button>}</li>)}</ul>}</>;}
