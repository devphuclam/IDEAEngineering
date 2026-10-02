package com.idea.ddm.audit;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.Objects;
import java.util.UUID;

/** Caller-owned append seam for F04 Audit evidence. This class never owns the transaction. */
public final class AuditEvidenceRepository {
    public record Entry(UUID evidenceId, UUID operationId, UUID actorId, String action,
            String targetType, String targetId, String outcome, String reasonCode,
            String correlationId) {}

    private AuditEvidenceRepository() {}

    public static void append(Connection connection, Entry entry) throws SQLException {
        Objects.requireNonNull(connection, "caller connection required");
        Objects.requireNonNull(entry, "audit entry required");
        if (connection.getAutoCommit()) {
            throw new SQLException("Caller transaction required for Audit append");
        }
        if (entry.correlationId() == null || entry.correlationId().isBlank()) {
            throw new SQLException("Original Audit correlation required");
        }
        try (PreparedStatement insert = connection.prepareStatement("INSERT INTO audit_evidence "
                + "(evidence_id,operation_id,actor_id,action,target_type,target_id,outcome,reason_code,correlation_id) "
                + "VALUES (?,?,?,?,?,?,?,?,?)")) {
            insert.setObject(1, entry.evidenceId());
            insert.setObject(2, entry.operationId());
            insert.setObject(3, entry.actorId());
            insert.setString(4, entry.action());
            insert.setString(5, entry.targetType());
            insert.setString(6, entry.targetId());
            insert.setString(7, entry.outcome());
            insert.setString(8, entry.reasonCode());
            insert.setString(9, entry.correlationId());
            if (insert.executeUpdate() != 1) {
                throw new SQLException("Audit append must affect exactly one row");
            }
        }
    }
}
