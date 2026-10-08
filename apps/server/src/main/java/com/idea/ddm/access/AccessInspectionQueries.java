package com.idea.ddm.access;

import com.idea.ddm.iam.IamWebConfiguration.Refusal;
import com.idea.ddm.iam.IamWebConfiguration.RefusalReason;
import com.idea.ddm.identity.*;
import java.sql.*;
import java.time.Instant;
import java.util.*;
import static com.idea.ddm.access.AuthorizationDecisionService.*;

/** Authorized advisory reads. The same evaluator resolves every contributing path. */
public final class AccessInspectionQueries {
    public record Path(UUID assignmentId,UUID roleVersionId,String roleCode,int roleVersion,
            Scope assignmentScope,UUID groupId,UUID projectMembershipId,UUID groupMembershipId,
            UUID assignedBy,String reason,Instant assignedAt) {}
    public record Inspection(UUID actorId,Scope scope,String permissionCode,String implementationState,
            boolean accountEligible,boolean projectMembershipEligible,String rbacResult,
            String ownerBusinessGate,Instant evaluatedAt,List<Path> paths) {}
    public record Resolution(UUID operationId,String state,String owner,UUID actorId,Scope scope,
            String action,String outcome,String reasonCode,String correlationId,Instant occurredAt,String retryProfile) {}
    public record History(UUID operationId,String owner,UUID actorId,Scope scope,String action,String targetId,
            String outcome,String reasonCode,String reason,String correlationId,Instant occurredAt,
            Map<String,Object> before,Map<String,Object> after) {}
    public static final List<String> ACTIONS=List.of("audit.read");
    private final RoleCatalogueQueries reads;
    private final AuthorizationDecisionService authorization;
    AccessInspectionQueries(RoleCatalogueQueries reads,AuthorizationDecisionService authorization){this.reads=reads;this.authorization=authorization;}

    public Inspection inspect(ActorContext context,UUID target,String permission,Scope scope,UUID resource){
        if(target==null||scope==null||permission==null||permission.isBlank()||permission.length()>120)throw new Refusal(RefusalReason.INVALID_INPUT);
        // No resource owner has an approved inspection contract beyond the selected Project.
        if(resource!=null&&!resource.equals(scope.projectId()))throw new Refusal(RefusalReason.INVALID_INPUT);
        return reads.read(context,(c,caller)->{
            RoleCatalogueQueries.require(authorization.evaluate(c,context,"access.inspect",scope));
            try(var q=c.prepareStatement("SELECT 1 FROM permission_registry WHERE permission_code=?")){
                q.setString(1,permission);try(var r=q.executeQuery()){if(!r.next())throw new Refusal(RefusalReason.INVALID_INPUT);}
            }
            boolean eligible;
            try(var q=c.prepareStatement("SELECT a.status='ACTIVE' AND t.disabled_at IS NULL FROM idea_account a JOIN actor t USING(actor_id) WHERE a.actor_id=? AND a.organization_id=?")){
                q.setObject(1,target);q.setObject(2,scope.organizationId());try(var r=q.executeQuery()){
                    if(!r.next())throw new Refusal(RefusalReason.TARGET_NOT_AVAILABLE);eligible=r.getBoolean(1);
                }
            }
            var decision=authorization.inspectActor(c,new OwnerSessionEligibility.EligibleActor(target,scope.organizationId()),permission,scope);
            var paths=new ArrayList<Path>();
            if(eligible)for(var path:decision.paths())try(var q=c.prepareStatement("SELECT assigned_by,reason,assigned_at FROM identity_role_assignment WHERE assignment_id=?")){
                q.setObject(1,path.assignmentId());try(var r=q.executeQuery()){
                    if(!r.next())throw new SQLException("Required immutable provenance unavailable");
                    paths.add(new Path(path.assignmentId(),path.roleVersionId(),path.roleCode(),path.roleVersion(),path.assignmentScope(),path.groupId(),path.projectMembershipId(),path.groupMembershipId(),r.getObject(1,UUID.class),r.getString(2),r.getTimestamp(3).toInstant()));
                }
            }
            boolean member=false;
            if(scope.projectId()!=null)try(var q=c.prepareStatement("SELECT EXISTS(SELECT 1 FROM project_membership WHERE actor_id=? AND organization_id=? AND project_id=? AND ended_at IS NULL AND effective_from<=? AND (effective_until IS NULL OR effective_until>?))")){
                q.setObject(1,target);q.setObject(2,scope.organizationId());q.setObject(3,scope.projectId());q.setTimestamp(4,Timestamp.from(decision.evaluatedAt()));q.setTimestamp(5,Timestamp.from(decision.evaluatedAt()));try(var r=q.executeQuery()){r.next();member=eligible&&r.getBoolean(1);}
            }
            boolean implemented=RoleCatalogueQueries.implemented(permission);
            return new Inspection(target,scope,permission,implemented?"IMPLEMENTED":"DESIGN",eligible,member,
                    !implemented?"UNSUPPORTED":eligible&&!paths.isEmpty()?"ALLOW":"BLOCKED","NOT_EVALUATED",decision.evaluatedAt(),List.copyOf(paths));
        });
    }

