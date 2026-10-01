package com.idea.ddm.identity;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.filter.OncePerRequestFilter;

/** Surround ordinary Spring form authentication, including exits before its success handler. */
final class SignInBoundary extends OncePerRequestFilter {
    private final SessionService sessions;

    SignInBoundary(SessionService sessions) { this.sessions = sessions; }

    @Override protected boolean shouldNotFilter(HttpServletRequest request) {
        return !request.getMethod().equals("POST") || !request.getServletPath().equals("/api/v1/identity/login");
    }

    @Override protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        sessions.beginSignIn();
        try { chain.doFilter(request, response); }
        finally {
            boolean abandon = sessions.uncommittedSignIn();
            try { sessions.endSignIn(); }
            finally {
                if (abandon) {
                    // Clear shared context references as well as the thread-local holder.
                    SecurityContextHolder.getContext().setAuthentication(null);
                    SecurityContextHolder.clearContext();
                    var session = request.getSession(false);
                    if (session != null) {
                        var stored = session.getAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY);
                        if (stored instanceof SecurityContext context) context.setAuthentication(null);
                        session.invalidate();
                    }
                }
            }
        }
    }

    void complete(HttpServletRequest request, SessionService.Identity identity) {
        var session = request.getSession(false);
        var stored = session == null ? null : session.getAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY);
        if (!(stored instanceof SecurityContext context) || context.getAuthentication() == null
                || !context.getAuthentication().isAuthenticated() || !identity.equals(context.getAuthentication().getPrincipal())) {
            throw new InternalAuthenticationServiceException("Identity binding unavailable");
        }
        sessions.commitSignIn(identity); // Before publishing success; response loss after commit is not rollback.
    }
}
