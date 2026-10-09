import java.nio.file.*;
import java.security.MessageDigest;
import java.util.*;
import java.util.zip.*;

class PackageProbe {
  static Map<String,String> libraries(ZipFile zip) throws Exception {
    var result = new TreeMap<String,String>();
    for (var entry : Collections.list(zip.entries())) {
      if (entry.getName().startsWith("BOOT-INF/lib/") && !entry.isDirectory()) {
        try (var stream = zip.getInputStream(entry)) {
          result.put(entry.getName(), HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(stream.readAllBytes())));
        }
      }
    }
    return result;
  }
  public static void main(String[] args) throws Exception {
    try (var previous = new ZipFile(args[0]); var api = new ZipFile(args[1])) {
      var runtime = libraries(api);
      if (runtime.isEmpty() || !runtime.equals(libraries(previous))) throw new IllegalStateException("Runtime graph/hash drift");
      for (var entry : Collections.list(api.entries())) {
        if (entry.getName().startsWith("BOOT-INF/classes/static/")) throw new IllegalStateException("Frontend leaked into API package");
      }
      var manifest = api.getEntry("META-INF/MANIFEST.MF");
      if (manifest == null || !new String(api.getInputStream(manifest).readAllBytes(), java.nio.charset.StandardCharsets.UTF_8).contains("Start-Class: com.idea.ddm.IdeaServerApplication")) throw new IllegalStateException("Executable package missing");
      System.out.println("BACKEND_ONLY_PACKAGE=PASS;WEB_RESOURCES=0;RUNTIME_JAR_HASHES_UNCHANGED=" + runtime.size());
    }
  }
}
