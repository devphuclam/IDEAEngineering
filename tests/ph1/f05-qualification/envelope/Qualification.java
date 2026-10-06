import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.KeyPairGenerator;
import java.security.*;
import java.security.spec.X509EncodedKeySpec;
import java.nio.file.*;
import java.nio.file.attribute.PosixFilePermissions;
import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
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
    static int passed;
    static String hash(byte[] b) throws Exception { return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(b)); }
    interface Check { void run() throws Exception; }
    static void pass(String name,Check c) throws Exception { c.run(); passed++; System.out.println("CASE="+name+";RESULT=PASS"); }
    static void reject(String name,Check c) throws Exception {
        try { c.run(); } catch(IllegalArgumentException | SecurityException | java.io.IOException e) {
            passed++; System.out.println("CASE="+name+";RESULT=PASS;REFUSED="+e.getClass().getSimpleName()); return;
        }
        throw new AssertionError("DID_NOT_REFUSE:"+name);
    }
    static Map<Integer,byte[]> receipt() throws Exception {
        Map<Integer,byte[]> g=grant(), r=new TreeMap<>();
        r.put(1,text("PH1_GATEWAY")); r.put(2,text("PH1_SERVER"));
        r.put(3,text("RECEIPT_VERIFIED")); r.put(4,text("GATEWAY_RECEIPT_1")); r.put(5,uuid(25));
        for(int tag=6;tag<=15;tag++) r.put(tag,g.get(tag-1).clone());
        r.put(16,uuid(16)); r.put(17,uuid(17));
        r.put(18,g.get(15)); r.put(19,g.get(16)); r.put(20,number(0)); r.put(21,number(1024));
        r.put(22,new byte[]{1}); r.put(23,number(T+100)); r.put(24,number(T+100)); r.put(25,number(T+1000));
        return r;
    }
    static Map<Integer,byte[]> copy(Map<Integer,byte[]> m) {
        Map<Integer,byte[]> c=new TreeMap<>(); m.forEach((k,v)->c.put(k,v.clone())); return c;
    }
    static void write(Path dir,String name,byte[] b) throws Exception {
        Files.write(dir.resolve(name),b,StandardOpenOption.CREATE_NEW);
        Files.setPosixFilePermissions(dir.resolve(name),PosixFilePermissions.fromString("rw-------"));
    }
    static void sign(Path dir) throws Exception {
        require(!Files.exists(dir,LinkOption.NOFOLLOW_LINKS),"FRESH_VECTOR_ROOT");
        Files.createDirectory(dir,PosixFilePermissions.asFileAttribute(PosixFilePermissions.fromString("rwx------")));
        var generator=KeyPairGenerator.getInstance("Ed25519","SunEC");
        var server=generator.generateKeyPair(); var gateway=generator.generateKeyPair();
        write(dir,"server.pub",server.getPublic().getEncoded()); write(dir,"gateway.pub",gateway.getPublic().getEncoded());
        write(dir,"grant.payload",Envelope.encode(1,grant())); write(dir,"receipt.payload",Envelope.encode(2,receipt()));
        write(dir,"grant.packet",Envelope.seal(1,grant(),server.getPrivate()));
        write(dir,"receipt.packet",Envelope.seal(2,receipt(),gateway.getPrivate()));
        for(int kind=1;kind<=2;kind++) {
            for(int tag:new int[]{1,2,4}) {
                var m=copy(kind==1?grant():receipt()); m.put(tag,text("WRONG_PIN"));
                write(dir,"pin-"+kind+"-"+tag+".packet",Envelope.seal(kind,m,kind==1?server.getPrivate():gateway.getPrivate()));
            }
            var artifact=copy(kind==1?grant():receipt()); artifact.put(kind==1?13:14,new byte[]{2});
            write(dir,"artifact-"+kind+".packet",Envelope.seal(kind,artifact,kind==1?server.getPrivate():gateway.getPrivate()));
        }
        // Validly signed negatives distinguish correlation refusal from signature rejection.
        for(int tag:new int[]{6,7,8,9,10,11,12,14,15,16,17,18,19}) {
            var r=copy(receipt());
            if(tag==12) r.put(tag,text("https://127.0.0.1:18448/"));
            else if(tag==14) r.put(tag,new byte[]{2});
            else if(tag==18) { r.put(18,number(1023)); r.put(21,number(1023)); }
            else { r.get(tag)[r.get(tag).length-1]^=1; }
            write(dir,"correlation-"+tag+".packet",Envelope.seal(2,r,gateway.getPrivate()));
        }
        for(long at:new long[]{T-1,T+300}) {
            var r=copy(receipt()); r.put(23,number(at)); r.put(24,number(at)); r.put(25,number(at+900));
            write(dir,"receipt-issued-"+at+".packet",Envelope.seal(2,r,gateway.getPrivate()));
        }
        var renewal=copy(grant()); renewal.put(5,uuid(105));
        renewal.put(20,number(T+300)); renewal.put(21,number(T+300)); renewal.put(22,number(T+600));
        write(dir,"renewal.packet",Envelope.seal(1,renewal,server.getPrivate()));
        var range=copy(grant()); range.put(17,number(512));
        write(dir,"partial-range.packet",Envelope.seal(1,range,server.getPrivate()));
        var manifest=new StringBuilder();
        try(var paths=Files.list(dir)) {
            for(Path file:paths.sorted().toList()) manifest.append(hash(Files.readAllBytes(file))).append("  ").append(file.getFileName()).append('\n');
        }
        write(dir,"vectors.sha256",text(manifest.toString()));
        System.out.println("SIGNER=COMPLETE;PRIVATE_KEY_FILES=0;VECTOR_MANIFEST_SHA256="+hash(text(manifest.toString())));
        System.out.println("GRANT_PAYLOAD_SHA256="+hash(Envelope.encode(1,grant())));
        System.out.println("RECEIPT_PAYLOAD_SHA256="+hash(Envelope.encode(2,receipt())));
        // Signer exits before fresh verifier starts. Private keys have never been written.
    }
    static void checkFiles(Path dir) throws Exception {
        require(Files.isDirectory(dir,LinkOption.NOFOLLOW_LINKS) && !Files.isSymbolicLink(dir),"VECTOR_ROOT");
        var expected=new TreeSet<String>(); expected.add("vectors.sha256");
        for(String line:Files.readAllLines(dir.resolve("vectors.sha256"),StandardCharsets.UTF_8)) {
            require(line.matches("[0-9a-f]{64}  [a-z0-9.-]+"),"VECTOR_MANIFEST");
            String name=line.substring(66); require(expected.add(name),"VECTOR_DUPLICATE");
            Path p=dir.resolve(name); require(Files.isRegularFile(p,LinkOption.NOFOLLOW_LINKS),"VECTOR_FILE");
            require(hash(Files.readAllBytes(p)).equals(line.substring(0,64)),"VECTOR_HASH");
        }
        try(var files=Files.list(dir)) {
            require(new TreeSet<>(files.map(p->p.getFileName().toString()).toList()).equals(expected),"UNEXPECTED_OR_PRIVATE_FILE");
        }
    }
    static byte[] payload(byte[] packet) { int n=ByteBuffer.wrap(packet).getInt(); return Arrays.copyOfRange(packet,4,4+n); }
    static int offset(byte[] p,int tag) {
        ByteBuffer b=ByteBuffer.wrap(p); b.position(13);
        while(b.hasRemaining()) { int t=Short.toUnsignedInt(b.getShort()), n=Short.toUnsignedInt(b.getShort()); if(t==tag) return b.position(); b.position(b.position()+n); }
        throw new AssertionError("TAG_NOT_FOUND");
    }
    static void exact(Map<Integer,byte[]> actual,Map<Integer,byte[]> literal) {
        require(actual.keySet().equals(literal.keySet()),"EXACT_TAGS");
        for(var e:literal.entrySet()) require(Arrays.equals(actual.get(e.getKey()),e.getValue()),"EXACT_FIELD_"+e.getKey());
    }
    static Map<Integer,byte[]> verified(byte[] packet,PublicKey key,int kind,long now) throws Exception {
        return Envelope.verify(packet,key,kind,kind==1?"PH1_SERVER":"PH1_GATEWAY",
            kind==1?"PH1_GATEWAY":"PH1_SERVER",kind==1?"SERVER_GRANT_1":"GATEWAY_RECEIPT_1",now);
    }
    static void verify(Path dir) throws Exception {
        pass("PUBLIC_ONLY_FROZEN_FILES",()->checkFiles(dir));
        var factory=KeyFactory.getInstance("Ed25519","SunEC");
        var server=factory.generatePublic(new X509EncodedKeySpec(Files.readAllBytes(dir.resolve("server.pub"))));
        var gateway=factory.generatePublic(new X509EncodedKeySpec(Files.readAllBytes(dir.resolve("gateway.pub"))));
        byte[] g=Files.readAllBytes(dir.resolve("grant.packet")), r=Files.readAllBytes(dir.resolve("receipt.packet"));
        pass("WORKED_GRANT_GOLDEN",()->require(hash(payload(g)).equals("599846256d84b81ea35b87495cfeea841ea9979968fd344ff3d462723581b939"),"GOLDEN"));
        for(int kind=1;kind<=2;kind++) {
            final int k=kind; byte[] packet=k==1?g:r; PublicKey key=k==1?server:gateway; long now=k==1?T:T+100;
            var literal=k==1?grant():receipt();
            pass("DETERMINISTIC_"+k,()->{
                byte[] a=Envelope.encode(k,literal), b=Envelope.encode(k,new HashMap<>(literal));
                require(Arrays.equals(a,b) && Arrays.equals(a,payload(packet)),"DETERMINISM");
                require(Arrays.equals(a,Files.readAllBytes(dir.resolve(k==1?"grant.payload":"receipt.payload"))),"FROZEN_PAYLOAD");
            });
            pass("EXACT_PARSE_SIGNATURE_"+k,()->exact(verified(packet,key,k,now),literal));
            reject("WRONG_KEY_"+k,()->verified(packet,k==1?gateway:server,k,now));
            reject("OTHER_DOMAIN_"+k,()->verified(packet,key,k==1?2:1,now));
            byte[] sig=packet.clone(); sig[sig.length-1]^=1;
            reject("SIGNATURE_TAMPER_"+k,()->verified(sig,key,k,now));
            for(int tag=1;tag<=literal.size();tag++) {
                byte[] tamper=packet.clone(); int at=4+offset(payload(packet),tag);
                tamper[at+literal.get(tag).length-1]^=1;
                reject("SIGNED_FIELD_TAMPER_"+k+"_"+tag,()->verified(tamper,key,k,now));
            }
            for(int tag:new int[]{1,2,4}) {
                byte[] wrong=Files.readAllBytes(dir.resolve("pin-"+k+"-"+tag+".packet"));
                reject("SIGNED_WRONG_PIN_"+k+"_"+tag,()->verified(wrong,key,k,now));
            }
            long start=k==1?T:T+100, end=k==1?T+300:T+1000;
            reject("BEFORE_NBF_"+k,()->verified(packet,key,k,start-1));
            pass("AT_NBF_"+k,()->verified(packet,key,k,start));
            pass("BEFORE_EXPIRY_"+k,()->verified(packet,key,k,end-1));
            reject("AT_EXPIRY_"+k,()->verified(packet,key,k,end));
            reject("AFTER_EXPIRY_"+k,()->verified(packet,key,k,end+1));
            pass("EXACT_ARTIFACT_KIND_"+k,()->require(verified(Files.readAllBytes(dir.resolve("artifact-"+k+".packet")),key,k,now).get(k==1?13:14)[0]==2,"ARTIFACT_KIND"));
            structural(k,payload(packet));
            reject("FRAME_TRUNCATED_"+k,()->verified(Arrays.copyOf(packet,packet.length-1),key,k,now));
            reject("FRAME_TRAILING_"+k,()->verified(Arrays.copyOf(packet,packet.length+1),key,k,now));
            reject("FRAME_OVERSIZED_"+k,()->verified(new byte[4097],key,k,now));
            byte[] len=packet.clone(); ByteBuffer.wrap(len).putInt(Integer.MAX_VALUE);
            reject("FRAME_LENGTH_OVERFLOW_"+k,()->verified(len,key,k,now));
        }
        var gv=verified(g,server,1,T+100); var rv=verified(r,gateway,2,T+100);
        pass("RECEIPT_CORRELATION",()->Envelope.correlate(rv,gv,uuid(16),uuid(17)));
        for(int tag:new int[]{6,7,8,9,10,11,12,14,15,16,17,18,19}) {
            var wrong=verified(Files.readAllBytes(dir.resolve("correlation-"+tag+".packet")),gateway,2,T+100);
            reject("VALID_SIGNATURE_WRONG_CORRELATION_"+tag,()->Envelope.correlate(wrong,gv,uuid(16),uuid(17)));
        }
        for(long at:new long[]{T-1,T+300}) {
            var wrong=verified(Files.readAllBytes(dir.resolve("receipt-issued-"+at+".packet")),gateway,2,at);
            reject("RECEIPT_OUTSIDE_GRANT_"+at,()->Envelope.correlate(wrong,gv,uuid(16),uuid(17)));
        }
        pass("PARTIAL_GRANT_NOT_COMPLETE_RECEIPT",()->{
            var partial=verified(Files.readAllBytes(dir.resolve("partial-range.packet")),server,1,T+100);
            require(ByteBuffer.wrap(partial.get(17)).getLong()==512,"PARTIAL_START");
            reject("RECEIPT_RANGE_SCOPE_MISMATCH",()->Envelope.correlate(rv,partial,uuid(16),uuid(17)));
        });
        pass("RENEWAL_NEW_GRANT_SAME_OPERATION",()->{
            var renewed=verified(Files.readAllBytes(dir.resolve("renewal.packet")),server,1,T+300);
            require(!Arrays.equals(renewed.get(5),gv.get(5)),"NEW_GRANT");
            for(int tag=6;tag<=19;tag++) require(Arrays.equals(renewed.get(tag),gv.get(tag)),"RENEWAL_SCOPE");
        });
        pass("VERIFICATION_NOT_REPLAY_PREVENTION",()->exact(verified(g,server,1,T+100),gv));
        profileProbe();
        pass("FROZEN_VECTORS_UNCHANGED",()->checkFiles(dir));
        System.out.println("T027_ENVELOPE_PROFILE=PASS;CASES="+passed+";VERIFIER_PRIVATE_KEY_ACCESS=NONE");
    }
    static void structural(int k,byte[] p) throws Exception {
        byte[] version=p.clone(); version[10]=2;
        reject("UNKNOWN_VERSION_"+k,()->Envelope.parse(k,version));
        byte[] duplicate=p.clone(); int second=offset(p,2)-4; duplicate[second+1]=1;
        reject("DUPLICATE_TAG_"+k,()->Envelope.parse(k,duplicate));
        byte[] unknown=p.clone(); unknown[14]=99;
        reject("UNKNOWN_TAG_"+k,()->Envelope.parse(k,unknown));
        byte[] missing=p.clone(); missing[12]--;
        reject("MISSING_FIELD_"+k,()->Envelope.parse(k,missing));
        byte[] utf=p.clone(); utf[offset(p,1)]=(byte)0xc0;
        reject("MALFORMED_UTF8_"+k,()->Envelope.parse(k,utf));
        byte[] nul=p.clone(); nul[offset(p,1)]=0;
        reject("NUL_TEXT_"+k,()->Envelope.parse(k,nul));
        byte[] length=p.clone(); length[15]=1; length[16]=1;
        reject("OVERSIZED_FIELD_"+k,()->Envelope.parse(k,length));
        reject("PAYLOAD_TRUNCATED_"+k,()->Envelope.parse(k,Arrays.copyOf(p,p.length-1)));
        reject("PAYLOAD_TRAILING_"+k,()->Envelope.parse(k,Arrays.copyOf(p,p.length+1)));
        int size=k==1?15:18;
        var negative=copy(k==1?grant():receipt()); negative.put(size,number(-1));
        reject("NEGATIVE_SIZE_"+k,()->Envelope.encode(k,negative));
        var reversed=copy(k==1?grant():receipt()); reversed.put(size+2,number(1025));
        reject("REVERSED_RANGE_"+k,()->Envelope.encode(k,reversed));
        var beyond=copy(k==1?grant():receipt()); beyond.put(size+3,number(1025));
        reject("RANGE_BEYOND_SIZE_"+k,()->Envelope.encode(k,beyond));
        var width=copy(k==1?grant():receipt()); width.put(size,new byte[7]);
        reject("BAD_INTEGER_WIDTH_"+k,()->Envelope.encode(k,width));
        var digest=copy(k==1?grant():receipt()); digest.put(size+1,new byte[31]);
        reject("BAD_DIGEST_WIDTH_"+k,()->Envelope.encode(k,digest));
        var direction=copy(k==1?grant():receipt()); direction.put(k==1?12:13,new byte[]{2});
        reject("UNSUPPORTED_DIRECTION_"+k,()->Envelope.encode(k,direction));
        var nil=copy(k==1?grant():receipt()); nil.put(5,new byte[16]);
        reject("NIL_ID_"+k,()->Envelope.encode(k,nil));
        var purpose=copy(k==1?grant():receipt()); purpose.put(3,text(k==1?"RECEIPT_VERIFIED":"GRANT_UPLOAD"));
        reject("PURPOSE_SWAP_"+k,()->Envelope.encode(k,purpose));
        var time=copy(k==1?grant():receipt()); int issued=k==1?20:23;
        time.put(issued,number(Long.MAX_VALUE)); time.put(issued+1,number(Long.MAX_VALUE)); time.put(issued+2,number(Long.MAX_VALUE));
        pass("TIME_OVERFLOW_"+k,()->{
            try { Envelope.encode(k,time); throw new AssertionError("TIME_OVERFLOW_ACCEPTED"); }
            catch(ArithmeticException expected) { }
        });
        if(k==2) {
            var incomplete=copy(receipt()); incomplete.put(20,number(1));
            reject("INCOMPLETE_RECEIPT",()->Envelope.encode(2,incomplete));
        }
    }
    static void profileProbe() throws Exception {
        pass("P05_SMALL_1KIB",()->{
            byte[] b=new byte[1024]; Arrays.fill(b,(byte)0x20);
            byte[] label=text("IDEA P05 synthetic transfer fixture. No CAD/Office payload.\n");
            System.arraycopy(label,0,b,0,label.length);
            require(hash(b).equals("c6aa2b94ca9fd4d756deb9d75500f1fd217bf04efad6d2be4de4a682ae723384"),"P05_SMALL_HASH");
        });
        pass("P05_LARGE_64MIB_BOUNDED_HASH",()->{
            String seed="IDEA-PH0-P05-DATA-001|IE-DATA-CANONICAL-001|fixture-v1";
            var sha=MessageDigest.getInstance("SHA-256");
            byte[] key=sha.digest(text(seed+"|key")), iv=Arrays.copyOf(sha.digest(text(seed+"|iv")),16);
            var cipher=Cipher.getInstance("AES/CTR/NoPadding","SunJCE");
            cipher.init(Cipher.ENCRYPT_MODE,new SecretKeySpec(key,"AES"),new IvParameterSpec(iv));
            byte[] zeros=new byte[1_048_576], output=new byte[1_048_576]; long bytes=0, start=System.nanoTime();
            for(int i=0;i<64;i++) { int n=cipher.update(zeros,0,zeros.length,output,0); sha.update(output,0,n); bytes+=n; }
            byte[] tail=cipher.doFinal(); sha.update(tail); bytes+=tail.length;
            require(bytes==67_108_864L && HexFormat.of().formatHex(sha.digest()).equals("04c5a57e3b754b5eb75de7216d33a4982b525c3a1cdfd19b9eddfd1520126eae"),"P05_LARGE_HASH");
            System.out.println("PROFILE_PROBE_BYTES="+bytes+";CHUNKS=64;BUFFER_BYTES=1048576;CPU_ELAPSED_NS="+(System.nanoTime()-start));
        });
        pass("FRAME_AND_REQUEST_BOUNDS",()->{
            require(Envelope.encode(1,grant()).length+70<=4096 && Envelope.encode(2,receipt()).length+70<=4096,"FRAMING");
            require((1024L+1_048_575)/1_048_576==1 && (67_108_864L+1_048_575)/1_048_576==64,"REQUEST_COUNTS");
        });
    }
    public static void main(String[] args) throws Exception {
        if(args.length==2 && Set.of("sign","verify").contains(args[0])) {
            Path dir=Path.of(args[1]);
            require(dir.isAbsolute() && dir.normalize().equals(dir) && dir.getFileName().toString().equals("vectors"),"VECTOR_PATH");
            if(args[0].equals("sign")) sign(dir); else verify(dir);
            return;
        }
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
