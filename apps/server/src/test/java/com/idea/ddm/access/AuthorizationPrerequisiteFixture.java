package com.idea.ddm.access;

import com.idea.ddm.iam.IamIntegrationFixtures;
import com.idea.ddm.project.ProjectPrerequisiteFixture;
import java.time.Instant;
import java.util.UUID;

/** Migrator-only prerequisites do not implement assignment delegation or Custom Role activation. */
public final class AuthorizationPrerequisiteFixture {
    public static final UUID SUPER_V1 = UUID.fromString("9d80f77e-85a6-4c12-a72d-8ef6b7e0a001");
    public static final UUID AA_V1 = UUID.fromString("9d80f77e-85a6-4c12-a72d-8ef6b7e0a002");
    public static final UUID AA_V2 = UUID.fromString("9d80f77e-85a6-4c12-a72d-8ef6b7e0a003");
    public static final UUID AA_V3 = UUID.fromString("9d80f77e-85a6-4c12-a72d-8ef6b7e0a004");
    public static final UUID SUPER_V2 = UUID.fromString("9d80f77e-85a6-4c12-a72d-8ef6b7e0a005");
    public static final UUID PRA_V1 = UUID.fromString("9d80f77e-85a6-4c12-a72d-8ef6b7e0a006");
    public static final UUID PA_V1 = UUID.fromString("9d80f77e-85a6-4c12-a72d-8ef6b7e0a007");
    public static final UUID AUDIT_V1 = UUID.fromString("9d80f77e-85a6-4c12-a72d-8ef6b7e0a008");
    private final ProjectPrerequisiteFixture rows;

    public AuthorizationPrerequisiteFixture(IamIntegrationFixtures fixtures) { rows = new ProjectPrerequisiteFixture(fixtures); }

    public UUID actorAssignment(IamIntegrationFixtures.Identity identity, UUID role, AuthorizationDecisionService.Scope scope,
            Instant from, Instant until) throws Exception {
        var id = UUID.randomUUID();
        rows.insert("INSERT INTO identity_role_assignment(assignment_id,principal_actor_id,role_version_id,organization_id,"
                + "scope_kind,project_id,assigned_by,reason,effective_from,effective_until) VALUES (?,?,?,?,?,?,?,?,?,?)",
                id, identity.actorId(), role, scope.organizationId(), scope.kind().name(), scope.projectId(),
                identity.actorId(), "Synthetic prerequisite assignment", from, until);
        return id;
    }
}
