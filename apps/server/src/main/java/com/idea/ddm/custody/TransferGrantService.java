package com.idea.ddm.custody;

import com.idea.ddm.identity.ActorContext;
import com.idea.ddm.identity.OwnerSessionEligibility;
import com.idea.ddm.audit.AuditEvidenceRepository;
import java.security.PrivateKey;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.Instant;
import java.time.Clock;
import java.util.UUID;
import java.util.Objects;
import javax.sql.DataSource;

/** Internal Server owner seam; no automatic owner policy, component registration or public endpoint. */
public final class TransferGrantService {
    public record Scope(UUID operationId, UUID correlationId, UUID vaultId, UUID gatewayId,
            String endpoint, int objectKind, UUID objectId, long byteCount, String digest,
            long rangeStart, long rangeEnd) {
        public Scope {
            Objects.requireNonNull(operationId); Objects.requireNonNull(correlationId); Objects.requireNonNull(vaultId);
            Objects.requireNonNull(gatewayId); Objects.requireNonNull(endpoint); Objects.requireNonNull(objectId); Objects.requireNonNull(digest);
        }
    }
    public record Grant(UUID grantId, UUID transferId, UUID operationId, UUID actorId, UUID organizationId,
            Scope scope, long issuedAt, long expiresAt, byte[] frame) {
        public Grant { frame = frame.clone(); }
        @Override public byte[] frame() { return frame.clone(); }
        @Override public String toString() { return "TransferGrant[redacted]"; }
    }
    @FunctionalInterface
    public interface OwnerAdmission {
        void require(Connection connection, OwnerSessionEligibility.EligibleActor actor, Scope scope) throws Exception;
    }
    private final DataSource source;
    private final OwnerSessionEligibility eligibility;
    private final OwnerAdmission owner;
    private final Clock clock;
    private final PrivateKey key;
    private final String issuer, audience, keyId;
    public TransferGrantService(DataSource source, OwnerSessionEligibility eligibility, OwnerAdmission owner,
            Clock clock, PrivateKey key, String issuer, String audience, String keyId) {
        this.source=Objects.requireNonNull(source); this.eligibility=Objects.requireNonNull(eligibility);
        this.owner=Objects.requireNonNull(owner); this.clock=Objects.requireNonNull(clock); this.key=Objects.requireNonNull(key);
        this.issuer=Objects.requireNonNull(issuer); this.audience=Objects.requireNonNull(audience); this.keyId=Objects.requireNonNull(keyId);
    }
    public Grant issue(ActorContext context, Scope scope) {
        boolean committing = false;
        try (var connection = source.getConnection()) {
            connection.setAutoCommit(false);
            try {
                var actor = eligibility.admit(connection, context);
                owner.require(connection, actor, scope); allocation(connection, scope);
                long issued = clock.instant().getEpochSecond();
                var grant = signed(new Grant(UUID.randomUUID(), UUID.randomUUID(), scope.operationId(), actor.actorId(),
                        actor.organizationId(), scope, issued, Math.addExact(issued,300), new byte[0]), issuer, audience, keyId);
                insert(connection, "INSERT INTO transfer_record(transfer_id,operation_id,actor_id,vault_id,direction,expected_byte_count,digest_algorithm,expected_digest,state) VALUES (?,?,?,?,'UPLOAD',?,'SHA-256',?,'PREPARING')",
                        grant.transferId(),scope.operationId(),actor.actorId(),scope.vaultId(),scope.byteCount(),scope.digest());
                insert(connection, "INSERT INTO transfer_grant(grant_id,transfer_id,operation_id,vault_id,direction,expected_byte_count,digest_algorithm,expected_digest,allowed_byte_start,allowed_byte_end,issued_at,expires_at,status) VALUES (?,?,?,?,'UPLOAD',?,'SHA-256',?,?,?,?,?,'ISSUED')",
                        grant.grantId(),grant.transferId(),scope.operationId(),scope.vaultId(),scope.byteCount(),scope.digest(),scope.rangeStart(),scope.rangeEnd(),
                        Timestamp.from(Instant.ofEpochSecond(grant.issuedAt())),Timestamp.from(Instant.ofEpochSecond(grant.expiresAt())));
                insert(connection, "INSERT INTO transfer_grant_scope(grant_id,transfer_id,actor_id,organization_id,correlation_id,gateway_id,endpoint,object_kind,object_id,issuer,audience,signing_key_id,contract_version) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,1)",
                        grant.grantId(),grant.transferId(),actor.actorId(),actor.organizationId(),scope.correlationId(),scope.gatewayId(),scope.endpoint(),scope.objectKind(),scope.objectId(),issuer,audience,keyId);
                AuditEvidenceRepository.append(connection, new AuditEvidenceRepository.Entry(UUID.randomUUID(),scope.operationId(),actor.actorId(),
                        "transfer.grant.issue","TransferGrant",grant.grantId().toString(),"ACCEPTED",null,scope.correlationId().toString()));
                eligibility.coordinateCommit(connection,context,actor,true);
                owner.require(connection,actor,scope); allocation(connection,scope);
                committing=true; connection.commit();
                return grant; // A signed frame never escapes before the authoritative issuance commit.
            } catch (Exception failure) {
                try { connection.rollback(); } catch (SQLException rollback) { failure.addSuppressed(rollback); }
                throw new IllegalStateException(committing ? "GRANT_COMMIT_OUTCOME_UNCERTAIN" : "GRANT_NOT_COMMITTED",failure);
            }
        } catch (SQLException failure) { throw new IllegalStateException("GRANT_STORAGE_UNAVAILABLE",failure); }
    }
    public Grant resolve(ActorContext context, UUID operationId) {
        try (var connection = source.getConnection()) {
            connection.setAutoCommit(false);
            try {
                var actor = eligibility.admit(connection,context);
                try (var query = connection.prepareStatement("SELECT g.grant_id,g.transfer_id,g.vault_id,g.expected_byte_count,g.expected_digest,g.allowed_byte_start,g.allowed_byte_end,g.issued_at,g.expires_at,s.actor_id,s.organization_id,s.correlation_id,s.gateway_id,s.endpoint,s.object_kind,s.object_id,s.issuer,s.audience,s.signing_key_id FROM transfer_grant g JOIN transfer_grant_scope s ON s.grant_id=g.grant_id WHERE g.operation_id=? ORDER BY g.issued_at DESC,g.grant_id")) {
                    query.setObject(1,operationId);
                    try (var row = query.executeQuery()) {
                        if (!row.next() || !actor.organizationId().equals(row.getObject(11,UUID.class))) throw new SecurityException("RESULT_UNAVAILABLE");
                        var scope = new Scope(operationId,row.getObject(12,UUID.class),row.getObject(3,UUID.class),row.getObject(13,UUID.class),row.getString(14),row.getInt(15),row.getObject(16,UUID.class),row.getLong(4),row.getString(5),row.getLong(6),row.getLong(7));
                        owner.require(connection,actor,scope); allocation(connection,scope);
                        if (!issuer.equals(row.getString(17)) || !audience.equals(row.getString(18)) || !keyId.equals(row.getString(19))) throw new SecurityException("SIGNING_IDENTITY_UNAVAILABLE");
                        var grant = signed(new Grant(row.getObject(1,UUID.class),row.getObject(2,UUID.class),operationId,row.getObject(10,UUID.class),row.getObject(11,UUID.class),scope,row.getTimestamp(8).toInstant().getEpochSecond(),row.getTimestamp(9).toInstant().getEpochSecond(),new byte[0]),issuer,audience,keyId);
                        eligibility.coordinateCommit(connection,context,actor,false); owner.require(connection,actor,scope);
                        connection.commit(); return grant;
                    }
                }
            } catch (Exception failure) { connection.rollback(); throw new IllegalStateException("RESULT_UNAVAILABLE",failure); }
        } catch (SQLException failure) { throw new IllegalStateException("RESULT_STORAGE_UNAVAILABLE",failure); }
    }
    private Grant signed(Grant grant, String issuer, String audience, String keyId) throws Exception {
        return new Grant(grant.grantId(),grant.transferId(),grant.operationId(),grant.actorId(),grant.organizationId(),grant.scope(),grant.issuedAt(),grant.expiresAt(),GrantEnvelope.sign(grant,key,issuer,audience,keyId));
    }
    private static void allocation(Connection connection,Scope scope) throws SQLException {
        try (var query=connection.prepareStatement("SELECT 1 FROM vault_endpoint WHERE vault_id=? AND eligibility='ELIGIBLE'")) {
            query.setObject(1,scope.vaultId()); try(var row=query.executeQuery()) { if(!row.next()) throw new SecurityException("ALLOCATION_UNAVAILABLE"); }
        }
    }
    private static void insert(Connection connection,String sql,Object... values) throws SQLException {
        try(var query=connection.prepareStatement(sql)) { for(int i=0;i<values.length;i++) query.setObject(i+1,values[i]); if(query.executeUpdate()!=1) throw new SQLException("Required Grant insert missing"); }
    }
}
