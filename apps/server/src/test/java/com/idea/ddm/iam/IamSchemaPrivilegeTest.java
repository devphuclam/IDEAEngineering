package com.idea.ddm.iam;

import static org.junit.jupiter.api.Assertions.*;

import java.util.Map;
import java.util.TreeMap;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;

/** Approved relational storage/privilege seam; no Project or RBAC command qualification. */
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class IamSchemaPrivilegeTest {
    private final IamIntegrationFixtures fixtures = new IamIntegrationFixtures();
    private Map<String,String> predecessorRoles;
    private final IamIntegrationFixtures.Identity legacy = fixtures.identity(IamIntegrationFixtures.Persona.ORDINARY);
    private final java.util.UUID revokedAssignment = java.util.UUID.randomUUID();
    private String predecessorAssignment;
    private Map<String,Integer> predecessorChecksums;

    @BeforeAll void migrateOwnedSuccessor() throws Exception {
        fixtures.createSchema("10");
        predecessorRoles = roleContent();
        predecessorChecksums = migrationChecksums();
        try (var connection = fixtures.migrator()) {
            execute(connection,"INSERT INTO actor(actor_id,display_name) VALUES (?,?)",legacy.actorId(),legacy.displayName());
            execute(connection,"INSERT INTO idea_account(account_id,actor_id,organization_id,status) VALUES (?,?,?,'PENDING')",
                    legacy.accountId(),legacy.actorId(),legacy.organizationId());
            execute(connection,"INSERT INTO identity_role_assignment(assignment_id,principal_actor_id,role_version_id,organization_id,assigned_by,reason,assigned_at,revoked_at) "
                    + "VALUES (?,?,'9d80f77e-85a6-4c12-a72d-8ef6b7e0a002',?,?,'Synthetic predecessor revoked history','2026-10-06T01:00:00Z','2026-10-06T02:00:00Z')",
                    revokedAssignment,legacy.actorId(),legacy.organizationId(),legacy.actorId());
        }
        predecessorAssignment = retainedAssignment();
        fixtures.migrateSuccessor();
    }

    @Test void successorCreatesMigratorOwnedProjectAndRetainedMembershipState() throws Exception {
        try (var connection = fixtures.app(); var query = connection.createStatement(); var row = query.executeQuery(
                "SELECT count(*) FROM pg_tables WHERE schemaname=current_schema() AND tableowner='idea_ddm_migrator' "
                + "AND tablename IN ('project','project_membership','business_group','group_membership')")) {
            assertTrue(row.next());
            assertEquals(4, row.getInt(1), "Accepted Project/Group relational foundation must exist");
        }
    }

    @Test void activatedRoleProfileAndCandidateStagingHaveSeparateProtectedStorage() throws Exception {
        try (var connection = fixtures.app(); var query = connection.createStatement(); var row = query.executeQuery(
                "SELECT count(*) FROM pg_tables WHERE schemaname=current_schema() AND tableowner='idea_ddm_migrator' "
                + "AND tablename IN ('identity_role_definition','identity_role_version_profile',"
                + "'identity_role_candidate','identity_role_candidate_permission','permission_registry')")) {
            assertTrue(row.next());
            assertEquals(5, row.getInt(1), "Draft candidates must not be mutable activated role content");
        }
    }

    @Test void exactEightSupportedVersionsPreserveLegacyContentAndConferNoAssignments() throws Exception {
        var expected = new TreeMap<>(predecessorRoles);
        expected.put("account-administrator@3", "account.create,account.credential.reset.issue,account.credential.setup.issue,account.disable,account.re-enable,account.read");
        expected.put("super-administrator@2", "access.inspect,audit.read,role.assignment.manage.administration,role.assignment.manage.highest,role.catalogue.read");
        expected.put("privileged-role-administrator@1", "access.inspect,audit.read,role.assignment.manage.administration,role.assignment.manage.business,role.catalogue.read,role.definition.activate,role.definition.prepare");
        expected.put("project-administrator@1", "access.inspect,project.admin.read,project.create,project.group.create,project.group.membership.assign,project.group.membership.remove,project.group.update,project.membership.assign,project.membership.remove,project.update,role.assignment.manage.business,role.catalogue.read");
        expected.put("audit-reader@1", "audit.read");
        assertEquals(expected, roleContent());
        try (var connection = fixtures.app(); var statement = connection.createStatement(); var row = statement.executeQuery(
                "SELECT (SELECT count(*) FROM identity_role_version_profile),(SELECT count(*) FROM identity_role_assignment),"
                + "(SELECT count(*) FROM permission_registry)")) {
            assertTrue(row.next());
            assertEquals(8, row.getInt(1));
            assertEquals(1, row.getInt(2), "Only the explicit predecessor fixture remains; never migration grants");
            assertEquals(25, row.getInt(3));
        }
    }

    private Map<String,String> roleContent() throws Exception {
        var content = new TreeMap<String,String>();
        try (var connection = fixtures.app(); var statement = connection.createStatement(); var rows = statement.executeQuery(
                "SELECT v.role_code||'@'||v.version,string_agg(p.permission_code,',' ORDER BY p.permission_code COLLATE \"C\") "
                + "FROM identity_role_version v JOIN identity_role_permission p USING(role_version_id) GROUP BY v.role_code,v.version")) {
            while (rows.next()) content.put(rows.getString(1), rows.getString(2));
        }
        return content;
    }

    @Test void sealedLegacyRoleCannotGainAnAdditionalPermissionEvenThroughTheOwnerRole() throws Exception {
        try (var connection = fixtures.migrator(); var statement = connection.createStatement()) {
            connection.setAutoCommit(false);
            try {
                var refusal = assertThrows(java.sql.SQLException.class, () -> statement.executeUpdate(
                        "INSERT INTO identity_role_permission(role_version_id,permission_code) "
                        + "VALUES ('9d80f77e-85a6-4c12-a72d-8ef6b7e0a001','account.read')"));
                assertEquals("42501", refusal.getSQLState());
            } finally { connection.rollback(); }
        }
        assertEquals(predecessorRoles.get("super-administrator@1"), roleContent().get("super-administrator@1"));
    }

    @Test void assignmentUsesTypedScopePrincipalAndPeriodWithoutASecondRevocationAuthority() throws Exception {
        assertEquals(predecessorAssignment,retainedAssignment());
        try (var connection=fixtures.app(); var statement=connection.createStatement(); var row=statement.executeQuery(
                "SELECT count(*) FROM information_schema.columns WHERE table_schema=current_schema() "
                + "AND table_name='identity_role_assignment' AND column_name IN ('scope_kind','project_id','principal_group_id',"
                + "'effective_from','effective_until','ended_by','end_reason','version')")) {
            assertTrue(row.next());
            assertEquals(8,row.getInt(1),"Extend the existing exact assignment, not a separately evaluated mirror");
        }
    }

    private String retainedAssignment() throws Exception {
        try (var connection=fixtures.app(); var query=connection.prepareStatement(
                "SELECT principal_actor_id||'|'||role_version_id||'|'||organization_id||'|'||assigned_by||'|'||reason||'|'||assigned_at||'|'||revoked_at "
                + "FROM identity_role_assignment WHERE assignment_id=?")) {
            query.setObject(1,revokedAssignment);
            try(var row=query.executeQuery()) { assertTrue(row.next()); return row.getString(1); }
        }
    }

    @Test void anOrganizationOnlyRoleCannotBeStoredAsAProjectAssignment() throws Exception {
        try(var connection=fixtures.migrator()) {
            connection.setAutoCommit(false);
            try {
                var project=java.util.UUID.randomUUID();
                execute(connection,"INSERT INTO project(project_id,organization_id,display_name,created_by) VALUES (?,?,'Synthetic profile target',?)",
                        project,legacy.organizationId(),legacy.actorId());
                var failure=assertThrows(java.sql.SQLException.class,()->execute(connection,
                        "INSERT INTO identity_role_assignment(assignment_id,principal_actor_id,role_version_id,organization_id,assigned_by,reason,scope_kind,project_id) "
                        + "VALUES (?,?,'9d80f77e-85a6-4c12-a72d-8ef6b7e0a002',?,?,'Synthetic invalid profile','PROJECT',?)",
                        java.util.UUID.randomUUID(),legacy.actorId(),legacy.organizationId(),legacy.actorId(),project));
                assertEquals("23514",failure.getSQLState());
            } finally { connection.rollback(); }
        }
    }

    @Test void applicationCannotWriteProtectedStateDirectlyOrBecomeTheMigrator() throws Exception {
        var columns=Map.ofEntries(Map.entry("project","version"),Map.entry("project_membership","version"),
                Map.entry("business_group","version"),Map.entry("group_membership","version"),
                Map.entry("identity_role_assignment","version"),Map.entry("permission_registry","owner_name"),
                Map.entry("identity_role_definition","display_name"),Map.entry("identity_role_version_profile","content_digest"),
                Map.entry("identity_role_candidate","version"),Map.entry("identity_role_candidate_permission","permission_code"));
        for(var table:columns.entrySet()) {
            assertAppRefused("UPDATE "+table.getKey()+" SET "+table.getValue()+"="+table.getValue()+" WHERE FALSE");
            assertAppRefused("DELETE FROM "+table.getKey()+" WHERE FALSE");
            assertAppRefused("TRUNCATE "+table.getKey());
        }
        assertAppRefused("SET ROLE idea_ddm_migrator");
        assertAppRefused("INSERT INTO identity_role_version(role_version_id,role_code,version) VALUES ('00000000-0000-4000-8000-000000000046','synthetic-unapproved',1)");
    }

    @Test void guardFunctionsPinTheirOwnedSchemaAndHaveNoPublicExecute() throws Exception {
        try(var connection=fixtures.app(); var statement=connection.createStatement(); var rows=statement.executeQuery(
                "SELECT p.proname,p.prosecdef,p.proconfig,current_schema(),"
                + "EXISTS(SELECT 1 FROM aclexplode(coalesce(p.proacl,acldefault('f',p.proowner))) a WHERE a.grantee=0 AND a.privilege_type='EXECUTE') "
                + "FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace WHERE n.nspname=current_schema() "
                + "AND p.proname IN ('validate_assignment_profile','reject_sealed_role_permission_insert')")) {
            int count=0;
            while(rows.next()) {
                count++;
                assertFalse(rows.getBoolean(2),"Validation trigger is not an authorization SECURITY DEFINER shortcut");
                assertEquals("search_path=pg_catalog, "+rows.getString(4),((String[])rows.getArray(3).getArray())[0]);
                assertFalse(rows.getBoolean(5));
            }
            assertEquals(2,count);
        }
    }

    @Test void predecessorFlywayChecksumsRemainIdenticalAndRepeatHasNoNewMigration() throws Exception {
        var after=migrationChecksums();
        assertEquals(11,after.size());
        for(var entry:predecessorChecksums.entrySet()) assertEquals(entry.getValue(),after.get(entry.getKey()));
        assertEquals(0,fixtures.migrateSuccessor());
    }

    @Test void regrantHasANewIdentityWhileRevokedHistoryStaysTerminated() throws Exception {
        try(var connection=fixtures.app()) {
            connection.setAutoCommit(false);
            try {
                var regrant=java.util.UUID.randomUUID();
                var sql="INSERT INTO identity_role_assignment(assignment_id,principal_actor_id,role_version_id,organization_id,assigned_by,reason) "
                        + "VALUES (?,?,'9d80f77e-85a6-4c12-a72d-8ef6b7e0a002',?,?,'Synthetic explicit regrant')";
                execute(connection,sql,regrant,legacy.actorId(),legacy.organizationId(),legacy.actorId());
                assertNotEquals(revokedAssignment,regrant);
                var duplicate=assertThrows(java.sql.SQLException.class,()->execute(connection,sql,
                        java.util.UUID.randomUUID(),legacy.actorId(),legacy.organizationId(),legacy.actorId()));
                assertEquals("23505",duplicate.getSQLState());
            } finally { connection.rollback(); }
        }
        assertEquals(predecessorAssignment,retainedAssignment());
        try(var connection=fixtures.app(); var query=connection.prepareStatement(
                "SELECT scope_kind,effective_from=assigned_at,revoked_at IS NOT NULL,ended_by,version "
                + "FROM identity_role_assignment WHERE assignment_id=?")) {
            query.setObject(1,revokedAssignment);
            try(var row=query.executeQuery()) {
                assertTrue(row.next()); assertEquals("ORGANIZATION",row.getString(1));
                assertTrue(row.getBoolean(2)); assertTrue(row.getBoolean(3));
                assertNull(row.getObject(4),"Do not invent an unknown historical revoker"); assertEquals(1,row.getLong(5));
            }
        }
    }

    @Test void groupMembershipCannotClaimADifferentProjectOrOrganizationPair() throws Exception {
        try(var connection=fixtures.migrator()) {
            connection.setAutoCommit(false);
            try {
                var first=java.util.UUID.randomUUID(); var second=java.util.UUID.randomUUID(); var group=java.util.UUID.randomUUID();
                for(var project:java.util.List.of(first,second)) execute(connection,
                        "INSERT INTO project(project_id,organization_id,display_name,created_by) VALUES (?,?,'Synthetic structural scope',?)",
                        project,legacy.organizationId(),legacy.actorId());
                execute(connection,"INSERT INTO business_group(group_id,project_id,organization_id,display_name,created_by) VALUES (?,?,?,'Synthetic Group',?)",
                        group,first,legacy.organizationId(),legacy.actorId());
                var mismatch=assertThrows(java.sql.SQLException.class,()->execute(connection,
                        "INSERT INTO group_membership(membership_id,group_id,project_id,organization_id,actor_id,effective_from,reason,created_by) "
                        + "VALUES (?,?,?,?,?,CURRENT_TIMESTAMP,'Synthetic wrong Project',?)",
                        java.util.UUID.randomUUID(),group,second,legacy.organizationId(),legacy.actorId(),legacy.actorId()));
                assertEquals("23503",mismatch.getSQLState());
            } finally { connection.rollback(); }
        }
    }

    @Test void activatedRoleContentCannotBeUpdatedOrDeletedEvenByItsDatabaseOwner() throws Exception {
        for(var sql:java.util.List.of("UPDATE identity_role_version SET version=version WHERE FALSE",
                "UPDATE identity_role_version_profile SET content_digest=content_digest WHERE FALSE",
                "DELETE FROM identity_role_version_profile WHERE FALSE", "UPDATE permission_registry SET owner_name=owner_name WHERE FALSE")) {
            try(var connection=fixtures.migrator(); var statement=connection.createStatement()) {
                // A row-level legacy trigger needs a real row; new profile/registry guards are statement-level.
                var actual=sql.equals("UPDATE identity_role_version SET version=version WHERE FALSE")
                        ? "UPDATE identity_role_version SET version=version WHERE role_code='super-administrator' AND version=1" : sql;
                var failure=assertThrows(java.sql.SQLException.class,()->statement.executeUpdate(actual));
                assertEquals("42501",failure.getSQLState());
            }
        }
    }

    @Test void anUnsealedIncompleteRoleCannotCommit() throws Exception {
        try(var connection=fixtures.migrator()) {
            connection.setAutoCommit(false);
            try {
                execute(connection,"INSERT INTO identity_role_version(role_version_id,role_code,version) VALUES (?,'account-administrator',999)",java.util.UUID.randomUUID());
                var failure=assertThrows(java.sql.SQLException.class,connection::commit);
                assertEquals("23503",failure.getSQLState());
            } finally { connection.rollback(); }
        }
    }

    @Test void immutableV1ThroughV10ResourcesMatchTheAcceptedRawByteBaseline() throws Exception {
        var hashes=Map.ofEntries(
                Map.entry("V1__ph1_foundation.sql","1a15298354951ac975201d6a0b12691d69d957386aebc3083c7ebe9890de56d4"),
                Map.entry("V2__identity_administration.sql","55b48840b5455f0aa66a18d4ec1b4c9a2f077cdb70a1ad4c22ded2181e13ff91"),
                Map.entry("V3__account_administration.sql","a17f1ccbcba5da62031bf28eb335c2ddc9e721058e35ed7496b902e73d5e0946"),
                Map.entry("V4__native_http_sessions.sql","be43f6d2800b90f09a235fb58ff95e78e2980052f61581969dd6b01698333221"),
                Map.entry("V5__first_credential_setup.sql","38d6d292e4c5622e25515b3a149144814de511ae2ee440bc715ad63e8a4edf1e"),
                Map.entry("V6__credential_reset.sql","1c5f9ae4e222ca0d7921d489594101a00e525b1051a3154a1588aca86405e421"),
                Map.entry("V7__bounded_login_failures.sql","36a1fb5d6b9b42589d7b03d6538b50a602baf0195a2c2a50883c49fd7562a540"),
                Map.entry("V8__owner_committed_event_foundation.sql","1ecd0ef59327bcfff1a9d3eb87aa4a1f67221564d4c58a4e9df64cac9d0d5272"),
                Map.entry("V9__exact_transfer_grant_scope.sql","1479e8ebd18969ec6102b92b81a3192e8392fa966bb369bfad7c43a8740144ed"),
                Map.entry("V10__retained_receipt_evidence.sql","0e5a26a03bc1b52065305a8f774da85d0c1728f5540a59389a2e9cc7881ae19b"));
        for(var file:hashes.entrySet()) {
            try(var resource=getClass().getResourceAsStream("/db/migration/"+file.getKey())) {
                assertNotNull(resource);
                assertEquals(file.getValue(),java.util.HexFormat.of().formatHex(java.security.MessageDigest.getInstance("SHA-256").digest(resource.readAllBytes())),file.getKey());
            }
        }
    }

    private void assertAppRefused(String sql) throws Exception {
        try(var connection=fixtures.app(); var statement=connection.createStatement()) {
            var failure=assertThrows(java.sql.SQLException.class,()->statement.execute(sql));
            assertEquals("42501",failure.getSQLState(),sql);
        }
    }

    @Test void membershipTerminationCannotOmitItsRequiredReason() throws Exception {
        for(var table:java.util.List.of("project_membership","group_membership")) {
            try(var connection=fixtures.migrator()) {
                connection.setAutoCommit(false);
                try {
                    var project=java.util.UUID.randomUUID(); var group=java.util.UUID.randomUUID();
                    execute(connection,"INSERT INTO project(project_id,organization_id,display_name,created_by) VALUES (?,?,'Synthetic end metadata target',?)",
                            project,legacy.organizationId(),legacy.actorId());
                    execute(connection,"INSERT INTO business_group(group_id,project_id,organization_id,display_name,created_by) VALUES (?,?,?,'Synthetic end Group',?)",
                            group,project,legacy.organizationId(),legacy.actorId());
                    var sql="INSERT INTO "+table+"(membership_id,project_id,organization_id,actor_id,effective_from,reason,created_by,ended_at,ended_by"
                            +(table.equals("group_membership")?",group_id":"")+") VALUES (?,?,?,?,CURRENT_TIMESTAMP,'Synthetic original reason',?,CURRENT_TIMESTAMP,?"
                            +(table.equals("group_membership")?",?":"")+")";
                    var values=new java.util.ArrayList<Object>(java.util.List.of(java.util.UUID.randomUUID(),project,legacy.organizationId(),legacy.actorId(),legacy.actorId(),legacy.actorId()));
                    if(table.equals("group_membership")) values.add(group);
                    var failure=assertThrows(java.sql.SQLException.class,()->execute(connection,sql,values.toArray()));
                    assertEquals("23514",failure.getSQLState());
                } finally { connection.rollback(); }
            }
        }
    }
    private Map<String,Integer> migrationChecksums() throws Exception {
        var checksums=new TreeMap<String,Integer>();
        try(var connection=fixtures.app(); var statement=connection.createStatement(); var rows=statement.executeQuery(
                "SELECT version,checksum FROM flyway_schema_history WHERE version IS NOT NULL AND success")) {
            while(rows.next()) checksums.put(rows.getString(1),rows.getInt(2));
        }
        return checksums;
    }
    private static void execute(java.sql.Connection connection,String sql,Object... values) throws Exception {
        try(var statement=connection.prepareStatement(sql)) {
            for(int i=0;i<values.length;i++) statement.setObject(i+1,values[i]);
            assertEquals(1,statement.executeUpdate());
        }
    }
}
