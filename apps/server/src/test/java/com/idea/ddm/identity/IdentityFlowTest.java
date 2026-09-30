package com.idea.ddm.identity;

import static org.junit.jupiter.api.Assertions.*;

import java.sql.DriverManager;
import java.util.UUID;
import org.flywaydb.core.Flyway;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfEnvironmentVariable;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

/** Agreed F03-A seam: Server identity services + real PostgreSQL. Not an HTTP/session test. */
@EnabledIfEnvironmentVariable(named = "IDEA_F03_TEST_DATABASE_NAME", matches = "idea_ddm_f02_[a-z0-9_]+")
class IdentityFlowTest {
    private String schema;
    private DriverManagerDataSource app;
    private AdministratorBootstrap bootstrap;
    private final UUID organization = UUID.randomUUID();

    @BeforeEach
    void isolatedMigratorOwnedSchema() throws Exception {
        assertEquals("idea_ddm_app", env("IDEA_DATABASE_APP_USER"));
        assertEquals("idea_ddm_migrator", env("IDEA_DATABASE_MIGRATION_USER"));
        schema = "f03a_" + UUID.randomUUID().toString().replace("-", "");
        Flyway.configure().dataSource(url(), env("IDEA_DATABASE_MIGRATION_USER"),
                env("IDEA_DATABASE_MIGRATION_PASSWORD"))
                .schemas(schema).defaultSchema(schema).locations("classpath:db/migration")
                .cleanDisabled(true).load().migrate();
        try (var connection = migrator(); var statement = connection.createStatement()) {
            statement.execute("GRANT USAGE ON SCHEMA " + schema + " TO idea_ddm_app");
        }
        app = new DriverManagerDataSource(url() + "?currentSchema=" + schema,
                env("IDEA_DATABASE_APP_USER"), env("IDEA_DATABASE_APP_PASSWORD"));
        bootstrap = new AdministratorBootstrap(app);
    }

    @AfterEach
    void removeOnlyThisTestsUuidSchema() throws Exception {
        if (schema != null && schema.matches("f03a_[a-f0-9]{32}")) {
            try (var connection = migrator(); var statement = connection.createStatement()) {
                statement.execute("DROP SCHEMA IF EXISTS " + schema + " CASCADE");
            }
        }
    }

    @Test
    void firstLocalBootstrapCreatesOnlyOneNamedSuperAdministrator() {
        var result = bootstrap.initialize(organization, "Synthetic IDEA organization",
                "Synthetic custodian", "fixture.custodian", "Synthetic-only-password-1!");
        assertEquals(AdministratorBootstrap.State.INITIALIZED, result.state());
        var snapshot = bootstrap.inspect();
        assertEquals(1, snapshot.actors());
        assertEquals(1, snapshot.accounts());
        assertEquals(1, snapshot.assignments());
        assertEquals(1, snapshot.auditEvents());
        assertEquals(result.actorId(), snapshot.custodianActorId());
        assertEquals("super-administrator@1", snapshot.initialRole());
        assertEquals(organization, snapshot.organizationId());
    }

    @Test
    void repeatingBootstrapCannotCreateAnotherIdentityOrGrant() {
        var first = bootstrap.initialize(organization, "Synthetic IDEA organization",
                "Synthetic custodian", "fixture.custodian", "Synthetic-only-password-1!");
        var before = bootstrap.inspect();
        var repeated = bootstrap.initialize(UUID.randomUUID(), "Another organization",
                "Another operator", "another.login", "Different-synthetic-password!");
        assertEquals(AdministratorBootstrap.State.ALREADY_INITIALIZED, repeated.state());
        assertEquals(first.actorId(), repeated.actorId());
        assertEquals(first.accountId(), repeated.accountId());
        assertEquals(before, bootstrap.inspect(), "A repeat must not change identity, grants or existing evidence");
    }

