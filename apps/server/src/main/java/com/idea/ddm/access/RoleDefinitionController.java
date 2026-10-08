package com.idea.ddm.access;

import com.idea.ddm.iam.IamWebConfiguration;
import com.idea.ddm.identity.*;
import java.time.Clock;
import java.util.*;
import org.springframework.context.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.JsonNode;

/** Custom Role owner only. UI-R01 remains exclusively RoleCatalogueController. */
@RestController
@IamWebConfiguration.Boundary
public final class RoleDefinitionController {
    private final RoleDefinitionCandidateService candidates;private final SessionService sessions;
    RoleDefinitionController(RoleDefinitionCandidateService candidates,SessionService sessions){this.candidates=candidates;this.sessions=sessions;}
    record Prepare(UUID operationId,AuthorizationDecisionService.Scope scope,UUID definitionId,String name,UUID baseVersionId,List<String> permissionCodes,RoleDefinitionCandidateService.Support support,String reason,JsonNode condition){}
    @PostMapping("/api/v1/administration/roles/candidates")
    ResponseEntity<?> prepare(Authentication auth,@RequestBody Prepare r){return RoleCatalogueController.safe(201,candidates.prepare(context(auth),r.operationId(),r.scope(),r.definitionId(),r.name(),r.baseVersionId(),r.permissionCodes(),r.support(),r.reason(),r.condition()));}
    private ActorContext context(Authentication auth){try{return sessions.currentContext(auth);}catch(org.springframework.security.core.AuthenticationException failure){throw new IamWebConfiguration.Refusal(IamWebConfiguration.RefusalReason.INELIGIBLE_SESSION);}}
    @Configuration(proxyBeanMethods=false)
    static class Wiring{@Bean RoleDefinitionCandidateService candidates(IdentityTransactions transactions,AuthorizationDecisionService authorization,RoleCatalogueQueries catalogue,Clock clock){return new RoleDefinitionCandidateService(transactions,authorization,catalogue,clock);}}
}
