package com.idea.ddm.identity;

import static org.junit.jupiter.api.Assertions.*;

import com.idea.ddm.IdeaServerApplication;
import jakarta.servlet.http.HttpSessionEvent;
import jakarta.servlet.http.HttpSessionListener;
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
import java.util.concurrent.atomic.AtomicInteger;
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
    private final AtomicInteger servletIdleSeconds = new AtomicInteger(-1);
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
        startHttpServer(true);
    }

    private void startHttpServer(boolean syntheticDelivery) {
        var arguments = new java.util.ArrayList<>(java.util.List.of(
                "--server.address=127.0.0.1", "--server.port=0",
                "--spring.datasource.url=" + url() + "?currentSchema=" + schema,
                "--spring.datasource.username=idea_ddm_app",
                "--spring.flyway.enabled=false",
                "--server.servlet.session.cookie.secure=false"));
        if (syntheticDelivery) arguments.add("--idea.identity.synthetic-credential-delivery.enabled=true");
        server = new SpringApplicationBuilder(IdeaServerApplication.class)
                .initializers(context -> {
                    context.getBeanFactory().registerSingleton("testIdentityClock", clock);
                    context.getBeanFactory().registerSingleton("testSessionBudgetListener", new HttpSessionListener() {
                        @Override public void sessionCreated(HttpSessionEvent event) {
                            servletIdleSeconds.set(event.getSession().getMaxInactiveInterval());
                        }
                    });
                }).run(arguments.toArray(String[]::new));
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
    void accountAdministratorV2IsAnExplicitAuditedAssignmentWithoutRetargetingV1() {
        var fixture = fixture();
        var roles = new RoleAssignmentAdministration(appDataSource());
        var context = new ActorContext(fixture.actorId(), 1);
        var v1 = roles.assignAccountAdministrator(context, UUID.randomUUID(), fixture.actorId(),
                UUID.fromString("9d80f77e-85a6-4c12-a72d-8ef6b7e0a002"), fixture.organizationId(),
                "Synthetic predecessor assignment");
        var predecessor = roles.inspect(v1.assignmentId());
        var operation = UUID.randomUUID();
        var v2 = roles.assignAccountAdministrator(context, operation, fixture.actorId(),
                UUID.fromString("9d80f77e-85a6-4c12-a72d-8ef6b7e0a003"), fixture.organizationId(),
                "Explicit synthetic credential administration assignment");
        var successor = roles.inspect(v2.assignmentId());
        assertEquals(predecessor, roles.inspect(v1.assignmentId()), "No silent predecessor retargeting");
        assertEquals(2, successor.version());
        assertEquals(fixture.actorId(), successor.assignedBy());
        assertEquals(fixture.organizationId(), successor.organizationId());
        assertEquals("Explicit synthetic credential administration assignment", successor.reason());
        assertEquals(new RoleAssignmentAdministration.Evidence("ACCEPTED", 1, 1), roles.evidence(operation));
    }

    @Test
    void explicitV2CanIssueFirstSetupAndProofHolderActivatesOnlyItsBoundAccount() throws Exception {
        var fixture = fixture();
        var context = new ActorContext(fixture.actorId(), 1);
        var app = appDataSource();
        new RoleAssignmentAdministration(app).assignAccountAdministrator(context, UUID.randomUUID(), fixture.actorId(),
                UUID.fromString("9d80f77e-85a6-4c12-a72d-8ef6b7e0a003"), fixture.organizationId(), "Synthetic v2 setup issuer");
        var accounts = new IdentityAdministration(app);
        var pending = accounts.create(context, UUID.randomUUID(), fixture.organizationId(),
                "Synthetic setup target", "synthetic.setup." + UUID.randomUUID());
        var issuer = signedIn(fixture);
        var issued = issueSetup(issuer, fixture.organizationId(), pending);
        assertEquals(200, issued.statusCode());
        assertTrue(issued.headers().firstValue("Cache-Control").orElseThrow().contains("no-store"));
        assertEquals("2026-09-30T06:15:00Z", jsonField(issued.body(), "expiresAt"));
        assertEquals("PENDING", accounts.inspect(pending.accountId()).status());
        var password = UUID.randomUUID().toString();
        var holder = client(); // Proof authority, not an Account Administrator session/assignment.
        var csrf = jsonField(get(holder, "/api/v1/identity/csrf").body(), "token");
        var redeemed = postJson(holder, "/api/v1/identity/credentials", csrf,
                redemption(pending.accountId(), jsonField(issued.body(), "proof"), password));
        assertEquals(204, redeemed.statusCode());
        var active = accounts.inspect(pending.accountId());
        assertEquals("ACTIVE", active.status());
        assertEquals(pending.actorId(), active.actorId());
        assertEquals(pending.loginIdentityId(), active.loginIdentityId());
        assertEquals(0, active.roleAssignments());
        var login = post(holder, "/api/v1/identity/login", csrf,
                "username=" + form(pending.normalizedLogin()) + "&password=" + form(password));
        assertEquals(200, login.statusCode());
        assertEquals(pending.actorId().toString(), jsonField(login.body(), "actorId"));
    }

    private HttpResponse<String> issueSetup(HttpClient issuer, UUID organization, IdentityAdministration.Account target)
            throws Exception {
        var csrf = jsonField(get(issuer, "/api/v1/identity/csrf").body(), "token");
        return postJson(issuer, "/api/v1/identity/accounts/" + target.accountId() + "/credential-proofs", csrf,
                "{\"operationId\":\"" + UUID.randomUUID() + "\",\"organizationId\":\"" + organization
                + "\",\"purpose\":\"FIRST_SETUP\",\"expectedSecurityVersion\":" + target.securityVersion()
                + ",\"reason\":\"Synthetic first credential setup\"}");
    }

    @Test
    void superAndV1CannotIssueProofWhileExplicitV2IsStillBoundToItsOrganization() throws Exception {
        var fixture = fixture();
        var context = new ActorContext(fixture.actorId(), 1);
        var roles = new RoleAssignmentAdministration(appDataSource());
        var issuer = signedIn(fixture);
        var nonexistent = new IdentityAdministration.Account(UUID.randomUUID(), UUID.randomUUID(), UUID.randomUUID(),
                fixture.organizationId(), "Synthetic", "synthetic", "PENDING", 1, 0);
        assertEquals(403, issueSetup(issuer, fixture.organizationId(), nonexistent).statusCode(), "Super-only has no setup permission");
        var predecessor = roles.assignAccountAdministrator(context, UUID.randomUUID(), fixture.actorId(),
                UUID.fromString("9d80f77e-85a6-4c12-a72d-8ef6b7e0a002"), fixture.organizationId(), "Synthetic v1");
        var pinnedV1 = roles.inspect(predecessor.assignmentId());
        var accounts = new IdentityAdministration(appDataSource());
        var target = accounts.create(context, UUID.randomUUID(), fixture.organizationId(), "Synthetic target",
                "synthetic.target." + UUID.randomUUID());
        assertEquals(403, issueSetup(issuer, fixture.organizationId(), target).statusCode(), "v1 must not acquire setup permission");
        assertThrows(IdentityRefusal.class, () -> roles.assignAccountAdministrator(context, UUID.randomUUID(),
                fixture.actorId(), UUID.randomUUID(), fixture.organizationId(), "Unsupported version remains refused"));
        roles.assignAccountAdministrator(context, UUID.randomUUID(), fixture.actorId(),
                UUID.fromString("9d80f77e-85a6-4c12-a72d-8ef6b7e0a003"), fixture.organizationId(), "Explicit synthetic v2");
        assertEquals(pinnedV1, roles.inspect(predecessor.assignmentId()));
        assertEquals(403, issueSetup(issuer, UUID.randomUUID(), target).statusCode(), "Wrong scope cannot issue proof");
        assertEquals(200, issueSetup(issuer, fixture.organizationId(), target).statusCode());
        var anonymous = client();
        assertEquals(401, issueSetup(anonymous, fixture.organizationId(), target).statusCode());
        var badCsrf = postJson(issuer, "/api/v1/identity/accounts/" + target.accountId() + "/credential-proofs",
                "incorrect-csrf", "{}");
        assertEquals(403, badCsrf.statusCode());
        assertEquals("PENDING", accounts.inspect(target.accountId()).status());
    }

    private String redemption(UUID account, String proof, String password) {
        return redemption(UUID.randomUUID(), account, proof, password);
    }

    private String redemption(UUID operation, UUID account, String proof, String password) {
        return "{\"operationId\":\"" + operation + "\",\"accountId\":\"" + account
                + "\",\"proof\":\"" + proof + "\",\"password\":\"" + password + "\"}";
    }

    private record SetupFixture(Fixture administrator, HttpClient issuer, IdentityAdministration.Account target) {}

    private SetupFixture setupFixture() throws Exception {
        var fixture = fixture();
        new RoleAssignmentAdministration(appDataSource()).assignAccountAdministrator(new ActorContext(fixture.actorId(), 1),
                UUID.randomUUID(), fixture.actorId(), UUID.fromString("9d80f77e-85a6-4c12-a72d-8ef6b7e0a003"),
                fixture.organizationId(), "Synthetic setup preparation");
        return new SetupFixture(fixture, signedIn(fixture), pendingTarget(fixture));
    }

    private IdentityAdministration.Account pendingTarget(Fixture fixture) {
        return new IdentityAdministration(appDataSource()).create(new ActorContext(fixture.actorId(), 1), UUID.randomUUID(),
                fixture.organizationId(), "Synthetic pending credential target", "synthetic.pending." + UUID.randomUUID());
    }

    private String proofFor(SetupFixture fixture, IdentityAdministration.Account target) throws Exception {
        var issued = issueSetup(fixture.issuer(), fixture.administrator().organizationId(), target);
        assertEquals(200, issued.statusCode());
        return jsonField(issued.body(), "proof");
    }

    private HttpResponse<String> redeem(HttpClient holder, UUID account, String proof, String password) throws Exception {
        return postJson(holder, "/api/v1/identity/credentials", jsonField(get(holder, "/api/v1/identity/csrf").body(), "token"),
                redemption(account, proof, password));
    }

    @Test
    void resetWhileDisabledChangesCredentialButRequiresSeparateReenableAndFreshSignin() throws Exception {
        var fixture = setupFixture();
        var accounts = new IdentityAdministration(appDataSource());
        var oldPassword = UUID.randomUUID().toString();
        assertEquals(204, redeem(client(), fixture.target().accountId(), proofFor(fixture, fixture.target()), oldPassword).statusCode());
        var active = accounts.inspect(fixture.target().accountId());
        var targetLogin = new Fixture(active.actorId(), active.accountId(), active.organizationId(), active.normalizedLogin(), oldPassword);
        var oldSessions = new HttpClient[] { signedIn(targetLogin), signedIn(targetLogin) };
        var context = new ActorContext(fixture.administrator().actorId(), 1);
        var disabled = accounts.disable(context, UUID.randomUUID(), active.organizationId(), active.accountId(),
                active.securityVersion(), "Synthetic compromised credential");
        var disabledAt = actorDisabledAt(disabled.actorId());
        assertNotNull(disabledAt);
        var issued = issueReset(fixture.issuer(), active.organizationId(), disabled);
        assertEquals(200, issued.statusCode(), "Recovery must not require enabling the compromised credential first");
        var password = UUID.randomUUID().toString();
        assertEquals(204, redeemReset(client(), disabled.accountId(), jsonField(issued.body(), "proof"), password).statusCode());
        var reset = accounts.inspect(disabled.accountId());
        assertEquals("DISABLED", reset.status());
        assertEquals(disabled.securityVersion() + 1, reset.securityVersion());
        assertEquals(disabled.actorId(), reset.actorId());
        assertEquals(disabled.loginIdentityId(), reset.loginIdentityId());
        assertEquals(disabledAt, actorDisabledAt(reset.actorId()), "Reset must preserve the original disablement timestamp");
        assertEquals(401, loginAttempt(client(), reset.normalizedLogin(), oldPassword).statusCode());
        assertEquals(401, loginAttempt(client(), reset.normalizedLogin(), password).statusCode());
        var enabled = accounts.reenable(context, UUID.randomUUID(), active.organizationId(), reset.accountId(),
                reset.securityVersion(), "Separate synthetic re-enable after recovery");
        assertEquals("ACTIVE", enabled.status());
        assertEquals(reset.securityVersion() + 1, enabled.securityVersion());
        for (var session : oldSessions) assertEquals(401, get(session, "/api/v1/identity/session").statusCode());
        assertEquals(401, loginAttempt(client(), enabled.normalizedLogin(), oldPassword).statusCode());
        assertEquals(200, loginAttempt(client(), enabled.normalizedLogin(), password).statusCode());
        assertEquals(200, get(fixture.issuer(), "/api/v1/identity/session").statusCode(), "Another account's session is not revoked");
    }

    private HttpResponse<String> issueReset(HttpClient issuer, UUID organization, IdentityAdministration.Account target) throws Exception {
        return issueReset(issuer, organization, target, target.loginIdentityId());
    }

    private HttpResponse<String> issueReset(HttpClient issuer, UUID organization, IdentityAdministration.Account target,
            UUID loginIdentity) throws Exception {
        return postJson(issuer, "/api/v1/identity/accounts/" + target.accountId() + "/credential-proofs",
                jsonField(get(issuer, "/api/v1/identity/csrf").body(), "token"),
                "{\"operationId\":\"" + UUID.randomUUID() + "\",\"organizationId\":\"" + organization
                + "\",\"purpose\":\"RESET\",\"expectedSecurityVersion\":" + target.securityVersion()
                + (loginIdentity == null ? "" : ",\"loginIdentityId\":\"" + loginIdentity + "\"")
                + ",\"reason\":\"Synthetic credential recovery without enablement\"}");
    }

    @Test
    void resetRequiresExplicitLoginIdentityEvenWhenAccountHasOnlyOneLogin() throws Exception {
        var fixture = setupFixture();
        var accounts = new IdentityAdministration(appDataSource());
        var target = accounts.inspect(fixture.administrator().accountId());
        var refused = issueReset(fixture.issuer(), target.organizationId(), target, null);
        assertEquals(400, refused.statusCode(), "RESET cannot infer even a single Login Identity");
        assertEquals("", refused.body());
        assertEquals(target, accounts.inspect(target.accountId()));
        assertEquals(200, get(fixture.issuer(), "/api/v1/identity/session").statusCode());
    }

    private record DualLoginFixture(SetupFixture setup, IdentityAdministration.Account account,
            Fixture first, UUID secondLoginIdentityId, Fixture second) {}

    private DualLoginFixture dualLoginFixture() throws Exception {
        var setup = setupFixture();
        var firstPassword = UUID.randomUUID().toString();
        assertEquals(204, redeem(client(), setup.target().accountId(), proofFor(setup, setup.target()), firstPassword).statusCode());
        var account = new IdentityAdministration(appDataSource()).inspect(setup.target().accountId());
        var secondId = UUID.randomUUID();
        var secondLogin = "synthetic.second." + UUID.randomUUID();
        var secondPassword = UUID.randomUUID().toString();
        // Fixture construction only: the controlled model permits multiple Login Identities.
        // The mutation under test still crosses the real HTTP authority/transaction boundary.
        try (var connection = migrator(); var insert = connection.prepareStatement("INSERT INTO " + schema
                + ".login_identity(login_identity_id,account_id,login_identifier,normalized_login_identifier,password_verifier) VALUES (?,?,?,?,?)")) {
            insert.setObject(1, secondId);
            insert.setObject(2, account.accountId());
            insert.setString(3, secondLogin);
            insert.setString(4, secondLogin);
            insert.setString(5, new NativePasswordVerifier().encodeNewCredential(secondPassword));
            assertEquals(1, insert.executeUpdate());
        }
        return new DualLoginFixture(setup, account,
                new Fixture(account.actorId(), account.accountId(), account.organizationId(), account.normalizedLogin(), firstPassword),
                secondId, new Fixture(account.actorId(), account.accountId(), account.organizationId(), secondLogin, secondPassword));
    }

    @Test
    void resetExplicitSecondLoginChangesOnlyItAndInvalidatesEveryAccountSession() throws Exception {
        var fixture = dualLoginFixture();
        var account = fixture.account();
        var oldFirst = signedIn(fixture.first());
        var oldSecond = signedIn(fixture.second());
        var siblingProof = issueReset(fixture.setup().issuer(), account.organizationId(), account, account.loginIdentityId());
        assertEquals(200, siblingProof.statusCode());
        var issued = issueReset(fixture.setup().issuer(), account.organizationId(), account, fixture.secondLoginIdentityId());
        assertEquals(200, issued.statusCode());
        var password = UUID.randomUUID().toString();
        var operation = UUID.randomUUID();
        assertEquals(204, redeemReset(client(), operation, account.accountId(), jsonField(issued.body(), "proof"), password).statusCode());
        assertEquals(200, loginAttempt(client(), fixture.second().login(), password).statusCode(), "Explicit L2, not the first row, must change");
        assertEquals(401, loginAttempt(client(), fixture.second().login(), fixture.second().password()).statusCode());
        assertEquals(200, loginAttempt(client(), fixture.first().login(), fixture.first().password()).statusCode());
        assertEquals(401, loginAttempt(client(), fixture.first().login(), password).statusCode());
        assertEquals(401, get(oldFirst, "/api/v1/identity/session").statusCode());
        assertEquals(401, get(oldSecond, "/api/v1/identity/session").statusCode());
        assertEquals(400, redeemReset(client(), account.accountId(), jsonField(siblingProof.body(), "proof"), UUID.randomUUID().toString()).statusCode());
        var accounts = new IdentityAdministration(appDataSource());
        assertEquals(account.securityVersion() + 1, accounts.inspect(account.accountId()).securityVersion());
        assertEquals(new IdentityAdministration.Evidence("ACCEPTED", 1, 1), accounts.evidence(operation));
        assertEquals(200, get(fixture.setup().issuer(), "/api/v1/identity/session").statusCode());
    }

    @Test
    void resetExplicitFirstLoginPreservesSecondCredentialAndRejectsReplay() throws Exception {
        var fixture = dualLoginFixture();
        var account = fixture.account();
        var oldFirst = signedIn(fixture.first());
        var oldSecond = signedIn(fixture.second());
        var siblingProof = issueReset(fixture.setup().issuer(), account.organizationId(), account, fixture.secondLoginIdentityId());
        assertEquals(200, siblingProof.statusCode());
        var issued = issueReset(fixture.setup().issuer(), account.organizationId(), account, account.loginIdentityId());
        assertEquals(200, issued.statusCode());
        var proof = jsonField(issued.body(), "proof");
        var password = UUID.randomUUID().toString();
        assertEquals(204, redeemReset(client(), account.accountId(), proof, password).statusCode());
        assertEquals(401, loginAttempt(client(), fixture.first().login(), fixture.first().password()).statusCode());
        assertEquals(200, loginAttempt(client(), fixture.first().login(), password).statusCode());
        assertEquals(200, loginAttempt(client(), fixture.second().login(), fixture.second().password()).statusCode());
        assertEquals(401, loginAttempt(client(), fixture.second().login(), password).statusCode());
        assertEquals(401, get(oldFirst, "/api/v1/identity/session").statusCode());
        assertEquals(401, get(oldSecond, "/api/v1/identity/session").statusCode());
        assertEquals(400, redeemReset(client(), account.accountId(), proof, UUID.randomUUID().toString()).statusCode());
        assertEquals(400, redeemReset(client(), account.accountId(), jsonField(siblingProof.body(), "proof"), UUID.randomUUID().toString()).statusCode());
        assertEquals(account.securityVersion() + 1, new IdentityAdministration(appDataSource()).inspect(account.accountId()).securityVersion());
    }

    @Test
    void resetRejectsUnknownForeignCredentiallessAndStaleExactLoginTargets() throws Exception {
        var fixture = dualLoginFixture();
        var accounts = new IdentityAdministration(appDataSource());
        var account = fixture.account();
        var noCredentialId = UUID.randomUUID();
        var noCredentialLogin = "synthetic.no-credential." + UUID.randomUUID();
        try (var connection = migrator(); var insert = connection.prepareStatement("INSERT INTO " + schema
                + ".login_identity(login_identity_id,account_id,login_identifier,normalized_login_identifier,password_verifier) VALUES (?,?,?,?,NULL)")) {
            insert.setObject(1, noCredentialId);
            insert.setObject(2, account.accountId());
            insert.setString(3, noCredentialLogin);
            insert.setString(4, noCredentialLogin);
            assertEquals(1, insert.executeUpdate());
        }
        var foreignLogin = accounts.inspect(fixture.setup().administrator().accountId()).loginIdentityId();
        var firstSession = signedIn(fixture.first());
        var secondSession = signedIn(fixture.second());
        var beforeHistory = accounts.history(account.accountId());
        for (var invalid : new UUID[] { UUID.randomUUID(), foreignLogin, noCredentialId }) {
            var refused = issueReset(fixture.setup().issuer(), account.organizationId(), account, invalid);
            assertEquals(403, refused.statusCode());
            assertEquals("", refused.body(), "No existence/credential diagnostics or proof on refusal");
        }
        assertEquals(403, issueReset(fixture.setup().issuer(), UUID.randomUUID(), account, account.loginIdentityId()).statusCode());
        var stale = new IdentityAdministration.Account(account.actorId(), account.accountId(), account.loginIdentityId(),
                account.organizationId(), account.displayName(), account.normalizedLogin(), account.status(), account.securityVersion() + 1,
                account.roleAssignments());
        assertEquals(403, issueReset(fixture.setup().issuer(), account.organizationId(), stale, fixture.secondLoginIdentityId()).statusCode());
        var nullSelector = postJson(fixture.setup().issuer(), "/api/v1/identity/accounts/" + account.accountId() + "/credential-proofs",
                jsonField(get(fixture.setup().issuer(), "/api/v1/identity/csrf").body(), "token"),
                "{\"operationId\":\"" + UUID.randomUUID() + "\",\"organizationId\":\"" + account.organizationId()
                + "\",\"purpose\":\"RESET\",\"expectedSecurityVersion\":" + account.securityVersion()
                + ",\"loginIdentityId\":null,\"reason\":\"Synthetic explicit null refusal\"}");
        assertEquals(400, nullSelector.statusCode());
        assertEquals("", nullSelector.body());
        assertEquals(account.securityVersion(), accounts.inspect(account.accountId()).securityVersion());
        assertEquals(beforeHistory, accounts.history(account.accountId()));
        assertEquals(200, get(firstSession, "/api/v1/identity/session").statusCode());
        assertEquals(200, get(secondSession, "/api/v1/identity/session").statusCode());
        assertEquals(200, loginAttempt(client(), fixture.first().login(), fixture.first().password()).statusCode());
        assertEquals(200, loginAttempt(client(), fixture.second().login(), fixture.second().password()).statusCode());
    }

    @Test
    void disabledTwoLoginResetPreservesDisablementAndSiblingCredentialUntilSeparateReenable() throws Exception {
        var fixture = dualLoginFixture();
        var account = fixture.account();
        var accounts = new IdentityAdministration(appDataSource());
        var oldFirst = signedIn(fixture.first());
        var oldSecond = signedIn(fixture.second());
        var authority = new ActorContext(fixture.setup().administrator().actorId(), 1);
        var disabled = accounts.disable(authority, UUID.randomUUID(), account.organizationId(), account.accountId(),
                account.securityVersion(), "Synthetic dual-login compromise");
        var disabledAt = actorDisabledAt(account.actorId());
        assertNotNull(disabledAt);
        var sibling = issueReset(fixture.setup().issuer(), account.organizationId(), disabled, account.loginIdentityId());
        assertEquals(200, sibling.statusCode());
        var issued = issueReset(fixture.setup().issuer(), account.organizationId(), disabled, fixture.secondLoginIdentityId());
        assertEquals(200, issued.statusCode());
        var password = UUID.randomUUID().toString();
        assertEquals(204, redeemReset(client(), account.accountId(), jsonField(issued.body(), "proof"), password).statusCode());
        var reset = accounts.inspect(account.accountId());
        assertEquals("DISABLED", reset.status());
        assertEquals(disabled.securityVersion() + 1, reset.securityVersion());
        assertEquals(account.actorId(), reset.actorId());
        assertEquals(disabledAt, actorDisabledAt(account.actorId()));
        assertEquals(401, loginAttempt(client(), fixture.first().login(), fixture.first().password()).statusCode());
        assertEquals(401, loginAttempt(client(), fixture.second().login(), password).statusCode());
        assertEquals(400, redeemReset(client(), account.accountId(), jsonField(sibling.body(), "proof"), UUID.randomUUID().toString()).statusCode());
        var enabled = accounts.reenable(authority, UUID.randomUUID(), account.organizationId(), account.accountId(),
                reset.securityVersion(), "Separate enablement after selected-login recovery");
        assertEquals("ACTIVE", enabled.status());
        assertEquals(reset.securityVersion() + 1, enabled.securityVersion());
        assertEquals(200, loginAttempt(client(), fixture.first().login(), fixture.first().password()).statusCode());
        assertEquals(401, loginAttempt(client(), fixture.first().login(), password).statusCode());
        assertEquals(401, loginAttempt(client(), fixture.second().login(), fixture.second().password()).statusCode());
        assertEquals(200, loginAttempt(client(), fixture.second().login(), password).statusCode());
        assertEquals(401, get(oldFirst, "/api/v1/identity/session").statusCode());
        assertEquals(401, get(oldSecond, "/api/v1/identity/session").statusCode());
        assertEquals(200, get(fixture.setup().issuer(), "/api/v1/identity/session").statusCode());
    }

    @Test
    void twoLoginResetAuditFailureRollsBackAndRedemptionCannotRetargetPinnedLogin() throws Exception {
        var fixture = dualLoginFixture();
        var account = fixture.account();
        var accounts = new IdentityAdministration(appDataSource());
        var oldFirst = signedIn(fixture.first());
        var oldSecond = signedIn(fixture.second());
        var issued = issueReset(fixture.setup().issuer(), account.organizationId(), account, fixture.secondLoginIdentityId());
        assertEquals(200, issued.statusCode());
        var operation = UUID.randomUUID();
        var password = UUID.randomUUID().toString();
        var beforeHistory = accounts.history(account.accountId());
        var holder = client();
        var csrf = jsonField(get(holder, "/api/v1/identity/csrf").body(), "token");
        var body = redemption(operation, account.accountId(), jsonField(issued.body(), "proof"), password);
        body = body.substring(0, body.length() - 1) + ",\"purpose\":\"RESET\",\"loginIdentityId\":\"" + account.loginIdentityId() + "\"}";
        try (var connection = migrator(); var statement = connection.createStatement()) {
            statement.execute("CREATE FUNCTION " + schema + ".suppress_dual_reset_audit() RETURNS trigger LANGUAGE plpgsql AS $$ "
                    + "BEGIN IF NEW.action='account.credential.reset.redeem' THEN RETURN NULL; END IF; RETURN NEW; END $$");
            statement.execute("CREATE TRIGGER suppress_dual_reset_audit BEFORE INSERT ON " + schema
                    + ".audit_evidence FOR EACH ROW EXECUTE FUNCTION " + schema + ".suppress_dual_reset_audit()");
        }
        try {
            var refused = postJson(holder, "/api/v1/identity/credentials", csrf, body);
            assertEquals(503, refused.statusCode());
            assertEquals("", refused.body());
            assertEquals(account.securityVersion(), accounts.inspect(account.accountId()).securityVersion());
            assertEquals(beforeHistory, accounts.history(account.accountId()));
            assertEquals(new IdentityAdministration.Evidence(null, 0, 0), accounts.evidence(operation));
            assertEquals(200, get(oldFirst, "/api/v1/identity/session").statusCode());
            assertEquals(200, get(oldSecond, "/api/v1/identity/session").statusCode());
            assertEquals(200, loginAttempt(client(), fixture.first().login(), fixture.first().password()).statusCode());
            assertEquals(200, loginAttempt(client(), fixture.second().login(), fixture.second().password()).statusCode());
            assertEquals(401, loginAttempt(client(), fixture.second().login(), password).statusCode());
        } finally {
            try (var connection = migrator(); var statement = connection.createStatement()) {
                statement.execute("DROP TRIGGER suppress_dual_reset_audit ON " + schema + ".audit_evidence");
            }
        }
        assertEquals(204, postJson(holder, "/api/v1/identity/credentials", csrf, body).statusCode(), "Failed audit did not consume proof");
        assertEquals(200, loginAttempt(client(), fixture.second().login(), password).statusCode(), "Proof-pinned L2 beats untrusted L1 selector");
        assertEquals(401, loginAttempt(client(), fixture.second().login(), fixture.second().password()).statusCode());
        assertEquals(200, loginAttempt(client(), fixture.first().login(), fixture.first().password()).statusCode());
        assertEquals(401, loginAttempt(client(), fixture.first().login(), password).statusCode());
        assertEquals(401, get(oldFirst, "/api/v1/identity/session").statusCode());
        assertEquals(401, get(oldSecond, "/api/v1/identity/session").statusCode());
        assertEquals(account.securityVersion() + 1, accounts.inspect(account.accountId()).securityVersion());
        assertEquals(new IdentityAdministration.Evidence("ACCEPTED", 1, 1), accounts.evidence(operation));
    }

    @Test
    void activeResetIsProofAuthorizedAndRevokesEveryOldSessionAndSameVersionProof() throws Exception {
        var fixture = setupFixture();
        var accounts = new IdentityAdministration(appDataSource());
        var oldPassword = UUID.randomUUID().toString();
        assertEquals(204, redeem(client(), fixture.target().accountId(), proofFor(fixture, fixture.target()), oldPassword).statusCode());
        var active = accounts.inspect(fixture.target().accountId());
        var oldLogin = new Fixture(active.actorId(), active.accountId(), active.organizationId(), active.normalizedLogin(), oldPassword);
        var first = signedIn(oldLogin);
        var second = signedIn(oldLogin);
        var issued = issueReset(fixture.issuer(), active.organizationId(), active);
        var another = issueReset(fixture.issuer(), active.organizationId(), active);
        assertEquals(200, issued.statusCode());
        assertEquals(200, another.statusCode());
        assertTrue(issued.headers().firstValue("Cache-Control").orElseThrow().contains("no-store"));
        assertEquals("2026-09-30T06:15:00Z", jsonField(issued.body(), "expiresAt"));
        var holder = client(); // No administrative role/session is required for proof redemption.
        var proof = jsonField(issued.body(), "proof");
        assertEquals(400, redeem(holder, active.accountId(), proof, UUID.randomUUID().toString()).statusCode(), "Reset proof is not first setup");
        assertEquals(400, redeemReset(holder, UUID.randomUUID(), proof, UUID.randomUUID().toString()).statusCode());
        assertEquals(400, redeemReset(holder, active.accountId(), proof, "a".repeat(14)).statusCode());
        assertEquals(403, postJson(holder, "/api/v1/identity/credentials", "incorrect-csrf",
                redemption(active.accountId(), proof, UUID.randomUUID().toString()).replace("}", ",\"purpose\":\"RESET\"}")).statusCode());
        assertEquals(active, accounts.inspect(active.accountId()));
        assertEquals(200, get(first, "/api/v1/identity/session").statusCode());
        var operation = UUID.randomUUID();
        var password = UUID.randomUUID().toString();
        assertEquals(204, redeemReset(holder, operation, active.accountId(), proof, password).statusCode());
        var reset = accounts.inspect(active.accountId());
        assertEquals("ACTIVE", reset.status());
        assertEquals(active.securityVersion() + 1, reset.securityVersion());
        assertEquals(active.actorId(), reset.actorId());
        assertEquals(active.loginIdentityId(), reset.loginIdentityId());
        assertEquals(active.roleAssignments(), reset.roleAssignments());
        assertEquals(new IdentityAdministration.Evidence("ACCEPTED", 1, 1), accounts.evidence(operation));
        assertEquals(401, get(first, "/api/v1/identity/session").statusCode());
        assertEquals(401, get(second, "/api/v1/identity/session").statusCode());
        assertEquals(400, redeemReset(holder, active.accountId(), proof, UUID.randomUUID().toString()).statusCode());
        assertEquals(400, redeemReset(holder, active.accountId(), jsonField(another.body(), "proof"), UUID.randomUUID().toString()).statusCode());
        assertEquals(401, loginAttempt(client(), active.normalizedLogin(), oldPassword).statusCode());
        assertEquals(200, loginAttempt(client(), active.normalizedLogin(), password).statusCode());
        assertEquals(200, get(fixture.issuer(), "/api/v1/identity/session").statusCode());
        try (var connection = appDataSource().getConnection(); var query = connection.prepareStatement(
                "SELECT count(*) FROM session_record WHERE account_id=? AND security_version=? AND revoked_at IS NULL")) {
            query.setObject(1, active.accountId());
            query.setLong(2, active.securityVersion());
            try (var row = query.executeQuery()) { assertTrue(row.next()); assertEquals(0, row.getLong(1)); }
        }
    }

    private HttpResponse<String> redeemReset(HttpClient holder, UUID account, String proof, String password) throws Exception {
        return redeemReset(holder, UUID.randomUUID(), account, proof, password);
    }

    @Test
    void resetIssuanceRequiresExplicitV2ScopeEligibleSessionAndSyntheticOptIn() throws Exception {
        var fixture = fixture();
        var context = new ActorContext(fixture.actorId(), 1);
        var accounts = new IdentityAdministration(appDataSource());
        var target = accounts.inspect(fixture.accountId());
        var issuer = signedIn(fixture);
        assertEquals(403, issueReset(issuer, fixture.organizationId(), target).statusCode(), "Super is not a reset issuer");
        var roles = new RoleAssignmentAdministration(appDataSource());
        var v1 = roles.assignAccountAdministrator(context, UUID.randomUUID(), fixture.actorId(),
                UUID.fromString("9d80f77e-85a6-4c12-a72d-8ef6b7e0a002"), fixture.organizationId(), "Synthetic v1 reset refusal");
        var unchanged = roles.inspect(v1.assignmentId());
        assertEquals(403, issueReset(issuer, fixture.organizationId(), target).statusCode(), "v1 is not silently expanded");
        roles.assignAccountAdministrator(context, UUID.randomUUID(), fixture.actorId(),
                UUID.fromString("9d80f77e-85a6-4c12-a72d-8ef6b7e0a003"), fixture.organizationId(), "Explicit v2 reset issuer");
        assertEquals(unchanged, roles.inspect(v1.assignmentId()));
        target = accounts.inspect(fixture.accountId()); // Explicit role grants above intentionally changed assignment count.
        assertEquals(403, issueReset(issuer, UUID.randomUUID(), target).statusCode());
        assertEquals(401, issueReset(client(), fixture.organizationId(), target).statusCode());
        var pending = pendingTarget(fixture);
        assertEquals(403, issueReset(issuer, fixture.organizationId(), pending).statusCode(), "No credential to reset");
        assertEquals(200, issueReset(issuer, fixture.organizationId(), target).statusCode());
        clock.advanceTo(Instant.parse("2026-09-30T08:00:00Z"));
        assertEquals(401, issueReset(issuer, fixture.organizationId(), target).statusCode());
        assertEquals(200, issueReset(signedIn(fixture), fixture.organizationId(), target).statusCode());
        server.close();
        startHttpServer(false);
        var refused = issueReset(signedIn(fixture), fixture.organizationId(), target);
        assertEquals(503, refused.statusCode());
        assertEquals("", refused.body());
        assertEquals(target, accounts.inspect(target.accountId()), "Issuing/refusing proof changes no target enablement/credential version");
    }

    private HttpResponse<String> redeemReset(HttpClient holder, UUID operation, UUID account, String proof, String password) throws Exception {
        var body = redemption(operation, account, proof, password);
        return postJson(holder, "/api/v1/identity/credentials", jsonField(get(holder, "/api/v1/identity/csrf").body(), "token"),
                body.substring(0, body.length() - 1) + ",\"purpose\":\"RESET\"}");
    }

    private HttpResponse<String> loginAttempt(HttpClient caller, String login, String password) throws Exception {
        return post(caller, "/api/v1/identity/login", jsonField(get(caller, "/api/v1/identity/csrf").body(), "token"),
                "username=" + form(login) + "&password=" + form(password));
    }

    private java.sql.Timestamp actorDisabledAt(UUID actor) throws Exception {
        try (var connection = appDataSource().getConnection(); var query = connection.prepareStatement(
                "SELECT disabled_at FROM actor WHERE actor_id=?")) {
            query.setObject(1, actor);
            try (var row = query.executeQuery()) { assertTrue(row.next()); return row.getTimestamp(1); }
        }
    }

    @Test
    void missingResetAuditRollsBackPasswordVersionSessionsAndProofConsumption() throws Exception {
        requiredResetFailure("audit_evidence");
    }

    @Test
    void missingResetIamOutcomeRollsBackPasswordVersionSessionsAndProofConsumption() throws Exception {
        requiredResetFailure("iam_owner_outcome");
    }

    @Test
    void suppressedSessionRevocationCannotCommitCredentialReset() throws Exception {
        requiredResetFailure("session_record");
    }

    private void requiredResetFailure(String table) throws Exception {
        assertTrue(java.util.Set.of("audit_evidence", "iam_owner_outcome", "session_record").contains(table));
        var fixture = setupFixture();
        var oldPassword = UUID.randomUUID().toString();
        assertEquals(204, redeem(client(), fixture.target().accountId(), proofFor(fixture, fixture.target()), oldPassword).statusCode());
        var accounts = new IdentityAdministration(appDataSource());
        var active = accounts.inspect(fixture.target().accountId());
        var oldSession = signedIn(new Fixture(active.actorId(), active.accountId(), active.organizationId(), active.normalizedLogin(), oldPassword));
        var issued = issueReset(fixture.issuer(), active.organizationId(), active);
        assertEquals(200, issued.statusCode());
        var proof = jsonField(issued.body(), "proof");
        var operation = UUID.randomUUID();
        var password = UUID.randomUUID().toString();
        var history = accounts.history(active.accountId());
        var sessionFault = table.equals("session_record");
        try (var connection = migrator(); var statement = connection.createStatement()) {
            statement.execute("CREATE FUNCTION " + schema + ".suppress_reset() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN IF "
                    + (sessionFault ? "NEW.revoked_at IS NOT NULL AND OLD.revoked_at IS NULL" : "NEW.action='account.credential.reset.redeem'")
                    + " THEN RETURN NULL; END IF; RETURN NEW; END $$");
            statement.execute("CREATE TRIGGER suppress_reset BEFORE " + (sessionFault ? "UPDATE" : "INSERT") + " ON "
                    + schema + "." + table + " FOR EACH ROW EXECUTE FUNCTION " + schema + ".suppress_reset()");
        }
        try {
            var refused = redeemReset(client(), operation, active.accountId(), proof, password);
            assertEquals(503, refused.statusCode());
            assertEquals("", refused.body());
            assertEquals(active, accounts.inspect(active.accountId()));
            assertEquals(history, accounts.history(active.accountId()));
            assertEquals(new IdentityAdministration.Evidence(null, 0, 0), accounts.evidence(operation));
            assertEquals(200, get(oldSession, "/api/v1/identity/session").statusCode());
            assertEquals(401, loginAttempt(client(), active.normalizedLogin(), password).statusCode());
            assertEquals(200, loginAttempt(client(), active.normalizedLogin(), oldPassword).statusCode());
        } finally {
            try (var connection = migrator(); var statement = connection.createStatement()) {
                statement.execute("DROP TRIGGER suppress_reset ON " + schema + "." + table);
            }
        }
        assertEquals(204, redeemReset(client(), operation, active.accountId(), proof, password).statusCode(), "Failed transaction did not consume proof");
        assertEquals(active.securityVersion() + 1, accounts.inspect(active.accountId()).securityVersion());
        assertEquals(new IdentityAdministration.Evidence("ACCEPTED", 1, 1), accounts.evidence(operation));
        assertEquals(history.size() + 1, accounts.history(active.accountId()).size());
        assertEquals(401, get(oldSession, "/api/v1/identity/session").statusCode());
        assertEquals(200, loginAttempt(client(), active.normalizedLogin(), password).statusCode());
    }

    @Test
    void resetProofExpiresAtFifteenMinutesAndCannotCrossSecurityTransitions() throws Exception {
        var fixture = setupFixture();
        var accounts = new IdentityAdministration(appDataSource());
        var targets = new IdentityAdministration.Account[] { fixture.target(), pendingTarget(fixture.administrator()),
                pendingTarget(fixture.administrator()) };
        var proofs = new String[3];
        for (int index = 0; index < targets.length; index++) {
            assertEquals(204, redeem(client(), targets[index].accountId(), proofFor(fixture, targets[index]), UUID.randomUUID().toString()).statusCode());
            targets[index] = accounts.inspect(targets[index].accountId());
            var issued = issueReset(fixture.issuer(), targets[index].organizationId(), targets[index]);
            assertEquals(200, issued.statusCode());
            proofs[index] = jsonField(issued.body(), "proof");
        }
        clock.advanceTo(Instant.parse("2026-09-30T06:14:59.999999Z"));
        assertEquals(204, redeemReset(client(), targets[0].accountId(), proofs[0], UUID.randomUUID().toString()).statusCode());
        clock.advanceTo(Instant.parse("2026-09-30T06:15:00Z"));
        assertEquals(400, redeemReset(client(), targets[1].accountId(), proofs[1], UUID.randomUUID().toString()).statusCode());
        clock.advanceTo(Instant.parse("2026-09-30T06:15:00.000001Z"));
        assertEquals(400, redeemReset(client(), targets[2].accountId(), proofs[2], UUID.randomUUID().toString()).statusCode());
        assertEquals(targets[1], accounts.inspect(targets[1].accountId()));
        assertEquals(targets[2], accounts.inspect(targets[2].accountId()));
        var current = targets[1];
        var issuedBeforeDisable = issueReset(fixture.issuer(), current.organizationId(), current);
        assertEquals(200, issuedBeforeDisable.statusCode());
        var context = new ActorContext(fixture.administrator().actorId(), 1);
        var disabled = accounts.disable(context, UUID.randomUUID(), current.organizationId(), current.accountId(),
                current.securityVersion(), "Synthetic stale-proof disablement");
        assertEquals(400, redeemReset(client(), disabled.accountId(), jsonField(issuedBeforeDisable.body(), "proof"), UUID.randomUUID().toString()).statusCode());
        var issuedWhileDisabled = issueReset(fixture.issuer(), current.organizationId(), disabled);
        assertEquals(200, issuedWhileDisabled.statusCode());
        var reenabled = accounts.reenable(context, UUID.randomUUID(), current.organizationId(), disabled.accountId(),
                disabled.securityVersion(), "Synthetic separate re-enable invalidates prior proof");
        assertEquals(400, redeemReset(client(), reenabled.accountId(), jsonField(issuedWhileDisabled.body(), "proof"), UUID.randomUUID().toString()).statusCode());
        assertEquals(reenabled, accounts.inspect(reenabled.accountId()));
        var fresh = issueReset(fixture.issuer(), current.organizationId(), reenabled);
        assertEquals(200, fresh.statusCode());
        assertEquals(204, redeemReset(client(), reenabled.accountId(), jsonField(fresh.body(), "proof"), UUID.randomUUID().toString()).statusCode());
    }

    @Test
    void firstSetupProofCannotBecomeResetProofOrBeConsumedByResetRefusal() throws Exception {
        var fixture = setupFixture();
        var proof = proofFor(fixture, fixture.target());
        assertEquals(400, redeemReset(client(), fixture.target().accountId(), proof, UUID.randomUUID().toString()).statusCode());
        assertEquals(fixture.target(), new IdentityAdministration(appDataSource()).inspect(fixture.target().accountId()));
        assertEquals(204, redeem(client(), fixture.target().accountId(), proof, UUID.randomUUID().toString()).statusCode());
    }

    @Test
    void concurrentResetAcceptsOneCredentialAndOneAuditedVersionChange() throws Exception {
        var fixture = setupFixture();
        var oldPassword = UUID.randomUUID().toString();
        assertEquals(204, redeem(client(), fixture.target().accountId(), proofFor(fixture, fixture.target()), oldPassword).statusCode());
        var accounts = new IdentityAdministration(appDataSource());
        var active = accounts.inspect(fixture.target().accountId());
        var oldSession = signedIn(new Fixture(active.actorId(), active.accountId(), active.organizationId(), active.normalizedLogin(), oldPassword));
        var issued = issueReset(fixture.issuer(), active.organizationId(), active);
        assertEquals(200, issued.statusCode());
        var proof = jsonField(issued.body(), "proof");
        var before = accounts.history(active.accountId()).size();
        var clients = new HttpClient[] { client(), client() };
        var tokens = new String[] { jsonField(get(clients[0], "/api/v1/identity/csrf").body(), "token"),
                jsonField(get(clients[1], "/api/v1/identity/csrf").body(), "token") };
        var operations = new UUID[] { UUID.randomUUID(), UUID.randomUUID() };
        var passwords = new String[] { UUID.randomUUID().toString(), UUID.randomUUID().toString() };
        var ready = new java.util.concurrent.CountDownLatch(2);
        var start = new java.util.concurrent.CountDownLatch(1);
        try (var executor = java.util.concurrent.Executors.newVirtualThreadPerTaskExecutor()) {
            var attempts = new java.util.ArrayList<java.util.concurrent.Future<Integer>>();
            for (int index = 0; index < 2; index++) {
                final int attempt = index;
                attempts.add(executor.submit(() -> {
                    ready.countDown();
                    assertTrue(start.await(10, java.util.concurrent.TimeUnit.SECONDS));
                    var body = redemption(operations[attempt], active.accountId(), proof, passwords[attempt]);
                    return postJson(clients[attempt], "/api/v1/identity/credentials", tokens[attempt],
                            body.substring(0, body.length() - 1) + ",\"purpose\":\"RESET\"}").statusCode();
                }));
            }
            assertTrue(ready.await(10, java.util.concurrent.TimeUnit.SECONDS));
            start.countDown();
            var statuses = new int[] { attempts.get(0).get(10, java.util.concurrent.TimeUnit.SECONDS),
                    attempts.get(1).get(10, java.util.concurrent.TimeUnit.SECONDS) };
            assertArrayEquals(new int[] { 204, 400 }, java.util.Arrays.stream(statuses).sorted().toArray());
            int winner = statuses[0] == 204 ? 0 : 1;
            assertEquals(new IdentityAdministration.Evidence("ACCEPTED", 1, 1), accounts.evidence(operations[winner]));
            assertEquals(new IdentityAdministration.Evidence(null, 0, 0), accounts.evidence(operations[1 - winner]));
            assertEquals(before + 1, accounts.history(active.accountId()).size());
            assertEquals(active.securityVersion() + 1, accounts.inspect(active.accountId()).securityVersion());
            assertEquals(401, get(oldSession, "/api/v1/identity/session").statusCode());
            assertEquals(401, loginAttempt(client(), active.normalizedLogin(), oldPassword).statusCode());
            assertEquals(401, loginAttempt(client(), active.normalizedLogin(), passwords[1 - winner]).statusCode());
            assertEquals(200, loginAttempt(client(), active.normalizedLogin(), passwords[winner]).statusCode());
        }
    }

    @Test
    void resetProofBindingIsMigratorOwnedAndRuntimeCannotRetargetOrDeleteIt() throws Exception {
        var fixture = setupFixture();
        proofFor(fixture, fixture.target()); // The predecessor must enforce the same complete consumption pair.
        var target = new IdentityAdministration(appDataSource()).inspect(fixture.administrator().accountId());
        assertEquals(200, issueReset(fixture.issuer(), target.organizationId(), target).statusCode());
        try (var connection = appDataSource().getConnection(); var query = connection.prepareStatement(
                "SELECT tableowner FROM pg_tables WHERE schemaname=? AND tablename='credential_reset_proof'")) {
            query.setString(1, schema);
            try (var row = query.executeQuery()) { assertTrue(row.next()); assertEquals("idea_ddm_migrator", row.getString(1)); }
            for (var sql : new String[] { "UPDATE credential_reset_proof SET account_id=account_id",
                    "UPDATE credential_reset_proof SET security_version=security_version",
                    "UPDATE credential_reset_proof SET proof_digest=proof_digest",
                    "UPDATE credential_reset_proof SET expires_at=expires_at",
                    "DELETE FROM credential_reset_proof", "TRUNCATE credential_reset_proof" }) {
                try (var statement = connection.createStatement()) {
                    var refusal = assertThrows(java.sql.SQLException.class, () -> statement.execute(sql));
                    assertEquals("42501", refusal.getSQLState());
                }
            }
            for (var table : java.util.List.of("credential_reset_proof", "credential_setup_proof")) {
                try (var statement = connection.createStatement()) {
                    var incomplete = assertThrows(java.sql.SQLException.class, () -> statement.execute(
                            "UPDATE " + table + " SET consumed_operation_id=issue_operation_id"));
                    assertEquals("23514", incomplete.getSQLState(), "Consumed OperationId cannot exist without consumed_at");
                }
            }
        }
    }

    @Test
    void wrongTargetAndBadCsrfCannotConsumeProofAndSuccessfulReplayCannotChangePassword() throws Exception {
        var fixture = setupFixture();
        var other = pendingTarget(fixture.administrator());
        var proof = proofFor(fixture, fixture.target());
        var holder = client();
        var password = UUID.randomUUID().toString();
        assertEquals(400, redeem(holder, other.accountId(), proof, password).statusCode());
        assertEquals(403, postJson(holder, "/api/v1/identity/credentials", "wrong-csrf",
                redemption(fixture.target().accountId(), proof, password)).statusCode());
        assertEquals(204, redeem(holder, fixture.target().accountId(), proof, password).statusCode());
        var replacement = UUID.randomUUID().toString();
        var replay = redeem(holder, fixture.target().accountId(), proof, replacement);
        assertEquals(400, replay.statusCode());
        assertEquals("", replay.body(), "Refusal exposes no proof, credential or existence detail");
        assertEquals("PENDING", new IdentityAdministration(appDataSource()).inspect(other.accountId()).status());
        var csrf = jsonField(get(holder, "/api/v1/identity/csrf").body(), "token");
        assertEquals(401, post(holder, "/api/v1/identity/login", csrf,
                "username=" + form(fixture.target().normalizedLogin()) + "&password=" + form(replacement)).statusCode());
        assertEquals(200, post(holder, "/api/v1/identity/login", csrf,
                "username=" + form(fixture.target().normalizedLogin()) + "&password=" + form(password)).statusCode());
    }

    @Test
    void firstSetupExpiresExactlyAtFifteenMinutesWithoutWallClockWaiting() throws Exception {
        var fixture = setupFixture();
        var atTarget = pendingTarget(fixture.administrator());
        var afterTarget = pendingTarget(fixture.administrator());
        var beforeProof = proofFor(fixture, fixture.target());
        var atProof = proofFor(fixture, atTarget);
        var afterProof = proofFor(fixture, afterTarget);
        var holder = client();
        clock.advanceTo(Instant.parse("2026-09-30T06:14:59.999999Z"));
        assertEquals(204, redeem(holder, fixture.target().accountId(), beforeProof, UUID.randomUUID().toString()).statusCode());
        clock.advanceTo(Instant.parse("2026-09-30T06:15:00Z"));
        assertEquals(400, redeem(holder, atTarget.accountId(), atProof, UUID.randomUUID().toString()).statusCode());
        clock.advanceTo(Instant.parse("2026-09-30T06:15:00.000001Z"));
        assertEquals(400, redeem(holder, afterTarget.accountId(), afterProof, UUID.randomUUID().toString()).statusCode());
        var accounts = new IdentityAdministration(appDataSource());
        assertEquals(atTarget, accounts.inspect(atTarget.accountId()));
        assertEquals(afterTarget, accounts.inspect(afterTarget.accountId()));
    }

    @Test
    void firstSetupCannotResetActiveDisabledOrStaleReenabledTargets() throws Exception {
        var fixture = setupFixture();
        var accounts = new IdentityAdministration(appDataSource());
        var proof = proofFor(fixture, fixture.target());
        var context = new ActorContext(fixture.administrator().actorId(), 1);
        var disabled = accounts.disable(context, UUID.randomUUID(), fixture.administrator().organizationId(),
                fixture.target().accountId(), fixture.target().securityVersion(), "Synthetic state transition");
        assertEquals(403, issueSetup(fixture.issuer(), fixture.administrator().organizationId(), disabled).statusCode());
        var holder = client();
        assertEquals(400, redeem(holder, disabled.accountId(), proof, UUID.randomUUID().toString()).statusCode());
        var reenabled = accounts.reenable(context, UUID.randomUUID(), fixture.administrator().organizationId(),
                disabled.accountId(), disabled.securityVersion(), "Synthetic re-enable");
        assertEquals("PENDING", reenabled.status());
        assertEquals(400, redeem(holder, reenabled.accountId(), proof, UUID.randomUUID().toString()).statusCode());
        var freshProof = proofFor(fixture, reenabled);
        assertEquals(204, redeem(holder, reenabled.accountId(), freshProof, UUID.randomUUID().toString()).statusCode());
        var active = accounts.inspect(reenabled.accountId());
        assertEquals(fixture.target().actorId(), active.actorId());
        assertEquals(403, issueSetup(fixture.issuer(), fixture.administrator().organizationId(), active).statusCode());
        var csrf = jsonField(get(fixture.issuer(), "/api/v1/identity/csrf").body(), "token");
        assertEquals(400, postJson(fixture.issuer(), "/api/v1/identity/accounts/" + active.accountId() + "/credential-proofs",
                csrf, "{\"operationId\":\"" + UUID.randomUUID() + "\",\"organizationId\":\""
                + fixture.administrator().organizationId() + "\",\"purpose\":\"UNSUPPORTED\",\"expectedSecurityVersion\":"
                + active.securityVersion() + ",\"reason\":\"Unsupported purpose remains refused\"}").statusCode());
    }

    @Test
    void newPasswordBoundsCountUnicodeCharactersAndUtf8BytesWithoutTrimming() throws Exception {
        var fixture = setupFixture();
        var proof = proofFor(fixture, fixture.target());
        var holder = client();
        var accounts = new IdentityAdministration(appDataSource());
        for (var invalid : new String[] { "a".repeat(14), "😀".repeat(14), "界".repeat(24) + "x" }) {
            assertEquals(400, redeem(holder, fixture.target().accountId(), proof, invalid).statusCode());
            assertEquals(fixture.target(), accounts.inspect(fixture.target().accountId()));
        }
        var minimum = "a".repeat(15); // No mandatory character-class mixture.
        assertEquals(204, redeem(holder, fixture.target().accountId(), proof, minimum).statusCode());
        signedIn(new Fixture(fixture.target().actorId(), fixture.target().accountId(), fixture.administrator().organizationId(),
                fixture.target().normalizedLogin(), minimum));
        var maximumTarget = pendingTarget(fixture.administrator());
        var maximum = "界".repeat(24); // 24 code points, exactly 72 UTF-8 bytes.
        assertEquals(204, redeem(holder, maximumTarget.accountId(), proofFor(fixture, maximumTarget), maximum).statusCode());
        signedIn(new Fixture(maximumTarget.actorId(), maximumTarget.accountId(), fixture.administrator().organizationId(),
                maximumTarget.normalizedLogin(), maximum));
        var spacedTarget = pendingTarget(fixture.administrator());
        var spaced = "  " + "a".repeat(15) + "  ";
        assertEquals(204, redeem(holder, spacedTarget.accountId(), proofFor(fixture, spacedTarget), spaced).statusCode());
        var csrf = jsonField(get(holder, "/api/v1/identity/csrf").body(), "token");
        assertEquals(401, post(holder, "/api/v1/identity/login", csrf,
                "username=" + form(spacedTarget.normalizedLogin()) + "&password=" + form(spaced.strip())).statusCode());
        assertEquals(200, post(holder, "/api/v1/identity/login", csrf,
                "username=" + form(spacedTarget.normalizedLogin()) + "&password=" + form(spaced)).statusCode());
    }

    @Test
    void missingSetupAuditRollsBackCredentialActivationAndProofConsumption() throws Exception {
        requiredSetupEvidenceFailure("audit_evidence");
    }

    @Test
    void missingSetupIamOutcomeRollsBackCredentialActivationAndProofConsumption() throws Exception {
        requiredSetupEvidenceFailure("iam_owner_outcome");
    }

    @Test
    void concurrentRedemptionAcceptsExactlyOnePasswordAndOneOutcome() throws Exception {
        var fixture = setupFixture();
        var proof = proofFor(fixture, fixture.target());
        var accounts = new IdentityAdministration(appDataSource());
        var historyBefore = accounts.history(fixture.target().accountId()).size();
        var clients = new HttpClient[] { client(), client() };
        var tokens = new String[] { jsonField(get(clients[0], "/api/v1/identity/csrf").body(), "token"),
                jsonField(get(clients[1], "/api/v1/identity/csrf").body(), "token") };
        var operations = new UUID[] { UUID.randomUUID(), UUID.randomUUID() };
        var passwords = new String[] { UUID.randomUUID().toString(), UUID.randomUUID().toString() };
        var ready = new java.util.concurrent.CountDownLatch(2);
        var start = new java.util.concurrent.CountDownLatch(1);
        try (var executor = java.util.concurrent.Executors.newVirtualThreadPerTaskExecutor()) {
            var attempts = new java.util.ArrayList<java.util.concurrent.Future<Integer>>();
            for (int index = 0; index < 2; index++) {
                final int attempt = index;
                attempts.add(executor.submit(() -> {
                    ready.countDown();
                    assertTrue(start.await(10, java.util.concurrent.TimeUnit.SECONDS));
                    return postJson(clients[attempt], "/api/v1/identity/credentials", tokens[attempt],
                            redemption(operations[attempt], fixture.target().accountId(), proof, passwords[attempt])).statusCode();
                }));
            }
            assertTrue(ready.await(10, java.util.concurrent.TimeUnit.SECONDS));
            start.countDown();
            var statuses = new int[] { attempts.get(0).get(10, java.util.concurrent.TimeUnit.SECONDS),
                    attempts.get(1).get(10, java.util.concurrent.TimeUnit.SECONDS) };
            assertArrayEquals(new int[] { 204, 400 }, java.util.Arrays.stream(statuses).sorted().toArray());
            int winner = statuses[0] == 204 ? 0 : 1;
            assertEquals(new IdentityAdministration.Evidence("ACCEPTED", 1, 1), accounts.evidence(operations[winner]));
            assertEquals(new IdentityAdministration.Evidence(null, 0, 0), accounts.evidence(operations[1 - winner]));
            assertEquals(historyBefore + 1, accounts.history(fixture.target().accountId()).size());
            var loginClient = client();
            var csrf = jsonField(get(loginClient, "/api/v1/identity/csrf").body(), "token");
            assertEquals(401, post(loginClient, "/api/v1/identity/login", csrf,
                    "username=" + form(fixture.target().normalizedLogin()) + "&password=" + form(passwords[1 - winner])).statusCode());
            assertEquals(200, post(loginClient, "/api/v1/identity/login", csrf,
                    "username=" + form(fixture.target().normalizedLogin()) + "&password=" + form(passwords[winner])).statusCode());
        }
    }

    @Test
    void expiredIssuerSessionCannotIssueProofDespiteHavingV2Permission() throws Exception {
        var fixture = setupFixture();
        clock.advanceTo(Instant.parse("2026-09-30T08:00:00Z"));
        assertEquals(401, issueSetup(fixture.issuer(), fixture.administrator().organizationId(), fixture.target()).statusCode());
        assertEquals(fixture.target(), new IdentityAdministration(appDataSource()).inspect(fixture.target().accountId()));
        var fresh = signedIn(fixture.administrator());
        assertEquals(200, issueSetup(fresh, fixture.administrator().organizationId(), fixture.target()).statusCode());
    }

    @Test
    void expiredSessionIsRefusedBeforeRoleOrScopeEvaluation() throws Exception {
        var fixture = fixture();
        var superOnly = signedIn(fixture);
        var target = new IdentityAdministration.Account(UUID.randomUUID(), UUID.randomUUID(), UUID.randomUUID(),
                fixture.organizationId(), "Synthetic", "synthetic", "PENDING", 1, 0);
        assertEquals(403, issueSetup(superOnly, fixture.organizationId(), target).statusCode());
        clock.advanceTo(Instant.parse("2026-09-30T07:59:59Z"));
        assertEquals(403, issueSetup(superOnly, fixture.organizationId(), target).statusCode());
        clock.advanceTo(Instant.parse("2026-09-30T08:00:00Z"));
        assertEquals(401, issueSetup(superOnly, fixture.organizationId(), target).statusCode());
        assertEquals(401, issueSetup(superOnly, UUID.randomUUID(), target).statusCode());
    }

    @Test
    void disabledAndReenabledIssuerCannotReuseItsOldProofIssuanceSession() throws Exception {
        var fixture = setupFixture();
        var password = UUID.randomUUID().toString();
        assertEquals(204, redeem(client(), fixture.target().accountId(), proofFor(fixture, fixture.target()), password).statusCode());
        var administrator = fixture.administrator();
        var superContext = new ActorContext(administrator.actorId(), 1);
        new RoleAssignmentAdministration(appDataSource()).assignAccountAdministrator(superContext, UUID.randomUUID(),
                fixture.target().actorId(), UUID.fromString("9d80f77e-85a6-4c12-a72d-8ef6b7e0a003"),
                administrator.organizationId(), "Synthetic delegated proof issuer");
        var issuerFixture = new Fixture(fixture.target().actorId(), fixture.target().accountId(), administrator.organizationId(),
                fixture.target().normalizedLogin(), password);
        var oldSession = signedIn(issuerFixture);
        var target = pendingTarget(administrator);
        assertEquals(200, issueSetup(oldSession, administrator.organizationId(), target).statusCode());
        var accounts = new IdentityAdministration(appDataSource());
        var activeIssuer = accounts.inspect(fixture.target().accountId());
        var disabled = accounts.disable(superContext, UUID.randomUUID(), administrator.organizationId(),
                activeIssuer.accountId(), activeIssuer.securityVersion(), "Synthetic issuer disable");
        assertEquals(401, issueSetup(oldSession, administrator.organizationId(), target).statusCode());
        accounts.reenable(superContext, UUID.randomUUID(), administrator.organizationId(),
                disabled.accountId(), disabled.securityVersion(), "Synthetic issuer re-enable");
        assertEquals(401, issueSetup(oldSession, administrator.organizationId(), target).statusCode());
        assertEquals(200, issueSetup(signedIn(issuerFixture), administrator.organizationId(), target).statusCode());
        assertEquals(target, accounts.inspect(target.accountId()));
    }

    @Test
    void syntheticProofDeliveryIsUnavailableWithoutExplicitOptIn() throws Exception {
        var fixture = setupFixture();
        server.close();
        startHttpServer(false); // Omit the flag: exercise the actual default, not a test override.
        var response = issueSetup(signedIn(fixture.administrator()), fixture.administrator().organizationId(), fixture.target());
        assertEquals(503, response.statusCode());
        assertEquals("", response.body());
        assertEquals(fixture.target(), new IdentityAdministration(appDataSource()).inspect(fixture.target().accountId()));
        try (var connection = appDataSource().getConnection(); var query = connection.createStatement();
                var row = query.executeQuery("SELECT count(*) FROM credential_setup_proof")) {
            assertTrue(row.next());
            assertEquals(0, row.getLong(1));
        }
    }

    private void requiredSetupEvidenceFailure(String table) throws Exception {
        assertTrue(java.util.Set.of("audit_evidence", "iam_owner_outcome").contains(table));
        var fixture = setupFixture();
        var proof = proofFor(fixture, fixture.target());
        var holder = client();
        var operation = UUID.randomUUID();
        var body = redemption(operation, fixture.target().accountId(), proof, UUID.randomUUID().toString());
        var accounts = new IdentityAdministration(appDataSource());
        var before = accounts.history(fixture.target().accountId());
        try (var connection = migrator(); var statement = connection.createStatement()) {
            statement.execute("CREATE FUNCTION " + schema + ".suppress_first_setup() RETURNS trigger LANGUAGE plpgsql AS $$ "
                    + "BEGIN IF NEW.action='account.credential.setup.redeem' THEN RETURN NULL; END IF; RETURN NEW; END $$");
            statement.execute("CREATE TRIGGER suppress_first_setup BEFORE INSERT ON " + schema + "." + table
                    + " FOR EACH ROW EXECUTE FUNCTION " + schema + ".suppress_first_setup()");
        }
        try {
            var response = postJson(holder, "/api/v1/identity/credentials",
                    jsonField(get(holder, "/api/v1/identity/csrf").body(), "token"), body);
            assertEquals(503, response.statusCode());
            assertEquals("", response.body());
            assertEquals(fixture.target(), accounts.inspect(fixture.target().accountId()));
            assertEquals(before, accounts.history(fixture.target().accountId()));
            assertEquals(new IdentityAdministration.Evidence(null, 0, 0), accounts.evidence(operation));
        } finally {
            try (var connection = migrator(); var statement = connection.createStatement()) {
                statement.execute("DROP TRIGGER suppress_first_setup ON " + schema + "." + table);
            }
        }
        // Same proof/OperationId still works after the failed unit of work; no partial success.
        assertEquals(204, postJson(holder, "/api/v1/identity/credentials",
                jsonField(get(holder, "/api/v1/identity/csrf").body(), "token"), body).statusCode());
        assertEquals(new IdentityAdministration.Evidence("ACCEPTED", 1, 1), accounts.evidence(operation));
        assertEquals(before.size() + 1, accounts.history(fixture.target().accountId()).size());
    }

    @Test
    void malformedUnicodeCannotBecomeAReplacementCharacterCredential() throws Exception {
        var fixture = setupFixture();
        var proof = proofFor(fixture, fixture.target());
        var holder = client();
        // A lone surrogate is not a Unicode scalar value; JSON transport must not silently repair it.
        var body = redemption(fixture.target().accountId(), proof, "a".repeat(14) + "\\ud800");
        assertEquals(400, postJson(holder, "/api/v1/identity/credentials",
                jsonField(get(holder, "/api/v1/identity/csrf").body(), "token"), body).statusCode());
        assertEquals("PENDING", new IdentityAdministration(appDataSource()).inspect(fixture.target().accountId()).status());
        assertEquals(204, redeem(holder, fixture.target().accountId(), proof, UUID.randomUUID().toString()).statusCode());
    }

    private HttpResponse<String> postJson(HttpClient client, String path, String csrf, String body) throws Exception {
        return client.send(HttpRequest.newBuilder(URI.create("http://127.0.0.1:" + port + path))
                .header("Content-Type", "application/json").header("X-CSRF-TOKEN", csrf)
                .POST(HttpRequest.BodyPublishers.ofString(body)).build(), HttpResponse.BodyHandlers.ofString());
    }

    @Test
    void effectiveServletSessionBudgetDoesNotPreemptIdeaPolicy() throws Exception {
        assertEquals(200, get(client(), "/api/v1/identity/csrf").statusCode());
        assertEquals(8 * 3600, servletIdleSeconds.get(),
                "Actual container session must retain the configured eight-hour budget");
        System.out.println("F03B_EFFECTIVE_SERVLET_IDLE_SECONDS=" + servletIdleSeconds.get());
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
    void fifthWrongPasswordBlocksEvenCorrectCredentialsWithoutDisablingAccount() throws Exception {
        var fixture = fixture();
        var caller = client();
        for (int attempt = 1; attempt <= 5; attempt++) {
            assertEquals(401, loginAttempt(caller, fixture.login(), UUID.randomUUID().toString()).statusCode());
        }
        assertEquals(401, loginAttempt(caller, fixture.login(), fixture.password()).statusCode(),
                "Failure five must block even valid credentials");
        assertEquals(401, get(caller, "/api/v1/identity/session").statusCode());
        assertEquals("ACTIVE", new IdentityAdministration(appDataSource()).inspect(fixture.accountId()).status(),
                "A temporary login block is not Account disablement");
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
    void unknownAndDisabledLoginsDoNotBypassPasswordWork() throws Exception {
        var fixture = fixture();
        var app = appDataSource();
        var operator = new ActorContext(fixture.actorId(), 1);
        new RoleAssignmentAdministration(app).assignAccountAdministrator(operator, UUID.randomUUID(),
                fixture.actorId(), UUID.fromString("9d80f77e-85a6-4c12-a72d-8ef6b7e0a002"),
                fixture.organizationId(), "Synthetic timing-test account preparation");
        var accounts = new IdentityAdministration(app);
        var disabled = accounts.create(operator, UUID.randomUUID(), fixture.organizationId(),
                "Synthetic disabled timing target", "synthetic.disabled." + UUID.randomUUID());
        assertEquals("DISABLED", accounts.disable(operator, UUID.randomUUID(), fixture.organizationId(),
                disabled.accountId(), disabled.securityVersion(), "Synthetic refusal fixture").status());

        var client = client();
        var csrf = jsonField(get(client, "/api/v1/identity/csrf").body(), "token");
        var candidate = UUID.randomUUID().toString();
        var logins = new String[] { fixture.login(), "synthetic.unknown." + UUID.randomUUID(), disabled.normalizedLogin() };
        // Observe real HTTP wall time, not the injected eligibility Clock or private encoder calls.
        // Warm all paths, then rotate their order to reduce one-off startup/order effects.
        for (int round = 0; round < 3; round++) {
            for (var login : logins) refusedLoginNanos(client, csrf, login, candidate);
        }
        var samples = new long[3][9];
        for (int round = 0; round < 9; round++) {
            for (int position = 0; position < 3; position++) {
                int path = (round + position) % 3;
                samples[path][round] = refusedLoginNanos(client, csrf, logins[path], candidate);
            }
        }
        var medians = java.util.Arrays.stream(samples)
                .mapToLong(values -> java.util.Arrays.stream(values).sorted().toArray()[4]).toArray();
        System.out.printf(java.util.Locale.ROOT,
                "F03B_LOGIN_MEDIAN_MS=active-wrong:%.3f,unknown:%.3f,disabled:%.3f; samples=9/path%n",
                medians[0] / 1_000_000.0, medians[1] / 1_000_000.0, medians[2] / 1_000_000.0);
        assertAll("Bounded timing regression, not a constant-time or load qualification",
                () -> assertTrue(medians[1] >= medians[0] * 0.65,
                        "Unknown login must not expose the gross BCrypt-bypass timing gap"),
                () -> assertTrue(medians[2] >= medians[0] * 0.65,
                        "Disabled login must not expose the gross BCrypt-bypass timing gap"));
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

    private record Fixture(UUID actorId, UUID accountId, UUID organizationId, String login, String password) {}

    private Fixture fixture() {
        var app = appDataSource();
        var login = "synthetic." + UUID.randomUUID();
        var password = UUID.randomUUID().toString() + "-synthetic-only";
        var organization = UUID.randomUUID();
        var result = new AdministratorBootstrap(app).initialize(organization,
                "Synthetic HTTP organization", "Synthetic HTTP custodian", login, password);
        return new Fixture(result.actorId(), result.accountId(), organization, login, password);
    }

    private DriverManagerDataSource appDataSource() {
        return new DriverManagerDataSource(url() + "?currentSchema=" + schema,
                "idea_ddm_app", env("IDEA_DATABASE_APP_PASSWORD"));
    }

    private long refusedLoginNanos(HttpClient client, String csrf, String login, String candidate) throws Exception {
        long started = System.nanoTime();
        var response = post(client, "/api/v1/identity/login", csrf,
                "username=" + form(login) + "&password=" + form(candidate));
        long elapsed = System.nanoTime() - started;
        assertEquals(401, response.statusCode());
        assertEquals("", response.body(), "Credential refusals must have the same safe HTTP body");
        return elapsed;
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
