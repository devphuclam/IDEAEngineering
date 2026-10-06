-- Additive G01 persisted frozen-v1 claim scope; no historical V1-V8 edit or invented custody event.
ALTER TABLE transfer_record ADD CONSTRAINT transfer_actor_identity UNIQUE (transfer_id, actor_id);
ALTER TABLE transfer_grant ADD CONSTRAINT grant_transfer_identity UNIQUE (grant_id, transfer_id);

CREATE TABLE transfer_grant_scope (
    grant_id UUID PRIMARY KEY,
    transfer_id UUID NOT NULL,
    actor_id UUID NOT NULL,
    organization_id UUID NOT NULL REFERENCES operating_organization (organization_id),
    correlation_id UUID NOT NULL,
    gateway_id UUID NOT NULL,
    endpoint VARCHAR(256) NOT NULL CHECK (endpoint LIKE 'https://%'),
    object_kind SMALLINT NOT NULL CHECK (object_kind IN (1,2)),
    object_id UUID NOT NULL,
    issuer VARCHAR(256) NOT NULL CHECK (BTRIM(issuer) <> ''),
    audience VARCHAR(256) NOT NULL CHECK (BTRIM(audience) <> ''),
    signing_key_id VARCHAR(256) NOT NULL CHECK (BTRIM(signing_key_id) <> ''),
    contract_version INTEGER NOT NULL CHECK (contract_version = 1),
    FOREIGN KEY (grant_id,transfer_id) REFERENCES transfer_grant (grant_id,transfer_id),
    FOREIGN KEY (transfer_id,actor_id) REFERENCES transfer_record (transfer_id,actor_id)
);
GRANT SELECT,INSERT ON transfer_grant_scope TO idea_ddm_app;
REVOKE UPDATE,DELETE,TRUNCATE ON transfer_grant_scope FROM idea_ddm_app;
CREATE TRIGGER transfer_grant_scope_append_only
    BEFORE UPDATE OR DELETE OR TRUNCATE ON transfer_grant_scope
    FOR EACH STATEMENT EXECUTE FUNCTION reject_retained_owner_mutation();

-- Status remains mutable; signed claim content may never be retargeted through the legacy table.
CREATE FUNCTION preserve_transfer_grant_claims() RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    IF (to_jsonb(NEW) - 'status') IS DISTINCT FROM (to_jsonb(OLD) - 'status') THEN
        RAISE EXCEPTION 'issued grant claims are immutable' USING ERRCODE = '42501';
    END IF;
    RETURN NEW;
END;
$$;
CREATE TRIGGER transfer_grant_claims_immutable BEFORE UPDATE ON transfer_grant
    FOR EACH ROW EXECUTE FUNCTION preserve_transfer_grant_claims();
