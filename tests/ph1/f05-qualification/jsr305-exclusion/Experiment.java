import java.io.*;
import java.nio.file.*;
import java.nio.file.attribute.PosixFilePermissions;
import java.security.MessageDigest;
import java.time.Duration;
import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.regex.*;
import java.util.zip.*;
import java.util.jar.Manifest;
import javax.xml.parsers.DocumentBuilderFactory;

/** Exact, single-use offline qualification runner. No third-party Java dependency. */
class Experiment {
    static final Path ROOT = Path.of("/home/phuclam/idea-f05a-20261003-37/jsr305-exclusion-01");
    static final Path PACKAGE = ROOT.resolve("tests/ph1/f05-qualification/jsr305-exclusion");
    static final Path CACHE = Path.of("/home/phuclam/.m2/repository");
    static final Path JDK = Path.of("/opt/idea/tools/jdk-25.0.4.1+1");
    static final Path MAVEN = Path.of("/home/phuclam/.m2/wrapper/dists/apache-maven-3.9.16/510fba38");
    static final Path RUN = ROOT.resolve("run");
    static final Path REPO = RUN.resolve("repository");
    static final Path APP = RUN.resolve("application");
    static final String INV = "docs/research/inventories/";
    static final String[] GOALS = {
        "org.apache.maven.plugins:maven-resources-plugin:3.5.0:resources",
        "org.apache.maven.plugins:maven-compiler-plugin:3.15.0:compile",
        "org.apache.maven.plugins:maven-jar-plugin:3.5.1:jar",
        "org.springframework.boot:spring-boot-maven-plugin:4.1.1:repackage"
    };
    static final Map<Path, String> ORIGINALS = new LinkedHashMap<>();
    static final Set<String> JSR_CLASSES = Set.of("javax/annotation/Nullable.class",
        "javax/annotation/Nonnull.class", "javax/annotation/ParametersAreNonnullByDefault.class",
        "javax/annotation/CheckReturnValue.class", "javax/annotation/meta/TypeQualifier.class");
    static List<Map<String,String>> graph;
    static Map<String,Map<String,String>> artifacts;

