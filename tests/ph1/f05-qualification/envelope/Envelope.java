import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.*;
import java.nio.charset.*;
import java.net.URI;
import java.util.*;
import java.security.*;

// Qualification-only codec seam, not apps/gateway code.
public final class Envelope {
    public static byte[] seal(int kind, Map<Integer,byte[]> fields, PrivateKey key) throws Exception {
        byte[] payload=encode(kind,fields);
        Signature signer=Signature.getInstance("Ed25519","SunEC");
        signer.initSign(key); signer.update(payload);
        byte[] signature=signer.sign();
        if(signature.length!=64) throw new SecurityException("SIGNATURE_SIZE");
        return ByteBuffer.allocate(payload.length+70).putInt(payload.length).put(payload)
            .putShort((short)64).put(signature).array();
    }
    public static Map<Integer,byte[]> verify(byte[] packet, PublicKey key, int kind,
            String issuer, String audience, String keyId, long now) throws Exception {
        if(packet.length<83 || packet.length>4096) throw new IllegalArgumentException("FRAME_SIZE");
        ByteBuffer frame=ByteBuffer.wrap(packet);
        int size=frame.getInt();
        if(size<13 || size!=packet.length-70) throw new IllegalArgumentException("FRAME_LENGTH");
        byte[] payload=new byte[size]; frame.get(payload);
        if(Short.toUnsignedInt(frame.getShort())!=64) throw new IllegalArgumentException("SIGNATURE_LENGTH");
        byte[] signature=new byte[64]; frame.get(signature);
        if(frame.hasRemaining()) throw new IllegalArgumentException("FRAME_TRAILING");
        Map<Integer,byte[]> fields=parse(kind,payload);
        Signature verifier=Signature.getInstance("Ed25519","SunEC");
        verifier.initVerify(key); verifier.update(payload);
        if(!verifier.verify(signature)) throw new SecurityException("SIGNATURE");
        if(!string(fields.get(1)).equals(issuer) || !string(fields.get(2)).equals(audience)
                || !string(fields.get(4)).equals(keyId)) throw new SecurityException("PINNED_IDENTITY");
        int issued=kind==1?20:23;
        if(now<longValue(fields.get(issued+1)) || now>=longValue(fields.get(issued+2)))
            throw new SecurityException("VALIDITY");
        return fields;
    }
    public static byte[] encode(int kind, Map<Integer, byte[]> fields) throws Exception {
        int count=switch(kind) { case 1 -> 22; case 2 -> 25; default -> throw new IllegalArgumentException("KIND"); };
        if (fields.size()!=count) throw new IllegalArgumentException("FIELD_COUNT");
        validate(kind,fields);
        ByteArrayOutputStream buffer=new ByteArrayOutputStream();
        DataOutputStream out=new DataOutputStream(buffer);
        out.write("IEPH1ENV".getBytes(StandardCharsets.US_ASCII));
        out.writeByte(kind); out.writeShort(1); out.writeShort(count);
        for(int tag=1;tag<=count;tag++) {
            byte[] value=fields.get(tag);
            if(value==null || value.length==0 || value.length>256) throw new IllegalArgumentException("FIELD_LENGTH");
            out.writeShort(tag); out.writeShort(value.length); out.write(value);
        }
        out.flush();
        byte[] payload=buffer.toByteArray();
        if(payload.length+70>4096) throw new IllegalArgumentException("FRAME_LIMIT");
        return payload;
    }
    public static Map<Integer,byte[]> parse(int expectedKind, byte[] payload) throws Exception {
        if(payload.length<13 || payload.length+70>4096) throw new IllegalArgumentException("PAYLOAD_SIZE");
        DataInputStream in=new DataInputStream(new ByteArrayInputStream(payload));
        if(!Arrays.equals(in.readNBytes(8),"IEPH1ENV".getBytes(StandardCharsets.US_ASCII)))
            throw new IllegalArgumentException("MAGIC");
        int kind=in.readUnsignedByte();
        if(kind!=expectedKind || (kind!=1 && kind!=2)) throw new IllegalArgumentException("KIND");
        if(in.readUnsignedShort()!=1) throw new IllegalArgumentException("VERSION");
        int count=kind==1?22:25;
        if(in.readUnsignedShort()!=count) throw new IllegalArgumentException("COUNT");
        Map<Integer,byte[]> fields=new TreeMap<>();
        for(int tag=1;tag<=count;tag++) {
            if(in.readUnsignedShort()!=tag) throw new IllegalArgumentException("TAG_ORDER_OR_DUPLICATE");
            int length=in.readUnsignedShort();
            if(length<1 || length>256 || length>in.available()) throw new IllegalArgumentException("LENGTH");
            fields.put(tag,in.readNBytes(length));
        }
        if(in.available()!=0) throw new IllegalArgumentException("TRAILING");
        validate(kind,fields);
        return fields;
    }
    static String string(byte[] bytes) throws CharacterCodingException {
        if(bytes==null || bytes.length<1 || bytes.length>256) throw new IllegalArgumentException("TEXT_SIZE");
        String s=StandardCharsets.UTF_8.newDecoder().onMalformedInput(CodingErrorAction.REPORT)
            .onUnmappableCharacter(CodingErrorAction.REPORT).decode(ByteBuffer.wrap(bytes)).toString();
        for(int i=0;i<s.length();i++) if(s.charAt(i)<33 || s.charAt(i)>126)
            throw new IllegalArgumentException("TEXT_PROFILE");
        return s;
    }
    static long longValue(byte[] b) {
        if(b==null || b.length!=8) throw new IllegalArgumentException("I64");
        long value=ByteBuffer.wrap(b).getLong();
        if(value<0) throw new IllegalArgumentException("NEGATIVE");
        return value;
    }
    static void uuid(byte[] b) {
        if(b==null || b.length!=16) throw new IllegalArgumentException("UUID");
        boolean nonzero=false; for(byte v:b) nonzero|=v!=0;
        if(!nonzero) throw new IllegalArgumentException("NIL_UUID");
    }
    static void exactByte(byte[] b, int... allowed) {
        if(b==null || b.length!=1) throw new IllegalArgumentException("ENUM_LENGTH");
        for(int a:allowed) if(Byte.toUnsignedInt(b[0])==a) return;
        throw new IllegalArgumentException("ENUM");
    }
    static void validate(int kind, Map<Integer,byte[]> f) throws Exception {
        int count=kind==1?22:25;
        if(f.size()!=count) throw new IllegalArgumentException("FIELD_COUNT");
        for(int tag=1;tag<=count;tag++) if(f.get(tag)==null) throw new IllegalArgumentException("MISSING");
        for(int tag=1;tag<=4;tag++) string(f.get(tag));
        if(!string(f.get(3)).equals(kind==1?"GRANT_UPLOAD":"RECEIPT_VERIFIED"))
            throw new IllegalArgumentException("PURPOSE");
        int endpoint=kind==1?11:12;
        for(int tag=5;tag<endpoint;tag++) uuid(f.get(tag));
        String endpointText=string(f.get(endpoint));
        URI uri=new URI(endpointText);
        if(!"https".equals(uri.getScheme()) || uri.getHost()==null || uri.getUserInfo()!=null
                || uri.getQuery()!=null || uri.getFragment()!=null || uri.getPort()<1
                || uri.getPort()>65535 || !uri.normalize().toASCIIString().equals(endpointText))
            throw new IllegalArgumentException("ENDPOINT");
        exactByte(f.get(endpoint+1),1); exactByte(f.get(endpoint+2),1,2); uuid(f.get(endpoint+3));
        if(kind==2) { uuid(f.get(16)); uuid(f.get(17)); }
        int sizeTag=kind==1?15:18, digestTag=sizeTag+1, rangeTag=sizeTag+2;
        long size=longValue(f.get(sizeTag));
        if(f.get(digestTag).length!=32) throw new IllegalArgumentException("DIGEST_SIZE");
        long start=longValue(f.get(rangeTag)), end=longValue(f.get(rangeTag+1));
        if(start>end || end>size) throw new IllegalArgumentException("RANGE");
        if(kind==1) {
            byte[] chunk=f.get(19);
            if(chunk.length!=4 || ByteBuffer.wrap(chunk).getInt()!=1_048_576)
                throw new IllegalArgumentException("CHUNK_PROFILE");
        } else {
            exactByte(f.get(22),1);
            if(start!=0 || end!=size) throw new IllegalArgumentException("COMPLETE_COVERAGE");
        }
        int time=kind==1?20:23;
        long issued=longValue(f.get(time)), notBefore=longValue(f.get(time+1)), expires=longValue(f.get(time+2));
        if(issued!=notBefore || expires!=Math.addExact(issued,kind==1?300:900))
            throw new IllegalArgumentException("TIME_PROFILE");
    }
    public static void correlate(Map<Integer,byte[]> receipt, Map<Integer,byte[]> grant,
            byte[] expectedVault, byte[] expectedLocation) throws Exception {
        validate(1,grant); validate(2,receipt);
        int[][] pairs={{6,5},{7,6},{8,7},{9,8},{10,9},{11,10},{12,11},{13,12},{14,13},
            {15,14},{18,15},{19,16},{20,17},{21,18}};
        for(int[] p:pairs) if(!MessageDigest.isEqual(receipt.get(p[0]),grant.get(p[1])))
            throw new SecurityException("CORRELATION");
        if(!MessageDigest.isEqual(receipt.get(16),expectedVault)
                || !MessageDigest.isEqual(receipt.get(17),expectedLocation)) throw new SecurityException("ALLOCATION");
        long at=longValue(receipt.get(23));
        if(at<longValue(grant.get(21)) || at>=longValue(grant.get(22)))
            throw new SecurityException("RECEIPT_ISSUANCE_WINDOW");
    }
}
