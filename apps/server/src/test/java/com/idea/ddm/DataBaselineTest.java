package com.idea.ddm;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.file.Files;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.UUID;

import com.idea.ddm.migration.DatabaseMigrationCommand;
import org.flywaydb.core.Flyway;
import org.flywaydb.core.api.FlywayException;
import org.junit.jupiter.api.MethodOrderer.OrderAnnotation;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.condition.EnabledIfEnvironmentVariable;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestMethodOrder(OrderAnnotation.class)
@EnabledIfEnvironmentVariable(named = "IDEA_F02_TEST_DATABASE_NAME", matches = "idea_ddm_f02_[a-z0-9_]+")
class DataBaselineTest {
    @Value("${local.server.port}")
    private int port;

    @DynamicPropertySource
    static void databaseProperties(DynamicPropertyRegistry properties) {
        properties.add("spring.datasource.url", DataBaselineTest::databaseUrl);
        properties.add("spring.datasource.username", () -> requiredEnvironment("IDEA_DATABASE_APP_USER"));
        properties.add("spring.datasource.password", () -> requiredEnvironment("IDEA_DATABASE_APP_PASSWORD"));
        properties.add("spring.datasource.hikari.initialization-fail-timeout", () -> "-1");
        properties.add("spring.datasource.hikari.connection-timeout", () -> "1000");
        properties.add("spring.flyway.enabled", () -> "false");
    }

    @Test
    @Order(1)
    void freshVersionedMigrationAppliesOnceAndThenDoesNothing() {
        assertTrue(testDatabaseName().startsWith("idea_ddm_f02_"), "Use only a dedicated F02 test database");
        assertEquals(testDatabaseName(), requiredEnvironment("IDEA_DATABASE_NAME"),
                "Migration command and application must target the same isolated F02 database");
        assertEquals(9, DatabaseMigrationCommand.migrate(System.getenv()), "The current fresh database chain applies V1–V9; retained F04 execution was V1–V8");
        assertEquals(0, DatabaseMigrationCommand.migrate(System.getenv()),
                "A second migration run must be a no-op");

        for (var table : new String[] {"actor", "idea_account", "login_identity", "session_record",
                "sample_owner_operation", "audit_evidence", "vault_endpoint", "transfer_record",
                "transfer_grant", "transfer_receipt", "artifact", "artifact_location", "login_failure_state",
                "owner_committed_event"}) {
            assertTrue(applicationCanSeeTable(table), "The application role must see migrated table " + table);
        }
    }

    @Test
    @Order(2)
    void processAndDatabaseHealthReportSeparateOutcomes() throws Exception {
        var process = get("/health");
        var database = get("/health/database");

        assertEquals(200, process.statusCode());
        assertTrue(process.body().contains("\"status\":\"UP\""), process.body());
        assertEquals(200, database.statusCode());
        assertTrue(database.body().contains("\"status\":\"UP\""), database.body());
    }

    @Test
    @Order(3)
    void failedPostgresMigrationRollsBackItsPartialDdlInAnIsolatedSchema() throws Exception {
        var schema = "f02_failure_" + UUID.randomUUID().toString().replace("-", "");
        var location = Files.createTempDirectory("idea-f02-failing-migration-");
        Files.writeString(location.resolve("V1__baseline_probe.sql"),
                "CREATE TABLE rollback_probe_baseline (id integer PRIMARY KEY);\n");
        Files.writeString(location.resolve("V2__fail_after_create.sql"),
                "CREATE TABLE rollback_probe_partial (id integer PRIMARY KEY);\nSELECT 1 / 0;\n");

        try {
            var failingMigration = Flyway.configure()
                    .dataSource(databaseUrl(), migrationUser(), migrationPassword())
                    .locations("filesystem:" + location)
                    .schemas(schema)
                    .defaultSchema(schema)
                    .cleanDisabled(true)
                    .load();

            assertThrows(FlywayException.class, failingMigration::migrate);
            assertTrue(tableExists(schema, "rollback_probe_baseline"));
            assertFalse(tableExists(schema, "rollback_probe_partial"),
                    "PostgreSQL must roll back the failing migration's earlier DDL");
        } finally {
            try (var connection = migrationConnection(); var statement = connection.createStatement()) {
                statement.execute("DROP SCHEMA IF EXISTS " + schema + " CASCADE");
            }
            try (var paths = Files.walk(location)) {
                for (var path : paths.sorted(java.util.Comparator.reverseOrder()).toList()) {
                    Files.deleteIfExists(path);
                }
            }
        }
    }

    private HttpResponse<String> get(String path) throws Exception {
        var request = HttpRequest.newBuilder(URI.create("http://127.0.0.1:" + port + path)).GET().build();
        return HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());
    }

    private static boolean applicationCanSeeTable(String table) {
        try (var connection = DriverManager.getConnection(databaseUrl(),
                requiredEnvironment("IDEA_DATABASE_APP_USER"), requiredEnvironment("IDEA_DATABASE_APP_PASSWORD"));
                var statement = connection.prepareStatement(
                        "SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = ? AND table_type = 'BASE TABLE')")) {
            statement.setString(1, table);
            try (var results = statement.executeQuery()) {
                assertTrue(results.next());
                return results.getBoolean(1);
            }
        } catch (Exception exception) {
            throw new AssertionError("Application role could not inspect the migrated schema", exception);
        }
    }

    private static boolean tableExists(String schema, String table) throws Exception {
        try (var connection = migrationConnection();
                var statement = connection.prepareStatement(
                        "SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = ? AND table_name = ?)")) {
            statement.setString(1, schema);
            statement.setString(2, table);
            try (ResultSet results = statement.executeQuery()) {
                assertTrue(results.next());
                return results.getBoolean(1);
            }
        }
    }

    private static Connection migrationConnection() throws Exception {
        return DriverManager.getConnection(databaseUrl(), migrationUser(), migrationPassword());
    }

    private static String databaseUrl() {
        var host = requiredEnvironment("IDEA_DATABASE_HOST");
        var port = requiredEnvironment("IDEA_DATABASE_PORT");
        var database = testDatabaseName();
        return "jdbc:postgresql://" + host + ":" + port + "/" + database;
    }

    private static String testDatabaseName() {
        return requiredEnvironment("IDEA_F02_TEST_DATABASE_NAME");
    }

    private static String migrationUser() {
        return requiredEnvironment("IDEA_DATABASE_MIGRATION_USER");
    }

    private static String migrationPassword() {
        return requiredEnvironment("IDEA_DATABASE_MIGRATION_PASSWORD");
    }

    private static String requiredEnvironment(String name) {
        var value = System.getenv(name);
        if (value == null || value.isBlank()) {
            throw new IllegalStateException("Required F02 test environment variable is missing: " + name);
        }
        return value;
    }
}
