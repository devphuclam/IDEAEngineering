package com.idea.ddm.access;

import static org.junit.jupiter.api.Assertions.*;
import com.idea.ddm.iam.IamIntegrationFixtures;
import java.util.*;
import java.net.http.*;
import org.junit.jupiter.api.*;

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class AccessInspectionAtomicityTest {
    final CustomRoleQualificationFixture f=new CustomRoleQualificationFixture();
    @BeforeAll void start()throws Exception{f.start();}@AfterAll void stop(){f.close();}
    @Test void repeatedQueryAndResolutionNeverWriteAnAssignmentOutcomeAuditOrEvent()throws Exception{
        var actor=f.rows.identity(IamIntegrationFixtures.Persona.PRA);f.http.withSignedInClient(actor,(client,ctx)->{
            f.delegate(actor);var candidate=f.prepare(client);var id=UUID.fromString(candidate.path("candidateId").asString());
            var before=snapshot();for(int repeat=0;repeat<3;repeat++){
                assertEquals(200,f.post(client,"/api/v1/administration/access-inspections",Map.of("targetActorId",actor.actorId(),"scope",f.scope(),"permissionCode","access.inspect")).statusCode());
                var absent=client.send(HttpRequest.newBuilder(f.http.uri("/api/v1/administration/operations/"+id+"?organizationId="+f.rows.organizationId())).GET().build(),HttpResponse.BodyHandlers.ofString());assertEquals(200,absent.statusCode());assertEquals("UNRESOLVED",f.json.readTree(absent.body()).path("state").asString());
            }assertEquals(before,snapshot());return null;
        });
    }
    @Test void unavailableRequiredFactsReturn503WithNoPartialStateOrFalseEmptySuccess()throws Exception{
        var actor=f.rows.identity(IamIntegrationFixtures.Persona.PRA);f.http.withSignedInClient(actor,(client,ctx)->{
            f.delegate(actor);var before=snapshot();f.sql("REVOKE SELECT ON identity_role_assignment FROM idea_ddm_app");
            try{var refused=f.post(client,"/api/v1/administration/access-inspections",Map.of("targetActorId",actor.actorId(),"scope",f.scope(),"permissionCode","access.inspect"));assertEquals(503,refused.statusCode());assertEquals(Set.of("reasonCode","correlationId"),AccessInspectionPrivacyTest.fields(f.json.readTree(refused.body())));}
            finally{f.sql("GRANT SELECT ON identity_role_assignment TO idea_ddm_app");}assertEquals(before,snapshot());return null;
        });
    }
    List<Long> snapshot()throws Exception{var values=new ArrayList<Long>();for(var table:List.of("identity_role_assignment","identity_role_candidate","iam_owner_outcome","project_owner_outcome","access_policy_owner_outcome","assignment_owner_operation","role_definition_owner_operation","audit_evidence","owner_committed_event"))values.add(f.count("SELECT count(*) FROM "+table));return values;}
}
