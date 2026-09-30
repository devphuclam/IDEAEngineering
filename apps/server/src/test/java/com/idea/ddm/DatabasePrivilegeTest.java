package com.idea.ddm;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfEnvironmentVariable;

@EnabledIfEnvironmentVariable(named = "IDEA_F02_TEST_DATABASE_NAME", matches = "idea_ddm_f02_[a-z0-9_]+")
class DatabasePrivilegeTest {
    @Test
    void migrationRoleOwnsBaselineAndApplicationRoleHasNoDdlAuthority() throws Exception {
        DatabasePrivilegeAssertions.assertMigrationRoleOwnsBaselineAndApplicationCannotCreateObjects();
    }
}
