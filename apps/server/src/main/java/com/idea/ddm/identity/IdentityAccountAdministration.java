package com.idea.ddm.identity;

import com.idea.ddm.access.AuthorizationDecisionService;
import com.idea.ddm.iam.IamWebConfiguration;
import javax.sql.DataSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import java.util.UUID;

/** New authorized read adapter; commands keep the accepted Identity owner/status/retry contract. */
@RestController
@IamWebConfiguration.Boundary
@RequestMapping("/api/v1/administration")
public final class IdentityAccountAdministration {
    private final IdentityDirectoryQueries directory;
    private final SessionService sessions;
    IdentityAccountAdministration(IdentityDirectoryQueries directory,SessionService sessions){this.directory=directory;this.sessions=sessions;}
    private ActorContext context(Authentication auth){
        if(auth==null || !(auth.getPrincipal() instanceof SessionService.Identity identity))throw new IamWebConfiguration.Refusal(IamWebConfiguration.RefusalReason.INELIGIBLE_SESSION);
        try { sessions.current(identity); return sessions.context(identity); }
        catch(org.springframework.security.core.AuthenticationException refused){throw new IamWebConfiguration.Refusal(IamWebConfiguration.RefusalReason.INELIGIBLE_SESSION);}
    }
    @GetMapping("/context")
    ResponseEntity<IdentityDirectoryQueries.Context> current(Authentication auth){return safe(directory.context(context(auth)));}
    @GetMapping("/accounts")
    ResponseEntity<IdentityDirectoryQueries.Page> accounts(Authentication auth,@RequestParam(required=false)UUID organizationId,
            @RequestParam(defaultValue="")String filter,@RequestParam(defaultValue="0")int offset,@RequestParam(defaultValue="50")int limit){
        return safe(directory.accounts(context(auth),organizationId,filter,offset,limit));
    }
    @GetMapping("/accounts/{account}")
    ResponseEntity<IdentityDirectoryQueries.Account> account(Authentication auth,@PathVariable UUID account,@RequestParam(required=false)UUID organizationId){return safe(directory.account(context(auth),organizationId,account));}
    private static <T>ResponseEntity<T> safe(T value){return ResponseEntity.ok().cacheControl(CacheControl.noStore()).body(value);}
    @Configuration(proxyBeanMethods=false)
    static class Wiring{
        @Bean IdentityDirectoryQueries directory(DataSource source,OwnerSessionEligibility eligibility,AuthorizationDecisionService authorization){return new IdentityDirectoryQueries(source,eligibility,authorization);}
    }
}
