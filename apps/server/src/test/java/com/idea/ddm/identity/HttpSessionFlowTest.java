package com.idea.ddm.identity;

import static org.junit.jupiter.api.Assertions.*;

import com.idea.ddm.IdeaServerApplication;
import java.net.URI;
import java.net.CookieManager;
import java.net.CookiePolicy;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.sql.DriverManager;
import java.util.UUID;
import java.time.Clock;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import org.flywaydb.core.Flyway;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.server.context.WebServerApplicationContext;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

/** Approved seam: real Server HTTP + PostgreSQL; never skipped into a false PASS. */
class HttpSessionFlowTest {
    private String schema;
    private ConfigurableApplicationContext server;
    private int port;
    private final ControlledTime clock = new ControlledTime(Instant.parse("2026-09-30T06:00:00Z"));

    @BeforeEach
    void startServerWithOnlyThisTestsMigratorOwnedSchema() throws Exception {
        assertEquals("idea_ddm_app", env("IDEA_DATABASE_APP_USER"));
        assertEquals("idea_ddm_migrator", env("IDEA_DATABASE_MIGRATION_USER"));
        schema = "f03b_" + UUID.randomUUID().toString().replace("-", "");
        Flyway.configure().dataSource(url(), env("IDEA_DATABASE_MIGRATION_USER"),
                env("IDEA_DATABASE_MIGRATION_PASSWORD"))
                .schemas(schema).defaultSchema(schema).locations("classpath:db/migration")
                .cleanDisabled(true).load().migrate();
        try (var connection = migrator(); var statement = connection.createStatement()) {
            statement.execute("GRANT USAGE ON SCHEMA " + schema + " TO idea_ddm_app");
        }
        server = new SpringApplicationBuilder(IdeaServerApplication.class)
                .initializers(context -> context.getBeanFactory().registerSingleton("testIdentityClock", clock)).run(
                "--server.address=127.0.0.1", "--server.port=0",
                "--spring.datasource.url=" + url() + "?currentSchema=" + schema,
                "--spring.datasource.username=idea_ddm_app",
                "--spring.flyway.enabled=false",
                "--server.servlet.session.cookie.secure=false");
        port = ((WebServerApplicationContext) server).getWebServer().getPort();
    }

    @AfterEach
    void closeServerAndRemoveOnlyOwnedUuidSchema() throws Exception {
        if (server != null) server.close();
        if (schema != null && schema.matches("f03b_[a-f0-9]{32}")) {
            try (var connection = migrator(); var statement = connection.createStatement()) {
                statement.execute("DROP SCHEMA IF EXISTS " + schema + " CASCADE");
            }
        }
    }

    @Test
    void anonymousSessionProbeIsRefusedWithoutActorOrLoginRedirect() throws Exception {
        var response = HttpClient.newHttpClient().send(HttpRequest.newBuilder(
                URI.create("http://127.0.0.1:" + port + "/api/v1/identity/session")).GET().build(),
                HttpResponse.BodyHandlers.ofString());
        assertEquals(401, response.statusCode());
        assertTrue(response.headers().firstValue("Location").isEmpty());
        assertFalse(response.body().contains("actorId"));
    }

    @Test
    void anonymousClientCanObtainCsrfProofWithoutIdentityPrivilege() throws Exception {
        var client = client();
        var response = get(client, "/api/v1/identity/csrf");
        assertEquals(200, response.statusCode());
        assertFalse(jsonField(response.body(), "token").isBlank(), "CSRF proof must be present");
        assertEquals("X-CSRF-TOKEN", jsonField(response.body(), "headerName"));
        assertFalse(response.body().contains("actorId"));
        assertEquals(401, get(client, "/api/v1/identity/session").statusCode());
    }

    @Test
    void realLoginRotatesSessionAndServerDerivesActorDespiteCallerSuppliedIdentity() throws Exception {
        var fixture = fixture();
        var client = client();
        var csrf = get(client, "/api/v1/identity/csrf");
        assertEquals(200, csrf.statusCode());
        var oldCookie = sessionCookie(client);
        var login = post(client, "/api/v1/identity/login", jsonField(csrf.body(), "token"),
                "username=" + form(fixture.login()) + "&password=" + form(fixture.password())
                        + "&actorId=" + UUID.randomUUID());
        assertEquals(200, login.statusCode());
        assertEquals(fixture.actorId().toString(), jsonField(login.body(), "actorId"));
        assertFalse(oldCookie.equals(sessionCookie(client)), "Successful login must rotate session proof");
        var probe = get(client, "/api/v1/identity/session?actorId=" + UUID.randomUUID());
        assertEquals(200, probe.statusCode());
        assertEquals(fixture.actorId().toString(), jsonField(probe.body(), "actorId"));
        assertEquals(fixture.accountId().toString(), jsonField(probe.body(), "accountId"));
        assertFalse(probe.body().contains(fixture.password()), "Response must not expose a credential");
        assertFalse(probe.body().contains("sessionId"), "Internal proof binding is not response data");
        var oldProof = HttpClient.newHttpClient().send(HttpRequest.newBuilder(
                URI.create("http://127.0.0.1:" + port + "/api/v1/identity/session"))
                .header("Cookie", "IDEA_SESSION=" + oldCookie).GET().build(), HttpResponse.BodyHandlers.ofString());
        assertEquals(401, oldProof.statusCode());
    }

