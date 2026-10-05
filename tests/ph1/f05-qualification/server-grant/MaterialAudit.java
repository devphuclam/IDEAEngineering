import java.nio.file.*;
import java.security.MessageDigest;
import java.util.*;
import java.util.zip.ZipFile;

/** Read-only exact shaded provenance and forbidden-provider check; no Maven goal. */
class MaterialAudit {
    public static void main(String[] args) throws Exception {
        var seen = new HashSet<String>();
        int jars = 0;
        for (String line : Files.readAllLines(Path.of(args[0])).subList(1,
                Files.readAllLines(Path.of(args[0])).size())) {
            var row = line.split("\t", -1);
            if (row[0].equals("model-pom") || !seen.add(row[2])) continue;
            byte[] jar = Files.readAllBytes(Path.of(row[2]));
            String sha = HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(jar));
            if (!sha.equals(row[3])) throw new IllegalStateException("INPUT_DRIFT");
            try (var zip = new ZipFile(row[2])) {
                var shaded = new TreeMap<String, Integer>();
                for (var e : Collections.list(zip.entries())) {
                    String name = e.getName();
                    if (args.length == 2 && row[1].matches(args[1]) &&
                            (name.matches("(?i).*(license|notice|copyright).*")) &&
                            !name.endsWith(".class") && !e.isDirectory()) {
                        var bytes = zip.getInputStream(e).readAllBytes();
                        System.out.println("LEGAL=" + row[1] + "!" + name + ";SHA256=" +
                            HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(bytes)));
                        System.out.println(new String(bytes, java.nio.charset.StandardCharsets.UTF_8));
                    }
                    if (name.endsWith(".class") && (name.equals("javax/annotation/Nullable.class") ||
                            name.equals("javax/annotation/Nonnull.class") ||
                            name.startsWith("javax/annotation/meta/")))
                        throw new IllegalStateException("JSR305_PROVIDER=" + row[1]);
                    if (row[1].equals("org.apache.maven.surefire:surefire-shared-utils:3.5.6")) {
                        if (name.startsWith("org/apache/maven/surefire/shared/") && name.endsWith(".class")) {
                            String group = name.substring("org/apache/maven/surefire/shared/".length()).split("/")[0];
                            shaded.merge(group, 1, Integer::sum);
                        }
                        if (name.startsWith("META-INF/") && (name.contains("DEPENDENCIES") ||
                                name.endsWith("pom.properties") || name.endsWith("pom.xml"))) {
                            var bytes = zip.getInputStream(e).readAllBytes();
                            System.out.println("ENTRY=" + name + ";SHA256=" +
                                HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(bytes)));
                            if (!name.endsWith("pom.xml"))
                                System.out.println(new String(bytes, java.nio.charset.StandardCharsets.UTF_8));
                        }
                    }
                }
                if (!shaded.isEmpty()) System.out.println("SHARED_SHADED_CLASSES=" + shaded);
            }
            jars++;
        }
        System.out.println("HASHED_JARS=" + jars + ";JSR305_DIRECT_PROVIDER=ABSENT");
    }
}
