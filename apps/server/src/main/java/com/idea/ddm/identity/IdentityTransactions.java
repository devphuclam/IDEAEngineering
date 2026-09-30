package com.idea.ddm.identity;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.UUID;
import javax.sql.DataSource;

/** Security writes serialize at this installation lock; account/assignment changes recheck before mutation. */
final class IdentityTransactions {
    enum Owner { IAM, ACCESS_POLICY }
    @FunctionalInterface interface Mutation<T> { T apply(Connection connection) throws SQLException; }
    private final DataSource dataSource;

    IdentityTransactions(DataSource dataSource) { this.dataSource = java.util.Objects.requireNonNull(dataSource); }

    <T> T mutate(ActorContext context, UUID operation, UUID organization, String permission,
            String targetType, String target, Owner owner, Mutation<T> mutation) {
        java.util.Objects.requireNonNull(context);
        java.util.Objects.requireNonNull(operation);
        java.util.Objects.requireNonNull(organization);
        try (var connection = dataSource.getConnection()) {
            var initial = IdentityAccessPolicy.evaluate(connection, context, organization, permission);
            connection.setAutoCommit(false);
            if (!initial.granted()) {
                try {
                    IdentityAccessPolicy.retain(connection, operation, "REQUEST", initial);
                    audit(connection, operation, context.actorId(), permission, targetType, target,
                            "REFUSED", initial.refusal());
                    connection.commit();
                } catch (SQLException | RuntimeException exception) { connection.rollback(); throw exception; }
                throw new IdentityRefusal(initial.refusal()); // No owner command on initial authorization refusal.
            }
            IdentityAccessPolicy.Decision current = null;
            try {
                AdministratorBootstrap.execute(connection, "SELECT pg_advisory_xact_lock(73003002)");
                current = IdentityAccessPolicy.evaluate(connection, context, organization, permission);
                if (!current.granted()) throw new IdentityRefusal(current.refusal());
                var value = mutation.apply(connection);
                IdentityAccessPolicy.retain(connection, operation, "REQUEST", initial);
                IdentityAccessPolicy.retain(connection, operation, "COMMIT", current);
                outcome(connection, owner, operation, context.actorId(), permission, target, "ACCEPTED", null);
                audit(connection, operation, context.actorId(), permission, targetType, target, "ACCEPTED", null);
                connection.commit();
                return value;
            } catch (IdentityRefusal refusal) {
                connection.rollback();
                try {
                    IdentityAccessPolicy.retain(connection, operation, "REQUEST", initial);
                    if (current != null) IdentityAccessPolicy.retain(connection, operation, "COMMIT", current);
                    outcome(connection, owner, operation, context.actorId(), permission, target, "REFUSED", refusal.reason());
                    audit(connection, operation, context.actorId(), permission, targetType, target, "REFUSED", refusal.reason());
                    connection.commit();
                } catch (SQLException | RuntimeException exception) { connection.rollback(); throw exception; }
                throw refusal;
            } catch (SQLException | RuntimeException exception) { connection.rollback(); throw exception; }
        } catch (SQLException exception) {
            throw new IllegalStateException("Identity command failed; no successful outcome is reported", exception);
        }
    }

    private static void outcome(Connection connection, Owner owner, UUID operation, UUID actor, String action,
            String target, String result, String reason) throws SQLException {
        var table = owner == Owner.IAM ? "iam_owner_outcome" : "access_policy_owner_outcome";
        AdministratorBootstrap.insert(connection, "INSERT INTO " + table
                + "(operation_id,actor_id,action,target_id,outcome,reason_code) VALUES (?,?,?,?,?,?)",
                operation, actor, action, target, result, reason);
    }

    private static void audit(Connection connection, UUID operation, UUID actor, String action,
            String type, String target, String result, String reason) throws SQLException {
        AdministratorBootstrap.insert(connection, "INSERT INTO audit_evidence "
                + "(evidence_id,operation_id,actor_id,action,target_type,target_id,outcome,reason_code) "
                + "VALUES (?,?,?,?,?,?,?,?)", UUID.randomUUID(), operation, actor, action, type, target, result, reason);
    }
}
