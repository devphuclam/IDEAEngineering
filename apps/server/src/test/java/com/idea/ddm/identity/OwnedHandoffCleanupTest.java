package com.idea.ddm.identity;

import java.nio.file.*;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class OwnedHandoffCleanupTest {
    @Test void failedOwnedProcessCleanupStillRemovesOnlyItsHandoff() throws Exception {
        var root=Files.createTempDirectory("idea-f05-cleanup-");
        try{
            var handoff=Files.writeString(root.resolve("ready.json"),"synthetic fixture");
            var sentinel=Files.writeString(root.resolve("retained.log"),"retain");
            var expected=new AssertionError("Controlled process cleanup failure");
            var actual=assertThrows(AssertionError.class,()->TransferClientBoundaryTest.cleanupHandoff(handoff,()->{throw expected;}));
            assertSame(expected,actual);assertFalse(Files.exists(handoff));assertEquals("retain",Files.readString(sentinel));
            Files.delete(sentinel);
        }finally{Files.deleteIfExists(root.resolve("ready.json"));Files.deleteIfExists(root.resolve("retained.log"));Files.delete(root);}
    }
    @Test void successfulCleanupAlsoRemovesItsHandoff() throws Exception {
        var root=Files.createTempDirectory("idea-f05-cleanup-");
        try{
            var handoff=Files.writeString(root.resolve("ready.json"),"synthetic fixture");
            TransferClientBoundaryTest.cleanupHandoff(handoff,()->null);assertFalse(Files.exists(handoff));
        }finally{Files.deleteIfExists(root.resolve("ready.json"));Files.delete(root);}
    }
}
