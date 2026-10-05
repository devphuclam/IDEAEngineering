import java.io.*;
import java.net.*;
import java.net.http.*;
import java.nio.file.*;
import java.nio.file.attribute.PosixFilePermissions;
import java.security.*;
import java.security.cert.*;
import java.time.*;
import java.util.*;
import java.util.concurrent.TimeUnit;
import javax.net.ssl.*;

/** JDK-only, single-use TLS phases. No global trust configuration or bypass. */
class GatewayTlsMaterial {
    static final Path ROOT = Path.of("/home/phuclam/idea-f05-sprint-20261005-37/gateway-boot-02/source");
    static final Path PACKAGE = ROOT.resolve("tests/ph1/f05-qualification/gateway");
    static final Path JDK = Path.of("/opt/idea/tools/jdk-25.0.4.1+1");
    static final Path RUN = ROOT.resolve("run");
    static final Path APP = RUN.resolve("application");
    static final Path TLS = RUN.resolve("tls");
    static final Path JAR = APP.resolve("target/idea-gateway-0.1.0.jar");
    static final Path SNAPSHOT = RUN.resolve("controlled-originals.sha256");
    static final Path FREEZE = RUN.resolve("tls-freeze.txt");
    static final String BODY = "T027_HTTPS_PROBE_OK\n";
    static final String LOCAL = "0100007F:" + String.format("%04X", 18447);

    public static void main(String[] args) {
        try {
            require(args.length==1&&args[0].matches("[0-9a-f]{40}"),"Exact build source required");
            require(ROOT.equals(Path.of("").toAbsolutePath().normalize()),"Unexpected owned root");
            require(Runtime.version().toString().equals("25.0.4.1+1-LTS"),"JDK drift");
            require(Files.readString(RUN.resolve("preflight.txt")).startsWith("SOURCE="+args[0]+"\\n".replace("\\\\n","\\n")),"Source mismatch");
            preflight();prepare(args[0]);
        }catch(Exception failure){System.err.println("TLS_PREPARATION_FAILURE="+failure.getClass().getSimpleName()+":"+failure.getMessage());System.exit(2);}
    }

    static void preflight() throws Exception {
        safe(SNAPSHOT); safe(JAR);
        checkManifest(SNAPSHOT);
        checkManifest(PACKAGE.resolve("inputs.sha256"));
        String packagePin = Files.readString(RUN.resolve("package-sha256.txt")).split("  ", 2)[0];
        require(sha(JAR).equals(packagePin), "qualified package changed");
        require(Files.readString(RUN.resolve("build-result.txt")).contains("PACKAGE=PASS\n"), "package not qualified");
    }

