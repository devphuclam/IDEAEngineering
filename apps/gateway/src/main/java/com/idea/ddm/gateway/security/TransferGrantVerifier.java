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
        var fields=verify(grant);
        if(start<GatewayEnvelope.longValue(fields.get(17))||end>GatewayEnvelope.longValue(fields.get(18))
                ||end<=start||end-start>1048576)throw new SecurityException("UNAUTHORIZED_RANGE");
        return fields;
    }
    public Map<Integer,byte[]> verify(byte[] grant) throws Exception {
        var fields=GatewayEnvelope.verify(grant,key,1,issuer,audience,keyId,clock.instant().getEpochSecond());
        var identity=java.nio.ByteBuffer.wrap(fields.get(10));
        if(!new UUID(identity.getLong(),identity.getLong()).equals(gatewayId)
                ||!GatewayEnvelope.string(fields.get(11)).equals(endpoint))throw new SecurityException("WRONG_GATEWAY_ENDPOINT");
        return fields;
    }
}
