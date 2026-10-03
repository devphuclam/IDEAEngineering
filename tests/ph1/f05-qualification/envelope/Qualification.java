import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.KeyPairGenerator;
import java.util.*;

// Public codec/CLI boundary; synthetic fixed identities, no product or private-key output.
public final class Qualification {
    static final long T = 1_791_028_800L;
    static byte[] text(String s) { return s.getBytes(StandardCharsets.UTF_8); }
    static byte[] uuid(int n) { return ByteBuffer.allocate(16).putLong(0x0000000000004000L).putLong(0x8000000000000000L | n).array(); }
    static byte[] number(long n) { return ByteBuffer.allocate(8).putLong(n).array(); }
    static byte[] integer(int n) { return ByteBuffer.allocate(4).putInt(n).array(); }
    static Map<Integer, byte[]> grant() throws Exception {
        Map<Integer, byte[]> m = new TreeMap<>();
        m.put(1,text("PH1_SERVER")); m.put(2,text("PH1_GATEWAY"));
        m.put(3,text("GRANT_UPLOAD")); m.put(4,text("SERVER_GRANT_1"));
        for (int tag=5; tag<=10; tag++) m.put(tag,uuid(tag));
        m.put(11,text("https://127.0.0.1:18447/"));
        m.put(12,new byte[]{1}); m.put(13,new byte[]{1}); m.put(14,uuid(14));
        m.put(15,number(1024)); m.put(16,HexFormat.of().parseHex("c6aa2b94ca9fd4d756deb9d75500f1fd217bf04efad6d2be4de4a682ae723384"));
        m.put(17,number(0)); m.put(18,number(1024)); m.put(19,integer(1_048_576));
        m.put(20,number(T)); m.put(21,number(T)); m.put(22,number(T+300));
        return m;
    }
    static void require(boolean b, String reason) {
        if (!b) throw new AssertionError(reason);
    }
    public static void main(String[] args) throws Exception {
        require(args.length==1 && Set.of("trace","signature").contains(args[0]), "CLI_SCOPE");
        byte[] a=Envelope.encode(1,grant()), b=Envelope.encode(1,grant());
        require(Arrays.equals(a,b), "DETERMINISTIC_GRANT");
        require(Arrays.equals(Arrays.copyOf(a,8),text("IEPH1ENV")), "EXACT_MAGIC");
        System.out.println("TRACER_DETERMINISTIC_GRANT=PASS;PAYLOAD_SHA256="+
            HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(a)));
        if(args[0].equals("signature")) {
            var pair=KeyPairGenerator.getInstance("Ed25519","SunEC").generateKeyPair();
            var verified=Envelope.verify(Envelope.seal(1,grant(),pair.getPrivate()),pair.getPublic(),
                1,"PH1_SERVER","PH1_GATEWAY","SERVER_GRANT_1",T);
            require(Arrays.equals(verified.get(5),uuid(5)),"SIGNED_GRANT_ID");
            System.out.println("TRACER_SIGNED_GRANT=PASS");
        }
    }
}
