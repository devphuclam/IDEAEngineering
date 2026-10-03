package com.idea.ddm.operation;

import com.idea.ddm.audit.AuditEvidenceRepository;
import com.idea.ddm.event.CommittedEventStore;
import com.idea.ddm.identity.ActorContext;
import com.idea.ddm.identity.OwnerSessionEligibility;
import com.idea.ddm.identity.IdentityRefusal;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.Objects;
import java.util.UUID;
import javax.sql.DataSource;

/** Internal synthetic F04 qualification owner; not a product/admin API or RBAC service. */
public final class SampleOwnerCommandService {
    public enum BusinessDecision { ACCEPT, REFUSE }
    public enum Outcome { ACCEPTED, REFUSED }
    public record Command(UUID operationId, String correlationId, BusinessDecision decision) {
        public Command {
            Objects.requireNonNull(operationId, "OperationId required");
            Objects.requireNonNull(decision, "Sample decision required");
            if (correlationId == null || correlationId.isBlank() || correlationId.length() > 160) {
                throw new IllegalArgumentException("Original correlation required within its storage bound");
            }
        }
    }
    public record Result(UUID operationId, UUID actorId, UUID organizationId, String correlationId,
            Outcome outcome, String reasonCode, UUID eventId) {}
    public static final class ResultAccessRefusal extends RuntimeException {
        private ResultAccessRefusal() { super("Sample result unavailable to this caller"); }
    }

    private final DataSource dataSource;
    private final OwnerSessionEligibility eligibility;

    public SampleOwnerCommandService(DataSource dataSource, OwnerSessionEligibility eligibility) {
        this.dataSource = Objects.requireNonNull(dataSource);
        this.eligibility = Objects.requireNonNull(eligibility);
    }

    public Result execute(ActorContext context, Command command) throws SQLException {
        Objects.requireNonNull(command, "Sample command required");
        try (var connection = dataSource.getConnection()) {
            connection.setTransactionIsolation(Connection.TRANSACTION_READ_COMMITTED);
            connection.setAutoCommit(false);
            try (var operationLock = OperationLock.acquire(connection, command.operationId())) {
                var actor = eligibility.admit(connection, context);
                var existing = committedResult(connection, command.operationId());
                if (existing != null) {
                    return resolveCommitted(connection, context, actor, existing);
                }
                boolean accepted = command.decision() == BusinessDecision.ACCEPT;
                if (!accepted) {
                    // Retain the session-level operation lock across the refusal transaction handoff.
                    connection.rollback();
                    actor = eligibility.admit(connection, context);
                    existing = committedResult(connection, command.operationId());
                    if (existing != null) return resolveCommitted(connection, context, actor, existing);
                }
                UUID eventId = null;
                if (accepted) {
                    do { eventId = UUID.randomUUID(); } while (eventId.equals(command.operationId()));
                }
                // A deliberate refusal opens only its attributable refusal-evidence transaction.
                // There is no accepted mutation to salvage or technical FAILED row to invent.
                var result = new Result(command.operationId(), actor.actorId(), actor.organizationId(),
                        command.correlationId(), accepted ? Outcome.ACCEPTED : Outcome.REFUSED,
                        accepted ? null : "SYNTHETIC_BUSINESS_REFUSAL", eventId);
                appendOutcomeAndAudit(connection, result);
                if (accepted) {
                    CommittedEventStore.append(connection, new CommittedEventStore.Entry(result.eventId(), result.operationId(),
                            "PH1_SAMPLE_OWNER", result.organizationId(), "OPERATION_ACCEPTED", 1, result.actorId(), result.correlationId()));
                }
                try {
                    eligibility.coordinateCommit(connection, context, actor, accepted);
                } catch (IdentityRefusal refusal) {
                    // Already admitted command: discard ACCEPT candidate, retain original attribution and operation lock.
                    connection.rollback();
                    var canonical = committedResult(connection, command.operationId());
                    if (canonical == null) {
                        var refused = new Result(command.operationId(), actor.actorId(), actor.organizationId(),
                                command.correlationId(), Outcome.REFUSED, refusal.reason(), null);
                        appendOutcomeAndAudit(connection, refused);
                        // Evidence is not a successful protected action: no renewed eligibility/activity or event.
                        connection.commit();
                    }
                    throw refusal; // Invalidated caller cannot read the terminal result, including on replay.
                }
                connection.commit();
                return result; // Success is not returned before the owner commit completes.
            } catch (SQLException | RuntimeException exception) {
                try { connection.rollback(); }
                catch (SQLException rollback) { exception.addSuppressed(rollback); }
                // A thrown commit error is not a durable FAILED outcome or proof of confirmed rollback.
                throw exception;
            }
        }
    }

