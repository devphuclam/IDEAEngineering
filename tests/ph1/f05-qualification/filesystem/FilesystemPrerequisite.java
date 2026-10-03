import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.channels.FileChannel;
import java.nio.file.FileAlreadyExistsException;
import java.nio.file.Files;
import java.nio.file.LinkOption;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.nio.file.StandardOpenOption;
import java.nio.file.attribute.PosixFilePermissions;
import java.security.MessageDigest;
import java.util.HexFormat;
import java.util.Set;

/** Synthetic qualification only: no Gateway Adapter/product contract is implemented here. */
public class FilesystemPrerequisite {
    private static final Path RUN = Path.of(
            "/home/phuclam/idea-f05a-20261003-37/filesystem-qualification-01");
    private static final String ZERO_KIB_SHA =
            "5f70bf18a086007016e948b04aed3b82103a36bea41755b6cddfaf10ace3c6ef";
    private static String stage = "RUNTIME";
    private static int checks;

    public static void main(String[] args) {
        try {
            require(args.length == 0, "ARGUMENTS");
            require(System.getProperty("java.runtime.version").equals("25.0.4.1+1-LTS"), "RUNTIME");
            require(System.getProperty("java.vendor").equals("Eclipse Adoptium"), "VENDOR");
            require(RUN.toRealPath().equals(RUN), "CANONICAL_ROOT");
            require(Files.getOwner(RUN).getName().equals("phuclam"), "OWNER");
            require(Files.getPosixFilePermissions(RUN).equals(
                    PosixFilePermissions.fromString("rwx------")), "PRIVATE_ROOT");

            stage = "PRIVATE_STAGING";
            Path fixture = directory(RUN.resolve("fixture")); // CREATE only; second run refuses.
            Path adapter = directory(fixture.resolve("adapter"));
            Path staging = directory(adapter.resolve("staging"));
            Path objects = directory(adapter.resolve("objects"));
            Path outside = directory(fixture.resolve("outside-adapter"));
            Path sentinel = outside.resolve("sentinel.bin");
            writeNew(sentinel, new byte[1024]);
            Path candidate = staging.resolve("verified.part");
            writeNew(candidate, new byte[1024]);
            require(Files.getPosixFilePermissions(candidate).equals(
                    PosixFilePermissions.fromString("rw-------")), "PRIVATE_CANDIDATE");
            require(Files.size(candidate) == 1024 && digest(candidate).equals(ZERO_KIB_SHA), "FIXTURE_ORACLE");
            pass("PRIVATE_STAGING_SIZE_DIGEST");

            stage = "LEXICAL_CONTAINMENT";
            require(checkedPath(adapter, "staging/verified.part").equals(candidate), "IN_ROOT_CONTROL");
            expectRefusal(() -> checkedPath(adapter, "../outside-adapter/sentinel.bin"));
            expectRefusal(() -> checkedPath(adapter, "/tmp/not-a-target"));
            expectRefusal(() -> checkedPath(adapter, "staging/../../outside-adapter/sentinel.bin"));
            require(digest(sentinel).equals(ZERO_KIB_SHA), "SENTINEL_UNCHANGED");
            pass("TRAVERSAL_ABSOLUTE_REFUSED");

            stage = "SYMLINK_CONTAINMENT";
            Path link = adapter.resolve("linked-outside");
            Files.createSymbolicLink(link, outside);
            expectRefusal(() -> checkedPath(adapter, "linked-outside/sentinel.bin"));
            Path leafLink = staging.resolve("linked-sentinel.bin");
            Files.createSymbolicLink(leafLink, sentinel);
            expectRefusal(() -> checkedPath(adapter, "staging/linked-sentinel.bin"));
            boolean nioRefused = false;
            try (var ignored = Files.newByteChannel(leafLink,
                    Set.of(StandardOpenOption.READ, LinkOption.NOFOLLOW_LINKS))) {
                throw new AssertionError("NIO_FOLLOWED_LEAF_LINK");
            } catch (IOException expected) {
                nioRefused = true;
            }
            require(nioRefused && digest(sentinel).equals(ZERO_KIB_SHA), "NIO_NOFOLLOW");
            pass("SYMLINK_REFUSED_SENTINEL_UNCHANGED");

            stage = "PRE_PROMOTION_REFUSAL";
            Path wrongSize = staging.resolve("wrong-size.part");
            writeNew(wrongSize, new byte[1023]);
            expectRefusal(() -> promote(staging, objects, "wrong-size", 1024, ZERO_KIB_SHA));
            require(!Files.exists(objects.resolve("wrong-size.bin"), LinkOption.NOFOLLOW_LINKS), "NO_SIZE_SUCCESS");
            Path wrongDigest = staging.resolve("wrong-digest.part");
            byte[] changed = new byte[1024];
            changed[0] = 1;
            writeNew(wrongDigest, changed);
            expectRefusal(() -> promote(staging, objects, "wrong-digest", 1024, ZERO_KIB_SHA));
            require(!Files.exists(objects.resolve("wrong-digest.bin"), LinkOption.NOFOLLOW_LINKS), "NO_DIGEST_SUCCESS");
            pass("SIZE_DIGEST_REFUSAL_NO_COMPLETED_OBJECT");

            stage = "INTERRUPTED_STAGING";
            try {
                writeNew(staging.resolve("interrupted.part"), new byte[256]);
                throw new InjectedFailure(); // Deliberate pre-promotion failure, not a crash test.
            } catch (InjectedFailure expected) {
                require(Files.size(staging.resolve("interrupted.part")) == 256, "PARTIAL_RETAINED");
                require(!Files.exists(objects.resolve("interrupted.bin"), LinkOption.NOFOLLOW_LINKS), "NO_INTERRUPTED_SUCCESS");
            }
            pass("PRE_PROMOTION_FAILURE_NO_COMPLETED_OBJECT");

            stage = "ATOMIC_PROMOTION";
            promote(staging, objects, "verified", 1024, ZERO_KIB_SHA);
            Path complete = objects.resolve("verified.bin");
            require(!Files.exists(candidate, LinkOption.NOFOLLOW_LINKS), "STAGING_MOVED");
            require(Files.size(complete) == 1024 && digest(complete).equals(ZERO_KIB_SHA), "COMPLETE_BYTES");
            require(Files.getPosixFilePermissions(complete).equals(
                    PosixFilePermissions.fromString("r--------")), "READ_ONLY_MODE");
            pass("FORCE_CLOSE_ATOMIC_MOVE_VERIFIED_BYTES");

            stage = "SEQUENTIAL_RETRY";
            writeNew(staging.resolve("verified.part"), new byte[1024]);
            boolean refused = false;
            try {
                promote(staging, objects, "verified", 1024, ZERO_KIB_SHA);
            } catch (FileAlreadyExistsException expected) {
                refused = true;
            }
            require(refused && digest(complete).equals(ZERO_KIB_SHA), "ORIGINAL_UNCHANGED");
            require(Files.exists(staging.resolve("verified.part"), LinkOption.NOFOLLOW_LINKS), "RETRY_RETAINED");
            pass("SEQUENTIAL_EXISTING_OBJECT_REFUSED");

            stage = "FINAL_ORACLE";
            try (var entries = Files.list(objects)) {
                require(entries.toList().equals(java.util.List.of(complete)), "EXACT_COMPLETED_SET");
            }
            require(digest(sentinel).equals(ZERO_KIB_SHA), "FINAL_SENTINEL");
            pass("EXACT_ONE_COMPLETED_OBJECT");
            System.out.println("T027_FILESYSTEM_PROVIDER=" + RUN.getFileSystem().provider().getClass().getName());
            System.out.println("T027_FILESYSTEM_STORE=" + Files.getFileStore(RUN).type());
            System.out.println("T027_FILESYSTEM=PASS;checks=" + checks + ";fixtureBytes=1024;cleanup=RETAINED");
        } catch (Exception | AssertionError failure) {
            System.err.println("T027_FILESYSTEM=FAIL;stage=" + stage
                    + ";category=" + failure.getClass().getSimpleName() + ";completedChecks=" + checks);
            System.exit(1);
        }
    }

