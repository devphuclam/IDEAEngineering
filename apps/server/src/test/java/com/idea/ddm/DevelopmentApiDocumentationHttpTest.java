package com.idea.ddm;

import static org.junit.jupiter.api.Assertions.*;

import com.idea.ddm.identity.AdministratorBootstrap;
import java.net.CookieManager;
import java.net.CookiePolicy;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.sql.DriverManager;
import java.util.Map;
import java.util.UUID;
import org.flywaydb.core.Flyway;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.server.context.WebServerApplicationContext;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import tools.jackson.databind.json.JsonMapper;

/** Actual HTTP/application contract. Browser/HTTPS Try out is a separate qualification. */
class DevelopmentApiDocumentationHttpTest {
    private String schema;
    private ConfigurableApplicationContext server;
    private int port;
    private String login;
    private String password;

    @BeforeEach
    void startIsolatedSyntheticEstate() throws Exception {
        assertEquals("idea_ddm_app", env("IDEA_DATABASE_APP_USER"));
        assertEquals("idea_ddm_migrator", env("IDEA_DATABASE_MIGRATION_USER"));
        schema = "devaccess_" + UUID.randomUUID().toString().replace("-", "");
        Flyway.configure().dataSource(url(), "idea_ddm_migrator", env("IDEA_DATABASE_MIGRATION_PASSWORD"))
                .schemas(schema).defaultSchema(schema).locations("classpath:db/migration")
                .cleanDisabled(true).load().migrate();
        try (var connection = migrator(); var statement = connection.createStatement()) {
            statement.execute("GRANT USAGE ON SCHEMA " + schema + " TO idea_ddm_app");
        }
        login = "synthetic.devaccess." + UUID.randomUUID();
        password = UUID.randomUUID().toString();
        var source = new DriverManagerDataSource(url() + "?currentSchema=" + schema,
                "idea_ddm_app", env("IDEA_DATABASE_APP_PASSWORD"));
        new AdministratorBootstrap(source).initialize(UUID.randomUUID(), "Synthetic documentation organization",
                "Synthetic developer", login, password);
        server = new SpringApplicationBuilder(IdeaServerApplication.class)
                .properties(Map.of("spring.datasource.password", env("IDEA_DATABASE_APP_PASSWORD")))
                .run("--server.address=127.0.0.1", "--server.port=0",
                        "--spring.datasource.url=" + url() + "?currentSchema=" + schema,
                        "--spring.datasource.username=idea_ddm_app", "--spring.flyway.enabled=false",
                        "--server.servlet.session.cookie.secure=false", "--idea.dev-api.enabled=true");
        port = ((WebServerApplicationContext) server).getWebServer().getPort();
    }

    @AfterEach
    void stopBeforeRemovingOnlyThisOwnedSchema() throws Exception {
        if (server != null) server.close();
        password = null;
        if (schema != null && schema.matches("devaccess_[a-f0-9]{32}")) {
            try (var connection = migrator(); var statement = connection.createStatement()) {
                statement.execute("DROP SCHEMA " + schema + " CASCADE");
            }
        }
    }

    @Test
    void signedInDeveloperCanReadTheActualUiAndImplementedApiContract() throws Exception {
        var anonymous = client();
        assertEquals(401, get(anonymous, "/dev-api/").statusCode());
        var developer = signedIn();
        var page = get(developer, "/dev-api/");
        assertEquals(200, page.statusCode());
        assertTrue(page.body().contains("swagger-ui-bundle.js"));
        var bundle = get(developer, "/dev-api/assets/swagger-ui-bundle.js");
        assertEquals(200, bundle.statusCode());
        assertTrue(bundle.body().contains("SwaggerUIBundle"));
        var contract = get(developer, "/dev-api/openapi.json");
        assertEquals(200, contract.statusCode());
        var json = JsonMapper.builder().build().readTree(contract.body());
        assertEquals("3.0.3", json.path("openapi").asString());
        assertEquals("/", json.path("servers").get(0).path("url").asString());
        assertTrue(json.path("paths").has("/api/v1/identity/login"));
        assertTrue(json.path("paths").has("/api/v1/identity/logout"));
        assertFalse(json.path("paths").path("/api/v1/identity/login").path("post")
                .path("responses").has("503"), "Do not promise a persistence status the sign-in filter does not return");
        assertTrue(json.path("paths").path("/api/v1/identity/login").path("post")
                .path("x-idea-documentation-only").asBoolean());
        assertTrue(json.path("paths").path("/api/v1/identity/credentials").path("post")
                .path("x-idea-documentation-only").asBoolean());
        assertEquals("#/components/schemas/IssuedProof", json.path("paths")
                .path("/api/v1/identity/accounts/{account}/credential-proofs").path("post")
                .path("responses").path("200").path("content").path("application/json")
                .path("schema").path("$ref").asString());
        assertEquals("date-time", json.path("components").path("schemas").path("IssuedProof")
                .path("properties").path("expiresAt").path("format").asString());
        var proof = json.path("components").path("schemas").path("IssuedProof").path("properties").path("proof");
        assertTrue(proof.path("readOnly").asBoolean(), "Issued proof is a response field, not request-only");
        assertFalse(proof.path("writeOnly").asBoolean());
        assertFalse(contract.body().contains(password), "Documentation must not contain the fixture credential");
    }

