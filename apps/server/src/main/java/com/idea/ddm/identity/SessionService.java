package com.idea.ddm.identity;

import java.io.Serializable;
import java.sql.SQLException;
import java.time.Clock;
import java.time.Duration;
import java.time.temporal.ChronoUnit;
import java.util.Locale;
import java.util.UUID;
import javax.sql.DataSource;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.InternalAuthenticationServiceException;

/** PostgreSQL eligibility metadata supplements, never restores, ordinary container sessions. */
public final class SessionService {
    record Identity(UUID actorId, UUID accountId, long securityVersion, UUID sessionId) implements Serializable {}
    record View(UUID actorId, UUID accountId) {}
    private final DataSource dataSource;
    private final Clock clock;
    private final UUID runtimeInstance = UUID.randomUUID();
    private final NativePasswordVerifier passwords = new NativePasswordVerifier();

    SessionService(DataSource dataSource, Clock clock) {
        this.dataSource = dataSource;
        this.clock = clock;
    }

    Identity signIn(String login, String password) {
        if (login == null || login.length() > 254) throw refused();
        try (var connection = dataSource.getConnection()) {
            connection.setAutoCommit(false);
            try {
                AdministratorBootstrap.execute(connection, "SELECT pg_advisory_xact_lock(73003002)");
                try (var query = connection.prepareStatement("SELECT a.actor_id,a.account_id,a.security_version,"
                        + "l.password_verifier FROM login_identity l JOIN idea_account a USING(account_id) "
                        + "JOIN actor p ON p.actor_id=a.actor_id WHERE l.normalized_login_identifier=? "
                        + "AND a.status='ACTIVE' AND p.disabled_at IS NULL")) {
                    query.setString(1, login.strip().toLowerCase(Locale.ROOT));
                    try (var row = query.executeQuery()) {
                        if (!row.next() || !passwords.matches(password, row.getString(4))) throw refused();
                        var identity = new Identity(row.getObject(1, UUID.class), row.getObject(2, UUID.class),
                                row.getLong(3), UUID.randomUUID());
                        var now = clock.instant().truncatedTo(ChronoUnit.MICROS);
                        AdministratorBootstrap.insert(connection, "INSERT INTO session_record(session_id,actor_id,"
                                + "account_id,security_version,issued_at,last_eligible_activity_at,expires_at,runtime_instance_id) "
                                + "VALUES (?,?,?,?,?,?,?,?)", identity.sessionId(), identity.actorId(), identity.accountId(),
                                identity.securityVersion(), java.sql.Timestamp.from(now), java.sql.Timestamp.from(now),
                                java.sql.Timestamp.from(now.plus(Duration.ofHours(8))), runtimeInstance);
                        AdministratorBootstrap.record(connection, UUID.randomUUID(), identity.actorId(),
                                "identity.sign-in", identity.accountId().toString(), "ACCEPTED", null);
                        connection.commit();
                        return identity;
                    }
                }
            } catch (SQLException | RuntimeException exception) {
                connection.rollback();
                throw exception;
            }
        } catch (SQLException exception) {
            throw new InternalAuthenticationServiceException("Identity verification unavailable", exception);
        }
    }

    View current(Identity identity) {
        if (identity == null) throw refused();
        try (var connection = dataSource.getConnection()) {
            connection.setAutoCommit(false);
            try {
                AdministratorBootstrap.execute(connection, "SELECT pg_advisory_xact_lock(73003002)");
                var now = java.sql.Timestamp.from(clock.instant().truncatedTo(ChronoUnit.MICROS));
                try (var query = connection.prepareStatement(
                        "SELECT a.actor_id,a.account_id FROM session_record s JOIN idea_account a USING(account_id) "
                                + "JOIN actor p ON p.actor_id=a.actor_id WHERE s.session_id=? AND s.actor_id=? "
                                + "AND a.actor_id=s.actor_id AND s.security_version=? AND a.security_version=s.security_version "
                                + "AND s.runtime_instance_id=? AND s.revoked_at IS NULL AND a.status='ACTIVE' AND p.disabled_at IS NULL "
                                + "AND s.issued_at<=? AND s.expires_at>? AND s.last_eligible_activity_at+INTERVAL '2 hours'>?")) {
                    query.setObject(1, identity.sessionId());
                    query.setObject(2, identity.actorId());
                    query.setLong(3, identity.securityVersion());
                    query.setObject(4, runtimeInstance);
                    query.setTimestamp(5, now);
                    query.setTimestamp(6, now);
                    query.setTimestamp(7, now);
                    try (var row = query.executeQuery()) {
                        if (!row.next()) throw refused();
                        var view = new View(row.getObject(1, UUID.class), row.getObject(2, UUID.class));
                        AdministratorBootstrap.insert(connection, "UPDATE session_record SET last_eligible_activity_at=? WHERE session_id=?",
                                now, identity.sessionId());
                        connection.commit();
                        return view;
                    }
                }
            } catch (SQLException | RuntimeException exception) {
                connection.rollback();
                throw exception;
            }
        } catch (SQLException exception) {
            throw new InternalAuthenticationServiceException("Identity verification unavailable", exception);
        }
    }

    void signOut(Identity identity) {
        if (identity == null) throw refused();
        try (var connection = dataSource.getConnection()) {
            connection.setAutoCommit(false);
            try {
                AdministratorBootstrap.execute(connection, "SELECT pg_advisory_xact_lock(73003002)");
                AdministratorBootstrap.insert(connection, "UPDATE session_record SET revoked_at=? "
                        + "WHERE session_id=? AND actor_id=? AND account_id=? AND runtime_instance_id=? AND revoked_at IS NULL",
                        java.sql.Timestamp.from(clock.instant().truncatedTo(ChronoUnit.MICROS)), identity.sessionId(),
                        identity.actorId(), identity.accountId(), runtimeInstance);
                AdministratorBootstrap.record(connection, UUID.randomUUID(), identity.actorId(),
                        "identity.sign-out", identity.accountId().toString(), "ACCEPTED", null);
                connection.commit();
            } catch (SQLException | RuntimeException exception) {
                connection.rollback();
                throw exception;
            }
        } catch (SQLException exception) {
            throw new InternalAuthenticationServiceException("Identity verification unavailable", exception);
        }
    }

    private static BadCredentialsException refused() { return new BadCredentialsException("Identity proof refused"); }
}
