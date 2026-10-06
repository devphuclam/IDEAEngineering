package com.idea.ddm.custody;

import static org.junit.jupiter.api.Assertions.*;

import com.idea.ddm.identity.F05SessionFixture;
import com.idea.ddm.identity.F05DatabaseFixture;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.security.KeyPairGenerator;
import java.security.Signature;
import java.time.Clock;
import java.util.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.AfterAll;

/** Approved Server Grant qualification seam; HTTP identity and real bounded PostgreSQL. */
@org.junit.jupiter.api.TestMethodOrder(org.junit.jupiter.api.MethodOrderer.MethodName.class)
class CustodyBoundaryTest {
    private static final ControlledClock time=new ControlledClock();
    private static F05SessionFixture fixture;
    @BeforeAll
    static void freshOwnedSchema() throws Exception {
        F05DatabaseFixture.create();
        fixture = new F05SessionFixture(F05DatabaseFixture.url(), time);
    }
    @AfterAll
    static void stopOwnedServer() { if (fixture != null) fixture.close(); }
    @Test
    void g01ServerEstablishedActorObtainsExactPersistedSignedPrivateGrant() throws Exception {
        var clock = time;
        {
            var signedIn = fixture.signIn();
            var scope = new TransferGrantService.Scope(UUID.randomUUID(), UUID.randomUUID(), UUID.randomUUID(),
                    UUID.randomUUID(), "https://127.0.0.1:18447/synthetic-transfer", 1, UUID.randomUUID(),
                    1024, "0".repeat(64), 0, 1024);
            try (var connection = F05DatabaseFixture.open("migration"); var insert = connection.prepareStatement(
                    "INSERT INTO vault_endpoint(vault_id,adapter_kind,eligibility) VALUES (?,'F05_SYNTHETIC','ELIGIBLE')")) {
                insert.setObject(1,scope.vaultId()); assertEquals(1,insert.executeUpdate());
            }
            var key = KeyPairGenerator.getInstance("Ed25519", "SunEC").generateKeyPair();
            var service = new TransferGrantService(fixture.app(), fixture.eligibility(), (connection, actor, requested) -> {
                if (!actor.actorId().equals(signedIn.actorId()) || !actor.organizationId().equals(signedIn.organizationId())
                        || !scope.equals(requested)) throw new SecurityException("OWNER_ALLOCATION_REFUSED");
            }, clock, key.getPrivate(), "idea-server-test", "idea-gateway-test", "server-key-test");
            var issued = service.issue(signedIn.context(), scope);
            var stored = service.resolve(signedIn.context(), scope.operationId());
            assertEquals(issued.grantId(), stored.grantId());
            assertEquals(scope, stored.scope());
            assertEquals(signedIn.actorId(), stored.actorId());
            assertEquals(signedIn.organizationId(), stored.organizationId());
            assertEquals(300, stored.expiresAt() - stored.issuedAt());
            assertEquals(scope.operationId(), stored.operationId());
            assertArrayEquals(issued.frame(), stored.frame());
            assertNotEquals(issued.grantId(), stored.transferId());
            assertNotEquals(stored.transferId(), stored.operationId());
            // Independent frozen-v1 decoder, not the production codec's own expected-value calculation.
            var fields = verifyFrame(issued.frame(), key.getPublic());
            assertEquals("idea-server-test", text(fields.get(1)));
            assertEquals("idea-gateway-test", text(fields.get(2)));
            assertEquals("GRANT_UPLOAD", text(fields.get(3)));
            assertEquals("server-key-test", text(fields.get(4)));
            assertEquals(issued.grantId(), uuid(fields.get(5)));
            assertEquals(scope.operationId(), uuid(fields.get(6)));
            assertEquals(stored.transferId(), uuid(fields.get(7)));
            assertEquals(signedIn.organizationId(), uuid(fields.get(8)));
            assertEquals(signedIn.actorId(), uuid(fields.get(9)));
            assertEquals(scope.gatewayId(), uuid(fields.get(10)));
            assertEquals(scope.endpoint(), text(fields.get(11)));
            assertArrayEquals(new byte[]{1}, fields.get(12));
            assertArrayEquals(new byte[]{1}, fields.get(13));
            assertEquals(scope.objectId(), uuid(fields.get(14)));
            assertEquals(1024, number(fields.get(15)));
            assertArrayEquals(new byte[32], fields.get(16));
            assertEquals(0, number(fields.get(17)));
            assertEquals(1024, number(fields.get(18)));
            assertEquals(1_048_576, ByteBuffer.wrap(fields.get(19)).getInt());
            assertEquals(stored.issuedAt(), number(fields.get(20)));
            assertEquals(stored.issuedAt(), number(fields.get(21)));
            assertEquals(stored.expiresAt(), number(fields.get(22)));
            try (var connection = fixture.app().getConnection(); var statement = connection.createStatement()) {
                for (var table : List.of("artifact", "artifact_location", "transfer_receipt", "owner_committed_event"))
                    try (var row = statement.executeQuery("SELECT count(*) FROM " + table)) {
                        assertTrue(row.next());
                        assertEquals(0, row.getInt(1), "Issuance is not accepted custody or an F04 event");
                    }
            }
        }
    }

