package com.idea.ddm.audit;

import static org.junit.jupiter.api.Assertions.*;

import com.idea.ddm.operation.F04SchemaTest;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.UUID;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

/** T023-A contract RED: append Audit on the caller's connection, with no transaction ownership. */
class AuditEvidenceRepositoryTest {
    @BeforeAll
    static void migrateOwnedSchema() throws Exception {
        F04SchemaTest.createOnlyThisRunsMigratorOwnedSchema("latest");
    }

    @Test
    void appendUsesCallerConnectionAndPreservesExactCorrelation() throws Exception {
        UUID[] identity;
        try (var fixture = F04SchemaTest.open("migration")) {
            identity = F04SchemaTest.seedIdentity(fixture);
        }
        var operation = UUID.randomUUID();
        var evidence = UUID.randomUUID();
        var correlation = "f04-audit-contract-correlation";
        try (Connection connection = F04SchemaTest.open("app")) {
            connection.setAutoCommit(false);
            AuditEvidenceRepository.append(connection, new AuditEvidenceRepository.Entry(
                    evidence, operation, identity[0], "sample.accept", "SAMPLE_OWNER",
                    operation.toString(), "ACCEPTED", null, correlation));
            try (var query = connection.prepareStatement("SELECT evidence_id,operation_id,actor_id,action,"
                    + "target_type,target_id,outcome,reason_code,correlation_id FROM audit_evidence WHERE evidence_id=?")) {
                query.setObject(1, evidence);
                try (var row = query.executeQuery()) {
                    assertTrue(row.next(), "append must insert exactly one row before caller commit");
                    assertEquals(evidence, row.getObject(1, UUID.class));
                    assertEquals(operation, row.getObject(2, UUID.class));
                    assertEquals(identity[0], row.getObject(3, UUID.class));
                    assertEquals("sample.accept", row.getString(4));
                    assertEquals("SAMPLE_OWNER", row.getString(5));
                    assertEquals(operation.toString(), row.getString(6));
                    assertEquals("ACCEPTED", row.getString(7));
                    assertNull(row.getString(8));
                    assertEquals(correlation, row.getString(9));
                }
            }
            connection.rollback();
        }
        try (var connection = F04SchemaTest.open("app"); var query = connection.prepareStatement(
                "SELECT count(*) FROM audit_evidence WHERE evidence_id=?")) {
            query.setObject(1, evidence);
            try (var row = query.executeQuery()) {
                assertTrue(row.next());
                assertEquals(0, row.getInt(1), "caller rollback must remove the append");
            }
        }
    }

    @Test
    void appendPropagatesInvalidInputAndLeavesCallerTransactionUsable() throws Exception {
        UUID[] identity;
        try (var fixture = F04SchemaTest.open("migration")) {
            identity = F04SchemaTest.seedIdentity(fixture);
        }
        try (var connection = F04SchemaTest.open("app")) {
            connection.setAutoCommit(false);
            var invalid = new AuditEvidenceRepository.Entry(UUID.randomUUID(), UUID.randomUUID(), identity[0],
                    "sample.accept", "SAMPLE_OWNER", "target", "ACCEPTED", null, " ");
            assertThrows(SQLException.class, () -> AuditEvidenceRepository.append(connection, invalid));
            // The repository does not close, commit or roll back the caller's connection.
            assertFalse(connection.isClosed());
            assertFalse(connection.getAutoCommit());
            connection.rollback();
        }
    }

    @Test
    void f04AppendRequiresOriginalCorrelationEvenThoughHistoricalColumnIsNullable() throws Exception {
        UUID[] identity;
        try (var fixture = F04SchemaTest.open("migration")) {
            identity = F04SchemaTest.seedIdentity(fixture);
        }
        try (var connection = F04SchemaTest.open("app")) {
            connection.setAutoCommit(false);
            try {
                var missing = new AuditEvidenceRepository.Entry(UUID.randomUUID(), UUID.randomUUID(), identity[0],
                        "sample.accept", "SAMPLE_OWNER", "target", "ACCEPTED", null, null);
                assertThrows(SQLException.class, () -> AuditEvidenceRepository.append(connection, missing));
            } finally {
                connection.rollback();
            }
        }
    }

    @Test
    void appendRequiresAnExplicitCallerTransaction() throws Exception {
        UUID[] identity;
        try (var fixture = F04SchemaTest.open("migration")) {
            identity = F04SchemaTest.seedIdentity(fixture);
        }
        var evidence = UUID.randomUUID();
        try (var connection = F04SchemaTest.open("app")) {
            assertTrue(connection.getAutoCommit());
            var entry = new AuditEvidenceRepository.Entry(evidence, UUID.randomUUID(), identity[0],
                    "sample.accept", "SAMPLE_OWNER", "target", "ACCEPTED", null, "original-correlation");
            assertThrows(SQLException.class, () -> AuditEvidenceRepository.append(connection, entry),
                    "An accidental auto-commit append must not publish evidence independently");
            try (var query = connection.prepareStatement("SELECT count(*) FROM audit_evidence WHERE evidence_id=?")) {
                query.setObject(1, evidence);
                try (var row = query.executeQuery()) {
                    assertTrue(row.next());
                    assertEquals(0, row.getInt(1));
                }
            }
        }
    }

    @Test
    void sqlFailurePropagatesWithoutRollingBackOrClosingTheCallerTransaction() throws Exception {
        UUID[] identity;
        try (var fixture = F04SchemaTest.open("migration")) {
            identity = F04SchemaTest.seedIdentity(fixture);
        }
        var evidence = UUID.randomUUID();
        try (var connection = F04SchemaTest.open("app")) {
            connection.setAutoCommit(false);
            try {
                AuditEvidenceRepository.append(connection, new AuditEvidenceRepository.Entry(
                        evidence, UUID.randomUUID(), identity[0], "sample.refuse", "SAMPLE_OWNER",
                        "target", "REFUSED", "SAMPLE_POLICY_REFUSAL", "caller-correlation"));
                var savepoint = connection.setSavepoint();
                var invalidActor = new AuditEvidenceRepository.Entry(UUID.randomUUID(), UUID.randomUUID(),
                        UUID.randomUUID(), "sample.accept", "SAMPLE_OWNER", "target", "ACCEPTED", null,
                        "original-correlation");
                var failure = assertThrows(SQLException.class,
                        () -> AuditEvidenceRepository.append(connection, invalidActor));
                assertEquals("23503", failure.getSQLState(), "real PostgreSQL foreign-key refusal must propagate");
                assertFalse(connection.isClosed());
                assertFalse(connection.getAutoCommit());
                connection.rollback(savepoint);
                try (var query = connection.prepareStatement("SELECT count(*) FROM audit_evidence WHERE evidence_id=?")) {
                    query.setObject(1, evidence);
                    try (var row = query.executeQuery()) {
                        assertTrue(row.next());
                        assertEquals(1, row.getInt(1), "the repository must not roll back preceding caller work");
                    }
                }
            } finally {
                connection.rollback();
            }
        }
    }
}