    static void prepare(String source) throws Exception {
        require(!Files.exists(TLS, LinkOption.NOFOLLOW_LINKS), "TLS target already exists");
        require(portListeners().isEmpty(), "18447 already occupied");
        directory(TLS);
        String global = trustSnapshot();
        write(RUN.resolve("system-trust-before.tsv"), global);
        for (String name : List.of("key.password", "trust.password", "negative.password")) {
            byte[] random = new byte[32]; new SecureRandom().nextBytes(random);
            write(TLS.resolve(name), HexFormat.of().formatHex(random) + "\n");
            Arrays.fill(random, (byte)0);
        }
        keytool("generate-listener", List.of("-genkeypair", "-alias", "listener",
            "-keystore", TLS.resolve("listener.p12").toString(), "-storetype", "PKCS12",
            "-storepass:file", TLS.resolve("key.password").toString(),
            "-keypass:file", TLS.resolve("key.password").toString(),
            "-keyalg", "EC", "-groupname", "secp256r1", "-sigalg", "SHA256withECDSA",
            "-dname", "CN=T031 HTTPS loopback test,O=IDEA synthetic qualification",
            "-validity", "2", "-ext", "SAN=ip:127.0.0.1",
            "-ext", "KU=digitalSignature", "-ext", "EKU=serverAuth"));
        keytool("export-listener", List.of("-exportcert", "-alias", "listener",
            "-keystore", TLS.resolve("listener.p12").toString(), "-storetype", "PKCS12",
            "-storepass:file", TLS.resolve("key.password").toString(),
            "-file", TLS.resolve("certificate.der").toString()));
        keytool("import-positive", List.of("-importcert", "-noprompt", "-alias", "listener",
            "-keystore", TLS.resolve("positive-trust.p12").toString(), "-storetype", "PKCS12",
            "-storepass:file", TLS.resolve("trust.password").toString(),
            "-file", TLS.resolve("certificate.der").toString()));
        // Separate unrelated harness trust anchor: genuine PKIX rejection, not an empty-anchor error.
        keytool("generate-unrelated", List.of("-genkeypair", "-alias", "unrelated",
            "-keystore", TLS.resolve("unrelated-key.p12").toString(), "-storetype", "PKCS12",
            "-storepass:file", TLS.resolve("negative.password").toString(),
            "-keypass:file", TLS.resolve("negative.password").toString(),
            "-keyalg", "EC", "-groupname", "secp256r1", "-sigalg", "SHA256withECDSA",
            "-dname", "CN=T031 unrelated test anchor,O=IDEA synthetic qualification",
            "-validity", "2", "-ext", "BC=ca:true"));
        keytool("export-unrelated", List.of("-exportcert", "-alias", "unrelated",
            "-keystore", TLS.resolve("unrelated-key.p12").toString(), "-storetype", "PKCS12",
            "-storepass:file", TLS.resolve("negative.password").toString(),
            "-file", TLS.resolve("unrelated.der").toString()));
        keytool("import-negative", List.of("-importcert", "-noprompt", "-alias", "unrelated",
            "-keystore", TLS.resolve("negative-trust.p12").toString(), "-storetype", "PKCS12",
            "-storepass:file", TLS.resolve("negative.password").toString(),
            "-file", TLS.resolve("unrelated.der").toString()));
        try (var files = Files.list(TLS)) {
            for (Path p : files.toList()) {
                safe(p); Files.setPosixFilePermissions(p, PosixFilePermissions.fromString("rw-------"));
            }
        }
        X509Certificate cert = certificate();
        cert.checkValidity(); cert.verify(cert.getPublicKey());
        require(new ArrayList<>(cert.getSubjectAlternativeNames()).equals(List.of(List.of(7, "127.0.0.1"))), "SAN not exact IP-only");
        require(cert.getNotAfter().getTime() - cert.getNotBefore().getTime() == Duration.ofDays(2).toMillis(),
            "validity not two days");
        KeyStore positive = store("positive-trust.p12", "trust.password");
        KeyStore negative = store("negative-trust.p12", "negative.password");
        require(positive.size() == 1 && positive.isCertificateEntry("listener"), "positive truststore not dedicated");
        require(Arrays.equals(positive.getCertificate("listener").getEncoded(), cert.getEncoded()), "trust pin mismatch");
        require(negative.size() == 1 && negative.isCertificateEntry("unrelated")
            && !Arrays.equals(negative.getCertificate("unrelated").getEncoded(), cert.getEncoded()), "negative trusts listener");
        StringBuilder material = new StringBuilder();
        for (String name : List.of("listener.p12", "certificate.der", "positive-trust.p12",
            "negative-trust.p12", "unrelated.der", "unrelated-key.p12"))
            material.append(sha(TLS.resolve(name))).append("  ").append(TLS.resolve(name)).append('\n');
        write(RUN.resolve("tls-material.sha256"), material.toString());
        require(global.equals(trustSnapshot()), "system trust changed during preparation");
        preflight();
        String freeze = "SOURCE=" + source + "\nROOT=" + ROOT + "\nLISTENER=NOT_STARTED\n"
            + "SUBJECT=" + cert.getSubjectX500Principal().getName() + "\nSAN=IP:127.0.0.1\n"
            + "SERIAL_HEX=" + cert.getSerialNumber().toString(16) + "\n"
            + "NOT_BEFORE=" + cert.getNotBefore().toInstant() + "\nNOT_AFTER=" + cert.getNotAfter().toInstant() + "\n"
            + "CERT_SHA256=" + sha(TLS.resolve("certificate.der")) + "\n"
            + "KEYSTORE_SHA256=" + sha(TLS.resolve("listener.p12")) + "\n"
            + "TRUSTSTORE_SHA256=" + sha(TLS.resolve("positive-trust.p12")) + "\n"
            + "NEGATIVE_TRUSTSTORE_SHA256=" + sha(TLS.resolve("negative-trust.p12")) + "\n"
            + "MATERIAL_MANIFEST_SHA256=" + sha(RUN.resolve("tls-material.sha256")) + "\n"
            + "CONTROLLED_SNAPSHOT_SHA256=" + sha(SNAPSHOT) + "\n"
            + "SYSTEM_TRUST_SNAPSHOT_SHA256=" + sha(RUN.resolve("system-trust-before.tsv")) + "\n"
            + "JAR_SHA256=" + sha(JAR) + "\nGLOBAL_TRUST_UNCHANGED=PASS\n";
        write(FREEZE, freeze);
        System.out.print(freeze);
        System.out.println("TLS_FREEZE_SHA256=" + sha(FREEZE));
        System.out.println("TLS_PREPARATION=PASS;BOOT_LISTENER=NOT_STARTED");
    }