    @Test
    void g02AnonymousDisabledRevokedStaleAndWrongOrganizationCannotLeaveIssuanceState() throws Exception {
        var signedIn = fixture.signIn();
        var scope = syntheticScope();
        var key = KeyPairGenerator.getInstance("Ed25519", "SunEC").generateKeyPair();
        var service = service(signedIn, scope, key.getPrivate());
        refuseWithoutState(() -> service.issue(null, scope), scope.operationId());
        try (var connection = F05DatabaseFixture.open("migration"); var sql = connection.createStatement()) {
            try {
                sql.executeUpdate("UPDATE idea_account SET status='DISABLED' WHERE account_id='"+signedIn.accountId()+"'");
                refuseWithoutState(() -> service.issue(signedIn.context(),scope),scope.operationId());
            } finally { sql.executeUpdate("UPDATE idea_account SET status='ACTIVE' WHERE account_id='"+signedIn.accountId()+"'"); }
            sql.executeUpdate("UPDATE session_record SET revoked_at=CURRENT_TIMESTAMP WHERE actor_id='"+signedIn.actorId()+"'");
            refuseWithoutState(() -> service.issue(signedIn.context(),scope),scope.operationId());
            var fresh = fixture.signIn();
            sql.executeUpdate("UPDATE idea_account SET security_version=security_version+1 WHERE account_id='"+fresh.accountId()+"'");
            refuseWithoutState(() -> service.issue(fresh.context(),scope),scope.operationId());
            var current = fixture.signIn();
            // Core has one operating Organization. A foreign owner-scope requirement must refuse,
            // not fabricate a second Organization or take Organization authority from caller input.
            var requiredOrganization = UUID.randomUUID();
            var wrongOrganization = new TransferGrantService(fixture.app(),fixture.eligibility(),(caller,actor,requested)->{
                if(!requiredOrganization.equals(actor.organizationId())) throw new SecurityException("OWNER_ORGANIZATION_REFUSED");
            },time,key.getPrivate(),"idea-server-test","idea-gateway-test","server-key-test");
            refuseWithoutState(() -> wrongOrganization.issue(current.context(),scope),scope.operationId());
        }
    }

