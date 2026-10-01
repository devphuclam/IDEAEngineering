package com.idea.ddm.identity;

import static org.junit.jupiter.api.Assertions.*;

import com.idea.ddm.IdeaServerApplication;
import java.net.CookieManager;
import java.net.CookiePolicy;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.attribute.PosixFilePermissions;
import java.security.MessageDigest;
import java.sql.DriverManager;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.util.HexFormat;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.TimeUnit;
import org.flywaydb.core.Flyway;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.server.context.WebServerApplicationContext;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

/** Real child JVMs at one HTTP endpoint; only a migrator-owned UUID test schema is changed. */
class ServerRestartFlowTest {
    private static final Instant START = Instant.parse("2026-10-01T06:00:00Z");
    private String schema;
    private Path evidenceDirectory;
    private Path clockFile;
    private Process runtime;
    private int port;
    private int runtimeNumber;

    @BeforeEach
    void prepareOnlyAnOwnedUuidSchemaAndPrivateProcessFixtures() throws Exception {
        assertEquals("idea_ddm_app", env("IDEA_DATABASE_APP_USER"));
        assertEquals("idea_ddm_migrator", env("IDEA_DATABASE_MIGRATION_USER"));
        schema = "f03b_" + UUID.randomUUID().toString().replace("-", "");
        Flyway.configure().dataSource(url(), "idea_ddm_migrator", env("IDEA_DATABASE_MIGRATION_PASSWORD"))
                .schemas(schema).defaultSchema(schema).locations("classpath:db/migration")
                .cleanDisabled(true).load().migrate();
        try (var connection = migrator(); var statement = connection.createStatement()) {
            statement.execute("GRANT USAGE ON SCHEMA " + schema + " TO idea_ddm_app");
        }
        var buildDirectory = Path.of("target").toAbsolutePath();
        Files.createDirectories(buildDirectory);
        evidenceDirectory = Files.createTempDirectory(buildDirectory, "f03b-restart-",
                PosixFilePermissions.asFileAttribute(PosixFilePermissions.fromString("rwx------")));
        clockFile = privateFile("clock.txt");
        advanceTo(START);
    }

    @AfterEach
    void stopOnlyTheOwnedProcessBeforeRemovingOnlyTheOwnedSchema() throws Exception {
        try {
            stopRuntime();
        } finally {
            // Keep the shutdown failure, but still clean up once the exact child is dead.
            if ((runtime == null || !runtime.isAlive()) && schema != null && schema.matches("f03b_[a-f0-9]{32}")) {
                try (var connection = migrator(); var statement = connection.createStatement()) {
                    statement.execute("DROP SCHEMA IF EXISTS " + schema + " CASCADE");
                }
            }
        }
        // Private child logs remain under this source build's target/ for scoped evidence.
    }

    @Test
    void retainedSessionMetadataCannotRestoreAnOldCookieAcrossRealServerProcesses() throws Exception {
        var fixture = fixture();
        var stableIdentity = identityDigest();
        startRuntime(0);
        long firstPid = runtime.pid();
        var caller = client();
        assertEquals(200, login(caller, fixture).statusCode());
        assertEquals(200, get(caller, "/api/v1/identity/session").statusCode());
        var oldCookie = cookie(caller);
        var oldSession = latestSession(fixture.accountId());
        var beforeRestart = storage();
        var beforeRows = tableDigest("session_record");
        int endpoint = port;
        stopRuntime();

        startRuntime(endpoint);
        assertNotEquals(firstPid, runtime.pid(), "Runtime B is a distinct OS process");
        assertEquals(stableIdentity, identityDigest(), "Restart cannot rewrite identity or verifier");
        assertEquals(beforeRestart, storage(), "Startup creates no Actor, session or successful evidence");
        assertEquals(beforeRows, tableDigest("session_record"), "Retained metadata is not adopted or rewritten");
        var refused = replay(oldCookie);
        assertEquals(401, refused.statusCode());
        assertEquals("", refused.body());
        assertEquals(beforeRestart, storage(), "Old-cookie refusal cannot publish success or another session");
        assertEquals(beforeRows, tableDigest("session_record"));

        // Reuse the client's cookie jar: it still carries A's cookie when asking B for CSRF.
        advanceTo(START.plusSeconds(1));
        assertEquals(200, login(caller, fixture).statusCode());
        assertTrue(!oldCookie.equals(cookie(caller)), "Fresh sign-in must not adopt A's cookie");
        var current = get(caller, "/api/v1/identity/session");
        assertEquals(200, current.statusCode());
        assertEquals(fixture.actorId().toString(), field(current.body(), "actorId"));
        var freshSession = latestSession(fixture.accountId());
        assertNotEquals(oldSession.sessionId(), freshSession.sessionId());
        assertNotEquals(oldSession.runtimeId(), freshSession.runtimeId(), "Fresh session belongs to runtime B");
        assertEquals(oldSession, session(oldSession.sessionId()), "Old metadata remains historical and unchanged");
        assertEquals(stableIdentity, identityDigest());
        var afterFreshLogin = storage();
        assertEquals(beforeRestart.actors(), afterFreshLogin.actors());
        assertEquals(beforeRestart.accounts(), afterFreshLogin.accounts());
        assertEquals(beforeRestart.logins(), afterFreshLogin.logins());
        assertEquals(beforeRestart.sessions() + 1, afterFreshLogin.sessions());
        assertEquals(beforeRestart.acceptedOutcomes() + 1, afterFreshLogin.acceptedOutcomes());
        assertEquals(beforeRestart.acceptedAudit() + 1, afterFreshLogin.acceptedAudit());
    }

