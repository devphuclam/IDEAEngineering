import java.util.Map;

// First RED tracer: qualification-only seam, not apps/gateway code.
public final class Envelope {
    public static byte[] encode(int kind, Map<Integer, byte[]> fields) throws Exception {
        throw new UnsupportedOperationException("T027 deterministic envelope not implemented");
    }
}
