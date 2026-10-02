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
        createOnlyThisRunsMigratorOwnedSchema("latest");
    }

    static void createOnlyThisRunsMigratorOwnedSchema(String target) throws Exception {
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
                .locations("classpath:db/migration").target(target).cleanDisabled(true).load().migrate();
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

    @Test
    void sampleResultAndAuditExposeCompatibleProvenanceSuccessorFields() throws Exception {
        try (var connection = open("app"); var query = connection.prepareStatement(
                "SELECT data_type,is_nullable FROM information_schema.columns "
                        + "WHERE table_schema=? AND table_name=? AND column_name=?")) {
            query.setString(1, schema);
            query.setString(2, "sample_owner_operation");
            query.setString(3, "organization_id");
            try (var row = query.executeQuery()) {
                assertTrue(row.next(), "Sample result must retain its authoritative Organization snapshot");
                assertEquals("uuid", row.getString(1));
                assertEquals("NO", row.getString(2));
            }
            query.setString(2, "audit_evidence");
            query.setString(3, "correlation_id");
            try (var row = query.executeQuery()) {
                assertTrue(row.next(), "F04 Audit must store the original correlation directly");
                assertEquals("character varying", row.getString(1));
                assertEquals("YES", row.getString(2), "Do not fabricate or require correlation on historical F03 rows");
            }
        }
    }

    @Test
    void sampleAcceptedEventIsUniqueAcrossContractVersions() throws Exception {
        try (var connection = open("migration")) {
            connection.setAutoCommit(false);
            try {
                var identity = seedIdentity(connection);
                var operation = UUID.randomUUID();
                insertEvent(connection, operation, "PH1_SAMPLE_OWNER", identity);
                var exception = assertThrows(SQLException.class, () -> insertEvent(connection,
                        operation, "PH1_SAMPLE_OWNER", "OPERATION_ACCEPTED", 2, identity),
                        "Contract-version changes must not bypass the sample's one accepted event");
                assertEquals("23505", exception.getSQLState());
            } finally {
                connection.rollback();
            }
        }
    }

    @Test
    void commonStoreAllowsMultipleEventsWithoutSampleResultCoupling() throws Exception {
        try (var connection = open("migration")) {
            connection.setAutoCommit(false);
            try {
                var identity = seedIdentity(connection);
                var operation = UUID.randomUUID();
                insertEvent(connection, operation, "OTHER_SYNTHETIC_OWNER", identity);
                insertEvent(connection, operation, "OTHER_SYNTHETIC_OWNER", identity);
                insertEvent(connection, operation, "PH1_SAMPLE_OWNER", "OTHER_SYNTHETIC_KIND", 1, identity);
                insertEvent(connection, operation, "PH1_SAMPLE_OWNER", "OTHER_SYNTHETIC_KIND", 1, identity);
                try (var query = connection.prepareStatement(
                        "SELECT count(*),count(DISTINCT event_id) FROM owner_committed_event WHERE operation_id=?")) {
                    query.setObject(1, operation);
                    try (var row = query.executeQuery()) {
                        assertTrue(row.next());
                        assertEquals(4, row.getInt(1));
                        assertEquals(4, row.getInt(2));
                    }
                }
            } finally {
                connection.rollback();
            }
        }
    }

    @Test
    void terminalSampleResultsAreInsertSelectOnlyAndRejectOwnerMutation() throws Exception {
        UUID[] identity;
        try (var fixture = open("migration")) {
            identity = seedIdentity(fixture);
        }
        for (var role : new String[] {"app", "migration"}) {
            try (var connection = open(role)) {
                for (var mutation : new String[] {"UPDATE sample_owner_operation SET command_kind='REWRITTEN'",
                        "DELETE FROM sample_owner_operation", "TRUNCATE sample_owner_operation"}) {
                    connection.setAutoCommit(false);
                    try (var statement = connection.createStatement()) {
                        try (var insert = connection.prepareStatement("INSERT INTO sample_owner_operation"
                                + "(operation_id,actor_id,organization_id,command_kind,correlation_id,outcome) "
                                + "VALUES (?,?,?,'SYNTHETIC','f04-sample-test','ACCEPTED')")) {
                            insert.setObject(1, UUID.randomUUID());
                            insert.setObject(2, identity[0]);
                            insert.setObject(3, identity[1]);
                            assertEquals(1, insert.executeUpdate());
                        }
                        try (var row = statement.executeQuery("SELECT count(*) FROM sample_owner_operation")) {
                            assertTrue(row.next());
                            assertEquals(1, row.getInt(1));
                        }
                        var exception = assertThrows(SQLException.class, () -> statement.execute(mutation),
                                "Terminal sample contents under " + role + ": " + mutation);
                        assertEquals("42501", exception.getSQLState());
                    } finally {
                        connection.rollback();
                    }
                }
            }
        }
    }

    @Test
    void actualAppCanAppendButCannotRewriteOrDeleteReferencedEventIdentities() throws Exception {
        UUID[] identity;
        try (var fixture = open("migration")) {
            identity = seedIdentity(fixture);
        }
        try (var connection = open("app")) {
            connection.setAutoCommit(false);
            try {
                insertEvent(connection, UUID.randomUUID(), "OTHER_SYNTHETIC_OWNER", identity);
                try (var statement = connection.createStatement(); var row = statement.executeQuery(
                        "SELECT count(*) FROM owner_committed_event")) {
                    assertTrue(row.next());
                    assertEquals(1, row.getInt(1));
                }
            } finally {
                connection.rollback();
            }
            for (var mutation : new String[] {"UPDATE owner_committed_event SET contract_version=2",
                    "DELETE FROM owner_committed_event", "TRUNCATE owner_committed_event"}) {
                try (var statement = connection.createStatement()) {
                    insertEvent(connection, UUID.randomUUID(), "OTHER_SYNTHETIC_OWNER", identity);
                    assertEquals("42501", assertThrows(SQLException.class, () -> statement.execute(mutation)).getSQLState());
                } finally {
                    connection.rollback();
                }
            }
            for (var missing : new UUID[][] {{UUID.randomUUID(), identity[1]}, {identity[0], UUID.randomUUID()}}) {
                try {
                    assertEquals("23503", assertThrows(SQLException.class, () ->
                            insertEvent(connection, UUID.randomUUID(), "OTHER_SYNTHETIC_OWNER", missing)).getSQLState());
                } finally {
                    connection.rollback();
                }
            }
            try {
                assertEquals("23514", assertThrows(SQLException.class, () -> insertEvent(connection,
                        UUID.randomUUID(), "OTHER_SYNTHETIC_OWNER", "OPERATION_ACCEPTED", 0, identity)).getSQLState());
            } finally {
                connection.rollback();
            }
        }
        try (var connection = open("migration")) {
            connection.setAutoCommit(false);
            for (var mutation : new String[] {"DELETE FROM actor WHERE actor_id='" + identity[0] + "'",
                    "UPDATE actor SET actor_id='" + UUID.randomUUID() + "' WHERE actor_id='" + identity[0] + "'",
                    "DELETE FROM operating_organization WHERE organization_id='" + identity[1] + "'",
                    "UPDATE operating_organization SET organization_id='" + UUID.randomUUID()
                            + "' WHERE organization_id='" + identity[1] + "'"}) {
                try (var statement = connection.createStatement()) {
                    insertEvent(connection, UUID.randomUUID(), "OTHER_SYNTHETIC_OWNER", identity);
                    assertEquals("23503", assertThrows(SQLException.class, () -> statement.execute(mutation)).getSQLState());
                } finally {
                    connection.rollback();
                }
            }
        }
    }

    static UUID[] seedIdentity(Connection connection) throws SQLException {
        var actor = UUID.randomUUID();
        UUID organization = null;
        try (var insert = connection.prepareStatement("INSERT INTO actor(actor_id,display_name) VALUES (?,?)")) {
            insert.setObject(1, actor);
            insert.setString(2, "Synthetic F04 schema fixture; not authenticated ActorContext");
            assertEquals(1, insert.executeUpdate());
        }
        // V2 admits exactly one Operating Organization. Reuse only this owned schema's fixture.
        try (var query = connection.createStatement(); var row = query.executeQuery(
                "SELECT organization_id FROM operating_organization")) {
            if (row.next()) organization = row.getObject(1, UUID.class);
        }
        if (organization == null) {
            organization = UUID.randomUUID();
            try (var insert = connection.prepareStatement("INSERT INTO operating_organization(organization_id,display_name) VALUES (?,?)")) {
                insert.setObject(1, organization);
                insert.setString(2, "Synthetic F04 schema organization");
                assertEquals(1, insert.executeUpdate());
            }
        }
        return new UUID[] {actor, organization};
    }

    private static void insertEvent(Connection connection, UUID operation, String producer, UUID[] identity) throws SQLException {
        insertEvent(connection, operation, producer, "OPERATION_ACCEPTED", 1, identity);
    }

    private static void insertEvent(Connection connection, UUID operation, String producer,
                                    String kind, int version, UUID[] identity) throws SQLException {
        try (var insert = connection.prepareStatement("INSERT INTO owner_committed_event(event_id,operation_id,producer_owner,"
                + "organization_id,event_kind,contract_version,actor_id,correlation_id) VALUES (?,?,?,?,?,?,?,?)")) {
            insert.setObject(1, UUID.randomUUID());
            insert.setObject(2, operation);
            insert.setString(3, producer);
            insert.setObject(4, identity[1]);
            insert.setString(5, kind);
            insert.setInt(6, version);
            insert.setObject(7, identity[0]);
            insert.setString(8, "f04-synthetic-schema-correlation");
            assertEquals(1, insert.executeUpdate());
        }
    }

    static Connection open(String role) throws Exception {
        return DriverManager.getConnection(url(), "idea_ddm_" + (role.equals("app") ? "app" : "migrator"),
                env(role.equals("app") ? "IDEA_DATABASE_APP_PASSWORD" : "IDEA_DATABASE_MIGRATION_PASSWORD"));
    }

    static String url() {
        return "jdbc:postgresql://127.0.0.1:5432/" + env("IDEA_F04_TEST_DATABASE_NAME") + "?currentSchema=" + schema;
    }

    static String env(String name) {
        var value = System.getenv(name);
        if (value == null || value.isBlank()) throw new IllegalStateException("Missing F04 prerequisite: " + name);
        return value;
    }
}
