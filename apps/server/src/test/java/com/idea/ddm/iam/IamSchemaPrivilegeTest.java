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

    @BeforeAll void migrateOwnedSuccessor() throws Exception {
        fixtures.createSchema("10");
        predecessorRoles = roleContent();
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
            assertEquals(0, row.getInt(2), "Migration seeds definitions only, never adoption or grants");
            assertEquals(25, row.getInt(3));
        }
    }

    private Map<String,String> roleContent() throws Exception {
        var content = new TreeMap<String,String>();
        try (var connection = fixtures.app(); var statement = connection.createStatement(); var rows = statement.executeQuery(
                "SELECT v.role_code||'@'||v.version,string_agg(p.permission_code,',' ORDER BY p.permission_code) "
                + "FROM identity_role_version v JOIN identity_role_permission p USING(role_version_id) GROUP BY v.role_code,v.version")) {
            while (rows.next()) content.put(rows.getString(1), rows.getString(2));
        }
        return content;
    }
}
