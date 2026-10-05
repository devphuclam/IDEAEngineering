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
class CustodyBoundaryTest {
    private static F05SessionFixture fixture;
    @BeforeAll
    static void freshOwnedSchema() throws Exception {
        F05DatabaseFixture.create();
        fixture = new F05SessionFixture(F05DatabaseFixture.url(), Clock.systemUTC());
    }
    @AfterAll
    static void stopOwnedServer() { if (fixture != null) fixture.close(); }
    @Test
    void g01ServerEstablishedActorObtainsExactPersistedSignedPrivateGrant() throws Exception {
        var clock = Clock.systemUTC();
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
            },Clock.systemUTC(),key.getPrivate(),"idea-server-test","idea-gateway-test","server-key-test");
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
        },Clock.systemUTC(),key.getPrivate(),"idea-server-test","idea-gateway-test","server-key-test");
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
    private static TransferGrantService service(F05SessionFixture.SignedIn signedIn,TransferGrantService.Scope expected,
            java.security.PrivateKey key) {
        return new TransferGrantService(fixture.app(),fixture.eligibility(),(connection,actor,requested)->{
            if(!actor.actorId().equals(signedIn.actorId()) || !actor.organizationId().equals(signedIn.organizationId())
                    || !expected.equals(requested)) throw new SecurityException("OWNER_ALLOCATION_REFUSED");
        },Clock.systemUTC(),key,"idea-server-test","idea-gateway-test","server-key-test");
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
