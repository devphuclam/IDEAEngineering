package com.idea.ddm.access;

import com.idea.ddm.access.AuthorizationDecisionService.Scope;
import com.idea.ddm.iam.IamWebConfiguration.Refusal;
import com.idea.ddm.iam.IamWebConfiguration.RefusalReason;
import com.idea.ddm.identity.*;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.sql.*;
import java.time.*;
import java.util.*;
import javax.sql.DataSource;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.json.JsonMapper;

/** Access Policy owner. Every write is coordinated with current IAM, delegation and retained evidence. */
public final class RoleAssignmentAdministration {
    public record Principal(String kind,UUID actorId,UUID groupId){
        public Principal{if(!("ACTOR".equals(kind)&&actorId!=null&&groupId==null)&&!("PROJECT_GROUP".equals(kind)&&groupId!=null&&actorId==null))throw new Refusal(RefusalReason.INVALID_INPUT);}
    }
    public record Interval(Instant effectiveFrom,Instant effectiveUntil){}
    public record Assignment(UUID assignmentId,Principal principal,Scope scope,UUID roleVersionId,String roleCode,int roleVersion,
            Instant effectiveFrom,Instant effectiveUntil,UUID assignedBy,String reason,Instant assignedAt,
            Instant revokedAt,UUID endedBy,String endReason,long version,boolean effective){}
    public record Preview(boolean allowed,RoleCatalogueQueries.Role role,Principal principal,Scope scope,Interval interval,
            Assignment before,RoleCatalogueQueries.Role beforeRole,RoleDefinitionCandidateService.Difference difference,
            List<String> consequences,String refusalReason){}
    private record Intent(String kind,Principal principal,Scope scope,UUID roleVersionId,UUID predecessor,long expectedVersion,Interval interval,String reason){}
    private record Targets(Principal principal,RoleCatalogueQueries.Role role,Assignment before){}
    private record Authority(List<AuthorizationDecisionService.Decision> decisions,boolean delegated){}
    private record Reply(JsonNode result,RefusalReason refusal){}
    public static final List<String> ACTIONS=List.of("role.catalogue.read","access.inspect","role.assignment.manage.business","role.assignment.manage.administration","role.assignment.manage.highest");
    private final IdentityTransactions transactions;
    private final AuthorizationDecisionService authorization;
    private final RoleCatalogueQueries catalogue;
    private final Clock clock;
    private final JsonMapper json=JsonMapper.builder().build();
    public RoleAssignmentAdministration(IdentityTransactions transactions,AuthorizationDecisionService authorization,RoleCatalogueQueries catalogue,Clock clock){this.transactions=transactions;this.authorization=authorization;this.catalogue=catalogue;this.clock=clock;}

