package com.idea.ddm.gateway.adapter;

import java.io.*;
import java.nio.file.Path;
import java.util.UUID;

/** Private byte-custody boundary; never accepts a client filesystem path or publishes custody. */
public final class FilesystemVaultAdapter {
    public record Completed(UUID transferId, UUID locationId, long byteCount, String digest) {}
    public FilesystemVaultAdapter(Path root) throws IOException {
        throw new UnsupportedOperationException("ADAPTER_NOT_IMPLEMENTED");
    }
    public Completed store(UUID transferId, UUID locationId, long expectedBytes, String expectedDigest,
            InputStream input) throws IOException {
        throw new UnsupportedOperationException("ADAPTER_NOT_IMPLEMENTED");
    }
    public InputStream read(Completed completed) throws IOException {
        throw new UnsupportedOperationException("ADAPTER_NOT_IMPLEMENTED");
    }
}
