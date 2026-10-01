package com.idea.ddm.identity;

import java.nio.charset.StandardCharsets;
import java.sql.Connection;
import java.util.UUID;
import org.flywaydb.core.Flyway;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

/** External test fixture only; never packaged, exposed by HTTP, or used as client evidence. */
public final class WebQualificationFixture {
    public static void main(String[] arguments) {
        try { run(arguments); }
        catch (Exception failure) {
            // Do not print JDBC diagnostics, input, verifier, or exception messages.
            System.err.println("T043_FIXTURE_FAILED=" + failure.getClass().getSimpleName());
            System.exit(1);
        }
    }

    private static void run(String[] arguments) throws Exception {
        if (arguments.length != 2 || !arguments[1].matches("[a-f0-9]{32}"))
            throw new IllegalArgumentException("Invalid owned fixture identifier");
        var action = arguments[0];
        var id = arguments[1];
        var schema = "t043_web_" + id;
        var marker = "IDEA T043 browser qualification " + id;
        if (!"idea_ddm_app".equals(env("IDEA_DATABASE_APP_USER"))
                || !"idea_ddm_migrator".equals(env("IDEA_DATABASE_MIGRATION_USER")))
            throw new IllegalStateException("Unexpected test roles");
        var base = "jdbc:postgresql://127.0.0.1:5432/idea_ddm_f03a_20260930_c91e7a42";
        var migrator = dataSource(base + "?currentSchema=" + schema, true);
        var app = dataSource(base + "?currentSchema=" + schema, false);
        switch (action) {
            case "prepare" -> {
                var password = new String(System.in.readNBytes(128), StandardCharsets.UTF_8).strip();
                if (!password.matches("[a-f0-9]{48}")) throw new IllegalArgumentException("Synthetic input required");
                try (var connection = migrator.getConnection(); var statement = connection.createStatement()) {
                    // No IF NOT EXISTS: this run must never adopt someone else's schema.
                    statement.execute("CREATE SCHEMA " + schema + " AUTHORIZATION idea_ddm_migrator");
                    statement.execute("COMMENT ON SCHEMA " + schema + " IS '" + marker + "'");
                }
                System.out.println("T043_OWNED_SCHEMA_CREATED=YES");
                Flyway.configure().dataSource(migrator).schemas(schema).defaultSchema(schema)
                        .locations("classpath:db/migration").cleanDisabled(true).load().migrate();
                try (var connection = migrator.getConnection(); var statement = connection.createStatement()) {
                    statement.execute("GRANT USAGE ON SCHEMA " + schema + " TO idea_ddm_app");
                }
                var organization = UUID.randomUUID();
                var initial = new AdministratorBootstrap(app).initialize(organization,
                        "Synthetic T043 organization", "Synthetic fixture administrator", "t043.admin." + id, password);
                var context = new ActorContext(initial.actorId(), 1);
                new RoleAssignmentAdministration(app).assignAccountAdministrator(context, UUID.randomUUID(),
                        initial.actorId(), UUID.fromString("9d80f77e-85a6-4c12-a72d-8ef6b7e0a002"),
                        organization, "Separate synthetic fixture account-management assignment");
                var target = new IdentityAdministration(app).create(context, UUID.randomUUID(), organization,
                        "Synthetic Web target", "t043.target." + id);
                // Explicit test-only credential/activation precondition, not setup/lifecycle qualification.
                // Browser tests observe login/session behavior; existing HTTP tests own proof redemption.
                try (var connection = migrator.getConnection()) {
                    connection.setAutoCommit(false);
                    AdministratorBootstrap.insert(connection, "UPDATE login_identity SET password_verifier=? "
                            + "WHERE login_identity_id=? AND password_verifier IS NULL",
                            new NativePasswordVerifier().encodeNewCredential(password), target.loginIdentityId());
                    AdministratorBootstrap.insert(connection, "UPDATE idea_account SET status='ACTIVE',security_version=2 "
                            + "WHERE account_id=? AND status='PENDING'", target.accountId());
                    connection.commit();
                }
                System.out.printf("{\"schema\":\"%s\",\"actorId\":\"%s\",\"accountId\":\"%s\",\"login\":\"t043.target.%s\"}%n",
                        schema, target.actorId(), target.accountId(), id);
            }
            case "disable" -> {
                try (var connection = migrator.getConnection()) { requireOwned(connection, schema, marker); }
                var initial = new AdministratorBootstrap(app).inspect();
                UUID account;
                try (var connection = app.getConnection(); var query = connection.prepareStatement(
                        "SELECT account_id FROM login_identity WHERE normalized_login_identifier=?")) {
                    query.setString(1, "t043.target." + id);
                    try (var row = query.executeQuery()) {
                        if (!row.next()) throw new IllegalStateException("Target missing");
                        account = row.getObject(1, UUID.class);
                    }
                }
                var changed = new IdentityAdministration(app).disable(new ActorContext(initial.custodianActorId(), 1),
                        UUID.randomUUID(), initial.organizationId(), account, 2, "Authorized synthetic Web invalidation");
                if (!"DISABLED".equals(changed.status()) || changed.securityVersion() != 3)
                    throw new IllegalStateException("Disablement not established");
                System.out.println("T043_TARGET_DISABLED=YES");
            }
            case "cleanup" -> {
                try (var connection = migrator.getConnection()) {
                    requireOwned(connection, schema, marker);
                    try (var statement = connection.createStatement()) {
                        statement.execute("DROP SCHEMA " + schema + " CASCADE");
                    }
                }
                System.out.println("T043_OWNED_SCHEMA_REMOVED=YES");
            }
            default -> throw new IllegalArgumentException("Unsupported fixture action");
        }
    }

    private static void requireOwned(Connection connection, String schema, String marker) throws Exception {
        try (var query = connection.prepareStatement(
                "SELECT pg_get_userbyid(nspowner),obj_description(oid,'pg_namespace') FROM pg_namespace WHERE nspname=?")) {
            query.setString(1, schema);
            try (var row = query.executeQuery()) {
                if (!row.next() || !"idea_ddm_migrator".equals(row.getString(1)) || !marker.equals(row.getString(2)))
                    throw new IllegalStateException("Owned schema guard refused");
            }
        }
    }

    private static DriverManagerDataSource dataSource(String url, boolean migrator) {
        if (migrator) return new DriverManagerDataSource(url, env("IDEA_DATABASE_MIGRATION_USER"),
                env("IDEA_DATABASE_MIGRATION_PASSWORD"));
        return new DriverManagerDataSource(url, env("IDEA_DATABASE_APP_USER"), env("IDEA_DATABASE_APP_PASSWORD"));
    }

    private static String env(String key) {
        var value = System.getenv(key);
        if (value == null || value.isBlank()) throw new IllegalStateException("Test prerequisite missing");
        return value;
    }
}
