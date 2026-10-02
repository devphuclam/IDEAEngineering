package com.idea.ddm.operation;

import static org.junit.jupiter.api.Assertions.*;

import com.idea.ddm.identity.F04SessionFixture;
import com.idea.ddm.identity.OwnerSessionEligibility;
import com.idea.ddm.identity.IdentityRefusal;
import java.util.UUID;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;

/** Approved T023-B seam: actual HTTP authentication -> internal owner -> retained SQL witnesses. */
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class OwnerOutcomeTest {
    private F04SessionFixture fixture;

    @BeforeAll void prepareOnlyTheRunsOwnedSchemaAndServer() throws Exception {
        F04SchemaTest.createOnlyThisRunsMigratorOwnedSchema("latest");
        fixture = new F04SessionFixture();
    }

    @AfterAll void stopOwnedServerBeforeOuterRunnerCleanup() {
        if (fixture != null) fixture.close();
    }

    @Test void realSignInCapturesServerPrincipalRatherThanClientActorId() throws Exception {
        var signedIn = fixture.signInThroughRealHttp();
        assertEquals(signedIn.expectedActorId(), signedIn.context().actorId());
        assertEquals(1, signedIn.context().securityVersion());
    }

    @Test void freshSessionResolvesOriginalAcceptedWithoutCompanionDuplicates() throws Exception {
        var first = fixture.signInThroughRealHttp();
        var operation = UUID.randomUUID();
        var owner = new SampleOwnerCommandService(fixture.appDataSource(), new OwnerSessionEligibility(fixture.sessions()));
        var original = owner.execute(first.context(), new SampleOwnerCommandService.Command(
                operation, "f04-c-original", SampleOwnerCommandService.BusinessDecision.ACCEPT));
        var retry = fixture.signInThroughRealHttp();
        assertTrue(retry.hasDifferentSessionFrom(first));
        assertEquals(first.expectedActorId(), retry.expectedActorId());
        var resolved = owner.execute(retry.context(), new SampleOwnerCommandService.Command(
                operation, "f04-c-retry-must-not-overwrite", SampleOwnerCommandService.BusinessDecision.REFUSE));
        assertEquals(original, resolved, "Resolve the exact canonical terminal result, not the retry decision");
        assertCompanions(operation, 1, 1, 1);
        System.out.println("F04_REPLAY=ACCEPTED; OP=" + operation + "; ACTOR=" + original.actorId()
                + "; ORG=" + original.organizationId() + "; ORIGINAL_SESSION_REFERENCE=" + first.sessionReference()
                + "; RETRY_SESSION_REFERENCE=" + retry.sessionReference() + "; ORIGINAL_CORRELATION=" + original.correlationId()
                + "; RETRY_CORRELATION=f04-c-retry-must-not-overwrite; EVENT=" + original.eventId());
    }

    private static void assertCompanions(UUID operation, int owners, int audits, int events) throws Exception {
        try (var connection = F04SchemaTest.open("app"); var query = connection.prepareStatement(
                "SELECT (SELECT count(*) FROM sample_owner_operation WHERE operation_id=?),"
                + "(SELECT count(*) FROM audit_evidence WHERE operation_id=?),"
                + "(SELECT count(*) FROM owner_committed_event WHERE operation_id=?)")) {
            for (int parameter = 1; parameter <= 3; parameter++) query.setObject(parameter, operation);
            try (var row = query.executeQuery()) {
                assertTrue(row.next());
                assertEquals(owners, row.getInt(1));
                assertEquals(audits, row.getInt(2));
                assertEquals(events, row.getInt(3));
            }
        }
    }

    @Test void freshSessionResolvesTerminalRefusalDespiteChangedDecision() throws Exception {
        var first = fixture.signInThroughRealHttp();
        var operation = UUID.randomUUID();
        var owner = new SampleOwnerCommandService(fixture.appDataSource(), new OwnerSessionEligibility(fixture.sessions()));
        var original = owner.execute(first.context(), new SampleOwnerCommandService.Command(
                operation, "f04-c-original-refusal", SampleOwnerCommandService.BusinessDecision.REFUSE));
        var retry = fixture.signInThroughRealHttp();
        assertTrue(retry.hasDifferentSessionFrom(first));
        assertEquals(original, owner.execute(retry.context(), new SampleOwnerCommandService.Command(
                operation, "f04-c-retry-accept", SampleOwnerCommandService.BusinessDecision.ACCEPT)));
        assertEquals(SampleOwnerCommandService.Outcome.REFUSED, original.outcome());
        assertCompanions(operation, 1, 1, 0);
    }

    @Test void otherActorAndRevokedSessionCannotDiscloseEitherTerminalOutcome() throws Exception {
        var originalSession = fixture.signInThroughRealHttp();
        var other = fixture.signInSecondActorInSameOrganization();
        assertNotEquals(originalSession.expectedActorId(), other.expectedActorId());
        assertEquals(originalSession.expectedOrganizationId(), other.expectedOrganizationId());
        var owner = new SampleOwnerCommandService(fixture.appDataSource(), new OwnerSessionEligibility(fixture.sessions()));
        var operations = new java.util.ArrayList<UUID>();
        for (var decision : SampleOwnerCommandService.BusinessDecision.values()) {
            var operation = UUID.randomUUID();
            operations.add(operation);
            var original = owner.execute(originalSession.context(), new SampleOwnerCommandService.Command(
                    operation, "f04-c-access-original", decision));
            var refusal = assertThrows(SampleOwnerCommandService.ResultAccessRefusal.class,
                    () -> owner.execute(other.context(), new SampleOwnerCommandService.Command(operation,
                            "f04-c-unauthorized-retry", SampleOwnerCommandService.BusinessDecision.ACCEPT)));
            assertEquals("Sample result unavailable to this caller", refusal.getMessage());
            assertNull(refusal.getCause(), "Refusal cannot wrap original protected result details");
            assertEquals(0, refusal.getSuppressed().length);
            assertCompanions(operation, 1, 1, original.eventId() == null ? 0 : 1);
            assertEquals(original, owner.execute(originalSession.context(), new SampleOwnerCommandService.Command(
                    operation, "f04-c-authorized-confirmation", SampleOwnerCommandService.BusinessDecision.ACCEPT)));
        }
        fixture.revokeOnlyThisSession(originalSession);
        for (var operation : operations) {
            assertThrows(IdentityRefusal.class, () -> owner.execute(originalSession.context(),
                    new SampleOwnerCommandService.Command(operation, "f04-c-revoked-retry",
                            SampleOwnerCommandService.BusinessDecision.ACCEPT)));
        }
        assertCompanions(operations.get(0), 1, 1, 1);
        assertCompanions(operations.get(1), 1, 1, 0);
    }

    @Test void concurrentAcceptsResolveOneCanonicalWinner() throws Exception {
        assertConcurrentCanonical(SampleOwnerCommandService.BusinessDecision.ACCEPT);
    }

    @Test void concurrentAcceptAndRefuseResolveOneCanonicalWinner() throws Exception {
        assertConcurrentCanonical(SampleOwnerCommandService.BusinessDecision.REFUSE);
    }

    @Test void refusalHandoffRetainsOperationLockUntilRefusalAuditCommits() throws Exception {
        var session = fixture.signInThroughRealHttp();
        var operation = UUID.randomUUID();
        var owner = new SampleOwnerCommandService(fixture.appDataSource(), new OwnerSessionEligibility(fixture.sessions()));
        var executor = Executors.newFixedThreadPool(2);
        try (var blocker = F04SchemaTest.open("migration")) {
            try (var statement = blocker.createStatement()) {
                statement.execute("CREATE FUNCTION f04_c_handoff() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN "
                        + "IF NEW.operation_id='" + operation + "'::uuid AND NEW.outcome='REFUSED' THEN "
                        + "PERFORM pg_advisory_xact_lock(73004991," + operation.hashCode() + "); END IF; RETURN NEW; END; $$");
                statement.execute("CREATE TRIGGER f04_c_handoff BEFORE INSERT ON sample_owner_operation "
                        + "FOR EACH ROW EXECUTE FUNCTION f04_c_handoff()");
            }
            try {
                advisory(blocker, "pg_advisory_lock", 73004991, operation.hashCode());
                var refused = executor.submit(() -> owner.execute(session.context(), new SampleOwnerCommandService.Command(
                        operation, "f04-handoff-refused", SampleOwnerCommandService.BusinessDecision.REFUSE)));
                awaitWaiters(blocker, 73004991, operation, 1); // REFUSED insert is after the actual rollback handoff.
                var accept = executor.submit(() -> owner.execute(session.context(), new SampleOwnerCommandService.Command(
                        operation, "f04-handoff-loser", SampleOwnerCommandService.BusinessDecision.ACCEPT)));
                awaitOperationWaiters(blocker, operation, 1);
                advisory(blocker, "pg_advisory_unlock", 73004991, operation.hashCode());
                var canonical = refused.get(8, TimeUnit.SECONDS);
                assertEquals(SampleOwnerCommandService.Outcome.REFUSED, canonical.outcome());
                assertEquals(canonical, accept.get(8, TimeUnit.SECONDS));
                assertCompanions(operation, 1, 1, 0);
                assertOperationUnlocked(operation);
            } finally {
                advisory(blocker, "pg_advisory_unlock", 73004991, operation.hashCode());
                executor.shutdownNow();
                assertTrue(executor.awaitTermination(10, TimeUnit.SECONDS));
                try (var statement = blocker.createStatement()) {
                    statement.execute("DROP TRIGGER f04_c_handoff ON sample_owner_operation");
                    statement.execute("DROP FUNCTION f04_c_handoff()");
                }
            }
        } finally { executor.shutdownNow(); }
    }

    private void assertConcurrentCanonical(SampleOwnerCommandService.BusinessDecision secondDecision) throws Exception {
        var first = fixture.signInThroughRealHttp();
        var second = fixture.signInThroughRealHttp();
        var operation = UUID.randomUUID();
        var owner = new SampleOwnerCommandService(fixture.appDataSource(), new OwnerSessionEligibility(fixture.sessions()));
        var ready = new CountDownLatch(2);
        var start = new CountDownLatch(1);
        var executor = Executors.newFixedThreadPool(2);
        try (var blocker = F04SchemaTest.open("migration")) {
            advisory(blocker, "pg_advisory_lock", operation.hashCode());
            var a = executor.submit(() -> {
                ready.countDown();
                assertTrue(start.await(3, TimeUnit.SECONDS));
                return owner.execute(first.context(), new SampleOwnerCommandService.Command(operation,
                        "f04-concurrent-a", SampleOwnerCommandService.BusinessDecision.ACCEPT));
            });
            var b = executor.submit(() -> {
                ready.countDown();
                assertTrue(start.await(3, TimeUnit.SECONDS));
                return owner.execute(second.context(), new SampleOwnerCommandService.Command(operation,
                        "f04-concurrent-b", secondDecision));
            });
            try {
                assertTrue(ready.await(3, TimeUnit.SECONDS));
                start.countDown();
                awaitOperationWaiters(blocker, operation, 2);
                // A different ID commits while both same-ID callers are blocked; no global owner mutex.
                UUID unrelated;
                do { unrelated = UUID.randomUUID(); } while (unrelated.hashCode() == operation.hashCode());
                var independent = owner.execute(first.context(), new SampleOwnerCommandService.Command(unrelated,
                        "f04-unrelated-id", SampleOwnerCommandService.BusinessDecision.ACCEPT));
                assertEquals(SampleOwnerCommandService.Outcome.ACCEPTED, independent.outcome());
                advisory(blocker, "pg_advisory_unlock", operation.hashCode());
                var winner = a.get(8, TimeUnit.SECONDS);
                assertEquals(winner, b.get(8, TimeUnit.SECONDS), "Both callers resolve the same persisted winner");
                assertTrue(java.util.Set.of("f04-concurrent-a", "f04-concurrent-b").contains(winner.correlationId()));
                assertCompanions(operation, 1, 1, winner.outcome() == SampleOwnerCommandService.Outcome.ACCEPTED ? 1 : 0);
                assertOperationUnlocked(operation);
                System.out.println("F04_CONCURRENCY=" + secondDecision + "; OP=" + operation + "; WINNER="
                        + winner.outcome() + "; CORRELATION=" + winner.correlationId() + "; EVENT=" + winner.eventId());
            } finally {
                start.countDown();
                advisory(blocker, "pg_advisory_unlock", operation.hashCode());
            }
        } finally {
            executor.shutdownNow();
            assertTrue(executor.awaitTermination(10, TimeUnit.SECONDS));
        }
    }

    private static void awaitOperationWaiters(Connection observer, UUID operation, int expected) throws Exception {
        awaitWaiters(observer, 73004001, operation, expected);
    }

    private static void awaitWaiters(Connection observer, int namespace, UUID operation, int expected) throws Exception {
        long deadline = System.nanoTime() + TimeUnit.SECONDS.toNanos(3);
        try (var query = observer.prepareStatement("SELECT count(*) FROM pg_locks WHERE locktype='advisory' "
                + "AND classid=? AND objid::bigint=? AND objsubid=2 AND NOT granted")) {
            query.setInt(1, namespace);
            query.setLong(2, Integer.toUnsignedLong(operation.hashCode()));
            query.setQueryTimeout(2);
            while (System.nanoTime() < deadline) {
                try (var row = query.executeQuery()) { row.next(); if (row.getInt(1) == expected) return; }
                Thread.onSpinWait(); // Observe actual PostgreSQL contention, never schedule with a sleep.
            }
        }
        fail("Both actual owner connections must reach the held per-operation PostgreSQL lock");
    }

    private static boolean advisory(Connection connection, String function, int key) throws Exception {
        return advisory(connection, function, 73004001, key);
    }

    private static boolean advisory(Connection connection, String function, int namespace, int key) throws Exception {
        assertTrue(java.util.Set.of("pg_advisory_lock", "pg_advisory_unlock", "pg_try_advisory_lock").contains(function));
        try (var query = connection.prepareStatement("SELECT " + function + "(?,?)")) {
            query.setInt(1, namespace);
            query.setInt(2, key);
            query.setQueryTimeout(3);
            try (var row = query.executeQuery()) {
                assertTrue(row.next());
                return function.equals("pg_advisory_lock") || row.getBoolean(1);
            }
        }
    }

    private static void assertOperationUnlocked(UUID operation) throws Exception {
        try (var observer = F04SchemaTest.open("migration")) {
            assertTrue(advisory(observer, "pg_try_advisory_lock", operation.hashCode()), "No attempt lock leaked");
            assertTrue(advisory(observer, "pg_advisory_unlock", operation.hashCode()));
        }
    }

    @Test void requiredAuditFailureRollsBackAllCompanionsThenSameIdCanCommit() throws Exception {
        var session = fixture.signInThroughRealHttp();
        var operation = UUID.randomUUID();
        var owner = new SampleOwnerCommandService(fixture.appDataSource(), new OwnerSessionEligibility(fixture.sessions()));
        try (var fault = installAppendFailure(operation, "audit_evidence")) {
            var failure = assertThrows(SQLException.class, () -> owner.execute(session.context(),
                    new SampleOwnerCommandService.Command(operation, "f04-c-audit-failed",
                            SampleOwnerCommandService.BusinessDecision.ACCEPT)));
            assertEquals("P0001", failure.getSQLState());
            assertCompanions(operation, 0, 0, 0); // Independent committed-state observer confirms non-commit.
            assertOperationUnlocked(operation);
        }
        var committed = owner.execute(session.context(), new SampleOwnerCommandService.Command(operation,
                "f04-c-after-confirmed-rollback", SampleOwnerCommandService.BusinessDecision.ACCEPT));
        assertEquals("f04-c-after-confirmed-rollback", committed.correlationId());
        assertCompanions(operation, 1, 1, 1);
        assertEquals(committed, owner.execute(session.context(), new SampleOwnerCommandService.Command(operation,
                "f04-c-later-replay", SampleOwnerCommandService.BusinessDecision.REFUSE)));
        assertCompanions(operation, 1, 1, 1);
        System.out.println("F04_CONFIRMED_ROLLBACK_RETRY=PASS; OP=" + operation + "; ACTOR=" + committed.actorId()
                + "; FAILED_CORRELATION=f04-c-audit-failed; COMMITTED_CORRELATION=" + committed.correlationId());
    }

    private static AutoCloseable installAppendFailure(UUID operation, String table) throws Exception {
        assertTrue(java.util.Set.of("audit_evidence", "owner_committed_event").contains(table));
        try (var connection = F04SchemaTest.open("migration"); var statement = connection.createStatement()) {
            statement.execute("CREATE FUNCTION f04_c_fault() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN "
                    + "IF NEW.operation_id='" + operation + "'::uuid THEN RAISE EXCEPTION 'Controlled F04 failure' "
                    + "USING ERRCODE='P0001'; END IF; RETURN NEW; END; $$");
            statement.execute("CREATE TRIGGER f04_c_fault BEFORE INSERT ON " + table
                    + " FOR EACH ROW EXECUTE FUNCTION f04_c_fault()");
        }
        return () -> {
            try (var connection = F04SchemaTest.open("migration"); var statement = connection.createStatement()) {
                statement.execute("DROP TRIGGER f04_c_fault ON " + table);
                statement.execute("DROP FUNCTION f04_c_fault()");
            }
        };
    }

    @Test void acceptedCommandRetainsAuthenticatedProvenanceAcrossOwnerAuditAndEvent() throws Exception {
        var signedIn = fixture.signInThroughRealHttp();
        var operation = UUID.randomUUID();
        String correlation = "f04-accepted-original-correlation";
        var owner = new SampleOwnerCommandService(fixture.appDataSource(), new OwnerSessionEligibility(fixture.sessions()));
        var result = owner.execute(signedIn.context(), new SampleOwnerCommandService.Command(
                operation, correlation, SampleOwnerCommandService.BusinessDecision.ACCEPT));

        assertEquals(operation, result.operationId());
        assertEquals(signedIn.expectedActorId(), result.actorId());
        assertEquals(signedIn.expectedOrganizationId(), result.organizationId());
        assertEquals(correlation, result.correlationId());
        assertEquals(SampleOwnerCommandService.Outcome.ACCEPTED, result.outcome());
        assertNull(result.reasonCode());
        assertNotNull(result.eventId());
        assertNotEquals(operation, result.eventId(), "An event occurrence is not the operation identity");

        try (var connection = F04SchemaTest.open("app")) {
            try (var query = connection.prepareStatement("SELECT actor_id,organization_id,command_kind,correlation_id,"
                    + "outcome,reason_code FROM sample_owner_operation WHERE operation_id=?")) {
                query.setObject(1, operation);
                try (var row = query.executeQuery()) {
                    assertTrue(row.next());
                    assertEquals(signedIn.expectedActorId(), row.getObject(1, UUID.class));
                    assertEquals(signedIn.expectedOrganizationId(), row.getObject(2, UUID.class));
                    assertEquals("SYNTHETIC_SAMPLE_COMMAND", row.getString(3));
                    assertEquals(correlation, row.getString(4));
                    assertEquals("ACCEPTED", row.getString(5));
                    assertNull(row.getString(6));
                    assertFalse(row.next(), "Exactly one authoritative owner result");
                }
            }
            try (var query = connection.prepareStatement("SELECT actor_id,action,target_type,target_id,outcome,"
                    + "reason_code,correlation_id FROM audit_evidence WHERE operation_id=?")) {
                query.setObject(1, operation);
                try (var row = query.executeQuery()) {
                    assertTrue(row.next());
                    assertEquals(signedIn.expectedActorId(), row.getObject(1, UUID.class));
                    assertEquals("sample.command", row.getString(2));
                    assertEquals("SampleOwnerOperation", row.getString(3));
                    assertEquals(operation.toString(), row.getString(4));
                    assertEquals("ACCEPTED", row.getString(5));
                    assertNull(row.getString(6));
                    assertEquals(correlation, row.getString(7));
                    assertFalse(row.next(), "Exactly one required owner Audit");
                }
            }
            try (var query = connection.prepareStatement("SELECT event_id,producer_owner,organization_id,event_kind,"
                    + "contract_version,actor_id,correlation_id,recorded_at FROM owner_committed_event WHERE operation_id=?")) {
                query.setObject(1, operation);
                try (var row = query.executeQuery()) {
                    assertTrue(row.next());
                    assertEquals(result.eventId(), row.getObject(1, UUID.class));
                    assertEquals("PH1_SAMPLE_OWNER", row.getString(2));
                    assertEquals(signedIn.expectedOrganizationId(), row.getObject(3, UUID.class));
                    assertEquals("OPERATION_ACCEPTED", row.getString(4));
                    assertEquals(1, row.getInt(5));
                    assertEquals(signedIn.expectedActorId(), row.getObject(6, UUID.class));
                    assertEquals(correlation, row.getString(7));
                    assertNotNull(row.getTimestamp(8), "DB records the committed envelope timestamp");
                    assertFalse(row.next(), "Exactly one committed sample event");
                }
            }
        }
    }

    @Test void businessRefusalRetainsOwnerAndRequiredAuditButNoCommittedEvent() throws Exception {
        var signedIn = fixture.signInThroughRealHttp();
        var operation = UUID.randomUUID();
        String correlation = "f04-refused-original-correlation";
        var owner = new SampleOwnerCommandService(fixture.appDataSource(), new OwnerSessionEligibility(fixture.sessions()));
        var result = owner.execute(signedIn.context(), new SampleOwnerCommandService.Command(
                operation, correlation, SampleOwnerCommandService.BusinessDecision.REFUSE));
        assertEquals(operation, result.operationId());
        assertEquals(signedIn.expectedActorId(), result.actorId());
        assertEquals(signedIn.expectedOrganizationId(), result.organizationId());
        assertEquals(correlation, result.correlationId());
        assertEquals(SampleOwnerCommandService.Outcome.REFUSED, result.outcome());
        assertEquals("SYNTHETIC_BUSINESS_REFUSAL", result.reasonCode());
        assertNull(result.eventId(), "Business refusal is not a committed change event");

        try (var connection = F04SchemaTest.open("app")) {
            try (var query = connection.prepareStatement("SELECT o.actor_id,o.organization_id,o.correlation_id,o.outcome,"
                    + "o.reason_code,a.actor_id,a.correlation_id,a.outcome,a.reason_code,a.action,a.target_type,a.target_id "
                    + "FROM sample_owner_operation o JOIN audit_evidence a USING(operation_id) WHERE o.operation_id=?")) {
                query.setObject(1, operation);
                try (var row = query.executeQuery()) {
                    assertTrue(row.next(), "Durable refusal must have its required Audit companion");
                    assertEquals(signedIn.expectedActorId(), row.getObject(1, UUID.class));
                    assertEquals(signedIn.expectedOrganizationId(), row.getObject(2, UUID.class));
                    assertEquals(correlation, row.getString(3));
                    assertEquals("REFUSED", row.getString(4));
                    assertEquals("SYNTHETIC_BUSINESS_REFUSAL", row.getString(5));
                    assertEquals(signedIn.expectedActorId(), row.getObject(6, UUID.class));
                    assertEquals(correlation, row.getString(7));
                    assertEquals("REFUSED", row.getString(8));
                    assertEquals("SYNTHETIC_BUSINESS_REFUSAL", row.getString(9));
                    assertEquals("sample.command", row.getString(10));
                    assertEquals("SampleOwnerOperation", row.getString(11));
                    assertEquals(operation.toString(), row.getString(12));
                    assertFalse(row.next(), "No duplicate refusal/Audit companion");
                }
            }
            try (var query = connection.prepareStatement("SELECT count(*) FROM owner_committed_event WHERE operation_id=?")) {
                query.setObject(1, operation);
                try (var row = query.executeQuery()) {
                    assertTrue(row.next());
                    assertEquals(0, row.getInt(1), "REFUSED must never emit the sample accepted event");
                }
            }
        }
    }
}
