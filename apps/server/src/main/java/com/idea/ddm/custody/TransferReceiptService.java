package com.idea.ddm.custody;

import com.idea.ddm.identity.ActorContext;
import com.idea.ddm.identity.OwnerSessionEligibility;
import javax.sql.DataSource;
import java.sql.Connection;
import java.security.PublicKey;
import java.time.Clock;
import java.util.UUID;
import java.util.*;
import java.sql.SQLException;
import com.idea.ddm.audit.AuditEvidenceRepository;

/** Internal authoritative custody seam, deliberately not a product permission-free route. */
public final class TransferReceiptService {
    public record Allocation(UUID vaultId,UUID locationId,String adapterKey) {}
    public record Accepted(UUID operationId,UUID transferId,UUID receiptId,UUID artifactId,UUID vaultId,UUID locationId) {}
    @FunctionalInterface public interface OwnerAllocation {
        Allocation require(Connection connection,OwnerSessionEligibility.EligibleActor actor,TransferGrantService.Scope scope,UUID receiptLocation) throws Exception;
    }
    private final DataSource source;private final OwnerSessionEligibility eligibility;private final OwnerAllocation owner;
    private final Clock clock;private final PublicKey gatewayKey;private final String issuer,audience,keyId;
    public TransferReceiptService(DataSource source,OwnerSessionEligibility eligibility,OwnerAllocation owner,
            Clock clock,PublicKey gatewayKey,String issuer,String audience,String keyId) {
        this.source=Objects.requireNonNull(source);this.eligibility=Objects.requireNonNull(eligibility);this.owner=Objects.requireNonNull(owner);
        this.clock=Objects.requireNonNull(clock);this.gatewayKey=Objects.requireNonNull(gatewayKey);this.issuer=Objects.requireNonNull(issuer);this.audience=Objects.requireNonNull(audience);this.keyId=Objects.requireNonNull(keyId);
    }
    public Accepted accept(ActorContext context,byte[] receipt) {
        receipt=Objects.requireNonNull(receipt).clone();
        boolean committing=false;
        try(var c=source.getConnection()){
            c.setAutoCommit(false);
            try{
                var actor=eligibility.admit(c,context);
                var f=ReceiptEnvelope.verify(receipt,gatewayKey,issuer,audience,keyId,clock);
                String frameHash=HexFormat.of().formatHex(java.security.MessageDigest.getInstance("SHA-256").digest(receipt));
                UUID operation=ReceiptEnvelope.uuid(f.get(7)),grantId=ReceiptEnvelope.uuid(f.get(6)),receiptId=ReceiptEnvelope.uuid(f.get(5));
                try(var lock=c.prepareStatement("SELECT pg_advisory_xact_lock(?)")){lock.setLong(1,operation.getMostSignificantBits()^operation.getLeastSignificantBits());lock.execute();}
                TransferGrantService.Scope scope;UUID transfer;long issued,expires;String grantState;
                try(var q=c.prepareStatement("SELECT g.transfer_id,g.vault_id,g.expected_byte_count,g.expected_digest,g.allowed_byte_start,g.allowed_byte_end,g.issued_at,g.expires_at,g.status,s.actor_id,s.organization_id,s.correlation_id,s.gateway_id,s.endpoint,s.object_kind,s.object_id FROM transfer_grant g JOIN transfer_grant_scope s USING(grant_id) WHERE g.grant_id=? AND g.operation_id=?")){
                    q.setObject(1,grantId);q.setObject(2,operation);try(var r=q.executeQuery()){
                        if(!r.next()||!actor.actorId().equals(r.getObject(10,UUID.class))||!actor.organizationId().equals(r.getObject(11,UUID.class)))throw new SecurityException("RECEIPT_SCOPE_REFUSED");
                        transfer=r.getObject(1,UUID.class);issued=r.getTimestamp(7).toInstant().getEpochSecond();expires=r.getTimestamp(8).toInstant().getEpochSecond();grantState=r.getString(9);
                        scope=new TransferGrantService.Scope(operation,r.getObject(12,UUID.class),r.getObject(2,UUID.class),r.getObject(13,UUID.class),r.getString(14),r.getInt(15),r.getObject(16,UUID.class),r.getLong(3),r.getString(4),r.getLong(5),r.getLong(6));
                    }
                }
                UUID location=ReceiptEnvelope.uuid(f.get(17));
                if(!transfer.equals(ReceiptEnvelope.uuid(f.get(8)))||!actor.organizationId().equals(ReceiptEnvelope.uuid(f.get(9)))||!actor.actorId().equals(ReceiptEnvelope.uuid(f.get(10)))
                        ||!scope.gatewayId().equals(ReceiptEnvelope.uuid(f.get(11)))||!scope.endpoint().equals(ReceiptEnvelope.text(f.get(12)))||scope.objectKind()!=f.get(14)[0]
                        ||!scope.objectId().equals(ReceiptEnvelope.uuid(f.get(15)))||!scope.vaultId().equals(ReceiptEnvelope.uuid(f.get(16)))||scope.byteCount()!=ReceiptEnvelope.number(f.get(18))
                        ||!scope.digest().equals(HexFormat.of().formatHex(f.get(19)))||ReceiptEnvelope.number(f.get(20))!=0||ReceiptEnvelope.number(f.get(21))!=scope.byteCount()
                        ||scope.rangeStart()!=0||scope.rangeEnd()!=scope.byteCount()||ReceiptEnvelope.number(f.get(23))<issued||ReceiptEnvelope.number(f.get(23))>=expires)
                    throw new SecurityException("RECEIPT_SCOPE_REFUSED");
                var allocation=allocation(c,actor,scope,location);
                var accepted=new Accepted(operation,transfer,receiptId,scope.objectId(),scope.vaultId(),location);
                boolean original=false;
                try(var q=c.prepareStatement("SELECT r.receipt_id,l.location_id,l.artifact_id,l.adapter_key,e.signed_frame_sha256,e.grant_id FROM transfer_receipt r JOIN artifact_location l USING(receipt_id) JOIN transfer_receipt_evidence e USING(receipt_id) WHERE r.transfer_id=?")){
                    q.setObject(1,transfer);try(var r=q.executeQuery()){
                        if(r.next()){
                            if(!receiptId.equals(r.getObject(1,UUID.class))||!location.equals(r.getObject(2,UUID.class))||!scope.objectId().equals(r.getObject(3,UUID.class))||!allocation.adapterKey().equals(r.getString(4))
                                    ||!frameHash.equals(r.getString(5))||!grantId.equals(r.getObject(6,UUID.class))||r.next())throw new SecurityException("RECEIPT_RESULT_CONFLICT");
                            original=true;
                        }
                    }
                }
                if(!original){
                    if(!"ISSUED".equals(grantState))throw new SecurityException("GRANT_NOT_ELIGIBLE_FOR_CUSTODY");
                    require(c,"INSERT INTO transfer_receipt(receipt_id,transfer_id,operation_id,vault_id,direction,accepted_byte_count,digest_algorithm,accepted_digest,verification_status) VALUES (?,?,?,?,'UPLOAD',?,'SHA-256',?,'VERIFIED')",receiptId,transfer,operation,scope.vaultId(),scope.byteCount(),scope.digest());
                    require(c,"INSERT INTO transfer_receipt_evidence(receipt_id,transfer_id,grant_id,signed_frame_sha256,contract_version) VALUES (?,?,?,?,1)",receiptId,transfer,grantId,frameHash);
                    try(var q=c.prepareStatement("SELECT byte_count,digest_value,digest_algorithm FROM artifact WHERE artifact_id=?")){
                        q.setObject(1,scope.objectId());try(var r=q.executeQuery()){
                            if(r.next()){if(r.getLong(1)!=scope.byteCount()||!scope.digest().equals(r.getString(2))||!"SHA-256".equals(r.getString(3)))throw new SecurityException("ARTIFACT_IMMUTABLE_CONFLICT");}
                            else require(c,"INSERT INTO artifact(artifact_id,digest_algorithm,digest_value,byte_count) VALUES (?,'SHA-256',?,?)",scope.objectId(),scope.digest(),scope.byteCount());
                        }
                    }
                    require(c,"INSERT INTO artifact_location(location_id,artifact_id,vault_id,receipt_id,adapter_key,verification_state,verified_at) VALUES (?,?,?,?,?,'VERIFIED',CURRENT_TIMESTAMP)",location,scope.objectId(),scope.vaultId(),receiptId,allocation.adapterKey());
                    require(c,"UPDATE transfer_record SET state='CONSUMED' WHERE transfer_id=? AND state IN ('PREPARING','TRANSFERRING','VERIFIED')",transfer);
                    require(c,"UPDATE transfer_grant SET status='CONSUMED' WHERE grant_id=? AND status='ISSUED'",grantId);
                    AuditEvidenceRepository.append(c,new AuditEvidenceRepository.Entry(UUID.randomUUID(),operation,actor.actorId(),"transfer.receipt.accept","ArtifactLocation",location.toString(),"ACCEPTED",null,scope.correlationId().toString()));
                }
                eligibility.coordinateCommit(c,context,actor,!original);
                if(!allocation.equals(allocation(c,actor,scope,location)))throw new SecurityException("ALLOCATION_CHANGED_BEFORE_COMMIT");
                // Controlled time and exact signed evidence are checked again immediately before commit.
                ReceiptEnvelope.verify(receipt,gatewayKey,issuer,audience,keyId,clock);
                committing=true;c.commit();return accepted;
            }catch(Exception failure){try{c.rollback();}catch(SQLException rollback){failure.addSuppressed(rollback);}throw new IllegalStateException(committing?"RECEIPT_COMMIT_OUTCOME_UNCERTAIN":"RECEIPT_NOT_COMMITTED",failure);}
        }catch(SQLException failure){throw new IllegalStateException("RECEIPT_STORAGE_UNAVAILABLE",failure);}
    }
    private Allocation allocation(Connection c,OwnerSessionEligibility.EligibleActor actor,TransferGrantService.Scope scope,UUID location) throws Exception {
        var selected=Objects.requireNonNull(owner.require(c,actor,scope,location));
        if(!scope.vaultId().equals(selected.vaultId())||!location.equals(selected.locationId())||selected.adapterKey()==null||selected.adapterKey().isBlank()||selected.adapterKey().length()>512)throw new SecurityException("ALLOCATION_REFUSED");
        try(var q=c.prepareStatement("SELECT 1 FROM vault_endpoint WHERE vault_id=? AND eligibility='ELIGIBLE'")){q.setObject(1,scope.vaultId());try(var r=q.executeQuery()){if(!r.next())throw new SecurityException("ALLOCATION_REFUSED");}}
        return selected;
    }
    private static void require(Connection c,String sql,Object... values) throws SQLException {
        try(var q=c.prepareStatement(sql)){for(int i=0;i<values.length;i++)q.setObject(i+1,values[i]);if(q.executeUpdate()!=1)throw new SQLException("Required custody write missing");}
    }
}
