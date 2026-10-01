package com.idea.ddm.identity;

import java.nio.charset.StandardCharsets;
import java.util.Map;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.DelegatingPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

/** Only the qualified BCrypt format is enabled; no plaintext or legacy fallback. */
final class NativePasswordVerifier {
    private final PasswordEncoder encoder = new DelegatingPasswordEncoder("bcrypt",
            Map.of("bcrypt", new BCryptPasswordEncoder()));

    String encode(String candidate) {
        if (!valid(candidate)) throw new IllegalArgumentException("Unsupported native credential input");
        return encoder.encode(candidate);
    }

    String encodeNewCredential(String candidate) {
        if (!valid(candidate) || candidate.codePointCount(0, candidate.length()) < 15
                || candidate.codePoints().anyMatch(point -> point >= 0xD800 && point <= 0xDFFF)) {
            throw new IllegalArgumentException("Unsupported new credential input");
        }
        return encoder.encode(candidate); // Never trim, normalize or truncate a submitted password.
    }

    boolean matches(String candidate, String encoded) {
        if (!valid(candidate) || encoded == null || !encoded.startsWith("{bcrypt}")) return false;
        try {
            return encoder.matches(candidate, encoded);
        } catch (IllegalArgumentException exception) {
            return false;
        }
    }

    private static boolean valid(String candidate) {
        return candidate != null && !candidate.isBlank()
                && candidate.getBytes(StandardCharsets.UTF_8).length <= 72;
    }
}
