package com.idea.ddm.operation;

import static org.junit.jupiter.api.Assertions.*;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.UUID;
import org.flywaydb.core.Flyway;
import org.flywaydb.core.api.FlywayException;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

/** One owned V7 schema: refuse missing attribution, then qualify an exactly attributable successor. */
class F04PredecessorMigrationTest {
    @BeforeAll
    static void predecessorOnly() throws Exception {
        F04SchemaTest.createOnlyThisRunsMigratorOwnedSchema("7");
    }

    @Test
    void migrationFailsWithoutExactAccountAttributionThenPreservesAttributedHistory() throws Exception {
        UUID[] first;
        UUID[] unresolved;
        var firstOperation = UUID.randomUUID();
        var secondOperation = UUID.randomUUID();
        var auditId = UUID.randomUUID();
        try (var connection = F04SchemaTest.open("migration")) {
            first = F04SchemaTest.seedIdentity(connection);
            unresolved = F04SchemaTest.seedIdentity(connection);
            insertAccount(connection, first);
            insertSample(connection, firstOperation, first[0], "ACCEPTED", null);
            insertSample(connection, secondOperation, unresolved[0], "REFUSED", "SYNTHETIC_REFUSAL");
            try (var insert = connection.prepareStatement("INSERT INTO audit_evidence(evidence_id,operation_id,"
                    + "actor_id,action,target_type,target_id,outcome) VALUES (?,?,?,'HISTORICAL',"
                    + "'SYNTHETIC','retained-original','ACCEPTED')")) {
                insert.setObject(1, auditId);
                insert.setObject(2, firstOperation);
                insert.setObject(3, first[0]);
                assertEquals(1, insert.executeUpdate());
            }
        }
        String before;
        try (var connection = F04SchemaTest.open("app")) {
            before = originalHistory(connection);
        }
        var flyway = successor();
        assertThrows(FlywayException.class, flyway::migrate,
                "A missing Actor-to-Account relationship must fail, never guess the singleton Organization");
        try (var connection = F04SchemaTest.open("app"); var statement = connection.createStatement()) {
            assertEquals(before, originalHistory(connection), "Failed V8 must retain every predecessor row");
            try (var row = statement.executeQuery("SELECT count(*) FROM flyway_schema_history WHERE version='8'")) {
                assertTrue(row.next());
                assertEquals(0, row.getInt(1));
            }
            try (var row = statement.executeQuery("SELECT to_regclass('owner_committed_event')")) {
                assertTrue(row.next());
                assertNull(row.getString(1), "No partially migrated event table may survive");
            }
        }
        // This changes synthetic fixture preconditions only; the migration itself never repairs IAM.
        try (var connection = F04SchemaTest.open("migration")) {
            insertAccount(connection, unresolved);
        }
        assertEquals(1, flyway.migrate().migrationsExecuted);
        assertEquals(0, flyway.migrate().migrationsExecuted);
        try (var connection = F04SchemaTest.open("app")) {
            assertEquals(before, originalHistory(connection), "Successful V8 must preserve historical contents");
            for (var binding : new UUID[][] {{firstOperation, first[1]}, {secondOperation, unresolved[1]}}) {
                try (var query = connection.prepareStatement(
                        "SELECT organization_id FROM sample_owner_operation WHERE operation_id=?")) {
                    query.setObject(1, binding[0]);
                    try (var row = query.executeQuery()) {
                        assertTrue(row.next());
                        assertEquals(binding[1], row.getObject(1, UUID.class));
                    }
                }
            }
            try (var query = connection.prepareStatement("SELECT correlation_id FROM audit_evidence WHERE evidence_id=?")) {
                query.setObject(1, auditId);
                try (var row = query.executeQuery()) {
                    assertTrue(row.next());
                    assertNull(row.getString(1), "Historical F03 correlation must remain NULL, not fabricated");
                }
            }
        }
        System.out.println("F04_PREDECESSOR=UNATTRIBUTABLE_ROLLBACK_CONFIRMED; ATTRIBUTABLE_V8=1; REPEAT=0; HISTORY=UNCHANGED");
    }

    private static Flyway successor() {
        return Flyway.configure().dataSource(F04SchemaTest.url(), "idea_ddm_migrator",
                        F04SchemaTest.env("IDEA_DATABASE_MIGRATION_PASSWORD"))
                .schemas(F04SchemaTest.env("IDEA_F04_TEST_SCHEMA"))
                .defaultSchema(F04SchemaTest.env("IDEA_F04_TEST_SCHEMA"))
                .createSchemas(false).locations("classpath:db/migration").cleanDisabled(true).load();
    }

    private static void insertAccount(Connection connection, UUID[] identity) throws SQLException {
        try (var insert = connection.prepareStatement("INSERT INTO idea_account(account_id,actor_id,"
                + "organization_id,status) VALUES (?,?,?,'PENDING')")) {
            insert.setObject(1, UUID.randomUUID());
            insert.setObject(2, identity[0]);
            insert.setObject(3, identity[1]);
            assertEquals(1, insert.executeUpdate());
        }
    }

    private static void insertSample(Connection connection, UUID operation, UUID actor,
                                      String outcome, String reason) throws SQLException {
        try (var insert = connection.prepareStatement("INSERT INTO sample_owner_operation(operation_id,actor_id,"
                + "command_kind,correlation_id,outcome,reason_code) VALUES (?,?,'HISTORICAL','original-correlation',?,?)")) {
            insert.setObject(1, operation);
            insert.setObject(2, actor);
            insert.setString(3, outcome);
            insert.setString(4, reason);
            assertEquals(1, insert.executeUpdate());
        }
    }

    private static String originalHistory(Connection connection) throws SQLException {
        var retained = new StringBuilder();
        try (var statement = connection.createStatement(); var rows = statement.executeQuery(
                "SELECT operation_id,actor_id,command_kind,correlation_id,outcome,reason_code,occurred_at "
                        + "FROM sample_owner_operation ORDER BY operation_id")) {
            while (rows.next()) for (int column = 1; column <= 7; column++) retained.append(rows.getString(column)).append('|');
        }
        try (var statement = connection.createStatement(); var rows = statement.executeQuery(
                "SELECT evidence_id,operation_id,actor_id,action,target_type,target_id,outcome,reason_code,occurred_at "
                        + "FROM audit_evidence ORDER BY evidence_id")) {
            while (rows.next()) for (int column = 1; column <= 9; column++) retained.append(rows.getString(column)).append('|');
        }
        return retained.toString();
    }
}
