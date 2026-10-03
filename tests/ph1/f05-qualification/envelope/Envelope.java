import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.*;

// Qualification-only codec seam, not apps/gateway code.
public final class Envelope {
    public static byte[] encode(int kind, Map<Integer, byte[]> fields) throws Exception {
        int count=switch(kind) { case 1 -> 22; case 2 -> 25; default -> throw new IllegalArgumentException("KIND"); };
        if (fields.size()!=count) throw new IllegalArgumentException("FIELD_COUNT");
        ByteArrayOutputStream buffer=new ByteArrayOutputStream();
        DataOutputStream out=new DataOutputStream(buffer);
        out.write("IEPH1ENV".getBytes(StandardCharsets.US_ASCII));
        out.writeByte(kind); out.writeShort(1); out.writeShort(count);
        for(int tag=1;tag<=count;tag++) {
            byte[] value=fields.get(tag);
            if(value==null || value.length==0 || value.length>256) throw new IllegalArgumentException("FIELD_LENGTH");
            out.writeShort(tag); out.writeShort(value.length); out.write(value);
        }
        out.flush();
        byte[] payload=buffer.toByteArray();
        if(payload.length+70>4096) throw new IllegalArgumentException("FRAME_LIMIT");
        return payload;
    }
}
