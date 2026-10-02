-- ADR-0014 / F04 ENVELOPE-9. Event retention is not event delivery.
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
