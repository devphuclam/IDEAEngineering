package com.idea.ddm.access;

import static org.junit.jupiter.api.Assertions.*;
import com.idea.ddm.iam.IamIntegrationFixtures;
import java.sql.SQLException;
import java.util.*;
import org.junit.jupiter.api.*;

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class RoleAssignmentRecoveryTest {
    final AssignmentQualificationFixture f=new AssignmentQualificationFixture();
    @BeforeAll void start()throws Exception{f.start();}
    @AfterAll void stop(){f.close();}
    @Test void lastRecoveryIsCountedByEligibleActorAcrossExactSuperVersionsNotByAssignmentCount()throws Exception{
        var admin=f.rows.identity(IamIntegrationFixtures.Persona.SUPER);
        f.http.withSignedInClient(admin,(client,ctx)->{
            var old=f.grant(admin,AuthorizationPrerequisiteFixture.SUPER_V1);var current=f.grant(admin,AuthorizationPrerequisiteFixture.SUPER_V2);
            // Ending the historical path is safe while this Actor's separate current path remains.
            assertEquals(200,f.post(client,"/api/v1/administration/assignments/"+old+"/end",Map.of("operationId",UUID.randomUUID(),"scope",f.scope(),"expectedVersion",1,"reason","Retain separate successor recovery")).statusCode());
            assertEquals(409,f.post(client,"/api/v1/administration/assignments/"+current+"/end",Map.of("operationId",UUID.randomUUID(),"scope",f.scope(),"expectedVersion",1,"reason","Must not remove last recovery")).statusCode());
            assertEquals(0,f.count("SELECT count(*) FROM identity_role_assignment WHERE assignment_id='"+current+"' AND revoked_at IS NOT NULL"));
            var another=f.rows.identity(IamIntegrationFixtures.Persona.SUPER);
            return f.http.withSignedInClient(another,(other,c2)->{
                var second=f.grant(another,AuthorizationPrerequisiteFixture.SUPER_V1);
                assertEquals(200,f.post(client,"/api/v1/administration/assignments/"+second+"/end",Map.of("operationId",UUID.randomUUID(),"scope",f.scope(),"expectedVersion",1,"reason","Another eligible Super remains")).statusCode());return null;
            });
        });
    }
    @Test void selfHighestGrantAndFiniteRecoveryCannotReplaceTheGovernedAdoptionBoundary()throws Exception{
        var admin=f.rows.identity(IamIntegrationFixtures.Persona.SUPER);var target=f.rows.identity(IamIntegrationFixtures.Persona.LINH);
        f.http.withSignedInClient(admin,(client,ctx)->f.http.withSignedInClient(target,(unused,c2)->{
            f.grant(admin,AuthorizationPrerequisiteFixture.SUPER_V2);
            assertEquals(403,f.post(client,"/api/v1/administration/assignments",f.input(admin.actorId(),AuthorizationPrerequisiteFixture.SUPER_V1)).statusCode());
            var finite=new HashMap<>(f.input(target.actorId(),AuthorizationPrerequisiteFixture.SUPER_V1));finite.put("interval",Map.of("effectiveUntil","2026-10-07T07:00:00Z"));
            assertEquals(409,f.post(client,"/api/v1/administration/assignments",finite).statusCode());
            assertEquals(201,f.post(client,"/api/v1/administration/assignments",f.input(admin.actorId(),AuthorizationPrerequisiteFixture.AA_V3)).statusCode(),"Exact independent Super→AA remains bounded and allowed");return null;
        }));
    }
    @Test void runtimeCannotRewriteAssignmentsRoleContentOrRetainedEvidenceThroughRawDml()throws Exception{
        for(var table:List.of("identity_role_assignment","identity_role_version","identity_role_permission","identity_role_definition","identity_role_version_profile","access_policy_owner_outcome","assignment_owner_operation","assignment_authorization_evidence")){
            for(var sql:List.of("DELETE FROM "+table,"TRUNCATE "+table))try(var c=f.rows.app();var q=c.createStatement()){assertEquals("42501",assertThrows(SQLException.class,()->q.execute(sql)).getSQLState());}
        }
        try(var c=f.rows.app();var q=c.createStatement()){assertEquals("42501",assertThrows(SQLException.class,()->q.execute("UPDATE identity_role_assignment SET reason='raw bypass'")).getSQLState());}
        try(var c=f.rows.app();var q=c.prepareStatement("SELECT role_assignment_end(?,?,?,?,?,CURRENT_TIMESTAMP)")){
            q.setObject(1,UUID.randomUUID());q.setObject(2,UUID.randomUUID());q.setLong(3,1);q.setObject(4,UUID.randomUUID());q.setString(5,"Unknown exact row cannot be ended");try(var r=q.executeQuery()){assertTrue(r.next());assertFalse(r.getBoolean(1));}
        }
    }
}
