package com.idea.ddm.access;

import java.time.Clock;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.UUID;
import javax.sql.DataSource;
import com.idea.ddm.identity.NativeReauthentication;

/** Bounded operator transition only; neither ordinary grant API nor bootstrap/startup behavior. */
public final class SuperSuccessorAdoptionService {
    public static final UUID SUPER_V2 = UUID.fromString("9d80f77e-85a6-4c12-a72d-8ef6b7e0a005");
    private static final UUID SUPER_V1 = UUID.fromString("9d80f77e-85a6-4c12-a72d-8ef6b7e0a001");
    private static final String ACTION = "role.successor.adopt";
    private final DataSource dataSource;
    private final Clock clock;
    private final NativeReauthentication reauthentication = new NativeReauthentication();
    public static final class Refused extends RuntimeException {
        private Refused() { super("Successor adoption refused"); }
    }
    public record Request(UUID operationId, UUID organizationId, UUID actorId, UUID loginIdentityId,
            UUID oldAssignmentId, long expectedSecurityVersion, String reason) {}
    public record Result(String state, UUID assignmentId, UUID actorId, UUID organizationId) {}
    public SuperSuccessorAdoptionService(DataSource dataSource, Clock clock) {
        this.dataSource = java.util.Objects.requireNonNull(dataSource);
        this.clock = java.util.Objects.requireNonNull(clock);
    }
    public Result adopt(Request request, char[] password) {
        validate(request);
        try (var connection = dataSource.getConnection()) {
            connection.setTransactionIsolation(Connection.TRANSACTION_READ_COMMITTED);
            connection.setAutoCommit(false);
            try {
                try (var lock = connection.createStatement()) { lock.execute("SELECT pg_advisory_xact_lock(73003002)"); }
                var identity = reauthentication.verify(connection, request.loginIdentityId(), password, clock.instant());
                if (identity == null) {
                    connection.commit(); // Keep the shared refusal state; never an adoption/session result.
                    throw new Refused();
                }
                requireCurrent(connection, request, identity);
                requireOperation(connection, request);
                UUID existing = existingSuccessor(connection, request);
                if (existing != null) {
                    reauthentication.clear(connection, identity);
                    connection.commit();
                    return new Result("ALREADY_ADOPTED", existing, request.actorId(), request.organizationId());
                }
                UUID assignment = UUID.randomUUID();
                insert(connection, "INSERT INTO identity_role_assignment(assignment_id,principal_actor_id,role_version_id,"
                        + "organization_id,assigned_by,reason,effective_from) VALUES (?,?,?,?,?,?,?)", assignment,
                        request.actorId(), SUPER_V2, request.organizationId(), request.actorId(), request.reason(), Timestamp.from(clock.instant()));
                insert(connection, "INSERT INTO access_policy_owner_outcome(operation_id,actor_id,action,target_id,outcome) "
                        + "VALUES (?,?,?,?,'ACCEPTED')", request.operationId(), request.actorId(), ACTION, assignment.toString());
                insert(connection, "INSERT INTO identity_assignment_evidence(operation_id,assignment_id,principal_actor_id,"
                        + "role_version_id,organization_id,assigned_by,reason,before_assignment_id) VALUES (?,?,?,?,?,?,?,?)",
                        request.operationId(), assignment, request.actorId(), SUPER_V2, request.organizationId(),
                        request.actorId(), request.reason(), request.oldAssignmentId());
                for (String stage : new String[] {"REQUEST", "COMMIT"}) {
                    insert(connection, "INSERT INTO identity_authorization_decision(decision_id,operation_id,stage,actor_id,"
                            + "security_version,organization_id,permission_code,eligible,granted,assignment_id,role_version_id) "
                            + "VALUES (?,?,?,?,?,?,?,TRUE,TRUE,?,?)", UUID.randomUUID(), request.operationId(), stage,
                            request.actorId(), request.expectedSecurityVersion(), request.organizationId(), ACTION,
                            request.oldAssignmentId(), SUPER_V1);
                }
                insert(connection, "INSERT INTO audit_evidence(evidence_id,operation_id,actor_id,action,target_type,target_id,outcome) "
                        + "VALUES (?,?,?,?,'ROLE_ASSIGNMENT',?,'ACCEPTED')", UUID.randomUUID(), request.operationId(),
                        request.actorId(), ACTION, assignment.toString());
                requireCurrent(connection, request, identity);
                reauthentication.clear(connection, identity);
                connection.commit();
                return new Result("ADOPTED", assignment, request.actorId(), request.organizationId());
            } catch (SQLException | RuntimeException exception) {
                connection.rollback();
                throw exception;
            }
        } catch (SQLException exception) {
            throw new IllegalStateException("Successor adoption unavailable; outcome must be resolved", exception);
        }
    }

