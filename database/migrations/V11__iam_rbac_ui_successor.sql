-- Issue #46 approved successor. V1-V10 and all legacy role/assignment content stay intact.
-- Project Governance owns participation; creation never confers membership or a role.
ALTER TABLE idea_account ADD CONSTRAINT idea_account_actor_organization_pair
    UNIQUE (actor_id, organization_id);

CREATE TABLE project (
    project_id UUID PRIMARY KEY,
    organization_id UUID NOT NULL REFERENCES operating_organization(organization_id),
    display_name VARCHAR(200) NOT NULL CHECK (BTRIM(display_name) <> ''),
    version BIGINT NOT NULL DEFAULT 1 CHECK (version > 0),
    created_by UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (project_id, organization_id),
    FOREIGN KEY (created_by, organization_id) REFERENCES idea_account(actor_id, organization_id)
);

CREATE TABLE project_membership (
    membership_id UUID PRIMARY KEY,
    project_id UUID NOT NULL,
    organization_id UUID NOT NULL,
    actor_id UUID NOT NULL,
    effective_from TIMESTAMPTZ NOT NULL,
    effective_until TIMESTAMPTZ,
    ended_at TIMESTAMPTZ,
    ended_by UUID,
    end_reason VARCHAR(500),
    reason VARCHAR(500) NOT NULL CHECK (BTRIM(reason) <> ''),
    created_by UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 1 CHECK (version > 0),
    FOREIGN KEY (project_id, organization_id) REFERENCES project(project_id, organization_id),
    FOREIGN KEY (actor_id, organization_id) REFERENCES idea_account(actor_id, organization_id),
    FOREIGN KEY (created_by, organization_id) REFERENCES idea_account(actor_id, organization_id),
    FOREIGN KEY (ended_by, organization_id) REFERENCES idea_account(actor_id, organization_id),
    CHECK (effective_until IS NULL OR effective_until > effective_from),
    CHECK ((ended_at IS NULL AND ended_by IS NULL AND end_reason IS NULL)
        OR (ended_at IS NOT NULL AND ended_by IS NOT NULL AND end_reason IS NOT NULL AND BTRIM(end_reason) <> ''))
);
CREATE UNIQUE INDEX project_membership_unended_once ON project_membership(project_id, actor_id)
    WHERE ended_at IS NULL;

CREATE TABLE business_group (
    group_id UUID PRIMARY KEY,
    project_id UUID NOT NULL,
    organization_id UUID NOT NULL,
    display_name VARCHAR(200) NOT NULL CHECK (BTRIM(display_name) <> ''),
    version BIGINT NOT NULL DEFAULT 1 CHECK (version > 0),
    created_by UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (group_id, project_id, organization_id),
    FOREIGN KEY (project_id, organization_id) REFERENCES project(project_id, organization_id),
    FOREIGN KEY (created_by, organization_id) REFERENCES idea_account(actor_id, organization_id)
);

CREATE TABLE group_membership (
    membership_id UUID PRIMARY KEY,
    group_id UUID NOT NULL,
    project_id UUID NOT NULL,
    organization_id UUID NOT NULL,
    actor_id UUID NOT NULL,
    effective_from TIMESTAMPTZ NOT NULL,
    effective_until TIMESTAMPTZ,
    ended_at TIMESTAMPTZ,
    ended_by UUID,
    end_reason VARCHAR(500),
    reason VARCHAR(500) NOT NULL CHECK (BTRIM(reason) <> ''),
    created_by UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 1 CHECK (version > 0),
    FOREIGN KEY (group_id, project_id, organization_id) REFERENCES business_group(group_id, project_id, organization_id),
    FOREIGN KEY (actor_id, organization_id) REFERENCES idea_account(actor_id, organization_id),
    FOREIGN KEY (created_by, organization_id) REFERENCES idea_account(actor_id, organization_id),
    FOREIGN KEY (ended_by, organization_id) REFERENCES idea_account(actor_id, organization_id),
    CHECK (effective_until IS NULL OR effective_until > effective_from),
    CHECK ((ended_at IS NULL AND ended_by IS NULL AND end_reason IS NULL)
        OR (ended_at IS NOT NULL AND ended_by IS NOT NULL AND end_reason IS NOT NULL AND BTRIM(end_reason) <> ''))
);
CREATE UNIQUE INDEX group_membership_unended_once ON group_membership(group_id, actor_id)
    WHERE ended_at IS NULL;