    @Test
    void signedInDeveloperCanReachSwaggerAssetsOnlyThroughTheAllowlistedDevelopmentRoute() throws Exception {
        var developer = signedIn();
        assertEquals(200, get(developer, "/dev-api/assets/swagger-ui.css").statusCode());
        assertEquals(200, get(developer, "/dev-api/assets/swagger-ui-bundle.js").statusCode());
        assertEquals(404, get(developer, "/dev-api/assets/unknown.js").statusCode());
        assertEquals(404, get(developer, "/webjars/swagger-ui/5.32.14/swagger-ui.css").statusCode());
        assertEquals(404, get(developer, "/webjars/swagger-ui/5.32.14/swagger-ui-bundle.js").statusCode());
    }

    @Test
    void documentationUsesOrdinarySessionAndCsrfRefusalsWithoutCreatingAnotherAuthenticationMechanism() throws Exception {
        assertEquals(401, get(client(), "/api/v1/identity/session").statusCode());
        var developer = signedIn();
        assertEquals(200, get(developer, "/api/v1/identity/session").statusCode());
        assertEquals(404, get(developer, "/dev-api/assets/unknown.js").statusCode());
        var refused = developer.send(HttpRequest.newBuilder(uri("/api/v1/identity/logout"))
                .header("X-CSRF-TOKEN", "synthetic-invalid-csrf")
                .POST(HttpRequest.BodyPublishers.noBody()).build(), HttpResponse.BodyHandlers.ofString());
        assertEquals(403, refused.statusCode());
        assertEquals(200, get(developer, "/api/v1/identity/session").statusCode(),
                "Rejected Swagger mutation must leave the ordinary session usable");
        var token = JsonMapper.builder().build().readTree(get(developer, "/api/v1/identity/csrf").body());
        var accepted = developer.send(HttpRequest.newBuilder(uri("/api/v1/identity/logout"))
                .header(token.path("headerName").asString(), token.path("token").asString())
                .POST(HttpRequest.BodyPublishers.noBody()).build(), HttpResponse.BodyHandlers.ofString());
        assertEquals(204, accepted.statusCode());
        assertEquals(401, get(developer, "/api/v1/identity/session").statusCode());
        assertEquals(401, get(developer, "/dev-api/").statusCode());
    }

    private HttpClient signedIn() throws Exception {
        var client = client();
        var token = JsonMapper.builder().build().readTree(get(client, "/api/v1/identity/csrf").body());
        var request = HttpRequest.newBuilder(uri("/api/v1/identity/login"))
                .header("Content-Type", "application/x-www-form-urlencoded")
                .header(token.path("headerName").asString(), token.path("token").asString())
                .POST(HttpRequest.BodyPublishers.ofString("username=" + URLEncoder.encode(login, StandardCharsets.UTF_8)
                        + "&password=" + URLEncoder.encode(password, StandardCharsets.UTF_8))).build();
        var response = client.send(request, HttpResponse.BodyHandlers.ofString());
        assertEquals(200, response.statusCode(), "Synthetic ordinary HTTP sign-in prerequisite");
        return client;
    }

    private URI uri(String path) { return URI.create("http://127.0.0.1:" + port + path); }
    private HttpResponse<String> get(HttpClient client, String path) throws Exception {
        return client.send(HttpRequest.newBuilder(uri(path)).GET().build(), HttpResponse.BodyHandlers.ofString());
    }
    private HttpClient client() {
        return HttpClient.newBuilder().cookieHandler(new CookieManager(null, CookiePolicy.ACCEPT_ALL)).build();
    }
    private java.sql.Connection migrator() throws Exception {
        return DriverManager.getConnection(url(), "idea_ddm_migrator", env("IDEA_DATABASE_MIGRATION_PASSWORD"));
    }
    private String url() {
        if (!env("IDEA_DEVACCESS_TEST_DATABASE_NAME").equals("idea_ddm_preview_20261001_26")) {
            throw new IllegalStateException("Only the controlled synthetic preview database is authorized");
        }
        return "jdbc:postgresql://127.0.0.1:5432/idea_ddm_preview_20261001_26";
    }
    private static String env(String name) {
        var value = System.getenv(name);
        if (value == null || value.isBlank()) throw new IllegalStateException("Missing test prerequisite: " + name);
        return value;
    }
}
