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
        long now=clock.instant().getEpochSecond();
        var codec=com.idea.ddm.gateway.security.GatewayEnvelope.class;
        if(now<com.idea.ddm.gateway.security.GatewayEnvelope.longValue(verifiedGrant.get(21))
                ||now>=com.idea.ddm.gateway.security.GatewayEnvelope.longValue(verifiedGrant.get(22)))
            throw new SecurityException("GRANT_EXPIRED_BEFORE_RECEIPT");
        if(!java.util.Arrays.equals(uuid(completed.transferId()),verifiedGrant.get(7))
                ||completed.byteCount()!=com.idea.ddm.gateway.security.GatewayEnvelope.longValue(verifiedGrant.get(15))
                ||!java.util.Arrays.equals(java.util.HexFormat.of().parseHex(completed.digest()),verifiedGrant.get(16))
                ||com.idea.ddm.gateway.security.GatewayEnvelope.longValue(verifiedGrant.get(17))!=0
                ||com.idea.ddm.gateway.security.GatewayEnvelope.longValue(verifiedGrant.get(18))!=completed.byteCount())
            throw new SecurityException("COMPLETION_GRANT_CONFLICT");
        var fields=new java.util.TreeMap<Integer,byte[]>();
        fields.put(1,text(issuer));fields.put(2,text(audience));fields.put(3,text("RECEIPT_VERIFIED"));fields.put(4,text(keyId));
        fields.put(5,uuid(receiptId));for(int i=6;i<=15;i++)fields.put(i,verifiedGrant.get(i-1).clone());
        fields.put(16,uuid(vaultId));fields.put(17,uuid(completed.locationId()));
        fields.put(18,number(completed.byteCount()));fields.put(19,java.util.HexFormat.of().parseHex(completed.digest()));
        fields.put(20,number(0));fields.put(21,number(completed.byteCount()));fields.put(22,new byte[]{1});
        fields.put(23,number(now));fields.put(24,number(now));fields.put(25,number(Math.addExact(now,900)));
        return com.idea.ddm.gateway.security.GatewayEnvelope.seal(2,fields,key);
    }
    private static byte[] uuid(UUID id){return java.nio.ByteBuffer.allocate(16).putLong(id.getMostSignificantBits()).putLong(id.getLeastSignificantBits()).array();}
    private static byte[] number(long n){return java.nio.ByteBuffer.allocate(8).putLong(n).array();}
    private static byte[] text(String value){return value.getBytes(java.nio.charset.StandardCharsets.UTF_8);}
}
