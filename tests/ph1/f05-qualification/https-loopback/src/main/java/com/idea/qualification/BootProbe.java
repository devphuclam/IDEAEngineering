package com.idea.qualification;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.WebApplicationType;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/** Synthetic transport probe only; not Gateway or a supported product API. */
@SpringBootApplication
@RestController
public class BootProbe {
    private static final AtomicInteger probes = new AtomicInteger();
    private static final Path TLS = Path.of("/home/phuclam/idea-f05a-20261003-37/https-qualification-02/run/tls");

    @GetMapping("/synthetic-probe")
    public ResponseEntity<String> probe() {
        return ResponseEntity.ok().header("X-T027-Probe-Count", Integer.toString(probes.incrementAndGet()))
            .body("T027_HTTPS_PROBE_OK\n");
    }

    public static void main(String[] args) throws Exception {
        if (args.length != 0) throw new IllegalArgumentException("no external Boot arguments");
        var app = new SpringApplication(BootProbe.class);
        app.setWebApplicationType(WebApplicationType.SERVLET);
        app.setDefaultProperties(Map.of(
            "server.address", "127.0.0.1",
            "server.port", "18447",
            "server.ssl.enabled", "true",
            "server.ssl.key-store", TLS.resolve("listener.p12").toUri().toString(),
            "server.ssl.key-store-type", "PKCS12",
            "server.ssl.key-store-password", Files.readString(TLS.resolve("key.password")).strip(),
            "server.ssl.key-alias", "listener",
            "spring.config.location", "optional:classpath:/t027-no-external-config.properties",
            "server.shutdown", "graceful"));
        Runtime.getRuntime().addShutdownHook(new Thread(() ->
            System.out.println("T027_PROBE_TOTAL=" + probes.get()), "synthetic-count"));
        app.run();
    }
}
