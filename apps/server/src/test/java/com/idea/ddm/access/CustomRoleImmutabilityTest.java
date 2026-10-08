package com.idea.ddm.access;
import static org.junit.jupiter.api.Assertions.*;
import com.idea.ddm.iam.IamIntegrationFixtures;
import java.sql.SQLException;
import java.util.*;
import org.junit.jupiter.api.*;

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class CustomRoleImmutabilityTest {
    final CustomRoleQualificationFixture f=new CustomRoleQualificationFixture();
    @BeforeAll void start()throws Exception{f.start();}@AfterAll void stop(){f.close();}
    @Test void rawApplicationDmlCannotEditSealedVersionsOrCandidateContent()throws Exception{
        var actor=f.rows.identity(IamIntegrationFixtures.Persona.PRA);f.http.withSignedInClient(actor,(client,ctx)->{f.delegate(actor);var draft=f.prepare(client);var r=f.post(client,f.activatePath(draft),f.activation());assertEquals(201,r.statusCode());var role=f.json.readTree(r.body());
            for(var sql:List.of("UPDATE identity_role_version SET version=version+1 WHERE role_version_id='"+role.path("roleVersionId").asString()+"'","DELETE FROM identity_role_version_profile WHERE role_version_id='"+role.path("roleVersionId").asString()+"'","UPDATE identity_role_permission SET permission_code='role.catalogue.read' WHERE role_version_id='"+role.path("roleVersionId").asString()+"'","INSERT INTO identity_role_permission(role_version_id,permission_code) VALUES ('"+role.path("roleVersionId").asString()+"','role.catalogue.read')","UPDATE identity_role_candidate SET content_digest=repeat('a',64)","DELETE FROM identity_role_candidate_permission","TRUNCATE identity_role_version_profile")){
                try(var c=f.rows.app();var q=c.createStatement()){assertEquals("42501",assertThrows(SQLException.class,()->q.execute(sql)).getSQLState());}
            }
            assertEquals(1,f.count("SELECT count(*) FROM identity_role_permission WHERE role_version_id='"+role.path("roleVersionId").asString()+"'"));return null;
        });
    }
    @Test void migratorCannotLateInsertOrRewriteActivatedContent()throws Exception{
        var actor=f.rows.identity(IamIntegrationFixtures.Persona.PRA);f.http.withSignedInClient(actor,(client,ctx)->{f.delegate(actor);var draft=f.prepare(client);var r=f.post(client,f.activatePath(draft),f.activation());assertEquals(201,r.statusCode());var role=f.json.readTree(r.body());
            for(var sql:List.of("INSERT INTO identity_role_permission(role_version_id,permission_code) VALUES ('"+role.path("roleVersionId").asString()+"','role.catalogue.read')","UPDATE identity_role_version_profile SET content_digest=repeat('a',64)","UPDATE identity_role_candidate SET version=version+1 WHERE candidate_id='"+draft.path("candidateId").asString()+"'","INSERT INTO identity_role_candidate_permission(candidate_id,permission_code) VALUES ('"+draft.path("candidateId").asString()+"','role.catalogue.read')"))try(var c=f.rows.migrator();var q=c.createStatement()){assertEquals("42501",assertThrows(SQLException.class,()->q.execute(sql)).getSQLState());}return null;
        });
    }
    @Test void preparedDraftHasNoSealedVersionAndDoesNotGrantPreparingActorAnyAssignment()throws Exception{
        var actor=f.rows.identity(IamIntegrationFixtures.Persona.PRA);f.http.withSignedInClient(actor,(client,ctx)->{f.delegate(actor);long before=f.count("SELECT count(*) FROM identity_role_assignment WHERE principal_actor_id='"+actor.actorId()+"'");var c=f.prepare(client);assertEquals(0,f.count("SELECT count(*) FROM identity_role_version_profile WHERE definition_id='"+c.path("definitionId").asString()+"'"));assertEquals(before,f.count("SELECT count(*) FROM identity_role_assignment WHERE principal_actor_id='"+actor.actorId()+"'"));return null;});
    }
}
