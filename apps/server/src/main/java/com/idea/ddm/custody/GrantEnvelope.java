package com.idea.ddm.custody;

import java.io.*;
import java.net.URI;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.security.*;
import java.util.*;

/** First-party implementation of the already qualified IEPH1ENV v1 Grant, not JWT/Java serialization. */
final class GrantEnvelope {
    private GrantEnvelope() {}
    static byte[] sign(TransferGrantService.Grant grant, PrivateKey key, String issuer, String audience, String keyId) throws Exception {
        var s = grant.scope();
        var endpoint = URI.create(s.endpoint());
        if (!"https".equals(endpoint.getScheme()) || endpoint.getHost() == null || endpoint.getPort() < 1
                || endpoint.getPort() > 65535 || endpoint.getUserInfo() != null || endpoint.getQuery() != null
                || endpoint.getFragment() != null || !endpoint.normalize().toASCIIString().equals(s.endpoint()))
            throw new IllegalArgumentException("ENDPOINT_PROFILE");
        if (s.byteCount() < 0 || s.rangeStart() < 0 || s.rangeEnd() < s.rangeStart() || s.rangeEnd() > s.byteCount()
                || !s.digest().matches("[0-9a-f]{64}") || (s.objectKind() != 1 && s.objectKind() != 2)
                || grant.issuedAt() < 0 || grant.expiresAt() != Math.addExact(grant.issuedAt(), 300))
            throw new IllegalArgumentException("GRANT_SCOPE_PROFILE");
        var fields = List.of(text(issuer), text(audience), text("GRANT_UPLOAD"), text(keyId),
                uuid(grant.grantId()), uuid(grant.operationId()), uuid(grant.transferId()), uuid(grant.organizationId()),
                uuid(grant.actorId()), uuid(s.gatewayId()), text(s.endpoint()), new byte[]{1}, new byte[]{(byte)s.objectKind()},
                uuid(s.objectId()), number(s.byteCount()), HexFormat.of().parseHex(s.digest()), number(s.rangeStart()),
                number(s.rangeEnd()), ByteBuffer.allocate(4).putInt(1_048_576).array(), number(grant.issuedAt()),
                number(grant.issuedAt()), number(grant.expiresAt()));
        var buffer = new ByteArrayOutputStream();
        var out = new DataOutputStream(buffer);
        out.write("IEPH1ENV".getBytes(StandardCharsets.US_ASCII)); out.writeByte(1); out.writeShort(1); out.writeShort(22);
        for (int i=0; i<fields.size(); i++) { var f=fields.get(i); out.writeShort(i+1); out.writeShort(f.length); out.write(f); }
        out.flush(); var payload = buffer.toByteArray();
        if (payload.length + 70 > 4096) throw new IllegalArgumentException("FRAME_LIMIT");
        var signer = Signature.getInstance("Ed25519", "SunEC");
        signer.initSign(key); signer.update(payload); var signature = signer.sign();
        if (signature.length != 64) throw new SecurityException("SIGNATURE_PROFILE");
        return ByteBuffer.allocate(payload.length+70).putInt(payload.length).put(payload).putShort((short)64).put(signature).array();
    }
    private static byte[] text(String value) {
        Objects.requireNonNull(value);
        if (value.isEmpty() || value.length() > 256 || value.chars().anyMatch(c -> c < 33 || c > 126))
            throw new IllegalArgumentException("TEXT_PROFILE");
        return value.getBytes(StandardCharsets.UTF_8);
    }
    private static byte[] uuid(UUID value) {
        Objects.requireNonNull(value);
        if (value.getMostSignificantBits() == 0 && value.getLeastSignificantBits() == 0) throw new IllegalArgumentException("NIL_UUID");
        return ByteBuffer.allocate(16).putLong(value.getMostSignificantBits()).putLong(value.getLeastSignificantBits()).array();
    }
    private static byte[] number(long value) { return ByteBuffer.allocate(8).putLong(value).array(); }
}
