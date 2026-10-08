import {describe,it,expect} from "vitest";
import {createIamClient,type IamResult} from "../../api/iamClient";
import {renderToStaticMarkup} from "react-dom/server";
import {CustomRoleEditor,roleProposalTarget} from "./CustomRoleEditor";
const id="00000000-0000-4000-8000-000000000046",scope={kind:"ORGANIZATION",organizationId:id};
const candidate={candidateId:id,definitionId:id,roleCode:"custom-"+id,displayName:"Synthetic",managementScope:scope,baseVersionId:null,proposedRoleVersion:1,classification:"BUSINESS",support:{scopeKinds:["PROJECT"],principalKinds:["ACTOR","PROJECT_GROUP"]},permissionCodes:["project.read"],contentDigest:"a".repeat(64),version:1,state:"CANDIDATE",activatedVersionId:null,difference:{added:["project.read"],removed:[],unchanged:[]}};
const permission={code:"project.read",owner:"Project",scopeKinds:["PROJECT"],principalKinds:["ACTOR","PROJECT_GROUP"],participantMembershipRequired:true,implementationState:"IMPLEMENTED"};
type Planned={loadPermissions(s:unknown):Promise<IamResult<unknown>>;prepareRole(i:unknown):Promise<IamResult<unknown>>;validateRole(id:string,i:unknown):Promise<IamResult<unknown>>;activateRole(id:string,i:unknown):Promise<IamResult<unknown>>};
const csrf=()=>Response.json({headerName:"X-CSRF-TOKEN",token:"synthetic-csrf"});
describe("Custom Role ordinary session and immutable owner boundary",()=>{
  it("a selected successor missing after catalogue paging cannot silently become a new definition",()=>{
    expect(roleProposalTarget(id,[],"Retained successor display name")).toBeNull();
    expect(roleProposalTarget("",[]," Explicit new role ")).toEqual({name:"Explicit new role"});
  });
  it("reuses existing Permission catalogue including DESIGN without promoting availability",async()=>{
    const client=createIamClient(async path=>{expect(path).toBe(`/api/v1/administration/permissions?organizationId=${id}&offset=0&limit=50`);return Response.json({items:[permission,{...permission,code:"audit.read",implementationState:"DESIGN"}],offset:0,limit:50,hasMore:false});}) as unknown as Planned;
    expect((await client.loadPermissions(scope)).kind).toBe("confirmed");
  });
  it("prepares only an exact candidate with fresh CSRF and no authoritative Actor",async()=>{
    const input={operationId:id,scope,name:"Synthetic",permissionCodes:["project.read"],support:candidate.support,reason:"Explicit proposal"};
    const client=createIamClient(async(path,init)=>{if(path.endsWith("/csrf"))return csrf();expect(path).toBe("/api/v1/administration/roles/candidates");expect(init.credentials).toBe("same-origin");expect(JSON.parse(String(init.body))).toEqual(input);expect(init.headers).toHaveProperty("X-CSRF-TOKEN");return Response.json({...candidate,password:"discard"},{status:201});}) as unknown as Planned;
    const result=await client.prepareRole(input);expect(result.kind).toBe("confirmed");expect(JSON.stringify(result)).not.toContain("discard");
  });
  it("validation is advisory and preserves the exact version/diff",async()=>{
    const client=createIamClient(async(path)=>path.endsWith("/csrf")?csrf():Response.json({valid:true,candidate,difference:candidate.difference,consequences:["No assignment changes"]})) as unknown as Planned;
    expect((await client.validateRole(id,{scope,expectedVersion:1})).kind).toBe("confirmed");
  });
  it("stale and forbidden activation do not become success; response loss is unresolved",async()=>{
    for(const [status,kind] of [[409,"stale"],[403,"refused"],[503,"unresolved"]] as const){let posts=0;const client=createIamClient(async(path,init)=>{if(path.endsWith("/csrf"))return csrf();posts++;expect(path).toBe(`/api/v1/administration/roles/candidates/${id}/activate`);expect(JSON.parse(String(init.body))).toEqual({operationId:id,scope,expectedVersion:1,baseVersionId:null,reason:"Activate"});return new Response(null,{status});}) as unknown as Planned;expect((await client.activateRole(id,{operationId:id,scope,expectedVersion:1,baseVersionId:null,reason:"Activate"})).kind).toBe(kind);expect(posts).toBe(1);}
  });
  it("malformed candidate or validation cannot be called confirmed",async()=>{
    const client=createIamClient(async path=>path.endsWith("/csrf")?csrf():Response.json({success:true},{status:201})) as unknown as Planned;
    expect((await client.prepareRole({})).kind).toBe("unresolved");
  });
  it("uses original authored presentation and explicitly separates activation from assignments",()=>{
    const html=renderToStaticMarkup(<CustomRoleEditor context={{actorId:id,accountId:id,organizationId:id,displayName:"Synthetic",organizationName:"Actual Organization",actions:["role.definition.prepare","role.definition.activate"]}} onInvalidated={()=>{}}/>);
    expect(html).toContain("admin-main-title");expect(html).toContain("admin-inspector");expect(html).toContain("Actual Organization");expect(html).toContain("Không sửa built-in hoặc tự chuyển assignment");expect(html).not.toContain("demo-admin");
  });
  it("no preparation authority cannot render a pretend mutation form",()=>{
    const html=renderToStaticMarkup(<CustomRoleEditor context={{actorId:id,accountId:id,organizationId:id,displayName:"Synthetic",organizationName:"Actual Organization",actions:[]}} onInvalidated={()=>{}}/>);
    expect(html).toContain("Chưa có authority prepare");expect(html).not.toContain('aria-label="Chuẩn bị Custom Role"');
  });
});