REVOKE ALL ON project, project_membership, business_group, group_membership FROM idea_ddm_app;
GRANT SELECT, INSERT ON project, project_membership, business_group, group_membership TO idea_ddm_app;
-- Narrow state-write storage interfaces follow with their owner behavior tests. No blanket DML.

-- Registered actions are product-owned, never administrator-authored permission codes.
CREATE TABLE permission_registry (
    permission_code VARCHAR(120) PRIMARY KEY,
    owner_name VARCHAR(120) NOT NULL,
    scope_kinds TEXT[] NOT NULL,
    principal_kinds TEXT[] NOT NULL,
    participant_membership_required BOOLEAN NOT NULL DEFAULT FALSE,
    CHECK (cardinality(scope_kinds) > 0 AND scope_kinds <@ ARRAY['ORGANIZATION','PROJECT']::TEXT[]
        AND array_position(scope_kinds, NULL) IS NULL),
    CHECK (cardinality(principal_kinds) > 0 AND principal_kinds <@ ARRAY['ACTOR','PROJECT_GROUP']::TEXT[]
        AND array_position(principal_kinds, NULL) IS NULL)
);
INSERT INTO permission_registry(permission_code,owner_name,scope_kinds,principal_kinds,participant_membership_required) VALUES
    ('account.read','IAM',ARRAY['ORGANIZATION'],ARRAY['ACTOR'],FALSE),
    ('account.create','IAM',ARRAY['ORGANIZATION'],ARRAY['ACTOR'],FALSE),
    ('account.disable','IAM',ARRAY['ORGANIZATION'],ARRAY['ACTOR'],FALSE),
    ('account.re-enable','IAM',ARRAY['ORGANIZATION'],ARRAY['ACTOR'],FALSE),
    ('account.credential.setup.issue','IAM',ARRAY['ORGANIZATION'],ARRAY['ACTOR'],FALSE),
    ('account.credential.reset.issue','IAM',ARRAY['ORGANIZATION'],ARRAY['ACTOR'],FALSE),
    ('project.create','PROJECT_GOVERNANCE',ARRAY['ORGANIZATION'],ARRAY['ACTOR'],FALSE),
    ('project.admin.read','PROJECT_GOVERNANCE',ARRAY['ORGANIZATION','PROJECT'],ARRAY['ACTOR'],FALSE),
    ('project.update','PROJECT_GOVERNANCE',ARRAY['ORGANIZATION','PROJECT'],ARRAY['ACTOR'],FALSE),
    ('project.membership.assign','PROJECT_GOVERNANCE',ARRAY['ORGANIZATION','PROJECT'],ARRAY['ACTOR'],FALSE),
    ('project.membership.remove','PROJECT_GOVERNANCE',ARRAY['ORGANIZATION','PROJECT'],ARRAY['ACTOR'],FALSE),
    ('project.group.create','PROJECT_GOVERNANCE',ARRAY['ORGANIZATION','PROJECT'],ARRAY['ACTOR'],FALSE),
    ('project.group.update','PROJECT_GOVERNANCE',ARRAY['ORGANIZATION','PROJECT'],ARRAY['ACTOR'],FALSE),
    ('project.group.membership.assign','PROJECT_GOVERNANCE',ARRAY['ORGANIZATION','PROJECT'],ARRAY['ACTOR'],FALSE),
    ('project.group.membership.remove','PROJECT_GOVERNANCE',ARRAY['ORGANIZATION','PROJECT'],ARRAY['ACTOR'],FALSE),
    ('project.read','PROJECT_GOVERNANCE',ARRAY['ORGANIZATION','PROJECT'],ARRAY['ACTOR','PROJECT_GROUP'],TRUE),
    ('role.catalogue.read','ACCESS_POLICY',ARRAY['ORGANIZATION','PROJECT'],ARRAY['ACTOR'],FALSE),
    ('role.definition.prepare','ACCESS_POLICY',ARRAY['ORGANIZATION','PROJECT'],ARRAY['ACTOR'],FALSE),
    ('role.definition.activate','ACCESS_POLICY',ARRAY['ORGANIZATION','PROJECT'],ARRAY['ACTOR'],FALSE),
    ('role.assignment.manage.business','ACCESS_POLICY',ARRAY['ORGANIZATION','PROJECT'],ARRAY['ACTOR'],FALSE),
    ('role.assignment.manage.administration','ACCESS_POLICY',ARRAY['ORGANIZATION','PROJECT'],ARRAY['ACTOR'],FALSE),
    ('role.assignment.manage.highest','ACCESS_POLICY',ARRAY['ORGANIZATION'],ARRAY['ACTOR'],FALSE),
    ('access.inspect','ACCESS_POLICY',ARRAY['ORGANIZATION','PROJECT'],ARRAY['ACTOR'],FALSE),
    ('audit.read','AUDIT',ARRAY['ORGANIZATION','PROJECT'],ARRAY['ACTOR'],FALSE),
    ('role.assign.account-administrator','ACCESS_POLICY',ARRAY['ORGANIZATION'],ARRAY['ACTOR'],FALSE);

