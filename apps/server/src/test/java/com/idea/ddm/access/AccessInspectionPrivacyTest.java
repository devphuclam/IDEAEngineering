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
    @BeforeEach void resetControlledTime(){f.http.advance(java.time.Duration.between(f.http.service(java.time.Clock.class).instant(),Instant.parse("2026-10-07T06:00:00Z")));}
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
    @Test void refusedProjectAttemptCannotRelabelLaterCommittedScope()throws Exception{
        var writer=f.rows.identity(IamIntegrationFixtures.Persona.PRA);var inspector=f.rows.identity(IamIntegrationFixtures.Persona.PRA);
        f.http.withSignedInClient(writer,(client,ctx)->f.http.withSignedInClient(inspector,(reader,rc)->{
            var projects=new com.idea.ddm.project.ProjectPrerequisiteFixture(f.rows);var a=projects.project(writer);var b=projects.project(writer);
            var scopeA=AuthorizationDecisionService.Scope.project(f.rows.organizationId(),a.projectId());var scopeB=AuthorizationDecisionService.Scope.project(f.rows.organizationId(),b.projectId());
            var roles=new AuthorizationPrerequisiteFixture(f.rows);var now=Instant.parse("2026-10-07T05:59:59Z");
            roles.actorAssignment(writer,AuthorizationPrerequisiteFixture.PA_V1,scopeB,now,null);roles.actorAssignment(inspector,AuthorizationPrerequisiteFixture.PA_V1,scopeA,now,null);roles.actorAssignment(inspector,AuthorizationPrerequisiteFixture.AUDIT_V1,scopeA,now,null);
            var op=UUID.randomUUID();
            assertEquals(403,f.post(client,"/api/v1/administration/projects/"+a.projectId()+"/update",Map.of("operationId",op,"scope",scopeA,"name","Denied A","expectedVersion",1,"reason","Synthetic refused attempt")).statusCode());
            f.http.advance(java.time.Duration.ofSeconds(1));
            assertEquals(200,f.post(client,"/api/v1/administration/projects/"+b.projectId()+"/update",Map.of("operationId",op,"scope",scopeB,"name","Committed B","expectedVersion",1,"reason","Synthetic committed attempt")).statusCode());
            long audit=f.count("SELECT count(*) FROM audit_evidence");
            var hidden=get(reader,operation(op)+"&projectId="+a.projectId());assertEquals(200,hidden.statusCode());assertEquals("UNRESOLVED",f.json.readTree(hidden.body()).path("state").asString(),"A reader must not see B through an earlier refused scope");
            var own=get(client,operation(op)+"&projectId="+b.projectId());assertEquals(200,own.statusCode());assertEquals("COMMITTED_ACCEPTED",f.json.readTree(own.body()).path("state").asString());assertEquals(b.projectId().toString(),f.json.readTree(own.body()).path("scope").path("projectId").asString());
            var history=get(reader,"/api/v1/administration/history?organizationId="+f.rows.organizationId()+"&projectId="+a.projectId());assertEquals(200,history.statusCode());assertEquals(0,f.json.readTree(history.body()).path("items").size(),"Denied A scope cannot reveal a later committed B owner result");assertEquals(audit,f.count("SELECT count(*) FROM audit_evidence"));return null;
        }));
    }
    @Test void refusedAssignmentAttemptCannotPoisonScopeLookupOrCanonicalReplay()throws Exception{
        var writer=f.rows.identity(IamIntegrationFixtures.Persona.PRA);var inspector=f.rows.identity(IamIntegrationFixtures.Persona.PRA);var target=f.rows.identity(IamIntegrationFixtures.Persona.LINH);
        f.http.withSignedInClient(writer,(client,ctx)->f.http.withSignedInClient(inspector,(reader,rc)->f.http.withSignedInClient(target,(unused,tc)->{
            var projects=new com.idea.ddm.project.ProjectPrerequisiteFixture(f.rows);var a=projects.project(writer);var b=projects.project(writer);
            var scopeA=AuthorizationDecisionService.Scope.project(f.rows.organizationId(),a.projectId());var scopeB=AuthorizationDecisionService.Scope.project(f.rows.organizationId(),b.projectId());
            var roles=new AuthorizationPrerequisiteFixture(f.rows);var now=Instant.parse("2026-10-07T05:59:59Z");
            var temporary=roles.actorAssignment(writer,AuthorizationPrerequisiteFixture.PA_V1,scopeA,now,null);roles.actorAssignment(inspector,AuthorizationPrerequisiteFixture.PA_V1,scopeA,now,null);roles.actorAssignment(inspector,AuthorizationPrerequisiteFixture.AUDIT_V1,scopeA,now,null);
            var op=UUID.randomUUID();var refused=Map.of("operationId",op,"principal",Map.of("kind","ACTOR","actorId",target.actorId()),"scope",scopeA,"roleVersionId",AuthorizationPrerequisiteFixture.AA_V3,"reason","Denied admin delegation");
            assertEquals(403,f.post(client,"/api/v1/administration/assignments",refused).statusCode());
            f.http.advance(java.time.Duration.ofSeconds(1));
            roles.actorAssignment(writer,AuthorizationPrerequisiteFixture.PRA_V1,scopeB,now,null);
            var accepted=Map.of("operationId",op,"principal",Map.of("kind","ACTOR","actorId",target.actorId()),"scope",scopeB,"roleVersionId",AuthorizationPrerequisiteFixture.PA_V1,"reason","Committed exact Project delegation");
            var first=f.post(client,"/api/v1/administration/assignments",accepted);assertEquals(201,first.statusCode());
            f.sql("UPDATE identity_role_assignment SET revoked_at='2026-10-07T06:00:00Z',ended_by='"+writer.actorId()+"',end_reason='Remove unrelated A authority',version=version+1 WHERE assignment_id='"+temporary+"'");
            long audit=f.count("SELECT count(*) FROM audit_evidence");
            var hidden=get(reader,operation(op)+"&projectId="+a.projectId());assertEquals(200,hidden.statusCode());assertEquals("UNRESOLVED",f.json.readTree(hidden.body()).path("state").asString());
            var replay=f.post(client,"/api/v1/administration/assignments",accepted);assertEquals(201,replay.statusCode(),"Replay must use the committed B scope, not the denied A scope");assertEquals(f.json.readTree(first.body()),f.json.readTree(replay.body()));
            var history=get(reader,"/api/v1/administration/history?organizationId="+f.rows.organizationId()+"&projectId="+a.projectId());assertEquals(200,history.statusCode());assertEquals(0,f.json.readTree(history.body()).path("items").size(),"Denied A scope cannot reveal a later committed B owner result");assertEquals(audit,f.count("SELECT count(*) FROM audit_evidence"));return null;
        })));
    }
    Map<String,Object> input(UUID actor,AuthorizationDecisionService.Scope scope){return Map.of("targetActorId",actor,"permissionCode","access.inspect","scope",scope);}
    String operation(UUID id){return "/api/v1/administration/operations/"+id+"?organizationId="+f.rows.organizationId();}
    HttpResponse<String> get(HttpClient c,String path)throws Exception{return c.send(HttpRequest.newBuilder(f.http.uri(path)).GET().build(),HttpResponse.BodyHandlers.ofString());}
    static Set<String> fields(tools.jackson.databind.JsonNode node){var keys=new HashSet<String>();node.properties().forEach(e->keys.add(e.getKey()));return keys;}
}
