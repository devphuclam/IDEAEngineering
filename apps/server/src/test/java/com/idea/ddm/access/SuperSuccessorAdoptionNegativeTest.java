package com.idea.ddm.access;

import static org.junit.jupiter.api.Assertions.*;
import com.idea.ddm.iam.IamIntegrationFixtures;
import com.idea.ddm.identity.IamSessionFixture;
import com.idea.ddm.identity.IdentityAdministration;
import com.idea.ddm.identity.IdentityRefusal;
import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.UUID;
import org.junit.jupiter.api.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class SuperSuccessorAdoptionNegativeTest {
    private static final Instant NOW=Instant.parse("2026-10-07T06:00:00Z");
    private final IamIntegrationFixtures fixtures=new IamIntegrationFixtures();
    private final AuthorizationPrerequisiteFixture roles=new AuthorizationPrerequisiteFixture(fixtures);
    private final SuperSuccessorAdoptionService service=new SuperSuccessorAdoptionService(fixtures.appDataSource(),Clock.fixed(NOW,ZoneOffset.UTC));
    @BeforeAll void start() throws Exception { fixtures.createSchema(); }
    private record Target(IamIntegrationFixtures.Identity identity, UUID assignment, String password) {
        @Override public String toString(){return "Target[credential=REDACTED]";}
    }
    private Target target() throws Exception {
        var identity=fixtures.identity(IamIntegrationFixtures.Persona.SUPER);var password=UUID.randomUUID().toString();
        execute("INSERT INTO actor(actor_id,display_name) VALUES (?,?)",identity.actorId(),identity.displayName());
        execute("INSERT INTO idea_account(account_id,actor_id,organization_id,status) VALUES (?,?,?,'ACTIVE')",identity.accountId(),identity.actorId(),identity.organizationId());
        execute("INSERT INTO login_identity(login_identity_id,account_id,login_identifier,normalized_login_identifier,password_verifier) VALUES (?,?,?,?,?)",identity.loginIdentityId(),identity.accountId(),identity.login(),identity.login(),"{bcrypt}"+new BCryptPasswordEncoder().encode(password));
        var assignment=roles.actorAssignment(identity,AuthorizationPrerequisiteFixture.SUPER_V1,AuthorizationDecisionService.Scope.organization(identity.organizationId()),NOW.minusSeconds(1),null);
        return new Target(identity,assignment,password);
    }
    private SuperSuccessorAdoptionService.Request request(Target t,UUID actor,UUID org,long version){return new SuperSuccessorAdoptionService.Request(UUID.randomUUID(),org,actor,t.identity.loginIdentityId(),t.assignment,version,"Synthetic adoption test");}
    private SuperSuccessorAdoptionService.Request request(Target t){return request(t,t.identity.actorId(),t.identity.organizationId(),1);}
    @Test void exactActorOrganizationAndSecurityVersionCannotBeSubstituted() throws Exception {
        var t=target();
        for(var request:new SuperSuccessorAdoptionService.Request[]{request(t,UUID.randomUUID(),t.identity.organizationId(),1),request(t,t.identity.actorId(),UUID.randomUUID(),1),request(t,t.identity.actorId(),t.identity.organizationId(),2)})
            assertThrows(SuperSuccessorAdoptionService.Refused.class,()->service.adopt(request,t.password.toCharArray()));
        assertEquals(0,successors(t));
    }
    @Test void revokedAndDisabledAuthorityCannotAdopt() throws Exception {
        var t=target();execute("UPDATE identity_role_assignment SET revoked_at=CURRENT_TIMESTAMP WHERE assignment_id=?",t.assignment);
        assertThrows(SuperSuccessorAdoptionService.Refused.class,()->service.adopt(request(t),t.password.toCharArray()));
        var disabled=target();execute("UPDATE idea_account SET status='DISABLED' WHERE account_id=?",disabled.identity.accountId());
        execute("UPDATE actor SET disabled_at=CURRENT_TIMESTAMP WHERE actor_id=?",disabled.identity.actorId());
        assertThrows(SuperSuccessorAdoptionService.Refused.class,()->service.adopt(request(disabled),disabled.password.toCharArray()));
        assertEquals(0,successors(t));assertEquals(0,successors(disabled));
    }
    @Test void fifthFailureBlocksAndBlockedAttemptCannotExtendOrClearSharedState() throws Exception {
        var t=target();for(int i=0;i<5;i++)assertThrows(SuperSuccessorAdoptionService.Refused.class,()->service.adopt(request(t),"wrong synthetic credential".toCharArray()));
        var before=failures(t);assertTrue(before.startsWith("5|"));
        assertThrows(SuperSuccessorAdoptionService.Refused.class,()->service.adopt(request(t),t.password.toCharArray()));
        assertEquals(before,failures(t));assertEquals(0,successors(t));
    }
    @Test void successClearsSharedFailureStateButRequiredAuditFailureRollsClearAndGrantBack() throws Exception {
        var t=target();assertThrows(SuperSuccessorAdoptionService.Refused.class,()->service.adopt(request(t),"wrong synthetic credential".toCharArray()));
        var before=failures(t);
        execute("CREATE FUNCTION suppress_adoption_audit() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN IF NEW.action='role.successor.adopt' THEN RETURN NULL; END IF; RETURN NEW; END $$");
        execute("CREATE TRIGGER suppress_adoption_audit BEFORE INSERT ON audit_evidence FOR EACH ROW EXECUTE FUNCTION suppress_adoption_audit()");
        try {assertThrows(IllegalStateException.class,()->service.adopt(request(t),t.password.toCharArray()));assertEquals(before,failures(t));assertEquals(0,successors(t));}
        finally {execute("DROP TRIGGER suppress_adoption_audit ON audit_evidence");}
        assertEquals("ADOPTED",service.adopt(request(t),t.password.toCharArray()).state());assertEquals("NONE",failures(t));
    }
    @Test void unknownExactLoginCreatesNoDurableThrottleState() throws Exception {
        var t=target();var unknown=UUID.randomUUID();var request=new SuperSuccessorAdoptionService.Request(UUID.randomUUID(),t.identity.organizationId(),t.identity.actorId(),unknown,t.assignment,1,"Synthetic unknown qualification");
        assertThrows(SuperSuccessorAdoptionService.Refused.class,()->service.adopt(request,t.password.toCharArray()));
        assertEquals(0,count("SELECT count(*) FROM login_failure_state WHERE login_identity_id=?",unknown));
    }
    @Test void consoleAndRealHttpSignInShareFailureBlockAndSuccessfulClear()throws Exception{
        try(var http=new IamSessionFixture(fixtures)){
            var who=fixtures.identity(IamIntegrationFixtures.Persona.SUPER);
            http.withSignedInClient(who,(client,context)->{
                var password=UUID.randomUUID().toString();
                execute("UPDATE login_identity SET password_verifier=? WHERE login_identity_id=?","{bcrypt}"+new BCryptPasswordEncoder().encode(password),who.loginIdentityId());
                var old=roles.actorAssignment(who,AuthorizationPrerequisiteFixture.SUPER_V1,AuthorizationDecisionService.Scope.organization(who.organizationId()),NOW.minusSeconds(1),null);
                var t=new Target(who,old,password);
                for(int i=0;i<4;i++)assertThrows(SuperSuccessorAdoptionService.Refused.class,()->service.adopt(request(t),"wrong synthetic credential".toCharArray()));
                assertEquals(401,login(http,client,who.login(),"wrong synthetic credential")); // HTTP makes failure five.
                var blocked=failures(t);assertTrue(blocked.startsWith("5|"));
                assertThrows(SuperSuccessorAdoptionService.Refused.class,()->service.adopt(request(t),password.toCharArray()));assertEquals(blocked,failures(t));
                var after=new SuperSuccessorAdoptionService(fixtures.appDataSource(),Clock.fixed(NOW.plusSeconds(900),ZoneOffset.UTC));
                assertEquals("ADOPTED",after.adopt(request(t),password.toCharArray()).state());assertEquals("NONE",failures(t));
                assertEquals(200,login(http,client,who.login(),password));return null;
            });
        }
    }
    @Test void headlessOperatorCommandRefusesBeforeDatasourceOrCredentialAccess()throws Exception{
        var executable=java.nio.file.Path.of(System.getProperty("java.home"),"bin","java").toString();
        var process=new ProcessBuilder(executable,"-cp",System.getProperty("java.class.path"),"com.idea.ddm.identity.SuperSuccessorAdoptionCommand","--adopt").redirectErrorStream(true).start();
        var output=new String(process.getInputStream().readAllBytes(),java.nio.charset.StandardCharsets.UTF_8);
        assertEquals(2,process.waitFor());assertTrue(output.contains("no transition attempted"));
    }
    private int login(IamSessionFixture http,java.net.http.HttpClient client,String login,String password)throws Exception{
        var json=tools.jackson.databind.json.JsonMapper.builder().build();
        var csrf=json.readTree(client.send(java.net.http.HttpRequest.newBuilder(http.uri("/api/v1/identity/csrf")).GET().build(),java.net.http.HttpResponse.BodyHandlers.ofString()).body());
        var body="username="+java.net.URLEncoder.encode(login,java.nio.charset.StandardCharsets.UTF_8)+"&password="+java.net.URLEncoder.encode(password,java.nio.charset.StandardCharsets.UTF_8);
        return client.send(java.net.http.HttpRequest.newBuilder(http.uri("/api/v1/identity/login")).header("Content-Type","application/x-www-form-urlencoded").header(csrf.path("headerName").asString(),csrf.path("token").asString()).POST(java.net.http.HttpRequest.BodyPublishers.ofString(body)).build(),java.net.http.HttpResponse.BodyHandlers.discarding()).statusCode();
    }
    @Test void lastEffectiveSuperSuccessorRemainsProtectedWithoutCountingRevokedPredecessor() throws Exception {
        try(var http=new IamSessionFixture(fixtures)) {
            http.withSignedInClient(fixtures.identity(IamIntegrationFixtures.Persona.AA_V3),(client,context)->{
                var aa=identity(context.actorId());roles.actorAssignment(aa,AuthorizationPrerequisiteFixture.AA_V3,AuthorizationDecisionService.Scope.organization(aa.organizationId()),NOW.minusSeconds(1),null);
                // End all earlier test holders. Only this exact Super@2 recovery path remains effective.
                execute("UPDATE identity_role_assignment SET revoked_at=CURRENT_TIMESTAMP WHERE role_version_id IN (?,?)",AuthorizationPrerequisiteFixture.SUPER_V1,AuthorizationPrerequisiteFixture.SUPER_V2);
                var t=target();execute("UPDATE identity_role_assignment SET revoked_at=CURRENT_TIMESTAMP WHERE assignment_id=?",t.assignment);
                roles.actorAssignment(t.identity,AuthorizationPrerequisiteFixture.SUPER_V2,AuthorizationDecisionService.Scope.organization(t.identity.organizationId()),NOW.minusSeconds(1),null);
                var refusal=assertThrows(IdentityRefusal.class,()->http.service(IdentityAdministration.class).disable(context,UUID.randomUUID(),t.identity.organizationId(),t.identity.accountId(),1,"Synthetic recovery protection"));
                assertEquals("LAST_SUPER_ADMINISTRATOR_RECOVERY_PATH",refusal.reason());return null;
            });
        }
    }
    private IamIntegrationFixtures.Identity identity(UUID actor) throws Exception {
        try(var c=fixtures.app();var q=c.prepareStatement("SELECT account_id,login_identity_id,organization_id,display_name,normalized_login_identifier FROM idea_account JOIN actor USING(actor_id) JOIN login_identity USING(account_id) WHERE actor_id=?")){
            q.setObject(1,actor);try(var r=q.executeQuery()){assertTrue(r.next());return new IamIntegrationFixtures.Identity(actor,r.getObject(1,UUID.class),r.getObject(2,UUID.class),r.getObject(3,UUID.class),r.getString(4),r.getString(5));}}
    }
    private long successors(Target t)throws Exception{return count("SELECT count(*) FROM identity_role_assignment WHERE principal_actor_id=? AND role_version_id=?",t.identity.actorId(),AuthorizationPrerequisiteFixture.SUPER_V2);}
    private String failures(Target t)throws Exception{try(var c=fixtures.app();var q=c.prepareStatement("SELECT cardinality(failed_at)||'|'||COALESCE(blocked_until::text,'none') FROM login_failure_state WHERE login_identity_id=?")){q.setObject(1,t.identity.loginIdentityId());try(var r=q.executeQuery()){return r.next()?r.getString(1):"NONE";}}}
    private long count(String sql,Object... args)throws Exception{try(var c=fixtures.app();var q=c.prepareStatement(sql)){for(int i=0;i<args.length;i++)q.setObject(i+1,args[i]);try(var r=q.executeQuery()){assertTrue(r.next());return r.getLong(1);}}}
    private void execute(String sql,Object... args)throws Exception{try(var c=fixtures.migrator();var q=c.prepareStatement(sql)){for(int i=0;i<args.length;i++)q.setObject(i+1,args[i]);q.execute();}}
}