CREATE TABLE identity_role_definition (
    definition_id UUID PRIMARY KEY,
    role_code VARCHAR(120) NOT NULL UNIQUE CHECK (BTRIM(role_code) <> ''),
    display_name VARCHAR(200) NOT NULL CHECK (BTRIM(display_name) <> ''),
    built_in BOOLEAN NOT NULL,
    management_scope_kind VARCHAR(16),
    management_organization_id UUID REFERENCES operating_organization(organization_id),
    management_project_id UUID,
    UNIQUE (definition_id,role_code),
    FOREIGN KEY (management_project_id,management_organization_id) REFERENCES project(project_id,organization_id),
    CHECK ((built_in AND management_scope_kind IS NULL AND management_organization_id IS NULL AND management_project_id IS NULL)
        OR (NOT built_in AND management_organization_id IS NOT NULL AND management_scope_kind IS NOT NULL AND
            ((management_scope_kind='ORGANIZATION' AND management_project_id IS NULL)
            OR (management_scope_kind='PROJECT' AND management_project_id IS NOT NULL))))
);
INSERT INTO identity_role_definition(definition_id,role_code,display_name,built_in) VALUES
    ('9d80f77e-85a6-4c12-a72d-8ef6b7e0b001','super-administrator','Super Administrator',TRUE),
    ('9d80f77e-85a6-4c12-a72d-8ef6b7e0b002','account-administrator','Account Administrator',TRUE),
    ('9d80f77e-85a6-4c12-a72d-8ef6b7e0b003','privileged-role-administrator','Privileged Role Administrator',TRUE),
    ('9d80f77e-85a6-4c12-a72d-8ef6b7e0b004','project-administrator','Project Administrator',TRUE),
    ('9d80f77e-85a6-4c12-a72d-8ef6b7e0b005','audit-reader','Audit Reader',TRUE);

-- Separate structural/sealed profile extends the original exact-version model. No mirror evaluator.
ALTER TABLE identity_role_version ADD CONSTRAINT identity_role_version_id_code_pair UNIQUE(role_version_id,role_code);
CREATE TABLE identity_role_version_profile (
    role_version_id UUID PRIMARY KEY,
    definition_id UUID NOT NULL,
    role_code VARCHAR(120) NOT NULL,
    classification VARCHAR(16) NOT NULL CHECK (classification IN ('HIGHEST','ADMINISTRATION','BUSINESS')),
    scope_kinds TEXT[] NOT NULL,
    principal_kinds TEXT[] NOT NULL,
    content_digest CHAR(64) NOT NULL CHECK (content_digest ~ '^[0-9a-f]{64}$'),
    sealed_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(role_version_id,role_code) REFERENCES identity_role_version(role_version_id,role_code),
    FOREIGN KEY(definition_id,role_code) REFERENCES identity_role_definition(definition_id,role_code),
    CHECK (cardinality(scope_kinds)>0 AND scope_kinds <@ ARRAY['ORGANIZATION','PROJECT']::TEXT[]
        AND array_position(scope_kinds,NULL) IS NULL),
    CHECK (cardinality(principal_kinds)>0 AND principal_kinds <@ ARRAY['ACTOR','PROJECT_GROUP']::TEXT[]
        AND array_position(principal_kinds,NULL) IS NULL),
    CHECK (classification='BUSINESS' OR principal_kinds=ARRAY['ACTOR']::TEXT[])
);

