-- Existing Login Identity only: no storage for arbitrary unknown identifiers.
CREATE TABLE login_failure_state (
    login_identity_id UUID PRIMARY KEY REFERENCES login_identity(login_identity_id),
    failed_at TIMESTAMPTZ[] NOT NULL,
    blocked_until TIMESTAMPTZ,
    CHECK (cardinality(failed_at) BETWEEN 1 AND 5),
    CHECK (array_position(failed_at, NULL) IS NULL),
    CHECK (array_ndims(failed_at) = 1)
);

REVOKE ALL ON login_failure_state FROM PUBLIC, idea_ddm_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON login_failure_state TO idea_ddm_app;
