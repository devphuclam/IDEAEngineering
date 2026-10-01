package com.idea.ddm.identity;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import javax.sql.DataSource;

/** IF-DIRECTORY-ADMIN subset. Cannot assign roles, memberships or product authority. */
public final class IdentityAdministration {
    private final DataSource dataSource;
    private final IdentityTransactions transactions;
    private final SessionService sessions;
    public record Account(UUID actorId, UUID accountId, UUID loginIdentityId, UUID organizationId,
            String displayName, String normalizedLogin, String status, long securityVersion, long roleAssignments) {}
    public record Totals(long actors, long accounts, long logins, long assignments, long ownerOutcomes,
            long auditEvents, long changeEvidence) {}
    public record Evidence(String outcome, long ownerOutcomes, long auditEvents) {}
    public record Change(UUID operationId, UUID actorId, String beforeStatus, String afterStatus,
            Long beforeSecurityVersion, long afterSecurityVersion, UUID changedBy, String reason) {}

    public IdentityAdministration(DataSource dataSource) {
        this(dataSource, null);
    }

    /** HTTP adapter uses current session eligibility; the existing service fixture seam stays separate. */
    IdentityAdministration(DataSource dataSource, SessionService sessions) {
        this.dataSource = java.util.Objects.requireNonNull(dataSource);
        this.sessions = sessions;
        this.transactions = sessions == null ? new IdentityTransactions(dataSource)
                : new IdentityTransactions(dataSource, sessions::checkEligibility);
    }

    /** Issue an identity awaiting F03-B's protected one-use credential setup; no temporary/default password. */
    public Account create(ActorContext context, UUID operation, UUID organization, String displayName, String login) {
        var actor = UUID.randomUUID();
        var account = UUID.randomUUID();
        var loginId = UUID.randomUUID();
        return transactions.mutate(context, operation, organization, "account.create", "IDEA_ACCOUNT",
                account.toString(), IdentityTransactions.Owner.IAM, connection -> {
                    if (sessions != null) sessions.requireEligible(connection, context);
                    validText(displayName, 160);
                    validText(login, 254);
                    var normalized = login.strip().toLowerCase(Locale.ROOT);
                    try (var statement = connection.prepareStatement(
                            "SELECT 1 FROM login_identity WHERE normalized_login_identifier=?")) {
                        statement.setString(1, normalized);
                        try (var row = statement.executeQuery()) {
                            if (row.next()) throw new IdentityRefusal("LOGIN_IDENTIFIER_EXISTS");
                        }
                    }
                    AdministratorBootstrap.insert(connection, "INSERT INTO actor(actor_id,display_name) VALUES (?,?)", actor, displayName);
                    AdministratorBootstrap.insert(connection, "INSERT INTO idea_account "
                            + "(account_id,actor_id,organization_id,status) VALUES (?,?,?,'PENDING')", account, actor, organization);
                    AdministratorBootstrap.insert(connection, "INSERT INTO login_identity "
                            + "(login_identity_id,account_id,login_identifier,normalized_login_identifier,password_verifier) "
                            + "VALUES (?,?,?,?,NULL)", loginId, account, login, normalized);
                    changeEvidence(connection, operation, actor, account, organization, context.actorId(),
                            null, "PENDING", null, 1, "Account issued; credential setup pending");
                    return account(connection, account);
                });
    }

    public Account disable(ActorContext context, UUID operation, UUID organization, UUID account,
            long expectedSecurityVersion, String reason) {
        return changeStatus(context, operation, organization, account, expectedSecurityVersion, reason, true);
    }

    public Account reenable(ActorContext context, UUID operation, UUID organization, UUID account,
            long expectedSecurityVersion, String reason) {
        return changeStatus(context, operation, organization, account, expectedSecurityVersion, reason, false);
    }