CREATE TABLE identity_role_candidate (
    candidate_id UUID PRIMARY KEY,
    definition_id UUID NOT NULL REFERENCES identity_role_definition(definition_id),
    base_version_id UUID REFERENCES identity_role_version(role_version_id),
    classification VARCHAR(16) NOT NULL CHECK (classification IN ('ADMINISTRATION','BUSINESS')),
    scope_kinds TEXT[] NOT NULL,
    principal_kinds TEXT[] NOT NULL,
    content_digest CHAR(64) NOT NULL CHECK (content_digest ~ '^[0-9a-f]{64}$'),
    prepared_by UUID NOT NULL REFERENCES actor(actor_id),
    reason VARCHAR(500) NOT NULL CHECK (BTRIM(reason) <> ''),
    version BIGINT NOT NULL DEFAULT 1 CHECK (version>0),
    prepared_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    activated_version_id UUID REFERENCES identity_role_version(role_version_id),
    CHECK (cardinality(scope_kinds)>0 AND scope_kinds <@ ARRAY['ORGANIZATION','PROJECT']::TEXT[]
        AND array_position(scope_kinds,NULL) IS NULL),
    CHECK (cardinality(principal_kinds)>0 AND principal_kinds <@ ARRAY['ACTOR','PROJECT_GROUP']::TEXT[]
        AND array_position(principal_kinds,NULL) IS NULL),
    CHECK (classification='BUSINESS' OR principal_kinds=ARRAY['ACTOR']::TEXT[])
);
CREATE TABLE identity_role_candidate_permission (
    candidate_id UUID NOT NULL REFERENCES identity_role_candidate(candidate_id),
    permission_code VARCHAR(120) NOT NULL REFERENCES permission_registry(permission_code),
    PRIMARY KEY(candidate_id,permission_code)
);

REVOKE ALL ON permission_registry,identity_role_definition,identity_role_version_profile,
    identity_role_candidate,identity_role_candidate_permission FROM idea_ddm_app;
GRANT SELECT ON permission_registry,identity_role_definition,identity_role_version_profile,
    identity_role_candidate,identity_role_candidate_permission TO idea_ddm_app;

-- Exact accepted built-in successor manifest. No assignment/bootstrap/adoption mutation.
INSERT INTO identity_role_version(role_version_id,role_code,version) VALUES
    ('9d80f77e-85a6-4c12-a72d-8ef6b7e0a004','account-administrator',3),
    ('9d80f77e-85a6-4c12-a72d-8ef6b7e0a005','super-administrator',2),
    ('9d80f77e-85a6-4c12-a72d-8ef6b7e0a006','privileged-role-administrator',1),
    ('9d80f77e-85a6-4c12-a72d-8ef6b7e0a007','project-administrator',1),
    ('9d80f77e-85a6-4c12-a72d-8ef6b7e0a008','audit-reader',1);
INSERT INTO identity_role_permission(role_version_id,permission_code)
    SELECT '9d80f77e-85a6-4c12-a72d-8ef6b7e0a004'::UUID,permission_code FROM identity_role_permission
    WHERE role_version_id='9d80f77e-85a6-4c12-a72d-8ef6b7e0a003';
