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
        var issueClock=Clock.fixed(clock.instant().minusSeconds(1),ZoneOffset.UTC);
        var grant=new TransferGrantService(fixture.app(),fixture.eligibility(),admission,issueClock,server.getPrivate(),"PH1_SERVER","PH1_GATEWAY","SERVER_GRANT_1").issue(actor.context(),scope);
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
    record Candidate(F05SessionFixture.SignedIn actor,TransferGrantService.Grant grant,UUID location,UUID receiptId,KeyPair gateway,TransferReceiptService service,byte[] packet) {}
    static Candidate candidate() throws Exception {
        var actor=fixture.signIn();UUID location=UUID.randomUUID(),receiptId=UUID.randomUUID();
        var scope=new TransferGrantService.Scope(UUID.randomUUID(),UUID.randomUUID(),UUID.randomUUID(),UUID.randomUUID(),"https://127.0.0.1:18447/",1,UUID.randomUUID(),1024,"5f70bf18a086007016e948b04aed3b82103a36bea41755b6cddfaf10ace3c6ef",0,1024);
        try(var c=F05DatabaseFixture.open("migration");var q=c.prepareStatement("INSERT INTO vault_endpoint(vault_id,adapter_kind,eligibility) VALUES (?,'FILESYSTEM','ELIGIBLE')")){q.setObject(1,scope.vaultId());assertEquals(1,q.executeUpdate());}
        var generator=KeyPairGenerator.getInstance("Ed25519","SunEC");var server=generator.generateKeyPair();var gateway=generator.generateKeyPair();
        TransferGrantService.OwnerAdmission admission=(c,a,s)->{if(!a.actorId().equals(actor.actorId())||!a.organizationId().equals(actor.organizationId())||!s.equals(scope))throw new SecurityException("OWNER_REFUSED");};
        var grant=new TransferGrantService(fixture.app(),fixture.eligibility(),admission,clock,server.getPrivate(),"PH1_SERVER","PH1_GATEWAY","SERVER_GRANT_1").issue(actor.context(),scope);
        var service=receiptService(actor,scope,location,grant,gateway.getPublic(),clock);
        return new Candidate(actor,grant,location,receiptId,gateway,service,receipt(grant,receiptId,location,gateway.getPrivate()));
    }
    static TransferReceiptService receiptService(F05SessionFixture.SignedIn actor,TransferGrantService.Scope scope,UUID location,TransferGrantService.Grant grant,PublicKey key,Clock time){
        return new TransferReceiptService(fixture.app(),fixture.eligibility(),(c,a,s,l)->{
            if(!a.actorId().equals(actor.actorId())||!a.organizationId().equals(actor.organizationId())||!scope.equals(s)||!location.equals(l))throw new SecurityException("OWNER_ALLOCATION_REFUSED");
            return new TransferReceiptService.Allocation(scope.vaultId(),location,grant.transferId()+"-"+location+".blob");
        },time,key,"PH1_GATEWAY","PH1_SERVER","GATEWAY_RECEIPT_1");
    }
    @Test void r03SignaturePinsCorrelationAllocationExpiryAndFramingRefuseWithoutCustody() throws Exception {
        var x=candidate();
        byte[] tampered=x.packet().clone();tampered[tampered.length-1]^=1;
        assertRefusal(x.service(),x.actor(),tampered);
        byte[] wrong=x.packet().clone();resign(wrong,KeyPairGenerator.getInstance("Ed25519","SunEC").generateKeyPair().getPrivate());assertRefusal(x.service(),x.actor(),wrong);
        for(int tag:new int[]{1,2,3,4,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25}){
            byte[] changed=x.packet().clone();var body=ByteBuffer.wrap(changed);body.position(17);
            for(int i=1;i<=25;i++){int actual=Short.toUnsignedInt(body.getShort()),size=Short.toUnsignedInt(body.getShort());if(actual==tag){changed[body.position()+size-1]^=1;break;}body.position(body.position()+size);}
            resign(changed,x.gateway().getPrivate());assertRefusal(x.service(),x.actor(),changed);
        }
        for(byte[] malformed:List.of(Arrays.copyOf(x.packet(),x.packet().length+1),Arrays.copyOf(x.packet(),20),new byte[4097]))assertRefusal(x.service(),x.actor(),malformed);
        long t=clock.instant().getEpochSecond();
        for(long time:new long[]{t-1,t+900,t+901})assertRefusal(receiptService(x.actor(),x.grant().scope(),x.location(),x.grant(),x.gateway().getPublic(),Clock.fixed(Instant.ofEpochSecond(time),ZoneOffset.UTC)),x.actor(),x.packet());
        assertNoCustody(x);
        assertNotNull(receiptService(x.actor(),x.grant().scope(),x.location(),x.grant(),x.gateway().getPublic(),Clock.fixed(Instant.ofEpochSecond(t+899),ZoneOffset.UTC)).accept(x.actor().context(),x.packet()));
    }
    @Test void r04RequiredWriteAndDeferredCommitFailuresLeaveNoPartialCustody() throws Exception {
        for(String target:List.of("transfer_receipt","transfer_receipt_evidence","artifact","artifact_location","audit_evidence","deferred")){
            var x=candidate();String table=target.equals("deferred")?"audit_evidence":target;
            String condition=table.equals("audit_evidence")?"NEW.action='transfer.receipt.accept'":"TRUE";
            try(var c=F05DatabaseFixture.open("migration");var q=c.createStatement()){
                q.execute("CREATE FUNCTION f05_receipt_fault() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN IF "+condition+" THEN "+(target.equals("deferred")?"RAISE EXCEPTION 'Controlled custody commit failure' USING ERRCODE='23514';":"RETURN NULL;")+" END IF; RETURN NEW; END; $$");
                q.execute((target.equals("deferred")?"CREATE CONSTRAINT TRIGGER f05_receipt_fault AFTER INSERT ON ":"CREATE TRIGGER f05_receipt_fault BEFORE INSERT ON ")+table+(target.equals("deferred")?" DEFERRABLE INITIALLY DEFERRED":"")+" FOR EACH ROW EXECUTE FUNCTION f05_receipt_fault()");
            }
            try{
                var failure=assertThrows(IllegalStateException.class,()->x.service().accept(x.actor().context(),x.packet()));
                assertEquals(target.equals("deferred")?"RECEIPT_COMMIT_OUTCOME_UNCERTAIN":"RECEIPT_NOT_COMMITTED",failure.getMessage());
                assertNoCustody(x); // Known injected DB rollback is observed, not inferred from lost response.
            }finally{try(var c=F05DatabaseFixture.open("migration");var q=c.createStatement()){q.execute("DROP TRIGGER f05_receipt_fault ON "+table);q.execute("DROP FUNCTION f05_receipt_fault()");}}
            assertNotNull(x.service().accept(x.actor().context(),x.packet()),"Same operation can retry confirmed rollback");
        }
    }
    @Test void r05LogoutWinsBeforeCustodyCommitAndDisabledOrStaleSessionsRefuse() throws Exception {
        var x=candidate();int barrier=2000000+java.util.concurrent.ThreadLocalRandom.current().nextInt(1000000);
        try(var hold=F05DatabaseFixture.open("migration");var workers=java.util.concurrent.Executors.newVirtualThreadPerTaskExecutor()){
            hold.setAutoCommit(false);try(var q=hold.prepareStatement("SELECT pg_advisory_xact_lock(?)")){q.setLong(1,barrier);q.execute();}
            try(var c=F05DatabaseFixture.open("migration");var q=c.createStatement()){
                q.execute("CREATE FUNCTION f05_receipt_gate() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN PERFORM pg_advisory_xact_lock("+barrier+"::bigint); RETURN NEW; END; $$");
                q.execute("CREATE TRIGGER f05_receipt_gate BEFORE INSERT ON transfer_receipt_evidence FOR EACH ROW EXECUTE FUNCTION f05_receipt_gate()");
            }
            try{
                var future=workers.submit(()->x.service().accept(x.actor().context(),x.packet()));boolean waiting=false;long deadline=System.nanoTime()+Duration.ofSeconds(10).toNanos();
                try(var c=F05DatabaseFixture.open("migration");var q=c.prepareStatement("SELECT count(*) FROM pg_locks WHERE locktype='advisory' AND NOT granted AND classid=0 AND objid=?")){
                    q.setLong(1,barrier);while(System.nanoTime()<deadline){try(var r=q.executeQuery()){assertTrue(r.next());waiting=r.getInt(1)==1;}if(waiting)break;Thread.sleep(10);}
                }
                assertTrue(waiting,"Custody reached controlled pre-commit barrier");fixture.signOut();hold.commit();
                var refusal=assertThrows(java.util.concurrent.ExecutionException.class,()->future.get(20,java.util.concurrent.TimeUnit.SECONDS));
                assertInstanceOf(IllegalStateException.class,refusal.getCause());assertEquals("RECEIPT_NOT_COMMITTED",refusal.getCause().getMessage());assertNoCustody(x);
            }finally{hold.rollback();try(var c=F05DatabaseFixture.open("migration");var q=c.createStatement()){q.execute("DROP TRIGGER f05_receipt_gate ON transfer_receipt_evidence");q.execute("DROP FUNCTION f05_receipt_gate()");}}
        }
        var y=candidate();
        try(var c=F05DatabaseFixture.open("migration");var q=c.createStatement()){
            try{q.executeUpdate("UPDATE idea_account SET status='DISABLED' WHERE account_id='"+y.actor().accountId()+"'");assertThrows(IllegalStateException.class,()->y.service().accept(y.actor().context(),y.packet()));assertNoCustody(y);}
            finally{q.executeUpdate("UPDATE idea_account SET status='ACTIVE' WHERE account_id='"+y.actor().accountId()+"'");}
            q.executeUpdate("UPDATE idea_account SET security_version=security_version+1 WHERE account_id='"+y.actor().accountId()+"'");
            assertThrows(IllegalStateException.class,()->y.service().accept(y.actor().context(),y.packet()));assertNoCustody(y);
        }
        var fresh=fixture.signIn();assertNotNull(y.service().accept(fresh.context(),y.packet()));
    }
    @Test void r06ConcurrentIdenticalReceiptHasOneCustodyAndAudit() throws Exception {
        var x=candidate();try(var workers=java.util.concurrent.Executors.newVirtualThreadPerTaskExecutor()){
            var ready=new java.util.concurrent.CountDownLatch(2);var start=new java.util.concurrent.CountDownLatch(1);
            java.util.concurrent.Callable<TransferReceiptService.Accepted> work=()->{ready.countDown();assertTrue(start.await(10,java.util.concurrent.TimeUnit.SECONDS));return x.service().accept(x.actor().context(),x.packet());};
            var first=workers.submit(work);var second=workers.submit(work);assertTrue(ready.await(10,java.util.concurrent.TimeUnit.SECONDS));start.countDown();
            assertEquals(first.get(20,java.util.concurrent.TimeUnit.SECONDS),second.get(20,java.util.concurrent.TimeUnit.SECONDS));
        }
        try(var c=fixture.app().getConnection()){
            for(String table:List.of("transfer_receipt","transfer_receipt_evidence"))try(var q=c.prepareStatement("SELECT count(*) FROM "+table+" WHERE transfer_id=?")){q.setObject(1,x.grant().transferId());try(var r=q.executeQuery()){assertTrue(r.next());assertEquals(1,r.getInt(1));}}
            try(var q=c.prepareStatement("SELECT count(*) FROM audit_evidence WHERE operation_id=? AND action='transfer.receipt.accept'")){q.setObject(1,x.grant().operationId());try(var r=q.executeQuery()){assertTrue(r.next());assertEquals(1,r.getInt(1));}}
        }
    }
    @Test void r07ChangedOwnerAllocationBeforeCommitCannotPublishStaleCustody() throws Exception {
        var x=candidate();
        // Owner-boundary fixture changes its authoritative physical allocation, not signed identity.
        var current=new java.util.concurrent.atomic.AtomicReference<>("original.blob");
        var service=new TransferReceiptService(fixture.app(),fixture.eligibility(),(c,a,s,l)->{
            if(!a.actorId().equals(x.actor().actorId())||!a.organizationId().equals(x.actor().organizationId())
                    ||!s.equals(x.grant().scope())||!l.equals(x.location()))throw new SecurityException("OWNER_ALLOCATION_REFUSED");
            return new TransferReceiptService.Allocation(s.vaultId(),l,current.getAndSet("replacement.blob"));
        },clock,x.gateway().getPublic(),"PH1_GATEWAY","PH1_SERVER","GATEWAY_RECEIPT_1");
        assertRefusal(service,x.actor(),x.packet());
        assertNoCustody(x);
        assertNotNull(x.service().accept(x.actor().context(),x.packet()),"Stable retry after confirmed rollback");
    }
    static void assertRefusal(TransferReceiptService service,F05SessionFixture.SignedIn actor,byte[] packet){
        var failure=assertThrows(IllegalStateException.class,()->service.accept(actor.context(),packet));assertEquals("RECEIPT_NOT_COMMITTED",failure.getMessage());assertInstanceOf(SecurityException.class,failure.getCause());
    }
    static void assertNoCustody(Candidate x) throws Exception {
        try(var c=fixture.app().getConnection()){
            for(String table:List.of("transfer_receipt","transfer_receipt_evidence"))try(var q=c.prepareStatement("SELECT count(*) FROM "+table+" WHERE transfer_id=?")){q.setObject(1,x.grant().transferId());try(var r=q.executeQuery()){assertTrue(r.next());assertEquals(0,r.getInt(1));}}
            for(String table:List.of("artifact","artifact_location"))try(var q=c.prepareStatement("SELECT count(*) FROM "+table+" WHERE artifact_id=?")){q.setObject(1,x.grant().scope().objectId());try(var r=q.executeQuery()){assertTrue(r.next());assertEquals(0,r.getInt(1));}}
            try(var q=c.prepareStatement("SELECT count(*) FROM audit_evidence WHERE operation_id=? AND action='transfer.receipt.accept'")){q.setObject(1,x.grant().operationId());try(var r=q.executeQuery()){assertTrue(r.next());assertEquals(0,r.getInt(1));}}
            try(var q=c.prepareStatement("SELECT state FROM transfer_record WHERE transfer_id=?")){q.setObject(1,x.grant().transferId());try(var r=q.executeQuery()){assertTrue(r.next());assertEquals("PREPARING",r.getString(1));}}
        }
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
