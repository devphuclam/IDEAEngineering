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
