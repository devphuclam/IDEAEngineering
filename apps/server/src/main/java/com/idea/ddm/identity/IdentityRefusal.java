package com.idea.ddm.identity;

/** Bounded refusal; no credential, login value or database diagnostic in the public message. */
public final class IdentityRefusal extends RuntimeException {
    private final String reason;
    IdentityRefusal(String reason) {
        super(reason);
        this.reason = reason;
    }
    public String reason() { return reason; }
}
