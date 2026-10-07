package com.idea.ddm.identity;

import static org.junit.jupiter.api.Assertions.*;

import com.idea.ddm.IdeaServerApplication;
import com.idea.ddm.iam.IamIntegrationFixtures;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.CookieManager;
import java.net.CookiePolicy;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Clock;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicReference;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.server.context.WebServerApplicationContext;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

/** Named real-HTTP fixture shared by IAM owner qualifications; no new route or raw caller identity. */
public final class IamSessionFixture implements AutoCloseable {
    private final IamIntegrationFixtures fixtures;
    final ControlledClock clock = new ControlledClock();
    private final AtomicReference<ActorContext> captured = new AtomicReference<>();
    private final ConfigurableApplicationContext server;
    private final int port;

    public IamSessionFixture(IamIntegrationFixtures fixtures) {
        this.fixtures = fixtures;
        server = new SpringApplicationBuilder(IdeaServerApplication.class).initializers(context -> {
            context.getBeanFactory().registerSingleton("iamFixtureClock", clock);
            context.getBeanFactory().registerSingleton("dataSource", fixtures.appDataSource());
            context.getBeanFactory().registerSingleton("iamPrincipalCapture", new PrincipalCapture());
        }).run("--server.address=127.0.0.1", "--server.port=0", "--spring.flyway.enabled=false",
                "--server.ssl.enabled=false", "--server.servlet.session.cookie.secure=false", "--idea.dev-api.enabled=false");
        port = ((WebServerApplicationContext) server).getWebServer().getPort();
    }

    public SessionService sessions() { return server.getBean(SessionService.class); }
    @Override public void close() { server.close(); captured.set(null); }

    public ActorContext signIn(IamIntegrationFixtures.Identity identity) throws Exception {
        var credential = UUID.randomUUID().toString(); // Private test memory, never a retained fixture value.
        try (var connection = fixtures.migrator()) {
            connection.setAutoCommit(false);
            AdministratorBootstrap.insert(connection, "INSERT INTO actor(actor_id,display_name) VALUES (?,?)", identity.actorId(), identity.displayName());
            AdministratorBootstrap.insert(connection, "INSERT INTO idea_account(account_id,actor_id,organization_id,status) VALUES (?,?,?,'ACTIVE')",
                    identity.accountId(), identity.actorId(), identity.organizationId());
            AdministratorBootstrap.insert(connection, "INSERT INTO login_identity(login_identity_id,account_id,login_identifier,normalized_login_identifier,password_verifier) VALUES (?,?,?,?,?)",
                    identity.loginIdentityId(), identity.accountId(), identity.login(), identity.login(), new NativePasswordVerifier().encodeNewCredential(credential));
            connection.commit();
        }
        var cookies = new CookieManager(null, CookiePolicy.ACCEPT_ALL);
        try {
            var client = HttpClient.newBuilder().cookieHandler(cookies).build();
            captured.set(null);
            assertEquals(401, get(client, "/api/v1/identity/session").statusCode());
            assertNull(captured.get());
            var csrf = get(client, "/api/v1/identity/csrf");
            assertEquals(200, csrf.statusCode());
            var response = client.send(HttpRequest.newBuilder(uri("/api/v1/identity/login"))
                    .header("Content-Type", "application/x-www-form-urlencoded")
                    .header(field(csrf.body(), "headerName"), field(csrf.body(), "token"))
                    .POST(HttpRequest.BodyPublishers.ofString("username=" + encode(identity.login()) + "&password=" + encode(credential))).build(),
                    HttpResponse.BodyHandlers.discarding());
            assertEquals(200, response.statusCode());
            var forged = UUID.randomUUID();
            response = client.send(HttpRequest.newBuilder(uri("/api/v1/identity/session?actorId=" + forged))
                    .header("ActorId", forged.toString()).GET().build(), HttpResponse.BodyHandlers.discarding());
            assertEquals(200, response.statusCode());
            var context = captured.getAndSet(null);
            assertNotNull(context, "Only the actual authenticated Server principal establishes context");
            assertEquals(identity.actorId(), context.actorId());
            assertNotEquals(forged, context.actorId());
            assertNotNull(context.sessionId());
            return context;
        } finally { cookies.getCookieStore().removeAll(); }
    }

    private HttpResponse<String> get(HttpClient client, String path) throws Exception {
        return client.send(HttpRequest.newBuilder(uri(path)).GET().build(), HttpResponse.BodyHandlers.ofString());
    }
    private URI uri(String path) { return URI.create("http://127.0.0.1:" + port + path); }
    private static String encode(String value) { return URLEncoder.encode(value, StandardCharsets.UTF_8); }
    private static String field(String json, String name) {
        var matcher = java.util.regex.Pattern.compile("\\\"" + name + "\\\":\\\"([^\\\"]+)\\\"").matcher(json);
        assertTrue(matcher.find(), "Expected response field missing"); // Never echo credential/proof/CSRF content.
        return matcher.group(1);
    }
    private final class PrincipalCapture extends OncePerRequestFilter {
        @Override protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
                throws ServletException, IOException {
            chain.doFilter(request, response);
            if ("GET".equals(request.getMethod()) && "/api/v1/identity/session".equals(request.getRequestURI()) && response.getStatus() == 200) {
                var authentication = SecurityContextHolder.getContext().getAuthentication();
                if (authentication != null && authentication.isAuthenticated()
                        && authentication.getPrincipal() instanceof SessionService.Identity identity) {
                    captured.set(server.getBean(SessionService.class).context(identity));
                }
            }
        }
    }
    static final class ControlledClock extends Clock {
        private Instant now = Instant.parse("2026-10-07T06:00:00Z");
        @Override public synchronized Instant instant() { return now; }
        synchronized void advance(java.time.Duration duration) { now = now.plus(duration); }
        @Override public ZoneId getZone() { return ZoneOffset.UTC; }
        @Override public Clock withZone(ZoneId zone) { return this; }
    }
}

