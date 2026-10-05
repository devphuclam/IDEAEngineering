package com.idea.ddm.identity;

import static org.junit.jupiter.api.Assertions.*;

import com.idea.ddm.IdeaServerApplication;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.*;
import java.net.http.*;
import java.nio.charset.StandardCharsets;
import java.time.Clock;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicReference;
import java.util.function.Supplier;
import javax.sql.DataSource;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.server.context.WebServerApplicationContext;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

/** Qualification-only bridge at the existing session route, never an F05 product route. */
public final class F05SessionFixture implements AutoCloseable {
    public record SignedIn(ActorContext context, UUID actorId, UUID accountId, UUID organizationId) {}
    private final ConfigurableApplicationContext server;
    private final DataSource app;
    private final AtomicReference<ActorContext> captured = new AtomicReference<>();
    private final CookieManager cookies = new CookieManager(null, CookiePolicy.ACCEPT_ALL);
    private final UUID organizationId = UUID.randomUUID();
    private final AdministratorBootstrap.Result identity;
    private final String login = "f05.synthetic." + UUID.randomUUID();
    private final String credential = UUID.randomUUID().toString();
    private final int port;

    public F05SessionFixture(String url, Clock clock) throws Exception {
        if (!url.matches("jdbc:postgresql://127\\.0\\.0\\.1:5432/idea_ddm_f05a_20261005_t028\\?currentSchema=f05_[0-9a-f]{32}"))
            throw new IllegalArgumentException("Unapproved F05 test target");
        app = new DriverManagerDataSource(url, "idea_ddm_app", F05DatabaseFixture.password("app"));
        identity = new AdministratorBootstrap(app).initialize(organizationId, "F05 Synthetic Organization",
                "F05 Synthetic Actor", login, credential);
        assertEquals(AdministratorBootstrap.State.INITIALIZED, identity.state());
        server = new SpringApplicationBuilder(IdeaServerApplication.class).initializers(context -> {
            context.getBeanFactory().registerSingleton("dataSource", app);
            context.getBeanFactory().registerSingleton("f05Clock", clock);
            context.getBeanFactory().registerSingleton("f05PrincipalCapture",
                    new Capture(captured, () -> context.getBean(SessionService.class)));
        }).run("--server.address=127.0.0.1", "--server.port=0", "--spring.datasource.url=" + url,
                "--spring.datasource.username=idea_ddm_app", "--spring.flyway.enabled=false",
                "--server.servlet.session.cookie.secure=false", "--server.ssl.enabled=false",
                "--idea.dev-api.enabled=false");
        port = ((WebServerApplicationContext) server).getWebServer().getPort();
    }

    public DataSource app() { return app; }
    public OwnerSessionEligibility eligibility() { return new OwnerSessionEligibility(server.getBean(SessionService.class)); }

    public SignedIn signIn() throws Exception {
        cookies.getCookieStore().removeAll(); // Each capture starts at the real anonymous boundary.
        var client = HttpClient.newBuilder().cookieHandler(cookies).build();
        assertEquals(401, get(client, "/api/v1/identity/session").statusCode());
        assertNull(captured.get());
        var csrf = get(client, "/api/v1/identity/csrf");
        assertEquals(200, csrf.statusCode());
        var response = client.send(HttpRequest.newBuilder(uri("/api/v1/identity/login"))
                .header("Content-Type", "application/x-www-form-urlencoded")
                .header(field(csrf.body(), "headerName"), field(csrf.body(), "token"))
                .POST(HttpRequest.BodyPublishers.ofString("username=" + encode(login) + "&password=" + encode(credential)))
                .build(), HttpResponse.BodyHandlers.ofString());
        assertEquals(200, response.statusCode(), "Synthetic real HTTP sign-in");
        assertEquals(identity.actorId().toString(), field(response.body(), "actorId"));
        captured.set(null);
        var forged = UUID.randomUUID();
        var session = client.send(HttpRequest.newBuilder(uri("/api/v1/identity/session?actorId=" + forged))
                .header("ActorId", forged.toString()).GET().build(), HttpResponse.BodyHandlers.discarding());
        assertEquals(200, session.statusCode());
        var established = captured.getAndSet(null);
        assertNotNull(established, "Only Server principal capture establishes the context");
        assertEquals(identity.actorId(), established.actorId());
        assertNotEquals(forged, established.actorId());
        return new SignedIn(established, identity.actorId(), identity.accountId(), organizationId);
    }

    private HttpResponse<String> get(HttpClient client, String path) throws Exception {
        return client.send(HttpRequest.newBuilder(uri(path)).GET().build(), HttpResponse.BodyHandlers.ofString());
    }
    private URI uri(String path) { return URI.create("http://127.0.0.1:" + port + path); }
    private static String encode(String value) { return URLEncoder.encode(value, StandardCharsets.UTF_8); }
    private static String field(String json, String name) {
        var match = java.util.regex.Pattern.compile("\\\"" + name + "\\\":\\\"([^\\\"]+)\\\"").matcher(json);
        assertTrue(match.find(), "Response field absent"); // Never include response/proof in diagnostics.
        return match.group(1);
    }
    @Override public void close() {
        server.close(); // The outer runner may only clean its marked schema after this shutdown.
        captured.set(null);
        cookies.getCookieStore().removeAll();
    }
    private static final class Capture extends OncePerRequestFilter {
        private final AtomicReference<ActorContext> captured;
        private final Supplier<SessionService> sessions;
        Capture(AtomicReference<ActorContext> captured, Supplier<SessionService> sessions) {
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
                        && authentication.getPrincipal() instanceof SessionService.Identity identity)
                    captured.set(sessions.get().context(identity));
            }
        }
    }
}
