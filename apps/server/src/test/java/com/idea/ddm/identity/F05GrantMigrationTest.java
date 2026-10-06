package com.idea.ddm.identity;

import static org.junit.jupiter.api.Assertions.*;
import java.sql.*;
import java.util.UUID;
import org.flywaydb.core.Flyway;
import org.junit.jupiter.api.Test;

/** Real V8 successor, with a legacy Grant retained rather than inventing its missing provenance. */
class F05GrantMigrationTest {
    @Test void upgradePreservesLegacyClaimsAndEnforcesAppendOnlyExactScope() throws Exception {
        F05DatabaseFixture.create("8");
        var actor=UUID.randomUUID();var vault=UUID.randomUUID();var transfer=UUID.randomUUID();
        var operation=UUID.randomUUID();var grant=UUID.randomUUID();
        try(var c=F05DatabaseFixture.open("migration");var s=c.createStatement()) {
            try(var r=s.executeQuery("SELECT to_regclass('transfer_grant_scope')")){assertTrue(r.next());assertNull(r.getString(1));}
            s.execute("INSERT INTO actor(actor_id,display_name) VALUES ('"+actor+"','Synthetic migration actor')");
            s.execute("INSERT INTO vault_endpoint(vault_id,adapter_kind,eligibility) VALUES ('"+vault+"','FILESYSTEM','ELIGIBLE')");
            s.execute("INSERT INTO transfer_record(transfer_id,operation_id,actor_id,vault_id,direction,expected_byte_count,digest_algorithm,expected_digest,state) VALUES ('"+transfer+"','"+operation+"','"+actor+"','"+vault+"','UPLOAD',1024,'SHA-256','synthetic-migration-digest','PREPARING')");
            s.execute("INSERT INTO transfer_grant(grant_id,transfer_id,operation_id,vault_id,direction,expected_byte_count,digest_algorithm,expected_digest,allowed_byte_start,allowed_byte_end,issued_at,expires_at,status) VALUES ('"+grant+"','"+transfer+"','"+operation+"','"+vault+"','UPLOAD',1024,'SHA-256','synthetic-migration-digest',0,1024,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP+INTERVAL '5 minutes','ISSUED')");
        }
        var flyway=Flyway.configure().target("9").dataSource(F05DatabaseFixture.url(),"idea_ddm_migrator",F05DatabaseFixture.password("migration"))
                .schemas(F05DatabaseFixture.schema()).defaultSchema(F05DatabaseFixture.schema()).createSchemas(false)
                .cleanDisabled(true).locations("classpath:db/migration").load();
        assertEquals(1,flyway.migrate().migrationsExecuted);
        assertTrue(flyway.validateWithResult().validationSuccessful);
        assertEquals(0,flyway.migrate().migrationsExecuted);
        assertEquals(0,flyway.info().pending().length);
        try(var c=F05DatabaseFixture.open("app");var s=c.createStatement()) {
            try(var r=s.executeQuery("SELECT count(*),count(checksum) FROM flyway_schema_history WHERE success AND version IS NOT NULL")) {
                assertTrue(r.next());assertEquals(9,r.getInt(1));assertEquals(9,r.getInt(2));
            }
            try(var r=s.executeQuery("SELECT count(*) FROM transfer_grant_scope")){assertTrue(r.next());assertEquals(0,r.getInt(1));}
            try(var r=s.executeQuery("SELECT operation_id,expected_byte_count,expected_digest,status FROM transfer_grant WHERE grant_id='"+grant+"'")) {
                assertTrue(r.next());assertEquals(operation,r.getObject(1,UUID.class));assertEquals(1024,r.getLong(2));
                assertEquals("synthetic-migration-digest",r.getString(3));assertEquals("ISSUED",r.getString(4));assertFalse(r.next());
            }
            try(var r=s.executeQuery("SELECT tableowner FROM pg_tables WHERE schemaname=current_schema() AND tablename='transfer_grant_scope'")) {
                assertTrue(r.next());assertEquals("idea_ddm_migrator",r.getString(1));
            }
            try(var r=s.executeQuery("SELECT pg_get_userbyid(proowner) FROM pg_proc WHERE pronamespace=current_schema()::regnamespace AND proname='preserve_transfer_grant_claims'")) {
                assertTrue(r.next());assertEquals("idea_ddm_migrator",r.getString(1));
            }
            denied(s,"CREATE TABLE f05_forbidden(id integer)");
            denied(s,"UPDATE transfer_grant_scope SET contract_version=1");
            denied(s,"DELETE FROM transfer_grant_scope");
            denied(s,"TRUNCATE transfer_grant_scope");
            denied(s,"UPDATE transfer_grant SET allowed_byte_end=1 WHERE grant_id='"+grant+"'");
            assertEquals(1,s.executeUpdate("UPDATE transfer_grant SET status='EXPIRED' WHERE grant_id='"+grant+"'"));
        }
    }
    private static void denied(Statement statement,String sql) {
        assertEquals("42501",assertThrows(SQLException.class,()->statement.execute(sql)).getSQLState());
    }
}