    private Account changeStatus(ActorContext context, UUID operation, UUID organization, UUID target,
            long expectedSecurityVersion, String reason, boolean disabling) {
        return transactions.mutate(context, operation, organization, disabling ? "account.disable" : "account.re-enable",
                "IDEA_ACCOUNT", target.toString(), IdentityTransactions.Owner.IAM, connection -> {
                    if (sessions != null) sessions.requireEligible(connection, context);
                    validText(reason, 500);
                    try (var statement = connection.prepareStatement("SELECT actor_id,status,security_version,organization_id "
                            + "FROM idea_account WHERE account_id=? FOR UPDATE")) {
                        statement.setObject(1, target);
                        try (var row = statement.executeQuery()) {
                            if (!row.next()) throw new IdentityRefusal("ACCOUNT_NOT_FOUND");
                            var actor = row.getObject(1, UUID.class);
                            var before = row.getString(2);
                            var version = row.getLong(3);
                            if (!organization.equals(row.getObject(4, UUID.class))) throw new IdentityRefusal("WRONG_TARGET_SCOPE");
                            if (expectedSecurityVersion != version) throw new IdentityRefusal("STALE_ACCOUNT_VERSION");
                            if (disabling == "DISABLED".equals(before)) throw new IdentityRefusal("INVALID_ACCOUNT_STATE");
                            if (disabling) protectLastRecoveryPath(connection, actor, organization);
                            var after = "DISABLED";
                            if (!disabling) {
                                try (var credentials = connection.prepareStatement(
                                        "SELECT 1 FROM login_identity WHERE account_id=? AND password_verifier IS NOT NULL")) {
                                    credentials.setObject(1, target);
                                    try (var proof = credentials.executeQuery()) { after = proof.next() ? "ACTIVE" : "PENDING"; }
                                }
                            }
                            AdministratorBootstrap.insert(connection, "UPDATE idea_account SET status=?,security_version=? "
                                    + "WHERE account_id=? AND security_version=?", after, version + 1, target, version);
                            AdministratorBootstrap.insert(connection, "UPDATE actor SET disabled_at="
                                    + (disabling ? "CURRENT_TIMESTAMP" : "NULL") + " WHERE actor_id=?", actor);
                            changeEvidence(connection, operation, actor, target, organization, context.actorId(),
                                    before, after, version, version + 1, reason);
                            return account(connection, target);
                        }
                    }
                });
    }

    /** Local operator diagnostics only. Does not return password verifiers, proof or session data. */
    public Account inspect(UUID account) {
        try (var connection = dataSource.getConnection()) { return account(connection, account); }
        catch (SQLException exception) { throw new IllegalStateException("Account inspection failed", exception); }
    }

    public Totals totals() {
        try (var connection = dataSource.getConnection()) {
            return new Totals(AdministratorBootstrap.count(connection, "actor"), AdministratorBootstrap.count(connection, "idea_account"),
                    AdministratorBootstrap.count(connection, "login_identity"), AdministratorBootstrap.count(connection, "identity_role_assignment"),
                    AdministratorBootstrap.count(connection, "iam_owner_outcome"), AdministratorBootstrap.count(connection, "audit_evidence"),
                    AdministratorBootstrap.count(connection, "iam_account_change_evidence"));
        } catch (SQLException exception) { throw new IllegalStateException("Account diagnostics failed", exception); }
    }

    public Evidence evidence(UUID operation) {
        try (var connection = dataSource.getConnection(); var statement = connection.prepareStatement(
                "SELECT (SELECT outcome FROM iam_owner_outcome WHERE operation_id=?),"
                + "(SELECT count(*) FROM iam_owner_outcome WHERE operation_id=?),"
                + "(SELECT count(*) FROM audit_evidence WHERE operation_id=?)")) {
            for (int index = 1; index <= 3; index++) statement.setObject(index, operation);
            try (var row = statement.executeQuery()) { row.next(); return new Evidence(row.getString(1), row.getLong(2), row.getLong(3)); }
        } catch (SQLException exception) { throw new IllegalStateException("Account evidence inspection failed", exception); }
    }

