-- Reviewed manual-delivery successor. Keep V1-V11 and historical consumption semantics immutable.
ALTER TABLE credential_setup_proof
    ADD COLUMN superseded_at TIMESTAMPTZ,
    ADD COLUMN superseded_operation_id UUID REFERENCES iam_owner_outcome(operation_id) DEFERRABLE INITIALLY DEFERRED,
    ADD CONSTRAINT setup_supersession_complete CHECK (
        (superseded_at IS NULL AND superseded_operation_id IS NULL) OR
        (superseded_at IS NOT NULL AND superseded_operation_id IS NOT NULL AND superseded_at>=issued_at AND consumed_at IS NULL));
ALTER TABLE credential_reset_proof
    ADD COLUMN superseded_at TIMESTAMPTZ,
    ADD COLUMN superseded_operation_id UUID REFERENCES iam_owner_outcome(operation_id) DEFERRABLE INITIALLY DEFERRED,
    ADD CONSTRAINT reset_supersession_complete CHECK (
        (superseded_at IS NULL AND superseded_operation_id IS NULL) OR
        (superseded_at IS NOT NULL AND superseded_operation_id IS NOT NULL AND superseded_at>=issued_at AND consumed_at IS NULL));
GRANT UPDATE (superseded_at,superseded_operation_id) ON credential_setup_proof,credential_reset_proof TO idea_ddm_app;
