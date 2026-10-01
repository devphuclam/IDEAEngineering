package com.idea.ddm.migration;

import java.util.Map;

import org.flywaydb.core.Flyway;

/** Explicit preflight command. It never runs as a side effect of starting the HTTP server. */
public final class DatabaseMigrationCommand {
    private DatabaseMigrationCommand() {}

    public static void main(String[] args) {
        try {
            int applied = migrate(System.getenv());
            System.out.println("MIGRATIONS_APPLIED=" + applied);
        } catch (RuntimeException exception) {
            System.err.println("Database migration failed; inspect the database connection and migration diagnostics.");
            System.exit(1);
        }
    }

    public static int migrate(Map<String, String> environment) {
        var jdbcUrl = "jdbc:postgresql://" + required(environment, "IDEA_DATABASE_HOST") + ":"
                + required(environment, "IDEA_DATABASE_PORT") + "/"
                + required(environment, "IDEA_DATABASE_NAME");
        var flyway = Flyway.configure()
                .dataSource(jdbcUrl,
                        required(environment, "IDEA_DATABASE_MIGRATION_USER"),
                        required(environment, "IDEA_DATABASE_MIGRATION_PASSWORD"))
                .locations("classpath:db/migration")
                .validateMigrationNaming(true)
                .cleanDisabled(true)
                .load();
        int applied = flyway.migrate().migrationsExecuted;
        // Bootstrap default ACLs must not give runtime authority over migration history.
        // Also run on a no-op migrate, so existing test databases receive the same restriction.
        try (var connection = flyway.getConfiguration().getDataSource().getConnection()) {
            connection.setAutoCommit(false);
            try (var statement = connection.createStatement()) {
                statement.execute("REVOKE ALL ON TABLE public.flyway_schema_history FROM PUBLIC, idea_ddm_app");
                statement.execute("GRANT SELECT ON TABLE public.flyway_schema_history TO idea_ddm_app");
                connection.commit();
            } catch (java.sql.SQLException exception) {
                connection.rollback();
                throw exception;
            }
        } catch (java.sql.SQLException exception) {
            throw new IllegalStateException("Migration history runtime privilege restriction failed", exception);
        }
        return applied;
    }

    private static String required(Map<String, String> environment, String name) {
        var value = environment.get(name);
        if (value == null || value.isBlank()) {
            throw new IllegalStateException("Missing required environment variable: " + name);
        }
        return value;
    }
}
