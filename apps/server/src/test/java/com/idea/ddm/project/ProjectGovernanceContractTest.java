package com.idea.ddm.project;

import static org.junit.jupiter.api.Assertions.*;
import com.idea.ddm.access.AuthorizationDecisionService;
import com.idea.ddm.access.AuthorizationPrerequisiteFixture;
import com.idea.ddm.iam.IamIntegrationFixtures;
import com.idea.ddm.iam.IamWebConfiguration.Refusal;
import com.idea.ddm.identity.*;
import java.sql.*;
import java.time.*;
import java.util.*;
import org.junit.jupiter.api.*;

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class ProjectGovernanceContractTest {
    final IamIntegrationFixtures fixtures=new IamIntegrationFixtures();
    IamSessionFixture http;
    @BeforeAll void start()throws Exception{fixtures.createSchema();http=new IamSessionFixture(fixtures);}
    @AfterAll void stop(){if(http!=null)http.close();}
    @Test void groupTargetExpiryAtCommitRollsBackTheActualOwnerCommand()throws Exception{
        var admin=fixtures.identity(IamIntegrationFixtures.Persona.PA_ORGANIZATION);
        http.withSignedInClient(admin,(client,context)->{
            grant(admin);var prerequisite=new ProjectPrerequisiteFixture(fixtures);var project=prerequisite.project(admin);var group=prerequisite.group(project,admin);
            var initial=Instant.parse("2026-10-07T06:00:00Z");var expiry=initial.plusSeconds(30);
            prerequisite.projectMembership(project,admin,initial.minusSeconds(1),expiry);
            // A controlled owner Clock advances only between mutation admission and commit recheck.
            // IAM/authorization remain eligible. The real SQL and shared transaction are unchanged.
            var advancing=new Clock(){int calls;public Instant instant(){return calls++==0?initial:expiry;}public ZoneId getZone(){return ZoneOffset.UTC;}public Clock withZone(ZoneId zone){return this;}};
            var eligible=new OwnerSessionEligibility(http.sessions());
            var owner=new ProjectGovernanceAdministration(fixtures.appDataSource(),new IdentityTransactions(fixtures.appDataSource(),eligible),eligible,http.service(AuthorizationDecisionService.class),http.service(ProjectGovernanceQueries.class),advancing);
            var op=UUID.randomUUID();
            assertThrows(Refusal.class,()->new ProjectParticipationAdministration(owner).join(context,op,AuthorizationDecisionService.Scope.project(admin.organizationId(),project.projectId()),group.groupId(),admin.actorId(),true,1,null,"Exact expiry at commit"));
            assertEquals(0,count("SELECT count(*) FROM group_membership WHERE group_id='"+group.groupId()+"'"));
            assertEquals(1,count("SELECT version FROM business_group WHERE group_id='"+group.groupId()+"'"));
            for(var table:List.of("project_owner_outcome","project_authorization_evidence","audit_evidence"))assertEquals(0,count("SELECT count(*) FROM "+table+" WHERE operation_id='"+op+"'"));return null;
        });
    }
    @Test void endedAssociationIsRetainedAndRejoinCreatesANewIdentityWithoutRole()throws Exception{
        var admin=fixtures.identity(IamIntegrationFixtures.Persona.PA_ORGANIZATION);
        http.withSignedInClient(admin,(client,context)->{
            grant(admin);var p=new ProjectPrerequisiteFixture(fixtures).project(admin);var scope=AuthorizationDecisionService.Scope.project(admin.organizationId(),p.projectId());
            var owner=http.service(ProjectParticipationAdministration.class);
            var first=owner.join(context,UUID.randomUUID(),scope,p.projectId(),admin.actorId(),false,1,null,"Explicit membership");var id=UUID.fromString(first.path("membershipId").asString());
            owner.end(context,UUID.randomUUID(),scope,id,false,1,"Explicit departure");
            var next=owner.join(context,UUID.randomUUID(),scope,p.projectId(),admin.actorId(),false,3,null,"Explicit new association");
            assertNotEquals(first.path("membershipId").asString(),next.path("membershipId").asString());
            assertEquals(2,count("SELECT count(*) FROM project_membership WHERE project_id='"+p.projectId()+"'"));
            assertEquals(1,count("SELECT count(*) FROM project_membership WHERE membership_id='"+id+"' AND ended_at IS NOT NULL AND version=2"));
            assertEquals(0,count("SELECT count(*) FROM identity_role_assignment WHERE project_id='"+p.projectId()+"'"));return null;
        });
    }
    @Test void deliberateRefusalIsResolvedWithoutExecutingLaterChangedState()throws Exception{
        var admin=fixtures.identity(IamIntegrationFixtures.Persona.PA_ORGANIZATION);
        http.withSignedInClient(admin,(client,context)->{
            grant(admin);var prerequisite=new ProjectPrerequisiteFixture(fixtures);var p=prerequisite.project(admin);var g=prerequisite.group(p,admin);var scope=AuthorizationDecisionService.Scope.project(admin.organizationId(),p.projectId());
            var op=UUID.randomUUID();var owner=http.service(ProjectParticipationAdministration.class);
            assertThrows(Refusal.class,()->owner.join(context,op,scope,g.groupId(),admin.actorId(),true,1,null,"Missing participation"));
            prerequisite.projectMembership(p,admin,Instant.parse("2026-10-07T05:59:59Z"),null);
            assertThrows(Refusal.class,()->owner.join(context,op,scope,g.groupId(),admin.actorId(),true,1,null,"Missing participation"));
            assertEquals(0,count("SELECT count(*) FROM group_membership WHERE group_id='"+g.groupId()+"'"));
            assertEquals(1,count("SELECT count(*) FROM project_owner_outcome WHERE operation_id='"+op+"' AND outcome='REFUSED'"));
            assertEquals(1,count("SELECT count(*) FROM audit_evidence WHERE operation_id='"+op+"'"));
            assertEquals(2,count("SELECT count(*) FROM project_authorization_evidence WHERE operation_id='"+op+"'"));return null;
        });
    }
    void grant(IamIntegrationFixtures.Identity id)throws Exception{new AuthorizationPrerequisiteFixture(fixtures).actorAssignment(id,AuthorizationPrerequisiteFixture.PA_V1,AuthorizationDecisionService.Scope.organization(id.organizationId()),Instant.parse("2026-10-07T05:59:59Z"),null);}
    long count(String query)throws Exception{try(var c=fixtures.app();var s=c.createStatement();var r=s.executeQuery(query)){assertTrue(r.next());return r.getLong(1);}}
}
