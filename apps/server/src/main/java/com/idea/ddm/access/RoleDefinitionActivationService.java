package com.idea.ddm.access;

import com.idea.ddm.iam.IamWebConfiguration.Refusal;
import com.idea.ddm.iam.IamWebConfiguration.RefusalReason;
import com.idea.ddm.identity.ActorContext;
import java.sql.*;
import java.util.UUID;
import tools.jackson.databind.JsonNode;

/** Activation is separate from proposal preparation and every assignment transition. */
public final class RoleDefinitionActivationService {
    private record Intent(AuthorizationDecisionService.Scope scope,UUID candidateId,long expectedVersion,UUID baseVersionId,String reason){}
    private final RoleDefinitionCandidateService candidates;
    public RoleDefinitionActivationService(RoleDefinitionCandidateService candidates){this.candidates=candidates;}
    public JsonNode activate(ActorContext context,UUID operation,AuthorizationDecisionService.Scope scope,UUID id,long expected,UUID base,String reason){
        if(scope==null||id==null||expected<1)throw new Refusal(RefusalReason.INVALID_INPUT);
        var intent=new Intent(scope,id,expected,base,RoleDefinitionCandidateService.text(reason,500));
        return candidates.write(context,operation,scope,"ACTIVATE","role.definition.activate",intent,intent.reason(),c->{
            var candidate=candidates.candidate(c,scope,id);candidates.checkCandidate(c,candidate,expected,base);
            var version=UUID.randomUUID();
            try(var q=c.prepareStatement("SELECT role_candidate_activate(?,?,?,?,?,?,?)")){
                q.setObject(1,id);q.setObject(2,scope.organizationId());q.setLong(3,expected);q.setObject(4,base);q.setObject(5,version);q.setString(6,candidate.contentDigest());q.setTimestamp(7,Timestamp.from(candidates.clock.instant()));
                try(var r=q.executeQuery()){if(!r.next()||!r.getBoolean(1))throw new SQLException("Required immutable activation missing");}
            }
            var role=RoleCatalogueQueries.role(c,version);
            if(!role.selectable()||!role.contentDigest().equals(candidate.contentDigest()))throw new SQLException("Incomplete sealed activation");
            return candidates.json.valueToTree(role);
        });
    }
}
