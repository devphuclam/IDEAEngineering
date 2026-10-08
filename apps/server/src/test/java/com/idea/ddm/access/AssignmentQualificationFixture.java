package com.idea.ddm.access;

import static org.junit.jupiter.api.Assertions.*;
import com.idea.ddm.iam.IamIntegrationFixtures;
import com.idea.ddm.identity.IamSessionFixture;
import java.net.http.*;
import java.time.Instant;
import java.util.*;
import tools.jackson.databind.json.JsonMapper;

/** Named real HTTP identities and exact migration/fixture scope, not a raw Actor auth shortcut. */
final class AssignmentQualificationFixture implements AutoCloseable {
    final IamIntegrationFixtures rows=new IamIntegrationFixtures();
    final JsonMapper json=JsonMapper.builder().build();
    IamSessionFixture http;
    void start()throws Exception{rows.createSchema();http=new IamSessionFixture(rows);}
    @Override public void close(){if(http!=null)http.close();}
    AuthorizationDecisionService.Scope scope(){return AuthorizationDecisionService.Scope.organization(rows.organizationId());}
    UUID grant(IamIntegrationFixtures.Identity who,UUID role)throws Exception{return new AuthorizationPrerequisiteFixture(rows).actorAssignment(who,role,scope(),Instant.parse("2026-10-07T05:59:59Z"),null);}
    Map<String,Object> input(UUID target,UUID role){return Map.of("operationId",UUID.randomUUID(),"principal",Map.of("kind","ACTOR","actorId",target),"scope",scope(),"roleVersionId",role,"reason","Explicit synthetic assignment");}
    HttpResponse<String> post(HttpClient client,String path,Object input)throws Exception{
        var csrf=json.readTree(client.send(HttpRequest.newBuilder(http.uri("/api/v1/identity/csrf")).GET().build(),HttpResponse.BodyHandlers.ofString()).body());
        return client.send(HttpRequest.newBuilder(http.uri(path)).header("Content-Type","application/json").header(csrf.path("headerName").asString(),csrf.path("token").asString()).POST(HttpRequest.BodyPublishers.ofString(json.writeValueAsString(input))).build(),HttpResponse.BodyHandlers.ofString());
    }
    long count(String sql)throws Exception{try(var c=rows.app();var q=c.createStatement();var r=q.executeQuery(sql)){assertTrue(r.next());return r.getLong(1);}}
    void sql(String sql)throws Exception{try(var c=rows.migrator();var q=c.createStatement()){q.execute(sql);}}
}