    @Test
    void failureWritingRequiredEvidenceRollsBackBootstrapAndAllowsARealRetry() throws Exception {
        try (var connection = migrator(); var statement = connection.createStatement()) {
            statement.execute("CREATE FUNCTION " + schema + ".test_refuse_outcome() RETURNS trigger "
                    + "LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'synthetic evidence failure'; END; $$");
            statement.execute("CREATE TRIGGER test_refuse_outcome BEFORE INSERT ON " + schema
                    + ".iam_owner_outcome FOR EACH ROW EXECUTE FUNCTION " + schema + ".test_refuse_outcome()");
        }
        assertThrows(IllegalStateException.class, () -> bootstrap.initialize(organization,
                "Synthetic IDEA organization", "Synthetic custodian", "fixture.custodian",
                "Synthetic-only-password-1!"));
        var afterFailure = bootstrap.inspect();
        assertEquals(0, afterFailure.actors());
        assertEquals(0, afterFailure.accounts());
        assertEquals(0, afterFailure.assignments());
        assertEquals(0, afterFailure.auditEvents());
        try (var connection = migrator(); var statement = connection.createStatement()) {
            statement.execute("DROP TRIGGER test_refuse_outcome ON " + schema + ".iam_owner_outcome");
        }
        assertEquals(AdministratorBootstrap.State.INITIALIZED, bootstrap.initialize(organization,
                "Synthetic IDEA organization", "Synthetic custodian", "fixture.custodian",
                "Synthetic-only-password-1!").state());
    }

    @Test
    void concurrentBootstrapAttemptsHaveExactlyOneWinner() throws Exception {
        var gate = new java.util.concurrent.CyclicBarrier(2);
        try (var executor = java.util.concurrent.Executors.newVirtualThreadPerTaskExecutor()) {
            java.util.concurrent.Callable<AdministratorBootstrap.Result> attempt = () -> {
                gate.await(10, java.util.concurrent.TimeUnit.SECONDS);
                return bootstrap.initialize(organization, "Synthetic IDEA organization",
                        "Synthetic custodian", "fixture.custodian", "Synthetic-only-password-1!");
            };
            var first = executor.submit(attempt);
            var second = executor.submit(attempt);
            var one = first.get(20, java.util.concurrent.TimeUnit.SECONDS);
            var two = second.get(20, java.util.concurrent.TimeUnit.SECONDS);
            assertNotEquals(one.state(), two.state());
            assertEquals(one.actorId(), two.actorId());
            assertEquals(one.accountId(), two.accountId());
            assertEquals(1, bootstrap.inspect().assignments());
        }
    }

    @Test
    void silentlySuppressedAuditInsertMustNotProduceBootstrapSuccess() throws Exception {
        try (var connection = migrator(); var statement = connection.createStatement()) {
            statement.execute("CREATE FUNCTION " + schema + ".test_suppress_audit() RETURNS trigger "
                    + "LANGUAGE plpgsql AS $$ BEGIN RETURN NULL; END; $$");
            statement.execute("CREATE TRIGGER test_suppress_audit BEFORE INSERT ON " + schema
                    + ".audit_evidence FOR EACH ROW EXECUTE FUNCTION " + schema + ".test_suppress_audit()");
        }
        assertThrows(IllegalStateException.class, () -> bootstrap.initialize(organization,
                "Synthetic IDEA organization", "Synthetic custodian", "fixture.custodian",
                "Synthetic-only-password-1!"));
        assertEquals(0, bootstrap.inspect().actors());
        assertEquals(0, bootstrap.inspect().assignments());
    }

    @Test
    void encoderRejectsOver72Utf8BytesWithoutLeavingPartialIdentity() {
        assertThrows(IllegalArgumentException.class, () -> bootstrap.initialize(organization,
                "Synthetic IDEA organization", "Synthetic custodian", "fixture.custodian", "界".repeat(25)));
        assertEquals(0, bootstrap.inspect().actors());
        assertEquals(AdministratorBootstrap.State.INITIALIZED, bootstrap.initialize(organization,
                "Synthetic IDEA organization", "Synthetic custodian", "fixture.custodian", "界".repeat(24)).state());
    }

