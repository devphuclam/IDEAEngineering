import java.nio.file.*;
import java.security.MessageDigest;
import java.util.*;
import java.util.regex.Pattern;

/** Standard-library-only read/hash control; never resolves, installs or executes a dependency. */
class ExecutionPreflight {
    public static void main(String[] args) throws Exception {
        if (!Runtime.version().toString().equals("25.0.4.1+1-LTS") || args.length < 1)
            throw new IllegalArgumentException("Exact JDK/source root required");
        var root = Path.of(args[0]).toRealPath();
        if (!Set.of(Path.of("/home/phuclam/idea-f05a-t028-t030-20261005-37/run-g01-compile-red-02/source"),
                Path.of("/home/phuclam/idea-f05a-t028-t030-20261005-37/run-g01-behavior-red-01/source")).contains(root))
            throw new SecurityException("Unapproved owned root");
        int count = 0;
        for (var line : Files.readAllLines(root.resolve("tests/ph1/f05-qualification/server-grant/inputs.sha256"))) {
            var pair = line.split("  ", 2);
            if (pair.length != 2 || !pair[0].matches("[0-9a-f]{64}")) throw new SecurityException("Manifest syntax");
            var input = root.resolve(pair[1]).normalize();
            if (!input.startsWith(root) || !input.toRealPath().equals(input) || !sha(input).equals(pair[0]))
                throw new SecurityException("First-party input mismatch: " + pair[1]);
            count++;
        }
        System.out.println("CONTROLLED_SOURCE_HASHES=PASS; COUNT=" + count);
        var permitted = new HashSet<String>();
        var coordinates = new HashSet<String>();
        for (var name : List.of("f05a-t028-t030-resolved-inputs.tsv", "f05a-q02-maven-distribution.tsv")) {
            var rows = Files.readAllLines(root.resolve("docs/research/inventories/" + name));
            int checks = 0;
            for (var row : rows.subList(1, rows.size())) {
                if (row.isBlank()) continue;
                var fields = row.split("\t", -1);
                boolean core = name.equals("f05a-q02-maven-distribution.tsv");
                var path = Path.of(fields[core ? 1 : 2]);
                var expected = fields[core ? 2 : 3];
                if (!expected.matches("[0-9a-f]{64}") || !sha(path).equals(expected))
                    throw new SecurityException("Cached input drift: " + path.getFileName());
                permitted.add(path.toString());
                coordinates.add(fields[core ? 0 : 1]);
                checks++;
            }
            System.out.println("INVENTORY_HASHES=PASS; FILE=" + name + "; ROWS=" + checks);
        }
        if (args.length == 2) {
            var diagnostic = Files.readString(Path.of(args[1]));
            var paths = Pattern.compile("/home/phuclam/\\.m2/[^:\\s\\]\\[;,\\)\\(<>\\\"']+\\.(?:jar|pom)");
            var check = paths.matcher("/home/phuclam/.m2/a.jar:/home/phuclam/.m2/b.jar");
            if (!check.find() || !check.group().equals("/home/phuclam/.m2/a.jar")
                    || !check.find() || !check.group().equals("/home/phuclam/.m2/b.jar") || check.find())
                throw new SecurityException("Classpath separator guard failure");
            var pathMatch = paths.matcher(diagnostic);
            int witnessed = 0;
            while (pathMatch.find()) {
                if (!permitted.contains(pathMatch.group())) throw new SecurityException("Unadmitted actual path: " + pathMatch.group());
                witnessed++;
            }
            var included = Pattern.compile("Included: ([\\w.-]+):([\\w.-]+):jar:([\\w.+-]+)").matcher(diagnostic);
            while (included.find()) {
                var coordinate = included.group(1) + ":" + included.group(2) + ":" + included.group(3);
                if (!coordinates.contains(coordinate)) throw new SecurityException("Unadmitted actual realm coordinate: " + coordinate);
            }
            if (witnessed == 0) throw new SecurityException("No actual Maven cache paths witnessed");
            System.out.println("ACTUAL_OBSERVED_INPUTS=PASS; PATH_OBSERVATIONS=" + witnessed);
        }
    }
    private static String sha(Path path) throws Exception {
        var digest = MessageDigest.getInstance("SHA-256");
        try (var stream = Files.newInputStream(path)) {
            var buffer = new byte[65536]; int read;
            while ((read = stream.read(buffer)) != -1) digest.update(buffer, 0, read);
        }
        return HexFormat.of().formatHex(digest.digest());
    }
}
