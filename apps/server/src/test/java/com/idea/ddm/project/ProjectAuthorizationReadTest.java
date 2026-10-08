package com.idea.ddm.project;

import static org.junit.jupiter.api.Assertions.*;

import com.idea.ddm.iam.IamIntegrationFixtures;
import com.idea.ddm.iam.IamTestFixture;
import com.idea.ddm.identity.OwnerSessionEligibility.EligibleActor;
import java.sql.SQLException;
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

    @Test void projectMembershipPeriodIsHalfOpenAndNullEndIsUnbounded() throws Exception {
        var actor = actors.signIn(IamIntegrationFixtures.Persona.LINH);
        var project = projects.project(actor.identity());
        var membership = projects.projectMembership(project, actor.identity(), NOW, NOW.plusSeconds(60));
        assertTrue(read(actor, project, NOW.minusNanos(1000)).projectMembership().isEmpty());
        assertEquals(membership, read(actor, project, NOW).projectMembership().orElseThrow().membershipId());
        assertTrue(read(actor, project, NOW.plusSeconds(60).minusNanos(1000)).projectMembership().isPresent());
        assertTrue(read(actor, project, NOW.plusSeconds(60)).projectMembership().isEmpty());
        var unbounded = projects.project(actor.identity());
        projects.projectMembership(unbounded, actor.identity(), NOW, null);
        assertTrue(read(actor, unbounded, NOW.plusSeconds(86400)).projectMembership().isPresent());
    }

    @Test void groupMembershipPeriodIsHalfOpenAndRetainsExactPathIdentity() throws Exception {
        var actor = actors.signIn(IamIntegrationFixtures.Persona.LINH);
        var project = projects.project(actor.identity());
        projects.projectMembership(project, actor.identity(), NOW.minusSeconds(1), null);
        var group = projects.group(project, actor.identity());
        var id = projects.groupMembership(group, actor.identity(), NOW, NOW.plusSeconds(60));
        assertTrue(read(actor, project, NOW.minusNanos(1000)).groupMemberships().isEmpty());
        assertEquals(id, read(actor, project, NOW).groupMemberships().getFirst().membership().membershipId());
        assertEquals(group.groupId(), read(actor, project, NOW.plusSeconds(60).minusNanos(1000)).groupMemberships().getFirst().groupId());
        assertTrue(read(actor, project, NOW.plusSeconds(60)).groupMemberships().isEmpty());
    }

    @Test void endingProjectMembershipMakesStillRetainedGroupPathsInapplicable() throws Exception {
        var actor = actors.signIn(IamIntegrationFixtures.Persona.LINH);
        var project = projects.project(actor.identity());
        var membership = projects.projectMembership(project, actor.identity(), NOW.minusSeconds(1), null);
        var group = projects.group(project, actor.identity());
        projects.groupMembership(group, actor.identity(), NOW.minusSeconds(1), null);
        assertEquals(1, read(actor, project, NOW).groupMemberships().size());
        projects.insert("UPDATE project_membership SET ended_at=?,ended_by=?,end_reason=? WHERE membership_id=?",
                NOW, actor.identity().actorId(), "Synthetic end", membership);
        var facts = read(actor, project, NOW);
        assertTrue(facts.projectMembership().isEmpty());
        assertTrue(facts.groupMemberships().isEmpty());
    }

    @Test void endedGroupMembershipIsExcludedWithoutEndingProjectParticipation() throws Exception {
        var actor = actors.signIn(IamIntegrationFixtures.Persona.LINH);
        var project = projects.project(actor.identity());
        projects.projectMembership(project, actor.identity(), NOW.minusSeconds(1), null);
        var group = projects.group(project, actor.identity());
        var id = projects.groupMembership(group, actor.identity(), NOW.minusSeconds(1), null);
        projects.insert("UPDATE group_membership SET ended_at=?,ended_by=?,end_reason=? WHERE membership_id=?",
                NOW, actor.identity().actorId(), "Synthetic end", id);
        var facts = read(actor, project, NOW);
        assertTrue(facts.projectMembership().isPresent());
        assertTrue(facts.groupMemberships().isEmpty());
    }

    @Test void groupInAnotherProjectNeverContributesToRequestedProject() throws Exception {
        var actor = actors.signIn(IamIntegrationFixtures.Persona.LINH);
        var first = projects.project(actor.identity());
        var second = projects.project(actor.identity());
        projects.projectMembership(first, actor.identity(), NOW.minusSeconds(1), null);
        projects.projectMembership(second, actor.identity(), NOW.minusSeconds(1), null);
        var group = projects.group(second, actor.identity());
        projects.groupMembership(group, actor.identity(), NOW.minusSeconds(1), null);
        assertTrue(read(actor, first, NOW).groupMemberships().isEmpty());
        assertEquals(group.groupId(), read(actor, second, NOW).groupMemberships().getFirst().groupId());
    }

    @Test void administrationFactsDoNotRequireMembershipOrInferItFromProjectCreation() throws Exception {
        var actor = actors.signIn(IamIntegrationFixtures.Persona.PA_ORGANIZATION);
        var project = projects.project(actor.identity());
        var group = projects.group(project, actor.identity());
        projects.groupMembership(group, actor.identity(), NOW.minusSeconds(1), null); // deliberately no Project membership
        var facts = read(actor, project, NOW);
        assertTrue(facts.projectMembership().isEmpty());
        assertTrue(facts.groupMemberships().isEmpty());
        assertEquals(project.projectId(), facts.projectId()); // facts, not an RBAC grant
    }

    @Test void missingOrWrongOrganizationProjectIsNonDisclosing() throws Exception {
        var actor = actors.signIn(IamIntegrationFixtures.Persona.LINH);
        var project = projects.project(actor.identity());
        try (var connection = fixtures.app()) {
            connection.setReadOnly(true);
            connection.setAutoCommit(false);
            var current = actors.eligibility().admit(connection, actor.context());
            assertTrue(queries.authorizationFacts(connection, current, java.util.UUID.randomUUID(), NOW).isEmpty());
            // Invalid prerequisite Organization exercises read-port isolation, not a forged ActorContext.
            assertTrue(queries.authorizationFacts(connection, new EligibleActor(current.actorId(), java.util.UUID.randomUUID()),
                    project.projectId(), NOW).isEmpty());
            connection.rollback();
        }
    }

    @Test void factsCannotMutateRefreshSessionAcquireSecurityLockOrOwnTheTransaction() throws Exception {
        var actor = actors.signIn(IamIntegrationFixtures.Persona.LINH);
        var project = projects.project(actor.identity());
        try (var connection = fixtures.app()) {
            connection.setReadOnly(true);
            connection.setAutoCommit(false);
            var current = actors.eligibility().admit(connection, actor.context());
            var before = evidenceSnapshot(connection);
            queries.authorizationFacts(connection, current, project.projectId(), NOW.plusSeconds(1800));
            assertEquals(before, evidenceSnapshot(connection));
            assertFalse(connection.getAutoCommit());
            try (var statement = connection.createStatement(); var row = statement.executeQuery(
                    "SELECT count(*) FROM pg_locks WHERE pid=pg_backend_pid() AND locktype='advisory'")) {
                assertTrue(row.next());
                assertEquals(0, row.getLong(1));
            }
            connection.rollback();
        }
    }

    @Test void unavailableProjectStateIsAnErrorNotAnAuthorizedEmptyResult() throws Exception {
        var actor = actors.signIn(IamIntegrationFixtures.Persona.LINH);
        var project = projects.project(actor.identity());
        try (var connection = fixtures.app()) {
            connection.setReadOnly(true);
            connection.setAutoCommit(false);
            var current = actors.eligibility().admit(connection, actor.context());
            try (var statement = connection.createStatement()) { statement.execute("SET LOCAL search_path=pg_catalog"); }
            var failure = assertThrows(SQLException.class, () -> queries.authorizationFacts(connection, current, project.projectId(), NOW));
            assertEquals("42P01", failure.getSQLState());
            connection.rollback();
        }
    }

    @Test void autoCommitIsRefusedSoCallerOwnsReadConsistency() throws Exception {
        try (var connection = fixtures.app()) {
            assertThrows(SQLException.class, () -> queries.authorizationFacts(connection,
                    new EligibleActor(java.util.UUID.randomUUID(), fixtures.organizationId()), java.util.UUID.randomUUID(), NOW));
        }
    }

    private ProjectGovernanceQueries.ProjectFacts read(IamTestFixture.SignedInActor actor,
            ProjectPrerequisiteFixture.Project project, Instant now) throws Exception {
        try (var connection = fixtures.app()) {
            connection.setReadOnly(true);
            connection.setAutoCommit(false);
            var current = actors.eligibility().admit(connection, actor.context());
            var result = queries.authorizationFacts(connection, current, project.projectId(), now).orElseThrow();
            connection.rollback();
            return result;
        }
    }

    private String evidenceSnapshot(java.sql.Connection connection) throws SQLException {
        try (var statement = connection.createStatement(); var row = statement.executeQuery(
                "SELECT (SELECT count(*) FROM iam_owner_outcome)||'|'||(SELECT count(*) FROM identity_authorization_decision)"
                + "||'|'||(SELECT count(*) FROM audit_evidence)||'|'||(SELECT max(last_eligible_activity_at) FROM session_record)")) {
            assertTrue(row.next());
            return row.getString(1);
        }
    }
}