    @Test
    void superAdministratorGrantsASeparateExactVersionAndScopeAssignment() {
        var custodian = bootstrap.initialize(organization, "Synthetic IDEA organization",
                "Synthetic custodian", "fixture.custodian", "Synthetic-only-password-1!");
        var context = new ActorContext(custodian.actorId(), 1);
        var roles = new RoleAssignmentAdministration(app);
        var operation = UUID.randomUUID();
        var roleVersion = UUID.fromString("9d80f77e-85a6-4c12-a72d-8ef6b7e0a002");
        var result = roles.assignAccountAdministrator(context, operation, custodian.actorId(),
                roleVersion, organization, "Synthetic separate account-management duty");
        var assignment = roles.inspect(result.assignmentId());
        assertEquals(roleVersion, assignment.roleVersionId());
        assertEquals("account-administrator", assignment.roleCode());
        assertEquals(1, assignment.version());
        assertEquals(organization, assignment.organizationId());
        assertEquals(custodian.actorId(), assignment.assignedBy());
        assertEquals("Synthetic separate account-management duty", assignment.reason());
        assertEquals(2, bootstrap.inspect().assignments(), "Super and account administration are separate grants");
        var evidence = roles.evidence(operation);
        assertEquals("ACCEPTED", evidence.outcome());
        assertEquals(1, evidence.ownerOutcomes());
        assertEquals(1, evidence.auditEvents());
    }

    @Test
    void superAloneCannotCreateAccountsButTheIndependentAssignmentCanCreateAPendingIdentity() {
        var custodian = bootstrap.initialize(organization, "Synthetic IDEA organization",
                "Synthetic custodian", "fixture.custodian", "Synthetic-only-password-1!");
        var context = new ActorContext(custodian.actorId(), 1);
        var accounts = new IdentityAdministration(app);
        var deniedOperation = UUID.randomUUID();
        var refusal = assertThrows(IdentityRefusal.class, () -> accounts.create(context, deniedOperation,
                organization, "Synthetic engineer", "Fixture.Engineer"));
        assertEquals("NO_APPLICABLE_ASSIGNMENT", refusal.reason());
        assertEquals(1, accounts.totals().actors());
        assertEquals(0, accounts.evidence(deniedOperation).ownerOutcomes(), "Initial denial is Audit-only");
        assertEquals(1, accounts.evidence(deniedOperation).auditEvents());
        var ownAccount = accounts.inspect(custodian.accountId());
        assertAccountActionsRefused(accounts, context, organization, ownAccount, "NO_APPLICABLE_ASSIGNMENT");

        new RoleAssignmentAdministration(app).assignAccountAdministrator(context, UUID.randomUUID(),
                custodian.actorId(), UUID.fromString("9d80f77e-85a6-4c12-a72d-8ef6b7e0a002"),
                organization, "Synthetic independent account-management duty");
        var operation = UUID.randomUUID();
        var account = accounts.create(context, operation, organization, "Synthetic engineer", "Fixture.Engineer");
        var saved = accounts.inspect(account.accountId());
        assertEquals(account, saved);
        assertEquals("PENDING", saved.status(), "No live password/activation channel has been approved or implemented");
        assertEquals(organization, saved.organizationId());
        assertEquals("fixture.engineer", saved.normalizedLogin());
        assertEquals(0, saved.roleAssignments(), "Account creation does not grant access");
        assertEquals(2, accounts.totals().actors());
        assertEquals(2, accounts.totals().accounts());
        assertEquals(2, accounts.totals().logins());
        assertEquals("ACCEPTED", accounts.evidence(operation).outcome());
        assertEquals(1, accounts.evidence(operation).ownerOutcomes());
        assertEquals(1, accounts.evidence(operation).auditEvents());
    }

