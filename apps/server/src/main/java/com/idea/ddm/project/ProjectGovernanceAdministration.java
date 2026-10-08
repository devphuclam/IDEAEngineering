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
                    return json.valueToTree(withActions(c,context,queries.projectRow(c,actor.organizationId(),id)));
                });
    }
    public ProjectGovernanceQueries.Project project(ActorContext context, UUID organization, UUID id, boolean participant) {
        return read(context,(c,actor)->{
            var targetScope=scope(organization==null?actor.organizationId():organization,id);
            require(authorization.evaluate(c,context,participant?"project.read":"project.admin.read",targetScope));
            return participant?queries.projectRow(c,actor.organizationId(),id):withActions(c,context,queries.projectRow(c,actor.organizationId(),id));
        });
    }
    public ProjectGovernanceQueries.Page<ProjectGovernanceQueries.Project> projects(ActorContext context,UUID organization,String filter,int offset,int limit){
        pageInput(filter,offset,limit);
        return read(context,(c,actor)->{
            var org=organization==null?actor.organizationId():organization;
            if(!actor.organizationId().equals(org))throw new Refusal(RefusalReason.AUTHORITY_REFUSED);
            boolean granted=authorization.evaluate(c,context,"project.admin.read",Scope.organization(org)).rbacGranted();
            var authorized=new ArrayList<ProjectGovernanceQueries.Project>();
            try(var q=c.prepareStatement("SELECT project_id FROM project WHERE organization_id=? ORDER BY project_id")){
                q.setObject(1,org);try(var r=q.executeQuery()){while(r.next()){
                    var id=r.getObject(1,UUID.class);
                    if(!authorization.evaluate(c,context,"project.admin.read",Scope.project(org,id)).rbacGranted())continue;
                    granted=true;var project=withActions(c,context,queries.projectRow(c,org,id));
                    if(project.name().toLowerCase(Locale.ROOT).contains(filter.toLowerCase(Locale.ROOT)))authorized.add(project);
                }}
            }
            if(!granted)throw new Refusal(RefusalReason.AUTHORITY_REFUSED);
            int start=Math.min(offset,authorized.size()),end=Math.min(start+limit,authorized.size());
            return new ProjectGovernanceQueries.Page<>(authorized.subList(start,end),offset,limit,end<authorized.size());
        });
    }
    public ProjectGovernanceQueries.Page<ProjectGovernanceQueries.Group> groups(ActorContext context,UUID organization,UUID project,String filter,int offset,int limit){
        pageInput(filter,offset,limit);
        return read(context,(c,actor)->{
            var org=organization==null?actor.organizationId():organization;
            require(authorization.evaluate(c,context,"project.admin.read",Scope.project(org,project)));
            queries.projectRow(c,org,project);var items=new ArrayList<ProjectGovernanceQueries.Group>();
            try(var q=c.prepareStatement("SELECT group_id FROM business_group WHERE project_id=? AND organization_id=? AND strpos(lower(display_name),lower(?))>0 ORDER BY group_id OFFSET ? LIMIT ?")){
                q.setObject(1,project);q.setObject(2,org);q.setString(3,filter);q.setInt(4,offset);q.setInt(5,limit+1);
                try(var r=q.executeQuery()){while(r.next())items.add(queries.groupRow(c,org,r.getObject(1,UUID.class)));}
            }
            boolean more=items.size()>limit;if(more)items.remove(items.size()-1);
            return new ProjectGovernanceQueries.Page<>(items,offset,limit,more);
        });
    }
    public ProjectGovernanceQueries.Group group(ActorContext context,UUID organization,UUID id){
        return read(context,(c,actor)->{
            var org=organization==null?actor.organizationId():organization;
            var target=groupScope(c,context,org,id,"project.admin.read");
            require(authorization.evaluate(c,context,"project.admin.read",target));return queries.groupRow(c,org,id);
        });
    }
    public ProjectGovernanceQueries.ParticipationPage members(ActorContext context,UUID organization,UUID id,boolean group,String filter,int offset,int limit){
        pageInput(filter,offset,limit);
        return read(context,(c,actor)->{
            var org=organization==null?actor.organizationId():organization;
            var target=group?groupScope(c,context,org,id,"project.admin.read"):Scope.project(org,id);
            require(authorization.evaluate(c,context,"project.admin.read",target));
            return queries.members(c,org,target.projectId(),group?id:null,filter,offset,limit,clock.instant());
        });
    }
    private Scope groupScope(Connection c,ActorContext context,UUID org,UUID id,String permission)throws SQLException{
        if(!eligibility.admit(c,context).organizationId().equals(org))throw new Refusal(RefusalReason.AUTHORITY_REFUSED);
        // Only the parent ID is resolved internally; no metadata is returned before its exact authorization.
        UUID project;
        try(var q=c.prepareStatement("SELECT project_id FROM business_group WHERE group_id=? AND organization_id=?")){
            q.setObject(1,id);q.setObject(2,org);try(var r=q.executeQuery()){
                if(!r.next()){
                    require(authorization.evaluate(c,context,permission,Scope.organization(org)));
                    throw new Refusal(RefusalReason.TARGET_NOT_AVAILABLE);
                }project=r.getObject(1,UUID.class);
            }
        }
        return Scope.project(org,project);
    }
    public JsonNode rename(ActorContext context,UUID operation,Scope scope,UUID id,boolean group,String name,long expected,String reason){
        if(scope==null || id==null)throw new Refusal(RefusalReason.INVALID_INPUT);
        var normalizedName=text(name,200);var normalizedReason=text(reason,500);positive(expected);
        var action=group?"project.group.update":"project.update";
        return command(context,operation,scope,action,digest(List.of(action,id.toString(),scope,normalizedName,expected,normalizedReason)),(c,actor)->{
            UUID project=group?queries.groupRow(c,actor.organizationId(),id).projectId():queries.projectRow(c,actor.organizationId(),id).projectId();
            matches(scope,actor.organizationId(),project);
            changed(c,group?"SELECT project_group_change(?,?,?,?)":"SELECT project_change(?,?,?,?)",id,actor.organizationId(),expected,normalizedName);
            return json.valueToTree(group?queries.groupRow(c,actor.organizationId(),id):withActions(c,context,queries.projectRow(c,actor.organizationId(),id)));
        });
    }
    public JsonNode createGroup(ActorContext context,UUID operation,Scope scope,UUID project,String name,long expectedProjectVersion,String reason){
        if(scope==null || project==null)throw new Refusal(RefusalReason.INVALID_INPUT);
        var normalizedName=text(name,200);var normalizedReason=text(reason,500);positive(expectedProjectVersion);
        return command(context,operation,scope,"project.group.create",digest(List.of("project.group.create",scope,project,normalizedName,expectedProjectVersion,normalizedReason)),(c,actor)->{
            queries.projectRow(c,actor.organizationId(),project);matches(scope,actor.organizationId(),project);
            changed(c,"SELECT project_change(?,?,?,?)",project,actor.organizationId(),expectedProjectVersion,null);
            var id=UUID.randomUUID();insert(c,"INSERT INTO business_group(group_id,project_id,organization_id,display_name,created_by,created_at) VALUES (?,?,?,?,?,?)",id,project,actor.organizationId(),normalizedName,actor.actorId(),Timestamp.from(clock.instant()));
            return json.valueToTree(queries.groupRow(c,actor.organizationId(),id));
        });
    }
    static void matches(Scope scope,UUID org,UUID project){if(!org.equals(scope.organizationId()) || (scope.projectId()!=null&&!project.equals(scope.projectId())))throw new Refusal(RefusalReason.TARGET_NOT_AVAILABLE);}
    static void positive(long version){if(version<1)throw new Refusal(RefusalReason.INVALID_INPUT);}
    static void changed(Connection c,String sql,Object...args)throws SQLException{
        try(var q=c.prepareStatement(sql)){for(int i=0;i<args.length;i++)q.setObject(i+1,args[i]);try(var r=q.executeQuery()){if(!r.next()||!r.getBoolean(1))throw new Refusal(RefusalReason.STATE_CONFLICT);}}
    }
    static void pageInput(String filter,int offset,int limit){if(filter==null||filter.length()>200||filter.codePoints().anyMatch(Character::isISOControl)||offset<0||limit<1||limit>100)throw new Refusal(RefusalReason.INVALID_INPUT);}
    Clock clock(){return clock;}
    private ProjectGovernanceQueries.Project withActions(Connection c,ActorContext context,ProjectGovernanceQueries.Project project)throws SQLException{
        var scope=Scope.project(project.organizationId(),project.projectId());var actions=new ArrayList<String>();
        for(var action:ProjectGovernanceQueries.ADMIN_ACTIONS)if(authorization.evaluate(c,context,action,scope).rbacGranted())actions.add(action);
        return new ProjectGovernanceQueries.Project(project.projectId(),project.organizationId(),project.name(),project.version(),actions);
    }
    ProjectGovernanceQueries queries(){return queries;}
    JsonNode result(Object value){return json.valueToTree(value);}
    @FunctionalInterface interface Mutation { JsonNode apply(Connection c,OwnerSessionEligibility.EligibleActor actor)throws SQLException; }
    @FunctionalInterface interface CommitCheck { void validate(Connection c,OwnerSessionEligibility.EligibleActor actor)throws SQLException; }
    private record Reply(JsonNode value,RefusalReason refusal){}
    JsonNode command(ActorContext context,UUID operation,Scope scope,String action,String digest,Mutation mutation) {
        return command(context,operation,scope,action,digest,mutation,(c,actor)->{});
    }
    JsonNode command(ActorContext context,UUID operation,Scope scope,String action,String digest,Mutation mutation,CommitCheck commitCheck) {
        if(operation==null)throw new Refusal(RefusalReason.INVALID_INPUT);
        var attempt=UUID.randomUUID(); var correlation=UUID.randomUUID();
        final Reply reply;
        try {
            reply=transactions.executeOwner(context,new IdentityTransactions.OwnerCommand<Reply>() {
                private AuthorizationDecisionService.Decision request;
                private boolean replay;
                private boolean accepted;
                @Override public void revalidate(Connection c,OwnerSessionEligibility.EligibleActor actor)throws SQLException {
                    var current=authorization.evaluate(c,context,action,scope);
                    if(request==null){request=current;return;}
                    if(request.rbacGranted())require(current);
                    if(accepted&&!replay)commitCheck.validate(c,actor);
                    if(replay)require(authorization.evaluate(c,context,"project.admin.read",scope));
                    else retain(c,attempt,operation,"COMMIT",current,actor.organizationId());
                }
                @Override public Reply apply(Connection c,OwnerSessionEligibility.EligibleActor actor)throws SQLException {
                    if(!request.rbacGranted()){
                        retain(c,attempt,operation,"REQUEST",request,actor.organizationId());
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
                    retain(c,attempt,operation,"REQUEST",request,actor.organizationId());
                    JsonNode result; RefusalReason refused=null;
                    var savepoint=c.setSavepoint();
                    try { result=mutation.apply(c,actor); }
                    catch(Refusal business){c.rollback(savepoint);refused=business.reason();result=json.createObjectNode();}
                    finally { c.releaseSavepoint(savepoint); }
                    String targetField=result.has("membershipId")?"membershipId":result.has("groupId")?"groupId":"projectId";
                    var target=result.has(targetField)?UUID.fromString(result.path(targetField).asString()):scope.projectId();
                    if(target==null)target=scope.organizationId();
                    var outcome=refused==null?"ACCEPTED":"REFUSED";
                    accepted=refused==null;
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
    private void retain(Connection c,UUID attempt,UUID operation,String stage,AuthorizationDecisionService.Decision d,UUID originatingOrganization)throws SQLException {
        insert(c,"INSERT INTO project_authorization_evidence(evidence_id,attempt_id,operation_id,stage,actor_id,organization_id,project_id,permission_code,evaluated_at,eligible,granted,paths,reason_code) VALUES (?,?,?,?,?,?,?,?,?,?,?,?::jsonb,?)",
                UUID.randomUUID(),attempt,operation,stage,d.actorId(),originatingOrganization,d.scope().projectId(),d.permission(),Timestamp.from(d.evaluatedAt()),d.eligible(),d.rbacGranted(),json.writeValueAsString(Map.of("requestedScope",d.scope(),"grantPaths",d.paths())),d.refusal());
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
