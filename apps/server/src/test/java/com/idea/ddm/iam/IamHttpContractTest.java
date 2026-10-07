package com.idea.ddm.iam;

import static org.junit.jupiter.api.Assertions.*;

import com.idea.ddm.identity.IamSessionFixture;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.http.HttpClient;
import java.util.UUID;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import tools.jackson.databind.json.JsonMapper;

/** Real HTTP mapping seam only; the synthetic adapter is excluded from product component scan. */
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class IamHttpContractTest {
    private final IamIntegrationFixtures fixtures = new IamIntegrationFixtures();
    private final JsonMapper json = JsonMapper.builder().build();
    private IamSessionFixture http;

    @BeforeAll void start() throws Exception {
        fixtures.createSchema();
        http = new IamSessionFixture(fixtures, SyntheticAdapter.class);
    }
    @AfterAll void stop() { if (http != null) http.close(); }

    @Test void newAdapterReturnsOnlyBoundedReasonAndServerCorrelationForInvalidInput() throws Exception {
        http.withSignedInClient(fixtures.identity(IamIntegrationFixtures.Persona.ORDINARY), (client, context) -> {
            var callerCorrelation = UUID.randomUUID();
            var response = client.send(HttpRequest.newBuilder(http.uri("/__iam_http_contract/invalid"))
                    .header("X-Correlation-Id", callerCorrelation.toString()).GET().build(), HttpResponse.BodyHandlers.ofString());
            assertEquals(400, response.statusCode());
            var body = json.readTree(response.body());
            assertEquals(2, body.size());
            assertEquals("INVALID_INPUT", body.path("reasonCode").asString());
            assertNotEquals(callerCorrelation, UUID.fromString(body.path("correlationId").asString()));
            return null;
        });
    }

    @Test void allDeclaredNewRefusalsUseBoundedStatusesWithoutCopyingCallerCorrelationOrDetails() throws Exception {
        http.withSignedInClient(fixtures.identity(IamIntegrationFixtures.Persona.ORDINARY), (client, context) -> {
            var statuses = new int[] {400, 401, 403, 404, 409, 503};
            var reasons = new String[] {"INVALID_INPUT", "INELIGIBLE_SESSION", "AUTHORITY_REFUSED",
                    "TARGET_NOT_AVAILABLE", "STATE_CONFLICT", "UNAVAILABLE"};
            var correlations = new java.util.HashSet<UUID>();
            for (int i = 0; i < statuses.length; i++) {
                var response = get(client, "/__iam_http_contract/refuse/" + reasons[i]);
                assertTrue(correlations.add(assertMapped(response, statuses[i], reasons[i])));
            }
            return null;
        });
    }

    @Test void unexpectedAdapterFailureIsUnavailableAndDoesNotDiscloseSqlOrDiagnosticText() throws Exception {
        http.withSignedInClient(fixtures.identity(IamIntegrationFixtures.Persona.ORDINARY), (client, context) -> {
            assertMapped(get(client, "/__iam_http_contract/unavailable"), 503, "UNAVAILABLE");
            return null;
        });
    }

    @Test void malformedNewRequestHasSafe400RatherThanExceptionOrRawJacksonDetails() throws Exception {
        http.withSignedInClient(fixtures.identity(IamIntegrationFixtures.Persona.ORDINARY), (client, context) -> {
            assertMapped(postWithCsrf(client, "/__iam_http_contract/shape", "{\"targetId\":\"PRIVATE_INPUT_SENTINEL\"}"),
                    400, "INVALID_INPUT");
            return null;
        });
    }

    @Test void legacyIdentityValidationKeepsAcceptedEmptyBodyInsteadOfNewEnvelope() throws Exception {
        http.withSignedInClient(fixtures.identity(IamIntegrationFixtures.Persona.ORDINARY), (client, context) -> {
            var response = postWithCsrf(client, "/api/v1/identity/accounts", "{}");
            assertEquals(400, response.statusCode());
            assertEquals("", response.body());
            return null;
        });
    }

    @Test void syntacticallyInvalidJsonCannotReachOwnerAndHasSafeShapeRefusal() throws Exception {
        http.withSignedInClient(fixtures.identity(IamIntegrationFixtures.Persona.ORDINARY), (client, context) -> {
            assertMapped(postWithCsrf(client, "/__iam_http_contract/shape", "{"), 400, "INVALID_INPUT");
            return null;
        });
    }

    @Test void anonymousNewAdapterIsRefusedByOrdinarySecurityBeforeApplication() throws Exception {
        var response = get(HttpClient.newHttpClient(), "/__iam_http_contract/invalid");
        assertEquals(401, response.statusCode());
        assertEquals("", response.body());
    }

    @Test void missingCsrfIsOrdinary403AndCannotBeRewrittenAsApplicationSuccess() throws Exception {
        http.withSignedInClient(fixtures.identity(IamIntegrationFixtures.Persona.ORDINARY), (client, context) -> {
            var response = client.send(HttpRequest.newBuilder(http.uri("/__iam_http_contract/shape"))
                    .header("Content-Type", "application/json").POST(HttpRequest.BodyPublishers.ofString("{}")).build(),
                    HttpResponse.BodyHandlers.ofString());
            assertEquals(403, response.statusCode());
            assertEquals("", response.body());
            return null;
        });
    }

    @Test void actualServerWiresTheQualifiedReadEvaluatorAndOwnerTransactionWithoutImplicitGrants() throws Exception {
        http.withSignedInClient(fixtures.identity(IamIntegrationFixtures.Persona.ORDINARY), (client, context) -> {
            assertNotNull(http.service(com.idea.ddm.identity.IdentityTransactions.class));
            assertNotNull(http.service(com.idea.ddm.project.ProjectGovernanceQueries.class));
            try (var connection = fixtures.app()) {
                connection.setTransactionIsolation(java.sql.Connection.TRANSACTION_REPEATABLE_READ);
                connection.setAutoCommit(false);
                connection.setReadOnly(true);
                var decision = http.service(com.idea.ddm.access.AuthorizationDecisionService.class).evaluate(connection, context,
                        "account.read", com.idea.ddm.access.AuthorizationDecisionService.Scope.organization(fixtures.organizationId()));
                assertTrue(decision.eligible());
                assertFalse(decision.rbacGranted());
                assertEquals(context.actorId(), decision.actorId());
                assertTrue(decision.paths().isEmpty());
                connection.rollback();
            }
            return null;
        });
    }

    private HttpResponse<String> postWithCsrf(HttpClient client, String path, String body) throws Exception {
        var proof = json.readTree(get(client, "/api/v1/identity/csrf").body());
        return client.send(HttpRequest.newBuilder(http.uri(path)).header("Content-Type", "application/json")
                .header(proof.path("headerName").asString(), proof.path("token").asString())
                .POST(HttpRequest.BodyPublishers.ofString(body)).build(), HttpResponse.BodyHandlers.ofString());
    }

    private HttpResponse<String> get(HttpClient client, String path) throws Exception {
        return client.send(HttpRequest.newBuilder(http.uri(path)).GET().build(), HttpResponse.BodyHandlers.ofString());
    }

    private UUID assertMapped(HttpResponse<String> response, int status, String reason) throws Exception {
        assertEquals(status, response.statusCode());
        var body = json.readTree(response.body());
        assertEquals(2, body.size());
        assertEquals(reason, body.path("reasonCode").asString());
        assertTrue(body.has("correlationId"));
        return UUID.fromString(body.path("correlationId").asString());
    }

    @TestConfiguration(proxyBeanMethods = false)
    @RestController
    @IamWebConfiguration.Boundary
    static class SyntheticAdapter {
        record Shape(UUID targetId) {}
        @PostMapping("/__iam_http_contract/shape")
        Object shape(@RequestBody Shape request) { throw new IamWebConfiguration.Refusal(IamWebConfiguration.RefusalReason.INVALID_INPUT); }
        @GetMapping("/__iam_http_contract/invalid")
        Object invalid() { throw new IamWebConfiguration.Refusal(IamWebConfiguration.RefusalReason.INVALID_INPUT); }
        @GetMapping("/__iam_http_contract/refuse/{reason}")
        Object refuse(@PathVariable String reason) {
            throw new IamWebConfiguration.Refusal(IamWebConfiguration.RefusalReason.valueOf(reason));
        }
        @GetMapping("/__iam_http_contract/unavailable")
        Object unavailable() throws java.sql.SQLException {
            throw new java.sql.SQLException("PRIVATE_DIAGNOSTIC_SENTINEL"); // Synthetic, not a real credential or SQL payload.
        }
    }
}
