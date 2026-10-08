-- Custom draft staging has no authority and is separate from immutable activated versions.
CREATE TABLE role_definition_owner_operation (
    operation_id UUID PRIMARY KEY REFERENCES access_policy_owner_outcome(operation_id) DEFERRABLE INITIALLY DEFERRED,
    actor_id UUID NOT NULL REFERENCES actor(actor_id), organization_id UUID NOT NULL REFERENCES operating_organization(organization_id),
    requested_scope JSONB NOT NULL, action VARCHAR(16) NOT NULL CHECK(action IN ('PREPARE','ACTIVATE')),
    input_digest CHAR(64) NOT NULL CHECK(input_digest ~ '^[0-9a-f]{64}$'), correlation_id UUID NOT NULL,
    reason VARCHAR(500) NOT NULL CHECK(btrim(reason)<>''), result JSONB NOT NULL,
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE role_definition_authorization_evidence (
    evidence_id UUID PRIMARY KEY, attempt_id UUID NOT NULL, operation_id UUID NOT NULL,
    stage VARCHAR(16) NOT NULL CHECK(stage IN ('REQUEST','COMMIT')), actor_id UUID NOT NULL REFERENCES actor(actor_id),
    requested_scope JSONB NOT NULL, permission_code VARCHAR(120) NOT NULL REFERENCES permission_registry(permission_code),
    paths JSONB NOT NULL, evaluated_at TIMESTAMPTZ NOT NULL, UNIQUE(attempt_id,stage)
);
CREATE TRIGGER role_definition_operation_immutable BEFORE UPDATE OR DELETE OR TRUNCATE ON role_definition_owner_operation
    FOR EACH STATEMENT EXECUTE FUNCTION reject_retained_owner_mutation();
CREATE TRIGGER role_definition_evidence_immutable BEFORE UPDATE OR DELETE OR TRUNCATE ON role_definition_authorization_evidence
    FOR EACH STATEMENT EXECUTE FUNCTION reject_retained_owner_mutation();
REVOKE ALL ON role_definition_owner_operation,role_definition_authorization_evidence FROM idea_ddm_app;
GRANT SELECT,INSERT ON role_definition_owner_operation,role_definition_authorization_evidence TO idea_ddm_app;

DO $migration$
BEGIN
    EXECUTE format($ddl$
        CREATE FUNCTION %1$I.role_candidate_prepare(p_id UUID,p_definition UUID,p_code TEXT,p_name TEXT,p_scope TEXT,p_org UUID,p_project UUID,p_base UUID,p_kind TEXT,p_scopes TEXT[],p_principals TEXT[],p_codes TEXT[],p_digest TEXT,p_actor UUID,p_reason TEXT)
        RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,%1$I AS $body$
        DECLARE changed INTEGER; existing %1$I.identity_role_definition%%ROWTYPE;
        BEGIN
            IF cardinality(p_codes)<1 OR cardinality(p_scopes)<1 OR cardinality(p_principals)<1 THEN RAISE EXCEPTION 'Empty candidate content' USING ERRCODE='22023'; END IF;
            SELECT * INTO existing FROM %1$I.identity_role_definition WHERE definition_id=p_definition;
            IF FOUND THEN
                IF existing.built_in OR existing.role_code<>p_code OR existing.display_name<>p_name OR existing.management_scope_kind<>p_scope OR existing.management_organization_id<>p_org OR existing.management_project_id IS DISTINCT FROM p_project THEN
                    RAISE EXCEPTION 'Protected definition mismatch' USING ERRCODE='42501';
                END IF;
            ELSE
                IF p_base IS NOT NULL THEN RAISE EXCEPTION 'New definition has no base' USING ERRCODE='22023'; END IF;
                INSERT INTO %1$I.identity_role_definition(definition_id,role_code,display_name,built_in,management_scope_kind,management_organization_id,management_project_id)
                    VALUES(p_definition,p_code,p_name,FALSE,p_scope,p_org,p_project);
                GET DIAGNOSTICS changed=ROW_COUNT; IF changed<>1 THEN RAISE EXCEPTION 'Required definition missing'; END IF;
            END IF;
            IF p_base IS NOT NULL AND NOT EXISTS(SELECT 1 FROM %1$I.identity_role_version_profile WHERE role_version_id=p_base AND definition_id=p_definition) THEN RAISE EXCEPTION 'Wrong base definition' USING ERRCODE='22023'; END IF;
            INSERT INTO %1$I.identity_role_candidate(candidate_id,definition_id,base_version_id,classification,scope_kinds,principal_kinds,content_digest,prepared_by,reason)
                VALUES(p_id,p_definition,p_base,p_kind,p_scopes,p_principals,p_digest,p_actor,p_reason);
            GET DIAGNOSTICS changed=ROW_COUNT; IF changed<>1 THEN RAISE EXCEPTION 'Required candidate missing'; END IF;
            INSERT INTO %1$I.identity_role_candidate_permission(candidate_id,permission_code) SELECT p_id,code FROM unnest(p_codes) AS code;
            GET DIAGNOSTICS changed=ROW_COUNT; IF changed<>cardinality(p_codes) THEN RAISE EXCEPTION 'Required candidate permission missing'; END IF;
            RETURN TRUE;
        END;$body$
    $ddl$,current_schema());
END;$migration$;
REVOKE ALL ON FUNCTION role_candidate_prepare(UUID,UUID,TEXT,TEXT,TEXT,UUID,UUID,UUID,TEXT,TEXT[],TEXT[],TEXT[],TEXT,UUID,TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION role_candidate_prepare(UUID,UUID,TEXT,TEXT,TEXT,UUID,UUID,UUID,TEXT,TEXT[],TEXT[],TEXT[],TEXT,UUID,TEXT) TO idea_ddm_app;
