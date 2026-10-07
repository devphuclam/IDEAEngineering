package com.idea.ddm.identity;

import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.beans.factory.annotation.Value;
import java.util.UUID;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/v1/identity")
class IdentityController {
    private final SessionService sessions;
    private final CredentialSetupService credentials;
    private final CredentialResetService resets;
    private final IdentityAdministration accounts;
    private final boolean syntheticDelivery;
    private final boolean manualDelivery;

    IdentityController(SessionService sessions, CredentialSetupService credentials, CredentialResetService resets,
            IdentityAdministration accounts,
            @Value("${idea.identity.synthetic-credential-delivery.enabled:false}") boolean syntheticDelivery,
            @Value("${idea.identity.manual-credential-delivery.enabled:false}") boolean manualDelivery) {
        this.sessions = sessions;
        this.credentials = credentials;
        this.resets = resets;
        this.accounts = accounts;
        this.syntheticDelivery = syntheticDelivery;
        this.manualDelivery = manualDelivery;
    }

    record CsrfProof(String headerName, String token) {}
    record CreateAccount(UUID operationId, UUID organizationId, String displayName, String login) {}
    record CreatedAccount(UUID actorId, UUID accountId, UUID loginIdentityId, String status, long securityVersion) {}
    record ChangeAccount(UUID operationId, UUID organizationId, long expectedSecurityVersion, String reason) {}
    record AccountState(UUID actorId, UUID accountId, String status, long securityVersion) {}
    record IssueCredential(UUID operationId, UUID organizationId, String purpose, long expectedSecurityVersion, String reason,
            UUID loginIdentityId) {}
    record RedeemCredential(UUID operationId, UUID accountId, String proof, String password, String purpose) {
        @Override public String toString() { return "RedeemCredential[credentials=REDACTED]"; }
    }

    @PostMapping("/accounts")
    ResponseEntity<CreatedAccount> createAccount(@RequestBody CreateAccount request, Authentication authentication) {
        if (request.operationId() == null || request.organizationId() == null) return ResponseEntity.badRequest().build();
        try {
            var identity = authentication.getPrincipal() instanceof SessionService.Identity value ? value : null;
            var created = accounts.create(sessions.context(identity), request.operationId(), request.organizationId(),
                    request.displayName(), request.login());
            return ResponseEntity.status(HttpStatus.CREATED).body(new CreatedAccount(created.actorId(), created.accountId(),
                    created.loginIdentityId(), created.status(), created.securityVersion()));
        } catch (AuthenticationException exception) { return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); }
        catch (IdentityRefusal exception) { return ResponseEntity.status(accountRefusalStatus(exception)).build(); }
        catch (IllegalStateException exception) { return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).build(); }
    }

    @PostMapping("/accounts/{account}/disable")
    ResponseEntity<AccountState> disableAccount(@PathVariable UUID account, @RequestBody ChangeAccount request,
            Authentication authentication) {
        return changeAccount(account, request, authentication, true);
    }

    @PostMapping("/accounts/{account}/re-enable")
    ResponseEntity<AccountState> reenableAccount(@PathVariable UUID account, @RequestBody ChangeAccount request,
            Authentication authentication) {
        return changeAccount(account, request, authentication, false);
    }

    private ResponseEntity<AccountState> changeAccount(UUID account, ChangeAccount request,
            Authentication authentication, boolean disabling) {
        if (request.operationId() == null || request.organizationId() == null || request.expectedSecurityVersion() < 1) {
            return ResponseEntity.badRequest().build();
        }
        try {
            var identity = authentication.getPrincipal() instanceof SessionService.Identity value ? value : null;
            var context = sessions.context(identity);
            var changed = disabling
                    ? accounts.disable(context, request.operationId(), request.organizationId(), account,
                            request.expectedSecurityVersion(), request.reason())
                    : accounts.reenable(context, request.operationId(), request.organizationId(), account,
                            request.expectedSecurityVersion(), request.reason());
            // Account-level transition: do not imply selection of one arbitrary sibling Login Identity.
            return ResponseEntity.ok(new AccountState(changed.actorId(), changed.accountId(), changed.status(), changed.securityVersion()));
        } catch (AuthenticationException exception) { return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); }
        catch (IdentityRefusal exception) { return ResponseEntity.status(accountRefusalStatus(exception)).build(); }
        catch (IllegalStateException exception) { return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).build(); }
    }

    private static HttpStatus accountRefusalStatus(IdentityRefusal exception) {
        return switch (exception.reason()) {
            case "INELIGIBLE_SESSION" -> HttpStatus.UNAUTHORIZED;
            case "INVALID_INPUT" -> HttpStatus.BAD_REQUEST;
            case "LOGIN_IDENTIFIER_EXISTS", "STALE_ACCOUNT_VERSION", "INVALID_ACCOUNT_STATE" -> HttpStatus.CONFLICT;
            default -> HttpStatus.FORBIDDEN;
        };
    }

    @PostMapping("/accounts/{account}/credential-proofs")
    ResponseEntity<CredentialSetupService.IssuedProof> issueProof(@PathVariable UUID account, @RequestBody IssueCredential request,
            Authentication authentication) {
        // Separate opt-ins: old synthetic harness is not authority for ordinary manual delivery.
        if (!syntheticDelivery && !manualDelivery) return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).build();
        try {
            var identity = authentication.getPrincipal() instanceof SessionService.Identity value ? value : null;
            if(manualDelivery && request.loginIdentityId()==null)return ResponseEntity.badRequest().build();
            var issued="RESET".equals(request.purpose())
                    ? resets.issue(sessions.context(identity),request.operationId(),request.organizationId(),account,request.loginIdentityId(),request.expectedSecurityVersion(),request.reason(),manualDelivery)
                    : credentials.issue(sessions.context(identity),request.operationId(),request.organizationId(),account,request.loginIdentityId(),request.purpose(),request.expectedSecurityVersion(),request.reason(),manualDelivery);
            return ResponseEntity.ok().cacheControl(org.springframework.http.CacheControl.noStore()).body(issued);
        } catch (AuthenticationException exception) { return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); }
        catch (IdentityRefusal exception) {
            return ResponseEntity.status("INELIGIBLE_SESSION".equals(exception.reason()) ? HttpStatus.UNAUTHORIZED
                    : "INVALID_INPUT".equals(exception.reason()) ? HttpStatus.BAD_REQUEST : HttpStatus.FORBIDDEN).build();
        } catch (IllegalStateException exception) { return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).build(); }
    }

    @PostMapping("/credentials")
    ResponseEntity<Void> redeemProof(@RequestBody RedeemCredential request) {
        try {
            if ("RESET".equals(request.purpose())) {
                resets.redeem(request.operationId(), request.accountId(), request.proof(), request.password());
            } else if (request.purpose() == null || "FIRST_SETUP".equals(request.purpose())) {
                credentials.redeem(request.operationId(), request.accountId(), request.proof(), request.password());
            } else throw new IdentityRefusal("INVALID_CREDENTIAL_PROOF");
            return ResponseEntity.noContent().build();
        } catch (IdentityRefusal exception) { return ResponseEntity.badRequest().build(); }
        catch (IllegalStateException exception) { return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).build(); }
    }

    @GetMapping("/csrf")
    CsrfProof csrf(CsrfToken proof) {
        return new CsrfProof(proof.getHeaderName(), proof.getToken());
    }

    @GetMapping("/session")
    SessionService.View session(Authentication authentication) {
        try {
            return sessions.current(authentication.getPrincipal() instanceof SessionService.Identity identity ? identity : null);
        } catch (AuthenticationException exception) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
    }
}
