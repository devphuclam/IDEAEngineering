package com.idea.ddm.project;

import static org.junit.jupiter.api.Assertions.*;

import com.idea.ddm.iam.IamIntegrationFixtures;
import com.idea.ddm.iam.IamTestFixture;
import java.time.Instant;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;

/** Real Project-owned read port, real app read-only transaction and named synthetic prerequisites. */
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class ProjectAuthorizationReadTest {
    private static final Instant NOW = Instant.parse("2026-10-07T06:00:00Z");
    private final IamIntegrationFixtures fixtures = new IamIntegrationFixtures();
    private final ProjectPrerequisiteFixture projects = new ProjectPrerequisiteFixture(fixtures);
    private final ProjectGovernanceQueries queries = new ProjectGovernanceQueries();
    private IamTestFixture actors;

    @BeforeAll void start() throws Exception { fixtures.createSchema(); actors = new IamTestFixture(fixtures); }
    @AfterAll void stop() { if (actors != null) actors.close(); }

    @Test void currentMatchingProjectAndGroupMembershipsAreReturnedWithoutAuthorityMutation() throws Exception {
        var signedIn = actors.signIn(IamIntegrationFixtures.Persona.LINH);
        var project = projects.project(signedIn.identity());
        var group = projects.group(project, signedIn.identity());
        var membership = projects.projectMembership(project, signedIn.identity(), NOW.minusSeconds(1), null);
        var groupMembership = projects.groupMembership(group, signedIn.identity(), NOW.minusSeconds(1), null);
        try (var connection = fixtures.app()) {
            connection.setReadOnly(true);
            connection.setAutoCommit(false);
            var eligible = actors.eligibility().admit(connection, signedIn.context());
            var facts = queries.authorizationFacts(connection, eligible, project.projectId(), NOW).orElseThrow();
            assertEquals(project.projectId(), facts.projectId());
            assertEquals(signedIn.identity().organizationId(), facts.organizationId());
            assertEquals(1, facts.version());
            assertEquals(membership, facts.projectMembership().orElseThrow().membershipId());
            assertEquals(java.util.List.of(new ProjectGovernanceQueries.GroupPath(group.groupId(),
                    new ProjectGovernanceQueries.Membership(groupMembership, NOW.minusSeconds(1), null, 1))), facts.groupMemberships());
            assertTrue(connection.isReadOnly());
            connection.rollback();
        }
    }
}
