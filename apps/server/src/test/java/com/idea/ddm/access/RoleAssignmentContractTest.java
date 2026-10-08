package com.idea.ddm.access;

import static org.junit.jupiter.api.Assertions.*;
import com.idea.ddm.iam.IamIntegrationFixtures;
import com.idea.ddm.identity.IamSessionFixture;
import java.net.http.*;
import java.time.Instant;
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
}
