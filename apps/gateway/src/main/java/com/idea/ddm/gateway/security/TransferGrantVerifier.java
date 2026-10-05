package com.idea.ddm.gateway.security;

import java.security.PublicKey;
import java.time.Clock;
import java.util.Map;
import java.util.UUID;

/** Exact operator-pinned Server authority, not authentication of the bearer presenter. */
public final class TransferGrantVerifier {
    private final PublicKey key; private final String issuer,audience,keyId,endpoint;
    private final UUID gatewayId; private final Clock clock;
    public TransferGrantVerifier(PublicKey key,String issuer,String audience,String keyId,
            UUID gatewayId,String endpoint,Clock clock){
        this.key=key;this.issuer=issuer;this.audience=audience;this.keyId=keyId;
        this.gatewayId=gatewayId;this.endpoint=endpoint;this.clock=clock;
    }
    public Map<Integer,byte[]> verify(byte[] grant,long start,long end) throws Exception {
        throw new UnsupportedOperationException("GRANT_VERIFIER_NOT_IMPLEMENTED");
    }
}
