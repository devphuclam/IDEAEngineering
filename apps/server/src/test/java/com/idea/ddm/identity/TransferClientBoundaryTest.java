package com.idea.ddm.identity;

import static org.junit.jupiter.api.Assertions.*;
import com.idea.ddm.IdeaServerApplication;
import com.idea.ddm.custody.*;
import java.nio.file.*;
import java.nio.file.attribute.PosixFilePermissions;
import java.security.*;
import java.time.Clock;
import java.util.*;
import java.util.concurrent.*;
import java.util.function.Supplier;
import javax.sql.DataSource;
import org.junit.jupiter.api.Test;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

/** Actual Windows client coordination, confined to test classes and a marked schema. */
class TransferClientBoundaryTest {
    static final Path ROOT=Path.of("/home/phuclam/idea-f05a-t028-t030-20261005-37/run-receipt-green-22/source/apps/server/target/client-e2e-01");
    static final Path JDK=Path.of("/opt/idea/tools/jdk-25.0.4.1+1");
    static final Path GATEWAY=Path.of("/home/phuclam/idea-f05-sprint-20261005-37/gateway-boot-08/source/run/application/target/idea-gateway-0.1.0.jar");
    static final UUID VAULT=UUID.randomUUID(), GATEWAY_ID=UUID.randomUUID();
    static final String ENDPOINT="https://127.0.0.1:18447/";
    static final String SMALL="c6aa2b94ca9fd4d756deb9d75500f1fd217bf04efad6d2be4de4a682ae723384";
    static final String LARGE="04c5a57e3b754b5eb75de7216d33a4982b525c3a1cdfd19b9eddfd1520126eae";

