package com.idea.ddm.custody;

import com.idea.ddm.identity.ActorContext;
import com.idea.ddm.identity.OwnerSessionEligibility;
import javax.sql.DataSource;
import java.sql.Connection;
import java.security.PublicKey;
import java.time.Clock;
import java.util.UUID;

/** Internal authoritative custody seam, deliberately not a product permission-free route. */
public final class TransferReceiptService {
    public record Allocation(UUID vaultId,UUID locationId,String adapterKey) {}
    public record Accepted(UUID operationId,UUID transferId,UUID receiptId,UUID artifactId,UUID vaultId,UUID locationId) {}
    @FunctionalInterface public interface OwnerAllocation {
        Allocation require(Connection connection,OwnerSessionEligibility.EligibleActor actor,TransferGrantService.Scope scope,UUID receiptLocation) throws Exception;
    }
    public TransferReceiptService(DataSource source,OwnerSessionEligibility eligibility,OwnerAllocation owner,
            Clock clock,PublicKey gatewayKey,String issuer,String audience,String keyId) {}
    public Accepted accept(ActorContext context,byte[] receipt) {throw new IllegalStateException("RECEIPT_ACCEPTANCE_NOT_IMPLEMENTED");}
}
