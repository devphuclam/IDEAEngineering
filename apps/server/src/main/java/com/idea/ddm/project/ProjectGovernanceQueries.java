package com.idea.ddm.project;

import com.idea.ddm.identity.OwnerSessionEligibility.EligibleActor;
import java.sql.Connection;
import java.sql.SQLException;
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
        throw new UnsupportedOperationException("Project-owned authorization read facts not implemented");
    }
}
