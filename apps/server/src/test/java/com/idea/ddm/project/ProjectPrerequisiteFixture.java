package com.idea.ddm.project;

import com.idea.ddm.iam.IamIntegrationFixtures;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.UUID;

/** Named synthetic prerequisite rows; never qualification of Project/Group owner commands. */
public final class ProjectPrerequisiteFixture {
    public record Project(UUID projectId, UUID organizationId) {}
    public record Group(UUID groupId, Project project) {}
    private final IamIntegrationFixtures fixtures;

    public ProjectPrerequisiteFixture(IamIntegrationFixtures fixtures) { this.fixtures = fixtures; }

    public Project project(IamIntegrationFixtures.Identity creator) throws Exception {
        var project = new Project(UUID.randomUUID(), creator.organizationId());
        insert("INSERT INTO project(project_id,organization_id,display_name,created_by) VALUES (?,?,?,?)",
                project.projectId(), project.organizationId(), "Synthetic Project", creator.actorId());
        return project;
    }

    public Group group(Project project, IamIntegrationFixtures.Identity creator) throws Exception {
        var group = new Group(UUID.randomUUID(), project);
        insert("INSERT INTO business_group(group_id,project_id,organization_id,display_name,created_by) VALUES (?,?,?,?,?)",
                group.groupId(), project.projectId(), project.organizationId(), "Synthetic Group", creator.actorId());
        return group;
    }

    public UUID projectMembership(Project project, IamIntegrationFixtures.Identity member, Instant from, Instant until) throws Exception {
        var id = UUID.randomUUID();
        insert("INSERT INTO project_membership(membership_id,project_id,organization_id,actor_id,effective_from,effective_until,reason,created_by) VALUES (?,?,?,?,?,?,?,?)",
                id, project.projectId(), project.organizationId(), member.actorId(), from, until, "Synthetic participation", member.actorId());
        return id;
    }

    public UUID groupMembership(Group group, IamIntegrationFixtures.Identity member, Instant from, Instant until) throws Exception {
        var id = UUID.randomUUID();
        insert("INSERT INTO group_membership(membership_id,group_id,project_id,organization_id,actor_id,effective_from,effective_until,reason,created_by) VALUES (?,?,?,?,?,?,?,?,?)",
                id, group.groupId(), group.project().projectId(), group.project().organizationId(), member.actorId(), from, until,
                "Synthetic Group participation", member.actorId());
        return id;
    }

    /** Only migrator-owned test prerequisites, not a product state-write port. */
    public void insert(String sql, Object... values) throws Exception {
        try (var connection = fixtures.migrator(); var statement = connection.prepareStatement(sql)) {
            for (int i = 0; i < values.length; i++) {
                statement.setObject(i + 1, values[i] instanceof Instant instant ? Timestamp.from(instant) : values[i]);
            }
            if (statement.executeUpdate() != 1) throw new IllegalStateException("Synthetic prerequisite row missing");
        }
    }
}
