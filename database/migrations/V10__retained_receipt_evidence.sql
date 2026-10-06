-- Additive exact signed-evidence retention. Existing V1-V9 bytes remain unchanged.
ALTER TABLE transfer_receipt ADD CONSTRAINT receipt_transfer_identity UNIQUE (receipt_id,transfer_id);
CREATE TABLE transfer_receipt_evidence (
    receipt_id UUID PRIMARY KEY,
    transfer_id UUID NOT NULL UNIQUE,
    grant_id UUID NOT NULL,
    signed_frame_sha256 CHAR(64) NOT NULL CHECK (signed_frame_sha256 ~ '^[0-9a-f]{64}$'),
    contract_version INTEGER NOT NULL CHECK (contract_version=1),
    FOREIGN KEY (receipt_id,transfer_id) REFERENCES transfer_receipt(receipt_id,transfer_id),
    FOREIGN KEY (grant_id,transfer_id) REFERENCES transfer_grant(grant_id,transfer_id)
);
GRANT SELECT,INSERT ON transfer_receipt_evidence TO idea_ddm_app;
REVOKE UPDATE,DELETE,TRUNCATE ON transfer_receipt_evidence FROM idea_ddm_app;
CREATE TRIGGER transfer_receipt_evidence_append_only
    BEFORE UPDATE OR DELETE OR TRUNCATE ON transfer_receipt_evidence
    FOR EACH STATEMENT EXECUTE FUNCTION reject_retained_owner_mutation();
