-- Additive successor; never rewrite reviewed identity migrations.
ALTER TABLE session_record ADD COLUMN account_id UUID REFERENCES idea_account(account_id);
UPDATE session_record s SET account_id=a.account_id FROM idea_account a WHERE a.actor_id=s.actor_id;
ALTER TABLE session_record ALTER COLUMN account_id SET NOT NULL;
ALTER TABLE session_record ADD COLUMN last_eligible_activity_at TIMESTAMPTZ;
UPDATE session_record SET last_eligible_activity_at=issued_at;
ALTER TABLE session_record ALTER COLUMN last_eligible_activity_at SET NOT NULL;
ALTER TABLE session_record ADD COLUMN runtime_instance_id UUID;
-- Older rows have no current runtime binding and cannot restore a live HTTP session.
