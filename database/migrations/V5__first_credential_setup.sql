-- Approved F03-B successor. Existing v1 definitions and assignments are not changed.
INSERT INTO identity_role_version(role_version_id, role_code, version) VALUES
    ('9d80f77e-85a6-4c12-a72d-8ef6b7e0a003', 'account-administrator', 2);
INSERT INTO identity_role_permission(role_version_id, permission_code) VALUES
    ('9d80f77e-85a6-4c12-a72d-8ef6b7e0a003', 'account.create'),
    ('9d80f77e-85a6-4c12-a72d-8ef6b7e0a003', 'account.disable'),
    ('9d80f77e-85a6-4c12-a72d-8ef6b7e0a003', 'account.re-enable'),
    ('9d80f77e-85a6-4c12-a72d-8ef6b7e0a003', 'account.credential.setup.issue'),
    ('9d80f77e-85a6-4c12-a72d-8ef6b7e0a003', 'account.credential.reset.issue');

ALTER TABLE login_identity ADD CONSTRAINT login_identity_account_pair_unique
    UNIQUE (login_identity_id, account_id);
CREATE TABLE credential_setup_proof (
    proof_id UUID PRIMARY KEY,
    account_id UUID NOT NULL REFERENCES idea_account(account_id),
    login_identity_id UUID NOT NULL,
    purpose VARCHAR(24) NOT NULL CHECK (purpose = 'FIRST_SETUP'),
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
    FOREIGN KEY (login_identity_id, account_id)
        REFERENCES login_identity(login_identity_id, account_id),
    CHECK (expires_at = issued_at + INTERVAL '15 minutes'),
    CHECK ((consumed_at IS NULL AND consumed_operation_id IS NULL)
        OR (consumed_at >= issued_at AND consumed_at < expires_at AND consumed_operation_id IS NOT NULL))
);
REVOKE ALL ON credential_setup_proof FROM idea_ddm_app;
GRANT SELECT, INSERT ON credential_setup_proof TO idea_ddm_app;
GRANT UPDATE (consumed_at, consumed_operation_id) ON credential_setup_proof TO idea_ddm_app;
-- Reset support is a later successor migration/service, never an alias for FIRST_SETUP.