    @Test
    void g02ExactOwnerObjectAndConfiguredAllocationRefusalsLeaveNoPartialGrant() throws Exception {
        var signedIn = fixture.signIn();
        var expected = syntheticScope();
        var key = KeyPairGenerator.getInstance("Ed25519", "SunEC").generateKeyPair();
        var service = service(signedIn, expected, key.getPrivate());
        var wrongObject = new TransferGrantService.Scope(expected.operationId(),expected.correlationId(),expected.vaultId(),
                expected.gatewayId(),expected.endpoint(),1,UUID.randomUUID(),1024,"0".repeat(64),0,1024);
        refuseWithoutState(() -> service.issue(signedIn.context(),wrongObject),expected.operationId());
        // Exact owner callback accepts the scope, but the configured Vault is absent/ineligible.
        refuseWithoutState(() -> service.issue(signedIn.context(),expected),expected.operationId());
        try (var connection=F05DatabaseFixture.open("migration");var insert=connection.prepareStatement(
                "INSERT INTO vault_endpoint(vault_id,adapter_kind,eligibility) VALUES (?,'F05_SYNTHETIC','INELIGIBLE')")) {
            insert.setObject(1,expected.vaultId());assertEquals(1,insert.executeUpdate());
        }
        refuseWithoutState(() -> service.issue(signedIn.context(),expected),expected.operationId());
        // No default owner bypass: even an eligible Vault cannot override a configured owner refusal.
        try (var connection=F05DatabaseFixture.open("migration");var update=connection.prepareStatement(
                "UPDATE vault_endpoint SET eligibility='ELIGIBLE' WHERE vault_id=?")) {
            update.setObject(1,expected.vaultId());assertEquals(1,update.executeUpdate());
        }
        var unavailable = new TransferGrantService(fixture.app(),fixture.eligibility(),(connection,actor,scope)->{
            throw new SecurityException("CONFIGURED_GATEWAY_UNAVAILABLE");
        },time,key.getPrivate(),"idea-server-test","idea-gateway-test","server-key-test");
        refuseWithoutState(() -> unavailable.issue(signedIn.context(),expected),expected.operationId());
    }

