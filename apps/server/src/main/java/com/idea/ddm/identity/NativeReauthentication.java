package com.idea.ddm.identity;

import java.sql.Connection;
import java.sql.SQLException;
import java.time.Instant;
import java.util.UUID;

/** Internal console port. Caller owns the existing security lock and transaction, never a session. */
public final class NativeReauthentication {
    public record Verified(UUID actorId, UUID accountId, UUID organizationId, UUID loginIdentityId,
            long securityVersion) {}
    private final NativePasswordVerifier passwords = new NativePasswordVerifier();
    private final String refusedVerifier = passwords.encode(UUID.randomUUID().toString());

    /** Null is generic refusal. Known-login failure writes must be committed by the caller. */
    public Verified verify(Connection connection, UUID loginIdentityId, char[] password, Instant now) throws SQLException {
        requireBoundary(connection);
        try (var query = connection.prepareStatement("SELECT a.actor_id,a.account_id,a.organization_id,a.security_version,"
                + "l.password_verifier,a.status='ACTIVE' AND p.disabled_at IS NULL FROM login_identity l "
                + "JOIN idea_account a USING(account_id) JOIN actor p ON p.actor_id=a.actor_id WHERE l.login_identity_id=?")) {
            query.setObject(1, loginIdentityId);
            try (var row = query.executeQuery()) {
                boolean known = row.next();
                boolean eligible = known && row.getBoolean(6);
                String verifier = known ? row.getString(5) : null;
                boolean matches = passwords.matches(password == null ? null : new String(password),
                        eligible && verifier != null ? verifier : refusedVerifier);
                if (!known || LoginFailures.blocked(connection, loginIdentityId, now)) return null;
                if (!eligible || verifier == null || !matches) {
                    LoginFailures.failed(connection, loginIdentityId, now);
                    return null;
                }
                return new Verified(row.getObject(1, UUID.class), row.getObject(2, UUID.class),
                        row.getObject(3, UUID.class), loginIdentityId, row.getLong(4));
            }
        }
    }

    public void clear(Connection connection, Verified identity) throws SQLException {
        requireBoundary(connection);
        LoginFailures.clear(connection, identity.loginIdentityId());
    }

    private static void requireBoundary(Connection connection) throws SQLException {
        if (connection.getAutoCommit()) throw new IllegalStateException("Reauthentication requires a security transaction");
        try (var query = connection.createStatement(); var row = query.executeQuery("SELECT EXISTS (SELECT 1 FROM pg_locks "
                + "WHERE pid=pg_backend_pid() AND locktype='advisory' AND granted AND mode='ExclusiveLock' "
                + "AND classid=0 AND objid=73003002 AND objsubid=1)")) {
            if (!row.next() || !row.getBoolean(1)) throw new IllegalStateException("Security coordination required");
        }
    }
}
