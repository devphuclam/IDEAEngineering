package com.idea.ddm.identity;

import static org.junit.jupiter.api.Assertions.*;

import com.idea.ddm.iam.IamIntegrationFixtures;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.UUID;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;

/** Real authenticated owner/UoW seam, PostgreSQL state and required atomic evidence oracle. */
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class IdentityTransactionsTest {
    private final IamIntegrationFixtures fixtures = new IamIntegrationFixtures();
    private IamSessionFixture http;

    @BeforeAll void startOwnedServer() throws Exception { fixtures.createSchema(); http = new IamSessionFixture(fixtures); }
    @AfterAll void stopOwnedServer() { if (http != null) http.close(); }

    @Test void acceptedOwnerStateAndRequiredOutcomeAuthorizationAndAuditCommitTogether() throws Exception {
        var identity = fixtures.identity(IamIntegrationFixtures.Persona.AA_V1);
        var context = http.signIn(identity);
        assignFixtureAuthority(identity);
        var operation = UUID.randomUUID();
        var transactions = new IdentityTransactions(fixtures.appDataSource(), new OwnerSessionEligibility(http.sessions()));
        var result = transactions.executeOwner(context, command(identity, context, operation));
        assertEquals("Synthetic owner committed", result);
        assertEquals(new State("Synthetic owner committed", 1, 2, 1), state(identity, operation));
    }

    private IdentityTransactions.OwnerCommand<String> command(IamIntegrationFixtures.Identity identity, ActorContext context, UUID operation) {
        return new IdentityTransactions.OwnerCommand<>() {
            @Override public void revalidate(Connection connection, OwnerSessionEligibility.EligibleActor actor) throws SQLException {
                if (!identity.actorId().equals(actor.actorId()) || !identity.organizationId().equals(actor.organizationId())) {
                    throw new IdentityRefusal("INELIGIBLE_SESSION");
                }
                var decision = IdentityAccessPolicy.evaluate(connection, context, identity.organizationId(), "account.create");
                if (!decision.granted()) throw new IdentityRefusal(decision.refusal());
            }
            @Override public String apply(Connection connection, OwnerSessionEligibility.EligibleActor actor) throws SQLException {
                AdministratorBootstrap.insert(connection, "UPDATE actor SET display_name=? WHERE actor_id=?", "Synthetic owner committed", identity.actorId());
                var decision = IdentityAccessPolicy.evaluate(connection, context, identity.organizationId(), "account.create");
                IdentityAccessPolicy.retain(connection, operation, "REQUEST", decision);
                IdentityAccessPolicy.retain(connection, operation, "COMMIT", decision);
                AdministratorBootstrap.record(connection, operation, actor.actorId(), "iam.synthetic.owner-check", identity.accountId().toString(), "ACCEPTED", null);
                return "Synthetic owner committed";
            }
        };
    }

    private void assignFixtureAuthority(IamIntegrationFixtures.Identity identity) throws Exception {
        try (var connection = fixtures.migrator()) {
            AdministratorBootstrap.insert(connection, "INSERT INTO identity_role_assignment(assignment_id,principal_actor_id,role_version_id,organization_id,assigned_by,reason) VALUES (?,?,?,?,?,?)",
                    UUID.randomUUID(), identity.actorId(), UUID.fromString("9d80f77e-85a6-4c12-a72d-8ef6b7e0a002"),
                    identity.organizationId(), identity.actorId(), "Synthetic legacy AA v1 prerequisite; not a grant API");
        }
    }

    private record State(String displayName, long outcomes, long decisions, long audit) {}
    private State state(IamIntegrationFixtures.Identity identity, UUID operation) throws Exception {
        try (var connection = fixtures.app(); var query = connection.prepareStatement(
                "SELECT display_name,(SELECT count(*) FROM iam_owner_outcome WHERE operation_id=?),"
                + "(SELECT count(*) FROM identity_authorization_decision WHERE operation_id=?),"
                + "(SELECT count(*) FROM audit_evidence WHERE operation_id=?) FROM actor WHERE actor_id=?")) {
            query.setObject(1, operation); query.setObject(2, operation); query.setObject(3, operation); query.setObject(4, identity.actorId());
            try (var row = query.executeQuery()) {
                assertTrue(row.next());
                return new State(row.getString(1), row.getLong(2), row.getLong(3), row.getLong(4));
            }
        }
    }
}
