package com.idea.ddm.access;

import com.idea.ddm.access.AuthorizationDecisionService.Scope;
import com.idea.ddm.iam.IamWebConfiguration.Refusal;
import com.idea.ddm.iam.IamWebConfiguration.RefusalReason;
import com.idea.ddm.identity.*;
import java.sql.*;
import java.time.Clock;
import java.util.*;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.json.JsonMapper;

/** Custom proposals never grant authority. Only current preexisting PRA delegation may publish. */
public final class RoleDefinitionCandidateService {
    public record Support(List<String> scopeKinds,List<String> principalKinds){}
    public record Difference(List<String> added,List<String> removed,List<String> unchanged){}
    public record Candidate(UUID candidateId,UUID definitionId,String roleCode,String displayName,Scope managementScope,
            UUID baseVersionId,int proposedRoleVersion,String classification,Support support,List<String> permissionCodes,
            String contentDigest,long version,String state,UUID activatedVersionId,Difference difference){}
    private record Proposal(Scope scope,UUID definitionId,String name,UUID baseVersionId,List<String> permissionCodes,Support support,String reason){}
    private record Reply(JsonNode result,RefusalReason refusal){}
    final IdentityTransactions transactions;
    final AuthorizationDecisionService authorization;
    final RoleCatalogueQueries catalogue;
    final Clock clock;
    final JsonMapper json=JsonMapper.builder().build();
    public static final Set<String> CEILING=Set.of("project.read","role.catalogue.read","access.inspect","audit.read");
    public static final List<String> ACTIONS=List.of("role.definition.prepare","role.definition.activate");
    public record Validation(boolean valid,Candidate candidate,Difference difference,List<String> consequences){}
    public RoleDefinitionCandidateService(IdentityTransactions transactions,AuthorizationDecisionService authorization,RoleCatalogueQueries catalogue,Clock clock){this.transactions=transactions;this.authorization=authorization;this.catalogue=catalogue;this.clock=clock;}
    public JsonNode prepare(ActorContext context,UUID operation,Scope scope,UUID definition,String name,UUID base,List<String> codes,Support support,String reason,JsonNode condition){
        if(scope==null||(definition==null)==(name==null)||(definition==null&&base!=null)||(definition!=null&&base==null)||(condition!=null&&!condition.isNull()))throw new Refusal(RefusalReason.INVALID_INPUT);
        if(name!=null)name=text(name,200);reason=text(reason,500);
        var content=sorted(codes);var declared=new Support(sorted(support==null?null:support.scopeKinds()),sorted(support==null?null:support.principalKinds()));
        var intent=new Proposal(scope,definition,name,base,content,declared,reason);
        return write(context,operation,scope,"PREPARE","role.definition.prepare",intent,reason,c->{
            checkContent(c,scope,content,declared);
            UUID def=definition==null?UUID.randomUUID():definition;
            String code="custom-"+def,display=intent.name();int next=1;
            if(definition!=null){var existing=definition(c,scope,definition);code=existing.roleCode();display=existing.displayName();if(!Objects.equals(base,latest(c,definition)))throw new Refusal(RefusalReason.STATE_CONFLICT);next=RoleCatalogueQueries.role(c,base).version()+1;}
            var classification=content.equals(List.of("project.read"))?"BUSINESS":"ADMINISTRATION";
            var digest=contentDigest(code,next,classification,declared,content);var id=UUID.randomUUID();
            try(var q=c.prepareStatement("SELECT role_candidate_prepare(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)")){
                q.setObject(1,id);q.setObject(2,def);q.setString(3,code);q.setString(4,display);q.setString(5,scope.kind().name());q.setObject(6,scope.organizationId());q.setObject(7,scope.projectId());q.setObject(8,base);q.setString(9,classification);q.setArray(10,c.createArrayOf("text",declared.scopeKinds().toArray()));q.setArray(11,c.createArrayOf("text",declared.principalKinds().toArray()));q.setArray(12,c.createArrayOf("text",content.toArray()));q.setString(13,digest);q.setObject(14,context.actorId());q.setString(15,intent.reason());try(var r=q.executeQuery()){if(!r.next()||!r.getBoolean(1))throw new SQLException("Required candidate preparation missing");}
            }
            return json.valueToTree(candidate(c,scope,id));
        });
    }
    public Validation validate(ActorContext context,Scope scope,UUID id,long expected){
        if(scope==null||id==null||expected<1)throw new Refusal(RefusalReason.INVALID_INPUT);
        return catalogue.read(context,(c,actor)->{requireDelegate(c,context,"role.definition.prepare",scope);var candidate=candidate(c,scope,id);checkCandidate(c,candidate,expected,candidate.baseVersionId());return new Validation(true,candidate,candidate.difference(),List.of("Activation appends an immutable version; no assignment is changed.","Assignment replacement is a separate explicitly authorized operation.","Management scope and supported principals/scopes do not grant authority."));});
    }
    void checkCandidate(Connection c,Candidate candidate,long expected,UUID base)throws SQLException{
        if(candidate.version()!=expected||candidate.activatedVersionId()!=null||!Objects.equals(candidate.baseVersionId(),base)||!Objects.equals(latest(c,candidate.definitionId()),base))throw new Refusal(RefusalReason.STATE_CONFLICT);
        checkContent(c,candidate.managementScope(),candidate.permissionCodes(),candidate.support());
        if(!candidate.contentDigest().equals(contentDigest(candidate.roleCode(),candidate.proposedRoleVersion(),candidate.classification(),candidate.support(),candidate.permissionCodes())))throw new Refusal(RefusalReason.STATE_CONFLICT);
    }
    @FunctionalInterface interface Mutation {JsonNode apply(Connection c)throws SQLException;}
    JsonNode write(ActorContext context,UUID operation,Scope scope,String action,String permission,Object input,String reason,Mutation mutation){
        if(operation==null)throw new Refusal(RefusalReason.INVALID_INPUT);
        var digest=hash(json.writeValueAsString(input));var attempt=UUID.randomUUID();var correlation=UUID.randomUUID();
        final Reply reply;
        try{reply=transactions.executeOwner(context,new IdentityTransactions.OwnerCommand<Reply>(){
            AuthorizationDecisionService.Decision initial;boolean replay;Reply cached;
            @Override public void revalidate(Connection c,OwnerSessionEligibility.EligibleActor actor)throws SQLException{
                if(initial==null&&!replay){
                    try(var q=c.prepareStatement("SELECT e.actor_id,e.organization_id,e.action,e.input_digest,e.result::text,o.outcome,o.reason_code FROM role_definition_owner_operation e JOIN access_policy_owner_outcome o USING(operation_id) WHERE e.operation_id=?")){
                        q.setObject(1,operation);try(var r=q.executeQuery()){if(r.next()){
                            replay=true;
                            if(!actor.actorId().equals(r.getObject(1,UUID.class))||!actor.organizationId().equals(r.getObject(2,UUID.class)))cached=new Reply(null,RefusalReason.AUTHORITY_REFUSED);
                            else if(!action.equals(r.getString(3))||!digest.equals(r.getString(4)))cached=new Reply(null,RefusalReason.STATE_CONFLICT);
                            else cached=new Reply(json.readTree(r.getString(5)),"REFUSED".equals(r.getString(6))?RefusalReason.valueOf(r.getString(7)):null);
                        }}
                    }
                    if(!replay){initial=requireDelegate(c,context,permission,scope);return;}
                }
                if(replay){RoleCatalogueQueries.require(authorization.evaluate(c,context,"role.catalogue.read",scope));return;}
                retain(c,operation,attempt,"COMMIT",requireDelegate(c,context,permission,scope));
            }
            @Override public Reply apply(Connection c,OwnerSessionEligibility.EligibleActor actor)throws SQLException{
                if(replay)return cached;
                try(var q=c.prepareStatement("SELECT 1 FROM access_policy_owner_outcome WHERE operation_id=?")){q.setObject(1,operation);try(var r=q.executeQuery()){if(r.next())return new Reply(null,RefusalReason.STATE_CONFLICT);}}
                retain(c,operation,attempt,"REQUEST",initial);
                JsonNode result;RefusalReason refusal=null;var savepoint=c.setSavepoint();
                try{result=mutation.apply(c);}catch(Refusal business){c.rollback(savepoint);refusal=business.reason();result=json.createObjectNode();}finally{c.releaseSavepoint(savepoint);}
                var outcome=refusal==null?"ACCEPTED":"REFUSED";
                insert(c,"INSERT INTO access_policy_owner_outcome(operation_id,actor_id,action,target_id,outcome,reason_code) VALUES (?,?,?,?,?,?)",operation,actor.actorId(),"role.definition."+action.toLowerCase(Locale.ROOT),scope.organizationId().toString(),outcome,refusal==null?null:refusal.name());
                insert(c,"INSERT INTO role_definition_owner_operation(operation_id,actor_id,organization_id,requested_scope,action,input_digest,correlation_id,reason,result) VALUES (?,?,?,?::jsonb,?,?,?,?,?::jsonb)",operation,actor.actorId(),actor.organizationId(),json.writeValueAsString(scope),action,digest,correlation,reason,json.writeValueAsString(result));
                insert(c,"INSERT INTO audit_evidence(evidence_id,operation_id,actor_id,action,target_type,target_id,outcome,reason_code) VALUES (?,?,?,?,?,?,?,?)",UUID.randomUUID(),operation,actor.actorId(),"role.definition."+action.toLowerCase(Locale.ROOT),"Role Definition",result.has("definitionId")?result.path("definitionId").asString():scope.organizationId().toString(),outcome,refusal==null?null:refusal.name());
                return new Reply(result,refusal);
            }
        });}catch(IdentityRefusal failure){throw new Refusal(RefusalReason.INELIGIBLE_SESSION);}
        if(reply.refusal()!=null)throw new Refusal(reply.refusal());return reply.result();
    }
    AuthorizationDecisionService.Decision requireDelegate(Connection c,ActorContext context,String permission,Scope scope)throws SQLException{
        var decision=authorization.evaluate(c,context,permission,scope);RoleCatalogueQueries.require(decision);
        if(decision.paths().stream().noneMatch(p->p.roleCode().equals("privileged-role-administrator")&&p.roleVersion()==1&&p.assignmentScope().organizationId().equals(scope.organizationId())&&(p.assignmentScope().projectId()==null||p.assignmentScope().projectId().equals(scope.projectId()))))throw new Refusal(RefusalReason.AUTHORITY_REFUSED);
        return decision;
    }
    void checkContent(Connection c,Scope management,List<String> codes,Support support)throws SQLException{
        if(!CEILING.containsAll(codes)||codes.stream().anyMatch(code->!RoleCatalogueQueries.implemented(code)))throw new Refusal(RefusalReason.STATE_CONFLICT);
        if(!Set.of("ORGANIZATION","PROJECT").containsAll(support.scopeKinds())||!Set.of("ACTOR","PROJECT_GROUP").containsAll(support.principalKinds())||(management.projectId()!=null&&support.scopeKinds().contains("ORGANIZATION")))throw new Refusal(RefusalReason.INVALID_INPUT);
        if(!codes.equals(List.of("project.read"))&&!support.principalKinds().equals(List.of("ACTOR")))throw new Refusal(RefusalReason.INVALID_INPUT);
        for(var code:codes)try(var q=c.prepareStatement("SELECT scope_kinds,principal_kinds FROM permission_registry WHERE permission_code=?")){q.setString(1,code);try(var r=q.executeQuery()){if(!r.next()||!List.of((String[])r.getArray(1).getArray()).containsAll(support.scopeKinds())||!List.of((String[])r.getArray(2).getArray()).containsAll(support.principalKinds()))throw new Refusal(RefusalReason.INVALID_INPUT);}}
    }
    Candidate definition(Connection c,Scope scope,UUID id)throws SQLException{
        try(var q=c.prepareStatement("SELECT role_code,display_name,built_in,management_scope_kind,management_organization_id,management_project_id FROM identity_role_definition WHERE definition_id=?")){q.setObject(1,id);try(var r=q.executeQuery()){
            if(!r.next())throw new Refusal(RefusalReason.TARGET_NOT_AVAILABLE);if(r.getBoolean(3))throw new Refusal(RefusalReason.AUTHORITY_REFUSED);
            if(!scope.organizationId().equals(r.getObject(5,UUID.class)))throw new Refusal(RefusalReason.TARGET_NOT_AVAILABLE);
            if(!scope.kind().name().equals(r.getString(4))||!Objects.equals(scope.projectId(),r.getObject(6,UUID.class)))throw new Refusal(RefusalReason.AUTHORITY_REFUSED);
            return new Candidate(null,id,r.getString(1),r.getString(2),scope,null,0,null,null,List.of(),null,0,null,null,null);
        }}
    }
    static UUID latest(Connection c,UUID definition)throws SQLException{try(var q=c.prepareStatement("SELECT p.role_version_id FROM identity_role_version_profile p JOIN identity_role_version v USING(role_version_id) WHERE p.definition_id=? ORDER BY v.version DESC LIMIT 1")){q.setObject(1,definition);try(var r=q.executeQuery()){return r.next()?r.getObject(1,UUID.class):null;}}}
    Candidate candidate(Connection c,Scope scope,UUID id)throws SQLException{
        try(var q=c.prepareStatement("SELECT definition_id,base_version_id,classification,scope_kinds,principal_kinds,content_digest,version,activated_version_id FROM identity_role_candidate WHERE candidate_id=?")){q.setObject(1,id);try(var r=q.executeQuery()){
            if(!r.next())throw new Refusal(RefusalReason.TARGET_NOT_AVAILABLE);var def=definition(c,scope,r.getObject(1,UUID.class));var base=r.getObject(2,UUID.class);
            var codes=new ArrayList<String>();try(var p=c.prepareStatement("SELECT permission_code FROM identity_role_candidate_permission WHERE candidate_id=? ORDER BY permission_code COLLATE \"C\"")){p.setObject(1,id);try(var rows=p.executeQuery()){while(rows.next())codes.add(rows.getString(1));}}
            var old=base==null?List.<String>of():RoleCatalogueQueries.role(c,base).permissions().stream().map(RoleCatalogueQueries.Permission::code).toList();
            var difference=new Difference(codes.stream().filter(code->!old.contains(code)).toList(),old.stream().filter(code->!codes.contains(code)).toList(),codes.stream().filter(old::contains).toList());
            var active=r.getObject(8,UUID.class);return new Candidate(id,def.definitionId(),def.roleCode(),def.displayName(),scope,base,base==null?1:RoleCatalogueQueries.role(c,base).version()+1,r.getString(3),new Support(List.of((String[])r.getArray(4).getArray()),List.of((String[])r.getArray(5).getArray())),List.copyOf(codes),r.getString(6),r.getLong(7),active==null?"CANDIDATE":"ACTIVATED",active,difference);
        }}
    }
    private void retain(Connection c,UUID operation,UUID attempt,String stage,AuthorizationDecisionService.Decision decision)throws SQLException{insert(c,"INSERT INTO role_definition_authorization_evidence(evidence_id,attempt_id,operation_id,stage,actor_id,requested_scope,permission_code,paths,evaluated_at) VALUES (?,?,?,?,?,?::jsonb,?,?::jsonb,?)",UUID.randomUUID(),attempt,operation,stage,decision.actorId(),json.writeValueAsString(decision.scope()),decision.permission(),json.writeValueAsString(decision.paths()),Timestamp.from(decision.evaluatedAt()));}
    static String text(String value,int length){if(value==null||value.trim().isEmpty()||value.trim().length()>length||value.codePoints().anyMatch(Character::isISOControl))throw new Refusal(RefusalReason.INVALID_INPUT);return value.trim();}
    static List<String> sorted(List<String> values){if(values==null||values.isEmpty()||values.size()>25||values.stream().anyMatch(v->v==null||v.isBlank()))throw new Refusal(RefusalReason.INVALID_INPUT);return values.stream().distinct().sorted().toList();}
    static String contentDigest(String code,int version,String kind,Support support,List<String> permissions){return hash(code+"|"+version+"|"+kind+"|"+String.join(",",support.scopeKinds())+"|"+String.join(",",support.principalKinds())+"|"+String.join(",",permissions));}
    static String hash(String value){try{return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(value.getBytes(StandardCharsets.UTF_8)));}catch(java.security.NoSuchAlgorithmException impossible){throw new IllegalStateException(impossible);}}
    static void insert(Connection c,String sql,Object...values)throws SQLException{try(var q=c.prepareStatement(sql)){for(int i=0;i<values.length;i++)q.setObject(i+1,values[i]);if(q.executeUpdate()!=1)throw new SQLException("Required Custom Role write missing");}}
}
