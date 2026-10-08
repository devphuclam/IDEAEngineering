package com.idea.ddm.project;

import static org.junit.jupiter.api.Assertions.*;
import com.idea.ddm.access.AuthorizationDecisionService;
import com.idea.ddm.access.AuthorizationPrerequisiteFixture;
import com.idea.ddm.iam.IamIntegrationFixtures;
import com.idea.ddm.identity.IamSessionFixture;
import java.net.http.*;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;
import org.junit.jupiter.api.*;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.json.JsonMapper;

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class ProjectGovernanceHttpContractTest {
    final IamIntegrationFixtures fixtures = new IamIntegrationFixtures();
    final JsonMapper json = JsonMapper.builder().build();
    IamSessionFixture http;
    @BeforeAll void start() throws Exception { fixtures.createSchema(); http = new IamSessionFixture(fixtures); }
    @AfterAll void stop() { if (http != null) http.close(); }

    @Test void organizationAdministratorCreatesAndReadsProjectWithoutImplicitParticipation() throws Exception {
        var admin = fixtures.identity(IamIntegrationFixtures.Persona.PA_ORGANIZATION);
        http.withSignedInClient(admin, (client, context) -> {
            grant(admin, AuthorizationDecisionService.Scope.organization(admin.organizationId()));
            var response = post(client, "/api/v1/administration/projects", Map.of(
                    "operationId", UUID.randomUUID(), "organizationId", admin.organizationId(),
                    "name", "Synthetic owned Project", "reason", "Explicit synthetic Project creation"));
            assertEquals(201, response.statusCode(), "Approved Project create must be an actual HTTP owner command");
            var result = json.readTree(response.body());
            assertEquals("Synthetic owned Project", result.path("name").asString());
            assertEquals(1, result.path("version").asLong());
            var project = UUID.fromString(result.path("projectId").asString());
            assertEquals(200, get(client, "/api/v1/administration/projects/" + project).statusCode());
            assertEquals(403, get(client, "/api/v1/projects/" + project).statusCode(), "Administration is not engineering participation");
            try (var c = fixtures.app(); var q = c.prepareStatement(
                    "SELECT (SELECT count(*) FROM project_membership WHERE project_id=?),"
                    + "(SELECT count(*) FROM identity_role_assignment WHERE project_id=?)")) {
                q.setObject(1, project); q.setObject(2, project);
                try (var row = q.executeQuery()) { assertTrue(row.next()); assertEquals(0, row.getLong(1)); assertEquals(0, row.getLong(2)); }
            }
            return null;
        });
    }
    void grant(IamIntegrationFixtures.Identity who, AuthorizationDecisionService.Scope scope) throws Exception {
        new AuthorizationPrerequisiteFixture(fixtures).actorAssignment(who, AuthorizationPrerequisiteFixture.PA_V1,
                scope, Instant.parse("2026-10-07T05:59:59Z"), null);
    }
    @Test void actualProjectMembershipAndGroupFlowRetainsExplicitParticipationHistory() throws Exception {
        var admin=fixtures.identity(IamIntegrationFixtures.Persona.PA_ORGANIZATION);
        var member=fixtures.identity(IamIntegrationFixtures.Persona.LINH);
        http.withSignedInClient(admin,(client,context)->http.withSignedInClient(member,(unused,memberContext)->{
            grant(admin,AuthorizationDecisionService.Scope.organization(admin.organizationId()));
            var created=post(client,"/api/v1/administration/projects",Map.of("operationId",UUID.randomUUID(),"organizationId",admin.organizationId(),"name","Synthetic participation Project","reason","Explicit synthetic creation"));
            assertEquals(201,created.statusCode());var project=json.readTree(created.body()).path("projectId").asString();
            var scope=Map.of("kind","PROJECT","organizationId",admin.organizationId(),"projectId",project);
            var joined=post(client,"/api/v1/administration/projects/"+project+"/members",Map.of("operationId",UUID.randomUUID(),"scope",scope,"targetActorId",member.actorId(),"expectedProjectVersion",1,"reason","Explicit Project participation"));
            assertEquals(201,joined.statusCode());var membership=json.readTree(joined.body()).path("membershipId").asString();
            assertEquals(2,json.readTree(joined.body()).path("parentVersion").asLong());
            var groupResponse=post(client,"/api/v1/administration/projects/"+project+"/groups",Map.of("operationId",UUID.randomUUID(),"scope",scope,"name","Synthetic business Group","expectedProjectVersion",2,"reason","Explicit Group creation"));
            assertEquals(201,groupResponse.statusCode());var group=json.readTree(groupResponse.body()).path("groupId").asString();
            var groupJoined=post(client,"/api/v1/administration/groups/"+group+"/members",Map.of("operationId",UUID.randomUUID(),"scope",scope,"targetActorId",member.actorId(),"expectedGroupVersion",1,"reason","Explicit Group participation"));
            assertEquals(201,groupJoined.statusCode());var groupMembership=json.readTree(groupJoined.body()).path("membershipId").asString();
            assertEquals(200,get(client,"/api/v1/administration/projects?limit=50").statusCode());
            assertEquals(200,get(client,"/api/v1/administration/projects/"+project+"/groups").statusCode());
            assertEquals(200,get(client,"/api/v1/administration/groups/"+group).statusCode());
            assertEquals(200,get(client,"/api/v1/administration/groups/"+group+"/members").statusCode());
            assertEquals(200,post(client,"/api/v1/administration/group-memberships/"+groupMembership+"/end",Map.of("operationId",UUID.randomUUID(),"scope",scope,"expectedVersion",1,"reason","Explicit Group departure")).statusCode());
            assertEquals(200,post(client,"/api/v1/administration/project-memberships/"+membership+"/end",Map.of("operationId",UUID.randomUUID(),"scope",scope,"expectedVersion",1,"reason","Explicit Project departure")).statusCode());
            var history=get(client,"/api/v1/administration/projects/"+project+"/members");assertEquals(200,history.statusCode());
            assertTrue(json.readTree(history.body()).path("items").valueStream().anyMatch(row->membership.equals(row.path("membershipId").asString())&&!row.path("endedAt").isNull()&&!row.path("eligible").asBoolean()));
            assertEquals(200,post(client,"/api/v1/administration/projects/"+project+"/update",Map.of("operationId",UUID.randomUUID(),"scope",scope,"name","Renamed synthetic Project","expectedVersion",4,"reason","Explicit Project rename")).statusCode());
            assertEquals(200,post(client,"/api/v1/administration/groups/"+group+"/update",Map.of("operationId",UUID.randomUUID(),"scope",scope,"name","Renamed synthetic Group","expectedVersion",3,"reason","Explicit Group rename")).statusCode());
            assertEquals(0,count("SELECT count(*) FROM project_membership WHERE project_id='"+project+"' AND actor_id='"+admin.actorId()+"'"));
            return null;
        }));
    }
    long count(String sql)throws Exception{try(var c=fixtures.app();var q=c.createStatement();var row=q.executeQuery(sql)){assertTrue(row.next());return row.getLong(1);}}
    @Test void projectScopedAndOrdinaryActorsCannotCreateOrDiscloseUnmanagedProjects()throws Exception{
        var scoped=fixtures.identity(IamIntegrationFixtures.Persona.PA_PROJECT);
        http.withSignedInClient(scoped,(client,context)->{
            var prerequisites=new ProjectPrerequisiteFixture(fixtures);var owned=prerequisites.project(scoped);var hidden=prerequisites.project(scoped);
            grant(scoped,AuthorizationDecisionService.Scope.project(scoped.organizationId(),owned.projectId()));
            assertEquals(403,post(client,"/api/v1/administration/projects",Map.of("operationId",UUID.randomUUID(),"organizationId",scoped.organizationId(),"name","Not permitted","reason","Scoped Actor cannot create")).statusCode());
            assertEquals(200,get(client,"/api/v1/administration/projects/"+owned.projectId()).statusCode());
            var list=get(client,"/api/v1/administration/projects");assertEquals(200,list.statusCode());
            assertEquals(1,json.readTree(list.body()).path("items").size());assertFalse(list.body().contains(hidden.projectId().toString()));
            assertEquals(403,get(client,"/api/v1/administration/projects/"+hidden.projectId()).statusCode());
            assertEquals(403,post(client,"/api/v1/administration/projects",Map.of("operationId",UUID.randomUUID(),"organizationId",UUID.randomUUID(),"name","Wrong organization","reason","Wrong scope must not be unavailable")).statusCode());
            assertEquals(400,get(client,"/api/v1/administration/projects?limit=101").statusCode());
            assertEquals(400,get(client,"/api/v1/administration/projects?offset=-1").statusCode());
            return null;
        });
        http.withSignedInClient(fixtures.identity(IamIntegrationFixtures.Persona.ORDINARY),(client,context)->{
            assertEquals(403,get(client,"/api/v1/administration/projects").statusCode());
            var before=count("SELECT count(*) FROM project_owner_outcome");
            assertEquals(403,post(client,"/api/v1/administration/projects",Map.of("operationId",UUID.randomUUID(),"organizationId",fixtures.organizationId(),"name","Forbidden","reason","No applicable assignment")).statusCode());
            assertEquals(before,count("SELECT count(*) FROM project_owner_outcome"));return null;
        });
    }
    @Test void groupTargetRequiresCurrentProjectParticipationAndExpectedVersions()throws Exception{
        var admin=fixtures.identity(IamIntegrationFixtures.Persona.PA_ORGANIZATION);var target=fixtures.identity(IamIntegrationFixtures.Persona.LINH);
        http.withSignedInClient(admin,(client,context)->http.withSignedInClient(target,(unused,memberContext)->{
            grant(admin,AuthorizationDecisionService.Scope.organization(admin.organizationId()));var project=new ProjectPrerequisiteFixture(fixtures).project(admin);
            var scope=Map.of("kind","PROJECT","organizationId",admin.organizationId(),"projectId",project.projectId());
            var group=post(client,"/api/v1/administration/projects/"+project.projectId()+"/groups",Map.of("operationId",UUID.randomUUID(),"scope",scope,"name","Prerequisite Group","expectedProjectVersion",1,"reason","Synthetic creation"));assertEquals(201,group.statusCode());
            var groupId=json.readTree(group.body()).path("groupId").asString();
            assertEquals(409,post(client,"/api/v1/administration/groups/"+groupId+"/members",Map.of("operationId",UUID.randomUUID(),"scope",scope,"targetActorId",target.actorId(),"expectedGroupVersion",1,"reason","Not yet Project member")).statusCode());
            assertEquals(409,post(client,"/api/v1/administration/projects/"+project.projectId()+"/members",Map.of("operationId",UUID.randomUUID(),"scope",scope,"targetActorId",target.actorId(),"expectedProjectVersion",1,"reason","Stale Project version")).statusCode());
            var joined=post(client,"/api/v1/administration/projects/"+project.projectId()+"/members",Map.of("operationId",UUID.randomUUID(),"scope",scope,"targetActorId",target.actorId(),"expectedProjectVersion",2,"reason","Explicit membership"));assertEquals(201,joined.statusCode());
            assertEquals(409,post(client,"/api/v1/administration/projects/"+project.projectId()+"/members",Map.of("operationId",UUID.randomUUID(),"scope",scope,"targetActorId",target.actorId(),"expectedProjectVersion",3,"reason","Duplicate unended membership")).statusCode());
            assertEquals(201,post(client,"/api/v1/administration/groups/"+groupId+"/members",Map.of("operationId",UUID.randomUUID(),"scope",scope,"targetActorId",target.actorId(),"expectedGroupVersion",1,"reason","Now eligible Group target")).statusCode());
            var membership=json.readTree(joined.body()).path("membershipId").asString();
            assertEquals(200,post(client,"/api/v1/administration/project-memberships/"+membership+"/end",Map.of("operationId",UUID.randomUUID(),"scope",scope,"expectedVersion",1,"reason","End Project participation")).statusCode());
            var history=get(client,"/api/v1/administration/groups/"+groupId+"/members");assertEquals(200,history.statusCode());
            assertFalse(json.readTree(history.body()).path("items").get(0).path("eligible").asBoolean());
            assertTrue(json.readTree(history.body()).path("items").get(0).path("endedAt").isNull(),"Ending Project participation does not erase Group history");
            assertFalse(json.readTree(history.body()).path("eligibleTargets").path("items").valueStream().anyMatch(row->target.actorId().toString().equals(row.path("actorId").asString())));
            return null;
        }));
    }
    @Test void canonicalRetryResolvesExactlyOnceAndRejectsChangedInputOrDifferentActor()throws Exception{
        var admin=fixtures.identity(IamIntegrationFixtures.Persona.PA_ORGANIZATION);var another=fixtures.identity(IamIntegrationFixtures.Persona.PA_ORGANIZATION);
        http.withSignedInClient(admin,(client,context)->http.withSignedInClient(another,(other,otherContext)->{
            grant(admin,AuthorizationDecisionService.Scope.organization(admin.organizationId()));grant(another,AuthorizationDecisionService.Scope.organization(another.organizationId()));
            var op=UUID.randomUUID();var input=Map.of("operationId",op,"organizationId",admin.organizationId(),"name","Exact retry Project","reason","Same committed intent");
            var first=post(client,"/api/v1/administration/projects",input);assertEquals(201,first.statusCode());
            var auditBefore=count("SELECT count(*) FROM audit_evidence WHERE operation_id='"+op+"'");var decisionBefore=count("SELECT count(*) FROM project_authorization_evidence WHERE operation_id='"+op+"'");
            var replay=post(client,"/api/v1/administration/projects",input);assertEquals(201,replay.statusCode());assertEquals(json.readTree(first.body()),json.readTree(replay.body()),"JSON object ordering is not a wire contract");
            assertEquals(409,post(client,"/api/v1/administration/projects",Map.of("operationId",op,"organizationId",admin.organizationId(),"name","Changed Project","reason","Same committed intent")).statusCode());
            var refused=post(other,"/api/v1/administration/projects",input);assertEquals(403,refused.statusCode());assertFalse(refused.body().contains("Exact retry Project"));
            assertEquals(1,count("SELECT count(*) FROM project_owner_outcome WHERE operation_id='"+op+"'"));
            assertEquals(auditBefore,count("SELECT count(*) FROM audit_evidence WHERE operation_id='"+op+"'"));
            assertEquals(decisionBefore,count("SELECT count(*) FROM project_authorization_evidence WHERE operation_id='"+op+"'"));return null;
        }));
    }
    @Test void participantProjectionRequiresBothPermissionAndMembershipAndHttpUsesSessionCsrf()throws Exception{
        var who=fixtures.identity(IamIntegrationFixtures.Persona.LINH);
        assertEquals(401,get(HttpClient.newHttpClient(),"/api/v1/administration/projects").statusCode());
        http.withSignedInClient(who,(client,context)->{
            var rows=new ProjectPrerequisiteFixture(fixtures);var project=rows.project(who);
            var authorization=new AuthorizationPrerequisiteFixture(fixtures);var role=authorization.participantRole(AuthorizationDecisionService.Scope.organization(who.organizationId()));
            authorization.actorAssignment(who,role,AuthorizationDecisionService.Scope.project(who.organizationId(),project.projectId()),Instant.parse("2026-10-07T05:59:59Z"),null);
            assertEquals(403,get(client,"/api/v1/projects/"+project.projectId()).statusCode());
            rows.projectMembership(project,who,Instant.parse("2026-10-07T05:59:59Z"),null);
            var response=get(client,"/api/v1/projects/"+project.projectId());assertEquals(200,response.statusCode());
            assertFalse(response.body().contains("members"));assertFalse(response.body().contains("actions"));
            assertEquals(403,client.send(HttpRequest.newBuilder(http.uri("/api/v1/administration/projects")).header("Content-Type","application/json").POST(HttpRequest.BodyPublishers.ofString("{}")).build(),HttpResponse.BodyHandlers.discarding()).statusCode());
            return null;
        });
    }
    HttpResponse<String> get(HttpClient client, String path) throws Exception {
        return client.send(HttpRequest.newBuilder(http.uri(path)).GET().build(), HttpResponse.BodyHandlers.ofString());
    }
    HttpResponse<String> post(HttpClient client, String path, Object body) throws Exception {
        var csrf = json.readTree(get(client, "/api/v1/identity/csrf").body());
        return client.send(HttpRequest.newBuilder(http.uri(path)).header("Content-Type", "application/json")
                .header(csrf.path("headerName").asString(), csrf.path("token").asString())
                .POST(HttpRequest.BodyPublishers.ofString(json.writeValueAsString(body))).build(), HttpResponse.BodyHandlers.ofString());
    }
}
