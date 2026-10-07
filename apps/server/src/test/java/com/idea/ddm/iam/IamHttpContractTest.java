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
