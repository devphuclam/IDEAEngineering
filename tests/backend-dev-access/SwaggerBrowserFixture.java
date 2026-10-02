package com.idea.ddm.identity;

import java.nio.charset.StandardCharsets;
import java.util.UUID;
import org.flywaydb.core.Flyway;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

/** Private fixture only: never packaged or exposed as an application route. */
public final class SwaggerBrowserFixture {
    public static void main(String[] args) {
        try { run(args); }
        catch (Exception failure) { System.err.println("SWAGGER_FIXTURE_FAILED"); System.exit(1); }
    }
    private static void run(String[] args) throws Exception {
        if (args.length != 2 || !args[1].matches("[a-f0-9]{32}")) throw new IllegalArgumentException();
        if (!"idea_ddm_preview_20261001_26".equals(env("IDEA_DATABASE_NAME"))
                || !"idea_ddm_app".equals(env("IDEA_DATABASE_APP_USER"))
                || !"idea_ddm_migrator".equals(env("IDEA_DATABASE_MIGRATION_USER")))
            throw new IllegalStateException();
        var schema = "devaccess_browser_" + args[1];
        var marker = "IDEA Work Item 26 Swagger fixture " + args[1];
        var url = "jdbc:postgresql://127.0.0.1:5432/idea_ddm_preview_20261001_26?currentSchema=" + schema;
        var migrator = new DriverManagerDataSource(url, "idea_ddm_migrator", env("IDEA_DATABASE_MIGRATION_PASSWORD"));
        switch (args[0]) {
            case "prepare" -> {
                var password = new String(System.in.readNBytes(128), StandardCharsets.UTF_8).strip();
                if (!password.matches("[a-f0-9]{48}")) throw new IllegalArgumentException();
                try (var connection = migrator.getConnection(); var statement = connection.createStatement()) {
                    statement.execute("CREATE SCHEMA " + schema + " AUTHORIZATION idea_ddm_migrator");
                    statement.execute("COMMENT ON SCHEMA " + schema + " IS '" + marker + "'");
                }
                System.out.println("SWAGGER_SCHEMA_CREATED=YES");
                Flyway.configure().dataSource(migrator).schemas(schema).defaultSchema(schema)
                        .locations("classpath:db/migration").cleanDisabled(true).load().migrate();
                try (var connection = migrator.getConnection(); var statement = connection.createStatement()) {
                    statement.execute("GRANT USAGE ON SCHEMA " + schema + " TO idea_ddm_app");
                }
                var app = new DriverManagerDataSource(url, "idea_ddm_app", env("IDEA_DATABASE_APP_PASSWORD"));
                new AdministratorBootstrap(app).initialize(UUID.randomUUID(), "Synthetic Swagger organization",
                        "Synthetic developer", "swagger.synthetic." + args[1], password);
                System.out.println("SWAGGER_FIXTURE_READY=YES");
            }
            case "cleanup" -> {
                try (var connection = migrator.getConnection(); var query = connection.prepareStatement(
                        "SELECT pg_get_userbyid(nspowner),obj_description(oid,'pg_namespace') FROM pg_namespace WHERE nspname=?")) {
                    query.setString(1, schema);
                    try (var row = query.executeQuery()) {
                        if (!row.next() || !"idea_ddm_migrator".equals(row.getString(1)) || !marker.equals(row.getString(2)))
                            throw new IllegalStateException();
                    }
                    try (var statement = connection.createStatement()) { statement.execute("DROP SCHEMA " + schema + " CASCADE"); }
                }
                System.out.println("SWAGGER_SCHEMA_REMOVED=YES");
            }
            default -> throw new IllegalArgumentException();
        }
    }
    private static String env(String name) {
        var value = System.getenv(name);
        if (value == null || value.isBlank()) throw new IllegalStateException();
        return value;
    }
}
