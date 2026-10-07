package com.idea.ddm.iam;

import java.sql.DriverManager;
import java.util.UUID;
import org.flywaydb.core.Flyway;

/** Legacy regression fixtures retargeted only to the approved 009 DB; product assertions stay intact. */
public final class IamRegressionSchemas {
    private IamRegressionSchemas() {}
    public static String create() throws Exception {
        var source = required("IDEA_IAM_SOURCE_SHA");
        if (!source.matches("[0-9a-f]{40}") || !IamIntegrationFixtures.DATABASE.equals(required("IDEA_F03_TEST_DATABASE_NAME")))
            throw new SecurityException("Unapproved regression target");
        var schema = "iam_ui_" + UUID.randomUUID().toString().replace("-", "");
        try (var c = migrator(); var s = c.createStatement()) {
            try (var r = s.executeQuery("SELECT current_database(),current_user,pg_get_userbyid(datdba) FROM pg_database WHERE datname=current_database()")) {
                if (!r.next() || !IamIntegrationFixtures.DATABASE.equals(r.getString(1)) || !"idea_ddm_migrator".equals(r.getString(2)) || !"idea_ddm_migrator".equals(r.getString(3))) throw new SecurityException("Regression ownership");
            }
            s.execute("CREATE SCHEMA " + schema + " AUTHORIZATION idea_ddm_migrator");
            s.execute("COMMENT ON SCHEMA " + schema + " IS 'IDEA_IAM_UI_RUN:" + source + ":" + schema + "'");
        }
        Flyway.configure().dataSource(url(), "idea_ddm_migrator", required("IDEA_DATABASE_MIGRATION_PASSWORD"))
                .schemas(schema).defaultSchema(schema).createSchemas(false).cleanDisabled(true).locations("classpath:db/migration").load().migrate();
        try (var c = migrator(); var s = c.createStatement()) {
            s.execute("GRANT USAGE ON SCHEMA " + schema + " TO idea_ddm_app");
            s.execute("REVOKE INSERT,UPDATE,DELETE,TRUNCATE ON " + schema + ".flyway_schema_history FROM idea_ddm_app");
            s.execute("GRANT SELECT ON " + schema + ".flyway_schema_history TO idea_ddm_app");
        }
        System.out.println("IAM_REGRESSION_SCHEMA_READY=" + schema + ";SOURCE=" + source);
        return schema;
    }
    public static void remove(String schema) throws Exception {
        if (!schema.matches("iam_ui_[0-9a-f]{32}")) throw new SecurityException("Not an owned schema");
        try (var c = migrator(); var q = c.prepareStatement("SELECT pg_get_userbyid(nspowner),obj_description(oid,'pg_namespace') FROM pg_namespace WHERE nspname=?")) {
            q.setString(1, schema);
            try (var r = q.executeQuery()) {
                if (!r.next() || !"idea_ddm_migrator".equals(r.getString(1)) || !("IDEA_IAM_UI_RUN:" + required("IDEA_IAM_SOURCE_SHA") + ":" + schema).equals(r.getString(2))) throw new SecurityException("Regression owner/source marker differs");
            }
            try (var s = c.createStatement()) { s.execute("DROP SCHEMA " + schema + " CASCADE"); }
        }
        System.out.println("IAM_REGRESSION_SCHEMA_CLEANED=" + schema);
    }
    public static String url() { return "jdbc:postgresql://127.0.0.1:5432/" + IamIntegrationFixtures.DATABASE; }
    private static java.sql.Connection migrator() throws Exception { return DriverManager.getConnection(url(), "idea_ddm_migrator", required("IDEA_DATABASE_MIGRATION_PASSWORD")); }
    private static String required(String name) { var value = System.getenv(name); if (value == null || value.isBlank()) throw new SecurityException("Missing regression prerequisite"); return value; }
}
