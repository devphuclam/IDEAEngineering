package com.idea.ddm.identity;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.Objects;
import java.util.UUID;

/** IAM adapter for a caller-owned transaction; Actor/Organization never come from command input. */
public final class OwnerSessionEligibility {
    public record EligibleActor(UUID actorId, UUID organizationId) {}

    private final SessionService sessions;

    public OwnerSessionEligibility(SessionService sessions) {
        this.sessions = Objects.requireNonNull(sessions);
    }

    public EligibleActor admit(Connection connection, ActorContext context) throws SQLException {
        if (connection.getAutoCommit()) throw new SQLException("Owner transaction required");
        if (context == null) throw new IdentityRefusal("INELIGIBLE_SESSION");
        var view = sessions.checkEligibility(connection, context);
        try (var query = connection.prepareStatement("SELECT organization_id FROM idea_account WHERE account_id=? AND actor_id=?")) {
            query.setObject(1, view.accountId());
            query.setObject(2, view.actorId());
            try (var row = query.executeQuery()) {
                if (!row.next()) throw new IdentityRefusal("INELIGIBLE_SESSION");
                return new EligibleActor(view.actorId(), row.getObject(1, UUID.class));
            }
        }
    }

    /** Existing IAM coordination lock is held by the owner until commit/rollback. */
    public void coordinateCommit(Connection connection, ActorContext context, EligibleActor admitted,
            boolean acceptedActivity) throws SQLException {
        AdministratorBootstrap.execute(connection, "SELECT pg_advisory_xact_lock(73003002)");
        if (!admitted.equals(admit(connection, context))) throw new IdentityRefusal("INELIGIBLE_SESSION");
        if (acceptedActivity) sessions.requireEligible(connection, context);
    }
}
