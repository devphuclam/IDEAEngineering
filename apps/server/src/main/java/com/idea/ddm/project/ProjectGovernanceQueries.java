package com.idea.ddm.project;

import com.idea.ddm.identity.OwnerSessionEligibility.EligibleActor;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Objects;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/** Project-owned read facts in the caller's transaction, not an authorization evaluator. */
public final class ProjectGovernanceQueries {
    public record Project(UUID projectId, UUID organizationId, String name, long version) {}
    public record Group(UUID groupId, UUID projectId, UUID organizationId, String name, long version, long parentVersion) {}
    public record Participation(UUID membershipId, UUID projectId, UUID groupId, UUID organizationId,
            UUID targetActorId, String displayName, Instant effectiveFrom, Instant effectiveUntil,
            Instant endedAt, long version, long parentVersion, boolean eligible) {}
    public record Target(UUID actorId,String displayName) {}
    public record Page<T>(List<T> items,int offset,int limit,boolean hasMore) { public Page { items=List.copyOf(items); } }
    public record ParticipationPage(List<Participation> items,int offset,int limit,boolean hasMore,
            long parentVersion,Page<Target> eligibleTargets) { public ParticipationPage { items=List.copyOf(items); } }
    Project projectRow(Connection connection, UUID organization, UUID id) throws SQLException {
        try(var q=connection.prepareStatement("SELECT display_name,version FROM project WHERE project_id=? AND organization_id=?")){
            q.setObject(1,id);q.setObject(2,organization);try(var row=q.executeQuery()){
                if(!row.next())throw new com.idea.ddm.iam.IamWebConfiguration.Refusal(com.idea.ddm.iam.IamWebConfiguration.RefusalReason.TARGET_NOT_AVAILABLE);
                return new Project(id,organization,row.getString(1),row.getLong(2));
            }
        }
    }
    Group groupRow(Connection c,UUID organization,UUID id)throws SQLException {
        try(var q=c.prepareStatement("SELECT g.project_id,g.display_name,g.version,p.version FROM business_group g JOIN project p USING(project_id,organization_id) WHERE g.group_id=? AND g.organization_id=?")){
            q.setObject(1,id);q.setObject(2,organization);try(var row=q.executeQuery()){
                if(!row.next())throw unavailableTarget();
                return new Group(id,row.getObject(1,UUID.class),organization,row.getString(2),row.getLong(3),row.getLong(4));
            }
        }
    }
    Participation membershipRow(Connection c,UUID organization,UUID id,boolean group,Instant now)throws SQLException {
        var table=group?"group_membership":"project_membership";
        var parent=group?"JOIN business_group parent ON parent.group_id=m.group_id":"JOIN project parent ON parent.project_id=m.project_id";
        try(var q=c.prepareStatement("SELECT m.project_id,"+(group?"m.group_id":"NULL::uuid")+",m.actor_id,a.display_name,m.effective_from,m.effective_until,m.ended_at,m.version,parent.version,"
                +"account.status='ACTIVE' AND a.disabled_at IS NULL AND m.ended_at IS NULL AND m.effective_from<=? AND (m.effective_until IS NULL OR m.effective_until>?)"
                +(group?" AND EXISTS(SELECT 1 FROM project_membership pm WHERE pm.project_id=m.project_id AND pm.actor_id=m.actor_id AND pm.ended_at IS NULL AND pm.effective_from<=? AND (pm.effective_until IS NULL OR pm.effective_until>?))":"")
                +" FROM "+table+" m "+parent+" JOIN actor a ON a.actor_id=m.actor_id JOIN idea_account account ON account.actor_id=m.actor_id AND account.organization_id=m.organization_id WHERE m.membership_id=? AND m.organization_id=?")){
            int index=1; q.setTimestamp(index++,Timestamp.from(now));q.setTimestamp(index++,Timestamp.from(now));
            if(group){q.setTimestamp(index++,Timestamp.from(now));q.setTimestamp(index++,Timestamp.from(now));}
            q.setObject(index++,id);q.setObject(index,organization);try(var row=q.executeQuery()){
                if(!row.next())throw unavailableTarget();
                return new Participation(id,row.getObject(1,UUID.class),row.getObject(2,UUID.class),organization,row.getObject(3,UUID.class),row.getString(4),
                        row.getTimestamp(5).toInstant(),instant(row,6),instant(row,7),row.getLong(8),row.getLong(9),row.getBoolean(10));
            }
        }
    }
    ParticipationPage members(Connection c,UUID org,UUID project,UUID group,String filter,int offset,int limit,Instant now)throws SQLException {
        var parentVersion=group==null?projectRow(c,org,project).version():groupRow(c,org,group).version();
        var ids=new ArrayList<UUID>();
        try(var q=c.prepareStatement("SELECT m.membership_id FROM "+(group==null?"project_membership":"group_membership")+" m JOIN actor a USING(actor_id) WHERE m.organization_id=? AND m.project_id=? "
                +(group==null?"":"AND m.group_id=? ")+"AND strpos(lower(a.display_name),lower(?))>0 ORDER BY m.membership_id OFFSET ? LIMIT ?")){
            int i=1;q.setObject(i++,org);q.setObject(i++,project);if(group!=null)q.setObject(i++,group);
            q.setString(i++,filter);q.setInt(i++,offset);q.setInt(i,limit+1);try(var r=q.executeQuery()){while(r.next())ids.add(r.getObject(1,UUID.class));}
        }
        boolean more=ids.size()>limit;if(more)ids.remove(ids.size()-1);
        var rows=new ArrayList<Participation>();for(var id:ids)rows.add(membershipRow(c,org,id,group!=null,now));
        var targets=new ArrayList<Target>();
        try(var q=c.prepareStatement("SELECT a.actor_id,a.display_name FROM actor a JOIN idea_account account USING(actor_id) WHERE account.organization_id=? AND account.status='ACTIVE' AND a.disabled_at IS NULL "
                +"AND (strpos(lower(a.display_name),lower(?))>0 OR EXISTS(SELECT 1 FROM login_identity l WHERE l.account_id=account.account_id AND strpos(l.normalized_login_identifier,lower(?))>0)) "
                +(group==null?"":"AND EXISTS(SELECT 1 FROM project_membership pm WHERE pm.actor_id=a.actor_id AND pm.project_id=? AND pm.ended_at IS NULL AND pm.effective_from<=? AND (pm.effective_until IS NULL OR pm.effective_until>?)) ")
                +"ORDER BY a.actor_id OFFSET ? LIMIT ?")){
            int i=1;q.setObject(i++,org);q.setString(i++,filter);q.setString(i++,filter);
            if(group!=null){q.setObject(i++,project);q.setTimestamp(i++,Timestamp.from(now));q.setTimestamp(i++,Timestamp.from(now));}
            q.setInt(i++,offset);q.setInt(i,limit+1);try(var r=q.executeQuery()){while(r.next())targets.add(new Target(r.getObject(1,UUID.class),r.getString(2)));}
        }
        boolean targetsMore=targets.size()>limit;if(targetsMore)targets.remove(targets.size()-1);
        return new ParticipationPage(rows,offset,limit,more,parentVersion,new Page<>(targets,offset,limit,targetsMore));
    }
    private static com.idea.ddm.iam.IamWebConfiguration.Refusal unavailableTarget(){return new com.idea.ddm.iam.IamWebConfiguration.Refusal(com.idea.ddm.iam.IamWebConfiguration.RefusalReason.TARGET_NOT_AVAILABLE);}
    private static Instant instant(java.sql.ResultSet row,int index)throws SQLException{var value=row.getTimestamp(index);return value==null?null:value.toInstant();}
    public record Membership(UUID membershipId, Instant effectiveFrom, Instant effectiveUntil, long version) {}
    public record GroupPath(UUID groupId, Membership membership) {}
    public record ProjectFacts(UUID projectId, UUID organizationId, long version,
            Optional<Membership> projectMembership, List<GroupPath> groupMemberships) {
        public ProjectFacts { groupMemberships = List.copyOf(groupMemberships); }
    }

