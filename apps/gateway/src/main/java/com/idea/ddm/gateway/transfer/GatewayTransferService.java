package com.idea.ddm.gateway.transfer;

import com.idea.ddm.gateway.adapter.FilesystemVaultAdapter;
import com.idea.ddm.gateway.security.TransferGrantVerifier;
import com.idea.ddm.gateway.receipt.TransferReceiptSigner;
import java.io.InputStream;
import java.nio.file.Path;
import java.util.UUID;

/** Private candidate orchestration, never authoritative Server custody. */
public final class GatewayTransferService {
    public record Result(long verifiedBytes,byte[] receipt){
        public Result{receipt=receipt==null?null:receipt.clone();}
        @Override public byte[] receipt(){return receipt==null?null:receipt.clone();}
        @Override public String toString(){return "GatewayResult[redacted]";}
    }
    private final TransferGrantVerifier verifier;private final TransferReceiptSigner signer;
    private final FilesystemVaultAdapter adapter;private final UUID vaultId;private final Path state;
    public GatewayTransferService(TransferGrantVerifier verifier,TransferReceiptSigner signer,
            FilesystemVaultAdapter adapter,UUID vaultId,Path state){
        this.verifier=verifier;this.signer=signer;this.adapter=adapter;this.vaultId=vaultId;this.state=state;
    }
    public Result upload(byte[] grant,long start,long end,String chunkDigest,InputStream input) throws Exception {
        throw new UnsupportedOperationException("GATEWAY_SERVICE_NOT_IMPLEMENTED");
    }
    public Result status(byte[] grant) throws Exception {
        throw new UnsupportedOperationException("GATEWAY_SERVICE_NOT_IMPLEMENTED");
    }
}
