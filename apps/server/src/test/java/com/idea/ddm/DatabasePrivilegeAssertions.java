package com.idea.ddm;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.UUID;

final class DatabasePrivilegeAssertions {
    private static final String APP_USER = "idea_ddm_app";
    private static final String MIGRATION_USER = "idea_ddm_migrator";
    private static final String[] BASELINE_TABLES = {
            "actor", "idea_account", "login_identity", "session_record",
            "sample_owner_operation", "audit_evidence", "vault_endpoint", "transfer_record",
            "transfer_grant", "transfer_receipt", "artifact", "artifact_location"
    };

    private DatabasePrivilegeAssertions() {}

    static void assertMigrationRoleOwnsBaselineAndApplicationCannotCreateObjects() throws Exception {
        var appUser = requiredEnvironment("IDEA_DATABASE_APP_USER");
        var migrationUser = requiredEnvironment("IDEA_DATABASE_MIGRATION_USER");
        assertEquals(APP_USER, appUser, "Use the exact F02 application role");
        assertEquals(MIGRATION_USER, migrationUser, "Use the exact F02 migration role");
        assertNotEquals(appUser, migrationUser, "Application and migration roles must be distinct");

        try (var connection = appConnection(); var statement = connection.createStatement()) {
            try (var result = statement.executeQuery("""
                    SELECT current_user,
                           has_database_privilege(current_user, current_database(), 'CREATE'),
                           has_schema_privilege(current_user, 'public', 'CREATE')
                    """)) {
                assertTrue(result.next());
                assertEquals(appUser, result.getString(1), "The connection must authenticate as idea_ddm_app");
                assertFalse(result.getBoolean(2), "The application role must not create schemas in the database");
                assertFalse(result.getBoolean(3), "The application role must not create objects in public");
            }

            for (var table : BASELINE_TABLES) {
                try (var ownerQuery = connection.prepareStatement(
                        "SELECT tableowner FROM pg_catalog.pg_tables WHERE schemaname = 'public' AND tablename = ?")) {
                    ownerQuery.setString(1, table);
                    try (var owner = ownerQuery.executeQuery()) {
                        assertTrue(owner.next(), "Expected baseline table " + table);
                        assertEquals(migrationUser, owner.getString(1),
                                "The migration role must own baseline table " + table);
                    }
                }
            }

            var suffix = UUID.randomUUID().toString().replace("-", "");
            assertDdlDeniedAndCleaned(statement,
                    "CREATE SCHEMA f02_app_schema_probe_" + suffix,
                    "DROP SCHEMA IF EXISTS f02_app_schema_probe_" + suffix + " CASCADE");
            assertDdlDeniedAndCleaned(statement,
                    "CREATE TABLE public.f02_app_table_probe_" + suffix + " (id integer)",
                    "DROP TABLE IF EXISTS public.f02_app_table_probe_" + suffix);
        }
    }

    private static void assertDdlDeniedAndCleaned(Statement statement, String create, String cleanup)
            throws SQLException {
        String sqlState = null;
        boolean created = false;
        try {
            statement.execute(create);
            created = true;
        } catch (SQLException exception) {
            sqlState = exception.getSQLState();
        }

        if (created) {
            statement.execute(cleanup);
        }
        assertEquals("42501", sqlState, "Application DDL must fail with insufficient_privilege: " + create);
    }

    private static Connection appConnection() throws SQLException {
        return DriverManager.getConnection(databaseUrl(), APP_USER,
                requiredEnvironment("IDEA_DATABASE_APP_PASSWORD"));
    }

    private static String databaseUrl() {
        var host = requiredEnvironment("IDEA_DATABASE_HOST");
        var port = requiredEnvironment("IDEA_DATABASE_PORT");
        var database = requiredEnvironment("IDEA_F02_TEST_DATABASE_NAME");
        if (!database.matches("idea_ddm_f02_[a-z0-9_]+")) {
            throw new IllegalStateException("Use only a dedicated F02 test database");
        }
        if (!database.equals(requiredEnvironment("IDEA_DATABASE_NAME"))) {
            throw new IllegalStateException("The app and migration roles must target the same F02 database");
        }
        return "jdbc:postgresql://" + host + ":" + port + "/" + database;
    }

    private static String requiredEnvironment(String name) {
        var value = System.getenv(name);
        if (value == null || value.isBlank()) {
            throw new IllegalStateException("Required F02 test environment variable is missing: " + name);
        }
        return value;
    }
}
