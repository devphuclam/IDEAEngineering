package com.idea.ddm.access;
import com.idea.ddm.iam.IamIntegrationFixtures;
import com.idea.ddm.identity.IamSessionFixture;
import java.net.http.*;
import java.time.Instant;
import java.util.*;
import tools.jackson.databind.json.JsonMapper;
import static org.junit.jupiter.api.Assertions.*;

/** Named synthetic prerequisites and actual HTTP only, never a publication bypass. */
final class CustomRoleQualificationFixture implements AutoCloseable {
    final IamIntegrationFixtures rows=new IamIntegrationFixtures();final JsonMapper json=JsonMapper.builder().build();IamSessionFixture http;
    void start()throws Exception{rows.createSchema();http=new IamSessionFixture(rows);}
    public void close(){if(http!=null)http.close();}
    AuthorizationDecisionService.Scope scope(){return AuthorizationDecisionService.Scope.organization(rows.organizationId());}
    UUID delegate(IamIntegrationFixtures.Identity actor)throws Exception{return new AuthorizationPrerequisiteFixture(rows).actorAssignment(actor,AuthorizationPrerequisiteFixture.PRA_V1,scope(),Instant.parse("2026-10-07T05:59:59Z"),null);}
    Map<String,Object> proposal(){return new HashMap<>(Map.of("operationId",UUID.randomUUID(),"scope",scope(),"name","Synthetic Custom","permissionCodes",List.of("project.read"),"support",Map.of("scopeKinds",List.of("PROJECT"),"principalKinds",List.of("ACTOR","PROJECT_GROUP")),"reason","Synthetic bounded proposal"));}
    Map<String,Object> activation(){var m=new HashMap<String,Object>();m.put("operationId",UUID.randomUUID());m.put("scope",scope());m.put("expectedVersion",1);m.put("baseVersionId",null);m.put("reason","Synthetic immutable activation");return m;}
    tools.jackson.databind.JsonNode prepare(HttpClient c)throws Exception{var r=post(c,"/api/v1/administration/roles/candidates",proposal());assertEquals(201,r.statusCode());return json.readTree(r.body());}
    String activatePath(tools.jackson.databind.JsonNode c){return "/api/v1/administration/roles/candidates/"+c.path("candidateId").asString()+"/activate";}
    HttpResponse<String> post(HttpClient c,String path,Object input)throws Exception{var r=c.send(HttpRequest.newBuilder(http.uri("/api/v1/identity/csrf")).GET().build(),HttpResponse.BodyHandlers.ofString());var token=json.readTree(r.body());return c.send(HttpRequest.newBuilder(http.uri(path)).header("Content-Type","application/json").header(token.path("headerName").asString(),token.path("token").asString()).POST(HttpRequest.BodyPublishers.ofString(json.writeValueAsString(input))).build(),HttpResponse.BodyHandlers.ofString());}
    void sql(String sql)throws Exception{try(var c=rows.migrator();var q=c.createStatement()){q.execute(sql);}}
    long count(String sql)throws Exception{try(var c=rows.app();var q=c.createStatement();var r=q.executeQuery(sql)){assertTrue(r.next());return r.getLong(1);}}
}
