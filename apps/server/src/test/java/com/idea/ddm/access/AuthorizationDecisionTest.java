package com.idea.ddm.access;

import static org.junit.jupiter.api.Assertions.*;

import com.idea.ddm.iam.IamIntegrationFixtures;
import com.idea.ddm.iam.IamTestFixture;
import com.idea.ddm.project.ProjectGovernanceQueries;
import com.idea.ddm.project.ProjectPrerequisiteFixture;
import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.Set;
import java.util.stream.Collectors;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class AuthorizationDecisionTest {
    private static final Instant NOW = Instant.parse("2026-10-07T06:00:00Z");
    private final IamIntegrationFixtures fixtures = new IamIntegrationFixtures();
    private final AuthorizationPrerequisiteFixture roles = new AuthorizationPrerequisiteFixture(fixtures);
    private final ProjectPrerequisiteFixture projects = new ProjectPrerequisiteFixture(fixtures);
    private IamTestFixture actors;
    private AuthorizationDecisionService policy;

    @BeforeAll void start() throws Exception {
        fixtures.createSchema();
        actors = new IamTestFixture(fixtures);
        policy = new AuthorizationDecisionService(actors.eligibility(), new ProjectGovernanceQueries(), Clock.fixed(NOW, ZoneOffset.UTC));
    }
    @AfterAll void stop() { if (actors != null) actors.close(); }

    @Test void everyApplicableDirectAssignmentContributesWithoutRewritingExactRoleVersion() throws Exception {
        var actor = actors.signIn(IamIntegrationFixtures.Persona.LINH);
        var scope = AuthorizationDecisionService.Scope.organization(actor.identity().organizationId());
        var first = roles.actorAssignment(actor.identity(), AuthorizationPrerequisiteFixture.AA_V1, scope, NOW.minusSeconds(1), null);
        var second = roles.actorAssignment(actor.identity(), AuthorizationPrerequisiteFixture.AA_V2, scope, NOW.minusSeconds(1), null);
        try (var connection = fixtures.app()) {
            connection.setReadOnly(true);
            connection.setAutoCommit(false);
            var result = policy.evaluate(connection, actor.context(), "account.create", scope);
            assertTrue(result.rbacGranted());
            assertTrue(result.eligible());
            assertNull(result.refusal());
            assertEquals(actor.identity().actorId(), result.actorId());
            assertEquals(scope, result.scope());
            assertEquals("account.create", result.permission());
            assertEquals(NOW, result.evaluatedAt());
            assertEquals(Set.of(first, second), result.paths().stream().map(AuthorizationDecisionService.GrantPath::assignmentId).collect(Collectors.toSet()));
            assertEquals(Set.of(AuthorizationPrerequisiteFixture.AA_V1, AuthorizationPrerequisiteFixture.AA_V2),
                    result.paths().stream().map(AuthorizationDecisionService.GrantPath::roleVersionId).collect(Collectors.toSet()));
            assertEquals(Set.of(1, 2), result.paths().stream().map(AuthorizationDecisionService.GrantPath::roleVersion).collect(Collectors.toSet()));
            connection.rollback();
        }
    }

    @Test void organizationScopedProjectAdministratorCoversDeclaredChildAdministrationWithoutMembership() throws Exception {
        var actor = actors.signIn(IamIntegrationFixtures.Persona.PA_ORGANIZATION);
        var project = projects.project(actor.identity());
        var organization = AuthorizationDecisionService.Scope.organization(actor.identity().organizationId());
        var assignment = roles.actorAssignment(actor.identity(), AuthorizationPrerequisiteFixture.PA_V1, organization, NOW.minusSeconds(1), null);
        var scope = AuthorizationDecisionService.Scope.project(project.organizationId(), project.projectId());
        try (var connection = fixtures.app()) {
            connection.setReadOnly(true);
            connection.setAutoCommit(false);
            var result = policy.evaluate(connection, actor.context(), "project.admin.read", scope);
            assertTrue(result.rbacGranted());
            assertEquals(1, result.paths().size());
            assertEquals(assignment, result.paths().getFirst().assignmentId());
            assertEquals(organization, result.paths().getFirst().assignmentScope());
            assertNull(result.paths().getFirst().projectMembershipId());
            assertNull(result.paths().getFirst().groupMembershipId());
            assertFalse(policy.evaluate(connection, actor.context(), "project.read", scope).rbacGranted());
            assertFalse(policy.evaluate(connection, actor.context(), "project.create", scope).rbacGranted());
            assertTrue(policy.evaluate(connection, actor.context(), "project.create", organization).rbacGranted());
            connection.rollback();
        }
    }

    @Test void directAndMultipleMatchingGroupPathsUnionWithCurrentParticipationProvenance() throws Exception {
        var actor = actors.signIn(IamIntegrationFixtures.Persona.LINH);
        var project = projects.project(actor.identity());
        var projectMembership = projects.projectMembership(project, actor.identity(), NOW.minusSeconds(1), null);
        var first = projects.group(project, actor.identity());
        var second = projects.group(project, actor.identity());
        var firstMember = projects.groupMembership(first, actor.identity(), NOW.minusSeconds(1), null);
        var secondMember = projects.groupMembership(second, actor.identity(), NOW.minusSeconds(1), null);
        var organization = AuthorizationDecisionService.Scope.organization(actor.identity().organizationId());
        var scope = AuthorizationDecisionService.Scope.project(project.organizationId(), project.projectId());
        var role = roles.participantRole(organization);
        var direct = roles.actorAssignment(actor.identity(), role, organization, NOW.minusSeconds(1), null);
        var groupOne = roles.groupAssignment(actor.identity(), role, first, NOW.minusSeconds(1), null);
        var groupTwo = roles.groupAssignment(actor.identity(), role, second, NOW.minusSeconds(1), null);
        try (var connection = fixtures.app()) {
            connection.setReadOnly(true);
            connection.setAutoCommit(false);
            var result = policy.evaluate(connection, actor.context(), "project.read", scope);
            assertTrue(result.rbacGranted());
            assertEquals(Set.of(direct, groupOne, groupTwo), result.paths().stream().map(AuthorizationDecisionService.GrantPath::assignmentId).collect(Collectors.toSet()));
            assertEquals(Set.of(projectMembership), result.paths().stream().map(AuthorizationDecisionService.GrantPath::projectMembershipId).collect(Collectors.toSet()));
            assertEquals(Set.of(firstMember, secondMember), result.paths().stream().map(AuthorizationDecisionService.GrantPath::groupMembershipId)
                    .filter(java.util.Objects::nonNull).collect(Collectors.toSet()));
            assertEquals(Set.of(first.groupId(), second.groupId()), result.paths().stream().map(AuthorizationDecisionService.GrantPath::groupId)
                    .filter(java.util.Objects::nonNull).collect(Collectors.toSet()));
            assertEquals(Set.of(role), result.paths().stream().map(AuthorizationDecisionService.GrantPath::roleVersionId).collect(Collectors.toSet()));
            assertFalse(policy.evaluate(connection, actor.context(), "account.create", organization).rbacGranted());
            connection.rollback();
        }
    }
}
