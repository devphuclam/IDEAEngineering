package com.idea.ddm.identity;

import com.idea.ddm.access.AuthorizationDecisionService;
import com.idea.ddm.iam.IamWebConfiguration.Refusal;
import com.idea.ddm.iam.IamWebConfiguration.RefusalReason;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.*;
import javax.sql.DataSource;

/** Authorized current projections, never an alternate account model or grant/capability issuer. */
public final class IdentityDirectoryQueries {
    public record Context(UUID actorId,UUID accountId,UUID organizationId,String displayName,String organizationName,List<String> actions){}
    public record Login(UUID loginIdentityId,String normalizedLogin,String credentialState){}
    public record Account(UUID actorId,UUID accountId,UUID organizationId,String displayName,String status,long securityVersion,List<Login> loginIdentities){}
    public record Page(List<Account> items,int offset,int limit,boolean hasMore){}
    private final DataSource dataSource;
    private final OwnerSessionEligibility eligibility;
    private final AuthorizationDecisionService authorization;
    private static final List<String> ACCOUNT_ACTIONS=List.of("account.read","account.create","account.disable","account.re-enable","account.credential.setup.issue","account.credential.reset.issue");
    IdentityDirectoryQueries(DataSource dataSource,OwnerSessionEligibility eligibility,AuthorizationDecisionService authorization){this.dataSource=dataSource;this.eligibility=eligibility;this.authorization=authorization;}
    public Context context(ActorContext context){return read(context,(c,actor)->{
        var actions=new ArrayList<String>();var scope=AuthorizationDecisionService.Scope.organization(actor.organizationId());
        for(String action:ACCOUNT_ACTIONS)if(authorization.evaluate(c,context,action,scope).rbacGranted())actions.add(action);
        try(var q=c.prepareStatement("SELECT a.account_id,p.display_name,o.display_name FROM idea_account a JOIN actor p USING(actor_id) JOIN operating_organization o USING(organization_id) WHERE a.actor_id=? AND a.organization_id=?")){
            q.setObject(1,actor.actorId());q.setObject(2,actor.organizationId());try(var r=q.executeQuery()){
                if(!r.next())throw new Refusal(RefusalReason.INELIGIBLE_SESSION);
                return new Context(actor.actorId(),r.getObject(1,UUID.class),actor.organizationId(),r.getString(2),r.getString(3),List.copyOf(actions));}}
    });}
    public Page accounts(ActorContext context,UUID requestedOrganization,String filter,int offset,int limit){
        return read(context,(c,actor)->{
            authorize(c,context,actor,requestedOrganization);
            if(offset<0 || limit<1 || limit>100 || filter==null || filter.length()>200 || filter.codePoints().anyMatch(Character::isISOControl))throw new Refusal(RefusalReason.INVALID_INPUT);
            var ids=new ArrayList<UUID>();
            try(var q=c.prepareStatement("SELECT a.account_id FROM idea_account a JOIN actor p USING(actor_id) WHERE a.organization_id=? "
                    +"AND (strpos(lower(p.display_name),lower(?))>0 OR EXISTS (SELECT 1 FROM login_identity l WHERE l.account_id=a.account_id AND strpos(l.normalized_login_identifier,lower(?))>0)) ORDER BY a.account_id OFFSET ? LIMIT ?")){
                q.setObject(1,actor.organizationId());q.setString(2,filter);q.setString(3,filter);q.setInt(4,offset);q.setInt(5,limit+1);
                try(var r=q.executeQuery()){while(r.next())ids.add(r.getObject(1,UUID.class));}}
            boolean more=ids.size()>limit;if(more)ids.remove(ids.size()-1);
            var items=new ArrayList<Account>();for(UUID id:ids)items.add(account(c,actor.organizationId(),id));
            return new Page(List.copyOf(items),offset,limit,more);
        });
    }
    public Account account(ActorContext context,UUID organization,UUID account){return read(context,(c,actor)->{authorize(c,context,actor,organization);return account(c,actor.organizationId(),account);});}
    private void authorize(Connection c,ActorContext context,OwnerSessionEligibility.EligibleActor actor,UUID requested)throws SQLException{
        if(requested!=null && !actor.organizationId().equals(requested))throw new Refusal(RefusalReason.AUTHORITY_REFUSED);
        var decision=authorization.evaluate(c,context,"account.read",AuthorizationDecisionService.Scope.organization(actor.organizationId()));
        if(!decision.eligible())throw new Refusal(RefusalReason.INELIGIBLE_SESSION);
        if(!decision.rbacGranted())throw new Refusal(RefusalReason.AUTHORITY_REFUSED);
    }
    private static Account account(Connection c,UUID org,UUID account)throws SQLException{
        try(var q=c.prepareStatement("SELECT a.actor_id,p.display_name,a.status,a.security_version FROM idea_account a JOIN actor p USING(actor_id) WHERE a.account_id=? AND a.organization_id=?")){
            q.setObject(1,account);q.setObject(2,org);try(var r=q.executeQuery()){
                if(!r.next())throw new Refusal(RefusalReason.TARGET_NOT_AVAILABLE);
                var logins=new ArrayList<Login>();try(var login=c.prepareStatement("SELECT login_identity_id,normalized_login_identifier,password_verifier IS NOT NULL FROM login_identity WHERE account_id=? ORDER BY login_identity_id")){
                    login.setObject(1,account);try(var row=login.executeQuery()){while(row.next())logins.add(new Login(row.getObject(1,UUID.class),row.getString(2),row.getBoolean(3)?"ESTABLISHED":"NOT_ESTABLISHED"));}}
                return new Account(r.getObject(1,UUID.class),account,org,r.getString(2),r.getString(3),r.getLong(4),List.copyOf(logins));}}
    }
    @FunctionalInterface private interface Projection<T>{T apply(Connection c,OwnerSessionEligibility.EligibleActor actor)throws SQLException;}
    private <T>T read(ActorContext context,Projection<T> projection){
        try(var c=dataSource.getConnection()){
            c.setReadOnly(true);c.setTransactionIsolation(Connection.TRANSACTION_REPEATABLE_READ);c.setAutoCommit(false);
            try{var actor=eligibility.admit(c,context);var value=projection.apply(c,actor);eligibility.admit(c,context);c.commit();return value;}
            catch(IdentityRefusal refused){c.rollback();throw new Refusal(RefusalReason.INELIGIBLE_SESSION);}
            catch(SQLException|RuntimeException failure){c.rollback();throw failure;}
        }catch(SQLException failure){throw new Refusal(RefusalReason.UNAVAILABLE);}
    }
}
