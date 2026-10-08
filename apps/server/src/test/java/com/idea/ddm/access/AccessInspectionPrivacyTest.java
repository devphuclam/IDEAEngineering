package com.idea.ddm.access;

import static org.junit.jupiter.api.Assertions.*;
import com.idea.ddm.iam.IamIntegrationFixtures;
import java.net.http.*;
import java.time.Instant;
import java.util.*;
import org.junit.jupiter.api.*;

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class AccessInspectionPrivacyTest {
    final CustomRoleQualificationFixture f=new CustomRoleQualificationFixture();
    @BeforeAll void start()throws Exception{f.start();}@AfterAll void stop(){f.close();}
    @Test void callerAuthorityScopeAndCsrfAreCheckedWithoutTargetDisclosure()throws Exception{
        var ordinary=f.rows.identity(IamIntegrationFixtures.Persona.ORDINARY);
        f.http.withSignedInClient(ordinary,(client,ctx)->{
            var result=f.post(client,"/api/v1/administration/access-inspections",input(ordinary.actorId(),f.scope()));assertEquals(403,result.statusCode());assertEquals(Set.of("reasonCode","correlationId"),fields(f.json.readTree(result.body())));
            assertEquals(403,get(client,"/api/v1/administration/history?organizationId="+f.rows.organizationId()).statusCode());return null;
        });
        var admin=f.rows.identity(IamIntegrationFixtures.Persona.PRA);
        f.http.withSignedInClient(admin,(client,ctx)->{f.delegate(admin);
            var wrong=f.post(client,"/api/v1/administration/access-inspections",input(admin.actorId(),AuthorizationDecisionService.Scope.organization(UUID.randomUUID())));assertEquals(403,wrong.statusCode());
            var missing=f.post(client,"/api/v1/administration/access-inspections",input(UUID.randomUUID(),f.scope()));assertEquals(404,missing.statusCode());assertEquals(Set.of("reasonCode","correlationId"),fields(f.json.readTree(missing.body())));
            var noCsrf=client.send(HttpRequest.newBuilder(f.http.uri("/api/v1/administration/access-inspections")).header("Content-Type","application/json").POST(HttpRequest.BodyPublishers.ofString(f.json.writeValueAsString(input(admin.actorId(),f.scope())))).build(),HttpResponse.BodyHandlers.ofString());assertEquals(403,noCsrf.statusCode());return null;
        });
    }
    @Test void disabledTargetIsBlockedAndRevokedCallerCannotInspect()throws Exception{
        var admin=f.rows.identity(IamIntegrationFixtures.Persona.PRA);var target=f.rows.identity(IamIntegrationFixtures.Persona.LINH);
        f.http.withSignedInClient(admin,(client,ctx)->f.http.withSignedInClient(target,(unused,tc)->{
            f.delegate(admin);f.delegate(target);f.sql("UPDATE idea_account SET status='DISABLED' WHERE actor_id='"+target.actorId()+"'");
            var response=f.post(client,"/api/v1/administration/access-inspections",input(target.actorId(),f.scope()));assertEquals(200,response.statusCode());var result=f.json.readTree(response.body());assertEquals("BLOCKED",result.path("rbacResult").asString());assertFalse(result.path("accountEligible").asBoolean());assertEquals(0,result.path("paths").size());
            assertEquals(Set.of("actorId","scope","permissionCode","implementationState","accountEligible","projectMembershipEligible","rbacResult","ownerBusinessGate","evaluatedAt","paths"),fields(result));
            f.sql("UPDATE session_record SET revoked_at='2026-10-07T06:00:00Z' WHERE actor_id='"+admin.actorId()+"' AND revoked_at IS NULL");assertEquals(401,f.post(client,"/api/v1/administration/access-inspections",input(target.actorId(),f.scope())).statusCode());return null;
        }));
    }
    @Test void legacyIamLookupIsMetadataOnlyAndAnotherReadAuthorizedActorCannotLearnItsResult()throws Exception{
        var admin=f.rows.identity(IamIntegrationFixtures.Persona.AA_V3);var other=f.rows.identity(IamIntegrationFixtures.Persona.AA_V3);
        f.http.withSignedInClient(admin,(client,ctx)->f.http.withSignedInClient(other,(second,oc)->{
            var a=new AuthorizationPrerequisiteFixture(f.rows);var now=Instant.parse("2026-10-07T05:59:59Z");a.actorAssignment(admin,AuthorizationPrerequisiteFixture.AA_V3,f.scope(),now,null);a.actorAssignment(other,AuthorizationPrerequisiteFixture.AA_V3,f.scope(),now,null);
            var id=UUID.randomUUID();assertEquals(201,f.post(client,"/api/v1/identity/accounts",Map.of("operationId",id,"organizationId",f.rows.organizationId(),"displayName","Synthetic metadata target","login","lookup."+UUID.randomUUID())).statusCode());
            var own=get(client,operation(id));assertEquals(200,own.statusCode());var value=f.json.readTree(own.body());assertEquals("COMMITTED_ACCEPTED",value.path("state").asString());assertEquals("METADATA_ONLY_NO_SAFE_REPLAY",value.path("retryProfile").asString());assertFalse(value.has("result"));
            var denied=get(second,operation(id));assertEquals(200,denied.statusCode());var unknown=get(second,operation(UUID.randomUUID()));var d=f.json.readTree(denied.body());var u=f.json.readTree(unknown.body());assertEquals("UNRESOLVED",d.path("state").asString());for(String key:List.of("owner","actorId","scope","action","outcome","reasonCode","correlationId","occurredAt","retryProfile")){assertTrue(d.path(key).isNull());assertEquals(d.path(key),u.path(key));}return null;
        }));
    }
    Map<String,Object> input(UUID actor,AuthorizationDecisionService.Scope scope){return Map.of("targetActorId",actor,"permissionCode","access.inspect","scope",scope);}
    String operation(UUID id){return "/api/v1/administration/operations/"+id+"?organizationId="+f.rows.organizationId();}
    HttpResponse<String> get(HttpClient c,String path)throws Exception{return c.send(HttpRequest.newBuilder(f.http.uri(path)).GET().build(),HttpResponse.BodyHandlers.ofString());}
    static Set<String> fields(tools.jackson.databind.JsonNode node){var keys=new HashSet<String>();node.properties().forEach(e->keys.add(e.getKey()));return keys;}
}
