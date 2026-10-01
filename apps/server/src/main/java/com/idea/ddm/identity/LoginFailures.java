package com.idea.ddm.identity;

import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.Duration;
import java.time.Instant;
import java.util.UUID;

/** Bounded per-existing-login state; caller owns the security-write lock and transaction. */
final class LoginFailures {
    private static final Duration WINDOW = Duration.ofMinutes(15);

    static boolean blocked(Connection connection, UUID loginIdentityId, Instant now) throws SQLException {
        try (var query = connection.prepareStatement(
                "SELECT blocked_until > ? FROM login_failure_state WHERE login_identity_id=?")) {
            query.setTimestamp(1, Timestamp.from(now));
            query.setObject(2, loginIdentityId);
            try (var row = query.executeQuery()) { return row.next() && row.getBoolean(1); }
        }
    }

    static void failed(Connection connection, UUID loginIdentityId, Instant now) throws SQLException {
        // Strict cutoff: a failure exactly 15 minutes old is no longer in the window.
        try (var query = connection.prepareStatement("INSERT INTO login_failure_state VALUES (?,ARRAY[?]::timestamptz[],NULL) "
                + "ON CONFLICT (login_identity_id) DO UPDATE SET failed_at="
                + "ARRAY(SELECT t FROM unnest(login_failure_state.failed_at) t WHERE t>?) || ARRAY[?]::timestamptz[],"
                + "blocked_until=NULL")) {
            query.setObject(1, loginIdentityId);
            query.setTimestamp(2, Timestamp.from(now));
            query.setTimestamp(3, Timestamp.from(now.minus(WINDOW)));
            query.setTimestamp(4, Timestamp.from(now));
            if (query.executeUpdate() != 1) throw new SQLException("Login failure state not recorded");
        }
        try (var query = connection.prepareStatement("UPDATE login_failure_state SET blocked_until=? "
                + "WHERE login_identity_id=? AND cardinality(failed_at)=5")) {
            query.setTimestamp(1, Timestamp.from(now.plus(WINDOW)));
            query.setObject(2, loginIdentityId);
            query.executeUpdate();
        }
    }

    static void clear(Connection connection, UUID loginIdentityId) throws SQLException {
        try (var query = connection.prepareStatement("WITH observed AS MATERIALIZED "
                + "(SELECT login_identity_id FROM login_failure_state WHERE login_identity_id=?),"
                + "removed AS (DELETE FROM login_failure_state WHERE login_identity_id=? RETURNING login_identity_id) "
                + "SELECT (SELECT count(*) FROM observed),(SELECT count(*) FROM removed)")) {
            query.setObject(1, loginIdentityId);
            query.setObject(2, loginIdentityId);
            try (var row = query.executeQuery()) {
                if (!row.next() || row.getLong(1) != row.getLong(2)) throw new SQLException("Login failure state not cleared");
            }
        }
    }
}
