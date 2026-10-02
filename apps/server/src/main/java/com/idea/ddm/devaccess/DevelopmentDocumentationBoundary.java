package com.idea.ddm.devaccess;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

/** Hide development documentation/assets before authentication when not explicitly enabled. */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE + 10)
final class DevelopmentDocumentationBoundary extends OncePerRequestFilter {
    private final boolean enabled;

    DevelopmentDocumentationBoundary(@Value("${idea.dev-api.enabled:false}") boolean enabled) {
        this.enabled = enabled;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
            FilterChain chain) throws ServletException, IOException {
        var path = request.getServletPath();
        var swaggerWebJarPath = path.equals("/webjars/swagger-ui") || path.startsWith("/webjars/swagger-ui/");
        var disabledDocumentationPath = path.equals("/dev-api") || path.startsWith("/dev-api/");
        if (swaggerWebJarPath || (!enabled && disabledDocumentationPath)) {
            response.setStatus(404);
            return;
        }
        chain.doFilter(request, response);
    }
}
