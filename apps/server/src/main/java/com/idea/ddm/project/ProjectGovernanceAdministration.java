package com.idea.ddm.project;

import com.idea.ddm.access.AuthorizationDecisionService;
import com.idea.ddm.access.AuthorizationDecisionService.Scope;
import com.idea.ddm.iam.IamWebConfiguration.Refusal;
import com.idea.ddm.iam.IamWebConfiguration.RefusalReason;
import com.idea.ddm.identity.*;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.sql.*;
import java.time.Clock;
import java.util.*;
import javax.sql.DataSource;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.json.JsonMapper;

/** Project-owned transaction/result seam. No product identity or authority comes from input. */
public final class ProjectGovernanceAdministration {
    private final DataSource source;
    private final IdentityTransactions transactions;
    private final OwnerSessionEligibility eligibility;
    private final AuthorizationDecisionService authorization;
    private final ProjectGovernanceQueries queries;
    private final Clock clock;
    private final JsonMapper json = JsonMapper.builder().build();

    public ProjectGovernanceAdministration(DataSource source, IdentityTransactions transactions,
            OwnerSessionEligibility eligibility, AuthorizationDecisionService authorization,
            ProjectGovernanceQueries queries, Clock clock) {
        this.source=source; this.transactions=transactions; this.eligibility=eligibility;
        this.authorization=authorization; this.queries=queries; this.clock=clock;
    }
    public JsonNode create(ActorContext context, UUID operation, UUID organization, String name, String reason) {
        var normalizedName=text(name,200); var normalizedReason=text(reason,500);
        var scope=scope(organization,null);
        return command(context,operation,scope,"project.create",digest(List.of("project.create",organization.toString(),normalizedName,normalizedReason)),
                (c,actor)->{
                    var id=UUID.randomUUID();
                    insert(c,"INSERT INTO project(project_id,organization_id,display_name,created_by,created_at) VALUES (?,?,?,?,?)",
                            id,actor.organizationId(),normalizedName,actor.actorId(),Timestamp.from(clock.instant()));
                    return json.valueToTree(queries.projectRow(c,actor.organizationId(),id));
                });
    }
    public ProjectGovernanceQueries.Project project(ActorContext context, UUID organization, UUID id, boolean participant) {
        return read(context,(c,actor)->{
            var targetScope=scope(organization==null?actor.organizationId():organization,id);
            require(authorization.evaluate(c,context,participant?"project.read":"project.admin.read",targetScope));
            return queries.projectRow(c,actor.organizationId(),id);
        });
    }
    @FunctionalInterface interface Mutation { JsonNode apply(Connection c,OwnerSessionEligibility.EligibleActor actor)throws SQLException; }
    private record Reply(JsonNode value,RefusalReason refusal){}
    JsonNode command(ActorContext context,UUID operation,Scope scope,String action,String digest,Mutation mutation) {
        if(operation==null)throw new Refusal(RefusalReason.INVALID_INPUT);
        var attempt=UUID.randomUUID(); var correlation=UUID.randomUUID();
        final Reply reply;
        try {
            reply=transactions.executeOwner(context,new IdentityTransactions.OwnerCommand<Reply>() {
                private AuthorizationDecisionService.Decision request;
                private boolean replay;
                @Override public void revalidate(Connection c,OwnerSessionEligibility.EligibleActor actor)throws SQLException {
                    var current=authorization.evaluate(c,context,action,scope);
                    if(request==null){request=current;return;}
                    if(request.rbacGranted())require(current);
                    if(!replay)retain(c,attempt,operation,"COMMIT",current);
                }
                @Override public Reply apply(Connection c,OwnerSessionEligibility.EligibleActor actor)throws SQLException {
                    if(!request.rbacGranted()){
                        retain(c,attempt,operation,"REQUEST",request);
                        audit(c,operation,actor.actorId(),"project.authorization.refused",scope.organizationId(),"REFUSED","AUTHORITY_REFUSED");
                        return new Reply(null,RefusalReason.AUTHORITY_REFUSED);
                    }
                    try(var q=c.prepareStatement("SELECT actor_id,organization_id,action,input_digest,outcome,reason_code,result::text FROM project_owner_outcome WHERE operation_id=?")){
                        q.setObject(1,operation);try(var row=q.executeQuery()){
                            if(row.next()){
                                replay=true;
                                if(!actor.actorId().equals(row.getObject(1,UUID.class)) || !actor.organizationId().equals(row.getObject(2,UUID.class)))return new Reply(null,RefusalReason.AUTHORITY_REFUSED);
                                if(!action.equals(row.getString(3)) || !digest.equals(row.getString(4)))return new Reply(null,RefusalReason.STATE_CONFLICT);
                                return new Reply(json.readTree(row.getString(7)),"REFUSED".equals(row.getString(5))?RefusalReason.valueOf(row.getString(6)):null);
                            }
                        }
                    }
                    retain(c,attempt,operation,"REQUEST",request);
                    JsonNode result; RefusalReason refused=null;
                    var savepoint=c.setSavepoint();
                    try { result=mutation.apply(c,actor); }
                    catch(Refusal business){c.rollback(savepoint);refused=business.reason();result=json.createObjectNode();}
                    finally { c.releaseSavepoint(savepoint); }
                    var target=result.has("projectId")?UUID.fromString(result.path("projectId").asString()):scope.projectId();
                    if(target==null)target=scope.organizationId();
                    var outcome=refused==null?"ACCEPTED":"REFUSED";
                    insert(c,"INSERT INTO project_owner_outcome(operation_id,actor_id,organization_id,action,input_digest,target_id,outcome,reason_code,correlation_id,result) VALUES (?,?,?,?,?,?,?,?,?,?::jsonb)",
                            operation,actor.actorId(),actor.organizationId(),action,digest,target,outcome,refused==null?null:refused.name(),correlation,json.writeValueAsString(result));
                    audit(c,operation,actor.actorId(),action,target,outcome,refused==null?null:refused.name());
                    return new Reply(result,refused);
                }
            });
        } catch(IdentityRefusal refused){throw new Refusal(RefusalReason.INELIGIBLE_SESSION);}
        if(reply.refusal()!=null)throw new Refusal(reply.refusal());
        return reply.value();
    }
    private void retain(Connection c,UUID attempt,UUID operation,String stage,AuthorizationDecisionService.Decision d)throws SQLException {
        insert(c,"INSERT INTO project_authorization_evidence(evidence_id,attempt_id,operation_id,stage,actor_id,organization_id,project_id,permission_code,evaluated_at,eligible,granted,paths,reason_code) VALUES (?,?,?,?,?,?,?,?,?,?,?,?::jsonb,?)",
                UUID.randomUUID(),attempt,operation,stage,d.actorId(),d.scope().organizationId(),d.scope().projectId(),d.permission(),Timestamp.from(d.evaluatedAt()),d.eligible(),d.rbacGranted(),json.writeValueAsString(d.paths()),d.refusal());
    }
    private static void audit(Connection c,UUID operation,UUID actor,String action,UUID target,String outcome,String reason)throws SQLException {
        insert(c,"INSERT INTO audit_evidence(evidence_id,operation_id,actor_id,action,target_type,target_id,outcome,reason_code) VALUES (?,?,?,?,?,?,?,?)",
                UUID.randomUUID(),operation,actor,action,"Project Governance",target.toString(),outcome,reason);
    }
    @FunctionalInterface interface Projection<T>{T apply(Connection c,OwnerSessionEligibility.EligibleActor actor)throws SQLException;}
    <T>T read(ActorContext context,Projection<T> projection){
        try(var c=source.getConnection()){
            c.setReadOnly(true);c.setTransactionIsolation(Connection.TRANSACTION_REPEATABLE_READ);c.setAutoCommit(false);
            try{var actor=eligibility.admit(c,context);var result=projection.apply(c,actor);eligibility.admit(c,context);c.commit();return result;}
            catch(IdentityRefusal refused){c.rollback();throw new Refusal(RefusalReason.INELIGIBLE_SESSION);}
            catch(SQLException|RuntimeException failed){c.rollback();throw failed;}
        }catch(SQLException failed){throw new Refusal(RefusalReason.UNAVAILABLE);}
    }
    static void require(AuthorizationDecisionService.Decision decision){
        if(!decision.eligible())throw new Refusal(RefusalReason.INELIGIBLE_SESSION);
        if(!decision.rbacGranted())throw new Refusal(RefusalReason.AUTHORITY_REFUSED);
    }
    static String text(String raw,int maximum){
        if(raw==null)throw new Refusal(RefusalReason.INVALID_INPUT);
        var value=raw.trim();if(value.isEmpty()||value.length()>maximum||raw.codePoints().anyMatch(Character::isISOControl))throw new Refusal(RefusalReason.INVALID_INPUT);
        return value;
    }
    static Scope scope(UUID organization,UUID project){if(organization==null)throw new Refusal(RefusalReason.INVALID_INPUT);return project==null?Scope.organization(organization):Scope.project(organization,project);}
    String digest(Object normalized){
        try{return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(json.writeValueAsString(normalized).getBytes(StandardCharsets.UTF_8)));}
        catch(java.security.NoSuchAlgorithmException impossible){throw new IllegalStateException(impossible);}
    }
    static void insert(Connection c,String sql,Object...values)throws SQLException{
        try(var q=c.prepareStatement(sql)){for(int i=0;i<values.length;i++)q.setObject(i+1,values[i]);if(q.executeUpdate()!=1)throw new SQLException("Required Project write missing");}
    }
}
