package com.idea.ddm;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.HashSet;
import java.util.Set;
import com.idea.ddm.migration.DatabaseMigrationCommand;
import org.flywaydb.core.Flyway;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfEnvironmentVariable;

/** Qualifies the approved fresh public successor after DataBaselineTest performs first migration. */
@EnabledIfEnvironmentVariable(named = "IDEA_F03B_CLOSURE_DATABASE_NAME", matches = "idea_ddm_f02_f03b_closure_[a-z0-9_]+")
class F03BPublicMigrationTest {
    private static final Set<String> TABLES = Set.of(
            "actor", "idea_account", "login_identity", "session_record", "sample_owner_operation",
            "audit_evidence", "vault_endpoint", "transfer_record", "transfer_grant", "transfer_receipt",
            "artifact", "artifact_location", "operating_organization", "identity_role_version",
            "identity_role_assignment", "identity_bootstrap_state", "iam_owner_outcome",
            "identity_role_permission", "identity_authorization_decision", "access_policy_owner_outcome",
            "identity_assignment_evidence", "iam_account_change_evidence", "credential_setup_proof",
            "credential_reset_proof", "login_failure_state", "flyway_schema_history");

    @Test
    void freshPublicHasValidatedSevenMigrationHistoryEntriesAndExactMigratorOwnedObjects() throws Exception {
        var flyway = Flyway.configure().dataSource(url(), "idea_ddm_migrator",
                environment("IDEA_DATABASE_MIGRATION_PASSWORD")).locations("classpath:db/migration")
                .cleanDisabled(true).load();
        flyway.validate();
        var applied = flyway.info().applied();
        assertEquals(7, applied.length);
        assertEquals(0, flyway.info().pending().length);
        for (int index = 0; index < 7; index++) {
            assertEquals(Integer.toString(index + 1), applied[index].getVersion().toString());
            assertNotNull(applied[index].getChecksum());
        }
        try (var connection = connection("idea_ddm_migrator"); var query = connection.createStatement()) {
            try (var rows = query.executeQuery("SELECT current_user,pg_get_userbyid(datdba) FROM pg_database WHERE datname=current_database()")) {
                assertTrue(rows.next());
                assertEquals("idea_ddm_migrator", rows.getString(1));
                assertEquals("idea_ddm_migrator", rows.getString(2));
            }
            var tables = new HashSet<String>();
            try (var rows = query.executeQuery("SELECT tablename,tableowner FROM pg_tables WHERE schemaname='public'")) {
                while (rows.next()) {
                    tables.add(rows.getString(1));
                    assertEquals("idea_ddm_migrator", rows.getString(2), rows.getString(1));
                }
            }
            assertEquals(TABLES, tables);
            try (var rows = query.executeQuery("SELECT p.proname,pg_get_userbyid(p.proowner) FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace WHERE n.nspname='public'")) {
                assertTrue(rows.next());
                assertEquals("reject_audit_evidence_mutation", rows.getString(1));
                assertEquals("idea_ddm_migrator", rows.getString(2));
                assertFalse(rows.next());
            }
            try (var rows = query.executeQuery("SELECT count(*),bool_and(success AND checksum IS NOT NULL) FROM public.flyway_schema_history WHERE version IS NOT NULL")) {
                assertTrue(rows.next());
                assertEquals(7, rows.getInt(1));
                assertTrue(rows.getBoolean(2));
            }
        }
    }

    @Test
    void noOpMigrationRestoresReadOnlyHistoryAfterBootstrapStyleAclDrift() throws Exception {
        // Owned test database only. Reproduce the default-ACL defect, then use the real command.
        try (var connection = connection("idea_ddm_migrator"); var statement = connection.createStatement()) {
            statement.execute("GRANT INSERT,UPDATE,DELETE ON public.flyway_schema_history TO idea_ddm_app");
        }
        try {
            assertEquals(0, DatabaseMigrationCommand.migrate(System.getenv()));
            try (var connection = connection("idea_ddm_app"); var statement = connection.createStatement()) {
                try (var rows = statement.executeQuery("SELECT count(*) FROM public.flyway_schema_history WHERE success")) {
                    assertTrue(rows.next());
                    assertEquals(7, rows.getInt(1), "Runtime retains read-only history visibility");
                }
                for (var mutation : Set.of("INSERT", "UPDATE", "DELETE", "TRUNCATE")) {
                    try (var rows = statement.executeQuery("SELECT has_table_privilege(current_user,'public.flyway_schema_history','" + mutation + "')")) {
                        assertTrue(rows.next());
                        assertFalse(rows.getBoolean(1), mutation);
                    }
                }
                denied(connection, "UPDATE public.flyway_schema_history SET success=success");
            }
        } finally {
            // Narrow cleanup also protects retained evidence if an assertion/command fails.
            try (var connection = connection("idea_ddm_migrator"); var statement = connection.createStatement()) {
                statement.execute("REVOKE ALL ON public.flyway_schema_history FROM PUBLIC,idea_ddm_app");
                statement.execute("GRANT SELECT ON public.flyway_schema_history TO idea_ddm_app");
            }
        }
    }

