package com.idea.ddm.identity;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.UUID;
import javax.sql.DataSource;

/** Security writes serialize at this installation lock; account/assignment changes recheck before mutation. */
public final class IdentityTransactions {
    enum Owner { IAM, ACCESS_POLICY }
    @FunctionalInterface interface Mutation<T> { T apply(Connection connection) throws SQLException; }
    @FunctionalInterface interface Eligibility { void check(Connection connection, ActorContext context) throws SQLException; }
    private final DataSource dataSource;
    private final Eligibility eligibility;
    private final OwnerSessionEligibility ownerEligibility;

    /** New owner seam: validation and evidence run on the same caller-owned JDBC transaction. */
    public interface OwnerCommand<T> {
        void revalidate(Connection connection, OwnerSessionEligibility.EligibleActor actor) throws SQLException;
        T apply(Connection connection, OwnerSessionEligibility.EligibleActor actor) throws SQLException;
    }

    public IdentityTransactions(DataSource dataSource, OwnerSessionEligibility ownerEligibility) {
        this.dataSource = java.util.Objects.requireNonNull(dataSource);
        this.ownerEligibility = java.util.Objects.requireNonNull(ownerEligibility);
        this.eligibility = (connection, context) -> ownerEligibility.admit(connection, context);
    }

    public <T> T executeOwner(ActorContext context, OwnerCommand<T> command) {
        java.util.Objects.requireNonNull(command);
        if (ownerEligibility == null) throw new IllegalStateException("Current owner eligibility is required");
        try (var connection = dataSource.getConnection()) {
            connection.setTransactionIsolation(Connection.TRANSACTION_READ_COMMITTED);
            connection.setAutoCommit(false);
            try {
                var actor = ownerEligibility.admit(connection, context);
                ownerEligibility.coordinateCommit(connection, context, actor, false);
                command.revalidate(connection, actor);
                var value = command.apply(connection, actor);
                // Owner authority/expected state and IAM are current, not an admission snapshot.
                command.revalidate(connection, actor);
                ownerEligibility.coordinateCommit(connection, context, actor, true);
                connection.commit();
                return value;
            } catch (SQLException | RuntimeException exception) {
                try { connection.rollback(); }
                catch (SQLException rollback) { exception.addSuppressed(rollback); }
                throw exception;
            }
        } catch (SQLException exception) {
            // A commit exception never means confirmed rollback or permission to blindly retry.
            throw new IllegalStateException("Owner command unavailable; commit outcome must be resolved", exception);
        }
    }

    IdentityTransactions(DataSource dataSource) { this(dataSource, (connection, context) -> {}); }

    IdentityTransactions(DataSource dataSource, Eligibility eligibility) {
        this.dataSource = java.util.Objects.requireNonNull(dataSource);
        this.eligibility = java.util.Objects.requireNonNull(eligibility);
        this.ownerEligibility = null;
    }

    <T> T mutate(ActorContext context, UUID operation, UUID organization, String permission,
            String targetType, String target, Owner owner, Mutation<T> mutation) {
        java.util.Objects.requireNonNull(context);
        java.util.Objects.requireNonNull(operation);
        java.util.Objects.requireNonNull(organization);
        try (var connection = dataSource.getConnection()) {
            var initial = evaluate(connection, context, organization, permission);
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
                current = evaluate(connection, context, organization, permission);
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

    private IdentityAccessPolicy.Decision evaluate(Connection connection, ActorContext context, UUID organization,
            String permission) throws SQLException {
        try { eligibility.check(connection, context); }
        catch (IdentityRefusal refusal) {
            return new IdentityAccessPolicy.Decision(context, organization, permission, false, null, null, refusal.reason());
        }
        return IdentityAccessPolicy.evaluate(connection, context, organization, permission);
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
