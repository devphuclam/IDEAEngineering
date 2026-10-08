package com.idea.ddm.project;

import static org.junit.jupiter.api.Assertions.*;
import com.idea.ddm.iam.IamIntegrationFixtures;
import com.idea.ddm.identity.IamSessionFixture;
import java.sql.*;
import java.time.Instant;
import java.util.*;
import org.junit.jupiter.api.*;

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class ProjectGovernanceDataTest {
    final IamIntegrationFixtures fixtures=new IamIntegrationFixtures();
    IamSessionFixture http;
    @BeforeAll void start()throws Exception{fixtures.createSchema();http=new IamSessionFixture(fixtures);}
    @AfterAll void stop(){if(http!=null)http.close();}
    @Test void crossOrganizationActorAndGroupProjectRelationshipsAreRejected()throws Exception{
        var actor=fixtures.identity(IamIntegrationFixtures.Persona.ORDINARY);
        http.withSignedInClient(actor,(client,context)->{
            var prerequisite=new ProjectPrerequisiteFixture(fixtures);var p=prerequisite.project(actor);var other=prerequisite.project(actor);var g=prerequisite.group(p,actor);var org=UUID.randomUUID();var foreign=UUID.randomUUID();
            // Core v0 deliberately permits one operating Organization. Never weaken that invariant
            // to fabricate a second runtime tenant; test mismatched exact foreign keys instead.
            assertEquals("23505",assertThrows(SQLException.class,()->prerequisite.insert("INSERT INTO operating_organization(organization_id,display_name) VALUES (?,?)",org,"Synthetic other Organization")).getSQLState());
            prerequisite.insert("INSERT INTO actor(actor_id,display_name) VALUES (?,?)",foreign,"Synthetic foreign Actor");
            assertEquals("23503",assertThrows(SQLException.class,()->prerequisite.insert("INSERT INTO idea_account(account_id,actor_id,organization_id,status) VALUES (?,?,?,'ACTIVE')",UUID.randomUUID(),foreign,org)).getSQLState());
            rejected("23503","INSERT INTO project_membership(membership_id,project_id,organization_id,actor_id,effective_from,reason,created_by) VALUES (?,?,?,?,CURRENT_TIMESTAMP,'Boundary',?)",UUID.randomUUID(),p.projectId(),actor.organizationId(),foreign,actor.actorId());
            rejected("23503","INSERT INTO group_membership(membership_id,group_id,project_id,organization_id,actor_id,effective_from,reason,created_by) VALUES (?,?,?,?,?,CURRENT_TIMESTAMP,'Boundary',?)",UUID.randomUUID(),g.groupId(),other.projectId(),actor.organizationId(),actor.actorId(),actor.actorId());
            rejected("23503","INSERT INTO group_membership(membership_id,group_id,project_id,organization_id,actor_id,effective_from,reason,created_by) VALUES (?,?,?,?,?,CURRENT_TIMESTAMP,'Boundary',?)",UUID.randomUUID(),g.groupId(),p.projectId(),actor.organizationId(),foreign,actor.actorId());
            rejected("23503","INSERT INTO project_membership(membership_id,project_id,organization_id,actor_id,effective_from,reason,created_by) VALUES (?,?,?,?,CURRENT_TIMESTAMP,'Boundary',?)",UUID.randomUUID(),p.projectId(),org,actor.actorId(),actor.actorId());
            assertEquals(0,count("SELECT count(*) FROM information_schema.columns WHERE table_schema=current_schema() AND table_name IN ('business_group','group_membership') AND column_name IN ('parent_group_id','principal_group_id')"));return null;
        });
    }
    @Test void oneUnendedAssociationAndAppendOnlyRegrantHistoryAreStorageInvariants()throws Exception{
        var actor=fixtures.identity(IamIntegrationFixtures.Persona.ORDINARY);
        http.withSignedInClient(actor,(client,context)->{
            var prerequisite=new ProjectPrerequisiteFixture(fixtures);var p=prerequisite.project(actor);var g=prerequisite.group(p,actor);var from=Instant.parse("2026-10-07T05:59:59Z");
            var pm=prerequisite.projectMembership(p,actor,from,null);var gm=prerequisite.groupMembership(g,actor,from,null);
            assertEquals("23505",assertThrows(SQLException.class,()->prerequisite.projectMembership(p,actor,from,null)).getSQLState());
            assertEquals("23505",assertThrows(SQLException.class,()->prerequisite.groupMembership(g,actor,from,null)).getSQLState());
            for(var entry:Map.of("project_membership_end",pm,"project_group_membership_end",gm).entrySet())try(var c=fixtures.app();var q=c.prepareStatement("SELECT "+entry.getKey()+"(?,?,?,?,?,?)")){
                q.setObject(1,entry.getValue());q.setObject(2,actor.organizationId());q.setLong(3,1);q.setObject(4,actor.actorId());q.setString(5,"Synthetic explicit departure");q.setTimestamp(6,Timestamp.from(from.plusSeconds(1)));try(var r=q.executeQuery()){assertTrue(r.next());assertTrue(r.getBoolean(1));}
            }
            assertNotEquals(pm,prerequisite.projectMembership(p,actor,from.plusSeconds(2),null));assertNotEquals(gm,prerequisite.groupMembership(g,actor,from.plusSeconds(2),null));
            assertEquals(1,count("SELECT count(*) FROM project_membership WHERE membership_id='"+pm+"' AND ended_at IS NOT NULL AND version=2"));
            assertEquals(1,count("SELECT count(*) FROM group_membership WHERE membership_id='"+gm+"' AND ended_at IS NOT NULL AND version=2"));return null;
        });
    }
    @Test void runtimeCannotDirectlyRewriteProtectedStateOrRedirectNarrowStorageFunctions()throws Exception{
        var actor=fixtures.identity(IamIntegrationFixtures.Persona.ORDINARY);
        http.withSignedInClient(actor,(client,context)->{
            var p=new ProjectPrerequisiteFixture(fixtures).project(actor);
            for(var table:List.of("project","business_group","project_membership","group_membership","project_owner_outcome","project_authorization_evidence")){
                rejected("42501","DELETE FROM "+table);rejected("42501","TRUNCATE "+table);
                var column=table.equals("project_owner_outcome")?"target_id":table.equals("project_authorization_evidence")?"actor_id":"version";
                rejected("42501","UPDATE "+table+" SET "+column+"="+column);
            }
            rejected("42501","CREATE TEMP TABLE project(project_id UUID)");
            // The existing DB denies app TEMP. Migrator creates only this owned temporary decoy;
            // the actual narrow-function invocation still runs as the separate app role.
            try(var c=fixtures.migrator();var s=c.createStatement()){
                s.execute("CREATE TEMP TABLE project(project_id UUID,organization_id UUID,display_name TEXT,version BIGINT)");
                s.execute("GRANT SELECT ON pg_temp.project TO idea_ddm_app");s.execute("SET ROLE idea_ddm_app");
                try(var q=c.prepareStatement("SELECT project_change(?,?,?,?)")){q.setObject(1,p.projectId());q.setObject(2,p.organizationId());q.setLong(3,1);q.setString(4,"Exact permanent Project");try(var r=q.executeQuery()){assertTrue(r.next());assertTrue(r.getBoolean(1));}}
                try(var r=s.executeQuery("SELECT count(*) FROM pg_temp.project")){assertTrue(r.next());assertEquals(0,r.getLong(1));}
                s.execute("RESET ROLE");s.execute("DROP TABLE pg_temp.project");
            }
            assertEquals(2,count("SELECT version FROM project WHERE project_id='"+p.projectId()+"'"));return null;
        });
    }
    void rejected(String state,String sql,Object...values)throws Exception{try(var c=fixtures.app();var q=c.prepareStatement(sql)){for(int i=0;i<values.length;i++)q.setObject(i+1,values[i]);assertEquals(state,assertThrows(SQLException.class,q::execute).getSQLState());}}
    long count(String query)throws Exception{try(var c=fixtures.app();var s=c.createStatement();var r=s.executeQuery(query)){assertTrue(r.next());return r.getLong(1);}}
}
