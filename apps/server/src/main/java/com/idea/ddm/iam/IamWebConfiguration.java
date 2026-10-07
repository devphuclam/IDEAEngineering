package com.idea.ddm.iam;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import org.springframework.context.annotation.Configuration;

/** New reviewed IAM adapters opt in; the accepted Identity wire contract is not retrofitted. */
@Configuration(proxyBeanMethods = false)
public class IamWebConfiguration {
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
    // T020 tracer: no mapping exists yet. The actual HTTP test must demonstrate the gap.
}
