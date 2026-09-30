package com.idea.ddm;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, properties = {
        "spring.datasource.url=jdbc:postgresql://127.0.0.1:1/idea_unavailable_test",
        "spring.datasource.username=unavailable",
        "spring.datasource.password=not-a-secret",
        "spring.datasource.hikari.initialization-fail-timeout=-1",
        "spring.datasource.hikari.connection-timeout=500",
        "spring.flyway.enabled=false"
})
class ServerSmokeTest {
    @Value("${local.server.port}")
    private int port;

    @Test
    void healthEndpointReportsProcessAvailabilityWithoutDatabase() throws Exception {
        var response = get("/health");

        assertEquals(200, response.statusCode());
        assertTrue(response.body().contains("\"status\":\"UP\""), response.body());
    }

    @Test
    void databaseHealthReportsDownWithoutTakingProcessHealthDown() throws Exception {
        var process = get("/health");
        var database = get("/health/database");

        assertEquals(200, process.statusCode());
        assertTrue(process.body().contains("\"status\":\"UP\""), process.body());
        assertEquals(503, database.statusCode());
        assertTrue(database.body().contains("\"status\":\"DOWN\""), database.body());
        assertFalse(database.body().toLowerCase().contains("password"), database.body());
        assertFalse(database.body().contains("jdbc:"), database.body());
    }

    private HttpResponse<String> get(String path) throws Exception {
        var request = HttpRequest.newBuilder(URI.create("http://127.0.0.1:" + port + path)).GET().build();
        return HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());
    }
}
