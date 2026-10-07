package com.idea.ddm.identity;

import static org.junit.jupiter.api.Assertions.*;
import com.idea.ddm.iam.IamIntegrationFixtures;
import com.idea.ddm.access.AuthorizationPrerequisiteFixture;
import com.idea.ddm.access.AuthorizationDecisionService;
import java.net.http.*;
import java.time.Instant;
import java.util.UUID;
import org.junit.jupiter.api.*;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.json.JsonMapper;

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class IdentityAccountUiContractTest {
    private final IamIntegrationFixtures fixtures=new IamIntegrationFixtures();
    private final AuthorizationPrerequisiteFixture roles=new AuthorizationPrerequisiteFixture(fixtures);
    private final JsonMapper json=JsonMapper.builder().build();
    private IamSessionFixture http;
    @BeforeAll void start()throws Exception{fixtures.createSchema();http=new IamSessionFixture(fixtures,true);}
    @AfterAll void stop(){if(http!=null)http.close();}
    @Test void contextUsesRecordedCurrentIdentityNotCallerHeadersOrFallbackProfile()throws Exception{
        var who=fixtures.identity(IamIntegrationFixtures.Persona.ORDINARY);
        http.withSignedInClient(who,(client,context)->{
            var response=get(client,"/api/v1/administration/context?actorId="+UUID.randomUUID());assertEquals(200,response.statusCode());
            var value=json.readTree(response.body());assertEquals(who.actorId().toString(),value.path("actorId").asString());
            assertEquals(who.organizationId().toString(),value.path("organizationId").asString());assertEquals(who.displayName(),value.path("displayName").asString());
            assertEquals(0,value.path("actions").size());return null;
        });
    }
    @Test void ordinaryAndLegacyAccountAdministratorDoNotReceiveDirectoryReadImplicitly()throws Exception{
        for(var role:new UUID[]{null,AuthorizationPrerequisiteFixture.AA_V1,AuthorizationPrerequisiteFixture.AA_V2,AuthorizationPrerequisiteFixture.SUPER_V2}){
            var who=fixtures.identity(IamIntegrationFixtures.Persona.ORDINARY);
            http.withSignedInClient(who,(client,context)->{
                if(role!=null)grant(who,role);
                var response=get(client,"/api/v1/administration/accounts");assertEquals(403,response.statusCode());
                assertFalse(response.body().contains(who.login()));assertFalse(response.body().contains("items"));return null;
            });
        }
    }
    @Test void authorizedDirectoryDetailContainsExactSiblingLoginIdsButNoVerifiersOrProofs()throws Exception{
        var who=fixtures.identity(IamIntegrationFixtures.Persona.AA_V3);
        http.withSignedInClient(who,(client,context)->{
            grant(who,AuthorizationPrerequisiteFixture.AA_V3);
            var sibling=UUID.randomUUID();execute("INSERT INTO login_identity(login_identity_id,account_id,login_identifier,normalized_login_identifier,password_verifier) VALUES (?,?,?,?,NULL)",sibling,who.accountId(),"sibling-"+sibling,"sibling-"+sibling);
            var response=get(client,"/api/v1/administration/accounts/"+who.accountId());assertEquals(200,response.statusCode());
            var value=json.readTree(response.body());assertEquals(2,value.path("loginIdentities").size());
            assertFalse(response.body().contains("password"));assertFalse(response.body().contains("verifier"));assertFalse(response.body().contains("proof"));
            assertEquals(400,get(client,"/api/v1/administration/accounts?limit=101").statusCode());
            var empty=get(client,"/api/v1/administration/accounts?filter=exact-no-match-"+UUID.randomUUID());assertEquals(200,empty.statusCode());
            assertEquals(0,json.readTree(empty.body()).path("items").size());return null;
        });
    }
    @Test void wrongScopeAndMissingTargetAreNonDisclosing()throws Exception{
        var who=fixtures.identity(IamIntegrationFixtures.Persona.AA_V3);
        http.withSignedInClient(who,(client,context)->{grant(who,AuthorizationPrerequisiteFixture.AA_V3);
            assertEquals(403,get(client,"/api/v1/administration/accounts?organizationId="+UUID.randomUUID()).statusCode());
            assertEquals(404,get(client,"/api/v1/administration/accounts/"+UUID.randomUUID()).statusCode());return null;});
    }
    @Test void createPendingThenManualExactSetupAndAnonymousProofRedemptionActivatesWithoutImplicitAccess()throws Exception{
        var who=fixtures.identity(IamIntegrationFixtures.Persona.AA_V3);
        http.withSignedInClient(who,(client,context)->{grant(who,AuthorizationPrerequisiteFixture.AA_V3);
            var created=post(client,"/api/v1/identity/accounts",json.writeValueAsString(java.util.Map.of("operationId",UUID.randomUUID(),"organizationId",who.organizationId(),"displayName","Synthetic recipient","login","recipient-"+UUID.randomUUID())));
            assertEquals(201,created.statusCode());var account=json.readTree(created.body());assertEquals("PENDING",account.path("status").asString());
            var target=UUID.fromString(account.path("accountId").asString());var login=UUID.fromString(account.path("loginIdentityId").asString());
            var invalid=post(client,"/api/v1/identity/accounts/"+target+"/credential-proofs",proofRequest(who,target,UUID.randomUUID(),"FIRST_SETUP",1));assertEquals(403,invalid.statusCode());
            var issued=post(client,"/api/v1/identity/accounts/"+target+"/credential-proofs",proofRequest(who,target,login,"FIRST_SETUP",1));assertEquals(200,issued.statusCode());
            assertTrue(issued.headers().firstValue("Cache-Control").orElse("").contains("no-store"));
            var proof=json.readTree(issued.body()).path("proof").asString(); // Never assert/retain plaintext content.
            var anonymous=HttpClient.newBuilder().cookieHandler(new java.net.CookieManager(null,java.net.CookiePolicy.ACCEPT_ALL)).build();
            var redemption=json.writeValueAsString(java.util.Map.of("operationId",UUID.randomUUID(),"accountId",target,"purpose","FIRST_SETUP","proof",proof,"password",UUID.randomUUID().toString()));
            assertEquals(204,post(anonymous,"/api/v1/identity/credentials",redemption).statusCode());
            assertEquals(400,post(anonymous,"/api/v1/identity/credentials",redemption).statusCode());
            var detail=json.readTree(get(client,"/api/v1/administration/accounts/"+target).body());assertEquals("ACTIVE",detail.path("status").asString());assertEquals(2,detail.path("securityVersion").asLong());
            assertEquals(0,count("SELECT count(*) FROM identity_role_assignment WHERE principal_actor_id=?",UUID.fromString(account.path("actorId").asString())));
            return null;});
    }
    @Test void accountTransitionsKeepStableIdsAndRejectStaleVersion()throws Exception{
        var who=fixtures.identity(IamIntegrationFixtures.Persona.AA_V3);
        http.withSignedInClient(who,(client,context)->{grant(who,AuthorizationPrerequisiteFixture.AA_V3);
            var created=json.readTree(post(client,"/api/v1/identity/accounts",json.writeValueAsString(java.util.Map.of("operationId",UUID.randomUUID(),"organizationId",who.organizationId(),"displayName","Synthetic lifecycle","login","life-"+UUID.randomUUID()))).body());
            var target=created.path("accountId").asString();
            var change=json.writeValueAsString(java.util.Map.of("operationId",UUID.randomUUID(),"organizationId",who.organizationId(),"expectedSecurityVersion",1,"reason","Synthetic disable"));
            var disabled=post(client,"/api/v1/identity/accounts/"+target+"/disable",change);assertEquals(200,disabled.statusCode());assertEquals("DISABLED",json.readTree(disabled.body()).path("status").asString());
            assertEquals(409,post(client,"/api/v1/identity/accounts/"+target+"/re-enable",change).statusCode());
            var enabled=post(client,"/api/v1/identity/accounts/"+target+"/re-enable",json.writeValueAsString(java.util.Map.of("operationId",UUID.randomUUID(),"organizationId",who.organizationId(),"expectedSecurityVersion",2,"reason","Synthetic re-enable")));
            assertEquals(200,enabled.statusCode());var value=json.readTree(enabled.body());assertEquals("PENDING",value.path("status").asString());assertEquals(created.path("actorId").asString(),value.path("actorId").asString());assertEquals(target,value.path("accountId").asString());return null;});
    }
    private void grant(IamIntegrationFixtures.Identity who,UUID role)throws Exception{roles.actorAssignment(who,role,AuthorizationDecisionService.Scope.organization(who.organizationId()),Instant.parse("2026-10-07T05:59:59Z"),null);}
    private String proofRequest(IamIntegrationFixtures.Identity who,UUID target,UUID login,String purpose,long version)throws Exception{return json.writeValueAsString(java.util.Map.of("operationId",UUID.randomUUID(),"organizationId",who.organizationId(),"loginIdentityId",login,"purpose",purpose,"expectedSecurityVersion",version,"reason","Synthetic private handoff"));}
    private HttpResponse<String> get(HttpClient client,String path)throws Exception{return client.send(HttpRequest.newBuilder(http.uri(path)).GET().build(),HttpResponse.BodyHandlers.ofString());}
    private HttpResponse<String> post(HttpClient client,String path,String body)throws Exception{var csrf=json.readTree(get(client,"/api/v1/identity/csrf").body());return client.send(HttpRequest.newBuilder(http.uri(path)).header("Content-Type","application/json").header(csrf.path("headerName").asString(),csrf.path("token").asString()).POST(HttpRequest.BodyPublishers.ofString(body)).build(),HttpResponse.BodyHandlers.ofString());}
    private void execute(String sql,Object... args)throws Exception{try(var c=fixtures.migrator();var q=c.prepareStatement(sql)){for(int i=0;i<args.length;i++)q.setObject(i+1,args[i]);q.execute();}}
    private long count(String sql,Object... args)throws Exception{try(var c=fixtures.app();var q=c.prepareStatement(sql)){for(int i=0;i<args.length;i++)q.setObject(i+1,args[i]);try(var r=q.executeQuery()){assertTrue(r.next());return r.getLong(1);}}}
}
