package com.idea.ddm.access;

import com.idea.ddm.iam.IamWebConfiguration;
import com.idea.ddm.identity.*;
import java.time.Clock;
import java.util.UUID;
import org.springframework.context.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.JsonNode;

/** Only UI-R05--R09. No Custom Role publication, Inspector or generic operation route. */
@RestController
@IamWebConfiguration.Boundary
public final class RoleAssignmentController {
    private final RoleAssignmentAdministration owner;private final SessionService sessions;
    RoleAssignmentController(RoleAssignmentAdministration owner,SessionService sessions){this.owner=owner;this.sessions=sessions;}
    record Grant(UUID operationId,RoleAssignmentAdministration.Principal principal,AuthorizationDecisionService.Scope scope,UUID roleVersionId,RoleAssignmentAdministration.Interval interval,String reason,JsonNode condition){}
    record Preview(RoleAssignmentAdministration.Principal principal,AuthorizationDecisionService.Scope scope,UUID roleVersionId,RoleAssignmentAdministration.Interval interval,UUID assignmentId,Long expectedVersion,JsonNode condition){}
    record End(UUID operationId,AuthorizationDecisionService.Scope scope,long expectedVersion,String reason){}
    record Replace(UUID operationId,AuthorizationDecisionService.Scope scope,long expectedVersion,UUID newRoleVersionId,RoleAssignmentAdministration.Interval interval,String reason,JsonNode condition){}
    @GetMapping("/api/v1/administration/assignments")
    ResponseEntity<?> list(Authentication auth,@RequestParam UUID organizationId,@RequestParam(required=false)UUID projectId,@RequestParam(required=false)UUID actorId,@RequestParam(required=false)UUID groupId,@RequestParam(defaultValue="0")int offset,@RequestParam(defaultValue="50")int limit){return RoleCatalogueController.safe(200,owner.assignments(context(auth),RoleCatalogueController.scope(organizationId,projectId),actorId,groupId,offset,limit));}
    @GetMapping("/api/v1/administration/assignments/{id}")
    ResponseEntity<?> exact(Authentication auth,@PathVariable UUID id,@RequestParam UUID organizationId,@RequestParam(required=false)UUID projectId){return RoleCatalogueController.safe(200,owner.assignment(context(auth),RoleCatalogueController.scope(organizationId,projectId),id));}
    @PostMapping("/api/v1/administration/assignments/preview")
    ResponseEntity<?> preview(Authentication auth,@RequestBody Preview r){return RoleCatalogueController.safe(200,owner.preview(context(auth),r.principal(),r.scope(),r.roleVersionId(),r.interval(),r.assignmentId(),r.expectedVersion()==null?0:r.expectedVersion(),r.condition()));}
    @PostMapping("/api/v1/administration/assignments")
    ResponseEntity<?> grant(Authentication auth,@RequestBody Grant r){return RoleCatalogueController.safe(201,owner.grant(context(auth),r.operationId(),r.principal(),r.scope(),r.roleVersionId(),r.interval(),r.reason(),r.condition()));}
    @PostMapping("/api/v1/administration/assignments/{id}/end")
    ResponseEntity<?> end(Authentication auth,@PathVariable UUID id,@RequestBody End r){return RoleCatalogueController.safe(200,owner.end(context(auth),r.operationId(),r.scope(),id,r.expectedVersion(),r.reason()));}
    @PostMapping("/api/v1/administration/assignments/{id}/replace")
    ResponseEntity<?> replace(Authentication auth,@PathVariable UUID id,@RequestBody Replace r){return RoleCatalogueController.safe(200,owner.replace(context(auth),r.operationId(),r.scope(),id,r.expectedVersion(),r.newRoleVersionId(),r.interval(),r.reason(),r.condition()));}
    private ActorContext context(Authentication auth){try{return sessions.currentContext(auth);}catch(org.springframework.security.core.AuthenticationException refused){throw new IamWebConfiguration.Refusal(IamWebConfiguration.RefusalReason.INELIGIBLE_SESSION);}}
    @Configuration(proxyBeanMethods=false)
    static class Wiring{@Bean RoleAssignmentAdministration assignments(IdentityTransactions transactions,AuthorizationDecisionService authorization,RoleCatalogueQueries catalogue,Clock clock){return new RoleAssignmentAdministration(transactions,authorization,catalogue,clock);}}
}
