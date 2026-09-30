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
