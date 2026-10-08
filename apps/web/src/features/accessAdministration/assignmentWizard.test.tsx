import { describe,expect,it } from "vitest";
import { createIamClient,type IamResult } from "../../api/iamClient";
import { renderToStaticMarkup } from "react-dom/server";
import { RbacView } from "../../components/admin/RbacView";
import { AssignmentWizard } from "./AssignmentWizard";
import type {AssignmentView,RoleView} from "../../api/iamClient";
const id="00000000-0000-4000-8000-000000000046";
const scope={kind:"PROJECT",organizationId:id,projectId:id};
const role={definitionId:id,roleVersionId:id,roleCode:"account-administrator",version:3,displayName:"Same display label",builtIn:true,classification:"ADMINISTRATION",scopeKinds:["ORGANIZATION"],principalKinds:["ACTOR"],contentDigest:"a".repeat(64),permissions:[],selectable:true,availabilityReason:null,managementScope:null};
const assignment={assignmentId:id,principal:{kind:"ACTOR",actorId:id,groupId:null},scope:{kind:"ORGANIZATION",organizationId:id,projectId:null},roleVersionId:id,roleCode:"account-administrator",roleVersion:3,effectiveFrom:"2026-10-08T00:00:00Z",effectiveUntil:null,assignedBy:id,reason:"Explicit assignment",assignedAt:"2026-10-08T00:00:00Z",revokedAt:null,endedBy:null,endReason:null,version:1,effective:true};
type PlannedClient={loadRoles(scope:unknown,offset?:number):Promise<IamResult<unknown>>;previewAssignment(input:unknown):Promise<IamResult<unknown>>;grantAssignment(input:unknown):Promise<IamResult<unknown>>;endAssignment(id:string,input:unknown):Promise<IamResult<unknown>>;replaceAssignment(id:string,input:unknown):Promise<IamResult<unknown>>;loadAssignments(scope:unknown,principal?:unknown,offset?:number):Promise<IamResult<unknown>>};
describe("Role Assignment actual client boundary",()=>{
  it("loads exact code version and availability without promoting DESIGN",async()=>{
    const client=createIamClient(async(path,init)=>{expect(path).toBe(`/api/v1/administration/roles?organizationId=${id}&projectId=${id}&offset=0&limit=50`);expect(new Headers(init.headers).has("ActorId")).toBe(false);return Response.json({items:[role,{...role,roleVersionId:"00000000-0000-4000-8000-000000000047",roleCode:"privileged-role-administrator",selectable:false,availabilityReason:"OWNER_ACTION_NOT_QUALIFIED",password:"discard"}],offset:0,limit:50,hasMore:false});}) as unknown as PlannedClient;
    const result=await client.loadRoles(scope);expect(result.kind).toBe("confirmed");expect(JSON.stringify(result)).toContain('"selectable":false');expect(JSON.stringify(result)).not.toContain("password");
  });
  it("previews exact scope principal version through ordinary CSRF with no mutation operation",async()=>{
    const input={scope,principal:{kind:"PROJECT_GROUP",groupId:id},roleVersionId:id};let calls=0;
    const client=createIamClient(async(path,init)=>{if(path.endsWith("/csrf"))return Response.json({headerName:"X-CSRF-TOKEN",token:"test-csrf"});calls++;expect(path).toBe("/api/v1/administration/assignments/preview");expect(JSON.parse(String(init.body))).toEqual(input);expect(new Headers(init.headers).get("X-CSRF-TOKEN")).toBe("test-csrf");return Response.json({allowed:true,role,principal:{kind:"PROJECT_GROUP",actorId:null,groupId:id},scope,interval:null,before:null,consequences:["No implicit membership"],refusalReason:null});}) as unknown as PlannedClient;
    expect((await client.previewAssignment(input)).kind).toBe("confirmed");expect(calls).toBe(1);
  });
  it("distinguishes Actor filtered in Group from explicit Group principal payload",async()=>{
    for(const principal of [{kind:"ACTOR",actorId:id},{kind:"PROJECT_GROUP",groupId:id}]){
      const input={operationId:id,scope,principal,roleVersionId:id,reason:"Explicit independent role"};
      const client=createIamClient(async(path,init)=>{if(path.endsWith("/csrf"))return Response.json({headerName:"X-CSRF-TOKEN",token:"test-csrf"});expect(JSON.parse(String(init.body))).toEqual(input);expect(String(init.body)).not.toContain("department");return Response.json({...assignment,scope,principal:{actorId:null,groupId:null,...principal}},{status:201});}) as unknown as PlannedClient;
      expect((await client.grantAssignment(input)).kind).toBe("confirmed");
    }
  });
  it("does not turn lost grant response into success or automatically create a new operation",async()=>{
    let sent=0;const client=createIamClient(async path=>{if(path.endsWith("/csrf"))return Response.json({headerName:"X-CSRF-TOKEN",token:"test-csrf"});sent++;throw new Error("lost response");}) as unknown as PlannedClient;
    expect((await client.grantAssignment({operationId:id,scope,principal:{kind:"ACTOR",actorId:id},roleVersionId:id,reason:"Explicit"})).kind).toBe("unresolved");expect(sent).toBe(1);
  });
  it("pins predecessor version and preserves distinct stale refusal and technical uncertainty",async()=>{
    for(const [status,kind] of [[409,"stale"],[403,"refused"],[503,"unresolved"]] as const){
      const input={operationId:id,scope,expectedVersion:2,newRoleVersionId:id,reason:"Explicit successor"};let sent=0;
      const client=createIamClient(async(path,init)=>{if(path.endsWith("/csrf"))return Response.json({headerName:"X-CSRF-TOKEN",token:"test-csrf"});sent++;expect(path).toBe(`/api/v1/administration/assignments/${id}/replace`);expect(JSON.parse(String(init.body))).toEqual(input);return new Response(null,{status});}) as unknown as PlannedClient;
      expect((await client.replaceAssignment(id,input)).kind).toBe(kind);expect(sent).toBe(1);
    }
  });
  it("retained assignment history is scoped and malformed result is not reported as success",async()=>{
    const client=createIamClient(async(path)=>{expect(path).toBe(`/api/v1/administration/assignments?organizationId=${id}&projectId=${id}&actorId=${id}&offset=0&limit=50`);return Response.json({items:[{...assignment,scope,password:"discard"}],offset:0,limit:50,hasMore:false});}) as unknown as PlannedClient;
    expect((await client.loadAssignments(scope,{kind:"ACTOR",actorId:id})).kind).toBe("confirmed");
    const bad=createIamClient(async path=>path.endsWith("/csrf")?Response.json({headerName:"X-CSRF-TOKEN",token:"test-csrf"}):Response.json({success:true},{status:201})) as unknown as PlannedClient;
    expect((await bad.grantAssignment({})).kind).toBe("unresolved");
  });
  it("preserves authored RBAC presentation and multiple independent exact role versions",()=>{
    const html=renderToStaticMarkup(<RbacView assignments={[assignment,{...assignment,assignmentId:"00000000-0000-4000-8000-000000000047",roleVersion:2} ] as AssignmentView[]} roles={[role] as RoleView[]} busy={false} canGrant onAdd={()=>{}} onSelect={()=>{}} status={null}>{null}</RbacView>);
    expect(html).toContain("admin-tabs-row");expect(html).toContain("admin-data-table");expect(html).toContain("account-administrator@3");expect(html).toContain("account-administrator@2");expect(html).toContain("Kiểm tra quyền thực tế · chưa triển khai");expect(html).not.toContain("INITIAL_GROUPS");
  });
  it("uses real Organization context and does not invent Department or all-system authority",()=>{
    const html=renderToStaticMarkup(<AssignmentWizard context={{actorId:id,accountId:id,organizationId:id,displayName:"Synthetic",organizationName:"Actual Organization",actions:["role.catalogue.read","access.inspect"]}} onInvalidated={()=>{}} />);
    expect(html).toContain("Actual Organization");expect(html).toContain("Phạm vi assignment");expect(html).not.toContain("Toàn hệ thống");expect(html).not.toContain("demo-admin");
  });
});
