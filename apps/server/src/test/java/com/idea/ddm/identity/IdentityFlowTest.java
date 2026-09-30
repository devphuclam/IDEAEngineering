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
            statement.execute("GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA " + schema
                    + " TO idea_ddm_app");
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