    public RoleCatalogueQueries.Page<Assignment> assignments(ActorContext context,Scope scope,UUID actor,UUID group,int offset,int limit){
        RoleCatalogueQueries.page("",offset,limit);if(actor!=null&&group!=null)throw new Refusal(RefusalReason.INVALID_INPUT);
        return catalogue.read(context,(c,who)->{
            RoleCatalogueQueries.require(authorization.evaluate(c,context,"access.inspect",scope));var items=new ArrayList<Assignment>();
            try(var q=c.prepareStatement("SELECT assignment_id FROM identity_role_assignment WHERE organization_id=? AND scope_kind=? AND project_id IS NOT DISTINCT FROM ? AND (?::uuid IS NULL OR principal_actor_id=?) AND (?::uuid IS NULL OR principal_group_id=?) ORDER BY assignment_id OFFSET ? LIMIT ?")){
                q.setObject(1,scope.organizationId());q.setString(2,scope.kind().name());q.setObject(3,scope.projectId());q.setObject(4,actor);q.setObject(5,actor);q.setObject(6,group);q.setObject(7,group);q.setInt(8,offset);q.setInt(9,limit+1);
                try(var r=q.executeQuery()){while(r.next())items.add(row(c,r.getObject(1,UUID.class),scope));}
            }
            boolean more=items.size()>limit;if(more)items.remove(items.size()-1);return new RoleCatalogueQueries.Page<>(List.copyOf(items),offset,limit,more);
        });
    }
    public Assignment assignment(ActorContext context,Scope scope,UUID id){return catalogue.read(context,(c,who)->{RoleCatalogueQueries.require(authorization.evaluate(c,context,"access.inspect",scope));return row(c,id,scope);});}
    public Preview preview(ActorContext context,Principal principal,Scope scope,UUID role,Interval interval,UUID predecessor,long expected,JsonNode condition){
        var intent=intent(predecessor==null?"GRANT":"REPLACE",principal,scope,role,predecessor,expected,interval,"Preview only",condition);
        return catalogue.read(context,(c,who)->{
            requireAnyAssignmentAuthority(c,context,scope);
            var targets=targets(c,intent);var authority=authority(c,context,intent,targets);
            for(var decision:authority.decisions())RoleCatalogueQueries.require(decision);
            verifyTargets(c,intent,targets,true);if(targets.before()!=null)expected(targets.before(),expected);
            boolean self=forbiddenSelf(context,intent,targets,authority);
            var consequences=new ArrayList<String>();consequences.add("Independent exact-version assignment; no Project or Group membership is created.");
            if(scope.kind()==AuthorizationDecisionService.ScopeKind.ORGANIZATION)consequences.add("Organization breadth: applicable descendant Projects only where the role profile supports them.");
            if("PROJECT_GROUP".equals(targets.principal().kind()))consequences.add("Only current eligible Project + Group members receive participant access.");
            if(targets.before()!=null)consequences.add("The predecessor ends atomically; the successor has a new ID. History and other roles are retained.");
            var beforeRole=targets.before()==null?null:RoleCatalogueQueries.role(c,targets.before().roleVersionId());
            var prior=beforeRole==null?Set.<String>of():beforeRole.permissions().stream().map(RoleCatalogueQueries.Permission::code).collect(java.util.stream.Collectors.toSet());
            var next=targets.role().permissions().stream().map(RoleCatalogueQueries.Permission::code).collect(java.util.stream.Collectors.toSet());
            var difference=new RoleDefinitionCandidateService.Difference(next.stream().filter(p->!prior.contains(p)).sorted().toList(),prior.stream().filter(p->!next.contains(p)).sorted().toList(),next.stream().filter(prior::contains).sorted().toList());
            return new Preview(authority.delegated()&&!self,targets.role(),targets.principal(),scope,intent.interval(),targets.before(),beforeRole,difference,List.copyOf(consequences),authority.delegated()&&!self?null:"DELEGATION_REFUSED");
        });
    }
    public JsonNode grant(ActorContext context,UUID operation,Principal principal,Scope scope,UUID role,Interval interval,String reason,JsonNode condition){return command(context,operation,intent("GRANT",principal,scope,role,null,0,interval,reason,condition));}
    public JsonNode end(ActorContext context,UUID operation,Scope scope,UUID id,long expected,String reason){return command(context,operation,intent("END",null,scope,null,id,expected,null,reason,null));}
    public JsonNode replace(ActorContext context,UUID operation,Scope scope,UUID id,long expected,UUID role,Interval interval,String reason,JsonNode condition){return command(context,operation,intent("REPLACE",null,scope,role,id,expected,interval,reason,condition));}

