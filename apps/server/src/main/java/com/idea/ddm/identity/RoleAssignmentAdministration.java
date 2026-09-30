package com.idea.ddm.identity;

import java.sql.SQLException;
import java.util.UUID;
import javax.sql.DataSource;

/** Access Policy command, deliberately separate from IF-DIRECTORY-ADMIN account CRUD. */
public final class RoleAssignmentAdministration {
    private final DataSource dataSource;
    private final IdentityTransactions transactions;
    public record Result(UUID assignmentId) {}
    public record Assignment(UUID principalActorId, UUID roleVersionId, String roleCode, int version,
            UUID organizationId, UUID assignedBy, String reason) {}
    public record Evidence(String outcome, long ownerOutcomes, long auditEvents) {}

    public RoleAssignmentAdministration(DataSource dataSource) {
        this.dataSource = java.util.Objects.requireNonNull(dataSource);
        this.transactions = new IdentityTransactions(dataSource);
    }

    public Result assignAccountAdministrator(ActorContext context, UUID operation, UUID principal,
            UUID roleVersion, UUID organization, String reason) {
        var assignment = UUID.randomUUID();
        return transactions.mutate(context, operation, organization, "role.assign.account-administrator",
                "ROLE_ASSIGNMENT", assignment.toString(), IdentityTransactions.Owner.ACCESS_POLICY, connection -> {
                    if (reason == null || reason.isBlank() || reason.length() > 500
                            || reason.codePoints().anyMatch(Character::isISOControl)) throw new IdentityRefusal("INVALID_INPUT");
                    try (var statement = connection.prepareStatement("SELECT 1 FROM identity_role_version "
                            + "WHERE role_version_id=? AND role_code='account-administrator' AND version=1")) {
                        statement.setObject(1, roleVersion);
                        try (var row = statement.executeQuery()) {
                            if (!row.next()) throw new IdentityRefusal("UNSUPPORTED_ROLE_VERSION");
                        }
                    }
                    try (var statement = connection.prepareStatement("SELECT 1 FROM idea_account "
                            + "WHERE actor_id=? AND organization_id=? AND status='ACTIVE'")) {
                        statement.setObject(1, principal);
                        statement.setObject(2, organization);
                        try (var row = statement.executeQuery()) {
                            if (!row.next()) throw new IdentityRefusal("INELIGIBLE_PRINCIPAL");
                        }
                    }
                    AdministratorBootstrap.insert(connection, "INSERT INTO identity_role_assignment "
                            + "(assignment_id,principal_actor_id,role_version_id,organization_id,assigned_by,reason) "
                            + "VALUES (?,?,?,?,?,?)", assignment, principal, roleVersion, organization, context.actorId(), reason);
                    // The material assignment change and reason share the outcome/Audit transaction.
                    // Deferrable reference allows the owner outcome to be written after this mutation.
                    AdministratorBootstrap.insert(connection, "INSERT INTO identity_assignment_evidence "
                            + "(operation_id,assignment_id,principal_actor_id,role_version_id,organization_id,assigned_by,reason) "
                            + "VALUES (?,?,?,?,?,?,?)", operation, assignment, principal, roleVersion, organization, context.actorId(), reason);
                    return new Result(assignment);
                });
    }

    /** Local operator diagnostics; not exposed as a controller or public route. */
    public Assignment inspect(UUID assignment) {
        try (var connection = dataSource.getConnection(); var statement = connection.prepareStatement(
                "SELECT a.principal_actor_id,a.role_version_id,r.role_code,r.version,a.organization_id,a.assigned_by,a.reason "
                + "FROM identity_role_assignment a JOIN identity_role_version r USING(role_version_id) WHERE a.assignment_id=?")) {
            statement.setObject(1, assignment);
            try (var row = statement.executeQuery()) {
                if (!row.next()) throw new IllegalArgumentException("Assignment not found");
                return new Assignment(row.getObject(1, UUID.class), row.getObject(2, UUID.class), row.getString(3),
                        row.getInt(4), row.getObject(5, UUID.class), row.getObject(6, UUID.class), row.getString(7));
            }
        } catch (SQLException exception) { throw new IllegalStateException("Assignment inspection failed", exception); }
    }

    public Evidence evidence(UUID operation) {
        try (var connection = dataSource.getConnection(); var statement = connection.prepareStatement(
                "SELECT (SELECT outcome FROM access_policy_owner_outcome WHERE operation_id=?),"
                + "(SELECT count(*) FROM access_policy_owner_outcome WHERE operation_id=?),"
                + "(SELECT count(*) FROM audit_evidence WHERE operation_id=?)")) {
            for (int index = 1; index <= 3; index++) statement.setObject(index, operation);
            try (var row = statement.executeQuery()) { row.next(); return new Evidence(row.getString(1), row.getLong(2), row.getLong(3)); }
        } catch (SQLException exception) { throw new IllegalStateException("Assignment evidence inspection failed", exception); }
    }
}
