package com.idea.ddm.access;

import com.idea.ddm.iam.IamWebConfiguration.Refusal;
import com.idea.ddm.iam.IamWebConfiguration.RefusalReason;
import com.idea.ddm.identity.*;
import java.sql.*;
import java.util.*;
import javax.sql.DataSource;

/** Sealed, exact-version projections. Registered permission is not a qualified implementation. */
public final class RoleCatalogueQueries {
    public record Page<T>(List<T> items,int offset,int limit,boolean hasMore){}
    public record Permission(String code,String owner,List<String> scopeKinds,List<String> principalKinds,
            boolean participantMembershipRequired,String implementationState){}
    public record Role(UUID definitionId,UUID roleVersionId,String roleCode,int version,String displayName,
            boolean builtIn,String classification,List<String> scopeKinds,List<String> principalKinds,
            String contentDigest,List<Permission> permissions,boolean selectable,String availabilityReason,
            AuthorizationDecisionService.Scope managementScope){}
    private final DataSource source;
    private final OwnerSessionEligibility eligibility;
    private final AuthorizationDecisionService authorization;
    // Current owner boundaries only; registry presence never qualifies Audit queries or other DESIGN actions.
    static boolean implemented(String code){return Set.of("account.read","account.create","account.disable","account.re-enable","account.credential.setup.issue","account.credential.reset.issue","project.create","project.admin.read","project.update","project.membership.assign","project.membership.remove","project.group.create","project.group.update","project.group.membership.assign","project.group.membership.remove","project.read","role.catalogue.read","role.definition.prepare","role.definition.activate","role.assignment.manage.business","role.assignment.manage.administration","role.assignment.manage.highest","access.inspect","audit.read","role.assign.account-administrator").contains(code);}
    public RoleCatalogueQueries(DataSource source,OwnerSessionEligibility eligibility,AuthorizationDecisionService authorization){this.source=source;this.eligibility=eligibility;this.authorization=authorization;}
    public Page<Role> roles(ActorContext context,AuthorizationDecisionService.Scope scope,String filter,int offset,int limit){
        page(filter,offset,limit);
        return read(context,(c,actor)->{
            require(authorization.evaluate(c,context,"role.catalogue.read",scope));
            var items=new ArrayList<Role>();
            try(var q=c.prepareStatement("SELECT v.role_version_id FROM identity_role_version v JOIN identity_role_version_profile p USING(role_version_id) JOIN identity_role_definition d USING(definition_id) WHERE (d.built_in OR (d.management_organization_id=? AND (d.management_project_id IS NULL OR d.management_project_id=?))) AND (strpos(lower(d.display_name),lower(?))>0 OR strpos(lower(v.role_code),lower(?))>0) ORDER BY v.role_version_id OFFSET ? LIMIT ?")){
                q.setObject(1,scope.organizationId());q.setObject(2,scope.projectId());q.setString(3,filter);q.setString(4,filter);q.setInt(5,offset);q.setInt(6,limit+1);
                try(var r=q.executeQuery()){while(r.next())items.add(role(c,r.getObject(1,UUID.class)));}
            }
            boolean more=items.size()>limit;if(more)items.remove(items.size()-1);
            return new Page<>(List.copyOf(items),offset,limit,more);
        });
    }
    public Role exact(ActorContext context,AuthorizationDecisionService.Scope scope,UUID definition,int version){
        return read(context,(c,actor)->{
            require(authorization.evaluate(c,context,"role.catalogue.read",scope));
            try(var q=c.prepareStatement("SELECT v.role_version_id FROM identity_role_version v JOIN identity_role_version_profile p USING(role_version_id) JOIN identity_role_definition d USING(definition_id) WHERE p.definition_id=? AND v.version=? AND (d.built_in OR (d.management_organization_id=? AND (d.management_project_id IS NULL OR d.management_project_id=?)))")){
                q.setObject(1,definition);q.setInt(2,version);q.setObject(3,scope.organizationId());q.setObject(4,scope.projectId());
                try(var r=q.executeQuery()){if(!r.next())throw new Refusal(RefusalReason.TARGET_NOT_AVAILABLE);return role(c,r.getObject(1,UUID.class));}
            }
        });
    }
    public Page<Permission> permissions(ActorContext context,AuthorizationDecisionService.Scope scope,int offset,int limit){
        page("",offset,limit);
        return read(context,(c,actor)->{
            require(authorization.evaluate(c,context,"role.catalogue.read",scope));var items=new ArrayList<Permission>();
            try(var q=c.prepareStatement("SELECT permission_code,owner_name,scope_kinds,principal_kinds,participant_membership_required FROM permission_registry ORDER BY permission_code OFFSET ? LIMIT ?")){
                q.setInt(1,offset);q.setInt(2,limit+1);try(var r=q.executeQuery()){while(r.next())items.add(permission(r));}
            }
            boolean more=items.size()>limit;if(more)items.remove(items.size()-1);return new Page<>(List.copyOf(items),offset,limit,more);
        });
    }
    static Role role(Connection c,UUID id)throws SQLException{
        try(var q=c.prepareStatement("SELECT p.definition_id,v.role_code,v.version,d.display_name,d.built_in,p.classification,p.scope_kinds,p.principal_kinds,p.content_digest,d.management_organization_id,d.management_project_id FROM identity_role_version v JOIN identity_role_version_profile p USING(role_version_id) JOIN identity_role_definition d USING(definition_id) WHERE v.role_version_id=?")){
            q.setObject(1,id);try(var r=q.executeQuery()){
                if(!r.next())throw new Refusal(RefusalReason.TARGET_NOT_AVAILABLE);
                var permissions=new ArrayList<Permission>();
                try(var p=c.prepareStatement("SELECT r.permission_code,r.owner_name,r.scope_kinds,r.principal_kinds,r.participant_membership_required FROM identity_role_permission p JOIN permission_registry r USING(permission_code) WHERE p.role_version_id=? ORDER BY r.permission_code")){
                    p.setObject(1,id);try(var rows=p.executeQuery()){while(rows.next())permissions.add(permission(rows));}
                }
                boolean selectable=!permissions.isEmpty()&&permissions.stream().allMatch(p->"IMPLEMENTED".equals(p.implementationState()));
                var org=r.getObject(10,UUID.class);var project=r.getObject(11,UUID.class);
                var management=org==null?null:project==null?AuthorizationDecisionService.Scope.organization(org):AuthorizationDecisionService.Scope.project(org,project);
                return new Role(r.getObject(1,UUID.class),id,r.getString(2),r.getInt(3),r.getString(4),r.getBoolean(5),r.getString(6),strings(r,7),strings(r,8),r.getString(9),List.copyOf(permissions),selectable,selectable?null:"OWNER_ACTION_NOT_QUALIFIED",management);
            }
        }
    }
    private static Permission permission(ResultSet r)throws SQLException{return new Permission(r.getString(1),r.getString(2),strings(r,3),strings(r,4),r.getBoolean(5),implemented(r.getString(1))?"IMPLEMENTED":"DESIGN");}
    private static List<String> strings(ResultSet r,int column)throws SQLException{return List.of((String[])r.getArray(column).getArray());}
    @FunctionalInterface interface Projection<T>{T apply(Connection c,OwnerSessionEligibility.EligibleActor actor)throws SQLException;}
    <T>T read(ActorContext context,Projection<T> projection){
        try(var c=source.getConnection()){
            c.setReadOnly(true);c.setTransactionIsolation(Connection.TRANSACTION_REPEATABLE_READ);c.setAutoCommit(false);
            try{var actor=eligibility.admit(c,context);var result=projection.apply(c,actor);eligibility.admit(c,context);c.commit();return result;}
            catch(IdentityRefusal refused){c.rollback();throw new Refusal(RefusalReason.INELIGIBLE_SESSION);}
            catch(SQLException|RuntimeException failed){c.rollback();throw failed;}
        }catch(SQLException failed){throw new Refusal(RefusalReason.UNAVAILABLE);}
    }
    static void page(String filter,int offset,int limit){if(filter==null||filter.length()>200||filter.codePoints().anyMatch(Character::isISOControl)||offset<0||limit<1||limit>100)throw new Refusal(RefusalReason.INVALID_INPUT);}
    static void require(AuthorizationDecisionService.Decision d){if(!d.eligible())throw new Refusal(RefusalReason.INELIGIBLE_SESSION);if(!d.rbacGranted())throw new Refusal(RefusalReason.AUTHORITY_REFUSED);}
}