    public static void main(String[] args) {
        try {
            require(args.length == 1 && args[0].matches("[0-9a-f]{40}"), "exact source SHA required");
            require(ROOT.equals(Path.of("").toAbsolutePath().normalize()), "unexpected working directory");
            require(Runtime.version().toString().equals("25.0.4.1+1-LTS"), "JDK runtime drift");
            checkInputs();
            checkEnvironment();
            graph = rows(ROOT.resolve(INV + "f05a-q02-jsr305-exclusion-proposed-graph.tsv"));
            artifacts = new LinkedHashMap<>();
            for (var row : graph) {
                require(!row.get("coordinate").contains(":jsr305:"), "JSR305 in proposed graph");
                var previous = artifacts.putIfAbsent(row.get("coordinate"), row);
                if (previous != null) require(previous.get("jar_sha256").equals(row.get("jar_sha256")),
                    "inconsistent graph hash");
            }
            require(graph.size() == 115 && artifacts.size() == 99, "graph count drift");
            compareHistoricalGraph();
            checkToolsAndCore();
            var models = rows(ROOT.resolve(INV + "f05a-q02-models.tsv")).stream()
                .filter(r -> !r.get("coordinate").equals("com.google.code.findbugs:jsr305:3.0.2")).toList();
            require(models.size() == 242, "model count drift");
            for (var row : artifacts.values()) {
                remember(Path.of(row.get("jar_path")), row.get("jar_sha256"));
                remember(Path.of(row.get("pom_path")), row.get("pom_sha256"));
                rejectJsrProvider(Path.of(row.get("jar_path")));
            }
            for (var row : models) remember(Path.of(row.get("pom_path")), row.get("pom_sha256"));
            require(!Files.exists(RUN, LinkOption.NOFOLLOW_LINKS), "fresh run directory already exists");
            directory(RUN); directory(REPO); directory(APP); directory(RUN.resolve("logs"));
            directory(RUN.resolve("empty-home")); directory(RUN.resolve("legal"));
            for (var entry : ORIGINALS.entrySet()) {
                if (entry.getKey().startsWith(CACHE)) copyCached(entry.getKey(), entry.getValue());
            }
            checkRepository();
            copy(PACKAGE.resolve("pom.xml"), APP.resolve("pom.xml"));
            copy(PACKAGE.resolve("src/main/java/com/idea/qualification/BootProbe.java"),
                APP.resolve("src/main/java/com/idea/qualification/BootProbe.java"));
            preserveLegal();
            String preflight = "SOURCE=" + args[0] + "\nJDK=" + JDK + "\nJAVA=25.0.4.1+1-LTS\nMAVEN=" + MAVEN
                + "\nMAVEN_VERSION=3.9.16\nREPOSITORY=" + REPO
                + "\nACQUIRED_JARS=99\nMODEL_POMS=242\nGRAPH_ROWS=115\nJSR305_ABSENT=PASS\n";
            write(RUN.resolve("preflight.txt"), preflight);
            System.out.println("PREFLIGHT=PASS;JARS=99;POMS=242;JSR305=ABSENT");
            List<String> command = new ArrayList<>(List.of(MAVEN.resolve("bin/mvn").toString(),
                "--offline", "--batch-mode", "--no-transfer-progress", "-X", "-Dstyle.color=never",
                "--settings", PACKAGE.resolve("empty-settings.xml").toString(),
                "--global-settings", PACKAGE.resolve("empty-settings.xml").toString(),
                "-Dmaven.repo.local=" + REPO, "-f", APP.resolve("pom.xml").toString()));
            command.addAll(List.of(GOALS));
            write(RUN.resolve("maven-command.txt"), String.join("\n", command) + "\n");
            int exit = execute(command, RUN.resolve("logs/maven.log"), Duration.ofMinutes(3));
            String log = Files.readString(RUN.resolve("logs/maven.log")).replaceAll("\\x1B\\[[0-9;]*m", "");
            require(exit == 0 && log.contains("BUILD SUCCESS"), "Maven failed; inspect retained bounded log");
            require(log.contains("Apache Maven 3.9.16"), "actual Maven version absent or different");
            actualGraphs(log);
            checkRepository();
            Path jar = APP.resolve("target/t027-jsr305-exclusion-0.1.0.jar");
            packageOracle(jar);
            String jarHash = sha(jar);
            write(RUN.resolve("package-sha256.txt"), jarHash + "  " + jar + "\n");
            System.out.println("MAVEN=PASS;ACTUAL_GRAPH=PASS;PACKAGE=PASS;JAR_SHA256=" + jarHash);
            List<String> smoke = List.of(JDK.resolve("bin/java").toString(), "-jar", jar.toString(),
                "--spring.main.web-application-type=none");
            write(RUN.resolve("boot-command.txt"), String.join("\n", smoke) + "\n");
            int boot = execute(smoke, RUN.resolve("logs/boot.log"), Duration.ofSeconds(30));
            String bootLog = Files.readString(RUN.resolve("logs/boot.log"));
            require(boot == 0 && bootLog.contains("T027_NON_WEB_CONTEXT_UP=PASS;BOOT=4.1.1;JAVA=25")
                && bootLog.contains("T027_NON_WEB_CONTEXT_CLOSED=PASS"), "non-web Boot smoke failed");
            for (var entry : ORIGINALS.entrySet()) require(sha(entry.getKey()).equals(entry.getValue()),
                "original controlled input changed");
            write(RUN.resolve("result.txt"), preflight + "MAVEN=PASS\nACTUAL_GRAPH=PASS\nPACKAGE=PASS\n"
                + "BOOT_NON_WEB=PASS\nORIGINAL_CONTROLLED_CACHE_INPUTS_UNCHANGED=PASS\nJAR_SHA256=" + jarHash
                + "\nJSR305_GRAPH_REPAIR=QUALIFIED\n");
            System.out.println("JSR305_GRAPH_REPAIR=QUALIFIED;BOOT_NON_WEB=PASS;ORIGINAL_INPUTS=UNCHANGED");
        } catch (Exception failure) {
            System.err.println("STOP: " + failure.getClass().getSimpleName() + ": " + failure.getMessage());
            System.exit(2);
        }
    }

