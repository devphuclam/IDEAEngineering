import {useEffect,useRef,useState,type FormEvent} from "react";
import {createIamClient,type AccessInspection,type AdministrationContext,type AssignmentScope,type BoundedPage,type ProjectView,type OperationResolution,type PermissionView,type AdministrationHistory,type HistorySnapshot} from "../../api/iamClient";
import {outcomeMessage} from "../iamIntegration/IamStatus";
const client=createIamClient();
const uuidPattern="[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}";
/** Original administration presentation; current Server query is the only effective-access source. */
export function AccessInspectionPage({context,onInvalidated}:{context:AdministrationContext;onInvalidated():void}){
  const [scope,setScope]=useState<AssignmentScope>({kind:"ORGANIZATION",organizationId:context.organizationId});
  const [target,setTarget]=useState(context.actorId),[permission,setPermission]=useState("project.read"),[operation,setOperation]=useState("");
  const [projects,setProjects]=useState<BoundedPage<ProjectView>|null>(null),[permissions,setPermissions]=useState<PermissionView[]>([]),[projectId,setProjectId]=useState("");
  const [inspection,setInspection]=useState<AccessInspection|null>(null),[resolution,setResolution]=useState<OperationResolution|null>(null),[busy,setBusy]=useState(false),[message,setMessage]=useState("");
  const [collapsed,setCollapsed]=useState(false);
  const epoch=useRef(0),alive=useRef(true),heading=useRef<HTMLHeadingElement>(null),status=useRef<HTMLParagraphElement>(null);
  const canInspect=context.actions.includes("access.inspect");
  const canHistory=context.actions.includes("audit.read"),[history,setHistory]=useState<BoundedPage<AdministrationHistory>|null>(null),[historyTarget,setHistoryTarget]=useState("");
  function failure(r:Parameters<typeof outcomeMessage>[0]){setMessage(r.kind==="unavailable"?"Không lấy được dữ liệu đọc từ Server. Có thể thử lại query; không replay mutation.":outcomeMessage(r));if(r.kind==="refused"&&r.status===401)onInvalidated();}
  useEffect(()=>{alive.current=true;heading.current?.focus();if(context.actions.includes("project.admin.read"))void client.loadProjects().then(r=>{if(alive.current){if(r.kind==="confirmed")setProjects(r.value);else failure(r);}});return()=>{alive.current=false;epoch.current++;};},[context.actorId]);
  useEffect(()=>{const request=++epoch.current;setPermissions([]);if(context.actions.includes("role.catalogue.read"))void client.loadPermissions(scope).then(r=>{if(alive.current&&request===epoch.current){if(r.kind==="confirmed")setPermissions(r.value.items);else failure(r);}});},[scope]);
  function edit(){epoch.current++;setInspection(null);setResolution(null);setHistory(null);setMessage("");}
  async function loadHistory(offset=0){if(busy||!canHistory)return;const request=++epoch.current;setHistory(null);setBusy(true);try{const r=await client.loadHistory(scope,offset,historyTarget||undefined);if(!alive.current||request!==epoch.current)return;if(r.kind==="confirmed"){setHistory(r.value);setMessage("Đã đọc history theo quyền audit.read hiện tại; không replay mutation.");}else failure(r);}finally{if(alive.current)setBusy(false);}}
  function selectScope(value:string){edit();setScope(value==="ORGANIZATION"?{kind:"ORGANIZATION",organizationId:context.organizationId}:{kind:"PROJECT",organizationId:context.organizationId,projectId:value});}
  async function inspect(e:FormEvent){e.preventDefault();if(busy||!canInspect)return;const request=++epoch.current;setInspection(null);setBusy(true);setMessage("Đang đọc current eligibility và mọi đường đóng góp quyền…");try{const r=await client.inspectAccess({targetActorId:target,scope,permissionCode:permission});if(!alive.current||request!==epoch.current)return;if(r.kind==="confirmed"){setInspection(r.value);setMessage("Đã nhận snapshot advisory từ Server. RBAC không thay thế owner business gates.");}else failure(r);}finally{if(alive.current){setBusy(false);requestAnimationFrame(()=>status.current?.focus());}}}
  async function resolve(e:FormEvent){e.preventDefault();if(busy)return;const request=++epoch.current;setResolution(null);setBusy(true);setMessage("Đang kiểm quyền đọc operation…");try{const r=await client.resolveOperation(operation,scope);if(!alive.current||request!==epoch.current)return;if(r.kind==="confirmed"){setResolution(r.value);setMessage(r.value.state==="UNRESOLVED"?"Chưa có kết quả được phép đọc. Không chứng minh rollback và không tự gửi mutation lại.":"Server đã xác nhận metadata terminal được phép đọc; query không replay mutation.");}else failure(r);}finally{if(alive.current){setBusy(false);requestAnimationFrame(()=>status.current?.focus());}}}
  return <div className="account-layout"><section className="admin-main" aria-label="Effective Access Inspector">
    <div className="admin-main-head"><div><div className="admin-crumbs">Quản trị hệ thống &gt; RBAC &gt; Inspector</div><h1 className="admin-main-title" ref={heading} tabIndex={-1}>Effective Access Inspector</h1><p className="admin-main-desc">Quyền thực tế và provenance · chỉ đọc, không cấp hay thu hồi quyền.</p></div><a className="admin-btn" href="#rbac">← Về phân quyền RBAC</a></div>
    <div className="admin-toolbar"><label>Phạm vi kiểm tra<select aria-label="Phạm vi kiểm tra" disabled={busy} value={scope.kind==="ORGANIZATION"?"ORGANIZATION":scope.projectId} onChange={e=>selectScope(e.target.value)}><option value="ORGANIZATION">Organization · {context.organizationName}</option>{projects?.items.map(p=><option key={p.projectId} value={p.projectId}>Project · {p.name}</option>)}{scope.kind==="PROJECT"&&!projects?.items.some(p=>p.projectId===scope.projectId)&&<option value={scope.projectId}>Project · {scope.projectId}</option>}</select></label></div>
    <form onSubmit={e=>{e.preventDefault();selectScope(projectId);}}><label>Exact ProjectId<input aria-label="Exact ProjectId" required pattern={uuidPattern} disabled={busy} value={projectId} onChange={e=>setProjectId(e.target.value)} /></label><button type="submit" disabled={busy}>Kiểm tra scope Project</button><p className="hint">Không suy quyền browse Project từ quyền inspection; Server kiểm scope được nhập.</p></form>
    {projects?.hasMore&&<button type="button" disabled={busy} onClick={()=>void client.loadProjects("",projects.offset+projects.limit).then(r=>{if(alive.current){if(r.kind==="confirmed")setProjects(r.value);else failure(r);}})}>Trang Project tiếp theo</button>}
    <p role="status" aria-live="polite" ref={status} tabIndex={-1} data-testid="inspection-status">{message}</p>
    {!canInspect?<p>Chưa có quyền access.inspect được Server xác nhận. Không giả lập effective access.</p>:<form className="form-card" aria-label="Kiểm tra effective access" onSubmit={inspect}><fieldset disabled={busy}><legend>Actor / action trong scope được phép</legend>
      <label>Target ActorId<input aria-label="Target ActorId" value={target} required pattern={uuidPattern} onChange={e=>{edit();setTarget(e.target.value);}} /></label>
      <label>Permission code<input aria-label="Permission code" value={permission} required maxLength={120} list="inspection-permissions" onChange={e=>{edit();setPermission(e.target.value);}} /><datalist id="inspection-permissions">{permissions.map(p=><option key={p.code} value={p.code}>{p.implementationState} · {p.owner}</option>)}</datalist></label>
      <button className="admin-btn primary" type="submit">Đọc effective access</button></fieldset></form>}
    {inspection&&<section aria-label="Snapshot effective access" data-testid="inspection-result"><h2>{inspection.permissionCode} · {inspection.rbacResult}</h2><p>{inspection.implementationState} · Account {inspection.accountEligible?"eligible":"ineligible"} · Project Membership {inspection.projectMembershipEligible?"eligible":"not applicable / ineligible"}</p><p>RBAC ALLOW chỉ là quyền thử thao tác. Owner business gates: NOT_EVALUATED — không claim được đọc/sửa dữ liệu kỹ thuật.</p><p>Quan sát tại {inspection.evaluatedAt}. Thay đổi quyền/membership sau đó phải được owner kiểm lại.</p>
      {!inspection.paths.length?<p>Không có đường cấp quyền đang đóng góp trong scope này.</p>:inspection.paths.map(path=><article key={path.assignmentId} className="form-card"><h3>{path.groupId?"Group assignment":"Direct assignment"} · {path.roleCode}@{path.roleVersion}</h3><dl><dt>Assignment</dt><dd>{path.assignmentId}</dd><dt>Exact role version</dt><dd>{path.roleVersionId}</dd><dt>Assignment scope</dt><dd>{path.assignmentScope.kind} · {path.assignmentScope.kind==="PROJECT"?path.assignmentScope.projectId:path.assignmentScope.organizationId}</dd><dt>Group / membership paths</dt><dd>{path.groupId??"Direct Actor"} · {path.projectMembershipId??"Không yêu cầu Project Membership"} · {path.groupMembershipId??"Không qua Group Membership"}</dd><dt>Assigned by / at / reason</dt><dd>{path.assignedBy} · {path.assignedAt} · {path.reason}</dd></dl></article>)}</section>}
  </section><aside className={`admin-inspector ${collapsed ? "collapsed" : ""}`} aria-label="History và operation resolution">
    {collapsed ? (
      <div className="admin-inspector-collapsed-strip">
        <button type="button" className="admin-inspector-expand-btn" onClick={() => setCollapsed(false)} aria-label="Mở rộng panel chi tiết" title="Mở rộng panel chi tiết">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span>Resolution / History</span>
        </button>
      </div>
    ) : (
      <>
        <div className="admin-inspector-head">
          <div className="admin-inspector-head-row">
            <span className="admin-surface-badge">Resolution &amp; History</span>
            <button type="button" className="admin-inspector-toggle-btn" onClick={() => setCollapsed(true)} aria-label="Thu gọn panel chi tiết" title="Thu gọn panel chi tiết">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>
        <div className="admin-inspector-body">
          <h2>Operation resolution</h2><form aria-label="Tra cứu operation" onSubmit={resolve}><label>OperationId<input aria-label="OperationId" value={operation} required pattern={uuidPattern} disabled={busy} onChange={e=>{edit();setOperation(e.target.value);}} /></label><button type="submit" disabled={busy}>Đọc kết quả operation</button></form>
          {resolution&&<section data-testid="operation-resolution"><h3>{resolution.state}</h3>{resolution.state!=="UNRESOLVED"&&<dl><dt>Owner / action</dt><dd>{resolution.owner} · {resolution.action}</dd><dt>Original Actor</dt><dd>{resolution.actorId}</dd><dt>Outcome / correlation</dt><dd>{resolution.outcome} · {resolution.correlationId??"Không có retained correlation"}</dd><dt>Retry contract</dt><dd>{resolution.retryProfile}</dd></dl>}<p>Không có auto retry hoặc replay. Absent/undisclosable không có nghĩa rollback.</p></section>}
          <h2>Lịch sử quản trị</h2><p>Quyền audit.read độc lập; không suy từ access.inspect. Chỉ hiện kết quả owner quản trị và Audit đã commit trong exact scope đang chọn.</p>
          {!canHistory?<p>Chưa có quyền audit.read được Server xác nhận.</p>:<form aria-label="Đọc lịch sử quản trị" onSubmit={e=>{e.preventDefault();void loadHistory();}}><label>TargetId lịch sử (tùy chọn)<input aria-label="TargetId lịch sử" pattern={uuidPattern} value={historyTarget} disabled={busy} onChange={e=>{edit();setHistoryTarget(e.target.value);}} /></label><button type="submit" disabled={busy}>Đọc lịch sử quản trị</button></form>}
          {history&&<section data-testid="administration-history">{!history.items.length?<p>Không có kết quả được phép đọc trong trang này.</p>:history.items.map(entry=><article className="form-card" key={`${entry.owner}:${entry.operationId}`}><h3>{entry.action} · {entry.outcome}</h3><dl><dt>Operation / original Actor</dt><dd>{entry.operationId} · {entry.actorId}</dd><dt>Target / time</dt><dd>{entry.targetId??"Không được giữ"} · {entry.occurredAt}</dd><dt>Reason / correlation</dt><dd>{entry.reason??entry.reasonCode??"Không được giữ"} · {entry.correlationId??"Không được giữ"}</dd></dl><HistoryState label="Trước" value={entry.before}/><HistoryState label="Sau" value={entry.after}/></article>)}<div className="actions"><button type="button" disabled={busy||history.offset===0} onClick={()=>void loadHistory(Math.max(0,history.offset-history.limit))}>History trang trước</button><button type="button" disabled={busy||!history.hasMore} onClick={()=>void loadHistory(history.offset+history.limit)}>History trang sau</button></div><p className="hint">Snapshot không được giữ không có nghĩa là không có thay đổi. Không xuất toàn bộ Audit/security log.</p></section>}
        </div>
      </>
    )}
  </aside></div>;
}
function HistoryState({label,value}:{label:string;value:HistorySnapshot|null}){return <section><h4>{label}</h4>{value===null?<p>Snapshot không được giữ / không áp dụng.</p>:<dl>{Object.entries(value).map(([key,v])=><div key={key}><dt>{key}</dt><dd>{Array.isArray(v)?v.join(", "):String(v)}</dd></div>)}</dl>}</section>;}
