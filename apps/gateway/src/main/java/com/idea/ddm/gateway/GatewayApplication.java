package com.idea.ddm.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.context.annotation.Bean;
import org.springframework.core.env.Environment;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.*;
import com.idea.ddm.gateway.transfer.GatewayTransferService;
import com.idea.ddm.gateway.adapter.FilesystemVaultAdapter;
import com.idea.ddm.gateway.security.TransferGrantVerifier;
import com.idea.ddm.gateway.receipt.TransferReceiptSigner;
import java.nio.file.*;
import java.security.*;
import java.security.spec.*;
import java.time.Clock;
import java.util.*;
import java.io.*;

/** Dedicated data-plane process. No database, Server session, product RBAC or custody publication. */
@SpringBootApplication
@RestController
public class GatewayApplication {
    private final GatewayTransferService service;
    private final java.util.concurrent.ScheduledThreadPoolExecutor requestTimers;
    public GatewayApplication(GatewayTransferService service,java.util.concurrent.ScheduledThreadPoolExecutor requestTimers){this.service=service;this.requestTimers=requestTimers;}
    public static void main(String[] args){
        var app=new SpringApplication(GatewayApplication.class);
        app.addInitializers(context->{
            if(!context.getEnvironment().getProperty("server.ssl.enabled",Boolean.class,false))
                throw new IllegalStateException("HTTPS_CONFIGURATION_REQUIRED");
        });
        app.run(args);
    }
    @PostMapping("/transfer/range")
    public void upload(HttpServletRequest request,HttpServletResponse response) throws IOException {
        receive(request,response,60000,1048576,body->{
            if(!request.isSecure())throw new SecurityException("HTTPS_REQUIRED");
            byte[] grant=grant(request);long start=offset(request,"X-IDEA-Range-Start"),end=offset(request,"X-IDEA-Range-End");
            if(end<=start||end-start>1048576||request.getContentLengthLong()>1048576)throw new IllegalArgumentException("BODY_LIMIT");
            return success(service.upload(grant,start,end,header(request,"X-IDEA-Chunk-SHA256"),new ByteArrayInputStream(body)));
        });
    }
    @PostMapping("/transfer/status")
    public void status(HttpServletRequest request,HttpServletResponse response) throws IOException {
        receive(request,response,30000,0,body->{
            if(!request.isSecure())throw new SecurityException("HTTPS_REQUIRED");
            if(body.length!=0)throw new IllegalArgumentException("CONTROL_BODY_FORBIDDEN");
            return success(service.status(grant(request)));
        });
    }
    @FunctionalInterface private interface RequestWork {ResponseEntity<byte[]> run(byte[] body) throws Exception;}
    /** Non-blocking, at most one bounded chunk in RAM. A trickle cannot renew the absolute timer. */
    private void receive(HttpServletRequest request,HttpServletResponse response,long timeout,int maximum,RequestWork work) throws IOException {
        var context=request.startAsync();context.setTimeout(timeout);
        var terminal=new java.util.concurrent.atomic.AtomicBoolean();
        var timers=new java.util.concurrent.CopyOnWriteArrayList<java.util.concurrent.ScheduledFuture<?>>();
        var inactive=new java.util.concurrent.atomic.AtomicReference<java.util.concurrent.ScheduledFuture<?>>();
        long deadline=System.nanoTime()+java.util.concurrent.TimeUnit.MILLISECONDS.toNanos(timeout);
        java.util.function.Consumer<ResponseEntity<byte[]>> finish=result->{
            if(!terminal.compareAndSet(false,true))return;
            try{response.setStatus(result.getStatusCode().value());result.getHeaders().forEach((name,values)->values.forEach(value->response.addHeader(name,value)));
                response.getOutputStream().write(result.getBody());}
            catch(IOException disconnected){/* No successful response is inferred from a lost connection. */}
            finally{for(var timer:timers)timer.cancel(false);var timer=inactive.get();if(timer!=null)timer.cancel(false);context.complete();}
        };
        Runnable expired=()->finish.accept(ResponseEntity.status(408).header("Cache-Control","no-store").body(new byte[0]));
        timers.add(requestTimers.schedule(expired,timeout,java.util.concurrent.TimeUnit.MILLISECONDS));
        Runnable activity=()->{
            var next=requestTimers.schedule(expired,30000,java.util.concurrent.TimeUnit.MILLISECONDS);
            var previous=inactive.getAndSet(next);if(previous!=null)previous.cancel(false);
            if(terminal.get())next.cancel(false);
        };
        activity.run();
        context.addListener(new AsyncListener(){
            public void onTimeout(AsyncEvent event){finish.accept(ResponseEntity.status(408).header("Cache-Control","no-store").body(new byte[0]));}
            public void onError(AsyncEvent event){finish.accept(ResponseEntity.status(503).header("Cache-Control","no-store").body(new byte[0]));}
            public void onComplete(AsyncEvent event){}
            public void onStartAsync(AsyncEvent event){}
        });
        var input=request.getInputStream();var bytes=new ByteArrayOutputStream(Math.min(maximum,65536));
        input.setReadListener(new ReadListener(){
            public void onDataAvailable() throws IOException {
                byte[] buffer=new byte[65536];
                while(!terminal.get()&&input.isReady()&&!input.isFinished()){
                    if(System.nanoTime()>=deadline){finish.accept(ResponseEntity.status(408).header("Cache-Control","no-store").body(new byte[0]));return;}
                    int read=input.read(buffer);if(read<0)break;
                    if(read>maximum-bytes.size()){finish.accept(refusal(new IllegalArgumentException("BODY_LIMIT")));return;}
                    bytes.write(buffer,0,read);if(read>0)activity.run();
                }
            }
            public void onAllDataRead(){
                if(terminal.get())return;
                if(System.nanoTime()>=deadline){finish.accept(ResponseEntity.status(408).header("Cache-Control","no-store").body(new byte[0]));return;}
                try{finish.accept(work.run(bytes.toByteArray()));}catch(Exception failure){finish.accept(refusal(failure));}
            }
            public void onError(Throwable failure){finish.accept(refusal(failure instanceof Exception exception?exception:new IOException("REQUEST_READ_FAILED")));}
        });
    }
    private static ResponseEntity<byte[]> success(GatewayTransferService.Result result){
        byte[] receipt=result.receipt();int size=receipt==null?0:receipt.length;
        byte[] body=java.nio.ByteBuffer.allocate(12+size).putLong(result.verifiedBytes()).putInt(size).put(receipt==null?new byte[0]:receipt).array();
        return ResponseEntity.ok().contentType(org.springframework.http.MediaType.APPLICATION_OCTET_STREAM).header("Cache-Control","no-store").body(body);
    }
    private static ResponseEntity<byte[]> refusal(Exception failure){
        int status=failure instanceof SecurityException?403:failure instanceof IllegalArgumentException?400:503;
        for(Throwable cause=failure;cause!=null;cause=cause.getCause())if(cause instanceof java.net.SocketTimeoutException)status=408;
        if(failure instanceof IOException){
            if(Set.of("SIZE_MISMATCH","DIGEST_MISMATCH","INVALID_DIGEST","INVALID_RANGE").contains(String.valueOf(failure.getMessage())))status=400;
            else if(Set.of("TRANSFER_BUSY","RANGE_CONFLICT","RANGE_BINDING_CONFLICT","COMPLETION_CONFLICT").contains(String.valueOf(failure.getMessage())))status=409;
        }
        return ResponseEntity.status(status).header("Cache-Control","no-store").body(new byte[0]);
    }
    private static byte[] grant(HttpServletRequest request){
        String encoded=header(request,"X-IDEA-Grant");if(encoded.length()>5462)throw new IllegalArgumentException("FRAME_LIMIT");
        byte[] decoded=Base64.getUrlDecoder().decode(encoded);
        if(decoded.length>4096||!Base64.getUrlEncoder().withoutPadding().encodeToString(decoded).equals(encoded))throw new IllegalArgumentException("FRAME_ENCODING");
        return decoded;
    }
    private static long offset(HttpServletRequest request,String name){
        String value=header(request,name);if(!value.matches("0|[1-9][0-9]{0,18}"))throw new IllegalArgumentException("OFFSET_PROFILE");return Long.parseLong(value);
    }
    private static String header(HttpServletRequest request,String name){
        var values=Collections.list(request.getHeaders(name));if(values.size()!=1)throw new IllegalArgumentException("HEADER_AMBIGUITY");return values.getFirst();
    }
    @org.springframework.context.annotation.Configuration(proxyBeanMethods=false)
    static class Configuration {
        @Bean(destroyMethod="shutdown") java.util.concurrent.ScheduledThreadPoolExecutor requestTimers(){
            var timers=new java.util.concurrent.ScheduledThreadPoolExecutor(1,runnable->{var thread=new Thread(runnable,"gateway-request-deadlines");thread.setDaemon(true);return thread;});
            timers.setRemoveOnCancelPolicy(true);return timers;
        }
        @Bean org.springframework.boot.web.server.WebServerFactoryCustomizer<org.springframework.boot.tomcat.servlet.TomcatServletWebServerFactory> uploadInactivityBoundary(){
            return factory->factory.addConnectorCustomizers(connector->{
                if(!(connector.getProtocolHandler() instanceof org.apache.coyote.http11.AbstractHttp11Protocol<?> protocol))
                    throw new IllegalStateException("QUALIFIED_HTTP_PROTOCOL_REQUIRED");
                protocol.setConnectionTimeout(30000);
                protocol.setDisableUploadTimeout(false);
                protocol.setConnectionUploadTimeout(30000);
            });
        }
        @Bean GatewayTransferService transferService(Environment env) throws Exception {
            var factory=KeyFactory.getInstance("Ed25519","SunEC");
            var server=factory.generatePublic(new X509EncodedKeySpec(keyFile(env,"idea.gateway.server-public-key")));
            var gateway=factory.generatePrivate(new PKCS8EncodedKeySpec(keyFile(env,"idea.gateway.receipt-private-key")));
            Clock clock=Clock.systemUTC();UUID gatewayId=UUID.fromString(env.getRequiredProperty("idea.gateway.gateway-id"));
            UUID vaultId=UUID.fromString(env.getRequiredProperty("idea.gateway.vault-id"));
            var verifier=new TransferGrantVerifier(server,env.getProperty("idea.gateway.server-issuer","PH1_SERVER"),env.getProperty("idea.gateway.grant-audience","PH1_GATEWAY"),
                    env.getProperty("idea.gateway.server-key-id","SERVER_GRANT_1"),gatewayId,env.getRequiredProperty("idea.gateway.endpoint"),clock);
            var signer=new TransferReceiptSigner(gateway,env.getProperty("idea.gateway.receipt-issuer","PH1_GATEWAY"),env.getProperty("idea.gateway.receipt-audience","PH1_SERVER"),env.getProperty("idea.gateway.receipt-key-id","GATEWAY_RECEIPT_1"),clock);
            return new GatewayTransferService(verifier,signer,new FilesystemVaultAdapter(Path.of(env.getRequiredProperty("idea.gateway.vault-root"))),vaultId,Path.of(env.getRequiredProperty("idea.gateway.state-root")));
        }
        private static byte[] keyFile(Environment env,String name) throws IOException {
            Path file=Path.of(env.getRequiredProperty(name)).toAbsolutePath();
            if(!file.normalize().equals(file)||!file.toRealPath().equals(file)||!Files.isRegularFile(file,LinkOption.NOFOLLOW_LINKS)||Files.size(file)>4096
                    ||!Files.getPosixFilePermissions(file).equals(java.nio.file.attribute.PosixFilePermissions.fromString("rw-------")))throw new IOException("INVALID_PRIVATE_KEY_CONFIGURATION");
            return Files.readAllBytes(file);
        }
    }
}
