package com.idea.ddm.access;

import com.idea.ddm.iam.IamWebConfiguration;
import com.idea.ddm.identity.*;
import java.util.UUID;
import javax.sql.DataSource;
import org.springframework.context.annotation.*;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@IamWebConfiguration.Boundary
public final class RoleCatalogueController {
    private final RoleCatalogueQueries queries;private final SessionService sessions;
    RoleCatalogueController(RoleCatalogueQueries queries,SessionService sessions){this.queries=queries;this.sessions=sessions;}
    @GetMapping("/api/v1/administration/roles")
    ResponseEntity<?> roles(Authentication auth,@RequestParam UUID organizationId,@RequestParam(required=false)UUID projectId,@RequestParam(defaultValue="")String filter,@RequestParam(defaultValue="0")int offset,@RequestParam(defaultValue="50")int limit){return safe(200,queries.roles(context(auth),scope(organizationId,projectId),filter,offset,limit));}
    @GetMapping("/api/v1/administration/permissions")
    ResponseEntity<?> permissions(Authentication auth,@RequestParam UUID organizationId,@RequestParam(required=false)UUID projectId,@RequestParam(defaultValue="0")int offset,@RequestParam(defaultValue="50")int limit){return safe(200,queries.permissions(context(auth),scope(organizationId,projectId),offset,limit));}
    @GetMapping("/api/v1/administration/roles/{id}/versions/{version}")
    ResponseEntity<?> exact(Authentication auth,@PathVariable UUID id,@PathVariable int version,@RequestParam UUID organizationId,@RequestParam(required=false)UUID projectId){return safe(200,queries.exact(context(auth),scope(organizationId,projectId),id,version));}
    private ActorContext context(Authentication auth){try{return sessions.currentContext(auth);}catch(org.springframework.security.core.AuthenticationException refused){throw new IamWebConfiguration.Refusal(IamWebConfiguration.RefusalReason.INELIGIBLE_SESSION);}}
    static AuthorizationDecisionService.Scope scope(UUID org,UUID project){return project==null?AuthorizationDecisionService.Scope.organization(org):AuthorizationDecisionService.Scope.project(org,project);}
    static ResponseEntity<?> safe(int status,Object body){return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body);}
    @Configuration(proxyBeanMethods=false)
    static class Wiring{@Bean RoleCatalogueQueries catalogue(DataSource source,OwnerSessionEligibility eligibility,AuthorizationDecisionService authorization){return new RoleCatalogueQueries(source,eligibility,authorization);}}
}
