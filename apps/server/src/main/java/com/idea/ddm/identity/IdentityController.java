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
    private final boolean syntheticDelivery;

    IdentityController(SessionService sessions, CredentialSetupService credentials, CredentialResetService resets,
            @Value("${idea.identity.synthetic-credential-delivery.enabled:false}") boolean syntheticDelivery) {
        this.sessions = sessions;
        this.credentials = credentials;
        this.resets = resets;
        this.syntheticDelivery = syntheticDelivery;
    }

    record CsrfProof(String headerName, String token) {}
    record IssueCredential(UUID operationId, UUID organizationId, String purpose, long expectedSecurityVersion, String reason) {}
    record RedeemCredential(UUID operationId, UUID accountId, String proof, String password, String purpose) {
        @Override public String toString() { return "RedeemCredential[credentials=REDACTED]"; }
    }

    @PostMapping("/accounts/{account}/credential-proofs")
    ResponseEntity<CredentialSetupService.IssuedProof> issueProof(@PathVariable UUID account, @RequestBody IssueCredential request,
            Authentication authentication) {
        // No live delivery channel is qualified. Explicit opt-in is for the protected synthetic harness only.
        if (!syntheticDelivery) return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).build();
        try {
            var identity = authentication.getPrincipal() instanceof SessionService.Identity value ? value : null;
            if ("RESET".equals(request.purpose())) return ResponseEntity.ok(resets.issue(sessions.context(identity),
                    request.operationId(), request.organizationId(), account, request.expectedSecurityVersion(), request.reason()));
            return ResponseEntity.ok(credentials.issue(sessions.context(identity), request.operationId(), request.organizationId(), account,
                    request.purpose(), request.expectedSecurityVersion(), request.reason()));
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