    @Test
    void revokedAndIdleExpiredCookiesRemainRefusedAfterProcessRestart() throws Exception {
        var fixture = fixture();
        var stableIdentity = identityDigest();
        startRuntime(0);
        var revoked = client();
        var expired = client();
        var live = client();
        assertEquals(200, login(revoked, fixture).statusCode());
        var revokedCookie = cookie(revoked);
        var revokedId = latestSession(fixture.accountId()).sessionId();
        var csrf = field(get(revoked, "/api/v1/identity/csrf").body(), "token");
        assertEquals(204, post(revoked, "/api/v1/identity/logout", csrf, "").statusCode());
        assertEquals(401, replay(revokedCookie).statusCode());
        assertNotNull(session(revokedId).revoked());

        advanceTo(START.plusSeconds(1));
        assertEquals(200, login(expired, fixture).statusCode());
        var expiredCookie = cookie(expired);
        var expiredId = latestSession(fixture.accountId()).sessionId();
        advanceTo(START.plusSeconds(2));
        assertEquals(200, login(live, fixture).statusCode());
        var liveCookie = cookie(live);
        var liveSession = latestSession(fixture.accountId());
        advanceTo(START.plusSeconds(3602));
        assertEquals(200, get(live, "/api/v1/identity/session").statusCode());
        advanceTo(START.plusSeconds(7202));
        assertEquals(401, replay(expiredCookie).statusCode());
        assertEquals(200, get(live, "/api/v1/identity/session").statusCode(), "Runtime A still has an eligible control session");
        var beforeRestart = storage();
        var beforeRows = tableDigest("session_record");
        int endpoint = port;
        stopRuntime();
        startRuntime(endpoint);
        for (var oldCookie : new String[] {revokedCookie, expiredCookie, liveCookie}) {
            assertEquals(401, replay(oldCookie).statusCode());
        }
        assertEquals(beforeRestart, storage());
        assertEquals(beforeRows, tableDigest("session_record"));
        assertEquals(stableIdentity, identityDigest());
        advanceTo(START.plusSeconds(7203));
        var fresh = client();
        assertEquals(200, login(fresh, fixture).statusCode());
        assertEquals(200, get(fresh, "/api/v1/identity/session").statusCode());
        assertNotEquals(liveSession.runtimeId(), latestSession(fixture.accountId()).runtimeId());
        assertNotNull(session(revokedId).revoked());
        assertEquals(START.plusSeconds(1), session(expiredId).activity(), "Expired metadata is not refreshed by replay");
        assertEquals(stableIdentity, identityDigest());
    }

