package com.idea.ddm.access;

import static org.junit.jupiter.api.Assertions.*;
import com.idea.ddm.iam.IamIntegrationFixtures;
import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.UUID;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class SuperSuccessorAdoptionTest {
    private static final Instant NOW=Instant.parse("2026-10-07T06:00:00Z");
    private final IamIntegrationFixtures fixtures=new IamIntegrationFixtures();
    private final AuthorizationPrerequisiteFixture roles=new AuthorizationPrerequisiteFixture(fixtures);
    @BeforeAll void start() throws Exception { fixtures.createSchema(); }

    @Test void currentSuperReauthenticatesIntoSeparateExactSuccessorWithAtomicEvidence() throws Exception {
        var actor=fixtures.identity(IamIntegrationFixtures.Persona.SUPER);
        var password=UUID.randomUUID().toString(); // Private synthetic memory only.
        try(var connection=fixtures.migrator()) {
            insert(connection,"INSERT INTO actor(actor_id,display_name) VALUES (?,?)",actor.actorId(),actor.displayName());
            insert(connection,"INSERT INTO idea_account(account_id,actor_id,organization_id,status) VALUES (?,?,?,'ACTIVE')",
                    actor.accountId(),actor.actorId(),actor.organizationId());
            insert(connection,"INSERT INTO login_identity(login_identity_id,account_id,login_identifier,normalized_login_identifier,password_verifier) VALUES (?,?,?,?,?)",
                    actor.loginIdentityId(),actor.accountId(),actor.login(),actor.login(),"{bcrypt}"+new BCryptPasswordEncoder().encode(password));
            insert(connection,"INSERT INTO identity_bootstrap_state(organization_id,actor_id,account_id) VALUES (?,?,?)",
                    actor.organizationId(),actor.actorId(),actor.accountId());
        }
        var old=roles.actorAssignment(actor,AuthorizationPrerequisiteFixture.SUPER_V1,
                AuthorizationDecisionService.Scope.organization(actor.organizationId()),NOW.minusSeconds(1),null);
        var operation=UUID.randomUUID();
        var service=new SuperSuccessorAdoptionService(fixtures.appDataSource(),Clock.fixed(NOW,ZoneOffset.UTC));
        var request=new SuperSuccessorAdoptionService.Request(operation,actor.organizationId(),actor.actorId(),actor.loginIdentityId(),old,1,"Synthetic successor qualification");
        var result=service.adopt(request,password.toCharArray());
        assertEquals("ADOPTED",result.state());
        assertEquals(actor.actorId(),result.actorId());
        assertEquals(actor.organizationId(),result.organizationId());
        assertNotEquals(old,result.assignmentId());
        try(var connection=fixtures.app();var query=connection.prepareStatement("SELECT principal_actor_id,role_version_id,organization_id,assigned_by,reason FROM identity_role_assignment WHERE assignment_id=?")) {
            query.setObject(1,result.assignmentId());
            try(var row=query.executeQuery()) {
                assertTrue(row.next()); assertEquals(actor.actorId(),row.getObject(1,UUID.class));
                assertEquals(SuperSuccessorAdoptionService.SUPER_V2,row.getObject(2,UUID.class));
                assertEquals(actor.organizationId(),row.getObject(3,UUID.class));
                assertEquals(actor.actorId(),row.getObject(4,UUID.class)); assertEquals(request.reason(),row.getString(5));
            }
        }
        var again=service.adopt(request,password.toCharArray());
        assertEquals("ALREADY_ADOPTED",again.state()); assertEquals(result.assignmentId(),again.assignmentId());
        try(var connection=fixtures.app();var query=connection.createStatement();var row=query.executeQuery(
                "SELECT (SELECT count(*) FROM access_policy_owner_outcome),(SELECT count(*) FROM identity_assignment_evidence),"
                +"(SELECT count(*) FROM identity_authorization_decision),(SELECT count(*) FROM audit_evidence),"
                +"(SELECT count(*) FROM session_record),(SELECT count(*) FROM identity_bootstrap_state),"
                +"(SELECT count(*) FROM identity_role_assignment WHERE revoked_at IS NULL)")) {
            assertTrue(row.next()); assertEquals(1,row.getLong(1)); assertEquals(1,row.getLong(2));
            assertEquals(2,row.getLong(3)); assertEquals(1,row.getLong(4)); assertEquals(0,row.getLong(5));
            assertEquals(1,row.getLong(6)); assertEquals(2,row.getLong(7));
        }
    }
    private static void insert(java.sql.Connection c,String sql,Object... values) throws Exception {
        try(var s=c.prepareStatement(sql)){for(int i=0;i<values.length;i++)s.setObject(i+1,values[i]);assertEquals(1,s.executeUpdate());}
    }
}
