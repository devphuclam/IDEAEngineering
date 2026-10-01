package com.idea.ddm.identity;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.HexFormat;
import java.util.UUID;
import javax.sql.DataSource;

/** First credential only. Issuer RBAC and target proof authority are distinct boundaries. */
final class CredentialSetupService {
    record IssuedProof(String proof, Instant expiresAt) {
        @Override public String toString() { return "IssuedProof[proof=REDACTED, expiresAt=" + expiresAt + "]"; }
    }
    private final DataSource dataSource;
    private final Clock clock;
    private final SessionService sessions;
    private final IdentityTransactions transactions;
    private final NativePasswordVerifier passwords = new NativePasswordVerifier();
    private final SecureRandom random = new SecureRandom();

    CredentialSetupService(DataSource dataSource, Clock clock, SessionService sessions) {
        this.dataSource = dataSource;
        this.clock = clock;
        this.sessions = sessions;
        this.transactions = new IdentityTransactions(dataSource, sessions::checkEligibility);
    }

    IssuedProof issue(ActorContext issuer, UUID operation, UUID organization, UUID target,
            String purpose, long expectedVersion, String reason) {
        if (operation == null || organization == null || target == null || expectedVersion < 1
                || !"FIRST_SETUP".equals(purpose) || reason == null || reason.isBlank() || reason.length() > 500
                || reason.codePoints().anyMatch(Character::isISOControl)) throw new IdentityRefusal("INVALID_INPUT");
        return transactions.mutate(issuer, operation, organization, "account.credential.setup.issue",
                "IDEA_ACCOUNT", target.toString(), IdentityTransactions.Owner.IAM, connection -> {
                    // Same security lock as account/assignment writes; no admission-only session check.
                    sessions.requireEligible(connection, issuer);
                    try (var query = connection.prepareStatement("SELECT l.login_identity_id FROM idea_account a "
                            + "JOIN actor p USING(actor_id) JOIN login_identity l USING(account_id) "
                            + "WHERE a.account_id=? AND a.organization_id=? AND a.status='PENDING' "
                            + "AND a.security_version=? AND p.disabled_at IS NULL AND l.password_verifier IS NULL")) {
                        query.setObject(1, target);
                        query.setObject(2, organization);
                        query.setLong(3, expectedVersion);
                        try (var row = query.executeQuery()) {
                            if (!row.next()) throw new IdentityRefusal("INELIGIBLE_TARGET");
                            var loginId = row.getObject(1, UUID.class);
                            var entropy = new byte[32];
                            random.nextBytes(entropy);
                            var proof = Base64.getUrlEncoder().withoutPadding().encodeToString(entropy);
                            var issued = now();
                            var expires = issued.plus(Duration.ofMinutes(15));
                            AdministratorBootstrap.insert(connection, "INSERT INTO credential_setup_proof "
                                    + "(proof_id,account_id,login_identity_id,purpose,security_version,proof_digest,issued_by,"
                                    + "issue_operation_id,reason,issued_at,expires_at) VALUES (?,?,?,'FIRST_SETUP',?,?,?,?,?,?,?)",
                                    UUID.randomUUID(), target, loginId, expectedVersion, digest(proof), issuer.actorId(),
                                    operation, reason, Timestamp.from(issued), Timestamp.from(expires));
                            return new IssuedProof(proof, expires);
                        }
                    }
                });
    }

    void redeem(UUID operation, UUID target, String proof, String password) {
        if (operation == null || target == null || proof == null || !proof.matches("[A-Za-z0-9_-]{43}")) {
            throw new IdentityRefusal("INVALID_CREDENTIAL_PROOF");
        }
        final String encoded;
        try { encoded = passwords.encodeNewCredential(password); }
        catch (IllegalArgumentException exception) { throw new IdentityRefusal("INVALID_CREDENTIAL_PROOF"); }
        try (var connection = dataSource.getConnection()) {
            connection.setAutoCommit(false);
            try {
                AdministratorBootstrap.execute(connection, "SELECT pg_advisory_xact_lock(73003002)");
                var at = Timestamp.from(now());
                try (var query = connection.prepareStatement("SELECT f.proof_id,f.login_identity_id,a.actor_id,"
                        + "a.organization_id,a.security_version FROM credential_setup_proof f "
                        + "JOIN idea_account a USING(account_id) JOIN actor p USING(actor_id) "
                        + "JOIN login_identity l ON l.login_identity_id=f.login_identity_id AND l.account_id=f.account_id "
                        + "WHERE f.proof_digest=? AND f.account_id=? AND f.purpose='FIRST_SETUP' "
                        + "AND f.consumed_at IS NULL AND f.issued_at<=? AND f.expires_at>? "
                        + "AND a.status='PENDING' AND a.security_version=f.security_version "
                        + "AND p.disabled_at IS NULL AND l.password_verifier IS NULL")) {
                    query.setString(1, digest(proof));
                    query.setObject(2, target);
                    query.setTimestamp(3, at);
                    query.setTimestamp(4, at);
                    try (var row = query.executeQuery()) {
                        if (!row.next()) throw new IdentityRefusal("INVALID_CREDENTIAL_PROOF");
                        var proofId = row.getObject(1, UUID.class);
                        var loginId = row.getObject(2, UUID.class);
                        var actor = row.getObject(3, UUID.class);
                        var organization = row.getObject(4, UUID.class);
                        var version = row.getLong(5);
                        AdministratorBootstrap.insert(connection, "UPDATE credential_setup_proof "
                                + "SET consumed_at=?,consumed_operation_id=? WHERE proof_id=? AND consumed_at IS NULL",
                                at, operation, proofId);
                        AdministratorBootstrap.insert(connection, "UPDATE login_identity SET password_verifier=? "
                                + "WHERE login_identity_id=? AND account_id=? AND password_verifier IS NULL", encoded, loginId, target);
                        AdministratorBootstrap.insert(connection, "UPDATE idea_account SET status='ACTIVE',security_version=security_version+1 "
                                + "WHERE account_id=? AND status='PENDING' AND security_version=?", target, version);
                        AdministratorBootstrap.insert(connection, "INSERT INTO iam_account_change_evidence "
                                + "(operation_id,actor_id,account_id,organization_id,changed_by,before_status,after_status,"
                                + "before_security_version,after_security_version,reason) VALUES (?,?,?,?,?,'PENDING','ACTIVE',?,?,?)",
                                operation, actor, target, organization, actor, version, version + 1, "One-use first credential setup");
                        // The proof establishes the target's authority, not an administrative Role Assignment.
                        AdministratorBootstrap.record(connection, operation, actor, "account.credential.setup.redeem",
                                target.toString(), "ACCEPTED", null);
                        connection.commit();
                    }
                }
            } catch (SQLException | RuntimeException exception) { connection.rollback(); throw exception; }
        } catch (SQLException exception) { throw new IllegalStateException("Credential setup unavailable", exception); }
    }

    private Instant now() { return clock.instant().truncatedTo(ChronoUnit.MICROS); }

    private static String digest(String proof) {
        try { return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256")
                .digest(proof.getBytes(StandardCharsets.US_ASCII))); }
        catch (NoSuchAlgorithmException exception) { throw new IllegalStateException("Required digest unavailable"); }
    }
}
