package com.idea.ddm.identity;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.UUID;

/** Access Policy's F03 subset. Reads eligibility; never invokes an IAM mutation. */
final class IdentityAccessPolicy {
    record Decision(ActorContext context, UUID organization, String permission, boolean eligible,
            UUID assignment, UUID roleVersion, String refusal) {
        boolean granted() { return refusal == null; }
    }

    static Decision evaluate(Connection connection, ActorContext context, UUID organization,
            String permission) throws SQLException {
        try (var statement = connection.prepareStatement("SELECT a.status,a.security_version,a.organization_id,"
                + "p.disabled_at FROM idea_account a JOIN actor p USING(actor_id) WHERE a.actor_id=?")) {
            statement.setObject(1, context.actorId());
            try (var row = statement.executeQuery()) {
                if (!row.next() || !"ACTIVE".equals(row.getString(1))
                        || row.getLong(2) != context.securityVersion() || row.getObject(4) != null) {
                    return new Decision(context, organization, permission, false, null, null, "INELIGIBLE_ACTOR");
                }
                if (!organization.equals(row.getObject(3, UUID.class))) {
                    return new Decision(context, organization, permission, true, null, null, "WRONG_ORGANIZATION_SCOPE");
                }
            }
        }
        try (var statement = connection.prepareStatement("SELECT a.assignment_id,a.role_version_id "
                + "FROM identity_role_assignment a JOIN identity_role_permission p USING(role_version_id) "
                + "WHERE a.principal_actor_id=? AND a.organization_id=? AND a.revoked_at IS NULL "
                + "AND a.assigned_at<=CURRENT_TIMESTAMP AND p.permission_code=? ORDER BY a.assignment_id LIMIT 1")) {
            statement.setObject(1, context.actorId());
            statement.setObject(2, organization);
            statement.setString(3, permission);
            try (var row = statement.executeQuery()) {
                if (row.next()) return new Decision(context, organization, permission, true,
                        row.getObject(1, UUID.class), row.getObject(2, UUID.class), null);
            }
        }
        return new Decision(context, organization, permission, true, null, null, "NO_APPLICABLE_ASSIGNMENT");
    }

    static void retain(Connection connection, UUID operation, String stage, Decision decision) throws SQLException {
        AdministratorBootstrap.insert(connection, "INSERT INTO identity_authorization_decision "
                + "(decision_id,operation_id,stage,actor_id,security_version,organization_id,permission_code,"
                + "eligible,granted,assignment_id,role_version_id,reason_code) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
                UUID.randomUUID(), operation, stage, decision.context().actorId(),
                decision.context().securityVersion(), decision.organization(), decision.permission(),
                decision.eligible(), decision.granted(), decision.assignment(), decision.roleVersion(), decision.refusal());
    }
}
