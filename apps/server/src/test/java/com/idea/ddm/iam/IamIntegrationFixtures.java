package com.idea.ddm.iam;

import java.sql.Connection;
import java.sql.DriverManager;
import java.util.UUID;
import javax.sql.DataSource;
import org.flywaydb.core.Flyway;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

/** Synthetic named identities only. Database cleanup belongs to the runner after the JVM exits. */
public final class IamIntegrationFixtures {
    public static final String DATABASE = "idea_ddm_iam_ui_20261007_46";
    public enum Persona {
        SUPER("super"), AA_V1("aa-v1"), AA_V2("aa-v2"), AA_V3("aa-v3"),
        PA_ORGANIZATION("pa-org"), PA_PROJECT("pa-project"), PRA("pra"), AUDIT("audit"),
        LINH("linh"), ORDINARY("ordinary"), PENDING("pending"), DISABLED("disabled"), MULTI_LOGIN("multi-login");
        private final String suffix;
        Persona(String suffix) { this.suffix = suffix; }
    }
    public record Identity(UUID actorId, UUID accountId, UUID loginIdentityId,
            UUID organizationId, String displayName, String login) {}

    private final String schema;
    private final String source;
    private final UUID organizationId = UUID.randomUUID();

    public IamIntegrationFixtures() {
        schema = required("IDEA_IAM_TEST_SCHEMA");
        source = required("IDEA_IAM_SOURCE_SHA");
        if (!schema.matches("iam_ui_[0-9a-f]{32}") || !source.matches("[0-9a-f]{40}")) {
            throw new SecurityException("Unapproved IAM qualification identity");
        }
    }

    public UUID organizationId() { return organizationId; }
    public String url() { return "jdbc:postgresql://127.0.0.1:5432/" + DATABASE + "?currentSchema=" + schema; }
    public DataSource appDataSource() { return new DriverManagerDataSource(url(), "idea_ddm_app", required("IDEA_DATABASE_APP_PASSWORD")); }
    public Connection app() throws Exception { return appDataSource().getConnection(); }
    public Connection migrator() throws Exception {
        return DriverManager.getConnection(url(), "idea_ddm_migrator", required("IDEA_DATABASE_MIGRATION_PASSWORD"));
    }

    /** Names are labels, never permissions; creation does not grant any role or membership. */
    public Identity identity(Persona persona) {
        var suffix = UUID.randomUUID().toString();
        return new Identity(UUID.randomUUID(), UUID.randomUUID(), UUID.randomUUID(), organizationId,
                "Synthetic IAM " + persona.suffix, "iamtest-" + persona.suffix + "." + suffix);
    }

    public void createSchema() throws Exception {
        createSchema(null);
    }

    /** An upgrade qualification may stop at the immutable predecessor before seeding history. */
    public void createSchema(String targetVersion) throws Exception {
        try (var connection = migrator(); var statement = connection.createStatement()) {
            connection.setAutoCommit(false);
            requireTarget(connection, "idea_ddm_migrator");
            statement.execute("CREATE SCHEMA " + schema + " AUTHORIZATION idea_ddm_migrator");
            statement.execute("COMMENT ON SCHEMA " + schema + " IS 'IDEA_IAM_UI_RUN:" + source + ":" + schema + "'");
            connection.commit();
        }
        var configuration = Flyway.configure().dataSource(url(), "idea_ddm_migrator", required("IDEA_DATABASE_MIGRATION_PASSWORD"))
                .schemas(schema).defaultSchema(schema).createSchemas(false).cleanDisabled(true)
                .locations("classpath:db/migration");
        if (targetVersion != null) configuration.target(targetVersion);
        var result = configuration.load().migrate();
        try (var connection = migrator(); var statement = connection.createStatement()) {
            statement.execute("GRANT USAGE ON SCHEMA " + schema + " TO idea_ddm_app");
            statement.execute("REVOKE INSERT,UPDATE,DELETE,TRUNCATE ON " + schema + ".flyway_schema_history FROM idea_ddm_app");
            statement.execute("GRANT SELECT ON " + schema + ".flyway_schema_history TO idea_ddm_app");
            try (var insert = connection.prepareStatement("INSERT INTO operating_organization(organization_id,display_name) VALUES (?,?)")) {
                insert.setObject(1, organizationId);
                insert.setString(2, "Synthetic IAM Organization A");
                if (insert.executeUpdate() != 1) throw new IllegalStateException("Fixture Organization missing");
            }
        }
        try (var connection = app()) { requireTarget(connection, "idea_ddm_app"); }
        System.out.println("IAM_SCHEMA_READY=" + schema + ";SOURCE=" + source + ";MIGRATIONS=" + result.migrationsExecuted);
    }

    public int migrateSuccessor() {
        return Flyway.configure().dataSource(url(), "idea_ddm_migrator", required("IDEA_DATABASE_MIGRATION_PASSWORD"))
                .schemas(schema).defaultSchema(schema).createSchemas(false).cleanDisabled(true)
                .locations("classpath:db/migration").load().migrate().migrationsExecuted;
    }

    private static void requireTarget(Connection connection, String role) throws Exception {
        try (var statement = connection.createStatement(); var row = statement.executeQuery(
                "SELECT current_user,current_database(),pg_get_userbyid(datdba),"
                + "has_database_privilege(current_user,current_database(),'CREATE'),"
                + "pg_has_role(current_user,'idea_ddm_migrator','MEMBER') FROM pg_database WHERE datname=current_database()")) {
            if (!row.next() || !role.equals(row.getString(1)) || !DATABASE.equals(row.getString(2))
                    || !"idea_ddm_migrator".equals(row.getString(3))
                    || ("idea_ddm_app".equals(role) && (row.getBoolean(4) || row.getBoolean(5)))) {
                throw new SecurityException("Database/role boundary differs");
            }
        }
    }

    private static String required(String name) {
        var value = System.getenv(name);
        if (value == null || value.isEmpty()) throw new IllegalStateException("Missing controlled test input: " + name);
        return value;
    }
}
