package com.idea.ddm.project;

import com.idea.ddm.identity.OwnerSessionEligibility.EligibleActor;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Objects;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/** Project-owned read facts in the caller's transaction, not an authorization evaluator. */
public final class ProjectGovernanceQueries {
    public record Membership(UUID membershipId, Instant effectiveFrom, Instant effectiveUntil, long version) {}
    public record GroupPath(UUID groupId, Membership membership) {}
    public record ProjectFacts(UUID projectId, UUID organizationId, long version,
            Optional<Membership> projectMembership, List<GroupPath> groupMemberships) {
        public ProjectFacts { groupMemberships = List.copyOf(groupMemberships); }
    }

    public Optional<ProjectFacts> authorizationFacts(Connection connection, EligibleActor actor,
            UUID projectId, Instant now) throws SQLException {
        if (connection.getAutoCommit()) throw new SQLException("Caller-owned Project read transaction required");
        Objects.requireNonNull(actor);
        Objects.requireNonNull(projectId);
        Objects.requireNonNull(now);
        // One statement gives one PostgreSQL snapshot. No transaction/lock/activity ownership here.
        try (var query = connection.prepareStatement("SELECT p.project_id,p.organization_id,p.version,"
                + "m.membership_id,m.effective_from,m.effective_until,m.version,"
                + "g.group_id,g.membership_id,g.effective_from,g.effective_until,g.version "
                + "FROM project p LEFT JOIN project_membership m ON m.project_id=p.project_id "
                + "AND m.organization_id=p.organization_id AND m.actor_id=? AND m.ended_at IS NULL "
                + "AND m.effective_from<=? AND (m.effective_until IS NULL OR m.effective_until>?) "
                + "LEFT JOIN group_membership g ON m.membership_id IS NOT NULL AND g.project_id=p.project_id "
                + "AND g.organization_id=p.organization_id AND g.actor_id=m.actor_id AND g.ended_at IS NULL "
                + "AND g.effective_from<=? AND (g.effective_until IS NULL OR g.effective_until>?) "
                + "JOIN operating_organization o ON o.organization_id=p.organization_id "
                + "WHERE p.project_id=? AND p.organization_id=? ORDER BY g.group_id,g.membership_id")) {
            query.setObject(1, actor.actorId());
            for (int parameter = 2; parameter <= 5; parameter++) query.setTimestamp(parameter, Timestamp.from(now));
            query.setObject(6, projectId);
            query.setObject(7, actor.organizationId());
            try (var rows = query.executeQuery()) {
                if (!rows.next()) return Optional.empty();
                var membership = rows.getObject(4) == null ? Optional.<Membership>empty()
                        : Optional.of(membership(rows, 4));
                var groups = new ArrayList<GroupPath>();
                var id = rows.getObject(1, UUID.class);
                var organization = rows.getObject(2, UUID.class);
                var version = rows.getLong(3);
                do {
                    if (rows.getObject(8) != null) groups.add(new GroupPath(rows.getObject(8, UUID.class), membership(rows, 9)));
                } while (rows.next());
                return Optional.of(new ProjectFacts(id, organization, version, membership, groups));
            }
        }
    }

    private static Membership membership(java.sql.ResultSet row, int start) throws SQLException {
        var until = row.getTimestamp(start + 2);
        return new Membership(row.getObject(start, UUID.class), row.getTimestamp(start + 1).toInstant(),
                until == null ? null : until.toInstant(), row.getLong(start + 3));
    }
}
