import java.nio.file.*;
import java.security.MessageDigest;
import java.util.*;
import java.util.zip.*;

class DocumentationPackageProbe {
  static final String DOCUMENT = "BOOT-INF/classes/dev-access/openapi.json";
  static String hash(byte[] bytes) throws Exception {
    return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(bytes));
  }
  static Map<String,String> entries(ZipFile zip) throws Exception {
    var result=new TreeMap<String,String>();
    for(var entry:Collections.list(zip.entries())){
      if(entry.isDirectory())continue;
      try(var in=zip.getInputStream(entry)){
        if(result.put(entry.getName(),hash(in.readAllBytes()))!=null)throw new IllegalStateException("Duplicate ZIP member");
      }
    }
    return result;
  }
  public static void main(String[] args) throws Exception {
    if(args.length!=3)throw new IllegalArgumentException("predecessor candidate expected-document-hash");
    try(var before=new ZipFile(args[0]);var after=new ZipFile(args[1])){
      var old=entries(before);var current=entries(after);
      if(!args[2].equals(current.remove(DOCUMENT)))throw new IllegalStateException("Document projection mismatch");
      old.remove(DOCUMENT);
      if(!old.equals(current))throw new IllegalStateException("Non-document payload drift");
      System.out.println("DOCUMENTATION_PACKAGE=PASS;ONLY_OPENAPI_CHANGED=true;UNCHANGED_ENTRIES="+current.size()
        +";UNCHANGED_CLASSES="+current.keySet().stream().filter(name->name.endsWith(".class")).count()
        +";UNCHANGED_RUNTIME_LIBRARIES="+current.keySet().stream().filter(name->name.startsWith("BOOT-INF/lib/")).count());
    }
  }
}
