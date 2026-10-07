import com.sun.net.httpserver.HttpsConfigurator;
import com.sun.net.httpserver.HttpsServer;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.nio.file.attribute.PosixFilePermissions;
import java.security.*;
import java.security.cert.X509Certificate;
import java.util.*;
import java.util.concurrent.CountDownLatch;
import javax.net.ssl.*;

/** Environment-only TLS fixture: no IDEA API, identity, database or product implementation. */
class HttpsFixture {
    private static final Path ROOT = Path.of("/home/phuclam/idea-iam-ui-20261007-46/tls-01");
    private static final Path KEYTOOL = Path.of("/opt/idea/tools/jdk-25.0.4.1+1/bin/keytool");
    private static final byte[] BODY = "IDEA_IAM_UI_READINESS_46\n".getBytes(StandardCharsets.UTF_8);

    public static void main(String[] args) throws Exception {
        if (args.length != 1 || !Runtime.version().toString().equals("25.0.4.1+1-LTS"))
            throw new IllegalArgumentException("exact JDK and prepare/serve mode required");
        if (args[0].equals("prepare")) {
            if (Files.exists(ROOT)) throw new IllegalStateException("fresh TLS root required");
            Files.createDirectory(ROOT, PosixFilePermissions.asFileAttribute(PosixFilePermissions.fromString("rwx------")));
            byte[] random = new byte[32];
            new SecureRandom().nextBytes(random);
            Path password = ROOT.resolve("password.private");
            Files.writeString(password, HexFormat.of().formatHex(random),
                StandardCharsets.US_ASCII, StandardOpenOption.CREATE_NEW);
            Files.setPosixFilePermissions(password, PosixFilePermissions.fromString("rw-------"));
            Arrays.fill(random, (byte) 0);
            run("-genkeypair", "-alias", "iam-ui-46", "-keyalg", "RSA", "-keysize", "3072",
                "-validity", "7", "-dname", "CN=IDEA IAM UI 46 loopback test",
                "-ext", "SAN=dns:localhost,ip:127.0.0.1", "-ext", "EKU=serverAuth",
                "-storetype", "PKCS12", "-keystore", ROOT.resolve("fixture.p12").toString(),
                "-storepass:file", password.toString(), "-keypass:file", password.toString(), "-noprompt");
            Files.setPosixFilePermissions(ROOT.resolve("fixture.p12"), PosixFilePermissions.fromString("rw-------"));
            run("-exportcert", "-alias", "iam-ui-46", "-keystore", ROOT.resolve("fixture.p12").toString(),
                "-storepass:file", password.toString(), "-file", ROOT.resolve("fixture.cer").toString());
            try (var in = Files.newInputStream(ROOT.resolve("fixture.cer"))) {
                var cert = (X509Certificate) java.security.cert.CertificateFactory.getInstance("X.509").generateCertificate(in);
                System.out.println("SUBJECT=" + cert.getSubjectX500Principal());
                System.out.println("SAN=" + cert.getSubjectAlternativeNames());
                System.out.println("SERIAL=" + cert.getSerialNumber().toString(16));
                System.out.println("NOT_BEFORE=" + cert.getNotBefore().toInstant());
                System.out.println("NOT_AFTER=" + cert.getNotAfter().toInstant());
                System.out.println("CERT_SHA256=" + digest(cert.getEncoded()));
                System.out.println("CERT_SHA1=" + HexFormat.of().formatHex(MessageDigest.getInstance("SHA-1").digest(cert.getEncoded())));
                System.out.println("KEYSTORE_SHA256=" + digest(Files.readAllBytes(ROOT.resolve("fixture.p12"))));
            }
            return;
        }
        if (!args[0].equals("serve")) throw new IllegalArgumentException("unknown mode");
        var keystore = KeyStore.getInstance("PKCS12");
        char[] password = Files.readString(ROOT.resolve("password.private"), StandardCharsets.US_ASCII).toCharArray();
        try {
            try (var in = Files.newInputStream(ROOT.resolve("fixture.p12"))) { keystore.load(in, password); }
            var keys = KeyManagerFactory.getInstance(KeyManagerFactory.getDefaultAlgorithm());
            keys.init(keystore, password);
            var context = SSLContext.getInstance("TLS");
            context.init(keys.getKeyManagers(), null, null);
            var server = HttpsServer.create(new InetSocketAddress("127.0.0.1", 18446), 0);
            server.setHttpsConfigurator(new HttpsConfigurator(context));
            server.createContext("/", exchange -> {
                try {
                    boolean allowed = exchange.getRequestMethod().equals("GET") &&
                        exchange.getRequestURI().toString().equals("/__iam_readiness");
                    byte[] body = allowed ? BODY : new byte[0];
                    exchange.getResponseHeaders().set("Cache-Control", "no-store");
                    exchange.sendResponseHeaders(allowed ? 200 : 404, body.length == 0 ? -1 : body.length);
                    if (body.length > 0) exchange.getResponseBody().write(body);
                } finally { exchange.close(); }
            });
            Runtime.getRuntime().addShutdownHook(new Thread(() -> server.stop(0)));
            server.start();
            System.out.println("HTTPS_FIXTURE_UP=127.0.0.1:18446;PID=" + ProcessHandle.current().pid());
            new CountDownLatch(1).await();
        } finally { Arrays.fill(password, '\0'); }
    }

    private static void run(String... args) throws Exception {
        var command = new ArrayList<String>();
        command.add(KEYTOOL.toString());
        command.addAll(List.of(args));
        if (new ProcessBuilder(command).inheritIO().start().waitFor() != 0)
            throw new IllegalStateException("keytool failed");
    }
    private static String digest(byte[] bytes) throws Exception {
        return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(bytes));
    }
}
