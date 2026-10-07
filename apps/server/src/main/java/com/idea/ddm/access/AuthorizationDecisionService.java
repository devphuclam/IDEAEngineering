package com.idea.ddm.access;

import com.idea.ddm.identity.ActorContext;
import com.idea.ddm.identity.OwnerSessionEligibility;
import com.idea.ddm.project.ProjectGovernanceQueries;
import java.sql.Connection;
import java.sql.SQLException;
import java.time.Clock;
import java.time.Instant;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

/** One Access Policy seam: current IAM and all applicable grants, never owner business success. */
public final class AuthorizationDecisionService {
    public enum ScopeKind { ORGANIZATION, PROJECT }
    public record Scope(ScopeKind kind, UUID organizationId, UUID projectId) {
        public Scope {
            Objects.requireNonNull(kind);
            Objects.requireNonNull(organizationId);
            if ((kind == ScopeKind.PROJECT) != (projectId != null)) throw new IllegalArgumentException("Invalid typed scope");
        }
        public static Scope organization(UUID id) { return new Scope(ScopeKind.ORGANIZATION, id, null); }
        public static Scope project(UUID organization, UUID project) { return new Scope(ScopeKind.PROJECT, organization, project); }
    }
    public record GrantPath(UUID assignmentId, UUID roleVersionId, String roleCode, int roleVersion,
            Scope assignmentScope, UUID groupId, UUID projectMembershipId, UUID groupMembershipId) {}
    public record Decision(UUID actorId, Scope scope, String permission, Instant evaluatedAt,
            boolean eligible, List<GrantPath> paths, String refusal) {
        public Decision { paths = List.copyOf(paths); }
        public boolean rbacGranted() { return eligible && refusal == null && !paths.isEmpty(); }
    }

    private final OwnerSessionEligibility eligibility;
    private final ProjectGovernanceQueries projects;
    private final Clock clock;

    public AuthorizationDecisionService(OwnerSessionEligibility eligibility, ProjectGovernanceQueries projects, Clock clock) {
        this.eligibility = Objects.requireNonNull(eligibility);
        this.projects = Objects.requireNonNull(projects);
        this.clock = Objects.requireNonNull(clock);
    }

    public Decision evaluate(Connection connection, ActorContext context, String permission, Scope scope) throws SQLException {
        throw new UnsupportedOperationException("All-path current authorization not implemented");
    }
}