    public RoleCatalogueQueries.Page<History> history(ActorContext context,Scope scope,UUID target,int offset,int limit){
        RoleCatalogueQueries.page("",offset,limit);
        return reads.read(context,(c,caller)->{
            RoleCatalogueQueries.require(authorization.evaluate(c,context,"audit.read",scope));
            var items=new ArrayList<History>();int skipped=0;boolean more=false;
            // Exact immutable owner outcomes only, not login activity, credentials or arbitrary Audit export.
            String sources="SELECT e.operation_id,'ASSIGNMENT'::text owner,e.actor_id,e.organization_id,"+CommittedAdministrationScope.ASSIGNMENT+" scope,'role.assignment.'||lower(e.action) action,o.target_id,o.outcome,o.reason_code,e.reason,e.correlation_id::text,e.occurred_at,e.before_state::text before_state,e.result::text result FROM assignment_owner_operation e JOIN access_policy_owner_outcome o USING(operation_id) UNION ALL "
                +"SELECT e.operation_id,'ROLE_DEFINITION',e.actor_id,e.organization_id,e.requested_scope::text,o.action,o.target_id,o.outcome,o.reason_code,e.reason,e.correlation_id::text,e.occurred_at,NULL::text,e.result::text FROM role_definition_owner_operation e JOIN access_policy_owner_outcome o USING(operation_id) UNION ALL "
                +"SELECT e.operation_id,'PROJECT',e.actor_id,e.organization_id,"+CommittedAdministrationScope.PROJECT+",e.action,e.target_id::text,e.outcome,e.reason_code,NULL::text,e.correlation_id::text,e.created_at,NULL::text,e.result::text FROM project_owner_outcome e UNION ALL "
                +"SELECT e.operation_id,'IAM',e.actor_id,a.organization_id,NULL::text,e.action,e.target_id,e.outcome,e.reason_code,NULL::text,NULL::text,e.occurred_at,NULL::text,NULL::text FROM iam_owner_outcome e JOIN idea_account a USING(actor_id) WHERE e.action IN ('account.create','account.disable','account.re-enable','account.credential.setup.issue','account.credential.reset.issue')";
            try(var q=c.prepareStatement("SELECT * FROM ("+sources+") h WHERE organization_id=? AND (?::text IS NULL OR target_id=?) ORDER BY occurred_at DESC,operation_id")){
                q.setObject(1,scope.organizationId());q.setString(2,target==null?null:target.toString());q.setString(3,target==null?null:target.toString());
                try(var r=q.executeQuery()){while(r.next()){
                    String owner=r.getString("owner"),serialized=r.getString("scope");
                    if(serialized==null&&!"IAM".equals(owner))continue;
                    var retained=serialized==null?Scope.organization(scope.organizationId()):new tools.jackson.databind.json.JsonMapper().readValue(serialized,Scope.class);
                    if(!scope.equals(retained))continue;
                    var id=r.getObject("operation_id",UUID.class);var actor=r.getObject("actor_id",UUID.class);
                    if(!com.idea.ddm.audit.AuditEvidenceRepository.hasAdministrationCompanion(c,id,actor,r.getString("action"),r.getString("outcome")))continue;
                    if(skipped++<offset)continue;if(items.size()==limit){more=true;break;}
                    items.add(new History(id,owner,actor,retained,r.getString("action"),r.getString("target_id"),r.getString("outcome"),r.getString("reason_code"),r.getString("reason"),r.getString("correlation_id"),r.getTimestamp("occurred_at").toInstant(),snapshot(owner,r.getString("before_state"),false),"ACCEPTED".equals(r.getString("outcome"))?snapshot(owner,r.getString("result"),true):null));
                }}
            }
            return new RoleCatalogueQueries.Page<>(List.copyOf(items),offset,limit,more);
        });
    }

