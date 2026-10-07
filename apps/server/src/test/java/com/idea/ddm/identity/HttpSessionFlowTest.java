package com.idea.ddm.identity;

import static org.junit.jupiter.api.Assertions.*;

import com.idea.ddm.IdeaServerApplication;
import com.idea.ddm.operation.F04SchemaTest;
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
    private final BindingRepository bindingRepository = new BindingRepository();
    private final ControlledTime clock = new ControlledTime(Instant.parse("2026-09-30T06:00:00Z"));

    @BeforeEach
    void startServerWithOnlyThisTestsMigratorOwnedSchema() throws Exception {
        assertEquals("idea_ddm_app", env("IDEA_DATABASE_APP_USER"));
        assertEquals("idea_ddm_migrator", env("IDEA_DATABASE_MIGRATION_USER"));
        if(System.getenv("IDEA_IAM_SOURCE_SHA")!=null) {
            schema=com.idea.ddm.iam.IamRegressionSchemas.create();
        } else if(System.getenv("IDEA_F05_SOURCE_SHA")!=null) {
            schema=F05DatabaseFixture.createRegressionSchema();
        } else if (System.getenv("IDEA_F04_SOURCE_SHA") != null) {
            schema = F04SchemaTest.createRegressionSchema();
        } else {
        schema = "f03b_" + UUID.randomUUID().toString().replace("-", "");
        Flyway.configure().dataSource(url(), env("IDEA_DATABASE_MIGRATION_USER"),
                env("IDEA_DATABASE_MIGRATION_PASSWORD"))
                .schemas(schema).defaultSchema(schema).locations("classpath:db/migration")
                .cleanDisabled(true).load().migrate();
        try (var connection = migrator(); var statement = connection.createStatement()) {
            statement.execute("GRANT USAGE ON SCHEMA " + schema + " TO idea_ddm_app");
        }
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
                    if(System.getenv("IDEA_F05_SOURCE_SHA")!=null || System.getenv("IDEA_IAM_SOURCE_SHA")!=null)context.getBeanFactory().registerSingleton("dataSource",appDataSource());
                    context.getBeanFactory().registerSingleton("testIdentityClock", clock);
                    context.getBeanFactory().registerSingleton("testContextRepository", bindingRepository);
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
        if(schema!=null && System.getenv("IDEA_IAM_SOURCE_SHA")!=null){com.idea.ddm.iam.IamRegressionSchemas.remove(schema);return;}
        if(schema!=null && System.getenv("IDEA_F05_SOURCE_SHA")!=null){F05DatabaseFixture.removeRegressionSchema(schema);return;}
        if (schema != null && System.getenv("IDEA_F04_SOURCE_SHA") != null) {
            F04SchemaTest.removeRegressionSchema(schema);
            return;
        }
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
        var anonymous = HttpClient.newHttpClient();
        for (var path : java.util.List.of("/health", "/health/database")) {
            var health = get(anonymous, path);
            assertEquals(200, health.statusCode());
            assertEquals("{\"status\":\"UP\"}", health.body(), "Health returns only public availability");
        }
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
        var logout = post(first, "/api/v1/identity/logout", jsonField(csrf.body(), "token"), "");
        assertEquals(204, logout.statusCode());
        var cookies = ((CookieManager) first.cookieHandler().orElseThrow()).getCookieStore();
        assertTrue(cookies.getCookies().stream().noneMatch(cookie -> cookie.getName().equals("IDEA_SESSION")),
                "Committed logout removes the ordinary proof from the actual client cookie store");
        assertEquals(401, get(first, "/api/v1/identity/session").statusCode());
        var replay = HttpClient.newHttpClient().send(HttpRequest.newBuilder(
                URI.create("http://127.0.0.1:" + port + "/api/v1/identity/session"))
                .header("Cookie", "IDEA_SESSION=" + oldCookie).GET().build(), HttpResponse.BodyHandlers.ofString());
        assertEquals(401, replay.statusCode());
        assertEquals(200, get(second, "/api/v1/identity/session").statusCode(), "Logout revokes only this session");
    }

    @Test
    void expiredLogoutIsRefusedWithoutAcceptedEvidenceOrRevocation() throws Exception {
        var fixture = fixture();
        var caller = signedIn(fixture);
        var csrf = jsonField(get(caller, "/api/v1/identity/csrf").body(), "token");
        var accounts = new IdentityAdministration(appDataSource());
        var before = accounts.totals();
        clock.advanceTo(Instant.parse("2026-09-30T08:00:00Z"));
        var response = post(caller, "/api/v1/identity/logout", csrf, "");
        assertEquals(401, response.statusCode());
        assertEquals("", response.body());
        assertEquals(before, accounts.totals(), "Ineligible logout cannot publish ACCEPTED IAM/Audit");
        try (var connection = migrator(); var statement = connection.createStatement();
                var rows = statement.executeQuery("SELECT count(*) FROM " + schema + ".session_record WHERE revoked_at IS NOT NULL")) {
            assertTrue(rows.next());
            assertEquals(0, rows.getLong(1), "Refusal leaves session metadata unchanged");
        }
    }

    @Test
    void logoutAuditFailureLeavesNoRevocationOrAcceptedEvidenceAndAllowsRetry() throws Exception {
        requiredLogoutEvidenceFailure("audit_evidence");
    }

    @Test
    void absoluteExpiredLogoutCannotPublishAcceptedEvidenceDespiteRecentActivity() throws Exception {
        var fixture = fixture();
        var caller = signedIn(fixture);
        var csrf = jsonField(get(caller, "/api/v1/identity/csrf").body(), "token");
        for (int hour = 1; hour < 8; hour++) {
            clock.advanceTo(Instant.parse("2026-09-30T06:00:00Z").plusSeconds(hour * 3600));
            assertEquals(200, get(caller, "/api/v1/identity/session").statusCode());
        }
        var accounts = new IdentityAdministration(appDataSource());
        var before = accounts.totals();
        clock.advanceTo(Instant.parse("2026-09-30T14:00:00Z"));
        var response = post(caller, "/api/v1/identity/logout", csrf, "");
        assertEquals(401, response.statusCode());
        assertEquals("", response.body());
        assertEquals(before, accounts.totals());
        try (var connection = migrator(); var statement = connection.createStatement();
                var rows = statement.executeQuery("SELECT count(*) FROM " + schema + ".session_record WHERE revoked_at IS NOT NULL")) {
            assertTrue(rows.next());
            assertEquals(0, rows.getLong(1));
        }
    }

    @Test
    void logoutIamFailureLeavesNoRevocationOrAcceptedEvidenceAndAllowsRetry() throws Exception {
        requiredLogoutEvidenceFailure("iam_owner_outcome");
    }

    @Test
    void logoutCommitFailureRollsBackRevocationAndKeepsOrdinaryProofForRetry() throws Exception {
        var caller = signedIn(fixture());
        var csrf = jsonField(get(caller, "/api/v1/identity/csrf").body(), "token");
        var accounts = new IdentityAdministration(appDataSource());
        var before = accounts.totals();
        try (var connection = migrator(); var statement = connection.createStatement()) {
            statement.execute("CREATE FUNCTION " + schema + ".refuse_logout_commit() RETURNS trigger LANGUAGE plpgsql AS $$ "
                    + "BEGIN IF NEW.action='identity.sign-out' THEN RAISE EXCEPTION 'Synthetic logout commit fault'; END IF; RETURN NEW; END $$");
            statement.execute("CREATE CONSTRAINT TRIGGER refuse_logout_commit AFTER INSERT ON " + schema
                    + ".iam_owner_outcome DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION " + schema + ".refuse_logout_commit()");
        }
        try {
            var response = post(caller, "/api/v1/identity/logout", csrf, "");
            assertEquals(503, response.statusCode());
            assertEquals("", response.body());
            assertEquals(before, accounts.totals());
            assertEquals(200, get(caller, "/api/v1/identity/session").statusCode());
        } finally {
            try (var connection = migrator(); var statement = connection.createStatement()) {
                statement.execute("DROP TRIGGER refuse_logout_commit ON " + schema + ".iam_owner_outcome");
            }
        }
        assertEquals(204, post(caller, "/api/v1/identity/logout", csrf, "").statusCode());
        assertEquals(401, get(caller, "/api/v1/identity/session").statusCode());
        assertEquals(before.ownerOutcomes() + 1, accounts.totals().ownerOutcomes());
        assertEquals(before.auditEvents() + 1, accounts.totals().auditEvents());
    }

    private void requiredLogoutEvidenceFailure(String table) throws Exception {
        assertTrue(java.util.Set.of("audit_evidence", "iam_owner_outcome").contains(table));
        var fixture = fixture();
        var caller = signedIn(fixture);
        var csrf = jsonField(get(caller, "/api/v1/identity/csrf").body(), "token");
        var accounts = new IdentityAdministration(appDataSource());
        var before = accounts.totals();
        try (var connection = migrator(); var statement = connection.createStatement()) {
            statement.execute("CREATE FUNCTION " + schema + ".suppress_logout() RETURNS trigger LANGUAGE plpgsql AS $$ "
                    + "BEGIN IF NEW.action='identity.sign-out' THEN RETURN NULL; END IF; RETURN NEW; END $$");
            statement.execute("CREATE TRIGGER suppress_logout BEFORE INSERT ON " + schema + "." + table + " "
                    + "FOR EACH ROW EXECUTE FUNCTION " + schema + ".suppress_logout()");
        }
        try {
            var response = post(caller, "/api/v1/identity/logout", csrf, "");
            assertEquals(503, response.statusCode());
            assertEquals("", response.body());
            assertEquals(before, accounts.totals());
            assertEquals(200, get(caller, "/api/v1/identity/session").statusCode(), "Failed logout must not clear ordinary proof");
        } finally {
            try (var connection = migrator(); var statement = connection.createStatement()) {
                statement.execute("DROP TRIGGER suppress_logout ON " + schema + "." + table);
            }
        }
        assertEquals(204, post(caller, "/api/v1/identity/logout", csrf, "").statusCode());
        assertEquals(401, get(caller, "/api/v1/identity/session").statusCode());
        assertEquals(before.ownerOutcomes() + 1, accounts.totals().ownerOutcomes());
        assertEquals(before.auditEvents() + 1, accounts.totals().auditEvents());
    }

    @Test
    void anonymousRevokedAndStaleVersionLogoutAreRefusedWithoutAcceptedEvidence() throws Exception {
        var anonymous = client();
        var anonymousCsrf = jsonField(get(anonymous, "/api/v1/identity/csrf").body(), "token");
        assertEquals(401, post(anonymous, "/api/v1/identity/logout", anonymousCsrf, "").statusCode());
        var fixture = fixture();
        var revoked = signedIn(fixture);
        var revokedCsrf = jsonField(get(revoked, "/api/v1/identity/csrf").body(), "token");
        // Isolate the PostgreSQL revocation guard while ordinary servlet proof remains present.
        try (var connection = migrator(); var statement = connection.createStatement()) {
            assertEquals(1, statement.executeUpdate("UPDATE " + schema + ".session_record SET revoked_at=issued_at"));
        }
        var accounts = new IdentityAdministration(appDataSource());
        var before = accounts.totals();
        var response = post(revoked, "/api/v1/identity/logout", revokedCsrf, "");
        assertEquals(401, response.statusCode());
        assertEquals("", response.body());
        assertEquals(before, accounts.totals());
        var stale = signedIn(fixture);
        var staleCsrf = jsonField(get(stale, "/api/v1/identity/csrf").body(), "token");
        // Isolate the version guard without also revoking this second session.
        try (var connection = migrator(); var statement = connection.createStatement()) {
            assertEquals(1, statement.executeUpdate("UPDATE " + schema + ".idea_account SET security_version=security_version+1"));
        }
        before = accounts.totals();
        response = post(stale, "/api/v1/identity/logout", staleCsrf, "");
        assertEquals(401, response.statusCode());
        assertEquals("", response.body());
        assertEquals(before, accounts.totals());
    }

    @Test
    void disabledAndReenabledOldSessionCannotLogoutButFreshSessionCan() throws Exception {
        var setup = setupFixture();
        var accounts = new IdentityAdministration(appDataSource());
        var password = UUID.randomUUID().toString();
        assertEquals(204, redeem(client(), setup.target().accountId(), proofFor(setup, setup.target()), password).statusCode());
        var active = accounts.inspect(setup.target().accountId());
        var old = client();
        assertEquals(200, loginAttempt(old, active.normalizedLogin(), password).statusCode());
        var csrf = jsonField(get(old, "/api/v1/identity/csrf").body(), "token");
        assertEquals(200, changeAccount(setup.issuer(), UUID.randomUUID(), active.organizationId(), active,
                "disable", active.securityVersion()).statusCode());
        var disabled = accounts.inspect(active.accountId());
        var before = accounts.totals();
        assertEquals(401, post(old, "/api/v1/identity/logout", csrf, "").statusCode());
        assertEquals(before, accounts.totals());
        assertEquals(disabled, accounts.inspect(active.accountId()));
        assertEquals(200, changeAccount(setup.issuer(), UUID.randomUUID(), disabled.organizationId(), disabled,
                "re-enable", disabled.securityVersion()).statusCode());
        before = accounts.totals();
        assertEquals(401, post(old, "/api/v1/identity/logout", csrf, "").statusCode());
        assertEquals(before, accounts.totals());
        var fresh = client();
        assertEquals(200, loginAttempt(fresh, active.normalizedLogin(), password).statusCode());
        assertEquals(204, post(fresh, "/api/v1/identity/logout",
                jsonField(get(fresh, "/api/v1/identity/csrf").body(), "token"), "").statusCode());
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
    void rollingWindowExcludesFailuresExactlyFifteenMinutesOld() throws Exception {
        var fixture = dualLoginFixture();
        var before = fixture.setup().administrator();
        var at = fixture.first();
        var after = fixture.second();
        var caller = client();
        for (var login : java.util.List.of(before, at, after)) wrongAttempts(caller, login.login(), 1);
        clock.advanceTo(Instant.parse("2026-09-30T06:01:00Z"));
        for (var login : java.util.List.of(before, at, after)) wrongAttempts(caller, login.login(), 3);
        clock.advanceTo(Instant.parse("2026-09-30T06:14:59.999999Z"));
        wrongAttempts(caller, before.login(), 1);
        assertEquals(401, loginAttempt(caller, before.login(), before.password()).statusCode());
        clock.advanceTo(Instant.parse("2026-09-30T06:15:00Z"));
        wrongAttempts(caller, at.login(), 1);
        assertEquals(200, loginAttempt(caller, at.login(), at.password()).statusCode(), "Cutoff is exclusive");
        clock.advanceTo(Instant.parse("2026-09-30T06:15:00.000001Z"));
        wrongAttempts(caller, after.login(), 1);
        assertEquals(200, loginAttempt(caller, after.login(), after.password()).statusCode());
    }

    @Test
    void silentlyMissingSpringBindingCannotCommitSessionOrClearFourFailures() throws Exception {
        var fixture = fixture();
        var caller = client();
        wrongAttempts(caller, fixture.login(), 4);
        var before = loginWitness(fixture.login());
        assertEquals(4, before.failures());
        bindingRepository.fault = BindingFault.SUPPRESS;
        try {
            assertNotEquals(200, loginAttempt(caller, fixture.login(), fixture.password()).statusCode());
            assertEquals(before, loginWitness(fixture.login()), "Binding failure must preserve the prior transaction state");
            assertEquals(401, get(caller, "/api/v1/identity/session").statusCode());
        } finally { bindingRepository.fault = BindingFault.NONE; }
        wrongAttempts(caller, fixture.login(), 1);
        assertEquals(401, loginAttempt(caller, fixture.login(), fixture.password()).statusCode(), "Prior four failures were not cleared");
    }

    @Test
    void blockDeadlineDoesNotMoveAndIsOpenExactlyAtAndAfterExpiry() throws Exception {
        var fixture = dualLoginFixture();
        var caller = client();
        wrongAttempts(caller, fixture.first().login(), 5);
        wrongAttempts(caller, fixture.second().login(), 5);
        var blocked = loginWitness(fixture.first().login());
        assertEquals(1, blocked.rows());
        assertEquals(5, blocked.failures());
        assertEquals(Instant.parse("2026-09-30T06:15:00Z"), blocked.blockedUntil());
        clock.advanceTo(Instant.parse("2026-09-30T06:14:59.999999Z"));
        wrongAttempts(caller, fixture.first().login(), 10);
        assertEquals(401, loginAttempt(caller, fixture.first().login(), fixture.first().password()).statusCode());
        assertEquals(blocked, loginWitness(fixture.first().login()), "Blocked attempts cannot append or extend state");
        clock.advanceTo(Instant.parse("2026-09-30T06:15:00Z"));
        wrongAttempts(caller, fixture.first().login(), 1);
        assertEquals(1, loginWitness(fixture.first().login()).failures(), "Expired observations no longer count on access");
        assertEquals(200, loginAttempt(caller, fixture.first().login(), fixture.first().password()).statusCode());
        assertEquals(0, loginWitness(fixture.first().login()).rows());
        clock.advanceTo(Instant.parse("2026-09-30T06:15:00.000001Z"));
        assertEquals(200, loginAttempt(caller, fixture.second().login(), fixture.second().password()).statusCode());
        assertEquals(0, loginWitness(fixture.second().login()).rows());
    }

    private record LoginWitness(int rows, int failures, Instant blockedUntil, long sessions, long outcomes, long audit) {}

    @Test
    void blockedCredentiallessLoginOnActiveAccountStillPerformsQualifiedPasswordWork() throws Exception {
        var fixture = fixture();
        var noCredential = "synthetic.credentialless." + UUID.randomUUID();
        try (var connection = migrator(); var insert = connection.prepareStatement("INSERT INTO " + schema
                + ".login_identity(login_identity_id,account_id,login_identifier,normalized_login_identifier,password_verifier) VALUES (?,?,?,?,NULL)")) {
            insert.setObject(1, UUID.randomUUID());
            insert.setObject(2, fixture.accountId());
            insert.setString(3, noCredential);
            insert.setString(4, noCredential);
            assertEquals(1, insert.executeUpdate());
        }
        var caller = client();
        wrongAttempts(caller, fixture.login(), 5);
        wrongAttempts(caller, noCredential, 5);
        var csrf = jsonField(get(caller, "/api/v1/identity/csrf").body(), "token");
        var candidate = UUID.randomUUID().toString();
        var logins = new String[] {fixture.login(), noCredential};
        var samples = new long[2][9];
        for (int round = 0; round < 12; round++) {
            for (int position = 0; position < 2; position++) {
                int path = (round + position) % 2;
                long elapsed = refusedLoginNanos(caller, csrf, logins[path], candidate);
                if (round >= 3) samples[path][round - 3] = elapsed;
            }
        }
        var medians = java.util.Arrays.stream(samples).mapToLong(values -> java.util.Arrays.stream(values).sorted().toArray()[4]).toArray();
        System.out.printf(java.util.Locale.ROOT, "F03B_BLOCKED_MEDIAN_MS=credential:%.3f,credentialless:%.3f; samples=9/path%n",
                medians[0] / 1_000_000.0, medians[1] / 1_000_000.0);
        assertTrue(medians[1] >= medians[0] * 0.65, "Credentialless ACTIVE-account Login Identity must not bypass BCrypt");
        assertEquals(5, loginWitness(noCredential).failures());
        assertEquals(0, loginWitness(noCredential).sessions());
        assertEquals(401, get(caller, "/api/v1/identity/session").statusCode());
    }

    @Test
    void suppressedFifthFailureDeadlineRollsBackTheTransitionInsteadOfLeavingAnUnblockedFifthFailure() throws Exception {
        var fixture = fixture();
        var caller = client();
        wrongAttempts(caller, fixture.login(), 4);
        var before = loginWitness(fixture.login());
        try (var connection = migrator(); var statement = connection.createStatement()) {
            statement.execute("CREATE FUNCTION " + schema + ".suppress_deadline() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN "
                    + "IF NEW.blocked_until IS NOT NULL THEN RETURN NULL; END IF; RETURN NEW; END $$");
            statement.execute("CREATE TRIGGER suppress_deadline BEFORE UPDATE ON " + schema
                    + ".login_failure_state FOR EACH ROW EXECUTE FUNCTION " + schema + ".suppress_deadline()");
        }
        try {
            wrongAttempts(caller, fixture.login(), 1);
            assertEquals(before, loginWitness(fixture.login()), "Fifth observation and block deadline share one transaction");
        } finally {
            try (var connection = migrator(); var statement = connection.createStatement()) {
                statement.execute("DROP TRIGGER suppress_deadline ON " + schema + ".login_failure_state");
            }
        }
        wrongAttempts(caller, fixture.login(), 1);
        assertEquals(5, loginWitness(fixture.login()).failures());
        assertEquals(Instant.parse("2026-09-30T06:15:00Z"), loginWitness(fixture.login()).blockedUntil());
        assertEquals(401, loginAttempt(caller, fixture.login(), fixture.password()).statusCode());
    }

    @Test
    void concurrentFailuresReachOneFifthFailureWithoutLostUpdatesOrUnboundedState() throws Exception {
        var fixture = fixture();
        var callers = new java.util.ArrayList<HttpClient>();
        var csrf = new java.util.ArrayList<String>();
        for (int number = 0; number < 10; number++) {
            var caller = client();
            callers.add(caller);
            csrf.add(jsonField(get(caller, "/api/v1/identity/csrf").body(), "token"));
        }
        var ready = new java.util.concurrent.CountDownLatch(10);
        var start = new java.util.concurrent.CountDownLatch(1);
        try (var workers = java.util.concurrent.Executors.newFixedThreadPool(10)) {
            var results = new java.util.ArrayList<java.util.concurrent.Future<HttpResponse<String>>>();
            for (int number = 0; number < 10; number++) {
                int position = number;
                results.add(workers.submit(() -> {
                    ready.countDown();
                    assertTrue(start.await(20, java.util.concurrent.TimeUnit.SECONDS));
                    return post(callers.get(position), "/api/v1/identity/login", csrf.get(position),
                            "username=" + form(fixture.login()) + "&password=" + form(UUID.randomUUID().toString()));
                }));
            }
            assertTrue(ready.await(20, java.util.concurrent.TimeUnit.SECONDS));
            start.countDown();
            for (var result : results) {
                var refused = result.get(30, java.util.concurrent.TimeUnit.SECONDS);
                assertEquals(401, refused.statusCode());
                assertEquals("", refused.body());
            }
        } finally { start.countDown(); }
        assertEquals(new LoginWitness(1, 5, Instant.parse("2026-09-30T06:15:00Z"), 0, 0, 0), loginWitness(fixture.login()));
        assertEquals(401, loginAttempt(client(), fixture.login(), fixture.password()).statusCode());
    }

    @Test
    void suppressedFailureClearingCannotPublishSuccessfulSignIn() throws Exception {
        requiredSignInFailure("login_failure_state");
    }

    @Test void missingSignInSessionCannotClearFailures() throws Exception { requiredSignInFailure("session_record"); }
    @Test void missingSignInIamOutcomeCannotClearFailures() throws Exception { requiredSignInFailure("iam_owner_outcome"); }
    @Test void missingSignInAuditCannotClearFailures() throws Exception { requiredSignInFailure("audit_evidence"); }

    @Test void springExceptionBeforeBindingCannotCommitSignIn() throws Exception { exceptionalBindingFailure(BindingFault.BEFORE_SAVE); }
    @Test void springExceptionAfterBindingCannotLeaveEligibleTentativeProof() throws Exception { exceptionalBindingFailure(BindingFault.AFTER_SAVE); }

    private void exceptionalBindingFailure(BindingFault fault) throws Exception {
        var fixture = fixture();
        var caller = client();
        wrongAttempts(caller, fixture.login(), 4);
        var before = loginWitness(fixture.login());
        bindingRepository.fault = fault;
        try {
            assertNotEquals(200, loginAttempt(caller, fixture.login(), fixture.password()).statusCode());
            assertEquals(before, loginWitness(fixture.login()));
            assertEquals(401, get(caller, "/api/v1/identity/session").statusCode());
        } finally { bindingRepository.fault = BindingFault.NONE; }
        wrongAttempts(caller, fixture.login(), 1);
        assertEquals(401, loginAttempt(caller, fixture.login(), fixture.password()).statusCode());
    }

    @Test
    void deferredDatabaseCommitFailureRollsBackAlreadyBoundTentativeSession() throws Exception {
        var fixture = fixture();
        var caller = client();
        wrongAttempts(caller, fixture.login(), 4);
        var before = loginWitness(fixture.login());
        try (var connection = migrator(); var statement = connection.createStatement()) {
            statement.execute("CREATE FUNCTION " + schema + ".refuse_signin_commit() RETURNS trigger LANGUAGE plpgsql AS $$ "
                    + "BEGIN RAISE EXCEPTION 'Synthetic commit fault'; END $$");
            statement.execute("CREATE CONSTRAINT TRIGGER refuse_signin_commit AFTER INSERT ON " + schema
                    + ".session_record DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION " + schema + ".refuse_signin_commit()");
        }
        try {
            assertNotEquals(200, loginAttempt(caller, fixture.login(), fixture.password()).statusCode());
            assertEquals(before, loginWitness(fixture.login()));
            assertEquals(401, get(caller, "/api/v1/identity/session").statusCode());
        } finally {
            try (var connection = migrator(); var statement = connection.createStatement()) {
                statement.execute("DROP TRIGGER refuse_signin_commit ON " + schema + ".session_record");
            }
        }
        wrongAttempts(caller, fixture.login(), 1);
        assertEquals(401, loginAttempt(caller, fixture.login(), fixture.password()).statusCode());
    }

    private void requiredSignInFailure(String table) throws Exception {
        assertTrue(java.util.Set.of("login_failure_state", "session_record", "iam_owner_outcome", "audit_evidence").contains(table));
        var fixture = fixture();
        var caller = client();
        wrongAttempts(caller, fixture.login(), 4);
        var before = loginWitness(fixture.login());
        boolean clearing = table.equals("login_failure_state");
        try (var connection = migrator(); var statement = connection.createStatement()) {
            statement.execute("CREATE FUNCTION " + schema + ".suppress_signin() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN "
                    + (clearing || table.equals("session_record") ? "RETURN NULL;"
                            : "IF NEW.action='identity.sign-in' THEN RETURN NULL; END IF; RETURN NEW;") + " END $$");
            statement.execute("CREATE TRIGGER suppress_signin BEFORE " + (clearing ? "DELETE" : "INSERT") + " ON "
                    + schema + "." + table + " FOR EACH ROW EXECUTE FUNCTION " + schema + ".suppress_signin()");
        }
        try {
            assertNotEquals(200, loginAttempt(caller, fixture.login(), fixture.password()).statusCode());
            assertEquals(before, loginWitness(fixture.login()));
            assertEquals(401, get(caller, "/api/v1/identity/session").statusCode());
        } finally {
            try (var connection = migrator(); var statement = connection.createStatement()) {
                statement.execute("DROP TRIGGER suppress_signin ON " + schema + "." + table);
            }
        }
        wrongAttempts(caller, fixture.login(), 1);
        assertEquals(401, loginAttempt(caller, fixture.login(), fixture.password()).statusCode());
    }

    @Test
    void unknownLoginSprayCreatesNoDurableStateOrInheritedFailures() throws Exception {
        var fixture = setupFixture();
        var before = identityStorageWitness();
        var caller = client();
        for (int number = 0; number < 100; number++) {
            wrongAttempts(caller, "synthetic.unknown.batch." + number, 1);
        }
        assertEquals(before, identityStorageWitness(), "No arbitrary-name durable records, identities or authenticated sessions");
        assertEquals(401, get(caller, "/api/v1/identity/session").statusCode());
        var admin = fixture.administrator();
        var target = new IdentityAdministration(appDataSource()).create(new ActorContext(admin.actorId(), 1),
                UUID.randomUUID(), admin.organizationId(), "Synthetic formerly-unknown target", "synthetic.unknown.batch.0");
        assertEquals(0, loginWitness(target.normalizedLogin()).rows());
        var password = UUID.randomUUID().toString();
        assertEquals(204, redeem(client(), target.accountId(), proofFor(fixture, target), password).statusCode());
        wrongAttempts(caller, target.normalizedLogin(), 4);
        assertEquals(4, loginWitness(target.normalizedLogin()).failures());
        assertEquals(200, loginAttempt(caller, target.normalizedLogin(), password).statusCode(), "No inherited unknown-login history");
        var cleared = loginWitness(target.normalizedLogin());
        assertEquals(0, cleared.rows());
        assertEquals(1, cleared.sessions());
        assertEquals(before.sessions() + 1, cleared.outcomes());
        assertEquals(cleared.outcomes(), cleared.audit());
    }

    private record IdentityStorageWitness(long failures, long actors, long accounts, long logins, long sessions, long outcomes, long audit) {}

    @Test
    void pendingAndDisabledAccountsCannotClearFailuresOrBecomeEnabledThroughLogin() throws Exception {
        var fixture = setupFixture();
        var accounts = new IdentityAdministration(appDataSource());
        var pending = fixture.target();
        var active = pendingTarget(fixture.administrator());
        var password = UUID.randomUUID().toString();
        assertEquals(204, redeem(client(), active.accountId(), proofFor(fixture, active), password).statusCode());
        active = accounts.inspect(active.accountId());
        var caller = client();
        wrongAttempts(caller, pending.normalizedLogin(), 4);
        assertEquals(401, loginAttempt(caller, pending.normalizedLogin(), password).statusCode());
        assertEquals(5, loginWitness(pending.normalizedLogin()).failures());
        assertEquals("PENDING", accounts.inspect(pending.accountId()).status());
        wrongAttempts(caller, active.normalizedLogin(), 4);
        var admin = fixture.administrator();
        var disabled = accounts.disable(new ActorContext(admin.actorId(), 1), UUID.randomUUID(), admin.organizationId(),
                active.accountId(), active.securityVersion(), "Synthetic disabled refusal");
        var disabledAt = actorDisabledAt(disabled.actorId());
        assertEquals(401, loginAttempt(caller, disabled.normalizedLogin(), password).statusCode());
        assertEquals(5, loginWitness(disabled.normalizedLogin()).failures());
        clock.advanceTo(Instant.parse("2026-09-30T06:15:00Z"));
        assertEquals(401, loginAttempt(caller, pending.normalizedLogin(), password).statusCode());
        assertEquals(401, loginAttempt(caller, disabled.normalizedLogin(), password).statusCode());
        assertEquals(1, loginWitness(disabled.normalizedLogin()).failures());
        assertEquals(1, loginWitness(pending.normalizedLogin()).failures());
        assertEquals(0, loginWitness(disabled.normalizedLogin()).sessions());
        assertEquals(0, loginWitness(pending.normalizedLogin()).sessions());
        assertEquals(disabled, accounts.inspect(disabled.accountId()));
        assertEquals(disabledAt, actorDisabledAt(disabled.actorId()));
        assertEquals("PENDING", accounts.inspect(pending.accountId()).status());
        assertEquals(401, get(caller, "/api/v1/identity/session").statusCode());
    }

    @Test
    void additiveThrottleMigrationRepeatsWithoutChangesAndEnforcesIdentitySizeAndRoleBounds() throws Exception {
        var fixture = fixture();
        var flyway = Flyway.configure().dataSource(url(), env("IDEA_DATABASE_MIGRATION_USER"), env("IDEA_DATABASE_MIGRATION_PASSWORD"))
                .schemas(schema).defaultSchema(schema).locations("classpath:db/migration").cleanDisabled(true).load();
        // 009 adds V11/V12; predecessor execution evidence keeps its original chain.
        var expected = System.getenv("IDEA_IAM_SOURCE_SHA") != null
                ? java.util.List.of("1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12")
                : java.util.List.of("1", "2", "3", "4", "5", "6", "7", "8", "9", "10");
        assertEquals(expected, java.util.Arrays.stream(flyway.info().applied())
                .filter(migration -> migration.getVersion() != null).map(migration -> migration.getVersion().toString()).toList());
        assertEquals(0, flyway.migrate().migrationsExecuted);
        var loginId = new IdentityAdministration(appDataSource()).inspect(fixture.accountId()).loginIdentityId();
        try (var connection = appDataSource().getConnection(); var query = connection.prepareStatement(
                "SELECT current_user,has_database_privilege(current_user,current_database(),'CREATE'),"
                + "has_schema_privilege(current_user,?,'CREATE'),(SELECT tableowner FROM pg_tables WHERE schemaname=? AND tablename='login_failure_state')")) {
            query.setString(1, schema);
            query.setString(2, schema);
            try (var row = query.executeQuery()) {
                assertTrue(row.next());
                assertEquals("idea_ddm_app", row.getString(1));
                assertFalse(row.getBoolean(2));
                assertFalse(row.getBoolean(3));
                assertEquals("idea_ddm_migrator", row.getString(4));
            }
            try (var statement = connection.createStatement()) {
                assertEquals("42501", assertThrows(java.sql.SQLException.class,
                        () -> statement.execute("CREATE TABLE " + schema + ".forbidden_runtime_ddl(id int)")).getSQLState());
                assertEquals("42501", assertThrows(java.sql.SQLException.class,
                        () -> statement.execute("TRUNCATE login_failure_state")).getSQLState());
            }
            try (var insert = connection.prepareStatement("INSERT INTO login_failure_state VALUES (?,ARRAY[?]::timestamptz[],NULL)")) {
                insert.setObject(1, UUID.randomUUID());
                insert.setTimestamp(2, java.sql.Timestamp.from(clock.instant()));
                assertEquals("23503", assertThrows(java.sql.SQLException.class, insert::executeUpdate).getSQLState());
            }
            try (var insert = connection.prepareStatement("INSERT INTO login_failure_state VALUES (?,array_fill(now(),ARRAY[6]),NULL)")) {
                insert.setObject(1, loginId);
                assertEquals("23514", assertThrows(java.sql.SQLException.class, insert::executeUpdate).getSQLState());
            }
        }
        assertEquals(0, loginWitness(fixture.login()).rows());
    }

    @Test
    void normalizedAliasesShareFailuresButSiblingLoginsRemainIndependent() throws Exception {
        var fixture = dualLoginFixture();
        var caller = client();
        wrongAttempts(caller, fixture.first().login(), 1);
        wrongAttempts(caller, "  " + fixture.first().login().toUpperCase(java.util.Locale.ROOT) + "  ", 3);
        assertEquals(4, loginWitness(fixture.first().login()).failures());
        assertEquals(200, loginAttempt(caller, fixture.second().login(), fixture.second().password()).statusCode());
        assertEquals(4, loginWitness(fixture.first().login()).failures(), "L2 success cannot clear L1");
        wrongAttempts(caller, fixture.first().login().toUpperCase(java.util.Locale.ROOT), 1);
        assertEquals(401, loginAttempt(client(), fixture.first().login(), fixture.first().password()).statusCode());
        assertEquals(200, loginAttempt(client(), fixture.second().login(), fixture.second().password()).statusCode());
        assertEquals(5, loginWitness(fixture.first().login()).failures());
        assertEquals(Instant.parse("2026-09-30T06:15:00Z"), loginWitness(fixture.first().login()).blockedUntil());
        assertEquals(0, loginWitness(fixture.second().login()).rows());
    }

    private IdentityStorageWitness identityStorageWitness() throws Exception {
        try (var connection = appDataSource().getConnection(); var query = connection.createStatement(); var row = query.executeQuery(
                "SELECT (SELECT count(*) FROM login_failure_state),(SELECT count(*) FROM actor),"
                + "(SELECT count(*) FROM idea_account),(SELECT count(*) FROM login_identity),(SELECT count(*) FROM session_record),"
                + "(SELECT count(*) FROM iam_owner_outcome),(SELECT count(*) FROM audit_evidence)")) {
            assertTrue(row.next());
            return new IdentityStorageWitness(row.getLong(1), row.getLong(2), row.getLong(3), row.getLong(4), row.getLong(5), row.getLong(6), row.getLong(7));
        }
    }

    // Approved bounded SQL witnesses for state/transaction invariants unavailable over HTTP.
    private LoginWitness loginWitness(String login) throws Exception {
        try (var connection = appDataSource().getConnection(); var query = connection.prepareStatement(
                "SELECT CASE WHEN s.login_identity_id IS NULL THEN 0 ELSE 1 END,coalesce(cardinality(s.failed_at),0),s.blocked_until,"
                + "(SELECT count(*) FROM session_record WHERE account_id=l.account_id),"
                + "(SELECT count(*) FROM iam_owner_outcome WHERE action='identity.sign-in'),"
                + "(SELECT count(*) FROM audit_evidence WHERE action='identity.sign-in') "
                + "FROM login_identity l LEFT JOIN login_failure_state s USING(login_identity_id) WHERE normalized_login_identifier=?")) {
            query.setString(1, login);
            try (var row = query.executeQuery()) {
                assertTrue(row.next());
                var deadline = row.getTimestamp(3);
                return new LoginWitness(row.getInt(1), row.getInt(2), deadline == null ? null : deadline.toInstant(),
                        row.getLong(4), row.getLong(5), row.getLong(6));
            }
        }
    }

    private enum BindingFault { NONE, SUPPRESS, BEFORE_SAVE, AFTER_SAVE }

    /** Faults only at the qualified Spring/container boundary; normal paths use the real repositories. */
    private static final class BindingRepository implements org.springframework.security.web.context.SecurityContextRepository {
        private final org.springframework.security.web.context.SecurityContextRepository delegate =
                new org.springframework.security.web.context.DelegatingSecurityContextRepository(
                        new org.springframework.security.web.context.RequestAttributeSecurityContextRepository(),
                        new org.springframework.security.web.context.HttpSessionSecurityContextRepository());
        volatile BindingFault fault = BindingFault.NONE;
        @Override @SuppressWarnings("deprecation")
        public org.springframework.security.core.context.SecurityContext loadContext(
                org.springframework.security.web.context.HttpRequestResponseHolder holder) { return delegate.loadContext(holder); }
        @Override public org.springframework.security.core.context.DeferredSecurityContext loadDeferredContext(
                jakarta.servlet.http.HttpServletRequest request) { return delegate.loadDeferredContext(request); }
        @Override public boolean containsContext(jakarta.servlet.http.HttpServletRequest request) { return delegate.containsContext(request); }
        @Override public void saveContext(org.springframework.security.core.context.SecurityContext context,
                jakarta.servlet.http.HttpServletRequest request, jakarta.servlet.http.HttpServletResponse response) {
            boolean signIn = context.getAuthentication() != null
                    && context.getAuthentication().getPrincipal() instanceof SessionService.Identity
                    && request.getMethod().equals("POST") && request.getServletPath().equals("/api/v1/identity/login");
            if (signIn && fault == BindingFault.SUPPRESS) return;
            if (signIn && fault == BindingFault.BEFORE_SAVE) throw new org.springframework.security.authentication.BadCredentialsException("Synthetic binding fault");
            delegate.saveContext(context, request, response);
            if (signIn && fault == BindingFault.AFTER_SAVE) throw new IllegalStateException("Synthetic post-binding fault");
        }
    }

    private void wrongAttempts(HttpClient caller, String login, int count) throws Exception {
        for (int attempt = 0; attempt < count; attempt++) {
            var refused = loginAttempt(caller, login, UUID.randomUUID().toString());
            assertEquals(401, refused.statusCode());
            assertEquals("", refused.body());
        }
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
    void unknownDisabledAndBlockedLoginsDoNotBypassPasswordWork() throws Exception {
        var dual = dualLoginFixture();
        var fixture = dual.first();
        var app = appDataSource();
        var operator = new ActorContext(dual.setup().administrator().actorId(), 1);
        var accounts = new IdentityAdministration(app);
        var disabled = accounts.create(operator, UUID.randomUUID(), fixture.organizationId(),
                "Synthetic disabled timing target", "synthetic.disabled." + UUID.randomUUID());
        assertEquals("DISABLED", accounts.disable(operator, UUID.randomUUID(), fixture.organizationId(),
                disabled.accountId(), disabled.securityVersion(), "Synthetic refusal fixture").status());

        var client = client();
        var activeClient = client();
        wrongAttempts(client, dual.second().login(), 5);
        var candidate = UUID.randomUUID().toString();
        var logins = new String[] { fixture.login(), "synthetic.unknown." + UUID.randomUUID(), disabled.normalizedLogin(), dual.second().login() };
        // Observe real HTTP wall time, not the injected eligibility Clock or private encoder calls.
        // Warm all paths, then rotate their order to reduce one-off startup/order effects.
        var samples = new long[4][9];
        for (int round = 0; round < 12; round++) {
            for (int position = 0; position < 4; position++) {
                int path = (round + position) % 4;
                var caller = path == 0 ? activeClient : client;
                var csrf = jsonField(get(caller, "/api/v1/identity/csrf").body(), "token");
                var elapsed = refusedLoginNanos(caller, csrf, logins[path], candidate);
                if (round >= 3) samples[path][round - 3] = elapsed;
                // Keep active/wrong genuinely outside a block, using real eligible HTTP sign-in.
                if (path == 0) assertEquals(200, loginAttempt(activeClient, fixture.login(), fixture.password()).statusCode());
            }
        }
        var medians = java.util.Arrays.stream(samples)
                .mapToLong(values -> java.util.Arrays.stream(values).sorted().toArray()[4]).toArray();
        System.out.printf(java.util.Locale.ROOT,
                "F03B_LOGIN_MEDIAN_MS=active-wrong:%.3f,unknown:%.3f,disabled:%.3f,blocked:%.3f; samples=9/path%n",
                medians[0] / 1_000_000.0, medians[1] / 1_000_000.0, medians[2] / 1_000_000.0, medians[3] / 1_000_000.0);
        assertAll("Bounded timing regression, not a constant-time or load qualification",
                () -> assertTrue(medians[1] >= medians[0] * 0.65,
                        "Unknown login must not expose the gross BCrypt-bypass timing gap"),
                () -> assertTrue(medians[2] >= medians[0] * 0.65,
                        "Disabled login must not expose the gross BCrypt-bypass timing gap"),
                () -> assertTrue(medians[3] >= medians[0] * 0.65,
                        "Blocked login must not expose the gross BCrypt-bypass timing gap"));
        assertEquals(5, loginWitness(dual.second().login()).failures());
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

    @Test
    void httpAccountCreationUsesTheSessionActorAndCreatesOnlyAPendingIdentity() throws Exception {
        var setup = setupFixture();
        var operation = UUID.randomUUID();
        var login = "synthetic.http.created." + UUID.randomUUID();
        var response = createAccount(setup.issuer(), operation, setup.administrator().organizationId(), login,
                ",\"actorId\":\"" + UUID.randomUUID() + "\"");
        assertEquals(201, response.statusCode());
        var accountId = UUID.fromString(jsonField(response.body(), "accountId"));
        var account = new IdentityAdministration(appDataSource()).inspect(accountId);
        assertEquals("PENDING", account.status());
        assertEquals(0, account.roleAssignments());
        assertEquals(account.actorId().toString(), jsonField(response.body(), "actorId"));
        assertEquals(account.loginIdentityId().toString(), jsonField(response.body(), "loginIdentityId"));
        assertEquals(new IdentityAdministration.Evidence("ACCEPTED", 1, 1),
                new IdentityAdministration(appDataSource()).evidence(operation));
        assertEquals(setup.administrator().actorId(), new IdentityAdministration(appDataSource()).history(accountId).getFirst().changedBy());
        var holder = client();
        var csrf = jsonField(get(holder, "/api/v1/identity/csrf").body(), "token");
        assertEquals(401, post(holder, "/api/v1/identity/login", csrf,
                "username=" + form(login) + "&password=" + form(UUID.randomUUID().toString())).statusCode());
        try (var connection = migrator(); var statement = connection.prepareStatement(
                "SELECT count(*) FROM login_identity WHERE account_id=? AND password_verifier IS NOT NULL")) {
            statement.setObject(1, account.accountId());
            try (var row = statement.executeQuery()) {
                assertTrue(row.next());
                assertEquals(0, row.getLong(1));
            }
        }
    }

    private HttpResponse<String> createAccount(HttpClient issuer, UUID operation, UUID organization, String login,
            String extraFields) throws Exception {
        var csrf = jsonField(get(issuer, "/api/v1/identity/csrf").body(), "token");
        return postJson(issuer, "/api/v1/identity/accounts", csrf,
                "{\"operationId\":\"" + operation + "\",\"organizationId\":\"" + organization
                + "\",\"displayName\":\"Synthetic HTTP target\",\"login\":\"" + login + "\"" + extraFields + "}");
    }

    @Test
    void httpDisableAndReenableKeepIdentityHistoryAndRequireFreshSigninForEveryOldSession() throws Exception {
        var setup = setupFixture();
        var accounts = new IdentityAdministration(appDataSource());
        var target = setup.target();
        var password = UUID.randomUUID().toString();
        assertEquals(204, redeem(client(), target.accountId(), proofFor(setup, target), password).statusCode());
        var active = accounts.inspect(target.accountId());
        var first = client();
        var second = client();
        assertEquals(200, loginAttempt(first, active.normalizedLogin(), password).statusCode());
        assertEquals(200, loginAttempt(second, active.normalizedLogin(), password).statusCode());
        var disable = UUID.randomUUID();
        var disabledResponse = changeAccount(setup.issuer(), disable, setup.administrator().organizationId(), active,
                "disable", active.securityVersion());
        assertEquals(200, disabledResponse.statusCode());
        assertEquals("DISABLED", jsonField(disabledResponse.body(), "status"));
        var disabled = accounts.inspect(active.accountId());
        assertEquals(active.actorId(), disabled.actorId());
        assertEquals(active.loginIdentityId(), disabled.loginIdentityId());
        assertEquals(active.securityVersion() + 1, disabled.securityVersion());
        assertEquals(401, get(first, "/api/v1/identity/session").statusCode());
        assertEquals(401, get(second, "/api/v1/identity/session").statusCode());
        assertEquals(401, loginAttempt(client(), active.normalizedLogin(), password).statusCode());
        var reenable = UUID.randomUUID();
        assertEquals(200, changeAccount(setup.issuer(), reenable, setup.administrator().organizationId(), disabled,
                "re-enable", disabled.securityVersion()).statusCode());
        var restored = accounts.inspect(active.accountId());
        assertEquals("ACTIVE", restored.status());
        assertEquals(active.actorId(), restored.actorId());
        assertEquals(active.loginIdentityId(), restored.loginIdentityId());
        assertEquals(active.securityVersion() + 2, restored.securityVersion());
        assertEquals(401, get(first, "/api/v1/identity/session").statusCode());
        assertEquals(401, get(second, "/api/v1/identity/session").statusCode());
        assertEquals(200, loginAttempt(client(), active.normalizedLogin(), password).statusCode());
        for (var operation : java.util.List.of(disable, reenable)) {
            assertEquals(new IdentityAdministration.Evidence("ACCEPTED", 1, 1), accounts.evidence(operation));
            assertEquals(setup.administrator().actorId(), accounts.history(active.accountId()).stream()
                    .filter(change -> change.operationId().equals(operation)).findFirst().orElseThrow().changedBy());
        }
    }

    private HttpResponse<String> changeAccount(HttpClient issuer, UUID operation, UUID organization,
            IdentityAdministration.Account target, String action, long expectedVersion) throws Exception {
        var csrf = jsonField(get(issuer, "/api/v1/identity/csrf").body(), "token");
        return postJson(issuer, "/api/v1/identity/accounts/" + target.accountId() + "/" + action, csrf,
                "{\"operationId\":\"" + operation + "\",\"organizationId\":\"" + organization
                + "\",\"expectedSecurityVersion\":" + expectedVersion + ",\"reason\":\"Synthetic HTTP lifecycle\"}");
    }

    @Test
    void httpAccountTransitionsSupportZeroLoginIdentitiesWithoutCreatingOrSelectingALogin() throws Exception {
        var setup = setupFixture();
        var accounts = new IdentityAdministration(appDataSource());
        var target = setup.target();
        // Controlled fixture for the governing 0..* cardinality; no public login-deletion API.
        try (var connection = migrator(); var statement = connection.prepareStatement(
                "DELETE FROM " + schema + ".login_identity WHERE account_id=?")) {
            statement.setObject(1, target.accountId());
            assertEquals(1, statement.executeUpdate());
        }
        var before = accounts.totals();
        var disable = UUID.randomUUID();
        var disabled = changeAccount(setup.issuer(), disable, target.organizationId(), target, "disable", 1);
        assertEquals(200, disabled.statusCode());
        assertEquals("DISABLED", jsonField(disabled.body(), "status"));
        assertEquals(target.actorId().toString(), jsonField(disabled.body(), "actorId"));
        assertEquals(target.accountId().toString(), jsonField(disabled.body(), "accountId"));
        assertFalse(disabled.body().contains("loginIdentityId"));
        var reenable = UUID.randomUUID();
        var restored = changeAccount(setup.issuer(), reenable, target.organizationId(), target, "re-enable", 2);
        assertEquals(200, restored.statusCode());
        assertEquals("PENDING", jsonField(restored.body(), "status"));
        assertEquals(target.actorId().toString(), jsonField(restored.body(), "actorId"));
        assertEquals(target.accountId().toString(), jsonField(restored.body(), "accountId"));
        assertFalse(restored.body().contains("loginIdentityId"));
        assertEquals(before.actors(), accounts.totals().actors());
        assertEquals(before.accounts(), accounts.totals().accounts());
        assertEquals(before.logins(), accounts.totals().logins());
        assertEquals(3, accounts.history(target.accountId()).size());
        assertEquals(3, accounts.history(target.accountId()).get(2).afterSecurityVersion());
        for (var operation : java.util.List.of(disable, reenable)) {
            assertEquals(new IdentityAdministration.Evidence("ACCEPTED", 1, 1), accounts.evidence(operation));
        }
    }

    @Test
    void httpAccountAuthorityRequiresCurrentScopedAssignmentAndCsrfNotSuperOrClientIdentity() throws Exception {
        var fixture = fixture();
        var issuer = signedIn(fixture);
        var anonymous = client();
        assertEquals(401, createAccount(anonymous, UUID.randomUUID(), fixture.organizationId(),
                "synthetic.anonymous." + UUID.randomUUID(), "").statusCode());
        assertEquals(403, createAccount(issuer, UUID.randomUUID(), fixture.organizationId(),
                "synthetic.super-only." + UUID.randomUUID(), "").statusCode());
        var roles = new RoleAssignmentAdministration(appDataSource());
        var context = new ActorContext(fixture.actorId(), 1);
        var v1 = roles.assignAccountAdministrator(context, UUID.randomUUID(), fixture.actorId(),
                UUID.fromString("9d80f77e-85a6-4c12-a72d-8ef6b7e0a002"), fixture.organizationId(), "Synthetic HTTP v1");
        var predecessor = roles.inspect(v1.assignmentId());
        var response = createAccount(issuer, UUID.randomUUID(), fixture.organizationId(),
                "synthetic.http.v1." + UUID.randomUUID(), "");
        assertEquals(201, response.statusCode(), "Existing v1 still has account lifecycle permission");
        var accounts = new IdentityAdministration(appDataSource());
        var target = accounts.inspect(UUID.fromString(jsonField(response.body(), "accountId")));
        var beforeHistory = accounts.history(target.accountId());
        var before = accounts.totals();
        var badCsrf = postJson(issuer, "/api/v1/identity/accounts", "incorrect-csrf", "{}");
        assertEquals(403, badCsrf.statusCode());
        assertEquals(before, accounts.totals());
        for (var action : java.util.List.of("disable", "re-enable")) {
            assertEquals(403, postJson(issuer, "/api/v1/identity/accounts/" + target.accountId() + "/" + action,
                    "incorrect-csrf", "{}").statusCode());
        }
        assertAccountHttpRefusal(issuer, UUID.randomUUID(), target, 403);
        roles.assignAccountAdministrator(context, UUID.randomUUID(), fixture.actorId(),
                UUID.fromString("9d80f77e-85a6-4c12-a72d-8ef6b7e0a003"), fixture.organizationId(), "Synthetic HTTP v2");
        assertEquals(predecessor, roles.inspect(v1.assignmentId()));
        var setup = new SetupFixture(fixture, issuer, target);
        var password = UUID.randomUUID().toString();
        assertEquals(204, redeem(client(), target.accountId(), proofFor(setup, target), password).statusCode());
        var ordinary = client();
        assertEquals(200, loginAttempt(ordinary, target.normalizedLogin(), password).statusCode());
        assertAccountHttpRefusal(ordinary, fixture.organizationId(), target, 403);
        var afterSetup = accounts.inspect(target.accountId());
        var history = accounts.history(target.accountId());
        // Controlled fixture revocation by migrator; runtime cannot edit role assignments.
        try (var connection = migrator(); var statement = connection.prepareStatement("UPDATE " + schema
                + ".identity_role_assignment SET revoked_at=CURRENT_TIMESTAMP WHERE principal_actor_id=? "
                + "AND role_version_id IN ('9d80f77e-85a6-4c12-a72d-8ef6b7e0a002','9d80f77e-85a6-4c12-a72d-8ef6b7e0a003')")) {
            statement.setObject(1, fixture.actorId());
            assertEquals(2, statement.executeUpdate());
        }
        assertAccountHttpRefusal(issuer, fixture.organizationId(), target, 403);
        assertEquals(afterSetup, accounts.inspect(target.accountId()));
        assertEquals(history, accounts.history(target.accountId()));
        assertEquals(1, beforeHistory.size());
    }

    private void assertAccountHttpRefusal(HttpClient issuer, UUID organization, IdentityAdministration.Account target,
            int status) throws Exception {
        var created = createAccount(issuer, UUID.randomUUID(), organization, "synthetic.refused." + UUID.randomUUID(), "");
        assertEquals(status, created.statusCode());
        assertEquals("", created.body());
        for (var action : java.util.List.of("disable", "re-enable")) {
            var response = changeAccount(issuer, UUID.randomUUID(), organization, target, action, target.securityVersion());
            assertEquals(status, response.statusCode());
            assertEquals("", response.body());
        }
    }

    @Test
    void httpAdministrationRefusesIdleExpiryBeforeScopeAndRefusalsDoNotRefreshActivity() throws Exception {
        var setup = setupFixture();
        var accounts = new IdentityAdministration(appDataSource());
        var before = accounts.inspect(setup.target().accountId());
        var history = accounts.history(before.accountId());
        clock.advanceTo(Instant.parse("2026-09-30T07:59:59Z"));
        assertAccountHttpRefusal(setup.issuer(), UUID.randomUUID(), before, 403);
        assertEquals(Instant.parse("2026-09-30T06:00:00Z"), issuerActivity(setup.administrator().accountId()));
        clock.advanceTo(Instant.parse("2026-09-30T08:00:00Z"));
        assertAccountHttpRefusal(setup.issuer(), UUID.randomUUID(), before, 401);
        assertAccountHttpRefusal(setup.issuer(), setup.administrator().organizationId(), before, 401);
        clock.advanceTo(Instant.parse("2026-09-30T08:00:01Z"));
        assertAccountHttpRefusal(setup.issuer(), setup.administrator().organizationId(), before, 401);
        assertEquals(before, accounts.inspect(before.accountId()));
        assertEquals(history, accounts.history(before.accountId()));
        assertEquals(Instant.parse("2026-09-30T06:00:00Z"), issuerActivity(setup.administrator().accountId()));
    }

    @Test
    void httpAdministrationRefusesAbsoluteExpiryEvenAfterEligibleActivity() throws Exception {
        var setup = setupFixture();
        for (int hour = 7; hour <= 13; hour++) {
            clock.advanceTo(Instant.parse("2026-09-30T" + String.format("%02d", hour) + ":00:00Z"));
            assertEquals(200, get(setup.issuer(), "/api/v1/identity/session").statusCode());
        }
        clock.advanceTo(Instant.parse("2026-09-30T13:59:59Z"));
        assertEquals(200, get(setup.issuer(), "/api/v1/identity/session").statusCode());
        clock.advanceTo(Instant.parse("2026-09-30T14:00:00Z"));
        assertAccountHttpRefusal(setup.issuer(), setup.administrator().organizationId(), setup.target(), 401);
        clock.advanceTo(Instant.parse("2026-09-30T14:00:01Z"));
        assertAccountHttpRefusal(setup.issuer(), setup.administrator().organizationId(), setup.target(), 401);
    }

    @Test
    void httpAdministrationRefusesDisabledReenabledAndRevokedIssuerSessionsWithoutLosingFreshAuthority() throws Exception {
        var setup = setupFixture();
        var accounts = new IdentityAdministration(appDataSource());
        var password = UUID.randomUUID().toString();
        assertEquals(204, redeem(client(), setup.target().accountId(), proofFor(setup, setup.target()), password).statusCode());
        var delegate = accounts.inspect(setup.target().accountId());
        new RoleAssignmentAdministration(appDataSource()).assignAccountAdministrator(
                new ActorContext(setup.administrator().actorId(), 1), UUID.randomUUID(), delegate.actorId(),
                UUID.fromString("9d80f77e-85a6-4c12-a72d-8ef6b7e0a003"), delegate.organizationId(), "Synthetic HTTP delegate");
        var issuer = client();
        assertEquals(200, loginAttempt(issuer, delegate.normalizedLogin(), password).statusCode());
        var target = pendingTarget(setup.administrator());
        assertEquals(200, changeAccount(setup.issuer(), UUID.randomUUID(), delegate.organizationId(), delegate,
                "disable", delegate.securityVersion()).statusCode());
        assertAccountHttpRefusal(issuer, delegate.organizationId(), target, 401);
        var disabled = accounts.inspect(delegate.accountId());
        assertEquals(200, changeAccount(setup.issuer(), UUID.randomUUID(), delegate.organizationId(), disabled,
                "re-enable", disabled.securityVersion()).statusCode());
        assertAccountHttpRefusal(issuer, delegate.organizationId(), target, 401);
        var fresh = client();
        assertEquals(200, loginAttempt(fresh, delegate.normalizedLogin(), password).statusCode());
        assertEquals(201, createAccount(fresh, UUID.randomUUID(), delegate.organizationId(),
                "synthetic.fresh.authority." + UUID.randomUUID(), "").statusCode());
        try (var connection = migrator(); var statement = connection.prepareStatement("UPDATE " + schema
                + ".session_record SET revoked_at=CURRENT_TIMESTAMP WHERE account_id=? AND revoked_at IS NULL")) {
            statement.setObject(1, delegate.accountId());
            assertTrue(statement.executeUpdate() > 0);
        }
        assertAccountHttpRefusal(fresh, delegate.organizationId(), target, 401);
    }

    @Test
    void httpAdministrationAcceptedActivityRefreshesIdleButInvalidMutationDoesNot() throws Exception {
        var setup = setupFixture();
        clock.advanceTo(Instant.parse("2026-09-30T07:00:00Z"));
        assertEquals(201, createAccount(setup.issuer(), UUID.randomUUID(), setup.administrator().organizationId(),
                "synthetic.activity." + UUID.randomUUID(), "").statusCode());
        assertEquals(clock.instant(), issuerActivity(setup.administrator().accountId()));
        clock.advanceTo(Instant.parse("2026-09-30T08:00:00Z"));
        assertEquals(409, changeAccount(setup.issuer(), UUID.randomUUID(), setup.administrator().organizationId(),
                setup.target(), "disable", setup.target().securityVersion() + 1).statusCode());
        assertEquals(Instant.parse("2026-09-30T07:00:00Z"), issuerActivity(setup.administrator().accountId()));
        clock.advanceTo(Instant.parse("2026-09-30T09:00:00Z"));
        assertAccountHttpRefusal(setup.issuer(), setup.administrator().organizationId(), setup.target(), 401);
    }

    private Instant issuerActivity(UUID account) throws Exception {
        try (var connection = migrator(); var statement = connection.prepareStatement("SELECT last_eligible_activity_at FROM "
                + schema + ".session_record WHERE account_id=? ORDER BY issued_at DESC")) {
            statement.setObject(1, account);
            try (var row = statement.executeQuery()) { assertTrue(row.next()); return row.getTimestamp(1).toInstant(); }
        }
    }

    @Test
    void httpAdministrationRevalidatesSessionAfterWaitingForTheSecurityWriteLock() throws Exception {
        var setup = setupFixture();
        var accounts = new IdentityAdministration(appDataSource());
        var before = accounts.totals();
        var pool = java.util.concurrent.Executors.newSingleThreadExecutor();
        try (var connection = migrator(); var statement = connection.createStatement();
                var observer = migrator(); var observation = observer.createStatement()) {
            connection.setAutoCommit(false);
            statement.execute("SELECT pg_advisory_xact_lock(73003002)");
            var response = pool.submit(() -> createAccount(setup.issuer(), UUID.randomUUID(),
                    setup.administrator().organizationId(), "synthetic.locked." + UUID.randomUUID(), ""));
            // pg_stat_activity hides another role's wait details. Observe the exact pg_locks key
            // through an autocommit connection instead, without granting extra monitoring privilege.
            long deadline = System.nanoTime() + java.time.Duration.ofSeconds(10).toNanos();
            boolean waiting = false;
            while (!waiting && System.nanoTime() < deadline) {
                try (var row = observation.executeQuery("SELECT EXISTS (SELECT 1 FROM pg_locks l "
                        + "JOIN pg_stat_activity a ON a.pid=l.pid "
                        + "WHERE a.datname=current_database() AND a.usename='idea_ddm_app' "
                        + "AND l.locktype='advisory' AND l.classid=0 AND l.objid=73003002 "
                        + "AND l.objsubid=1 AND NOT l.granted)")) {
                    assertTrue(row.next());
                    waiting = row.getBoolean(1);
                }
                if (!waiting) java.util.concurrent.locks.LockSupport.parkNanos(10_000_000);
            }
            assertTrue(waiting, "Request must reach the real security-write lock before time advances");
            clock.advanceTo(Instant.parse("2026-09-30T08:00:00Z"));
            connection.commit();
            assertEquals(401, response.get(10, java.util.concurrent.TimeUnit.SECONDS).statusCode());
            var after = accounts.totals();
            assertEquals(before.actors(), after.actors());
            assertEquals(before.accounts(), after.accounts());
            assertEquals(before.logins(), after.logins());
            assertEquals(before.changeEvidence(), after.changeEvidence());
            assertEquals(Instant.parse("2026-09-30T06:00:00Z"), issuerActivity(setup.administrator().accountId()));
        } finally { pool.shutdownNow(); }
    }

    @Test
    void httpAccountCreationRollsBackIfRequiredAuditIsMissing() throws Exception { requiredHttpAccountFailure("create", "audit_evidence"); }

    @Test
    void httpAccountCreationRollsBackIfRequiredIamOutcomeIsMissing() throws Exception { requiredHttpAccountFailure("create", "iam_owner_outcome"); }

    @Test
    void httpAccountDisableRollsBackIfRequiredAuditIsMissing() throws Exception { requiredHttpAccountFailure("disable", "audit_evidence"); }

    @Test
    void httpAccountDisableRollsBackIfRequiredIamOutcomeIsMissing() throws Exception { requiredHttpAccountFailure("disable", "iam_owner_outcome"); }

    @Test
    void httpAccountReenableRollsBackIfRequiredAuditIsMissing() throws Exception { requiredHttpAccountFailure("re-enable", "audit_evidence"); }

    @Test
    void httpAccountReenableRollsBackIfRequiredIamOutcomeIsMissing() throws Exception { requiredHttpAccountFailure("re-enable", "iam_owner_outcome"); }

    private void requiredHttpAccountFailure(String action, String table) throws Exception {
        assertTrue(java.util.Set.of("create", "disable", "re-enable").contains(action));
        assertTrue(java.util.Set.of("audit_evidence", "iam_owner_outcome").contains(table));
        var setup = setupFixture();
        var accounts = new IdentityAdministration(appDataSource());
        if ("re-enable".equals(action)) {
            assertEquals(200, changeAccount(setup.issuer(), UUID.randomUUID(), setup.administrator().organizationId(),
                    setup.target(), "disable", setup.target().securityVersion()).statusCode());
        }
        var target = accounts.inspect(setup.target().accountId());
        var before = accounts.totals();
        var history = accounts.history(target.accountId());
        var operation = UUID.randomUUID();
        var login = "synthetic.fault." + UUID.randomUUID();
        clock.advanceTo(Instant.parse("2026-09-30T07:00:00Z"));
        try (var connection = migrator(); var statement = connection.createStatement()) {
            statement.execute("CREATE FUNCTION " + schema + ".suppress_http_account() RETURNS trigger LANGUAGE plpgsql AS $$ "
                    + "BEGIN IF NEW.action='account." + action + "' THEN RETURN NULL; END IF; RETURN NEW; END $$");
            statement.execute("CREATE TRIGGER suppress_http_account BEFORE INSERT ON " + schema + "." + table
                    + " FOR EACH ROW EXECUTE FUNCTION " + schema + ".suppress_http_account()");
        }
        try {
            var response = "create".equals(action)
                    ? createAccount(setup.issuer(), operation, setup.administrator().organizationId(), login, "")
                    : changeAccount(setup.issuer(), operation, setup.administrator().organizationId(), target, action, target.securityVersion());
            assertEquals(503, response.statusCode());
            assertEquals("", response.body());
            assertEquals(before, accounts.totals());
            assertEquals(target, accounts.inspect(target.accountId()));
            assertEquals(history, accounts.history(target.accountId()));
            assertEquals(new IdentityAdministration.Evidence(null, 0, 0), accounts.evidence(operation));
            assertEquals(Instant.parse("2026-09-30T06:00:00Z"), issuerActivity(setup.administrator().accountId()));
        } finally {
            try (var connection = migrator(); var statement = connection.createStatement()) {
                statement.execute("DROP TRIGGER suppress_http_account ON " + schema + "." + table);
            }
        }
        var retry = "create".equals(action)
                ? createAccount(setup.issuer(), operation, setup.administrator().organizationId(), login, "")
                : changeAccount(setup.issuer(), operation, setup.administrator().organizationId(), target, action, target.securityVersion());
        assertEquals("create".equals(action) ? 201 : 200, retry.statusCode());
        assertEquals(new IdentityAdministration.Evidence("ACCEPTED", 1, 1), accounts.evidence(operation));
        assertEquals(clock.instant(), issuerActivity(setup.administrator().accountId()));
    }

    @Test
    void httpAccountCreationRejectsAnOverlongNormalizedLoginWithoutPartialState() throws Exception {
        var setup = setupFixture();
        var accounts = new IdentityAdministration(appDataSource());
        var before = accounts.totals();
        var operation = UUID.randomUUID();
        clock.advanceTo(Instant.parse("2026-09-30T07:00:00Z"));
        // U+0130 expands to two characters under Locale.ROOT lowercase: 128 becomes 256.
        var response = createAccount(setup.issuer(), operation, setup.administrator().organizationId(),
                "\u0130".repeat(128), "");
        assertEquals(400, response.statusCode());
        assertEquals("", response.body());
        var after = accounts.totals();
        assertEquals(before.actors(), after.actors());
        assertEquals(before.accounts(), after.accounts());
        assertEquals(before.logins(), after.logins());
        assertEquals(before.assignments(), after.assignments());
        assertEquals(before.changeEvidence(), after.changeEvidence());
        assertEquals(new IdentityAdministration.Evidence("REFUSED", 1, 1), accounts.evidence(operation));
        assertEquals(Instant.parse("2026-09-30T06:00:00Z"), issuerActivity(setup.administrator().accountId()));
        var accepted = createAccount(setup.issuer(), UUID.randomUUID(), setup.administrator().organizationId(),
                "\u0130".repeat(127), "");
        assertEquals(201, accepted.statusCode());
        var account = accounts.inspect(UUID.fromString(jsonField(accepted.body(), "accountId")));
        assertEquals("i\u0307".repeat(127), account.normalizedLogin());
        assertEquals("PENDING", account.status());
    }

    @Test
    void httpAccountInputAndStateRefusalsAreSafeAndLeaveNoPartialMutation() throws Exception {
        var setup = setupFixture();
        var accounts = new IdentityAdministration(appDataSource());
        var before = accounts.inspect(setup.target().accountId());
        var csrf = jsonField(get(setup.issuer(), "/api/v1/identity/csrf").body(), "token");
        assertEquals(400, postJson(setup.issuer(), "/api/v1/identity/accounts", csrf, "{}").statusCode());
        assertEquals(400, postJson(setup.issuer(), "/api/v1/identity/accounts/" + before.accountId() + "/disable", csrf, "{}").statusCode());
        var invalid = createAccount(setup.issuer(), UUID.randomUUID(), before.organizationId(), "", "");
        assertEquals(400, invalid.statusCode());
        assertEquals("", invalid.body());
        var duplicate = createAccount(setup.issuer(), UUID.randomUUID(), before.organizationId(), before.normalizedLogin(), "");
        assertEquals(409, duplicate.statusCode());
        assertEquals("", duplicate.body());
        assertEquals(409, changeAccount(setup.issuer(), UUID.randomUUID(), before.organizationId(), before,
                "disable", before.securityVersion() + 1).statusCode());
        assertEquals(409, changeAccount(setup.issuer(), UUID.randomUUID(), before.organizationId(), before,
                "re-enable", before.securityVersion()).statusCode());
        var missing = new IdentityAdministration.Account(UUID.randomUUID(), UUID.randomUUID(), UUID.randomUUID(),
                before.organizationId(), "Synthetic missing", "synthetic.missing", "ACTIVE", 1, 0);
        assertEquals(403, changeAccount(setup.issuer(), UUID.randomUUID(), before.organizationId(), missing, "disable", 1).statusCode());
        var superAccount = accounts.inspect(setup.administrator().accountId());
        assertEquals(403, changeAccount(setup.issuer(), UUID.randomUUID(), before.organizationId(), superAccount, "disable", 1).statusCode());
        assertEquals(before, accounts.inspect(before.accountId()));
        assertEquals(superAccount, accounts.inspect(superAccount.accountId()));
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
        return DriverManager.getConnection(url() + "?currentSchema=" + schema,
                "idea_ddm_migrator", env("IDEA_DATABASE_MIGRATION_PASSWORD"));
    }

    private String url() {
        if(System.getenv("IDEA_IAM_SOURCE_SHA")!=null)return com.idea.ddm.iam.IamRegressionSchemas.url();
        if(System.getenv("IDEA_F05_SOURCE_SHA")!=null)return "jdbc:postgresql://127.0.0.1:5432/"+F05DatabaseFixture.DATABASE;
        var database = env("IDEA_F03B_TEST_DATABASE_NAME");
        if (!database.equals("idea_ddm_f03a_20260930_c91e7a42")) {
            throw new IllegalStateException("Only the authorized F03-B test database is allowed");
        }
        return "jdbc:postgresql://" + env("IDEA_DATABASE_HOST") + ":" + env("IDEA_DATABASE_PORT") + "/" + database;
    }

    private static String env(String name) {
        if(System.getenv("IDEA_F05_SOURCE_SHA")!=null)return F05DatabaseFixture.regressionEnvironment(name);
        var value = System.getenv(name);
        if (value == null || value.isBlank()) throw new IllegalStateException("Missing test prerequisite: " + name);
        return value;
    }
}