INSERT INTO identity_role_permission(role_version_id,permission_code) VALUES
    ('9d80f77e-85a6-4c12-a72d-8ef6b7e0a004','account.read'),
    ('9d80f77e-85a6-4c12-a72d-8ef6b7e0a005','role.catalogue.read'),
    ('9d80f77e-85a6-4c12-a72d-8ef6b7e0a005','role.assignment.manage.administration'),
    ('9d80f77e-85a6-4c12-a72d-8ef6b7e0a005','role.assignment.manage.highest'),
    ('9d80f77e-85a6-4c12-a72d-8ef6b7e0a005','access.inspect'),
    ('9d80f77e-85a6-4c12-a72d-8ef6b7e0a005','audit.read'),
    ('9d80f77e-85a6-4c12-a72d-8ef6b7e0a006','role.catalogue.read'),
    ('9d80f77e-85a6-4c12-a72d-8ef6b7e0a006','role.definition.prepare'),
    ('9d80f77e-85a6-4c12-a72d-8ef6b7e0a006','role.definition.activate'),
    ('9d80f77e-85a6-4c12-a72d-8ef6b7e0a006','role.assignment.manage.business'),
    ('9d80f77e-85a6-4c12-a72d-8ef6b7e0a006','role.assignment.manage.administration'),
    ('9d80f77e-85a6-4c12-a72d-8ef6b7e0a006','access.inspect'),
    ('9d80f77e-85a6-4c12-a72d-8ef6b7e0a006','audit.read'),
    ('9d80f77e-85a6-4c12-a72d-8ef6b7e0a007','project.create'),
    ('9d80f77e-85a6-4c12-a72d-8ef6b7e0a007','project.admin.read'),
    ('9d80f77e-85a6-4c12-a72d-8ef6b7e0a007','project.update'),
    ('9d80f77e-85a6-4c12-a72d-8ef6b7e0a007','project.membership.assign'),
    ('9d80f77e-85a6-4c12-a72d-8ef6b7e0a007','project.membership.remove'),
    ('9d80f77e-85a6-4c12-a72d-8ef6b7e0a007','project.group.create'),
    ('9d80f77e-85a6-4c12-a72d-8ef6b7e0a007','project.group.update'),
    ('9d80f77e-85a6-4c12-a72d-8ef6b7e0a007','project.group.membership.assign'),
    ('9d80f77e-85a6-4c12-a72d-8ef6b7e0a007','project.group.membership.remove'),
    ('9d80f77e-85a6-4c12-a72d-8ef6b7e0a007','role.catalogue.read'),
    ('9d80f77e-85a6-4c12-a72d-8ef6b7e0a007','role.assignment.manage.business'),
    ('9d80f77e-85a6-4c12-a72d-8ef6b7e0a007','access.inspect'),
    ('9d80f77e-85a6-4c12-a72d-8ef6b7e0a008','audit.read');

-- Sealed profile is also the append-completion marker: insert permissions, then profile.
-- Digest v1: roleCode|version|classification|comma-scopes|comma-principals|sorted-comma-permissions.
INSERT INTO identity_role_version_profile(role_version_id,definition_id,role_code,classification,
        scope_kinds,principal_kinds,content_digest)
    SELECT v.role_version_id,d.definition_id,v.role_code,
        CASE WHEN v.role_code IN ('super-administrator','privileged-role-administrator') THEN 'HIGHEST' ELSE 'ADMINISTRATION' END,
        CASE WHEN v.role_code IN ('account-administrator','super-administrator') THEN ARRAY['ORGANIZATION'] ELSE ARRAY['ORGANIZATION','PROJECT'] END,
        ARRAY['ACTOR'],
        encode(sha256(convert_to(v.role_code||'|'||v.version||'|'
            ||CASE WHEN v.role_code IN ('super-administrator','privileged-role-administrator') THEN 'HIGHEST' ELSE 'ADMINISTRATION' END||'|'
            ||CASE WHEN v.role_code IN ('account-administrator','super-administrator') THEN 'ORGANIZATION' ELSE 'ORGANIZATION,PROJECT' END
            ||'|ACTOR|'||string_agg(p.permission_code,',' ORDER BY p.permission_code COLLATE "C"),'UTF8')),'hex')
    FROM identity_role_version v JOIN identity_role_definition d USING(role_code)
        JOIN identity_role_permission p USING(role_version_id)
    GROUP BY v.role_version_id,d.definition_id,v.role_code,v.version;