    @Test
    void persistedLoginBlockSurvivesRestartUntilItsOriginalDeadline() throws Exception {
        var fixture = fixture();
        var stableIdentity = identityDigest();
        startRuntime(0);
        var live = client();
        assertEquals(200, login(live, fixture).statusCode());
        assertEquals(200, get(live, "/api/v1/identity/session").statusCode());
        var oldCookie = cookie(live);
        var oldSession = latestSession(fixture.accountId());
        var refused = client();
        for (int attempt = 0; attempt < 5; attempt++) {
            assertEquals(401, login(refused, fixture.login(), UUID.randomUUID().toString()).statusCode());
        }
        assertEquals(new FailureState(5, START.plusSeconds(900)), failureState());
        assertEquals(401, login(refused, fixture).statusCode());
        var beforeFailures = tableDigest("login_failure_state");
        var beforeRows = tableDigest("session_record");
        var beforeRestart = storage();
        int endpoint = port;
        stopRuntime();
        startRuntime(endpoint);
        assertEquals(beforeFailures, tableDigest("login_failure_state"), "Restart preserves durable DB security state");
        assertEquals(stableIdentity, identityDigest());
        assertEquals(401, replay(oldCookie).statusCode());
        var blocked = login(refused, fixture);
        assertEquals(401, blocked.statusCode());
        assertEquals("", blocked.body());
        assertEquals(beforeRestart, storage(), "Blocked sign-in publishes no accepted outcome or session");
        assertEquals(beforeRows, tableDigest("session_record"));
        assertEquals(beforeFailures, tableDigest("login_failure_state"), "Blocked retry cannot reset or extend the deadline");
        assertEquals(new FailureState(5, START.plusSeconds(900)), failureState());

        // This is a restart-continuity witness; detailed before/at/after boundaries stay in T041.
        advanceTo(START.plusSeconds(901));
        assertEquals(200, login(refused, fixture).statusCode());
        assertEquals(200, get(refused, "/api/v1/identity/session").statusCode());
        assertNull(failureState(), "Successful eligible sign-in clears surviving failure state");
        assertNotEquals(oldSession.runtimeId(), latestSession(fixture.accountId()).runtimeId());
        assertEquals(stableIdentity, identityDigest());
        assertEquals(401, replay(oldCookie).statusCode());
    }

    private record FailureState(int failures, Instant blockedUntil) {}

    private FailureState failureState() throws Exception {
        try (var connection = appDataSource().getConnection(); var statement = connection.createStatement();
                var row = statement.executeQuery("SELECT cardinality(failed_at),blocked_until FROM login_failure_state")) {
            if (!row.next()) return null;
            var state = new FailureState(row.getInt(1), row.getTimestamp(2).toInstant());
            assertFalse(row.next(), "Fixture has only one existing login's bounded failure state");
            return state;
        }
    }

    private void startRuntime(int requestedPort) throws Exception {
        assertNull(runtime, "Runtime A must be stopped before runtime B starts");
        int number = ++runtimeNumber;
        var ready = privateFile("ready-" + number + ".txt");
        var log = privateFile("runtime-" + number + ".log");
        var java = Path.of(System.getProperty("java.home"), "bin", "java").toString();
        var classpath = System.getProperty("surefire.test.class.path", System.getProperty("java.class.path"));
        runtime = new ProcessBuilder(java, "-cp", classpath, RestartRuntime.class.getName(),
                schema, Integer.toString(requestedPort), clockFile.toString(), ready.toString())
                .redirectErrorStream(true).redirectOutput(log.toFile()).start();
        long deadline = System.nanoTime() + Duration.ofSeconds(30).toNanos();
        while (Files.size(ready) == 0 && runtime.isAlive() && System.nanoTime() < deadline) {
            TimeUnit.MILLISECONDS.sleep(20); // Bounded readiness polling, not a behavior/timing oracle.
        }
        assertTrue(runtime.isAlive() && Files.size(ready) > 0,
                "Owned Server process must publish readiness; inspect its private runtime log");
        port = Integer.parseInt(Files.readString(ready).strip());
        if (requestedPort != 0) assertEquals(requestedPort, port, "Restart uses exactly the same endpoint");
        assertEquals(200, get(HttpClient.newHttpClient(), "/health").statusCode());
        System.out.printf("F03B_RESTART_RUNTIME=%d; pid=%d; port=%d; private_log=%s%n", number, runtime.pid(), port, log);
    }

    private void stopRuntime() throws Exception {
        if (runtime == null) return;
        var owned = runtime;
        owned.destroy();
        boolean graceful = owned.waitFor(15, TimeUnit.SECONDS);
        if (!graceful) {
            owned.destroyForcibly(); // Only the exact Process this test created.
            assertTrue(owned.waitFor(10, TimeUnit.SECONDS), "Owned child process must stop before schema cleanup");
        }
        assertFalse(owned.isAlive());
        runtime = null;
        assertTrue(graceful, "Normal qualification requires graceful process shutdown");
        var log = evidenceDirectory.resolve("runtime-" + runtimeNumber + ".log");
        System.out.printf("F03B_RESTART_STOPPED_PID=%d; log_sha256=%s%n", owned.pid(), digest(Files.readAllBytes(log)));
    }

    private Path privateFile(String name) throws Exception {
        return Files.createFile(evidenceDirectory.resolve(name),
                PosixFilePermissions.asFileAttribute(PosixFilePermissions.fromString("rw-------")));
    }

