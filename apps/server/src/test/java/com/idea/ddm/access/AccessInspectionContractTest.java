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
    @Test void auditHistoryIsIndependentlyGatedAndReturnsActualAttributableChanges() throws Exception {
        {
            var admin=f.rows.identity(IamIntegrationFixtures.Persona.PRA);
            f.http.withSignedInClient(admin,(client,ctx)->{f.delegate(admin);
                new AuthorizationPrerequisiteFixture(f.rows).actorAssignment(admin,AuthorizationPrerequisiteFixture.PA_V1,f.scope(),java.time.Instant.parse("2026-10-07T05:59:59Z"),null);
                var operation=UUID.randomUUID();assertEquals(201,f.post(client,"/api/v1/administration/projects",Map.of("operationId",operation,"organizationId",f.rows.organizationId(),"name","History synthetic project","reason","Attributable creation")).statusCode());
                long before=f.count("SELECT count(*) FROM audit_evidence");
                var history=client.send(java.net.http.HttpRequest.newBuilder(f.http.uri("/api/v1/administration/history?organizationId="+f.rows.organizationId()+"&limit=1")).GET().build(),java.net.http.HttpResponse.BodyHandlers.ofString());assertEquals(200,history.statusCode(),"Qualified independent audit.read must return retained history");
                var page=f.json.readTree(history.body());assertEquals(1,page.path("items").size());var row=page.path("items").get(0);assertEquals(operation.toString(),row.path("operationId").asString());assertEquals(admin.actorId().toString(),row.path("actorId").asString());assertEquals("ACCEPTED",row.path("outcome").asString());assertTrue(row.path("reason").isNull(),"Legacy Project result did not retain the input reason; never fabricate it");assertEquals("History synthetic project",row.path("after").path("name").asString());assertTrue(row.path("before").isNull());assertEquals(before,f.count("SELECT count(*) FROM audit_evidence"));
                var inspect=f.post(client,"/api/v1/administration/access-inspections",Map.of("targetActorId",admin.actorId(),"permissionCode","audit.read","scope",f.scope()));assertEquals(200,inspect.statusCode());assertEquals("ALLOW",f.json.readTree(inspect.body()).path("rbacResult").asString());assertEquals("IMPLEMENTED",f.json.readTree(inspect.body()).path("implementationState").asString());return null;});
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
    @Test void historyReadAuthorityIsIndependentScopedRevocableAndBounded()throws Exception{
        var writer=f.rows.identity(IamIntegrationFixtures.Persona.PRA);var reader=f.rows.identity(IamIntegrationFixtures.Persona.LINH);
        f.http.withSignedInClient(writer,(client,ctx)->f.http.withSignedInClient(reader,(view,rc)->{
            f.delegate(writer);var roles=new AuthorizationPrerequisiteFixture(f.rows);roles.actorAssignment(writer,AuthorizationPrerequisiteFixture.PA_V1,f.scope(),java.time.Instant.parse("2026-10-07T05:59:59Z"),null);
            var audit=roles.actorAssignment(reader,AuthorizationPrerequisiteFixture.AUDIT_V1,f.scope(),java.time.Instant.parse("2026-10-07T05:59:59Z"),null);
            var op=UUID.randomUUID();assertEquals(201,f.post(client,"/api/v1/administration/projects",Map.of("operationId",op,"organizationId",f.rows.organizationId(),"name","Independent reader project","reason","Synthetic independent history")).statusCode());
            String path="/api/v1/administration/history?organizationId="+f.rows.organizationId();long before=f.count("SELECT count(*) FROM audit_evidence");
            var get=view.send(java.net.http.HttpRequest.newBuilder(f.http.uri(path)).GET().build(),java.net.http.HttpResponse.BodyHandlers.ofString());assertEquals(200,get.statusCode());assertTrue(f.json.readTree(get.body()).path("items").valueStream().anyMatch(v->v.path("operationId").asString().equals(op.toString())));
            assertEquals(403,f.post(view,"/api/v1/administration/access-inspections",Map.of("targetActorId",writer.actorId(),"permissionCode","access.inspect","scope",f.scope())).statusCode());
            assertEquals(403,view.send(java.net.http.HttpRequest.newBuilder(f.http.uri("/api/v1/administration/history?organizationId="+UUID.randomUUID())).GET().build(),java.net.http.HttpResponse.BodyHandlers.discarding()).statusCode());
            assertEquals(400,view.send(java.net.http.HttpRequest.newBuilder(f.http.uri(path+"&limit=101")).GET().build(),java.net.http.HttpResponse.BodyHandlers.discarding()).statusCode());
            var empty=view.send(java.net.http.HttpRequest.newBuilder(f.http.uri(path+"&targetId="+UUID.randomUUID())).GET().build(),java.net.http.HttpResponse.BodyHandlers.ofString());assertEquals(200,empty.statusCode());assertEquals(0,f.json.readTree(empty.body()).path("items").size());assertEquals(before,f.count("SELECT count(*) FROM audit_evidence"));
            f.sql("UPDATE identity_role_assignment SET revoked_at='2026-10-07T06:00:00Z',ended_by='"+writer.actorId()+"',end_reason='Withdraw independent history permission',version=version+1 WHERE assignment_id='"+audit+"'");
            assertEquals(403,view.send(java.net.http.HttpRequest.newBuilder(f.http.uri(path)).GET().build(),java.net.http.HttpResponse.BodyHandlers.discarding()).statusCode());return null;
        }));
    }
    @Test void replacementHistoryPreservesSafeBeforeAfterAndPagingWithoutPrivateIdentityData()throws Exception{
        var admin=f.rows.identity(IamIntegrationFixtures.Persona.SUPER);var target=f.rows.identity(IamIntegrationFixtures.Persona.LINH);
        f.http.withSignedInClient(admin,(client,ctx)->f.http.withSignedInClient(target,(unused,tc)->{
            new AuthorizationPrerequisiteFixture(f.rows).actorAssignment(admin,AuthorizationPrerequisiteFixture.SUPER_V2,f.scope(),java.time.Instant.parse("2026-10-07T05:59:59Z"),null);
            var grant=f.post(client,"/api/v1/administration/assignments",Map.of("operationId",UUID.randomUUID(),"scope",f.scope(),"principal",Map.of("kind","ACTOR","actorId",target.actorId()),"roleVersionId",AuthorizationPrerequisiteFixture.AA_V1,"reason","History predecessor"));assertEquals(201,grant.statusCode());var id=f.json.readTree(grant.body()).path("assignmentId").asString();var op=UUID.randomUUID();
            assertEquals(200,f.post(client,"/api/v1/administration/assignments/"+id+"/replace",Map.of("operationId",op,"scope",f.scope(),"expectedVersion",1,"newRoleVersionId",AuthorizationPrerequisiteFixture.AA_V2,"reason","Explicit history successor")).statusCode());
            String path="/api/v1/administration/history?organizationId="+f.rows.organizationId()+"&targetId="+id+"&limit=1";long before=f.count("SELECT count(*) FROM audit_evidence");
            var response=client.send(java.net.http.HttpRequest.newBuilder(f.http.uri(path)).GET().build(),java.net.http.HttpResponse.BodyHandlers.ofString());assertEquals(200,response.statusCode());var page=f.json.readTree(response.body());assertEquals(1,page.path("items").size());var row=page.path("items").get(0);assertEquals(op.toString(),row.path("operationId").asString());assertEquals(1,row.path("before").path("roleVersion").asInt());assertEquals(2,row.path("after").path("roleVersion").asInt());assertEquals("Explicit history successor",row.path("reason").asString());assertNotEquals(id,row.path("after").path("assignmentId").asString());
            for(String secret:List.of("passwordVerifier","normalizedLogin","proof","sessionProof","csrf"))assertFalse(response.body().contains(secret));
            var next=client.send(java.net.http.HttpRequest.newBuilder(f.http.uri(path+"&offset=1")).GET().build(),java.net.http.HttpResponse.BodyHandlers.ofString());assertEquals(200,next.statusCode());assertEquals(0,f.json.readTree(next.body()).path("items").size());assertEquals(before,f.count("SELECT count(*) FROM audit_evidence"));return null;
        }));
    }
    @Test void customTerminalResolutionAllowsIndependentInspectorButRechecksWithdrawnReadAuthority()throws Exception{
        var admin=f.rows.identity(IamIntegrationFixtures.Persona.PRA);var inspector=f.rows.identity(IamIntegrationFixtures.Persona.PRA);
        f.http.withSignedInClient(admin,(client,ctx)->f.http.withSignedInClient(inspector,(second,ic)->{
            f.delegate(admin);var grant=f.delegate(inspector);var input=f.proposal();var id=(UUID)input.get("operationId");assertEquals(201,f.post(client,"/api/v1/administration/roles/candidates",input).statusCode());
            var path="/api/v1/administration/operations/"+id+"?organizationId="+f.rows.organizationId();long before=f.count("SELECT count(*) FROM audit_evidence");
            for(var c:List.of(client,second)){var r=c.send(java.net.http.HttpRequest.newBuilder(f.http.uri(path)).GET().build(),java.net.http.HttpResponse.BodyHandlers.ofString());assertEquals(200,r.statusCode());assertEquals("ROLE_DEFINITION",f.json.readTree(r.body()).path("owner").asString());assertEquals(admin.actorId().toString(),f.json.readTree(r.body()).path("actorId").asString());}assertEquals(before,f.count("SELECT count(*) FROM audit_evidence"));
            f.sql("UPDATE identity_role_assignment SET revoked_at='2026-10-07T06:00:00Z',ended_by='"+admin.actorId()+"',end_reason='Withdraw query authority',version=version+1 WHERE assignment_id='"+grant+"'");
            assertEquals(403,second.send(java.net.http.HttpRequest.newBuilder(f.http.uri(path)).GET().build(),java.net.http.HttpResponse.BodyHandlers.ofString()).statusCode());
            var refused=new HashMap<String,Object>(f.proposal());refused.put("permissionCodes",List.of("role.assignment.manage.highest"));assertEquals(409,f.post(client,"/api/v1/administration/roles/candidates",refused).statusCode());var r=client.send(java.net.http.HttpRequest.newBuilder(f.http.uri("/api/v1/administration/operations/"+refused.get("operationId")+"?organizationId="+f.rows.organizationId())).GET().build(),java.net.http.HttpResponse.BodyHandlers.ofString());assertEquals(200,r.statusCode());assertEquals("COMMITTED_REFUSED",f.json.readTree(r.body()).path("state").asString());return null;
        }));
    }
}