    private static Path directory(Path path) throws IOException {
        return Files.createDirectory(path, PosixFilePermissions.asFileAttribute(
                PosixFilePermissions.fromString("rwx------")));
    }

    private static void writeNew(Path path, byte[] bytes) throws IOException {
        try (FileChannel channel = FileChannel.open(path,
                Set.of(StandardOpenOption.CREATE_NEW, StandardOpenOption.WRITE, LinkOption.NOFOLLOW_LINKS),
                PosixFilePermissions.asFileAttribute(PosixFilePermissions.fromString("rw-------")))) {
            ByteBuffer buffer = ByteBuffer.wrap(bytes);
            while (buffer.hasRemaining()) channel.write(buffer);
            channel.force(true);
        }
    }

    // Test-only bounded resolver, not a reusable product Adapter or hostile-race defense.
    private static Path checkedPath(Path root, String relative) throws IOException {
        Path input = Path.of(relative);
        if (input.isAbsolute()) throw new Refusal();
        Path result = root.resolve(input).normalize();
        if (!result.startsWith(root) || result.equals(root)) throw new Refusal();
        Path current = root;
        for (Path part : root.relativize(result)) {
            current = current.resolve(part);
            if (Files.isSymbolicLink(current)) throw new Refusal();
        }
        return result;
    }

    // Qualification single-writer profile ONLY. ATOMIC_MOVE is not portable no-replace.
    private static void promote(Path staging, Path objects, String name, long size, String sha) throws Exception {
        Path source = checkedPath(staging, name + ".part");
        Path target = checkedPath(objects, name + ".bin");
        if (Files.exists(target, LinkOption.NOFOLLOW_LINKS)) throw new FileAlreadyExistsException("OWNED_OBJECT");
        if (!Files.isRegularFile(source, LinkOption.NOFOLLOW_LINKS)
                || Files.size(source) != size || !digest(source).equals(sha)) throw new Refusal();
        Files.setPosixFilePermissions(source, PosixFilePermissions.fromString("r--------"));
        Files.move(source, target, StandardCopyOption.ATOMIC_MOVE);
    }

    private static String digest(Path path) throws Exception {
        MessageDigest sha = MessageDigest.getInstance("SHA-256");
        try (var channel = Files.newByteChannel(path,
                Set.of(StandardOpenOption.READ, LinkOption.NOFOLLOW_LINKS))) {
            ByteBuffer buffer = ByteBuffer.allocate(4096);
            while (channel.read(buffer) != -1) {
                buffer.flip();
                sha.update(buffer);
                buffer.clear();
            }
        }
        return HexFormat.of().formatHex(sha.digest());
    }

    private static void require(boolean condition, String reason) {
        if (!condition) throw new AssertionError(reason);
    }
    private static void pass(String name) {
        checks++;
        System.out.println("T027_FILESYSTEM_CHECK=" + name + ";result=PASS");
    }
    private static void expectRefusal(Action action) throws Exception {
        try {
            action.run();
        } catch (Refusal expected) {
            return;
        }
        throw new AssertionError("EXPECTED_BOUNDED_REFUSAL");
    }
    private interface Action { void run() throws Exception; }
    private static class Refusal extends IOException { }
    private static class InjectedFailure extends IOException { }
}
