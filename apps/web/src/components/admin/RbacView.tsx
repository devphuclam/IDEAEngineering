import {useState,type ReactNode} from "react";
import type {AssignmentView,RoleView} from "../../api/iamClient";

// Authored RbacView @ 9160ec27: preserve header, tabs, table and visual tokens.
// No mock department inheritance, local permission evaluator or unsupported Inspector tab.
export function RbacView({assignments,roles,busy,canGrant,selectedId,onSelect,onAdd,children,status,inactive=false}:{
  assignments:AssignmentView[]|null;roles:RoleView[]|null;busy:boolean;canGrant:boolean;selectedId?:string;
  onSelect(value:AssignmentView):void;onAdd():void;children:ReactNode;status:ReactNode;inactive?:boolean;
}){
  const [tab,setTab]=useState<"assignments"|"roles">("assignments");
  return <div inert={inactive} className="admin-main"><div className="admin-main-head"><div><div className="admin-crumbs">Quản trị hệ thống &gt; Phân quyền vai trò RBAC</div>
    <h1 className="admin-main-title">Phân Quyền Vai Trò RBAC</h1><p className="admin-main-desc">Assignment độc lập, đúng scope và exact Role code/version. Quyền do Server quyết định.</p></div>
    <div className="admin-head-actions"><a className="admin-btn" href="#custom-role">Quản lý Custom Role</a>{canGrant&&<button className="admin-btn primary" type="button" disabled={busy} onClick={onAdd}><span>Thêm phân quyền vai trò</span></button>}</div></div>
    <div className="admin-tabs-row" aria-label="Chế độ phân quyền"><button className={`admin-tab-btn ${tab==="assignments"?"active":""}`} aria-pressed={tab==="assignments"} type="button" onClick={()=>setTab("assignments")}>Bảng gán vai trò</button><button className={`admin-tab-btn ${tab==="roles"?"active":""}`} aria-pressed={tab==="roles"} type="button" onClick={()=>setTab("roles")}>Danh mục vai trò</button><a className="admin-tab-btn" href="#access">Kiểm tra quyền thực tế</a></div>
    {children}{status}
    <div className="admin-table-container">{tab==="assignments"?(assignments===null?<p>Chưa có assignment được Server xác nhận.</p>:<table className="admin-data-table" aria-label="Bảng phân quyền vai trò"><thead><tr><th>Đối tượng</th><th>Role code / version</th><th>Scope</th><th>Hiệu lực / version</th><th>Thao tác</th></tr></thead><tbody>{assignments.map(a=><tr key={a.assignmentId} className={selectedId===a.assignmentId?"selected":""}><td><span className={`admin-entity-badge ${a.principal.kind==="ACTOR"?"user":"group"}`}>{a.principal.kind==="ACTOR"?"Actor":"Project Group"}</span><code>{a.principal.kind==="ACTOR"?a.principal.actorId:a.principal.groupId}</code></td><td><strong>{a.roleCode}@{a.roleVersion}</strong><code>{a.roleVersionId}</code></td><td>{a.scope.kind}<code>{a.scope.kind==="PROJECT"?a.scope.projectId:a.scope.organizationId}</code></td><td>{a.revokedAt?"ENDED":a.effective?"EFFECTIVE":"INACTIVE"} · {a.version}</td><td><button className="admin-btn" type="button" disabled={busy} aria-label={`Mở assignment ${a.assignmentId}`} onClick={()=>onSelect(a)}>Mở</button></td></tr>)}</tbody></table>):(roles===null?<p>Chưa có catalogue được Server xác nhận.</p>:<table className="admin-data-table" aria-label="Danh mục vai trò"><thead><tr><th>Tên hiển thị</th><th>Exact code/version</th><th>Permission</th><th>Khả dụng</th></tr></thead><tbody>{roles.map(r=><tr key={r.roleVersionId}><td>{r.displayName}</td><td><code>{r.roleCode}@{r.version}</code><code>{r.roleVersionId}</code></td><td>{r.permissions.map(p=><div key={p.code}><code>{p.code}</code> · {p.implementationState}</div>)}</td><td>{r.selectable?"QUALIFIED":"Chưa đủ điều kiện · DESIGN content"}</td></tr>)}</tbody></table>)}</div>
  </div>;
}