    private static TransferGrantService.Scope syntheticScope() {
        return new TransferGrantService.Scope(UUID.randomUUID(),UUID.randomUUID(),UUID.randomUUID(),UUID.randomUUID(),
                "https://127.0.0.1:18447/synthetic-transfer",1,UUID.randomUUID(),1024,"0".repeat(64),0,1024);
    }
    @Test
    void g03ProductIssuedFrameRefusesWrongKeyPurposeAudienceVersionAndAlteredClaims() throws Exception {
        var signedIn=fixture.signIn();var scope=syntheticScope();seedVault(scope);
        var keys=KeyPairGenerator.getInstance("Ed25519","SunEC").generateKeyPair();
        var frame=service(signedIn,scope,keys.getPrivate()).issue(signedIn.context(),scope).frame();
        var fields=verifyFrame(frame,keys.getPublic());
        assertEquals(scope.objectId(),uuid(fields.get(14)));
        assertEquals(scope.operationId(),uuid(fields.get(6)));
        assertEquals(scope.endpoint(),text(fields.get(11)));
        assertThrows(AssertionError.class,()->verifyFrame(frame,KeyPairGenerator.getInstance("Ed25519","SunEC").generateKeyPair().getPublic()));
        var altered=frame.clone();altered[40]^=1;
        assertThrows(AssertionError.class,()->verifyFrame(altered,keys.getPublic()));
        // Correctly signed invalid profile fixtures isolate policy from mere signature failure.
        for(int tag:List.of(2,3)) {
            var changed=frame.clone();var b=ByteBuffer.wrap(changed);b.position(17);
            for(int i=1;i<=22;i++){int actual=Short.toUnsignedInt(b.getShort());int size=Short.toUnsignedInt(b.getShort());
                if(actual==tag){changed[b.position()+size-1]^=1;break;}b.position(b.position()+size);}
            resign(changed,keys.getPrivate());
            assertThrows(AssertionError.class,()->verifyFrame(changed,keys.getPublic()));
        }
        var version=frame.clone();version[12]=2;resign(version,keys.getPrivate());
        assertThrows(AssertionError.class,()->verifyFrame(version,keys.getPublic()));
        assertFalse(text(fields.get(11)).contains("/home/"));
        // The only endpoint is the approved public synthetic HTTPS target, not a private provider path.
        assertEquals(22,fields.size());
    }
    private static void seedVault(TransferGrantService.Scope scope) throws Exception {
        try(var connection=F05DatabaseFixture.open("migration");var query=connection.prepareStatement(
                "INSERT INTO vault_endpoint(vault_id,adapter_kind,eligibility) VALUES (?,'F05_SYNTHETIC','ELIGIBLE')")) {
            query.setObject(1,scope.vaultId());assertEquals(1,query.executeUpdate());
        }
    }
    @Test
    void g04SameOperationRetryAndLostResponseResolveTheOriginalWithoutDuplicateIssuance() throws Exception {
        var signedIn=fixture.signIn();var scope=syntheticScope();seedVault(scope);
        var keys=KeyPairGenerator.getInstance("Ed25519","SunEC").generateKeyPair();
        var service=service(signedIn,scope,keys.getPrivate());
        var original=service.issue(signedIn.context(),scope);
        // Model a lost response by resolving from the operation, not generating a new operation.
        assertEquals(original.grantId(),service.resolve(signedIn.context(),scope.operationId()).grantId());
        var retry=service.issue(signedIn.context(),scope);
        assertEquals(original.grantId(),retry.grantId());
        assertEquals(original.transferId(),retry.transferId());
        assertArrayEquals(original.frame(),retry.frame());
        try(var connection=fixture.app().getConnection()) {
            for(var table:List.of("transfer_record","transfer_grant","audit_evidence"))
                try(var query=connection.prepareStatement("SELECT count(*) FROM "+table+" WHERE operation_id=?")) {
                    query.setObject(1,scope.operationId());try(var row=query.executeQuery()){assertTrue(row.next());assertEquals(1,row.getInt(1));}
                }
        }
    }
    private static void resign(byte[] packet,java.security.PrivateKey key) throws Exception {
        int length=ByteBuffer.wrap(packet).getInt();var signer=Signature.getInstance("Ed25519","SunEC");
        signer.initSign(key);signer.update(packet,4,length);System.arraycopy(signer.sign(),0,packet,6+length,64);
    }
    @Test
    void g04ConcurrentSameOperationAndChangedInputHaveOneCanonicalOutcome() throws Exception {
        var signedIn=fixture.signIn();var scope=syntheticScope();seedVault(scope);
        var keys=KeyPairGenerator.getInstance("Ed25519","SunEC").generateKeyPair();
        var changed=new TransferGrantService.Scope(scope.operationId(),scope.correlationId(),scope.vaultId(),scope.gatewayId(),
                scope.endpoint(),scope.objectKind(),scope.objectId(),2048,scope.digest(),0,2048);
        var service=new TransferGrantService(fixture.app(),fixture.eligibility(),(connection,actor,requested)->{
            if(!actor.actorId().equals(signedIn.actorId()) || !actor.organizationId().equals(signedIn.organizationId())
                    || !(scope.equals(requested)||changed.equals(requested)))throw new SecurityException("OWNER_REFUSED");
        },time,keys.getPrivate(),"idea-server-test","idea-gateway-test","server-key-test");
        try(var workers=java.util.concurrent.Executors.newVirtualThreadPerTaskExecutor()) {
            var ready=new java.util.concurrent.CountDownLatch(2);var start=new java.util.concurrent.CountDownLatch(1);
            java.util.concurrent.Callable<TransferGrantService.Grant> request=()->{
                ready.countDown();assertTrue(start.await(10,java.util.concurrent.TimeUnit.SECONDS));return service.issue(signedIn.context(),scope);
            };
            var first=workers.submit(request);var second=workers.submit(request);
            assertTrue(ready.await(10,java.util.concurrent.TimeUnit.SECONDS));start.countDown();
            var one=first.get(20,java.util.concurrent.TimeUnit.SECONDS);var two=second.get(20,java.util.concurrent.TimeUnit.SECONDS);
            assertEquals(one.grantId(),two.grantId());assertEquals(one.transferId(),two.transferId());assertArrayEquals(one.frame(),two.frame());
            var refusal=assertThrows(IllegalStateException.class,()->service.issue(signedIn.context(),changed));
            assertEquals("OPERATION_SCOPE_CONFLICT",refusal.getCause().getMessage());
            assertEquals(one.scope(),service.resolve(signedIn.context(),scope.operationId()).scope());
        }
        try(var connection=fixture.app().getConnection()) {
            for(var table:List.of("transfer_record","transfer_grant","audit_evidence"))
                try(var query=connection.prepareStatement("SELECT count(*) FROM "+table+" WHERE operation_id=?")) {
                    query.setObject(1,scope.operationId());try(var row=query.executeQuery()){assertTrue(row.next());assertEquals(1,row.getInt(1));}
                }
        }
    }
    private static TransferGrantService service(F05SessionFixture.SignedIn signedIn,TransferGrantService.Scope expected,
            java.security.PrivateKey key) {
        return new TransferGrantService(fixture.app(),fixture.eligibility(),(connection,actor,requested)->{
            if(!actor.actorId().equals(signedIn.actorId()) || !actor.organizationId().equals(signedIn.organizationId())
                    || !expected.equals(requested)) throw new SecurityException("OWNER_ALLOCATION_REFUSED");
        },time,key,"idea-server-test","idea-gateway-test","server-key-test");
    }
    @FunctionalInterface private interface Attempt { void run() throws Exception; }
    private static void refuseWithoutState(Attempt attempt,UUID operationId) throws Exception {
        var refusal=assertThrows(IllegalStateException.class,attempt::run);
        assertEquals("GRANT_NOT_COMMITTED",refusal.getMessage());
        assertTrue(refusal.getCause() instanceof SecurityException
                || refusal.getCause() instanceof com.idea.ddm.identity.IdentityRefusal,
                "Storage/signing/fixture failure is not a security-refusal PASS");
        // DB observation is an explicitly approved no-partial-state oracle, not an alternative identity seam.
        try(var connection=fixture.app().getConnection()) {
            for(var table:List.of("transfer_record","transfer_grant","audit_evidence"))
                try(var query=connection.prepareStatement("SELECT count(*) FROM "+table+" WHERE operation_id=?")) {
                    query.setObject(1,operationId);try(var row=query.executeQuery()){assertTrue(row.next());assertEquals(0,row.getInt(1));}
                }
        }
    }