    private void advanceTo(Instant time) throws Exception { Files.writeString(clockFile, time.toString()); }

    private record Fixture(UUID actorId, UUID accountId, String login, String password) {}

    private Fixture fixture() {
        var login = "synthetic.restart." + UUID.randomUUID();
        var password = UUID.randomUUID().toString() + "-synthetic-only";
        var result = new AdministratorBootstrap(appDataSource()).initialize(UUID.randomUUID(),
                "Synthetic restart organization", "Synthetic restart custodian", login, password);
        return new Fixture(result.actorId(), result.accountId(), login, password);
    }

    private record Storage(long actors, long accounts, long logins, long sessions,
            long acceptedOutcomes, long acceptedAudit) {}

    private Storage storage() throws Exception {
        try (var connection = appDataSource().getConnection(); var statement = connection.createStatement();
                var row = statement.executeQuery("SELECT (SELECT count(*) FROM actor), (SELECT count(*) FROM idea_account), "
                        + "(SELECT count(*) FROM login_identity), (SELECT count(*) FROM session_record), "
                        + "(SELECT count(*) FROM iam_owner_outcome WHERE outcome='ACCEPTED'), "
                        + "(SELECT count(*) FROM audit_evidence WHERE outcome='ACCEPTED')")) {
            assertTrue(row.next());
            return new Storage(row.getLong(1), row.getLong(2), row.getLong(3), row.getLong(4), row.getLong(5), row.getLong(6));
        }
    }

    private record Session(UUID sessionId, UUID runtimeId, Instant issued, Instant activity, Instant expires, Instant revoked) {}

    private Session latestSession(UUID accountId) throws Exception {
        try (var connection = appDataSource().getConnection();
                var statement = connection.prepareStatement("SELECT session_id FROM session_record WHERE account_id=? "
                        + "ORDER BY issued_at DESC, session_id LIMIT 1")) {
            statement.setObject(1, accountId);
            try (var row = statement.executeQuery()) {
                assertTrue(row.next());
                return session(row.getObject(1, UUID.class));
            }
        }
    }

    private Session session(UUID sessionId) throws Exception {
        try (var connection = appDataSource().getConnection();
                var statement = connection.prepareStatement("SELECT session_id,runtime_instance_id,issued_at,"
                        + "last_eligible_activity_at,expires_at,revoked_at FROM session_record WHERE session_id=?")) {
            statement.setObject(1, sessionId);
            try (var row = statement.executeQuery()) {
                assertTrue(row.next());
                return new Session(row.getObject(1, UUID.class), row.getObject(2, UUID.class), row.getTimestamp(3).toInstant(),
                        row.getTimestamp(4).toInstant(), row.getTimestamp(5).toInstant(),
                        row.getTimestamp(6) == null ? null : row.getTimestamp(6).toInstant());
            }
        }
    }

    private String identityDigest() throws Exception {
        return tableDigest("actor") + tableDigest("idea_account") + tableDigest("login_identity");
    }

    private String tableDigest(String table) throws Exception {
        assertTrue(Set.of("actor", "idea_account", "login_identity", "session_record", "login_failure_state").contains(table));
        var hash = MessageDigest.getInstance("SHA-256");
        try (var connection = appDataSource().getConnection(); var statement = connection.createStatement();
                var rows = statement.executeQuery("SELECT to_jsonb(t)::text AS value FROM " + table + " t ORDER BY value")) {
            while (rows.next()) {
                hash.update(rows.getString(1).getBytes(StandardCharsets.UTF_8));
                hash.update((byte) '\n');
            }
        }
        return HexFormat.of().formatHex(hash.digest()); // Never emit credentials/verifiers or raw row snapshots.
    }

