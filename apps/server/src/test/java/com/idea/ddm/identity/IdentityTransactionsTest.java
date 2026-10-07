package com.idea.ddm.identity;

import static org.junit.jupiter.api.Assertions.*;

import com.idea.ddm.iam.IamIntegrationFixtures;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.UUID;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;

/** Real authenticated owner/UoW seam, PostgreSQL state and required atomic evidence oracle. */
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class IdentityTransactionsTest {
    private final IamIntegrationFixtures fixtures = new IamIntegrationFixtures();
    private IamSessionFixture http;

    @BeforeAll void startOwnedServer() throws Exception { fixtures.createSchema(); http = new IamSessionFixture(fixtures); }
    @AfterAll void stopOwnedServer() { if (http != null) http.close(); }

    @Test void acceptedOwnerStateAndRequiredOutcomeAuthorizationAndAuditCommitTogether() throws Exception {
        var identity = fixtures.identity(IamIntegrationFixtures.Persona.AA_V1);
        var context = http.signIn(identity);
        assignFixtureAuthority(identity);
        var operation = UUID.randomUUID();
        var transactions = new IdentityTransactions(fixtures.appDataSource(), new OwnerSessionEligibility(http.sessions()));
        var result = transactions.executeOwner(context, command(identity, context, operation));
        assertEquals("Synthetic owner committed", result);
        assertEquals(new State("Synthetic owner committed", 1, 2, 1), state(identity, operation));
    }

    @Test void noApplicableAssignmentRefusesBeforeOwnerMutation() throws Exception {
        var identity = fixtures.identity(IamIntegrationFixtures.Persona.ORDINARY);
        var context = http.signIn(identity);
        var operation = UUID.randomUUID();
        var refusal = assertThrows(IdentityRefusal.class, () -> transactions().executeOwner(context, command(identity, context, operation)));
        assertEquals("NO_APPLICABLE_ASSIGNMENT", refusal.reason());
        assertUnchanged(identity, operation);
    }

    @Test void sessionExpiringDuringOwnerWorkRollsBackStateAndAllAcceptedEvidence() throws Exception {
        var identity = fixtures.identity(IamIntegrationFixtures.Persona.AA_V1);
        var context = http.signIn(identity);
        assignFixtureAuthority(identity);
        var operation = UUID.randomUUID();
        var activity = sessionActivity(context);
        var refusal = assertThrows(IdentityRefusal.class, () -> transactions().executeOwner(context,
                command(identity, context, operation, () -> http.clock.advance(java.time.Duration.ofHours(2)))));
        assertEquals("INELIGIBLE_SESSION", refusal.reason());
        assertUnchanged(identity, operation);
        assertEquals(activity, sessionActivity(context));
    }

    @Test void suppressedOwnerOutcomeRollsBackStateAuthorizationAndAudit() throws Exception { forcedEvidenceFailure("iam_owner_outcome", false); }
    @Test void suppressedAuthorizationEvidenceRollsBackStateOutcomeAndAudit() throws Exception { forcedEvidenceFailure("identity_authorization_decision", false); }
    @Test void suppressedAuditRollsBackStateOutcomeAndAuthorization() throws Exception { forcedEvidenceFailure("audit_evidence", false); }
    @Test void deferredCommitFailureAlsoRollsBackEligibleActivityRefresh() throws Exception { forcedEvidenceFailure("audit_evidence", true); }

    @Test void coordinatedSecurityVersionWriteWinsBeforeOwnerCommit() throws Exception { securityWriteWins(false); }
    @Test void coordinatedAssignmentRevocationWinsBeforeOwnerCommit() throws Exception { securityWriteWins(true); }

    @Test void currentExpectedOwnerStateIsRecheckedBeforeCommit() throws Exception {
        var identity = fixtures.identity(IamIntegrationFixtures.Persona.AA_V1);
        var context = http.signIn(identity);
        assignFixtureAuthority(identity);
        var operation = UUID.randomUUID();
        var base = command(identity, context, operation);
        var guarded = new IdentityTransactions.OwnerCommand<String>() {
            @Override public void revalidate(Connection connection, OwnerSessionEligibility.EligibleActor actor) throws SQLException {
                base.revalidate(connection, actor);
                try (var query = connection.prepareStatement("SELECT security_version FROM idea_account WHERE account_id=?")) {
                    query.setObject(1, identity.accountId());
                    try (var row = query.executeQuery()) {
                        if (!row.next() || row.getLong(1) != 1) throw new IdentityRefusal("STALE_ACCOUNT_VERSION");
                    }
                }
            }
            @Override public String apply(Connection connection, OwnerSessionEligibility.EligibleActor actor) throws SQLException {
                var result = base.apply(connection, actor);
                AdministratorBootstrap.insert(connection, "UPDATE idea_account SET security_version=2 WHERE account_id=?", identity.accountId());
                return result;
            }
        };
        var refusal = assertThrows(IdentityRefusal.class, () -> transactions().executeOwner(context, guarded));
        assertEquals("STALE_ACCOUNT_VERSION", refusal.reason());
        assertUnchanged(identity, operation);
    }

    private IdentityTransactions transactions() { return new IdentityTransactions(fixtures.appDataSource(), new OwnerSessionEligibility(http.sessions())); }

    private void forcedEvidenceFailure(String table, boolean deferred) throws Exception {
        var identity = fixtures.identity(IamIntegrationFixtures.Persona.AA_V1);
        var context = http.signIn(identity);
        assignFixtureAuthority(identity);
        var operation = UUID.randomUUID();
        var activity = sessionActivity(context);
        http.clock.advance(java.time.Duration.ofMinutes(30));
        try (var connection = fixtures.migrator(); var statement = connection.createStatement()) {
            statement.execute("CREATE FUNCTION iam_evidence_fault() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN "
                    + "IF NEW.operation_id='" + operation + "'::uuid THEN "
                    + (deferred ? "RAISE EXCEPTION 'Synthetic required commit failure';" : "RETURN NULL;")
                    + " END IF; RETURN NEW; END $$");
            statement.execute((deferred ? "CREATE CONSTRAINT TRIGGER iam_evidence_fault AFTER INSERT ON " : "CREATE TRIGGER iam_evidence_fault BEFORE INSERT ON ")
                    + table + (deferred ? " DEFERRABLE INITIALLY DEFERRED" : "") + " FOR EACH ROW EXECUTE FUNCTION iam_evidence_fault()");
        }
        try {
            assertThrows(IllegalStateException.class, () -> transactions().executeOwner(context, command(identity, context, operation)));
            assertUnchanged(identity, operation);
            assertEquals(activity, sessionActivity(context));
        } finally {
            try (var connection = fixtures.migrator(); var statement = connection.createStatement()) {
                statement.execute("DROP TRIGGER iam_evidence_fault ON " + table);
                statement.execute("DROP FUNCTION iam_evidence_fault()");
            }
        }
    }

    private void securityWriteWins(boolean revokeAssignment) throws Exception {
        var identity = fixtures.identity(IamIntegrationFixtures.Persona.AA_V1);
        var context = http.signIn(identity);
        assignFixtureAuthority(identity);
        var operation = UUID.randomUUID();
        try (var executor = java.util.concurrent.Executors.newSingleThreadExecutor(); var writer = fixtures.migrator()) {
            writer.setAutoCommit(false);
            AdministratorBootstrap.execute(writer, "SELECT pg_advisory_xact_lock(73003002)");
            var owner = executor.submit(() -> transactions().executeOwner(context, command(identity, context, operation)));
            var deadline = System.nanoTime() + java.time.Duration.ofSeconds(10).toNanos();
            boolean waiting = false;
            try {
                while (System.nanoTime() < deadline && !waiting) {
                    try (var statement = writer.createStatement(); var row = statement.executeQuery(
                            "SELECT EXISTS(SELECT 1 FROM pg_locks l JOIN pg_stat_activity a ON a.pid=l.pid "
                            + "WHERE a.datname=current_database() AND a.usename='idea_ddm_app' "
                            + "AND l.locktype='advisory' AND l.classid=0 AND l.objid=73003002 AND NOT l.granted)")) {
                        assertTrue(row.next()); waiting = row.getBoolean(1);
                    }
                    if (!waiting) Thread.sleep(10);
                }
                assertTrue(waiting, "Observe actual PostgreSQL owner wait, not a guessed thread delay");
                if (revokeAssignment) AdministratorBootstrap.insert(writer,
                        "UPDATE identity_role_assignment SET revoked_at=CURRENT_TIMESTAMP WHERE principal_actor_id=?", identity.actorId());
                else AdministratorBootstrap.insert(writer, "UPDATE idea_account SET security_version=2 WHERE account_id=?", identity.accountId());
                writer.commit();
                var failure = assertThrows(java.util.concurrent.ExecutionException.class,
                        () -> owner.get(10, java.util.concurrent.TimeUnit.SECONDS));
                var refusal = assertInstanceOf(IdentityRefusal.class, failure.getCause());
                assertEquals(revokeAssignment ? "NO_APPLICABLE_ASSIGNMENT" : "INELIGIBLE_SESSION", refusal.reason());
                assertUnchanged(identity, operation);
            } finally {
                writer.rollback(); // Release a held lock even if the observation/assertion failed.
                if (!owner.isDone()) owner.cancel(true);
            }
        }
    }

    private java.time.Instant sessionActivity(ActorContext context) throws Exception {
        try (var connection = fixtures.app(); var query = connection.prepareStatement("SELECT last_eligible_activity_at FROM session_record WHERE session_id=?")) {
            query.setObject(1, context.sessionId());
            try (var row = query.executeQuery()) { assertTrue(row.next()); return row.getTimestamp(1).toInstant(); }
        }
    }
    private void assertUnchanged(IamIntegrationFixtures.Identity identity, UUID operation) throws Exception {
        assertEquals(new State(identity.displayName(), 0, 0, 0), state(identity, operation));
    }

    private IdentityTransactions.OwnerCommand<String> command(IamIntegrationFixtures.Identity identity, ActorContext context, UUID operation) {
        return command(identity, context, operation, () -> {});
    }

    private IdentityTransactions.OwnerCommand<String> command(IamIntegrationFixtures.Identity identity, ActorContext context, UUID operation, Runnable afterWrites) {
        return new IdentityTransactions.OwnerCommand<>() {
            @Override public void revalidate(Connection connection, OwnerSessionEligibility.EligibleActor actor) throws SQLException {
                if (!identity.actorId().equals(actor.actorId()) || !identity.organizationId().equals(actor.organizationId())) {
                    throw new IdentityRefusal("INELIGIBLE_SESSION");
                }
                var decision = IdentityAccessPolicy.evaluate(connection, context, identity.organizationId(), "account.create");
                if (!decision.granted()) throw new IdentityRefusal(decision.refusal());
            }
            @Override public String apply(Connection connection, OwnerSessionEligibility.EligibleActor actor) throws SQLException {
                AdministratorBootstrap.insert(connection, "UPDATE actor SET display_name=? WHERE actor_id=?", "Synthetic owner committed", identity.actorId());
                var decision = IdentityAccessPolicy.evaluate(connection, context, identity.organizationId(), "account.create");
                IdentityAccessPolicy.retain(connection, operation, "REQUEST", decision);
                IdentityAccessPolicy.retain(connection, operation, "COMMIT", decision);
                AdministratorBootstrap.record(connection, operation, actor.actorId(), "iam.synthetic.owner-check", identity.accountId().toString(), "ACCEPTED", null);
                afterWrites.run();
                return "Synthetic owner committed";
            }
        };
    }

    private void assignFixtureAuthority(IamIntegrationFixtures.Identity identity) throws Exception {
        try (var connection = fixtures.migrator()) {
            AdministratorBootstrap.insert(connection, "INSERT INTO identity_role_assignment(assignment_id,principal_actor_id,role_version_id,organization_id,assigned_by,reason) VALUES (?,?,?,?,?,?)",
                    UUID.randomUUID(), identity.actorId(), UUID.fromString("9d80f77e-85a6-4c12-a72d-8ef6b7e0a002"),
                    identity.organizationId(), identity.actorId(), "Synthetic legacy AA v1 prerequisite; not a grant API");
        }
    }

    private record State(String displayName, long outcomes, long decisions, long audit) {}
    private State state(IamIntegrationFixtures.Identity identity, UUID operation) throws Exception {
        try (var connection = fixtures.app(); var query = connection.prepareStatement(
                "SELECT display_name,(SELECT count(*) FROM iam_owner_outcome WHERE operation_id=?),"
                + "(SELECT count(*) FROM identity_authorization_decision WHERE operation_id=?),"
                + "(SELECT count(*) FROM audit_evidence WHERE operation_id=?) FROM actor WHERE actor_id=?")) {
            query.setObject(1, operation); query.setObject(2, operation); query.setObject(3, operation); query.setObject(4, identity.actorId());
            try (var row = query.executeQuery()) {
                assertTrue(row.next());
                return new State(row.getString(1), row.getLong(2), row.getLong(3), row.getLong(4));
            }
        }
    }
}
