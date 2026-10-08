package com.idea.ddm.project;

import static org.junit.jupiter.api.Assertions.*;
import com.idea.ddm.access.AuthorizationDecisionService;
import com.idea.ddm.access.AuthorizationPrerequisiteFixture;
import com.idea.ddm.iam.IamIntegrationFixtures;
import com.idea.ddm.identity.IamSessionFixture;
import java.net.http.*;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.*;
import org.junit.jupiter.api.*;
import tools.jackson.databind.json.JsonMapper;

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class ProjectGovernanceAtomicityTest {
    private final IamIntegrationFixtures fixtures=new IamIntegrationFixtures();
    private final JsonMapper json=JsonMapper.builder().build();
    private IamSessionFixture http;
    @BeforeAll void start()throws Exception{fixtures.createSchema();http=new IamSessionFixture(fixtures);}
    @AfterAll void stop(){if(http!=null)http.close();}
    @Test void requiredOutcomeAuthorizationAndAuditFailuresRollBackMembershipAndParentVersion()throws Exception{
        var admin=fixtures.identity(IamIntegrationFixtures.Persona.PA_ORGANIZATION);
        http.withSignedInClient(admin,(client,context)->{
            grant(admin);var project=new ProjectPrerequisiteFixture(fixtures).project(admin);
            for(var table:List.of("project_owner_outcome","project_authorization_evidence","audit_evidence")){
                var operation=UUID.randomUUID();var input=Map.of("operationId",operation,"scope",scope(project),"targetActorId",admin.actorId(),"expectedProjectVersion",1,"reason","Synthetic atomic failure");
                sql("CREATE FUNCTION suppress_project_write() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RETURN NULL; END $$");
                sql("CREATE TRIGGER suppress_project_write BEFORE INSERT ON "+table+" FOR EACH ROW EXECUTE FUNCTION suppress_project_write()");
                try{assertEquals(503,post(client,"/api/v1/administration/projects/"+project.projectId()+"/members",input).statusCode());}
                finally{sql("DROP TRIGGER suppress_project_write ON "+table);sql("DROP FUNCTION suppress_project_write()");}
                assertEquals(1,count("SELECT version FROM project WHERE project_id='"+project.projectId()+"'"));
                assertEquals(0,count("SELECT count(*) FROM project_membership WHERE project_id='"+project.projectId()+"'"));
                for(var evidence:List.of("project_owner_outcome","project_authorization_evidence","audit_evidence"))assertEquals(0,count("SELECT count(*) FROM "+evidence+" WHERE operation_id='"+operation+"'"));
            }
            return null;
        });
    }
    @Test void concurrentSameOperationResolvesOneProjectAndOneRequiredEvidenceSet()throws Exception{
        var admin=fixtures.identity(IamIntegrationFixtures.Persona.PA_ORGANIZATION);
        http.withSignedInClient(admin,(client,context)->{
            grant(admin);var op=UUID.randomUUID();var input=Map.of("operationId",op,"organizationId",admin.organizationId(),"name","Concurrent synthetic Project","reason","Same exact operation intent");
            // Initialize the new post-login session token before racing owner commands, not two token initializers.
            assertEquals(200,client.send(HttpRequest.newBuilder(http.uri("/api/v1/identity/csrf")).GET().build(),HttpResponse.BodyHandlers.discarding()).statusCode());
            var responses=concurrent(()->post(client,"/api/v1/administration/projects",input),()->post(client,"/api/v1/administration/projects",input));
            assertEquals(201,responses.get(0).statusCode());assertEquals(201,responses.get(1).statusCode());
            assertEquals(json.readTree(responses.get(0).body()),json.readTree(responses.get(1).body()));
            assertEquals(1,count("SELECT count(*) FROM project_owner_outcome WHERE operation_id='"+op+"'"));
            assertEquals(1,count("SELECT count(*) FROM audit_evidence WHERE operation_id='"+op+"'"));
            assertEquals(2,count("SELECT count(*) FROM project_authorization_evidence WHERE operation_id='"+op+"'"));return null;
        });
    }
    @Test void concurrentDifferentOperationsCannotBothSpendTheSameProjectVersion()throws Exception{
        var admin=fixtures.identity(IamIntegrationFixtures.Persona.PA_ORGANIZATION);
        http.withSignedInClient(admin,(client,context)->{
            grant(admin);var project=new ProjectPrerequisiteFixture(fixtures).project(admin);
            var input=Map.of("operationId",UUID.randomUUID(),"scope",scope(project),"name","Concurrent Group A","expectedProjectVersion",1,"reason","Expected parent version");
            var other=Map.of("operationId",UUID.randomUUID(),"scope",scope(project),"name","Concurrent Group B","expectedProjectVersion",1,"reason","Expected parent version");
            assertEquals(200,client.send(HttpRequest.newBuilder(http.uri("/api/v1/identity/csrf")).GET().build(),HttpResponse.BodyHandlers.discarding()).statusCode());
            var responses=concurrent(()->post(client,"/api/v1/administration/projects/"+project.projectId()+"/groups",input),()->post(client,"/api/v1/administration/projects/"+project.projectId()+"/groups",other));
            assertEquals(List.of(201,409),responses.stream().map(HttpResponse::statusCode).sorted().toList());
            assertEquals(2,count("SELECT version FROM project WHERE project_id='"+project.projectId()+"'"));
            assertEquals(1,count("SELECT count(*) FROM business_group WHERE project_id='"+project.projectId()+"'"));
            assertEquals(1,count("SELECT count(*) FROM project_owner_outcome WHERE target_id='"+project.projectId()+"' AND outcome='REFUSED'"));return null;
        });
    }
    private static <T>List<T> concurrent(Callable<T> first,Callable<T> second)throws Exception{
        try(var pool=Executors.newFixedThreadPool(2)){
            var start=new CyclicBarrier(2);
            var a=pool.submit(()->{start.await(5,TimeUnit.SECONDS);return first.call();});
            var b=pool.submit(()->{start.await(5,TimeUnit.SECONDS);return second.call();});
            return List.of(a.get(20,TimeUnit.SECONDS),b.get(20,TimeUnit.SECONDS));
        }
    }
    private Map<String,Object> scope(ProjectPrerequisiteFixture.Project project){return Map.of("kind","PROJECT","organizationId",project.organizationId(),"projectId",project.projectId());}
    private void grant(IamIntegrationFixtures.Identity id)throws Exception{new AuthorizationPrerequisiteFixture(fixtures).actorAssignment(id,AuthorizationPrerequisiteFixture.PA_V1,AuthorizationDecisionService.Scope.organization(id.organizationId()),Instant.parse("2026-10-07T05:59:59Z"),null);}
    private HttpResponse<String> post(HttpClient client,String path,Object body)throws Exception{
        var csrf=json.readTree(client.send(HttpRequest.newBuilder(http.uri("/api/v1/identity/csrf")).GET().build(),HttpResponse.BodyHandlers.ofString()).body());
        return client.send(HttpRequest.newBuilder(http.uri(path)).header("Content-Type","application/json").header(csrf.path("headerName").asString(),csrf.path("token").asString()).POST(HttpRequest.BodyPublishers.ofString(json.writeValueAsString(body))).build(),HttpResponse.BodyHandlers.ofString());
    }
    private long count(String query)throws Exception{try(var c=fixtures.app();var q=c.createStatement();var r=q.executeQuery(query)){assertTrue(r.next());return r.getLong(1);}}
    private void sql(String query)throws Exception{try(var c=fixtures.migrator();var q=c.createStatement()){q.execute(query);}}
}
