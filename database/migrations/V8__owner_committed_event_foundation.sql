-- ADR-0014 / F04 ENVELOPE-9. Event retention is not event delivery.
-- Retain the exact Actor's Account Organization; never guess from a singleton Organization.
ALTER TABLE sample_owner_operation ADD COLUMN organization_id UUID;
UPDATE sample_owner_operation AS sample
    SET organization_id = account.organization_id
    FROM idea_account AS account
    WHERE account.actor_id = sample.actor_id;
-- An unattributable predecessor row makes migration fail rather than deleting/fabricating history.
ALTER TABLE sample_owner_operation ALTER COLUMN organization_id SET NOT NULL;
ALTER TABLE sample_owner_operation ADD CONSTRAINT sample_owner_operation_organization_fk
    FOREIGN KEY (organization_id) REFERENCES operating_organization (organization_id)
    ON UPDATE NO ACTION ON DELETE NO ACTION;

-- Historical F03 appenders may omit correlation; the F04 repository contract requires it.
ALTER TABLE audit_evidence ADD COLUMN correlation_id VARCHAR(160)
    CHECK (correlation_id IS NULL OR BTRIM(correlation_id) <> '');

CREATE TABLE owner_committed_event (
    event_id UUID PRIMARY KEY,
    operation_id UUID NOT NULL,
    producer_owner VARCHAR(120) NOT NULL CHECK (BTRIM(producer_owner) <> ''),
    organization_id UUID NOT NULL REFERENCES operating_organization (organization_id)
        ON UPDATE NO ACTION ON DELETE NO ACTION,
    event_kind VARCHAR(120) NOT NULL CHECK (BTRIM(event_kind) <> ''),
    contract_version INTEGER NOT NULL CHECK (contract_version > 0),
    actor_id UUID NOT NULL REFERENCES actor (actor_id) ON UPDATE NO ACTION ON DELETE NO ACTION,
    correlation_id VARCHAR(160) NOT NULL CHECK (BTRIM(correlation_id) <> ''),
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- This is only the F04 sample's one accepted event, not a common event cardinality.
CREATE UNIQUE INDEX sample_accepted_event_once
    ON owner_committed_event (organization_id, operation_id)
    WHERE producer_owner = 'PH1_SAMPLE_OWNER' AND event_kind = 'OPERATION_ACCEPTED';

GRANT SELECT, INSERT ON owner_committed_event TO idea_ddm_app;
REVOKE UPDATE, DELETE, TRUNCATE ON owner_committed_event FROM idea_ddm_app;

CREATE FUNCTION reject_retained_owner_mutation() RETURNS TRIGGER
LANGUAGE plpgsql AS $$
BEGIN
    RAISE EXCEPTION 'retained owner content is append-only' USING ERRCODE = '42501';
END;
$$;

CREATE TRIGGER owner_committed_event_append_only
    BEFORE UPDATE OR DELETE OR TRUNCATE ON owner_committed_event
    FOR EACH STATEMENT EXECUTE FUNCTION reject_retained_owner_mutation();

GRANT SELECT, INSERT ON sample_owner_operation TO idea_ddm_app;
REVOKE UPDATE, DELETE, TRUNCATE ON sample_owner_operation FROM idea_ddm_app;
CREATE TRIGGER sample_owner_operation_append_only
    BEFORE UPDATE OR DELETE OR TRUNCATE ON sample_owner_operation
    FOR EACH STATEMENT EXECUTE FUNCTION reject_retained_owner_mutation();
