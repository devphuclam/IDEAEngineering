package com.idea.ddm.project;

import com.idea.ddm.access.AuthorizationDecisionService;
import com.idea.ddm.iam.IamWebConfiguration;
import com.idea.ddm.identity.*;
import java.time.Clock;
import java.util.UUID;
import javax.sql.DataSource;
import org.springframework.context.annotation.*;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/** Sole HTTP adapter for the approved UI-P operation catalogue. Ordinary F03 session/CSRF. */
@RestController
@IamWebConfiguration.Boundary
public final class ProjectGovernanceController {
    private final ProjectGovernanceAdministration owner;
    private final SessionService sessions;
    ProjectGovernanceController(ProjectGovernanceAdministration owner,SessionService sessions){this.owner=owner;this.sessions=sessions;}
    record Create(UUID operationId,UUID organizationId,String name,String reason){}
    @PostMapping("/api/v1/administration/projects")
    ResponseEntity<?> create(Authentication auth,@RequestBody Create request){return safe(201,owner.create(context(auth),request.operationId(),request.organizationId(),request.name(),request.reason()));}
    @GetMapping("/api/v1/administration/projects/{id}")
    ResponseEntity<?> project(Authentication auth,@PathVariable UUID id,@RequestParam(required=false)UUID organizationId){return safe(200,owner.project(context(auth),organizationId,id,false));}
    @GetMapping("/api/v1/projects/{id}")
    ResponseEntity<?> participant(Authentication auth,@PathVariable UUID id){return safe(200,owner.project(context(auth),null,id,true));}
    private ActorContext context(Authentication auth){
        if(auth==null || !(auth.getPrincipal() instanceof SessionService.Identity identity))throw new IamWebConfiguration.Refusal(IamWebConfiguration.RefusalReason.INELIGIBLE_SESSION);
        try{sessions.current(identity);return sessions.context(identity);}
        catch(org.springframework.security.core.AuthenticationException refused){throw new IamWebConfiguration.Refusal(IamWebConfiguration.RefusalReason.INELIGIBLE_SESSION);}
    }
    static ResponseEntity<?> safe(int status,Object value){return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(value);}
    @Configuration(proxyBeanMethods=false)
    static class Wiring{
        @Bean ProjectGovernanceAdministration projects(DataSource source,IdentityTransactions transactions,OwnerSessionEligibility eligibility,
                AuthorizationDecisionService authorization,ProjectGovernanceQueries queries,Clock clock){return new ProjectGovernanceAdministration(source,transactions,eligibility,authorization,queries,clock);}
    }
}
