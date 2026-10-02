package com.idea.ddm.operation;

import static org.junit.jupiter.api.Assertions.*;

import com.idea.ddm.identity.F04SessionFixture;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;

/** Approved T023-B seam: actual HTTP authentication -> internal owner -> retained SQL witnesses. */
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class OwnerOutcomeTest {
    private F04SessionFixture fixture;

    @BeforeAll void prepareOnlyTheRunsOwnedSchemaAndServer() throws Exception {
        F04SchemaTest.createOnlyThisRunsMigratorOwnedSchema("latest");
        fixture = new F04SessionFixture();
    }

    @AfterAll void stopOwnedServerBeforeOuterRunnerCleanup() {
        if (fixture != null) fixture.close();
    }

    @Test void realSignInCapturesServerPrincipalRatherThanClientActorId() throws Exception {
        var signedIn = fixture.signInThroughRealHttp();
        assertEquals(signedIn.expectedActorId(), signedIn.context().actorId());
        assertEquals(1, signedIn.context().securityVersion());
    }
}