    @Test
    void runtimeCannotAcquireMigrationOrRewriteProtectedAssignmentsAndProofBindings() throws Exception {
        DatabasePrivilegeAssertions.assertMigrationRoleOwnsBaselineAndApplicationCannotCreateObjects();
        try (var connection = connection("idea_ddm_app"); var query = connection.createStatement()) {
            try (var rows = query.executeQuery("SELECT current_user,rolsuper,rolcreatedb,rolcreaterole,rolreplication,rolbypassrls,pg_has_role(current_user,'idea_ddm_migrator','MEMBER') FROM pg_roles WHERE rolname=current_user")) {
                assertTrue(rows.next());
                assertEquals("idea_ddm_app", rows.getString(1));
                for (int column = 2; column <= 7; column++) assertFalse(rows.getBoolean(column));
            }
            denied(connection, "SET ROLE idea_ddm_migrator");
            for (var table : Set.of("identity_role_version", "identity_role_permission", "identity_role_assignment",
                    "operating_organization", "identity_bootstrap_state", "iam_owner_outcome", "audit_evidence",
                    "access_policy_owner_outcome", "identity_authorization_decision", "identity_assignment_evidence",
                    "iam_account_change_evidence", "credential_setup_proof", "credential_reset_proof", "flyway_schema_history")) {
                denied(connection, "DELETE FROM public." + table);
                denied(connection, "TRUNCATE public." + table);
            }
            denied(connection, "UPDATE public.identity_role_version SET version=version");
            denied(connection, "UPDATE public.identity_role_permission SET permission_code=permission_code");
            denied(connection, "UPDATE public.identity_role_assignment SET organization_id=organization_id");
            denied(connection, "INSERT INTO public.identity_role_version SELECT * FROM public.identity_role_version WHERE false");
            denied(connection, "INSERT INTO public.identity_role_permission SELECT * FROM public.identity_role_permission WHERE false");
            denied(connection, "UPDATE public.flyway_schema_history SET success=success");
            denied(connection, "INSERT INTO public.flyway_schema_history SELECT * FROM public.flyway_schema_history WHERE false");
            for (var table : Set.of("credential_setup_proof", "credential_reset_proof")) {
                for (var column : Set.of("proof_id", "account_id", "login_identity_id", "security_version", "purpose",
                        "proof_digest", "issued_by", "issue_operation_id", "reason", "issued_at", "expires_at")) {
                    denied(connection, "UPDATE public." + table + " SET " + column + "=" + column);
                }
                // Only qualified consumption columns are mutable; no fixture credential/proof is created here.
                connection.setAutoCommit(false);
                try {
                    assertEquals(0, query.executeUpdate("UPDATE public." + table
                            + " SET consumed_at=consumed_at,consumed_operation_id=consumed_operation_id WHERE false"));
                } finally { connection.rollback(); connection.setAutoCommit(true); }
            }
        }
    }

    @Test
    void successorPreservesExactRoleVersionsWithoutAddingAuthorityToV1() throws Exception {
        try (var connection = connection("idea_ddm_app"); var query = connection.createStatement()) {
            var actual = new HashSet<String>();
            try (var rows = query.executeQuery("SELECT role_code,version,permission_code FROM public.identity_role_version JOIN public.identity_role_permission USING(role_version_id)")) {
                while (rows.next()) actual.add(rows.getString(1) + "@" + rows.getInt(2) + ":" + rows.getString(3));
            }
            assertEquals(Set.of("super-administrator@1:role.assign.account-administrator",
                    "account-administrator@1:account.create", "account-administrator@1:account.disable",
                    "account-administrator@1:account.re-enable", "account-administrator@2:account.create",
                    "account-administrator@2:account.disable", "account-administrator@2:account.re-enable",
                    "account-administrator@2:account.credential.setup.issue",
                    "account-administrator@2:account.credential.reset.issue"), actual);
            for (var table : Set.of("actor", "idea_account", "login_identity", "session_record",
                    "identity_role_assignment", "credential_setup_proof", "credential_reset_proof", "login_failure_state")) {
                try (var rows = query.executeQuery("SELECT count(*) FROM public." + table)) {
                    assertTrue(rows.next());
                    assertEquals(0, rows.getInt(1), "Fresh qualification must not create identity/custody data: " + table);
                }
            }
        }
    }

    private static void denied(Connection connection, String sql) throws Exception {
        connection.setAutoCommit(false);
        try (var statement = connection.createStatement()) {
            var refusal = assertThrows(SQLException.class, () -> statement.execute(sql));
            assertEquals("42501", refusal.getSQLState(), sql);
        } finally { connection.rollback(); connection.setAutoCommit(true); }
    }

    private static Connection connection(String user) throws SQLException {
        return DriverManager.getConnection(url(), user, environment(user.equals("idea_ddm_app")
                ? "IDEA_DATABASE_APP_PASSWORD" : "IDEA_DATABASE_MIGRATION_PASSWORD"));
    }

    private static String url() {
        var database = environment("IDEA_F03B_CLOSURE_DATABASE_NAME");
        if (!database.matches("idea_ddm_f02_f03b_closure_[a-z0-9_]+")
                || !database.equals(environment("IDEA_DATABASE_NAME"))
                || !database.equals(environment("IDEA_F02_TEST_DATABASE_NAME"))
                || !environment("IDEA_DATABASE_APP_USER").equals("idea_ddm_app")
                || !environment("IDEA_DATABASE_MIGRATION_USER").equals("idea_ddm_migrator")) {
            throw new IllegalStateException("Use only the separately approved F03-B closure test database and exact roles");
        }
        return "jdbc:postgresql://" + environment("IDEA_DATABASE_HOST") + ":"
                + environment("IDEA_DATABASE_PORT") + "/" + database;
    }

    private static String environment(String name) {
        var value = System.getenv(name);
        if (value == null || value.isBlank()) throw new IllegalStateException("Missing test variable: " + name);
        return value;
    }
}