    @Test
    void csrfProtectedLogoutInvalidatesOnlyCurrentSessionAndGetCannotLogOut() throws Exception {
        var fixture = fixture();
        var first = signedIn(fixture);
        var second = signedIn(fixture);
        var oldCookie = sessionCookie(first);
        get(first, "/api/v1/identity/logout");
        assertEquals(200, get(first, "/api/v1/identity/session").statusCode(), "GET must not log out");
        assertEquals(403, post(first, "/api/v1/identity/logout", "incorrect-csrf", "").statusCode());
        assertEquals(200, get(first, "/api/v1/identity/session").statusCode(), "Bad CSRF must not log out");
        var csrf = get(first, "/api/v1/identity/csrf");
        assertEquals(204, post(first, "/api/v1/identity/logout", jsonField(csrf.body(), "token"), "").statusCode());
        assertEquals(401, get(first, "/api/v1/identity/session").statusCode());
        var replay = HttpClient.newHttpClient().send(HttpRequest.newBuilder(
                URI.create("http://127.0.0.1:" + port + "/api/v1/identity/session"))
                .header("Cookie", "IDEA_SESSION=" + oldCookie).GET().build(), HttpResponse.BodyHandlers.ofString());
        assertEquals(401, replay.statusCode());
        assertEquals(200, get(second, "/api/v1/identity/session").statusCode(), "Logout revokes only this session");
    }

    @Test
    void idleDeadlineRefusesExactlyTwoHoursAndLaterWithoutWaiting() throws Exception {
        var fixture = fixture();
        var before = signedIn(fixture);
        var at = signedIn(fixture);
        var after = signedIn(fixture);
        clock.advanceTo(Instant.parse("2026-09-30T07:59:59.999999Z"));
        assertEquals(200, get(before, "/api/v1/identity/session").statusCode());
        clock.advanceTo(Instant.parse("2026-09-30T08:00:00Z"));
        assertEquals(401, get(at, "/api/v1/identity/session").statusCode());
        clock.advanceTo(Instant.parse("2026-09-30T08:00:00.000001Z"));
        assertEquals(401, get(after, "/api/v1/identity/session").statusCode());
        assertEquals(200, get(before, "/api/v1/identity/session").statusCode(), "Eligible activity renews idle only");
    }

    @Test
    void activityCannotExtendEightHourAbsoluteDeadline() throws Exception {
        var fixture = fixture();
        var at = signedIn(fixture);
        var after = signedIn(fixture);
        for (int hour = 1; hour < 8; hour++) {
            clock.advanceTo(Instant.parse("2026-09-30T06:00:00Z").plusSeconds(hour * 3600));
            assertEquals(200, get(at, "/api/v1/identity/session").statusCode());
            assertEquals(200, get(after, "/api/v1/identity/session").statusCode());
        }
        clock.advanceTo(Instant.parse("2026-09-30T13:59:59.999999Z"));
        assertEquals(200, get(at, "/api/v1/identity/session").statusCode());
        assertEquals(200, get(after, "/api/v1/identity/session").statusCode());
        clock.advanceTo(Instant.parse("2026-09-30T14:00:00Z"));
        assertEquals(401, get(at, "/api/v1/identity/session").statusCode());
        clock.advanceTo(Instant.parse("2026-09-30T14:00:00.000001Z"));
        assertEquals(401, get(after, "/api/v1/identity/session").statusCode());
    }

    @Test
    void loginRequiresCsrfAndWrongOrUnknownCredentialsRevealNoIdentity() throws Exception {
        var fixture = fixture();
        var client = client();
        var csrf = get(client, "/api/v1/identity/csrf");
        var body = "username=" + form(fixture.login()) + "&password=" + form(fixture.password());
        assertEquals(403, post(client, "/api/v1/identity/login", "wrong-proof", body).statusCode());
        var missing = client.send(HttpRequest.newBuilder(URI.create("http://127.0.0.1:" + port + "/api/v1/identity/login"))
                .header("Content-Type", "application/x-www-form-urlencoded")
                .POST(HttpRequest.BodyPublishers.ofString(body)).build(), HttpResponse.BodyHandlers.ofString());
        assertEquals(403, missing.statusCode());
        assertEquals(401, get(client, "/api/v1/identity/session").statusCode());
        var wrong = post(client, "/api/v1/identity/login", jsonField(csrf.body(), "token"),
                "username=" + form(fixture.login()) + "&password=" + form(UUID.randomUUID().toString()));
        var unknown = post(client, "/api/v1/identity/login", jsonField(csrf.body(), "token"),
                "username=" + form(UUID.randomUUID().toString()) + "&password=" + form(fixture.password()));
        assertEquals(401, wrong.statusCode());
        assertEquals(401, unknown.statusCode());
        assertEquals(wrong.body(), unknown.body(), "Both refusals must have the same safe HTTP response");
        assertFalse(wrong.body().contains(fixture.login()));
        assertFalse(wrong.body().contains("actorId"));
        assertEquals(401, get(client, "/api/v1/identity/session").statusCode());
    }

