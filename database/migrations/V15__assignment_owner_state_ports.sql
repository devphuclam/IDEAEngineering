-- Access Policy owns exact independent assignments. Predecessor migrations/content stay intact.
CREATE TABLE assignment_owner_operation (
    operation_id UUID PRIMARY KEY REFERENCES access_policy_owner_outcome(operation_id) DEFERRABLE INITIALLY DEFERRED,
    actor_id UUID NOT NULL REFERENCES actor(actor_id),
    organization_id UUID NOT NULL REFERENCES operating_organization(organization_id),
    action VARCHAR(120) NOT NULL,
    input_digest CHAR(64) NOT NULL CHECK(input_digest ~ '^[0-9a-f]{64}$'),
    correlation_id UUID NOT NULL,
    reason VARCHAR(500) NOT NULL CHECK(btrim(reason)<>''),
    result JSONB NOT NULL,
    before_state JSONB,
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE assignment_authorization_evidence (
    evidence_id UUID PRIMARY KEY,
    attempt_id UUID NOT NULL,
    operation_id UUID NOT NULL,
    stage VARCHAR(16) NOT NULL CHECK(stage IN ('REQUEST','COMMIT')),
    actor_id UUID NOT NULL REFERENCES actor(actor_id),
    organization_id UUID NOT NULL REFERENCES operating_organization(organization_id),
    requested_scope JSONB NOT NULL,
    permission_code VARCHAR(120) NOT NULL REFERENCES permission_registry(permission_code),
    evaluated_at TIMESTAMPTZ NOT NULL,
    eligible BOOLEAN NOT NULL,
    granted BOOLEAN NOT NULL,
    delegation_allowed BOOLEAN NOT NULL,
    paths JSONB NOT NULL,
    reason_code VARCHAR(120),
    UNIQUE(attempt_id,stage)
);
CREATE TRIGGER assignment_owner_operation_immutable BEFORE UPDATE OR DELETE OR TRUNCATE
    ON assignment_owner_operation FOR EACH STATEMENT EXECUTE FUNCTION reject_retained_owner_mutation();
CREATE TRIGGER assignment_authorization_evidence_immutable BEFORE UPDATE OR DELETE OR TRUNCATE
    ON assignment_authorization_evidence FOR EACH STATEMENT EXECUTE FUNCTION reject_retained_owner_mutation();
REVOKE ALL ON assignment_owner_operation,assignment_authorization_evidence FROM idea_ddm_app;
GRANT SELECT,INSERT ON assignment_owner_operation,assignment_authorization_evidence TO idea_ddm_app;

-- No arbitrary table/column parameters; fixed migration schema and expected-version canonical end.
DO $migration$
BEGIN
    EXECUTE format($ddl$
        CREATE FUNCTION %1$I.role_assignment_end(p_id UUID,p_org UUID,p_version BIGINT,p_actor UUID,p_reason TEXT,p_now TIMESTAMPTZ)
        RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,%1$I AS $body$
        DECLARE changed INTEGER;
        BEGIN
            IF p_version<1 OR p_now IS NULL OR p_reason IS NULL OR btrim(p_reason)='' OR length(p_reason)>500 OR p_reason ~ '[[:cntrl:]]' THEN
                RAISE EXCEPTION 'Invalid assignment end input' USING ERRCODE='22023';
            END IF;
            UPDATE %1$I.identity_role_assignment SET revoked_at=p_now,ended_by=p_actor,end_reason=p_reason,version=version+1
                WHERE assignment_id=p_id AND organization_id=p_org AND version=p_version AND revoked_at IS NULL;
            GET DIAGNOSTICS changed=ROW_COUNT;
            RETURN changed=1;
        END;$body$
    $ddl$,current_schema());
END;$migration$;
REVOKE ALL ON FUNCTION role_assignment_end(UUID,UUID,BIGINT,UUID,TEXT,TIMESTAMPTZ) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION role_assignment_end(UUID,UUID,BIGINT,UUID,TEXT,TIMESTAMPTZ) TO idea_ddm_app;
