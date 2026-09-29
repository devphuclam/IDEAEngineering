-- PH1 delivery baseline. This defines identities and custody metadata only.
-- It intentionally creates no Logical Document, Generation, Checkout, Review or Release data.

CREATE TABLE actor (
    actor_id UUID PRIMARY KEY,
    display_name VARCHAR(160) NOT NULL CHECK (BTRIM(display_name) <> ''),
    disabled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE idea_account (
    account_id UUID PRIMARY KEY,
    actor_id UUID NOT NULL UNIQUE REFERENCES actor (actor_id),
    status VARCHAR(16) NOT NULL CHECK (status IN ('ACTIVE', 'DISABLED')),
    security_version BIGINT NOT NULL DEFAULT 1 CHECK (security_version > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE login_identity (
    login_identity_id UUID PRIMARY KEY,
    account_id UUID NOT NULL REFERENCES idea_account (account_id),
    login_identifier VARCHAR(254) NOT NULL CHECK (BTRIM(login_identifier) <> ''),
    normalized_login_identifier VARCHAR(254) NOT NULL UNIQUE
        CHECK (BTRIM(normalized_login_identifier) <> ''),
    password_verifier TEXT NOT NULL CHECK (BTRIM(password_verifier) <> ''),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE session_record (
    session_id UUID PRIMARY KEY,
    actor_id UUID NOT NULL REFERENCES actor (actor_id),
    security_version BIGINT NOT NULL CHECK (security_version > 0),
    issued_at TIMESTAMPTZ NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    revoked_at TIMESTAMPTZ,
    CHECK (expires_at > issued_at),
    CHECK (revoked_at IS NULL OR revoked_at >= issued_at)
);

CREATE TABLE sample_owner_operation (
    operation_id UUID PRIMARY KEY,
    actor_id UUID NOT NULL REFERENCES actor (actor_id),
    command_kind VARCHAR(120) NOT NULL CHECK (BTRIM(command_kind) <> ''),
    correlation_id VARCHAR(160) NOT NULL CHECK (BTRIM(correlation_id) <> ''),
    outcome VARCHAR(16) NOT NULL CHECK (outcome IN ('ACCEPTED', 'REFUSED')),
    reason_code VARCHAR(120),
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CHECK ((outcome = 'ACCEPTED' AND reason_code IS NULL)
        OR (outcome = 'REFUSED' AND reason_code IS NOT NULL AND BTRIM(reason_code) <> ''))
);

CREATE TABLE audit_evidence (
    evidence_id UUID PRIMARY KEY,
    -- OperationId is shared across PH1 owners; Audit must not depend on the sample owner table.
    operation_id UUID NOT NULL,
    actor_id UUID NOT NULL REFERENCES actor (actor_id),
    action VARCHAR(120) NOT NULL CHECK (BTRIM(action) <> ''),
    target_type VARCHAR(120) NOT NULL CHECK (BTRIM(target_type) <> ''),
    target_id VARCHAR(200) NOT NULL CHECK (BTRIM(target_id) <> ''),
    outcome VARCHAR(16) NOT NULL CHECK (outcome IN ('ACCEPTED', 'REFUSED')),
    reason_code VARCHAR(120),
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CHECK ((outcome = 'ACCEPTED' AND reason_code IS NULL)
        OR (outcome = 'REFUSED' AND reason_code IS NOT NULL AND BTRIM(reason_code) <> ''))
);

CREATE FUNCTION reject_audit_evidence_mutation() RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    RAISE EXCEPTION 'audit_evidence is append-only' USING ERRCODE = '42501';
END;
$$;

CREATE TRIGGER audit_evidence_append_only
    BEFORE UPDATE OR DELETE ON audit_evidence
    FOR EACH ROW EXECUTE FUNCTION reject_audit_evidence_mutation();

CREATE TABLE vault_endpoint (
    vault_id UUID PRIMARY KEY,
    adapter_kind VARCHAR(40) NOT NULL CHECK (BTRIM(adapter_kind) <> ''),
    eligibility VARCHAR(16) NOT NULL CHECK (eligibility IN ('ELIGIBLE', 'INELIGIBLE')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transfer_record (
    transfer_id UUID PRIMARY KEY,
    operation_id UUID NOT NULL UNIQUE,
    actor_id UUID NOT NULL REFERENCES actor (actor_id),
    vault_id UUID NOT NULL REFERENCES vault_endpoint (vault_id),
    direction VARCHAR(16) NOT NULL CHECK (direction IN ('UPLOAD', 'DOWNLOAD')),
    expected_byte_count BIGINT NOT NULL CHECK (expected_byte_count >= 0),
    digest_algorithm VARCHAR(32) NOT NULL CHECK (BTRIM(digest_algorithm) <> ''),
    expected_digest VARCHAR(256) NOT NULL CHECK (BTRIM(expected_digest) <> ''),
    state VARCHAR(24) NOT NULL CHECK (state IN (
        'PREPARING', 'TRANSFERRING', 'VERIFIED', 'CONSUMED',
        'FAILED', 'EXPIRED', 'NEEDS_RECONCILIATION')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_transfer_exact_claim UNIQUE (
        transfer_id, operation_id, vault_id, direction,
        expected_byte_count, digest_algorithm, expected_digest)
);

CREATE TABLE transfer_grant (
    grant_id UUID PRIMARY KEY,
    transfer_id UUID NOT NULL,
    operation_id UUID NOT NULL,
    vault_id UUID NOT NULL,
    direction VARCHAR(16) NOT NULL,
    expected_byte_count BIGINT NOT NULL,
    digest_algorithm VARCHAR(32) NOT NULL,
    expected_digest VARCHAR(256) NOT NULL,
    allowed_byte_start BIGINT NOT NULL CHECK (allowed_byte_start >= 0),
    allowed_byte_end BIGINT NOT NULL CHECK (allowed_byte_end >= allowed_byte_start),
    issued_at TIMESTAMPTZ NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    status VARCHAR(16) NOT NULL CHECK (status IN ('ISSUED', 'CONSUMED', 'REVOKED', 'EXPIRED')),
    CHECK (expires_at > issued_at),
    CHECK (allowed_byte_end <= expected_byte_count),
    CONSTRAINT fk_grant_exact_transfer_claim FOREIGN KEY (
        transfer_id, operation_id, vault_id, direction,
        expected_byte_count, digest_algorithm, expected_digest)
        REFERENCES transfer_record (
            transfer_id, operation_id, vault_id, direction,
            expected_byte_count, digest_algorithm, expected_digest)
);

CREATE TABLE transfer_receipt (
    receipt_id UUID PRIMARY KEY,
    transfer_id UUID NOT NULL,
    operation_id UUID NOT NULL,
    vault_id UUID NOT NULL,
    direction VARCHAR(16) NOT NULL,
    accepted_byte_count BIGINT NOT NULL CHECK (accepted_byte_count >= 0),
    digest_algorithm VARCHAR(32) NOT NULL CHECK (BTRIM(digest_algorithm) <> ''),
    accepted_digest VARCHAR(256) NOT NULL CHECK (BTRIM(accepted_digest) <> ''),
    verification_status VARCHAR(16) NOT NULL CHECK (verification_status = 'VERIFIED'),
    received_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_receipt_exact_transfer_claim FOREIGN KEY (
        transfer_id, operation_id, vault_id, direction,
        accepted_byte_count, digest_algorithm, accepted_digest)
        REFERENCES transfer_record (
            transfer_id, operation_id, vault_id, direction,
            expected_byte_count, digest_algorithm, expected_digest)
);

CREATE TABLE artifact (
    artifact_id UUID PRIMARY KEY,
    digest_algorithm VARCHAR(32) NOT NULL CHECK (BTRIM(digest_algorithm) <> ''),
    digest_value VARCHAR(256) NOT NULL CHECK (BTRIM(digest_value) <> ''),
    byte_count BIGINT NOT NULL CHECK (byte_count >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE artifact_location (
    location_id UUID PRIMARY KEY,
    artifact_id UUID NOT NULL REFERENCES artifact (artifact_id),
    vault_id UUID NOT NULL REFERENCES vault_endpoint (vault_id),
    receipt_id UUID NOT NULL UNIQUE REFERENCES transfer_receipt (receipt_id),
    adapter_key VARCHAR(512) NOT NULL CHECK (BTRIM(adapter_key) <> ''),
    verification_state VARCHAR(24) NOT NULL CHECK (verification_state IN (
        'PRIVATE_CANDIDATE', 'VERIFIED', 'RECONCILIATION_REQUIRED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    verified_at TIMESTAMPTZ,
    CONSTRAINT uq_location_adapter_key UNIQUE (vault_id, adapter_key),
    CHECK ((verification_state = 'VERIFIED' AND verified_at IS NOT NULL)
        OR (verification_state <> 'VERIFIED' AND verified_at IS NULL))
);

GRANT SELECT, INSERT, UPDATE, DELETE ON actor, idea_account, login_identity, session_record,
    sample_owner_operation, vault_endpoint, transfer_record, transfer_grant, transfer_receipt,
    artifact, artifact_location TO idea_ddm_app;
GRANT SELECT, INSERT ON audit_evidence TO idea_ddm_app;
REVOKE UPDATE, DELETE, TRUNCATE ON audit_evidence FROM idea_ddm_app;