    private Result resolveCommitted(Connection connection, ActorContext context,
            OwnerSessionEligibility.EligibleActor actor, Result existing) throws SQLException {
        // This is the conservative sample query policy, not a universal Core read policy.
        if (!existing.actorId().equals(actor.actorId())
                || !existing.organizationId().equals(actor.organizationId())) throw new ResultAccessRefusal();
        eligibility.coordinateCommit(connection, context, actor, true);
        connection.commit();
        return existing;
    }

    private static Result committedResult(Connection connection, UUID operation) throws SQLException {
        try (var query = connection.prepareStatement("SELECT o.actor_id,o.organization_id,o.correlation_id,o.outcome,"
                + "o.reason_code,e.event_id FROM sample_owner_operation o LEFT JOIN owner_committed_event e ON "
                + "e.operation_id=o.operation_id AND e.organization_id=o.organization_id "
                + "AND e.producer_owner='PH1_SAMPLE_OWNER' AND e.event_kind='OPERATION_ACCEPTED' WHERE o.operation_id=?")) {
            query.setObject(1, operation);
            try (var row = query.executeQuery()) {
                if (!row.next()) return null;
                var result = new Result(operation, row.getObject(1, UUID.class), row.getObject(2, UUID.class),
                        row.getString(3), Outcome.valueOf(row.getString(4)), row.getString(5), row.getObject(6, UUID.class));
                if (row.next() || (result.outcome() == Outcome.ACCEPTED) != (result.eventId() != null)) {
                    throw new SQLException("Canonical sample companions are inconsistent");
                }
                return result;
            }
        }
    }

    /** Sample-only PostgreSQL session lock: rollback cannot open a create-vs-refuse gap. */
    private static final class OperationLock implements AutoCloseable {
        private final Connection connection;
        private final Connection physical;
        private final int key;
        private OperationLock(Connection connection, Connection physical, int key) {
            this.connection = connection; this.physical = physical; this.key = key;
        }

        static OperationLock acquire(Connection connection, UUID operation) throws SQLException {
            int key = operation.hashCode(); // Collisions serialize extra IDs; exact UUID is always the result key.
            // Qualified pgJDBC/Hikari unwrap yields the dedicated physical JDBC connection.
            var physical = connection.unwrap(Connection.class);
            try (var query = connection.prepareStatement("SELECT pg_advisory_lock(73004001,?)")) {
                query.setInt(1, key);
                query.setQueryTimeout(5);
                query.execute();
                return new OperationLock(connection, physical, key);
            } catch (SQLException failure) {
                // A timed-out acquisition must never leave an ambiguous session lock in a pool.
                discard(connection, physical, failure);
                throw failure;
            }
        }

        @Override public void close() throws SQLException {
            try {
                connection.rollback(); // Clear a possibly aborted transaction before explicit session unlock.
                try (var query = connection.prepareStatement("SELECT pg_advisory_unlock(73004001,?)")) {
                    query.setInt(1, key);
                    query.setQueryTimeout(5);
                    try (var row = query.executeQuery()) {
                        if (!row.next() || !row.getBoolean(1)) throw new SQLException("Sample operation lock release unconfirmed");
                    }
                }
                connection.rollback();
            } catch (SQLException failure) {
                discard(connection, physical, failure);
                throw failure;
            }
        }

        private static void discard(Connection logical, Connection physical, SQLException failure) {
            try { logical.abort(Runnable::run); } catch (SQLException abort) { failure.addSuppressed(abort); }
            // Synchronous physical close is not logical pool-return; also required if abort itself fails.
            try { physical.close(); } catch (SQLException close) { failure.addSuppressed(close); }
        }
    }

    private static void appendOutcomeAndAudit(Connection connection, Result result) throws SQLException {
        appendOwnerResult(connection, result);
        AuditEvidenceRepository.append(connection, new AuditEvidenceRepository.Entry(UUID.randomUUID(),
                result.operationId(), result.actorId(), "sample.command", "SampleOwnerOperation",
                result.operationId().toString(), result.outcome().name(), result.reasonCode(), result.correlationId()));
    }

    private static void appendOwnerResult(Connection connection, Result result) throws SQLException {
        try (var insert = connection.prepareStatement("INSERT INTO sample_owner_operation(operation_id,actor_id,"
                + "organization_id,command_kind,correlation_id,outcome,reason_code) VALUES (?,?,?,'SYNTHETIC_SAMPLE_COMMAND',?,?,?)")) {
            insert.setObject(1, result.operationId());
            insert.setObject(2, result.actorId());
            insert.setObject(3, result.organizationId());
            insert.setString(4, result.correlationId());
            insert.setString(5, result.outcome().name());
            insert.setString(6, result.reasonCode());
            if (insert.executeUpdate() != 1) throw new SQLException("Owner result must affect exactly one row");
        }
    }
}
