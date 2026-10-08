package com.idea.ddm.access;

import static org.junit.jupiter.api.Assertions.*;
import com.idea.ddm.iam.IamIntegrationFixtures;
import com.idea.ddm.identity.IamSessionFixture;
import java.net.http.*;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;
import org.junit.jupiter.api.*;
import tools.jackson.databind.json.JsonMapper;

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class RoleAssignmentContractTest {
    final IamIntegrationFixtures fixtures=new IamIntegrationFixtures();
    final JsonMapper json=JsonMapper.builder().build();
    IamSessionFixture http;
    @BeforeAll void start()throws Exception{fixtures.createSchema();http=new IamSessionFixture(fixtures);}
    @AfterAll void stop(){if(http!=null)http.close();}
    @Test void authorizedCatalogueUsesExactVersionIdentityAndDoesNotPromoteDesignContent()throws Exception{
        var admin=fixtures.identity(IamIntegrationFixtures.Persona.SUPER);
        http.withSignedInClient(admin,(client,context)->{
            new AuthorizationPrerequisiteFixture(fixtures).actorAssignment(admin,AuthorizationPrerequisiteFixture.SUPER_V2,
                    AuthorizationDecisionService.Scope.organization(admin.organizationId()),Instant.parse("2026-10-07T05:59:59Z"),null);
            var response=client.send(HttpRequest.newBuilder(http.uri("/api/v1/administration/roles?organizationId="+admin.organizationId())).GET().build(),HttpResponse.BodyHandlers.ofString());
            assertEquals(200,response.statusCode(),"Wizard needs the real qualified catalogue HTTP adapter");
            var items=json.readTree(response.body()).path("items");
            assertEquals(8,items.size());
            var aa3=items.valueStream().filter(row->row.path("roleVersionId").asString().equals(AuthorizationPrerequisiteFixture.AA_V3.toString())).findFirst().orElseThrow();
            assertEquals("account-administrator",aa3.path("roleCode").asString());
            assertEquals(3,aa3.path("version").asInt());assertTrue(aa3.path("selectable").asBoolean());
            var pra=items.valueStream().filter(row->row.path("roleVersionId").asString().equals(AuthorizationPrerequisiteFixture.PRA_V1.toString())).findFirst().orElseThrow();
            assertFalse(pra.path("selectable").asBoolean(),"Custom publication is still DESIGN, not grantable through this slice");
            return null;
        });
    }
    @Test void previewAndIndependentExactAssignmentsAreRealAtomicOwnerCommands()throws Exception{
        var admin=fixtures.identity(IamIntegrationFixtures.Persona.SUPER);var target=fixtures.identity(IamIntegrationFixtures.Persona.LINH);
        http.withSignedInClient(admin,(client,context)->http.withSignedInClient(target,(unused,targetContext)->{
            grant(admin,AuthorizationPrerequisiteFixture.SUPER_V2,org());
            var input=grantInput(target.actorId(),AuthorizationPrerequisiteFixture.AA_V3,org());
            var preview=post(client,"/api/v1/administration/assignments/preview",input);assertEquals(200,preview.statusCode());
            assertTrue(json.readTree(preview.body()).path("allowed").asBoolean());
            assertEquals(0,count("SELECT count(*) FROM identity_role_assignment WHERE principal_actor_id='"+target.actorId()+"'"));
            var result=post(client,"/api/v1/administration/assignments",input);assertEquals(201,result.statusCode());
            assertEquals(AuthorizationPrerequisiteFixture.AA_V3.toString(),json.readTree(result.body()).path("roleVersionId").asString());
            assertEquals(target.actorId().toString(),json.readTree(result.body()).path("principal").path("actorId").asString());
            assertEquals(201,post(client,"/api/v1/administration/assignments",grantInput(target.actorId(),AuthorizationPrerequisiteFixture.PA_V1,org())).statusCode());
            assertEquals(2,count("SELECT count(*) FROM identity_role_assignment WHERE principal_actor_id='"+target.actorId()+"' AND revoked_at IS NULL"));
            var op=input.get("operationId");
            assertEquals(1,count("SELECT count(*) FROM access_policy_owner_outcome WHERE operation_id='"+op+"' AND outcome='ACCEPTED'"));
            assertEquals(1,count("SELECT count(*) FROM audit_evidence WHERE operation_id='"+op+"' AND outcome='ACCEPTED'"));
            assertEquals(2,count("SELECT count(*) FROM assignment_authorization_evidence WHERE operation_id='"+op+"'"));return null;
        }));
    }
    AuthorizationDecisionService.Scope org(){return AuthorizationDecisionService.Scope.organization(fixtures.organizationId());}
    void grant(IamIntegrationFixtures.Identity identity,UUID role,AuthorizationDecisionService.Scope scope)throws Exception{new AuthorizationPrerequisiteFixture(fixtures).actorAssignment(identity,role,scope,Instant.parse("2026-10-07T05:59:59Z"),null);}
    Map<String,Object> grantInput(UUID target,UUID role,AuthorizationDecisionService.Scope scope){return Map.of("operationId",UUID.randomUUID(),"principal",Map.of("kind","ACTOR","actorId",target),"scope",scope,"roleVersionId",role,"reason","Explicit synthetic assignment");}
    long count(String sql)throws Exception{try(var c=fixtures.app();var q=c.createStatement();var r=q.executeQuery(sql)){assertTrue(r.next());return r.getLong(1);}}
    HttpResponse<String> get(HttpClient client,String path)throws Exception{return client.send(HttpRequest.newBuilder(http.uri(path)).GET().build(),HttpResponse.BodyHandlers.ofString());}
    HttpResponse<String> post(HttpClient client,String path,Object body)throws Exception{
        var csrf=json.readTree(get(client,"/api/v1/identity/csrf").body());
        return client.send(HttpRequest.newBuilder(http.uri(path)).header("Content-Type","application/json").header(csrf.path("headerName").asString(),csrf.path("token").asString()).POST(HttpRequest.BodyPublishers.ofString(json.writeValueAsString(body))).build(),HttpResponse.BodyHandlers.ofString());
    }
}
