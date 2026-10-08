package com.idea.ddm.access;

import static org.junit.jupiter.api.Assertions.*;
import com.idea.ddm.iam.IamIntegrationFixtures;
import java.util.*;
import org.junit.jupiter.api.*;

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class AccessInspectionContractTest {
    final CustomRoleQualificationFixture f=new CustomRoleQualificationFixture();
    @BeforeAll void start()throws Exception{f.start();}
    @AfterAll void stop(){f.close();}
    @Test void everyDirectAndGroupPathIsExplainedAndMembershipIsNotAdministrativeAuthority() throws Exception {
        {
            var admin=f.rows.identity(IamIntegrationFixtures.Persona.PRA);var member=f.rows.identity(IamIntegrationFixtures.Persona.LINH);
            f.http.withSignedInClient(admin,(client,ctx)->f.http.withSignedInClient(member,(unused,target)->{
                f.delegate(admin);var p=new com.idea.ddm.project.ProjectPrerequisiteFixture(f.rows);var project=p.project(admin);var group=p.group(project,admin);
                var now=java.time.Instant.parse("2026-10-07T05:59:59Z");var pm=p.projectMembership(project,member,now,null);var gm=p.groupMembership(group,member,now,null);
                var scope=AuthorizationDecisionService.Scope.project(f.rows.organizationId(),project.projectId());var a=new AuthorizationPrerequisiteFixture(f.rows);var role=a.participantRole(scope);
                var direct=a.actorAssignment(member,role,scope,now,null);var grouped=a.groupAssignment(admin,role,group,now,null);
                var response=f.post(client,"/api/v1/administration/access-inspections",Map.of("targetActorId",member.actorId(),"permissionCode","project.read","scope",scope));
                assertEquals(200,response.statusCode());var result=f.json.readTree(response.body());assertEquals("ALLOW",result.path("rbacResult").asString());assertEquals(2,result.path("paths").size());
                var ids=new HashSet<String>();for(var path:result.path("paths")){ids.add(path.path("assignmentId").asString());assertEquals(pm.toString(),path.path("projectMembershipId").asString());assertTrue(path.has("assignedBy"));assertEquals(role.toString(),path.path("roleVersionId").asString());if(!path.path("groupId").isNull())assertEquals(gm.toString(),path.path("groupMembershipId").asString());}assertEquals(Set.of(direct.toString(),grouped.toString()),ids);
                f.sql("UPDATE project_membership SET ended_at='2026-10-07T06:00:00Z',ended_by='"+admin.actorId()+"',end_reason='Synthetic end' WHERE membership_id='"+pm+"'");
                result=f.json.readTree(f.post(client,"/api/v1/administration/access-inspections",Map.of("targetActorId",member.actorId(),"permissionCode","project.read","scope",scope)).body());assertEquals("BLOCKED",result.path("rbacResult").asString());assertEquals(0,result.path("paths").size());assertFalse(result.path("projectMembershipEligible").asBoolean());
                a.actorAssignment(admin,AuthorizationPrerequisiteFixture.PA_V1,scope,now,null);
                result=f.json.readTree(f.post(client,"/api/v1/administration/access-inspections",Map.of("targetActorId",admin.actorId(),"permissionCode","project.admin.read","scope",scope)).body());assertEquals("ALLOW",result.path("rbacResult").asString());assertFalse(result.path("projectMembershipEligible").asBoolean());assertEquals("NOT_EVALUATED",result.path("ownerBusinessGate").asString());return null;
            }));
        }
    }
    @Test void committedProjectResultIsResolvedWithoutReplayAndAbsentResultIsNotRollback() throws Exception {
        {
            var admin=f.rows.identity(IamIntegrationFixtures.Persona.PRA);
            f.http.withSignedInClient(admin,(client,ctx)->{
                f.delegate(admin);new AuthorizationPrerequisiteFixture(f.rows).actorAssignment(admin,AuthorizationPrerequisiteFixture.PA_V1,f.scope(),java.time.Instant.parse("2026-10-07T05:59:59Z"),null);
                var operation=UUID.randomUUID();assertEquals(201,f.post(client,"/api/v1/administration/projects",Map.of("operationId",operation,"organizationId",f.rows.organizationId(),"name","Resolved synthetic project","reason","Actual owner result")).statusCode());
                var response=client.send(java.net.http.HttpRequest.newBuilder(f.http.uri("/api/v1/administration/operations/"+operation+"?organizationId="+f.rows.organizationId())).GET().build(),java.net.http.HttpResponse.BodyHandlers.ofString());
                assertEquals(200,response.statusCode(),"Actual owner resolution query must work");var result=f.json.readTree(response.body());assertEquals("COMMITTED_ACCEPTED",result.path("state").asString());assertEquals("PROJECT",result.path("owner").asString());assertEquals(admin.actorId().toString(),result.path("actorId").asString());assertEquals("SAME_ID_UNCHANGED_INPUT_ONLY",result.path("retryProfile").asString());
                var absent=client.send(java.net.http.HttpRequest.newBuilder(f.http.uri("/api/v1/administration/operations/"+UUID.randomUUID()+"?organizationId="+f.rows.organizationId())).GET().build(),java.net.http.HttpResponse.BodyHandlers.ofString());assertEquals(200,absent.statusCode());assertEquals("UNRESOLVED",f.json.readTree(absent.body()).path("state").asString());return null;
            });
        }
    }
    @Test void auditHistoryIsIndependentlyGatedAndDesignAuditIsNotAnExecutableGrant() throws Exception {
        {
            var admin=f.rows.identity(IamIntegrationFixtures.Persona.PRA);
            f.http.withSignedInClient(admin,(client,ctx)->{f.delegate(admin);
                var history=client.send(java.net.http.HttpRequest.newBuilder(f.http.uri("/api/v1/administration/history?organizationId="+f.rows.organizationId())).GET().build(),java.net.http.HttpResponse.BodyHandlers.ofString());assertEquals(409,history.statusCode(),"Even registered PRA audit.read stays unsupported, not unlocked");
                var inspect=f.post(client,"/api/v1/administration/access-inspections",Map.of("targetActorId",admin.actorId(),"permissionCode","audit.read","scope",f.scope()));assertEquals(200,inspect.statusCode());assertEquals("UNSUPPORTED",f.json.readTree(inspect.body()).path("rbacResult").asString());assertEquals("DESIGN",f.json.readTree(inspect.body()).path("implementationState").asString());return null;});
        }
    }
    @Test void actualHttpInspectionUsesCurrentAuthorityAndExactContributingVersion() throws Exception {
        {
            var who=f.rows.identity(IamIntegrationFixtures.Persona.PRA);
            f.http.withSignedInClient(who,(client,context)->{
                var assignment=f.delegate(who);
                var r=f.post(client,"/api/v1/administration/access-inspections",Map.of(
                        "targetActorId",who.actorId(),"scope",f.scope(),"permissionCode","access.inspect"));
                assertEquals(200,r.statusCode(),"Real authorized Inspector adapter must exist");
                var value=f.json.readTree(r.body());
                assertEquals("ALLOW",value.path("rbacResult").asString());
                assertEquals("NOT_EVALUATED",value.path("ownerBusinessGate").asString());
                assertEquals(who.actorId().toString(),value.path("actorId").asString());
                assertEquals(assignment.toString(),value.path("paths").get(0).path("assignmentId").asString());
                assertEquals("privileged-role-administrator",value.path("paths").get(0).path("roleCode").asString());
                assertEquals(1,value.path("paths").get(0).path("roleVersion").asInt());
                return null;
            });
        }
    }
    @Test void customTerminalResolutionAllowsIndependentInspectorButRechecksWithdrawnReadAuthority()throws Exception{
        var admin=f.rows.identity(IamIntegrationFixtures.Persona.PRA);var inspector=f.rows.identity(IamIntegrationFixtures.Persona.PRA);
        f.http.withSignedInClient(admin,(client,ctx)->f.http.withSignedInClient(inspector,(second,ic)->{
            f.delegate(admin);var grant=f.delegate(inspector);var input=f.proposal();var id=(UUID)input.get("operationId");assertEquals(201,f.post(client,"/api/v1/administration/roles/candidates",input).statusCode());
            var path="/api/v1/administration/operations/"+id+"?organizationId="+f.rows.organizationId();long before=f.count("SELECT count(*) FROM audit_evidence");
            for(var c:List.of(client,second)){var r=c.send(java.net.http.HttpRequest.newBuilder(f.http.uri(path)).GET().build(),java.net.http.HttpResponse.BodyHandlers.ofString());assertEquals(200,r.statusCode());assertEquals("ROLE_DEFINITION",f.json.readTree(r.body()).path("owner").asString());assertEquals(admin.actorId().toString(),f.json.readTree(r.body()).path("actorId").asString());}assertEquals(before,f.count("SELECT count(*) FROM audit_evidence"));
            f.sql("UPDATE identity_role_assignment SET revoked_at='2026-10-07T06:00:00Z',ended_by='"+admin.actorId()+"',end_reason='Withdraw query authority',version=version+1 WHERE assignment_id='"+grant+"'");
            assertEquals(403,second.send(java.net.http.HttpRequest.newBuilder(f.http.uri(path)).GET().build(),java.net.http.HttpResponse.BodyHandlers.ofString()).statusCode());
            var refused=new HashMap<String,Object>(f.proposal());refused.put("permissionCodes",List.of("audit.read"));assertEquals(409,f.post(client,"/api/v1/administration/roles/candidates",refused).statusCode());var r=client.send(java.net.http.HttpRequest.newBuilder(f.http.uri("/api/v1/administration/operations/"+refused.get("operationId")+"?organizationId="+f.rows.organizationId())).GET().build(),java.net.http.HttpResponse.BodyHandlers.ofString());assertEquals(200,r.statusCode());assertEquals("COMMITTED_REFUSED",f.json.readTree(r.body()).path("state").asString());return null;
        }));
    }
}
