package com.idea.ddm.custody;

import static org.junit.jupiter.api.Assertions.*;
import com.idea.ddm.identity.F05DatabaseFixture;
import com.idea.ddm.identity.F05SessionFixture;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.security.*;
import java.time.*;
import java.util.*;
import org.junit.jupiter.api.*;

/** Real HTTP-established context, exact independently signed Receipt, real PostgreSQL custody. */
class ReceiptBoundaryTest {
    static final Clock clock=Clock.fixed(Instant.ofEpochSecond(1791028800),ZoneOffset.UTC);
    static F05SessionFixture fixture;
    @BeforeAll static void setup() throws Exception {F05DatabaseFixture.create();fixture=new F05SessionFixture(F05DatabaseFixture.url(),clock);}
    @AfterAll static void close(){if(fixture!=null)fixture.close();}
    @Test void r01ExactGatewayReceiptCreatesRetrievableAuthoritativeCustody() throws Exception {
        var actor=fixture.signIn();UUID location=UUID.randomUUID(),receiptId=UUID.randomUUID();
        var scope=new TransferGrantService.Scope(UUID.randomUUID(),UUID.randomUUID(),UUID.randomUUID(),UUID.randomUUID(),
                "https://127.0.0.1:18447/",1,UUID.randomUUID(),1024,"5f70bf18a086007016e948b04aed3b82103a36bea41755b6cddfaf10ace3c6ef",0,1024);
        try(var c=F05DatabaseFixture.open("migration");var q=c.prepareStatement("INSERT INTO vault_endpoint(vault_id,adapter_kind,eligibility) VALUES (?,'FILESYSTEM','ELIGIBLE')")){
            q.setObject(1,scope.vaultId());assertEquals(1,q.executeUpdate());
        }
        var generator=KeyPairGenerator.getInstance("Ed25519","SunEC");var server=generator.generateKeyPair();var gateway=generator.generateKeyPair();
        TransferGrantService.OwnerAdmission admission=(c,a,s)->{if(!a.actorId().equals(actor.actorId())||!a.organizationId().equals(actor.organizationId())||!s.equals(scope))throw new SecurityException("OWNER_REFUSED");};
        var grant=new TransferGrantService(fixture.app(),fixture.eligibility(),admission,clock,server.getPrivate(),"PH1_SERVER","PH1_GATEWAY","SERVER_GRANT_1").issue(actor.context(),scope);
        var service=new TransferReceiptService(fixture.app(),fixture.eligibility(),(c,a,s,l)->{
            admission.require(c,a,s);if(!location.equals(l))throw new SecurityException("ALLOCATION_REFUSED");
            return new TransferReceiptService.Allocation(scope.vaultId(),location,grant.transferId()+"-"+location+".blob");
        },clock,gateway.getPublic(),"PH1_GATEWAY","PH1_SERVER","GATEWAY_RECEIPT_1");
        var packet=receipt(grant,receiptId,location,gateway.getPrivate());
        var accepted=service.accept(actor.context(),packet);
        assertEquals(new TransferReceiptService.Accepted(scope.operationId(),grant.transferId(),receiptId,scope.objectId(),scope.vaultId(),location),accepted);
        assertEquals(accepted,service.accept(actor.context(),packet),"Identical lost-response retry resolves original custody");
        // Approved authoritative-state oracle: a returned acceptance is not enough to prove atomic companions.
        try(var c=fixture.app().getConnection();var q=c.prepareStatement("SELECT a.byte_count,a.digest_value,l.vault_id,l.verification_state,r.receipt_id,t.state FROM artifact a JOIN artifact_location l USING(artifact_id) JOIN transfer_receipt r USING(receipt_id) JOIN transfer_record t USING(transfer_id) WHERE a.artifact_id=?")){
            q.setObject(1,scope.objectId());try(var rows=q.executeQuery()){
                assertTrue(rows.next());assertEquals(1024,rows.getLong(1));assertEquals(scope.digest(),rows.getString(2));assertEquals(scope.vaultId(),rows.getObject(3,UUID.class));
                assertEquals("VERIFIED",rows.getString(4));assertEquals(receiptId,rows.getObject(5,UUID.class));assertEquals("CONSUMED",rows.getString(6));assertFalse(rows.next());
            }
            try(var audit=c.prepareStatement("SELECT count(*) FROM audit_evidence WHERE operation_id=? AND action='transfer.receipt.accept'")){
                audit.setObject(1,scope.operationId());try(var rows=audit.executeQuery()){assertTrue(rows.next());assertEquals(1,rows.getInt(1));}
            }
        }
    }
    @Test void r02SameReceiptIdentityCannotReplaceItsOriginalSignedEvidence() throws Exception {
        var actor=fixture.signIn();UUID location=UUID.randomUUID(),receiptId=UUID.randomUUID();
        var scope=new TransferGrantService.Scope(UUID.randomUUID(),UUID.randomUUID(),UUID.randomUUID(),UUID.randomUUID(),"https://127.0.0.1:18447/",1,UUID.randomUUID(),1024,"5f70bf18a086007016e948b04aed3b82103a36bea41755b6cddfaf10ace3c6ef",0,1024);
        try(var c=F05DatabaseFixture.open("migration");var q=c.prepareStatement("INSERT INTO vault_endpoint(vault_id,adapter_kind,eligibility) VALUES (?,'FILESYSTEM','ELIGIBLE')")){q.setObject(1,scope.vaultId());assertEquals(1,q.executeUpdate());}
        var generator=KeyPairGenerator.getInstance("Ed25519","SunEC");var server=generator.generateKeyPair();var gateway=generator.generateKeyPair();
        TransferGrantService.OwnerAdmission admission=(c,a,s)->{if(!a.actorId().equals(actor.actorId())||!a.organizationId().equals(actor.organizationId())||!s.equals(scope))throw new SecurityException("OWNER_REFUSED");};
        var grant=new TransferGrantService(fixture.app(),fixture.eligibility(),admission,clock,server.getPrivate(),"PH1_SERVER","PH1_GATEWAY","SERVER_GRANT_1").issue(actor.context(),scope);
        var service=new TransferReceiptService(fixture.app(),fixture.eligibility(),(c,a,s,l)->{
            admission.require(c,a,s);if(!location.equals(l))throw new SecurityException("ALLOCATION_REFUSED");return new TransferReceiptService.Allocation(scope.vaultId(),location,grant.transferId()+"-"+location+".blob");
        },clock,gateway.getPublic(),"PH1_GATEWAY","PH1_SERVER","GATEWAY_RECEIPT_1");
        byte[] original=receipt(grant,receiptId,location,gateway.getPrivate());var accepted=service.accept(actor.context(),original);
        var changed=original.clone();var body=ByteBuffer.wrap(changed);body.position(17);
        for(int tag=1;tag<=25;tag++){int actual=Short.toUnsignedInt(body.getShort()),size=Short.toUnsignedInt(body.getShort());if(actual==23||actual==24||actual==25)body.putLong(body.position(),body.getLong(body.position())-1);body.position(body.position()+size);}
        resign(changed,gateway.getPrivate());
        var failure=assertThrows(IllegalStateException.class,()->service.accept(actor.context(),changed),"RECEIPT_EVIDENCE_REPLACEMENT_ACCEPTED");
        assertEquals("RECEIPT_NOT_COMMITTED",failure.getMessage());assertInstanceOf(SecurityException.class,failure.getCause());
        assertEquals(accepted,service.accept(actor.context(),original));
    }
    static void resign(byte[] frame,PrivateKey key) throws Exception {int size=ByteBuffer.wrap(frame).getInt();var s=Signature.getInstance("Ed25519","SunEC");s.initSign(key);s.update(frame,4,size);System.arraycopy(s.sign(),0,frame,6+size,64);}
    static byte[] receipt(TransferGrantService.Grant g,UUID receipt,UUID location,PrivateKey key) throws Exception {
        var s=g.scope();long now=clock.instant().getEpochSecond();
        var fields=List.of(text("PH1_GATEWAY"),text("PH1_SERVER"),text("RECEIPT_VERIFIED"),text("GATEWAY_RECEIPT_1"),uuid(receipt),uuid(g.grantId()),uuid(g.operationId()),uuid(g.transferId()),
                uuid(g.organizationId()),uuid(g.actorId()),uuid(s.gatewayId()),text(s.endpoint()),new byte[]{1},new byte[]{(byte)s.objectKind()},uuid(s.objectId()),uuid(s.vaultId()),uuid(location),
                number(s.byteCount()),HexFormat.of().parseHex(s.digest()),number(0),number(s.byteCount()),new byte[]{1},number(now),number(now),number(now+900));
        var buffer=new java.io.ByteArrayOutputStream();var out=new java.io.DataOutputStream(buffer);out.writeBytes("IEPH1ENV");out.writeByte(2);out.writeShort(1);out.writeShort(25);
        for(int i=0;i<fields.size();i++){out.writeShort(i+1);out.writeShort(fields.get(i).length);out.write(fields.get(i));}
        byte[] payload=buffer.toByteArray();var signer=Signature.getInstance("Ed25519","SunEC");signer.initSign(key);signer.update(payload);
        return ByteBuffer.allocate(payload.length+70).putInt(payload.length).put(payload).putShort((short)64).put(signer.sign()).array();
    }
    static byte[] text(String value){return value.getBytes(StandardCharsets.UTF_8);}
    static byte[] uuid(UUID value){return ByteBuffer.allocate(16).putLong(value.getMostSignificantBits()).putLong(value.getLeastSignificantBits()).array();}
    static byte[] number(long value){return ByteBuffer.allocate(8).putLong(value).array();}
}