ALTER TABLE identity_role_permission ADD CONSTRAINT identity_role_permission_registered
    FOREIGN KEY(permission_code) REFERENCES permission_registry(permission_code);
ALTER TABLE identity_role_version ADD CONSTRAINT identity_role_version_complete_seal
    FOREIGN KEY(role_version_id) REFERENCES identity_role_version_profile(role_version_id)
    DEFERRABLE INITIALLY DEFERRED;

-- Freeze the schema at migration time; neither search_path nor a temporary table may redirect it.
DO $migration$
BEGIN
    EXECUTE format($ddl$
        CREATE FUNCTION %1$I.reject_sealed_role_permission_insert() RETURNS TRIGGER
        LANGUAGE plpgsql SET search_path=pg_catalog,%1$I AS $body$
        BEGIN
            IF EXISTS(SELECT 1 FROM %1$I.identity_role_version_profile WHERE role_version_id=NEW.role_version_id) THEN
                RAISE EXCEPTION 'Activated role permission content is sealed' USING ERRCODE='42501';
            END IF;
            RETURN NEW;
        END;
        $body$
    $ddl$,current_schema());
END;
$migration$;
REVOKE ALL ON FUNCTION reject_sealed_role_permission_insert() FROM PUBLIC;
CREATE TRIGGER identity_role_permission_sealed BEFORE INSERT ON identity_role_permission
    FOR EACH ROW EXECUTE FUNCTION reject_sealed_role_permission_insert();
CREATE TRIGGER identity_role_version_profile_immutable BEFORE UPDATE OR DELETE OR TRUNCATE
    ON identity_role_version_profile FOR EACH STATEMENT EXECUTE FUNCTION reject_retained_owner_mutation();
CREATE TRIGGER permission_registry_immutable BEFORE UPDATE OR DELETE OR TRUNCATE
    ON permission_registry FOR EACH STATEMENT EXECUTE FUNCTION reject_retained_owner_mutation();
CREATE TRIGGER identity_role_definition_immutable BEFORE UPDATE OR DELETE OR TRUNCATE
    ON identity_role_definition FOR EACH STATEMENT EXECUTE FUNCTION reject_retained_owner_mutation();

-- Extend the sole assignment model. revoked_at is still the only canonical termination flag.
ALTER TABLE identity_role_assignment ALTER COLUMN principal_actor_id DROP NOT NULL;
ALTER TABLE identity_role_assignment
    ADD COLUMN principal_group_id UUID,
    ADD COLUMN scope_kind VARCHAR(16) NOT NULL DEFAULT 'ORGANIZATION',
    ADD COLUMN project_id UUID,
    ADD COLUMN effective_from TIMESTAMPTZ,
    ADD COLUMN effective_until TIMESTAMPTZ,
    ADD COLUMN ended_by UUID,
    ADD COLUMN end_reason VARCHAR(500),
    ADD COLUMN version BIGINT NOT NULL DEFAULT 1 CHECK(version>0);
UPDATE identity_role_assignment SET effective_from=assigned_at;
ALTER TABLE identity_role_assignment ALTER COLUMN effective_from SET NOT NULL;
ALTER TABLE identity_role_assignment ALTER COLUMN effective_from SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE identity_role_assignment
    ADD CONSTRAINT assignment_one_principal CHECK ((principal_actor_id IS NOT NULL) <> (principal_group_id IS NOT NULL)),
    ADD CONSTRAINT assignment_typed_scope CHECK ((scope_kind='ORGANIZATION' AND project_id IS NULL AND principal_group_id IS NULL)
        OR (scope_kind='PROJECT' AND project_id IS NOT NULL)),
    ADD CONSTRAINT assignment_period CHECK(effective_until IS NULL OR effective_until>effective_from),
    ADD CONSTRAINT assignment_canonical_end CHECK(revoked_at IS NOT NULL OR (ended_by IS NULL AND end_reason IS NULL)),
    ADD CONSTRAINT assignment_project_organization FOREIGN KEY(project_id,organization_id) REFERENCES project(project_id,organization_id),
    ADD CONSTRAINT assignment_actor_organization FOREIGN KEY(principal_actor_id,organization_id) REFERENCES idea_account(actor_id,organization_id),
    ADD CONSTRAINT assignment_group_project_organization FOREIGN KEY(principal_group_id,project_id,organization_id)
        REFERENCES business_group(group_id,project_id,organization_id),
    ADD CONSTRAINT assignment_assigner_organization FOREIGN KEY(assigned_by,organization_id) REFERENCES idea_account(actor_id,organization_id),
    ADD CONSTRAINT assignment_ender_organization FOREIGN KEY(ended_by,organization_id) REFERENCES idea_account(actor_id,organization_id);