    @Test void actualClientTransfersExactP05BytesAndServerCommitsCustodyOnlyAfterReceipt() throws Exception {
        assertEquals("25.0.4.1+1-LTS",Runtime.version().toString());
        assertEquals("e5e8b3a330267b3fd2b14e5e9f36eceafab0e45fb6e497dfeea59a33f1eb928e",hash(JDK.resolve("bin/keytool")));
        assertFalse(Files.exists(ROOT,LinkOption.NOFOLLOW_LINKS));
        assertEquals(ROOT.getParent().toRealPath(),ROOT.getParent());
        assertEquals("c26b870e22a6ffb6ed9acbcbcd1dd20208004226c4d09a399e227983023a14e1",hash(GATEWAY));
        assertPortsFree();directory(ROOT);directory(ROOT.resolve("vault"));directory(ROOT.resolve("state"));
        var random=new SecureRandom();byte[] secret=new byte[32];random.nextBytes(secret);
        String tlsPassword=HexFormat.of().formatHex(secret);Arrays.fill(secret,(byte)0);
        write("tls.password",tlsPassword+"\n");
        keytool("generate", "-genkeypair","-alias","listener","-keystore",ROOT.resolve("listener.p12").toString(),
                "-storetype","PKCS12","-storepass:file",ROOT.resolve("tls.password").toString(),
                "-keypass:file",ROOT.resolve("tls.password").toString(),"-keyalg","EC","-groupname","secp256r1",
                "-dname","CN=IDEA F05 synthetic client test","-validity","2","-ext","SAN=ip:127.0.0.1","-ext","EKU=serverAuth");
        keytool("export","-exportcert","-rfc","-alias","listener","-keystore",ROOT.resolve("listener.p12").toString(),
                "-storepass:file",ROOT.resolve("tls.password").toString(),"-file",ROOT.resolve("certificate.pem").toString());
        var certificate=(java.security.cert.X509Certificate)java.security.cert.CertificateFactory.getInstance("X.509")
                .generateCertificate(Files.newInputStream(ROOT.resolve("certificate.pem")));
        assertEquals(List.of(List.of(7,"127.0.0.1")),new ArrayList<>(certificate.getSubjectAlternativeNames()));
        certificate.checkValidity();certificate.verify(certificate.getPublicKey());
        write("tls-freeze.txt","CERT_SHA256="+hash(ROOT.resolve("certificate.pem"))+"\nKEYSTORE_SHA256="+hash(ROOT.resolve("listener.p12"))
                +"\nSUBJECT="+certificate.getSubjectX500Principal()+"\nSAN=IP:127.0.0.1\nSERIAL="+certificate.getSerialNumber().toString(16)
                +"\nVALID_FROM="+certificate.getNotBefore().toInstant()+"\nVALID_TO="+certificate.getNotAfter().toInstant()+"\n");
        var generator=KeyPairGenerator.getInstance("Ed25519","SunEC");var grantKeys=generator.generateKeyPair();var receiptKeys=generator.generateKeyPair();
        privateBytes("server.pub",grantKeys.getPublic().getEncoded());privateBytes("gateway.key",receiptKeys.getPrivate().getEncoded());
        write("gateway.properties","server.address=127.0.0.1\nserver.port=18447\nserver.ssl.enabled=true\nserver.ssl.key-store="+ROOT.resolve("listener.p12")
                +"\nserver.ssl.key-store-type=PKCS12\nserver.ssl.key-store-password="+tlsPassword+"\nidea.gateway.server-public-key="+ROOT.resolve("server.pub")
                +"\nidea.gateway.receipt-private-key="+ROOT.resolve("gateway.key")+"\nidea.gateway.gateway-id="+GATEWAY_ID+"\nidea.gateway.vault-id="+VAULT
                +"\nidea.gateway.endpoint="+ENDPOINT+"\nidea.gateway.vault-root="+ROOT.resolve("vault")+"\nidea.gateway.state-root="+ROOT.resolve("state")+"\n");
        F05DatabaseFixture.create();
        DataSource app=new DriverManagerDataSource(F05DatabaseFixture.url(),"idea_ddm_app",F05DatabaseFixture.password("app"));
        UUID organization=UUID.randomUUID();String login="f05.client."+UUID.randomUUID(),password=UUID.randomUUID().toString();
        var identity=new AdministratorBootstrap(app).initialize(organization,"F05 Synthetic Organization","F05 Synthetic Client",login,password);
        try(var c=F05DatabaseFixture.open("migration");var q=c.prepareStatement("INSERT INTO vault_endpoint(vault_id,adapter_kind,eligibility) VALUES (?,'FILESYSTEM','ELIGIBLE')")){
            q.setObject(1,VAULT);assertEquals(1,q.executeUpdate());
        }
        var gateway=new ProcessBuilder(JDK.resolve("bin/java").toString(),"-Djava.net.preferIPv4Stack=true","-jar",GATEWAY.toString(),
                "--spring.config.additional-location=file:"+ROOT.resolve("gateway.properties"))
                .redirectErrorStream(true).redirectOutput(ROOT.resolve("gateway-private.log").toFile()).start();
        try {
            var serverRef=new java.util.concurrent.atomic.AtomicReference<org.springframework.context.ConfigurableApplicationContext>();
            var bridge=new Bridge(app,()->serverRef.get().getBean(SessionService.class),identity.actorId(),organization,grantKeys,receiptKeys);
            try(var server=new SpringApplicationBuilder(IdeaServerApplication.class).initializers(context->{
                context.getBeanFactory().registerSingleton("dataSource",app);
                context.getBeanFactory().registerSingleton("f05Clock",Clock.systemUTC());
                context.getEnvironment().getPropertySources().addFirst(new org.springframework.core.env.MapPropertySource("privateHarnessTls",Map.of("server.ssl.key-store-password",tlsPassword)));
            }).run("--server.address=127.0.0.1","--server.port=18446","--server.ssl.enabled=true",
                    "--server.ssl.key-store="+ROOT.resolve("listener.p12"),
                    "--server.ssl.key-store-type=PKCS12","--server.ssl.key-alias=listener","--spring.flyway.enabled=false","--idea.dev-api.enabled=false")) {
                serverRef.set(server);
                var mapping=server.getBean(org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping.class);
                var options=mapping.getBuilderConfiguration();
                mapping.registerMapping(org.springframework.web.servlet.mvc.method.RequestMappingInfo.paths("/qualification/f05/grant")
                        .methods(org.springframework.web.bind.annotation.RequestMethod.POST).options(options).build(),bridge,Bridge.class.getMethod("grant",long.class));
                mapping.registerMapping(org.springframework.web.servlet.mvc.method.RequestMappingInfo.paths("/qualification/f05/receipt")
                        .methods(org.springframework.web.bind.annotation.RequestMethod.POST).options(options).build(),bridge,Bridge.class.getMethod("receipt",byte[].class));
                long startup=System.nanoTime()+TimeUnit.SECONDS.toNanos(30);
                while(gateway.isAlive()&&System.nanoTime()<startup&&!Files.readString(ROOT.resolve("gateway-private.log")).contains("Started GatewayApplication"))Thread.sleep(100);
                assertTrue(gateway.isAlive());assertTrue(Files.readString(ROOT.resolve("gateway-private.log")).contains("Started GatewayApplication"));
                assertLoopbackOnly();
                // Test-fixture secrets only in private readiness file, not Maven/system properties or output.
                write("ready.json","{\"login\":\""+login+"\",\"password\":\""+password+"\",\"ca\":\""
                        +Files.readString(ROOT.resolve("certificate.pem")).replace("\r","").replace("\n","\\n")+"\"}\n");
                System.out.println("F05_CLIENT_READY; SOURCE="+System.getenv("IDEA_F05_SOURCE_SHA")+"; READY_FILE="+ROOT.resolve("ready.json"));
                long deadline=System.nanoTime()+TimeUnit.MINUTES.toNanos(8);
                while(System.nanoTime()<deadline&&!Files.exists(ROOT.resolve("client-done"))&&!Files.exists(ROOT.resolve("client-failed")))Thread.sleep(200);
                assertFalse(Files.exists(ROOT.resolve("client-failed")),"Actual client failed; no success inferred");
                assertTrue(Files.exists(ROOT.resolve("client-done")),"Actual client did not finish; no transfer PASS inferred");
                assertEquals(2,bridge.grants.size());
                try(var c=app.getConnection();var q=c.prepareStatement("SELECT a.byte_count,a.digest_value,l.adapter_key,l.verification_state,t.state FROM artifact a JOIN artifact_location l USING(artifact_id) JOIN transfer_receipt r USING(receipt_id) JOIN transfer_record t USING(transfer_id) WHERE a.artifact_id=?")) {
                    for(var grant:bridge.grants.values()) {
                        q.setObject(1,grant.scope().objectId());try(var row=q.executeQuery()) {
                            assertTrue(row.next());assertEquals(grant.scope().byteCount(),row.getLong(1));assertEquals(grant.scope().digest(),row.getString(2));
                            assertEquals("VERIFIED",row.getString(4));assertEquals("CONSUMED",row.getString(5));
                            var file=ROOT.resolve("vault/objects").resolve(row.getString(3));assertEquals(file.toRealPath(),file);
                            assertEquals(grant.scope().byteCount(),Files.size(file));assertEquals(grant.scope().digest(),hash(file));assertFalse(row.next());
                        }
                        try(var audit=c.prepareStatement("SELECT count(*) FROM audit_evidence WHERE operation_id=? AND action='transfer.receipt.accept'")) {
                            audit.setObject(1,grant.operationId());try(var row=audit.executeQuery()){assertTrue(row.next());assertEquals(1,row.getInt(1));}
                        }
                    }
                }
                System.out.println("F05_ACTUAL_CLIENT_CUSTODY=PASS; FIXTURES=2; RECEIPT_RETRY=CANONICAL; SERVER_BYTE_RELAY=0");
            }
        } finally {
            gateway.destroy();if(!gateway.waitFor(10,TimeUnit.SECONDS)){gateway.destroyForcibly();assertTrue(gateway.waitFor(5,TimeUnit.SECONDS));}
            assertFalse(gateway.isAlive());assertPortsFree();
            Files.deleteIfExists(ROOT.resolve("ready.json")); // Only this newly generated credential handoff.
            System.out.println("F05_CLIENT_LISTENER_CLEANUP=COMPLETE; PORTS=18446,18447");
        }
    }

