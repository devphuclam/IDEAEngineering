package com.idea.ddm.identity;

import static org.junit.jupiter.api.Assertions.*;

import java.nio.file.*;
import java.nio.file.attribute.PosixFilePermission;
import java.sql.*;
import java.util.*;
import org.flywaydb.core.Flyway;

/** Exact new-DB/run-schema boundary. No cleanup or public migration in this fixture. */
public final class F05DatabaseFixture {
    public static final String DATABASE = "idea_ddm_f05a_20261005_t028";
    private F05DatabaseFixture() {}
    public static String schema() {
        var schema = System.getenv("IDEA_F05_TEST_SCHEMA");
        if (schema == null || !schema.matches("f05_[0-9a-f]{32}")) throw new IllegalStateException("Unapproved schema");
        return schema;
    }
    public static String url() { return "jdbc:postgresql://127.0.0.1:5432/" + DATABASE + "?currentSchema=" + schema(); }
    public static String password(String role) throws Exception {
        var file = Path.of("/home/phuclam/.config/idea/f03a-test.env");
        if (!file.toRealPath().equals(file) || !Files.getOwner(file).getName().equals("phuclam")
                || !Files.getPosixFilePermissions(file).equals(Set.of(PosixFilePermission.OWNER_READ, PosixFilePermission.OWNER_WRITE)))
            throw new SecurityException("Credential-file boundary");
        String key = switch(role) { case "app" -> "IDEA_DATABASE_APP_PASSWORD"; case "migration" -> "IDEA_DATABASE_MIGRATION_PASSWORD"; default -> throw new SecurityException("Role"); };
        for (var line : Files.readAllLines(file)) {
            if (line.startsWith("export ")) line = line.substring(7);
            if (line.startsWith(key + "=")) return literal(line.substring(key.length() + 1));
        }
        throw new SecurityException("Missing private test credential");
    }
    // Literal shell escaping only; never shell execution, interpolation, substitution or diagnostic echo.
    private static String literal(String raw) {
        var result = new StringBuilder(); char quote = 0;
        for (int i = 0; i < raw.length(); i++) {
            char c = raw.charAt(i);
            if (quote == '\'') { if (c == '\'') quote = 0; else result.append(c); }
            else if (c == '\\') { if (++i == raw.length()) throw new SecurityException("Credential literal syntax"); result.append(raw.charAt(i)); }
            else if (c == '\'' || c == '"') { if (quote == c) quote = 0; else if (quote == 0) quote = c; else result.append(c); }
            else { if (c == '$' || c == '`' || Character.isWhitespace(c)) throw new SecurityException("Nonliteral credential format"); result.append(c); }
        }
        if (quote != 0 || result.isEmpty()) throw new SecurityException("Credential literal syntax");
        return result.toString();
    }
    public static Connection open(String role) throws Exception {
        return DriverManager.getConnection(url(), role.equals("app") ? "idea_ddm_app" : "idea_ddm_migrator", password(role));
    }
    public static void create() throws Exception {
        var source = System.getenv("IDEA_F05_SOURCE_SHA");
        assertNotNull(source); assertTrue(source.matches("[0-9a-f]{40}"));
        try (var connection = open("migration"); var statement = connection.createStatement()) {
            connection.setAutoCommit(false);
            try (var row = statement.executeQuery("SELECT current_user,current_database(),(SELECT pg_get_userbyid(datdba) FROM pg_database WHERE datname=current_database())")) {
                assertTrue(row.next()); assertEquals("idea_ddm_migrator", row.getString(1));
                assertEquals(DATABASE, row.getString(2)); assertEquals("idea_ddm_migrator", row.getString(3));
            }
            statement.execute("CREATE SCHEMA " + schema() + " AUTHORIZATION idea_ddm_migrator");
            statement.execute("COMMENT ON SCHEMA " + schema() + " IS 'IDEA_F05_RUN:" + source + ":" + schema() + "'");
            connection.commit();
        }
        System.out.println("F05_SCHEMA_CREATED=" + schema() + "; SOURCE=" + source);
        var result = Flyway.configure().dataSource(url(), "idea_ddm_migrator", password("migration"))
                .schemas(schema()).defaultSchema(schema()).createSchemas(false).cleanDisabled(true)
                .locations("classpath:db/migration").load().migrate();
        try (var connection = open("migration"); var statement = connection.createStatement()) {
            statement.execute("GRANT USAGE ON SCHEMA " + schema() + " TO idea_ddm_app");
            statement.execute("REVOKE INSERT,UPDATE,DELETE,TRUNCATE ON " + schema() + ".flyway_schema_history FROM idea_ddm_app");
            statement.execute("GRANT SELECT ON " + schema() + ".flyway_schema_history TO idea_ddm_app");
        }
        try (var connection = open("app"); var statement = connection.createStatement(); var row = statement.executeQuery(
                "SELECT current_user,has_database_privilege(current_user,current_database(),'CREATE'),has_schema_privilege(current_user,current_schema(),'CREATE')")) {
            assertTrue(row.next()); assertEquals("idea_ddm_app", row.getString(1)); assertFalse(row.getBoolean(2)); assertFalse(row.getBoolean(3));
        }
        System.out.println("F05_SCHEMA_READY=" + schema() + "; MIGRATIONS_APPLIED=" + result.migrationsExecuted);
    }
}