    private static String digest(byte[] bytes) throws Exception {
        return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(bytes));
    }

    private HttpResponse<String> login(HttpClient caller, Fixture fixture) throws Exception {
        return login(caller, fixture.login(), fixture.password());
    }

    private HttpResponse<String> login(HttpClient caller, String login, String password) throws Exception {
        var csrf = field(get(caller, "/api/v1/identity/csrf").body(), "token");
        return post(caller, "/api/v1/identity/login", csrf,
                "username=" + form(login) + "&password=" + form(password));
    }

    private HttpResponse<String> post(HttpClient caller, String path, String csrf, String body) throws Exception {
        return caller.send(HttpRequest.newBuilder(endpoint(path)).timeout(Duration.ofSeconds(10))
                .header("Content-Type", "application/x-www-form-urlencoded").header("X-CSRF-TOKEN", csrf)
                .POST(HttpRequest.BodyPublishers.ofString(body)).build(), HttpResponse.BodyHandlers.ofString());
    }

    private HttpResponse<String> get(HttpClient caller, String path) throws Exception {
        return caller.send(HttpRequest.newBuilder(endpoint(path)).timeout(Duration.ofSeconds(10)).GET().build(),
                HttpResponse.BodyHandlers.ofString());
    }

    private HttpResponse<String> replay(String oldCookie) throws Exception {
        return HttpClient.newHttpClient().send(HttpRequest.newBuilder(endpoint("/api/v1/identity/session"))
                .timeout(Duration.ofSeconds(10)).header("Cookie", "IDEA_SESSION=" + oldCookie).GET().build(),
                HttpResponse.BodyHandlers.ofString());
    }

    private URI endpoint(String path) { return URI.create("http://127.0.0.1:" + port + path); }

    private static HttpClient client() {
        return HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(10))
                .cookieHandler(new CookieManager(null, CookiePolicy.ACCEPT_ALL)).build();
    }

    private static String cookie(HttpClient client) {
        return ((CookieManager) client.cookieHandler().orElseThrow()).getCookieStore().getCookies().stream()
                .filter(value -> value.getName().equals("IDEA_SESSION")).findFirst().orElseThrow().getValue();
    }

    private static String field(String json, String name) {
        var match = java.util.regex.Pattern.compile("\"" + name + "\"\\s*:\\s*\"([^\"]+)\"").matcher(json);
        assertTrue(match.find(), "Expected response field: " + name);
        return match.group(1);
    }

    private static String form(String value) { return URLEncoder.encode(value, StandardCharsets.UTF_8); }

    private DriverManagerDataSource appDataSource() {
        return new DriverManagerDataSource(url() + "?currentSchema=" + schema, "idea_ddm_app", env("IDEA_DATABASE_APP_PASSWORD"));
    }

    private java.sql.Connection migrator() throws Exception {
        return DriverManager.getConnection(url(), "idea_ddm_migrator", env("IDEA_DATABASE_MIGRATION_PASSWORD"));
    }

    private static String url() {
        if (!"idea_ddm_f03a_20260930_c91e7a42".equals(env("IDEA_F03B_TEST_DATABASE_NAME"))) {
            throw new IllegalStateException("Only the authorized F03-B test database is allowed");
        }
        return "jdbc:postgresql://" + env("IDEA_DATABASE_HOST") + ":" + env("IDEA_DATABASE_PORT")
                + "/idea_ddm_f03a_20260930_c91e7a42";
    }

    private static String env(String key) {
        var value = System.getenv(key);
        if (value == null || value.isBlank()) throw new IllegalStateException("Missing test prerequisite: " + key);
        return value;
    }

    /** Test-classpath-only launcher. No production clock hook, public route or credential argument. */
    public static final class RestartRuntime {
        public static void main(String[] args) throws Exception {
            if (args.length != 4 || !args[0].matches("f03b_[a-f0-9]{32}")) {
                throw new IllegalArgumentException("Expected owned restart fixture inputs");
            }
            var clockPath = Path.of(args[2]);
            var server = new SpringApplicationBuilder(IdeaServerApplication.class)
                    .initializers(context -> context.getBeanFactory().registerSingleton("restartQualificationClock", new FileClock(clockPath, ZoneOffset.UTC)))
                    .run("--server.address=127.0.0.1", "--server.port=" + args[1],
                            "--spring.datasource.url=" + url() + "?currentSchema=" + args[0],
                            "--spring.datasource.username=idea_ddm_app", "--spring.flyway.enabled=false",
                            "--server.servlet.session.cookie.secure=false", "--spring.main.banner-mode=off",
                            "--logging.level.root=WARN");
            var actualPort = ((WebServerApplicationContext) server).getWebServer().getPort();
            Files.writeString(Path.of(args[3]), Integer.toString(actualPort));
        }
    }

    private static final class FileClock extends Clock {
        private final Path path;
        private final ZoneId zone;
        FileClock(Path path, ZoneId zone) { this.path = path; this.zone = zone; }
        @Override public ZoneId getZone() { return zone; }
        @Override public Clock withZone(ZoneId value) { return new FileClock(path, value); }
        @Override public Instant instant() {
            try { return Instant.parse(Files.readString(path).strip()); }
            catch (Exception exception) { throw new IllegalStateException("Restart qualification time unavailable", exception); }
        }
    }
}
