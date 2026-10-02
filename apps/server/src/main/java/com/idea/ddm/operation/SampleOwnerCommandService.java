package com.idea.ddm.operation;

import com.idea.ddm.audit.AuditEvidenceRepository;
import com.idea.ddm.event.CommittedEventStore;
import com.idea.ddm.identity.ActorContext;
import com.idea.ddm.identity.OwnerSessionEligibility;
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

    private final DataSource dataSource;
    private final OwnerSessionEligibility eligibility;

    public SampleOwnerCommandService(DataSource dataSource, OwnerSessionEligibility eligibility) {
        this.dataSource = Objects.requireNonNull(dataSource);
        this.eligibility = Objects.requireNonNull(eligibility);
    }

    public Result execute(ActorContext context, Command command) throws SQLException {
        Objects.requireNonNull(command, "Sample command required");
        if (command.decision() != BusinessDecision.ACCEPT) throw new IllegalArgumentException("Unqualified sample decision");
        try (var connection = dataSource.getConnection()) {
            connection.setAutoCommit(false);
            try {
                var actor = eligibility.admit(connection, context);
                UUID eventId;
                do { eventId = UUID.randomUUID(); } while (eventId.equals(command.operationId()));
                var result = new Result(command.operationId(), actor.actorId(), actor.organizationId(),
                        command.correlationId(), Outcome.ACCEPTED, null, eventId);
                appendOwnerResult(connection, result);
                AuditEvidenceRepository.append(connection, new AuditEvidenceRepository.Entry(UUID.randomUUID(),
                        result.operationId(), result.actorId(), "sample.command", "SampleOwnerOperation",
                        result.operationId().toString(), result.outcome().name(), result.reasonCode(), result.correlationId()));
                CommittedEventStore.append(connection, new CommittedEventStore.Entry(result.eventId(), result.operationId(),
                        "PH1_SAMPLE_OWNER", result.organizationId(), "OPERATION_ACCEPTED", 1, result.actorId(), result.correlationId()));
                eligibility.coordinateCommit(connection, context, actor, true);
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
