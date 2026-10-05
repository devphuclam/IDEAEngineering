package com.idea.ddm.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

/** Dedicated data-plane process. No database, Server session, product RBAC or custody publication. */
@SpringBootApplication
@RestController
public class GatewayApplication {
    public static void main(String[] args){
        var app=new SpringApplication(GatewayApplication.class);
        app.addInitializers(context->{
            if(!context.getEnvironment().getProperty("server.ssl.enabled",Boolean.class,false))
                throw new IllegalStateException("HTTPS_CONFIGURATION_REQUIRED");
        });
        app.run(args);
    }
    @PostMapping("/transfer/range")
    public ResponseEntity<byte[]> upload(){
        return ResponseEntity.status(501).body("GATEWAY_HTTP_NOT_IMPLEMENTED".getBytes(java.nio.charset.StandardCharsets.US_ASCII));
    }
}
