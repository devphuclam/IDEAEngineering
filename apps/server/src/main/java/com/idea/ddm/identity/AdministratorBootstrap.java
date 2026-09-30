package com.idea.ddm.identity;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.Locale;
import java.util.UUID;
import javax.sql.DataSource;

/** Local operator entry point only. Not a controller, HTTP endpoint or startup callback. */
public final class AdministratorBootstrap {
    private final DataSource dataSource;
    private final NativePasswordVerifier verifier = new NativePasswordVerifier();

    public enum State { INITIALIZED, ALREADY_INITIALIZED }
    public record Result(State state, UUID actorId, UUID accountId) {}
    public record Snapshot(long actors, long accounts, long assignments, long auditEvents,
            UUID custodianActorId, UUID organizationId, String initialRole) {}

    public AdministratorBootstrap(DataSource dataSource) {
        this.dataSource = java.util.Objects.requireNonNull(dataSource);
    }

    public Result initialize(UUID organizationId, String organizationName, String displayName,
            String login, String password) {
        try (var connection = dataSource.getConnection()) {
            connection.setAutoCommit(false);
            try {
                // One organization per installation; concurrent local attempts have one winner.
                execute(connection, "SELECT pg_advisory_xact_lock(73003001)");
                try (var statement = connection.createStatement(); var row = statement.executeQuery(
                        "SELECT actor_id, account_id FROM identity_bootstrap_state")) {
                    if (row.next()) {
                        var result = new Result(State.ALREADY_INITIALIZED,
                                row.getObject(1, UUID.class), row.getObject(2, UUID.class));
                        connection.commit();
                        return result;
                    }
                }
                if (count(connection, "actor") != 0 || count(connection, "identity_role_assignment") != 0) {
                    throw new IllegalStateException("Bootstrap requires a new uninitialized identity estate");
                }
                java.util.Objects.requireNonNull(organizationId, "Organization identity required");
                requireText(organizationName, 160);
                requireText(displayName, 160);
                requireText(login, 254);
                var encoded = verifier.encode(password);
                var actorId = UUID.randomUUID();
                var accountId = UUID.randomUUID();
                var operationId = UUID.randomUUID();
                insert(connection, "INSERT INTO operating_organization(organization_id,display_name) VALUES (?,?)",
                        organizationId, organizationName);
                insert(connection, "INSERT INTO actor(actor_id,display_name) VALUES (?,?)", actorId, displayName);
                insert(connection, "INSERT INTO idea_account(account_id,actor_id,organization_id,status) VALUES (?,?,?,'ACTIVE')",
                        accountId, actorId, organizationId);
                insert(connection, "INSERT INTO login_identity(login_identity_id,account_id,login_identifier,"
                        + "normalized_login_identifier,password_verifier) VALUES (?,?,?,?,?)", UUID.randomUUID(),
                        accountId, login, login.strip().toLowerCase(Locale.ROOT), encoded);
                insert(connection, "INSERT INTO identity_role_assignment(assignment_id,principal_actor_id,"
                        + "role_version_id,organization_id,assigned_by,reason) SELECT ?,?,role_version_id,?,?,? "
                        + "FROM identity_role_version WHERE role_code='super-administrator' AND version=1",
                        UUID.randomUUID(), actorId, organizationId, actorId, "Controlled initial local bootstrap");
                insert(connection, "INSERT INTO identity_bootstrap_state(organization_id,actor_id,account_id) VALUES (?,?,?)",
                        organizationId, actorId, accountId);
                record(connection, operationId, actorId, "identity.bootstrap", accountId.toString(),
                        "ACCEPTED", null);
                connection.commit();
                return new Result(State.INITIALIZED, actorId, accountId);
            } catch (SQLException | RuntimeException exception) {
                connection.rollback();
                throw exception;
            }
        } catch (SQLException exception) {
            throw new IllegalStateException("Local identity bootstrap failed; no success is reported", exception);
        }
    }

    /** Local diagnostics contain identities/counts only, never credentials or session proof. */
    public Snapshot inspect() {
        try (var connection = dataSource.getConnection(); var statement = connection.createStatement();
                var row = statement.executeQuery("SELECT b.actor_id,b.organization_id,r.role_code,r.version "
                        + "FROM identity_bootstrap_state b JOIN identity_role_assignment a "
                        + "ON a.principal_actor_id=b.actor_id JOIN identity_role_version r "
                        + "ON r.role_version_id=a.role_version_id WHERE r.role_code='super-administrator'")) {
            if (!row.next()) return new Snapshot(count(connection, "actor"), count(connection, "idea_account"),
                    count(connection, "identity_role_assignment"), count(connection, "audit_evidence"), null, null, null);
            return new Snapshot(count(connection, "actor"), count(connection, "idea_account"),
                    count(connection, "identity_role_assignment"), count(connection, "audit_evidence"),
                    row.getObject(1, UUID.class), row.getObject(2, UUID.class), row.getString(3) + "@" + row.getInt(4));
        } catch (SQLException exception) {
            throw new IllegalStateException("Could not inspect local bootstrap state", exception);
        }
    }

    static void requireText(String value, int maximum) {
        if (value == null || value.isBlank() || value.length() > maximum) {
            throw new IllegalArgumentException("Required identity input is invalid");
        }
    }

    static void execute(Connection connection, String sql, Object... values) throws SQLException {
        try (var statement = connection.prepareStatement(sql)) {
            for (int index = 0; index < values.length; index++) statement.setObject(index + 1, values[index]);
            statement.execute();
        }
    }

    static long count(Connection connection, String table) throws SQLException {
        // Call sites supply fixed internal table names, never request input.
        try (var statement = connection.createStatement(); var row = statement.executeQuery("SELECT count(*) FROM " + table)) {
            row.next();
            return row.getLong(1);
        }
    }

    static void insert(Connection connection, String sql, Object... values) throws SQLException {
        try (var statement = connection.prepareStatement(sql)) {
            for (int index = 0; index < values.length; index++) statement.setObject(index + 1, values[index]);
            if (statement.executeUpdate() != 1) {
                throw new IllegalStateException("Required identity state or evidence was not written");
            }
        }
    }

    static void record(Connection connection, UUID operationId, UUID actorId, String action,
            String target, String outcome, String reason) throws SQLException {
        insert(connection, "INSERT INTO iam_owner_outcome(operation_id,actor_id,action,target_id,outcome,reason_code) "
                + "VALUES (?,?,?,?,?,?)", operationId, actorId, action, target, outcome, reason);
        insert(connection, "INSERT INTO audit_evidence(evidence_id,operation_id,actor_id,action,target_type,target_id,"
                + "outcome,reason_code) VALUES (?,?,?,?,'IDEA_ACCOUNT',?,?,?)", UUID.randomUUID(), operationId,
                actorId, action, target, outcome, reason);
    }
}
