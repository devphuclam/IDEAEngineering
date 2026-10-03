import java.nio.charset.StandardCharsets;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.PublicKey;
import java.security.Signature;
import java.util.Arrays;

/** Internal JDK qualification only; not an IDEA Grant/Receipt implementation. */
public final class Ed25519KeySeparationQualification {
    public static void main(String[] args) {
        if (args.length != 0) {
            System.err.println("F05_Q01=INVALID_ARGUMENTS");
            System.exit(2);
        }
        try {
            if (!"25.0.4.1+1-LTS".equals(System.getProperty("java.runtime.version"))
                    || !"Eclipse Adoptium".equals(System.getProperty("java.vendor"))) {
                throw new IllegalStateException("UNEXPECTED_RUNTIME");
            }
            qualifyIndependentSigningKeys();
            System.out.println("F05_Q01=PASS; checks=1; algorithm=Ed25519");
        } catch (Exception failure) {
            // Do not print arbitrary messages, key material, signatures or a stack trace.
            System.err.println("F05_Q01=FAIL; category=" + failure.getClass().getSimpleName());
            System.exit(1);
        }
    }

    private static void qualifyIndependentSigningKeys() throws Exception {
        KeyPairGenerator generator = KeyPairGenerator.getInstance("Ed25519");
        KeyPair firstPurpose = generator.generateKeyPair();
        KeyPair otherPurpose = generator.generateKeyPair();
        if (Arrays.equals(firstPurpose.getPublic().getEncoded(), otherPurpose.getPublic().getEncoded())) {
            throw new IllegalStateException("KEYS_NOT_DISTINCT");
        }

        byte[] message = "IDEA T027 synthetic provider qualification".getBytes(StandardCharsets.UTF_8);
        Signature signer = Signature.getInstance("Ed25519");
        signer.initSign(firstPurpose.getPrivate());
        signer.update(message);
        byte[] signed = signer.sign();

        if (!verifies(firstPurpose.getPublic(), message, signed)
                || verifies(otherPurpose.getPublic(), message, signed)) {
            throw new IllegalStateException("KEY_SEPARATION_FAILED");
        }
        System.out.println("F05_Q01_PROVIDER=" + signer.getProvider().getName());
        System.out.println("F05_Q01_RUNTIME=" + System.getProperty("java.runtime.version"));
    }

    private static boolean verifies(PublicKey key, byte[] message, byte[] signature) throws Exception {
        Signature verifier = Signature.getInstance("Ed25519");
        verifier.initVerify(key);
        verifier.update(message);
        return verifier.verify(signature);
    }
}
