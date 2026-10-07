package com.idea.ddm.identity;

import com.idea.ddm.iam.IamIntegrationFixtures;
import com.idea.ddm.access.AuthorizationPrerequisiteFixture;
import com.idea.ddm.access.AuthorizationDecisionService;
import java.nio.file.*;
import java.nio.file.attribute.PosixFilePermissions;
import java.time.Instant;
import java.util.*;
import tools.jackson.databind.json.JsonMapper;

/** Test-only seed/oracle; never shipped in the executable application, no fixture HTTP route. */
public final class AccountBrowserFixtureCommand {
    public static void main(String[] args) throws Exception {
        if (args.length != 1 || !Set.of("seed", "verify").contains(args[0])) throw new SecurityException("Fixture mode");
        var owned = Path.of(required("IDEA_IAM_BROWSER_ROOT"));
        if (!owned.toRealPath().equals(owned) || !owned.toString().matches("/home/phuclam/idea-iam-ui-20261007-46/run-account-qualification-[0-9]{2}")) throw new SecurityException("Fixture root");
        var fixtures = new IamIntegrationFixtures();
        if (args[0].equals("verify")) {
            try (var c = fixtures.app(); var s = c.createStatement(); var r = s.executeQuery("SELECT count(*) FROM project_membership UNION ALL SELECT count(*) FROM group_membership")) {
                while (r.next()) if (r.getLong(1) != 0) throw new IllegalStateException("Implicit participation");
            }
            try (var c = fixtures.app(); var s = c.createStatement(); var r = s.executeQuery("SELECT count(*) FROM identity_role_assignment WHERE principal_actor_id NOT IN (SELECT actor_id FROM idea_account WHERE account_id IN (SELECT account_id FROM login_identity WHERE normalized_login_identifier IN ('iam-browser.admin','iam-browser.super')))")) {
                if (!r.next() || r.getLong(1) != 0) throw new IllegalStateException("Implicit assignment");
            }
            try (var c = fixtures.app(); var s = c.createStatement(); var r = s.executeQuery("SELECT (SELECT count(*) FROM identity_bootstrap_state),(SELECT count(*) FROM identity_role_assignment a JOIN identity_role_version v USING(role_version_id) WHERE v.role_code='super-administrator' AND v.version=1),(SELECT count(*) FROM identity_role_assignment a JOIN identity_role_version v USING(role_version_id) WHERE v.role_code='super-administrator' AND v.version=2),(SELECT count(*) FROM session_record sr JOIN idea_account a ON sr.account_id=a.account_id JOIN login_identity l ON l.account_id=a.account_id WHERE l.normalized_login_identifier='iam-browser.super')")) {
                if (!r.next() || r.getLong(1)!=1 || r.getLong(2)!=1 || r.getLong(3)!=1 || r.getLong(4)!=0) throw new IllegalStateException("Adoption/console invariant");
            }
            System.out.println("BROWSER_DATABASE_ORACLE=PASS;MEMBERSHIPS=0;IMPLICIT_ROLES=0;CONSOLE_SESSION=0;BOOTSTRAP_PRESERVED=true"); return;
        }
        if (Files.exists(owned.resolve("fixture.private.json"))) throw new SecurityException("Reused fixture");
        fixtures.createSchema();
        // Remove only the synthetic pre-seeded Organization so the official bootstrap owns its creation.
        try (var c=fixtures.migrator();var q=c.prepareStatement("DELETE FROM operating_organization WHERE organization_id=?")) { q.setObject(1,fixtures.organizationId());if(q.executeUpdate()!=1)throw new IllegalStateException(); }
        var superPassword=UUID.randomUUID().toString();
        var bootstrap=new AdministratorBootstrap(fixtures.appDataSource()).initialize(fixtures.organizationId(),"Synthetic IAM Organization A","Synthetic console custodian","iam-browser.super",superPassword);
        UUID superLogin,superAssignment;
        try(var c=fixtures.app();var q=c.prepareStatement("SELECT l.login_identity_id,a.assignment_id FROM login_identity l JOIN identity_role_assignment a ON a.principal_actor_id=? WHERE l.account_id=? AND a.role_version_id=?")) {
            q.setObject(1,bootstrap.actorId());q.setObject(2,bootstrap.accountId());q.setObject(3,AuthorizationPrerequisiteFixture.SUPER_V1);
            try(var r=q.executeQuery()){if(!r.next())throw new IllegalStateException();superLogin=r.getObject(1,UUID.class);superAssignment=r.getObject(2,UUID.class);if(r.next())throw new IllegalStateException();}
        }
        var admin=fixtures.identity(IamIntegrationFixtures.Persona.AA_V3);var ordinary=fixtures.identity(IamIntegrationFixtures.Persona.ORDINARY);
        var adminPassword=UUID.randomUUID().toString();var ordinaryPassword=UUID.randomUUID().toString();
        seed(fixtures,admin,"iam-browser.admin",adminPassword);seed(fixtures,ordinary,"iam-browser.ordinary",ordinaryPassword);
        new AuthorizationPrerequisiteFixture(fixtures).actorAssignment(admin,AuthorizationPrerequisiteFixture.AA_V3,AuthorizationDecisionService.Scope.organization(fixtures.organizationId()),Instant.now().minusSeconds(60),null);
        var values=new LinkedHashMap<String,Object>();values.put("source",required("IDEA_IAM_SOURCE_SHA"));values.put("schema",required("IDEA_IAM_TEST_SCHEMA"));values.put("organizationId",fixtures.organizationId());
        values.put("adminLogin","iam-browser.admin");values.put("adminPassword",adminPassword);values.put("adminActorId",admin.actorId());
        values.put("ordinaryLogin","iam-browser.ordinary");values.put("ordinaryPassword",ordinaryPassword);
        values.put("superActorId",bootstrap.actorId());values.put("superLoginIdentityId",superLogin);values.put("superAssignmentId",superAssignment);values.put("superPassword",superPassword);
        Files.createFile(owned.resolve("fixture.private.json"),PosixFilePermissions.asFileAttribute(PosixFilePermissions.fromString("rw-------")));
        Files.writeString(owned.resolve("fixture.private.json"),JsonMapper.builder().build().writeValueAsString(values));
        System.out.println("BROWSER_FIXTURE=READY;SYNTHETIC_ONLY=true;PRIVATE_FILE_MODE=600");
    }
    private static void seed(IamIntegrationFixtures fixtures,IamIntegrationFixtures.Identity id,String login,String password)throws Exception {
        try(var c=fixtures.migrator()){c.setAutoCommit(false);
            AdministratorBootstrap.insert(c,"INSERT INTO actor(actor_id,display_name) VALUES (?,?)",id.actorId(),id.displayName());
            AdministratorBootstrap.insert(c,"INSERT INTO idea_account(account_id,actor_id,organization_id,status) VALUES (?,?,?,'ACTIVE')",id.accountId(),id.actorId(),id.organizationId());
            AdministratorBootstrap.insert(c,"INSERT INTO login_identity(login_identity_id,account_id,login_identifier,normalized_login_identifier,password_verifier) VALUES (?,?,?,?,?)",id.loginIdentityId(),id.accountId(),login,login,new NativePasswordVerifier().encodeNewCredential(password));c.commit();}
    }
    private static String required(String name){var value=System.getenv(name);if(value==null || value.isBlank())throw new SecurityException("Missing fixture input");return value;}
}
