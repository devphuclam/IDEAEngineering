package com.idea.ddm.identity;

import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/identity")
class IdentityController {
    private final SessionService sessions;

    IdentityController(SessionService sessions) { this.sessions = sessions; }

    record CsrfProof(String headerName, String token) {}

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
