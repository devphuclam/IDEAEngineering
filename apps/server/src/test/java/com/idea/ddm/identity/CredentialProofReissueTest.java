package com.idea.ddm.identity;

import static org.junit.jupiter.api.Assertions.*;
import com.idea.ddm.iam.IamIntegrationFixtures;
import com.idea.ddm.access.AuthorizationPrerequisiteFixture;
import com.idea.ddm.access.AuthorizationDecisionService;
import java.net.http.*;
import java.time.Instant;
import java.util.UUID;
import org.junit.jupiter.api.*;
import tools.jackson.databind.json.JsonMapper;

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class CredentialProofReissueTest {
    private final IamIntegrationFixtures fixtures=new IamIntegrationFixtures();
    private final JsonMapper json=JsonMapper.builder().build();private IamSessionFixture http;
    @BeforeAll void start()throws Exception{fixtures.createSchema();http=new IamSessionFixture(fixtures,true);}
    @AfterAll void stop(){if(http!=null)http.close();}
    private record Target(UUID account,UUID login){}
    @Test void explicitNewOperationSupersedesOnlyUnconsumedExactLoginProofOnCommit()throws Exception{
        withAdmin((client,who)->{var target=create(client,who);var first=issue(client,who,target);var second=issue(client,who,target);
            assertEquals(400,redeem(client,target,first).statusCode());assertEquals(204,redeem(client,target,second).statusCode());return null;});
    }
    @Test void siblingLoginProofRemainsUnsuperseded()throws Exception{
        withAdmin((client,who)->{var target=create(client,who);var sibling=UUID.randomUUID();
            execute("INSERT INTO login_identity(login_identity_id,account_id,login_identifier,normalized_login_identifier,password_verifier) VALUES (?,?,?,?,NULL)",sibling,target.account,"other-"+sibling,"other-"+sibling);
            var first=issue(client,who,target);var other=issue(client,who,new Target(target.account,sibling));var second=issue(client,who,target);
            try(var c=fixtures.app();var q=c.prepareStatement("SELECT count(*) FROM credential_setup_proof WHERE account_id=? AND login_identity_id=? AND superseded_at IS NULL AND consumed_at IS NULL")){
                q.setObject(1,target.account);q.setObject(2,sibling);try(var row=q.executeQuery()){assertTrue(row.next());assertEquals(1,row.getLong(1));}}
            assertEquals(400,redeem(client,target,first).statusCode());assertEquals(204,redeem(client,target,second).statusCode());
            assertNotNull(other);return null;});
    }
    @Test void requiredAuditFailureRestoresOldProofAndDoesNotLeaveNewIssuance()throws Exception{
        withAdmin((client,who)->{var target=create(client,who);var first=issue(client,who,target);
            execute("CREATE FUNCTION suppress_setup_audit() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN IF NEW.action='account.credential.setup.issue' THEN RETURN NULL; END IF; RETURN NEW; END $$");
            execute("CREATE TRIGGER suppress_setup_audit BEFORE INSERT ON audit_evidence FOR EACH ROW EXECUTE FUNCTION suppress_setup_audit()");
            try{assertEquals(503,issueResponse(client,who,target).statusCode());}
            finally{execute("DROP TRIGGER suppress_setup_audit ON audit_evidence");}
            assertEquals(204,redeem(client,target,first).statusCode());return null;});
    }
    private interface Work{Void run(HttpClient client,IamIntegrationFixtures.Identity who)throws Exception;}
    private void withAdmin(Work work)throws Exception{var who=fixtures.identity(IamIntegrationFixtures.Persona.AA_V3);http.withSignedInClient(who,(client,context)->{
        new AuthorizationPrerequisiteFixture(fixtures).actorAssignment(who,AuthorizationPrerequisiteFixture.AA_V3,AuthorizationDecisionService.Scope.organization(who.organizationId()),Instant.parse("2026-10-07T05:59:59Z"),null);
        return work.run(client,who);});}
    private Target create(HttpClient client,IamIntegrationFixtures.Identity who)throws Exception{
        var response=post(client,"/api/v1/identity/accounts",json.writeValueAsString(java.util.Map.of("operationId",UUID.randomUUID(),"organizationId",who.organizationId(),"displayName","Synthetic reissue target","login","reissue-"+UUID.randomUUID())));assertEquals(201,response.statusCode());
        var body=json.readTree(response.body());return new Target(UUID.fromString(body.path("accountId").asString()),UUID.fromString(body.path("loginIdentityId").asString()));
    }
    private String issue(HttpClient client,IamIntegrationFixtures.Identity who,Target target)throws Exception{var response=issueResponse(client,who,target);assertEquals(200,response.statusCode());return json.readTree(response.body()).path("proof").asString();}
    private HttpResponse<String> issueResponse(HttpClient client,IamIntegrationFixtures.Identity who,Target target)throws Exception{return post(client,"/api/v1/identity/accounts/"+target.account+"/credential-proofs",json.writeValueAsString(java.util.Map.of("operationId",UUID.randomUUID(),"organizationId",who.organizationId(),"purpose","FIRST_SETUP","loginIdentityId",target.login,"expectedSecurityVersion",1,"reason","Explicit synthetic reissue")));}
    private HttpResponse<String> redeem(HttpClient client,Target target,String proof)throws Exception{return post(client,"/api/v1/identity/credentials",json.writeValueAsString(java.util.Map.of("operationId",UUID.randomUUID(),"accountId",target.account,"purpose","FIRST_SETUP","proof",proof,"password",UUID.randomUUID().toString())));}
    private HttpResponse<String> post(HttpClient client,String path,String body)throws Exception{var csrf=json.readTree(client.send(HttpRequest.newBuilder(http.uri("/api/v1/identity/csrf")).GET().build(),HttpResponse.BodyHandlers.ofString()).body());return client.send(HttpRequest.newBuilder(http.uri(path)).header("Content-Type","application/json").header(csrf.path("headerName").asString(),csrf.path("token").asString()).POST(HttpRequest.BodyPublishers.ofString(body)).build(),HttpResponse.BodyHandlers.ofString());}
    private void execute(String sql,Object... args)throws Exception{try(var c=fixtures.migrator();var q=c.prepareStatement(sql)){for(int i=0;i<args.length;i++)q.setObject(i+1,args[i]);q.execute();}}
}
