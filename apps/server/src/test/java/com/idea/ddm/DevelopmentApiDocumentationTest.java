package com.idea.ddm;

import static org.junit.jupiter.api.Assertions.assertEquals;

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
        "spring.flyway.enabled=false"
})
class DevelopmentApiDocumentationTest {
    @Value("${local.server.port}")
    private int port;

    @Test
    void documentationAndBundledAssetsAreUnavailableUnlessExplicitlyEnabled() throws Exception {
        var client = HttpClient.newHttpClient();
        for (var path : new String[] { "/dev-api/", "/dev-api/openapi.json",
                "/dev-api/assets/swagger-ui-bundle.js", "/webjars/swagger-ui/5.32.14/swagger-ui-bundle.js" }) {
            var request = HttpRequest.newBuilder(URI.create("http://127.0.0.1:" + port + path)).GET().build();
            var response = client.send(request, HttpResponse.BodyHandlers.ofString());
            assertEquals(404, response.statusCode(), "Disabled development documentation: " + path);
        }
    }
}
