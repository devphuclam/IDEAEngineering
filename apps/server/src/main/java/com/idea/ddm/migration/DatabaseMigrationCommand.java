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
        return flyway.migrate().migrationsExecuted;
    }

    private static String required(Map<String, String> environment, String name) {
        var value = environment.get(name);
        if (value == null || value.isBlank()) {
            throw new IllegalStateException("Missing required environment variable: " + name);
        }
        return value;
    }
}