    static void checkInputs() throws Exception {
        for (String line : Files.readAllLines(PACKAGE.resolve("inputs.sha256"))) {
            require(line.matches("[0-9a-f]{64}  .+"), "invalid source checksum line");
            Path p = ROOT.resolve(line.substring(66)).normalize();
            require(p.startsWith(ROOT), "source path escaped owned root");
            noSymlink(p);
            require(sha(p).equals(line.substring(0,64)), "published first-party input drift: " + p);
        }
    }

    static void checkEnvironment() throws Exception {
        for (String key : List.of("JAVA_TOOL_OPTIONS", "_JAVA_OPTIONS", "JDK_JAVA_OPTIONS", "MAVEN_OPTS",
            "MAVEN_ARGS", "CLASSPATH", "MAVEN_EXT_CLASS_PATH", "MAVEN_PROJECTBASEDIR")) {
            require(System.getenv(key) == null || System.getenv(key).isEmpty(), "injected environment: " + key);
        }
        for (Path ancestor = ROOT; ancestor != null; ancestor = ancestor.getParent())
            require(!Files.exists(ancestor.resolve(".mvn")), "unexpected ancestral .mvn: " + ancestor);
        var factory = DocumentBuilderFactory.newInstance();
        factory.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);
        factory.setFeature("http://xml.org/sax/features/external-general-entities", false);
        factory.setFeature("http://xml.org/sax/features/external-parameter-entities", false);
        factory.setNamespaceAware(true);
        var parser = factory.newDocumentBuilder();
        var settings = parser.parse(PACKAGE.resolve("empty-settings.xml").toFile());
        require(settings.getDocumentElement().getChildNodes().getLength() == 0, "settings not empty");
        var toolchains = parser.parse(MAVEN.resolve("conf/toolchains.xml").toFile());
        require(toolchains.getElementsByTagNameNS("*", "toolchain").getLength() == 0, "active global toolchain");
        require(!Files.exists(Path.of(System.getProperty("user.home"), ".m2", "toolchains.xml"),
            LinkOption.NOFOLLOW_LINKS), "unexpected user toolchains input");
        try (var files = Files.walk(MAVEN.resolve("lib/ext"))) {
            require(files.noneMatch(p -> p.toString().endsWith(".jar")), "unexpected Maven core extension");
        }
    }

    static void checkToolsAndCore() throws Exception {
        for (var row : rows(PACKAGE.resolve("toolchain.tsv"))) {
            Path path = Path.of(row.get("path"));
            if (Set.of("/usr/bin/sha256sum", "/usr/bin/dirname", "/usr/bin/uname", "/usr/bin/env").contains(path.toString())) {
                Path resolved = Path.of("/usr/lib/cargo/bin/coreutils/" + path.getFileName());
                require(path.toRealPath().equals(resolved), "host utility alias drift");
                remember(resolved, row.get("sha256"));
                ORIGINALS.put(path, row.get("sha256"));
            } else remember(path, row.get("sha256"));
        }
        var core = rows(ROOT.resolve(INV + "f05a-q02-maven-distribution.tsv"));
        require(core.size() == 52, "core inventory count drift");
        Set<Path> expected = new HashSet<>();
        for (var row : core) {
            Path jar = Path.of(row.get("jar_path")); expected.add(jar);
            remember(jar, row.get("jar_sha256")); rejectJsrProvider(jar);
        }
        Set<Path> actual = new HashSet<>();
        for (String child : List.of("lib", "boot")) try (var files = Files.list(MAVEN.resolve(child))) {
            files.filter(p -> p.toString().endsWith(".jar")).forEach(actual::add);
        }
        require(actual.equals(expected), "installed core JAR set differs");
    }

    static void compareHistoricalGraph() throws Exception {
        var old = rows(ROOT.resolve(INV + "f05a-q02-effective-graphs.tsv"));
        var narrowed = old.stream().filter(r -> !r.get("coordinate").equals("com.google.code.findbugs:jsr305:3.0.2"))
            .map(r -> new LinkedHashMap<>(r)).toList();
        var proposed = graph.stream().map(r -> {
            var copy = new LinkedHashMap<>(r); copy.remove("proposal_state"); return copy;
        }).toList();
        require(old.size() == 116 && narrowed.equals(proposed), "delta is not JSR305-only");
        require(graph.stream().filter(r -> r.get("realm").equals("application")).count() == 38, "runtime graph drift");
    }

    static void remember(Path path, String expected) throws Exception {
        require(expected.matches("[0-9a-f]{64}"), "invalid controlled hash");
        noSymlink(path);
        require(sha(path).equals(expected), "cached/tooling hash drift: " + path);
        String previous = ORIGINALS.putIfAbsent(path, expected);
        require(previous == null || previous.equals(expected), "inconsistent cached input hash");
    }

    static void copyCached(Path original, String expected) throws Exception {
        require(original.startsWith(CACHE), "cache path escape");
        Path target = REPO.resolve(CACHE.relativize(original));
        require(!CACHE.relativize(original).toString().contains("jsr305"), "JSR305 copy attempted");
        copy(original, target);
        require(sha(target).equals(expected), "copy checksum mismatch");
    }

    static void checkRepository() throws Exception {
        Set<Path> expected = new HashSet<>();
        for (Path p : ORIGINALS.keySet()) if (p.startsWith(CACHE)) expected.add(REPO.resolve(CACHE.relativize(p)));
        Set<Path> actual = new HashSet<>();
        try (var files = Files.walk(REPO)) {
            for (Path p : files.toList()) {
                require(!Files.isSymbolicLink(p), "repository symlink");
                require(!REPO.relativize(p).toString().contains("jsr305"), "JSR305 repository path or failed-resolution attempt");
                if (Files.isRegularFile(p)) {
                    // Resolver-generated origin bookkeeping is not a new artifact or executable input.
                    if (p.getFileName().toString().equals("_remote.repositories")) continue;
                    actual.add(p);
                }
            }
        }
        require(actual.equals(expected), "isolated repository file-set drift");
        require(actual.stream().filter(p -> p.toString().endsWith(".jar")).count() == 99, "JAR count drift");
        require(actual.stream().filter(p -> p.toString().endsWith(".pom")).count() == 242, "POM count drift");
        for (var entry : ORIGINALS.entrySet()) if (entry.getKey().startsWith(CACHE))
            require(sha(REPO.resolve(CACHE.relativize(entry.getKey()))).equals(entry.getValue()), "repository hash drift");
    }

    static void preserveLegal() throws Exception {
        int count = 0;
        for (var row : rows(ROOT.resolve(INV + "f05a-q02-used-legal-files.tsv"))) {
            var artifact = artifacts.get(row.get("coordinate"));
            if (artifact == null) continue;
            try (var zip = new ZipFile(artifact.get("jar_path"))) {
                byte[] bytes = zip.getInputStream(Objects.requireNonNull(zip.getEntry(row.get("entry")))).readAllBytes();
                require(hash(bytes).equals(row.get("sha256")), "legal entry drift");
                Path target = RUN.resolve("legal/artifacts/" + row.get("coordinate").replace(':','/') + "/" + row.get("entry"));
                require(target.normalize().startsWith(RUN.resolve("legal/artifacts")), "legal path escape");
                bytes(target, bytes); count++;
            }
        }
        for (String file : List.of("LICENSE", "NOTICE")) copy(MAVEN.resolve(file), RUN.resolve("legal/maven/" + file));
        for (Path p : ORIGINALS.keySet()) if (p.startsWith(MAVEN.resolve("lib")) && p.toString().endsWith(".license"))
            copy(p, RUN.resolve("legal/maven/lib/" + p.getFileName()));
        Path loaderTools = Path.of(artifacts.get("org.springframework.boot:spring-boot-loader-tools:4.1.1").get("jar_path"));
        try (var zip = new ZipFile(loaderTools.toFile())) {
            bytes(RUN.resolve("legal/spring-boot-loader.jar"),
                zip.getInputStream(zip.getEntry("META-INF/loader/spring-boot-loader.jar")).readAllBytes());
        }
        write(RUN.resolve("legal/README.txt"), "Internal T027 qualification only. Embedded legal files retained: " + count
            + ". Maven LICENSE/NOTICE and accompanying lib notices retained. Embedded loader archive retained with legal entries.\n"
            + "No legal/commercial/redistribution approval. Exact known-term process exception and source-handling obligations remain.\n");
    }

    static void actualGraphs(String log) throws Exception {
        Map<String,Set<String>> trees = new LinkedHashMap<>();
        Map<String,Set<String>> realms = new LinkedHashMap<>();
        String currentTree = null, currentRealm = null;
        Pattern dependency = Pattern.compile("^\\[DEBUG\\] ( *)([^ :]+):([^ :]+):jar:([^ :]+)(?::(compile|runtime|provided|test|system))?(?: .*)?$");
        Pattern included = Pattern.compile("^\\[DEBUG\\]   Included: ([^: ]+):([^: ]+):jar:([^: ]+)$");
        for (String line : log.split("\\R")) {
            if (line.contains("com.google.code.findbugs:jsr305") &&
                !line.contains("exclusion") && !line.contains("<") && !line.contains("excludedArtifacts"))
                throw new IllegalStateException("JSR305 requested/resolved in Maven diagnostics");
            if (line.startsWith("[DEBUG] Created new class realm plugin>")) {
                currentRealm = line.substring(line.indexOf("plugin>") + 7).trim();
                realms.putIfAbsent(currentRealm, new LinkedHashSet<>());
            }
            var inc = included.matcher(line);
            if (inc.matches() && currentRealm != null)
                realms.get(currentRealm).add(inc.group(1) + ":" + inc.group(2) + ":" + inc.group(3));
            var dep = dependency.matcher(line);
            if (!dep.matches()) continue;
            String coordinate = dep.group(2) + ":" + dep.group(3) + ":" + dep.group(4);
            if (dep.group(1).isEmpty()) {
                if (coordinate.equals("com.idea.qualification:t027-jsr305-exclusion:0.1.0")) currentTree = "application";
                else if (graph.stream().anyMatch(r -> r.get("realm").equals(coordinate))) currentTree = coordinate;
                else { currentTree = null; continue; }
                trees.putIfAbsent(currentTree, new LinkedHashSet<>());
                if (!currentTree.equals("application")) trees.get(currentTree).add(coordinate);
            } else if (currentTree != null) {
                trees.get(currentTree).add(coordinate);
            }
        }
        List<String> witness = new ArrayList<>(List.of("kind\trealm\tcoordinate"));
        Set<String> expectedRealms = new LinkedHashSet<>();
        for (var row : graph) expectedRealms.add(row.get("realm"));
        require(trees.keySet().equals(expectedRealms), "actual dependency diagnostic tree missing/unexpected");
        for (String realm : expectedRealms) {
            Set<String> expected = new LinkedHashSet<>();
            for (var row : graph) if (row.get("realm").equals(realm)) expected.add(row.get("coordinate"));
            require(expected.equals(trees.get(realm)), "actual acquisition graph differs: " + realm
                + "; missing=" + difference(expected, trees.get(realm)) + "; extra=" + difference(trees.get(realm), expected));
            for (String coordinate : trees.get(realm)) witness.add("collection\t" + realm + "\t" + coordinate);
            if (realm.equals("application")) continue;
            Set<String> filtered = new HashSet<>();
            if (realm.contains("resources-plugin")) filtered.add("org.eclipse.sisu:org.eclipse.sisu.plexus:0.9.0.M4");
            if (realm.startsWith("org.apache.maven.plugins:")) filtered.add("javax.inject:javax.inject:1");
            if (realm.startsWith("org.springframework.boot:")) {
                filtered.add("org.apache.maven.resolver:maven-resolver-api:1.4.1");
                filtered.add("org.apache.maven.resolver:maven-resolver-util:1.4.1");
            }
            filtered.add("org.slf4j:slf4j-api:1.7.36");
            expected.removeAll(filtered);
            require(expected.equals(realms.get(realm)), "actual plugin realm differs: " + realm);
            for (String coordinate : realms.get(realm)) witness.add("realm\t" + realm + "\t" + coordinate);
        }
        require(realms.size() == 4, "unexpected plugin realm");
        write(RUN.resolve("actual-graphs.tsv"), String.join("\n", witness) + "\n");
    }

    static Set<String> difference(Set<String> a, Set<String> b) {
        Set<String> result = new TreeSet<>(a); result.removeAll(b); return result;
    }

    static void packageOracle(Path jar) throws Exception {
        Map<String,String> expected = new TreeMap<>();
        for (var row : graph) if (row.get("realm").equals("application"))
            expected.put(Path.of(row.get("jar_path")).getFileName().toString(), row.get("jar_sha256"));
        Map<String,String> actual = new TreeMap<>();
        rejectJsrProvider(jar);
        try (var zip = new ZipFile(jar.toFile())) {
            Manifest manifest = new Manifest(zip.getInputStream(zip.getEntry("META-INF/MANIFEST.MF")));
            var attrs = manifest.getMainAttributes();
            require("org.springframework.boot.loader.launch.JarLauncher".equals(attrs.getValue("Main-Class")), "loader manifest drift");
            require("com.idea.qualification.BootProbe".equals(attrs.getValue("Start-Class")), "main class drift");
            require("4.1.1".equals(attrs.getValue("Spring-Boot-Version")), "Boot version drift");
            byte[] probe = zip.getInputStream(zip.getEntry("BOOT-INF/classes/com/idea/qualification/BootProbe.class")).readAllBytes();
            require(probe.length > 8 && probe[6] == 0 && Byte.toUnsignedInt(probe[7]) == 69, "not Java25 bytecode");
            for (var entry : Collections.list(zip.entries())) {
                if (entry.getName().startsWith("BOOT-INF/lib/") && !entry.isDirectory()) {
                    require(entry.getName().endsWith(".jar"), "unexpected runtime payload");
                    byte[] bytes = zip.getInputStream(entry).readAllBytes();
                    actual.put(entry.getName().substring("BOOT-INF/lib/".length()), hash(bytes));
                    rejectJsrProvider(bytes);
                }
            }
            Path tools = Path.of(artifacts.get("org.springframework.boot:spring-boot-loader-tools:4.1.1").get("jar_path"));
            try (var source = new ZipFile(tools.toFile())) {
                byte[] loader = source.getInputStream(source.getEntry("META-INF/loader/spring-boot-loader.jar")).readAllBytes();
                require(hash(loader).equals("1006db85adfa2ff98d22671ca631400bfe4a220e0dad336d5dc42519a5a3bafe"), "embedded loader drift");
                Set<String> expectedClasses = new TreeSet<>();
                try (var nested = new ZipInputStream(new ByteArrayInputStream(loader))) {
                    for (ZipEntry entry; (entry = nested.getNextEntry()) != null;) if (entry.getName().endsWith(".class")) {
                        expectedClasses.add(entry.getName());
                        var actualEntry = zip.getEntry(entry.getName());
                        require(actualEntry != null && hash(nested.readAllBytes()).equals(hash(zip.getInputStream(actualEntry).readAllBytes())),
                            "repackaged loader class drift");
                    }
                }
                Set<String> actualClasses = new TreeSet<>();
                for (var entry : Collections.list(zip.entries()))
                    if (entry.getName().startsWith("org/springframework/boot/loader/") && entry.getName().endsWith(".class"))
                        actualClasses.add(entry.getName());
                require(actualClasses.equals(expectedClasses), "loader class set drift");
            }
        }
        require(actual.equals(expected), "BOOT-INF/lib is not exact 38-JAR runtime set");
        StringBuilder result = new StringBuilder("jar\tsha256\n");
        actual.forEach((name,hash) -> result.append(name).append('\t').append(hash).append('\n'));
        write(RUN.resolve("package-runtime.tsv"), result.toString());
    }

    static void rejectJsrProvider(Path jar) throws Exception {
        try (var zip = new ZipFile(jar.toFile())) {
            for (var entry : Collections.list(zip.entries()))
                require(!isJsr(entry.getName()), "JSR305 provider in controlled JAR: " + jar);
        }
    }

    static void rejectJsrProvider(byte[] jar) throws Exception {
        try (var zip = new ZipInputStream(new ByteArrayInputStream(jar))) {
            for (ZipEntry entry; (entry = zip.getNextEntry()) != null;)
                require(!isJsr(entry.getName()), "copied/shaded JSR305 provider in runtime");
        }
    }

    static boolean isJsr(String name) {
        return JSR_CLASSES.stream().anyMatch(name::endsWith) || name.contains("jsr305")
            || name.endsWith("javax/annotation/meta/TypeQualifierDefault.class");
    }

    static int execute(List<String> command, Path log, Duration timeout) throws Exception {
        ProcessBuilder builder = new ProcessBuilder(command);
        builder.directory(APP.toFile()).redirectErrorStream(true).redirectOutput(log.toFile());
        Map<String,String> env = builder.environment(); env.clear();
        env.put("JAVA_HOME", JDK.toString()); env.put("HOME", RUN.resolve("empty-home").toString());
        env.put("PATH", JDK.resolve("bin") + ":/usr/bin:/bin"); env.put("LANG", "C.UTF-8");
        env.put("MAVEN_SKIP_RC", "true");
        Process process = builder.start();
        if (!process.waitFor(timeout.toMillis(), TimeUnit.MILLISECONDS)) {
            List<ProcessHandle> children = process.descendants().toList();
            children.forEach(ProcessHandle::destroy);
            process.destroy();
            process.waitFor(3, TimeUnit.SECONDS);
            children.stream().filter(ProcessHandle::isAlive).forEach(ProcessHandle::destroyForcibly);
            if (process.isAlive()) process.destroyForcibly();
            throw new IllegalStateException("owned process timeout; no successor execution");
        }
        Files.setPosixFilePermissions(log, PosixFilePermissions.fromString("rw-------"));
        return process.exitValue();
    }

    static List<Map<String,String>> rows(Path file) throws Exception {
        var lines = Files.readAllLines(file);
        String[] headers = lines.getFirst().split("\t", -1);
        List<Map<String,String>> result = new ArrayList<>();
        for (String line : lines.subList(1, lines.size())) {
            if (line.isBlank()) continue;
            String[] values = line.split("\t", -1);
            require(values.length == headers.length, "malformed TSV");
            Map<String,String> row = new LinkedHashMap<>();
            for (int i=0; i<headers.length; i++) row.put(headers[i],values[i]);
            result.add(row);
        }
        return result;
    }

    static void noSymlink(Path path) throws Exception {
        for (Path current = path; current != null; current = current.getParent())
            require(!Files.isSymbolicLink(current), "symlinked input: " + current);
        require(Files.isRegularFile(path), "missing regular input: " + path);
    }
    static String sha(Path p) throws Exception { return hash(Files.readAllBytes(p)); }
    static String hash(byte[] bytes) throws Exception {
        return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(bytes));
    }
    static void directory(Path path) throws Exception {
        Files.createDirectories(path);
        Files.setPosixFilePermissions(path, PosixFilePermissions.fromString("rwx------"));
    }
    static void copy(Path from, Path to) throws Exception {
        directory(to.getParent()); Files.copy(from,to); Files.setPosixFilePermissions(to,PosixFilePermissions.fromString("rw-------"));
    }
    static void bytes(Path to, byte[] data) throws Exception {
        directory(to.getParent()); Files.write(to,data,StandardOpenOption.CREATE_NEW);
        Files.setPosixFilePermissions(to,PosixFilePermissions.fromString("rw-------"));
    }
    static void write(Path to, String text) throws Exception { bytes(to,text.getBytes(java.nio.charset.StandardCharsets.UTF_8)); }
    static void require(boolean ok, String message) {
        if (!ok) throw new IllegalStateException(message);
    }
}
