package com.idea.ddm.access;

import static org.junit.jupiter.api.Assertions.*;
import com.idea.ddm.iam.IamIntegrationFixtures;
import com.idea.ddm.identity.IamSessionFixture;
import java.net.http.*;
import java.time.Instant;
import java.util.*;
import org.junit.jupiter.api.*;
import tools.jackson.databind.json.JsonMapper;

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class CustomRoleContractTest {
    final IamIntegrationFixtures rows=new IamIntegrationFixtures();
    final JsonMapper json=JsonMapper.builder().build();
    IamSessionFixture http;
    @BeforeAll void start()throws Exception{rows.createSchema();http=new IamSessionFixture(rows);}
    @AfterAll void stop(){if(http!=null)http.close();}
    @Test void eligibleDelegatePreparesAnActualCandidateWithoutActivatingOrGrantingIt()throws Exception{
        var delegate=rows.identity(IamIntegrationFixtures.Persona.PRA);
        http.withSignedInClient(delegate,(client,context)->{
            new AuthorizationPrerequisiteFixture(rows).actorAssignment(delegate,AuthorizationPrerequisiteFixture.PRA_V1,org(),Instant.parse("2026-10-07T05:59:59Z"),null);
            var response=post(client,"/api/v1/administration/roles/candidates",proposal());
            assertEquals(201,response.statusCode(),"Candidate must be the real Server owner operation");
            var candidate=json.readTree(response.body());
            assertEquals("CANDIDATE",candidate.path("state").asString());assertEquals(1,candidate.path("version").asInt());
            assertEquals("project.read",candidate.path("permissionCodes").get(0).asString());
            assertEquals("ORGANIZATION",candidate.path("managementScope").path("kind").asString());
            try(var c=rows.migrator();var q=c.createStatement();var r=q.executeQuery("SELECT count(*) FROM identity_role_version_profile WHERE definition_id='"+candidate.path("definitionId").asString()+"'")){r.next();assertEquals(0,r.getInt(1));}
            return null;
        });
    }
    @Test void validationActivationAndSuccessorPreserveExactPriorVersionAndAssignments()throws Exception{
        var delegate=rows.identity(IamIntegrationFixtures.Persona.PRA);var target=rows.identity(IamIntegrationFixtures.Persona.LINH);
        http.withSignedInClient(delegate,(client,context)->http.withSignedInClient(target,(unused,targetContext)->{
            new AuthorizationPrerequisiteFixture(rows).actorAssignment(delegate,AuthorizationPrerequisiteFixture.PRA_V1,org(),Instant.parse("2026-10-07T05:59:59Z"),null);
            var prepared=post(client,"/api/v1/administration/roles/candidates",proposal());assertEquals(201,prepared.statusCode());var candidate=json.readTree(prepared.body());var id=candidate.path("candidateId").asString();
            var validated=post(client,"/api/v1/administration/roles/candidates/"+id+"/validate",Map.of("scope",org(),"expectedVersion",1));
            assertEquals(200,validated.statusCode(),"Validation must be real, advisory and show exact difference");assertTrue(json.readTree(validated.body()).path("valid").asBoolean());
            var activated=post(client,"/api/v1/administration/roles/candidates/"+id+"/activate",activation(null));assertEquals(201,activated.statusCode());var v1=json.readTree(activated.body());assertEquals(1,v1.path("version").asInt());assertTrue(v1.path("selectable").asBoolean());
            var project=new com.idea.ddm.project.ProjectPrerequisiteFixture(rows).project(delegate);var projectScope=AuthorizationDecisionService.Scope.project(rows.organizationId(),project.projectId());
            var grant=post(client,"/api/v1/administration/assignments",Map.of("operationId",UUID.randomUUID(),"scope",projectScope,"principal",Map.of("kind","ACTOR","actorId",target.actorId()),"roleVersionId",v1.path("roleVersionId").asString(),"reason","Explicit independent version one assignment"));assertEquals(201,grant.statusCode());var assignment=json.readTree(grant.body());
            var successor=new HashMap<String,Object>(proposal());successor.remove("name");successor.put("definitionId",candidate.path("definitionId").asString());successor.put("baseVersionId",v1.path("roleVersionId").asString());successor.put("permissionCodes",List.of("project.read","role.catalogue.read"));successor.put("support",Map.of("scopeKinds",List.of("PROJECT"),"principalKinds",List.of("ACTOR")));
            var next=post(client,"/api/v1/administration/roles/candidates",successor);assertEquals(201,next.statusCode());var v2candidate=json.readTree(next.body());assertEquals("role.catalogue.read",v2candidate.path("difference").path("added").get(0).asString());
            var second=post(client,"/api/v1/administration/roles/candidates/"+v2candidate.path("candidateId").asString()+"/activate",activation(v1.path("roleVersionId").asString()));assertEquals(201,second.statusCode());var v2=json.readTree(second.body());assertEquals(2,v2.path("version").asInt());assertNotEquals(v1.path("roleVersionId"),v2.path("roleVersionId"));
            var old=client.send(HttpRequest.newBuilder(http.uri("/api/v1/administration/roles/"+candidate.path("definitionId").asString()+"/versions/1?organizationId="+rows.organizationId())).GET().build(),HttpResponse.BodyHandlers.ofString());assertEquals(v1,json.readTree(old.body()));
            var retained=client.send(HttpRequest.newBuilder(http.uri("/api/v1/administration/assignments/"+assignment.path("assignmentId").asString()+"?organizationId="+rows.organizationId()+"&projectId="+project.projectId())).GET().build(),HttpResponse.BodyHandlers.ofString());assertEquals(200,retained.statusCode());assertEquals(v1.path("roleVersionId"),json.readTree(retained.body()).path("roleVersionId"));assertEquals(1,json.readTree(retained.body()).path("version").asInt());return null;
        }));
    }
    Map<String,Object> activation(String base){var values=new HashMap<String,Object>();values.put("operationId",UUID.randomUUID());values.put("scope",org());values.put("expectedVersion",1);values.put("baseVersionId",base);values.put("reason","Explicit immutable activation");return values;}
    @Test void registeredButUnsupportedDesignAndSelfAuthorizationContentAreRefused()throws Exception{
        var delegate=rows.identity(IamIntegrationFixtures.Persona.PRA);http.withSignedInClient(delegate,(client,ctx)->{
            grant(delegate,org());
            for(var codes:List.of(List.of("audit.read"),List.of("account.create"),List.of("role.definition.activate"),List.of("unregistered.synthetic.permission"))){var input=new HashMap<String,Object>(proposal());input.put("permissionCodes",codes);assertEquals(409,post(client,"/api/v1/administration/roles/candidates",input).statusCode());assertEquals(0,count("SELECT count(*) FROM identity_role_candidate WHERE definition_id IN(SELECT definition_id FROM identity_role_definition WHERE display_name='Never valid')"));}
            var empty=new HashMap<String,Object>(proposal());empty.put("permissionCodes",List.of());assertEquals(400,post(client,"/api/v1/administration/roles/candidates",empty).statusCode());
            var condition=new HashMap<String,Object>(proposal());condition.put("condition",Map.of("script","synthetic"));assertEquals(400,post(client,"/api/v1/administration/roles/candidates",condition).statusCode());
            var adminGroup=new HashMap<String,Object>(proposal());adminGroup.put("permissionCodes",List.of("role.catalogue.read"));assertEquals(400,post(client,"/api/v1/administration/roles/candidates",adminGroup).statusCode());return null;
        });
    }
    @Test void ordinaryAndSuperWithoutSeparatePraCannotPrepareOrActivateAndCsrfIsRequired()throws Exception{
        for(var persona:List.of(IamIntegrationFixtures.Persona.ORDINARY,IamIntegrationFixtures.Persona.SUPER)){
            var identity=rows.identity(persona);http.withSignedInClient(identity,(client,ctx)->{if(persona==IamIntegrationFixtures.Persona.SUPER)new AuthorizationPrerequisiteFixture(rows).actorAssignment(identity,AuthorizationPrerequisiteFixture.SUPER_V2,org(),Instant.parse("2026-10-07T05:59:59Z"),null);
                assertEquals(403,post(client,"/api/v1/administration/roles/candidates",proposal()).statusCode());assertEquals(403,post(client,"/api/v1/administration/roles/candidates/"+UUID.randomUUID()+"/activate",activation(null)).statusCode());return null;});
        }
        var identity=rows.identity(IamIntegrationFixtures.Persona.PRA);http.withSignedInClient(identity,(client,ctx)->{grant(identity,org());assertEquals(403,client.send(HttpRequest.newBuilder(http.uri("/api/v1/administration/roles/candidates")).header("Content-Type","application/json").POST(HttpRequest.BodyPublishers.ofString(json.writeValueAsString(proposal()))).build(),HttpResponse.BodyHandlers.ofString()).statusCode());return null;});
    }
    @Test void projectManagementScopeAndBuiltInBoundaryAreExact()throws Exception{
        var identity=rows.identity(IamIntegrationFixtures.Persona.PRA);var p=new com.idea.ddm.project.ProjectPrerequisiteFixture(rows);var first=p.project(identity);var second=p.project(identity);var s=AuthorizationDecisionService.Scope.project(rows.organizationId(),first.projectId());
        http.withSignedInClient(identity,(client,ctx)->{grant(identity,s);var input=new HashMap<String,Object>(proposal());input.put("scope",s);var reply=post(client,"/api/v1/administration/roles/candidates",input);assertEquals(201,reply.statusCode());var c=json.readTree(reply.body());
            var wrong=activation(null);wrong.put("scope",AuthorizationDecisionService.Scope.project(rows.organizationId(),second.projectId()));assertEquals(403,post(client,"/api/v1/administration/roles/candidates/"+c.path("candidateId").asString()+"/activate",wrong).statusCode());
            var broad=new HashMap<String,Object>(input);broad.put("operationId",UUID.randomUUID());broad.put("support",Map.of("scopeKinds",List.of("ORGANIZATION"),"principalKinds",List.of("ACTOR")));assertEquals(400,post(client,"/api/v1/administration/roles/candidates",broad).statusCode());
            grant(identity,org());var builtIn=new HashMap<String,Object>(proposal());builtIn.remove("name");builtIn.put("definitionId","9d80f77e-85a6-4c12-a72d-8ef6b7e0b002");builtIn.put("baseVersionId",AuthorizationPrerequisiteFixture.AA_V3);assertEquals(403,post(client,"/api/v1/administration/roles/candidates",builtIn).statusCode());return null;
        });
    }
    @Test void validationAndActivationRefuseStaleCandidateOrObsoleteBase()throws Exception{
        var delegate=rows.identity(IamIntegrationFixtures.Persona.PRA);http.withSignedInClient(delegate,(client,ctx)->{grant(delegate,org());var first=json.readTree(post(client,"/api/v1/administration/roles/candidates",proposal()).body());var id=first.path("candidateId").asString();assertEquals(409,post(client,"/api/v1/administration/roles/candidates/"+id+"/validate",Map.of("scope",org(),"expectedVersion",2)).statusCode());var wrong=activation(null);wrong.put("expectedVersion",2);assertEquals(409,post(client,"/api/v1/administration/roles/candidates/"+id+"/activate",wrong).statusCode());
            var v1=json.readTree(post(client,"/api/v1/administration/roles/candidates/"+id+"/activate",activation(null)).body());var input=new HashMap<String,Object>(proposal());input.remove("name");input.put("definitionId",first.path("definitionId").asString());input.put("baseVersionId",v1.path("roleVersionId").asString());var a=json.readTree(post(client,"/api/v1/administration/roles/candidates",input).body());input.put("operationId",UUID.randomUUID());var b=json.readTree(post(client,"/api/v1/administration/roles/candidates",input).body());assertEquals(201,post(client,"/api/v1/administration/roles/candidates/"+a.path("candidateId").asString()+"/activate",activation(v1.path("roleVersionId").asString())).statusCode());assertEquals(409,post(client,"/api/v1/administration/roles/candidates/"+b.path("candidateId").asString()+"/validate",Map.of("scope",org(),"expectedVersion",1)).statusCode());assertEquals(409,post(client,"/api/v1/administration/roles/candidates/"+b.path("candidateId").asString()+"/activate",activation(v1.path("roleVersionId").asString())).statusCode());return null;});
    }
    UUID grant(IamIntegrationFixtures.Identity identity,AuthorizationDecisionService.Scope scope)throws Exception{return new AuthorizationPrerequisiteFixture(rows).actorAssignment(identity,AuthorizationPrerequisiteFixture.PRA_V1,scope,Instant.parse("2026-10-07T05:59:59Z"),null);}
    long count(String sql)throws Exception{try(var c=rows.migrator();var q=c.createStatement();var r=q.executeQuery(sql)){r.next();return r.getLong(1);}}
    void sql(String sql)throws Exception{try(var c=rows.migrator();var q=c.createStatement()){q.execute(sql);}}
    Map<String,Object> proposal(){return Map.of("operationId",UUID.randomUUID(),"scope",org(),"name","Synthetic participant role","permissionCodes",List.of("project.read"),"support",Map.of("scopeKinds",List.of("PROJECT"),"principalKinds",List.of("ACTOR","PROJECT_GROUP")),"reason","Explicit controlled candidate");}
    AuthorizationDecisionService.Scope org(){return AuthorizationDecisionService.Scope.organization(rows.organizationId());}
    HttpResponse<String> post(HttpClient client,String path,Object body)throws Exception{
        var csrf=client.send(HttpRequest.newBuilder(http.uri("/api/v1/identity/csrf")).GET().build(),HttpResponse.BodyHandlers.ofString());var token=json.readTree(csrf.body());
        return client.send(HttpRequest.newBuilder(http.uri(path)).header("Content-Type","application/json").header(token.path("headerName").asString(),token.path("token").asString()).POST(HttpRequest.BodyPublishers.ofString(json.writeValueAsString(body))).build(),HttpResponse.BodyHandlers.ofString());
    }
}
