package com.idea.ddm.identity;

import static org.junit.jupiter.api.Assertions.*;
import com.idea.ddm.iam.IamIntegrationFixtures;
import com.idea.ddm.access.AuthorizationPrerequisiteFixture;
import com.idea.ddm.access.AuthorizationDecisionService;
import java.net.http.*;
import java.time.Instant;
import java.util.UUID;
import org.junit.jupiter.api.*;
import tools.jackson.databind.json.JsonMapper;

/** Qualifies existing create behavior, without manufacturing a RED in already-correct code. */
class AccountIsolationTest {
    @Test void actualHttpCreateHasNoImplicitProjectGroupOrRoleAccess() throws Exception {
        var fixtures = new IamIntegrationFixtures(); fixtures.createSchema();
        try (var http = new IamSessionFixture(fixtures)) {
            var who = fixtures.identity(IamIntegrationFixtures.Persona.AA_V3);
            http.withSignedInClient(who, (client, context) -> {
                new AuthorizationPrerequisiteFixture(fixtures).actorAssignment(who, AuthorizationPrerequisiteFixture.AA_V3,
                        AuthorizationDecisionService.Scope.organization(who.organizationId()), Instant.parse("2026-10-07T05:59:59Z"), null);
                var json = JsonMapper.builder().build();
                var csrf = json.readTree(client.send(HttpRequest.newBuilder(http.uri("/api/v1/identity/csrf")).GET().build(), HttpResponse.BodyHandlers.ofString()).body());
                var body = json.writeValueAsString(java.util.Map.of("operationId", UUID.randomUUID(), "organizationId", who.organizationId(),
                        "displayName", "Synthetic isolated recipient", "login", "isolation-" + UUID.randomUUID()));
                var response = client.send(HttpRequest.newBuilder(http.uri("/api/v1/identity/accounts")).header("Content-Type", "application/json")
                        .header(csrf.path("headerName").asString(), csrf.path("token").asString()).POST(HttpRequest.BodyPublishers.ofString(body)).build(), HttpResponse.BodyHandlers.ofString());
                assertEquals(201, response.statusCode()); var result = json.readTree(response.body());
                assertEquals("PENDING", result.path("status").asString()); var actor = UUID.fromString(result.path("actorId").asString());
                for (var table : java.util.List.of("project_membership", "group_membership", "identity_role_assignment")) {
                    var field = table.equals("identity_role_assignment") ? "principal_actor_id" : "actor_id";
                    try (var c = fixtures.app(); var q = c.prepareStatement("SELECT count(*) FROM " + table + " WHERE " + field + "=?")) {
                        q.setObject(1, actor); try (var row = q.executeQuery()) { assertTrue(row.next()); assertEquals(0, row.getLong(1)); }
                    }
                }
                return null;
            });
        }
    }
}
