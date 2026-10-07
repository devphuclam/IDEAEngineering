package com.idea.ddm.iam;

import static org.junit.jupiter.api.Assertions.*;

import com.idea.ddm.identity.IamSessionFixture;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.UUID;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.web.bind.annotation.GetMapping;
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

    @TestConfiguration(proxyBeanMethods = false)
    @RestController
    @IamWebConfiguration.Boundary
    static class SyntheticAdapter {
        @GetMapping("/__iam_http_contract/invalid")
        Object invalid() { throw new IamWebConfiguration.Refusal(IamWebConfiguration.RefusalReason.INVALID_INPUT); }
    }
}