    private JsonNode command(ActorContext context,UUID operation,Intent intent){
        if(operation==null)throw new Refusal(RefusalReason.INVALID_INPUT);
        var digest=digest(intent);var attempt=UUID.randomUUID();var correlation=UUID.randomUUID();
        final Reply reply;
        try{reply=transactions.executeOwner(context,new IdentityTransactions.OwnerCommand<Reply>(){
            Targets targets;Authority initial;boolean replay,accepted;Reply cached;Scope replayScope;
            @Override public void revalidate(Connection c,OwnerSessionEligibility.EligibleActor actor)throws SQLException{
                if(initial==null&&!replay){
                    // Resolve a committed intent before touching changed/obsolete target inputs.
                    try(var q=c.prepareStatement("SELECT e.actor_id,e.organization_id,e.action,e.input_digest,e.result::text,o.outcome,o.reason_code,"+CommittedAdministrationScope.ASSIGNMENT+" FROM assignment_owner_operation e JOIN access_policy_owner_outcome o USING(operation_id) WHERE e.operation_id=?")){
                        q.setObject(1,operation);try(var r=q.executeQuery()){if(r.next()){
                            replay=true;
                            if(r.getString(8)==null)throw new Refusal(RefusalReason.UNAVAILABLE);
                            var value=json.readTree(r.getString(8));
                            replayScope=new Scope(AuthorizationDecisionService.ScopeKind.valueOf(value.path("kind").asString()),UUID.fromString(value.path("organizationId").asString()),value.path("projectId").isNull()?null:UUID.fromString(value.path("projectId").asString()));
                            if(!actor.actorId().equals(r.getObject(1,UUID.class))||!actor.organizationId().equals(r.getObject(2,UUID.class)))cached=new Reply(null,RefusalReason.AUTHORITY_REFUSED);
                            else if(!intent.kind().equals(r.getString(3))||!digest.equals(r.getString(4)))cached=new Reply(null,RefusalReason.STATE_CONFLICT);
                            else cached=new Reply(json.readTree(r.getString(5)),"REFUSED".equals(r.getString(6))?RefusalReason.valueOf(r.getString(7)):null);
                        }}
                    }
                    if(!replay){requireAnyAssignmentAuthority(c,context,intent.scope());targets=targets(c,intent);initial=authority(c,context,intent,targets);return;}
                }
                if(replay){RoleCatalogueQueries.require(authorization.evaluate(c,context,"access.inspect",replayScope));return;}
                var current=authority(c,context,intent,targets);
                if(accepted){requireAuthority(current);verifyTargets(c,intent,targets,!"END".equals(intent.kind()));if(forbiddenSelf(context,intent,targets,current))throw new Refusal(RefusalReason.AUTHORITY_REFUSED);}
                retain(c,attempt,operation,"COMMIT",actor.organizationId(),intent.scope(),current);
            }
            @Override public Reply apply(Connection c,OwnerSessionEligibility.EligibleActor actor)throws SQLException{
                if(replay)return cached;
                // Legacy operations are not silently reused as this successor command envelope.
                try(var q=c.prepareStatement("SELECT 1 FROM access_policy_owner_outcome WHERE operation_id=?")){q.setObject(1,operation);try(var r=q.executeQuery()){if(r.next())return new Reply(null,RefusalReason.STATE_CONFLICT);}}
                retain(c,attempt,operation,"REQUEST",actor.organizationId(),intent.scope(),initial);
                if(initial.decisions().stream().anyMatch(d->!d.rbacGranted())||!initial.delegated()){
                    audit(c,operation,actor.actorId(),intent.kind(),intent.scope().organizationId(),"REFUSED","AUTHORITY_REFUSED");return new Reply(null,RefusalReason.AUTHORITY_REFUSED);
                }
                JsonNode result;RefusalReason refused=null;var savepoint=c.setSavepoint();
                try{
                    if(forbiddenSelf(context,intent,targets,initial))throw new Refusal(RefusalReason.AUTHORITY_REFUSED);
                    verifyTargets(c,intent,targets,!"END".equals(intent.kind()));
                    if(targets.before()!=null)expected(targets.before(),intent.expectedVersion());
                    var now=clock.instant();
                    if(targets.before()!=null)endRow(c,actor,targets.before(),intent.reason(),now);
                    if("END".equals(intent.kind()))result=json.valueToTree(row(c,targets.before().assignmentId(),intent.scope()));
                    else{
                        var id=insertAssignment(c,actor,intent,targets,now);var after=row(c,id,intent.scope());
                        result="GRANT".equals(intent.kind())?json.valueToTree(after):json.valueToTree(Map.of("predecessor",row(c,targets.before().assignmentId(),intent.scope()),"successor",after));
                    }
                    if(targets.before()!=null&&isSuper(targets.before().roleCode(),targets.before().roleVersion())&&targets.before().effective())recovery(c,actor.organizationId(),now);
                }catch(Refusal business){c.rollback(savepoint);refused=business.reason();result=json.createObjectNode();}
                finally{c.releaseSavepoint(savepoint);}
                accepted=refused==null;var outcome=accepted?"ACCEPTED":"REFUSED";var target=targets.before()==null?targets.principal().actorId()==null?targets.principal().groupId():targets.principal().actorId():targets.before().assignmentId();
                insert(c,"INSERT INTO access_policy_owner_outcome(operation_id,actor_id,action,target_id,outcome,reason_code) VALUES (?,?,?,?,?,?)",operation,actor.actorId(),"role.assignment."+intent.kind().toLowerCase(Locale.ROOT),target.toString(),outcome,accepted?null:refused.name());
                insert(c,"INSERT INTO assignment_owner_operation(operation_id,actor_id,organization_id,action,input_digest,correlation_id,reason,result,before_state) VALUES (?,?,?,?,?,?,?,?::jsonb,?::jsonb)",operation,actor.actorId(),actor.organizationId(),intent.kind(),digest,correlation,intent.reason(),json.writeValueAsString(result),targets.before()==null?null:json.writeValueAsString(targets.before()));
                audit(c,operation,actor.actorId(),intent.kind(),target,outcome,accepted?null:refused.name());return new Reply(result,refused);
            }
        });}catch(IdentityRefusal refused){throw new Refusal(RefusalReason.INELIGIBLE_SESSION);}
        if(reply.refusal()!=null)throw new Refusal(reply.refusal());return reply.result();
    }
    private Targets targets(Connection c,Intent i)throws SQLException{
        var before=i.predecessor()==null?null:row(c,i.predecessor(),i.scope());
        var principal=before==null?i.principal():before.principal();
        if(i.principal()!=null&&before!=null&&!principal.equals(i.principal()))throw new Refusal(RefusalReason.INVALID_INPUT);
        return new Targets(principal,RoleCatalogueQueries.role(c,i.roleVersionId()==null?before.roleVersionId():i.roleVersionId()),before);
    }
    private Authority authority(Connection c,ActorContext context,Intent i,Targets t)throws SQLException{
        var roles=new ArrayList<RoleCatalogueQueries.Role>();roles.add(t.role());
        if(t.before()!=null&&!t.before().roleVersionId().equals(t.role().roleVersionId()))roles.add(RoleCatalogueQueries.role(c,t.before().roleVersionId()));
        var decisions=new ArrayList<AuthorizationDecisionService.Decision>();boolean allowed=true;
        for(var role:roles){
            var permission=permission(role);var authorityScope=permission.equals("role.assignment.manage.highest")?Scope.organization(i.scope().organizationId()):i.scope();
            var d=authorization.evaluate(c,context,permission,authorityScope);decisions.add(d);
            allowed&=d.paths().stream().anyMatch(path->envelope(path,role,i.scope(),t.principal()));
        }
        return new Authority(List.copyOf(decisions),allowed);
    }
    private static String permission(RoleCatalogueQueries.Role r){return switch(r.classification()){case "BUSINESS"->"role.assignment.manage.business";case "HIGHEST"->"role.assignment.manage.highest";default->"role.assignment.manage.administration";};}
    private void requireAnyAssignmentAuthority(Connection c,ActorContext context,Scope scope)throws SQLException{
        for(var action:List.of("role.assignment.manage.business","role.assignment.manage.administration","role.assignment.manage.highest")){
            var evaluated=action.equals("role.assignment.manage.highest")?Scope.organization(scope.organizationId()):scope;
            if(authorization.evaluate(c,context,action,evaluated).rbacGranted())return;
        }
        throw new Refusal(RefusalReason.AUTHORITY_REFUSED);
    }
    private static boolean envelope(AuthorizationDecisionService.GrantPath path,RoleCatalogueQueries.Role target,Scope scope,Principal principal){
        if(!path.assignmentScope().organizationId().equals(scope.organizationId())||(path.assignmentScope().projectId()!=null&&!path.assignmentScope().projectId().equals(scope.projectId())))return false;
        // Built-in declaration is exact code AND version, on this same applicable permission path.
        boolean super2=path.roleCode().equals("super-administrator")&&path.roleVersion()==2;
        boolean pra=path.roleCode().equals("privileged-role-administrator")&&path.roleVersion()==1;
        boolean pa=path.roleCode().equals("project-administrator")&&path.roleVersion()==1;
        if(target.builtIn()){
            if(!"ACTOR".equals(principal.kind()))return false;
            boolean highest=isSuper(target.roleCode(),target.version())||(target.roleCode().equals("privileged-role-administrator")&&target.version()==1);
            if(highest)return super2;
            boolean exact=(target.roleCode().equals("account-administrator")&&Set.of(1,2,3).contains(target.version()))||(target.roleCode().equals("project-administrator")&&target.version()==1)||(target.roleCode().equals("audit-reader")&&target.version()==1);
            return exact&&(super2||pra);
        }
        var content=target.permissions().stream().map(RoleCatalogueQueries.Permission::code).toList();
        if("BUSINESS".equals(target.classification()))return (pra||pa)&&content.equals(List.of("project.read"));
        return pra&&"ACTOR".equals(principal.kind())&&!content.isEmpty()&&Set.of("project.read","audit.read","role.catalogue.read","access.inspect").containsAll(content);
    }
    private void verifyTargets(Connection c,Intent i,Targets t,boolean assigning)throws SQLException{
        var role=t.role();var scope=i.scope();var principal=t.principal();
        if(assigning&&!role.selectable())throw new Refusal(RefusalReason.STATE_CONFLICT);
        if(!role.scopeKinds().contains(scope.kind().name())||!role.principalKinds().contains(principal.kind()))throw new Refusal(RefusalReason.STATE_CONFLICT);
        var management=role.managementScope();if(management!=null&&(!management.organizationId().equals(scope.organizationId())||(management.projectId()!=null&&!management.projectId().equals(scope.projectId()))))throw new Refusal(RefusalReason.STATE_CONFLICT);
        if(scope.projectId()!=null){try(var q=c.prepareStatement("SELECT 1 FROM project WHERE project_id=? AND organization_id=?")){q.setObject(1,scope.projectId());q.setObject(2,scope.organizationId());try(var r=q.executeQuery()){if(!r.next())throw new Refusal(RefusalReason.TARGET_NOT_AVAILABLE);}}}
        if("ACTOR".equals(principal.kind())){
            try(var q=c.prepareStatement("SELECT a.status,p.disabled_at FROM idea_account a JOIN actor p USING(actor_id) WHERE a.actor_id=? AND a.organization_id=?")){
                q.setObject(1,principal.actorId());q.setObject(2,scope.organizationId());try(var r=q.executeQuery()){if(!r.next())throw new Refusal(RefusalReason.TARGET_NOT_AVAILABLE);if(assigning&&(!"ACTIVE".equals(r.getString(1))||r.getTimestamp(2)!=null))throw new Refusal(RefusalReason.STATE_CONFLICT);}
            }
        }else{
            if(scope.projectId()==null||!"BUSINESS".equals(role.classification()))throw new Refusal(RefusalReason.STATE_CONFLICT);
            try(var q=c.prepareStatement("SELECT 1 FROM business_group WHERE group_id=? AND project_id=? AND organization_id=?")){q.setObject(1,principal.groupId());q.setObject(2,scope.projectId());q.setObject(3,scope.organizationId());try(var r=q.executeQuery()){if(!r.next())throw new Refusal(RefusalReason.TARGET_NOT_AVAILABLE);}}
        }
        var from=i.interval()==null||i.interval().effectiveFrom()==null?clock.instant():i.interval().effectiveFrom();var until=i.interval()==null?null:i.interval().effectiveUntil();
        if(until!=null&&!until.isAfter(from))throw new Refusal(RefusalReason.INVALID_INPUT);
        if(assigning&&"HIGHEST".equals(role.classification())&&(until!=null||from.isAfter(clock.instant())))throw new Refusal(RefusalReason.STATE_CONFLICT);
    }
    private static boolean forbiddenSelf(ActorContext context,Intent i,Targets t,Authority authority){
        if("END".equals(i.kind())||!"ACTOR".equals(t.principal().kind())||!context.actorId().equals(t.principal().actorId())||"BUSINESS".equals(t.role().classification()))return false;
        return !(t.role().roleCode().equals("account-administrator")&&Set.of(1,2,3).contains(t.role().version())
                &&authority.decisions().stream().flatMap(d->d.paths().stream()).anyMatch(p->p.roleCode().equals("super-administrator")&&p.roleVersion()==2));
    }
    private UUID insertAssignment(Connection c,OwnerSessionEligibility.EligibleActor actor,Intent i,Targets t,Instant now)throws SQLException{
        // Serialize through IAM security lock, then explicitly detect the retained unended tuple.
        try(var q=c.prepareStatement("SELECT 1 FROM identity_role_assignment WHERE organization_id=? AND role_version_id=? AND scope_kind=? AND project_id IS NOT DISTINCT FROM ? AND principal_actor_id IS NOT DISTINCT FROM ? AND principal_group_id IS NOT DISTINCT FROM ? AND revoked_at IS NULL")){
            q.setObject(1,i.scope().organizationId());q.setObject(2,t.role().roleVersionId());q.setString(3,i.scope().kind().name());q.setObject(4,i.scope().projectId());q.setObject(5,t.principal().actorId());q.setObject(6,t.principal().groupId());try(var r=q.executeQuery()){if(r.next())throw new Refusal(RefusalReason.STATE_CONFLICT);}
        }
        var id=UUID.randomUUID();var from=i.interval()==null||i.interval().effectiveFrom()==null?now:i.interval().effectiveFrom();var until=i.interval()==null?null:i.interval().effectiveUntil();
        insert(c,"INSERT INTO identity_role_assignment(assignment_id,principal_actor_id,principal_group_id,role_version_id,organization_id,scope_kind,project_id,assigned_by,reason,assigned_at,effective_from,effective_until) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",id,t.principal().actorId(),t.principal().groupId(),t.role().roleVersionId(),i.scope().organizationId(),i.scope().kind().name(),i.scope().projectId(),actor.actorId(),i.reason(),Timestamp.from(now),Timestamp.from(from),until==null?null:Timestamp.from(until));return id;
    }
    private static void endRow(Connection c,OwnerSessionEligibility.EligibleActor actor,Assignment before,String reason,Instant now)throws SQLException{
        try(var q=c.prepareStatement("SELECT role_assignment_end(?,?,?,?,?,?)")){q.setObject(1,before.assignmentId());q.setObject(2,actor.organizationId());q.setLong(3,before.version());q.setObject(4,actor.actorId());q.setString(5,reason);q.setTimestamp(6,Timestamp.from(now));try(var r=q.executeQuery()){if(!r.next()||!r.getBoolean(1))throw new Refusal(RefusalReason.STATE_CONFLICT);}}
    }
    private static boolean isSuper(String code,int version){return "super-administrator".equals(code)&&(version==1||version==2);}
    private static void recovery(Connection c,UUID org,Instant now)throws SQLException{
        try(var q=c.prepareStatement("SELECT count(DISTINCT a.principal_actor_id) FROM identity_role_assignment a JOIN identity_role_version v USING(role_version_id) JOIN idea_account c ON c.actor_id=a.principal_actor_id JOIN actor p ON p.actor_id=c.actor_id WHERE a.organization_id=? AND a.scope_kind='ORGANIZATION' AND a.project_id IS NULL AND v.role_code='super-administrator' AND v.version IN (1,2) AND a.revoked_at IS NULL AND a.effective_from<=? AND a.effective_until IS NULL AND c.status='ACTIVE' AND p.disabled_at IS NULL")){
            q.setObject(1,org);q.setTimestamp(2,Timestamp.from(now));try(var r=q.executeQuery()){if(!r.next()||r.getLong(1)<1)throw new Refusal(RefusalReason.STATE_CONFLICT);}
        }
    }
    private Assignment row(Connection c,UUID id,Scope scope)throws SQLException{
        try(var q=c.prepareStatement("SELECT a.principal_actor_id,a.principal_group_id,a.role_version_id,v.role_code,v.version,a.effective_from,a.effective_until,a.assigned_by,a.reason,a.assigned_at,a.revoked_at,a.ended_by,a.end_reason,a.version FROM identity_role_assignment a JOIN identity_role_version v USING(role_version_id) WHERE a.assignment_id=? AND a.organization_id=? AND a.scope_kind=? AND a.project_id IS NOT DISTINCT FROM ?")){
            q.setObject(1,id);q.setObject(2,scope.organizationId());q.setString(3,scope.kind().name());q.setObject(4,scope.projectId());try(var r=q.executeQuery()){
                if(!r.next())throw new Refusal(RefusalReason.TARGET_NOT_AVAILABLE);var actor=r.getObject(1,UUID.class);var group=r.getObject(2,UUID.class);var from=time(r,6);var until=time(r,7);var revoked=time(r,11);var now=clock.instant();
                return new Assignment(id,new Principal(actor==null?"PROJECT_GROUP":"ACTOR",actor,group),scope,r.getObject(3,UUID.class),r.getString(4),r.getInt(5),from,until,r.getObject(8,UUID.class),r.getString(9),time(r,10),revoked,r.getObject(12,UUID.class),r.getString(13),r.getLong(14),revoked==null&&!from.isAfter(now)&&(until==null||until.isAfter(now)));
            }
        }
    }
    private static Instant time(ResultSet r,int column)throws SQLException{var value=r.getTimestamp(column);return value==null?null:value.toInstant();}
    private static void expected(Assignment before,long version){if(before.version()!=version||before.revokedAt()!=null)throw new Refusal(RefusalReason.STATE_CONFLICT);}
    private static Intent intent(String kind,Principal principal,Scope scope,UUID role,UUID before,long version,Interval interval,String reason,JsonNode condition){
        if(scope==null||(role==null&&!"END".equals(kind))||(principal==null&&before==null)||(before!=null&&version<1)||(condition!=null&&!condition.isNull()))throw new Refusal(RefusalReason.INVALID_INPUT);
        if(reason==null||reason.trim().isEmpty()||reason.trim().length()>500||reason.codePoints().anyMatch(Character::isISOControl))throw new Refusal(RefusalReason.INVALID_INPUT);
        return new Intent(kind,principal,scope,role,before,version,interval==null?new Interval(null,null):interval,reason.trim());
    }
    private static void requireAuthority(Authority a){for(var d:a.decisions())RoleCatalogueQueries.require(d);if(!a.delegated())throw new Refusal(RefusalReason.AUTHORITY_REFUSED);}
    private void retain(Connection c,UUID attempt,UUID operation,String stage,UUID org,Scope requestedScope,Authority a)throws SQLException{
        var d=a.decisions().getFirst();insert(c,"INSERT INTO assignment_authorization_evidence(evidence_id,attempt_id,operation_id,stage,actor_id,organization_id,requested_scope,permission_code,evaluated_at,eligible,granted,delegation_allowed,paths,reason_code) VALUES (?,?,?,?,?,?,?::jsonb,?,?,?,?,?,?::jsonb,?)",UUID.randomUUID(),attempt,operation,stage,d.actorId(),org,json.writeValueAsString(requestedScope),d.permission(),Timestamp.from(d.evaluatedAt()),a.decisions().stream().allMatch(AuthorizationDecisionService.Decision::eligible),a.decisions().stream().allMatch(AuthorizationDecisionService.Decision::rbacGranted),a.delegated(),json.writeValueAsString(a.decisions()),a.delegated()?d.refusal():"DELEGATION_REFUSED");
    }
    private static void audit(Connection c,UUID operation,UUID actor,String kind,UUID target,String outcome,String reason)throws SQLException{insert(c,"INSERT INTO audit_evidence(evidence_id,operation_id,actor_id,action,target_type,target_id,outcome,reason_code) VALUES (?,?,?,?,?,?,?,?)",UUID.randomUUID(),operation,actor,"role.assignment."+kind.toLowerCase(Locale.ROOT),"Role Assignment",target.toString(),outcome,reason);}
    private String digest(Intent i){try{return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(json.writeValueAsString(i).getBytes(StandardCharsets.UTF_8)));}catch(java.security.NoSuchAlgorithmException impossible){throw new IllegalStateException(impossible);}}
    private static void insert(Connection c,String sql,Object...values)throws SQLException{try(var q=c.prepareStatement(sql)){for(int i=0;i<values.length;i++)q.setObject(i+1,values[i]);if(q.executeUpdate()!=1)throw new SQLException("Required Access Policy write missing");}}
}
