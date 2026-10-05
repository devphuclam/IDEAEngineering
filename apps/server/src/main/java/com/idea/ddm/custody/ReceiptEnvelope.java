package com.idea.ddm.custody;

import java.nio.ByteBuffer;
import java.nio.charset.*;
import java.security.*;
import java.time.Clock;
import java.util.*;

/** Server-side bounded verifier of the frozen Gateway evidence contract. No key discovery. */
final class ReceiptEnvelope {
    static Map<Integer,byte[]> verify(byte[] packet,PublicKey key,String issuer,String audience,String keyId,Clock clock) throws Exception {
        if(packet==null||packet.length<83||packet.length>4096)throw new SecurityException("RECEIPT_FRAME_REFUSED");
        var input=ByteBuffer.wrap(packet);int size=input.getInt();
        if(size!=packet.length-70)throw new SecurityException("RECEIPT_FRAME_REFUSED");
        byte[] payload=new byte[size];input.get(payload);
        if(input.getShort()!=64||input.remaining()!=64)throw new SecurityException("RECEIPT_FRAME_REFUSED");
        byte[] signature=new byte[64];input.get(signature);var verifier=Signature.getInstance("Ed25519","SunEC");verifier.initVerify(key);verifier.update(payload);
        if(!verifier.verify(signature))throw new SecurityException("RECEIPT_SIGNATURE_REFUSED");
        var body=ByteBuffer.wrap(payload);byte[] magic=new byte[8];body.get(magic);
        if(!Arrays.equals(magic,"IEPH1ENV".getBytes(StandardCharsets.US_ASCII))||body.get()!=2||body.getShort()!=1||body.getShort()!=25)
            throw new SecurityException("RECEIPT_PROFILE_REFUSED");
        var fields=new TreeMap<Integer,byte[]>();
        for(int tag=1;tag<=25;tag++){
            if(body.remaining()<4||Short.toUnsignedInt(body.getShort())!=tag)throw new SecurityException("RECEIPT_TAG_REFUSED");
            int length=Short.toUnsignedInt(body.getShort());if(length==0||length>256||length>body.remaining())throw new SecurityException("RECEIPT_TYPE_REFUSED");
            byte[] value=new byte[length];body.get(value);fields.put(tag,value);
            if(tag<=4||tag==12)text(value);
            else if((tag>=5&&tag<=11)||tag==15||tag==16||tag==17)uuid(value);
            else if(tag==19){if(length!=32)throw new SecurityException("RECEIPT_TYPE_REFUSED");}
            else if(tag==13||tag==14||tag==22){if(length!=1||value[0]<1||value[0]>(tag==14?2:1))throw new SecurityException("RECEIPT_TYPE_REFUSED");}
            else number(value);
        }
        if(body.hasRemaining()||!issuer.equals(text(fields.get(1)))||!audience.equals(text(fields.get(2)))
                ||!"RECEIPT_VERIFIED".equals(text(fields.get(3)))||!keyId.equals(text(fields.get(4))))throw new SecurityException("RECEIPT_PIN_REFUSED");
        long issued=number(fields.get(23)),now=clock.instant().getEpochSecond();
        if(number(fields.get(24))!=issued||number(fields.get(25))!=Math.addExact(issued,900)||now<issued||now>=number(fields.get(25)))
            throw new SecurityException("RECEIPT_TIME_REFUSED");
        return fields;
    }
    static UUID uuid(byte[] bytes){if(bytes.length!=16)throw new SecurityException("RECEIPT_UUID_REFUSED");var b=ByteBuffer.wrap(bytes);var id=new UUID(b.getLong(),b.getLong());if(id.equals(new UUID(0,0)))throw new SecurityException("RECEIPT_UUID_REFUSED");return id;}
    static long number(byte[] bytes){if(bytes.length!=8)throw new SecurityException("RECEIPT_INTEGER_REFUSED");long n=ByteBuffer.wrap(bytes).getLong();if(n<0)throw new SecurityException("RECEIPT_INTEGER_REFUSED");return n;}
    static String text(byte[] bytes) throws CharacterCodingException {
        var value=StandardCharsets.UTF_8.newDecoder().onMalformedInput(CodingErrorAction.REPORT).onUnmappableCharacter(CodingErrorAction.REPORT).decode(ByteBuffer.wrap(bytes)).toString();
        if(value.isEmpty()||value.chars().anyMatch(c->c<33||c>126))throw new SecurityException("RECEIPT_TEXT_REFUSED");return value;
    }
}
