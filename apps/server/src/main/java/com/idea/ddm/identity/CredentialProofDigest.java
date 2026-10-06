package com.idea.ddm.identity;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;

/** Shared storage digest for one-use credential setup and reset proofs. */
final class CredentialProofDigest {
    private CredentialProofDigest() {}

    static String sha256AsciiToHex(String proof) {
        try {
            return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256")
                    .digest(proof.getBytes(StandardCharsets.US_ASCII)));
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("Required digest unavailable");
        }
    }
}
