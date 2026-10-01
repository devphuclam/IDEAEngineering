package com.idea.ddm.identity;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.CookieClearingLogoutHandler;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.web.filter.OncePerRequestFilter;

/** Publish logout and clear ordinary Spring proof only after the IAM transaction commits. */
final class LogoutBoundary extends OncePerRequestFilter {
    private final SessionService sessions;
    private final SecurityContextLogoutHandler contexts = new SecurityContextLogoutHandler();
    private final CookieClearingLogoutHandler cookies = new CookieClearingLogoutHandler("IDEA_SESSION");

    LogoutBoundary(SessionService sessions, SecurityContextRepository repository) {
        this.sessions = sessions;
        contexts.setSecurityContextRepository(repository);
    }

    @Override protected boolean shouldNotFilter(HttpServletRequest request) {
        return !request.getMethod().equals("POST") || !request.getServletPath().equals("/api/v1/identity/logout");
    }

    @Override protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        try {
            sessions.signOut(authentication != null && authentication.getPrincipal() instanceof SessionService.Identity identity
                    ? identity : null);
        } catch (IdentityRefusal exception) {
            response.setStatus(401);
            return;
        } catch (InternalAuthenticationServiceException | IllegalStateException exception) {
            response.setStatus(503);
            return;
        } catch (AuthenticationException exception) {
            response.setStatus(401);
            return;
        }
        contexts.logout(request, response, authentication);
        cookies.logout(request, response, authentication);
        response.setStatus(204);
    }
}
