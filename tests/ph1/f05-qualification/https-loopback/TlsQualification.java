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
class TlsQualification {
    static final Path ROOT = Path.of("/home/phuclam/idea-f05a-20261003-37/https-qualification-02");
    static final Path PACKAGE = ROOT.resolve("tests/ph1/f05-qualification/https-loopback");
    static final Path JDK = Path.of("/opt/idea/tools/jdk-25.0.4.1+1");
    static final Path RUN = ROOT.resolve("run");
    static final Path APP = RUN.resolve("application");
    static final Path TLS = RUN.resolve("tls");
    static final Path JAR = APP.resolve("target/t027-jsr305-exclusion-0.1.0.jar");
    static final Path SNAPSHOT = RUN.resolve("controlled-originals.sha256");
    static final Path FREEZE = RUN.resolve("tls-freeze.txt");
    static final String BODY = "T027_HTTPS_PROBE_OK\n";
    static final String LOCAL = "0100007F:" + String.format("%04X", 18447);

    public static void main(String[] args) {
        try {
            require(args.length >= 2 && args[0].matches("[0-9a-f]{40}"), "exact source/phase required");
            require(ROOT.equals(Path.of("").toAbsolutePath().normalize()), "owned root mismatch");
            require(Runtime.version().toString().equals("25.0.4.1+1-LTS"), "JDK version drift");
            require("true".equals(System.getProperty("java.net.preferIPv4Stack")), "IPv4 pin missing");
            for (String key : List.of("JAVA_TOOL_OPTIONS", "_JAVA_OPTIONS", "JDK_JAVA_OPTIONS",
                "MAVEN_OPTS", "MAVEN_ARGS", "CLASSPATH", "MAVEN_EXT_CLASS_PATH", "MAVEN_PROJECTBASEDIR"))
                require(System.getenv(key) == null || System.getenv(key).isEmpty(), "injected environment");
            for (String key : List.of("javax.net.ssl.trustStore", "javax.net.ssl.keyStore",
                "jdk.internal.httpclient.disableHostnameVerification"))
                require(System.getProperty(key) == null, "global TLS override present");
            if (args.length == 2 && args[1].equals("self-check")) {
                checkManifest(PACKAGE.resolve("inputs.sha256"));
                classifierSelfCheck();
                return;
            }
            require(Files.readString(RUN.resolve("preflight.txt")).startsWith("SOURCE=" + args[0] + "\n"),
                "source does not match exact package build");
            preflight();
            if (args[1].equals("prepare") && args.length == 2) prepare(args[0]);
            else if (args[1].equals("probe") && args.length == 3 && args[2].matches("[0-9a-f]{64}"))
                probe(args[0], args[2]);
            else throw new IllegalStateException("unsupported phase");
        } catch (Exception failure) {
            System.err.println("STOP: " + failure.getClass().getSimpleName() + ": " + failure.getMessage());
            System.exit(2);
        }
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
            "-dname", "CN=T027 HTTPS loopback test,O=IDEA synthetic qualification",
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
            "-dname", "CN=T027 unrelated test anchor,O=IDEA synthetic qualification",
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

    static void probe(String source, String frozenHash) throws Exception {
        require(sha(FREEZE).equals(frozenHash), "published TLS freeze identity mismatch");
        String freeze = Files.readString(FREEZE);
        require(freeze.startsWith("SOURCE=" + source + "\n"), "TLS source mismatch");
        for (String key : List.of("MATERIAL_MANIFEST_SHA256", "CONTROLLED_SNAPSHOT_SHA256",
            "SYSTEM_TRUST_SNAPSHOT_SHA256", "JAR_SHA256")) {
            Path path = switch (key) {
                case "MATERIAL_MANIFEST_SHA256" -> RUN.resolve("tls-material.sha256");
                case "CONTROLLED_SNAPSHOT_SHA256" -> SNAPSHOT;
                case "SYSTEM_TRUST_SNAPSHOT_SHA256" -> RUN.resolve("system-trust-before.tsv");
                default -> JAR;
            };
            require(freeze.contains(key + "=" + sha(path) + "\n"), "frozen input changed: " + key);
        }
        checkManifest(RUN.resolve("tls-material.sha256"));
        require(Files.readString(RUN.resolve("system-trust-before.tsv")).equals(trustSnapshot()), "system trust pre-probe drift");
        for (String name : List.of("key.password", "trust.password", "negative.password")) {
            safe(TLS.resolve(name)); require(Files.readString(TLS.resolve(name)).matches("[0-9a-f]{64}\n"), "password input malformed");
            require(Files.getPosixFilePermissions(TLS.resolve(name)).equals(PosixFilePermissions.fromString("rw-------")),
                "password not private");
        }
        require(portListeners().isEmpty(), "18447 occupied before launch");
        write(RUN.resolve("probe-started.txt"), "SOURCE=" + source + "\n"); // Single-use phase, never silently rerun.
        List<String> command = List.of(JDK.resolve("bin/java").toString(), "-Djava.net.preferIPv4Stack=true",
            "-Duser.home=" + RUN.resolve("empty-home"), "-jar", JAR.toString());
        write(RUN.resolve("https-command.txt"), String.join("\n", command) + "\n");
        Path log = RUN.resolve("logs/https-boot.log");
        Process process = builder(command, log).start();
        List<String> results = new ArrayList<>();
        Exception pending = null;
        try {
            long deadline = System.nanoTime() + Duration.ofSeconds(30).toNanos();
            while (process.isAlive() && System.nanoTime() < deadline
                && !Files.readString(log).contains("Started BootProbe")) Thread.sleep(100);
            require(process.isAlive() && Files.readString(log).contains("Started BootProbe"), "Boot startup failure/timeout");
            List<String> owned = ownedListeners(process.pid());
            require(owned.size() == 1 && owned.getFirst().startsWith("tcp " + LOCAL + " "), "owned listener not exact IPv4 loopback");
            require(portListeners().size() == 1, "multiple 18447 listeners");
            results.add("OWNED_PID=" + process.pid()); results.add("LISTENER=" + owned.getFirst());
            results.add("EXACT_LOOPBACK_SINGLE_LISTENER=PASS");
            write(RUN.resolve("listener-observation.txt"), String.join("\n", results) + "\n");
            try (HttpClient positive = client("positive-trust.p12", "trust.password")) {
                var response = positive.send(request("127.0.0.1"), HttpResponse.BodyHandlers.ofString());
                require(response.statusCode() == 200 && response.body().equals(BODY)
                    && response.headers().firstValue("X-T027-Probe-Count").orElse("").equals("1"), "positive probe oracle");
                SSLSession session = response.sslSession().orElseThrow();
                X509Certificate peer = (X509Certificate)session.getPeerCertificates()[0];
                require(hash(peer.getEncoded()).equals(sha(TLS.resolve("certificate.der"))), "peer not frozen certificate");
                results.add("POSITIVE_HANDSHAKE_TRUST_ENDPOINT_RESPONSE=PASS");
                results.add("HTTP_STATUS=200"); results.add("HTTP_BODY=T027_HTTPS_PROBE_OK\\n");
                results.add("TLS_PROTOCOL=" + session.getProtocol()); results.add("CIPHER_SUITE=" + session.getCipherSuite());
                results.add("SUBJECT=" + peer.getSubjectX500Principal().getName()); results.add("SAN=IP:127.0.0.1");
                results.add("SERIAL_HEX=" + peer.getSerialNumber().toString(16)); results.add("CERT_SHA256=" + hash(peer.getEncoded()));
                write(RUN.resolve("positive-observation.txt"), String.join("\n", results) + "\n");
            }
            try (HttpClient untrusted = client("negative-trust.p12", "negative.password")) {
                refusal(untrusted, "127.0.0.1", "trust");
            }
            results.add("UNTRUSTED_CHAIN_HANDSHAKE_REFUSAL=PASS");
            try (HttpClient mismatched = client("positive-trust.p12", "trust.password")) {
                refusal(mismatched, "localhost", "endpoint");
            }
            results.add("MISMATCHED_DNS_IDENTITY_HANDSHAKE_REFUSAL=PASS");
            try (HttpClient positive = client("positive-trust.p12", "trust.password")) {
                var response = positive.send(request("127.0.0.1"), HttpResponse.BodyHandlers.ofString());
                require(response.statusCode() == 200 && response.body().equals(BODY)
                    && response.headers().firstValue("X-T027-Probe-Count").orElse("").equals("2"), "negative reached application");
            }
            results.add("NEGATIVE_PROBES_NOT_DISPATCHED_TO_APPLICATION=PASS");
            require(ownedListeners(process.pid()).size() == 1 && portListeners().size() == 1, "listener scope drift");
        } catch (Exception failure) {
            pending = failure;
            write(RUN.resolve("probe-stop-observation.txt"), String.join("\n", results) + "\n"
                + "STOP_CLASS=" + failure.getClass().getName() + "\n" + "STOP_MESSAGE=" + redact(failure.getMessage()) + "\n");
        } finally {
            process.destroy();
            boolean clean = process.waitFor(10, TimeUnit.SECONDS);
            if (!clean) { process.destroyForcibly(); process.waitFor(5, TimeUnit.SECONDS); }
            Files.setPosixFilePermissions(log, PosixFilePermissions.fromString("rw-------"));
            write(RUN.resolve("cleanup.txt"), "OWNED_PID=" + process.pid() + "\nNORMAL_TERMINATION=" + clean
                + "\nPROCESS_ALIVE=" + process.isAlive() + "\nREMAINING_18447_LISTENERS=" + portListeners().size() + "\n");
            require(clean && !process.isAlive() && portListeners().isEmpty(), "owned listener cleanup failure");
        }
        if (pending != null) throw pending;
        require(Files.readString(log).contains("T027_PROBE_TOTAL=2"), "shutdown probe count not exact");
        for (String name : List.of("key.password", "trust.password", "negative.password"))
            require(!Files.readString(log).contains(Files.readString(TLS.resolve(name)).strip()), "secret found in retained log");
        checkManifest(RUN.resolve("tls-material.sha256")); preflight();
        require(Files.readString(RUN.resolve("system-trust-before.tsv")).equals(trustSnapshot()), "system trust post-probe drift");
        results.add("CLEAN_SHUTDOWN_NO_LISTENER=PASS");
        results.add("SYSTEM_TRUST_UNCHANGED=PASS"); results.add("FINAL_CONTROLLED_INPUTS_TOOLS_UNCHANGED=PASS");
        results.add("SOURCE=" + source); results.add("TLS_FREEZE_SHA256=" + frozenHash); results.add("JAR_SHA256=" + sha(JAR));
        results.add("T027_HTTPS_LOOPBACK_QUALIFICATION=PASS");
        write(RUN.resolve("https-result.txt"), String.join("\n", results) + "\n");
        System.out.print(Files.readString(RUN.resolve("https-result.txt")));
    }

    static HttpRequest request(String host) {
        return HttpRequest.newBuilder(URI.create("https://" + host + ":18447/synthetic-probe"))
            .timeout(Duration.ofSeconds(8)).GET().build();
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
    static void refusal(HttpClient client, String host, String kind) throws Exception {
        try {
            client.send(request(host), HttpResponse.BodyHandlers.ofString());
            throw new IllegalStateException("negative TLS request unexpectedly succeeded");
        } catch (SSLHandshakeException expected) {
            StringBuilder causes = new StringBuilder();
            for (Throwable t = expected; t != null; t = t.getCause())
                causes.append(t.getClass().getName()).append(':').append(redact(t.getMessage())).append('\n');
            write(RUN.resolve("negative-" + kind + "-observation.txt"), "HOST=" + host + "\n" + causes);
            String text = causes.toString().toLowerCase(Locale.ROOT);
            require(kind.equals("trust") ? text.contains("certpath") || text.contains("pkix")
                : endpointMismatch(expected, host), "wrong TLS refusal category");
            System.out.println("TLS_NEGATIVE_" + kind.toUpperCase(Locale.ROOT) + "=SSLHandshakeException");
        }
    }
    static boolean endpointMismatch(Throwable failure, String host) {
        if (!(failure instanceof SSLHandshakeException) || !host.equals("localhost")) return false;
        for (Throwable t = failure.getCause(); t != null; t = t.getCause()) {
            if (t instanceof CertificateException && Set.of(
                "No name matching localhost found",
                "No subject alternative DNS name matching localhost found.").contains(t.getMessage())) return true;
        }
        return false;
    }
    static SSLHandshakeException handshake(Throwable cause) {
        var exception = new SSLHandshakeException("synthetic classifier fixture");
        exception.initCause(cause); return exception;
    }
    static void classifierSelfCheck() {
        var cnMismatch = handshake(new CertificateException("No name matching localhost found"));
        String legacyMessage = cnMismatch.getCause().getMessage().toLowerCase(Locale.ROOT);
        require(!(legacyMessage.contains("subject alternative") && legacyMessage.contains("localhost")),
            "legacy false-positive witness changed");
        require(endpointMismatch(cnMismatch, "localhost"), "CN mismatch not classified");
        require(endpointMismatch(handshake(new CertificateException(
            "No subject alternative DNS name matching localhost found.")), "localhost"), "DNS mismatch not classified");
        for (Throwable cause : List.of(new CertificateException("PKIX path building failed"),
            new CertificateExpiredException("expired"), new IOException("No name matching localhost found"),
            new CertificateException("No name matching otherhost found")))
            require(!endpointMismatch(handshake(cause), "localhost"), "unrelated handshake accepted");
        require(!endpointMismatch(cnMismatch, "otherhost"), "target host not pinned");
        require(!endpointMismatch(new SSLHandshakeException("No name matching localhost found"), "localhost"),
            "missing certificate cause accepted");
        System.out.println("CLASSIFIER_LEGACY_RED_WITNESS=REJECTS_KNOWN_CN_MISMATCH");
        System.out.println("CLASSIFIER_SELF_CHECK=PASS;POSITIVE=2;NEGATIVE=6");
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