    @Test
    void disableAndReenablePreserveIdentityAndHistoryWithoutActivatingAnUnconfiguredAccount() {
        var context = accountAdministrator();
        var accounts = new IdentityAdministration(app);
        var created = accounts.create(context, UUID.randomUUID(), organization, "Synthetic engineer", "fixture.lifecycle");
        var disabled = accounts.disable(context, UUID.randomUUID(), organization, created.accountId(),
                created.securityVersion(), "Synthetic account suspension");
        assertEquals("DISABLED", disabled.status());
        assertEquals(2, disabled.securityVersion());
        var operation = UUID.randomUUID();
        var reenabled = accounts.reenable(context, operation, organization, disabled.accountId(),
                disabled.securityVersion(), "Synthetic suspension lifted");
        assertEquals("PENDING", reenabled.status(), "Re-enable is not credential activation");
        assertEquals(3, reenabled.securityVersion());
        assertEquals(created.actorId(), reenabled.actorId());
        assertEquals(created.accountId(), reenabled.accountId());
        assertEquals(created.loginIdentityId(), reenabled.loginIdentityId());
        assertEquals(2, accounts.totals().actors());
        assertEquals(2, accounts.totals().accounts());
        assertEquals(3, accounts.history(created.accountId()).size());
        assertEquals("DISABLED", accounts.history(created.accountId()).get(1).afterStatus());
        assertEquals("Synthetic suspension lifted", accounts.history(created.accountId()).get(2).reason());
        assertEquals("ACCEPTED", accounts.evidence(operation).outcome());
        assertEquals(1, accounts.evidence(operation).ownerOutcomes());
        assertEquals(1, accounts.evidence(operation).auditEvents());
    }

    private ActorContext accountAdministrator() {
        var custodian = bootstrap.initialize(organization, "Synthetic IDEA organization",
                "Synthetic custodian", "fixture.custodian", "Synthetic-only-password-1!");
        var context = new ActorContext(custodian.actorId(), 1);
        new RoleAssignmentAdministration(app).assignAccountAdministrator(context, UUID.randomUUID(),
                custodian.actorId(), UUID.fromString("9d80f77e-85a6-4c12-a72d-8ef6b7e0a002"),
                organization, "Synthetic independent account-management duty");
        return context;
    }

    @Test
    void ordinaryWrongScopeAndRevokedAssignmentsCannotPerformAnyAccountAction() throws Exception {
        var issuer = accountAdministrator();
        var accounts = new IdentityAdministration(app);
        var target = accounts.create(issuer, UUID.randomUUID(), organization, "Synthetic target", "fixture.target");
        var ordinary = accounts.create(issuer, UUID.randomUUID(), organization, "Synthetic ordinary", "fixture.ordinary");
        activateFixtureOnly(ordinary.accountId());
        var ordinaryContext = new ActorContext(ordinary.actorId(), 1);
        assertAccountActionsRefused(accounts, ordinaryContext, organization, target, "NO_APPLICABLE_ASSIGNMENT");
        var grant = new RoleAssignmentAdministration(app).assignAccountAdministrator(issuer, UUID.randomUUID(),
                ordinary.actorId(), UUID.fromString("9d80f77e-85a6-4c12-a72d-8ef6b7e0a002"), organization,
                "Synthetic account administrator, separate from Super");
        assertAccountActionsRefused(accounts, ordinaryContext, UUID.randomUUID(), target, "WRONG_ORGANIZATION_SCOPE");
        var allowed = accounts.create(ordinaryContext, UUID.randomUUID(), organization, "Synthetic allowed", "fixture.allowed");
        assertEquals("PENDING", allowed.status(), "An assigned non-bootstrap Actor uses the same policy mechanism");
        var roleCount = accounts.totals().assignments();
        assertThrows(IdentityRefusal.class, () -> new RoleAssignmentAdministration(app).assignAccountAdministrator(
                ordinaryContext, UUID.randomUUID(), issuer.actorId(), UUID.fromString("9d80f77e-85a6-4c12-a72d-8ef6b7e0a002"),
                organization, "Synthetic unauthorized privilege assignment"));
        assertEquals(roleCount, accounts.totals().assignments(), "Account administration does not permit role grants");
        try (var connection = migrator(); var statement = connection.prepareStatement(
                "UPDATE " + schema + ".identity_role_assignment SET revoked_at=CURRENT_TIMESTAMP WHERE assignment_id=?")) {
            statement.setObject(1, grant.assignmentId());
            assertEquals(1, statement.executeUpdate());
        }
        assertAccountActionsRefused(accounts, ordinaryContext, organization, target, "NO_APPLICABLE_ASSIGNMENT");
        assertEquals(target, accounts.inspect(target.accountId()));
    }

