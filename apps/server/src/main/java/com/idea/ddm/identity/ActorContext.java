package com.idea.ddm.identity;

import java.util.Objects;
import java.util.UUID;

/** Server-established context only. No public constructor or client ActorId adapter. */
public final class ActorContext {
    private final UUID actorId;
    private final long securityVersion;

    // F03-A fixtures use this package seam; F03-B must establish it from verified session proof.
    ActorContext(UUID actorId, long securityVersion) {
        this.actorId = Objects.requireNonNull(actorId);
        if (securityVersion < 1) throw new IllegalArgumentException("Invalid security version");
        this.securityVersion = securityVersion;
    }

    public UUID actorId() { return actorId; }
    public long securityVersion() { return securityVersion; }
}
