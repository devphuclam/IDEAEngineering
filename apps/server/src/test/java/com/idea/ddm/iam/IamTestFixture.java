package com.idea.ddm.iam;

import com.idea.ddm.identity.ActorContext;
import com.idea.ddm.identity.IamSessionFixture;
import com.idea.ddm.identity.IdentityTransactions;
import com.idea.ddm.identity.OwnerSessionEligibility;

/** Story fixtures reuse actual HTTP authentication, never raw UUID-array ActorContext construction. */
public final class IamTestFixture implements AutoCloseable {
    public record SignedInActor(IamIntegrationFixtures.Identity identity, ActorContext context) {}
    private final IamIntegrationFixtures identities;
    private final IamSessionFixture http;

    /** Schema setup/cleanup stays with the approved per-class fixture and external runner. */
    public IamTestFixture(IamIntegrationFixtures identities) {
        this.identities = java.util.Objects.requireNonNull(identities);
        http = new IamSessionFixture(identities);
    }

    public SignedInActor signIn(IamIntegrationFixtures.Persona persona) throws Exception {
        var identity = identities.identity(persona);
        return new SignedInActor(identity, http.signIn(identity));
    }
    public OwnerSessionEligibility eligibility() { return new OwnerSessionEligibility(http.sessions()); }
    public IdentityTransactions ownerTransactions() { return new IdentityTransactions(identities.appDataSource(), eligibility()); }
    public IamSessionFixture http() { return http; }
    @Override public void close() { http.close(); }
}
