package com.idea.ddm.iam;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import java.util.UUID;
import java.time.Clock;
import javax.sql.DataSource;
import com.idea.ddm.access.AuthorizationDecisionService;
import com.idea.ddm.identity.IdentityTransactions;
import com.idea.ddm.identity.OwnerSessionEligibility;
import com.idea.ddm.identity.SessionService;
import com.idea.ddm.project.ProjectGovernanceQueries;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/** New reviewed IAM adapters opt in; the accepted Identity wire contract is not retrofitted. */
@Configuration(proxyBeanMethods = false)
public class IamWebConfiguration {
    @Bean
    OwnerSessionEligibility ownerEligibility(SessionService sessions) { return new OwnerSessionEligibility(sessions); }
    @Bean
    IdentityTransactions ownerTransactions(DataSource dataSource, OwnerSessionEligibility eligibility) {
        return new IdentityTransactions(dataSource, eligibility);
    }
    @Bean
    ProjectGovernanceQueries projectAuthorizationFacts() { return new ProjectGovernanceQueries(); }
    @Bean
    AuthorizationDecisionService authorizationDecisions(OwnerSessionEligibility eligibility,
            ProjectGovernanceQueries projects, Clock clock) {
        return new AuthorizationDecisionService(eligibility, projects, clock);
    }

    @Target(ElementType.TYPE)
    @Retention(RetentionPolicy.RUNTIME)
    public @interface Boundary {}

    public enum RefusalReason {
        INVALID_INPUT, INELIGIBLE_SESSION, AUTHORITY_REFUSED,
        TARGET_NOT_AVAILABLE, STATE_CONFLICT, UNAVAILABLE
    }

    public static final class Refusal extends RuntimeException {
        private final RefusalReason reason;
        public Refusal(RefusalReason reason) {
            super("IAM boundary refusal");
            this.reason = java.util.Objects.requireNonNull(reason);
        }
        public RefusalReason reason() { return reason; }
    }
    public record SafeRefusal(String reasonCode, UUID correlationId) {}

    @RestControllerAdvice(annotations = Boundary.class)
    static class Responses {
        @ExceptionHandler(Refusal.class)
        ResponseEntity<SafeRefusal> refused(Refusal refusal) {
            var status = switch (refusal.reason()) {
                case INVALID_INPUT -> 400;
                case INELIGIBLE_SESSION -> 401;
                case AUTHORITY_REFUSED -> 403;
                case TARGET_NOT_AVAILABLE -> 404;
                case STATE_CONFLICT -> 409;
                case UNAVAILABLE -> 503;
            };
            // Correlation is Server-owned, never a caller's header or exception diagnostic.
            return ResponseEntity.status(status).body(new SafeRefusal(refusal.reason().name(), UUID.randomUUID()));
        }

        @ExceptionHandler(Exception.class)
        ResponseEntity<SafeRefusal> unavailable(Exception ignored) {
            // Never serialize/log exception text, SQL, request fields, credentials or causes.
            return refused(new Refusal(RefusalReason.UNAVAILABLE));
        }

        @ExceptionHandler({org.springframework.http.converter.HttpMessageNotReadableException.class,
                org.springframework.web.method.annotation.MethodArgumentTypeMismatchException.class,
                org.springframework.web.bind.MissingServletRequestParameterException.class})
        ResponseEntity<SafeRefusal> invalidShape(Exception ignored) {
            return refused(new Refusal(RefusalReason.INVALID_INPUT));
        }
    }
}