    @Test
    void assignmentRejectsWrongRoleVersionAndChangesNoGrant() {
        var issuer = accountAdministrator();
        var roles = new RoleAssignmentAdministration(app);
        var before = bootstrap.inspect().assignments();
        var operation = UUID.randomUUID();
        assertEquals("UNSUPPORTED_ROLE_VERSION", assertThrows(IdentityRefusal.class, () -> roles.assignAccountAdministrator(
                issuer, operation, issuer.actorId(), UUID.fromString("9d80f77e-85a6-4c12-a72d-8ef6b7e0a001"),
                organization, "Synthetic wrong-role attempt")).reason());
        assertEquals(before, bootstrap.inspect().assignments());
        assertEquals("REFUSED", roles.evidence(operation).outcome());
        assertEquals(1, roles.evidence(operation).auditEvents());
    }

    private void assertAccountActionsRefused(IdentityAdministration accounts, ActorContext context, UUID scope,
            IdentityAdministration.Account target, String reason) {
        assertEquals(reason, assertThrows(IdentityRefusal.class, () -> accounts.create(context, UUID.randomUUID(),
                scope, "Synthetic refused", "fixture.refused")).reason());
        assertEquals(reason, assertThrows(IdentityRefusal.class, () -> accounts.disable(context, UUID.randomUUID(),
                scope, target.accountId(), target.securityVersion(), "Synthetic denied suspension")).reason());
        assertEquals(reason, assertThrows(IdentityRefusal.class, () -> accounts.reenable(context, UUID.randomUUID(),
                scope, target.accountId(), target.securityVersion(), "Synthetic denied recovery")).reason());
    }

    /** Synthetic eligibility fixture only: not account activation or password-proof acceptance evidence. */
    private void activateFixtureOnly(UUID account) throws Exception {
        try (var connection = migrator(); var statement = connection.prepareStatement(
                "UPDATE " + schema + ".idea_account SET status='ACTIVE' WHERE account_id=?")) {
            statement.setObject(1, account);
            assertEquals(1, statement.executeUpdate());
        }
        try (var connection = migrator(); var statement = connection.prepareStatement(
                "UPDATE " + schema + ".login_identity SET password_verifier=? WHERE account_id=?")) {
            statement.setString(1, new NativePasswordVerifier().encode("Synthetic-fixture-credential!"));
            statement.setObject(2, account);
            assertEquals(1, statement.executeUpdate());
        }
    }

    @Test
    void disablingTheLastEffectiveSuperAdministratorRecoveryPathIsRefused() {
        var context = accountAdministrator();
        var accounts = new IdentityAdministration(app);
        var accountId = bootstrap.initialize(organization, "unused", "unused", "unused", "unused").accountId();
        var before = accounts.inspect(accountId);
        var operation = UUID.randomUUID();
        assertEquals("LAST_SUPER_ADMINISTRATOR_RECOVERY_PATH", assertThrows(IdentityRefusal.class,
                () -> accounts.disable(context, operation, organization, accountId, 1,
                        "Synthetic attempt to remove the final recovery path")).reason());
        assertEquals(before, accounts.inspect(accountId));
        assertEquals("REFUSED", accounts.evidence(operation).outcome());
    }

