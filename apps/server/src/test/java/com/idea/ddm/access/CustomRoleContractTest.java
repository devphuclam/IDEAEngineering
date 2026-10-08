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
    Map<String,Object> proposal(){return Map.of("operationId",UUID.randomUUID(),"scope",org(),"name","Synthetic participant role","permissionCodes",List.of("project.read"),"support",Map.of("scopeKinds",List.of("PROJECT"),"principalKinds",List.of("ACTOR","PROJECT_GROUP")),"reason","Explicit controlled candidate");}
    AuthorizationDecisionService.Scope org(){return AuthorizationDecisionService.Scope.organization(rows.organizationId());}
    HttpResponse<String> post(HttpClient client,String path,Object body)throws Exception{
        var csrf=client.send(HttpRequest.newBuilder(http.uri("/api/v1/identity/csrf")).GET().build(),HttpResponse.BodyHandlers.ofString());var token=json.readTree(csrf.body());
        return client.send(HttpRequest.newBuilder(http.uri(path)).header("Content-Type","application/json").header(token.path("headerName").asString(),token.path("token").asString()).POST(HttpRequest.BodyPublishers.ofString(json.writeValueAsString(body))).build(),HttpResponse.BodyHandlers.ofString());
    }
}
