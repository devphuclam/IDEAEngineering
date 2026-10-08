-- Append a complete version/permission/profile once; never rewrite earlier content or assignments.
DO $migration$
BEGIN
    EXECUTE format($ddl$
        CREATE FUNCTION %1$I.role_candidate_activate(p_id UUID,p_org UUID,p_expected BIGINT,p_base UUID,p_role UUID,p_digest TEXT,p_now TIMESTAMPTZ)
        RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,%1$I AS $body$
        DECLARE draft %1$I.identity_role_candidate%%ROWTYPE; definition %1$I.identity_role_definition%%ROWTYPE; latest UUID; next_version INTEGER; changed INTEGER; permission_count INTEGER;
        BEGIN
            SELECT * INTO draft FROM %1$I.identity_role_candidate WHERE candidate_id=p_id FOR UPDATE;
            IF NOT FOUND OR draft.version<>p_expected OR draft.activated_version_id IS NOT NULL OR draft.base_version_id IS DISTINCT FROM p_base OR draft.content_digest<>p_digest THEN RAISE EXCEPTION 'Stale candidate' USING ERRCODE='40001'; END IF;
            SELECT * INTO definition FROM %1$I.identity_role_definition WHERE definition_id=draft.definition_id;
            IF definition.built_in OR definition.management_organization_id<>p_org THEN RAISE EXCEPTION 'Protected definition' USING ERRCODE='42501'; END IF;
            SELECT p.role_version_id INTO latest FROM %1$I.identity_role_version_profile p JOIN %1$I.identity_role_version v USING(role_version_id) WHERE p.definition_id=draft.definition_id ORDER BY v.version DESC LIMIT 1;
            IF latest IS DISTINCT FROM p_base THEN RAISE EXCEPTION 'Stale base' USING ERRCODE='40001'; END IF;
            SELECT COALESCE(max(v.version),0)+1 INTO next_version FROM %1$I.identity_role_version v JOIN %1$I.identity_role_version_profile p USING(role_version_id) WHERE p.definition_id=draft.definition_id;
            SELECT count(*) INTO permission_count FROM %1$I.identity_role_candidate_permission WHERE candidate_id=p_id;
            IF permission_count=0 OR p_now IS NULL THEN RAISE EXCEPTION 'Incomplete activation' USING ERRCODE='22023'; END IF;
            INSERT INTO %1$I.identity_role_version(role_version_id,role_code,version) VALUES(p_role,definition.role_code,next_version);
            GET DIAGNOSTICS changed=ROW_COUNT; IF changed<>1 THEN RAISE EXCEPTION 'Required version missing'; END IF;
            INSERT INTO %1$I.identity_role_permission(role_version_id,permission_code) SELECT p_role,permission_code FROM %1$I.identity_role_candidate_permission WHERE candidate_id=p_id;
            GET DIAGNOSTICS changed=ROW_COUNT; IF changed<>permission_count THEN RAISE EXCEPTION 'Required permission content missing'; END IF;
            INSERT INTO %1$I.identity_role_version_profile(role_version_id,definition_id,role_code,classification,scope_kinds,principal_kinds,content_digest,sealed_at)
                VALUES(p_role,draft.definition_id,definition.role_code,draft.classification,draft.scope_kinds,draft.principal_kinds,draft.content_digest,p_now);
            GET DIAGNOSTICS changed=ROW_COUNT; IF changed<>1 THEN RAISE EXCEPTION 'Required sealed profile missing'; END IF;
            UPDATE %1$I.identity_role_candidate SET activated_version_id=p_role,version=version+1 WHERE candidate_id=p_id AND version=p_expected AND activated_version_id IS NULL;
            GET DIAGNOSTICS changed=ROW_COUNT; IF changed<>1 THEN RAISE EXCEPTION 'Required candidate transition missing'; END IF;
            RETURN TRUE;
        END;$body$
    $ddl$,current_schema());
    EXECUTE format($ddl$
        CREATE FUNCTION %1$I.reject_activated_candidate_mutation() RETURNS TRIGGER LANGUAGE plpgsql SET search_path=pg_catalog,%1$I AS $body$
        BEGIN
            IF TG_OP='DELETE' OR OLD.activated_version_id IS NOT NULL THEN RAISE EXCEPTION 'Activated candidate is immutable' USING ERRCODE='42501'; END IF;
            RETURN NEW;
        END;$body$
    $ddl$,current_schema());
    EXECUTE format($ddl$
        CREATE FUNCTION %1$I.reject_activated_candidate_permission_insert() RETURNS TRIGGER LANGUAGE plpgsql SET search_path=pg_catalog,%1$I AS $body$
        BEGIN
            IF EXISTS(SELECT 1 FROM %1$I.identity_role_candidate WHERE candidate_id=NEW.candidate_id AND activated_version_id IS NOT NULL) THEN RAISE EXCEPTION 'Activated candidate content is sealed' USING ERRCODE='42501'; END IF;
            RETURN NEW;
        END;$body$
    $ddl$,current_schema());
END;$migration$;
REVOKE ALL ON FUNCTION role_candidate_activate(UUID,UUID,BIGINT,UUID,UUID,TEXT,TIMESTAMPTZ) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION role_candidate_activate(UUID,UUID,BIGINT,UUID,UUID,TEXT,TIMESTAMPTZ) TO idea_ddm_app;
REVOKE ALL ON FUNCTION reject_activated_candidate_mutation(),reject_activated_candidate_permission_insert() FROM PUBLIC;
CREATE TRIGGER candidate_activation_immutable BEFORE UPDATE OR DELETE ON identity_role_candidate FOR EACH ROW EXECUTE FUNCTION reject_activated_candidate_mutation();
CREATE TRIGGER candidate_permission_sealed BEFORE INSERT ON identity_role_candidate_permission FOR EACH ROW EXECUTE FUNCTION reject_activated_candidate_permission_insert();
