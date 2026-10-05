import java.nio.file.*;
import java.nio.file.attribute.PosixFilePermissions;
import java.nio.ByteBuffer;
import java.security.*;
import java.net.*;
import java.net.http.*;
import java.time.*;
import java.util.*;
import java.util.concurrent.TimeUnit;

/** Actual packaged Boot/HTTPS boundary; independent synthetic Server producer, no DB. */
class GatewayHttpQualification {
    public static void main(String[] args) throws Exception {
        var root=GatewayTlsMaterial.ROOT;var run=GatewayTlsMaterial.RUN;
        GatewayTlsMaterial.require(args.length==2&&args[0].matches("[0-9a-f]{40}")&&args[1].matches("[0-9a-f]{64}"),"Exact source/freeze required");
        GatewayTlsMaterial.require(GatewayTlsMaterial.sha(GatewayTlsMaterial.FREEZE).equals(args[1]),"TLS freeze changed");
        GatewayTlsMaterial.preflight();GatewayTlsMaterial.checkManifest(run.resolve("tls-material.sha256"));
        GatewayTlsMaterial.require(GatewayTlsMaterial.portListeners().isEmpty(),"18447 occupied");
        var config=run.resolve("config");GatewayTlsMaterial.directory(config);
        var generator=KeyPairGenerator.getInstance("Ed25519","SunEC");var server=generator.generateKeyPair();var gateway=generator.generateKeyPair();
        Path serverPublic=config.resolve("server-grant.pub"),gatewayPrivate=config.resolve("gateway-receipt.key");
        Files.write(serverPublic,server.getPublic().getEncoded(),StandardOpenOption.CREATE_NEW);
        Files.write(gatewayPrivate,gateway.getPrivate().getEncoded(),StandardOpenOption.CREATE_NEW);
        for(Path file:List.of(serverPublic,gatewayPrivate))Files.setPosixFilePermissions(file,PosixFilePermissions.fromString("rw-------"));
        GatewayTlsMaterial.directory(run.resolve("vault"));GatewayTlsMaterial.directory(run.resolve("gateway-state"));
        Path properties=config.resolve("application.properties");
        GatewayTlsMaterial.write(properties,"server.address=127.0.0.1\nserver.port=18447\nserver.ssl.enabled=true\nserver.ssl.key-store="+GatewayTlsMaterial.TLS.resolve("listener.p12")
                +"\nserver.ssl.key-store-type=PKCS12\nserver.ssl.key-store-password="+Files.readString(GatewayTlsMaterial.TLS.resolve("key.password")).strip()
                +"\nidea.gateway.server-public-key="+serverPublic+"\nidea.gateway.receipt-private-key="+gatewayPrivate
                +"\nidea.gateway.gateway-id=00000000-0000-4000-8000-000000000010\nidea.gateway.vault-id=00000000-0000-4000-8000-000000000016\nidea.gateway.endpoint=https://127.0.0.1:18447/\nidea.gateway.vault-root="+run.resolve("vault")+"\nidea.gateway.state-root="+run.resolve("gateway-state")+"\n");
        List<String> command=List.of(GatewayTlsMaterial.JDK.resolve("bin/java").toString(),"-Djava.net.preferIPv4Stack=true","-jar",GatewayTlsMaterial.JAR.toString(),"--spring.config.additional-location=file:"+properties);
        GatewayTlsMaterial.write(run.resolve("http-command.txt"),String.join("\n",command)+"\n");
        Process process=GatewayTlsMaterial.builder(command,run.resolve("logs/gateway-http.log")).start();
        try{
            long deadline=System.nanoTime()+Duration.ofSeconds(30).toNanos();
            while(process.isAlive()&&System.nanoTime()<deadline&&!Files.readString(run.resolve("logs/gateway-http.log")).contains("Started GatewayApplication"))Thread.sleep(100);
            GatewayTlsMaterial.require(process.isAlive()&&Files.readString(run.resolve("logs/gateway-http.log")).contains("Started GatewayApplication"),"Boot startup failed");
            var owned=GatewayTlsMaterial.ownedListeners(process.pid());
            GatewayTlsMaterial.require(owned.size()==1&&owned.getFirst().startsWith("tcp "+GatewayTlsMaterial.LOCAL+" ")&&GatewayTlsMaterial.portListeners().size()==1,"Not exact single loopback listener");
            try(var client=GatewayTlsMaterial.client("positive-trust.p12","trust.password")){
                long now=Instant.now().getEpochSecond();var fields=com.idea.ddm.gateway.GatewayTransferTest.fields();
                fields.put(20,com.idea.ddm.gateway.GatewayTransferTest.number(now));fields.put(21,com.idea.ddm.gateway.GatewayTransferTest.number(now));fields.put(22,com.idea.ddm.gateway.GatewayTransferTest.number(now+300));
                byte[] grant=com.idea.ddm.gateway.GatewayTransferTest.signed(fields,server.getPrivate());
                var request=HttpRequest.newBuilder(URI.create("https://127.0.0.1:18447/transfer/range")).timeout(Duration.ofSeconds(30))
                        .header("X-IDEA-Grant",Base64.getUrlEncoder().withoutPadding().encodeToString(grant)).header("X-IDEA-Range-Start","0").header("X-IDEA-Range-End","1024")
                        .header("X-IDEA-Chunk-SHA256","5f70bf18a086007016e948b04aed3b82103a36bea41755b6cddfaf10ace3c6ef")
                        .POST(HttpRequest.BodyPublishers.ofByteArray(new byte[1024])).build();
                var response=client.send(request,HttpResponse.BodyHandlers.ofByteArray());
                GatewayTlsMaterial.require(response.sslSession().isPresent(),"No verified TLS session");
                if(response.statusCode()==501&&Arrays.equals(response.body(),"GATEWAY_HTTP_NOT_IMPLEMENTED".getBytes(java.nio.charset.StandardCharsets.US_ASCII))){
                    System.out.println("GATEWAY_HTTP_RED=EXPECTED_MISSING_BEHAVIOR; STATUS=501");return;
                }
                GatewayTlsMaterial.require(response.statusCode()==200,"HTTP range refused");
                var result=ByteBuffer.wrap(response.body());long verified=result.getLong();int length=result.getInt();
                GatewayTlsMaterial.require(verified==1024&&length>0&&length<=4096&&result.remaining()==length,"Exact completed control response");
                byte[] receipt=new byte[length];result.get(receipt);var frame=ByteBuffer.wrap(receipt);int size=frame.getInt();byte[] payload=new byte[size];frame.get(payload);
                GatewayTlsMaterial.require(frame.getShort()==64&&frame.remaining()==64,"Receipt frame");byte[] signature=new byte[64];frame.get(signature);
                var check=Signature.getInstance("Ed25519","SunEC");check.initVerify(gateway.getPublic());check.update(payload);
                GatewayTlsMaterial.require(check.verify(signature),"Independent Gateway Receipt signature");
                var stalledFields=new TreeMap<Integer,byte[]>(fields);
                for(int tag:new int[]{6,7}){UUID id=UUID.randomUUID();stalledFields.put(tag,ByteBuffer.allocate(16).putLong(id.getMostSignificantBits()).putLong(id.getLeastSignificantBits()).array());}
                byte[] stalledGrant=com.idea.ddm.gateway.GatewayTransferTest.signed(stalledFields,server.getPrivate());
                try(var socket=(javax.net.ssl.SSLSocket)client.sslContext().getSocketFactory().createSocket("127.0.0.1",18447)){
                    var parameters=socket.getSSLParameters();parameters.setEndpointIdentificationAlgorithm("HTTPS");socket.setSSLParameters(parameters);socket.setSoTimeout(35000);socket.startHandshake();
                    String headers="POST /transfer/range HTTP/1.1\r\nHost: 127.0.0.1:18447\r\nConnection: close\r\nContent-Length: 1024\r\nX-IDEA-Grant: "+Base64.getUrlEncoder().withoutPadding().encodeToString(stalledGrant)
                            +"\r\nX-IDEA-Range-Start: 0\r\nX-IDEA-Range-End: 1024\r\nX-IDEA-Chunk-SHA256: 5f70bf18a086007016e948b04aed3b82103a36bea41755b6cddfaf10ace3c6ef\r\n\r\n";
                    long started=System.nanoTime();socket.getOutputStream().write(headers.getBytes(java.nio.charset.StandardCharsets.US_ASCII));socket.getOutputStream().write(0);socket.getOutputStream().flush();
                    try{
                        String line=new java.io.BufferedReader(new java.io.InputStreamReader(socket.getInputStream(),java.nio.charset.StandardCharsets.US_ASCII)).readLine();
                        long elapsed=TimeUnit.NANOSECONDS.toMillis(System.nanoTime()-started);
                        GatewayTlsMaterial.require(line!=null&&line.startsWith("HTTP/1.1 408 ")&&elapsed>=28000&&elapsed<=35000,"Inactivity refusal not exact bounded 408");
                        System.out.println("GATEWAY_INACTIVITY_GREEN=PASS; ELAPSED_MS="+elapsed);
                    }catch(java.net.SocketTimeoutException expectedRed){
                        System.out.println("GATEWAY_HTTP_RED=EXPECTED_INACTIVITY_TIMEOUT_GAP; OBSERVED_WAIT_MS="+TimeUnit.NANOSECONDS.toMillis(System.nanoTime()-started));return;
                    }
                }
                var progressRequest=HttpRequest.newBuilder(URI.create("https://127.0.0.1:18447/transfer/status")).timeout(Duration.ofSeconds(5))
                        .header("X-IDEA-Grant",Base64.getUrlEncoder().withoutPadding().encodeToString(stalledGrant)).POST(HttpRequest.BodyPublishers.noBody()).build();
                var progress=client.send(progressRequest,HttpResponse.BodyHandlers.ofByteArray());
                GatewayTlsMaterial.require(progress.statusCode()==200&&Arrays.equals(progress.body(),new byte[12]),"Timed-out body advanced verified bytes or Receipt");
                var trickleFields=new TreeMap<Integer,byte[]>(fields);
                for(int tag:new int[]{6,7}){UUID id=UUID.randomUUID();trickleFields.put(tag,ByteBuffer.allocate(16).putLong(id.getMostSignificantBits()).putLong(id.getLeastSignificantBits()).array());}
                byte[] trickleGrant=com.idea.ddm.gateway.GatewayTransferTest.signed(trickleFields,server.getPrivate());
                try(var socket=(javax.net.ssl.SSLSocket)client.sslContext().getSocketFactory().createSocket("127.0.0.1",18447)){
                    var parameters=socket.getSSLParameters();parameters.setEndpointIdentificationAlgorithm("HTTPS");socket.setSSLParameters(parameters);socket.setSoTimeout(65000);socket.startHandshake();
                    String headers="POST /transfer/range HTTP/1.1\r\nHost: 127.0.0.1:18447\r\nConnection: close\r\nContent-Length: 1024\r\nX-IDEA-Grant: "+Base64.getUrlEncoder().withoutPadding().encodeToString(trickleGrant)
                            +"\r\nX-IDEA-Range-Start: 0\r\nX-IDEA-Range-End: 1024\r\nX-IDEA-Chunk-SHA256: 5f70bf18a086007016e948b04aed3b82103a36bea41755b6cddfaf10ace3c6ef\r\n\r\n";
                    long started=System.nanoTime();socket.getOutputStream().write(headers.getBytes(java.nio.charset.StandardCharsets.US_ASCII));socket.getOutputStream().write(0);socket.getOutputStream().flush();
                    Thread sender=Thread.ofVirtual().start(()->{
                        try{while(!Thread.currentThread().isInterrupted()){Thread.sleep(5000);socket.getOutputStream().write(0);socket.getOutputStream().flush();}}
                        catch(Exception stopped){/* Owned synthetic writer ends on interrupt or socket close. */}
                    });
                    try{
                        String line=new java.io.BufferedReader(new java.io.InputStreamReader(socket.getInputStream(),java.nio.charset.StandardCharsets.US_ASCII)).readLine();
                        long elapsed=TimeUnit.NANOSECONDS.toMillis(System.nanoTime()-started);
                        GatewayTlsMaterial.require(line!=null&&line.startsWith("HTTP/1.1 408 ")&&elapsed>=58000&&elapsed<=65000,"Absolute refusal not bounded 408");
                        System.out.println("GATEWAY_ABSOLUTE_GREEN=PASS; ELAPSED_MS="+elapsed);
                    }catch(java.net.SocketTimeoutException expectedRed){
                        System.out.println("GATEWAY_HTTP_RED=EXPECTED_ABSOLUTE_TIMEOUT_GAP; OBSERVED_WAIT_MS="+TimeUnit.NANOSECONDS.toMillis(System.nanoTime()-started));return;
                    }finally{sender.interrupt();sender.join(1000);GatewayTlsMaterial.require(!sender.isAlive(),"Owned trickle writer survived");}
                }
                var trickleProgress=client.send(HttpRequest.newBuilder(URI.create("https://127.0.0.1:18447/transfer/status")).timeout(Duration.ofSeconds(5))
                        .header("X-IDEA-Grant",Base64.getUrlEncoder().withoutPadding().encodeToString(trickleGrant)).POST(HttpRequest.BodyPublishers.noBody()).build(),HttpResponse.BodyHandlers.ofByteArray());
                GatewayTlsMaterial.require(trickleProgress.statusCode()==200&&Arrays.equals(trickleProgress.body(),new byte[12]),"Absolute timeout published progress/Receipt");
                System.out.println("GATEWAY_HTTP_GREEN=PASS; TLS="+response.sslSession().get().getProtocol()+"; CIPHER="+response.sslSession().get().getCipherSuite());
            }
        }finally{
            process.destroy();boolean stopped=process.waitFor(10,TimeUnit.SECONDS);if(!stopped){process.destroyForcibly();process.waitFor(5,TimeUnit.SECONDS);}
            GatewayTlsMaterial.write(run.resolve("http-cleanup.txt"),"PROCESS_ALIVE="+process.isAlive()+"\nREMAINING_LISTENERS="+GatewayTlsMaterial.portListeners().size()+"\n");
            GatewayTlsMaterial.require(stopped&&!process.isAlive()&&GatewayTlsMaterial.portListeners().isEmpty(),"Owned Gateway shutdown failed");
            GatewayTlsMaterial.preflight();GatewayTlsMaterial.checkManifest(run.resolve("tls-material.sha256"));
            GatewayTlsMaterial.require(Files.readString(run.resolve("system-trust-before.tsv")).equals(GatewayTlsMaterial.trustSnapshot()),"System trust changed");
        }
    }
}
