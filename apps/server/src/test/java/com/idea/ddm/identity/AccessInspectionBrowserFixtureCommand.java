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

/** Synthetic preexisting paths, no operation replay or product-role publication claim. */
public final class AccessInspectionBrowserFixtureCommand {
    public static void main(String[] args)throws Exception{
        if(args.length!=1||!Set.of("seed","verify").contains(args[0]))throw new SecurityException("Fixture mode");
        var root=Path.of(ProjectBrowserFixtureCommand.required("IDEA_IAM_BROWSER_ROOT"));if(!root.toRealPath().equals(root)||!root.toString().matches("/home/phuclam/idea-iam-ui-20261007-46/run-(inspection|final)-qualification-[0-9]{2}"))throw new SecurityException("Fixture root");
        var rows=new IamIntegrationFixtures();var file=root.resolve("fixture.private.json");var json=JsonMapper.builder().build();
        if(args[0].equals("verify")){
            var values=json.readTree(Files.readString(file));if(!ProjectBrowserFixtureCommand.required("IDEA_IAM_SOURCE_SHA").equals(values.path("source").asString()))throw new SecurityException("Fixture lineage");
            try(var c=rows.app();var q=c.createStatement()){
                CustomRoleBrowserFixtureCommand.expect(q,"SELECT count(*) FROM role_definition_owner_operation",0);CustomRoleBrowserFixtureCommand.expect(q,"SELECT count(*) FROM assignment_owner_operation",0);
                CustomRoleBrowserFixtureCommand.expect(q,"SELECT count(*) FROM project_owner_outcome",1);CustomRoleBrowserFixtureCommand.expect(q,"SELECT count(*) FROM audit_evidence WHERE operation_id IN(SELECT operation_id FROM project_owner_outcome)",1);
                CustomRoleBrowserFixtureCommand.expect(q,"SELECT count(*) FROM identity_role_assignment",5);CustomRoleBrowserFixtureCommand.expect(q,"SELECT count(*) FROM owner_committed_event",0);
            }
            System.out.println("INSPECTOR_BROWSER_DB=PASS;OWNER_PROJECT=1;REQUIRED_PROJECT_AUDIT=1;ASSIGNMENT_ROWS=5;INSPECTION_OWNER_MUTATIONS=0;INSPECTION_AUDIT=0;EVENT=0;CANONICAL_REPLAY=NOT_INVOKED");return;
        }
        if(Files.exists(file))throw new SecurityException("Reused private fixture");rows.createSchema();var admin=rows.identity(IamIntegrationFixtures.Persona.PRA);var member=rows.identity(IamIntegrationFixtures.Persona.LINH);var ordinary=rows.identity(IamIntegrationFixtures.Persona.ORDINARY);
        var a=UUID.randomUUID().toString();var m=UUID.randomUUID().toString();var o=UUID.randomUUID().toString();ProjectBrowserFixtureCommand.seed(rows,admin,"iam-inspect.admin",a);ProjectBrowserFixtureCommand.seed(rows,member,"iam-inspect.linh",m);ProjectBrowserFixtureCommand.seed(rows,ordinary,"iam-inspect.ordinary",o);
        var p=new ProjectPrerequisiteFixture(rows);var project=p.project(admin);var group=p.group(project,admin);var now=Instant.now().minusSeconds(60);p.projectMembership(project,member,now,null);p.groupMembership(group,member,now,null);
        var assignments=new AuthorizationPrerequisiteFixture(rows);var org=Scope.organization(admin.organizationId());assignments.actorAssignment(admin,AuthorizationPrerequisiteFixture.PRA_V1,org,now,null);assignments.actorAssignment(admin,AuthorizationPrerequisiteFixture.PA_V1,org,now,null);assignments.actorAssignment(admin,AuthorizationPrerequisiteFixture.AA_V3,org,now,null);
        var ps=Scope.project(admin.organizationId(),project.projectId());var role=assignments.participantRole(ps);var direct=assignments.actorAssignment(member,role,ps,now,null);var grouped=assignments.groupAssignment(admin,role,group,now,null);
        var values=new LinkedHashMap<String,Object>();values.put("source",ProjectBrowserFixtureCommand.required("IDEA_IAM_SOURCE_SHA"));values.put("schema",ProjectBrowserFixtureCommand.required("IDEA_IAM_TEST_SCHEMA"));values.put("organizationId",admin.organizationId());values.put("adminActorId",admin.actorId());values.put("adminLogin","iam-inspect.admin");values.put("adminPassword",a);values.put("memberActorId",member.actorId());values.put("memberLogin","iam-inspect.linh");values.put("memberPassword",m);values.put("ordinaryLogin","iam-inspect.ordinary");values.put("ordinaryPassword",o);values.put("projectId",project.projectId());values.put("directAssignmentId",direct);values.put("groupAssignmentId",grouped);
        Files.createFile(file,PosixFilePermissions.asFileAttribute(PosixFilePermissions.fromString("rw-------")));Files.writeString(file,json.writeValueAsString(values));System.out.println("INSPECTOR_FIXTURE=READY;SYNTHETIC_ONLY=true;PRIVATE_FILE_MODE=600;CURRENT_OWNER_OPERATION=NOT_RUN");
    }
}
