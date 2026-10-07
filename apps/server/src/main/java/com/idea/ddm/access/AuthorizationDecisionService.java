package com.idea.ddm.access;

import com.idea.ddm.identity.ActorContext;
import com.idea.ddm.identity.IdentityRefusal;
import com.idea.ddm.identity.OwnerSessionEligibility;
import com.idea.ddm.project.ProjectGovernanceQueries;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.Clock;
import java.time.Instant;
import java.util.List;
import java.util.ArrayList;
import java.util.Objects;
import java.util.Optional;
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
        Objects.requireNonNull(scope);
        Objects.requireNonNull(permission);
        var now = clock.instant();
        final OwnerSessionEligibility.EligibleActor actor;
        try { actor = eligibility.admit(connection, context); }
        catch (IdentityRefusal refusal) {
            return new Decision(context == null ? null : context.actorId(), scope, permission, now, false, List.of(), refusal.reason());
        }
        if (!actor.organizationId().equals(scope.organizationId())) {
            return new Decision(actor.actorId(), scope, permission, now, true, List.of(), "WRONG_ORGANIZATION_SCOPE");
        }
        var facts = scope.kind() == ScopeKind.PROJECT
                ? projects.authorizationFacts(connection, actor, scope.projectId(), now)
                : Optional.<ProjectGovernanceQueries.ProjectFacts>empty();
        if (scope.kind() == ScopeKind.PROJECT && facts.isEmpty()) {
            return new Decision(actor.actorId(), scope, permission, now, true, List.of(), "NO_APPLICABLE_ASSIGNMENT");
        }
        var paths = applicableAssignments(connection, actor.actorId(), permission, scope, now, facts);
        return new Decision(actor.actorId(), scope, permission, now, true, paths, paths.isEmpty() ? "NO_APPLICABLE_ASSIGNMENT" : null);
    }

    private static List<GrantPath> applicableAssignments(Connection connection, UUID actorId, String permission,
            Scope scope, Instant now, Optional<ProjectGovernanceQueries.ProjectFacts> facts) throws SQLException {
        var paths = new ArrayList<GrantPath>();
        var projectMembership = facts.flatMap(ProjectGovernanceQueries.ProjectFacts::projectMembership);
        var groups = facts.map(ProjectGovernanceQueries.ProjectFacts::groupMemberships).orElse(List.of()).stream()
                .collect(java.util.stream.Collectors.toMap(ProjectGovernanceQueries.GroupPath::groupId, path -> path));
        try (var query = connection.prepareStatement("SELECT a.assignment_id,a.role_version_id,v.role_code,v.version,a.scope_kind,a.project_id,"
                + "a.principal_group_id,r.participant_membership_required "
                + "FROM identity_role_assignment a JOIN identity_role_version v USING(role_version_id) "
                + "JOIN identity_role_version_profile profile USING(role_version_id) "
                + "JOIN identity_role_permission p USING(role_version_id) JOIN permission_registry r USING(permission_code) "
                + "WHERE (a.principal_actor_id=? OR a.principal_group_id IS NOT NULL) AND a.organization_id=? AND a.revoked_at IS NULL "
                + "AND a.effective_from<=? AND (a.effective_until IS NULL OR a.effective_until>?) "
                + "AND (a.scope_kind='ORGANIZATION' OR (a.scope_kind='PROJECT' AND ?='PROJECT' AND a.project_id=?)) AND p.permission_code=? "
                + "AND a.scope_kind=ANY(profile.scope_kinds) "
                + "AND (CASE WHEN a.principal_group_id IS NULL THEN 'ACTOR' ELSE 'PROJECT_GROUP' END)=ANY(profile.principal_kinds) "
                + "AND ?=ANY(r.scope_kinds) "
                + "AND (CASE WHEN a.principal_group_id IS NULL THEN 'ACTOR' ELSE 'PROJECT_GROUP' END)=ANY(r.principal_kinds) "
                + "AND (a.principal_group_id IS NULL OR profile.classification='BUSINESS') ORDER BY a.assignment_id")) {
            query.setObject(1, actorId);
            query.setObject(2, scope.organizationId());
            query.setTimestamp(3, Timestamp.from(now));
            query.setTimestamp(4, Timestamp.from(now));
            query.setString(5, scope.kind().name());
            query.setObject(6, scope.projectId());
            query.setString(7, permission);
            query.setString(8, scope.kind().name());
            try (var rows = query.executeQuery()) {
                while (rows.next()) {
                    var group = rows.getObject(7, UUID.class);
                    var participant = rows.getBoolean(8);
                    if ((participant || group != null) && projectMembership.isEmpty()) continue;
                    var groupPath = group == null ? null : groups.get(group);
                    if (group != null && groupPath == null) continue;
                    paths.add(new GrantPath(rows.getObject(1, UUID.class), rows.getObject(2, UUID.class),
                            rows.getString(3), rows.getInt(4),
                            new Scope(ScopeKind.valueOf(rows.getString(5)), scope.organizationId(), rows.getObject(6, UUID.class)), group,
                            participant || group != null ? projectMembership.orElseThrow().membershipId() : null,
                            groupPath == null ? null : groupPath.membership().membershipId()));
                }
            }
        }
        return List.copyOf(paths);
    }
}
