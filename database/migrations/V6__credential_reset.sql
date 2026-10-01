-- Reset changes credential authority, never account enablement. V1-V5 remain immutable.
CREATE TABLE credential_reset_proof (
    proof_id UUID PRIMARY KEY,
    account_id UUID NOT NULL REFERENCES idea_account(account_id),
    login_identity_id UUID NOT NULL,
    purpose VARCHAR(24) NOT NULL CHECK (purpose = 'RESET'),
    security_version BIGINT NOT NULL CHECK (security_version >= 1),
    proof_digest CHAR(64) NOT NULL UNIQUE CHECK (proof_digest ~ '^[0-9a-f]{64}$'),
    issued_by UUID NOT NULL REFERENCES actor(actor_id),
    issue_operation_id UUID NOT NULL UNIQUE REFERENCES iam_owner_outcome(operation_id)
        DEFERRABLE INITIALLY DEFERRED,
    reason VARCHAR(500) NOT NULL CHECK (BTRIM(reason) <> ''),
    issued_at TIMESTAMPTZ NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    consumed_at TIMESTAMPTZ,
    consumed_operation_id UUID UNIQUE REFERENCES iam_owner_outcome(operation_id)
        DEFERRABLE INITIALLY DEFERRED,
    FOREIGN KEY (login_identity_id, account_id) REFERENCES login_identity(login_identity_id, account_id),
    CHECK (expires_at = issued_at + INTERVAL '15 minutes'),
    CHECK ((consumed_at IS NULL AND consumed_operation_id IS NULL)
        OR (consumed_at IS NOT NULL AND consumed_at >= issued_at AND consumed_at < expires_at
            AND consumed_operation_id IS NOT NULL))
);
REVOKE ALL ON credential_reset_proof FROM idea_ddm_app;
GRANT SELECT, INSERT ON credential_reset_proof TO idea_ddm_app;
GRANT UPDATE (consumed_at, consumed_operation_id) ON credential_reset_proof TO idea_ddm_app;

-- Harden the predecessor's same complete-pair invariant additively, never rewrite V5.
-- Existing contradictory rows make migration fail rather than silently repair evidence.
ALTER TABLE credential_setup_proof ADD CONSTRAINT credential_setup_consumption_complete
    CHECK ((consumed_at IS NULL AND consumed_operation_id IS NULL)
        OR (consumed_at IS NOT NULL AND consumed_operation_id IS NOT NULL));
