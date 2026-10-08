-- Project Governance owns results; no IAM outcome or invented committed-event contract.
CREATE TABLE project_owner_outcome (
    operation_id UUID PRIMARY KEY,
    actor_id UUID NOT NULL,
    organization_id UUID NOT NULL,
    action VARCHAR(120) NOT NULL,
    input_digest CHAR(64) NOT NULL CHECK (input_digest ~ '^[0-9a-f]{64}$'),
    target_id UUID NOT NULL,
    outcome VARCHAR(16) NOT NULL CHECK (outcome IN ('ACCEPTED','REFUSED')),
    reason_code VARCHAR(80),
    correlation_id UUID NOT NULL,
    result JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (actor_id,organization_id) REFERENCES idea_account(actor_id,organization_id),
    CHECK ((outcome='ACCEPTED' AND reason_code IS NULL) OR (outcome='REFUSED' AND reason_code IS NOT NULL))
);
CREATE TABLE project_authorization_evidence (
    evidence_id UUID PRIMARY KEY,
    attempt_id UUID NOT NULL,
    operation_id UUID NOT NULL,
    stage VARCHAR(16) NOT NULL CHECK (stage IN ('REQUEST','COMMIT')),
    actor_id UUID NOT NULL REFERENCES actor(actor_id),
    organization_id UUID NOT NULL REFERENCES operating_organization(organization_id),
    project_id UUID,
    permission_code VARCHAR(120) NOT NULL REFERENCES permission_registry(permission_code),
    evaluated_at TIMESTAMPTZ NOT NULL,
    eligible BOOLEAN NOT NULL,
    granted BOOLEAN NOT NULL,
    paths JSONB NOT NULL,
    reason_code VARCHAR(80),
    UNIQUE (attempt_id,stage)
);
CREATE INDEX project_outcome_actor ON project_owner_outcome(organization_id,actor_id,created_at);
CREATE TRIGGER project_owner_outcome_immutable BEFORE UPDATE OR DELETE OR TRUNCATE
    ON project_owner_outcome FOR EACH STATEMENT EXECUTE FUNCTION reject_retained_owner_mutation();
CREATE TRIGGER project_authorization_evidence_immutable BEFORE UPDATE OR DELETE OR TRUNCATE
    ON project_authorization_evidence FOR EACH STATEMENT EXECUTE FUNCTION reject_retained_owner_mutation();
REVOKE ALL ON project_owner_outcome,project_authorization_evidence FROM idea_ddm_app;
GRANT SELECT,INSERT ON project_owner_outcome,project_authorization_evidence TO idea_ddm_app;
