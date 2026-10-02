package com.idea.ddm.operation;

import static org.junit.jupiter.api.Assertions.*;

import com.idea.ddm.identity.F04SessionFixture;
import com.idea.ddm.identity.OwnerSessionEligibility;
import java.util.UUID;
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
