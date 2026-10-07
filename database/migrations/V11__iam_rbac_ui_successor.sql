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
        OR (ended_at IS NOT NULL AND ended_by IS NOT NULL AND BTRIM(end_reason) <> ''))
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
        OR (ended_at IS NOT NULL AND ended_by IS NOT NULL AND BTRIM(end_reason) <> ''))
);
CREATE UNIQUE INDEX group_membership_unended_once ON group_membership(group_id, actor_id)
    WHERE ended_at IS NULL;

REVOKE ALL ON project, project_membership, business_group, group_membership FROM idea_ddm_app;
GRANT SELECT, INSERT ON project, project_membership, business_group, group_membership TO idea_ddm_app;
-- Narrow state-write storage interfaces follow with their owner behavior tests. No blanket DML.
