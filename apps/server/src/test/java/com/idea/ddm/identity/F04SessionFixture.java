package com.idea.ddm.identity;

import static org.junit.jupiter.api.Assertions.*;

import com.idea.ddm.IdeaServerApplication;
import com.idea.ddm.operation.F04SchemaTest;
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
import java.util.UUID;
import java.util.concurrent.atomic.AtomicReference;
import java.util.function.Supplier;
import javax.sql.DataSource;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.server.context.WebServerApplicationContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.web.filter.OncePerRequestFilter;

/** Test-only bridge on the existing protected session route; no F04 HTTP route or raw-ID context. */
public final class F04SessionFixture implements AutoCloseable {
    public record SignedIn(ActorContext context, UUID expectedActorId, UUID expectedAccountId,
            UUID expectedOrganizationId) {
        public boolean hasDifferentSessionFrom(SignedIn other) {
            return !context.sessionId().equals(other.context.sessionId());
        }
    }

    private final org.springframework.context.ConfigurableApplicationContext server;
    private final AtomicReference<ActorContext> captured = new AtomicReference<>();
    private final DataSource app;
    private final UUID organizationId = UUID.randomUUID();
    private final AdministratorBootstrap.Result identity;
    private final String login = "f04.synthetic." + UUID.randomUUID();
    private final String syntheticCredential = UUID.randomUUID().toString();
    private final int port;

    public F04SessionFixture() {
        var source = new DriverManagerDataSource(F04SchemaTest.url(), "idea_ddm_app",
                F04SchemaTest.env("IDEA_DATABASE_APP_PASSWORD"));
        app = source;
        identity = new AdministratorBootstrap(app).initialize(organizationId, "F04 Synthetic Organization",
                "F04 Synthetic Actor", login, syntheticCredential);
        assertEquals(AdministratorBootstrap.State.INITIALIZED, identity.state());
        server = new SpringApplicationBuilder(IdeaServerApplication.class)
                .initializers(context -> context.getBeanFactory().registerSingleton("f04TestPrincipalCapture",
                        new PrincipalCapture(captured, () -> context.getBean(SessionService.class))))
                .run("--server.address=127.0.0.1", "--server.port=0",
                        "--spring.datasource.url=" + F04SchemaTest.url(),
                        "--spring.datasource.username=idea_ddm_app", "--spring.flyway.enabled=false",
                        "--server.servlet.session.cookie.secure=false", "--server.ssl.enabled=false",
                        "--idea.dev-api.enabled=false");
        port = ((WebServerApplicationContext) server).getWebServer().getPort();
    }

    public DataSource appDataSource() { return app; }
    public SessionService sessions() { return server.getBean(SessionService.class); }

    public SignedIn signInThroughRealHttp() throws Exception {
        captured.set(null);
        var cookies = new CookieManager(null, CookiePolicy.ACCEPT_ALL);
        var client = HttpClient.newBuilder().cookieHandler(cookies).build();
        try {
            assertEquals(401, get(client, "/api/v1/identity/session").statusCode());
            assertNull(captured.get(), "Anonymous access cannot establish ActorContext");
            var csrf = get(client, "/api/v1/identity/csrf");
            assertEquals(200, csrf.statusCode());
            var submission = "username=" + encode(login) + "&password=" + encode(syntheticCredential);
            var response = client.send(HttpRequest.newBuilder(uri("/api/v1/identity/login"))
                    .header("Content-Type", "application/x-www-form-urlencoded")
                    .header(field(csrf.body(), "headerName"), field(csrf.body(), "token"))
                    .POST(HttpRequest.BodyPublishers.ofString(submission)).build(),
                    HttpResponse.BodyHandlers.ofString());
            assertEquals(200, response.statusCode(), "Actual F03 HTTP sign-in must succeed");
            assertEquals(identity.actorId().toString(), field(response.body(), "actorId"));
            captured.set(null);
            var forgedActor = UUID.randomUUID();
            var session = client.send(HttpRequest.newBuilder(uri("/api/v1/identity/session?actorId=" + forgedActor))
                    .header("ActorId", forgedActor.toString()).GET().build(), HttpResponse.BodyHandlers.ofString());
            assertEquals(200, session.statusCode());
            var context = captured.getAndSet(null);
            assertNotNull(context, "Capture requires a Server-established authenticated principal");
            assertEquals(identity.actorId(), context.actorId());
            assertNotEquals(forgedActor, context.actorId(), "Client ActorId is not authority");
            assertNotNull(context.sessionId(), "A raw ActorId fixture cannot supply the verified session reference");
            return new SignedIn(context, identity.actorId(), identity.accountId(), organizationId);
        } finally {
            cookies.getCookieStore().removeAll();
        }
    }

    private HttpResponse<String> get(HttpClient client, String path) throws Exception {
        return client.send(HttpRequest.newBuilder(uri(path)).GET().build(), HttpResponse.BodyHandlers.ofString());
    }

    private URI uri(String path) { return URI.create("http://127.0.0.1:" + port + path); }
    private static String encode(String value) { return URLEncoder.encode(value, StandardCharsets.UTF_8); }

    private static String field(String json, String name) {
        var match = java.util.regex.Pattern.compile("\\\"" + name + "\\\":\\\"([^\\\"]+)\\\"").matcher(json);
        assertTrue(match.find(), "Expected response field missing"); // Never print response/proof content.
        return match.group(1);
    }

    @Override public void close() {
        server.close(); // Stop Server/pool before the outer runner retains reports and drops its schema.
        captured.set(null);
    }

    private static final class PrincipalCapture extends OncePerRequestFilter {
        private final AtomicReference<ActorContext> captured;
        private final Supplier<SessionService> sessions;
        PrincipalCapture(AtomicReference<ActorContext> captured, Supplier<SessionService> sessions) {
            this.captured = captured;
            this.sessions = sessions;
        }

        @Override protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                FilterChain chain) throws ServletException, IOException {
            chain.doFilter(request, response);
            if ("GET".equals(request.getMethod()) && "/api/v1/identity/session".equals(request.getRequestURI())
                    && response.getStatus() == 200) {
                var authentication = SecurityContextHolder.getContext().getAuthentication();
                if (authentication != null && authentication.isAuthenticated()
                        && authentication.getPrincipal() instanceof SessionService.Identity identity) {
                    // Same established principal as the qualified route, not request parameters/headers.
                    captured.set(sessions.get().context(identity));
                }
            }
        }
    }
}