-- Locate exactly the predecessor tuple constraint; do not guess its truncated generated name.
DO $migration$
DECLARE predecessor_name TEXT;
BEGIN
    SELECT c.conname INTO STRICT predecessor_name FROM pg_constraint c
        WHERE c.conrelid='identity_role_assignment'::regclass AND c.contype='u'
        AND (SELECT array_agg(a.attname::TEXT ORDER BY key.ordinality)
            FROM unnest(c.conkey) WITH ORDINALITY AS key(attnum,ordinality)
                JOIN pg_attribute a ON a.attrelid=c.conrelid AND a.attnum=key.attnum)
            =ARRAY['principal_actor_id','role_version_id','organization_id']::TEXT[];
    EXECUTE format('ALTER TABLE %I.identity_role_assignment DROP CONSTRAINT %I',current_schema(),predecessor_name);
END;
$migration$;
CREATE UNIQUE INDEX assignment_unended_actor_organization ON identity_role_assignment(principal_actor_id,role_version_id,organization_id)
    WHERE revoked_at IS NULL AND scope_kind='ORGANIZATION';
CREATE UNIQUE INDEX assignment_unended_actor_project ON identity_role_assignment(principal_actor_id,role_version_id,project_id)
    WHERE revoked_at IS NULL AND scope_kind='PROJECT' AND principal_actor_id IS NOT NULL;
CREATE UNIQUE INDEX assignment_unended_group_project ON identity_role_assignment(principal_group_id,role_version_id,project_id)
    WHERE revoked_at IS NULL AND principal_group_id IS NOT NULL;

-- Storage shape/profile validation, not a replacement for owner authorization/delegation.
DO $migration$
BEGIN
    EXECUTE format($ddl$
        CREATE FUNCTION %1$I.validate_assignment_profile() RETURNS TRIGGER
        LANGUAGE plpgsql SET search_path=pg_catalog,%1$I AS $body$
        DECLARE profile RECORD;
        BEGIN
            SELECT p.scope_kinds,p.principal_kinds,d.built_in,d.management_organization_id,d.management_project_id
                INTO profile FROM %1$I.identity_role_version_profile p
                JOIN %1$I.identity_role_definition d USING(definition_id)
                WHERE p.role_version_id=NEW.role_version_id;
            IF NOT FOUND THEN RAISE EXCEPTION 'Unknown exact role profile' USING ERRCODE='23503'; END IF;
            IF NOT NEW.scope_kind=ANY(profile.scope_kinds)
                OR NOT (CASE WHEN NEW.principal_group_id IS NULL THEN 'ACTOR' ELSE 'PROJECT_GROUP' END)=ANY(profile.principal_kinds)
                OR (NOT profile.built_in AND (NEW.organization_id<>profile.management_organization_id
                    OR (profile.management_project_id IS NOT NULL AND NEW.project_id IS DISTINCT FROM profile.management_project_id))) THEN
                RAISE EXCEPTION 'Assignment is outside exact role profile' USING ERRCODE='23514';
            END IF;
            RETURN NEW;
        END;
        $body$
    $ddl$,current_schema());
END;
$migration$;
REVOKE ALL ON FUNCTION validate_assignment_profile() FROM PUBLIC;
CREATE TRIGGER assignment_exact_profile BEFORE INSERT ON identity_role_assignment
    FOR EACH ROW EXECUTE FUNCTION validate_assignment_profile();
