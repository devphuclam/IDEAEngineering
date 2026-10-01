-- Issue #26: NEW isolated synthetic preview only. No passwords, no role changes, no DROP.
\set ON_ERROR_STOP on
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_database WHERE datname = 'idea_ddm_preview_20261001_26') THEN
    RAISE EXCEPTION 'Preview database already exists; refusing adoption or overwrite';
  END IF;
  IF (SELECT count(*) FROM pg_roles WHERE rolname IN ('idea_ddm_migrator', 'idea_ddm_app')
      AND rolcanlogin AND NOT (rolsuper OR rolcreatedb OR rolcreaterole OR rolreplication OR rolbypassrls)) <> 2 THEN
    RAISE EXCEPTION 'Expected two existing non-elevated IDEA login roles';
  END IF;
  IF EXISTS (SELECT 1 FROM pg_auth_members JOIN pg_roles ON pg_roles.oid = member
             WHERE rolname IN ('idea_ddm_migrator', 'idea_ddm_app')) THEN
    RAISE EXCEPTION 'Unexpected inherited role authority; inspect manually';
  END IF;
END $$;
CREATE DATABASE idea_ddm_preview_20261001_26 OWNER idea_ddm_migrator TEMPLATE template0;
REVOKE ALL ON DATABASE idea_ddm_preview_20261001_26 FROM PUBLIC;
GRANT CONNECT ON DATABASE idea_ddm_preview_20261001_26 TO idea_ddm_migrator, idea_ddm_app;
\connect idea_ddm_preview_20261001_26
REVOKE CREATE ON SCHEMA public FROM PUBLIC, idea_ddm_app;
GRANT USAGE ON SCHEMA public TO idea_ddm_app;
ALTER DEFAULT PRIVILEGES FOR ROLE idea_ddm_migrator IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO idea_ddm_app;
ALTER DEFAULT PRIVILEGES FOR ROLE idea_ddm_migrator IN SCHEMA public
  GRANT USAGE, SELECT ON SEQUENCES TO idea_ddm_app;
