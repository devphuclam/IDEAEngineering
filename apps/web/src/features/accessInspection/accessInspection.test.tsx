import {describe,it,expect} from "vitest";
import {createIamClient,type IamResult} from "../../api/iamClient";
import {renderToStaticMarkup} from "react-dom/server";
import {AccessInspectionPage} from "./AccessInspectionPage";
const id="00000000-0000-4000-8000-000000000046",scope={kind:"ORGANIZATION",organizationId:id};
const value={actorId:id,scope,permissionCode:"access.inspect",implementationState:"IMPLEMENTED",accountEligible:true,projectMembershipEligible:false,rbacResult:"ALLOW",ownerBusinessGate:"NOT_EVALUATED",evaluatedAt:"2026-10-08T06:00:00Z",paths:[{assignmentId:id,roleVersionId:id,roleCode:"project-administrator",roleVersion:1,assignmentScope:scope,groupId:null,projectMembershipId:null,groupMembershipId:null,assignedBy:id,reason:"Independent assignment",assignedAt:"2026-10-07T06:00:00Z"}]};
type Planned={inspectAccess(i:unknown):Promise<IamResult<unknown>>;resolveOperation(id:string,s:unknown):Promise<IamResult<unknown>>;loadHistory(s:unknown):Promise<IamResult<unknown>>};
describe("Inspector is advisory not another mutation or authority model",()=>{
  it("canonical UUID identities match uppercase user input without accepting another target",async()=>{
    const lower="abcdef01-abcd-4abc-8abc-abcdefabcdef",upper=lower.toUpperCase(),s={kind:"PROJECT",organizationId:lower,projectId:lower};
    const client=createIamClient(async path=>path.endsWith("/csrf")?Response.json({headerName:"X-CSRF-TOKEN",token:"synthetic-csrf"}):path.includes("access-inspections")?Response.json({...value,actorId:lower,scope:s}):Response.json({operationId:lower,state:"UNRESOLVED"})) as unknown as Planned;
    expect((await client.inspectAccess({targetActorId:upper,scope:{kind:"PROJECT",organizationId:upper,projectId:upper},permissionCode:"access.inspect"})).kind).toBe("confirmed");
    expect((await client.resolveOperation(upper,{kind:"PROJECT",organizationId:upper,projectId:upper})).kind).toBe("confirmed");
  });
  it("invalid operation identity produces a bounded input refusal without making a request or rejecting",async()=>{
    const client=createIamClient(async()=>{throw new Error("Must not fetch invalid input");}) as unknown as Planned;
    expect(await client.resolveOperation("-".repeat(36),scope)).toEqual({kind:"refused",status:400});
  });
  it("preserves authored administration surface with explicitly unsupported independent Audit history",()=>{
    const html=renderToStaticMarkup(<AccessInspectionPage context={{actorId:id,accountId:id,organizationId:id,displayName:"Synthetic",organizationName:"Recorded Organization",actions:["access.inspect"]}} onInvalidated={()=>{}}/>);
    expect(html).toContain("admin-main-title");expect(html).toContain("admin-inspector");expect(html).toContain("Recorded Organization");expect(html).toContain("Chưa có quyền audit.read");expect(html).toContain('aria-label="Tra cứu operation"');
  });
  it("submits only the target and exact scope via ordinary session/CSRF and redacts unrecognized fields",async()=>{
    const input={targetActorId:id,scope,permissionCode:"access.inspect"};
    const client=createIamClient(async(path,init)=>{if(path.endsWith("/csrf"))return Response.json({headerName:"X-CSRF-TOKEN",token:"synthetic-csrf"});expect(path).toBe("/api/v1/administration/access-inspections");expect(init.credentials).toBe("same-origin");expect(JSON.parse(String(init.body))).toEqual(input);expect(init.headers).toHaveProperty("X-CSRF-TOKEN");return Response.json({...value,privateDiagnostic:"discard"});}) as unknown as Planned;
    const result=await client.inspectAccess(input);expect(result.kind).toBe("confirmed");expect(JSON.stringify(result)).not.toContain("discard");
  });
  it("a lost read-only inspection response is unavailable not an uncertain mutation and has no automatic retry",async()=>{
    let attempts=0;const client=createIamClient(async path=>{if(path.endsWith("/csrf"))return Response.json({headerName:"X-CSRF-TOKEN",token:"synthetic-csrf"});attempts++;throw new Error("Synthetic loss");}) as unknown as Planned;
    expect((await client.inspectAccess({targetActorId:id,scope,permissionCode:"access.inspect"})).kind).toBe("unavailable");expect(attempts).toBe(1);
  });
  it("wrong target or owner-gate claim cannot be accepted from malformed responses",async()=>{
    for(const v of [{...value,actorId:"00000000-0000-4000-8000-000000000999"},{...value,ownerBusinessGate:"PASSED"},{...value,paths:[{...value.paths[0],roleVersion:0}]}]){
      const client=createIamClient(async path=>path.endsWith("/csrf")?Response.json({headerName:"X-CSRF-TOKEN",token:"synthetic-csrf"}):Response.json(v)) as unknown as Planned;
      expect((await client.inspectAccess({targetActorId:id,scope,permissionCode:"access.inspect"})).kind).toBe("unavailable");
    }
  });
  it("operation lookup cannot label absence rollback or blindly replay a command",async()=>{
    const client=createIamClient(async(path,init)=>{expect(path).toBe(`/api/v1/administration/operations/${id}?organizationId=${id}`);expect(init.method).toBe("GET");return Response.json({operationId:id,state:"UNRESOLVED",owner:null,actorId:null,scope:null,action:null,outcome:null,reasonCode:null,correlationId:null,occurredAt:null,retryProfile:null});}) as unknown as Planned;
    expect(await client.resolveOperation(id,scope)).toEqual({kind:"confirmed",value:{operationId:id,state:"UNRESOLVED"}});
  });
  it("history 403 stays refused and does not infer audit authority from inspection",async()=>{
    const client=createIamClient(async()=>new Response(null,{status:403})) as unknown as Planned;
    expect(await client.loadHistory(scope)).toEqual({kind:"refused",status:403});
  });
  it("reads bounded actual history without retaining private fields or inventing missing prior state",async()=>{
    const client=createIamClient(async(path,init)=>{expect(path).toBe(`/api/v1/administration/history?organizationId=${id}&offset=0&limit=50`);expect(init.method).toBe("GET");return Response.json({items:[{operationId:id,owner:"ASSIGNMENT",actorId:id,scope,action:"role.assignment.grant",targetId:id,outcome:"ACCEPTED",reasonCode:null,reason:"Independent grant",correlationId:id,occurredAt:"2026-10-08T06:00:00Z",before:null,after:{assignmentId:id,roleCode:"account-administrator",roleVersion:2,password:"discard"},proof:"discard"}],offset:0,limit:50,hasMore:false});});
    const result=await client.loadHistory(scope as Parameters<typeof client.loadHistory>[0]);expect(result.kind).toBe("confirmed");expect(JSON.stringify(result)).toContain('"before":null');expect(JSON.stringify(result)).not.toContain("discard");
  });
});