    public List<Change> history(UUID account) {
        try (var connection = dataSource.getConnection(); var statement = connection.prepareStatement(
                "SELECT operation_id,actor_id,before_status,after_status,before_security_version,"
                + "after_security_version,changed_by,reason FROM iam_account_change_evidence "
                + "WHERE account_id=? ORDER BY occurred_at,operation_id")) {
            statement.setObject(1, account);
            var history = new ArrayList<Change>();
            try (var row = statement.executeQuery()) {
                while (row.next()) history.add(new Change(row.getObject(1, UUID.class), row.getObject(2, UUID.class),
                        row.getString(3), row.getString(4), row.getObject(5, Long.class), row.getLong(6),
                        row.getObject(7, UUID.class), row.getString(8)));
            }
            return List.copyOf(history);
        } catch (SQLException exception) { throw new IllegalStateException("Account history inspection failed", exception); }
    }

    private static Account account(Connection connection, UUID account) throws SQLException {
        try (var statement = connection.prepareStatement("SELECT a.actor_id,a.account_id,l.login_identity_id,a.organization_id,"
                + "p.display_name,l.normalized_login_identifier,a.status,a.security_version,"
                + "(SELECT count(*) FROM identity_role_assignment r WHERE r.principal_actor_id=a.actor_id) "
                + "FROM idea_account a JOIN actor p USING(actor_id) JOIN login_identity l USING(account_id) WHERE a.account_id=?")) {
            statement.setObject(1, account);
            try (var row = statement.executeQuery()) {
                if (!row.next()) throw new IdentityRefusal("ACCOUNT_NOT_FOUND");
                return new Account(row.getObject(1, UUID.class), row.getObject(2, UUID.class), row.getObject(3, UUID.class),
                        row.getObject(4, UUID.class), row.getString(5), row.getString(6), row.getString(7), row.getLong(8), row.getLong(9));
            }
        }
    }

    private static void validText(String value, int maximum) {
        if (value == null || value.isBlank() || value.length() > maximum || value.codePoints().anyMatch(Character::isISOControl)) {
            throw new IdentityRefusal("INVALID_INPUT");
        }
    }

    private static void protectLastRecoveryPath(Connection connection, UUID actor, UUID organization) throws SQLException {
        // Highest-role recovery invariant, not an account-operation authorization shortcut.
        try (var statement = connection.prepareStatement("SELECT DISTINCT a.principal_actor_id "
                + "FROM identity_role_assignment a JOIN identity_role_version r USING(role_version_id) "
                + "JOIN idea_account c ON c.actor_id=a.principal_actor_id JOIN actor p ON p.actor_id=c.actor_id "
                + "WHERE r.role_code='super-administrator' AND r.version=1 AND a.organization_id=? "
                + "AND a.revoked_at IS NULL AND a.assigned_at<=CURRENT_TIMESTAMP "
                + "AND c.status='ACTIVE' AND p.disabled_at IS NULL")) {
            statement.setObject(1, organization);
            var holders = new ArrayList<UUID>();
            try (var row = statement.executeQuery()) { while (row.next()) holders.add(row.getObject(1, UUID.class)); }
            if (holders.size() == 1 && holders.contains(actor)) throw new IdentityRefusal("LAST_SUPER_ADMINISTRATOR_RECOVERY_PATH");
        }
    }

    private static void changeEvidence(Connection connection, UUID operation, UUID actor, UUID account, UUID organization,
            UUID changedBy, String before, String after, Long beforeVersion, long afterVersion, String reason) throws SQLException {
        AdministratorBootstrap.insert(connection, "INSERT INTO iam_account_change_evidence "
                + "(operation_id,actor_id,account_id,organization_id,changed_by,before_status,after_status,"
                + "before_security_version,after_security_version,reason) VALUES (?,?,?,?,?,?,?,?,?,?)",
                operation, actor, account, organization, changedBy, before, after, beforeVersion, afterVersion, reason);
    }
}