    @Test
    void g05ExpiryEqualityAndExplicitRenewalPreserveOperationWithoutExtendingOriginal() throws Exception {
        var signedIn=fixture.signIn();var scope=syntheticScope();seedVault(scope);
        var keys=KeyPairGenerator.getInstance("Ed25519","SunEC").generateKeyPair();
        var service=service(signedIn,scope,keys.getPrivate());
        var original=service.issue(signedIn.context(),scope);
        assertTrue(original.validAt(java.time.Instant.ofEpochSecond(original.expiresAt()-1)));
        assertFalse(original.validAt(java.time.Instant.ofEpochSecond(original.expiresAt())));
        assertFalse(original.validAt(java.time.Instant.ofEpochSecond(original.expiresAt()+1)));
        time.advance(300);
        assertFalse(service.resolve(signedIn.context(),scope.operationId()).validAt(time.instant()));
        assertThrows(IllegalStateException.class,()->service.issue(signedIn.context(),scope));
        var renewed=service.renew(signedIn.context(),scope.operationId());
        assertNotEquals(original.grantId(),renewed.grantId());
        assertEquals(original.transferId(),renewed.transferId());assertEquals(original.scope(),renewed.scope());
        assertEquals(original.operationId(),renewed.operationId());
        assertEquals(original.expiresAt(),renewed.issuedAt());
        assertEquals(300,renewed.expiresAt()-renewed.issuedAt());
        assertTrue(renewed.validAt(time.instant()));assertFalse(original.validAt(time.instant()));
        assertEquals(renewed.grantId(),service.resolve(signedIn.context(),scope.operationId()).grantId());
        assertEquals(renewed.grantId(),service.issue(signedIn.context(),scope).grantId());
        try(var connection=fixture.app().getConnection();var query=connection.prepareStatement(
                "SELECT expires_at,status FROM transfer_grant WHERE grant_id=?")) {
            query.setObject(1,original.grantId());try(var row=query.executeQuery()){assertTrue(row.next());
                assertEquals(original.expiresAt(),row.getTimestamp(1).toInstant().getEpochSecond());assertEquals("EXPIRED",row.getString(2));}
        }
    }
    private static final class ControlledClock extends Clock {
        private final java.util.concurrent.atomic.AtomicReference<java.time.Instant> now=
                new java.util.concurrent.atomic.AtomicReference<>(java.time.Instant.now().truncatedTo(java.time.temporal.ChronoUnit.SECONDS));
        void advance(long seconds){now.updateAndGet(value->value.plusSeconds(seconds));}
        @Override public java.time.Instant instant(){return now.get();}
        @Override public java.time.ZoneId getZone(){return java.time.ZoneOffset.UTC;}
        @Override public Clock withZone(java.time.ZoneId zone){if(!zone.equals(getZone()))throw new IllegalArgumentException("UTC test clock");return this;}
    }
    @Test
    void g05RenewalRechecksCurrentSessionAndAllocationWithoutPartialReplacement() throws Exception {
        var signedIn=fixture.signIn();var scope=syntheticScope();seedVault(scope);
        var keys=KeyPairGenerator.getInstance("Ed25519","SunEC").generateKeyPair();var service=service(signedIn,scope,keys.getPrivate());
        var original=service.issue(signedIn.context(),scope);
        fixture.signOut();assertThrows(IllegalStateException.class,()->service.renew(signedIn.context(),scope.operationId()));
        var fresh=fixture.signIn();
        try(var connection=F05DatabaseFixture.open("migration");var query=connection.prepareStatement(
                "UPDATE vault_endpoint SET eligibility='INELIGIBLE' WHERE vault_id=?")) {
            query.setObject(1,scope.vaultId());assertEquals(1,query.executeUpdate());
        }
        assertThrows(IllegalStateException.class,()->service.renew(fresh.context(),scope.operationId()));
        assertOperationCounts(scope.operationId(),1,1,1,1);
        try(var connection=F05DatabaseFixture.open("migration");var query=connection.prepareStatement(
                "UPDATE vault_endpoint SET eligibility='ELIGIBLE' WHERE vault_id=?")) {
            query.setObject(1,scope.vaultId());assertEquals(1,query.executeUpdate());
        }
        assertEquals(original.grantId(),service.resolve(fresh.context(),scope.operationId()).grantId());
    }
    private static void assertOperationCounts(UUID operation,int transfers,int grants,int scopes,int audit) throws Exception {
        try(var connection=fixture.app().getConnection()) {
            var tables=List.of("transfer_record","transfer_grant","transfer_grant_scope s JOIN transfer_grant g ON s.grant_id=g.grant_id","audit_evidence");
            int[] counts={transfers,grants,scopes,audit};
            for(int i=0;i<tables.size();i++)try(var query=connection.prepareStatement(
                    "SELECT count(*) FROM "+tables.get(i)+" WHERE "+(i==2?"g.":"")+"operation_id=?")) {
                query.setObject(1,operation);try(var row=query.executeQuery()){assertTrue(row.next());assertEquals(counts[i],row.getInt(1));}
            }
        }
    }
    @Test
    void g06PersistenceAuditSigningAndCommitFaultsCannotLeavePartialIssuedState() throws Exception {
        var signedIn=fixture.signIn();
        var keys=KeyPairGenerator.getInstance("Ed25519","SunEC").generateKeyPair();
        for(var target:List.of("transfer_record","transfer_grant","transfer_grant_scope","audit_evidence","deferred")) {
            var scope=syntheticScope();seedVault(scope);var service=service(signedIn,scope,keys.getPrivate());
            try(var fault=installFault(target,scope.operationId())) {
                var failure=assertThrows(IllegalStateException.class,()->service.issue(signedIn.context(),scope));
                assertEquals(target.equals("deferred")?"GRANT_COMMIT_OUTCOME_UNCERTAIN":"GRANT_NOT_COMMITTED",failure.getMessage());
                assertOperationCounts(scope.operationId(),0,0,0,0);
            }
        }
        var scope=syntheticScope();seedVault(scope);
        java.security.PrivateKey unusable=new java.security.PrivateKey() {
            public String getAlgorithm(){return "Unusable";}public String getFormat(){return null;}public byte[] getEncoded(){return null;}
        };
        assertThrows(IllegalStateException.class,()->service(signedIn,scope,unusable).issue(signedIn.context(),scope));
        assertOperationCounts(scope.operationId(),0,0,0,0);
        var renewable=syntheticScope();seedVault(renewable);var service=service(signedIn,renewable,keys.getPrivate());
        var original=service.issue(signedIn.context(),renewable);
        try(var fault=installFault("audit_evidence",renewable.operationId())) {
            assertThrows(IllegalStateException.class,()->service.renew(signedIn.context(),renewable.operationId()));
            assertOperationCounts(renewable.operationId(),1,1,1,1);
        }
        assertEquals(original.grantId(),service.resolve(signedIn.context(),renewable.operationId()).grantId());
    }
    private static AutoCloseable installFault(String target,UUID operation) throws Exception {
        var table=target.equals("deferred")?"audit_evidence":target;
        if(!List.of("transfer_record","transfer_grant","transfer_grant_scope","audit_evidence").contains(table))throw new SecurityException("Fault table");
        var condition=table.equals("transfer_grant_scope")?"TRUE":"NEW.operation_id='"+operation+"'";
        var body=target.equals("deferred")?"RAISE EXCEPTION 'Controlled F05 commit failure' USING ERRCODE='23514';":"RETURN NULL;";
        try(var connection=F05DatabaseFixture.open("migration");var sql=connection.createStatement()) {
            sql.execute("CREATE FUNCTION f05_fault() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN IF "+condition+" THEN "+body+" END IF; RETURN NEW; END; $$");
            sql.execute((target.equals("deferred")?"CREATE CONSTRAINT TRIGGER f05_fault AFTER INSERT ON ":"CREATE TRIGGER f05_fault BEFORE INSERT ON ")
                    +table+(target.equals("deferred")?" DEFERRABLE INITIALLY DEFERRED":"")+" FOR EACH ROW EXECUTE FUNCTION f05_fault()");
        }
        return ()->{try(var connection=F05DatabaseFixture.open("migration");var sql=connection.createStatement()){
            sql.execute("DROP TRIGGER f05_fault ON "+table);sql.execute("DROP FUNCTION f05_fault()");
        }};
    }
    @Test
    void g06RealLogoutWinsBeforeIssuanceAndRenewalCommitWithoutPartialState() throws Exception {
        for(boolean renewal:List.of(false,true)) {
            var signedIn=fixture.signIn();var scope=syntheticScope();seedVault(scope);
            var keys=KeyPairGenerator.getInstance("Ed25519","SunEC").generateKeyPair();var service=service(signedIn,scope,keys.getPrivate());
            if(renewal)service.issue(signedIn.context(),scope);
            int barrier=100000+java.util.concurrent.ThreadLocalRandom.current().nextInt(1000000);
            try(var hold=F05DatabaseFixture.open("migration");var workers=java.util.concurrent.Executors.newVirtualThreadPerTaskExecutor()) {
                hold.setAutoCommit(false);
                try(var query=hold.prepareStatement("SELECT pg_advisory_xact_lock(?)")){query.setLong(1,barrier);query.execute();}
                try(var connection=F05DatabaseFixture.open("migration");var sql=connection.createStatement()) {
                    sql.execute("CREATE FUNCTION f05_gate() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN PERFORM pg_advisory_xact_lock("+barrier+"::bigint); RETURN NEW; END; $$");
                    sql.execute("CREATE TRIGGER f05_gate BEFORE INSERT ON transfer_grant_scope FOR EACH ROW EXECUTE FUNCTION f05_gate()");
                }
                try {
                    var future=workers.submit(()->renewal?service.renew(signedIn.context(),scope.operationId()):service.issue(signedIn.context(),scope));
                    boolean waiting=false;long deadline=System.nanoTime()+java.time.Duration.ofSeconds(10).toNanos();
                    try(var connection=F05DatabaseFixture.open("migration");var query=connection.prepareStatement(
                            "SELECT count(*) FROM pg_locks WHERE locktype='advisory' AND NOT granted AND classid=0 AND objid=?")) {
                        query.setLong(1,barrier);
                        while(System.nanoTime()<deadline){try(var row=query.executeQuery()){assertTrue(row.next());waiting=row.getInt(1)==1;}if(waiting)break;Thread.sleep(10);}
                    }
                    assertTrue(waiting,"Owner reached controlled DB barrier before IAM commit coordination");
                    fixture.signOut(); // Actual HTTP logout commits under the existing IAM coordination lock.
                    hold.commit();
                    var refused=assertThrows(java.util.concurrent.ExecutionException.class,()->future.get(20,java.util.concurrent.TimeUnit.SECONDS));
                    assertInstanceOf(IllegalStateException.class,refused.getCause());
                    assertEquals("GRANT_NOT_COMMITTED",refused.getCause().getMessage());
                    assertOperationCounts(scope.operationId(),renewal?1:0,renewal?1:0,renewal?1:0,renewal?1:0);
                } finally {
                    hold.rollback();
                    try(var connection=F05DatabaseFixture.open("migration");var sql=connection.createStatement()){
                        sql.execute("DROP TRIGGER f05_gate ON transfer_grant_scope");sql.execute("DROP FUNCTION f05_gate()");
                    }
                }
            }
        }
    }
    private static Map<Integer, byte[]> verifyFrame(byte[] packet, java.security.PublicKey key) throws Exception {
        assertTrue(packet.length <= 4096 && packet.length >= 83);
        var input = ByteBuffer.wrap(packet);
        var length = input.getInt();
        assertEquals(packet.length - 70, length);
        var payload = new byte[length]; input.get(payload);
        assertEquals(64, Short.toUnsignedInt(input.getShort()));
        var signature = new byte[64]; input.get(signature);
        assertFalse(input.hasRemaining());
        var verifier = Signature.getInstance("Ed25519", "SunEC");
        verifier.initVerify(key); verifier.update(payload);
        assertTrue(verifier.verify(signature), "Server signature must verify with its independently supplied public key");
        var body = ByteBuffer.wrap(payload);
        var magic = new byte[8]; body.get(magic);
        assertArrayEquals("IEPH1ENV".getBytes(StandardCharsets.US_ASCII), magic);
        assertEquals(1, body.get()); assertEquals(1, body.getShort()); assertEquals(22, body.getShort());
        var fields = new TreeMap<Integer, byte[]>();
        for (int tag = 1; tag <= 22; tag++) {
            assertEquals(tag, Short.toUnsignedInt(body.getShort()));
            var size = Short.toUnsignedInt(body.getShort());
            assertTrue(size > 0 && size <= 256 && size <= body.remaining());
            var bytes = new byte[size]; body.get(bytes); fields.put(tag, bytes);
        }
        assertFalse(body.hasRemaining());
        assertEquals("idea-gateway-test",text(fields.get(2)),"Frozen audience policy");
        assertEquals("GRANT_UPLOAD",text(fields.get(3)),"Frozen Grant purpose policy");
        return fields;
    }
    private static UUID uuid(byte[] bytes) { assertEquals(16, bytes.length); var b = ByteBuffer.wrap(bytes); return new UUID(b.getLong(), b.getLong()); }
    private static long number(byte[] bytes) { assertEquals(8, bytes.length); return ByteBuffer.wrap(bytes).getLong(); }
    private static String text(byte[] bytes) { return new String(bytes, StandardCharsets.UTF_8); }
    private static String required(String name) { return Objects.requireNonNull(System.getenv(name), name); }
}