    static HttpClient client(String file, String passwordFile) throws Exception {
        TrustManagerFactory factory = TrustManagerFactory.getInstance(TrustManagerFactory.getDefaultAlgorithm());
        factory.init(store(file, passwordFile)); // Explicit dedicated store, never init(null)/global trust.
        SSLContext context = SSLContext.getInstance("TLS");
        context.init(null, factory.getTrustManagers(), new SecureRandom());
        SSLParameters parameters = new SSLParameters();
        parameters.setEndpointIdentificationAlgorithm("HTTPS");
        return HttpClient.newBuilder().sslContext(context).sslParameters(parameters)
            .version(HttpClient.Version.HTTP_1_1).connectTimeout(Duration.ofSeconds(5))
            .followRedirects(HttpClient.Redirect.NEVER).proxy(new ProxySelector() {
                public List<Proxy> select(URI uri) { return List.of(Proxy.NO_PROXY); }
                public void connectFailed(URI uri, SocketAddress address, IOException error) {}
            }).build();
    }
    static String redact(String message) throws Exception {
        String clean = String.valueOf(message).replaceAll("[\\r\\n\\p{Cntrl}]", " ");
        for (String name : List.of("key.password", "trust.password", "negative.password")) {
            Path file = TLS.resolve(name);
            if (Files.isRegularFile(file)) clean = clean.replace(Files.readString(file).strip(), "<REDACTED>");
        }
        return clean.substring(0, Math.min(clean.length(), 500));
    }
    static KeyStore store(String file, String passwordFile) throws Exception {
        char[] password = Files.readString(TLS.resolve(passwordFile)).strip().toCharArray();
        try {
            KeyStore store = KeyStore.getInstance("PKCS12");
            try (var input = Files.newInputStream(TLS.resolve(file))) { store.load(input, password); }
            return store;
        } finally { Arrays.fill(password, '\0'); }
    }
    static X509Certificate certificate() throws Exception {
        try (var in = Files.newInputStream(TLS.resolve("certificate.der"))) {
            return (X509Certificate)CertificateFactory.getInstance("X.509").generateCertificate(in);
        }
    }
    static void keytool(String name, List<String> arguments) throws Exception {
        List<String> command = new ArrayList<>(List.of(JDK.resolve("bin/keytool").toString(),
            "-J-Duser.home=" + RUN.resolve("empty-home")));
        command.addAll(arguments);
        write(RUN.resolve("keytool-" + name + "-command.txt"), String.join("\n", command) + "\n");
        Process process = builder(command, RUN.resolve("logs/keytool-" + name + ".log")).start();
        if (!process.waitFor(15, TimeUnit.SECONDS)) {
            process.destroy(); if (!process.waitFor(3, TimeUnit.SECONDS)) process.destroyForcibly();
            throw new IllegalStateException("keytool timeout");
        }
        require(process.exitValue() == 0, "keytool failed at " + name);
        Files.setPosixFilePermissions(RUN.resolve("logs/keytool-" + name + ".log"), PosixFilePermissions.fromString("rw-------"));
    }
    static ProcessBuilder builder(List<String> command, Path log) {
        var builder = new ProcessBuilder(command).directory(APP.toFile()).redirectErrorStream(true).redirectOutput(log.toFile());
        var env = builder.environment(); env.clear();
        env.put("HOME", RUN.resolve("empty-home").toString()); env.put("PATH", JDK.resolve("bin") + ":/usr/bin:/bin");
        env.put("LANG", "C.UTF-8");
        return builder;
    }
    static List<String> listeners() throws Exception {
        List<String> result = new ArrayList<>();
        for (String family : List.of("tcp", "tcp6")) {
            var lines = Files.readAllLines(Path.of("/proc/net", family));
            for (String line : lines.subList(1, lines.size())) {
                String[] row = line.strip().split("\\s+");
                if (row[3].equals("0A")) result.add(family + " " + row[1] + " " + row[9]);
            }
        }
        return result;
    }
    static List<String> portListeners() throws Exception {
        return listeners().stream().filter(r -> r.split(" ")[1].endsWith(LOCAL.substring(8))).toList();
    }
    static List<String> ownedListeners(long pid) throws Exception {
        Set<String> inodes = new HashSet<>();
        try (var files = Files.list(Path.of("/proc", Long.toString(pid), "fd"))) {
            for (Path fd : files.toList()) {
                try {
                    String link = Files.readSymbolicLink(fd).toString();
                    if (link.startsWith("socket:[")) inodes.add(link.substring(8, link.length()-1));
                } catch (NoSuchFileException transientFd) { }
            }
        }
        return listeners().stream().filter(r -> inodes.contains(r.split(" ")[2])).toList();
    }
    static String trustSnapshot() throws Exception {
        List<String> result = new ArrayList<>();
        for (Path root : List.of(Path.of("/etc/ssl/certs"), Path.of("/usr/local/share/ca-certificates"),
            Path.of("/etc/ca-certificates.conf"), JDK.resolve("lib/security/cacerts"))) {
            try (var files = Files.walk(root)) {
                for (Path p : files.sorted().toList()) {
                    if (Files.isSymbolicLink(p))
                        result.add(p + "\tLINK\t" + Files.readSymbolicLink(p) + "\t"
                            + (Files.isRegularFile(p) ? sha(p) : "NO_REGULAR_TARGET"));
                    else if (Files.isRegularFile(p)) result.add(p + "\tFILE\t" + sha(p));
                    else result.add(p + "\tDIRECTORY");
                }
            }
        }
        return String.join("\n", result) + "\n";
    }
    static void checkManifest(Path manifest) throws Exception {
        safe(manifest);
        for (String line : Files.readAllLines(manifest)) {
            require(line.matches("[0-9a-f]{64}  .+"), "bad manifest");
            Path path = Path.of(line.substring(66));
            if (!path.isAbsolute()) path = ROOT.resolve(path).normalize();
            // Host utility aliases are already exact pinned resolved coreutils paths in build preflight.
            require(Files.isRegularFile(path) && sha(path).equals(line.substring(0,64)), "controlled input hash drift");
        }
    }
    static void safe(Path file) throws Exception {
        require(file.startsWith(ROOT), "owned file escaped root");
        for (Path p = file; p != null; p = p.getParent())
            require(!Files.isSymbolicLink(p), "owned symlink");
        require(Files.isRegularFile(file), "owned regular file missing");
    }
    static void directory(Path path) throws Exception {
        Files.createDirectories(path); Files.setPosixFilePermissions(path, PosixFilePermissions.fromString("rwx------"));
    }
    static void write(Path path, String value) throws Exception {
        Files.writeString(path, value, StandardOpenOption.CREATE_NEW);
        Files.setPosixFilePermissions(path, PosixFilePermissions.fromString("rw-------"));
    }
    static String sha(Path file) throws Exception { return hash(Files.readAllBytes(file)); }
    static String hash(byte[] bytes) throws Exception {
        return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(bytes));
    }
    static void require(boolean ok, String message) { if (!ok) throw new IllegalStateException(message); }
}