    @Test
    void activeIdentityLifecyclePreservesIdsAndRefusesStaleChanges() throws Exception {
        var context = accountAdministrator();
        var accounts = new IdentityAdministration(app);
        var target = accounts.create(context, UUID.randomUUID(), organization, "Synthetic active", "fixture.active");
        activateFixtureOnly(target.accountId());
        var disabled = accounts.disable(context, UUID.randomUUID(), organization, target.accountId(), 1, "Synthetic active suspension");
        var staleOperation = UUID.randomUUID();
        assertEquals("STALE_ACCOUNT_VERSION", assertThrows(IdentityRefusal.class, () -> accounts.reenable(context,
                staleOperation, organization, target.accountId(), 1, "Synthetic stale attempt")).reason());
        assertEquals(disabled, accounts.inspect(target.accountId()));
        assertEquals("REFUSED", accounts.evidence(staleOperation).outcome());
        var restored = accounts.reenable(context, UUID.randomUUID(), organization, target.accountId(), 2, "Synthetic active recovery");
        assertEquals("ACTIVE", restored.status());
        assertEquals(3, restored.securityVersion());
        assertEquals(target.actorId(), restored.actorId());
        assertEquals(target.loginIdentityId(), restored.loginIdentityId());
    }

    @Test
    void suppressedLoginInsertCannotLeaveAnIssuedActorOrAccount() throws Exception {
        var context = accountAdministrator();
        var accounts = new IdentityAdministration(app);
        var before = accounts.totals();
        forceInsertFailure("login_identity", true);
        assertThrows(IllegalStateException.class, () -> accounts.create(context, UUID.randomUUID(), organization,
                "Synthetic failed identity", "fixture.failed.login"));
        assertEquals(before, accounts.totals());
    }

    @Test
    void requiredIamOutcomeFailureRollsBackIssuedIdentityAndEvidence() throws Exception {
        var context = accountAdministrator();
        var accounts = new IdentityAdministration(app);
        var before = accounts.totals();
        forceInsertFailure("iam_owner_outcome", false);
        assertThrows(IllegalStateException.class, () -> accounts.create(context, UUID.randomUUID(), organization,
                "Synthetic failed identity", "fixture.failed.outcome"));
        assertEquals(before, accounts.totals());
    }

    @Test
    void suppressedAuditInsertRollsBackBothDisableAndReenable() throws Exception {
        var context = accountAdministrator();
        var accounts = new IdentityAdministration(app);
        var target = accounts.create(context, UUID.randomUUID(), organization, "Synthetic failure target", "fixture.audit.failure");
        var before = accounts.totals();
        forceInsertFailure("audit_evidence", true);
        assertThrows(IllegalStateException.class, () -> accounts.disable(context, UUID.randomUUID(), organization,
                target.accountId(), 1, "Synthetic failed suspension"));
        assertEquals(target, accounts.inspect(target.accountId()));
        assertEquals(before, accounts.totals());
        removeInsertFailure("audit_evidence");
        var disabled = accounts.disable(context, UUID.randomUUID(), organization, target.accountId(), 1, "Synthetic allowed suspension");
        before = accounts.totals();
        forceInsertFailure("audit_evidence", true);
        assertThrows(IllegalStateException.class, () -> accounts.reenable(context, UUID.randomUUID(), organization,
                target.accountId(), 2, "Synthetic failed recovery"));
        assertEquals(disabled, accounts.inspect(target.accountId()));
        assertEquals(before, accounts.totals());
    }

    @Test
    void assignmentAuditFailureRollsBackTheSeparateGrantAndOwnerOutcome() throws Exception {
        var context = accountAdministrator();
        var accounts = new IdentityAdministration(app);
        var target = accounts.create(context, UUID.randomUUID(), organization, "Synthetic grant target", "fixture.grant.failure");
        activateFixtureOnly(target.accountId());
        var before = accounts.totals();
        var operation = UUID.randomUUID();
        forceInsertFailure("audit_evidence", true);
        var roles = new RoleAssignmentAdministration(app);
        assertThrows(IllegalStateException.class, () -> roles.assignAccountAdministrator(context, operation,
                target.actorId(), UUID.fromString("9d80f77e-85a6-4c12-a72d-8ef6b7e0a002"), organization, "Synthetic failed role grant"));
        assertEquals(before, accounts.totals());
        assertEquals(0, roles.evidence(operation).ownerOutcomes());
        assertEquals(0, roles.evidence(operation).auditEvents());
    }

