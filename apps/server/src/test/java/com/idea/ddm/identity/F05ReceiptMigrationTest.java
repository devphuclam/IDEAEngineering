package com.idea.ddm.identity;

import static org.junit.jupiter.api.Assertions.*;
import java.sql.*;
import org.flywaydb.core.Flyway;
import org.junit.jupiter.api.Test;

/** Isolated V9→V10 successor, explicit immutable historical V9 qualification remains targeted V9. */
class F05ReceiptMigrationTest {
    @Test void v10AddsExactReceiptEvidenceWithLeastPrivilegeAndNoPendingMigration() throws Exception {
        F05DatabaseFixture.create("9");
        var flyway=Flyway.configure().dataSource(F05DatabaseFixture.url(),"idea_ddm_migrator",F05DatabaseFixture.password("migration"))
                .schemas(F05DatabaseFixture.schema()).defaultSchema(F05DatabaseFixture.schema()).createSchemas(false).cleanDisabled(true).locations("classpath:db/migration").load();
        assertEquals(1,flyway.migrate().migrationsExecuted);assertTrue(flyway.validateWithResult().validationSuccessful);
        assertEquals(0,flyway.migrate().migrationsExecuted);assertEquals(0,flyway.info().pending().length);
        try(var c=F05DatabaseFixture.open("app");var q=c.createStatement()){
            try(var r=q.executeQuery("SELECT count(*),count(checksum) FROM flyway_schema_history WHERE success AND version IS NOT NULL")){assertTrue(r.next());assertEquals(10,r.getInt(1));assertEquals(10,r.getInt(2));}
            try(var r=q.executeQuery("SELECT tableowner FROM pg_tables WHERE schemaname=current_schema() AND tablename='transfer_receipt_evidence'")){assertTrue(r.next());assertEquals("idea_ddm_migrator",r.getString(1));}
            for(String sql:java.util.List.of("CREATE TABLE f05_forbidden(id integer)","UPDATE transfer_receipt_evidence SET contract_version=1","DELETE FROM transfer_receipt_evidence","TRUNCATE transfer_receipt_evidence"))
                assertEquals("42501",assertThrows(SQLException.class,()->q.execute(sql)).getSQLState());
            try(var r=q.executeQuery("SELECT count(*) FROM transfer_receipt_evidence")){assertTrue(r.next());assertEquals(0,r.getInt(1));}
        }
    }
}
