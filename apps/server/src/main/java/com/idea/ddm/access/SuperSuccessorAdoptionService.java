package com.idea.ddm.access;

import java.time.Clock;
import java.util.UUID;
import javax.sql.DataSource;

/** Bounded operator transition only; neither ordinary grant API nor bootstrap/startup behavior. */
public final class SuperSuccessorAdoptionService {
    public static final UUID SUPER_V2 = UUID.fromString("9d80f77e-85a6-4c12-a72d-8ef6b7e0a005");
    public record Request(UUID operationId, UUID organizationId, UUID actorId, UUID loginIdentityId,
            UUID oldAssignmentId, long expectedSecurityVersion, String reason) {}
    public record Result(String state, UUID assignmentId, UUID actorId, UUID organizationId) {}
    public SuperSuccessorAdoptionService(DataSource dataSource, Clock clock) {}
    public Result adopt(Request request, char[] password) {
        throw new UnsupportedOperationException("Successor adoption not implemented");
    }
}
