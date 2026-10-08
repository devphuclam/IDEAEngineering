package com.idea.ddm.access;

import static org.junit.jupiter.api.Assertions.*;
import com.idea.ddm.iam.IamIntegrationFixtures;
import java.net.http.HttpResponse;
import java.util.*;
import java.util.concurrent.*;
import org.junit.jupiter.api.*;

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class RoleAssignmentAtomicityTest {
    final AssignmentQualificationFixture f=new AssignmentQualificationFixture();
    @BeforeAll void start()throws Exception{f.start();}
    @AfterAll void stop(){f.close();}
    @Test void requiredOutcomeEnvelopeDecisionAndAuditFailureRollBackBothReplacementRows()throws Exception{
        var admin=f.rows.identity(IamIntegrationFixtures.Persona.SUPER);var target=f.rows.identity(IamIntegrationFixtures.Persona.LINH);
        f.http.withSignedInClient(admin,(client,ctx)->f.http.withSignedInClient(target,(unused,c2)->{
            f.grant(admin,AuthorizationPrerequisiteFixture.SUPER_V2);var original=f.grant(target,AuthorizationPrerequisiteFixture.AA_V1);
            for(var table:List.of("access_policy_owner_outcome","assignment_owner_operation","assignment_authorization_evidence","audit_evidence")){
                var op=UUID.randomUUID();var input=Map.of("operationId",op,"scope",f.scope(),"expectedVersion",1,"newRoleVersionId",AuthorizationPrerequisiteFixture.AA_V2,"reason","Synthetic required-write fault");
                f.sql("CREATE FUNCTION suppress_assignment_write() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RETURN NULL; END $$");f.sql("CREATE TRIGGER suppress_assignment_write BEFORE INSERT ON "+table+" FOR EACH ROW EXECUTE FUNCTION suppress_assignment_write()");
                try{assertEquals(503,f.post(client,"/api/v1/administration/assignments/"+original+"/replace",input).statusCode());}
                finally{f.sql("DROP TRIGGER suppress_assignment_write ON "+table);f.sql("DROP FUNCTION suppress_assignment_write()");}
                assertEquals(1,f.count("SELECT version FROM identity_role_assignment WHERE assignment_id='"+original+"'"));assertEquals(0,f.count("SELECT count(*) FROM identity_role_assignment WHERE assignment_id='"+original+"' AND revoked_at IS NOT NULL"));
                assertEquals(0,f.count("SELECT count(*) FROM identity_role_assignment WHERE principal_actor_id='"+target.actorId()+"' AND role_version_id='"+AuthorizationPrerequisiteFixture.AA_V2+"'"));
                for(var evidence:List.of("access_policy_owner_outcome","assignment_owner_operation","assignment_authorization_evidence","audit_evidence"))assertEquals(0,f.count("SELECT count(*) FROM "+evidence+" WHERE operation_id='"+op+"'"));
            }return null;
        }));
    }
    @Test void concurrentSameOperationResolvesOneAssignmentAndOneEvidenceSet()throws Exception{
        var admin=f.rows.identity(IamIntegrationFixtures.Persona.SUPER);var target=f.rows.identity(IamIntegrationFixtures.Persona.LINH);
        f.http.withSignedInClient(admin,(client,ctx)->f.http.withSignedInClient(target,(unused,c2)->{
            f.grant(admin,AuthorizationPrerequisiteFixture.SUPER_V2);var input=f.input(target.actorId(),AuthorizationPrerequisiteFixture.AA_V3);var op=input.get("operationId");
            var replies=concurrent(()->f.post(client,"/api/v1/administration/assignments",input),()->f.post(client,"/api/v1/administration/assignments",input));assertEquals(List.of(201,201),replies.stream().map(HttpResponse::statusCode).toList());assertEquals(f.json.readTree(replies.get(0).body()),f.json.readTree(replies.get(1).body()));
            assertEquals(1,f.count("SELECT count(*) FROM audit_evidence WHERE operation_id='"+op+"'"));assertEquals(2,f.count("SELECT count(*) FROM assignment_authorization_evidence WHERE operation_id='"+op+"'"));return null;
        }));
    }
    @Test void concurrentReplacementCannotSpendTheSamePredecessorVersionTwice()throws Exception{
        var admin=f.rows.identity(IamIntegrationFixtures.Persona.SUPER);var target=f.rows.identity(IamIntegrationFixtures.Persona.LINH);
        f.http.withSignedInClient(admin,(client,ctx)->f.http.withSignedInClient(target,(unused,c2)->{
            f.grant(admin,AuthorizationPrerequisiteFixture.SUPER_V2);var original=f.grant(target,AuthorizationPrerequisiteFixture.AA_V1);
            var a=Map.of("operationId",UUID.randomUUID(),"scope",f.scope(),"expectedVersion",1,"newRoleVersionId",AuthorizationPrerequisiteFixture.AA_V2,"reason","First versioned intent");
            var b=Map.of("operationId",UUID.randomUUID(),"scope",f.scope(),"expectedVersion",1,"newRoleVersionId",AuthorizationPrerequisiteFixture.AA_V3,"reason","Second versioned intent");
            var replies=concurrent(()->f.post(client,"/api/v1/administration/assignments/"+original+"/replace",a),()->f.post(client,"/api/v1/administration/assignments/"+original+"/replace",b));assertEquals(List.of(200,409),replies.stream().map(HttpResponse::statusCode).sorted().toList());
            assertEquals(2,f.count("SELECT version FROM identity_role_assignment WHERE assignment_id='"+original+"'"));assertEquals(1,f.count("SELECT count(*) FROM identity_role_assignment WHERE principal_actor_id='"+target.actorId()+"' AND revoked_at IS NULL"));return null;
        }));
    }
    @Test void authorityRevokedWhileWaitingForSecurityCommitLockCannotAuthorizeGrant()throws Exception{
        var admin=f.rows.identity(IamIntegrationFixtures.Persona.SUPER);var target=f.rows.identity(IamIntegrationFixtures.Persona.LINH);
        f.http.withSignedInClient(admin,(client,ctx)->f.http.withSignedInClient(target,(unused,c2)->{
            var authority=f.grant(admin,AuthorizationPrerequisiteFixture.SUPER_V2);var input=f.input(target.actorId(),AuthorizationPrerequisiteFixture.AA_V3);var op=input.get("operationId");
            try(var revoker=f.rows.migrator();var q=revoker.createStatement();var pool=Executors.newSingleThreadExecutor()){
                revoker.setAutoCommit(false);q.execute("SELECT pg_advisory_xact_lock(73003002)");q.execute("UPDATE identity_role_assignment SET revoked_at=CURRENT_TIMESTAMP WHERE assignment_id='"+authority+"'");
                var waiting=pool.submit(()->f.post(client,"/api/v1/administration/assignments",input));
                boolean witnessed=false;for(int i=0;i<100&&!witnessed;i++){try(var c=f.rows.migrator();var s=c.createStatement();var r=s.executeQuery("SELECT EXISTS(SELECT 1 FROM pg_locks WHERE locktype='advisory' AND classid=0 AND objid=73003002 AND NOT granted)")){r.next();witnessed=r.getBoolean(1);}if(!witnessed)Thread.sleep(20);}
                assertTrue(witnessed,"Actual command must wait behind the authoritative security writer");revoker.commit();assertEquals(403,waiting.get(15,TimeUnit.SECONDS).statusCode());
            }
            assertEquals(0,f.count("SELECT count(*) FROM identity_role_assignment WHERE principal_actor_id='"+target.actorId()+"'"));assertEquals(0,f.count("SELECT count(*) FROM access_policy_owner_outcome WHERE operation_id='"+op+"' AND outcome='ACCEPTED'"));return null;
        }));
    }
    private static <T>List<T> concurrent(Callable<T> a,Callable<T> b)throws Exception{try(var pool=Executors.newFixedThreadPool(2)){var start=new CyclicBarrier(2);var first=pool.submit(()->{start.await(5,TimeUnit.SECONDS);return a.call();});var second=pool.submit(()->{start.await(5,TimeUnit.SECONDS);return b.call();});return List.of(first.get(20,TimeUnit.SECONDS),second.get(20,TimeUnit.SECONDS));}}
}
