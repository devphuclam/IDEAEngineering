package com.idea.ddm.identity;

import com.idea.ddm.access.AuthorizationDecisionService;
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
        var paths = AuthorizationDecisionService.organizationGrants(connection,
                new OwnerSessionEligibility.EligibleActor(context.actorId(), organization), permission);
        if (!paths.isEmpty()) {
            // Preserve F03's historical one-path evidence shape; do not rewrite retained decisions.
            var first = paths.getFirst();
            return new Decision(context, organization, permission, true, first.assignmentId(), first.roleVersionId(), null);
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
