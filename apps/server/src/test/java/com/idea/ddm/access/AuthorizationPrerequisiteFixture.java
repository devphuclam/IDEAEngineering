package com.idea.ddm.access;

import com.idea.ddm.iam.IamIntegrationFixtures;
import com.idea.ddm.project.ProjectPrerequisiteFixture;
import java.time.Instant;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.HexFormat;
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
    private final IamIntegrationFixtures fixtures;

    public AuthorizationPrerequisiteFixture(IamIntegrationFixtures fixtures) { this.fixtures = fixtures; rows = new ProjectPrerequisiteFixture(fixtures); }

    public UUID actorAssignment(IamIntegrationFixtures.Identity identity, UUID role, AuthorizationDecisionService.Scope scope,
            Instant from, Instant until) throws Exception {
        var id = UUID.randomUUID();
        rows.insert("INSERT INTO identity_role_assignment(assignment_id,principal_actor_id,role_version_id,organization_id,"
                + "scope_kind,project_id,assigned_by,reason,effective_from,effective_until) VALUES (?,?,?,?,?,?,?,?,?,?)",
                id, identity.actorId(), role, scope.organizationId(), scope.kind().name(), scope.projectId(),
                identity.actorId(), "Synthetic prerequisite assignment", from, until);
        return id;
    }

    public UUID groupAssignment(IamIntegrationFixtures.Identity assigner, UUID role, ProjectPrerequisiteFixture.Group group,
            Instant from, Instant until) throws Exception {
        var id = UUID.randomUUID();
        rows.insert("INSERT INTO identity_role_assignment(assignment_id,principal_group_id,role_version_id,organization_id,"
                + "scope_kind,project_id,assigned_by,reason,effective_from,effective_until) VALUES (?,?,?,?,'PROJECT',?,?,?,?,?)",
                id, group.groupId(), role, group.project().organizationId(), group.project().projectId(),
                assigner.actorId(), "Synthetic Group assignment", from, until);
        return id;
    }

    /** Complete immutable content fixture, no product prepare/activate/assignment authority. */
    public UUID participantRole(AuthorizationDecisionService.Scope management) throws Exception {
        var definition = UUID.randomUUID();
        var role = UUID.randomUUID();
        var code = "synthetic-participant-" + UUID.randomUUID();
        var scopes = management.kind() == AuthorizationDecisionService.ScopeKind.PROJECT
                ? new String[] {"PROJECT"} : new String[] {"ORGANIZATION", "PROJECT"};
        var principals = new String[] {"ACTOR", "PROJECT_GROUP"};
        var content = code + "|1|BUSINESS|" + String.join(",", scopes) + "|ACTOR,PROJECT_GROUP|project.read";
        var digest = HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(content.getBytes(StandardCharsets.UTF_8)));
        try (var connection = fixtures.migrator()) {
            connection.setAutoCommit(false);
            execute(connection, "INSERT INTO identity_role_definition(definition_id,role_code,display_name,built_in,"
                    + "management_scope_kind,management_organization_id,management_project_id) VALUES (?,?,?,FALSE,?,?,?)",
                    definition, code, "Synthetic Participant", management.kind().name(), management.organizationId(), management.projectId());
            execute(connection, "INSERT INTO identity_role_version(role_version_id,role_code,version,protected) VALUES (?,?,1,FALSE)", role, code);
            execute(connection, "INSERT INTO identity_role_permission(role_version_id,permission_code) VALUES (?,'project.read')", role);
            execute(connection, "INSERT INTO identity_role_version_profile(role_version_id,definition_id,role_code,classification,"
                    + "scope_kinds,principal_kinds,content_digest) VALUES (?,?,?,'BUSINESS',?,?,?)",
                    role, definition, code, connection.createArrayOf("text", scopes), connection.createArrayOf("text", principals), digest);
            connection.commit();
        }
        return role;
    }

    private static void execute(java.sql.Connection connection, String sql, Object... values) throws Exception {
        try (var statement = connection.prepareStatement(sql)) {
            for (int i = 0; i < values.length; i++) statement.setObject(i + 1, values[i]);
            if (statement.executeUpdate() != 1) throw new IllegalStateException("Synthetic role row missing");
        }
    }
}
