package com.idea.ddm.event;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.Objects;
import java.util.UUID;

/** Common ENVELOPE-9 append seam. The owner supplies the transaction; DB supplies recorded_at. */
public final class CommittedEventStore {
    public record Entry(UUID eventId, UUID operationId, String producerOwner, UUID organizationId,
            String eventKind, int contractVersion, UUID actorId, String correlationId) {}

    private CommittedEventStore() {}

    public static void append(Connection connection, Entry entry) throws SQLException {
        Objects.requireNonNull(connection, "caller connection required");
        Objects.requireNonNull(entry, "committed event required");
        if (connection.getAutoCommit()) throw new SQLException("Owner transaction required for committed event");
        try (var insert = connection.prepareStatement("INSERT INTO owner_committed_event(event_id,operation_id,"
                + "producer_owner,organization_id,event_kind,contract_version,actor_id,correlation_id) VALUES (?,?,?,?,?,?,?,?)")) {
            insert.setObject(1, entry.eventId());
            insert.setObject(2, entry.operationId());
            insert.setString(3, entry.producerOwner());
            insert.setObject(4, entry.organizationId());
            insert.setString(5, entry.eventKind());
            insert.setInt(6, entry.contractVersion());
            insert.setObject(7, entry.actorId());
            insert.setString(8, entry.correlationId());
            if (insert.executeUpdate() != 1) throw new SQLException("Committed event must affect exactly one row");
        }
    }
}
