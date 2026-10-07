package com.idea.ddm.identity;

import static org.junit.jupiter.api.Assertions.*;

import com.idea.ddm.iam.IamIntegrationFixtures;
import java.util.UUID;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;

/** Accepted seam: real HTTP sign-in → Server principal → read-only IAM admission on PostgreSQL. */
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class OwnerSessionEligibilityTest {
    private final IamIntegrationFixtures fixtures = new IamIntegrationFixtures();
    private IamSessionFixture http;

    @BeforeAll void startOwnedServer() throws Exception {
        fixtures.createSchema();
        http = new IamSessionFixture(fixtures);
    }

    @AfterAll void stopOwnedServer() {
        if (http != null) http.close();
        // Runner checks terminated JVM and exact owner/source marker before schema cleanup.
    }

    @Test void resolvesActorAndOrganizationFromRealSessionWithoutTrustingClientActorIdOrWritingState() throws Exception {
        var identity = fixtures.identity(IamIntegrationFixtures.Persona.ORDINARY);
        var context = signIn(identity);
        var eligibility = new OwnerSessionEligibility(http.sessions());
        try (var connection = fixtures.app()) {
            connection.setAutoCommit(false);
            connection.setReadOnly(true); // PostgreSQL enforces the read-only authority-query boundary.
            var admitted = eligibility.admit(connection, context);
            assertEquals(identity.actorId(), admitted.actorId());
            assertEquals(identity.organizationId(), admitted.organizationId());
            assertEquals(context.actorId(), admitted.actorId());
            connection.rollback();
        }
    }

    @Test void rawActorIdWithoutAnAuthenticatedSessionCannotEnterOwnerAdmission() throws Exception {
        var identity = fixtures.identity(IamIntegrationFixtures.Persona.ORDINARY);
        var authenticated = signIn(identity);
        assertRefused(new OwnerSessionEligibility(http.sessions()), new ActorContext(authenticated.actorId(), 1));
    }

    @Test void revokedSessionIsRefusedWithoutRefreshingActivity() throws Exception {
        var context = signIn(fixtures.identity(IamIntegrationFixtures.Persona.ORDINARY));
        try (var connection = fixtures.migrator()) {
            AdministratorBootstrap.insert(connection, "UPDATE session_record SET revoked_at=? WHERE session_id=?",
                    java.sql.Timestamp.from(http.clock.instant()), context.sessionId());
        }
        assertRefused(context);
    }

    @Test void changedAccountSecurityVersionMakesOldContextIneligible() throws Exception {
        var identity = fixtures.identity(IamIntegrationFixtures.Persona.ORDINARY);
        var context = signIn(identity);
        try (var connection = fixtures.migrator()) {
            AdministratorBootstrap.insert(connection, "UPDATE idea_account SET security_version=security_version+1 WHERE account_id=?", identity.accountId());
        }
        assertRefused(context);
    }

    @Test void disabledAccountCannotEnterOwnerAdmission() throws Exception {
        var identity = fixtures.identity(IamIntegrationFixtures.Persona.DISABLED);
        var context = signIn(identity);
        try (var connection = fixtures.migrator()) {
            AdministratorBootstrap.insert(connection, "UPDATE idea_account SET status='DISABLED' WHERE account_id=?", identity.accountId());
        }
        assertRefused(context);
    }

    @Test void disabledActorCannotEnterOwnerAdmissionEvenIfAccountIsActive() throws Exception {
        var identity = fixtures.identity(IamIntegrationFixtures.Persona.ORDINARY);
        var context = signIn(identity);
        try (var connection = fixtures.migrator()) {
            AdministratorBootstrap.insert(connection, "UPDATE actor SET disabled_at=? WHERE actor_id=?",
                    java.sql.Timestamp.from(http.clock.instant()), identity.actorId());
        }
        assertRefused(context);
    }

    @Test void idleLifetimeIsHalfOpenAndReadonlyAdmissionDoesNotRefreshIt() throws Exception {
        var context = signIn(fixtures.identity(IamIntegrationFixtures.Persona.ORDINARY));
        http.clock.advance(java.time.Duration.ofHours(2).minusNanos(1000));
        assertAdmitted(context);
        http.clock.advance(java.time.Duration.ofNanos(1000));
        assertRefused(context);
    }

    @Test void absoluteLifetimeRemainsHalfOpenDespiteRecentEligibleActivity() throws Exception {
        var context = signIn(fixtures.identity(IamIntegrationFixtures.Persona.ORDINARY));
        var issued = http.clock.instant();
        try (var connection = fixtures.migrator()) {
            AdministratorBootstrap.insert(connection, "UPDATE session_record SET last_eligible_activity_at=? WHERE session_id=?",
                    java.sql.Timestamp.from(issued.plus(java.time.Duration.ofHours(7))), context.sessionId());
        }
        http.clock.advance(java.time.Duration.ofHours(8).minusNanos(1000));
        assertAdmitted(context);
        http.clock.advance(java.time.Duration.ofNanos(1000));
        assertRefused(context);
    }

    @Test void newRuntimeCannotAdoptPersistedSessionMetadata() throws Exception {
        var context = signIn(fixtures.identity(IamIntegrationFixtures.Persona.ORDINARY));
        assertAdmitted(context);
        var newRuntime = new SessionService(fixtures.appDataSource(), clock);
        assertRefused(new OwnerSessionEligibility(newRuntime), context);
    }

    @Test void ownerAdmissionRequiresAnExplicitCallerTransaction() throws Exception {
        var context = signIn(fixtures.identity(IamIntegrationFixtures.Persona.ORDINARY));
        try (var connection = fixtures.app()) {
            assertThrows(java.sql.SQLException.class,
                    () -> new OwnerSessionEligibility(http.sessions()).admit(connection, context));
        }
    }

    private void assertAdmitted(ActorContext context) throws Exception {
        try (var connection = fixtures.app()) {
            connection.setAutoCommit(false);
            connection.setReadOnly(true);
            var admitted = new OwnerSessionEligibility(http.sessions()).admit(connection, context);
            assertEquals(context.actorId(), admitted.actorId());
            assertEquals(fixtures.organizationId(), admitted.organizationId());
            connection.rollback();
        }
    }
    private void assertRefused(ActorContext context) throws Exception {
        assertRefused(new OwnerSessionEligibility(http.sessions()), context);
    }
    private void assertRefused(OwnerSessionEligibility eligibility, ActorContext context) throws Exception {
        try (var connection = fixtures.app()) {
            connection.setAutoCommit(false);
            connection.setReadOnly(true);
            var refusal = assertThrows(IdentityRefusal.class, () -> eligibility.admit(connection, context));
            assertEquals("INELIGIBLE_SESSION", refusal.reason());
            connection.rollback();
        }
    }

    private ActorContext signIn(IamIntegrationFixtures.Identity identity) throws Exception { return http.signIn(identity); }
}
