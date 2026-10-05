package com.idea.ddm.gateway.receipt;

import com.idea.ddm.gateway.adapter.FilesystemVaultAdapter;
import java.security.PrivateKey;
import java.time.Clock;
import java.util.Map;
import java.util.UUID;

/** Gateway-owned verification evidence; not Server custody publication. */
public final class TransferReceiptSigner {
    private final PrivateKey key; private final String issuer,audience,keyId;private final Clock clock;
    public TransferReceiptSigner(PrivateKey key,String issuer,String audience,String keyId,Clock clock){
        this.key=key;this.issuer=issuer;this.audience=audience;this.keyId=keyId;this.clock=clock;
    }
    public byte[] sign(Map<Integer,byte[]> verifiedGrant,FilesystemVaultAdapter.Completed completed,
            UUID vaultId,UUID receiptId) throws Exception {
        throw new UnsupportedOperationException("RECEIPT_SIGNER_NOT_IMPLEMENTED");
    }
}
