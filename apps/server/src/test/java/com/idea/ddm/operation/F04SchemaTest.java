package com.idea.ddm.operation;

import static org.junit.jupiter.api.Assertions.*;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;
import org.flywaydb.core.Flyway;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

/** Approved T023-A seam: actual migration/schema contract on isolated PostgreSQL, no owner API. */
class F04SchemaTest {
    private static String schema;

    @BeforeAll
    static void createOnlyThisRunsMigratorOwnedSchema() throws Exception {
        assertEquals("127.0.0.1", env("IDEA_DATABASE_HOST"));
        assertEquals("5432", env("IDEA_DATABASE_PORT"));
        assertEquals("idea_ddm_f03a_20260930_c91e7a42", env("IDEA_F04_TEST_DATABASE_NAME"));
        assertEquals("idea_ddm_app", env("IDEA_DATABASE_APP_USER"));
        assertEquals("idea_ddm_migrator", env("IDEA_DATABASE_MIGRATION_USER"));
        schema = env("IDEA_F04_TEST_SCHEMA");
        assertTrue(schema.matches("f04_[0-9a-f]{32}"), "Only a run-owned F04 UUID schema is allowed");
        assertTrue(env("IDEA_F04_SOURCE_SHA").matches("[0-9a-f]{40}"));
        try (var connection = open("migration"); var statement = connection.createStatement()) {
            try (var row = statement.executeQuery("SELECT current_user, current_database()")) {
                assertTrue(row.next());
                assertEquals("idea_ddm_migrator", row.getString(1));
                assertEquals(env("IDEA_F04_TEST_DATABASE_NAME"), row.getString(2));
            }
            // No IF NOT EXISTS: an existing schema must never be adopted by a new run.
            statement.execute("CREATE SCHEMA " + schema + " AUTHORIZATION idea_ddm_migrator");
            statement.execute("COMMENT ON SCHEMA " + schema + " IS 'IDEA_F04_RUN:"
                    + env("IDEA_F04_SOURCE_SHA") + ":" + schema + "'");
        }
        var result = Flyway.configure().dataSource(url(), "idea_ddm_migrator",
                        env("IDEA_DATABASE_MIGRATION_PASSWORD"))
                .schemas(schema).defaultSchema(schema).createSchemas(false)
                .locations("classpath:db/migration").cleanDisabled(true).load().migrate();
        try (var connection = open("migration"); var statement = connection.createStatement()) {
            statement.execute("GRANT USAGE ON SCHEMA " + schema + " TO idea_ddm_app");
            statement.execute("REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON " + schema
                    + ".flyway_schema_history FROM idea_ddm_app");
            statement.execute("GRANT SELECT ON " + schema + ".flyway_schema_history TO idea_ddm_app");
        }
        System.out.println("F04_SCHEMA_READY=" + schema + "; MIGRATIONS_APPLIED=" + result.migrationsExecuted);
        // Runner retains the result/log before guarded cleanup; this class never drops a schema.
    }

    @Test
    void committedEventStoreHasExactlyTheApprovedNineFieldEnvelope() throws Exception {
        try (var connection = open("app"); var statement = connection.createStatement()) {
            try (var row = statement.executeQuery("SELECT to_regclass('" + schema + ".owner_committed_event')")) {
                assertTrue(row.next());
                assertNotNull(row.getString(1), "Approved ENVELOPE-9 store is absent after migration");
            }
            Map<String, String> columns = new LinkedHashMap<>();
            try (var query = connection.prepareStatement("SELECT column_name, data_type FROM information_schema.columns "
                    + "WHERE table_schema=? AND table_name='owner_committed_event' ORDER BY ordinal_position")) {
                query.setString(1, schema);
                try (var rows = query.executeQuery()) {
                    while (rows.next()) columns.put(rows.getString(1), rows.getString(2));
                }
            }
            assertEquals(Map.of("event_id", "uuid", "operation_id", "uuid", "producer_owner", "character varying",
                    "organization_id", "uuid", "event_kind", "character varying", "contract_version", "integer",
                    "actor_id", "uuid", "correlation_id", "character varying", "recorded_at", "timestamp with time zone"),
                    columns, "No payload, delivery state, registry or generic operation fields belong in ENVELOPE-9");
        }
    }

    @Test
    void committedEventContentRejectsUpdateDeleteAndTruncateEvenForItsOwner() throws Exception {
        try (var connection = open("migration")) {
            for (var mutation : new String[] {"UPDATE owner_committed_event SET contract_version=2",
                    "DELETE FROM owner_committed_event", "TRUNCATE owner_committed_event"}) {
                connection.setAutoCommit(false);
                try {
                    var identity = seedIdentity(connection);
                    insertEvent(connection, UUID.randomUUID(), "OTHER_SYNTHETIC_OWNER", identity);
                    var exception = assertThrows(SQLException.class,
                            () -> connection.createStatement().execute(mutation), "Immutable content: " + mutation);
                    assertEquals("42501", exception.getSQLState());
                } finally {
                    connection.rollback();
                }
            }
        }
    }

    private static UUID[] seedIdentity(Connection connection) throws SQLException {
        var actor = UUID.randomUUID();
        var organization = UUID.randomUUID();
        try (var insert = connection.prepareStatement("INSERT INTO actor(actor_id,display_name) VALUES (?,?)")) {
            insert.setObject(1, actor);
            insert.setString(2, "Synthetic F04 schema fixture; not authenticated ActorContext");
            assertEquals(1, insert.executeUpdate());
        }
        try (var insert = connection.prepareStatement("INSERT INTO operating_organization(organization_id,display_name) VALUES (?,?)")) {
            insert.setObject(1, organization);
            insert.setString(2, "Synthetic F04 schema organization");
            assertEquals(1, insert.executeUpdate());
        }
        return new UUID[] {actor, organization};
    }

    private static void insertEvent(Connection connection, UUID operation, String producer, UUID[] identity) throws SQLException {
        try (var insert = connection.prepareStatement("INSERT INTO owner_committed_event(event_id,operation_id,producer_owner,"
                + "organization_id,event_kind,contract_version,actor_id,correlation_id) VALUES (?,?,?,?,?,1,?,?)")) {
            insert.setObject(1, UUID.randomUUID());
            insert.setObject(2, operation);
            insert.setString(3, producer);
            insert.setObject(4, identity[1]);
            insert.setString(5, "OPERATION_ACCEPTED");
            insert.setObject(6, identity[0]);
            insert.setString(7, "f04-synthetic-schema-correlation");
            assertEquals(1, insert.executeUpdate());
        }
    }

    private static Connection open(String role) throws Exception {
        return DriverManager.getConnection(url(), "idea_ddm_" + (role.equals("app") ? "app" : "migrator"),
                env(role.equals("app") ? "IDEA_DATABASE_APP_PASSWORD" : "IDEA_DATABASE_MIGRATION_PASSWORD"));
    }

    private static String url() {
        return "jdbc:postgresql://127.0.0.1:5432/" + env("IDEA_F04_TEST_DATABASE_NAME") + "?currentSchema=" + schema;
    }

    private static String env(String name) {
        var value = System.getenv(name);
        if (value == null || value.isBlank()) throw new IllegalStateException("Missing F04 prerequisite: " + name);
        return value;
    }
}