    /** Project/IAM did not retain complete prior-state snapshots; null explicitly means not retained. */
    private static Map<String,Object> snapshot(String owner,String serialized,boolean after){
        if(serialized==null)return null;var json=new tools.jackson.databind.json.JsonMapper();var value=json.readTree(serialized);
        if("ASSIGNMENT".equals(owner)&&after&&value.has("successor"))value=value.path("successor");
        var fields=switch(owner){
            case "ASSIGNMENT" -> List.of("assignmentId","roleVersionId","roleCode","roleVersion","effectiveFrom","effectiveUntil","assignedBy","reason","revokedAt","version");
            case "ROLE_DEFINITION" -> List.of("candidateId","definitionId","roleCode","displayName","baseVersionId","proposedRoleVersion","permissionCodes","version","state","activatedVersionId");
            case "PROJECT" -> List.of("projectId","groupId","membershipId","targetActorId","name","version","effectiveFrom","effectiveUntil","endedAt");
            default -> List.<String>of();
        };
        var safe=new LinkedHashMap<String,Object>();for(String field:fields){var v=value.path(field);if(v.isMissingNode()||v.isNull())continue;if(v.isString())safe.put(field,v.asString());else if(v.isNumber())safe.put(field,v.asLong());else if("permissionCodes".equals(field)&&v.isArray())safe.put(field,v.valueStream().map(tools.jackson.databind.JsonNode::asString).toList());}
        return safe.isEmpty()?null:Collections.unmodifiableMap(safe);
    }

    public Resolution operation(ActorContext context,UUID id,Scope scope){
        if(id==null||scope==null)throw new Refusal(RefusalReason.INVALID_INPUT);
        return reads.read(context,(c,caller)->{
            boolean inspect=authorization.evaluate(c,context,"access.inspect",scope).rbacGranted();
            boolean account=authorization.evaluate(c,context,"account.read",scope).rbacGranted();
            boolean project=authorization.evaluate(c,context,"project.admin.read",scope).rbacGranted();
            boolean role=authorization.evaluate(c,context,"role.catalogue.read",scope).rbacGranted();
            if(!inspect&&!account&&!project&&!role)throw new Refusal(RefusalReason.AUTHORITY_REFUSED);
            // Fixed owner-specific projections, not arbitrary table/JSON export or a replay service.
            var queries=List.of(
                new OperationSource("ASSIGNMENT","SELECT e.actor_id,e.organization_id,e.action,o.outcome,o.reason_code,e.correlation_id::text,e.occurred_at,"+CommittedAdministrationScope.ASSIGNMENT+" FROM assignment_owner_operation e JOIN access_policy_owner_outcome o USING(operation_id) WHERE e.operation_id=?",inspect),
                new OperationSource("ROLE_DEFINITION","SELECT e.actor_id,e.organization_id,e.action,o.outcome,o.reason_code,e.correlation_id::text,e.occurred_at,e.requested_scope::text FROM role_definition_owner_operation e JOIN access_policy_owner_outcome o USING(operation_id) WHERE e.operation_id=?",role),
                new OperationSource("PROJECT","SELECT e.actor_id,e.organization_id,e.action,e.outcome,e.reason_code,e.correlation_id::text,e.created_at,"+CommittedAdministrationScope.PROJECT+" FROM project_owner_outcome e WHERE e.operation_id=?",project),
                new OperationSource("IAM","SELECT e.actor_id,a.organization_id,e.action,e.outcome,e.reason_code,NULL::text,e.occurred_at,NULL::text FROM iam_owner_outcome e JOIN idea_account a USING(actor_id) WHERE e.operation_id=?",account));
            for(var source:queries)try(var q=c.prepareStatement(source.sql())){
                q.setObject(1,id);try(var r=q.executeQuery()){
                    if(!r.next())continue;
                    var originating=r.getObject(1,UUID.class);var org=r.getObject(2,UUID.class);
                    if(r.getString(8)==null&&!"IAM".equals(source.owner()))return unresolved(id);
                    var retained=r.getString(8)==null?Scope.organization(org):new tools.jackson.databind.json.JsonMapper().readValue(r.getString(8),Scope.class);
                    // Absent and undisclosable are identical unresolved results, not rollback proof.
                    if(!retained.equals(scope)||!org.equals(caller.organizationId())||(!originating.equals(caller.actorId())&&!inspect)||!source.readable())return unresolved(id);
                    return new Resolution(id,"ACCEPTED".equals(r.getString(4))?"COMMITTED_ACCEPTED":"COMMITTED_REFUSED",source.owner(),originating,retained,r.getString(3),r.getString(4),r.getString(5),r.getString(6),r.getTimestamp(7).toInstant(),"IAM".equals(source.owner())?"METADATA_ONLY_NO_SAFE_REPLAY":"SAME_ID_UNCHANGED_INPUT_ONLY");
                }
            }
            return unresolved(id);
        });
    }
    private record OperationSource(String owner,String sql,boolean readable) {}
    private static Resolution unresolved(UUID id){return new Resolution(id,"UNRESOLVED",null,null,null,null,null,null,null,null,null);}
}
