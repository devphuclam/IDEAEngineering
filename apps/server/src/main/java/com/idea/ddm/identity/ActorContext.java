package com.idea.ddm.identity;

import java.util.Objects;
import java.util.UUID;

/** Server-established context only. No public constructor or client ActorId adapter. */
public final class ActorContext {
    private final UUID actorId;
    private final long securityVersion;
    private final UUID sessionId;

    // F03-A fixtures use this package seam; F03-B must establish it from verified session proof.
    ActorContext(UUID actorId, long securityVersion) {
        this(actorId, securityVersion, null);
    }

    ActorContext(UUID actorId, long securityVersion, UUID sessionId) {
        this.actorId = Objects.requireNonNull(actorId);
        if (securityVersion < 1) throw new IllegalArgumentException("Invalid security version");
        this.securityVersion = securityVersion;
        this.sessionId = sessionId;
    }

    public UUID actorId() { return actorId; }
    public long securityVersion() { return securityVersion; }
    // Internal eligibility reference, not a bearer proof or a public response field.
    UUID sessionId() { return sessionId; }
}
