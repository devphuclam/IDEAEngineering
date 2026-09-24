-- IDEA DDM Core v0: development-only PostgreSQL bootstrap.
-- Run as the local PostgreSQL bootstrap administrator after inspecting the
-- target host. This file contains no password or application migration.
-- It preserves existing target names; it never drops a role or database.
\set ON_ERROR_STOP on

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_roles
        WHERE rolname IN ('idea_ddm_migrator', 'idea_ddm_app')
          AND (rolsuper OR rolcreatedb OR rolcreaterole OR rolreplication OR rolbypassrls)
    ) THEN
        RAISE EXCEPTION 'IDEA target role already has elevated privileges; inspect manually';
    END IF;
    IF EXISTS (
        SELECT 1 FROM pg_database
        WHERE datname = 'idea_ddm_dev'
          AND pg_get_userbyid(datdba) <> 'idea_ddm_migrator'
    ) THEN
        RAISE EXCEPTION 'IDEA target database exists with a different owner; inspect manually';
    END IF;
END
$$;

SELECT 'CREATE ROLE idea_ddm_migrator LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION NOBYPASSRLS'
WHERE NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'idea_ddm_migrator')
\gexec

SELECT 'CREATE ROLE idea_ddm_app LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION NOBYPASSRLS'
WHERE NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'idea_ddm_app')
\gexec

SELECT 'CREATE DATABASE idea_ddm_dev OWNER idea_ddm_migrator'
WHERE NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = 'idea_ddm_dev')
\gexec

REVOKE ALL ON DATABASE idea_ddm_dev FROM PUBLIC;
GRANT CONNECT ON DATABASE idea_ddm_dev TO idea_ddm_migrator, idea_ddm_app;

\connect idea_ddm_dev

REVOKE CREATE ON SCHEMA public FROM PUBLIC;
GRANT USAGE ON SCHEMA public TO idea_ddm_app;

-- The migrator will own future Flyway-created objects. The app role receives
-- data access, not schema ownership or migration privileges.
ALTER DEFAULT PRIVILEGES FOR ROLE idea_ddm_migrator IN SCHEMA public
    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO idea_ddm_app;
ALTER DEFAULT PRIVILEGES FOR ROLE idea_ddm_migrator IN SCHEMA public
    GRANT USAGE, SELECT ON SEQUENCES TO idea_ddm_app;

GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO idea_ddm_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO idea_ddm_app;

-- Passwords are set separately with interactive psql \password prompts.
-- Do not place secrets in this file or command-line arguments.
