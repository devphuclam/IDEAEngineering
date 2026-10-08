package com.idea.ddm.access;

import static org.junit.jupiter.api.Assertions.*;
import com.idea.ddm.iam.IamIntegrationFixtures;
import com.idea.ddm.identity.IamSessionFixture;
import java.net.http.*;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;
import java.util.HashMap;
import com.idea.ddm.project.ProjectPrerequisiteFixture;
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
            var previewInput=new HashMap<>(input);previewInput.remove("operationId");previewInput.remove("reason");
            var preview=post(client,"/api/v1/administration/assignments/preview",previewInput);assertEquals(200,preview.statusCode());
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
    @Test void canonicalRetryChangedInputAndDifferentActorDoNotDuplicateOrDisclose()throws Exception{
        var admin=fixtures.identity(IamIntegrationFixtures.Persona.SUPER);var other=fixtures.identity(IamIntegrationFixtures.Persona.SUPER);var target=fixtures.identity(IamIntegrationFixtures.Persona.LINH);
        http.withSignedInClient(admin,(client,ctx)->http.withSignedInClient(other,(second,c2)->http.withSignedInClient(target,(unused,c3)->{
            grant(admin,AuthorizationPrerequisiteFixture.SUPER_V2,org());grant(other,AuthorizationPrerequisiteFixture.SUPER_V2,org());
            var input=grantInput(target.actorId(),AuthorizationPrerequisiteFixture.AA_V2,org());var op=input.get("operationId");
            var first=post(client,"/api/v1/administration/assignments",input);assertEquals(201,first.statusCode());
            var repeat=post(client,"/api/v1/administration/assignments",input);assertEquals(201,repeat.statusCode());assertEquals(json.readTree(first.body()),json.readTree(repeat.body()));
            var changed=new HashMap<>(input);changed.put("roleVersionId",AuthorizationPrerequisiteFixture.AA_V3);assertEquals(409,post(client,"/api/v1/administration/assignments",changed).statusCode());
            var refused=post(second,"/api/v1/administration/assignments",input);assertEquals(403,refused.statusCode());assertFalse(refused.body().contains(target.actorId().toString()));
            assertEquals(1,count("SELECT count(*) FROM audit_evidence WHERE operation_id='"+op+"'"));assertEquals(2,count("SELECT count(*) FROM assignment_authorization_evidence WHERE operation_id='"+op+"'"));return null;
        })));
    }
    @Test void endReplaceAndRegrantRetainHistoryWithNewIdsAndExpectedVersions()throws Exception{
        var admin=fixtures.identity(IamIntegrationFixtures.Persona.SUPER);var target=fixtures.identity(IamIntegrationFixtures.Persona.LINH);
        http.withSignedInClient(admin,(client,ctx)->http.withSignedInClient(target,(unused,c2)->{
            grant(admin,AuthorizationPrerequisiteFixture.SUPER_V2,org());
            var first=post(client,"/api/v1/administration/assignments",grantInput(target.actorId(),AuthorizationPrerequisiteFixture.AA_V1,org()));assertEquals(201,first.statusCode());var id=json.readTree(first.body()).path("assignmentId").asString();
            var input=Map.of("operationId",UUID.randomUUID(),"scope",org(),"expectedVersion",1,"newRoleVersionId",AuthorizationPrerequisiteFixture.AA_V2,"reason","Explicit successor replacement");
            var replacement=post(client,"/api/v1/administration/assignments/"+id+"/replace",input);assertEquals(200,replacement.statusCode());
            var value=json.readTree(replacement.body());var successor=value.path("successor").path("assignmentId").asString();assertNotEquals(id,successor);assertEquals(2,value.path("predecessor").path("version").asLong());assertFalse(value.path("predecessor").path("revokedAt").isNull());
            assertEquals(409,post(client,"/api/v1/administration/assignments/"+successor+"/end",Map.of("operationId",UUID.randomUUID(),"scope",org(),"expectedVersion",2,"reason","Stale expected version")).statusCode());
            assertEquals(200,post(client,"/api/v1/administration/assignments/"+successor+"/end",Map.of("operationId",UUID.randomUUID(),"scope",org(),"expectedVersion",1,"reason","Explicit revoke")).statusCode());
            var regrant=post(client,"/api/v1/administration/assignments",grantInput(target.actorId(),AuthorizationPrerequisiteFixture.AA_V2,org()));assertEquals(201,regrant.statusCode());assertNotEquals(successor,json.readTree(regrant.body()).path("assignmentId").asString());
            var list=get(client,"/api/v1/administration/assignments?organizationId="+fixtures.organizationId()+"&actorId="+target.actorId());assertEquals(200,list.statusCode());assertEquals(3,json.readTree(list.body()).path("items").size());return null;
        }));
    }
    @Test void groupPrincipalIsNotAnActorFilterAndRequiresActualParticipantMembership()throws Exception{
        var admin=fixtures.identity(IamIntegrationFixtures.Persona.PA_PROJECT);var member=fixtures.identity(IamIntegrationFixtures.Persona.LINH);
        http.withSignedInClient(admin,(client,ctx)->http.withSignedInClient(member,(participant,c2)->{
            var rows=new ProjectPrerequisiteFixture(fixtures);var project=rows.project(admin);var group=rows.group(project,admin);var scope=AuthorizationDecisionService.Scope.project(fixtures.organizationId(),project.projectId());
            grant(admin,AuthorizationPrerequisiteFixture.PA_V1,scope);var role=new AuthorizationPrerequisiteFixture(fixtures).participantRole(scope);
            var input=Map.of("operationId",UUID.randomUUID(),"scope",scope,"principal",Map.of("kind","PROJECT_GROUP","groupId",group.groupId()),"roleVersionId",role,"reason","Explicit business Group grant");
            var response=post(client,"/api/v1/administration/assignments",input);assertEquals(201,response.statusCode());assertTrue(json.readTree(response.body()).path("principal").path("actorId").isNull());
            assertEquals(403,get(participant,"/api/v1/projects/"+project.projectId()).statusCode());
            rows.projectMembership(project,member,Instant.parse("2026-10-07T05:59:59Z"),null);assertEquals(403,get(participant,"/api/v1/projects/"+project.projectId()).statusCode());
            rows.groupMembership(group,member,Instant.parse("2026-10-07T05:59:59Z"),null);assertEquals(200,get(participant,"/api/v1/projects/"+project.projectId()).statusCode());
            var actorGrant=post(client,"/api/v1/administration/assignments",grantInput(member.actorId(),role,scope));assertEquals(201,actorGrant.statusCode());assertEquals(member.actorId().toString(),json.readTree(actorGrant.body()).path("principal").path("actorId").asString());
            var wrong=new HashMap<String,Object>(input);wrong.put("operationId",UUID.randomUUID());wrong.put("scope",org());assertEquals(403,post(client,"/api/v1/administration/assignments",wrong).statusCode());
            assertEquals(0,count("SELECT count(*) FROM identity_role_assignment WHERE principal_actor_id='"+admin.actorId()+"' AND role_version_id='"+role+"'"));return null;
        }));
    }
    @Test void delegationCannotCombineScopesOrSelfElevateAndDesignRolesAreNotGrantable()throws Exception{
        var delegate=fixtures.identity(IamIntegrationFixtures.Persona.PRA);var target=fixtures.identity(IamIntegrationFixtures.Persona.LINH);
        http.withSignedInClient(delegate,(client,ctx)->http.withSignedInClient(target,(unused,c2)->{
            grant(delegate,AuthorizationPrerequisiteFixture.PRA_V1,org());
            assertEquals(403,post(client,"/api/v1/administration/assignments",grantInput(delegate.actorId(),AuthorizationPrerequisiteFixture.AA_V3,org())).statusCode(),"Only exact Super→AA self-grant is allowed, not PRA→AA");
            assertEquals(403,post(client,"/api/v1/administration/assignments",grantInput(target.actorId(),AuthorizationPrerequisiteFixture.SUPER_V1,org())).statusCode());
            assertEquals(201,post(client,"/api/v1/administration/assignments",grantInput(target.actorId(),AuthorizationPrerequisiteFixture.AA_V3,org())).statusCode());
            var project=new ProjectPrerequisiteFixture(fixtures).project(delegate);var narrow=fixtures.identity(IamIntegrationFixtures.Persona.PRA);
            return http.withSignedInClient(narrow,(scoped,c3)->{
                grant(narrow,AuthorizationPrerequisiteFixture.PRA_V1,AuthorizationDecisionService.Scope.project(fixtures.organizationId(),project.projectId()));
                grant(narrow,AuthorizationPrerequisiteFixture.PA_V1,org());
                assertEquals(403,post(scoped,"/api/v1/administration/assignments",grantInput(target.actorId(),AuthorizationPrerequisiteFixture.AA_V2,org())).statusCode(),"Broad unrelated PA path cannot broaden a narrow PRA delegation");return null;
            });
        }));
    }
    @Test void ordinarySessionCsrfWrongScopeAndUnsupportedConditionFailClosed()throws Exception{
        var ordinary=fixtures.identity(IamIntegrationFixtures.Persona.ORDINARY);
        assertEquals(401,get(HttpClient.newHttpClient(),"/api/v1/administration/roles?organizationId="+fixtures.organizationId()).statusCode());
        http.withSignedInClient(ordinary,(client,ctx)->{
            assertEquals(403,get(client,"/api/v1/administration/assignments?organizationId="+fixtures.organizationId()).statusCode());
            assertEquals(403,client.send(HttpRequest.newBuilder(http.uri("/api/v1/administration/assignments")).header("Content-Type","application/json").POST(HttpRequest.BodyPublishers.ofString("{}")).build(),HttpResponse.BodyHandlers.discarding()).statusCode());
            assertEquals(403,post(client,"/api/v1/administration/assignments",grantInput(ordinary.actorId(),AuthorizationPrerequisiteFixture.AA_V3,org())).statusCode());
            grant(ordinary,AuthorizationPrerequisiteFixture.SUPER_V2,org());
            var bad=new HashMap<>(grantInput(ordinary.actorId(),AuthorizationPrerequisiteFixture.AA_V3,org()));bad.put("condition",Map.of("script","not supported"));assertEquals(400,post(client,"/api/v1/administration/assignments",bad).statusCode());
            assertEquals(403,get(client,"/api/v1/administration/assignments?organizationId="+UUID.randomUUID()).statusCode());
            assertEquals(400,get(client,"/api/v1/administration/roles?organizationId="+fixtures.organizationId()+"&limit=101").statusCode());return null;
        });
    }
    @Test void exactVersionAvailabilityAndHalfOpenIntervalsAreNotNameBased()throws Exception{
        var admin=fixtures.identity(IamIntegrationFixtures.Persona.SUPER);var target=fixtures.identity(IamIntegrationFixtures.Persona.LINH);
        http.withSignedInClient(admin,(client,ctx)->http.withSignedInClient(target,(unused,c2)->{
            grant(admin,AuthorizationPrerequisiteFixture.SUPER_V2,org());
            assertEquals(409,post(client,"/api/v1/administration/assignments",grantInput(target.actorId(),AuthorizationPrerequisiteFixture.PRA_V1,org())).statusCode());
            assertEquals(409,post(client,"/api/v1/administration/assignments",grantInput(target.actorId(),AuthorizationPrerequisiteFixture.AUDIT_V1,org())).statusCode());
            var exact=get(client,"/api/v1/administration/roles/9d80f77e-85a6-4c12-a72d-8ef6b7e0b002/versions/3?organizationId="+fixtures.organizationId());assertEquals(200,exact.statusCode());assertEquals(AuthorizationPrerequisiteFixture.AA_V3.toString(),json.readTree(exact.body()).path("roleVersionId").asString());
            var timed=new HashMap<>(grantInput(target.actorId(),AuthorizationPrerequisiteFixture.AA_V1,org()));timed.put("interval",Map.of("effectiveFrom","2026-10-07T05:59:59Z","effectiveUntil","2026-10-07T06:00:00Z"));
            var expired=post(client,"/api/v1/administration/assignments",timed);assertEquals(201,expired.statusCode());assertFalse(json.readTree(expired.body()).path("effective").asBoolean(),"At effectiveUntil the interval no longer grants");
            var invalid=new HashMap<>(grantInput(target.actorId(),AuthorizationPrerequisiteFixture.AA_V2,org()));invalid.put("interval",Map.of("effectiveFrom","2026-10-07T06:01:00Z","effectiveUntil","2026-10-07T06:01:00Z"));assertEquals(400,post(client,"/api/v1/administration/assignments",invalid).statusCode());return null;
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
