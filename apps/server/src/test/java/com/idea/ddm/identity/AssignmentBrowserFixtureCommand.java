package com.idea.ddm.identity;

import com.idea.ddm.iam.IamIntegrationFixtures;
import com.idea.ddm.access.AuthorizationPrerequisiteFixture;
import com.idea.ddm.access.AuthorizationDecisionService.Scope;
import com.idea.ddm.project.ProjectPrerequisiteFixture;
import java.nio.file.*;
import java.nio.file.attribute.PosixFilePermissions;
import java.time.Instant;
import java.util.*;
import tools.jackson.databind.json.JsonMapper;

/** Migrator-only synthetic prerequisites/oracle; never shipped or a Custom Role publication path. */
public final class AssignmentBrowserFixtureCommand {
    public static void main(String[] args)throws Exception {
        if(args.length!=1||!Set.of("seed","verify").contains(args[0]))throw new SecurityException("Fixture mode");
        var root=Path.of(ProjectBrowserFixtureCommand.required("IDEA_IAM_BROWSER_ROOT"));
        if(!root.toRealPath().equals(root)||!root.toString().matches("/home/phuclam/idea-iam-ui-20261007-46/run-assignment-qualification-[0-9]{2}"))throw new SecurityException("Fixture root");
        var fixture=new IamIntegrationFixtures();var file=root.resolve("fixture.private.json");var mapper=JsonMapper.builder().build();
        if(args[0].equals("verify")){
            var values=mapper.readTree(Files.readString(file));
            if(!ProjectBrowserFixtureCommand.required("IDEA_IAM_SOURCE_SHA").equals(values.path("source").asString()))throw new SecurityException("Fixture source");
            var member=UUID.fromString(values.path("memberActorId").asString());var admin=UUID.fromString(values.path("adminActorId").asString());
            try(var c=fixture.app();var s=c.createStatement()){
                expect(s,"SELECT count(*) FROM assignment_owner_operation",9);
                expect(s,"SELECT count(*) FROM access_policy_owner_outcome WHERE operation_id IN(SELECT operation_id FROM assignment_owner_operation) AND outcome='ACCEPTED'",8);
                expect(s,"SELECT count(*) FROM access_policy_owner_outcome WHERE operation_id IN(SELECT operation_id FROM assignment_owner_operation) AND outcome='REFUSED'",1);
                expect(s,"SELECT count(*) FROM assignment_authorization_evidence WHERE operation_id IN(SELECT operation_id FROM assignment_owner_operation)",18);
                expect(s,"SELECT count(*) FROM audit_evidence WHERE operation_id IN(SELECT operation_id FROM assignment_owner_operation)",9);
                expect(s,"SELECT count(*) FROM assignment_owner_operation o WHERE NOT EXISTS(SELECT 1 FROM audit_evidence a WHERE a.operation_id=o.operation_id)",0);
                expect(s,"SELECT count(*) FROM identity_role_assignment a JOIN identity_role_version v USING(role_version_id) WHERE a.principal_actor_id='"+member+"' AND v.role_code='account-administrator' AND v.version IN(2,3) AND a.revoked_at IS NULL",2);
                expect(s,"SELECT count(*) FROM identity_role_assignment WHERE principal_group_id IS NOT NULL",1);
                expect(s,"SELECT count(*) FROM project_membership WHERE actor_id='"+member+"'",1);
                expect(s,"SELECT count(*) FROM group_membership WHERE actor_id='"+member+"'",1);
                expect(s,"SELECT count(*) FROM project_membership WHERE actor_id='"+admin+"'",0);
            }
            System.out.println("ASSIGNMENT_BROWSER_DB=PASS;ACCEPTED=8;REFUSED=1;EVIDENCE=18;AUDIT=9;ACTIVE_INDEPENDENT_AA=2;GROUP_PRINCIPAL=1;IMPLICIT_MEMBERSHIP=0;RETRY_DUPLICATES=0");return;
        }
        if(Files.exists(file))throw new SecurityException("Reused fixture");fixture.createSchema();
        var admin=fixture.identity(IamIntegrationFixtures.Persona.SUPER);var member=fixture.identity(IamIntegrationFixtures.Persona.LINH);var ordinary=fixture.identity(IamIntegrationFixtures.Persona.ORDINARY);
        var adminPassword=UUID.randomUUID().toString();var memberPassword=UUID.randomUUID().toString();var ordinaryPassword=UUID.randomUUID().toString();
        ProjectBrowserFixtureCommand.seed(fixture,admin,"iam-assignment.admin",adminPassword);
        ProjectBrowserFixtureCommand.seed(fixture,member,"iam-assignment.linh",memberPassword);
        ProjectBrowserFixtureCommand.seed(fixture,ordinary,"iam-assignment.ordinary",ordinaryPassword);
        var rows=new ProjectPrerequisiteFixture(fixture);var project=rows.project(admin);var group=rows.group(project,admin);var now=Instant.now().minusSeconds(60);
        rows.insert("UPDATE project SET display_name=? WHERE project_id=?","Synthetic assignment Project",project.projectId());
        rows.insert("UPDATE business_group SET display_name=? WHERE group_id=?","Synthetic assignment Group",group.groupId());
        rows.projectMembership(project,member,now,null);rows.groupMembership(group,member,now,null);
        var assignments=new AuthorizationPrerequisiteFixture(fixture);var orgScope=Scope.organization(admin.organizationId());
        assignments.actorAssignment(admin,AuthorizationPrerequisiteFixture.SUPER_V2,orgScope,now,null);
        assignments.actorAssignment(admin,AuthorizationPrerequisiteFixture.AA_V3,orgScope,now,null);
        assignments.actorAssignment(admin,AuthorizationPrerequisiteFixture.PA_V1,orgScope,now,null);
        var businessRole=assignments.participantRole(Scope.project(admin.organizationId(),project.projectId()));
        var values=new LinkedHashMap<String,Object>();values.put("source",ProjectBrowserFixtureCommand.required("IDEA_IAM_SOURCE_SHA"));values.put("schema",ProjectBrowserFixtureCommand.required("IDEA_IAM_TEST_SCHEMA"));values.put("organizationId",admin.organizationId());
        values.put("adminActorId",admin.actorId());values.put("adminLogin","iam-assignment.admin");values.put("adminPassword",adminPassword);
        values.put("memberActorId",member.actorId());values.put("memberName",member.displayName());values.put("memberLogin","iam-assignment.linh");values.put("memberPassword",memberPassword);
        values.put("ordinaryLogin","iam-assignment.ordinary");values.put("ordinaryPassword",ordinaryPassword);
        values.put("projectId",project.projectId());values.put("groupId",group.groupId());values.put("businessRoleId",businessRole);
        Files.createFile(file,PosixFilePermissions.asFileAttribute(PosixFilePermissions.fromString("rw-------")));
        Files.writeString(file,mapper.writeValueAsString(values));System.out.println("ASSIGNMENT_BROWSER_FIXTURE=READY;SYNTHETIC_ONLY=true;PRIVATE_FILE_MODE=600;PRODUCT_CUSTOM_ROLE_PUBLICATION=NOT_RUN");
    }
    private static void expect(java.sql.Statement s,String sql,long count)throws Exception{try(var r=s.executeQuery(sql)){if(!r.next()||r.getLong(1)!=count)throw new IllegalStateException("Assignment fixture oracle");}}
}
