package com.idea.ddm.access;

import static org.junit.jupiter.api.Assertions.*;

import com.idea.ddm.iam.IamIntegrationFixtures;
import com.idea.ddm.iam.IamTestFixture;
import com.idea.ddm.project.ProjectGovernanceQueries;
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
}
