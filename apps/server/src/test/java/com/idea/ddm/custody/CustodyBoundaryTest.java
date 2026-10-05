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

/** G01 tracer only. Missing TransferGrantService is the initial compilation RED, not a DB PASS. */
class CustodyBoundaryTest {
    @BeforeAll
    static void freshOwnedSchema() throws Exception { F05DatabaseFixture.create(); }
    @Test
    void g01ServerEstablishedActorObtainsExactPersistedSignedPrivateGrant() throws Exception {
        var clock = Clock.systemUTC();
        var schema = required("IDEA_F05_TEST_SCHEMA");
        assertTrue(schema.matches("f05_[0-9a-f]{32}"));
        var url = "jdbc:postgresql://127.0.0.1:5432/idea_ddm_f05a_20261005_t028?currentSchema=" + schema;
        try (var fixture = new F05SessionFixture(url, clock)) {
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
        return fields;
    }
    private static UUID uuid(byte[] bytes) { assertEquals(16, bytes.length); var b = ByteBuffer.wrap(bytes); return new UUID(b.getLong(), b.getLong()); }
    private static long number(byte[] bytes) { assertEquals(8, bytes.length); return ByteBuffer.wrap(bytes).getLong(); }
    private static String text(byte[] bytes) { return new String(bytes, StandardCharsets.UTF_8); }
    private static String required(String name) { return Objects.requireNonNull(System.getenv(name), name); }
}
