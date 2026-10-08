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

/** Only synthetic preexisting delegation and byte-free DB oracle. Product HTTP publishes all Custom Roles. */
public final class CustomRoleBrowserFixtureCommand {
    public static void main(String[] args)throws Exception{
        if(args.length!=1||!Set.of("seed","verify").contains(args[0]))throw new SecurityException("Fixture mode");
        var root=Path.of(ProjectBrowserFixtureCommand.required("IDEA_IAM_BROWSER_ROOT"));if(!root.toRealPath().equals(root)||!root.toString().matches("/home/phuclam/idea-iam-ui-20261007-46/run-custom-role-qualification-[0-9]{2}"))throw new SecurityException("Fixture root");
        var rows=new IamIntegrationFixtures();var file=root.resolve("fixture.private.json");var json=JsonMapper.builder().build();
        if(args[0].equals("verify")){
            var values=json.readTree(Files.readString(file));if(!ProjectBrowserFixtureCommand.required("IDEA_IAM_SOURCE_SHA").equals(values.path("source").asString()))throw new SecurityException("Fixture lineage");
            try(var c=rows.app();var q=c.createStatement()){
                expect(q,"SELECT count(*) FROM role_definition_owner_operation",7);expect(q,"SELECT count(*) FROM access_policy_owner_outcome WHERE operation_id IN(SELECT operation_id FROM role_definition_owner_operation) AND outcome='ACCEPTED'",6);expect(q,"SELECT count(*) FROM access_policy_owner_outcome WHERE operation_id IN(SELECT operation_id FROM role_definition_owner_operation) AND outcome='REFUSED'",1);
                expect(q,"SELECT count(*) FROM role_definition_authorization_evidence",14);expect(q,"SELECT count(*) FROM audit_evidence WHERE operation_id IN(SELECT operation_id FROM role_definition_owner_operation)",7);
                expect(q,"SELECT count(*) FROM identity_role_definition WHERE NOT built_in",2);expect(q,"SELECT count(*) FROM identity_role_version_profile p JOIN identity_role_definition d USING(definition_id) WHERE NOT d.built_in",3);
                expect(q,"SELECT count(*) FROM assignment_owner_operation",2);expect(q,"SELECT count(*) FROM audit_evidence WHERE operation_id IN(SELECT operation_id FROM assignment_owner_operation)",2);
                expect(q,"SELECT count(*) FROM identity_role_assignment a JOIN identity_role_version_profile p USING(role_version_id) JOIN identity_role_definition d USING(definition_id) WHERE NOT d.built_in AND a.principal_actor_id='"+values.path("memberActorId").asString()+"' AND a.revoked_at IS NULL",1);
                expect(q,"SELECT count(*) FROM identity_role_assignment a JOIN identity_role_version v USING(role_version_id) JOIN identity_role_definition d USING(role_code) WHERE NOT d.built_in AND v.version=1 AND a.revoked_at IS NOT NULL",1);
                expect(q,"SELECT count(*) FROM identity_role_assignment a JOIN identity_role_version v USING(role_version_id) JOIN identity_role_definition d USING(role_code) WHERE NOT d.built_in AND a.principal_actor_id='"+values.path("adminActorId").asString()+"'",0);
            }
            System.out.println("CUSTOM_ROLE_BROWSER_DB=PASS;CUSTOM_ACCEPTED=6;REFUSED=1;CUSTOM_AUDIT=7;AUTHORIZATION_EVIDENCE=14;DEFINITIONS=2;SEALED_VERSIONS=3;EXPLICIT_ASSIGNMENT_TRANSITIONS=2;IMPLICIT_ASSIGNMENTS=0;RETRY_DUPLICATES=0");return;
        }
        if(Files.exists(file))throw new SecurityException("Reused private fixture");rows.createSchema();var admin=rows.identity(IamIntegrationFixtures.Persona.PRA);var member=rows.identity(IamIntegrationFixtures.Persona.LINH);var ordinary=rows.identity(IamIntegrationFixtures.Persona.ORDINARY);
        var a=UUID.randomUUID().toString();var m=UUID.randomUUID().toString();var o=UUID.randomUUID().toString();ProjectBrowserFixtureCommand.seed(rows,admin,"iam-custom.admin",a);ProjectBrowserFixtureCommand.seed(rows,member,"iam-custom.linh",m);ProjectBrowserFixtureCommand.seed(rows,ordinary,"iam-custom.ordinary",o);
        var projects=new ProjectPrerequisiteFixture(rows);var project=projects.project(admin);projects.projectMembership(project,member,Instant.now().minusSeconds(60),null);var assignments=new AuthorizationPrerequisiteFixture(rows);var now=Instant.now().minusSeconds(60);var scope=Scope.organization(admin.organizationId());
        assignments.actorAssignment(admin,AuthorizationPrerequisiteFixture.PRA_V1,scope,now,null);assignments.actorAssignment(admin,AuthorizationPrerequisiteFixture.PA_V1,scope,now,null);assignments.actorAssignment(admin,AuthorizationPrerequisiteFixture.AA_V3,scope,now,null);
        var values=new LinkedHashMap<String,Object>();values.put("source",ProjectBrowserFixtureCommand.required("IDEA_IAM_SOURCE_SHA"));values.put("schema",ProjectBrowserFixtureCommand.required("IDEA_IAM_TEST_SCHEMA"));values.put("organizationId",admin.organizationId());values.put("adminActorId",admin.actorId());values.put("adminLogin","iam-custom.admin");values.put("adminPassword",a);values.put("memberActorId",member.actorId());values.put("memberLogin","iam-custom.linh");values.put("memberPassword",m);values.put("ordinaryLogin","iam-custom.ordinary");values.put("ordinaryPassword",o);values.put("projectId",project.projectId());
        Files.createFile(file,PosixFilePermissions.asFileAttribute(PosixFilePermissions.fromString("rw-------")));Files.writeString(file,json.writeValueAsString(values));System.out.println("CUSTOM_ROLE_FIXTURE=READY;SYNTHETIC_ONLY=true;PRIVATE_FILE_MODE=600;PRODUCT_CUSTOM_PUBLICATION=NOT_RUN");
    }
    static void expect(java.sql.Statement q,String sql,long count)throws Exception{try(var r=q.executeQuery(sql)){if(!r.next()||r.getLong(1)!=count)throw new IllegalStateException("Custom fixture oracle mismatch");}}
}
