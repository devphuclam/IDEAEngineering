package com.idea.ddm.access;

import static org.junit.jupiter.api.Assertions.*;
import com.idea.ddm.iam.IamIntegrationFixtures;
import java.util.*;
import org.junit.jupiter.api.*;

class AccessInspectionContractTest {
    @Test void actualHttpInspectionUsesCurrentAuthorityAndExactContributingVersion() throws Exception {
        try(var f=new CustomRoleQualificationFixture()) {
            f.start(); var who=f.rows.identity(IamIntegrationFixtures.Persona.PRA);
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
}