    public static final class Bridge {
        final DataSource app;final Supplier<SessionService> sessions;final UUID actor,organization;final KeyPair grantKeys,receiptKeys;
        final Map<Long,TransferGrantService.Grant> grants=new ConcurrentHashMap<>();
        Bridge(DataSource app,Supplier<SessionService> sessions,UUID actor,UUID organization,KeyPair grantKeys,KeyPair receiptKeys){
            this.app=app;this.sessions=sessions;this.actor=actor;this.organization=organization;this.grantKeys=grantKeys;this.receiptKeys=receiptKeys;
        }
        ActorContext context(){
            var authentication=SecurityContextHolder.getContext().getAuthentication();
            if(authentication==null||!authentication.isAuthenticated()||!(authentication.getPrincipal() instanceof SessionService.Identity identity))throw new SecurityException("CLIENT_SESSION_REFUSED");
            return sessions.get().context(identity);
        }
        void owner(OwnerSessionEligibility.EligibleActor current,TransferGrantService.Scope scope){
            if(!actor.equals(current.actorId())||!organization.equals(current.organizationId())||!VAULT.equals(scope.vaultId())||!GATEWAY_ID.equals(scope.gatewayId())
                    ||!ENDPOINT.equals(scope.endpoint())||!grants.values().stream().anyMatch(g->g.scope().equals(scope)))throw new SecurityException("TEST_OWNER_REFUSED");
        }
        @ResponseBody
        public synchronized Map<String,String> grant(@RequestParam("size") long size){
            if(size!=1024&&size!=67108864)throw new IllegalArgumentException("FIXTURE_SCOPE_REFUSED");
            var scope=grants.containsKey(size)?grants.get(size).scope():new TransferGrantService.Scope(UUID.randomUUID(),UUID.randomUUID(),VAULT,GATEWAY_ID,ENDPOINT,1,UUID.randomUUID(),size,size==1024?SMALL:LARGE,0,size);
            var service=new TransferGrantService(app,new OwnerSessionEligibility(sessions.get()),(c,a,s)->{
                if(!actor.equals(a.actorId())||!organization.equals(a.organizationId())||!s.equals(scope))throw new SecurityException("TEST_OWNER_REFUSED");
            },Clock.systemUTC(),grantKeys.getPrivate(),"PH1_SERVER","PH1_GATEWAY","SERVER_GRANT_1");
            var grant=service.issue(context(),scope);grants.put(size,grant);
            return Map.of("frame",Base64.getUrlEncoder().withoutPadding().encodeToString(grant.frame()),"transferId",grant.transferId().toString());
        }
        @ResponseBody
        public Map<String,String> receipt(@RequestBody byte[] frame){
            if(frame.length>4096)throw new SecurityException("FRAME_LIMIT");
            var service=new TransferReceiptService(app,new OwnerSessionEligibility(sessions.get()),(c,a,s,location)->{
                owner(a,s);var grant=grants.values().stream().filter(g->g.scope().equals(s)).findFirst().orElseThrow();
                // Controlled test allocation oracle: exact owned Gateway allocation, never client asserted Location/path.
                Path binding=ROOT.resolve("state").resolve(grant.transferId()+".binding");
                if(!binding.toRealPath().equals(binding)||!Files.isRegularFile(binding,LinkOption.NOFOLLOW_LINKS)||Files.size(binding)>8192)throw new SecurityException("ALLOCATION_REFUSED");
                UUID allocated=UUID.fromString(Files.readString(binding).split("\n",2)[0]);
                if(!allocated.equals(location))throw new SecurityException("ALLOCATION_REFUSED");
                return new TransferReceiptService.Allocation(VAULT,allocated,grant.transferId()+"-"+allocated+".blob");
            },Clock.systemUTC(),receiptKeys.getPublic(),"PH1_GATEWAY","PH1_SERVER","GATEWAY_RECEIPT_1");
            var accepted=service.accept(context(),frame);return Map.of("transferId",accepted.transferId().toString());
        }
    }
    static void keytool(String name,String...args) throws Exception {
        var command=new ArrayList<String>();command.add(JDK.resolve("bin/keytool").toString());command.addAll(List.of(args));
        var process=new ProcessBuilder(command).redirectErrorStream(true).redirectOutput(ROOT.resolve("keytool-"+name+"-private.log").toFile()).start();
        if(!process.waitFor(15,TimeUnit.SECONDS)){process.destroyForcibly();throw new IllegalStateException("KEYTOOL_TIMEOUT");}assertEquals(0,process.exitValue());
    }
    static void directory(Path path) throws Exception {Files.createDirectory(path);Files.setPosixFilePermissions(path,PosixFilePermissions.fromString("rwx------"));}
    static void write(String name,String value) throws Exception {privateBytes(name,value.getBytes(java.nio.charset.StandardCharsets.UTF_8));}
    static void privateBytes(String name,byte[] value) throws Exception {var path=ROOT.resolve(name);Files.write(path,value,StandardOpenOption.CREATE_NEW);Files.setPosixFilePermissions(path,PosixFilePermissions.fromString("rw-------"));}
    static String hash(Path path) throws Exception {var digest=MessageDigest.getInstance("SHA-256");try(var stream=Files.newInputStream(path)){byte[] buffer=new byte[1048576];for(int n;(n=stream.read(buffer))>=0;)digest.update(buffer,0,n);}return HexFormat.of().formatHex(digest.digest());}
    static List<String> listeners() throws Exception {
        var result=new ArrayList<String>();for(String family:List.of("tcp","tcp6"))for(String line:Files.readAllLines(Path.of("/proc/net",family)).subList(1,Files.readAllLines(Path.of("/proc/net",family)).size())){
            var row=line.strip().split("\\s+");if(row[3].equals("0A")&&(row[1].endsWith(":480E")||row[1].endsWith(":480F")))result.add(family+" "+row[1]);
        }return result;
    }
    static void assertPortsFree() throws Exception {assertTrue(listeners().isEmpty(),"Owned transfer ports occupied");}
    static void assertLoopbackOnly() throws Exception {assertEquals(Set.of("tcp 0100007F:480E","tcp 0100007F:480F"),new HashSet<>(listeners()));}
}
