package com.idea.ddm.project;

import com.idea.ddm.access.AuthorizationDecisionService.Scope;
import com.idea.ddm.iam.IamWebConfiguration.Refusal;
import com.idea.ddm.iam.IamWebConfiguration.RefusalReason;
import com.idea.ddm.identity.ActorContext;
import java.sql.*;
import java.time.Instant;
import java.util.*;
import tools.jackson.databind.JsonNode;

/** Direct Project participation is separate from administration and from Role Assignment. */
public final class ProjectParticipationAdministration {
    public record Interval(Instant effectiveFrom,Instant effectiveUntil){}
    private final ProjectGovernanceAdministration owner;
    public ProjectParticipationAdministration(ProjectGovernanceAdministration owner){this.owner=owner;}
    public JsonNode join(ActorContext context,UUID operation,Scope scope,UUID parent,UUID target,boolean group,long expected,Interval interval,String reason){
        if(scope==null || parent==null || target==null)throw new Refusal(RefusalReason.INVALID_INPUT);
        ProjectGovernanceAdministration.positive(expected);var normalized=ProjectGovernanceAdministration.text(reason,500);
        var from=interval==null?null:interval.effectiveFrom();var until=interval==null?null:interval.effectiveUntil();
        if(from!=null&&until!=null&&!until.isAfter(from))throw new Refusal(RefusalReason.INVALID_INPUT);
        var action=group?"project.group.membership.assign":"project.membership.assign";
        var digest=owner.digest(Arrays.asList(action,scope,parent,target,expected,from==null?"NOW_AT_FIRST_COMMIT":from,until,normalized));
        return owner.command(context,operation,scope,action,digest,(c,actor)->{
            var project=group?owner.queries().groupRow(c,actor.organizationId(),parent).projectId():owner.queries().projectRow(c,actor.organizationId(),parent).projectId();
            ProjectGovernanceAdministration.matches(scope,actor.organizationId(),project);
            var now=owner.clock().instant();var effectiveFrom=from==null?now:from;
            if(until!=null&&!until.isAfter(effectiveFrom))throw new Refusal(RefusalReason.STATE_CONFLICT);
            requireTarget(c,actor.organizationId(),target,group?project:null,now);
            var table=group?"group_membership":"project_membership";var parentColumn=group?"group_id":"project_id";
            try(var q=c.prepareStatement("SELECT 1 FROM "+table+" WHERE "+parentColumn+"=? AND actor_id=? AND ended_at IS NULL")){
                q.setObject(1,parent);q.setObject(2,target);try(var r=q.executeQuery()){if(r.next())throw new Refusal(RefusalReason.STATE_CONFLICT);}
            }
            ProjectGovernanceAdministration.changed(c,group?"SELECT project_group_change(?,?,?,?)":"SELECT project_change(?,?,?,?)",parent,actor.organizationId(),expected,null);
            var id=UUID.randomUUID();
            if(group)ProjectGovernanceAdministration.insert(c,"INSERT INTO group_membership(membership_id,group_id,project_id,organization_id,actor_id,effective_from,effective_until,reason,created_by,created_at) VALUES (?,?,?,?,?,?,?,?,?,?)",
                    id,parent,project,actor.organizationId(),target,Timestamp.from(effectiveFrom),until==null?null:Timestamp.from(until),normalized,actor.actorId(),Timestamp.from(now));
            else ProjectGovernanceAdministration.insert(c,"INSERT INTO project_membership(membership_id,project_id,organization_id,actor_id,effective_from,effective_until,reason,created_by,created_at) VALUES (?,?,?,?,?,?,?,?,?)",
                    id,project,actor.organizationId(),target,Timestamp.from(effectiveFrom),until==null?null:Timestamp.from(until),normalized,actor.actorId(),Timestamp.from(now));
            return owner.result(owner.queries().membershipRow(c,actor.organizationId(),id,group,now));
        });
    }
    public JsonNode end(ActorContext context,UUID operation,Scope scope,UUID id,boolean group,long expected,String reason){
        if(scope==null || id==null)throw new Refusal(RefusalReason.INVALID_INPUT);
        ProjectGovernanceAdministration.positive(expected);var normalized=ProjectGovernanceAdministration.text(reason,500);
        var action=group?"project.group.membership.remove":"project.membership.remove";
        return owner.command(context,operation,scope,action,owner.digest(List.of(action,scope,id,expected,normalized)),(c,actor)->{
            var current=owner.queries().membershipRow(c,actor.organizationId(),id,group,owner.clock().instant());
            ProjectGovernanceAdministration.matches(scope,actor.organizationId(),current.projectId());
            ProjectGovernanceAdministration.changed(c,group?"SELECT project_group_membership_end(?,?,?,?,?,?)":"SELECT project_membership_end(?,?,?,?,?,?)",id,actor.organizationId(),expected,actor.actorId(),normalized,Timestamp.from(owner.clock().instant()));
            return owner.result(owner.queries().membershipRow(c,actor.organizationId(),id,group,owner.clock().instant()));
        });
    }
    private static void requireTarget(Connection c,UUID org,UUID actor,UUID project,Instant now)throws SQLException{
        try(var q=c.prepareStatement("SELECT 1 FROM idea_account account JOIN actor a USING(actor_id) WHERE account.actor_id=? AND account.organization_id=? AND account.status='ACTIVE' AND a.disabled_at IS NULL")){
            q.setObject(1,actor);q.setObject(2,org);try(var r=q.executeQuery()){if(!r.next())throw new Refusal(RefusalReason.TARGET_NOT_AVAILABLE);}
        }
        if(project!=null)try(var q=c.prepareStatement("SELECT 1 FROM project_membership WHERE project_id=? AND actor_id=? AND ended_at IS NULL AND effective_from<=? AND (effective_until IS NULL OR effective_until>?)")){
            q.setObject(1,project);q.setObject(2,actor);q.setTimestamp(3,Timestamp.from(now));q.setTimestamp(4,Timestamp.from(now));try(var r=q.executeQuery()){if(!r.next())throw new Refusal(RefusalReason.STATE_CONFLICT);}
        }
    }
}
