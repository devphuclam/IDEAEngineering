package com.idea.ddm.identity;

import com.idea.ddm.iam.IamIntegrationFixtures;
import com.idea.ddm.access.AuthorizationPrerequisiteFixture;
import com.idea.ddm.access.AuthorizationDecisionService;
import com.idea.ddm.project.ProjectPrerequisiteFixture;
import java.nio.file.*;
import java.nio.file.attribute.PosixFilePermissions;
import java.time.Instant;
import java.util.*;
import tools.jackson.databind.json.JsonMapper;

/** Test-only synthetic fixture/oracle, excluded from the executable application. No fixture route. */
public final class ProjectBrowserFixtureCommand {
    public static void main(String[] args)throws Exception{
        if(args.length!=1||!Set.of("seed","verify").contains(args[0]))throw new SecurityException("Fixture mode");
        var root=Path.of(required("IDEA_IAM_BROWSER_ROOT"));
        if(!root.toRealPath().equals(root)||!root.toString().matches("/home/phuclam/idea-iam-ui-20261007-46/run-project-qualification-[0-9]{2}"))throw new SecurityException("Fixture root");
        var fixture=new IamIntegrationFixtures();var privateFile=root.resolve("fixture.private.json");
        if(args[0].equals("verify")){
            var values=JsonMapper.builder().build().readTree(Files.readString(privateFile));
            if(!required("IDEA_IAM_SOURCE_SHA").equals(values.path("source").asString()))throw new SecurityException("Fixture source");
            var actor=UUID.fromString(values.path("adminActorId").asString());
            try(var c=fixture.app();var s=c.createStatement()){
                expect(s,"SELECT count(*) FROM project WHERE display_name='Synthetic browser Project'",1);
                expect(s,"SELECT count(*) FROM project WHERE display_name='Synthetic lost Project'",1);
                expect(s,"SELECT count(*) FROM project_membership WHERE actor_id='"+actor+"'",0);
                expect(s,"SELECT count(*) FROM identity_role_assignment WHERE project_id NOT IN (SELECT project_id FROM project WHERE display_name='Synthetic scoped Project')",0);
                expect(s,"SELECT count(*) FROM project_membership m JOIN project p USING(project_id) WHERE p.display_name='Synthetic browser Project'",2);
                expect(s,"SELECT count(*) FROM project_membership m JOIN project p USING(project_id) WHERE p.display_name='Synthetic browser Project' AND m.ended_at IS NOT NULL",1);
                expect(s,"SELECT count(*) FROM group_membership m JOIN business_group g USING(group_id) WHERE g.display_name='Synthetic browser Group' AND m.ended_at IS NOT NULL",1);
                expect(s,"SELECT count(*) FROM project_owner_outcome o WHERE o.outcome='ACCEPTED' AND NOT EXISTS(SELECT 1 FROM audit_evidence a WHERE a.operation_id=o.operation_id AND a.outcome='ACCEPTED')",0);
                expect(s,"SELECT count(*) FROM (SELECT operation_id FROM project_owner_outcome GROUP BY operation_id HAVING count(*)>1) duplicate",0);
            }
            System.out.println("PROJECT_BROWSER_DB=PASS;CREATOR_MEMBERSHIP=0;IMPLICIT_ASSIGNMENTS=0;PROJECT_HISTORY=2;GROUP_ENDED_HISTORY=1;RETRY_DUPLICATES=0");return;
        }
        if(Files.exists(privateFile))throw new SecurityException("Reused fixture");fixture.createSchema();
        var admin=fixture.identity(IamIntegrationFixtures.Persona.PA_ORGANIZATION);var scoped=fixture.identity(IamIntegrationFixtures.Persona.PA_PROJECT);var member=fixture.identity(IamIntegrationFixtures.Persona.LINH);
        var adminPassword=UUID.randomUUID().toString();var scopedPassword=UUID.randomUUID().toString();var memberPassword=UUID.randomUUID().toString();
        seed(fixture,admin,"iam-project.admin",adminPassword);seed(fixture,scoped,"iam-project.scoped",scopedPassword);seed(fixture,member,"iam-project.linh",memberPassword);
        var prerequisites=new ProjectPrerequisiteFixture(fixture);var scopedProject=prerequisites.project(scoped);var hidden=prerequisites.project(admin);
        prerequisites.insert("UPDATE project SET display_name=? WHERE project_id=?","Synthetic scoped Project",scopedProject.projectId());
        prerequisites.insert("UPDATE project SET display_name=? WHERE project_id=?","Synthetic hidden Project",hidden.projectId());
        var assignment=new AuthorizationPrerequisiteFixture(fixture);
        assignment.actorAssignment(admin,AuthorizationPrerequisiteFixture.PA_V1,AuthorizationDecisionService.Scope.organization(admin.organizationId()),Instant.now().minusSeconds(60),null);
        assignment.actorAssignment(scoped,AuthorizationPrerequisiteFixture.PA_V1,AuthorizationDecisionService.Scope.project(scoped.organizationId(),scopedProject.projectId()),Instant.now().minusSeconds(60),null);
        var values=new LinkedHashMap<String,Object>();values.put("source",required("IDEA_IAM_SOURCE_SHA"));values.put("schema",required("IDEA_IAM_TEST_SCHEMA"));values.put("organizationId",admin.organizationId());
        values.put("adminActorId",admin.actorId());values.put("adminLogin","iam-project.admin");values.put("adminPassword",adminPassword);
        values.put("scopedLogin","iam-project.scoped");values.put("scopedPassword",scopedPassword);values.put("scopedProjectId",scopedProject.projectId());values.put("hiddenProjectId",hidden.projectId());
        values.put("memberActorId",member.actorId());values.put("memberName",member.displayName());values.put("memberLogin","iam-project.linh");values.put("memberPassword",memberPassword);
        Files.createFile(privateFile,PosixFilePermissions.asFileAttribute(PosixFilePermissions.fromString("rw-------")));
        Files.writeString(privateFile,JsonMapper.builder().build().writeValueAsString(values));System.out.println("PROJECT_BROWSER_FIXTURE=READY;SYNTHETIC_ONLY=true;PRIVATE_FILE_MODE=600");
    }
    static void seed(IamIntegrationFixtures fixture,IamIntegrationFixtures.Identity id,String login,String password)throws Exception{
        var prerequisite=new ProjectPrerequisiteFixture(fixture);
        prerequisite.insert("INSERT INTO actor(actor_id,display_name) VALUES (?,?)",id.actorId(),id.displayName());
        prerequisite.insert("INSERT INTO idea_account(account_id,actor_id,organization_id,status) VALUES (?,?,?,'ACTIVE')",id.accountId(),id.actorId(),id.organizationId());
        prerequisite.insert("INSERT INTO login_identity(login_identity_id,account_id,login_identifier,normalized_login_identifier,password_verifier) VALUES (?,?,?,?,?)",id.loginIdentityId(),id.accountId(),login,login,new NativePasswordVerifier().encodeNewCredential(password));
    }
    static void expect(java.sql.Statement s,String sql,long expected)throws Exception{try(var r=s.executeQuery(sql)){if(!r.next()||r.getLong(1)!=expected)throw new IllegalStateException("Project fixture oracle");}}
    static String required(String name){var value=System.getenv(name);if(value==null||value.isBlank())throw new SecurityException("Missing fixture input");return value;}
}
