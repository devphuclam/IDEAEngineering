import java.nio.file.*;
import java.security.MessageDigest;
import java.util.*;
import java.util.zip.ZipFile;

/** Reference-only inspection of exact cached bytes; no dependency or goal execution. */
class LegalAudit {
    public static void main(String[] args) throws Exception {
        if (args.length != 1) throw new IllegalArgumentException("inventory required");
        var texts = new TreeMap<String, String>();
        var visited = new HashSet<String>();
        for (String line : Files.readAllLines(Path.of(args[0])).subList(1,
                Files.readAllLines(Path.of(args[0])).size())) {
            var f = line.split("\t", -1);
            if (f[0].equals("model-pom") || !visited.add(f[2])) continue;
            var path = Path.of(f[2]);
            var actual = hash(Files.readAllBytes(path));
            if (!actual.equals(f[3])) throw new IllegalStateException("artifact drift: " + f[1]);
            try (var zip = new ZipFile(path.toFile())) {
                int count = 0;
                for (var entry : Collections.list(zip.entries())) {
                    String name = entry.getName().toLowerCase(Locale.ROOT);
                    if (entry.isDirectory() || !(name.contains("license") || name.contains("notice") ||
                            name.contains("copying") || name.contains("copyright")) ||
                            name.endsWith(".class")) continue;
                    byte[] bytes = zip.getInputStream(entry).readAllBytes();
                    String sha = hash(bytes);
                    System.out.println("LEGAL\t" + f[1] + "\t" + f[2] + "\t" + entry.getName() + "\t" + sha);
                    texts.putIfAbsent(sha, new String(bytes, java.nio.charset.StandardCharsets.UTF_8));
                    count++;
                }
                System.out.println("LEGAL_COUNT\t" + f[1] + "\t" + count);
            }
        }
        for (var entry : texts.entrySet()) {
            System.out.println("TEXT_BEGIN=" + entry.getKey());
            System.out.println(entry.getValue());
            System.out.println("TEXT_END=" + entry.getKey());
        }
    }
    static String hash(byte[] bytes) throws Exception {
        return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(bytes));
    }
}
