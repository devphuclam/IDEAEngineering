package com.idea.ddm.iam;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;

/** Approved relational storage/privilege seam; no Project or RBAC command qualification. */
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class IamSchemaPrivilegeTest {
    private final IamIntegrationFixtures fixtures = new IamIntegrationFixtures();

    @BeforeAll void migrateOwnedSuccessor() throws Exception {
        fixtures.createSchema("10");
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
}
