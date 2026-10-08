package com.idea.ddm.access;

import com.idea.ddm.iam.IamWebConfiguration;
import com.idea.ddm.identity.*;
import java.util.UUID;
import org.springframework.context.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/** Sole UI-R10 / UI-A01 / UI-O01 boundary; POST inspection is a CSRF-protected query. */
@RestController
@IamWebConfiguration.Boundary
public final class AccessInspectionController {
    private final AccessInspectionQueries queries;private final SessionService sessions;
    AccessInspectionController(AccessInspectionQueries queries,SessionService sessions){this.queries=queries;this.sessions=sessions;}
    record Inspect(UUID targetActorId,String permissionCode,AuthorizationDecisionService.Scope scope,UUID resourceId) {}
    @PostMapping("/api/v1/administration/access-inspections")
    ResponseEntity<?> inspect(Authentication auth,@RequestBody Inspect r){return RoleCatalogueController.safe(200,queries.inspect(context(auth),r.targetActorId(),r.permissionCode(),r.scope(),r.resourceId()));}
    @GetMapping("/api/v1/administration/history")
    ResponseEntity<?> history(Authentication auth,@RequestParam UUID organizationId,@RequestParam(required=false)UUID projectId,@RequestParam(required=false)UUID targetId,@RequestParam(defaultValue="0")int offset,@RequestParam(defaultValue="50")int limit){return RoleCatalogueController.safe(200,queries.history(context(auth),RoleCatalogueController.scope(organizationId,projectId),targetId,offset,limit));}
    @GetMapping("/api/v1/administration/operations/{id}")
    ResponseEntity<?> operation(Authentication auth,@PathVariable UUID id,@RequestParam UUID organizationId,@RequestParam(required=false)UUID projectId){return RoleCatalogueController.safe(200,queries.operation(context(auth),id,RoleCatalogueController.scope(organizationId,projectId)));}
    private ActorContext context(Authentication auth){try{return sessions.currentContext(auth);}catch(org.springframework.security.core.AuthenticationException refused){throw new IamWebConfiguration.Refusal(IamWebConfiguration.RefusalReason.INELIGIBLE_SESSION);}}
    @Configuration(proxyBeanMethods=false)
    static class Wiring{@Bean AccessInspectionQueries inspection(RoleCatalogueQueries catalogue,AuthorizationDecisionService authorization){return new AccessInspectionQueries(catalogue,authorization);}}
}
