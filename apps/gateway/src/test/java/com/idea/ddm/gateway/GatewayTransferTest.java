package com.idea.ddm.gateway;

import com.idea.ddm.gateway.security.TransferGrantVerifier;
import java.io.*;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.security.*;
import java.time.*;
import java.util.*;

/** Independent first-party Server wire producer, public verifier/service qualification boundary. */
public final class GatewayTransferTest {
    static final long T=1791028800L;
    static final UUID GATEWAY=new UUID(0x4000,0x8000000000000010L);
    static final String ENDPOINT="https://127.0.0.1:18447/";
    static byte[] text(String text){return text.getBytes(StandardCharsets.UTF_8);}
    static byte[] number(long n){return ByteBuffer.allocate(8).putLong(n).array();}
    static byte[] uuid(UUID id){return ByteBuffer.allocate(16).putLong(id.getMostSignificantBits()).putLong(id.getLeastSignificantBits()).array();}
    static Map<Integer,byte[]> fields(){
        var fields=new TreeMap<Integer,byte[]>();
        fields.put(1,text("PH1_SERVER"));fields.put(2,text("PH1_GATEWAY"));fields.put(3,text("GRANT_UPLOAD"));fields.put(4,text("SERVER_GRANT_1"));
        for(int i=5;i<=9;i++)fields.put(i,uuid(new UUID(0x4000,0x8000000000000000L|i)));
        fields.put(10,uuid(GATEWAY));fields.put(11,text(ENDPOINT));fields.put(12,new byte[]{1});fields.put(13,new byte[]{1});
        fields.put(14,uuid(new UUID(0x4000,0x8000000000000014L)));fields.put(15,number(1024));
        fields.put(16,HexFormat.of().parseHex("5f70bf18a086007016e948b04aed3b82103a36bea41755b6cddfaf10ace3c6ef"));
        fields.put(17,number(0));fields.put(18,number(1024));fields.put(19,ByteBuffer.allocate(4).putInt(1048576).array());
        fields.put(20,number(T));fields.put(21,number(T));fields.put(22,number(T+300));return fields;
    }
    // Does not call the Gateway codec to produce expected Server bytes.
    static byte[] signed(Map<Integer,byte[]> fields,PrivateKey key) throws Exception {
        var buffer=new ByteArrayOutputStream();var out=new DataOutputStream(buffer);
        out.writeBytes("IEPH1ENV");out.writeByte(1);out.writeShort(1);out.writeShort(22);
        for(int tag=1;tag<=22;tag++){byte[] value=fields.get(tag);out.writeShort(tag);out.writeShort(value.length);out.write(value);}
        byte[] payload=buffer.toByteArray();var signer=Signature.getInstance("Ed25519","SunEC");signer.initSign(key);signer.update(payload);
        return ByteBuffer.allocate(payload.length+70).putInt(payload.length).put(payload).putShort((short)64).put(signer.sign()).array();
    }
    public static void main(String[] args) throws Exception {
        var keys=KeyPairGenerator.getInstance("Ed25519","SunEC").generateKeyPair();
        var verifier=new TransferGrantVerifier(keys.getPublic(),"PH1_SERVER","PH1_GATEWAY","SERVER_GRANT_1",GATEWAY,ENDPOINT,Clock.fixed(Instant.ofEpochSecond(T),ZoneOffset.UTC));
        var expected=fields();var grant=verifier.verify(signed(expected,keys.getPrivate()),0,1024);
        for(int tag=1;tag<=22;tag++)if(!Arrays.equals(expected.get(tag),grant.get(tag)))throw new AssertionError("Exact original Grant field "+tag);
        System.out.println("GATEWAY_TRACER=PASS; CASES=1");
    }
}
