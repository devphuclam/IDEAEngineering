import { describe, expect, it } from "vitest";
import { createIamClient, type IamResult } from "../../api/iamClient";
import { settledIamState } from "../iamIntegration/iamIntegrationState";

const id="00000000-0000-4000-8000-000000000046";
type PlannedClient={loadContext():Promise<IamResult<unknown>>;loadAccounts(filter?:string):Promise<IamResult<unknown>>;
  createAccount(input:{operationId:string;organizationId:string;displayName:string;login:string}):Promise<IamResult<unknown>>;
  issueProof(accountId:string,input:Record<string,unknown>):Promise<IamResult<unknown>>};

describe("Account Administration integration",()=>{
  it("loads recorded context through the ordinary session without client-authoritative Actor",async()=>{
    const client=createIamClient(async(path,init)=>{
      expect(path).toBe("/api/v1/administration/context");expect(new Headers(init.headers).has("ActorId")).toBe(false);
      return Response.json({actorId:id,accountId:id,organizationId:id,displayName:"Synthetic Actor",organizationName:"Synthetic Organization",actions:["account.read"]});
    }) as unknown as PlannedClient;
    expect((await client.loadContext()).kind).toBe("confirmed");
  });
  it("refusal is not an empty success or stale value",async()=>{
    const client=createIamClient(async()=>new Response(null,{status:403})) as unknown as PlannedClient;
    expect(settledIamState(await client.loadAccounts())).toEqual({kind:"refused",status:403});
  });
  it("authorized empty, unavailable and malformed directory stay distinct",async()=>{
    const empty=createIamClient(async()=>Response.json({items:[],offset:0,limit:50,hasMore:false})) as unknown as PlannedClient;
    expect((await empty.loadAccounts()).kind).toBe("confirmed");
    const malformed=createIamClient(async()=>Response.json({items:[{actorId:"forged"}]})) as unknown as PlannedClient;
    expect((await malformed.loadAccounts()).kind).toBe("unavailable");
  });
  it("create submits one existing contract request with fresh CSRF and no password or grant",async()=>{
    let sent=0;const client=createIamClient(async(path,init)=>{
      if(path==="/api/v1/identity/csrf")return Response.json({headerName:"X-CSRF-TOKEN",token:"synthetic-csrf"});
      sent++;expect(path).toBe("/api/v1/identity/accounts");expect(new Headers(init.headers).get("X-CSRF-TOKEN")).toBe("synthetic-csrf");
      expect(Object.keys(JSON.parse(String(init.body))).sort()).toEqual(["displayName","login","operationId","organizationId"]);
      return Response.json({actorId:id,accountId:id,loginIdentityId:id,status:"PENDING",securityVersion:1},{status:201});
    }) as unknown as PlannedClient;
    expect((await client.createAccount({operationId:id,organizationId:id,displayName:"Synthetic",login:"synthetic"})).kind).toBe("confirmed");expect(sent).toBe(1);
  });
  it("stale mutation and lost response never report success or auto-resubmit",async()=>{
    for(const status of [409,503]){
      let sent=0;const client=createIamClient(async(path)=>{
        if(path==="/api/v1/identity/csrf")return Response.json({headerName:"X-CSRF-TOKEN",token:"synthetic-csrf"});sent++;return new Response(null,{status});
      }) as unknown as PlannedClient;
      const result=await client.createAccount({operationId:id,organizationId:id,displayName:"Synthetic",login:"synthetic"});
      expect(result.kind).toBe(status===409?"stale":"unresolved");expect(sent).toBe(1);
    }
  });
  it("issuance requires exact target/login/purpose and no-store response before private handoff",async()=>{
    const client=createIamClient(async(path,init)=>{
      if(path==="/api/v1/identity/csrf")return Response.json({headerName:"X-CSRF-TOKEN",token:"synthetic-csrf"});
      expect(path).toBe(`/api/v1/identity/accounts/${id}/credential-proofs`);
      expect(JSON.parse(String(init.body)).loginIdentityId).toBe(id);
      return Response.json({proof:"a".repeat(43),expiresAt:"2026-10-07T06:15:00Z"},{headers:{"Cache-Control":"no-store"}});
    }) as unknown as PlannedClient;
    expect((await client.issueProof(id,{operationId:id,organizationId:id,loginIdentityId:id,purpose:"FIRST_SETUP",expectedSecurityVersion:1,reason:"Synthetic manual handoff"})).kind).toBe("confirmed");
  });
});
