package com.idea.ddm.custody;

import com.idea.ddm.identity.ActorContext;
import com.idea.ddm.identity.OwnerSessionEligibility;
import java.security.PrivateKey;
import java.sql.Connection;
import java.time.Clock;
import java.util.UUID;
import javax.sql.DataSource;

/** G01 compilable seam only; not exposed/configured as a product endpoint. Behavior remains RED. */
public final class TransferGrantService {
    public record Scope(UUID operationId, UUID correlationId, UUID vaultId, UUID gatewayId,
            String endpoint, int objectKind, UUID objectId, long byteCount, String digest,
            long rangeStart, long rangeEnd) {}
    public record Grant(UUID grantId, UUID transferId, UUID operationId, UUID actorId, UUID organizationId,
            Scope scope, long issuedAt, long expiresAt, byte[] frame) {}
    @FunctionalInterface
    public interface OwnerAdmission {
        void require(Connection connection, OwnerSessionEligibility.EligibleActor actor, Scope scope) throws Exception;
    }
    public TransferGrantService(DataSource source, OwnerSessionEligibility eligibility, OwnerAdmission owner,
            Clock clock, PrivateKey key, String issuer, String audience, String keyId) {}
    public Grant issue(ActorContext context, Scope scope) {
        throw new UnsupportedOperationException("GRANT_ISSUANCE_NOT_IMPLEMENTED");
    }
    public Grant resolve(ActorContext context, UUID operationId) {
        throw new UnsupportedOperationException("GRANT_RESOLUTION_NOT_IMPLEMENTED");
    }
}
