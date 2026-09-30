-- F03-A's approved administration subset. Reviewed V1/V2 are unchanged.
ALTER TABLE idea_account ADD COLUMN organization_id UUID
    REFERENCES operating_organization(organization_id);
UPDATE idea_account SET organization_id = (SELECT organization_id FROM operating_organization);
ALTER TABLE idea_account ALTER COLUMN organization_id SET NOT NULL;
ALTER TABLE idea_account DROP CONSTRAINT idea_account_status_check;
ALTER TABLE idea_account ADD CONSTRAINT idea_account_status_check
    CHECK (status IN ('PENDING', 'ACTIVE', 'DISABLED'));
ALTER TABLE login_identity ALTER COLUMN password_verifier DROP NOT NULL;
-- PENDING identities have no password. F03-B owns one-use setup proof and activation.

INSERT INTO identity_role_version(role_version_id, role_code, version) VALUES
    ('9d80f77e-85a6-4c12-a72d-8ef6b7e0a002', 'account-administrator', 1);

CREATE TABLE identity_role_permission (
    role_version_id UUID NOT NULL REFERENCES identity_role_version(role_version_id),
    permission_code VARCHAR(120) NOT NULL,
    PRIMARY KEY (role_version_id, permission_code)
);
-- Super can grant this specific administrative role, not perform account CRUD.
INSERT INTO identity_role_permission(role_version_id, permission_code) VALUES
    ('9d80f77e-85a6-4c12-a72d-8ef6b7e0a001', 'role.assign.account-administrator'),
    ('9d80f77e-85a6-4c12-a72d-8ef6b7e0a002', 'account.create'),
    ('9d80f77e-85a6-4c12-a72d-8ef6b7e0a002', 'account.disable'),
    ('9d80f77e-85a6-4c12-a72d-8ef6b7e0a002', 'account.re-enable');
CREATE TRIGGER identity_role_permission_immutable BEFORE UPDATE OR DELETE ON identity_role_permission
    FOR EACH ROW EXECUTE FUNCTION reject_audit_evidence_mutation();

CREATE TABLE identity_authorization_decision (
    decision_id UUID PRIMARY KEY,
    operation_id UUID NOT NULL,
    stage VARCHAR(16) NOT NULL CHECK (stage IN ('REQUEST', 'COMMIT')),
    actor_id UUID NOT NULL REFERENCES actor(actor_id),
    security_version BIGINT NOT NULL,
    organization_id UUID NOT NULL,
    permission_code VARCHAR(120) NOT NULL,
    eligible BOOLEAN NOT NULL,
    granted BOOLEAN NOT NULL,
    assignment_id UUID REFERENCES identity_role_assignment(assignment_id),
    role_version_id UUID REFERENCES identity_role_version(role_version_id),
    reason_code VARCHAR(120),
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (operation_id, stage),
    CHECK ((granted AND eligible AND assignment_id IS NOT NULL AND role_version_id IS NOT NULL
        AND reason_code IS NULL) OR (NOT granted AND reason_code IS NOT NULL))
);
CREATE TRIGGER identity_authorization_decision_immutable BEFORE UPDATE OR DELETE
    ON identity_authorization_decision FOR EACH ROW EXECUTE FUNCTION reject_audit_evidence_mutation();

CREATE TABLE access_policy_owner_outcome (
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
CREATE TRIGGER access_policy_owner_outcome_immutable BEFORE UPDATE OR DELETE
    ON access_policy_owner_outcome FOR EACH ROW EXECUTE FUNCTION reject_audit_evidence_mutation();

CREATE TABLE identity_assignment_evidence (
    operation_id UUID PRIMARY KEY REFERENCES access_policy_owner_outcome(operation_id)
        DEFERRABLE INITIALLY DEFERRED,
    assignment_id UUID NOT NULL REFERENCES identity_role_assignment(assignment_id),
    principal_actor_id UUID NOT NULL REFERENCES actor(actor_id),
    role_version_id UUID NOT NULL REFERENCES identity_role_version(role_version_id),
    organization_id UUID NOT NULL REFERENCES operating_organization(organization_id),
    assigned_by UUID NOT NULL REFERENCES actor(actor_id),
    reason VARCHAR(500) NOT NULL CHECK (BTRIM(reason) <> ''),
    before_assignment_id UUID,
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TRIGGER identity_assignment_evidence_immutable BEFORE UPDATE OR DELETE
    ON identity_assignment_evidence FOR EACH ROW EXECUTE FUNCTION reject_audit_evidence_mutation();

CREATE TABLE iam_account_change_evidence (
    operation_id UUID PRIMARY KEY REFERENCES iam_owner_outcome(operation_id) DEFERRABLE INITIALLY DEFERRED,
    actor_id UUID NOT NULL REFERENCES actor(actor_id),
    account_id UUID NOT NULL REFERENCES idea_account(account_id),
    organization_id UUID NOT NULL REFERENCES operating_organization(organization_id),
    changed_by UUID NOT NULL REFERENCES actor(actor_id),
    before_status VARCHAR(16),
    after_status VARCHAR(16) NOT NULL,
    before_security_version BIGINT,
    after_security_version BIGINT NOT NULL,
    reason VARCHAR(500) NOT NULL CHECK (BTRIM(reason) <> ''),
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TRIGGER iam_account_change_evidence_immutable BEFORE UPDATE OR DELETE
    ON iam_account_change_evidence FOR EACH ROW EXECUTE FUNCTION reject_audit_evidence_mutation();

GRANT SELECT, INSERT ON operating_organization, identity_bootstrap_state, iam_owner_outcome,
    access_policy_owner_outcome, identity_authorization_decision, identity_assignment_evidence,
    iam_account_change_evidence TO idea_ddm_app;
GRANT SELECT, INSERT, UPDATE ON identity_role_assignment TO idea_ddm_app;
GRANT SELECT ON identity_role_version, identity_role_permission TO idea_ddm_app;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON identity_role_version, identity_role_permission FROM idea_ddm_app;
REVOKE UPDATE, DELETE, TRUNCATE ON operating_organization, identity_bootstrap_state, iam_owner_outcome,
    access_policy_owner_outcome, identity_authorization_decision, identity_assignment_evidence,
    iam_account_change_evidence FROM idea_ddm_app;