    @Test
    void rejectedCsrfAndPublicTrafficCannotRefreshEligibleIdleActivity() throws Exception {
        var fixture = fixture();
        var client = signedIn(fixture);
        clock.advanceTo(Instant.parse("2026-09-30T07:59:59Z"));
        assertEquals(403, post(client, "/api/v1/identity/logout", "wrong-proof", "").statusCode());
        assertEquals(200, get(client, "/api/v1/identity/csrf").statusCode());
        assertEquals(200, get(client, "/health").statusCode());
        clock.advanceTo(Instant.parse("2026-09-30T08:00:00Z"));
        assertEquals(401, get(client, "/api/v1/identity/session").statusCode());
    }

    private static final class ControlledTime extends Clock {
        private volatile Instant now;
        ControlledTime(Instant now) { this.now = now; }
        void advanceTo(Instant next) { assertFalse(next.isBefore(now)); now = next; }
        @Override public Instant instant() { return now; }
        @Override public ZoneId getZone() { return ZoneOffset.UTC; }
        @Override public Clock withZone(ZoneId zone) { return Clock.fixed(now, zone); }
    }

    private HttpClient signedIn(Fixture fixture) throws Exception {
        var client = client();
        var csrf = get(client, "/api/v1/identity/csrf");
        assertEquals(200, post(client, "/api/v1/identity/login", jsonField(csrf.body(), "token"),
                "username=" + form(fixture.login()) + "&password=" + form(fixture.password())).statusCode());
        return client;
    }

    private record Fixture(UUID actorId, UUID accountId, String login, String password) {}

    private Fixture fixture() {
        var app = new DriverManagerDataSource(url() + "?currentSchema=" + schema,
                "idea_ddm_app", env("IDEA_DATABASE_APP_PASSWORD"));
        var login = "synthetic." + UUID.randomUUID();
        var password = UUID.randomUUID().toString() + "-synthetic-only";
        var result = new AdministratorBootstrap(app).initialize(UUID.randomUUID(),
                "Synthetic HTTP organization", "Synthetic HTTP custodian", login, password);
        return new Fixture(result.actorId(), result.accountId(), login, password);
    }

    private static String form(String value) { return URLEncoder.encode(value, StandardCharsets.UTF_8); }

    private HttpResponse<String> post(HttpClient client, String path, String csrf, String body) throws Exception {
        return client.send(HttpRequest.newBuilder(URI.create("http://127.0.0.1:" + port + path))
                .header("Content-Type", "application/x-www-form-urlencoded")
                .header("X-CSRF-TOKEN", csrf).POST(HttpRequest.BodyPublishers.ofString(body)).build(),
                HttpResponse.BodyHandlers.ofString());
    }

    private static String sessionCookie(HttpClient client) {
        var manager = (CookieManager) client.cookieHandler().orElseThrow();
        return manager.getCookieStore().getCookies().stream().filter(cookie -> cookie.getName().equals("IDEA_SESSION"))
                .findFirst().orElseThrow().getValue();
    }

    private HttpClient client() {
        return HttpClient.newBuilder().cookieHandler(new CookieManager(null, CookiePolicy.ACCEPT_ALL)).build();
    }

    private HttpResponse<String> get(HttpClient client, String path) throws Exception {
        return client.send(HttpRequest.newBuilder(URI.create("http://127.0.0.1:" + port + path)).GET().build(),
                HttpResponse.BodyHandlers.ofString());
    }

    private static String jsonField(String json, String name) {
        var match = java.util.regex.Pattern.compile("\"" + name + "\"\\s*:\\s*\"([^\"]+)\"").matcher(json);
        assertTrue(match.find(), "Expected response field: " + name);
        return match.group(1);
    }

    private java.sql.Connection migrator() throws Exception {
        return DriverManager.getConnection(url(), "idea_ddm_migrator", env("IDEA_DATABASE_MIGRATION_PASSWORD"));
    }

    private String url() {
        var database = env("IDEA_F03B_TEST_DATABASE_NAME");
        if (!database.equals("idea_ddm_f03a_20260930_c91e7a42")) {
            throw new IllegalStateException("Only the authorized F03-B test database is allowed");
        }
        return "jdbc:postgresql://" + env("IDEA_DATABASE_HOST") + ":" + env("IDEA_DATABASE_PORT") + "/" + database;
    }

    private static String env(String name) {
        var value = System.getenv(name);
        if (value == null || value.isBlank()) throw new IllegalStateException("Missing test prerequisite: " + name);
        return value;
    }
}
