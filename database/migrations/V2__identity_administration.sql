-- F03-A subset; no document, Approval or Release permissions.
CREATE TABLE operating_organization (
    singleton BOOLEAN PRIMARY KEY DEFAULT TRUE CHECK (singleton),
    organization_id UUID NOT NULL UNIQUE,
    display_name VARCHAR(160) NOT NULL CHECK (BTRIM(display_name) <> '')
);

CREATE TABLE identity_role_version (
    role_version_id UUID PRIMARY KEY,
    role_code VARCHAR(120) NOT NULL,
    version INTEGER NOT NULL CHECK (version > 0),
    protected BOOLEAN NOT NULL DEFAULT TRUE,
    UNIQUE (role_code, version)
);

INSERT INTO identity_role_version (role_version_id, role_code, version) VALUES
    ('9d80f77e-85a6-4c12-a72d-8ef6b7e0a001', 'super-administrator', 1);

CREATE TABLE identity_role_assignment (
    assignment_id UUID PRIMARY KEY,
    principal_actor_id UUID NOT NULL REFERENCES actor(actor_id),
    role_version_id UUID NOT NULL REFERENCES identity_role_version(role_version_id),
    organization_id UUID NOT NULL REFERENCES operating_organization(organization_id),
    assigned_by UUID NOT NULL REFERENCES actor(actor_id),
    reason VARCHAR(500) NOT NULL CHECK (BTRIM(reason) <> ''),
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    revoked_at TIMESTAMPTZ,
    UNIQUE (principal_actor_id, role_version_id, organization_id)
);

CREATE TABLE identity_bootstrap_state (
    singleton BOOLEAN PRIMARY KEY DEFAULT TRUE CHECK (singleton),
    organization_id UUID NOT NULL REFERENCES operating_organization(organization_id),
    actor_id UUID NOT NULL REFERENCES actor(actor_id),
    account_id UUID NOT NULL REFERENCES idea_account(account_id),
    completed_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE iam_owner_outcome (
    operation_id UUID PRIMARY KEY,
    actor_id UUID NOT NULL REFERENCES actor(actor_id),
    action VARCHAR(120) NOT NULL,
    target_id VARCHAR(200) NOT NULL,
    outcome VARCHAR(16) NOT NULL CHECK (outcome IN ('ACCEPTED', 'REFUSED')),
    reason_code VARCHAR(120),
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CHECK ((outcome = 'ACCEPTED' AND reason_code IS NULL)
        OR (outcome = 'REFUSED' AND reason_code IS NOT NULL))
);

CREATE TRIGGER identity_role_version_immutable
    BEFORE UPDATE OR DELETE ON identity_role_version
    FOR EACH ROW EXECUTE FUNCTION reject_audit_evidence_mutation();
CREATE TRIGGER identity_bootstrap_state_immutable
    BEFORE UPDATE OR DELETE ON identity_bootstrap_state
    FOR EACH ROW EXECUTE FUNCTION reject_audit_evidence_mutation();
CREATE TRIGGER iam_owner_outcome_immutable
    BEFORE UPDATE OR DELETE ON iam_owner_outcome
    FOR EACH ROW EXECUTE FUNCTION reject_audit_evidence_mutation();
