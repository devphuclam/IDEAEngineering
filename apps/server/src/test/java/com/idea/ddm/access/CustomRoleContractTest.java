package com.idea.ddm.access;

import static org.junit.jupiter.api.Assertions.*;
import com.idea.ddm.iam.IamIntegrationFixtures;
import com.idea.ddm.identity.IamSessionFixture;
import java.net.http.*;
import java.time.Instant;
import java.util.*;
import org.junit.jupiter.api.*;
import tools.jackson.databind.json.JsonMapper;

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class CustomRoleContractTest {
    final IamIntegrationFixtures rows=new IamIntegrationFixtures();
    final JsonMapper json=JsonMapper.builder().build();
    IamSessionFixture http;
    @BeforeAll void start()throws Exception{rows.createSchema();http=new IamSessionFixture(rows);}
    @AfterAll void stop(){if(http!=null)http.close();}
    @Test void eligibleDelegatePreparesAnActualCandidateWithoutActivatingOrGrantingIt()throws Exception{
        var delegate=rows.identity(IamIntegrationFixtures.Persona.PRA);
        http.withSignedInClient(delegate,(client,context)->{
            new AuthorizationPrerequisiteFixture(rows).actorAssignment(delegate,AuthorizationPrerequisiteFixture.PRA_V1,org(),Instant.parse("2026-10-07T05:59:59Z"),null);
            var response=post(client,"/api/v1/administration/roles/candidates",proposal());
            assertEquals(201,response.statusCode(),"Candidate must be the real Server owner operation");
            var candidate=json.readTree(response.body());
            assertEquals("CANDIDATE",candidate.path("state").asString());assertEquals(1,candidate.path("version").asInt());
            assertEquals("project.read",candidate.path("permissionCodes").get(0).asString());
            assertEquals("ORGANIZATION",candidate.path("managementScope").path("kind").asString());
            try(var c=rows.migrator();var q=c.createStatement();var r=q.executeQuery("SELECT count(*) FROM identity_role_version_profile WHERE definition_id='"+candidate.path("definitionId").asString()+"'")){r.next();assertEquals(0,r.getInt(1));}
            return null;
        });
    }
    @Test void validationActivationAndSuccessorPreserveExactPriorVersionAndAssignments()throws Exception{
        var delegate=rows.identity(IamIntegrationFixtures.Persona.PRA);var target=rows.identity(IamIntegrationFixtures.Persona.LINH);
        http.withSignedInClient(delegate,(client,context)->http.withSignedInClient(target,(unused,targetContext)->{
            new AuthorizationPrerequisiteFixture(rows).actorAssignment(delegate,AuthorizationPrerequisiteFixture.PRA_V1,org(),Instant.parse("2026-10-07T05:59:59Z"),null);
            var prepared=post(client,"/api/v1/administration/roles/candidates",proposal());assertEquals(201,prepared.statusCode());var candidate=json.readTree(prepared.body());var id=candidate.path("candidateId").asString();
            var validated=post(client,"/api/v1/administration/roles/candidates/"+id+"/validate",Map.of("scope",org(),"expectedVersion",1));
            assertEquals(200,validated.statusCode(),"Validation must be real, advisory and show exact difference");assertTrue(json.readTree(validated.body()).path("valid").asBoolean());
            var activated=post(client,"/api/v1/administration/roles/candidates/"+id+"/activate",activation(null));assertEquals(201,activated.statusCode());var v1=json.readTree(activated.body());assertEquals(1,v1.path("version").asInt());assertTrue(v1.path("selectable").asBoolean());
            var project=new com.idea.ddm.project.ProjectPrerequisiteFixture(rows).project(delegate);var projectScope=AuthorizationDecisionService.Scope.project(rows.organizationId(),project.projectId());
            var grant=post(client,"/api/v1/administration/assignments",Map.of("operationId",UUID.randomUUID(),"scope",projectScope,"principal",Map.of("kind","ACTOR","actorId",target.actorId()),"roleVersionId",v1.path("roleVersionId").asString(),"reason","Explicit independent version one assignment"));assertEquals(201,grant.statusCode());var assignment=json.readTree(grant.body());
            var successor=new HashMap<String,Object>(proposal());successor.remove("name");successor.put("definitionId",candidate.path("definitionId").asString());successor.put("baseVersionId",v1.path("roleVersionId").asString());successor.put("permissionCodes",List.of("project.read","role.catalogue.read"));successor.put("support",Map.of("scopeKinds",List.of("PROJECT"),"principalKinds",List.of("ACTOR")));
            var next=post(client,"/api/v1/administration/roles/candidates",successor);assertEquals(201,next.statusCode());var v2candidate=json.readTree(next.body());assertEquals("role.catalogue.read",v2candidate.path("difference").path("added").get(0).asString());
            var second=post(client,"/api/v1/administration/roles/candidates/"+v2candidate.path("candidateId").asString()+"/activate",activation(v1.path("roleVersionId").asString()));assertEquals(201,second.statusCode());var v2=json.readTree(second.body());assertEquals(2,v2.path("version").asInt());assertNotEquals(v1.path("roleVersionId"),v2.path("roleVersionId"));
            var old=client.send(HttpRequest.newBuilder(http.uri("/api/v1/administration/roles/"+candidate.path("definitionId").asString()+"/versions/1?organizationId="+rows.organizationId())).GET().build(),HttpResponse.BodyHandlers.ofString());assertEquals(v1,json.readTree(old.body()));
            var retained=client.send(HttpRequest.newBuilder(http.uri("/api/v1/administration/assignments/"+assignment.path("assignmentId").asString()+"?organizationId="+rows.organizationId()+"&projectId="+project.projectId())).GET().build(),HttpResponse.BodyHandlers.ofString());assertEquals(200,retained.statusCode());assertEquals(v1.path("roleVersionId"),json.readTree(retained.body()).path("roleVersionId"));assertEquals(1,json.readTree(retained.body()).path("version").asInt());return null;
        }));
    }
    Map<String,Object> activation(String base){var values=new HashMap<String,Object>();values.put("operationId",UUID.randomUUID());values.put("scope",org());values.put("expectedVersion",1);values.put("baseVersionId",base);values.put("reason","Explicit immutable activation");return values;}
    Map<String,Object> proposal(){return Map.of("operationId",UUID.randomUUID(),"scope",org(),"name","Synthetic participant role","permissionCodes",List.of("project.read"),"support",Map.of("scopeKinds",List.of("PROJECT"),"principalKinds",List.of("ACTOR","PROJECT_GROUP")),"reason","Explicit controlled candidate");}
    AuthorizationDecisionService.Scope org(){return AuthorizationDecisionService.Scope.organization(rows.organizationId());}
    HttpResponse<String> post(HttpClient client,String path,Object body)throws Exception{
        var csrf=client.send(HttpRequest.newBuilder(http.uri("/api/v1/identity/csrf")).GET().build(),HttpResponse.BodyHandlers.ofString());var token=json.readTree(csrf.body());
        return client.send(HttpRequest.newBuilder(http.uri(path)).header("Content-Type","application/json").header(token.path("headerName").asString(),token.path("token").asString()).POST(HttpRequest.BodyPublishers.ofString(json.writeValueAsString(body))).build(),HttpResponse.BodyHandlers.ofString());
    }
}