    private void requireCurrent(Connection connection, Request request, NativeReauthentication.Verified identity) throws SQLException {
        if (!identity.actorId().equals(request.actorId()) || !identity.organizationId().equals(request.organizationId())
                || identity.securityVersion() != request.expectedSecurityVersion()) throw new Refused();
        try (var query = connection.prepareStatement("SELECT 1 FROM identity_role_assignment r JOIN idea_account a "
                + "ON a.actor_id=r.principal_actor_id JOIN actor p ON p.actor_id=a.actor_id WHERE r.assignment_id=? "
                + "AND r.principal_actor_id=? AND r.role_version_id=? AND r.organization_id=? AND r.scope_kind='ORGANIZATION' "
                + "AND r.project_id IS NULL AND r.revoked_at IS NULL AND r.effective_from<=? "
                + "AND (r.effective_until IS NULL OR r.effective_until>?) AND a.account_id=? "
                + "AND a.organization_id=? AND a.status='ACTIVE' AND a.security_version=? AND p.disabled_at IS NULL")) {
            Object[] values = {request.oldAssignmentId(), request.actorId(), SUPER_V1, request.organizationId(),
                    Timestamp.from(clock.instant()), Timestamp.from(clock.instant()), identity.accountId(),
                    request.organizationId(), request.expectedSecurityVersion()};
            bind(query, values);
            try (var row = query.executeQuery()) { if (!row.next()) throw new Refused(); }
        }
    }

    private static void requireOperation(Connection connection, Request request) throws SQLException {
        try (var query = connection.prepareStatement("SELECT o.actor_id,o.action,e.before_assignment_id,e.organization_id,"
                + "e.role_version_id FROM access_policy_owner_outcome o LEFT JOIN identity_assignment_evidence e "
                + "USING(operation_id) WHERE o.operation_id=?")) {
            query.setObject(1, request.operationId());
            try (var row = query.executeQuery()) {
                if (row.next() && (!request.actorId().equals(row.getObject(1, UUID.class)) || !ACTION.equals(row.getString(2))
                        || !request.oldAssignmentId().equals(row.getObject(3, UUID.class))
                        || !request.organizationId().equals(row.getObject(4, UUID.class)) || !SUPER_V2.equals(row.getObject(5, UUID.class)))) {
                    throw new Refused();
                }
            }
        }
    }

    private static UUID existingSuccessor(Connection connection, Request request) throws SQLException {
        try (var query = connection.prepareStatement("SELECT r.assignment_id FROM identity_role_assignment r "
                + "JOIN identity_assignment_evidence e USING(assignment_id) JOIN access_policy_owner_outcome o USING(operation_id) "
                + "WHERE r.principal_actor_id=? AND r.organization_id=? AND r.role_version_id=? AND r.revoked_at IS NULL "
                + "AND e.before_assignment_id=? AND o.action=? AND o.outcome='ACCEPTED'")) {
            bind(query, request.actorId(), request.organizationId(), SUPER_V2, request.oldAssignmentId(), ACTION);
            try (var row = query.executeQuery()) { return row.next() ? row.getObject(1, UUID.class) : null; }
        }
    }

    private static void validate(Request request) {
        if (request == null || request.operationId() == null || request.organizationId() == null || request.actorId() == null
                || request.loginIdentityId() == null || request.oldAssignmentId() == null || request.expectedSecurityVersion() < 1
                || request.reason() == null || request.reason().isBlank() || request.reason().length() > 500
                || request.reason().codePoints().anyMatch(Character::isISOControl)) throw new Refused();
    }

    private static void insert(Connection connection, String sql, Object... values) throws SQLException {
        try (var statement = connection.prepareStatement(sql)) {
            bind(statement, values);
            if (statement.executeUpdate() != 1) throw new SQLException("Required adoption evidence not retained");
        }
    }

    private static void bind(java.sql.PreparedStatement statement, Object... values) throws SQLException {
        for (int index = 0; index < values.length; index++) statement.setObject(index + 1, values[index]);
    }
}
