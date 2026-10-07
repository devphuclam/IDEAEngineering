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

    @BeforeAll void migrateOwnedSuccessor() throws Exception {
        fixtures.createSchema("10");
        predecessorRoles = roleContent();
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
    private static void execute(java.sql.Connection connection,String sql,Object... values) throws Exception {
        try(var statement=connection.prepareStatement(sql)) {
            for(int i=0;i<values.length;i++) statement.setObject(i+1,values[i]);
            assertEquals(1,statement.executeUpdate());
        }
    }
}
