import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { CredentialRedemptionPage } from "./CredentialRedemptionPage";
import { CredentialProofHandoff } from "./CredentialProofHandoff";
import { createIamClient } from "../../api/iamClient";

const id="00000000-0000-4000-8000-000000000046";
describe("Recipient boundary and intentional handoff",()=>{
  it("provides manual proof/password controls, not an encoded URL or admin password field",()=>{
    const html=renderToStaticMarkup(<CredentialRedemptionPage/>);
    expect(html).toContain('name="proof"');expect(html).toContain('type="password"');expect(html).toContain('autoComplete="new-password"');
    expect(html).not.toMatch(/<input[^>]+name="(?:proof|password|confirmation)"[^>]+value=/);expect(html).not.toContain('localStorage');
  });
  it("handoff proof is only an intentionally private masked control, never a link parameter",()=>{
    const html=renderToStaticMarkup(<CredentialProofHandoff delivery={{proof:"a".repeat(43),expiresAt:"2026-10-07T06:15:00Z"}} accountId={id} loginIdentityId={id} purpose="FIRST_SETUP" onClear={()=>{}}/>);
    expect(html).toContain('type="password"');expect(html).toContain('readOnly=""');expect(html).toContain('href="#credentials"');
    expect(html).not.toContain('?proof=');expect(html).not.toContain('name="password"');
  });
  it("recipient submits proof authority plus fresh CSRF, without Account Administrator context",async()=>{
    const client=createIamClient(async(path,init)=>{
      if(path==="/api/v1/identity/csrf")return Response.json({headerName:"X-CSRF-TOKEN",token:"synthetic-csrf"});
      expect(path).toBe("/api/v1/identity/credentials");expect(new Headers(init.headers).has("ActorId")).toBe(false);
      expect(Object.keys(JSON.parse(String(init.body))).sort()).toEqual(["accountId","operationId","password","proof","purpose"]);
      return new Response(null,{status:204});
    });
    expect(await client.redeemCredential({operationId:id,accountId:id,purpose:"RESET",proof:"a".repeat(43),password:"synthetic new password"})).toEqual({kind:"confirmed",value:undefined});
  });
  it("refused one-use proof and response loss never become successful redemption",async()=>{
    for(const status of [400,503]){let submitted=0;const client=createIamClient(async(path)=>{
      if(path==="/api/v1/identity/csrf")return Response.json({headerName:"X-CSRF-TOKEN",token:"synthetic-csrf"});submitted++;return new Response(null,{status});
    });
      const result=await client.redeemCredential({operationId:id,accountId:id,purpose:"FIRST_SETUP",proof:"a".repeat(43),password:"synthetic new password"});
      expect(result.kind).toBe(status===400?"refused":"unresolved");expect(submitted).toBe(1);expect(JSON.stringify(result)).not.toContain("synthetic new password");
    }
  });
});
