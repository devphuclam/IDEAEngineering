package com.idea.ddm.identity;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import javax.sql.DataSource;
import java.time.Clock;
import java.util.List;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;

/** Deny by default; no generated account, Basic authentication or public bootstrap. */
@Configuration(proxyBeanMethods = false)
class IdentityHttpSecurity {
    @Bean
    @ConditionalOnMissingBean(Clock.class)
    Clock identityClock() { return Clock.systemUTC(); }

    @Bean
    SessionService sessions(DataSource dataSource, Clock identityClock) { return new SessionService(dataSource, identityClock); }

    @Bean
    AuthenticationProvider nativeIdentityProvider(SessionService sessions) {
        return new AuthenticationProvider() {
            @Override
            public Authentication authenticate(Authentication request) {
                var identity = sessions.signIn(request.getName(), request.getCredentials() instanceof String value ? value : null);
                return UsernamePasswordAuthenticationToken.authenticated(identity, null, List.of());
            }

            @Override
            public boolean supports(Class<?> type) { return UsernamePasswordAuthenticationToken.class.isAssignableFrom(type); }
        };
    }

    @Bean
    SecurityFilterChain identityBoundary(HttpSecurity http, AuthenticationProvider nativeIdentityProvider,
            SessionService sessions) throws Exception {
        http.authorizeHttpRequests(access -> access
                .requestMatchers(HttpMethod.GET, "/health", "/health/database", "/api/v1/identity/csrf").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/v1/identity/login").permitAll()
                .anyRequest().authenticated())
                .authenticationProvider(nativeIdentityProvider)
                .exceptionHandling(errors -> errors
                        .authenticationEntryPoint((request, response, exception) -> response.setStatus(401))
                        .accessDeniedHandler((request, response, exception) -> response.setStatus(403)))
                .requestCache(cache -> cache.disable())
                .httpBasic(basic -> basic.disable())
                .formLogin(login -> login.loginPage("/api/v1/identity/login")
                        .loginProcessingUrl("/api/v1/identity/login")
                        .successHandler((request, response, authentication) -> {
                            var identity = (SessionService.Identity) authentication.getPrincipal();
                            response.setContentType("application/json");
                            response.getWriter().write("{\"actorId\":\"" + identity.actorId() + "\"}");
                        })
                        .failureHandler((request, response, exception) -> response.setStatus(401)))
                .logout(logout -> logout.logoutUrl("/api/v1/identity/logout")
                        .addLogoutHandler((request, response, authentication) -> sessions.signOut(
                                authentication != null && authentication.getPrincipal() instanceof SessionService.Identity identity
                                        ? identity : null))
                        .deleteCookies("IDEA_SESSION")
                        .logoutSuccessHandler((request, response, authentication) -> response.setStatus(204)));
        return http.build();
    }
}