    public Optional<ProjectFacts> authorizationFacts(Connection connection, EligibleActor actor,
            UUID projectId, Instant now) throws SQLException {
        if (connection.getAutoCommit()) throw new SQLException("Caller-owned Project read transaction required");
        Objects.requireNonNull(actor);
        Objects.requireNonNull(projectId);
        Objects.requireNonNull(now);
        // One statement gives one PostgreSQL snapshot. No transaction/lock/activity ownership here.
        try (var query = connection.prepareStatement("SELECT p.project_id,p.organization_id,p.version,"
                + "m.membership_id,m.effective_from,m.effective_until,m.version,"
                + "g.group_id,g.membership_id,g.effective_from,g.effective_until,g.version "
                + "FROM project p LEFT JOIN project_membership m ON m.project_id=p.project_id "
                + "AND m.organization_id=p.organization_id AND m.actor_id=? AND m.ended_at IS NULL "
                + "AND m.effective_from<=? AND (m.effective_until IS NULL OR m.effective_until>?) "
                + "LEFT JOIN group_membership g ON m.membership_id IS NOT NULL AND g.project_id=p.project_id "
                + "AND g.organization_id=p.organization_id AND g.actor_id=m.actor_id AND g.ended_at IS NULL "
                + "AND g.effective_from<=? AND (g.effective_until IS NULL OR g.effective_until>?) "
                + "JOIN operating_organization o ON o.organization_id=p.organization_id "
                + "WHERE p.project_id=? AND p.organization_id=? ORDER BY g.group_id,g.membership_id")) {
            query.setObject(1, actor.actorId());
            for (int parameter = 2; parameter <= 5; parameter++) query.setTimestamp(parameter, Timestamp.from(now));
            query.setObject(6, projectId);
            query.setObject(7, actor.organizationId());
            try (var rows = query.executeQuery()) {
                if (!rows.next()) return Optional.empty();
                var membership = rows.getObject(4) == null ? Optional.<Membership>empty()
                        : Optional.of(membership(rows, 4));
                var groups = new ArrayList<GroupPath>();
                var id = rows.getObject(1, UUID.class);
                var organization = rows.getObject(2, UUID.class);
                var version = rows.getLong(3);
                do {
                    if (rows.getObject(8) != null) groups.add(new GroupPath(rows.getObject(8, UUID.class), membership(rows, 9)));
                } while (rows.next());
                return Optional.of(new ProjectFacts(id, organization, version, membership, groups));
            }
        }
    }

    private static Membership membership(java.sql.ResultSet row, int start) throws SQLException {
        var until = row.getTimestamp(start + 2);
        return new Membership(row.getObject(start, UUID.class), row.getTimestamp(start + 1).toInstant(),
                until == null ? null : until.toInstant(), row.getLong(start + 3));
    }
}
