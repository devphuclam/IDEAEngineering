package com.idea.ddm.access;

import static org.junit.jupiter.api.Assertions.*;

import com.idea.ddm.iam.IamIntegrationFixtures;
import com.idea.ddm.iam.IamTestFixture;
import com.idea.ddm.identity.IdentityAdministration;
import com.idea.ddm.identity.IdentityRefusal;
import com.idea.ddm.project.ProjectGovernanceQueries;
import com.idea.ddm.project.ProjectPrerequisiteFixture;
import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;
import java.util.UUID;
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
            connection.setTransactionIsolation(Connection.TRANSACTION_REPEATABLE_READ);
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
            connection.setTransactionIsolation(Connection.TRANSACTION_REPEATABLE_READ);
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
            connection.setTransactionIsolation(Connection.TRANSACTION_REPEATABLE_READ);
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

    @Test void multiOwnerReadRefusesUncoordinatedStatementSnapshotsInsteadOfReturningAGrant() throws Exception {
        var actor = actors.signIn(IamIntegrationFixtures.Persona.AA_V1);
        var scope = AuthorizationDecisionService.Scope.organization(actor.identity().organizationId());
        roles.actorAssignment(actor.identity(), AuthorizationPrerequisiteFixture.AA_V1, scope, NOW.minusSeconds(1), null);
        try (var connection = fixtures.app()) {
            connection.setTransactionIsolation(Connection.TRANSACTION_READ_COMMITTED);
            connection.setReadOnly(true);
            connection.setAutoCommit(false);
            assertThrows(SQLException.class, () -> policy.evaluate(connection, actor.context(), "account.create", scope));
            connection.rollback();
        }
    }

    @Test void coordinatedOwnerReadCommittedUsesCurrentStateWithoutChangingTheCallerTransaction() throws Exception {
        var actor = actors.signIn(IamIntegrationFixtures.Persona.PA_PROJECT);
        var project = projects.project(actor.identity());
        var scope = AuthorizationDecisionService.Scope.project(project.organizationId(), project.projectId());
        roles.actorAssignment(actor.identity(), AuthorizationPrerequisiteFixture.PA_V1, scope, NOW.minusSeconds(1), null);
        try (var connection = fixtures.app()) {
            connection.setAutoCommit(false);
            try (var statement = connection.createStatement()) { statement.execute("SELECT pg_advisory_xact_lock(73003002)"); }
            assertTrue(policy.evaluate(connection, actor.context(), "project.update", scope).rbacGranted());
            assertEquals(Connection.TRANSACTION_READ_COMMITTED, connection.getTransactionIsolation());
            assertFalse(connection.getAutoCommit());
            connection.rollback();
        }
    }

    @Test void supportedEightRoleProfilesHaveExactlyTheirDeclaredPermissionsAndScopeApplicability() throws Exception {
        var accountV1 = Set.of("account.create", "account.disable", "account.re-enable");
        var accountV2 = Set.of("account.create", "account.disable", "account.re-enable", "account.credential.setup.issue", "account.credential.reset.issue");
        var accountV3 = Set.of("account.read", "account.create", "account.disable", "account.re-enable", "account.credential.setup.issue", "account.credential.reset.issue");
        var superV2 = Set.of("role.catalogue.read", "role.assignment.manage.administration", "role.assignment.manage.highest", "access.inspect", "audit.read");
        var pra = Set.of("role.catalogue.read", "role.definition.prepare", "role.definition.activate", "role.assignment.manage.business", "role.assignment.manage.administration", "access.inspect", "audit.read");
        var pa = Set.of("project.create", "project.admin.read", "project.update", "project.membership.assign", "project.membership.remove", "project.group.create",
                "project.group.update", "project.group.membership.assign", "project.group.membership.remove", "role.catalogue.read", "role.assignment.manage.business", "access.inspect");
        var profiles = List.of(
                new ExpectedRole(AuthorizationPrerequisiteFixture.SUPER_V1, Set.of("role.assign.account-administrator")),
                new ExpectedRole(AuthorizationPrerequisiteFixture.AA_V1, accountV1),
                new ExpectedRole(AuthorizationPrerequisiteFixture.AA_V2, accountV2),
                new ExpectedRole(AuthorizationPrerequisiteFixture.AA_V3, accountV3),
                new ExpectedRole(AuthorizationPrerequisiteFixture.SUPER_V2, superV2),
                new ExpectedRole(AuthorizationPrerequisiteFixture.PRA_V1, pra),
                new ExpectedRole(AuthorizationPrerequisiteFixture.PA_V1, pa),
                new ExpectedRole(AuthorizationPrerequisiteFixture.AUDIT_V1, Set.of("audit.read")));
        var organizationOnly = Set.of("account.read", "account.create", "account.disable", "account.re-enable", "account.credential.setup.issue",
                "account.credential.reset.issue", "project.create", "role.assignment.manage.highest", "role.assign.account-administrator");
        for (var profile : profiles) {
            var actor = actors.signIn(IamIntegrationFixtures.Persona.LINH);
            var project = projects.project(actor.identity());
            var organization = AuthorizationDecisionService.Scope.organization(actor.identity().organizationId());
            var child = AuthorizationDecisionService.Scope.project(project.organizationId(), project.projectId());
            roles.actorAssignment(actor.identity(), profile.role(), organization, NOW.minusSeconds(1), null);
            try (var connection = readTransaction()) {
                for (var permission : PERMISSIONS) {
                    assertEquals(profile.permissions().contains(permission), policy.evaluate(connection, actor.context(), permission, organization).rbacGranted(),
                            "Exact Org profile: " + profile.role() + " / " + permission);
                    assertEquals(profile.permissions().contains(permission) && !organizationOnly.contains(permission),
                            policy.evaluate(connection, actor.context(), permission, child).rbacGranted(), "Exact child applicability: " + profile.role() + " / " + permission);
                }
                connection.rollback();
            }
        }
    }

    @Test void projectScopeNeverBecomesOrganizationAuthorityOrCrossesAnotherProject() throws Exception {
        var actor = actors.signIn(IamIntegrationFixtures.Persona.PA_PROJECT);
        var one = projects.project(actor.identity());
        var two = projects.project(actor.identity());
        var scope = AuthorizationDecisionService.Scope.project(one.organizationId(), one.projectId());
        roles.actorAssignment(actor.identity(), AuthorizationPrerequisiteFixture.PA_V1, scope, NOW.minusSeconds(1), null);
        assertTrue(decide(actor, "project.update", scope, NOW).rbacGranted());
        assertFalse(decide(actor, "project.update", AuthorizationDecisionService.Scope.project(two.organizationId(), two.projectId()), NOW).rbacGranted());
        assertFalse(decide(actor, "project.update", AuthorizationDecisionService.Scope.organization(one.organizationId()), NOW).rbacGranted());
        assertFalse(decide(actor, "project.create", scope, NOW).rbacGranted());
    }

    @Test void assignmentIntervalIsHalfOpenFutureExpiredAndCanonicalRevocationNeverGrant() throws Exception {
        var actor = actors.signIn(IamIntegrationFixtures.Persona.AA_V1);
        var scope = AuthorizationDecisionService.Scope.organization(actor.identity().organizationId());
        var id = roles.actorAssignment(actor.identity(), AuthorizationPrerequisiteFixture.AA_V1, scope, NOW, NOW.plusSeconds(60));
        assertFalse(decide(actor, "account.create", scope, NOW.minusNanos(1000)).rbacGranted());
        assertTrue(decide(actor, "account.create", scope, NOW).rbacGranted());
        assertTrue(decide(actor, "account.create", scope, NOW.plusSeconds(60).minusNanos(1000)).rbacGranted());
        assertFalse(decide(actor, "account.create", scope, NOW.plusSeconds(60)).rbacGranted());
        projects.insert("UPDATE identity_role_assignment SET revoked_at=? WHERE assignment_id=?", NOW, id);
        assertFalse(decide(actor, "account.create", scope, NOW).rbacGranted());
    }

    @Test void noAssignmentUnknownActionAndWrongOrganizationNeverReturnProtectedPaths() throws Exception {
        var actor = actors.signIn(IamIntegrationFixtures.Persona.ORDINARY);
        var scope = AuthorizationDecisionService.Scope.organization(actor.identity().organizationId());
        var refused = decide(actor, "account.create", scope, NOW);
        assertTrue(refused.eligible());
        assertFalse(refused.rbacGranted());
        assertEquals("NO_APPLICABLE_ASSIGNMENT", refused.refusal());
        assertTrue(refused.paths().isEmpty());
        roles.actorAssignment(actor.identity(), AuthorizationPrerequisiteFixture.AA_V1, scope, NOW.minusSeconds(1), null);
        assertFalse(decide(actor, "invented.permission", scope, NOW).rbacGranted());
        var other = decide(actor, "account.create", AuthorizationDecisionService.Scope.organization(UUID.randomUUID()), NOW);
        assertEquals("WRONG_ORGANIZATION_SCOPE", other.refusal());
        assertTrue(other.paths().isEmpty());
    }

    @Test void removingProjectParticipationBlocksDirectAndGroupContentButNotSeparateAdministration() throws Exception {
        var actor = actors.signIn(IamIntegrationFixtures.Persona.LINH);
        var project = projects.project(actor.identity());
        var scope = AuthorizationDecisionService.Scope.project(project.organizationId(), project.projectId());
        var organization = AuthorizationDecisionService.Scope.organization(actor.identity().organizationId());
        var role = roles.participantRole(organization);
        roles.actorAssignment(actor.identity(), role, organization, NOW.minusSeconds(1), null);
        roles.actorAssignment(actor.identity(), AuthorizationPrerequisiteFixture.PA_V1, scope, NOW.minusSeconds(1), null);
        var group = projects.group(project, actor.identity());
        projects.groupMembership(group, actor.identity(), NOW.minusSeconds(1), null);
        roles.groupAssignment(actor.identity(), role, group, NOW.minusSeconds(1), null);
        assertFalse(decide(actor, "project.read", scope, NOW).rbacGranted());
        var membership = projects.projectMembership(project, actor.identity(), NOW.minusSeconds(1), null);
        assertEquals(2, decide(actor, "project.read", scope, NOW).paths().size());
        projects.insert("UPDATE project_membership SET ended_at=?,ended_by=?,end_reason=? WHERE membership_id=?", NOW, actor.identity().actorId(), "Synthetic end", membership);
        assertFalse(decide(actor, "project.read", scope, NOW).rbacGranted());
        assertTrue(decide(actor, "project.update", scope, NOW).rbacGranted());
        assertFalse(decide(actor, "project.read", organization, NOW).rbacGranted());
    }

    @Test void removedExpiredOrOtherProjectGroupDoesNotCancelAnotherPositiveDirectGrant() throws Exception {
        var actor = actors.signIn(IamIntegrationFixtures.Persona.LINH);
        var one = projects.project(actor.identity());
        var two = projects.project(actor.identity());
        projects.projectMembership(one, actor.identity(), NOW.minusSeconds(1), null);
        projects.projectMembership(two, actor.identity(), NOW.minusSeconds(1), null);
        var scope = AuthorizationDecisionService.Scope.project(one.organizationId(), one.projectId());
        var role = roles.participantRole(AuthorizationDecisionService.Scope.organization(one.organizationId()));
        var direct = roles.actorAssignment(actor.identity(), role, scope, NOW.minusSeconds(1), null);
        var group = projects.group(one, actor.identity());
        var membership = projects.groupMembership(group, actor.identity(), NOW.minusSeconds(1), null);
        var groupAssignment = roles.groupAssignment(actor.identity(), role, group, NOW.minusSeconds(1), null);
        var otherGroup = projects.group(two, actor.identity());
        projects.groupMembership(otherGroup, actor.identity(), NOW.minusSeconds(1), null);
        roles.groupAssignment(actor.identity(), role, otherGroup, NOW.minusSeconds(1), null);
        assertEquals(Set.of(direct, groupAssignment), ids(decide(actor, "project.read", scope, NOW)));
        projects.insert("UPDATE group_membership SET ended_at=?,ended_by=?,end_reason=? WHERE membership_id=?", NOW, actor.identity().actorId(), "Synthetic end", membership);
        assertEquals(Set.of(direct), ids(decide(actor, "project.read", scope, NOW)));
        var expired = projects.group(one, actor.identity());
        projects.groupMembership(expired, actor.identity(), NOW.minusSeconds(60), NOW);
        roles.groupAssignment(actor.identity(), role, expired, NOW.minusSeconds(1), null);
        assertEquals(Set.of(direct), ids(decide(actor, "project.read", scope, NOW)));
    }

    @Test void revokedSessionIsCurrentlyIneligibleDespiteRetainedAssignments() throws Exception {
        refuseAfterSecurityChange("UPDATE session_record SET revoked_at=? WHERE actor_id=?", false);
    }
    @Test void staleSecurityVersionIsCurrentlyIneligibleDespiteRetainedAssignments() throws Exception {
        refuseAfterSecurityChange("UPDATE idea_account SET security_version=security_version+1 WHERE actor_id=?", true);
    }
    @Test void disabledAccountIsCurrentlyIneligibleDespiteRetainedAssignments() throws Exception {
        refuseAfterSecurityChange("UPDATE idea_account SET status='DISABLED' WHERE actor_id=?", true);
    }
    @Test void disabledActorIsCurrentlyIneligibleDespiteRetainedAssignments() throws Exception {
        refuseAfterSecurityChange("UPDATE actor SET disabled_at=? WHERE actor_id=?", false);
    }

    @Test void missingAuthenticatedContextAndUnavailableEvidenceCannotProduceAUsableGrant() throws Exception {
        var actor = actors.signIn(IamIntegrationFixtures.Persona.AA_V1);
        var scope = AuthorizationDecisionService.Scope.organization(actor.identity().organizationId());
        roles.actorAssignment(actor.identity(), AuthorizationPrerequisiteFixture.AA_V1, scope, NOW.minusSeconds(1), null);
        try (var connection = readTransaction()) {
            var result = policy.evaluate(connection, null, "account.create", scope);
            assertFalse(result.eligible());
            assertFalse(result.rbacGranted());
            assertTrue(result.paths().isEmpty());
            connection.rollback();
        }
        try (var connection = readTransaction()) {
            try (var statement = connection.createStatement()) { statement.execute("SET LOCAL search_path=pg_catalog"); }
            var exception = assertThrows(SQLException.class, () -> policy.evaluate(connection, actor.context(), "account.create", scope));
            assertEquals("42P01", exception.getSQLState());
            connection.rollback();
        }
    }

    @Test void advisorySnapshotDoesNotBecomeAnAuthorityForTheNextRequest() throws Exception {
        var actor = actors.signIn(IamIntegrationFixtures.Persona.AA_V1);
        var scope = AuthorizationDecisionService.Scope.organization(actor.identity().organizationId());
        var id = roles.actorAssignment(actor.identity(), AuthorizationPrerequisiteFixture.AA_V1, scope, NOW.minusSeconds(1), null);
        try (var snapshot = readTransaction()) {
            var original = policy.evaluate(snapshot, actor.context(), "account.create", scope);
            assertTrue(original.rbacGranted());
            projects.insert("UPDATE identity_role_assignment SET revoked_at=? WHERE assignment_id=?", NOW, id);
            assertTrue(policy.evaluate(snapshot, actor.context(), "account.create", scope).rbacGranted());
            snapshot.rollback();
            assertThrows(UnsupportedOperationException.class, () -> original.paths().clear());
        }
        assertFalse(decide(actor, "account.create", scope, NOW).rbacGranted());
    }

    @Test void legacyAccountAdapterAlsoRefusesFutureEffectiveAssignmentRatherThanKeepingAParallelPolicy() throws Exception {
        var actor = actors.signIn(IamIntegrationFixtures.Persona.AA_V1);
        var scope = AuthorizationDecisionService.Scope.organization(actor.identity().organizationId());
        final Instant future;
        try (var connection = fixtures.app(); var statement = connection.createStatement(); var row = statement.executeQuery("SELECT CURRENT_TIMESTAMP")) {
            assertTrue(row.next());
            future = row.getTimestamp(1).toInstant().plusSeconds(86400);
        }
        roles.actorAssignment(actor.identity(), AuthorizationPrerequisiteFixture.AA_V1, scope, future, null);
        var accounts = new IdentityAdministration(fixtures.appDataSource()); // historical internal service boundary, not new HTTP authorization
        var refusal = assertThrows(IdentityRefusal.class, () -> accounts.create(actor.context(), UUID.randomUUID(),
                actor.identity().organizationId(), "Synthetic future target", "synthetic.future." + UUID.randomUUID()));
        assertEquals("NO_APPLICABLE_ASSIGNMENT", refusal.reason());
    }

    @Test void legacyGrantRecheckUsesCurrentTimeRatherThanFrozenTransactionStart() throws Exception {
        var actor = actors.signIn(IamIntegrationFixtures.Persona.AA_V1);
        var scope = AuthorizationDecisionService.Scope.organization(actor.identity().organizationId());
        try (var connection = fixtures.app()) {
            connection.setAutoCommit(false); // READ COMMITTED, as the existing Identity command seam
            var eligible = actors.eligibility().admit(connection, actor.context());
            final Instant from;
            try (var statement = connection.createStatement(); var row = statement.executeQuery("SELECT CURRENT_TIMESTAMP")) {
                assertTrue(row.next());
                from = row.getTimestamp(1).toInstant().plusNanos(1000);
            }
            var assignment = roles.actorAssignment(actor.identity(), AuthorizationPrerequisiteFixture.AA_V1, scope, from, null);
            try (var query = connection.prepareStatement("SELECT clock_timestamp()>?")) {
                query.setTimestamp(1, java.sql.Timestamp.from(from));
                try (var row = query.executeQuery()) { assertTrue(row.next()); assertTrue(row.getBoolean(1), "Current time precondition"); }
            }
            assertEquals(Set.of(assignment), AuthorizationDecisionService.organizationGrants(connection, eligible, "account.create").stream()
                    .map(AuthorizationDecisionService.GrantPath::assignmentId).collect(Collectors.toSet()));
            connection.rollback();
        }
    }

    private void refuseAfterSecurityChange(String sql, boolean oneParameter) throws Exception {
        var actor = actors.signIn(IamIntegrationFixtures.Persona.AA_V1);
        var scope = AuthorizationDecisionService.Scope.organization(actor.identity().organizationId());
        roles.actorAssignment(actor.identity(), AuthorizationPrerequisiteFixture.AA_V1, scope, NOW.minusSeconds(1), null);
        assertTrue(decide(actor, "account.create", scope, NOW).rbacGranted());
        if (oneParameter) projects.insert(sql, actor.identity().actorId());
        else projects.insert(sql, NOW, actor.identity().actorId());
        var result = decide(actor, "account.create", scope, NOW);
        assertFalse(result.eligible());
        assertFalse(result.rbacGranted());
        assertTrue(result.paths().isEmpty());
    }

    private Connection readTransaction() throws Exception {
        var connection = fixtures.app();
        connection.setTransactionIsolation(Connection.TRANSACTION_REPEATABLE_READ);
        connection.setReadOnly(true);
        connection.setAutoCommit(false);
        return connection;
    }
    private AuthorizationDecisionService.Decision decide(IamTestFixture.SignedInActor actor, String permission,
            AuthorizationDecisionService.Scope scope, Instant at) throws Exception {
        var current = new AuthorizationDecisionService(actors.eligibility(), new ProjectGovernanceQueries(), Clock.fixed(at, ZoneOffset.UTC));
        try (var connection = readTransaction()) {
            var result = current.evaluate(connection, actor.context(), permission, scope);
            connection.rollback();
            return result;
        }
    }
    private static Set<UUID> ids(AuthorizationDecisionService.Decision result) {
        return result.paths().stream().map(AuthorizationDecisionService.GrantPath::assignmentId).collect(Collectors.toSet());
    }
    private record ExpectedRole(UUID role, Set<String> permissions) {}
    private static final Set<String> PERMISSIONS = Set.of(
            "account.read", "account.create", "account.disable", "account.re-enable", "account.credential.setup.issue", "account.credential.reset.issue",
            "project.create", "project.admin.read", "project.update", "project.membership.assign", "project.membership.remove", "project.group.create", "project.group.update",
            "project.group.membership.assign", "project.group.membership.remove", "project.read", "role.catalogue.read", "role.definition.prepare", "role.definition.activate",
            "role.assignment.manage.business", "role.assignment.manage.administration", "role.assignment.manage.highest", "access.inspect", "audit.read", "role.assign.account-administrator");
}
