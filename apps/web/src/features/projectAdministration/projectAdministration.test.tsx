import { describe, expect, it } from "vitest";
import { createIamClient, type IamResult } from "../../api/iamClient";
import { settledIamState } from "../iamIntegration/iamIntegrationState";
import { renderToStaticMarkup } from "react-dom/server";
import { ProjectAdministrationPage } from "./ProjectAdministrationPage";

const id="00000000-0000-4000-8000-000000000046";
type PlannedProjectClient={loadProjects(filter?:string,offset?:number):Promise<IamResult<unknown>>;
  createProject(input:Record<string,unknown>):Promise<IamResult<unknown>>;
  loadProjectMembers(project:string,filter?:string,offset?:number):Promise<IamResult<unknown>>;
  joinProject(project:string,input:Record<string,unknown>):Promise<IamResult<unknown>>};
describe("Project Administration client boundary",()=>{
  it("loads the permission-filtered bounded collection without caller Actor",async()=>{
    const client=createIamClient(async(path,init)=>{
      expect(path).toBe("/api/v1/administration/projects?filter=Synthetic&offset=0&limit=50");
      expect(new Headers(init.headers).has("ActorId")).toBe(false);
      return Response.json({items:[{projectId:id,organizationId:id,name:"Synthetic Project",version:1,actions:["project.admin.read"]}],offset:0,limit:50,hasMore:false});
    }) as unknown as PlannedProjectClient;
    expect((await client.loadProjects("Synthetic")).kind).toBe("confirmed");
  });
  it("distinguishes authorized empty from refusal unavailable and malformed projections",async()=>{
    for(const [status,expected] of [[403,"refused"],[503,"unavailable"]] as const){
      const client=createIamClient(async()=>new Response(null,{status})) as unknown as PlannedProjectClient;
      expect(settledIamState(await client.loadProjects()).kind).toBe(expected);
    }
    const empty=createIamClient(async()=>Response.json({items:[],offset:0,limit:50,hasMore:false})) as unknown as PlannedProjectClient;
    expect((await empty.loadProjects()).kind).toBe("confirmed");
    const bad=createIamClient(async()=>Response.json({items:[{projectId:"forged"}],offset:0,limit:50,hasMore:false})) as unknown as PlannedProjectClient;
    expect((await bad.loadProjects()).kind).toBe("unavailable");
  });
  it("creates exactly once through CSRF with no implicit membership or Role payload",async()=>{
    let sent=0;const client=createIamClient(async(path,init)=>{
      if(path==="/api/v1/identity/csrf")return Response.json({headerName:"X-CSRF-TOKEN",token:"synthetic-csrf"});
      sent++;expect(path).toBe("/api/v1/administration/projects");expect(new Headers(init.headers).get("X-CSRF-TOKEN")).toBe("synthetic-csrf");
      expect(Object.keys(JSON.parse(String(init.body))).sort()).toEqual(["name","operationId","organizationId","reason"]);
      return Response.json({projectId:id,organizationId:id,name:"Synthetic",version:1,actions:[]},{status:201});
    }) as unknown as PlannedProjectClient;
    expect((await client.createProject({operationId:id,organizationId:id,name:"Synthetic",reason:"Explicit creation"})).kind).toBe("confirmed");expect(sent).toBe(1);
  });
  it("pins scope parent version and intent and never retries a lost participation response",async()=>{
    let sent=0;const input={operationId:id,scope:{kind:"PROJECT",organizationId:id,projectId:id},targetActorId:id,expectedProjectVersion:2,reason:"Explicit participation"};
    const client=createIamClient(async(path,init)=>{
      if(path==="/api/v1/identity/csrf")return Response.json({headerName:"X-CSRF-TOKEN",token:"synthetic-csrf"});
      sent++;expect(path).toBe(`/api/v1/administration/projects/${id}/members`);expect(JSON.parse(String(init.body))).toEqual(input);throw new Error("Lost response");
    }) as unknown as PlannedProjectClient;
    expect((await client.joinProject(id,input)).kind).toBe("unresolved");expect(sent).toBe(1);
  });
  it("uses Server availability for Organization create and membership-independent administration",()=>{
    const context={actorId:id,accountId:id,organizationId:id,displayName:"Synthetic PA",organizationName:"Synthetic Organization",actions:["project.admin.read"]};
    const scoped=renderToStaticMarkup(<ProjectAdministrationPage context={context} onInvalidated={()=>{}} />);
    expect(scoped).toContain("Quản trị Project và tham gia kỹ thuật là hai quyền khác nhau");
    expect(scoped).not.toContain("<span>Tạo Project</span>");
    const organization=renderToStaticMarkup(<ProjectAdministrationPage context={{...context,actions:[...context.actions,"project.create"]}} onInvalidated={()=>{}} />);
    expect(organization).toContain("<span>Tạo Project</span>");expect(organization).not.toContain("demo-admin");
  });
  it("copies only the authorized Group participation projection and eligible targets",async()=>{
    const client=createIamClient(async()=>Response.json({items:[],offset:0,limit:50,hasMore:false,parentVersion:1,
      eligibleTargets:{items:[{actorId:id,displayName:"Synthetic Project member",password:"must not enter state"}],offset:0,limit:50,hasMore:false},password:"discard"}));
    const result=await client.loadGroupMembers(id);expect(result.kind).toBe("confirmed");expect(JSON.stringify(result)).not.toContain("password");
    expect(JSON.stringify(result)).not.toContain("must not enter state");
  });
  it("keeps stale version and uncertain technical failure distinct without automatic submission",async()=>{
    for(const [status,kind] of [[409,"stale"],[503,"unresolved"]] as const){
      let submissions=0;const client=createIamClient(async path=>{if(path.endsWith("/csrf"))return Response.json({headerName:"X-CSRF-TOKEN",token:"synthetic-csrf"});submissions++;return new Response(null,{status});});
      const result=await client.createGroup(id,{operationId:id,scope:{kind:"PROJECT",organizationId:id,projectId:id},name:"Synthetic Group",expectedProjectVersion:1,reason:"Explicit Group"});
      expect(result.kind).toBe(kind);expect(submissions).toBe(1);
    }
  });
  it("does not submit when acquisition of current CSRF fails",async()=>{
    let submissions=0;const client=createIamClient(async path=>{if(path.endsWith("/csrf"))return new Response(null,{status:503});submissions++;throw new Error();});
    expect((await client.joinGroup(id,{operationId:id,scope:{kind:"PROJECT",organizationId:id,projectId:id},targetActorId:id,expectedGroupVersion:1,reason:"Explicit participation"})).kind).toBe("unavailable");expect(submissions).toBe(0);
  });
});
