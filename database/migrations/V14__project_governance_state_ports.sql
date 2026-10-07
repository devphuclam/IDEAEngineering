-- Narrow owner storage ports. They do not authorize product Actors or accept target table names.
-- Fixed migration schema prevents app search_path/temporary-object substitution.
DO $migration$
BEGIN
    EXECUTE format($ddl$
        CREATE FUNCTION %1$I.project_change(p_id UUID,p_org UUID,p_version BIGINT,p_name TEXT)
        RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,%1$I AS $body$
        DECLARE changed INTEGER;
        BEGIN
            IF p_version<1 OR (p_name IS NOT NULL AND (btrim(p_name)='' OR length(p_name)>200 OR p_name ~ '[[:cntrl:]]')) THEN
                RAISE EXCEPTION 'Invalid Project state input' USING ERRCODE='22023';
            END IF;
            UPDATE %1$I.project SET display_name=coalesce(p_name,display_name),version=version+1
                WHERE project_id=p_id AND organization_id=p_org AND version=p_version;
            GET DIAGNOSTICS changed=ROW_COUNT;
            RETURN changed=1;
        END;$body$
    $ddl$,current_schema());
    EXECUTE format($ddl$
        CREATE FUNCTION %1$I.project_group_change(p_id UUID,p_org UUID,p_version BIGINT,p_name TEXT)
        RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,%1$I AS $body$
        DECLARE changed INTEGER;
        BEGIN
            IF p_version<1 OR (p_name IS NOT NULL AND (btrim(p_name)='' OR length(p_name)>200 OR p_name ~ '[[:cntrl:]]')) THEN
                RAISE EXCEPTION 'Invalid Group state input' USING ERRCODE='22023';
            END IF;
            UPDATE %1$I.business_group SET display_name=coalesce(p_name,display_name),version=version+1
                WHERE group_id=p_id AND organization_id=p_org AND version=p_version;
            GET DIAGNOSTICS changed=ROW_COUNT;
            RETURN changed=1;
        END;$body$
    $ddl$,current_schema());
    EXECUTE format($ddl$
        CREATE FUNCTION %1$I.project_membership_end(p_id UUID,p_org UUID,p_version BIGINT,p_actor UUID,p_reason TEXT,p_now TIMESTAMPTZ)
        RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,%1$I AS $body$
        DECLARE parent UUID;
        BEGIN
            IF p_version<1 OR p_now IS NULL OR p_reason IS NULL OR btrim(p_reason)='' OR length(p_reason)>500 OR p_reason ~ '[[:cntrl:]]' THEN
                RAISE EXCEPTION 'Invalid membership end input' USING ERRCODE='22023';
            END IF;
            UPDATE %1$I.project_membership SET ended_at=p_now,ended_by=p_actor,end_reason=p_reason,version=version+1
                WHERE membership_id=p_id AND organization_id=p_org AND version=p_version AND ended_at IS NULL
                RETURNING project_id INTO parent;
            IF parent IS NULL THEN RETURN FALSE; END IF;
            UPDATE %1$I.project SET version=version+1 WHERE project_id=parent AND organization_id=p_org;
            IF NOT FOUND THEN RAISE EXCEPTION 'Missing membership parent'; END IF;
            RETURN TRUE;
        END;$body$
    $ddl$,current_schema());
    EXECUTE format($ddl$
        CREATE FUNCTION %1$I.project_group_membership_end(p_id UUID,p_org UUID,p_version BIGINT,p_actor UUID,p_reason TEXT,p_now TIMESTAMPTZ)
        RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,%1$I AS $body$
        DECLARE parent UUID;
        BEGIN
            IF p_version<1 OR p_now IS NULL OR p_reason IS NULL OR btrim(p_reason)='' OR length(p_reason)>500 OR p_reason ~ '[[:cntrl:]]' THEN
                RAISE EXCEPTION 'Invalid Group membership end input' USING ERRCODE='22023';
            END IF;
            UPDATE %1$I.group_membership SET ended_at=p_now,ended_by=p_actor,end_reason=p_reason,version=version+1
                WHERE membership_id=p_id AND organization_id=p_org AND version=p_version AND ended_at IS NULL
                RETURNING group_id INTO parent;
            IF parent IS NULL THEN RETURN FALSE; END IF;
            UPDATE %1$I.business_group SET version=version+1 WHERE group_id=parent AND organization_id=p_org;
            IF NOT FOUND THEN RAISE EXCEPTION 'Missing Group membership parent'; END IF;
            RETURN TRUE;
        END;$body$
    $ddl$,current_schema());
END;
$migration$;
REVOKE ALL ON FUNCTION project_change(UUID,UUID,BIGINT,TEXT),project_group_change(UUID,UUID,BIGINT,TEXT),
    project_membership_end(UUID,UUID,BIGINT,UUID,TEXT,TIMESTAMPTZ),project_group_membership_end(UUID,UUID,BIGINT,UUID,TEXT,TIMESTAMPTZ) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION project_change(UUID,UUID,BIGINT,TEXT),project_group_change(UUID,UUID,BIGINT,TEXT),
    project_membership_end(UUID,UUID,BIGINT,UUID,TEXT,TIMESTAMPTZ),project_group_membership_end(UUID,UUID,BIGINT,UUID,TEXT,TIMESTAMPTZ) TO idea_ddm_app;