    @Test
    void bootstrapOperatorCommandRefusesHeadlessInitializationBeforeConnecting() throws Exception {
        var process = new ProcessBuilder(System.getProperty("java.home") + "/bin/java", "-cp",
                System.getProperty("java.class.path"), "com.idea.ddm.identity.BootstrapOperatorCommand", "--initialize")
                .redirectErrorStream(true).start();
        assertTrue(process.waitFor(10, java.util.concurrent.TimeUnit.SECONDS));
        var output = new String(process.getInputStream().readAllBytes(), java.nio.charset.StandardCharsets.UTF_8);
        assertEquals(2, process.exitValue());
        assertTrue(output.contains("Interactive operator console required"));
        assertEquals(0, bootstrap.inspect().actors());
    }

    @Test
    void invalidAssignmentReasonReturnsAnAttributableRefusalWithoutANewGrant() {
        var context = accountAdministrator();
        var roles = new RoleAssignmentAdministration(app);
        var before = bootstrap.inspect().assignments();
        var operation = UUID.randomUUID();
        assertEquals("INVALID_INPUT", assertThrows(IdentityRefusal.class, () -> roles.assignAccountAdministrator(
                context, operation, context.actorId(), UUID.fromString("9d80f77e-85a6-4c12-a72d-8ef6b7e0a002"),
                organization, " ")).reason());
        assertEquals(before, bootstrap.inspect().assignments());
        assertEquals("REFUSED", roles.evidence(operation).outcome());
        assertEquals(1, roles.evidence(operation).auditEvents());
    }

    @Test
    void runtimeCannotRewriteOrRemoveExistingRoleAssignments() throws Exception {
        bootstrap.initialize(organization, "Synthetic IDEA organization", "Synthetic custodian",
                "fixture.custodian", "Synthetic-only-password-1!");
        var before = bootstrap.inspect();
        // PostgreSQL's runtime-role boundary: ordinary SQL cannot rewrite retained authority.
        try (var connection = app.getConnection(); var statement = connection.createStatement()) {
            for (var sql : java.util.List.of(
                    "UPDATE identity_role_assignment SET reason='Synthetic forbidden rewrite'",
                    "DELETE FROM identity_role_assignment",
                    "TRUNCATE identity_role_assignment CASCADE")) {
                var refusal = assertThrows(java.sql.SQLException.class, () -> statement.executeUpdate(sql));
                assertEquals("42501", refusal.getSQLState(), "The runtime role must lack this database privilege");
            }
        }
        assertEquals(before, bootstrap.inspect(), "Existing assignments and evidence must remain intact");
    }

    private void forceInsertFailure(String table, boolean silentlySuppress) throws Exception {
        try (var connection = migrator(); var statement = connection.createStatement()) {
            statement.execute("CREATE OR REPLACE FUNCTION " + schema + ".test_fail_insert() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN "
                    + (silentlySuppress ? "RETURN NULL;" : "RAISE EXCEPTION 'synthetic required evidence failure';") + " END; $$");
            statement.execute("CREATE TRIGGER test_fail_insert BEFORE INSERT ON " + schema + "." + table
                    + " FOR EACH ROW EXECUTE FUNCTION " + schema + ".test_fail_insert()");
        }
    }

    private void removeInsertFailure(String table) throws Exception {
        try (var connection = migrator(); var statement = connection.createStatement()) {
            statement.execute("DROP TRIGGER test_fail_insert ON " + schema + "." + table);
        }
    }

    private java.sql.Connection migrator() throws Exception {
        return DriverManager.getConnection(url(), env("IDEA_DATABASE_MIGRATION_USER"),
                env("IDEA_DATABASE_MIGRATION_PASSWORD"));
    }

    private static String url() {
        return "jdbc:postgresql://" + env("IDEA_DATABASE_HOST") + ":" + env("IDEA_DATABASE_PORT")
                + "/" + env("IDEA_F03_TEST_DATABASE_NAME");
    }

    private static String env(String key) {
        var value = System.getenv(key);
        if (value == null || value.isBlank()) throw new IllegalStateException("Missing test variable: " + key);
        return value;
    }
}
